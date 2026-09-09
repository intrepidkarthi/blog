# Session 2 — Instructor Prep Pack

### Talking to AI, and Catching Its Lies · 21 slides · 2 hours

**What this file is.** The level under every slide. Read it end to end once (about 30 minutes), re-skim the slide table the night before. `session-2-notes.md` is the delivery-day run sheet.

**Slide numbers are the deck's own** — generated from `presentations/session-2-talking-to-ai-and-catching-its-lies.html`. Press **S** for presenter mode.

**This is the session that changes the course.** Session 1 taught them what the machine is. This one teaches the discipline that separates using AI from engineering it, and the artifact they build here — an eval harness — is reused in Sessions 4, 5 and 6 and is the single most employable thing in twelve hours.

---

## 1 · The spine — the session as one argument

1. **Your asks are wishes, not instructions** (4–9) — a prompt has anatomy, and each part is a dial.
2. **A polished prompt still lies beautifully** (10–12) — the turn; polish is not correctness.
3. **So you measure** (13–14) — test set + scorer + score = one honest number.
4. **The scorer can be the liar too** (15) — the second turn, and the one that earns the room's respect.
5. **One number is not a verdict** (16–17) — five questions cannot settle A versus B.
6. **The loop is the job** (18) — prompt → eval → read failures → fix one thing → re-run.

**Readiness test.** Say beats 2 → 3 → 4 out loud in ninety seconds. That is the argument. If a student can only take one thing from twelve hours, it is this.

---

## 2 · Slide by slide

### Slides 1–3 · Opening, recap quiz, the two artifacts · 4.5 min

**On screen.** Title; a recap quiz on Session 1; the two artifacts — prompt playbook and eval harness.

**The move.** Open with: *"You can now call the model. But your asks are wishes, not instructions. Today we make them instructions — and catch the lies."* Run the recap fast for energy; a wrong answer gets a one-line re-teach, never a lecture. Then: *"This one artifact is the difference between using AI and engineering it."*

**Landmine.** Do not re-teach Session 1 here. The quiz is a temperature check, not a revision lecture; if three answers are wrong, note it and fix it inside the relevant slide later.

### Slide 4 · The prompt makeover: five upgrades · 4 min

**On screen.** A prompt evolving v0 → v5 with a quality meter climbing from about 10% to 85%.

**The move.** The centrepiece of the first hour. Before each **Improve** click, ask the room *"what's still wrong with it?"* Let them find the flaw before the slide shows it. The v5 constraint is the punchline — the constraint is what stops the model inventing an award.

**One level under.** The five upgrades are role, task specificity, context, format and constraint. Each one narrows the distribution the model samples from. The meter is a teaching device, not a measurement — say so if asked.

**Hardest question.** *"Isn't this just writing clearly?"* — Largely yes, and that is the point: the skill is unglamorous. The part that is *not* just clear writing is the constraint, which anticipates a failure mode you have seen before.

**Landmine.** Do not defend the quality meter as a real score. It is illustrative; the real number arrives on slide 13.

### Slide 5 · Anatomy of a prompt: six switches · 2.5 min

**On screen.** Toggleable prompt parts with a live token count.

**The move.** Toggle parts on and off and watch the token count climb. Task is mandatory; everything else is a dial. Name the trap: over-stuffing dilutes attention.

**One level under.** More context is not monotonically better. Attention is a weighted blend over everything present, so irrelevant context competes with relevant context for weight — and you pay for it per token.

**Hardest question.** *"So should I always give lots of context?"* — No. Give what is needed to disambiguate the task. Session 4 is the disciplined version of this question.

### Slides 6–8 · Few-shot; step-by-step; demand a format · 7 min · `trim` at 8

**On screen.** Zero-shot versus few-shot on a Tanglish review; a ₹472 arithmetic problem direct versus stepped; a format-enforcing prompt where the word ONLY does the work.

**The move.** On slide 7, make the room compute ₹472 on paper first — give them thirty seconds — *then* reveal both outputs. Direct is confidently wrong; stepped is auditable. On slide 8, point at the word **ONLY** and say: *"apps don't read prose — your 2 a.m. parser dies without it."*

**One level under.** Few-shot works because the examples pin both format and edge cases; two to five is the usual sweet spot. Step-by-step works because intermediate tokens are computation the model can condition on — it is not "thinking harder", it is having more room to work. Format instructions reduce variance but do not guarantee validity, which is why Session 3 introduces `response_schema`.

