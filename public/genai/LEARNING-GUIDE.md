# The Learning Guide
### Every concept in this course, in one place

Read this to *learn* or *refresh* everything the course teaches — whether you're the instructor prepping, or a student who wants the whole picture in one document. It's written in plain language, mental-models first. Each idea comes with **what it is → why it matters → how it fails.** If you understand this guide, you understand modern applied GenAI.

**Parts 1–7 are the main line and stay math-free.** [Part 8](#part-8--under-the-hood-the-depth-layer) is the *depth layer*: the mechanism underneath each idea, for readers who want to know why rather than just what. It mirrors the `<|deeper|>` panels in the slide decks — press **D** on any slide to open them — and it assumes nothing beyond first-year linear algebra and probability. Skip it on a first read; come back when a claim in Parts 1–7 starts feeling like something you were asked to take on faith. [Part 9](#part-9--the-whole-machine-end-to-end) is a single walk through the machine front to back &mdash; the prose companion to the *[How a language model works](how-llms-work.html)* page, and the place to start if you like seeing the whole object before its parts.

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

*A September 2026 note on the API:* Google deprecated the `temperature`, `top_p` and `top_k` request fields on Gemini 3.x in July 2026 (they are still accepted for now, and the Lab 1 demo re-verifies this before class). The dial itself has not gone anywhere — it is the same division inside softmax (§8.1) — but on the newest models the provider may fix it for you. Learn the mechanism, not the parameter name.

### 1.7 Parameters, training, and inference
A model is nothing more than **a file full of numbers** — billions to trillions of **parameters** (the "knobs"). You already know the idea from `y = wx + b`: w and b are parameters you'd adjust to fit a line. Training is exactly that, automated and enormous: guess the next token → measure how wrong (the "loss") → nudge every knob a tiny bit in the direction that reduces the error (**backpropagation + gradient descent**) → repeat over trillions of tokens for months.

**What one parameter actually is.** A single number — a small decimal like `0.0134` or `−0.271` — that says how strongly one thing feeds into another. That is the entire definition. It is not a fact, a word, a rule, or a row in a table: nobody has ever opened a model and found the parameter for "Paris is the capital of France." Any one fact is smeared across millions of parameters, and any one parameter takes part in millions of facts (Part 9 follows a single fact to where it lives). Two consequences you'll meet later: you can round every number in the file to four bits and the model still works (§8.18), and you cannot repair a wrong answer by editing the file — only by retraining, or by changing what you put in front of it.

**How they're stored.** Not as loose numbers. They are grouped into **tensors** — rectangular grids of numbers, each with a *name* saying which part of the architecture it belongs to, and a *shape* saying how big it is. A model file is a short header listing every tensor's name, shape, and byte offset, followed by one long wall of raw numbers. That is genuinely all it is. `.safetensors` (the PyTorch / Hugging Face standard) and `.gguf` (what Ollama and llama.cpp read) are both exactly that: header, then numbers. No code, no text, no database.

Every model file carries that header, and you can print it. Here is the front of one — a 1B-class open-weight model, built out of just three numbers: it is **16 layers** deep, **2,048** numbers wide, and knows **32,000** tokens. Every value in it is stored as `bf16`, a 16-bit float, so each one takes two bytes.

```
tensor                                          shape          size

# the dictionary: one row per token (§1.4)
model.embed_tokens.weight                       [32000, 2048]  131 MB

# attention: four tables per layer (§1.5)
model.layers.0.self_attn.q_proj.weight          [2048, 2048]   8.4 MB
model.layers.0.self_attn.k_proj.weight          [2048, 2048]   8.4 MB
model.layers.0.self_attn.v_proj.weight          [2048, 2048]   8.4 MB
model.layers.0.self_attn.o_proj.weight          [2048, 2048]   8.4 MB

# the fact store: three tables per layer, 4× wider
model.layers.0.mlp.gate_proj.weight             [8192, 2048]   33.6 MB
model.layers.0.mlp.up_proj.weight               [8192, 2048]   33.6 MB
model.layers.0.mlp.down_proj.weight             [2048, 8192]   33.6 MB

# normalisation: two vectors that keep the numbers in range
model.layers.0.input_layernorm.weight           [2048]         4.1 kB
model.layers.0.post_attention_layernorm.weight  [2048]         4.1 kB

      … the same nine tensors again, for layers 1–15 …

# the final vote: one row per token
lm_head.weight                                  [32000, 2048]  131 MB
```

**How to read one line.** Take `model.layers.0.self_attn.q_proj.weight` `[2048, 2048]` `8.4 MB` and read it in four pieces:

- `model.layers.0` — *where it sits.* This belongs to layer 0, the first of sixteen near-identical blocks every token passes through in order. The dotted name is a path into the architecture, not a label someone chose.
- `self_attn.q_proj` — *what it does.* Inside that layer, this is part of attention (§1.5): the table that turns each token into its "what am I looking for?" form, so it can be matched against what the other tokens offer.
- `.weight` — *the numbers themselves.* Some tensors also carry a `.bias`, a small offset added after the multiplication; most modern models leave biases out, which is why you see none here.
- `[2048, 2048]` — *the shape:* a grid of 2,048 rows by 2,048 columns. That is 2,048 × 2,048 = **4,194,304 numbers**, and `8.4 MB` is simply those numbers at two bytes each. One line of this header is 4.2 million of the model's parameters. Nothing is stored alongside them — no description of the table's job, no record of what it learned.

**Where the shapes come from.** Every shape in the file is assembled from those same three numbers, which is why the listing looks so repetitive:

- **2,048 — the width.** Each token travels through the model as a list of 2,048 numbers (§1.4). Any table that reads one such list and writes another is therefore `[2048, 2048]`, and there are four of them per layer for attention.
- **32,000 — the vocabulary.** The first and last tensors are the only two that touch actual words, so both have one row per token. `embed_tokens` *looks up* the starting numbers for the token you typed; `lm_head` *scores* all 32,000 candidates at the end. Same shape, opposite directions.
- **8,192 — four times the width.** The MLP widens each token's 2,048 numbers out to 8,192, runs its test there, and narrows back to 2,048. That is exactly why `gate` and `up` are `[8192, 2048]` and `down` is `[2048, 8192]` — the return trip. Roughly: 8,192 questions asked of the token, and something added to it for each one that answers yes (§9.6).

The layer number is the only thing that changes down the rest of the file: `layers.1`, `layers.2`, and so on to `layers.15`, the same nine tensors each time.

**Now count it.** One attention table is 4.2 million parameters, so a layer's four come to 16.8 million; its three MLP tables are four times wider and come to 50.3 million; the two normalisation vectors are a rounding error. That is **67.1 million per layer**. Sixteen layers, plus the dictionary at the front and the vote at the back, gives:

| what | parameters | share of the file |
|---|---|---|
| MLP tables (× 16 layers) | 805.3 million | 66.8% |
| attention tables (× 16 layers) | 268.4 million | 22.3% |
| the dictionary — `embed_tokens` | 65.5 million | 5.4% |
| the vote — `lm_head` | 65.5 million | 5.4% |
| normalisation vectors | 0.07 million | ~0% |
| **total** | **1.20 billion** | **100%** |

That total is what "a 1B model" means, literally, and you can check every row of it on a calculator. At two bytes a number the file is 1.20 billion × 2 = **2.4 GB on disk**; store the same numbers at 4 bits each and the identical model is 600 MB (§8.18 does that arithmetic properly). Real files vary in the details — some share the dictionary and the vote, some use smaller key/value tables — but the shape of the object is always this.

Two things worth taking from the table. **Two-thirds of a model file is the MLP**, the part that stores what it knows (§9.7–9.8) — so "how many parameters" is mostly a measure of how many facts fit, not of how clever the machinery is. And the tables that deal in actual words are a tenth of the file; everything else operates on lists of numbers that correspond to no word at all.

The file also contains nothing besides those tensors — no sentences, no sources, no index of what it read during training. Copy those 2.4 GB to a laptop with no internet and it still answers questions; delete them and what remains is a few thousand lines of code that would run just as happily on random numbers, producing gibberish.

You can see this on your own machine: after `ollama pull gemma3:4b`, run `ls -lh ~/.ollama/models/blobs`. One file is multiple gigabytes and the rest are a few hundred bytes each. The big one is the model. The small ones are its config and chat template.

**One naming trap.** The `temperature` and `top_p` you pass to an API (§1.6) are also called parameters, and they are not these. Those are dials on the sampling step, set fresh on every request; these are the learned contents of the file, frozen at the end of training. Same word, opposite ends of the system.

Two distinct moments, often confused:
- **Training** (writing the cookbook): happens once, in the lab, at huge cost. Ends with a **frozen file**.
- **Inference** (cooking from it): every time you use the model, your prompt flows through the frozen knobs. **The model does not learn from your chat.** (Your free-tier text may be used to train *future* versions, offline — which is why you don't paste private data.)

A crucial corollary: **a model has no memory.** Chat apps create the illusion of memory by silently re-sending the whole conversation into the model on every turn.

### 1.8 From base model to helpful assistant
A freshly pretrained model — a **base model**, or informally a *feral* one — only *continues* text. Ask it "What is 2+2?" and it might reply "What is 3+3? What is 4+4?" like a worksheet. It is a brilliant parrot of the internet: all of the knowledge, none of the manners. Three stages of "finishing school" turn it into an assistant:
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

### 2.8 The classical ML bridge

LLM evaluation is easier to reason about when you connect it to classical ML. A test set should be kept separate from the examples used to improve the system, just as a test split is kept separate from training. A baseline gives the number meaning. Precision asks how many flagged outputs were truly relevant; recall asks how many relevant cases were found; F1 balances the two. Accuracy alone can mislead when failures are rare or unevenly distributed.

For this course, the practical rule is simple: define the error you care about before writing the scorer. A regulation assistant may prioritize recall for finding the correct policy paragraph, while an automated email tool may prioritize precision because a false positive sends a real message. The metric follows the consequence.

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

### 3.6 Structured outputs — constrained shape, not guaranteed truth
Prompt-begging ("Reply ONLY with JSON…") works until the model adds a code fence or a friendly preamble and your parser crashes. The production way: pass a **schema with the request** — in the Gemini SDK, `response_mime_type="application/json"` plus `response_schema=…` (every major provider has an equivalent). Constrained decoding reduces malformed output, but it does not guarantee a successful request, correct values, or an honest answer when the source is unreadable. Give the schema an explicit unknown/null outcome, parse defensively, and verify the values against the source. Prompts steer content; schemas constrain shape.

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

### 5.2a Prompt engineering versus context engineering

**Prompt engineering** improves the instruction: task, role, examples, constraints, and output format. **Context engineering** decides what information enters the model at all: conversation history, retrieved chunks, tool results, metadata, user permissions, and the order in which those pieces appear.

Many failures blamed on a weak prompt are actually context failures. The relevant document was not retrieved, stale content was included, a tool returned too much raw JSON, or untrusted text was placed beside trusted instructions without a clear label. A useful debugging order is: inspect the assembled context → inspect retrieval/tool results → inspect the instruction → inspect the model choice.

Treat context as an engineered resource. Keep it relevant, short, dated, permission-filtered, and observable. The model cannot use information that never reaches it, and it cannot reliably distinguish every instruction from every piece of text it receives.

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

### 7.5 Turning this into a final-year project
The scoping rule, in one line: **one user, one document type, one measurable claim.** Not "an AI assistant for students" — the exam-cell clerk who answers the same forty questions every semester, your university's regulations PDF, and a sentence with a number in it: "answers regulation questions at 84% on a 100-question test set, against 61% for the ungrounded model." If the claim has no number, you are planning a demo, and demos are not gradeable.

What a defensible project shows a review panel — and this is exactly what the capstone rubric already grades: a **working demo**, an **eval set a person wrote** (never the model being tested — a model grading its own homework is the first thing examiners look for now), a **baseline you beat** (the ungrounded model, keyword search, the manual process), **one documented failure** you present before anyone finds one you didn't, and the **cost arithmetic** per user per month. The sentence that survives every panel: *here is the metric, here is the baseline, here is where it fails.*

Scopes that work from exactly what you built in the labs: a Tamil-language government-scheme assistant grounded in the scheme PDFs (S4 + S2's eval habit); your department's regulations bot with citations and refusal (S4 + S6 hardening); a marksheet/form extraction pipeline measured field-by-field (S3); a codebase RAG assistant over one final-year repository; or an evaluation/observability dashboard that records prompt versions, retrieval, tokens, latency, cost, and failures. The browser-friendly **[College Project Tracks](COLLEGE-PROJECT-TRACKS.html)** guide gives Level 1, 2, and 3 scopes, minimum evidence, a semester progression, and a rubric. The external **AI Engineering from Scratch** curriculum is a useful selective roadmap for classical ML evaluation, self-attention, tokenizer construction, context engineering, tool protocols, and observability; its full 503-lesson scope is not a second weekend syllabus. The same skills are also a career door: **forward deployed engineer** (also advertised as solutions engineer or applied AI engineer) is the role whose working week is exactly these project shapes — embed with a customer, build on a platform's models, prove value with numbers.

### 7.6 Reading the literature (for the research-minded)
Where new work appears: **arXiv**, mostly under cs.CL and cs.LG, months before any journal — plus the proceedings of the main venues (NeurIPS, ICLR, ICML, ACL, EMNLP), all open access. Read a paper in this order: **abstract → figures → results table → limitations → method**, and stop when you have what you came for; people bounce off papers because they start at the method section, which is written for reviewers.

Whether a paper deserves your afternoon — three questions against the abstract and results table: Is there an experiment you could rerun in principle? Is the comparison against a baseline you recognize? Does any decision you make change if the claim is true? Two yeses → keep reading. Starter set, by stable arXiv ID: *Attention Is All You Need* (1706.03762), the Chinchilla scaling paper (2203.15556), *RAG* (2005.11401), *ReAct* (2210.03629), *Lost in the Middle* (2307.03172), the instruction-following paper (2203.02155).

Running a rigorous experiment is machinery you already have: fix a baseline, change one variable at a time, temperature 0 with three runs, report the spread, size the test set to the claim (accuracy on n questions is trustworthy to roughly ±1/√n — see §8.8), and publish the test set, because a result whose test set is private is an anecdote. Open problems reachable on a free tier — native-language eval coverage, chunking-strategy comparison, LLM-judge bias replication, injection-defense measurement — are laid out in the book's **Appendix D**, in the section written for exactly this reader.

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

## Part 9 · The whole machine, end to end

Part 8 goes one level under each idea in Parts 1–7. This part does something different: it is a single walk through the machine, front to back, so the pieces connect into one object instead of eight good explanations.

It is the prose companion to **[How a language model works](how-llms-work.html)** — the interactive page linked from the course home, where a small GPT trained on Thirukkural runs live and every idea below has a widget. If you have thirty minutes, go through that first and use this to fix it in memory. Everything here is architecture: what is *in* a model. Parts 1–6 are what it *does*.

**If a student wants to see it on a real model.** [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) (Georgia Tech) runs an actual GPT-2 in the browser: type a sentence, watch it flow through all twelve blocks, and open the attention view to see the same masked grid as §9.6 with real weights in it. It is the best thing on the internet for seeing the *shapes* of the data, and the grid in §9.6 is modelled on its attention panel. Two practical warnings before you put it on a projector: it downloads roughly 600 MB of weights on first load, so open it well before class, and it explains dropout and layer norm as inference-time components when dropout is training-only — worth a word if a sharp student notices.

The whole part chases one question. Type **"Elon Musk wants to colonize ___"** into any model and it answers *Mars*. Nothing was looked up — there is no database inside, no row that reads `Musk → Mars`, and the file does not change while you type. So where is that fact?

### 9.1 A model is a file, sorted into four kinds of table

Everything a model has ever produced came out of a file of numbers — about 175 billion of them at GPT-3's size. They are not a jumble. They sort into four kinds of table, each with one job:

| Plain name | Job | Size | Written |
|---|---|---|---|
| **the dictionary** | turns a word into numbers | 617 million | `W_E` |
| **the lookup** | "which other words matter right here?" | 58 billion, 96 copies | `W_Q W_K W_V W_O` |
| **the memory** | "what do I know about this thing?" | 116 billion, 96 copies | `W_up W_down` |
| **the vote** | turns numbers back into a word | 617 million | `W_U` |

Those `W` names are labels people gave the tables; nothing is hiding in them. Every number was fixed during training and never changes again while you chat. Our fact is not in the dictionary and not in the vote — hold that thought.

### 9.2 The dictionary: a word becomes a direction

The dictionary hands each word a long list of numbers — 12,288 of them. A list that long is an arrow pointing somewhere in a very large space.

The useful structure in that space is not *where* words sit but **which way you travel** to change them. One direction means "more feminine", another "make it plural", another "past tense". Nobody designed these; they fell out of training. It is why `king − man + woman ≈ queen` works — the space showing you its filing system.

To ask *"how much of this idea does that arrow carry?"*, multiply the two lists element by element and add it all up. One number; big means aligned. That single operation — the **dot product** — is most of what the rest of the machine does.

### 9.3 Superposition: how everything fits in 12,288 numbers

Obvious objection: if every idea needed its own perpendicular direction, the model could hold 12,288 ideas, and it plainly knows millions.

The escape is a genuinely strange fact about large spaces. Directions do not have to be *perfectly* perpendicular to stay tellable apart — only **nearly** perpendicular. And in a big space, near-perpendicular is not something you arrange; it is what two directions already are. For two random unit vectors in *d* dimensions the angle between them concentrates hard on 90°, with a spread of roughly `57.3/√d` degrees:

| dimensions | angle between two random directions |
|---|---|
| 2 | any angle at all |
| 3 | 90° ± 33° |
| 100 | 90° ± 6° |
| 12,288 | **90° ± 0.5°** |

So you never have to arrange anything — you keep adding ideas and they keep staying distinguishable. This is **superposition**, and it has a consequence that matters for interpretability: a single neuron is usually participating in several unrelated ideas at once, which is exactly why reading one off is so hard.

### 9.4 The residual stream: a track, and everything adds to it

Here is the idea that makes the rest cohere, and it is rarely said out loud. Every word in your prompt gets its arrow, and each arrow travels the whole length of the model on its own track — the **residual stream**.

The tables along the way never *replace* the arrow. Each one reads it, computes a small correction, and **adds** that correction in. Ninety-six times.

So the arrow above the blank starts out meaning almost nothing and arrives meaning *"a particular planet"*. Nothing overwrote it; it was nudged, ninety-six times. Two kinds of table do that nudging, and they do different jobs.

Two pieces of housekeeping ride along, worth naming so they are not a surprise in someone else's diagram. Before each table reads the arrow, the arrow is rescaled to a standard size — **layer normalization**. It changes the vector's length, not its direction, and its job is to stop values exploding or collapsing as ninety-six rounds of addition pile up; deep stacks do not train without it. And the arrows already carry **where each word sat in the sentence**, added in before the journey started (§8.3) — attention itself has no notion of order, so order has to be baked into the vectors beforehand.

### 9.5 The lookup (attention): three matrices, three questions

Before it can recall anything, the blank has to work out what it is completing. "wants to colonize" could follow a person, a company, a century. It has to notice the subject is **Elon Musk** and the verb is about **going somewhere**.

So every word's arrow is multiplied by three different tables, producing three new arrows with three different jobs:

- **what I want** — what am I looking for? *(the query, Q)*
- **what I have** — what do I offer? *(the key, K)*
- **what I'd add** — what do I contribute if picked? *(the value, V)*

Every "what I want" is dot-producted against every "what I have" — that is the "looking". A high score means listen. The scores become weights, the "what I'd add" arrows get blended in those proportions, and the result is **added to the residual stream**. That is one head; GPT-3 runs 96 per layer in parallel, each hunting for something different.

That is one word's view of the looking. The machine does all of them at once — and then throws a good deal of it away.

### 9.6 The scoring: score everything, strike out the future, soften what is left

§9.5 followed one word's query meeting everyone's keys. The machine does not work one word at a time. It scores **all of them at once**, as a grid.

Take the six tokens of our sentence — `Elon`, `Musk`, `wants`, `to`, `colonize`, and the blank. Every one produces a query and a key, so every one scores every other: **thirty-six numbers**, computed in a single matrix multiply. That grid is what every published picture of attention is actually showing you. Three things happen to it, in order.

**1 · Score.** Each cell is one dot product — row *i*'s query against column *j*'s key. Raw, unbounded, frequently negative. Nothing about them is a probability yet.

**2 · Strike out the future — the causal mask.** Fifteen of the thirty-six cells are thrown away before anything else happens: every cell whose column sits *later* than its row. `wants` may look at `Elon` and `Musk`; it may not look at `colonize`. Those cells are set to negative infinity so the next step gives them exactly zero weight.

That single rule carries more consequences than anything else in this part:

- It is why a model writes **left to right, one token at a time**, and can never go back and revise a word it has already emitted. There is no mechanism by which token 3 could be reconsidered in light of token 9 — token 3 was computed when token 9 did not exist.
- It is why training can learn from a whole document in one pass: every position predicts its own next token simultaneously, and none of them can cheat by reading ahead. Without the mask the task would be trivial and the model would learn nothing.
- It is why the earlier rows never change as generation proceeds — which is exactly what makes the **KV cache** (§8.6) possible. Keys and values for tokens already written are stored and reused, so each new token costs one row, not the whole grid.

**3 · Soften.** Each surviving row goes through softmax and becomes shares adding to one. Now they are weights: how much of each earlier word's "what I'd add" gets blended into this position.

For our sentence that produces the following. The raw scores are illustrative; the arithmetic on them is real, and every row adds to exactly 100.

| looking from ↓ | Elon | Musk | wants | to | colonize | blank |
|---|---|---|---|---|---|---|
| **Elon** | 100% | — | — | — | — | — |
| **Musk** | 82% | 18% | — | — | — | — |
| **wants** | 10% | 68% | 22% | — | — | — |
| **to** | 1% | 11% | 71% | 17% | — | — |
| **colonize** | 7% | 41% | 22% | 2% | 28% | — |
| **blank** | 8% | **52%** | 3% | 2% | **29%** | 6% |

Read the bottom row and you have §9.5's bar chart: the blank spends most of its attention on `Musk` and `colonize` — the subject and the verb — which is exactly what it must establish before the memory can supply a planet. Read the top-left cell and you have the degenerate case: the first token has nobody to look at but itself, takes 100%, and learns nothing from attention at all.

**And all of that was one head.** Everything above used a single set of Q/K/V tables. GPT-3 runs **96 of them side by side in every layer**, each with its own three tables, each scoring the same six words for something different. Their outputs are concatenated and projected back to one vector, and *that* is what gets added to the residual stream. Nobody assigns the jobs — heads specialise during training, and interpretability work keeps finding legible ones: a head that always looks one token back, a head that tracks the subject, a head that copies a pattern it saw earlier in the same context.

The grid is also where attention's cost comes from: *n* tokens means *n²* cells. That is the wall described in §8.3, and it is why doubling the context quadruples this step.

Attention has now established the topic. It still does not know Mars.

**Teaching note.** The mask is the cheapest big win in this whole part. Students arrive assuming a model "reads the sentence" the way they do, and the triangular grid kills that assumption in one picture — nothing above the diagonal was ever available. If a student asks why ChatGPT sometimes contradicts its own first sentence, this is the answer: it could not see the second one when it wrote the first.

### 9.7 The memory (the MLP): where the fact actually lives

After each attention block sits a plain pair of tables — the **MLP** — and this is the end of the hunt.

Its structure is almost comically literal. The first table is a wall of questions, one per neuron: *"is this Elon Musk, and is it about space?"* Each row scores the arrow, and the nonlinearity throws away every score that came out negative, so a neuron either fires or stays quiet. GPT-3 has 49,152 of these questions per layer.

The second table is the answer sheet. For every neuron that fired, it adds that neuron's stored direction back into the stream — *"…then add Mars."*

That is where the fact lives. Not as text, not as a row in a table, but as **a direction that gets added whenever one particular question is answered yes** — with millions of other facts sharing the same space by superposition (§9.3). This structure is often called a **key-value memory**: the first table holds the keys, the second holds the values.

### 9.8 The parameter budget: two-thirds is a filing cabinet

If facts live in the memory tables, there had better be a great many of them. There are — and every explanation of transformers you have read is busy talking about the other part:

| Component | Parameters | Share |
|---|---|---|
| **the memory** (MLP) | ~116 billion | **66%** |
| **the lookup** (attention) | ~58 billion | 33% |
| dictionary + vote | ~1.2 billion | ~1% |

Two things follow. **The lookup decides what is relevant; the memory holds what is known.** And "how many parameters" was never a measure of cleverness — it is mostly a measure of **how many facts fit**.

Modern mixture-of-experts models complicate the picture (§8.5) by leaving most of those memory parameters dormant on any given token, which is how a trillion-parameter model can be cheap to run. The split between *decide* and *know* survives it.

### 9.9 The vote: back to a word

After ninety-six rounds of adding, the arrow above the blank has accumulated everything the model worked out. Getting a word out takes one last operation: dot it against every row of the vote table — one row per token in the vocabulary, 50,257 of them. Fifty thousand dot products, fifty thousand scores.

Those scores are the **logits**. Softmax turns them into probabilities, temperature stretches or squashes them first (§8.1), and one token is drawn. Then the entire journey runs again for the next token, with the answer-so-far appended to the input.

### 9.10 One pass, end to end — the slide, narrated

Chapter 11 of [the page](how-llms-work.html) puts every piece above on one screen and lights up seven stages as the kural model writes a couplet, so the thing stops being seven explanations and becomes one object. Use this as the narration if you are driving it on a projector; press *slow* to hold each stage for half a second.

| # | Stage | What to say |
|---|---|---|
| 1 | **the words** | Six tokens go in. Nothing else about the sentence survives past this point — not the spaces, not the capitals, just six chunks. |
| 2 | **the dictionary** | Each becomes a long list of numbers, an arrow in a 12,288-dimension space. From here the machine only does arithmetic. |
| 3 | **the track** | Each arrow gets its own track and rides it the whole width. Nothing replaces an arrow; every table only ever **adds** (§9.4). |
| 4 | **the lookup** | Three arrows per word — what I want, what I have, what I'd add. They score each other in a grid, the future is struck out, and the blend is added back to *every* track (§9.5–9.6). |
| 5 | **the memory** | 49,152 questions per layer. The ones that answer yes add their stored direction. *This is the stage where Mars enters the diagram* (§9.7). |
| 6 | **× 96** | That pair is one block. Ninety-six of them, stacked — and each one reads the *conclusions* of the one before it, not the raw words. |
| 7 | **the vote** | Only the **last** track is asked for a word. Its arrow is scored against all 50,257 rows (§9.9). |
| 8 | **the word** | Scores become percentages, one is drawn, and that is one word. Then the entire diagram runs again with the new word part of the input. |

**The two things students take away from this slide that they do not take from the parts.** First, the **width** of it: they can see that the interesting machinery is the middle two boxes and that everything else is plumbing. Second, stage 7 — **only the last track is asked**. Almost everyone assumes all six positions produce a word. They do during training; at generation time five of the six tracks are computed and then not consulted, which is exactly the redundancy the KV cache (§8.6) exists to remove.

**If you are short on time,** run stages 1, 4, 5 and 8 and skip the rest — that is the shortest path that still lands "decide, then recall, then vote."

### 9.11 Why this is worth knowing

Mars was a direction. Not a row in a table, not a sentence stored somewhere — a direction in a space of 12,288 numbers, added to a running total the moment one neuron out of 49,152 decided that yes, this is Elon Musk and this is about space.

Everything a model knows is kept that way, which is the single most useful thing to take from this part: **nothing in there marks the difference between a fact and a very well-worn pattern.** A confident wrong answer and a confident right answer are produced by identical machinery, travelling the identical track. That is not a bug to be patched out; it is what the architecture *is*, and it is the reason the rest of this course is about measurement (Part 2), grounding (Part 4), and keeping a human on the blast radius (Part 6).

---

## Glossary (fast reference)
**Token** — the chunk a model reads (~¾ word). **Embedding** — text turned into meaning-coordinates. **Attention** — words weighing each other to resolve meaning; the Transformer's engine. **Parameter** — one learned knob; a model is a file of billions. **Tensor** — the named grid of numbers that parameters are stored in; a model file is a header of tensor names and shapes followed by a wall of numbers (`.safetensors`, `.gguf`). **Inference** — using the frozen model (no learning, no memory). **Temperature** — the randomness dial on sampling. **Context window** — the model's working memory, measured in tokens. **Hallucination** — confident, fluent, wrong (plausible ≠ true). **Prompt engineering** — structuring the input (role/task/context/format/examples/constraints). **Few-shot** — steering by examples. **Chain-of-thought** — asking for visible reasoning. **Eval** — measuring quality with a test set + scorer + score. **RAG** — retrieve relevant chunks, augment the prompt, generate a grounded cited answer. **Chunking** — how you split documents for retrieval. **Cosine similarity** — how retrieval measures closeness. **Vector database** — a store that returns nearest-meaning neighbors. **Tool use / function calling** — the model requests, your code executes. **Agent** — an LLM in a loop choosing tools/steps toward a goal. **Workflow** — you fix the steps; the model fills them in. **Fine-tuning** — further training to teach behavior/style (not facts). **Prompt injection** — untrusted text becoming instructions. **Defense in depth** — layered mitigations because no single one is complete. **Streaming** — sending tokens as they generate for responsive UX. **Open weights** — a model whose parameters you can download and run yourself.

**Architecture terms (Part 9).** **The dictionary / the lookup / the memory / the vote** — plain names for the four kinds of table in a model file (embedding, attention, MLP, unembedding). **Residual stream** — the track each token's vector rides through the whole network; every block *adds* to it, nothing is replaced. **Query / key / value (Q, K, V)** — "what I want", "what I have", "what I'd add"; attention matches the first against the second and blends the third. **MLP / feed-forward** — the two tables after each attention block; two-thirds of all parameters, and where facts are stored. **Key-value memory** — the MLP read as a wall of questions (keys) plus an answer sheet (values). **Attention matrix** — the *n*×*n* grid of scores, every token's query against every token's key; the object every attention diagram is drawing. **Causal mask** — striking out every cell where the column is later than the row, so no token can see the future; the reason generation is left-to-right and the reason a KV cache works. **Multi-head attention** — many independent Q/K/V sets per layer (96 in GPT-3), run in parallel and concatenated, each learning to look for something different. **Layer normalization** — rescaling a vector to a standard size before each table reads it; changes its length, not its direction, and is what lets deep stacks train. **GELU** — the nonlinearity in GPT's MLP; a smoothed version of "throw away the negatives" that lets small values through partially. **Superposition** — packing far more ideas than dimensions by using directions that are only *nearly* perpendicular. **Unembedding** — the final table that turns the vector back into one score per word.

**Depth-layer terms (Part 8).** **Logit** — the raw score a model emits per vocabulary token, before softmax. **Softmax** — turns logits into probabilities summing to 1; temperature divides the logits inside it. **Top-k / top-p** — trim the candidate set before sampling. **Loss (cross-entropy)** — −log of the probability placed on the true next token; the number training minimises. **Perplexity** — exp(loss); "how many options is it effectively choosing between?" **Positional encoding / RoPE** — how order gets into an order-blind attention mechanism. **n²** — attention's cost curve in context length. **Scaling laws / Chinchilla** — capability follows compute predictably; scale parameters and data together. **MoE** — many expert sub-networks, few active per token. **Distillation** — a small student trained to imitate a large teacher's output distribution. **Quantization** — fewer bits per parameter; params × bits ÷ 8 = file size. **KV cache** — stored keys/values that make decode cheap; splits latency into prefill and decode. **TTFT** — time to first token (prefill). **Context caching** — renting a pinned prompt prefix for ~10% of the price. **Precision / recall / F1** — which kind of error you're making, not just how many. **Position bias** — an LLM judge preferring whichever answer came first; fix by swapping and re-running. **Recall@k / MRR** — did the right chunk arrive, and did it arrive near the top. **Faithfulness** — did the answer actually come from the retrieved chunk. **Bi-encoder / cross-encoder** — fast separate embedding vs slow joint scoring; the basis of reranking. **BM25 / hybrid search** — keyword ranking merged with semantic ranking. **Constrained decoding** — masking schema-illegal tokens to −∞ so malformed output is unreachable. **Trajectory eval** — grading an agent's path (tool choice, step count, wasted calls), not only its answer. **p50 / p99** — median and tail latency; report both, never the mean. **Idempotency** — making a retry safe for anything with a side effect.

---

*If you can teach Part 7.3 to someone else — what's stable vs what changes — you've understood the point of the whole course. And if you can teach any section of Part 8 to someone else, you've understood why it's stable. Part 9 is the object all of it lives inside.*
