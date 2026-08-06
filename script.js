/* =========================================================
   IMMUNITY RUSH — script.js
   Plain JavaScript. No libraries, no servers.

   HOW THIS FILE IS ORGANISED
   1. EDITABLE CONTENT ARRAYS  -> slogans, facts, myths, items...
   2. GAME STATE               -> score, health, character
   3. HELPERS                  -> screens, toast, character art
   4. FLOW                     -> home -> initials -> maze -> end
   5. MAZE                     -> movement, collectibles, zones
   6. MINI-GAMES               -> sprint, freeze, darts, memory
   7. LEADERBOARD              -> localStorage top 10

   To change wording or add items, edit section 1. That's it.
   ========================================================= */

/* =========================================================
   1. EDITABLE CONTENT ARRAYS  — change these freely!
   ========================================================= */

// Motivational slogans shown across the whole game.
const SLOGANS = [
  "Keep your plans. Not the flu.",
  "Stay healthy for the moments that matter.",
  "Protect what matters.",
  "Don't miss what matters.",
  "Flu season shouldn't decide your weekend.",
  "Protect the people waiting for you at home.",
  "Stay one step ahead this flu season.",
  "The best moments happen together.",
  "Protect your next family gathering.",
  "Stay healthy for the moments you can't reschedule.",
  "Protect your plans this flu season.",
  "Keep doing what you love.",
  "Protect the trip you've been waiting for.",
  "A flu shot takes 5 minutes; recovering from lingering flu symptoms may be a month.",
  "Keep your plans. Not the flu.",
];

// Short, friendly facts used as loading tips / pop-ups.
const FACTS = [
  "The flu vaccine is recommended every year because flu viruses can change.",
  "The flu shot cannot give you the flu.",
  "The flu can cause mild illness, but it can also become serious.",
  "Vaccination can help reduce the risk of severe flu illness.",
  "Getting vaccinated helps protect you and the people around you.",
  "Healthcare workers can help protect patients, coworkers, and families by staying protected.",
  "Being healthy does not mean you cannot get the flu.",
  "Past flu infection does not guarantee protection this season.",
  "Flu vaccination is free and available through Ontario's publicly funded flu vaccine program.",
  "Questions are normal. VaxFacts+ offers judgement-free vaccine conversations.",
];

// Collectibles that appear around the maze. Easy to edit!
// Each collectible: a temporary emoji icon (replaced with custom art in Milestone G),
// the score it awards, its effect, a short labeled bonus for the score popup, and a
// short personal message. Points/messages follow the Phase 5 brief.
const COLLECTIBLES = [
  {
    key: "shield",
    emoji: "🛡",
    name: "Vaccine Shield",
    points: 100,
    effect: "shield",
    bonusLabel: "Shield Bonus",
    messages: ["Protection starts before exposure."],
  },
  {
    key: "speed",
    emoji: "⚡",
    name: "Speed Boost",
    points: 100,
    effect: "speed",
    bonusLabel: "Speed Bonus",
    messages: [
      "Babies under 6 months are too young for their own flu shot — protection around them matters.",
    ],
  },
  {
    key: "heart",
    emoji: "❤",
    name: "Heart",
    points: 50,
    effect: "health",
    bonusLabel: "Health Bonus",
    messages: ["Protect the people waiting for you at home."],
  },
  {
    key: "family",
    emoji: "👨‍👩‍👧",
    name: "Family Token",
    points: 200,
    effect: "bonus",
    bonusLabel: "Family Bonus",
    messages: ["Protect the moments waiting for you after your shift."],
  },
  {
    key: "wellness",
    emoji: "🌟",
    name: "Wellness Star",
    points: 100,
    effect: "bonus",
    bonusLabel: "Wellness Bonus",
    messages: ["Flu vaccination is especially important for older adults and pregnant people."],
  },
];
// Maps each collectible to its sliced icon file in assets/icons/ (wellness uses
// the star art). Bump ?v= in the render below if an icon file is replaced.
const COLLECTIBLE_ICON = {
  shield: "shield",
  speed: "speed",
  heart: "heart",
  family: "family",
  wellness: "star",
};

// The four mini-game zones in the maze. `short` shows on the door tile in the maze;
// `label` is the full destination name shown in the entry pop-up.
const ZONES = [
  {
    key: "sprint",
    short: "Sprint Corridor",
    label: "Hospital Sprint Corridor",
    icon: "🏃",
    color: "#1f6feb",
    x: 100,
    y: 120,
  },
  {
    key: "freeze",
    short: "Freeze Station",
    label: "Flu Freeze Station",
    icon: "❄",
    color: "#2bb3b3",
    x: 900,
    y: 120,
  },
  {
    key: "darts",
    short: "Darts Room",
    label: "Vaccine Darts Room",
    icon: "🎯",
    color: "#e0533d",
    x: 100,
    y: 900,
  },
  {
    key: "memory",
    short: "Memory Clinic",
    label: "Memory Match Clinic",
    icon: "🃏",
    color: "#7d5ba6",
    x: 900,
    y: 900,
  },
];

// Decorative hospital rooms — visual only, they do NOT block movement (real
// walls/locked doors come in Milestone E). Each has a floor tint and a sign.
// The four "zone" rooms sit under the mini-game doors and share their theme.
const ROOMS = [
  { name: "Pharmacy", x: 240, y: 80, w: 160, h: 110, tone: "#e2efe6" },
  { name: "Reception", x: 450, y: 400, w: 170, h: 120, tone: "#dbe7f3" },
  { name: "Waiting Area", x: 660, y: 80, w: 160, h: 110, tone: "#f0ead9" },
  { name: "Staff Lounge", x: 240, y: 860, w: 160, h: 120, tone: "#efe1ec" },
  { name: "VaxFacts+ Clinic", x: 660, y: 860, w: 160, h: 120, tone: "#dcecef" },
  { name: "Sprint Corridor", x: 30, y: 60, w: 190, h: 210, tone: "#dce7fb", zone: "sprint" },
  { name: "Freeze Station", x: 850, y: 60, w: 190, h: 210, tone: "#d7f0f0", zone: "freeze" },
  { name: "Darts Room", x: 30, y: 840, w: 190, h: 190, tone: "#fadfd9", zone: "darts" },
  { name: "Memory Clinic", x: 850, y: 840, w: 190, h: 190, tone: "#e8e0f2", zone: "memory" },
];

// --- Hospital Sprint items (Milestone F: lane runner, exact wording) ---
const SPRINT_COLLECT = [
  {
    text: "Vaccine Booster",
    icon: "syringe",
    score: 100,
    msg: "Flu vaccination is free through Ontario's publicly funded flu vaccine program.",
  },
  { text: "Heart", icon: "heart", score: 50, msg: "Protect the people waiting for you at home." },
  {
    text: "Family Token",
    icon: "family",
    score: 200,
    msg: "Protect the moments waiting for you after your shift.",
  },
  {
    text: "Wellness Boost",
    icon: "star",
    score: 100,
    msg: "Stay protected for the people who need extra care.",
  },
  {
    text: "Energy Icon",
    icon: "energy",
    score: 75,
    msg: "Long shifts are hard enough without flu slowing you down.",
  },
];
// `overhead` obstacles must be slid under; the rest are jumped over.
const SPRINT_OBSTACLES = [
  {
    text: "Sick-Day Barrier",
    icon: "barrier",
    msg: "Sick days can interrupt more than just your shift.",
    overhead: false,
  },
  {
    text: "Cancelled Plans",
    icon: "calendar",
    msg: "Don't let flu season cancel what matters.",
    overhead: false,
  },
  {
    text: "Low-Energy Cloud",
    icon: "cloud",
    msg: "Low energy can take you out of the game.",
    overhead: true,
  },
];
// Custom icon art for the Sprint items (sliced from assets/icons/icons.png).
// Natural object colours — not a good/bad colour code.
const SPRINT_ICONS = {
  syringe: '<img class="spr-ico" src="assets/icons/syringe.png?v=1" alt="">',
  heart: '<img class="spr-ico" src="assets/icons/heart.png?v=1" alt="">',
  family: '<img class="spr-ico" src="assets/icons/family.png?v=1" alt="">',
  star: '<img class="spr-ico" src="assets/icons/star.png?v=1" alt="">',
  energy: '<img class="spr-ico" src="assets/icons/energy.png?v=1" alt="">',
  barrier: '<img class="spr-ico" src="assets/icons/barrier.png?v=1" alt="">',
  calendar: '<img class="spr-ico" src="assets/icons/calendar.png?v=1" alt="">',
  cloud: '<img class="spr-ico" src="assets/icons/cloud.png?v=1" alt="">',
};

// --- Flu Freeze items: read-then-zap virus bubbles ---
// TRUE statements — zapping one scores points. All bubbles look identical, so
// the player must READ before zapping.
const FREEZE_POSITIVE = [
  { text: "Flu can lead to hospitalization in older adults.", score: 100 },
  { text: "Vaccination helps protect elderly family members.", score: 100 },
  { text: "Flu can worsen existing heart or lung conditions.", score: 100 },
  { text: "Flu can trigger serious complications, including pneumonia.", score: 100 },
  { text: "Vaccination can make flu illness less severe.", score: 100 },
  { text: "Healthy adults can still get influenza.", score: 100 },
  { text: "The flu shot cannot give you influenza.", score: 100 },
  { text: "Flu is not the same as a common cold.", score: 100 },
  { text: "People need a new flu shot every year.", score: 100 },
  {
    text: "Babies under 6 months cannot receive the flu vaccine, they need adults to.",
    score: 100,
  },
  { text: "Pregnant people can receive the flu vaccine.", score: 100 },
  { text: "Flu vaccination is recommended while breastfeeding.", score: 100 },
  { text: "People can spread flu before realizing they are sick.", score: 100 },
  { text: "Antibiotics do not treat influenza viruses.", score: 100 },
  { text: "Getting vaccinated before flu season gives protection time to build.", score: 100 },
  { text: "The vaccine can reduce serious flu-related complications.", score: 100 },
  { text: "You can get the flu even if you rarely feel sick.", score: 100 },
];
// FALSE statements (misconceptions) — zapping one costs a life and shows its
// correction. Leaving it alone is correct; it clears on its own.
const FREEZE_NEGATIVE = [
  {
    text: "Older adults do not need yearly vaccination.",
    feedback:
      "Older adults are at higher risk from flu and are recommended to get vaccinated every season.",
  },
  {
    text: "The flu shot can give you influenza.",
    feedback: "The flu vaccine cannot give you influenza — it does not contain live flu virus.",
  },
  {
    text: "Flu is only dangerous for young children.",
    feedback:
      "Flu can be serious for everyone, especially older adults and people with health conditions.",
  },
  {
    text: "Last year's flu shot protects you forever.",
    feedback: "Flu viruses change over time, so a new vaccine is recommended each season.",
  },
  {
    text: "Pregnancy means you cannot get vaccinated.",
    feedback: "The flu vaccine is recommended in pregnancy and helps protect both parent and baby.",
  },
  {
    text: "Breastfeeding means you cannot get vaccinated.",
    feedback: "The flu vaccine is safe and recommended while breastfeeding.",
  },
  {
    text: "A strong immune system guarantees protection.",
    feedback: "Even healthy people with strong immune systems can catch and spread the flu.",
  },
  {
    text: "No fever means you do not have the flu.",
    feedback: "Flu does not always cause a fever — you can be infected and contagious without one.",
  },
  {
    text: "The flu is just a bad cold.",
    feedback: "Influenza is more serious than a cold and can lead to complications like pneumonia.",
  },
  {
    text: "Vaccination only protects the person receiving it.",
    feedback: "Getting vaccinated also helps protect the people around you by reducing spread.",
  },
];
const FREEZE_LIFE_LOST = [
  "Life lost — read each item carefully before selecting.",
  "Life lost — these choices could increase influenza exposure.",
  "Life lost — review the correction before continuing.",
];

// --- Vaccine Darts statements ---
// Vaccine Darts statements (exact wording from the Milestone F spec).
// Myth boards and fact boards look identical — the player must read them.
const DARTS_MYTHS = [
  {
    text: "The flu shot gives you the flu.",
    feedback: "Myth cleared! The flu vaccine cannot cause influenza.",
  },
  {
    text: "I'm healthy, so I don't need the flu vaccine.",
    feedback: "Myth cleared! Healthy people can still catch and spread influenza.",
  },
  {
    text: "I had the flu before, so I'm protected forever.",
    feedback:
      "Myth cleared! A previous infection does not guarantee protection against this season's strains.",
  },
  {
    text: "The flu is just a bad cold.",
    feedback: "Myth cleared! Influenza can cause serious complications and hospitalization.",
  },
  {
    text: "One flu vaccine protects me every year.",
    feedback: "Myth cleared! Flu viruses change, so vaccination is recommended each season.",
  },
  {
    text: "Flu vaccination is not important for healthcare workers.",
    feedback:
      "Myth cleared! Vaccinated healthcare workers help protect patients, coworkers, and families.",
  },
];
const DARTS_FACTS = [
  {
    text: "The flu vaccine is recommended every year.",
    feedback: "That was a fact. Flu viruses can change from season to season.",
  },
  {
    text: "Vaccination can reduce the risk of severe flu illness.",
    feedback: "That was a fact. Vaccination can lower the risk of serious complications.",
  },
  {
    text: "The flu vaccine cannot give you influenza.",
    feedback: "That was a fact. Flu vaccines do not cause influenza infection.",
  },
  {
    text: "Vaccination can help protect people around you.",
    feedback: "That was a fact. Reducing your risk can also reduce exposure to others.",
  },
  {
    text: "It is normal to have questions about vaccines.",
    feedback:
      "That was a fact. Reliable sources and healthcare professionals can help answer questions.",
  },
  {
    text: "Healthy people can still get the flu.",
    feedback: "That was a fact. Anyone can become infected and spread influenza.",
  },
];

