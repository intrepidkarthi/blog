# Session 2 — Slide-by-Slide Cheat Sheet

### Session 2 · Talking to AI, and Catching Its Lies · 21 slides · 1:42 total

The session that turns opinions into numbers. Depends on the test set students wrote at the end of lab 1.

One card per slide, generated from `presentations/session-2-talking-to-ai-and-catching-its-lies.html` itself, so nothing here can drift from what is on screen. **#** is the deck position — it matches the `21 / 21` counter in the footer and the `#21` deep link. **Badge** is the number printed in the slide’s top-left corner; the two differ because title and lab slides are not badged. Press **S** in the deck for the same notes with a live timer.

**`trim`** marks a slide the deck itself flags **compressible** — press S and you will see `▸ compressible` on it. These are the first things to shorten when you are behind, not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** to open it, and only open it if the room asks.

---

## At a glance

| At | # | Badge | Slide | Budget | |
|---|---|---|---|---|---|
| 0:00 | 1 | — | Talking to AI, and catching its lies | 1 min |  |
| 0:01 | 2 | 01 | Still true after the break? | 2 min |  |
| 0:03 | 3 | 02 | Two artifacts in two hours | 1.5 min |  |
| 0:04 | 4 | 03 | The prompt makeover: five upgrades | 4 min |  |
| 0:08 | 5 | 04 | Anatomy of a prompt: six switches | 2.5 min |  |
| 0:11 | 6 | 05 | Few-shot: show, don't tell | 2.5 min |  |
| 0:14 | 7 | 06 | Step-by-step beats straight-to-answer | 2.5 min |  |
| 0:16 | 8 | 07 | Demand a format, or parse chaos forever | 2 min | `trim` |
| 0:18 | 9 | 08 | The four classic prompt crimes | 3 min |  |
| 0:21 | 10 | 09 | Your polished prompt still lies beautifully. | 2 min |  |
| 0:23 | 11 | 10 | One of these is a confident lie | 4.5 min |  |
| 0:28 | 12 | — | Hallucination is an expected failure mode. That does not make it acceptable. | 1.5 min | `trim` |
| 0:29 | 13 | 11 | "How do you know it's right?" You measure. | 2 min |  |
| 0:31 | 14 | 12 | Watch an eval run | 3.5 min |  |
| 0:34 | 15 | 13 | Same answer, three verdicts | 3 min | `D` |
| 0:38 | 16 | 14 | Prompt A vs Prompt B: the arena | 3.5 min | `D` |
| 0:41 | 17 | 15 | "It worked when I tried it" is not evidence. | 1.5 min | `trim` |
| 0:42 | 18 | 16 | Eval-driven development: the loop | 2.5 min |  |
| 0:45 | 19 | 17 | Six ideas you own now | 2.5 min |  |
| 0:48 | 20 | 18 | Lab 2: the lie detector | 52 min |  |
| 1:40 | 21 | 19 | You can now prove whether AI is right. | 3 min |  |
| 1:42 | | | *end* | | |

---

## The cards

### 1 · Talking to AI, and catching its lies

`#1` · `<|session_02/06|>` · **1 min** · at **0:00**

- **Run it** — ‘You can now call the model. But your asks are wishes, not instructions. Today: make them instructions, and catch the lies.’

### 2 · Still true after the break?

`#2` · badge **01** · `<|90_second_recap|>` · **2 min** · at **0:01**

- **On screen** — *True or false*
- **Run it** — **Recap quiz.** Fast energy. Wrong answers = one-line re-teach, don’t lecture.

### 3 · Two artifacts in two hours

`#3` · badge **02** · `<|this_sessions_deal|>` · **1.5 min** · at **0:03**

- **Run it** — Two artifacts: prompt playbook + eval harness. ‘This one artifact is the difference between using AI and engineering it.’

### 4 · The prompt makeover: five upgrades

`#4` · badge **03** · `<|live_demo|>` · **4 min** · at **0:04**

- **On screen** — *Same goal, better asks — watch the output climb*; buttons: **Improve it →** · **Restart**
- **Run it** — **CENTERPIECE. Makeover v0→v5.** Before each Improve click ask ‘what’s still wrong?’ v5 constraint = the punchline (can’t invent awards). Quality meter climbs 10%→85%.

### 5 · Anatomy of a prompt: six switches

`#5` · badge **04** · `<|the_pattern|>` · **2.5 min** · at **0:08**

- **On screen** — *Toggle the parts*
- **Run it** — Toggle prompt parts live — watch the ~token count climb. Task mandatory, rest are dials; over-stuffing dilutes attention.

### 6 · Few-shot: show, don't tell

`#6` · badge **05** · `<|the_strongest_dial|>` · **2.5 min** · at **0:11**

- **On screen** — *Classify a Tanglish movie review*; buttons: **Zero-shot (just ask)** · **Few-shot (3 examples first)**
- **Run it** — Zero vs few-shot. The Tanglish review lands well. ‘2–5 examples pin format + edge cases — the model imitates.’

### 7 · Step-by-step beats straight-to-answer

`#7` · badge **06** · `<|make_it_show_its_work|>` · **2.5 min** · at **0:14**

- **On screen** — *₹500 item · 20% discount · then 18% GST on the discounted price. Final price?*; buttons: **Answer directly** · **"Solve step by step, then answer"**
- **Run it** — Let class compute ₹472 on paper FIRST (30s), then reveal both. Direct = confident wrong; steps = auditable.

### 8 · Demand a format, or parse chaos forever