**Hardest question.** *"If step-by-step is better, why not always?"* — Tokens cost money and latency. For a lookup, it is waste.

**Landmine.** Do not promise that asking for JSON gives you valid JSON. It usually does; Session 3 shows the version that actually enforces it.

### Slide 9 · The four classic prompt crimes · 3 min

**On screen.** Crime cards; the class guesses each fix before the reveal.

**The move.** Let them guess. The kitchen-sink crime previews Session 5 workflows — name that forward link.

### Slides 10–12 · The turn: it lies beautifully · 8 min · `trim` at 12

**On screen.** Two real cases; a three-round spot-the-lie game with a tone meter; then the hot take.

**The move.** Read the lawyer case and the Air Canada case **straight**, no editorialising. The room will go quiet — let it. *"These were not bad prompts. They were unmeasured ones."* Then the game: three rounds, the room votes A/B/C before each reveal. The lies are **C** (the award is invented), **B** (India lost that match) and **A** (the Nobel was for the photoelectric effect, not relativity). The tone meter shows identical confidence bars every round: **tone tells you nothing**. Then slide 12, the hot take — read it once, slowly, be quiet for three seconds, take exactly one counter-argument and park the rest for the break.

**One level under.** *Mata v. Avianca* (2023) — lawyers sanctioned for six fabricated citations, roughly $5,000. *Moffatt v. Air Canada* (Feb 2024) — the airline held liable for its chatbot's invented refund policy, BC Civil Resolution Tribunal. Both are real and both are checkable; the "unlike the lawyer, I checked mine" receipts line on the slide is doing deliberate work.

**Hardest question.** *"Doesn't RAG fix this?"* — It reduces it and gives you a citation to check. It does not remove the mechanism. Promise Session 4 and keep the promise.

**Landmine.** Do not let the room conclude the technology is untrustworthy and therefore useless. The conclusion you want is: untrusted *and therefore measured*. That distinction is the whole session.

### Slides 13–14 · You measure; watch an eval run · 5.5 min

**On screen.** Test set + scorer + score; dots filling to "7/10 — argument over"; then a live eval, run twice.

**The move.** Land the line: **"A prompt without an eval is a superstition."** Then run the eval and *immediately* run it again — the score moves 7 → 8. Ask which is true. Answer: neither. Set temperature to 0, run three times, average. Then read the failures aloud.

**One level under.** Three components, and students conflate them: the **test set** (inputs plus expected outputs), the **scorer** (the function that decides pass or fail) and the **score** (one number). Changing any one changes the number, which is why you report the whole configuration, not just the percentage.

**Hardest question.** *"How many questions do I need?"* — More than five, and slide 16's depth panel gives the rule. Ten is the teaching floor; a real system wants a few hundred.

**Landmine.** Do not skip the run-twice move. Watching the number move by itself is what makes the variance lesson land.

### Slide 15 · Same answer, three verdicts · 3 min · `[D]`

**On screen.** One correct answer judged by three scorers; exact-match fails it.

**The move.** This is the aha. Exact-match rejects a *correct* answer. *"Your scorer can be the liar too."* Contains-match is what today's lab uses.

**Depth panel `[D]`.** *One number is usually the wrong number* — precision, recall and F1, plus the AI judge's position and verbosity bias, and the fix (swap the order and re-run).

**One level under.** Exact match has high precision and terrible recall on free text. Contains is permissive and can pass an answer that also contains a contradiction. An LLM judge is flexible and introduces its own biases. There is no free scorer.

**Hardest question.** *"So which scorer should I use?"* — The cheapest one that does not lie about your task. For short factual answers, contains. For anything structured, parse it. For prose, a judge with the position-bias fix.

### Slides 16–17 · The arena; "it worked when I tried it" · 5 min · `trim` at 17

**On screen.** Prompt A versus Prompt B, B wins 4–2 but Q5 beats both; then the hot take about evidence.

**The move.** Run the fight. Then point at Q5 — the question both prompts failed — and say the loop never ends, it converges, and then you grow the test set. On 17: demo is the best case, eval is the expected case.

**Depth panel `[D]` (slide 16).** *B won 4–2. Did B actually win?* — the widget renders A 2/5, B 4/5, and a two-question gap on five questions is still inside the noise; the ±1/√n rule, paired comparison, and separating model from prompt from scorer. Open this whenever a student treats a small win as settled.

