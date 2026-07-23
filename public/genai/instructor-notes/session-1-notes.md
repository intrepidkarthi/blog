# Session 1 — How Machines Learned to Talk · Instructor Run Sheet

> Deep prep: work through `session-1-prep.md` first — this file is delivery-day only.


**Duration:** 2 hours · **Deck:** `presentations/session-1-how-machines-learned-to-talk.html` (31 slides, ~18 interactive moments)
**Before Day 1:** replace the placeholder link `tinyurl.com/tce-genai` on the lab-kit slide with your real short link (one string in the HTML), and put decks/handouts/notebooks/cheatsheets behind it.
**Format:** weekend bootcamp — Day 1: S1→S2→S3 back-to-back, Day 2: S4→S5→S6. No homework between sessions; the "test set" task happens inside Lab 1, and the only overnight ask is "bring your own documents for Day 2 (RAG)."
**Pre-session (day before):** deck opens offline ✓ · your own Gemini key works ✓ · Colab notebook link shortened and written on board ✓ · 5 spare API keys on paper ✓ · phone hotspot charged ✓ · plan 10–15 min breaks between sessions and keep water/snacks nearby — 6 hours/day is a marathon for attention

---

## Timing map

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:08 | Welcome, who am I, the deal | 1–3 |
| 0:08–0:56 | Core talk (every big idea has a live demo) | 4–25 |
| 0:56–1:48 | **Lab 1** (circulate the whole time) | — |
| 1:48–2:00 | Show & tell, test-set check, teaser | 26–27 |

Running late? Compress slides 19 (kitchens table — one line per row) and 20 (failures — do 2 of 4 cards). **Never cut an interactive on a NEW concept** (slides 5, 9, 10, 11, 23) — those exist for the students with no ML background.

---

## Slide-by-slide

**1 · Title (1 min).** Energy up. "By the end of today, every one of you will have written code that talks to one of the most powerful AI models on Earth. For free."

**2 · Instructor collage (2 min).** You sat in these classrooms 2005–09. Click the TEDx photo to enlarge, name the talk ("Are We Building Better Software?"). Pick ONE photo story — Seoul pitch or TEDx. End with the rule: "If you only listen, you'll forget. So today you build."

**3 · The promise (2 min).** Walk the 6 artifacts fast. Plant the capstone seed: "Session 6, you demo. Start thinking about what you'd build."

**4 · GAME: judges vs creators (4 min).** Class shouts before you click. The gotcha is "keyboard suggesting your next word" — it's generative. Wrong answers are the teaching moments. ~25 s per item, keep it moving.

**5 · RINGS: terminology map (3 min).** NEW-CONCEPT SLIDE. Click from the outside in: AI ⊃ ML ⊃ DL ⊃ GenAI ⊃ LLM, one line each. Then the app≠model card — "ChatGPT is WhatsApp; GPT is the phone network. Today you skip the app and dial the network directly." This slide kills 90% of loose vocabulary for the rest of the course.

**6 · The one idea (2 min).** Say it slowly: one task — predict the next token. Pre-empt: "You'll say 'but it reasons!' — hold that until the scale slider."

**7 · GAME: next-token (4 min).** Class shouts the next word BEFORE reveal. Example 1 (Chennai): certainty. Example 2 (idli + ___): the room disagrees exactly like the distribution. Example 3: creativity = wide distribution. Bridge: "who picks from the options? Dice →"

**8 · SLIDER: temperature (3 min).** T→0.05, sample 5×: always Chennai. T→2: sample until pizza. Rule: facts/code low T, creative high T. Answers "why does my friend get a different answer?"

**9 · DEMO: not a database (3 min).** NEW-CONCEPT SLIDE — kills the #1 misconception. Click "Search every database" → 0 results. Click "Ask the model" → pirate jigarthanda poem types out. Say it plainly: "Nothing is stored. Nothing is looked up. It computed that poem. Which raises the real question — where do the probabilities come from?"

**10 · WIDGET: train it yourself (4 min).** NEW-CONCEPT SLIDE — the foundation. Invite a student to drive the two sliders until "✓ trained" appears. Narrate: "You're doing training: guess → measure error → nudge knobs. w and b are PARAMETERS. A model is a file of learned knob values. You: 2 knobs. Gemini: a trillion. Same idea, automated." Connect back: "The probability bars from the guessing game come out of these knobs."

