#!/usr/bin/env python3
"""
Download images referenced by imported LinkedIn (and Medium) articles.

Reads scripts/article_images_manifest.json (created by import_linkedin.py)
and downloads each image to public/<images/articles/SLUG/INDEX.EXT>.

LinkedIn's CDN URLs are signed and EXPIRE — usually within a few months.
Run this immediately after the import or you'll lose the images.

Usage:
    python3 scripts/download_article_images.py
    python3 scripts/download_article_images.py --force
    python3 scripts/download_article_images.py --dry-run
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("Missing: pip install -r scripts/requirements.txt", file=sys.stderr)
    sys.exit(1)


REPO = Path(__file__).resolve().parent.parent
MANIFEST = REPO / "scripts" / "article_images_manifest.json"
USER_AGENT = "intrepidkarthi-blog-image-fetcher/1.0"
DELAY = 0.4
TIMEOUT = 30


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="Re-download even if file exists.")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not MANIFEST.exists():
        print(f"No manifest at {MANIFEST}.", file=sys.stderr)
        print("Run scripts/import_linkedin.py first.", file=sys.stderr)
        sys.exit(1)

    items = json.loads(MANIFEST.read_text())
    print(f"Manifest entries: {len(items)}")
    print()

    session = requests.Session()
    session.headers["User-Agent"] = USER_AGENT

    counts = {"downloaded": 0, "skipped_existing": 0, "errors": 0}
    for i, it in enumerate(items, 1):
        out = REPO / it["local_path_rel"]
        if out.exists() and not args.force:
            counts["skipped_existing"] += 1
            print(f"[{i:>3}/{len(items)}] skip (exists): {it['local_path_rel']}")
            continue

        print(f"[{i:>3}/{len(items)}] {it['slug']} #{it['index']}")
        if args.dry_run:
            print(f"    → would save to {it['local_path_rel']}")
            continue
        try:
            r = session.get(it["original_url"], timeout=TIMEOUT, allow_redirects=True)
            r.raise_for_status()
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_bytes(r.content)
            counts["downloaded"] += 1
            print(f"    ✓ saved {len(r.content)//1024} KB → {it['local_path_rel']}")
        except Exception as e:
            counts["errors"] += 1
            print(f"    ✗ {e}")
        time.sleep(DELAY)

    print()
    print("=" * 60)
    for k, v in counts.items():
        print(f"  {k:>20s}: {v}")
    if counts["errors"]:
        print()
        print("Note: errors usually mean the LinkedIn signed URL expired.")
        print("Re-export from LinkedIn and re-run import_linkedin.py to refresh URLs.")


if __name__ == "__main__":
    main()
