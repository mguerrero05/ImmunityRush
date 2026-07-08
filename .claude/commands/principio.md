---
description: Start-of-session routine (Spanish buzzword "Principio"). Pull latest and load the session context file.
allowed-tools: Bash(git -C:*), Read
---

Start-of-session routine for Immunity Rush. This runs when the user says the Spanish
buzzword **"Principio"** (or `/principio`). Do the following, in order:

1. Pull the latest so we have the newest version of the context file:
   `git -C ~/ImmunityRush pull --ff-only`
   If it fails (no network, nothing to pull, or diverged), note it briefly and continue —
   do not stop.
2. Read `~/ImmunityRush/SESSION_CONTEXT.md`.
3. Give a short, plain-English recap of the most recent changes/discoveries and the
   planned next step, so we're oriented for this session.

Do NOT start coding or make any changes yet — just load context and recap, then wait
for direction.
