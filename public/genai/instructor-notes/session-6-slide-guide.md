# Session 6 — Slide-by-Slide Cheat Sheet

### Session 6 · Breaking, Securing, Shipping · 21 slides · 2:00 total

Attack, then defend, then ship. Ends the course, so protect the capstone demos.

One card per slide, generated from `presentations/session-6-breaking-securing-shipping.html` itself, so nothing here can drift from what is on screen. **#** is the deck position — it matches the `21 / 21` counter in the footer and the `#21` deep link. **Badge** is the number printed in the slide’s top-left corner; the two differ because title and lab slides are not badged. Press **S** in the deck for the same notes with a live timer.

**`trim`** marks a slide the deck itself flags **compressible** — press S and you will see `▸ compressible` on it. These are the first things to shorten when you are behind, not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** to open it, and only open it if the room asks.

---

## At a glance

| At | # | Badge | Slide | Budget | |
|---|---|---|---|---|---|
| 0:00 | 1 | — | Breaking it, securing it, shipping it | 1 min |  |
| 0:01 | 2 | 01 | Everything, in 90 seconds | 2 min |  |
| 0:03 | 3 | 02 | For five sessions you built. Now: think like an attacker. | 1.5 min |  |
| 0:04 | 4 | 03 | Prompt injection: data becomes commands | 3 min |  |
| 0:08 | 5 | 04 | Indirect injection: the document attacks your RAG | 3 min |  |
| 0:10 | 6 | 05 | Jailbreaks & leaks: the two quieter doors | 2.5 min |  |
| 0:13 | 7 | 06 | Defense in depth: no single fix, so layer them | 3.5 min | `D` |
| 0:16 | 8 | 07 | Keep a human on anything that bites | 2 min |  |
| 0:18 | 9 | — | There is no perfectly secure AI agent. Build one whose blast radius you can survive. | 1.5 min | `trim` |
| 0:20 | 10 | 08 | It works in Colab. Now make the assumptions visible. | 1.5 min |  |
| 0:22 | 11 | 09 | Cost: every token is a coin | 3 min | `D` |
| 0:24 | 12 | 10 | Fast, resilient, and observable — speed, reliability, observability | 2.5 min | `D` |
| 0:27 | 13 | 11 | UX patterns for honest AI products | 1.5 min | `trim` |
| 0:28 | 14 | 12 | Responsible AI: the four questions auditors now ask | 2 min | `trim` |
| 0:30 | 15 | 13 | Your users decide whose law you're under | 2.5 min | `trim` |
| 0:33 | 16 | 14 | The ship-it checklist | 2.5 min |  |
| 0:36 | 17 | 15 | Capstone: the sprint & the demo | 2 min |  |
| 0:38 | 18 | 16 | How to demo without dying | 2 min |  |
| 0:40 | 19 | 17 | Six sessions, one throughline | 76 min |  |
| 1:56 | 20 | 18 | Where to go from here | 2.5 min | `trim` |
| 1:58 | 21 | 19 | You came as users. You leave as builders. | 2 min |  |
| 2:00 | | | *end* | | |

---

## The cards

### 1 · Breaking it, securing it, shipping it

`#1` · `<|day_2_finale · generative_ai · foundations_&_applications|>` · **1 min** · at **0:00**

- **Run it** — The finale. Highest energy. ‘We attack everything you built, then defend it, then you demo.’

### 2 · Everything, in 90 seconds

`#2` · badge **01** · `<|final_recap · the_whole_weekend|>` · **2 min** · at **0:01**

- **On screen** — *True or false — no notes*
- **Run it** — **Final recap — the whole weekend.** No notes. Six fast T/F, one per session: S1 numbers, S2 evals, S3 multimodal, S4 grounding, S5 compounding, S6 tool results.

### 3 · For five sessions you built. Now: think like an attacker.

`#3` · badge **02** · `<|change_of_hat|>` · **1.5 min** · at **0:03**

- **Run it** — **Hat change — make it physical, pause.** ‘Five sessions you built. Now think like an attacker. Every capability is a surface.’

### 4 · Prompt injection: data becomes commands

