# Teach This Yourself

This course is built to be **picked up and taught by anyone** — a professor, a senior student, a meetup organizer, a corporate L&D team. Everything you need is in this repo. Here's how to run it, whether you have 12 hours or 45 minutes.

## Who can teach it
You need to be **one session ahead of the room**, not an expert. Each session ships a `*-prep.md` pack that teaches you the material one level deeper than the slides, lists the questions students will ask (with answers), and flags the facts to re-verify. If you can read those and run the demos once, you can teach the session.

## What's in the box (per session)
| File | For whom | When |
|---|---|---|
| `presentations/session-N-*.html` | everyone | the talk — open in a browser, press `S` for presenter notes + timer |
| `instructor-notes/session-N-prep.md` | you | study 1–2 days before |
| `instructor-notes/session-N-notes.md` | you | run sheet for delivery day |
| `labs/session-N/lab-handout.md` | students | the hands-on sheet |
| `labs/session-N/session_N_lab.ipynb` | students | ready-to-run Colab notebook |
| `cheatsheets/session-N-cheatsheet.md` | students | 1-page takeaway |

Plus, repo-wide: `course-plan.md` (the whole design), `TIMING.md` (per-slide timing), `fact-check.md` (every claim + source), `lab-facilitation-guide.md` (how to run the labs), `ZERO-SETUP.md` (the no-cost guarantee).

**Before day one, send them one link.** `how-llms-work.html` — *"Where does the answer live?"* — is a ten-minute interactive walk through what is actually inside a model: the four kinds of table, the residual stream, superposition, and the two-thirds of the file where facts live. It is written to **not** overlap Session 1 (that deck is about what a model *does*; the page is about what it *contains*), so it costs you no class time and buys you a room that already knows a model is a file rather than a database. `session-1-prep.md` has a full briefing on it, including the questions it will send you. The prose version is `LEARNING-GUIDE.md` **Part 9**.

**Teaching outside Madurai?** `LOCALIZATION.md` is the swap-kit: which of the 278 local references are decoration you can swap freely, which are institutional and *must* change, and which three are load-bearing (the Tamil tokenizer demo, the currency constants, the academic vocabulary in Session 4). Twenty minutes of find-and-replace and the course is yours.

## The decks in 30 seconds
- Open the `.html` in any browser. Fully offline, nothing to install.
- **→ / Space** next · **←** back · **F** fullscreen · **O** overview grid · **number + Enter** jump · **`S`** presenter mode (live timer, per-slide budget, pace badge, speaker notes).
- Every demo is **live** — click, drag, type, vote during the talk. They reset if you leave and re-enter a slide.

## The teaching method (why it works)
The whole course runs on four repeatable moves. Copy them into any topic you ever teach:
1. **Interactive-first.** Every big idea has a thing the room *does* (a game, a slider, a stepper) before the explanation. People remember what they did, not what they heard.
2. **Vote before reveal.** Ask the room to commit — shout an answer, raise a hand, guess the mechanism — *then* click. A committed guess makes the answer stick, right or wrong.
3. **Honest failure.** Every session shows where the tech breaks and why. Trust comes from teaching the failures, not hiding them.
4. **Ship something every time.** Each lab ends with working code the student ran themselves. Understanding follows building, not the reverse.

## Run it at three scales

### Full course — 12 hours (the design)
Weekend bootcamp, 6 × 2-hour sessions. Day 1: S1–S3. Day 2: S4–S6. See `course-plan.md` and `TIMING.md`. This is the intended experience and the only one with the capstone.

### One session — 2 hours (drop-in)
Any single session stands alone (S1, S2, and S4 work best as standalone). Run the deck (~45 min) + the lab (~50 min) + wrap. Skip the "carry forward" callbacks or explain them in a line.

### A talk — 45 minutes (no lab)
Run just the deck of any session, demos included, skip the lab-brief and wrap slides. S1 (how LLMs work), S4 (RAG), or S6 (AI security) each make a strong standalone talk. Press `S` and follow the timer.

## Before you teach any session (the 3-step prep)
1. **Read** `instructor-notes/session-N-prep.md` — deep-dives + the pushback questions + facts to re-verify.
2. **Rehearse** with the deck open: click every demo twice, and do the 3-minute "spine test" (tell the session's story with no slides). If you can, the deck becomes support, not a script.
3. **Re-verify** the facts in `fact-check.md` (model names, free-tier limits, prices drift). Run the notebook top-to-bottom with your own free key.

## Adapting it to your audience
- **Not in Madurai?** Swap the local examples (jigarthanda, Meenakshi temple, TCE, Tamil tokenization) for your own city's food, landmark, college, and language. The *structure* is universal; the flavor is find-and-replace.
- **Different language?** The Tamil-tokenization demo works for any non-English language — point it at yours; the "some languages cost more tokens" lesson is global.
- **Corporate / non-student?** Keep everything; swap the capstone data (class notes → your team's docs) and the examples (cricket → your domain). The engineering is identical.
- **Younger / less technical?** Do the decks and demos, make the labs optional or instructor-driven. The intuition survives without the code.

## Cost to run
Zero. Every student uses a free Gemini API key (no card). You need a projector and a room. See `ZERO-SETUP.md` for the full guarantee and the free-tier budget math.

## One setup task before Day 1
Replace the placeholder link `tinyurl.com/tce-genai` on Session 1's lab-kit slide (titled “Your lab kit, and the rhythm”) with a real short link, and host the notebooks + handouts behind it (GitHub works — add Colab badges). That's the only thing standing between this repo and a live course.

## License / sharing
Built to be shared. Use it, fork it, localize it, teach it. If it helps someone learn to build with AI, it did its job. Credit appreciated but not required — the point is that more people understand how these systems actually work.

— Originally built for Thiagarajar College of Engineering, Madurai, by Karthikeyan NG ([@intrepidkarthi](https://twitter.com/intrepidkarthi)).
