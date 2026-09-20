# College Project Tracks

### Applied engineering and research directions for 3rd- and final-year CSE students

This guide turns the weekend's small prototypes into realistic college projects. The course gives you a starting artifact; it does **not** make a production system in two days. It also covers the part before the code: where ideas actually come from, how to pick one, how to form a team that survives the semester, and how to build with AI assistants without renting your own project.

## The rule that keeps a project gradeable

Choose **one user, one data source, one decision, and one measurable claim**.

Bad scope:

> Build an AI assistant for students.

Good scope:

> Help the exam-cell assistant answer 40 recurring questions from the current regulations PDF, with citations, at least 85% answer accuracy on a 100-question test set, and a refusal when the answer is not in the document.

Run your own idea against the rule. Tick honestly:

- [ ] **One named user.** You can say who, by role, has this problem. "Students" is not a user; "the exam-cell assistant" is.
- [ ] **One data source.** Named, legal to use, and in your hands this week.
- [ ] **One decision.** The single question the system answers or the single action it supports.
- [ ] **One measurable claim.** The number you must beat, and on how many test cases.

Four ticks: gradeable, start. Three: fix the blank before you write code. Two or fewer: that is "an AI assistant for students" wearing a different shirt.

## Where ideas actually come from

Good ideas are collected, not brainstormed. A 1 a.m. hostel brainstorm produces "AI assistant for students"; an hour of watching the exam cell produces a project. Go looking in this order, because the closer the source is to you, the better your data access, and **data access decides projects**.

### On campus: problems with a face attached

- **The counters.** Exam cell, department office, library desk, placement cell, hostel office. Ask one question: "What do you type, look up, or explain five times a day?" Every answer is a problem brief with a named user.
- **Your own week.** The thing you googled three times, the PDF you scrolled for ten minutes, the form you filled wrong twice. If it annoys you, it annoys three thousand others on the same campus.
- **Senior project reports.** In the department library, read only the *future work* and *limitations* chapters. They are lists of scoped, faculty-approved, unfinished ideas.
- **Clubs and symposium teams.** Registration, scheduling, certificates, and helpdesk chaos repeat every year and reset every year. The organizers keep the data.

### Off campus: problems with data attached

- **Hackathon problem statements.** The Smart India Hackathon archive is a free catalogue of institutional pain, curated by the institutions themselves. You do not need to enter the hackathon; you need its problem list.
- **GitHub issues on tools you already use.** An open issue is a documented user pain with reproduction steps. Half the problem brief is already written, in public.
- **Open datasets.** Kaggle, data.gov.in and its Tamil Nadu collections. Working backwards from a dataset you already hold is legitimate; data in hand beats a better idea without data.
- **The limitations section of any recent paper.** Authors list what they did not test: languages, domains, document conditions. An English-only result re-tested on Tamil or Tanglish documents is a real contribution, not a copy. That is the whole spirit of the Level 4 tracks below.
- **Shops and offices within 2 km of the campus gate.** Handwritten ledgers, bilingual forms, appointment notebooks. Madurai runs on paper that no Silicon Valley model was tuned for; that is an advantage, not an obstacle.

One warning: an idea that arrives with no reachable user and no accessible data is not an idea. It is a tweet.

## How to pick one: five tests, two minutes each

Run every candidate through these five before you commit anything.

- [ ] **The witness test.** Have you personally watched someone have this problem? Watched beats imagined, every time.
- [ ] **The 48-hour data test.** Can you legally hold the data within 48 hours? If it needs a permission letter that takes a month, the project is the letter, not the model.
- [ ] **The test-set test.** Can you write ten real input and correct-output pairs tonight? If you cannot imagine the test set, you cannot build the project.
- [ ] **The week-9 test.** Weeks 9–10 of this guide are measurement and hardening. Will this problem still interest you after the demo works and the spreadsheet begins?
- [ ] **The demo-day sentence.** "We help `user` decide `decision` from `data`, and we are right `X%` of the time on `N` cases." Fill every blank now, with placeholders for X and N.

