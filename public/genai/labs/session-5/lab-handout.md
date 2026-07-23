# Lab 5 — Give It Hands
**Session 5 · Tools + Choosing the Approach · TCE** · 50 min · pairs · Same rhythm

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

## Part A — Calculator tool (12 min)
Define `calculator` as a plain Python function with a real docstring. Hand it to the model. Ask the GST question — exact answer. Then ask **without** the tool and watch it guess. That contrast is the lesson: the model delegates instead of predicting digits.

✓ **Checkpoint 1:** with-tool exact, no-tool wobbles.

## Part B — Two tools, chained (12 min)
Add `days_between`. Ask something needing both (the internship question). The agent loop chains them — nobody scripted the order.

✓ **Checkpoint 2:** both tools called in one answer.

## Part C — See the machinery (8 min)
Disable automatic calling; print the raw `function_call` the model emits. This is the request; **your code** decides whether to run it. That's why the model can't actually do anything dangerous by itself.

## Part D — Scenario cards (10 min, paper + pen)
Four scenarios → pick Prompt / RAG / Tools / Fine-tune, justify in 2 sentences each. A mini design doc — and capstone rehearsal.

✓ **Checkpoint 3:** defend one choice to me out loud.

## Stretch
**Plug your Session 4 `search_notes` in as a tool** — your capstone becomes a real assistant (knowledge + hands) · manual agent loop · break-it-then-fix-the-docstring (proves docstrings are prompts).

## Capstone
You now hold all three pieces: **RAG (knowledge) + tools (hands) + evals (judge).** Save the notebook. The finale attacks it, you harden it, then demo. Bring it charged.
