# Session 1 — Instructor Prep Pack

### How Machines Learned to Talk · 29 slides · 2 hours (115.5 min budgeted, ≈4 min reserve)

**What this file is.** The level under every slide, so you are never caught one question deep in front of a room of final-year CSE students and their faculty. Read it once end to end (about 40 minutes), then re-skim the slide table the night before. The run sheet (`session-1-notes.md`) is the delivery-day document; this one is for the days before.

**Slide numbers here are the deck's own numbers** — generated from `presentations/session-1-how-machines-learned-to-talk.html`, so slide 14 below is slide 14 on screen. Press **S** in the deck for presenter mode; the timings in this file are the deck's own budgets.

---

## 1 · The spine — the session as one argument

Seven beats. If you lose the thread mid-session, come back to this list and pick up the next one.

1. **There are two kinds of AI, and this course is about the second** (slides 4–5) — judges label what exists, creators make new content.
2. **Creation is next-token prediction, repeated** (6–9) — one idea, said once, then demonstrated three different ways until nobody in the room can un-see it.
3. **The odds come from learned weights, not a lookup** (10–13) — this is the myth-killing block, and it is where the room's model of "AI" actually changes.
4. **The machinery of one pass** (14–15) — tokens, then the whole loop in one stepper. Embeddings and attention are no longer slides of their own: the pre-class page teaches both with a real model, and slide 15 carries a two-paragraph depth panel for a room that has not read it.
5. **Three dials of intelligence** (17–20) — scale, finishing school, thinking time.
6. **The consequences are predictable** (22–23) — every famous failure falls out of beats 2–4.
7. **You can drive it today** (25–27) — API anatomy, then the lab.

**Readiness test.** Tell this story out loud, no slides, in three minutes. Record it on your phone and listen back. If beat 3 lands flat, the whole session sags — that is the beat that changes minds, and it is the one most often rushed.

---

## 2 · Slide by slide

Each entry: **on screen** (what they see) · **the move** (how to deliver it) · **one level under** (so you can improvise) · **hardest question** · **landmine** (what not to say).

### Slides 1–3 · Opening, credibility, the promise · 3.5 min total

**On screen.** Title; "I sat in these seats — TCE CSE, class of 2009"; the six artifacts they will build.

**The move.** Open with energy: *"By the end of today, everyone here writes code that talks to a frontier AI model — for free."* Keep the bio under 45 seconds — one line of credibility, one line of humility. The failed-things line gets a laugh; let it land, then move. Walk the six artifacts fast and plant the capstone seed: *"Session 6 you demo — start thinking about what you'd build."*

**One level under.** The bio exists to buy you permission to be believed, not to impress. The six-artifact slide exists so that a student who is bored in slide 12 can see a reason to still be there at slide 27.

**Hardest question.** *"Will this get me a job?"* — Do not promise. Say: this course gets you something to show and the vocabulary to defend it, which is what an interview actually tests. Point at `PLACEMENT-ROADMAP.md`.

**Landmine.** Do not oversell yourself and do not stack credentials — the faculty in the room calibrate you on this slide, and the work sells you better than the bio does.

### Slide 4 · Two kinds of AI: judges vs creators · 3 min · `trim`

**On screen.** A classify game — the room shouts *judges* or *creates* before each reveal.

**The move.** Run it as a game, about 25 seconds per item. The gotcha is keyboard autocomplete — it is generative, and most rooms call it a judge.

**One level under.** Discriminative models learn P(label | input); generative models learn P(next | all previous). That is a boundary in feature space versus a distribution you can sample from. Same maths family, different training target, genuinely different capability.

**Hardest question.** *"Google Maps predicts arrival time — isn't that prediction generation?"* — It predicts a property of existing reality; it cannot produce a novel artifact. The line is *"labels or quantifies what exists"* versus *"constructs something new."*

**Landmine.** Do not let discriminative AI sound obsolete. It still runs fraud detection, ranking and face unlock. It ran the world from 2012 to 2022 and it has not retired.

### Slide 5 · AI, ML, GenAI, LLM — who lives inside whom · 2.5 min

**On screen.** Nested rings, clicked outside-in.

**The move.** Land one line: **app ≠ model.** ChatGPT is WhatsApp; GPT is the network.

**One level under.** A model artifact is literally tensors of floating-point weights plus an architecture config. "Deep" means many stacked layers. Not every LLM is generative in the loose sense, but every modern frontier LLM is.

