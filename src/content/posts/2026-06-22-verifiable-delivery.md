---
title: "Verifiable Delivery: what comes after Continuous Delivery when the machine writes the code"
date: 2026-06-22
slug: verifiable-delivery
excerpt: "For twenty-five years the bottleneck in software was writing the code. That cost is now near zero, and the gauges we used to measure engineering work broke with it: in one controlled trial, developers using AI felt about 20% faster and were measured about 19% slower. What replaces the old discipline is verification. I call it Verifiable Delivery, and it is the work that survives when the machine writes the code."
tags: [ai, engineering-leadership, verifiable-delivery, software-delivery, indian-it]
---

I run engineering teams. For twenty-five years the bottleneck was the same: writing the code took the time. You scoped, you staffed, you waited for the diff. Generation was the cost.

That cost is gone. At the India AI Impact Summit this February, Vinod Khosla said IT and BPO services will disappear, "almost certainly within the next five years." People heard a provocation. I heard an accurate read of where the cost curve went.

Let me walk through how the machine got good, why generating code is now nearly free, why every gauge we used to measure software work just broke, and what replaces the discipline we built around the old bottleneck. The thing that replaces it is verification. I call it Verifiable Delivery.

## How the machine got good

Everyone still starts in the same place. A transformer, pretrained on next-token prediction over trillions of tokens. Llama 3 ate roughly 15 trillion. DeepSeek-V3, 14.8 trillion. That part is mature and well understood. It is not where the last two years of gains came from.

Two shifts did the work.

The first is architecture. The frontier went sparse. Mixture-of-Experts lets a model hold an enormous total parameter count while firing only a small slice per token. DeepSeek-V3 is the clean reference: 671 billion total parameters, 37 billion active per token. About five percent of the model does the work on any given token. Gemini 1.5 used the same family of trick to push context windows past a million tokens, then two million, with Google reporting internal tests up to ten million. Big total, small active. That is the shape of every frontier open model now.

The second shift is the real story, and it is the one that sets up everything I am about to argue.

Post-training used to mean "reward what humans prefer." You ran supervised fine-tuning, then you aligned the model to human preference rankings, either with RLHF, which trains a separate reward model and optimizes against it, or with the simpler DPO, which Llama 3 and Qwen 2 used. The problem with a learned reward model is that the policy learns to game it. The reward is a guess at what a human would like, and the model finds the cracks.

Then the labs changed what the reward is. RLVR: Reinforcement Learning from Verifiable Rewards. Instead of a learned, gameable preference model, the reward comes from a deterministic checker. Does the code compile and pass the tests. Does the math answer match ground truth. Does the output obey the required format. Binary. Correct or wrong. You cannot flatter a compiler.

Once the reward is verifiable, you can run reinforcement learning hard without the model learning to cheat. DeepSeek used GRPO, a PPO variant that drops the separate critic, samples a group of answers per prompt, and scores each one relative to the group average. The reward is on final-answer correctness alone, with no constraint on how the model reasons to get there. So the model teaches itself to reason. DeepSeek-R1-Zero proved this from pure RL with no supervised fine-tuning at all. Self-checking, backtracking, strategy-switching, all emergent. The production R1 scored 79.8% on AIME 2024, 97.3% on MATH-500, and a 2,029 Codeforces rating that beats 96.3% of human competitors. It was the first major open-weight model published after independent peer review, in Nature last September.

That reframes the whole scaling debate. You no longer only make pretraining bigger. You scale RL and you scale test-time compute. Reasoning models think longer before answering, and accuracy rises as you let them think. OpenAI's o1 hit around 79% on AIME 2024; o3 reached 96.7% on the same exam and, in OpenAI's own words, pushed an additional order of magnitude in training and inference-time compute. And once a model can reason and call tools, it is an agent. It edits repos, drives a screen, runs multi-step workflows. The benchmark that matters there is SWE-bench Verified: real GitHub issues, fixed, with the real tests run against the fix.

Notice the through-line. SWE-bench is a verifiable reward. RLVR is a verifiable reward. The coding agent is graded by a verifiable reward. The labs cracked quality by making correctness checkable by a machine. Verification is the unlock. Hold that thought, because the industry built everything downstream of generation and almost nothing downstream of verification.

## Why generation is cheap, and getting cheaper

Two curves are running at once and they look like a contradiction. They are not.

