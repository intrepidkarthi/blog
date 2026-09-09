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

**Before day one, send them one link.** `how-llms-work.html` — *"We taught a machine to write Thirukkural"* — is a complete, interactive walk through how a language model works, on one worked example: a small GPT trained from scratch on the 1,330 couplets of Thirukkural (and, for comparison, on Shakespeare's sonnets), running live in the browser with its real weights. Twelve chapters, about thirty-five minutes: next-character prediction, the training data, tokenization and BPE, embeddings, attention, the transformer block and where the parameters live, logits → softmax → sampling with temperature, the pretraining loop with the recorded loss curve and samples at each step, supervised fine-tuning, RLHF (a preference game, a stand-in reward, and a measured reinforcement loop), the whole machine end to end, and the ~120 lines of PyTorch to build one for any text. It overlaps Session 1 on purpose: the page is the full pipeline on one example, the session is behaviour-first with a hosted model. A room that has read it arrives with the vocabulary; use it. The prose companion is `LEARNING-GUIDE.md` **Part 9**.

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

### Full course — 12 instructional hours (the design)
Weekend bootcamp, 6 × 2-hour sessions. Day 1: S1–S3. Day 2: S4–S6. Schedule breaks and lunch outside the six instructional blocks. Students complete the access check before Day 1; when provider access fails, every notebook has `MOCK = False` in Cell 1 — set it `True` and every cell runs on canned `[MOCK]` responses (Lab 4's search still works on a hashed bag-of-words embedding). See `course-plan.md` and `TIMING.md`. This is the intended experience and the only one with the capstone. If a delivery must drop a session, drop Session 3 (vision/audio) — its artifact is the smallest and nothing downstream depends on it.

### One session — 2 hours (drop-in)
Any single session stands alone (S1, S2, and S4 work best as standalone). Run the deck (~48 min, after the ~8-min hook) + the lab (~50 min) + wrap. Skip the "carry forward" callbacks or explain them in a line.

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
The designed path uses the Gemini API free tier, but provider access, quotas, and account policies can change. The offline fallback is built in — `MOCK = True` in Cell 1 of any notebook runs it on canned `[MOCK]` responses — so rehearse it once before class; students should never be pressured to create extra accounts or share keys. You need a projector and a room. See `ZERO-SETUP.md` for the access check and fallback plan.

## One setup task before Day 1
The materials link on Session 1's lab-kit slide (titled “Your lab kit, and the rhythm”) is intrepidkarthi.com/genai; if you are teaching your own fork, host the notebooks + handouts somewhere stable (GitHub works — add Colab badges), put that link on the slide, and test it from a student device. Also complete the live API access check and run one notebook with `MOCK = True` before class.

## License / sharing
Built to be shared. Use it, fork it, localize it, teach it. If it helps someone learn to build with AI, it did its job. Credit appreciated but not required — the point is that more people understand how these systems actually work.

— Originally built for Thiagarajar College of Engineering, Madurai, by Karthikeyan NG ([@intrepidkarthi](https://twitter.com/intrepidkarthi)).
