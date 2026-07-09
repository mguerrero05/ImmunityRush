# Immunity Rush — Game Spec

> This is our reference for what to build, taken from the "Immunity Rush Claude
> Context Packet" (July 2026). It captures the game design, content banks, and
> tone rules so we never have to re-read the PDF. Build details live here;
> project status and session notes live in CLAUDE.md.

## 1. What we're building

A browser-based, mobile-style **arcade game for healthcare workers** that
encourages influenza vaccination. It should feel like a real game first, an
educational tool second. The player controls a healthcare worker in blue scrubs,
explores a hospital maze, collects boosters, plays mini-games, earns points, and
sees short positive vaccine messages during play.

- **Audience:** healthcare workers — language and visuals should feel personal,
  relatable, respectful.
- **Behaviour goal:** encourage flu vaccination by connecting it to the worker's
  own health, plans, patients, coworkers, family, and important moments.
- **Format:** plain `index.html`, `style.css`, `script.js`. No frameworks,
  backend, databases, or paid tools/libraries. Playable locally in a browser.
- **Layout:** mobile-friendly, phone-frame look. Keyboard controls are fine for v1.

## 2. Tone & messaging rules

Friendly, positive, motivating, personally relevant. Short messages during play,
not long paragraphs. Not a school quiz or medical training module. Supportive
around vaccine questions (questions are normal, judgement-free support exists).

**Do NOT use wording like:** "You are putting people at risk." / "You must get
vaccinated." / "Flu can kill." / "You are irresponsible if you don't get
vaccinated." / anything scary, shaming, or threatening.

**DO use wording like:** "Keep your plans. Not the flu." / "Stay healthy for the
moments that matter." / "Protect what matters." / "Don't miss what matters." /
"Flu season shouldn't decide your weekend."

## 3. Visual style & branding

- **Colours:** hospital blue, white, light grey, soft teal/aqua accents.
- **Setting:** SHN-inspired hospital — friendly and bright, not dark/clinical.
- **Logo:** temporary "SHN" text badge for now; leave a clear spot to swap in the
  real logo file later.
- **Look:** polished-but-simple mobile arcade — rounded buttons, clear icons,
  readable text, cheerful animations.
- **Art:** CSS shapes / simple icons at first; make everything easy to replace.

## 4. Main character

Simple 3D-style/cartoon healthcare worker in **blue scrubs** with an **SHN badge**
on the uniform. Appears on the home screen in front of the hospital, and is the
playable character in the maze/mini-games. Friendly, confident, approachable.
CSS placeholders are fine but it should clearly read as a scrubs-wearing worker.

**Customization options:** male/female, hair colour, hair style, skin tone, eye
colour, scrub colour (SHN-inspired). Live preview if possible; dropdowns/buttons
are acceptable for v1.

## 5. Screens & flow

Home → Initials Entry → (Customize Character / Instructions) → Maze Hub →
Mini-Games → Leaderboard → End Screen.

| Screen                  | Purpose           | Required elements                                                                                                                                                                                          |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**                | Entry point       | Title "Immunity Rush"; subtitle "Navigate the maze. Complete challenges. Stay ahead of flu season."; buttons: Start Game, Leaderboard, Instructions, Customize Character; hospital background + character. |
| **Initials**            | Leaderboard setup | Ask for 2–3 initials; save for local score tracking.                                                                                                                                                       |
| **Customize Character** | Personalization   | Gender, hair, skin tone, eyes, scrub colour; live preview if possible.                                                                                                                                     |
| **Instructions**        | Explain gameplay  | Move through maze, collect boosts, enter mini-games, avoid flu/cancelled-plan obstacles, climb leaderboard.                                                                                                |
| **Maze Hub**            | Main map          | Angled top-down hospital maze: walls, rooms, collectibles, 4 mini-game zones, directional icons.                                                                                                           |
| **Mini-Games**          | Short challenges  | Hospital Sprint, Flu Freeze, Vaccine Darts, Memory Match.                                                                                                                                                  |
| **Leaderboard**         | Competition       | Top 10 local scores via localStorage.                                                                                                                                                                      |
| **End Screen**          | Wrap-up           | Final score, ranking, Play Again, Home, short vaccine message, VaxFacts+ link.                                                                                                                             |

**Start Game transition:** on click, character starts moving and the view "zooms
out" from home into an angled top-down maze. Use CSS transforms/scaling/animation
— true 3D not required for v1.

