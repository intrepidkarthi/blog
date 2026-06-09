---
title: "position sizing for retail — the math no one shows you"
date: 2024-02-25
slug: position-sizing-for-retail-the-math
excerpt: "Most retail traders have heard 'size your positions properly.' Nobody has shown them the math. Half-Kelly, the drawdown ceiling, and why 5% feels safe but isn't."
tags: [crypto, trading, position-sizing, risk, kelly, retail]
---

Most retail traders have heard "size your positions properly." Nobody has shown them the math. The result is a category of trader who thinks 5% per position is conservative and 25% is aggressive, with no formula behind either number.

Here is the formula behind both. It has been published since 1956. It is called the Kelly criterion. It is not complicated.

## the Kelly formula

```
f* = (b·p − q) / b

where
  f* = fraction of bankroll to bet
  b  = net odds received on a win (e.g., 1 means even money)
  p  = probability of winning
  q  = probability of losing (1 − p)
```

For a 55% win-rate trade with a 1:1 reward-to-risk ratio: `f* = (1·0.55 − 0.45) / 1 = 0.10`. Bet 10% of bankroll.

For a 60% win-rate trade with a 2:1 reward-to-risk: `f* = (2·0.60 − 0.40) / 2 = 0.40`. Bet 40% of bankroll.

That second number scares people, and it should. Full Kelly is the maximum geometric growth rate. It is also the *maximum drawdown you will accept* for that growth rate. Empirically, full Kelly on a strategy with realistic estimation error produces drawdowns that almost no retail trader can stomach.

## why half-Kelly is the actual default

The practical default for retail is half-Kelly. You compute the Kelly fraction, divide by two, and use that.

```
half-Kelly on the 60% / 2:1 trade   │ 20% of bankroll per position
half-Kelly on the 55% / 1:1 trade   │ 5% of bankroll per position
```

The half-Kelly choice is not arbitrary. It comes from the geometric-growth literature. At full Kelly, the expected growth rate is maximised but the variance is enormous and small estimation errors compound badly. At half-Kelly you give up roughly 25% of expected growth in exchange for roughly 50% less variance. The risk-adjusted return improves substantially.

For crypto, where regimes shift fast and edge estimates degrade, *fractional* Kelly at one-quarter or one-third is often better than half. Many quant funds run at quarter-Kelly through volatile regimes precisely to avoid the catastrophic-drawdown tail.

## the drawdown math

Position size is not just an expected-return question. It is a survival question. The relevant statistic is the *probability of catastrophic drawdown*.

For a strategy with edge but realistic variance, betting 25% per position will produce a drawdown of -50% or worse in roughly 1 of every 8 cycles. Betting 10% per position produces the same drawdown in roughly 1 of every 60 cycles. Betting 5% per position produces it in roughly 1 of every 500 cycles.

The math compounds badly the other way too. A trader who experiences a 50% drawdown needs a 100% gain to recover. A 75% drawdown needs a 300% gain. The asymmetry between drawdown and recovery is the reason position sizing dominates strategy selection for long-term outcomes.

## why 5% feels safe but is not

5% per position sounds conservative. With 20 positions open, it is 100% allocated. With correlated positions — say, 10 different altcoin longs in a crypto bull market — the effective bet is 100% on "crypto goes up." The diversification is illusory. The drawdown on the next macro shock is proportional to the total allocation, not the per-position allocation.

The fix is to size by *correlated bucket*, not by individual position. If your altcoin positions all move together, size them as a single position. 5% on each of 10 altcoin longs is structurally a 50% single bet, not a 5% one. Most retail traders never do this calculation. The bucket math is the difference between feeling diversified and being diversified.

## why 25% feels aggressive but might not be

A trader running half-Kelly on a high-edge strategy might legitimately size positions at 20-30%. The math supports it *if* the edge is real. The catch is that retail traders almost never have edge estimates as reliable as their position sizes assume. Half-Kelly on a misestimated edge can be worse than full-Kelly on a true edge.

The robust answer is to use a tighter Kelly fraction (quarter-Kelly, eighth-Kelly) precisely because the edge estimate is uncertain. Less aggressive sizing protects against estimation error. The cost is foregone growth in the rare case the edge is real and large; the benefit is survival in the more common case the edge is smaller than estimated.

## position sizing as risk control

The framing most retail traders miss is that position sizing is the *risk control mechanism*. Stop-losses are downstream. Diversification is downstream. The single decision that dominates long-run survival is *how much of the bankroll is at risk on each trade*.

A trader with mediocre alpha and disciplined position sizing outperforms a trader with strong alpha and aggressive position sizing, in expected outcome, over decades. The math is brutal and not optional. The traders who survive multiple cycles are not the ones with the best calls. They are the ones who never bet too much on any single call.

## a falsifiable claim

If you are currently sizing positions by gut feel — "this feels like a 10% conviction trade" — you will underperform a mechanical half-Kelly system by 30-50% in geometric returns over five years. The mechanical system makes no judgment calls. It just sizes by the formula given the same win-rate and reward-to-risk estimates. You can run the comparison on your own trade history. The mechanical system will win.

That is not because the formula is magical. It is because you, like every retail trader including me, override your sizing under stress in ways that are systematically too large in confident moments and too small in uncertain ones. The formula does not override. The formula is the only thing in the trading stack that does not change shape with how you feel today.
