# Immunity Rush — Session Context

> This is our rolling memory between sessions. The most recent changes and
> discoveries get added here. It is pulled/loaded at the **start** of each session
> (buzzword "Principio") and updated + pushed at the **end** (buzzword "Termino").
> Newest entry goes at the bottom. Plain English only.

## Quick status

- **Code in repo:** the full game is now here (`index.html`, `style.css`, `script.js`),
  adopted from the archived Desktop prototype and being improved phase by phase.
- **Roadmap:** `BUILD_PLAN.md` — Milestones A, B, C, D are DONE, plus most of the
  inserted **"Character & Timers"** milestone: character redesign DONE; the **overall
  5-minute run timer** is DONE (counts up in the maze HUD; ends the run at 5:00; runs
  continuously, including during mini-games). **Design change (user):** finishing OR
  dying in a mini-game no longer ends the run — you return to the maze with your score
  and the run only ends at 5:00 or via "End Run". Still OPTIONAL/TO DO: per-mini-game
  ~60s countdowns (Sprint & Darts are 30s; Freeze/Memory have none). After that: Milestone E.
- **⚠️ Still needs visual review:** the new character art is code-complete but the user
  hasn't eyeballed it yet — check proportions/face/SHN badge in the browser and tune.
- **Known bug FIXED this session:** mini-game doors stopped triggering after dying in a
  mini-game (zoneCooldown left stuck); now reset on each run start.
- **Dev server:** `npm run dev` (live reload at http://localhost:5678/). node lives at
  `~/.local/node/bin` — add it to PATH in a plain shell: `export PATH="$HOME/.local/node/bin:$PATH"`.
- **Key files:** `BUILD_PLAN.md` (roadmap), `GAME_SPEC.md` (design), `CLAUDE.md` (context).

## Session log

- 2026-07-07 — Read the Immunity Rush context packet and saved the full game design
  to `GAME_SPEC.md`. Made the initial git commit and pushed the repo to GitHub. Set up
  the session workflow: Spanish buzzwords "Principio" (start) and "Termino" (end), the
  `/principio` and `/termino` saved commands, and this context file. No game code yet.
  Next: build the Home screen.
- 2026-07-08 — Big build session. Inspected the archived prototype and wrote the full
  roadmap (`BUILD_PLAN.md`). Decided to ADOPT the prototype (not rebuild) and improve it.
  Completed: **Milestone A** (copied game into repo as baseline + dev tooling), **Milestone
  B** (content upgrades — new collectible points/messages + Wellness Star, distinct Memory
  Match pairs, "Myth cleared!" darts copy, specific Flu Freeze consequences, home subtitle),
  and **Milestone C** (game-feel toolkit: floating text, Web Audio sounds + mute button,
  particles, screen shake; visible power-up effects — shield bubble + countdown, speed
  trail + countdown, health popup). User tested B+C in the browser — all good.
  Next: **Milestone D** (hospital-themed maze).
- 2026-07-09 — Completed **Milestone D** (hospital-themed maze: tiled floor, labeled
  rooms — Reception/Pharmacy/Waiting/Staff Lounge/VaxFacts+ Clinic, mini-games as named
  destinations, wayfinding signs). Then, per user request, inserted a **"Character &
  Timers"** milestone and did the **character redesign**: replaced the placeholder blob
  with a friendly CSS healthcare worker in blue scrubs (V-neck, pocket, SHN badge on
  chest), head + face + arms + legs + shoes, and a continuous walk/bob animation on the
  maze player + sprint runner (used a user-provided reference PNG for style). STILL TO DO:
  the timers (maze count-up + ~60s mini-game countdowns), and a visual review of the new
  character. Next: finish timers, then Milestone E.
- 2026-07-10 — Fixed a bug: mini-game doors stopped working after dying in a mini-game
  (zoneCooldown left stuck "on"; now reset on run start). Then, per user design calls,
  added an **overall 5-minute run timer** (counts up in the maze HUD; ends the run at
  5:00; runs continuously through mini-games) and made **mini-games NOT end the run** —
  finishing/dying returns you to the maze with score kept (Sprint death now routes to
  finishSprint; health resets each Sprint entry). User approved the flow. Still to do:
  optional per-mini-game ~60s countdowns, and the character visual review. Next:
  character review, then Milestone E (maze difficulty).
