---
title: "my voice journal will not speak tamil"
date: 2026-08-10
slug: ios-on-device-language-support-speech-vs-embeddings
excerpt: "Apple's Speech framework handles 34 languages. DailyVox ships its interface in five. The binding constraint on an on-device multilingual app is sentence embeddings, not speech recognition, and Apple ships those for five languages and no more. Tamil is unreachable, and I stopped calling it deferred."
tags: [dailyvox, on-device, ios, nlp, localization, apple-intelligence, privacy]
---

Apple's Speech framework transcribes 34 languages. DailyVox now ships its interface in five of them. The gap between those numbers is a platform limit, and working out why cost me the language I grew up speaking.

The roadmap had carried a language list for months: Tamil, Kannada, Hindi, Spanish, Japanese, German. I wrote that list from intent. It was ordered by who I wanted to reach, starting with home. Last week I finally measured what each Apple framework actually supports, per framework, rather than trusting the marketing number for the stack as a whole.

```
framework                       languages
──────────────────────────────────────────
SFSpeechRecognizer                     34
NLTagger sentiment                     34
AVSpeechSynthesisVoice                 33
SpeechTranscriber (iOS 26+)            10
NLEmbedding sentence vectors            5   ← the floor
```

Speech, sentiment and synthesis all sit in the thirties. `SpeechTranscriber` at 10 is fine, because the older recognizer covers everything it misses. The bottom row is the one that decides what ships.

## the floor is the embedding table

DailyVox's Twin remembers by meaning. When you ask it something in your own words, it doesn't grep your entries for keywords. It embeds the question, embeds every sentence you've written, and finds the ones that actually match. That shipped in v1.6 as semantic memory, and it's the thing that makes the Twin feel like it knows you rather than like it has an index of you.

Sentence embeddings on-device come from `NLEmbedding`. Apple provides sentence vectors for English, Spanish, French, German and Italian. Five. Not thirty-four.

So the arithmetic runs the wrong way from the direction everyone assumes. Transcription was never the bottleneck. If I localise the interface into a sixth language, I ship a Spanish-shaped promise to someone whose Twin will quietly return nothing when they ask it a question. The recording works, the transcript works, the sentiment and the read-aloud both work. Then the one feature the whole app is built around comes back empty, in a language where I have no way to explain why.

Shipping that is advertising a capability that isn't there.

Spanish, French, German and Italian shipped: 358 translatable strings, informal register throughout (tú, tu, du, tu), because the app talks to you like a person and not like a bank. The app had no localization at all before this. No String Catalog, no `.lproj` directories, and `knownRegions` declaring `es` and `hi` with no files behind either, which is a claim the project had been making to itself for a year. String extraction was switched off in the build settings, which is why no catalog had ever been generated. App size unchanged at 20 MB.

## tamil is out

Neither Speech API supports Tamil. Not `SFSpeechRecognizer`, not `SpeechTranscriber`. For a text app that would be an inconvenience. For a voice journal it's the front door.

Kannada, the same. Hindi is legacy `SFSpeechRecognizer` only, absent from `SpeechTranscriber` entirely, with no embeddings behind it. Japanese has the new transcriber and no embeddings. Both of those sit in a tier that ships only if I decide degraded semantic search is acceptable, and I haven't decided that.

I'm from Madurai. I have written a diary for twenty years, and a fair amount of what's in those pages would come out in Tamil if I were speaking it rather than writing it. I built a voice journal, on the platform I chose, and it cannot hear my mother tongue. No amount of my own work moves that. It's a dependency I don't control, sitting underneath a product decision I do.

So the roadmap now marks Tamil and Kannada out. Marking something "coming soon" when the platform underneath it offers no path is a promise you've quietly handed to someone else to keep.

One thing worth being precise about, because the distinction matters to anyone already using the app: nobody was locked out in the meantime, and nobody is locked out now. Transcription has always followed `Locale.current` on both paths, so journaling in any of the 34 has worked since v1.0. This release changed the *interface* language. The pipeline was never the part lagging behind.

