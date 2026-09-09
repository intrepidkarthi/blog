# Placement Roadmap

### For BE CSE (AI & ML) students who have done the twelve-hour Generative AI course

This is written to be useful rather than encouraging. It starts with what the course
actually qualifies you for, which is less than the course felt like, and then sets out
the shortest honest path from here to an offer.

---

## First, the honest position

**Twelve hours does not make you an AI engineer.** It makes you someone who has built
six working things and can explain how a language model works without hand-waving.
That is genuinely more than most candidates walk in with, and it is not a job
qualification on its own.

Three facts worth knowing before you plan around AI roles.

**Most campus offers for CSE are general software roles, not AI roles.** Companies
hiring freshers specifically for ML work are a minority, they typically want a
portfolio or a research record, and many prefer postgraduates. Plan for a software
engineering offer and let AI be the thing that makes you the interesting candidate in
that pile, rather than betting the year on a small number of AI-titled openings.

**"I know GenAI" is now a weak claim.** So many candidates say it that it carries
almost no signal. What carries signal is a specific number about a specific thing you
built: "my retrieval system answered 84 percent of a hundred test questions correctly,
against 61 percent for the same model without retrieval." Nobody who has not built
something can say a sentence like that, which is exactly why it works.

**Your data structures and algorithms preparation is not optional and this course does
not replace it.** Almost every company still screens on it. Treat this roadmap as the
thing you do *alongside* DSA, not instead of it.

---

## What the course already unlocks

Each session gave you something you can defend under questioning. This is the
"downstream unlocks" view: what you know, and what it opens.

| What you built | What it lets you answer | Where it shows up |
|---|---|---|
| **S1** A first API call, with the token bill printed | Why a model repeats itself, what a token is, why the same prompt gives different answers, what the context window costs | Almost every GenAI interview opens here |
| **S2** A prompt A/B test with a scored test set | How you know your output is correct; why a demo is not evidence | The question that separates builders from users |
| **S3** A vision pipeline returning structured JSON | How multimodal input works; why models miscount; how to force a schema | Document-processing and automation roles |
| **S4** A RAG system over your own documents | The single most-asked GenAI system design question | RAG is the default fresher AI project |
| **S5** A tool-using agent with a step cap | What "the model called a tool" actually means; workflow versus agent | Agent roles, and a good senior-level discussion |
| **S6** An attacked and hardened application | Prompt injection, cost per query, what stops a launch | Security-adjacent and platform roles |

If you can talk fluently about all six with a real number attached to each, you are
already past most fresher candidates for AI-adjacent work.

For the next step, use `COLLEGE-PROJECT-TRACKS.md`. It turns these artifacts into bounded college projects: codebase RAG, multimodal document QA, evaluation/observability, department knowledge services, and a subject tutor. Choose one user, one data source, one baseline, and one measurable claim before adding more agents or frameworks.

---

## A role worth knowing: Forward Deployed Engineer

A **Forward Deployed Engineer (FDE)** works close to users or customers to turn an ambiguous problem into a working technical solution. At an AI company, that can mean understanding a team's workflow, connecting their data and tools to a model, building a prototype, measuring whether it helps, deploying it safely, and taking the lessons back to the product and engineering teams.

It is not simply a new name for a prompt engineer, salesperson, or research scientist. A good FDE combines:

| Part of the job | What it looks like as a student |
|---|---|
| **Discovery** | Interview a real user and write down the current workflow, pain, constraints, and success measure. |
| **Applied engineering** | Build the smallest useful system with Python, APIs, databases, authentication, and a clear interface. |
| **AI judgement** | Choose prompt, RAG, workflow, tools, or a local model based on evidence — not hype. |
| **Evaluation** | Create a labelled test set, baseline, metric, and failure report. |
| **Production ownership** | Handle keys, errors, latency, cost, privacy, logging, and rollback. |
| **Communication** | Explain the architecture to a user, a manager, and an engineer; write a short decision document. |

### How to become one

You do not need to wait for an FDE job title. Build the evidence the role asks for:

