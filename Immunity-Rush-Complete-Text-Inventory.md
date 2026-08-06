# Immunity Rush — Complete Text-Content Inventory

> **Purpose:** A full record of *every* piece of player-facing text in the game, quoted
> **exactly** as written in the code (spelling, punctuation, capitalization, and wording
> preserved — nothing summarized or rewritten). Each entry lists the **file and line(s)**
> where the text lives. Messages that repeat are listed **once** and cross-referenced.
> A **Flags** section and a **Completeness Checklist** appear at the end.
>
> Generated: 2026-08-05. Source files searched: `index.html`, `script.js`, `style.css`,
> plus the `assets/` art folders (see checklist). **The game itself was not modified.**
>
> **Legend:** `SJ` = `script.js`, `IH` = `index.html`. Line numbers are current as of
> generation and may shift by a few lines if the code is later edited.

---

## 1. Home screen and menus

### Title
- **"Immunity Rush"** — browser tab title. `IH:8` (`<title>`). Also the on-screen logo
  wordmark **"IMMUNITY RUSH"** is rendered as art, not code (see Flags → images-with-text).

### Home menu buttons (image buttons; text lives in `aria-label`)
- **"Start Game"** — `IH:43`
- **"Leaderboard"** — `IH:52`
- **"Instructions"** — `IH:58`
- **"Customize Character"** — `IH:64`
- **"Have vaccine questions? Visit VaxFacts+"** — `IH:72`

### Continue / big-message button
- **"Continue"** — big-message overlay button. `IH:26`

> Note: the visible labels on the home menu buttons are baked into the home artwork; the
> code carries them only as accessibility labels (above). See Flags.

---

## 2. Instructions and character customization

### How to Play screen (`IH:268–282`)
- Title: **"How to Play"** — `IH:268`
- **"Use the arrow keys or WASD to move."** — `IH:270`
- **"Enter mini-game zones to begin each challenge."** — `IH:271`
- **"Collect shields, hearts, speed boosts, and family tokens while avoiding flu obstacles."** — `IH:272–274`
- **"Make your way safely to the clinic to get your flu shot!"** — `IH:275`
- Button **"Back"** — `IH:278`
- Button **"Continue"** — `IH:279–281`

### Customize Character screen (`IH:81–113`)
- Title: **"Customize Character"** — `IH:81`
- Female row buttons: **"Character 1"**, **"Character 2"**, **"Character 3"**, **"Character 4"**, **"Character 5"** — `IH:92–96`
- Male row buttons: **"Character 1"**, **"Character 2"**, **"Character 3"**, **"Character 4"**, **"Character 5"** — `IH:102–106`
- Button **"Back"** — `IH:113`
- Confirmation toast: **"Character saved!"** — `SJ:3037`

> (The "Female" / "Male" row headings, if present, are in the artwork/CSS; the code carries
> only the numbered button labels above.)

### Initials entry screen (`IH:130–142`)
- Logo text: **"SHN"** — `IH:130`
- Title: **"Enter your initials to begin."** — `IH:131`
- Input placeholder: **"ABC"** — `IH:136`
- Slogan (default shown): **"Keep your plans. Not the flu."** — `IH:139`
- Button **"Back"** — `IH:141`
- Button **"Let's Go"** — `IH:142`
- Validation toast: **"Please enter 2–3 initials."** — `SJ:769`

---

## 3. Hospital maze

### Maze HUD (`IH:150–212`)
- **"⏱"** timer with score readout **"Score:"** — `IH:153–154`
- Button **"End Run"** — `IH:158`
- Mission banner: **"Mission: visit all 4 clinics (0/4)"** — `IH:162`
- Mini-HUD wordmark: **"IMMUNITY"** / **"RUSH"** — `IH:170`
- Mini-HUD tagline: **"Keep your plans. Not the flu."** — `IH:172`
- Mini-HUD mission: **"Mission: visit all 4 clinics"** — `IH:189`
- On-screen D-pad labels (`aria-label`): **"Move up"**, **"Move left"**, **"Move right"**, **"Move down"** — `IH:209–212` (glyphs ▲ ◀ ▶ ▼)