**Hardest question.** *"Is Gemini one model?"* — No: a family, Flash and Pro, plus versions. Mechanics identical, size and cost different.

**Landmine.** Never state parameter counts for GPT-5.6, Gemini 3.5 or Claude — not public. Say "estimated hundreds of billions to trillions" and move; the labs do not disclose, and mixture-of-experts makes the count ambiguous anyway.

### Slide 6 · ChatGPT is autocomplete at scale · 1.5 min

**On screen.** The one-sentence thesis of the whole course.

**The move.** This is **the** slide. Say it slowly: one job — predict the next token, append, repeat. Pre-empt *"but it reasons!"* by promising you will come back to it at scale (slide 17).

**One level under.** Every LLM does exactly one thing: given text, produce a distribution over the next token. Everything else — chat, code, agents — is that loop plus scaffolding.

**Hardest question.** *"So it's just a fancy T9?"* — Same objective, incomparable machinery, and the difference is what slides 14–15 (and the pre-class page) are for. Do not concede more than that here.

**Landmine.** Do not say "just" autocomplete in a dismissive tone. You are making an architectural claim, not a capability ceiling — and slide 16 picks that fight deliberately later.

### Slides 7–9 · Play the model; count the words; watch the network · 9 min

**On screen.** A guess-the-next-word game; the bigram tally table; the animated 21-neuron network.

**The move.** Slide 7 is a game — the room shouts before the reveal. The *idli + ___* example is chosen because the room disagrees, which is the distribution made audible. The finale, *Thiagarajar College of ___* at 97%, puts them inside a distribution they can feel. Slide 8 is the demystifier: click **Build the table** and narrate that training is tallying which word follows which, then **Sample** and let the room shout a word while you roll; **Take the top** contrasts greedy with sampling. Slide 9 is the money slide — play it once in silence, then reset and step through, narrating tokens → numbers → layers mix → distribution → dice → **append**.

**One level under.** Slide 8 is a genuine bigram Markov model — an n-gram with n = 2. It is the honest ancestor of an LLM and it fails for a specific reason worth naming: a bigram conditions on one token, so it cannot hold a subject across a clause. Real LLMs learn a compressed *function* over the whole context instead of storing a table. Historical anchor: Markov, 1906 → n-gram phrase models → transformers, 2017.

**Hardest question.** *"So an LLM is just a big lookup table?"* — No. That table would be astronomically large and could only ever replay what it has seen; the tally has a function that generalises to sequences it has never seen. Same interface, radically different engine.

**Landmine.** Do not oversell the toy — it knows adjacency, not meaning. Say so, because that gap is exactly the bridge from "you guessed the next word" (7) to "a network computes the guess" (9).

### Slide 10 · Why the same question gives different answers · 3 min · `[D]`

**On screen.** A temperature slider with a roll tally.

**The move.** T → 0.05, roll ten times (Chennai ten times). T → 2, roll until *pizza* appears in the tally. Rule: facts low, creative high.

**One level under.** The last layer emits a raw score per vocabulary token — a **logit** — not a probability. Softmax turns logits into a distribution; temperature divides the logits *before* softmax, so low T sharpens and high T flattens. T = 0 is argmax.

**Depth panel `[D]`.** *Where the dice actually come from* — logits → softmax → temperature, plus top-k / top-p. Open it the moment a student asks where the probability comes from.

**Hardest question.** *"Why not always use T = 0?"* — For factual extraction, do. For anything where you want variety, T = 0 makes the model repetitive and prone to loops.

**Landmine.** Do not call temperature "creativity". It is a sampling parameter; the model is not more imaginative at T = 2, only less discriminating.

### Slide 11 · Wait — is it just searching a giant database? · 2.5 min

**On screen.** A search box returning zero results, then the model producing a pirate poem about jigarthanda.

**The move.** This kills myth number one. *"Nothing was stored. It computed that."*

**One level under.** The weights are frozen at inference. There is no retrieval step, no index, no row. The poem is a path through a learned function, and it is the first time the room feels the difference.

**Hardest question.** *"Then how does it know facts?"* — Facts are compressed into the weights during training, lossily. That is also the reason it can be confidently wrong, which you will cash in on slide 22.

