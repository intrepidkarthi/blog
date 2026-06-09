---
title: "twelve hours setting up RabbitMQ on Ubuntu for an Android chat app"
date: 2013-06-15
slug: twelve-hours-setting-up-rabbitmq-on-ubuntu-for-android
excerpt: "Twelve hours. Ubuntu 12.04. AMQP. An Android chat app that needed reliable message delivery in 2013, before Firebase Cloud Messaging was usable."
tags: [rabbitmq, ubuntu, android, messaging, amqp, infrastructure]
---

I spent more than twelve hours getting RabbitMQ running on Ubuntu 12.04 and an Android client talking to it. In 2013 this was the only sane way to do real-time messaging between Android devices without paying Google Cloud Messaging's reliability tax — and GCM was not as reliable as it looked.

I put the working setup on GitHub at [intrepidkarthi/RabbitMQ-Android-Chat](https://github.com/intrepidkarthi/RabbitMQ-Android-Chat) so the next person who tried this could skip the twelve hours.

## why RabbitMQ in 2013

Real-time messaging on Android in 2013 had three options.

```
GCM (Google Cloud Messaging)   │ low-latency push, but unreliable delivery,
                                │ no message ordering guarantees
XMPP                            │ chat-specific protocol, mature but heavy
                                │ ejabberd or Openfire, complex ops
AMQP via RabbitMQ              │ general-purpose message broker, durable
                                │ queues, ack/nack semantics
```

For an app that needed reliable delivery (a chat client where lost messages were not acceptable), AMQP was the right answer. The trade-off was that AMQP clients on Android were rough. The official RabbitMQ Java client worked but had heavy dependencies for a mobile build. Several third-party AMQP clients existed, of varying quality.

I picked the RabbitMQ Java client and accepted the dependency weight. The alternative was debugging someone else's half-finished AMQP implementation in production, which was worse.

## the server setup

Ubuntu 12.04 was the LTS release that everyone deployed against in 2013. RabbitMQ shipped via Debian packages but the packaged version was behind the upstream. The right move was to add the official RabbitMQ Debian repository.

```bash
# add the rabbitmq repo
deb http://www.rabbitmq.com/debian/ testing main

# trust the signing key
wget http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
sudo apt-key add rabbitmq-signing-key-public.asc

# install
sudo apt-get update
sudo apt-get install rabbitmq-server
```

The word "testing" in the repo URL refers to RabbitMQ's release state, not Debian's. This confused everyone the first time. The "testing" branch was effectively their stable channel for years.

## the management plugin

The thing nobody told you about RabbitMQ in 2013 was that the management web UI was a plugin you had to enable manually. Without it, debugging queue state required `rabbitmqctl` commands and the willingness to read terse status output.

```bash
sudo /usr/lib/rabbitmq/lib/rabbitmq_server-2.7.1/sbin/rabbitmq-plugins enable rabbitmq_management
sudo service rabbitmq-server restart
```

This enabled a handful of related plugins: `mochiweb`, `webmachine`, `rabbitmq_management_agent`, and the management plugin itself. The UI then became accessible on port 55672 (not 15672 — that port number changed in later RabbitMQ versions).

Default credentials were `guest` / `guest`. Anyone with network access to port 55672 had full admin. The first thing you did in production was bind the management interface to localhost or change the credentials.

## the Android client

The Android side was a long-lived service that maintained a persistent connection to RabbitMQ over AMQP. The connection had to survive screen-off, screen-on, network changes (wifi to LTE), and process death.

The hard parts were:

- **Connection lifecycle.** Android's process management would kill background services aggressively. The service had to be sticky (`START_STICKY`) and re-establish the connection on restart. Reconnect logic had to back off exponentially to avoid hammering the server.
- **Authentication.** The Android client needed credentials that were tied to a specific user. Hardcoding `guest`/`guest` was fine for the demo, but production needed per-user credentials, which meant either issuing them at signup or using OAuth-style token auth on the server side.
- **Message ordering.** AMQP doesn't guarantee strict ordering across multiple consumers on the same queue. For chat, this mattered. The fix was per-user queues with single-consumer semantics, which simplified ordering but increased the queue count.

The repo on GitHub had the working Android client and the server-side scripts. The 42 stars it got over the years tell me people kept finding the twelve-hour setup problem and needing a shortcut.

## what I would build differently in 2026

The 2026 version of this app would not use RabbitMQ. The reliable-delivery problem on mobile is now solved by APNs and FCM with better ordering and acknowledgement semantics than 2013, plus dedicated mobile-messaging services (PubNub, Pusher, Ably) that handle the connection lifecycle layer.

For a custom backend, the move would be WebSocket over a TLS tunnel with a server-side persistence layer. Probably Postgres for the message log, Redis for ephemeral state, a thin WebSocket gateway in Go. Total operational footprint: one or two services instead of RabbitMQ's broker plus its plugins.

The 2013 choice was right for 2013. The same choice in 2026 would be over-engineering against problems that no longer exist.

## the lesson

The twelve hours was not wasted. The blog post and the GitHub repo saved hundreds of other developers from spending their own twelve hours on the same setup. The compounding effect of writing down a hard-won setup is much bigger than the original work.

If you do something painful, write it down. The next person doing the same thing pays the cost of your writeup once, not the full twelve hours. The aggregate time savings across all the people who follow you is large, even if individually each one only saves a few hours.

The repo is still there, the README still has the full setup steps, and people still occasionally email me about it. The codebase is dead — RabbitMQ has moved on, Ubuntu 12.04 is long EOL — but the writeup is still useful as a historical record of what mobile messaging looked like before the platforms solved it.
