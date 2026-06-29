---
title: "Independent quality gates for coding agents: stop letting the agent grade its own homework"
date: 2026-06-29
slug: independent-quality-gates-for-coding-agents
excerpt: "The agent that wrote the code should not be the one that decides it is correct. Same model, same context, same blind spots, now also marking its own homework. The fix is an independent verifier the agent does not control. Here is the gate stack I actually enforce, and why the order matters."
tags: [ai, coding-agents, verification, engineering-leadership, ci]
---

Most teams running coding agents review the agent's work with the agent. You ask it to write the change, then you ask it whether the change is good, and it tells you it is. That is the agent grading its own homework. Same model, same context window, same blind spots that produced the bug in the first place, now also signing off on it. Of course it passes.

The constraint nobody wants to say out loud: a model cannot be its own quality gate. Self-review by the thing that generated the output is not verification, it is a confidence score dressed up as a check. If you want a gate, the gate has to be something the agent does not control.

I have been saying for a while that [generation went to nearly zero and verification became the job](/writing/the-bottleneck-is-me). Independent quality gates are what that sentence looks like in a CI pipeline. Here is the stack I actually enforce, in order, because the order is the whole point.

## Deterministic checks first, as hard blocks

Before any model looks at the change for "quality," the change has to clear the checks that do not have an opinion. Linters. Type checks. The test suite. Build. These are not smart and that is exactly why they are trustworthy. A type error is a type error whether or not the agent feels good about the diff. I also run a layer of cheap structural checks here that agents fail constantly: scaffolding left in, duplicated helpers it could not be bothered to find, hardcoded config and secrets, a function that quietly reimplements one three files over. None of that needs an LLM to catch. All of it should be a hard block, not a suggestion, because a suggestion to an agent is a thing it will route around.

## Independent semantic review, with its own context

Only after the deterministic gates pass does a model get to weigh in on whether the change is actually right. The rule that makes this verification and not theatre: it is a separate process, with its own fresh context, that did not write the code and does not see the author agent's reasoning. It gets the diff and the spec and one job, find what is wrong. A reviewer that inherits the author's context inherits the author's blind spots. A reviewer that starts cold and adversarial finds things. This is the same reason a second pair of human eyes works, ported to agents.

## The gate the agent always skips

There is one gate every agent will quietly drop if you let it: the record. The audit trail, the changelog entry, the "why," the migration note. Agents optimise for the diff that closes the ticket, and the institutional memory of the change is not in the diff. So that becomes a gate too. No record, no merge.

## Why I hold this line harder than most

I ship agent-written code into financial infrastructure. Stablecoin settlement, and before that a [perpetual-futures exchange](/writing/verifiable-delivery). In that context a bad merge is not a bug you fix in the next sprint, it is money that moved wrong, and it does not come back because the agent felt confident. The cost of a missed gate is asymmetric, so the gates are not optional and they are not advisory.

The uncomfortable part is that the better the agents get at generating, the more this matters, not less. Faster generation just means more plausible, more confident, more voluminous output arriving at the one stage that did not get automated, which is deciding whether it is true. The independent verifier is the only thing standing between you and shipped slop, and it cannot be the same model that wrote the slop.

Let the agent write everything. Just never let it be the one that says it is done.
