# Session 3 — Instructor Prep Pack
### the deep version

Study time: ~2.5 h. This is the mastery document for the session, not the run sheet — delivery-day choreography lives in `session-3-notes.md`. Deck: `../presentations/session-3-ai-beyond-text.html` (17 slides, 7 interactives). Companion reading: Part 3 of `../LEARNING-GUIDE.md`, lab at `../labs/session-3/`.

---

## 1. Narrative spine — the session as one argument

Six beats. If you can say these out loud in 3 minutes without looking, you own the session:

1. **The loop never cared what tokens mean.** Session 1's machine reads embeddings, not words. So anything you can chop into embedding-sized pieces, it can read.
2. **Images become patch-tokens** (chop into squares → embed → same attention loop), **audio becomes slice-tokens**. "Multimodal" is new eyes wired into the same brain — not a new brain.
3. **Reading images is prediction. Making them is un-destruction**: diffusion learns to remove noise, then "removes" its way out of pure static, steered by the prompt. (One nuance held in reserve: 4o-style image generation is autoregressive — the loop ate images too.)
4. **Voice is solved enough to be dangerous**: STT near-human, TTS convincing, cloning needs seconds → family code word. The hot take lives here.
5. **All of it is one API call** — `contents=[img, question]` — so everything from S1–S2 (prompting, format control, evals) transfers unchanged. New production beat: `response_schema` makes JSON *guaranteed*, not begged-for.
6. **The failures transfer too**: counting, spatial precision, blurred text → plausible invention. Hallucination in pixels. The course rhymes, and you say so.

**The 3-minute test:** deliver beats 1–6 as one continuous argument, out loud, standing up. If you stall anywhere, that beat's deep-dive below is the one you haven't internalized.

---

## 2. Concept deep-dives — slide by slide

### Slide 1 · Title & Slide 2 · Recap quiz

**Claim:** the recap quiz re-tests four S1–S2 load-bearing facts before building on them.

**Why these four items:** (1) few-shot never updates weights — in-context only; (2) evals run at temperature 0, three times, averaged; (3) tone and truth are uncorrelated; (4) grounding ("answer only from stated facts") is the single most valuable constraint line. Items 3 and 4 are chosen deliberately: today re-derives both *in pixels* (blurred-text invention, and the grounding fix in Lab Stretch 1). If the room bombs item 4, slow down at slide 13 — they'll need the callback spelled out.

**Landmine:** don't re-teach S1 here. Wrong answers get the one-line feedback baked into the quiz, nothing more. Budget is 2.5 min.

### Slide 3 · Same loop, new kinds of tokens

**Claim:** multimodal = the same transformer with new token types in the same context.

**Mechanism, one level deeper:** a transformer block consumes a sequence of vectors; nothing in attention or the MLP knows whether a vector came from text. Modern multimodal models bolt a *vision encoder* (a ViT, usually contrastively pretrained à la CLIP/SigLIP on image–caption pairs) onto the language model via a small projection layer that maps patch embeddings into the LM's embedding space. After projection, image tokens and text tokens sit in one interleaved sequence and attend to each other freely. That single shared context is the entire reason `contents=[img, "what's the total?"]` works: the question's tokens attend directly to the receipt's patch tokens.

**Worked example (whiteboard):** write a 3-dim toy. Text token "sun" → [0.9, 0.1, 0.3]. A yellow-circle patch from a photo → vision encoder → projector → [0.85, 0.15, 0.28]. Same space, dot product 0.885 — the machine treats a picture of the sun and the word "sun" as near-neighbours. That's the whole trick; everything else is scale.

**Pushback:**
- *"So is it one network or two?"* — Two encoders, one brain. The vision encoder is a separate pretrained tower, but from the first transformer layer onward it's one model, one context, one attention.
- *"Why did vision arrive so fast after ChatGPT?"* — Because the hard part (the attention loop, 2017) was already built; ViT (Dosovitskiy et al., 2020) showed patches slot straight in. Fusing the two was engineering, not new science.

**Landmine:** never say "it sees like humans." Patches + attention ≠ human vision, and slide 13's failure modes are the proof. Also don't say multimodality required "a new architecture" — the punchline is that it didn't.

### Slide 4 · Patchify demo — how a model reads a picture

**Claim:** image → grid of patches → embeddings → same attention loop.

**Mechanism:** ViT splits the image into fixed-size squares (14×14 or 16×16 px), flattens each patch's pixels into a vector, multiplies by one learned projection matrix to get an embedding, adds a *2D position embedding* (so the model knows where each patch sat), and feeds the sequence to a standard transformer. High-res models then *pool* neighbouring patch embeddings (e.g., 16:1 average pooling) before handing them to the language model, because 4,096 tokens per image is too expensive to attend over per photo.

