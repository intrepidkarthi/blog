# model/ — the code behind the Thirukkural language model

This folder is the recoverable source for every model embedded in `how-llms-work.html`
(and therefore in `presentations/how-a-language-model-works.html`, which reuses the page's data).

## What is here

| file | what it is | status |
|---|---|---|
| `gpt.py` | The model (character-level GPT: 3 blocks × 4 heads, d=64, ctx 128 → 164,160 parameters), the training loop, sampling, and the int8/float16 JSON export the page's JavaScript engine reads. | Verbatim copy of the code shown in chapter 12 of the page (it is also embedded in the page's `<script id="data">` under `code.gpt`). |
| `train.py` | The three stages that produced `kural_base` → `kural_sft` → `kural_rl`: pretrain 3,000 steps (lr 1e-3, cosine), SFT 1,500 steps on `# <chapter title>\n<kural>` (lr 5e-4), then DPO on pairs judged by the shape rule (β 0.5, lr 2e-5, keep step 50). `python train.py corpus.txt`. | Verbatim copy of the page's `code.train` — "exactly what produced the models on the page, minus logging/export plumbing". |
| `../labs/build-your-own-poet.ipynb` | The **most complete** surviving version: same model, plus the corpus download (`tk120404/thirukkural` JSON), the loss log and milestone samples the page's chapter-8 widget uses, the judge/DPO loop, export **and** a round-trip check (`load_exported`) that the quantised JSON reproduces the PyTorch model. | Runs on Colab CPU in ~10 min. |

Seeds and hyperparameters are in the code; the trained weights themselves live only inside the page
(`DATA.models.{kural_base, sonnet_base, kural_sft, kural_rl}`) and can be pulled back out with a few lines of Python:

```python
import re, json
s = open('how-llms-work.html', encoding='utf-8').read()
d = json.loads(re.search(r'<script id="data"[^>]*>(.*?)</script>', s, re.S).group(1))
json.dump(d['models']['kural_sft'], open('kural_sft.json', 'w'))   # loadable by the page's "Load the poet you built" box
```

## What is NOT here (lost with the build sandbox, 2026-09-03)

The one-off tooling that assembled the page was written in an ephemeral cloud sandbox and was not
copied into the repo at the time: `prep.py` (Thirukkural JSON → training text + the
`assets/kural-meanings.js` sidecar), `build.py` (page fragments → `how-llms-work.html`),
`build_deck.py` (page widgets → the 18-slide deck), `make_nb.py`, and the plumbing that computed
the extra per-model fields the widgets display (`loss`, `samples`, `pca`, `pca_var`, `train_tokens`,
`val_tokens`). None of it affects the models: retraining with `train.py` or the notebook reproduces
models of the same design and quality (not bit-identical — CPU training is not deterministic across
machines). The PCA map in chapter 4 is a 2-D projection of the embedding table; if a model is
retrained, recompute it with `sklearn.decomposition.PCA(2)` on `tok_emb.weight` and store the
46×2 coordinates as `pca` plus the two explained-variance ratios as `pca_var`.

## Should this be kept?

Yes — it is the only place the training recipe exists as plain files, it is what makes the page's
central claim ("every model on this page was trained with the code shown") auditable, and it is
tiny (~12 KB). If the page is ever rebuilt or the models retrained (for example the "more meaningful
kurals" idea: pretrain on more Tamil, d=128, 4–6 layers, fine-tune on meaning → kural pairs),
start from the notebook, and put the new build scripts in this folder rather than in a sandbox.
