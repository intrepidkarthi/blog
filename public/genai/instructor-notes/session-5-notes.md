# Session 5 — Run Sheet

### Making AI Do Things · 23 slides · 2:00 total

**Delivery-day document.** The concepts are in `session-5-prep.md`; this is the clock. 
The anti-hype session. The reliability slider does the persuading; you just have to not rush it.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | Making AI do things | 1 min |  |
| 0:01 | 2 | Still true after lunch? | 3 min |  |
| 0:04 | 3 | Your RAG app is a brain in a jar | 2 min |  |
| 0:06 | 4 | The model never executes anything. It writes requests. Your code executes. | 2 min |  |
| 0:08 | 5 | One tool call, step by step | 5 min |  |
| 0:13 | 6 | Function declarations: the description IS the prompt | 3 min | `D` |
| 0:16 | 7 | MCP: USB-C for tools | 1.5 min | `trim` |
| 0:18 | 8 | Which tool should it call? | 4 min |  |
| 0:22 | 9 | The agent loop: while it wants tools, feed it | 3 min | `D` |
| 0:24 | 10 | Five ways tool use goes sideways | 3.5 min |  |
| 0:28 | 11 | Most problems don't need an agent. They need a boring workflow. | 2.5 min |  |
| 0:30 | 12 | Why long agent chains collapse | 5 min |  |
| 0:36 | 13 | Multi-agent: more agents, more compounding | 2 min | `trim` |
| 0:38 | 14 | Most production “AI agents” are a while-loop in a trench coat. | 1.5 min | `trim` |
| 0:39 | 15 | Workflow or agent? One question decides | 2.5 min |  |
| 0:42 | 16 | The escalation ladder: cheapest fix first | 3.5 min |  |
| 0:45 | 17 | Right approach? Defend your vote | 4 min |  |
| 0:49 | 18 | API models vs models you own | 2 min | `trim` |
| 0:51 | 19 | Ollama: a model in your pocket | 4 min | `D` |
| 0:55 | 20 | Local vs API: an engineering trade, not a religion | 1.5 min | `trim` |
| 0:56 | 21 | Six ideas you own now | 3 min |  |
| 1:00 | 22 | Lab 5: give it hands | 50 min |  |
| 1:50 | 23 | Your AI knows, sees, and now acts. | 10.5 min |  |
| 2:00 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · Making AI do things** — ‘Your RAG app is a brain in a jar — text in, text out. Today we wire it to the world. Carefully.’

**0:01 · 2 · Still true after lunch?** — Recap quiz. Reinforces embeddings + grounding from this morning. Answers advance on YOUR click now — let them argue first.

**0:04 · 3 · Your RAG app is a brain in a jar** — Brain in a jar: can’t compute, can’t check today, can’t read a file, can’t email. Text in, text out.

**0:06 · 4 · The model never executes anything. It writes requests. Your code executes.** — THE trick, read twice. Model writes requests; YOUR code executes. ‘Control stays with you’ — the thread to Session 6. If challenged: strictly true for tools YOU define — providers also offer hosted tools (code execution, search) that run on THEIR servers. Same request-based principle, different executor.

**0:08 · 5 · One tool call, step by step** — Tool stepper. Step through; stress stage 3 (validate ‘args parse as math, not DROP TABLE’). Stage 5 exact ‘because it delegated.’ Then the malicious run: the model proposes, your code disposes — plant the Session 6 seed.

**0:13 · 6 · Function declarations: the description IS the prompt** — ‘Docstrings just became prompts.’ Vague docstring → wrong tool. (Lab Stretch 3 proves it.) Name-drop MCP: the standardized menu format — same idea, industry-wide. [D] deeper: the JSON schema the SDK actually sends, the four message roles, parallel tool calls, and why tool results eat your context budget.

**0:16 · 7 · MCP: USB-C for tools** — One breath. They just hand-wrote a declaration — MCP is that, standardized. USB-C line lands by itself. Don't demo; name it and move.

