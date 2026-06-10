---
title: "why I publish trades live"
date: 2025-04-15
slug: why-i-publish-trades-live
excerpt: "Most traders hide their losses. I publish mine in real time. Here is the asymmetry that makes it the right call, with one warning about who it does not work for."
tags: [trading, transparency, philosophy, accountability]
---

Most traders hide their losses. They post the wins on Twitter, they whisper the losses to a co-founder, and they show selectively curated PnL charts when raising money or selling courses. This is the standard architecture of the retail trading-content economy. It has been the standard architecture since before there were Twitter accounts.

I publish my trades live. Every entry, every exit, with timestamps. The winners and the losers, in the same feed, with no curation between them. This has been my practice since early 2023 — a public trade log, posted at entry, before the outcome is known. It is a structural choice that almost no one else makes, which means I get asked about it often.

Here is the asymmetry behind the choice, and one warning about who the strategy does not work for.

## what "publish live" actually means

Every trade goes into the public log at entry, not after the outcome is known. Each entry shows:

```
timestamp             │ exact UTC time
thesis                │ why the trade exists
signal                │ the input that triggered it (sentiment, flows, funding, news)
position              │ direction, size, instrument
expected hold         │ time horizon
stop / target         │ pre-committed exits
```

When the trade closes, a second entry shows the actual fill, the realised PnL, and whether the exit was at stop, target, or manual. Anyone watching the feed sees what I see, when I see it, with no delay or filter.

This is not "I post my trades when I feel like it." It is "the trades are public the moment they exist, including the ones that are about to lose money."

## the asymmetry

The standard objection is "if you publish your trades, you destroy your edge." I have argued elsewhere why this is wrong for cross-domain signal strategies. The summary of that argument: execution is the moat, not alpha; the audience cannot replicate the execution; publishing forces precision; the second-order returns (credential, audience, accountability) usually exceed the cost.

The trader-side asymmetry is sharper. Publishing trades does four things to the trader's own behaviour, each of which is independently valuable.

**It forces pre-commitment.** I cannot enter a trade without a stop and target, because the public log demands both fields filled in at entry. Pre-commitment is the single most powerful behaviour change in retail trading. Most retail traders cannot reliably commit because they keep adjusting the stop "for a good reason" mid-trade. The public log eliminates that.

**It prevents lying to myself about losses.** A losing trade with a public timestamp cannot be retroactively reframed as a "different strategy" or "test position." The trade is what it was, recorded at entry, settled at exit. The post-hoc rationalisation that destroys most retail traders' learning loops cannot happen if the record is public.

**It compresses the cycle time on rule modification.** When a rule is wrong, the public record shows it within a few trades. The pressure to retire a broken rule is much higher when the bad trades are visible to a thousand people than when they are visible only to me. Closed strategies decay for months before the trader admits it. Public strategies decay for weeks.

**It exposes me to teachable losses.** A losing trade I post publicly gets read by other traders. Some of them have insights about why the trade failed. Some of them are wrong. A few are right in ways I had not considered. The public post turns the loss into a feedback loop that includes outside perspective.

## the credibility effect

I did not start publishing trades for credibility. The credibility was a byproduct. Two years into publishing trades publicly, the credibility effect has become more valuable than I expected.

Three things happened.

First, the people who matter — other quants, founders, investors — read the public log and form opinions of my judgment from it. The opinion they form is much more accurate than the opinion they would have formed from a marketing page. They see the bad weeks. They see the good weeks. They see how I handled drawdowns. The opinion they form is therefore more durable.

Second, the public log made me legible to the kinds of conversations I wanted to have. Several of the most important professional relationships I have formed since 2023 started with "I have been following your trade log for six months." Those people were watching a signal that I did not realise I was sending.

Third, the credibility transfers. Even on topics unrelated to trading — engineering, hiring, the blog itself — the public-trading log is now part of how I get evaluated. The act of having done one thing transparently for a sustained period serves as evidence of how I would do other things.

## the cost

Three real costs.

**Ego.** The bad weeks are public. The mistakes are public. The dumb trades are public. I have lost money in front of an audience, repeatedly. The visceral cost of this is real. The first few visible losses were uncomfortable in a way that closed-system losses are not. The discomfort decreased over time but never went to zero.

**Occasional ridicule.** A losing trade on a publicly-named hypothesis attracts a specific kind of critic — usually someone who has never published their own trades but is eager to point out that mine did not work. The ridicule is generally low-quality and easy to ignore. It is, however, a non-zero cost that the closed-system trader does not pay.

**The lock-in.** Once you publish trades for a year, you cannot reasonably stop without explaining why. The decision to publish is structurally a multi-year commitment. If your trading strategy changes meaningfully, you have to publish that change too. The system is harder to evolve quietly.

## who this does not work for

Two categories.

**Day traders with short-horizon execution strategies.** The kind of edge that lives in a 5-second signal half-life is the kind of edge that *can* be destroyed by publication. If your strategy is "be 50ms faster than the rest of the book on a specific signal," publishing the signal removes the edge. Public trading works for multi-day or multi-week strategies. It does not work for HFT.

**Traders whose alpha depends on undiscriminating retail liquidity.** If you make money primarily by trading against retail mistakes (memecoin liquidity, options-flow patterns dominated by Robinhood), telling retail what you do degrades your own counterparty quality. The strategy needs to survive its readers. Most factor or carry strategies do. Some retail-vs-retail strategies do not.

For everyone else — and this includes most retail and most cross-domain quants — public trading is the better architecture. The costs are real but small. The benefits compound over years.

## the warning

Do not publish trades to *prove* you are right. The traders who do this are the ones who hide their losses, post wins selectively, and burn their credibility within months. The audience can tell within weeks.

Publish trades because the discipline benefits you. The audience effects are downstream. The credibility, the feedback loop, the rule-modification pressure — all of these only work if the *primary motivation* is the self-imposed accountability. The marketing benefit is the byproduct, not the goal.

If you publish trades primarily for the marketing benefit, the strategy fails. If you publish trades primarily for the discipline benefit, the marketing benefit shows up anyway.

## the close

Two years into running a publicly-tracked trade log, I am a meaningfully better trader than I was before. Not because the strategy got better — the strategy is roughly the same. Because the public record made my failures more expensive, my pre-commitments stronger, and my rule-modification faster.

The strategy I publish is the strategy I am willing to defend in public for the next ten years. The strategies I am not willing to defend are not strategies I should be running anyway.

That filter is the value. The marketing is the byproduct. Publish.
