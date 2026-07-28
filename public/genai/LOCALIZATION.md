# Teaching this somewhere else

### A swap-kit for instructors outside Madurai

This course was built for Thiagarajar College of Engineering and it shows — the examples are full of jigarthanda, Meenakshi Amman temple, rupees and Tamil. **That is deliberate, and you should not strip it out.** Specific beats generic every time: a room remembers "a pirate poem about jigarthanda" and forgets "a poem about a beverage." The examples work because they are somebody's, not because they are Madurai's.

So this file is not a de-localization guide. It is a **re-localization** guide: which references are load-bearing, which are decoration, and how to make them *yours* in about twenty minutes.

Everything here is free to use, fork, localize and teach — no permission needed, no attribution required (though it's nice).

---

## The 20-minute version

If you do nothing else, do these four. They cover the references students will actually notice.

| # | Find | Replace with | Where |
|---|---|---|---|
| 1 | `TCE` · `Thiagarajar College of Engineering` · `TCE Madurai` | your institution, long and short form | 84 hits — mostly deck footers, `<title>`, and og: meta |
| 2 | `Madurai` · `Meenakshi` · `jigarthanda` · `Vaigai` | your city, its landmark, its signature food/drink, a local landmark journey | 73 hits |
| 3 | `₹` and `₹95.5` per USD | your currency and the current rate | 37 hits — and see *Money* below, the arithmetic is already dual-currency |
| 4 | `Tamil` / `தமிழ்` | **keep it, and add your language** — see *Language* below, this one is technical, not decorative | 44 hits |

A blunt `sed` over the repo gets you 80% of the way:

```bash
# from the repo root — review the diff before committing, some hits are inside prose
grep -rl "Madurai" --include="*.html" --include="*.md" --include="*.ipynb" . \
  | xargs sed -i '' 's/Madurai/Coimbatore/g'          # macOS; drop the '' on Linux
```

Then read the diff. Roughly a dozen hits sit inside a sentence built around the word ("the Vaigai Express through a dead zone"), and those want rewriting, not substituting.

---

## What each category is actually doing

Not all 278 locale references are the same kind of thing. Three tiers:

### Tier 1 — Decoration. Swap freely, or keep.
`idli` · `dosa` · `biryani` · `filter coffee` · `Chennai` · `Coimbatore` · `Trichy` · `Bengaluru` · `A. R. Rahman` · `Roja` · `Thirukkural`

These are flavour: the words in the embedding map, the "who composed the music for X" eval question, the cities in the temperature demo's probability bars. Swap them for equivalents your room knows — but swap them for something equally **specific**. The embedding map only teaches if students already *feel* that two of the words are neighbours; "idli ↔ dosa" works in Madurai and does nothing in Nairobi. Pick two foods your students would agree belong together, and one that obviously doesn't.

The one constraint: in the S1 embedding map, keep the *structure* — two near-synonyms, one far-away technical term. In the S2 eval example, keep a question with **one unambiguous factual answer** that a model might phrase five different ways; that's the whole point of the scorer demo.

### Tier 2 — Institutional. You must swap these.
`TCE` · `Thiagarajar College of Engineering` · `Anna University` · `condonation` · `internal exam` · `end-semester` · `aggregate to pass` · `attendance shortage`

The academic vocabulary is concentrated in **Session 4** (17 hits), and for a good reason: the whole RAG session is built on "your college's syllabus, which the model has never read." That premise is what makes the session land, so it needs to be *your* institution's rules, with your terminology. A student in a system with no internal/external split will find "internal exam is 25 marks" meaningless, and the RAG failure examples ("the user asks 'attendance shortage rules', the notes say 'condonation policy'") depend on the vocabulary gap being real to them.

Rewrite these with two words from your own regulations that mean the same thing but share no letters. That mismatch *is* the lesson.

### Tier 3 — Load-bearing. Keep the structure, change the content.
`Tamil` · `₹` · `GST`

These aren't decoration. They carry a technical claim, and swapping them carelessly breaks the teaching. Details below.

---

## Language — the one to keep

The tokenizer demo (S1, "Models don't read words") is not a cute nod to Tamil. It is the course's argument that **tokenizers are trained on English-heavy text, so most of the world pays more** — on price, on latency, and on how much of their own language fits in a context window.

The slide already ships four scripts: English, Tamil, Hindi, Arabic. **Add yours as a fifth button** rather than replacing one — the point gets stronger with more evidence, not less:

```html
<button class="btn" data-tk="your sentence, same meaning as the English one">Language</button>
```

Two rules: use the **same sentence** in every language (otherwise you're comparing lengths, not tokenizers), and keep at least one non-Latin script so the gap is visible. If your teaching language uses Latin script, the demo still works — Swahili, Vietnamese and Turkish all tokenize worse than English despite the shared alphabet — but the effect is smaller, so keep one of the shipped non-Latin buttons for contrast.

The illustrative tokenizer in the deck understates the real gap. The S1 lab measures the true ratio against Gemini's actual tokenizer; that cell is worth running live if your language is the point you want to make.

## Money

All the cost arithmetic is already **dual-currency** — USD is computed first and the rupee is derived. To re-base:

| File | Constant | Meaning |
|---|---|---|
| `presentations/session-1-*.html` | `inr = usd*95.5` | tokenizer cost meter |
| `presentations/session-4-*.html` | `INR_PER_USD = 95.5` | "price the paste" slider |
| `presentations/session-6-*.html` | `INR_PER_USD` near `PRICE_IN` | cost-per-month calculator |

Change the one constant in each and every derived figure follows. If your currency is close to USD, you may prefer to delete the second figure entirely — search for the `var(--faint)` span that wraps it.

`PRICE_IN` / `PRICE_OUT` (1.50 / 9.00 per 1M tokens) are Gemini 3.5 Flash as of July 2026. **Check these before you teach** — they move, and the S6 depth panel makes an argument about the ~6× input/output ratio that only works while the ratio holds.

`GST` at 18% appears in a few tool-use examples (S3, S5). Any sales tax works; the arithmetic is the point, not the rate.

## Names, faces and the bio

The instructor slide (S1, slide 2) is Karthikeyan's — replace it wholesale with your own, and keep it short. The line that makes it work is the self-deprecating one, not the credentials.

`assets/img/` holds photographs of the original instructor. Delete them and drop in your own, or delete the bio slide's image references entirely; nothing else depends on them.

Also swap: the footer line in every deck (`Session N · TCE Madurai`), each deck's `<title>` and `og:` meta, and the placeholder link `tinyurl.com/tce-genai` in the S1 lab-kit slide — that one is a **required** change, it points at materials you'll need to host yourself.

## Jurisdiction

S6 slide 15 ("Your users decide whose law you're under") covers the EU, US, India and the UAE/Gulf. If you teach somewhere else, add your jurisdiction as a fifth card or replace the one least relevant to your students — the slide's argument is that regulation follows *your users*, so it survives any set of four examples. Brazil's LGPD, Nigeria's NDPA, Singapore's Model AI Governance Framework and China's generative-AI measures all slot in cleanly.

Keep the closing line whatever you swap: compliance is mostly engineering they already did.

---

## What not to change

- **The technical spine.** Sessions in this order, for reasons: prediction → measurement → multimodal → retrieval → tools → production. Every session's lab consumes the previous session's artifact.
- **The raw-before-frameworks decision.** RAG as a numpy array, tools as plain Python functions. Swapping in LangChain saves 20 lines of lab time and costs students the understanding the whole course is for.
- **The failure content.** Hallucination, injection, cost and the compounding-reliability maths are first-class sessions, not footnotes. They are the reason the course claims to teach engineering rather than prompting.
- **The escape hatch.** `"I don't know based on the provided documents."` Every grounded prompt in the course has it, and several later demos depend on it being there.
- **The depth layer.** The `<|deeper|>` panels (press **D**) are collapsed by default and cost you nothing in the room. Leave them in even if you never open one; students revisit the decks afterwards.

## After you localize — the 5-minute check

```bash
# 1. slide/DATA parity must hold in every deck (this is the invariant that breaks silently)
python3 - <<'PY'
import re,json,glob
for f in sorted(glob.glob('presentations/*.html')):
    h=open(f).read(); n=len(re.findall(r'<section class="slide',h))
    i=h.find('var DATA = ['); seg=h[i+len('var DATA = '):]; d=0
    for j,c in enumerate(seg):
        if c=='[': d+=1
        elif c==']':
            d-=1
            if d==0: seg=seg[:j+1]; break
    a=json.loads(seg)
    print(('OK  ' if n==len(a) else 'FAIL'), f, n, len(a))
PY

# 2. no leftovers
grep -ril "madurai\|thiagarajar\|\bTCE\b" --include="*.html" --include="*.md" --include="*.ipynb" .
```

Then open each deck, press **O** for the overview grid, and skim all six. Anything that reads oddly in a thumbnail will read oddly on a projector.

---

*Built for TCE Madurai, meant to travel. If you teach it somewhere, that was the point.*
