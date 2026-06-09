---
title: "funding rate arbitrage in practice — what 18 months of running it actually looks like"
date: 2025-07-15
slug: funding-rate-arbitrage-in-practice
excerpt: "The basis trade is mechanically simple. The execution is not. What 18 months of running it actually produced, with the numbers and the inconvenient parts."
tags: [crypto, funding-rate, basis-trade, perpetual-futures, arbitrage, trading]
---

The cash-and-carry trade on a perpetual futures contract is mechanically simple. Long spot BTC, short the equivalent notional in BTC perp. If funding is positive, the short side of the perp collects funding payments every 8 hours, the spot side is delta-neutral, and the net position earns the funding rate with no directional exposure to BTC's price.

I have been running variants of this trade since early 2024. The results are not the textbook results. The textbook treatment makes the trade sound clean and printer-like. The actual experience involves multiple inconvenient frictions that compound to produce a meaningfully lower realised return than the theoretical one.

Here is what 18 months of running funding-rate arbitrage actually produced.

## the textbook trade

The textbook math:

```
long spot BTC at $90,000     │ delta +1 BTC
short BTC perp at $90,180    │ delta -1 BTC
                              │ net delta: 0

funding rate: +0.10% per 8h  │ shorts collect from longs
8h funding income            │ +0.10% on notional
annualised funding income    │ ~109% (compounded)
```

If funding stays at +0.10% per 8 hours, the trade earns roughly 100% annualised on the perp notional, with no directional exposure to BTC. This is the headline number. It is also misleading.

## the unit economics in practice

The actual return depends on costs that the textbook treatment usually omits.

```
gross funding income (avg sustained +0.05% per 8h)    │ +55% APR
exchange fees (entry + exit, both sides)              │ -0.4%
basis-rebalance costs (weekly)                        │ -2%
borrowing cost (for spot side, if leveraged)          │ -3 to -6%
opportunity cost on collateral                        │ varies
slippage on entry/exit                                │ -1 to -3%
funding-flip windows (forced exits)                   │ -2 to -5% per occurrence
                                                       │
net realised return                                    │ +30 to +45% APR
```

The +30-45% APR figure is the honest range across 18 months. It is meaningfully lower than the +55% theoretical figure. It is also meaningfully higher than what any conventional fixed-income product produces, with risks that are different but not obviously worse.

## the infrastructure required

The trade is not runnable from a retail account. The infrastructure stack:

```
spot venue          │ a reliable exchange with deep BTC liquidity
perp venue          │ the venue with the most consistent funding history
                     │ (sometimes a different exchange than spot)
inter-venue rails   │ ability to move USDT or USDC between venues quickly
risk system         │ monitors delta, mark prices, and liquidation distance
rebalancer          │ adjusts perp position size as funding accrues
margin manager      │ tops up or withdraws margin as needed
funding tracker     │ projects funding income and flags regime changes
```

Each of these is its own engineering investment. Running them manually does not scale past a few thousand dollars of notional. Running them automated requires multiple weeks of build time and ongoing maintenance.

The retail trader who wants to "just do the basis trade" without this infrastructure ends up losing the trade to the operational friction. The trade is real. The trade is not free.

## the inconvenient frictions

Three frictions that compound to eat the theoretical return.

**Funding regime shifts.** The trade requires positive funding. When funding flips negative (bear market, deleveraging events, post-crash repositioning), the trade reverses sign — the short side now pays funding to the long side. The operator either exits the trade or accepts negative carry until the regime flips back. Either choice has cost. Funding-regime shifts happen several times per year and cost the trade roughly 5-15 percentage points of annualised return per occurrence.

**Basis rebalancing.** As the spot price moves, the dollar value of the spot position changes relative to the perp position. The hedge gets out of balance. Rebalancing requires buying or selling small amounts of spot or perp to restore delta-neutrality. Each rebalance costs slippage and fees. Weekly rebalancing costs roughly 1.5-3% per year in aggregate.

**Inter-venue capital movement.** USDT and USDC moving between exchanges takes minutes to hours and incurs withdrawal fees. When one exchange becomes unattractive (funding drops, fees rise, banking issues emerge), shifting the position to a different venue costs both time and money. The operational drag is real.

## the May 2021 lesson

The May 19, 2021 BTC crash was a stress test for funding-rate arbitrage operators.

In the 48 hours before the crash, funding rates on BTC perps were at multi-month highs (+0.18% per 8 hours on Binance, +0.15% on Bybit, similar elsewhere). The crowd was extremely long. The basis trade was paying spectacularly.

During the crash itself, two things happened. First, funding flipped to negative within 36 hours as longs liquidated and the crowd flipped short. Second, the spot/perp basis blew out on several venues — perp prices fell faster than spot — which produced a temporary mark-to-market loss on the short-perp leg of the basis trade.

The operators who held through the May 19 event netted positive on the overall trade because the funding income before the crash was so high. The operators who closed at the worst point of the basis dislocation locked in losses. The difference between the two outcomes was not strategy. It was operational discipline.

The lesson: the basis trade is only safe in expectation. In any specific stress event, the operator's hands matter.

## the FTX lesson

November 2022: FTX collapsed. Operators with basis-trade positions on FTX lost their entire position. The notional that was on FTX is gone. The fact that the strategy was directionally neutral does not matter. The exchange counterparty risk was the real exposure.

After FTX, funding-rate arbitrage operators consolidated around two or three venues that have meaningful insurance funds, proven solvency, and regulatory standing. The post-FTX yield is lower (because the venue selection is narrower and competition for positions is higher) but the exchange risk is materially lower.

The lesson: the basis trade is short the spread between perp and spot, but it is also long the exchange's solvency. The second exposure is invisible until it is not.

## when to scale up, when to step back

Three rules I have developed over 18 months.

**Scale up when funding is sustained and regime is stable.** A funding rate above +0.08% per 8 hours sustained for two weeks, in a regime where the broader market is not stress-testing leverage, is a window where the trade earns its theoretical return. These windows happen 3-6 times per year. Most of the year's return comes from them.

**Step back when funding is volatile or near zero.** A regime where funding oscillates between +0.02% and -0.05% is not worth running. The frictions exceed the gross income. The capital is better deployed elsewhere or held in lower-risk yield products until the funding regime normalises.

**Exit aggressively before known stress events.** Pre-announced events that historically trigger deleveraging (Fed meetings, major regulatory deadlines, large token unlocks) are predictable times when funding regime can flip violently. The trade should be reduced or closed before such events and re-entered after. The conservatism costs some return; the avoided drawdowns more than compensate.

## the close

Funding-rate arbitrage is a real trade with real returns. It is not a printer. The 18-month realised return is meaningfully positive but below what the textbook math suggests, after honest accounting for frictions, regime shifts, and stress events.

The trade is worth running for operators with the infrastructure and capital to do it properly. It is not worth running for retail traders without that infrastructure. The retail version of the trade (manual entry, no rebalancer, single venue) is almost always net negative.

If you are considering the trade, build the infrastructure first or do not enter. The infrastructure is what determines whether the theoretical return becomes a realised return. The strategy is downstream of the operational layer. The textbook treatment that omits the operational layer is the version that produces the losses.
