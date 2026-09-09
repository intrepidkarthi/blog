# Lab Facilitation Guide — all six labs

**What this file is.** How to run the lab hour. It is the same hour six times, and the shape does not change — which is the point, because a room that knows the rhythm stops asking about the rhythm and starts asking about the work.

Taught once, on Session 1's *"Your lab kit, and the rhythm"* slide. After that you only have to point at it.

---

## The universal rhythm

Every lab is the same five moves, in the same order:

| | | |
|---|---|---|
| **Brief** | 2–3 min | What you are building, and the one thing that must work by the end |
| **Build** | ~50 min | Pairs — both partners have a key, one drives per part, swap at each checkpoint |
| **Sweep** | at +40 | You walk the room and check every pair against the checkpoint list |
| **Collect** | last 5 | Two artifacts for show and tell — one that worked, one that failed usefully |
| **Show** | next slide | Two or three pairs, three minutes total |

**Pairs, not groups of four.** Both partners create their own API key in Part A; one drives per lab part and they swap at each checkpoint, so both hands have typed every kind of cell by the end. The moment one person is only watching, they have stopped learning, and by Session 4 they cannot catch up.

---

## Your four moves during the hour

**1 · Circulate. Never sit down.** The single highest-value thing you do in twelve hours is walk. A stuck pair will not raise a hand; they will quietly fall behind and leave.

**2 · Ask before you answer.** *"What did you expect to happen?"* and *"What did it actually do?"* Most bugs solve themselves in the gap between those two sentences, and the student keeps the skill.

**3 · Checkpoint sweep at +40 minutes.** Not before — earlier and you interrupt flow; later and you cannot rescue anyone. Walk the room with the checkpoint list and ask each pair which one they are on. This is also how you find the pair that has been stuck for twenty minutes and said nothing.

**4 · Collect two artifacts.** One thing that worked, one thing that failed interestingly. Show and tell without collection is dead air; collection makes it two minutes of the best content in the session.

---

## The five-minute rule

Say this at every brief: **stuck for five minutes → ask your neighbour → then ask me.** It halves your queue and it is how the room starts teaching itself. By Session 4 you will hear pairs debugging each other, which is the moment the weekend is working.

---

## Timing template for a 50-minute lab

| | |
|---|---|
| 0:00–0:03 | Brief. The goal, the checkpoints, the five-minute rule. Links on screen — point, do not read |
| 0:03–0:10 | Setup and first cell. **Your busiest window** — most failures are environmental and happen here |
| 0:10–0:40 | Build. Circulate continuously |
| 0:40–0:45 | Checkpoint sweep |
| 0:45–0:50 | Stretch goals for the fast pairs; rescue for the stuck ones; collect artifacts |

If you are behind, cut a stretch goal. Never cut a checkpoint — the checkpoints are what the next session assumes.

---

## Per-lab specifics

**Lab 1 · Your first AI API call.** A confirm access and key (10) · B first call (10) · C five prompts (10) · D one prompt, three models (10) · E build your test set (10) — 50 total.
*The sink:* API key setup. Have the five steps on the board before anyone opens a laptop (and the "I already have a Google Cloud account → import a project first" line with them).
*Protect:* Part E — it is the hand-off to Lab 2, which consumes those ten questions. Part D is the designated cut: if you are behind at the +30 checkpoint, drop D and go straight to E.

**Lab 2 · The lie detector.** A prompt makeover (15) · B first eval (15) · C the arena (15).
*The sink:* students loosening the expected string until the test passes. Name it at the brief, before it happens.
*Protect:* diagnosing every ✗. The documentation is the deliverable, not the score.

**Lab 3 · Interrogate your photos.** A interrogation ladder (10) · B document → JSON (10) · `response_schema` (5) · C handwriting (10) · D break it (10).
*The sink:* the folder upload. Demo it once yourself before they start.
*Protect:* pushing Part B until `json.loads` actually passes. That is the checkpoint that matters.

**Lab 4 · Chat with YOUR notes.** A ingest (12) · B search sanity (8) · C full RAG (15) · D break it honestly (10).
*The sink:* garbage PDF extraction. Swap the document at minute five rather than fighting it, or use Session 3's vision extraction.
*Protect:* Part B. If search is junk, the answer is chunking, and no amount of prompt work will save it.

**Lab 5 · Give it hands.** A calculator tool (12) · B two tools chained (12) · C see the machinery (8) · D scenario cards, paper (10).
*The sink:* over-tooling — pairs adding a third and fourth tool and then wondering why routing broke.
*Protect:* Part C, the manual loop. It is what demystifies agents. Nudge strong pairs to the RAG-as-a-tool stretch — that is where the capstone assembles itself.

**Lab 6 · Break it, then ship it.** A attack a naive bot (8) · B harden it (8) · C red-team a classmate (10) · D ship-readiness audit (5).
*The sink:* pairs attacking their own bot. Make them swap — nobody sees their own blind spot.
*Protect:* Part C. The classmate's attack is the lesson.

---

## If the internet or a service dies

1. **One pair affected** — pair them with a working machine. Both still type.
2. **Rate limits across the room** — switch to the fallback model named in `fact-check.md`, or stagger: half the room runs while half writes their test set.
3. **The provider is down** — flip the room to `MOCK = True` in Cell 1: every cell runs on canned `[MOCK]` responses, so the checkpoints still happen at reduced fidelity. If even Colab is gone, the deck widgets all run offline: convert the lab to a paper walkthrough — they write the prompts and predict the outputs — and run the live version as the opening of the next block (after S6 there is no next block, so for S6 it becomes the post-weekend stretch). Say plainly that this is what production incident response looks like.
4. **No internet at all** — every deck opens offline. Teach the slides, demo the local model from Session 5 if you have it pulled, and move the lab.

**Have the labs downloaded before you arrive.** Colab needs the network, but the notebooks and handouts do not.

---

## The one metric that matters

Not how many finished. **How many can explain what they built to the pair next to them.**

At the checkpoint sweep, ask one pair to explain their code to another pair. If they can, the hour worked. If the notebook runs and they cannot explain it, they copied it, and Session 4 will find that out the hard way.
