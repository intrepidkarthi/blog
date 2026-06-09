---
title: "migrating without losing SEO juice — the actual checklist"
date: 2026-06-04
slug: migrating-without-losing-seo-juice-checklist
excerpt: "Eighteen years of accumulated backlinks. One migration. The wrong move kills 80% of it in a week. The checklist that did not."
tags: [seo, migration, blogging, infrastructure, redirects]
---

When I migrated this blog from WordPress to Astro in May 2026, the search-ranking question was not "will it survive" — it was "how much of the 18 years of accumulated authority can I preserve."

The honest answer is: most of it, if you follow a specific checklist. None of it, if you do not. SEO juice is more fragile to migration than most people realise. The wrong configuration during the first 48 hours after the cutover can permanently destroy ranking signals that took years to build.

Here is the checklist I followed. With one note on what each item actually protects.

## the 5 things that can destroy SEO during migration

```
1. broken URL mapping        │ old URLs return 404 instead of redirecting
2. wrong redirect type       │ 302 (temporary) instead of 301 (permanent)
3. lost meta tags            │ title, description, canonical changes
4. lost content              │ posts that did not migrate, silently
5. slow first load           │ Core Web Vitals drop, ranking drops
```

Each of these has its own remediation. None of them can be skipped.

## the pre-migration phase

**Inventory the backlinks.** Use Ahrefs, Semrush, Google Search Console, or a free alternative like Mozbar to pull every URL on the site that has external backlinks. For an 18-year-old blog, expect 300-2000 unique URLs with at least one external backlink. Each of those URLs is a ranking asset.

The output is a CSV: original URL, backlink count, ranking keywords, current status. This is your map of what must survive the migration.

**Build the redirect map.** For each URL in the inventory, decide its post-migration destination. Most should redirect 1:1 (the new URL structure should mirror the old). Some will need to redirect to a parent page (if the post was deleted or consolidated). A few will redirect to the homepage (if no good destination exists).

The redirect map is a flat file: `old-path,new-path`. Keep it simple. Make it reviewable. This is the most important file in the migration.

**Snapshot the meta tags.** For every URL, save the current title tag, meta description, OG tags, canonical URL, and structured data. These need to be preserved in the new site or replicated faithfully. Search engines have been seeing those tags for years; sudden changes get treated as content changes, which can churn rankings.

## the migration phase

**Use 301 redirects, not 302.** 301 is permanent — search engines transfer the link equity from the old URL to the new one. 302 is temporary — search engines keep the old URL in the index and treat the new URL as a separate page. The difference is enormous. A migration with 302s is a migration with no ranking preservation.

The 301 redirects need to be served by the same hostname as the old URLs. If the URL changed from `oldsite.com/post/123` to `newsite.com/post/title-slug`, both the hostname change and the path change need to be handled. Two redirects are sometimes necessary: `oldsite.com/post/123` → `newsite.com/post/123` → `newsite.com/post/title-slug`. Each redirect chain has a small SEO cost; minimise the chain length where possible.

**Preserve the URL structure where possible.** If the old blog used `/blog/year/month/slug/`, the new blog should too. Search engines reward URL stability. Even if you have always hated the URL structure, this is not the time to change it. Migrate first, change URL structure later (with a second round of 301s) once the migration has settled.

**Ship the sitemap.xml.** The sitemap is the search engine's index of the new site. It needs to list every URL that should be indexed, with the correct lastmod timestamp. The sitemap should be referenced from robots.txt and submitted to Google Search Console and Bing Webmaster Tools.

**Verify Core Web Vitals.** The new site has to be at least as fast as the old one. A migration that drops Largest Contentful Paint from 1.2s to 3.4s is a migration that drops ranking. Test on real device profiles before the cutover.

## the cutover

**Cut over at low-traffic hours.** Pick a time when your traffic is at its lowest — for most personal blogs, that is 2-6 AM UTC. The cutover itself takes minutes if DNS is configured correctly. The post-cutover monitoring period is the critical window.

**Monitor crawl errors in real time.** Open Google Search Console and watch the "Coverage" and "Crawl Stats" panels. The first 48 hours will show a spike in crawl activity as Google re-crawls every URL. If you see a spike in "Not found (404)" errors, your redirect map is wrong. Fix it within hours, not days.

**Watch backlink alerts.** Ahrefs and Semrush both have "lost backlink" alerts. If a backlink shows as "lost" within 24 hours of cutover, the redirect for that URL is broken. Investigate and fix.

## the 30-60-90 day check

**30 days.** Total impressions in Search Console should be within 80% of pre-migration. Some fluctuation is normal. Below 80% indicates a problem that needs investigation.

**60 days.** Rankings for primary keywords should be back to pre-migration levels or higher. If they are still depressed, audit the redirect chains, check for canonicalisation issues, and verify the sitemap is being processed correctly.

**90 days.** This is the point at which Google has fully re-crawled and re-indexed the site. Any ranking deficit at 90 days is structural. Investigate at the URL level: which specific pages have lost rankings, what changed about them between old and new.

## what I actually saw

After my own migration in May 2026:

```
day 0-7    │ impressions dropped 12%, then recovered
day 7-30   │ impressions flat, rankings shuffling
day 30-60  │ rankings back to pre-migration baseline
day 60+    │ slight improvement (faster load times, better mobile)
```

The 12% drop in week one was the recrawl period. Nothing was actually broken. By day 14 the impressions were back to baseline. By day 60 the rankings were marginally better than before because Core Web Vitals had improved with the static-site stack.

Total time spent on the SEO-preservation work: about 8 hours, spread across the pre-migration inventory, the redirect map, the cutover verification, and the 60-day monitoring. Compared to the value of 18 years of accumulated authority, 8 hours is nothing. Skipping any of it would have cost much more.

## the meta-lesson

Migrating a blog is an SEO event. Treat it as one. The technical work of moving files from WordPress to Astro is the easy part. The work of preserving the search-engine relationship is what determines whether the migration is a success or a permanent loss of traffic.

Most "I migrated and lost half my traffic" stories on Twitter are stories of skipped checklist items. The checklist is not hard. The discipline of following it through, item by item, on a migration weekend that is already chaotic, is the actual work.
