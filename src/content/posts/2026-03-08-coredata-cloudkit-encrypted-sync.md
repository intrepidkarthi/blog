---
title: "CoreData + CloudKit encrypted sync without trusting Apple"
date: 2026-03-08
slug: coredata-cloudkit-encrypted-sync
excerpt: "Syncing user data through Apple's CloudKit while ensuring Apple itself cannot read it. The architecture, the choices, and the one constraint that makes the whole thing honest."
tags: [ios, coredata, cloudkit, encryption, privacy, sync]
---

A privacy-first iOS app that syncs user data across devices has a choice. The convenient choice is to use CloudKit and trust Apple with the data. The honest choice is to use CloudKit while ensuring Apple itself cannot read the data.

The honest choice is harder but it is what "privacy-first" actually requires. If the user's encryption keys are accessible to Apple, the privacy guarantee depends on Apple's good behaviour. That is a weaker guarantee than "the data is encrypted with keys only the user holds."

Here is the architecture that does this correctly, the choices that make it work, and the one constraint that makes the whole thing honest.

## the basic architecture

The pieces:

```
1. local CoreData store      │ on the user's device, plain-text in memory
                              │ encrypted at rest via iOS file protection
                              │
2. encryption layer          │ user-controlled symmetric key
                              │ key derived from device-bound material
                              │
3. CloudKit container        │ Apple's iCloud, syncs across user's devices
                              │ stores only encrypted blobs
                              │
4. key sync                  │ keys stored in iCloud Keychain
                              │ end-to-end encrypted by Apple's existing system
```

The user's data flows through Apple's infrastructure but is never readable by Apple. The keys are managed by iOS's existing iCloud Keychain end-to-end encryption, which Apple cannot read by design.

## the encryption layer

The encryption uses AES-256-GCM with a per-user symmetric key. The key is 32 bytes. It is generated on first install on the user's primary device. It is stored in iCloud Keychain, which propagates it (encrypted) to the user's other devices via Apple's existing key sync infrastructure.

The key never appears in plain text outside the device's secure enclave or in the user's iCloud Keychain. The plaintext key is not visible to Apple, to the developer (me), or to any third party.

Every CoreData entity that contains user data has its sensitive fields encrypted before being written to the local store and decrypted on read. The encryption happens in CoreData's value transformer hooks, transparently to the rest of the application code.

## why per-user, not per-device

The temptation is to use a per-device key for simplicity. Each device generates its own key, the local data is encrypted with the local key, no cross-device key sync needed.

The problem is that per-device keys break CloudKit sync. If device A encrypts an entry with key A and device B encrypts the same entry with key B, the two encrypted blobs are different even though the plaintext is the same. CloudKit cannot deduplicate them or sync them efficiently.

The fix is one user key, synced via iCloud Keychain, used on all the user's devices. Every device encrypts and decrypts with the same key. The encrypted blobs are stable across devices. CloudKit sync works normally.

## the CloudKit container

The CloudKit container holds only the encrypted blobs. The schema is minimal:

```
record type    │ EncryptedEntry
fields         │ - id (UUID, plaintext)
                │ - createdAt (timestamp, plaintext)
                │ - updatedAt (timestamp, plaintext)
                │ - ciphertext (Data, encrypted)
                │ - nonce (Data, plaintext)
                │ - schema_version (Int, plaintext)
```

Only `ciphertext` contains user data, and `ciphertext` is encrypted with the per-user key that Apple cannot read. The other fields are metadata (when was this created, what schema version was it written with) that Apple can see but that does not reveal user content.

CloudKit's sync logic operates on the encrypted blobs as opaque data. The sync works the same as it would for plaintext data. Apple's infrastructure performs sync, conflict resolution, and propagation without ever decrypting.

## the key sync

The per-user key is stored in iCloud Keychain. Apple's iCloud Keychain is end-to-end encrypted — the user's iCloud password, the user's device passcode, and the user's biometric authentication all contribute to a derivation that produces a key Apple itself cannot reconstruct.

The journal app's per-user encryption key is stored in iCloud Keychain via the standard `kSecAttrSynchronizable` attribute. When the user signs into a new device with the same iCloud account, the keychain item syncs. The new device can decrypt the CloudKit data. Apple's servers never see the plaintext key.

This is the part of the architecture that depends on Apple's own privacy guarantees. The iCloud Keychain's end-to-end encryption has been independently audited and is documented in Apple's platform security guide. The dependency is real but is at the strongest point in Apple's privacy story.

## conflict resolution

When two devices edit the same entry offline and both push, CloudKit produces a conflict. The default conflict resolution is "last write wins," which can silently lose user edits.

The honest design is to detect conflicts and surface them to the user. The user picks which version to keep, or manually merges. The decision is theirs, not the system's.

The implementation: a CKModifyRecordsOperation with `serverRecordChanged` errors handled explicitly. When a conflict is detected, the app stores both versions locally (with a `_conflict` suffix on the local key) and shows a UI prompt next time the user opens the entry.

This is more complicated than "let CloudKit pick." It is also the only honest answer. Journal entries are valuable enough that silent loss is worse than user-visible conflict resolution.

## the one constraint that makes it honest

The architecture above produces a system where the data is encrypted with user-held keys that Apple cannot read. This is necessary but not sufficient for "private by design."

The sufficient condition is: **the app must not include any code path that bypasses the encryption**. No "premium" feature that uploads the plaintext to a cloud service for "advanced analysis." No "backup to email" that sends plaintext attachments. No "share with researcher" feature that exfiltrates raw data.

Every piece of user data leaves the app only through the encrypted CloudKit sync. Every other code path that processes user data does so on-device, with the plaintext never leaving memory.

This constraint is the part most apps violate. They build the encryption correctly. They then add a feature that bypasses it. The bypass invalidates the privacy guarantee.

The architecture is only as private as the most permissive code path in the app. Eliminate the permissive code paths or the architecture is decoration.

## the gotchas

Three production issues that took me hours each.

**Per-record encryption is slow.** Encrypting every CoreData record on write adds 10-30ms per record. For batch operations (importing a large existing archive), this is noticeable. The fix is to batch the encryption in a background queue and write to CoreData in chunks.

**iCloud Keychain sync delays.** The key takes 30 seconds to a few minutes to propagate to a new device. Until it arrives, the new device cannot decrypt the synced data. The UX needs to handle "I am syncing but I don't have the key yet" gracefully — show a "syncing" state, not an error.

**Schema migrations require careful handling.** When the schema changes, the new version needs to decrypt records written by the old version. Schema-version metadata is stored in plaintext (it has to be, to enable correct decryption). Schema migration logic has to handle each historical version.

## the close

CoreData + CloudKit encrypted sync is the right architecture for a privacy-first iOS app. The implementation is harder than the unencrypted version but the privacy guarantee is structural — the data is unreadable by Apple by design, not by policy.

The implementation effort: about 3-4 weeks of focused engineering for a competent iOS developer. The ongoing maintenance: minimal once it is working.

For an app where the privacy is the value proposition, this work is non-optional. For an app where the privacy is marketing copy, the work would not be done. The choice you make about whether to do this work is the choice you make about whether your app's privacy is real.

If it is real, build it like this. If it is not, do not claim it is.
