# The Learning Guide
### Every concept in this course, in one place

Read this to *learn* or *refresh* everything the course teaches — whether you're the instructor prepping, or a student who wants the whole picture in one document. It's written in plain language, no math, mental-models first. Each idea comes with **what it is → why it matters → how it fails.** If you understand this guide, you understand modern applied GenAI.

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

## Glossary (fast reference)
**Token** — the chunk a model reads (~¾ word). **Embedding** — text turned into meaning-coordinates. **Attention** — words weighing each other to resolve meaning; the Transformer's engine. **Parameter** — one learned knob; a model is a file of billions. **Inference** — using the frozen model (no learning, no memory). **Temperature** — the randomness dial on sampling. **Context window** — the model's working memory, measured in tokens. **Hallucination** — confident, fluent, wrong (plausible ≠ true). **Prompt engineering** — structuring the input (role/task/context/format/examples/constraints). **Few-shot** — steering by examples. **Chain-of-thought** — asking for visible reasoning. **Eval** — measuring quality with a test set + scorer + score. **RAG** — retrieve relevant chunks, augment the prompt, generate a grounded cited answer. **Chunking** — how you split documents for retrieval. **Cosine similarity** — how retrieval measures closeness. **Vector database** — a store that returns nearest-meaning neighbors. **Tool use / function calling** — the model requests, your code executes. **Agent** — an LLM in a loop choosing tools/steps toward a goal. **Workflow** — you fix the steps; the model fills them in. **Fine-tuning** — further training to teach behavior/style (not facts). **Prompt injection** — untrusted text becoming instructions. **Defense in depth** — layered mitigations because no single one is complete. **Streaming** — sending tokens as they generate for responsive UX. **Open weights** — a model whose parameters you can download and run yourself.

---

*If you can teach Part 7.3 to someone else — what's stable vs what changes — you've understood the point of the whole course.*
