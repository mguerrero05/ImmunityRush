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
- [ ] Claude Code signed in on VSCode
- [ ] Tech stack chosen and project initialized
- [ ] Home screen built
- [ ] Remaining screens built
- [ ] Game content finalized
- [ ] Tested with real users
- [ ] Deployed / shared with the hospital team (e.g. Vercel)

## How We Track Progress (please maintain this)

This `## Session Notes` log is our shared memory across sessions — the user should not
have to re-explain what's been done. **At the end of every working session, add a dated
bullet** summarizing what changed and what the next step is, and tick off `Current Status`
above. Newest entry goes at the bottom.

## ▶️ Where we left off / do this next

The full game design is now captured in **`GAME_SPEC.md`** (screens, 4 mini-games,
collectibles, all message/fact/myth content, tone rules, end-screen text). Read that
first when building. Nothing has been coded yet — the next step is to build the
**Home screen** in plain HTML/CSS/JS from scratch.

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
