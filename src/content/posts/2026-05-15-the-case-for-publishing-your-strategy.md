---
title: "the case for publishing your strategy — transparency as edge"
date: 2026-05-15
slug: the-case-for-publishing-your-strategy
excerpt: "Why making your trading strategy public almost never destroys it, and why the edge from publishing usually exceeds the edge you lose. Five claims, one falsifiable test."
tags: [crypto, quant, trading, feaws, philosophy, infrastructure]
---

The standard objection to a public quant strategy is one sentence long: "If you publish it, the edge goes to zero." It is wrong almost always. Here is the actual argument.

## the claim

Publishing a trading strategy — the hypotheses, the signals, the execution rules, the trades themselves — loses you somewhere between 0% and 20% of the strategy's expected PnL. It gains you somewhere between 50% and 500% of the strategy's *strategic* value. The ratio is asymmetric, and the asymmetry compounds.

This is not opinion. It is a position derived from five observations about how trading edge actually works.

## 1. execution is the moat, not alpha

The thing most people call "edge" splits into two things that behave very differently. **Alpha** is the directional view — "BTC will be up over the next 30 days." **Execution** is what you do to translate that view into PnL — sizing, entry timing, slippage management, hedge construction, drawdown management, position rebalancing, the entire operational layer between signal and money.

Alpha decays when published. Execution does not, because execution is unique to the operator. Two traders given the same signal will produce wildly different PnL outcomes. The worse operator might lose money on a winning signal. The better operator might extract 2x what the signal "should" produce.

Renaissance Technologies has published summary descriptions of its trading approach for thirty years. Statistical arbitrage on equities, with short holding periods, model-driven. The description is enough that any quant team in the world could rebuild the alpha. None of them can rebuild Renaissance's PnL — because rebuilding is the easy part, and operating it at scale, year after year, is the hard part. Renaissance survives the published description because the moat was never the description. The moat was the execution.

For a retail quant, the asymmetry is worse. The retail quant has no execution moat. The whole edge is the alpha. So publishing should destroy the strategy completely, right?

It does not, because of points 2-5.

## 2. the audience does not trade the strategy

The people who read a published quant strategy fall into three groups. Most of them are curious — they want to understand the math, they will not trade it. Some are quants — they will read it, file it, and maybe re-implement it for academic interest. A few are retail traders who *want* to trade it.

Of the third group, most cannot. They lack the infrastructure. They lack the discipline to follow the rules. They lack the capital base to absorb the drawdowns required to harvest the long-run edge. The published strategy says "this drawdown can hit 18%; size accordingly." The reader, in the heat of the drawdown, exits at 9% and never re-enters. The strategy worked. The trader did not.

The number of people who can actually trade a published strategy to specification is a tiny fraction of the people who read it. Of that fraction, most will not size meaningfully enough to move the market. Of the remainder — and this is the killer — they are trading *the same signal as you*. Their fills affect prices in the same direction your fills do. Their drawdowns happen at the same time as yours. They are the cohort you are trading alongside, not against.

The "alpha gets arbed away" prediction assumes the readers are a separate, hostile counterparty. They are not. They are a smaller, less-disciplined version of you, mostly inactive, occasionally active in the same direction.

## 3. the legibility filter

To publish a strategy honestly, you have to write it down precisely. The hypothesis must be stated as a falsifiable rule. The signal must be specified to the level where a reader could re-derive it. The execution rule must be deterministic.

Most "edge" does not survive being written down precisely. The trader had a vibes-based intuition that worked. Forced to put the rule on paper, they realise the rule is "buy when I feel like it" and the historical wins were coincidence. The publication process kills the strategy, not the publication itself.

The strategies that survive being written down are the ones that have real structural edge. Publishing forces the filter. Forcing the filter is how you find out whether you actually have a strategy or whether you have a memory of good months.

## 4. the falsification dividend

When a strategy stops working, a private trader can lie to themselves about it. "It is a tough month." "The market regime shifted." "I will wait for the recovery." Months turn into quarters. Capital bleeds. The strategy was broken for a year before the trader admitted it.

A public strategy cannot lie. The trades are visible. The drawdown is visible. When the strategy stops working, the public quarterly update has to say so. The reality check is the value. Private traders escape it. Public strategies do not.

The feaws whitepaper commits in advance: every hypothesis is reviewed at quarterly intervals. If a hypothesis has not produced statistically significant out-of-sample returns by a stated date, it is retired. The commitment is the dividend. Without it, the trader's natural bias toward not-killing-their-own-darlings would extend dead strategies for years.

## 5. the second-order effects

A published strategy gets read by people who matter to your career. Other quants. Founders. Investors. Journalists. Future employees. Regulators. The published artifact is, secondarily, a credential.

The credential effect, for a retail or boutique quant, often exceeds the trading edge in dollar value. The trader who publishes a real strategy with real trades for two years builds a credential that gets them hired into senior positions, gets them funded for a fund of their own, gets them invited to advise on infrastructure they would not have been invited to advise on otherwise. None of that shows up in the trading PnL line.

For a venue or an exchange, the second-order effect is structural marketing. A publicly running quant strategy on the venue is proof-of-life. The trades clear. The infrastructure holds. The math is sound. None of that requires advertising. The trades are the ad.

## what publication does cost you

Three real costs:

- **One-shot opportunities.** If the strategy depends on a brief window of dislocation that you would otherwise quietly trade, publishing tells competitors about the window and shortens it. This matters for very-short-horizon execution strategies. It does not matter for most factor or carry strategies, which have multi-month edges that do not compress when read.

- **Counterparty selection.** If you trade against undiscriminating retail liquidity, telling retail what you do is a self-inflicted wound. Most cross-domain or factor strategies do not trade against retail in a competitive way; they trade against the market's overall pricing of some risk. Publishing does not change the population of counterparties for those strategies.

- **Privacy.** Your position size, your drawdowns, your worst weeks — all of it becomes public. For a fund this is a structural problem (investor relations gets harder during drawdowns). For an individual it is a tolerance issue. Some people can stomach the visibility. Most cannot. The cost is real; whether it is worth paying depends on the trader.

## the feaws case

Feaws publishes the whitepaper, the hypotheses, the trades, the PnL, the failure modes. Two years in, the strategy still works. The number of copycats is small. The strategy's edge is intact. The credential value of the public artifact already exceeds the strategy's lifetime PnL by an order of magnitude — measured by job offers, advisory invitations, and the number of conversations with the kinds of people whose conversations compound.

The closed-system version of the same strategy would have produced the same PnL and none of the second-order returns. The open version produces both. The asymmetry compounded.

## the falsifiable claim

If publishing a real edge destroyed it, the published-edge corner of the quant world would be empty. It is not. The Two Sigmas, the AQRs, the academic factor literature, the Quantopian-era strategy libraries all publish enough that the alpha is reproducible in principle. None of them got arbed away. The ones that died died for other reasons — regime change, infrastructure failure, capital flight.

The next time someone tells you "if you publish your strategy, the edge goes to zero," ask them to name one strategy that died because it was published. They will not be able to name one. The cases they are thinking of are strategies that died for unrelated reasons and were retroactively blamed on publication.

Publish.

---

→ Previous: [why backtests lie — survivorship and look-ahead bias in crypto tick data](/writing/why-backtests-lie-survivorship-look-ahead-bias-crypto)
→ Series start: [feaws — the quant lab is public, and so is the math](/writing/feaws-whitepaper-explained)
