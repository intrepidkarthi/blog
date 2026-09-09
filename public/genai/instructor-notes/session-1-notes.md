# Session 1 — Run Sheet

### How Machines Learned to Talk · 29 slides · 1:56 total (≈4 min reserve)

**Delivery-day document.** The concepts are in `session-1-prep.md`; this is the clock. 
Highest-stakes session of the six: it sets whether the room believes you. Beats 8–9 and 15 are the ones that must not be rushed. Embeddings and attention no longer have slides of their own — they are on the pre-class page and behind **D** on slide 15.

Generated from the deck, so the timings are the deck's own budgets. Press **S** in the deck for presenter mode — it shows the same numbers with a live timer.

---

## Timing map

| At | # | Slide | Budget | |
|---|---|---|---|---|
| 0:00 | 1 | How machines learned to talk | 1 min |  |
| 0:01 | 2 | I sat in these seats — TCE CSE, class of 2009. | 1 min | `trim` |
| 0:02 | 3 | 12 hours. 6 things you'll build. | 1.5 min |  |
| 0:04 | 4 | Two kinds of AI: judges vs creators | 3 min | `trim` |
| 0:06 | 5 | AI, ML, GenAI, LLM — who lives inside whom | 2.5 min |  |
| 0:09 | 6 | ChatGPT is autocomplete at scale. That one idea goes surprisingly far. | 1.5 min |  |
| 0:10 | 7 | Play the model: guess the next word | 3.5 min |  |
| 0:14 | 8 | Those odds aren’t magic — you just count words. | 2.5 min | `trim` |
| 0:16 | 9 | Watch the network think | 3 min |  |
| 0:20 | 10 | Why the same question gives different answers | 3 min | `D` |
| 0:22 | 11 | Wait — is it just searching a giant database? | 2.5 min |  |
| 0:25 | 12 | What's inside a model? Just knobs. | 3 min | `D` |
| 0:28 | 13 | Training vs using: the cookbook rule | 2.5 min |  |
| 0:30 | 14 | Models don't read words. They read tokens. | 2.5 min |  |
| 0:33 | 15 | You saw this machine on the pre-class page — here it is in one loop | 3 min | `D` |
| 0:36 | 16 | If autocomplete can pass your exam, your exam was never testing understanding. | 1.5 min | `trim` |
| 0:38 | 17 | The loop is old. The scale is new. | 2 min | `trim` `D` |
| 0:40 | 18 | A freshly trained model won’t answer you. It just keeps writing. | 2.5 min |  |
| 0:42 | 19 | Finishing school, in three steps | 2 min |  |
| 0:44 | 20 | Reasoning models: think longer, not just train bigger | 2 min | `trim` |
| 0:46 | 21 | Why ChatGPT ≠ Gemini ≠ Claude | 1.5 min | `trim` `D` |
| 0:48 | 22 | Famous failures — you explain them | 2.5 min |  |
| 0:50 | 23 | The context window: its entire working memory | 2 min | `D` |
| 0:52 | 24 | Eight words you own now | 2 min |  |
| 0:54 | 25 | What actually happens when you call an API | 2.5 min |  |
| 0:56 | 26 | Your lab kit, and the rhythm | 2 min |  |
| 0:58 | 27 | Lab 1: your first AI API call | 50 min |  |
| 1:48 | 28 | Three things before the next session | 5 min | `trim` |
| 1:54 | 29 | You've learned the trick. Next: you learn to drive it. | 2 min | `trim` |
| 1:56 | | *end* | | |

**`trim`** = the deck flags this slide **compressible** (press **S** and you will see `▸ compressible` on it) — these are the first things to shorten when you are behind, not beats you must land. **`D`** = a `<|deeper|>` panel lives on this slide; press **D** to open it.

---

## Slide beats

One line per slide — what you actually do. Fuller reasoning is in the prep pack.

**0:00 · 1 · How machines learned to talk** — Open with energy. “By the end of today, everyone here writes code that talks to a frontier AI model — for free.”

**0:01 · 2 · I sat in these seats — TCE CSE, class of 2009.** — Under 45 seconds. One line of credibility, one line of humility. The failed-things line gets the laugh — let it land, then move on. The work sells you better than the bio.

**0:02 · 3 · 12 hours. 6 things you'll build.** — Walk the 6 artifacts fast. Plant the capstone seed: “Session 6 you demo — start thinking what you’d build.”