### Room signs (`SJ:161–171`)
- **"Pharmacy"** — `SJ:163`
- **"Reception"** — `SJ:164`
- **"Waiting Area"** — `SJ:165`
- **"Staff Lounge"** — `SJ:166`
- **"VaxFacts+ Clinic"** — `SJ:167`
- **"Sprint Corridor"** — `SJ:168`
- **"Freeze Station"** — `SJ:169`
- **"Darts Room"** — `SJ:170`
- **"Memory Clinic"** — `SJ:171`

### Mini-game zone door labels / entry names (`SJ:119–156`)
- Door label **"Sprint Corridor"** / full name **"Hospital Sprint Corridor"** — `SJ:122–123`
- Door label **"Freeze Station"** / full name **"Flu Freeze Station"** — `SJ:131–132`
- Door label **"Darts Room"** / full name **"Vaccine Darts Room"** — `SJ:140–141`
- Door label **"Memory Clinic"** / full name **"Memory Match Clinic"** — `SJ:149–150`
- VaxFacts link-zone door **"VaxFacts+"** / full name **"VaxFacts+ Clinic"** — `SJ:1190–1191`

### Zone entry pop-up (`SJ:1855–1871`)
- Title = the zone's full name (above); body = a random line from **FACTS** (§9 facts list).
- Button **"Start"** — `SJ:1860`
- Button **"Not now"** — `SJ:1868`

### Locked vault / keycard (`SJ:1724–1762`)
- **"Locked vault — find the 🔑 keycard in the maze to open it."** — `SJ:1724`
- **"Keycard found — the bonus vault is unlocked!"** — `SJ:1738`
- **"Mission complete! +500 — all clinics visited."** — `SJ:1762`

### Germ / hazard hit
- Big message: **"The flu caught up — back to the start. Keep going!"** — `SJ:1700`
- Floating hazard lines (**HAZARD_LINES**, `SJ:1710–1712`):
  - **"Flu slowed you down — stay protected out there."**
  - **"Watch out for the flu! Vaccination lowers your risk."**
  - **"The flu caught you. A flu shot helps you bounce back faster."**

### End-run confirmation pop-up (`SJ:815`)
- Title **"End your run?"**; body: **"Current score: {score}"** followed by a random
  **SLOGANS** line (see Flags → dynamic assembly).

---

## 4. Pickups, health, scoring, germs, and notifications

### Collectibles (`SJ:58–105`) — name / bonus label / message
- **"Vaccine Shield"** · bonus **"Shield Bonus"** · **"Protection starts before exposure."** — `SJ:62–66`
- **"Speed Boost"** · bonus **"Speed Bonus"** · **"Babies under 6 months are too young for their own flu shot — protection around them matters."** — `SJ:71–76`
- **"Heart"** · bonus **"Health Bonus"** · **"Protect the people waiting for you at home."** — `SJ:82–86`
- **"Family Token"** · bonus **"Family Bonus"** · **"Protect the moments waiting for you after your shift."** — `SJ:91–95`
- **"Wellness Star"** · bonus **"Wellness Bonus"** · **"Flu vaccination is especially important for older adults and pregnant people."** — `SJ:100–104`

### HUD readouts (labels)
- Maze: **"Score:"** — `IH:154`
- Sprint HUD: **"Hospital Sprint"**, **"Score:"**, **"Time:"**, **"Exit"** — `IH:221–224`
- Freeze HUD: **"Flu Freeze"**, **"Score:"**, **"Lives:"**, **"Time:"**, **"Exit"** — `IH:232–236`
- Darts HUD: **"Vaccine Darts"**, **"Score:"**, **"Time:"**, **"Exit"** — `IH:244–247`
- Memory HUD: **"Score:"**, **"Pairs:"** (`/6`), **"Moves:"**, **"Time:"**, **"Exit"** — `IH:255–259`

### Score / combo floating text
- **"+{score}"** style floaters and **"+100"** on a memory match — e.g. `SJ:2891` (`floatText("+100", …)`).
- Combo toasts: **"Combo x{n}!"** — freeze `SJ:2428`; darts combo shown inline in the
  "Locked!" title (§6).

---

## 5. Vaccine Darts

