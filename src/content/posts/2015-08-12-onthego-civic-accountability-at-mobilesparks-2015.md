---
title: "OnTheGo — civic accountability at MobileSparks 2015"
date: 2015-08-12
slug: onthego-civic-accountability-at-mobilesparks-2015
excerpt: "Thirty-six hours, three of us, one theme: Make For India. The civic-accountability app we built at MobileSparks, what it did, and why it never made it past the venue."
tags: [hackathon, mobilesparks, yourstory, civic-tech, android, india, make-for-india]
---

In August 2015, three of us — Vinay Venu, Prasanna Venkatraman, and me — built a civic-accountability Android app over 36 hours at the MobileSparks hackathon organised by YourStory in Bengaluru. The theme was *Make For India*. The brief was open.

The app we built was called *OnTheGo*. The idea was simple. A user spots a civic incident — broken road, uncollected garbage, illegal dumping, unsafe construction. They open the app, snap a photo with their location, and submit. The submission is tagged to the politician whose constituency it falls under. The politician's public dashboard accumulates incidents over time. Their accountability rises with the count. The Swachh Bharat Abhiyan, which had launched the previous year, would pick up the cleanliness-tagged submissions and route them to the right local administration.

The repo for the build is at [intrepidkarthi/OnTheGo](https://github.com/intrepidkarthi/OnTheGo). The README from August 9, 2015, has the exact build instructions, the credentials it needed, and screenshots of the working demo.

## the tech stack

Hackathon stacks in 2015 had a specific shape. Backend was a constellation of free-tier services held together by string. Frontend was a single Android app. The integration layer was whatever you could wire up in 36 hours.

```
identity / auth     │ Facebook Login SDK
location            │ Google Maps API
backend / data      │ Parse (RIP)
image storage       │ Cloudinary
realtime / push     │ Firebase
file / API hosting  │ AWS (custom server, not included in repo)
```

Six external services for a 36-hour build. Each one had its own API key, its own SDK, its own quirks. The credentials block in the README listed all of them as required for compilation. The repo could not be built without registering for all six accounts.

This was normal for 2015 hackathon Android apps. The alternative was building auth from scratch and operating your own image store, which was impossible in the time budget. The trade-off was that the app's working state depended on six external vendors continuing to exist and continuing to offer free tiers.

Parse, the centerpiece, was acquired by Facebook in 2013 and shut down in January 2017. The OnTheGo build that worked at the hackathon broke the moment Parse went offline. The repo is preserved but unrunnable in 2026 without re-implementing the backend.

## what we showed the judges

The demo flow was three taps.

Tap one: open the app, location auto-detected, camera opens.
Tap two: snap a picture of the civic incident (we'd staged a few "incidents" with chalk and crumpled paper around the venue).
Tap three: select the category (cleanliness, road, water, electricity, civic services, other). Submission goes up.

Then the second device, a politician's view, would show the new incident appearing on their map with a notification. The dashboard had a counter — total incidents, resolved, pending. The politician could mark items as resolved with a separate flow.

The judges liked it. We got positive feedback and met several other teams whose builds we admired. The hackathon ended on a high.

## why it did not survive

Three reasons, in retrospect.

**Distribution to non-metro India was missing.** The app worked great on the urban tech-fluent Android user. The actual user base that civic-accountability needed — non-metro India, less tech-literate, often non-English — was unreachable through the channels we knew. The Play Store was the wrong distribution mechanism for this audience. WhatsApp would have been the right one. We had no path to WhatsApp.

**The politician side required cooperation we did not have.** For the app to actually drive accountability, real politicians had to look at the dashboard. We had built the consumer side; the politician side was a mocked-up dashboard that nobody outside the team logged into. Getting real politicians to engage required organisational sales work that a three-person hackathon team could not do.

**The Swachh Bharat integration was directional, not real.** We had a hand-wave "this would route to Swachh Bharat" line in the pitch. The actual integration would have required an API or formal partnership with the program. Neither existed. Civic-tech in India in 2015 was almost entirely good intentions without operational infrastructure.

The project ended at the hackathon. The repo stayed up. The screenshots are still in it. The codebase is unrunnable because Parse is dead, but the README is preserved as documentation.

## what civic tech needed in 2015 (and still needs)

The OnTheGo team's mistake was solving the technology problem and assuming the rest would follow. The technology problem in civic tech is the smallest problem. The actual problems are:

- **Distribution to the people who experience civic issues.** Not English-language Twitter. WhatsApp groups, vernacular YouTube channels, community organisations. The hackathon model produces apps designed for the tech-fluent urban audience that does not have the civic problems.

- **A feedback loop with people who can act on the report.** Without engaged local administrators, the report goes nowhere. The successful civic platforms (FixMyStreet in the UK, 311 in US cities) work because the local government is the consumer of the data. India in 2015 had no such consumer.

- **Sustained engagement past launch week.** Civic engagement decays fast. A platform that demands daily action from users will lose them. The successful ones make engagement passive (you don't have to remember; the system surfaces what matters) rather than active.

We had none of these. The hackathon optimised for what we could build, not for what would work. In retrospect, this is the most common failure mode of social-good hackathon projects across every theme and every year.

## what survived

The team. Vinay Venu and I have stayed in touch since 2015. Prasanna Venkatraman runs his own work and we cross paths occasionally. The 36 hours of working together under pressure was the cheapest team-vetting I have ever paid for. Three years of professional acquaintance compressed into one weekend.

That is the durable output of a hackathon. The code dies. The team relationships, if they survive the weekend, can compound for years.

## what I would build differently now

Three things age poorly in a 2015 civic-tech app. The centralized stack — Parse died; today the whole backend belongs on something like Supabase, and the spin-up would take 4 hours, not 36. The lack of verifiability — a 2015 photo + GPS could be faked; today you can hash and timestamp the submission cheaply on a public chain, so citizens get a tamper-proof receipt and politicians cannot quietly delete unflattering posts. And the missing model layer — today the photo classifier should auto-tag the issue, the location mapper should resolve to the correct ward and councillor, and a small model should summarize each politician's open-vs-closed scoreboard monthly. None of that needs humans anymore.

The product idea is, if anything, more relevant now than it was then. The execution rails just got a thousand times better. The lesson that did transfer from the weekend: the only feature that matters is the one you can demo in 90 seconds. That muscle has been more useful in years of CTO work than any architecture textbook.

## the close

OnTheGo did not change Indian civic accountability. The repo sits on GitHub as evidence that the idea was tried. The seven stars it has accumulated since 2015 are mostly people googling around "MobileSparks 2015" or "Make For India app" and finding it.

That is enough. Not every hackathon project is supposed to become a company. Most of them are supposed to teach the team something, vet a few relationships, and produce a small artifact that records what was attempted. OnTheGo did all three.

If you are at a hackathon now, optimise for the team you find and the lesson you carry. The project itself will not survive. The team and the lesson can.
