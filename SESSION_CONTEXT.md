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
- 2026-07-14 (session 10 — Vaccine Darts feedback colours): Added green/red result
  feedback to Vaccine Darts (after a hit only, never on the moving targets): a correct hit
  (a myth) shows a GREEN result overlay ("Correct! +pts"), an incorrect hit (a fact) shows a
  RED overlay ("Not quite −50") + the correction. Done via two new overlay tones
  (`tone-correct`/`tone-wrong`) on `bigMessage`. Also coloured the pre-game instruction text
  so MYTHS = red and FACTS = green (`.myth-word`/`.fact-word`), rest of the sentence
  unchanged — the instruction popup now renders as HTML. The moving dart boards stay neutral
  grey (no colour tell before selection); the only post-hit class on a board is a shake, not
  a colour. Verified headlessly (7 checks pass, no errors). Next unchanged: Milestone G icon
  pass, clinic completed states, sound, mobile.
- 2026-07-14 (session 11 — backups + presentation brief): Confirmed the project is fully
  backed up to GitHub (local == origin). Added a **local backup habit**: created a dated
  ZIP snapshot on the Desktop (`ImmunityRush-backup-YYYY-MM-DD.zip`, excludes node_modules/
  .git/.DS_Store) and updated the **/termino** command so every Termino now also refreshes
  that Desktop ZIP (same-day overwrites). The real working copy stays at `~/ImmunityRush`;
  the ZIP is just a frozen safety copy. Also wrote **`PRESENTATION_BRIEF.md`** — a detailed,
  plain-English snapshot of the whole project (what it is, the maze + 4 mini-games, what's
  done, what's next, known limitations, a suggested slide outline, and a ready-to-paste
  ChatGPT prompt) so the user can build a progress slideshow. Next unchanged: Milestone G
  icon pass, clinic completed states, sound, mobile; plus grab screenshots for the slides.
- 2026-07-25 (session 12 — visual upgrade, staged Stages 0–4): Kicked off a big polish pass
  following the user's staged brief (visual references supplied; their on-image text is
  illustrative and IGNORED — approved wording is the source of truth). Chosen layout target:
  **responsive portrait + landscape** (landscape frame still deferred to protect mini-game
  geometry). Checkpoint tags: `baseline-pre-visual-2026-07-25`, plus per-stage `stageN-start`.
  **Stage 0** audit (no code changes; flagged 5 image/content conflicts — notably the Darts
  reference INVERTS the approved rule: our game = hit MYTHS, protect FACTS; keep ours).
  **Stage 1** shared design system: expanded `:root` tokens, refined buttons/popups/overlays/
  cards, focus-visible + reduced-motion, reusable `.panel/.stat-chip/.pips/.icon-btn` + state
  classes. **Stage 2** character: directional facing (front/back/left/right) + walk/idle on the
  maze player (visual only, collision unchanged); hybrid **hero-portrait** slot on home that
  loads `assets/characters/<gender>-hero.png` with graceful CSS fallback (README added). NOTE:
  I can't generate/background-remove images here, so hero renders must be supplied as files.
  **Stage 3** home rebuilt as a CSS hospital lobby (ceiling lights, wall, floor, plants,
  prominent character, one tagline, real buttons preserved, VaxFacts+ chip, compact mode for
  short frames). **Stage 4** maze 2.5D polish (raised walls, tiled floor + centre light, room
  plaques, glowing clinic doorways with ▾ + "✓ Visited" completed state, booster glows, hazard
  danger glow) + fixed a Stage-2 regression where facing rules overrode the player's billboard/
  scale. All verified headlessly + screenshots; no gameplay/wording/geometry changed; lint
  clean. **Next: Stage 5 — Vaccine Darts** (awaiting approval each stage). Optional: a dedicated
  responsive-landscape frame pass before continuing.
- 2026-07-25 (session 13 — Stage 5 Vaccine Darts visuals): Re-confirmed from CODE that the
  approved rule is **hit the MYTHS, protect the FACTS** (the reference image inverts this to
  "hit the facts" — IGNORED per the visual-only rule). Visual-only upgrade: darts area is now a
  hospital clinic (wall→floor + baseboard) with a **decorative dartboard** on the back wall;
  statement cards restyled as **pinned clinic cards, identical for myths & facts** (no colour
  tell before the throw); the dart is a **steel arrow that rotates to point along its flight**
  (one JS line in the shots loop); aim indicator is a dashed line + arrowhead; launcher pad
  polished with a "drag from here" pulse. Green/red result overlays still appear ONLY after a
  hit. Verified: jsdom scoring (myth=+pts, fact=−50) + identical card class; real browser shows
  cards drift in as neutral pinned cards (jsdom shows 0 cards at start only because clientWidth=0
  breaks the drift/cull math — a headless artifact, not a bug). Files: `style.css` (Stage 5
  section) + `script.js` (dart rotation line). **Stage 6 — Flu Freeze** just STARTED (checkpoint
  tag `stage6-start` + code inspection only; no visual changes yet). Next: build Stage 6.