// --- Memory Match pairs ---
// Exactly 6 pairs / 12 cards. Each pair = one PICTURE card (img) + one FACT card (fact)
// that share a pairId. `msg` = the educational explanation shown after a correct match.
// The picture card shows ONLY the image; the fact/explanation text never goes on it.
// Images live in assets/memory-match/ (local PNGs — no remote URLs).
const MEMORY_PAIRS = [
  {
    img: "assets/memory-match/01-calendar-vaccine.png",
    alt: "Calendar of checkmarks beside a vaccine syringe and vial",
    fact: "Get your flu vaccine every year.",
    msg: "Correct! Flu viruses can change, so vaccination is recommended each season.",
  },
  {
    img: "assets/memory-match/02-pregnancy-shield.png",
    alt: "Pregnant person protected by a shield",
    fact: "Pregnancy raises the risk of serious flu—get protected.",
    msg: "Correct! Flu can be more severe during pregnancy, and vaccination helps protect both you and your baby.",
  },
  {
    img: "assets/memory-match/03-sick-bed-calendar.png",
    alt: "Person resting in bed beside a calendar",
    fact: "Flu can cause days of illness and lingering symptoms for weeks.",
    msg: "Correct! Influenza can keep you sick for several days, while fatigue and other symptoms may last longer.",
  },
  {
    img: "assets/memory-match/04-family-protection.png",
    alt: "Two hands sheltering a family of three",
    fact: "Babies under 6 months can’t get the flu shot—your vaccination helps protect them.",
    msg: "Correct! Babies under 6 months are too young for flu vaccination, so protection from vaccinated parents, family members, and caregivers matters.",
  },
  {
    img: "assets/memory-match/05-older-adults-shield.png",
    alt: "Older couple holding a protective shield",
    fact: "Flu can be more severe in older adults—vaccination lowers the risk.",
    msg: "Correct! Older adults face a higher risk of serious flu complications, so vaccination matters for them and for the people around them.",
  },
  {
    img: "assets/memory-match/06-early-vaccination-shield.png",
    alt: "Vaccine syringe beside a protective shield with a cross",
    fact: "Get vaccinated early so your body is protected before exposure.",
    msg: "Correct! The flu vaccine needs time to help your immune system recognize and respond to the virus, so get vaccinated before exposure.",
  },
];
// Shown sparingly during play.
const MEMORY_MESSAGES = [
  "Read carefully.",
  "Connect the action to its outcome.",
  "Every season requires updated protection.",
  "Protect yourself and the people around you.",
];
// Shown briefly after an incorrect match.
const MEMORY_WRONG = [
  "Not a match. Read both cards and try again.",
  "These two ideas are not directly connected.",
  "Try another pair.",
  "Look for the action that creates this benefit.",
  "Think about how influenza is prevented or spread.",
];

/* =========================================================
   2. GAME STATE
   ========================================================= */

// Uniform scale applied to the whole phone frame to fit the device screen (see
// fitGame() at the bottom of this file). 1 on desktop widescreen and whenever the
// frame is shown at its authored size. Effects that mix a stage's on-screen rect
// with logical pixel offsets multiply those offsets by FIT so they land correctly
// under scaling. On desktop FIT === 1, so this changes nothing there.
let FIT = 1;

let state = {
  initials: "---",
  score: 0,
  health: 3,
  shielded: false,
  speedBoost: false,
  family: 0, // family tokens collected this run (shown in the status box)
  runSeconds: 0, // overall run time; the run ends at RUN_LIMIT_SECONDS
};

// Character look. Defaults match the CSS defaults.
// The player is now chosen from a gallery of finished character images
// (assets/characters/*.png). `preset` is the index into CHAR_PRESETS below.
const CHAR_PRESETS = [
  "woman-1",
  "woman-2",
  "woman-3",
  "man-1",
  "man-2",
  "man-3",
  "woman-4",
  "man-4",
  "woman-5",
  "man-5",
];
let character = {
  preset: 1, // default = "Character 1" (woman-2) after the Customize reorder
};
function characterSrc(back) {
  const n = CHAR_PRESETS[character.preset] || CHAR_PRESETS[0];
  return `assets/characters/${n}${back ? "-back" : ""}.png`;
}

// Load a saved character if one exists.
(function loadCharacter() {
  const saved = localStorage.getItem("immunityCharacter");
  if (saved) {
    try {
      const c = JSON.parse(saved);
      if (typeof c.preset === "number" && c.preset >= 0 && c.preset < CHAR_PRESETS.length) {
        character.preset = c.preset;
      }
    } catch (e) {
      /* ignore a bad/old saved value — keep the default */
    }
  }
})();

/* =========================================================
   3. HELPERS
   ========================================================= */

// Pick a random element from an array.
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Show a single screen by id, hide the rest.
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Floating message banner. Disappears automatically.
let toastTimer;
function toast(msg, ms = 1800) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}

/* =========================================================
   BIG CENTERED MESSAGE OVERLAY
   A large, hard-to-miss message in the middle of the screen. It dims/blurs the
   game behind it and sets `overlayPaused` so the real-time loops (maze, sprint,
   darts) freeze — the player can't be hit while reading — then ALWAYS releases,
   so the game can never stay frozen after the message closes.
   ========================================================= */
let overlayPaused = false;
let bigMsgTimer = null;
let bigMsgSafety = null;
function closeBigMessage() {
  clearTimeout(bigMsgTimer);
  clearTimeout(bigMsgSafety);
  const ov = document.getElementById("big-msg");
  if (ov) {
    ov.classList.remove("show");
    ov.onclick = null;
  }
  const btn = document.getElementById("big-msg-btn");
  if (btn) btn.onclick = null;
  overlayPaused = false; // release the pause — this is what un-freezes gameplay
}
// bigMessage(text, { icon, title, tone, duration, button })
//  - tone: "good" | "bonus" | "warn" | "info" (colour accent only, not a game tell)
//  - button:true shows a Continue button and waits for it (with a safety timeout);
//    otherwise it auto-closes after `duration` ms.
function bigMessage(text, opts = {}) {
  const { icon = "", title = "", tone = "info", duration = 1600, button = false } = opts;
  const ov = document.getElementById("big-msg");
  if (!ov) {
    // Overlay markup missing — fall back to a toast so a message is never lost.
    toast(title ? `${title} — ${text}` : text, duration);
    return closeBigMessage;
  }
  const card = ov.querySelector(".big-msg-card");
  const ic = document.getElementById("big-msg-icon");
  const ti = document.getElementById("big-msg-title");
  const tx = document.getElementById("big-msg-text");
  ic.textContent = icon;
  ic.style.display = icon ? "" : "none";
  ti.textContent = title;
  ti.style.display = title ? "" : "none";
  tx.textContent = text;
  card.className = "big-msg-card tone-" + tone;
  const btn = document.getElementById("big-msg-btn");
  btn.style.display = button ? "" : "none";

  ov.classList.add("show");
  overlayPaused = true;
  clearTimeout(bigMsgTimer);
  clearTimeout(bigMsgSafety);

  btn.onclick = closeBigMessage;
  // Tap the dimmed backdrop (or anywhere, for auto-close messages) to dismiss early.
  ov.onclick = (e) => {
    if (!button || e.target === ov) closeBigMessage();
  };
  if (button) {
    // Even with a button, a hard safety timeout guarantees we never stay paused.
    bigMsgSafety = setTimeout(closeBigMessage, Math.max(duration, 8000));
  } else {
    bigMsgTimer = setTimeout(closeBigMessage, duration);
    bigMsgSafety = setTimeout(closeBigMessage, duration + 4000); // belt-and-suspenders
  }
  return closeBigMessage;
}

/* =========================================================
   3b. GAME FEEL TOOLKIT (reused everywhere)
   Floating text, sounds, particles, and screen shake.
   ========================================================= */

// Center of an element in screen (client) coordinates. Handy for spawning
// effects on top of the player, a sliced item, a hit target, etc.
function centerOf(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// C1 — a floating text popup (e.g. "+200") that drifts up and fades.
// x/y are screen coordinates. `big` makes a larger, warmer popup.
function floatText(text, x, y, color = "#ffd34d", big = false) {
  const el = document.createElement("div");
  el.className = "float-text" + (big ? " big" : "");
  el.textContent = text;
  el.style.left = x + "px";
  el.style.top = y + "px";
  el.style.color = color;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// C2 — sound is turned OFF for this project (no music, no effects). The player
// stays muted; to bring back the subtle Web Audio effects later, set this to
// false (and restore a toggle button if you want players to control it).
let audioCtx = null;
let muted = true;
const SOUND_PRESETS = {
  collect: { type: "triangle", f1: 660, f2: 990, dur: 0.15 },
  success: { type: "sine", f1: 523, f2: 784, dur: 0.25 },
  error: { type: "sawtooth", f1: 220, f2: 120, dur: 0.25 },
  hit: { type: "square", f1: 300, f2: 90, dur: 0.18 },
  shield: { type: "sine", f1: 880, f2: 440, dur: 0.22 },
};
function playSound(type) {
  if (muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const p = SOUND_PRESETS[type] || SOUND_PRESETS.collect;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = p.type;
    osc.frequency.setValueAtTime(p.f1, now);
    osc.frequency.exponentialRampToValueAtTime(p.f2, now + p.dur);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + p.dur);
    osc.start(now);
    osc.stop(now + p.dur);
  } catch (e) {
    /* audio not available — ignore silently */
  }
}
function toggleMute() {
  muted = !muted;
  localStorage.setItem("immunityMuted", muted ? "1" : "0");
  const btn = document.getElementById("mute-btn");
  if (btn) btn.textContent = muted ? "🔇" : "🔊";
}

// C3 — a small particle burst at screen coords x/y.
function burst(x, y, color = "#ffd34d", count = 8) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.background = color;
    const angle = (Math.PI * 2 * i) / count;
    const dist = 20 + Math.random() * 30;
    p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

// C3 — a quick screen shake. Shake the game frame (never the maze world,
// which uses transform for the camera).
function shake() {
  const frame = document.getElementById("game");
  if (!frame) return;
  frame.classList.remove("shaking");
  void frame.offsetWidth; // force reflow so the animation restarts
  frame.classList.add("shaking");
  setTimeout(() => frame.classList.remove("shaking"), 400);
}

// Build the CSS-shape character inside a given container element.
// Render the selected character IMAGE into a stage element. The maze player, the
// HUD portrait, the Sprint runner and the Customize preview all use this.
// Presets that have a 4x4 walk sprite sheet (rows: down/right/left/up, 4 frames
// each) in assets/characters/<preset>-walk.png. Add each as its sheet is made.
const WALK_SHEETS = new Set([
  "woman-1",
  "woman-2",
  "woman-3",
  "man-1",
  "man-2",
  "man-3",
  "woman-4",
  "man-4",
  "woman-5",
  "man-5",
]);
// Some walk sheets were drawn with the two SIDE rows swapped: their row order is
// front/LEFT/RIGHT/back instead of the canonical front/RIGHT/LEFT/back. For these
// the player gets a `rev-walk` class so the CSS reads the correct side row per
// facing (verified by eye from each sheet). The other sheets are canonical.
const REVERSED_WALK = new Set(["woman-2", "woman-3", "woman-4", "woman-5", "man-3"]);

function buildCharacter(el) {
  if (!el) return;
  el.classList.add("char-photo");
  const preset = CHAR_PRESETS[character.preset] || CHAR_PRESETS[0];
  // The maze player uses the animated walk sheet when one exists; everything else
  // (HUD, customize, Sprint runner) keeps the still image for now.
  const mover = el.id === "player";
  if (mover && WALK_SHEETS.has(preset)) {
    el.classList.add("has-walk");
    // Reversed sheets have their two side rows swapped — flag so the CSS reads
    // the right row for each facing.
    el.classList.toggle("rev-walk", REVERSED_WALK.has(preset));
    el.innerHTML = `<div class="walk-sprite" style="background-image:url('assets/characters/${preset}-walk.png')"></div>`;
    return;
  }
  el.classList.remove("has-walk");
  // Front + back images stacked; CSS shows the back only when facing "back" (walking up).
  el.innerHTML =
    `<img class="char-img char-front" src="${characterSrc(false)}" alt="" draggable="false" />` +
    `<img class="char-img char-back" src="${characterSrc(true)}" alt="" draggable="false" />`;
}

// Presets are finished images, so "applying" a change just re-draws the chosen one.
function applyCharacter(el) {
  buildCharacter(el);
}

// Hybrid hero art: show a supplied character render on the home screen if the
// asset exists (assets/characters/<gender>-hero.png); otherwise fall back to the
// built-in CSS character. Drop the files in and they appear automatically.
function updateHeroArt() {
  const img = document.getElementById("home-hero");
  const css = document.getElementById("home-character");
  if (!img || !css) return;
  img.onload = () => {
    img.hidden = false;
    css.style.display = "none";
  };
  img.onerror = () => {
    img.hidden = true;
    css.style.display = "";
  };
  // Cache-bust nothing; just point at the gender-specific hero file.
  img.src = `assets/characters/${character.gender}-hero.png`;
}

// Rotate slogans on the home screen.
function rotateSlogan(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = rand(SLOGANS);
}

/* =========================================================
   4. GAME FLOW
   ========================================================= */

// Called once when the page loads.
function init() {
  setupCustomizeControls();
  setupControls();
}

// Home -> initials screen.
// Show the How-to-Play screen. In pre-game mode (from "Start Game") it offers a
// Continue button that leads to the initials entry; from the menu it just has Back.
function showInstructions(preGame) {
  const cont = document.getElementById("instr-continue");
  const back = document.getElementById("instr-back");
  if (cont) cont.style.display = preGame ? "" : "none";
  // From the menu, Back is the primary action; before a game it's secondary.
  if (back) back.classList.toggle("btn-primary", !preGame);
  showScreen("screen-instructions");
}

function startInitials() {
  document.getElementById("initials-slogan").textContent = rand(SLOGANS);
  document.getElementById("initials-input").value = state.initials === "---" ? "" : state.initials;
  showScreen("screen-initials");
}

// Start a fresh run from the initials screen.
function beginGame() {
  const input = document.getElementById("initials-input").value.trim();
  if (input.length < 2) {
    // Only enforce this when coming from the initials screen.
    if (document.getElementById("screen-initials").classList.contains("active")) {
      toast("Please enter 2–3 initials.");
      return;
    }
  } else {
    state.initials = input.slice(0, 3);
  }

  // Reset run stats.
  state.score = 0;
  state.health = 3;
  state.shielded = false;
  state.speedBoost = false;
  state.family = 0;
  // Clear mini-game state so zone doors work again on a fresh run. Without this,
  // dying in a mini-game (which ends the run) left zoneCooldown stuck "on", so
  // walking into a mini-game door did nothing after Play Again.
  zoneCooldown = false;
  currentMini = null;
  clearMiniTimers();
  state.runSeconds = 0;
  missionVisited = {};
  missionDone = false;

  showScreen("screen-maze");
  buildMaze();
  buildCharacter(document.getElementById("mhud-char")); // landscape HUD portrait
  resetPowerups();
  updateHUD();
  updateMission();

  // Camera zoom-out transition into the maze.
  const world = document.getElementById("maze-world");
  world.classList.remove("zooming");
  void world.offsetWidth; // restart animation
  world.classList.add("zooming");

  toast(rand(SLOGANS), 2200);
  updateRunTime();
  startRunTimer();
  keys.up = keys.down = keys.left = keys.right = false; // clear any stale key state
  startMazeLoop();
}

// Ask before ending the run from the maze.
function confirmEndRun() {
  stopMazeLoop();
  showPopup("End your run?", `Current score: ${state.score}\n\n` + rand(SLOGANS), [
    {
      text: "End Run",
      primary: true,
      action: () => {
        hidePopup();
        endGame();
      },
    },
    {
      text: "Keep Playing",
      action: () => {
        hidePopup();
        startMazeLoop();
      },
    },
  ]);
}

function updateHUD() {
  document.getElementById("hud-initials").textContent = state.initials;
  document.getElementById("hud-score").textContent = state.score;
  document.getElementById("hud-health").textContent = state.health;
  const hs = document.getElementById("hud-shield");
  if (hs) hs.classList.toggle("on", state.shielded);
  updateHudLand();
}

// Render a row of pips (health/shield/speed) into an element.
function pipRow(el, count, full, cls) {
  if (!el) return;
  el.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "pip " + cls + (i < full ? " full" : "");
    el.appendChild(p);
  }
}

