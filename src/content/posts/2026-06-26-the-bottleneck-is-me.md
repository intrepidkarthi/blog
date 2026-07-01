---
title: "The bottleneck is me"
date: 2026-06-26
slug: the-bottleneck-is-me
excerpt: "Three and a half years of following one cost curve, and it has landed in my own chair with a physical symptom. I keep six to eight terminals open at once, agents generating in parallel, and the one thing everything queues behind is me deciding what is true. Generation went ambient. The bottleneck walked up the bench and sat down on me."
tags: [ai, claude-code, agents, token-economics, engineering-leadership]
faqs:
  - q: "Is running multiple Claude Code agents in parallel worth it?"
    a: "Yes, for well-isolated tasks, but the constraint moves to you. Parallel agents multiply throughput and token cost together, and most setups find 2 to 5 concurrent agents the sweet spot before coordination overhead wins. The real limit is not the agents; it is one human reviewing everything they produce in series."
  - q: "How many Claude Code agents should I run in parallel?"
    a: "Most effective setups run 2 to 5 at once. Beyond that, coordination cost and the token bill usually outweigh the parallelism, unless the tasks are very well isolated. The practical ceiling is your own attention: one person can only verify so much output."
  - q: "What is the real bottleneck when running AI coding agents in parallel?"
    a: "You are. Generation runs in parallel and cheaply; judging whether the output is correct runs in series through one human with one pair of eyes. The agents scale. Your review does not, which is why the bottleneck moves onto the person supervising them."
---

**Short answer.** Yes, for well-isolated tasks, but the constraint moves onto you. Parallel agents multiply throughput and token cost together, and most people find 2 to 5 concurrent agents the sweet spot before coordination overhead wins. The real limit is not the agents. It is one human reviewing everything they produce, in series.

## Is running multiple Claude Code agents in parallel worth it?

For three and a half years I have written the same sentence on this blog. Generation got cheap. Verification became the work. This summer I am living the end state of my own argument, and it has a physical symptom. I keep six to eight terminals open at once.

![My desk in June 2026, posted as "tokenmaxxing"](/images/articles/the-bottleneck-is-me/tokenmaxxing-desk-setup.png)
*The setup, June 2026. I posted it as "tokenmaxxing." That is the joke and the bill in one word.*

The setup got here in stages. Last year I moved through a stack of tools, Windsurf, Wispr Flow, Gamma, each one taking a different slice of generation down to nearly nothing. In the last few months all of it collapsed into one thing. I work almost entirely inside Claude Code now, and not as an autocomplete in an editor. As a room full of agents. Each terminal is one of them, running a task, writing code, reviewing a diff, drafting a deploy. I am not typing in any of them. I am moving between them.

Which means the shape of the work has changed completely. My day is no longer producing. It is dispatching and deciding. I read what each agent did, I decide whether it is right, I send it back or I let it through. The generation runs in parallel and for almost nothing. The judging runs in series, through one human, me, and that human has one pair of eyes and a finite number of hours. The bottleneck did not disappear when the typing did. It walked up the bench and sat down on me.

The symptom is almost funny. The slowest part of my pipeline some days is my own hand reaching for the enter key to approve the next step. I have half-joked about building a small robotic arm to press it for me, and the joke is only half a joke, because the moment you automate the approval you have removed the one thing the whole system is there to do. The enter key is the verification step. It is supposed to be slow. A robotic arm on it would just be me losing the argument I have been making since 2022.

There is a bill attached to all of this, and it is the one I wrote about in January, now pointed at my own desk. Running agents all day is running a meter. So I have started pulling the cheap, routine generation off the frontier model and onto a local box in the office, a modest machine with a small Gemma model on it, enough RAM and a single card. It is slower and it is dumber, and it does not need to be either of those things to do the job I give it. The boilerplate, the scaffolding, the first rough pass, the work where I already know what correct looks like and just need volume, all of that can run on a cheap local model for nothing. I save the expensive tokens for the work where the judgment is actually hard. That is token economics as a personal habit. Generate cheap, verify dear.

I have started pushing my own writing through the same gate. The thing you are reading was drafted with help and then run through a skill I built and published, a Claude plugin called write-like-me that strips the model's tells back out and pulls the text toward my own voice. It is on GitHub. The point of it is the point of everything else here. The machine produces a draft in seconds. Deciding whether it actually sounds like me, and fixing it where it does not, is the part that is still mine, so I built a tool to make that verification step faster instead of pretending I could skip it.

So here is where three and a half years of following one cost curve has actually landed me, in my own chair. Generation is ambient. I run a dozen instances of it at once, some on a frontier model and some on a spare machine in the corner. The scarce thing in my own day, the thing everything else queues behind, is me deciding what is true. I used to think the future of this job was leverage. It is. But the leverage piles up against a wall, and the wall is one person's attention. The people who win the next stretch are not the ones who generate the most. They are the ones who find a way to verify at the speed they can now generate. I have not solved that. I am just the clearest example of the problem I can find, sitting in front of eight terminals, deciding what to keep.
</content>
