#!/usr/bin/env python3
"""Assemble the printable instructor pack and print it to PDF.

    python3 instructor-notes/build-all-notes.py            # writes all-notes-source.html + instructor-notes-all-sessions.pdf

Order: Instructor Mastery Guide → for each session: prep pack then run sheet →
lab facilitation guide. Sources are the .md files (the html twins are rebuilt
by build-twins.py from the same .md). Printing uses headless Chromium if one is
found (CHROME env var, `chromium`, `google-chrome`, or the Playwright install);
otherwise only the HTML is written and you print it from a browser (File → Print → PDF).
"""
import glob
import os
import re
import shutil
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
import importlib.util as _ilu  # the twin builder does the md → html work
_spec = _ilu.spec_from_file_location('build_twins', os.path.join(HERE, 'build-twins.py'))
build_twins = _ilu.module_from_spec(_spec); _spec.loader.exec_module(build_twins)

SOURCES = ['INSTRUCTOR-MASTERY-GUIDE.md']
for n in range(1, 7):
    SOURCES += [f'session-{n}-prep.md', f'session-{n}-notes.md']
SOURCES += ['lab-facilitation-guide.md']

OUT_HTML = os.path.join(HERE, 'all-notes-source.html')
OUT_PDF = os.path.join(HERE, 'instructor-notes-all-sessions.pdf')


def render(md_rel):
    text = open(os.path.join(HERE, md_rel), encoding='utf-8').read()
    h1, lead, body = build_twins.split_md(text)
    out = ['<section class="doc">']
    if h1:
        out.append(f'<h1>{build_twins.inline(h1)}</h1>')
    if lead:
        out.append(f'<p class="lead">{build_twins.inline(lead)}</p>')
    html_body = build_twins.pandoc(body)
    # ids must be unique across the concatenated file
    slug = re.sub(r'[^a-z0-9]+', '-', md_rel[:-3].lower())
    html_body = re.sub(r'id="([^"]+)"', lambda m: f'id="{slug}--{m.group(1)}"', html_body)
    html_body = re.sub(r'href="#([^"]+)"', lambda m: f'href="#{slug}--{m.group(1)}"', html_body)
    out.append(html_body)
    out.append('</section>')
    return '\n'.join(out)


def main():
    shell = open(os.path.join(HERE, 'session-1-prep.html'), encoding='utf-8').read()
    head = shell.split('<body>')[0]
    head = re.sub(r'<title>.*?</title>', '<title>Instructor notes — all sessions — Generative AI · Foundations &amp; Applications</title>', head, flags=re.S)
    head = head.replace('</style>', '  .doc{page-break-before:always}.doc:first-child{page-break-before:auto}\n  .wrap{max-width:820px}\n  @media print{a{color:inherit;text-decoration:none}}\n</style>')
    toc = ['<nav class="toc"><h2>Contents</h2><ol>']
    parts = []
    for src in SOURCES:
        text = open(os.path.join(HERE, src), encoding='utf-8').read()
        h1, _, _ = build_twins.split_md(text)
        slug = re.sub(r'[^a-z0-9]+', '-', src[:-3].lower())
        toc.append(f'<li><a href="#{slug}">{build_twins.inline(h1)}</a></li>')
        parts.append(render(src).replace('<section class="doc">', f'<section class="doc" id="{slug}">', 1))
    toc.append('</ol></nav>')
    doc = (head + '<body>\n<div class="wrap">\n<h1>Instructor notes — all sessions</h1>\n'
           '<p class="lead">Generative AI: Foundations &amp; Applications · TCE Madurai · mastery guide, six prep packs, six run sheets, lab facilitation guide</p>\n'
           + '\n'.join(toc) + '\n' + '\n'.join(parts) + '\n</div>\n</body>\n</html>\n')
    open(OUT_HTML, 'w', encoding='utf-8').write(doc)
    print('wrote', os.path.relpath(OUT_HTML, ROOT))

    chrome = os.environ.get('CHROME') or shutil.which('chromium') or shutil.which('google-chrome') or shutil.which('chromium-browser')
    if not chrome:
        for c in glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome') + glob.glob('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'):
            chrome = c
            break
    if not chrome:
        print('no Chromium found — open all-notes-source.html and print to PDF manually')
        return
    subprocess.run([chrome, '--headless', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer',
                    f'--print-to-pdf={OUT_PDF}', 'file://' + OUT_HTML], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        from pypdf import PdfReader
        print('wrote', os.path.relpath(OUT_PDF, ROOT), '·', len(PdfReader(OUT_PDF).pages), 'pages')
    except Exception:
        print('wrote', os.path.relpath(OUT_PDF, ROOT))


if __name__ == '__main__':
    main()
