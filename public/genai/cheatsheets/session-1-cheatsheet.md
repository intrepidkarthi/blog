# Session 1 Cheatsheet — How Machines Learned to Talk
*Generative AI: Foundations and Applications · TCE*

## The one idea
An LLM does exactly one thing: **given text, predict the next token.** Append it, repeat. Every essay, poem and program is generated one token at a time.

## Three truths most people get wrong

1. **It's not a database.** Nothing is stored or looked up — a model is a file of billions of learned numbers (**parameters**) that *compute* every reply fresh. That's why it can invent things.
2. **It's frozen while you use it.** **Training** (adjust the knobs on trillions of tokens, once, for months) vs **inference** (your prompt flows through the frozen knobs, every chat). It does NOT learn from your conversation — though free-tier chats may train *future* versions, so never paste private data.
3. **It has no memory.** The app re-sends your entire conversation into the context window on every turn. "Chat memory" is a product feature beside the model, not the model remembering.

## Where the words live
AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI ⊃ **LLMs** (GPT, Gemini, Claude, Llama). And: ChatGPT is the *app*; GPT is the *model* inside — like WhatsApp vs the phone network.

## Eight words you now own

| Term | Meaning | Remember it as |
|---|---|---|
| **Token** | The chunk a model actually reads (~¾ English word). You pay per token; context is measured in tokens. Tamil ≈ 3–5× more tokens than English today. | Lego bricks of language |
| **Embedding** | Token → list of numbers = coordinates in meaning-space. Similar meaning = nearby points. | GPS for meaning |
| **Attention** | Every word weighs every other word to resolve meaning ("it" → trophy or suitcase?). The engine of the Transformer — the T in GPT. | Words looking at each other |
| **Prediction** | The model scores every possible next token. That's the whole job. | Autocomplete with a PhD |
| **Sampling / Temperature** | It rolls dice over those scores. Low T = same answer every time (facts, code). High T = creative and risky (stories, names). | The creativity knob |
| **Tuning** | Pretraining (read everything) → instruction tuning (learn to answer) → RLHF (learn taste). | Parrot → finishing school |
| **Parameter** | One learned knob (the w and b in y = wx + b, times a trillion). A model = a file of them. | Knobs, not knowledge cards |
| **Inference** | Running the frozen model. No learning, no memory — just computation per request. | Cooking from a finished cookbook |

## Why famous failures happen
- "2 r's in strawberry" → it sees **tokens, not letters**
- Wrong big multiplication → it **predicts digits**, doesn't calculate (fix: tools, S5)
- Doesn't know yesterday's news → **knowledge cutoff** (fix: RAG, S4)
- Confident nonsense (**hallucination**) → trained for *plausible*, not *true* (fix: evaluation, S2)

## Context window
Everything — rules + history + documents + question + answer — must fit in one token-measured window (~128k–1M+). If your knowledge doesn't fit → Session 4 (RAG).

## The code that matters

```python
%pip install -U google-genai            # once
from google import genai

client = genai.Client(api_key=KEY)      # key from aistudio.google.com — keep secret
r = client.models.generate_content(
    model="gemini-flash-latest",        # the free tier's current Flash (July 2026 → Gemini 3.5 Flash)
    contents="Explain tokens like I'm 12")
print(r.text)
```

Temperature: `config=types.GenerateContentConfig(temperature=0.0)` · Count tokens: `client.models.count_tokens(model=..., contents=...)` · Pin a dated model id only if you need frozen behavior

## Free tier facts
~10 requests/min, a few hundred a day per key (limits vary — check AI Studio) · no credit card · 429 error = slow down, retry · never share/commit your key · don't paste private data.

## Landscape in one line
Closed APIs (GPT, Gemini, Claude) vs **open weights** you can download (Llama, DeepSeek, Qwen, Mistral) — we run one locally in Session 5. Names change monthly; **the mechanics on this page don't.**

**Reasoning models** (o-series, Gemini "thinking"): the third dial — **think longer, not train bigger**. Hidden scratchpad ≈ 10–50× tokens per answer; never for easy questions.

**Carry into Session 2:** your 10-question expert test set (written in Lab 1). **Overnight before Day 2:** put 2–3 real documents (notes/PDFs) on your laptop — Day 2 you build "chat with my notes" over them.

**Go deeper (press D on the deck):** logits → softmax and what temperature divides · cross-entropy loss and perplexity · positional encoding (RoPE) and attention's n² cost · scaling laws and Chinchilla · MoE, distillation, quantization · the KV cache, prefill vs decode, TTFT. Prose versions: Learning Guide **Part 8**.
