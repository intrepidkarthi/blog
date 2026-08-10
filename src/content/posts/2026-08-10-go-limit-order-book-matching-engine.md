---
title: "a limit order book and matching engine in go"
date: 2026-08-10
slug: go-limit-order-book-matching-engine
excerpt: "Three weeks, 21 releases, 20,299 lines of Go and 19,906 lines of tests. An embeddable central limit order book with integer-exact pricing, a lock-free single-writer core and machine-checked crash recovery. What it does, what it deliberately refuses to do, and the three things that found bugs the test suite couldn't."
tags: [go, matching-engine, orderbook, exchanges, infrastructure, trading, open-source]
---

Every serious venue runs the same core. A single-threaded, deterministic state machine per symbol, the book held entirely in RAM, fed by a sequenced command queue. Parallelism lives around that core, in the I/O and the risk checks and the market-data fanout, and never inside it. Strict price-time priority is serial by construction, so per-symbol serialization is a correctness requirement before it is ever a performance choice.

LMAX made the numbers public years ago: 6M+ operations a second on one thread, sub-100ns, because two cores writing one cache line ping-pong it between L1 caches and one writer just does plain stores.

I spent the last three weeks building that core in Go and putting it on GitHub under MIT. This is the first thing I've written about it.

```sh
go get github.com/intrepidkarthi/orderbook/pkg/matching
```