**Landmine.** Do not say "it doesn't store anything" without qualification — it stores a great deal, just not as retrievable text. The precise claim is: no lookup at inference time.

### Slides 12–13 · Just knobs; training vs using · 5.5 min

**On screen.** A fit-the-line widget with two sliders; then the cookbook rule and a true/false quiz.

**The move.** Invite a student to drag both sliders to *trained*. Narrate: w and b are **parameters**; a model is a file of knob values. Then the cookbook analogy — you write the recipe once, and cooking from it does not change the book.

**One level under.** Training adjusts parameters by gradient descent against a loss; inference runs the frozen function. The quiz item about the free tier training future models is the privacy warning, and it is the one students repeat to their friends afterwards.

**Depth panel `[D]` (slide 12).** *How anyone knows training is working* — cross-entropy loss and perplexity, the one number a lab watches for months.

**Hardest question.** *"If it's frozen, how did ChatGPT learn my name from earlier in the chat?"* — It did not learn. The app re-sends the conversation every turn. This is the seed for slide 23.

**Landmine.** Do not imply weights update while chatting. That misconception, left alive, breaks Session 4 entirely.

### Slide 14 · Models don't read words. They read tokens. · 2.5 min

**On screen.** Tokenizer with a ₹ meter.

**The move.** Type a student's name, then **தமிழ்** — the ratio jump is the moment, and the ₹ meter turns it into money: same meaning, bigger bill. Do not promise a number for the real gap: say *"the real gap depends on the tokenizer — you'll measure Gemini's with `count_tokens` in the lab."* Gemini is comparatively efficient on Tamil, so the lab may show a narrower ratio than the toy.

**One level under.** Tokens are sub-word pieces from a learned BPE vocabulary; Indic scripts fragment harder because the vocabulary was fitted mostly to English, which is why the bill moves.

**Hardest question.** *"Why doesn't it just use whole words?"* — Vocabulary explosion and no way to handle a word never seen. Sub-words trade sequence length for coverage.

**Landmine.** The on-slide tokenizer is a rule-based toy. Say so plainly — the lab shows real `count_tokens`. "A faithful cartoon: simplified to be visible, never simplified to be wrong."

### Slide 15 · You saw this machine on the pre-class page — here it is in one loop · 3 min · `[D]`

**On screen.** The pipeline stepper: text → tokens → embeddings → attention → probabilities → sample, driven by hand or auto-run.

**The move.** Open with *"who did the pre-class page?"* — hands up calibrates how fast you go. Then the hardest three minutes of the session: step slowly, narrate each stage (tokens → coordinates → attention → scores → dice → **append**), then auto-run and let the stat flash land: a 500-word answer is roughly 650 loops. The two middle stages are the ones the page taught with a real model. Do not re-teach them here; name them and move.

**One level under.** Embeddings are rows of a learned table — direction carries meaning, not position; idli sits next to dosa, and *king − man + woman ≈ queen* because meaning is now geometry. Attention computes, for every token, a weighted blend of every other token, and the weights are learned — it is what resolves *"it"* in *"the trophy didn't fit in the suitcase because it was too big"*, and it is the T in GPT. Attention is order-blind, so position is added into each embedding first (positional encoding, today usually RoPE); and it costs n², which is why Session 4 retrieves three paragraphs instead of pasting the textbook.

**Depth panel `[D]`.** *Embeddings and attention, in two paragraphs* — exactly the paragraph above, on screen, plus a pointer to the page's chapters and to Session 4. Open it if a room that skipped the page asks *"wait, what is attention?"* — budget two extra minutes if you do, and take them from slides 21–22.

**Hardest question.** *"Why does it need attention if the embeddings already carry meaning?"* — A word's embedding is fixed; its meaning in a sentence is not. Attention is how *bank* becomes river-bank or money-bank from context.

**Landmine.** The stepper's attention weights and coordinates are illustrative numbers. Say so. The real ones are on the pre-class page and, for embeddings, in Session 4's lab with real cosine scores.

### Slide 16 · If autocomplete can pass your exam… · 1.5 min · `trim`

**On screen.** The ink slide. The fight, picked deliberately.

**The move.** Read it once, slowly, then be quiet for three seconds. Say it looking at the faculty row, and smile. Invite disagreement and take exactly one counter-argument now; park the rest for the close.

**One level under.** The claim is about assessment design, not about student ability. Keep it there and the room stays with you; let it drift into "exams are worthless" and you lose the faculty.

