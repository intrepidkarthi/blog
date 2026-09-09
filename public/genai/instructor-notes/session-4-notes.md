# Session 4 — Run Sheet

### Giving AI Your Own Knowledge · 20 slides · 1:36 total

**Delivery-day document.** The concepts are in `session-4-prep.md`; this is the clock. 
The most employable session. Depends on students having brought documents — have a fallback set.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | Giving AI your knowledge | 1 min |  |
| 0:01 | 2 | Did it survive the night? | 2 min |  |
| 0:03 | 3 | Watch it not know — loudly | 3 min |  |
| 0:06 | 4 | "Just paste all my notes!" — let's price that | 2.5 min |  |
| 0:08 | 5 | Don't send everything. Send the right 3 paragraphs. | 1.5 min |  |
| 0:10 | 6 | Keyword search misses meaning | 2.5 min |  |
| 0:12 | 7 | Embeddings, now for whole paragraphs | 2.5 min | `D` |
| 0:15 | 8 | The search playground | 3.5 min |  |
| 0:18 | 9 | Chunking: how you cut the book | 3 min | `D` |
| 0:22 | 10 | Vector databases, in plain words | 2 min | `trim` |
| 0:24 | 11 | RAG, end to end | 4 min | `D` |
| 0:28 | 12 | The grounded prompt template | 2.5 min |  |
| 0:30 | 13 | Where RAG breaks in the wild | 3 min | `D` |
| 0:33 | 14 | RAG vs paste-it-all vs fine-tuning | 2 min | `trim` |
| 0:35 | 15 | You've been using RAG all along | 1.5 min | `trim` |
| 0:36 | 16 | Your final-year project needs a user, a baseline, and a number. | 1.5 min | `trim` |
| 0:38 | 17 | Lab architecture: two pipelines | 2 min |  |
| 0:40 | 18 | Six ideas you own now | 2.5 min |  |
| 0:42 | 19 | Lab 4: chat with YOUR notes | 50 min |  |
| 1:32 | 20 | Your AI now knows what you know. | 3 min |  |
| 1:36 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · Giving AI your knowledge** — Day-2 welcome. ‘The model read the internet — but not YOUR notes. Today we fix that. This is the most employable session.’

**0:01 · 2 · Did it survive the night?** — Recap quiz. Q4 (no memory) is the setup: ‘THAT gap is what we fix this morning.’

**0:03 · 3 · Watch it not know — loudly** — Villain slide. Ask, let the syllabus type out — the stamp lands at the end. ‘It cannot know. Notice it didn’t say that.’ If a student’s phone hedges politely: it still invents a ‘typical’ syllabus — the hedge is not knowledge. Call back to the stamp all morning.

**0:06 · 4 · "Just paste all my notes!" — let's price that** — Cost slider to 380 (= the Galvin textbook) — read the ₹/month aloud. Three taxes: window, meter, middle.

**0:08 · 5 · Don't send everything. Send the right 3 paragraphs.** — The insight: send the right 3 paragraphs, not everything. Open-book exam = good index. RAG.

**0:10 · 6 · Keyword search misses meaning** — Keyword vs semantic. Zero shared words — pause. ‘You know a machine that maps meaning to coordinates…’ (they shout embeddings).

**0:12 · 7 · Embeddings, now for whole paragraphs** — Session 1’s map, now for paragraphs. Search = cosine top-k, one numpy line. [D] deeper: pooling, why normalization makes the matrix multiply be cosine, query-vs-document task types, dimension truncation. The “why is it one line” answer.

**0:15 · 8 · The search playground** — Playground. Run all 4 queries — watch the query dot drop on the map. Q2 = teaching gold: TWO chunks relevant → why top-k not top-1. End on the trap query: every bar under 0.35 — the tool admits ignorance (foreshadows the RAG-breaks slide).

**0:18 · 9 · Chunking: how you cut the book** — Chunking, all 3 knives. ‘More RAG failures come from chunking than model choice.’ Say it twice. [D] deeper: structure-aware splitting, small-to-search/big-to-read, metadata + filter-before-rank, context prefixing. The four upgrades after the boring default.

**0:22 · 10 · Vector databases, in plain words** — Vector DB in plain words. ‘What YOU need today = a numpy array.’ Don’t add infra until infra-sized problem.

**0:24 · 11 · RAG, end to end** — CENTERPIECE. RAG stepper, step slowly. Stage 5 (Augment) = the money screen: ‘the whole industry is THIS prompt.’ Stage 6: click the [1] — the citation flashes its source chunk. Grounded, cited, checkable, live. [D] deeper: retrieve-20-then-rerank-4, bi-encoder vs cross-encoder, hybrid BM25 + semantic, query rewriting. The single biggest post-chunking upgrade — and a lab stretch.

**0:28 · 12 · The grounded prompt template** — Grounded template — three load-bearing lines. Then the A/B toggle: delete the escape hatch, watch the invention come back. Callback to villain: ‘the escape hatch is what 9am was missing.’

**0:30 · 13 · Where RAG breaks in the wild** — Failure flips. Debug order: retrieval→chunks→prompt→model. Stale index gives confident, cited, wrong answers. [D] deeper: recall@k / MRR / faithfulness — two scores, never one, and the diagnosis order they give you. The most employable slide in the deck.

**0:33 · 14 · RAG vs paste-it-all vs fine-tuning** — RAG vs fine-tune. Make them repeat: ‘Fine-tuning teaches behaviour; RAG provides knowledge.’

**0:35 · 15 · You've been using RAG all along** — ‘You’ve been using RAG all along’ — support bots, NotebookLM, AI search. ‘Someone gets paid to build today’s lab.’ The scheme-assistant and regulations-bot cards are capstone seeds — tell them to steal one.

**0:36 · 16 · Your final-year project needs a user, a baseline, and a number.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break. What makes it a project, not a demo: your own corpus + a 10-question eval set + one documented failure and fix.

**0:38 · 17 · Lab architecture: two pipelines** — Two pipelines: ingest once, query forever. ~60 lines. Every stage they’ve touched this weekend.

**0:40 · 18 · Six ideas you own now** — Recall flips. Class says each before clicking.

**0:42 · 19 · Lab 4: chat with YOUR notes** — 2 min brief, then 50 MIN LAB — the big build. #1 sink = garbage PDF extraction (swap doc / use S3 vision). Search junk = chunking. Push the capstone framing. Links are on screen — point at them.

**1:32 · 20 · Your AI now knows what you know.** — Show & tell + break. Two honest failures + fixes. ‘Knows what you know. After lunch it gets hands.’ Remind: SAVE the notebook. Links are on screen — point at them.

---

## The lab hour

Slide 19, 50 minutes. Two-minute brief, then hands off.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Remind them to SAVE the notebook — Session 5 builds on it.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the opening of the next block.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
