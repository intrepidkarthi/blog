# College Project Tracks

### Applied engineering and research directions for 3rd- and final-year CSE students

This guide turns the weekend's small prototypes into realistic college projects. The course gives you a starting artifact; it does **not** make a production system in two days.

## The rule that keeps a project gradeable

Choose **one user, one data source, one decision, and one measurable claim**.

Bad scope:

> Build an AI assistant for students.

Good scope:

> Help the exam-cell assistant answer 40 recurring questions from the current regulations PDF, with citations, at least 85% answer accuracy on a 100-question test set, and a refusal when the answer is not in the document.

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
