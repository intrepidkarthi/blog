# Session 4 — Slide-by-Slide Cheat Sheet

### Session 4 · Giving AI Your Own Knowledge · 20 slides · 1:36 total

The most employable session. Depends on students having brought their own documents.

One card per slide, generated from `presentations/session-4-giving-ai-your-own-knowledge.html` itself, so nothing here can drift from what is on screen. **#** is the deck position — it matches the `20 / 20` counter in the footer and the `#20` deep link. **Badge** is the number printed in the slide’s top-left corner; the two differ because title and lab slides are not badged. Press **S** in the deck for the same notes with a live timer.

**`trim`** marks a slide the deck itself flags **compressible** — press S and you will see `▸ compressible` on it. These are the first things to shorten when you are behind, not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** to open it, and only open it if the room asks.

---

## At a glance

| At | # | Badge | Slide | Budget | |
|---|---|---|---|---|---|
| 0:00 | 1 | — | Giving AI your knowledge | 1 min |  |
| 0:01 | 2 | 01 | Did it survive the night? | 2 min |  |
| 0:03 | 3 | 02 | Watch it not know — loudly | 3 min |  |
| 0:06 | 4 | 03 | "Just paste all my notes!" — let's price that | 2.5 min |  |
| 0:08 | 5 | 04 | Don't send everything. Send the right 3 paragraphs. | 1.5 min |  |
| 0:10 | 6 | 05 | Keyword search misses meaning | 2.5 min |  |
| 0:12 | 7 | 06 | Embeddings, now for whole paragraphs | 2.5 min | `D` |
| 0:15 | 8 | 07 | The search playground | 3.5 min |  |
| 0:18 | 9 | 08 | Chunking: how you cut the book | 3 min | `D` |
| 0:22 | 10 | 09 | Vector databases, in plain words | 2 min | `trim` |
| 0:24 | 11 | 10 | RAG, end to end | 4 min | `D` |
| 0:28 | 12 | 11 | The grounded prompt template | 2.5 min |  |
| 0:30 | 13 | 12 | Where RAG breaks in the wild | 3 min | `D` |
| 0:33 | 14 | 13 | RAG vs paste-it-all vs fine-tuning | 2 min | `trim` |
| 0:35 | 15 | 14 | You've been using RAG all along | 1.5 min | `trim` |
| 0:36 | 16 | — | Your final-year project needs a user, a baseline, and a number. | 1.5 min | `trim` |
| 0:38 | 17 | 15 | Lab architecture: two pipelines | 2 min |  |
| 0:40 | 18 | 16 | Six ideas you own now | 2.5 min |  |
| 0:42 | 19 | 17 | Lab 4: chat with YOUR notes | 50 min |  |
| 1:32 | 20 | 18 | Your AI now knows what you know. | 3 min |  |
| 1:36 | | | *end* | | |

---

## The cards

### 1 · Giving AI your knowledge

`#1` · `<|day_2 · generative_ai · foundations_&_applications|>` · **1 min** · at **0:00**

- **Run it** — Day-2 welcome. ‘The model read the internet — but not YOUR notes. Today we fix that. This is the most employable session.’

### 2 · Did it survive the night?

`#2` · badge **01** · `<|good_morning — 90_second_recap_of_day_1|>` · **2 min** · at **0:01**

- **On screen** — *True or false*
- **Run it** — **Recap quiz.** Q4 (no memory) is the setup: ‘THAT gap is what we fix this morning.’

### 3 · Watch it not know — loudly

`#3` · badge **02** · `<|live_demo · the_problem|>` · **3 min** · at **0:03**

- **On screen** — *Ask about YOUR world*; buttons: **Ask**
- **Run it** — **Villain slide. Ask, let the syllabus type out — the stamp lands at the end.** ‘It cannot know. Notice it didn’t say that.’ If a student’s phone hedges politely: it still invents a ‘typical’ syllabus — the hedge is not knowledge. Call back to the stamp all morning.

### 4 · "Just paste all my notes!" — let's price that

`#4` · badge **03** · `<|the_obvious_fix, and_its_bill|>` · **2.5 min** · at **0:06**

- **On screen** — *Drag: how much are you pasting per question?*
- **Run it** — **Cost slider to 380 (= the Galvin textbook) — read the ₹/month aloud.** Three taxes: window, meter, middle.

### 5 · Don't send everything. Send the right 3 paragraphs.

`#5` · badge **04** · `<|the_insight|>` · **1.5 min** · at **0:08**

- **Run it** — The insight: send the right 3 paragraphs, not everything. Open-book exam = good index. RAG.

### 6 · Keyword search misses meaning

`#6` · badge **05** · `<|live_demo · why_ctrl-f_isn't_enough|>` · **2.5 min** · at **0:10**

- **On screen** — *Query: "marks required to clear the subject" · Notes say: "…minimum of 50% aggregate across internals and end-semester…" · scores precomputed — you compute real ones in the lab*; buttons: **Ctrl-F keyword search** · **Semantic search**
- **Run it** — **Keyword vs semantic.** Zero shared words — pause. ‘You know a machine that maps meaning to coordinates…’ (they shout embeddings).

### 7 · Embeddings, now for whole paragraphs

`#7` · badge **06** · `<|session_1's_map_grows_up|>` · **2.5 min** · at **0:12** · `D`

- **Run it** — Session 1’s map, now for paragraphs. Search = cosine top-k, one numpy line. **[D] deeper:** pooling, why normalization makes the matrix multiply *be* cosine, query-vs-document task types, dimension truncation. The “why is it one line” answer.
- **Depth `D`** — why that one line is allowed to be that short

### 8 · The search playground

`#8` · badge **07** · `<|live_demo · search_by_meaning|>` · **3.5 min** · at **0:15**

