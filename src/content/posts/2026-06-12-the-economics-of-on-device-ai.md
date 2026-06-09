---
title: "the economics of on-device AI — zero API cost is not the same as free"
date: 2026-06-12
slug: the-economics-of-on-device-ai
excerpt: "On-device AI eliminates the per-request API cost. It does not eliminate the engineering cost, the device cost, or the capability cost. Here is the actual unit economics."
tags: [on-device, ai, economics, unit-economics, ios, dailyvox]
---

"On-device AI is free" is the marketing line. The actual economics are more nuanced. Eliminating the per-request API cost is significant, but it shifts costs to other parts of the system — engineering work, device-tier requirements, capability ceilings, and the user-acquisition cost of an app that requires a recent iPhone.

Here is what the unit economics actually look like for a privacy-first on-device AI app, and where the on-device path wins or loses against the cloud alternative.

## the obvious win: per-request cost

A typical journaling app using OpenAI's cloud APIs spends roughly:

```
transcription (Whisper)    │ $0.006 per minute of audio
sentiment + entity (GPT-4o)│ $0.005 per entry
weekly digest              │ $0.02 per user per week
monthly digest             │ $0.06 per user per month
                            │
typical heavy user/year     │ ~$15-25 in API costs
typical median user/year    │ ~$3-6 in API costs
```

For a free app, this cost has to come from somewhere — premium tiers, ads, sponsor revenue, or VC subsidy. For a $5/month subscription app, $3-6 of API cost per user is meaningful margin compression. For a $1/month or free app, the API cost makes the unit economics impossible at scale.

On-device, all of these costs are zero. The user's device does the inference. The marginal cost of running the model is the user's electricity and battery, not the developer's API budget.

## the less obvious cost: engineering

Building an on-device AI app costs more in engineering than a cloud-based equivalent. The differences:

```
work item                       │ cloud version    │ on-device version
─────────────────────────────────────────────────────────────────────
basic transcription             │ 1 day            │ 5 days (handle SFSpeechRecognizer gotchas)
sentiment analysis              │ 1 day            │ 5 days (calibrate NLTagger, handle gotchas)
entity extraction               │ 1 day            │ 3 days
topic clustering                │ 2 days           │ 8 days
weekly digest generation        │ 1 day            │ 6 days (chunking, hierarchical sumarisation)
encrypted sync                  │ 2 days           │ 15 days (per-user keys, CloudKit + AES-GCM)
total                           │ ~8 days          │ ~42 days
```

The on-device version takes roughly 5x longer to build for similar capability. For a solo developer, that is 4-6 weeks of additional work. For a small team, it is multiple person-months.

This upfront cost is the moat. Most developers will not pay it. The ones who do produce products that competitors cannot easily clone — because cloning would require paying the same upfront cost.

## the device-tier requirement

On-device AI requires recent device hardware. The capability cutoff:

```
device                  │ on-device AI capability
─────────────────────────────────────────────────────────
iPhone 12 / iPad Air 4  │ minimal — basic transcription, sentiment
iPhone 13 / iPad mini 6 │ acceptable — full NLP, slow summarisation
iPhone 15 / iPad Pro M2 │ good — full foundation models, fast inference
iPhone 16 Pro / M3+     │ excellent — best foundation model performance
```

A journaling app that relies on Apple Foundation Models for synthesis requires roughly iPhone 15 or newer for the full experience. Older devices fall back to limited summarisation or no summarisation.

The user-acquisition impact: roughly 35% of active iPhones globally are older than iPhone 15. The on-device app's addressable market is the 65% who have the newer hardware. The cloud-based equivalent works on every iPhone going back to iPhone 8.

For an app targeting the privacy-conscious user, this trade-off is acceptable — privacy-conscious users tend to have newer devices anyway. For a mass-market app, the device cutoff is a meaningful limitation.

## the capability ceiling

The on-device foundation model in 2026 is capable but not GPT-4o-level. The gap shows up in specific tasks:

```
task                          │ on-device     │ GPT-4o
─────────────────────────────────────────────────────────────
single-entry sentiment        │ excellent     │ excellent
named entity extraction       │ excellent     │ excellent
weekly digest                 │ very good     │ excellent
annual summary (long context) │ limited       │ excellent
cross-source synthesis        │ limited       │ excellent
novel insight generation      │ adequate      │ very good
```

For 80% of the journaling use cases, the on-device model is sufficient. For the long-context 20% (year-end summaries, cross-source synthesis), the cloud model is meaningfully better. Apps that need both capabilities have to decide whether to accept the on-device limitations or offer a cloud-upgrade path that compromises the privacy claim.

## the user-acquisition cost

Privacy-first apps have a specific marketing problem: the privacy benefit is invisible to most users until they need it. A user comparing journaling apps in the App Store sees feature lists, screenshots, prices. The "your data never leaves your phone" label is a tiny line item that most users do not weigh.

The result is that privacy-first apps have higher organic conversion among privacy-conscious users (who actively seek them out) and lower organic conversion among the general population (who would rather have the cloud features).

The CAC for a privacy-first app is roughly 1.5-2x the CAC for an equivalent cloud-feature app, because the addressable market is smaller and the privacy message requires more education to land.

This is a real cost. The on-device app pays a marketing premium that the cloud app does not.

## where on-device wins economically

Three scenarios where the on-device economics are clearly better.

**High-volume free or low-priced apps.** Anything where the per-user revenue is below $20/year and the user generates more than a few cloud requests per week. The cloud API cost eats the margin. The on-device path has no marginal cost.

**Apps with strict privacy positioning.** Anything where the user would not use the app if the data were cloud-processed. Mental health, finance, intimate journaling, health records, legal notes. The cloud path is structurally not viable. The on-device path is the only path.

**Apps with long user lifetimes.** A user who uses the app for 5 years generates a lot of cumulative requests. The cloud path's costs compound. The on-device path's costs are paid upfront (engineering) and stay flat.

## where cloud wins economically

Two scenarios.

**Apps with short user sessions and high churn.** The cloud cost per user is low because the user does not stick around long enough to accumulate cost. The on-device engineering investment is wasted on users who churn in week one.

**Apps that need cutting-edge capability.** Anything where the on-device model's capability gap is the difference between a useful product and a useless one. Some agentic workflows, complex multi-step reasoning, very-long-context analysis.

## the read for builders

Three questions to ask before choosing the architecture.

**Is privacy a differentiator or a feature?** If users would buy the app for the privacy alone, on-device is the right path. If privacy is one feature among many, on-device may be over-investment.

**What is the cumulative cloud cost per user?** Model the cost for a heavy user over 3 years. If it exceeds 30% of expected revenue, the on-device path is economically better. If it is under 10%, the cloud path is fine.

**What is your engineering bench?** On-device AI requires iOS-specific expertise (CryptoKit, NLTagger, WidgetKit, AppIntents, foundation models). If your team does not have it, the on-device path is much harder. If they do, the on-device path is the moat.

## the close

On-device AI is not free. The marginal cost is zero, but the engineering cost is real, the device-tier cost is real, the capability gap is real, the marketing premium is real.

The economics work for specific app categories — privacy-first, high-volume, long-lifetime. The economics do not work for every app. The honest analysis is to model the costs for your specific case rather than assuming "on-device means free."

For DailyVox, the on-device path is correct. The privacy is the entire value proposition. The cloud path would invalidate the product. For most other apps, the answer depends on the math.

Do the math. Pick the architecture. Build for the choice you made.
