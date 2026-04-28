---
title: "Deploying osQuest5 — the engine behind the online C test"
date: 2009-02-28
slug: deploying-osquest5
excerpt: "The C++ online test I linked a few months ago points to itworld2.com. The version I'm running on intrepidkarthi.com/oltest is built on osQuest5 — an open-source PHP/XML quiz engine I forked, fixed, and pointed at my own test bank. Notes for anyone trying to do the same."
tags: [oltest, osquest5, php, xml, quiz, foss, deployment]
---

Standing up a quiz tool on `intrepidkarthi.com/oltest/` this week. The engine is **osQuest5** — a PHP/XML quiz application by Jon-Michael C. Brook and Johnny Lang, itself based on osQuest4 by Jay Banks. Released February 27, 2009 under what looks like a pretty permissive license. I downloaded it the day after, pointed it at a test bank of my own, and got it running on the shared host today.

This post is mostly notes for the next person — me, six months from now, when I forget how this works.

## what osQuest5 actually is

A test-delivery engine that:

- Reads questions from XML files in `tests/`.
- Supports three modes: **test** (no answers shown until the end), **learning** (shows the correct answer + explanation after each question), and **flashcard** (just question/answer/explanation in sequence).
- Includes a `text2xml.php` that converts a *Trandumper 1.0* format text dump into the XML the engine expects. This is the import path that lets you take any plain-text question bank and onboard it without hand-editing XML.

The Trandumper format is dead simple:

```
Q. What is the size of int in C on most 32-bit systems?
A. 1 byte
B. 2 bytes
C. 4 bytes
D. 8 bytes
E. Compiler-defined
. C
This is the typical size on 32-bit platforms,
but the C standard does not mandate it.
```

Question, options A through E, period-delimited correct answer, then explanation. Upload a `.txt` file in this format, click `text2xml`, and you have a working quiz.

## the gotchas the README warns about, and they are all real

The release notes flag a few things I would have hit anyway:

- **Capitalization mismatch in fill-in answers** — the engine handles `augusta` vs `Augusta` so you don't have to manually normalise.
- **Spacing on the answers** — leading/trailing whitespace gets trimmed; otherwise students fail on questions they answered correctly.
- **Renumbering when multiple test files are concatenated** — Trandumper outputs questions with sequential numbers per file. If you append two files together you get duplicate numbers; the engine resequences automatically.
- **Maximum upload size** — runs into PHP's `post_max_size`. Default is 8 MB on most shared hosts. Run the bundled `maxpostsizetest.php` to confirm yours.

## the password problem

The upload form is gated by a hardcoded password — set to **`french`** in the default `upload_file.php`. This is fine for a one-person deployment but obviously not for anything public. First thing I did:

```php
// upload_file.php
$valid_password = "<replaced with something not 'french'>";
```

If you're deploying osQuest5, change the password before exposing the URL. The default is in plaintext in the source, which is fine for the upstream maintainer demonstrating the tool but immediately wrong for a real install.

## why this engine, and not building one

This is a recurring decision and the answer is almost always *use the engine that exists*. osQuest5's author shipped the harder problem — the parsing, the answer-matching, the timing logic, the three-mode UI — and asked for nothing in return except that you keep the license header. My contribution is the test bank and a slightly tweaked CSS, and that takes me an evening rather than three weeks.

The C/C++ test bank I'm loading is around 200 questions. Mode is *test* (no answers until the end), 6-question mini-rounds for each topic. If you want to take it, the URL is on the front page of `intrepidkarthi.com`.

— Karthikeyan
