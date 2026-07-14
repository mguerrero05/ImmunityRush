# Milestone F — Mini-Game Rebuild Spec

> Source: "Immunity Rush – Milestone F Mini-Game Rebuild Plan" PDF (shared 2026-07-13).
> Use the EXACT wording below in the mini-games. Build order: **Vaccine Darts →
> Flu Freeze → Hospital Sprint → Memory Match**, one at a time, test each before moving on.

## Global rules (apply to every mini-game)

- **No answer-revealing colour coding.** Do NOT colour myths/negative red and
  facts/positive green (or gold=good, dark=bad). Use the SAME palette/style for both
  categories. The player must decide by READING the wording, not the colour.
- **Educational, not slogans.** Keep on-item labels short. Show longer explanations
  only after: a wrong selection, a correct educational match, mini-game completion, or
  collecting an important learning item. Reduce vague motivational phrases.
- **Game feel:** floating score pop-ups, hit reactions, particles, sound, combo
  indicators, timers/progress, clear "what happened" feedback. (We already have a
  toolkit: floatText/playSound/burst/shake.)
- **Return to Maze** button ends each mini-game; the run continues (5-min run timer).
- Mini-games run a ~60s timed round (already wired).

## Shared completion messages (show one before Return to Maze)

- Vaccine Darts: "Vaccine Darts complete! You cleared the myths and protected the facts."
- Flu Freeze: "Flu Freeze complete! You identified choices that can prevent influenza from spreading."
- Hospital Sprint: "Hospital Sprint complete! You avoided flu risks and collected protective actions."
- Memory Match: "Memory Match complete! You connected flu prevention actions with their benefits."

---

## 1) Vaccine Darts  (BUILD FIRST)

**Entry pop-up:** "Vaccine Darts unlocked! Hit the myths, avoid the facts, and clear the misinformation." — button **Start Vaccine Darts**
**Opening title:** Vaccine Darts
**Opening message:** "Flu vaccine myths and facts are moving across the screen. Hit the myths without striking the facts."
**Instructions:** Hit statements that are myths. / Avoid statements that are true. / Correct hits earn points. / Hitting a fact removes points. / Read carefully before you shoot.
**Optional start messages:** Aim for the myths. / Read before you shoot. / Clear the misinformation. / Protect the facts.

