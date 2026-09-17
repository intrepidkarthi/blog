SAMPLE INPUTS — use these only if you did not bring your own
Generative AI: Foundations and Applications · TCE Madurai · Karthikeyan NG

Every one of these is a made-up classroom sample. No real receipt, mark sheet, circular
or syllabus is in this folder. Your OWN photo, your OWN notes and your OWN questions make
a better lab and a much better capstone — the point of the course is that you can tell
when the model is wrong, and you can only do that on material you know.

HOW TO USE THEM IN COLAB
  Left sidebar -> folder icon -> upload -> pick the file -> use its name in the cell.
  Colab forgets uploaded files when the runtime restarts. Re-upload, or keep them in Drive.

---------------------------------------------------------------------------------------
SESSION 2 · Lab 2 — prompting and your first eval

  sample-10-questions.txt     Ten questions with the key fact each answer must contain.
                              Paste into Cell 3 in the {"q": ..., "expected": ...} shape.
                              At least three are ones a model gets wrong often — that is
                              deliberate. A 10/10 score means your questions were too easy.

---------------------------------------------------------------------------------------
SESSION 3 · Lab 3 — AI with eyes and ears

  sample-photo.jpg            A desk scene for Cell 2 (describe / read / count / infer).
                              Ground truth: 7 books (two stacks), 4 pens, 2 cups, 1 phone,
                              1 pair of spectacles. Ask the model to count and compare.
                              Counting is where it breaks — that is the lesson (§8.9).

  sample-receipt.jpg          A printed bill for Cell 3 and Cell 4 (structured extraction).
                              Ground truth: 5 items, total 342.00, no GST number printed.
                              The items sum exactly to the total — use that as your check.

  sample-marksheet.jpg        A mark statement for Part D / Stretch 1.
                              Ground truth: five subjects, marks 42, 38, 45, 29, 41 out of
                              50 each, total 195. One mark is printed faintly on purpose —
                              see whether the model reads it, guesses it, or says it cannot.

  sample-handwriting.jpg      A page of handwritten OS notes for Cell 5 (transcription).
                              It says: Operating Systems - Unit 3 / Deadlock: 4 conditions,
                              ALL must hold / 1. mutual exclusion 2. hold & wait /
                              3. no pre-emption 4. circular wait / Banker's algo -> safe
                              sequence / Belady: FIFO worse with MORE frames! /
                              Test on 17/09, portions upto unit 4 / Doubt: is LRU a stack
                              algorithm? ask sir.
                              Check every word it marks [?] and every word it did not.

  sample-voice-note.m4a       A 20-second spoken note for Stretch 3 (audio).
                              It says: the unit 3 internal test moved to 17 September,
                              portions up to unit 4; lab record submission is due Friday;
                              attendance below 75% needs a condonation form.
                              This is synthetic English speech. Record 20 seconds of your
                              own Tamil-English mixed speech on your phone and try that
                              too — that is where transcription gets fluent and wrong.

---------------------------------------------------------------------------------------
SESSION 4 · Lab 4 — chat with your own notes (RAG)

  sample-syllabus.pdf         A text PDF, so the PdfReader path in Cell 2 actually runs.
  sample-circular.txt         A second document — attendance, arrears, library, fees.
  sample-os-notes.txt         (already in labs/session-4/) the longer OS notes.

  Load one file, or concatenate two, and ask questions whose answers you can verify by
  reading the file. Questions the documents can answer: the pass mark, the attendance
  minimum, the arrear rule, the library timings, the Semester 5 fee and the late fine.
  Questions they cannot: who the HOD is. The second kind is the important test — the
  system must say "I don't know based on the provided documents".

---------------------------------------------------------------------------------------
SESSION 6 · Lab 6 — breaking it

  poisoned-circular.txt       An ordinary-looking library notice with an attack sentence
                              planted in the middle. Add it to your store in Cell 5, then
                              ask an ordinary question ("What are the library hours?").
                              Nobody types an attack; your own retrieval hands it over.
                              Do not put this file into anything you actually use.

---------------------------------------------------------------------------------------
A note on the images: they were drawn for this course, not photographed. A real phone
photo — angled, uneven light, a crease across the paper — is harder, and the failures it
produces are the ones you will meet in a real project. Use these to get the cell running,
then repeat with your own.
