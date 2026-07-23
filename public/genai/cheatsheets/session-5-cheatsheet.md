# Session 5 Cheatsheet — Making AI Do Things

## The trick (say it twice)
**The model never executes anything. It writes a structured request; YOUR code executes; the result re-enters the context.** Still next-token prediction — and control stays with you (you pick the tools, validate args, refuse calls).

## Tool use in code

```python
def calculator(expression: str) -> float:
    """Evaluate a math expression exactly. Use for ANY arithmetic;
    never compute numbers yourself."""          # docstring = instruction to the model
    if not set(expression) <= set("0123456789+-*/(). "):
        raise ValueError("unsafe")               # validate BEFORE running
    return eval(expression)

config = types.GenerateContentConfig(tools=[calculator])   # hand over the menu
```

The model reads only **name + docstring + type hints** — vague docstring = wrong tool, bad args. The agent loop: `while it_wants_a_tool: run it (your code), feed result back`.
**MCP (Model Context Protocol)** = USB-C for tools: one standard plug, so N models + M tools instead of N×M custom adapters.

## Five failure modes → fixes
Wrong tool (sharpen docstrings, "answer directly if no tool needed") · bad args (validate inside the tool, return readable errors) · infinite loop (hard cap ~5 calls) · imaginary tools (execute allow-list only) · **poisoned tool results** (treat as untrusted input — Session 6).

## The honest lesson
**Most problems need a workflow, not an agent.** Workflow = YOU fix the steps in code; model fills the hard parts (predictable, testable). Agent = the MODEL picks steps (flexible, fragile). Because reliability compounds:

**0.95¹⁰ ≈ 60% · 0.95²⁰ ≈ 36%** — every added autonomous step multiplies failure. Fewer steps, checkpoints, human gates on anything that writes/spends/sends.
**Multi-agent** = compounding hand-offs (same math — agents chaining agents multiply failure). The exception that works: **parallel fan-out + one judge** — independent workers don't compound.

## The escalation ladder (cheapest first)
**Prompt → Few-shot → RAG → Tools → Fine-tune.** Climb only when your **eval** proves the current rung failed. Interview line: **"Fine-tuning teaches behaviour; RAG provides knowledge."** Fine-tune is the last resort, never the first, and never for facts.

## API vs local (a trade, not a religion)
Local/open weights (Ollama: `ollama run gemma4:e4b`) win on **privacy** (data never leaves), **cost at scale** (hardware once), **offline/edge**. Frontier APIs win on raw capability and zero-ops upgrades. Real systems: **hybrid** — API for the hard 10%, small/local for the routine 90%.

**Capstone:** RAG (knowledge) + tools (hands) + evals (judge) = your app. Save the notebook — the finale attacks it, you harden it, you demo.
