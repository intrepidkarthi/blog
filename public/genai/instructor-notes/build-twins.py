#!/usr/bin/env python3
"""Rebuild every .html twin from its .md — the .md is the source of truth.

    python3 instructor-notes/build-twins.py            # all known twins
    python3 instructor-notes/build-twins.py TIMING.md labs/session-4/lab-handout.md

For each Markdown file the existing twin's <head> (title, meta, CSS), crumbs,
kicker and footer are kept; the body is re-rendered with pandoc from the .md.
A twin that does not exist yet is cloned from a sibling shell (a prep pack for
instructor-notes/, the course-plan shell for the repo root).

Heading ids are normalised so the links other pages rely on stay stable:
"Part 8 · …" → id="part-8", "7.5 …" → id="s7-5". Links to X.md become X.html
when the twin exists. Requires pandoc.
"""
import glob
import html
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEFAULT = (
    ['course-plan.md', 'LEARNING-GUIDE.md', 'TEACH-THIS-YOURSELF.md', 'TIMING.md', 'ZERO-SETUP.md',
     'ASSESSMENT.md', 'COLLEGE-PROJECT-TRACKS.md', 'PLACEMENT-ROADMAP.md', 'LOCALIZATION.md']
    + [f'labs/session-{n}/lab-handout.md' for n in range(1, 7)]
    + [f'cheatsheets/session-{n}-cheatsheet.md' for n in range(1, 7)]
    + [f'instructor-notes/session-{n}-prep.md' for n in range(1, 7)]
    + ['instructor-notes/INSTRUCTOR-MASTERY-GUIDE.md']
)

SHELL_FOR_DIR = {
    '': 'course-plan.html',
    'instructor-notes': 'instructor-notes/session-1-prep.html',
    'cheatsheets': 'cheatsheets/session-1-cheatsheet.html',
    'labs': 'labs/session-1/lab-handout.html',
}


def pandoc(md_text):
    r = subprocess.run(['pandoc', '-f', 'gfm+smart', '-t', 'html5', '--wrap=none', '--no-highlight'],
                       input=md_text, capture_output=True, text=True, check=True)
    return r.stdout


def split_md(text):
    """Return (h1, lead_md, body_md)."""
    lines = text.split('\n')
    i = 0
    while i < len(lines) and not lines[i].strip():
        i += 1
    h1 = ''
    if i < len(lines) and lines[i].startswith('# '):
        h1 = lines[i][2:].strip()
        i += 1
    while i < len(lines) and not lines[i].strip():
        i += 1
    lead = ''
    if i < len(lines):
        ln = lines[i]
        nxt = lines[i + 1].strip() if i + 1 < len(lines) else ''
        if ln.startswith('### '):
            lead = ln[4:].strip(); i += 1
        elif (ln.startswith('**') or ln.startswith('*')) and not ln.startswith('* ') and nxt == '':
            lead = ln.strip(); i += 1
    body = '\n'.join(lines[i:]).strip('\n')
    body = re.sub(r'^\s*---\s*\n', '', body)  # a leading rule right under the lead is decorative
    return h1, lead, body


def inline(md):
    out = pandoc(md).strip()
    out = re.sub(r'^<p>(.*)</p>$', r'\1', out, flags=re.S)
    return out


def norm_ids(body):
    idmap = {}

    def fix(m):
        tag, old, text = m.group(1), m.group(2), m.group(3)
        plain = html.unescape(re.sub(r'<[^>]+>', '', text)).strip()
        new = old
        pm = re.match(r'Part\s+(\d+)\b', plain)
        sm = re.match(r'(\d+)\.(\d+)\b', plain)
        if pm:
            new = f'part-{pm.group(1)}'
        elif sm:
            new = f's{sm.group(1)}-{sm.group(2)}'
        if new != old:
            idmap[old] = new
        return f'<{tag} id="{new}">{text}</{tag}>'

    body = re.sub(r'<(h[1-6]) id="([^"]+)">(.*?)</\1>', fix, body, flags=re.S)
    for old, new in idmap.items():
        body = body.replace(f'href="#{old}"', f'href="#{new}"')
    return body


