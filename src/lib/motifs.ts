/**
 * Topic motif library for per-post banner SVGs.
 *
 * Each motif returns an SVG fragment positioned at (cx, cy) inside a
 * roughly 280×260 box. The banner generator places 1 or 2 motifs in
 * the right-hand third of the 1200×630 canvas, picked from this set
 * based on the post's tags.
 *
 * All motifs use the cyberdeck palette only — green primary, amber
 * accent, cyan/pink/purple as occasional pops — so any combination
 * looks visually coherent.
 */

const G = "#4eff7c";
const A = "#ffb454";
const P = "#ff5f87";
const C = "#5fd7ff";
const PU = "#c780ff";
const D = "#2a8c44";

type Motif = (cx: number, cy: number, scale?: number) => string;

const t = (cx: number, cy: number, scale: number, content: string) =>
  `<g transform="translate(${cx} ${cy}) scale(${scale})">${content}</g>`;

const motifs: Record<string, Motif> = {
  // ---------- AI / ML ----------
  "neural-net": (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <line x1="-100" y1="-80" x2="0" y2="0" stroke="${D}" stroke-width="1.5"/>
      <line x1="-100" y1="0" x2="0" y2="0" stroke="${D}" stroke-width="1.5"/>
      <line x1="-100" y1="80" x2="0" y2="0" stroke="${D}" stroke-width="1.5"/>
      <line x1="-100" y1="-80" x2="0" y2="-80" stroke="${D}" stroke-width="1.5"/>
      <line x1="-100" y1="80" x2="0" y2="80" stroke="${D}" stroke-width="1.5"/>
      <line x1="0" y1="-80" x2="100" y2="0" stroke="${D}" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="100" y2="0" stroke="${D}" stroke-width="1.5"/>
      <line x1="0" y1="80" x2="100" y2="0" stroke="${D}" stroke-width="1.5"/>
      <circle cx="-100" cy="-80" r="14" fill="${G}"/>
      <circle cx="-100" cy="0" r="14" fill="${G}"/>
      <circle cx="-100" cy="80" r="14" fill="${G}"/>
      <circle cx="0" cy="-80" r="14" fill="${A}"/>
      <circle cx="0" cy="0" r="14" fill="${A}"/>
      <circle cx="0" cy="80" r="14" fill="${A}"/>
      <circle cx="100" cy="0" r="16" fill="${P}"/>
    `),

  chip: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-80" y="-80" width="160" height="160" fill="none" stroke="${G}" stroke-width="3" rx="6"/>
      <rect x="-50" y="-50" width="100" height="100" fill="none" stroke="${A}" stroke-width="2"/>
      <text x="0" y="8" fill="${A}" font-family="JetBrains Mono, monospace" font-size="20" text-anchor="middle">CPU</text>
      ${[-60, -30, 0, 30, 60].flatMap(p => [
        `<line x1="${p}" y1="-80" x2="${p}" y2="-95" stroke="${G}" stroke-width="2"/>`,
        `<line x1="${p}" y1="80" x2="${p}" y2="95" stroke="${G}" stroke-width="2"/>`,
        `<line x1="-80" y1="${p}" x2="-95" y2="${p}" stroke="${G}" stroke-width="2"/>`,
        `<line x1="80" y1="${p}" x2="95" y2="${p}" stroke="${G}" stroke-width="2"/>`,
      ]).join("")}
    `),

  // ---------- Crypto / trading ----------
  candlestick: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <line x1="-110" y1="60" x2="110" y2="60" stroke="${D}" stroke-width="1.5"/>
      <line x1="-100" y1="-50" x2="-100" y2="40" stroke="${G}" stroke-width="2"/>
      <rect x="-108" y="-30" width="16" height="50" fill="${G}"/>
      <line x1="-65" y1="-80" x2="-65" y2="20" stroke="${P}" stroke-width="2"/>
      <rect x="-73" y="-60" width="16" height="60" fill="${P}"/>
      <line x1="-30" y1="-100" x2="-30" y2="0" stroke="${G}" stroke-width="2"/>
      <rect x="-38" y="-90" width="16" height="60" fill="${G}"/>
      <line x1="5" y1="-110" x2="5" y2="-30" stroke="${G}" stroke-width="2"/>
      <rect x="-3" y="-100" width="16" height="60" fill="${G}"/>
      <line x1="40" y1="-90" x2="40" y2="-10" stroke="${P}" stroke-width="2"/>
      <rect x="32" y="-70" width="16" height="50" fill="${P}"/>
      <line x1="75" y1="-130" x2="75" y2="-40" stroke="${G}" stroke-width="2"/>
      <rect x="67" y="-120" width="16" height="70" fill="${G}"/>
      <path d="M -100 -20 Q -50 -60 0 -70 Q 50 -80 100 -110" fill="none" stroke="${A}" stroke-width="2.5" stroke-dasharray="4 3"/>
    `),

  coin: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <circle cx="0" cy="0" r="80" fill="none" stroke="${A}" stroke-width="3"/>
      <circle cx="0" cy="0" r="68" fill="none" stroke="${A}" stroke-width="1.5" stroke-dasharray="3 4"/>
      <text x="0" y="22" fill="${A}" font-family="VT323, monospace" font-size="80" text-anchor="middle">₿</text>
      <line x1="-90" y1="-70" x2="-110" y2="-90" stroke="${G}" stroke-width="2"/>
      <line x1="90" y1="-70" x2="110" y2="-90" stroke="${G}" stroke-width="2"/>
    `),

  sparkline: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <line x1="-110" y1="60" x2="110" y2="60" stroke="${D}" stroke-width="1.5"/>
      <line x1="-110" y1="-90" x2="-110" y2="60" stroke="${D}" stroke-width="1.5"/>
      <path d="M -100 40 L -75 30 L -50 0 L -25 10 L 0 -20 L 25 -40 L 50 -30 L 75 -60 L 100 -85"
            fill="none" stroke="${G}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 100 -85 L 92 -78 L 88 -90 Z" fill="${G}"/>
      <text x="80" y="-100" fill="${A}" font-family="JetBrains Mono, monospace" font-size="14">▲ +28%</text>
    `),

  // ---------- Security / privacy ----------
  lock: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-50" y="-10" width="100" height="80" fill="none" stroke="${G}" stroke-width="3" rx="6"/>
      <path d="M -32 -10 L -32 -40 Q -32 -70 0 -70 Q 32 -70 32 -40 L 32 -10" fill="none" stroke="${A}" stroke-width="3"/>
      <circle cx="0" cy="20" r="8" fill="${A}"/>
      <line x1="0" y1="20" x2="0" y2="48" stroke="${A}" stroke-width="3"/>
    `),

  shield: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <path d="M 0 -90 L -75 -65 L -75 5 Q -75 70 0 95 Q 75 70 75 5 L 75 -65 Z"
            fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M -32 0 L -10 22 L 36 -28" fill="none" stroke="${A}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    `),

  // ---------- Build / hackathon / startup ----------
  trophy: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <path d="M -50 -75 L -50 -10 Q -50 25 0 25 Q 50 25 50 -10 L 50 -75 Z" fill="none" stroke="${A}" stroke-width="3"/>
      <path d="M -50 -55 Q -75 -55 -75 -30 Q -75 -10 -50 -10" fill="none" stroke="${A}" stroke-width="3"/>
      <path d="M 50 -55 Q 75 -55 75 -30 Q 75 -10 50 -10" fill="none" stroke="${A}" stroke-width="3"/>
      <line x1="0" y1="25" x2="0" y2="55" stroke="${G}" stroke-width="3"/>
      <rect x="-32" y="55" width="64" height="14" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M 0 -45 L 8 -25 L 28 -25 L 12 -12 L 18 8 L 0 -4 L -18 8 L -12 -12 L -28 -25 L -8 -25 Z" fill="${A}"/>
    `),

  rocket: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <path d="M -25 -85 Q 0 -120 25 -85 L 25 30 L -25 30 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M -25 -85 Q 0 -120 25 -85" fill="${A}"/>
      <circle cx="0" cy="-50" r="11" fill="none" stroke="${C}" stroke-width="3"/>
      <path d="M -25 0 L -50 35 L -25 28 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M 25 0 L 50 35 L 25 28 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M -15 30 L -8 60 L 0 35 L 8 60 L 15 30" fill="none" stroke="${A}" stroke-width="3" stroke-linecap="round"/>
      <path d="M -8 50 L 0 85 L 8 50" fill="none" stroke="${P}" stroke-width="3" stroke-linecap="round"/>
    `),

  // ---------- Mobile / hardware ----------
  phone: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-45" y="-95" width="90" height="170" fill="none" stroke="${G}" stroke-width="3" rx="10"/>
      <rect x="-35" y="-80" width="70" height="130" fill="none" stroke="${A}" stroke-width="2"/>
      <line x1="-15" y1="-90" x2="15" y2="-90" stroke="${A}" stroke-width="3"/>
      <circle cx="0" cy="62" r="6" fill="none" stroke="${A}" stroke-width="2"/>
      <rect x="-20" y="-65" width="40" height="20" fill="${G}" opacity="0.4"/>
      <rect x="-25" y="-35" width="50" height="3" fill="${C}"/>
      <rect x="-25" y="-25" width="35" height="3" fill="${C}"/>
      <rect x="-25" y="-15" width="42" height="3" fill="${C}"/>
    `),

  // ---------- Speak / write ----------
  microphone: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-22" y="-90" width="44" height="80" fill="none" stroke="${G}" stroke-width="3" rx="22"/>
      <line x1="-22" y1="-50" x2="22" y2="-50" stroke="${G}" stroke-width="2"/>
      <path d="M -45 -25 Q -45 20 0 20 Q 45 20 45 -25" fill="none" stroke="${A}" stroke-width="3"/>
      <line x1="0" y1="20" x2="0" y2="55" stroke="${G}" stroke-width="3"/>
      <line x1="-30" y1="55" x2="30" y2="55" stroke="${G}" stroke-width="3"/>
      <text x="55" y="-60" fill="${A}" font-family="JetBrains Mono, monospace" font-size="14">))</text>
      <text x="65" y="-40" fill="${A}" font-family="JetBrains Mono, monospace" font-size="14">))</text>
    `),

  book: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <path d="M -90 -50 L -90 60 L 0 50 L 90 60 L 90 -50 L 0 -60 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <line x1="0" y1="-60" x2="0" y2="50" stroke="${G}" stroke-width="3"/>
      <line x1="-75" y1="-35" x2="-12" y2="-40" stroke="${A}" stroke-width="1.5"/>
      <line x1="-75" y1="-20" x2="-12" y2="-25" stroke="${A}" stroke-width="1.5"/>
      <line x1="-75" y1="-5" x2="-12" y2="-10" stroke="${A}" stroke-width="1.5"/>
      <line x1="-75" y1="10" x2="-12" y2="5" stroke="${A}" stroke-width="1.5"/>
      <line x1="12" y1="-40" x2="75" y2="-35" stroke="${A}" stroke-width="1.5"/>
      <line x1="12" y1="-25" x2="75" y2="-20" stroke="${A}" stroke-width="1.5"/>
      <line x1="12" y1="-10" x2="75" y2="-5" stroke="${A}" stroke-width="1.5"/>
      <line x1="12" y1="5" x2="75" y2="10" stroke="${A}" stroke-width="1.5"/>
    `),

  // ---------- Travel / India ----------
  mountain: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <circle cx="60" cy="-90" r="14" fill="${A}"/>
      <path d="M -110 50 L -50 -20 L -10 30 L 30 -50 L 75 0 L 110 50 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M -50 -20 L -35 -10 L -25 -30 L -15 -10" fill="none" stroke="${C}" stroke-width="2"/>
      <path d="M 30 -50 L 40 -40 L 50 -55 L 60 -45" fill="none" stroke="${C}" stroke-width="2"/>
      <line x1="-110" y1="50" x2="110" y2="50" stroke="${D}" stroke-width="1.5"/>
    `),

  globe: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <circle cx="0" cy="0" r="85" fill="none" stroke="${G}" stroke-width="3"/>
      <ellipse cx="0" cy="0" rx="85" ry="30" fill="none" stroke="${D}" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="30" ry="85" fill="none" stroke="${D}" stroke-width="2"/>
      <line x1="-85" y1="0" x2="85" y2="0" stroke="${D}" stroke-width="2"/>
      <circle cx="-30" cy="-20" r="4" fill="${A}"/>
      <circle cx="20" cy="10" r="4" fill="${A}"/>
      <circle cx="40" cy="-30" r="4" fill="${A}"/>
      <path d="M -30 -20 Q 0 -40 20 10 Q 30 0 40 -30" fill="none" stroke="${A}" stroke-width="2" stroke-dasharray="3 3"/>
    `),

  // ---------- Misc ----------
  calendar: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-70" y="-60" width="140" height="120" fill="none" stroke="${G}" stroke-width="3" rx="4"/>
      <line x1="-70" y1="-30" x2="70" y2="-30" stroke="${G}" stroke-width="2"/>
      <line x1="-50" y1="-75" x2="-50" y2="-50" stroke="${A}" stroke-width="3"/>
      <line x1="50" y1="-75" x2="50" y2="-50" stroke="${A}" stroke-width="3"/>
      ${[0, 1, 2].flatMap(r => [0, 1, 2, 3, 4].map(c =>
        `<rect x="${-60 + c * 24}" y="${-15 + r * 22}" width="16" height="14" fill="${(r === 1 && c === 2) ? A : "none"}" stroke="${D}" stroke-width="1"/>`
      )).join("")}
    `),

  film: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <rect x="-95" y="-55" width="190" height="110" fill="none" stroke="${G}" stroke-width="3" rx="4"/>
      <rect x="-95" y="-55" width="190" height="14" fill="${D}" opacity="0.4"/>
      <rect x="-95" y="41" width="190" height="14" fill="${D}" opacity="0.4"/>
      ${[-70, -35, 0, 35, 70].map(x =>
        `<rect x="${x - 6}" y="-49" width="12" height="6" fill="${A}"/>
         <rect x="${x - 6}" y="43" width="12" height="6" fill="${A}"/>`).join("")}
      <text x="0" y="8" fill="${A}" font-family="VT323, monospace" font-size="48" text-anchor="middle">★ ★ ★</text>
    `),

  "code-brackets": (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <text x="0" y="35" fill="${G}" font-family="JetBrains Mono, monospace" font-weight="700" font-size="160" text-anchor="middle">{ }</text>
      <text x="0" y="80" fill="${A}" font-family="JetBrains Mono, monospace" font-size="20" text-anchor="middle">function ship() {`}</text>
    `),

  pen: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <line x1="-65" y1="65" x2="55" y2="-55" stroke="${G}" stroke-width="6" stroke-linecap="round"/>
      <path d="M 55 -55 L 75 -75 L 95 -55 L 75 -35 Z" fill="${A}" stroke="${A}" stroke-width="2"/>
      <line x1="-65" y1="65" x2="-75" y2="75" stroke="${G}" stroke-width="3"/>
      <line x1="-78" y1="78" x2="-95" y2="95" stroke="${G}" stroke-width="3" stroke-dasharray="2 4"/>
      <text x="-30" y="100" fill="${A}" font-family="JetBrains Mono, monospace" font-size="14">draft.md</text>
    `),

  cube: (cx, cy, s = 1) =>
    t(cx, cy, s, `
      <path d="M -60 -30 L 0 -60 L 60 -30 L 60 50 L 0 80 L -60 50 Z" fill="none" stroke="${G}" stroke-width="3"/>
      <path d="M 0 -60 L 0 20 L 60 50" fill="none" stroke="${A}" stroke-width="2"/>
      <path d="M 0 20 L -60 50" fill="none" stroke="${A}" stroke-width="2"/>
      <path d="M -60 -30 L 0 0 L 60 -30" fill="none" stroke="${D}" stroke-width="1.5" stroke-dasharray="3 3"/>
    `),
};

const fallback: string[] = ["code-brackets"];

const RULES: Array<[string[], string]> = [
  [["quant", "trading", "perpetual", "futures", "fomo", "feaws"], "candlestick"],
  [["crypto", "blockchain", "web3", "wagmi", "stablecoin", "btc", "eth"], "coin"],
  [["ai", "ml", "machine-learning", "agents", "intelligence"], "neural-net"],
  [["llm", "local-llm", "gpu", "models", "tokenize"], "chip"],
  [["security", "privacy", "infosec", "compliance", "hipaa"], "shield"],
  [["regulation", "fiu-ind", "regulatory", "aml"], "lock"],
  [["hackathon", "competition", "winner"], "trophy"],
  [["startup", "founder", "company", "build"], "rocket"],
  [["android", "ios", "mobile", "app"], "phone"],
  [["tedx", "talks", "speaker", "talk"], "microphone"],
  [["books", "reading", "writing", "essay", "diary", "journal"], "book"],
  [["travel", "trip", "papanasam", "kutladampatti", "fossconf"], "mountain"],
  [["india", "madurai", "bengaluru", "chennai"], "globe"],
  [["movies", "movie", "review"], "film"],
  [["career", "leadership", "leader", "meta"], "calendar"],
  [["pandemic", "personal", "now", "life"], "cube"],
  [["tech", "engineering", "code", "dev", "frontend", "backend"], "code-brackets"],
  [["#healthywealthy", "#hw", "wealth", "fire"], "sparkline"],
  [["college", "tce", "tecuthsav", "iccc", "events"], "trophy"],
  [["seo", "blogging"], "pen"],
];

export function pickMotifs(tags: string[]): string[] {
  const tset = new Set(tags.map((x) => x.toLowerCase()));
  const picked = new Set<string>();
  for (const [keys, motif] of RULES) {
    if (keys.some((k) => tset.has(k))) {
      picked.add(motif);
      if (picked.size >= 2) break;
    }
  }
  if (picked.size === 0) return fallback;
  return Array.from(picked).slice(0, 2);
}

export function renderMotifs(names: string[]): string {
  // 1 motif: centered at (940, 305) at scale 1.4
  // 2 motifs: at (870, 240) and (1020, 380) at scale 1.05
  if (names.length === 0) return "";
  if (names.length === 1) {
    const fn = motifs[names[0]] ?? motifs["code-brackets"];
    return fn(940, 305, 1.4);
  }
  const a = motifs[names[0]] ?? motifs["code-brackets"];
  const b = motifs[names[1]] ?? motifs["code-brackets"];
  return a(870, 240, 1.05) + b(1020, 380, 1.05);
}
