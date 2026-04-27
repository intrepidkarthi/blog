#!/usr/bin/env python3
"""
Import posts and articles from a LinkedIn data export.

How to get the export:
  1. linkedin.com → Me → Settings & Privacy → Data privacy →
     "Get a copy of your data"
  2. Tick "Articles" and "Posts" (or "Want something in particular?" → Articles)
  3. Request archive — wait for email (often 24+ hours for full archive,
     ~10 minutes for partial). Download the ZIP.
  4. Run this script pointing at the ZIP.

Behavior:
  - Long-form Articles  → src/content/posts/  as draft: true
  - Short Shares/Posts  → src/content/notes/  as draft: true (optional, --notes)
  - Reads `Articles/Articles.csv` for article metadata + matches HTML files
  - Reads `Shares.csv` for short posts
  - Strips LinkedIn UTM params and tracking redirects from links

Usage:
    pip install -r scripts/requirements.txt
    python3 scripts/import_linkedin.py path/to/linkedin-export.zip

Options:
    --notes              Also import short shares to src/content/notes/
    --min-words N        Skip articles with fewer than N words. Default 150.
    --shares-min-chars N Skip shares shorter than N chars. Default 280.
    --force              Overwrite existing files.
    --dry-run            Preview only.
"""

from __future__ import annotations

import argparse
import csv
import io
import re
import sys
import zipfile
from datetime import datetime
from html import unescape
from pathlib import Path
from urllib.parse import urlparse, parse_qs, urlunparse

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing: pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "content" / "posts"
NOTES_DIR = REPO / "src" / "content" / "notes"


# ---------- HTML → Markdown ----------

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
    return s[:80] or "untitled"


def clean_li_url(u: str) -> str:
    """LinkedIn wraps external links in tracking redirects; unwrap them."""
    try:
        p = urlparse(u)
        if "linkedin.com" in p.netloc and "url=" in p.query:
            qs = parse_qs(p.query)
            if "url" in qs:
                return qs["url"][0]
        # strip utm_*
        if p.query:
            qs = parse_qs(p.query, keep_blank_values=True)
            qs = {k: v for k, v in qs.items() if not k.startswith("utm_")}
            from urllib.parse import urlencode
            new_q = urlencode(qs, doseq=True)
            p = p._replace(query=new_q)
            return urlunparse(p)
    except Exception:
        pass
    return u


# ---------- Open the export (ZIP or directory) ----------

def open_export(source: Path):
    """Return a callable: `read(name) -> str | None` and a list-of-names function."""
    if source.is_file() and source.suffix == ".zip":
        zf = zipfile.ZipFile(source)
        def names(): return zf.namelist()
        def read(name):
            try:
                with zf.open(name) as f:
                    return f.read().decode("utf-8", errors="replace")
            except KeyError:
                return None
        return names, read, zf
    elif source.is_dir():
        all_names = [str(p.relative_to(source)) for p in source.rglob("*") if p.is_file()]
        def names(): return all_names
        def read(name):
            p = source / name
            if p.exists():
                return p.read_text(encoding="utf-8", errors="replace")
            return None
        return names, read, None
    else:
        raise SystemExit(f"Source must be a .zip or directory: {source}")


# ---------- Articles ----------

def import_articles(names_fn, read_fn, *, min_words: int, force: bool, dry: bool, counts: dict):
    """Read Articles/Articles.csv and matched .html files."""
    articles_csv = next((n for n in names_fn() if n.lower().endswith("articles.csv")), None)
    if not articles_csv:
        print("  (no Articles.csv found in export — skipping articles)")
        return

    csv_text = read_fn(articles_csv)
    if not csv_text:
        return
    reader = csv.DictReader(io.StringIO(csv_text))

    POSTS_DIR.mkdir(parents=True, exist_ok=True)

    for row in reader:
        # Common LI columns: PublishedDate, Title, Url, Slug, Content, FirstPublishedAt
        title = (row.get("Title") or row.get("title") or "").strip()
        date_raw = (row.get("PublishedDate") or row.get("FirstPublishedAt")
                    or row.get("Published date") or row.get("Date") or "").strip()
        url = (row.get("Url") or row.get("URL") or row.get("ArticleLink") or "").strip()
        body = (row.get("Content") or row.get("ArticleContent") or "").strip()

        # Try to parse date
        date = None
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S"):
            try:
                date = datetime.strptime(date_raw[:19], fmt).strftime("%Y-%m-%d")
                break
            except ValueError:
                continue
        if not date:
            date = "1970-01-01"

        # If body in CSV is empty, look for Articles/<slug>.html
        if len(body) < 50:
            html_candidate = next((n for n in names_fn()
                                   if n.lower().startswith("articles/")
                                   and n.lower().endswith(".html")
                                   and (slugify(title) in n.lower() or
                                        (url and url.split("/")[-1] in n))), None)
            if html_candidate:
                body = read_fn(html_candidate) or ""

        if not title or not body:
            counts["articles_parse_failed"] += 1
            continue

        body_md = html_to_md(body)
        wc = len(body_md.split())
        if wc < min_words:
            counts["articles_skipped_short"] += 1
            print(f"  · skip article ({wc}w): {title[:60]}")
            continue

        slug = slugify(title)
        out = POSTS_DIR / f"{date}-{slug}.md"
        if out.exists() and not force:
            counts["articles_skipped_existing"] += 1
            print(f"  · skip existing: {out.name}")
            continue

        excerpt = re.sub(r"\s+", " ", body_md)[:200].replace('"', "'")
        title_safe = title.replace('"', "'")
        lines = [
            "---",
            f'title: "{title_safe}"',
            f"date: {date}",
            f"slug: {slug}",
            f'excerpt: "{excerpt}"',
            "tags: [linkedin, imported]",
            "draft: true",
            "source: linkedin-article",
        ]
        if url:
            lines.append(f"canonical_url: {url}")
        lines += ["---", "", body_md, ""]

        if dry:
            print(f"  → would write {out.name} ({wc}w)")
        else:
            out.write_text("\n".join(lines), encoding="utf-8")
            counts["articles_imported"] += 1
            print(f"  ✓ {out.name} ({wc}w)")


