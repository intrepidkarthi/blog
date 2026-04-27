import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://intrepidkarthi.com",
  trailingSlash: "ignore",
  integrations: [
    mdx(),
    sitemap({
      // Skip 404 from the sitemap; everything else gets indexed
      filter: (page) => !page.endsWith("/404"),
      changefreq: "weekly",
      priority: 0.7,
    }),
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