**Worked example — the patch math, with real numbers (do this on the board):**
- Gemma-3-class vision encoder: input normalized to **896×896 px**, patch size **14 px**.
- 896 / 14 = **64** patches per side → 64 × 64 = **4,096 raw patches**.
- Pooled 16:1 → **256 vision tokens** handed to the LM. That's why Gemini-family billing shows a flat **~258 tokens per image** (256 pooled patches + a couple of boundary tokens); big images are tiled into 768×768 crops at ~258 tokens each.
- **Cost of reading one mess bill on Gemini 3.5 Flash** — what `gemini-flash-latest` serves today ($1.50/1M input, $9.00/1M output, ₹95.5/USD):
  - input: 258 tokens × $1.50/1M = $0.000387 ≈ **₹0.037** — under four paise;
  - output: ~120 JSON tokens × $9.00/1M = $0.00108 ≈ **₹0.103**;
  - total ≈ **₹0.14 per receipt → 1,000 receipts ≈ ₹140** — two jigarthandas on the slide's receipt. Say that line; it lands.
- Same job at the retired 2.5 Flash rates ($0.30/$2.50): ≈ ₹0.036/receipt, ~₹36 per thousand — pricing moved ×5 in / ×3.6 out in one generation; the "right model for the job" thread from S1 continues.

**Pushback:**
- *"If a whole image is ~258 tokens, isn't that massively lossy?"* — Yes, deliberately. 896×896×3 bytes ≈ 2.4 MB of pixels compressed into 256 vectors. That lossiness is exactly why fine print, exact counts, and tiny details fail (slide 13). Great question — it means they've understood.
- *"How does the model know where a patch was?"* — Learned 2D position embeddings added to each patch, same idea as text positions. They're a *summary* of position, not coordinates — which is why precise left/right relations blur.
- *"Why 14×14 and not per-pixel attention?"* — Attention is O(n²) in sequence length. 896² pixels ≈ 800K tokens → ~6×10¹¹ attention pairs per layer. Patches make it tractable; pooling makes it cheap.

**Landmine:** the demo's 24-patch grid is a teaching scale — real models use thousands of patches plus tiling. Say "twenty-four here, four thousand in the real encoder" during the demo, unprompted.

### Slide 5 · What AI with eyes actually does

**Claim:** the shipped value of vision is *reading* — documents, handwriting, charts, screens — not "seeing."

**Mechanism — why VLMs can read text in images with no OCR engine:** there is no Tesseract inside. Reading is a *learned* capability: the training corpus (web image–caption pairs, plus deliberately added document/screenshot/synthetic-OCR data) is full of images containing text paired with strings containing that text. At sufficient scale and input resolution, predicting the caption forces the encoder to represent glyphs, and the LM to decode them — OCR *emerges from the training objective*, the same way translation emerged from text pretraining. Two consequences you can predict from this: (a) it reads in-context like a language model (great at smudged-but-guessable words, because priors fill gaps), and (b) exactly those priors invent text that isn't there (slide 13). For mission-critical OCR, production systems still often run a dedicated OCR engine and use the LLM for cleanup/structuring — both patterns are legitimate.

**Worked example:** photograph any printed page, ask "read all text exactly as written," and then ask the same of a page held at a 45° angle in bad light. The first is near-perfect, the second degrades word-by-word rather than failing outright — classic learned-reader behaviour, not engine behaviour.

**Pushback:** *"Is emergent OCR accurate enough for banking?"* — For structuring and cross-checks, yes; as the sole extractor for regulated fields, usually paired with dedicated OCR + human review. This is your KYC day-job beat — one concrete war story here is worth all six cards.

**Landmine:** don't claim doctor's handwriting is "solved" — the will-it-read quiz itself says "mostly, verify anything that matters."

### Slide 6 · Will it read? (vote game)

**Claim:** four calibration votes: printed page (yes), prescription (mostly), blurred plate (no — and worse, confident guess), CAPTCHA (can, but refuses).

**Mechanism per item:** printed text = densest pattern in training data. Handwriting = high variance, prior-driven completion. Motion blur destroys glyph information — the model's language prior then *supplies* a plausible plate; blur + confidence is the danger zone. CAPTCHA: capability exists, policy refuses — trained-in refusal, because solving CAPTCHAs enables abuse.

**The one sentence that must be said:** "**capability ≠ permission**" — this plants Session 6's flag. Say those exact words.

**Landmine:** don't let the CAPTCHA item become a jailbreak tutorial. If someone says "I got it to solve one," respond: "Yes — refusals are training, not physics; that arms race is Session 6," and move on.

### Slide 7 · Reading is prediction, making is un-destruction

**Claim:** most image generators are not next-token machines; they're denoisers run in reverse.

**Mechanism + the 4o nuance (one breath on stage, full depth here):** two families coexist in 2026.
- **Diffusion** (Stable Diffusion, Imagen, Midjourney-class): iterative denoising, next slide.
- **Autoregressive** (GPT-4o-style images, and successors): the image is represented as a sequence of *discrete visual tokens* from a learned codebook (a visual vocabulary — each token ≈ one small texture/shape fragment), generated left-to-right, top-to-bottom by the *same* transformer that writes text. This is why 4o-class images famously render long correct text and follow conversational edits ("same image, but make the sign say OPEN") — the language model literally *is* the image model, with full attention over the conversation. Trade-off: token-by-token generation is slower, and diffusion still tends to win on high-res texture; some systems are hybrids (AR planner + diffusion decoder).

