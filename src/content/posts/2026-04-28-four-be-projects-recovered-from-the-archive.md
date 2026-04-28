---
title: "Four BE final-year projects, recovered from the archive"
date: 2026-04-28
slug: four-be-projects-recovered-from-the-archive
excerpt: "While digging through a 2011-era public_html dump from intrepidkarthi.com I found my old /projects page intact — descriptions of CCura+ (an RSA-style encryption algorithm), Give Away (peer-to-peer file sharing), eShelf (a semantic search engine), and AutoSynGen (an automatic synonym generator). Twenty-year-old me had ambitions. Here's what each one actually was, in plain English."
tags: [archive, college, projects, cryptography, semantic-search, p2p, nlp, recovered]
---

While [recovering posts lost in the WordPress migration](/writing/the-lost-archive-58-posts-that-didnt-survive), I went deeper into an old `public_html` dump from circa 2011 and found something better than the missing posts: my original `/projects` page, intact, with descriptions of four CS projects from the BE final year at [Thiagarajar College of Engineering](https://www.tce.edu).

Reading them back, I notice two things at once. One — the engineering instinct was already there: each project picks a real problem, identifies the existing approach, and proposes an improvement. Two — the writing is *eighteen-year-old me* writing, and it is, charitably, ambitious.

I am keeping the original ambition and rewriting the descriptions in plain English. This is an archive entry, not a re-pitch. The projects shipped, got reviewed, got grades, and went into the drawer. They deserve a record on the new site.

## 1. CCura+ — a three-stage encryption/decryption algorithm

**What it tried to do:** propose an asymmetric encryption scheme that was *faster and more flexible than RSA*, while preserving the property that brute-force attack is computationally hopeless.

**The framing.** RSA's security comes from the difficulty of factoring the product of two large primes. The cost of generating large primes — and the cost an attacker pays to undo that — is what makes RSA hard.

**The CCura+ argument.** RSA is hard because of two ingredients: number theory + computational difficulty. We don't need RSA specifically; we need *anything* that combines those two ingredients in a way that is faster to encrypt/decrypt than RSA but still infeasible to brute-force. CCura+ proposed a three-stage transform — substitution, mixing, and a public-key wrapper — designed to keep the brute-force cost exponential while reducing the per-operation arithmetic.

**Was it actually secure?** Honestly, I don't think we ever ran formal cryptanalysis on it. This was a final-year BE project; the bar was "demonstrate understanding of asymmetric cryptography and propose something new." We met that bar. I would not have put it on a smart contract.

**What it taught me.** The instinct to question why a standard works the way it does, instead of treating it as load-bearing magic, has been the single most useful instinct of my engineering career. CCura+ was the first time I let myself ask "why this and not something else?" about a primitive. I have been asking that question about everything since.

## 2. Give Away — a peer-to-peer file-sharing scheme

**What it tried to do:** measure how much network optimization is possible if every node in a system serves whatever fragments of a resource it already has, even before it has the full resource.

**The framing.** A client-server topology concentrates load on the server-to-client link. A peer-to-peer topology spreads it. The interesting question wasn't *whether* P2P is faster — BitTorrent had already proved that — but *which optimization techniques actually contribute to the speedup, and which are redundant once you have the others.*

**The experiment.** We tested a set of sharing policies on a heterogeneous local network and measured the marginal contribution of each. The result we wrote up: about **66% of the optimization features (4 out of 6) were redundant** once you had the right two — chunked partial-resource sharing and a fairness signal.

That's a real finding for a college project. Most of what BitTorrent's later academic literature says about over-engineered swarm mechanics is roughly that.

**What it taught me.** The most valuable optimization research is *subtraction* research — finding which 80% of the techniques you can drop without losing performance. Adding features is easy. Removing them is the work.

## 3. eShelf — a semantic search engine

**What it tried to do:** build a search engine that returned results based on what the user *meant*, not what they typed.

**The framing.** Keyword search returns documents that share tokens with the query. Semantic search returns documents that share *meaning*. In 2009 — the year before BERT existed and a decade before transformers ate NLP — this was the academic frontier, not the easy default.

**The stack.** Web Ontology Language (OWL) for knowledge representation, dictionary lookup for synonym expansion, a custom ranking algorithm that scored documents on semantic distance from the query, and basic Information Retrieval primitives wired up with what I now recognize as classical NLP — POS tagging, dependency parsing, hand-rolled stemming.

**Did it work?** On the corpora we tested, it returned more relevant results than naïve keyword search for queries with at least one polysemous word. On unambiguous queries it tied or lost — semantic resolution is overhead when there's nothing ambiguous to resolve.

**What it taught me.** The pre-transformer era of NLP was *all engineering*. Every step required hand-tuning a dictionary, a rule, or a weight. The lesson burned in: a model that learns these features end-to-end is going to win, eventually, for the same reason gradient descent always wins — it can iterate faster than you can hand-craft. Eight years later I [wrote a book on mobile ML](/lab) and the spine of that book was this lesson.

## 4. AutoSynGen — automatic synonym generator

**What it tried to do:** generate good multiple-choice questions automatically by picking a word, finding its synonyms, and using *near-but-not-quite* synonyms as distractor answers.

**The framing.** WordNet (the Princeton lexical database) organizes words into "synsets" — sets of synonyms — and lets you walk between synsets via semantic relations. Each word sits at some hop-distance from every other word.

**The trick.** A multiple-choice synonym question with random wrong answers is too easy. A question with *very wrong* distractors is also too easy. The interesting question has one right answer, three "very wrong" distractors, and one **near-miss** distractor — a word that's two or three synonym-hops away from the target. The student now has to distinguish meaning, not just recognize a word.

We defined a metric called **Minimal Path Length (MPL)** — the shortest hop-distance between two words via WordNet's synonym graph. Then we picked four wrong-answer candidates: one at MPL ≥ 4 (very wrong), one at MPL = 1-2 (the near-miss), and the rest at moderate distance.

The example I used in the original write-up:

```
"be" → synonym → "live"
"live" → synonym → "endure"
"endure" → synonym → "suffer"
```

So `be` and `suffer` have MPL = 3. Pick distractors with that intuition and you get a real test of vocabulary depth.

**What it taught me.** Question generation is harder than question answering, and *good* question generation is harder than question generation. The same insight has come back to me twenty times since — most recently while building [Dailyvox](/writing/why-i-built-dailyvox), where the on-device LLM has to ask reflective questions a journal writer hasn't already asked themselves. The hard part isn't generating *a* question. It's generating *the right one*.

## the connecting thread

Reading these four back-to-back, the through-line is clear in a way it wasn't to me at twenty.

**Cryptography → information retrieval → P2P → NLP.** Four different sub-fields. One repeated move: pick an existing system, decompose it into primitives, ask which primitives are load-bearing, propose a recombination.

That is still the move. The systems got bigger — exchange architectures, [healthcare ML on petabytes](/about), [trading infrastructure](/writing/feaws-whitepaper-explained), on-device LLMs — but the move is the same. The eighteen-year-old version of it didn't know it was a move yet. The forty-year-old version of it does.

The boring systems win. The same instincts compound.

---

Sources for this post: [internal/public_html/projects/](https://github.com/intrepidkarthi/blog/tree/main) — original 2011 project pages from the dump, descriptions retained, rewriting kept faithful to original intent. The original PDFs (CCura+, eShelf, AutoSynGen, Give Away whitepapers) are missing from the dump; if I find them I'll attach them here.
