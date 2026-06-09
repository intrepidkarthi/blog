---
title: "llms.txt in practice — what it is, what to put in it"
date: 2026-07-02
slug: llms-txt-in-practice
excerpt: "A plaintext file at the website root that tells LLM crawlers what they should index. The new robots.txt, except this one matters."
tags: [llms-txt, seo, llms, infrastructure, blogging, ai]
---

In late 2024 a new convention emerged for telling LLM crawlers what they should index on a website. The convention is a file at the website root called `llms.txt`. It is the LLM equivalent of `robots.txt` — a plaintext file with a simple syntax, served at `/llms.txt`, read by AI crawlers that respect it.

In 2026 it is becoming a soft requirement for sites that want to be cited in LLM outputs. Here is what `llms.txt` actually is, what to put in it, and what the current state of crawler adoption looks like.

## what llms.txt is

A simple Markdown file. The format is loosely standardised — there is no formal spec, but the convention that has emerged looks roughly like this:

```
# Site Name

> One-sentence description of the site.

## High-priority content
- [Title of important page 1](https://site.com/url-1.md): brief description
- [Title of important page 2](https://site.com/url-2.md): brief description

## Optional content
- [Title](https://site.com/url-3.md)
- [Title](https://site.com/url-4.md)

## Excluded
- /admin/
- /draft/
```

The file is human-readable. The crawler reads it, identifies the URLs that the site owner considers high-priority, and prioritises crawling and citation of those URLs over arbitrary discovery from sitemaps or internal links.

## why it exists now

LLM crawlers are different from search-engine crawlers in three ways that justify a separate convention.

First, LLM training and inference happen at a different cadence than search indexing. A search engine crawls continuously and serves the latest version. An LLM is trained on a snapshot of the web at a specific date, and may only re-crawl quarterly or less. The site owner's signal about "which pages are most important" matters more for LLM crawlers because they get fewer chances to crawl.

Second, LLM outputs cite sources. A search engine returns a list of links. An LLM returns synthesised text that may cite the original source by name. The site owner has more interest in *being cited correctly* than in *being indexed at all*. `llms.txt` lets the owner mark which pages they want cited.

Third, LLM crawlers respect signals about content quality and authority in ways search engines do not. A site owner saying "these pages are my best work" carries weight that the same signal in a sitemap does not.

## what to put in it

The high-priority section should be your best 10-30 pages. For a blog, that is the strongest 10-30 posts — the ones that represent your work most accurately and that you would be happy to see cited.

The criteria for "best":

- Long-form (1,000+ words).
- Tied to your areas of authority.
- Updated within the last 2-3 years (LLMs penalise stale content).
- Free of factual errors you have not corrected.
- Linked to from your homepage or other prominent pages.

For each entry, include the URL with `.md` suffix (the convention is that the LLM crawler will fetch the Markdown version, not the rendered HTML). Most static site generators expose Markdown URLs trivially.

## what not to put in it

Three categories.

**Drafts or experimental content.** If a page is not ready to be cited, do not list it. LLMs are not good at handling "this is a draft" disclaimers in body text.

**Pages with PII or sensitive content.** Anything you do not want associated with you in an LLM output. This includes resumes (sometimes), contact pages, project pages with client names you have not cleared.

**Generated or duplicate content.** Auto-generated tag pages, year-archive pages, search-results pages. None of these have unique value for an LLM citation; listing them dilutes the signal.

## the excluded section

The excluded section is the LLM analog of `Disallow:` in robots.txt. List paths that should not be crawled at all. Common entries:

```
- /admin/
- /draft/
- /preview/
- /private/
- /cdn-cgi/
```

LLM crawlers vary in how strictly they respect the excluded section. The ones that respect it will skip those paths entirely. The ones that do not will crawl anyway. The exclude is a request, not an enforcement.

## the current crawler landscape

As of mid-2026, the crawlers known to respect `llms.txt`:

```
crawler              │ respects llms.txt
─────────────────────┼─────────────────
OpenAI (GPTBot)      │ yes, since late 2024
Anthropic (Claude)   │ yes, since early 2025
Google (Gemini)      │ partially
Perplexity           │ yes
Meta (LlamaBot)      │ partially
xAI (Grok)           │ unclear
ByteDance/Doubao     │ unclear
Cohere               │ yes
Mistral              │ yes
```

The picture is fragmented but the major players have adopted. The smaller crawlers vary. There is no enforcement — the file is a signal, not a constraint.

## the adoption curve

`llms.txt` is in the early-adoption phase. Most websites do not have one. The websites that do are concentrated in: technical blogs, documentation sites, news outlets, knowledge bases, individual creators with strong personal brands.

The advantage of being early is that the file is being respected at higher rates now than it likely will be in 2028. Today the crawlers respect the signal because the signal is rare and useful. As more sites publish `llms.txt`, the signal becomes noisier, and crawlers will likely move toward more sophisticated extraction methods.

For solo bloggers in 2026, the file is a one-hour investment that improves LLM citation quality. The downside is zero. The upside is moderate but real.

## what I put in mine

The `llms.txt` for this blog has roughly 25 entries in the high-priority section. They are the posts I want cited:

- The feaws whitepaper explainer
- The crypto/quant infrastructure series
- The DailyVox launch post
- The 18-year WordPress migration post
- The TEDx talk retrospective
- A handful of personal essays on long arcs (the 20-year diary, the mission page)

The excluded section lists the admin paths and the legacy WordPress archive that I did not want surfacing in LLM outputs.

Total file size: 4KB. Total time to write: 90 minutes. Expected impact: marginal but cumulative, especially over the next 24 months as LLM citation becomes a more important traffic source than direct search.

The file is published. The crawlers will do what they do.
