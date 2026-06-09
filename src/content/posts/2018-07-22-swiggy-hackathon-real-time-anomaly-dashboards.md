---
title: "Swiggy hackathon — real-time anomaly dashboards before they were standard"
date: 2018-07-22
slug: swiggy-hackathon-real-time-anomaly-dashboards
excerpt: "Three apps, one delivery network, Kafka and Apache Storm with PostgreSQL geospatial. A weekend in July 2018 building real-time anomaly detection for food delivery."
tags: [hackathon, swiggy, real-time, kafka, apache-storm, postgresql, anomaly-detection]
---

In July 2018 I participated in a Swiggy hackathon where the brief was "do something useful with our data." Swiggy gave us anonymised order, partner, and delivery-fleet data and asked us to find a real problem.

We built a real-time anomaly dashboard for the operations team. The repo, with the demo dashboard, is at [intrepidkarthi/swiggysparks](https://github.com/intrepidkarthi/swiggysparks).

The system caught four categories of anomaly in real time: order-placement delays, restaurant-pickup delays, fleet-acceptance delays, and unusual cancellation spikes. By 2026, real-time anomaly detection on operational data is standard at any meaningful delivery company. In 2018 it was still novel. Here is what we built and what was non-obvious at the time.

## the system

```
data sources           │ consumer app · partner app · delivery fleet app
                        │
ingestion              │ Kafka topics, one per event type
                        │
stream processing      │ Apache Storm topology, per-anomaly bolts
                        │
state and geospatial   │ PostgreSQL with PostGIS for location queries
                        │
output                 │ HTML dashboard with auto-refreshing widgets
                        │ alerts to ops team
```

Three event streams went in. Four anomaly types came out. The dashboard updated every few seconds.

## the four anomalies

**1. Order-placement-to-restaurant-display delay.** When a customer places an order, it should appear on the restaurant's screen within seconds. If the delay exceeds a threshold (varying by restaurant volume), the restaurant has either lost connectivity or is overwhelmed. Either way, the next 30 minutes of orders are at risk.

The Storm topology computed a rolling window of `order_placed_ts - restaurant_displayed_ts` per restaurant. When the median exceeded a threshold, the restaurant got flagged on the dashboard. Operations could intervene before customers started complaining.

**2. Order-placement-to-fleet-acceptance delay.** The time between a restaurant marking an order ready and a delivery partner accepting it. Long delays here meant either too few partners in the area or some kind of pricing problem (low rider incentives in that zone).

PostGIS handled the geospatial part. We could see which delivery zones were experiencing delays and visualise them on the dashboard's map view. The delay heatmap was the most-watched widget during the demo.

**3. Order cancellation spikes.** Normal cancellation rate at any restaurant was 2-5%. Cancellation rate above 15% in a rolling window meant something was actively wrong — the restaurant was closing early, was out of items, or had a payment issue.

This anomaly was the highest-stakes one because cancellations are expensive (refunds, customer churn, fleet wasted-trip cost). The dashboard let operations call the restaurant within minutes of a cancellation spike rather than discovering it the next day in a batch report.

**4. Miscellaneous alerts.** A catch-all for everything else — partner-app crashes (we detected via heartbeat absence), zones with no available riders, kitchen-side timing breakdowns. These were less polished but useful for the demo.

## why the stack

Three reasons we picked Kafka + Storm + Postgres-PostGIS over the alternatives.

**Kafka was the obvious ingestion choice.** By 2018 Kafka had won the streaming-ingestion competition. We picked it without much debate. The Swiggy event volumes (hundreds of thousands of orders per day) fit comfortably in a single broker for the hackathon scale.

**Apache Storm was a deliberate choice over Flink and Spark Streaming.** Storm was the most operationally simple of the three for a 48-hour build. Its programming model — spouts and bolts — was easy to teach to teammates who had not used streaming systems before. Flink would have been more powerful but slower to onboard. Spark Streaming was micro-batch, which did not fit our "sub-second freshness" goal.

**PostGIS for geospatial.** Swiggy data is intrinsically location-based — delivery zones, restaurant catchments, partner positions. PostGIS solved this on a Postgres instance we already had. The geospatial queries (which delivery zones have median acceptance time above 15 minutes?) were write-once and ran fast.

The stack was operationally heavy for a hackathon — three distinct systems (Kafka, Storm, Postgres-PostGIS) to deploy and connect. But each one was off-the-shelf and the integration was straightforward.

## what was non-obvious in 2018

Three things, in roughly the order they surprised teammates.

**The anomaly thresholds had to be per-entity.** A median delay of 60 seconds was fine for a small restaurant and catastrophic for a big one. We tried global thresholds first and got false positives everywhere. Per-restaurant thresholds, derived from each restaurant's own historical baseline, were the only way to make the alerts actionable.

**The dashboard was as important as the detection.** Detecting an anomaly was the easy part of the work. Presenting it to operations in a way they could act on — with context, with the right visualisations, with the right urgency — was the harder problem. We spent half the 48 hours on the dashboard. The Storm topology took the other half.

**Real-time is not always the right granularity.** Some anomalies (cancellation spikes) really did need real-time alerts. Others (long-term drift in restaurant performance) were better surfaced in a daily report. The dashboard ended up with both — a real-time alerts panel and a daily-summary panel — because conflating them produced alert fatigue.

## what we did not solve

Three things we punted on for the demo.

- **Alert routing.** The dashboard fired alerts to a single Slack channel. A real system would have routed alerts to the right operations person based on zone, severity, and time of day.
- **Alert suppression.** Repeated alerts on the same root cause flooded the dashboard. Real anomaly systems need deduplication windows. We had none.
- **Backfill and replay.** Storm topologies process data forward in time only. Replaying past events to test new anomaly rules required separate batch infrastructure we did not build.

These are the things that made the difference between a hackathon prototype and a production system. The Swiggy operations team that maintains the real version of this in 2026 has spent years building exactly these missing pieces.

## what stuck

Two outcomes from the weekend.

**Internal awareness at Swiggy.** The team that judged our work were the operations and engineering leaders at Swiggy. Even though our build did not become a product, the conversation about real-time anomaly dashboards moved internally. Some of what they built later had echoes of what they had seen at the hackathon.

**The team chemistry.** The teammates from this hackathon I stayed in touch with for years afterwards. Three more hackathons followed in different combinations. The 2018 Swiggy weekend was the vetting that produced those later collaborations.

The codebase died with the hackathon. The relationships did not.

## the close

Real-time anomaly detection on operational data is now table-stakes. Every meaningful delivery, ride-sharing, or marketplace company runs something like this — usually with a more mature stack (Kafka + Flink + columnar storage rather than Kafka + Storm + Postgres-PostGIS, but the shape is the same).

The hackathon project was an early version of what the industry standardised over the next five years. Not because we predicted it; because the problem was real and the solution shape was discoverable.

Hackathons are good at this — surfacing problem shapes early, in a low-stakes environment, with people who would not otherwise work together. The hackathon weekend is not the product. The hackathon weekend is the proof that the problem exists and that the team can ship.

If you are at a hackathon now, optimise for the problem you discover, not the demo you build. The demo will not survive. The problem shape might. And the team relationships will, if you are lucky.
