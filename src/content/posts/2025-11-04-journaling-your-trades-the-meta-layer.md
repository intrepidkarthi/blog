---
title: "journaling your trades — the meta-layer of feaws"
date: 2025-11-04
slug: journaling-your-trades-the-meta-layer
excerpt: "I am building feaws to make my trading transparent. The deeper benefit that nobody talks about: the journal becomes a forcing function that vetoes trades before they exist."
tags: [trading, journaling, feaws, psychology, retail]
---

I am building feaws — a public quant lab where every signal and every trade is recorded. The marketing is about transparency. The bigger benefit, the one I underestimated, is the journal itself.

A trade journal that exists changes the trader's behaviour before the trade ever happens. The change is structural and it compounds.

## what a trade journal actually contains

The minimum is six fields, as I have written about in [the behaviour gap](/writing/the-behaviour-gap-in-your-trade-journal). The fuller version, which is what feaws records, is closer to twelve.

```
entry date           │ exact timestamp, not rounded
entry price          │ actual fill, not the price you wanted
position size        │ % of bankroll, recorded at entry
thesis               │ the single sentence reason for the trade
signal               │ which hypothesis or rule triggered the entry
expected hold        │ the time horizon you planned
stop                 │ pre-committed exit on the bad side
target               │ pre-committed exit on the good side
emotional state in   │ calm / FOMO / revenge / conviction
exit date            │ exact timestamp
exit price           │ actual fill
exit reason          │ stop / target / manual / news / time
emotional state out  │ calm / panicked / confident / regretful
```

That is a lot. Most retail traders log four of these. The four that matter least.

## the pre-trade journaling step

The most undervalued line in that list is *thesis*. Forcing yourself to write one sentence before entering a trade kills more bad trades than every other discipline combined.

You sit down. You want to buy BTC. You start typing the thesis. Three words in, you realise you cannot finish the sentence without admitting "because everyone on Twitter is buying" or "because I need to make back yesterday's loss." You close the journal. You do not enter the trade.

The trade you do not take is the cheapest trade you will ever make. The pre-trade journal step is the lowest-cost mechanism for filtering FOMO and revenge entries. It works because the act of writing forces you to articulate the reason, and most bad-reason trades have reasons that do not survive being articulated.

## the post-trade reconciliation

The post-trade entry is just as important. The fields that matter are not "what was the PnL." The PnL writes itself. The fields that matter are *which rule was followed*, *which rule was violated*, *what was your emotional state at the exit*.

These three fields, accumulated over 100 trades, tell you something specific about *how you fail*. Not "you fail at trading" — that is too general to act on. But "you violate stops 60% of the time when you are in revenge-state after a loss." That is actionable. The rule modification is "no new positions for 30 minutes after a stopped-out trade."

## the trades that fail post-journal review

Six months after a trade, sit down with the entry. Half the time the thesis does not match anything you would write now. The trade was based on a reason that you have since forgotten or that did not survive contact with reality. Those trades, in aggregate, are negative-expectancy. The journal proves it.

The traders who skip this step keep making the same trade for the same wrong reason for years. The traders who do this step catch the pattern within months and stop running the losing setup.

## the journal as a forcing function

The deepest benefit of journaling is the one nobody talks about. Once the journal exists and once the trader knows the journal will be reviewed, the *act of being about to enter a trade* triggers the review.

Before the trade you remember the post-trade review you will write. You remember the thesis you will have to articulate. You remember the emotional state you will have to record. The future review is present in the moment of decision. It vetoes trades that would have been entered without it.

This is the feature. The data is incidental. The behaviour change in the present moment, caused by the knowledge that the data will exist, is the entire compounding benefit.

## the feaws layer

In feaws the journal is public. Every trade gets a timestamp, a thesis (in the form of "which hypothesis fired"), a size, an exit. The public layer adds one more check — not just "what will I think of this trade in six months" but "what will other people think of this trade in six months."

That check is not necessary for every trader. It is necessary for me, because my own private journaling discipline failed often enough over a decade to convince me that private accountability does not work the way public accountability does. The audience is the enforcement.

Most retail traders do not need the public layer. They need the private layer to actually exist. The single highest-impact behaviour change a retail trader can make is starting a journal that captures the thesis before the trade and the emotional state after it. That is it. No software required. A text file is fine.

The trades that do not get entered because the thesis would not survive being written are the trades that compound into a career.
