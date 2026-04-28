---
title: "Norton Ninja — security suite for your Android"
date: 2011-07-20
slug: norton-ninja-security-suite-for-your-android
excerpt: "Notes on Norton Ninja, the Android security suite I'm working on at Symantec. The threat list is growing fast — premium-rate SMS Trojans, Bluetooth auto-pair attacks, SD-card payloads, contact-list exfiltration. The mantra: whatever the enemy is, we have to win at last."
tags: [symantec, norton, android, security, mobile, ninja]
---

The name **Ninja** comes from the ancient martial art from Japan, specializing in unorthodox arts of war. When Ubuntu and Android follow a legacy on naming, then why not we? Let us follow our own legacy of naming on fighting against enemies.

Yes, we are fighting against enemies in cloud and mobile battle field. Here enemy can come from any direction and in any form. But our ultimate aim is to **protect our identity and destruct enemy**. Our mantra is *"Whatever / whoever the enemy is, we have to win at last"*.

Malicious action on your mobile can be:

- sending out spam messages to all the contacts in your mobile
- transferring your mobile personal details and also details about other apps
- calling your friend anonymously
- finding and sending your exact location data
- activating and transferring data via Bluetooth automatically
- infecting your SD card
- hiding / deleting / encrypting your data

**Ninja faces all sort these threats for you and protects you from them.**

## what we are actually building

Norton Ninja is an Android security suite — part of the work happening on the Norton Mobile team at [Symantec](https://www.symantec.com), where I joined a few months ago. The product brief, in plain language:

A mobile anti-malware suite for Android that combines:

1. **App-permission scanning.** A static scan of installed apps' manifest permissions, flagged against a heuristics-and-signature database for known malware patterns. The Android permission model is install-time-only and granular flagging is the user's responsibility — most users tap *Accept* on everything. Ninja does the flagging the OS doesn't.

2. **SMS / call abuse detection.** Runtime monitors for outbound SMS storms, premium-rate numbers, and silent calls — the typical exfil patterns of the toll-fraud Trojans we are seeing in the wild this year.

3. **Bluetooth / SD-card hygiene.** Detection of automatic Bluetooth pairing attempts and SD-card-resident payload behaviour, both still common attack vectors when Wi-Fi side-loading isn't an option.

4. **Identity protection.** A "what's exfiltrating my contacts list?" tracker, plus a remote-wipe and locate-my-device flow.

## why this market exists right now

Three things are happening at once in 2011 that didn't quite line up before:

**Android malware just became economically viable.** Premium-rate SMS Trojans are the first really profitable Android attack — a single infected phone nets the attacker a few dollars a day in toll fraud, multiplied by tens of thousands of phones in the cohorts who don't read SMS confirmation prompts in their language. The unit economics are finally there. So, predictably, the Trojans are arriving.

**The Android permission model is a sieve.** All permissions are requested at install time, presented as a list. Users tap *Accept* on everything because there is no granular choice yet. Until Google fixes the permission model at the OS layer, the user gets defended by the OS or by a third-party app. We are betting on the second one.

**Google Play scanning is nascent.** Google's own automated scanning system — internally called Bouncer — is not yet public. Until it ships, Play Store apps are not automatically scanned for malware. Sideloaded APKs mostly never are. Defensive layer from the platform: vibes.

So a third-party security suite has real work to do. Norton's bet — and Norton Ninja's whole pitch — is that the Android user needs an additional defensive layer until the platform catches up. Whether that window closes in two years or five years is the question we don't know the answer to. Ship for the window we have.

## what working on this teaches you

Three things, one paragraph each.

**Threat modelling is the discipline that pays.** Before you write a line of detection code, write down what the attacker is trying to do, what they need to do it, and where in the chain you can interrupt them. Most security work is the same exercise at a different altitude. The artifact is a threat model. Everything else is implementation.

**Static rules age fast; behavior models age slower.** Signature-based detection breaks the moment malware authors start obfuscating manifests — and they're already doing it. Behavior-based detection (outbound SMS rate, contact-list read frequency, Bluetooth pairing entropy) holds up much longer. The pattern of activity is more durable than the fingerprint of the artifact.

**Mobile is a different machine.** Android isn't a small Linux machine; it's a different machine with different threat surface, different battery constraints, different IPC model, different storage model. I've spent the last few months mostly learning to *think as the phone*, not as the laptop. The mobile machine has its own rules.

## what's next

More detection rules. More threat-feed plumbing. The Android malware roster is doubling roughly every quarter; the engineering side of this team is, as of this week, mostly feeding the signature pipeline. We are also experimenting with light behavior-graph models on-device, but the battery cost is the constraint.

If you have an Android phone and you don't have anything installed protecting it: pay attention to which apps you grant SMS-send permission to. That alone closes most of the toll-fraud surface area.

More on this as we ship.

— Karthikeyan
Norton Mobile · Symantec
