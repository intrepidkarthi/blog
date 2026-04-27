#!/usr/bin/env python3
"""
Import posts from a Medium account export.

How to get the export:
  1. medium.com → Settings → Security and apps → Download your information
  2. Click "Download .zip"
  3. Wait for the email (5-30 minutes), download the ZIP
  4. Run this script pointing at the ZIP

Behavior:
  - Reads `posts/*.html` from the export
  - Skips drafts (filenames starting with `draft_`)
  - Extracts title, subtitle, publish date, canonical URL, body
  - Strips Medium-specific cruft (CTAs, bottom links, social embeds)
  - Converts to Markdown with proper frontmatter
  - Writes to `src/content/posts/YYYY-MM-DD-slug.md`
  - Marks every post `draft: true` so YOU pick what goes live

Usage:
    pip install -r scripts/requirements.txt
    python3 scripts/import_medium.py path/to/medium-export.zip
    python3 scripts/import_medium.py path/to/extracted-folder/

Options:
    --min-words N    Skip posts with fewer than N words. Default 150.
    --include-drafts Also import drafts (still flagged draft: true).
    --force          Overwrite existing post files.
    --dry-run        Show what would be imported, write nothing.
"""

from __future__ import annotations

import argparse
import re
import sys
import zipfile
from datetime import datetime
from html import unescape
from pathlib import Path
from urllib.parse import urlparse

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing: pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "content" / "posts"


# ---------- HTML → Markdown (same lightweight converter) ----------

def html_to_md(html: str) -> str:
    s = html or ""
    s = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", s, flags=re.DOTALL)
    s = re.sub(r"\[/?\w+[^\]]*\]", "", s)

    def img_repl(m):
        src = re.search(r'src=["\']([^"\']+)', m.group(0))
        alt = re.search(r'alt=["\']([^"\']*)', m.group(0))
        return f"![{alt.group(1) if alt else ''}]({src.group(1) if src else ''})"
    s = re.sub(r"<img[^>]+>", img_repl, s)

    s = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
               r"[\2](\1)", s, flags=re.DOTALL)
    for n in range(6, 0, -1):
        s = re.sub(rf"<h{n}[^>]*>(.*?)</h{n}>",
                   lambda m, n=n: "\n\n" + "#" * n + " " + m.group(1).strip() + "\n\n",
                   s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<(?:strong|b)[^>]*>(.*?)</(?:strong|b)>", r"**\1**", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<(?:em|i)[^>]*>(.*?)</(?:em|i)>", r"*\1*", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<code[^>]*>(.*?)</code>", r"`\1`", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<pre[^>]*>(.*?)</pre>", r"\n\n```\n\1\n```\n\n", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1\n", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"</?(?:ul|ol)[^>]*>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<blockquote[^>]*>(.*?)</blockquote>",
               lambda m: "\n\n" + "\n".join("> " + ln for ln in m.group(1).strip().split("\n")) + "\n\n",
               s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"</p>", "\n\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<p[^>]*>", "", s, flags=re.IGNORECASE)
    s = re.sub(r"<[^>]+>", "", s)
    s = unescape(s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]+\n", "\n", s)
    return s.strip()


def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:80]


# ---------- Medium-specific extraction ----------

