# Session 3 — Instructor Prep Pack

### AI Beyond Text: Eyes, Ears and a Paintbrush · 17 slides · 2 hours

**What this file is.** The level under every slide. `session-3-notes.md` is the delivery-day run sheet. Slide numbers are the deck's own, generated from `presentations/session-3-ai-beyond-text.html`.

**This session runs after lunch and closes Day 1.** Two consequences: energy management is a real part of the job, and slide 17 is not a normal close — it is the Day 1 close and it carries the overnight task that Session 4 depends on.

---

## 1 · The spine

1. **Same loop, new kinds of tokens** (3–4) — nothing from yesterday is discarded; an image becomes tokens and enters the same attention loop.
2. **It doesn't just see — it reads** (5–6) — and capability is not permission.
3. **Reading is prediction; making is un-destruction** (7–8) — diffusion reversed.
4. **Every capability comes with fine print** (9–11) — deepfakes, voice, and the fight worth picking.
5. **It is all one API call** (12) — everything from Sessions 1 and 2 transfers unchanged.
6. **It fails in the same shapes as before** (13) — counting is multiplication in pixels; blur-invention is hallucination in pixels.

**The line that makes the session cohere:** *"the course rhymes."* Every failure today is a failure they already met, wearing new clothes.

---

## 2 · Slide by slide

### Slides 1–3 · Opening, recap, the bridge · 6 min

**On screen.** Title; a recap quiz whose hallucination question sets up today; then the bridge slide.

**The move.** Post-lunch. If the room is flat, open with the Seoul story for forty-five seconds *before* the title. The story, in three lines — *[Karthik: replace with your own K-Startup Seoul story; this is a placeholder shape, not your biography]*: you are in a Seoul accelerator pitch room, a founder demos an app that reads a photographed menu and answers questions about it, and half the room assumes it is a separate "vision AI"; you ask to see the code and it is the same text model with an image in `contents` — one API call. The point of the story is the bridge sentence that follows it, so end on *"same machine, new kind of token."* Then the bridge, which is the most important sentence of the first ten minutes: **"new eyes wired into the same brain."** Everything from yesterday transfers.

**Landmine.** Do not let this feel like a new subject. If the room thinks vision is a separate topic, slide 12's payoff dies.

### Slide 4 · How a model reads a picture · 5 min · `[D]`

**On screen.** An image being patchified into a grid, then into tokens; hovering a token pill highlights its patch.

**The move.** Click grid → tokens → *"same attention loop."* Hover a pill and its patch together. Note aloud that this gopuram scene returns in the diffusion demo — the callback pays off on slide 8.

**One level under.** A vision transformer cuts the image into fixed patches, linearly projects each into a vector, adds a positional embedding and feeds the sequence to the same attention stack. A patch is a token in every sense that matters, including billing.

**Depth panel `[D]`.** *A patch is a token, so an image has a token bill* — resolution drives token count drives cost.

**Hardest question.** *"Does it see the whole image at once?"* — Every patch attends to every other patch, so effectively yes, but there is no retina and no fovea. Resolution is decided before the model sees anything.

### Slides 5–6 · It reads; place your bets · 8.5 min

**On screen.** A KYC card being read; then a betting game on what the model will and will not read.

**The move.** The KYC card is your fintech credibility beat — most rooms have not seen a model read a form. On slide 6 the room votes on each item. The CAPTCHA item is a deliberate trick: the model *can*, and the answer is that **capability is not permission**. Say those exact words and flag them forward to Session 6.

**Landmine.** Do not let the CAPTCHA item become a how-to. The point is the distinction, and it is an ethics beat, not a technique.

### Slides 7–8 · Reading is prediction; diffusion · 8.5 min · `[D]`

**On screen.** The framing sentence; then the diffusion slider running static → image, with a Generate button.

**The move.** *"Reading is prediction; making is un-destruction."* The GPT-4o token-by-token aside is one breath — do not derail into it. Then the centrepiece: drag the slider slowly left to right and narrate that **shapes arrive before details** — silhouette around step 15, sun around 30, window around 45. Then press Generate.

**One level under.** Training adds known noise to a real image and asks the network to predict the noise that was added. At generation time you start from pure noise and subtract predicted noise repeatedly. That is why coarse structure resolves first: the low-frequency content is the easiest signal to recover.

**Depth panel `[D]`.** *What the network is actually trained to output* — it predicts the noise, not the picture. This is the twist that makes diffusion trainable and it is the single most satisfying idea in the session.

**Landmine.** The canvas fakes the pixels. The coarse-before-fine *ordering* is real and is the teaching point; say which part is honest before anyone asks.

### Slides 9–11 · Fine print; speech; the fight · 9.5 min · `trim` at 9 and 11

**On screen.** Generation limits and ethics; three speech statistics; then the hot take.

**The move.** Deliver the camera line slowly — *"plausible, not verified — now in pixels."* On speech, hit the three numbers first: three seconds of audio, roughly zero cost, unlimited output. Then the family-password beat, delivered straight, no jokes: **tell your parents this weekend.** Then slide 11, the hot take: read once, slowly, three seconds of silence, take one counter-argument, park the rest.

**One level under.** Voice cloning from a few seconds is a real, deployed capability. The defence that actually works is a shared secret out of band — a family password — because it does not depend on detecting the fake.

