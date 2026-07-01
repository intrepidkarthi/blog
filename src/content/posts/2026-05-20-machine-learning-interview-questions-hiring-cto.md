---
title: "The machine learning interview questions I actually asked as a hiring CTO"
date: 2026-05-20
slug: machine-learning-interview-questions-hiring-cto
excerpt: "Every list of machine learning interview questions gives you the textbook answer to 'what is overfitting.' None of them tell you the follow-up I asked after you gave it, which is where most candidates fell apart. I hired ML engineers. Here are the questions I actually used and, more importantly, what I was really testing with each one."
tags: [machine-learning, interview, hiring, career, students]
---

Search "machine learning interview questions" and you get the same list everywhere: what is overfitting, explain bias-variance, what is regularization, define precision and recall. Memorise the answers and you will pass a quiz. You will not pass an interview with me, because I was never testing whether you could recite the definition. I was testing what happened after you did.

I hired ML engineers as a CTO, and the questions that told me the most were rarely the opening ones. They were the follow-ups. So here are a few of the questions I actually asked, and the thing underneath each that I was really checking.

## "Explain overfitting." Then: "Here's a model at 99% on the test set. Ship it?"

Everyone can define overfitting. The follow-up is where it gets interesting, because the honest answer is a question, not a yes or no. How was the test set built? Could it have leaked from training? Is 99% suspiciously high for this problem, and does that make me trust it less, not more? The candidates who said "yes, 99% is great" told me they had learned the words but not the instinct. The ones who got suspicious of their own good number told me they had actually been burned by a leaky split before, which is the only way anyone really learns it.

## "Walk me through a project on your resume." Then: "Why not the simpler thing?"

I would pick a project and ask why they made a specific modelling choice, and then ask why they had not done the obvious simpler thing instead. This is the single most revealing question I have, because it separates people who chose from people who followed. If the answer is a real tradeoff, "the simpler model underfit this particular pattern, so I paid for the complexity," we are having an engineer's conversation. If the answer is "that is what the tutorial used," the project was never theirs. I have written more about [what a project actually needs to signal](/writing/projects-that-get-you-hired) and [the round-by-round shape of a data science interview in India](/writing/data-science-interview-questions-india); the interview is just me pressure-testing whether the project is real.

## "How would you know this model is getting worse in production?"

This one auto-rejected more strong-on-paper candidates than any other, because most ML education stops at the trained model and the job starts after it. If you have no answer for drift, for monitoring, for how you would even notice that the world changed under your model, you have studied ML and not done it. I was not looking for a perfect answer. I was looking for evidence that you knew the model was the start of the problem, not the end of it.

## What the whole thing is actually measuring

None of these are trick questions and none of them reward memorisation. They reward judgment, the ability to reason about a messy situation rather than recall a clean fact, and judgment is the thing I am hiring for because it is the thing I cannot teach fast. A model that is confidently wrong is more dangerous than one that is honestly uncertain, and the same is true of a candidate. The textbook questions filter for recall. The follow-ups filter for whether there is a real engineer behind the recall.

So prepare differently from the lists. Know the definitions, yes, but then, for every concept, ask yourself the follow-up: how does this break in practice, how would I notice, and what would I actually do about it. That is the conversation you are walking into if the person across the table has ever hired for this job. The definition gets you in the door. The follow-up is the interview.