**Mechanics (final requirements #6):** drag-and-release aiming, visible aiming line,
moving target boards, dart-throwing animation, simple projectile motion, hit reactions,
target movement patterns, increasing difficulty, timed round, combo scoring for
consecutive correct hits. Neutral colours for BOTH myths and facts.

**Scoring:** myth hit **+100** ("+100 Myth Cleared"); fact hit **−50**; combo bonus for
consecutive correct myth hits.

**Myths to HIT** (statement → correct-hit feedback, +100 each):
1. "The flu shot gives you the flu." → "Myth cleared! The flu vaccine cannot cause influenza."
2. "I'm healthy, so I don't need the flu vaccine." → "Myth cleared! Healthy people can still catch and spread influenza."
3. "I had the flu before, so I'm protected forever." → "Myth cleared! A previous infection does not guarantee protection against this season's strains."
4. "The flu is just a bad cold." → "Myth cleared! Influenza can cause serious complications and hospitalization."
5. "One flu vaccine protects me every year." → "Myth cleared! Flu viruses change, so vaccination is recommended each season."
6. "Flu vaccination is not important for healthcare workers." → "Myth cleared! Vaccinated healthcare workers help protect patients, coworkers, and families."

**Facts to AVOID** (statement → mistake feedback, −50 each; no text unless hit by mistake):
1. "The flu vaccine is recommended every year." → "That was a fact. Flu viruses can change from season to season."
2. "Vaccination can reduce the risk of severe flu illness." → "That was a fact. Vaccination can lower the risk of serious complications."
3. "The flu vaccine cannot give you influenza." → "That was a fact. Flu vaccines do not cause influenza infection."
4. "Vaccination can help protect people around you." → "That was a fact. Reducing your risk can also reduce exposure to others."
5. "It is normal to have questions about vaccines." → "That was a fact. Reliable sources and healthcare professionals can help answer questions."
6. "Healthy people can still get the flu." → "That was a fact. Anyone can become infected and spread influenza."

**End screen:** "Vaccine Darts complete! You cleared the myths and protected the facts." /
"Vaccine Darts Score: [score]" / closing: "Accurate information is one more layer of
protection." / button **Return to Maze**.

---

## 2) Flu Freeze  (swipe-to-slice)

**Entry pop-up:** "Flu Freeze unlocked. Tap the positive moments and avoid flu disruptions." — button **Start Flu Freeze**
**Opening title:** Flu Freeze
**Opening message:** "Positive moments are flying by. Tap the things worth protecting and avoid flu disruptions before they take away your lives."
**Instructions:** Click or tap positive items. / Avoid flu-related items. / You have 3 lives. / Bonus gold items are worth extra points. (Mechanics #7: mouse-drag/touch-swipe slicing, slicing trail, slice animations, particles, combo, missed-item tracking, increasing speed, multiple directions. Neutral colours.)

**Positive items to slice** (score): Flu Vaccine +150 · Patient Protection +150 ·
Protected Shift +100 · Family Protection +125 · Annual Vaccination +125 · Lower Risk of
Severe Illness +150.
**Bonus gold items:** High-Risk Patient Protected +300 · Outbreak Prevented +300 ·
Vaccinated Before Flu Season +250. (Gold = extra points, but per no-colour rule don't
make gold the only "good" signal.)
**Negative items to avoid** (slicing one = lose a life + wrong-selection feedback):
- Going to Work With Flu Symptoms → "Stay home when you are sick. Working while symptomatic can expose patients and coworkers."
- Skipping This Year's Vaccine → "Flu viruses change over time, so vaccination is recommended every flu season."
- Treating Flu With Antibiotics → "Antibiotics treat bacterial infections. They do not treat influenza, which is caused by a virus."
- Visiting Vulnerable Patients While Sick → "Influenza can cause serious complications in older adults and people with underlying conditions."
- Ignoring Early Symptoms → "Flu symptoms can begin suddenly. Recognizing them early helps reduce further exposure."
- Sharing Personal Equipment → "Shared equipment can carry germs. Clean and disinfect it between users."
- Assuming Mild Symptoms Are Not Contagious → "A person may spread influenza before symptoms become severe or obvious."
- Attending a Family Event While Sick → "Staying home while sick helps prevent spreading influenza to family and friends."
**Life-lost lines:** "Life lost — read each item carefully before selecting." / "Life lost — these choices could increase influenza exposure." / "Life lost — review the correction before continuing."
**End screen:** "Flu Freeze complete! You protected the moments that matter." / "Flu Freeze Score: [score]" / "Stay healthy for the moments that matter." / **Return to Maze**.

---

## 3) Hospital Sprint  (lane runner)

**Entry pop-up:** "Hospital Sprint unlocked. Run the corridor, collect boosts, and stay ahead of flu season." — button **Start Hospital Sprint**
**Opening title:** Hospital Sprint
**Opening message:** "Your shift is moving fast. Jump over flu obstacles, collect boosts, and keep your plans on track before time runs out."
**Instructions:** Tap, click, or press Space to jump. / Avoid flu obstacles and cancelled-plan barriers. / Collect vaccine boosters, hearts, family tokens, wellness boosts, and energy icons. / Reach the finish before time runs out. — button **Start Sprint**
(Mechanics #8: lanes, jumping, sliding/ducking, scrolling corridor, moving background,
obstacles, increasing speed, distance/progress tracking, responsive collision feedback.)

**Collect** (message / score): Vaccine Booster — "Flu vaccination is free through Ontario's
publicly funded flu vaccine program." +100 · Heart — "Protect the people waiting for you
at home." +50 · Family Token — "Protect the moments waiting for you after your shift."
+200 · Wellness Boost — "Stay protected for the people who need extra care." +100 · Energy
Icon — "Long shifts are hard enough without flu slowing you down." +75.
**Obstacles** (hit message): Sick-Day Barrier — "Sick days can interrupt more than just
your shift." · Cancelled Plans — "Don't let flu season cancel what matters." · Low-Energy
Cloud — "Low energy can take you out of the game."
**End screen:** "Sprint complete! You stayed ahead of flu season." / "Hospital Sprint Score:
[score]" / "Keep your plans. Not the flu." / **Return to Maze**.

---

## 4) Memory Match  (16 cards, 8 pairs)

**Entry pop-up:** "Memory Match Unlocked. Match each flu prevention action with the benefit it provides." — button **Start Memory Match**
**Opening title:** Memory Match
**Opening message:** "Flip two cards at a time and connect each flu prevention action with its correct benefit or outcome."
**Instructions:** Flip two cards at a time. / Match each action or fact with its related benefit. / Correct matches remain visible. / Incorrect matches flip back over. / Complete every pair to finish the game.
**Rules:** 16 cards / 8 unique pairs; shuffle each round; matching cards not placed
adjacent by default; correct match stays face-up + educational feedback + points; wrong
match shows a short mistake message then flips back (no auto point loss). Small
illustrations allowed but must NOT reveal the correct pair. Neutral card colours.

**Pairs (A ↔ B → match feedback):**
1. Annual Flu Vaccination ↔ Updated Seasonal Protection → "Correct. Flu viruses can change, so vaccination is recommended each season."
2. Vaccinated Healthcare Worker ↔ Patient Protection → "Correct. Vaccination can help reduce the risk of spreading influenza to vulnerable patients."
3. Reduced Flu Risk ↔ Fewer Missed Shifts → "Correct. Preventing flu illness can reduce absences from work."
4. Vaccination Before Exposure ↔ Immune Preparation → "Correct. Vaccination prepares the immune system to recognize the virus before exposure."
5. Lower Risk of Severe Illness ↔ Flu Vaccination → "Correct. Vaccination can reduce the risk of serious influenza complications."
6. Staying Home When Sick ↔ Reduced Workplace Spread → "Correct. Staying home while symptomatic helps protect patients and coworkers."
7. Protecting Yourself ↔ Protecting Family Members → "Correct. Reducing your own risk can also reduce exposure for people at home."
8. Reliable Vaccine Information ↔ Informed Decision-Making → "Correct. Trusted sources and healthcare professionals can help answer vaccine questions."
**Scoring:** correct match +100; complete all pairs +300; optional speed bonus.
**Wrong-match lines:** "Not a match. Read both cards and try again." / "These two ideas are not directly connected." / "Try another pair." / "Look for the action that creates this benefit." / "Think about how influenza is prevented or spread."
**End screen:** title "Memory Match Complete" / "You successfully connected flu prevention
actions with their health benefits." / educational summary: "Annual flu vaccination can
help reduce severe illness and protect patients, coworkers, family members, and the
healthcare workforce." / "Memory Match Score: [score]" / **Return to Maze**.

---

## Also in the PDF (for later milestones, not F mini-games)

- End screen / leaderboard exact text, home rotating messages, short-fact list, and the
  15-section "Final Gameplay and Visual Improvement Requirements" (hospital-detailed maze,
  custom icons to replace emoji, per-room completed/unlocked visual states, background
  music, mobile/accessibility). These map to Milestones G/H and a maze polish pass.
