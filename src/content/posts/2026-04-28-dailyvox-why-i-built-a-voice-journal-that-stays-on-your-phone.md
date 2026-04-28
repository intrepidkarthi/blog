---
title: "DailyVox: Why I Built a Voice Journal That Stays on Your Phone"
date: 2026-04-28
slug: dailyvox-why-i-built-a-voice-journal-that-stays-on-your-phone
excerpt: "I have been writing a diary for 20 years. When the habit started slipping, I switched to voice notes. That experiment turned into DailyVox."
tags: [ios, ai, privacy, dailyvox, product]
---

I have been writing a diary for over 20 years. Almost every day, for a very long time, I sat down and wrote about my day. Then it got hard. Not in some dramatic way — I just started missing days. One day. Then two. Then a whole week.

I tried different apps, different formats. Nothing stuck. Writing every day had become a chore, and when something becomes a chore, you stop doing it.

Then I tried speaking instead of writing. Started storing voice notes on my iPhone for a few months. And it worked. Speaking felt natural. You don't need to sit down, open an app, and type. You just talk. In the car, on a walk, before bed.

But there was a problem. Voice notes scattered across your phone are useless for reflection. You can't search them. You can't see patterns. You can't ask "what was I stressed about last month?" without listening to hours of audio.

That's why I built [DailyVox](https://getdailyvox.com).

### The Core Idea

DailyVox is a voice journaling app that transcribes your entries on-device, analyses them using Apple's native AI frameworks, and builds a personality model — what I call a "Twin" — that understands your communication patterns, emotional signatures, and personal knowledge over time.

The key constraint I set from day one: **your data never leaves your phone for processing.** Not to my servers, not to OpenAI, not to anyone. Everything runs locally.

### Why Privacy-First Isn't Just Marketing

When you journal honestly, you talk about things you would never post anywhere. Health issues, relationship problems, financial stress, career frustrations. This is the most intimate data a person can generate.

Most AI-powered journal apps send your entries to cloud APIs for processing. That means your deepest thoughts sit on someone else's server, subject to their privacy policy, their security practices, and whatever future acquirer decides to do with that data.

I didn't want that trade-off. If the AI isn't good enough to run on-device, then it shouldn't run at all.

### The Technical Stack

DailyVox uses nine Apple frameworks with zero third-party dependencies for AI processing:

- **SFSpeechRecognizer** for on-device transcription with `requiresOnDeviceRecognition = true`
- **NLTagger** for sentiment analysis, named entity recognition, and part-of-speech tagging
- **Core Data + CloudKit** for encrypted local storage with optional iCloud sync
- **CryptoKit** implementing AES-256-GCM authenticated encryption
- **LocalAuthentication** for biometric security (Face ID / Touch ID)
- **WidgetKit** and **AppIntents** for home screen widgets and Siri integration

The app carries Apple's strictest privacy classification: "Data Not Collected."

### The TwinEngine

This is the part I'm most excited about. The TwinEngine builds a personality model from your journal entries over time. It tracks:

- **Communication style** — how you express yourself, your vocabulary patterns, sentence structure
- **Emotional patterns** — what triggers stress, what brings joy, seasonal mood shifts
- **Personal relationships** — who you talk about most, the context around those relationships
- **Knowledge graph** — topics you're interested in, expertise areas, evolving interests

The longer you use it, the better it understands you. Think of it as a mirror that shows you patterns you can't see yourself.

### What's Next

For v2.0, I'm working on:

- **Foundation Models integration** for conversational AI — so you can ask your Twin questions like "what was I worried about in January?"
- **Semantic search** via embeddings — find entries by meaning, not just keywords
- **LoRA fine-tuning** for personalised voice adaptation

### The Ultimate Aim

The long-term vision for DailyVox is simple: become the most trusted personal AI — one that knows you deeply but never shares that knowledge with anyone else. Not an assistant that serves a corporation's interests, but a personal tool that serves yours.

I believe the next wave of AI products won't be about sending more data to the cloud. It will be about making on-device AI good enough that you don't have to. Apple is investing heavily in this direction, and DailyVox is built to ride that wave.

The codebase is open source on GitHub for public audit. If you care about privacy, you shouldn't have to take my word for it — you should be able to verify it yourself.

Try it out at [getdailyvox.com](https://getdailyvox.com).