**Landmine.** Do not win this argument. You are opening it on purpose; slide 29 is where you name the best counter-argument the room gave you.

### Slides 17–20 · Scale, base models, finishing school, reasoning · 8.5 min

**On screen.** A 10M → 1T parameter slider; raw base model versus after finishing school; the three-step diagram; the reasoning dial.

**The move.** Drag the slider and pause at 10B: *"translation appeared — nobody programmed it."* Then click **Raw base** on "2+2" for the laugh, and **After finishing school** for the contrast. Three finishing steps, one line each, landing on: ChatGPT's 2022 win was better finishing school, not a smarter brain. On slide 20, use the dial metaphor — scale, finishing school, thinking time — and land the cost rule: never pay thinking prices for capital-city questions.

**One level under.** Emergence is real but contested; researchers disagree about how sudden it is, and some apparent jumps are artifacts of the metric. Say "researchers argue about how sharp this is" and you are both honest and safe. Reasoning models are not different magic — they are trained to spend more tokens before answering.

**Depth panel `[D]` (slide 17).** *Scale is not one slider — it is three*: parameters, data and compute have to move together. This is the Chinchilla correction.

**Hardest question.** *"Is the o-series a different architecture?"* — No. More tokens spent thinking, trained to do it well. Same loop.

**Landmine.** Do not present emergence as magic or as settled. Both readings are wrong and one of them will be challenged.

### Slide 21 · Why ChatGPT ≠ Gemini ≠ Claude · 1.5 min · `trim` · `[D]`

**On screen.** The kitchens-and-landscape map, labelled "names as of mid-2026 — they change monthly".

**The move.** Use the biryani line. Two points only — closed versus open weights, and *names change, mechanics don't*. Do not read the table aloud.

**Depth panel `[D]`.** *Why every lab ships a cheap fast one and an expensive slow one* — mixture-of-experts, distillation, quantization. Flash, Haiku and mini are the same idea three times.

**Landmine.** This slide ages fastest in the whole deck. Check `instructor-notes/fact-check.md` before you teach; the volatile rows were last live-verified 2026-08-03.

### Slides 22–24 · Famous failures; the context window; eight words · 6.5 min

**On screen.** Reveal cards for four failures; a window filling green then overflowing red; the eight-word recall list.

**The move.** On slide 22 the class explains *why* before each click — strawberry is tokens, arithmetic is prediction, stale news is the cutoff, the fake citation is plausibility. On 23, fill the window with chat and notes, then drop a textbook in and watch it go red; switch to 1M and the textbook fits — *"the wall moves; the physics doesn't."* Then the twist: no memory, the app re-sends everything, which is what motivates RAG. Slide 24 is active recall — the room says each definition aloud **before** you click.

**One level under.** All four failures fall out of beats 2–4, which is why this slide works: they are not four bugs, they are one mechanism seen four times.

**Depth panel `[D]` (slide 23).** *Then why isn't re-sending everything unbearably slow?* — the KV cache, prefill versus decode. This is the single most useful piece of plumbing an engineer can know, and it pays off again in Session 6.

**Hardest question.** *"Why can't it count letters if it can write essays?"* — It never sees letters. It sees token ids. `strawberry` may be three tokens, and nothing in the input distinguishes the r's.

**Landmine.** Do not say hallucination is a bug being fixed. It is the same machinery that produces the right answers — Session 2 is built on that.

### Slides 25–26 · API anatomy; the lab kit · 4.5 min

**On screen.** A dot travelling code → key → GPUs → response; then the A→E lab strip.

**The move.** Press **Send** and narrate the journey. Land: *"the model does not run on your laptop."* Then show the lab kit once — it applies to all six labs. Point at **intrepidkarthi.com/genai** and make everyone bookmark it now, phones out. State the pairs rule once: *both partners have a key, one drives per part, swap at each checkpoint* — it settles every "who types?" argument for the weekend. Read the Lab 3 line aloud: put a receipt and a page of your own handwriting in Drive now. Say plainly that checkpoints are for them, not for marks.

**Landmine.** Do not skip the "not on your laptop" line. It pre-empts an hour of setup anxiety in the lab.

### Slide 27 · Lab 1: your first AI API call · 50 min

**On screen.** The five steps and `aistudio.google.com`.

