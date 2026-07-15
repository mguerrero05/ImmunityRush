# Immunity Rush — Project Brief for a Progress Presentation

> **Purpose of this document:** a complete, plain-English snapshot of the Immunity Rush
> project — what it is, what's built, how it works, and what's next — written so it can be
> handed to an AI assistant (e.g. ChatGPT) or a teammate to build an informative slideshow.
> Everything here is accurate as of **14 July 2026**.
>
> A ready-to-paste "make me a slideshow" prompt is at the very bottom.

---

## 1. One-line summary (the elevator pitch)

**Immunity Rush** is a friendly, hospital-themed arcade maze game that makes flu-season and
vaccination messaging fun and memorable. Players guide a healthcare-worker character through
a hospital maze, complete four mini-games about flu myths and facts, and collect boosts —
learning real vaccination information through play instead of a quiz.

**Tagline used in the game:** *"Keep your plans. Not the flu."*

---

## 2. Why this project exists (purpose & audience)

- **Goal:** turn flu-season / immunity awareness into something engaging and memorable
  through a game, rather than posters or pamphlets.
- **Audience:** hospital staff and the public engaging with flu-season awareness.
- **Context:** a summer project for a hospital, using the **"SHN"** branding.
- **Educational angle:** every mini-game teaches accurate, bite-sized flu/vaccine facts,
  with wording taken from an approved content spec — never fear-based, always friendly.

---

## 3. What the game is (concept, theme, tone)

- **Genre:** arcade / maze game with mini-challenges (deliberately **not** a plain quiz).
- **Theme:** a hospital during flu season — staying healthy, protecting patients and family.
- **Tone:** friendly and playful, not clinical or intimidating.
- **Look:** designed like a **phone screen** (a "phone frame" layout) so it feels like a
  mobile app, and works on any device in a web browser.
- **Branding:** the SHN logo and hospital styling throughout.

---

## 4. Platform & technology (kept deliberately simple)

- **Runs in a web browser** — any device, no download or install needed.
- **Built with plain HTML, CSS, and JavaScript** — no heavy frameworks. This keeps it
  simple, free to run, and easy to maintain.
- **Self-contained assets:** graphics are a mix of hand-built CSS/SVG art, emoji
  placeholders (being replaced), and real PNG images for the Memory Match game. Sound
  effects are generated in-browser (no audio files, nothing paid).
- **Developer tooling:** a local live-reload dev server, plus automatic code formatting
  (Prettier) and linting (ESLint) for tidy, consistent code.
- **Three core files:** `index.html` (structure), `style.css` (looks), `script.js` (all
  the game logic).

---

## 5. How the game is structured (the screens)

1. **Home screen** — hospital title, SHN logo, tagline, and menu (Start / Leaderboard /
   Instructions). Rotating flu-awareness slogans.
2. **Customize Character** — pick the healthcare-worker character's look (gender, skin tone,
   hair colour, eyes, scrubs).
3. **Instructions** — how to play.
4. **The Maze** — the main gameplay hub (details below).
5. **Four mini-games** — launched from clinic zones inside the maze (details below).
6. **Leaderboard** — top scores saved on the device.
7. **End screen** — run summary, final score, and a closing vaccination message.

---

## 6. The main maze (the hub of the game)

- **Layout:** a **5-lane serpentine** hospital corridor the player weaves through, with
  nooks and dead-ends that hide collectibles.
- **The character:** a friendly, custom-built healthcare worker in blue scrubs with a
  continuous walking animation.
- **Collectibles / power-ups (~14 scattered):** Vaccine Shield (absorbs one hazard hit),
  Speed Boost, Heart (restores health), Family Token, and Wellness Star — each gives points
  and a short educational message.
- **Flu hazards:** five flu "germs" patrol the lanes. Touching one costs health and points,
  unless your shield is up. If health hits zero, you respawn at the entrance and the run
  continues.
- **Mission:** *visit all four clinics* (a +500 bonus) — this gives the run a clear goal.
- **Locked bonus vault:** a hidden **keycard** unlocks a vault of bonus rewards.
- **Run timer:** the whole run lasts **5 minutes**, shown in the HUD. Mini-games don't end
  the run — only the timer (or quitting) does.

---

## 7. The four mini-games (the interactive learning core)

