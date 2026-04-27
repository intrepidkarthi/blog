---
title: "Medic — building healthtech logistics at Sequoia's 2014 hackathon"
date: 2014-09-15
slug: medic-sequoia-hackathon
excerpt: "A hospital → patient → pharmacy ecosystem prototype, built in a weekend at Sequoia Capital's 2014 hackathon in Bangalore. Shipped to the Play Store before we left."
tags: [hackathon, healthtech, android, sequoia]
source: github
repo_url: https://github.com/intrepidkarthi/Medic
play_store: https://play.google.com/store/apps/details?id=com.sparks.medic
event: "Sequoia Capital Hackathon 2014"
event_location: "Bangalore"
---

This is the oldest hackathon project I still have a public repo for. In 2014, Sequoia Capital ran a hackathon in Bangalore. I went in with a small team and we came out with **Medic** — a three-sided healthtech logistics app — and a Play Store listing live before the weekend was over.

## The pitch

Indian healthcare in 2014 had three painful steps for any patient:

1. Visit the doctor.
2. Carry a paper prescription to a pharmacy (often two or three before finding everything in stock).
3. Bring the medicines home.

Step 2 was the silent tax — a sick person spending an hour walking around in the heat to fill a prescription that should have just appeared at their door.

**Medic** turned that into:

1. Doctor writes prescription in-app.
2. Patient confirms.
3. The nearest pharmacy with everything in stock auto-accepts the order.
4. Medicines arrive at the patient's home.

Three sides of a marketplace, one app each. We prototyped all three in 48 hours.

## Architecture (2014 edition)

Nothing fancy. The interesting part was the matching logic:

- Pharmacies registered with their inventory + delivery radius.
- When a prescription came in, we ranked pharmacies by `inventory_match × distance × reliability_score` (with reliability initialized to 1.0 for everyone since we had no history).
- The first pharmacy to accept locked the order. If they didn't accept in 3 minutes, the order cascaded to the next-best.
- A simple delivery worker app for pharmacy staff with route optimization (read: open Google Maps with destination pre-filled — we were in a hackathon).

The auto-cascade was the only piece that felt like a system. Everything else was glue.

## Why this matters in 2026

Doctor → patient → pharmacy is now a multi-billion-dollar segment in India. PharmEasy, 1mg, Apollo 24/7, Tata Health all built on the exact pattern we sketched in 48 hours. None of us turned Medic into a company — we all went back to our day jobs Monday morning, which I think about sometimes.

The lesson: **shipping IS the strategy.** A working three-sided MVP at a 2014 hackathon, with an active Play Store listing, with the matching logic actually firing, was already 30% of the work. The other 70% — operations, regulation, capital, distribution — was the hard 70%, and we didn't have the appetite for it. That's a respectable choice. But it's also why hackathons are not businesses.

---

## A note on hackathon archaeology

Every weekend hackathon team has a `play.google.com/store/apps/details?id=...` URL that's been dead for a decade. Mine for Medic might still resolve, might 404, might redirect to a new package. The repo at [intrepidkarthi/Medic](https://github.com/intrepidkarthi/Medic) is the only durable artifact. If I were doing this in 2026 I'd publish to the Play Store under a personal developer account and pin a CHANGELOG entry every time I touched it — even just to say "still alive, last touched on date X." Hackathon URLs deserve gravestones.

---

*Source repo: [intrepidkarthi/Medic](https://github.com/intrepidkarthi/Medic). One of my earliest public projects, now ten years old.*
