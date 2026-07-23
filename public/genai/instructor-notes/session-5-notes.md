# Session 5 — Making AI Do Things · Run Sheet

> Deep prep: work through `session-5-prep.md` first — this file is delivery-day only.

> Prep with `session-5-prep.md`. **Deck:** `session-5-making-ai-do-things.html` (23 slides, 9 interactives). Post-lunch Day 2 — the "when to use what" session students remember at interviews.

## Timing

| Clock | Segment | Slides |
|---|---|---|
| 0:00–0:06 | Recap + brain-in-a-jar | 1–3 |
| 0:06–0:34 | Tools: the trick (4) → stepper (5) → declarations (6) → which-tool (7) → agent loop (8) → failures (9) | 4–9 |
| 0:34–0:52 | Choosing: honest lesson (10) → reliability (11) → decision (12) → ladder (13) → picker (14) → open/local (15–17) | 10–17 |
| 0:52–0:58 | Recap + lab brief | 18–19 |
| 0:58–1:48 | **Lab 5** | — |
| 1:48–2:00 | Show & tell + finale teaser | 20 |

**Prep the Ollama demo (slide 16):** pre-pull a small model (`ollama pull gemma4:e4b`; `gemma3:4b` remains a fine fallback on older laptops) BEFORE the session — do not rely on venue Wi-Fi. Practice `ollama run gemma4:e4b` with Wi-Fi OFF so the "no internet" beat is real.

## Slide beats

**4 · The trick (3 min).** The load-bearing idea: model writes requests, your code executes. Read the second paragraph slowly — "control stays with you" is the thread to Session 6.

**5 · Tool stepper (4 min).** Step through. Stage 3 (validation, "args parse as math not DROP TABLE") plants the security seed. Stage 5: exact answer "because it never did the math — it delegated."

**6 · Declarations.** "Docstrings just became prompts." The vague-docstring→wrong-tool link is the lab's Stretch 2.

**7 · Which tool (4 min).** Vote each. Item 4 (no tool!) is the maturity lesson — over-tooling is a failure mode. Item 5 (chain) sets up the agent loop.

**8 · Agent loop (3 min).** Run the log. "The model chose the order — nobody scripted it. Impressive, and exactly where danger lives."

**9 · Five failures.** Flip four; the fifth (poisoned tool results) is the red hi card — deliberate Session 6 bridge. "Tool results are untrusted input."

**10 · Honest lesson.** THE takeaway of the session. Say the workflow/agent distinction slowly.

**11 · Reliability curve (4 min, centerpiece).** Drag to 95%, land on 10 steps ≈ 60%. "This one slide explains most failed agent demos." Drag to 99% — still only 82% at 20 steps. Compounding is merciless.

**13 · Ladder (3 min).** Click each rung. The meta-point: escalate only when your EVAL says the cheap rung failed. Fine-tuning is rung 5, not rung 1.

**14 · Picker (4 min).** The exam-as-game. Item 5 (capital of France → rung ZERO) catches over-engineers. Make them defend votes aloud.

**16 · Ollama (3 min).** Wi-Fi OFF. Run it live. "4 billion knobs, on this laptop, no meter." Tell them 8GB RAM runs it at home.

## Lab hour

- `eval()` in the calculator: the notebook validates the charset first — point out WHY (never eval raw model output). Good security habit before Session 6.
- Automatic function calling "just works" and can feel like magic — Part C (manual, see the raw call) de-mystifies it; make sure pairs do it.
- Stretch (RAG-as-tool) is the capstone accelerator — nudge strong pairs there; it literally assembles their capstone.
- Scenario cards: circulate and argue. There are defensible edge cases — reward reasoning, not the "right" letter.
- Checkpoint 3 is verbal — hear at least one defense per pair.

## Show & tell

Best "it called both tools" moment + one great scenario-card defense. Then: "Knows, sees, acts. Final session: we try to break all of it." Remind: bring the notebook — it's the target.

## Anticipated questions

**"Isn't everyone building agents now? You sound skeptical."** — Not skeptical of agents — skeptical of agents where a workflow wins. The p^n math is why. Use agents for genuinely open-ended paths; wrap them in leashes. The best teams ship mostly workflows and call them agents in the pitch deck.

**"MCP / tool standards?"** — Model Context Protocol standardizes how models connect to tools/data — worth knowing the name; it's the plumbing under "give the model tools" at ecosystem scale. Same core idea as today, standardized.

**"How does it actually decide to call a tool?"** — Trained (instruction-tuning + tool-use data) to emit a structured call token-sequence when the description matches the need. Still next-token prediction — the "call" is just a special formatted output your SDK intercepts.

**"Can two tools run at once?"** — Yes, models can emit parallel calls; frameworks execute concurrently. Adds speed and coordination complexity.

**"Is fine-tuning ever right for a student project?"** — Rarely, and almost never for facts. If a capstone *needs* a rigid format at volume, few-shot usually gets there first. Reach for fine-tune only when an eval proves prompting can't hold it.

**"Will local models catch the frontier?"** — For narrow tasks, effectively already. For frontier reasoning, a gap persists but shrinks every release. The pragmatic answer is the hybrid on slide 17.
