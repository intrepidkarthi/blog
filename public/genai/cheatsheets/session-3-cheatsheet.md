# Session 3 Cheatsheet — AI Beyond Text

## The one idea
**Same loop, new tokens.** Images → patch-tokens, audio → slice-tokens, into the same attention machine from Session 1. Multimodal = new eyes wired into the same brain.

## Reading vs making
- **Reading images** (vision) = prediction with picture-tokens in context. It doesn't just see — it *reads*: documents, handwriting, charts, screenshots.
- **Making images** = **diffusion**: train a network to remove noise; generate by starting from pure static and "repairing" toward an image, steered each step by your prompt. Today's lab is vision-in only — free-tier image-generation APIs are limited; try the making side free in Google AI Studio tonight.

## The code that matters

```python
from PIL import Image
img = Image.open("receipt.jpg")

r = client.models.generate_content(
    model=MODEL,
    contents=[img, """Extract data. Reply ONLY with JSON:
      {"vendor": str, "total": float}
      If unreadable, use null — do NOT guess."""])
```

Audio: `f = client.files.upload(file="note.m4a")` then `contents=[f, "Transcribe this."]`
The test of extraction isn't "looks right" — it's **`json.loads()` succeeds**.
Production version: `response_schema` (+ `response_mime_type="application/json"`) in the config **guarantees the shape parses; it does not verify the values** — allow `null` for anything unreadable, keep the `try/except` (truncation at `max_output_tokens` can still cut the JSON), and delete the format-begging from your prompt.

## Where vision fails (and why)
| Failure | Cause | Fix |
|---|---|---|
| Miscounts objects | patches summarize, don't enumerate | detection tools when counts matter |
| Left/right confusion | spatial info lost in flattening | don't trust precise geometry |
| Blurred text "read" anyway | plausible completion = pixel hallucination | grounding: "if unreadable, say UNREADABLE" |
| Won't identify faces | refused by design (privacy) | KYC face-match = separate regulated systems |

## Voice, one paragraph
STT is often excellent but not uniformly solved — accents, noise, rare names and Tamil-English code-switching still produce silent errors, so lectures → notes is useful, not solved: verify names, numbers and formulas. TTS is convincingly human. **Cloning needs seconds of audio** — the "family member urgently needs money/OTP" call is a live scam pattern. Set a family password. Tell your parents.

## Carry forward
Everything from S1–S2 applies to images unchanged: prompting, format control, grounding, **evals** (5 images + expected answers = vision eval). **Tonight: 2–3 real documents on your laptop — Day 2 builds "chat with my notes" over them.**

**Go deeper (press D on the deck):** ViT patches as tokens — why resolution costs tokens quadratically and small text fails suddenly · what a diffusion model actually predicts (the noise), plus steps / guidance / seed / latent diffusion · constrained decoding: how a schema makes malformed JSON unreachable. Prose versions: Learning Guide **Part 8**. Papers worth reading: ViT — the Vision Transformer (2020).
