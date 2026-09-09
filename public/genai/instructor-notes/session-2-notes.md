# Session 2 — Run Sheet

### Talking to AI, and Catching Its Lies · 21 slides · 1:42 total

**Delivery-day document.** The concepts are in `session-2-prep.md`; this is the clock. 
The discipline session. If you deliver only one thing well this weekend, make it slides 13–16.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | Talking to AI, and catching its lies | 1 min |  |
| 0:01 | 2 | Still true after the break? | 2 min |  |
| 0:03 | 3 | Two artifacts in two hours | 1.5 min |  |
| 0:04 | 4 | The prompt makeover: five upgrades | 4 min |  |
| 0:08 | 5 | Anatomy of a prompt: six switches | 2.5 min |  |
| 0:11 | 6 | Few-shot: show, don't tell | 2.5 min |  |
| 0:14 | 7 | Step-by-step beats straight-to-answer | 2.5 min |  |
| 0:16 | 8 | Demand a format, or parse chaos forever | 2 min | `trim` |
| 0:18 | 9 | The four classic prompt crimes | 3 min |  |
| 0:21 | 10 | Your polished prompt still lies beautifully. | 2 min |  |
| 0:23 | 11 | One of these is a confident lie | 4.5 min |  |
| 0:28 | 12 | Hallucination is an expected failure mode. That does not make it acceptable. | 1.5 min | `trim` |
| 0:29 | 13 | "How do you know it's right?" You measure. | 2 min |  |
| 0:31 | 14 | Watch an eval run | 3.5 min |  |
| 0:34 | 15 | Same answer, three verdicts | 3 min | `D` |
| 0:38 | 16 | Prompt A vs Prompt B: the arena | 3.5 min | `D` |
| 0:41 | 17 | "It worked when I tried it" is not evidence. | 1.5 min | `trim` |
| 0:42 | 18 | Eval-driven development: the loop | 2.5 min |  |
| 0:45 | 19 | Six ideas you own now | 2.5 min |  |
| 0:48 | 20 | Lab 2: the lie detector | 52 min |  |
| 1:40 | 21 | You can now prove whether AI is right. | 3 min |  |
| 1:42 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · Talking to AI, and catching its lies** — ‘You can now call the model. But your asks are wishes, not instructions. Today: make them instructions, and catch the lies.’

**0:01 · 2 · Still true after the break?** — Recap quiz. Fast energy. Wrong answers = one-line re-teach, don’t lecture.

**0:03 · 3 · Two artifacts in two hours** — Two artifacts: prompt playbook + eval harness. ‘This one artifact is the difference between using AI and engineering it.’

**0:04 · 4 · The prompt makeover: five upgrades** — CENTERPIECE. Makeover v0→v5. Before each Improve click ask ‘what’s still wrong?’ v5 constraint = the punchline (can’t invent awards). Quality meter climbs 10%→85%.

**0:08 · 5 · Anatomy of a prompt: six switches** — Toggle prompt parts live — watch the ~token count climb. Task mandatory, rest are dials; over-stuffing dilutes attention.

**0:11 · 6 · Few-shot: show, don't tell** — Zero vs few-shot. The Tanglish review lands well. ‘2–5 examples pin format + edge cases — the model imitates.’

**0:14 · 7 · Step-by-step beats straight-to-answer** — Let class compute ₹472 on paper FIRST (30s), then reveal both. Direct = confident wrong; steps = auditable.

**0:16 · 8 · Demand a format, or parse chaos forever** — The word ONLY does real work. ‘Apps don’t read prose — your 2 a.m. parser dies without it.’

**0:18 · 9 · The four classic prompt crimes** — Crime cards. Class guesses each fix before the click. Kitchen-sink previews S5 workflows.

**0:21 · 10 · Your polished prompt still lies beautifully.** — The turn. Read the lawyer + Air Canada cases straight. Room goes quiet — let it. ‘Not bad prompts. Unmeasured ones.’ Point at the receipts line: ‘Unlike the lawyer, I checked mine.’

**0:23 · 11 · One of these is a confident lie** — GAME. 3 rounds, vote A/B/C before each reveal. Lies: C (award invented) · B (India LOST that match) · A (Nobel was for photoelectric, not relativity). Tone-o-meter: identical bars every round. ‘Tone tells you nothing. Only checking does.’

**0:28 · 12 · Hallucination is an expected failure mode. That does not make it acceptable.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.

**0:29 · 13 · "How do you know it's right?" You measure.** — Test set + scorer + score = one honest number. Dots fill to ‘7/10 — argument over.’ Then land the line: ‘A prompt without an eval is a superstition.’

**0:31 · 14 · Watch an eval run** — Run eval, then IMMEDIATELY Run-again — score 7→8. ‘Which is true? Neither. T=0, ×3, average.’ Read failures.

**0:34 · 15 · Same answer, three verdicts** — Exact-match FAILS a correct answer — the aha. ‘Your scorer can be the liar too.’ Contains = today’s lab scorer. [D] deeper: precision / recall / F1, and the AI judge’s position + verbosity bias (fix: swap the order and run twice). Open it if anyone proposes an LLM judge.

**0:38 · 16 · Prompt A vs Prompt B: the arena** — Arena. Fight. B wins 4–2 but Q5 beats both. ‘The loop never ends; it converges. Then grow the test set.’ [D] deeper: why 5 questions cannot settle A vs B: the ±1/√n rule, paired comparison, and separating model variance from test-set variance.

**0:41 · 17 · "It worked when I tried it" is not evidence.** — ‘It worked when I tried it’ = not evidence. Demo = best case; eval = expected case.

**0:42 · 18 · Eval-driven development: the loop** — The loop = the job. Prompt→eval→read failures→fix ONE thing→re-run. The pipeline cycles on its own — let it. ‘Failures are the syllabus.’

**0:45 · 19 · Six ideas you own now** — Recall flips. Class says each before clicking. Six ideas: anatomy, few-shot, step-by-step, hallucination, test set, the loop.

**0:48 · 20 · Lab 2: the lie detector** — 2 min brief, then 50 MIN LAB. Press L — the 50:00 countdown paces the room. Expected strings SHORT; diagnose every ✗; documentation is the deliverable — three iterations documented well beats five documented badly. A/B on their 10 Qs. Links are on screen — point at them.

**1:40 · 21 · You can now prove whether AI is right.** — Show & tell + break. Best improvement + best caught lie + name the strongest hot-take counter-argument. ‘Model, scorer, or question?’ Next: AI gets eyes — have photos. Links are on screen — point at them.

---

## The lab hour

Slide 20, 52 minutes. Two-minute brief, then hands off.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Ask of every failure: model, scorer, or question? Tell them to bring photos.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the opening of the next block.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