### Instructions / intro (`SJ:2503–2524`)
- Title **"Vaccine Darts"** — `SJ:2503`
- Plain intro line: **"Flu vaccine myths and facts are moving across the screen. Hit the myths without striking the facts."** — `SJ:2504`
- Start button **"Start Vaccine Darts"** — `SJ:2507`
- Re-rendered rich instructions (HTML, MYTHS red / FACTS green — `SJ:2519–2524`):
  - **"One statement rings each colour section of the dartboard. Lock a TRUE statement into every colour."**
  - **"• Tap a statement to dart it — you're saying it's TRUE."**
  - **"• A TRUE one locks into its colour. ✅"**
  - **"• A MYTH clears and a new statement appears there. 🔄"**
  - **"• Fill all five colours before time runs out. Read carefully!"**
- Start toast: **"Read each statement — dart the TRUE ones to lock every colour."** — `SJ:2565`
- Goal readout: **"🎯 {locked} / {total} truths locked"** — `SJ:2587`

### TRUE statements (DARTS_FACTS, `SJ:343–369`) — statement / feedback
- **"The flu vaccine is recommended every year."** → **"That was a fact. Flu viruses can change from season to season."**
- **"Vaccination can reduce the risk of severe flu illness."** → **"That was a fact. Vaccination can lower the risk of serious complications."**
- **"The flu vaccine cannot give you influenza."** → **"That was a fact. Flu vaccines do not cause influenza infection."**
- **"Vaccination can help protect people around you."** → **"That was a fact. Reducing your risk can also reduce exposure to others."**
- **"It is normal to have questions about vaccines."** → **"That was a fact. Reliable sources and healthcare professionals can help answer questions."**
- **"Healthy people can still get the flu."** → **"That was a fact. Anyone can become infected and spread influenza."**

### MYTH statements (DARTS_MYTHS, `SJ:315–342`) — statement / correction
- **"The flu shot gives you the flu."** → **"Myth cleared! The flu vaccine cannot cause influenza."**
- **"I'm healthy, so I don't need the flu vaccine."** → **"Myth cleared! Healthy people can still catch and spread influenza."**
- **"I had the flu before, so I'm protected forever."** → **"Myth cleared! A previous infection does not guarantee protection against this season's strains."**
- **"The flu is just a bad cold."** → **"Myth cleared! Influenza can cause serious complications and hospitalization."**
- **"One flu vaccine protects me every year."** → **"Myth cleared! Flu viruses change, so vaccination is recommended each season."**
- **"Flu vaccination is not important for healthcare workers."** → **"Myth cleared! Vaccinated healthcare workers help protect patients, coworkers, and families."**

### Result feedback overlays
- Correct dart: title **"Locked!  +{pts}"** (adds **"  ·  Combo x{n}"** at combo ≥ 2) + the fact's feedback. — `SJ:2688–2691`
- Wrong dart: floating **"Myth!"** (`SJ:2700`) + title **"That was a myth — the open sections refresh"** with the myth's correction. — `SJ:2705–2708`

### Results screen (`SJ:2760–2768`)
- Title (win): **"Every colour locked! You captured a truth in all five sections."**
- Title (time out): **"Time! You locked {locked} of {total} sections."**
- Body: **"Vaccine Darts Score: {score}"** then, on win, **"Accurate information is one more layer of protection."** / otherwise **"Read each statement and dart the true ones to fill every colour."**
- Button **"Return to Maze"** — `SJ:2768`

### Darts in-HUD hint (`IH:250`)
- **"Dart the TRUE statements to lock every colour • myths refresh"**

---

## 6. Flu Freeze

### Instructions / intro (`SJ:2246–2258`)
- Title **"Flu Freeze"** — `SJ:2248`
- Body: **"• Tap / click a virus to zap it.\n• Zap the TRUE statements for points.\n• Misconceptions cost a life — leave them and they clear on their own.\n• Read before you zap. You have 3 lives."** — `SJ:2252`
- Start button **"Start Flu Freeze"** — `SJ:2252` (button block `2251–2258`)
- Start toast: **"Read each virus — zap only the TRUE ones."** — `SJ:2290`
- In-HUD hint: **"Read each virus • zap only the TRUE ones • misconceptions cost a life"** — `IH:239`

