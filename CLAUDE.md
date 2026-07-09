# Immunity Rush — Claude Context File

> Fresh start. This project is being built from scratch. An earlier prototype exists
> as a backup in the `Immunity rush game` folder on the Desktop — we are NOT reusing
> its code, only the concept below.

## What I'm Building

I'm building **Immunity Rush**, a hospital-themed maze game about staying ahead of
flu season. The player navigates a maze, completes mini-challenges, and tries to
protect their plans / stay healthy. It's part of a summer project for a hospital.
The app is for hospital staff / the public engaging with flu-season awareness.
The goal is to make flu-season / immunity messaging fun and memorable through a game.

## Game Type

- Arcade / maze game with mini-challenges (not a plain quiz)

## Platform

- Web browser — works on any device, no download needed. Designed to look like a
  phone screen (a "phone frame" layout).

## Tech Stack

- Not set up yet — we'll choose and initialize it fresh when we start building.
- Recommended (matches "keep it simple" below): plain **HTML, CSS, and JavaScript**,
  no framework. Add tooling (formatter, dev server) only if it helps.
- Already installed on this machine: VSCode + extensions, Node.js v24, Git.

## Key Screens / Features (planned — to build fresh)

1. Home screen — hospital building, SHN logo, title, menu buttons
2. Customize Character screen
3. Instructions screen
4. Leaderboard screen (saved on the device)
5. The maze gameplay + mini-challenges

## Game Content

- Theme: flu season, immunity, staying healthy, hospital setting.
- Branding: "SHN" logo.
- (Fill in as it grows: what challenges appear, what the questions/tasks are, etc.)

## Visual Style

- Hospital look: the "SHN" logo, a hospital building, health/flu theme.
- Tone: friendly and playful, not clinical or intimidating.
- Phone-shaped frame so it feels like a mobile app.

## What I Don't Want

- Overly complex features — keep it simple and clean
- Anything that costs money to run
- Code explanations I can't follow — please use plain English
- Adding build tools (React/Node bundlers) unless there's a clear reason

## My Experience Level

I have no coding experience. Please:

- Explain what you're doing in plain English as you go
- Tell me exactly what to type, step by step
- Warn me before making big changes
- Keep the code simple and avoid over-engineering

## Current Status

- [x] Machine fully set up (VSCode + extensions, Node.js, Git)
- [x] Fresh project folder created & connected to GitHub (`ImmunityRush`, home folder)
- [x] Claude Code signed in on VSCode
- [x] Tech stack chosen and project initialized (plain HTML/CSS/JS + npm dev tooling)
- [x] Home screen built (adopted from prototype baseline)
- [x] Remaining screens built (all screens + 4 mini-games present in baseline)
- [~] Game content finalized (Milestone B content upgrades done; mini-game rebuilds pending)
- [ ] Tested with real users
- [ ] Deployed / shared with the hospital team (e.g. Vercel)

## Session Buzzwords (Spanish only — never trigger on the English equivalent)

Two Spanish buzzwords control the session workflow. They ONLY trigger when written in
**Spanish**, exactly as shown. If the user writes the English equivalent, do NOT trigger.

- **"Principio"** = start of session. Run the `/principio` routine: pull the repo and
  load `SESSION_CONTEXT.md`, then recap the most recent changes and the next step.
  Do NOT trigger on English words like "beginning", "start", or "begin".
- **"Termino"** = end of session. Run the `/termino` routine: update `SESSION_CONTEXT.md`
  with this session's changes/discoveries, then `add` + `commit` (brief message) + `push`
  to GitHub. Do NOT trigger on English words like "end", "finish", "done", or "stop".

Whether the user types the word plainly (e.g. `Principio`) or the slash command
(`/principio`), do the same thing. The saved commands live in `.claude/commands/`.
`SESSION_CONTEXT.md` is our rolling between-session memory.

## How We Track Progress (please maintain this)

This `## Session Notes` log is our shared memory across sessions — the user should not
have to re-explain what's been done. **At the end of every working session, add a dated
bullet** summarizing what changed and what the next step is, and tick off `Current Status`
above. Newest entry goes at the bottom.

## ▶️ Where we left off / do this next

The full game is now in the repo (`index.html`, `style.css`, `script.js`), adopted from
the archived prototype and being improved phase by phase per **`BUILD_PLAN.md`**.
Milestones A, B, C, D are DONE, plus the character redesign (friendly healthcare worker
in blue scrubs + walk cycle). **Next: finish the "Character & Timers" milestone** — add
the maze count-up timer and a ~60s countdown to each mini-game — then Milestone E (maze
difficulty). Also do a visual review of the new character. Read `BUILD_PLAN.md` and
`GAME_SPEC.md` first. Run with `npm run dev` (live reload).

## Session Notes

- 2026-07-05 (session 1 — setup): Set up the whole environment on the user's Mac.
  Installed VSCode's 6 recommended extensions + confirmed the Claude Code extension is
  installed (user was waiting on sign-in). Installed Node.js v24 LTS (user-local at
  `~/.local/node`, added to PATH via `~/.zshrc`, no admin needed) — `node`, `npm`, and
  `code` all work in a fresh terminal. Git is installed with the user's name/email.
  The user has a GitHub account (mguerrero05) and GitHub Desktop signed in.
- 2026-07-05 (session 1 — fresh start): The user decided to REBUILD from scratch rather
  than continue an earlier prototype. Kept only the concept (this CLAUDE.md). Created a
  new private GitHub repo `github.com/mguerrero05/ImmunityRush`, cloned to `~/ImmunityRush`
  (this folder). The old prototype (a full vanilla HTML/CSS/JS game + dev tooling) is
  archived UNTOUCHED at `~/Desktop/Immunity rush game` — reference only, do not reuse.
  Next: user signs into Claude in VSCode, then we build the Home screen from scratch.
- 2026-07-07 (session 2 — spec captured): Read the "Immunity Rush Claude Context
  Packet" PDF and wrote the full design into `GAME_SPEC.md` (all screens, the 4
  mini-games, collectibles, slogans/facts/myths content, tone rules, and exact
  end-screen/VaxFacts+ text). No game code written yet — user chose to just capture
  the spec this session. Next: build the Home screen in plain HTML/CSS/JS.
- 2026-07-08 (session 3 — build): Reversed the earlier "rebuild from scratch" call —
  ADOPTED the archived prototype into the repo as the v1 baseline (all screens + 4
  mini-games) plus npm/Prettier/ESLint tooling. Wrote `BUILD_PLAN.md` (14-milestone
  roadmap). Completed Milestone B (content/message upgrades) and Milestone C (game-feel
  toolkit: floating text, Web Audio SFX + mute, particles, shake; visible power-up
  effects). User tested B+C in the browser — all good. Next: Milestone D (hospital-themed
  maze). See `SESSION_CONTEXT.md`.
