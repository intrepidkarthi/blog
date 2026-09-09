# Session 5 — Instructor Prep Pack

### Making AI Do Things · 23 slides · 2 hours

**What this file is.** The level under every slide. `session-5-notes.md` is the run sheet. Slide numbers are the deck's own, from `presentations/session-5-making-ai-do-things.html`.

**This is the anti-hype session.** The room arrives having heard "AI agents" everywhere. You are going to teach them tool use properly, then hand them the arithmetic that explains why most agent demos fail — using their own multiplication. Do not soften it and do not sneer at it; the honest number is more persuasive than either.

---

## 1 · The spine

1. **Your app is a brain in a jar** (3) — text in, text out, no hands.
2. **The model never executes anything; it writes requests** (4) — the trick, and the thread to Session 6.
3. **The description is the prompt** (6–7) — docstrings just became prompts.
4. **The loop nobody writes an exit for** (9–10) — impressive, and exactly where danger lives.
5. **Reliability compounds downward** (12–13) — this explains most failed agent demos.
6. **One question decides workflow or agent** (11, 15) — do you know the steps in advance?
7. **Cheapest fix first** (16–17) — and rung zero is "you didn't need AI".
8. **You can own the model** (18–20) — a trade, not a religion.

---

## 2 · Slide by slide

### Slides 1–3 · Opening; recap; brain in a jar · 6 min

**The move.** *"Your RAG app is a brain in a jar — text in, text out. Today we wire it to the world. Carefully."* The recap answers now advance on **your** click — let the room argue before you reveal. Then name the four disabilities: it cannot compute, cannot check today's date, cannot read a file, cannot email.

### Slide 4 · The model never executes anything. It writes requests · 2 min

**On screen.** The central trick of the session.

**The move.** **Read it twice.** The model writes a request; *your* code executes it. *"Control stays with you"* — and that sentence is the thread you pull all the way through Session 6.

**One level under.** If challenged, be precise: this is strictly true for tools **you** define and execute. Provider-side tools (code execution, search) run on their infrastructure, and that is a different trust boundary. Concede that distinction immediately — a sharp student will find it and you gain more by naming it first.

**Landmine.** Do not say "the model runs your function". It never does. The whole security posture of Session 6 rests on that sentence being exactly right.

### Slide 5 · One tool call, step by step · 5 min

**On screen.** The tool stepper, then a malicious run.

**The move.** Step through it. Stress **stage 3, validation** — *"the args parse as maths, not DROP TABLE."* Stage 5's wording is exact: it got it right **because it delegated**. Then run the malicious version: the model proposes, you dispose.

**One level under.** The four stages are declare, propose, validate, execute, return. Validation is the only stage the model cannot influence, which is why it is the one you teach hardest.

### Slides 6–7 · The description IS the prompt; MCP · 4.5 min · `trim` at 7 · `[D]`

**The move.** *"Docstrings just became prompts."* A vague docstring routes to the wrong tool — lab Stretch 3 proves it, so name that forward. Then MCP in one breath: they just hand-wrote a declaration; MCP is that, standardised. The USB-C line lands by itself. **Do not demo MCP** — name it and move.

**Depth panel `[D]` (slide 6).** *What the SDK is actually sending, and why it works at all.*

### Slides 8–10 · Which tool; the agent loop; five failures · 10.5 min · `[D]`

**On screen.** A tool-choice vote; a live agent log; five failure flips.

**The move.** On slide 8, item 4's correct answer is **no tool** — over-tooling is a failure, and voting for restraint is a maturity beat. Item 5 chains into the next slide. On 9, run the agent log and land the stat: **zero lines of if/else decided that order.** *"Impressive — and exactly where the danger lives."* On 10, flip four failures, and let the fifth, poisoned tool results, be the red card that bridges to Session 6: **tool results are untrusted input.**

**Depth panel `[D]` (slide 9).** *The loop condition nobody writes, and the score nobody keeps* — the trap is the naive `while response.wants_tool_call:` with nothing after it, whose only exit is the model deciding to stop; the on-slide sketch already carries the fix, `and steps < MAX_STEPS`, plus the allow-list and argument validation. Then: evaluate the trajectory, not just the destination.

**Landmine.** Do not let the agent log read as intelligence. The order emerged from a distribution, and slide 12 prices exactly what that costs.

### Slides 11–13 · Workflow vs agent; why chains collapse; multi-agent · 9.5 min · `trim` at 13

**On screen.** The distinction; the reliability slider; the multi-agent anti-hype slide.

**The move.** Slide 11 is **the takeaway of the session** — say the distinction slowly, then the idli line, and let it land. Slide 12 is the centrepiece: drag the reliability slider. At 95% per step, ten steps is about **60%**. *"This explains most failed agent demos."* At 99%, twenty steps is 82%. Then run the Monte-Carlo agent three times and let it die at a different step each time. On 13, ask the room first: two 90%-reliable agents talking — what is the joint reliability? **81% before any work happens.** Then name the legitimate pattern: parallel fan-out plus a judge.

