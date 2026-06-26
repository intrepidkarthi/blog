---
title: "The New Internet"
date: 2022-12-10
slug: the-new-internet
excerpt: "Ten days ago Sam Altman tweeted a link to ChatGPT and the timeline decided it was a chatbot. That is the wrong frame. This is closer to a new front door to the internet than a toy, and the first thing standing in its shadow is Google search. The demo is not the story. The cost curve is."
tags: [ai, llm, chatgpt, google-search, engineering-leadership]
---

Ten days ago Sam Altman posted a link and a sentence: "try talking with ChatGPT, our new AI system which is optimized for dialogue." Five days later he posted again, ChatGPT had crossed a million users. The timeline has since decided it is a chatbot. People are asking it to write poems about their cat and screenshotting the funny failures. That is the wrong frame. The poems are not the event. The event is that producing a plausible first draft of almost anything just got cheap, and a new front door to information just opened on the internet.

![Sam Altman announcing ChatGPT, November 30, 2022](/images/articles/the-new-internet/altman-chatgpt-launch-tweet.png)
*Sam Altman's launch post, November 30, 2022.*

Start with where this points, because that is why I am calling it a new internet and not a new feature. For twenty years the front door to the world's information has been a Google search box. You type a question, you get ten blue links, you do the synthesis yourself. ChatGPT skips the links. You ask, and it answers, in plain language, already synthesised. It is wrong often enough today that nobody in Mountain View is losing sleep this week. But the interaction model is the threat, not this week's accuracy. Search makes you walk the last mile. This walks it for you. The day that gets reliable, ten blue links is the worse product, and the most profitable business on the internet is built on ten blue links.

Now the part I actually live in. I have spent years running engineering teams, and the thing I keep coming back to is where the cost sits. In software, the cost was always generation. Writing the code took the time. You scoped a thing, you staffed it, you waited for the diff. Everything downstream, review and testing and deploy, was real work too, but the gating step, the thing the schedule was built around, was a human sitting down and producing the code. That is the step that just changed price.

Watch what the tool actually does. You describe a function and it writes the function. You paste an error and it explains the error and proposes a fix. You hand it a paragraph of intent and it returns forty lines that are roughly right. Not always correct. Roughly right, fast, for almost nothing. GitHub already shipped Copilot to general availability in June doing the narrow version of this inside the editor. ChatGPT is the same capability with the guardrails off and the surface area widened to everything. People do not write code anymore. They generate. That is a different verb, and we are going to spend years learning what it costs.

Here is the part the cat poems hide. The model does not know if it is right. It produces output that has the shape of a correct answer with the same confidence whether it is correct or not. It will invent a library that does not exist and import it without a flicker of doubt. So the thing that got cheap is generation. The thing that did not get cheap, the thing that is now suddenly the expensive step, is deciding whether the output is true.

That asymmetry is the whole game, and almost nobody is pricing it yet.

For thirty years the scarce resource in building software was someone who could produce the code. The entire industry is shaped around that scarcity. We hire for it. We bill for it. We measure output in it. If generation falls toward free, the scarce resource is no longer the person who can write the function. It is the person who can look at a function that appeared from nowhere and say, correctly, this one is fine and that one will take down production on Tuesday. Generation is becoming abundant. Judgment is staying scarce. The org chart has not noticed.

Let me be honest about what is wrong with the thing today, because the hype will skip this part. It hallucinates constantly. It cannot tell you its sources. It has no memory past the conversation. It is confidently wrong in ways that are more dangerous than being obviously wrong, because obvious wrong gets caught and plausible wrong ships. Anyone betting a production system on its output right now is going to get hurt. Today, it is a toy.

But I have watched enough technology curves to distrust the word toy. The question is never how good is it. The question is what does the curve look like, and who is standing on it. The transformer paper is five years old. The capability went from autocomplete-in-the-editor to write-me-a-working-script in about eighteen months. The breadth of what it will generate is widening every quarter. When something moves like that, calling it a toy is how you get surprised.

Here is what I will not pretend to know. Generation is becoming abundant. Whether it ends up cheap or costly is genuinely open. The human effort to produce a draft has collapsed, but someone is paying for the compute underneath, and right now that someone is a research lab eating the cost to win users. Maybe it stays cheap and floods the world. Maybe the real bill, in compute and power and the work of checking everything the machine produces, turns out to be larger than the bill it replaces. I do not know yet. Nobody does. The direction is clear. The magnitude is not. Wait and watch.

One more thing, smaller and closer to home. Last night I asked it for a bedtime story, a new one, about a boy and a dragon who are afraid of the same thing. It wrote it in seconds, and my kids asked for another, and it wrote that one too. Endless short stories, on demand, for almost nothing. That is the same machine that worries me about production code on Tuesday and Google's front door by next year. Cheap generation is going to touch the smallest and the largest things at the same time. I felt it at the dinner table before I saw it in any roadmap.

So I am not going to write about the poems. I am going to write, over however long this takes, about the thing underneath. Generation is becoming abundant. Where that lands is going to reprice how software gets built, how engineering teams are measured, whether Google keeps the front door, and eventually how an entire services industry sells its time. None of that is visible in the demo. It is all visible in the cost curve.

The toy is the distraction. The cost curve is the story. I am going to follow the cost curve.