`#8` · badge **07** · `<|your_code_is_the_customer|>` · **2 min** · at **0:16** · `trim`

- **On screen** — *Extract: “Hi, I'm Priya, third year BE CSE at TCE”*; buttons: **No format specified** · **"Reply ONLY with JSON: {name, degree, year}"**
- **Run it** — The word ONLY does real work. ‘Apps don’t read prose — your 2 a.m. parser dies without it.’
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 9 · The four classic prompt crimes

`#9` · badge **08** · `<|guess_the_fix|>` · **3 min** · at **0:18**

- **Run it** — **Crime cards.** Class guesses each fix before the click. Kitchen-sink previews S5 workflows.

### 10 · Your polished prompt still lies beautifully.

`#10` · badge **09** · `<|the_uncomfortable_part|>` · **2 min** · at **0:21**

- **Run it** — **The turn.** Read the lawyer + Air Canada cases straight. Room goes quiet — let it. ‘Not bad prompts. Unmeasured ones.’ Point at the receipts line: ‘Unlike the lawyer, I checked mine.’

### 11 · One of these is a confident lie

`#11` · badge **10** · `<|live_game|>` · **4.5 min** · at **0:23**

- **On screen** — *All three sound equally sure. Which is fabricated?*
- **Run it** — **GAME. 3 rounds, vote A/B/C before each reveal.** Lies: C (award invented) · B (India LOST that match) · A (Nobel was for photoelectric, not relativity). Tone-o-meter: identical bars every round. ‘Tone tells you nothing. Only checking does.’

### 12 · Hallucination is an expected failure mode. That does not make it acceptable.

`#12` · `<|hot_take|>` · **1.5 min** · at **0:28** · `trim`

- **On screen** — full-bleed hot take
- **Run it** — **Pick the fight deliberately.** Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 13 · "How do you know it's right?" You measure.

`#13` · badge **11** · `<|the_engineering_answer|>` · **2 min** · at **0:29**

- **Run it** — Test set + scorer + score = one honest number. Dots fill to ‘7/10 — argument over.’ Then land the line: ‘A prompt without an eval is a superstition.’

### 14 · Watch an eval run

`#14` · badge **12** · `<|live_demo|>` · **3.5 min** · at **0:31**

- **On screen** — *10 questions · cricket expert's test set*; buttons: **Run eval** · **Run again**
- **Run it** — **Run eval, then IMMEDIATELY Run-again** — score 7→8. ‘Which is true? Neither. T=0, ×3, average.’ Read failures.

### 15 · Same answer, three verdicts

`#15` · badge **13** · `<|the_scorer|>` · **3 min** · at **0:34** · `D`

- **On screen** — *Q: "Who composed the music for Roja?" · Expected: "A. R. Rahman" · Model said: "It was composed by AR Rahman in 1992."*; buttons: **Exact match** · **Normalized contains** · **AI judge**
- **Run it** — Exact-match FAILS a correct answer — the aha. ‘Your scorer can be the liar too.’ Contains = today’s lab scorer. **[D] deeper:** precision / recall / F1, and the AI judge’s position + verbosity bias (fix: swap the order and run twice). Open it if anyone proposes an LLM judge.
- **Depth `D`** — one number is usually the wrong number

### 16 · Prompt A vs Prompt B: the arena

`#16` · badge **14** · `<|live_demo|>` · **3.5 min** · at **0:38** · `D`

- **On screen** — *Same 5 questions · same model · only the prompt differs*; buttons: **Fight**
- **Run it** — **Arena. Fight.** B wins 4–2 but Q5 beats both. ‘The loop never ends; it converges. Then grow the test set.’ **[D] deeper:** why 5 questions cannot settle A vs B: the ±1/√n rule, paired comparison, and separating model variance from test-set variance.
- **Depth `D`** — B won 4–2. Did B actually win?

### 17 · "It worked when I tried it" is not evidence.

`#17` · badge **15** · `<|say_it_with_me|>` · **1.5 min** · at **0:41** · `trim`

- **Run it** — ‘It worked when I tried it’ = not evidence. Demo = best case; eval = expected case.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 18 · Eval-driven development: the loop

`#18` · badge **16** · `<|how_professionals_actually_work|>` · **2.5 min** · at **0:42**

- **On screen** — *This is the job*
- **Run it** — **The loop = the job.** Prompt→eval→read failures→fix ONE thing→re-run. The pipeline cycles on its own — let it. ‘Failures are the syllabus.’

### 19 · Six ideas you own now

`#19` · badge **17** · `<|lock_it_in|>` · **2.5 min** · at **0:45**

- **Run it** — **Recall flips.** Class says each before clicking. Six ideas: anatomy, few-shot, step-by-step, hallucination, test set, the loop.

### 20 · Lab 2: the lie detector

`#20` · badge **18** · `<|50_minutes|>` · **52 min** · at **0:48**

- **Run it** — **2 min brief, then 50 MIN LAB.** Press L — the 50:00 countdown paces the room. Expected strings SHORT; diagnose every ✗; documentation is the deliverable — three iterations documented well beats five documented badly. A/B on their 10 Qs. **Links are on screen** — point at them.

### 21 · You can now prove whether AI is right.

`#21` · badge **19** · `<|short_break|>` · **3 min** · at **1:40**

- **Run it** — **Show & tell + break.** Best improvement + best caught lie + name the strongest hot-take counter-argument. ‘Model, scorer, or question?’ Next: AI gets eyes — have photos. **Links are on screen** — point at them.

---

*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: re-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*
