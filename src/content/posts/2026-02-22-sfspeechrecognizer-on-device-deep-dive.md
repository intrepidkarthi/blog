---
title: "SFSpeechRecognizer deep dive — what requiresOnDeviceRecognition really gets you"
date: 2026-02-22
slug: sfspeechrecognizer-on-device-deep-dive
excerpt: "Six characters in a single property flip the entire trust model of a speech-recognition app. What you gain, what you lose, and what the API will not tell you."
tags: [ios, swift, speech-recognition, privacy, sfspeechrecognizer, on-device]
---

`request.requiresOnDeviceRecognition = true`

Six characters. The line flips the trust model of a speech-recognition app from "audio goes to Apple's servers" to "audio never leaves the device." Most tutorials mention it as an option. Most apps do not turn it on. Here is what actually changes when you do.

## the architecture

By default, SFSpeechRecognizer sends audio to Apple's speech servers. The audio travels over HTTPS, gets processed in Apple's cloud, and comes back as text. Apple's privacy policy says they do not retain it. They probably do not. Most users do not have to take that on faith because most users do not journal into their phone.

With `requiresOnDeviceRecognition = true`, the audio is processed entirely on the local Neural Engine. No network call. No cloud round-trip. The recognition model lives in `/System/Library/Assistants/`, gets installed with the OS, and runs against the audio buffer on-device.

The trust model changes from "Apple promises not to keep your audio" to "the audio never leaves the device for any party to promise anything about." For a journaling app, this is the entire game.

## what works and what does not

On-device recognition works for the major languages and the major locales. English (US/UK/AU/IN), Mandarin, Spanish, Hindi, Japanese, French, German — these all have on-device models that Apple ships and updates with iOS. Speaker-independent. Decent accuracy for clean audio.

The catch: not every locale has an on-device model. `SFSpeechRecognizer.supportsOnDeviceRecognition` returns `false` for many smaller-population locales. If your user is journaling in Marathi or Sinhala or Hawaiian, on-device may not be an option. The graceful degradation choice — fall back to cloud or refuse the locale — is yours to make. For a privacy-first app, refusing the locale is the only honest answer.

Inside English alone, the on-device accuracy is somewhere between 87% and 94% WER (word error rate) depending on accent, background noise, and microphone quality. The cloud model is 2-4 percentage points better on the same audio. That gap exists. For journaling it does not matter — the user re-reads their own entries and reconstructs intent from context. For dictating legal documents it would matter.

## latency

On-device:

```
device class      │ end-of-utterance latency
iPhone 16 Pro     │ 180-280 ms
iPhone 15         │ 240-380 ms
iPhone 13         │ 350-520 ms
iPhone SE (gen 3) │ 480-720 ms
```

Cloud:

```
device class      │ end-of-utterance latency
any device, wifi  │ 450-900 ms (depends on connection)
any device, LTE   │ 700-1400 ms
any device, 5G    │ 500-900 ms
```

On-device is faster on every device, every network. The network is the latency tax. Removing the network removes the tax.

## battery

The on-device model uses the Neural Engine, which is purpose-built and very efficient. A 30-second voice note costs roughly 0.4% of battery on an iPhone 15. The same recording sent over the network and processed in the cloud is roughly 0.6%, because the network radio is more expensive than the local compute. On-device wins on battery too.

## streaming vs file-based

SFSpeechRecognizer supports two flavors. `SFSpeechAudioBufferRecognitionRequest` streams audio buffers as they come from the mic. `SFSpeechURLRecognitionRequest` reads a finished audio file.

For a journal, the streaming version is correct. The user starts talking, the transcription appears live, the user sees it as they speak. The streaming version is also more memory-efficient because it never holds the full audio in RAM.

The trap: streaming recognition has a hard time limit of about 60 seconds per `SFSpeechRecognitionTask`. Past that, the task ends and you have to start a new one. For long entries this means stitching tasks together, handling the boundary, and dealing with the half-word at the cut. The API does not document the limit. You discover it by hitting it in production.

## the gotchas

Things that have cost me hours and are not in the WWDC slides.

- **Audio interruptions.** A call comes in mid-recording. The audio session is suspended. The recognition task does not know what happened. You have to listen for `AVAudioSession.interruptionNotification` and explicitly cancel the task.

- **Locale fallback.** If the user's locale changes mid-session (yes, this happens), the recognizer keeps using the old locale until you create a new one. Bind the recognizer to the current locale and rebuild on `NSLocale.currentLocaleDidChangeNotification`.

- **The first-use prompt.** The first time you call SFSpeechRecognizer, iOS shows a permission prompt. If the user denies it, your app is dead for transcription. The prompt copy is your responsibility — set `NSSpeechRecognitionUsageDescription` in Info.plist with a specific reason, not "to recognize speech."

- **Background processing.** On-device recognition does not run in the background by default. If the user locks the phone mid-entry, the task gets paused. You need an audio background mode and the right session category. Test with the phone locked. Most people forget.

- **Confidence scores.** Each transcription segment has a `confidence` float between 0 and 1. It is useful for highlighting uncertain words in the UI but useless as a quality gate. The model is poorly calibrated below 0.6 and the score does not correlate with actual error in ways you can use.

## what it cannot do

For all the things `SFSpeechRecognizer` does well, it does not:

- **Diarize speakers.** It does not know if one person is talking or three. For a personal journal this is fine. For meeting recordings it is a hard limit.
- **Timestamp at word level.** You get per-segment timestamps. Word-level timestamps require post-processing against the audio.
- **Detect non-speech.** Background music, breathing, laughter — all transcribed into garbled words or silently dropped. You cannot get clean "non-speech" events from this API.

For these you need a different stack. Whisper running locally via Core ML, or Apple's `SpeechAnalyzer` (newer, more capable, less battle-tested), or a third-party model. Each has its own tradeoffs.

## the bottom line

For a privacy-first journaling app on iOS, `requiresOnDeviceRecognition = true` is the line that determines whether the product can honestly claim "Data Not Collected." Everything else — transcription quality, latency, language support — is downstream of that single Boolean.

Most apps in the category do not turn it on, because the language coverage and accuracy gaps make the engineering harder. The gaps are real. The privacy benefit is the entire product.

---

→ Earlier: [from writing to speaking — the mechanics of switching journal modes](/writing/from-writing-to-speaking-journal-modes)
→ Next in this series: [Apple Intelligence vs sending it to OpenAI — the actual tradeoffs](/writing/apple-intelligence-vs-openai-tradeoffs)