// Landscape maze HUD (left panel + score). No-ops in portrait (elements hidden).
function updateHudLand() {
  const sc = document.getElementById("mhud-score");
  if (sc) sc.textContent = state.score;
  pipRow(document.getElementById("mhud-health"), 5, state.health, "");
  pipRow(document.getElementById("mhud-shield-l"), 3, state.shielded ? 1 : 0, "shield");
  pipRow(document.getElementById("mhud-speed-l"), 4, state.speedBoost ? 4 : 0, "energy");
  pipRow(document.getElementById("mhud-family"), 3, state.family || 0, "fam");
}

function addScore(n) {
  state.score += n;
  updateHUD();
}

// End the whole run and show the end screen.
/* ---------- Overall run timer (5 minutes) ---------- */
// The whole run lasts RUN_LIMIT_SECONDS. It counts up in the maze HUD and keeps
// ticking during mini-games (it's the overall run clock). Finishing or dying in a
// mini-game does NOT end the run — only this timer (or the End Run button) does.
const RUN_LIMIT_SECONDS = 300;
let runTimer = null;
function updateRunTime() {
  const mm = Math.floor(state.runSeconds / 60);
  const ss = String(state.runSeconds % 60).padStart(2, "0");
  const el = document.getElementById("hud-time");
  if (el) el.textContent = `${mm}:${ss}`;
}
function startRunTimer() {
  clearInterval(runTimer);
  runTimer = setInterval(() => {
    state.runSeconds++;
    updateRunTime();
    if (state.runSeconds >= RUN_LIMIT_SECONDS) {
      toast("Time's up! Run complete.", 2400);
      endGame();
    }
  }, 1000);
}
function stopRunTimer() {
  clearInterval(runTimer);
}

function endGame() {
  stopRunTimer();
  stopMazeLoop();
  clearMiniTimers();
  const rank = saveScore(state.initials, state.score);
  document.getElementById("end-score").textContent = state.score;
  document.getElementById("end-rank").textContent =
    rank <= 10
      ? `You ranked #${rank} on the leaderboard!`
      : "Great effort — try again to climb the board!";
  document.getElementById("end-slogan").textContent = rand([
    "Can you beat your score?",
    "Protect what matters and climb the leaderboard.",
    "Stay healthy for the moments that matter.",
    "Keep your plans. Not the flu.",
  ]);
  showScreen("screen-end");
}

/* =========================================================
   5. MAZE
   ========================================================= */

const WORLD_SIZE = 1050;
const VIEW_W = 430,
  VIEW_H = 860;

// Playable world bounds. Set per maze: the CSS maze is WORLD_SIZE square; the
// image maze is the artwork's pixel size (IMG_W×IMG_H). Movement is clamped to
// these so the player can reach the whole map.
let worldW = WORLD_SIZE,
  worldH = WORLD_SIZE;

// Player position/size within the world.
let player = { x: 400, y: 400, w: 46, h: 76, speed: 4 };

// Wall rectangles {x, y, w, h}. Outer border + a few dividers.
let walls = [];
let liveCollectibles = []; // {el, x, y, w, h, data}
let hazards = []; // patrolling flu germs {el, x, y, w, h, min, max, vy}
let hazardCooldown = 0; // frames of immunity after a hazard hit
let keycard = null; // {el, x, y, w, h} — unlocks the vault
let lockedDoor = null; // {rect, el} — blocks the vault until the keycard is found
let vaultHintShown = false; // one-time "find the keycard" hint near the locked door
let missionVisited = {}; // which clinics have been visited this run
let missionDone = false;
let keys = {};
let mazeRunning = false;
let mazeFrame;

// Image-maze mode: use the supplied maze artwork as the floor instead of the
// CSS-drawn maze. Positions are in the image's pixel space (1586×992).
const USE_IMAGE_MAZE = true;
const DEBUG_PROBE = false; // click the maze to print exact coordinates (temporary tuning tool)
const IMG_W = 1586,
  IMG_H = 992;
// THE START: player top-left position at the "WELCOME TO SHN" reception (top-left).
// Used for BOTH the run start and the respawn-after-flu, so they can't drift apart.
const START_X = 328,
  START_Y = 180;

// Collision mask baked from the maze artwork (assets/maze/wallmask.js): one bit
// per maskF-pixel cell, 1 = wall/blocked. This lets the player walk exactly on
// the painted floor and never on a wall — no hand-placed rectangles needed.
let maskBits = null,
  maskW = 0,
  maskH = 0,
  maskF = 4;
(function loadWallMask() {
  const M = typeof window !== "undefined" && window.WALL_MASK;
  if (!M) return;
  maskW = M.w;
  maskH = M.h;
  maskF = M.f;
  const bin = atob(M.bits);
  maskBits = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) maskBits[i] = bin.charCodeAt(i);
})();
// Is this image-pixel point inside a wall? Outside the artwork counts as wall.
function maskBlocked(imgX, imgY) {
  if (!maskBits) return false;
  if (imgX < 0 || imgY < 0 || imgX >= IMG_W || imgY >= IMG_H) return true;
  const mx = (imgX / maskF) | 0,
    my = (imgY / maskF) | 0;
  const idx = my * maskW + mx;
  return ((maskBits[idx >> 3] >> (idx & 7)) & 1) === 1;
}
// The player's "feet" footprint is what must stay on the floor — in this angled
// view the head/body can pass in front of a wall, only the feet stand on tiles.
function feetBlocked(px, py) {
  const w = player.w,
    h = player.h;
  // Compact ~9px footprint for the wide, OPEN-ed mask (wall tops blocked, so she
  // can't stand on walls; corner-assist in stepAxisMask keeps corners smooth).
  return (
    maskBlocked(px + w * 0.5, py + h - 8) ||
    maskBlocked(px + w * 0.4, py + h - 9) ||
    maskBlocked(px + w * 0.6, py + h - 9) ||
    maskBlocked(px + w * 0.5, py + h - 14)
  );
}

// Build all maze elements fresh.
function buildMaze() {
  const worldEl = document.getElementById("maze-world");
  // Clear everything except the player element.
  worldEl
    .querySelectorAll(
      ".wall, .zone, .collectible, .room, .room-sign, .hazard, .locked-door, .keycard",
    )
    .forEach((n) => n.remove());

  if (USE_IMAGE_MAZE) return buildImageMaze(worldEl);

  worldW = WORLD_SIZE;
  worldH = WORLD_SIZE;

  // --- Hospital rooms (decorative floor areas + standing signs) ---
  // Drawn first so they sit behind the walls, doors, and collectibles.
  ROOMS.forEach((r) => {
    const room = document.createElement("div");
    room.className = "room" + (r.zone ? " room-game" : "");
    room.style.left = r.x + "px";
    room.style.top = r.y + "px";
    room.style.width = r.w + "px";
    room.style.height = r.h + "px";
    room.style.background = r.tone;
    worldEl.appendChild(room);
    // Sign is a direct child of the world so it stands upright like the doors.
    const sign = document.createElement("div");
    sign.className = "room-sign";
    sign.textContent = r.name;
    sign.style.left = r.x + r.w / 2 + "px";
    sign.style.top = r.y + 4 + "px";
    worldEl.appendChild(sign);
  });

  // --- Walls: outer border + serpentine lanes ---
  const T = 20; // wall thickness
  walls = [
    { x: 0, y: 0, w: WORLD_SIZE, h: T }, // top
    { x: 0, y: WORLD_SIZE - T, w: WORLD_SIZE, h: T }, // bottom
    { x: 0, y: 0, w: T, h: WORLD_SIZE }, // left
    { x: WORLD_SIZE - T, y: 0, w: T, h: WORLD_SIZE }, // right
    // Serpentine: FOUR staggered walls make FIVE lanes. Alternating top/bottom gaps
    // force a long weave (down -> up -> down -> up) from the left clinics to the right.
    { x: 210, y: 0, w: T, h: 780 }, // W1 hangs from top (gap at the BOTTOM)
    { x: 420, y: 270, w: T, h: 780 }, // W2 rises from bottom (gap at the TOP)
    { x: 630, y: 0, w: T, h: 780 }, // W3 hangs from top (gap at the BOTTOM)
    { x: 840, y: 270, w: T, h: 780 }, // W4 rises from bottom (gap at the TOP)
    // Nook stubs — each leaves a ~90px+ corridor past it (adds turns, hides items).
    { x: 230, y: 520, w: 90, h: T }, // lane 2 (left): gap x320–420 (~100px)
    { x: 530, y: 520, w: 100, h: T }, // lane 3 (right): gap x440–530 (~90px)
    { x: 650, y: 520, w: 90, h: T }, // lane 4 (left): gap x740–840 (~100px)
    // Locked bonus vault (lane 5, against the right border). Big door gap on the left
    // so the player can walk in easily; corridor x860–940 stays clear down lane 5.
    { x: 940, y: 540, w: 110, h: T }, // top
    { x: 940, y: 740, w: 110, h: T }, // bottom
    { x: 940, y: 540, w: T, h: 35 }, // left-upper (540–575)
    { x: 940, y: 725, w: T, h: 35 }, // left-lower (725–760)
  ];
  walls.forEach((w) => {
    const d = document.createElement("div");
    d.className = "wall";
    d.style.left = w.x + "px";
    d.style.top = w.y + "px";
    d.style.width = w.w + "px";
    d.style.height = w.h + "px";
    worldEl.appendChild(d);
  });

  // --- Locked vault door + keycard ---
  // The door blocks the vault gap until the player finds the keycard.
  const doorRect = { x: 940, y: 575, w: 20, h: 150 }; // wide gap — easy to walk through
  walls.push(doorRect); // acts as a wall while locked
  const doorEl = document.createElement("div");
  doorEl.className = "locked-door";
  doorEl.textContent = "🔒";
  doorEl.style.left = doorRect.x + "px";
  doorEl.style.top = doorRect.y + "px";
  doorEl.style.height = doorRect.h + "px";
  worldEl.appendChild(doorEl);
  lockedDoor = { rect: doorRect, el: doorEl };
  // Keycard hidden in the maze.
  const kc = document.createElement("div");
  kc.className = "keycard";
  kc.textContent = "🔑";
  kc.style.left = "480px";
  kc.style.top = "800px";
  worldEl.appendChild(kc);
  keycard = { el: kc, x: 480, y: 800, w: 30, h: 30 };
  vaultHintShown = false;

  // --- Mini-game zones ---
  ZONES.forEach((z) => {
    const d = document.createElement("div");
    d.className = "zone";
    d.style.left = z.x + "px";
    d.style.top = z.y + "px";
    d.style.background = z.color;
    d.dataset.key = z.key;
    d.innerHTML = `<div class="zone-icon">${z.icon}</div>${z.short}`;
    worldEl.appendChild(d);
  });

  // --- Collectibles: scatter several of each type ---
  liveCollectibles = [];
  const spots = [
    [100, 260],
    [100, 780], // lane 1
    [370, 260],
    [280, 780],
    [370, 640], // lane 2
    [480, 260],
    [500, 780],
    [500, 640], // lane 3
    [790, 260],
    [700, 780],
    [790, 640], // lane 4
    [900, 400],
    [900, 620],
    [960, 800], // lane 5
  ];
  spots.forEach((s, i) => {
    const data = COLLECTIBLES[i % COLLECTIBLES.length];
    spawnCollectible(worldEl, s[0], s[1], data);
  });

  // Vault rewards — only reachable once the door is unlocked.
  const famReward = COLLECTIBLES.find((c) => c.key === "family");
  const wellReward = COLLECTIBLES.find((c) => c.key === "wellness");
  spawnCollectible(worldEl, 975, 590, famReward);
  spawnCollectible(worldEl, 1000, 640, famReward);
  spawnCollectible(worldEl, 975, 690, wellReward);

  // Patrolling flu hazards.
  spawnHazards(worldEl);

  // Reset player to the entrance (open lane-1 spot, clear of every wall).
  player.x = 100;
  player.y = 520;
  player.speed = 4;
  const playerEl = document.getElementById("player");
  buildCharacter(playerEl);
  playerEl.classList.add("walking"); // continuous walk cycle in the maze
  buildDirectionArrows();
}