**11 · QUIZ: training vs inference (3 min).** NEW-CONCEPT SLIDE. Cookbook analogy first (write the book once; cooking doesn't change the book). Then the 3 true/false questions — class shouts, then click. Q3 (free-tier data trains future versions) doubles as the lab privacy warning.

**12 · TOKENIZER (4 min).** Type a student's name, then hit தமிழ் — the ratio jump is the moment. "Same meaning, 3–5× the tokens. You pay per token. Some of you could work on fixing exactly this." Honest note: it's an illustrative tokenizer; real ones are learned (BPE).

**13 · MAP: embeddings (3 min).** idli+dosa → high. idli+GPU → low. Student picks a pair, predicts the score first. Deliver king−man+woman≈queen. "Session 4 turns this map into a search engine over YOUR notes."

**14 · ATTENTION (4 min).** Hover "it" → trophy. Ask: "how did YOU know?" Toggle big→small → suitcase claims it. Let it breathe. "Nobody programmed grammar. That's the T in GPT."

**15 · STEPPER: the whole trick (4 min).** Click Step through loop 1 slowly, narrating each stage. Then Auto-run and watch the answer assemble. "500-word answer ≈ 650 loops."

**16 · SLIDER: scale (2 min).** Drag 10M → 1T+, abilities light up. Pause at 10B: "translation appeared — nobody programmed it." Emergence; researchers still argue why.

**17 · TOGGLE: feral base model (3 min).** "Raw base model" on 2+2 gets the laugh; then "After finishing school." Point: raw pretraining ≠ assistant.

**18 · Finishing school (2 min).** Three steps, one line each. "ChatGPT's 2022 breakthrough was better finishing school, not a smarter brain."

**19 · Kitchens + landscape (2 min).** Biryani line, then two points only: closed vs open weights (Ollama in S5), and "names change monthly, mechanics don't." Don't read the table.

**20 · REVEAL CARDS: failures (4 min).** Class explains WHY before each click: strawberry→tokens, math→prediction≠calculation, news→cutoff, fake citation→plausible≠true. "None of these are bugs — and each has an engineering fix in this course."

**21 · DEMO: context window (3 min).** Fill with chat + notes (green), then textbook → red overflow. Then the twist, said slowly: "The model remembers NOTHING between turns. The app re-sends the whole conversation every time. Chat memory is an illusion." That felt limit is the RAG motivation.

**22 · RECALL: eight words (3 min).** Cards hidden; class says each definition aloud, then reveal. Now includes Parameter and Inference. "Explain these eight to your roommate tonight."

**23 · ROUND TRIP: API anatomy (3 min).** Press Send, watch the dot: code → key check → GPUs → response. Three takeaways are on the cards: key = password, 429 = slow down, latency = the token loop running. "The model does not run on your laptop." Directly de-mystifies the next 50 minutes.

**24 · Lab kit & rhythm (2 min).** Shown ONCE this weekend — the rules carry through all 6 labs. Point at the A→E strip: "checkpoints are for you, not for marks — they're how I know nobody's silently stuck." Make everyone bookmark the link before moving on. Highlight Part E: "the last 10 minutes are part of the lab, not optional."

**25 · Lab brief (2 min).** Walk the 5 steps. Board: short-link + aistudio.google.com. Then release them.

---

## Lab hour — your job (0:56–1:48)

- First 15 min = key-setup triage. College Gmail blocked → personal Gmail. Verification loop → paper spare key, create own at home.
- Circulate asking "what did it get WRONG?" — trains the S2 evaluation mindset.
- **Checkpoint sweep at 1:30:** every pair shows a printed Gemini response + one model difference. Paper roster.
- Fast pairs → stretch goals (temperature, Tamil stress test, token counting, break-it).
- Rate limits: ~10 req/min per key; the notebook's `ask()` retries on 429. One student in a tight loop is the usual culprit.
- **Last 10 minutes (1:38): call Part E out loud** — everyone writes their 10-question test set NOW. It's the fuel for Session 2's lab, which starts within the hour. Don't let them skip it.

## Show & tell (1:48–2:00)

2–3 pairs with interesting model differences: "Which would you ship, and why?" No right answer — that's the point. Confirm every pair has their 10-question file (slide 26). If this is the end of Day 1's first session, also remind: bring 2–3 real documents (notes/PDFs) for tomorrow's RAG build. Close: "You've learned the trick. Take ten minutes — then you learn to drive it, and to catch it lying."

---

## Anticipated questions (with answers)

**"Is it actually thinking?"** — It does something that produces thinking-like results via next-token prediction at scale. Whether that counts as thinking is genuinely debated. Engineers focus on what it computes: capability and failure modes.

**"So it's just a fancy database?"** — No — slide 9 is the proof. Nothing is stored or retrieved; a trillion learned knobs compute each token fresh. That's also exactly why it can be confidently wrong: it generates plausible text, it doesn't quote verified records.

**"Does it learn from our conversation?"** — Not while you chat (knobs are frozen at inference). Your free-tier text may be collected to train future versions offline — which is why we never paste private data.

**"If it has no memory, how does ChatGPT remember my name from yesterday?"** — The app stores your chats in a normal database and re-sends relevant bits into the context window. Memory is a product feature bolted on beside the model — not the model learning.

**"Will AI take our jobs?"** — It's already changing entry-level work; pretending otherwise is dishonest. People who can BUILD with AI are on the right side of the shift — that's why this course is hands-on.

**"How is it different from Google search?"** — Search retrieves documents that exist. GenAI generates new text. Search can't write your essay; a raw LLM can't tell you today's news. Session 4 combines both — RAG.

**"Why does it hallucinate?"** — Trained for plausible, not verified-true. "Sounds right" and "is right" usually overlap — until they don't. Session 2 builds the lie detector.

**"Can I run one on my laptop?"** — Yes, open-weight models via Ollama — live in Session 5.

**"Is the API really free? Catch?"** — Free tier with rate limits (~10/min, a few hundred/day; exact daily cap varies). The catch: free-tier data may be used to improve products. Don't paste anything private.

**"Tamil costs more tokens — why?"** — Tokenizers are learned from English-heavy data, so Tamil splits into smaller chunks. Newer multilingual tokenizers are closing the gap.

## Fallbacks

- **No projector:** deck is one HTML file on a USB stick — present from any machine.
- **No internet:** deck is fully offline. Lab becomes instructor-driven demo over your hotspot; students run the notebook at home and submit the checkpoint async.
- **AI Studio blocked campus-wide:** switch lab to free web UIs for the comparison; API portion becomes homework.
