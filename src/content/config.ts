import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    legacy: z.boolean().default(false),
    source: z.string().optional(),
    canonical_url: z.string().url().optional(),
    original_url: z.string().optional(),
    snapshot_url: z.string().url().optional(),
    repo_url: z.string().url().optional(),
    play_store: z.string().url().optional(),
    event: z.string().optional(),
    event_theme: z.string().optional(),
    event_year: z.number().optional(),
    event_location: z.string().optional(),
    duration: z.string().optional(),
    image_count: z.number().optional(),
    team: z.array(z.string()).optional(),
    amazon_links: z.array(z.string()).optional(),
    recovered_from: z.string().optional(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    data: z.string().optional(),
  }),
});

const notes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    source: z.string().optional(),
    original_url: z.string().optional(),
  }),
});

export const collections = { posts, pages, notes };
