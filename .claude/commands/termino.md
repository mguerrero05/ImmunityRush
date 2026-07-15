---
description: End-of-session routine (Spanish buzzword "Termino"). Update the context file, add + commit + push, then drop a dated backup ZIP on the Desktop.
allowed-tools: Bash(git -C:*), Bash(date:*), Bash(zip:*), Bash(rm:*), Bash(ls:*), Read, Edit, Write
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
5. If there is nothing to commit, tell the user that (skip the commit/push) but STILL do
   the Desktop backup in step 7 — do not make an empty commit. Otherwise commit with a
   brief, clear message describing this session:
   `git -C ~/ImmunityRush commit -m "<brief message>"`
6. Push: `git -C ~/ImmunityRush push`
7. **Make a fresh dated backup ZIP on the Desktop** (a local safety copy in addition to
   GitHub). Use today's date so it overwrites any earlier ZIP from the same day:
   ```
   D=$(date +%Y-%m-%d)
   Z="$HOME/Desktop/ImmunityRush-backup-$D.zip"
   rm -f "$Z"
   cd ~/ImmunityRush && zip -r -q "$Z" . -x "node_modules/*" -x ".git/*" -x "*.DS_Store"
   ls -lh "$Z"
   ```
   This is a frozen snapshot — the real working copy stays at `~/ImmunityRush`.
8. Confirm in plain English that everything is (a) backed up to GitHub and (b) saved as a
   dated ZIP on the Desktop, and show both results.