Each mini-game opens with an instructions screen, plays for about 60 seconds, then returns
the player to the maze with a score. All four use **approved, exact educational wording**.

1. **Vaccine Darts** — flu **myths** and **facts** drift across the screen on identical
   cards. The player **drags and releases** to throw a dart, aiming to hit the *myths* and
   avoid the *facts*. After each hit, a large result message appears: **green for a correct
   hit, red for an incorrect one**, with an explanation.

2. **Flu Freeze** — positive "things worth protecting" and flu disruptions fly by; the
   player **swipes to slice** the positive items and avoid the flu ones. Three lives; a
   large correction card appears on a wrong slice.

3. **Hospital Sprint** — an endless-runner down a hospital corridor. The player **jumps**
   over obstacles and **ducks/slides** under overhead ones, collecting boosts and avoiding
   flu obstacles, racing a progress bar to the finish.

4. **Memory Match** — a **6-pair / 12-card** matching game. Each pair is one **photo card**
   (a real illustration, e.g. a pregnant person, older adults, a family) and one **fact
   card**. Matching them correctly reveals a short educational explanation.

---

## 8. The educational design rules (what makes it teach well)

These principles are applied consistently across the whole game:

- **No "answer-revealing" colours before the player chooses.** Myth/fact cards, positive/
  negative items, and unmatched memory cards all look identical, so the player must actually
  *read and think*. Green/red only appears **after** an answer, as feedback.
- **Exact, approved wording** for every fact, myth, and message (from a content spec).
- **Friendly, not scary** — messages encourage protection rather than fear.
- **Large, hard-to-miss feedback** — important messages (boosts, corrections, facts, hits)
  now appear as a big centered overlay that briefly pauses the game so they're easy to read,
  then always releases so play continues smoothly.

---

## 9. Current state — what's DONE ✅

The project has progressed through a planned roadmap of milestones (A–I). Completed so far:

- **Milestone A — Foundation:** full game code set up in a version-controlled project.
- **Milestone B — Content upgrades:** all educational messages, slogans, facts, and myths
  written to the approved spec.
- **Milestone C — Game-feel toolkit:** reusable feedback systems (floating score popups,
  sound effects with a mute toggle, particle bursts, screen shake).
- **Milestone D — Hospital theming:** the maze looks like a hospital (rooms, signs, floor).
- **Milestone E — Maze difficulty:** the serpentine layout, patrolling hazards, the
  "visit 4 clinics" mission, and the locked vault + keycard.
- **Milestone F — All four mini-games rebuilt** to the approved spec with proper controls
  (drag darts, swipe freeze, jump/slide runner, photo-based memory match).
- **Character & customization** and **5-minute run timer** are in place.

### Recent work (latest sessions)

- **Real photo cards in Memory Match** — replaced placeholder text with six finalized
  illustrations, rebuilt to 6 pairs / 12 cards with an educational explanation per match.
- **Fixed a serious freeze bug** — previously, being knocked into a wall by a flu germ could
  trap the player permanently ("redo the game"). The movement/collision logic was fixed at
  the root so the player can never get stuck inside a wall.
- **Added large, full-screen feedback messages** across the maze and mini-games so important
  information is impossible to miss, and can never freeze the game.
- **Made Hospital Sprint fairer** — a correctly-timed jump/duck now reliably clears obstacles
  (the hitboxes were tightened to match the visible art).
- **Added green/red result feedback to Vaccine Darts** and coloured "MYTHS/FACTS" on its
  instruction screen.

---

## 10. How we're moving forward — what's LEFT to do 🔜

Roughly in priority order:

### Finish the visual polish (Milestone G — "art pass")
- Replace the remaining **emoji placeholders** (maze collectibles, flu hazards, keycard,
  door) with consistent custom icons — matching the polished style already used elsewhere.
- Add **"completed" states** for the four clinics (visual confirmation once visited).

### Sound & atmosphere
- Add background music and richer sound effects to make it feel more alive.

### Mobile & accessibility polish
- Verify and refine the experience on phones and tablets (touch controls, layout).
- Accessibility improvements for readability and control.

### Final flow & "victory moments" (Milestone H)
- A complete, celebratory **end screen** (run complete, final score, leaderboard rank,
  closing vaccination info + link), and smooth transitions/animations throughout.

