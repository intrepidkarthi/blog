# Generative AI: Foundations and Applications

Course materials for the one-credit Generative AI course at Thiagarajar College of Engineering, Madurai (3rd/4th year BE CSE). 12 hours · 6 sessions × 2 hours · **weekend bootcamp** (Day 1: S1–S3, Day 2: S4–S6) · fully hands-on with Google Colab + Gemini free tier.

Instructor: **Karthikeyan NG** (TCE CSE '09) · [@intrepidkarthi](https://twitter.com/intrepidkarthi)

## Start here
Open **`index.html`** in a browser — it's the course home page linking every session and guide.

## Repo layout

```
index.html                  ← course home page (links every deck + guide)
how-llms-work.html          ← "Where does the answer live?" — 10-min interactive walk through the
                              architecture (four tables, residual stream, Q/K/V, superposition).
                              Deliberately does NOT overlap Session 1; prose version = LEARNING-GUIDE Part 9
llm-playground.html         ← run the pieces yourself, live in the browser
course-plan.md              ← master plan: structure, capstone, bootcamp format, currency & future-proofing
LEARNING-GUIDE.md           ← every concept in one document — read this to LEARN or refresh the whole course
                              (Parts 1–7 = the main line; Part 8 = the depth layer, mechanism-level;
                               Part 9 = the whole machine end to end)
TEACH-THIS-YOURSELF.md      ← run the course at any scale (12 hours / one session / a 45-min talk)
LOCALIZATION.md             ← swap-kit for teaching it outside Madurai (what to localize, what is load-bearing)
ZERO-SETUP.md               ← the any-laptop, zero-cost guarantee + free-tier budget math
TIMING.md                   ← per-slide timing for all sessions (mirrors the in-deck presenter timer)
presentations/              ← 6 interactive HTML decks (offline; F fullscreen, O overview, S presenter mode)
instructor-notes/
  session-N-prep.md         ← STUDY BEFORE: concept deep-dives, pushback Q&A, demo rehearsal, facts to verify
  session-N-notes.md        ← DELIVERY DAY: minute-by-minute run sheet, slide beats, timing
  lab-facilitation-guide.md ← how to run every lab hour (failure playbook, timing template)
  fact-check.md             ← every substantive claim + source + status (re-verify volatile facts before teaching)
  all-notes-source.html     ← the single source for instructor-notes-all-sessions.pdf (reprint with headless Chrome)
  instructor-notes-all-sessions.pdf ← 119pp: 6 prep packs + 6 run sheets + facilitation guide
labs/session-N/
  lab-handout.md            ← student-facing lab sheet with checkpoints + stretch goals
  session_N_lab.ipynb       ← ready-to-run Colab notebook
cheatsheets/                ← 1-page per-session reference cards for students
assets/img/                 ← instructor photos used in the Session 1 collage
```

Every session ships six files: **deck · prep pack · run sheet · lab handout · notebook · cheatsheet.** Repo-wide guides cover learning, teaching, timing, cost, and fact-checking.

## Presenter mode
Open any deck and press **`S`** for a live panel: a session timer, each slide's time budget, a cumulative target, a pace badge (on-time / behind / ahead), speaker notes, and the next-slide preview. It's how you keep 12 hours on schedule and protect the labs.

## Instructor prep order (per session)

1. Read `instructor-notes/session-N-prep.md` a day or two ahead — deep-dives, the questions smart students will ask, and the facts to re-verify (model names, free-tier limits, prices change).
2. Rehearse with the deck open; every interactive is driveable and resets on slide re-entry.
3. On delivery day, run from `instructor-notes/session-N-notes.md`.

## Using the decks

- Open the `.html` in Chrome/Edge/Firefox. No internet needed — fully self-contained (photos embedded).
- **→ / Space** next · **←** previous · **F** fullscreen · **O** slide overview · **number + Enter** jump to slide.
- Interactive demos are live on their slides — click/type/drag/vote during the talk. Design: clean white editorial, one blue accent, no gradients.

## Running the labs

1. Students open the session's `.ipynb` in Google Colab (File → Upload notebook, or host on GitHub + Colab badge).
2. Each student makes their own free Gemini API key at https://aistudio.google.com (no credit card).
3. Notebooks take the key via `getpass` — never paste keys into code cells.
4. **Before Day 1:** replace the placeholder `tinyurl.com/tce-genai` on Session 1's lab-kit slide with your real short link, and host the materials behind it.

## Session index

| # | Title · deck file | Covers | Student builds |
|---|---|---|---|
| 1 | How Machines Learned to Talk · `session-1-how-machines-learned-to-talk.html` | What is Generative AI? | First API call |
| 2 | Talking to AI, and Catching Its Lies · `session-2-…-catching-its-lies.html` | Prompting + Evaluation | Eval harness |
| 3 | AI Beyond Text · `session-3-ai-beyond-text.html` | Images, Voice, Video | Vision app |
| 4 | Giving AI Your Own Knowledge · `session-4-giving-ai-your-own-knowledge.html` | Embeddings + RAG | Chat-with-notes |
| 5 | Making AI Do Things · `session-5-making-ai-do-things.html` | Tools + Choosing the Approach | Tool-using assistant |
| 6 | Breaking, Securing, Shipping · `session-6-breaking-securing-shipping.html` | Security + Shipping + Capstone | Hardened demo |

The capstone threads across Day 2: the RAG app (S4) gains tools (S5), then gets attacked, hardened, and demoed (S6). Every app carries an eval set from S2.

## Tech (verified July 2026)

`google-genai` SDK · default `gemini-flash-latest` — the free tier's current Flash (Gemini 3.5 Flash as of July 2026); the alias matters because dated ids age out (`gemini-2.5-flash` is no longer available to new accounts) — one `MODEL` variable per notebook, so pinning a dated id is a one-line change · `gemini-embedding-2` for RAG (`gemini-embedding-001` shut down July 2026) · Ollama for the local-model demo in S5. Model names and free-tier limits change often — the prep packs list exactly what to re-verify before each session.
