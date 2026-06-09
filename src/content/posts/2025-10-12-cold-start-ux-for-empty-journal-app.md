---
title: "cold-start UX for an empty journal app"
date: 2025-10-12
slug: cold-start-ux-for-empty-journal-app
excerpt: "Day one of a journaling app: zero entries, zero history, nothing to show. The cold-start UX determines whether the user writes the first entry or never returns."
tags: [journaling, ux, cold-start, onboarding, product]
---

The hardest screen to design in a journaling app is the first one the user sees after install. There are zero entries. There is no history. There is no personalisation. There is nothing the AI can show because the AI has nothing to process.

This is the cold-start problem. It is universal to apps that derive their value from accumulated user data, but it is sharpest in journaling because the value proposition of the app — "see patterns in your own thoughts over time" — is structurally invisible on day one.

Most journaling apps handle the cold start by ignoring it. They show the same screen on day one and day three hundred. The day-one user sees an empty screen and bounces. Here is what actually works.

## the failure mode of generic onboarding

The conventional wisdom on onboarding is to walk the user through the features. A four-screen tour. "Tap here to record. Tap here to see insights. Tap here to adjust settings."

This fails for journaling apps because the user is not interested in features. They are interested in journaling. The features are means to an end. Showing the means before they have engaged with the end produces churn.

A journaling app onboarding should produce, within 90 seconds of install, the user's first real entry. Not a sample entry. Not a tutorial entry. Their actual first thought of the day, recorded.

## the cold-start tactic that works

The pattern I have converged on, after testing six variants, is what I call the *single-prompt cold start*.

The user installs the app, opens it, and sees one sentence and one button.

```
"What's on your mind right now?"

[hold to record]
```

That is the entire first screen. No tour. No feature explanation. No request for permissions. The user either taps and records, or closes the app.

The button is hold-to-record because it teaches the gesture on first use. The prompt is "right now" because it removes the user's hesitation about what to talk about. The screen is otherwise empty because anything else competes for attention.

Conversion from "first open" to "first entry" on this pattern: about 60%. The previous tour-based onboarding was around 22%.

## permissions

Permissions are the second-largest source of cold-start drop-off. A journaling app needs microphone access (for voice notes) and probably speech-recognition permission (for transcription).

The wrong way is to request both permissions on first launch, before the user has done anything. The user denies them out of caution. The app is now broken from the user's perspective.

The right way is to request each permission at the moment it is needed, with context. The microphone permission is requested when the user first taps the record button — they wanted to record, the request makes sense. The speech-recognition permission is requested when transcription is first attempted — after the recording, when the value is about to be delivered.

In-context permission requests have roughly 3x the grant rate of out-of-context requests. The 60% first-entry conversion above assumes in-context permissions. With out-of-context permissions, the number drops to roughly 35%.

## the first-entry experience

Once the user has their first entry, the app's job is to make the entry feel like progress. The user has done one thing. The app has to show that the one thing produced something.

Two things to show, immediately after the first entry.

**The transcription.** The user spoke. The transcribed text appears. They see that the recording produced text, which produced a record. The cycle is closed.

**A teaser of what is coming.** "You have your first entry. After your third, the app will start showing themes. After your tenth, you will see patterns." This is the only place in the app where a tour is appropriate — and only after the user has invested by recording.

The two together produce a user who thinks "I want to come back tomorrow." That is the only metric that matters on day one.

## day 2-7 behaviour

The first week is the make-or-break window. The user is forming the habit. The app's job is to be present without being annoying.

One notification per day, at a user-selected time. Default to evening (8-9 PM local time) because evening journaling has higher consistency than morning journaling for most users. The notification copy is one of three rotating prompts, like the cold-start prompt but varied.

```
"What stuck with you today?"
"How are you actually doing?"
"What did today teach you?"
```

The variation prevents notification fatigue. The prompts themselves are designed to make recording feel low-friction.

Conversion from "first entry" to "third entry within 7 days" on this pattern: about 45%. Without the notifications, the same conversion is about 18%.

## what not to show

Three things to deliberately not show during the cold start.

**Stats and metrics.** No "you have written 1 entry" counter. No "your streak is 1 day." The user does not need to see metrics on a base of one or two data points. The metrics communicate "you are at the beginning, you have not done much yet" — exactly the wrong message.

**Settings and customisation.** No "personalise your experience" screens. No theme pickers. No notification scheduling. All of this can be discovered later. On day one, it is friction that competes with the actual value.

**Premium features.** No mention of any paid features for the first week. Trying to upsell a user who has not yet experienced the free version is a churn-multiplier. The free version has to earn the user's trust before any premium consideration enters the picture.

## the unlock at day 7

After a week of consistent recording, the app's value starts to compound. The user has 5-7 entries. The on-device AI has enough data to surface real patterns. The themes view becomes useful. The sentiment chart shows actual variation. The retrieval is useful.

The day-7 screen is where the app first feels valuable. The cold-start UX exists entirely to get the user to day 7. Everything that happens before day 7 is investment in the user reaching it. Everything after day 7 is return on that investment.

The week-one churn rate is the variable that determines the app's long-term retention. A 60% first-entry rate compounded with a 45% third-entry rate compounded with a 60% day-7 rate produces a week-one survival rate of about 16%. The industry average for journaling apps is below 5%. The 3x improvement over industry is almost entirely from getting the cold start right.

## the close

Cold-start UX is the most consequential UX work in a journaling app. The user who never makes a first entry is the user who never sees the value proposition. The features matter only if the user is still around.

Most journaling apps over-invest in the long-term experience and under-invest in the first 90 seconds. Reverse the ratio. The first 90 seconds determine the long-term experience. Optimise hard on the cold start. The rest of the app builds on top of it.

The cold-start screen is one prompt, one button, and no other elements. That is the entire interface. Build that first. Build everything else after.
