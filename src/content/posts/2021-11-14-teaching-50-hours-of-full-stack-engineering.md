---
title: "teaching 50 hours of full-stack engineering — what worked"
date: 2021-11-14
slug: teaching-50-hours-of-full-stack-engineering
excerpt: "Forty-five topics. Fifty academic hours. Multiple sessions Aug-Oct 2021 over Google Meet. The curriculum I taught to non-CS engineers, and what I would cut today."
tags: [teaching, curriculum, full-stack, engineering, retrospective, education]
---

In August 2021, I started teaching a 50-hour full-stack engineering course to a cohort of engineers who had not studied computer science formally. The curriculum is in the repo at [intrepidkarthi/softwareengineer](https://github.com/intrepidkarthi/softwareengineer). It covered forty-five topics across programming, data structures, databases, web frameworks, infrastructure, ML, and adjacent areas.

The course ran in 90-minute sessions on weekend mornings between August and October 2021. We met over Google Meet with shared Jamboard for whiteboarding. The recordings ended up on YouTube for the students to revisit.

Three years later, I have a clearer view of what worked, what did not, and what I would do differently in 2026.

## the curriculum

The course outline lived in the repo's README. The 45 topics, in rough order:

```
foundations         │ basic programming, data structures, algorithms
                    │ programming languages (Java, Python, Go)
                    │
tooling             │ editors and shell (VSCode, Vim, nano)
                    │ source control (Git)
                    │
data                │ relational DBs (MySQL)
                    │ NoSQL and distributed DBs (MongoDB basics)
                    │
web                 │ Flask and Django web frameworks
                    │ REST APIs
                    │ HTML, CSS, JS basics
                    │ Node and React
                    │
deployment          │ Heroku, AWS, Azure, GCP
                    │ Apache, nginx, HAProxy as web servers
                    │ Vercel for frontend
                    │
networking          │ HTTPS, WebSocket, WebRTC, cryptography
                    │
integrations        │ Twilio, SendGrid as examples
                    │
infrastructure      │ microservices, containers (Docker), serverless (Lambda)
                    │ Kubernetes basics
                    │ DevOps and CI/CD (Ansible, Jenkins, Prometheus, Grafana)
                    │
data science        │ Pandas, SciPy, Matplotlib basics
                    │
ml/ai               │ PyTorch and TensorFlow basics
                    │ transfer learning, deep learning concepts
                    │
async                │ task queues (Kafka, RabbitMQ)
                    │
system design       │ WhatsApp / Snapchat / Instagram / Facebook clones
                    │ software testing and automation
                    │
mobile              │ Android app development, end-to-end build
                    │
adjacent             │ game development (Unity 3D), blockchain basics
                    │ AR/VR/XR basics, metaverse intro
                    │ common software tools used at companies
```

Plus four Q&A sessions interspersed to consolidate questions from prior sessions.

## what worked

Three things landed well with the cohort.

**Live coding with shared screen.** For programming basics and language demonstrations, live coding in VSCode with the students watching the cursor produced better outcomes than slide-based teaching. Students could see syntax errors, see how the debugger worked, see the keyboard shortcuts in real time. Recording the sessions for later review compounded this — students would re-watch the live coding when they were stuck on a similar problem the following week.

**Real product examples.** Talking about a Raspberry Pi walk-in-counter I had built earlier — actual hardware, actual product decisions, actual debugging stories — was more memorable than abstract examples. The students asked follow-up questions about it months later. Concrete examples from real projects beat synthetic textbook examples every time.

**Git as a first-week topic.** Teaching Git in Session IV (4-5 hours into the course) was right. By that point students had written some code and felt the pain of "I had a working version yesterday and now I cannot get back to it." Teaching Git before they had felt that pain would not have stuck.

**The reading list at the front.** The README's "Must read" section linked to Hacker Laws, Twelve-Factor App, Build Your Own X, and a few others. Students who actually read those resources had a meaningfully better experience in the second half of the course. The reading was the multiplier.

## what did not work

Three things I got wrong.

**Too much breadth, too little depth.** 45 topics in 50 hours is roughly one hour per topic. That is enough to introduce the concept and not enough to make it actionable. Students could recognise terms ("oh, that's Kafka") but could not build with them. The promise of "full stack" came at the cost of depth in any individual layer.

If I were redesigning the course today, I would cut at least 15 of the 45 topics and spend the recovered time going deeper on the remaining 30. The students would graduate able to actually build something rather than able to nod knowingly during a Kafka conversation.

**The "WhatsApp clone" system design exercise was the wrong level for the cohort.** I had imagined we would discuss the high-level architecture of a chat application — message queues, presence, fanout, encryption. The reality was that the students needed to first understand how a single HTTP request becomes a database row, and we ended up handwaving the chat-architecture parts. The exercise was too big a leap.

A better progression would have been: build a working REST API → understand request lifecycle → add a websocket layer → understand pub/sub → then talk about how this scales. The system design exercise should come at the end of a build-up, not as a standalone session.

**Async live sessions assume async live presence.** Several students could not attend specific sessions because of work or time-zone issues. The recordings helped, but watching recorded material is meaningfully harder than attending live. By the end of the course, the engagement gap between live attendees and recording-watchers was significant.

If I were doing this again, I would build asynchronous office hours into the structure — a Discord or Slack channel where students could ask follow-up questions and other students could answer. The async component would have caught the students who fell behind from missing live sessions.

## what I would cut today

In 2021 some topics felt like "you should at least know what this is." In 2026, several of those are clearly low-leverage.

```
cut                          │ why
─────────────────────────────────────────────────────────────────
metaverse / AR / VR basics   │ the metaverse story did not pan out;
                              │ AR/VR remains niche, not foundational
game development             │ unrelated to most full-stack work
blockchain & cryptocurrency  │ a survey-level intro adds nothing;
                              │ if students need it, dedicated course
Apache / HAProxy specifically │ teach nginx well; Apache is legacy
Heroku                       │ the platform's positioning has weakened;
                              │ Vercel/Railway are better defaults now
```

The recovered hours go to depth on the foundational layers — more on Python idioms, more on actual database design (schema, indexing, query plans), more on building one real React app end-to-end rather than skimming JS frameworks broadly.

## what I would add today

Three additions for the 2026 version.

**AI-augmented development as a first-class topic.** The students of 2026 will use Copilot, Claude Code, Cursor, or equivalent as their primary code-writing tool from day one. The curriculum has to include "how to work with these tools effectively" as a skill — when to trust them, when to verify, how to read the generated code critically. In 2021 this would have been a research topic. In 2026 it is essential.

**A proper deployment exercise.** End-to-end ship a single small app from "code on local machine" to "URL someone can visit." Pick the platform (Vercel, Railway, Fly.io), walk through the deploy mechanics, do not abstract any step. The students who can complete this exercise once can repeat it for any future project; the students who cannot complete it stay stuck in development-only mode forever.

**Observability as a foundation, not an afterthought.** Logging, metrics, traces, dashboards. The 2021 course mentioned Prometheus and Grafana in passing. The 2026 course should treat observability as a first-class concern from week one. Every app the student builds should ship with structured logs and at least one metric. The cognitive habit of "what does this look like in production" is invaluable.

## the recordings

Some of the live sessions ended up on YouTube. The early sessions are still findable. The Session I link from the README points to a recording of the data structures and algorithms session. A few hundred views, mostly from the cohort and a few external watchers who found it via search.

The recordings are useful as a record of what was taught and how. They are less useful as standalone learning material — they assume the prior session's context and the live interaction. Someone watching them cold would find them disjointed.

If I were producing teaching content from scratch today, I would record it differently — shorter, edited, with the on-screen artifacts cleaned up. The live-recorded version was right for the cohort that was attending live; it is suboptimal as long-tail content.

## the close

Teaching 50 hours of full-stack engineering taught me that the constraint is attention, not topic count. Students can absorb a finite amount per session. Stuffing more topics in does not increase what they learn; it just increases what they nod through.

The successful version of this course in 2026 would be narrower, deeper, with better support infrastructure (async channel, deployment exercise, observability throughout). The lecture-and-recording model would be one component, not the entire mechanism.

If you are teaching software engineering to non-CS engineers, the question is not "what topics should I cover?" The question is "what can a student build at the end?" Reverse-design the curriculum from the answer to that. The breadth you covered does not matter if the student cannot build anything.

The 2021 course had too much breadth. The 2026 version, when I build it, will have less.
