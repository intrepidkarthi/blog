# Session 2 — Instructor Prep Pack
### the deep version

Work through this over a weekend (~3 hours). The run sheet (`session-2-notes.md`) is delivery-day only. Deck: `../presentations/session-2-talking-to-ai-and-catching-its-lies.html` — 21 slides, 9 interactives, all offline/canned (the lab is where students touch the real API). Lab stack: Google AI Studio free tier, `gemini-flash-latest` (the alias for the free tier's current Flash — today Gemini 3.5 Flash; typical free-tier limits ~10 RPM / 250K TPM / a few hundred req/day (varies) — check the live limits page).

---

## A. Narrative spine — the session as one argument

Seven beats. If you can say these out loud in under 3 minutes without looking, you own the session; if you stumble on a beat, re-read that deep-dive below.

1. **You can call the model (S1), but your asks are wishes.** "write about tce" produces 400 generic words because the model completes the *most plausible* document that starts that way — and vague prompts have vague plausible continuations.
2. **Structure turns wishes into instructions.** Six switches: role, task, context, format, examples, constraints. Task is mandatory; the rest are dials. Each switch narrows the space of plausible continuations.
3. **The two power tools are few-shot and step-by-step.** Examples beat descriptions because the model is a pattern-completion engine; visible steps beat direct answers because errors surface in tokens you can audit.
4. **But a polished prompt still lies — fluently, confidently, indistinguishably.** A US lawyer got sanctioned over six invented citations; Air Canada was held liable for a policy its chatbot made up. Not bad prompts. *Unmeasured* ones.
5. **The engineering answer is to measure:** test set (questions with known answers) + scorer (code, not squinting) + score (one number ends the argument).
6. **The scorer is part of the system and can itself be the liar.** Exact match fails correct answers; contains passes some wrong ones; an AI judge has biases. Metric design is a design decision.
7. **The loop is the job:** write → eval (T=0, ×3, average) → read failures → fix ONE thing → re-run → when the score plateaus, grow the test set. Failures are the syllabus.

**Readiness test:** deliver beats 1–7 out loud, 3 minutes, no notes, ending with "a prompt without an eval is a superstition." Then answer, cold: "why does temperature 0 still flutter?" and "why can't they train hallucination out?" If both answers come instantly, you're ready.

---

## B. Concept deep-dives, slide by slide

### Slide 1 · Title — "Talking to AI, and catching its lies"

**Claim:** two artifacts today — a prompt playbook and an eval harness.
**Framing to open with:** "Last session you learned what the machine is. Today you learn to *operate* it — and, more importantly, to stop trusting your own eyes about whether it's working." The pill on the slide — "your 10 questions become a weapon" — is the session's continuity hook: their Lab 1 Part E expert questions become today's test set. If some students lost that file, the lab handout has them rewrite it in 5 minutes; don't burn slide time on it.

### Slide 2 · Recap quiz — "Still true after the break?"

Four true/false items, each a load-bearing S1 idea this session depends on. Know the one-line re-teach for each wrong answer:

| Item | Answer | One-line re-teach (why S2 needs it) |
|---|---|---|
| Model looks up answers in a database | False | Nothing stored/retrieved — parameters compute each token fresh. This is *why* it can fabricate: there is no record to miss. |
| Same prompt, different answers across runs | True | Sampling + temperature. This is why the eval runs at T=0 ×3. |
| It keeps learning from your chats | False | Frozen at inference. This is why few-shot "learning" lives only in the context window. |
| Tamil costs more tokens than English | True | English-heavy tokenizer training. Matters when their prompts include Tanglish examples. |

**Landmine:** don't re-lecture S1. Wrong answer → one line → next question. Budget 2 minutes total.

### Slide 3 · The deal — two artifacts in two hours

**Claim:** prompt playbook + eval harness; the harness "is the difference between using AI and engineering it."
**Deeper:** the honest version of that sentence: every serious AI team ships on the same loop (prompt → measure → fix → repeat), and the eval set is usually the most valuable IP they have — more durable than the prompts, often more durable than the model choice. Prompts get rewritten when models change; a good test set survives every migration. Say that: it lands with professors.
**Pushback:** "Two hours to learn evaluation? Companies have whole teams for this." — Correct, and those teams run this exact loop at 1000× the scale. The 10-question version is a flight simulator, not the airline.

### Slide 4 · The makeover — v0 → v5 (centerpiece #1)

**Claim:** the same goal, asked six ways, climbs from 10% to 85% useful.
**What each upgrade actually fixes** — know this table cold; before every "Improve" click, ask the room "what's still wrong?":

| v | Adds | What it fixes, mechanically | Meter |
|---|---|---|---|
| v0 | — ("write about tce") | Nothing pinned: model completes the average essay about generic colleges. | 10% |
| v1 | TASK (3 sentences, named subject) | Length and subject pinned; output stops sprawling but is factless — the model has no TCE specifics to draw on reliably. | 25% |
| v2 | ROLE + AUDIENCE (website homepage, parents + prospective students) | Register/tone: conditioning on "college website homepage" shifts the distribution toward marketing-copy patterns from training. Facts still thin. | 35% |
| v3 | CONTEXT (founded 1957, Karumuttu Thiagarajan Chettiar, autonomous, Anna University affiliation) | The knowledge gap: the model can't retrieve, so you supply. Output now grounded in *your* facts, not its fuzzy recall. Biggest single jump. | 60% |
| v4 | FORMAT + NEGATIVE ("one bold opening line, two short sentences; avoid 'esteemed institution'") | Shape and de-clichéing. Negative instructions work but are weaker than positive ones — say what you want first. | 75% |
| v5 | CONSTRAINT ("if a fact is not in the list above, do not state it") | The guardrail. Output looks identical to v4 — the punchline is that the *system* changed: it can no longer invent rankings and awards. "Remember this line for slide 11." | 85% |

**Mechanism, one level down:** each addition narrows the conditional distribution. v0 conditions on 4 tokens; v5 conditions on ~120 tokens that exclude most bad continuations before generation starts. Prompting is *distribution sculpting*, not persuasion.
**Landmine:** the % meter is authored, not measured — it's a narrative device. If a sharp student asks "measured how?", the honest answer is the session's own thesis: "Exactly — you can't know without an eval. That's slide 13. Hold that thought." (This is a gift, not a gotcha.)
**Pushback:** "Won't GPT-6 make all this unnecessary?" — Better models need less *coaxing* but the same *specification*. v3's facts and v5's guardrail aren't tricks, they're requirements no model can guess. Tricks expire; specs don't.

### Slide 5 · Anatomy — six switches

**Claim:** Task mandatory; role/context/format/examples/constraints are dials; over-stuffing costs tokens and dilutes attention.
**Each switch, with a before/after micro-example and the mechanism:**

| Switch | Before → After | Why it works |
|---|---|---|
| **Role** | "Explain recursion" → "You are a patient TA for first-years. Explain recursion." | Conditions the register: training text by patient TAs uses simpler vocabulary and more analogies. Role selects a *style prior*, it doesn't grant knowledge. |
| **Task** | "write about tce" → "Write a 3-sentence introduction to TCE Madurai for the website homepage." | Verb + object + length pins the target. The only mandatory part. |
| **Context** | "Summarize my project" → "Summarize the project below for a recruiter: [pasted text]" | It remembers nothing and retrieves nothing (S1). Every needed fact must be in *this* window. |
| **Format** | "List the risks" → "Reply ONLY with JSON: {\"risks\":[{\"name\",\"severity\"}]}" | Output tokens are constrained by the demanded pattern; parseable by code. |
| **Examples** | a paragraph describing Tanglish sentiment labels → 3 labelled examples | In-context learning (slide 6) — patterns out-argue descriptions. |
| **Constraints** | "Write about TCE's achievements" → "…If a fact is not stated above, do not state it. If unsure, say 'I am not sure.'" | Two mechanisms: shrinks the licensed continuation space, and *gives the probability mass somewhere honest to go* — "I am not sure" becomes an available high-probability continuation instead of a forced guess. |

**Worked cost arithmetic (board-friendly):** the deck's builder estimates tokens as chars÷4. Task-only prompt ≈ 53 chars ≈ **13 tokens**; all six switches ≈ 420 chars ≈ **105 tokens**. The extra ~92 input tokens are nearly free for a student — but at production scale: 100,000 calls/day × 92 tokens = 9.2M tokens/day; at Gemini 3.5 Flash input pricing ($1.50 per 1M tokens, ₹95.5/$) that's **$13.80 ≈ ₹1,318/day ≈ ₹39,500/month** just for the fixed prompt preamble. Context caching cuts repeated-prefix cost by ~90% (teaching number) — S6 territory, but plant the seed: "structure isn't free; that's why the switches are dials, not defaults."
**Pushback:** "Why does over-stuffing 'dilute attention'?" — Attention normalizes over all tokens in the window: every irrelevant token takes a share of the weighting, and instructions buried mid-window get followed worst ("lost in the middle" applies to instructions, not just retrieval). Practical rule: front-load the task, end with the ask.
**Landmine:** don't present the six parts as a mandatory ritual. The deck's own note says it: turn on what the job needs. A six-part prompt for "translate this word" is cargo cult.

### Slide 6 · Few-shot — show, don't tell

**Claim:** 2–5 examples pin format, labels, and edge cases better than a page of instructions.
**Mechanism, one honest level down:** this is **in-context learning (ICL)** — behavior changes with *zero* weight updates. Nothing is trained; the examples create a pattern in the context, and pattern-continuation is what the model does. Deeper still (for professors): pretraining corpora are full of structured repeating documents — tables, FAQ lists, log files, code — so the model has learned general "continue the established pattern" circuitry (Anthropic's mechanistic work calls these *induction heads*: attention heads that find previous occurrences of the current token and copy what followed). One research framing treats ICL as implicit Bayesian task inference — the examples identify *which task* from pretraining this looks like. Be honest that the mechanistic story is still active research; the behavior is rock-solid, the explanation is partial.
**Worked example (reproduce on the board):**

```
"Vera level padam!"            → POSITIVE
"Time waste"                   → NEGATIVE
"Ok ok, one time watchable"    → NEUTRAL
"Padam semma boring da, second half thookam vandhuchu" →
```

The completion "NEGATIVE" is now overwhelmingly the most probable next token — the three pairs established the pattern (Tanglish review → uppercase single label) *and* the label vocabulary. Zero-shot, the same model rambles a paragraph of sentiment analysis with no clean label — nothing pinned the output shape.
**Known quirks worth teaching:** example *order* matters (recency bias — the last example pulls hardest), label *balance* matters (3 POSITIVE examples bias toward POSITIVE), and one mislabeled example teaches the wrong pattern instantly. 2–5 examples capture most of the gain; 20 mostly costs tokens.
**Pushback:** "Is it learning from my examples?" — Not in the weights sense. Close the chat and it's gone (S1: frozen at inference). It's closer to setting up dominoes than teaching. **"Then why does it work at all if nothing changes?"** — Because the computation is a function of the *whole* context; you changed the input, and the input is the program.
**Landmine:** never say "the model fine-tunes on your examples" or "it learns your style permanently." Also don't promise few-shot fixes factual errors — it fixes *format and task framing*, not knowledge.

### Slide 7 · Step-by-step — auditable work

**Claim:** "solve step by step, then answer" beats direct answering on multi-step problems, and the working is checkable.
**Worked example (do this live — have the class compute on paper first, 30 seconds):** ₹500 item, 20% discount, then 18% GST on the discounted price.

```
1. Discount:  500 × 0.80 = ₹400
2. GST:       400 × 1.18 = ₹472
Final: ₹472
```

The canned "direct" answer is ₹490 — plausible-looking (it's 500 − 20% + something) and wrong, with no visible way to see why. That contrast IS the slide.
**Mechanism:** intermediate tokens are working memory. Each generated step becomes part of the context conditioning the next step — the model gets more forward passes' worth of compute per unit of problem. And the failure math compounds: a 10-step chain where each step is 95% reliable succeeds only 0.95¹⁰ ≈ **0.599** — 60% — of the time. Visible steps don't change that arithmetic, but they let you find *which* step broke instead of just seeing a wrong total.
**2026 status (connect to S1's reasoning-models slide):** Wei et al. 2022 showed "think step by step" dramatically lifted multi-step accuracy in older models. Today's reasoning models (the GPT-5.6 line, Gemini 3.5, Claude Opus 4.8) internalized the technique — they generate internal reasoning traces by default, trained via RL; that's the "test-time compute" idea from Session 1. So the magic phrase is mostly obsolete on frontier models. What is *not* obsolete: demanding **visible, auditable** working whenever a human must check the logic — money, marks, medicine. The prompt line changed from a performance hack to an audit requirement.
**Landmine (professor-grade):** the model's stated reasoning is not guaranteed to be its actual computation — chain-of-thought faithfulness is an open research problem (models sometimes produce a correct-looking chain and an answer decided otherwise). Frame CoT as "auditable working," never "its true thoughts."

### Slide 8 · Format — demand structure ▸

**Claim:** apps don't read prose; the word ONLY is doing real work.
**Worked JSON round-trip (whiteboard-able):**

```
Prompt: Extract the student's details from the text.
        Reply ONLY with JSON: {"name": str, "degree": str, "year": int}
        Text: "Hi, I'm Priya, third year BE CSE at TCE"

Model:  {"name": "Priya", "degree": "BE CSE", "year": 3}

Code:   data = json.loads(response)   →  data["year"] + 1  →  4
```

Without ONLY, the typical response is `Sure! Here's the data you asked for: {...} Let me know if you need anything else!` — and `json.loads` raises `JSONDecodeError` at 2 a.m. Other classic wrapper: markdown code fences around the JSON. Prompt-level fixes: "ONLY", "no prose, no code fences"; the engineering-grade fix is **structured outputs** (`response_schema`), where the API constrains generation to a schema — that's Session 3's new beat, so name-drop it: "there's a proper API-level fix; Thursday."
**Pushback:** "Why does one word matter so much?" — The polite wrapper is the highest-probability continuation because RLHF'd assistants are trained toward helpful conversational tone. ONLY explicitly de-licenses it.

### Slide 9 · The four prompt crimes

Flip cards; make the class shout the fix before each click. The fixes, with the one-level-deeper reason:

1. **Kitchen sink** ("summarize AND translate AND quiz AND…") → one prompt, one job; chain calls. Deeper: multi-task prompts split attention across objectives and make failures undiagnosable — you can't A/B a prompt that does five things. Explicitly previews S5 workflows.
2. **Vague adjectives** ("make it professional") → define it or show it. "Professional" has no single referent in training data; a rubric ("no slang, ≤3 sentences, active voice") or 2 examples does.
3. **Assuming memory** ("like I told you yesterday") → it remembers nothing (S1); everything needed goes in THIS window, every time.
4. **No format spec** → structure up front; your parser will thank you (slide 8's point, restated as a crime).

### Slide 10 · The turn — real receipts

**Claim:** polished prompts still lie; two courts have the receipts. Tell both stories accurately — assume a law-adjacent parent or a professor who read the coverage is in the room.

**Mata v. Avianca (S.D.N.Y. 2023).** Roberto Mata sued the airline Avianca over a knee injury from a metal serving cart. His lawyers filed an opposition brief citing **six court decisions that do not exist** — ChatGPT invented them, complete with plausible names ("Varghese v. China Southern Airlines"), docket numbers, and internal citations. Opposing counsel couldn't find the cases; Judge P. Kevin Castel ordered copies; the lawyer went *back to ChatGPT*, which produced fake full opinions and, when asked whether the cases were real, said yes. June 2023: **$5,000 sanction** on the lawyers and their firm. **The nuance that survives cross-examination:** the judge did not sanction them for using AI — he sanctioned the abandonment of professional verification duty and the doubling-down after being challenged. The tool lied; the humans failed to check. That's precisely this session's thesis.
**Moffatt v. Air Canada (2024 BCCRT 149).** Jake Moffatt's grandmother died; Air Canada's website chatbot told him he could buy a full-fare ticket and claim the bereavement discount **retroactively within 90 days**. The airline's actual policy said no retroactive claims, and the chatbot's own answer linked to the page saying so. Air Canada refused the refund and argued before the British Columbia Civil Resolution Tribunal that the chatbot was "a separate legal entity responsible for its own actions." The tribunal called that submission remarkable, found **negligent misrepresentation**, and held the airline responsible for all information on its website — chatbot or static page — awarding Moffatt CA$812.02. February 2024, and still the canonical "your bot's words are your words" precedent two years later.

**The line that lands:** "These weren't bad prompts. They were unmeasured ones." Then, pointing at the citation line on the slide: "Unlike the lawyer, I checked mine."
**Landmine:** don't inflate — the lawyer was fined $5,000, not disbarred; Air Canada paid ~CA$812, not millions. The stories are powerful *because* they're small and real: the cost of checking was near zero and nobody paid it.

### Slide 11 · Spot the lie (centerpiece #2)

**Claim:** a fabrication is indistinguishable *by tone* from truths; only checking detects it.
**The three rounds — know the ground truth cold:**

| Round | The lie | Why it's the lie |
|---|---|---|
| 1 | **C** | TCE's 1957 founding is real; the "UGC National Institute of the Year 2019" award is invented. A and B (Meenakshi gopurams; "Athens of the East") are true. |
| 2 | **B** | Sachin's 100th international hundred vs Bangladesh, 2012 — real. But India **lost** that match (Asia Cup). The lie hides in the tail of a true sentence. |
| 3 | **A** | Einstein's 1921 Nobel is real — but for the **photoelectric effect**, not relativity. True year, true prize, false reason. |

**The pattern to name after round 1:** hallucinations arrive *welded to true facts* — a true opening raises the plausibility of an elaborated tail, because generation conditions on its own prefix. Award-announcement *sentence patterns* are common in training data even when the specific award never happened: pattern frequency beats fact frequency. The tone-o-meter (identical 97% bars every round) is the visual: confidence is constant; truth varies.
**Run it as a vote:** hands up for A/B/C before each reveal; 6-second reveal window, then it auto-advances. Budget 4.5 minutes.
**Landmine:** the three statements are authored, not sampled from a model — modeled on exactly how real hallucinations attach to facts. If asked, own it and point to the lab's "hard mode" stretch where they make a real model do this on their own topic.

### Hot-take slide · "Hallucination is not a bug"

**Claim:** the model does exactly what it was trained to do — produce plausible text; truth was never in the loss function.
**The mechanism to whiteboard if challenged (this is the session's deepest 3 minutes):**
The model is a *plausibility machine*: it emits a probability distribution over next tokens and samples from it. There is no truth variable anywhere in that computation — hallucination is a calibration failure of a machine that was only ever asked for plausibility. Illustrative (say "numbers illustrative") board sketch — two prompts, two distributions:

```
"TCE was founded in 19__"        "TCE won the National ______ Award"
  57  → 0.62                        Institute  → 0.31
  58  → 0.11                        Excellence → 0.24
  60  → 0.07                        Education  → 0.19
  ...                               ...
```

Both distributions are confident-looking and fluent. The left one happens to land on a fact; the right one is fabrication-shaped from the first token — but *the machine's internal picture looks the same in both cases*. Peakedness ≠ truth.
**Why RLHF makes the tone problem WORSE (professor-grade, verified):** base models are surprisingly well-calibrated at the token level — their probability tracks their accuracy (shown in the GPT-4 technical report's calibration curves). RLHF *degrades* that calibration: human raters systematically prefer confident, fluent answers and mark down hedging, so the tuning process optimizes tone toward confidence independent of correctness. The polish you like is the polish that hides the lies. Additionally (Kalai et al., OpenAI 2025, "Why Language Models Hallucinate"): most benchmarks grade binary right/wrong with no reward for "I don't know" — so training and evaluation both reward guessing over abstention, exactly like students gaming an exam with no negative marking.
**Answering "why can't they just train it out?":** over-penalize guessing and the model becomes uselessly evasive ("I cannot answer that" to everything); the helpfulness/honesty trade-off is a live alignment problem. Rates drop with grounding (S4 RAG) and tools (S5) but never reach zero — the disease is in the objective.
**Delivery:** read the take once, slowly, then stay silent 3 seconds. Take ONE counter-argument now, park the rest for the break; strongest counter gets named on the closing slide. ▸ compressible if behind: read it, skip the debate.

### Slide 13 · The bridge — "You measure."

**Claim:** test set + scorer + score = the engineering answer to "how do you know it's right?"
**Deeper:** the philosophical shift worth saying out loud: this is the moment AI work stops being *vibes* and becomes *engineering* — the same shift unit tests brought to software. One number converts "is prompt B better?" from an argument into a query. The dot-strip animation auto-plays to "7/10 — argument over."
**Attribution landmine:** the deck wisely calls "In God we trust; all others must bring data" *the engineer's oldest prayer* — it's routinely attributed to W. Edwards Deming but the attribution is unverified. Don't say "Deming said."

### Slide 14 · Watch an eval run

**Claim:** 10 cricket questions, scored live; run it twice and the score moves.
**Click sequence:** Run eval (7/10) → *immediately* Run again (8/10 — row 3, "MS Dhoni's Test average", flips by design). Then the line: "Which is the true score? Neither. Temperature 0, three runs, report the average and the spread."
**Why T=0 still flutters (know this cold — it's a guaranteed question):** temperature 0 means always take the argmax token, but the *logits themselves* can vary run-to-run: floating-point addition is non-associative, so different batch sizes / kernel scheduling on the provider's servers change the reduction order; mixture-of-experts routing can also shift under batching. When two top tokens are within ~1e-6, the argmax flips, and one flipped token early cascades into a different sentence. So: T=0 kills the *intentional* dice, then you measure the flutter that remains. ×3 + average + spread is honest at this scale.
**Coaching beat on the slide:** "Read the failures, not the score." 7/10 isn't the insight; *which three and why* is — wrong facts (model), format drift (prompt), too-strict matching (scorer). Each has a different fix, which is why the lab forces a diagnosis per ✗.
**Honesty note:** the demo's 7→8 is scripted so the variance point lands reliably; a real T=0 pair would flip less often. If called out: "Scripted, yes — the deck is offline. You'll see real flutter in Stretch 1 of the lab in twenty minutes."

### Slide 15 · Scorers — same answer, three verdicts (deep-dive)

**Claim:** the metric is a design decision; the scorer can be the liar.
**The deck's case:** Q: "Who composed the music for Roja?" Expected: "A. R. Rahman". Model: "It was composed by AR Rahman in 1992."

- **Exact match:** `"It was composed by AR Rahman in 1992." == "A. R. Rahman"` → ✗. The answer is right; punctuation and extra words killed it. Verdict: scorer wrong.
- **Normalized contains** (the lab's scorer): `norm(s) = lowercase, strip non-alphanumerics` → `"ar rahman"` appears in `"it was composed by ar rahman in 1992"` → ✓. Robust to case, dots, extra words.
- **LLM-as-judge:** ask a second model "does this answer correctly identify A. R. Rahman? PASS or FAIL" → PASS. Handles paraphrase, costs tokens, has biases.

**The harder worked case — one answer, three verdicts (use on the board or in Q&A):**
Q: "Which city is the capital of Tamil Nadu?" Expected: `chennai`. Model answers: **"The capital is Chennai, the heart is Madurai."**

| Scorer | Verdict | Why |
|---|---|---|
| Exact match | ✗ | Full string ≠ "chennai". Punishes a correct answer. |
| Normalized contains | ✓ | "chennai" is in the normalized answer. |
| LLM judge | *depends on the rubric* | "Contains the expected fact, paraphrase OK?" → PASS. "Fully correct with no extraneous claims?" → may FAIL it for the Madurai flourish. The judge's verdict is a function of the judge's prompt — you've just moved the design problem up one level. |

Three scorers, three different verdicts on a *correct, charming* answer. That's the whole slide in one example — and it's a Madurai joke, so it lands.
**Where contains fails silently (teach the traps):** negation blindness — expected `chennai`, answer "It is definitely **not** Chennai" → PASS (wrong answer scored right). Substring hazard — expected `31` (fastest ODI century, balls), answer "…in 1931…" → PASS on a coincidence. Fixes: keep expected strings specific-but-minimal, read every ✓ occasionally too, and for numbers prefer word-boundary checks.
**LLM-judge biases (verified, quantified in the MT-Bench/Chatbot-Arena judge paper):** *verbosity bias* (longer answers rated better), *position bias* (in pairwise comparisons, the first-listed answer wins more), *self-preference* (a model prefers its own phrasing/family). Mitigations: pairwise with position swap, rubric-anchored single-answer grading, judge at T=0, and periodic human spot-audits. Never let the judge be the only signal.
**Pushback:** "Isn't a model grading a model circular?" — Partially, and that's why it's the *stretch* goal, not the default. It buys paraphrase-tolerance at the price of a new unmeasured component. The discipline transfers: audit the judge with a small human-labeled set before trusting it.

### Slide 16 · The arena — Prompt A vs B

**Claim:** same 5 questions, same model, only the prompt differs; settle it with numbers.
**The scripted read-out (know the exact numbers):** A = "Answer this: {q}" scores **2/5**; B = role + "answer from known facts only, say I-don't-know otherwise" + format scores **4/5**; **Q5 fails both**. Two lessons in one animation: (1) the prompt moved the number — grounding + abstention licensing works; (2) the loop never ends — Q5 means grow the test set and go again. Say the closing note verbatim: "The loop never ends; it just converges."
**What to prep for from the real lab version (Part C):** B sometimes *loses* on a student's set — the "say I am not sure" rule makes the model abstain on questions A happened to guess right. That's the best teachable moment of the day: an honest "I am not sure" is a product win but an eval loss under a contains scorer. Whose bug is that? The scorer's/test-design's — which is exactly slide 15's point arriving in their own data.

### Slide 17 · "It worked when I tried it" ▸

**Claim:** a demo is the best case; the eval is the expected case. You tried 3 questions; users bring 3,000 — misspelled, in Tanglish, about edge cases you never imagined.
**Deeper:** this is selection bias, named: you unconsciously demo the inputs you already know work. Every AI product that embarrassed its company in the news had a great demo first (Air Canada's chatbot presumably demoed fine). One sentence, next slide — it's a ▸ slide.

### Slide 18 · Eval-driven development — the loop

**Claim:** write → run (T=0 ×3 average) → read failures → fix ONE thing → re-run; when the score stops improving, grow the test set.
**Deeper — why one change at a time:** with two simultaneous changes and a moved score you have confounded variables; you learned nothing reusable. Same discipline as bisecting a bug. And why "grow the test set": once you've tuned against the same 10 questions repeatedly you're overfitting to the test — Goodhart's law ("when a measure becomes a target, it ceases to be a good measure"). Held-out questions are the antidote; their eval becomes a *regression suite* they run before every prompt change — and it returns in S6 to grade the capstone.
**Landmine:** don't let the pipeline animation (it auto-cycles) run silently — narrate one full lap, then move.

### Slides 19–21 · Recap flips, lab brief, break

**Recap (19):** six flip cards — anatomy, few-shot, step-by-step, hallucination, test set, the loop. Class says each aloud *before* you click. This is retrieval practice, not review — don't skip the saying-aloud part.
**Lab brief (20):** 2 minutes max, then press L (50:00 countdown; amber at 10:00, red at 2:00; R resets). The three coaching lines: expected strings SHORT (key fact only — "rahman", not a sentence); diagnose every ✗ (model wrong / scorer too strict / question ambiguous); documentation is the deliverable ("I changed stuff and it got better" doesn't count). Checkpoints: 1 = five documented makeover rows; 2 = score + one-line diagnosis per failure; 3 = A vs B numbers + most interesting failure explained in one sentence.
**Rate-limit reality (new, plan for it):** typical free-tier limit is ~10 RPM (check the live limits page). One eval pass = 10 calls ≈ 1+ minute; A/B (Part C) = 20 calls; the ×3 variance stretch = 60 calls ≈ 6+ minutes wall-clock. The notebook's `ask()` already backs off on 429s. Coach pairs to *start Part C by the 30-minute mark* and to read failures while runs are in flight — the waiting time IS the diagnosis time.
**Lab cost sanity-check (if a professor asks what this costs):** ~120 calls at ~80 tokens in / ~60 out = 9,600 in + 7,200 out; at paid Gemini 3.5 Flash rates ($1.50/$9.00 per 1M, ₹95.5/$) that's $0.0144 + $0.0648 ≈ $0.079 ≈ **₹7.6 per pair** — and it's ₹0 on free tier. The entire class of 30 pairs would cost about ₹230. Evaluation is cheap; not evaluating is what's expensive (ask Avianca's lawyers).
**Break slide (21):** show-and-tell — best prompt improvement read aloud, best caught lie, and name the strongest hot-take counter-argument from the break. Ask every presenter: "model, scorer, or question?" Teaser: S3, AI gets eyes and ears — have 1–2 photos on the phone (receipt, notes page, canteen menu board).

---

## C. Demo playbooks

Everything in this deck is **client-side and canned** — no API calls, works offline. That's a feature (zero demo risk) and an honesty obligation (the lab is where reality lives). Universal fallback for any glitch: re-enter the slide (left arrow, right arrow) — every widget resets; worst case, reload and type the slide number + Enter.

| Demo (slide) | What it actually computes | Click sequence that lands the point | The sentence at the reveal |
|---|---|---|---|
| Recap quiz (2) | 4 scripted T/F items; score counter | Read aloud → class shouts → click → one-line re-teach if wrong | "Everything today stands on these four." |
| Makeover (4) | 6 canned prompt/output pairs + authored % meter | Ask "what's still wrong?" BEFORE each Improve click; at v5, hit Restart and flash v0 | "Same output as v4 — but now it *can't* invent awards. Hold that for slide 11." |
| Builder (5) | Assembles selected parts; token count = chars÷4 | Toggle everything on, read the count; toggle down to Task-only | "Every switch you flip costs context — they're dials, not defaults." |
| Few-shot (6) | Two canned outputs (ramble vs NEGATIVE) | Zero-shot first, let the ramble disappoint, then Few-shot | "Three examples out-argued a paragraph of instructions." |
| Step-by-step (7) | Canned ₹490-wrong vs ₹472-stepped | Class computes on paper 30s → Direct (wrong) → Steps | "Confident, plausible, wrong — and you couldn't see why. Now you can." |
| JSON (8) | Canned prose vs clean JSON | No-format first ("now write a parser for THAT"), then JSON | "The word ONLY is doing real work." |
| Crime flips (9) | 4 flip cards | Class shouts each fix, then click | "Four crimes, four one-line fixes." |
| Spot the lie (11) | 3 authored rounds (lies: C, B, A); tone-o-meter shows identical 97% bars after each answer | Hands-up vote per round BEFORE clicking; point at the meter each reveal | "Identical bars, every round. Tone tells you nothing. Only checking does." |
| Measure dots (13) | Auto-plays 10 ✓/✗ marks → "7/10" | None — it plays on slide entry; don't talk over the verdict | "Argument over. A prompt without an eval is a superstition." |
| Eval run (14) | Scripted outcomes; Run=7/10, Run again=8/10 (row 3 flips) | Run → *immediately* Run again → point at the changed row | "Which is true? Neither. T=0, three runs, average and spread." |
| Scorers (15) | 3 canned verdicts on the Rahman answer | Exact (✗ — let the injustice register) → Contains → Judge | "The answer was right. The scorer was the liar." |
| Arena (16) | Scripted: A 2/5, B 4/5, Q5 fails both | One click: Fight. Read columns left to right | "B wins 4–2 — and Q5 beat both. Grow the set, fix again." |
| Loop stepper (18) | Auto-cycles stages every 1.7s | Narrate one lap; a click also advances it | "Failures aren't embarrassments. They're the syllabus." |
| Lab timer (20) | Real 50:00 countdown (L start/pause, R reset) | Press L when the brief ends, not before | "Fifty minutes. Checkpoint 1 by :15." |

**If a student calls out a simulation** (any demo): never bluff. "Canned, deliberately — this deck runs offline so nothing can break on stage. The claim it illustrates is real, and you'll reproduce it live on your own questions in the lab in twenty minutes." For spot-the-lie specifically, add: "and the lab's hard-mode stretch is you making a real model do exactly this."

---

## D. Q&A bank

Spoken-voice model answers. The first ten will genuinely occur; the last few are professor-grade.

1. **"Is prompt engineering still a real job in 2026?"** — The job *title* is fading; the skill got absorbed into everyone's job, like Googling did. Crude tricks die with every model release, but structured context-giving — role, facts, format, constraints — is just specification writing, and specification writing has never gone out of style. You're learning to write specs, not spells.
2. **"Why can't they just train hallucination out?"** — Because truth was never the training objective — plausible continuation was. And there's a live trade-off: penalize guessing hard enough and the model turns uselessly evasive. There's even a 2025 OpenAI paper arguing our benchmarks make it worse: binary grading with no reward for "I don't know" teaches models to guess, like students in an exam with no negative marking. You reduce it with grounding and tools; you never hit zero.
3. **"If reasoning models think step-by-step internally, is chain-of-thought prompting dead?"** *(connects to S1)* — As a magic accuracy phrase, mostly yes — the models internalized it; that's the test-time-compute story from Session 1. But as an audit requirement it's very alive: when money, marks, or medicine are involved, you demand visible working not to make the model smarter but so a *human* can check the chain.
4. **"Is the model learning from my few-shot examples?"** *(connects to S1)* — No weights change — Session 1's frozen-at-inference rule holds. The behavior shift lives entirely inside this context window; close the chat and it's gone. It's dominoes, not education.
5. **"10 questions — statistically valid?"** — No, and I won't pretend otherwise. At 7/10 the standard error is about 14 percentage points — the 95% interval spans roughly 42% to 98%, so 7/10 versus 8/10 is pure noise. It's the right size anyway because the deliverable is the *loop*, and every failure is individually diagnosable regardless of n. Real teams run hundreds to thousands, stratified by category.
6. **"Why does temperature 0 still give different answers?"** — T=0 means always take the top token, but the scores behind that choice wobble: floating-point addition isn't associative, so different server batching changes the arithmetic order, and when two tokens are nearly tied the winner flips. One flipped token early, different sentence after. Hence three runs and an average.
7. **"Can 'answer only from the facts above' be broken by a malicious user?"** *(connects to S5)* — Yes. Instructions and user data share one context window, so crafted input can override your rules — that's prompt injection, number one on the OWASP Top 10 for LLM apps two editions running, with no complete fix known. Constraints are quality controls, not security controls. Defense-in-depth is a Session 5 topic.
8. **"Why was Air Canada liable — isn't the chatbot a third-party tool?"** — That was literally their defense: the chatbot is "a separate legal entity responsible for its own actions." The tribunal called it remarkable and said a company is responsible for all information on its website, chatbot or static page. The amount was small — about CA$800 — but the precedent is the point: your bot's words are your words.
9. **"Doesn't RAG solve hallucination?"** *(connects to S4)* — It's the single biggest reduction — you ground answers in retrieved documents instead of parametric memory. But the model can still misread, mis-combine, or ignore what was retrieved, and retrieval itself can fetch the wrong thing. Next session's problem. Reduce, never eliminate — which is why the eval harness survives every session of this course.
10. **"Does saying 'please' improve answers?"** — Marginal at best, and unstable across models; specificity beats manners every time. Actually a perfect first experiment for the harness you built today — measure it instead of believing either me or the folklore.
11. **"Is the AI judge trustworthy — a model grading a model sounds circular."** — Partially circular, yes. Known measured biases: prefers longer answers, prefers the first-listed answer in pairwise comparisons, prefers its own phrasing. Mitigations exist — swap positions, pin a rubric, spot-audit against human labels — but the rule is: the judge is a scorer you must *also* evaluate, never the only signal.
12. **"Are the model's stated reasoning steps its real computation?"** *(professor curveball)* — Not guaranteed — that's the chain-of-thought faithfulness problem, still open research. Models sometimes produce a plausible chain while the answer was determined by something else entirely. That's exactly why I teach step-by-step as 'auditable working' rather than 'reading its mind': the working is checkable even if it isn't a confession.
13. **"Why not eval on a public benchmark instead of homemade questions?"** *(professor curveball)* — Contamination: public benchmark answers are very likely in the training data, so you'd partly measure memorization. Their obscure personal-expertise questions probably aren't memorized — and if the model aces all ten, the correct response is suspicion: make the test harder until it bleeds. A test that can't fail teaches nothing.

---

## E. Misconception table

| Students walk in believing… | The correction |
|---|---|
| Hallucination is a bug the vendors will patch | It's the training objective working as designed — plausibility, not truth; you engineer around it, never away. |
| Confident tone signals a correct answer | Calibration failure: tone and truth are uncorrelated — and RLHF actively makes the tone *more* confident without making the content more true. |
| The model remembers past chats and learns my examples | Frozen weights; everything lives and dies inside the current context window. |
| Prompting = finding magic words | It's specification: task, facts, format, constraints. Spells expire with each model release; specs don't. |
| "It worked when I tried it" = it works | Three hand-picked tries is a demo (best case); an eval is the expected case. |
| A higher score always means a better prompt | The scorer can be the liar (exact-match failing correct answers; contains passing "not Chennai"), and tuning on the same 10 questions forever is Goodhart. |
| Temperature 0 = fully deterministic | Mostly, not fully — batching and floating-point order still flip near-ties; hence ×3 and average. |
| The model's step-by-step output is its actual reasoning | It's auditable working, not a confession — faithfulness is an open problem. |

---

## F. Timing pressure map

Deck budget 102.5 min total = 47.5 talk + 52 lab-block (2 brief + 50 lab) + 3 close. The presenter panel (press S) tracks you against these numbers; "behind — compress" appears at +90s.

| Zone | Historic bleed | Action |
|---|---|---|
| Recap quiz (2) | Re-teaching S1 at length on a wrong answer | One line per miss, hard cap 2 min. |
| Makeover (4) | Over-discussing each version; 4 min becomes 8 | One "what's still wrong?" question per click, one hand per question. This is a centerpiece — protect it by starving slides 8/12/17 instead. |
| Crimes (9) | Class debates each card | Shout-then-click; 45s per card max. |
| Spot the lie (11) | Voting theater ×3 rounds; 4.5 min becomes 7 | Vote by hands (fast), not discussion. The 6s auto-advance paces you — don't pause it with commentary between rounds. |
| Hot take (12) ▸ | Taking three counter-arguments on the spot | Take ONE, park the rest for the break. Compressed version: read it, 3s silence, move. |
| Format (8) ▸ | Explaining JSON parsing to non-web students | Compressed version: one click (no-format), one line ("now write a parser for that"), move. |
| Demo trap (17) ▸ | None — but don't skip the headline | 15 seconds is enough: say the title, next slide. |
| Lab (20) | Brief runs long; timer starts late | 2-min brief max; press L before you finish talking if needed. Sweep checkpoints at lab-minute 30. |

**Never cut:** makeover (4), spot-the-lie (11), eval run (14), scorers (15), arena (16), and the full 50-minute lab. These five slides + lab ARE the session; everything else is connective tissue.
**Lab-hour pressure:** rate limits make Part C slow (20+ calls at ~10 RPM) — push pairs to start Part C by lab-minute 30 and diagnose failures *while* runs execute. Common coaching moments, in expected order: expected-strings too long (minute 20), test set aced 10/10 → "add questions until it bleeds" (minute 30), three changes between runs → one at a time (minute 40).

---

## G. Going deeper — weekend reading

1. **Brown et al. 2020, "Language Models are Few-Shot Learners"** — the GPT-3 paper that discovered in-context learning; Section 3 is where few-shot went from curiosity to paradigm. Read it to answer "who found this and how."
2. **Wei et al. 2022, "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"** — the CoT origin; skim the ablations to see exactly which task families benefit (multi-step arithmetic/symbolic) and which don't.
3. **Olsson et al. 2022 (Anthropic), "In-context Learning and Induction Heads"** — the mechanistic story behind slide 6: attention heads that find-and-continue patterns. The strongest available answer to a professor asking *why* ICL works.
4. **Kalai et al. 2025 (OpenAI), "Why Language Models Hallucinate"** — frames hallucination as statistically inevitable under current objectives and argues binary-graded benchmarks reward guessing over abstention. Directly arms the hot-take slide.
5. **Zheng et al. 2023, "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"** — quantifies verbosity/position/self-preference biases and the mitigations; the source behind slide 15's judge caveats.
6. **Liu et al. 2023, "Lost in the Middle: How Language Models Use Long Contexts"** — why instruction placement matters and why over-stuffed prompts degrade; backs the "attention dilution" line on slide 5.
7. **Hamel Husain, "Your AI Product Needs Evals" (blog, 2024)** — the practitioner's doctrine for everything in slides 13–18; the closest thing to how real teams actually run the loop this session teaches.