**One level under.** With five questions the finest distinction you can resolve is coarse; a 4–2 split is well inside noise. Paired comparison — same questions, both prompts, same scorer — is what makes small n usable at all.

**Landmine.** Do not let "B won" stand unchallenged, even for a minute. The whole point of the slide is that it did not.

### Slides 18–19 · The loop; six ideas · 5 min

**On screen.** The eval-driven development cycle, running on its own; then recall flips.

**The move.** Let the pipeline animate without narrating over it. **"Failures are the syllabus."** Then active recall — the class says each of the six ideas before you click: anatomy, few-shot, step-by-step, hallucination, test set, the loop.

### Slide 20 · Lab 2: the lie detector · 52 min

**On screen.** The lab brief.

**The move.** Two-minute brief, then fifty minutes. Press **L** for the countdown — it paces the room. Three things to enforce while circulating: expected strings must be **short**, every ✗ must be diagnosed rather than deleted, and the documentation is the deliverable — say it at the brief: **three iterations documented well beats five documented badly.** They A/B on the ten questions they wrote in Session 1.

**Lab shape** (`labs/session-2/lab-handout.md`): A prompt makeover (15) · B your first eval (15) · C the arena (15).

**Landmine.** Students will "fix" a failing test by loosening the expected string until it passes. Name this at the brief, before it happens — that is the single most common failure of the hour, and it is exactly the behaviour the session exists to prevent.

### Slide 21 · You can now prove whether AI is right · 3 min

**The move.** Show and tell: best improvement, best caught lie, and name the strongest counter-argument the room made to slide 12. Ask of any failure: *model, scorer, or question?* Then the teaser — next session AI gets eyes, and they should bring photos.

---

## 3 · The depth layer in this deck

| Slide | Panel | Open it when |
|---|---|---|
| 15 | One number is the wrong number — precision, recall, F1, judge bias | someone asks which scorer to use, or proposes an LLM judge |
| 16 | Did B actually win? — the ±1/√n rule, paired comparison | someone treats a small eval win as settled |

Two panels only; this deck spends its depth in the main line.

---

## 4 · Q&A bank

**"Can't I just use a better model instead of better prompts?"** — Sometimes. You cannot know without an eval, which is the point. And the eval outlives the model choice.

**"Isn't an LLM judging an LLM circular?"** — Partly, and it has measurable biases (position, verbosity). It is still useful when the alternative is no measurement. Fix what you can: swap the order and re-run.

**"How is this different from unit testing?"** — Same instinct, different assertion. Outputs are non-deterministic, so you assert on a distribution of behaviour rather than an exact value, and you accept a threshold rather than a pass/fail.

**"Ten questions seems tiny."** — It is. It is enough to catch gross regressions and to teach the discipline. Say the honest number: real systems use hundreds, and the depth panel explains why.

**"What if my expected answer is wrong?"** — Then your eval lies with total confidence, which is why you read failures instead of trusting the score.

---

## 5 · Misconceptions

| They believe | Say this |
|---|---|
| A better prompt fixes hallucination | It reduces frequency, not the mechanism (slides 10–12) |
| A high score means it works | It means it works *on that test set, with that scorer* (13–16) |
| Confident tone signals correctness | The tone meter is identical on every round, including the lies (11) |
| The scorer is neutral infrastructure | Exact-match fails correct answers (15) |
| One run is a result | Run it twice on stage and watch the number move (14) |

---

## 6 · Timing pressure map

Slide budgets total 102.5 minutes including the 52-minute lab, leaving about 18 minutes of reserve — slack that Session 1 does not have. Spend it on slides 10–16, which are the session, and on a longer show and tell.

Cut in this order: slide 9 crime cards (four can be two) · slide 6 few-shot (the Tanglish example alone carries it) · slide 19 recall flips.

Never compress: slide 11 (the game), 14 (run it twice), 15 (the scorer turn), or 16's Q5 moment.

The deck flags slides 8, 12 and 17 **compressible** (press **S** to see the marker). If you reach slide 12 later than 40 minutes in, cut from the list above.

---

## 7 · Day-before checklist

Run the makeover through all five clicks. Play all three rounds of the spot-the-lie game and check you can state *why* each is false without reading. Run the eval twice and confirm the score moves. Open both depth panels. Then open `labs/session-2/session_2_lab.ipynb`, run it end to end on a real key, and confirm the model id still resolves — see `fact-check.md`, volatile rows last live-verified 2026-08-03.

Have your own ten-question test set ready as the worked example, in case a pair arrives without one.