Per-unit cost is collapsing. Epoch AI tracks inference prices for a fixed capability and finds them falling somewhere between 9x and 900x per year depending on the task, with the median decline accelerating from roughly 50x a year to roughly 200x a year after January 2024. Blended enterprise cost per million tokens fell about 4x in a single year, from around ten dollars to around two-fifty. Torsten Slok at Apollo put the long arc simply: the price of a token has fallen more than 90% since 2023.

The hardware is why. Nvidia's GB200 NVL72 treats a whole rack of 72 Blackwell GPUs as one NVLink domain and, by Nvidia's own numbers, delivers around 30x the real-time trillion-parameter inference of an H100. Those are vendor benchmarks under favorable conditions, so discount them, but the direction is not in doubt. Cloud rental for an H100 fell from about eight dollars an hour in 2023 to two or three now.

And the other curve. Aggregate spend is exploding. Frontier training-run costs have grown about 2.4x a year since 2016. GPT-4 cost an estimated 79 million dollars of compute, Gemini Ultra an estimated 192 million, per Epoch's work in the Stanford AI Index. Stargate is a 500-billion-dollar, 10-gigawatt build for OpenAI, already past eight gigawatts committed. The big hyperscalers spent north of 300 billion on capex in 2025 and have guided to somewhere around 600 to 690 billion for 2026, roughly doubling. The binding constraints moved off raw GPU logic onto HBM memory, which is sold out through 2026, and onto electrical power, where the PJM grid's capacity price ran above 300 dollars per megawatt-day against 29 the year before.

Falling unit cost plus exploding total spend is Jevons. Nadella said it himself when DeepSeek shipped: cheaper tokens drive more token consumption, not less. Token expenditure roughly doubled in a year even as price per token fell 90%. The cheaper generation gets, the more of it we do.

Now the part most people miss. This is not only a datacenter story. The capability is moving onto the device in your pocket and the laptop on your desk. Microsoft's Copilot+ bar set the floor for an AI laptop at a 40-plus TOPS NPU, and laptop NPUs roughly doubled in one generation, from Qualcomm's 45 TOPS Snapdragon X to 80 TOPS on the X2 Elite. Apple's A18 runs about 35 TOPS in an iPhone, the M4 about 38. Apple Intelligence runs a roughly three-billion-parameter model on-device, compressed to two bits per weight, with a bigger MoE model on private cloud for the heavy lifting. Open small models like Llama 3.2 and Phi-3 made local inference broadly viable. On-device inference has near-zero marginal cost after the download, single-digit-millisecond latency against 50-to-200 from the cloud, and the data never leaves the device.

There is a twist. Device prices are rising right now, because hyperscaler memory demand drained the world's DRAM supply. A 32GB kit that ran 80 dollars is 350-plus. That is a memory-allocation problem, not silicon-cost inflation. The NPU compute keeps getting cheaper per operation. The trend is intact: more capable models, running in more places, at a lower cost per token, every quarter.

Generation is cheap. Soon it is ambient. That is the input to everything below.

## The gauge broke

We got the cheap generation. We did not get the throughput.

Start with the most honest data point in the field. In early 2025, METR ran a randomized controlled trial on experienced open-source developers working in repositories they knew well. The developers believed the tools sped them up by about 20%. When the same tasks were timed, they were about 19% slower with the AI than without it. METR has since flagged that number as a snapshot, not a constant: by early 2026 they judged the gap had likely narrowed, and they rebuilt the experiment because developers would no longer work without AI long enough to form a clean control group. The magnitude moved. The direction of the error did not. The self-report and the stopwatch pointed opposite ways, and that gap is the durable finding. I am not saying AI makes everyone slower. I am saying the instrument we trust most, our own sense of speed, is broken, and the cheaper generation gets the more it will lie to us.

<div class="stat-row">
  <div class="stat"><span class="stat-num">+20%</span><span class="stat-label">how much faster developers <em>felt</em> with AI</span></div>
  <div class="stat"><span class="stat-num">&minus;19%</span><span class="stat-label">how much slower they actually were, when timed (METR RCT)</span></div>
  <div class="stat"><span class="stat-num">45%</span><span class="stat-label">of AI-generated code ships with a security vulnerability (Veracode)</span></div>
</div>

The team-level data tells the same story from a different angle. Across more than 10,000 developers, Faros AI found pull-request volume and review time both nearly doubling while net delivery stayed roughly flat, with almost a third of PRs merged without any review at all. DORA, in its own report, called AI an amplifier rather than a fixer and tied a jump in adoption to a drop in delivery stability. The scorecard:

