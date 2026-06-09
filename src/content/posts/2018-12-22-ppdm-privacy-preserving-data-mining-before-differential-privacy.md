---
title: "PPDM — privacy-preserving data mining before differential privacy was mainstream"
date: 2018-12-22
slug: ppdm-privacy-preserving-data-mining-before-differential-privacy
excerpt: "K-anonymity. Generalisation. Suppression. Perturbation. The pre-differential-privacy techniques I applied to insurance fraud detection in 2018, and what each one actually did to the data."
tags: [privacy, ppdm, k-anonymity, fraud-detection, machine-learning, insurance, differential-privacy]
---

In December 2018 I built an insurance fraud detection system that included a Privacy-Preserving Data Mining (PPDM) layer. The repo is at [intrepidkarthi/Insurance_Fraud_Detection](https://github.com/intrepidkarthi/Insurance_Fraud_Detection). The PPDM phase processed the training data through several anonymisation techniques before the decision-tree classifier ever saw it.

In 2018, differential privacy existed academically but had limited tooling. Google's RAPPOR and Apple's local DP for telemetry were the only large-scale production deployments. For most ML teams handling sensitive data, the practical answer was still the older PPDM techniques — k-anonymity, generalisation, suppression, perturbation, anatomisation. These techniques came out of database research in the late 1990s and 2000s, predating the deep-learning era.

Here is what each technique did, why I used each one for insurance fraud detection, and how the picture has changed by 2026.

## the setting

The insurance fraud problem had a specific privacy shape. The training data contained real PII — names, addresses, phone numbers, claim details, medical records, vehicle registration numbers. The model needed to learn patterns from this data. The trained model would be deployed and queried by operations. The model's internal weights, if exfiltrated or inverted, could reveal information about specific individuals in the training set.

For Indian insurance data specifically, there was an additional constraint: realistic synthetic data was hard to generate. *Indian people faker data is not available anywhere*, as the README notes. I had to use `mimesis` and `faker` libraries that primarily generated Western-name datasets, which produced training data that was structurally unrealistic for the Indian context.

The PPDM techniques mitigated the PII risk on the real data. Each technique had a different mechanism and a different cost.

## 1. suppression

The simplest technique. Just drop the column or the value entirely.

```python
# suppress the name column
df = df.drop(columns=['policyholder_name'])

# suppress phone numbers
df['phone'] = '[REDACTED]'
```

Suppression is brutally effective and lossy. The information is gone. For names and phone numbers, that was fine — the fraud classifier did not need them. For other fields where the information had predictive value, suppression was a non-starter.

In the fraud detection model, I suppressed: policyholder names, phone numbers, full addresses, vehicle registration numbers. None of these contributed to fraud prediction. Suppressing them eliminated a significant privacy exposure for free.

## 2. generalisation

Replace specific values with broader categories. Postcode 560034 becomes "Bengaluru South." Date of birth 1987-03-15 becomes "1985-1990 age band."

```python
# generalise dates of birth into 5-year bands
df['dob_band'] = pd.cut(
    df['birth_year'],
    bins=range(1940, 2020, 5),
    labels=['1940-44', '1945-49', ...]
)
```

Generalisation preserves the predictive utility of the data while reducing identifiability. The classifier can still learn "claims from 25-30-year-olds in a certain zone are more often fraudulent" without knowing the exact birth date or address.

The trade-off is granularity. Too-coarse generalisation kills predictive power. Too-fine generalisation barely reduces identifiability. Choosing the right granularity required domain knowledge of which features the model relied on.

## 3. k-anonymity

Ensure that any record in the dataset is indistinguishable from at least *k-1* other records on the "quasi-identifier" attributes. If k=5, every record looks identical to at least 4 others on the chosen identifier subset.

```python
# group by quasi-identifiers and check group sizes
quasi_ids = ['city', 'dob_band', 'gender', 'profession']
group_sizes = df.groupby(quasi_ids).size()

# records in groups smaller than k get further generalised
small_groups = group_sizes[group_sizes < 5].index
# ... apply additional generalisation to records in small_groups
```

K-anonymity is the foundational PPDM technique. It guarantees that no individual record can be uniquely identified by the quasi-identifier combination alone. An adversary trying to link a record to a specific person needs information beyond what is in the dataset.

The 2018 implementation enforced k=5. Records that did not meet the threshold were either further generalised (their quasi-identifiers replaced with broader categories) or dropped entirely. Roughly 3% of the dataset was dropped due to insufficient k-anonymity even after generalisation.

## 4. perturbation

Add controlled noise to numerical attributes. The original value plus a small random offset replaces the original.

```python
import numpy as np

# perturb claim amounts with Gaussian noise
df['claim_amount'] = df['claim_amount'] + np.random.normal(0, df['claim_amount'].std() * 0.05, len(df))
```

Perturbation breaks the exact identifiability of numerical fields while preserving the statistical distribution. The aggregate "average claim is ₹X" stays approximately right. The specific "this claim was for exactly ₹47,832" becomes "this claim was for around ₹47,832."

For fraud detection, perturbation was risky because some fraud patterns rely on exact amounts (round numbers, specific thresholds). I applied perturbation only to claim amounts where the magnitude was the signal, not the exact value.

## 5. anatomisation

Separate sensitive attributes from quasi-identifiers into different tables, linked only by group ID.

```
table 1 (quasi-IDs)    │ {group_id, city, dob_band, gender, profession}
table 2 (sensitive)    │ {group_id, claim_amount, claim_type, medical_history}
```

An attacker who only has access to table 1 cannot link a quasi-identifier to a specific sensitive value, because table 1 has the demographic information but no link to the sensitive claim data of a specific individual.

I used anatomisation as a defence-in-depth layer. The model trained on the joined tables, but the production data was stored in the anatomised form. If table 1 leaked (more likely, since it is queried more often), the sensitive attributes in table 2 were still protected.

## the result

The classifier was a decision tree, trained on 73,117 training records and tested on 18,280. The reported accuracy was around 99%. The accuracy was high because synthetic data is structurally easier to classify than real-world data — the fraud patterns I had introduced via the synthetic generation were learnable.

The privacy guarantees were partial. K-anonymity at k=5 protected against linkage attacks but not against attribute inference or membership inference. An adversary who knew that a specific person was in the dataset could still potentially learn things about them via the model's output, even without learning the exact training record.

The 2018 implementation was honest about this. The README does not claim privacy guarantees beyond what PPDM provides. It documents the techniques used and the threshold values. The privacy claim was "this is materially safer than training on raw PII" rather than "this is private."

## what differential privacy changed

By 2020-2021, differential privacy had matured. TensorFlow Privacy, PyTorch Opacus, and Google's DP-SGD were production-ready. Differential privacy provided a stronger and more measurable guarantee: the model's output distribution for any specific individual is bounded by a privacy parameter ε.

The migration from PPDM to differential privacy is not always free. DP adds noise during training, which costs accuracy. The privacy-utility trade-off is explicit and tunable, but the tuning requires experimentation. For some use cases, PPDM remains the right answer because the dataset is small or the accuracy cost of DP is unacceptable.

For most modern ML on sensitive data, DP is now the default and PPDM is the legacy approach. The 2018 fraud detection project would, in 2026, be re-implemented with DP-SGD as the primary mechanism and PPDM as a complementary defence.

## what holds up from PPDM

Two pieces of the 2018 thinking are still relevant.

**Suppression of fields that do not contribute to the model is always free.** This applies regardless of which privacy framework you use. If your model does not need policyholder names, do not put policyholder names in the training set. This is the cheapest privacy improvement available.

**Generalisation as a precursor to DP.** Even with DP-SGD, you can improve the privacy-utility trade-off by generalising fields that do not need granular values. The DP noise on a generalised feature has less impact on accuracy than DP noise on a raw feature.

The PPDM techniques are not obsolete. They are foundational, and they pair well with differential privacy in a layered defence.

## the close

PPDM was the 2018 answer to a real problem that DP eventually solved better. The 2018 implementation worked for its use case. The repo on GitHub documents the techniques precisely enough that someone in 2026 could re-read it and learn what privacy engineering looked like before the modern frameworks existed.

If you are working on ML over sensitive data in 2026, start with DP-SGD. Layer PPDM techniques on top where they help. Do not skip the data-minimisation step where you simply remove fields you do not need.

The 2018 lesson holds: the cheapest privacy improvement is to not collect the data in the first place. Everything else is mitigation of an exposure that should not have existed.
