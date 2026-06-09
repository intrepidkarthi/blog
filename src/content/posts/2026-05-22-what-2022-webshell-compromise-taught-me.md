---
title: "what the 2022 webshell compromise taught me about owning my archive"
date: 2026-05-22
slug: what-2022-webshell-compromise-taught-me
excerpt: "On September 4, 2022, someone dropped seven zero-byte PHP files at the root of my WordPress install. The site survived. The trust did not. Here is what I rebuilt around the lesson."
tags: [security, wordpress, infrastructure, architecture, blogging]
---

On September 4, 2022, someone dropped seven zero-byte PHP files at the root of my WordPress install on FastWebHost. The files were the calling card of a known WordPress exploitation kit. Most of them were placeholders waiting for a payload. One of them was active and was being used to scan adjacent directories on the shared hosting box.

I found them during a routine FTP browse. The host's intrusion detection had not caught it. My local monitoring was non-existent. The post-mortem was uncomfortable.

The site survived the incident with no visible damage. My trust in the architecture did not. The next eighteen months of slow decisions, ending in the May 2026 migration off WordPress, started that night. Here is what I learned.

## what happened

The seven files, listed in chronological filesystem order:

```
2022-09-04 03:14   basic.php          0 bytes
2022-09-04 03:14   lvsdyjga.php       0 bytes
2022-09-04 03:14   mirscwls.php       0 bytes
2022-09-04 03:14   mohaojjb.php       0 bytes
2022-09-04 03:14   tesTpbz.php        0 bytes
2022-09-04 03:14   test123Cp.php      0 bytes
2022-09-04 03:14   unZIPpeRbav.php    0 bytes
```

All dropped within the same minute, at 3:14 AM IST. The naming pattern is a known fingerprint of a Russian-language WordPress exploitation kit that was active in 2021-2023. The kit drops empty placeholder files first, then uses a second-stage exploit to fill them with payload code. The placeholders persist even if the second stage fails or is blocked.

I do not know which vulnerability was used to drop the files. It was almost certainly a plugin with a known CVE — there were 14 plugins active on the site at the time, several of them outdated by months. The plugin update treadmill is one of the things WordPress made structurally easy to fall behind on.

## what survived

The SQL dump did. I had been running automated daily SQL backups for years. The backup ran at 4 AM, an hour after the compromise. The backup picked up the database in a clean state because the attacker had not touched the database — they were going for the filesystem.

The Markdown migration project four years later was built on top of that SQL dump. Without the backup, the lost posts would have been ~150 instead of ~58. The backup discipline, which I had taken for granted as a checkbox item, turned out to be the single decision that preserved most of my archive.

## what did not survive

Trust. From that night onward, I treated every WordPress login as a potential exposure. I started running compromise-detection scripts weekly. I subscribed to WordPress security feeds. I read every plugin update changelog before installing it. The site continued to function, but the cognitive overhead of maintaining it kept growing.

The traffic patterns also did not fully survive. Some of the dropped files were used to add hidden affiliate links to old posts before I caught them and cleaned up. Google's search ranking for some of those pages took a hit and never fully recovered. I will never know exactly how many readers I lost to malware warnings during the brief window where the compromise was live and unaddressed.

## three architectural mistakes

The 2022 compromise was not random bad luck. It was the predictable outcome of three architectural decisions I had made over the previous decade.

**One: I treated WordPress as set-and-forget.** WordPress is not. It requires active maintenance — plugin updates, core updates, theme audits, periodic security reviews. I had treated it as "install once, write occasionally, ignore the admin panel." That stance is incompatible with running a public-facing application on the internet's largest attack surface.

**Two: I had no separation between content and runtime.** WordPress conflates the two. The Markdown post lives inside the same database that runs the application, behind the same admin panel that an attacker can compromise. There is no clean "content layer" that survives if the "application layer" is destroyed.

**Three: I trusted the host's backups.** FastWebHost claimed to take backups. I never tested a restore. When a colleague at another company actually had to restore a host-backup years later, the restore failed because the backup format was incompatible with newer versions. "The host has backups" is not the same as "I can restore." I learned this from someone else's incident, not from my own only because my own SQL backups happened to work.

## the principle

The lesson, in one sentence: **own the content, do not rent the runtime**.

The content is the durable asset. The runtime — WordPress, PHP, the database, the host's stack — is incidental. If the content is in a format that does not depend on the runtime (Markdown files in git), the loss of the runtime does not destroy the content. If the content is in a format that requires the runtime (a MySQL database that only WordPress can read), the runtime's compromise is the content's compromise.

This is not a WordPress-specific lesson. It is a generic principle for any long-lived personal infrastructure. The bits you want to keep for decades should not depend on bits you do not control. The blog, the photos, the journal, the code, the writing — all of it should be in formats that survive the failure of any single platform, host, or vendor.

## the new architecture

The 2026 migration was driven by this principle. Markdown files in a git repo, version-controlled, mirrored to two remote git hosts, deployable to any static host. The runtime is replaceable. The content is durable.

If the next compromise destroys Vercel's hosting, I can deploy to Netlify in 30 minutes. If the next compromise destroys my GitHub account, I have local clones and a GitLab mirror. If the next compromise destroys the laptop I write on, the next laptop can clone the repo and resume.

No single component of the new stack, if destroyed, takes the content with it. That is the difference between renting the runtime and owning the content. The 2022 compromise taught me which one I had been doing for fifteen years, and which one I should have been doing the whole time.

## what to do if you are still on WordPress

Three things, in order of how much they matter.

First, own your backups. The host's backups are not your backups. Take a SQL dump weekly, copy it off the host, store it somewhere you control. Test a restore at least once a year. The compromise will happen when you are not watching. The backup is what determines whether the compromise is recoverable.

Second, audit your plugins. The compromise probably came through one of them. Reduce the count to the minimum that the site actually needs. Update aggressively. If a plugin has not been updated in 6 months, remove it.

Third, plan the exit. WordPress is not a permanent commitment. Static site generators (Astro, Hugo, Eleventy) have caught up to WordPress's content-management capabilities for solo bloggers. The migration takes a weekend. The reduction in maintenance burden is permanent.

The 2022 compromise cost me a few hours of cleanup and four years of slow-burning anxiety. Migrating off WordPress would have prevented all of that. The lesson was available before the compromise. The compromise just made it impossible to ignore.

---

→ Earlier: [18 Years of WordPress. I'm Done.](/writing/why-i-left-wordpress-after-18-years)
