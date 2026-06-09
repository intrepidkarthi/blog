---
title: "from insurance fraud detection (2018) to crypto fraud signals (2026)"
date: 2026-02-28
slug: from-insurance-fraud-to-crypto-fraud-signals
excerpt: "Eight years apart, two fraud-detection problems. Same shape, different data, different stakes. What transfers, what does not, and what I would do differently the second time."
tags: [fraud-detection, machine-learning, crypto, insurance, retrospective, signals]
---

In 2018 I built an insurance fraud detection pipeline. In 2026 I am building crypto fraud signals as part of feaws. The two problems are eight years and three industries apart. The shape of the work is almost identical. The differences in stakes, data, and adversary are the part that matters.

Here is what transfers between the two, what does not, and what I would do differently the second time.

## what transfers

The fraud detection problem is the same in any industry. You have a stream of transactions. Some fraction is fraudulent. The fraudulent fraction is small (usually 0.1-2%). The labels are noisy (some labeled fraudulent is not, and vice versa). The cost of a false negative is high (missed fraud). The cost of a false positive is also high (annoying a real customer).

The mathematical core is the same in both projects.

```
class imbalance         │ rare positives — same in both
label noise             │ ground truth is uncertain — same in both
feature engineering     │ behavioural patterns, network features — same in both
threshold selection     │ trade off precision and recall — same in both
adversarial evolution   │ fraud changes shape over time — same in both
explainability          │ model output must be defensible — same in both
```

A junior ML engineer who can build an insurance fraud pipeline can build a crypto fraud pipeline. The skills transfer. The mental model transfers. The libraries transfer.

## what does not transfer

The differences are not in the math. They are in everything around the math.

**Stakes.** A 2018 insurance fraud miss cost the insurer about ₹50,000-₹2 lakh per case. A 2026 crypto fraud miss can cost millions in seconds — and the funds, once moved on-chain, are often unrecoverable. The cost of a missed positive is two orders of magnitude higher.

**Latency.** The 2018 pipeline ran in batches — overnight scoring of claims, results to the adjusters in the morning. The 2026 system has to score in real time. A transaction blocked after the fact is partial mitigation. A transaction blocked before settlement is full mitigation. The latency budget collapsed from hours to milliseconds.

**Data freshness.** The 2018 model trained on labelled data that was months old. Insurance fraud patterns evolve over years. The 2026 problem operates on data that is hours or minutes old, and patterns evolve within days. The model retraining cadence went from quarterly to weekly. The deployment pipeline had to change to support this.

**Adversary.** The 2018 fraud adversary was a human filling out a claim form, possibly using common templates. The 2026 fraud adversary is automated, often coordinated across hundreds of wallet addresses, often using laundering techniques specifically designed to defeat known detection patterns. The adversary in 2026 has read the same blog posts and academic papers about detection that the defender has read.

**Explainability standards.** A 2018 insurance fraud decision needed to satisfy a regulatory standard for fairness — the insurer had to be able to explain why a claim was flagged. A 2026 crypto fraud decision often needs to satisfy zero regulatory standard (because the regulator has not specified one) but a high *legal* standard (because the decision might be litigated by the user whose transaction was blocked).

## what I would do differently the second time

Three things, in roughly the order they have mattered.

**Build the labelling pipeline first.** In 2018 I built the model first and the labelling infrastructure second. The result was three months of debugging label noise issues that should have been caught upfront. In 2026 I built the labelling pipeline first — manual review by experienced analysts, with confidence scores attached to each label, and a feedback loop where model predictions that disagree with labels go back into the labelling queue. The model improvements come from the labelling investment, not from the algorithmic investment.

**Treat the adversary as adversarial from day one.** In 2018 I assumed fraud patterns were stable enough that a quarterly retrain would catch drift. They were not, but they were closer to stable than crypto fraud is. In 2026 I assume every detection pattern I deploy will be circumvented within 60 days. The architecture has to support fast iteration, not just stable inference. The whole pipeline is built around the assumption that the adversary will adapt to my model and I have to adapt to theirs.

**Invest in network features early.** Fraud is almost always coordinated. A single fraudulent claim or transaction is suspicious in isolation. A cluster of fraudulent claims or transactions linked by network features (shared addresses, shared phone numbers, shared transaction patterns) is much more obviously fraudulent. The network features are usually the most predictive in any fraud detection system. In 2018 I built the network feature layer last. In 2026 I built it first.

## what is the same

The thing that surprised me most, going from 2018 to 2026, is how much the *practitioner's experience* is identical.

The same week-to-week rhythm: review last week's catches, look at the misses, identify patterns the model is failing on, propose new features, A/B test, redeploy. The same conversations with stakeholders: false positive rates are too high, please reduce them, but also catch more fraud, but also do not annoy customers, but also be defensible if a regulator asks why a particular case was flagged. The same political dynamics: someone in the business wants the model to flag fewer cases because it costs them deals; someone in risk wants it to flag more because they are accountable for losses.

The technical problem changed. The organisational problem did not. The fraud detection engineer's job in 2026 looks remarkably like the fraud detection engineer's job in 2018, in shape, in pacing, and in the kind of judgement calls that have to be made every week.

## the meta-observation

Knowledge transfers across domains in fraud detection more than in almost any other ML area. A team that has done insurance fraud well can do crypto fraud, transaction fraud, identity fraud, ad fraud, or fake review detection with only a few months of ramp-up. The shape of the problem is what carries. The specifics adapt.

If you are starting a career in fraud detection, pick the domain you find interesting and dive in. The work is portable. The pattern recognition you build in one domain transfers to the next. The eight-year gap between my two fraud projects mattered less than I expected it to. The first project taught me how to think about fraud. The second project benefited from that thinking, even though the data, the stakes, and the adversary are unrecognisable.

---

→ Earlier: [insurance fraud detection pipeline](/writing/insurance-fraud-detection-pipeline) (2018)
