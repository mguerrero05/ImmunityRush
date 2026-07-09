# Immunity Rush — Build Roadmap

> The step-by-step plan for turning the prototype into a polished, hospital-themed
> arcade game. Work **top to bottom, one task at a time**. Each task lists the files,
> what to add/change, the steps, and how to test. Check off tasks as we go.
>
> Foundation decision (2026-07-08): we **adopt the archived prototype** at
> `~/Desktop/Immunity rush game` as v1, then improve it. We do NOT rebuild from scratch.

---

## Global working rules (from Phase 14 — apply to every task)

1. Don't rewrite the whole game. One improvement at a time.
2. After each change: say what changed, which file, and how to test it.
3. Reuse existing systems (the `state` object, content arrays, `showScreen`, popups).
4. Don't delete existing messages unless replacing them with better ones. Ask before
   deleting large code sections.
5. Keep all flu/vaccine messages short and gameplay-friendly. Never make it feel like a quiz.
6. Prioritize visuals, interaction, and player feedback.
7. Commit after each working task (say **Termino** to save + push).

---

## Current State Summary (Phase 1 — done)

- **Repo baseline:** none yet — game code is the archived prototype (index.html 329 /
  style.css 892 / script.js 1180). `Immunity-Rush.html` is a single-file exported copy.
- **Architecture (keep):** one-page screen router (`showScreen`), central `state`,
  easy-to-edit content arrays, HUD, localStorage leaderboard, popup/toast, character
  customization, base movement/collision/camera.
- **Placeholders (replace):** all visuals are CSS shapes + emoji; no image/sound assets.
- **Must-fix mechanics:** Darts is click-based AND color-codes facts/myths (needs neutral
  colors + drag-release); Freeze is click (needs swipe); Sprint is emoji objects (needs
  lane runner); Memory pairs all start with "Vaccination" (needs distinct pairs).

---

## Roadmap at a glance (recommended order)

| #   | Milestone                                       | Why here                                         | Size |
| --- | ----------------------------------------------- | ------------------------------------------------ | ---- |
| A   | Adopt prototype into repo                       | Nothing works until code is in the repo          | S    |
| B   | Content & message upgrades                      | Heart of the project, low-risk edits, quick wins | M    |
| C   | Shared game-feel systems                        | Build reusable feedback once, reuse everywhere   | M    |
| D   | Maze → hospital theming                         | Turns blocks into a place; visual payoff         | M    |
| E   | Maze difficulty & progression                   | Add challenge after the space feels real         | L    |
| F   | Mini-game rebuilds (Darts→Freeze→Sprint→Memory) | The big interactive upgrades                     | XL   |
| G   | Custom icons / art pass                         | Replace emoji once mechanics are settled         | M    |
| H   | UI flow, end screen, victory moments            | Tie it together                                  | M    |
| I   | Testing & debugging                             | Verify everything                                | M    |

**Do first:** A, then B (safe wins), then C. **Do later:** E and F (biggest, riskiest).

---

## Milestone A — Adopt the prototype into the repo

**Goal:** get the working game into `~/ImmunityRush` so we can improve it with save points.