Five ticks: start this week. Four: fix the gap first. Three or fewer: kill it tonight. Killing an idea in week 1 costs one evening; killing it in week 8 costs the semester.

And pick the problem, not the stack. Nobody grades you for using an agent framework. You are graded for a number.

## The idea wall: twenty problems worth hacking on

These are seeds, not scopes. Each still has to pass the five tests, the gradeable rule, and ship the nine artifacts below. Steal freely, then narrow.

| Idea | Build | First number to chase |
|---|---|---|
| **Mess menu truth-meter** | Photograph the day's mess board, extract the dishes, diff against the published weekly menu | Field accuracy on 20 board photos, with a rejection path for unreadable boards |
| **Exam-cell queue killer** | RAG over the current regulations PDF answering the 40 questions the exam cell hears daily, with citations and refusal | 85% on a 100-question set that includes unanswerable questions |
| **Bus-route decoder** | Bilingual Q&A over the city and college bus charts, Tamil and English | Accuracy on 30 real student questions asked in both languages |
| **Lost-and-found matcher** | Embed found-item photos and lost-item descriptions, match across the modality gap | Top-3 hit rate on a 25-pair test set |
| **Timetable clash oracle** | Q&A over the master timetable: free rooms, staff clashes, lab overlaps | 30 clash questions with zero false "room is free" answers |
| **Placement JD mapper** | Extract skills from job descriptions and cite which subject and unit covers each | Extraction accuracy plus mapping agreement with a placement coordinator |
| **Circular digest** | Bilingual college circulars to one-line summaries; dates and fees flagged, never paraphrased | Faithfulness on 40 circulars and zero missed deadlines |
| **Scholarship form pre-checker** | Vision check of a filled form against its instruction page, listing what will get it rejected | Rejection-reason recall on 20 filled forms |
| **Lab-record rubric checker** | Scanned lab record against the rubric: missing aim, missing output, unsigned pages | Section-detection agreement with the lab in-charge |
| **PYQ topic miner** | Cluster five years of question papers by topic, citing question numbers per topic | Topic-label agreement with a subject senior on 100 questions |
| **Quiz forge** | Unit-wise quizzes generated from your own notes with page citations | Valid-question rate judged blind by a senior |
| **Attendance oracle** | "How many periods can I still miss?" answered only from the regulations, refusing when they are silent | Zero answers without a cited clause |
| **Symposium helpdesk** | Event FAQ bot where the schedule changes hourly and answers carry timestamps | Stale-answer rate across three schedule updates |
| **Library shelf-finder** | "Where is this book, and is it in?" over a catalogue export | Top-1 accuracy on 30 lookups including misspelled titles |
| **Hostel complaint router** | Classify and route complaints to electrical, plumbing, wifi, or mess, with human approval before dispatch | Routing accuracy plus a blocked-action log for every auto-dispatch attempt |
| **Ledger digitizer** | A local shop's handwritten ledger, often Tamil, to structured rows | Character error rate per field, refusal on illegible rows |
| **Four-language city guide** | Multilingual RAG over official tourist information: Tamil, English, Hindi and one more | Language-wise answer accuracy and token-cost ratio per language |
| **Department style-cop** | Check student C or Python code against the department coding-standard sheet | Violation precision and recall on 20 already-graded submissions |
| **Lecture-transcript QA** | One course's recorded-lecture transcripts, answers with timestamp citations | Citation-correctness rate on 30 questions |
| **Notice-board digest** | A weekly photo of the physical notice board into a deadline-sorted digest | Extraction accuracy and missed-deadline count over one month |

## Every project must ship these artifacts

