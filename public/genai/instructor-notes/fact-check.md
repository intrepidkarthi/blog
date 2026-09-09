# Fact-Check Audit — all 6 sessions
**Last verified: 2026-09-08** — API-volatile rows re-verified live 2026-07-17 and 2026-08-03 (fresh free-tier accounts, real API calls — the 2026-08-03 pass is what moved the default model to `gemini-flash-lite-latest`), then checked against Google's docs dated 2–8 Sep 2026 for the 2026-09-08 pre-delivery review (see *Volatile* below and the *Sources* list). Re-check anything marked volatile before you teach; the week-of list is at the end of the Volatile section. Everything ✓ is stable/historical.

## Numbers & math (verified programmatically)

| Claim | Where | Status |
|---|---|---|
| 0.95¹⁰ ≈ 60% | S5 reliability curve | ✓ 0.5987 |
| 0.95²⁰ ≈ 36% | S5 reliability curve | ✓ 0.3585 |
| 0.99²⁰ ≈ 82% | S5 reliability curve | ✓ 0.8179 |
| ₹500 −20% then +18% GST = ₹472 | S2 step-by-step demo | ✓ 400 × 1.18 = 472 |
| 18% of ₹2347 = ₹422.46, total ₹2769.46 | S5 tool demo | ✓ |
| S6 cost slider derived numbers | S6 cost slider | ✓ re-synced 2026-07-17: JS constants $1.50/$9.00 (Gemini 3.5 Flash — now *previous-gen* Flash, see Volatile); Python-verified vs live render — 500 users $243/mo ≈ ₹23,207 at ₹95.5/$ (approximate); caching −90% on input confirmed in-widget |

## History & sources (stable — safe to state)

| Claim | Where | Status |
|---|---|---|
| "Attention Is All You Need," Vaswani et al., Google, 2017 | S1 stepper slide depth panel + `how-llms-work.html` ch. attention, prep | ✓ |
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

