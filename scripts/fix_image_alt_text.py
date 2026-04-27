#!/usr/bin/env python3
"""
Fix empty alt attributes on imported article images.

The Medium and LinkedIn importers preserve images but often leave
the markdown `![](url)` form with empty alt — bad for accessibility
AND bad for SEO (Google uses alt text as a ranking signal).

This script walks src/content/posts/*.{md,mdx} and replaces empty
alt attributes with a derived alt: "<post title> — illustration N".
Numbered N starts at 1 per post and increments.

Idempotent. Posts that already have non-empty alt are skipped.

Usage:
    python3 scripts/fix_image_alt_text.py
    python3 scripts/fix_image_alt_text.py --dry-run
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
POSTS = REPO / "src" / "content" / "posts"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    counts = {"posts_scanned": 0, "posts_updated": 0, "alts_filled": 0}

    for path in sorted(POSTS.glob("*.md*")):
        counts["posts_scanned"] += 1
        text = path.read_text(encoding="utf-8")

        # Extract the title from frontmatter
        m = re.match(r"---\s*\n(.+?)\n---\n", text, re.DOTALL)
        if not m:
            continue
        fm = m.group(1)
        title_m = re.search(r'^title:\s*"?([^"\n]+)"?\s*$', fm, re.MULTILINE)
        title = title_m.group(1).strip() if title_m else path.stem

        # Find ![](url) markdown images with empty alt
        idx = [0]
        def repl(m):
            idx[0] += 1
            url = m.group(1)
            alt = f"{title} — illustration {idx[0]}"
            counts["alts_filled"] += 1
            # escape brackets in alt to be safe
            alt = alt.replace("[", "(").replace("]", ")")
            return f"![{alt}]({url})"

        new_text, n = re.subn(r"!\[\]\(([^)]+)\)", repl, text)

        # Also handle <img alt="" src="..."> HTML images (some Medium imports may use these)
        def html_img_repl(m):
            idx[0] += 1
            tag = m.group(0)
            alt = f"{title} — illustration {idx[0]}"
            return re.sub(r'\balt=""', f'alt="{alt}"', tag, count=1)
        new_text, n2 = re.subn(r'<img[^>]*\balt=""[^>]*>', html_img_repl, new_text)

        if n + n2 > 0 and new_text != text:
            counts["posts_updated"] += 1
            print(f"  ✓ {path.name}: {n + n2} alt(s) filled")
            if not args.dry_run:
                path.write_text(new_text, encoding="utf-8")

    print()
    print("=" * 50)
    for k, v in counts.items():
        print(f"  {k:>20s}: {v}")
    if args.dry_run:
        print("\n(dry run — nothing written)")


if __name__ == "__main__":
    main()