- **A1 — Copy the 3 core files.** Copy `index.html`, `style.css`, `script.js` from
  `~/Desktop/Immunity rush game` into `~/ImmunityRush`. Leave the standalone
  `Immunity-Rush.html` behind (it's a duplicate).
  - _Test:_ double-click `~/ImmunityRush/index.html` — the game opens and plays.
- **A2 — Bring over dev tooling (optional but handy).** Copy `package.json`,
  `package-lock.json`, `.prettierrc.json`, `eslint.config.mjs`, `.editorconfig`, and the
  prototype's `.gitignore` additions. Run `npm install` in the repo.
  - _Test:_ `npm run dev` opens the game with live reload.
- **A3 — First save point.** Commit the baseline ("Adopt prototype as v1 baseline").
  - _Test:_ `git log` shows the commit; files appear on GitHub after push (Termino).
- **A4 — Sanity pass.** Click every screen, enter each mini-game, confirm no console
  errors in the browser (F12 → Console).
  - _Do first:_ A1–A4 before anything else.

---

## Milestone B — Content & message upgrades (safe, high-value)

**Goal:** make every message match the new, more personal/specific copy. Data-only edits —
no mechanics rewrites. **Files:** mostly the content arrays at the top of `script.js`,
plus `collect()`; a little `index.html` for the home subtitle/end screen.

- **B1 — Collectibles data (Phase 5).** In `COLLECTIBLES`: set new points and messages, and
  **add Wellness Star**. Target values:
  - Vaccine Shield — +100, "Protection starts before exposure."
  - Speed Boost — +100, "Babies under 6 months are too young for their own flu shot — protection around them matters."
  - Heart — +50, "Protect the people waiting for you at home."
  - Family Token — +200, "Protect the moments waiting for you after your shift."
  - Wellness Star (new) — +100, "Flu vaccination is especially important for older adults and pregnant people."
  - _Change:_ update `collect()` so the score popup shows the labeled bonus (e.g. "+200 Family Bonus").
  - _Test:_ collect each in the maze; correct points + message appear.
- **B2 — Memory Match pairs (Phase 10 data).** Replace `MEMORY_PAIRS` with the 8 distinct
  benefit↔outcome pairs + per-pair messages (Annual Flu Shot↔Changing Flu Viruses, Flu
  Shot↔Cannot Give You Flu, Healthcare Worker↔Patient Protection, Healthy Person↔Still At
  Risk, Grandparent↔Higher-Risk Loved Ones, Baby↔Too Young For Own Shot, Calendar
  Plans↔Fewer Missed Moments, VaxFacts+↔Judgement-Free Questions). Card **visuals/icons**
  come later in F4 — this task is text/data only.
  - _Test:_ Memory Match shows varied, non-repetitive card faces; match shows the message.
- **B3 — Darts feedback copy (Phase 7).** Update correct-hit text to "Myth cleared! …" and
  keep the specific fact corrections. Data only; drag mechanic is F1.
  - _Test:_ hitting a myth shows "Myth cleared!"; hitting a fact shows the correction.
- **B4 — Freeze negative-item messages (Phase 8).** Replace generic bad-item messages with
  the specific consequences (Missed Family Dinner / Sick Day / Cancelled Plans / Missed
  Vacation, etc.). Map message to the sliced item, not random.
  - _Test:_ slicing each negative item shows its specific message.
- **B5 — Home & end-screen copy (Phase 12/end).** Home subtitle → "Keep your plans. Not the
  flu." Confirm end screen has the exact VaxFacts+ text + link `https://www.shn.ca/vaxfacts/`.
  - _Test:_ read the home + end screens; copy matches.
- **B6 — Sync GAME_SPEC.md.** Update the spec's point values/messages so docs match code.

---

## Milestone C — Shared game-feel systems (build once, reuse everywhere)

**Goal:** reusable feedback helpers so later work is fast. **Files:** `script.js` (new
helper functions), `style.css` (animations).

- **C1 — Floating score/text popups.** A `floatText(x, y, text)` helper that spawns a small
  element that drifts up and fades. Use for "+200 Family Bonus", combos, etc.
  - _Test:_ call it on collect; text floats and disappears.
- **C2 — Sound system (no files, no cost).** Tiny WebAudio helper `playSound(type)` for
  collect / hit / success / error, plus a **mute toggle** in the HUD. (Synth beeps — no
  asset files, no paid libraries.)
  - _Test:_ actions play distinct sounds; mute silences them.
- **C3 — Particles + screen shake.** `burst(x, y, color)` for small particle bursts and
  `shake(el)` for a quick screen shake.
  - _Test:_ trigger both on a hit; visible, then auto-clean up.
- **C4 — Visible power-up effects (Phase 6).** Shield → bubble around player + "Shield
  Active" + absorbs one hazard hit + break animation. Speed → trail + 5s countdown +
  "Speed Boost!" popup. Heart → "+Health" popup + HUD update. Family → larger warm popup.
  - _Test:_ collect each; the effect is obvious and its start/end are both shown.

---

## Milestone D — Make the maze feel like a hospital (Phase 3)

**Goal:** a hospital floor with corridors, rooms, and signage — not blocks on a flat bg.
**Files:** `buildMaze()` + maze data in `script.js`, `.wall/.zone/.room/.sign` in
`style.css`, `#screen-maze` markup.

- **D1 — Floor graphic.** Add a tiled/gradient hospital-floor background under the maze
  world. _Test:_ maze background reads as a floor.
- **D2 — Corridors + rooms.** Convert the wall array into real corridors that connect
  labeled rooms. Add a `rooms` data array (name, rect). _Test:_ you can walk hallways
  between rooms; rooms are visually distinct.
- **D3 — Signs & labels.** Add wall/door signs: Nurse Station / Reception, Pharmacy,
  Waiting Area, Staff Lounge, VaxFacts Clinic. _Test:_ labels render in the right rooms.
- **D4 — Mini-games as destinations.** Re-theme the 4 zones as named rooms with door
  signage: **Hospital Sprint Corridor, Vaccine Darts Room, Flu Freeze Station, Memory
  Match Clinic.** _Test:_ reaching a room shows its entry popup.
- **D5 — Directional signage.** Upgrade the edge arrows into hospital wayfinding signs
  pointing to each destination. _Test:_ signs point correctly as the camera moves.

---

## Milestone E — Maze difficulty & progression (Phase 4)

**Goal:** intentional challenge and a real path to the end. **Files:** `script.js` (maze
data, movement/collision, new door/keycard/hazard logic), `style.css`.

- **E1 — Richer layout:** more complex routes + dead ends in the wall/room data.
- **E2 — Hazards:** hazard tiles/objects that reduce health on contact; **shield absorbs
  one hit** (ties to C4). _Test:_ touching a hazard drops health; with shield it's absorbed.
- **E3 — Locked doors + keycards:** collectible access badges; doors that won't open
  without them. _Test:_ locked door blocks until badge collected.
- **E4 — Patrolling flu obstacles:** moving enemies on set paths; contact = damage.
  _Test:_ they move; collision hurts.
- **E5 — Gated mini-games:** some doors read "Complete Vaccine Darts to unlock" and open
  only after that mini-game is finished. _Test:_ door opens after completion.
- **E6 — Final path:** the exit to the End Screen unlocks only after **all four**
  mini-games are complete. _Test:_ finishing all four opens the final area → end screen.

---

## Milestone F — Mini-game rebuilds (one at a time, fully test each)

Order chosen: **Darts → Freeze → Sprint → Memory** (Darts fixes the color-coding bug and is
most-specified; Sprint is the biggest lift; Memory is mostly visual after B2).

### F1 — Vaccine Darts (Phase 7)

**Goal:** drag-and-release arcade darts. **Files:** `startDarts/spawnDartTarget/finishDarts`,
`#screen-darts`, darts styles.

- Neutral colors for BOTH myths and facts (remove green/red).
- Drag to aim, release to throw; simple projectile arc; target boards move across screen.
- Limited darts or a timer for pressure; combo scoring for consecutive correct myths.
- Hit myth → points + "Myth Cleared!"; hit fact → penalty + correction.
- _Test:_ you aim by dragging (not clicking), can't tell answer by color, combo counts up.

### F2 — Flu Freeze (Phase 8)

**Goal:** swipe-to-slice (Fruit Ninja feel). **Files:** `startFreeze/spawnFreezeItem/
finishFreeze`, `#screen-freeze`, freeze styles.

- Items fly across; **swipe/drag to slice**; slice trail + particles on cut.
- Positive slice = points + combo; negative slice = lose a life + **specific** correction
  (from B4); missing positives breaks combo. 3 lives.
- _Test:_ dragging cuts items; trail shows; slicing a bad item costs a life with its message.

### F3 — Hospital Sprint (Phase 9)

**Goal:** lane-based runner. **Files:** `startSprint/sprintTick/sprintJump/finishSprint`,
`#screen-sprint`, sprint styles.

- Scrolling corridor art; 2–3 lanes; jump + slide + lane-switch; obstacles approach.
- Collectibles along the path (Booster/Heart/Family/Wellness/Energy w/ Phase-9 messages).
- Speed ramps up; progress bar; finish line moment; screen shake + hit reaction on hit;
  shield absorbs one hit; end card with score + message.
- _Test:_ character stays in a lane, jumps/slides, obstacles collide, progress bar fills.

### F4 — Memory Match visuals (Phase 10)

**Goal:** designed, illustrated cards for the B2 pairs. **Files:** `startMemory/flipCard/
finishMemory`, `#screen-memory`, memory styles.

- Small icons per card (family, patient, calendar, shield, team, grandparent, baby,
  VaxFacts/?); flip animation; matched pair shows its message.
- _Test:_ cards flip smoothly, icons render, matches feel meaningful.

---

## Milestone G — Custom icons / art pass (Phase 5 visuals)

**Goal:** replace emoji with consistent CSS/SVG game icons. **Files:** `style.css`,
small icon markup/helpers, `assets/` if we add SVGs.

- Icons for: Vaccine Shield, Speed Boost, Heart, Family Token, Wellness Star, Flu Virus,
  Sick-Day Barrier, Cancelled Plans, Low-Energy Cloud, hospital doors/signs.
- Each collectible: hover/float idle, collection animation, score popup (C1), sound (C2),
  short message.
- _Test:_ no emoji remain for collectibles/obstacles; icons animate on idle + collect.

---

## Milestone H — UI flow, end screen, victory moments (Phases 11–12)

**Goal:** smooth, complete flow. **Files:** `index.html` screens, `showScreen`, transitions,
end-screen logic.

- **H1 — Screen flow:** Home (title, "Keep your plans. Not the flu.", Start/Leaderboard/
  Instructions), Instructions, Initials (2–3), Maze HUD (score/health/shield/labels).
- **H2 — Mini-game wrappers:** each has entry popup → instructions → play → score → "Back
  to maze" button (consistent).
- **H3 — Completion → End screen:** unlock final area, then End screen: "Run Complete",
  final score, leaderboard rank, vaccination info, VaxFacts+ message + link, buttons
  Play Again / Back to Home / View Leaderboard.
- **H4 — Polish/juice:** button hover, screen transitions, mini-game unlock + victory
  animations, final run-complete animation, clear damage feedback (reuse C1–C4).
- _Test:_ full playthrough from Home → all mini-games → End with no dead ends.

---

## Milestone I — Testing & debugging (Phase 13)

**Goal:** verify every feature. Run this checklist after H (and re-run relevant lines after
each earlier task):

1. Player movement 2. Maze collisions 3. Mini-game entry zones 4. Door lock/unlock
2. Score increases 6. Health decreases 7. Shield activation + absorbs one hit
3. Speed-boost timer 9. Heart health restore 10. Leaderboard saving 11. Sprint
   collisions 12. Darts drag/release aiming 13. Freeze swipe detection 14. Memory pairs
4. All return-to-maze buttons 16. Final game completion 17. Mobile responsiveness
5. No console errors.

---

## Immediate next action

Start **Milestone A, task A1** — copy the prototype's `index.html`, `style.css`, `script.js`
into `~/ImmunityRush`, confirm it runs, and commit the baseline. Everything else builds on it.
