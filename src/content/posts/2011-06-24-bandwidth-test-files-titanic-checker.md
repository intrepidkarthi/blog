---
title: "Bandwidth test files — and why mine are filled with Celine Dion"
date: 2011-06-24
slug: bandwidth-test-files-titanic-checker
excerpt: "I needed two files of known size — 100KB and exactly 1MB — to test mobile-data throughput on Android phones. Filling them with random bytes is boring. Filling them with the Titanic theme song, repeated until the byte count is right, is much more on-brand for what we are actually testing."
tags: [symantec, android, bandwidth, testing, mobile, hosting]
---

Routine bit of test infrastructure I'm putting up today, mostly so I can find it later when I need it.

I keep two files at:

```
http://intrepidkarthi.com/files/android/titanic.checker     ▸ 100 KB
http://intrepidkarthi.com/files/android/titanicmb.checker   ▸   1 MB
```

They are bandwidth-test files. You point an Android device's data connection at one of them, request it, and time how long the download takes. From that you back-calculate the effective throughput. Standard mobile-engineering plumbing. We use these all the time on the Norton Mobile team — when a customer says *"the Norton update was slow on 3G in Bangalore"*, the first question is *what was their actual line speed?*, and the cleanest way to answer it is two files of known size on a host the device can reach without authentication.

## why "titanic"

The naming is functional, not poetic. *Titanic* because the file is full of Celine Dion's *My Heart Will Go On* lyrics, repeated until the byte count is exactly the size I want. *titanicmb* for the megabyte version.

```
EverynightinmydreamsIseeyou,IfeelyouThatishowIknowyougoon.
FaracrossthedistanceandspacesbetweenusYouhavecometoshow
yougoon.Near,Far,whereveryouare,Ibelievethattheheartdoesgoon.
… [repeat until 102,400 bytes / 1,048,576 bytes] …
```

Spaces stripped. Punctuation kept. Repeated to fill. The 100KB file is exactly 102,400 bytes; the 1MB file is exactly 1,048,576 bytes. Open them in any text editor and stare at the void.

## why not random bytes

Two reasons:

1. **Compression.** Some HTTP middleboxes between you and the server (carrier proxies in particular) will gzip text on the fly. Random bytes do not compress; English text does. If you serve *random* test files, you measure the cleartext throughput. If you serve *English-text* test files, you measure the carrier's actual delivered throughput including any compression, which is often what the user feels. Both are useful, depending on what you are debugging.

2. **Verifiability.** A file full of random bytes can be silently corrupted by a buggy proxy and you will never notice. A file that is supposed to start with *Every night in my dreams I see you* and ends mid-lyric, you can eyeball the response and immediately tell whether the device received what the server sent. Diagnosability for free.

## reality.txt

I also dropped a third file in the same directory called `reality.txt`. It contains, in full:

> *Hey, Idiot. Nothing is real in this world!!!*

This is for anyone who finds the URL via random crawling and clicks `reality.txt` expecting an answer. It's also a placeholder I use to verify that the directory itself is reachable — `curl http://intrepidkarthi.com/files/android/reality.txt` is the smallest possible reachability check, and the response is short enough to grep for.

Engineering sense of humour. Boring tools. Use them.

— Karthikeyan
Norton Mobile · Symantec
