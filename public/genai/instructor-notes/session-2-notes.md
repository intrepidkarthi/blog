# Session 2 — Talking to AI, and Catching Its Lies · Run Sheet

> Deep prep: work through `session-2-prep.md` first — this file is delivery-day only.

> Prep with `session-2-prep.md` first. **Deck:** `session-2-talking-to-ai-and-catching-its-lies.html` (21 slides, 9 interactives)

## Timing

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:06 | Recap quiz + the deal | 1–3 |
| 0:06–0:52 | Talk: prompting (4–9), the turn to lies (10–12), evaluation (13–17) | 4–27 |
| 0:52–0:58 | Recap flips + lab brief | 18–19 |
| 0:58–1:48 | **Lab 2** | — |
| 1:48–2:00 | Show & tell + break teaser | 20 |

Running late? Compress 8 (JSON — one click, one line) and 16 (demo trap — say the headline). Never cut: makeover, spot-the-lie, eval run, arena.

## Slide beats

**2 · Recap quiz.** Fast energy opener. Wrong answers = re-teach in one line, don't lecture.

**4 · Makeover (6 min, centerpiece #1).** Click through v0→v5 slowly. At each step ask "what's still wrong with this?" BEFORE clicking Improve. v5's constraint line is the punchline — "same output, but now it can't invent awards. Remember that for slide 11."

**5 · Builder.** Toggle parts on/off live. Point: task mandatory, rest are dials, over-stuffing dilutes attention.

**6–8 · Three quick demos.** Zero vs few-shot (the Tanglish review lands well); direct vs step-by-step (₹472 — let them calculate first on paper, 30 seconds, THEN reveal both answers); format (the "ONLY" word).

**9 · Prompt crimes.** Class guesses each fix before the click.

**10 · The turn.** Read the lawyer + Air Canada stories straight — real cases, real consequences. Room goes quiet here; let it.

**11 · Spot the lie (4 min, centerpiece #2).** Hands up for A/B/C before reveal. Punchline: the lie is welded to a true fact (1957 is real, the award isn't). "No amount of squinting detects it. Only checking does."

**13 · Eval run.** Run it, then IMMEDIATELY "Run again" — score changes 7→8. "Which is the true score? Neither. T=0, three runs, average — that's the discipline."

**14 · Scorers.** Exact-match failing a CORRECT answer is the aha — "your scorer can be the liar too."

**15 · Arena.** B wins 4-2 but Q5 beats both. "The loop never ends; it converges."

**19 · Lab brief.** Emphasize: expected strings SHORT; diagnose every ✗; documentation is the deliverable.

## Lab hour

- Common failure #1: `expected` too strict ("A. R. Rahman composed the music in 1992") → coach to key-fact-only.
- Common failure #2: test sets the model aces 10/10 → "your test is too easy — add obscure questions until it bleeds. A test that can't fail teaches nothing."
- Common failure #3: students change 3 things between runs → one change at a time.
- Checkpoint sweep at 1:30. Collect 2–3 best "interesting failures" for show & tell.

## Show & tell (1:48–2:00)

Best prompt improvement (before/after read aloud) + best caught hallucination. Ask each presenter: "was it the model, the scorer, or the question?" Close: "You can now PROVE whether AI is right. Next: it gets eyes and ears. Have photos on your phone."

## Anticipated questions

**"Is prompt engineering a real job / will it last?"** — The job title fades; the skill compounds. As models improve, crude tricks die but structured context (role/facts/format/constraints) IS how you program these systems. It's becoming everyone's job, like Googling was.

**"Why not just use a reasoning model instead of step-by-step prompts?"** — Reasoning models internalize the technique — you're seeing it graduate into the product. You still need visible steps when you must AUDIT the logic (finance, medicine, grading).

**"10 questions — is that statistically valid?"** — No, and don't pretend it is. It's a directional harness that teaches the workflow. Real teams run hundreds to thousands. Yours grows next session onwards.

**"Can the AI judge be trusted?"** — Partially. Known biases: prefers longer answers, its own phrasing, first position. Use it for paraphrase-tolerant checks, spot-audit it manually, never let it be the only signal.

**"Does 'please' / politeness change answers?"** — Marginal at best; specificity beats manners every time. Fun test for their eval harness, actually.
