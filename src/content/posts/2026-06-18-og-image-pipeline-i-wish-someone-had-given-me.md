---
title: "the OG image generation pipeline I wish someone had given me"
date: 2026-06-18
slug: og-image-pipeline-i-wish-someone-had-given-me
excerpt: "Fourteen SVG motifs, one template, build-time PNG render. Open Graph images that cost zero ongoing and look right for every post. Here is the pipeline."
tags: [og-image, svg, astro, build-pipeline, blogging, infrastructure]
---

Open Graph images are the thumbnails that appear when a link to your post is shared on Twitter, LinkedIn, Slack, or in iMessage. They matter for click-through. They are also surprisingly hard to do well at the personal-blog scale.

For years I had three options on WordPress: pay for an OG-image plugin with ongoing subscription cost, use an external service like Banner.bear or OG.image, or make every OG image by hand in Figma. All three were unsatisfying. The plugin added bloat. The external service had an API cost per render. The manual approach scaled poorly across 96 posts.

When I migrated to Astro in May 2026, I built the OG pipeline from scratch as a build-time SVG-to-PNG render. Total ongoing cost: zero. Total per-post effort: zero. Total visual quality: better than the plugin or service alternatives. Here is how it works.

## the pipeline

```
post tags + slug + title + date
              ↓
       motifs.ts  ── maps tags to SVG patterns
              ↓
       SVG template  ── injects title, date, tags, motifs, palette
              ↓
       @resvg/resvg-js  ── SVG to PNG, 1200×630
              ↓
       /og/[slug].png  ── static file, served from CDN
```

Four stages, each one a small TypeScript module. The whole thing runs at `astro build` time. The output is one PNG per post, generated once, served from the CDN, never re-rendered after deploy.

## the motif library

The motif library is the part that makes this look like something other than auto-generated templates. Fourteen SVG patterns, each tied to a topic:

```
candlestick      │ for trading and quant posts
neural-net       │ for AI and ML posts
coin             │ for crypto posts
sparkline        │ for data and analytics posts
lock             │ for security and privacy posts
circuit          │ for hardware and embedded posts
terminal         │ for engineering posts
book             │ for retrospective and book posts
clock            │ for time-related and habit posts
yaazhi           │ for India and personal posts (the Madurai temple guardian)
...and four more
```

Each motif is an SVG file under 5KB. The motif renders as a background pattern with low opacity behind the title text. The pattern is chosen by inspecting the post's tags — the first tag that matches a motif wins. Posts with no matching tag get a default terminal-styled pattern.

The motif assignment runs at build time:

```typescript
function pickMotif(tags: string[]): string {
  const motifMap = {
    'crypto': 'coin',
    'trading': 'candlestick',
    'ai': 'neural-net',
    'ml': 'neural-net',
    'security': 'lock',
    // ... etc
  };
  for (const tag of tags) {
    if (motifMap[tag]) return motifMap[tag];
  }
  return 'terminal'; // default
}
```

Three lines of logic. No configuration UI. Adding a new motif means adding one SVG file and one entry to the map.

## the SVG template

The template is a single `.svg` file with template placeholders:

```svg
<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="{{bg}}" />
  <g opacity="0.08">{{motif}}</g>
  <text x="80" y="200" font-family="JetBrains Mono" font-size="48"
        font-weight="700" fill="{{fg}}">{{title}}</text>
  <text x="80" y="540" font-family="JetBrains Mono" font-size="20"
        fill="{{dim}}">{{date}} · {{tags}}</text>
  <text x="80" y="580" font-family="JetBrains Mono" font-size="14"
        fill="{{accent}}">intrepidkarthi.com</text>
</svg>
```

Four colours, four placeholders, one motif slot. The template renders in the site's design palette (green/pink/cyan/dim) using the same JetBrains Mono / VT323 fonts as the site itself. The OG card looks unmistakably like a page from the site.

## the renderer

`@resvg/resvg-js` is a WebAssembly-based SVG-to-PNG renderer. It runs in Node, takes an SVG string, returns a PNG buffer. Fast (under 50ms per image), zero dependencies on system fonts (it bundles its own font loader), deterministic output (same input always produces same output).

The Astro endpoint that generates the PNG is roughly 30 lines:

```typescript
import { Resvg } from '@resvg/resvg-js';
import { renderTemplate } from '../lib/og-template';

export async function GET({ params }) {
  const post = await getPostBySlug(params.slug);
  const svg = renderTemplate({
    title: post.data.title,
    date: post.data.date,
    tags: post.data.tags,
    motif: pickMotif(post.data.tags),
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
}
```

That is the whole image generation logic. The post's frontmatter is the input; the PNG buffer is the output; no external service, no API key, no plugin, no ongoing cost.

## why this beats the alternatives

**Plugin (WordPress):** monthly subscription, dependency on the plugin staying maintained, configuration UI to learn, performance hit on every page render. The pipeline above has zero of these.

**External service (Banner.bear, OG.image, etc.):** per-render API cost, dependency on the service staying up, latency on each request, branding lock-in to the service's templates. None of these apply to a build-time pipeline.

**Manual (Figma):** unsustainable past 20 posts. I had 96. Manual would have required a designer hour per post for the lifetime of the blog.

**Build-time pipeline:** generates once at deploy, costs zero per request, fully customised to the site's design language, runs entirely on my own stack with no external dependencies.

## what I would do differently

Two things, for the next version.

First, support dark/light variants. The current pipeline produces one PNG per post, using the site's dark palette. A light variant for light-themed shares (e.g., on Threads or some LinkedIn contexts) would be a small addition. The motif and layout stay; only the colour palette swaps.

Second, support animated GIFs for select posts. The static PNG is fine for 95% of cases. A short animation (the candlestick chart wiggling, the neural-net nodes pulsing) for tentpole posts would significantly increase share click-through. The same build-time pipeline can produce GIFs via a few extra lines.

Neither is critical. Both are eventual.

## the code

The whole pipeline is open-source as part of the [blog repository](https://github.com/intrepidkarthi/blog/tree/main/src). Clone it, adapt it, swap the motifs for your own design language. The interesting work is not in the SVG rendering — that is solved by `resvg-js`. The interesting work is in the motif library and the tag-to-motif mapping, which is specific to your site's content.

If you are building a blog with more than 20 posts, this is the right OG pipeline. The alternatives are all worse for solo bloggers. The fact that nobody talks about this is one of the things I wanted to fix by writing it down.
