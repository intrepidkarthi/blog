---
title: "Why I left WordPress after 18 years — and how this blog is built now"
date: 2026-05-09
slug: why-i-left-wordpress-after-18-years
excerpt: "After 18 years on WordPress — through plugin rot, database corruption, spam floods, and one too many 'critical update' emails — I rebuilt intrepidkarthi.com from scratch on Astro, Markdown, and Vercel. Here is the full architecture, the migration story, and why I should have done this a decade ago."
tags: [meta, architecture, astro, wordpress, blogging, infrastructure, vercel]
---

I started this blog in December 2007 on WordPress. The first post was *"Let us walk on 2008"* — written from the college computer center in Madurai, on a FastWebHost shared-hosting plan that cost less than a movie ticket. The blog's name was [*"I like the way I am"*](/writing/i-like-the-way-i-am-the-blogs-original-name). The theme was a free skin called **pixeled**.

For the next eighteen years, WordPress was the engine. Through college, through Symantec, through founding GazeMatic, through Chumbak, through nference, through Pi42 — every time I sat down to write something and publish it on the internet, it went through `wp-admin`.

I am done.

## what broke

Not one thing. A slow accumulation of friction that eventually crossed the threshold from "annoying" to "actively hostile to writing."

**Plugin rot.** Over 18 years I installed, abandoned, and half-removed dozens of plugins. SEO plugins. Caching plugins. Anti-spam plugins. Social sharing plugins. Each one left database tables behind. Each one needed updating on its own schedule. Each update was a coin flip — sometimes it worked, sometimes it broke the theme, sometimes it broke another plugin, sometimes it broke the site. The WordPress dashboard became a triage console. Every login started with a red badge telling me how many things needed patching.

**Database corruption.** I lost [58 posts](/writing/the-lost-archive-58-posts-that-didnt-survive) — probably closer to 95 — across multiple WordPress reinstalls and host migrations on FastWebHost. The `wp_posts` table just quietly lost rows. No error. No warning. I found out years later when I checked the sitemap against the database and the numbers didn't add up. Eighteen years of writing, and a third of it is gone because I trusted a MySQL database on shared hosting to be its own backup.

**Spam.** The comment spam was industrial. Akismet caught most of it, but "most" meant I still had to moderate a queue of fake trackbacks and SEO-bait comments every week. The spam table alone was larger than the actual content table. I was running a database to store spam.

**Security.** WordPress is the largest attack surface on the internet. I patched diligently — but diligently means logging into wp-admin every few days to check if `xmlrpc.php` has a new CVE, if a plugin author sold their plugin to someone who injected adware, if the theme I'm using has a file-upload vulnerability. I am a CISO by trade. I was spending more time securing my blog than writing in it.

**The cPanel and phpMyAdmin tax.** Every non-trivial change to the blog meant logging into cPanel first. Want to check why a page is throwing a 500? cPanel → Error Logs. Want to see if a post is actually in the database? cPanel → phpMyAdmin → navigate to `wp_posts` → run a SQL query in a web textarea that hasn't been redesigned since 2005. Want to update PHP from 7.4 to 8.1? cPanel → MultiPHP Manager → pray nothing breaks → check the site → when it breaks, cPanel → phpMyAdmin → debug. Want to restore a backup? cPanel → Backup Wizard → wait 20 minutes for a full-account tarball to download over a flaky web interface. The entire operational surface of the blog was mediated through a browser-based control panel that felt like enterprise software from 2003.