# ---------- Shares (short posts) ----------

def import_shares(names_fn, read_fn, *, min_chars: int, force: bool, dry: bool, counts: dict):
    """Read Shares.csv (or Posts.csv) — short LinkedIn posts."""
    shares_csv = next((n for n in names_fn()
                       if n.lower().endswith(("shares.csv", "posts.csv"))
                       and "comments" not in n.lower()), None)
    if not shares_csv:
        print("  (no Shares.csv found — skipping notes)")
        return

    csv_text = read_fn(shares_csv)
    if not csv_text:
        return
    reader = csv.DictReader(io.StringIO(csv_text))

    NOTES_DIR.mkdir(parents=True, exist_ok=True)

    seen_dates = {}  # date → counter, to dedupe filenames
    for row in reader:
        text = (row.get("ShareCommentary") or row.get("Commentary")
                or row.get("Text") or row.get("Message") or "").strip()
        date_raw = (row.get("Date") or row.get("ShareDate")
                    or row.get("CreatedAt") or row.get("Created Time") or "").strip()
        link = (row.get("ShareLink") or row.get("Link") or row.get("URL") or "").strip()
        visibility = (row.get("Visibility") or "").strip().upper()

        if visibility and visibility not in ("PUBLIC", "ANYONE", "MEMBER"):
            continue
        if len(text) < min_chars:
            counts["shares_skipped_short"] += 1
            continue

        # Date parse
        date = None
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S",
                    "%Y-%m-%dT%H:%M:%S.%fZ"):
            try:
                date = datetime.strptime(date_raw[:19].replace("Z", ""), fmt).strftime("%Y-%m-%d")
                break
            except ValueError:
                continue
        date = date or "1970-01-01"

        # Filename uses date + counter
        seen_dates[date] = seen_dates.get(date, 0) + 1
        idx = seen_dates[date]
        slug = f"linkedin-{idx:02d}"
        out = NOTES_DIR / f"{date}-{slug}.md"
        if out.exists() and not force:
            counts["shares_skipped_existing"] += 1
            continue

        # Convert plain-text-ish content; LI shares are mostly plain
        body = text
        # turn double-newlines into paragraphs already
        excerpt = re.sub(r"\s+", " ", body)[:200].replace('"', "'")
        title = (re.sub(r"\s+", " ", body)[:60] or "Untitled note")
        title_safe = title.replace('"', "'") + ("…" if len(body) > 60 else "")

        lines = [
            "---",
            f'title: "{title_safe}"',
            f"date: {date}",
            f"slug: {slug}",
            f'excerpt: "{excerpt}"',
            "tags: [linkedin, note]",
            "draft: true",
            "source: linkedin-share",
        ]
        if link:
            lines.append(f"original_url: {clean_li_url(link)}")
        lines += ["---", "", body, ""]

        if dry:
            print(f"  → would write {out.name} ({len(body)}c)")
        else:
            out.write_text("\n".join(lines), encoding="utf-8")
            counts["shares_imported"] += 1
            print(f"  ✓ {out.name} ({len(body)}c)")


# ---------- Main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", help="Path to LinkedIn export ZIP or extracted folder")
    ap.add_argument("--notes", action="store_true", help="Also import short shares to src/content/notes/")
    ap.add_argument("--min-words", type=int, default=150)
    ap.add_argument("--shares-min-chars", type=int, default=280)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = Path(args.source).resolve()
    names_fn, read_fn, _zf = open_export(src)

    counts = {
        "articles_imported": 0, "articles_skipped_short": 0,
        "articles_skipped_existing": 0, "articles_parse_failed": 0,
        "shares_imported": 0, "shares_skipped_short": 0, "shares_skipped_existing": 0,
    }

    print("=== Articles ===")
    import_articles(names_fn, read_fn,
                    min_words=args.min_words, force=args.force,
                    dry=args.dry_run, counts=counts)

    if args.notes:
        print()
        print("=== Shares (notes) ===")
        import_shares(names_fn, read_fn,
                      min_chars=args.shares_min_chars, force=args.force,
                      dry=args.dry_run, counts=counts)

    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    for k, v in counts.items():
        print(f"  {k:>30s}: {v}")
    print()
    print('Every import has `draft: true` — review, then remove the flag to publish.')


if __name__ == "__main__":
    main()
