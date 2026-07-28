# The Learning Guide
### Every concept in this course, in one place

Read this to *learn* or *refresh* everything the course teaches — whether you're the instructor prepping, or a student who wants the whole picture in one document. It's written in plain language, mental-models first. Each idea comes with **what it is → why it matters → how it fails.** If you understand this guide, you understand modern applied GenAI.

**Parts 1–7 are the main line and stay math-free.** [Part 8](#part-8--under-the-hood-the-depth-layer) is the *depth layer*: the mechanism underneath each idea, for readers who want to know why rather than just what. It mirrors the `<|deeper|>` panels in the slide decks — press **D** on any slide to open them — and it assumes nothing beyond first-year linear algebra and probability. Skip it on a first read; come back when a claim in Parts 1–7 starts feeling like something you were asked to take on faith.

**The single mental model to hold onto:** a large language model does exactly one thing — *given some text, it predicts the next chunk of text, then repeats.* Everything else in this guide is either (a) how that prediction works, (b) how to steer it, or (c) how to build reliable products on top of something that is fluent but not always right.

---

## Part 1 · How Machines Learned to Talk (the engine)

### 1.1 Two kinds of AI
**Discriminative AI** judges — it sorts existing things into labels (spam/not-spam, cat/dog, fraud/genuine). It ran the world 2012–2022. **Generative AI** creates — it produces new content that never existed (essays, code, images, answers). Same underlying mathematics (neural networks); the difference is what the model is trained to output. This course is about the generative kind.

### 1.2 The one idea: next-token prediction
An LLM is *autocomplete with a PhD.* Given text, it predicts the most likely next **token**, appends it, and predicts again — a thousand times per answer, left to right. Essays, code, and reasoning all emerge from this one loop repeated at scale. This is the most important sentence in the course: **it's all next-token prediction.**

### 1.3 Tokens
Models don't read letters or words — they read **tokens**, which are learned chunks of text (roughly ¾ of an English word, or ~4 characters, each). "unbelievable" might be `un·believ·able`. Two consequences: you **pay per token**, and context is **measured in tokens**. Also: tokenizers are trained on English-heavy data, so languages like Tamil get split into more, smaller tokens — the same meaning costs 3–5× more tokens (a real fairness issue, slowly improving with multilingual tokenizers).

### 1.4 Embeddings
Every token (and later, every sentence or paragraph) gets turned into a long list of numbers — an **embedding** — which you can think of as coordinates in a space of *meaning*. Things used in similar contexts land near each other: "idli" sits near "dosa," far from "GPU." The famous demonstration: `king − man + woman ≈ queen`. Meaning became geometry. This is the foundation that makes semantic search (Part 4) possible.

### 1.5 Attention
Language is ambiguous: in "the trophy didn't fit in the suitcase because *it* was too big," what is "it"? **Attention** is the mechanism by which every word weighs every other word to resolve meaning — here, "it" attends strongly to "trophy." Change "big" to "small" and it re-weights to "suitcase," instantly. Nobody programmed grammar rules; the model learned this weighting from data. Attention is the **T in GPT** — the Transformer, from the 2017 paper *"Attention Is All You Need,"* which by removing older sequential bottlenecks made massive parallel training (and thus scale) possible.

### 1.6 Sampling and temperature
The model outputs a *probability* for every possible next token — not a single answer. It then **samples** from that distribution (rolls weighted dice). **Temperature** reshapes the dice: low temperature (→0) sharpens toward the single most likely token (deterministic, good for facts and code); high temperature (→2) flattens the field (creative, surprising, riskier). This is *why the same prompt gives different answers* to you and your friend — nobody's lying, it's dice. Related knobs you'll meet: **top-k** (only consider the k best tokens) and **top-p / nucleus** (the smallest set of tokens whose probabilities sum to p).

### 1.7 Parameters, training, and inference
A model is nothing more than **a file full of numbers** — billions to trillions of **parameters** (the "knobs"). You already know the idea from `y = wx + b`: w and b are parameters you'd adjust to fit a line. Training is exactly that, automated and enormous: guess the next token → measure how wrong (the "loss") → nudge every knob a tiny bit in the direction that reduces the error (**backpropagation + gradient descent**) → repeat over trillions of tokens for months.

Two distinct moments, often confused:
- **Training** (writing the cookbook): happens once, in the lab, at huge cost. Ends with a **frozen file**.
- **Inference** (cooking from it): every time you use the model, your prompt flows through the frozen knobs. **The model does not learn from your chat.** (Your free-tier text may be used to train *future* versions, offline — which is why you don't paste private data.)

A crucial corollary: **a model has no memory.** Chat apps create the illusion of memory by silently re-sending the whole conversation into the model on every turn.

### 1.8 From feral base model to helpful assistant
A freshly pretrained model (a "base model") only *continues* text — ask it "What is 2+2?" and it might reply "What is 3+3? What is 4+4?" like a worksheet. It's a brilliant parrot of the internet with no manners. Three stages of "finishing school" turn it into an assistant:
1. **Pretraining** — read everything, learn to predict tokens (raw intelligence, no manners).
2. **Instruction tuning (SFT)** — show it many "question → good answer" examples until it learns the *assistant format*.
3. **RLHF** (or modern variants like **DPO**) — humans rank answers; the model is tuned toward what people prefer (helpful, harmless, honest). Refusals and tone mostly come from here.

ChatGPT's 2022 breakthrough wasn't a smarter brain — it was **better finishing school** on the same loop.

### 1.9 Why the same trick gives different products
ChatGPT, Gemini, and Claude all run the token loop. They differ in **training data** (ingredients), **finishing school** (whose preferences tuned it), **house rules** (the hidden system prompt + safety training), and **tools bolted on** (search, code execution, files). "Open-weight" models (Llama, Qwen, DeepSeek, Mistral, Gemma) publish the actual parameter file so you can download and run them yourself (Part 5).

### 1.10 Emergence and scale
The loop is old; the **scale** is new — trillions of training tokens, billions-to-trillions of parameters, months on GPU clusters. Keep scaling the *same* loop and abilities nobody explicitly programmed start to appear: translation, coding, step-by-step reasoning. This is **emergence**, and researchers still debate how "sudden" it really is. The takeaway: quantity became quality.

### 1.11 Why LLMs fail (all explained by the above)
- **"How many r's in strawberry?" → wrong:** it sees tokens, not letters. (Mostly patched now via training, but the mechanism remains — try counting letters in rarer words.)
- **Big multiplication → wrong:** it *predicts plausible digits*, it doesn't calculate. (Fix: give it a calculator — Part 5.)
- **Doesn't know today's news:** **knowledge cutoff** — training ended months ago. (Fix: retrieval or search — Part 4.)
- **Confident nonsense (hallucination):** it optimizes for *plausible*, not *true*. Fluent, confident, and wrong — indistinguishable by tone. (Fix: evaluation and grounding — Parts 2 and 4.)

None of these are bugs. They are direct consequences of next-token prediction, and each has an engineering fix that the rest of the course teaches.

### 1.12 The context window
Everything the model can consider *right now* — the system rules, the conversation so far, any documents you pasted, plus its own answer-in-progress — must fit in one **context window**, measured in tokens (modern windows: ~128k to 1M+). It's the model's entire working memory. When your knowledge doesn't fit — and it never all fits — you need retrieval (Part 4).

### 1.13 What an API call actually is
The model runs on the provider's GPUs, not your laptop. Your code sends an HTTPS request with your **API key** (your identity + quota); the gateway checks it (over the limit → error `429`, retry shortly); the GPUs run the token loop; tokens stream back. Latency (1–3 s) is literally the loop running, one pass per token.

### 1.14 Reasoning models and test-time compute
You now know two dials for making a model smarter: more parameters and more training data. **Reasoning models** (OpenAI's o-series, Gemini's "thinking" mode, Claude's extended thinking, DeepSeek-R1) add a **third dial: think longer at answer time.** Before replying, the model generates thousands of hidden **scratchpad tokens** — a private chain-of-thought it drafts, checks, and revises — and only then writes the answer. Same token loop; the compute is just spent at *inference* instead of training ("test-time compute"). The cost rule falls straight out of that: the scratchpad is real tokens — **10–50× more than a direct answer, billed and slow** — so route hard math/code/planning to a reasoning model, and never send one an easy question. "What's the capital of France?" does not need a thousand tokens of deliberation.

---

## Part 2 · Talking to AI, and Catching Its Lies

### 2.1 Anatomy of a prompt
A good prompt has up to six parts. **Task** is mandatory; the rest are dials you turn on when the job needs them:
- **Role** — "You are a careful teaching assistant…"
- **Task** — the precise job: verb + object + length.
- **Context** — the facts it needs (it remembers nothing).
- **Format** — "Reply ONLY with JSON {…}" / bullet cap / word cap.
- **Examples** — 2–5 input→output pairs.
- **Constraints** — "If a fact isn't stated above, don't invent it. If unsure, say so."

Over-stuffing costs tokens and dilutes attention, so add only what helps.

### 2.2 The three power moves
1. **Few-shot** — show 2–5 examples instead of describing the format. The model imitates patterns; this is **in-context learning** (behavior changes with *zero* weight updates — it lives only in this context window). The single highest-leverage prompt upgrade.
2. **Step-by-step (chain-of-thought)** — "Solve step by step, then give the final answer." Intermediate tokens give the model room to work and give *you* an auditable trail. Modern "reasoning models" internalize this, but explicit steps still matter when a human must check the logic.
3. **Grounding** — "Answer only from the facts above." The single line that most reduces invented citations, policies, and awards.

### 2.3 Common prompt mistakes
The kitchen sink (one prompt doing five jobs — split it), vague adjectives ("make it professional" — define it or show it), assuming memory ("like I told you yesterday" — it remembers nothing), and no format spec (then parsing "Certainly! Here are…" forever).

### 2.4 Hallucination, precisely
Hallucination is a **calibration failure**: the model's confidence and fluency are *uncorrelated* with truth. A US lawyer was sanctioned in federal court for a brief with six ChatGPT-invented case citations (*Mata v. Avianca*, 2023); Air Canada was held liable for a refund policy its chatbot made up (*Moffatt v. Air Canada*, 2024). These weren't bad prompts — they were **unmeasured** ones. Grounding and tools reduce hallucination but never eliminate it.

### 2.5 Evaluation — the skill that separates engineers from fans
"It worked when I tried it" is not evidence — you tried 3 inputs; users bring 3,000. The engineering answer to "how do you know it's right?" is to **measure**:
1. **Test set** — questions with known-correct answers, written by someone who actually knows.
2. **Scorer** — code that compares the model's answer to the expected one and returns ✓/✗.
3. **Score** — one number, so "is prompt B better?" has an *answer* instead of an argument.

Run evals at **temperature 0, three times, averaged** (kill the dice, then measure the flutter that remains). **Read the failures, not the score** — which ones failed and why is the actual curriculum. Change **one thing at a time** or you'll never know what worked.

### 2.6 Scorers are a design decision (and can be wrong)
- **Exact match** — unambiguous, but fails a correct answer over punctuation.
- **Normalized contains** — lowercase, strip symbols, check if the key fact appears; robust and simple (but a too-generic expected string gives false positives).
- **LLM-as-judge** — a second model grades paraphrase-tolerantly; handles wording, but has biases (prefers longer answers, its own phrasing, first position) — audit it, don't trust it blindly.

### 2.7 Eval-driven development (the actual job)
**Write prompt → run eval → read failures → fix one thing → re-run.** Repeat until the score stops improving, then grow the test set. This loop is what professional AI work looks like. Your eval set later becomes a **regression test** — run it before every prompt change, forever (Part 6).

---

## Part 3 · AI Beyond Text (multimodal)

### 3.1 Same loop, new tokens
The attention loop never cared what tokens *mean*. So: chop an image into a grid of small **patches**, turn each patch into an embedding, and the same machine "reads" a photo the way it reads a sentence. Chop audio into short slices — it reads sound. "Multimodal" isn't a new brain; it's new eyes and ears wired into the same brain. (The vision-transformer idea, ViT, is from 2020.)

### 3.2 What "AI with eyes" does
It doesn't just see — it **reads**: receipts and invoices → structured data (the most-shipped use case), handwriting, charts, screenshots, IDs for KYC. One caution it *refuses* by design: identifying who a person is (privacy).

### 3.3 Making images: diffusion
Reading images is prediction; *making* them is a different, equally simple trick. **Diffusion**: take millions of real images, add noise step-by-step until pure static, and train a network to *reverse* each step. To generate, start from fresh random static and "repair" your way to an image — steered at every step by your text prompt (embedded with the same trick from Part 1). (Some newer image models are token-based/autoregressive instead; both families coexist.) Limits: hands and in-image text are classic failure zones; artist-style prompts raise unresolved legal/ethical questions; and if images can be conjured, images stop being evidence (deepfakes → provenance/watermarking as the counter-move).

### 3.4 Speech — solved enough to be dangerous
Speech-to-text is near-human (lectures → notes is a solved problem); text-to-speech is convincingly human; and **voice cloning needs only seconds of audio.** The "family member urgently needs money/an OTP" scam call is real — agree on a family password. Video generation is the diffusion family plus time: impressive short clips, physics still slips, costs real money, improving every quarter.

### 3.5 It's all one API call
`contents=[image, "your question"]` — the SDK mixes images, audio, and text freely. Everything from Parts 1–2 (prompting, format control, grounding, **evaluation**) applies unchanged. Vision fails in familiar ways: it **miscounts** (patches summarize, they don't enumerate — same disease as multiplication), confuses precise left/right, and will **confidently "read" blurred text** it can't actually see (pixel hallucination — the grounding line "if unreadable, say so" helps).

### 3.6 Structured outputs — guaranteed JSON
Prompt-begging ("Reply ONLY with JSON…") works until the model adds a code fence or a friendly preamble and your parser crashes. The production way: pass a **schema with the request** — in the Gemini SDK, `response_mime_type="application/json"` plus `response_schema=…` (every major provider has an equivalent). The decoder is then *constrained*: it literally cannot emit a token that breaks the schema, so `json.loads` never fails — and the format instructions come out of your prompt entirely. That's why it beats prompt-begging: a prompt *requests* the shape; a schema *enforces* it at generation time. Prompts steer content; schemas lock shape.

---

## Part 4 · Giving AI Your Own Knowledge (RAG)

### 4.1 The problem
The model read the internet but not *your* notes, syllabus, or company docs — and when asked, it *invents* a plausible answer rather than admitting ignorance. Pasting everything fails three ways: it doesn't fit the **window**; you re-pay the token **meter** on every question; and models attend worst to content buried in the **middle** of a long context. The fix isn't a bigger paste — it's sending only the *right* few paragraphs.

### 4.2 Semantic search (the "R" — retrieval)
Keyword search (Ctrl-F) misses meaning: "marks to clear the subject" shares zero words with "50% aggregate to pass," yet they mean the same thing. Embeddings solve this — embed each **chunk** of your documents into meaning-coordinates (once), embed the question, and find the chunks whose vectors sit closest. Closeness is measured by **cosine similarity**, which on normalized vectors is a single matrix multiply: `scores = chunk_vectors @ question_vector`, then take the top-k. That's the entire search engine.

### 4.3 Chunking — the unglamorous kingmaker
How you cut the document decides everything. Too small → the retrieved fragment loses its context ("…and the end-semester exam" — of what?). Too big → the right sentence drowns and similarity dilutes. The boring default that wins: **paragraph-sized chunks with a little overlap**, split on natural boundaries. *Chunking bugs cause more RAG failures than model choice does.* (Advanced variants you'll meet: semantic chunking, recursive splitting, parent-document retrieval, rerankers to re-order results.)

### 4.4 Vector databases, plainly
A vector database is a library shelved by *meaning* — hand it a query vector, it returns the nearest neighbors fast, even across millions. Names: FAISS (library), Chroma (dev-friendly), pgvector (vectors inside Postgres — often the right boring choice), Pinecone/Weaviate (managed). But below ~100k chunks, **a numpy array is a perfectly good vector database** — don't add infrastructure until you have an infrastructure-sized problem.

### 4.5 RAG end to end
**R**etrieve the top chunks → **A**ugment the prompt by stapling them in → **G**enerate a grounded, cited answer. The grounded template has three load-bearing lines:
```
Answer using ONLY the context below.          ← blocks the model's internet-memories
Cite which chunk you used, like [1].          ← makes hallucinations visible
If not in the context, reply exactly:
"I don't know based on the provided documents." ← the escape hatch (no fiction to fill silence)
```
This pattern powers a large share of real AI products: support bots over help docs, "chat with your sources" tools, AI search engines, legal/medical assistants, enterprise "chat with our wiki."

### 4.6 Where RAG breaks (debug in this order: retrieval → chunks → prompt → model)
- **Vocabulary gap** — retrieval misses despite embeddings; fix by rephrasing the query with the LLM, retrieving more chunks, or indexing summaries too.
- **Answer split across chunks** — the model sees half; fix with overlap or retrieving neighbors.
- **Stale index** — the doc changed but the embeddings didn't → confident, *cited*, outdated answers (RAG trusts its shelf); fix by re-indexing on change and showing document dates.
- **Model ignores your context** — training memories leak past weak grounding; fix by strengthening the ONLY line, lowering temperature, putting context *before* the question — and *evaluating* it.

Evaluating RAG splits in two: **retrieval hit-rate** (did the right chunk arrive?) and **answer faithfulness** (did the model stick to it?) — diagnose and fix them separately.

### 4.7 RAG vs long-context vs fine-tuning
- **Paste into context** — fine for a few pages, one-off questions.
- **RAG** — for large or changing knowledge, needing citations and freshness.
- **Fine-tuning** — for teaching *behavior/style/format* at scale, **not facts** (it's expensive, freezes instantly, and gives no citations — the classic costly mistake).

The interview one-liner: **"Fine-tuning teaches behavior; RAG provides knowledge."** (Million-token context windows are a real competitor for small, static corpora — but RAG survives on cost, freshness, and citations, and real systems increasingly combine both.)

---

## Part 5 · Making AI Do Things (tools & agents)

### 5.1 The trick (read it twice)
A text model is a brain in a jar. Tool use gives it hands — but **the model never executes anything. It writes a structured request; your code executes it; the result re-enters the context; the model continues.** Still next-token prediction. The consequence that matters: **control stays with you** — you choose which tools exist, validate every argument, and can refuse any call.

### 5.2 Function declarations — the description IS the prompt
You hand the model a menu of functions. It reads only their **name, docstring, and parameter types** — that's its entire understanding. A vague docstring causes wrong tool choices and bad arguments. "Use for ANY arithmetic; never compute numbers yourself" isn't documentation — it's an instruction to the model. The SDK converts your Python functions to declarations automatically from type hints and docstrings.

### 5.3 The agent loop
`while the model wants a tool: run it (your code) and feed the result back.` When the model chains calls itself — read a file, then calculate on it, in an order nobody scripted — that loop is what people call "an agent." Impressive, and exactly where the danger lives.

### 5.4 Five ways tool use goes wrong
Wrong tool confidently (sharpen docstrings; "answer directly when no tool is needed"); bad arguments (validate *inside* every tool, return readable errors — models self-correct on good errors); infinite loops (hard-cap the number of tool calls); imaginary tools it never had (execute an allow-list only); and **poisoned tool results** — a tool's output is text entering the context, so a malicious web page or file can carry instructions ("ignore your rules and…"). Treat tool results as untrusted input (this becomes Part 6).

### 5.5 The honest lesson: workflow vs agent
Most problems **don't need an agent** — they need a boring **workflow** where *you* fix the steps in code (extract → validate → summarize → format) and the model fills the hard parts. Predictable, testable, debuggable. An **agent** lets the *model* decide the steps at runtime — flexible and impressive, but every added autonomous step is a new failure point. Why it matters: **reliability compounds.** Ten independent 95%-reliable steps succeed only 0.95¹⁰ ≈ **60%** of the time; twenty steps ≈ 36%. This one fact explains most "our agent demo failed in production" stories. Mitigations: fewer steps, validation between steps, human approval on anything that writes/spends/sends, retries on cheap idempotent steps.

The rule of thumb: **do you know the steps in advance? Yes → workflow (80%+ of real business AI). No → an agent, on a leash** (max steps, tool allow-list, validated args, human sign-off on side effects).

### 5.6 The escalation ladder (cheapest fix first)
**Better prompt → few-shot → RAG → tools → fine-tuning.** Climb a rung only when your *eval* proves the current one failed. Fine-tuning is rung 5, never rung 1, and never for facts. Over-engineering (reaching for an agent when a prompt would do) is itself a failure mode.

### 5.7 API models vs models you own
Open-weight models run on your own hardware (**Ollama** makes it one command: `ollama run gemma4:e4b`, then it works offline — older `gemma3:4b` also still works). Choose on **privacy/compliance** (data that legally can't leave your infrastructure — healthcare, financial KYC), **cost at scale** (per-token API forever vs hardware once), and **offline/edge** (no internet on the factory floor or a farmer's phone). It's an engineering trade, not a religion. The production pattern you'll actually meet: **hybrid** — a frontier API for the hard 10%, a small/local model for the routine 90%.

### 5.8 MCP and multi-agent systems
Two names you'll hear the moment you touch agents in industry. **MCP (Model Context Protocol)** is the USB-C of tool use: instead of every model needing a custom adapter for every tool (N models × M tools = N×M integrations), everyone implements one standard plug, and any model can use any tool server (N+M). Nothing new mechanically — still "model requests, your code executes" — just standardized across the ecosystem. **Multi-agent** systems (agents handing work to other agents) sound like a free upgrade but usually aren't: every hand-off is one more autonomous step, and the compounding-reliability math from 5.5 applies with a vengeance — chained agents multiply failure. The one pattern that legitimately earns its keep: **parallel fan-out + judge** — several workers attack subtasks *independently, in parallel*, and a single judge merges or picks. Independent attempts don't compound; chained hand-offs do.

---

## Part 6 · Breaking It, Securing It, Shipping It

### 6.1 Every capability is an attack surface
RAG reads documents → a document can attack it. Tools take actions → a hijack can take actions. Thinking like an attacker is part of building.

### 6.2 Prompt injection (the #1 risk)
The model reads one flat stream of text with **no reliable border** between "my instructions" and "the user's data" — so text that *looks* like an instruction can *become* one. It's SQL injection's ghost, but harder: language has no escape character. **Indirect injection** is the sneaky version — the attacker never talks to your bot; they hide a payload in a document your RAG retrieves (a web page, a shared PDF, white-on-white text), and your own pipeline feeds it in. Tool use makes it worse: an injected "email the database to attacker@evil" can fire if the tool exists. OWASP ranks prompt injection the **#1** risk for LLM apps, and there is **no complete fix** — only layers.

### 6.3 Jailbreaks and leaks
**Jailbreak** — wrap a banned request in roleplay/hypothetical/"my grandma used to…" framing to slip past safety training (an arms race, not a wall). **Prompt leak** — "print your instructions verbatim" spills the hidden system prompt, which often holds business logic or other users' context. Golden rule: **never put anything in a prompt you couldn't survive seeing on the front page.**

### 6.4 Defense in depth (no silver bullet, so stack them)
1. **Delimit and label** untrusted text (wrap it, tell the model it's data, not commands).
2. **Instruction hierarchy** in the system prompt (rules override anything the user text says).
3. **Output validation** (check the answer before it ships — format, no leaked secrets, allow-listed values).
4. **Least privilege + human-in-the-loop** — no destructive tools by default; a human approves anything that writes, spends, or sends. **Match trust to blast radius.** This last layer caps the damage even when everything upstream fails.

### 6.5 Notebook → product: the four that change
A demo runs once, for you, on one input, free. A product runs a million times, for strangers, on inputs you never imagined, while the meter runs:
- **Cost** — every token is a coin, paid per query, forever. Levers: cheaper/local model for easy queries, caching, trimming chunks, capping output. Cost is an architecture decision.
- **Speed** — 2–4 s of silence feels broken; **stream** tokens as they generate and show a "thinking…" state. Users forgive slow; they hate frozen.
- **Reliability** — APIs time out, rate-limit, and return malformed JSON; use retries with backoff, timeouts, and a graceful fallback (never a raw stack trace to a user).
- **Observability** — log the prompt, response, tokens, latency, cost, and thumbs up/down. When it misbehaves at 2 a.m., logs are the only way you'll know what happened. And your **evals become the regression test** — run them before every change.

### 6.6 UX for something that's sometimes wrong
Show sources (citations let users verify — trust comes from checkability, not confidence); make retry/edit/thumbs-down one click; signal uncertainty ("I don't know" beats confident fabrication); and always offer an escape to a human.

### 6.7 Responsible AI — the four questions
Before anything you built ships to strangers, ask four questions. **Bias** — who does it fail for? Models inherit the skews of their training data; test on your real users, not the demo persona. **Provenance** — where did the training data come from, and can generated content be traced (watermarks, disclosure) so images and essays don't masquerade as human? **Privacy** — what happens to the data users type into your prompts, and could the model surface someone else's? **Accountability** — when it's wrong, who answers? "The AI did it" has already lost in court (Air Canada, 2.4). Two names give you the regulators' version of this checklist: the **EU AI Act** (risk-tiered legal obligations, phasing in through 2027) and the US **NIST AI Risk Management Framework** (voluntary, but the de-facto shared vocabulary). Neither asks anything this guide hasn't: measure, ground, log, and keep a human on the blast radius.

---

## Part 7 · The bigger picture — currency & future-proofing

### 7.1 How this course maps to how the industry teaches GenAI (2026)
Standard 2026 curricula (IBM's RAG & Agentic AI certificate, the major LLM-engineering courses, DeepLearning.AI, Anthropic's and the frontier labs' own courses) converge on the same spine this course follows: **LLM fundamentals → prompting → evaluation → RAG → tools/agents → production & security.** Point by point, this course covers what employers in 2026 expect: transformers/attention/tokenization/context windows/embeddings (Part 1); RAG with chunking strategies, embedding selection, vector DBs, citations, and failure-mode analysis (Part 4); evaluation with golden datasets, regression testing, and quality gates (Parts 2 & 6); agents with function calling, the agent loop, and workflow orchestration (Part 5); and production concerns — latency, caching, streaming, rate limiting, cost control, observability (Part 6).

### 7.2 What this course deliberately leaves out (and why)
Most bootcamps teach **frameworks first** — LangChain, LlamaIndex, CrewAI, LangGraph, ChromaDB. This course builds everything **raw** (a numpy vector store, plain Python functions as tools) on purpose: so you understand what the framework does *before* you let it hide the machinery. Once you've built RAG in 60 lines, LangChain is just convenience — and you'll debug it far better than someone who only knows the framework. When you're ready to go deeper, these are the honest "next steps," not gaps:
- **Frameworks**: LangChain / LlamaIndex (orchestration), Chroma / pgvector (vector stores) — you'll recognize every piece.
- **Advanced RAG**: rerankers, hybrid (keyword + semantic) search, parent-document retrieval, RAGAS for eval.
- **Fine-tuning**: LoRA / QLoRA (parameter-efficient tuning) — reach for it only when an eval proves prompting can't hold a behavior.
- **Agent frameworks & MCP**: the **Model Context Protocol** is the emerging standard for connecting models to tools and data — the same idea as Part 5, standardized across the ecosystem.
- **LLMOps**: tracing/observability tools, prompt versioning, automated quality gates.

### 7.3 Future-proofing — what's stable vs what changes
This is the most important idea for a young learner. **The names change every few months; the fundamentals don't.**
- **Changes fast:** model names (GPT-5, Gemini 3.x, Claude — and whatever's next), specific free-tier limits and prices, which framework is fashionable, benchmark leaderboards, the "hot" capability of the quarter.
- **Stable for years:** tokens, embeddings, attention, prediction & sampling, training vs inference, prompting, **evaluation**, retrieval/RAG, tool use, the workflow-vs-agent trade-off, and the security failure modes. Every one of those is a *consequence of how the technology works*, not a product decision.

This course is built on the stable layer, with a single `MODEL` variable in each notebook for the one thing that changes. Learn the fundamentals here, and when the next hype wave arrives — a new model, a new framework, a new buzzword — you'll see straight through it to what's actually new (usually: not much). That x-ray vision is the real, durable skill. Most people never get it because they learned a product, not the principles.

### 7.4 Staying current (a light habit, not a treadmill)
Read the model providers' docs like release notes. Rebuild one lab from memory each month. Follow how the frontier moves, but judge it against the fundamentals above — ask "which stable idea is this a new instance of?" You do not need to chase every launch. You need to understand the layer underneath them, which you now do.

---

## Part 8 · Under the Hood (the depth layer)

Everything above is true and sufficient to build with. This part is the mechanism underneath it — the answers to the questions a sharp student asks in the second hour. Each section names the slide-deck panel it matches, so you can teach from either.

### 8.1 Logits, softmax, and what temperature actually divides
*(S1 · "Why the same question gives different answers")*

The final layer emits one raw score per vocabulary token — a **logit**, unbounded and uninterpretable on its own. **Softmax** turns a list of logits into a probability distribution: exponentiate each, divide by the sum.

```
p(token i) = exp(z_i / T) / Σ_j exp(z_j / T)      z = logits, T = temperature
```

Note *where* temperature sits: it divides the logits **before** the exponential. That single placement explains the whole slider. `T < 1` stretches the gaps between scores, so exponentiating exaggerates the leader — the distribution sharpens. `T > 1` compresses the gaps — the distribution flattens. `T → 0` makes the top logit infinitely dominant, which is why temperature 0 *is* **argmax**. Temperature is not a creativity dial with a mysterious interior; it is one division.

Two related knobs, both API parameters you will actually set: **top-k** keeps only the k highest-scoring tokens before sampling; **top-p (nucleus)** keeps the smallest set whose probabilities sum to p, so it adapts — a confident step keeps two candidates, an open-ended one keeps fifty.

One honest footnote: **temperature 0 is not perfectly deterministic in production.** Floating-point addition on GPUs is not associative, so batching can reorder sums and flip a near-tie. Close to reproducible; never guaranteed.

### 8.2 Loss and perplexity — the number labs watch for months
*(S1 · "What's inside a model? Just knobs.")*

Training needs a single scalar to minimise. It is **cross-entropy loss**: how much probability the model assigned to the token that actually came next, scored so confident errors hurt most.

```
loss = −log p(actual next token)      averaged over billions of predictions
```

Put 0.9 on the right token and you lose 0.11; put 0.1 on it and you lose 2.30; put 0.001 on it and you lose 6.91. Being confidently wrong is punished roughly twenty times harder than being unsure — exactly the behaviour you want to train out.

**Perplexity** is that number made human: `exp(loss)`. Read it as *"how many equally likely options is the model effectively choosing between?"* Perplexity 1 means it always knows; perplexity 50 means it is flailing among fifty. Modern models on ordinary English sit in the low single digits.

The limitation matters as much as the metric: loss keeps falling smoothly long after the model stops *feeling* smarter, and it says nothing about whether an answer is true, safe, or useful. That gap is the entire reason Part 2 exists. **Pretraining optimises loss; engineers measure evals.**

### 8.3 Positional encoding and the n² wall
*(S1 · "Attention: every word looks at every other word")*

Two things §1.5 leaves out.

**Attention is order-blind.** Every token weighs every other token — but that is a *set* operation, so "dog bites man" and "man bites dog" would produce identical weights. The fix happens before attention ever runs: position information is **added into each embedding**, so "man" at slot 1 is a different vector from "man" at slot 3. Early models added a fixed sinusoidal pattern; today's standard is **RoPE** (rotary position embedding), which rotates each vector by an angle proportional to its position so the maths naturally encodes *relative* distance. Without positional information a Transformer cannot do grammar at all.

**"Every word looks at every other word" has a price.** For n tokens there are n × n pairs, so attention cost scales with **n²** — double the context, quadruple the work. 1,000 tokens is a million pairs; 100,000 tokens is ten billion; 1,000,000 tokens is 10¹². This is why a 1M-token window was a headline rather than a checkbox, why long context costs what it costs, and why the industry keeps shipping attention variants (sliding-window, grouped-query, sparse) whose whole purpose is dodging the n². It is also the real reason Part 4 says "retrieve the right three paragraphs" instead of "paste the textbook."

Finally, a caption for every attention diagram including ours: real models run **many attention heads in parallel** across dozens of layers — one may track grammatical subject, another long-range topic. Any single picture shows one head's strongest links, once.

### 8.4 Scaling laws and the Chinchilla correction
*(S1 · "The loop is old. The scale is new.")*

Scale is three dials that must move together: **parameters**, **training tokens**, and **compute**. Around 2020, researchers found loss falls as a smooth power law in each — **scaling laws**. That predictability, not any single breakthrough, is why the capital arrived: you could forecast the capability of a model that did not exist yet.

The 2022 **Chinchilla** result corrected the strategy. Models had been built too large and too under-fed; for a fixed compute budget you should scale parameters and training tokens *together* — roughly 20 training tokens per parameter. A smaller, better-fed model beat a much larger, under-trained one. "Make it bigger" stopped being the plan.

Keep the shape of the argument, not the constants — the exact ratio has been revised more than once. What has held: **capability follows compute along a predictable curve, and the curve stays smooth even when the abilities emerging from it feel sudden.** That is the honest version of "emergence." The frontier has since moved to a different axis entirely — high-quality human text is finite (the "data wall"), so the newest dial is test-time compute (§1.14).

### 8.5 MoE, distillation, quantization — why "Flash" exists
*(S1 · "Why ChatGPT ≠ Gemini ≠ Claude")*

Every lab ships the same two-tier menu — Flash and Pro, Haiku and Opus, mini and full — and the free tier is always the small one. Three techniques make small models punch above their size:

- **Mixture of Experts (MoE).** Instead of one dense block of parameters, the model holds many expert sub-networks and a router that activates only a couple per token. A model can have a trillion *total* parameters while activating a few percent for any given token. This is why parameter count stopped predicting cost or speed.
- **Distillation.** Train an expensive teacher, then train a small student to imitate its *full output distribution* — not just the right answer, but how the teacher spread its uncertainty. Essentially every "mini"/"Flash"/"Haiku" model is a distilled child of a larger sibling.
- **Quantization.** Store each parameter in fewer bits — 4-bit weights are a quarter the size of 16-bit, so they fit in less memory and move faster. Quality degrades on the hard, rare tail first (see §8.11).

The practical consequence is the point: **"which model?" is a routing decision, not a judgement about intelligence.** The mature production pattern is hybrid — the small model handles the routine 90%, escalate the hard 10%. It also explains why benchmark tables mislead: two tiers can score within a point of each other publicly while differing 10–20× in price, because the gap lives in *your* hard cases, which only your own eval set can see.

### 8.6 The KV cache — prefill, decode, and where your latency lives
*(S1 · "The context window")*

If chat apps really re-ran a 50,000-token conversation through the whole network every turn, chat would be unusable. They don't, because each token's attention *key* and *value* never change once computed — token 4,001 does not alter what token 12 was. So they're computed once and kept. Answering therefore splits into two phases with completely different characteristics:

| Phase | What happens | Metric | Hurt by |
|---|---|---|---|
| **Prefill** | All input tokens processed in parallel; keys/values stored | **Time to first token** (TTFT) | long prompts |
| **Decode** | Each new token attends to the *cached* keys/values | **Tokens per second** | long answers |

"Latency" is those two numbers, and they have different fixes — which is why engineers never average them. Three practical facts fall out:

- **Long chats get slow and expensive** because the cache grows with context and costs GPU memory per conversation.
- **The cache dies when the request ends**, which is why providers sell **context caching**: pin a long unchanging prefix on their side and pay roughly 10% to reuse it.
- **Put the stable part of your prompt first.** Prefix caching only works up to the first differing byte, so `[fixed instructions][fixed document][changing question]` is dramatically cheaper than a prompt that varies at the top. **Prompt order is a cost decision.**

The honest restatement of §1.7: the app re-sends everything, but the model does not re-read everything.

### 8.7 Scoring properly — precision, recall, and auditing your judge
*(S2 · "Same answer, three verdicts")*

A single accuracy number hides *which kind* of error you are making, and the two kinds usually have different costs. If 5% of questions need escalation, a bot that escalates nothing scores 95% and is useless. So:

- **Precision** — of the things you flagged, how many deserved it? Low precision is crying wolf; humans stop trusting the flags.
- **Recall** — of the things that deserved flagging, how many did you catch? Low recall means quiet misses, which is how systems fail unnoticed.
- **F1** — their harmonic mean. Use it to compare, never to debug: only precision and recall tell you *which way* you're broken.

You trade them deliberately. A fraud or medical screen buys recall and accepts false alarms; a tool that auto-sends email buys precision and accepts misses. *"Which error would I rather explain?"* is a product question that decides the metric before any code is written.

**And audit the judge.** An LLM judge systematically prefers longer answers, its own phrasing, its own model family, and — in pairwise comparisons — whichever candidate came **first**. Position bias alone is often worth several points. The free fix: run every comparison **twice with the order swapped** and count a win only if the same answer wins both times. Then hand-grade 20–30 examples yourself and measure how often the judge agrees with you; below roughly 80% agreement you are measuring your judge, not your model. An unaudited AI judge is a second hallucination with a number attached.

### 8.8 How many test questions is enough?
*(S2 · "Prompt A vs Prompt B: the arena")*

With 5 questions the finest distinction you can draw is 20 percentage points, and a one-question gap is well inside the noise of which five questions you happened to write. Rough rule for a pass/fail score over n items — the wobble is about **±1/√n**:

| n | Roughly | Good for |
|---|---|---|
| 10 | ±30 pts | a smoke test — fine, but don't quote the number |
| 100 | ±10 pts | the smallest set worth arguing over |
| 1,000 | ±3 pts | real regression testing |

Two cheap moves buy most of that confidence without writing a thousand questions. **Pair your comparisons:** run A and B on identical questions and look only at the items where they disagree — the ones both get right carry no information. **Separate the two variances:** re-running the same prompt three times at T=0 measures the model's flutter; changing the questions measures your test set's flutter. Different causes, different fixes.

The professional habit: report the gap **and n**, always. "B beat A by 12 points on 120 questions" is a claim; "B is better" is a feeling. A leaderboard with no n has told you nothing.

### 8.9 Patches, and why vision fails the way it does
*(S3 · "How a model reads a picture")*

Take "patches are visual words" literally — the billing does. An image is cut into a grid (classically 16×16 pixels), each patch flattened and projected by one learned matrix into a vector the same width as a word embedding. After that the network cannot tell picture from prose. This is the **Vision Transformer** (ViT, 2020), whose entire contribution was noticing that images needed no special architecture.

Three consequences you can feel in the lab:

- **Resolution costs tokens quadratically.** Double width and height, quadruple the patches. Providers tile large images and charge per tile, so a full-page scan can cost more than a page of text. Downscaling before upload is a real cost lever.
- **Small text fails suddenly, not gradually.** If a digit is smaller than a patch, its evidence is averaged in with its neighbours. There is no zoom; below a certain size the information is simply gone.
- **Counting is structurally hard.** Attention pools and summarises rather than enumerating — the same disease as long multiplication.

The practical version: photograph documents straight-on and close, crop to the region you care about, prefer one tight image over one wide one. You are raising pixels-per-patch on the thing you want read.

### 8.10 What a diffusion model is actually trained to predict
*(S3 · "Diffusion: a picture emerges from static")*

The network is never asked to produce a clean image — that target is impossibly hard to supervise. It is asked, given a noisy image and a step number: **"which part of this is the noise?"** That is easy to supervise, because *you* added the noise, so the exact answer is free.

```
noisy   = clean + noise          forward: fixed recipe, nothing learned
noise^  = predict(noisy, step)   reverse: the only learned part
cleaner = noisy − ε·noise^       repeat 20–50 times
```

Three knobs from that loop appear in every image tool: **steps** (how many repair passes — returns flatten fast), **guidance scale** (run the prediction with and without your prompt and push away from the promptless one; high values are obedient but eventually oversaturated), and **seed** (fix the starting static and the same prompt reproduces the same image — the only reason image generation is debuggable).

Why it runs in seconds: modern systems are **latent** diffusion. An encoder compresses the image roughly 8× per side, all denoising happens in that small latent grid, and a decoder expands at the end — around 48× less work per step. Video models denoise across space *and* time, which is why they cost so much more and why physics is still where they slip.

### 8.11 Constrained decoding — why a schema beats asking nicely
*(S3 · "All of it is one API call")*

§3.6 says a schema *enforces* shape. Here is the enforcement. Recall that every step produces a score for every vocabulary token. Constrained decoding inserts one operation before sampling:

```
logits → mask illegal tokens to −∞ → softmax → sample
```

A small state machine tracks position in the schema. Just after `{"total":` it knows only a digit or minus sign can legally follow, so every other token's probability becomes exactly zero — not discouraged, **unreachable**. The model chooses *what* the total is; it has no ability to choose a malformed shape. `json.loads` cannot throw, and your format instructions leave the prompt entirely, freeing tokens and attention for the actual task.

Two cautions. A schema guarantees shape, **not truth** — grounding and evals remain your job. And over-constraining can hurt quality: forcing a terse schema on a hard question removes the model's room to reason. The standard fix is to put a `reasoning` field *before* the answer fields, because the model fills them in order and can only condition on what it has already written.

### 8.12 What makes the retrieval one-liner legal
*(S4 · "Embeddings, now for whole paragraphs")*

Three things are doing quiet work in `scores = chunk_vectors @ question_vector`:

**Pooling.** §1.4 gave every *token* coordinates; an embedding model runs the same transformer and then **pools** — usually averaging token vectors — into one vector per passage. That compression is what makes search possible and is also its main limitation: a 400-word chunk spanning three topics becomes one blurred point near none of them. It is a real argument for smaller chunks.

**Normalization.** Cosine similarity is the dot product divided by both lengths. Scale every vector to length 1 up front and those divisions become 1 forever, collapsing similarity into plain multiply-and-add — which is why a numpy one-liner searches thousands of chunks instantly. Forget it and you silently rank partly by *length*.

```
cos(a,b) = (a·b)/(|a||b|)  →  a·b        when |a| = |b| = 1
```

**Asymmetry.** A question and the paragraph answering it don't look alike — one short and interrogative, one long and declarative. Good embedding APIs accept a **task type** and embed queries and documents differently so they still land near each other. Getting this backwards is a quiet accuracy leak.

Also worth knowing: **dimensions are a dial** (many current models are trained so you can truncate a 768-vector to 256 and lose little), and **you can never mix models** — vectors from two embedding models are not comparable, so changing the model means re-embedding everything. Store the model name beside the index.

### 8.13 Chunking upgrades, and filter before you rank
*(S4 · "Chunking: how you cut the book")*

Build paragraph-with-overlap first. When it plateaus, these pay off in roughly this order:

- **Respect structure** — split on the document's own hierarchy (headings → paragraphs → sentences), recursing only when a piece is still too big. A chunk that stops mid-table was destroyed before it was embedded.
- **Small to search, big to read** — index small precise chunks, but feed the model the winning chunk's **parent** section. Retrieval accuracy of small chunks, context of large ones. Cheapest real upgrade in RAG.
- **Carry metadata** — source, section, page, date, stored *with* each chunk. Powers citations, enables filtering, makes stale content findable. Free at index time, impossible to add later.
- **Prepend context** — give each chunk a one-line header of document title and section before embedding, so "…and the end-semester exam" becomes searchable.

**Filter before you rank, not after.** A metadata filter on year narrows candidates *first*, and semantic search then ranks within a set that is already correct. A large share of "retrieval is bad" complaints are a missing filter.

A test that costs nothing: print ten random chunks and read them cold. If *you* can't tell what a chunk is about without the original document, neither can the embedding model.

### 8.14 Rerank, hybrid search, and query rewriting
*(S4 · "RAG, end to end")*

The single highest-leverage upgrade after chunking: **retrieve wide, then re-rank narrow.**

```
retrieve top 20 (fast, approximate) → rerank to best 4 (slow, accurate) → augment → generate
```

Why two stages? Your embedding search is a **bi-encoder**: question and chunks were embedded *separately*, which is exactly what makes it fast enough for a million chunks, since all document work happened at index time. A **cross-encoder** reranker reads question and chunk *together* and scores true relevance — far more accurate, far too slow for a whole corpus, perfect for re-ordering 20 candidates. The win is usually large because first-stage retrieval is better at recall than at ranking: the right chunk is often at position 9 when you took 3. Reranking finds nothing new; it stops you discarding what you already found.

Two companions. **Hybrid search** runs keyword (BM25) and semantic side by side and merges the ranked lists — keyword catches exact identifiers embeddings blur (course codes, error numbers, surnames, "Section 4(b)"), semantic catches paraphrases keyword misses. **Query rewriting** asks the model to expand the question before searching — resolve pronouns from chat history, add synonyms, split compound questions — which fixes the vocabulary gap at its source.

You can build a reranker in about ten lines without a new service: pass the 20 candidates to a cheap fast model and ask for the 4 most relevant ids as JSON, with a schema (§8.11). The trap is adding all of this on day one — build simple, **measure**, and add a stage only when your eval shows the right chunk was retrieved but ranked too low.

### 8.15 Evaluating RAG — two scores, never one
*(S4 · "Where RAG breaks in the wild")*

RAG failures split cleanly: the right text never arrived (**retrieval**), or it arrived and the model mishandled it (**generation**). One overall score cannot tell them apart, which is how teams spend a week tuning the wrong end. Record which chunk *should* win for each test question, then track:

- **Recall@k** — in what fraction of questions is the correct chunk in the top k? This is your **ceiling**: if recall@5 is 60%, no prompt gets you past 60% correct answers. Fix with chunking, hybrid search, query rewriting.
- **MRR** — average of 1/(rank of first correct chunk). Rank 1 scores 1.0, rank 5 scores 0.2. **High recall with low MRR is the signature that says add a reranker** — you're finding it and burying it.
- **Faithfulness** — given that the right chunk *was* supplied, did the answer come from it? Does the citation actually support the sentence? Low faithfulness is a prompt problem, never a retrieval one.

Read in that order the diagnosis is nearly automatic: low recall → ingest is broken; good recall, poor MRR → ranking is broken; good retrieval, poor faithfulness → grounding is broken.

One failure no score catches: the answer is **not in your documents**. The correct behaviour is the escape hatch. Put a few unanswerable questions in your test set on purpose and check the system refuses — a RAG app that never says "I don't know" isn't confident, it's uncalibrated.

### 8.16 The wire format of tool use
*(S5 · "Function declarations: the description IS the prompt")*

Your Python function becomes a **JSON schema** — the same kind that locks output shape in §8.11, now describing an input:

```json
{"name": "get_marks",
 "description": "Look up a student's marks for one subject.",
 "parameters": {"type": "object",
   "properties": {"roll_no": {"type": "string", "description": "…"},
                  "subject": {"type": "string", "description": "…"}},
   "required": ["roll_no", "subject"]}}
```

That JSON is **the model's entire knowledge of your tool**. It cannot read the body or run it to see what happens — which is why a wrong tool choice is a writing bug, not a model bug.

The conversation also gains two roles beyond user and model, and all of them stay in context: **user** asks → **model → functionCall** (a structured request; the turn *ends* and the model waits) → **you → functionResponse** (your code runs it and appends the result) → **model → text**. Nothing executed on the provider's side.

Two things surprise people. **Models can request several tools at once** — if two lookups are independent, a good model returns both calls in one turn, so running them in parallel is free latency. And **tool use is a trained behaviour, not a feature flag**: models are fine-tuned to emit these calls, which is why a small model can be fluent in conversation and poor at choosing tools. Separate skill, separate score.

Because the whole exchange lives in the context window, every tool result is re-sent on every later turn. A tool returning 5,000 tokens of raw JSON will dominate the conversation and the bill. **Return the smallest useful result** — a design decision about the tool, not the prompt.

### 8.17 The loop guard, context growth, and trajectory eval
*(S5 · "The agent loop")*

Look hard at `while`. In §5.3's sketch there is no exit condition except the model deciding it is finished — an unbounded loop whose termination is decided by a probabilistic system, with your API key attached. The real version carries a leash:

```python
steps = 0
while response.wants_tool_call and steps < MAX_STEPS:
    assert response.call.name in ALLOWED_TOOLS      # it can invent tool names
    result = execute(validate(response.call.args))  # and invent arguments
    response = model.continue_with(result); steps += 1
```

Watch the context as that loop turns. Every call and result is appended and re-sent, so the prompt grows monotonically — turn 10 re-reads nine tool outputs to decide the tenth action. Cost and latency per step rise, and because models attend worst to the middle of long contexts, your *early* instructions start losing to recent tool noise. **Long agent runs get more expensive and less obedient at the same time.** Production systems summarise older steps and write intermediate results to files the agent can re-read on demand.

And an agent's answer being right is not enough — it can reach a correct answer by an absurd, expensive, or dangerous path. So evaluate the **trajectory**: **tool-choice accuracy** (given a question, did it pick the right tool? — scoreable on its own with 20 fixed questions, and the fastest signal that a docstring needs rewriting), **step count distribution** (a task that usually takes 3 steps and sometimes 15 is telling you it gets lost — and the tail is what burns budget), and **unnecessary calls** (calling a tool when it already had the answer, or twice with identical arguments — pure cost, invisible if you only grade final text).

### 8.18 Will it fit on my laptop?
*(S5 · "Ollama: a model in your pocket")*

Arithmetic, not vibes. A model file is its parameters, so size is parameters × bits ÷ 8:

```
4B × 16 bits / 8 = 8 GB     full precision
4B ×  8 bits / 8 = 4 GB     Q8 — near-identical quality
4B ×  4 bits / 8 = 2 GB     Q4 — the usual default
```

Quantization works because the exact value of any single parameter barely matters — only the pattern across billions does — so rounding is survivable in a way that deleting is not. Q4 is where almost everyone ships; below that quality falls off quickly, and it falls off on the *hard tail* first (long multi-step reasoning, exact formats, rarer languages) — which is precisely the part a casual test never touches.

Two corrections before you trust the number. Add 1–2 GB headroom for the **KV cache** (§8.6), which grows with context — a long conversation can make a model that "fit" start swapping. And your tokens-per-second is set by **memory bandwidth**, not compute: generating each token requires reading every active parameter, so a 2 GB model on a laptop pushing ~50 GB/s tops out near 25 tokens/sec regardless of CPU speed. This is why Apple Silicon punches above its weight locally, and why quantization makes models *faster* as well as smaller.

The same arithmetic sizes the data centre: a 70B model at Q4 needs ~35 GB, more than most single consumer GPUs — which is why "we'll just run our own" is a hardware budget conversation, not a weekend.

### 8.19 Why injection has no escape character — and what actually caps the damage
*(S6 · "Defense in depth")*

Every defence that inspects *text* — delimiters, instruction hierarchy, injection classifiers — raises the cost of an attack without ending it. The reason is structural. In every other injection problem in computing there is an **escape character**: SQL has quoting, HTML has entity encoding, shells have argument arrays. Each works because the parser has a hard, mechanical boundary between code and data.

A transformer has no such boundary. System prompt, user message and retrieved document arrive as one flat token sequence, and "these are instructions, those are data" is a *preference learned in training*, not a rule enforced by the machine. A preference can be outvoted by a sufficiently persuasive sequence — which is what a jailbreak is.

So stop trying to make the model trustworthy and make the damage impossible instead. Catastrophic exploitation needs **three legs at once**:

1. **Access to private data** — your documents, user records, internal APIs, the file system.
2. **Exposure to untrusted content** — anything you didn't write: web pages, uploaded PDFs, emails, tool results.
3. **A way to send data out** — email, webhooks, writing to a shared doc, even rendering an image whose URL carries the data.

**Remove any one leg and the exfiltration attack dies**, however clever the prompt. That is a design property you can verify, unlike "our filter catches it." A RAG bot that reads private notes and ingests untrusted documents is fine *as long as it cannot transmit* — add one "email this summary" tool and you have completed the triangle.

In order of value: narrowest possible tool set; human approval on anything that writes, spends or sends; never let a tool's *output* expand permissions; run with the privileges of the **user who asked**, not the app's own; treat every tool result as hostile input. Match trust to blast radius — the blast radius stays yours even when the model is fooled.

### 8.20 The cost model
*(S6 · "Cost: every token is a coin")*

Output costs roughly **6× input** at every provider, and that asymmetry falls straight out of §8.6: input is prefill (parallel, once), output is decode (sequential, one pass per token, unbatchable).

This flips the usual intuition. Twenty extra chunks in a RAG prompt is survivable; letting the model ramble for 800 tokens when 150 would do costs far more, on every request, forever. **Capping output length is usually the highest-leverage line in the system** — and it is one parameter.

Three levers after that: **cache the prefix** (pin the unchanging head of your prompt for ~10% of the price — requires only that the stable part comes first), **batch what isn't urgent** (grading a test set, embedding a corpus, nightly summaries — around half price for waiting), and **route by difficulty** (send everything to the small model, escalate on low confidence or a failed validator; reserve reasoning models for genuinely hard steps, since their hidden scratchpad bills at output rates).

The number that matters is **cost per user, not per call**:

```
cost/user/month = queries per user × (input tokens × in-rate + output tokens × out-rate)
```

Ten queries a day at ₹0.30 is ₹90/user/month — fatal for a free app, irrelevant at ₹2,000/seat. Same code, opposite verdict. Run it at 100 users and 100,000; if both answers don't work, you have an architecture problem, not a pricing problem. Log tokens and cost **per request** from day one, and set a hard spend alert before launch — the first thing a runaway agent loop does is spend money quietly.

### 8.21 Latency, tails, and what to log
*(S6 · "Speed, reliability, observability")*

**Latency is two numbers.** TTFT is prefill, dominated by prompt length, and the only part the user experiences as *waiting*. Tokens-per-second is decode. Streaming works because it exposes only the first: 800 ms then a steady flow feels alive; 4 seconds of nothing then an instant wall of text feels broken, even though it finished sooner.

**Never report the mean — report p50 and p99.** The median is the experience you designed; the 99th percentile is the experience that generates complaints. With LLMs the gap is unusually wide because response length varies. If p50 is 2 s and p99 is 30 s, one user in a hundred watches a spinner for half a minute, and an average of 2.4 s tells you none of that.

Three reliability primitives: **retry with jitter** (back off exponentially on 429/5xx *and* randomise — synchronised retries after a blip cause the next outage themselves; cap total attempts), **timeouts with a deliberate fallback** (a cached answer, the smaller model, or an honest failure message — never a stack trace, never an infinite spinner), and **idempotency** (retrying a read is free; retrying "send the email" sends two — anything with a side effect needs a key or a check).

Then log what makes debugging possible: request id, **prompt version**, **model id**, input/output token counts, TTFT and total latency, cost, and thumbs up/down. The two bolded ones matter more than they look — when quality drops next Tuesday the first question is "what changed?", and a provider silently updating a model behind an alias is an answer you can only reach if you recorded it.

The habit that closes the loop: your Part 2 eval set, run automatically before every prompt change, with the score written into the log. Quality then behaves like any other engineering metric — a number, a history, and an alarm — instead of something users tell you about.

---

## Glossary (fast reference)
**Token** — the chunk a model reads (~¾ word). **Embedding** — text turned into meaning-coordinates. **Attention** — words weighing each other to resolve meaning; the Transformer's engine. **Parameter** — one learned knob; a model is a file of billions. **Inference** — using the frozen model (no learning, no memory). **Temperature** — the randomness dial on sampling. **Context window** — the model's working memory, measured in tokens. **Hallucination** — confident, fluent, wrong (plausible ≠ true). **Prompt engineering** — structuring the input (role/task/context/format/examples/constraints). **Few-shot** — steering by examples. **Chain-of-thought** — asking for visible reasoning. **Eval** — measuring quality with a test set + scorer + score. **RAG** — retrieve relevant chunks, augment the prompt, generate a grounded cited answer. **Chunking** — how you split documents for retrieval. **Cosine similarity** — how retrieval measures closeness. **Vector database** — a store that returns nearest-meaning neighbors. **Tool use / function calling** — the model requests, your code executes. **Agent** — an LLM in a loop choosing tools/steps toward a goal. **Workflow** — you fix the steps; the model fills them in. **Fine-tuning** — further training to teach behavior/style (not facts). **Prompt injection** — untrusted text becoming instructions. **Defense in depth** — layered mitigations because no single one is complete. **Streaming** — sending tokens as they generate for responsive UX. **Open weights** — a model whose parameters you can download and run yourself.

**Depth-layer terms (Part 8).** **Logit** — the raw score a model emits per vocabulary token, before softmax. **Softmax** — turns logits into probabilities summing to 1; temperature divides the logits inside it. **Top-k / top-p** — trim the candidate set before sampling. **Loss (cross-entropy)** — −log of the probability placed on the true next token; the number training minimises. **Perplexity** — exp(loss); "how many options is it effectively choosing between?" **Positional encoding / RoPE** — how order gets into an order-blind attention mechanism. **n²** — attention's cost curve in context length. **Scaling laws / Chinchilla** — capability follows compute predictably; scale parameters and data together. **MoE** — many expert sub-networks, few active per token. **Distillation** — a small student trained to imitate a large teacher's output distribution. **Quantization** — fewer bits per parameter; params × bits ÷ 8 = file size. **KV cache** — stored keys/values that make decode cheap; splits latency into prefill and decode. **TTFT** — time to first token (prefill). **Context caching** — renting a pinned prompt prefix for ~10% of the price. **Precision / recall / F1** — which kind of error you're making, not just how many. **Position bias** — an LLM judge preferring whichever answer came first; fix by swapping and re-running. **Recall@k / MRR** — did the right chunk arrive, and did it arrive near the top. **Faithfulness** — did the answer actually come from the retrieved chunk. **Bi-encoder / cross-encoder** — fast separate embedding vs slow joint scoring; the basis of reranking. **BM25 / hybrid search** — keyword ranking merged with semantic ranking. **Constrained decoding** — masking schema-illegal tokens to −∞ so malformed output is unreachable. **Trajectory eval** — grading an agent's path (tool choice, step count, wasted calls), not only its answer. **p50 / p99** — median and tail latency; report both, never the mean. **Idempotency** — making a retry safe for anything with a side effect.

---

*If you can teach Part 7.3 to someone else — what's stable vs what changes — you've understood the point of the whole course. And if you can teach any section of Part 8 to someone else, you've understood why it's stable.*
