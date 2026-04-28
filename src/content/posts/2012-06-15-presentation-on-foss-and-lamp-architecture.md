---
title: "Presentation: Dive into FOSS and LAMP architecture"
date: 2012-06-15
slug: presentation-on-foss-and-lamp-architecture
excerpt: "Slide deck I gave this month on Free & Open Source Software and the L-A-M-P web stack. Built in impress.js, hosted at intrepidkarthi.com/files/presentation/lamp/. The agenda, the highlights, and a why-FOSS-actually-matters note for the engineers in the room."
tags: [presentation, foss, lamp, linux, apache, mysql, php, talk]
---

Gave a session this month on **FOSS and the LAMP architecture** — Free & Open Source Software, then a walk through Linux, Apache, MySQL, PHP. Built the deck in [impress.js](https://github.com/impress/impress.js) (the slide engine that came out of github examples last year — really nice spatial transitions, much more interesting than PowerPoint).

The deck is live at `intrepidkarthi.com/files/presentation/lamp/`. Best viewed in latest Chrome or Safari — impress.js relies on CSS3 transforms and older browsers fall back to a plain scrollable version.

This post is the companion notes — what I covered, why I covered it that way, and a few things I cut for time.

## the agenda

```
1. FOSS              — what it is, four freedoms, why it matters
2. Linux             — Unix → MINIX → Linus / GNU
3. Apache            — the HTTP server that powers >65% of the web
4. MySQL             — the open RDBMS that makes the whole thing tick
5. PHP               — server-side scripting, syntax, MySQL hooks
6. Demo              — a small live example tying all four together
```

## what is Free and Open Source Software?

Plain definition I used in the deck:

> Any computer software that permits the user to access the program's source code, modify it, and distribute any derivative work under a license. It is designed to encourage the free use and improvement of software by ensuring that anyone can access the source code and modify it freely.

The Stallman framing is *the four freedoms*. I gave them in plain language:

1. **Freedom to run** the program, for any purpose.
2. **Freedom to study** how the program works and modify it to suit your needs. (Which means access to the source code — making changes without it is exceedingly difficult.)
3. **Freedom to redistribute** copies of the program, gratis or for a fee.
4. **Freedom to improve** the program and release the modified version to the public.

Then the why:

```
Benefits of FOSS
  ▸ Affordability
  ▸ Stability and Security
  ▸ Open Standards
  ▸ Cooperation / Collaboration for quality
  ▸ Its your wish (the freedom argument)
```

The line I kept coming back to: *the OS running on the world's TOP 500 supercomputers is overwhelmingly Linux.* Whatever you think of FOSS as a philosophy, the empirical case is closed at the high end of computing. The argument for it at the low end — your laptop, your web stack, your phone — is just an extension of the same case.

## Linux — the timeline I used

```
1969     Unix developed at AT&T Bell Labs
1983     GNU Project started by Richard M. Stallman
1987     MINIX kernel by Andrew S. Tanenbaum
1991     Linus Torvalds develops Linux from MINIX
1991+    GNU/Linux — the userland and kernel meet
```

Two-slide story: Stallman wrote the userland but not a kernel; Linus wrote a kernel but not the userland. They got combined, mostly by happy accident, and the resulting system became what most people mean when they say "Linux." (Some of the audience always wants to know why some people insist on calling it GNU/Linux. I gave the polite version of the answer and moved on.)

## Apache — the HTTP server

> Apache is an Open Source HTTP web server that powers more than 65% of sites on the internet.

Two slides: how a web server actually works, and how DNS routes a request to a server. The DNS slide used the howstuffworks.com diagram (credited in the deck).

## MySQL

```
RDBMS, in one sentence:
  A collection of tables.
  Columns define attributes; all data in a column is the same datatype.
  A record is stored as a row.
```

The decision tree I gave for "should you use MySQL or something else?":

```
Do you have a large set of data?           ▸ yes
Do you have redundant data to deduplicate? ▸ yes
Do you give preference to security?        ▸ yes
Do you need strict datatype enforcement?   ▸ yes
                                            └── use an RDBMS

Otherwise, look at the alternatives — flat files, key-value
stores, document stores. Pick the boring tool that solves the
problem, not the impressive one that doesn't.
```

The room was mostly final-year CS students and freshers who have only ever known MySQL. I spent a few minutes on the existence of NoSQL — MongoDB came up — because the *MySQL is the only option* default is the kind of habit that becomes a career-long blind spot if no one points it out.

## PHP

The bullet list:

```
PHP — Hypertext Preprocessor
  • server-side scripting language
  • supports MySQL, Informix, Oracle, Sybase, PostgreSQL,
    Generic ODBC, …
  • runs on Windows, Linux, macOS
  • compatible with almost all servers (Apache, IIS, …)
```

The hello-world I used — and yes, of course it says *Vanakkam Chennai*:

```php
<html><body>
<?php
// This is hello chennai example
/* This is also a comment */
   echo "Vanakkam Chennai!";
?>
</body></html>
```

PHP variable rules — the slide I always wish someone had given me earlier:

```
$variable          starts with $
$variable_name     letters/underscore first, alphanumeric thereafter
$Foo  vs  $foo     are two different variables (case-sensitive)
                   PHP is loosely typed — no type declarations
```

The PHP-MySQL connection slide:

```php
<?php
// PHP - MySQL connection example
$con = mysql_connect("localhost", "user", "password");
if (!$con) {
   die('Could not connect: ' . mysql_error());
}
mysql_close($con);
?>
```

(`mysql_*` is the API I used in 2012; the deprecation in favour of `mysqli` and PDO is happening right now in PHP 5.5. I mentioned it as a footnote and told people to use `mysqli` for anything new. Several months from now this will be the obvious right answer.)

## why I ran the talk this way

Three structural choices, in case anyone is preparing a similar session:

**Foundations before tools.** The first 25% of the deck is FOSS itself — what it is, why it matters, the four freedoms. Most LAMP talks skip this and dive into Apache config. That's a mistake. If the audience doesn't understand *why* the stack is open, the rest of the talk is just trivia. Spend the time on the foundation.

**Show the historical sequence.** Linux didn't just appear in 1991. Unix → GNU → MINIX → Linus is the actual chain. Engineers retain stories better than facts; the story makes the facts stick.

**Demo at the end, not the start.** I always finish with a live demo. The slides set up *why this works the way it does*; the demo lets the audience see *how the pieces actually plug together*. Demoing first inverts the dopamine — they get the magic before they understand it, and then the explanation feels boring instead of revealing.

## reuse / license

Deck source is on the live page. I licensed it under **GPL 3.0** — use it, modify it, redistribute it, just don't strip the license. Design borrowed from the impress.js demo gallery. References from Wikipedia (history), howstuffworks (DNS diagram), Netcraft (Apache market share), w3techs (CMS share), gnu.org (the four freedoms).

If you're a college lecturer or a meetup organiser and you want to give the same talk, take the deck. The whole point of FOSS is that you can.

— Karthikeyan NG
intrepidkarthi@gmail.com · `intrepidkarthi.com/files/presentation/lamp/`
