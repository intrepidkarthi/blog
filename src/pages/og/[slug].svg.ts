import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { pickMotifs, renderMotifs } from "../../lib/motifs";

export async function getStaticPaths() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.data.slug ?? post.slug },
    props: { post },
  }));
}

function escapeXml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!)
  );
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) { cur = w; continue; }
    if ((cur + " " + w).length <= maxChars) cur += " " + w;
    else { lines.push(cur); cur = w; if (lines.length === maxLines) break; }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s\S+$/, "") + "…";
  }
  return lines;
}

export const GET: APIRoute = async ({ props }) => {
  const post = (props as any).post;
  const title = post.data.title as string;
  const date = (post.data.date as Date).toISOString().slice(0, 10);
  const tags = ((post.data.tags as string[]) ?? []).slice(0, 4).join(" · ");
  const slug = post.data.slug ?? post.slug;

  // Pick topic motifs based on the post's tags + slug words
  const motifSeed = [...((post.data.tags as string[]) ?? []), ...slug.split("-")];
  const motifNames = pickMotifs(motifSeed);
  const motifSvg = renderMotifs(motifNames);

  const titleLines = wrap(title, 22, 3);
  const titleY = 270;
  const lineH = 70;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#030604"/>
    <stop offset="1" stop-color="#0d1810"/>
  </linearGradient>
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="0" cy="0" r="1" fill="rgba(78,255,124,0.07)"/>
  </pattern>
  <filter id="glow"><feGaussianBlur stdDeviation="2.5"/></filter>
  <linearGradient id="fadeRight" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#030604" stop-opacity="0.95"/>
    <stop offset="1" stop-color="#030604" stop-opacity="0"/>
  </linearGradient>
</defs>

<rect width="1200" height="630" fill="url(#bg)"/>
<rect width="1200" height="630" fill="url(#grid)"/>

<g opacity="0.18">
  <rect x="0" y="0" width="1200" height="2" fill="#000"/>
  <rect x="0" y="6" width="1200" height="2" fill="#000"/>
  <rect x="0" y="12" width="1200" height="2" fill="#000"/>
</g>

<!-- Topic motifs (right side) -->
<g opacity="0.85">${motifSvg}</g>

<!-- Subtle fade so title stays readable -->
<rect x="0" y="0" width="780" height="630" fill="url(#fadeRight)"/>

<!-- terminal-style prompt header -->
<text x="80" y="100" fill="#5f7a65" font-family="JetBrains Mono, monospace" font-size="18" letter-spacing="3">
  KARTHIKEYAN NG:~/writing$ cat ${escapeXml(slug)}.md
</text>

<line x1="80" y1="135" x2="1120" y2="135" stroke="#16291c" stroke-width="2"/>

<!-- date + tags -->
<text x="80" y="180" fill="#ffb454" font-family="JetBrains Mono, monospace" font-size="22" letter-spacing="2">
  ${escapeXml(date)}${tags ? `  ·  ${escapeXml(tags)}` : ""}
</text>

<!-- title (multi-line) -->
${titleLines
  .map(
    (line, i) =>
      `<text x="80" y="${titleY + i * lineH}" fill="#b8ffc8" font-family="VT323, monospace" font-size="72" filter="url(#glow)">${escapeXml(line)}</text>
       <text x="80" y="${titleY + i * lineH}" fill="#4eff7c" font-family="VT323, monospace" font-size="72">${escapeXml(line)}</text>`
  )
  .join("\n")}

<!-- footer -->
<line x1="80" y1="540" x2="1120" y2="540" stroke="#16291c" stroke-width="2"/>
<text x="80" y="575" fill="#5fd7ff" font-family="JetBrains Mono, monospace" font-size="20" letter-spacing="2">
  intrepidkarthi.com
</text>
<text x="1120" y="575" fill="#5f7a65" font-family="JetBrains Mono, monospace" font-size="14" letter-spacing="2" text-anchor="end">
  Engineer · Author · Speaker · Trader
</text>

<!-- corner brackets -->
<path d="M 40 40 L 40 80 M 40 40 L 80 40" stroke="#4eff7c" stroke-width="3" fill="none"/>
<path d="M 1160 40 L 1160 80 M 1160 40 L 1120 40" stroke="#4eff7c" stroke-width="3" fill="none"/>
<path d="M 40 590 L 40 550 M 40 590 L 80 590" stroke="#4eff7c" stroke-width="3" fill="none"/>
<path d="M 1160 590 L 1160 550 M 1160 590 L 1120 590" stroke="#4eff7c" stroke-width="3" fill="none"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
};
