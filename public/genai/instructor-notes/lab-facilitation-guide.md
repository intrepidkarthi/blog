# Lab Facilitation Guide — all 6 labs
How to run the hands-on hours so nobody is silently stuck and everybody ships something. Read this once; it applies to every lab.

## The universal rhythm (same all weekend — taught once on S1’s “Your lab kit, and the rhythm” slide)
1. **Pairs.** Both partners run every cell on their own machine. One types, one reads the output aloud, swap each part.
2. **Checkpoints → show the instructor.** Each ✓ is a 10-second show-me. It's how you catch a stuck pair before minute 40, not after.
3. **The 5-minute rule.** Stuck > 5 min? Ask the pair beside you first, then the instructor. (Peer-teaching scales you; it also cements the helper's learning.)
4. **Stretch goals for fast pairs.** There is always more on the handout — nobody sits idle.

## Your job during the lab hour (the same four moves)
- **First 10–15 min = setup triage.** This is where labs live or die. Circulate fast, fix keys/uploads, get everyone to Checkpoint 1.
- **Middle = ask "what did it get WRONG?"** not "did it work?" — trains the evaluation mindset every session.
- **~Minute 40 = checkpoint sweep.** Walk a paper roster; confirm every pair hit the checkpoints. Note 2–3 interesting results for show & tell.
- **Last 10 min = land the plane.** Call the final task (test set / save notebook / documents for tomorrow) out loud; don't let it drift.

## Timing template (50-min lab)
| Min | Phase |
|---|---|
| 0–3 | You brief from the lab slide; students open the notebook + Save to Drive |
| 3–15 | Setup + Checkpoint 1 (the make-or-break window) |
| 15–35 | Core parts + Checkpoints 2–3 |
| 35–45 | Stretch for fast pairs; you sweep checkpoints |
| 45–50 | Everyone lands the closing task; you pick show-&-tell items |

---

## Per-lab specifics

### Lab 1 — Your First API Call (S1)
**Goal:** everyone's own key + first Gemini response + one model-comparison surprise. Ends with writing the 10-question test set (Part E).
**Setup landmines:**
- College Google account blocks AI Studio → use a personal Gmail.
- Phone-verification loop on key creation → hand them a spare paper key to proceed; they make their own at home.
- **Carry 5 spare keys on paper.** This single prep item saves the most lab time all weekend.
**Watch for:** students pasting the key into a code cell (it must go in the `getpass` box). 
**Land the plane:** Part E (10 questions + answers) in the last 10 min — it's the fuel for Lab 2, one hour later. Don't let anyone skip it.

### Lab 2 — The Lie Detector (S2)
**Goal:** prompt makeover (5 documented iterations) + an eval harness scoring their own 10 questions + a prompt A/B with numbers.
**Landmines:**
- `expected` strings too long ("A. R. Rahman composed it in 1992") → coach to key-fact-only ("rahman"). This is the #1 issue.
- Test set the model aces 10/10 → "your test is too easy — add obscure questions until it bleeds. A test that can't fail teaches nothing."
- Changing 3 things between eval runs → one change at a time or you learn nothing.
**Heaviest lab for API calls (~50).** Free tier handles it; the retry helper covers 429s.
**Show & tell:** best before/after prompt + best caught hallucination. Ask: "model, scorer, or question?"

### Lab 3 — Interrogate Your Photos (S3)
**Goal:** photo Q&A ladder + document→JSON that actually parses + one confident invention caught.
**Landmines:**
- Photo upload is the #1 time sink → demo the folder-icon upload ONCE on the projector before releasing them.
- iPhone HEIC files → screenshot the photo and upload the PNG (fallback in notebook).
- Students stop at "the JSON looks right" → push until `json.loads()` succeeds. The parse crash IS the lesson.
- Images are auto-resized in the notebook (`_shrink`) — no action needed, but mention it (quota-saving).
**Show & tell:** two best inventions. Then **Day-1 close** — don't rush; repeat the "bring 2–3 documents tonight" task twice.

### Lab 4 — Chat With Your Notes (S4) — the main build
**Goal:** a working RAG app over their own document, with citations + one honest failure.
**Landmines:**
- **Garbage PDF extraction** (#1): scanned PDFs have no text layer → pypdf returns empty. Fix: swap to a text PDF, or screenshot pages → S3 vision transcription (nice callback for fast pairs). Catch this at Cell 2's sanity print, not minute 40.
- Chunks capped at 60 (`MAX_CHUNKS`) — keeps free-tier safe; if they want more, one chapter at a time.
- Junk search results → 90% chunking (tune `target`), 10% bad extraction.
- "I don't know" test failing (it invents) → strengthen the ONLY line + escape hatch; A/B it (S2 discipline).
- Embedding loop sleeps 1s between batches — students who delete it hit 429.
**Show & tell:** two honest failures + fixes. Remind: **SAVE the notebook** — it's the capstone foundation.

### Lab 5 — Give It Hands (S5)
**Goal:** calculator tool (fixes S1's math) + a chained two-tool call + the raw function-call trace + scenario cards.
**Landmines:**
- `eval()` in the demo calculator: the notebook validates the charset first — point out WHY (never eval raw model output). Good security habit before S6.
- Automatic function calling feels like magic → Part C (manual, see the raw call) de-mystifies it; make sure pairs do it.
- **Ollama is NOT in the student lab** — it's your instructor demo only. If a student asks to run it, that's an at-home optional, not lab work.
**Accelerator:** nudge strong pairs to the Stretch (wire their S4 `search_notes` in as a tool) — that literally assembles their capstone.
**Checkpoint 3 is verbal** — hear at least one scenario defense per pair.

### Lab 6 — Break It, Then Ship It (S6) — finale
**Goal:** attack a naive bot, harden it, red-team a classmate's app, self-audit, then demo.
**Landmines / logistics:**
- Attack/defense behavior is **probabilistic** — the naive bot sometimes refuses, the hardened one sometimes slips. Say so; it's the honest picture of security.
- **Enforce the laptop swap** for red-teaming (Part C) — the indirect-injection-via-poisoned-document is the moment; make sure pairs actually try it. Keep it good-natured.
- **Demos: hard-cap 3 min each with a visible timer.** ~10 pairs = tight. Enforce the 3-part structure (does / one failure / one fix). Applaud every team.
- If > 12 pairs: run two parallel demo rooms, or pre-select via 1-line pitches, or a short overflow. Decide before the session.
**Grade live** against the rubric (working 40 / eval 25 / failure 15 / fit 10 / presentation 10). Say out loud before demos: "honest evals + a real failure beat a flashy fragile demo" — so they optimize for the right thing.

---

## If the internet or a service dies (any lab)
- **Venue Wi-Fi down:** decks are fully offline. Switch to instructor-driven demo over a phone hotspot on the projector; students run the notebook at home and submit checkpoints async.
- **AI Studio down / blocked campus-wide:** for prompt-comparison-style parts, fall back to the free web UIs (Gemini web, ChatGPT). API portions become take-home.
- **A student's key hits its daily cap:** it resets next day, or a second free key with another Google account. Never a paid fix.
- **Colab is slow / disconnects:** Runtime → Restart; reconnect. Work is in Drive if they saved. Their laptop specs are irrelevant — it's Google's cloud.

## The one metric that matters
Every student leaves each lab with **working code they ran themselves** and **one thing they found that was wrong.** If both are true, the lab succeeded — regardless of how polished the output looked.

## Known API failure modes (both seen live, July 2026)

### 1. 403 "project denied access"

Seen in the wild (July 2026): a key that authenticates (`count_tokens` works) but every
`generateContent`/`embedContent` call returns **403 PERMISSION_DENIED — "Your project has been
denied access"**. This is a Google project-level block, not quota and not a code bug.

**Fix (2 minutes):** aistudio.google.com/app/apikey → **Create API key** → choose
**"Create API key in new project"** (not the existing project) → swap the key in. If a student
hits this, don't debug their code — recreate the key in a fresh project first.

### 2. 404 "model no longer available to new users"

Verified live (July 2026, fresh free-tier account): `gemini-2.5-flash` and
`gemini-2.5-flash-lite` return **404 — "no longer available to new users"** on newly created
accounts, while older accounts still have them. So the same model id works on one laptop and
404s on the one next to it — a mixed room sees it inconsistently, which looks baffling until
you know the cause.

**Tell:** the key itself is fine (other models respond); only a *pinned old* model id 404s,
and only for students whose Google account/key is new.

**Fix:** none needed if they're on the course code — every notebook uses the
**`gemini-flash-latest`** alias, which serves the current Flash to old and new accounts alike,
so nobody following the notebook should ever hit this. If a student does hit it, they typed a
pinned old id (copied from a blog post or an old snippet) — point them back to the `MODEL`
line at the top of the notebook rather than debugging anything else.

### Mode 3 — 503 "model is currently experiencing high demand" (seen live, July 17 2026)

`gemini-flash-latest` (and 3.5 Flash behind it) can 503 for many minutes during
capacity spikes — while the **lite tier stays instant**. Verified during a real
event: `flash-latest` 503'd continuously; `gemini-flash-lite-latest` answered in 0.6 s
on the same key.

**Tell:** every generate call 503s, `count_tokens`/`embed_content` still fine.
**Fix (one line, announce to the room):** `MODEL = "gemini-flash-lite-latest"` — every
lab works identically on it. Switch back after the spike if you care.