1. **Problem brief:** named users, current workflow, and the specific pain.
2. **Data note:** source, ownership, privacy classification, and update frequency.
3. **Architecture diagram:** model, prompt, retrieval, tools, interface, and storage.
4. **Baseline:** the current process or a simpler model/prompt that your approach must beat.
5. **Evaluation set:** 20 examples for a small prototype, 50 for a semester project, or 100 for a final-year claim. Include unanswerable and failure cases.
6. **Failure report:** at least three failures, their category, and the mitigation attempted.
7. **Cost and latency note:** tokens, requests, approximate cost, p50 latency, and what happens on timeout or quota exhaustion.
8. **Safe demo:** no secrets in the repository, no private data in free-tier prompts, no destructive action without human approval.
9. **README and reproducible run:** setup, sample data, test command, limitations, and a short demo video or hosted URL where appropriate.

A polished UI without these artifacts is a demo. A modest UI with these artifacts is an engineering project.

## Choose a track

Be honest about two things: the hours your whole team will truly spend, and what must exist at the end. Match them to a level; ambition one level above your hours does not label test sets.

### Level 1 · 6–10 hours after the course

These are small portfolio extensions.

| Project | Core techniques | Minimum evidence |
|---|---|---|
| **Study-notes RAG** | embeddings, retrieval, citations, evaluation | 20 questions, one baseline, one retrieval failure |
| **Receipt/document extractor** | vision, structured output, validation | field-level accuracy on 20 images or synthetic samples; unknown path for unreadable fields |
| **Prompt evaluation dashboard** | prompt versioning, regression tests, latency/cost logging | compare two prompts on a fixed test set and display failures |

### Level 2 · 12–20 hours

These fit a mini-project or a guided lab series.

| Project | Core techniques | Minimum evidence |
|---|---|---|
| **Department regulations assistant** | RAG, citations, refusal, freshness, injection testing | 50 labelled questions, document dates, answer and retrieval metrics, poisoned-document test |
| **Codebase RAG assistant** | code chunking, semantic + keyword retrieval, citations | index one student repository, answer 30 code questions, cite file paths and line ranges |
| **College document QA** | multimodal extraction, schema validation, human review | marksheet/form/receipt pipeline, field-level confusion table, explicit rejection cases |
| **Subject tutor for one course** | RAG, quiz generation, evaluation, optional vision | one subject only, 30-question test set, source citations, weak-topic report |
| **Tamil or multilingual scheme assistant** | multilingual retrieval, token measurement, RAG, evaluation | parallel language questions, token/cost comparison, language-specific failure analysis |

### Level 3 · 20–40 hours

These are suitable for a semester project when one team owns the scope.

| Project | Core techniques | Minimum evidence |
|---|---|---|
| **LLM evaluation and observability dashboard** | evals, traces, cost, latency, prompt versions | run history, p50/p99 latency, token/cost charts, regression alerts, privacy-safe logs |
| **RAG + tools assistant with approval gates** | RAG, function calling, workflow, validation, human approval | at least two read-only tools, one blocked side effect, step cap, tool-choice evaluation |
| **Department knowledge service** | ingestion pipeline, metadata filters, hybrid retrieval, deployment | update/re-index path, citations, access control, 100-question evaluation, hosted demo |
| **Personal AI tutor for one subject** | multimodal input, RAG, quiz/eval loop, user feedback | measurable learning task, baseline comparison, failure and bias analysis, privacy plan |

## Form the team before the code

The team you form in week 1 decides more of your grade than the model you call in week 6.

### How to form one

- **Two to four people; three is the sweet spot.** A builder, a data-and-eval owner, an integrator who deploys, writes, and demos. Name the roles on day one. Rotating them is fine; leaving an artifact unowned is not.
- **Form around a calendar, not a friendship.** One fixed three-hour weekly block that every member actually protects beats any skill on the roster.
- **Run a two-hour trial.** Redo one course lab together before committing a semester. One shared debugging session teaches you more about a teammate than three years of sitting in the same row.
- **Give the evaluation set to your most careful member.** It is the highest-weighted artifact in the rubric and the least glamorous. Assign it to someone who likes being right more than being seen.
- **Write the working agreement into the README.** Who owns which of the nine artifacts, the meeting slot, and what happens when someone goes silent. Deciding this in week 1 is planning; deciding it in week 10 is a fight.
- **Git from day one, everyone commits.** The commit log is the only team report nobody can argue with.

