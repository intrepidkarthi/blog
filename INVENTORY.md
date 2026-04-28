# Legacy Site Inventory

A deep-research report on what was found in the WordPress/Joomla archive
(stored under `internal/public_html/`) and what was migrated into this
repo.

---

## TL;DR

- **27 blog posts** migrated to `src/content/posts/` as clean Markdown,
  spanning **2008-11-14 → 2009-05-10**, dates preserved.
- **20 additional posts** imported from `intrepidkarthi.wordpress.com`
  via the WP.com REST API, spanning **2007-12-17 → 2008-01-08** — these
  predate the self-hosted blog and were the user's first writings
  online. All marked `legacy: true`, `source: wordpress.com`.
- **The `wp_posts.csv` export was incomplete** — it only contained the
  same 27 posts the SQL dump had. The full archive on disk is what we
  recovered.
- **Sitemap.xml shows ~150 post URLs from 2007–2013, but those posts
  no longer exist** in any database table. They were lost in an earlier
  WordPress reinstall and could not be recovered.
- **7 zero-byte PHP files at the WP root are webshell remnants** from a
  September 2022 site compromise. Flagged, not migrated.
- **Old apps and projects** (TOSS Linux, AutoSynGen, CCura+, Norton Ninja,
  etc.) live in `internal/public_html/` but most are PHP-based and won't
  run statically. Decide per-app whether to feature on a `/projects` page.

---

## What was migrated

### Blog posts → `src/content/posts/`

27 posts, all from college and immediate-after-college era:

| Year | Count | Theme |
|------|-------|-------|
| 2008 | 16    | College life, final-year project, Madurai, trips, TecUthsav |
| 2009 | 11    | Project status, ICCC, TOSS launch, FOSSConf, life updates |

Format: `YYYY-MM-DD-slug.md` with YAML frontmatter (`title`, `date`,
`slug`, `excerpt`, `tags`, `legacy: true`, `original_url`).

Tags inferred from content: `college`, `madurai`, `travel`, `events`,
`movies`, `personal`, `blogging`, `tech`, `journal`.

### WordPress.com import (2026-04-28)

20 posts pulled from `https://public-api.wordpress.com/rest/v1.1/sites/intrepidkarthi.wordpress.com/posts/`:

| Date       | Slug                                                              | Notes |
|------------|-------------------------------------------------------------------|-------|
| 2007-12-17 | hello-world                                                       | First post ever — title overridden from "General" to "Hello World — My First Post" |
| 2007-12-27 | mybook                                                            | VB.Net + MS Access mini-app for storing friend details |
| 2007-12-27 | what-is-memory-leak                                               | C/malloc explainer (code fenced) |
| 2007-12-27 | to-my-god                                                         | Personal/philosophy |
| 2007-12-27 | natpu                                                             | Image-only post (Tamil: friendship) |
| 2007-12-28 | news-today                                                        | |
| 2007-12-28 | kalloori                                                          | College life (Tamil) |
| 2007-12-28 | kaadhal                                                           | Tamil |
| 2007-12-28 | googles-new-service                                               | GOOG-411 |
| 2007-12-28 | polladhavan                                                       | Tamil movie |
| 2007-12-28 | eula-vs-gpl                                                       | License comparison |
| 2007-12-28 | saw-iv                                                            | Movie review |
| 2007-12-28 | c-online-test-2007                                                | **Slug renamed** — collided with existing 2008-11-22 c-online-test (re-publication on self-hosted blog) |
| 2007-12-28 | simple-triangle-but-4-diff-approach                               | C/C++ patterns (code fenced) |
| 2007-12-30 | mig33                                                             | Mobile IM service |
| 2007-12-30 | about-my-city                                                     | Madurai history |
| 2007-12-30 | factory-waste-produces-enough-energy-for-750-homes-nice-one       | Tech news |
| 2007-12-31 | let-us-walk-on-2008                                               | New Year image |
| 2008-01-02 | new-year                                                          | Hassan al-Basri quote |
| 2008-01-08 | yo-yo-robo-on-d-track                                             | Rajinikanth in Shankar's Robot announcement |

Tags inferred via keyword + WP category mapping (`General → personal`,
`TechStuffs → tech`, `Entertainment → movies`, `Programming → programming`,
`தமிழ் வாழ்க → tamil`). Code blocks auto-fenced for posts containing
`#include` / `int main` / `void main` / `printf`.

### Source of truth

Posts came from the `wp_posts` table in `intrep86_wp1.sql` (the SQL dump).
The user-provided `wp_posts.csv` was identical in content. Both sources
agreed on 27 unique published posts after deduplication by title.

The default WordPress "Hello world!" post (`2008-09-29`, from the older
`aj_posts` table) was discarded as it wasn't user-authored.

### Drafts / private posts (NOT migrated)

5 unpublished items found in the SQL dump:

| Date | Status | Title |
|------|--------|-------|
| 2008-11-17 | draft | Our Papanasam Trip *(superseded by published version 2008-11-18)* |
| 2008-12-24 | private | Wrote in mood out |
| 2009-01-13 | draft | Work in leave!!! |
| 2009-01-20 | draft | Project status before second review |
| 2009-01-25 | draft | iCCC -Online Programming Contest |

Decision needed: ship as drafts (`draft: true` in frontmatter) or omit
entirely. Default in current migration: omitted.

