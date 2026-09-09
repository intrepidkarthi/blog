# Pre-delivery review — 8 Sep 2026 (for 19–20 Sep delivery)

> **Status (8 Sep 2026, evening): every item below has been applied in the repo.** Blockers 1–5, the high items 6–13 and the medium items 14–29 are fixed; the `.html` twins, slide guides, TIMING.md and the printable instructor pack were regenerated from their sources (`build-twins.py`, `gen-slide-guide.py`, `gen-timing.py`, `build-all-notes.py`). Two things still need a human and a live key: run `instructor-notes/validate-live.py` on a **fresh auth key** (it now asserts the embedding count and resolves both `-latest` aliases), and push `labs/session-4/sample-os-notes.txt` to `main` so Lab 4's auto-download fallback works. The new `instructor-notes/INSTRUCTOR-MASTERY-GUIDE.md` carries the ten-day preparation plan.
>
> Correction to item 6 below: the capstone rubric is 40 demo · 25 eval · 15 failure analysis · **10 technique fit · 10 presentation** (security and cost are graded inside failure analysis and the ship checklist), as `certificate.html`, the S6 deck and `course-plan.md` all state.

Scope: `index.html`, all six decks, prep packs, run sheets, slide guides, lab handouts, notebooks, cheatsheets, every top-level guide, `Lab-Requirements-GenAI-Course.docx`, and the two Thirukkural pages. `book/` ignored. Every finding below was verified against the file (or, for API facts, against Google's docs dated 2–8 Sep 2026); nothing is speculative.

**Mechanical health is green.** All scripts pass `node --check`, tags balance, every `getElementById` resolves, presenter `DATA` length = slide count in all six decks, `check-slide-refs.py` passes, regenerated slide-guides are byte-identical, all seven notebooks are valid JSON and every code cell parses, model IDs are consistent everywhere, every relative link resolves (one bad anchor, item 28), no "420k"/"2.5 PB" anywhere, no "Karthik"-only naming, no tinyurl.

**The problem is that the 3 Sep review's fixes were not applied**, and one new API-behaviour change breaks Lab 4 outright.

---

## A. Blockers — will fail in the room

**1. Lab 4 embeddings return one vector per batch, not one per chunk → RAG and the capstone silently break.**
`labs/session-4/session_4_lab.ipynb` Cell 4: `client.models.embed_content(model="gemini-embedding-2", contents=texts)` with a list of 20 strings. Google's embeddings doc (updated 4 Sep 2026): *"Adding multiple inputs directly to the `contents` parameter produces one aggregated embedding for all inputs… Wrapping each input in a `Content` object… returns separate embeddings for each entry."* I reproduced it in `google-genai` 2.22.0 (what `%pip install -U` will fetch on the day): the SDK has an explicit `if 'gemini-embedding-2' in model: contents = t.t_contents(contents)` branch that folds a list of strings into one `Content` with 20 parts → one embedding. Result for 60 chunks: `chunk_vecs.shape == (3, 3072)`; `search()` argsorts 3 scores and returns `chunks[0..2]` for every query. No error is raised. `validate-live.py` (the 17 Jul / 3 Aug live check) only asserts vector *length* (768), never *count*, so it passed.
Fix (Cell 4):
```python
def embed(texts):
    res = client.models.embed_content(
        model=EMBED_MODEL,
        contents=[types.Content(parts=[types.Part.from_text(text=t)]) for t in texts],
        config=types.EmbedContentConfig(output_dimensionality=768))
    assert len(res.embeddings) == len(texts), f"expected {len(texts)} vectors, got {len(res.embeddings)}"
    return np.array([e.values for e in res.embeddings])
```
Add the same count assertion to `instructor-notes/validate-live.py`, then run Lab 4 end-to-end on a fresh key. (`output_dimensionality=768` also makes the lab match the S4 stepper slide, which prints "768 — SAME model and dims"; the default is 3072.)

**2. Capstone artifacts still evaporate at lunch; Labs 5/6 never reload them.** (3 Sep fix #1 — not applied.)
Lab 4 saves `chunk_vecs.npy` / `chunks.json` to runtime disk. No `drive.mount` / `files.download` in any notebook. Lab 5 Stretch 1 says "paste your search() + chunk_vecs from Lab 4" but Lab 5 doesn't import numpy or define `embed`/`EMBED_MODEL`; Lab 6 Cell 5 says "paste a poisoned document into your Lab 4 chunks" but runs a literal string. Colab disconnects on idle; the Day-2 through-line collapses into re-embedding under rate limits.
Fix: Lab 4 Cell 1 `from google.colab import drive; drive.mount('/content/drive')`, save to `/content/drive/MyDrive/genai/`; add a "Reload Lab 4" cell to Lab 5 (before Stretch 1) and Lab 6 (before Part C) with `np.load`, `json.load`, `EMBED_MODEL`, `embed()`, `search()`.

**3. No instructor sample document; Lab 4 queries are still `<placeholders>`.** (3 Sep fix #2 — not applied.)
`labs/session-4/` contains only handout + notebook. `lab-handout.md:6,9` and the Cell 2 `ValueError` tell students to "switch to the instructor sample". Cell 5 `["<your test query 1>", "<query 2>", "<query 3>"]`, Cell 6 `"<a real question…>"`, Cell 7 five `"<question N>"` — run as-is they burn quota on angle-bracket strings and Checkpoint 2 is unreachable for a pair with a scanned PDF.
Fix: ship `labs/session-4/sample-os-notes.txt` (OS notes + one page of attendance/pass-mark regulations so the deck's demo queries retrieve), point Cell 2 fallback and both handout twins at it, pre-fill Cells 5–7 with queries that work on it.

**4. Session 1 talk is 68 min against a 56-min budget; Lab 1 handout is 60 min for a 50-min lab.** (3 Sep fix #3 — not applied.)
Presenter `DATA` slides 1–28 sum to **68.0 min** (8 hook + 48 talk = 56). Slides 14–17 (tokenizer, embeddings, attention, assemble) = 12.5 min and are now covered by `how-llms-work.html`. Wrap is budgeted 2 min (slides 30–31 at 1 min each) while slide 31's note says "Show & tell (~5)". `session-1-prep.md:267` admits "you have no slack". `labs/session-1/lab-handout.md`: A10+B10+C15+D15+E10 = **60** (also copied into `session-1-prep.md:207`, `lab-facilitation-guide.md:59`). Part E — the 10-question test set Lab 2 depends on — is what gets cut when S1 overruns on a back-to-back day.
Fix: collapse 14–17 into one ~3-min "you saw this on the page — here it is in one loop" slide (depth stays behind D); budget slides 30–31 at 6 min; make Parts C and D 10 min each; update DATA, TIMING.md/html, notes, slide-guide, prep.

**5. API keys: Google rejects "Standard" keys from September 2026.**
`ai.google.dev/gemini-api/docs/api-key` (2 Sep 2026): *"On September 2026: the Gemini API will reject requests from Standard keys."* New AI Studio keys are auto-created as auth keys, so students are fine. Your own instructor/demo keys created before the change are not. Also: *"If you already have a Google Cloud account, AI Studio does not create a default project. Instead, you must import your existing projects"* — a student who has ever touched GCP won't see "Get API key" work until they import a project.
Fix: regenerate every instructor/demo key now and re-run `validate-live.py`; add one line to Lab 1 handout Part A for the "I have a Google Cloud account" case.

---

## B. High — students will notice or lose time

**6. Session 6 finale timing is double-counted.** `session-6-…html` DATA slide 19 `"m": 43` with note "~30-min red-team lab + ~33-min demos in this slot" (= 63). Slide 17 kicker says "~30 build · ~35 demos". `session-6-prep.md:9,130` and `notes.md:88` repeat the 43. TIMING.md then says the "remaining 33 min" is reserved for red-team/demos — same time counted twice. The pace badge will read "behind 20:00" for the whole finale. Demo math: 3 min × pairs ≈ 35 min ⇒ ≤ 12 pairs; no headcount stated anywhere; lightning-demo fallback exists only in `labs/session-6/lab-handout.md:27` (not the .html the deck links, not the prep).
Fix: slide 19 budget ~76 (39.5 + 76 + 4.5 = 120); rewrite the DATA note/prep/notes as "30 + ~35 + close"; add to prep: ">12 pairs ⇒ announce 60–90 s lightning demos before Part A"; add the two sentences on scoring a pair whose app doesn't run but whose failure analysis is excellent (3 Sep ask, not done).

**7. The "mock/offline fallback" is promised in seven documents and exists in none of the notebooks.** `ZERO-SETUP.md:3,9,17,36,50`, `README.md:68`, `TEACH-THIS-YOURSELF.md:39,59,62`, `course-plan.md:14,160`, `index.html:707` (FAQ), `labs/session-1/lab-handout.md:19`, and the docx sent to IT ("the course has a prepared offline path for every lab"). `grep -i "mock\|offline" labs/**/*.ipynb` → 0 hits. If the college network or a quota fails, there is nothing to fall back to.
Fix: either add a `MOCK = False` switch to each notebook's `ask()` with 3–5 canned responses per lab (an afternoon's work), or reword all seven to "instructor-driven demonstration" and delete the promise from the docx.

**8. An authoring note is on a student-facing slide.** `session-1-…html:1082` slide 28: "Materials link announced by instructor" followed by "*Before Day 1, publish and test one stable link to the decks, handouts, notebooks, and cheatsheets for all 6 sessions.*" The tinyurl placeholder was replaced with a to-do addressed to you. The presenter note still says "make everyone bookmark the link". `README:69`, `TEACH:62`, `LOCALIZATION:97` still say "Do not distribute the placeholder URL".
Fix: put `intrepidkarthi.com/genai` (or a QR) in the card, delete the second `<p>`, drop the three placeholder sentences.

**9. Lab 1 notebook ships with your local machine's output baked in.** `session_1_lab.ipynb` Cells 1–2 have `execution_count` 1/2 and stderr: `/Users/karthikeyanng/CascadeProjects/…/.venv/lib/python3.9/…: FutureWarning: Python 3.9 past its end of life…` + `NotOpenSSLWarning … LibreSSL 2.8.3`. Students open Colab to three red warnings and a personal path in the busiest setup window. S2–S6 are clean.
Fix: Edit → Clear all outputs, re-save.

**10. Lab 6 `ask()` crashes on a blocked response — the likeliest outcome in an attack lab.** `session_6_lab.ipynb` Cell 1: `u.candidates_token_count * PRICE_OUT` → `TypeError` when it's `None`; `return r.text` can be `None`, then `hardened_bot`'s `if "RULES" in out` → `TypeError`. No retry in Labs 5 or 6 (`ZERO-SETUP.md:63` claims every notebook has one). Lab 3 `ask()` also lacks `.text or ""` (Cell 4 `raw.strip()` → `AttributeError`).
Fix: `(u.candidates_token_count or 0)`, `return r.text or "[blocked/empty]"`, reuse Lab 4's retry loop; add `or ""` in Lab 3.

**11. Lab 1 handout Part C points at the wrong cell.** `lab-handout.md:32` "Run each prompt in Cell 4 (one function call each)" — Cell 4 is the retry helper; the five prompts are Cell 5, in one loop. Also Cell 3 (first call) runs before the retry helper exists — a 429 there is a raw traceback (define `ask()` in Cell 2).

**12. Stale `.html` twins — and `index.html` links the `.html` versions.**
- `labs/session-3/lab-handout.html` still says "*json.loads never fails now*" / "the API cannot return anything else"; the `.md` was softened to "does not guarantee correct values… must allow null".
- `labs/session-2/lab-handout.html` lacks rule 5 (keep test questions fixed) and "do not claim 9/10 is reliable".
- `labs/session-1/lab-handout.html` lacks the pre-class access-check paragraph; `session-4/lab-handout.html` lacks the privacy warning + sample-doc fallback; `session-6/lab-handout.html` lacks the lightning-demo fallback.
- `instructor-notes/session-1-prep.html` §7 describes a *different, older* pre-class page ("Deliberately non-overlapping… None of that is in your deck") — the `.md` describes the Thirukkural page and says it overlaps S1 on purpose. This is the one `index.html:696` links.
- `session-4/5/6-prep.html` say "· checkpoint" where the `.md` says "trim/compressible" — opposite meaning.
- `TEACH-THIS-YOURSELF.html:120` still promises "Cost to run: Zero… the full guarantee"; the `.md` was softened.
- `TIMING.html` S6 row 10 still "That was the easy 20%"; S5 header says "≈ 124 min" (rows sum to 120).
Fix: regenerate every `.html` twin from its `.md` (one script run), or stop linking the `.html`s.

**13. Volatile API facts — corrections needed (verified against Google docs 2–8 Sep 2026).**
| Course says | Where | Actual | Change |
|---|---|---|---|
| `gemini-embedding-001` "shut down July 2026 / 2026-07-14" | `README.md:90`, `course-plan.html:153`, `fact-check.md:51` | Still available; earliest shutdown **14 May 2028**; 14 Jul 2025 was its *release* date. Superseded by embedding-2 (GA 22 Apr 2026). | Fix wording |
| `gemini-flash-latest` "= Gemini 3.6 Flash" | README, course-plan, fact-check:43,50 | 3.7 Flash GA 13 Aug; **3.8 Flash GA 2 Sep**. Alias is hot-swapped per release. | "a thinking Flash (3.6/3.7/3.8 — resolve live with `client.models.get`)" |
| "thinking cannot be switched off" | same | `thinking_budget` (numeric) is rejected on 3.x; `thinking_level="minimal"` exists on 3.5/3.6 Flash, **not** on 3.7/3.8 | Reword |
| Lite: "no hidden thinking tokens" | all notebook `MODEL` comments, S1 cheatsheet:46, S1 slide note | 3.5 Flash-Lite default thinking = *minimal* ("does not guarantee thinking is off") | "minimal thinking by default"; optionally pin `thinking_config=types.ThinkingConfig(thinking_level="minimal")` |
| `temperature=0.0` / `1.5` demo (Lab 1), `temperature=0` in Labs 2–4, 6 | notebooks | Changelog 21 Jul 2026: `temperature`, `top_p`, `top_k` **deprecated** on 3.x. Still accepted on 3 Aug live run. | Keep, add a one-line teaching note; re-verify on the pre-class run that 1.5 is accepted and visibly varies |
| Prices "$1.50 in / $9.00 out (July 2026)" | S4:432, S6:602,1050, Lab 6 `PRICE_IN/OUT`, LOCALIZATION:87 | Exactly right for `gemini-3.5-flash`, now labelled "earlier Flash". Current Flash 3.8: $0.75/$3.75 intro to 31 Dec. Lab model 3.5 Flash-Lite: **$0.30/$2.50** | Relabel "Gemini 3.5 Flash (previous-gen), Sep 2026" or re-base to Lite; refresh ₹95.5/$ |
| `gemini-2.5-flash` "unavailable to new accounts" | README, fact-check:41,49 | Not in official docs (no shutdown date); forum-corroborated Aug 2026 | Mark "observed on fresh keys; undocumented" |
| Embedding dims 768 | index widget, S4 stepper, fact-check | Default is 3072; lab passes no config | Pass `output_dimensionality=768` (item 1) |
| `gemini-flash-lite-latest` = 3.5 Flash Lite | everywhere | No newer Lite exists; very likely still true | Resolve live the week before; record in fact-check |
| ~10 RPM / "a few hundred/day" | S1, ZERO-SETUP, cheatsheet | Google no longer publishes per-model numbers; hedge holds | Screenshot your AI Studio rate-limit page the day before |
Also: official docs now default to `client.interactions.create(...)` (Interactions API, GA Jun 2026); `generate_content` is still fully supported — one handout sentence prevents "the docs look different" confusion.

---

## C. Medium — visible on the projector or contradictory

14. **Session dots always light Session 1 in every deck.** All six decks: `sessionOf(e.detail)` compares the *within-deck* slide index against cumulative marks `[0,31,52,69,89,112]`, so it is always 0; the correct dot (set in HTML) switches off 480 ms after load. Fix: hard-code `const ME = <n>` and toggle `k === ME`.
15. **`index.html` hero count-up appends "+" to every stat** (`:758`): reads "6+ sessions", "12+ hours", "6+ things you ship". Only "50+" should keep it.
16. `index.html:553` "30 slides" for S1 (31). `:535` rhythm aria-label 8/45/50/12 vs `course-plan.md:30` 8/48/50/12 (sums 115 / 118, not 120). `:437` "25 concepts" (marquee 19, syllabus 30). `:742` "verified july 2026" vs README/fact-check "August 2026". `:497` "Roll the dice" button has no base `.btn` rule (renders as a bare native button). Duplicate `id="journey"`. `:678` links the raw `.ipynb` (browser downloads JSON — link to Colab `github/…` URL instead).
17. **S5 deck says Session 6 is "tomorrow"** — `:520` "tomorrow's-session material, today", `:567` "(red-team vs blue-team — tomorrow's session)". It's the same afternoon.
18. **S2 slide 8 depth panel: "B won 4–3… a one-question gap"** — the widget renders A 2/5, B 4/5 and prints "B wins 4–2". `session-2-prep.md:118` and slide-guide:153 repeat 4–3.
19. **S3 cheatsheet contradicts the S3 deck**: `:35` "lectures → notes is solved" vs slide 10 "not uniformly solved"; `:22` "guaranteed JSON" vs slide 12 "does not verify". **S5 cheatsheet `:12-14` shows `eval()` behind a char filter** (admits `9**9**9`) — the notebook and deck deliberately use an AST `safe_eval`.
20. **S6 presenter/notes stale vs the reworded slides**: DATA title still "There is no secure AI agent"; slide-10 note and `notes.md:90` say "Four things change" (slide now lists five); prep `:19,57` still "Colab is the easy 20%".
21. **S5 "loop with no exit condition"** (`:492` panel, `session_5_lab.ipynb` Stretch 4 comment, prep) — the on-slide sketch already has `and steps < MAX_STEPS`, and Lab 5 Cell 4 has no `while` at all.
22. S1 slide 19 panel "That's slide 20" → slide 22. S1 slide 30 "Two things before the next session" shows three cards. `session-5:1026` "Sessions 2's". S4 `:554` "today's lab ≈ 6 chunks" (playground is 6; lab is ≤ 60). S4 lab slide "5-question mini-eval" vs S6 "10-example eval". Ship checklist: cheatsheet 9 items, deck/notebook 8, handout "8-point". Rubric: `certificate.html` "surviving one unrehearsed input" (40 pts, mandatory) vs S6 slide 18 "wild-card if you're brave" (optional).
23. **`Lab-Requirements-GenAI-Course.docx`** (sent to IT): "Dates: ______" and "Expected students: ______" blank; §4 "One PC per pair is enough" contradicts "both partners run every cell" (S1 slide 28, facilitation guide); promises the non-existent offline path (item 7); Day-2 needs students' own PDFs on the PC (only Session 3 phone-transfer is covered); suggest `*.googleapis.com` in the allow-list rather than the exact host. **It carries your mobile number and `sync-to-blog.sh` does not exclude it** — it deploys to intrepidkarthi.com/genai/ (as does the `~$b-Requirements…docx` Word lock file). `certificate.html` is linked from `index.html:684` but excluded from the deploy → 404 on the public site.
24. **Unverified mid-2026 claims not in `fact-check.md`** (faculty will check): S1 `:837` "1 billion monthly users June 2026 / 900M weekly in February"; S1 `:495,913-917` "GPT-5.6 (Luna · Terra · Sol)", "Claude Fable 5 · Sonnet 5 · Opus 4.8", "Gemma 4", "Gemini 3.5 Flash · Pro"; S3 `:578` "Sora 2, Veo 3.1, Kling 3.0 … $0.10–0.75/s"; S5 `:649` "Gemma 4 E4B (Apache 2.0, March 2026)". Add to the volatile table or soften to "as of mid-2026".
25. **3 Sep cheap fixes still open**: model-list verify cell at top of Lab 1; `my_tests[:5]` as the code default in Lab 2; "put two photos in Drive now" on S1 lab-kit slide; handwriting sample for Lab 3; pairs tie-break (both have keys, one drives per part, swap at checkpoints); "three iterations documented well beats five"; TEACH-THIS-YOURSELF saying S3 is the one to cut.
26. "Move the lab to the next session as homework" boilerplate in all six `session-N-notes.md` and `lab-facilitation-guide.md:89` (no next session after S6); `session-1-prep.md:213` "Homework, then the hand-off" on the slide titled `no_homework`; `course-plan.md:5` still "Fri+Sat or Sat+Sun".
27. Lab 2 handout `:33` stretch "swap the answer order to catch position bias" — the notebook's `judge_score` grades one answer; nothing to swap. S2 cheatsheet `:56` paper list is copy-pasted from S1. S1 `:737` "on real tokenizers the gap is *wider*" — Gemini is comparatively efficient on Tamil; the lab's `count_tokens` may show ~2×, narrower than the toy; say "varies — measure it".
28. Broken anchor `how-llms-work.html:838` → `LEARNING-GUIDE.html#part-9--the-whole-machine-end-to-end` (id is `part-9`). `fact-check.md:19` cites "S1 s14" for the attention paper (now slide 16). Kural page + deck have no dark theme while index and all decks share the `tce-genai-theme` toggle. README layout omits the Kural deck, poet notebook, docx, slide-guides.
29. ASSESSMENT: CO-coverage row for CO2 lists Q11 under Part C but marks "2 + 6 + —" (`:348`); Part B declared either/or (`:118`) but only one CO6 Part-B question exists, so a CO6 pair can't be formed; programme named "BE CSE (AI & ML)" here vs "BE CSE" elsewhere; instructor "Karthikeyan N G" in docx/pdf vs "Karthikeyan NG" everywhere else (course-plan uses the full name).

---

## D. What is solid — leave alone

The through-line (predict → measure → see → know → act → ship) is real and every session pays back an earlier one. Session 2 is the best-built: spot-the-lie keys are correct, the ±1/√n and judge-bias panels are accurate, the harness matches the slide code and prints n. Session 4's deck is the strongest of Day 2 — 0.78/0.41/0.12 recur consistently from slide 6 through the stepper, cost-slider math checks, the four depth panels are right; the notebook (once item 1 is fixed) is genuinely ~60 readable lines with correct cosine math, sampled `MAX_CHUNKS`, and two excellent stretches. Session 5's `p^n`/Monte-Carlo/100-agent widgets compute what they claim (0.95¹⁰ = 0.60), the AST calculator, `days_between`, manual-call Part C and guarded loop are correct SDK usage, and budgets sum to exactly 120. Session 6's uncommitted edits (dark theme, custom payload, lethal-trifecta panel) are wired correctly and consistent with S4/S5; attack widgets, defence-toggle threshold, cost slider and the 40/25/15/10/10 rubric all agree with fact-check, certificate and course-plan. Session 3 is the only one that lands the 8/48/50/12 rhythm; its canvas diffusion, latent-compute derivation (≈48×), `response_schema` with nullable fields and the "json.loads is the test" checkpoint are right. S1's temperature widget is exact softmax(log p / T), the loss/perplexity and n² numbers check, the bigram demo reappears verbatim as Stretch 4. `index.html`: scripts clean, temperature widget math right, localStorage guarded, semantic-search widget's "0 keyword hits" holds for all four chips, 54 demo blocks ("50+" ✓), 21 depth panels ✓, Kural deck has 18 slides ✓.

---

## E. Suggested order of work (≈ 1.5 days)

1. Item 1 (embed fix + validator + live run on a fresh auth key) — 1 hour, do first, today.
2. Items 2, 3, 6 — Day-2 continuity: Drive mount, reload cells, sample doc, pre-filled queries, S6 timing — half a day.
3. Items 4, 8, 9, 11 — Session 1: cut slides 14–17, fix lab budget, fix slide 28, clear outputs — 2 hours.
4. Items 5, 13 — regenerate keys; wording fixes in README/course-plan/fact-check; the temperature note — 1 hour.
5. Item 7 — decide: build the mock path or delete the promise (and fix the docx, item 23) — 1 hour to delete, an afternoon to build.
6. Items 10, 12, 14, 15, 17–22 — mechanical/consistency sweep, then regenerate all `.html` twins — 2 hours.
7. Week-of: live-resolve both `-latest` aliases, screenshot rate limits, verify Lab 1 temperature demo and Lab 5 function-response format, pre-pull `gemma4:e4b`.
