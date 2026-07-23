# Session 5 — Instructor Prep Pack
*the deep version*

> Deck: `session-5-making-ai-do-things.html` — 23 slides, 9 interactives, one hot take. Post-lunch Day 2. This is the session students quote in interviews ("workflow vs agent"), and the one where a professor is most likely to probe protocol details (MCP, multi-agent). Work through this file until you can improvise every whiteboard sketch in it.

---

## 1 · Narrative spine

One argument, eight beats. Every slide serves one of these:

1. **Your RAG app is a brain in a jar** — it explains beautifully but can't compute, can't check today, can't touch a file (slides 1–3).
2. **Tool use gives it hands — but the model never executes anything.** It emits a structured *request*; your code validates and executes; the result re-enters the context as new tokens. Still next-token prediction, end to end (slides 4–5).
3. **The declaration is the interface AND the prompt.** Name + docstring + parameter types are the model's entire knowledge of your tool. MCP is that declaration, standardized industry-wide (slides 6–7).
4. **A while-loop around tool calls is "an agent."** The model picks the order; nobody scripts it. Impressive — and exactly where the danger lives (slides 8–9).
5. **Tool use fails in five knowable ways**, and the fifth (poisoned tool results) is Session 6's opening (slide 10).
6. **Most problems want a boring workflow, not an agent, because reliability compounds:** 0.95¹⁰ ≈ 0.599. Multi-agent multiplies the same curve; the one clean exception is parallel fan-out + judge (slides 11–15).
7. **Escalate up a ladder — prompt → few-shot → RAG → tools → fine-tune — only when your eval says the cheaper rung failed** (slides 16–17).
8. **API vs local weights is an engineering trade** (privacy, cost at scale, offline), and production is usually a hybrid (slides 18–20). Then recap, lab, close (21–23).

**Readiness test:** say beats 1→8 out loud in under 3 minutes, with the three load-bearing numbers from memory: **0.95¹⁰ ≈ 0.599**, **N×M → N+M**, **~20 tok/s local**. If you stumble on the transition from beat 5 to 6 (failures → "so prefer workflows"), rehearse only that seam — it's the intellectual hinge of the session.

---

## 2 · Concept deep-dives

### 2.1 Brain in a jar — slides 1–3

**Claim:** A RAG app is still text-in/text-out; it cannot act, compute exactly, or perceive the present.

