---
title: "building a second brain that stays on your phone"
date: 2025-12-01
slug: building-a-second-brain-that-stays-on-your-phone
excerpt: "Most second-brain tools assume the cloud. Building one that operates entirely on-device is harder, more interesting, and produces a fundamentally different product."
tags: [second-brain, on-device, privacy, ios, knowledge-management]
---

The "second brain" concept — a personal knowledge system that captures, organises, and surfaces your own thinking — has been popular since Tiago Forte's book of the same name. The standard implementation uses cloud-based tools: Notion, Roam, Obsidian Sync, mem.ai. The data lives on someone's server. The synthesis uses someone's AI.

For most users this is fine. For users where the data is sensitive — health, relationships, finances, internal work concerns — the cloud architecture undermines the product's value. The user self-censors because they know the data is readable.

Building a second brain that operates entirely on-device is harder than building one that lives in the cloud. It is also a fundamentally different product, with different capabilities and different constraints. Here is what changes.

## what an on-device second brain can do

The capabilities that survive the on-device constraint:

```
capture            │ voice, text, photo — all stored locally
transcription      │ on-device speech-to-text
sentiment          │ NLTagger or similar local NLP
entity extraction  │ on-device NER (names, places, topics)
topic clustering   │ on-device embeddings, on-device clustering
search             │ full-text + semantic, all local
weekly digest      │ on-device summarisation
linking            │ wiki-style links between entries
```

The list is shorter than the cloud equivalent. The capabilities that survive are the ones that fit within the on-device model's capability ceiling and within the device's compute and memory budget.

## what an on-device second brain cannot do (yet)

Three categories of capability are not yet feasible on-device.

**Long-context synthesis.** Summarising a year of journal entries requires holding most of them in context. The on-device models in 2025 have context windows of 8k-32k tokens. A year of journaling exceeds this. The synthesis has to be hierarchical — daily summaries, weekly summaries, monthly summaries — which trades fidelity for feasibility.

**Cross-source synthesis.** Combining entries with external data (calendar events, location history, biometric data) is possible but requires careful design. The local model has to know how to combine sources, and the user has to grant access to each source. The orchestration is harder than the cloud equivalent.

**Conversational query.** "Tell me what I was working on last March" requires both retrieval (finding relevant entries) and generation (summarising them). The current on-device foundation models handle this for short-context queries but degrade rapidly for queries that span months.

For each of these, the workaround is either to scope the use case (work within the model's capability) or to provide an opt-in cloud upgrade (the user explicitly sends a query to a cloud model for the long-context case).

## the architecture

The on-device second brain has four layers.

```
1. storage      │ CoreData with CloudKit (encrypted) for sync
                 │ all entries stored in user's own iCloud, not the developer's server
                 │
2. extraction   │ NLTagger for sentiment + NER + POS
                 │ NLEmbedding for semantic search vectors
                 │ Runs at write time, stores extracted features alongside entry
                 │
3. retrieval    │ full-text search + semantic similarity search
                 │ both run locally against stored entries
                 │ no query leaves the device
                 │
4. synthesis    │ Apple Foundation Models (8k-32k context)
                 │ runs on the Neural Engine
                 │ produces weekly digests, monthly summaries, themed views
```

The whole stack runs entirely on the device. No request leaves the phone. No data sits on the developer's server. The architecture choice is the product.

## the sync question

A second brain that only lives on one device is fragile. The user loses the phone, loses the data.

The fix is encrypted sync via the user's own iCloud. CoreData supports CloudKit sync natively. The data is encrypted with keys held only by the user (via iOS's automatic key management). The developer never sees the data, but the user has it on every device they own.

The catch is that the encryption keys are tied to the user's iCloud account. If the user loses iCloud access (forgotten password, account compromise), they may lose the data permanently. This is a real trade-off — the cloud-based alternative would have a developer-side backup that does not exist in the on-device model.

The honest answer is to provide local backup tools — export to encrypted ZIP, periodic reminder to backup to the user's preferred location. The user takes on slightly more responsibility for their data in exchange for the privacy guarantee.

## the synthesis pipeline

The weekly digest is the most interesting on-device synthesis problem. The pipeline:

```
all entries from last 7 days   →   ~7-21 entries, 200-2000 words each
                                ↓
group by topic (clustering)     →   3-5 thematic clusters
                                ↓
summarise each cluster          →   1-2 paragraph summary per cluster
                                ↓
overall week summary            →   3-4 sentences
                                ↓
deliver as a digest card        →   user sees Sunday evening
```

Each step runs on the device. The clustering uses embeddings; the summarisation uses the foundation model with a custom prompt. The whole pipeline takes 10-30 seconds on an iPhone 15.

The output is comparable to what a cloud-based GPT-4o pipeline would produce for the same input. The gap is small because the synthesis problem at this scale (a week of entries, ~10K tokens) is within the on-device model's capability envelope.

## the retrieval pipeline

The harder synthesis problem is retrieval: "find me what I wrote about X six months ago." This requires semantic search across the full archive.

The pipeline:

```
user query               →   embed using NLEmbedding (on-device)
                            ↓
search archive           →   compare against pre-computed entry embeddings
                            ↓
top-5 matches            →   return entries with similarity scores
                            ↓
user reviews             →   manual selection or auto-summarisation
```

The embeddings are pre-computed at write time, so the search is fast. Retrieval over 1,000 entries takes under 100ms. Over 10,000 entries, under 500ms. The on-device model handles this scale without difficulty.

## what makes this product different

A cloud-based second brain optimises for capability. An on-device second brain optimises for privacy. The capability is meaningfully lower. The privacy is meaningfully higher. The two products serve different users.

For a knowledge worker who needs to synthesise across many sources, cite external research, and collaborate with others, the cloud product is better. For an individual whose second brain is intimate — journaling, health, relationships, internal work concerns — the on-device product is the only honest answer.

The market for the on-device product is smaller. It is also less served. Most second-brain tools target the knowledge worker. Almost none target the intimate user. The opportunity is to build the privacy-first second brain that the intimate user actually needs.

## the close

The on-device second brain is harder to build, narrower in capability, and more aligned with the user's actual privacy interests than the cloud alternative.

The technology is now sufficient. Apple Intelligence and equivalent on-device models have closed enough of the capability gap with cloud models that the on-device second brain is viable for the journaling and personal-knowledge use case. The gap will keep closing. The privacy advantage will not change.

Build the on-device version. The cloud version exists and is well-funded. The on-device version is the differentiated product.