**0:18 · 8 · Which tool should it call?** — GAME. Vote each tool. Item 4 = NO tool (maturity: over-tooling is a failure). Item 5 = chain → next slide. You control the pace — click advances.

**0:22 · 9 · The agent loop: while it wants tools, feed it** — Run agent log. ‘Model chose the order — nobody scripted it. Impressive, and exactly where danger lives.’ Land the stat line: 0 lines of if/else deciding the order. [D] deeper: the missing loop guard (max steps + allow-list + arg validation), context growth over a long run, and trajectory eval: tool-choice accuracy, step count, wasted calls.

**0:24 · 10 · Five ways tool use goes sideways** — Five failure flips. Flip 4; the 5th (poisoned tool results) is the red card — Session 6 bridge. ‘Tool results are untrusted input.’

**0:28 · 11 · Most problems don't need an agent. They need a boring workflow.** — THE takeaway. Workflow (you fix steps) vs agent (model picks). Say the distinction slowly, then the idli line — let it land.

**0:30 · 12 · Why long agent chains collapse** — CENTERPIECE. Reliability slider. 95%→10 steps≈60%. ‘This explains most failed agent demos.’ 99%→20 = 82%. Then run the Monte-Carlo agent three times — it dies at a different step each run. Let them feel it.

**0:36 · 13 · Multi-agent: more agents, more compounding** — Anti-hype with their own math. Ask the room: two 90%-reliable agents chatting — reliability? 81% before any work happens. Parallel fan-out + judge = the legit pattern.

**0:38 · 14 · Most production “AI agents” are a while-loop in a trench coat.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.

**0:39 · 15 · Workflow or agent? One question decides** — One question decides: do you know the steps in advance? Yes=workflow (most real business AI, by a wide margin). No=agent with a leash.

**0:42 · 16 · The escalation ladder: cheapest fix first** — Ladder, click each rung. Escalate only when your EVAL says the cheap rung failed. Fine-tune is rung 5, never rung 1.

**0:45 · 17 · Right approach? Defend your vote** — GAME = the exam. Vote + defend. Item 5 (capital of France) = rung ZERO. Over-engineering is a failure mode too. Click advances — pace the argument.

**0:49 · 18 · API models vs models you own** — API vs local: privacy, cost, offline. Your fintech/KYC reality: regulators ask where prompts go.

**0:51 · 19 · Ollama: a model in your pocket** — OLLAMA — Wi-Fi OFF, run live: ollama run gemma4:e4b (gemma3:4b still works). ‘4 billion knobs, on this laptop, no meter.’ 8GB RAM runs it at home — no 8 GB machine? Same model in a free Colab runtime. If the live demo sulks, run the typing race — and call it a simulation. [D] deeper: params × bits ÷ 8 — will it fit? Plus KV-cache headroom and why memory bandwidth, not compute, sets tokens/sec.

**0:55 · 20 · Local vs API: an engineering trade, not a religion** — Local vs API = a trade, not a religion. Production = hybrid: API for hard 10%, local for routine 90%.

**0:56 · 21 · Six ideas you own now** — Recall flips. Class says each before clicking. ‘Pick one for me’ = cold-call: point at a student, they answer, THEN flip.

**1:00 · 22 · Lab 5: give it hands** — 2 min brief, then 50 MIN LAB. Nudge strong pairs to Stretch (RAG-as-tool = capstone assembles itself). Part C manual loop de-mystifies. Checkpoint 3 is verbal. Links are on screen — point at them.

**1:50 · 23 · Your AI knows, sees, and now acts.** — Show & tell + last break (10.5 min). Best ‘called both tools’ + best scenario defense + name the strongest hot-take counter-argument. ‘Knows, sees, acts. Finale: we break it all.’ Bring the notebook. Links are on screen — point at them.

---

## The lab hour

Slide 22, 50 minutes. Two-minute brief, then hands off.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Nudge the strong pairs toward RAG-as-a-tool; that is where the capstone assembles itself.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the opening of the next block.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
