#!/usr/bin/env python3
"""
Import LinkedIn articles + posts from the official data export.

Handles BOTH export shapes LinkedIn ships:
  1. Articles.csv + matched HTML files (older "Fast" archive)
  2. Articles/Articles/*.html only (current "Basic" archive)

For each long-form article:
  - Extract title from <h1>/<title>, date from <p class="published">/.created
  - Detect images, rewrite src to /images/articles/<slug>/<n>.<ext>
  - Save image-download manifest at scripts/article_images_manifest.json
  - Convert HTML body to Markdown
  - Skip likely duplicates of existing posts (fuzzy title match)
  - Write to src/content/posts/<YYYY-MM-DD>-<slug>.md as draft: true

Short posts/shares (if Shares.csv present) optionally land in
src/content/notes/ with --notes.

After import, run scripts/download_article_images.py on your Mac to
fetch the images locally before LinkedIn's signed URLs expire.

Usage:
    pip install -r scripts/requirements.txt
    python3 scripts/import_linkedin.py path/to/linkedin-export.zip
    python3 scripts/import_linkedin.py path/to/linkedin-export.zip --notes
    python3 scripts/import_linkedin.py path/to/linkedin-export.zip --dry-run
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import re
import sys
import zipfile
from datetime import datetime
from html import unescape
from pathlib import Path
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing: pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


REPO = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO / "src" / "content" / "posts"
NOTES_DIR = REPO / "src" / "content" / "notes"
IMAGES_DIR_REL = "images/articles"  # under public/
IMAGE_MANIFEST = REPO / "scripts" / "article_images_manifest.json"


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

    # <figcaption> → caption italic line
    s = re.sub(r"<figcaption[^>]*>(.*?)</figcaption>",
               lambda m: ("\n*" + m.group(1).strip() + "*\n") if m.group(1).strip() else "",
               s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"</?figure[^>]*>", "\n", s, flags=re.IGNORECASE)

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
    return s[:80] or "untitled"


def normalize_for_dedup(title: str) -> str:
    """Strip stopwords + punctuation for fuzzy duplicate detection."""
    s = re.sub(r"[^\w\s]", " ", title.lower())
    stop = {"a", "an", "the", "of", "for", "to", "in", "on", "and", "or",
            "is", "are", "be", "i", "ve", "s", "t", "ll", "d", "from",
            "at", "as", "with", "my", "your", "this", "that", "it", "by"}
    words = [w for w in s.split() if w and w not in stop]
    return " ".join(sorted(set(words)))


def clean_li_url(u: str) -> str:
    try:
        p = urlparse(u)
        if "linkedin.com" in p.netloc and "url=" in p.query:
            qs = parse_qs(p.query)
            if "url" in qs:
                return qs["url"][0]
        if p.query:
            qs = parse_qs(p.query, keep_blank_values=True)
            qs = {k: v for k, v in qs.items() if not k.startswith("utm_")}
            new_q = urlencode(qs, doseq=True)
            p = p._replace(query=new_q)
            return urlunparse(p)
    except Exception:
        pass
    return u


def guess_image_ext(url: str) -> str:
    """LinkedIn CDN URLs don't include an extension; default to jpg, override
    if path ends in something obvious."""
    path = urlparse(url).path.lower()
    for ext in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
        if ext in path:
            return ext.lstrip(".")
    return "jpg"


# ---------- Open the export ----------

def open_export(source: Path):
    if source.is_file() and source.suffix == ".zip":
        zf = zipfile.ZipFile(source)
        return (lambda: zf.namelist(),
                lambda n: zf.open(n).read().decode("utf-8", errors="replace") if n in zf.namelist() else None,
                zf)
    elif source.is_dir():
        all_names = [str(p.relative_to(source)) for p in source.rglob("*") if p.is_file()]
        def read(n):
            p = source / n
            return p.read_text(encoding="utf-8", errors="replace") if p.exists() else None
        return lambda: all_names, read, None
    raise SystemExit(f"Source must be a .zip or directory: {source}")


# ---------- Existing-posts cache for dedup ----------

def existing_titles_normalized() -> dict[str, Path]:
    """Map normalized-title → file path, for fuzzy dedup."""
    out = {}
    if not POSTS_DIR.exists():
        return out
    fm_re = re.compile(r'^title:\s*"?([^"\n]+)"?\s*$', re.MULTILINE)
    for p in POSTS_DIR.glob("*.md"):
        try:
            head = p.read_text(encoding="utf-8")[:600]
            m = fm_re.search(head)
            if m:
                key = normalize_for_dedup(m.group(1))
                if key:
                    out[key] = p
        except Exception:
            pass
    return out


# ---------- Article extraction ----------

def parse_article_html(html: str, filename: str) -> dict | None:
    soup = BeautifulSoup(html, "html.parser")

    # Title
    title = None
    for sel in ["h1", "title"]:
        el = soup.select_one(sel)
        if el and el.get_text(strip=True):
            title = el.get_text(strip=True)
            break
    if not title:
        return None

    # Date — LinkedIn shows "Published on YYYY-MM-DD HH:MM:SS UTC" in <p class="published">
    date = None
    pub = soup.select_one(".published") or soup.select_one(".created")
    if pub:
        m = re.search(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", pub.get_text())
        if m:
            date = f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    if not date:
        # Fallback to filename prefix like "2021-12-31..."
        m = re.match(r"(\d{4})-(\d{2})-(\d{2})", Path(filename).stem)
        if m:
            date = m.group(0)
    if not date:
        date = "1970-01-01"

    # Original URL — LinkedIn embeds it in <h1><a href=...>
    h1_link = soup.select_one("h1 a[href]")
    original_url = h1_link["href"] if h1_link else None

    # Body — strip header chrome
    body_el = soup.select_one("div.body") or soup.body
    if not body_el:
        return None
    # Remove title and date metadata from body
    for sel in ["h1", ".created", ".published", "head", "style", "script"]:
        for el in body_el.select(sel):
            el.decompose()

    # Extract images (rewrite src + capture for download manifest)
    images = []
    slug = slugify(title)
    for idx, img in enumerate(body_el.select("img"), 1):
        orig_src = img.get("src", "")
        if not orig_src or orig_src.startswith("/images/"):
            continue
        ext = guess_image_ext(orig_src)
        local_name = f"{idx:02d}.{ext}"
        local_path = f"/{IMAGES_DIR_REL}/{slug}/{local_name}"
        img["src"] = local_path
        # alt fallback
        if not img.get("alt"):
            img["alt"] = title
        images.append({
            "slug": slug,
            "index": idx,
            "original_url": orig_src,
            "local_path_rel": f"public{local_path}",  # for download script
            "site_path": local_path,                  # for markdown reference
            "ext": ext,
        })

    body_html = str(body_el)
    body_md = html_to_md(body_html)

    return {
        "title": title,
        "date": date,
        "slug": slug,
        "original_url": original_url,
        "body_md": body_md,
        "word_count": len(body_md.split()),
        "images": images,
    }


# ---------- Articles import ----------

def import_articles(names_fn, read_fn, *, min_words: int, force: bool, dry: bool, counts: dict, dedup_map: dict):
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    image_manifest: list = []

    # Find every Articles HTML file
    article_htmls = [n for n in names_fn() if n.lower().endswith(".html") and "articles/" in n.lower()]
    print(f"  Found {len(article_htmls)} article HTML files")

    # Also support older CSV-driven export — read CSV first, but supplement with HTML loop
    # (We'll just loop the HTML files; LinkedIn includes everything as HTML these days.)

    for fname in sorted(article_htmls):
        html = read_fn(fname)
        if not html:
            counts["articles_parse_failed"] += 1
            continue
        post = parse_article_html(html, fname)
        if not post:
            counts["articles_parse_failed"] += 1
            print(f"  ✗ couldn't parse: {fname}")
            continue
        if post["word_count"] < min_words:
            counts["articles_skipped_short"] += 1
            print(f"  · skip short ({post['word_count']}w): {post['title'][:60]}")
            continue

        # Dedup by normalized title
        norm = normalize_for_dedup(post["title"])
        if norm in dedup_map:
            counts["articles_skipped_duplicate"] += 1
            print(f"  · skip duplicate of {dedup_map[norm].name}: {post['title'][:60]}")
            continue

        out = POSTS_DIR / f"{post['date']}-{post['slug']}.md"
        if out.exists() and not force:
            counts["articles_skipped_existing"] += 1
            print(f"  · skip existing: {out.name}")
            continue

        excerpt = re.sub(r"\s+", " ", post["body_md"])[:200].replace('"', "'")
        title_safe = post["title"].replace('"', "'")
        lines = [
            "---",
            f'title: "{title_safe}"',
            f"date: {post['date']}",
            f"slug: {post['slug']}",
            f'excerpt: "{excerpt}"',
            "tags: [linkedin, imported]",
            "draft: true",
            "source: linkedin-article",
        ]
        if post["original_url"]:
            lines.append(f"canonical_url: {post['original_url']}")
        if post["images"]:
            lines.append(f"image_count: {len(post['images'])}")
        lines += ["---", "", post["body_md"], ""]

        if dry:
            print(f"  → would write {out.name} ({post['word_count']}w, {len(post['images'])} img)")
        else:
            out.write_text("\n".join(lines), encoding="utf-8")
            counts["articles_imported"] += 1
            print(f"  ✓ {out.name} ({post['word_count']}w, {len(post['images'])} img)")
            dedup_map[norm] = out

        image_manifest.extend(post["images"])

    # Save image manifest for the download script
    if image_manifest and not dry:
        existing = []
        if IMAGE_MANIFEST.exists():
            try:
                existing = json.loads(IMAGE_MANIFEST.read_text())
            except Exception:
                existing = []
        # dedup by (slug, index, original_url)
        seen = {(e["slug"], e["index"], e["original_url"]) for e in existing}
        for item in image_manifest:
            k = (item["slug"], item["index"], item["original_url"])
            if k not in seen:
                existing.append(item)
                seen.add(k)
        IMAGE_MANIFEST.write_text(json.dumps(existing, indent=2), encoding="utf-8")
        counts["images_queued_for_download"] = len(image_manifest)


# ---------- Shares (short posts) — unchanged ----------

def import_shares(names_fn, read_fn, *, min_chars: int, force: bool, dry: bool, counts: dict):
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

    seen_dates = {}
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

        date = None
        for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y",
                    "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%fZ"):
            try:
                date = datetime.strptime(date_raw[:19].replace("Z", ""), fmt).strftime("%Y-%m-%d")
                break
            except ValueError:
                continue
        date = date or "1970-01-01"

        seen_dates[date] = seen_dates.get(date, 0) + 1
        idx = seen_dates[date]
        slug = f"linkedin-{idx:02d}"
        out = NOTES_DIR / f"{date}-{slug}.md"
        if out.exists() and not force:
            counts["shares_skipped_existing"] += 1
            continue

        body = text
        excerpt = re.sub(r"\s+", " ", body)[:200].replace('"', "'")
        title = re.sub(r"\s+", " ", body)[:60] or "Untitled note"
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
    ap.add_argument("source")
    ap.add_argument("--notes", action="store_true")
    ap.add_argument("--min-words", type=int, default=150)
    ap.add_argument("--shares-min-chars", type=int, default=280)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = Path(args.source).resolve()
    names_fn, read_fn, _zf = open_export(src)
    dedup_map = existing_titles_normalized()

    counts = {
        "articles_imported": 0, "articles_skipped_short": 0,
        "articles_skipped_existing": 0, "articles_skipped_duplicate": 0,
        "articles_parse_failed": 0,
        "shares_imported": 0, "shares_skipped_short": 0, "shares_skipped_existing": 0,
        "images_queued_for_download": 0,
    }

    print(f"Source: {src}")
    print(f"Existing posts (dedup pool): {len(dedup_map)}")
    print()
    print("=== Articles ===")
    import_articles(names_fn, read_fn,
                    min_words=args.min_words, force=args.force,
                    dry=args.dry_run, counts=counts, dedup_map=dedup_map)

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
        print(f"  {k:>32s}: {v}")
    print()
    if counts["images_queued_for_download"]:
        print(f'Images queued in {IMAGE_MANIFEST.relative_to(REPO)}.')
        print(f'Run on your Mac (with internet):  python3 scripts/download_article_images.py')
    print('Every import has `draft: true` — review, then remove the flag to publish.')


if __name__ == "__main__":
    main()
