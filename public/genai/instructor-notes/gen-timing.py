#!/usr/bin/env python3
"""Regenerate TIMING.md from the six decks' presenter `var DATA` arrays.

The decks are the single source of truth for per-slide budgets (press S in a
deck to see the same numbers live). Re-run after any deck edit, then rebuild
the HTML twin with build-twins.py:

    python3 instructor-notes/gen-timing.py
    python3 instructor-notes/build-twins.py TIMING.md

Everything above the first "## Session" heading in TIMING.md (the delivery
contract prose) is kept verbatim; the six session tables are rewritten.
"""
import glob
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TIMING = os.path.join(ROOT, 'TIMING.md')
BLOCK = 120  # minutes per session


def deck_data(path):
    src = open(path, encoding='utf-8').read()
    m = re.search(r'var DATA\s*=\s*(\[.*?\]);\s*\n', src, re.S)
    if not m:
        raise SystemExit(f'no DATA array in {path}')
    data = json.loads(m.group(1))
    n_slides = len(re.findall(r'<section class="slide', src))
    if n_slides != len(data):
        raise SystemExit(f'{path}: {n_slides} slides but DATA has {len(data)} entries')
    title = re.search(r'<title>(.*?)</title>', src, re.S).group(1)
    title = html.unescape(re.sub(r'\s+', ' ', title)).strip()
    # "<title>Session 1 · How Machines Learned to Talk — GenAI Foundations · TCE</title>" → deck's own title
    title = re.sub(r'^Session \d+\s*·\s*', '', title.split(' — ')[0]).strip()
    return data, title


def fmt_min(m):
    return f'{m:g} min'


def fmt_cum(m):
    mins = int(m)
    secs = int(round((m - mins) * 60))
    return f'{mins}:{secs:02d}'


def plain(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).replace('|', '\\|').strip()


def session_block(n, deck_title, data):
    total = sum(d['m'] for d in data)
    if total >= BLOCK - 0.01:
        sub = f'*{len(data)} slides · scheduled total ≈ {total:g} min*'
    else:
        sub = (f'*{len(data)} slides · core content ≈ {total:g} min; reserve ≈ {BLOCK - total:g} min '
               f'for guided discussion, troubleshooting, and late pairs*')
    out = [f'## Session {n} — {deck_title}', sub, '', '| # | Slide | Budget | Cumulative | |', '|---|---|---|---|---|']
    run = 0
    for i, d in enumerate(data, 1):
        run += d['m']
        out.append(f"| {i} | {plain(d.get('title', ''))} | {fmt_min(d['m'])} | {fmt_cum(run)} | {'▸' if d.get('c') else ''} |")
    return '\n'.join(out) + '\n'


def main():
    decks = sorted(glob.glob(os.path.join(ROOT, 'presentations', 'session-*.html')))
    assert len(decks) == 6, decks
    head = open(TIMING, encoding='utf-8').read().split('\n## Session 1')[0].rstrip() + '\n\n'
    body = []
    for path in decks:
        n = int(re.search(r'session-(\d)', os.path.basename(path)).group(1))
        data, title = deck_data(path)
        body.append(session_block(n, title, data))
    open(TIMING, 'w', encoding='utf-8').write(head + '\n'.join(body))
    print('wrote TIMING.md')


if __name__ == '__main__':
    main()
