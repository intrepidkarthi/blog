# Before the sessions — student checklist

### 24AM1B0 · Generative AI: Foundations and Applications
**B.E. CSE (AI & ML) · Thiagarajar College of Engineering, Madurai**
Six sessions × 2 hours · 19–20 September 2026 (Saturday and Sunday)

---

**Nothing to install.** Every lab runs in your browser on Google Colab. Your laptop only
displays a web page — the code executes on Google's servers. A six-year-old machine, a
₹15,000 laptop and a lab PC all work identically. No GPU, no Python, no payment.

**There are four things to do, and three of them take five minutes.** Do them **this
week**, not on the morning of Day 1. The single most common way a student loses the first
half hour of the course is discovering a sign-in problem at 9:05 a.m. on Saturday.

---

## 1 · A Google account you can sign in to on a lab PC

Use a **personal Gmail account**, not your college account.

College Google Workspace accounts very often have Colab or AI Studio disabled by the
administrator, and you will not find out until you try. A personal Gmail avoids the
problem entirely. If you do not have one, create one now — it takes two minutes.

- [ ] I have a personal Gmail account and I know the password.
- [ ] I have signed in to it once in a browser this week.

## 2 · A free Gemini API key

Go to **aistudio.google.com** and sign in with the account from step 1.

- [ ] The page loads and I can see a **Get API key** button.
- [ ] I have created a key and saved it somewhere I can copy from on Day 1 — a note on
      my phone, or a text file. **Do not** share it with anyone, including your lab partner.

It is free and needs **no credit card**. Google may ask to verify your phone number, so
**bring your mobile phone on Day 1**.

> **If you already have a Google Cloud account** — if you have ever created a Cloud
> project, used Firebase, or claimed student credits — AI Studio will not create a
> default project for you, and "Get API key" will not work until you **import an existing
> project**. This is the most common failure in the room. Check it this week, not on
> Saturday. If it gives trouble, make the key with a plain personal Gmail instead.

You will work in pairs, and **both partners create their own key**. One of you drives per
lab part and you swap at each checkpoint, so both of you will have typed every kind of
cell by the end. Sharing one key means one of you spends two days watching.

## 3 · Check that Colab actually opens

- [ ] Open **colab.research.google.com**, click **New notebook**, type
      `print("hello")` and press the run button. It prints `hello`.
- [ ] **File → Save a copy in Drive** works.

If either fails on the college network, tell your class representative **before Friday**
so it can be fixed rather than discovered live.

## 4 · Bring your own material

| For | Bring | When |
|---|---|---|
| **Session 3 — images** | 2–3 photos on your laptop: a mess bill, a receipt, your own handwritten notes, a menu board. Anything with text in it | Day 1 |
| **Session 4 — RAG** | 2–3 of your own documents as PDF or text — lecture notes, a chapter, a report. Short, text-based documents work best | Day 2 |
| **Both** | A way to move a photo from your phone to the PC — a USB cable, or upload to Google Drive from the phone | Day 1 |

> **Do not use private material.** No marks sheets, no ID numbers, no passwords, no
> confidential college records. Free-tier prompts may be used by the provider to improve
> their products. Use your own class notes and sample data — which is what the labs do anyway.

---

## Summary — the whole list

- [ ] Personal Gmail account, password known
- [ ] Gemini API key created at aistudio.google.com and saved where I can copy it
- [ ] Mobile phone with me on Day 1 (for phone verification)
- [ ] Colab opens, runs a cell, and saves to Drive
- [ ] 2–3 photos for Session 3
- [ ] 2–3 non-sensitive PDFs or notes for Session 4
- [ ] Laptop charger, or a seat near a power socket

## What you do **not** need

No Python · no Anaconda or Jupyter · no VS Code · no GPU or high-RAM machine · no
administrator rights · no credit card · no paid ChatGPT, Gemini Advanced or Colab Pro
subscription.

---

**If something does not work on the day, the session still runs.** Every notebook has an
offline mode — one line at the top, `MOCK = True` — that runs every cell on canned
responses so you keep the programming, evaluation, RAG and security work even if the API
is unreachable. It is lower fidelity and every answer is labelled `[MOCK]`, so we would
much rather you arrive with a working key. But nobody gets stranded.

*Questions before the course: ask your class representative, or bring them to Session 1.*
