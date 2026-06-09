---
title: "CryptoKit AES-256-GCM in iOS apps — what is easy, what is not"
date: 2026-03-25
slug: cryptokit-aes-256-gcm-in-ios-apps
excerpt: "Apple's CryptoKit makes authenticated encryption look like a three-line API. In production it is more nuanced. Here is the practical guide for shipping it correctly."
tags: [ios, cryptokit, encryption, security, swift]
---

CryptoKit, introduced in iOS 13, makes authenticated encryption look like a three-line API. `let sealed = try AES.GCM.seal(plaintext, using: key)`. Three lines is roughly accurate for the happy path. The production reality has more depth.

Here is the practical guide for shipping AES-256-GCM correctly in an iOS app, with the gotchas the WWDC sessions do not cover.

## why AES-256-GCM specifically

Three reasons.

**It is authenticated.** AES-GCM provides both confidentiality (the encrypted data is unreadable without the key) and authenticity (any tampering with the ciphertext is detected). Plain AES-CBC, by comparison, provides only confidentiality. An attacker who can modify ciphertext can sometimes manipulate the decrypted output without being detected. AES-GCM prevents this.

**It is the iOS Secure Enclave's preferred mode.** When using hardware-backed keys, AES-GCM has the best performance on iOS. Other modes work but have additional overhead.

**It is the standard.** AES-256-GCM is what TLS uses, what disk encryption uses, what most modern cryptographic systems converge on. Using it puts you in the same boat as everyone else who has solved similar problems.

## the basic operations

Encryption:

```swift
import CryptoKit

let key = SymmetricKey(size: .bits256)  // 32 bytes random
let plaintext = "secret data".data(using: .utf8)!
let sealed = try AES.GCM.seal(plaintext, using: key)
let ciphertext = sealed.combined  // includes nonce + tag + ciphertext
```

Decryption:

```swift
let box = try AES.GCM.SealedBox(combined: ciphertext)
let decrypted = try AES.GCM.open(box, using: key)
```

The `combined` representation packs the 12-byte nonce, the variable-length ciphertext, and the 16-byte authentication tag into a single blob. This is the format to store. Do not try to roll your own framing.

## key management

The key has to come from somewhere. Three options, in increasing privacy.

**Random key per session.** Generate a new key each time, throw it away. Useful for ephemeral encryption (temp files, short-lived caches) where loss of the key is acceptable.

**Persistent key in Keychain.** Store the key in iOS Keychain with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`. The key persists across app launches, syncs across devices via iCloud Keychain (if you set the synchronizable attribute), but is unreadable by other apps.

**Hardware-backed key.** Use Secure Enclave's hardware key generation. The key never exists in memory in plaintext — only the Secure Enclave can use it. This is the strongest option but also the most constrained: the key cannot leave the device, cannot sync, cannot be backed up.

For a journaling app syncing across the user's devices, option two is the right choice. The user wants their data on iPhone, iPad, and Mac. The key needs to sync. iCloud Keychain handles this with end-to-end encryption — Apple itself cannot read the synced key.

## the nonce problem

AES-GCM requires a unique nonce (12 bytes) for every encryption with the same key. Reusing a nonce with the same key is catastrophic — it breaks both confidentiality and authenticity. An attacker who observes two ciphertexts with the same nonce can recover the XOR of the plaintexts and forge messages.

CryptoKit handles nonce generation correctly by default. `AES.GCM.seal(plaintext, using: key)` without an explicit nonce generates a fresh random nonce each time. The nonce is included in the `combined` output, so decryption recovers it correctly.

The gotcha is if you ever pass an explicit nonce — for testing, for deterministic encryption, for legacy compatibility. The temptation is to use a fixed nonce in tests for reproducibility. Do not. If your test code accidentally ships in production, you have a nonce-reuse vulnerability.

The fix is to generate explicit nonces only inside `#if DEBUG` blocks and never let them touch production code. Better, write tests that do not require deterministic encryption — assert on the decrypted output, not on the specific ciphertext bytes.

## performance

CryptoKit's AES-GCM is hardware-accelerated on every Apple device that has shipped since 2013 (it uses the ARMv8 AES instructions). Throughput is in the GB/s range for bulk encryption. For typical journaling-app sizes (entries of a few KB each), the encryption overhead is sub-millisecond and not the bottleneck.

The bottleneck, if any, is the Keychain lookup. Fetching the encryption key from Keychain has a fixed overhead of 5-20ms per call. If you encrypt many entries in a batch, cache the key in memory for the duration of the batch and pay the Keychain cost once.

```swift
// bad: fetches key from Keychain for every entry
for entry in entries {
    let key = try fetchKeyFromKeychain()  // 10ms each
    let sealed = try AES.GCM.seal(entry.data, using: key)
    // ...
}

// good: fetches once, reuses
let key = try fetchKeyFromKeychain()  // 10ms total
for entry in entries {
    let sealed = try AES.GCM.seal(entry.data, using: key)  // sub-ms each
    // ...
}
```

The "bad" version is roughly 100x slower for large batches. The fix is mechanical but easy to forget.

## error handling

`AES.GCM.open` throws if the ciphertext has been tampered with or if the wrong key is used. The error is `CryptoKitError.authenticationFailure`. Catching this error and surfacing it correctly is important — a silent failure means the user sees "your data is missing" with no explanation.

```swift
do {
    let decrypted = try AES.GCM.open(box, using: key)
    // use decrypted
} catch CryptoKitError.authenticationFailure {
    // tampered ciphertext or wrong key
    // log, report, prompt user
} catch {
    // other errors
}
```

The recovery path for `authenticationFailure` depends on the app. For a journaling app, the most likely cause is a corrupt sync record or a stale key. The right response is to refetch the record from CloudKit and try again, then if that fails, surface a "this entry could not be decrypted" state to the user.

## what is easy

The basic encrypt/decrypt loop. The nonce handling. The performance. CryptoKit's API surface is clean enough that the common path is forgiving.

## what is not

Three things.

**Key rotation.** If you ever need to rotate the encryption key (compromise, policy change, schema migration), you have to re-encrypt every stored record with the new key. There is no clean primitive for this in CryptoKit. The implementation requires a versioned key system (store which key version was used for each record, support multiple key versions simultaneously during rotation) and a background re-encryption pass.

**Forward secrecy across devices.** If you want each session's data to be unrecoverable even if the master key is later compromised, you need ephemeral keys derived per session. This requires a key derivation function (HKDF, available in CryptoKit) and careful management of ephemeral key lifecycles. Most apps do not need this and should not attempt it. For apps that do, the implementation is significant.

**Cross-platform compatibility.** If the encrypted data needs to be decryptable on Android or web, you cannot use CryptoKit alone. You need to standardise on AES-GCM with explicit parameter encoding that any platform can parse. This usually means JSON-encoded ciphertext with explicit nonce and tag fields, not the CryptoKit `combined` format. The interop work is real.

## the close

AES-256-GCM via CryptoKit is the right primitive for authenticated encryption on iOS. The basic API is clean. The production implementation requires key management, nonce discipline, error handling, and some understanding of when the easy path is enough.

For a privacy-first app, this is non-optional infrastructure. The hour or two of careful setup at the start of the project saves weeks of bug-hunting later. Get the key management right. Trust CryptoKit's defaults. Ship the encryption first and the features second.

The data is only as protected as the encryption layer. Build it carefully.
