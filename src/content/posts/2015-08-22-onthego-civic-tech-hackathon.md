---
title: "OnTheGo — civic tech in 36 hours at MobileSparks"
date: 2015-08-22
slug: onthego-civic-tech-hackathon
excerpt: "An Android app that lets citizens snap a photo of a civic problem and tag the responsible legislator. Built at MobileSparks 2015 in Bengaluru with two friends and a lot of caffeine."
tags: [hackathon, android, civic-tech, india]
draft: true
source: github
repo_url: https://github.com/intrepidkarthi/OnTheGo
event: "MobileSparks 2015 (YourStory)"
event_theme: "Make For India"
team: ["Karthikeyan NG", "Vinay Venu", "Prasanna Venkatraman"]
---

In August 2015, [YourStory](https://yourstory.com) ran [MobileSparks](https://mobilesparks.in) in Bengaluru — a mobile-first hackathon under the theme **"Make For India"**. Three of us — me, [Vinay Venu](#) and [Prasanna Venkatraman](#) — built an Android app called **OnTheGo**.

## The idea

Indian government had just launched the Swachh Bharat Abhiyan ("Clean India Mission"). Lots of citizens were complaining about civic issues — overflowing bins, broken pavements, stagnant water — but the complaints went into a void. There was no feedback loop, no accountability for the politicians who were supposed to act on them.

OnTheGo flipped that loop:

1. You see something broken on the way home.
2. You snap a photo.
3. The app tags it with location and routes it to the elected representative responsible for that area.
4. The complaint becomes a public, time-stamped record on that politician's "wall."
5. Resolution is tracked. Politicians who fix things look good. Politicians who don't, don't.

The app rode on the rails Swachh Bharat had already laid down (citizen-side momentum, publicity) and added the missing accountability layer.

## What we shipped in 36 hours

| Component | Tech |
|---|---|
| Mobile app | Native Android |
| Auth | Facebook Login |
| Geo-tagging | Google Maps API |
| Backend | Parse (RIP) |
| Image hosting | Cloudinary |
| Push & realtime | Firebase |
| Storage | AWS S3 |

The repo's build instructions are still up at [github.com/intrepidkarthi/OnTheGo](https://github.com/intrepidkarthi/OnTheGo) — though by now most of those credentials are revoked or those services renamed.

## What I'd build differently in 2026

Three things age poorly in a 2015 civic-tech app:

- **Centralized stack.** Parse died. Today this whole thing belongs on Supabase or Cloudflare D1 with Workers. Spin-up time would be 4 hours, not 36.
- **No verifiability.** A 2015 photo + GPS could be faked. In 2026 you can hash + timestamp on a public chain (cheap on Polygon/Base) — citizens get a tamper-proof receipt, politicians can't quietly delete unflattering posts.
- **No model layer.** Today the photo classifier should auto-tag the issue (pothole / garbage / waterlogging), the location mapper should resolve to the correct ward and councillor, and a small LLM should summarize the open-vs-closed scoreboard for each politician monthly. None of that needed humans.

The product idea is, if anything, more relevant now than it was then. The execution rails just got a thousand times better.

## What hackathons taught me that work didn't

I've now done 18 of them. Hackathons train a specific muscle:

> **The only feature that matters is the one you can demo in 90 seconds.**

You will overbuild. You will under-design. You will lose 3 hours to an SDK that worked yesterday. The teams that win don't have more talent — they have a brutal ranking of "what would actually appear on a screen during the demo," and they cut everything else.

That muscle has been more useful in 12 years of CTO work than any architecture textbook.

---

*Source repo: [intrepidkarthi/OnTheGo](https://github.com/intrepidkarthi/OnTheGo). Demo deck and screenshots are in `internal/` — happy to share.*
