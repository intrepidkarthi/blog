---
title: "From hackathons to publishing — how 18 weekends turned into two ML books"
date: 2018-09-01
slug: from-hackathons-to-publishing-ml-books
excerpt: "I bagged 18 hackathon prizes, gave a TEDx talk, and ended up writing two books on mobile machine learning. The connection between the three is not what I expected."
tags: [career, books, machine-learning, hackathons, tedx, meta]
source: github
repo_url: https://github.com/intrepidkarthi/Machine-Learning-Projects-for-Mobile-Applications
amazon_links:
  - "https://www.amazon.com/dp/B07JKWLH3G — Mobile Artificial Intelligence Projects"
  - "https://www.amazon.in/Machine-Learning-Projects-MobileApplications-ebook/dp/B07F2GZQWH/ — Machine Learning for Mobile Applications"
---

I sometimes get asked, "how did you go from hackathons to writing books?" The honest answer: I didn't plan any of it. The path was — I think — typical of how a lot of technical careers in India compound.

## The hackathon years (2014–2017)

I did 18+ hackathons across Bangalore. Sequoia Capital's was [my first](#) (Medic, 2014). YourStory ran [MobileSparks](#) (OnTheGo, 2015). Google did the [Android Indic Hackathon](#) (EmpowerWomen, 2016). Microsoft, Yahoo, Adobe, IBM, Indus Valley Partners, and a half-dozen others ran their own that I jumped into.

What I did not realize at the time: every hackathon weekend was a forced two-day intensive on whatever the latest stack was. TensorFlow Lite when it dropped. ARCore when Google announced it. Core ML the day after WWDC. The sponsor APIs were always the bleeding edge — that was the entire point of the hackathon for the sponsor — and so by accident I ended up with hands-on experience in a pile of mobile-ML primitives that were too new to have proper documentation.

That accidental expertise became the moat.

## Why Packt asked

In late 2017 a commissioning editor at Packt reached out cold. Their pitch was rough: "we're seeing a lot of search demand for 'TensorFlow on Android' tutorials but no books — could you write one?" I said yes for two reasons:

1. **It would force me to consolidate.** I had been building disconnected hackathon projects. A book would force me to design a curriculum.
2. **It would lock in the era.** Mobile ML in 2018 had a 6-month half-life. Writing it down was a way of preserving what I knew before it was obsolete.

Two books came out of that:

- **[Machine Learning for Mobile Applications](https://www.amazon.in/Machine-Learning-Projects-MobileApplications-ebook/dp/B07F2GZQWH/)** (Packt, 2018) — code-light, concept-heavy, for engineers who needed the mental model.
- **[Mobile Artificial Intelligence Projects](https://www.amazon.com/dp/B07JKWLH3G)** (Packt, 2018) — project-driven, full code repo at [github.com/intrepidkarthi/Machine-Learning-Projects-for-Mobile-Applications](https://github.com/intrepidkarthi/Machine-Learning-Projects-for-Mobile-Applications).

What's in the second one: age + gender CNN on TensorFlow Lite. ML Kit for Firebase (text/face/barcode). Core ML on iOS for the same problems. Snapchat-style face filters using OpenCV. A digit classifier with adversarial training to demonstrate why the obvious model breaks. Neural style transfer. On-device food classification via transfer learning.

Most of those projects came directly from hackathon weekends.

## The TEDx invitation

In November 2017 [TEDxSOAUniversity](/tedx-building-better-software) invited me to speak. The talk was titled *"Building Better Software"* — but the actual content was an attempt to compress what I'd absorbed from 15+ hackathons + writing two books into 18 minutes.

The TEDx happened *while I was writing the books*. It was the same material, in three forms, simultaneously: hackathon → book chapter → talk. That triangulation forced clarity. You cannot give a TEDx talk on something you can't say in three sentences. You cannot write a book on something you can't say in three pages. You cannot win a hackathon with something you can't demo in 90 seconds. All three forced me to compress.

## What hackathons + books + TEDx actually taught me

In hindsight, the three were teaching the same thing in different timescales:

- **Hackathon:** can you ship something usable in 48 hours?
- **TEDx talk:** can you compress an idea into 18 minutes that people remember?
- **Book:** can you sustain that idea for 250 pages without losing the reader?

The skill underneath all three is the same: ruthless prioritization of what matters. Hackathons train it on a 48-hour cycle, TEDx on a 6-month cycle, books on a 12-month cycle. By the time I finished the second book I had learned how to think in three timescales at once.

That turned out to be exactly the skill set required to be a CTO. Decisions on a sprint horizon, decisions on a quarter horizon, decisions on a five-year horizon — all happening simultaneously, all trading off against each other.

## Recommendations

If you're early in your career and trying to figure out what to do on weekends:

1. **Do hackathons.** Not for the prize money. For the forced exposure to whatever the sponsor's bleeding-edge stack is.
2. **Take notes during.** Weekend hackathons don't compound unless you write down what you learned. (Confession: I lost 8–10 of mine because I didn't.)
3. **When someone asks you to write or speak, say yes.** It will be twice as much work as you expected and three times as valuable.
4. **Pick a niche where the official documentation is bad.** That's where the writing leverage lives. In 2018 it was mobile ML. In 2026 it's agent infrastructure.

The compounding from hackathons → talks → books → reputation → opportunities → company-building was real, but invisible at any given step. It only made sense in retrospect.

That's how most useful careers work, I think.

---

*Code repo for the projects book: [intrepidkarthi/Machine-Learning-Projects-for-Mobile-Applications](https://github.com/intrepidkarthi/Machine-Learning-Projects-for-Mobile-Applications). The TEDx talk: [Building Better Software](/tedx-building-better-software).*
