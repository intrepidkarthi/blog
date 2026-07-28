import fs from "node:fs";
import path from "node:path";

const SITE = "https://intrepidkarthi.com";

// public/genai is vendored from the generative-ai-projects-for-students repo
// and rsync --delete overwrites it on every sync, so anything edited in place
// there is lost. All SEO lives here instead and is applied to dist, which the
// sync cannot reach.

// Shouty filenames make ugly, keyword-free URLs. Rename inside the same
// directory so every relative asset path in the page keeps resolving.
const RENAMES = {
  "LEARNING-GUIDE.html": "learning-guide.html",
  "TEACH-THIS-YOURSELF.html": "teach-this-course.html",
  "ZERO-SETUP.html": "zero-setup.html",
  "TIMING.html": "timing-guide.html",
  "LOCALIZATION.html": "localization.html",
};

// Titles lead with the phrase people actually search, then keep the hook the
// page was written with. Descriptions stay concrete — specifics are what earn
// the click once the listing is shown.
const META = {
  "index.html": {
    title: "Free Generative AI Course — 6 sessions, real labs, zero setup",
    description:
      "A free, hands-on generative AI course: how ChatGPT, Gemini and Claude actually work — tokens, attention, RAG, agents, security — built in every session. 6 sessions, 12 hours, ₹0, no GPU and no credit card.",
  },
  "how-llms-work.html": {
    title: "How LLMs Actually Work — one sentence through the machine",
    description:
      "How large language models work, step by step: one sentence followed through tokenization, embeddings, attention, the transformer stack, prediction and training. Animated, no maths background needed.",
  },
  "llm-playground.html": {
    title: "LLM Playground — see tokens, attention and prediction live",
    description:
      "An interactive LLM playground running in your browser: tokenize text, watch embeddings and attention, and see next-token prediction and temperature change the output. Nothing to install.",
  },
  "course-plan.html": {
    title: "Generative AI Course Syllabus — six sessions, 12 hours, with labs",
    description:
      "The full syllabus for a 12-hour generative AI bootcamp: six sessions, six labs, the capstone sprint, the tech decisions behind each one, and the fallback plan when a demo dies.",
  },
  "learning-guide.html": {
    title: "Learn Generative AI From Scratch — the complete plain-language guide",
    description:
      "Every concept in generative AI explained in plain language: tokens, embeddings, attention, prompting, evaluation, RAG, tool use, agents and security. The full written companion to the course.",
  },
  "teach-this-course.html": {
    title: "Teach a Generative AI Course — free curriculum, slides and labs",
    description:
      "Take this generative AI curriculum and teach it: six ready decks, six labs with handouts, instructor prep notes and per-slide timings. Run it at 12 hours, 2 hours, or as a 45-minute talk.",
  },
  "zero-setup.html": {
    title: "Learn AI Without a GPU — zero setup, zero cost, any laptop",
    description:
      "You do not need a GPU, an install, or a credit card to learn AI. Why this whole course runs on a browser and a free Google account, and exactly which free tiers carry it.",
  },
  "timing-guide.html": {
    title: "Generative AI Course Timing Guide — per-session time budgets",
    description:
      "Per-slide time budgets for all six sessions of the generative AI course, regenerated from the decks, so you know where a session is running long before it does.",
  },
  "localization.html": {
    title: "Adapt This Generative AI Course — a localization kit for instructors",
    description:
      "Running this generative AI course outside Madurai: what to swap for your own city and cohort, what is load-bearing and must stay, and what not to touch.",
  },
};