1. **Become a reliable software engineer first.** Keep DSA preparation active. Learn Python well, Git, HTTP, JSON, SQL, debugging, tests, and basic deployment.
2. **Build two different AI applications.** Make one knowledge-heavy system such as department-regulations RAG or codebase RAG, and one different system such as multimodal document QA or an evaluation dashboard. Use the [College Project Tracks](COLLEGE-PROJECT-TRACKS.md) guide.
3. **Talk to users before choosing the architecture.** Interview 3–5 people, observe the manual process, and write the problem in their language. An FDE is paid to solve the right problem, not to attach an agent to the first problem mentioned.
4. **Ship one working URL.** Put the API key on the server, add input limits, rate limits, a spend cap, graceful errors, and a README. A notebook proves learning; a URL proves ownership of the boring parts.
5. **Measure the result.** Keep a baseline and a person-written evaluation set. Report what improved, what failed, and what you would not automate.
6. **Practise the customer loop.** Demo the system, ask what is wrong, change one thing, re-run the eval, and write a short changelog. This is the FDE habit: build → show → listen → measure → improve.
7. **Create a case study, not just a project link.** One page should show the user, workflow, architecture, baseline, metric, cost, failure, mitigation, and next decision. That document is often more persuasive than a list of frameworks.
8. **Apply for adjacent titles too.** Search for Forward Deployed Engineer, Solutions Engineer, Applied AI Engineer, AI Implementation Engineer, Developer Success Engineer, and Solutions Architect roles. Titles vary; the evidence is what transfers.

### A realistic student route

| Stage | Evidence to produce | What it proves |
|---|---|---|
| **After this course** | Six prototypes and one honest failure per session | You can learn the vocabulary and build with APIs. |
| **Next 4–6 weeks** | One deployed application with a baseline and 50–100 test cases | You can own a small system beyond a notebook. |
| **Next 6–10 weeks** | A second project with user interviews and a case study | You can discover a problem and choose the right approach. |
| **Interview preparation** | Two-minute story, ten-minute architecture walkthrough, failure story | You can communicate with both customers and engineers. |
| **First role** | Software/FDE/applied AI/solutions role | You are ready to learn the company's domain and ship useful systems. |

The honest distinction is important: **this 12-hour course does not qualify someone as an FDE by itself.** It gives students the vocabulary and starter artifacts. The path to the role is software fundamentals + user discovery + deployed systems + evaluation + clear communication.

---

## The gap, named

Between "did the course" and "hireable for AI work" sit four things. None needs money
or a GPU.

**One deployed thing with a URL.** A notebook is not a portfolio. A running
application someone else can open changes the conversation entirely, because it proves
you handled the parts that are boring: keys, errors, cost, latency, a person who is
not you using it.

**One number you measured yourself.** Not a benchmark you read about. An evaluation
you ran on a test set you wrote, with the failure you found and what you did about it.

**Python fluency beyond the labs.** The labs held your hand. You need to be comfortable
reading a stack trace, structuring a project across files, and using `git` without
looking it up.

**The classical machine learning vocabulary.** You will be asked what overfitting is,
what a train-test split is for, what precision and recall mean and when accuracy
misleads. This course deliberately skipped classical ML and interviewers do not.

---

## The roadmap

Twelve weeks, assuming eight to ten hours a week around your regular coursework.
Each phase unlocks the next; do not reorder them.

### Weeks 1–2 · Close the classical ML gap

You cannot skip this and it is the fastest phase. You need the vocabulary, not the
mathematics.

Learn what these are and when each matters: supervised versus unsupervised learning,
train-test split and why it exists, overfitting and underfitting, cross-validation,
precision, recall, F1, the confusion matrix, why accuracy is a bad metric on imbalanced
data. Add linear regression, logistic regression, decision trees and k-means at the
level of what they do and when you would reach for them.

*Unlocks:* the first fifteen minutes of nearly every ML interview.
*Evidence to produce:* one small classification project on a public dataset, with a
confusion matrix and an honest statement of what it gets wrong.

### Weeks 3–5 · Turn the capstone into a deployed product

Take what you built in the course and finish it properly.

Give it a real interface rather than a notebook. Put the key on the server and never in
the browser. Add the guardrails from Session 6: input size limits, a rate limit, a
spend cap. Handle failure so a user sees a message rather than a stack trace. Deploy it
on a free tier and get a URL.

*Unlocks:* the portfolio conversation, and every question about production.
*Evidence to produce:* a URL, a README explaining the architecture, and a paragraph on
what it costs per user per day, with the arithmetic.

### Weeks 6–7 · Measure it, and write the measurement down

Build a test set of a hundred questions for your own application. Score it. Change one
thing. Score it again.

This is the phase most candidates skip and it is the one that produces your strongest
interview sentence. Write it up: what you tested, how many questions, what the number
was, what you changed, what the number became, and one failure the test set caught that
you had not noticed.

*Unlocks:* "how do you know it works", which is the question that ends most fresher
interviews badly.
*Evidence to produce:* an evaluation section in your README with a real table.

### Weeks 8–9 · Build a second thing, deliberately different