**One level under.** The arithmetic is verified: 0.95¹⁰ = 0.5987, 0.95²⁰ = 0.3585, 0.99²⁰ = 0.8179. Write one of them on the board rather than only showing the slider — students trust chalk.

**Hardest question.** *"But agents work in demos."* — Demos are short chains under supervision. The compounding is a property of chain length, and it is why production systems shorten chains rather than lengthen them.

### Slides 14–17 · The fight; one question; the ladder; defend your vote · 11.5 min · `trim` at 14

**The move.** Slide 14 is the hot take — once, slowly, three seconds, one counter-argument, park the rest. Slide 15 gives the single decision rule: **do you know the steps in advance?** Yes is a workflow, and that is most real business AI by a wide margin; no is an agent with a leash. Then the escalation ladder, clicking each rung, and the rule that governs it: escalate only when your **eval** says the cheap rung failed. Fine-tuning is rung five, never rung one. Slide 17 is effectively the exam — students vote and defend; item 5, the capital of France, is **rung zero**, because over-engineering is a failure mode too.

### Slides 18–20 · API vs owned; Ollama; the trade · 7.5 min · `trim` at 18 and 20 · `[D]`

**The move.** Frame it with their own future: in fintech or KYC work, regulators ask where prompts go. Then **turn the Wi-Fi off** and run a local model live. *"Four billion knobs, on this laptop, no meter."* Then land slide 20: local versus API is an engineering trade, not a religion, and production is usually hybrid — API for the hard 10%, local for the routine 90%.

**Depth panel `[D]` (slide 19).** *Will it fit on my laptop? Arithmetic, not vibes* — parameters × bits ÷ 8.

**Landmine.** Have the model pulled **before** the session and verify it runs offline. This demo fails badly on college Wi-Fi if you rely on a download.

### Slides 21–23 · Six ideas; Lab 5; the close · 63.5 min

**The move.** Recall flips with a cold-call — point at a student, they answer, *then* you flip. Then the lab: nudge strong pairs to the stretch, because RAG-as-a-tool is where the capstone assembles itself. Part C's manual loop is what demystifies the whole thing; checkpoint 3 is verbal. Close with show and tell: best "called both tools", best scenario defence, and name the strongest counter-argument to slide 14.

**Lab shape:** A calculator tool (12) · B two tools chained (12) · C see the machinery (8) · D scenario cards, paper and pen (10).

---

## 3 · The depth layer in this deck

| Slide | Panel | Open it when |
|---|---|---|
| 6 | What the SDK is actually sending | someone asks how the model "knows" the function |
| 9 | The loop condition nobody writes, and the score nobody keeps | someone asks how an agent decides to stop |
| 19 | Will it fit on my laptop? — params × bits ÷ 8 | someone asks what hardware they need |

---

## 4 · Q&A bank

**"Is this what AutoGPT was?"** — Yes, and it is why AutoGPT disappointed. Slide 12 is the reason, in one multiplication.

**"Can the model call a tool I didn't give it?"** — No. It can only propose from the declared menu, and your code decides whether to run it. That is the whole safety story.

**"Should I use LangChain?"** — Not to learn this. Write the loop once by hand — Part C — and then decide whether a framework is buying you anything.

**"How many tools is too many?"** — When the model starts choosing wrong, which your eval tells you. Over-tooling is slide 8, item 4.

**"Is a multi-agent system better?"** — Usually worse, and the arithmetic on slide 13 is why. Fan-out plus a judge is the pattern that survives.

---

## 5 · Misconceptions

| They believe | Say this |
|---|---|
| The model executes code | It writes a request; your code executes (4) |
| Agents are the default architecture | One question decides, and the answer is usually workflow (15) |
| More agents means more capability | Two 90% agents are 81% before doing anything (13) |
| Tool output is trustworthy | Tool results are untrusted input — the Session 6 bridge (10) |
| Local models are toys | It is a trade, not a religion; production is hybrid (20) |

---

## 6 · Timing pressure map

Budgets total 120 minutes including a 50-minute lab. **Tight.**

Cut in this order: slide 8 (three items, not five) · slide 21 recall flips · slide 17 (two items, not five).

Never compress: slide 4 (read twice), slide 12 (the slider and the Monte-Carlo run), slide 15 (the decision rule).

The deck flags slides 7, 13, 14, 18 and 20 **compressible** (press **S** to see the marker).

---

## 7 · Day-before checklist

**Pull the local model and test it with Wi-Fi off.** This is the one demo that cannot be recovered live. Run the reliability slider and be able to state 0.95¹⁰ ≈ 60% without looking. Run the agent log until you have seen it choose a different order. Open the lab notebook and run the two-tool chain end to end. Confirm automatic function calling still behaves on the pinned model — `fact-check.md`.
