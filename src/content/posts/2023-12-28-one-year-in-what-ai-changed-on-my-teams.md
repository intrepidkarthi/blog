---
title: "One year in: what AI actually changed on my teams"
date: 2023-12-28
slug: one-year-in-what-ai-changed-on-my-teams
excerpt: "A year of Copilot and ChatGPT in real engineering teams, not in a demo. The honest year-end read: we generate much more code and ship about the same amount. The tool did not remove a bottleneck. It moved one, and we have not re-staffed for where it went."
tags: [ai, copilot, engineering-leadership, software-delivery, year-in-review]
---

It is the end of December, the time of year I write down what I actually saw rather than what I hoped for. This year there is only one thing worth writing down. We spent 2023 putting AI coding tools in front of real engineers doing real work, and I can now describe what changed, with a year of watching behind it instead of a demo.

The short version: we generate a lot more code, and we ship about the same amount of working software. Those two facts sitting next to each other are the whole story of the year.

Start with what got better, because it did. The blank page is gone. Nobody stares at an empty file anymore. Boilerplate writes itself. The first draft of a function, a test, a migration, a regex nobody wanted to think about, all of it arrives in seconds. For a junior, the tool is a patient senior who never gets annoyed at the basic question. For a senior, it removes the tedium between knowing what you want and having it on screen. The engineers like it. They are not wrong to.

Now the part that does not show up in the demo and took a year of watching to see clearly.

The pull requests got bigger. Noticeably. When generating a hundred lines costs nothing, people generate a hundred lines, and the hundred lines show up at review. Review time went up to match. The reviewer is now reading more code per change, code the author did not fully write and therefore does not fully own in their head, and the reviewer is the one person in the loop the AI did not speed up at all. The bottleneck did not vanish this year. It walked from the keyboard to the review queue, and we did not move a single person to meet it there.

I went looking at our actual delivery, not the vibe of it, and the vibe and the numbers disagree. The team will tell you, sincerely, that we are much faster now. The amount of working software reaching production did not move much. More got generated. More got reviewed, or worse, got waved through because the queue was long and the diff was large and it looked fine. Some of what we shipped this year is code no human fully understood, written by a machine, approved by a tired human, running in production now. I do not love that sentence, but it is true.

So here is the thing I am willing to commit to print at the end of year one, before anyone has run a proper study on it. The feeling of speed and the fact of speed have come apart. The tool reliably makes the work feel faster. Whether it makes the team faster depends entirely on whether you fixed the place the work piled up, and almost nobody fixed that place, because the place is unglamorous. It is review. It is testing. It is the discipline of deciding what is correct, which is exactly the step the tool does not do for you.

The honest counter, and I hold it seriously: it is early. The tooling is a year old. The integrations are crude. The juniors on my teams are learning faster with a tireless assistant at their elbow, and that compounding might swamp everything I just complained about. I am not calling the result. I am calling the shape, and the shape is that we bought a generation accelerator and pointed it at a pipeline whose bottleneck was never generation.

What I want to carry into next year is one discipline. Stop measuring this by how fast it feels. Measure what reaches production and stands up. If we cannot tell whether AI helped without asking the team how it felt, we have not measured anything. Year one was the year the gap between felt and real opened up. Year two is where I find out how wide it gets.