### How not to form one

Each of these sinks real teams every year.

- **The proximity team.** Same hostel wing, adjacent roll numbers, friends since first year, and no other reason. Friendship survives a project with roles; it rarely survives one without.
- **The four-coders team.** Four people who want to write model code, nobody who wants to label fifty questions. The fifty labelled questions are the project.
- **The passenger plan.** Carrying a silent member "for now". Week 8 never fixes what week 1 tolerated.
- **The topper-by-default leader.** Highest CGPA does not mean best decisions. The person who ships the most owns the calls.
- **The PPT person.** A role that exists only at review time. Everyone presents the artifact they own.
- **The six-pack.** Taking the maximum team size the form allows. Work does not divide six ways; blame does.

### The sixty-second team audit

Tick every sentence that is true of your team:

- [ ] We chose each other mainly because we sit together.
- [ ] Everyone wants to write the model code.
- [ ] One of us is "the PPT person".
- [ ] We took the maximum team size the form allowed.
- [ ] Our leader is the topper, not the person who ships the most.
- [ ] Someone is already not replying in the group chat.

Zero ticks: rare, go build. One or two: fix them in the working agreement this week, in writing. Three or more: that is not a team, it is a WhatsApp group. Re-form it while it is still cheap.

## A good semester progression

### Weeks 1–2 · Narrow the problem

Interview 3–5 users. Observe the current process. Collect only the documents you are allowed to use. Write one measurable claim.

### Weeks 3–4 · Build a baseline

Start with a plain prompt or manual workflow. Record where it fails. Do not add RAG, tools, or agents before you have a baseline.

### Weeks 5–6 · Build the smallest useful system

Add one technique at a time: structured output, retrieval, or one read-only tool. Keep the system understandable enough to draw on a whiteboard.

### Weeks 7–8 · Create the evaluation set

Write labelled examples with a domain expert. Include ambiguous, unanswerable, multilingual, and adversarial cases. Freeze version 1 of the set.

### Weeks 9–10 · Measure and harden

Compare against the baseline. Separate retrieval failure from generation failure. Test prompt injection, stale documents, malformed output, timeouts, and quota errors.

### Weeks 11–12 · Deploy and explain

Put the key server-side, add limits and logs, deploy a small interface, run a user trial, and document what you would not automate.

## Use AI tools like an engineer, not a vending machine

You will build this with AI assistants; the course itself assumes it. The difference between teams that AI accelerates and teams it sinks is a handful of habits, and examiners have learned to test for them.

### Three rules that are not optional

1. **The viva rule.** Never commit a line you cannot explain at a whiteboard. If AI wrote it and you cannot defend it, you did not build a project; you rented one, and viva is the repossession.
2. **The model never grades its own homework.** Your evaluation labels are written and verified by humans. Use a model to draft questions or find edge cases, fine; the correct answers are yours. A test set generated by the system under test is self-deception with a spreadsheet.
3. **The privacy line.** Real marksheets, mess bills with names, medical certificates: never into a free-tier prompt. Anonymize or synthesize first. This repeats artifact 8 on purpose, because it is the one that gets colleges into newspapers.

### Where AI multiplies you

- **Explaining failures.** Paste the full traceback, the code, and what you expected. Whole context in one message beats twenty fragments.
- **Attacking your design.** Ask for five ways your plan breaks before you build it. Ask for adversarial inputs and edge cases for your eval set: questions from the model, answers from you.
- **Boilerplate.** Argument parsing, plotting, README skeletons, config loading. Let it type what you would have typed anyway.
- **Reviewing diffs.** Paste the change and ask what is wrong with it. It finds real bugs, and it is tireless and unoffended.
- **Translating papers into plans.** "Explain section 3 as steps I can implement with NumPy" is a legitimate, powerful prompt.

### Where it quietly costs you marks

