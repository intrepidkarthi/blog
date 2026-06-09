---
title: "why backtests lie — survivorship and look-ahead bias in crypto tick data"
date: 2026-04-30
slug: why-backtests-lie-survivorship-look-ahead-bias-crypto
excerpt: "A strategy that prints 300% APR in backtest loses 40% live. Same code, same parameters. The seven biases you didn't model — and how the feaws backtest discipline avoids them."
tags: [crypto, quant, backtesting, data-quality, feaws]
---

The first backtest I ever ran on a crypto strategy returned 287% APR over five years of historical data with a maximum drawdown of 18%. I deployed it with $5,000 and lost 41% in three months.

The strategy did not change. The market did not change. What changed was that the historical data lied to me — and I helped it lie by not asking the right questions.

Here are the seven biases that turn a backtest into a confidence trick. In rough order of severity in crypto specifically.

## 1. survivorship bias

Your historical price series for "altcoins" comes from a snapshot of altcoins that *still exist*. SafeMoon, Luna Classic, FTT, BLUR-on-Blast, every Solana memecoin from January 2024 that is now untradable — those are not in your dataset, because the data provider stopped indexing them after they delisted.

A backtest that says "buy the top-50 altcoins by market cap and hold for 30 days" looks fantastic over 2020-2024. The top-50 from each historical month is computed from the assets *that survived to today*. The losers got filtered out by reality before they got filtered out by your code.

The fix is to use a point-in-time universe: at the start of each backtest period, the set of tradable assets must be exactly what was tradable on that date. Most providers do not ship this. The ones that do (Kaiko, CoinMetrics for the majors) charge for it. The free providers are unusable for any strategy that touches anything below the top 20.

## 2. look-ahead bias

This is the one that humbles experienced quants. You are using a feature in your model — say, a 14-day RSI on BTC. You compute it on each historical bar. The bar at 09:00 UTC on March 14, 2024 has an RSI value. Looks normal.

The bar at 09:00 UTC was computed by your data provider *with the closing price of the previous bar included*. If your data provider revised that closing price afterwards — providers do, when they correct trade errors or get late exchange reports — the RSI you are using in your backtest is the *revised* RSI, not the one a trader would have seen in real time.

The signal looks like it predicts the next bar. It also "predicts" by half-cheating with information that was not visible at decision time.

The fix is point-in-time data. Every value in your historical series must be the value that was visible at that exact timestamp, with no later revision applied. Most providers do not ship this either. Some do (Refinitiv, Bloomberg in TradFi; almost nobody in crypto). For crypto you usually have to record your own tick stream and never revise it. Feaws's data layer is append-only for exactly this reason.

## 3. the slippage lie

Your backtest probably assumes you can sell at the closing price of each bar. If your model says "sell at 17:00:00", your simulator records the trade at 17:00:00's close price.

In real life, your sell at 17:00:00 hits a thin book, walks the asks (or bids) down by some amount, and fills at an average price worse than the close by 5 to 50 basis points depending on size. Multiply that across 1,000 trades a year. The 5-bps assumption compounds to a roughly 50% drag on your reported edge.

The fix is to model market impact explicitly: use the actual order book depth at each historical timestamp (very expensive to store) or a parametric impact model calibrated against real fills (cheap, less accurate). The worst answer is "assume no impact." That answer turns a −5% strategy into a +15% strategy on paper, and discovers reality the day you go live.

## 4. the funding-rate lie

Crypto perp strategies are routinely backtested without modeling funding cost. The trader is long the perp, the simulator marks PnL against price changes, and funding is treated as free money or simply ignored.

In a bull market with sustained positive funding, a long-biased strategy bleeds 0.10-0.30% per day to funding. Over a year, that is a 40-100% drag. A strategy that printed 80% APR in the backtest is barely break-even in production, because the simulator forgot to charge you for the funding you were paying to be long.

