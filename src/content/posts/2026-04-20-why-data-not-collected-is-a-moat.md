---
title: "why 'Data Not Collected' is a moat in 2026"
date: 2026-04-20
slug: why-data-not-collected-is-a-moat
excerpt: "Apple's strictest privacy label. What it actually requires, why almost no app gets it, and why the gap will widen every quarter."
tags: [privacy, apple, ios, product, moat]
---

Apple's App Store privacy nutrition labels have a strictest classification. On the install screen it reads, in exactly six words: **"The developer does not collect any data."** Most apps in the consumer space cannot get there. The ones that can have a marketing asset and an architectural commitment that competitors cannot copy in a quarter.

This is the story of why the label is hard, why it compounds, and why the app I am about to ship is built around it.

## the label taxonomy

Apple's privacy labels grade apps across three tiers, plus the strictest one.

```
Data Used to Track You      │ data sent to third parties for ads / tracking
Data Linked to You          │ collected and tied to user identity
Data Not Linked to You      │ collected but anonymised
[no entry]                  │ "Data Not Collected" — strictest
```

Most apps land in *Data Linked to You*. Email addresses, device IDs, crash reports tied to user accounts, analytics tied to install. Once any of those flow, the app is off the strictest label.

The *Data Not Collected* tier requires that the developer collects nothing. Not anonymised. Not aggregated. Not crash logs with device IDs. Nothing. The user installs the app and the developer never sees a single byte of telemetry.

## what it actually requires

Five architectural commitments. Missing any one of them disqualifies the app.

```
1. no analytics SDK         │ no Mixpanel, Amplitude, Firebase, PostHog
2. no crash reporter        │ no Sentry, Bugsnag, Crashlytics
3. no remote config         │ no LaunchDarkly, no feature flags from a server
4. no user accounts         │ no sign-in, no email, no Apple ID tied to a record
5. no third-party APIs      │ no OpenAI, Algolia, Stripe (unless local-only)
```

That is a hard list. It means the developer is flying blind on most of the operational signals product teams take for granted. No retention curves. No funnel analysis. No A/B testing infrastructure. No crash dashboards.

The architectural fix is to do everything locally. Crash reports go into a local log file the user can choose to share. Feature flags become build-time constants. Analytics become opt-in user-shared bug reports. Every category of remote infrastructure becomes a local equivalent or gets removed.

The cost is real. The benefit for the user is also real — they get a tool that does not phone home, ever, by construction. For privacy-sensitive categories, the cost is worth paying. For most categories it is not.

## why almost no app gets there

The competitive pressure pushes the other way. A product manager who wants to ship a feature this quarter cannot afford to do everything on-device when there is a five-line OpenAI API call that solves the problem. The on-device path costs months of engineering. The cloud path costs minutes.

Most teams make the same call. The result is that the *Data Not Collected* label is rare. Out of roughly two million apps in the App Store, fewer than 0.5% qualify. The ones that do are concentrated in narrow categories — note-taking, password managers, a few games, a few specialty tools.

In journaling specifically, almost none. Day One collects data linked to you. Reflectly collects data linked to you. Stoic collects data linked to you. The category is built on cloud sync, cloud analytics, cloud AI features. Every one of those decisions disqualifies the app from the strictest label.

## why the gap compounds

Apple's privacy rules have been getting stricter every year since 2020. App Tracking Transparency, then privacy nutrition labels, then required reasons for sensitive APIs, then on-device-by-default for several capabilities. Each step makes the cheap path (cloud-everything) more expensive, in compliance and in user trust, while making the hard path (on-device-everything) more accessible because Apple keeps shipping the primitives.

The first iOS that mattered for on-device AI was iOS 17. The current models on iOS 19 are dramatically more capable. Each year, the on-device capabilities catch up with what last year required the cloud. Each year, the privacy rules tighten on what the cloud requires. The two lines are converging — capability rising on-device, compliance friction rising for cloud.

For a developer who committed to on-device architecture three years ago, the platform is moving toward them. For a developer running on cloud APIs, the platform is moving away. The moat is partly architectural choice, partly time-and-Apple-tailwind.

## why journaling is uniquely positioned

Five reasons the privacy moat is bigger in journaling than in any other consumer category.

1. **The data is the most intimate data the user generates.** Medical apps come close. Banking apps do not — money is less private than thoughts.

2. **The user already self-censors when they suspect the data is read.** This is the lethal failure mode. A journal that the user does not trust gets only the safe entries. The whole product proposition collapses.

3. **There is no obvious "monetise the data" path that would justify collection.** No advertiser wants to buy "what Karthik wrote in his diary last Tuesday." The only reason to collect would be to enable features — and the features can be built on-device.

4. **Apple Intelligence is already capable enough.** The on-device models handle the journaling use cases without cloud. The "we need cloud for the AI" excuse does not hold here the way it does for image generation.

5. **The category is small enough that "privacy-first" is a recognisable position.** A small enough category lets a single product own the privacy claim. In a crowded category like notes or photos, the position gets diluted.

## marketing as architecture

The hardest part is that "Data Not Collected" is not a sticker you can slap on a product. It is the result of a hundred small architectural decisions across the entire codebase. You cannot retrofit. You cannot add it later. You build the product around the constraint or you do not get the label.

This is also why it is a moat. Competitors who already shipped with analytics SDKs and cloud APIs cannot remove them in the next release. The data they have collected is on their servers, the contracts with vendors are signed, the dependencies are deep. The migration to *Data Not Collected* is a complete rebuild for most apps. Most teams cannot justify a complete rebuild on a privacy claim alone.

For a new app, the choice is made on day one. Build for the label or build for the easy path. The build for the label takes months longer up front. The payoff is structural — the architecture itself becomes the differentiation, and the differentiation lasts as long as the architecture does.

That is the bet I have spent six months making. The app ships next week. The whole product is built around six words on the install screen.

---

→ Earlier: [Apple Intelligence vs sending it to OpenAI — the actual tradeoffs](/writing/apple-intelligence-vs-openai-tradeoffs)
→ Next: [DailyVox: why I built a voice journal that stays on your phone](/writing/dailyvox-why-i-built-a-voice-journal-that-stays-on-your-phone)
