# Session 5 — Slide-by-Slide Cheat Sheet

### Session 5 · Making AI Do Things · 23 slides · 2:00 total

The session where the room wants to build agents and the job is to teach them when not to.

One card per slide, generated from `presentations/session-5-making-ai-do-things.html` itself, so nothing here can drift from what is on screen. **#** is the deck position — it matches the `23 / 23` counter in the footer and the `#23` deep link. **Badge** is the number printed in the slide’s top-left corner; the two differ because title and lab slides are not badged. Press **S** in the deck for the same notes with a live timer.

**`trim`** marks a slide the deck itself flags **compressible** — press S and you will see `▸ compressible` on it. These are the first things to shorten when you are behind, not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** to open it, and only open it if the room asks.

---

## At a glance

| At | # | Badge | Slide | Budget | |
|---|---|---|---|---|---|
| 0:00 | 1 | — | Making AI do things | 1 min |  |
| 0:01 | 2 | 01 | Still true after lunch? | 3 min |  |
| 0:04 | 3 | 02 | Your RAG app is a brain in a jar | 2 min |  |
| 0:06 | 4 | 03 | The model never executes anything. It writes requests. Your code executes. | 2 min |  |
| 0:08 | 5 | 04 | One tool call, step by step | 5 min |  |
| 0:13 | 6 | 05 | Function declarations: the description IS the prompt | 3 min | `D` |
| 0:16 | 7 | 06 | MCP: USB-C for tools | 1.5 min | `trim` |
| 0:18 | 8 | 07 | Which tool should it call? | 4 min |  |
| 0:22 | 9 | 08 | The agent loop: while it wants tools, feed it | 3 min | `D` |
| 0:24 | 10 | 09 | Five ways tool use goes sideways | 3.5 min |  |
| 0:28 | 11 | 10 | Most problems don't need an agent. They need a boring workflow. | 2.5 min |  |
| 0:30 | 12 | 11 | Why long agent chains collapse | 5 min |  |
| 0:36 | 13 | 12 | Multi-agent: more agents, more compounding | 2 min | `trim` |
| 0:38 | 14 | — | Most production “AI agents” are a while-loop in a trench coat. | 1.5 min | `trim` |
| 0:39 | 15 | 13 | Workflow or agent? One question decides | 2.5 min |  |
| 0:42 | 16 | 14 | The escalation ladder: cheapest fix first | 3.5 min |  |
| 0:45 | 17 | 15 | Right approach? Defend your vote | 4 min |  |
| 0:49 | 18 | 16 | API models vs models you own | 2 min | `trim` |
| 0:51 | 19 | 17 | Ollama: a model in your pocket | 4 min | `D` |
| 0:55 | 20 | 18 | Local vs API: an engineering trade, not a religion | 1.5 min | `trim` |
| 0:56 | 21 | 19 | Six ideas you own now | 3 min |  |
| 1:00 | 22 | 20 | Lab 5: give it hands | 50 min |  |
| 1:50 | 23 | 21 | Your AI knows, sees, and now acts. | 10.5 min |  |
| 2:00 | | | *end* | | |

---

## The cards

### 1 · Making AI do things

`#1` · `<|session_05/06 · day_2|>` · **1 min** · at **0:00**

- **Run it** — ‘Your RAG app is a brain in a jar — text in, text out. Today we wire it to the world. Carefully.’

### 2 · Still true after lunch?

`#2` · badge **01** · `<|90_second_recap|>` · **3 min** · at **0:01**

- **On screen** — *True or false*
- **Run it** — **Recap quiz.** Reinforces embeddings + grounding from this morning. Answers advance on YOUR click now — let them argue first.

### 3 · Your RAG app is a brain in a jar

`#3` · badge **02** · `<|the_limitation|>` · **2 min** · at **0:04**

- **Run it** — Brain in a jar: can’t compute, can’t check today, can’t read a file, can’t email. Text in, text out.

### 4 · The model never executes anything. It writes requests. Your code executes.

`#4` · badge **03** · `<|the_trick · read_it_twice|>` · **2 min** · at **0:06**