### Testing & real users (Milestone I)
- A full end-to-end testing pass (movement, collisions, all mini-games, scoring, mobile).
- **Test with real users** and gather feedback.

### Sharing / deployment
- Publish a **public playable link** (via GitHub Pages) so the hospital team and supervisor
  can play it on their own devices without installing anything.

---

## 11. What still needs improvement (known limitations, stated honestly)

- Some game art is still **emoji placeholders** (functional, but not final visuals).
- **No sound/music yet** beyond simple effects.
- **Mobile/touch** works but hasn't been fully polished and tested across devices.
- **No real-user testing** has happened yet.
- The **end screen / victory flow** is functional but not yet fully celebratory.
- Not yet **publicly deployed** (currently private; sharing link is a next step).

---

## 12. How the project is built & kept safe (a good process story for slides)

- **Version control (Git + GitHub):** every working session is saved to a private GitHub
  repository, so the full project history is preserved in the cloud.
- **Automatic backups:** an end-of-session routine (nicknamed *"Termino"*) saves the notes,
  pushes to GitHub, **and** drops a dated ZIP backup on the Desktop — so the project is
  saved in multiple places, never just one machine.
- **Clean, documented code:** planning documents (roadmap, game spec, mini-game spec) and a
  rolling session log keep the project organized and easy to pick back up.
- **Built incrementally:** one improvement at a time, tested after each change — a steady,
  low-risk approach rather than a risky big-bang rebuild.

---

## 13. Suggested slide outline (hand this structure to ChatGPT)

1. **Title** — Immunity Rush + tagline "Keep your plans. Not the flu." + your name/role.
2. **The problem** — flu-season messaging is easy to ignore; posters don't stick.
3. **The idea** — a fun hospital arcade game that teaches vaccine facts through play.
4. **Who it's for** — hospital staff & the public; SHN branding.
5. **How it works** — the maze hub + four mini-games (one line each).
6. **Live look** — screenshots of the maze and each mini-game.
7. **The four mini-games** — one slide each, or a single overview slide.
8. **What makes it teach well** — no colour tells, approved wording, friendly tone.
9. **Progress so far** — milestones A–F done; recent fixes & photo cards.
10. **What's next** — art pass, sound, mobile, end screen, testing, public link.
11. **Still to improve** — the honest limitations list.
12. **How it's built & backed up** — Git/GitHub, incremental process (shows rigor).
13. **Timeline / next steps** — what you'll do before the next check-in.
14. **Close / demo** — invite them to play the link (or a live demo).

---

## 14. Quick facts sheet (for fast reference on slides)

- **Name:** Immunity Rush
- **Type:** hospital-themed arcade maze game with 4 educational mini-games
- **Tagline:** "Keep your plans. Not the flu."
- **Audience:** hospital staff & public (SHN branding)
- **Platform:** any web browser, phone-style layout, no install
- **Tech:** plain HTML / CSS / JavaScript (simple, free to run)
- **Mini-games:** Vaccine Darts, Flu Freeze, Hospital Sprint, Memory Match
- **Run length:** 5-minute timed run; mini-games ~60s each
- **Status:** core game fully playable; polish, sound, mobile, testing, and public
  deployment still to come
- **Backed up:** private GitHub repo + dated Desktop ZIPs

---

## 15. Ready-to-paste prompt for ChatGPT

> I'm creating a progress presentation about a project called **Immunity Rush**, a
> hospital-themed educational arcade game. I'll paste a detailed brief below. Please turn it
> into a clear, informative slideshow for a supervisor. Use about 12–14 slides. For each
> slide, give me: a short title, 3–5 concise bullet points, and a one-line suggestion for a
> visual or screenshot. Keep the tone professional but approachable. Make sure to cover:
> what the game is and why it matters, how it works (the maze + four mini-games), what's been
> completed, what's planned next, what still needs improvement, and how the project is built
> and backed up. End with a "next steps" slide. Here is the brief:
>
> [paste the contents of this document here]

---

*Prepared 14 July 2026. For the most current details, see `SESSION_CONTEXT.md` (rolling
progress log), `BUILD_PLAN.md` (full roadmap), `GAME_SPEC.md` (design), and `MILESTONE_F.md`
(mini-game content spec) in this project.*
