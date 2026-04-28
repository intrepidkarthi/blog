---
title: "iCCC — Internet C Coding Carnival, tomorrow"
date: 2009-01-23
slug: iccc-internet-c-coding-carnival
excerpt: "We are running an online C programming contest tomorrow as part of TecUthsav 2009. Four hours, gcc-only, no IDEs. Code from anywhere with internet — hostel, home, CCC. Notes on the format and how to enter."
tags: [tecuthsav, iccc, contest, c, programming, college, tce]
---

We are running an online C programming contest as part of **TecUthsav 2009** tomorrow evening — Saturday, **January 24, 2009**. Calling it the **iCCC: Internet C Coding Carnival**.

> *Code from your place and get your incentive. This Internet C Coding Carnival (iCCC) gives programmers the comfort of being at their place and reaching winning ways.*

The pitch is in the name. Online. Open to anyone. Code in C. Get rated by the algorithm, not by who can show up to the lab on a Saturday morning.

## the format

```
DATE      ▸ Saturday, 24 January 2009 — evening
DURATION  ▸ 4 hours
LANGUAGE  ▸ C only
COMPILER  ▸ Standard gcc
WHERE     ▸ Anywhere with internet — hostel, home, CCC, cafe
TIE-BREAK ▸ Lower time-and-space complexity wins
```

The contest will engage you for four hours with problems that test your ability to design efficient algorithms inside a time budget. You submit C source files. Each submission is compiled against gcc and run against a test harness. Lowest *time complexity + space complexity* wins on ties.

## why online, why C-only

Two intentional choices.

**Online** because TCE has students scattered across hostels, day-scholar homes, and the CCC labs at any given Saturday evening. Forcing everyone into one physical lab cuts the participation rate in half for no good reason. The internet is fine for a contest like this; we built the submission flow specifically to handle it.

**C-only** because every CSE student who graduates from TCE is supposed to have a working command of C. Allowing C++ or Java would let people lean on STL or library shortcuts and not actually demonstrate algorithmic thinking. If you can solve a graph traversal problem in plain C, you understand it. If you can only solve it via `std::map`, you don't yet.

## what to bring (figuratively)

- A working `gcc` install
- A text editor that won't fight you (vim, emacs, nano, Code::Blocks, all fine — anything with line numbers and syntax highlighting)
- A reliable internet connection
- A clear four-hour window

No IDE auto-complete will save you here. The problems are sized for that.

## how the rounds will run

Three problem sets, scaling in difficulty. Submit each set's solution as a separate `.c` file with the filename specified in the question. Documentation, indentation, and readability earn bonus points — not because we're aesthetes but because clean code is easier for the judges to verify.

Live updates will be posted to `intrepidkarthi.com/cstar` (we are reusing the C-Star contest infrastructure from earlier in the year — same submission flow, refreshed problem set).

## how to enter

Add **`cstaroftce@gmail.com`** as a GTalk buddy and you'll get a contest-time chat invite with the problem-set link. Free to enter. No registration form. Just be online at start time.

Tomorrow evening. See you on the leaderboard.

— Karthikeyan NG
TecUthsav 2009 · Computer Science, TCE
