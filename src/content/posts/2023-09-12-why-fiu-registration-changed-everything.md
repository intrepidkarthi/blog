---
title: "why FIU registration changed everything for Indian crypto"
date: 2023-09-12
slug: why-fiu-registration-changed-everything
excerpt: "The March 2023 gazette that brought VDAs under PMLA was the largest structural change to Indian crypto since the 2020 court reversal. Most of the market still has not absorbed what it means."
tags: [india, crypto, regulation, fiu, pmla, compliance]
---

In March 2023, the Government of India brought "virtual digital asset" transactions under the Prevention of Money Laundering Act, 2002. Every VDA service provider operating in or for the Indian market — exchanges, custodians, brokers, wallet providers — became a *reporting entity* under PMLA. They are required to register with the Financial Intelligence Unit (FIU-IND) and comply with the same KYC, transaction-monitoring, and suspicious-activity-reporting obligations that banks have lived under for two decades.

This was the largest structural change to Indian crypto since the 2020 Supreme Court ruling. Most of the market still has not absorbed what it means.

## what the notification actually does

The gazette notification of March 7, 2023 amended PMLA to include eight specific activities as "designated business or profession":

```
1. exchange between virtual digital assets and fiat
2. exchange between one or more virtual digital assets
3. transfer of virtual digital assets
4. safekeeping or administration of virtual digital assets
5. financial services related to issuer's offer/sale of VDAs
6. participation in financial services related to VDA offers/sales
7. custody of instruments enabling control over virtual digital assets
8. issuance of virtual digital assets
```

Any business in India performing any one of these activities is a reporting entity. The threshold is *zero* — there is no minimum transaction size below which the obligations do not apply. The obligation kicks in on incorporation, not on volume.

The list is broad enough that it covers every plausible crypto business model. Custody-only services are in. Token issuance is in. Even the "I run a Telegram bot that trades for users" model is in, because it involves participation in transfer of VDAs.

## what registration requires

The compliance stack is the same as for banks under PMLA. The execution is harder for crypto operators because most of them are not built for it.

```
KYC                  │ full Aadhaar-eKYC or video-KYC for every customer
transaction monitor  │ rule-based alerts on size, velocity, counterparty
SAR filing           │ suspicious activity reports to FIU within strict windows
CTR filing           │ cash transaction reports above thresholds
record retention     │ minimum 5 years on all transaction data
principal officer    │ a named compliance officer accountable to FIU
internal audit       │ periodic compliance audit by independent party
```

For a bank, this is standard operating cost. The bank already runs core banking with KYC built in. For a crypto exchange that grew during 2020-2022 with light-touch KYC ("upload PAN, get verified in 4 hours"), every line of this list is a significant rebuild.

The cost is real. A mid-size Indian crypto exchange needs roughly ₹3-8 crore per year in incremental compliance costs to meet FIU obligations — covering the technology, the compliance team, the legal review, the audit. For exchanges with thin operating margins (most of them, post-TDS), that cost is the difference between surviving and not.

## why offshore exchanges got hit hardest

The notification applies to any VDA service provider with users in India, regardless of where the entity is incorporated. The interpretation has been that an offshore exchange (Binance, KuCoin, Bybit) accepting Indian users without FIU registration is operating in non-compliance.

Most offshore exchanges had not registered as of mid-2023. They were operating on the prior assumption that Indian regulatory reach did not extend to them. The FIU registration framework explicitly changed that assumption. The enforcement is still building.

The likely playbook from here: warning notices, then payment-rail interdiction (UPI, IMPS blocks for transfers to offshore exchange wallets), then app store interventions to remove the offshore exchange apps from Indian Play Store and App Store. The infrastructure for each of these enforcement steps exists. Whether the regulator chooses to use it on a particular timeline is the only question.

## what changed for Indian-registered exchanges

The Indian-registered exchanges — CoinDCX, CoinSwitch, WazirX, Mudrex, ZebPay, and the newer entrants — have largely registered with FIU. They have absorbed the compliance cost. They are now operating under bank-like reporting obligations.

This sounds like a burden. In aggregate, it is also a moat. An Indian exchange with full FIU registration and rebuilt compliance stack is now operating in a regulatory band that offshore competitors cannot easily enter — because entering it requires building the same compliance infrastructure for the Indian market that domestic players have already built.

The 2022 TDS was a tax that hurt all Indian crypto equally. The 2023 FIU notification is a compliance obligation that hurts the unregistered (mostly offshore) far more than the registered (mostly domestic). The structural advantage has shifted toward Indian-registered exchanges in a way that will become visible over the next 12-24 months.

## what the traders do not yet realise

Indian retail traders, after the 2022 TDS, moved much of their volume to offshore exchanges to avoid the 1% drag on each trade. The arbitrage was simple: offshore exchanges did not deduct TDS at source, so the trader took the position that the tax was their problem to manage at year-end (and most did not).

The 2023 FIU framework changes that arbitrage. If the offshore exchanges get cut off from Indian payment rails — which is the direction of travel — the traders' INR cannot reach the offshore exchange in the first place. The arbitrage closes. Volumes return to Indian exchanges, which are now compliant and high-cost, with TDS withheld at source.

The traders who pre-positioned on Indian exchanges before the cutoff get the cleanest UX. The traders who waited until offshore access broke pay higher fees, get worse fills, and discover that their year-end tax reconciliation is suddenly much harder than they had assumed.

## the structural read

PMLA inclusion is the start of "real" regulation, not the end. The next step is a VDA-specific licensing regime — probably modeled on Singapore's Payment Services Act or the UK's FCA registration framework. Some of the elements of that framework are already present (FIU registration). The remaining elements (capital adequacy, ring-fencing of customer funds, segregated custody, board composition rules) are visible in the consultation papers.

For operating businesses, the question is not "will this happen." It is "what does the next compliance build cost, and how do we sequence it before the regulator forces the sequence."

For traders, the question is "what fraction of my activity remains compliant once the offshore arbitrage closes."

For both, the change is already underway. The question is the speed.

---

→ Earlier: [the RBI vs crypto exchange timeline — 2018 to today](/writing/rbi-vs-crypto-exchange-timeline)