**The move.** Two-minute brief, then fifty minutes of lab. Five steps on the board. Pairs — both have a key, one drives per part, swap at each checkpoint; five-minute rule before asking a neighbour. Circulate; do a checkpoint sweep at +40. The links are on screen — point at them rather than reading them.

**Lab shape** (`labs/session-1/lab-handout.md`): A confirm access and get a key (10) · B first call (10) · C the five prompts (10) · D one prompt, three models (10) · E build your test set (10) = 50. Part E is not optional — Session 2 consumes it.

**Landmine.** Do not let Part E get squeezed. If you are behind, cut Part D, never Part E.

### Slides 28–29 · Three things; the close · 7 min · `trim`

**On screen.** No homework — the hand-off to Session 2.

**The move.** Slide 28 is budgeted five minutes and show and tell comes first: two or three pairs' model differences from Part D, about three minutes. Then the three cards — confirm every pair actually wrote the ten-question test set in Part E, tease the lie-detector lab, hand off. Slide 29 is a two-minute close: name the strongest counter-argument the room made to slide 16 — out loud, with credit — remind them to bring their own documents for Day 2 and the two photos for Lab 3, and close: *"You've learned the trick; next you drive it."* There is no homework; Session 2 starts after a short stretch.

---

## 3 · The depth layer in this deck

Six `<|deeper|>` panels, collapsed by default so they cost the clock nothing. Press **D** on a slide to open every panel on it.

| Slide | Panel | Open it when |
|---|---|---|
| 10 | Where the dice actually come from — logits, softmax, temperature, top-k/top-p | someone asks where the probability comes from |
| 12 | How anyone knows training is working — cross-entropy loss and perplexity | someone asks how a lab measures progress |
| 15 | Embeddings and attention, in two paragraphs — meaning as coordinates, what "it" points to, positional encoding, n² | the room skipped the pre-class page and someone asks what attention is |
| 17 | Scale is three sliders, not one — the Chinchilla correction | someone asks why not just add parameters |
| 21 | Why every lab ships a cheap one and an expensive one — MoE, distillation, quantization | someone asks what Flash actually is |
| 23 | Why re-sending everything isn't slow — the KV cache, prefill vs decode | someone asks about latency or cost |

Open one because a student earned it, never because it is there. The main line is the promise; this is the ceiling.

---

## 4 · Q&A bank — the ones that actually get asked

**"Is it conscious / does it understand?"** — Not a question this course can settle, and say so. What you can say: it has no persistent state between calls, no goals, and no model of itself. Then redirect to something testable.

**"Will AI take my job?"** — The honest answer is that it changes what juniors are hired for. The person who can specify, test and debug an AI system is more employable, not less. That is the whole design of this course.

**"Which model should I use?"** — For this course, the one pinned in the notebooks. In general: start cheap and fast, escalate only when an eval says you must. That ordering is Session 2's material.

**"Can I run this offline?"** — Yes, with open-weights models via Ollama, and you will see it in Session 5. Quality per unit of hardware is the trade.

**"Is the free tier really free?"** — Yes for this course's volume, with rate limits. No card required on the designed path. Availability and quotas change — check the live account.

**"Why Python?"** — Because the SDKs and the ecosystem are there. The ideas are language-independent.

---

## 5 · Misconceptions, and the sentence that kills each

| They believe | Say this |
|---|---|
| It searches the internet | Nothing is looked up. The weights are frozen; the answer is computed (slide 11) |
| It learns from our chat | The weights never change while you use it. The app re-sends the history (13, 23) |
| It understands like a person | It predicts tokens. Whether that adds up to understanding is not a question we settle today |
| Hallucination is a bug | It is the same machinery as the correct answers. Session 2 is about measuring it |
| Bigger is always better | Three dials, not one — and cost is a real constraint (17, 20) |
| The tokenizer on screen is real | It is a labelled toy. The lab shows real token counts |

---

## 6 · Timing pressure map

