---
title: "The privacy-first on-device AI app architecture behind DailyVox"
date: 2026-06-29
slug: privacy-first-on-device-ai-app-architecture
excerpt: "DailyVox runs the AI on your phone, not on my server. That one constraint decides the entire architecture. Every component that is normally a cloud call has to have an on-device answer, or it does not ship. Here is the actual stack, layer by layer, and what each layer costs."
tags: [on-device-ai, ios, privacy, ai, dailyvox, architecture]
---

DailyVox runs the model on your phone. Not the prompt, not a thin wrapper, the inference itself. Your journal never leaves the device, and there is no server of mine that could read it even if subpoenaed, because there is no copy of it on a server of mine at all.

That is one sentence of positioning and a full set of architectural constraints. Once you decide nothing leaves the phone, every part of the app that would normally be an API call has to have a local answer. No answer, no feature. That rule, applied without exceptions, is what designs a privacy-first on-device app. The privacy is not a setting. It is the shape of the build.

Here is the stack, layer by layer, and what each one costs.

## Inference: the model is a local dependency, not a remote service

The first decision is where the tokens are generated. On a modern iPhone the answer is the device. Apple's on-device Foundation Models and the Neural Engine make small-model inference fast enough that a journaling assistant does not need a round trip to anyone's GPU. The cost is real and you pay it up front: you live inside a small model's capability, not a frontier model's. You do not get to phone a 400-billion-parameter friend when the local one is unsure. So the product has to be designed for what a small local model is actually good at, which is summarising, tagging, reflecting back, and noticing patterns in text it already has. I wrote about that trade in more depth in [the economics of on-device AI](/writing/the-economics-of-on-device-ai) and the [Apple Intelligence versus sending it to OpenAI](/writing/apple-intelligence-vs-openai-tradeoffs) tradeoffs. The short version: you trade ceiling for control.

## Memory: retrieval that does not need a server

An assistant that forgets you every session is a toy. So the app needs memory, and memory is where most "private" apps quietly cheat, because the easy way to remember is to ship your history to a vector database in someone's cloud. On-device, that door is closed. The embeddings are computed on the phone, the index lives on the phone, and retrieval is a local query. "Remembering" becomes a function call, not a network request. This is the part people underestimate. Privacy-first memory is not a smaller version of cloud memory. It is a different data path, and you have to build it as one from the start.

## Storage and sync: end-to-end, where even the sync layer is blind

People want their journal on their phone and their iPad. That means sync, and sync is the moment naive privacy claims fall apart, because the default sync is a server that can read what it syncs. DailyVox uses Core Data with CloudKit in its encrypted mode, so the data moves between your devices through Apple's infrastructure without that infrastructure, or me, being able to read it. The keys stay with you. I wrote up the specific gotchas of getting that right in [Core Data plus CloudKit encrypted sync](/writing/coredata-cloudkit-encrypted-sync), because the encrypted path has sharp edges the default path does not. The point for the architecture is simple: the sync layer has to be blind, or the privacy claim is marketing.

## Personalization: a model of you that stays with you

The thing that makes the app feel like yours is a small personal model, what I have called the [TwinEngine](/writing/the-twinengine-personality-model-on-device), built on your own writing, on the device. It is the most personal data in the app and it is the data that most obviously must never leave. Building it locally is harder than calling an API. It is also the only version that is honest.

## What the architecture actually buys, and what it costs

Add the layers up and the cost ledger is clear. You give up the frontier model. You give up the easy cloud vector store. You give up server-side analytics, which means you are partly blind to how the app is used, by design. You take on more engineering for less raw capability.

What you get back is a guarantee you can state in one line without an asterisk: the data is on the device, and there is no server-side copy to leak, sell, subpoena, or breach. For a journal, the most private thing most people own, that guarantee is the product. Everything else is a feature. This one is the architecture.

The whole build is an argument that privacy is not a policy you write. It is a set of components you either have on the device or you do not.