**Pushback:** *"So which family is 'the future'?"* — Don't die on either hill. AR is winning on instruction-following and text rendering; diffusion on speed-per-quality and open-source ecosystem. The honest answer is "both, often combined."

**Landmine:** the 4o aside on the slide is one breath. The depth above is for Q&A, not for the talk track — the presenter note says don't derail, believe it.

### Slide 8 · Diffusion demo — a picture emerges from static

**Claim:** train by destroying images with noise and learning to repair each step; generate by "repairing" pure noise, steered by the prompt.

**The actual training objective (whiteboardable):** take a real image `x₀`. Pick a random timestep `t`. Sample Gaussian noise `ε`. Build the noised image in one shot: `x_t = √(ᾱ_t)·x₀ + √(1−ᾱ_t)·ε`, where `ᾱ_t` slides from ~1 (clean) to ~0 (pure noise). The network `ε_θ(x_t, t, prompt)` is trained to **predict the noise** that was added; the loss is simply the mean-squared error on the noise residual: `‖ε − ε_θ‖²`. That's the whole objective (Ho et al., 2020). No adversary, no likelihood gymnastics — "guess what I added, be graded on the difference."

**Worked example with real numbers — one-pixel diffusion:** pixel value x₀ = 0.8 (bright). Noise draw ε = −0.5. At a timestep where ᾱ_t = 0.5: x_t = 0.707×0.8 + 0.707×(−0.5) = 0.566 − 0.354 = **0.212**. The network sees 0.212 and t, and must output −0.5. If it predicts −0.4, loss = (−0.5 − (−0.4))² = **0.01**. Nudge weights, repeat a few billion times across billions of images. A professor will recognize this instantly as denoising score matching; students will recognize it as "the same guess-and-nudge from Session 1 with a different target."

**The inference walk (one honest paragraph):** start from pure Gaussian noise `x_T`. For ~50 steps (fewer with modern samplers): predict the noise in the current image, subtract a calibrated fraction of it, re-inject a controlled amount of fresh noise, repeat. Low spatial frequencies (silhouettes, sky/ground split) survive noise longest, so they're recovered first; high frequencies (edges, windows, jewellery) come last — that's the real reason for the coarse-to-fine choreography the canvas shows. **Classifier-free guidance** is the prompt-obedience dial: at every step the network runs twice — once with the prompt, once without — and the update is extrapolated *away* from the unconditional prediction: `ε̂ = ε_uncond + g·(ε_cond − ε_uncond)` with g ≈ 5–8. Higher g = more literal prompt-following, less diversity, eventually fried colours. Production systems (Stable Diffusion family) run all of this in a VAE-compressed *latent* space (~48× fewer values than pixels), which is why it's fast enough to sell.

**What the canvas honestly fakes:** the demo is a linear cross-fade between a fixed noise field and a block-mosaic of the clean gopuram scene — block size shrinks and noise weight falls as t². No network, no sampling; the "denoise step n/50" label is cosmetic. **The choreography is true (coarse first, details last); the pixels are theatre.** Say this before anyone asks.

**Pushback:**
- *"Why 50 steps — why can't it jump straight to the image?"* — Each step's prediction is only accurate near its noise level; one giant jump lands off the image manifold. But this is a live frontier: distilled/consistency models genuinely do 1–4 step generation in 2026, trading a little quality.
- *"Where does the prompt physically enter?"* — Prompt → text-encoder embeddings → cross-attention layers inside the denoiser; every denoising step attends to the prompt tokens. Same attention mechanism, third appearance today.
- *"Is it copying training images?"* — It learns the statistics of images, not a database; there is no image lookup at inference. Researchers *have* extracted near-copies of heavily duplicated training images in edge cases — so say "overwhelmingly synthesis, with documented rare memorization," not "never copies."

**Landmine:** don't call diffusion "just denoising a JPEG" — the model *invents* content consistent with the prompt; there is no original hiding under the noise at generation time. That's the whole point of the "picture that was never there" line.

### Slide 9 · Image generation: magic with fine print (▸ compressible)

**Claim:** three honest limits — subtle detail lies, unresolved style/copyright ethics, and the deepfake era.

**Mechanism:** detail lies are the residue of the coarse-to-fine process — high-frequency content is generated last and least constrained (dense small text, logos, jewellery, background faces). Style debates: training included human art at internet scale; courts and legislatures are actively contesting it — both "theft" and "influence, like human learning" have serious defenders; do not pretend it's settled. Deepfakes: the counter-move is *provenance* — cryptographically signed content credentials (C2PA) and embedded watermarks (SynthID-class) — because post-hoc "AI detectors" are unreliable and adversarially fragile.

**Pushback:** *"Can't we just detect AI images?"* — Detection is a losing arms race; provenance flips the burden: instead of proving an image is fake, you prove a real one is real. Neither is complete — watermarks can be degraded by cropping/re-encoding.

