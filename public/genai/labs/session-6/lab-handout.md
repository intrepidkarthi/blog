# Lab 6 — Break It, Then Ship It
**Session 6 · Security + Shipping · TCE — the finale** · ~30 min hardening + ~35 min demos (3 min per pair)

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

Open your Session 4/5 capstone notebook alongside this one.

## Part A — Attack a naive bot (8 min)
Run the under-defended TCE-Bot. Throw attacks at it: instruction override, "print your system prompt", roleplay jailbreak. Add your own — creativity rewarded. Expect most direct attacks to bounce even here: current models are trained hard against them. That is the finding, not a broken exercise.

✓ **Checkpoint 1:** you can say which attacks bounced, which got anywhere, and what that proves about the bot.

## Part B — Harden it (8 min)
Add the layered defenses (instruction hierarchy, delimit user text as DATA, output filter). Re-run the **same** attacks. Many of them bounced before you hardened anything, so this is not a clean before/after: the questions are which class of attack still lands (the indirect one in Cell 5) and what your layers actually changed. Before Cell 5, run the *Reload your Lab 4 store* cell: it mounts Drive and reads back your Lab 4 embeddings, so the poisoned chunk is injected into **your** real store. Then try to beat your own defense (no prompt is unbreakable — layers, not walls).

✓ **Checkpoint 2:** you can name the attack class that still lands and what your hardening changed; normal question still answered.

## Part C — Red-team a classmate (10 min)
**Swap laptops with another pair.** Attack their capstone: direct injection, an **indirect** poisoned document (add a malicious line, re-ingest, ask normally), a tool that fires when it shouldn't. Find one real hole. Swap back → patch YOURS. No working app on either side? Red-team the naive bot from Cell 2 instead, and harden that — the checkpoint is the hole plus the fix, not the app.

✓ **Checkpoint 3:** one hole found + one fix applied to your app.

## Part D — Ship-readiness self-audit (5 min)
Score your capstone against the 8-point checklist (Cell 6): grounded prompt with an "I don't know" escape · untrusted text delimited & labeled · output validated before returning · no destructive tool without a human gate · retries + timeout + graceful error · requests logged (prompt/cost/latency) · eval set runs as a regression test · sources/citations shown to the user. Honest count = your roadmap, not your grade.

## Then: Capstone demos
Use the instructor's announced format: normally **up to 3 minutes per pair**, but a larger class may use 60–90-second lightning demos, selected live demos, or parallel rooms. Cover what it does + techniques · one failure you found · one fix. Pre-run your best example. Lead with the problem. **Show the failure — honesty about limits scores higher than a fragile "perfect" demo.**

## Keep everything
All decks, labs, cheatsheets, prep notes are yours. Ship your capstone for real (Streamlit/Vercel free tier), put the link on your resume and GitHub — API key in Streamlit secrets or an env var, never in the repo. Or scope it into your final-year project: a metric, a baseline, and where it fails. Stay in touch: @intrepidkarthi.
