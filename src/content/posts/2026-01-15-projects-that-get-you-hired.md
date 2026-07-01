---
title: "The projects that make me stop scrolling a resume"
date: 2026-01-15
slug: projects-that-get-you-hired
excerpt: "I have screened a lot of engineering resumes as a CTO, and most projects are the same five: Titanic, MNIST, a spam classifier, house-price prediction, a chatbot. When ninety percent of candidates submit the same thing, the project stops being a signal. Here is what actually makes me stop scrolling, from the person on the other side of the table."
tags: [career, machine-learning, hiring, engineering-leadership, students]
---

I have screened a lot of engineering resumes as a CTO, and I can tell you the exact moment most of them lose me. It is the projects section, and it is because they are all the same five projects. Titanic survival. Handwritten digits. A spam classifier. House-price prediction. A GPT wrapper chatbot. I have seen each of these a thousand times, and here is the problem with that: a project only works as a signal when it tells me something the next candidate's does not. When ninety percent of a stack of resumes lists the same tutorial, the project section stops being evidence of anything except that you can follow a tutorial.

That is the thing students get wrong. The project is not there to prove you can train a model. Everyone can train a model now. The project is there to prove how you think and whether you finish. So here is what actually makes me stop scrolling, from the side of the table that decides.

## The shipped-it test

Did it reach a person who is not you? Deployed somewhere, in an app store, used by a real user, running past the demo. Shipping is a completely different skill from training, and it is the one that separates people who can do the job from people who can do the assignment. A model in a notebook is homework. A thing someone else used is work. I stop scrolling for the second one.

## The messy-data test

Where did the data come from? If the answer is a clean Kaggle CSV, you skipped the part of the job that is actually hard. Real data is dirty, incomplete, and does not come with a target column helpfully labelled. A candidate who scraped their own dataset, or pulled it from an API and spent a weekend cleaning it, has done the thing the job is mostly made of. The Titanic dataset has done nobody any favours in years.

## The tradeoff test

Can you explain one decision you made and what it cost you? "I used a smaller model because I needed it to run on-device and I gave up some accuracy for it." "I picked this database and it made writes cheap and queries painful." A project you can defend beats a project that merely runs, because the defence is the actual signal. I do not want the project. I want the sentence that starts with "I chose X instead of Y because." That sentence tells me you made a decision under a constraint, which is the entire job.

## What I do not care about

Your accuracy number on a benchmark. How many models you tried. Whether you used this week's framework. These are the things students optimise because they are easy to measure, and they are exactly the things that do not survive contact with a real screen. I have never once hired someone because their validation accuracy was 94 instead of 91.

The uncomfortable truth underneath all of this: a small, finished, explainable project beats an ambitious unfinished one every single time. The unfinished one tells me you start things. The finished one tells me you close them, and closing things is rare enough that it is most of what I am screening for.

I co-authored [a book of AI projects](/mobile-artificial-intelligence-projects) and I have judged them at hackathons, and the pattern is the same in every context. The projects that stand out are never the most complex. They are the ones the person can walk me through, defend, and point at something real that came out the other end. Build that one. Then be able to talk about the one decision in it you would make differently now.
