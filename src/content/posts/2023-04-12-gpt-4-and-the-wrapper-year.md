---
title: "GPT-4 and the wrapper year"
date: 2023-04-12
slug: gpt-4-and-the-wrapper-year
excerpt: "GPT-4 shipped a month ago and a thousand startups became a text box in front of someone else's model. The gold rush is real. It is also misreading where the value lands. The bottleneck in software was never typing. It was deciding what is correct, and that did not move."
tags: [ai, gpt-4, llm, engineering-leadership, startups, google-search]
---

GPT-4 landed in March and the response has been a stampede. Every product deck now has an AI feature. Every other founder I talk to is building a wrapper, a thin layer of prompt and UI in front of OpenAI's model, and calling it a company. The demos are better than what we had in December. The thing reasons across longer context, it follows instructions, it fails less often in the obvious ways. The jump from ChatGPT to GPT-4 is not incremental. It is a real step.

The stampede is still misreading the map.

Back in December I wrote that the event was not the chatbot, it was generation getting cheap. Four months in, that frame is holding, and the wrapper rush is the first thing it explains. A wrapper captures none of the cost collapse it is built on. It sits on top of a capability that is itself getting cheaper and more widely available every quarter, with no moat between the founder and the model underneath. The value of the generation step is falling. Building a business whose entire surface is the generation step is building on the part of the curve that is deflating fastest.

The value did not disappear. It moved. And it moved to exactly the place the cat poems hid in December: deciding whether the output is right.

This is also where the thing I wrote about in December starts to show its edges. ChatGPT cracked open a new front door to information, and now you can watch Google search begin to unbundle, one question at a time, into something you ask rather than something you scroll. Where it lands is not clear yet. What is clear is the direction. And if generation can unbundle the most profitable query business on earth, it does not stop at search. The same collapse is going to walk into one business segment after another, anywhere the product was just a person producing language or code or images on request. The LLMs are growing faster than the incumbents can react. Search is first because it is closest. It will not be last.

Think about what GPT-4 actually changed inside an engineering team. It did not change the hard part of the job. The hard part was never typing the code. Any senior who tells you their bottleneck was keystrokes is not being honest about the work. The bottleneck was holding the system in your head, knowing what correct means for this change in this codebase, and being able to tell a plausible solution from a real one. GPT-4 makes the typing nearly free. It does almost nothing for the judging. If anything it makes judging harder, because now the plausible-but-wrong output arrives faster and in greater volume and wearing a more convincing costume.

Be precise about the current state, because the hype will not be. GPT-4 does not code like a senior engineer. It codes like a fast, confident junior who has read everything and remembers nothing about your system. It produces plausible code, not judged code, and the gap between those two words is the entire job. But I can guess the trajectory from here, and the trajectory is the whole point. The thing does not have to reach senior to reprice the work. It only has to keep making generation cheaper while leaving judging where it is.

I am starting to see this on my own teams, and I want to write down the early version before it dresses itself up as data. The engineers using these tools feel faster. They say so, unprompted, in standup. The work feels lighter. What I cannot yet see is whether we are shipping more, or shipping better, or just generating more code that someone still has to read. The feeling of speed is loud. The evidence of speed is quiet. I do not yet trust the gap between them, and I have learned to be suspicious of any productivity story that lives entirely in how the work feels.

Here is the honest counter to my own caution, because I would rather argue against myself than be a bore about it. Maybe this abstraction holds where past ones leaked. Maybe the model gets good enough at self-checking that the judging step gets cheap too, and my whole framing collapses. People who bet against capability in this field have a bad track record. I am not betting against capability. I am betting against the idea that capability automatically becomes captured value, because I have watched too many cost collapses go straight to the consumer and leave the middle layer with nothing.

So here is what I think the wrapper year is actually teaching, underneath the noise. Generation is commoditising in real time. The defensible work is migrating to the layer above generation, the layer that decides what to build and proves it was built right. The founders who win the next few years will not be the ones with the best text box. They will be the ones who own the judgment the model cannot do.

A confession, since I am being honest about the rest. I am tempted to build a wrapper myself. I hold a couple of domains that are practically product briefs waiting for a build, costly.in and minimize.in, and the pull to point a model at one of them and ship something in a weekend is real. I might. But if I do, it will be to learn the shape of the tool from the inside, not because I think the wrapper is the business. The wrapper is the tuition. The business is upstream of it, in the judgment, and that is the part nobody is rushing to build.

The model writes the draft now. The work is everything that tells you whether the draft is true. That work did not get a gold rush. It got harder. That is where I am looking.