### TRUE statements (FREEZE_POSITIVE, `SJ:238–260`, each score 100)
- **"Flu can lead to hospitalization in older adults."**
- **"Vaccination helps protect elderly family members."**
- **"Flu can worsen existing heart or lung conditions."**
- **"Flu can trigger serious complications, including pneumonia."**
- **"Vaccination can make flu illness less severe."**
- **"Healthy adults can still get influenza."**
- **"The flu shot cannot give you influenza."**
- **"Flu is not the same as a common cold."**
- **"People need a new flu shot every year."**
- **"Babies under 6 months cannot receive the flu vaccine, they need adults to."**
- **"Pregnant people can receive the flu vaccine."**
- **"Flu vaccination is recommended while breastfeeding."**
- **"People can spread flu before realizing they are sick."**
- **"Antibiotics do not treat influenza viruses."**
- **"Getting vaccinated before flu season gives protection time to build."**
- **"The vaccine can reduce serious flu-related complications."**
- **"You can get the flu even if you rarely feel sick."**

### FALSE statements (FREEZE_NEGATIVE, `SJ:262–305`) — statement / correction
- **"Older adults do not need yearly vaccination."** → **"Older adults are at higher risk from flu and are recommended to get vaccinated every season."**
- **"The flu shot can give you influenza."** → **"The flu vaccine cannot give you influenza — it does not contain live flu virus."**
- **"Flu is only dangerous for young children."** → **"Flu can be serious for everyone, especially older adults and people with health conditions."**
- **"Last year's flu shot protects you forever."** → **"Flu viruses change over time, so a new vaccine is recommended each season."**
- **"Pregnancy means you cannot get vaccinated."** → **"The flu vaccine is recommended in pregnancy and helps protect both parent and baby."**
- **"Breastfeeding means you cannot get vaccinated."** → **"The flu vaccine is safe and recommended while breastfeeding."**
- **"A strong immune system guarantees protection."** → **"Even healthy people with strong immune systems can catch and spread the flu."**
- **"No fever means you do not have the flu."** → **"Flu does not always cause a fever — you can be infected and contagious without one."**
- **"The flu is just a bad cold."** → **"Influenza is more serious than a cold and can lead to complications like pneumonia."**
- **"Vaccination only protects the person receiving it."** → **"Getting vaccinated also helps protect the people around you by reducing spread."**

### Life-lost tags (FREEZE_LIFE_LOST, `SJ:306–310`)
- **"Life lost — read each item carefully before selecting."**
- **"Life lost — these choices could increase influenza exposure."**
- **"Life lost — review the correction before continuing."**

### Correction overlay (dynamic, `SJ:2454–2459`)
- Assembled from: a random life-lost tag + the statement's `text` + its `feedback` +
  a lives line: **"No lives left"** (final) or **"Lives left: {n}"**.

### Results screen (`SJ:2477–2481`)
- Title: **"Flu Freeze complete! You protected the moments that matter."**
- Body: **"Flu Freeze Score: {score}"** then **"Stay healthy for the moments that matter."**
- Button **"Return to Maze"** — `SJ:2481`

---

## 7. Hospital Sprint

### Instructions / intro (`SJ:1951–1957`)
- Title **"Hospital Sprint"** — `SJ:1952`
- Body line 1: **"Your shift is moving fast. Move between lanes to grab boosts and dodge flu obstacles rushing toward you."** — `SJ:1953`
- Body controls: **"• ← / → (or swipe) to switch lanes.\n• Space / Up / tap to jump over low obstacles.\n• Down (or swipe down) to duck under high barriers.\n• Run into boosts to collect them. Reach the finish before time runs out."** — `SJ:1954`
- Start button **"Start Sprint"** — `SJ:1957`
- Start toast: **"Run! Keep your plans. Not the flu."** — `SJ:2028`

### Boosts / collectibles (SPRINT_COLLECT, `SJ:174–200`) — name / message
- **"Vaccine Booster"** → **"Flu vaccination is free through Ontario's publicly funded flu vaccine program."**
- **"Heart"** → **"Protect the people waiting for you at home."**
- **"Family Token"** → **"Protect the moments waiting for you after your shift."**
- **"Wellness Boost"** → **"Stay protected for the people who need extra care."**
- **"Energy Icon"** → **"Long shifts are hard enough without flu slowing you down."**

