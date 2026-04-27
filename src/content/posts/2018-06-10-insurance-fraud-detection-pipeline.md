---
title: "Insurance fraud detection — a privacy-first ML pipeline"
date: 2018-06-10
slug: insurance-fraud-detection-pipeline
excerpt: "Five-stage pipeline: synthesize Indian insurance data, clean it, do EDA, anonymize with k-anonymity and perturbation, then classify with a decision tree. ~99% accuracy on a 91k-row test set."
tags: [machine-learning, privacy, security, fraud, india]
draft: true
source: github
repo_url: https://github.com/intrepidkarthi/Insurance_Fraud_Detection
---

Insurance fraud detection is a textbook ML problem. Privacy-preserving insurance fraud detection is not. This project — built in 2018 — was my attempt to put both in the same pipeline, deliberately.

## The five-stage pipeline

```
synth → clean → EDA → PPDM → ML
```

Each stage is a runnable Python script in [the repo](https://github.com/intrepidkarthi/Insurance_Fraud_Detection):

### 1. Synthesize realistic Indian insurance data

```bash
python createDatabase.py
```

There's no public Indian-style faker library — every open dataset I could find used American names, addresses, and ZIP codes. The training data wouldn't generalize. So step one was building a generator with `mimesis` + `Faker` that produced plausible Indian names, PIN codes, vehicle registration patterns, and policy structures.

If you build ML models for the Indian market and don't fix this, your models will quietly underperform on production data and you'll wonder why.

### 2. Clean the data

```bash
python cleaning.py
```

Standard pre-processing — drop rows that fail validation, fill missing values either by sampling from the column distribution or via mean/median for numerics. Nothing exotic, but it's the difference between a 99% accuracy model and a 78% one.

### 3. Exploratory data analysis

```bash
python eda.py
```

Distributions, correlations, anomaly detection, outlier flagging. The EDA step is mostly for the human, not the model — it's where you discover that *most* of your synthesized "fraud" cases cluster in three policy types and you need to fix the synth to spread them.

### 4. Privacy-preserving data mining (the interesting bit)

```bash
python ppdm.py
```

This is the stage most fraud-detection pipelines skip. PPDM applies a stack of techniques to make the dataset safer if it leaks:

- **Suppression** — drop sensitive columns entirely.
- **Generalization** — replace exact age `34` with bucket `30-39`.
- **Anatomization** — split sensitive and quasi-identifier attributes into separate tables linked only by group ID.
- **Perturbation** — add calibrated noise to numerics so individuals can't be re-identified.
- **Categorization** — convert continuous values into bins.
- **k-anonymity** — ensure every row is indistinguishable from at least *k-1* others on any quasi-identifier.

The result: even if the entire training dataset gets stolen, an attacker cannot pick out an individual person. This matters because insurance datasets contain medical history, financial details, vehicle info — exactly the data you'd expect to be regulated under DPDP, GDPR, HIPAA equivalents.

### 5. The actual classifier

```bash
python machine_learning.py
```

Decision tree. 70/30 train/test split. **~99% accuracy on 73,117 training rows and 18,280 test rows.** The tree itself is exported to `insurance.pdf` so reviewers can see exactly which features split where.

A 99% accuracy decision tree is suspicious in production — it usually means the synth data is too clean. That's a feature here, not a bug: the goal was to build the *pipeline*, not ship a deployable model. With real-world data the same pipeline runs, the model picks something more nuanced (gradient boosting probably), and the accuracy lands somewhere in the 85-92% range with a non-trivial false-positive cost.

## Why I still recommend this stack

Eight years later, the stack I'd reach for is different — XGBoost or a small transformer instead of a decision tree, dbt instead of raw scripts, dagster instead of `python step.py`. But the *shape* of the pipeline is exactly what I'd build today:

1. **Synth** lets you test the pipeline before real data arrives.
2. **Clean** is a separate stage so you can audit data hygiene.
3. **EDA** is for humans, kept separate from the model.
4. **PPDM** is non-negotiable for any sensitive dataset.
5. **The model** is the smallest, replaceable part.

Most production ML pipelines fail because they collapse stages 1–4 into one giant ETL and stage 5 inherits all the dirt. Keeping them separate is what makes a system maintainable.

---

*Source: [intrepidkarthi/Insurance_Fraud_Detection](https://github.com/intrepidkarthi/Insurance_Fraud_Detection). The companion repo `Fraud-Analysis` mirrors the same pipeline.*
