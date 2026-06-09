---
title: "anatomy of a perpetual futures matching engine"
date: 2024-09-15
slug: anatomy-of-a-perpetual-futures-matching-engine
excerpt: "What actually happens between an order hitting the gateway and a fill landing on the wire. Five components, a sub-millisecond budget, and the failure modes you only see in production."
tags: [crypto, perpetual-futures, matching-engine, infrastructure, exchanges, pi42]
---

A modern crypto perp venue clears between 5,000 and 50,000 orders per second on a single instrument, with a target match latency under 200 microseconds and a P99 under 2 milliseconds. Most of those orders never become fills. They are cancels, modifies, and post-only rejections. The matching engine is the thing that has to sort signal from noise at that rate, every second, without dropping one.

Here is what is actually in that box.

## the pipeline

```
client      │ REST · WebSocket · FIX 5.0 SP2
gateway     │ TLS termination · auth · rate-limit · normalise to internal format
risk        │ margin check · self-trade · position limit · price collar
engine      │ order book · price-time priority · matching · partial fills
settlement  │ funding accrual · realised PnL · insurance fund tap (if needed)
egress      │ market-data fanout · private acks · trade reports · audit log
```

Five components in that order, with sub-component checkpoints between them. The contract between layers is brutal: the engine never blocks on settlement, settlement never blocks on egress, and egress never blocks on the network. Anything that violates the contract has to be discovered, isolated, and fixed before the next U.S. open.

## the order book

The book lives entirely in memory. Two side-by-side data structures — a bid side and an ask side, each a sorted map keyed by price. Inside each price level, orders are kept in a doubly-linked list. Head is the oldest order, tail the newest. That layout matters because **price-time priority** is the law: orders at the same price get matched in the order they arrived.

A market sell sweeps the bid side from the top. For each price level it touches, the engine walks the linked list head-to-tail, decrements the resting order's quantity, emits fill messages, and unlinks nodes that go to zero. When the sell's remaining quantity hits zero, the engine stops. When the book runs dry first, the residual either becomes a resting order (if the order type permits) or gets cancelled.

That is matching. Three other order types exist on top — IOC (cancel any unfilled remainder), FOK (fill the whole thing or cancel it entirely), and post-only (reject if it would take liquidity). Each one is a flag the engine checks before deciding whether to leave a residual on the book.

## the latency budget

The whole thing has a target of 200 microseconds gateway-in to ack-out under steady load, with a P99 ceiling of 2 milliseconds. The budget gets allocated like this:

```
gateway parse + auth     │  20 µs
risk pre-check           │  30 µs
engine ingest + match    │  50 µs
settlement update        │  20 µs
egress encode + emit     │  30 µs
internal network hop     │  20 µs · per hop, two hops
                         │ ───
                         │ 190 µs target
```

You miss the budget by missing it on one component, every single time. The most common offender is the risk pre-check, because it touches account state — and account state lives in a shared cache that has to serve reads from multiple gateway shards. If a single account fires 5,000 orders per second and every order checks the same row, the cache hot-key problem will eat your budget.

The fix is not faster hardware. It is sharding the account state by hash and pinning the gateway shards to talk only to their hash bucket. Boring. Reliable. Cheap to operate.

## what kills a matching engine in production

Three things, in roughly the order they actually show up:

1. **Cancel storms.** A market-making bot decides to re-quote 4,000 orders simultaneously. Every cancel touches the book; every replace touches the book again. The book mutates 8,000 times in a single tick. The fanout to market-data subscribers explodes. The slow consumer on the WebSocket falls behind. Backpressure kills the engine if you do not have a hard cap on the queue.

2. **Self-trade prevention misses.** A taker order from account A crosses a resting order from the same account A, possibly because two bots on the same desk do not know about each other. The default policy is to cancel the older order, but the policy could be "cancel the newer one" or "cancel both." Pick the wrong default for your venue's user mix and you get a support ticket per second.

3. **Funding settlement contention.** Once every funding interval — 8 hours, on most venues — every open position in the entire instrument needs a funding accrual posted to its account. If that runs in-band with matching, the engine pauses. If it runs out-of-band on a separate worker, the accrual lags trades that happened in the same tick. Most venues compromise: accrue out-of-band, replay the position snapshot to the engine afterward.

None of these are research problems. They are operational problems. The matching algorithm itself was solved in the 1980s. The interesting work is everything around it.

## the part nobody markets

The book is replicated. Always. The primary writes every event to an in-memory log; a hot standby tails the log and rebuilds the book in real time. If the primary goes down — power, network, bad deploy — the standby takes over in single-digit seconds, and the only thing the world sees is a small spread widening for ten seconds while resting orders settle back in.

That replication is what lets you ship a deploy during U.S. hours without taking the venue down. Most retail traders never notice the venue updated its engine three times that week. The lack of notice is the product.

## what the architecture is for

The hard part of running a perp venue is not matching. It is not even risk. It is making sure the user who placed an order at 09:31:14.220 gets their fill before the user who placed at 09:31:14.221 — for years, across hardware failures, across deploys, without an audit ever finding a violation.

That is the only thing the engine has to do. Everything else — the dashboards, the APIs, the funding logic, the leaderboards — is decoration around that one promise. If the promise holds, you have an exchange. If it does not, you do not.

---

→ Next in this series: [funding rates, explained without the hand-waving](/writing/funding-rates-explained-without-the-handwaving)