### Obstacles (SPRINT_OBSTACLES, `SJ:202–221`) — name / message
- **"Sick-Day Barrier"** → **"Sick days can interrupt more than just your shift."**
- **"Cancelled Plans"** → **"Don't let flu season cancel what matters."**
- **"Low-Energy Cloud"** → **"Low energy can take you out of the game."**

### In-run notifications
- Boost pickup big message: the boost's message, titled **"+{score}"** — `SJ:2204`
- Time-up toast: **"Time's up! Run complete."** — `SJ:888`

### Results screen (`SJ:2223–2227`)
- Title: **"Sprint complete! You stayed ahead of flu season."**
- Body: **"Hospital Sprint Score: {score}"** then **"Keep your plans. Not the flu."**
- Button **"Return to Maze"** — `SJ:2227`

---

## 8. Memory Match

### Instructions / intro (`SJ:2787–2793`)
- Title **"Memory Match"** — `SJ:2787`
- Body line 1: **"Flip two cards at a time and connect each flu prevention action with its correct benefit or outcome."** — `SJ:2788`
- Body bullets: **"• Flip two cards at a time.\n• Match each action or fact with its related benefit.\n• Correct matches stay visible; incorrect matches flip back.\n• Complete every pair to finish."** — `SJ:2788`
- Start button **"Start Memory Match"** — `SJ:2793`

### Card pairs (MEMORY_PAIRS, `SJ:376–413`) — picture alt / fact card / match message
1. Image alt **"Calendar of checkmarks beside a vaccine syringe and vial"** · fact **"Get your flu vaccine every year."** · **"Correct! Flu viruses can change, so vaccination is recommended each season."**
2. Image alt **"Pregnant person protected by a shield"** · fact **"Pregnancy raises the risk of serious flu—get protected."** · **"Correct! Flu can be more severe during pregnancy, and vaccination helps protect both you and your baby."**
3. Image alt **"Person resting in bed beside a calendar"** · fact **"Flu can cause days of illness and lingering symptoms for weeks."** · **"Correct! Influenza can keep you sick for several days, while fatigue and other symptoms may last longer."**
4. Image alt **"Two hands sheltering a family of three"** · fact **"Babies under 6 months can’t get the flu shot—your vaccination helps protect them."** · **"Correct! Babies under 6 months are too young for flu vaccination, so protection from vaccinated parents, family members, and caregivers matters."**
5. Image alt **"Older couple holding a protective shield"** · fact **"Flu can be more severe in older adults—vaccination lowers the risk."** · **"Correct! Older adults face a higher risk of serious flu complications, so vaccination matters for them and for the people around them."**
6. Image alt **"Vaccine syringe beside a protective shield with a cross"** · fact **"Get vaccinated early so your body is protected before exposure."** · **"Correct! The flu vaccine needs time to help your immune system recognize and respond to the virus, so get vaccinated before exposure."**

> The picture cards show only the artwork; the fact text and match message are on the
> partner card / pop-up, never on the picture (per code comment `SJ:372–375`).

### Educational nudges (MEMORY_MESSAGES, `SJ:415–420`)
- **"Read carefully."**
- **"Connect the action to its outcome."**
- **"Every season requires updated protection."**
- **"Protect yourself and the people around you."**

### Wrong-match messages (MEMORY_WRONG, `SJ:422–428`)
- **"Not a match. Read both cards and try again."**
- **"These two ideas are not directly connected."**
- **"Try another pair."**
- **"Look for the action that creates this benefit."**
- **"Think about how influenza is prevented or spread."**

### Match feedback overlay
- Correct match: the pair's `msg`, titled **"Match!"** — `SJ:2892–2895`

### Results screens
- Timed-out (`SJ:2921–2925`): title **"Time's up!"**; body **"You matched {n} of {total} pairs."** then **"Memory Match Score: {score}"**; button **"Return to Maze"**.
- Completed (`SJ:2941–2947`): title **"Memory Match Complete"**; body **"You successfully connected flu prevention actions with their health benefits."** then **"Annual flu vaccination can help reduce severe illness and protect patients, coworkers, family members, and the healthcare workforce."** then **"Memory Match Score: {score}"**; button **"Return to Maze"**.

