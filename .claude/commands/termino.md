---
description: End-of-session routine (Spanish buzzword "Termino"). Update the context file, then add + commit + push.
allowed-tools: Bash(git -C:*), Bash(date:*), Read, Edit, Write
---

End-of-session routine for Immunity Rush. This runs when the user says the Spanish
buzzword **"Termino"** (or `/termino`). Do the following, in order:

1. Update `~/ImmunityRush/SESSION_CONTEXT.md`: add a NEW dated entry at the bottom
   (keep all older entries) summarizing, in plain English, what we changed/discovered
   this session and what the next planned step is. Use today's real date — get it with
   `date +%Y-%m-%d` if unsure.
2. If relevant, also update the `## Session Notes` and status boxes in `CLAUDE.md`.
3. Stage everything: `git -C ~/ImmunityRush add -A`
4. Show `git -C ~/ImmunityRush status` so the user can see what will be saved.
5. If there is nothing to commit, tell the user that and stop — do not make an empty
   commit. Otherwise commit with a brief, clear message describing this session:
   `git -C ~/ImmunityRush commit -m "<brief message>"`
6. Push: `git -C ~/ImmunityRush push`
7. Confirm in plain English that everything is backed up to GitHub and show the result.
