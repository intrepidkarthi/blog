---
title: "Spec-driven development is the verification bottleneck with a name"
date: 2026-07-01
slug: spec-driven-development-verification-bottleneck
excerpt: "Spec-driven development is being sold as a new methodology for the agent era: write a precise spec, let the agent build to it. It is a good idea. It is also not new. It is the thing I have been arguing for years, that generation got cheap and verification became the work, finally given a name and a workflow. The spec is not documentation. It is the oracle."
tags: [ai, spec-driven-development, verification, coding-agents, engineering-leadership]
---

Spec-driven development is having its moment. The pitch, across GitHub's spec-kit, AWS's Kiro, and a dozen frameworks behind them, is the same: stop prompting the agent for code and start writing a precise, testable specification first, then let the agent build to it and check itself against it. It is being presented as a new methodology for the agent era.

It is a good idea. It is also not a new one. It is the thing I have been writing about for years, that [generation got cheap and verification became the work](/writing/the-bottleneck-is-me), finally given a name and a workflow. Strip the branding off spec-driven development and what is left is a single claim: when the agent can out-type you, the specification is the only thing that still scales. That claim is correct, and it is worth understanding why, because the methodology is downstream of the reason.

## Why the spec, and not the code

When you wrote the code yourself, the spec could stay in your head, because your head was also the thing producing the code and the two could not drift apart. An agent breaks that. It produces code at a volume you cannot read line by line, so the only way to know whether the output is right is to have written down, in advance and precisely, what right means. The spec is that written-down definition. It is not documentation you produce after the fact to be tidy. It is the oracle the output gets checked against, and in an agent workflow it is the highest-leverage artifact in the whole loop, because it is the one thing a human still authors and everything else is measured by.

This is the same argument I made about [independent quality gates](/writing/independent-quality-gates-for-coding-agents) and [verifiable delivery](/writing/verifiable-delivery), from a different door. A gate needs something to gate against. A spec is that something, made explicit enough that a machine can enforce it.

## What a good spec actually gates

The useful spec is not a wish list. It is the set of acceptance criteria a change has to meet, written so a test can encode them and a reviewer can check them without reading the implementation. The behaviour under the normal path, the behaviour under the edge that everyone forgets, the invariants that must hold, the states that must never occur. When that exists, the agent has a target and you have a gate, and the review shifts from reading code you did not write to confirming the spec was met. That shift is the entire value.

I build settlement infrastructure, and there the spec is not a nicety. An under-specified edge case is not a bug you patch next sprint. It is money that moved in a way nobody defined and nobody caught, because there was no written statement of what should have happened for the deviation to be measured against. In that world you learn quickly that the spec is the safety system, and the code is just an attempt to satisfy it.

## The limit, so I am not overselling it

A spec cannot catch what it did not anticipate. It gates the failure modes you thought of, which means the residual risk is exactly the failures you did not think of, and no methodology removes that. Spec-driven development moves your effort to the highest-value place, defining correctness, but it does not make the hard part easy. It makes it explicit, which is different and better, but it is still the hard part. Anyone selling it as a way to stop thinking about correctness has inverted the entire point.

So take the trend seriously, and take it for what it is. Spec-driven development is not a new idea about how to write software. It is the old constraint, that deciding whether the output is true is the expensive step, finally getting the tooling it always deserved. Write the spec first because the spec is the part that was always going to matter. The agent typing the code was never the bottleneck. The definition of done was, and now it has a name.