`#4` · badge **03** · `<|live_attack · the_big_one|>` · **3 min** · at **0:04**

- **On screen** — *A support bot with a hidden system rule*; buttons: **Run the attack** · **Try another payload** · **Reset** · **Fire it**
- **Run it** — **CENTERPIECE. Run direct injection.** Bot makes a fake certificate. Let the room react. ‘No border between instructions and data. SQL injection reborn.’ Hit ‘Try another payload’ — injection is a family (override, roleplay, translation), not one gimmick.

### 5 · Indirect injection: the document attacks your RAG

`#5` · badge **04** · `<|live_attack · the_sneaky_one|>` · **3 min** · at **0:08**

- **On screen** — *Your Session-4 RAG bot retrieves a booby-trapped note*; buttons: **Retrieve & answer** · **Reset**
- **Run it** — **Run indirect injection — the scary one.** The payload is invisible in the chunk until you reveal it: ‘your RAG read what you couldn’t see.’ ‘Attacker never talks to your bot — this is the app you built this morning.’

### 6 · Jailbreaks & leaks: the two quieter doors

`#6` · badge **05** · `<|two_more,_fast|>` · **2.5 min** · at **0:10**

- **Run it** — Jailbreak + leak flips. Golden rule (now big on-screen): ‘never put anything in a prompt you couldn’t survive seeing on the front page.’

### 7 · Defense in depth: no single fix, so layer them

`#7` · badge **06** · `<|build_the_wall · toggle_each_layer|>` · **3.5 min** · at **0:13** · `D`

- **On screen** — *Same attack from slide 4, now vs your defenses*
- **Run it** — **CENTERPIECE. Toggle defense layers (equal weight now).** 0–2 layers the bot falls; 3–4 and it holds. ‘No single wall is perfect — four aren’t all weak at once.’ OWASP #1, no complete fix. **[D] deeper:** why there is no escape character in a token stream, and the three-legged framing — Simon Willison's 'lethal trifecta' (private data + untrusted content + a way out) — remove one leg and exfiltration dies. Strongest security idea in the course.
- **Depth `D`** — why filtering will never be the fix — and what is

### 8 · Keep a human on anything that bites

`#8` · badge **07** · `<|the_most_important_layer|>` · **2 min** · at **0:16**

- **Run it** — ‘Match trust to blast radius.’ Read-only relax, side-effects gate. Get this one dial right and most disasters never leave the building.

### 9 · There is no perfectly secure AI agent. Build one whose blast radius you can survive.

`#9` · `<|hot_take · argue_with_me|>` · **1.5 min** · at **0:18** · `trim`

- **On screen** — full-bleed hot take
- **Run it** — **Pick the fight deliberately.** Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 10 · It works in Colab. Now make the assumptions visible.

`#10` · badge **08** · `<|notebook → product|>` · **1.5 min** · at **0:20**

- **Run it** — ‘It works in Colab — now make the assumptions visible.’ The 20/80 bar makes it land: a demo runs once, for you, on one input. Five things change: cost, speed, reliability, security, observability.

### 11 · Cost: every token is a coin

`#11` · badge **09** · `<|live_demo · the_meter_is_always_running|>` · **3 min** · at **0:22** · `D`

- **On screen** — *Your RAG bot goes live at TCE — do the math*
- **Run it** — **Cost slider to 5000 users.** Watch $/month climb — and the jigarthanda line (‘N glasses a day’) makes it visceral. Then flip caching ON — watch input cost drop 90%; that’s the ‘cache repeated questions’ lever, real Gemini feature. Cheap-by-default: free local model for the boring 90%, API only for the hard 10%. **[D] deeper:** why output costs ~6× input (prefill vs decode), prefix caching, batch endpoints, and the cost-per-user formula that decides the architecture.
- **Depth `D`** — read the price list again — the two numbers aren't the same

### 12 · Fast, resilient, and observable — speed, reliability, observability

`#12` · badge **10** · `<|the_other_three|>` · **2.5 min** · at **0:24** · `D`

