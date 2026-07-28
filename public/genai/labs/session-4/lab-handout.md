# Lab 4 — Chat With YOUR Notes
**Session 4 · Embeddings + RAG · TCE** · 50 min · pairs · The weekend's main build

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

**You need:** the 2–3 documents you gathered last night (PDF/txt). Forgot? Grab any lecture PDF from your class group right now — 2 minutes.

## Part A — Ingest (12 min)
Load your document → chunk (paragraph + overlap) → embed → numpy vector store. **Read the Cell 2 sanity print** — if the PDF extracted garbage, swap documents now, not at minute 40.

✓ **Checkpoint 1:** chunk count + vector-store shape printed.

## Part B — Search sanity (8 min)
Three test queries about your material. Eyeball the top chunks: right topic? complete thoughts? If not, tune chunk `target` size and re-run Cells 3–4.

✓ **Checkpoint 2:** three sane searches shown.

## Part C — Full RAG (15 min)
Grounded template (ONLY the context · cite chunks · "I don't know" escape hatch) → ask 5 real questions about your material. Use `show_chunks=True` — watching retrieval is how you debug RAG.

## Part D — Break it honestly (10 min)
1. Ask something **not in your docs** → must say "I don't know," not invent.
2. Ask something split across two sections → catch the half-truth.

✓ **Checkpoint 3:** one honest failure + your fix (or why it's genuinely hard).

## Stretch
RAG eval — 5 Q + expected through your S2 harness · k=1 vs 3 vs 5 · add your second document · print similarity scores in answers.

**Going deeper (S3, S4 in the notebook).** *Rerank* — retrieve 20, let a model re-order them, keep 4: the biggest RAG upgrade after chunking, in ten lines. *Two scores, never one* — label which chunk should win, then measure `recall@k` (your ceiling on accuracy) and `MRR` (did it arrive near the top) separately from answer quality. High recall with low MRR is the exact signature that says *add the reranker*. Both are unpacked in the deck's `<|deeper|>` panels — press **D**.

## Capstone note
**Save this notebook.** It IS your capstone foundation: S5 (after lunch) bolts tools onto it; S6 attacks and hardens it, then you demo. Choose documents you actually care about — the demo is only as interesting as the data.
