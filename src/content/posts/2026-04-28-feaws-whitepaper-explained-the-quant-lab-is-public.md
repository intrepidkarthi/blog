---
title: "feaws — the quant lab is public, and so is the math"
date: 2026-04-28
slug: feaws-whitepaper-explained
excerpt: "A walkthrough of the feaws.xyz whitepaper in plain English. Five hypotheses, one engine, every trade public. The content IS the product. The trading IS the proof."
tags: [feaws, quant, trading, crypto, infrastructure, whitepaper, polymarket, btc]
---

> Whitepaper: [feaws.xyz/feaws-whitepaper.pdf](https://feaws.xyz/feaws-whitepaper.pdf)
> Live signals: [feaws.xyz](https://feaws.xyz)

Most quantitative strategies are private. The math sits in a hedge fund's GitHub Enterprise, the trades clear in a prime broker's dark pool, and the only thing the rest of us see is a quarterly letter that says *"the strategy performed as expected."*

feaws is the opposite. Same kind of math. Public on day one.

The whitepaper is the spec. This post is the plain-English walkthrough — what it does, why those five hypotheses, what the stack is, and why the whole thing is built so that the content itself is the product.

## the framing

There are two kinds of edge in markets:

1. **Information edge** — you know something others don't.
2. **Processing edge** — you see something others can't, fast enough to act.

Retail traders rarely have either. What retail traders *can* have, in 2025-2026, is **structural edge from cross-domain signals** — combining data sources that institutions ignore because they're too messy or too small or too unconventional to stand up in a Bloomberg terminal.

That is the whole feaws thesis. Five testable hypotheses, each one built around a signal that is public, free or near-free to access, and weakly correlated with the typical institutional inputs (price, volume, options skew).

If even two of the five hold up out-of-sample, the strategy works. If three hold up, it's a real edge. If four, you're frontrunning a fund.

## the five hypotheses

Each hypothesis is a triple: **signal · target · window**. The signal is the input. The target is the asset traded. The window is how long the bet has to play out.

### H1 — Polymarket leads spot price

> **Signal:** Polymarket odds delta > 15% in 24 hours
> **Target:** BTC/USDT
> **Window:** 48 hours

Polymarket runs prediction markets on real-world events — including crypto-relevant ones ("BTC above $X by date Y", "Fed cuts rates in next meeting", "ETF approved before Q3"). The odds move in real time as participants put money down on outcomes.

The hypothesis: when Polymarket consensus shifts faster than spot, spot follows. Prediction-market money is information money. It's not enough to move BTC by itself — but it's often early.

### H2 — Regulatory signal alpha

> **Signal:** GDELT news sentiment + keyword scoring (regulator names, crypto terms, country tags)
> **Target:** BTC, ETH, plus the regional token most exposed to the jurisdiction
> **Window:** 6-24 hours

[GDELT](https://www.gdeltproject.org/) is a global news event database that processes broadcast, print, and web news in 100+ languages. Most quants don't touch it because it's noisy and the schema is brutal.

That noise is the moat. Regulatory news moves crypto disproportionately because the asset class is structurally jurisdictionally fragile. Score the news against a regulator-and-keyword dictionary, weight by source credibility, and you have an early-warning signal that prices in before the New York traders wake up.

### H3 — AI release → GPU token pump

> **Signal:** A frontier-lab AI model release event (GPT, Claude, Gemini, Llama, open-weights drops above some FLOP threshold)
> **Target:** RNDR, AKT, TAO, FET — the GPU/compute/inference tokens — measured against BTC, not USD
> **Window:** 72 hours

This is the cleanest cross-domain hypothesis in the set. AI capability releases create demand attention for "AI infrastructure" exposure. Crypto's GPU/compute basket is the closest the public market has to that exposure. The pump is real but mean-reverting; 72 hours is the window where it shows up and then fades.

Trading against BTC instead of USD strips out the broad market move. We're isolating the *AI-narrative excess return*, not the beta.

### H4 — Fear & Greed reversal

> **Signal:** Fear & Greed Index < 25 for 3 consecutive days **AND** Polymarket "BTC up next month" odds > 60%
> **Target:** BTC/USDT
> **Window:** 7 days

This is a contrarian signal with a confirmation gate. The F&G Index is a popular sentiment gauge that runs from 0 (extreme fear) to 100 (extreme greed). Buying extreme fear is folk wisdom — it works often enough to be a real factor, but it also gets you killed in trends.

The Polymarket gate filters that out. If F&G says "extreme fear" but Polymarket money is still pricing upside, the divergence itself is the signal. Sentiment is panicking; capital isn't.

### H5 — On-chain whale accumulation under bad sentiment

> **Signal:** Exchange outflows > 2σ above 30-day rolling average **AND** negative news/social sentiment
> **Target:** BTC, ETH
> **Window:** 14 days

When coins leave exchanges, supply tightens. When that happens *while sentiment is bad*, you're looking at conviction buying — accumulation by people who aren't reading the headlines and are not selling either.

The two-week window is deliberate: this is a slow signal. It's not a day-trading edge. It's a positioning edge.

## why these five and not fifty

Every hypothesis has to clear three filters before it goes in the engine:

1. **Public data.** No paid Bloomberg feed. Anyone reading the whitepaper can re-derive the signal from open sources. This is not a moat — it's a feature. The point is reproducibility.
2. **Cross-domain.** The signal lives outside price-and-volume. Polymarket, GDELT, AI release calendars, on-chain flows. Standard quant inputs are saturated; the alpha has migrated to the messy edges.
3. **Falsifiable in <100 trades.** Each hypothesis has a window short enough that 30-50 historical instances exist. You can test it without lifetime data.

Things that don't make the cut: anything Twitter-sentiment based without a hard gate (too noisy), anything dependent on a single private API (broken-feed risk), anything with a window longer than 30 days (can't test it in time).

## the stack

The infrastructure is deliberately boring. Boring is the point. When the trades are public, the failures are public too — and the cheapest way to avoid an embarrassing infra failure is to use components that have already failed for everyone else and been hardened.

```
data layer    │ Postgres (Supabase) — every signal write is append-only
worker layer  │ Python 3.11 + APScheduler on Railway
ingest        │ Polymarket API · GDELT · CryptoQuant on-chain · F&G Index · CCXT
analytics     │ pandas · numpy · ta-lib · sklearn for the simple models
report layer  │ Claude API → markdown digest → static site
publish       │ Next.js on Vercel — feaws.xyz
notify        │ X/Twitter post + email digest
```

No microservices. No Kubernetes. No Kafka. A schedule, a database, a worker, a renderer, a publisher. If a component fails, you can swap it in an afternoon.

The Claude API is the only "AI" in the stack, and it's only there for the report-writing step — turning structured signal output into a paragraph a human will read. The trading logic itself is deterministic. Probabilistic systems writing reports about deterministic signals.

## the philosophy

> *The content IS the product. The trading IS the proof.*

This is the line that determines every other decision in the project. It comes from a simple observation about the trading-content economy:

Most "trading content" online is built on a lie. The creator makes money from selling the content (courses, signals, premium feeds). The content is the product. The trading is the marketing. So the trading does not actually have to work — it just has to look like it works long enough to sell another cohort.

feaws inverts that. The signals are public. The hypotheses are public. The whitepaper is public. The trades execute on Polymarket and on perpetual futures, both of which are publicly inspectable. Anything I write about the lab can be cross-checked against the actual entries.

If a hypothesis stops working, the next quarterly update will say so. Not because I'm noble — because lying about a public position is impossible.

## what the whitepaper covers that this post doesn't

This is the explainer. The whitepaper is the spec. If you're reading this and want the actual mechanics — sizing rules, drawdown limits, hypothesis-weight allocation, the exact statistical test for each signal, the failure-mode catalogue — that is what the PDF is for.

Read it: [feaws.xyz/feaws-whitepaper.pdf](https://feaws.xyz/feaws-whitepaper.pdf).

Don't take the trades on faith. Take them on the math, or don't take them at all.

## the bigger reason

I have spent 16 years building infrastructure. Crypto exchanges. Healthcare AI on petabytes of HIPAA data. ERP systems. ML books. The thing that keeps showing up across all of those — the move that compounds — is **putting your work where it can be falsified**.

Closed systems decay quietly. Open systems are forced to actually work, because the market keeps score and the market does not forget.

feaws is the closed-system-to-open-system version of my own trading. The infrastructure is open. The math is open. The trades are open. If the math is wrong, the world will know in a month, not a year. If the math is right, the world will know in a year, not never.

That's the trade.

---

→ Read the whitepaper: [feaws.xyz/feaws-whitepaper.pdf](https://feaws.xyz/feaws-whitepaper.pdf)
→ Live signals + dashboard: [feaws.xyz](https://feaws.xyz)
→ Follow the trades: [@intrepidkarthi on X](https://x.com/intrepidkarthi)