// Build the maze on top of the supplied artwork (assets/maze/maze-bg.png).
// All coordinates are in the image's pixel space (IMG_W×IMG_H). This is a first
// alignment pass — clinic/wall positions are refined with screenshots.
function buildImageMaze(worldEl) {
  worldEl.classList.add("img-mode");
  worldEl.style.width = IMG_W + "px";
  worldEl.style.height = IMG_H + "px";
  worldW = IMG_W;
  worldH = IMG_H;

  // Collision comes from the pixel mask (maskBlocked/feetBlocked), so no
  // hand-placed wall rectangles are needed here.
  walls = [];
  if (DEBUG_PROBE) setupClickProbe(worldEl);

  // Four mini-game clinics. (cx,cy) is the trigger CENTRE, placed INSIDE each
  // room (Darts/Freeze in their open alcoves; Memory/Sprint in the rooms opened
  // for them). The pad art (128×96) is centred on it.
  const IZONES = [
    { key: "darts", short: "Vaccine Darts", cx: 645, cy: 170, color: "rgba(125,47,166,0.5)" },
    { key: "freeze", short: "Flu Freeze", cx: 935, cy: 165, color: "rgba(43,179,179,0.45)" },
    { key: "sprint", short: "Hospital Sprint", cx: 304, cy: 532, color: "rgba(192,81,43,0.45)" },
    { key: "memory", short: "Memory Clinic", cx: 1030, cy: 438, color: "rgba(125,91,166,0.45)" },
  ];
  IZONES.forEach((z) => {
    const d = document.createElement("div");
    d.className = "zone";
    d.dataset.key = z.key;
    d.style.left = z.cx - 64 + "px"; // 128 wide, centred on the trigger
    d.style.top = z.cy - 48 + "px"; // 96 tall, centred on the trigger
    d.style.background = z.color;
    d.innerHTML = `<div class="zone-icon">${ZONES.find((q) => q.key === z.key).icon}</div>${z.short}`;
    worldEl.appendChild(d);
    const zd = ZONES.find((q) => q.key === z.key); // store the CENTRE for entry detection
    if (zd) {
      zd.x = z.cx;
      zd.y = z.cy;
    }
  });

  // Walk-in LINK zone: stepping onto the VaxFacts+ clinic (bottom-right) opens the
  // real VaxFacts+ website in a new tab (no mini-game).
  linkZones = [
    {
      key: "vaxfacts",
      short: "VaxFacts+",
      label: "VaxFacts+ Clinic",
      url: "https://www.shn.ca/vaxfacts/",
      x: 1290,
      y: 865,
      color: "rgba(31,111,235,0.42)",
      icon: "🛡️",
    },
  ];
  linkZones.forEach((z) => {
    const d = document.createElement("div");
    d.className = "zone link-zone";
    d.dataset.key = z.key;
    d.style.left = z.x - 64 + "px";
    d.style.top = z.y - 48 + "px";
    d.style.background = z.color;
    d.innerHTML = `<div class="zone-icon">${z.icon}</div>${z.short}`;
    worldEl.appendChild(d);
  });

  // Boosters, each on a verified naturally-reachable floor spot (top-left = feet − 15).
  liveCollectibles = [];
  [
    [284, 335, "shield"],
    [484, 385, "heart"],
    [684, 415, "speed"],
    [544, 285, "family"],
    [984, 235, "wellness"],
    [302, 381, "family"],
  ].forEach(([x, y, key]) =>
    spawnCollectible(
      worldEl,
      x,
      y,
      COLLECTIBLES.find((c) => c.key === key),
    ),
  );

  // Patrolling germs — kept away from the reception START so you're not hit at spawn.
  hazards = [
    { x: 700, y: 430, w: 46, h: 46, min: 360, max: 500, vy: 1.8 },
    { x: 950, y: 540, w: 46, h: 46, min: 460, max: 640, vy: -1.8 },
    { x: 560, y: 640, w: 46, h: 46, min: 560, max: 720, vy: 1.6 },
    { x: 1205, y: 400, w: 46, h: 46, min: 340, max: 560, vy: 1.7 }, // far-right corridor (kept right so you can pass on the left)
  ];
  hazardCooldown = 0;
  hazards.forEach((h) => {
    const d = document.createElement("div");
    d.className = "hazard";
    d.innerHTML = '<img class="hazard-img" src="assets/icons/germ.png?v=1" alt="">';
    d.style.left = h.x + "px";
    d.style.top = h.y + "px";
    worldEl.appendChild(d);
    h.el = d;
  });

  keycard = null;
  lockedDoor = null;
  vaultHintShown = true;

  // Player starts at the SHN reception (top-left) — the labelled START.
  player.x = START_X;
  player.y = START_Y;
  player.speed = 4.4;
  const playerEl = document.getElementById("player");
  buildCharacter(playerEl);
  playerEl.classList.add("walking");
  buildDirectionArrows();
}

function spawnCollectible(worldEl, x, y, data) {
  const d = document.createElement("div");
  d.className = "collectible";
  d.innerHTML = `<img class="collectible-img" src="assets/icons/${
    COLLECTIBLE_ICON[data.key] || data.key
  }.png?v=1" alt="">`;
  d.style.left = x + "px";
  d.style.top = y + "px";
  worldEl.appendChild(d);
  liveCollectibles.push({ el: d, x, y, w: 30, h: 30, data });
}

// DEBUG tuning tool: click the maze to drop a numbered dot and print its exact
// image-pixel coordinate. Used to locate stuck spots + desired room positions.
function setupClickProbe(worldEl) {
  let out = document.getElementById("dbg-readout");
  if (!out) {
    out = document.createElement("div");
    out.id = "dbg-readout";
    document.getElementById("game").appendChild(out);
  }
  out.innerHTML = "<b>Clicks (screenshot me):</b><br>";
  let n = 0;
  worldEl.onclick = (e) => {
    const rect = worldEl.getBoundingClientRect();
    const s = rect.width / IMG_W;
    const ix = Math.round((e.clientX - rect.left) / s);
    const iy = Math.round((e.clientY - rect.top) / s);
    n++;
    const dot = document.createElement("div");
    dot.className = "dbg-dot";
    dot.dataset.n = n;
    dot.style.cssText = `left:${ix}px;top:${iy}px`;
    worldEl.appendChild(dot);
    out.innerHTML += `${n}: ${ix}, ${iy}<br>`;
  };
}

// AABB overlap test.
function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Try to move the player, blocked by walls.
// We move the X and Y axes SEPARATELY so the player slides smoothly
// along a wall instead of getting stuck when moving diagonally.
//
// Key rule: a move is blocked ONLY if it would enter a wall the player is not
// ALREADY overlapping. So pressing into a wall stops that direction only, but if
// the player ever ends up inside a wall (e.g. a knockback), they can always move
// back out — they can never become permanently trapped.
function moverPlayer(dx, dy) {
  // Image maze: walk the pixel mask, one pixel at a time per axis so the player
  // stops flush against a wall (no gap, no overshoot) and slides along it.
  if (maskBits) {
    stepAxisMask(Math.sign(dx), 0, Math.round(Math.abs(dx)));
    stepAxisMask(0, Math.sign(dy), Math.round(Math.abs(dy)));
    return;
  }
  const startX = player.x,
    startY = player.y;
  // --- Horizontal ---
  if (dx !== 0) {
    let nx = Math.max(0, Math.min(worldW - player.w, startX + dx));
    for (const w of walls) {
      const box = { x: nx, y: startY, w: player.w, h: player.h };
      const already = overlap({ x: startX, y: startY, w: player.w, h: player.h }, w);
      // If this step would newly enter the wall, stop FLUSH against its edge
      // (no gap, no overshoot) instead of rejecting the whole step. If we're
      // already inside it (e.g. a knockback), don't clamp — always allow escape.
      if (overlap(box, w) && !already) {
        if (dx > 0) nx = Math.min(nx, w.x - player.w);
        else nx = Math.max(nx, w.x + w.w);
      }
    }
    player.x = nx;
  }
  // --- Vertical ---
  if (dy !== 0) {
    let ny = Math.max(0, Math.min(worldH - player.h, startY + dy));
    for (const w of walls) {
      const box = { x: player.x, y: ny, w: player.w, h: player.h };
      const already = overlap({ x: player.x, y: startY, w: player.w, h: player.h }, w);
      if (overlap(box, w) && !already) {
        if (dy > 0) ny = Math.min(ny, w.y - player.h);
        else ny = Math.max(ny, w.y + w.h);
      }
    }
    player.y = ny;
  }
}

// Step the player along one axis, one pixel at a time, up to `steps` pixels.
// If a step is blocked, CORNER ASSIST kicks in: nudge a few px sideways to slip
// into the opening (doorway/corridor) instead of catching on the wall — this is
// what makes the tight hallways feel smooth. If the feet already start inside a
// wall (e.g. a knockback), movement is allowed so we can never trap.
function stepAxisMask(sgnX, sgnY, steps) {
  if ((sgnX === 0 && sgnY === 0) || steps <= 0) return;
  const clampX = (v) => Math.max(0, Math.min(worldW - player.w, v));
  const clampY = (v) => Math.max(0, Math.min(worldH - player.h, v));
  const stuck = feetBlocked(player.x, player.y);
  // Perpendicular offsets to try when blocked (small = gentle auto-slide).
  const ASSIST = [3, -3, 6, -6, 9, -9];
  for (let i = 0; i < steps; i++) {
    let nx = clampX(player.x + sgnX),
      ny = clampY(player.y + sgnY);
    if (nx === player.x && ny === player.y) break; // hit world edge
    if (!stuck && feetBlocked(nx, ny)) {
      let slid = false;
      for (const d of ASSIST) {
        // Moving horizontally → nudge Y; moving vertically → nudge X.
        const tx = sgnX !== 0 ? nx : clampX(nx + d);
        const ty = sgnX !== 0 ? clampY(ny + d) : ny;
        if (!feetBlocked(tx, ty)) {
          nx = tx;
          ny = ty;
          slid = true;
          break;
        }
      }
      if (!slid) break; // truly walled in on this axis
    }
    player.x = nx;
    player.y = ny;
  }
}

// Is the player standing in a wall at the given position?
function playerInWall(x = player.x, y = player.y) {
  if (maskBits) return feetBlocked(x, y);
  const box = { x, y, w: player.w, h: player.h };
  return walls.some((w) => overlap(box, w));
}

// Safety net: if the player is ever overlapping wall geometry (a knockback or a
// respawn landing badly), search outward in a ring for the nearest wall-free spot
// and move them there. Guarantees the player is never embedded/stuck in a wall.
function unstickPlayer() {
  if (!playerInWall()) return;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  for (let r = 4; r <= 260; r += 4) {
    for (const [ox, oy] of dirs) {
      const nx = Math.max(0, Math.min(worldW - player.w, player.x + ox * r));
      const ny = Math.max(0, Math.min(worldH - player.h, player.y + oy * r));
      if (!playerInWall(nx, ny)) {
        player.x = nx;
        player.y = ny;
        return;
      }
    }
  }
}

// Main maze loop.
function startMazeLoop() {
  mazeRunning = true;
  loopMaze();
}
function stopMazeLoop() {
  mazeRunning = false;
  cancelAnimationFrame(mazeFrame);
}
function loopMaze() {
  if (!mazeRunning) return;
  // While a full-screen message is open, freeze the simulation but keep the loop
  // alive so it resumes cleanly the instant the message closes. This also means the
  // player can't be hit by a hazard while reading a message.
  if (overlayPaused) {
    mazeFrame = requestAnimationFrame(loopMaze);
    return;
  }
  const spd = player.speed * (state.speedBoost ? 2 : 1);
  let dx = 0,
    dy = 0;
  if (keys.up) dy -= spd;
  if (keys.down) dy += spd;
  if (keys.left) dx -= spd;
  if (keys.right) dx += spd;
  if (dx || dy) moverPlayer(dx, dy);
  if (playerInWall()) unstickPlayer(); // never let the player stay embedded

  // Speed trail: drop fading dots in the world so they fall behind the player.
  if (state.speedBoost && (dx || dy)) {
    trailCounter = (trailCounter + 1) % 3;
    if (trailCounter === 0) spawnTrail(player.x + player.w / 2, player.y + player.h / 2);
  }

  // Position player element.
  const pEl = document.getElementById("player");
  pEl.style.left = player.x + "px";
  pEl.style.top = player.y + "px";

  // Directional facing + walk/idle (VISUAL ONLY — the collision box is unchanged).
  const moving = !!(dx || dy);
  if (moving) {
    if (Math.abs(dx) > Math.abs(dy)) pEl.dataset.facing = dx < 0 ? "left" : "right";
    else pEl.dataset.facing = dy < 0 ? "back" : "front";
  }
  pEl.classList.toggle("walking", moving); // walk animation only while actually moving

  // Camera. Landscape = static full-maze OVERVIEW (whole maze in view, no follow);
  // portrait = camera follows the player. Collision/movement are unchanged either way.
  const world = document.getElementById("maze-world");
  const overview = window.matchMedia("(min-aspect-ratio: 1/1)").matches;
  let camX = 0,
    camY = 0;
  if (overview) {
    const vp = document.getElementById("maze-viewport");
    // Centre the (CSS-scaled) world in the viewport; scale is in CSS. Uses the
    // world's real size so it works for both the CSS maze and the image maze.
    world.style.left = (vp.clientWidth - world.offsetWidth) / 2 + "px";
    world.style.top = (vp.clientHeight - world.offsetHeight) / 2 + "px";
  } else {
    camX = VIEW_W / 2 - (player.x + player.w / 2);
    camY = VIEW_H / 2 - (player.y + player.h / 2);
    world.style.left = camX + "px";
    world.style.top = camY + "px";
  }

  checkCollectibles();
  checkZones();
  checkKeycard();
  updateHazards();
  updateDirectionArrows(camX, camY);

  mazeFrame = requestAnimationFrame(loopMaze);
}

// Pick up collectibles the player touches.
function checkCollectibles() {
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  liveCollectibles = liveCollectibles.filter((c) => {
    if (overlap(pBox, c)) {
      collect(c.data);
      c.el.remove();
      return false;
    }
    return true;
  });
}

function collect(data) {
  addScore(data.points);
  if (data.key === "family") state.family = (state.family || 0) + 1; // status counter
  // Apply the effect (with clear, visible feedback — see power-up functions below).
  if (data.effect === "shield") {
    activateShield(6);
  } else if (data.effect === "speed") {
    activateSpeed(5);
  } else if (data.effect === "health") {
    state.health = Math.min(5, state.health + 1);
    const hc = centerOf(document.getElementById("player"));
    floatText("+1 Health", hc.x, hc.y - 24, "#ff6b81");
  }
  // "bonus" effect (Family Token, Wellness Star) is a pure score bonus — no state change.
  updateHUD();
  // Feedback: floating score, particle burst, and a sound at the player.
  const c = centerOf(document.getElementById("player"));
  const warm = data.effect === "bonus"; // Family / Wellness get a warmer, bigger popup
  const color = warm ? "#ff9e6d" : "#ffd34d";
  floatText(`+${data.points}`, c.x, c.y, color, warm);
  burst(c.x, c.y, color);
  playSound("collect");
  // Show the labeled bonus + personal message as a large, centered overlay.
  bigMessage(rand(data.messages), {
    icon: data.emoji,
    title: `+${data.points} ${data.bonusLabel}`,
    tone: warm ? "bonus" : "good",
    duration: 1500,
  });
}

/* ---------- Power-up effects (Phase 6 — clear, visible feedback) ---------- */
let shieldTimer = null;
let shieldCountdown = null;
let speedTimer = null;
let speedCountdown = null;
let trailCounter = 0;