---

## 9. VaxFacts Clinic and ending

### VaxFacts congrats overlay (walk-in clinic, built in JS — `SJ:1824–1834`)
- Emoji **"🎉"**
- Title **"Congratulations!"**
- Subtitle **"You made it to the VaxFacts Clinic!"**
- Body 1: **"You've completed the maze and learned how vaccines help protect you and your community. Now you're ready to take the next step: consider getting your flu shot!"** ("consider getting your flu shot!" is bold)
- Body 2: **"Have questions or want to learn more? Visit SHN VaxFacts. You can also contact them or book an appointment, and the team will help you get started."** ("SHN VaxFacts" is bold)
- Button **"Visit SHN VaxFacts"** — `SJ:1833`
- Button **"Back to maze"** — `SJ:1834`
- External link target: `https://www.shn.ca/vaxfacts/` — `SJ:1192`

### Slogans pool (SLOGANS, `SJ:22–38`) — shown across the game
- **"Keep your plans. Not the flu."** (appears twice in the list: `SJ:23` and `SJ:37`)
- **"Stay healthy for the moments that matter."**
- **"Protect what matters."**
- **"Don't miss what matters."**
- **"Flu season shouldn't decide your weekend."**
- **"Protect the people waiting for you at home."**
- **"Stay one step ahead this flu season."**
- **"The best moments happen together."**
- **"Protect your next family gathering."**
- **"Stay healthy for the moments you can't reschedule."**
- **"Protect your plans this flu season."**
- **"Keep doing what you love."**
- **"Protect the trip you've been waiting for."**
- **"A flu shot takes 5 minutes; recovering from lingering flu symptoms may be a month."**

### Facts pool (FACTS, `SJ:41–52`) — loading tips / zone pop-ups
- **"The flu vaccine is recommended every year because flu viruses can change."**
- **"The flu shot cannot give you the flu."**
- **"The flu can cause mild illness, but it can also become serious."**
- **"Vaccination can help reduce the risk of severe flu illness."**
- **"Getting vaccinated helps protect you and the people around you."**
- **"Healthcare workers can help protect patients, coworkers, and families by staying protected."**
- **"Being healthy does not mean you cannot get the flu."**
- **"Past flu infection does not guarantee protection this season."**
- **"Flu vaccination is free and available through Ontario's publicly funded flu vaccine program."**
- **"Questions are normal. VaxFacts+ offers judgement-free vaccine conversations."**

---

## 10. Leaderboard, errors, buttons, transitions, win/loss screens, and remaining text

### Leaderboard screen (`IH:289–292`)
- Title **"Leaderboard"** — `IH:289`
- Button **"Back"** — `IH:292`
- List rows render dynamically as **"{initials}"** / **"{score}"** — `SJ:2988` (no static copy)

### Run Complete / end screen (`IH:299–322`)
- Title **"Run Complete"** — `IH:300`
- **"Score:"** (with score) — `IH:301`
- Rank line: dynamic, empty by default — `IH:302`
- Default slogan shown: **"Can you beat your score?"** — `IH:303`
- Small-print card:
  - **"Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program."** — `IH:307–309`
  - **"Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision."** — `IH:311–313`
  - Link text **"www.shn.ca/vaxfacts"** — `IH:316`
- Button **"Play Again"** — `IH:321`
- Button **"Back to Home"** — `IH:322`

### End-screen dynamic rank text (`SJ:906–911`)
- **"Great effort — try again to climb the board!"** (shown when not a top score) — `SJ:906`
- The end pop-up also cycles these lines: **"Can you beat your score?"**, **"Protect what matters and climb the leaderboard."**, **"Stay healthy for the moments that matter."**, **"Keep your plans. Not the flu."** — `SJ:908–911`

### Generic pop-up scaffolding (`IH:331–332`)
- Placeholder **"Title"** — `IH:331` (replaced at runtime; see Flags → placeholder)
- Placeholder **"Text"** — `IH:332` (replaced at runtime; see Flags → placeholder)

