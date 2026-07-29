# Session 1 — Instructor Prep Pack
## the deep version

**Purpose:** master this material to one level *below* every slide, so you are never caught one question deep in front of 4th-year CSE students and their professors. The run sheet (`session-1-notes.md`) is delivery-day only; this file is for the days before. First pass ≈ 3 hours with a pen. Re-skim the night before ≈ 30 min.

Slide numbers below are deck positions (`#N` in the URL, 1–31), not the on-screen kicker numbers. Deck: `presentations/session-1-how-machines-learned-to-talk.html` — 31 slides, ~19 interactive moments.

---

## 1 · The narrative spine — own this first

Session 1 is one continuous argument, seven beats:

1. **Old AI judges, new AI creates** (classify game, rings) — and the words AI/ML/DL/GenAI/LLM nest cleanly.
2. **Creation is next-token prediction, repeated** (one-idea slide, guessing game, network animation, temperature) — one loop, dice on top.
3. **The probabilities come from knobs, not lookup** (not-a-database, fit-the-line, cookbook quiz) — a model is a file of learned parameters, frozen at inference.
4. **The machinery of one pass: tokens → embeddings → attention → probabilities → sample** (tokenizer, map, attention, stepper) — the full loop, assembled.
5. **Three dials of intelligence: scale, finishing school, thinking time** (scale slider, base-vs-tuned, finishing school, reasoning models) — 2022's breakthrough was dial 2; since late 2024 there's dial 3.
6. **The consequences are predictable** (famous failures, context window) — every "bug" falls straight out of beats 2–4, and each has an engineering fix taught later in this course.
7. **You can drive it yourself, today** (API anatomy, lab kit, Lab 1).

**Readiness test:** tell this story out loud, no slides, in 3 minutes. Record it on your phone; listen back. If beat 3 → beat 4 feels rough, that's the seam students fall into ("okay, knobs — but knobs doing *what*?"). The answer that stitches it: *the knobs are the weights that turn this pass's tokens into this pass's probabilities.*

---

## 2 · Concept deep-dives, slide by slide

Rhythm per concept: **Claim** (what the slide says) → **Mechanism** (one honest level deeper — enough to improvise on a whiteboard) → **Worked example** (real numbers you can reproduce) → **Pushback** (hardest realistic questions + strong answers) → **Landmine** (what not to say).

### Slides 1–3 · Title, instructor, the promise

**Claim.** Six sessions, six artifacts; you sat in these seats; first API call before you leave.

**Mechanism.** These slides buy you the room. Bio in under 45 seconds — one line of credibility, one of humility; the "hundreds of failed things" line gets the laugh, let it land. Walk the six artifacts fast and plant the capstone seed.

**Landmine.** Don't oversell ("you'll all be AI engineers") and don't stack credentials — the professors in the room calibrate you on this slide. The work sells you; move on.

### Slide 4 · Judges vs creators (classify game)

**Claim.** Discriminative AI labels what exists; generative AI produces new content. Same math family, different training target.

**Mechanism.** Formally: discriminative models learn P(label | input) — a boundary in feature space. Generative language models learn P(next token | all previous tokens) and *sample* from it — which lets them construct arbitrarily long new sequences. Both are neural nets trained by gradient descent; the output layer and the loss define the species. The keyboard-autocomplete item is the deliberate gotcha: it *generates* — it's a tiny language model, the ancestor of everything in this course.

**Worked example.** Spam filter output: one number, P(spam) = 0.97 → label. LLM output for "I had idli and ___": a whole distribution — sambar 0.44, chutney 0.31, vada 0.14, coffee 0.07, biryani 0.02 — then a die roll. Judge emits a verdict; creator emits a distribution and samples.

**Pushback.** *"Google Maps ETA predicts a number — isn't prediction generation?"* — It predicts a property of existing reality; it can't produce a novel artifact. The line is "labels/quantifies what exists" vs "constructs something new." *"Are diffusion image models 'next-token' too?"* — No; they denoise. Generative ≠ LLM; LLMs are the language corner of generative AI (that's the rings slide).

**Landmine.** Don't say discriminative AI is obsolete — it still runs fraud detection, ranking, face unlock. "Ran the world 2012–2022" means it *dominated the headlines*, not that it retired.

### Slide 5 · Terminology rings (AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM)

**Claim.** The words nest; ChatGPT is the app, GPT is the model — WhatsApp vs the phone network.

**Mechanism.** A model artifact is literally tensors of floating-point weights plus an architecture config. "Deep" = many stacked layers. GenAI includes diffusion models (Session 3) — not everything generative is an LLM. Modern frontier LLMs are usually **mixture-of-experts (MoE)**: each token is routed through a subset of expert sub-networks, so total parameters ≫ parameters active per token — one reason "how many parameters?" has no single honest number.

**Worked example.** File-size sanity check you can do on a board: a 4B-parameter model at 2 bytes/weight (fp16) = **8 GB file**. 4-bit quantized ≈ **2.5 GB** — which is why an 8 GB-RAM laptop runs 3–4B models (Session 5, Ollama). A model is a *file*; you can hold it.

**Pushback.** *"Is Gemini one model?"* — A family: Flash (speed/cost) and Pro (capability), plus versions. *"Where do reasoning models sit?"* — Same ring (LLMs), different inference habit — slide 22.

**Landmine.** Never state parameter counts for GPT-5.6 / Gemini 3.5 / Claude — not public. Say "estimated hundreds of billions to trillions; the labs don't disclose, and MoE makes the count ambiguous anyway."

### Slide 6 · The one idea: autocomplete with a PhD

**Claim.** Every LLM does one thing: given text, predict the next token; append; repeat.

**Mechanism.** This is **autoregressive generation**. One forward pass through the network produces a score (**logit**) for *every* token in the vocabulary (~50k–250k+ entries), softmax turns scores into probabilities, one token is sampled and appended, and the whole (now longer) sequence goes back in. There is no plan, no outline, no sentence-level intent — any appearance of planning is the distribution being sharp because training data makes it sharp.

**Worked example.** "Why is Madurai famous?" → answer "Madurai is famous for the Meenakshi Temple." = 9 generated tokens = 9 full forward passes, each scoring the entire vocabulary. A 500-word answer ≈ 650 passes. Do this arithmetic out loud once — it re-frames the 1–3 s API latency as *the loop physically running*.

**Pushback.** *"But it clearly reasons — chain-of-thought, code, proofs?"* — Hold it: "park that until the scale slider and the reasoning-models slide; the answer is that reasoning *behavior* emerges from this loop plus scale plus training, and since 2024 labs deliberately aim the loop at scratch paper first."

**Landmine.** Don't let "just autocomplete" become dismissive. The claim is architectural, not a capability ceiling — the hot-take slide picks that fight deliberately, later, on your terms.

### Slide 8 · Where the odds come from — count the words (Markov demo)

**Claim.** The probabilities the model samples from aren't magic or memory — they're just counts. Tally which word follows which across a handful of messages, normalize each row, and you have a next-word distribution.

**Mechanism.** This is a **bigram Markov model** (an *n*-gram model with n=2). "Training" = for every adjacent pair (a, b) in the corpus, increment `count[a][b]`, with `<|start|>`/`<|end|>` markers bracketing each message. To generate: read the current word, look up its row, normalize the counts to probabilities, sample one, append, repeat until you draw `<|end|>` — which is exactly what an EOS token does in a real LLM. Same three-step loop as slide 9 (read context → distribution → sample); only step 2 differs (a table you can print vs a forward pass through billions of parameters), and training differs (counting vs learning a function by gradient descent).

**Worked example (on the widget).** After `<|start|>` the row reads the (2), did (2), i (1) → 40/40/20%. *Take the top* walks the greedy path "the build is failing again"; *Sample* a few times rolls other paths ("the code is fine"). Land the honest caveat: counting can't scale — an n-word context needs vocabulary​ᴺ rows, which is why LLMs learn a compressed *function* instead of storing the table. History anchor: Markov 1906 → n-gram phone autocomplete ~2010 → transformers 2017.

