# Session 6 — Run Sheet

### Breaking It, Securing It, Shipping It · 21 slides · 2:00 total

**Delivery-day document.** The concepts are in `session-6-prep.md`; this is the clock. 
The finale. Slide 19 is a 76-minute block (30-min sprint + ~35-min demos + close), not a slide. Demos overrun unless you hold the clock; more than 12 pairs means 60–90 s lightning demos, announced before Part A.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | Breaking it, securing it, shipping it | 1 min |  |
| 0:01 | 2 | Everything, in 90 seconds | 2 min |  |
| 0:03 | 3 | For five sessions you built. Now: think like an attacker. | 1.5 min |  |
| 0:04 | 4 | Prompt injection: data becomes commands | 3 min |  |
| 0:08 | 5 | Indirect injection: the document attacks your RAG | 3 min |  |
| 0:10 | 6 | Jailbreaks & leaks: the two quieter doors | 2.5 min |  |
| 0:13 | 7 | Defense in depth: no single fix, so layer them | 3.5 min | `D` |
| 0:16 | 8 | Keep a human on anything that bites | 2 min |  |
| 0:18 | 9 | There is no perfectly secure AI agent. Build one whose blast radius you can survive. | 1.5 min | `trim` |
| 0:20 | 10 | It works in Colab. Now make the assumptions visible. | 1.5 min |  |
| 0:22 | 11 | Cost: every token is a coin | 3 min | `D` |
| 0:24 | 12 | Fast, resilient, and observable — speed, reliability, observability | 2.5 min | `D` |
| 0:27 | 13 | UX patterns for honest AI products | 1.5 min | `trim` |
| 0:28 | 14 | Responsible AI: the four questions auditors now ask | 2 min | `trim` |
| 0:30 | 15 | Your users decide whose law you're under | 2.5 min | `trim` |
| 0:33 | 16 | The ship-it checklist | 2.5 min |  |
| 0:36 | 17 | Capstone: the sprint & the demo | 2 min |  |
| 0:38 | 18 | How to demo without dying | 2 min |  |
| 0:40 | 19 | Six sessions, one throughline | 76 min |  |
| 1:56 | 20 | Where to go from here | 2.5 min | `trim` |
| 1:58 | 21 | You came as users. You leave as builders. | 2 min |  |
| 2:00 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · Breaking it, securing it, shipping it** — The finale. Highest energy. ‘We attack everything you built, then defend it, then you demo.’

**0:01 · 2 · Everything, in 90 seconds** — Final recap — the whole weekend. No notes. Six fast T/F, one per session: S1 numbers, S2 evals, S3 multimodal, S4 grounding, S5 compounding, S6 tool results.

**0:03 · 3 · For five sessions you built. Now: think like an attacker.** — Hat change — make it physical, pause. ‘Five sessions you built. Now think like an attacker. Every capability is a surface.’

**0:04 · 4 · Prompt injection: data becomes commands** — CENTERPIECE. Run direct injection. Bot makes a fake certificate. Let the room react. ‘No border between instructions and data. SQL injection reborn.’ Hit ‘Try another payload’ — injection is a family (override, roleplay, translation), not one gimmick.

**0:08 · 5 · Indirect injection: the document attacks your RAG** — Run indirect injection — the scary one. The payload is invisible in the chunk until you reveal it: ‘your RAG read what you couldn’t see.’ ‘Attacker never talks to your bot — this is the app you built this morning.’

**0:10 · 6 · Jailbreaks & leaks: the two quieter doors** — Jailbreak + leak flips. Golden rule (now big on-screen): ‘never put anything in a prompt you couldn’t survive seeing on the front page.’

**0:13 · 7 · Defense in depth: no single fix, so layer them** — CENTERPIECE. Toggle defense layers (equal weight now). 0–2 layers the bot falls; 3–4 and it holds. ‘No single wall is perfect — four aren’t all weak at once.’ OWASP #1, no complete fix. [D] deeper: why there is no escape character in a token stream, and the three-legged framing — Simon Willison's 'lethal trifecta' (private data + untrusted content + a way out) — remove one leg and exfiltration dies. Strongest security idea in the course.

**0:16 · 8 · Keep a human on anything that bites** — ‘Match trust to blast radius.’ Read-only relax, side-effects gate. Get this one dial right and most disasters never leave the building.

