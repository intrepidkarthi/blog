#!/usr/bin/env python3
"""Every slide reference in a prep pack must resolve to a real slide in its deck,
and a single-slide heading must quote that slide's title.

This exists because the previous prep packs drifted out of sync with the decks:
Session 6 was off by one from slide 9 onward, so an instructor prepping slide 11
was reading the notes for slide 12. Run this after editing a deck or a prep pack.

    python3 instructor-notes/check-slide-refs.py      # from the repo root
"""
import io, re, json, glob, html, sys

def deck_slides(n):
    p = glob.glob('presentations/session-%d-*.html' % n)[0]
    s = io.open(p, encoding='utf-8').read()
    data = json.loads(re.search(r'var DATA = (\[[\s\S]*?\]);', s).group(1))
    return [html.unescape(e.get('title', '').replace('\\"', '"')) for e in data]

def words(t): return set(re.findall(r'[a-z]{4,}', t.lower()))
def norm(t):  return re.sub(r'[^a-z0-9 ]', '', t.lower()).strip()

problems = 0
for n in range(1, 7):
    T = deck_slides(n); N = len(T)
    path = 'instructor-notes/session-%d-prep.md' % n
    s = io.open(path, encoding='utf-8').read()
    probs, refs = [], 0
    for m in re.finditer(r'^#{3,4} Slides? (\d+)(?:\s*[–\-]\s*(\d+))? · (.+)$', s, re.M):
        a = int(m.group(1)); b = int(m.group(2)) if m.group(2) else a
        label = m.group(3); refs += 1
        if a < 1 or b > N:
            probs.append('"Slide %s" out of range (deck has %d slides)' % (m.group(1), N)); continue
        if a == b:   # a single-slide heading must quote the deck title
            lab, title = norm(label.split(' · ')[0]), norm(T[a-1])
            if not (title.startswith(lab[:28]) or lab.startswith(title[:28]) or (words(label) & words(T[a-1]))):
                probs.append('slide %d heading "%s" != deck title "%s"' % (a, label[:40], T[a-1][:44]))
    for m in re.finditer(r'\bslides? (\d+)(?:\s*[–\-]\s*(\d+))?', s, re.I):
        hi = int(m.group(2) or m.group(1))
        if hi > N: probs.append('reference to slide %d but deck has %d' % (hi, N))
    problems += len(probs)
    print('S%d  %2d slide headings, %2d slides in deck  %s'
          % (n, refs, N, 'OK' if not probs else '%d PROBLEM(S)' % len(probs)))
    for p in probs: print('      ', p)

print('\n%s' % ('all prep packs match their decks' if not problems
                else '%d problem(s) — fix before teaching' % problems))
sys.exit(1 if problems else 0)
