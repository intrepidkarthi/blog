# Lab 2 — The Lie Detector
**Session 2 · Prompting + Evaluation · TCE** · 50 min · same pairs · Same rhythm as Lab 1 (checkpoints → show instructor; stuck >5 min → neighbour → instructor)

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

**You need:** your 10-question file from Lab 1 Part E. Lost it? Rewrite it now — 5 minutes, go.

## Part A — Prompt makeover (15 min)

Notebook Cell 2 starts with `write about tce`. Improve it five times — **one upgrade per run**, in this order: task → role+audience → context facts → format+negatives → "only stated facts" constraint. After each run, fill one row of the table: *what changed, why the output got better*.

✓ **Checkpoint 1:** five documented rows. (The documentation is the deliverable — "I changed stuff and it got better" doesn't count.)

## Part B — Your first eval (15 min)

1. Load your 10 questions into `my_tests`. Keep `expected` short — the key fact, not a sentence ("rahman", not "A. R. Rahman composed it").
2. Run the baseline eval. Get your score.
3. **Diagnose every ✗:** model hallucinated / scorer too strict / question ambiguous. Fix scorer and question issues; leave true hallucinations in — they're gold.

✓ **Checkpoint 2:** score shown + one-line diagnosis per failure.

## Part C — The arena (15 min)

Design `PROMPT_B` to beat `PROMPT_A` on **your** test set. Ideas: role, "answer with the specific fact", "say 'I am not sure' instead of guessing", format constraints. Run both. Iterate B until it wins.

✓ **Checkpoint 3:** A vs B percentages + your most interesting failure, explained to me in one sentence.

## Stretch

- **Variance:** run your eval 3×; report spread. Try temperature 0 vs 1.0 in the harness.
- **LLM-as-judge:** run the judge cell; find a case where the judge itself is wrong.
- **Hard mode:** add 5 harder questions designed to *make* the model hallucinate (obscure details of your expert topic). Watch the score drop — that's a better test set.

## Before the break

Keep the notebook open — the eval harness returns in Session 6 to grade your capstone. Have 1–2 photos on your phone for Session 3 (anything: a receipt, your notes page, the canteen menu board).
