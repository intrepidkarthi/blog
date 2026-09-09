# Session 3 — Slide-by-Slide Cheat Sheet

### Session 3 · AI Beyond Text · 17 slides · 2:00 total

The lightest session to deliver and the most fun to watch. Uploads are the time sink.

One card per slide, generated from `presentations/session-3-ai-beyond-text.html` itself, so nothing here can drift from what is on screen. **#** is the deck position — it matches the `17 / 17` counter in the footer and the `#17` deep link. **Badge** is the number printed in the slide’s top-left corner; the two differ because title and lab slides are not badged. Press **S** in the deck for the same notes with a live timer.

**`trim`** marks a slide the deck itself flags **compressible** — press S and you will see `▸ compressible` on it. These are the first things to shorten when you are behind, not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** to open it, and only open it if the room asks.

---

## At a glance

| At | # | Badge | Slide | Budget | |
|---|---|---|---|---|---|
| 0:00 | 1 | — | AI beyond text: eyes, ears and a paintbrush | 1.5 min |  |
| 0:02 | 2 | 01 | Still true after the break? | 2.5 min |  |
| 0:04 | 3 | 02 | Same loop. New kinds of tokens. | 2 min |  |
| 0:06 | 4 | 03 | How a model reads a picture | 5 min | `D` |
| 0:11 | 5 | 04 | It doesn't just see. It reads. | 3.5 min |  |
| 0:14 | 6 | 05 | Will it read it? Place your bets | 5 min |  |
| 0:20 | 7 | 06 | Reading pictures is prediction. Generating them reverses noise. | 2.5 min |  |
| 0:22 | 8 | 07 | Diffusion: a picture emerges from static | 6 min | `D` |
| 0:28 | 9 | 08 | Image generation: magic with fine print | 3.5 min | `trim` |
| 0:32 | 10 | 09 | Speech: useful, but not uniformly solved | 4.5 min |  |
| 0:36 | 11 | — | Your mother’s voice is no longer proof of your mother. | 1.5 min | `trim` |
| 0:38 | 12 | 10 | All of it is one API call | 4 min | `D` |
| 0:42 | 13 | 11 | Where vision quietly fails | 5 min |  |
| 0:46 | 14 | 12 | Vision ideas that belong to Madurai | 3.5 min |  |
| 0:50 | 15 | 13 | Five ideas you own now | 3 min |  |
| 0:53 | 16 | 14 | Lab 3: interrogate your photos | 53 min |  |
| 1:46 | 17 | 15 | Day 1: you understand the machine. Day 2: you arm it. | 14 min |  |
| 2:00 | | | *end* | | |

---

## The cards

### 1 · AI beyond text: eyes, ears and a paintbrush

`#1` · `<|generative_ai_foundations_&_applications|>` · **1.5 min** · at **0:00**

- **Run it** — Post-lunch — if flat, open with the Seoul story (45s) first. ‘Same machine, new kinds of tokens.’

### 2 · Still true after the break?

`#2` · badge **01** · `<|90_second_recap|>` · **2.5 min** · at **0:02**

- **On screen** — *True or false*
- **Run it** — **Recap quiz.** Q on hallucination-in-pixels sets up today.

### 3 · Same loop. New kinds of tokens.

`#3` · badge **02** · `<|the_one_idea_again|>` · **2 min** · at **0:04**

- **Run it** — THE bridge: ‘new eyes wired into the same brain.’ Everything from yesterday transfers.

### 4 · How a model reads a picture

`#4` · badge **03** · `<|live_demo|>` · **5 min** · at **0:06** · `D`

- **On screen** — *Image → patches → tokens*; buttons: **Patchify →**
- **Run it** — **Patchify.** Click grid→tokens→‘same attention loop.’ Hover a pill ↔ its patch. Note: this gopuram scene returns in the diffusion demo (callback). **[D] deeper:** ViT patches as tokens — resolution costs tokens quadratically, small text falls off a cliff, counting is structurally hard. Explains the failures on slide 13 in advance.
- **Depth `D`** — a patch is a token, so an image has a token bill

### 5 · It doesn't just see. It reads.

`#5` · badge **04** · `<|what_ai_with_eyes_actually_does|>` · **3.5 min** · at **0:11**

- **Run it** — It doesn’t just see — it READS. The KYC card is your fintech credibility beat.

### 6 · Will it read it? Place your bets

`#6` · badge **05** · `<|vote_before_the_reveal|>` · **5 min** · at **0:14**

