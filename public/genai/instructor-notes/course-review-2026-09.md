# Course review — are the six sessions worth it, and built usefully for students?

*Reviewed 2026-09-03 against the actual files: six decks (slide text), six lab handouts, six Colab notebooks, TIMING.md, ZERO-SETUP.md, and the new `how-llms-work.html`.*

## Verdict

Yes — with three fixes that matter and a handful that are cheap. The course is unusually honest for its genre: every session pairs an idea with a measurement, the failure cases are taught as first-class content, and the capstone rewards a documented failure over a polished demo. A student who does all six labs leaves with a real artifact (RAG + tools + an eval set + a hardening story) and, more valuably, the habit of asking "how do I know it's right?" That habit is the thing employers and review committees actually test for, and almost no undergraduate GenAI course teaches it.

The weaknesses are not in the ideas. They are in load-bearing plumbing that will fail on the day, and in one session that is now too dense for the time it has.

## The three fixes that matter

**1. The capstone can silently disappear at lunch.** Lab 4 writes `chunk_vecs.npy` and `chunks.json` to the Colab runtime and tells students to re-load them in Sessions 5 and 6. Colab runtime disk is wiped when the runtime disconnects — which it does after idle time, and often across a lunch break. Session 5's stretch ("paste your search() + chunk_vecs from Lab 4") and Session 6's red-team both assume the artifact survives. When it doesn't, the afternoon's continuity story collapses into re-embedding under a rate limit. Fix: mount Google Drive in Lab 4 Cell 1 and save both files there (three lines), or have Cell 4 trigger a download; and make Lab 5/6 reload from Drive explicitly. This is the single most likely cause of a bad afternoon.

**2. There is no instructor sample document.** Lab 4's handout says "Forgot your documents? Use the instructor's sample document" and Cell 2 says "switch to the instructor sample" — but no such file exists in `labs/session-4/`. A student with a scanned PDF (very common: photographed notes, department-issued scans) will hit the `< 200 characters` guard and have nothing to fall back to. Ship one: a 4–6 page plain-text file of plausible OS notes plus a page of college regulations (attendance, pass marks), which also makes the deck's Session 4 demo queries ("marks needed to pass", "attendance condonation") actually retrievable in the lab. Add a second sample for Lab 3 (a receipt image is linked from Wikimedia — good — but a handwriting sample is not).

**3. Session 1 is over budget, and now duplicates the page.** TIMING.md shows Session 1 releasing to lab at ~59 minutes against a 48-minute talk — eleven minutes taken from the one lab that gets students their API key working. Slides 14–17 (tokenizer, embeddings, attention, assemble-the-machine) are now covered, more slowly and with a real model, by `how-llms-work.html`, which the course home tells students to read first. Cut those four to one two-minute "you saw this on the page — here it is in one loop" slide, and Session 1 lands on time with the deep material still available on the page and behind the D key. Sessions 2–6 are within budget and should not be touched.

## What is strong (keep exactly as is)

The through-line — predict, measure, see, know, act, ship — is real, and every session pays back an earlier one: Session 2's harness grades Session 3's vision, Session 4's RAG, Session 5's tool choices and the capstone. That is the design decision that makes the course an engineering course rather than a tour.

Session 2 is the best single session. "A prompt without an eval is a superstition", the calibration-gap game, the ±1/√n slide, "read the failures, not the score", and a lab that forces students to diagnose every ✗ as model-wrong / scorer-too-strict / question-ambiguous. Students will still be using that loop in five years.

Session 5's honesty about agents (p^n, "a while-loop in a trench coat", workflow-vs-agent by one question) and Session 6's honesty about security ("no complete fix, only layers"; the expected result that direct attacks bounce but the indirect one lands) are exactly right for 2026 and rarer than they should be. Lab 6's framing — "most direct attacks will bounce; that is the finding, not a broken exercise" — pre-empts the one moment where a class would conclude the exercise is broken.

The local flavour is not decoration. Tanglish reviews, the TCE mess bill, jigarthanda, the Vaigai Express dead zone, the voice-clone "family password" — these make abstractions concrete for this room and are the reason the material is memorable. LOCALIZATION.md correctly marks which of them are load-bearing.

The notebooks are competent and defensively written: retry-on-429, `.text or ""` for blocked responses, image downscaling, a safe-eval calculator built on `ast` rather than `eval`, an explicit `MAX_CHUNKS` sampled across the document rather than the first pages, honest caps on what n=10 proves. Stretch goals are graded in difficulty and each one is the seed of a final-year project.