---

## What was found but NOT migrated

### Lost posts (irrecoverable)

The blog's own sitemap (`internal/public_html/blog/sitemap.xml`) lists
338 URLs spanning 2007–2013, including posts like:

- `/blog/2007/12/about-madurai/`
- `/blog/2007/12/my-book-app/`
- `/blog/2008/01/yo-yo-robo-on-d-track/`
- `/blog/2009/09/automatic-synonym-generator/`
- `/blog/2010/.../...`
- `/blog/2012/09/from-microsoft-windows-8-appfest-contest/`
- `/blog/2013/01/india-and-its-culture/`
- (~150 more)

**None of these posts exist in any wp_posts/aj_posts table in the SQL
dump.** They appear to have been wiped during a WordPress reinstall
(timestamps suggest somewhere between 2013 and 2022).

If recovery matters, the only viable paths are:
1. Wayback Machine (archive.org) crawls of the old URLs.
2. Old WordPress backups on the previous webhost (if retained).

This recovery is OUT OF SCOPE for this migration. Flagging for awareness.

### Old apps & projects

| Path | Size | Type | Reusable? |
|------|------|------|-----------|
| `toss/` | 424K | TCE Operating System Services — Ubuntu spin, college project | **Yes** — featurable on `/projects`, with screenshots from `toss/images/` |
| `projects/` | 3.6M | Old projects landing page (CCura+, GiveAway, eShelf, AutoSynGen, Norton Ninja, web works) | **Yes** — extract project descriptions, port to `/projects` page |
| `cstar/` | 40K | PHP app, indeterminate purpose | No — won't run as static |
| `oltest/` | 588K | Online test app (PHP) | No — PHP backend |
| `autosyngen/` | 580K | Automatic Synonym Generator (PHP) | No — listed under projects/ instead |
| `contact/` | 156K | Old contact page (PHP) | No — replaced by new `/contact` page |
| `karthi/` | 4K | Personal folder, near-empty | No |
| `myphotos/` | 0 | Empty | No |

### Files & assets

| Path | Notes |
|------|-------|
| `files/karthikeyan.pdf` (2011) | Resume from 2011. Outdated; new resume needed. |
| `files/images/profile_pic.jpg` | Old profile photo. Possibly reusable for `/about`. |
| `files/images/karthikeyan.jpg` | Same era. |
| `files/images/{one,two,three,…,nine}.{jpg,JPG}` | Personal photos, era unclear. Review before reuse. |
| `files/presentation/`, `files/android/`, `files/design/`, `files/tcenet/`, `files/nuveda/` | College-era artifacts, likely not needed on the new site. |
| `files/xss/`, `files/adserver/` | Code experiments — keep for nostalgia but don't host. |

### blog/wp-content/uploads (33 MB)

326 image files spread across years 2010–2023. **Most are orphaned**
(no posts in DB reference them) — they were attached to the lost posts
above. A handful that match the migrated 2008–2009 posts:

- `blog/wp-content/uploads/2008/11/image001.jpg` — referenced by
  `our-papanasam-trip` post but **the file is missing from the archive**.

So in practice: **none of the blog uploads matter for the migrated
27 posts**. The only orphaned uploads worth scanning are personal
photos (e.g., `2018/01/army.jpg`, `2018/01/coconut.jpg`,
`2018/01/creta.png`) which may be worth keeping as life-photo
references.

### Server / WordPress core (do not migrate)

- `blog/wp-admin/`, `blog/wp-includes/`, `blog/wp-config.php` — WP core
- `components/`, `_vti_*` — Joomla 1.5 + FrontPage extensions
- `cache/`, `tmp/` — server caches
- `intrep86_wp1.sql` — kept locally as the canonical archive
- `error_log` (2.4 MB), `blog/error_log` (381 KB) — server logs

### ⚠️ Security: webshell remnants from 2022 compromise

Seven zero-byte PHP files dropped at the WordPress root, all dated
**2022-09-04** (the night of the compromise):

```
basic.php
lvsdyjga.php
mirscwls.php
mohaojjb.php
tesTpbz.php
test123Cp.php
unZIPpeRbav.php
```

Plus `blog/error_log` shows obvious exploit attempts. These are
**not migrated**. Recommendation: when you decommission the old
hosting, scrub these from the legacy archive too.

The SQL dump's `wp_comments` table also shows hundreds of spam
comments from Russian IPs (91.214.44.x range) typical of a comment-spam
campaign. Comments are not being migrated to the new site.

---

## Decisions still needed

1. **Drafts** — ship the 4 unique drafts (excluding the Papanasam
   duplicate) as `draft: true`, or omit?
2. **Old projects page** — do you want a `/projects` or `/early-work`
   page on the new site that re-features TOSS, CCura+, GiveAway,
   eShelf, AutoSynGen, Norton Ninja? If yes, I'll extract descriptions
   from `internal/public_html/projects/*.html`.
3. **Personal photos** — any from the orphaned `blog/wp-content/uploads/`
   tree you want me to surface for your review?
4. **2011 resume** — discard, or keep as `/cv/2011-archive` for
   historical interest?
5. **Lost posts** — proceed without them, or kick off a Wayback Machine
   recovery effort first?

---

*Inventory generated 2026-04-27 from `internal/public_html/` archive.*
