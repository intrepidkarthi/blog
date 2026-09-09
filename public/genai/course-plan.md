# Generative AI: Foundations and Applications
### One-credit course · 3rd & 4th year BE CSE · Thiagarajar College of Engineering, Madurai
**Instructor:** Karthikeyan Natarajan Gnanapalam (TCE CSE '09) · **Total: 12 hours · 6 sessions × 2 hours**

**Delivery format: weekend bootcamp.** Two consecutive days (Saturday and Sunday — 19–20 September 2026 at TCE), with three protected two-hour instructional blocks per day. The published timetable must include breaks and lunch **outside** those six instructional hours; do not run the blocks back-to-back without recovery time. **Day 1:** S1 → S2 → S3. **Day 2:** S4 → S5 → S6. Students complete account and access checks before Day 1; the labs handle the remaining preparation. The only overnight task is to gather 2–3 non-sensitive documents (notes or PDFs) for Day 2's RAG build. The capstone is a deliberately small in-session sprint in S6, not a take-home production project. See `TIMING.md` for the delivery contract and the fallback plan.

---

## Design principles

1. **Every session ships something.** Students leave each session with working code in their own Colab.
2. **Intuition before jargon.** Analogies first, terms second. The main line stays math-free — but it is not capped there (see *The depth layer* below).
3. **Honest engineering.** Cover failure modes (hallucination, injection, cost) as first-class content, not footnotes.
4. **Zero local install.** Google Colab plus the live API path, with an offline path built into every notebook: `MOCK = False` in Cell 1; set it `True` and every cell runs on canned responses prefixed `[MOCK]` (Lab 4 uses a hashed bag-of-words embedding so search still works). Works on a browser-capable college machine, subject to account, network, and provider availability.

## The depth layer

The audience is 3rd- and 4th-year CSE students who have already done linear algebra and probability. Pitching everything at analogy level wastes that, but adding mechanism to the main line would blow a 12-hour budget that is already tight. So depth is a **second layer, not a longer first one**.

Every deck carries collapsible `<|deeper|>` panels — **21 of them across the six sessions** — sitting under the slide they belong to. Collapsed by default, so they cost the running clock nothing; press **D** (or click the panel label) to open every panel on the current slide. Each one is flagged in the presenter notes as `[D] deeper:` with a one-line summary, so the instructor can decide in the moment.

They exist for three situations: a sharp student asks the question the slide provokes ("but where do the probabilities come from?"), the room is running ahead of the clock, or a student revisits the deck after the session. `LEARNING-GUIDE.md` **Part 8** is the same material in prose, section-by-section cross-referenced to the panel it matches.

What's in them: logits/softmax/top-k/top-p · cross-entropy loss and perplexity · positional encoding (RoPE) and attention's n² cost · scaling laws and the Chinchilla correction · MoE, distillation, quantization · the KV cache, prefill vs decode, TTFT · precision/recall/F1 and LLM-judge position bias · eval sample size (±1/√n) · ViT patches and vision's token bill · what a diffusion model actually predicts · constrained decoding · embedding pooling, normalization and task types · chunking upgrades and filter-before-rank · reranking, bi- vs cross-encoders, hybrid search · recall@k / MRR / faithfulness · the tool-use wire format · agent loop guards and trajectory eval · quantization arithmetic for local models · why prompt injection has no escape character, and the three-legged exfiltration model · the input/output price asymmetry and cost-per-user · p50/p99 latency and what to log.

None of it is examinable and none of it is required. It is there so the ceiling of the course is set by the student, not by the slide.

## Session structure (every session)

| Segment | Time |
|---|---|
| Hook + recap of last session | 8 min |
| Talk with live interactive demos (HTML deck) | 48 min |
| Lab (hands-on, pair-friendly) | 50 min |
| Show & tell + wrap + next-session teaser | 14 min |
| **Total** | **120 min** |

Session 1 is the exception on paper: after the September 2026 cut (the tokenizer/embeddings/attention mechanism slides collapsed into one, because `how-llms-work.html` now carries them), its deck budgets 58.5 min of hook + talk, 50 min of lab and 7 min of wrap, leaving ~4.5 min of reserve for the API-key sink. Session 6 is the other exception — see below.

---

## Session 1 — How Machines Learned to Talk
*Covers original topics: 1 (What is Generative AI?)*

**Talk — core:** discriminative vs generative AI, the terminology map (AI ⊃ ML ⊃ GenAI ⊃ LLM; app ≠ model), next-token prediction, parameters, training vs inference, tokens, embeddings, attention, model failure modes, and what an API call actually is. **Optional/depth:** pretraining → instruction tuning → RLHF, reasoning-model economics, detailed model comparisons, and the no-memory implementation detail. Protect the core mental model and the API lab if the room is behind.

**Interactive deck demos:** next-token prediction game, live tokenizer visualizer, 2D embedding map, attention hover demo, temperature slider.

**Lab 1:** Get Gemini API key from AI Studio. First API call in Colab. Run 5 structured prompts. Same prompt across 3 models (Gemini API + 2 free web UIs) — document the differences.

**Student leaves with:** a working API key, first script, and the "it's all next-token prediction" mental model.

---

## Session 2 — Talking to AI, and Catching Its Lies
*Covers original topics: 2 (Prompt Engineering) + 3 (Evaluation)*

**Talk:** Anatomy of a good prompt: role, task, context, format, examples. Zero-shot vs few-shot. Step-by-step reasoning. Temperature and why the same prompt gives different answers. Common mistakes. Then the honest turn: models make things up — so how do engineers *know* a prompt is better? Test sets, scoring, side-by-side comparison. "It looked good in the demo" is not evaluation.

**Lab 2:** Two-part lab. (a) Take a deliberately bad prompt, improve it in 5 documented iterations. (b) Build a 10-question checker: expected answers vs model answers, auto-scored. Compare your prompt v1 vs v5 with numbers, not vibes.

**Student leaves with:** a prompt playbook + a working eval harness (their first "AI engineering" artifact).

---

## Session 3 — AI Beyond Text
*Covers original topic: 4 (Images, Voice, Video)*

**Talk — core:** multimodal input, image/document understanding, structured extraction, speech-to-text, and the limits of vision models. **Optional/depth:** diffusion internals, image generation, text-to-speech, and the mid-2026 video landscape. These topics are useful context but should not displace the document-extraction lab.

**Lab 3:** Multimodal Colab: upload a photo → ask questions about it. Extract structured data from a photographed document/receipt. Stretch: voice-note transcription → summary pipeline.

**Student leaves with:** a vision-powered app and the realization that "AI that sees" is one function call.

---

## Session 4 — Giving AI Your Own Knowledge
*Covers original topics: 5 (Embeddings & Search) + 6 (RAG)*

**Talk:** The model doesn't know your college, your notes, your company. Context window as the model's "working memory." Embeddings recap → semantic search: turning documents into vectors, finding similar chunks. Vector databases in plain terms. Then RAG: retrieve → stuff into prompt → answer with sources. Why this powers ~80% of real AI products. Where RAG fails (bad chunks, wrong retrieval, stale data).

**Lab 4:** Build "chat with my notes" end-to-end: chunk your own PDFs/notes → embed → search → feed top chunks to Gemini → answer with citations. All in one notebook.

**Student leaves with:** a working RAG app over their own study material — the single most employable skill in this course.

---

## Session 5 — Making AI Do Things
*Covers original topics: 7 (Tools & Workflows) + 8 (Choosing the Right Approach)*

**Talk:** Text-only AI is a brain in a jar. Tool use: the model decides *which* function to call, your code executes it. Calculator, search, database, email. Workflows vs agents — the honest lesson: most problems need a fixed pipeline, not an autonomous agent. Then the decision framework: better prompt → few-shot → RAG → tools → fine-tuning, in that order of escalation. Open vs closed models; running models locally with Ollama (live demo).

**Lab 5:** Build an assistant with 2–3 tools (calculator, web search, file reader) using Gemini function calling. Then: 3 scenario cards — pick the right approach for each, justify in writing.

**Student leaves with:** a tool-using assistant + a decision framework they can defend in an interview.

---

## Session 6 — Breaking AI, Securing It, and Shipping It
*Covers original topics: 9 (Security & Safety) + 10 (Shipping a Real Product) + Capstone demos*

**Talk:** Live attacks they'll never forget: prompt injection, jailbreaking, data leakage, hallucinated citations. Defense: input validation, output checking, guardrails, human-in-the-loop. Then production reality: cost per call, latency, rate limits, logging, retries, streaming UX. What changes between a notebook and a product.

**Lab 6, red-team round (~30 min):** students attack each other's Session 4 RAG apps with injection payloads, then patch the holes.

**Capstone sprint + demos (~50 min):** in pairs, extend the app you already built today (S4 RAG app or S5 assistant) with **one more course technique** — e.g., add tool use to your RAG app, add an eval set to your assistant, or bolt vision onto either. Then 2–3 minute demos: what it does, one failure you found, one fix you made. (S6 deviates from the standard session timing: the talk is compressed to ~40 min before the capstone block, which then runs as ~30 min of red-teaming plus ~35 min of demos and a short close.)

**Student leaves with:** a security mindset, a working prototype, and a credible starting point for a portfolio or final-year project.

---

## Capstone (bootcamp format: an in-session sprint, not a take-home)

Seeded end of Day 1 ("start thinking about what you'd build"), data gathered overnight (students bring their own documents), foundation built in S4/S5 labs, extended + hardened + demoed in S6. Requirement: your Day-2 app combining **at least two course techniques**, with (1) a 10-example eval set with scores, (2) one documented failure mode + mitigation. Solo or pairs.

**Grading suggestion (100):** Working demo 40 · Eval set with honest numbers 25 · Failure analysis 15 · Technique fit (right tool for the job) 10 · Presentation clarity 10.

**Optional stretch:** students who want a bigger portfolio piece can keep building after the weekend and submit a video demo within a week — grade the in-session version, bonus for the polished one.

## College project bridge

The weekend is a foundation and prototype sprint, not a complete final-year project. After the course, students should choose one bounded track from `COLLEGE-PROJECT-TRACKS.md`: study-notes RAG, codebase RAG, multimodal document QA, an evaluation/observability dashboard, a department knowledge service, or a subject tutor. Each track requires a user, permitted data source, baseline, labelled evaluation set, failure report, cost/latency note, and safe demo. The browser version is `COLLEGE-PROJECT-TRACKS.html`.

**Recommended extensions rather than extra weekend lectures:**

- Use the external AI Engineering from Scratch curriculum selectively for classical ML evaluation, self-attention, tokenizer construction, context engineering, tool protocols, and observability.
- Add these as pre-reading or post-course tracks, not as additional required material in the 12-hour schedule.
- Students should build a small version first, compare it with the production library/API, then ship a measured artifact.

---

## Materials per session

| Item | File |
|---|---|
| Interactive HTML deck | `presentations/session-N-*.html` |
| Instructor prep pack (study before) | `instructor-notes/session-N-prep.md` |
| Instructor run sheet (delivery day) | `instructor-notes/session-N-notes.md` |
| Student lab handout | `labs/session-N/lab-handout.md` |
| Ready-to-run Colab notebook | `labs/session-N/session_N_lab.ipynb` |
| 1-page cheatsheet | `cheatsheets/session-N-cheatsheet.md` |

## Tech decisions (verified 8 September 2026)

- **SDK:** `google-genai` (`from google import genai`) — the current unified SDK; old `google-generativeai` is deprecated.
- **Default model:** `gemini-flash-lite-latest` — the alias for the free tier's current Flash Lite (Gemini 3.5 Flash Lite as of September 2026; no newer Lite exists — resolve it live the week before and record the result in `fact-check.md`). The alias is deliberate: dated ids age out — `gemini-2.5-flash` returned "no longer available to new users" on fresh keys in July–August 2026 (observed on fresh keys; not in Google's docs, no shutdown date published) while older accounts still had it, and the alias serves both, so a mixed room just works. Lite is deliberate too: the `gemini-flash-latest` alias is hot-swapped on every release and currently resolves to a thinking Flash model (3.7 Flash GA 13 Aug 2026, 3.8 Flash GA 2 Sep 2026 — check with `client.models.get`). One measured session on it billed 28,089 invisible reasoning tokens against 2,770 visible ones, 91% of the output charged. On Gemini 3.x the numeric `thinking_budget` is rejected (400 INVALID_ARGUMENT); `thinking_level="minimal"` exists on 3.5/3.6 Flash but not on 3.7/3.8 Flash, so on a free-tier key that alias burns the output quota roughly an order of magnitude faster and answers arrive slower. Flash-Lite defaults to minimal thinking and was verified for vision, function calling, streaming, `response_schema` and `max_output_tokens`, which covers every lab. `temperature`, `top_p` and `top_k` are deprecated on Gemini 3.x since 21 Jul 2026 (still accepted as of August — re-verify the Lab 1 temperature demo on the pre-class run). An alias can move under you like that inside a month, which is exactly why the course pins the lite alias and re-verifies it on a real key before teaching. Typical free-tier limits: ~10 requests/min, a few hundred/day per key — ample when each student has their own key; Google no longer publishes fixed per-model numbers, so confirm your project's live limits in AI Studio. Since September 2026 the API rejects the older "Standard" keys: new AI Studio keys are auth keys automatically, but regenerate instructor/demo keys created before the change, and a student with an existing Google Cloud account must import a project in AI Studio before "Get API key" works. Notebooks use a single `MODEL` variable; pin a dated id only if you need frozen behavior. Check current list: https://ai.google.dev/gemini-api/docs/models
- **Embeddings (S4):** `gemini-embedding-2` via the same SDK (GA 22 Apr 2026; $0.20 per 1M text tokens). The lab passes `output_dimensionality=768` (the default is 3072) and wraps each chunk in `types.Content` — a bare list of strings is aggregated into one embedding. `gemini-embedding-001` is not shut down (still available for text; earliest shutdown 14 May 2028), it is simply superseded.
- **Local models (S5):** Ollama demo on instructor laptop (pre-pull a small model; don't rely on college bandwidth).

## Currency, alignment & future-proofing

This course's spine — LLM fundamentals → prompting → evaluation → RAG → tools/agents → production & security — matches how GenAI is taught across 2026's leading curricula (IBM's RAG & Agentic AI certificate, the major LLM-engineering courses, the frontier labs' own material) and what employers expect: chunking strategies, embedding selection, vector DBs, citations, failure-mode analysis, golden-dataset evals, regression testing, function calling, workflow orchestration, and cost/latency/observability.

**Deliberate pedagogy: build raw, then name the frameworks.** Where most bootcamps teach LangChain/LlamaIndex/CrewAI first, this course builds RAG as a numpy array and tools as plain Python functions — so students understand the machinery before an abstraction hides it. Frameworks, LoRA/QLoRA, and LLMOps tooling are named as honest "next steps" (see `LEARNING-GUIDE.md` §7.2), not taught, keeping the 12 hours focused on durable fundamentals.

**Where this goes deeper than a typical 2026 syllabus.** Most short GenAI courses stop at "temperature controls creativity" and "RAG retrieves relevant chunks." The depth layer takes the same 12 hours down to mechanism — the softmax that temperature divides, the KV cache behind every latency and caching claim, the n² curve that makes long context expensive, the bi-encoder/cross-encoder split that justifies reranking, and the structural reason prompt injection has no fix. Reranking, hybrid search, retrieval metrics (recall@k, MRR, faithfulness), agent trajectory evaluation, and quantization arithmetic are typically absent from introductory syllabi entirely; here they are one keypress from the slide that motivates them.

**Future-proofing:** model names, prices, free-tier limits, and fashionable frameworks change every few months; tokens, embeddings, attention, evaluation, retrieval, tool use, and security failure modes do not. The course is built on that stable layer, with one `MODEL` variable per notebook for the single thing that changes. `LEARNING-GUIDE.md` §7.3 makes this explicit for students — it's the most valuable idea in the course.

## Risk / fallback plan

- **College Wi-Fi dies:** decks are fully offline (single HTML files, no CDN). Keep one mobile hotspot; labs degrade to instructor-driven demo + students run at home.
- **AI Studio blocked / sign-up friction:** set `MOCK = True` in Cell 1 of the notebook — every cell then runs on canned `[MOCK]` responses (Lab 4's search still works on a hashed bag-of-words embedding) — or run a controlled demonstration; do not distribute shared keys or ask students to create extra accounts.
- **Rate limits (429):** every notebook's `ask()` retries with backoff, but retries are bounded; when a quota is exhausted, flip the pair to `MOCK = True` instead of repeatedly rerunning.
- **Slow machines:** everything runs in Colab's cloud — local specs don't matter. See `ZERO-SETUP.md` for the full any-laptop/zero-cost guarantee.