**0:04 · 4 · Two kinds of AI: judges vs creators** — GAME. Class shouts judges/creates before each click. Gotcha = keyboard autocomplete (generative). ~25s/item.

**0:06 · 5 · AI, ML, GenAI, LLM — who lives inside whom** — Click rings outside-in AI→LLM. Land app ≠ model: ChatGPT is WhatsApp, GPT is the network.

**0:09 · 6 · ChatGPT is autocomplete at scale. That one idea goes surprisingly far.** — THE slide. Say slowly: one job — predict the next token, repeat. Pre-empt “but it reasons!” → hold for scale.

**0:10 · 7 · Play the model: guess the next word** — GAME. Class shouts the next word BEFORE reveal. Ex2 (idli+__) room disagrees = spread distribution. Finale: Thiagarajar College of ___ → 97% — the room is sitting inside a distribution. Bridge: who picks? dice.

**0:14 · 8 · Those odds aren’t magic — you just count words.** — THE demystifier. Click Build the table — narrate: training is just tallying which word follows which. Then Sample from <|start|>: room shouts a word, you roll. Hit Take the top to contrast greedy vs sampling. Land it: the SAME three steps as Claude — only step 2 and training differ. It stops when it samples <|end|> — that is the EOS token. Compress by skipping the greedy toggle.

**0:16 · 9 · Watch the network think** — THE money slide. Play it once in silence — let the room watch. Then Reset and Step through, narrating: tokens→numbers, layers mix, distribution, dice, APPEND. Land the punch: it never plans a sentence. It only ever picks one next token — 650 times for a 500-word answer.

**0:20 · 10 · Why the same question gives different answers** — SLIDER. T→0.05, Roll 10× (Chennai ×10). T→2, Roll 10× until pizza shows in the tally. Rule: facts low, creative high. Answers “why different answers?” [D] deeper: logits → softmax → temperature divides the logits, so T=0 is argmax; plus top-k / top-p. Open it if anyone asks “but where does the probability come from?”

**0:22 · 11 · Wait — is it just searching a giant database?** — Kills #1 myth. Search → 0 results; Ask model → pirate jigarthanda poem. “Nothing stored. It computed that.”

**0:25 · 12 · What's inside a model? Just knobs.** — WIDGET. Invite a student to drag both sliders to ‘trained’. Narrate: w,b are PARAMETERS; a model = a file of knob values. [D] deeper: cross-entropy loss + perplexity — the one number a lab watches for months. Good answer to “how do they know it’s working?”

**0:28 · 13 · Training vs using: the cookbook rule** — Cookbook analogy: write once, cooking doesn’t change the book. Q3 (free-tier trains future) = the privacy warning.

**0:30 · 14 · Models don't read words. They read tokens.** — Type a student name, then தமிழ். The ratio jump is the moment — and the ₹ meter turns it into money: same meaning, bigger bill. Honest: illustrative tokenizer; lab shows real counts.

**0:33 · 15 · You saw this machine on the pre-class page — here it is in one loop** — STEPPER — the hardest 3 min. Ask “who did the pre-class page?” — then Step slowly, narrating each stage: tokens → coordinates → attention → scores → dice → APPEND. Auto-run ends on the stat flash; let it land. ‘500-word answer ≈ 650 loops.’ Embeddings and attention are NOT taught on their own slides any more — they live on the page and come back in Session 4. [D] deeper: the two-paragraph version (idli/dosa, king−man+woman, what “it” points to, the T in GPT, positional encoding, n²). Open it only if someone asks “wait, what is attention?”

**0:36 · 16 · If autocomplete can pass your exam, your exam was never testing understanding.** — Pick the fight deliberately. Read it once, slowly, then be quiet for 3 seconds. Say it looking at the faculty row — and smile. Invite disagreement — take one counter-argument now, park the rest for the break.

**0:38 · 17 · The loop is old. The scale is new.** — Drag 10M→1T. Pause at 10B: ‘translation appeared — nobody programmed it.’ Emergence; researchers argue how sudden it is. [D] deeper: scaling laws + the Chinchilla correction (params and data together), and the data wall. Pairs with slide 20 on test-time compute.

**0:40 · 18 · A freshly trained model won’t answer you. It just keeps writing.** — Click Raw base on 2+2 (laugh), then After finishing school. Point: raw pretraining ≠ assistant.

**0:42 · 19 · Finishing school, in three steps** — Three steps, one line each. Land: ‘ChatGPT’s 2022 win was better finishing school, not a smarter brain.’