- 2026-07-26 (session 14 — Stages 6–10, visual upgrade COMPLETE): Finished the staged
  visual pass. **Stage 6 Flu Freeze:** hospital corridor (ceiling lights + perspective floor),
  frosty floating items (identical for positive/negative — no colour tell), glowing frost slice
  trail; 3 lives + correction card preserved. **Stage 7 Hospital Sprint:** side-scroll corridor
  (scrolling walls/floor), and collectibles vs obstacles are now colour-coded (green vs caution)
  since Sprint is reflex not read-and-decide; chip box sizes kept identical so the tuned hitboxes
  stay aligned; CSS-only (no JS). **Stage 8 Memory Clinic:** clinic backdrop, SHN-blue medallion
  card backs, smoother flip, teal match glow (post-match), + a small mismatch shake (one JS
  addition); approved 6 pairs + real photos kept. **Stage 9 Responsive/a11y:** re-enabled pinch
  zoom (WCAG), aria-labels on sound + D-pad, bigger tap targets, darker slogan for contrast,
  img max-width safety; reduced-motion already covered. **Stage 10 Final QA:** removed 7 dead
  CSS blocks (old home scene), ran a 28/28 automated verification (flow, all booster effects,
  hazard, all 4 mini-game entry+return, leaderboard, 5-min timer, VaxFacts+ link, NO PII — only
  immunity* localStorage — and every approved fact/myth/explanation UNCHANGED, no errors), and
  wrote **`QA_CHECKLIST.md`** (final file structure + asset-replacement guide + regression
  checklist). Checkpoint tags per stage (stage6..stage10-start). Nothing gameplay/wording/
  geometry changed across the whole upgrade. **Remaining optional follow-ups:** landscape/
  widescreen frame (deferred — biggest visual next step), emoji→custom icons, compress the
  Memory photos, keyboard-operable Memory cards. Also still pending from before: supply the
  `assets/characters/*-hero.png` renders to show hero art on home.