- **Picking your idea.** Ask a model for project ideas and you will submit the same project as three other teams, because they asked too. Use it to sharpen an idea you found in the world, not to find one.
- **Whole-app generation.** Four hundred lines in one shot means a week of reverse-engineering your own repository. Ask for small diffs into code you already understand.
- **Writing your report.** Generated reports read identically across teams, and the people grading you read dozens. Write it yourself; use AI to critique it.
- **Current facts.** Model names, prices, quotas, and API details go stale. Verify against live documentation before they enter your cost note.

### Habits that compound

- Prompt with context: file tree, exact error text, library versions, what you already tried.
- Ask for three approaches before asking for code. Pick one, then ask for the code.
- Keep a `PROMPTS.md` in the repo with the prompts that produced committed code. At viva it converts suspicion into credit.
- Small loops win: generate, run, read, re-ask. One giant ask followed by one giant debug is the slowest way to use a fast tool.

## Level 4 · Research-oriented final-year projects

These are not “build a chatbot” projects. Each one is an experiment with a hypothesis, a controlled comparison, a measurable result, and a reproducible artifact. A team should choose **one** track and implement a narrow version over a semester; do not attempt all the techniques listed in a row.

| Research track | Research question / hypothesis | Baselines and variables | Metrics and artifact |
|---|---|---|---|
| **Multilingual and code-switched RAG** | Does retrieval quality degrade when students ask the same question in English, Tamil, Tanglish, and Hindi? Does query translation improve recall without increasing hallucination? | Baselines: English-only dense retrieval and keyword search. Variables: language, translation, embedding model, chunking. | Recall@k, MRR, answer faithfulness, token/cost ratio, language-wise error report, reproducible multilingual benchmark. |
| **Chunking and hybrid retrieval study** | Does structure-aware chunking plus BM25+dense retrieval beat paragraph-only dense retrieval on college regulations and code? | Baselines: fixed-size chunks and dense-only search. Variables: chunk size, overlap, metadata filters, BM25 fusion, reranking. | Recall@k, MRR, nDCG, answer accuracy, latency, index size, ablation table, reusable retrieval benchmark. |
| **Hallucination and abstention calibration** | Can a system learn when to answer and when to say “I don’t know” without becoming uselessly evasive? | Baselines: always-answer prompt and grounded prompt. Variables: refusal threshold, retrieval score, verifier model, answer format. | Coverage, selective accuracy, abstention precision/recall, calibration curve, risk-weighted error, refusal/evidence dashboard. |
| **Multimodal document QA robustness** | Which image conditions cause structured extraction to fail: blur, skew, lighting, handwriting, language, or small text? Can preprocessing improve field accuracy? | Baselines: raw image at one resolution. Variables: crop, resize, deskew, contrast, prompt, schema, model. | Field-level accuracy, character error rate, rejection rate, confidence/error calibration, robustness matrix, labelled image fixture set. |
| **Agent trajectory reliability** | Does a guarded workflow outperform an unconstrained agent on the same task as tool count and task length increase? | Baselines: direct prompt and unguarded loop. Variables: step cap, validation, retries, model size, workflow/agent choice. | Task success, per-step success, end-to-end reliability, step distribution, unnecessary calls, cost, failure trace viewer. |
| **Prompt-injection defense evaluation** | Which defense layers reduce successful instruction hijacking, and what false positives do they create? | Baseline: naive RAG prompt. Variables: delimiters, instruction hierarchy, input filtering, output validation, tool permissions, human gate. | Attack success rate, benign-task pass rate, leakage rate, false-positive rate, blast-radius analysis, red-team corpus and report. |
| **Quality–cost–latency model routing** | Can a router send routine questions to a small/local model and hard questions to a stronger model while preserving quality? | Baseline: always use the strongest API model. Variables: routing features, confidence threshold, model pair, caching, output cap. | Quality, cost/query, p50/p95 latency, escalation rate, worst-case failures, routing policy and simulation notebook. |
| **Local versus API model under constraints** | For a bounded college task, when does a quantized local model become preferable to an API model? | Baselines: API model and a smaller local model. Variables: quantization, context length, language, prompt, hardware. | Accuracy/faithfulness, tokens/sec, TTFT, RAM, energy proxy, privacy exposure, cost at 100/10k users, deployment decision. |
| **Evaluation-set quality and judge bias** | How much do conclusions change when the evaluator is biased, the test set is contaminated, or the test questions are written by different groups? | Baselines: exact/contains scorer and human labels. Variables: LLM judge, position swap, question author, difficulty, language. | Human–judge agreement, position bias, inter-rater agreement, score intervals, contamination audit, evaluation methodology paper. |