**Pushback.** *"So an LLM is just a big lookup table?"* — No. That table would be astronomically large and could only ever replay text it has seen; the LLM learns a function that generalizes to word sequences it never saw. Same interface, radically different engine.

**Landmine.** Don't oversell the toy — it knows adjacency, not meaning. It is the bridge from "you guessed the next word" (slide 7) to "a network computes the guess" (slide 9), not a model of understanding.

### Slide 9 · Watch the network think (`#nnviz` — the animated 21-neuron net)

**Claim.** One forward pass = one next-token guess: numbers in, numbers between, probabilities out, one token appended, repeat.

**Mechanism — know exactly what this toy is.** The animation is a **plain MLP (multi-layer perceptron)**: three columns of 7/8/6 = 21 neurons, fully connected, activations and edge highlights are randomized for effect, and the output distribution is hard-coded (Chennai 78% …). It contains **no attention** — no token talks to any other token in this picture. A real transformer block = **attention layer (tokens exchange information) + an MLP like this one (each position processed through learned weights)**, stacked dozens of times. So the toy honestly shows the *feed-forward half* of the real thing and the overall choreography (embed → mix → distribution → sample → append), and deliberately omits the token-mixing half, which gets its own demo on slide 16.

**Worked example.** What one neuron does, on a board: output = f(w₁x₁ + w₂x₂ + w₃x₃ + b). E.g. inputs [0.2, −1.0, 0.5], weights [1.5, 0.3, −2.0], b = 0.1 → 0.3 − 0.3 − 1.0 + 0.1 = −0.9 → ReLU(−0.9) = 0. "A neuron is a weighted opinion with a threshold. Twenty-one of them here; frontier models have hundreds of billions of weights."

**Pushback.** *"Where's the attention in this animation?"* (a sharp student WILL ask) — "Not in it — this is deliberately the MLP half. Attention is two demos away; real transformers alternate attention and layers exactly like these." Say it precisely and you gain credibility; fumble it and you lose the room's top 10%. *"Are the firing patterns real?"* — No: randomized visuals, hard-coded probabilities. The choreography is real; the numbers are staged.

**Landmine.** Never call this "a small transformer" or "how GPT looks inside." It's an MLP illustration of the forward pass. The deck's own note says "honest scale"; keep your language equally honest.

### Slides 7 & 9 · Next-token game + temperature (logits, softmax, sampling)

**Claim.** The model outputs a probability for every possible next token; it samples rather than always taking #1; temperature reshapes the dice.

**Mechanism.** Softmax with temperature: **p(i) = exp(zᵢ/T) / Σⱼ exp(zⱼ/T)**. T→0 collapses onto the argmax (greedy); T=1 uses raw logits; T>1 flattens. APIs also expose **top-k** (keep only k best before sampling) and **top-p / nucleus** (smallest set whose probabilities sum to p). Even at T=0, production output isn't guaranteed byte-identical (floating-point nondeterminism, batching) — "practically deterministic" is the honest phrase.

**Worked example — memorize this table; it's your whiteboard set-piece.** Toy vocab of 3, logits: Chennai z=4, Madurai z=2, pizza z=0.

| | T = 0.5 | T = 1 | T = 2 |
|---|---|---|---|
| z/T | 8 / 4 / 0 | 4 / 2 / 0 | 2 / 1 / 0 |
| e^(z/T) | 2981 / 54.6 / 1 | 54.6 / 7.39 / 1 | 7.39 / 2.72 / 1 |
| **P(Chennai)** | **98.2%** | **86.7%** | **66.5%** |
| **P(Madurai)** | **1.8%** | **11.7%** | **24.5%** |
| **P(pizza)** | **0.03%** | **1.6%** | **9.0%** |

Same knowledge, three different dice. At T=2, pizza comes up roughly 1 roll in 11 — exactly why the demo's "Roll 10×" at high T eventually shows pizza. (Note: the *slide widget* computes `p^(1/T)` renormalized over stored probabilities — mathematically the same family, since pᵢ^(1/T) ∝ exp(ln pᵢ / T); the widget's "logits" are just log-probabilities.)

**Pushback.** *"If it's dice, how is it ever reliably right?"* — Because the distribution is savagely concentrated where training data pins it down: dice with 98% on one face are almost a decision. *"Why sample at all — why not always pick #1?"* — Pure greedy text is repetitive and degenerate ("the the the" loops in early systems); controlled randomness produces natural, diverse text. For extraction/code you *do* set T≈0.

**Landmine.** Never say "it's random." It samples from a *learned* distribution — all the intelligence is in the shape of that distribution. And don't claim T=0 guarantees identical outputs.

### Slide 11 · Not a database

**Claim.** Nothing is stored as sentences; every reply is computed fresh from learned patterns — proof: text that has never existed (pirate poem about jigarthanda).

**Mechanism.** Think compression, not storage. Pretraining corpora are tens of trillions of tokens — tens of terabytes of text. The resulting weights file is orders of magnitude smaller (that 8 GB figure for a 4B model). The corpus provably cannot be *in* the file verbatim; what's in it is statistical structure. The honest fine print: heavily repeated text (famous quotes, licenses, Bible verses) does get effectively memorized into the weights — that's why the slide says "ask for anything *new* and it must compute."

**Worked example.** Board math: ~15 trillion training tokens × ~4 bytes/token ≈ 60 TB of text → distilled into a file thousands of times smaller. "It didn't keep the library; it kept what the library *taught it*."

**Pushback.** *"Then how does it quote Thirukkural exactly?"* — Repetition burns high-frequency text into the knobs; that's memorization through training, still not lookup at runtime. *"Isn't that copyright infringement?"* — Live legal question (ongoing suits over training data); the technical fact is verbatim retention is the exception, not the mechanism. Don't play lawyer; do name the tension.

**Landmine.** Don't overclaim "it never memorizes anything" — extraction attacks have recovered training snippets. The defensible claim: *no retrieval happens at inference; generation is computation.*

### Slide 12 · What's inside? Just knobs (fit-the-line widget)

**Claim.** y = wx + b: w and b are parameters; training = nudge knobs to reduce error; a model is a file of learned knob values.

**Mechanism.** Training minimizes **cross-entropy loss** on next-token prediction ("how surprised were you by the true next token?"). **Backpropagation** computes, for every knob, the direction that reduces the loss; **gradient descent** nudges every knob a tiny step; repeat over trillions of tokens on thousands of GPUs for months. The fit widget is this exact loop with the human as the optimizer.

**Worked example — one real gradient step, board-ready.** Data point (x=2 hours studied, y=28 marks). Start w=0, b=0, learning rate η=0.01.
1. Predict: ŷ = 0·2 + 0 = 0. Loss = (ŷ−y)² = 784.
2. Gradients: ∂L/∂w = 2(ŷ−y)·x = 2(−28)(2) = **−112**; ∂L/∂b = 2(ŷ−y) = **−56**.
3. Update: w ← 0 − 0.01·(−112) = **1.12**; b ← 0 − 0.01·(−56) = **0.56**.
4. New prediction: 1.12·2 + 0.56 = 2.8. Loss 635 (was 784) — error down ~19% from one nudge.
"Now do that a trillion knobs at a time, trillions of times. That's the whole training industry."

**Pushback.** *"Is your line-fit really the same as GPT training?"* — Same principle (differentiate error w.r.t. parameters, step downhill), radically different scale and non-linearity. Own it proudly: "two knobs vs ~a trillion, a line vs a deep network — the *idea* is identical." *"How much does a frontier run cost?"* — Public estimates: tens of millions to over a hundred million dollars; say "estimated," no lab publishes invoices.