**Landmine:** the six-finger meme is *stale* — models fixed hands long ago. The slide says so; don't resurrect it as a current tell. The camera line ("200 years earning trust, ended in two") is the emotional peak — deliver it slowly, then stop.

### Slide 10 · Speech: solved enough to be dangerous

**Claim:** 3 s of audio clones a voice, at ~₹0, and your voice is already public.

**Mechanism — 2026 state:**
- **STT:** Whisper-class encoder-decoders trained on weakly-supervised audio–text at scale, plus native-audio LLMs — Gemini takes audio straight in `contents` at **~32 tokens per second of audio**. Tamil–English code-switching is genuinely decent; "lectures → notes" is a solved problem.
- **TTS:** near-indistinguishable for short clips — prosody, pauses, emotion. Real-time speech-to-speech assistants (sub-second latency) shipped across all major providers.
- **Cloning mechanics (the part to be able to whiteboard):** modern zero-shot TTS treats speech as *tokens too* — a neural audio codec compresses sound into discrete acoustic tokens; a transformer is trained to continue an acoustic-token sequence given text. Hand it 3 seconds of *your* voice as the acoustic prefix and the model continues *in your voice*, saying whatever the text says. Three seconds suffices because voice identity (pitch, timbre, accent statistics) is low-dimensional compared to content — a prefix pins it down. It's in-context learning, for sound. That framing ("few-shot prompting with your larynx") connects it straight back to S2.

**Worked example:** a 60-second voice note in the lab's Stretch 3 ≈ 60 × 32 = **1,920 input tokens** → 1,920 × $1.50/1M × ₹95.5 ≈ **₹0.28** to transcribe. Cloning economics are similarly trivial — that's why the scam scales.

**The scam-call beat (deliver straight):** voice-clone + urgency + payment/OTP ask is a live, documented pattern in India — "your grandson" calling paati, fake "digital arrest" calls. The defense is not better ears (a trained ear loses to a good clone); it's *verification habits*: a pre-agreed **family code word**, and calling back on the known number. "Tell your parents this weekend" — mean it.

**Video (one breath):** diffusion plus time — temporal attention across frames so objects persist. Mid-2026: native 4K with soundtrack generated alongside pixels (Sora 2, Veo 3.1, Kling 3.0); physics still slips in complex scenes; ~$0.10–0.75 per second of output. "What you're watching today is the worst it will ever be."

**Pushback:** *"Live phone-call translation?"* — Pipelines (STT→translate→TTS) work today with latency trade-offs; end-to-end speech-to-speech translation models are arriving. *"Can banks still use voice authentication?"* — Voiceprint-only auth is now indefensible as a sole factor; the industry is moving to multi-factor. Good instincts if a student raises it.

**Landmine:** don't quote a specific "₹X crore lost to voice scams" figure — you don't have a verified one. The pattern is documented; keep the numbers to the three on the slide (3 s, ~₹0, ∞), which are about capability, not crime statistics.

### Hot take · "Your mother's voice is no longer proof of your mother" (▸ compressible)

**How to run it:** read it once, slowly. Three seconds of silence. Then invite the counter-argument. Take exactly one now; park the rest for the break; name the strongest on the closing slide. Expected counters and your responses: *"Context and relationship knowledge still authenticate"* → true, and that's exactly what the code word formalizes — the take says *voice alone* is dead, not trust. *"Detection will catch up"* → arms race economics favour the attacker; verification beats detection. Don't win the argument too hard — the point of the slide is that they argue.

### Slide 12 · All of it is one API call — and the structured-outputs beat

**Claim:** `contents=[img, question]` is the whole vision API; and production code doesn't beg for JSON — it passes `response_schema` and the API is *forced* to comply.

**Mechanism — how constrained decoding actually works (this is the July-2026 addition; know it cold):** the API compiles your JSON schema into a grammar — effectively a finite-state machine over *tokens*. At every decoding step, the sampler checks which tokens could legally extend the output under that grammar, and **masks the logits of every illegal token to −∞ before sampling**. The remaining probabilities renormalize; sampling proceeds as normal. The model **cannot** emit a non-schema token — not "is penalized for," *cannot*: a code fence, a "Certainly!", a trailing comment are all literally unsampleable. Same next-token loop, with a bouncer at the door of the distribution. Consequence 1: `json.loads` cannot fail on shape. Consequence 2: it guarantees *shape, not truth* — the model can still hallucinate a wrong total in perfectly valid JSON. Schemas lock structure; grounding and evals still guard content.

**Worked example — tiny masked-softmax table (board):** the decoder sits right after `"total": ` and the schema says NUMBER. Raw next-token distribution vs post-mask:

| candidate token | raw p | schema-legal? | after mask |
|---|---|---|---|
| ` approximately` | 0.42 | ✗ | — |
| `342` | 0.31 | ✓ | **0.79** |
| `"₹` | 0.15 | ✗ | — |
| `3` | 0.08 | ✓ | 0.21 |

