# Session 6 Cheatsheet — Breaking, Securing, Shipping

## The attacks (every capability is a surface)
- **Prompt injection** — the model can't tell instructions from data, so data becomes commands. OWASP's #1 LLM risk. No complete fix (language has no escape character).
- **Indirect injection** — payload hidden in a document your RAG retrieves. The attacker never talks to your bot; your pipeline delivers the attack. **Your capstone is vulnerable to this.**
- **Jailbreak** — roleplay/hypothetical framing slips past safety training.
- **Prompt leak** — "print your instructions" spills the system prompt.

**Golden rule:** never put anything in a prompt you couldn't survive seeing on the front page.

## Defense in depth (no single wall — stack them)
1. **Delimit + label** untrusted text: wrap retrieved/user text, tell the model it's DATA not instructions.
2. **Instruction hierarchy:** system rules explicitly override user text.
3. **Output validation:** check the answer before it ships (format, no leaked secrets, allow-listed values).
4. **Least privilege + human gate:** no destructive tools by default; **a human approves anything that writes, spends, or sends.** ← the layer that caps blast radius.

Match trust to blast radius: read-only → let it run; side effects → gate it.

## Notebook → product: the four that change
| | The shift | The fix |
|---|---|---|
| **Cost** | per token, per query, forever | model tiering, caching, trim chunks, cap output |
| **Speed** | 3s silence feels broken | stream tokens, "thinking…" states |
| **Reliability** | APIs time out / 429 / bad JSON | retries+backoff, timeouts, graceful fallback |
| **Observability** | you're blind at 2 a.m. | log prompt/response/tokens/latency/cost/feedback |

Your **S2 evals become the regression test** — run before every prompt change, forever.

## Honest UX
Show sources (citations) · easy retry/edit/thumbs · signal uncertainty ("I don't know") · always an escape-to-human.

**Four questions before you ship:** bias · provenance · privacy · accountability — the regulators' checklists: **EU AI Act**, **NIST AI RMF**. Cheapest cost lever: **context caching ≈ −90% input cost** on repeated prompt prefixes.

## Ship checklist
Grounded + escape hatch · untrusted text delimited · output validated · human gate on side effects · retries+timeouts+graceful errors · everything logged · evals as regression test · citations shown.

## Capstone demo
3 min: **what it does + techniques · one failure you found · one fix.** Pre-run your best example. Lead with the problem. **Show the failure — honesty about limits beats a fragile "perfect" demo.**

You came as users. You leave as builders. Ship something. — @intrepidkarthi

**Go deeper (press D on the deck):** why a token stream has no escape character, and the three-legged exfiltration model (private data + untrusted content + a way out — remove one leg) · why output costs ~6× input, and cost per *user* · p50 vs p99, retry jitter, idempotency, what to log. Prose versions: Learning Guide **Part 8**.