def relink(body, md_dir):
    def fix(m):
        href = m.group(1)
        if href.startswith(('http:', 'https:', 'mailto:', '#')):
            return m.group(0)
        path, _, frag = href.partition('#')
        if path.endswith('.md'):
            cand = os.path.normpath(os.path.join(md_dir, path[:-3] + '.html'))
            if os.path.exists(cand):
                return f'href="{path[:-3]}.html' + (f'#{frag}' if frag else '') + '"'
        return m.group(0)
    body = re.sub(r'href="([^"]+)"', fix, body)

    def codelink(m):
        name = m.group(1)
        for d in ('', 'instructor-notes', 'labs'):
            cand = os.path.join(ROOT, d, name[:-3] + '.html')
            if os.path.exists(cand):
                rel = os.path.relpath(cand, md_dir).replace(os.sep, '/')
                return f'<a href="{rel}"><code>{name[:-3]}</code></a>'
        return m.group(0)
    return re.sub(r'<code>([A-Za-z0-9_-]+\.md)</code>', codelink, body)


def build(md_rel):
    md_path = os.path.join(ROOT, md_rel)
    html_path = md_path[:-3] + '.html'
    md_dir = os.path.dirname(md_path)
    h1, lead, body_md = split_md(open(md_path, encoding='utf-8').read())
    new_twin = not os.path.exists(html_path) or '<div class="wrap">' not in open(html_path, encoding='utf-8').read()
    if new_twin:
        top = md_rel.split('/')[0] if '/' in md_rel else ''
        shell = os.path.join(ROOT, SHELL_FOR_DIR[top])
        old = open(shell, encoding='utf-8').read()
    else:
        old = open(html_path, encoding='utf-8').read()

    # head + crumbs
    m = re.search(r'^(.*?<div class="wrap">\s*\n)(\s*<nav class="crumbs">.*?</nav>\s*\n)?', old, re.S)
    head, crumbs = m.group(1), (m.group(2) or '')
    kick = re.search(r'\n(\s*<div class="kicker">.*?</div>\s*\n)', old)
    kicker = kick.group(1) if kick else ''
    foot = re.search(r'(\s*<footer class="foot".*)$', old, re.S)
    footer = foot.group(1) if foot else '\n</div>\n</body>\n</html>\n'
    if new_twin:
        t = html.escape(h1)
        head = re.sub(r'<title>.*?</title>', f'<title>{t} — Generative AI · Foundations &amp; Applications</title>', head, flags=re.S)
        head = re.sub(r'(<meta name="description" content=")[^"]*(")', r'\g<1>' + html.escape(inline_plain(lead) or h1) + r'\2', head)
        head = re.sub(r'(<meta property="og:title" content=")[^"]*(")', r'\g<1>' + t + r'\2', head)
        head = re.sub(r'(<meta property="og:description" content=")[^"]*(")', r'\g<1>' + html.escape(inline_plain(lead) or h1) + r'\2', head)
        label = 'Instructor guide' if top == 'instructor-notes' else 'Course guide'
        kicker = kicker.replace(re.sub(r'<[^>]+>', '', kicker).strip(), label) if kicker else ''

    body = pandoc(body_md)
    body = norm_ids(body)
    body = relink(body, md_dir)
    if not crumbs:
        up = '../' * md_rel.count('/')
        crumbs = f'  <nav class="crumbs"><a href="{up}index.html">← Course home</a></nav>\n'
    parts = [head, crumbs, kicker]
    if h1:
        parts.append(f'  <h1>{inline(h1)}</h1>\n')
    if lead:
        parts.append(f'  <p class="lead">{inline(lead)}</p>\n\n')
    parts.append(body)
    parts.append(footer)
    out = ''.join(parts)
    open(html_path, 'w', encoding='utf-8').write(out)
    print(('created ' if new_twin else 'rebuilt ') + os.path.relpath(html_path, ROOT))


def inline_plain(md):
    return html.unescape(re.sub(r'<[^>]+>', '', inline(md))).strip() if md else ''


if __name__ == '__main__':
    targets = sys.argv[1:] or DEFAULT
    for t in targets:
        build(t)
