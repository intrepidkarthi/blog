# Lab 1 — Your First AI API Call
**Session 1 · Generative AI: Foundations and Applications · TCE**

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.
50 minutes · pairs (both partners run everything) · Goal: your code talks to a frontier AI model

> **AI coding assistants (Copilot, ChatGPT, Gemini) are allowed and encouraged in every lab.** One rule: your eval set judges their code too.

---

## Part A — Get your API key (10 min)

1. Go to **https://aistudio.google.com** → sign in with a personal Google account.
2. Click **Get API key** → **Create API key**. Copy it somewhere private.
3. Rules: your key = your password. Never paste it in code cells, never WhatsApp it, never commit it to GitHub.

> Stuck after 5 minutes (college account blocked, phone verification loop)? Take a spare key from the instructor and create your own at home tonight.

## Part B — First call (10 min)

1. Open the Colab notebook: **link on the board** (`session_1_lab.ipynb`).
2. **File → Save a copy in Drive** (so your work persists).
3. Run **Cell 1** (installs the SDK) and **Cell 2** (asks for your key via a hidden password box).
4. Run **Cell 3** — your first API call.

✓ **Checkpoint 1:** the notebook prints a response written by Gemini. Read it out loud to your partner.

## Part C — The five prompts (15 min)

Run each prompt in **Cell 4** (one function call each). After each, write one line in the notebook's observation cell: *what was good, what was off?*

| # | Skill | Prompt |
|---|---|---|
| 1 | Explain | "Explain how UPI works to a 10-year-old, in 5 sentences." |
| 2 | Summarize | "Summarize the plot of Ponniyin Selvan in exactly 3 bullet points." |
| 3 | Translate | "Translate to formal Tamil: 'The exam has been postponed to next Monday.'" |
| 4 | Extract | "Extract name, degree, year as JSON from: 'Hi, I'm Priya, third year BE CSE at TCE.'" |
| 5 | Roleplay | "You are a strict interviewer at a product company. Ask me one DSA question, wait for my answer." |

✓ **Checkpoint 2:** all 5 ran; you wrote 5 one-line observations.

## Part D — One prompt, three models (15 min)

Pick **one** prompt from Part C (or write your own). Run the same text on:

1. **Gemini** (your notebook — API)
2. **ChatGPT** — https://chatgpt.com (free, no login needed for basic use)
3. **Any third**: Claude (https://claude.ai), Copilot, Meta AI — your choice

Fill this table (also in the notebook):

| | Gemini | ChatGPT | Third model |
|---|---|---|---|
| Length / format | | | |
| Tone / personality | | | |
| Accuracy issues? | | | |
| Which would you ship to a user? | | | |

✓ **Checkpoint 3 (show instructor):** your printed Gemini response + the one difference that surprised you most.

## Part E — Build your test set (last 10 min, everyone)

Sessions run back-to-back, so do this **now**, before the break:

Pick one subject you know **cold** — DSA, cricket stats, Tamil cinema, Ilaiyaraaja discography, your hometown, anything. In a text file, write **10 questions with their correct answers**. Keep it open — this is your ammunition for Session 2's lie-detector lab, where you'll measure how often the AI gets *your* subject right.

## Stretch goals (if you finish early)

- **S1 · Temperature:** in the notebook's temperature cell, run the same prompt at `temperature=0.0` three times, then `temperature=1.5` three times. What changed?
- **S2 · Tamil stress test:** ask the same factual question in English and Tamil. Same answer? Same quality?
- **S3 · Token counting:** use the token-count cell to measure an English sentence vs its Tamil translation. Confirm what you saw in the lecture.
- **S4 · The 15-line language model:** run the counting-based next-word model from the lecture — train it by tallying, then sample sentences. Same three steps as Gemini; step 2 is a table you can print instead of a learned function.
- **S5 · Break it:** find a question Gemini answers wrongly with confidence. Your first hallucination catch — screenshot it for bragging rights in Session 2.

## Overnight (before Day 2 — 5 min, important)

Day 2 starts with **"chat with your own notes"** (RAG). Put 2–3 documents you actually care about on your laptop or Drive: lecture notes, a textbook chapter PDF, your own study notes. Your Day 2 apps are only as interesting as the documents you bring.
