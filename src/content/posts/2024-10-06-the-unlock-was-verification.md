---
title: "The unlock was verification"
date: 2024-10-06
slug: the-unlock-was-verification
excerpt: "OpenAI's o1 is being read as 'the model thinks now.' Look closer at why it works. The labs cracked the next jump by making correctness checkable by a machine. Verification is the unlock for the model. The same word names the bottleneck for your team. That is not a coincidence."
tags: [ai, reasoning-models, o1, verification, engineering-leadership]
---

OpenAI shipped o1 last month and the framing everywhere is that the model thinks now. It pauses, it reasons through steps, it scores far above the previous generation on hard math and competitive programming. All true. But the interesting question is not that it thinks. It is why thinking suddenly started paying off, after a year where just making models bigger had stopped buying much. The answer is the thread this whole blog has been pulling since December 2022, and it finally runs all the way through.

The labs cracked the next jump by making correctness checkable by a machine.

Sit with how the older recipe worked. You pretrained a model on a mountain of text, then you tuned it toward what humans say they prefer. The reward was a guess at human taste, learned from rankings. The problem with a learned taste model is that the policy learns to game it. The reward is an approximation of what a person would like, and the model finds the cracks in the approximation. You get output that scores well and is subtly hollow.

The new recipe changes what the reward is. In the domains where the model got dramatically better this year, math and code, the reward is not a guess at human taste. It is a deterministic check. Does the proof verify. Does the code compile and pass the tests. Does the final answer match ground truth. Binary. You cannot flatter a compiler. Once the reward is something a machine can verify rather than something a human approximates, you can push reinforcement learning hard without the model learning to cheat, because there is no taste to game, only a checker to satisfy. So the model teaches itself to reason its way to answers that pass the check. That is what o1 is. Reasoning trained against a verifiable reward.

Now notice the shape of where it got good. It got good exactly where correctness is cheap to verify. Math, because the answer checks. Code, because the tests run. It did not make a comparable leap in the places where there is no machine check for correct, the judgment calls, the architecture decisions, the is-this-the-right-thing-to-build questions. The frontier advanced precisely as far as automated verification could reach, and stopped where verification gets hard.

That is the same boundary I have been writing about from the team side for two years, and I did not expect the two halves of this argument to meet, but here they are meeting.

On the team side, the story since 2022 has been: generation got cheap, and the work moved to deciding whether the output is correct. On the model side, the story this year is: the models got good exactly where correctness can be checked automatically, and no further. Both halves are the same sentence. Verification is the constraint. It is the thing the labs had to automate to make the model better, and it is the thing your team has to do by hand on everything the model produces. The labs solved verification for math and code at training time. They did not solve it for your production system at delivery time. You still own that.

There is a benchmark that makes this concrete, and it is worth knowing the name because it is about to matter more than any leaderboard score on a trivia test. SWE-bench. Real GitHub issues, fixed by the model, graded by running the project's real tests against the fix. That is a verifiable reward pointed at actual software work. The models are climbing it. The reason that benchmark predicts the future better than the chat demos is that it grades the way the future will grade: not does the output look right, but does it pass the check.

The honest counter, because I keep one in every post. Reasoning of this kind is expensive. o1 burns far more compute per answer than a plain model, and a benchmark is not a production codebase with a decade of load-bearing edge cases. A model that aces SWE-bench is not your senior engineer. Verifiable rewards work cleanly in domains with a crisp checker and get murky everywhere real software lives, where correct is contextual and the tests are incomplete. None of this is solved. But the direction is now legible in a way it was not a year ago.

Here is what I am taking from o1. The entire field just told you, through what it could and could not improve, where the value is. Whoever can define correct and check it owns the part of the work the machine cannot. For the labs that meant building verifiable rewards into training. For the rest of us it means the discipline we have under-invested in for two years, the specs and the tests and the gates that say this output is right, is not overhead anymore. It is the job. The model writes the code. Verification is what is left, and the labs just proved it is the thing that scales.
