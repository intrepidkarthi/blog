---
title: "NLTagger for sentiment + NER + POS — gotchas nobody warned me about"
date: 2026-01-25
slug: nltagger-gotchas-nobody-warned-me
excerpt: "Apple's NaturalLanguage framework looks clean in the WWDC slides. In production it has six specific gotchas that cost me hours each. Here is the list."
tags: [ios, swift, nltagger, naturallanguage, on-device, nlp]
---

`NLTagger` is the Apple framework for on-device natural language processing — sentiment analysis, named entity recognition, part-of-speech tagging, language identification, lemmatisation. It is the foundation of most on-device text understanding on iOS. It is also poorly documented for the production failure modes that matter.

The WWDC sessions show NLTagger working cleanly on toy examples. Real-world journaling text contains code-switching, punctuation chaos, emoji, English-Tamil-Hindi mixed sentences, voice-transcription artifacts, and edge cases that the framework's defaults do not handle well.

Here are the six gotchas that cost me hours each.

## 1. sentiment scores are weakly calibrated

The sentiment analysis returns a score from -1 (negative) to +1 (positive) for each sentence or paragraph. The scores look authoritative. They are not well-calibrated.

Two sentences that read as similarly negative to a human will often produce scores 0.4 apart. A neutral statement of fact ("I had lunch at 1 PM") sometimes scores -0.3 or +0.3 with no clear reason. The model is trained on broad corpora that include news headlines, product reviews, and social posts — journal-style first-person introspection is underrepresented in the training distribution.

The fix is not to use the raw score as a signal. The fix is to bucket scores into three or five bands (very negative / negative / neutral / positive / very positive) and treat the bucketed score as the input. Bucketing absorbs the noise. The bucket boundaries themselves should be calibrated against your own data, not the framework's defaults.

## 2. named entity recognition misses lowercase entities

`NLTagger` for `.nameType` recognises proper nouns in standard English well — capitalised names of people, places, organisations. It systematically misses lowercase mentions.

A user voice-recording "i met sarah and we went to bombay" produces a transcript without capitalisation. NLTagger's NER, applied to that transcript, misses both "sarah" and "bombay" because they are lowercase. The result is a journal where 30-50% of the named entities never get tagged.

The workaround is a pre-processing pass that capitalises the first letter of each sentence and applies title-case to candidate entity tokens (using a heuristic based on the rest of the sentence). The pass is imperfect but recovers most of the missed entities.

The better fix would be a custom NER model trained on lowercase journaling text. NLTagger supports custom models via CreateML. The training is significant work; for most journaling apps the heuristic pre-processing is enough.

## 3. mixed-language sentences degrade silently

A sentence like "today was great, but feeling slightly tired" is fine. A sentence like "today was great, but romba tired-a irundhen" (Tamil-English code-switching) silently degrades. NLTagger detects the dominant language as English, applies English-trained models to the whole sentence, and produces sentiment that ignores the Tamil portion.

For users who code-switch — which is most users in multilingual countries — this is a meaningful accuracy loss. The journal's emotional signal in the code-switched portion is missing.

The fix is per-sentence language detection (via `NLLanguageRecognizer`) followed by per-language tagging. NLTagger supports loading different language models. Switching the model on a per-sentence basis adds complexity but recovers the signal.

For Tamil-English, Hindi-English, and other major Indian code-switched pairs, this is essential. For purely-English users it does not matter.

## 4. emoji and punctuation chaos

User-generated text has emoji, ellipses, em-dashes, multiple exclamation marks, and other punctuation that the framework's tokeniser handles unevenly.

A sentence like "today was great!!! :)" gets tokenised differently depending on the framework version. The sentiment analysis sometimes treats the emoji as a separate token (good), sometimes folds it into the previous word (bad), sometimes drops it (worst).

The fix is a normalisation pre-pass before running NLTagger. Standardise the punctuation, convert emoji to text descriptions (`:)` → `[smiling]`), collapse repeated punctuation. The normalisation is opinionated — different choices produce different downstream behaviour — but the choice has to be made consciously.

## 5. very long sentences exceed the model's effective context

NLTagger does not have a documented maximum input size, but long sentences (>500 words) produce noticeably worse results than short ones. The sentiment for a 1,000-word stream-of-consciousness paragraph is often clearly wrong.

The fix is to split long paragraphs at natural boundaries (sentence breaks, paragraph breaks, "and then" / "but" markers) and tag each chunk separately. The chunked results are aggregated for the entry's overall signal.

For journal entries this matters. Long voice-recorded entries are common; the user holds the record button and talks for 5-10 minutes. The transcript is one long string. Without chunking, the sentiment signal degrades for these entries — which are exactly the entries most worth analysing.

## 6. POS tagging is slower than you expect

Part-of-speech tagging via NLTagger is documented as "fast." In practice, tagging a 200-word journal entry takes 30-80ms on iPhone 15. For a single entry this is fine. For batch processing the user's archive (1,000+ entries), the cumulative time is 30-80 seconds.

The fix is to run the batch processing in the background, with progress reporting, on an actor-isolated queue. The user does not need to see POS tagging happen synchronously. They see the results when they open the relevant view.

For most journaling apps, POS tagging is not used directly — it is an input to lemmatisation, which is an input to search. The user does not see POS tags. The processing can happen async with no perceived latency penalty.

## the meta-lesson

`NLTagger` is the right tool for on-device NLP on iOS. It is also a tool whose behaviour in production differs meaningfully from its behaviour in demos.

The framework gives you 80% of what you need out of the box. The remaining 20% — handling lowercase entities, mixed languages, emoji, long sentences, calibrated sentiment — requires the gotchas above. Without these workarounds, the on-device NLP quality is noticeably worse than what cloud-based alternatives provide.

With these workarounds, the on-device quality is comparable to cloud-based alternatives for journaling-style text. The 20% of work covers most of the journaling use case. The privacy benefit is preserved.

If you are building on NLTagger, build the workarounds in from the start. Retrofitting them after the rest of the app exists is harder than including them in the initial design. The gotchas above are the first six. There will be more. Build defensively.
