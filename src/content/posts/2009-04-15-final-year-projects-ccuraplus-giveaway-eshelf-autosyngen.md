---
title: "Final-year projects: CCura+, Give Away, eShelf, AutoSynGen"
date: 2009-04-15
slug: final-year-projects-ccuraplus-giveaway-eshelf-autosyngen
excerpt: "Four BE projects from the final year at TCE. Encryption, peer-to-peer file sharing, semantic search, and a synonym-based question generator that uses WordNet's synset graph."
tags: [college, tce, final-year, cryptography, p2p, semantic-search, nlp, projects]
---

Almost done with the final year at [Thiagarajar College of Engineering](https://www.tce.edu). Four projects went into the drawer this year, and I want to put a marker on each one before I forget what they were actually trying to do.

## CCura+ — a three-stage encryption/decryption algorithm

The RSA security standard bases itself on the fact that, given the product of two large prime numbers, it is very hard to figure out which two primes were multiplied. Brute-forcing RSA at standard key sizes is estimated at two years of compute, give or take. That is the whole moat.

Generating large primes is itself computationally expensive — and the moat is built from exactly that asymmetry. Hence RSA.

If you analyze RSA closely, two ingredients do the work: number theory and *difficulty to computers*. Why don't we implement a similar algorithm — one that uses huge numbers, multiple uncertainties, and imposes huge computer calculations on any brute-force attempt — but is **faster and more flexible than RSA**? That is the goal CCura+ kept in mind.

Three transforms in sequence: a substitution stage, a mixing stage, and a public-key wrapper that ties the previous two together. Each stage independently makes brute force expensive; combined, they make it infeasible. The per-operation cost is lower than RSA at comparable key strength, mostly because the mixing stage uses operations a CPU is happy to run.

Honest take: we did not run formal cryptanalysis on it. This is a final-year project. The bar was *demonstrate understanding of asymmetric cryptography and propose something new.* We met that bar.

## Give Away — a peer-to-peer file-sharing algorithm

A node in a system of computers that have a common resource requirement can upload whatever part of the resource it has to other computers in the system, even if it has not got the entire resource itself. If every node follows this policy, network load distributes across all available connections instead of concentrating on the client-server path. The same idea applies to grid environments — imagine each node as a computer and the grid as a local network for clarity.

Give Away tested how much speedup is achievable with a set of "fairly simple sharing techniques" based on real-world occurrences. We measured each technique's marginal contribution.

The result we wrote up:

> Up to 66% (4 out of 6) of optimization features are redundant.

In other words, two of our six techniques carried almost all of the speedup. The rest were extra knobs that made the protocol look smarter without actually doing anything.

That is a real finding. It is also the kind of finding that only shows up when you bother to ablate every feature you added — which most projects do not, because removing features feels like undoing work. Most engineering wins are subtraction wins.

## eShelf — a semantic search engine

When you send a request to most search engines, you get back a list of documents that share keywords with your query. Useful, but limited. The query *"president of India"* and the query *"Indian head of state"* should return the same documents. They mostly don't.

eShelf is built on the premise that the right search engine returns documents based on what you *meant*, not what you typed.

The implementation borrows from Natural Language Processing and Information Retrieval. It uses:

- **Web Ontology Language (OWL)** for representing concepts and relations
- **Dictionary lookup** for synonym expansion of query terms
- A custom **ranking algorithm** that scores documents on semantic distance from the query, not just keyword overlap

The hardest part — and the part that took most of the semester — was the ranking. Naïve "did the document contain a synonym?" lookup matches too much. The interesting score is *how close in meaning the document is to the query*, weighted by where in the document the matching concepts appear (title > heading > body > footnote).

It returns more relevant results than naïve keyword search on queries with at least one polysemous word. On unambiguous queries, semantic resolution is overhead with no payoff — keyword search ties or wins. That asymmetry is itself a useful finding: don't pay the semantic-resolution tax when the query doesn't need it.

## AutoSynGen — automatic synonym generator

WordNet, Princeton's open lexical database, organizes English words into **synsets** — groups of synonyms — connected by semantic relations (hypernym, hyponym, meronym, antonym, etc.). Each word sits at some hop-distance from every other word along this graph.

AutoSynGen uses WordNet to dynamically generate multiple-choice synonym questions:

- Pick a random target word from a source file.
- Generate five answer choices — one correct synonym, four wrong.

If the four "wrong" choices are randomly selected from elsewhere in the dictionary, the question is too easy: anyone with a basic vocabulary will eliminate the obviously-unrelated words.

To make the question harder, we need a metric. We define **Minimal Path Length (MPL)** — the shortest distance between two words in the WordNet synonym graph.

Worked example:

```
"be" → synonym → "live"
"live" → synonym → "endure"
"endure" → synonym → "suffer"
```

So `be` and `suffer` have **MPL = 3**. (Assuming there's no shorter route via a common synonym — that's what *minimum* is for.)

Use the metric to constrain answer choices: for each question, ensure all four wrong answers are at MPL ≥ 4 from the target. Now wrong answers are *very* wrong and the question still tests vocabulary cleanly.

Better still: introduce a **distractor** — one wrong answer at MPL = 2 or 3. The question now has one right choice, three very-wrong choices, and one near-miss. The student has to actually distinguish meaning, not just recognize a word.

A real test of vocabulary depth, generated automatically, with no human labelling beyond plugging in the target wordlist. The MPL trick is what makes it work.

## the connecting thread

Reading these four back-to-back: a cryptography project, a P2P optimization project, a semantic search engine, and an NLP question generator. Four sub-fields, no obvious link.

The link, when I look at it, is the same move repeated four times: **pick an existing system, decompose it into primitives, ask which primitives are load-bearing, and propose a recombination.**

CCura+ does this to RSA. Give Away does this to BitTorrent-style swarming. eShelf does this to keyword search. AutoSynGen does this to WordNet's "just-pick-synonyms" pattern.

I'd like to think the move is the point. The implementations age. The instinct to ask *what's actually doing the work here?* probably won't.

Off to write up the documentation. Project demos next week.

---

Project pages live at [intrepidkarthi.com/projects](http://intrepidkarthi.com/projects). PDFs of each whitepaper are linked from the individual project pages.
