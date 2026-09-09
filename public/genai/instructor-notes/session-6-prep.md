# Session 6 — Instructor Prep Pack

### Breaking It, Securing It, Shipping It · 21 slides · 2 hours

**What this file is.** The level under every slide. `session-6-notes.md` is the run sheet. Slide numbers are the deck's own, from `presentations/session-6-breaking-securing-shipping.html`.

**This is the finale, and it has an unusual shape.** Slide 19 is not a two-minute slide — it is a **76-minute block**: the 30-minute red-team/harden sprint, then ~35 minutes of demos (3 min × pairs), then the course close. The deck budgets 39.5 + 76 + 4.5 = 120 minutes, so the presenter's pace badge stays honest through the finale. Plan the last 80 minutes around that, not around the slide count. **Headcount rule, decided before Part A starts:** three-minute demos fit at most 12 pairs in 35 minutes; with more than 12 pairs, announce 60–90-second lightning demos *before* the sprint begins, never at demo time.

**Highest energy of the weekend.** *"We attack everything you built, then defend it, then you demo."*

---

## 1 · The spine

1. **Every capability is a surface** (3) — the hat change.
2. **There is no border between instructions and data** (4–6) — injection, direct then indirect.
3. **No single fix, so layer them** (7–8) — defence in depth, and match trust to blast radius.
4. **It works in Colab — now make the assumptions visible** (10) — cost, speed, reliability, security, observability.
5. **Design for a component that is sometimes wrong** (13–14) — UX and accountability.
6. **Your users decide whose law you are under** (15).
7. **The gaps are your roadmap** (16) — then build, demo, close.

---

## 2 · Slide by slide

### Slides 1–3 · The finale; 90-second recap; the hat change · 4.5 min

**The move.** Highest energy of the course. The recap is six fast true/false, one per session, no notes — S1 numbers, S2 evals, S3 multimodal, S4 grounding, S5 compounding, S6 tool results. Then **make the hat change physical** — actually pause. *"For five sessions you built. Now think like an attacker. Every capability is a surface."*

### Slides 4–5 · Direct injection; indirect injection · 6 min

**On screen.** A bot induced to issue a fake certificate; then a poisoned document attacking a RAG pipeline.

**The move.** Run the direct injection and let the room react before you explain. *"There is no border between instructions and data. This is SQL injection reborn."* Hit **Try another payload** so it does not look like one lucky string. Then slide 5, the scary one: the payload is **invisible in the chunk until you reveal it** — *"your RAG read what you couldn't see."* Land the asymmetry: **the attacker never talks to your bot — they just leave a document where you will fetch it.**

**One level under.** Injection has no escape character. Everything the model receives is one token stream, and the model has no mechanism to attribute provenance to a span. That is why filtering cannot be the fix — which is exactly slide 7's depth panel.

**Landmine.** Do not present injection as solvable. The honest position is: mitigable, layered, and capped by what the tools can do.

### Slide 6 · Jailbreaks and leaks: the two quieter doors · 2.5 min

**The move.** Flip both, then put the golden rule on screen and say it slowly: **"never put anything in a prompt you couldn't survive seeing on the front page."**

### Slides 7–8 · Defence in depth; keep a human on anything that bites · 5.5 min · `[D]`

**On screen.** Toggleable defence layers; then the trust dial.

**The move.** Centrepiece. Toggle the layers: at zero to two the bot falls; at three to four it holds. *"No single wall is perfect — but four are not all weak at the same time."* Say OWASP LLM01 once, precisely, without commentary. Then slide 8: **match trust to blast radius.** Read-only can relax; anything with a side effect gets a gate. Get that one dial right and most disasters never leave the building.

**Depth panel `[D]` (slide 7).** *Why filtering will never be the fix — and what is.* Open it when a student proposes a regex.

**Hardest question.** *"Can't I just detect injection with a classifier?"* — You can raise the cost. You cannot close the class of attack, because the attacker adapts and you are filtering natural language. Layer it, and cap the damage at the tool boundary.

### Slide 9 · There is no secure AI agent · 1.5 min · `trim`

**The move.** The hot take. Read once, slowly, three seconds of silence, take one counter-argument, park the rest.

### Slides 10–12 · It works in Colab — now make the assumptions visible; cost; speed and reliability · 7 min · `[D]`

**On screen.** A 20/80 bar; a cost slider to 5,000 users; then the three production properties.

**The move.** *"It works in Colab. Now make the assumptions visible"* — the 20/80 bar makes it land, and the five things that change are cost, speed, reliability, security and observability. Drag the cost slider to 5,000 users and let the ₹/month climb; the jigarthanda line — *N glasses a day* — makes it visceral. Then flip **caching on** and watch input cost drop about 90%. On 12: speed means stream, because users **forgive slow and hate frozen**; reliability means retries; observability means log. Then the payoff line: **your Session 2 evals become the regression test.**

**Depth panels `[D]`.** Slide 11: *read the price list again — the two numbers aren't the same* ($1.50 in / $9.00 out per 1M; output is dearer, and that changes what you optimise). Slide 12: *measure the tail, not the average* — TTFT versus tokens/sec, p50 versus p99.

**One level under.** The cost-slider constants and every derived figure were re-synced and Python-verified against the live widget; the ₹/$ rate is 95.5 as of 2026-09; the rates on screen are Gemini 3.5 Flash (previous-gen Flash) list price, and the lab model, 3.5 Flash-Lite, is $0.30 in / $2.50 out. If you re-base the currency, `fact-check.md` names the single constant to change.

### Slides 13–15 · Honest UX; four questions auditors ask; whose law · 6 min · `trim` at 13, 14, 15

