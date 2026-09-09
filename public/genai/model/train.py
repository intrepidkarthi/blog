"""train.py — pretrain, fine-tune, and a small reward loop. Needs gpt.py next to it.
Usage:  python train.py corpus.txt            (any UTF-8 text, blank line between examples)
The three stages below are exactly what produced the models on the page, minus logging/export plumbing."""
import sys, random, torch
from gpt import GPT, Config, Data, train, sample_text, export

text = open(sys.argv[1], encoding='utf-8').read()
examples = [e for e in text.split('\n\n') if e.strip()]

# ---- 1. PRETRAIN: predict the next character, 3000 steps ----
vocab = sorted(set(text) | {'#'})            # '#' is reserved for the fine-tuning prompt line
base_data = Data(text, vocab)                # 90 % of examples to train on, 10 % held out
model = GPT(Config(len(vocab), block_size=128, n_layer=3, n_head=4, n_embd=64, dropout=0.15))
train(model, base_data, steps=3000, lr=1e-3)
print(sample_text(model, base_data, '\n', n=300, temperature=0.8))
export(model, vocab, 'base.json')

# ---- 2. FINE-TUNE (SFT): "# label" -> example.  Here the label is the example's first word;
#         for Thirukkural it was the chapter title. Use whatever prompt you want to answer to. ----
def label(e): return e.split()[0]
sft_text = ''.join('# ' + label(e) + '\n' + e + '\n\n' for e in examples)
sft_data = Data(sft_text, vocab)
train(model, sft_data, steps=1500, lr=5e-4)  # continue from the pretrained weights
export(model, vocab, 'sft.json')

# ---- 3. PREFERENCES -> DPO (direct preference optimisation: RLHF without the RL machinery) ----
import torch.nn.functional as F, copy
def reward(out):                             # stand-in for a reward model / a human: is the output well-formed?
    body = out.split('\n\n')[0]; lines = body.split('\n')
    return len(lines) == 2 and len(lines[0].split()) == 4 and len(lines[1].split()) == 3 and body.endswith('.')

def stop(ids): return len(ids) > 1 and ids[-1] == ids[-2] == sft_data.stoi['\n']
def logp(m, prompt, resp):                   # log-probability the model gives to a whole response
    ids = sft_data.encode(prompt + resp); x = torch.tensor([ids[:-1]]); y = torch.tensor([ids[1:]])
    lp = F.log_softmax(m(x)[0][0], -1).gather(1, y[0][:, None]).squeeze(1)
    return lp[len(sft_data.encode(prompt)) - 1:].sum()

ref = copy.deepcopy(model).eval()            # the frozen reference: how far we let the policy drift is set by beta
opt = torch.optim.AdamW(model.parameters(), lr=2e-5); beta = 0.5
for rnd in range(4):
    pairs = []; model.eval()
    for i in range(300):                     # move 1: two attempts per prompt, the judge picks the better one
        p = '# ' + label(random.choice(examples)) + '\n'
        a, b = [sample_text(model, sft_data, p, n=90, temperature=1.0, seed=rnd * 1000 + 2 * i + k, stop=stop)[len(p):] for k in (0, 1)]
        if reward(a) != reward(b): pairs.append((p,) + ((a, b) if reward(a) else (b, a)))
    with torch.no_grad(): refs = [(logp(ref, p, w), logp(ref, p, l)) for p, w, l in pairs]
    model.train()
    for step in range(150):                  # move 3: push the winner up and the loser down, relative to the reference
        loss = 0
        for i in random.sample(range(len(pairs)), 8):
            p, w, l = pairs[i]; rw, rl = refs[i]
            loss = loss - F.logsigmoid(beta * ((logp(model, p, w) - rw) - (logp(model, p, l) - rl)))
        opt.zero_grad(); (loss / 8).backward(); opt.step()
    print('round', rnd + 1, 'pairs', len(pairs))
export(model, vocab, 'rl.json')