Slide budgets total **115.5 minutes** in a 120-minute block: hook + talk (slides 1–26) **58.5 min**, lab (slide 27) **50 min**, wrap (slides 28–29) **7 min** including show and tell. That leaves about four minutes of reserve — enough to absorb one good question, not a late start. The talk was cut from 68 to 58.5 minutes by removing the standalone embeddings and attention slides (the pre-class page teaches both with a real model; slide 15's depth panel is the fallback) and trimming half a minute each from slides 8, 12, 14, 22, 23 and 24. Where to take further time from, in order:

1. **Slide 22** famous failures — four cards can become two.
2. **Slide 5** terminology rings — can be 90 seconds.
3. **Slide 21** kitchens — do not read the table; 60 seconds is enough.
4. **Slide 24** eight words — say four, click four.
5. **Lab Part D** one prompt three models — the first thing to cut inside the lab hour.

Never compress: slides 8–9 (the demystifier and the network), slide 15 (the stepper), lab Part E (the test set Session 2 needs), or the show and tell on slide 28.

The deck flags slides 2, 4, 8, 16, 17, 20, 21, 28 and 29 **compressible** — press **S** and you will see `▸ compressible` on them. That is the deck's own suggestion; the ordered list above is the considered one. Checkpoints on the clock: slide 16 (the hot take) should start by **0:36**; slide 25 (API anatomy) by **0:54**; laptops open by **0:58**. If you are past slide 16 at more than 40 minutes, cut from that list rather than rushing the stepper. If the lab starts late, compress it to Parts A–C and run D as the opening of Session 2 — never drop Part E.

---

## 7 · The page students may arrive having already read

`how-llms-work.html` — *"We taught a machine to write Thirukkural"* — is a complete, interactive walk through how a language model works, on one worked example: a small GPT trained from scratch on the 1,330 couplets of Thirukkural (and, for comparison, on Shakespeare's sonnets), running live in the browser with its real weights. Twelve chapters, about thirty-five minutes: next-character prediction, the training data, tokenization and BPE, embeddings, attention, the transformer block and where the parameters live, logits → softmax → sampling with temperature, the pretraining loop with the recorded loss curve and samples at each step, supervised fine-tuning, RLHF (a preference game, a stand-in reward, and a measured reinforcement loop), the whole machine end to end, and the ~120 lines of PyTorch to build one for any text. It overlaps Session 1 on purpose: the page is the full pipeline on one example, the session is behaviour-first with a hosted model. A room that has read it arrives with the vocabulary; use it. The prose companion is `LEARNING-GUIDE.md` **Part 9**.

**What overlaps your deck.** Tokens (slide 14), the sampling stepper (15), temperature (10) and base-vs-finished (18) all appear on the page with the *kural* model and real numbers. Embeddings and attention are taught **only** on the page now (plus Session 4 for embeddings): the deck has no standalone slides for them, just the two-paragraph depth panel on slide 15. Ask the room *"who has seen the attention map on the page?"* at slide 15 to calibrate — a room that has not read it gets the panel opened, and you pay for it from slides 21–22.

**Vocabulary.** The page and the deck use the same words: token, embedding, attention, logits, softmax, temperature, pretraining, fine-tuning, RLHF. If a student says "the reward rule" they mean the page's stand-in reward model; the real thing is a second network trained on human preferences, which the page also says.

**The question it will send you.** *"If the kural model produces nonsense with 164k parameters, at what size does meaning appear?"* Honest answer: there is no threshold; coherence grows smoothly with data and parameters, and *facts* appear when the training text contains them. The page's chapter 11 table is the reference.

Its prose companion is Learning Guide **Part 9**.

---

## 8 · Rehearsal protocol — about two hours, ideally two evenings before

**Evening one (45 min).** Read this file end to end. Then tell the seven-beat spine out loud with no slides, recorded. Listen back for beat 3.

**Evening two (60 min).** Drive every interactive element yourself, in order: the classify game (4), the next-word game (7), build-the-table and sample (8), the network animation (9), the temperature slider (10), the fit-the-line widget (12), the tokenizer with a Tamil word (14), the stepper on both step and auto-run (15), the scale slider (17), base versus finished (18), the failure cards (22), the context window fill and overflow (23), and the API send animation (25). Open all six depth panels once so nothing surprises you — including the new one on slide 15, which you may need to read aloud.

**The morning of (15 min).** Technical smoke test — run the first cell of `labs/session-1/session_1_lab.ipynb` on a real key; confirm the model id in the notebook still resolves; check the deck opens offline; confirm the projector renders the deck's dot-grid without banding.

**Delivery standard.** Nothing on screen is defended as real when it is illustrative. The one-line shield, if challenged: *"Everything on screen is a faithful cartoon — simplified to be visible, never simplified to be wrong."*
