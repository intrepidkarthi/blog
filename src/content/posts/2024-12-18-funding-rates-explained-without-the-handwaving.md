---
title: "funding rates, explained without the hand-waving"
date: 2024-12-18
slug: funding-rates-explained-without-the-handwaving
excerpt: "The formula, the cadence, where the money actually goes, and how to read funding as a regime indicator. With real BTC numbers, no analogies."
tags: [crypto, perpetual-futures, funding-rate, trading, derivatives, basis]
---

Most explanations of funding rates start with an analogy. "Imagine renting a house from the market." Imagine nothing. Here is the actual mechanism.

A perpetual futures contract is a derivative with no expiry. That is the whole point — you can hold it forever without rolling. But "no expiry" creates a problem. The contract has nothing forcing its price to track the underlying spot. A regular dated future converges to spot at expiry. A perp has no expiry to converge at.

Funding rate is the convergence mechanism. Every funding interval — 8 hours on most venues, 1 hour on a few — one side of the book pays the other side a small amount, calculated from how far the perp has drifted from spot. The payment makes holding the side that is "too long" (or "too short") relative to spot expensive. The expense closes the gap.

That is the entire model. The rest is plumbing.

## the formula

```
funding_rate = clamp(premium_index + clamp(interest_rate − premium_index, ±0.05%), ±0.75%)
```

Three components, two clamps. Walking through each.

**`premium_index`** is the time-weighted average of `(perp_mark_price − spot_index_price) / spot_index_price` over the funding interval. If the perp trades at 90,180 and spot is at 90,000, that instant's premium is +0.20%. Average that across the interval, you have the premium index.

**`interest_rate`** is a fixed component meant to reflect the carry cost of holding a position. BitMEX, who invented the modern perp in 2016, set it at 0.03% per 8 hours (≈0.01% per hour) for USD-quoted contracts. Most venues copied the number and never updated it. The interest rate is meant to represent the spot/quote carry differential. In practice, with USD and USDT yielding very different things since 2022, this number has very little to do with reality. It still gets used because the math is downstream of it.

**The inner clamp** restricts how far the interest rate can deviate from the premium before it kicks in. The outer clamp caps the funding rate at ±0.75% per interval, which annualises to ±820% — large enough that no real market should ever hit it, small enough that pathological venues cannot bankrupt traders in a single funding event.

For BTC/USDT perp at 90,180 mark, 90,000 spot, premium of 0.20%, the funding rate at the next interval ≈ +0.20%. Longs pay shorts 0.20% of position notional. On a $10,000 long, that is $20 every 8 hours — $60 per day if it stays at this level.

Annualised, sustained funding of +0.20% per 8 hours is roughly 219% per year. That is the number that gets cited in bull-market commentary as "the carry is incredible." It is also the number that ends most overleveraged bull runs.

## where the money goes

Funding is peer-to-peer. The exchange does not pay funding and does not receive funding (with one caveat, below). Longs collectively pay shorts, or shorts pay longs, in proportion to open position size at the funding timestamp. If your position closed two minutes before the funding timestamp, you owe nothing and receive nothing. If you opened two minutes before, you are in for the full payment.

The caveat: the exchange takes its insurance fund's share if the insurance fund holds a position (it sometimes does, after liquidation auctions where the fund inherited residual size). That share is usually less than 0.1% of total open interest and is invisible to most traders. The exchange does not skim funding as revenue. It cannot, structurally — if it did, the convergence math breaks.

## the cadence

Three live cadences in the wild today: 1 hour (some altcoin perps on dYdX and Aevo), 4 hours (a few venues), and 8 hours (the original BitMEX cadence, still dominant). The cadence affects how fast the perp converges and how brutal an extreme funding event is.

Short cadence: smaller per-event payments, faster correction, less profitable to be on the receiving side of a one-shot dislocation.

Long cadence: larger per-event payments, slower correction, occasionally enormous one-shot transfers. The 8-hour cadence is the reason "funding flip" is a real trading event. The entire market trades around the upcoming timestamp because the payment is locked in by who is holding at the cut.

## reading funding as a regime indicator

Funding does two things. It transfers money between counterparties, and it tells you what the consensus position is. The second is the more useful read.

```
sustained positive funding   │ long crowd, willing to pay carry → late-cycle long
sustained negative funding   │ short crowd, willing to pay carry → late-cycle short
oscillating near zero        │ balanced book, low conviction
funding flip                 │ positioning reset, often after a violent move
```

When BTC funding sits above +0.10% per 8 hours for three weeks, the market is long with leverage, and the next macro shock will produce a cascade. When funding is deeply negative and BTC will not go down, you are looking at a short squeeze setup. The signal is dirty — a single venue with weird liquidity can poison the read — but aggregated across the top five perp venues, it is one of the cleanest sentiment gauges in the asset class.

Two historical extremes worth remembering.

**May 2021.** BTC perp funding hit +0.18% per 8 hours on Binance, sustained for a week leading into the crash. Longs were paying roughly $60/day per $10,000 of leverage to stay in. When the cascade started on May 19, funding turned negative within 36 hours and the surviving shorts harvested it on the way down.

**July 2022.** Post-LUNA, post-3AC. Funding sat at −0.05% per 8 hours across the board. Shorts were paying longs to be short, because nobody believed the bottom was in. That was the regional bottom of the cycle.

You cannot trade off funding alone. You can use it as a confirmation gate or a regime classifier inside a strategy. The cleanest use I have seen is combining sustained extreme Fear & Greed with a positioning signal like funding — when sentiment and funding disagree, the disagreement itself is the read.

## the carry trade

Cash-and-carry on a perp is mechanically simple. Long spot BTC. Short the equivalent notional in BTC perp. If funding is positive, the short side collects funding every interval, the spot side is delta-neutral to the perp, and the net position earns the funding rate with no directional risk.

The trade has three real risks. One: spot/perp basis can blow out faster than funding can clear it (rare, but happened in March 2020). Two: the exchange holding the perp can become insolvent (FTX). Three: regulatory action against the venue can lock your collateral overnight.

For most of 2021, the BTC perp basis trade returned 15-25% APR with very tight drawdowns. By 2024 the trade was crowded enough that the returns compressed to single digits, except during brief liquidation events. From here the likely path is a structural background trade — quietly compounding, not exciting, occasionally devastating if the venue catches a cold.

## the takeaway

Funding rate is the mechanism, not the signal. The signal is what the rate tells you about positioning. The mechanism is plumbing that runs every 8 hours on most of the dollar volume in crypto, and it has been running, more or less unchanged, since 2016.

If you read funding to time entries, look at the rate of change, not the level. If you hold a position through a funding cut, know what side of the transfer you are on and whether the carry is paying you or charging you. If you build a system that uses funding as an input, aggregate across at least three venues — single-venue funding has too much idiosyncratic noise to be a clean read.

---

→ Previous: [anatomy of a perpetual futures matching engine](/writing/anatomy-of-a-perpetual-futures-matching-engine)
→ Next: [liquidation cascades — the 30 seconds after BTC drops 3%](/writing/liquidation-cascades-the-30-seconds-after-btc-drops-3)
