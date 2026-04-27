# scripts/

One-off tools for the blog migration. Run from the repo root.

## `recover_from_wayback.py`

Recovers lost 2010–2013 blog posts from web.archive.org and writes them
as Markdown into `src/content/posts/`. URL list is in
`scripts/lost_post_urls.json` (58 posts).

### One-time setup

```bash
# from repo root
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
```

### Run it

```bash
# Dry run — see what it would do, write nothing
python3 scripts/recover_from_wayback.py --dry-run

# Recover all 58
python3 scripts/recover_from_wayback.py

# Test on first 3 only
python3 scripts/recover_from_wayback.py --limit 3
```

The script is **idempotent** — re-running skips any post whose `.md`
file already exists. Use `--force` to re-fetch.

Realistic expectations:
- Most posts (60–80%) will recover cleanly.
- Some will have no Wayback snapshot at all (especially shorter-lived
  posts crawled rarely). Those get logged and skipped.
- Some snapshots may be partial / mid-redesign and the body extractor
  will fail to find content. Also logged.

### Reviewing recovered posts

After the run, every recovered post gets these frontmatter flags:

```yaml
legacy: true
recovered_from: wayback
original_url: <old WP URL>
snapshot_url: <wayback snapshot URL>
tags: [recovered]
```

Browse `src/content/posts/` for files dated 2010+ and sanity-check
each one. Add real tags, fix any garbled HTML→MD conversion, then
remove the `tags: [recovered]` placeholder.

The full per-URL log is at `scripts/wayback_recovery.log`.

### Re-running for failures

If a post failed the first time, you can retry with `--force` once
Wayback's index updates (or after enough time passes — sometimes new
snapshots appear). Or accept that some posts are gone and move on.
