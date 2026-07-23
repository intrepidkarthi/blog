# Fact-Check Audit — all 6 sessions
**Last verified: 2026-07-10; API-volatile rows re-verified live 2026-07-17** (fresh free-tier account, real API calls). Re-check anything marked volatile before you teach. Everything ✓ is stable/historical.

## Numbers & math (verified programmatically)

| Claim | Where | Status |
|---|---|---|
| 0.95¹⁰ ≈ 60% | S5 reliability curve | ✓ 0.5987 |
| 0.95²⁰ ≈ 36% | S5 reliability curve | ✓ 0.3585 |
| 0.99²⁰ ≈ 82% | S5 reliability curve | ✓ 0.8179 |
| ₹500 −20% then +18% GST = ₹472 | S2 step-by-step demo | ✓ 400 × 1.18 = 472 |
| 18% of ₹2347 = ₹422.46, total ₹2769.46 | S5 tool demo | ✓ |
| S6 cost slider derived numbers | S6 cost slider | ✓ re-synced 2026-07-17: JS constants now $1.50/$9.00 (Gemini 3.5 Flash); Python-verified vs live render — 500 users $243/mo ≈ ₹23,207; caching −90% on input confirmed in-widget |

## History & sources (stable — safe to state)

| Claim | Where | Status |
|---|---|---|
| "Attention Is All You Need," Vaswani et al., Google, 2017 | S1 s14, prep | ✓ |
| ChatGPT launched Nov 2022 | S1 | ✓ |
| Chain-of-thought: Wei et al., 2022 | S2 prep | ✓ |
| Vision Transformer (ViT): Dosovitskiy et al., 2020 | S3 prep | ✓ |
| Mata v. Avianca (2023) — lawyers sanctioned for 6 fake ChatGPT citations | S2 s10, prep | ✓ real case, ~$5k sanction |
| Moffatt v. Air Canada (Feb 2024) — airline liable for chatbot's invented refund policy | S2 s10, prep | ✓ BC Civil Resolution Tribunal |
| OWASP ranks prompt injection #1 LLM risk (LLM01) | S6 s4, prep | ✓ confirm still #1 at owasp.org |

## Madurai / India facts (verified)

| Claim | Where | Status |
|---|---|---|
| Meenakshi Amman temple: 14 gopurams, tallest (southern) ~52 m | S2 spot-the-lie | ✓ 51.9 m / 170 ft, 14 gopurams |
| TCE founded 1957 by Karumuttu Thiagarajan Chettiar | S2 makeover, spot-the-lie | ✓ |
| "TCE won UGC National Institute of the Year 2019" | S2 spot-the-lie | ✓ **intentionally FALSE** — it's the planted hallucination; 1957 is real, the award is invented |
| A. R. Rahman composed Roja (1992) | S2 scorer demo, S1 lab | ✓ |
| Cricket eval answers (Yuvraj 6 sixes '07, Murali 800, 2011 final vs SL, Sachin 100th vs Bangladesh, Kapil 175* vs Zimbabwe, fastest ODI 100 = 31 balls, IPL'16 = Hyderabad, most runs one IPL season = Kohli) | S2 eval demo | ✓ all correct as "expected" answers |

> Note: the S2 eval demo deliberately marks some correct-expected answers as ✗ to show the *model* failing — that's the eval lesson, not a factual error in the expected answers.

## Volatile — RE-CHECK BEFORE EACH RUN

> **Live-verified 2026-07-17** (fresh free-tier account, real API calls): `gemini-flash-latest` alias ✓ (serves Gemini 3.5 Flash on a new key); `gemini-embedding-2` ✓ (768 dims confirmed); `gemini-2.5-flash` / `gemini-2.5-flash-lite` → **404 "no longer available to new users"** on the fresh account (existing accounts still have them).

| Claim | Where | Status | Where to check |
|---|---|---|---|
| Free tier ~10 requests/min | all labs | hedge holds ("typical free-tier limits") — as of 2026-07-17 the rate-limits docs page **no longer publishes per-model numbers**; it defers to your project's live limits in AI Studio | aistudio.google.com/rate-limit (docs page now points there) |
| Free tier daily cap | docs (softened to "a few hundred/day") | **sources disagree: 250–1500 RPD** — materials now say "a few hundred/day, varies"; per-model tables gone from docs (2026-07-17) | AI Studio shows your project's real limit |
| `gemini-flash-latest` (alias) is the default model in all code | all notebooks (one `MODEL` var) | ✓ 2026-07-17 live: alias works on a fresh key and currently serves **Gemini 3.5 Flash**. `gemini-2.5-flash`/`-lite` are **retired for NEW accounts** (404 "no longer available to new users") while existing accounts keep them — mixed rooms are exactly why the code uses the alias, which serves both. Also working on new keys: `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-3.1-flash-lite`. Pin a dated id only if you need frozen behavior | ai.google.dev/gemini-api/docs/models |
| `gemini-embedding-2` for RAG | S4 | ✓ 2026-07-17 live: works on a fresh key, 768 dims confirmed, compatible with `embed_content` — replaced `gemini-embedding-001`, which shut down 2026-07-14 | ai.google.dev/gemini-api/docs/embeddings |
| `google-genai` automatic function calling | S5 | ✓ (2026-07-10) | SDK docs |
| Image *generation* free-tier availability | S3 (mention only) | varies — have a yes/no ready | ai.google.dev |
| Token pricing for cost slider ($1.50 in / $9.00 out per 1M, **Gemini 3.5 Flash**) | S6 | ✓ pricing-page-confirmed AND deck constants re-synced 2026-07-17 (caching $0.15/1M ≈ −90% unchanged); all derived numbers Python-verified against the live widget | ai.google.dev/gemini-api/docs/pricing |
| ₹/$ rate on cost slider | S6 | ✓ ₹95.5 as of 2026-07 (slider JS constant matches) — refresh if the rate moves | any FX source |

## Deliberate simplifications (say proudly if challenged — never defend the toy as real)
- S1 tokenizer widget: rule-based toy, labeled illustrative (real = learned BPE; lab shows real `count_tokens`).
- S1 attention %, embedding map, stepper vectors: illustrative of the mechanism, not measured.
- S3 diffusion canvas: linear pixel blend, not real sampling (labeled on slide).
- S2/S6 chat/attack/defense demos: scripted for classroom reliability; real behavior is probabilistic — say so.
- S4 playground similarity scores: authored realistic ranges (lab computes real ones).
- S5 agent log, S6 cost %: teaching devices.

One-line shield: **"Everything on screen is a faithful cartoon — simplified to be visible, never simplified to be wrong."**

## Sources
- [Gemini rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) · [pricing](https://ai.google.dev/gemini-api/docs/pricing) · [models](https://ai.google.dev/gemini-api/docs/models) · [embeddings](https://ai.google.dev/gemini-api/docs/embeddings) · [your live limits](https://aistudio.google.com/rate-limit)
- [Meenakshi Temple — Wikipedia](https://en.wikipedia.org/wiki/Meenakshi_Temple)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
