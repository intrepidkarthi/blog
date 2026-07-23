# Session 4 — Giving AI Your Own Knowledge · Run Sheet

> Deep prep: work through `session-4-prep.md` first — this file is delivery-day only.

> Prep with `session-4-prep.md`. **Deck:** `session-4-giving-ai-your-own-knowledge.html` (20 slides, 8 interactives). Day 2 opener — the most employable session of the course.

## Timing

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:07 | Day-2 welcome + recap quiz | 1–2 |
| 0:07–0:52 | Talk: problem (3–5) → search (6–10) → RAG (11–13) → context (14–16) | 3–16 |
| 0:52–0:58 | Recap flips + lab brief | 17–18 |
| 0:58–1:48 | **Lab 4** (the big build) | — |
| 1:48–2:00 | Show & tell + break teaser | 19 |

**Before students arrive:** confirm everyone actually brought documents (ask in the class group at breakfast). Keep 3 backup PDFs ready (any lecture notes) for those who didn't.

## Slide beats

**2 · Recap quiz.** Q4 (no memory) is deliberate — it's the setup for today. When it lands say: "THAT gap is what we fix this morning."

**3 · Watch it not know (3 min).** Click Ask, let the invented syllabus type out fully, then the line: "It cannot know. Notice it didn't say that." This is the session's villain — refer back to it all morning.

**4 · Cost slider.** Drag to 400 pages live. Three taxes: window, meter, middle.

**6 · Keyword fails.** Zero shared words — pause on that. "You already know a machine that maps meaning to coordinates…" (they should shout embeddings).

**8 · Playground (4 min).** Run all three queries. Query 2 is the teaching gold: TWO chunks relevant → that's why top-k, not top-1.

**9 · Chunking.** "More RAG failures come from chunking than from model choice" — say it twice; they'll meet it in lab within the hour.

**11 · RAG stepper (5 min, centerpiece).** Step slowly. Stage 5 (Augment) is the money screen — "the whole industry pattern is THIS prompt." Stage 6: grounded, cited, checkable.

**12 · Template.** Three load-bearing lines. Callback to 9 a.m.: "the escape hatch is what our villain slide was missing."

**14 · RAG vs fine-tune.** The interview one-liner: "fine-tuning teaches behaviour; RAG provides knowledge." Make them repeat it.

**18 · Lab brief.** Push the capstone framing: documents they care about.

## Lab hour

- **#1 time sink: PDF extraction garbage** (scanned PDFs extract nothing — pypdf reads text layers only). Fix: swap document, or screenshot pages → Session 3 vision transcription (nice full-circle moment for fast pairs).
- Embedding rate limits: the batch loop sleeps 1s — students who remove it will meet 429.
- Search returns junk → 90% chunking (target too big/small), 10% garbage extraction.
- "I don't know" test failing (inventing anyway) → strengthen ONLY line + escape hatch; have them A/B it — that's Session 2 discipline.
- Checkpoint sweep at 1:30; collect 2 great "honest failures" for show & tell.

## Show & tell

Two honest failures + fixes. Then: "Your AI now knows what you know. After lunch it gets hands." Remind: SAVE the notebook — it's the capstone foundation.

## Anticipated questions

**"Why not just use NotebookLM / ChatGPT file upload?"** — Great products — that's literally this architecture with polish. You're learning to BUILD it: your data stays yours, you control chunking/grounding/citations, and it's what companies pay for. Using a tool ≠ owning the pattern.

**"Embeddings from one model, generation from another — fine?"** — Yes, totally standard. Only rule: query and chunks must share the SAME embedding model.

**"How is this different from Ctrl-F / grep?"** — Slide 6 is the answer: meaning vs characters. Hybrid (keyword + semantic) is what production search often uses — best of both.

**"Million-token context windows will kill RAG, no?"** — Long context helps small corpora; RAG survives on cost (pay per token per query), freshness (re-index vs re-send), citations, and lost-in-the-middle. Real systems increasingly combine both.

**"Can it answer across two documents?"** — Yes — chunks from both live in one vector store (Stretch). Cross-document synthesis of many chunks is where plain RAG strains — graduate topic.
