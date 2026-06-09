---
title: "pipelineDB and what choosing dead infrastructure teaches you"
date: 2017-02-08
slug: pipelinedb-and-choosing-dead-infrastructure
excerpt: "I built a real-time analytics dashboard on pipelineDB at a January 2017 hackathon. Within 18 months pipelineDB was acquired, deprecated, and EOLed. The dashboard rotted. Here is the lesson."
tags: [pipelinedb, hackathon, real-time-analytics, infrastructure, lessons, postgresql]
---

In January 2017 I built a real-time analytics dashboard at a hackathon using pipelineDB and Python matplotlib. The repo is at [intrepidkarthi/RealTimeAnalytics](https://github.com/intrepidkarthi/RealTimeAnalytics). The choice of pipelineDB was deliberate — it was the most interesting database I had seen that year, and the hackathon was an excuse to learn it.

Eighteen months later, pipelineDB was acquired by Confluent and folded into their kSQL product. The standalone project entered maintenance mode and was eventually EOLed. The dashboard I had built no longer ran against modern Postgres. The repo stayed up but the code was orphaned by its dependency dying.

This was my first real lesson in betting on infrastructure that depends on a single company's survival. Here is what pipelineDB did, why it was attractive, and what choosing it taught me.

## what pipelineDB was

pipelineDB was a Postgres extension that supported *continuous queries*. A normal SQL query runs once against the data at the moment it is issued. A continuous query is registered against the database and continuously updates its result as new data arrives. The output is itself a queryable table.

```sql
-- a continuous view that maintains the count of events per minute
CREATE CONTINUOUS VIEW events_per_minute AS
  SELECT date_trunc('minute', ts) AS minute, count(*)
  FROM events_stream
  GROUP BY minute;
```

Inserts into `events_stream` immediately update `events_per_minute`. There is no batch job. There is no separate worker. The aggregation is maintained incrementally by the database itself.

For real-time analytics, this was magic. You could write your dashboard queries against the materialised continuous views, get sub-second freshness, and have your business logic in plain SQL.

## why it was attractive

Three reasons, in roughly the order they mattered at the hackathon.

**SQL was the interface.** Streaming infrastructure in 2017 mostly used Kafka with custom consumer code in Java or Python. pipelineDB let you write streaming aggregations in SQL. For a hackathon team that knew Postgres but not Kafka, this was a dramatic productivity win.

**Postgres ecosystem.** pipelineDB built on top of Postgres. The same client libraries worked. The same admin tools. The same backup story. Your continuous views looked like materialised views to the application layer.

**The latency was real.** Sub-second updates from insert to dashboard query. We compared against the Kafka + custom-consumer alternative we had also prototyped, and pipelineDB was an order of magnitude lower latency for our use case.

The hackathon dashboard worked. We demonstrated real-time order-flow visualisation against a synthetic data feed. The judges liked it. The repo went up.

## what happened next

Mid-2018: pipelineDB was acquired by Confluent. The standalone project entered "maintenance mode" — bug fixes only, no new features. The team that wrote pipelineDB started building the equivalent functionality into Confluent's kSQL product instead.

Late 2018: the pipelineDB Postgres extension stopped getting updates compatible with newer Postgres major versions. Anyone running pipelineDB on Postgres 10 or earlier was fine; anyone trying to move to Postgres 11 or beyond found that pipelineDB no longer compiled.

2019: official EOL. Confluent did not formally support pipelineDB. The project README pointed users to kSQL.

The repo for our 2017 hackathon project still exists. The code in it still runs, in principle, against the specific Postgres + pipelineDB version it was built for. In practice, nobody could re-run it without provisioning a 2017-era environment, which is itself a significant effort.

## the lesson

The hackathon win was real. The technology choice was wrong, in the sense that the technology did not survive long enough to support a real product.

What I learned, in the months after pipelineDB's deprecation, was that infrastructure choices have a "death risk" that is rarely priced in.

```
                          │ death risk            │ what mitigates it
                          │
single-company OSS        │ high — company can pivot,
                          │ get acquired, or fail        large user base,
                                                          fork-friendly license,
                                                          governance separation
                          │
foundation-governed OSS   │ moderate — survives company
                          │ failures but not project loss usage diversity,
                                                          maintainer pool
                          │
standards-based primitive │ low — protocol outlives the   widely adopted spec,
                          │ implementations               multiple implementations
                          │
hosted cloud service      │ moderate — vendor can EOL    contractual SLA,
                          │ the service                    data-export commitment
```

pipelineDB was single-company OSS. Confluent's acquisition was the death event. The lesson is not that all single-company OSS is bad — much of it is excellent — but that the death risk needs to be priced into the choice, and the price is paid by everything downstream when the upstream dies.

## what I would do now

The 2017 hackathon project would, in 2026, be built differently.

**Streaming SQL primitives are now standard.** Materialised view incrementality is built into Postgres directly via the `LISTEN/NOTIFY` ecosystem. Tools like Materialize and RisingWave provide pipelineDB's functionality on stronger foundations. ksqlDB exists for Kafka-native streaming SQL. The "use SQL for streaming aggregation" pattern is not exotic anymore.

**The standards-based version is closer to viable.** Streaming SQL is becoming standardised across multiple engines. Code written against the standard mostly transfers. The death risk of any single engine is lower because the alternatives are direct migrations.

**Hackathon infrastructure should be re-evaluated by the production-readiness checklist.** Not "is it fast" or "is it cool." But: "if I won the hackathon and got funded, would this technology choice still be defensible in 24 months?" If the answer is unclear, the hackathon code is a prototype that will need a rewrite, not a foundation that can scale.

For pipelineDB specifically: a 2017 project that won funding and continued past the hackathon would have hit the Postgres-version-compatibility wall in 2018-2019 and faced a forced migration. The fact that it died at the hackathon spared it the migration cost. The repo's deadness is the lower-cost outcome.

## the close

Choosing dead infrastructure is not a moral failure. It is a known risk of betting on novel tools. The compensation is the productivity gain at the time of the bet. The cost is the eventual migration when the tool dies.

The math works out positive if you migrate cheaply or if the original gain compounded enough that the migration is paid for. The math works out negative if the migration is expensive and the original gain was modest.

For pipelineDB in 2017, the math worked out neutral. The hackathon team learned something. The codebase was small enough that throwing it away cost nothing. The lesson — to discount infrastructure novelty by its death risk — is the durable output.

If you are choosing infrastructure now, ask: "what happens to my code if the company behind this dies?" If the answer is "I rewrite the data layer in two weeks," fine. If the answer is "I am stuck," pick something else. The question is cheap to ask. The answer compounds.
