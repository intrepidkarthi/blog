---
title: "Running my own ad server — mAdserve on shared hosting"
date: 2014-09-19
slug: running-my-own-ad-server-madserve
excerpt: "Spent a weekend standing up mAdserve — an open-source mobile ad server — on a corner of intrepidkarthi.com. The Teleport Call install base is now in the hundreds of thousands and the question of how to monetise without ruining the call experience needs an actual answer. Notes on what mAdserve does, why I'm running my own instead of plugging in AdMob, and what I think the right ad model for VR voice calls actually is."
tags: [adserver, madserve, monetization, gazematic, teleport-call, php, vr]
---

Spent the weekend standing up an ad server. Not because I love ad servers — I don't — but because the [Teleport Call](https://github.com/intrepidkarthi/GazeMatic) install base has crossed a few hundred thousand and the question *"how do we keep this thing free without making it terrible"* has stopped being theoretical.

The decision tree that landed on *run your own*, instead of just bolting on AdMob, is in the second half of this post. First, what's actually deployed.

## what's running

`mAdserve` — an open-source mobile ad server that started life as the OpenX mobile fork. Lives at:

```
http://intrepidkarthi.com/files/adserver/
```

The shape of the install:

```
adserver/
├── index.php             — admin redirector
├── init.php              — environment / config bootstrap
├── config_variables.php  — site-wide constants
├── parse_configuration.php
├── db_functions.php      — MySQL bindings
├── ad.js                 — the JS tag a publisher embeds
├── md.request.php        — ad-request endpoint (per impression)
├── md.click.php          — click-tracking endpoint
├── md.cron.php           — daily roll-up of stats
├── modules/              — campaign, zone, banner managers
├── functions/            — admin UI helpers
└── data/                 — flat-file fallback storage
```

Standard LAMP shape. PHP frontend, MySQL backend, a JavaScript tag the publisher drops onto their page or wires into their app's WebView. The cron rolls up daily impression and click counts so the dashboard isn't running aggregations on every page load.

It is not pretty. The admin UI is the OpenX 2.x lineage and you can tell. But it works, it's GPL, and the code is small enough to actually read end to end if I need to debug something. The mAdserve repo is on Google Code (still alive, last I checked) and the install is the standard `index.php` redirect-to-installer flow that PHP apps from this era all use.

## why my own and not AdMob

This is the more interesting question.

**The default reasonable answer is AdMob.** Plug in the SDK, get paid eCPM rates set by Google's auction, do not think about ad serving ever again. For 99% of mobile apps that monetise via ads, this is the right answer. I want to make clear that I think this is the right answer. I'm choosing not to pick it for specific reasons that will not apply to most projects.

**My specific reasons:**

1. **The product is a voice call inside VR.** A standard banner ad at the bottom of a screen is incoherent in this context — there is no screen, there is a virtual environment. The ad placement that makes sense for Teleport Call is a *sponsored environment* — a virtual space the user can choose to "teleport to" because a brand paid to put it in the catalogue. AdMob has no concept of sponsored environments. mAdserve doesn't either, but it's small and open enough that I can teach it the concept by editing the ad-zone schema.

2. **I want the ad logic on my own server.** The data about which environments are picked, how long calls last in each environment, conversion-to-share metrics — all of that is product data, not ad-network data. Sending it through Google's auction layer means I lose visibility into the most interesting part. With my own server, the product analytics and the ad logic are two queries against the same database.

3. **The cost of running it is essentially zero.** mAdserve is GPL. The hosting is `intrepidkarthi.com`, which I'm already paying for. The marginal cost of one more PHP install on shared hosting is negligible. AdMob's cut on small accounts is meaningfully larger than the *"server costs"* line item.

4. **I want the option to not run ads.** Self-hosting means *no ads at all* is a deployment toggle, not a vendor renegotiation. If a quarter from now I decide the product is better served by a one-time unlock than by sponsored environments, the codebase doesn't care. Lock-in to an SDK is real, even when the SDK is friendly.

## what the right ad model for a VR voice call probably is

Sketching this here so I can refer to it later when I'm wrong.

Banner ads are out — there is no banner.

Pre-roll video ads are out — they break the call.

In-call ads of any kind are out — the call is the whole product. The moment you put an ad inside the call, you have made the product worse for both the caller and the callee.

What is left is **placement-as-product**. The "teleport" gesture takes you to one of ~2,000 virtual environments. Some are free-to-spawn; some are sponsored. A sponsored environment is itself the ad — a Coca-Cola beach, a Star Wars cantina, a Mahindra showroom — and the user *chooses* to go there because they want to. The brand pays for placement in the catalogue. Engagement is measured as *time spent in the environment per call*.

This is roughly the in-game-advertising model that Massive Inc. tried with Xbox 360 in 2008. The model failed in console gaming because the inventory was too narrow and the buyer side never developed. I think VR voice calling is a different shape — the inventory is the catalogue (small set of curated spaces), the user actively *picks* the placement, and the buyer side is open because every brand wants a "VR experience" anchor.

I don't know if this is right. It is what mAdserve is configured to test.

## the boring infrastructure point

Spinning this up taught me one thing I keep forgetting and re-learning: **the hardest part of monetising a free product is not the ad logic, it's the data plumbing.** Knowing which user did what, where, when, and why — the part that makes ads either valuable or worthless — is product engineering, not ad engineering. The ad server is the smaller half. The instrumentation is the larger half, and it will be the same shape whether I'm serving my own ads or piping into someone else's network.

So the real cost of *running my own* is: I now have to build the instrumentation myself, against my own schema, with my own dashboards. That cost was going to land somewhere regardless. Putting it on my side feels like the right trade for a product where the placement is the product.

More on this once there are numbers worth reporting.

— Karthikeyan
GazeMatic · Teleport Call
