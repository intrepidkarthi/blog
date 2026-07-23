# Zero-Setup, Zero-Cost Guarantee

This whole course runs on **any computer with a web browser and a free Google account.** Nothing else.

## What you need
- A browser (Chrome, Edge, Firefox — anything).
- A free Google account (for Google Colab + a Gemini API key).
- That's the entire list.

## What you do NOT need
- ✗ **No installation.** No Python, no libraries on your machine. Colab installs everything in the cloud, per session.
- ✗ **No powerful laptop.** A ₹15,000 laptop, a 6-year-old machine, or a shared college lab PC all work **identically** — because the code runs on Google's servers, not yours. Your browser just shows the result.
- ✗ **No GPU, no fancy RAM.** The AI models run in Google's data centre. Your device never does the heavy lifting.
- ✗ **No credit card, no payment, no trial that expires.** The Gemini free tier needs no card.
- ✗ **No paid ChatGPT/Claude subscription.** Free web tiers are enough for the one comparison exercise (Session 1).

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

A full **day** of labs (3 sessions) is roughly **90–110 calls per student** — comfortably inside the free tier's daily limit (a few hundred requests/day per key). Free-tier limits change, so the exact ceiling varies, but the labs are deliberately sized to fit with room to spare.

**If a student ever hits the daily cap** (usually from re-running cells while debugging): it resets the next day, or they make a second free key with another Google account. No money involved, ever.

## The one thing that runs locally — and it's optional
Session 5 shows **Ollama** (running an AI model on your own laptop, offline). This is an **instructor demonstration only.** Students are **not** asked to install it during the lab — their Session 5 lab uses the same free cloud API as every other session. "Try Ollama at home" is an optional stretch for the curious (it wants ~8 GB RAM); skipping it costs you nothing in the course.

## Keeping usage light (built into the notebooks)
- Images are **auto-resized** before sending (a 4000px photo and a 1024px one get the same answer — but the small one costs far less quota).
- RAG document embedding is **capped** so a giant PDF can't drain your daily limit — use a few pages or one chapter.
- Every notebook has a **retry-with-backoff** helper, so the occasional rate-limit (`429`) is handled automatically instead of crashing.
- One `MODEL` variable per notebook: if a cheaper/newer free model appears, it's a one-line change.

## Privacy note (not a cost, but important)
Free-tier prompts may be used by the provider to improve their products. So: **don't paste anything private** (real ID numbers, passwords, confidential documents). Use your own class notes and sample data — which is what the labs do anyway.

**Bottom line: if you can open a website, you can do every hands-on part of this course, for free, on the machine you already have.**
