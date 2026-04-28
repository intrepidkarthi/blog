---
title: "Automatic Synonym Generator — live"
date: 2009-09-15
slug: automatic-synonym-generator
excerpt: "AutoSynGen is now live at intrepidkarthi.com/autosyngen. Plug in a word, get back a multiple-choice question with one right synonym and four distractors picked using WordNet's synset graph. The MPL trick is doing the work."
tags: [autosyngen, nlp, wordnet, php, project, deployment]
---

The [AutoSynGen tool from earlier this year](/writing/final-year-projects-ccuraplus-giveaway-eshelf-autosyngen) is now live at:

```
http://intrepidkarthi.com/autosyngen/
```

Plug in a word. Get back a multiple-choice question with one correct synonym and four distractors. Repeat for any word that exists in the WordNet database.

## what's actually running

A small PHP frontend, a MySQL backend with a copy of the WordNet 3.0 synset tables, and the **Minimal Path Length (MPL)** heuristic from the original write-up. The header on every source file:

```
## index.php: Main page for Automatic Synonym Generator Tool
## Copyright (C) 2009 Madurai, Tamilnadu.
## Author: Karthikeyan NG (intrepidkarthi@gmail.com, www.intrepidkarthi.com)
## This program is free software; you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation; either version 2 of the License, or
## (at your option) any later version.
```

GPL 2 because the WordNet license requires the derivative tool to remain open. Source is on the deployment.

## the live SQL

The query that does the actual synset lookup, lifted straight from the live `index.php`:

```sql
SELECT DISTINCT(s2.synset_id)
FROM   synset s1, synset s2
WHERE  s1.synset_id = s2.synset_id
  AND  s1.word = '<input>'
  AND  s2.word != '<input>'
ORDER BY s2.synset_id;
```

Find the synsets the input word lives in, list every other word in those synsets, and you have the candidate synonym pool. From there, the MPL filter gives you the *not-quite-synonyms* that make good distractors — words at MPL ≥ 4 are very wrong, MPL = 2-3 is the sweet spot for a "nearly right" answer.

## try it

Type a word. *Be*. *Live*. *Suffer*. *Endure*. The example from the original spec works as advertised: the synonym chain is right there in the synset graph.

I'm keeping the tool up indefinitely. If you're a teacher building a vocab quiz, take the script — GPL 2, modify it, redeploy it. The whole point of WordNet being free is that this stuff should be free too.

— Karthikeyan
