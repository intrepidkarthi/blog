---
title: "the TwinEngine — building a personality model entirely on-device"
date: 2026-05-30
slug: the-twinengine-personality-model-on-device
excerpt: "The TwinEngine reads a year of your journal entries and builds a model of how you think, what you care about, and what triggers your worst weeks. Everything runs on your phone. Here is how."
tags: [ios, on-device, personality, twinengine, ai, dailyvox]
---

The TwinEngine is the component of DailyVox that reads your journal entries and builds a model of you over time — communication style, emotional signatures, recurring concerns, named relationships, repeated triggers. The model gets called a "Twin" because by year two, the model can answer questions about you that you might not be able to answer about yourself.

The structural constraint: everything runs on the user's device. The Twin is built locally, queried locally, and stored locally. The personality model never leaves the phone for processing.

Here is the architecture.

## what the Twin actually knows

After six months of consistent journaling, the Twin has accumulated specific knowledge in five dimensions.

```
dimension              │ what the Twin learns
─────────────────────────────────────────────────────────────────
communication style    │ vocabulary, sentence length, formality, register
emotional patterns     │ what topics correlate with bad weeks
named entities         │ who the user mentions, in what contexts
recurring concerns     │ what topics resurface across weeks
behavioural triggers   │ what events precede specific emotional states
```

These are not generic personality dimensions (Big Five, MBTI). They are specific to the journal's actual content. The Twin does not know whether the user is "extroverted." The Twin knows that the user mentions work stress 3x more often on Sundays, talks about a specific family member with consistently positive sentiment, and uses the word "stuck" in 70% of entries flagged as depressive.

## the architecture

The TwinEngine has three layers.

```
1. extraction layer    │ runs at write time
                        │ each entry produces a structured record
                        │ (sentiment, entities, topics, embedding)
                        │
2. aggregation layer   │ runs nightly
                        │ aggregates daily extractions into weekly, monthly,
                        │ rolling-90-day summaries
                        │
3. query layer         │ runs on demand
                        │ user asks "what triggered last week's bad days"
                        │ Twin retrieves relevant entries, summarises, responds
```

Each layer runs entirely on the device. The extraction layer uses NLTagger and NLEmbedding (Apple's NaturalLanguage framework). The aggregation layer uses standard data operations on the extracted features. The query layer uses Apple's on-device foundation models for summarisation.

## the extraction layer

Every entry, when written, goes through a deterministic extraction pipeline:

```
voice recording            (audio file, encrypted)
        ↓
SFSpeechRecognizer         (on-device transcription)
        ↓
NLTagger sentiment         (sentence-level sentiment scores)
        ↓
NLTagger NER               (named entities: people, places, things)
        ↓
NLTagger POS               (parts of speech for lemmatisation)
        ↓
NLEmbedding                (768-dim semantic vector)
        ↓
custom topic classifier    (~30 personal topic categories)
        ↓
stored alongside entry     (encrypted, in CoreData)
```

The extraction is structured. The output is a record with fixed fields, not a free-text summary. The structure is what makes the aggregation layer fast.

The custom topic classifier is trained per user over time. On day one it uses a default classifier with broad categories (work, relationships, health, finance, etc.). As the user journals, the classifier adapts to the user's specific vocabulary — "the project" becomes its own topic, "Sarah" becomes a recognised entity-with-context.

## the aggregation layer

Nightly, the device runs a background job that consolidates the day's entries into rolling aggregates.

```
daily aggregate          │ today's entries summarised
weekly aggregate         │ last 7 days, themes + sentiment trend
monthly aggregate        │ last 30 days, recurring topics
90-day aggregate         │ last 90 days, behavioural patterns
yearly aggregate         │ rolling 365-day view (built incrementally)
```

The aggregates are themselves stored. The Twin queries the aggregate layer for fast responses, then falls through to the raw entries for detail when needed.

This is the standard architecture for any time-series database — pre-compute the aggregates so queries are fast — applied to personal data. The result is that "show me what last month looked like" returns in milliseconds because the monthly aggregate is already computed.

## the query layer

The user asks the Twin a question. The query layer:

```
1. parse the query        │ what time range, what dimension
2. retrieve aggregates    │ pull the relevant pre-computed summaries
3. retrieve entries       │ fetch supporting raw entries
4. summarise              │ use on-device foundation model to produce response
5. cite sources           │ link the response back to specific entries
```

Step 4 uses Apple's on-device foundation model (~3B parameters in 2026). The model is given the relevant aggregates and entries as context (typically 4-8k tokens) and produces a response. The response includes citations to specific entries the user can verify.

The capability ceiling of the on-device model is real. The Twin cannot do tasks that exceed the model's context window — "summarise the last three years of my life" requires more context than the model can hold. The Twin handles these queries by hierarchical summarisation: it summarises each quarter separately, then summarises across quarters.

## the privacy architecture

The Twin's data flow stays entirely on the device:

```
where it lives           │ how it is protected
─────────────────────────────────────────────────────
extracted features       │ CoreData, encrypted at rest with AES-256-GCM
aggregates               │ same
foundation model         │ Apple's on-device model, Neural Engine
query/response cache     │ local SQLite, encrypted
shared with anyone       │ nothing
```

The Twin's outputs are visible to the user via the app. The Twin's inputs and internal state are never exfiltrated. The developer (me) has no access to any of it. The architecture refuses to permit cloud processing.

The user can verify this. Charles Proxy or Little Snitch will show zero outbound traffic from the TwinEngine processes. The privacy claim is mechanical, not policy-based.

## what the Twin does well

After six months of consistent journaling, the Twin is good at:

```
- identifying recurring topics the user did not consciously notice
- spotting sentiment shifts that precede bad weeks
- mapping relationships between specific people and emotional patterns
- producing weekly digests that are accurate and useful
- answering specific questions about historical entries
- noting communication-style changes over time
```

After eighteen months, the Twin becomes useful for forecasting: which life events tend to precede stressful weeks, which behavioural patterns correlate with productive months. The forecasts are personal, not generic.

## what the Twin does not do

Three deliberate non-features.

**It does not give advice.** The Twin reports patterns. It does not say what the user should do about them. The user makes the decisions; the Twin provides the data.

**It does not predict the future probabilistically.** The Twin can say "the last three times you mentioned this concern, your next week was harder than average." It does not assign confidence intervals or run formal predictions. The output is observational, not predictive.

**It does not interact unsolicited.** The Twin only speaks when the user asks. No notifications. No nudges. No "you should journal today" reminders. The user controls when the Twin is consulted.

These constraints are choices. A more aggressive Twin would notify the user when patterns are detected, predict outcomes, recommend interventions. The aggressive version is more engaging in the short term and worse for the user in the long term. The conservative version respects the user as the decision-maker.

## the close

The TwinEngine is the most interesting engineering work in DailyVox. It is also the most aligned with the product's core value — turning journal entries into a model of the user that grows more useful over time.

The on-device architecture makes the Twin slower to build than a cloud version would be. It also makes the Twin honest. The user knows the model of them is theirs, not the developer's. The trust that follows from that honesty is what produces the willingness to journal openly, which is what produces the data that makes the Twin valuable.

The privacy is not a constraint. The privacy is the product.
