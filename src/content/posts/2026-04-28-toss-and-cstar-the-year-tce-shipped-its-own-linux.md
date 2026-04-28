---
title: "TOSS and C-Star — the year we shipped a Linux distro and the first online programming contest at TCE"
date: 2026-04-28
slug: toss-and-cstar
excerpt: "Two student-team projects from Thiagarajar College of Engineering in 2009 that I helped ship: TOSS, a developer-focused Ubuntu spin built in the CSE department's lab, and C-Star, the first fully-online intra-college programming contest at TCE. Recovered from the old public_html dump. Both deserve a marker."
tags: [archive, college, tce, linux, ubuntu, toss, cstar, programming-contest, recovered, student]
---

While [recovering the old archive](/writing/the-lost-archive-58-posts-that-didnt-survive), I went through a 2009-era `public_html` dump and found the two student-team projects I am most fond of from the BE years at [Thiagarajar College of Engineering](https://www.tce.edu) — both small, both real, both shipped, neither remembered.

Putting a marker on this site so neither one disappears completely.

## TOSS — TCE Operating System Services

**What it was.** A Linux distribution built in the Computer Science and Engineering department's lab, derived from Ubuntu 9.04, repackaged as a developer-focused live ISO with the engineering-software stack pre-installed. We called it **TOSS — TCE Operating System Services**.

The pitch on the original landing page, in our own words from then:

> *Open Source! Open Minds! Open Future!*
>
> TOSS is not just another spin-off from Ubuntu. The core of Ubuntu has been retained with minimal changes to the default Ubuntu Kernel … Despite the eye-candy offered with a variety of user-friendly interfaces, TOSS mainly targets student developers like ourselves.
>
> We offer you `gcc-build-essential`, OpenSSL, PHP, Java, gEda, xCircuit, KLogic, KTechlab and a variety of essential engineering software for developers, which means you can storm into Engineering application development right away without undergoing the hassle of installation/initialisation — and all this in a cool environment!

The shipping artifact in the dump (`/toss1.0/md5sum.txt`, dated **November 25, 2009**) lists the live-CD components:

```
preseed/custom.seed
casper/README.diskdefines
casper/filesystem.squashfs
casper/filesystem.manifest
casper/filesystem.manifest-desktop
casper/initrd.gz
casper/vmlinuz
README.diskdefines
```

That's a real `casper` live-boot image. `filesystem.squashfs` is the compressed root filesystem; `vmlinuz` is the kernel; `initrd.gz` is the initial RAM disk; `preseed/custom.seed` is the unattended-install config. We built a bootable distro from a college lab. In 2009. Without YouTube tutorials. With about three relevant blog posts on the open internet.

**What it actually was, technically.** Ubuntu 9.04 base + a custom seed file + a curated package set + a stock theme tweak. Modest, in retrospect. But it booted, installed, ran, and you could write code on it on the first boot without `apt-get`-ing anything. That was the goal. We met the goal.

**Why it mattered to me.** TOSS was the first time I shipped something that had to *boot*. Until then everything I'd built was a script, a webpage, a PHP form. A Linux distribution is the first piece of software where you cannot lie to the user about whether it works, because if it doesn't boot, nothing else you say is interesting.

That instinct — *the system has to actually run on someone else's hardware before any feature claim matters* — is the same instinct that runs a [crypto exchange](/about), a [stablecoin settlement rail](/about), a [public quant lab](/writing/feaws-whitepaper-explained), or an [on-device LLM journal](/writing/why-i-built-dailyvox). It's the same instinct. It started here.

## C-Star — the first fully-online programming contest at TCE

**What it was.** An inter-departmental programming competition organised by the Department of Computer Science at TCE, held on **Saturday, 21 February 2009**. Six hours, three rounds. The pitch was that **it was the first completely online intra-college competition in TCE's history** — you could compete from CCC (Centralised Computing Centre), the hostel, the Wi-Fi lounge, or your home.

Recovered description from `cstar/about.html`:

> This is an inter-departmental Online Programming Competition organised by Department of Computer Science. It's the first completely online intra-college competition being held in the history of TCE. C-Star is the search for the Star Programmer of TCE.

**The format**, recovered from `cstar/format.html`:

```
Round 1 — 40 multiple-choice questions
  · C, C++, Java, HTML
  · Submit one file: mcq.txt, one option-letter per line
  · +1 for correct, -0.5 for wrong, 0 for blank
  · Score curve: 40 → 100 pts, ≥35 → 2× score, ≥30 → score + 15

Round 2 — Algorithm round
  · 6 problem statements
  · Solve in C/C++/Java
  · Up to 1000 pts on full clean solve
  · Bonus pts for documentation/indentation/readability

Round 3 — C-description round
  · Predict outputs of obfuscated C
  · Explain how outputs are derived for non-obfuscated samples
  · Submit txt files with explanations
```

The infrastructure I remember (and the dump confirms with `cstaroftce@gmail.com` mentioned as the contest's GTalk help channel) was almost touchingly low-tech: PHP scripts on `intrepidkarthi.com/cstar/`, a registration form, a form-based submission flow, manual evaluation for rounds 2 and 3, automated scoring for round 1.

**Why the format is interesting in hindsight.** Three things that are obvious to me now were not obvious to anyone in 2009:

1. **Online > offline for student programming contests.** Travel is the largest invisible filter on participation. We removed it.
2. **MCQ + algorithm + reverse-engineering** is a much fuller test of programming maturity than any single round. Codeforces-style contests had not yet trained the world that algorithms-only is the gold standard. We — by accident, by ambition, by not knowing better — built a contest that tested *more dimensions* than today's contests typically do.
3. **Letting people submit from anywhere with internet** is a feature, not a vulnerability. The cohort of cheaters is small; the cohort of "couldn't physically be in the lab at 9am on a Saturday" is much, much larger. We optimised for the second one.

GTalk, by the way, was the help-desk channel. If you joined the contest in 2009, you added `cstaroftce@gmail.com` as a buddy and we answered your panicked DMs. Real-time chat as official support, eight years before Discord existed.

## the connecting thread

Two TCE projects, one calendar quarter apart. One is a Linux distribution; one is an online programming contest. They have nothing in common except the people who shipped them and the building they shipped from.

But the meta-lesson is the same. *Build a system. Ship it. Get it in front of users on day one. Iterate from real failures.* TOSS booted on real laptops. C-Star ran on a real Saturday with real students from every department in the college trying to win it.

That is the entire job, then and now. Pick a small thing. Ship it. Let reality grade it. Repeat with a slightly bigger thing.

College gave me the chance to do it twice in one semester. Sixteen years on, I am still doing the same move. It still works.

---

**Sources, all in the original 2009-2011 `public_html/` dump:**
- TOSS landing page — `/toss/index.html`
- TOSS 1.0 ISO manifest — `/toss1.0/md5sum.txt` (dated 2009-11-25)
- C-Star landing — `/cstar/about.html`
- C-Star format — `/cstar/format.html`
- C-Star registration — `/cstar/index.php`, `cstarregdetail.php`

If anyone reading this still has a TOSS 1.0 ISO sitting on a hard drive somewhere, [drop me a line](/contact). I'd love a copy.