### Toasts / notifications (full list, deduplicated)
- **"Please enter 2–3 initials."** — `SJ:769`
- **"Time's up! Run complete."** — `SJ:888`
- **"Locked vault — find the 🔑 keycard in the maze to open it."** — `SJ:1724`
- **"Keycard found — the bonus vault is unlocked!"** — `SJ:1738`
- **"Mission complete! +500 — all clinics visited."** — `SJ:1762`
- **"Run! Keep your plans. Not the flu."** — `SJ:2028`
- **"Read each virus — zap only the TRUE ones."** — `SJ:2290`
- **"Read each statement — dart the TRUE ones to lock every colour."** — `SJ:2565`
- **"Character saved!"** — `SJ:3037`
- **"Combo x{n}!"** — `SJ:2428` (freeze)

---

## Flags

### A. Duplicate or repeated wording (intentional but worth noting)
- **"Keep your plans. Not the flu."** appears many times: `SLOGANS` twice (`SJ:23`, `SJ:37`),
  initials slogan `IH:139`, mini-HUD tag `IH:172`, Sprint start toast `SJ:2028`, Sprint
  results `SJ:2224`, end-screen cycle `SJ:911`.
- **"Protect the people waiting for you at home."** appears in both the maze **Heart**
  collectible (`SJ:86`) and the Sprint **Heart** boost (`SJ:181`), and in `SLOGANS` (`SJ:28`).
- **"Protect the moments waiting for you after your shift."** — maze **Family Token**
  (`SJ:95`) and Sprint **Family Token** (`SJ:186`).
- **"Stay healthy for the moments that matter."** — `SLOGANS` (`SJ:24`), Freeze results
  (`SJ:2478`), end-screen cycle (`SJ:910`).
- **"The flu is just a bad cold."** appears as both a **Darts myth** (`SJ:330`) and a
  **Freeze misconception** (`SJ:298`), with different corrections.
- The Ontario free-program line appears in three near-identical forms — see B.

### B. Inconsistent wording (same idea, different phrasing)
- Ontario publicly-funded program, three variants:
  - **"Flu vaccination is free and available through Ontario's publicly funded flu vaccine program."** (FACTS, `SJ:50`)
  - **"Flu vaccination is free through Ontario's publicly funded flu vaccine program."** (Sprint Vaccine Booster, `SJ:179`)
  - **"Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program."** (end screen, `IH:307`) — note **"Influenza"** vs **"Flu"**.
- **"The flu shot cannot give you the flu."** (FACTS, `SJ:43`) vs **"The flu shot cannot
  give you influenza."** (Freeze, `SJ:245`) vs **"The flu vaccine cannot give you
  influenza."** (Darts, `SJ:353`) — "flu" vs "influenza", "shot" vs "vaccine".