Two projects that use the same technique look like one project. Pick something that
exercises a different part of the course: if your capstone was retrieval, build
something agentic or multimodal.

Keep it smaller than you want to. A finished small thing beats an abandoned ambitious
one, and interviewers can tell the difference immediately.

*Unlocks:* range. Two projects that differ shows judgement rather than a tutorial
followed twice.

### Weeks 10–12 · Interview preparation, in parallel with DSA

Rehearse out loud. Every project needs a two-minute version and a ten-minute version.
Practise the ten-minute version until you can draw the architecture from memory while
talking.

Prepare your honest failure story. You will be asked what went wrong. Have a real one
with what you did about it, because the invented ones are obvious.

---

## Interview questions you should be able to answer

Grouped by how deep they go. If you can answer the first two groups you are ahead of
most fresher candidates.

**Fundamentals**

- What is a token, and why do models use sub-word pieces?
- Explain what happens between typing a prompt and seeing the first word of the reply.
- Why does the same prompt give different answers? How do you stop that?
- What is a context window and what happens when you exceed it?
- Why is output priced higher than input by almost every provider?
- What is an embedding? How does the model know two sentences mean the same thing?

**Building**

- Explain RAG end to end. Where does it break?
- How do you chunk documents, and what goes wrong at each extreme?
- Your RAG returns the right paragraph and the model still answers wrong. Diagnose it.
- When would you fine-tune instead of using RAG? When would that be a mistake?
- How do you get reliable JSON out of a model?
- What is prompt injection, and why can indirect injection not be fully fixed?

**Judgement, and this is where offers are decided**

- How do you know your AI feature works? Walk me through your evaluation.
- Your feature works in testing and fails in production. What do you check first?
- How much does your application cost per user, and how would you halve it?
- Would you use an agent here, or a workflow? Defend it.
- What would stop you shipping this?

**The one you will be asked and should not fumble**

- "Tell me about something you built." Two minutes. Then be quiet and let them ask.

---

## What to put on a resume, and what not to

**Put on it:** the deployed URL. The measured number. The specific techniques with the
specific problem they solved. "Built a retrieval system over 400 pages of departmental
regulations; evaluated on a 100-question test set at 84 percent accuracy against a 61
percent ungrounded baseline; deployed on a free tier at approximately ₹40 per month."

**Keep off it:** "Proficient in LLMs, GenAI, Machine Learning, Deep Learning, NLP,
Computer Vision, Prompt Engineering." A list of fields you have touched reads as a list
of things you cannot be questioned on in depth, and a good interviewer will pick the
weakest item on it.

**Never claim you fine-tuned a model unless you did.** This is the most common
exaggeration on fresher resumes for AI roles and it collapses under one follow-up
question about the training data format.

---

## Realistic role targets

| Role | Realistic for a fresher | What it actually needs beyond this course |
|---|---|---|
| Software engineer, at a company using AI | **Yes, and this is the main path** | Strong DSA, one deployed AI project as the differentiator |
| Forward Deployed Engineer | **Possible, especially at AI startups** | Two deployed customer-style projects, user discovery, strong Python/backend fundamentals, evaluation, and excellent communication |
| AI / LLM application engineer | Yes, at startups and product teams | Two deployed projects, evaluation you can defend, solid Python |
| Data scientist / ML engineer | Sometimes | Classical ML depth, statistics, usually a stronger academic record |
| ML research | Rarely without a postgraduate degree | Publications, mathematics, a research advisor |
| Prompt engineer | Treat as unlikely | Mostly absorbed into other roles; do not plan around this title |

The honest headline: **use AI to make yourself the memorable candidate for a software
role**, and let a specialist AI role come after you have shipped things professionally.

---

## Where to go next

The course repository has three things that continue from here.

`LEARNING-GUIDE.md` has sections on turning coursework into a final-year project,
reading research papers, and the skills behind applied AI roles.

`COLLEGE-PROJECT-TRACKS.md` gives scoped projects with user discovery, baselines,
evaluation requirements, failure analysis, privacy, cost, and deployment evidence.
Use it to choose the customer-style project you will build next.

The external [AI Engineering from Scratch](https://aiengineeringfromscratch.com/index.html#contents)
curriculum is useful for selective deeper study in classical ML, transformers,
LLM engineering, tools, observability, and production. Its full 503-lesson scope is
a long-term roadmap, not a prerequisite for this placement plan.

Beyond this repository, the most useful thing you can do is the least glamorous:
finish and deploy one more thing than you feel ready to.

---

*Built for Thiagarajar College of Engineering, Madurai. Free to use, fork and share.*