- **Run it** — **THE trick, read twice.** Model writes requests; YOUR code executes. ‘Control stays with you’ — the thread to Session 6. If challenged: strictly true for tools YOU define — providers also offer hosted tools (code execution, search) that run on THEIR servers. Same request-based principle, different executor.

### 5 · One tool call, step by step

`#5` · badge **04** · `<|live_demo · drive_the_loop|>` · **5 min** · at **0:08**

- **On screen** — *"What's 18% GST on ₹2,347?" — the question that broke Session 1*; buttons: **Step →** · **Try a malicious call** · **Reset**
- **Run it** — **Tool stepper.** Step through; stress stage 3 (validate ‘args parse as math, not DROP TABLE’). Stage 5 exact ‘because it delegated.’ Then the malicious run: the model proposes, your code disposes — plant the Session 6 seed.

### 6 · Function declarations: the description IS the prompt

`#6` · badge **05** · `<|teaching_it_the_menu|>` · **3 min** · at **0:13** · `D`

- **Run it** — ‘Docstrings just became prompts.’ Vague docstring → wrong tool. (Lab Stretch 3 proves it.) Name-drop MCP: the standardized menu format — same idea, industry-wide. **[D] deeper:** the JSON schema the SDK actually sends, the four message roles, parallel tool calls, and why tool results eat your context budget.
- **Depth `D`** — what the SDK is actually sending, and why it works at all

### 7 · MCP: USB-C for tools

`#7` · badge **06** · `<|the_standard_plug|>` · **1.5 min** · at **0:16** · `trim`

- **Run it** — **One breath.** They just hand-wrote a declaration — MCP is that, standardized. USB-C line lands by itself. Don't demo; name it and move.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 8 · Which tool should it call?

`#8` · badge **07** · `<|think_like_the_model · vote_first|>` · **4 min** · at **0:18**

- **On screen** — *Menu: calculator · web_search · read_file · (or no tool at all)*
- **Run it** — **GAME. Vote each tool.** Item 4 = NO tool (maturity: over-tooling is a failure). Item 5 = chain → next slide. You control the pace — click advances.

### 9 · The agent loop: while it wants tools, feed it

`#9` · badge **08** · `<|live_demo · multiple_steps|>` · **3 min** · at **0:22** · `D`

- **On screen** — *"Read marks.csv — is my average above the class average of 71?"*; buttons: **Run agent**
- **Run it** — **Run agent log.** ‘Model chose the order — nobody scripted it. Impressive, and exactly where danger lives.’ Land the stat line: 0 lines of if/else deciding the order. **[D] deeper:** the missing loop guard (max steps + allow-list + arg validation), context growth over a long run, and trajectory eval: tool-choice accuracy, step count, wasted calls.
- **Depth `D`** — the loop condition nobody writes, and the score nobody keeps

### 10 · Five ways tool use goes sideways

`#10` · badge **09** · `<|guess_then_click|>` · **3.5 min** · at **0:24**

- **Run it** — **Five failure flips.** Flip 4; the 5th (poisoned tool results) is the red card — Session 6 bridge. ‘Tool results are untrusted input.’

### 11 · Most problems don't need an agent. They need a boring workflow.

`#11` · badge **10** · `<|the_honest_lesson|>` · **2.5 min** · at **0:28**

- **Run it** — **THE takeaway.** Workflow (you fix steps) vs agent (model picks). Say the distinction slowly, then the idli line — let it land.

### 12 · Why long agent chains collapse

`#12` · badge **11** · `<|live_demo · compounding_failure_curve|>` · **5 min** · at **0:30**

- **On screen** — *success = pn — drag per-step reliability*; buttons: **Run a 10-step agent** · **Run 100 agents**
- **Run it** — **CENTERPIECE. Reliability slider.** 95%→10 steps≈60%. ‘This explains most failed agent demos.’ 99%→20 = 82%. Then run the Monte-Carlo agent three times — it dies at a different step each run. Let them feel it.

### 13 · Multi-agent: more agents, more compounding

