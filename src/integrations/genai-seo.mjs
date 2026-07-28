import fs from "node:fs";
import path from "node:path";

const SITE = "https://intrepidkarthi.com";

// public/genai is vendored from the generative-ai-projects-for-students repo
// and rsync --delete overwrites it on every sync, so head tags edited in place
// there do not survive. Inject them into dist instead — the sync can't reach it.
export default function genaiSeo() {
  return {
    name: "genai-seo",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = path.join(dir.pathname, "genai");
        if (!fs.existsSync(root)) return;

        let canonical = 0;
        let noindexed = 0;

        const walk = (d) => {
          for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, entry.name);
            if (entry.isDirectory()) {
              walk(p);
              continue;
            }
            if (!entry.name.endsWith(".html")) continue;

            let s = fs.readFileSync(p, "utf-8");
            const before = s;
            const rel = path.relative(dir.pathname, p).split(path.sep).join("/");
            const url = `${SITE}/${rel.replace(/index\.html$/, "")}`;

            if (rel.includes("/instructor-notes/")) {
              // Prep material stays reachable by link, out of the index.
              if (!/<meta\s+name="robots"/i.test(s)) {
                s = s.replace(
                  /<meta charset="utf-8">/i,
                  '<meta charset="utf-8">\n<meta name="robots" content="noindex, follow">'
                );
                noindexed++;
              }
            } else {
              if (!/rel="canonical"/i.test(s)) {
                s = s.replace(
                  /(<title>[\s\S]*?<\/title>\n?)/i,
                  `$1<link rel="canonical" href="${url}">\n`
                );
                canonical++;
              }
              // The upstream repo carries a TODO mentioning og:url; drop it so
              // it can't be mistaken for the tag itself.
              s = s.replace(
                /\s*<!-- TODO: set the final absolute URL for og:image and og:url[^>]*-->\n/,
                "\n"
              );
              if (!/<meta property="og:url"/i.test(s) && /<meta property="og:title"/i.test(s)) {
                s = s.replace(
                  /(<meta property="og:title"[^>]*>\n?)/i,
                  `$1<meta property="og:url" content="${url}">\n`
                );
              }
            }

            if (s !== before) fs.writeFileSync(p, s);
          }
        };

        walk(root);
        logger.info(`canonical on ${canonical} page(s), noindex on ${noindexed} instructor page(s)`);
      },
    },
  };
}
