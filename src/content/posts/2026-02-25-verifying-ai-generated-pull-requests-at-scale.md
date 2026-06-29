---
title: "Verifying AI-generated pull requests at scale: we stopped reading the diff"
date: 2026-02-25
slug: verifying-ai-generated-pull-requests-at-scale
excerpt: "When agents open pull requests faster than any human can read them, reading every diff stops being a strategy. It is a queue that grows without bound. Verifying AI-generated PRs at scale is a different job from reviewing them, and the teams that do not make that switch are quietly approving code nobody understood."
tags: [ai, code-review, verification, engineering-leadership, coding-agents]
---

The old model of code review assumed a human could read everything that shipped. One author, one reviewer, a diff small enough to hold in your head. That assumption is gone. When agents open pull requests faster than any human can read them, "read every line" stops being diligence and becomes a queue that grows without bound. You either fall behind or you start rubber-stamping, and most teams are quietly doing the second while telling themselves they are doing the first.

So the question is not how to review AI-generated PRs faster. It is what replaces reading the diff as the thing that gives you confidence. Verifying a pull request at scale is a different job from reviewing one, and the difference is where the next few years of engineering quality get decided.

I have written before that [the felt sense of speed has come apart from the real thing](/writing/the-gauge-broke), and that [the work moved from producing code to deciding whether it is correct](/writing/timesheets-to-tokens). Verifying AI PRs at scale is that argument made concrete in a pipeline. Here is what actually replaces reading the diff.

## Machine-checkable gates carry the load

The volume that a human can no longer read, a machine still can. The first line of defence is everything deterministic: types, tests, the build, plus structural checks for the things agents reliably get wrong, duplicated logic, hardcoded config, scaffolding left behind, a dependency added without reason. These do not get tired and do not approve a thousandth PR less carefully than the first. The goal is to push as much of "is this correct" as possible into checks that run on every PR without a human in the loop, so that the human attention you do have is spent on the small set of changes the machine cannot judge.

## The spec becomes the thing you review

When you cannot read the implementation, you review the intent. A precise, testable specification, the acceptance criteria the change has to meet, is the only artifact that scales, because it is small, it is written by a human, and it is the oracle the tests encode. Reviewing the spec and trusting the gates that enforce it is a different motion from reading the code and hoping you spot the bug. It moves your scarce judgment upstream, to deciding what correct means, which is the one part of the job that did not get cheaper.

## Sample and risk-weight what is left

You cannot deep-read every PR, but you can deep-read the ones that matter. Risk-weight the queue. A change to a money-movement path, an auth boundary, a migration, gets a human every time. A dependency bump that passed every gate gets sampled. Spending equal attention on every PR was always a fiction; at agent volume it is an expensive one. The discipline is to put human eyes where a miss is costly and let the gates own the rest.

## Provenance, so a bad merge is traceable

At scale you will ship a defect. The question is whether you can find it fast. Every PR needs a record of what it claimed to do, which spec it met, which gates it passed, so that when something breaks you can trace it instead of bisecting blind through a thousand agent commits. Agents drop this by default because it is not in the diff. So it becomes a gate of its own.

I hold this line hard because I ship agent-written code into financial infrastructure, where a bad merge is not a bug you fix next sprint, it is money that moved wrong. But the logic is the same for any team: the bottleneck was never typing, and now that typing is free, the only thing standing between you and shipped slop is the verification you can run at the speed the code arrives. Reading the diff was a proxy for that. At scale, you need the real thing.