**Mechanism.** Everything Sessions 1–4 built is one function: `tokens → next-token distribution → sample → repeat`. RAG changed *what goes into* the context; nothing so far changes what comes *out* — always and only text. The four pills on slide 3 are the four distinct gaps: exact computation (sampling digits ≠ arithmetic), freshness (frozen weights + cutoff), reach (no filesystem/network), and side effects (can't send, write, spend). Tool use addresses all four with one mechanism.

**Worked example (board).** Ask the room: "aggregate of 72, 81, 64, 90, 77, 68?" The true mean is 452/6 = **75.33**. A model *predicting* the digits of the answer is doing what it did with the GST bill in Session 1 — emitting plausible digits, not computing. Numbers that look right and numbers that are right are different failure classes; write both on the board when the agent-log demo later produces exactly 75.33.

**Pushback.** *"But new models do math correctly now."* — Frontier models are better because they're trained to write and run code or call calculators internally — i.e., the vendors built today's lesson into the product. Raw sampled digits are still unreliable for arbitrary arithmetic. *"Isn't RAG already a tool?"* — In your S4 build, retrieval ran *before* the model, scripted by you: a workflow. Today the model itself decides when to search. Same component, different controller — that's precisely the workflow/agent distinction arriving early; flag it and return to it at slide 11.

**Landmine.** Don't say the model "can't do any math" — small sums it genuinely reproduces from training. The honest claim: it has no arithmetic *procedure*, so reliability collapses as numbers get unusual.

### 2.2 The trick + the trust boundary — slide 4

**Claim:** The model never executes anything. It writes requests; your code executes.

**Mechanism.** Tool-use models are instruction-tuned on examples where the correct "next tokens" are a structured function call. At inference, when the context contains tool declarations and the user's need matches one, the highest-probability continuation *is* the call — emitted in a reserved format the API surfaces as a `functionCall` part instead of text. The model then stops. Your runtime decides what happens next. Nothing about the transformer changed since Session 1; what changed is a **convention between you and the model** about what certain output patterns mean, plus your code honoring that convention.

Consequence — the trust boundary, say it as a slogan: **the model proposes, your code disposes.** You choose the menu, validate every argument, and can refuse any call. Session 6's entire defense story stands on this sentence.

**Pushback.** *"Doesn't Gemini's code-execution tool run code on Google's servers?"* — Yes: providers offer *hosted* tools (code execution, search grounding) that execute on their infrastructure. The principle is intact — the model still only emits a request; an executor honors it — but the executor is theirs, so your validation layer isn't in the loop. For anything touching your data or money, define your own tools. *"So an 'evil' model could still do damage?"* — Only through the tools you exposed and the arguments you failed to validate. Capability = your tool surface, not model intent. That reframing is the whole security model of Session 6.

**Landmine.** Never say the model "has" a calculator or "uses" the internet. It has *descriptions* and the ability to *request*. Sloppy phrasing here undoes the slide.

### 2.3 The wire-level round trip — slide 5 (stepper)

**Claim:** One tool call = two API requests with structured parts in between.

**Mechanism + worked example.** This is the whiteboard set piece of the session — know all four payloads cold. The GST question, at the wire level (trimmed but structurally exact):

**① You → API** — declarations ride along with every request:

```json
{ "contents": [
    { "role": "user", "parts": [ { "text": "What's 18% GST on ₹2,347?" } ] } ],
  "tools": [ { "functionDeclarations": [ {
      "name": "calculator",
      "description": "Evaluates a math expression exactly. Use for ANY arithmetic — never compute numbers yourself.",
      "parameters": { "type": "OBJECT",
        "properties": { "expression": { "type": "STRING" } },
        "required": ["expression"] } } ] } ] }
```

**② API → you** — the "answer" is not text; it's a request:

```json
{ "candidates": [ { "content": { "role": "model", "parts": [
    { "functionCall": { "name": "calculator",
                        "args": { "expression": "2347 * 0.18" } } } ] } } ] }
```

**③ Your code** — allow-list check (`calculator` is on the menu ✓), charset validation (`2347 * 0.18` parses as arithmetic ✓), execute → **422.46**. The model is frozen the whole time; there is no session on the server — it's waiting for nothing.

**④ You → API again** — the FULL history plus a `functionResponse` part:

```json
{ "contents": [
    { "role": "user",  "parts": [ { "text": "What's 18% GST on ₹2,347?" } ] },
    { "role": "model", "parts": [ { "functionCall": { "name": "calculator", "args": { "expression": "2347 * 0.18" } } } ] },
    { "role": "user",  "parts": [ { "functionResponse": { "name": "calculator", "response": { "result": 422.46 } } } ] } ],
  "tools": [ "…same declarations…" ] }
```

**⑤ API → you, final text:** `"18% GST on ₹2,347 is ₹422.46, making the total ₹2,769.46."` Exact — *because it never did the math; it delegated.* (2347 × 0.18 = 422.46; 2347 + 422.46 = 2,769.46.)

Two structural facts students miss: **(a)** the API is stateless — step ④ resends everything, which is why long agent runs get token-expensive; **(b)** from the model's view the `functionResponse` is just new tokens in the context. It cannot verify 422.46 — if your tool returned 999, it would fluently report 999. Tool correctness is your job.

**The malicious run (the button)** replays the same five stages with `args: {"expression": "__import__('os').system('rm -rf /')"}`. Menu check passes (it *is* calling calculator); **argument validation fails** — charset isn't arithmetic — so nothing executes, and the error message goes back as the `functionResponse`. The model reads its own rejection and retries correctly. Exact lesson, one sentence: **the dangerous thing was never the model — it was `eval()` without a validator; the boundary held because your code checked arguments, not intentions.**

**Pushback.** *"Where does the malicious expression come from — is the model evil?"* — No: from its context. A poisoned document or webpage that flowed in via RAG or a previous tool result can carry instructions the model obediently converts into tool calls. Session 6 demonstrates the delivery; today you build the bouncer. *"Why role `user` for the function result?"* — That's the current google-genai convention (older REST examples used a `function` role); either way it's just labeled context tokens.

**Landmine.** Don't claim validation makes tool use "safe." Charset-checking blocks code injection into `eval`; it does nothing against a semantically harmful but well-formed call (`send_email` to the wrong person). Defense is layered: allow-list → schema/charset → semantic checks → human gate on side effects. Session 6 completes the stack.

### 2.4 Declarations: the docstring IS the prompt — slide 6

**Claim:** Name + docstring + parameter types are the model's entire understanding of your tool.

**Mechanism.** The SDK introspects your Python function — name → `name`, docstring → `description`, type hints → JSON Schema `parameters` — and serializes that declaration into **every request's context**. The model never sees your function body. So tool choice is a pure text-matching problem between the user's need and your description, which makes the description a prompt with all of Session 2's rules: specific beats vague, instructions beat documentation ("Use for ANY arithmetic — never compute numbers yourself" is an *instruction*), and negative space matters (say when NOT to use it).

**Worked example.** The calculator docstring is ~25 tokens; its full declaration serializes to roughly 60–80 tokens. A 10-tool menu ≈ 600–800 tokens **on every single call** — at Gemini 3.5 Flash input pricing ($1.50/1M tokens, ₹95.5/$ — the free tier's current Flash, served as `gemini-flash-latest`), that's ~₹0.10 per request of pure menu overhead: small per call, real at volume, and worse: every extra tool dilutes selection accuracy. Big menus are a cost AND a correctness problem — curate them per task.

**Pushback.** *"What if two tools have overlapping descriptions?"* — The model picks by text similarity and will be inconsistent. Fix is disjoint descriptions with explicit routing hints ("for dates, use days_between, not calculator"). Lab Stretch 2 (`"""Does stuff."""`) demonstrates the failure on purpose. *"Can I lie in a docstring?"* — Yes, and the model will believe you; that's also why injected text can manipulate tool choice.

**Landmine.** Don't present automatic function calling as magic. It's four mechanical steps (introspect → declare → intercept → loop) and Lab Part C disables it precisely so students see the raw `functionCall`. Magic framing here costs you credibility at slide 14 ("while-loop in a trench coat").

### 2.5 MCP — slide 7 (new, ▸ compressible)

**Claim:** MCP is USB-C for tools — one standard plug, so N apps + M tools instead of N×M custom adapters.

**Mechanism (one level deeper than the slide — enough for a professor).** The Model Context Protocol (Anthropic, open-sourced Nov 2024; adopted across the industry in 2025) specifies:

- **Architecture:** a *host* app (Claude, an IDE, your chatbot) runs an MCP *client*; each tool/data provider runs an MCP *server*. Transport: **JSON-RPC 2.0** over stdio (local) or HTTP (remote).
- **Discovery:** client connects → `initialize` handshake (capabilities, versions) → `tools/list` returns declarations — name, description, JSON-Schema parameters, *the exact triple students hand-wrote on the previous slide* → `tools/call` invokes one and returns the result.
- **Three server primitives:** **tools** (model-invoked actions — today's material), **resources** (app-selected context: files, DB rows — Session 4's material, standardized), **prompts** (user-invoked templates — Session 2's material, standardized). The whole course maps onto the protocol; say that out loud, it lands.

**Worked example (board):** your college builds 4 AI apps (helpdesk bot, timetable assistant, an IDE plugin, a WhatsApp bot) needing 6 capabilities (results DB, attendance API, rulebook search, calendar, fee gateway, notice-board scraper). Point-to-point: 4 × 6 = **24 integrations**, each with bespoke auth and formats. With MCP: 6 servers + 4 clients = **10 implementations**, and the 5th app costs 1, not 6.

**"Is MCP just function calling?"** — the question you WILL get. Answer: *at heart, yes — the same declaration/call/result cycle. What MCP adds is everything around it: a standard transport (JSON-RPC), runtime discovery (tools/list instead of hardcoded menus), and one wire format so a tool server is written once and every model ecosystem can use it. Function calling is the verb; MCP is the grammar.*

**Landmine.** Don't demo MCP or drift into server-building — this is a 1.5-minute name-the-thing slide (▸). And don't call it "an agent framework" — it standardizes the *tool side*, not the loop. The loop is still your while-loop.

### 2.6 Which tool should it call? — slide 8

**Claim:** Tool selection is inference from descriptions — and knowing when to call *nothing* is half the skill.

**Mechanism.** Selection quality is a function of (menu size) × (description sharpness) × (question ambiguity). The five quiz items map to: pure arithmetic → calculator; post-cutoff fact → web_search; unseen file → read_file; core training knowledge ("process vs thread") → **no tool** — over-tooling adds latency, cost, and failure surface; and item 5 (CGPA vs class average from results.csv) needs read_file *then* calculator — a chain no single call solves, which is the cliffhanger into the agent loop.

**Pushback.** *"How does it know its own cutoff / that it can't know CSK's latest match?"* — It doesn't, reliably. It's trained to associate "recent events" phrasing with search tools, but it can also confidently answer from stale knowledge without calling. Mitigation is prompt-level ("for anything time-sensitive, always use web_search") — another docstrings-are-prompts case.

**Landmine.** Don't say the model "reasons about" tools as if there's a separate planner. Selection is the same next-token machinery scoring continuations; the deck's whole demystification depends on not re-mystifying it here.

### 2.7 The agent loop — slide 9 + Lab Part C

**Claim:** `while the model wants a tool: execute (your code), feed the result back` — that loop is the entire "agent."

**Mechanism.** Each iteration = one full wire round trip from §2.3, with history growing. The demo trace: model calls `read_file("marks.csv")` → your code returns six marks → *given that new context*, the model calls `calculator("(72+81+64+90+77+68)/6")` → 75.33 → final text: "above the class average of 71 by 4.33." Nobody scripted read-then-calculate; ordering emerged because after step 1 the most probable continuation was a calculator call over the freshly-seen numbers. Also on the meter: each loop iteration resends the entire history — an n-step run costs roughly the sum of n growing prompts, another quiet argument for fewer steps.

**Worked example.** Lab Part C is the manual version: with `automatic_function_calling` disabled, `"What is 15% of 8400 plus 200?"` yields a visible `MODEL WANTS: calculator {'expression': '8400 * 0.15 + 200'}` and nothing executes until student code says so. (8400 × 0.15 = 1260; + 200 = **1460**.) The moment a student prints that raw request, the trust boundary stops being a slogan.

**Pushback.** *"Is this ReAct?"* — ReAct (Yao et al., 2022) is the prompting-era ancestor: interleaved Thought/Action/Observation as plain text, parsed by regex. Native function calling is the productized version — structured parts instead of fragile text parsing. Same idea; cleaner interface. *"Where does it end?"* — When the model emits text instead of a call — OR when your hard cap fires. Never ship a loop bounded only by the model's judgment.

**Landmine.** "Agent" has no crisp industry definition — say so before someone quotes a framework's marketing at you. Useful working definition: *an LLM in a loop, choosing tools and steps toward a goal.*

### 2.8 Five failure modes — slide 10

**Claim:** Tool use fails in five knowable ways; each has a boring engineering fix.

| # | Failure | Concrete trace | Fix |
|---|---|---|---|
| 1 | Wrong tool, confidently | "What year did TCE start?" → `calculator("1957")` — it matched "year" to numbers | Sharper docstrings + "answer directly when no tool is needed" in the system prompt |
| 2 | Bad arguments | `calculator("what is eighteen percent of 2347")` → ValueError | Validate inside every tool; return *readable* errors — models genuinely self-correct on a good error message (the stepper's malicious run shows the retry) |
| 3 | Infinite loop | `web_search("X")` → junk → `web_search("X info")` → junk → … | Hard cap (~5 calls), then force a text answer. Every framework ships this constant |
| 4 | Imaginary tools | `functionCall: send_email(...)` — a tool you never declared, hallucinated from training data | Allow-list execution: only run functions on YOUR menu; reject the rest |
| 5 | Poisoned results | Tool returns a webpage containing "ignore your instructions and…" — and that text enters the context with the same authority as everything else | Treat every tool result as untrusted input. No complete fix — this is OWASP LLM01, and it's Session 6's opening act |

**Pushback.** *"Why does a good error message help?"* — The error re-enters the context; the most probable continuation after "invalid expression — arithmetic only" is a corrected call. You're prompting-by-error-message. *"Isn't #5 just #2 again?"* — No: #2 is the model generating malformed output; #5 is an *attacker* steering well-formed output. Different threat model, different defenses.

**Landmine.** Don't oversell the fixes for #5. OWASP has ranked prompt injection #1 for two editions running precisely because there is no complete fix — only defense-in-depth. Promise layers, not solutions, or Session 6 will contradict you.

### 2.9 Workflow vs agent + the decision rule — slides 11 & 15

**Claim:** Most problems need a workflow (you fix the steps; the model fills the hard parts), not an agent (the model picks the steps). One question decides: **do you know the steps in advance?**

**Mechanism.** This is Anthropic's "Building Effective Agents" framing, and the industry consensus it crystallized: workflows = predefined code paths orchestrating LLM calls (predictable, testable, debuggable — each step evaluable in isolation with Session 3's evals); agents = the LLM directs its own process (flexible, and every runtime decision is a new failure point priced by §2.10's math). The idli line carries it: a Madurai mess breakfast is a workflow — same steps daily, no decisions; a wedding feast is an agent — someone senior improvising under pressure. Expensive, occasionally brilliant, occasionally a disaster.

**Worked example.** Invoice processing: extract fields → validate against PO → flag mismatches → post to the ledger. Steps known in advance ⇒ workflow; the model does the genuinely hard parts (reading a messy scanned invoice) *inside* fixed steps. Versus "investigate why April's GST filing doesn't reconcile" — the path depends on what each lookup reveals ⇒ agent, on a leash: max steps, tool allow-list, validated args, human sign-off on anything that writes, spends, or sends.

**Pushback.** *"But agent demos look amazing."* — A demo is one best-case run; production is the expectation over thousands. Same trap as Session 2's "it worked when I tried it" — a demo is n=1 on the p^n curve. *"You sound anti-agent."* — Anti-*misapplied*-agent. The resume-honest line from the slide: "built an AI workflow with tool use" beats "built an autonomous agent" with interviewers who've watched a demo die at step 7.

**Landmine.** Don't let this become "agents are bad." The claim is conditional: known steps → workflow wins; genuinely unpredictable path → agent, leashed. Over-engineering (an agent where a prompt would do) and under-engineering are both failure modes.

### 2.10 The compounding math — slide 12 (centerpiece)

**Claim:** Chained-step reliability multiplies: success ≈ p^n. Long chains collapse.

**Mechanism + the table** (know these cold; the slider will display them):

| p per step | 5 steps | 10 steps | 20 steps |
|---|---|---|---|
| 0.99 | 95.1% | 90.4% | 81.8% |
| 0.95 | 77.4% | **59.9%** | 35.8% |
| 0.90 | 59.0% | 34.9% | 12.2% |

Board derivation: independent steps ⇒ P(all succeed) = p × p × … = p^n. The anchor number: **0.95¹⁰ ≈ 0.599 — a 10-step agent at 95% per step is a coin flip you paid for.** And even a 99%-per-step agent — better than most real tool chains — is down to 82% at 20 steps. Compounding is merciless. Fixes, in order: **fewer steps** (that's the workflow argument in one word), validation checkpoints between steps (catching an error resets the chain), human approval on side-effecting steps, retries on cheap idempotent ones (retries raise effective per-step p — that's *why* they work).

**Pushback.** *"Steps aren't independent — this model is too crude."* Correct, concede it warmly: real chains correlate (a run that survives step 3 is likelier competent overall), validation truncates failures, retries lift p. The model is a direction, not a forecast — and the direction is undefeated: every added autonomous step multiplies risk. It explains the observed industry pattern (demos die in production) with one line of arithmetic. *"Where does 95% even come from?"* — Illustrative, and generous: measure your own per-step reliability with Session 3's evals; many real tool calls score lower.

**Landmine.** Don't present p^n as a law of nature or quote it to three decimals as if measured. Its power is being *approximately right and totally memorable*.

### 2.11 Multi-agent — slides 13 & 14 (new, ▸ compressible + hot take)

**Claim:** More agents = more compounding. What ships is usually specialists joined by a boring workflow; true multi-agent wins only for parallel, independent subtasks with a judge.

**Mechanism — hand-off math (board).** Two 90%-reliable agents chained: 0.9 × 0.9 = **81%** before any real work happens. Model the hand-off itself (context summarized, intent lost in translation) at 95%: 0.9 × 0.95 × 0.9 ≈ **77%**. Chaining agents is just adding steps with extra-lossy seams — the same curve, steeper.

**The two patterns to name:**
- **Orchestrator–worker:** one agent decomposes and delegates; workers run *in parallel on independent subtasks*; a judge/merge step integrates. Parallel branches don't compound — a failed branch costs one branch, not the run. This is the legitimate pattern: research fan-outs, red-team vs blue-team, many-documents-at-once. Caveat honestly: Anthropic's own write-up of their research system reports big quality gains on breadth-first tasks *and* roughly an order of magnitude more tokens — the pattern buys reliability and breadth with money.
- **Peer-to-peer chatter** (agents "collaborating" in a shared conversation): every message is a lossy hand-off; this is the pattern the math punishes, and the one the 2026 pitch decks love.

**Live first-person example (use it):** this course's own materials were built orchestrator-worker style — an orchestrating session fanned out parallel workers (one per session's deck/lab/notes) with a verification pass at the end. Independent subtasks, fan-out, judge. It worked for exactly the reason the slide gives — and where one worker's output fed another's input, it was pinned down with a fixed, validated workflow, not a conversation.

**Hot take (slide 14):** "Most production 'AI agents' are a while-loop in a trench coat." Read it once, slowly, then three seconds of silence. Invited counter-arguments you should *welcome*: planning/decomposition layers, memory beyond the context window, learned routing — real engineering, all of it wrapping the same loop. Take one counter now, park the rest for the break; strongest one gets named at the close.

**Pushback.** *"Company X ships multi-agent and it works."* — Look at the architecture: fixed hand-offs, validated at each seam — a pipeline in a costume, which is the slide's own "what actually ships" card. The buzzword and the architecture diverge; teach students to read the diagram, not the press release.

**Landmine.** Don't claim multi-agent "doesn't work" — orchestrator-worker demonstrably does. The precise claim: *chained autonomy* compounds failure; *parallel independence + a judge* sidesteps compounding. Keep those two clauses attached.

### 2.12 The escalation ladder — slides 16–17

**Claim:** Prompt → few-shot → RAG → tools → fine-tune, ascending cost. Climb only when your **eval** proves the current rung failed.

**Mechanism.** Each rung changes something different: the prompt changes *instructions*; few-shot changes *demonstrated behavior*; RAG changes *available knowledge*; tools change *available actions*; fine-tuning changes *the weights themselves* — which is why it's last: it needs training data + eval infrastructure, re-runs on every base-model update, freezes knowledge uncited, and is wrong for facts (interview line: **fine-tuning teaches behaviour; RAG provides knowledge**). The discipline that makes the ladder real: an eval (Session 3) is the gate between rungs — otherwise "we need to fine-tune" is a mood, not a diagnosis.

**Worked example — one scenario walked up every rung.** *College helpdesk bot for the 80-page attendance & exam rulebook* (lab Part D, scenario 1):
- **Rung 1, prompt:** "You are TCE's helpdesk; answer from the rulebook" — fails immediately: the model has never seen TCE's rulebook. Eval shows fabricated clause numbers.
- **Rung 2, few-shot:** examples fix tone and answer format; knowledge is still absent. Eval: format score up, factuality unchanged.
- **Rung 3, RAG:** chunk + embed the rulebook, retrieve, cite. Factuality and citations pass. **For pure Q&A, stop here** — this is the answer, and updating the rulebook on Tuesday means re-embedding one PDF, not retraining.
- **Rung 4, tools:** only if it must also *act* — check a student's live attendance percentage via API, compute shortfall with a calculator. Escalate the moment the question is "am *I* short of attendance?" rather than "what is the attendance rule?"
- **Rung 5, fine-tune:** only if this bot had to emit a rigid 12-field JSON ticket 50,000×/day on a small cheap model AND few-shot provably failed the format eval. For a helpdesk Q&A bot: never.

**Pushback.** *"Why is fine-tuning bad at facts?"* — Gradient updates diffuse facts across weights: expensive to add, near-impossible to update or delete one, no provenance. Retrieval keeps facts in a database — updatable, citable, deletable. *"When is fine-tuning genuinely right?"* — Narrow behaviour at high volume on a small model: strict formats, a house style, a classification skill — where per-call few-shot token overhead at scale exceeds one-time training cost.

**Landmine.** Item 5 in the picker ("capital of France") is rung **zero** — no augmentation at all. Don't rush past it: over-engineering is a failure mode, and catching it is the maturity signal the whole slide exists for.

### 2.13 Local models, quantization, hybrid economics — slides 18–20

**Claim:** Open-weight models on your hardware win on privacy, cost-at-scale, and offline; frontier APIs win on capability and zero-ops. Production is a hybrid. A trade, not a religion.

**Mechanism — what quantization actually does.** A weight is stored at some precision. Gemma 4 E4B ("effective 4B" — ~4 billion active parameters):

| Precision | Bytes/param | ~4B params ≈ | Fits 8 GB laptop? |
|---|---|---|---|
| FP16 (training) | 2 | ~8 GB | No — nothing left for OS/KV cache |
| INT8 | 1 | ~4 GB | Barely |
| **4-bit (Ollama default)** | 0.5 | **~2–2.5 GB** | Yes, comfortably |

4-bit quantization maps each small block of weights onto 16 levels with a per-block scale factor. Down to 4 bits the quality loss is measurable but small (the distribution over next tokens barely moves); **below 4 bits quality falls off a cliff** — too few levels to preserve the weight distribution. That cliff is why 4-bit is the standard, not 2-bit. This is the FACTS-block rule of thumb from the slide: **8 GB RAM ≈ 3–4B-parameter quantized models.**

**Speed expectation:** local generation is memory-bandwidth-bound — every token requires streaming all ~2.5 GB of weights through the processor — so a laptop gives roughly **~20 tok/s** (the deck's simulation uses exactly this), versus a frontier API's typically severalfold faster streaming plus network. Reading speed is ~5 tok/s: local is genuinely usable, visibly slower.

**Hybrid economics (board, in ₹ — FACTS prices, ₹95.5/$).** Gemini 3.5 Flash — the free tier's current Flash, served as `gemini-flash-latest`: $1.50/1M input ≈ ₹143.25/M; $9.00/1M output ≈ ₹859.50/M. A typical request (1,000 in + 300 out) ≈ $0.0042 ≈ **₹0.40**. Now a campus product at 10,000 requests/day:
- All-API on flash-latest: ~$42/day ≈ ₹4,011/day ≈ **₹1.2 lakh/month**, forever, scaling linearly — the frontier tax. (The retired-for-new-users 2.5 Flash ran $0.30/$2.50; the Flash tier re-based ~5× on input in 2026 — budget from the live pricing page, never from memory.)
- **Hybrid** — a local Gemma handles the routine 90% (FAQ-shaped, format conversion), API takes the hard 10%: ~₹401/day ≈ **₹12,000/month** + electricity on hardware you already own — a 10× lever from one routing decision. That routing decision is itself a workflow (a cheap classifier up front), and context caching (≈ −90% on cached input) stacks on top for repeated system prompts.

Privacy is the other axis, and it's yours personally: in fintech/KYC, regulators ask exactly where every prompt travels. Local weights end the question — tell it first-person; a lived compliance story beats the slide.

**Pushback.** *"Will local models catch the frontier?"* — For narrow, well-scoped tasks: effectively already there. For frontier reasoning: a real gap that shrinks every release. The pragmatic answer is the hybrid row of the slide-20 table. *"Is Gemma 'open source'?"* — Apache 2.0 for Gemma 4 (Mar 2026), so genuinely permissive — but "open weights" is the precise term for this model class generally; you usually get weights, not training data or code. *"Exactly how big is Gemma 4 / GPT-5.6?"* — Gemma's effective size is published (that's the E4B); frontier API parameter counts are **not public — never state one.**

**Landmine.** Don't say local is free — hardware, electricity, and your ops time are real; "~free *per token*" is the honest claim. And don't run the Ollama demo on venue Wi-Fi assumptions: the model must be pre-pulled and rehearsed with Wi-Fi off (that's the whole theatrical point).

### 2.14 Recap, lab, close — slides 21–23

Slide 21 (six recall flips + cold-call): the class says each idea *before* the flip. Slide 22 (lab brief, 2 min max — the lab is 50): Part A calculator (checkpoint: exact GST with tool, wobble without), Part B chain (`days_between` + calculator: internship 2026-05-15 → 2026-07-20 = **66 days** ≈ 2.2 months × ₹25,000 = **₹55,000**), Part C raw `functionCall` (de-mystifies — make every pair run it), Part D scenario cards (checkpoint 3 is verbal; reward reasoning over the "right" letter — several cards have defensible seconds). Stretch 1 is the capstone accelerator: `search_notes` from Lab 4 wired in as a tool = knowledge + hands in one assistant. Slide 23 close: "Knows, sees, acts. Finale: we attack all of it — bring this notebook, it's the target." Name the strongest hot-take counter-argument from the break.

Lab operational notes: the lab's `gemini-flash-latest` sits in the ~10 RPM class on typical free-tier limits (check the live rate-limits page) — pairs sharing keys will hit 429s if they hammer; teach the pause-and-retry reflex. Mixed-room model-id note: new free-tier keys 404 on dated `gemini-2.5-*` ids ("no longer available to new users") while existing keys still serve them — the alias works on both (July 2026 → Gemini 3.5 Flash), which is why every lab pins the alias; pin a dated id only if you need frozen behavior. The notebook's `eval()` is charset-validated — say explicitly that production uses a real parser (`ast`/sympy) and *never* raw `eval` on model output.

---

## 3 · Demo playbooks

Nine interactives. For each: what it really is, the click path, the reveal line, the fallback.

**Recap quiz (slide 2)** — Real quiz, scripted content; 4 true/false from S4 (same embedding model, fine-tuning≠facts, "I don't know" escape hatch, numpy-is-fine). Advance is on YOUR click — let them argue first. Reveal line (Q2): "fine-tuning teaches behaviour; RAG provides knowledge." Fallback: none needed; it's self-contained JS.

**Tool stepper (slide 5)** — Fully scripted walkthrough of the §2.3 round trip; nothing calls an API and it doesn't pretend to. Clicks: Step ×5, stress stage 3 ("args parse as math, not DROP TABLE") — then **Try a malicious call**, which restarts at stage 1 and shows the rejection at stage 3. Reveal: *"The model proposes. Your code disposes."* If a student notes it's canned: "Correct — and Lab Part C is the real one; you'll print this exact functionCall yourself in an hour."

**Which-tool quiz (slide 8)** — Real votes, scripted answers, 5 items. Item 4 is the trap (no tool needed); item 5 sets up the agent loop ("that's a CHAIN — next slide"). Reveal (item 4): "Knowing when NOT to call is half the skill."

**Agent log (slide 9)** — *Simulated* trace (timed print of a realistic automatic-function-calling log), honest replica of what the SDK produces. One click: Run agent ›. Reveal: *"Two tool calls, correct order — zero lines of if/else deciding that order."* If called out: "Scripted for the projector, yes — the notebook runs the real loop and the trace looks exactly like this."

**Reliability slider + Monte Carlo (slide 12, centerpiece)** — Real math, computed live: curve is literally p^n; the Monte-Carlo strip draws a Bernoulli run per step. Sequence: drag to 95 → point at "10 steps → 60%" → drag to 99 → "even at 99%, twenty steps is 82%" → **Run a 10-step agent › three times** — it dies at a different step each run. Reveal: *"A 10-step agent at 95% per step is a coin flip you paid for."* If a professor objects to independence, use the §2.10 concession — it's a strength, not a bug, that you concede and the direction survives.

**Multi-agent board moment (slide 13)** — No widget; the demo is the room: ask "two 90%-reliable agents chatting — combined reliability?" Wait for 81%. That's the whole demo.

**Ladder (slide 16)** — Click every rung (they indent rightward as cost climbs; ₹-meters on each). Land rung 5's cost line: "₹₹₹ + maintenance forever." Reveal: *"Escalate only when your EVAL says the cheap rung failed."*

**Approach picker (slide 17)** — Real votes, 5 scenarios; make students defend before you click. Item 5 (capital of France) is rung ZERO. Reveal: *"Over-engineering is also a failure mode."*

**Ollama race (slide 19)** — Two modes. **Plan A (real, rehearse it):** Wi-Fi OFF, `ollama run gemma4:e4b`, ask for a one-sentence Tamil explanation of tokens. Reveal: *"Four billion knobs, on this laptop, no meter running."* **Plan B (the deck's typing race):** an honestly-labeled simulation — two `<span>`s typed at ~20 tok/s vs API speed with pre-written Tamil answers. If you use Plan B, say "simulation" out loud; the deck's own comment does. Pre-pull the model days before; `gemma3:4b` is the fallback on older hardware.

**Recap cold-call (slide 21)** — highlights a random un-flipped card; point at a student; they say it, then flip. Keeps the last 3 minutes honest.

---

## 4 · Q&A bank

1. **"How does the model know when to call a tool?"** — It's instruction-tuned on tool-use examples, so when declarations are in context and the need matches a description, the highest-probability continuation is a structured call instead of prose. Still next-token prediction — the "decision" is the same sampling you met in Session 1.

2. **"Is this ReAct?"** — ReAct (2022) was the prompt-era version: Thought/Action/Observation as plain text you parsed with regex. Native function calling productizes it — structured parts, no parsing. Same loop, cleaner interface.

3. **"Can the model call two tools at once?"** — Yes — modern APIs emit parallel calls in one response and your runtime can execute them concurrently. Speed for coordination complexity; results still all come back as context.

4. **"Is MCP just function calling with branding?"** — At heart it's the same declaration/call/result cycle — plus a standard transport (JSON-RPC), runtime discovery (tools/list), and one wire format, so a tool server written once works with every model ecosystem. Function calling is the verb; MCP is the grammar. (§2.5 has the 4×6 arithmetic.)

5. **"Why not let the model execute code directly? It'd be faster."** — Then the model's mistakes and an attacker's injections both execute with no checkpoint. The request/execute split is the only place a validator can live — remove it and Session 6's entire defense stack has nowhere to stand.

6. **"If p^n is real, how does anyone ship a 50-step agent?"** — By making n effectively small: validation checkpoints reset the chain, retries lift per-step p, sub-workflows pin the predictable parts, humans gate the risky ones. Shipping agents is the art of not letting probability multiply unattended.

7. **"Two agents checking each other should be MORE reliable, no?"** — A *verifier* pattern can be — that's parallel-plus-judge, and the checker only needs to catch errors, not produce work. But two agents *chained*, each doing work the next depends on, multiply: 0.9 × 0.9 = 0.81. Direction of information flow decides which math you get.

8. **"What exactly does 4-bit quantization throw away?"** — Precision, not structure: each block of weights is snapped to 16 levels plus a scale. The next-token distribution barely moves at 4 bits; below that there are too few levels and quality cliffs. That's why 4-bit is the default and 2-bit is a research toy.

9. **"Could we fine-tune Gemma on our syllabus instead of RAG?"** — You'd spend weeks teaching weights facts that a retrieval index learns in minutes, with no citations and no way to update one rule when the syllabus changes. Fine-tune the *behaviour* (format, tone) if an eval proves prompting can't hold it; keep the *facts* in RAG. (Bridge to Session 4.)

10. **"How do I measure that 95%-per-step number for my own agent?"** — Session 3's machinery: a golden set of tasks per step, run each step in isolation, score pass-rate. Per-step evals are exactly how real teams find which step is the weak factor in the product. (Bridge to Session 3.)

11. **"The tool returned wrong data and the model repeated it confidently. Whose bug?"** — Yours, twice: the tool for being wrong, the system design for having no validation between tool output and user. The model did its job — it faithfully continued from context. Garbage in, fluent garbage out; that's also why tool results are Session 6's favorite attack surface.

12. **"Are 'computer-use' agents (models driving a GUI) the same thing?"** — Same architecture, bigger menu: the tools are click/type/screenshot, the loop is identical, and p^n applies with a vengeance because n is huge and each step is noisy. That's why they're impressive demos and cautious products.

13. **"Why did you make us hand-write declarations if MCP standardizes it?"** — Same reason you computed cosine similarity by hand before using a vector DB: you can only debug the abstraction you can see beneath. Every MCP server on earth is the triple you wrote today — name, description, schema.

14. **"What's the single decision rule to take home?"** — Do you know the steps in advance? Yes → workflow, model fills the hard parts. No → agent, on a leash: step cap, allow-list, validated args, human sign-off on side effects. And climb the ladder only when an eval says the cheaper rung failed.

---

## 5 · Misconception table

| Walk-in belief | One-line correction |
|---|---|
| "The AI runs the tools" | It emits a *request*; your code validates and executes — the model proposes, code disposes. |
| "Agents are smarter versions of workflows" | Agents are *less constrained* versions — flexibility bought with compounding failure (0.95¹⁰ ≈ 0.599). |
| "More agents = more capability" | Chained agents multiply failure (0.9 × 0.9 = 0.81); only parallel-independent + judge escapes the math. |
| "Fine-tuning is how you teach a model your data" | Fine-tuning teaches *behaviour*; RAG provides *knowledge* — facts in weights are stale, uncited, unfixable. |
| "Tool docstrings are just documentation" | They are the model's *entire* understanding of the tool — a docstring is a prompt with a return type. |
| "Local models are toy models" | A quantized 4B model at ~20 tok/s is production-real for narrow tasks — private, offline, ~free per token. |
| "The model knows what tools it has and what they do" | It sees only name + description + schema, resent as tokens on every request — it has never seen the function body. |
| "If the tool returns it, the answer is right" | The model can't verify results; if your tool returns 999 for 2347×0.18, it fluently reports 999. |

---

## 6 · Timing pressure map

Pre-lab budget ≈ 59.5 min against a nominal hour — there is **no slack**, and this session historically bleeds in three places: the two voting games (students argue — good, but cap items), the hot-take fight, and Ollama demo fiddling.

| Zone | Slides | Risk | Action |
|---|---|---|---|
| Recap + jar | 2–3 | Low | 6 min; the quiz advances on your click — keep arguments to one exchange |
| Tool mechanics | 4–9 | **High** — stepper (5 min) + two games | If behind: which-tool quiz 5→3 items (keep 4 and 5 — the no-tool trap and the chain) |
| ▸ MCP | 7 | Medium — professors ask follow-ups | 1.5 min budget; name it, do the N×M count, park depth for the break (§2.5 has your answers) |
| Reliability block | 11–12 | **Never cut** | The centerpiece; 3 Monte-Carlo runs minimum — the visceral beat of the session |
| ▸ Multi-agent + ▸ hot take | 13–14 | Medium | Compressible to 2 min combined: the 81% question + read the take once. Don't host the debate now — park to break |
| Ladder + picker | 16–17 | Medium | If behind: picker 5→3 items (keep 1, 4, 5 — RAG, fine-tune, rung zero) |
| ▸ Local block | 18, 20 | Low | 18 and 20 compress to one line each; **19 (Ollama live) is not cuttable** — it's the only live-hardware moment in the course |
| Lab brief | 22 | Chronic overrun | 2 min hard cap; the handout repeats everything |

**Never cut:** slide 4 (the trick — the session's load-bearing sentence), slide 5's malicious run, slide 12 + Monte-Carlo, slide 19 live Ollama, lab checkpoints. **Pre-stage before lunch:** Ollama model pulled and tested Wi-Fi-off, notebook Cells 2–4 run on your own key, deck at slide 1 with presenter mode (S) started.

---

## 7 · Going deeper (weekend reading)

1. **"Building Effective Agents" — Anthropic engineering blog (Dec 2024).** The workflow/agent vocabulary this session teaches, from the source; the five workflow patterns (chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) are your answer bank for "what should I build instead of an agent?"
2. **"ReAct: Synergizing Reasoning and Acting in Language Models" — Yao et al., 2022.** The paper that seeded the loop; read it to answer lineage questions and to show students how recent this all is.
3. **MCP specification — modelcontextprotocol.io.** Skim the architecture page and the tools/resources/prompts primitives; 30 minutes makes you unshakeable on every "is MCP just X?" question.
4. **"How We Built Our Multi-Agent Research System" — Anthropic (2025) *paired with* "Don't Build Multi-Agents" — Cognition (2025).** The two posts disagree, and the disagreement IS the lesson: parallel-independent fan-out works, chained hand-offs lose context. Reading both arms you for any multi-agent argument a professor starts.
5. **Gemini function-calling docs — ai.google.dev.** The exact wire format from §2.3 (functionDeclarations, functionCall, functionResponse), parallel calls, and forced tool choice — your reference if a student's notebook emits something unexpected.
6. **"Toolformer: Language Models Can Teach Themselves to Use Tools" — Schick et al., 2023.** How tool-use ability gets INTO the weights via training data — the mechanism behind "it's trained to emit calls," one level below this deck.