// Shield: a bubble around the player + a HUD countdown. Absorbs one hazard hit
// (see the sprint hit code, which checks state.shielded).
function activateShield(seconds = 6) {
  state.shielded = true;
  const pEl = document.getElementById("player");
  pEl.classList.remove("shield-break");
  pEl.classList.add("shielded");
  updateHUD();
  let remaining = seconds;
  const hud = document.getElementById("hud-shield");
  hud.textContent = `🛡 ${remaining}`;
  clearInterval(shieldCountdown);
  shieldCountdown = setInterval(() => {
    remaining--;
    hud.textContent = remaining > 0 ? `🛡 ${remaining}` : "🛡";
    if (remaining <= 0) clearInterval(shieldCountdown);
  }, 1000);
  clearTimeout(shieldTimer);
  shieldTimer = setTimeout(endShield, seconds * 1000);
}
function endShield() {
  state.shielded = false;
  const pEl = document.getElementById("player");
  pEl.classList.remove("shielded");
  pEl.classList.add("shield-break"); // brief break animation
  setTimeout(() => pEl.classList.remove("shield-break"), 400);
  document.getElementById("hud-shield").textContent = "🛡";
  updateHUD();
}

// Speed: faster movement + a trail in the world + a HUD countdown.
function activateSpeed(seconds = 5) {
  state.speedBoost = true;
  const c = centerOf(document.getElementById("player"));
  floatText("Speed Boost!", c.x, c.y - 22, "#6fd3ff");
  let remaining = seconds;
  const hud = document.getElementById("hud-speed");
  hud.textContent = `⚡ ${remaining}`;
  hud.classList.add("on");
  clearInterval(speedCountdown);
  speedCountdown = setInterval(() => {
    remaining--;
    hud.textContent = remaining > 0 ? `⚡ ${remaining}` : "";
    if (remaining <= 0) {
      clearInterval(speedCountdown);
      hud.classList.remove("on");
    }
  }, 1000);
  clearTimeout(speedTimer);
  speedTimer = setTimeout(() => {
    state.speedBoost = false;
  }, seconds * 1000);
}

// Drop a fading dot into the world behind the player (used while speeding).
function spawnTrail(x, y) {
  const world = document.getElementById("maze-world");
  if (!world) return;
  const d = document.createElement("div");
  d.className = "trail";
  d.style.left = x + "px";
  d.style.top = y + "px";
  world.appendChild(d);
  setTimeout(() => d.remove(), 450);
}

// Clear all power-up visuals/timers at the start of a run.
function resetPowerups() {
  clearTimeout(shieldTimer);
  clearInterval(shieldCountdown);
  clearTimeout(speedTimer);
  clearInterval(speedCountdown);
  const pEl = document.getElementById("player");
  if (pEl) pEl.classList.remove("shielded", "shield-break");
  const hs = document.getElementById("hud-shield");
  if (hs) hs.textContent = "🛡";
  const sp = document.getElementById("hud-speed");
  if (sp) {
    sp.textContent = "";
    sp.classList.remove("on");
  }
}

/* ---------- Patrolling flu hazards ---------- */
// Flu germs drift up and down the lanes. Touch one and you take a hit
// (lose health + points) unless your shield is up, which absorbs it.
function spawnHazards(worldEl) {
  hazards = [
    { x: 100, y: 300, w: 30, h: 30, min: 200, max: 950, vy: 2.0 }, // lane 1
    { x: 340, y: 600, w: 30, h: 30, min: 250, max: 950, vy: -2.2 }, // lane 2
    { x: 500, y: 350, w: 30, h: 30, min: 200, max: 950, vy: 1.8 }, // lane 3
    { x: 760, y: 700, w: 30, h: 30, min: 250, max: 950, vy: -2.0 }, // lane 4
    { x: 900, y: 400, w: 30, h: 30, min: 200, max: 520, vy: 2.4 }, // lane 5 (upper)
  ];
  hazardCooldown = 0;
  hazards.forEach((h) => {
    const d = document.createElement("div");
    d.className = "hazard";
    d.innerHTML = '<img class="hazard-img" src="assets/icons/germ.png?v=1" alt="">';
    d.style.left = h.x + "px";
    d.style.top = h.y + "px";
    worldEl.appendChild(d);
    h.el = d;
  });
}
function updateHazards() {
  if (hazardCooldown > 0) hazardCooldown--;
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  hazards.forEach((h) => {
    h.y += h.vy;
    if (h.y <= h.min || h.y >= h.max) h.vy *= -1;
    h.el.style.top = h.y + "px";
    if (hazardCooldown === 0 && overlap(pBox, { x: h.x, y: h.y, w: h.w, h: h.h })) {
      hitByHazard();
    }
  });
}
function hitByHazard() {
  hazardCooldown = 45; // ~0.75s immunity so one germ doesn't drain you instantly
  const c = centerOf(document.getElementById("player"));
  if (state.shielded) {
    endShield();
    playSound("shield");
    floatText("Shield blocked it!", c.x, c.y, "#6fd3ff");
    return;
  }
  state.health = Math.max(0, state.health - 1);
  state.score = Math.max(0, state.score - 30);
  updateHUD();
  playSound("hit");
  shake();
  floatText("-30", c.x, c.y, "#ff6b6b");
  bigMessage(rand(HAZARD_LINES), {
    icon: "🦠",
    title: "-30",
    tone: "warn",
    duration: 1500,
  });
  // Small knockback — but ONLY if the destination is clear floor. Uses the pixel
  // mask (playerInWall), because in image-maze mode the `walls` array is empty, so
  // the old `walls.some(...)` check always passed and shoved the player straight
  // into a wall in tight corridors (the "stuck on the wall after a germ" bug).
  const backX = Math.max(20, player.x - 40);
  if (!playerInWall(backX, player.y)) player.x = backX;
  unstickPlayer(); // final safety net — never leave the player inside a wall
  if (state.health <= 0) {
    state.health = 3;
    updateHUD();
    player.x = START_X;
    player.y = START_Y; // back to the START (the SHN reception, top-left)
    unstickPlayer();
    bigMessage("The flu caught up — back to the start. Keep going!", {
      icon: "🏥",
      tone: "warn",
      duration: 1800,
    });
  }
}

// Correction lines shown when a flu hazard catches the player.
const HAZARD_LINES = [
  "Flu slowed you down — stay protected out there.",
  "Watch out for the flu! Vaccination lowers your risk.",
  "The flu caught you. A flu shot helps you bounce back faster.",
];

/* ---------- Keycard + locked vault ---------- */
function checkKeycard() {
  if (!keycard) return;
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  // If you reach the still-locked vault, tell you what to do (once).
  if (lockedDoor && !vaultHintShown) {
    const d = lockedDoor.rect;
    if (overlap(pBox, { x: d.x - 70, y: d.y - 40, w: d.w + 130, h: d.h + 80 })) {
      vaultHintShown = true;
      toast("Locked vault — find the 🔑 keycard in the maze to open it.", 2400);
    }
  }
  if (!overlap(pBox, keycard)) return;
  const c = centerOf(document.getElementById("player"));
  keycard.el.remove();
  keycard = null;
  if (lockedDoor) {
    walls = walls.filter((w) => w !== lockedDoor.rect); // door no longer blocks
    lockedDoor.el.remove();
    lockedDoor = null;
  }
  playSound("success");
  floatText("Keycard!", c.x, c.y, "#ffd34d");
  toast("Keycard found — the bonus vault is unlocked!", 2200);
}

/* ---------- Mission: visit all four clinics ---------- */
function updateMission() {
  const count = Object.keys(missionVisited).length;
  const txt = missionDone
    ? "✅ Mission complete — all 4 clinics visited!"
    : `Mission: visit all 4 clinics (${count}/4)`;
  const el = document.getElementById("mission");
  if (el) el.textContent = txt;
  const el2 = document.getElementById("mhud-mission");
  if (el2) el2.textContent = txt;
}
function markClinicVisited(key) {
  // Visual "completed" state on the clinic door in the maze.
  const zEl = document.querySelector(`.zone[data-key="${key}"]`);
  if (zEl) zEl.classList.add("done");
  if (missionDone) return;
  missionVisited[key] = true;
  if (Object.keys(missionVisited).length >= ZONES.length) {
    missionDone = true;
    state.score += 500;
    updateHUD();
    toast("Mission complete! +500 — all clinics visited.", 2400);
    playSound("success");
  }
  updateMission();
}

// Detect when the player stands on a mini-game zone.
let zoneCooldown = false;
let linkZones = []; // walk-in website links (e.g. VaxFacts+), built in buildImageMaze
const ZONE_HIT = 56; // trigger box (centred on z.x,z.y) — small, so it only fires inside the room
function checkZones() {
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  const hitBox = (z) => ({
    x: z.x - ZONE_HIT / 2,
    y: z.y - ZONE_HIT / 2,
    w: ZONE_HIT,
    h: ZONE_HIT,
  });
  const onAnyZone =
    ZONES.some((z) => overlap(pBox, hitBox(z))) || linkZones.some((z) => overlap(pBox, hitBox(z)));
  // While cooled down (just declined a zone or just finished a mini-game), wait until
  // the player physically walks off the zone before it can trigger again. No teleport.
  if (zoneCooldown) {
    if (!onAnyZone) zoneCooldown = false;
    return;
  }
  for (const z of ZONES) {
    if (overlap(pBox, hitBox(z))) {
      openZonePopup(z);
      return;
    }
  }
  for (const z of linkZones) {
    if (overlap(pBox, hitBox(z))) {
      openLinkZonePopup(z);
      return;
    }
  }
}

// Walk-in VaxFacts+ clinic: a celebratory "you made it!" overlay (confetti) that
// then links out to the real SHN VaxFacts page.
function openLinkZonePopup(z) {
  zoneCooldown = true;
  stopMazeLoop();
  let ov = document.getElementById("vax-congrats");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "vax-congrats";
    document.getElementById("game").appendChild(ov);
  }
  // Confetti pieces (colourful, random fall).
  const colors = ["#ff5e7e", "#ffd34d", "#4fd1c5", "#5b8cff", "#a06bff", "#57d38c", "#ff9e6d"];
  let confetti = "";
  for (let i = 0; i < 70; i++) {
    const c = colors[i % colors.length];
    confetti +=
      `<span class="vc-piece" style="left:${(Math.random() * 100).toFixed(1)}%;` +
      `background:${c};animation-delay:${(Math.random() * 2.5).toFixed(2)}s;` +
      `animation-duration:${(2.6 + Math.random() * 2.4).toFixed(2)}s;` +
      `width:${6 + Math.floor(Math.random() * 6)}px"></span>`;
  }
  ov.innerHTML =
    `<div class="vc-confetti">${confetti}</div>` +
    '<div class="vc-card">' +
    '<div class="vc-emoji">🎉</div>' +
    '<h2 class="vc-title">Congratulations!</h2>' +
    '<p class="vc-sub">You made it to the VaxFacts Clinic!</p>' +
    "<p class=\"vc-text\">You've completed the maze and learned how vaccines help protect you and your community. Now you're ready to take the next step: <b>consider getting your flu shot!</b></p>" +
    '<p class="vc-text">Have questions or want to learn more? Visit <b>SHN VaxFacts</b>. You can also contact them or book an appointment, and the team will help you get started.</p>' +
    '<div class="vc-btns">' +
    '<button class="btn btn-primary vc-visit" type="button">Visit SHN VaxFacts</button>' +
    '<button class="btn vc-back" type="button">Back to maze</button>' +
    "</div>" +
    "</div>";
  ov.classList.add("show");
  playSound("success");
  const r = ov.getBoundingClientRect();
  burst(r.left + r.width * 0.3, r.top + r.height * 0.32, "#ffd34d", 16);
  burst(r.left + r.width * 0.7, r.top + r.height * 0.32, "#ff5e7e", 16);
  const close = () => {
    ov.classList.remove("show");
    ov.innerHTML = "";
    resumeMazeAfterZone();
  };
  ov.querySelector(".vc-visit").onclick = () => {
    window.open(z.url, "_blank", "noopener");
    close();
  };
  ov.querySelector(".vc-back").onclick = close;
}

// Pop-up asking the player to start a mini-game.
function openZonePopup(zone) {
  zoneCooldown = true;
  stopMazeLoop();
  showPopup(zone.label, rand(FACTS), [
    {
      text: "Start",
      primary: true,
      action: () => {
        hidePopup();
        startMiniGame(zone.key);
      },
    },
    {
      text: "Not now",
      action: () => {
        hidePopup();
        resumeMazeAfterZone();
      },
    },
  ]);
}
function resumeMazeAfterZone() {
  // No teleport — the player simply walks off the zone and checkZones re-arms it.
  startMazeLoop();
}

// Direction arrows: show where each mini-game is relative to the player.
function buildDirectionArrows() {
  const box = document.getElementById("direction-arrows");
  box.innerHTML = "";
  ZONES.forEach((z) => {
    const a = document.createElement("div");
    a.className = "dir";
    a.style.background = z.color;
    a.style.color = "#fff";
    a.dataset.key = z.key;
    a.textContent = `${z.icon} ${z.short}`;
    box.appendChild(a);
  });
}
// Keep arrows pinned to screen edges pointing toward their zone.
function updateDirectionArrows(camX, camY) {
  document.querySelectorAll("#direction-arrows .dir").forEach((a) => {
    const z = ZONES.find((zz) => zz.key === a.dataset.key);
    // Zone center in screen coordinates (z.x,z.y is already the centre).
    let sx = z.x + camX;
    let sy = z.y + camY;
    const margin = 28;
    const onScreen = sx > 0 && sx < VIEW_W && sy > 60 && sy < VIEW_H;
    a.style.opacity = onScreen ? "0" : "1"; // hide arrow when zone is visible
    sx = Math.max(margin, Math.min(VIEW_W - margin, sx));
    sy = Math.max(60, Math.min(VIEW_H - margin, sy));
    a.style.left = sx + "px";
    a.style.top = sy + "px";
  });
}

/* =========================================================
   6. MINI-GAMES
   ========================================================= */

let currentMini = null;
let miniTimers = [];
function clearMiniTimers() {
  miniTimers.forEach((t) => clearInterval(t));
  miniTimers.forEach((t) => clearTimeout(t));
  miniTimers = [];
}

// Return to maze from any mini-game.
function exitMiniGame() {
  clearMiniTimers();
  currentMini = null;
  showScreen("screen-maze");
  zoneCooldown = true; // keep armed-off until the player walks off the zone
  resumeMazeAfterZone();
}

function startMiniGame(key) {
  currentMini = key;
  markClinicVisited(key);
  if (key === "sprint") startSprint();
  else if (key === "freeze") startFreeze();
  else if (key === "darts") startDarts();
  else if (key === "memory") startMemory();
}

