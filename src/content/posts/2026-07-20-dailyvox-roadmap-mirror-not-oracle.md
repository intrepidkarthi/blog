---
title: "a twin that refuses to predict your future — where DailyVox is, and where it's going"
date: 2026-07-20
slug: dailyvox-roadmap-mirror-not-oracle
excerpt: "DailyVox builds a model of one person from their own journal, on their phone. It measurably fails at forecasting their mood — and that failure is the product boundary, not a bug. Where the build is, and where it's headed."
tags: [dailyvox, on-device, ai, digital-twin, privacy, roadmap, evaluation]
---

Most AI products are sold on prediction. Tell us about yourself and we will tell you what happens next.

DailyVox does the opposite. It builds a model of one person — you — from your own journal entries, entirely on your phone, and then it refuses to predict your future. Not because it can't attempt the trick. Because we tested whether the attempt works, and it doesn't. So we cut it.

That decision is the whole design. This is where the build is, how I know it works, and the stages ahead.

## mirror, not oracle

The Twin is a model of one life. The training set is one person's entries. It runs on the device, it deepens over years, and it belongs to the user — exportable and deletable.

Two words govern every decision: mirror, not oracle.

A mirror reflects the person who showed up in what they chose to record. Attitudes, style, patterns, precedent. It does not forecast tomorrow's mood. For a long time that was a slogan. Now it is a measured boundary.

I built a forecasting test into the evaluation harness — a chronological split, train on the early entries, score on the later ones — and asked a plain question: can the Twin beat a dumb baseline that guesses "tomorrow will feel roughly like today"? It cannot. The Twin loses to persistence, badly. This matches the affect-forecasting literature, which has known for years that people are poor at predicting their own emotional states.

The honest move was to let the negative result set the product boundary. DailyVox does not claim to predict your mood, because the number says it shouldn't. What it does instead is reflect: this is how you tend to write in the evening, this is the person who keeps reappearing in your entries, this is the trajectory of the last thirty days. Precedent, not prophecy.

## how you test a model of one

A model of one has no test set. You can't hold out other people. So the measurement doctrine has to be strict, and the first rule is the one that kills vanity metrics.

Every trait in the Twin starts at 0.5 and moves toward the evidence. A Twin that does nothing at all — never updates — still agrees with a synthetic ground truth about 75% of the time, purely because half-way is a decent guess for a bounded score. So 75% means nothing. No number counts unless it is lift over an explicit baseline, plus a correlation showing the Twin actually tracks the person as they change.

Held to that bar, three results matter.

```
test                    what it asks                         result
──────────────────────────────────────────────────────────────────────
fidelity        does it beat the do-nothing baseline?    yes, clear lift
forecasting     can it predict mood better than          no — mirror,
                "tomorrow ≈ today"?                        not oracle
groundedness    does every answer trace to real          100% of claims
                journal-derived state, or does it          tie back to
                make things up?                            actual state
```

The groundedness one is the number I care about most. When the Twin answers a question about you, every claim it makes has to trace back to something in your own entries. I parsed every answer the system can produce and checked. All of them tie to real state. A journal that invents things about you is worse than no journal.

One caveat sits on top of all of it, and I won't bury it: these numbers come from synthetic data — personas written to known specifications. Synthetic corpora prove the pipeline works, prove it survives a change of writing style, prove it collapses to noise when you shuffle the labels. They do not prove human accuracy. That validation — against real diaries, with the writer's own self-report as ground truth — is the gated next step, and it's the single biggest open question in the whole project. I'd rather say that plainly than ship a confident wrong number.

## what shipped because it passed

The Twin grows in stages, and each stage ships only when it can be made honest.

The first stage is words. The Twin reads what you write — communication style, emotional signature, thought patterns, a knowledge graph of the people, places and topics in your life, and your behavioural rhythms. All of it computed on the device, none of it leaving it. This is live.

The second stage gives the Twin a body. It reads physiological context from HealthKit — sleep, resting heart rate, heart-rate variability, steps — and folds it in as a fifth layer, so the Twin can tell a rough day from a rough night. The engineering that mattered here was not the health reads. It was the gate.

No passively-captured signal reaches the Twin without you seeing it first. Every health snapshot lands in a review queue. You keep it or you let it go. Nothing folds into the model until you tap keep. And health-derived data is structurally incapable of syncing off the device — it never touches the synced store, enforced by the type system, not by a promise in a settings screen. That gate was built to be reused: every future passive signal inherits it.

The newest stage gives the Twin a voice. You can ask it questions in plain language now. On the Apple Intelligence iPhones it answers with an on-device language model. On every other device it falls back to searching your entries by meaning and handing back the ones that fit, or telling you it found nothing. Either way, every answer ties back to entries you actually wrote — the same groundedness bar from the test above, now holding on an open conversation instead of a closed set of questions. Shipping that surface without letting it invent things about you was the hard part. The audit that made it safe was built before the surface it now polices.

Worth saying what did *not* ship, because the deferrals are the honest part.

```
deferred                     why
──────────────────────────────────────────────────────────────
live heart-rate during       needs the Watch to sample on the wrist;
recording                    faking it from phone data would be a
                             confident wrong number

mood forecasting             fails its own test — see above

a custom sentiment model     the built-in on-device one wins at zero
                             added app size; custom ML has to earn
                             its bytes and here it didn't
```

None of those were cut for time. They were cut because each one would have made the product claim something it couldn't back.

## the stages ahead

Here's the arc. Read it as direction. The order is set by what each stage has to prove before it ships, and proof doesn't run on a calendar.

```
stage        what it adds
──────────────────────────────────────────────────────────
scribe       words                                ← live
body         physiology                           ← live
voice        ask it anything, every answer         ← live
             tied to your own entries
senses       ambient context, same review gate
memory       real-diary fidelity, anchored to the
             writer's own self-report
polyglot     per-language models, not translated keyword lists
citizen      answers through the OS itself
self         personality depth, "talk to your past self"
agent        weekly reviews, decision pre-briefs from precedent
protocol     a portable, encrypted, user-keyed twin format
mirror       cited "why did I feel this way?", twin-to-twin
```

The stage that still carries the most weight is memory. Not the recall itself, which now works, but anchoring it to real diaries with the writer's own self-report as ground truth. That's the leg that turns every synthetic number above into a human one, and it's the biggest open question left in the project. Voice already shipped, and it shipped the way I wanted: an open conversation is exactly where a model starts to flatter you, so every answer it gives has to point back at something you wrote. The audit that keeps it honest was built before the surface it now polices.

The far end — a portable twin format, a twin that talks to another twin, eventually a piece of hardware that holds a sealed, bequeathable copy — is real intent. I'm not putting a quarter on it. The nearer stages have to earn their numbers first. That's the deal I made with the measurement.

## the close

The interesting engineering in DailyVox is not the model. On-device NLP is well-trodden. The interesting part is the discipline: a system that measures itself against a dumb baseline, ships a feature only when it clears the bar, and cuts the features that don't — including the one everyone expects an AI journal to have.

A Twin that refuses to predict your future is a smaller promise than the market makes. It's also one I can keep.

Build the thing that passes the test. Cut the thing that doesn't. Say which is which.
