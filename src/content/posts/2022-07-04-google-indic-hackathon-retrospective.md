---
title: "Google Indic Hackathon — what we built, what survived"
date: 2022-07-04
slug: google-indic-hackathon-retrospective
excerpt: "Six years after the Google Indic Hackathon, the project we built is gone. The relationships are not. The lesson, late."
tags: [hackathons, google, retrospective, india, indic, languages]
---

In April 2016 we participated in the Google Indic Hackathon in Bangalore. The brief was to build something that improved the experience of Indic-language users on the web. Our team built a tool to help small-business owners in non-metro India publish content in their native language, using a combination of voice input, transliteration, and AI-assisted translation.

The project did not survive as a product. The team did. Six years later, three of the four people on that team are still in my orbit, two of them as collaborators on other things. The hackathon's output was the team, not the code.

This is a retrospective on what we built, why it did not survive, and what did.

## what we built

The tool had three components.

```
1. voice input        │ user speaks in Tamil/Telugu/Hindi/Bengali
2. transliteration    │ rough phonetic conversion to script
3. cleanup            │ AI-assisted correction and formatting
```

The user spoke a sentence. The system produced a roughly-correct version in script. The user reviewed and edited. The cleaned text was posted to a Blogger or Tumblr account via API.

This was 2016. The voice models were the open-source ones available at the time. The transliteration was rule-based with phonetic dictionaries. The "AI-assisted correction" was, in retrospect, mostly heuristic — there was no LLM to throw at the problem.

The demo worked. The judges liked it. We won a category prize. We went home with conviction.

## why it did not survive

Three reasons, in order of importance.

**The voice models were not good enough yet.** Tamil voice recognition in 2016 was usable for clean speech in a quiet room but failed for street-level voice in a noisy environment. Our target users — small-business owners in non-metro India — generated exactly the wrong audio for our model. We had a demo that worked for us, in a clean room, and failed for the actual user base.

**The distribution channel did not exist.** We assumed users would discover the tool through Google search or app store optimization. In non-metro India in 2016, the actual distribution channel was WhatsApp. We had no path to WhatsApp. The users we wanted to reach were not finding new tools through the channels we knew how to use.

**The business model was unclear.** We thought we would charge for the cleanup service. The actual users could not pay. They could pay ₹50/month at most, and at that price the unit economics did not work given our voice-API costs.

Any one of these three would have killed the project. All three together made it impossible.

## what did survive

The team. Three of the four members are still in my professional network. Two of them have collaborated with me on other projects since. The hackathon turned out to be the cheapest possible vetting for "can these people work together when things are hard." We learned more about each other in 48 hours than we would have in months of normal interaction.

That vetting compounded. The two of them I have collaborated with since: one is a co-author on technical content I have published, one is someone I have hired at two different companies. The lifetime value of those relationships is enormous. The hackathon was the cheapest possible introduction.

The lesson, late: the durable output of a hackathon is rarely the project. It is the people you discovered you could trust under pressure. The intellectual property of the project itself is a liability that ages out within months. The relationships do not.

## what India needed in 2016 vs what it needs now

The 2016 project was building for a real need. Indic-language content production *was* hard. Small-business owners *did* want to publish in their language. The market was real. The product was wrong for the market.

The 2022 version of the same need looks different. WhatsApp now handles voice-to-text in Indic languages natively. ChatGPT and similar tools translate and correct text across major Indian languages with much higher accuracy than 2016 systems. The voice-to-blog pipeline we built can be replicated in 50 lines of code, using APIs that did not exist when we built the prototype.

The need is mostly solved. The market we were targeting in 2016 is now served by general-purpose AI tools, plus WhatsApp, plus the dramatic improvement in mobile keyboard inputs for Indic scripts. The specific tool we tried to build is obsolete in the same way that single-purpose photo editors are obsolete now that the default phone camera handles 90% of the use case.

What India needs *now* that it did not need in 2016: better tooling for the *production* of long-form video content in Indic languages, better discoverability of Indic-language video on YouTube, better infrastructure for short-form audio content (podcasts, voice notes, voice-based commerce). The general-purpose AI tools have largely solved the text problem. The video and audio problems are still wide open.

## the lesson for hackathons specifically

Pick a hackathon for the team you will discover, not the project you will build. The project, statistically, will not survive. The team, if it works, can compound for a decade.

Optimise the team selection. Show up on time. Work hard during the 48 hours. Notice who you would want to work with again. After the hackathon, stay in touch with the ones who passed that filter. The project itself is the byproduct.

I have been in technical work for sixteen years. Most of my best collaborators came from short, high-pressure projects. Hackathons are the cheapest possible version of that filter. The project does not have to win. The filter does.