**The move.** Slide 14 is a **rename, not a re-teach** — every card points at something they already did, and this slide is for the faculty in the room. Say EU AI Act and NIST AI RMF once, precisely, and move. Slide 15 is the globally useful one, so go slowly: read the four cards fast, then land the rule — **you are judged where your users are, not where you are.**

**Landmine.** Do not give legal advice, and say so. Dates and thresholds move; the architectural consequences (data residency, retention, PII redaction before the prompt) do not.

### Slides 16–18 · The ship-it checklist; the capstone; how to demo · 6.5 min

**The move.** Toggle the checklist honestly, including the items you would fail. **"The gaps are your roadmap, not your shame."** Then the capstone brief: roughly 30 minutes of red-team and harden, then three-minute demos per pair. Say the thing that sets the tone: **the failure story matters more than the polish.** Then the demo rules — pre-run everything, lead with the problem, show the failure, and take **one unrehearsed input from the audience**: it is part of the 40 demo points on `certificate.html`, not a dare.

**Landmine.** Slide 18 exists because bad demos are avoidable. Do not skip it to save two minutes; it saves you thirty.

### Slide 19 · Six sessions, one throughline · 76 min

**This slide is the last 76 minutes.** Inside it: the 30-minute red-team and harden sprint, then ~35 minutes of demos (3 min × pairs), then the course close.

**The move.** During the sprint, circulate and push pairs to attack a *classmate's* bot, not their own — they cannot see their own blind spots. During demos, keep time hard at three minutes; the failure story is the graded part. **Lightning-demo rule:** more than 12 pairs means 60–90 seconds each — what it does, the one failure, the one fix — and you announce that before Part A, so nobody rehearses a three-minute story they cannot tell. Then close on the spine: **Predict → Measure → See → Know → Act → Ship**, one verb per session.

**Scoring a pair whose app does not run.** The rubric is 40 demo · 25 honest eval · 15 failure analysis · 10 right tool · 10 presentation. A pair whose app crashes on stage but whose 10-question eval set is real, whose failure analysis is specific, and whose hardening story is genuine can still earn up to about **50** — the 25 + 15 + 10 are independent of the demo running, and part of the 40 is the unrehearsed-input and failure story, which they can still narrate from a log. Score it that way, explicitly, and say so before the demos start: it is the only thing that stops pairs faking a green run.

**Lab shape:** A attack a naive bot (8) · B harden it (8) · C red-team a classmate (10) · D ship-readiness self-audit (5).

### Slides 20–21 · Where to go from here; the close · 4.5 min · `trim` at 20

**The move.** Ship it for real — a live URL beats any certificate. Say the security line explicitly: key in secrets or an environment variable, **never in the pushed notebook**. Then close: *"You came as users. You leave as builders."* And the line worth landing last: **"knowing how to use ChatGPT expires next semester — knowing why it breaks compounds."** Point at the repo they keep.

---

## 3 · The depth layer in this deck

| Slide | Panel | Open it when |
|---|---|---|
| 7 | Why filtering will never be the fix — and what is | someone proposes a regex or a classifier |
| 11 | Read the price list again — input and output are not the same number | someone asks how to cut cost |
| 12 | Measure the tail, not the average — TTFT, p50 vs p99 | someone asks why their app feels slow |

---

## 4 · Q&A bank

**"So AI apps can't be secure?"** — Not in the sense of proof. You cap blast radius, layer defences, and keep a human on anything irreversible. That is the same posture as the rest of security engineering.

**"Isn't this just SQL injection?"** — Structurally yes, with one crucial difference: SQL has an escape character and a parser boundary. Natural language has neither.

**"Who is liable when it goes wrong?"** — Air Canada is the case to name; the tribunal held the company liable for its bot. Session 2 covered it, and slide 14 is where it lands.

**"Do I need to comply with the EU AI Act?"** — If you have EU users, it reaches you. Not legal advice — say that plainly — but that is the architectural assumption to build on.

**"How do I keep the cost down?"** — Shorter context, cheaper model, caching, and streaming for perceived speed. The depth panel on slide 11 has the arithmetic.

---

## 5 · Misconceptions

| They believe | Say this |
|---|---|
| Injection is a bug to patch | There is no escape character; you layer and cap damage (4–7) |
| A filter will stop it | Filtering raises cost, never closes the class (7 depth panel) |
| Working in Colab means it ships | It ran once, for you, on one input — make the assumptions visible (10) |
| Cost is one number | Output is dearer than input, and caching changes both (11) |
| Compliance is a legal problem | It is an architecture problem, decided early (15) |

---

## 6 · Timing pressure map

Slide budgets total 120 minutes — 39.5 of talk, then slide 19's 76-minute build-and-demo block, then 4.5 to close. **The whole risk in this session is demos overrunning.** Hold three minutes per pair (or 60–90 seconds with more than 12 pairs, announced before Part A), out loud, with a visible timer.

Cut in this order: slide 6 (one door, not two) · slide 17 (the brief can be 90 seconds) · slide 2 (four recap items, not six).

Never compress: slide 5 (indirect injection), slide 7 (the layer toggle), or the demos.

The deck flags slides 9, 13, 14, 15 and 20 **compressible** (press **S** to see the marker).

---

## 7 · Day-before checklist

Run both injections and have a second payload ready in case the first is fixed by a model update. Toggle all defence layers and confirm the bot actually falls at zero to two layers. Drag the cost slider to 5,000 and check the ₹ figure against `fact-check.md`. Re-read the jurisdiction cards — that slide was trimmed once for overflow, so confirm it still fits your projector at 900px. Have a stopwatch for the demos, and decide your hard stop before the room talks you out of it.