### What makes one of these research, not just a bigger app?

A final-year team should submit all of the following:

1. **Research question:** one sentence that could be false.
2. **Hypothesis:** what you expect and why.
3. **Dataset protocol:** how data is collected, labelled, split, versioned, and legally handled.
4. **Baseline:** a simple method that a reviewer can reproduce.
5. **Controlled variables:** change one major factor at a time; record model/version/prompt/configuration.
6. **Ablation study:** remove one component and show what changes.
7. **Metrics:** define them before seeing the result; report confidence intervals or repeated-run spread where practical.
8. **Error taxonomy:** categories, examples, counts, and representative failures.
9. **Reproducibility pack:** code, environment, configuration, fixture data or data-generation script, and exact commands.
10. **Limitations and ethics:** privacy, bias, data rights, misuse, and what the system must refuse to automate.

### A feasible research-paper structure

| Section | What students should write |
|---|---|
| Abstract | Problem, method, comparison, main number, limitation. |
| Introduction | User/problem context and why the question matters. |
| Related work | 5–10 relevant papers or systems, not a list of buzzwords. |
| Method | Data pipeline, architecture, variables, and evaluation protocol. |
| Experiments | Baseline, ablations, metrics, repeated runs, and resource budget. |
| Results | Tables and plots with the failures visible, not only the best number. |
| Error analysis | Why the system failed and which component was responsible. |
| Ethics and limitations | Privacy, fairness, security, generalization, and non-goals. |
| Reproducibility | Repository, environment, commands, and data statement. |

### Research complexity ladder

- **Level A — Replication:** reproduce a published method on a college dataset.
- **Level B — Comparison:** compare two or more methods under the same evaluation protocol.
- **Level C — Improvement:** add one principled change and show an ablation.
- **Level D — New evidence:** test a language, domain, failure mode, or user group missing from prior work.

For most final-year teams, **Level B or C is the right ambition**. Level D can be excellent, but only when the dataset and evaluation are genuinely strong.

## What not to choose for this course

Do not begin with autonomous research agents, multi-agent swarms, Kubernetes troubleshooting, GitHub issue-to-PR automation, distributed training, full RLHF, vision-language pretraining, speculative decoding servers, or a generic chatbot that answers everything. These can become later research directions, but they are poor first college projects because the scope and evaluation boundary are unclear.

## Suggested evaluation rubric

| Criterion | Weight |
|---|---:|
| Problem clarity and user evidence | 15 |
| Working artifact and reproducibility | 20 |
| Baseline and evaluation quality | 25 |
| Failure analysis and mitigation | 15 |
| Security, privacy, and responsible use | 15 |
| Communication and documentation | 10 |

The best project is not the one with the most agents. It is the one that solves a real, bounded problem and can show a number, a baseline, and an honest limitation.

## After this guide

Use the current course artifacts as your starting point:

- Session 2's evaluation harness becomes your regression test.
- Session 3's extractor becomes your multimodal baseline.
- Session 4's NumPy RAG becomes your retrieval baseline.
- Session 5's tools become read-only workflow steps before any agent is considered.
- Session 6's attack and ship checklist becomes your review gate.

For deeper theory, use the external [AI Engineering from Scratch](https://aiengineeringfromscratch.com/index.html#contents) curriculum selectively: classical ML evaluation, self-attention, tokenizer construction, LLM application engineering, tool protocols, and observability. Its full 503-lesson curriculum is a long-term roadmap, not a two-day syllabus.