And then, in April 2026, cPanel itself got hacked. [CVE-2026-41940](https://www.rapid7.com/blog/post/etr-cve-2026-41940-cpanel-whm-authentication-bypass/) — a critical authentication bypass scoring 9.8/10 on CVSS. Attackers could remotely bypass the cPanel login screen and gain full admin access to the server. Not a theoretical vulnerability — [actively exploited in the wild](https://techcrunch.com/2026/05/04/hackers-are-still-exploiting-the-cpanel-bug-to-gain-control-of-thousands-of-websites/), with at least 44,000 compromised IPs scanning and brute-forcing servers, breaching websites, defacing pages, and encrypting data. Hosting providers scrambled to block cPanel ports entirely. The very tool you used to *manage* your site became the attack vector that *compromised* it. I had already migrated off by then, but the timing was a grim confirmation: the entire shared-hosting-plus-cPanel model is a liability, not an asset.

**The update treadmill.** WordPress core updates. PHP version updates. MySQL version updates. Theme updates. Plugin updates. Host control-panel updates. SSL certificate renewals. Each one a potential breaking change. Each one requiring a manual backup before you pull the trigger, because the rollback story for WordPress is "restore from backup and pray."

The final straw was not dramatic. I logged in one morning, saw the dashboard demanding attention on six different fronts, and thought: *I have been maintaining this system for longer than some of my engineers have been alive, and it has never once made it easier to write.*

So I stopped.

## what replaced it

The current site is built on **Astro** — a static site generator that takes Markdown files and produces plain HTML. No database. No server. No PHP. No admin panel. No plugins. No login page for bots to hammer.

Here is the full stack:

```
framework     │ Astro 6.1.9 (static site generator)
content       │ Markdown files in git (96 posts, 2007–2026)
schemas       │ Zod — type-safe frontmatter validation
styling       │ CSS variables + scoped component styles
fonts         │ JetBrains Mono · VT323
OG images     │ SVG templates → PNG via @resvg/resvg-js (build-time)
hosting       │ Vercel (free tier, CDN, auto-deploy on push)
version ctrl  │ git → GitHub (the blog is a repo)
domain        │ intrepidkarthi.com (migrated from FastWebHost to GoDaddy)
build time    │ ~8 seconds for 96 posts + 192 OG images
```

No microservices. No containers. No CI pipeline beyond "push to main." The entire blog — every post, every image, every config file — is a single git repository that I can clone on any machine and rebuild in under ten seconds.

## the directory structure

```
src/
├── content/
│   └── posts/           96 markdown files (one per post)
├── components/          11 Astro components
│   ├── InteractiveTerminal.astro   (the shell at the bottom)
│   ├── PrinceRunner.astro          (the pixel sprite)
│   ├── EasterEggs.astro            (hidden interactions)
│   ├── MatrixRain.astro            (background effect)
│   ├── BootSequence.astro          (startup animation)
│   └── ...
├── layouts/
│   └── BaseLayout.astro  (HTML head, OG tags, JSON-LD, chrome)
├── pages/
│   ├── index.astro       (homepage)
│   ├── writing/
│   │   ├── index.astro   (archive, grouped by year)
│   │   └── [...slug].astro (dynamic: one page per post)
│   ├── about.astro
│   ├── contact.astro
│   ├── lab.astro
│   ├── mission.astro
│   └── og/
│       └── [slug].png.ts (per-post OG image generation)
├── data/
│   ├── goals.json        (40 life goals with status tracking)
│   └── lab.json          (projects, books, archived work)
├── lib/
│   └── motifs.ts         (SVG pattern library for OG images)
└── styles/
    └── global.css        (design tokens, CRT effects)

public/
├── og-default.svg        (site-wide OG template)
├── images/goals/         (40 SVG icons)
└── images/yaazhi.svg     (temple guardian — Madurai roots)
```

Every post is a Markdown file with a date-prefixed filename:

```
2026-05-09-why-i-left-wordpress-after-18-years.md
2026-04-28-feaws-whitepaper-explained.md
2008-01-02-new-year.md
2007-12-31-let-us-walk-on-2008.md
```

The frontmatter is validated at build time by Zod schemas. If I misspell a tag or forget a required field, the build fails before it deploys. WordPress let you publish broken metadata silently. Astro won't.

## content is just files

This is the part that matters most.

In WordPress, a blog post is a row in a MySQL table. To read it, you need a running database. To back it up, you need a SQL dump. To move it, you need an export plugin that may or may not preserve your formatting. To version-control it, you need a third-party plugin that probably doesn't work.

In Astro, a blog post is a `.md` file in a folder. To read it, open it in any text editor. To back it up, push to git. To move it, copy the file. To version-control it — it's already in git. Every edit has a commit hash. Every version is recoverable. `git log` is my revision history. `git diff` is my change tracker. `git blame` tells me when I wrote every line.

The 58 posts I lost on WordPress? They were rows in a table that got dropped during a reinstall. If they had been Markdown files in a git repo pushed to two remotes, they would still be here. That is the difference between "the host has backups" and "I have backups." The difference is 58 posts.

## OG image generation

Every post gets a unique Open Graph image — the preview card that shows up when you share a link on Twitter, LinkedIn, or iMessage. WordPress needed a plugin for this (and the plugin needed its own dependencies, and its own updates, and its own configuration page).

Here, OG images are generated at build time from SVG templates:

```
post tags + slug
      ↓
  motifs.ts (maps tags to SVG patterns: neural-net, candlestick,
             coin, sparkline, lock, circuit, etc.)
      ↓
  SVG template (title, date, tags, motifs, terminal styling)
      ↓
  @resvg/resvg-js (SVG → PNG at 1200×630)
      ↓
  /og/[slug].png (static file, served from CDN)
```

The motif library has 14 topic patterns — each one a small SVG fragment (a candlestick chart for trading posts, a neural network for AI posts, a lock for security posts). The system picks motifs based on the post's tags and slug, so every card looks thematically appropriate without me having to design one manually.

No plugin. No external service. No API key. Just SVG math at build time.

## the interactive terminal

The bottom of every page has a working terminal emulator. Type `help` and it lists commands. Type `whoami` and it prints my bio. Type `btc` and it shows a price ticker. Type `ls` and it lists pages.

This is the kind of thing WordPress would need a custom plugin for — and that plugin would need jQuery, and a REST endpoint, and a database table for state, and an admin settings page. Here it's a single Astro component: `InteractiveTerminal.astro`, 786 lines of scoped HTML, CSS, and JavaScript. No external dependencies. No build step beyond what Astro already does.

It ships as static HTML with inline JavaScript. The "commands" are just switch statements. The crypto prices are client-side API calls. The whole thing is a progressive enhancement — if JavaScript fails to load, you just don't see the terminal. The blog still works.

## the easter eggs

I buried several. Some are keyboard-triggered (type certain words anywhere on the site). One is time-triggered (visit at 3:33 AM). One is date-triggered. One requires clicking a specific element a specific number of times.

In WordPress, hiding something like this would mean editing `functions.php` or writing a custom plugin, testing it against every theme update, and hoping the next WordPress core release doesn't break `wp_enqueue_script`. Here, each easter egg is a self-contained component that ships as part of the static build. If I want to add one, I write it. If I want to remove one, I delete it. No database. No settings page. No side effects.

## deployment

```
git push origin main
      ↓
  Vercel detects push
      ↓
  Astro builds (96 posts → HTML, 192 OG images → PNG)
      ↓
  deployed to CDN edge nodes worldwide
      ↓
  live in ~30 seconds
```

That's it. No FTP. No cPanel. No FastWebHost control panel. No "maintenance mode" page while WordPress runs its database migrations. No prayer that the PHP version on the server matches what the theme expects. The domain moved from FastWebHost (where it lived for 18 years) to GoDaddy, pointing at Vercel's edge network.

The entire deploy pipeline is: write → commit → push → live. The blog has been deployed more times in the last two weeks than it was in the last two years on WordPress, because the cost of deploying is now zero.

## the migration

I pulled the surviving posts out of a cPanel SQL dump (`wp_posts` table), converted the HTML bodies to Markdown, cleaned up the formatting, and committed them as `.md` files. I wrote [migration scripts](https://github.com/intrepidkarthi/blog/tree/main/scripts) — Python, nothing fancy — for importing from the WordPress database, from Medium (where some posts had been cross-posted), from LinkedIn, and from the Wayback Machine for the posts that only survived as cached snapshots.

The conversion was not clean. WordPress stores content as HTML with shortcodes. Markdown doesn't have shortcodes. Every `[gallery]` tag, every `[caption]` block, every inline-styled `<div>` had to be manually reviewed. 96 posts took about a week of evening work. But it was a one-time cost, and now I never have to do it again — because the content is in a format that doesn't need conversion. Markdown is Markdown. It'll be Markdown in 2040.

## what I don't miss

- The WordPress dashboard
- cPanel and its 2003-era web interface
- phpMyAdmin SQL queries in a browser textarea
- Plugin update notifications
- Comment spam moderation
- `xmlrpc.php` vulnerability disclosures
- PHP version compatibility matrices
- The Gutenberg editor
- Database backups before every update
- "Your site is experiencing a critical error" emails
- The feeling of logging into three different admin panels just to write prose

## what I gained

- **Build time: 8 seconds.** The entire site, including OG images, builds in under 10 seconds.
- **Zero runtime dependencies.** No database, no server, no PHP. The output is HTML files on a CDN.
- **Git history as the source of truth.** Every change is a commit. Every version is recoverable. `git log --oneline` is my changelog.
- **Type-safe content.** Zod schemas catch frontmatter errors at build time, not in production.
- **Free hosting.** Vercel's free tier handles static sites effortlessly. I went from paying FastWebHost for shared hosting + domain to paying GoDaddy for domain only.
- **Creative freedom.** The terminal, the easter eggs, the pixel-art sprite, the CRT scanlines — none of this was possible in a WordPress theme without fighting the theme system. Here, I just write components.

## the lesson, 18 years late

WordPress is a CMS. It is a good CMS if you need a CMS — if you have multiple authors, if you need a visual editor, if you need e-commerce, if you need user accounts and permissions and workflows.

I don't need any of that. I am one person writing text files and publishing them on the internet. For that workflow, WordPress was always the wrong tool. It just took 18 years of plugin rot, database corruption, spam floods, and security patches to make that obvious.

The right tool was always a static site generator, a text editor, and git. The right deployment was always "push to a CDN." The right backup strategy was always "the content is in version control." I just didn't see it because WordPress was *there*, and inertia is the strongest force in software.

If you're running a solo blog on WordPress and you've ever thought "this is too much maintenance for what it does" — it is. You're right. The migration is a week of work. The payoff is permanent.

---

The source code for this blog is public: [github.com/intrepidkarthi/blog](https://github.com/intrepidkarthi/blog). Clone it, read it, steal the parts you like. That's what open source is for.