| Signal | What the data shows | Source |
| --- | --- | --- |
| PR volume | up 98% | Faros AI (10,000+ devs) |
| Review time | up 91% | Faros AI |
| PRs merged with no review | 31% | Faros AI |
| Delivery stability | down 7.2% per 25-point adoption jump | DORA |
| Incidents-to-PR ratio | up 242% | Faros AI 2026 (22,000 devs) |
| Code churn | up 861% | Faros AI 2026 |
| Pasted vs refactored code | pasted overtook refactored for the first time | GitClear (2024) |

The pattern is one sentence. Generation got cheap. Verification got expensive. The space between the two is the verification gap, and every unverified diff falls into it. We removed the old bottleneck and shipped the work straight into a new one, and the new one is review.

And it compounds with size. One engineer verifies by trust: you know the author, you know the intent, you read the diff. That does not survive headcount. At fifty or a hundred engineers, with AI roughly doubling the pull requests, no reviewer holds the context for all of it, and trust quietly substitutes for verification right when the volume makes verification matter most. The Faros numbers are large-team numbers for a reason. Generation scales for free; human review does not, and the gap between those two curves is the tax you pay for growing. That tax is exactly what the gate is built to hold down.

## Verifiable Delivery, defined

So here is the term, and here is the lineage it belongs to.

Each era of this discipline made one thing cheap, and every era until now assumed the same author.

| Era | Made cheap | Assumed the author was |
| --- | --- | --- |
| Waterfall | Planning | A human |
| Agile | Changing direction | A human |
| DevOps and CI/CD | Shipping | A human |
| **Verifiable Delivery** | **Proving correctness** | **A machine** |

Continuous Delivery's whole achievement was to make deployment a non-event. The last row is the break: it is the first discipline that assumes a machine wrote the code, and it optimizes the one cost the others never had to.

<p class="pull">Verifiable Delivery is the discipline of proving machine-generated change correct against an explicit, machine-checkable intent before it ships.</p>

CD made deployment a non-event. Verifiable Delivery aims to make correctness an attested, gated artifact rather than a matter of human trust. The shape of it is a pipeline where intent goes in one end and a proven artifact comes out the other, and where the author model never grades its own work. The whole discipline compresses to four words: no proof, no ship.

