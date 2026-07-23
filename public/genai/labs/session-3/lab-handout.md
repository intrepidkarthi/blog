# Lab 3 — Interrogate Your Photos
**Session 3 · Multimodal · TCE** · 50 min · pairs · Same rhythm (checkpoints → show instructor)

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

**You need:** 2–3 photos on your laptop (receipt / handwritten notes / menu board / anything). Sample images linked in the notebook if you're stuck — but your own mess bill is more fun.

## Part A — The interrogation ladder (12 min)
Upload a photo to Colab (folder icon → upload). Run the 5-question ladder: describe → read text → count → infer → surprise. Grade each answer honestly.

✓ **Checkpoint 1:** ladder run + 2-line grading (where did it wobble?).

## Part B — Document → JSON (15 min)
Receipt/bill/marksheet → strict-schema extraction. The test isn't the output *looking* right — it's **`json.loads()` succeeding**. If the parse cell crashes, your prompt isn't strict enough. Tighten ("Reply ONLY with JSON", "null if unreadable — do NOT guess") and re-run.

✓ **Checkpoint 2:** parse cell prints your total.

## The production way: response_schema
Prompt-begging for JSON works — production code doesn't beg. Pass a schema with the request (`response_mime_type="application/json"` + `response_schema=…`) and the API **cannot** return anything else: no code fences, nothing to strip — and the format instructions come out of your prompt entirely. Run the Part B2 cell in the notebook.

✓ **Checkpoint:** `json.loads` never fails now — even with an empty prompt about format.

## Part C — Handwriting (8 min)
Your own notes page → transcription with `[?]` for unclear words. What % did it get? Tamil/Tanglish = bonus data point.

## Part D — Break it (10 min)
Find one **confident invention**: a blurred price it reads anyway, a miscount, paraphrased "quotes."

✓ **Checkpoint 3:** show me the invention.

## Stretch
Grounding A/B (does "reply UNREADABLE if unclear" stop the invention?) · vision eval — 5 images + expected answers through your S2 harness · voice-note transcription.

## Tonight (5 min — this one is mandatory)
Put **2–3 real documents** on your laptop/Drive: lecture notes, a textbook chapter PDF, anything worth querying. Tomorrow you build **chat with my notes** over them. No documents = boring Day 2. Bring good ones.
