# Generative AI: Foundations and Applications
### One-credit course · 3rd & 4th year BE CSE · Thiagarajar College of Engineering, Madurai
**Instructor:** Karthikeyan Natarajan Gnanapalam (TCE CSE '09) · **Total: 12 hours · 6 sessions × 2 hours**

**Delivery format: weekend bootcamp.** Two consecutive days (Fri+Sat or Sat+Sun), three sessions per day, back-to-back with 10–15 min breaks and a lunch gap. **Day 1:** S1 → S2 → S3. **Day 2:** S4 → S5 → S6. What this format changes: no homework between sessions — all prep happens inside the labs (e.g., the 10-question test set is written in Lab 1's final 10 minutes, ready for Lab 2). The single overnight gap has exactly one job: students gather 2–3 of their own documents (notes, PDFs) for Day 2's RAG build. The capstone becomes a scoped in-session sprint in S6, not a take-home.

---

## Design principles

1. **Every session ships something.** Students leave each session with working code in their own Colab.
2. **Intuition before jargon.** Analogies first, terms second, math never (this course).
3. **Honest engineering.** Cover failure modes (hallucination, injection, cost) as first-class content, not footnotes.
4. **Zero-install.** Google Colab + Gemini free tier. Works on any college machine with a browser.

## Session structure (every session)

| Segment | Time |
|---|---|
| Hook + recap of last session | 8 min |
| Talk with live interactive demos (HTML deck) | 48 min |
| Lab (hands-on, pair-friendly) | 50 min |
| Show & tell + wrap + next-session teaser | 12 min |

---

## Session 1 — How Machines Learned to Talk
*Covers original topics: 1 (What is Generative AI?)*

**Talk:** Discriminative vs generative AI, and the terminology map (AI ⊃ ML ⊃ GenAI ⊃ LLM; app ≠ model). The one idea behind everything: predict the next token. The basics most courses skip: it's NOT a database (nothing stored, nothing looked up), what a parameter is (students hand-train a 2-knob model), training vs inference ("does it learn from my chats?"), and the no-memory truth (apps re-send the whole conversation). Tokens (Tamil vs English cost). Embeddings as coordinates. Attention as "which words look at which." Pretraining → instruction tuning → RLHF. The mid-2026 landscape. What LLMs are bad at, and why. What an API call actually is (before the lab).

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

**Talk:** How image generation works — the noise-to-picture intuition (diffusion). Vision models: AI that reads photos, documents, handwriting. Speech-to-text and text-to-speech. Video generation state of play (mid-2026). What multimodal means in one API call.

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

**Capstone sprint + demos (~50 min):** in pairs, extend the app you already built today (S4 RAG app or S5 assistant) with **one more course technique** — e.g., add tool use to your RAG app, add an eval set to your assistant, or bolt vision onto either. Then 2–3 minute demos: what it does, one failure you found, one fix you made. (S6 deviates from the standard session timing: talk is compressed to ~30 min to make room.)

**Student leaves with:** a security mindset, a shipped demo, and a portfolio project.

---

## Capstone (bootcamp format: an in-session sprint, not a take-home)

Seeded end of Day 1 ("start thinking about what you'd build"), data gathered overnight (students bring their own documents), foundation built in S4/S5 labs, extended + hardened + demoed in S6. Requirement: your Day-2 app combining **at least two course techniques**, with (1) a 10-example eval set with scores, (2) one documented failure mode + mitigation. Solo or pairs.

**Grading suggestion (100):** Working demo 40 · Eval set with honest numbers 25 · Failure analysis 15 · Technique fit (right tool for the job) 10 · Presentation clarity 10.

**Optional stretch:** students who want a bigger portfolio piece can keep building after the weekend and submit a video demo within a week — grade the in-session version, bonus for the polished one.

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

## Tech decisions (July 2026)

- **SDK:** `google-genai` (`from google import genai`) — the current unified SDK; old `google-generativeai` is deprecated.
- **Default model:** `gemini-flash-latest` — the alias for the free tier's current Flash (Gemini 3.5 Flash as of July 2026). The alias is deliberate: dated ids age out — `gemini-2.5-flash` is no longer available to *new* accounts while older accounts still have it, and the alias serves both, so a mixed room just works. Typical free-tier limits: ~10 requests/min, a few hundred/day per key — ample when each student has their own key; Google no longer publishes fixed per-model numbers, so confirm your project's live limits in AI Studio. Notebooks use a single `MODEL` variable; pin a dated id only if you need frozen behavior. Check current list: https://ai.google.dev/gemini-api/docs/models
- **Embeddings (S4):** Gemini embedding model via same SDK.
- **Local models (S5):** Ollama demo on instructor laptop (pre-pull a small model; don't rely on college bandwidth).

## Currency, alignment & future-proofing

This course's spine — LLM fundamentals → prompting → evaluation → RAG → tools/agents → production & security — matches how GenAI is taught across 2026's leading curricula (IBM's RAG & Agentic AI certificate, the major LLM-engineering courses, the frontier labs' own material) and what employers expect: chunking strategies, embedding selection, vector DBs, citations, failure-mode analysis, golden-dataset evals, regression testing, function calling, workflow orchestration, and cost/latency/observability.

**Deliberate pedagogy: build raw, then name the frameworks.** Where most bootcamps teach LangChain/LlamaIndex/CrewAI first, this course builds RAG as a numpy array and tools as plain Python functions — so students understand the machinery before an abstraction hides it. Frameworks, rerankers, LoRA/QLoRA, MCP, and LLMOps tooling are named as honest "next steps" (see `LEARNING-GUIDE.md` §7.2), not taught, keeping the 12 hours focused on durable fundamentals.

**Future-proofing:** model names, prices, free-tier limits, and fashionable frameworks change every few months; tokens, embeddings, attention, evaluation, retrieval, tool use, and security failure modes do not. The course is built on that stable layer, with one `MODEL` variable per notebook for the single thing that changes. `LEARNING-GUIDE.md` §7.3 makes this explicit for students — it's the most valuable idea in the course.

## Risk / fallback plan

- **College Wi-Fi dies:** decks are fully offline (single HTML files, no CDN). Keep one mobile hotspot; labs degrade to instructor-driven demo + students run at home.
- **AI Studio blocked / sign-up friction:** carry 5 spare API keys on paper for stuck students; keys are free.
- **Rate limits (429):** notebooks include retry-with-backoff cell; students each use their own key.
- **Slow machines:** everything runs in Colab's cloud — local specs don't matter. See `ZERO-SETUP.md` for the full any-laptop/zero-cost guarantee.
