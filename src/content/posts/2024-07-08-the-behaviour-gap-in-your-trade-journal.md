---
title: "the behaviour gap — measure it in your own trade journal"
date: 2024-07-08
slug: the-behaviour-gap-in-your-trade-journal
excerpt: "Dalbar's 2014 study found the average mutual fund investor underperformed the fund itself by 7.25%. The gap is real and the gap is in your trade journal. Here is how to find yours."
tags: [trading, psychology, behaviour-gap, journaling, retail]
---

In 2014, the Dalbar Quantitative Analysis of Investor Behaviour reported that the average mutual fund investor returned 3.79% per year, against the average mutual fund returning 11.04%. The gap — 7.25 percentage points — was called the *behaviour gap*. It is the cost of the investor's own decisions, measured against the fund the investor was actually invested in.

The methodology has been criticised (and partly corrected in later editions) but the central result has held up across studies and asset classes. Investors persistently underperform their own holdings. The gap is real. The gap is bigger in higher-volatility assets, which is to say it is *enormous* in crypto.

You can measure your personal behaviour gap from your own trade journal. Most retail traders never do. Once you do, you stop arguing with the result.

## the calculation

```
fund return       │ what the asset (or strategy) returned, point-in-time
investor return   │ what you actually earned, weighted by when you held
behaviour gap     │ fund return − investor return
```

For a single asset over a year, the calculation is straightforward. The asset returned X%. Your account, holding the asset for some subset of the year and at varying position sizes, returned Y%. The gap is X − Y.

For a portfolio of assets it is messier but the same idea. The benchmark is *what your portfolio would have done if you had not traded it*. The realised return is what your actual buying and selling produced. The gap is the cost of your activity.

## what the gap reveals

The behaviour gap decomposes into recognisable sources.

```
over-trading           │ excess fees and slippage from too many round-trips
panic exits            │ selling at -X% during drawdowns, missing recovery
FOMO entries           │ buying near tops because everyone else is buying
size drift             │ scaling up positions after wins, down after losses
hold-too-long          │ riding losers because the thesis felt right
sell-too-early         │ exiting winners because the gain felt like enough
```

Each component has a measurable cost. Each component has a fix that is mechanical, not psychological.

## what to log per trade

The minimum trade journal entry is six fields. Most retail traders log two and wonder why their post-trade analysis is useless.

```
1. entry date and price
2. exit date and price
3. position size (% of bankroll, not absolute)
4. thesis (one sentence — why you entered)
5. exit reason (stop, target, manual, news)
6. emotional state at exit (calm, panicked, confident, regretful)
```

The sixth field is the one that makes the journal useful. It is also the one most traders skip. Without it you cannot distinguish a *process error* from an *outcome error* — and that distinction is the entire benefit of journaling.

## process error vs outcome error

A process error is a trade where you violated your own pre-committed rules. Bought too big. Held past the stop. Entered without a thesis. The outcome of a process error is irrelevant — a winning process error is still a process error. The point is the rule violation, not the result.

An outcome error is a trade where you followed your own rules and lost money anyway. Outcome errors are not errors. They are the cost of trading a strategy with imperfect win-rate. You do not need to "fix" an outcome error. You need to confirm that the rule still works in expectation.

The traders who improve over time are the ones who count process errors and ignore outcome errors. The traders who do not improve are the ones who do the opposite — obsessing over losing trades that followed the rules and excusing winning trades that violated them.

## the annual reconciliation

Once a year, sit down with the journal. For each closed trade, mark process or outcome error, and compute three numbers.

```
process-error rate       │ % of trades that violated your rules
process-error cost       │ total $ lost on those trades
behaviour gap            │ your return − benchmark return
```

The first two numbers tell you which rules you need to enforce harder. The third number tells you the size of the problem you are solving.

A retail trader with a process-error rate above 30% has bigger problems than alpha generation. The math says: get the rate below 10% and the alpha takes care of itself. Get the rate below 5% and you start outperforming most of the funds in your category, because most funds also have process-error rates well above 5%.

## why this works

The behaviour gap exists because emotion overrides plan at the moment of action. The plan was made calmly. The action is taken under stress. The mismatch is the gap.

A trade journal closes the loop. Writing down what you did at the moment of action creates a record that is harder to lie to than memory. The annual review against that record forces you to confront the cost of the lies. Over time, the act of knowing you will write it down changes the behaviour at the moment of action.

That is the meta-feature of journaling. Not the data. The reflexive change in your behaviour caused by knowing the data will exist.
