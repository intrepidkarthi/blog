# Session 2 Cheatsheet — Talking to AI, and Catching Its Lies

## The prompt template (steal this)

```
# ROLE        You are a <specific persona with a stake in quality>.
# TASK        <one job, precisely: verb + object + length>
# CONTEXT     <the facts it needs — it remembers nothing>
# FORMAT      Reply ONLY with <JSON schema / bullet cap / word cap>.
# EXAMPLES    <2–5 input→output pairs; they pin format + edge cases>
# CONSTRAINTS If a fact isn't stated above, don't invent it.
              If unsure, say "I am not sure."
```

Task is mandatory; the rest are dials. One prompt = one job (chain calls for multi-step work).

## The three power moves
1. **Few-shot:** show 2–5 examples instead of describing the format. The model imitates patterns — in-context only, no learning.
2. **Step-by-step:** "Solve step by step, then give the final answer." Visible, auditable working — errors surface.
3. **Grounding:** "Answer only from the facts above." The single line that suppresses invented awards, policies, citations.

## Hallucination in one line
Trained for *plausible*, not *true* — so lies arrive fluent, confident, and welded to real facts. Tone tells you nothing. **Only checking detects it.** (Real stakes: a US lawyer was sanctioned over 6 invented citations; Air Canada was held liable for a policy its chatbot made up.)

## The eval harness (the artifact that makes you an engineer)

```python
def norm(s): return re.sub(r"[^a-z0-9 ]", "", s.lower())

def run_eval(template, tests):
    hits = 0
    for t in tests:
        ans = ask(template.format(q=t["q"]), temperature=0.0)
        hits += norm(t["expected"]) in norm(ans)
    return hits / len(tests)
```

Rules: `expected` = the key fact only · temperature 0 · run 3×, report average + spread · **read every ✗** (model wrong? scorer too strict? question ambiguous?) · change one thing per iteration · a test the model always passes teaches nothing.

## Scorer trade-offs
| Scorer | Good | Trap |
|---|---|---|
| Exact match | unambiguous | fails correct answers over punctuation |
| Normalized contains | robust, simple | generic expected strings false-positive |
| LLM-as-judge | handles paraphrase | verbosity/position/self bias — audit it |

## The loop (memorize)
**Write → eval → read failures → fix ONE thing → re-run.** "It worked when I tried it" is not evidence — the demo is the best case, the eval is the expected case.

**Carry forward:** this harness grades your capstone (S6). Next session: photos on your phone.
