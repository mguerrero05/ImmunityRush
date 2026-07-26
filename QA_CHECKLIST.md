# Immunity Rush — Final QA, Regression Checklist & Asset Guide

_Stage 10 deliverable. Last updated 2026-07-26._

## 1. Final file structure (what ships)

The playable app is just three files plus the image assets — no build step, no backend:

```
index.html            All screens (home, customize, initials, maze, 4 mini-games,
                      instructions, leaderboard, end) + overlays.
style.css             All styling + the visual design system. Sectioned by Stage.
script.js             All logic. Section 1 = editable CONTENT ARRAYS (source of truth
                      for every fact/myth/message); then state, helpers, flow, maze,
                      the 4 mini-games, and the leaderboard.
assets/
  memory-match/       6 real photo cards used by the Memory Clinic (01–06 *.png).
  characters/         Optional hero renders (male-hero.png / female-hero.png) — see §4.
```

Everything else in the repo (`*.md`, `.claude/`, `package.json`, config, `node_modules`)
is documentation or local dev tooling and is **not** required to run the game.

## 2. How the game runs (browser compatibility & privacy)

- **Runs in any modern browser** (Chrome, Safari, Firefox, Edge) on phone, tablet,
  laptop, desktop. No install, no account, no framework.
- **Locally:** `npm run dev` → http://localhost:5678/. **Shared:** GitHub Pages (static).
- **No personal data is collected.** The only storage used is the browser's `localStorage`
  under three keys — `immunityCharacter`, `immunityMuted`, `immunityScores` (leaderboard
  initials + scores). Nothing leaves the device; there is no server.

## 3. Educational content — source of truth

All approved wording lives in the **content arrays at the top of `script.js`**
(`FACTS`, `SLOGANS`, `COLLECTIBLES`, `SPRINT_COLLECT`, `SPRINT_OBSTACLES`,
`FREEZE_POSITIVE`, `FREEZE_NEGATIVE`, `DARTS_MYTHS`, `DARTS_FACTS`, `MEMORY_PAIRS`,
`HAZARD_LINES`) plus the VaxFacts+ text on the end screen in `index.html`.
The full extracted list is in the doctor-review PDF on the Desktop. **Approved rule
reminder — Vaccine Darts: hit the MYTHS, protect the FACTS.**

## 4. How to replace the visual assets later

The visuals are intentionally asset-swappable:

- **Character hero art (home screen):** drop `male-hero.png` / `female-hero.png` into
  `assets/characters/`. They appear automatically; if absent, the built-in CSS character
  shows. (See `assets/characters/README.md`.)
- **Memory Clinic photos:** replace the files in `assets/memory-match/` (keep the same
  filenames), or edit the `img` paths in `MEMORY_PAIRS` in `script.js`.
- **Scenes (lobby, maze, clinic backdrops):** built from CSS in the Stage 1–8 sections of
  `style.css` — edit colours/shapes there, or layer in a background image per screen.
- **In-game icons (boosters/hazards/collectibles):** currently emoji + inline SVG. To
  swap for custom art, replace the emoji in the content arrays / `SPRINT_ICONS`, or point
  them at image files. Keep obstacle chip box sizes the same so hitboxes stay aligned.
- **Colours/spacing/type:** change the design tokens in `:root` (top of `style.css`).

## 5. Regression checklist (run after any change)

**Home & setup**
- [ ] Home lobby renders; one tagline "Keep your plans. Not the flu."; all 4 buttons work.
- [ ] Sound toggle works; keyboard Tab shows focus rings.
- [ ] Customize: Male/Female + colours change the preview; Save persists across refresh.
- [ ] Initials screen requires 2–3 letters to start.

**Maze**
- [ ] Move with arrows/WASD and the touch D-pad; character faces travel direction.
- [ ] Cannot pass through walls; **never gets stuck** in a wall (walk into walls, get hit
      by a germ near a wall — you can always move away).
- [ ] Collect shield/speed/heart/family/wellness — each shows its message and effect
      (shield bubble, speed trail, +health, +score).
- [ ] Flu germs cost health; shield absorbs one hit; 0 health respawns at entrance.
- [ ] "Visit all 4 clinics" mission + keycard/vault work; visited clinics show "✓ Visited".
- [ ] 5-minute run timer counts down and ends the run.

**Mini-games (each)** — enter from its clinic, play, and **return to the maze**:
- [ ] **Vaccine Darts** — cards identical for myths/facts (no colour tell); drag-aim +
      throw; hitting a myth = green "Correct", a fact = red "Not quite"; score updates.
- [ ] **Flu Freeze** — swipe to slice; good item = score, bad item = −1 life + correction
      card (pauses to read, then resumes); 3 lives; 0 lives ends it.
- [ ] **Hospital Sprint** — jump/duck clears obstacles fairly; collect boosters; progress
      bar reaches the finish; no freeze after a hit/collect.
- [ ] **Memory Clinic** — shuffles once; cards don't move after flipping; picture+fact
      match shows the explanation; mismatch shakes + flips back; 6 pairs completes it.

**End & data**
- [ ] End screen shows score, leaderboard rank, and the **VaxFacts+** info + link.
- [ ] Leaderboard saves top scores on the device; Play Again resets a clean run.
- [ ] No console errors during a full playthrough.

**Responsive / accessibility**
- [ ] Works phone portrait, tablet, desktop; pinch-zoom allowed; reduced-motion calms
      animations; tap targets comfortable; icon buttons announce their purpose.

## 6. Automated verification (Stage 10)

A headless pass over the real code confirmed **28/28**: character persistence, run reset,
maze build, all booster effects, hazard damage, all four mini-game entry+return, leaderboard
sort, 5-minute timer, VaxFacts+ link, no-PII storage, and that **all approved wording is
unchanged** — with **no runtime errors**.

## 7. Known follow-ups (not blocking)

- Full **landscape/widescreen frame** is deferred (app is a centred portrait frame; works
  everywhere). A dedicated responsive pass can add the widescreen side-panel composition.
- **In-game emoji → custom icons** could be a later art pass.
- **Memory photos** (~1.3 MB total) load only in that mini-game; can be losslessly
  compressed later for faster first load.
- **Memory cards** are click/touch only (not keyboard-operable) — a future a11y pass.