## the other kind of locked out

v1.9 shipped on 31 July and most of it was accessibility, which is the same problem wearing different clothes.

138 places in the app used a fixed font size and ignored Accessibility → Display & Text Size completely. Thirty-five of those were smaller than Apple's own 11pt minimum, so this was never only a large-text fix. A quarter of them were illegible to everyone, and nobody had said so.

The constellation on the Twin screen was worse. The labels are the names and topics drawn from your own entries, the part that makes the visualisation yours rather than decorative. They rendered at 9pt and 30% opacity, measuring 2.5:1 against the dark card. Effectively invisible. They're at 8.75:1 now. The Twin Resolution ring, which exists to show you a single number, was pure geometry with no accessibility value, so VoiceOver read the entire point of the card as silence.

I shipped that ring in v1.5 and wrote a post about measuring the Twin honestly. It took two months and a deliberate audit to notice it said nothing at all to a blind user.

## the gate that says no

The other half of v1.10 was voice cloning, and it's the piece I most wanted to ship.

v1.9 dropped Apple's Personal Voice: it carries a real accent, and it costs a thirty-minute enrollment that the app cannot perform on the user's behalf. On 28 July, Kyutai's Pocket TTS reproduced my voice from a 30-second slice of journal audio I had already recorded. No enrollment, nothing asked of the user. Every previous attempt had failed on accent. An Indian-English voice would come back sounding like an American reading my sentences. This one I confirmed by ear.

Then I confirmed it properly and it died. A forced-choice blind test against real recordings of me, with sample rate and loudness matched and the text held out from the conditioning window, and I picked the real clip eight times out of eight. The memory gate failed separately, by a factor of four. That one has [its own post](/writing/voice-cloning-blind-test-on-device-ios/), because the interesting part is the ordering mistake rather than the model.

What belongs here is the harness that was built to answer the memory question, because the same rule settled the language list.

Before Pocket TTS, chatterbox-turbo was projected to fit inside the app's memory budget. Measured, it peaked at 953.7 MB against a ceiling of roughly 250. Projection and measurement disagreed by nearly a factor of four, in the direction that gets a process killed.

So there's now a memory harness in the app, DEBUG-only, and the rule is that a candidate ships on a measured peak or it doesn't ship. It reads `phys_footprint` from `TASK_VM_INFO`, which is the figure jetsam actually bills a process for, plus the kernel's lifetime high-water mark and the headroom left to the limit. Resident size is deliberately not used, because it omits compressed pages and would flatter every reading.

Every result carries a confidence. The kernel's high-water mark can't be reset from user space, so a workload that stays under a mark set earlier in the process's life leaves the ledger untouched. A reading like that is a lower bound rather than a peak, and gets reported as one. Only when the ledger moves is the reading exact.

And the calibration path allocates a known volume of *incompressible* bytes. Zero-filled pages compress to almost nothing, so a naive calibration would confirm the harness works while reporting a wildly optimistic figure. If a known 250 MB doesn't read back as roughly 250 MB, nothing the harness says about a model is worth acting on.

The measurement runs inside the full app rather than in a bare test harness, because jetsam bills the whole process. A model measured alone reports a number the app can never achieve.

## the close

Three claims in two weeks. The language list lost four entries when I measured it, including the one I cared about most. The Twin's own signature screen turned out to be unreadable at 2.5:1, and I was the one who shipped it that way. And the voice clone, the piece I most wanted in the app, lost to my own ear eight times out of eight.

None of that is a good fortnight by the usual standard. It is the standard I'd rather be held to. The alternative is a Tamil interface sitting over a Twin that can't answer in Tamil, or a cloned voice the user clocks as fake on the first reply, and both of those cost them something while costing me nothing until they find out.

Measure it on the device, then decide what to promise.
