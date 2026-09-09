# Lab 4 — queries that work on `sample-os-notes.txt`

Pre-filled in the notebook. Replace every one of them with questions about **your** document as soon as your own search works — these exist so that a pair with a scanned PDF still reaches Checkpoint 2.

| # | Used in | Query | Expected top chunk (topic) | Key fact the answer must contain |
|---|---|---|---|---|
| 1 | Cell 5 (search sanity) | What is the difference between a process and a thread? | §1 Processes and threads — "share the code section, the data section, the heap" | own stack / shared heap |
| 2 | Cell 5 (search sanity) | What are the four conditions for deadlock? | §3 Deadlock — the Coffman list | mutual exclusion, hold and wait, no preemption, circular wait |
| 3 | Cell 5 (search sanity) | What attendance percentage is required to write the end-semester exam? | §7 Regulations — attendance paragraph | 75% (condonation 65–75%) |
| 4 | Cell 6 (first RAG answer) | What is the minimum mark needed to pass a theory course? | §7 Regulations — passing a course | 45% in the end-semester AND 50% aggregate |
| 5 | Cell 7 (mini-eval) | How does round-robin scheduling work, and what happens if the time quantum is very large? | §2 Scheduling — Round Robin paragraph | degenerates to FCFS |
| 6 | Cell 7 (mini-eval) | Compare paging and segmentation in one line each. | §4 Memory — "Comparison in one line" | fixed-size vs variable-size |
| 7 | Cell 7 (mini-eval) | What is Belady's anomaly and which page-replacement algorithm suffers from it? | §5 Virtual memory — replacement paragraph | FIFO; more frames → more faults |
| 8 | Cell 7 (mini-eval) | How is the internal assessment for a theory course split? | §7 Regulations — assessment split | 2 tests scaled to 30 + 20 for assignments = 50 |
| 9 | Cell 7 (mini-eval, **not in the document**) | Who is the Head of the CSE department at TCE? | — (nothing relevant; scores will be low and flat) | must answer exactly "I don't know based on the provided documents." |

Query 9 exercises the refusal path in `RAG_TEMPLATE`. If the model invents a name here, that is your Part D finding: strengthen the ONLY / escape-hatch lines.

Stretch cells are pre-filled from the same table (Stretch 1 uses 4, 5, 7, 8, 9; Stretch 4 probe uses distinctive phrases from the expected chunks). A query that needs *broad* context for Stretch 2: "Summarise every rule about arrears and re-appearance."
