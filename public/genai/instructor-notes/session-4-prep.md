# Session 4 — Instructor Prep Pack
### the deep version

Deck: `session-4-giving-ai-your-own-knowledge.html` · 20 slides · 8 interactives · deck budget ≈ 97.5 min including the 50-min lab. This session is the spine of the capstone: what students build today gets tools bolted on in S5 and gets attacked in S6. You must be able to go one level below every slide — sharp 4th-years and their professors will test exactly that.

---

## 1 · Narrative spine

One argument, seven beats. The session is a single proof that ends in working code:

1. **The model cannot know your world — and won't admit it.** Ask about the TCE OS syllabus: it invents a plausible one, fluently. (Villain slide — everything else this morning is the cure.)
2. **The obvious fix — paste everything — fails three ways.** The *window* (may not fit), the *meter* (you re-pay per token, per question), the *middle* (long-context attention is weakest mid-window). Price it live in ₹.
3. **So don't send everything — send the right 3 paragraphs.** The topper in an open-book exam doesn't read the book; she has sticky flags on the right pages. We need an index by *meaning*.
4. **Keyword search can't build that index** — "marks to clear the subject" shares zero words with "50% aggregate to pass". But Session 1's embeddings map meaning to coordinates; today the same trick works on whole paragraphs.
5. **Search is then three lines of numpy** — normalize, dot product, argsort. The silent kingmaker is *chunking*: how you cut the book decides whether the right paragraph even exists to be found.
6. **RAG = Retrieve → Augment → Generate.** Staple the top-k chunks into a grounded template with three load-bearing lines: ONLY the context · cite the chunk · the "I don't know" escape hatch.
7. **It fails in four knowable ways** (vocabulary gap, split answers, stale index, ignored context), each with a fix, debugged in a fixed order: retrieval → chunks → prompt → model. And this exact architecture is most of the AI product economy — which is why the lab that builds it in ~60 lines is the most employable hour of the course.

**Readiness test:** say the whole argument out loud in under 3 minutes, no slides, ending with "and that's why chunking bugs cause more RAG failures than model choice." If you can't, re-walk the beats until you can.

---

## 2 · Concept deep-dives (slide by slide)

### Slides 1–2 · Title + recap quiz
**Claim:** Day-2 opener; four true/false items re-test Day 1 (image patches, diffusion, pixel hallucination, no memory).
**Mechanism:** Q4 — "the model remembers yesterday" is FALSE — is the deliberate setup. Inference runs through *frozen* weights; chat apps fake memory by re-sending the transcript. Today extends that: if context is the only memory, then *choosing what goes into context* is the whole game. RAG is memory-management engineering.
**Pushback:** "But ChatGPT has a memory feature now?" — Yes, and it's implemented as retrieval: saved notes about you are fetched and inserted into context. The weights still never change. Memory features are RAG wearing a trench coat.
**Landmine:** don't rush past Q4 — say the line: "THAT gap is what we fix this morning."

### Slide 3 · Watch it not know — loudly
**Claim:** Asked about *your* syllabus, the model invents a plausible one instead of admitting ignorance.
**Mechanism (one level deeper):** the model has no "I don't know this" signal. Training optimizes next-token likelihood: given "Unit 3 of the OS course covers…", the highest-probability continuation is *a typical OS syllabus* — it has seen thousands. Truthfulness about its own knowledge boundary was never the training target; RLHF's helpfulness pressure makes silence even less likely. Hallucination here is a **calibration failure**: fluency and confidence are uncorrelated with truth. Legal anchors if a professor wants stakes: *Mata v. Avianca* (S.D.N.Y. 2023 — six fabricated case citations, $5,000 sanction) and *Moffatt v. Air Canada* (2024 BCCRT 149 — airline held liable for a refund policy its chatbot invented).
**Worked example:** the deck's typed output is a canned recording (see playbook). Have one student ask their phone live. Two outcomes, both useful: (a) it invents a syllabus → the slide, live; (b) it hedges "I don't have access to TCE's specific syllabus, but typically…" and *then produces a typical syllabus anyway* → say: "the hedge is not knowledge — it still gave you Unit 3 content it never saw."
**Pushback:** "Newer models refuse unknowns more — isn't this solved?" — Abstention training improved (models increasingly decline questions that *look* unanswerable), but your syllabus looks exactly like something it should know, so pattern-completion wins. No model has a lookup table of what it knows; abstention is itself a learned guess.
**Landmine:** never say "models always hallucinate this" — a student's phone may hedge and you'll look stale. The talk track above absorbs both outcomes.

