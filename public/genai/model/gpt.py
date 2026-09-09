"""Minimal character-level GPT (nanoGPT-style). Also used verbatim as the 'build your own' recipe on the page."""
import math, json, time, random
import torch, torch.nn as nn, torch.nn.functional as F

torch.set_num_threads(2)

class Config:
    def __init__(self, vocab_size, block_size=128, n_layer=3, n_head=4, n_embd=64, dropout=0.15):
        self.vocab_size, self.block_size, self.n_layer, self.n_head, self.n_embd, self.dropout = \
            vocab_size, block_size, n_layer, n_head, n_embd, dropout

class Attention(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.n_head, self.n_embd = c.n_head, c.n_embd
        self.qkv = nn.Linear(c.n_embd, 3 * c.n_embd)
        self.proj = nn.Linear(c.n_embd, c.n_embd)
        self.drop = nn.Dropout(c.dropout)
        self.register_buffer('mask', torch.tril(torch.ones(c.block_size, c.block_size)).view(1, 1, c.block_size, c.block_size))
    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv(x).split(C, dim=2)
        q = q.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        k = k.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        v = v.view(B, T, self.n_head, C // self.n_head).transpose(1, 2)
        att = (q @ k.transpose(-2, -1)) / math.sqrt(k.size(-1))
        att = att.masked_fill(self.mask[:, :, :T, :T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        y = (self.drop(att) @ v).transpose(1, 2).contiguous().view(B, T, C)
        return self.drop(self.proj(y))

class Block(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.ln1 = nn.LayerNorm(c.n_embd)
        self.attn = Attention(c)
        self.ln2 = nn.LayerNorm(c.n_embd)
        self.mlp = nn.Sequential(nn.Linear(c.n_embd, 4 * c.n_embd), nn.GELU(), nn.Linear(4 * c.n_embd, c.n_embd), nn.Dropout(c.dropout))
    def forward(self, x):
        x = x + self.attn(self.ln1(x))
        x = x + self.mlp(self.ln2(x))
        return x

class GPT(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.c = c
        self.tok_emb = nn.Embedding(c.vocab_size, c.n_embd)
        self.pos_emb = nn.Embedding(c.block_size, c.n_embd)
        self.drop = nn.Dropout(c.dropout)
        self.blocks = nn.ModuleList([Block(c) for _ in range(c.n_layer)])
        self.ln_f = nn.LayerNorm(c.n_embd)
        self.head = nn.Linear(c.n_embd, c.vocab_size, bias=False)
        self.apply(self._init)
    def _init(self, m):
        if isinstance(m, (nn.Linear, nn.Embedding)):
            nn.init.normal_(m.weight, mean=0.0, std=0.02)
            if isinstance(m, nn.Linear) and m.bias is not None: nn.init.zeros_(m.bias)
    def forward(self, idx, targets=None):
        B, T = idx.shape
        x = self.drop(self.tok_emb(idx) + self.pos_emb(torch.arange(T)))
        for b in self.blocks: x = b(x)
        logits = self.head(self.ln_f(x))
        loss = None if targets is None else F.cross_entropy(logits.view(-1, logits.size(-1)), targets.view(-1))
        return logits, loss
    @torch.no_grad()
    def generate(self, idx, max_new, temperature=1.0, top_k=None, stop=None):
        self.eval()
        for _ in range(max_new):
            logits, _ = self(idx[:, -self.c.block_size:])
            logits = logits[:, -1, :] / max(temperature, 1e-6)
            if top_k:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float('inf')
            nxt = torch.multinomial(F.softmax(logits, dim=-1), 1)
            idx = torch.cat([idx, nxt], dim=1)
            if stop is not None and stop(idx[0].tolist()): break
        return idx

def n_params(m): return sum(p.numel() for p in m.parameters())

# ---------------- data ----------------
class Data:
    def __init__(self, text, vocab, val_frac=0.1, seed=1, unit_sep='\n\n'):
        self.vocab = vocab
        self.stoi = {ch: i for i, ch in enumerate(vocab)}
        self.itos = {i: ch for ch, i in self.stoi.items()}
        units = [u for u in text.split(unit_sep) if u.strip()]
        rng = random.Random(seed); rng.shuffle(units)
        nv = max(1, int(len(units) * val_frac))
        self.val_units, self.train_units = units[:nv], units[nv:]
        self.train = torch.tensor(self.encode(unit_sep.join(self.train_units) + unit_sep), dtype=torch.long)
        self.val = torch.tensor(self.encode(unit_sep.join(self.val_units) + unit_sep), dtype=torch.long)
    def encode(self, s): return [self.stoi[c] for c in s]
    def decode(self, l): return ''.join(self.itos[i] for i in l)
    def batch(self, split, B, T):
        d = self.train if split == 'train' else self.val
        ix = torch.randint(len(d) - T, (B,))
        return torch.stack([d[i:i + T] for i in ix]), torch.stack([d[i + 1:i + 1 + T] for i in ix])

@torch.no_grad()
def eval_loss(model, data, B=32, iters=20):
    model.eval(); out = {}
    for split in ('train', 'val'):
        ls = []
        for _ in range(iters):
            x, y = data.batch(split, B, model.c.block_size)
            _, l = model(x, y); ls.append(l.item())
        out[split] = sum(ls) / len(ls)
    model.train(); return out

def sample_text(model, data, prompt, n=200, temperature=0.8, seed=0, top_k=None, stop=None):
    torch.manual_seed(seed)
    idx = torch.tensor([data.encode(prompt)], dtype=torch.long)
    out = model.generate(idx, n, temperature=temperature, top_k=top_k, stop=stop)
    return data.decode(out[0].tolist())

def train(model, data, steps, lr=1e-3, B=32, log_every=50, milestones=(), sample_prompt='\n', sample_seed=0, sample_n=200, min_lr_frac=0.1, tag=''):
    opt = torch.optim.AdamW(model.parameters(), lr=lr, betas=(0.9, 0.95), weight_decay=0.1)
    log, samples = [], {}
    t0 = time.time()
    for step in range(steps + 1):
        if step in milestones:
            samples[step] = sample_text(model, data, sample_prompt, n=sample_n, seed=sample_seed)
            model.train()
        if step % log_every == 0 or step == steps:
            e = eval_loss(model, data)
            log.append(dict(step=step, train=round(e['train'], 4), val=round(e['val'], 4)))
            print(f'{tag} step {step:5d} train {e["train"]:.3f} val {e["val"]:.3f}  {time.time()-t0:.0f}s', flush=True)
        if step == steps: break
        cur_lr = min_lr_frac * lr + 0.5 * (1 - min_lr_frac) * lr * (1 + math.cos(math.pi * step / steps))
        for g in opt.param_groups: g['lr'] = cur_lr
        x, y = data.batch('train', B, model.c.block_size)
        _, loss = model(x, y)
        opt.zero_grad(set_to_none=True); loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
    return log, samples

# ---------------- export (int8 per-tensor for the browser) ----------------
import base64, numpy as np
def export(model, vocab, path, extra=None):
    c = model.c
    tensors = {}
    for name, p in model.state_dict().items():
        if name.endswith('.mask'): continue
        w = p.detach().float().numpy()
        if w.ndim == 2 and w.size > 4096:  # big matrices -> int8
            scale = float(np.abs(w).max() / 127.0) or 1.0
            q = np.clip(np.round(w / scale), -127, 127).astype(np.int8)
            tensors[name] = dict(shape=list(w.shape), dtype='i8', scale=scale, data=base64.b64encode(q.tobytes()).decode())
        else:  # small vectors -> float16
            tensors[name] = dict(shape=list(w.shape), dtype='f16', data=base64.b64encode(w.astype(np.float16).tobytes()).decode())
    out = dict(config=dict(vocab_size=c.vocab_size, block_size=c.block_size, n_layer=c.n_layer, n_head=c.n_head, n_embd=c.n_embd),
               vocab=vocab, n_params=n_params(model), tensors=tensors)
    if extra: out.update(extra)
    json.dump(out, open(path, 'w'), ensure_ascii=False, separators=(',', ':'))
    return out

def load_exported(path):
    """Rebuild a torch model from the exported json (to verify the quantisation round-trip)."""
    j = json.load(open(path))
    cf = j['config']; c = Config(cf['vocab_size'], cf['block_size'], cf['n_layer'], cf['n_head'], cf['n_embd'], 0.0)
    m = GPT(c); sd = m.state_dict()
    for name, t in j['tensors'].items():
        raw = base64.b64decode(t['data'])
        if t['dtype'] == 'i8': w = np.frombuffer(raw, dtype=np.int8).astype(np.float32) * t['scale']
        else: w = np.frombuffer(raw, dtype=np.float16).astype(np.float32)
        sd[name] = torch.tensor(w.reshape(t['shape']))
    m.load_state_dict(sd); m.eval(); return m, j['vocab']
