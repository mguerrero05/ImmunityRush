# Immunity Rush — Session Context

> This is our rolling memory between sessions. The most recent changes and
> discoveries get added here. It is pulled/loaded at the **start** of each session
> (buzzword "Principio") and updated + pushed at the **end** (buzzword "Termino").
> Newest entry goes at the bottom. Plain English only.

## Quick status

- **Code in repo:** the full game is now here (`index.html`, `style.css`, `script.js`),
  adopted from the archived Desktop prototype and being improved phase by phase.
- **Roadmap:** `BUILD_PLAN.md` — Milestones A–E DONE; "Character & Timers" DONE;
  **Milestone F DONE** — all 4 mini-games rebuilt to the `MILESTONE_F.md` spec (PDF,
  shared 2026-07-13): **Vaccine Darts** = drag-to-aim; **Flu Freeze** = swipe-to-slice;
  **Hospital Sprint** = jump/slide runner; **Memory Match** = 16-card matching. Exact
  educational wording; NO answer-revealing colour coding (myths/facts, positive/negative,
  matched cards all use neutral styling). Each has an opening instructions screen + PDF
  end screen. **Design:** 5-minute run timer; mini-games return to the maze (don't end the
  run). **Next: Milestone G** (custom icons to replace emoji, hospital-detailed maze
  polish, sound/music, mobile/accessibility) — see the "Final Requirements" in the PDF.
- **Maze:** now a **5-lane serpentine** (world 1050) with nook stubs, 5 patrolling flu
  hazards, ~14 boosters, "visit all 4 clinics" mission, locked vault + keycard. Clinics at
  the 4 outer corners. Fully traversable (traced). "Not now"/exit no longer teleports.
- **Character:** redesigned as a friendly CSS healthcare worker. Male (default) = short
  hair + stethoscope; Female = long bob + middle part + SHN badge; both blue scrubs,
  white shoes, rosy cheeks, big cartoon eyes, walk animation. Customize = gender/skin/
  hair-colour/eyes/scrubs (hair-style option removed; gender drives hair). User is OK
  with it for now ("we can improve later").
- **Mini-game reference:** `MILESTONE_F.md` holds the exact PDF content for all 4
  mini-games (statements, items, pairs, scores, messages) + the global no-colour-tell rule.
- **Dev server:** `npm run dev` (live reload at http://localhost:5678/). node lives at
  `~/.local/node/bin` — add it to PATH in a plain shell: `export PATH="$HOME/.local/node/bin:$PATH"`.
- **Key files:** `BUILD_PLAN.md` (roadmap), `GAME_SPEC.md` (design), `CLAUDE.md` (context).

## Deploy

- Sharing via **GitHub Pages** (static site, files at repo root). URL once enabled:
  `https://mguerrero05.github.io/ImmunityRush/`. Repo must be public; Settings → Pages →
  Deploy from branch `main` / root. Re-push to update the live site.

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
- 2026-07-10 — Character review + Milestone E. Iterated the character to match user
  references: male short hair + stethoscope, female long bob + middle part + more
  forehead, blue scrubs, white shoes, rosy cheeks, bigger cartoon eyes; default = male;
  removed the Hair Style customize option (gender drives hair). Standardized all four
  mini-games to ~60s countdowns. Built **Milestone E**: serpentine maze + dead ends,
  patrolling flu hazards (shield absorbs; respawn at 0 HP, run continues), "visit all 4
  clinics" mission (+500), and a locked vault + hidden keycard. Maze layout was authored
  without visual testing — user confirmed it's traversable and good. Next: Milestone F
  (rebuild mini-games: drag darts, swipe freeze, lane-runner sprint).
- 2026-07-13 — **Milestone F complete.** Saved the mini-game PDF spec to `MILESTONE_F.md`,
  then rebuilt all four to exact wording with no colour tell: Vaccine Darts (drag-to-aim,
  projectile, combo), Flu Freeze (swipe-to-slice, trail, 3 lives), Hospital Sprint
  (jump/slide runner, scrolling corridor, progress bar), Memory Match (16 cards/8 pairs,
  +100/match +300 complete). Also fixed a maze block (lane-3 shelf), fixed the
  "Not now"/exit teleport-into-wall bug, and enlarged the maze to a 5-lane serpentine
  (1050) with more turns, 5 hazards, ~14 boosters. User approved each. Next: Milestone G
  (custom icons replacing emoji, hospital maze detail, sound/music, mobile/accessibility).
- 2026-07-14 — Readability + polish: slowed Vaccine Darts, Hospital Sprint, and Flu Freeze
  so the educational text is readable. Started Milestone G with custom inline-SVG icons for
  the Sprint items. Added a big centered correction card in Flu Freeze (pauses the game to
  read) on a wrong slice. Enlarged the bonus vault + widened its door so it's enterable,
  moved the rewards inside, added a "find the keycard" hint. Added a home slogan. Prepping
  a **GitHub Pages** deploy so the supervisor can play it (making the repo public). Next:
  finish the icon pass (maze collectibles/hazards/keycard emoji), then clinic completed
  states, sound, mobile.
- 2026-07-14 (session 9 — Memory Match art + freeze fixes + full-screen messages):
  **1) Memory Match final art.** Copied the 6 supplied PNGs into `assets/memory-match/`
  (01–06) and rebuilt Memory Match to **6 pairs / 12 cards** — each pair is one picture
  card (image only, contained/centred, never cropped) + one fact card (wrapping text),
  with an educational explanation after each correct match. (Note: `03-sick-bed-calendar.png`
  has a faint "dreamstime" watermark baked into the supplied file — left as-is per request.)
  **2) Fixed the maze freeze (root cause).** The virus knockback (`hitByHazard`) shoved the
  player left with no wall check, pushing them INSIDE a serpentine wall; `moverPlayer` then
  blocked every direction, trapping them permanently ("redo the game"). Fix: `moverPlayer`
  now only blocks moves that ENTER a wall you're not already in (so you can always escape),
  plus a new `unstickPlayer()` safety net repositions to the nearest clear spot, and the
  knockback is now wall-safe. **3) Full-screen message overlay.** New `bigMessage()` shows
  important messages (boosters, corrections, facts, obstacle hits, Memory matches) as a
  large centred card that dims/blurs the game and PAUSES it (so you can't be hit while
  reading) then ALWAYS releases — used in the maze, Hospital Sprint, Vaccine Darts, and
  Memory Match. **4) Hospital Sprint fairness.** Jump raised (15→18, peak ~189px) so a good
  jump fully clears; duck lowered (34→22px) and held longer; obstacle hitboxes inset to
  match the visible art (no unfair edge touches; one penalty per obstacle). Verified all
  changes by driving the real code headlessly (21 checks pass, no errors). Next: finish the
  Milestone G icon pass (maze collectibles/hazards/keycard emoji), clinic completed states,
  sound, mobile.