- **On screen** — *6 chunks from an OS notes file, plotted in meaning-space — pick a query · scores precomputed — you compute real ones in the lab*; buttons: **"marks needed to pass?"** · **"why is my PC slow with many apps?"** · **"conditions for deadlock"** · **"attendance condonation rules?"**
- **Run it** — **Playground. Run all 4 queries — watch the query dot drop on the map.** Q2 = teaching gold: TWO chunks relevant → why top-k not top-1. End on the trap query: every bar under 0.35 — the tool admits ignorance (foreshadows the RAG-breaks slide).

### 9 · Chunking: how you cut the book

`#9` · badge **08** · `<|the_unglamorous_decision_that_decides_everything|>` · **3 min** · at **0:18** · `D`

- **On screen** — *Same document, three knife settings — query: "marks needed to pass"*; buttons: **Tiny chunks (1 sentence)** · **Medium (paragraph + overlap)** · **Huge (whole pages)**
- **Run it** — **Chunking, all 3 knives.** ‘More RAG failures come from chunking than model choice.’ Say it twice. **[D] deeper:** structure-aware splitting, small-to-search/big-to-read, metadata + filter-before-rank, context prefixing. The four upgrades after the boring default.
- **Depth `D`** — four upgrades once paragraph-with-overlap stops being enough

### 10 · Vector databases, in plain words

`#10` · badge **09** · `<|where_the_vectors_live|>` · **2 min** · at **0:22** · `trim`

- **Run it** — Vector DB in plain words. ‘What YOU need today = a numpy array.’ Don’t add infra until infra-sized problem.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 11 · RAG, end to end

`#11` · badge **10** · `<|assemble_the_machine · drive_it_yourself|>` · **4 min** · at **0:24** · `D`

- **On screen** — *One question's journey — press Step*; buttons: **Step →** · **Reset**
- **Run it** — **CENTERPIECE. RAG stepper, step slowly.** Stage 5 (Augment) = the money screen: ‘the whole industry is THIS prompt.’ Stage 6: click the [1] — the citation flashes its source chunk. Grounded, cited, checkable, live. **[D] deeper:** retrieve-20-then-rerank-4, bi-encoder vs cross-encoder, hybrid BM25 + semantic, query rewriting. The single biggest post-chunking upgrade — and a lab stretch.
- **Depth `D`** — the stage production adds between retrieve and augment

### 12 · The grounded prompt template

`#12` · badge **11** · `<|the_A_in_RAG — the_prompt_that_changes_everything|>` · **2.5 min** · at **0:28**

- **On screen** — *A/B eval, live — ask "attendance policy?" (not in the context)*; buttons: **Delete the escape hatch**
- **Run it** — Grounded template — three load-bearing lines. Then the A/B toggle: delete the escape hatch, watch the invention come back. Callback to villain: ‘the escape hatch is what 9am was missing.’

### 13 · Where RAG breaks in the wild

`#13` · badge **12** · `<|diagnose_before_you_click|>` · **3 min** · at **0:30** · `D`

- **Run it** — **Failure flips.** Debug order: retrieval→chunks→prompt→model. Stale index gives confident, cited, wrong answers. **[D] deeper:** recall@k / MRR / faithfulness — two scores, never one, and the diagnosis order they give you. The most employable slide in the deck.
- **Depth `D`** — debugging this properly: two scores, never one

### 14 · RAG vs paste-it-all vs fine-tuning

`#14` · badge **13** · `<|choosing (full_framework_next_session)|>` · **2 min** · at **0:33** · `trim`

- **Run it** — RAG vs fine-tune. Make them repeat: **‘Fine-tuning teaches behaviour; RAG provides knowledge.’**
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 15 · You've been using RAG all along

`#15` · badge **14** · `<|look_around|>` · **1.5 min** · at **0:35** · `trim`

- **Run it** — ‘You’ve been using RAG all along’ — support bots, NotebookLM, AI search. ‘Someone gets paid to build today’s lab.’ The scheme-assistant and regulations-bot cards are capstone seeds — tell them to steal one.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 16 · Your final-year project needs a user, a baseline, and a number.

`#16` · `<|hot_take · argue_with_me|>` · **1.5 min** · at **0:36** · `trim`

- **On screen** — full-bleed hot take
- **Run it** — **Pick the fight deliberately.** Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break. What makes it a project, not a demo: your own corpus + a 10-question eval set + one documented failure and fix.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 17 · Lab architecture: two pipelines

`#17` · badge **15** · `<|what_you're_about_to_build|>` · **2 min** · at **0:38**

- **On screen** — *Ingest once (per document) · query forever*
- **Run it** — Two pipelines: ingest once, query forever. ~60 lines. Every stage they’ve touched this weekend.

### 18 · Six ideas you own now

`#18` · badge **16** · `<|say_it_before_you_click|>` · **2.5 min** · at **0:40**

- **Run it** — **Recall flips.** Class says each before clicking.

### 19 · Lab 4: chat with YOUR notes

`#19` · badge **17** · `<|50_minutes · the_weekend's_main_build|>` · **50 min** · at **0:42**

- **Run it** — **2 min brief, then 50 MIN LAB — the big build.** #1 sink = garbage PDF extraction (swap doc / use S3 vision). Search junk = chunking. Push the capstone framing. **Links are on screen** — point at them.

### 20 · Your AI now knows what you know.

`#20` · badge **18** · `<|break · session_5_after_lunch|>` · **3 min** · at **1:32**

- **Run it** — **Show & tell + break.** Two honest failures + fixes. ‘Knows what you know. After lunch it gets hands.’ Remind: SAVE the notebook. **Links are on screen** — point at them.

---

*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: re-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*
