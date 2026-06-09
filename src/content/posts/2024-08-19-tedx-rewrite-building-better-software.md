---
title: "the TEDx talk I would rewrite today — Building Better Software, 2017 revisited"
date: 2024-08-19
slug: tedx-rewrite-building-better-software
excerpt: "Seven years after a TEDx talk on building better software, the principles are intact and the examples are unrecognisable. What I would say differently in 2024."
tags: [software, tedx, retrospective, ai, engineering, talks]
---

In November 2017 I gave a TEDx talk titled *Building Better Software*. The talk lasted 18 minutes, was watched by a few thousand people on YouTube, and represented my best attempt to compress 10 years of software engineering into something that would land on a general audience.

It has been seven years. The principles still hold. The examples, almost without exception, do not. Here is what I would say differently if I were giving the same talk in 2024 — what changed, what did not, and what I missed entirely.

## what I said in 2017

The talk had three sections.

```
1. software is mostly about reducing surprise        — testing, types, observability
2. software is mostly about reducing complexity      — abstractions, modularity, scope
3. software is mostly about people                   — teams, communication, leverage
```

Each section had specific examples — frameworks I recommended, practices I argued for, anti-patterns I warned against. The examples were 2017-specific. Most of them are dated.

## what was true then, still true now

The three core arguments hold. Reducing surprise, reducing complexity, and the people layer being the binding constraint — none of these has been overturned by anything that has happened since 2017.

The specific practices that survive: type systems (more useful now than in 2017, given TypeScript's continued takeover and Python's `typing` maturation), observability (Honeycomb, OpenTelemetry, distributed tracing — categorically more important than I argued at the time), and incremental delivery as a default (CI/CD is now boring infrastructure, not innovative practice).

The argument that "people are the binding constraint" has aged the best. Every team I have run since 2017 has been bottlenecked on communication and coordination, not on technical capability. The specific shape of the people problem has changed (remote work, async-first, AI-augmented engineers) but the underlying constraint is the same.

## what was true then, not true now

Several specific recommendations have aged poorly.

I argued for static type systems as a way to catch errors at compile time. The argument is still right. The 2017 examples (Haskell, Scala, Go's type system) are not the practical answer. In 2024 the answer is TypeScript for almost everything web-touching, Python with strict mypy for data work, and Rust for systems work where the safety guarantees actually matter. The 2017 talk did not name any of these dominantly.

I argued for microservices as the default architecture for "real" applications. This was the consensus position at the time. The 2024 consensus is more nuanced — most teams should default to a modular monolith until the actual scale problem appears. Microservices have a coordination tax that the 2017 advice systematically underestimated.

I argued for handwritten documentation as the durable record of system design. This was correct in 2017 and is now partially obsolete. The combination of LLM-readable code, well-typed interfaces, and architectural decision records (ADRs) in version control has displaced much of what "good documentation" used to mean. The remaining handwritten documentation is the *why*, not the *what*.

## what I missed

The thing the 2017 talk did not address at all is AI's role in software engineering. In 2017 this was a research question. By 2024 it is the dominant factor reshaping every part of the work.

The 2024 version of the talk would have to confront:

- Code generation. By 2024, a meaningful fraction of new code in most teams is AI-generated. The "reducing surprise" argument needs an entire new section on *trusting AI-generated code* — testing, review, validation, the new failure modes that arise when the author is not human.

- Test generation. The same AI that writes code now writes tests. Test quality has gone up in many cases but the failure mode where AI-generated tests test what was written rather than what was intended has emerged.

- Code review. AI-assisted review catches a different category of issues than human review. The 2024 best practice is layered review — AI for mechanical issues, humans for design and intent.

- The new role of the senior engineer. The 2017 senior engineer wrote a lot of code. The 2024 senior engineer writes prompts, reviews AI output, designs systems, mentors juniors who are using AI as their primary code-writing tool. The role description has changed materially.

- Hallucinations as a production risk. AI-generated code that references functions that do not exist, fields that were never defined, or APIs that have been deprecated — this is a new class of bug that did not exist in 2017 and is now common enough to need a dedicated catch.

The 2017 talk could not have addressed any of this. The 2024 talk would have to.

## the talk I would give in 2024

The structure would be the same. The examples would be different. The new section would be on the AI layer — not as a separate topic but woven through each of the three principles.

Reducing surprise now includes: validating AI-generated code, monitoring AI inference systems in production, catching AI hallucinations before they reach users, designing systems that fail safely when the AI is wrong.

Reducing complexity now includes: knowing when AI helps and when it adds a coordination layer that was not there before, designing prompt architectures that scale, deciding where on-device vs cloud AI should run.

The people section now includes: hiring engineers who are competent with AI tools, teaching senior judgment to juniors who learned coding with AI assistance from day one, deciding which engineering decisions humans must still make and which can be delegated.

The 2017 talk lived in a world where software engineers wrote most of the code. The 2024 talk lives in a world where engineers review most of the code. The principles transfer. The methods change.

## the meta-lesson

Re-reading a 2017 talk in 2024 is a useful exercise. The talks I would give now and the talks I gave then are different talks. The principles are mostly the same. The examples are mostly different. The thing the older version missed entirely is the thing the newer version cannot avoid.

If you are giving talks now, expect the same. The principles you settle on in 2024 will mostly hold in 2031. The examples will not. Plan for the talk to age. Pick the principles you are willing to defend in seven years. Be ready to discard the examples without flinching.
