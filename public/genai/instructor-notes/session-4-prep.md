# Session 4 — Instructor Prep Pack

### Giving AI Your Own Knowledge · 20 slides · 2 hours

**What this file is.** The level under every slide. `session-4-notes.md` is the run sheet. Slide numbers are the deck's own, from `presentations/session-4-giving-ai-your-own-knowledge.html`.

**Say this out loud in the first minute: this is the most employable session of the six.** RAG is what most "AI engineer" job descriptions are actually describing, and the lab builds a working one in about sixty lines.

**It depends on students' own documents.** They were told at the Day 1 close to bring two or three real ones. Have `labs/session-4/sample-os-notes.txt` open in a tab before the room fills — it is the instructor sample the notebook's Cell 2 falls back to, and the deck's demo queries (attendance, pass marks, the OS content) retrieve from it — because some fraction of the room will arrive empty-handed and they cannot sit out the build. **Minute 0 of the lab: the Drive-mount reminder.** Lab 4 Cell 1 mounts Google Drive and saves `chunk_vecs.npy` / `chunks.json` under `MyDrive/genai/`; say out loud that Labs 5 and 6 reload those files, so a pair that skips the mount will re-embed under a rate limit this afternoon.

---

## 1 · The spine

1. **It cannot know your notes, and it will not say so** (3) — the villain.
2. **Pasting everything is priced, and the price is real** (4) — three taxes: window, meter, middle.
3. **Send the right three paragraphs** (5) — the whole idea, in one line.
4. **Keyword search cannot find them; meaning can** (6–8) — and they already own the tool.
5. **How you cut the book decides everything** (9) — more RAG failures come from chunking than model choice.
6. **The pipeline, end to end** (11–12) — and the escape hatch is what 9 a.m. was missing.
7. **It breaks in four specific ways** (13) — with a debug order.

---

## 2 · Slide by slide

### Slides 1–2 · Welcome; did it survive the night? · 3 min

**The move.** Day 2 opens. *"The model read the internet — but not YOUR notes. Today we fix that."* The recap quiz's fourth question, on the absence of memory, is the deliberate setup: **"that gap is what we fix this morning."**

### Slide 3 · Watch it not know — loudly · 3 min

**On screen.** The villain slide: a question about the syllabus, an answer typing out, then a stamp.

**The move.** Ask it, let the answer type, and let the stamp land at the end. Then the line that carries the session: *"It cannot know. Notice that it didn't say that."*

**One level under.** If a student's own phone hedges politely on the same question, that is not a counter-example worth conceding — it still invents a *typical* answer. Point out that hedging is a trained behaviour, not knowledge of its own ignorance.

**Landmine.** Do not mock the model here. The point is structural — it has no mechanism for knowing what it does not know — and mockery makes it sound like a fixable defect.

### Slides 4–5 · Price the paste; send three paragraphs · 4 min

**On screen.** A cost slider; then the insight.

**The move.** Drag the slider to 380 pages — the Galvin textbook — and **read the ₹/month figure aloud**. Name the three taxes: the window (it may not fit), the meter (you pay per token every call), and the middle (attention dilutes across irrelevant text). Then the insight: send the right three paragraphs. Open-book exam with a good index.

**Hardest question.** *"But context windows are huge now — isn't this obsolete?"* — This is the best question in the session and it recurs in Session 6. Cost, latency, freshness and citations all still favour retrieval. Concede the honest case: a small static corpus queried rarely is genuinely fine to paste.

### Slides 6–8 · Keyword misses meaning; embeddings for paragraphs; the playground · 8.5 min · `[D]`

**On screen.** A keyword search failing on zero shared words; the embedding map at paragraph scale; a four-query search playground.

**The move.** On slide 6, pause on the zero-shared-words example and say *"you already know a machine that maps meaning to coordinates…"* — the room shouts **embeddings**. On slide 8, run all four queries and watch the query dot drop onto the map. Query 2 is teaching gold: **two** chunks are relevant, which is why you take top-k and not top-1. End on the trap query where every bar is under 0.35 — that is the "nothing relevant" case, and it is what the escape hatch on slide 12 exists for.

**Depth panel `[D]` (slide 7).** *Why that one line is allowed to be that short* — pooling, why normalisation turns a matrix multiply into cosine similarity, and query-versus-document task types.

**One level under.** Retrieval is `chunk_vectors @ question_vector` and then argsort. It is one numpy line because the vectors are normalised, which makes the dot product a cosine.

### Slides 9–10 · Chunking; vector databases · 5 min · `trim` at 10

**On screen.** Three chunking strategies; then vector DBs in plain words.

**The move.** **"More RAG failures come from chunking than from model choice."** Say it twice — it is the most actionable sentence in the session. Then deflate the database question: what they need today is a numpy array. Do not add infrastructure until you have an infrastructure-sized problem.

**Depth panel `[D]` (slide 9).** *Four upgrades once paragraph-with-overlap stops being enough* — structure-aware splitting, small-to-search/big-to-read, metadata and filter-before-rank.

**Landmine.** Do not let a student leave believing they need Pinecone to do this. That belief costs them a working prototype.

### Slides 11–12 · RAG end to end; the grounded prompt · 6.5 min · `[D]`

**On screen.** The RAG stepper; then the grounded prompt template with an A/B toggle.

**The move.** Step the pipeline slowly. **Stage 5, Augment, is the money screen** — *"the whole industry is this prompt."* At stage 6 click the `[1]` and let the citation flash its source chunk. Then slide 12: three load-bearing lines in the template, and the A/B toggle — delete the escape hatch and watch the invention come back. Call back to the villain: **"the escape hatch is what 9 a.m. was missing."**

