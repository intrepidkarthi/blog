---
title: "Survivorship and look-ahead bias: the two ways your crypto backtest data lies"
date: 2026-04-30
slug: why-backtests-lie-survivorship-look-ahead-bias-crypto
excerpt: "Before slippage or fees or psychology gets its turn, the data itself lies. Survivorship and look-ahead bias make a crypto backtest look brilliant using information a trader on that date never actually had. Here is how both work, and why point-in-time data is the only real fix."
tags: [crypto, quant, backtesting, data-quality, feaws]
---

A strategy that prints 287% APR in backtest and loses 41% live has usually been lied to twice. Once by how the trades actually executed, and once, earlier and more insidiously, by the historical data itself, before your strategy logic ever ran. This post is about the second lie, the one baked into the data. Two biases do most of the damage in crypto specifically, and both make your backtest look brilliant using information a trader standing on that date never actually had: survivorship and look-ahead.

## survivorship bias

Your historical price series for "altcoins" comes from a snapshot of altcoins that *still exist*. SafeMoon, Luna Classic, FTT, every Solana memecoin from January 2024 that is now untradable, those are not in your dataset, because the data provider stopped indexing them after they delisted.

A backtest that says "buy the top-50 altcoins by market cap and hold for 30 days" looks fantastic over 2020-2024. The top-50 from each historical month is computed from the assets *that survived to today*. The losers got filtered out by reality before they got filtered out by your code, so your strategy never had to hold the coins that went to zero, because your data pretends they were never there.

The fix is to use a point-in-time universe: at the start of each backtest period, the set of tradable assets must be exactly what was tradable on that date, delisted losers included. Most providers do not ship this. The ones that do (Kaiko, CoinMetrics for the majors) charge for it. The free providers are unusable for any strategy that touches anything below the top 20.

## look-ahead bias

This is the one that humbles experienced quants. You are using a feature in your model, say a 14-day RSI on BTC. You compute it on each historical bar. The bar at 09:00 UTC on March 14, 2024 has an RSI value that looks normal.

That bar was computed by your data provider *with the closing price of the previous bar included*. If your provider revised that closing price afterwards, and providers do, when they correct trade errors or get late exchange reports, the RSI you are using in your backtest is the *revised* value, not the one a trader would have seen in real time. The signal looks like it predicts the next bar. It also half-cheats, using information that was not visible at decision time.

The fix is the same one: point-in-time data. Every value in your historical series must be the value that was visible at that exact timestamp, with no later revision applied. Almost nobody ships this for crypto. You usually have to record your own tick stream and never revise it. Feaws's data layer is append-only for exactly this reason: a value, once written, is the value a trader saw, forever.

## the data discipline, in one rule

Both biases have the same root and the same fix. Every number your backtest sees must be the number a trader could have seen on that date, from a universe that included the assets that later died. Point-in-time universe, point-in-time features, append-only storage, no revisions. Get that wrong and your strategy is being graded on an exam it was shown the answers to.

## the other half of the lie is execution, not data

Survivorship and look-ahead are the *data* lies, the ones that corrupt the backtest before your logic runs. There is a second, separate set of lies that live in how the trades would actually fill: slippage, fees, funding, latency, regime shifts, and the person clicking the button. Those are execution, not data, and I cover them in [why my backtest works but live trading loses money](/writing/why-my-backtest-works-but-live-trading-loses-money). Fix the data first, because a backtest built on survivorship and look-ahead is already lying before execution ever gets its turn to.

Every one of these errors is structurally one-sided: they make the backtest look better than reality, never worse. Which is why deployed strategies almost always underperform their backtests, and why the right prior on any clean-looking crypto backtest is not "how do I trust this," but "which bias is making it look better than it will run." With the data, there are two prime suspects, and you have just met both.

---

→ Previous: [liquidation cascades — the 30 seconds after BTC drops 3%](/writing/liquidation-cascades-the-30-seconds-after-btc-drops-3)
→ Next: [the case for publishing your strategy — transparency as edge](/writing/the-case-for-publishing-your-strategy)