**0:44 · 20 · Reasoning models: think longer, not just train bigger** — Dial metaphor. 1 scale, 2 finishing school, 3 thinking time. Land the cost rule: never pay thinking prices for capital-city questions. Pre-empts 'is o-series different magic?' — no, more tokens.

**0:46 · 21 · Why ChatGPT ≠ Gemini ≠ Claude** — Biryani line. Two points only: closed vs open weights, and ‘names change, mechanics don’t.’ Don’t read table. [D] deeper: MoE, distillation, quantization — why Flash-class models exist and why parameter count stopped predicting cost. Sets up the S6 routing decision.

**0:48 · 22 · Famous failures — you explain them** — REVEAL CARDS. Class explains WHY before each click: strawberry→tokens, math→predict, news→cutoff, citation→plausible.

**0:50 · 23 · The context window: its entire working memory** — Fill window with chat+notes (green), then textbook → red overflow. Then 1M: textbook fits — ‘the wall moves; the physics doesn’t.’ Twist: no memory — app re-sends everything. Motivates RAG. [D] deeper: the KV cache: prefill vs decode, TTFT vs tokens/sec, and why context caching is ~90% off. This is the mechanism behind three later cost claims — worth opening if time allows.

**0:52 · 24 · Eight words you own now** — ACTIVE RECALL. Class says each definition aloud, THEN click. Now includes Parameter + Inference.

**0:54 · 25 · What actually happens when you call an API** — Press Send. Dot travels code→key→GPUs→response. ‘The model does NOT run on your laptop.’ De-mystifies the lab.

**0:56 · 26 · Your lab kit, and the rhythm** — Shown ONCE, applies to all 6 labs. Point at A→E strip. Point at intrepidkarthi.com/genai — everyone bookmarks it now, phones out. Pairs rule: both have a key · one drives per part · swap at each checkpoint. Read the Lab 3 line aloud: put a receipt + a handwriting page in Drive now. ‘Checkpoints are for you, not marks.’

**0:58 · 27 · Lab 1: your first AI API call** — 2 min brief, then 50 MIN LAB. 5 steps on board + aistudio.google.com. Pairs: both have a key, one drives per part, swap at checkpoints; 5-min rule. Circulate; checkpoint sweep at +40. Links are on screen — point at them.

**1:48 · 28 · Three things before the next session** — After lab · 5 min incl. show & tell. Show & tell first (~3): 2–3 pairs’ model differences from Part D. Then the three cards: the 10-question test set is written in the last 10 min of lab (Part E) — confirm every pair has it, it feeds Session 2; the lie-detector teaser; the next-session hand-off.

**1:54 · 29 · You've learned the trick. Next: you learn to drive it.** — Close (2 min). ‘Learned the trick; next you drive it.’ Name the strongest hot-take counter-argument from the room, with credit. Remind: bring your own documents (PDF/notes) for Day 2, and the two photos for Lab 3. Links are on screen — point at them.

---

## The lab hour

Slide 27, 50 minutes. Two-minute brief, then hands off. Pairs rule, said once at the brief: both partners have a key, one drives per part, swap at each checkpoint.

Your four moves, the same every lab: **circulate** (never sit), **ask before answering** ("what did you expect?"), **checkpoint sweep** at +40 minutes, **collect two artifacts** for show and tell.

The five-minute rule: stuck for five minutes, ask a neighbour before asking you. Say it at the brief.

---

## Close

Slides 28–29, 7 minutes. Show and tell first (~3 min, two or three pairs' model differences from Part D), then confirm every pair wrote the 10-question test set (lab Part E) — Session 2 consumes it. Name the room's best counter-argument to slide 16, then the hand-off. No homework: Session 2 starts after a short stretch.

---

## Fallbacks

- **API down or rate-limited** — switch to the fallback model named in `fact-check.md`; if the whole provider is down, the deck's widgets run offline and the lab becomes a paper walkthrough.

- **No internet** — every deck is offline-capable. Open the deck, run the widgets, and compress the lab to Parts A–C; run the remaining parts as the opening of the next block.

- **Projector washes out the dot-grid** — press **F** for fullscreen; if it is still bad, the decks are legible at 100% browser zoom on a laptop passed around.

- **Running long** — the prep pack's timing pressure map lists what to cut, in order. Cut from the top of that list, never from a checkpoint.