`#13` · badge **12** · `<|the_buzzword_check|>` · **2 min** · at **0:36** · `trim`

- **Run it** — **Anti-hype with their own math.** Ask the room: two 90%-reliable agents chatting — reliability? 81% before any work happens. Parallel fan-out + judge = the legit pattern.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 14 · Most production “AI agents” are a while-loop in a trench coat.

`#14` · `<|hot_take · argue_with_me|>` · **1.5 min** · at **0:38** · `trim`

- **On screen** — full-bleed hot take
- **Run it** — **Pick the fight deliberately.** Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 15 · Workflow or agent? One question decides

`#15` · badge **13** · `<|the_rule_of_thumb|>` · **2.5 min** · at **0:39**

- **Run it** — One question decides: do you know the steps in advance? Yes=workflow (most real business AI, by a wide margin). No=agent with a leash.

### 16 · The escalation ladder: cheapest fix first

`#16` · badge **14** · `<|click_each_rung|>` · **3.5 min** · at **0:42**

- **Run it** — **Ladder, click each rung.** Escalate only when your EVAL says the cheap rung failed. Fine-tune is rung 5, never rung 1.

### 17 · Right approach? Defend your vote

`#17` · badge **15** · `<|the_game_that_is_also_the_exam|>` · **4 min** · at **0:45**

- **On screen** — *Shout, vote, argue*
- **Run it** — **GAME = the exam.** Vote + defend. Item 5 (capital of France) = rung ZERO. Over-engineering is a failure mode too. Click advances — pace the argument.

### 18 · API models vs models you own

`#18` · badge **16** · `<|one_more_decision_axis|>` · **2 min** · at **0:49** · `trim`

- **Run it** — API vs local: privacy, cost, offline. Your fintech/KYC reality: regulators ask where prompts go.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 19 · Ollama: a model in your pocket

`#19` · badge **17** · `<|live_on_my_laptop · no_internet_after_download|>` · **4 min** · at **0:51** · `D`

- **On screen** — buttons: **Simulate the race**
- **Run it** — **OLLAMA — Wi-Fi OFF, run live:** ollama run gemma4:e4b (gemma3:4b still works). ‘4 billion knobs, on this laptop, no meter.’ 8GB RAM runs it at home — no 8 GB machine? Same model in a free Colab runtime. If the live demo sulks, run the typing race — and call it a simulation. **[D] deeper:** params × bits ÷ 8 — will it fit? Plus KV-cache headroom and why memory bandwidth, not compute, sets tokens/sec.
- **Depth `D`** — will it fit on my laptop? arithmetic, not vibes

### 20 · Local vs API: an engineering trade, not a religion

`#20` · badge **18** · `<|side_by_side|>` · **1.5 min** · at **0:55** · `trim`

- **Run it** — Local vs API = a trade, not a religion. Production = hybrid: API for hard 10%, local for routine 90%.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 21 · Six ideas you own now

`#21` · badge **19** · `<|say_it_before_you_click|>` · **3 min** · at **0:56**

- **On screen** — buttons: **Pick one for me**
- **Run it** — **Recall flips.** Class says each before clicking. ‘Pick one for me’ = cold-call: point at a student, they answer, THEN flip.

### 22 · Lab 5: give it hands

`#22` · badge **20** · `<|50_minutes · same_rhythm|>` · **50 min** · at **1:00**

- **Run it** — **2 min brief, then 50 MIN LAB.** Nudge strong pairs to Stretch (RAG-as-tool = capstone assembles itself). Part C manual loop de-mystifies. Checkpoint 3 is verbal. **Links are on screen** — point at them.

### 23 · Your AI knows, sees, and now acts.

`#23` · badge **21** · `<|last_break · finale_next|>` · **10.5 min** · at **1:50**

- **Run it** — **Show & tell + last break (10.5 min).** Best ‘called both tools’ + best scenario defense + name the strongest hot-take counter-argument. ‘Knows, sees, acts. Finale: we break it all.’ Bring the notebook. **Links are on screen** — point at them.

---

*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: re-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*