The model *wanted* to say "approximately." It can't. 0.31/(0.31+0.08) = 0.79 — renormalization in one line of arithmetic.

**Worked example — the full round trip (matches Lab Part B2 exactly):** request = image + `"Extract the receipt."` (no format instructions at all) + config `response_mime_type="application/json"`, `response_schema={vendor:STRING, date:STRING, total:NUMBER, items:[{name:STRING, price:NUMBER}], required:[vendor,total]}`. Response text, parseable as-is:

```json
{"vendor": "TCE CANTEEN", "date": "2026-07-16",
 "items": [{"name": "Meals x2", "price": 240.0},
           {"name": "Jigarthanda", "price": 70.0},
           {"name": "Coffee x2", "price": 32.0}],
 "total": 342.0}
```

240 + 70 + 32 = 342 ✓ — and that arithmetic check is itself the lab's eval instinct: valid JSON with a wrong sum would parse fine and still be wrong.

**When prompt-JSON still makes sense:** (a) prototyping, when the shape is still moving; (b) when you want visible reasoning *before* the JSON (a schema forces JSON from token one); (c) endpoints/models without schema support; (d) schemas beyond the supported subset (deeply recursive/dynamic). And keep the *task* description in the prompt regardless — the schema locks shape, the prompt still steers content.

**Pushback (professor-grade):** *"Doesn't forcing tokens degrade quality?"* — It can, marginally: masking sometimes forces a token the model ranked low, and over-complex schemas measurably hurt content quality. Mitigations: keep schemas shallow, keep the task described in the prompt. The trade — a rare marginal-quality hit vs a parser that never crashes — is one production takes every time. *"Is this fine-tuning?"* — No; zero weight changes. It's an inference-time filter on the sampler. That distinction (decode-time constraint vs training) is worth saying explicitly to a sharp room.

**Landmine:** don't claim the schema prevents hallucination — it prevents *malformed output* only. Also: the slide's receipt run is canned (a typer animation); say "the real one is your lab in twenty minutes."

### Slide 13 · Where vision quietly fails

**Claim:** four systematic failure modes — counting, spatial relations, blurred-text invention, face-ID refusal — each a *consequence of the mechanism*, not a bug.

**Mechanism + a reproducible example for each:**

| Failure | Why (mechanism) | Reproduce it live |
|---|---|---|
| Counting | Patches *summarize* regions; pooling (4,096→256) discards instance-level info. Counting is prediction of a plausible number — same disease as 847×923 in S1 | Group photo of ~20+ people → "How many people? Count carefully." Answers scatter (15/23/30) across runs. The deck's dot-flash makes the room fail the same test |
| Spatial precision | Position embeddings are a learned summary, further blurred by pooling — precise left/right/behind relations don't survive | Pen left of a cup, photograph, ask "what is to the LEFT of the cup?" — flips distressingly often, especially mirrored/rotated shots |
| Hallucinated fine print | Blur destroys glyph info; the language prior fills the gap with a *plausible* completion — pixel hallucination | Thumb over a receipt total, ask for the total: it often "reads" a value anyway (sometimes by summing items — which looks smart and is still invention). Lab Part D + Stretch 1 A/B the grounding fix |
| Face identification | Refused by policy, not incapacity — privacy. KYC face-match is a separate, purpose-built, regulated stack | Ask "who is this person?" of any photo → refusal. Contrast with your day job: regulated face-match ≠ chat model |

**Pushback:** *"If grounding reduces invention, why not always?"* — Grounding is a prompt-side prior shift, not a fact-checker: it measurably reduces, never eliminates. That's exactly the S2 lesson re-derived, and the lab's Stretch 1 measures it. *"Will counting get fixed?"* — Partly (more tokens per image, tool-augmented detection), but under fixed token budgets summarization is inherent. When counts matter, use a detection model — right tool, S1 thread.

**Landmine:** the dot-flash punchline is "you estimated — exactly like patches do." Don't oversell it into "models see like humans" — the shared behaviour is *estimation under summarization*, arrived at by different routes.

### Slide 14 · Project seeds & Slide 15 · Recap flips

Seeds: read 2–3 with genuine enthusiasm (inscription reader, crop doctor, mess-bill splitter travel well). Every seed = the 4-line call + S2 prompting + an eval set — say that sentence; it makes the capstone feel already-earned. Recap flips: class says each answer *before* you click. The five: patches / diffusion / speech / one call / pixels lie too. If they can't produce "diffusion = learn to remove noise, start from pure noise," re-say beat 3 in one line now — cheaper than re-teaching tomorrow.

### Slide 16 · Lab brief & Slide 17 · Day 1 close

Lab mechanics live in the run sheet and §4 below. The close is a 14-minute slot that historically gets eaten — protect it: four artifacts recapped, strongest hot-take counter named, and the ONE overnight task (2–3 real documents) said **twice**. Tomorrow's RAG session is dead on arrival without their documents; this is the highest-leverage 60 seconds of the day.