**Landmine.** Don't drift into deriving backprop on stage — one gradient step is the ceiling for a no-math room. Keep the chain rule for a 1-on-1.

### Slide 13 · Training vs inference (cookbook rule + T/F quiz)

**Claim.** Training writes the cookbook once (months, huge cost, ends in a frozen file); inference cooks from it (your prompt flows through frozen knobs). The book doesn't change while cooking.

**Mechanism.** No frontier chat model does live/online learning: catastrophic forgetting, safety regression, cost. Versions are retrained offline and swapped. Product "memory" features (ChatGPT memory, Gemini personalization) are an ordinary database beside the model whose contents get injected into the context window — retrieval, not learning. Quiz Q3 is the privacy warning: **free-tier prompts may be used to improve future models, offline, months later, into a new file** — hence "never paste private data" in the lab.

**Pushback.** *"Couldn't a model update itself live?"* — Online learning exists in research; nobody ships it at frontier scale for the reasons above. *"So fine-tuning is what?"* — Additional offline training on narrow data producing a new frozen file — the Session 5 decision-framework topic; name it, don't unpack it.

**Landmine.** Don't say "your data is never used" — the accurate line is: knobs are frozen *during* your chat; free-tier data *may* train future versions. Check Google's current AI terms wording the day before so the sentence is exact.

### Slide 14 · Tokenizer

**Claim.** Models read tokens, not words (~¾ of an English word each); you pay per token; Tamil costs several times more than English.

**Mechanism.** Real tokenizers are learned by **Byte-Pair Encoding (BPE)** or variants: start from bytes/characters, repeatedly merge the most frequent adjacent pair, until the vocabulary (~50k–250k entries) is full. Frequent strings become single tokens; rare strings shatter. Tamil's cost is corpus skew — English dominates training text, so English gets long merged tokens while Tamil splits near grapheme-level. Byte fallback guarantees *anything* can be encoded. Why not characters? Sequences get long and attention cost grows with length. Why not words? Vocabulary explodes and unseen words break.

**Worked example — BPE by hand (5 minutes of whiteboard, unforgettable).** Corpus with counts: `low`×5, `lower`×2, `newest`×6, `widest`×3. Start with single characters, count adjacent pairs, merge the winner, repeat:
1. Pair counts: `e+s`=9, `s+t`=9, `w+e`=8, `l+o`=7, `o+w`=7 … → merge **`es`**.
2. Now `es+t`=9 (newest 6 + widest 3) → merge **`est`**.
3. Now `l+o`=7 → merge **`lo`**; then `lo+w`=7 → merge **`low`**.
Vocabulary now contains `low` and `est`. Punchline: the corpus never contained "lowest" — yet it now tokenizes as `low|est`, **two tokens, meaning-bearing pieces of a word never seen**. That's why models handle new words gracefully.

