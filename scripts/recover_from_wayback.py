#!/usr/bin/env python3
"""
Recover lost blog posts (2010-2013) from the Wayback Machine.

The legacy WordPress install was wiped at some point between 2013 and 2022,
leaving ~58 post URLs in the old sitemap with no body content in any database
table. This script attempts to fetch each one from web.archive.org and
convert it into a clean Markdown file under src/content/posts/.

Usage:
    pip install -r scripts/requirements.txt
    python3 scripts/recover_from_wayback.py [--dry-run] [--limit N]

The script is idempotent — it will skip any post whose .md file already
exists. Run it as many times as you want; only missing posts get fetched.

Output:
    src/content/posts/YYYY-MM-DD-slug.md     (one per recovered post)
    scripts/wayback_recovery.log             (run log with successes/failures)
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import datetime
from html import unescape
from pathlib import Path
from urllib.parse import quote_plus

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Missing dependencies. Run:  pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


REPO = Path(__file__).resolve().parent.parent
URLS_JSON = REPO / "scripts" / "lost_post_urls.json"
POSTS_DIR = REPO / "src" / "content" / "posts"
LOG_FILE = REPO / "scripts" / "wayback_recovery.log"

WAYBACK_AVAILABLE = "https://archive.org/wayback/available"
WAYBACK_FETCH = "https://web.archive.org/web/{ts}id_/{url}"  # `id_` = raw, no toolbar
USER_AGENT = "intrepidkarthi-recovery/1.0 (+https://intrepidkarthi.com)"
DELAY_SEC = 1.5  # be polite to archive.org
TIMEOUT = 30


# -------- HTML → Markdown (lightweight, dependency-light) --------

def html_to_md(html: str) -> str:
    s = html or ""
    # Strip WordPress shortcodes
    s = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", s, flags=re.DOTALL)
    s = re.sub(r"\[/?\w+[^\]]*\]", "", s)
    # Images
    def img_repl(m):
        src = re.search(r'src=["\']([^"\']+)', m.group(0))
        alt = re.search(r'alt=["\']([^"\']*)', m.group(0))
        return f"![{alt.group(1) if alt else ''}]({src.group(1) if src else ''})"
    s = re.sub(r"<img[^>]+>", img_repl, s)
    # Links
    s = re.sub(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>',
               r"[\2](\1)", s, flags=re.DOTALL)
    # Headers
    for n in range(6, 0, -1):
        s = re.sub(rf"<h{n}[^>]*>(.*?)</h{n}>",
                   lambda m, n=n: "\n\n" + "#" * n + " " + m.group(1).strip() + "\n\n",
                   s, flags=re.DOTALL | re.IGNORECASE)
    # Inline formatting
    s = re.sub(r"<(?:strong|b)[^>]*>(.*?)</(?:strong|b)>", r"**\1**", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<(?:em|i)[^>]*>(.*?)</(?:em|i)>", r"*\1*", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<code[^>]*>(.*?)</code>", r"`\1`", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"<pre[^>]*>(.*?)</pre>", r"\n\n```\n\1\n```\n\n", s, flags=re.DOTALL | re.IGNORECASE)
    # Lists
    s = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1\n", s, flags=re.DOTALL | re.IGNORECASE)
    s = re.sub(r"</?(?:ul|ol)[^>]*>", "\n", s, flags=re.IGNORECASE)
    # Blockquote
    s = re.sub(r"<blockquote[^>]*>(.*?)</blockquote>",
               lambda m: "\n\n" + "\n".join("> " + ln for ln in m.group(1).strip().split("\n")) + "\n\n",
               s, flags=re.DOTALL | re.IGNORECASE)
    # Breaks / paragraphs
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.IGNORECASE)
    s = re.sub(r"</p>", "\n\n", s, flags=re.IGNORECASE)
    s = re.sub(r"<p[^>]*>", "", s, flags=re.IGNORECASE)
    # Remaining tags
    s = re.sub(r"<[^>]+>", "", s)
    s = unescape(s)
    # Whitespace tidy
    s = re.sub(r"\n{3,}", "\n\n", s)
    s = re.sub(r"[ \t]+\n", "\n", s)
    return s.strip()


# -------- Wayback fetch logic --------

def find_snapshot(session: requests.Session, url: str) -> tuple[str | None, str | None]:
    """Return (timestamp, snapshot_url) for the closest available snapshot.

    We bias toward 20130601 (mid-2013, near when the blog was last alive).
    """
    for target_ts in ("20130601", "20120601", "20111201", "20140101"):
        try:
            r = session.get(WAYBACK_AVAILABLE,
                            params={"url": url, "timestamp": target_ts},
                            timeout=TIMEOUT)
            r.raise_for_status()
            data = r.json()
            snap = data.get("archived_snapshots", {}).get("closest")
            if snap and snap.get("available"):
                return snap["timestamp"], snap["url"]
        except Exception as e:
            print(f"    [availability error @ {target_ts}] {e}")
    return None, None


def fetch_snapshot(session: requests.Session, ts: str, original_url: str) -> str | None:
    """Fetch the raw archived HTML using the `id_` format (no toolbar)."""
    fetch_url = WAYBACK_FETCH.format(ts=ts, url=original_url)
    try:
        r = session.get(fetch_url, timeout=TIMEOUT, allow_redirects=True)
        r.raise_for_status()
        return r.text
    except Exception as e:
        print(f"    [fetch error] {e}")
        return None


# -------- HTML extraction --------

def extract_post(html: str) -> dict | None:
    """Pick out title, date, content from a WordPress single-post page."""
    soup = BeautifulSoup(html, "html.parser")

    # Strip Wayback toolbar artifacts that sometimes leak through
    for sel in ["#wm-ipp-base", "#wm-ipp", "#donato", ".wb-autocomplete-suggestions"]:
        for el in soup.select(sel):
            el.decompose()
    for s in soup.find_all("script"):
        s.decompose()

    # Title: prefer .entry-title or <h1.post-title>, fall back to <title>
    title = None
    for sel in [".entry-title", "h1.post-title", "h1.entry-title", "h2.entry-title", "h1"]:
        el = soup.select_one(sel)
        if el and el.get_text(strip=True):
            title = el.get_text(strip=True)
            break
    if not title and soup.title:
        title = re.sub(r"\s*\|.*$", "", soup.title.get_text(strip=True))

    # Date: WP usually has <time datetime="..."> or .entry-date
    date = None
    el = soup.find("time")
    if el and el.get("datetime"):
        date = el["datetime"][:10]
    if not date:
        for sel in [".entry-date", ".published", ".post-date", ".date"]:
            d = soup.select_one(sel)
            if d:
                t = d.get_text(strip=True)
                m = re.search(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", t)
                if m:
                    date = f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
                    break

    # Body: the main entry content
    body_el = None
    for sel in [".entry-content", ".post-content", "article .entry", "article", ".post"]:
        body_el = soup.select_one(sel)
        if body_el and len(body_el.get_text(strip=True)) > 50:
            break

    if not body_el:
        return None

    # Drop common WP cruft
    for sel in [".sharedaddy", ".jp-relatedposts", ".comments-area", "#comments",
                ".post-navigation", ".nav-links", ".wp-block-comments",
                ".entry-meta", ".entry-footer", "footer"]:
        for el in body_el.select(sel):
            el.decompose()

    body_html = str(body_el)
    return {"title": title, "date": date, "body_html": body_html}


# -------- Markdown writer --------

def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s


def write_post(post: dict, fallback_date: str, slug: str, source_url: str, snapshot_url: str) -> Path | None:
    title = (post.get("title") or slug.replace("-", " ").title()).strip()
    title = re.sub(r"\s+", " ", title)
    date = post.get("date") or fallback_date

    body_md = html_to_md(post["body_html"])
    if len(body_md) < 30:
        return None

    plain = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", post["body_html"])).strip()
    excerpt = (plain[:160] + "…") if len(plain) > 160 else plain
    excerpt = excerpt.replace('"', "'")

    fm = [
        "---",
        f'title: "{title.replace(chr(34), chr(39))}"',
        f"date: {date}",
        f"slug: {slug}",
        f'excerpt: "{excerpt[:200]}"',
        f"tags: [recovered]",
        f"legacy: true",
        f"recovered_from: wayback",
        f"original_url: {source_url}",
        f"snapshot_url: {snapshot_url}",
        "---",
        "",
        body_md,
        "",
    ]
    out = POSTS_DIR / f"{date}-{slug}.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(fm), encoding="utf-8")
    return out


# -------- Main --------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Show what would be fetched, don't write files.")
    ap.add_argument("--limit", type=int, default=0, help="Stop after N posts (0 = all).")
    ap.add_argument("--force", action="store_true", help="Re-fetch even if .md already exists.")
    args = ap.parse_args()

    if not URLS_JSON.exists():
        print(f"Missing {URLS_JSON}. Run from repo root.", file=sys.stderr)
        sys.exit(1)

    urls = json.loads(URLS_JSON.read_text())
    print(f"Lost-post URLs to attempt: {len(urls)}")
    print(f"Output dir: {POSTS_DIR}")
    print(f"Mode: {'DRY-RUN' if args.dry_run else 'WRITE'}")
    print()

    session = requests.Session()
    session.headers["User-Agent"] = USER_AGENT

    log = []
    counts = {"recovered": 0, "skipped_existing": 0, "no_snapshot": 0, "extraction_failed": 0, "errors": 0}

    for i, item in enumerate(urls, 1):
        if args.limit and counts["recovered"] >= args.limit:
            break

        url, year, month, slug = item["url"], item["year"], item["month"], item["slug"]
        # Check if already recovered (by slug, regardless of date)
        existing = list(POSTS_DIR.glob(f"*-{slug}.md")) if POSTS_DIR.exists() else []
        if existing and not args.force:
            counts["skipped_existing"] += 1
            print(f"[{i:>3}/{len(urls)}] skip (exists): {slug}")
            continue

        print(f"[{i:>3}/{len(urls)}] {year}-{month}/{slug}")
        ts, snap_url = find_snapshot(session, url)
        if not ts:
            counts["no_snapshot"] += 1
            print("    ✗ no snapshot in Wayback")
            log.append({"url": url, "result": "no_snapshot"})
            time.sleep(DELAY_SEC)
            continue

        print(f"    ✓ snapshot @ {ts}")
        html = fetch_snapshot(session, ts, url)
        if not html:
            counts["errors"] += 1
            log.append({"url": url, "result": "fetch_error", "ts": ts})
            time.sleep(DELAY_SEC)
            continue

        post = extract_post(html)
        if not post:
            counts["extraction_failed"] += 1
            print("    ✗ couldn't find post body")
            log.append({"url": url, "result": "no_body", "ts": ts, "snap": snap_url})
            time.sleep(DELAY_SEC)
            continue

        fallback_date = f"{year}-{month}-15"
        if args.dry_run:
            print(f"    → would write: title='{post.get('title')}' date={post.get('date') or fallback_date}")
        else:
            out = write_post(post, fallback_date, slug, url, snap_url)
            if out:
                counts["recovered"] += 1
                print(f"    → wrote {out.name}")
                log.append({"url": url, "result": "recovered", "file": out.name, "snap": snap_url})
            else:
                counts["extraction_failed"] += 1
                log.append({"url": url, "result": "body_too_short", "snap": snap_url})

        time.sleep(DELAY_SEC)

    print()
    print("=" * 60)
    print("Summary")
    print("=" * 60)
    for k, v in counts.items():
        print(f"  {k:>20s}: {v}")

    LOG_FILE.write_text(
        f"# Recovery run @ {datetime.utcnow().isoformat()}Z\n"
        + "\n".join(json.dumps(e) for e in log) + "\n",
        encoding="utf-8",
    )
    print(f"\nLog saved: {LOG_FILE}")


if __name__ == "__main__":
    main()
