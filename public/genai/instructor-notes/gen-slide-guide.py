#!/usr/bin/env python3
"""Generate the slide-by-slide instructor cheat sheets from the decks themselves.

One card per slide, built from the deck's own DOM and its presenter `var DATA`
array, so a card can never drift from what is on screen. Re-run after any deck
edit, then run check-slide-refs.py.

    python3 instructor-notes/gen-slide-guide.py

Writes instructor-notes/session-N-slide-guide.md for N in 1..6.
"""
import glob
import html
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'instructor-notes')

SESSION_SUB = {
    1: 'Day 1 opens here. Everything later in the course stands on the loop taught in this session.',
    2: 'The session that turns opinions into numbers. Depends on the test set students wrote at the end of lab 1.',
    3: 'The lightest session to deliver and the most fun to watch. Uploads are the time sink.',
    4: 'The most employable session. Depends on students having brought their own documents.',
    5: 'The session where the room wants to build agents and the job is to teach them when not to.',
    6: 'Attack, then defend, then ship. Ends the course, so protect the capstone demos.',
}


def unescape_plain(frag):
    """HTML fragment -> plain text."""
    frag = re.sub(r'<[^>]+>', '', frag)
    return re.sub(r'\s+', ' ', html.unescape(frag)).strip()


def to_markdown(frag):
    """HTML fragment -> markdown, keeping the emphasis the author wrote."""
    frag = re.sub(r'<br\s*/?>', ' ', frag)
    frag = re.sub(r'</?(b|strong)>', '**', frag)
    frag = re.sub(r'</?(i|em)>', '*', frag)
    frag = re.sub(r'</?code>', '`', frag)
    frag = re.sub(r'<[^>]+>', '', frag)
    frag = html.unescape(frag)
    frag = re.sub(r'\s+', ' ', frag).strip()
    # ** ** with nothing between them reads as a typo in the output
    return re.sub(r'\*\*\s*\*\*', ' ', frag)


def strip_deep_block(sec):
    """Remove the <div class="deep"> panel, returning (slide_html, deep_label)."""
    m = re.search(r'<div class="deep[^"]*">', sec)
    if not m:
        return sec, None
    start = m.start()
    i, depth = m.end(), 1
    for tok in re.finditer(r'<div\b|</div>', sec[m.end():]):
        depth += 1 if tok.group(0) == '<div' else -1
        if depth == 0:
            i = m.end() + tok.end()
            break
    block = sec[start:i]
    label = re.search(r'<span class="lbl">(.*?)</span>', block, re.S)
    return sec[:start] + sec[i:], unescape_plain(label.group(1)) if label else None


LAND_RE = re.compile(r'(?:^|(?<=[.!?]\s))((?:Land|LAND)\b[^.!?]*[.!?])')


def split_land(note_md):
    """Pull the author's own 'Land it:' sentence out of the presenter note."""
    m = LAND_RE.search(note_md)
    if not m:
        return None, note_md
    land = m.group(1).strip()
    rest = (note_md[:m.start(1)] + ' ' + note_md[m.end(1):]).strip()
    rest = re.sub(r'\s+', ' ', rest).strip(' .') or None
    if rest:
        rest = rest[0].upper() + rest[1:]
        if rest[-1] not in '.!?':
            rest += '.'
    # strip a leading label like "Land it:" / "Land the punch:" for readability
    land = re.sub(r'^(Land it|Land the punch|Land)\s*[:—-]\s*', '', land)
    return land[0].upper() + land[1:], rest


