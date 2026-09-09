# Session 3 — Run Sheet

### AI Beyond Text · 17 slides · 2:00 total

**Delivery-day document.** The concepts are in `session-3-prep.md`; this is the clock. 
Post-lunch, and it closes Day 1. Watch energy, and protect the overnight task on the last slide.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | AI beyond text: eyes, ears and a paintbrush | 1.5 min |  |
| 0:02 | 2 | Still true after the break? | 2.5 min |  |
| 0:04 | 3 | Same loop. New kinds of tokens. | 2 min |  |
| 0:06 | 4 | How a model reads a picture | 5 min | `D` |
| 0:11 | 5 | It doesn't just see. It reads. | 3.5 min |  |
| 0:14 | 6 | Will it read it? Place your bets | 5 min |  |
| 0:20 | 7 | Reading pictures is prediction. Generating them reverses noise. | 2.5 min |  |
| 0:22 | 8 | Diffusion: a picture emerges from static | 6 min | `D` |
| 0:28 | 9 | Image generation: magic with fine print | 3.5 min | `trim` |
| 0:32 | 10 | Speech: useful, but not uniformly solved | 4.5 min |  |
| 0:36 | 11 | Your mother’s voice is no longer proof of your mother. | 1.5 min | `trim` |
| 0:38 | 12 | All of it is one API call | 4 min | `D` |
| 0:42 | 13 | Where vision quietly fails | 5 min |  |
| 0:46 | 14 | Vision ideas that belong to Madurai | 3.5 min |  |
| 0:50 | 15 | Five ideas you own now | 3 min |  |
| 0:53 | 16 | Lab 3: interrogate your photos | 53 min |  |
| 1:46 | 17 | Day 1: you understand the machine. Day 2: you arm it. | 14 min |  |
| 2:00 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · AI beyond text: eyes, ears and a paintbrush** — Post-lunch — if flat, open with the Seoul story (45s) first. ‘Same machine, new kinds of tokens.’

**0:02 · 2 · Still true after the break?** — Recap quiz. Q on hallucination-in-pixels sets up today.

**0:04 · 3 · Same loop. New kinds of tokens.** — THE bridge: ‘new eyes wired into the same brain.’ Everything from yesterday transfers.

**0:06 · 4 · How a model reads a picture** — Patchify. Click grid→tokens→‘same attention loop.’ Hover a pill ↔ its patch. Note: this gopuram scene returns in the diffusion demo (callback). [D] deeper: ViT patches as tokens — resolution costs tokens quadratically, small text falls off a cliff, counting is structurally hard. Explains the failures on slide 13 in advance.

**0:11 · 5 · It doesn't just see. It reads.** — It doesn’t just see — it READS. The KYC card is your fintech credibility beat.

**0:14 · 6 · Will it read it? Place your bets** — GAME. Vote each. CAPTCHA item is a trick question — it plants ‘capability ≠ permission’ — say those words (Session 6 flag).

**0:20 · 7 · Reading pictures is prediction. Generating them reverses noise.** — ‘Reading is prediction; making is un-destruction.’ Set up diffusion. The 4o token-by-token aside is one breath — don’t derail.

**0:22 · 8 · Diffusion: a picture emerges from static** — CENTERPIECE. Drag the slider slowly left→right — narrate ‘shapes arrive before details’: silhouette ~15, sun ~30, window ~45. THEN Generate. Honest: canvas fakes the pixels, the coarse-to-fine direction is true. [D] deeper: the network predicts the noise , not the image; steps / guidance / seed; latent diffusion. Open it when someone asks what the sliders in an image tool do.

**0:28 · 9 · Image generation: magic with fine print** — Honest limits: subtle details, style ethics, deepfakes. Land the camera line slowly. ‘Plausible not verified — now in pixels.’

**0:32 · 10 · Speech: useful, but not uniformly solved** — Hit the three stats first — 3 s, ~₹0, ∞. Family-password beat is serious — deliver straight. ‘Tell your parents this weekend.’

**0:36 · 11 · Your mother’s voice is no longer proof of your mother.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Invite disagreement — take one counter-argument now, park the rest for the break.

**0:38 · 12 · All of it is one API call** — The payoff: 4 lines. contents=[img, question]. Run it — the highlight finds the total, then the JSON lands. ‘Prompting, format, evals — all apply unchanged.’ New beat: response_schema = guaranteed JSON — lab does both ways. [D] deeper: constrained decoding — a schema masks illegal tokens to −∞ at the decoder, so json.loads cannot fail. Pairs with lab cell 4b.

**0:42 · 13 · Where vision quietly fails** — Failure flips. Counting = S1 multiplication disease in pixels — run the dot flash, the room estimates too. Blur-invention = S2 hallucination in pixels. The course rhymes.

**0:46 · 14 · Vision ideas that belong to Madurai** — Read 2–3 Madurai project seeds with enthusiasm. ‘Steal any for your capstone.’

**0:50 · 15 · Five ideas you own now** — Recall flips. Class says each before clicking.

**0:53 · 16 · Lab 3: interrogate your photos** — 3 min brief, then 50 MIN LAB. Demo the folder-upload ONCE first. Push Part B until json.loads passes. Collect 2 best inventions. Links are on screen — point at them.

**1:46 · 17 · Day 1: you understand the machine. Day 2: you arm it.** — Show & tell + DAY 1 CLOSE — don’t rush. Recap 4 artifacts built. Name the strongest hot-take counter-argument. ONE overnight task: 2–3 real documents. Say it twice. ‘Sleep. Tomorrow we build for real.’ Links are on screen — point at them.

---

## The lab hour

Slide 16, 53 minutes. Two-minute brief, then hands off.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Do not rush the close. ONE overnight task: bring 2–3 real documents. Say it twice.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the opening of the next block.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