- 2026-07-26 (session 15 — 2.5D character upgrade + landscape maze rebuild):
  **Character:** upgraded the CSS character toward the SHN nurse renders — male = spiky dark
  hair, female = brown BUN (was long-hair-down), stethoscope on BOTH, SHN sleeve logo + chest
  badge, rounded 2.5D gradient shading (color-mix on --skin/--hair/--scrubs), bigger eyes.
  CSS-only; customization + maze/sprint inherit it. **Maze → full landscape overview (Steps
  1–2), user chose it to match the maze reference:** on widescreen (`@media
  (min-aspect-ratio:1/1) and (min-width:760px)`) #game goes wide (~1150×700), the WHOLE maze
  shows at once (loopMaze overview branch centres world, no camera-follow; #maze-world scaled
  ~0.66), and a reference-style HUD replaces the top bar: LEFT panel (logo w/ green RUSH,
  tagline, circular portrait via #mhud-char, HEALTH/SHIELD/SPEED pips reusing Stage-1 .pips,
  FAMILY TOKENS n/3), top Mission + ★SCORE + gear, bottom legend + Tip. New JS: `pipRow`,
  `updateHudLand` (from updateHUD), `state.family` (reset in beginGame, ++ in collect for
  key==="family"), updateMission also sets #mhud-mission. **Portrait UNCHANGED** (top bar +
  camera-follow; HUD hidden by media query). 7/7 jsdom HUD checks, lint clean, no errors.
  Approved wording kept. **HONEST CAPABILITY LIMIT:** cannot generate/repro the AI render
  exactly (no image tools). Path B = user supplies art (clean `maze-bg.png` with NO
  ui/path/characters + `sprite-*.png` transparent sprites) → wrote `assets/maze/README.md`
  spec; I'll trace walls from maze-bg to align collisions. Next: Path A (Step 3 CSS polish —
  dashed path, props, bigger germs) OR Path B (wire user's assets). Still needed: landscape
  layouts for home + the 4 mini-games (work but sit in a centred column).
- 2026-07-26 (session 16 — REAL maze artwork wired in): User generated + saved a clean maze
  background (no UI/path/movers) to `assets/maze/maze-bg.png` (1586×992). Built **IMAGE MAZE
  MODE**: `USE_IMAGE_MAZE=true`; buildMaze branches to new `buildImageMaze(worldEl)` which sets
  #maze-world to `.img-mode` (background = the image, size 1586×992, NO rotateX tilt — flat),
  defines collision `walls` in image-pixel space (outer bounds + a few internal — APPROXIMATE,
  needs refinement), places the 4 clinic markers on their labelled rooms (syncs ZONES x/y so
  checkZones/entry still works), scatters boosters + 3 germs, player starts at reception
  (~360,300). loopMaze camera now centres via `world.offsetWidth/Height` (works for both the
  CSS maze and the 1586×992 image). CSS `.img-mode`: image floor, no tilt, flat (un-billboard)
  elements via `transform:none !important`, bigger pickups/germs, glowing clinic pads; landscape
  scales the world 0.53 to fit the inset play area. Result: the reference render IS the playable
  maze now — with the Stage-15 landscape HUD (left panel/mission/score/legend). Verified 6/6
  jsdom (img-mode, 4 clinics, walls, player, enter+return), lint clean, no errors. Removed a
  duplicate `maze-bg` (no-ext) file. **STILL APPROXIMATE (next = "refine"):** clinic marker
  positions, invisible wall alignment to the picture, player start, booster/germ spots — all
  just coordinate tweaks now. Sprites (germ/shield/etc.) still emoji — user's `icons.png` sheet
  needs splitting into individual TRANSPARENT PNGs (`sprite-*.png`) before use. Also pending:
  landscape layouts for home + 4 mini-games; portrait maze still camera-follow over the image.
- 2026-07-26 (session 17 — refine image-maze alignment): Overlaid a coordinate grid on
  maze-bg.png (via a canvas render) to read pixel positions, then refined `buildImageMaze`:
  the 4 clinic markers now sit ON their labelled rooms (darts 585,200 · freeze 870,195 ·
  sprint 255,460 · memory 955,375; ZONES x/y synced for entry detection), player starts at
  reception (400,250), boosters + 3 germs repositioned onto open floor. First real wall trace
  (outer bounds + ~12 internal dividers, image-pixel space). Added a `DEBUG_WALLS` flag +
  `.dbg-wall` red overlay to align collisions against the art (now set false). Honest note:
  precise wall-by-wall collision on an isometric drawing is approximate — the interactive
  positions (clinics/player/boosters) are the solid win; internal walls are loose and can be
  nudged per-spot during play. Next: playtest + nudge any wall that feels wrong; split
  `icons.png` into transparent `sprite-*.png` and swap emoji→sprites; landscape layouts for
  home + mini-games.
- 2026-07-27 (session 18 — PIXEL-MASK collision + UI cleanup + image-swap workflow): Big
  rework of how the maze collision works, plus UI polish. **UI:** removed the sound toggle +
  gear (game is muted by default — flip `muted=false` in script.js to bring the subtle
  effects back); removed only the bottom-right legend (kept the left status box + the floor
  boosters — user clarified they only meant the legend); reshaped the left landscape HUD panel
  to a skinny full-height column; widened the maze play area; hid the touch D-pad on
  widescreen (still there on phones). **NEW COLLISION SYSTEM (the big one):** replaced the
  hand-placed wall rectangles with a **pixel mask read from the artwork**. `assets/maze/
  build-collision.mjs` decodes `maze-bg.png` (manual PNG decode, no libs), classifies teal
  pixels = floor / cream+gray = wall, **dilates to widen hallways**, applies all our hand-tuned
  openings, and bakes `assets/maze/wallmask.js` (a 1-bit-per-4px mask, loaded via a `<script>`
  in index.html BEFORE script.js). In script.js: `maskBlocked`/`feetBlocked` test the mask;
  `moverPlayer` pixel-steps so the player stops FLUSH against walls; the player is verified
  reachable by a real-body flood-fill (not a point). This auto-matches the art and fixed the
  "character standing on walls" problem. **Triggers now INSIDE rooms:** Darts/Freeze use their
  natural open alcoves; Memory (1030,438) and Sprint (304,532) rooms were opened so their pads
  sit inside; hit box shrunk to 56px centred so mini-games only start once you walk in (no
  hallway triggers). **Navigation fixes:** widened the Freeze→Memory pinch hallway; carved a
  bottom corridor (Sprint → left doors → above Information → centre dead-end wall → the right
  side) so the sealed bottom-centre connects. **Character foot-collision slimmed** to ~9px so
  it fits tight hallways (raised body-reachable floor from 64%→76%). **IMAGE-SWAP WORKFLOW
  (important):** the collision is DERIVED from the picture, so to change walls the user edits
  `maze-bg.png` in place (SAME 1586×992 size + same layout, paint walls over with teal floor)
  and I just re-run `node assets/maze/build-collision.mjs` — no re-mapping. User already did
  one swap (walls painted out); added a `?v=2` cache-bust on the CSS bg url so the browser
  loads the new image. **STILL OPEN (do next):** user still gets stuck in some hallways
  (remaining pinch points) even after the footprint slim — next: slim the footprint a touch
  more and/or widen the exact stuck spots (turn `DEBUG_PROBE=true` in script.js → click the
  maze → it prints exact coords), then re-run build-collision.mjs. Saved progress at user's
  request before continuing that fix.
- 2026-07-27 (session 19 — fix "kicked back to start" + open two more stuck hallways):
  **Respawn bug (the big one):** the "it keeps putting me back to the start near Hospital
  Sprint" was the death-respawn (`hitByHazard`, health<=0) teleporting to `(100,520)` — the OLD
  CSS-maze entrance, which in the image maze is the bottom-left by Sprint — while the real start
  was elsewhere. Fixed by defining ONE `START_X=300, START_Y=230` constant (the "WELCOME TO SHN"
  reception, top-left) used by BOTH the run start (buildImageMaze) AND the respawn, so they can
  never drift apart again; respawn message now says "back to the start". Also moved the 3
  patrolling germs off the reception so you're not hit at spawn. **Two more stuck hallways
  opened** (added to `build-collision.mjs` as fixes #5/#6, so they persist on image swap):
  (5) a straight passage DOWN from the Flu Freeze hallway into the Memory room — it used to
  dead-end just above Memory (`oLine(970,320 -> 1015,405)`); (6) punched a direct east-west
  passage through the thick wall block that trapped the lower-left corridor by Hospital Sprint /
  Information (`oLine(258,760 -> 362,760)`). Also earlier this session: slimmed the character's
  foot-collision to ~9px so it fits tight hallways (raised body-reachable floor 64%->76%). All
  verified by the real-body flood: start on floor + all 4 clinics reachable, lint clean, debug
  off. User confirmed it plays great. **Workflow reminder:** to change walls, edit `maze-bg.png`
  in place (same 1586x992) and re-run `node assets/maze/build-collision.mjs` — it re-applies
  every fix (START, triggers-in-rooms, all openings) automatically. Optional polish still open:
  emoji->sprite icons; landscape layouts for home + the 4 mini-games; and the game could be made
  gentler (more health / fewer germs) if desired.
- 2026-07-27 (session 20 — Home screen from a reference image + icon-swap prep):
  **Home screen rebuilt from artwork (same approach as the maze).** User supplied a full
  home mockup at `assets/home/home-bg.png` (1536x1024) — SHN Research Institute logo,
  "Immunity Rush" title, two nurses, hospital lobby, and the 4 menu buttons + VaxFacts+ chip
  all DRAWN IN. Replaced the old CSS lobby/logo/title/character-preview home with the image as
  the background + REAL invisible clickable buttons laid over the drawn ones. New markup:
  `.home-stage` (holds `<img class="home-bg">` shown "contain") + five `.home-hit` overlay
  buttons positioned as % of the image (Start Game=startInitials, Leaderboard, Instructions,
  Customize, VaxFacts+ link). CSS appended at end of style.css; `?v=1` cache-bust on the home
  image. Made `buildCharacter`/`applyCharacter` null-safe (the Home character preview element
  is gone). NOTE: Home no longer shows the LIVE customized character — it shows the two drawn
  nurses; customization still applies to the maze player (offered to re-add a live preview if
  wanted). **Button %-positions are ESTIMATES — alignment not yet confirmed by the user; may
  need nudging** (each `.home-hit` has inline left/top/width/height %; to align precisely can
  set `DEBUG_PROBE`-style clicks or just tweak the %). VaxFacts+ = https://www.shn.ca/vaxfacts/
  new tab (unchanged; end-screen link matches). **Icon-swap prepped but DEFERRED:** user will
  replace germs + the 5 pickups (shield/speed/heart/family/star, NOT the 4 clinic-pad icons)
  with custom art delivered as ONE sprite sheet -> `assets/icons/icons.png`, which I'll slice
  and wire in (currently emojis via `data.emoji` / `textContent="🦠"`). Folder + README ready;
  waiting on the sheet. Next: confirm/nudge home button alignment; then do the icon swap.
- 2026-07-27 (session 21 — image-based PLAYER CHARACTER + Customize gallery + HUD polish):
  **Home button alignment done** (Start pad at top 55.8%). **PLAYER CHARACTER is now real
  artwork, not CSS.** User supplied `assets/characters/characters-front.png` (1024x1536,
  transparent; a 3x2 grid: WOMEN top row, MEN bottom row) + `characters-back.png` (transparent
  too, but came out a MISMATCHED 3x3 with smaller figures — DEFERRED). I sliced the front sheet
  into 6 individual transparent PNGs with a from-scratch Node PNG decode+encode:
  `woman-1/2/3.png`, `man-1/2/3.png` (auto-detected the grid via alpha row/column profiles).
  Rewrote the character system: `character = {preset}` (index into
  `CHAR_PRESETS=[woman-1,woman-2,woman-3,man-1,man-2,man-3]`); `buildCharacter(el)` now renders
  `<img class="char-img">` of the chosen preset (used by maze player, HUD portrait, Sprint
  runner, Customize preview); `applyCharacter` just re-draws it; colour customization removed.
  **Customize screen** = text buttons grouped **Female / Male**, each Character 1/2/3 (class
  `char-pick`, `data-preset`), preview updates live. Maze player **scale bumped 1.05 -> 2** (was
  too small; bottom-center origin keeps feet planted). HUD **portrait** re-anchored to the head
  (`transform-origin: top center; scale 1.8; top 4px`) so the circle frames the FACE not the
  chest. **FAMILY** HUD row changed from "n/3" text to 3 coral **pips** (`.pip.fam.full`), like
  HEALTH/SHIELD/SPEED. Dead home-slogan/hero code removed from init. **STILL TO DO:** back sheet
  needs regenerating to MATCH the front (3 across x 2 down, women top/men bottom, same size) so
  I can add turn-around when walking up (front-only + left-mirror for now); the germ+pickup icon
  swap is still pending (`assets/icons/` ready). **NEXT (starting now):** Vaccine Darts + Flu
  Freeze trigger centres drifted a bit low — nudge them further INSIDE their rooms (they're
  `IZONES` cx/cy in `buildImageMaze`, script.js).
- 2026-07-27 (session 22 — character back-views, size, Sprint tuning, clinic nudge):
  **Darts/Freeze triggers** moved up INSIDE their rooms (IZONES cy: darts 210->170, freeze
  200->165; verified still reachable). **Character BACK views done** — user re-supplied
  `characters-back.png` resized to MATCH the front (now a clean 3x2, women top / men bottom).
  Sliced it into 6 back PNGs (`woman-1-back.png`..`man-3-back.png`). `buildCharacter` now
  renders BOTH `<img class="char-img char-front">` + `<img class="char-img char-back">`;
  `characterSrc(back)` picks the file. CSS shows `.char-back` only when the maze player has
  `data-facing="back"` (walking UP, set in loopMaze ~line 1346), so the character turns around
  going up; front (mirrored for left) otherwise. Maze player **scale 2 -> 2.3** (a touch
  bigger). **Hospital Sprint tuning:** runner **scale 0.45 -> 0.6** (bigger); **jump** launch
  18->21 + gravity 0.9->0.85 (peak ~180->~259px, air ~40->49 frames = higher/longer); **duck**
  crouch box 22->15 (lower, clears the overhead hitbox ~groundY-46 by ~31px), hold 40->55
  frames (longer), visual scaleY 0.42->0.36 (crouches lower). All lint-clean, no errors.
  **STILL OPEN:** germ + pickup icon swap (`assets/icons/` ready, delivered as one sprite
  sheet -> slice like the characters). Everything else (maze, home, character front+back) is in
  good shape.
- 2026-07-27 (session 23 — Hospital Sprint rebuilt as a perspective "into-the-screen"
  runner): Replaced the old side-scroll Sprint with a 3-lane, fake-3D endless runner
  (Temple Run / Subway Surfers style) on the user's `assets/minigames/sprint-bg.png`
  corridor (FINISH = vanishing point). Same speed model + same finish progress + the
  exact SPRINT_COLLECT / SPRINT_OBSTACLES messages/scores as before. **How it works:**
  `SPR3` geometry (vpx 0.51, vpy 0.36, nearY 0.9, lanes [0.4,0.5,0.6], depth 6,
  baseSize 130) + `sprProject(stage,laneFrac,z)` returns screen x/y/scale for a point at
  depth z (1 = far at the FINISH, 0 = at the camera). `beginSprintRound` builds
  `.spr3-scene` (backdrop) + `.spr3-speed` (motion streaks) + `.spr3-vignette` + progress
  bar + `.spr3-runner` (back-facing character via `buildCharacter`, `data-facing="back"`).
  `spawnSprintObj` drops a `.spr3-obj` at z=1 in a random lane; `sprintLoop` advances
  every obj toward the camera (dz = speed*0.0018), projects + scales it, and z-orders by
  depth. **Controls (Phase 2):** ← / → (or swipe) change lane via `sprintMove(dir)`;
  Space/↑/tap = `sprintJump` (physics: vjump 21, gravity 1.4, updated in the loop);
  ↓/swipe-down = `sprintSlide` (slideT 55). Touch handled by `setupSprintTouch(stage)`.
  **Collision (Phase 4):** `resolveSprintEncounter(o)` fires when `o.z <= 0.05` (once, via
  `o.done`): different lane = safe; same-lane collect = grabbed; same-lane low obstacle
  needs a jump (`jumpOffset > 34`); same-lane overhead needs a slide — else `sprintHit`
  (−50 + warning). `sprintHit(o,stage)` now computes the burst/float position from the
  projection (old x/y/w/h coords are gone). **Polish (Phase 5):** speed streaks
  (repeating-conic-gradient from the vanishing point, animated), depth vignette, and a
  running bob on the runner — all z-indexed BELOW the objects/runner so play stays clear.
  **BUG FIXED this session:** Sprint stage rendered BLANK (timer showed but no game) —
  `.sprint3d` set `position: relative`, overriding `.mg-stage`'s `position: absolute`
  inset-anchoring (later in the file, equal specificity) so the stage collapsed to 0px
  tall. Fix: `.sprint3d` no longer sets `position`. All lint/prettier clean, node --check OK.
  **STILL OPEN (both waiting on the user):** (1) custom germ + pickup icons — deliver ONE
  sprite sheet -> `assets/icons/icons.png`, slice like the characters, swap into Sprint +
  maze; (2) the other 3 mini-games' visuals (Vaccine Darts, Flu Freeze, Memory) — same
  method as Sprint: user supplies a background image, I build the look around it
  (`darts-bg.png`, `freeze-bg.png`, `memory-bg.png`).
- 2026-07-27 (session 24 — Memory Match gets a clinic-scene backdrop + card tray):
  Added a hospital-scene background behind Memory Match and put the 12 cards on their
  own centred "tray" so the layout is deliberate at ANY screen size. **Background:**
  user supplied `assets/minigames/memory-bg.png` (a clean SHN clinic waiting-room — blue
  door, VaxFacts+ sign, shelf; the FIRST two attempts had a drawn card-board / were
  landscape, final one is the empty room). Wired into `#memory-stage` as a scrim +
  cover image + gradient fallback (cache-buster now `?v=3` — bump it whenever the image
  is replaced). **Why a tray, not aligning to the photo:** `cover` crops the image
  differently per window size, so a painted board can't stay under the cards — the tray
  decouples them. **How:** `beginMemoryRound` now builds a `.mem-board.memory-grid`
  wrapper inside the stage and appends the cards to IT (not the stage). `#memory-stage`
  is a flex box that centres the tray; `.memory-grid` is `repeat(4, 92px)` fixed-size
  columns, centred (was `repeat(4,1fr)`, which BALLOONED the cards to giant overflowing
  tiles on the wide desktop layout — that was the bug the user hit). `.mem-board` = a
  glassy rounded panel (translucent white, blur, shadow). **Also:** removed the
  `.mg-hint` line under the board ("Flip two cards • connect each action to its
  benefit" — user disliked it) and removed the `memory-grid` class from the stage in
  HTML (the tray carries it now). All lint/prettier clean, node --check OK.
  **Preview tool:** `scratchpad/preview-memory.mjs` renders the portrait cover-crop +
  scrim so we can eyeball framing without a browser. **STILL OPEN:** custom germ+pickup
  icons (`assets/icons/`, one sprite sheet -> slice); the other 2 mini-games' visuals
  (Vaccine Darts `darts-bg.png`, Flu Freeze `freeze-bg.png` — same method: user supplies
  a backdrop, I build around it); optional Memory card-back refresh to match the scene.
- 2026-07-27 (session 25 — Flu Freeze rebuilt as read-then-zap virus bubbles):
  Replaced the fruit-ninja fly-by slicing with the user's new concept: virus
  bubbles sit in fixed slots on a hospital-hallway backdrop, bob gently, and you
  laser/zap them — pop + cycle. **Design decisions (asked the user):** (1) bubbles
  look IDENTICAL (one neutral violet germ orb for facts AND misconceptions) so the
  player must READ — preserves the no-colour-tell learning rule (the mockup's
  green/purple was NOT used); (2) misconceptions are AVOIDED — left alone they fade
  and cycle out on their own (no penalty); zapping one = −1 life + the correction
  card. **How it works:** `FREEZE_SLOTS` = 6 fixed positions (fractions, upper
  hallway so they don't cover the nurse spot); `FREEZE_MAX_ONSCREEN = 4`. A 650ms
  `freezeRefill` interval fills empty slots; each bubble ages in `freezeLoop`
  (frame-count, pause-safe) and auto-expires (facts ~300–420f, misconceptions
  ~260–360f). Each bubble = outer `.freeze-bubble` (centres + pop/expire anim) +
  inner `.freeze-bubble-inner` (the orb + text + gentle `freezeFloat`, randomised
  duration/delay). Tap/click a bubble → `zapFreezeBubble`: `fireFreezeBeam` draws a
  laser from the nurse origin (0.34W, 0.9H) to the bubble, then score (fact) or
  penalty+`showFreezeCorrection` (misconception). Same content (FREEZE_POSITIVE/
  NEGATIVE/LIFE_LOST), lives, timer, correction cards. Removed the old slice funcs
  (spawnFreezeItem, freezeLoop-gravity, pointer slice handlers, sliceFreezeItem,
  freezeSliceAt, spawnSliceTrail) — no dangling refs. Updated the start popup +
  `.mg-hint`. **Backdrop:** user supplied `assets/minigames/freeze-bg.png` (clean
  hospital hallway, no bubbles/nurse baked in) wired into `#freeze-stage` as scrim +
  cover image + gradient fallback (`?v=1`; bump when replaced); the old drawn
  ceiling/floor `::before`/`::after` are now `display:none`. Old `.freeze-item`/
  `.slice-trail` CSS left in place (unused, harmless). Lint/prettier/node --check
  all clean. Preview helper: `scratchpad/preview-freeze.mjs`. **STILL OPEN:** custom
  germ+pickup icons (`assets/icons/`, one sheet -> slice, swap into Sprint + maze);
  Vaccine Darts visual (`darts-bg.png`, same method); optional Memory card-back
  refresh; optional Flu Freeze tuning (bubble size/slots, beam origin, scrim, pace).
- 2026-07-28 (session 26 — Vaccine Darts rebuilt as "capture a truth per colour" + icons sliced):
  **VACCINE DARTS fully reworked** to the user's vision on the new backdrop
  `assets/minigames/darts-bg.png` (a clinic room with a 5-colour dartboard on the
  wall; wired into `#darts-stage` as scrim+cover+fallback, `?v=1`; drawn
  `::before/::after` decorations hidden). Old drift-and-throw myth/fact game is gone.
  **New game:** one statement card rings each of the 5 board colours (green/red/
  purple/orange/blue). Read each, then **tap a card to dart it = "I claim this is
  TRUE."** A TRUE statement **locks** into that colour (dart flies from the thrower,
  ✓ badge, +pts, stays); a MYTH clears with feedback. **Every pick reshuffles all
  still-open (unlocked) sections** with new statements (`reshuffleUnlocked()`); locked
  ones stay. **Win = all 5 colours locked** (goal pill "🎯 x / 5"). 60s timer. Combos
  for consecutive locks; −25 for darting a myth. **Card placement:** projected onto
  the REAL photo board via `dartBoardGeom()` (cover-crop math) + `dartSectionPos()`
  (per-section centroid angle), clamped on-screen — verified all 5 land on their
  colours in widescreen (portrait clamps the red card in). Key funcs: `DART_SECTIONS`
  (ang per colour), `DART_IMG` (board pos in the photo: cx .514 cy .386 r .16),
  `spawnDartCard`, `dartCard`→`fireDart`→`resolveDartCard`, `refreshDartCard`,
  `pickDartStatement` (dedupe via `darts.used`). Content unchanged (DARTS_MYTHS/FACTS).
  Updated start popup, `.mg-hint`, `finishDarts` (win/lose). CSS: `.dart-card`
  (colour-tab = section via `--sec`), `.dart-card.locked` (ring + ✓), refresh flip,
  `.darts-goal` pill. jsdom smoke test: 5 cards created OK.
  **ICONS delivered + sliced (NOT yet wired):** user dropped ONE sheet
  `assets/icons/icons.png` (1536×1024, RGBA, transparent bg confirmed; a rendered
  gradient shows only in the colour channels). `assets/icons/slice-icons.mjs` decodes
  it and segments 2 row-bands by alpha column-projection (avoids the text labels),
  crops each to a padded square transparent PNG. Produced 11 icons — **top row
  (pickups):** shield, syringe, heart, family, speed; **bottom row:** germ, barrier,
  calendar, cloud, **star** (= the blue ORB — my inference for Wellness Star, confirm),
  energy (= green battery). Re-run: `node assets/icons/slice-icons.mjs`.
  **NEXT: WIRE THE ICONS IN** — replace the maze COLLECTIBLES `emoji` render + the
  maze germ 🦠 with `<img>` of these; replace Hospital Sprint `SPRINT_ICONS` inline
  SVGs with `<img>` for syringe/heart/family/star/energy + barrier/calendar/cloud.
  Map: maze shield/speed/heart/family/wellness→star; sprint syringe/heart/family/
  star/energy + barrier/calendar/cloud; germ→maze hazards. **STILL OPEN after that:**
  optional Memory card-back refresh; playtest/tune Darts (reshuffle churn) + Freeze.
- 2026-07-29 (session 27 — custom icons wired + far-right germ + VaxFacts+ link zone + LIVE share link):
  **ICONS WIRED IN.** The 11 sliced icons (assets/icons/*.png) now render in-game as
  `<img>`: **maze pickups** (COLLECTIBLES) via new `COLLECTIBLE_ICON` map (shield/speed/
  heart/family, and wellness→star.png) in the collectible render (`d.innerHTML` img,
  class `.collectible-img`); **maze germs** — both hazard render spots swapped 🦠 →
  `<img class="hazard-img" src="assets/icons/germ.png">`; **Hospital Sprint** —
  `SPRINT_ICONS` inline SVGs replaced with `<img class="spr-ico" src="assets/icons/
  {syringe,heart,family,star,energy,barrier,calendar,cloud}.png">`. CSS added:
  `.collectible-img`/`.hazard-img` (100%/contain + drop-shadow), `.spr-ico` gained
  `object-fit:contain`. Popup header icons (bigMessage) left as emoji (bigMessage only
  does textContent). Icon files use `?v=1` — bump if an icon is replaced (e.g. the blue
  orb standing in for **star** — user may swap `assets/icons/star.png` later).
  **FAR-RIGHT GERM added:** 4th patrolling hazard `{x:1185,y:400,min:340,max:560,vy:1.7}`
  in the right vertical corridor (mask-verified walkable + reachable from START).
  **VaxFacts+ WALK-IN LINK ZONE:** new `linkZones` array (global) built in buildImageMaze;
  a `.zone.link-zone` pad at the VaxFacts+ clinic (x:1290 y:865, bottom-right, verified
  reachable) — walking onto it fires `openLinkZonePopup()` → popup with "Visit VaxFacts+"
  (opens https://www.shn.ca/vaxfacts/ in a new tab via window.open) + "Back to maze".
  `checkZones` now also scans linkZones (shares zoneCooldown). Coord space in image-maze
  mode = image pixels (1586×992); mask helper at assets/maze/wallmask.js.
  **SHARE LINK LIVE:** repo is public, GitHub Pages already enabled (main/root) →
  **https://mguerrero05.github.io/ImmunityRush/** serves the game (all paths relative, so
  the /ImmunityRush/ subpath works). Auto-updates ~1–2 min after each push; latest code
  confirmed deployed. `gh` CLI is NOT installed on this machine (checked repo via the
  public GitHub API + curl). **STILL OPEN:** optional swap of the blue-orb star icon;
  optional Memory card-back refresh; playtest/tune Darts (reshuffle) + Freeze.
- 2026-07-29 (session 28 — Memory blur, lifelike pinned dart, pre-game instructions, FIX walking-on-walls):
  **MEMORY MATCH:** the "back board" (clinic backdrop) is now BLURRED. Moved the image
  off `#memory-stage`'s background onto `#memory-stage::before` (blur 8px, inset -14px +
  scale 1.06 to hide soft edges); scrim on `::after`; `.mem-board` gets `position:relative;
  z-index:2` so the tray + cards stay crisp on top. Fallback gradient stays on the stage.
  **VACCINE DARTS:** the thrown dart is now a lifelike dart (metal barrel + tip + red
  flights, `.dart` rewritten). On a correct LOCK a `.dart.dart-pinned` is appended to the
  card so it looks pinned into the board (angled). Myths just clear.
  **PRE-GAME INSTRUCTIONS:** pressing "Start Game" on home now calls `showInstructions(true)`
  → the How-to-Play screen with a "Continue" button (`#instr-continue`) → `startInitials()`.
  Menu "Instructions" button calls `showInstructions(false)` (Back only, primary). New
  `showInstructions(preGame)` toggles the Continue button + Back's primary styling.
  **WALLS FIX (the big one — "she walks on top of the walls / not in the hall"):** ROOT
  CAUSE = the collision mask classifies floor purely by TEAL colour (`isFloor` in
  build-collision.mjs), and the wall TOPS are the same teal; the old floor DILATION of r3
  (~12px) bridged the floor UP over the thin wall faces onto those teal wall-tops, so the
  game treated wall-tops as walkable and she stood on them. FIX = reduced the widening to
  r2 (~8px) so it no longer climbs onto wall-tops (verified via a walkable/blocked overlay
  render — wall-tops now blocked, floor intact). Also moved the game's `feetBlocked`
  footprint DOWN to her drawn feet (py+68..74, was py+62..68) and matched the builder's
  `feetB` to it, and reverted the maze-player scale back to 2.3 (user wants it big).
  Re-ran `node assets/maze/build-collision.mjs` → all 4 clinics + bottom route PASS,
  wallmask.js regenerated. **NOTE:** wallmask.js is a plain `<script>` (no cache-buster) —
  users must HARD-refresh (Cmd+Shift+R) to pick up a rebuilt mask. Diagnostic overlay
  scripts were temp (deleted). **STILL OPEN:** playtest the walls fix for any now-too-tight
  spots (carve if needed); optional swap of the blue-orb star icon; optional Memory
  card-back refresh; Darts reshuffle-churn + Freeze tuning.
- 2026-07-31 (session 29 — How-to-Play polish, Flu Freeze content + bigger frost bubbles, collision footprint revert):
  **HOW-TO-PLAY (pre-game) SCREEN:** rewritten copy (user-supplied) as 4 separate
  paragraphs: "Use the arrow keys or WASD to move." / "Enter mini-game zones to begin each
  challenge." / "Collect shields, hearts, speed boosts, and family tokens while avoiding flu
  obstacles." / "Make your way safely to the clinic to get your flu shot!" Made the screen
  bigger + centred: scoped CSS `#screen-instructions` (justify-content:center, title 30px,
  card font 18px/max-width 384/padding 24, paragraph spacing).
  **FLU FREEZE INSTRUCTIONS popup:** trimmed to just the 4 bullets (removed the intro line).
  **FLU FREEZE CONTENT REPLACED** (user list): FREEZE_POSITIVE now 17 TRUE facts (score 100
  each), FREEZE_NEGATIVE now 10 FALSE misconceptions (each with a written correction/feedback).
  **BUBBLES BIGGER + READABLE:** `.freeze-bubble-inner` 126 -> 168px, font 11 -> 13.5px,
  padding 20. Lifespan roughly doubled (`life` positive 560+rand200 / negative 500+rand160
  frames) and refill slowed 650 -> 950ms so statements linger long enough to read.
  **FREEZE-OFF ZAP EFFECT (matches the game name):** on zap the bubble ices over (a white-blue
  frost `::after` overlay on `.freeze-bubble-inner`), a ❄ snowflake bursts (`.zapped::before`
  snowPop), icy particles (`burst` colours -> #bfefff / #cfe8ff), then it shatters
  (`bubbleShatter`). Zap removal timeout 300 -> 520ms so the animation finishes.
  **COLLISION FOOTPRINT REVERTED:** user reported getting stuck after the r2 walls fix, so the
  game `feetBlocked` + builder `feetB` were put back to the ORIGINAL smoother footprint
  (py+62..68, was py+68..74 this session); kept the r2 (~8px) wall-widening fix. Re-ran
  `node assets/maze/build-collision.mjs` — all 4 clinics + bottom route PASS. maze-player
  stays at scale 2.3. **STILL OPEN:** playtest maze for any remaining tight/stuck spots (carve
  with oLine/oPt if found); check Freeze bubbles aren't crowded on phone widths (could drop to
  3 on screen); optional star-icon swap / Memory card-back refresh.