## Cheap fixes, in order of payoff

- **Model IDs and prices are a week-before check, not a course-time check.** Everything hangs on `gemini-flash-lite-latest`, `gemini-flash-latest` and `gemini-embedding-2`, plus the July-2026 price table on S4/S6. All are aliases or dated; the fact-check file exists but should be re-run the week before each delivery. Put a one-line "verify" cell at the top of Lab 1 that lists the models the key can see, so the first failure of the day is a loud one.
- **Rate limits will bite in Lab 2.** Ten questions × A and B × three runs is 60 calls at ~10/min; the retry handles it but students will sit through 20-second waits. The handout already says "iterate on `my_tests[:5]`" — move that instruction into the code as the default, with the full run as the confirmation step.
- **Lab 3 needs the photo on the laptop.** The handout covers transfer options, but ten minutes of "email yourself a photo" is a real cost in a 50-minute lab. Tell students in Session 1's lab-kit slide to put two photos in Drive *now*, not at the Session 3 break.
- **Session 3 is the thinnest session.** It is good, but its deliverable (vision extraction + one failure) is smaller than the others', and image generation is only a canvas fake. That is fine for a 12-hour bootcamp; if a session ever has to be cut for a shorter delivery, this is the one, and TEACH-THIS-YOURSELF should say so.
- **The capstone rubric weights honesty (25 + 15) more than the working demo (40) only if the instructor holds the line.** The rubric is right; add two sentences to the Session 6 prep pack on how to score a pair whose app doesn't run but whose failure analysis is excellent, because that pair will exist.
- **Pairs rule needs a tie-break.** "Both partners run every cell" halves the API budget per key and doubles rate-limit waits. Say explicitly: both partners have keys, one drives per part, swap at each checkpoint.
- **A pre-class link.** The course home now sends students to `how-llms-work.html` and the S1 lab-kit slide still carries the `tinyurl.com/tce-genai` placeholder. Replace it before the next delivery; students who arrive having done the page and the "build your own poet" notebook will be a visibly different room.

## Per-session notes

**S1 · How machines learned to talk.** Rich, correct, and now too long (see fix 3). The non-ML-background cluster (rings, not-a-database proof, two-knob line fit, cookbook T/F) is exactly right for a room that has never seen a loss function. The "famous failures — you explain them" slide is the best minute of the session because it turns four concepts into predictions. Lab 1 is well designed: the key is the real hurdle, and Part E (write your own test set) is the smartest hand-off in the course.

**S2 · Talking to AI, and catching its lies.** Keep. Only addition: the five-iteration makeover in fifteen minutes is tight; say "three iterations documented well beats five documented badly".

**S3 · AI beyond text.** Sound. The response_schema section is the right production lesson and Lab 3's "the test is `json.loads()` succeeding" is a better checkpoint than "it looks right". Ship a handwriting sample; consider dropping the audio stretch (file upload + quota) unless you have tested it that week.

**S4 · Giving AI your knowledge.** The core of the course and the best lab: ~60 lines, all visible, no framework, with the two-scores-never-one diagnostic and the reranker as stretches. Fixes 1 and 2 above are both here. One more: Cell 5's three sanity queries are placeholders; pre-fill them with queries that work on the sample document so the checkpoint is reachable even by a pair whose own document is poor.

**S5 · Making AI do things.** Excellent framing; the escalation ladder and the scenario cards make it a design-thinking session rather than a tooling session. The Ollama demo is instructor-only and has a labelled simulation fallback — good. Lab 5 Part C (print the raw function call) is the moment the "model never executes" idea becomes physical; keep it mandatory, not a stretch.

**S6 · Breaking, securing, shipping.** The right finale. The cross-border law slide is more than students need but harmless. The red-team swap is the best 10 minutes of the weekend if the capstones exist — which depends on fix 1. Demos at 3 minutes × pairs: for a class over ~20 pairs, the handout's lightning-demo fallback should be the announced default, not the exception.

## What students actually get

A working notebook that answers questions from their own documents with citations, refuses when it should, can call tools, has been attacked and patched, and is graded by an eval set they wrote — plus the vocabulary and the reflexes to read any 2026 AI announcement and see what is new versus renamed. That is a defensible final-year project scope, a portfolio item, and a better interview story than most graduates have. Worth it.
