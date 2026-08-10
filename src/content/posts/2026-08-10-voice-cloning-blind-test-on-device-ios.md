---
title: "8 out of 8: the blind test that closed my voice cloning feature"
date: 2026-08-10
slug: voice-cloning-blind-test-on-device-ios
excerpt: "I spent two weeks on runtime engineering for on-device voice cloning, then ran a one-hour forced-choice blind test against real recordings and scored 8/8 identifying the fake. p = 0.0039. Every ear test before it had compared two synthetic clips to each other, which tells you which is less bad and never whether either is good."
tags: [dailyvox, on-device, ios, tts, voice-cloning, evaluation, machine-learning]
---

Eight forced-choice trials. Each one played the same sentence twice, once a real recording of me and once a cloned synthetic speaking the same words. I picked the real one eight times out of eight.

Under a coin-flip null that's p = 0.0039. A result that clean turns up by luck about four times in a thousand.

The test took about an hour to build and run. It settled a question that two weeks of runtime engineering had not touched, and it closed a feature I badly wanted to ship.

## what I was building

DailyVox v1.10 carried a candidate called "your own voice." The Twin reads its replies aloud, and instead of a system voice it would use yours, cloned from a 30-second slice of journal audio you had already recorded.

The product shape is the whole appeal. Apple's Personal Voice reproduces a real accent, and it costs a thirty-minute enrollment session that the app cannot perform on the user's behalf. v1.9 dropped it for exactly that reason and shipped a system-voice picker instead. Cloning from audio the user already gave you asks for nothing. No enrollment screen, no reading of scripted sentences, no new permission.

On 28 July a spike appeared to do it. Kyutai's Pocket TTS, 109.5M parameters, autoregressive, produced something I recognised as my own voice from 30 seconds of my own journal audio.

Autoregressive is the part that mattered. Accent lives in phone realisation and phonemic choice, and both are sequential: how you land the second syllable depends on how you landed the first. Non-autoregressive models transfer timbre and lose the accent, which is what OpenVoice had been doing to me for weeks. An Indian-English reference kept coming back as an American reading my sentences.

The unlock was mundane. Normalise the reference clip to peak 1.0 before conditioning, and use the full 30 seconds the model accepts. Without normalisation the conditioning was too quiet and the accent washed out.

I listened to it, and I approved it.

## the error in that approval

The approval was relative and I recorded it as though it were absolute.

What I had actually established on 28 July was that Pocket TTS beat OpenVoice and beat MOSS-TTS-Nano. Every ear test in the program up to that point had compared one synthetic clip against another synthetic clip. That comparison answers exactly one question, which is which of these is less bad. It cannot tell you whether any of them is good, because nothing in the set is the reference.

There was never a demonstrated bar for Pocket TTS to clear. I then built two weeks of runtime engineering on top of a judgement that had no floor under it.

## the test I should have run first

Forced choice, two clips per trial, pick the real one. Eight trials.

The design work is all in removing the tells that have nothing to do with voice.

Sample rate matched at 22050 Hz across both clips. RMS loudness matched at 0.0800. Clip length matched. If you skip those, you are not testing whether a listener can hear a synthetic voice. You are testing whether they can hear a resampling artifact or a quieter file, and they will score 8/8 on that too while telling you nothing.

The words had to match as well, so each trial says the same sentence twice. Whisper transcribed the real slice, and the synthesiser was given that transcript.

Then the leakage problem. If the clip I'm testing against overlaps the 30 seconds the model was conditioned on, the model is reciting rather than generalising, and a good score means nothing. So the conditioning reference was located inside the source recording by cross-correlation. It sits at 92.0 to 122.0 seconds of a 224.2-second recording. Trials 3 through 8 drew exclusively on audio outside that window.

Slots randomised, answer key written out before I listened.

Eight out of eight.

I want to be precise about what that result does and does not say. It does not say the clone is bad in some absolute sense, and it does not say a naive listener would catch it. It says one listener who knows the target voice extremely well, under matched format conditions, on held-out text, separated real from synthetic every single time. For a feature whose entire proposition is "this is your voice," that listener is the customer.

## the memory gate failed on its own

The second gate failed independently, and it failed the same way the last one did.

