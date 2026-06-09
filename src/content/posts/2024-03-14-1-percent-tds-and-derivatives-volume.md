---
title: "1% TDS and what it did to derivatives volume"
date: 2024-03-14
slug: 1-percent-tds-and-derivatives-volume
excerpt: "The 1% TDS was designed to kill speculation. It killed spot. It barely touched derivatives. Two years in, here is the data and what it means for the next phase of Indian crypto."
tags: [india, crypto, tds, derivatives, regulation, volume]
---

The 1% TDS on every virtual digital asset transaction came into force in April 2022. The policy intent, stated publicly, was to bring transparency to crypto transactions and to discourage speculative trading. The result on spot trading was dramatic — volumes collapsed by 80-90% within two months.

The result on derivatives trading was almost the opposite. Derivatives volume on Indian exchanges grew over the same period, and offshore derivatives volume on exchanges accessed by Indian users grew even faster. The TDS, as written, treats spot and derivatives very differently. Two years in, the divergence is structural.

Here is the data and what it actually means.

## the TDS math on spot vs derivatives

The 1% TDS applies to "transfer of a virtual digital asset." For spot transactions, every buy and every sell counts as a transfer. A trader doing 100 round-trips per year pays 1% TDS on each leg — 200% of the original capital in TDS withholding over a year, regardless of whether the strategy was profitable.

For derivatives, the legal interpretation is messier. A derivative contract is a financial instrument whose value derives from a crypto asset, but the contract itself is not "the virtual digital asset." Some tax interpretations treat the underlying as the relevant asset (TDS applies); others treat the derivative as a separate instrument (TDS does not apply, only the 30% gains tax on net profit at year-end).

In practice, exchanges have taken the second interpretation. Indian-registered derivatives exchanges deduct TDS only on the underlying spot exposure of physically-settled contracts. Cash-settled perpetual futures, which are the dominant retail product, do not incur per-trade TDS. The 30% tax still applies on net gains, but the 1% per-transaction friction does not.

This single regulatory ambiguity has shaped the entire shape of Indian crypto trading since 2022.

## the volume migration

In the two years following the TDS:

```
month         │ Indian spot volume │ Indian deriv volume │ offshore deriv volume
                                                          (Indian users, estimated)
Mar 2022       │ baseline 100%      │ ~0% (negligible)    │ baseline 100%
Sep 2022       │ -85%               │ launching           │ +40%
Mar 2023       │ -88%               │ launching           │ +75%
Sep 2023       │ -90%               │ ~15% of pre-TDS spot│ +120%
Mar 2024       │ -88%               │ ~30% of pre-TDS spot│ +180%
```

The aggregate Indian-user crypto trading volume in early 2024 is roughly two-thirds of pre-TDS levels. The composition has shifted decisively — from spot-dominated to derivatives-dominated, and from onshore to offshore.

The TDS, intended as a speculation deterrent, redirected speculation rather than reducing it. The traders who would have done 100 round-trips a year in spot are doing 100 round-trips a year in offshore perpetual futures. The Indian government collects less tax revenue, the trader takes more execution risk on offshore venues, and the regulatory tools (FIU, PMLA) reach those venues with delay.

## the 2024 onshore derivatives launches

The biggest shift in 2024 is the launch of several Indian-registered crypto derivatives exchanges. Three of them launched between Q3 2023 and Q1 2024, with full FIU registration, INR-margined contracts, and compliance-first architecture.

The product fits the regulatory gap. Indian retail traders want derivatives access. The offshore options are increasingly inaccessible due to enforcement. The onshore products offer derivatives without the 1% TDS friction, with INR margin, with KYC and compliance built in.

Volumes on these onshore derivatives venues are growing 15-30% month-on-month as of Q1 2024. The trajectory suggests that within 12-18 months, Indian-registered derivatives exchanges will be doing comparable volume to what Indian spot exchanges were doing pre-TDS.

The competitive advantage of an onshore derivatives venue, against offshore alternatives, has three pillars.

```
compliance-cleared       │ FIU-registered, can handle Indian KYC properly
INR-native               │ INR margin, INR withdrawals, no FX friction
domestic banking         │ UPI/IMPS for deposits, faster than offshore SWIFT
```

These are durable advantages. They get stronger as the regulatory enforcement against offshore venues intensifies.

## the regulatory ambiguity

The current legal position on TDS-and-derivatives is "the exchanges interpret it this way, the regulator has not pushed back, the position holds until somebody tests it in court or the regulator clarifies."

This is unstable. Two scenarios.

**Scenario 1: regulator clarifies that TDS applies to derivatives.** This would kill the onshore derivatives market the way it killed onshore spot. Volumes would migrate back offshore, with even less regulator visibility than before. Government tax revenue would not increase. The policy goal would be set back further.

**Scenario 2: regulator clarifies that TDS does not apply to derivatives.** This is the more likely outcome because it serves all parties. The onshore market gets clarity. The regulator gets PMLA-compliant venues with full reporting. The tax position is cleaner. Volumes consolidate domestically.

The probability of scenario 1 is meaningfully lower than scenario 2, but it is not zero. The risk is one of the things any Indian crypto derivatives entrepreneur is structurally betting against.

## what this means for the next 24 months

Three predictions, with confidence levels.

**The onshore derivatives market will reach roughly $5-15 billion in monthly notional volume by Q4 2025.** High confidence. The growth rate is consistent and the regulatory pressure on offshore is consistent.

**The TDS-derivatives interpretation will be formalised, in scenario 2's direction, within 24 months.** Medium confidence. The political economy favours formalisation, but the timing is uncertain.

**A meaningful fraction of Indian retail crypto activity will be derivatives-first, not spot-first, within 24 months.** High confidence. The behavioural shift has already happened for the active trading cohort. The HODL cohort will remain spot-dominated, but the active cohort is the one that drives volume.

## the read for builders

If you are building anything Indian crypto-adjacent in 2024, build for the derivatives-first market. The spot market is structurally compressed for the foreseeable future. The derivatives market is structurally growing.

Tools that integrate with derivatives venues — risk management, position sizing, tax reporting, portfolio tracking — are higher-leverage than equivalent tools for spot. Content that helps retail traders manage derivatives positions is more valuable than content that helps with spot. Infrastructure that supports derivatives clearing, custody, or compliance has a larger addressable market than infrastructure for spot.

The TDS killed Indian crypto spot. It did not kill Indian crypto. It redirected it. The redirected market is the one that exists now and the one that will continue to exist.

Build for the market that is, not the one that was.