**Landmine.** Do not turn this into fear. The room should leave with one action they can take, not with anxiety.

### Slide 12 · All of it is one API call · 4 min · `[D]`

**On screen.** Four lines of code; `contents=[img, question]`; a highlight finds the total and JSON lands.

**The move.** This is the payoff of the whole session. Run it. *"Prompting, format, evals — all apply unchanged."* Then the new beat: `response_schema`.

**Depth panel `[D]`.** *Why a schema beats begging for JSON* — in the lab they do it both ways, and the prompt-only version works until it doesn't.

**One level under.** A schema constrains decoding so a malformed *shape* is unreachable, rather than merely discouraged. That is a different guarantee from asking politely, and it is the honest answer to Session 2's format slide. It is not a guarantee about *values* (a confidently wrong total parses fine — allow `null`) and truncation at `max_output_tokens` can still cut JSON mid-object, so the lab keeps its `try/except`.

### Slides 13–15 · Where vision fails; Madurai seeds; five ideas · 11.5 min

**On screen.** Failure flips; local project seeds; recall flips.

**The move.** Run the dot flash on the counting failure and let the room estimate too — they will also be wrong, and that is the point. Name the rhyme out loud: counting is Session 1's multiplication disease in pixels; blur-invention is Session 2's hallucination in pixels. Then read two or three Madurai seeds with genuine enthusiasm — *"steal any of these for your capstone."*

**One level under.** Counting fails because there is no iterative counting procedure; the model estimates from a single forward pass, exactly as it does with arithmetic. Blur-invention fails because the prior fills what the pixels do not determine.

### Slide 16 · Lab 3: interrogate your photos · 53 min

**The move.** Three-minute brief, then fifty minutes. Demo the folder upload **once** yourself first — it is the single biggest time sink. Push Part B until `json.loads` actually passes; that is the checkpoint that matters. Collect two best inventions for show and tell.

**Lab shape:** A interrogation ladder (10) · B document → JSON (10) · the `response_schema` production way (5) · C handwriting (10) · D break it (10).

### Slide 17 · Day 1: understand the machine. Day 2: arm it · 14 min

**The move.** Do not rush this. Show and tell, then recap the four artifacts built across Day 1, then name the strongest counter-argument the room gave to slide 11. Then **one** overnight task: bring two or three real documents. **Say it twice.** Session 4 does not work without them.

**Landmine.** If you let this slide compress, Session 4 opens with half the room having nothing to ingest. It is the highest-leverage two minutes of Day 1.

---

## 3 · The depth layer in this deck

| Slide | Panel | Open it when |
|---|---|---|
| 4 | A patch is a token, so an image has a token bill | someone asks what an image costs |
| 8 | What the network is actually trained to output — it predicts the noise | someone asks how diffusion is trained |
| 12 | Why a schema beats begging for JSON | someone asks why their JSON parse failed |

---

## 4 · Q&A bank

**"Can it read Tamil handwriting?"** — Sometimes, unreliably, and the lab's Part C is where they find out on their own documents. Honest answer beats a promise.

**"Is the image model the same model?"** — Usually a different model in the same family, sometimes the same multimodal model. The API surface is what you teach; the packaging changes.

**"Can I detect a deepfake?"** — Detection is an arms race and you should not build a product on it. Provenance and out-of-band verification are the defences that hold.

**"Why is my JSON sometimes broken?"** — Because you asked rather than constrained. Use `response_schema` — slide 12's depth panel.

**"How much does an image cost?"** — Resolution-dependent, because resolution sets patch count sets tokens. Slide 4's depth panel has the arithmetic.

---

## 5 · Misconceptions

| They believe | Say this |
|---|---|
| Vision is a different kind of AI | Patches become tokens and enter the same attention loop (3–4) |
| Diffusion draws like a person | It removes predicted noise, repeatedly; shapes before details (8) |
| It can count what it can see | Counting is one forward pass, not a procedure — same disease as arithmetic (13) |
| Asking for JSON gives valid JSON | A schema constrains; a prompt requests (12) |
| It can read the image, so it may | Capability is not permission — flagged here, cashed in Session 6 (6) |

---

## 6 · Timing pressure map

Budgets total 120 minutes including a 53-minute lab, so this session is **tight** — the same shape as Session 1.

Cut in this order: slide 14 Madurai seeds (read one, not three) · slide 6 betting game (three items, not all) · slide 15 recall flips.

Never compress: slide 8 (the diffusion drag), slide 12 (the payoff), or slide 17 (the Day 1 close and the overnight task).

The deck flags slides 9 and 11 **compressible** (press **S** to see the marker).

---

## 7 · Day-before checklist

Drag the diffusion slider end to end and confirm the silhouette-then-detail ordering is visible on the projector — it is subtle on a washed-out screen. Slide 12's demo is a canned run (the highlight and the JSON are scripted, not a live call) — the live version is Lab 3 Part B, so run the notebook's extraction cell on a real key with your own receipt the day before. Have two or three of your own photos ready, including one bill and one piece of handwriting, so you can demo the lab yourself if uploads fail. Confirm `response_schema` still behaves on the pinned model — `fact-check.md`, volatile rows verified 2026-08-03.
