# scripts/

One-off tools for the blog migration. Run from the repo root.

## How to use any of these

```bash
cd ~/CascadeProjects/intrepidkarthi
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
```

After running an import, every new file lands in `src/content/posts/`
(or `src/content/notes/` for LinkedIn shares) marked **`draft: true`**
in frontmatter — so you review and pick which ones go live before
publishing.

---

## `import_medium.py` — your Medium articles

### Get the Medium export

1. medium.com → top-right avatar → **Settings**
2. **Security and apps** tab → **Download your information**
3. Click **Download .zip** (an email comes in 5–30 min)
4. Save the `medium-export.zip`

### Run

```bash
python3 scripts/import_medium.py path/to/medium-export.zip
# or, if you've already unzipped:
python3 scripts/import_medium.py path/to/extracted-folder/

# Preview first:
python3 scripts/import_medium.py path/to/zip --dry-run
```

Options: `--min-words N` (default 150 — skips short stubs),
`--include-drafts`, `--force`.

The importer captures Medium's canonical URL into your post's
frontmatter so you can keep both versions live without SEO penalty
(set `canonical_url` in your blog's HTML head from the frontmatter
field — the Astro template will handle this).

---

## `import_linkedin.py` — your LinkedIn articles + posts

### Get the LinkedIn export

1. linkedin.com → top-right **Me** → **Settings & Privacy**
2. **Data privacy** tab → **Get a copy of your data**
3. Tick **Articles** and **Posts** (or just **Articles** if you don't
   want short shares)
4. Click **Request archive**
5. **Wait for the email**:
   - Articles-only: usually ~10 minutes
   - Full archive: up to 24 hours
6. Download the ZIP

### Run

```bash
# Articles only (recommended first pass)
python3 scripts/import_linkedin.py path/to/linkedin-export.zip

# Articles + short shares (the latter go to src/content/notes/)
python3 scripts/import_linkedin.py path/to/linkedin-export.zip --notes

# Preview
python3 scripts/import_linkedin.py path/to/zip --dry-run
```

Options: `--min-words N` (articles, default 150),
`--shares-min-chars N` (notes, default 280 — filters out one-liners),
`--force`.

Long-form **Articles → `src/content/posts/`** as drafts.
Short **Shares/Posts → `src/content/notes/`** (only with `--notes`)
as drafts. LinkedIn's tracking redirects on outbound links are
automatically unwrapped.

---

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
