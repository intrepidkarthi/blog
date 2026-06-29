---
title: "On-device AI memory, privacy-first: how DailyVox remembers without a server"
date: 2026-05-14
slug: on-device-ai-memory-privacy-first
excerpt: "An assistant that forgets you every session is a toy. So it needs memory. The easy way to give it memory is to ship your history to a vector database in someone's cloud. DailyVox does not have that option, because nothing leaves the phone. Here is what on-device memory actually takes, and why the data path is different, not just smaller."
tags: [on-device-ai, ai, privacy, dailyvox, memory, ios]
---

An assistant that forgets you every session is a toy. The thing that makes it useful is memory, the ability to notice that you write about the same person every Sunday, that your mood tracks your sleep, that the project you keep avoiding is the one you mention most. Memory is the feature. It is also the feature that quietly breaks most privacy claims.

The reason is the easy implementation. The default way to give an AI app memory is to compute embeddings of everything you have written and store them in a vector database in the cloud, then query that database on every interaction. It works, it is well documented, and it means your entire inner life now lives on a server you do not own. For a journal, that is not a footnote. That is the whole risk.

DailyVox does not have that option, and the constraint is deliberate. Nothing leaves the phone. So memory has to be built a different way, on the device, and it turns out on-device memory is not a smaller version of cloud memory. It is a different data path, and you have to build it as one.

## Embeddings on the device, index on the device

When you write an entry, the embedding, the numeric fingerprint the system uses to find related entries later, is computed on the phone. The index those embeddings live in is also on the phone. Retrieval is a local query against local data. "Remember what I said about my father" becomes a function call, not a network request. There is no point in the pipeline where your text or its fingerprint is handed to a server, because the entire pipeline runs inside the device. This is the part people underestimate when they assume on-device is just cloud with a smaller model. The model size is the easy constraint. The data path is the real one.

## What memory means here, and what it does not

On-device memory forces a useful discipline: you cannot store everything forever and sort it out in a server later, so you have to be deliberate about what is worth remembering. The memory is not a transcript. It is a structured set of things the assistant has noticed, the recurring people, the themes, the patterns over weeks. That happens to be the kind of memory a journal actually needs, and it is the kind a small on-device model can maintain without a data centre behind it. The personalization layer that sits on top of this, an on-device model of how you write, reads from the same local store. Nothing about you needs to leave for the app to know you.

## Storage that even the sync layer cannot read

Memory has to persist and sync across your devices, and sync is where naive privacy dies, because the default sync is a server that can read what it moves. DailyVox uses the encrypted Core Data and CloudKit path so your entries and the memory built from them move between your iPhone and iPad without Apple, or me, being able to read them. I wrote up the sharp edges of that setup in [Core Data plus CloudKit encrypted sync](/writing/coredata-cloudkit-encrypted-sync). The memory inherits the same guarantee as the data it is built from: the keys are yours, the sync layer is blind.

## Why this is becoming the interesting question

In January, MIT Technology Review called what AI remembers about you the next frontier for privacy, and they are right that it is about to matter to everyone. As assistants get persistent memory, the question stops being "what did it answer" and becomes "what does it now know, and where does that live." Most products are answering that question with a server. The honest answer for the most personal data is that it should never have been on a server in the first place. I worked through the broader version of this tradeoff in [Apple Intelligence versus sending it to OpenAI](/writing/apple-intelligence-vs-openai-tradeoffs).

The cost of on-device memory is real. The embedding models are smaller, the index is bounded by the device, and you give up the convenience of treating the cloud as infinite scratch space. What you get is a memory that cannot be breached on a server, because it was never on one. For a journal, that is the only version of memory worth shipping.
