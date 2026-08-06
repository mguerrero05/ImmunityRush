# Immunity Rush — Game Reference (for building slides)

> A factual description of the game — its screens, content, rules, characters, and
> visuals — to use **alongside your own pitch script** when building a slide deck.
> This is a reference, not a pitch. Pair it with the screenshots in the "Shot list"
> at the bottom.

---

## What the game is

**Immunity Rush** is a browser-based, SHN-branded hospital maze game about flu-season
awareness. The player customizes a character, explores a hospital, plays four quick
mini-games that teach real flu-vaccine facts (and bust common myths), and finishes at
the VaxFacts Clinic, where the game links out to SHN VaxFacts to learn more or book a
flu shot. Tone: friendly and playful, never clinical.

- **Platform:** any web browser (styled like a phone screen; works on desktop too). No download.
- **Live link:** https://mguerrero05.github.io/ImmunityRush/
- **Shareable by QR code** (a printable poster is included).
- **Tech:** lightweight web app (plain HTML/CSS/JS). Scores saved on the device only.

## Screens

| Screen | What it shows |
|---|---|
| **Home** | SHN hospital art, the title, a menu (Start / Customize / Instructions / Leaderboard), and a VaxFacts+ link |
| **How to Play** | The rules, shown right after Start |
| **Customize Character** | A large live preview + "Character 1–5" buttons for Female and Male |
| **The Maze** | Top-down SHN ward: labelled rooms, patrolling germs, collectible boosts |
| **4 Mini-games** | Vaccine Darts, Flu Freeze, Hospital Sprint, Memory Match |
| **VaxFacts Clinic (ending)** | A confetti "Congratulations!" overlay + a link to SHN VaxFacts |
| **Leaderboard** | Local high scores |

## The maze (rules)

- Move with **arrow keys / WASD** (or on-screen controls).
- **Collect pickups:** Vaccine Shield 🛡️, Heart ❤️, Speed Boost ⚡, Family Token 👪,
  Wellness Star ⭐ — each gives points and a short protective-health message.
- **Avoid the germs** 🦠 patrolling the halls (they cost health).
- Reach the **four clinic rooms** to play the mini-games, then the **VaxFacts Clinic** to finish.

## Characters

- **10 friendly, diverse SHN healthcare workers** — 5 women and 5 men, different
  ethnicities — chosen in the Customize screen.
- Each has a **full walking animation** (walks in all four directions in the maze).

## The four mini-games (rules + what each teaches)

**Shared design rule:** true and false items look **identical** (no colour "tell"), so
the player has to **read and think** before acting — that's the learning mechanic.

### 🎯 Vaccine Darts
- A dartboard with **5 colour sections**; a statement sits on each.
- **Read each statement and dart the TRUE ones** to "lock" them into the board.
- Darting a **myth** clears it (small penalty) and shows a correction.
- After each throw, the still-open sections **reshuffle** with new statements.
- **Win:** lock a true statement into all 5 colours. 60-second round; combo bonuses.
- **Teaches:** separating flu facts from myths.

### ❄️ Flu Freeze
- Virus "bubbles" carrying statements float in a hospital hallway.
- **Zap the TRUE statements** for points — they **freeze over and shatter** (on-theme).
- **Misconceptions:** leaving them alone clears them; **zapping one costs a life** and shows a correction.
- **3 lives.** Read before you zap.
- **Teaches:** true flu facts vs. common misconceptions.

### 🏃 Hospital Sprint
- A 3-lane, into-the-screen **endless runner** down a hospital corridor.
- **Switch lanes** to grab boosts and dodge flu obstacles rushing toward you; **jump** low obstacles, **duck** high ones.
- Reach the finish before time runs out. 60-second round.
- **Teaches:** flu disruptions vs. staying protected ("keep your plans, not the flu").

### 🧠 Memory Match
- A grid of cards on a clinic scene.
- **Flip two at a time to match** a healthy action with its benefit.
- Each match shows an educational message.
- **Teaches:** connecting prevention/vaccination actions to real benefits.

## Educational content in the game

**Slogans shown between actions (samples):**
- "Keep your plans. Not the flu."
- "Protect the people waiting for you at home."
- "Stay healthy for the moments you can't reschedule."
- "A flu shot takes 5 minutes; recovering from lingering flu symptoms may be a month."

**Facts reinforced:**
- The flu vaccine is recommended **every year** (flu viruses change).
- **The flu shot cannot give you the flu.**
- Vaccination can **reduce the risk of severe illness** and help **protect people around you**.
- Being healthy doesn't mean you can't get the flu; past infection isn't lasting protection.
- Flu vaccination is **free** through Ontario's publicly funded program.
- Questions are normal — **VaxFacts+ offers judgement-free vaccine conversations**.

**Myths the game corrects:**
- "The flu shot gives you the flu." ❌
- "I'm healthy, so I don't need it." ❌
- "One flu shot protects me every year." ❌
- "The flu is just a bad cold." ❌

## The ending (exact on-screen text)

Reaching the VaxFacts Clinic triggers a confetti celebration with this message:

> **Congratulations — you made it to the VaxFacts Clinic!**
> You've completed the maze and learned how vaccines help protect you and your
> community. Now you're ready to take the next step: **consider getting your flu shot!**
> Have questions or want to learn more? Visit **SHN VaxFacts** — you can also contact
> them or book an appointment, and the team will help you get started.

A **"Visit SHN VaxFacts"** button opens the real SHN VaxFacts page in a new tab.

---

## Shot list — screenshots to capture for the slides

Open the game (`https://mguerrero05.github.io/ImmunityRush/` or `http://localhost:5678/`)
and capture (Mac: **Cmd + Shift + 4**):

1. **Home screen** (title + menu)
2. **Customize screen** (character preview + Character buttons)
3. **The maze** (character in a hallway with a room label visible)
4. **Vaccine Darts** mid-round (coloured dartboard + statement cards)
5. **Flu Freeze** mid-round (virus bubbles with statements)
6. **Hospital Sprint** (the 3-lane corridor with obstacles)
7. **Memory Match** (the card grid on the clinic scene)
8. **VaxFacts congrats overlay** (confetti + "Congratulations!") — walk into the VaxFacts Clinic
9. **QR poster** (`assets/qr/poster.html` — open and screenshot) for a "how to access it" slide

*Note:* clean artwork also lives in `assets/` (home, maze, mini-game backgrounds,
characters) if you'd rather drop art into slides than live captures.

## One-line summary (for a stats/summary slide)

Immunity Rush — a free, browser-based SHN hospital maze game with 4 flu-fact mini-games,
10 diverse animated characters, and a finish that links players to SHN VaxFacts to learn
more or book a flu shot. No download; shareable by QR.
