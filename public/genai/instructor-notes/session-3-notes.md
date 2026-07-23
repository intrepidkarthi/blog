# Session 3 — AI Beyond Text · Run Sheet

> Deep prep: work through `session-3-prep.md` first — this file is delivery-day only.

> Prep with `session-3-prep.md`. **Deck:** `session-3-ai-beyond-text.html` (17 slides, 7 interactives). Last session of Day 1 — energy management matters more than content here.

## Timing

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:06 | Recap quiz + big idea | 1–3 |
| 0:06–0:50 | Talk: vision (4–6) → generation (7–9) → voice/video (10) → one call (11) → failures (12) → seeds (13) | 4–13 |
| 0:50–0:56 | Recap flips + lab brief | 14–15 |
| 0:56–1:46 | **Lab 3** | — |
| 1:46–2:00 | Show & tell + **Day 1 close** (do not rush this) | 16 |

Post-lunch slot: open with your Seoul story (45 s) before the recap quiz if the room is flat.

## Slide beats

**3 · Same loop, new tokens.** THE bridge. "New eyes wired into the same brain" — everything from yesterday transfers.

**4 · Patchify (3 min).** Click through: grid → tokens → "same attention loop." The gopuram scene is intentionally the diffusion demo's scene too — call that out later for a callback laugh.

**6 · Will it read? (4 min).** Vote each. The CAPTCHA item plants Session 6's flag: **capability ≠ permission** — say those words.

**8 · Diffusion (5 min, centerpiece).** Drag the slider manually first (let them see static → shape), THEN hit Generate and narrate the denoise steps. Honest line is on the slide: the canvas fakes the visuals, the direction is the true idea.

**10 · Voice.** The family-password beat is serious — deliver it straight. "Tell your parents this weekend" gets nods; mean it.

**11 · One call.** The payoff: 4 lines. "Everything from Sessions 1–2 — prompting, format, evals — applies unchanged."

**12 · Vision failures.** Counting = S1's multiplication disease, in pixels. Blurred-text invention = S2's hallucination, in pixels. The course is rhyming — point it out.

**13 · Project seeds.** Read 2–3 with enthusiasm; "steal any of these for your capstone."

## Lab hour

- Photo upload friction is the #1 time sink: demo the folder-icon upload ONCE on the projector before releasing them.
- Push Part B until `json.loads` passes — students stop at "looks right." The parse crash IS the lesson.
- Part D inventions: collect the best 2 for show & tell.
- Colab + phone photos: HEIC files from iPhones may need `pillow-heif` — fallback: screenshot the photo, upload the PNG.

## Show & tell + Day 1 close (1:46–2:00)

Two best inventions from Part D. Then close Day 1 deliberately (slide 16): recap the four artifacts they built today, then the ONE overnight task — 2–3 real documents for tomorrow. Repeat it twice. Send a WhatsApp/group reminder tonight if you have a class group. "Sleep. Tomorrow we build for real."

## Anticipated questions

**"Is diffusion also next-token prediction?"** — No, different family: iterative denoising vs autoregressive tokens. Some newer image models ARE autoregressive (token-based); both families coexist. The slide teaches diffusion because it's the dominant intuition.

**"Can it recognize my face / find a person from a photo?"** — Chat models refuse identification by design. Purpose-built, regulated systems do face-match (KYC) — separate world, deliberately.

**"Can I generate images in today's lab?"** — API image generation on free tier is limited/changing; today is vision-in (reading). Generation gets a mention in the capstone if someone's keen — check current free-tier availability the night before.

**"Whose art did it learn from? Is that fair?"** — Honest answer: training data included human art at internet scale; courts and legislatures are actively fighting it out; watermarking/content-credentials are emerging. Both "it's theft" and "it's like humans learning from influence" have serious defenders. Don't pretend it's settled.

**"Tamil handwriting?"** — Noticeably weaker than English print but improving; their Part C data tells them exactly how much. That gap is a genuine project opportunity.
