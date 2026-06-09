---
title: "liquidation cascades — the 30 seconds after BTC drops 3%"
date: 2025-08-08
slug: liquidation-cascades-the-30-seconds-after-btc-drops-3
excerpt: "The first 30 seconds after a 3% spot move on BTC, second by second. The liquidation engine, the insurance fund, auto-deleveraging, and why the cascade is structural, not panic."
tags: [crypto, perpetual-futures, liquidation, risk, trading]
---

On May 19, 2021, the BTC perpetual futures market liquidated about $8.7 billion in 24 hours. Most of that happened in the first 30 minutes. Most of *that* happened in the first 30 seconds.

What does the cascade actually look like, second by second, inside the venue?

## t=0: spot prints down 3%

A large seller hits spot. A fund derisking, a stablecoin desk rebalancing, a hot wallet draining — the cause does not matter for what comes next. Spot moves from 65,000 to 63,050.

```
spot                63,050   (was 65,000, −3.0%)
perp mark           ???
perp last           ???
```

## t=0.05s: the perp basis widens, then crashes back

Perp price reacts to the spot move with a small lag — there are always tighter perp market makers than spot, so the perp moves second. For about 200 milliseconds, the perp trades at 64,400 while spot is at 63,050. That is a +2% basis. It is unsustainable.

The perp's market makers see the basis and start hitting their own bids on the perp to flatten exposure against their spot hedges. The perp last-price catches down to 63,200 within half a second.

But the perp's **mark price** — the price the engine uses to evaluate liquidations — is computed differently. It is a smoothed blend of spot index price and a basis component. Most venues use a formula close to this:

```
mark_price = spot_index + clamp(perp_mid − spot_index, ±0.5%)
```

The clamp is critical. Without it, a flash crash on the perp would trigger liquidations before spot confirmed the move. With it, mark price tracks spot first and the perp's own price second.

At t=0.5s, mark price is around 63,200.

## t=1s: the first wave hits

Every leveraged long position has a liquidation price determined by the size of the position, the margin posted, and the venue's maintenance margin requirement. When mark price crosses below liquidation price, the position is liquidated.

The liquidation engine does not ask permission. It cancels the trader's open orders, takes over the position, and submits a market order on the opposite side to flatten it. The trader's remaining margin (above the bankruptcy price) goes to the venue's insurance fund as a liquidation fee.

At a 3% spot move, every position opened with 33x leverage or higher is now underwater on margin. That is a lot of positions. On Binance during peak bull market, this means 10,000 to 50,000 positions get triggered in the same second.

The engine has a queue. It cannot liquidate all of them simultaneously without nuking the order book. So it batches and rate-limits — 50 to 200 liquidations per second per instrument, with priority given to the most-underwater positions first.

## t=2-5s: market orders consume the book

The book's bid side is thin. Most resting bids vanished when the spot crash started, because market makers pulled quotes the moment their risk system saw the move. What is left is a thin layer of opportunistic liquidity-providers and a handful of longs who failed to pull their stops.

The liquidation engine submits its first batch of market sells. They sweep down the book aggressively because the size is large. Spot is at 63,050; perp last after the first liquidation batch is 62,400. Mark price catches up: now 62,500.

The catch-up triggers a second wave of liquidations — positions that were fine at 63,200 mark but not at 62,500 mark. They go into the queue. The engine processes them.

## t=10s: feedback loop

Liquidation selling drove perp price below spot. Spot follows, because spot/perp arbitrage desks are now buying spot and selling perp to harvest the dislocation. Buying spot is also slow — the arb desks are working orders into thin liquidity on the way down — so spot grinds down with the perp.

```
t=0        spot 65000 / perp 65000 / mark 65000
t=1s       spot 63050 / perp 63200 / mark 63200    → liquidation wave 1
t=5s       spot 63000 / perp 62400 / mark 62500    → wave 2
t=10s      spot 62200 / perp 61800 / mark 62000    → wave 3
t=20s      spot 61500 / perp 61200 / mark 61400    → wave 4
t=30s      spot 61200 / perp 61000 / mark 61100    → cooling
```

The 3% spot move became a 6% spot move in 30 seconds. Most of the extra 3% is liquidation-driven, not fundamental. The market will recover some of it in the next hour. The liquidated traders do not get to participate in that recovery.

## the insurance fund and ADL

When the liquidation engine market-sells into a thin book, it sometimes cannot flatten the position above the bankruptcy price. Example: a long with a liquidation price of 62,000 and a bankruptcy price of 61,900. The engine starts the market order at 62,000. By the time the order completes, the average fill is 61,700. The trader's account hits zero, and the venue absorbs a loss of (61,900 − 61,700) × position_size.

That loss goes to the insurance fund first. The insurance fund exists for exactly this case. It is funded by liquidation fees from successful (above-bankruptcy) liquidations, and it pays out for unsuccessful ones. Net positive over time, occasionally tapped hard during a cascade.

If the insurance fund runs out, the venue triggers **auto-deleveraging (ADL)**. ADL force-closes the most-profitable positions on the opposite side of the cascade, at the bankruptcy price, to absorb the loss the insurance fund cannot. Shorts who got the move right see their position closed against their will, at a price worse than current market. ADL is the venue's worst-case escape hatch and the single most controversial feature in crypto derivatives.

The big venues design hard to avoid ADL. Insurance fund balances above $200M are common on the top three venues, because the fund has to survive a cascade an order of magnitude worse than May 2021. The fact that ADL exists at all is sometimes presented as a venue weakness. The opposite is true. ADL is a *backstop* that exists precisely because every other layer of risk management can fail. Without ADL, the venue's loss is unbounded and the system goes insolvent. With ADL, the system survives any cascade — at the cost of socialising the loss to winners.

## why the cascade is structural

The cascade is mechanical. The liquidation engine works through its queue **in batches, on a schedule, until the leveraged positions are flat**. Nobody is panicking. Nothing is changing minds. The engine is processing what it was built to process. The cascade is the structural cost of allowing leverage in the first place. You cannot have 100x leverage and a tight book and no cascade. Those three are mathematically incompatible during a 3% move.

The cascade ends when leverage exits the system. Once the over-leveraged positions are gone, the book repopulates with non-leveraged or low-leverage participants, the spread tightens, and price normalises. In a healthy venue, the whole process takes 30 minutes to 6 hours depending on the size of the initial impulse.

In an unhealthy venue, the cascade ends with the insurance fund drained, ADL triggered, and a 24-hour period of trader fury. In a *terminal* venue, the cascade ends with the venue itself insolvent. FTX in October 2022 was not a cascade event. It was a solvency event. But the order of operations was similar — a price move triggered liquidations that triggered withdrawals that exposed the underlying balance sheet hole.

## the part nobody markets

"No cascade" is the most important under-marketed product feature in this asset class. You cannot advertise it because the trader signing up does not yet care. They will care, six months in, when the venue they were using ADLs them out of a winning short at the worst possible price.

The way a venue avoids cascade is the way a venue avoids most things: spend ten years quietly investing in liquidation engine quality, insurance fund growth, mark price stability, and risk system latency. The investments do not make a marketable feature. The absence of disasters is the feature. And the absence is unprovable in advance.

---

→ Previous: [funding rates, explained without the hand-waving](/writing/funding-rates-explained-without-the-handwaving)
→ Next: [why backtests lie — survivorship and look-ahead bias in crypto tick data](/writing/why-backtests-lie-survivorship-look-ahead-bias-crypto)