The code is at [github.com/intrepidkarthi/orderbook](https://github.com/intrepidkarthi/orderbook), and if you'd rather see it than read about it, the same engine is [running in a browser tab](https://intrepidkarthi.github.io/orderbook/).

## what it is

An embeddable library, not a venue. You `go get` it into an exchange, a simulator, a backtester or a teaching tool, and it owns the order book, the matching algorithm, order lifecycle, deterministic sequencing and market-data snapshots. Credit, identity, fees and wire protocols stay in the layers around it, which is the same boundary production venues draw.

The order surface is complete enough to be uninteresting, which is the point: limit, market, stop and stop-limit, iceberg, post-only, pegged, OCO and bracket, trailing stop. GTC, IOC, FOK, DAY and GTD, with the venue holding the deadline instead of the client remembering to cancel. Self-trade prevention in five modes. A price-band circuit breaker. FIFO or pro-rata allocation.

There's a trading session too. Pre-open accepts orders without matching them, so the book accumulates and may legitimately cross; opening resolves it at a single clearing price by auction, in price-time priority, so the venue never opens onto a crossed book. The engine holds no calendar. It knows what each phase permits, not when the phases change, because when is the venue's business.

Around the core sit the companion packages: a write-ahead log with snapshots, a market-abuse surveillance suite, in-process pre-trade admission control, and a uniform-price call auction. There's a reference TCP gateway that speaks a frozen binary protocol on both edges: order entry with authentication and gap-free resume across a disconnect, and a public market-data feed with snapshot-plus-delta recovery. And there's a WebAssembly build, so the real engine runs in a browser tab if you want to watch a market order cross the spread.

## three decisions that shaped everything else

There is no floating point on the money path. The engine works in `int64` ticks and lots. A per-symbol `Instrument` converts decimals at the API boundary and nowhere else. This is unglamorous and it removes an entire category of bug that surfaces years later as a reconciliation break.

One goroutine owns the book, with no lock on the hot path. A `Runner` fronts the engine with an MPSC command queue so many producers can submit concurrently, but the mutation is serial. O(1) cancel, pooled book nodes and price levels, and a caller-buffer match path that allocates 0 B/op. A cancel-heavy flow, which is what real order flow looks like, runs at p50 83 ns, p99 167 ns, p999 250 ns per operation.

Determinism is the load-bearing property. The same ordered command stream produces byte-identical trades and book state, and everything useful downstream falls out of that one guarantee: command-log replay, durable crash recovery, reproducible backtests, and primary-backup replication where two engines that applied the same commands can be compared by fingerprint. It's gated in CI against a 2,000-command tape. Checkpoint anywhere, recover, and the book, all three sequence counters, the duplicate guard and the conditional-order state have to match the uninterrupted run.

The event stream carries the same property. `Accepted`, `Trade`, `Canceled` and `Replaced` replay into an L3 book identical to the engine's, asserted on every commit across 23 scenarios covering iceberg refill, all five self-trade-prevention modes, FOK reversal and cascade-fired stops.

## what it refuses to do

Clearing, settlement, margin and fees are absent by design.

Multi-symbol routing is absent for a duller reason: order ids and sequence numbers are per-engine, so several symbols means several engines and a router above them. I'd rather say that than pretend one engine handles a venue.

High availability is the one worth explaining. The library ships the seams for primary-backup (deterministic apply, an ordered command log, replay mode, snapshot bootstrap), proves them with a reference example and seven CI drills, and stops short of the consensus on purpose. Bundling a consensus implementation forces a wrong answer on everybody, and the venues that lost quorum mostly lost it by inheriting somebody else's assumption about failover.

## the part you can click

The engine compiles to WebAssembly, which means the three teaching surfaces on the site are not diagrams of the engine. They are the engine, running in your tab.

The [live demo](https://intrepidkarthi.github.io/orderbook/) is the watching one. Animated scenes with play, pause, step and speed, plus controls to place your own orders and change the parameters. If it shows a fill, the engine produced that fill.

The [tutorial](https://intrepidkarthi.github.io/orderbook/learn.html) is the doing one, and it's the piece I'm most pleased with. Six chapters, each one a role you play: the first seller, the wall builder, the taker, the queue jumper, the whale, the market maker.

Two things separate it from every order-book explainer I could find, and both fall out of the engine being real rather than drawn.

The ladder assembles itself. Chapter 1 opens on an empty market. No prices, no chart, nothing, because a market is a list of intentions and the list starts empty. You post the first order and watch a price come into existence. Sizes appear when depth is the lesson, bars when depth needs comparing, the tape at the first trade. By the last chapter the full professional ladder is on screen and you understand every pixel of it, because you watched each one arrive and used it for something.

The objectives are engine-checked. Every chapter sets a task, and the phrasing is deliberately concrete: offer to sell, get filled before the rival, buy 8 without paying more than one level. It marks complete only when the book state proves it happened. There's no "click next to continue" anywhere on the page, because the check polls the real engine. A tutorial with tests, which is the same rule the rest of the repository runs on.

Chapter 5 is the one I'd point a trader at. You send the same 8-lot order into a thin book and then into a deep one, and the page shows average fill, worst fill and levels swept side by side. Slippage stops being a word.

The [live console](https://intrepidkarthi.github.io/orderbook/console.html) is the showcase rather than the lesson. A running market with `sim.NoiseTrader` agents providing continuous flow, live signals (depth imbalance, order-flow imbalance, Kyle's lambda) and the surveillance detectors, all computed by the library's own code. Nothing in that page reimplements engine logic in JavaScript; the page is a renderer.

Its second job is helping you find the code. Every panel is titled by the call that produced it, verbatim, so the path from "I see the depth ladder" to `engine.Snapshot(10)` is one glance instead of a repository search. You can also trip the spoofing detector on purpose, which teaches more than reading about it does.

The reference point was VisualHFT, which is the right idea and the wrong architecture for this project three times over. It needs a market to connect to, and this library is the market. It needs an install, and the showcase's whole job is "look, quickly." And it shows markets when what I need to show is code.

One rule runs through all three pages: nothing on them is mocked. Every number is engine output and every scripted counterparty is real orders through `engine.Process`. When the tutorial says a trade happens at the maker's price, you have just watched the print equal the resting order's price, on a trade you caused.

## eighteen documents

Behind the pages sit 18 markdown documents, about 5,500 lines. Which one to open depends on why you're here, and the [docs page](https://intrepidkarthi.github.io/orderbook/docs.html) is the index.

`THREAT-MODEL.md` maps every defensive control in the library to a real enforcement case or incident, so the surveillance suite isn't a list of plausible-sounding detectors. `PRODUCTION-READINESS.md` is the per-area honest checklist, the one that made me delete an adjective from my own README. `INTEGRATION.md` and `CONFIG.md` are for embedding it. `RUNBOOKS.md` and `SOAK.md` are for operating it. `EXCHANGE-ARCHITECTURE.md` is the research note underneath all of it: how Binance, Nasdaq, LMAX, CME, IEX, dYdX and Hyperliquid actually implement matching, sourced from primary specs, regulator filings and post-mortems, with vendor throughput claims flagged as marketing.

`PROTOCOL.md` is 614 lines of frozen wire format, and its sufficiency got tested rather than asserted. The operator dashboard, `cmd/obdash`, is written from that document alone as an ordinary market-data subscriber, living outside the venue's test tree and getting no special access. If the protocol doc were incomplete, the dashboard wouldn't work.

Three research notes sit alongside them, on order-flow imbalance, Kyle's lambda and order flow generally, each one honest about what the signal does and does not predict. The console's OFI panel links straight into that note, and every signal panel links to the source file that computes it, because a number on a dashboard without its caveat is worse than no number.

## the part that took the longest to write down

The engine has never run a live market.

Three weeks ago the README said "production-grade" in several headers. I removed the phrase from all of them, because it failed on the repository's own argument. Production readiness is a property of a deployment, not of code. A matching engine is production-ready when a named team runs it, on hardware they've capacity-planned, behind controls they've tested, with runbooks for failures they've rehearsed. None of that ships in a Go module.

There was a second problem with the old README, and it's the pattern I criticise everywhere else in that repo. The claim sat in the headline and the qualification sat in a footnote.

The headers now carry what's verifiable: deterministic, integer-exact, drilled. The README says nobody runs this in production today, and it will keep saying that until somebody does.

## 574 tests, and the three things that found what they couldn't

There are now 20,299 lines of engine and 19,906 lines of tests. Near enough to one for one, which sounds like diligence until you watch what actually found the bugs.

Three things did, and none of them was a unit test.

### the soak harness

Every performance figure I'd published came from a microbenchmark measured over seconds. The failures that end a trading day do not appear in seconds. So I wrote a load harness and pointed it at the reference gateway.

It found a defect inside the first hour that 480 test functions, two fuzzers, the race detector and every benchmark had missed.

Under sustained load the gateway would refuse a cancel for an order that was live in its own book, telling the client no such order existed. That specific error is what makes it fatal rather than annoying. A client does not retry a definitive answer. It stops asking, and the order rests in the book addressable by nobody until the venue restarts.

Measured on 25 connections over 30 seconds, before the fix:

```
rate        resting    clients believed    orphaned
────────────────────────────────────────────────────
 1,000/s      1,900             2,488         none
 4,000/s      1,968             2,485         none
10,000/s     15,332             2,489       12,843
20,000/s     99,999             2,486       97,513
```

99,999 is `MaxOrders`. At the top rate the venue had stopped trading in any meaningful sense inside half a minute, and every health endpoint returned 200 throughout.

Two causes sat underneath that table, and finding the first exposed the second.

A client names its own orders, and the venue maps that client identifier to an internal engine order id when the order is accepted. That mapping was written by the publisher's pump goroutine, on the same path as the outbound message stream. Both can fall behind under load, and only one of them can fall behind safely. A late acknowledgement is still an acknowledgement; the client gets its fill notice a few milliseconds late and nothing is lost. A late answer to "which order do you mean?" is a wrong answer, because that question is not asked twice. I had put a correctness-critical lookup on a best-effort path and never noticed, because at benchmark speeds the pump is never behind.

Naming now happens on the matching goroutine, one map write, the instant the engine accepts the order. Everything expensive stays on the pump.

Then orphaning got *worse*, which is how I learned there were two bugs.

The second one I had defended against in the wrong place. The gateway resolved the client identifier on its read loop and then enqueued a cancel carrying the resolved id, so under a queue backlog it was asking "does this order exist?" while the `Enter` that creates it was still sitting in the queue ahead of the cancel. The enqueue order had always been right. The gateway enqueues on the read loop precisely so a cancel cannot overtake its own `Enter`, and that guarantee held. It was protecting the wrong step. The lookup had already happened, upstream of the queue that was supposed to order it.

Resolution now happens on the matching goroutine when the command reaches the front of the queue, after every earlier command has been applied, and before the command is journalled, so the log records an engine id rather than a name that only ever existed inside one gateway process.

After both fixes:

```
rate                resting    clients believed    orphaned
───────────────────────────────────────────────────────────
10,000/s              1,645             2,491         none
20,000/s              1,272             2,488         none
 5,000/s, 20 min      1,963             2,487         none
```

The venue now holds slightly fewer orders than the clients believe, which is the correct direction. The difference is cancels in flight.

There's a coda. Splitting the naming index onto its own lock meant finding every writer of that map, and I missed one. `fill()` drops a name when a fill exhausts an order, and it kept writing under the old mutex. The race detector did not reach it across the entire suite. The soak crashed the process on `fatal error: concurrent map writes` within thirty seconds of the fix landing.

### the spec

A week later I wrote the spec for trade bust, which is annulling a print that has already been published. The spec found a defect that had been shipping for four releases before a line of the feature was written.

Trade bust needs a durable seam for operator commands. I went looking for one. There wasn't one. An operator halt issued after the last checkpoint was applied to the engine and never written to the log, so a venue that somebody had deliberately stopped came back open after a restart.

No test caught that, because every test that halted the venue also asserted the venue was halted, and it was. The gap lived between the halt and the next crash, and nothing in the suite lived in that window.

Writing the spec first is what walked me into it. The feature itself turned out to be mostly a list of refusals, and each refusal is a test. A bust does not re-rest the orders, does not un-fire the stops the print triggered, does not rewind the last trade price, and does not amend the event that reported the trade. Every one of those looks like a bug until you notice the book at bust time is not the book at trade time, and each undo would be a second wrong rather than a correction of the first.

### the drill that was wrong about its own subject

The replication drills run in CI, and one of them, D6, was flaky at roughly one run in twelve for three releases.

D6 stalls a follower and checks that the primary notices the lag and eventually sheds it. The drill drove traffic until the shed counter moved, then assumed the follower that got cut was the wedged one. That assumption is backwards. A follower that actually applies commands is slower than a wedged socket, because a wedged socket merely fills a kernel buffer and costs the primary nothing until it's full. Driven flat out, the *healthy* follower's ship buffer overflowed first, and the healthy follower was the one shed. The drill then reported that shedding the wedge had broken the healthy follower, which is the opposite of what had happened.

The fix matters beyond the test. `ShedPeers` now attributes each cut to a peer address, because a bare drop counter cannot tell an operator whether a client stopped reading or a follower is running behind, and those need opposite responses. D6 now waits for the wedge specifically, asserts no other follower was cut, and paces the tape against the healthy follower. Zero failures in 40 runs, against roughly 8% before.

I'd been reading that flake as noise for three releases.

## the close

A green test suite tells you the code does what you thought to ask it. That's a real thing to know and it is not the same as knowing the venue works, and the gap between those two is where every finding above lived: at minute forty of sustained load, in the window between a halt and a crash, inside a drill that had encoded my own wrong assumption about which failure is slower.

The library is at v0.21.0, pre-1.0, and the version number means what it says. If you're building a venue, a simulator or a backtester in Go, the pieces are correct, measured, and documented down to what they refuse to do. If you just want to understand how a book works, start with the [tutorial](https://intrepidkarthi.github.io/orderbook/learn.html) and post the first order into an empty market.

Run it for an hour before you tell anyone it works.