**0:18 · 9 · There is no perfectly secure AI agent. Build one whose blast radius you can survive.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.

**0:20 · 10 · It works in Colab. Now make the assumptions visible.** — ‘It works in Colab — now make the assumptions visible.’ The 20/80 bar makes it land: a demo runs once, for you, on one input. Five things change: cost, speed, reliability, security, observability.

**0:22 · 11 · Cost: every token is a coin** — Cost slider to 5000 users. Watch $/month climb — and the jigarthanda line (‘N glasses a day’) makes it visceral. Then flip caching ON — watch input cost drop 90%; that’s the ‘cache repeated questions’ lever, real Gemini feature. Cheap-by-default: free local model for the boring 90%, API only for the hard 10%. [D] deeper: why output costs ~6× input (prefill vs decode), prefix caching, batch endpoints, and the cost-per-user formula that decides the architecture.

**0:24 · 12 · Fast, resilient, and observable — speed, reliability, observability** — Speed=stream (‘forgive slow, hate frozen’). Reliability=retries. Observability=log. ‘Your S2 evals become the regression test.’ [D] deeper: TTFT vs tokens/sec, p50 vs p99, retry jitter, idempotency, and exactly what to log.

**0:27 · 13 · UX patterns for honest AI products** — UX for honest AI: sources, retry, uncertainty, escape-to-human. Design for a component that’s sometimes wrong.

**0:28 · 14 · Responsible AI: the four questions auditors now ask** — Rename, don’t re-teach. Every card points at something they DID. Faculty in the room: this slide is for them. EU AI Act + NIST AI RMF said once, precisely.

**0:30 · 15 · Your users decide whose law you're under** — The globally-useful slide — go slowly, faculty care about this one. Read the four cards fast, then land the rule: you are judged where your USERS are, not where you are. The EU reaches you through the output; the US has no single law but 'the AI decided' is not a defence; India's binding law is data protection, so ask whose data is in the context window; the Gulf's real constraint is data residency → callback to Ollama in S5. Close on the last line: they already built all four duties this weekend. Say once, precisely: dates move, this isn't legal advice, check the current text.

**0:33 · 16 · The ship-it checklist** — Ship checklist, toggle honestly. ‘The gaps are your roadmap, not your shame.’ Sets up lab Part D.

**0:36 · 17 · Capstone: the sprint & the demo** — Capstone brief. ~30 min red-team+harden, then 3-min demos per pair (~35 min total). ‘The failure story matters more than the polish.’ Links are on screen — point at them.

**0:38 · 18 · How to demo without dying** — Demo rules: pre-run, lead with the problem, show the failure. Critical — bad demos are avoidable.

**0:40 · 19 · Six sessions, one throughline** — This slot is the finale: 30-min red-team/harden sprint + ~35 min demos (3 min × pairs) + close — 76 min budgeted. If there are more than 12 pairs, announce 60–90 s lightning demos before Part A starts, not at demo time. Only then the course close: the six-session spine — Predict → Measure → See → Know → Act → Ship, each verb igniting in its session’s colour. ‘You didn’t learn to use ChatGPT — you learned how these systems work, where they fail, and how to build safely.’ That’s the difference between a user and an engineer.

**1:56 · 20 · Where to go from here** — Where to go from here. Ship it for real (Streamlit/Vercel — a live URL beats any certificate; key in secrets or an env var, never in the pushed notebook). Turn it into the final-year project: department RAG assistant + 100-question eval, measured against a simpler baseline, one attack + mitigation as the security chapter — 'here is the metric, here is the baseline, here is where it fails.' The meta-skill: you own the fundamentals under the buzzwords — tokens, evals, retrieval, tools, safety.

**1:58 · 21 · You came as users. You leave as builders.** — Thanks. ‘You came as users. You leave as builders.’ ‘Knowing how to use ChatGPT expires next semester — knowing why it breaks compounds.’ Point to the repo they keep. ‘Ship something.’ Links are on screen — point at them.

---

## The lab hour

Slide 19, 76 minutes: 30-minute red-team/harden sprint, ~35 minutes of demos (3 min × pairs; 60–90 s lightning demos if more than 12 pairs — announced before Part A), then the close. Two-minute brief, then hands off. A pair whose app does not run can still score up to ~50 on a real eval set, failure analysis and hardening story — say that before demos start.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Hold demos to 3 minutes each. The failure story is the graded part.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the post-weekend stretch.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