**Depth panel `[D]` (slide 11).** *The stage production adds between retrieve and augment* — reranking.

**One level under.** The escape hatch is the instruction that permits refusal: answer only from the context, and say you don't know if it isn't there. Without it the model treats the retrieved context as a hint rather than a boundary.

### Slides 13–15 · Where RAG breaks; vs fine-tuning; you've been using it · 6.5 min · `trim` at 14 and 15 · `[D]`

**On screen.** Four failure flips; the three-way comparison; then familiar products.

**The move.** Give them the **debug order** and make them write it down: retrieval → chunks → prompt → model. Name the nastiest failure: a stale index gives confident, *cited*, wrong answers — the citation makes it worse, not better. Then make the room repeat: **"fine-tuning teaches behaviour; RAG provides knowledge."** On 15, point at the scheme-assistant and regulations-bot cards as capstone seeds.

**Depth panel `[D]` (slide 13).** *Two scores, never one* — recall@k and MRR for retrieval, faithfulness for generation. The four failures split cleanly into retrieval failures and generation failures, and one number cannot tell them apart.

### Slides 16–18 · The fight; lab architecture; six ideas · 5 min · `trim` at 16

**The move.** Slide 16 is the hot take — read once, slowly, three seconds of silence, one counter-argument, park the rest. Then the two pipelines: ingest once, query forever, about sixty lines, and every stage is something they have already touched this weekend.

### Slide 19 · Lab 4: chat with YOUR notes · 50 min

**The move.** Two-minute brief, then the big build. The number one time sink is **garbage PDF extraction** — have them swap the document or use Session 3's vision extraction rather than fight it. If search returns junk, the answer is almost always chunking. Push the capstone framing while circulating.

**Lab shape:** A ingest (12) · B search sanity (8) · C full RAG (15) · D break it honestly (10).

**Landmine.** Do not let a pair spend twenty minutes on a PDF that will not extract. Swap the document at minute five; the lesson is retrieval, not parsing.

### Slide 20 · Your AI now knows what you know · 3 min

**The move.** Show and tell: two honest failures and their fixes. Remind them to **save the notebook** — Session 5 builds on it. *"It knows what you know. After lunch, it gets hands."*

---

## 3 · The depth layer in this deck

| Slide | Panel | Open it when |
|---|---|---|
| 7 | Why that one line is allowed to be that short — pooling, normalisation, task types | someone asks how similarity works |
| 9 | Four upgrades past paragraph-with-overlap | someone's chunking is failing and they want the real answer |
| 11 | The stage production adds — reranking | someone asks how to improve retrieval quality |
| 13 | Two scores, never one — recall@k, MRR, faithfulness | someone asks how to evaluate a RAG system |

---

## 4 · Q&A bank

**"Why not fine-tune on our documents?"** — Fine-tuning teaches behaviour and style, not facts, and it cannot be updated when a circular changes. RAG can, by re-embedding one file.

**"How big should a chunk be?"** — Start with a paragraph plus overlap. Too small loses context; too large dilutes the signal and costs more. Then measure — slide 13's depth panel.

**"What if the answer spans two chunks?"** — That is exactly why top-k is greater than 1, and it is what playground query 2 demonstrates.

**"Do I need a vector database?"** — Not today. A numpy array is a vector database with fewer moving parts.

**"How do I know retrieval is the problem and not the model?"** — Hand the model the correct chunk yourself. If it answers correctly, the bug is upstream in retrieval.

**"My search returns the same three chunks for every query"** (pushback you will get from at least one pair) — the `gemini-embedding-2` batching gotcha. Passing a plain list of strings as `contents` returns **one aggregated embedding for the whole list**, not one per string, and no error is raised; `chunk_vecs` ends up with a handful of rows and `argsort` returns the same chunks every time. Each input has to be wrapped in its own `types.Content(parts=[types.Part.from_text(text=t)])`. The notebook's `embed()` does this and asserts `len(res.embeddings) == len(texts)` — if a pair rewrote the helper, that assertion is the first thing to check.

---

## 5 · Misconceptions

| They believe | Say this |
|---|---|
| Fine-tuning is how you add knowledge | Behaviour vs knowledge — make them repeat it (14) |
| Long context makes RAG obsolete | Cost, latency, freshness, citations (4, and Session 6) |
| A citation means the answer is right | A stale index cites its source and is still wrong (13) |
| Chunking is a detail | More failures come from chunking than model choice (9) |
| You need infrastructure to start | A numpy array (10) |

---

## 6 · Timing pressure map

Budgets total 95.5 minutes plus the lab — this deck has genuine slack. Spend it on slides 8, 11 and 12.

Cut in this order: slide 15 (one card, not four) · slide 18 recall flips · slide 6 (the zero-shared-words example alone carries it).

Never compress: slide 8's query 2 and trap query, slide 11 stage 5, or slide 12's A/B toggle.

The deck flags slides 10, 14, 15 and 16 **compressible** (press **S** to see the marker).

---

## 7 · Day-before checklist

Run the full lab notebook on a real key with **your own** documents. Prepare the fallback document set for students who arrive without any. Run all four playground queries and confirm the trap query still shows every bar under 0.35. Toggle the escape hatch off and on and confirm the invention actually returns — it is the session's best single demo. Confirm the embedding model still resolves: `gemini-embedding-2` with `output_dimensionality=768`, and that `embed()` returns one vector **per chunk** (the count assertion in Cell 4 must pass — see the batching gotcha in §4). Have `labs/session-4/sample-os-notes.txt` open and confirm the pre-filled queries retrieve from it.