<figure class="arch">
<svg viewBox="0 0 720 560" role="img" aria-label="Verifiable Delivery architecture: intent flows through an agent into three verification gates and out as an attested artifact." xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="vdglow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>
  <!-- arrows -->
  <g stroke="#2a8c44" stroke-width="2" fill="#2a8c44">
    <line x1="320" y1="70" x2="320" y2="96"/><polygon points="314,95 326,95 320,104"/>
    <line x1="320" y1="164" x2="320" y2="190"/><polygon points="314,189 326,189 320,198"/>
    <line x1="320" y1="258" x2="320" y2="284"/><polygon points="314,283 326,283 320,292"/>
    <line x1="320" y1="352" x2="320" y2="378"/><polygon points="314,377 326,377 320,386"/>
    <line x1="320" y1="446" x2="320" y2="472"/><polygon points="314,471 326,471 320,480"/>
  </g>
  <text x="338" y="184" fill="#ffb454" font-family="'JetBrains Mono',monospace" font-size="12">unverified diff</text>

  <!-- S1 intent -->
  <rect x="110" y="10" width="420" height="60" rx="5" fill="#0b140e" stroke="#5fd7ff" stroke-width="1.5"/>
  <text x="320" y="36" text-anchor="middle" fill="#5fd7ff" font-family="'VT323',monospace" font-size="24">INTENT — the executable spec</text>
  <text x="320" y="56" text-anchor="middle" fill="#7da3ac" font-family="'JetBrains Mono',monospace" font-size="12">EARS acceptance criteria · eval suite · contracts</text>

  <!-- S2 agent -->
  <rect x="110" y="104" width="420" height="60" rx="5" fill="#0b140e" stroke="#2a8c44" stroke-width="1.5"/>
  <text x="320" y="130" text-anchor="middle" fill="#b8ffc8" font-family="'VT323',monospace" font-size="24">AGENT generates the code</text>
  <text x="320" y="150" text-anchor="middle" fill="#5f7a65" font-family="'JetBrains Mono',monospace" font-size="12">generation is ~free · not yet trusted</text>

  <!-- S3 gate1 -->
  <rect x="110" y="198" width="420" height="60" rx="5" fill="#0c1a11" stroke="#4eff7c" stroke-width="2"/>
  <text x="320" y="224" text-anchor="middle" fill="#b8ffc8" font-family="'VT323',monospace" font-size="24" filter="url(#vdglow)">GATE 1 — deterministic checks</text>
  <text x="320" y="244" text-anchor="middle" fill="#7fb98e" font-family="'JetBrains Mono',monospace" font-size="12">contract + property tests against the spec</text>

  <!-- S4 gate2 -->
  <rect x="110" y="292" width="420" height="60" rx="5" fill="#0c1a11" stroke="#4eff7c" stroke-width="2"/>
  <text x="320" y="318" text-anchor="middle" fill="#b8ffc8" font-family="'VT323',monospace" font-size="24" filter="url(#vdglow)">GATE 2 — the pipeline</text>
  <text x="320" y="338" text-anchor="middle" fill="#7fb98e" font-family="'JetBrains Mono',monospace" font-size="12">build · CI · integration</text>

  <!-- S5 gate3 -->
  <rect x="110" y="386" width="420" height="60" rx="5" fill="#0c1a11" stroke="#4eff7c" stroke-width="2"/>
  <text x="320" y="412" text-anchor="middle" fill="#b8ffc8" font-family="'VT323',monospace" font-size="24" filter="url(#vdglow)">GATE 3 — AI review, residual only</text>
  <text x="320" y="432" text-anchor="middle" fill="#7fb98e" font-family="'JetBrains Mono',monospace" font-size="12">architecture, not correctness · never the author model</text>

  <!-- S6 artifact -->
  <rect x="110" y="480" width="420" height="60" rx="5" fill="#0b140e" stroke="#b8ffc8" stroke-width="1.5"/>
  <text x="320" y="506" text-anchor="middle" fill="#b8ffc8" font-family="'VT323',monospace" font-size="24" filter="url(#vdglow)">ATTESTED ARTIFACT → SHIP</text>
  <text x="320" y="526" text-anchor="middle" fill="#7da3ac" font-family="'JetBrains Mono',monospace" font-size="12">correctness proven, then deployed</text>

  <!-- gate bracket -->
  <path d="M 556 198 L 568 198 L 568 446 L 556 446" fill="none" stroke="#2a8c44" stroke-width="1.5"/>
  <text x="612" y="326" text-anchor="middle" fill="#4eff7c" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="2" transform="rotate(90 612 326)">THE VERIFICATION GATE</text>
</svg>
<figcaption>The gate runs deterministic checks first and AI review last, because the model that wrote the code shares the failures of any model asked to grade it. Ground truth has to come from outside the author.</figcaption>
</figure>

What was going on before: a human authored code, a pipeline shipped it fast, and review was a human reading a human's diff. What is going on now: an agent authors the code, generation is free, and a human cannot read it all. So the human's job inverts. You stop authoring code and start authoring the spec. You stop writing tests and start verifying machine output.

The new unit of work is the spec, not the ticket or the commit. GitHub's Spec Kit formalizes this into a four-phase loop, Specify, Plan, Tasks, Implement, each phase validated before the next. AWS Kiro turns acceptance criteria into code across three files, with requirements written in EARS notation, the "WHEN the system SHALL" form that is parseable and testable by both a human and a model. The new artifacts are executable acceptance criteria, eval suites, and verification gates. Anthropic calls the practice eval-driven development and says owning your evals should be as routine as maintaining unit tests. Evals differ from unit tests because the output is a gradient, not a pass or fail, so you gate deploys on a golden-set threshold and block anything that drops below it.

None of these pieces are mine, and that is the point. Andrej Karpathy put verifiability at the center of what gets automated: the more verifiable the task, the more the machine takes it. Sonar named the verification gap and measured it, finding that 96% of developers do not fully trust AI output while under half check it before they commit. Spec-driven and eval-driven development are the same shift seen from the tooling side. Everyone serious is circling the one realization. What I am naming is the discipline they add up to: where it sits in the delivery lineage, and the single rule, anti-circularity, that holds it together. The contribution is the assembly, not the discovery that checking matters.

And the new bottleneck is review. The market already priced this. Cursor's parent bought Graphite for 290 million dollars, with the CEO calling code review the next constraint to break.