/* ---------- 6a. HOSPITAL SPRINT ---------- */
// Rebuilt per Milestone F: a runner. Jump over ground obstacles, slide under
// overhead ones, collect boosts. Speed rises; a progress bar tracks the finish.
let sprintActive = false;
let sprintFrame = null;
let sprint = {};

function startSprint() {
  showScreen("screen-sprint");
  showPopup(
    "Hospital Sprint",
    "Your shift is moving fast. Move between lanes to grab boosts and dodge flu obstacles rushing toward you.\n\n" +
      "• ← / → (or swipe) to switch lanes.\n• Space / Up / tap to jump over low obstacles.\n• Down (or swipe down) to duck under high barriers.\n• Run into boosts to collect them. Reach the finish before time runs out.",
    [
      {
        text: "Start Sprint",
        primary: true,
        action: () => {
          hidePopup();
          beginSprintRound();
        },
      },
    ],
  );
}

// ===== Hospital Sprint — perspective "into-the-screen" runner =====
// Geometry as fractions of the stage, tuned to assets/minigames/sprint-bg.png
// (the FINISH is the vanishing point). PHASE 1 = the look: the corridor backdrop
// with obstacles/pickups rushing toward the camera down 3 lanes, and the
// back-facing player at the near centre. (Controls + collision come next.)
const SPR3 = {
  vpx: 0.51, // vanishing point X (the FINISH), fraction of stage width
  vpy: 0.36, // vanishing point Y
  nearY: 0.9, // ground line near the bottom (runner's feet)
  lanes: [0.4, 0.5, 0.6], // near X of the left / centre / right lanes
  depth: 6, // perspective strength (bigger = things shrink faster with distance)
  baseSize: 130, // near pixel size of an object
};
function sprProject(stage, laneFrac, z) {
  const W = stage.clientWidth || 800,
    H = stage.clientHeight || 450;
  const a = 1 / (1 + Math.max(0, z) * SPR3.depth); // apparent scale (1 = at the camera, ~0 = far)
  const vx = SPR3.vpx * W,
    vy = SPR3.vpy * H,
    ny = SPR3.nearY * H;
  return { x: vx + (laneFrac * W - vx) * a, y: vy + (ny - vy) * a, scale: a };
}
function positionRunner(stage) {
  const r = stage.querySelector(".spr3-runner");
  if (!r) return;
  const p = sprProject(stage, SPR3.lanes[sprint.lane], 0.02);
  r.style.left = p.x + "px";
  r.style.top = p.y - sprint.jumpOffset + "px";
  r.style.transform = `translate(-50%, -100%) scaleY(${sprint.sliding ? 0.55 : 1})`;
}

function beginSprintRound() {
  const stage = document.getElementById("sprint-stage");
  stage.classList.add("sprint3d");
  stage.innerHTML =
    '<div class="spr3-scene"></div>' +
    '<div class="spr3-speed"></div>' +
    '<div class="spr3-vignette"></div>' +
    '<div class="sprint-progress"><div class="sprint-progress-fill" id="sprint-fill"></div></div>' +
    '<div class="spr3-runner character-stage" data-facing="back"></div>';
  buildCharacter(stage.querySelector(".spr3-runner"));
  sprint = {
    score: 0,
    time: 60,
    speed: 5,
    dist: 0,
    target: 14000,
    lane: 1, // 0 = left, 1 = centre, 2 = right
    jumpOffset: 0,
    vjump: 0,
    jumping: false,
    sliding: false,
    slideT: 0,
    hitT: 0,
    objs: [],
    spawnGap: 40,
    scene: stage.querySelector(".spr3-scene"),
  };
  document.getElementById("sprint-score").textContent = 0;
  document.getElementById("sprint-time").textContent = 60;
  toast("Run! Keep your plans. Not the flu.", 1800);
  miniTimers.push(
    setInterval(() => {
      sprint.time--;
      document.getElementById("sprint-time").textContent = sprint.time;
      if (sprint.time <= 0) finishSprint();
    }, 1000),
  );
  positionRunner(stage);
  setupSprintTouch(stage);
  sprintActive = true;
  cancelAnimationFrame(sprintFrame);
  sprintLoop();
}

// Touch / mouse gestures for the sprint stage: swipe to change lane, swipe up
// to jump, swipe down to duck, tap to jump.
function setupSprintTouch(stage) {
  let sx = 0,
    sy = 0,
    down = false;
  const start = (e) => {
    down = true;
    const t = e.touches ? e.touches[0] : e;
    sx = t.clientX;
    sy = t.clientY;
  };
  const end = (e) => {
    if (!down) return;
    down = false;
    const t = e.changedTouches ? e.changedTouches[0] : e;
    const dx = t.clientX - sx,
      dy = t.clientY - sy;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
      sprintJump(); // tap
    } else if (Math.abs(dx) > Math.abs(dy)) {
      sprintMove(dx > 0 ? 1 : -1);
    } else if (dy < 0) {
      sprintJump();
    } else {
      sprintSlide();
    }
  };
  stage.addEventListener("touchstart", start, { passive: true });
  stage.addEventListener("touchend", end);
  stage.addEventListener("mousedown", start);
  stage.addEventListener("mouseup", end);
}

function sprintMove(dir) {
  if (!sprintActive) return;
  const next = Math.max(0, Math.min(2, sprint.lane + dir));
  if (next === sprint.lane) return;
  sprint.lane = next;
  playSound("collect");
}
function sprintJump() {
  if (!sprintActive || sprint.jumping || sprint.sliding) return;
  sprint.jumping = true;
  sprint.vjump = 21; // higher launch so a good jump fully clears obstacles
  playSound("collect");
}
function sprintSlide() {
  if (!sprintActive || sprint.sliding || sprint.jumping) return;
  sprint.sliding = true;
  sprint.slideT = 55; // stay down longer so overhead obstacles fully pass
}

function spawnSprintObj() {
  const collect = Math.random() < 0.5;
  const data = collect ? rand(SPRINT_COLLECT) : rand(SPRINT_OBSTACLES);
  const el = document.createElement("div");
  el.className = "spr3-obj " + (collect ? "spr3-collect" : "spr3-obstacle");
  el.innerHTML = SPRINT_ICONS[data.icon];
  sprint.scene.appendChild(el);
  sprint.objs.push({
    el,
    z: 1, // 1 = far (at the FINISH), 0 = at the camera
    lane: Math.floor(Math.random() * 3),
    kind: collect ? "collect" : "obstacle",
    data,
  });
}

function sprintLoop() {
  const screen = document.getElementById("screen-sprint");
  if (!sprintActive || !screen.classList.contains("active")) {
    sprintActive = false;
    return;
  }
  if (overlayPaused) {
    sprintFrame = requestAnimationFrame(sprintLoop);
    return;
  }
  const stage = document.getElementById("sprint-stage");

  // Same run-speed model as before (drives the finish progress + spawn rate).
  sprint.speed = Math.min(6, 3 + sprint.dist / 4500);
  sprint.dist += sprint.speed;
  const fill = document.getElementById("sprint-fill");
  if (fill) fill.style.width = Math.min(100, (sprint.dist / sprint.target) * 100) + "%";
  if (sprint.dist >= sprint.target) {
    finishSprint();
    return;
  }

  if (--sprint.spawnGap <= 0) {
    spawnSprintObj();
    sprint.spawnGap = 34 + Math.random() * 26;
  }

  // Jump / slide physics (updated every frame).
  if (sprint.jumping) {
    sprint.jumpOffset += sprint.vjump;
    sprint.vjump -= 1.4; // gravity
    if (sprint.jumpOffset <= 0) {
      sprint.jumpOffset = 0;
      sprint.vjump = 0;
      sprint.jumping = false;
    }
  }
  if (sprint.sliding && --sprint.slideT <= 0) sprint.sliding = false;
  if (sprint.hitT > 0) sprint.hitT--;

  // Move each object toward the camera (z: 1 -> 0), projecting it down the corridor.
  const dz = sprint.speed * 0.0018; // approach rate tied to the run speed
  sprint.objs = sprint.objs.filter((o) => {
    o.z -= dz;
    // Resolve the encounter as the object reaches the runner's plane.
    if (!o.done && o.z <= 0.05) {
      o.done = true;
      resolveSprintEncounter(o, stage);
    }
    if (o.z <= -0.06) {
      o.el.remove();
      return false;
    }
    const p = sprProject(stage, SPR3.lanes[o.lane], o.z);
    o.el.style.left = p.x + "px";
    o.el.style.top = p.y + "px";
    o.el.style.transform = `translate(-50%, -100%) scale(${(SPR3.baseSize * p.scale) / 48})`;
    o.el.style.zIndex = 20 + Math.round((1 - Math.max(0, o.z)) * 60);
    return true;
  });

  positionRunner(stage);
  sprintFrame = requestAnimationFrame(sprintLoop);
}

// Decide what happens when an object reaches the runner's plane.
// Same lane? A collect is grabbed; a low obstacle must be jumped, a high
// (overhead) obstacle must be ducked, or it's a hit. Other lanes are safe.
function resolveSprintEncounter(o, stage) {
  if (o.lane !== sprint.lane) return; // dodged by being in another lane
  if (o.kind === "collect") {
    sprintHit(o, stage);
    return;
  }
  const cleared = o.data.overhead
    ? sprint.sliding // duck under high barriers
    : sprint.jumping && sprint.jumpOffset > 34; // jump over low obstacles
  if (!cleared) sprintHit(o, stage);
}

function sprintHit(o, stage) {
  stage = stage || document.getElementById("sprint-stage");
  const r = stage.getBoundingClientRect();
  const p = sprProject(stage, SPR3.lanes[o.lane], Math.max(0, o.z));
  const cx = r.left + p.x * FIT,
    cy = r.top + (p.y - 24) * FIT;
  if (o.kind === "collect") {
    sprint.score += o.data.score;
    addScore(o.data.score);
    floatText(`+${o.data.score}`, cx, cy, "#ffd34d");
    burst(cx, cy, "#ffd34d");
    playSound("success");
    bigMessage(o.data.msg, { title: `+${o.data.score}`, tone: "good", duration: 1300 });
  } else {
    if (sprint.hitT > 0) return; // brief grace so one stumble isn't punished twice
    sprint.hitT = 45;
    sprint.score = Math.max(0, sprint.score - 50);
    state.score = Math.max(0, state.score - 50);
    playSound("hit");
    shake();
    floatText("-50", cx, cy, "#ff6b6b");
    bigMessage(o.data.msg, { icon: "⚠️", title: "-50", tone: "warn", duration: 1600 });
  }
  document.getElementById("sprint-score").textContent = sprint.score;
}

function finishSprint() {
  sprintActive = false;
  cancelAnimationFrame(sprintFrame);
  clearMiniTimers();
  showPopup(
    "Sprint complete! You stayed ahead of flu season.",
    `Hospital Sprint Score: ${sprint.score}\n\nKeep your plans. Not the flu.`,
    [
      {
        text: "Return to Maze",
        primary: true,
        action: () => {
          hidePopup();
          exitMiniGame();
        },
      },
    ],
  );
}

/* ---------- 6b. FLU FREEZE ---------- */
// Rebuilt per Milestone F: swipe/drag across items to slice them. Positive and
// negative items look identical (no colour tell) — read before you slice.
let freezeActive = false;
let freezeFrame = null;
let freeze = {};

function startFreeze() {
  showScreen("screen-freeze");
  showPopup(
    "Flu Freeze",
    "• Tap / click a virus to zap it.\n• Zap the TRUE statements for points.\n• Misconceptions cost a life — leave them and they clear on their own.\n• Read before you zap. You have 3 lives.",
    [
      {
        text: "Start Flu Freeze",
        primary: true,
        action: () => {
          hidePopup();
          beginFreezeRound();
        },
      },
    ],
  );
}

// Fixed, organised slots where virus bubbles appear (fractions of the stage,
// kept in the upper hallway so they don't cover the nurse at the bottom).
const FREEZE_SLOTS = [
  { fx: 0.22, fy: 0.26 },
  { fx: 0.5, fy: 0.21 },
  { fx: 0.78, fy: 0.27 },
  { fx: 0.32, fy: 0.55 },
  { fx: 0.63, fy: 0.56 },
  { fx: 0.85, fy: 0.53 },
];
const FREEZE_MAX_ONSCREEN = 4; // how many bubbles float at once

function beginFreezeRound() {
  const stage = document.getElementById("freeze-stage");
  stage.innerHTML = "";
  freeze = {
    score: 0,
    lives: 3,
    time: 60,
    combo: 0,
    bubbles: [],
    paused: false,
    corrT: null,
  };
  document.getElementById("freeze-score").textContent = 0;
  document.getElementById("freeze-lives").textContent = 3;
  document.getElementById("freeze-time").textContent = 60;
  toast("Read each virus — zap only the TRUE ones.", 2200);

  // Keep empty slots filling so the board cycles gently.
  miniTimers.push(setInterval(freezeRefill, 950));
  miniTimers.push(
    setInterval(() => {
      if (freeze.paused) return; // don't lose time while reading a correction
      freeze.time--;
      document.getElementById("freeze-time").textContent = freeze.time;
      if (freeze.time <= 0) finishFreeze();
    }, 1000),
  );

  freezeActive = true;
  cancelAnimationFrame(freezeFrame);
  freezeLoop();
  freezeRefill(); // fill the board immediately
}

// Fill any empty slots (up to the on-screen cap) with fresh virus bubbles.
function freezeRefill() {
  if (!freezeActive || freeze.paused) return;
  const alive = freeze.bubbles.filter((b) => !b.dead);
  if (alive.length >= FREEZE_MAX_ONSCREEN) return;
  const used = new Set(alive.map((b) => b.slot));
  const free = FREEZE_SLOTS.map((_, i) => i).filter((i) => !used.has(i));
  if (!free.length) return;
  spawnFreezeBubble(free[Math.floor(Math.random() * free.length)]);
}

