# intrepidkarthi.com

Personal blog of Karthikeyan N.G. — builder, CTO/CISO, occasional writer.

> **Status:** content migration checkpoint. Astro scaffolding lands in the next commit.

## What's in this repo

```
src/
  content/
    posts/        ← blog posts as Markdown (one .md per post, dated filename)
INVENTORY.md      ← detailed report of what was migrated from the old site
```

## What's NOT in this repo

The `internal/` directory (gitignored) holds the raw WordPress + Joomla archive,
the SQL dump, the wp_posts CSV, and earlier design mockups. Those stay on disk
for reference and are not pushed to GitHub.

## Adding a new post

Create a Markdown file under `src/content/posts/` named `YYYY-MM-DD-slug.md`:

```markdown
---
title: "Post title"
date: 2026-04-27
slug: post-slug
excerpt: "One-line summary that appears in lists and OG cards."
tags: [tech, essay]
---

Body in Markdown. Push to `main`. Site rebuilds automatically.
```

## Editing existing content

Every post is a plain Markdown file. Edit, commit, push. That's it.
No CMS, no admin UI, no database — just files in git.

---

See [INVENTORY.md](./INVENTORY.md) for what was salvaged from the legacy site
and what was deliberately left behind.