The fix is mechanical. Track funding payments in your simulator, mark them against PnL at each interval, and report the funding cost as a separate line item in the backtest output. Funding cost being a separate line item also turns out to be useful for *reading* the strategy — sometimes the alpha is in the directional call, sometimes it is actually a structural carry trade and you did not realise it.

## 5. the latency lie

The backtest assumes your order hits the engine instantly. In production, your signal computation takes 50ms, your network hop is 30ms, your gateway parsing is 20ms, and the engine queues you behind 200 other taker orders that arrived in the same 100ms window. Total round-trip: 200-400ms.

By the time your order fills, the price you wanted is gone. On a strategy whose signal half-life is 5 seconds (most short-horizon signals on crypto), losing 300ms means filling at a price 30-60% worse than the backtest assumed.

Long-horizon strategies (30-day holding period) are mostly immune. Short-horizon strategies (intraday) are destroyed. The right question to ask of any backtested strategy is: "what is the signal half-life, and how does the live latency compare to it?" If half-life is 5 seconds and round-trip is 200ms, you are losing 4% of the signal value. Survivable. If half-life is 200ms and round-trip is 50ms, you are losing 25%. Worth modeling.

## 6. data source divergence

Binance, Coinbase, OKX, and Bybit all report different prices for BTC/USDT at the same second. The difference is usually 5-15 bps but can blow out to 100+ bps during volatility. Your backtest used one source's data. Your production strategy trades on a different source's prices, or on a multi-venue book that is some weighted combination.

The fix is to choose the same source for backtest data as for live trading, or to use a synthetic index that aggregates across venues with the same weights you will use live. Most strategies use Binance data for backtest because it is free and high-quality, then trade on a domestic venue with materially different price action. The strategy that worked on Binance does not necessarily work on Coinbase, on dYdX, or on a domestic perp venue with thinner books.

## 7. the regime-switch problem

2021 was a bull market. 2022 was a bear. 2023 was a recovery. 2024 was a halving-driven push. Each is a different regime, with different volatility, different correlations, different funding behaviour, different microstructure.

A backtest over 2020-2024 is the average of four very different markets. A strategy that worked on average might have lost money for two years out of four. Unless you partition your backtest by regime and check the strategy's performance in each regime separately, you will not know.

The cleanest fix is walk-forward backtesting with explicit regime detection. Hidden Markov Models work well enough for crypto (feaws uses a 5-state HMM for exactly this). The strategy gets reported as performance-per-regime, not just average performance. Strategies that work in one regime and lose money in another get caught at the design stage, not at the deployment stage.

## the discipline

Every one of these biases produces a backtest that looks better than reality. None of them produces a backtest that looks worse. The error is structurally one-sided — which is why deployed strategies almost always underperform their backtests, and why the right prior on any new backtest is "the live performance will be 50% of this."

The feaws discipline is mechanical, not clever:

1. Point-in-time universe and point-in-time features. Append-only data layer with no revisions allowed.
2. Slippage modeled per trade, not assumed away.
3. Funding tracked as a separate PnL line.
4. Signal half-life measured explicitly, latency budget compared to it.
5. Same data source for backtest and live.
6. Walk-forward partitioning by regime.

None of this guarantees the strategy will work live. All of it eliminates the false confidence that the strategy *would* work, when actually it just looked good in the data.

The published backtest in the feaws whitepaper reports 70% directional accuracy at 30 days and 48-55% at 90 days. The 90-day number is barely above coin-flip. Reporting it is the discipline. Hiding it would be the marketing.

If a strategy's backtest looks too clean, the question is not "how do I trust this?" It is "which of the seven biases is making this look better than it will run?" There is always at least one.

---

→ Previous: [liquidation cascades — the 30 seconds after BTC drops 3%](/writing/liquidation-cascades-the-30-seconds-after-btc-drops-3)
→ Next: [the case for publishing your strategy — transparency as edge](/writing/the-case-for-publishing-your-strategy)
