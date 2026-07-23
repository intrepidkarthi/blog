# Session 6 — Breaking, Securing, Shipping · Run Sheet

> Deep prep: work through `session-6-prep.md` first — this file is delivery-day only.

> Prep with `session-6-prep.md`. **Deck:** `session-6-breaking-securing-shipping.html` (20 slides, 7 interactives). The finale — highest energy, ends with student demos. Timing is different: shorter talk, long demo block.

## Timing

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:05 | Final recap quiz | 1–2 |
| 0:05–0:30 | Attacks (3–6) → defense (7–8) | 3–8 |
| 0:30–0:48 | Shipping: cost/speed/reliability/UX/checklist | 9–13 |
| 0:48–0:52 | Capstone brief + demo rules | 14–15 |
| 0:52–1:22 | **Lab 6 Parts A–D** (attack, harden, red-team, audit) | — |
| 1:22–1:55 | **Capstone demos** — every pair, 3 min | — |
| 1:55–2:00 | Course close (arc, what's next, thanks) | 16–18 |

This session compresses talk to ~43 min to protect the demo block. If demos run long, cut slides 16–17 to one sentence each and go straight to slide 18.

## Slide beats

**3 · The turn.** "For five sessions you built. Now think like an attacker." Hat change — make it physical, literal pause.

**4 · Direct injection (3 min, centerpiece).** Run it. The bot cheerfully makes a fake certificate. Let the room react. "It has no border between instructions and data. This is SQL injection reborn — harder, because language has no escape character."

**5 · Indirect injection (3 min).** THE scary one. "The attacker never talks to your bot — they poison a document your RAG retrieves. This is the app you built this morning. Your capstone is vulnerable right now." Personal stakes = attention.

**6 · Jailbreak + leak.** Two flips. Land the golden rule: "never put anything in a prompt you couldn't survive on the front page."

**7 · Defense (4 min, centerpiece).** Toggle layers live. With 0-1 layers the bot falls; at 3-4 it holds. "No single wall is perfect — but four aren't all weak at once. Defense in depth." OWASP #1, no complete fix — honesty.

**8 · Human loop.** "Match trust to blast radius." Read-only relax, side-effects gate. The one principle that prevents most disasters.

**10 · Cost (3 min).** Drag users to 5000, watch $/month climb. "Every token is a coin. Cost is an architecture decision — this is why you ship the cheap local model for the boring 90%." (S5 callback.)

**11 · Speed/reliability/observability.** Streaming = "users forgive slow, they hate frozen." And the payoff: "your S2 evals become the regression test."

**13 · Ship checklist (3 min).** Toggle honestly against a hypothetical. "The gaps are your roadmap, not your shame." Sets up lab Part D.

**14 · Capstone brief.** Read the structure clearly: 30 min red-team+harden, then 3-min demos. "The failure story matters more than the polish."

**15 · Demo rules.** Pre-run, lead with problem, show the failure. Critical — bad demos are avoidable.

## Lab + demo block — your job

- **Parts A–B (attack/harden) ~16 min:** everyone breaks the naive bot, then hardens. Keep it fast — the real event is red-teaming.
- **Part C red-team ~12 min:** enforce the laptop swap. The indirect-injection-via-poisoned-document is the moment — make sure pairs actually try it. Keep it good-natured (find holes, don't trash each other's work).
- **Part D self-audit ~5 min:** honest checklist scoring.
- **Demos (~33 min):** hard-cap 3 min each with a visible timer. ~10 pairs = tight. Enforce the three-part structure (does / one failure / one fix). Applaud every team. Note grades live against the rubric (working 40 / eval 25 / failure 15 / fit 10 / presentation 10).

If class is large (>12 pairs): demo in two parallel rooms, or pre-select via a 1-line pitch, or extend into a short overflow. Decide before the session.

## Course close (1:55–2:00)

Slide 16 (the six-session arc) → 17 (what's next: ship it, go deeper, the meta-skill) → 18 (thanks). Land it: "You came as users. You leave as builders." Mean it — they earned it. Point them to the repo they keep.

## Anticipated questions

**"Is there a real fix for prompt injection?"** — No complete one — it's an open research problem and OWASP's #1 LLM risk. Defense in depth reduces it: privilege separation, delimiting, output checks, human gates. Anyone selling a "100% safe" filter is selling. Honesty is the lesson.

**"Are the frontier models already safe from these?"** — Much better than 2023, and labs patch known jailbreaks continuously — but novel framings keep working, and YOUR app's system prompt is a fresh surface. Model safety ≠ your app's safety.

**"How do real companies handle this?"** — Layered: least-privilege tools, human approval on side-effects, allow-lists, monitoring/logging, red-team teams, and accepting residual risk consciously. Same defense-in-depth you just toggled.

**"What does deploying actually cost / how do I put it online?"** — Free tiers get a student capstone live: Streamlit Community Cloud or Vercel + a serverless function; keep the API key server-side (never in client code). Point them there in office hours.

**"Which capstone should win?"** — Reward honest evals and a real failure-and-fix over a flashy fragile demo. Say this out loud before demos so they optimize for the right thing.
