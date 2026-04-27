---
title: "EmpowerWomen — 18 hours at Google Bangalore for rural India"
date: 2016-04-20
slug: empowerwomen-google-indic-hackathon
excerpt: "An Android survey-collection app for rural India, built in 18 hours at the Google Android Indic Hackathon. ODK on the front end, App Engine on the back."
tags: [hackathon, android, social-good, google, india]
source: github
repo_url: https://github.com/intrepidkarthi/EmpowerWomen
event: "Google Android Indic Hackathon"
event_location: "Google, Bangalore"
duration: "18 hours"
---

Google ran an **Android Indic Hackathon** at their Bangalore campus. The brief was open-ended — build something Android-first that mattered for an Indian-language audience. We had 18 hours.

We built **EmpowerWomen** — a survey collection app for fieldworkers gathering data in rural India.

## The problem we picked

In rural India, almost every government program — sanitation, education, anganwadi, women's self-help groups, vaccination drives — depends on field workers walking door-to-door with pen and paper, then transcribing the responses back into a computer at the block office. The transcription step is where the data dies:

- Handwriting errors get baked into the dataset.
- Rows go missing because the worker's bag got wet on the bus ride home.
- The block office Excel file ages out of sync with what was actually collected.
- By the time the data reaches the state level, it's three weeks old and partly fictional.

A ruggedized Android tablet with a survey app fixes all four — *if* it can survive intermittent connectivity, low literacy, multiple Indic scripts, and a worker who's never used a smartphone.

## What we shipped

| Layer | Choice |
|---|---|
| Front end | Android, [Open Data Kit](https://opendatakit.org) (ODK) SDK |
| Backend | Google App Engine |
| Sync | ODK's built-in offline-first model |
| Multi-language | ODK XForms, Hindi + Tamil + English at launch |

The decision that saved us was using **ODK** instead of building a survey form engine from scratch. ODK had been deployed for over a decade in WHO field studies, USAID polio campaigns, KoBoToolbox; the form definitions were battle-tested for low-bandwidth environments. We piggybacked on a stack that had already solved the hard problems and spent our 18 hours on the Indic-language layer and the App Engine sync.

## Lessons from the 18-hour timebox

Three rules I now use on every short timebox:

**1. Pick infrastructure that's already proven for your use case.** ODK had decades of field deployment. Trying to write a survey form engine from scratch would have eaten 12 of our 18 hours. The right cliché: "good engineers ship features, great engineers ship choices."

**2. Demo-first design.** We built the app backwards from the demo — what does the judge see in 90 seconds? A worker tapping through a survey in Tamil, going offline, the form re-syncing automatically when wifi returns. Everything that didn't appear in those 90 seconds was cut.

**3. Social-good narrative > tech complexity.** The hackathon judges weren't optimizing for cleverness. They were optimizing for "does this matter and can it ship?" Even modestly clever tech wrapped in a real-world problem with named beneficiaries beat the technically beautiful demos that solved nothing.

## What it would look like in 2026

Same stack but:

- ODK is still ODK. Don't rebuild it.
- Whisper-class speech-to-text on-device for workers who can't read or write. (Crucial — we ignored this in 2016 and shouldn't have.)
- Small Indic-language LLM for inline data validation: "this row says she's 4 years old, are you sure?"
- Encrypted at-rest by default, since field tablets walk away.
- A satellite fallback (Starlink Roam, JioSpaceFiber) for genuinely remote villages where even GPRS doesn't reach.

The stack got better. The problem hasn't changed.

---

*Source repo: [intrepidkarthi/EmpowerWomen](https://github.com/intrepidkarthi/EmpowerWomen). 18 hours, three engineers, Google's Bangalore campus, a lot of caffeine.*