- Punctuation style differs between banks: Memory fact cards use an em-dash with **no
  spaces** (e.g. "serious flu—get protected", `SJ:386`) while most other copy uses a
  spaced em-dash " — ". The apostrophe in Memory card 4 ("can’t", `SJ:398`) is a curly
  ’ whereas the rest of the codebase uses straight apostrophes ('). Both are intentional-
  looking but inconsistent; flagged for a reviewer.
- "colour" (British spelling) is used in Darts UI (`SJ:2519`, `IH:250`) — consistent
  within Darts, but the rest of the game avoids that word.

### C. Placeholder / unfinished text
- Generic pop-up scaffold text **"Title"** (`IH:331`) and **"Text"** (`IH:332`) — these are
  literal placeholders in the HTML, always overwritten by JS before display. Harmless, but
  they are placeholder strings by definition.
- No other TODO/placeholder/lorem text was found in player-facing strings.

### D. Text assembled dynamically from multiple variables (not a single literal)
- **End-run pop-up** (`SJ:815`): `"Current score: " + score + "\n\n" + rand(SLOGANS)`.
- **Sprint results** (`SJ:2224`): `"Hospital Sprint Score: " + score + "\n\n" + slogan`.
- **Freeze results** (`SJ:2478`): `"Flu Freeze Score: " + score + …`.
- **Darts results** (`SJ:2760–2765`): win/lose title and body chosen conditionally +
  `"Vaccine Darts Score: " + score`.
- **Memory results** (`SJ:2922`, `SJ:2944`): `"You matched {n} of {total} pairs."` and the
  completion body + `"Memory Match Score: " + score`.
- **Freeze correction overlay** (`SJ:2454–2459`): random life-lost tag + statement text +
  feedback + `"Lives left: " + n` (or "No lives left").
- **Darts "Locked!" title** (`SJ:2689`): `"Locked!  +" + pts` plus optional `"  ·  Combo x" + n`.
- **Darts goal** (`SJ:2587`) and **Memory/Sprint/Freeze HUD counters**: numbers injected
  into label templates ("truths locked", "Pairs", "Lives", "Time", etc.).
- **Leaderboard rows** (`SJ:2988`): initials + score injected per row.
- **Mission counter** (`IH:162`, updated in JS): "visit all 4 clinics (0/4)" count updates.

### E. Images that contain text not extractable from the code
These are baked into artwork under `assets/` and cannot be pulled from source strings — a
reviewer must open the images to verify their wording:
- **Home artwork** (`assets/…home…`): the **"IMMUNITY RUSH"** title wordmark, the **"SHN"**
  logo, and the visible **Start / Customize / Instructions / Leaderboard** menu button
  faces (code carries these only as `aria-label`s).
- **Maze background** (`assets/…maze…`): any room-label lettering or signage drawn into the
  art (the code also draws `ROOMS` signs on top; verify no conflicting baked-in labels).
- **Mini-game backgrounds** (`assets/…` for sprint/freeze/darts/memory): any text baked into
  the corridor/board/clinic scenes.
- **Character sprites** (`assets/…-walk.png`, standing PNGs): any **"SHN"** badge/lettering
  on the healthcare-worker uniforms.
- **Memory Match card images** (`assets/memory-match/01…–06….png`): these are illustrations;
  the code's `alt` text (§8) describes them but any text drawn inside the images is not in code.
- **QR poster** (`assets/qr/poster.html`): contains its own printable copy — review separately.

### F. Content not confidently captured
- All player-facing **string literals** in `index.html` and `script.js` were located and
  quoted. The only text NOT verifiable from code is the **baked-in image text** listed in
  Flag E — flagged rather than guessed.
- Dynamic numeric values (scores, times, lives, counts) are shown as `{…}` templates above;
  their surrounding literal wording is captured verbatim.
- `style.css` was searched for `content:` pseudo-element text — none carry player-facing
  copy (decorative only).

---

## Completeness Checklist — files searched

| File / folder | Searched | Player-facing text found |
|---|---|---|
| `index.html` | ✅ | Screen titles, menu `aria-label`s, HUD labels, How-to-Play, initials, leaderboard, end screen, pop-up scaffold |
| `script.js` | ✅ | All content arrays (SLOGANS, FACTS, COLLECTIBLES, ZONES, ROOMS, SPRINT_COLLECT/OBSTACLES, FREEZE_POSITIVE/NEGATIVE/LIFE_LOST, DARTS_MYTHS/FACTS, MEMORY_PAIRS/MESSAGES/WRONG, HAZARD_LINES), all `toast()`, `bigMessage()`, `showPopup()`, `floatText()`, and the VaxFacts congrats overlay |
| `style.css` | ✅ | Checked for `content:` text — none player-facing (decorative) |
| `assets/maze/build-collision.mjs` | ✅ | Build script — no player-facing text |
| `assets/maze/wallmask.js` | ✅ | Auto-generated data only — no text |
| `assets/` art (home, maze, mini-game backgrounds, characters, memory-match, icons) | ✅ (flagged) | Text baked into images — see Flag E; not extractable from code |
| `assets/qr/poster.html` | ✅ (flagged) | Printable poster copy — review separately |
| `README.md`, `GAME_REFERENCE.md`, `SESSION_CONTEXT.md`, `BUILD_PLAN.md`, `MILESTONE_*.md`, `GAME_SPEC.md`, `CLAUDE.md` | ✅ | Developer/design docs — **not** shown to players; excluded by design |

**Confirmed:** every relevant source file that produces player-facing text
(`index.html`, `script.js`) was searched end to end; supporting files (`style.css`, build
scripts, generated data) were checked and carry no player copy; the only text a reviewer
must still verify by eye is the wording **baked into image assets** (Flag E). **The game
code was not modified during this inventory.**
