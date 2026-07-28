---
title: "Preparing for AI/ML interviews in the GenAI era"
date: 2025-07-13
slug: ai-ml-interview-preparation-genai-era
excerpt: "AI/ML interview preparation advice is still mostly the pre-2023 quiz with a few LLM buzzwords bolted on. The interview actually changed underneath it. The fundamentals still get tested, but there is a new axis now, and it is the one that separates people who use these tools from people who are used by them."
tags: [ai, machine-learning, interview, career, india, students]
---

Most AI/ML interview preparation you will find is the old quiz with a few generative-AI buzzwords added on top. Know your transformers, mention RAG, say "prompt engineering." That will not hurt you, but it misses that the interview itself changed. There is a new axis being tested now, on top of the fundamentals, and it is the one that actually sorts candidates in 2025.

## The fundamentals did not go away

Start here so nobody misreads me: the classic questions still get asked and still matter. Overfitting, evaluation metrics, how a model learns, the SQL and coding rounds. If you cannot do these, the LLM knowledge is decorative, because you will not clear the screen. Everything below is in addition to the fundamentals, not instead of them. The people who skipped the basics to chase the hype are the easiest rejections I see.

## The new axis: can you tell when the model is wrong

The question that separates candidates now is not whether you can use an LLM. Everyone can. It is whether you can tell when it is wrong. Interviewers are starting to hand you a plausible-looking AI output and ask if you would trust it, and the good answer is a set of questions, not a yes. How would I verify this. What would I check before shipping it. Where does this kind of model tend to fail. If you treat model output as correct because it looks correct, that is now a visible red flag, because the whole job increasingly is judging output you did not produce. I wrote about this from the hiring side in [what I look for in a fresher](/writing/hiring-ml-fresher-india-what-i-look-for), and it has only sharpened.

## Evals, because they are the scarce skill

If there is one topic worth going deep on beyond the fundamentals, it is evaluation. How do you measure whether an AI system is actually good, not just whether it runs. Most candidates have never built an eval harness and cannot describe how they would know their RAG system got worse after a change. The ones who can are rare and valuable, because measuring correctness is exactly the bottleneck companies are hiring to solve. A project where you built an eval, even a simple one, is worth more in an interview right now than a flashier project without one.

## Using the tools well is table stakes, not the differentiator

Yes, know how to use the current tools, and yes, be able to talk about building with LLMs, agents, and retrieval. But understand that this is the floor, not the ceiling. Everyone in the room can prompt a model. What almost nobody can do well is architect around the fact that the model is unreliable, and that is the thing worth being able to discuss. The market shift I described in [where AI/ML jobs in India are going](/writing/ai-ml-jobs-india-freshers) is showing up directly in the interview: production plus judgment, not production alone.

So prepare on two tracks. Keep the fundamentals sharp, because they are still the gate. Then, on top, be the person who treats AI output as something to be verified rather than trusted, who has actually measured whether a system works, and who can talk about building around unreliability. That combination is rare enough in a fresher that it is close to an unfair advantage, and it is available to anyone willing to prepare for the interview that exists now instead of the one from three years ago. What a token actually is, what attention costs you, where retrieval goes wrong: that is the layer under the interview, and I wrote all of it out plainly in [a guide to learning generative AI from scratch](/genai/learning-guide.html).
