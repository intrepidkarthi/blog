# Access, Setup, and Fallback Guide

The designed path runs on a computer with a web browser, Google Colab, and a permitted Google account. Nothing needs to be installed locally, but provider access, account verification, network access, and free-tier quotas must be checked before class. For students who cannot use the live API there is a built-in offline path: every notebook has `MOCK = False` in Cell 1 — set it to `True` and every cell runs on canned responses (prefixed `[MOCK]`; Lab 4 uses a hashed bag-of-words embedding so search still works).

## What you need
- A browser (Chrome, Edge, Firefox — anything).
- Access to Google Colab.
- A Google account permitted to use Colab and, for the live path, AI Studio.
- The instructor's pre-class access check completed — or, failing that, the notebook's `MOCK = True` offline path.
- No local Python installation is required.

## What you do NOT need
- ✗ **No installation.** No Python, no libraries on your machine. Colab installs everything in the cloud, per session.
- ✗ **No powerful laptop.** A ₹15,000 laptop, a 6-year-old machine, or a shared college lab PC all work **identically** — because the code runs on Google's servers, not yours. Your browser just shows the result.
- ✗ **No GPU, no fancy RAM.** The AI models run in Google's data centre. Your device never does the heavy lifting.
- ✗ **No credit card is required by the designed free-tier path.** Availability, verification, quotas, and provider terms can change; check the live account before teaching.
- ✗ **No paid ChatGPT/Claude subscription.** The comparison exercise can use free web access or the notebook's `[MOCK]` comparison responses.

## Why any machine works
Every lab is a **Google Colab notebook** — a Python environment that lives in your browser and executes on Google's cloud. When you click "run," the work happens on Google's computers and the answer comes back to your screen. So the only thing your laptop does is display a web page. A phone-grade CPU is plenty.

## Does the free tier actually cover the labs? (the math)
Each student uses their **own** free Gemini API key. Rough API calls per lab:

| Lab | Typical calls | Notes |
|---|---|---|
| S1 first calls | ~15 | 5 prompts + comparison + stretch |
| S2 evaluation | ~50 | heaviest — eval loops + A/B (retry handles limits) |
| S3 vision | ~25 | images auto-resized to save quota |
| S4 RAG | ~45 | chunk-embedding capped to 60 chunks |
| S5 tools | ~15 | |
| S6 security | ~20 | |

A full **day** of labs (3 sessions) is roughly **90–110 calls per student** before retries and reruns. That may fit a current free tier, but it is not a guarantee: limits vary by project, model, account age, region, and provider policy. Check each teaching project's live limits before class and avoid running every stretch goal in a large room.

**If a student hits a limit or cannot access the API:** stop rerunning the live cells. Set `MOCK = True` in Cell 1 and re-run — every cell then works on canned `[MOCK]` responses — or pair the student with a working machine. Do not ask students to create extra accounts, share keys, or bypass provider controls.

## API keys in September 2026 (read before the pre-class check)
- Since September 2026 the Gemini API **rejects the older "Standard" keys**. Keys created in AI Studio now are auth keys automatically, so a student who creates a key during the pre-class check is fine. Instructors: regenerate every demo/instructor key created before the change and re-run the live check.
- **If you already have a Google Cloud account** (ever created a project, used Firebase, etc.), AI Studio does not create a default project for you — "Get API key" only works after you **import an existing project** in AI Studio. Do the pre-class check with a plain personal Gmail if in doubt.
- Both partners in a pair create a key. One drives per lab part; swap at each checkpoint.

## The one thing that runs locally — and it's optional
Session 5 shows **Ollama** (running an AI model on your own laptop, offline). This is an **instructor demonstration only.** Students are **not** asked to install it during the lab — their Session 5 lab uses the same free cloud API as every other session. "Try Ollama at home" is an optional stretch for the curious (it wants ~8 GB RAM); skipping it costs you nothing in the course.

## Keeping usage light (built into the notebooks)
- Images are **auto-resized** before sending (a 4000px photo and a 1024px one get the same answer — but the small one costs far less quota).
- RAG document embedding is **capped** so a giant PDF can't drain your daily limit — use a few pages or one chapter.
- Every notebook's `ask()` helper (Cell 2) **retries with backoff**, so the occasional rate-limit (`429`) or a blocked/empty response is handled instead of crashing — Labs 1 through 6, no exceptions. Retries are bounded; once a quota is truly exhausted, switch to `MOCK = True`.
- One `MODEL` variable per notebook: if a cheaper/newer free model appears, it's a one-line change.

## Privacy note (not a cost, but important)
Free-tier prompts may be used by the provider to improve their products. So: **don't paste anything private** (real ID numbers, passwords, confidential documents). Use your own class notes and sample data — which is what the labs do anyway.

**Bottom line: if you can open a website, you can use the designed Colab path. If the live provider is unavailable, `MOCK = True` in Cell 1 preserves the programming, evaluation, RAG, and security learning without requiring a key — at reduced fidelity, and every mock answer says so with its `[MOCK]` prefix.**
