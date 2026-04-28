---
title: "TOSS and C-Star — what we shipped from the CSE lab this year"
date: 2009-11-26
slug: toss-and-cstar
excerpt: "Two student-team projects that shipped from the Computer Science department at Thiagarajar College of Engineering this year. TOSS — a developer-focused Ubuntu spin, live ISO out yesterday. C-Star — the first fully online intra-college programming contest at TCE, ran in February."
tags: [college, tce, linux, ubuntu, toss, cstar, programming-contest, student]
---

Two things shipped from the Computer Science department lab at [Thiagarajar College of Engineering](https://www.tce.edu) this year. Putting both on this blog because both deserve a marker.

## TOSS — TCE Operating System Services

> *Open Source! Open Minds! Open Future!*

TOSS is not just another spin-off from Ubuntu. The core of Ubuntu has been retained with minimal changes to the default Ubuntu kernel — enabling users to retain its more popular and useful features while giving you a completely different look and feel.

Despite the eye-candy offered with a variety of user-friendly interfaces, **TOSS mainly targets student developers like ourselves**. We offer you `gcc-build-essential`, OpenSSL, PHP, Java, gEda, xCircuit, KLogic, KTechlab and a variety of essential engineering software for developers — which means you can storm into engineering application development right away without undergoing the hassle of installation/initialisation, and all this in a cool environment.

The TOSS 1.0 ISO went out yesterday — **November 25, 2009.** Live-CD layout:

```
preseed/custom.seed                       — unattended-install config
casper/README.diskdefines                 — distribution metadata
casper/filesystem.squashfs                — compressed root filesystem
casper/filesystem.manifest                — installed-package list
casper/filesystem.manifest-desktop        — desktop-task package list
casper/initrd.gz                          — initial RAM disk
casper/vmlinuz                            — kernel
README.diskdefines                        — top-level metadata
```

That is a real `casper` live-boot image. Burn the ISO to a CD, boot from it, and the whole thing comes up with the engineering toolchain pre-installed. No `apt-get`. No initial setup. You sit down, you boot TOSS, you write code.

A short explainer is up on YouTube — embedded on the TOSS landing page. Download is available there too.

This is the first project I've shipped that has to **actually boot**. Until now everything I built was a script, a webpage, or a PHP form on `intrepidkarthi.com`. A live Linux distribution does not let you fudge things — it either boots, or it doesn't, on hardware that isn't yours, in a lab you've never been to. The bar feels different. I like it.

## C-Star — first online programming contest at TCE

Earlier this year, on **Saturday 21 February 2009**, the Department of Computer Science ran C-Star — an inter-departmental online programming competition. **The first completely online intra-college competition in the history of TCE.**

The pitch: C-Star is the search for the Star Programmer of TCE. Six hours, three rounds, you can compete from anywhere — CCC, hostel, Wi-Fi lounge, home — as long as you can reach the contest site on `intrepidkarthi.com/cstar`.

Format:

```
Round 1 — 40 multiple-choice questions
   C, C++, Java, HTML
   Submit one file: mcq.txt — one option-letter per line
   +1 correct, −0.5 wrong, 0 blank
   Score curve: 40 → 100 pts, ≥35 → 2× score, ≥30 → score + 15

Round 2 — Algorithm round
   6 problem statements
   Solve in C / C++ / Java
   Up to 1000 pts on a clean solve
   Bonus pts for documentation, indentation, readability

Round 3 — C-description round
   Predict outputs of obfuscated C
   Explain how outputs are derived for non-obfuscated samples
   Submit txt files with explanations
```

The infrastructure is unfashionable: a registration form, a submission flow, manual evaluation for rounds 2 and 3, automated scoring for round 1. PHP scripts on shared hosting. Real-time help via GTalk — `cstaroftce@gmail.com` is the buddy you add to ask questions during the contest.

Three things about the format that I think are right, even if no one else seems to do contests this way:

1. **Online beats offline for student programming contests.** Travel and timing are the largest invisible filters on participation. Removing them is the single biggest thing you can do to widen the funnel.
2. **MCQ + algorithm + reverse-engineering** is a much fuller test of programming maturity than algorithms-only. A student who can solve a graph problem but can't read obfuscated C, or a student who reads C fluently but can't write a clean algorithm — both are missing something. C-Star tests both.
3. **Trusting students to self-monitor** is, mostly, the right default. Yes, some people will cheat. The cohort of *"couldn't physically be in lab on a Saturday morning"* is much, much larger than the cohort of cheaters. Optimise for the larger one.

C-Star ran clean. Certificates printed. Star Programmer of TCE crowned. Worth doing again.

## the connecting thread

Two TCE projects, one calendar year apart. One is a Linux distribution; one is an online programming contest. They have nothing in common except the people who shipped them and the building they shipped from.

The thing they both demonstrate, to me, is this: you don't need a startup or a grant or a research lab to ship something that actually runs. You need the project, a small team, a deadline, and the willingness to put it in front of users on day one and let reality grade it.

College gave me the chance to do it twice this year. I'd like to keep doing it.

---

**TOSS:** download the live ISO at the TOSS landing page on `intrepidkarthi.com`.
**C-Star:** results and certificates archived at `intrepidkarthi.com/cstar`. Format details on the same page.