- **Run it** — Speed=stream (‘forgive slow, hate frozen’). Reliability=retries. Observability=log. ‘Your S2 evals become the regression test.’ **[D] deeper:** TTFT vs tokens/sec, p50 vs p99, retry jitter, idempotency, and exactly what to log.
- **Depth `D`** — measure the tail, not the average

### 13 · UX patterns for honest AI products

`#13` · badge **11** · `<|design_for_a_thing_that's_sometimes_wrong|>` · **1.5 min** · at **0:27** · `trim`

- **Run it** — UX for honest AI: sources, retry, uncertainty, escape-to-human. Design for a component that’s sometimes wrong.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 14 · Responsible AI: the four questions auditors now ask

`#14` · badge **12** · `<|the_four_questions|>` · **2 min** · at **0:28** · `trim`

- **Run it** — **Rename, don’t re-teach.** Every card points at something they DID. Faculty in the room: this slide is for them. EU AI Act + NIST AI RMF said once, precisely.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 15 · Your users decide whose law you're under

`#15` · badge **13** · `<|ship_across_a_border|>` · **2.5 min** · at **0:30** · `trim`

- **Run it** — **The globally-useful slide — go slowly, faculty care about this one.** Read the four cards fast, then land the rule: **you are judged where your USERS are, not where you are.** The EU reaches you through the output; the US has no single law but 'the AI decided' is not a defence; India's binding law is data protection, so ask *whose* data is in the context window; the Gulf's real constraint is data residency → callback to Ollama in S5. Close on the last line: they already built all four duties this weekend. **Say once, precisely:** dates move, this isn't legal advice, check the current text.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 16 · The ship-it checklist

`#16` · badge **14** · `<|tick_the_ones_your_capstone_has|>` · **2.5 min** · at **0:33**

- **Run it** — **Ship checklist, toggle honestly.** ‘The gaps are your roadmap, not your shame.’ Sets up lab Part D.

### 17 · Capstone: the sprint & the demo

`#17` · badge **15** · `<|~30 min build · ~35 min demos (3 min × your pairs)|>` · **2 min** · at **0:36**

- **Run it** — **Capstone brief.** ~30 min red-team+harden, then 3-min demos per pair (~35 min total). ‘The failure story matters more than the polish.’ **Links are on screen** — point at them.

### 18 · How to demo without dying

`#18` · badge **16** · `<|two_minutes_before_you_present|>` · **2 min** · at **0:38**

- **Run it** — Demo rules: pre-run, lead with the problem, show the failure. Critical — bad demos are avoidable.

### 19 · Six sessions, one throughline

`#19` · badge **17** · `<|look_how_far|>` · **76 min** · at **0:40**

- **Run it** — **This slot is the finale: 30-min red-team/harden sprint + ~35 min demos (3 min × pairs) + close — 76 min budgeted.** If there are more than 12 pairs, announce 60–90 s lightning demos *before* Part A starts, not at demo time. Only then the course close: the six-session spine — Predict → Measure → See → Know → Act → Ship, each verb igniting in its session’s colour. ‘You didn’t learn to use ChatGPT — you learned how these systems work, where they fail, and how to build safely.’ That’s the difference between a user and an engineer.

### 20 · Where to go from here

`#20` · badge **18** · `<|keep_going|>` · **2.5 min** · at **1:56** · `trim`

- **Run it** — **Where to go from here.** Ship it for real (Streamlit/Vercel — a live URL beats any certificate; key in secrets or an env var, never in the pushed notebook). Turn it into the final-year project: department RAG assistant + 100-question eval, measured against a simpler baseline, one attack + mitigation as the security chapter — 'here is the metric, here is the baseline, here is where it fails.' The meta-skill: you own the fundamentals under the buzzwords — tokens, evals, retrieval, tools, safety.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 21 · You came as users. You leave as builders.

`#21` · badge **19** · `<|that's_a_wrap|>` · **2 min** · at **1:58**

- **Run it** — **Thanks.** ‘You came as users. You leave as builders.’ ‘Knowing how to use ChatGPT expires next semester — knowing why it breaks compounds.’ Point to the repo they keep. ‘Ship something.’ **Links are on screen** — point at them.

---

*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: re-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*
