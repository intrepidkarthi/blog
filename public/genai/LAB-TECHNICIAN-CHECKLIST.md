# Lab preparation checklist — for the lab technician

### 24AM1B0 · Generative AI: Foundations and Applications
**B.E. CSE (AI & ML) · Thiagarajar College of Engineering, Madurai**
Six sessions × 2 hours · 19–20 September 2026 (Saturday and Sunday)
One lab PC per student where possible; pairs sit side by side.

---

**In one line: nothing needs to be installed on the lab machines.** Every lab runs inside
the browser on Google Colab, so the college needs to provide a working browser, internet
access to a short list of Google sites, and permission for students to sign in with a
personal Google account. All computation happens on Google's servers.

**Please do not install Python, Anaconda or Jupyter for this course.** The notebooks are
written for Colab; a local install only creates version conflicts and support work.

The checks below take about **15 minutes** and are best done **one week before**.

---

## 1 · Software on each lab PC

| Item | Requirement | ✔ |
|---|---|---|
| **Web browser** | Google Chrome or Microsoft Edge, updated to a current version (2025 or later). Firefox also works | ☐ |
| **PDF viewer** | Any — the browser's built-in viewer is enough | ☐ |
| **Nothing else** | No Python, Anaconda, Jupyter, VS Code, Java, GPU drivers or paid software | ☐ |

## 2 · Network and firewall

Please allow these through the college proxy, firewall and content filter on the lab
network, for both days.

| Domain | Used for | Priority | ✔ |
|---|---|---|---|
| `colab.research.google.com`, `*.googleusercontent.com` | Colab notebook editor and runtime | **Essential** | ☐ |
| `accounts.google.com`, `drive.google.com`, `*.gstatic.com` | Google sign-in; saving notebooks to Drive | **Essential** | ☐ |
| `aistudio.google.com` | Students create their free Gemini API key here, in the first 10 minutes of Session 1 | **Essential** | ☐ |
| `*.googleapis.com`, `apis.google.com` | Sign-in and Colab / AI Studio backends | **Essential** | ☐ |
| `generativelanguage.googleapis.com` | The Gemini API itself | Recommended | ☐ |
| `intrepidkarthi.com` | Course site: decks, handouts, notebooks, cheatsheets | **Essential** | ☐ |
| `github.com`, `raw.githubusercontent.com` | Course repository and sample data | Recommended | ☐ |
| `chatgpt.com`, `claude.ai`, `copilot.microsoft.com` | One 15-minute comparison exercise in Session 1 | Optional — fallback exists | ☐ |

**Three things that commonly go wrong here:**

- [ ] **Content filters.** Colab and AI Studio are often categorised as "AI tools" or
      "cloud storage" and blocked by a category rule. Please **whitelist explicitly**
      rather than relying on the category.
- [ ] **Personal sign-in.** Lab PCs must allow students to sign in to Google with a
      **personal account** and sign out afterwards. Many college Workspace accounts have
      Colab or AI Studio disabled by the administrator. Either allow personal accounts, or
      have the Workspace admin enable "Colab" and "Google AI Studio" as additional
      services for student accounts.
- [ ] **Bandwidth.** About 1–2 Mbps per active student is enough — web pages and small
      JSON responses, no video and no model downloads. What matters is that the **whole
      class can connect simultaneously**, not raw speed.

## 3 · Hardware

| Item | Minimum | ✔ |
|---|---|---|
| **Lab PC** | Anything that runs a current browser smoothly — 4 GB RAM, 1366×768 or larger, working keyboard and mouse. Age and GPU are irrelevant; no computation happens locally | ☐ |
| **Instructor station** | Projector or large display with HDMI, a seat with power, and the same internet access | ☐ |
| **Room** | Power sockets or extension boards for student laptops; whiteboard; seating that lets pairs work side by side | ☐ |
| **USB ports** | Enabled, **or** phone-to-Drive upload allowed on the college Wi-Fi — students move photos and PDFs from their phones for Sessions 3 and 4 | ☐ |

## 4 · Pre-course check — 15 minutes, one week before

Please run this on **one lab PC**, signed in with a test Google account, and send the
instructor a note of anything that fails.

- [ ] **colab.research.google.com** opens; **New notebook** appears; a new notebook runs
      `print("hello")` when the run button is pressed.
- [ ] **File → Save a copy in Drive** works from that notebook.
- [ ] **aistudio.google.com** loads and shows **Get API key** after sign-in.
      *(Actually creating a key is not needed for this test.)*
- [ ] **intrepidkarthi.com/genai** loads and one session deck opens.
- [ ] *Optional:* **chatgpt.com** loads.

> **Worth knowing before Day 1.** A student who already has any Google Cloud project gets
> no default project in AI Studio, so "Get API key" silently fails for them. It is the
> single most common delay in the first lab hour. If you can, run the check above with a
> plain personal Gmail so the result reflects what most students will see.

## 5 · Explicitly not required

No Python installation · no Anaconda or Jupyter · no VS Code or Copilot · no GPU or
high-RAM machines · no paid subscriptions (ChatGPT Plus, Gemini Advanced, Colab Pro) ·
no administrator rights on the PCs · no credit cards from students or the college.

---

## If something cannot be arranged

Please tell the instructor **in advance**. Every notebook has an offline mode — one line
at the top, `MOCK = True` — so a session can still run if the API is unreachable, at
reduced fidelity. It is far better for students to work with the live tools, but no
session is lost.

Note that `MOCK` covers a **dead provider or an exhausted quota**. It does not cover a
**dead network** — Colab itself needs connectivity. If Colab is unreachable on the day,
the lab becomes a paper walkthrough, which is why the network items in section 2 matter
most of all.

---

**Signed off by:** ________________________  **Date:** ______________

*Any item that fails, please report to the instructor before the course:
Karthikeyan NG · intrepidkarthi@gmail.com*