// Create one virus bubble in the given slot. Positive and negative bubbles look
// IDENTICAL (same neutral virus orb) — the player must READ the text to decide.
function spawnFreezeBubble(slot) {
  if (!freezeActive) return;
  const stage = document.getElementById("freeze-stage");
  const positive = Math.random() < 0.5;
  const data = positive ? rand(FREEZE_POSITIVE) : rand(FREEZE_NEGATIVE);
  const s = FREEZE_SLOTS[slot];
  const el = document.createElement("div");
  el.className = "freeze-bubble";
  el.style.left = s.fx * stage.clientWidth + "px";
  el.style.top = s.fy * stage.clientHeight + "px";
  const inner = document.createElement("div");
  inner.className = "freeze-bubble-inner";
  inner.textContent = data.text;
  // Vary the gentle float so they don't bob in sync.
  inner.style.animationDuration = (2.6 + Math.random() * 1.6).toFixed(2) + "s";
  inner.style.animationDelay = (-Math.random() * 2).toFixed(2) + "s";
  el.appendChild(inner);
  stage.appendChild(el);
  const bubble = {
    el,
    slot,
    positive,
    data,
    dead: false,
    removed: false,
    age: 0,
    // Stay on screen long enough to read (facts linger a touch longer).
    life: positive ? 560 + Math.random() * 200 : 500 + Math.random() * 160,
  };
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    zapFreezeBubble(bubble);
  });
  freeze.bubbles.push(bubble);
}

function freezeLoop() {
  const screen = document.getElementById("screen-freeze");
  if (!freezeActive || !screen.classList.contains("active")) {
    freezeActive = false;
    return;
  }
  if (!freeze.paused) {
    for (const b of freeze.bubbles) {
      if (b.dead) continue;
      b.age++;
      if (b.age > b.life) expireFreezeBubble(b); // fades out on its own → cycles
    }
    freeze.bubbles = freeze.bubbles.filter((b) => !b.removed);
  }
  freezeFrame = requestAnimationFrame(freezeLoop);
}

// A bubble left alone long enough quietly fades and frees its slot. Missing a
// FACT resets the combo; ignoring a misconception is correct (no penalty).
function expireFreezeBubble(b) {
  if (b.dead) return;
  b.dead = true;
  if (b.positive) freeze.combo = 0;
  b.el.classList.add("expire");
  setTimeout(() => {
    b.el.remove();
    b.removed = true;
  }, 480);
}

// Fire a quick laser beam from the nurse (bottom-left) to the bubble.
function fireFreezeBeam(stage, tx, ty) {
  const ox = 0.34 * stage.clientWidth,
    oy = 0.9 * stage.clientHeight;
  const dx = tx - ox,
    dy = ty - oy;
  const beam = document.createElement("div");
  beam.className = "freeze-beam";
  beam.style.left = ox + "px";
  beam.style.top = oy + "px";
  beam.style.width = Math.hypot(dx, dy) + "px";
  beam.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
  stage.appendChild(beam);
  setTimeout(() => beam.remove(), 300);
}

// Player zapped a bubble: score a fact, penalise a misconception; either way it
// pops and its slot re-fills with a new message.
function zapFreezeBubble(b) {
  if (!freezeActive || freeze.paused || b.dead) return;
  b.dead = true;
  const stage = document.getElementById("freeze-stage");
  const r = stage.getBoundingClientRect();
  const bx = parseFloat(b.el.style.left),
    by = parseFloat(b.el.style.top);
  fireFreezeBeam(stage, bx, by);
  b.el.classList.add("zapped");
  setTimeout(() => {
    b.el.remove();
    b.removed = true;
  }, 520); // let the freeze-over + shatter finish
  const cx = r.left + bx * FIT,
    cy = r.top + by * FIT;
  if (b.positive) {
    freeze.combo++;
    freeze.score += b.data.score;
    addScore(b.data.score);
    floatText(`+${b.data.score}`, cx, cy, "#ffd34d");
    burst(cx, cy, "#bfefff"); // icy frost particles
    playSound("success");
    if (freeze.combo >= 3) toast(`Combo x${freeze.combo}!`, 900);
  } else {
    freeze.combo = 0;
    freeze.lives--;
    document.getElementById("freeze-lives").textContent = freeze.lives;
    floatText("−1 life", cx, cy, "#ff6b6b");
    burst(cx, cy, "#cfe8ff"); // icy frost particles
    playSound("error");
    shake();
    // Big centered correction card — pauses the game so it can be read.
    showFreezeCorrection(b, freeze.lives <= 0);
  }
  document.getElementById("freeze-score").textContent = freeze.score;
}

// Prominent "here's the correction" overlay shown after a wrong slice.
function showFreezeCorrection(item, final) {
  const stage = document.getElementById("freeze-stage");
  let ov = document.getElementById("freeze-correction");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "freeze-correction";
    ov.className = "mg-correction";
    stage.appendChild(ov);
  }
  ov.innerHTML =
    '<div class="mg-correction-card">' +
    `<div class="mg-correction-tag">${rand(FREEZE_LIFE_LOST)}</div>` +
    `<div class="mg-correction-item">${item.data.text}</div>` +
    `<div class="mg-correction-text">${item.data.feedback}</div>` +
    `<div class="mg-correction-lives">${final ? "No lives left" : "Lives left: " + freeze.lives}</div>` +
    "</div>";
  ov.classList.add("show");
  freeze.paused = true;
  clearTimeout(freeze.corrT);
  freeze.corrT = setTimeout(() => {
    ov.classList.remove("show");
    freeze.paused = false;
    if (final) finishFreeze();
  }, 2800);
}

function finishFreeze() {
  if (!freezeActive) return; // guard against a stray correction timeout after exit
  clearTimeout(freeze.corrT);
  freezeActive = false;
  cancelAnimationFrame(freezeFrame);
  clearMiniTimers();
  showPopup(
    "Flu Freeze complete! You protected the moments that matter.",
    `Flu Freeze Score: ${freeze.score}\n\nStay healthy for the moments that matter.`,
    [
      {
        text: "Return to Maze",
        primary: true,
        action: () => {
          hidePopup();
          exitMiniGame();
        },
      },
    ],
  );
}

/* ---------- 6c. VACCINE DARTS ---------- */
let darts = {};
// Rebuilt per Milestone F: drag from the thrower to aim, release to throw a dart.
// Myth and fact boards are styled identically (no colour tell) — read before you shoot.
let dartsActive = false;
let dartsFrame = null;

function startDarts() {
  showScreen("screen-darts");
  // Opening / instructions screen before the round begins.
  showPopup(
    "Vaccine Darts",
    "Flu vaccine myths and facts are moving across the screen. Hit the myths without striking the facts.",
    [
      {
        text: "Start Vaccine Darts",
        primary: true,
        action: () => {
          hidePopup();
          beginDartsRound();
        },
      },
    ],
  );
  // Re-render the instruction text with MYTHS in red and FACTS in green. The
  // statement cards themselves stay neutral — this only colours the instructions.
  document.getElementById("popup-text").innerHTML =
    "One statement rings each colour section of the dartboard. Lock a " +
    '<b class="fact-word">TRUE</b> statement into every colour.<br><br>' +
    "• Tap a statement to dart it — you're saying it's <b class=\"fact-word\">TRUE</b>.<br>" +
    '• A <b class="fact-word">TRUE</b> one locks into its colour. ✅<br>' +
    '• A <b class="myth-word">MYTH</b> clears and a new statement appears there. 🔄<br>' +
    "• Fill all five colours before time runs out. Read carefully!";
}

// The five colour sections of the wall dartboard. `ang` is each wedge's centroid
// angle (degrees, 0 = east, 90 = down) — matched to the photo's colour layout so
// each statement card lands on its own colour.
const DART_SECTIONS = [
  { key: "green", color: "#2e9e46", ang: -54 },
  { key: "red", color: "#d23b34", ang: 18 },
  { key: "purple", color: "#6a3fb0", ang: 90 },
  { key: "orange", color: "#e08a1e", ang: 162 },
  { key: "blue", color: "#2f6fd0", ang: 234 },
];
// Where the dartboard sits INSIDE darts-bg.png (fractions of the image) so we can
// project each section onto the screen no matter how `cover` crops the photo.
const DART_IMG = { w: 1536, h: 1024, cx: 0.514, cy: 0.386, r: 0.16 };
function dartBoardGeom(stage) {
  const W = stage.clientWidth,
    H = stage.clientHeight;
  const scale = Math.max(W / DART_IMG.w, H / DART_IMG.h); // cover
  const dispW = DART_IMG.w * scale,
    dispH = DART_IMG.h * scale;
  return {
    cx: (W - dispW) / 2 + DART_IMG.cx * dispW,
    cy: (H - dispH) / 2 + DART_IMG.cy * dispH,
    r: DART_IMG.r * dispW,
  };
}
function dartSectionPos(geom, i) {
  const a = (DART_SECTIONS[i].ang * Math.PI) / 180;
  const rr = geom.r * 0.9; // sit on the outer part of the coloured wedge
  return { x: geom.cx + rr * Math.cos(a), y: geom.cy + rr * Math.sin(a) };
}

function beginDartsRound() {
  const stage = document.getElementById("darts-stage");
  stage.innerHTML = '<div id="dart-thrower"></div><div class="darts-goal" id="darts-goal"></div>';
  darts = { score: 0, time: 60, combo: 0, locked: 0, cards: [], used: new Set() };
  document.getElementById("darts-score").textContent = 0;
  document.getElementById("darts-time").textContent = 60;
  updateDartsGoal();
  toast("Read each statement — dart the TRUE ones to lock every colour.", 2400);

  miniTimers.push(
    setInterval(() => {
      if (overlayPaused) return; // don't lose time while reading feedback
      darts.time--;
      document.getElementById("darts-time").textContent = darts.time;
      if (darts.time <= 0) finishDarts();
    }, 1000),
  );

  dartsActive = true;
  DART_SECTIONS.forEach((_, i) => spawnDartCard(i));
  ensureOpenFact(); // never start a round with zero true statements to dart
}

function dartThrowerPos(stage) {
  return { x: stage.clientWidth / 2, y: stage.clientHeight - 34 };
}

function updateDartsGoal() {
  const g = document.getElementById("darts-goal");
  if (g) g.textContent = `🎯 ${darts.locked} / ${DART_SECTIONS.length} truths locked`;
}

// Pick a random statement (fact or myth) whose text isn't already on the board.
function pickDartStatement() {
  for (let tries = 0; tries < 60; tries++) {
    const isMyth = Math.random() < 0.5;
    const data = isMyth ? rand(DARTS_MYTHS) : rand(DARTS_FACTS);
    if (!darts.used.has(data.text)) return { isMyth, data };
  }
  const data = rand(DARTS_FACTS); // fallback (plenty of distinct statements exist)
  return { isMyth: false, data };
}

// Create the statement card ringing section i (colour tab = which section).
// Myth and fact cards look IDENTICAL apart from the section colour — READ them.
function spawnDartCard(i) {
  if (!dartsActive) return;
  const stage = document.getElementById("darts-stage");
  const sec = DART_SECTIONS[i];
  const pick = pickDartStatement();
  darts.used.add(pick.data.text);
  const el = document.createElement("div");
  el.className = "dart-card";
  const pos = dartSectionPos(dartBoardGeom(stage), i);
  // Keep the card fully on-screen (matters on the narrow portrait crop).
  const halfW = 70,
    halfH = 48;
  pos.x = Math.max(halfW, Math.min(stage.clientWidth - halfW, pos.x));
  pos.y = Math.max(halfH, Math.min(stage.clientHeight - halfH, pos.y));
  el.style.left = pos.x + "px";
  el.style.top = pos.y + "px";
  el.style.setProperty("--sec", sec.color);
  el.innerHTML = '<span class="dart-card-text"></span>';
  el.querySelector(".dart-card-text").textContent = pick.data.text;
  stage.appendChild(el);
  const card = { el, i, sec, isMyth: pick.isMyth, data: pick.data, locked: false, busy: false };
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    dartCard(card);
  });
  darts.cards[i] = card;
}

// Animate a dart flying from the thrower to a point, then run cb on arrival.
function fireDart(stage, ox, oy, tx, ty, cb) {
  const d = document.createElement("div");
  d.className = "dart";
  d.style.left = ox + "px";
  d.style.top = oy + "px";
  d.style.transform = `rotate(${Math.atan2(ty - oy, tx - ox)}rad)`;
  stage.appendChild(d);
  requestAnimationFrame(() => {
    d.style.transition = "left .26s cubic-bezier(.4,.55,.5,1), top .26s cubic-bezier(.4,.55,.5,1)";
    d.style.left = tx + "px";
    d.style.top = ty + "px";
  });
  setTimeout(() => {
    if (cb) cb();
    setTimeout(() => d.remove(), 350);
  }, 290);
}

// Player darts a card: they're claiming "this is TRUE".
function dartCard(card) {
  if (!dartsActive || overlayPaused || card.locked || card.busy) return;
  card.busy = true;
  const stage = document.getElementById("darts-stage");
  const t = dartThrowerPos(stage);
  const tx = parseFloat(card.el.style.left),
    ty = parseFloat(card.el.style.top);
  playSound("hit");
  fireDart(stage, t.x, t.y, tx, ty, () => resolveDartCard(card));
}

function resolveDartCard(card) {
  card.busy = false;
  const stage = document.getElementById("darts-stage");
  const r = stage.getBoundingClientRect();
  const cx = r.left + parseFloat(card.el.style.left) * FIT;
  const cy = r.top + parseFloat(card.el.style.top) * FIT;
  if (!card.isMyth) {
    // A true statement → LOCK it into this colour section.
    card.locked = true;
    darts.locked++;
    darts.combo++;
    const pts = 100 + (darts.combo - 1) * 25;
    darts.score += pts;
    addScore(pts);
    floatText(`+${pts}`, cx, cy, "#ffd34d");
    burst(cx, cy, card.sec.color);
    playSound("success");
    card.el.classList.add("locked");
    // Leave a dart stuck in the card so the lock reads as "pinned to the board".
    const pin = document.createElement("div");
    pin.className = "dart dart-pinned";
    card.el.appendChild(pin);
    updateDartsGoal();
    document.getElementById("darts-score").textContent = darts.score;
    reshuffleUnlocked(); // every pick refreshes the sections still open
    bigMessage(card.data.feedback, {
      icon: "✅",
      title: `Locked!  +${pts}${darts.combo >= 2 ? `  ·  Combo x${darts.combo}` : ""}`,
      tone: "correct",
      duration: 1600,
    });
    if (darts.locked >= DART_SECTIONS.length) setTimeout(finishDarts, 400);
  } else {
    // A myth → clear it; the open sections (this one included) refresh.
    darts.combo = 0;
    darts.score = Math.max(0, darts.score - 25);
    state.score = Math.max(0, state.score - 25);
    updateHUD();
    floatText("Myth!", cx, cy, "#ff6b6b");
    playSound("error");
    shake();
    document.getElementById("darts-score").textContent = darts.score;
    bigMessage(card.data.feedback, {
      icon: "❌",
      title: "That was a myth — the open sections refresh",
      tone: "wrong",
      duration: 1900,
    });
    reshuffleUnlocked();
  }
}