> **Live-verified 2026-07-17** (fresh free-tier account, real API calls): `gemini-flash-latest` alias ✓ (served Gemini 3.5 Flash on a new key); `gemini-embedding-2` ✓ (768 dims confirmed — the lab now requests them explicitly with `output_dimensionality=768`; the default is 3072); `gemini-2.5-flash` / `gemini-2.5-flash-lite` → **404 "no longer available to new users"** on the fresh account (existing accounts still had them).
>
> **Re-verified 2026-08-03** (~150 live calls): the default model is now `gemini-flash-lite-latest` ✓ (serves Gemini 3.5 Flash Lite; vision ✓, function calling ✓, streaming ✓, `response_schema` ✓, `max_output_tokens` ✓, and **minimal thinking by default** — Google's wording is "does not guarantee thinking is off"). The `gemini-flash-latest` alias had moved to a **thinking** model: one session billed **28,089 hidden reasoning tokens against 2,770 visible**, 91% of output, and the numeric `thinking_budget=0` → **400 INVALID_ARGUMENT** on 3.x. On the free tier that is roughly an order of magnitude more output quota per answer, plus slower replies, so the course pins the lite alias.
>
> **Doc-checked 2026-09-08** (Google docs dated 2–8 Sep 2026; not a live run — do one on a fresh auth key the week before): `gemini-flash-latest` is hot-swapped per release — 3.7 Flash GA 13 Aug, **3.8 Flash GA 2 Sep 2026**; resolve it live with `client.models.get` rather than naming a version on a slide. `thinking_level="minimal"` exists on 3.5/3.6 Flash but **not** on 3.7/3.8 Flash. `temperature`/`top_p`/`top_k` are **deprecated on Gemini 3.x** (changelog 21 Jul 2026), still accepted on the 3 Aug run. **API keys:** from September 2026 the API rejects "Standard" keys; new AI Studio keys are auth keys automatically, so regenerate any instructor/demo key created before the change, and a user with an existing Google Cloud account must import a project before "Get API key" works. **Embeddings gotcha (verified, ai.google.dev/gemini-api/docs/embeddings, 2026-09-04):** `gemini-embedding-2` with a bare list of strings in `contents` returns **one aggregated embedding** for the whole list — wrap each input in `types.Content(parts=[types.Part.from_text(text=t)])` to get one vector per input, and assert `len(res.embeddings) == len(texts)`. Official docs now default to the Interactions API (`client.interactions.create`, GA Jun 2026); `generate_content` remains fully supported.

| Claim | Where | Status | Where to check |
|---|---|---|---|
| Free tier ~10 requests/min | all labs | hedge holds ("typical free-tier limits") — as of 2026-07-17 the rate-limits docs page **no longer publishes per-model numbers**; it defers to your project's live limits in AI Studio | aistudio.google.com/rate-limit (docs page now points there) |
| Free tier daily cap | docs (softened to "a few hundred/day") | **sources disagree: 250–1500 RPD** — materials now say "a few hundred/day, varies"; per-model tables gone from docs (2026-07-17) | AI Studio shows your project's real limit |
| `gemini-flash-lite-latest` (alias) is the default model in all code | all notebooks (one `MODEL` var) | ✓ 2026-08-03 live: alias works on a fresh key and serves **Gemini 3.5 Flash Lite** (no newer Lite exists as of 2026-09-08 — very likely still true; resolve live the week before and record here), with vision, function calling, streaming, `response_schema` and `max_output_tokens` all confirmed and **minimal thinking by default** (optionally pin `thinking_config=types.ThinkingConfig(thinking_level="minimal")`). `gemini-2.5-flash`/`-lite` returned 404 "no longer available to new users" on fresh keys (**observed on fresh keys Jul–Aug 2026; undocumented** — no shutdown date in Google's docs) while existing accounts keep them — mixed rooms are exactly why the code uses an alias, which serves both. Also working on new keys (Aug 2026): `gemini-3.5-flash`, `gemini-3-flash-preview`, `gemini-3.1-flash-lite`. Pin a dated id only if you need frozen behavior | ai.google.dev/gemini-api/docs/models |
| `gemini-flash-latest` resolves to a **thinking** Flash model | not used as the default any more; S1 handout compares against it | ✗ as a classroom default: currently a thinking Flash model (3.7 Flash GA 13 Aug 2026, 3.8 Flash GA 2 Sep 2026 — the alias is hot-swapped per release; resolve live with `client.models.get`). Measured 2026-08-03: 28,089 hidden reasoning tokens against 2,770 visible (**91% of billed output**). The numeric `thinking_budget` is rejected on Gemini 3.x (400 INVALID_ARGUMENT); `thinking_level="minimal"` exists on 3.5/3.6 Flash but not on 3.7/3.8 Flash. Free-tier output quota drains roughly an order of magnitude faster and answers are slower. Keep it only as the 503 fallback and as the S1 slow-and-verbose comparison | ai.google.dev/gemini-api/docs/models |
| `gemini-embedding-2` for RAG | S4 | ✓ 2026-07-17 live: works on a fresh key, 768 dims confirmed with `output_dimensionality=768` (default 3072), compatible with `embed_content`; GA 22 Apr 2026, $0.20 per 1M text tokens. **Batch gotcha (docs 2026-09-04):** a bare list of strings is aggregated into ONE embedding — wrap each input in `types.Content`; the lab asserts one vector per chunk. Supersedes `gemini-embedding-001`, which is **not** shut down — still available for text, earliest shutdown 14 May 2028 (14 Jul 2025 was its *release* date) | ai.google.dev/gemini-api/docs/embeddings |
| `google-genai` automatic function calling | S5 | ✓ (2026-07-10) | SDK docs |
| Image *generation* free-tier availability | S3 (mention only) | varies — have a yes/no ready | ai.google.dev |
| Token pricing for cost slider ($1.50 in / $9.00 out per 1M, **Gemini 3.5 Flash**) | S6, Lab 6 `PRICE_IN/OUT`, LOCALIZATION | ✓ still exactly right for `gemini-3.5-flash` (2026-09-08), but that is now labelled **previous-gen Flash**: current 3.8 Flash is $0.75 / $3.75 (introductory through 31 Dec 2026); the lab model 3.5 Flash-Lite is $0.30 / $2.50; `gemini-embedding-2` $0.20/1M text. Deck constants re-synced 2026-07-17 (caching $0.15/1M ≈ −90% unchanged); all derived numbers Python-verified against the live widget. Label the slider "Gemini 3.5 Flash (previous-gen), Sep 2026" | ai.google.dev/gemini-api/docs/pricing |
| ₹/$ rate on cost slider | S6 | ✓ ≈ ₹95.5 (approximate; slider JS constant matches; stated as approximate on the slide) — refresh the week before if the rate has moved | any FX source |
| API keys: "Standard" keys rejected from Sep 2026 | Lab 1 Part A, ZERO-SETUP, README | ✓ docs 2026-09-02: new AI Studio keys are auth keys automatically; regenerate instructor/demo keys created before the change; users with an existing Google Cloud account must import a project first | ai.google.dev/gemini-api/docs/api-key |
| `temperature` / `top_p` / `top_k` on Gemini 3.x | Lab 1 temperature demo (0.0 / 1.5), `temperature=0` in Labs 2–4, 6 | ⚠ deprecated on 3.x since 2026-07-21 (changelog); still accepted on the 2026-08-03 live run — re-verify on the pre-class run that 1.5 is accepted and visibly varies | ai.google.dev/gemini-api/docs/changelog |

**Week-of checklist (do on a fresh auth key):** resolve both `-latest` aliases with `client.models.get`; screenshot your AI Studio rate-limit page; run Lab 1's temperature demo; run Lab 4 end-to-end and confirm `chunk_vecs.shape[0] == len(chunks)`; confirm the Lab 5 function-response format; pre-pull `gemma4:e4b`.

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
- 2026-09-08 review sources (Google docs, dated 2–8 Sep 2026): [API keys — Standard keys rejected from Sep 2026; import a project if you have a Cloud account](https://ai.google.dev/gemini-api/docs/api-key) (2 Sep) · [embeddings — list-of-strings aggregation, `types.Content` per input, `output_dimensionality`, embedding-001 deprecation timeline](https://ai.google.dev/gemini-api/docs/embeddings) (4 Sep) · [models — 3.7 Flash GA 13 Aug, 3.8 Flash GA 2 Sep, `-latest` alias behaviour](https://ai.google.dev/gemini-api/docs/models) · [thinking — `thinking_level` availability per model](https://ai.google.dev/gemini-api/docs/thinking) · [changelog — `temperature`/`top_p`/`top_k` deprecated on 3.x, 21 Jul 2026](https://ai.google.dev/gemini-api/docs/changelog) · [pricing — 3.8 Flash $0.75/$3.75 intro to 31 Dec 2026; 3.5 Flash $1.50/$9.00 previous-gen; 3.5 Flash-Lite $0.30/$2.50; embedding-2 $0.20](https://ai.google.dev/gemini-api/docs/pricing) · [Interactions API](https://ai.google.dev/gemini-api/docs/interactions) · `google-genai` 2.22.0 source (`if 'gemini-embedding-2' in model: contents = t.t_contents(contents)`)
- [Meenakshi Temple — Wikipedia](https://en.wikipedia.org/wiki/Meenakshi_Temple)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