The hardest part is a rule, and the rule is anti-circularity. Do not let the model that wrote the code grade the code. Their failures correlate. The reviewer has no ground truth, so it checks the code against itself instead of against intent. The fix is an external reference. You put deterministic gates first, contract tests and property tests against an executable spec, then your normal pipeline, then AI review only for the architectural residual. Martin Kleppmann pushed this to its conclusion in December: he would rather have AI prove its code correct than review it, because a proof checker rejects an invalid proof and a hallucination becomes harmless. Leonardo de Moura, who built Lean, put the stakes in one line.

<p class="pull">When AI writes the software, the verification gap does not shrink, it widens. A proof cannot be gamed; it covers all inputs by construction.</p>

Now the part that makes this concrete. Every one of these incidents is the cost of unverified delivery.

Replit's coding agent wiped SaaStr's production database during an explicit code freeze. It had been told eleven times in all caps not to touch it. It ran `npm run db:push` without permission, destroyed the data for over 1,200 executives and roughly 1,190 companies, then told the founder rollback was impossible and all versions were gone. That was false; the rollback worked. The same agent had earlier fabricated 4,000 fake user records and faked unit-test results to hide bugs. The agent lied about its own state. You cannot trust an agent's self-report. That is the whole argument for external verification in a single incident.

The supply chain is worse because it is automated. A USENIX Security 2025 study generated 2.23 million code samples and found 19.7% referenced a hallucinated package that does not exist, and 58% of those hallucinations repeated across runs, which makes them predictable and therefore pre-registrable. Attackers register the invented names. The `huggingface-cli` placeholder that researchers planted got 30,000 downloads in three months, and Alibaba pasted the hallucinated install command into a public README. That is the attack class called slopsquatting. Trust the import statement and you ship a backdoor.

The output that escapes becomes liability. Air Canada was held liable when its chatbot invented a refund policy; the tribunal rejected the argument that the bot was a separate legal entity and awarded the customer damages. A Chevrolet dealership's bot was prompt-injected into agreeing to sell a 76,000-dollar Tahoe for one dollar and calling it a legally binding offer. Lovable shipped AI-generated apps with row-level security off by default, and one researcher found 303 exposed endpoints across 170 apps leaking emails, phone numbers, payment details, and home addresses, logged as CVE-2025-48757. None of these failures showed up in development. They showed up in production, after delivery, which is exactly the window Verifiable Delivery exists to close.

Buying the tools is not installing the discipline. McKinsey found about 80% of firms have adopted generative AI and only about one in eighteen capture more than 5% of EBIT from it. DORA's read is blunter: AI is an amplifier, not a fixer. A license makes whatever you already are faster, including faster at shipping the liabilities above. The capability you paid for sits idle until you build the gate.

## Installing the gate: where to start

You do not roll this out everywhere at once. You install it on one workflow, prove it, and let it spread.

1. **Pick one high-blast-radius workflow and write its spec first.** Not the whole org. One place where a bad change actually hurts: payments, auth, a data migration. Write the intent as executable acceptance criteria, in EARS notation if you want it parseable by a human and a model both. That spec is the thing you now defend, not the diff.

2. **Put the deterministic gate before the AI review, not after.** Contract tests and property tests against the spec, run in CI, blocking merge. Ground truth comes from outside the model. This is the anti-circularity rule made concrete: the checker holds something the author cannot see.

3. **Make evals an owned artifact, the way tests are.** Build a golden set for the workflow and gate deploys on a threshold. Anything that drops below it does not ship. Anthropic calls this eval-driven development and says owning your evals should be as routine as maintaining unit tests. Give the suite an owner.

4. **Forbid the author model from grading its own code.** A different model, or deterministic checks, for the gate. Reserve AI review for the architectural residual, the part no test can express. Failures correlate, so a model reviewing its own output is checking the code against itself instead of against intent.

5. **Re-point the dashboard at the bottleneck.** Stop counting PR volume and lines; that is the felt-speed trap. Start watching the verification metrics: PRs merged unreviewed, incidents-to-PR ratio, churn, escaped-defect rate. You manage the gate you measure.

6. **Cap the waste, not the usage.** A two-layer budget, a team pool plus a per-key personal cap, kills the runaway-agent tail. Prompt caching and the batch API take most of the rest off. Track tokens per unit of shipped work, protect your heavy users, and the bill stays flat while output climbs.

7. **Give it an owner above the team.** Verifiable Delivery is an operating model, not a tool you buy. Someone owns the gate and the standards across teams, the tool stack, the data boundaries, the eval bars, while each team runs its own. Centralize the standard, federate the execution.

