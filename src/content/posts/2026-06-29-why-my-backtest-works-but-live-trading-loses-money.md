---
title: "Why my backtest works but live trading loses money"
date: 2026-06-29
slug: why-my-backtest-works-but-live-trading-loses-money
excerpt: "I took a clean backtest live and the equity curve inverted inside a week. Same code, same market. After watching it happen from both sides of an exchange, I stopped calling it luck. The backtest and the live book are different games, and the gap has a fixed set of causes. Here they are in the order they cost me money."
tags: [trading, quant, backtesting, crypto, feaws]
---

The first time I ran a strategy from a clean backtest into live money, the curve inverted inside a week. Same code, same rules, same market. The backtest pointed up and to the right. The account went the other way. I have watched this happen to enough people since, from both sides of the screen, to stop calling it bad luck. The backtest and the live book are not the same game. The gap between them is structural, and it has a fixed set of causes. Here they are, roughly in the order they have cost me money.

## The backtest already knows the ending

You build a strategy against data that has already happened. Every choice you make, the indicator, the threshold, the holding period, gets made with the answer sitting in the next column. You do not feel yourself fitting to it. You think you are discovering an edge. Often you are just describing the past in a way that flatters it. The live market hands you the same question with the answer column blank, and most strategies have never actually been tested on that version of the question.

## You assumed fills you will not get

A backtest fills you at a price the live market never offers. It assumes you got the mid, or the close, or the exact level your signal printed. Live, you cross the spread. On a perp, the book at your size is thinner than the top-of-book number you were looking at, so a market order walks the ladder and your average is worse than your trigger. Multiply that by every entry and exit and a strategy that looked like it scalped a clean edge is paying a tax it never modelled.

## Fees and funding quietly eat the edge

Run the arithmetic that the backtest skipped. A strategy that nets three basis points a trade sounds fine until you subtract taker fees on both sides and, on perpetuals, funding you pay while the position is open. Three basis points of edge against five of round-trip cost is not a smaller edge. It is a negative one. The backtest reported the gross. You trade the net, and the net is where most edges die.

## Latency decides which trades are even yours

The fill that made the backtest profitable is frequently the one you miss live. By the time your signal computes, your order routes, and the exchange matches it, the level you wanted has moved or been taken. Backtests treat your order as instant and guaranteed. The live queue does not. The trades you lose to latency are not random either, they are disproportionately the good ones, because the good ones are the ones everyone else also wanted.

## Overfitting wears a lab coat

A strategy tuned to the exact parameters that maximised return on your sample is not optimised. It is memorised. If shifting the lookback by one or moving the threshold a hair collapses the result, you fit to noise, not signal. The honest test is out-of-sample data the parameters never saw, and most curves that look beautiful in-sample turn ordinary the moment you hold them to that standard.

## The regime you backtested is already gone

Markets change character. The volatility, the correlations, the way liquidity sits in the book during a 2021 bull run is not the market you are trading now. A backtest over a period that suited your strategy is a measurement of a regime, not a law of nature. When the regime turns, the edge that depended on it turns with it, and the strategy keeps trading as if nothing happened.

## No backtest models the person clicking the button

This is the one I underrated longest. In a backtest, confirmation is obvious because the outcome is already on the chart. In real time, every entry feels uncertain, every drawdown feels like the start of the end, and the uncertainty produces behaviour the code never accounted for. You widen a stop. You skip a valid entry because the last one lost. You size up to make it back. The strategy on paper is disciplined. The person running it is not, and the person is part of the system.

## What I actually do about it now

I spent years building and operating exchange infrastructure, and the clearest thing I took from watching aggregate flow is that almost nobody blows up on the strategy. They blow up on the gap between the strategy and the world. So I treat the backtest as a disqualifier. It can tell me an idea is dead. It cannot tell me an idea is alive.

Before anything goes live, I subtract costs first, because a strategy that only works gross does not work. I test on data the parameters never touched. Then I forward-test it small, with real money, because paper trading removes the one variable that matters most, which is what I do when it is my capital on the line. A few months of live, undersized trading reveals everything the backtest hid, and it reveals it cheaply.

The backtest is a hypothesis. Live trading is the experiment. The losing happens, almost every time, in the distance between the two.
