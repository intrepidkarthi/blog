# Lab 2 — The Lie Detector
**Session 2 · Prompting + Evaluation · TCE** · 50 min · same pairs · Same rhythm as Lab 1 (checkpoints → show instructor; stuck >5 min → neighbour → instructor)

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

**You need:** your 10-question file from Lab 1 Part E. Lost it? Rewrite it now — 5 minutes, go.

## Part A — Prompt makeover (15 min)

Notebook Cell 2 starts with `write about tce`. Improve it five times — **one upgrade per run**, in this order: task → role+audience → context facts → format+negatives → "only stated facts" constraint. After each run, fill one row of the table: *what changed, why the output got better*.

✓ **Checkpoint 1:** five documented rows. (The documentation is the deliverable — "I changed stuff and it got better" doesn't count. Three iterations documented well beats five documented badly.)

## Part B — Your first eval (15 min)

1. Load your 10 questions into `my_tests`. Keep `expected` short — the key fact, not a sentence ("rahman", not "A. R. Rahman composed it").
2. Run the baseline eval. Get your score.
3. **Scored 9 or 10 out of 10?** Your set may be too easy to teach failure analysis — swap in 5 harder questions. Do not claim that 9/10 is a reliable estimate of real-world accuracy; ten examples are a learning exercise.
4. **Diagnose every ✗:** model hallucinated / scorer too strict / question ambiguous. Fix scorer and question issues; leave true hallucinations in — they're gold.
5. Keep the test questions fixed while comparing prompts. Do not use the same examples as both prompt demonstrations and evaluation evidence.

✓ **Checkpoint 2:** score shown + one-line diagnosis per failure.

## Part C — The arena (15 min)

Design `PROMPT_B` to beat `PROMPT_A` on **your** test set. Ideas: role, "answer with the specific fact", "say 'I am not sure' instead of guessing", format constraints. Cell 5 fights on the first 5 questions (`DEV = my_tests[:5]`) — iterate there. When B is final, run **Cell 5b** once to confirm the winner on all 10 (20 calls; you have another lab today).

✓ **Checkpoint 3:** A vs B percentages **with the number of questions** + your most interesting failure, explained to me in one sentence.

## Stretch

- **Variance:** run your eval 3× (30 calls); report spread. Try temperature 0 vs 1.0 in the harness.
- **LLM-as-judge:** run the judge cell; find a case where the judge itself is wrong — then audit it: hand-grade 20 examples and check agreement; under ~80% you are measuring the judge, not the model (deck: press D on the judge slide).
- **Position bias (Stretch 3):** `judge_pair()` compares A vs B, then B vs A. Every disagreement is a verdict decided by *order*, not content — count them.
- **Hard mode:** add 5 harder questions designed to *make* the model hallucinate (obscure details of your expert topic). Watch the score drop — that's a better test set.

## Before the break

Keep the notebook open — the eval harness returns in Session 6 to grade your capstone. A domain eval set for a subject you know + a documented prompt comparison is already a defensible final-year-project scope. Before you close: File → Save a copy in Drive again (your test set only exists in this notebook), and paste `my_tests` into a text file too. Have 1–2 photos on your phone for Session 3 (anything: a receipt, your notes page, the canteen menu board).