### Slide 4 · "Just paste all my notes!" — let's price that
**Claim:** pasting your corpus into every prompt fails on window, meter, and middle.
**Mechanism:** the slider computes real arithmetic: `pages × 500 tokens/page × $1.50 per 1M input tokens × ₹95.5`, at 30 questions/day (900/month). "The middle": empirically, long-context models retrieve facts placed at the start or end of the window far better than facts buried mid-window (the "lost in the middle" result — U-shaped position curve). More haystack actively hurts needle-finding.
**Worked example (whiteboard-reproducible ₹ arithmetic, Gemini 3.5 Flash — the free tier's current Flash, served as `gemini-flash-latest` — input @ $1.50/1M):**

| Pasted corpus | Tokens/question | ₹/question (input) | ₹/month @ 30 q/day |
|---|---|---|---|
| 20 pages (unit notes) | 10,000 | ₹1.43 | ₹1,289 |
| 120 pages (all five units) | 60,000 | ₹8.60 | ₹7,736 |
| 380 pages (the Galvin textbook) | 190,000 | ₹27.22 | ₹24,496 |

One line of math on the board: 190,000 ÷ 1,000,000 × $1.50 × ₹95.5 = **₹27.22 per question** — a month of doubts is ~₹24,500, five months of hostel mess bills, for *one student*, before output tokens.
**Pushback:** "Gemini 3.5 has a 1M window — it fits, so what's the problem?" — Correct, the *window* tax is gone for a textbook. The *meter* and the *middle* remain: see slide 14 for the full arithmetic, including context caching. "Fits" ≠ "free" ≠ "attended to."
**Landmine:** don't claim "it doesn't fit" as the main argument — with 1M windows that's stale. The deck's own verdict text says "even a 1M window takes it — your wallet and mid-window attention don't." Lead with meter + middle.

### Slide 5 · The insight
**Claim:** send the right 3 paragraphs, not everything.
**Mechanism:** this is precision engineering: any single question needs a tiny fraction of the corpus, so per-question relevance filtering beats per-question bulk transfer. Name the acronym here and never let it be mystical again: **R**etrieval, **A**ugmentation, **G**eneration — the rest of the morning builds R, then A; G they already own from Sessions 1–2.

### Slide 6 · Keyword search misses meaning
**Claim:** Ctrl-F/grep fails when question and answer share zero vocabulary.
**Mechanism:** keyword search matches *character strings*; the query "marks required to clear the subject" and the answer "minimum of 50% aggregate across internals and end-semester" have literally no content word in common. Classical IR patched this with stemming, synonym lists and BM25 (term-frequency scoring) — all still lexical. The real fix is representational: compare *meanings*, which requires putting meanings into a comparable space — embeddings.
**Worked example:** on the board, write both sentences and strike out shared words. There are none (only stopwords like "the"). Then: `grep -i "marks\|clear\|subject" notes.txt → 0 matches` — while the answer sits in the file.
**Pushback:** "So keyword search is obsolete?" — No. For exact identifiers (error codes, section numbers, names, `E501`), keyword search *beats* embeddings. Production search is usually **hybrid**: BM25 + semantic, scores fused. Google ran lexical + link-graph for 20 years before adding dense retrieval.
**Landmine:** don't oversell semantic search as "understanding." It measures geometric proximity of learned representations — the trap query on slide 8 shows it returning honest low scores, not comprehension.

### Slide 7 · Embeddings, now for whole paragraphs — THE core mechanism
**Claim:** the Session-1 trick (words → coordinates) works on whole chunks; search = cosine similarity, one numpy line.
**Mechanism, honest level deeper:** an embedding model is a transformer that reads the whole chunk, produces contextual vectors for every token, and **pools** them (mean/weighted) into ONE vector for the passage. It's trained **contrastively**: pairs that mean the same thing (question↔answer, paraphrase↔original) are pulled together; unrelated pairs pushed apart, over billions of pairs. Paraphrase-matching isn't a lucky side effect — it is literally the training objective. Individual dimensions mean nothing by themselves; only relative geometry carries meaning. Two API details worth knowing cold:
- **`output_dimensionality=768`** — gemini-embedding-2 is trained with **Matryoshka Representation Learning (MRL)**: information is front-loaded into the leading dimensions, so truncating the full-size vector (3072-dim on this family) to its first 768 and re-normalizing keeps most retrieval quality at ¼ the storage and ¼ the matmul cost. Quality-vs-cost is a *dial you choose*, not a fixed property.
- **`task_type`** — variants like RETRIEVAL_QUERY vs RETRIEVAL_DOCUMENT optimize the asymmetry between short questions and long passages. The lab skips this (defaults are fine at course scale) but know it exists.

**Worked example — cosine by hand, 3-dim toy vectors (do this on the board):**
Let dimensions be roughly (food-ness, breakfast-ness, hardware-ness):

```
idli = [0.9, 0.1, 0]    dosa = [0.85, 0.2, 0]    GPU = [0, 0.1, 0.95]

cos(a,b) = a·b / (|a||b|)

idli·dosa = 0.9×0.85 + 0.1×0.2 + 0 = 0.785
|idli| = √(0.81+0.01) = 0.906      |dosa| = √(0.7225+0.04) = 0.873
cos(idli, dosa) = 0.785 / (0.906×0.873) = 0.785/0.791 ≈ 0.99   ← neighbours

idli·GPU = 0 + 0.01 + 0 = 0.01     |GPU| = √(0.01+0.9025) = 0.955
cos(idli, GPU) = 0.01 / (0.906×0.955) ≈ 0.01                    ← strangers
cos(dosa, GPU) = 0.02 / (0.873×0.955) ≈ 0.02
```
Real vectors have 768 dimensions instead of 3; the arithmetic is identical.

**Why cosine, not Euclidean:** magnitude is an artifact (longer texts, token-frequency effects); direction carries the meaning. Board demo: double idli → `[1.8, 0.2, 0]`. Euclidean distance to dosa jumps from 0.11 to ≈0.95 ("far"!), cosine stays 0.99. Cosine is scale-invariant. And once you **normalize** every vector to length 1, the identity `‖a−b‖² = 2 − 2·cos(a,b)` means Euclidean and cosine produce *identical rankings* — which is why the lab normalizes once and then the entire search engine is a dot product: `scores = chunk_vecs @ qv`.
**Pushback (professor-grade):** (1) "Is one pooled vector per paragraph enough? What about token-level matching?" — Bi-encoders (this) trade fidelity for speed; production ladders add a **cross-encoder reranker** on the top-50, or late-interaction models (ColBERT) that keep per-token vectors. Correct architecture for a 60-line Saturday build and for most real products' first version. (2) "What does dimension 412 mean?" — Nothing interpretable; meaning is distributed. Interpretability of embedding dims is an open research area.
**Landmine (the #1 student bug after chunking):** query and chunks MUST be embedded by the SAME model (and same dimensionality). Mixing models is comparing coordinates from two different maps — scores become noise, silently.

### Slide 8 · The search playground
**Claim:** semantic search finds meaning-neighbours; real answers often span multiple chunks; low scores mean "nothing relevant here."
**Mechanism:** three lessons hide in the four canned queries: (1) "marks to pass" matches a chunk containing none of those words — pure meaning match; (2) "PC slow with many apps" scores TWO chunks (scheduling 0.62, thrashing 0.57) — answers span chunks, hence **top-k, not top-1**; (3) "attendance condonation" scores everything under 0.35 — the scores *tell you* the corpus lacks the answer. That's a thresholding insight: production systems refuse to answer below a similarity floor rather than stuffing junk context.
**Pushback:** "What's a good absolute threshold?" — There isn't a universal one; score distributions shift with model and domain. Calibrate per-corpus on a labeled set (an eval — Session 2's discipline).
**Landmine:** the playground's numbers and 2-D positions are authored (realistic, but written by hand). Say so if asked — see playbook 5. The lab computes real ones within the hour.

### Slide 9 · Chunking — the kingmaker
**Claim:** how you cut the document decides everything; paragraph + overlap is the boring default that wins.
**Mechanism:** a chunk's embedding is a pooled summary of everything in it. Too small → the fragment loses its own referents (pronouns, "the exam" of *what*?) — retrieval succeeds, the *model* can't use it. Too big → the vector drifts toward a generic "course policies" centroid; the one relevant sentence's contribution is averaged away and cosine with any specific query drops — **similarity dilution**. Lab defaults: `target=800` chars (≈200 tokens), `overlap=150` chars, split on paragraph boundaries first. Overlap exists so a thought that straddles a boundary survives whole in at least one chunk.
**Worked example — one real OS-notes passage, three knives.** Put this on screen or board:

> *"Round Robin assigns each process a fixed time quantum. A very small quantum wastes CPU on context switches. Assessment: each of the two internal exams carries 25 marks. To pass the course, a minimum of 50% aggregate across internals and the end-semester exam is required. Students who miss an internal for medical reasons may take a retest. It is capped at 20 marks."*

| Knife | Chunks produced | "Marks needed to pass?" | "Retest max marks?" |
|---|---|---|---|
| 1 sentence each | 6 tiny chunks | ✓ finds the 50% sentence (self-contained — got lucky) | ✗ retrieves "It is capped at 20 marks." — *what* is capped? The referent ("retest") lives in the previous chunk. Amputated context. |
| Paragraph + overlap | 1–2 chunks | ✓ complete thought retrieved | ✓ retest + cap arrive together |
| Whole pages | assessment buried in a 3-page "Course Policies" chunk with attendance, dress code, lab rules | similarity diluted (deck shows 0.31) — may lose the top-3 to a more focused chunk; even when retrieved, k=3 page-chunks ≈ 4,500 tokens of mostly noise per question | same |

**Pushback:** (1) "What's the optimal chunk size?" — No universal answer; it's an **eval question**: sweep sizes, measure retrieval hit-rate on a labeled test set (Stretch 1 is exactly this harness). (2) "Smarter ways than fixed size?" — Yes: semantic chunking (split on topic shift), heading-aware splitting, parent-document retrieval (search small chunks, return their bigger parent), rerankers. All post-course; all still lose to fixing a bad extraction first.
**Landmine:** say "chunking causes more RAG failures than model choice" — twice, it's the session's most useful sentence — but don't claim paragraph+overlap is *optimal*, only that it's the default that wins until an eval says otherwise.

### Slide 10 · Vector databases, in plain words
**Claim:** below ~100k chunks, a numpy array IS your vector database.
**Mechanism + worked latency estimate (be ready to defend the ~100k line):** 100,000 chunks × 768 dims × 4 bytes (float32) = **307 MB** — fits in RAM. One query = one matrix–vector multiply = 153.6M multiply-adds; on a laptop this is memory-bandwidth-bound: ~300 MB ÷ ~20 GB/s ≈ **15–30 ms**. Top-k selection (`np.argpartition`) adds ~1 ms. Meanwhile the network call to *embed the query* costs 100–300 ms — **numpy is never your bottleneck at this scale.** Scale ladder with storage: today's lab ≈ 6 chunks; full personal notes ≈ 300 chunks ≈ 0.9 MB; every TCE course ≈ 50k ≈ 154 MB — still numpy; English Wikipedia ≈ 30M chunks ≈ 92 GB — *now* buy the database.
**What FAISS/pgvector/Pinecone actually add:** approximate-nearest-neighbour indexes (HNSW graphs, IVF clustering) for sublinear search at millions of vectors — trading a little recall for a lot of speed — plus persistence, metadata filtering ("only chunks from doc X after date Y"), incremental updates, and concurrent access. Name-drops with one-liners: FAISS = Meta's similarity-search library · Chroma = dev-friendly local store · pgvector = vectors inside Postgres (often the right boring choice) · Pinecone/Weaviate = managed.
**Pushback:** "Then why do all tutorials start with a vector DB?" — Framework marketing and cargo-culting. Infrastructure should follow scale, not fashion. Building raw first is why these students will debug LangChain better than people who only learned LangChain.
**Landmine:** numpy-as-vector-DB is not a toy apology — it's production-honest at small scale. Don't undersell it.

### Slide 11 · RAG, end to end (the stepper — centerpiece)
**Claim:** one question's full journey: question → embed → cosine search → top-k → grounded template → cited answer.
**Mechanism:** two pipelines with different lifetimes: **ingest** runs once per document (chunk → embed → store), **query** runs per question (embed question with the SAME model → dot product → top-k → augment → generate). The only genuinely new idea in the whole session is the Augment stage — everything else they've touched already.
**Worked example — the actual round-trip (matches the lab code, reproducible verbatim):**

```python
MODEL = "gemini-flash-latest"  # the free tier's current Flash (July 2026 → Gemini 3.5 Flash); pin a dated id only if you need frozen behavior.

# ingest — once
res  = client.models.embed_content(model="gemini-embedding-2", contents=chunks)
vecs = np.array([e.values for e in res.embeddings])     # shape (n_chunks, dims)
vecs = vecs / np.linalg.norm(vecs, axis=1, keepdims=True)

# query — every question
qv = embed(["Can I pass with 12/25 internals?"])[0]; qv /= np.linalg.norm(qv)
scores = vecs @ qv                    # e.g. chunk2→0.81, chunk6→0.44, chunk3→0.12
prompt = RAG_TEMPLATE.format(context="[1] To pass: minimum 50% aggregate…\n[2] Mid-sem covers units 1–3…",
                             question="Can I pass with 12/25 internals?")
answer = client.models.generate_content(model=MODEL, contents=prompt).text
# → "Yes — possible. Passing needs ≥50% AGGREGATE… [1]"
```
Note what the generation model receives: **plain text**. It never sees a vector. Retrieval and generation are separable systems — embeddings from one provider + generation from another is completely standard.
**Pushback:** "Why does the answer cite [1] correctly — does the model know where facts came from?" — It sees the labels `[1]`, `[2]` inline in its context and learns (from instruction tuning) to attribute. Chunk-level citation is honest; sentence-level attribution is production polish and genuinely harder.
**Landmine:** the stepper's vector `[0.11, −0.87, …×768]` and its scores are representative, not live. Narration script is in playbook 7 — this slide is where the session is won or lost.

### Slide 12 · The grounded prompt template
**Claim:** three load-bearing lines turn retrieval into a trustworthy product.
**Mechanism — the exact failure each line prevents:**

| Line | Failure it prevents | Why it works |
|---|---|---|
| "Answer using ONLY the context below" | parametric leakage — training memories overriding your documents (failure mode 4) | shifts probability mass toward context-supported continuations; imperfect but measurable |
| "Cite which chunk, like [1]" | *invisible* hallucination | makes every claim checkable; users verify instead of trust — and attribution pressure itself disciplines generation |
| Escape hatch: "I don't know based on the provided documents." | silence-filling invention on out-of-corpus questions (the 9 a.m. villain) | gives the model a licensed high-probability output for "not found"; without one, the most probable continuation is a plausible fake |

Supporting cast: put context **before** the question (recency effects — the question stays fresh at generation time), and temperature 0 for factual retrieval answers.
**Worked example:** the A/B toggle on the slide IS the experiment: with the hatch → "I don't know based on the provided documents." Delete one line → "Attendance requires 75% as per university norms; condonation up to 65% with medical certificate…" — fluent, confident, invented. This is a two-cell eval; students rerun it for real in Part D of the lab.
**Pushback:** "Why does it STILL invent sometimes with all three lines?" — Grounding is probabilistic, not a firewall. Debug in order: did retrieval even deliver the right chunk (print scores)? Was the chunk amputated? Only then harden the prompt or drop temperature. Splitting the diagnosis: **retrieval hit-rate** vs **answer faithfulness** — separate metrics, separate fixes.
**Landmine:** never claim the template "prevents hallucination." It *measurably reduces* it. S6 will attack this exact prompt.

### Slide 13 · Where RAG breaks in the wild
**Claim:** four failure modes, each diagnosable and fixable.
**Mechanism + one concrete failing query each:**

| Mode | Concrete failing query | What happens | Fix |
|---|---|---|---|
| Vocabulary gap | "attendance shortage rules" vs notes saying "condonation policy" | retrieval scores low; escape hatch fires ("I don't know") even though the answer exists | LLM-rephrase the query, retrieve k=5, index chunk summaries (advanced: HyDE — embed a hypothetical answer) |
| Split answers | "Can I pass with 12/25 internals?" — rule in chunk 7, medical-retest exception in chunk 8 | confidently **incomplete** answer, correctly cited | overlap; retrieve neighbours of every hit; bigger k |
| Stale index | "What's in Unit 3?" after Monday's syllabus revision, embeddings from last month | confident, **cited**, outdated answer — RAG trusts its shelf | re-index on change (hash the file), store doc dates, show them in answers |
| Ignored context | context says internal = 25 marks; internet-average says 20; model answers 20 | parametric memory beats weak grounding | strengthen ONLY, T=0, context before question — then EVAL it |

**Debug order — retrieval → chunks → prompt → model — and why that order:** it's cheapest-observation-first and most-likely-culprit-first. `show_chunks=True` (printing scores + retrieved text) answers "did the right chunk arrive?" in 5 seconds and localizes ~80% of failures before you touch a prompt. Blaming the model first is the amateur move; the model is the *least* likely culprit and the hardest to change.
**Pushback:** "Which mode is most common in production?" — Stale index, by far, because it's the only one that gets *worse* over time silently. It ships working and rots.
**Landmine:** the stale-index example — "confident, cited, and out of date" — lands hardest with your fintech war story if you have a shareable one.

### Slide 14 · RAG vs paste-it-all vs fine-tuning
**Claim:** three tools, three jobs. Interview one-liner: "Fine-tuning teaches behaviour; RAG provides knowledge."
**Mechanism — the long-context arithmetic (this is the professor-bait slide; own the numbers):**
A 1M-token corpus, questioned 900 times/month, Gemini 3.5 Flash (`gemini-flash-latest`) input @ $1.50/1M, ₹95.5/USD:

| Strategy | Input tokens/question | ₹/question | ₹/month (900 q) |
|---|---|---|---|
| Paste 1M-token corpus every time | 1,000,000 | ₹143.25 | ₹1,28,925 (≈ ₹1.29 lakh) |
| Same, with context caching (≈ −90% on cached input) | 1,000,000 (cached) | ≈ ₹14.33 | ≈ ₹12,893 |
| RAG: top-3 chunks + template ≈ 800 tokens | 800 | ₹0.115 (+ ~₹0.13 for ~150 output tokens @ $9.00/1M) | ≈ ₹219 total |

Even *cached*, full-context costs ~59× more than RAG — and prefilling a 1M-token prompt adds tens of seconds of latency per question, versus sub-second for 800 tokens. Add freshness (re-embedding one changed file beats re-sending everything) and citations (RAG points at its chunk; long context points at "somewhere in the megabyte") and RAG survives the 1M era comfortably. Honest concession: for a *small, static* corpus queried rarely, long context is simpler and fine — and production systems increasingly combine both (retrieve 50 chunks into a roomy window).
**Fine-tuning, one level deeper:** further gradient updates on your examples (usually LoRA adapters — cheap, parameter-efficient). It's excellent at *behaviour*: format, tone, domain style, consistent JSON — patterns reinforced across many examples. It's terrible at *facts*: a fact seen a handful of times doesn't reliably become retrievable; knowledge freezes the moment tuning ends; there's zero provenance ("which document says this?" — unanswerable); and it risks degrading other abilities. "Fine-tune the model on our wiki" is the classic ₹-crore mistake — the wiki changes Tuesday, your weights don't.
**Pushback:** "When IS fine-tuning right?" — When an eval proves prompting + RAG can't hold a *behaviour* at your scale: strict output style, a domain register, tool-use reflexes for a small local model. It's rung 5 of the escalation ladder (S5): prompt → few-shot → RAG → tools → fine-tune.
**Landmine:** do not trash fine-tuning wholesale — professors may fine-tune models for research. The claim is precise: wrong tool *for facts*, right tool for behaviour.

### Slides 15–16 · Everywhere + hot take
**Claim (15):** support bots, NotebookLM-style tools, AI search engines, legal/medical assistants, enterprise wiki-chat — all this architecture. **(16, hot take):** "your final-year project is one grounded prompt away from being a startup."
**Mechanism:** the honest version of the claim: a large share of shipped AI products are retrieval + a grounded prompt around someone else's model. The defensible moat is the **data** and the **evals** — Madurai-specific corpora (Tamil-medium notes, local legal/agri/temple-trust documents) that no San Francisco team has, plus the S2 discipline to prove quality.
**Pushback (expect it — the slide invites it):** "If it's one prompt, there's no moat and no startup." — Correct that the prompt is not the moat. The moat is proprietary data, distribution, and eval-verified quality on a niche. Same as most SaaS: the CRUD was never the moat either. Park longer debate to the break; name the best counter-argument at close.
**Landmine:** "most AI products are RAG" is a defensible characterization, not a measured statistic — phrase as "most of what you've used."

### Slides 17–20 · Lab architecture, recap flips, lab brief, break
**Claim (17):** two pipelines — ingest once per document, query forever; ~60 lines total.
**Mechanism:** the split matters economically: ingest cost is amortized (paid once per document), query cost is marginal (paid per question) — which is exactly why RAG beats paste. **Worked example — ₹ cost of embedding a student's 40-page notes corpus:** 40 pages × 500 tokens ≈ 20,000 tokens → on the AI Studio free tier: **₹0**. Even priced at the chat model's input rate ($1.50/1M, Gemini 3.5 Flash — an upper bound; embedding rates didn't move in the 2026 re-base): 20,000 ÷ 1M × $1.50 × ₹95.5 ≈ **₹2.87 — once**. The store: ~80,000 chars ÷ 800-char chunks ≈ 100–115 chunks × 768 dims × 4 B ≈ **0.34 MB**. Total infrastructure: a numpy array smaller than one photo.
(18): flip cards — make the class say each answer before clicking. (19): lab brief — see timing map; push the capstone framing hard: documents they actually care about. (20): bridge — "your AI now knows what you know; after lunch it gets hands" (S5 tools).

---

## 3 · Demo playbooks

General fallback: the deck is fully offline/self-contained. If the projector dies, the cosine hand-calc, the ₹ table, and the chunking passage above are the whiteboard versions of demos 3, 5, 6.

| # | Demo (slide) | What it actually computes | Click sequence | The reveal sentence | Fallback / if called out |
|---|---|---|---|---|---|
| 1 | Recap quiz (2) | Real quiz logic; your click advances (6 s auto-fallback) | 4 questions, class votes before each click | On Q4: "THAT gap is what we fix this morning." | Read questions aloud; hands up |
| 2 | Not-know typer (3) | **Simulated** — a canned recording of typical model behaviour (typewriter effect), then the stamp | Click *Ask ›* once; let it type to the end — the stamp lands last | "It cannot know. Notice it didn't say that." | Invite a student to ask their phone live; if it hedges: "the hedge is not knowledge — it still invented Unit 3" |
| 3 | Cost slider (4) | **Real arithmetic in JS**: pages × 500 tok × $1.50/1M × ₹95.5, ×900 q/month | Drag slowly to 380 ("the Galvin textbook"); pause | Read the ₹/month figure aloud, slowly | Whiteboard the one-line multiplication (§2, slide 4) |
| 4 | Keyword vs semantic (6) | **Canned outputs** (the grep result is faithful to real grep) | *Ctrl-F keyword* first → 0 matches → pause → *Semantic* | "Zero shared words — and you already know a machine that maps meaning to coordinates…" (let them shout it) | Strike out shared words on the board — there are none |
| 5 | Search playground (8) | **Simulated** — authored scores + hand-placed 2-D positions (realistic ranges); the lab computes real ones | All 4 queries in order; linger on Q2 (two green chunks) and Q4 (all bars low) | Q2: "Real answers span chunks — that's why top-k, not top-1." Q4: "Every bar under 0.35 — the scores admit ignorance." | "These numbers are authored to be typical — in 40 minutes you'll compute real ones on your own notes." True 2-D maps of 768-dim spaces are projections anyway |
| 6 | Chunking knives (9) | **Canned** miniatures of the three failure modes | Tiny → Huge → **Medium last** (the winner lands last) | "More RAG failures come from chunking than from model choice." Say it twice | The chunking passage table (§2, slide 9) on the board |
| 7 | RAG stepper (11) — centerpiece | **Simulated but faithful** — representative vector, plausible scores, real template text | Step through all 6 slowly; at stage 5 stop: "the whole industry is THIS prompt." At stage 6 click the [1] citation — source chunk flashes | "Grounded, cited, checkable." Then run the whole stepper a second time, faster, narrating over it | If asked "is this live?": "It's a faithful trace — the lab runs the identical pipeline live on your documents" |
| 8 | Escape-hatch A/B toggle (12) | **Canned** WITH/WITHOUT outputs — an honest dramatization of a reproducible experiment | Ask the class to predict first, then *Delete the escape hatch* | "One deleted line and it's 9 a.m. all over again — remember the stamp." | Part D of the lab is this exact A/B, live, on their docs |

Flip cards (slides 13, 17): not simulations — just reveals. Rule: the class (or you) states the answer *before* the click.

---

## 4 · Q&A bank

1. **"Why cosine similarity and not Euclidean distance?"** — Direction carries meaning; magnitude carries artifacts like text length. Double a vector and Euclidean says "far" while the meaning didn't change; cosine is scale-invariant. And once you normalize to unit length, ‖a−b‖² = 2−2cos(a,b), so both give identical rankings — which is why we normalize once and search becomes a dot product.
2. **"Do the query and the chunks really need the same embedding model?"** — Yes, non-negotiable. Each model defines its own coordinate system; comparing vectors across models is comparing latitude from one map with longitude from another. Same model, same dimensionality, or your scores are noise. (Generation can be a different model entirely — that's standard.)
3. **"Gemini has a 1M-token window. Doesn't that kill RAG?"** — Do the math: 1M tokens re-sent per question is ₹143.25 a question, ~₹1.29 lakh a month at 30 questions a day; even with context caching at minus-90% it's ~₹12,900 — versus about ₹219 for RAG. Add tens of seconds of prefill latency, no citations, and re-sending stale data versus re-indexing one file. Real systems combine both: retrieve generously into a roomy window.
4. **"Why not fine-tune the model on our notes instead?"** — Fine-tuning teaches behaviour — style, format, tone — not facts. A fact seen once doesn't become reliably retrievable, the knowledge freezes the day you tune, and there's no citation trail. Your syllabus changes next semester; RAG re-indexes in a minute, a fine-tune is a re-training bill.
5. **"What does a paragraph's embedding actually represent?"** — A transformer reads the passage, builds contextual vectors for every token, and pools them into one vector, trained contrastively so paraphrases land close. It's a learned summary of meaning-in-context — no single dimension means anything alone; only the geometry does.
6. **"How is this different from how Google search works?"** — Classical Google is lexical: inverted index + term statistics (BM25) + link authority. Semantic search is dense retrieval: geometry over learned representations. Modern engines are hybrid — and "AI search" products are literally RAG at web scale: search results become the context, the answer cites them.
7. **"What if two retrieved chunks contradict each other?"** — The model will pick one or blend them, and the template doesn't save you. The engineering answer: surface both with document dates and let the human decide — which is also the fix for the stale-index failure. Contradiction detection is a genuinely open problem.
8. **(Professor)** "One pooled vector per chunk seems lossy. What's the state of the art?" — Correct: bi-encoders trade fidelity for a single matmul of speed. The production ladder adds a cross-encoder reranker over the top-50 candidates, or late-interaction models like ColBERT that keep per-token vectors. For this scale, the bi-encoder alone is the right engineering call — and it's what most shipped products run first.
9. **(Professor)** "How do you evaluate a RAG system rigorously?" — Split it: retrieval hit-rate (did a chunk containing the answer arrive in top-k — measurable with a labeled set, no LLM needed) versus answer faithfulness (did the generation stick to the chunks — usually LLM-as-judge, e.g. the RAGAS-style metrics). Diagnose separately, fix separately. Stretch 1 of today's lab is a miniature of exactly this.
10. **"Why 768 dimensions? Would 3072 be better?"** — The model is Matryoshka-trained: information is front-loaded so the first 768 dims keep most retrieval quality at a quarter of the storage and compute. More dims = slightly better quality, 4× the bytes and matmul. It's a measurable dial: run your eval at both and pay for what the numbers justify.
11. **(Cross-session, S2)** "I changed my chunk size and answers 'feel' better. Ship it?" — "Feels better" is three anecdotes; users bring three thousand. Run the eval harness from Session 2: fixed question set, expected key facts, normalized-contains scorer, one number before and after. Change one variable at a time. That habit is the actual job.
12. **(Cross-session, S6)** "Can a document attack my RAG system?" — Yes — indirect prompt injection: someone hides instructions in a PDF your pipeline retrieves ("ignore your rules and…"), and your own retrieval feeds the attack into the context. OWASP ranks prompt injection as LLM01, the #1 risk for LLM apps, with no complete fix — only layered defenses. Session 6 attacks today's exact notebook.
13. **"Why does it say 'I don't know' when the answer IS in my documents?"** — Retrieval missed — usually a vocabulary gap between your phrasing and the document's. Print the scores: if the right chunk isn't in top-k, the model never saw it. Rephrase the query, raise k, or fix chunking. Debug retrieval before touching the prompt.
14. **"Which is the best vector database?"** — Below ~100k chunks the honest answer is numpy — 300 MB and a 20 ms matmul. Past that, pgvector if you already run Postgres, FAISS/Chroma for a library, managed services when ops matter more than money. Choose by scale and team, not by leaderboard.

---

## 5 · Misconception table

| # | Students walk in believing… | The one-line correction |
|---|---|---|
| 1 | "Uploading my PDF teaches the model" | Nothing updates weights — the file enters *context* and is forgotten after the call; that's why we must re-retrieve every question. |
| 2 | "Embeddings are fancy keywords" | They're coordinates of meaning learned from context of use — that's why zero-shared-word paraphrases match. |
| 3 | "Bigger chunks = more context = better answers" | A chunk's vector is a pooled average — stuffing it dilutes similarity until the right sentence drowns. |
| 4 | "RAG requires a vector database" | Below ~100k chunks a normalized numpy array IS the database (one 20 ms matmul). |
| 5 | "It cited a source, so it's correct" | Citations make answers *checkable*, not true — a stale index gives confident, cited, wrong answers. |
| 6 | "Fine-tuning is how you add knowledge" | Fine-tuning teaches behaviour; RAG provides knowledge — facts in weights freeze instantly and carry no provenance. |
| 7 | "Semantic search understands my question" | It measures geometric closeness, nothing more — split answers and out-of-corpus queries prove there's no reasoning inside. |
| 8 | "1M-token windows make all this obsolete" | ₹143.25 per question re-sent vs ~₹0.24 retrieved — the meter and the middle survive the big window. |

---

## 6 · Timing pressure map

Deck budget 97.5 min (DATA array) inside a 2:00 slot: talk ≈ 42.5 min, lab 50 min, close 3 min. Slack is nearly zero — protect the lab.

**Where this session historically bleeds:**
- **Recap quiz replays** (slide 2) — one pass only; resist the replay button.
- **Playground** (8, 3.5 min) — four queries is the cap; don't take "try my query" requests (park to lab, where they'll do exactly that on real data).
- **Stepper questions** (11, 4 min) — mid-stepper questions derail the narrative; say "hold it two slides — the failure slide answers most of these."
- **Hot-take debate** (16, 1.5 min) — take ONE counter-argument, park the rest to break. This slide can eat 10 minutes if you let it.

**Marked compressible (▸ in presenter mode):** slide 10 (vector DBs — the ladder can be one sentence), 14 (RAG vs fine-tune — the table reads itself; keep only the one-liner), 15 (everywhere — 30 seconds), 16 (hot take — read once, 3 s silence, move).

**Never cut:** slide 3 (the villain — the whole morning's emotional anchor), 9 (chunking — they hit it in lab within the hour), 11 (the stepper — the session), 12 (escape-hatch A/B — the punchline), the 50-minute lab, and the checkpoint sweep at 1:30.

**Lab-hour triage (from the run sheet, still accurate):** #1 sink is garbage PDF extraction (pypdf reads text layers, not scans — swap doc or screenshot→S3 vision); search junk is 90% chunking; removed `time.sleep(1)` meets 429; "I don't know" failing = strengthen ONLY + hatch and A/B it. Collect two honest failures for show & tell.

---

## 7 · Going deeper (weekend reading)

1. **Lewis et al., 2020 — "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."** Where the name comes from; note the original was trained end-to-end — today's "prompt-stapling RAG" is a simpler descendant. Useful when a professor asks about the term's origin.
2. **Liu et al., 2023 — "Lost in the Middle: How Language Models Use Long Contexts."** The evidence behind the "middle tax" on slide 4 — U-shaped accuracy by position. Your citation if anyone challenges the claim.
3. **Kusupati et al., 2022 — "Matryoshka Representation Learning."** Why `output_dimensionality=768` works: nested representations, front-loaded information. Short and readable.
4. **Reimers & Gurevych, 2019 — "Sentence-BERT."** The clearest explanation of how sentence/paragraph embeddings are trained contrastively with pooling — the mechanism behind slide 7.
5. **Malkov & Yashunin — the HNSW paper ("Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs").** Exactly what you buy when numpy stops being enough — the algorithm inside most vector DBs.
6. **Gemini API embeddings docs (ai.google.dev/gemini-api/docs/embeddings).** Current model names, `task_type` values, dimensionality options, free-tier limits. Re-read the morning of — this page moves.

---

## 8 · Day-before verification

| Claim in deck/lab | Check |
|---|---|
| `gemini-embedding-2` is current; `gemini-embedding-001` shut down 2026-07-14 (already past — old tutorial code now fails, which is itself a teachable moment) | ai.google.dev/gemini-api/docs/embeddings |
| Notebook Cells 1–7 run end-to-end on a real lecture PDF | run it yourself, day before |
| Batch of 20 + `time.sleep(1)` stays under free-tier RPM (~10 RPM-class typical free-tier chat limits — check the live rate-limits page; embed limits differ) | observed during your run |
| `gemini-flash-latest` resolves on every key in the room — new free-tier keys 404 on dated `gemini-2.5-*` ids ("no longer available to new users"); existing keys still serve them; the alias covers both (July 2026 → Gemini 3.5 Flash) | run the notebook's first cell on your key + one fresh student key |
| pypdf extracts your test PDF; also test one *scanned* page so you can demo the failure | your own machine |
| Slider economics: $1.50/1M input (Gemini 3.5 Flash), ₹95.5/USD, 900 q/month — matches deck footer | deck slide 4 footer text |
| Backup: 3 spare lecture PDFs for students who brought nothing | your drive, downloaded |

---

## The depth layer — 4 `<|deeper|>` panels in this deck

Collapsed by default, so they cost the clock nothing. Press **D** on a slide to open every panel on it (or click the panel's mono label). Each is also flagged in the presenter notes as `[D] deeper:`.

Open one when a student asks the question the slide provokes, or when you are running ahead. Never open one because it is there — the main line is the promise; this is the ceiling.

| Deck slide | Slide | Panel |
|---|---|---|
| `#7` | Embeddings, now for whole paragraphs | why that one line is allowed to be that short |
| `#9` | Chunking: how you cut the book | four upgrades once paragraph-with-overlap stops being enough |
| `#11` | RAG, end to end | the stage production adds between retrieve and augment |
| `#13` | Where RAG breaks in the wild | debugging this properly: two scores, never one |

Prose versions of all of these, with the same section order, are in `LEARNING-GUIDE.md` **Part 8**. If you read one thing before delivery day, read the Part 8 sections matching this deck — they are written so you can improvise a whiteboard answer, not just recite the panel.