- **On screen** — *Yes or no*
- **Run it** — **GAME. Vote each.** CAPTCHA item is a trick question — it plants ‘capability ≠ permission’ — say those words (Session 6 flag).

### 7 · Reading pictures is prediction. Generating them reverses noise.

`#7` · badge **06** · `<|now_the_other_direction|>` · **2.5 min** · at **0:20**

- **Run it** — ‘Reading is prediction; making is un-destruction.’ Set up diffusion. The 4o token-by-token aside is one breath — don’t derail.

### 8 · Diffusion: a picture emerges from static

`#8` · badge **07** · `<|live_demo|>` · **6 min** · at **0:22** · `D`

- **On screen** — *Drag the slider and watch the shapes arrive before the details — or hit Generate*; buttons: **Generate**
- **Run it** — **CENTERPIECE. Drag the slider slowly left→right** — narrate ‘shapes arrive before details’: silhouette ~15, sun ~30, window ~45. THEN Generate. Honest: canvas fakes the pixels, the coarse-to-fine direction is true. **[D] deeper:** the network predicts the *noise*, not the image; steps / guidance / seed; latent diffusion. Open it when someone asks what the sliders in an image tool do.
- **Depth `D`** — what the network is actually trained to output

### 9 · Image generation: magic with fine print

`#9` · badge **08** · `<|honest_limits|>` · **3.5 min** · at **0:28** · `trim`

- **Land it** — Land the camera line slowly.
- **Run it** — Honest limits: subtle details, style ethics, deepfakes. ‘Plausible not verified — now in pixels.’.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 10 · Speech: useful, but not uniformly solved

`#10` · badge **09** · `<|ears_and_a_voice|>` · **4.5 min** · at **0:32**

- **Run it** — Hit the three stats first — 3 s, ~₹0, ∞. **Family-password beat is serious — deliver straight.** ‘Tell your parents this weekend.’

### 11 · Your mother’s voice is no longer proof of your mother.

`#11` · `<|hot_take · argue_with_me|>` · **1.5 min** · at **0:36** · `trim`

- **On screen** — full-bleed hot take
- **Run it** — **Pick the fight deliberately.** Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.
- **Behind?** — the deck flags this one compressible. Shorten or drop it before you rush anything else.

### 12 · All of it is one API call

`#12` · badge **10** · `<|the_best_part|>` · **4 min** · at **0:38** · `D`

- **On screen** — *Canned run — the real one is your lab*; buttons: **Run it**
- **Run it** — The payoff: 4 lines. contents=[img, question]. Run it — the highlight finds the total, then the JSON lands. ‘Prompting, format, evals — all apply unchanged.’ New beat: response_schema = guaranteed JSON — lab does both ways. **[D] deeper:** constrained decoding — a schema masks illegal tokens to −∞ at the decoder, so json.loads cannot fail. Pairs with lab cell 4b.
- **Depth `D`** — why a schema beats begging for JSON

### 13 · Where vision quietly fails

`#13` · badge **11** · `<|guess_why_then_click|>` · **5 min** · at **0:42**

- **On screen** — buttons: **Flash the dots**
- **Run it** — **Failure flips.** Counting = S1 multiplication disease in pixels — run the dot flash, the room estimates too. Blur-invention = S2 hallucination in pixels. The course rhymes.

### 14 · Vision ideas that belong to Madurai

`#14` · badge **12** · `<|capstone_sparks · steal_any_of_these|>` · **3.5 min** · at **0:46**

- **Run it** — Read 2–3 Madurai project seeds with enthusiasm. ‘Steal any for your capstone.’

### 15 · Five ideas you own now

`#15` · badge **13** · `<|say_it_before_you_click|>` · **3 min** · at **0:50**

- **Run it** — **Recall flips.** Class says each before clicking.

### 16 · Lab 3: interrogate your photos

`#16` · badge **14** · `<|50_minutes · same_rhythm|>` · **53 min** · at **0:53**

- **Run it** — **3 min brief, then 50 MIN LAB.** Demo the folder-upload ONCE first. Push Part B until json.loads passes. Collect 2 best inventions. **Links are on screen** — point at them.

### 17 · Day 1: you understand the machine. Day 2: you arm it.

`#17` · badge **15** · `<|day_1_complete|>` · **14 min** · at **1:46**

- **Run it** — **Show & tell + DAY 1 CLOSE — don’t rush.** Recap 4 artifacts built. Name the strongest hot-take counter-argument. ONE overnight task: 2–3 real documents. Say it twice. ‘Sleep. Tomorrow we build for real.’ **Links are on screen** — point at them.

---

*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: re-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*
