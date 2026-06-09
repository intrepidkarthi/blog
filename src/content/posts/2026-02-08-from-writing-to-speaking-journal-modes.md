---
title: "from writing to speaking — the mechanics of switching journal modes"
date: 2026-02-08
slug: from-writing-to-speaking-journal-modes
excerpt: "Twenty years of writing a daily diary, then six weeks of silence, then voice notes. What you gain and what you lose when you switch from typing to talking."
tags: [journaling, voice, habits, ios, product]
---

I have written a daily journal for twenty years. In November 2025 the habit broke. Not catastrophically — just six weeks of opened-the-app-closed-the-app, like the apps I have been writing about. I started thinking the problem was me. Then I tried something I had dismissed for two decades.

I started talking instead.

## the bandwidth difference

Typing on a phone is roughly 30 words per minute. Speaking is roughly 150. The five-to-one bandwidth gap is what makes the transition feel like cheating.

```
mode          │ wpm     │ friction          │ what you produce
typing phone  │ 25-35   │ medium-high       │ short, edited, hedged
typing laptop │ 50-80   │ medium            │ structured, edited
writing hand  │ 15-25   │ low-medium        │ slower, more reflective
speaking      │ 120-180 │ near-zero         │ longer, less edited, more honest
```

The "more honest" line is the part that matters. When you type, you self-edit on the way out. Word choice, sentence structure, the politeness filter — all running in real time. When you speak you do not have time. The thought leaves your head and lands on the recording. You hear yourself saying things you would not have written.

## what you gain

**Spontaneity.** You can journal in the car. On a walk. While cooking. The activity that was "sit down at the desk" is now "press a button and talk." The threshold to start dropped by an order of magnitude.

**Less curation.** Writing a journal entry feels like writing for an audience even when there is no audience. Speaking feels more like thinking out loud. The voice notes I made in the first month had things in them I would never have written down — not because they were embarrassing but because they would have felt overdramatic on paper. Spoken, they were just observations.

**Better emotional fidelity.** Tone of voice carries data that text cannot. Listening to a voice note from three weeks ago, I can hear when I was tired, when I was rushed, when something was actually bothering me. The transcription loses this. The audio keeps it.

## what you lose

**You cannot reread quickly.** Reading 200 words takes 30 seconds. Listening to a 200-word voice note takes 90 seconds at normal speed, 45 at 2x. Re-listening to find a specific thing is brutal.

**You cannot edit.** A spoken entry is what it is. You can append but you cannot revise. The journal-as-thinking-tool aspect of writing — where the act of rephrasing improves the thought — is mostly lost when speaking. You get to capture the thought once, in whatever shape it arrived in.

**You cannot scan.** Open a written journal to any page, your eye picks up structure in two seconds. Open a list of audio files, you see only filenames and durations. Scanning is impossible without transcription, which is the next problem.

## the iPhone Voice Memos failure

The first three weeks of voice journaling, I used iPhone Voice Memos. It is the obvious first attempt. It is also a complete failure as a journaling tool, for reasons that took me longer to articulate than they should have.

Voice Memos is designed for *capture*, not *journaling*. The implications:

- Files are named by timestamp by default. After 40 entries you have 40 files called "Recording 2025-12-15 14:23." There is no way to find anything.
- Transcription exists but is non-searchable, off by default, and only runs on demand.
- There is no concept of a journal entry. Each recording is an audio file in a flat list.
- iCloud sync exists but the files are large and the sync is slow.
- Sharing is built around exporting the file, not around revisiting it.

After a month I had 60-something voice memos and no way to use them. The capture habit had stuck. The journaling part was broken.

## what a voice journal actually needs

The list is short and most of it is not glamorous engineering.

```
capture          │ one-tap start, automatic file naming by topic
transcription    │ on-device, automatic, searchable
extraction       │ named entities, sentiment, topic tags
retrieval        │ filter by mood / topic / person / date
review           │ weekly digest, monthly summary
privacy          │ everything stays on the device
```

Each is a known engineering problem. Doing them well together is the actual work. Apple ships every primitive — SFSpeechRecognizer for transcription, NLTagger for entity and sentiment, CoreData for storage, CryptoKit for encryption. The assembly is the product. More on the technical stack in the next two posts.

## the practical takeaway

If you have been failing at a written journal habit, try voice for thirty days. Use any voice memo app to capture. Do not worry about retrieval yet. The first thing to find out is whether the capture habit will stick. For most people who failed at written journaling, voice sticks immediately because it removes the friction that was killing the written attempt.

After thirty days the question becomes what to do with sixty audio files. By then you have proven the habit is working and the retrieval problem is worth solving.

That is roughly when I started building.

---

→ Earlier: [why journaling apps die after 60 days](/writing/why-journaling-apps-die-after-60-days)
→ Next in this series: [SFSpeechRecognizer deep dive — what requiresOnDeviceRecognition really gets you](/writing/sfspeechrecognizer-on-device-deep-dive)