---

## 3. Demo playbooks

**General:** all demos are client-side JS, reset on slide re-entry, and work offline. If any interactive dies, every one of them has a talk-through fallback below. Honesty is a feature: two demos are explicitly simulated and the deck says so — repeating the honesty out loud buys credibility for everything else.

### 3.1 Recap quiz (slide 2) — `rq`
**What it computes:** nothing — canned T/F with scripted feedback. **Sequence:** read item aloud → room votes by voice → click their majority answer. **Reveal line (item 4):** "grounding comes back within the hour — in pixels." **Fallback:** ask the four questions verbally.

### 3.2 Patchify (slide 4) — `pt`
**What it computes:** real DOM state, toy scale — a 6×4 grid (24 patches) over an SVG gopuram scene; state 2 renders pills p1…p12 + "…" + "→ same attention loop". Hovering a pill highlights its patch and vice versa — a *real* bijection, the honest core of the demo. **Sequence:** Patchify → pause on "24 patches, like 24 words…" → to tokens → hover 2–3 pill↔patch pairs slowly → point at the green pill: **"from here on, Session 1's machine takes over."** Then the board math from §2 slide 4 (24 here, 4,096 real, pooled to ~256, ₹0.14 per receipt). **Callback to plant:** this same gopuram scene reappears in the diffusion demo — flag it there for the laugh. **If called out:** "Correct — real patches are 14 px and there are four thousand of them; the mapping idea is exact, the count is scaled for the projector."

### 3.3 Will it read? (slide 6) — `wr`
**What it computes:** canned votes. **Sequence:** hands up per item *before* clicking. The CAPTCHA item is the trap — most rooms vote "yes it will answer." **Reveal line:** "It *can* read it. It *won't*. Capability ≠ permission — hold that thought until Session 6." **Fallback:** run it as pure show-of-hands.

### 3.4 Diffusion canvas (slide 8) — `df`
**What it actually computes (be precise if pressed):** a linear cross-fade between one fixed random-noise field and a block-mosaic of the clean scene. Block size shrinks (20 px → 1 px) and noise weight falls as t² as the slider moves; "denoise step n/50" is a label, not a sampler. No network runs. **Sequence:** drag the slider *slowly* left→right narrating "shapes before details — silhouette by ~15, sun by ~30, window by ~45" → drag back to noise → hit Generate for the 2.5 s auto-run. **Reveal line:** "the pixels here are faked — the *direction* is the true thing: coarse structure first, details last, fifty small repairs." **If a student calls out the fake:** "Caught — and correctly. Real diffusion runs a trained noise-predictor 50 times in latent space; this canvas is choreography. The one-pixel version on the board is the real objective." (Then do the x₀=0.8 example from §2.) **Fallback if canvas breaks:** the board example carries the slide alone.

### 3.5 Receipt run (slide 12) — `mm`
**What it computes:** canned. Click → highlight box animates onto the receipt's TOTAL row → typer prints `{"total": 342.00, "currency": "INR"}`. **Sequence:** walk the 4-line code first, then Run. **Reveal line:** "four lines, two seconds, ~fourteen paise — and in the lab you do it for real, then delete half the prompt with `response_schema`." **If called out:** "Yes, canned — the real call is Lab Part B, twenty minutes from now, on *your* receipt."

### 3.6 Dot flash (inside slide 13's counting card) — `cd`
**What it computes:** genuinely real — scatters 20–26 non-overlapping dots, shows them for exactly 1 s, clears, then reveals the true count. **Sequence:** open the counting flip → "Flash the dots" → make them shout numbers → Reveal. **Reveal line:** "You estimated — exactly like patches do." **Fallback:** ask everyone to count a crowd photo from memory.

