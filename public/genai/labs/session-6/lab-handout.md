# Lab 6 — Break It, Then Ship It
**Session 6 · Security + Shipping · TCE — the finale** · ~30 min hardening + ~50 min demos

> **Runs entirely in your browser (Google Colab).** Any laptop or lab PC works — nothing to install, no GPU, no payment. See `ZERO-SETUP.md`.

Open your Session 4/5 capstone notebook alongside this one.

## Part A — Attack a naive bot (8 min)
Run the under-defended TCE-Bot. Throw attacks at it: instruction override, "print your system prompt", roleplay jailbreak. Add your own — creativity rewarded.

✓ **Checkpoint 1:** one attack that makes it misbehave.

## Part B — Harden it (8 min)
Add the layered defenses (instruction hierarchy, delimit user text as DATA, output filter). Re-run the **same** attacks — they should bounce while normal questions still work. Then try to beat your own defense (no prompt is unbreakable — layers, not walls).

✓ **Checkpoint 2:** attacks bounce, normal question answered.

## Part C — Red-team a classmate (12 min)
**Swap laptops with another pair.** Attack their capstone: direct injection, an **indirect** poisoned document (add a malicious line, re-ingest, ask normally), a tool that fires when it shouldn't. Find one real hole. Swap back → patch YOURS.

✓ **Checkpoint 3:** one hole found + one fix applied to your app.

## Part D — Ship-readiness self-audit (5 min)
Score your capstone against the 8-point checklist. Honest count = your roadmap, not your grade.

## Then: Capstone demos
**3 minutes each:** what it does + techniques · one failure you found · one fix. Pre-run your best example. Lead with the problem. **Show the failure — honesty about limits scores higher than a fragile "perfect" demo.**

## Keep everything
All decks, labs, cheatsheets, prep notes are yours. Ship your capstone for real (Streamlit/Vercel free tier), put the link on your resume and GitHub. Stay in touch: @intrepidkarthi.