**₹ meter arithmetic (the slide's money line).** The widget prices *1 lakh sends* of your sentence at Gemini 3.5 Flash input rates: tokens × 100,000 × $1.50/1M × ₹95.5. E.g. 14 tokens → 1.4M tokens → $2.10 → **≈ ₹201**. Same meaning in Tamil at 3× tokens → ≈ ₹602. "The meter runs per token, not per word" is now money, not trivia.

**Pushback.** *"Can I see the real tokenizer?"* — Yes: the lab's `count_tokens` call is the real one; the slide widget is rule-based and labeled illustrative. *"Will the Tamil gap close?"* — Newer multilingual tokenizers (bigger vocabs, better data balance) are narrowing it; measure the real ratio yourself in Stretch 3 tonight and quote *your* number, not a stale one.

**Landmine.** The deck's tokenizer is a toy (Tamil graphemes 1–2 per chunk, English 3–4 chars). If a student notices the chunks look arbitrary — agree instantly, point at the on-slide label, route to the lab's real count. And don't quote an exact "Tamil is 4.7×" figure you haven't measured this week.

### Slide 15 · Embeddings

**Claim.** Every token becomes coordinates in meaning-space; similar meaning = nearby points; king − man + woman ≈ queen.

**Mechanism.** Two eras: **static** embeddings (word2vec/GloVe — one vector per word; where the king/queen arithmetic was demonstrated) and **contextual** embeddings (transformers: "bank" in "river bank" vs "bank loan" gets *different* vectors, because attention mixes context in). Real dimensionality: hundreds to a few thousand; the map is a 2-D cartoon. Similarity = **cosine similarity** (angle between vectors). The embedding table is itself learned parameters — same training loop.

**Worked example — cosine on 3-dim toy vectors.** Let idli = [0.9, 0.1, 0.0], dosa = [0.85, 0.15, 0.05], GPU = [0.0, 0.2, 0.95].
- cos(idli, dosa) = (0.765 + 0.015 + 0) / (0.906 × 0.865) = 0.78 / 0.783 ≈ **0.996** → neighbours.
- cos(idli, GPU) = (0 + 0.02 + 0) / (0.906 × 0.971) = 0.02 / 0.879 ≈ **0.02** → different continents.
Three dimensions is enough to *show* the machinery; real models use hundreds–thousands of axes no one names.

**Pushback.** *"Is king−man+woman exact?"* — Famously approximate, and cleanest in static embeddings; say "≈, and it made everyone realize meaning had become geometry." *"What do the dimensions mean?"* — Individually, usually nothing human-nameable; meaning lives in directions and distances, found by interpretability research after the fact.

**Landmine.** Don't imply a fixed meaning-vector per word — context-dependence is exactly why transformers beat word2vec. Lab note: the course's embedding model is **gemini-embedding-2** (the old `gemini-embedding-001` was shut down 2026-07-14; `output_dimensionality=768` supported) — that's Session 4 material, but don't name the dead model as current.

### Slide 16 · Attention

**Claim.** Every word weighs every other word to resolve meaning; "it" → trophy flips to suitcase when big→small; the T in GPT, from "Attention Is All You Need" (Vaswani et al., 2017).

**Mechanism.** Each token computes three vectors from its embedding: **query** ("what am I looking for?"), **key** ("what do I offer?"), **value** ("what I carry"). Attention weight from token A to token B = softmax over the dot products q_A·k_B; token A's new representation = the weighted mix of values. **Multi-head:** many such patterns run in parallel (one head tracking syntax, another coreference, another position), stacked across dozens of layers. Historical significance: attention replaced recurrence, so training parallelizes across the whole sequence — *that* is why 2017 enabled scale, and the honest answer to "why was 2017 the turning point?"

**Worked example.** Reuse the softmax skill from slide 7. Scores of "it"'s query against three keys: trophy 5, suitcase 2, because 0 → softmax → **94.6% / 4.7% / 0.6%** — "it" absorbs mostly trophy's value. Flip the sentence to "too small": now the context that built the query/keys changes, scores flip toward suitcase. One mechanism, no grammar rules programmed.

**Pushback.** *"Does a real model literally put 80% on trophy?"* — Interpretability work does find coreference heads with patterns like the demo, but the behavior is distributed across many heads and layers; the slide's numbers illustrate the mechanism, they aren't measurements. *"What's the cost?"* — Pairwise comparisons: naïvely O(n²) in sequence length — the reason long context is expensive (slide 25).

**Landmine.** Don't derive Q/K/V matrices on stage — that breaks the "no scary math" promise. Keep the dot-product example in your pocket for whoever asks afterwards.

### Slide 17 · The whole trick, step by step (pipeline stepper)

**Claim.** Text → tokens → embeddings → attention ×N → probabilities → sample → append; one loop per token; 500-word answer ≈ 650 loops.

**Mechanism.** One extra level for the inevitable "why is it fast then?": production inference caches the attention keys/values of already-processed tokens (**KV cache**), so each new token only computes *its own* Q/K/V and attends to the cache — the loop doesn't reprocess the whole prompt from scratch each step. The cache growing with length is why long chats get slower and pricier. (This also foreshadows context caching pricing on slide 25.)

**Worked example.** The stepper's own script: prompt "Why is Madurai famous?" → 9 answer tokens → 9 loops × 6 stages. Narrate loop 1 slowly, then Auto-run. The finale line ("9 tokens · 9 full trips through ~a trillion knobs · under a second") is your scale moment — "~a trillion" is order-of-magnitude speech, not a disclosed figure.

**Pushback.** *"Does it reconsider earlier tokens?"* — No. Committed tokens are frozen; there's no backspace. Apparent self-correction ("wait, actually…") is *forward* generation that talks about a mistake — which is exactly what reasoning models exploit on scratch paper (slide 22).

**Landmine.** The stepper's "3072-dim vector," attention numbers and top-5 lists are representative, not measured. Say "faithful cartoon" if challenged.

### Slide 18 · Hot take (ink slide)

**Claim.** "If autocomplete can pass your exam, your exam was never testing understanding."

**Mechanism.** This is rhetoric with a payload: LLMs excel precisely at pattern-completion over seen material — the exact skill most written exams reward. Read it once, slowly, then 3 seconds of silence, looking at the faculty row — and smile. Invite one counter-argument now, park the rest for the break; name the best on the closing slide.

**Pushback (be ready to *receive* it).** *"By that logic, human students who pass are also just pattern-matching?"* — "Maybe! That's the uncomfortable symmetry. The fix is the same for both: assess what pattern-matching can't fake — novel problems, oral defense, building things." *"So exams are useless?"* — No: they're mislabeled. They measure recall and fluency; both matter — they're just not the whole of understanding.

**Landmine.** Don't let it become "AI is smart / students are dumb." The target of the take is *assessment design*, not people. And don't debate for 10 minutes — one exchange, park it, move.

### Slide 19 · Scale and emergence

**Claim.** Same loop + orders of magnitude more parameters/data → abilities nobody programmed (translation, code, reasoning) appear. ChatGPT crossed 1B monthly users in June 2026 — fastest app ever; ~900M weekly back in February.

**Mechanism.** Scaling-law era finding: loss falls smoothly and predictably with parameters/data/compute; *capabilities* seem to jump at thresholds. **Emergence is contested:** a 2023 Stanford paper ("Are Emergent Abilities a Mirage?") argues the jumps are partly artifacts of all-or-nothing metrics — measure partial credit and curves smooth out. The honest classroom line, already on the slide: "abilities nobody explicitly programmed appeared — researchers still argue how sudden that really is." Also on the slide: scale isn't the whole story anymore — post-2024 labs also *train* deliberate step-by-step thinking (bridge to slide 22).

**Pushback.** *"Will scaling keep working?"* — Data and power are real constraints; labs now mix scale with better data, distillation, and test-time compute. Trend honest answer: "scaling still pays, but it's no longer the only dial." *"1B users — source?"* — June 2026 milestone, monthly users; weekly figure ~900M in Feb 2026. Keep monthly/weekly straight.

**Landmine.** The slider's parameter labels (10M → 1T+) are illustrative stages, not a claim about any specific product. Don't map "1T" to a named model.

### Slides 19–20 · Feral base model → finishing school

**Claim.** Raw pretraining yields a text-continuer, not an assistant ("What is 2+2?" → "What is 3+3? What is 4+4?…"). Three stages fix it: pretraining → instruction tuning → RLHF. ChatGPT's Nov 2022 breakthrough was better finishing school, not a smarter brain.

**Mechanism.** Stage 2 is **SFT** (supervised fine-tuning on instruction→response pairs — teaches the *format* of answering). Stage 3 classically **RLHF**: humans rank candidate answers → train a reward model → optimize the LLM against it; modern labs often use simpler preference methods like **DPO**, plus AI-assisted feedback (**RLAIF**). Refusals, tone, and safety behavior mostly come from this stage — which is why jailbreaks (Session 6) attack the finishing school, not the base intelligence. Open-weight families ship both flavors (base vs instruct) — how you could show a genuinely feral model via Ollama in Session 5.

**Pushback.** *"Who are the humans doing the ranking?"* — Paid annotation workforces following lab-written guidelines, increasingly assisted by AI feedback. Each lab's guidelines = each kitchen's taste — that's a big part of why Claude ≠ Gemini in personality. *"Does RLHF make it truthful?"* — It makes it *preferred* — helpfulness, tone, harmlessness. Preferred and true correlate imperfectly; RLHF can even reward confident-sounding wrongness. Session 2 exists because of this gap.

**Landmine.** The base-model demo outputs are staged (canned text, typed out) — it's a re-enactment of well-documented behavior, not a live base model. Say so if asked.

### Slide 22 · Reasoning models: think longer (NEW — know this cold)

**Claim.** Third dial of intelligence: spend tokens *thinking* before answering — a scratchpad you usually don't see. Buys hard math/logic/debugging; costs 10–50× tokens.

**Mechanism.** **Test-time compute:** instead of buying capability at training time (dials 1–2), spend it at inference. The model is *trained* (largely by RL on problems with checkable answers) to emit a long private chain-of-thought — try a path, spot the error, back up — then a final answer. It is still next-token prediction, aimed at itself first. Nothing new architecturally: the scratchpad is ordinary tokens in the ordinary context window; you're billed for them. The token-bill difference is the worked example below.

**Worked example — routing arithmetic in ₹.** A direct answer: ~50 output tokens. Thinking mode on the same model: ~2,000 scratchpad + 50 answer = 2,050 tokens — **41×**. At Gemini 3.5 Flash output pricing ($9.00/1M, ₹95.5/$), 1 lakh calls/day: direct = 5M tokens → $45 ≈ **₹4,298/day**; thinking = 205M tokens → $1,845 ≈ **₹1.76 lakh/day**. Same question, same model — a 40× bill for turning one flag on. Routing rule falls out: easy question → fast model; genuinely multi-step problem → thinking model. Never pay thinking prices for "capital of Tamil Nadu."

**Pushback.** *"Is the o-series/thinking mode a different architecture?"* — No public evidence of new magic: same transformer, trained to use scratch paper. More tokens, not a different trick. *"Can we read the scratchpad?"* — Some APIs expose summaries or raw traces, some hide them; either way you pay for the tokens. *"Is the scratchpad faithful — is that really its reasoning?"* — Sharp question; interpretability research says not always. It reliably *improves answers*; treating it as a true transcript of "thought" is an overclaim.

**Landmine.** Don't say "reasoning models understand, normal ones don't" — it's a budget dial, not a species change. And don't quote a fixed multiplier as gospel: say "10–50× is the planning number."

### Slide 23 · Kitchens & landscape (mid-2026 map)

**Claim.** Same recipe, different kitchens: training data, finishing school, house rules, tools. Table: OpenAI GPT-5.6 (Luna · Terra · Sol) — closed; Google Gemini 3.5 Flash/Pro — closed, ~1M-token windows, our free lab; Anthropic Claude Fable 5 · Sonnet 5 · Opus 4.8 — closed; Meta Llama — open; open-weights wave Gemma 4 / Qwen / DeepSeek.

**Mechanism.** "Open weights" = the parameter file is downloadable; you run it yourself (Ollama, Session 5 — `ollama run gemma4:e4b`; Gemma 4 is Apache 2.0, released Mar 2026; `gemma3:4b` still works; 8 GB RAM handles 3–4B quantized). Open weights ≠ open source in the strict sense (training data and code usually aren't published) — a distinction a professor may test. Release recency: Gemini 3.5 May 2026; Claude Fable 5 June 2026 (1M context); GPT-5.6 tiers July 2026.

**Pushback.** *"Which is best?"* — Wrong question; "best at what, at what price, at what latency?" Lab Part D exists so students form evidence-based taste instead of brand loyalty. *"Why would Meta give models away?"* — Ecosystem strategy: commoditize the layer your competitors sell, win the platform around it.

**Landmine.** Names churn monthly — deliver the two durable points (closed vs open weights; mechanics don't change) and don't read the table aloud. Never state parameter counts.

### Slide 24 · Famous failures

**Claim.** Strawberry-r's → tokens; big multiplication → prediction ≠ calculation; yesterday's match → knowledge cutoff; fake citation → hallucination. Not bugs — consequences, each with an engineering fix in this course.

**Mechanism.** One level deeper on hallucination: models are poorly **calibrated** — the confidence of the *tone* doesn't track the probability of *truth*, because training rewards plausible continuations and finishing school rewards pleasing answers. RAG and tools reduce, never eliminate. Strawberry status: frontier models now mostly pass (labs drilled exactly this); the mechanism (tokens, not letters) is unchanged — its cousins live: letter-counts in rare words, string reversal, arithmetic on big numbers.

**Worked example — real-world stakes, names and numbers.** *Mata v. Avianca* (S.D.N.Y. 2023): lawyers filed a brief citing **six** ChatGPT-fabricated cases → **$5,000 sanction** and a national embarrassment. *Moffatt v. Air Canada* (2024, BCCRT 149): the airline's own chatbot invented a bereavement-refund policy; tribunal held **the airline liable** for its bot's words. Two stories, one lesson: hallucination is a *product-liability* problem, not a party trick — and the reason Session 2 (evals) and Session 4 (grounding) exist.

**Pushback.** *"Why not train it to say 'I don't know'?"* — Labs try; overdo it and the model becomes uselessly evasive. Honesty-vs-helpfulness calibration is an open alignment problem. *"If someone tests strawberry live and it passes?"* — That's your win: "they patched this one; the mechanism remains — go find its cousins in lab" (Stretch 4 is literally that hunt).

**Landmine.** Don't present strawberry as a *current* failure — a student with a phone will falsify you in 10 seconds. Frame as history + living mechanism.

### Slide 25 · Context window

**Claim.** Everything — rules, history, documents, question, answer-in-progress — must fit one token-measured window; the model remembers nothing between turns; the app re-sends the whole conversation every time.

**Mechanism.** Long context is expensive because attention is pairwise and the KV cache grows with length. Advertised vs *effective* context differ: retrieval quality degrades for content buried mid-window ("lost in the middle"). Gemini-class windows are ~1M tokens; usable behavior is task-dependent. This is why RAG (Session 4) survives the giant-window era: cost, latency, freshness. Providers sell **context caching** (≈ −90% on cached input — teaching number) precisely because everyone keeps re-sending the same prefix.

**Worked example — the 40-turn chat bill.** System prompt 400 tokens; per exchange: user 30 + model 250 = 280 tokens.
- Window at send #41: 400 + 40×280 ≈ **11,600 tokens** — still tiny in a 1M window; the *bill* is the issue:
- Because each turn re-sends everything, total input billed over 40 turns = Σ(430 + 280k) ≈ **235,600 tokens** — ~20× the final window size.
- At Gemini 3.5 Flash ($1.50/1M in, $9.00/1M out, ₹95.5/$): input ≈ $0.353 ≈ **₹33.75**; output (10,000 tokens) = $0.09 ≈ **₹8.60**. One long chat ≈ **₹42.3**. A product with 1 lakh such chats/day ≈ **₹42.3 lakh/day** — and with context caching on the re-sent prefix (−90% on cached input) the input side drops to ≈ ₹3.38 per chat. Now "why do apps cache context / trim history / use RAG?" answers itself.

**Pushback.** *"With 1M-token windows, why bother with RAG?"* — You *can* stuff a textbook in; you pay for those tokens on every call, latency grows, mid-window recall wobbles, and your data changes daily. Retrieval sends only the relevant 2k tokens. The demo's own line: the wall moves; the physics doesn't.

**Landmine.** Don't call the 128k default "the" window size — it's "a typical window"; frontier is ~1M (the demo's 1M button). And "1M tokens" ≈ 700k words — don't say "1M words."

### Slide 26 · Eight words you own (recap)

**Claim.** Token, embedding, attention, prediction, sampling, tuning, parameter, inference — active recall, out loud, before each reveal.

**Mechanism.** This is retrieval practice, the single best-evidenced learning technique — the class *generating* definitions beats you repeating them. Insist on the out-loud step even if it feels slow; it's 3 minutes that doubles retention of the previous 50.

**Landmine.** Don't reveal early to save time. Cut elsewhere.

### Slide 27 · API anatomy

**Claim.** Your laptop posts a letter; a warehouse of GPUs writes back. Key = identity/quota; 429 = slow down; latency = the token loop physically running.

**Mechanism + worked example — the full HTTP round trip (whiteboard-ready).** The SDK call `client.models.generate_content(...)` is exactly this request:

```
POST /v1beta/models/gemini-flash-latest:generateContent HTTP/1.1
Host: generativelanguage.googleapis.com
x-goog-api-key: AIza…your-key…
Content-Type: application/json

{"contents":[{"role":"user","parts":[{"text":"Explain tokens like I'm 12"}]}],
 "generationConfig":{"temperature":0.4,"maxOutputTokens":200}}
```

And the response (shape exact; token numbers illustrative):

```
HTTP/1.1 200 OK
{"candidates":[{"content":{"role":"model","parts":[{"text":"Imagine LEGO bricks…"}]},
                "finishReason":"STOP"}],
 "usageMetadata":{"promptTokenCount":7,"candidatesTokenCount":142,"totalTokenCount":149}}
```

Read the anatomy aloud: model name in the **URL**; identity in a **header**; conversation as a JSON list of `role`+`parts` (multi-turn = you append to this list — the no-memory slide, now visible in the wire format); knobs in `generationConfig`; the meter in `usageMetadata`. Cost of this call at paid rates: 7×$1.50/1M + 142×$9.00/1M ≈ $0.00129 ≈ **₹0.12** — "your whole lab, at paid prices, would cost a few rupees; on free tier it costs nothing."

There's also a streaming variant (`streamGenerateContent`) that returns tokens as they're produced — the typing effect in every chat app; UX topic for Session 6.

**Pushback.** *"REST or SDK — which should we learn?"* — The SDK is a thin wrapper; knowing the wire format means you can call it from any language, or curl. *"Why 1–3 seconds?"* — One forward pass per output token; ~150 tokens ≈ 150 passes through the loaded weights. Honest latency.

**Landmine.** Never show a real key on screen (the deck uses a fake prefix); reinforce key-as-password before laptops open.

### Slide 28 · Lab kit & rhythm (+ the AI-assistant rule)

**Claim.** Handout Parts A→E with checkpoints; pairs, both run everything; stuck >5 min → neighbour then instructor; finished → stretch goals. **AI coding assistants are allowed and encouraged in every lab — one rule: your eval set judges its code too.**

**Mechanism — why the AI rule is policy, not surrender.** (1) It's how professional engineering works in 2026; banning it teaches a fiction. (2) It converts "did you write this?" into the *right* question — "does it pass your tests?" — which is precisely the evaluation mindset Session 2 builds. (3) It removes the copying shame-economy: everyone declares the tool, everyone owns the output. The enforcement mechanism is Part E's test set and the S2 eval harness: AI-generated code that fails your own eval is *your* failure to catch.

**Pushback (likely from faculty).** *"Doesn't this destroy learning/assessment?"* — "The assessment moves up a level: from writing code to specifying, verifying, and debugging it — which is where their jobs will actually be. And the checkpoints are demonstrations, not submissions: they show me running code and explain it live."

**Landmine.** Don't undercut the rule with a wink ("but real programmers don't need it"). Committed policy or nothing. Checkpoints are for you, not marks — say that sentence verbatim; it changes lab behavior.

### Slide 29 · Lab 1 brief (numbers you'll be quoted on)

**Claim.** aistudio.google.com → key (free, no credit card) → Colab → 4-line first call → 5 prompts → 3-model comparison → checkpoint.

**Mechanism.** The stack: Google AI Studio free tier; chat model **`gemini-flash-latest`** — the alias for the free tier's current Flash, which today resolves to **Gemini 3.5 Flash** (the dated `gemini-2.5-flash` id was retired for new accounts in July 2026; existing accounts still have it, so a mixed room is normal and the alias serves everyone). Typical free-tier limits ≈ **10 requests/min, 250K tokens/min, a few hundred requests/day (varies)** per key — check the live limits page. The free model in your lab today — Gemini 3.5 Flash via the alias — genuinely beats last year's flagship (accurate as of July 2026). The notebook's `ask()` helper retries on 429 with backoff — one student in a tight loop is the usual class-wide 429 culprit. Model choice is one variable (`MODEL`) — upgrading is a one-line change, by design.

**Pushback.** *"Really free? What's the catch?"* — Rate limits + the data-use policy (free-tier prompts may improve future products). That's the whole catch; don't paste private data. *"Why Gemini and not OpenAI for the lab?"* — Only frontier free tier without a credit card, and the 4-line SDK is teaching-friendly. The concepts transfer wholesale.

**Landmine.** Rate limits change without notice — re-verify the numbers at ai.google.dev the day before, and prefer "about" phrasing aloud.

### Slides 29–30 · Two things + close

**Claim.** Part E's 10-question expert test set is live ammunition for Session 2's lie-detector lab; next session starts after a short stretch; bring 2–3 real documents for Day 2 (RAG).

**Mechanism.** The test set is the connective tissue of the whole course: S2 measures hallucination against it; a good one has short, verifiable, non-googleable-in-one-hop answers on a topic the *student* is the authority on. During the lab's last 10 minutes, walk the room confirming every pair has the file — it cannot be homework because sessions run back-to-back.

**Landmine.** Don't let show-and-tell run into the break — 2–3 pairs, "which would you ship and why?", done.

---

## 3 · Demo playbooks

Honesty policy for every demo, memorize the shield: **"Everything on screen is a faithful cartoon — simplified to be visible, never simplified to be wrong."** Universal fallback: every demo is self-contained JS — leave the slide (←) and re-enter (→) to reset; F5 loses only your slide position (`#N` in the URL jumps back).

| Demo (slide) | What it actually computes | Click sequence that lands it | Say at the reveal |
|---|---|---|---|
| Classify game (4) | Scripted 8 items, right/wrong styling, running score | Class shouts each → click; gotcha = keyboard next-word | "Your keyboard has been a tiny generative model all along." |
| Rings (5) | Static nested divs + definition card | Click outside-in AI→LLM, end on app≠model card | "ChatGPT is WhatsApp; GPT is the network. Today you dial the network." |
| Next-token game (7) | Hand-authored distributions animated as bars | Shout → Reveal ×4; finale is Thiagarajar College of ___ (97%) | "You are all currently sitting inside a probability distribution." |
| Network animation (8) | **Simulated**: 21-neuron MLP, randomized activations, hard-coded output probs; NO attention | Play once in silence → Reset → Step, narrating each phase | "It never plans a sentence. It only ever picks one next token — 650 times for a 500-word answer." |
| Temperature (9) | Real math on toy probs: p^(1/T) renormalized (≡ softmax on log-probs); real sampling | T→0.05, Roll 10× (Chennai ×10) → T→2, Roll 10× until pizza appears | "Nobody is lying. It's dice — and temperature reshapes the dice." |
| Not-a-database (10) | Scripted search-miss + canned poem typed out | Search (0 results) → Ask the model | "Nothing stored, nothing looked up. It computed that. So where do the probabilities come from?" |
| Fit-the-line (11) | **Real**: live MAE over 8 points as you drag w, b | Invite a student to drive both sliders to "✓ trained" | "You just did training: guess, measure error, nudge knobs. Gemini: same loop, ~a trillion knobs." |
| T/F quiz (12) | Scripted 3 questions | Class shouts → click; linger on Q3 | "Frozen while you chat; your free-tier text may train *future* versions — hence no private data in lab." |
| Tokenizer (13) | **Toy rule-based** splitter (labeled illustrative) + real ₹ arithmetic (tokens × 1 lakh × $1.50/1M × ₹95.5) | Type a student's name → English → தமிழ் → point at ratio, then the ₹ line | "Same meaning, several times the tokens — and the meter runs per token. Measure the real ratio in lab." |
| Embedding map (14) | Hand-placed 2-D points; similarity = 1 − normalized screen distance | idli+dosa → idli+GPU → student picks a pair and predicts first | "king − man + woman ≈ queen. Meaning became geometry — Session 4 turns this into search." |
| Attention (15) | Hard-coded weights for two sentence variants, drawn as arcs | Hover "it" → ask "how did YOU know?" → toggle big→small → hover again | "Nobody programmed grammar. That's the T in GPT — the 2017 paper." |
| Stepper (16) | Scripted 9-token answer; staged per-stage payloads; percentages invented | Step through loop 1 slowly → Auto-run → let the finale land | "Every ChatGPT answer you've ever read went through exactly this loop." |
| Scale slider (18) | Scripted ability checklist by stage | Drag stop-by-stop; pause at 10B | "Translation appeared — nobody programmed it. Researchers still argue how sudden this is." |
| Base vs tuned (19) | Canned outputs, typed out (re-enactment) | Raw base on "2+2" (laugh) → After finishing school | "A brilliant parrot of the internet — not an assistant. Same loop; better finishing school." |
| Failure cards (23) | Static reveal cards | Class explains the WHY before each click | "None of these are bugs. Each is a consequence — and each has a fix you'll build." |
| Context window (24) | Real proportional arithmetic in k tokens; 128k ↔ 1M toggle | chat + notes (green) → textbook (red) → 1M (fits) → the no-memory twist, slowly | "The wall moves; the physics doesn't. And it remembers nothing — the app re-sends everything." |
| Recall cards (25) | Static flip cards | Class says each definition aloud → reveal | "Explain these eight to your roommate tonight and Session 1 worked." |
| API round trip (26) | Scripted 4-node animation | Press Send once, narrate each hop | "The model does not run on your laptop. Your laptop posts a letter; a GPU warehouse writes back." |

**If a student calls out a simplification:** agree in the first sentence, name the real mechanism in the second, route to where they can verify in the third (usually the lab's real `count_tokens`/temperature cells). Never defend the toy as real — the toys are labeled, and your credibility is the course's main asset.

---

## 4 · Q&A bank

Spoken-voice model answers. Basic → professor-grade.

1. **"Is it actually thinking?"** — It does something that *produces thinking-shaped results* through next-token prediction at scale — and whether that deserves the word "thinking" is genuinely contested by serious people. As engineers we sidestep the philosophy: we characterize what it can compute and how it fails, and build accordingly.

2. **"If it just predicts words, how does it write code that compiles?"** — Because code is text with unusually strict statistics — brackets balance, variables must be declared — and it read billions of lines of it. Prediction over a corpus that dense enforces syntax almost perfectly. Logic errors survive, though, which is why your eval set judges the assistant's code too.

3. **"Why does temperature 0 still sometimes give different answers?"** — T=0 means "always take the top token," but production serving has floating-point and batching nondeterminism, so long outputs can still diverge occasionally. Say "practically deterministic," and never confuse deterministic with correct — T=0 hallucinates identically every time.

4. **"How does ChatGPT remember my name from yesterday if models have no memory?"** — The app keeps your chats in an ordinary database and quietly injects the relevant bits into the context window on each request. Memory is a product feature bolted on *beside* the model. The model file learned nothing about you.

5. **(Professor)** **"Isn't this just an n-gram / Markov model at scale?"** — Same objective, fundamentally different machinery. N-grams count exact histories and go silent on anything unseen; a transformer computes in a continuous representation space, so it generalizes to contexts that never occurred — and attention gives it effective history of hundreds of thousands of tokens instead of n−1 words. That difference is the whole revolution.

6. **(Professor)** **"How many parameters does GPT-5.6 / Gemini 3.5 actually have?"** — Not disclosed — the last frontier model with a published count was the GPT-3 era (175B, 2020). And mixture-of-experts blurs the question: total parameters vs parameters active per token differ by a large factor. I'll say "estimated hundreds of billions to trillions" and refuse to be more precise, because anyone more precise is guessing.

7. **"Where exactly do the probabilities come from?"** — The final layer computes one score per vocabulary entry — tens of thousands of numbers — and softmax normalizes them into a distribution. On the board: three tokens, logits 4/2/0 → 86.7% / 11.7% / 1.6%. Every knob upstream exists to shape those scores.

8. **"Why does Tamil cost more tokens, and will it change?"** — Tokenizers are learned from data, and the data is English-heavy, so English gets long merged chunks while Tamil shatters toward grapheme level. It's improving as vocabularies grow and training data diversifies — and you'll measure the real ratio yourself in the lab, which beats any number I could quote.

9. **"Does Google train on what we type in the lab?"** — While you chat, no — the weights are frozen. But free-tier submissions may be used to improve future models, offline. That's the deal you accept for a free frontier model, and it's exactly why rule one is: nothing private goes in.

10. **"Can I run one of these on my laptop?"** *(→ Session 5)* — Yes — open-weight models. Gemma 4 shipped in March under Apache 2.0; `ollama run gemma4:e4b` and an 8 GB laptop handles a quantized 3–4B model. In Session 5 you'll run one locally and feel exactly what you lose and gain versus the API.

11. **"If hallucination is unfixable, why does anyone ship this?"** *(→ Sessions 2/4/6)* — You ship it the way we ship all unreliable components: measure and constrain. Two cautionary tales worth knowing by name: lawyers sanctioned $5,000 in *Mata v. Avianca* for six ChatGPT-invented case citations, and Air Canada held liable in *Moffatt* when its chatbot invented a refund policy. Session 2 builds the measurement, Session 4 the grounding, Session 6 the safety rails.

12. **"Why not let it act autonomously — book things, run my code, manage tasks?"** *(→ Session 5)* — Errors compound. A step that's 95% reliable, chained ten times, is 0.95¹⁰ ≈ 60% reliable end-to-end. That's the core math of agent design: short chains, checkpoints, human confirmation on irreversible actions. Session 5 is exactly this.

13. **(Professor)** **"What made 2017 the turning point rather than, say, LSTMs getting bigger?"** — Attention removed recurrence, so training parallelizes across the entire sequence on GPUs — recurrent nets process token-by-token and can't scale that way. "Attention Is All You Need" (Vaswani et al., 2017) is less a cleverness story than a *hardware-fit* story: the first architecture that could eat the whole internet.

14. **(Professor)** **"Is regulation coming for what you're teaching them to build?"** — Already here: the EU AI Act is in force with obligations phasing in through 2027, and NIST's AI Risk Management Framework is the de-facto US baseline. Session 6 covers the responsible-AI questions engineers actually get asked. For students: knowing this landscape is employable knowledge, not a footnote.

---

## 5 · Misconception table

| # | Students walk in believing… | The one-line correction |
|---|---|---|
| 1 | "It searches a giant database / the internet for answers" | Nothing is stored or looked up — a frozen file of learned numbers *computes* every reply token by token. |
| 2 | "It's learning from me right now" | Weights are frozen at inference; free-tier text may train *future* versions, offline, months later. |
| 3 | "It remembers our conversation" | Zero memory between turns — the app re-sends the entire history into the context window every time. |
| 4 | "ChatGPT is the model" | ChatGPT is the app; a model (GPT-5.6) sits inside — WhatsApp vs the phone network. |
| 5 | "Temperature 0 makes it correct" | T=0 makes it *repeatable*, not right — deterministic hallucination is still hallucination. |
| 6 | "Hallucination is a bug the labs will patch" | It's a direct consequence of training for *plausible*, not *true* — you engineer around it (evals, grounding), not wait it out. |
| 7 | "It reads words and letters like we do" | It reads learned token-chunks — which is why letter-counting and Tamil pricing behave strangely. |
| 8 | "Bigger/newer model is always the answer" | Capability, latency, and cost trade off — routing (flash vs thinking vs local) is the actual engineering skill. |

---

## 6 · Timing pressure map

Presenter DATA budget: **126 min total against a 120-min slot** — the deck is deliberately ~6 min over, and the ▸ compressible slides are the release valve. Press **S** for presenter mode; the pace badge tells you when to pull it.

**Where this session historically bleeds:**

| Bleed point | Symptom | Countermeasure |
|---|---|---|
| Classify game (4) | 8 items × slow debrief = 6+ min | 25 s/item discipline; cut to 5 items if behind |
| Tokenizer (13) | Tamil-equity tangent runs long | One sentence of empathy, then the ₹ line, move |
| Stepper (16) | Narrating every stage of every loop | Narrate loop 1 only, then Auto-run — hardest 3 min, rehearse twice |
| Hot take (17) | Debate catches fire | One exchange, park the rest for the break, name the best at close |
| Lab key setup | 15 min of verification-loop triage | Spare keys on paper; "blocked → personal Gmail" called out up front |
| Part E | Skipped when lab runs hot | Call it at 1:38 sharp, walk the room — it feeds Session 2 within the hour |

**Compress when behind (the ▸ slides):** 2 instructor (45 s), 4 classify (drop to 5 items), 17 hot take (read + 3 s silence, no debate), 18 scale (one drag, one line), 21 reasoning (dial metaphor + cost rule only), 22 kitchens (two points, never read the table).

**Never cut:** the new-concept interactives — rings (5), network animation (8), not-a-database (10), fit-the-line (11), cookbook quiz (12), context window (24), recall (25), API round trip (26). They exist for the students with zero ML background, and each kills a misconception the rest of the course builds on. Cut tangents, not demos.

---

## 7 · Going deeper (weekend reading)

1. **Vaswani et al., "Attention Is All You Need" (2017)** — read §3 (the architecture) only; you teach the slide honestly once you've seen the real Q/K/V equations you're cartooning.
2. **Jay Alammar, "The Illustrated Transformer"** — the best visual walkthrough in existence; steal its diagrams mentally for whiteboard improvisation.
3. **Andrej Karpathy, "Let's build GPT: from scratch" (YouTube)** — 2 hours writing a working GPT in code; permanently ends any fear of the "how does training actually work" question.
4. **Ouyang et al., "Training language models to follow instructions with human feedback" (InstructGPT, 2022)** — the finishing-school slide in primary-source form: SFT + RLHF pipeline, and why raw GPT-3 wasn't a product.
5. **Schaeffer et al., "Are Emergent Abilities of Large Language Models a Mirage?" (2023)** — the strongest pushback on the emergence story; inoculates you for the sharpest professor question on slide 19.
6. **Liu et al., "Lost in the Middle: How Language Models Use Long Contexts" (2023)** — why huge windows ≠ solved retrieval; your ammunition for "why RAG?" here and in Session 4.

---

## 8 · Facts locker (verify these are what you say aloud)

All figures as of **July 2026** — the day before, re-check the free-tier numbers at ai.google.dev.

- Lab stack: **Google AI Studio free tier, no credit card**. Chat: **`gemini-flash-latest`** — the alias, today resolving to **Gemini 3.5 Flash**. The dated **`gemini-2.5-flash` retired for new accounts July 2026** (404 "no longer available to new users"); existing accounts still have it, so rooms will be mixed — the alias serves both, and you pin a dated id only if you need frozen behavior. Typical free-tier limits ≈ 10 RPM / 250K TPM / a few hundred requests/day (varies) — check the live limits page. Embeddings (S4): **gemini-embedding-2** (`gemini-embedding-001` shut down 2026-07-14; `output_dimensionality=768`).
- Prices per 1M tokens (basis of every ₹ figure in this pack): Gemini 3.5 Flash **$1.50 in / $9.00 out** (the retired 2.5 Flash was $0.30 / $2.50 — input ×5, output ×3.6); context caching ≈ **−90%** on cached input (teaching number). **₹95.5 / USD**.
- Frontier map: OpenAI **GPT-5.6** (Luna/Terra/Sol, July 2026); Google **Gemini 3.5 Flash/Pro** (May 2026, ~1M context); Anthropic **Claude Fable 5** (June 2026, 1M context), **Sonnet 5**, **Opus 4.8**. **Parameter counts are not public — never state exact counts.**
- Local (S5): **Gemma 4** (Apache 2.0, Mar 2026), `ollama run gemma4:e4b`; `gemma3:4b` still works; 8 GB RAM ≈ 3–4B quantized.
- Scale stat: ChatGPT crossed **1B monthly users June 2026** (fastest app ever to 1B); **~900M weekly, Feb 2026**.
- Failures with stakes: **Mata v. Avianca** (S.D.N.Y. 2023 — six fabricated cases, $5,000 sanction); **Moffatt v. Air Canada** (2024 BCCRT 149 — airline liable for its chatbot's invented policy).
- Security (S6): OWASP Top 10 for LLM Apps 2025 — **prompt injection is LLM01**, two editions running; no complete fix, defense-in-depth only.
- Governance: **EU AI Act** in force, obligations phasing through 2027; **NIST AI RMF** is the US framework.
- History: **"Attention Is All You Need," Vaswani et al., 2017**; **ChatGPT launch Nov 2022**; agents math: **0.95¹⁰ ≈ 0.599**.

---

## 9 · Rehearsal protocol (~2 hours, ideally two evenings before)

1. **Spine run (10 min):** the 3-minute no-slides story, recorded, listened back. Twice.
2. **Worked-example drill (25 min):** reproduce on paper, from memory: the softmax table, one gradient step, the BPE merges, the 40-turn arithmetic, the HTTP round trip. These five are your whiteboard arsenal — they're what makes you "deep" in the room.
3. **Full dry run (55 min):** deck + every demo, out loud, timed, target ≤ 50 min for slides 1–27. Overruns are almost always the stepper and tangents. Cut tangents, not demos.
4. **Q&A drill (15 min):** read section 4 questions aloud, answer from memory, check against the text. Do the nnviz "where's the attention?" answer twice — it's the one that must be word-perfect.
5. **Logistics sweep (night before):** deck opens offline ✓ · your key runs the actual notebook top-to-bottom ✓ · real short link replaces `tinyurl.com/tce-genai` in the deck and materials live behind it ✓ · 5 spare keys on paper ✓ · handouts printed/linked ✓ · hotspot charged ✓ · one demo tested on the real projector ✓ · water, and a hard stop for sleep — Day 1 is six hours of you.

---

## The page students may arrive having already read

`how-llms-work.html` &mdash; **"Where does the answer live?"** &mdash; is the first call to action on the course home page, above the link to this session. Assume some of the room has been through it. It takes about ten minutes.

**What it is.** A ten-step hunt for one fact. It types *"Elon Musk wants to colonize ___"*, gets *Mars*, and then goes looking for where that fact is physically kept in the file. The answer it lands on: a direction that gets added to a running total whenever one neuron out of 49,152 decides the question it is asking has been answered yes.

**What it covers, that this session does not.** These are deliberately non-overlapping &mdash; the page is *architecture* (what a model contains), Session 1 is *behaviour* (what it does). None of the following appear anywhere in your deck:

| The page teaches | Your nearest slide |
|---|---|
| the file sorted into four kinds of table &mdash; **the dictionary, the lookup, the memory, the vote** | "What's inside a model? Just knobs." (you say knobs; it names the drawers) |
| the **residual stream** &mdash; each token's vector rides a track, every block *adds*, nothing is replaced | not covered; your stepper shows the loop, not the track |
| **superposition** &mdash; why 12,288 numbers hold millions of ideas | not covered |
| attention as **Q / K / V** &mdash; "what I want / what I have / what I'd add" | "Attention: every word looks at every other word" (you show the arrows, not the three tables) |
| the **MLP as key-value memory** &mdash; where facts are actually stored | not covered |
| the **parameter budget** &mdash; two-thirds of the file is memory, not attention | not covered |

**How to use it.** Three options, in order of how much class time you have:
1. **Send it ahead** as the one optional pre-read. It costs you nothing and buys you a room that already believes "it is a file, not a database" before you open your mouth.
2. **Open with it, 3 minutes, on the projector.** Run steps 1&ndash;2 only, land "so where is that fact?", then say *"we are going to answer a different question today &mdash; not where the fact lives, but why the machine gets it right and then confidently gets the next one wrong."* That is a clean hand-off into your Session 1 spine.
3. **Point at it on the way out**, alongside the playground, for students who want to go further. It is also the natural companion to Learning Guide **Part 9**, which is the same walk in prose.

**Questions it will send you, with answers.**

*"You said a model is knobs. The page says it's four tables. Which is it?"* &mdash; Both, at different zoom. Every table is made of knobs; the tables are how the knobs are grouped by job. Good moment to say that "parameters" is a count, "architecture" is an arrangement, and only the second one tells you anything.

*"If the fact is in the MLP, why do we need attention at all?"* &mdash; Because the memory can only answer a question about whatever the arrow currently means. Attention is what makes the arrow mean "Elon Musk, and going somewhere" in the first place. Decide, then recall. Pull it back to your own material: this is the same split as retrieval and generation in Session 4.

*"Two-thirds of the model is just stored facts?"* &mdash; Roughly, at GPT-3's shape. It is the honest reason "how many parameters" was never a measure of cleverness &mdash; mostly it measures how many facts fit. Careful not to overclaim: mixture-of-experts models leave most of that dormant per token (Learning Guide &sect;8.5).

*"Does that mean it can't reason, only look things up?"* &mdash; No, and do not let this one run. Say: the stored directions are the ingredients; the ninety-six rounds of combining them are where anything resembling reasoning happens. Then park it &mdash; it is a genuinely open research question and not a hill to die on in front of a class.

**One thing to be careful about.** The page uses "arrow" where you say "coordinates", and "the lookup / the memory" where you say "attention / the feed-forward part". If a student uses the page's vocabulary, take it &mdash; do not correct it into yours. Both are honest; switching names mid-session is how you lose people.

---

## The depth layer — 6 `<|deeper|>` panels in this deck

Collapsed by default, so they cost the clock nothing. Press **D** on a slide to open every panel on it (or click the panel's mono label). Each is also flagged in the presenter notes as `[D] deeper:`.

Open one when a student asks the question the slide provokes, or when you are running ahead. Never open one because it is there — the main line is the promise; this is the ceiling.

| Deck slide | Slide | Panel |
|---|---|---|
| `#10` | Why the same question gives different answers | where the dice actually come from |
| `#12` | What's inside a model? Just knobs. | how anyone knows the training is working |
| `#16` | Attention: every word looks at every other word | two things this picture is hiding |
| `#19` | The loop is old. The scale is new. | scale is not one slider — it is three |
| `#23` | Why ChatGPT ≠ Gemini ≠ Claude | why every lab ships a cheap fast one and an expensive slow one |
| `#25` | The context window: its entire working memory | then why isn't re-sending everything unbearably slow? |

Prose versions of all of these, with the same section order, are in `LEARNING-GUIDE.md` **Part 8**. If you read one thing before delivery day, read the Part 8 sections matching this deck — they are written so you can improvise a whiteboard answer, not just recite the panel.