iOS kills foreground apps that exceed a per-process footprint that jetsam enforces. On a 6 GB iPhone that ceiling sits around 250 MB. Older 4 GB devices are nearer 200.

Here is the projection I had written down for the INT8 synthesis path, encoder unloaded:

```
component                        estimated RSS
──────────────────────────────────────────────
lm_main.int8.onnx                      ~76 MB
lm_flow.int8.onnx                      ~10 MB
decoder.int8.onnx                      ~23 MB
text_conditioner.onnx                  ~16 MB
KV cache                               ~18 MB
voice state                             ~4 MB
ONNX Runtime overhead                  ~10 MB
audio output buffer                     ~2 MB
──────────────────────────────────────────────
projected peak                        ~159 MB
headroom against 250 MB                ~91 MB
```

Measured:

```
runtime                     after load        peak
──────────────────────────────────────────────────
sherpa-onnx INT8                377 MB      685 MB
FluidAudio (Core ML, int8)      271 MB      957 MB
```

The projection was wrong by about 4.3x, in the direction that gets a process killed. Model load alone, before a single frame of synthesis, already exceeded the whole budget.

This is the second time. chatterbox-turbo was projected to fit and measured 953.7 MB against the same ceiling. Every projection in this program has erred the same way, and I no longer think that's coincidence. A projection sums the parts you thought of. Arena allocators, transient buffers during graph execution, and runtime overhead that scales with the graph rather than the weights are all things you find by measuring.

Worth noting what these numbers are not: they came from a desktop proxy, not from an iPhone. The device measurement never ran, because the ear result closed the path first.

## what got thrown away

The optimisation work was correct and it was aimed at the wrong question.

INT8 dynamic quantisation took the model from roughly 400 MB to a 126 MB synthesis path, about 4x, with the quality loss that TTS tolerates and ASR does not. The Mimi encoder, 72.7 MB, is needed exactly once to turn the reference clip into a voice state, so it unloads from memory and deletes from disk after enrollment. The resulting voice state caches to a ~4 MB safetensors file, so every later launch skips the encoder entirely. Two CPU threads rather than all cores, because the model is sequential per frame and extra threads buy thread-local buffers and UI jank. Flow-matching at two ODE steps. A streaming callback putting first audio at roughly 200 ms.

All of that is good engineering. None of it was ever going to fix the thing that was wrong.

The Swift integration went further and was worse. A bridging header, a sherpa-onnx wrapper, a model manager, a voice service. It never compiled, because it referenced C symbols with no library behind them and I had not yet built sherpa-onnx for iOS arm64. I deleted it on closure. The iOS build never started, and it is now unnecessary.

There's a licensing thread left half-pulled too. The spike ran on an unlicensed mirror of a January checkpoint. The k2-fsa INT8 repository is ungated and ships a LICENSE file, which is better, but I never walked the commercial-use chain to the end because the path closed underneath it.

## the ordering was the whole mistake

Two weeks of runtime spikes across three implementations. One hour for the test that decided it.

The gates I had written down were memory, then licensing, then real-format validation. Every one of them is a question about whether I *can* ship it. Not one of them asked whether I *should*, and that question was cheaper to answer than any of the others.

So there's a new gate zero, and it goes first: a forced-choice real-versus-synthetic blind test, format tells controlled, run before any integration work. If a candidate can't survive an hour of that, nothing downstream matters.

The harness is reusable and it's the artifact worth keeping from all of this. Slice held-out segments out of a source recording, transcribe each with whisper, synthesise the same words, match RMS and sample rate, randomise the slots, emit an answer key. sherpa-onnx is still the best runtime I found and the plumbing is proven in Python, so a future candidate can be ear-tested in about an hour without opening Xcode. The blocker was never the runtime. It was the model.

## what ships

Nothing changes for anyone using the app. v1.9's system-voice picker stays, with the accent approximated rather than reproduced, and Settings lists regional voices first so you can pick whichever sounds closest to you.

v1.10's actual content is Multi-Language, and it's untouched. Voice was listed on that release as a gated candidate, never as the release itself, which is the one piece of planning discipline here that paid off. A gated candidate can fail its gate without taking a release down with it.

I'd rather write this than ship a voice that a user's own ear rejects on the first reply. But I'd much rather have spent the hour first.