## 6. Maze hub

Hospital-themed maze as the main hub: hallways, rooms/zones, walls/barriers,
collectibles, and 4 mini-game entrances. Move with **arrow keys and WASD**. Add
mini direction icons around the screen edge showing where each mini-game is. Each
mini-game zone has its own colour/icon theme and a label. Reaching a zone shows a
pop-up with the mini-game name + a Start button.

## 7. Collectibles

> Updated to the Phase 5 brief (implemented in B1). Points and messages below match `script.js`.

| Collectible        | Points | Effect               | Message                                                                                        |
| ------------------ | ------ | -------------------- | ---------------------------------------------------------------------------------------------- |
| **Vaccine Shield** | +100   | Temporary protection | "Protection starts before exposure."                                                           |
| **Speed Boost**    | +100   | Faster movement 5s   | "Babies under 6 months are too young for their own flu shot — protection around them matters." |
| **Heart**          | +50    | Health restore       | "Protect the people waiting for you at home."                                                  |
| **Family Token**   | +200   | Large score bonus    | "Protect the moments waiting for you after your shift."                                        |
| **Wellness Star**  | +100   | Score bonus          | "Flu vaccination is especially important for older adults and pregnant people."                |

## 8. Mini-Game 1 — Hospital Sprint

- **Inspiration:** Geometry Dash / Temple Run.
- **Gameplay:** worker auto-runs a hospital corridor; jump obstacles, collect
  positives. ~30 seconds / short course.
- **Controls:** spacebar or tap/click to jump.
- **Collect:** vaccine boosters, hearts, family tokens, wellness boosts, energy icons.
- **Avoid:** flu virus particles, sick-day barriers, cancelled plans, workplace
  disruptions, low-energy clouds.
- **Messages:** "Keep moving. Keep your plans." / "Protect what matters." / "Stay
  healthy for the moments that count." / "Your health protects more than just
  you." / "One choice can make a difference."

## 9. Mini-Game 2 — Flu Freeze

- **Inspiration:** Fruit Ninja.
- **Gameplay:** items fly/appear; click positive items, avoid negative ones.
- **Lives:** 3. Clicking a negative item costs a life.
- **Scoring:** positives add score; bonus gold items add extra.
- **Positive items (click):** Vaccine Shield, Family Dinner, Vacation Day, Wellness
  Icon, Energy Boost, Happy Kids, Holiday Gathering, Healthy Weekend, Work Shift
  Completed, Birthday Party.
- **Negative items (avoid):** Flu Virus, Sick Day, Cancelled Plans, Missed Shift,
  Missed Family Dinner, Low Energy, Weekend Cancelled, Missed Vacation.
- **Messages:** "Protect your plans." / "Stay healthy for this moment." / "Don't
  miss what matters." / "Keep your weekend." / "Be there for the people who count."

## 10. Mini-Game 3 — Vaccine Darts

- **Inspiration:** carnival dart / target practice.
- **Gameplay:** statements move across the screen; **hit myths**, **avoid facts**.
- **Scoring:** hit myths for points; hitting a fact reduces score or shows a correction.
- **Start messages:** "Protect yourself with facts." / "Stay informed. Stay protected."

**Myths to hit:**

- The flu shot gives you the flu.
- I'm healthy, so I don't need it.
- I had the flu before, so I'm protected forever.
- The flu is just a bad cold.
- I got vaccinated once, so I'm protected every year.
- Flu vaccines do not matter for healthcare workers.

**Facts to avoid:**

- The flu vaccine is recommended every year.
- Vaccination can reduce the risk of severe illness.
- The flu shot cannot give you the flu.
- Getting vaccinated helps protect people around you.
- Questions about vaccines are normal.
- Being healthy does not mean you cannot get the flu.

**Friendly correction messages (when a fact is hit):**

- That one was a fact — annual vaccination matters because flu viruses can change.
- That was true — the flu shot cannot give you the flu.
- That was a fact — vaccination can help reduce severe illness.
- That was true — getting vaccinated can help protect others around you.
- That was a fact — being healthy does not mean you cannot get the flu.
- That was true — asking questions is okay, and VaxFacts+ is there to help.

## 11. Mini-Game 4 — Memory Match

Flip cards and match vaccination benefits with positive outcomes. Complete all
matches before time runs out (or with a move counter). Visual and fast, not a
written quiz.