def parse_medium_post(html: str, filename: str) -> dict | None:
    """Return dict with title, subtitle, date, slug, canonical, body, tags."""
    soup = BeautifulSoup(html, "html.parser")

    # Title — Medium puts it in <h1 class="p-name"> or article header
    title_el = soup.select_one("h1.p-name") or soup.select_one("article h1") or soup.select_one("h1")
    title = title_el.get_text(strip=True) if title_el else None

    # Subtitle — first <h2> after title or .p-summary
    subtitle = None
    sub_el = soup.select_one(".p-summary") or soup.select_one("section h4")
    if sub_el:
        subtitle = sub_el.get_text(strip=True)

    # Date — from <time> tag or filename prefix
    date = None
    t = soup.select_one("time.dt-published, time")
    if t and t.get("datetime"):
        date = t["datetime"][:10]
    if not date:
        m = re.match(r"(\d{4}-\d{2}-\d{2})_", filename)
        if m:
            date = m.group(1)

    # Canonical URL
    canonical = None
    link = soup.find("a", class_="p-canonical")
    if link and link.get("href"):
        canonical = link["href"]
    if not canonical:
        meta = soup.find("link", rel="canonical")
        if meta and meta.get("href"):
            canonical = meta["href"]

    # Body — everything inside .e-content or article (after header)
    body_el = soup.select_one("section.e-content") or soup.select_one("article")
    if not body_el:
        return None

    # Strip Medium chrome
    for sel in [
        "h1.p-name",                    # title (already captured)
        ".p-summary",                   # subtitle
        ".p-canonical",                 # canonical anchor
        "footer",
        ".graf--footer",
        ".graf-after--figure.graf--blockquote",
        "section.e-content > div:last-child",  # CTA boxes
        ".js-postShareWidget",
    ]:
        for el in body_el.select(sel):
            el.decompose()

    # Drop empty paragraphs that Medium injects
    for p in body_el.find_all(["p", "div"]):
        if not p.get_text(strip=True) and not p.find("img"):
            p.decompose()

    body_html = str(body_el)
    body_md = html_to_md(body_html)

    if not title or not body_md:
        return None

    return {
        "title": title,
        "subtitle": subtitle,
        "date": date or "1970-01-01",
        "canonical": canonical,
        "body_md": body_md,
        "slug": slugify(title),
        "word_count": len(body_md.split()),
    }


# ---------- Iteration over export ----------

def iter_posts(source: Path, include_drafts: bool):
    """Yield (filename, html_text) from either a ZIP or a directory."""
    if source.is_file() and source.suffix == ".zip":
        with zipfile.ZipFile(source) as zf:
            for name in zf.namelist():
                if not name.startswith("posts/") or not name.endswith(".html"):
                    continue
                base = Path(name).name
                if base.startswith("draft_") and not include_drafts:
                    continue
                with zf.open(name) as f:
                    yield base, f.read().decode("utf-8", errors="replace")
    elif source.is_dir():
        posts_dir = source / "posts" if (source / "posts").exists() else source
        for p in sorted(posts_dir.glob("*.html")):
            if p.name.startswith("draft_") and not include_drafts:
                continue
            yield p.name, p.read_text(encoding="utf-8", errors="replace")
    else:
        raise SystemExit(f"Source must be a .zip or directory: {source}")


# ---------- Main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="Path to medium-export.zip or extracted folder")
    ap.add_argument("--min-words", type=int, default=150)
    ap.add_argument("--include-drafts", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    src = Path(args.source).resolve()

    counts = {"imported": 0, "skipped_short": 0, "skipped_existing": 0, "parse_failed": 0}
    for fname, html in iter_posts(src, args.include_drafts):
        post = parse_medium_post(html, fname)
        if not post:
            counts["parse_failed"] += 1
            print(f"  ✗ parse failed: {fname}")
            continue
        if post["word_count"] < args.min_words:
            counts["skipped_short"] += 1
            print(f"  · skip short ({post['word_count']}w): {post['title'][:60]}")
            continue
        out_path = POSTS_DIR / f"{post['date']}-{post['slug']}.md"
        if out_path.exists() and not args.force:
            counts["skipped_existing"] += 1
            print(f"  · skip existing: {out_path.name}")
            continue

        excerpt = post["subtitle"] or re.sub(r"\s+", " ", post["body_md"])[:160]
        excerpt = excerpt.replace('"', "'")[:200]
        title_safe = post["title"].replace('"', "'")

        fm_lines = [
            "---",
            f'title: "{title_safe}"',
            f"date: {post['date']}",
            f"slug: {post['slug']}",
            f'excerpt: "{excerpt}"',
            "tags: [imported]",
            "draft: true",
            "source: medium",
        ]
        if post["canonical"]:
            fm_lines.append(f"canonical_url: {post['canonical']}")
        fm_lines += ["---", "", post["body_md"], ""]
        content = "\n".join(fm_lines)

        if args.dry_run:
            print(f"  → would write {out_path.name} ({post['word_count']}w)")
        else:
            out_path.write_text(content, encoding="utf-8")
            counts["imported"] += 1
            print(f"  ✓ {out_path.name} ({post['word_count']}w)")

    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    for k, v in counts.items():
        print(f"  {k:>20s}: {v}")
    print()
    if not args.dry_run and counts["imported"]:
        print(f"Review imports:  ls -la {POSTS_DIR.relative_to(REPO)}")
        print('Each is `draft: true` — remove that line in frontmatter to publish.')


if __name__ == "__main__":
    main()
