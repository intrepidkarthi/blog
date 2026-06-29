---
title: "LLM non-determinism in production: temperature zero still lies"
date: 2026-01-22
slug: llm-non-determinism-production-reliability
excerpt: "Set temperature to zero and the model is supposed to be deterministic. Same input, same output, every time. It is not, and the reason is not the sampler. It is the hardware. If your production system assumes a fixed prompt gives a fixed answer, you have built on a foundation that moves, and the place it tends to move is the place that costs you money."
tags: [ai, llm, reliability, engineering, infrastructure]
---

Set temperature to zero and the model is supposed to be deterministic. Greedy decoding, same input, same output, every time. Most engineers believe this, build on it, and are quietly wrong. The same prompt at temperature zero can return different completions across runs, and the reason has nothing to do with the sampler you turned off. It is the hardware underneath.

The cause is mundane and structural, which is why it does not go away. Floating-point arithmetic on a GPU is not associative: add the same numbers in a different order and you get a slightly different result. The order depends on how work is scheduled across the chip, which depends on batch size, on which other requests are running alongside yours, on kernel selection. So your "deterministic" request is sharing a GPU with traffic you do not control, and the numerical path it takes shifts with that traffic. The work out of Thinking Machines last year on batch-invariant kernels showed this clearly: the non-determinism is in how inference is executed, not in the model, and you have to engineer it out deliberately. Most production stacks have not.

For a chatbot, this is invisible. A word changes, nobody notices. The problem starts when the model's output feeds a decision, and the decision moves money.

## Where the drift actually hurts

I build settlement infrastructure and a Bitcoin forecasting terminal. The places non-determinism bites are the places where an output is load-bearing. A model that classifies a transaction, extracts a number from a document, decides whether something is anomalous, routes a payment. Run it twice on the same input and get two answers, and you no longer have a system, you have a coin flip with good manners. The danger is not that it is wrong. It is that it is inconsistent, and inconsistency is far harder to catch in testing, because the test passed the three times you ran it and fails the fourth time in production.

## Stop treating the model as a pure function

The fix is not to chase perfect determinism, though batch-invariant inference helps where you control the stack. The fix is to stop designing as if the model is a pure function that returns the same answer for the same input. It is not. Treat its output the way you treat any unreliable input: validate it.

Constrain the output to a schema so a drifted answer is at least a well-formed one. Put a deterministic check after the model, so a number it extracted is range-checked, a category it picked is one of the allowed set, an amount it computed is reconciled against a source of truth. Make the surrounding operation idempotent, so the same event processed twice does not move money twice regardless of what the model said. Where a decision is irreversible, do not let a single model call be the only thing standing behind it.

## This is the same lesson, one layer down

I have argued that [generation got cheap and verification became the bottleneck](/writing/the-gauge-broke). Non-determinism is that lesson at the level of a single call. You cannot trust the output because it generated cleanly. You trust it because something downstream checked it. The model is a generator. It is fast, it is useful, and it does not promise you the same answer twice. The reliability has to live in what you build around it.

Temperature zero does not make the model honest. It makes it confident. Those are not the same thing, and in a system where a wrong token moves money, the difference is the whole job.