### 3.7 Flip cards (slides 13 & 15)
Click toggles Q↔A (clicks on buttons/canvas inside don't toggle — you can run the dot flash without closing the card). Discipline: **guesses before flips**, every time. That's the pedagogy; the cards are just the answer sheet.

---

## 4. Lab 3 — what actually happens & where it goes wrong

Stack: Colab + `google-genai`, `MODEL = "gemini-flash-latest"` (the free tier's current Flash — today Gemini 3.5 Flash), key via `getpass`. Typical free-tier limits: ~10 RPM / 250K TPM / a few hundred req/day (varies) (check the live limits page) — pairs won't hit it; the notebook's `ask()` already backs off on 429.

| Part | The real lesson | Failure you'll see |
|---|---|---|
| A · Interrogation ladder (5 Qs) | escalating difficulty exposes the failure gradient live | wrong filename in `Image.open`; iPhone HEIC → needs `pillow-heif` or screenshot→PNG |
| B · Prompt-JSON + `json.loads` | "looks right" ≠ parses; the crash IS the lesson | students stop at pretty output — push until the parse cell passes |
| B2 · `response_schema` | constrained decoding: parse can *never* fail; format-begging deleted | someone asks "so why did we do B?" — answer: to feel the problem the schema solves, and because prompt-JSON is still what you reach for when prototyping |
| C · Handwriting | self-graded accuracy %; Tamil/Tanglish = honest gap + genuine project opportunity | over-trusting: make them actually count errors |
| D · Break it | confident invention, collected for show & tell | rooms find blurred-price inventions fastest |
| Stretch | grounding A/B (S2's line, measured), 5-image vision eval (S2 harness grows eyes), audio upload | audio: `client.files.upload` then handle in contents |

`_shrink(1024)` teaching point if asked: a 4,000-px photo and a 1,024-px one give the same answer — resolution beyond the encoder's input size is wasted upload time, and big files can outright fail.

**Day-before verification (30 min, non-negotiable):**

| Check | How |
|---|---|
| Vision on free-tier `gemini-flash-latest` works | run Cells 1–4 with a real receipt |
| `response_schema` cell (B2) parses | run Cell 4b as-is |
| Audio upload + transcription | run Stretch 3 once with an .m4a |
| Image *generation* free-tier status | ai.google.dev — have a one-line yes/no ready |
| HEIC handling in Colab | try one iPhone photo; fallback = screenshot→PNG |

---

## 5. Q&A bank

1. **"Does the model run OCR software internally?"** — No. There's no OCR engine in the stack — reading emerges from training on billions of image–text pairs where the text in the image appears in the caption. That's why it reads *in context* like a language model: great at guessable smudges, dangerous on unreadable ones, because the same prior that fills gaps also invents. Production systems that must not invent still pair a dedicated OCR engine with an LLM for structuring.

2. **"If an image is only ~258 tokens, how does it hold a whole photo?"** — It doesn't — that's the point. Roughly 2.4 MB of pixels get summarized into ~256 vectors, so the model keeps gist and layout and loses fine detail. Every failure on slide 13 — counting, fine print, spatial precision — is that compression showing through.

3. **"Is diffusion also next-token prediction?"** — No, different family: iterative denoising over the whole image versus autoregressive tokens. But 2026's twist is that 4o-style generators really are next-token machines over visual tokens — both families coexist, and some systems combine them. Diffusion is still the dominant intuition to carry.

4. **"What exactly does the diffusion network learn?"** *(professor)* — One function: given a noised image, the timestep, and the prompt, predict the noise that was added, trained on MSE of the noise residual. Sampling inverts it stepwise, and classifier-free guidance extrapolates between prompted and unprompted predictions to control obedience. It's equivalent to learning the score of the data distribution — the "denoising score matching" framing, if they want the lineage.

5. **"Why 50 denoising steps — why not one jump?"** — Each step's prediction is only trustworthy near its own noise level; one giant leap lands off the manifold of real images. That said, step-distilled and consistency models genuinely generate in 1–4 steps now, trading some quality — it's an active frontier, not a law.

6. **"Is '3 seconds to clone a voice' marketing?"** — No — modern zero-shot TTS treats speech as tokens and continues from a short acoustic prefix, so seconds of reference genuinely pin down pitch, timbre, and accent. Quality rises with more reference audio, but "fools family on a phone line" is squarely within 3-second territory. Hence the code word.

7. **"Can we reliably detect AI-generated images?"** — Post-hoc detectors are unreliable and adversarially fragile; the serious counter-move is provenance — signed content credentials (C2PA) and embedded watermarks (SynthID-class) that travel with the file. Neither survives every crop and re-encode, so the honest state is: no complete fix, layered defenses — same shape as prompt injection in Session 6.

8. **"Why does it refuse a CAPTCHA but read my receipt?"** *(cross-session → S6)* — Capability versus permission. It can read both; it's trained to refuse the one whose whole purpose is blocking automation. Refusals are policy learned in finishing school, not physics — which is why they can be attacked, and that arms race is Session 6.

9. **"Does forcing tokens with `response_schema` hurt answer quality?"** *(professor)* — Marginally, sometimes: masking can force a token the model ranked low, and over-complex schemas measurably degrade content. Keep schemas shallow and keep the task described in the prompt. In production the trade is taken every time — a rare marginal-quality cost against a parser that can never crash.

10. **"Can I generate images in today's lab?"** — Today is vision-*in* on the free tier; image-generation availability there keeps shifting, and I checked last night — [your prepared yes/no]. If you want generation for the capstone, we'll route it through whatever's current then.

11. **"How good is it at Tamil handwriting?"** — Noticeably weaker than printed English, and your Part C percentage is the honest measurement — you'll have your own number within the hour. That gap is a real project opportunity, not just a complaint.

12. **"How does the model know where a patch was in the image?"** *(professor)* — Learned 2D position embeddings added to each patch vector — same trick as text positions. They're a summary, not coordinates, and pooling blurs them further; that's exactly why precise left/right relations are a documented weak spot.

13. **"Why do Session 2's evals matter here?"** *(cross-session → S2)* — Because nothing about measurement changed: five images plus expected answers through your S2 harness is a vision eval — the stretch goal is literally your harness growing eyes. Same discipline tomorrow with RAG: the surface changes every session, the eval loop never does.

14. **"Is video just diffusion with more frames?"** — Essentially diffusion plus temporal attention so objects persist across frames — with brutal costs: roughly $0.10–0.75 per generated second in mid-2026, physics still slipping in complex scenes, improving every quarter. Sora 2, Veo 3.1, Kling 3.0 are the reference points.

---

## 6. Misconception table

| # | Students walk in believing | One-line correction |
|---|---|---|
| 1 | Multimodal = a separate vision AI bolted onto chat | One context, one attention loop — patches are just new tokens in the same sequence |
| 2 | It reads text via an OCR engine | Reading *emerged* from training on image–text pairs; there's no engine, which is why it both reads and invents |
| 3 | Image generators search/collage existing images | The weights synthesize from learned statistics — no image database is consulted at inference |
| 4 | "AI images have six fingers — I can spot them" | Hands were fixed long ago; use provenance signals, not vibes |
| 5 | Computers count perfectly, so AI counts objects perfectly | Patches summarize, they don't enumerate — counting is prediction, and it misses |
| 6 | Voice cloning needs a studio and hours of samples | Seconds of Instagram audio suffice — that's why the family code word matters |
| 7 | "Reply ONLY with JSON" is production engineering | Production passes `response_schema` — the sampler masks illegal tokens, so the parse *cannot* fail |
| 8 | Valid JSON output means correct output | Schemas lock shape, not truth — a wrong total parses beautifully; evals still guard content |

---

## 7. Timing pressure map

Presenter DATA total: **120 min** (53 talk + 53 lab + 14 show-&-tell/close); slide budgets live in presenter mode (press S). This deck is deliberately lighter than S1/S2 — it's the post-lunch slot.

| Zone | Historical bleed | Action |
|---|---|---|
| Slide 4 patchify | hover-mapping is fun; rooms want to hover everything | 2–3 hovers max, then the board math — 5 min hard cap |
| Slide 8 diffusion | over-narrating the slider | one slow pass + Generate; 6 min budget includes the board example |
| Slide 9 gen limits **▸** | style-ethics debate can eat 10 min | marked compressible: cards in one line each, keep the camera line, park ethics for the break |
| Hot take **▸** | the argument you invited | take ONE counter, park the rest — 1.5 min budget is real |
| Slide 12 one call | explaining constrained decoding to the whole room | the masking table is for *questions*; the talk track is one sentence ("the API is forced — lab does both ways") |
| Lab Part A | photo-upload friction (#1 sink) | demo the folder-icon upload ONCE on the projector before releasing |
| **Never cut** | — | family-password beat (slide 10) · CAPTCHA "capability ≠ permission" line · `response_schema` beat + checkpoint 2 parse · the 14-min Day 1 close and the said-twice overnight task |

If behind at the hot take: compress slides 9 + HT to ~2.5 min combined and you're back on schedule without touching anything that matters.

---

## 8. Going deeper — weekend reading

1. **"An Image is Worth 16×16 Words" — Dosovitskiy et al., 2020 (ViT).** The patch trick straight from the source; §3 justifies everything you say on slide 4.
2. **"Denoising Diffusion Probabilistic Models" — Ho, Jain & Abbeel, 2020.** The noise-prediction objective and sampler; equations 4 and 14 are the two you whiteboarded.
3. **"Classifier-Free Diffusion Guidance" — Ho & Salimans, 2022.** Four pages; makes the guidance-scale dial rigorous, including why high g fries images.
4. **"Robust Speech Recognition via Large-Scale Weak Supervision" — Radford et al., 2022 (Whisper).** The template for "capability emerges from weak supervision at scale" — the same argument you make for OCR-in-VLMs.
5. **"Neural Codec Language Models are Zero-Shot TTS" — Wang et al., 2023 (VALL-E).** The 3-second cloning mechanism precisely: speech as tokens, voice as an in-context prefix.
6. **"Efficient Guided Generation for Large Language Models" — Willard & Louf, 2023 (Outlines), plus Google's structured-output docs.** How schema→FSM→logit-masking is actually implemented — the ground truth under slide 12's `response_schema` beat.

---

## The depth layer — 3 `<|deeper|>` panels in this deck

Collapsed by default, so they cost the clock nothing. Press **D** on a slide to open every panel on it (or click the panel's mono label). Each is also flagged in the presenter notes as `[D] deeper:`.

Open one when a student asks the question the slide provokes, or when you are running ahead. Never open one because it is there — the main line is the promise; this is the ceiling.

| Deck slide | Slide | Panel |
|---|---|---|
| `#4` | How a model reads a picture | a patch is a token, so an image has a token bill |
| `#8` | Diffusion: a picture emerges from static | what the network is actually trained to output |
| `#12` | All of it is one API call | why a schema beats begging for JSON |

Prose versions of all of these, with the same section order, are in `LEARNING-GUIDE.md` **Part 8**. If you read one thing before delivery day, read the Part 8 sections matching this deck — they are written so you can improvise a whiteboard answer, not just recite the panel.
