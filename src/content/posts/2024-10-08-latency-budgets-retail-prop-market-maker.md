---
title: "latency budgets — retail vs prop vs market-maker, in numbers"
date: 2024-10-08
slug: latency-budgets-retail-prop-market-maker
excerpt: "Retail's order takes 200ms. Prop's takes 5ms. Market-maker's takes 50µs. The gap is what determines which strategies can exist at each tier."
tags: [latency, trading, retail, prop, market-making, infrastructure]
---

A retail trader's market order takes about 200 milliseconds to reach the matching engine. A prop firm's takes about 5 milliseconds. A market-maker co-located in the same data centre as the exchange's matching engine takes about 50 microseconds.

The gap is four orders of magnitude. It determines which strategies can exist at each tier. Retail traders who do not understand the gap try to run strategies that require latency they do not have, lose money to people who do, and conclude that "the market is rigged." It is not rigged. It is just stratified.

Here is the actual ladder, what each budget enables, and where retail can compete.

## the ladder

```
tier             │ end-to-end latency        │ infrastructure
retail (web)     │ 150-300 ms                │ home internet, browser, exchange API
retail (API)     │ 80-200 ms                 │ home internet, REST/WebSocket API
small prop       │ 20-50 ms                  │ cloud VM near exchange region
serious prop     │ 2-10 ms                   │ dedicated server, optimized network
market-maker     │ 50-500 µs                 │ co-located server, kernel bypass
HFT (cross-venue)│ 5-50 µs intra-venue       │ co-location + microwave / fiber arb
```

Each tier is roughly 10x faster than the one above. Each tier costs roughly 10x more to maintain. The cost scales with the latency squared, not linearly — getting from 5ms to 500µs is much more expensive than getting from 200ms to 5ms.

## what each budget enables

**150-300 ms (retail web):** Long-horizon strategies. Anything with a signal half-life of an hour or more is unaffected by this latency. Most retail strategies — buy-and-hold, weekly rebalancing, technical-analysis-based discretionary trading — work fine here.

**80-200 ms (retail API):** Add automated strategies with multi-minute holding periods. Crypto perp trading bots that hold for 5-60 minutes work in this band. Funding-rate harvesting works. Mean-reversion on the hour timescale works.

**20-50 ms (small prop):** Add multi-second strategies. Order-book-aware execution. Some directional momentum strategies. The first tier where reactive trading on news or sentiment events becomes viable.

**2-10 ms (serious prop):** Add sub-second strategies. Order-flow analysis. Most "low-frequency HFT" strategies (the term itself is a contradiction). Quote-driven trading on relatively liquid markets.

**50-500 µs (market-maker):** Real market-making. Quote-and-cancel cycles. Latency-sensitive arbitrage. The tier where being slower than competition is fatal.

**5-50 µs (cross-venue HFT):** Pure arbitrage between exchanges connected by microwave or fiber. Strategies where being 5 microseconds slower than competition is the difference between making money and losing it.

The strategy needs to match the latency budget. Trying to run a market-making strategy on a 200ms retail API connection is not going to work. The book moves while your quote is in transit. Your fill is always adverse selection. The strategy bleeds.

## where retail can compete

Three categories of strategy where retail latency is not the binding constraint.

**Long-horizon directional strategies.** If the signal half-life is 24 hours, your 200ms execution latency is 0.0002% of the holding period. Latency does not matter. What matters is signal quality and position sizing.

**Cross-domain signal strategies.** Strategies that combine data from outside the exchange (Polymarket odds, GDELT news, on-chain flow, regulatory announcements). The signal source itself is slower than 200ms. You cannot be late if the signal arrives in minutes.

**Anti-momentum / mean-reversion on the hour-plus timescale.** Strategies that fade short-term moves with multi-hour holding periods. The fill latency is irrelevant; the entry timing has hours of margin.

The strategies retail *cannot* compete in are the ones where information arrives via the exchange's own order book and the edge is in reacting fastest. Front-running large orders, pure latency arbitrage, market-making — these require latency budgets retail cannot buy at any sane cost.

## the latency you can buy vs the latency you need

Most retail traders, when they learn about latency, think the solution is to spend money on faster execution. This is almost always wrong.

The math: going from 200ms (retail) to 20ms (cloud VM) costs roughly $200-500/month and adds zero edge to the strategies retail typically runs. The 200ms was not the bottleneck. The strategy already worked at 200ms or it did not work at all.

Going from 20ms to 2ms costs roughly $5,000-15,000/month and requires real infrastructure work. This buys you the ability to run prop-style strategies. If you do not have a prop-style strategy in mind, the investment is wasted.

Going from 2ms to sub-millisecond requires co-location, kernel bypass, and dedicated hardware. The monthly cost is $20,000+ and the strategy needs to be specifically designed for the latency tier. This is not a retail investment. It is a small-firm investment.

The right framing: "what is the slowest latency at which my strategy works?" If the answer is "fast enough that retail latency is fine," then the strategy is the right shape for retail. If the answer is "needs sub-millisecond," then retail is not the right tier and you should either find a different strategy or move into a prop role at a firm with the infrastructure.

## practical advice for retail

Three things.

**Pick strategies whose half-life is at least 100x your execution latency.** If your latency is 200ms, your signal half-life should be at least 20 seconds, preferably longer. Most retail signals worth trading have half-lives in the minutes-to-hours range. The constraint binds only for traders chasing short-horizon strategies.

**Optimise for slippage, not latency.** The single biggest hidden cost in retail trading is slippage on entries and exits. A 5-bps slippage on each round-trip, compounded across hundreds of trades a year, dwarfs any latency benefit you could buy. Reducing slippage means smaller positions, better timing, and limit orders instead of market orders.

**Stop trying to compete in HFT-adjacent strategies.** The market is stratified. Trying to run a strategy that requires sub-millisecond latency on retail infrastructure is a guaranteed loss. The competitive strategies for retail are in the 1-second-plus timescale, where retail latency is not the binding constraint.

## the close

Latency budgets are an honest map of which strategies can exist at which tier. Most retail trader frustration comes from running strategies designed for a different tier and concluding the market is unfair. The market is not unfair. The strategy was wrong for the tier.

Pick strategies that fit your latency budget. Stay out of the strategies that do not. The retail traders who do this consistently outperform the ones who keep trying to compete in HFT-adjacent strategies they have no chance of winning.

The market is stratified by infrastructure. Each tier has strategies that work there. Retail is a valid tier. The strategies that work at retail are real and profitable. The strategies that do not work at retail are real and unprofitable. The math is unambiguous.
