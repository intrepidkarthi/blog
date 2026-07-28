import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import genaiSeo from "./src/integrations/genai-seo.mjs";
import fs from "node:fs";
import path from "node:path";

// Posts carrying `noindex: true` must stay out of the sitemap — listing a page
// we also tell Google not to index is a contradictory signal and burns crawl
// budget. Read the frontmatter straight off disk; content collections aren't
// available this early in the config.
function noindexSlugs() {
  const dir = "./src/content/posts";
  const slugs = new Set();
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const fm = raw.split(/^---\s*$/m)[1];
    if (!fm || !/^noindex:\s*true\s*$/m.test(fm)) continue;
    const declared = fm.match(/^slug:\s*(.+?)\s*$/m);
    slugs.add(
      declared ? declared[1].replace(/^["']|["']$/g, "") : file.replace(/\.mdx?$/, "")
    );
  }
  return slugs;
}

const NOINDEX = noindexSlugs();

// https://astro.build/config
export default defineConfig({
  site: "https://intrepidkarthi.com",
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const p = url.pathname.replace(/\/$/, "");
        if (p.endsWith("/404")) return false;
        // Markdown twins of posts are for LLM crawlers, not the index
        if (p.endsWith(".md")) return false;
        const slug = p.startsWith("/writing/") ? p.slice("/writing/".length) : null;
        if (slug && NOINDEX.has(slug)) return false;
        return true;
      },
      // Hand-written pages under public/ are invisible to the integration,
      // so Google only ever found them by following links. List them.
      customPages: [
        "https://intrepidkarthi.com/genai/",
        "https://intrepidkarthi.com/genai/how-llms-work.html",
        "https://intrepidkarthi.com/genai/llm-playground.html",
        "https://intrepidkarthi.com/genai/course-plan.html",
        "https://intrepidkarthi.com/genai/learning-guide.html",
        "https://intrepidkarthi.com/genai/teach-this-course.html",
        "https://intrepidkarthi.com/genai/zero-setup.html",
        "https://intrepidkarthi.com/genai/timing-guide.html",
        "https://intrepidkarthi.com/genai/localization.html",
        "https://intrepidkarthi.com/minecraft/",
      ],
      changefreq: "weekly",
      priority: 0.7,
    }),
    genaiSeo(),
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark-dimmed",
      wrap: true,
    },
  },
  // Strip Astro's default <meta name="generator"> for cleaner output
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