// Refresh every still-open (unlocked) section with a fresh statement. Locked
// sections keep their captured truth.
function reshuffleUnlocked() {
  for (const card of darts.cards) {
    if (!card || card.locked || card.busy) continue;
    refreshDartCard(card);
  }
  ensureOpenFact();
}

// Guarantee at least one OPEN (unlocked) section shows a TRUE fact, so the player
// can always progress by darting a truth — never forced to hit a myth just to
// trigger a reshuffle. (Bug: the open sections could all roll myths at once.)
function ensureOpenFact() {
  const open = darts.cards.filter((c) => c && !c.locked && !c.busy);
  if (!open.length || open.some((c) => !c.isMyth)) return;
  const card = open[Math.floor(Math.random() * open.length)];
  darts.used.delete(card.data.text);
  const fact = DARTS_FACTS.find((f) => !darts.used.has(f.text)) || rand(DARTS_FACTS);
  darts.used.add(fact.text);
  card.isMyth = false;
  card.data = fact;
  card.el.querySelector(".dart-card-text").textContent = fact.text;
}

// Swap one card for a fresh statement in the same section.
function refreshDartCard(card) {
  darts.used.delete(card.data.text);
  const pick = pickDartStatement();
  darts.used.add(pick.data.text);
  card.isMyth = pick.isMyth;
  card.data = pick.data;
  card.el.querySelector(".dart-card-text").textContent = pick.data.text;
  card.el.classList.add("dart-card-refresh");
  setTimeout(() => card.el.classList.remove("dart-card-refresh"), 420);
  card.busy = false;
}

function finishDarts() {
  if (!dartsActive) return; // guard against the timer firing after a win
  dartsActive = false;
  cancelAnimationFrame(dartsFrame);
  clearMiniTimers();
  const won = darts.locked >= DART_SECTIONS.length;
  showPopup(
    won
      ? "Every colour locked! You captured a truth in all five sections."
      : `Time! You locked ${darts.locked} of ${DART_SECTIONS.length} sections.`,
    `Vaccine Darts Score: ${darts.score}\n\n` +
      (won
        ? "Accurate information is one more layer of protection."
        : "Read each statement and dart the true ones to fill every colour."),
    [
      {
        text: "Return to Maze",
        primary: true,
        action: () => {
          hidePopup();
          exitMiniGame();
        },
      },
    ],
  );
}

/* ---------- 6d. MEMORY MATCH ---------- */
// 12 cards / 6 pairs — each pair is one picture card + one fact card. Shuffled and
// de-adjacent, neutral cards (no colour tell), an educational explanation after every
// correct match, and a short message on a miss.
let memory = {};
function startMemory() {
  showScreen("screen-memory");
  showPopup(
    "Memory Match",
    "Flip two cards at a time and connect each flu prevention action with its correct benefit or outcome.\n\n" +
      "• Flip two cards at a time.\n• Match each action or fact with its related benefit.\n" +
      "• Correct matches stay visible; incorrect matches flip back.\n• Complete every pair to finish.",
    [
      {
        text: "Start Memory Match",
        primary: true,
        action: () => {
          hidePopup();
          beginMemoryRound();
        },
      },
    ],
  );
}

function beginMemoryRound() {
  const stage = document.getElementById("memory-stage");
  stage.innerHTML = "";
  // The cards live inside a centred "tray" so they always look deliberately
  // placed on the clinic scene, at any screen size (no aligning to the photo).
  const board = document.createElement("div");
  board.className = "mem-board memory-grid";
  stage.appendChild(board);
  toast(rand(MEMORY_MESSAGES), 1800);

  // Deck: each pair -> one picture card + one fact card, both sharing a pairId.
  const deck = [];
  MEMORY_PAIRS.forEach((pair, i) => {
    deck.push({ pairId: i, kind: "img", img: pair.img, alt: pair.alt });
    deck.push({ pairId: i, kind: "fact", text: pair.fact });
  });
  // Fisher–Yates shuffle.
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Nudge apart any pair whose two cards ended up side by side.
  for (let i = 1; i < deck.length; i++) {
    if (deck[i].pairId === deck[i - 1].pairId) {
      const swap = (i + 2) % deck.length;
      [deck[i], deck[swap]] = [deck[swap], deck[i]];
    }
  }

  memory = { moves: 0, pairs: 0, score: 0, first: null, lock: false, time: 60 };
  document.getElementById("memory-moves").textContent = 0;
  document.getElementById("memory-pairs").textContent = 0;
  document.getElementById("memory-score").textContent = 0;
  document.getElementById("memory-time").textContent = 60;
  miniTimers.push(
    setInterval(() => {
      memory.time--;
      document.getElementById("memory-time").textContent = memory.time;
      if (memory.time <= 0) finishMemory(true);
    }, 1000),
  );

  deck.forEach((card) => {
    const el = document.createElement("div");
    el.className = "mem-card";
    let face;
    if (card.kind === "img") {
      // Picture card: show ONLY the image, contained (never cropped/stretched).
      face = `<span class="mem-face mem-face-img"><img class="mem-img" src="${card.img}" alt="${card.alt}"></span>`;
    } else {
      // Fact card: centered, wrapping text — no image, no explanation.
      face = `<span class="mem-face mem-face-fact">${card.text}</span>`;
    }
    el.innerHTML = `<span class="mem-back">＋</span>${face}`;
    el.dataset.pair = card.pairId;
    el.addEventListener("click", () => flipCard(el));
    board.appendChild(el);
  });
}

function flipCard(el) {
  if (memory.lock) return;
  if (el.classList.contains("flipped") || el.classList.contains("matched")) return;

  el.classList.add("flipped");

  if (!memory.first) {
    memory.first = el;
    return;
  }

  memory.moves++;
  document.getElementById("memory-moves").textContent = memory.moves;

  if (memory.first.dataset.pair === el.dataset.pair) {
    // Match — keep both face-up, educational feedback, +100.
    const first = memory.first;
    memory.first = null;
    first.classList.add("matched");
    el.classList.add("matched");
    memory.pairs++;
    memory.score += 100;
    document.getElementById("memory-pairs").textContent = memory.pairs;
    document.getElementById("memory-score").textContent = memory.score;
    addScore(100);
    playSound("success");
    const mc = centerOf(el);
    floatText("+100", mc.x, mc.y, "#57d38c");
    bigMessage(MEMORY_PAIRS[Number(el.dataset.pair)].msg, {
      icon: "✅",
      title: "Match!",
      tone: "good",
      duration: 2600,
    });
    if (memory.pairs === MEMORY_PAIRS.length) finishMemory();
  } else {
    // Miss — short message, then flip both back (no point loss).
    playSound("error");
    toast(rand(MEMORY_WRONG), 1600);
    memory.lock = true;
    const a = memory.first,
      b = el;
    memory.first = null;
    a.classList.add("mem-miss"); // brief shake — mismatch feedback (visual only)
    b.classList.add("mem-miss");
    setTimeout(() => {
      a.classList.remove("flipped", "mem-miss");
      b.classList.remove("flipped", "mem-miss");
      memory.lock = false;
    }, 850);
  }
}

function finishMemory(timeUp = false) {
  clearMiniTimers(); // stop the countdown
  if (timeUp && memory.pairs < MEMORY_PAIRS.length) {
    showPopup(
      "Time's up!",
      `You matched ${memory.pairs} of ${MEMORY_PAIRS.length} pairs.\n\nMemory Match Score: ${memory.score}`,
      [
        {
          text: "Return to Maze",
          primary: true,
          action: () => {
            hidePopup();
            exitMiniGame();
          },
        },
      ],
    );
    return;
  }
  // All pairs matched — +300 completion bonus.
  memory.score += 300;
  addScore(300);
  document.getElementById("memory-score").textContent = memory.score;
  showPopup(
    "Memory Match Complete",
    "You successfully connected flu prevention actions with their health benefits.\n\n" +
      "Annual flu vaccination can help reduce severe illness and protect patients, coworkers, family members, and the healthcare workforce.\n\n" +
      `Memory Match Score: ${memory.score}`,
    [
      {
        text: "Return to Maze",
        primary: true,
        action: () => {
          hidePopup();
          exitMiniGame();
        },
      },
    ],
  );
}

/* =========================================================
   7. LEADERBOARD (localStorage)
   ========================================================= */

function getScores() {
  return JSON.parse(localStorage.getItem("immunityScores") || "[]");
}
// Save a score, keep top 10, return this run's rank (1-based).
function saveScore(initials, score) {
  let scores = getScores();
  const entry = { initials, score };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const rank = scores.indexOf(entry) + 1;
  scores = scores.slice(0, 10);
  localStorage.setItem("immunityScores", JSON.stringify(scores));
  return rank;
}

function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  const scores = getScores();
  list.innerHTML = "";
  if (scores.length === 0) {
    list.innerHTML = `<li class="empty">No scores yet — be the first!</li>`;
    return;
  }
  scores.forEach((s) => {
    const li = document.createElement("li");
    if (s.initials === state.initials) li.classList.add("me");
    li.innerHTML = `<span>${s.initials}</span><span>${s.score}</span>`;
    list.appendChild(li);
  });
}

/* =========================================================
   POP-UP HELPERS
   ========================================================= */
function showPopup(title, text, actions) {
  document.getElementById("popup-title").textContent = title;
  document.getElementById("popup-text").textContent = text;
  const box = document.getElementById("popup-actions");
  box.innerHTML = "";
  actions.forEach((a) => {
    const b = document.createElement("button");
    b.className = "btn" + (a.primary ? " btn-primary" : "");
    b.textContent = a.text;
    b.onclick = a.action;
    box.appendChild(b);
  });
  document.getElementById("popup").classList.add("show");
}
function hidePopup() {
  document.getElementById("popup").classList.remove("show");
}

/* =========================================================
   CHARACTER CUSTOMIZATION CONTROLS
   ========================================================= */
function setupCustomizeControls() {
  buildCharacter(document.getElementById("preview-character"));
  // Gallery: pick one of the finished character images.
  document.querySelectorAll("#char-gallery .char-pick").forEach((btn) => {
    const idx = Number(btn.dataset.preset);
    if (idx === character.preset) btn.classList.add("active");
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("#char-gallery .char-pick")
        .forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      character.preset = idx;
      buildCharacter(document.getElementById("preview-character"));
    });
  });
}

function saveCharacter() {
  localStorage.setItem("immunityCharacter", JSON.stringify(character));
  buildCharacter(document.getElementById("mhud-char")); // refresh the HUD portrait
  toast("Character saved!");
}

/* =========================================================
   INPUT CONTROLS (keyboard + touch)
   ========================================================= */
function setupControls() {
  // Keyboard.
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (["arrowup", "w"].includes(k)) keys.up = true;
    if (["arrowdown", "s"].includes(k)) {
      keys.down = true;
      sprintSlide(); // slide in Hospital Sprint (no-op elsewhere)
    }
    if (["arrowleft", "a"].includes(k)) {
      keys.left = true;
      sprintMove(-1); // change lane in Hospital Sprint (no-op elsewhere)
    }
    if (["arrowright", "d"].includes(k)) {
      keys.right = true;
      sprintMove(1);
    }
    if (k === " " || k === "spacebar") {
      e.preventDefault();
      sprintJump();
    }
  });
  document.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (["arrowup", "w"].includes(k)) keys.up = false;
    if (["arrowdown", "s"].includes(k)) keys.down = false;
    if (["arrowleft", "a"].includes(k)) keys.left = false;
    if (["arrowright", "d"].includes(k)) keys.right = false;
  });

  // Touch D-pad.
  document.querySelectorAll(".dbtn").forEach((btn) => {
    const dir = btn.dataset.dir;
    const on = (e) => {
      e.preventDefault();
      keys[dir] = true;
    };
    const off = (e) => {
      e.preventDefault();
      keys[dir] = false;
    };
    btn.addEventListener("touchstart", on);
    btn.addEventListener("touchend", off);
    btn.addEventListener("mousedown", on);
    btn.addEventListener("mouseup", off);
    btn.addEventListener("mouseleave", off);
  });

  // Tap anywhere in the sprint stage to jump.
  // (Sprint jump/slide are handled by the stage's pointer handlers in beginSprintRound.)
}

/* =========================================================
   RESPONSIVE FIT — scale the fixed 430x860 phone frame to the device
   ---------------------------------------------------------
   The whole game is authored at a fixed reference size and scaled uniformly to
   fit the screen, so the layout and every mini-game's pixel math stay identical
   to the design on any device — we only resize the finished frame (letterboxed
   by the body's background). Reads the DYNAMIC viewport (visualViewport) so the
   mobile address bar collapsing/expanding never pushes the D-pad or HUD
   off-screen. On desktop widescreen the CSS media query drives the layout, so we
   leave FIT at 1 and clear the inline scale.
   ========================================================= */
const REF_W = 430,
  REF_H = 860;
const isDesktopWide = () =>
  window.matchMedia("(min-aspect-ratio: 1/1) and (min-width: 760px)").matches;

function fitGame() {
  const g = document.getElementById("game");
  if (!g) return;
  if (isDesktopWide()) {
    // Desktop: the media query sets #game's fluid size + transform:none. Keep the
    // scale factor at 1 so effect positions and shake are exactly as before.
    FIT = 1;
    g.style.removeProperty("--fit");
    return;
  }
  const vv = window.visualViewport;
  const vw = vv ? vv.width : window.innerWidth;
  const vh = vv ? vv.height : window.innerHeight;
  FIT = Math.min(vw / REF_W, vh / REF_H);
  g.style.setProperty("--fit", FIT);
}

window.addEventListener("resize", fitGame);
window.addEventListener("orientationchange", fitGame);
window.addEventListener("fullscreenchange", fitGame);
if (window.visualViewport) window.visualViewport.addEventListener("resize", fitGame);

// Go fullscreen when the player starts (must be called from a user gesture — the
// Start button's click). Fills the screen and hides the browser chrome so the
// scale-to-fit frame gets the whole display. Fails silently where it isn't
// allowed (e.g. iPhone Safari, which has no Fullscreen API) — the game still fits
// fine via scale-to-fit, so this is a pure enhancement.
function goFullscreen() {
  if (document.fullscreenElement) return;
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if (!req) return;
  try {
    const p = req.call(el);
    if (p && p.catch) p.catch(() => {});
  } catch (e) {
    /* fullscreen blocked — scale-to-fit still handles sizing */
  }
}

/* =========================================================
   BOOT
   ========================================================= */
window.addEventListener("load", () => {
  init();
  fitGame();
});
