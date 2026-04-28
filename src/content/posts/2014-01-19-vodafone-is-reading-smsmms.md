---
title: "Vodafone is reading SMS/MMS — what I caught in the metadata"
date: 2014-01-19
slug: vodafone-is-reading-smsmms
excerpt: "Noticed something strange in the headers of an MMS that arrived from Vodafone India. Some metadata that does not seem like it should be there. Two screenshots and a few questions that I do not have good answers for."
tags: [security, vodafone, privacy, india, telecom, mms, sms]
---

Noticed something strange this week. An MMS arrived on my phone from a friend, and when I dug into the message metadata in the Android *Messaging* app's debug view, there were headers I hadn't seen before — fields that suggested the carrier (Vodafone India, in my case) was processing the message body in a way that's a step further than "switch this from device A to device B."

I'm putting the screenshots up here in case anyone else is seeing the same thing and wants to compare notes. I'm not making strong claims. I'm asking questions.

![Vodafone MMS issue — first screenshot](/images/articles/vodafone-2014/01.png)

![Vodafone MMS issue — second screenshot](/images/articles/vodafone-2014/02.png)

## what the headers seem to suggest

The fields I noticed:

- A `X-Mms-Content-Location` that pointed at a Vodafone-internal MMSC URL — this part is normal, every MMS has one of these and it's how the recipient device fetches the binary.
- A second header that referenced a *content-classification* value. This one is the part I'm raising my eyebrows at. *Classification* implies someone (or something) inspected the content and assigned it a tag.
- A timestamp that's earlier than the timestamp the sender's phone reported sending it. Small drift, maybe minutes — but the *direction* of the drift is interesting. The carrier-side timestamp is older than the device-side timestamp. That's unusual.

I am not a telecom protocol expert. The MMS spec (3GPP TS 23.140 if you want to read along at home) does include legitimate carrier-side fields and some of these may be mundane. But *content-classification* on a peer-to-peer MMS, between two consumers, is not something I've seen documented as a default behaviour.

## the question I'm asking

When you send an SMS or MMS in India today, does the carrier — beyond *transit* — read, classify, or store the message body for any purpose other than delivery?

The cynical answer is *yes, of course, this has been the case for years and the law-enforcement framework explicitly assumes it.* The Indian Telegraph Act 1885 and its more recent updates give law-enforcement the right to intercept messages with appropriate warrants. That is not the question.

The question is whether Vodafone — or any carrier — is doing **routine** classification of message content for non-law-enforcement purposes (advertising signals, traffic analytics, marketing segmentation), independent of whether they're being asked to. The presence of a *classification* header in an end-user-visible metadata block is the kind of artifact that suggests "yes" rather than "no."

## what would resolve this

A clean experiment: send the same MMS from the same device, on the same network, to the same recipient, multiple times across days. If the classification field is consistent, it's a deterministic process. If it's empty or absent on some sends, it's intermittent — which would suggest the classification isn't being applied to every message.

I'll run this when I get a few free hours. If anyone reading this is on Vodafone India and sees similar headers, please send a screenshot. I'd like to know if this is a wide-spread default or a quirk of my specific account/device.

## the broader point

Telecom in India is in a moment of *quiet metadata expansion*. The carriers know the country is moving toward more regulated content, more KYC, more identity-tied messaging — Aadhaar verification is rolling out, the *anti-spam* DND framework adds another layer, and the upcoming changes to interception rules will codify what carriers can and cannot retain.

In that environment, headers that look like *content-classification* should be the kind of thing the user can audit and the carrier can explain in plain language.

So far they have not been. I'd like that to change. This post is one tiny data point.

— Karthik

*Update: if you're a Vodafone customer-service rep reading this and you can explain what the classification field does, I am genuinely interested. The thumbs-up is at the bottom of the page. The contact form is in the menu.*