def clock(mins):
    total = int(round(mins))
    return '%d:%02d' % (total // 60, total % 60)


def parse_deck(path):
    src = io.open(path, encoding='utf-8').read()
    data = json.loads(re.search(r'var DATA = (\[.*?\]);', src, re.S).group(1))
    secs = re.findall(r'(<section class="slide.*?</section>)', src, re.S)
    if len(secs) != len(data):
        sys.exit('%s: %d slides but %d DATA entries' % (path, len(secs), len(data)))

    deck_title = unescape_plain(re.search(r'<title>(.*?)</title>', src, re.S).group(1))
    deck_title = deck_title.split('—')[0].split('|')[0].strip()

    slides, at = [], 0.0
    for i, (sec, d) in enumerate(zip(secs, data), start=1):
        body, deep = strip_deep_block(sec)
        badge = re.search(r'<span class="no">(\d+)</span>', body)
        tk = re.search(r'<span class="tk">(.*?)</span>', body, re.S)
        h2 = re.search(r'<h2[^>]*>(.*?)</h2>', body, re.S)
        title = unescape_plain(h2.group(1)) if h2 else d['title']
        dtitles = [unescape_plain(x) for x in re.findall(r'<div class="dtitle"[^>]*>(.*?)</div>', body, re.S)]
        buttons = []
        for b in re.findall(r'<button\b(?![^>]*deeptog)[^>]*>(.*?)</button>', body, re.S):
            label = unescape_plain(b)
            if label and label not in buttons:
                buttons.append(label)
        land, run = split_land(to_markdown(d['n']))
        slides.append(dict(
            pos=i, badge=badge.group(1) if badge else None,
            tk=unescape_plain(tk.group(1)) if tk else None,
            title=title, data_title=d['title'], mins=d['m'], at=clock(at),
            trim=bool(d.get('c')), deep=deep, dtitles=dtitles, buttons=buttons,
            land=land, run=run, take='slide take' in sec[:60],
        ))
        at += d['m']
    return deck_title, slides, at


def render(n, deck_file, deck_title, slides, total):
    rel = os.path.basename(deck_file)
    L = []
    L.append('# Session %d — Slide-by-Slide Cheat Sheet' % n)
    L.append('')
    L.append('### %s · %d slides · %s total' % (deck_title, len(slides), clock(total)))
    L.append('')
    L.append('%s' % SESSION_SUB[n])
    L.append('')
    L.append('One card per slide, generated from `presentations/%s` itself, so nothing here can '
             'drift from what is on screen. **#** is the deck position — it matches the `%d / %d` '
             'counter in the footer and the `#%d` deep link. **Badge** is the number printed in the '
             'slide’s top-left corner; the two differ because title and lab slides are not badged. '
             'Press **S** in the deck for the same notes with a live timer.'
             % (rel, len(slides), len(slides), len(slides)))
    L.append('')
    L.append('**`trim`** marks a slide the deck itself flags **compressible** — press S and you will '
             'see `▸ compressible` on it. These are the first things to shorten when you are behind, '
             'not beats you must land. **`D`** marks a slide carrying a `<|deeper|>` panel: press **D** '
             'to open it, and only open it if the room asks.')
    L.append('')
    L.append('---')
    L.append('')
    L.append('## At a glance')
    L.append('')
    L.append('| At | # | Badge | Slide | Budget | |')
    L.append('|---|---|---|---|---|---|')
    for s in slides:
        flags = ' '.join(filter(None, ['`trim`' if s['trim'] else '', '`D`' if s['deep'] else '']))
        L.append('| %s | %d | %s | %s | %s min | %s |' % (
            s['at'], s['pos'], s['badge'] or '—', s['title'].replace('|', '\\|'),
            ('%g' % s['mins']), flags))
    L.append('| %s | | | *end* | | |' % clock(total))
    L.append('')
    L.append('---')
    L.append('')
    L.append('## The cards')
    L.append('')

    for s in slides:
        meta = ['`#%d`' % s['pos']]
        if s['badge']:
            meta.append('badge **%s**' % s['badge'])
        if s['tk']:
            meta.append('`<|%s|>`' % s['tk'])
        meta.append('**%g min**' % s['mins'])
        meta.append('at **%s**' % s['at'])
        if s['trim']:
            meta.append('`trim`')
        if s['deep']:
            meta.append('`D`')
        L.append('### %d · %s' % (s['pos'], s['title']))
        L.append('')
        L.append(' · '.join(meta))
        L.append('')
        screen = []
        for t in s['dtitles']:
            screen.append('*%s*' % t)
        if s['buttons']:
            screen.append('buttons: ' + ' · '.join('**%s**' % b for b in s['buttons']))
        if s['take']:
            screen.insert(0, 'full-bleed hot take')
        if screen:
            L.append('- **On screen** — ' + '; '.join(screen))
        if s['land']:
            L.append('- **Land it** — %s' % s['land'])
        if s['run']:
            L.append('- **Run it** — %s' % s['run'])
        if s['deep']:
            L.append('- **Depth `D`** — %s' % s['deep'])
        if s['trim']:
            L.append('- **Behind?** — the deck flags this one compressible. Shorten or drop it before '
                     'you rush anything else.')
        L.append('')

    L.append('---')
    L.append('')
    L.append('*Generated from the deck by `instructor-notes/gen-slide-guide.py`. Do not hand-edit: '
             're-run it after any deck change, then run `instructor-notes/check-slide-refs.py`.*')
    return '\n'.join(L) + '\n'


def main():
    for n in range(1, 7):
        deck = sorted(glob.glob(os.path.join(ROOT, 'presentations', 'session-%d-*.html' % n)))[0]
        title, slides, total = parse_deck(deck)
        md = render(n, deck, title, slides, total)
        out = os.path.join(OUT, 'session-%d-slide-guide.md' % n)
        io.open(out, 'w', encoding='utf-8').write(md)
        print('S%d  %2d cards  %s  trim:%d  D:%d  land:%d  -> %s' % (
            n, len(slides), clock(total),
            sum(1 for s in slides if s['trim']),
            sum(1 for s in slides if s['deep']),
            sum(1 for s in slides if s['land']),
            os.path.basename(out)))


if __name__ == '__main__':
    main()