const BREADCRUMB_NAME = {
  "how-llms-work.html": "How LLMs work",
  "llm-playground.html": "LLM playground",
  "course-plan.html": "Course syllabus",
  "learning-guide.html": "Learning guide",
  "teach-this-course.html": "Teach this course",
  "zero-setup.html": "Zero setup",
  "timing-guide.html": "Timing guide",
  "localization.html": "Localization kit",
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>\n`;

function courseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Generative AI: Foundations & Applications",
    url: `${SITE}/genai/`,
    description:
      "A free, hands-on 6-session course: how large language models actually work — tokens, embeddings, attention, RAG, tool use, security — taught by building something real in every session.",
    inLanguage: "en",
    isAccessibleForFree: true,
    educationalLevel: "Undergraduate",
    teaches: [
      "How large language models work",
      "Tokenization and embeddings",
      "Attention and the transformer",
      "Prompting and evaluation",
      "Retrieval-augmented generation (RAG)",
      "Tool use and agents",
      "LLM security and prompt injection",
    ],
    provider: {
      "@type": "Person",
      name: "Karthikeyan NG",
      url: SITE,
      sameAs: ["https://github.com/intrepidkarthi", "https://linkedin.com/in/intrepidkarthi"],
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      category: "Free",
      availability: "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["onsite", "online"],
      courseWorkload: "PT12H",
      inLanguage: "en",
      instructor: { "@type": "Person", name: "Karthikeyan NG" },
    },
  };
}

// Pull the FAQ straight out of the page so the markup and the schema can never
// drift apart.
function faqSchema(html) {
  const start = html.indexOf("The ones everyone asks");
  if (start === -1) return null;
  const region = html.slice(start, start + 12000);
  const qa = [];
  const re = /<(h3|summary|dt)[^>]*>([\s\S]*?)<\/\1>([\s\S]*?)(?=<(?:h3|summary|dt)[^>]*>|<\/(?:section|div)>\s*<(?:section|footer))/gi;
  let m;
  while ((m = re.exec(region)) && qa.length < 10) {
    const q = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const a = m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (q.endsWith("?") && a.length > 40) {
      qa.push({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a.slice(0, 700) },
      });
    }
  }
  if (qa.length < 3) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa };
}

function setTag(html, re, replacement) {
  return re.test(html) ? html.replace(re, replacement) : null;
}

export default function genaiSeo() {
  return {
    name: "genai-seo",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = path.join(dir.pathname, "genai");
        if (!fs.existsSync(root)) return;

        // 1. Rename, then repoint every reference to the renamed files.
        const renamed = [];
        for (const [from, to] of Object.entries(RENAMES)) {
          const src = path.join(root, from);
          if (fs.existsSync(src)) {
            fs.renameSync(src, path.join(root, to));
            renamed.push(`${from} → ${to}`);
          }
        }

        const files = [];
        const walk = (d) => {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith(".html")) files.push(p);
          }
        };
        walk(root);

        let titled = 0;
        let noindexed = 0;
        let canonical = 0;

        for (const p of files) {
          let s = fs.readFileSync(p, "utf-8");
          const before = s;

          for (const [from, to] of Object.entries(RENAMES)) {
            s = s.split(from).join(to);
          }

          const rel = path.relative(dir.pathname, p).split(path.sep).join("/");
          const base = path.basename(p);
          const url = `${SITE}/${rel.replace(/index\.html$/, "")}`;

          if (rel.includes("/instructor-notes/")) {
            if (!/<meta\s+name="robots"/i.test(s)) {
              s = s.replace(
                /<meta charset="utf-8">/i,
                '<meta charset="utf-8">\n<meta name="robots" content="noindex, follow">'
              );
              noindexed++;
            }
            if (s !== before) fs.writeFileSync(p, s);
            continue;
          }

          const meta = META[rel === "genai/index.html" ? "index.html" : base];

          if (meta) {
            const t = setTag(s, /<title>[\s\S]*?<\/title>/i, `<title>${esc(meta.title)}</title>`);
            if (t) {
              s = t;
              titled++;
            }
            const d2 = setTag(
              s,
              /<meta name="description" content="[^"]*"\s*\/?>/i,
              `<meta name="description" content="${esc(meta.description)}">`
            );
            if (d2) s = d2;
            for (const [prop, val] of [
              ["og:title", meta.title],
              ["og:description", meta.description],
            ]) {
              const r = setTag(
                s,
                new RegExp(`<meta property="${prop}" content="[^"]*"\\s*/?>`, "i"),
                `<meta property="${prop}" content="${esc(val)}">`
              );
              if (r) s = r;
            }
            if (!/<meta name="twitter:card"/i.test(s)) {
              s = s.replace(
                /<\/title>\n?/i,
                `</title>\n<meta name="twitter:card" content="summary_large_image">\n`
              );
            }
          }

          if (!/rel="canonical"/i.test(s)) {
            s = s.replace(/(<title>[\s\S]*?<\/title>\n?)/i, `$1<link rel="canonical" href="${url}">\n`);
            canonical++;
          }
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

          // 2. Structured data.
          if (rel === "genai/index.html") {
            s = s.replace(
              /<script type="application\/ld\+json">[\s\S]*?"@type":"?Course"?[\s\S]*?<\/script>\n?/i,
              ""
            );
            const faq = faqSchema(s);
            const blocks = ld(courseSchema()) + (faq ? ld(faq) : "");
            s = s.replace(/<\/head>/i, `${blocks}</head>`);
          } else if (BREADCRUMB_NAME[base]) {
            s = s.replace(
              /<\/head>/i,
              ld({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Generative AI course",
                    item: `${SITE}/genai/`,
                  },
                  { "@type": "ListItem", position: 3, name: BREADCRUMB_NAME[base], item: url },
                ],
              }) + "</head>"
            );
          }

          if (s !== before) fs.writeFileSync(p, s);
        }

        logger.info(
          `renamed ${renamed.length}, titles on ${titled}, canonical on ${canonical}, noindex on ${noindexed}`
        );
      },
    },
  };
}