None of this needs a new platform or a budget cycle. It needs you to decide that correctness is something you prove, then install the first gate this quarter.

## Why this guts Indian IT

The Indian services model is an operating system, and the OS is Agile plus billable hours. You win a contract, you staff it with bodies, you bill for the hours those bodies spend generating code. The unit you sell is human time spent on generation. Generation is the part that just went to roughly zero.

You can watch the repricing land in real time. Accenture reported on June 18 and cut the top of its full-year growth guidance to 3 to 4%, blaming cautious US discretionary spend. Accenture is the bellwether for the whole sector, so the read-through was instant. The next session, Indian IT sold off hard.

| Stock | Move, 19 June 2026 | Level |
| --- | --- | --- |
| Infosys | down 8.2% | 5-year low |
| TCS | down 6.5% | near 6-year low |
| Nifty IT index | down 5% | 3-year low |

Roughly ₹1.35 lakh crore of market value, about 16 billion dollars, gone in a single session. Infosys and Wipro ADRs had already dropped up to 10% overnight in New York.

That is the tell. The selloff was not really about Accenture's quarter. It was the market repricing every company that sells the same thing, discretionary, billable, human-hour delivery, the moment the bellwether admitted the spend was softening. When the unit you bill for collapses in cost, the multiple on the business that bills for it collapses first.

The insiders are saying it out loud, and the loudest one ran Infosys. Vishal Sikka now calls what is happening to software work "creative destruction at hyper speed," and he is blunt about the direction:

> There is no doubt that the disruption to the knowledge work in software development of repetitive processes is here. That disruption is real.

And the capital to finish the job just lined up. Anthropic filed confidentially for an IPO on June 1, OpenAI a week later, both circling a debut north of a trillion dollars. That is not a milestone. It is a hiring budget. Anthropic already runs India as its second-largest market and opened a Bengaluru office this year; OpenAI opened in Delhi. They hire Bengaluru engineers directly for the work above generation, writing the spec, owning the evals, running the gate, and they pay two to three times services rates to do it. Add the 2,117 captive global capability centers that already employ more than 500,000 AI and ML engineers inside the client's own walls, and the picture is plain. The talent that used to be rented through a services contract is now hired retail, in the same city, often by the people who used to be the customer.

So the same engineer is disintermediated as a billable hour and recruited as a verifier, in the same year, on the same street. The services firms are not short of talent. They are short of a model that sells anything other than that talent's time. The work that survives sits above the generation: deciding what correct means and proving the machine met it. The window to move up to selling that, verified outcomes instead of billed effort, is the next few quarters, not the next few years. The firms that do not move become the headcount the labs and the captives hire away.

## Where this goes, and what I would do

Models keep getting cheaper and they spread onto every device. Teams stop being measured by code written and start being measured by what they govern. Gartner expects AI to influence 70% of application development by 2026. The high-leverage engineer is the one who writes the spec, owns the eval suite, and runs the gate. Formal verification, niche for forty years, goes mainstream, because the cost of writing a proof just collapsed and a proof is the only check that scales to machine-speed code.

The honest counter: Jevons cuts both ways. Cheaper software means more software, and more software needs more people around it, not fewer. The US Bureau of Labor Statistics still projects software jobs growing about 15% through 2034. The productivity curve is a J, output dips before it climbs, and most of the damage in the felt-versus-measured data is the dip, not the destination. The technology is real and the diffusion is slow. The timeline is the open question, not the direction.

I run this at scale, and the token bill is the easy half. Treat spend as infrastructure instead of a SaaS seat and it flattens: prompt caching takes about 90% off the repeated context, the batch API another 50% off anything that is not interactive, and a two-layer cap, a team pool plus a per-key personal limit, kills the runaway-agent tail that is the only spend that actually hurts. Cap the waste, protect the leverage. Your heaviest engineers are roughly twice as productive at ten times the tokens, and that trade pays for itself. Run it that way and output per engineer rises while tokens per unit of shipped work fall, so the monthly number barely moves as the team doubles. The hard half was never the bill. It is the gate.

So the one thing I will commit to. The teams that win the next five years will not be the ones that generate the most code. Generation is a solved, commoditized, near-free input. They will be the ones who can prove, on demand and by machine, that the code does what they said it would, and who run that proof on a token budget that does not balloon when the headcount does. Build the verification gate now, while it is still a choice. The market is already repricing the firms that waited.
