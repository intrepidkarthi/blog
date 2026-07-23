# Session 4 Cheatsheet — Giving AI Your Own Knowledge

## The problem → the pattern
The model can't know your notes — and invents instead of admitting it. Pasting everything fails 3 ways: **window** (doesn't fit), **meter** (re-pay per question), **middle** (buried content ignored). Answer: **RAG — retrieve the right 3 paragraphs, staple them to the question, answer from them with citations.**

## The whole engine (memorize the shape)

```python
# INGEST (once per document)
chunks = chunk_text(text, target=800, overlap=150)       # paragraph + overlap
vecs   = embed(chunks)                                    # gemini-embedding-2
vecs   = vecs / np.linalg.norm(vecs, axis=1, keepdims=True)

# QUERY (every question)
qv     = embed([question])[0]; qv /= np.linalg.norm(qv)
scores = vecs @ qv                                        # cosine similarity — that's it
top3   = [chunks[i] for i in np.argsort(scores)[::-1][:3]]
```

Below ~100k chunks, **a numpy array IS your vector database.** (FAISS / Chroma / pgvector = same idea, bigger scale.)

## The grounded template (three load-bearing lines)

```
Answer using ONLY the context below.          ← blocks internet-memories
Cite which chunk you used, like [1].          ← makes lies visible
If not in the context, reply exactly:
"I don't know based on the provided documents."   ← the escape hatch
CONTEXT: [1]... [2]... [3]...
QUESTION: ...
```

## Debug order when RAG is wrong
**Retrieval → chunks → prompt → model.** Did the right chunk arrive (print scores!)? Was it amputated/diluted (chunking)? Did grounding hold (strengthen ONLY, context before question, T=0)? Only then blame the model.

## Failure modes → fixes
Vocabulary gap → rephrase query, k=5 · answer split across chunks → overlap, retrieve neighbours · stale index → re-index on change, show doc dates · model ignores context → harden grounding, and EVAL it (S2).

## One-liners that get jobs
"**Fine-tuning teaches behaviour; RAG provides knowledge.**" · "Same embedding model for query and chunks." · "Chunking causes more failures than model choice." · "Retrieval hit-rate and answer faithfulness are separate metrics."

**Carry forward:** SAVE the notebook — S5 adds tools to it, S6 attacks + hardens it, then you demo it.