Pairs updated to distinct benefit↔outcome connections (implemented in B2), each with
its own message shown on a match:

1. Annual Flu Shot ↔ Changing Flu Viruses — "Flu viruses can change, so protection is recommended every year."
2. Flu Shot ↔ Cannot Give You Flu — "The flu shot cannot give you the flu."
3. Healthcare Worker ↔ Patient Protection — "Healthcare workers can help protect patients by staying protected."
4. Healthy Person ↔ Still At Risk — "Being healthy does not mean you cannot get the flu."
5. Grandparents ↔ Higher-Risk Loved Ones — "Older adults can be hit harder by flu season."
6. Baby Under 6 Months ↔ Too Young For Own Shot — "Babies under 6 months are too young for their own flu shot — protection around them matters."
7. Calendar Plans ↔ Fewer Missed Moments — "Flu season can interrupt weekends, work, and family plans."
8. VaxFacts+ ↔ Judgement-Free Questions — "Questions are normal. VaxFacts+ offers judgement-free vaccine conversations."

**Messages:** "Connect the benefits." / "Every season counts." / "Be there." /
"Small choices can protect big moments." / "The best moments happen together."

## 12. Game-wide slogans (easy-to-edit array)

- Keep your plans. Not the flu.
- Stay healthy for the moments that matter.
- Protect what matters.
- Don't miss what matters.
- Flu season shouldn't decide your weekend.
- Protect the people waiting for you at home.
- Stay one step ahead this flu season.
- The best moments happen together.
- Protect your next family gathering.
- Stay healthy for the moments you can't reschedule.

## 13. Short facts (rotate — don't show all at once)

- The flu vaccine is recommended every year because flu viruses can change.
- The flu shot cannot give you the flu.
- The flu can cause mild illness, but it can also become serious.
- Vaccination can help reduce the risk of severe flu illness.
- Getting vaccinated helps protect you and the people around you.
- Healthcare workers can help protect patients, coworkers, and families by staying protected.
- Being healthy does not mean you cannot get the flu.
- Past flu infection does not guarantee protection this season.
- Flu vaccination is free and available through Ontario's publicly funded flu vaccine program.
- Questions are normal. VaxFacts+ offers judgement-free vaccine conversations.

## 14. Leaderboard & end screen

- Ask for 2–3 initials before the game starts.
- Save local scores with **localStorage**; show **top 10**.
- End of run: final score, ranking, Play Again, Back to Home.
- Leaderboard reachable from the home screen.

**End screen exact text:**

- "Final Score: [score]"
- "Can you beat your score?"
- "Protect what matters and climb the leaderboard."
- "Influenza vaccination is free and available through Ontario's publicly funded flu vaccine program."
- "Have questions about vaccines? Book an appointment with the VaxFacts+ Clinic for a one-to-one, judgement-free phone conversation with a doctor. The goal is to give you facts in a safe space so you can make an informed decision."
- Link: https://www.shn.ca/vaxfacts/

## 15. Technical build requirements

- HTML/CSS/JS only. Three files: `index.html`, `style.css`, `script.js`.
- No frameworks, backend, databases, paid services/libraries. Playable locally.
- Mobile-friendly layout; keyboard controls fine for v1.
- Simple shapes/placeholders for hospital, character, maze, icons, items, collectibles.
- Comment code clearly in plain English.
- Keep content in **easy-to-edit arrays** (messages, facts, myths, facts-to-avoid,
  collectibles, mini-game items, leaderboard).
- Prioritize a working prototype over perfect art.

## 16. Planned file structure

```
ImmunityRush/
  index.html
  style.css
  script.js
  assets/     (optional later — logo/images)
  README.md   (optional)
```

## 17. Follow-up polish ideas (after v1 works)

- Make home screen + character look more polished / 3D / mobile-game-like.
- Improve maze visuals to feel more like an SHN hospital map.
- Make mini-game icons more colourful and clear.
- Add touch controls for mobile.
- Add a clear spot to drop in the real SHN logo file.

## 18. Vaccine content sources

- Public Health Agency of Canada / NACI — Statement on Seasonal Influenza Vaccine 2025–2026.
- Government of Canada — Flu (seasonal influenza): Get your flu vaccine.
- Government of Ontario — Universal Influenza Immunization Program.
- Scarborough Health Network — VaxFacts+ (https://www.shn.ca/vaxfacts/).
