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
// Custom inline-SVG icons (self-contained, no image files) for the Sprint items.
// Natural object colours — not a good/bad colour code.
const SPRINT_ICONS = {
  syringe:
    '<svg viewBox="0 0 24 24" class="spr-ico"><g transform="rotate(-45 12 12)"><rect x="6.5" y="6.5" width="10" height="6" rx="2" fill="#cfe0fb" stroke="#1f6feb" stroke-width="1.6"/><line x1="16.5" y1="9.5" x2="21" y2="9.5" stroke="#1f6feb" stroke-width="1.6" stroke-linecap="round"/><line x1="3" y1="9.5" x2="6.5" y2="9.5" stroke="#1f6feb" stroke-width="1.6" stroke-linecap="round"/><line x1="10" y1="6.5" x2="10" y2="12.5" stroke="#1f6feb" stroke-width="1.2"/><line x1="13" y1="6.5" x2="13" y2="12.5" stroke="#1f6feb" stroke-width="1.2"/></g></svg>',
  heart:
    '<svg viewBox="0 0 24 24" class="spr-ico"><path d="M12 21s-7-4.6-9.3-9C1 8.5 2.6 5 6 5c2 0 3.2 1.2 4 2.3C10.8 6.2 12 5 14 5c3.4 0 5 3.5 3.3 7-2.3 4.4-9.3 9-9.3 9z" fill="#ff6b81"/></svg>',
  family:
    '<svg viewBox="0 0 24 24" class="spr-ico"><g fill="#3b7dd8"><circle cx="8" cy="7" r="3"/><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5z"/><circle cx="16.5" cy="8.5" r="2.4"/><path d="M12.6 20c0-2.4 1.8-4.2 3.9-4.2s3.9 1.8 3.9 4.2z"/></g></svg>',
  star: '<svg viewBox="0 0 24 24" class="spr-ico"><path d="M12 2l2.9 6 6.6.6-5 4.3 1.5 6.5L12 16.9 5.9 19.4 7.4 12.9l-5-4.3 6.6-.6z" fill="#ffc94d"/></svg>',
  energy:
    '<svg viewBox="0 0 24 24" class="spr-ico"><path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="#f2a93b"/></svg>',
  barrier:
    '<svg viewBox="0 0 24 24" class="spr-ico"><rect x="2" y="9" width="20" height="6" rx="1.5" fill="#e0863a"/><g stroke="#fff" stroke-width="2"><line x1="6" y1="9" x2="3" y2="15"/><line x1="12" y1="9" x2="9" y2="15"/><line x1="18" y1="9" x2="15" y2="15"/></g><line x1="5" y1="9" x2="5" y2="22" stroke="#8a5a2a" stroke-width="2"/><line x1="19" y1="9" x2="19" y2="22" stroke="#8a5a2a" stroke-width="2"/></svg>',
  calendar:
    '<svg viewBox="0 0 24 24" class="spr-ico"><rect x="3" y="4" width="18" height="17" rx="2" fill="#e9edf2" stroke="#8899aa" stroke-width="1.6"/><rect x="3" y="4" width="18" height="4.5" fill="#8899aa"/><g stroke="#d24b3a" stroke-width="2.4" stroke-linecap="round"><line x1="8" y1="12" x2="16" y2="19"/><line x1="16" y1="12" x2="8" y2="19"/></g></svg>',
  cloud:
    '<svg viewBox="0 0 24 24" class="spr-ico"><path d="M7 18h10a4 4 0 0 0 .5-8 5 5 0 0 0-9.6-1A3.5 3.5 0 0 0 7 18z" fill="#9aa7b4"/></svg>',
};

// --- Flu Freeze items (Milestone F: swipe-to-slice, exact wording) ---
// Positive items to slice. "Gold" items just award more points — they are NOT
// visually distinguished, so the player must read each item.
const FREEZE_POSITIVE = [
  { text: "Flu Vaccine", score: 150 },
  { text: "Patient Protection", score: 150 },
  { text: "Protected Shift", score: 100 },
  { text: "Family Protection", score: 125 },
  { text: "Annual Vaccination", score: 125 },
  { text: "Lower Risk of Severe Illness", score: 150 },
  { text: "High-Risk Patient Protected", score: 300 },
  { text: "Outbreak Prevented", score: 300 },
  { text: "Vaccinated Before Flu Season", score: 250 },
];
// Negative items — slicing one costs a life and shows its correction.
const FREEZE_NEGATIVE = [
  {
    text: "Going to Work With Flu Symptoms",
    feedback:
      "Stay home when you are sick. Working while symptomatic can expose patients and coworkers.",
  },
  {
    text: "Skipping This Year's Vaccine",
    feedback: "Flu viruses change over time, so vaccination is recommended every flu season.",
  },
  {
    text: "Treating Flu With Antibiotics",
    feedback:
      "Antibiotics treat bacterial infections. They do not treat influenza, which is caused by a virus.",
  },
  {
    text: "Visiting Vulnerable Patients While Sick",
    feedback:
      "Influenza can cause serious complications in older adults and people with underlying conditions.",
  },
  {
    text: "Ignoring Early Symptoms",
    feedback:
      "Flu symptoms can begin suddenly. Recognizing them early helps reduce further exposure.",
  },
  {
    text: "Sharing Personal Equipment",
    feedback: "Shared equipment can carry germs. Clean and disinfect it between users.",
  },
  {
    text: "Assuming Mild Symptoms Are Not Contagious",
    feedback: "A person may spread influenza before symptoms become severe or obvious.",
  },
  {
    text: "Attending a Family Event While Sick",
    feedback: "Staying home while sick helps prevent spreading influenza to family and friends.",
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
// Each pair connects two related cards (a <-> b) and has its own message shown on a match.
// (Card icons/illustrations come later in Milestone F4 — this is the text/data.)
// Milestone F: exact wording. a<->b are the two cards; msg = educational match feedback.
const MEMORY_PAIRS = [
  {
    a: "Annual Flu Vaccination",
    b: "Updated Seasonal Protection",
    msg: "Correct. Flu viruses can change, so vaccination is recommended each season.",
  },
  {
    a: "Vaccinated Healthcare Worker",
    b: "Patient Protection",
    msg: "Correct. Vaccination can help reduce the risk of spreading influenza to vulnerable patients.",
  },
  {
    a: "Reduced Flu Risk",
    b: "Fewer Missed Shifts",
    msg: "Correct. Preventing flu illness can reduce absences from work.",
  },
  {
    a: "Vaccination Before Exposure",
    b: "Immune Preparation",
    msg: "Correct. Vaccination prepares the immune system to recognize the virus before exposure.",
  },
  {
    a: "Lower Risk of Severe Illness",
    b: "Flu Vaccination",
    msg: "Correct. Vaccination can reduce the risk of serious influenza complications.",
  },
  {
    a: "Staying Home When Sick",
    b: "Reduced Workplace Spread",
    msg: "Correct. Staying home while symptomatic helps protect patients and coworkers.",
  },
  {
    a: "Protecting Yourself",
    b: "Protecting Family Members",
    msg: "Correct. Reducing your own risk can also reduce exposure for people at home.",
  },
  {
    a: "Reliable Vaccine Information",
    b: "Informed Decision-Making",
    msg: "Correct. Trusted sources and healthcare professionals can help answer vaccine questions.",
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

let state = {
  initials: "---",
  score: 0,
  health: 3,
  shielded: false,
  speedBoost: false,
  runSeconds: 0, // overall run time; the run ends at RUN_LIMIT_SECONDS
};

// Character look. Defaults match the CSS defaults.
let character = {
  gender: "male",
  skin: "#f7d5b5",
  hair: "#2b1b0e",
  hairstyle: "short",
  eyes: "#4a3728",
  scrubs: "#1f6feb",
};

// Load a saved character if one exists.
(function loadCharacter() {
  const saved = localStorage.getItem("immunityCharacter");
  if (saved) character = JSON.parse(saved);
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

// C2 — tiny built-in sound effects using the browser's Web Audio API.
// No sound files, nothing paid. A mute toggle is saved in localStorage.
let audioCtx = null;
let muted = localStorage.getItem("immunityMuted") === "1";
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
function buildCharacter(el) {
  el.innerHTML = `
    <div class="char-arm left"></div>
    <div class="char-arm right"></div>
    <div class="char-legs">
      <div class="char-leg left"><span class="char-shoe"></span></div>
      <div class="char-leg right"><span class="char-shoe"></span></div>
    </div>
    <div class="char-body">
      <div class="char-sleeve left"></div>
      <div class="char-sleeve right"></div>
      <div class="char-steth"></div>
      <div class="char-pocket"></div>
      <div class="char-badge">SHN</div>
    </div>
    <div class="char-hair-long"></div>
    <div class="char-head">
      <span class="char-ear left"></span>
      <span class="char-ear right"></span>
      <div class="char-hair"></div>
      <div class="char-hair-extra"></div>
      <div class="char-bun"></div>
      <div class="char-brows"><span></span><span></span></div>
      <div class="char-eyes"><span></span><span></span></div>
      <div class="char-nose"></div>
      <span class="char-cheek left"></span>
      <span class="char-cheek right"></span>
      <div class="char-smile"></div>
    </div>
  `;
  applyCharacter(el);
}

// Apply the current character colours/style to a container.
function applyCharacter(el) {
  el.style.setProperty("--skin", character.skin);
  el.style.setProperty("--hair", character.hair);
  el.style.setProperty("--eyes", character.eyes);
  el.style.setProperty("--scrubs", character.scrubs);
  el.dataset.hairstyle = character.hairstyle;
  el.dataset.gender = character.gender; // female = long hair (see CSS)
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
  buildCharacter(document.getElementById("home-character"));
  rotateSlogan("home-slogan");
  // Rotate the home slogan every few seconds.
  setInterval(() => {
    if (document.getElementById("screen-home").classList.contains("active")) {
      rotateSlogan("home-slogan");
    }
  }, 3500);
  setupCustomizeControls();
  setupControls();
  // Reflect saved mute preference on the sound button.
  const muteBtn = document.getElementById("mute-btn");
  if (muteBtn) muteBtn.textContent = muted ? "🔇" : "🔊";
}

// Home -> initials screen.
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
  document.getElementById("hud-shield").classList.toggle("on", state.shielded);
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

// Player position/size within the world.
let player = { x: 400, y: 400, w: 46, h: 76, speed: 4 };

// Wall rectangles {x, y, w, h}. Outer border + a few dividers.
let walls = [];
let liveCollectibles = []; // {el, x, y, w, h, data}
let hazards = []; // patrolling flu germs {el, x, y, w, h, min, max, vy}
let hazardCooldown = 0; // frames of immunity after a hazard hit
let keycard = null; // {el, x, y, w, h} — unlocks the vault
let lockedDoor = null; // {rect, el} — blocks the vault until the keycard is found
let missionVisited = {}; // which clinics have been visited this run
let missionDone = false;
let keys = {};
let mazeRunning = false;
let mazeFrame;

// Build all maze elements fresh.
function buildMaze() {
  const worldEl = document.getElementById("maze-world");
  // Clear everything except the player element.
  worldEl
    .querySelectorAll(".wall, .zone, .collectible, .room, .room-sign, .hazard, .locked-door")
    .forEach((n) => n.remove());

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
    // Locked bonus vault (lane 5, against the right border). Door gap on the left;
    // leaves a corridor x860–940 down lane 5 so Freeze/Memory stay reachable.
    { x: 940, y: 560, w: 110, h: T }, // top
    { x: 940, y: 720, w: 110, h: T }, // bottom
    { x: 940, y: 560, w: T, h: 45 }, // left-upper
    { x: 940, y: 695, w: T, h: 45 }, // left-lower
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
  const doorRect = { x: 940, y: 605, w: 20, h: 90 };
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
  spawnCollectible(worldEl, 985, 610, famReward);
  spawnCollectible(worldEl, 1015, 660, famReward);
  spawnCollectible(worldEl, 985, 700, wellReward);

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

function spawnCollectible(worldEl, x, y, data) {
  const d = document.createElement("div");
  d.className = "collectible";
  d.textContent = data.emoji;
  d.style.left = x + "px";
  d.style.top = y + "px";
  worldEl.appendChild(d);
  liveCollectibles.push({ el: d, x, y, w: 30, h: 30, data });
}

// AABB overlap test.
function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// Try to move the player, blocked by walls.
// We move the X and Y axes SEPARATELY so the player slides smoothly
// along a wall instead of getting stuck when moving diagonally.
function moverPlayer(dx, dy) {
  // --- Horizontal ---
  if (dx !== 0) {
    const nx = Math.max(0, Math.min(WORLD_SIZE - player.w, player.x + dx));
    const box = { x: nx, y: player.y, w: player.w, h: player.h };
    if (!walls.some((w) => overlap(box, w))) player.x = nx;
  }
  // --- Vertical ---
  if (dy !== 0) {
    const ny = Math.max(0, Math.min(WORLD_SIZE - player.h, player.y + dy));
    const box = { x: player.x, y: ny, w: player.w, h: player.h };
    if (!walls.some((w) => overlap(box, w))) player.y = ny;
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
  const spd = player.speed * (state.speedBoost ? 2 : 1);
  let dx = 0,
    dy = 0;
  if (keys.up) dy -= spd;
  if (keys.down) dy += spd;
  if (keys.left) dx -= spd;
  if (keys.right) dx += spd;
  if (dx || dy) moverPlayer(dx, dy);

  // Speed trail: drop fading dots in the world so they fall behind the player.
  if (state.speedBoost && (dx || dy)) {
    trailCounter = (trailCounter + 1) % 3;
    if (trailCounter === 0) spawnTrail(player.x + player.w / 2, player.y + player.h / 2);
  }

  // Position player element.
  const pEl = document.getElementById("player");
  pEl.style.left = player.x + "px";
  pEl.style.top = player.y + "px";

  // Camera: center the player by translating the world.
  const world = document.getElementById("maze-world");
  const camX = VIEW_W / 2 - (player.x + player.w / 2);
  const camY = VIEW_H / 2 - (player.y + player.h / 2);
  world.style.left = camX + "px";
  world.style.top = camY + "px";

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
  // Show the labeled bonus and a short personal message.
  toast(`+${data.points} ${data.bonusLabel} — ${rand(data.messages)}`);
  // Feedback: floating score, particle burst, and a sound at the player.
  const c = centerOf(document.getElementById("player"));
  const warm = data.effect === "bonus"; // Family / Wellness get a warmer, bigger popup
  const color = warm ? "#ff9e6d" : "#ffd34d";
  floatText(`+${data.points}`, c.x, c.y, color, warm);
  burst(c.x, c.y, color);
  playSound("collect");
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
    d.textContent = "🦠";
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
  toast(
    rand(["Flu slowed you down!", "Watch out for the flu!", "Stay protected out there."]),
    1400,
  );
  player.x = Math.max(20, player.x - 40); // small knockback
  if (state.health <= 0) {
    state.health = 3;
    updateHUD();
    player.x = 110;
    player.y = 430; // back to the entrance (the run keeps going)
    toast("The flu caught up — back to the entrance!", 1800);
  }
}

/* ---------- Keycard + locked vault ---------- */
function checkKeycard() {
  if (!keycard) return;
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
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
  const el = document.getElementById("mission");
  if (!el) return;
  if (missionDone) {
    el.textContent = "✅ Mission complete — all 4 clinics visited!";
    return;
  }
  el.textContent = `Mission: visit all 4 clinics (${count}/4)`;
}
function markClinicVisited(key) {
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
function checkZones() {
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  const onAnyZone = ZONES.some((z) => overlap(pBox, { x: z.x, y: z.y, w: 90, h: 90 }));
  // While cooled down (just declined a zone or just finished a mini-game), wait until
  // the player physically walks off the zone before it can trigger again. No teleport.
  if (zoneCooldown) {
    if (!onAnyZone) zoneCooldown = false;
    return;
  }
  for (const z of ZONES) {
    if (overlap(pBox, { x: z.x, y: z.y, w: 90, h: 90 })) {
      openZonePopup(z);
      return;
    }
  }
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
    // Zone center in screen coordinates.
    let sx = z.x + 45 + camX;
    let sy = z.y + 45 + camY;
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
    "Your shift is moving fast. Jump over flu obstacles, collect boosts, and keep your plans on track before time runs out.\n\n" +
      "• Tap / click / Space to jump.\n• Press Down (or swipe down) to slide under high barriers.\n• Collect boosts and avoid flu obstacles.\n• Reach the finish before time runs out.",
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

function beginSprintRound() {
  const stage = document.getElementById("sprint-stage");
  stage.innerHTML =
    '<div class="sprint-bg"></div><div class="sprint-ground"></div>' +
    '<div class="sprint-progress"><div class="sprint-progress-fill" id="sprint-fill"></div></div>' +
    '<div class="sprint-runner character-stage"></div>';
  const runnerEl = stage.querySelector(".sprint-runner");
  buildCharacter(runnerEl);
  runnerEl.classList.add("walking");
  runnerEl.style.transform = "scale(0.45)"; // shrink the full-size character to runner size
  sprint = {
    score: 0,
    time: 60,
    speed: 5,
    dist: 0,
    target: 14000,
    jumpOffset: 0,
    vjump: 0,
    jumping: false,
    sliding: false,
    slideT: 0,
    hitT: 0,
    objs: [],
    spawnGap: 180,
    py: null,
    gesture: null,
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

  // Touch/mouse: a tap jumps, a downward swipe slides.
  stage.onpointerdown = (e) => {
    sprint.py = e.clientY;
    sprint.gesture = null;
  };
  stage.onpointermove = (e) => {
    if (sprint.py != null && !sprint.gesture && e.clientY - sprint.py > 40) {
      sprint.gesture = "slide";
      sprintSlide();
    }
  };
  stage.onpointerup = () => {
    if (sprint.gesture !== "slide") sprintJump();
    sprint.py = null;
    sprint.gesture = null;
  };

  sprintActive = true;
  cancelAnimationFrame(sprintFrame);
  sprintLoop();
}

function sprintJump() {
  if (!sprintActive || sprint.jumping || sprint.sliding) return;
  sprint.jumping = true;
  sprint.vjump = 15;
  playSound("collect");
}
function sprintSlide() {
  if (!sprintActive || sprint.sliding || sprint.jumping) return;
  sprint.sliding = true;
  sprint.slideT = 32;
}

function spawnSprintObj(stage, groundY) {
  const el = document.createElement("div");
  let box;
  if (Math.random() < 0.5) {
    const data = rand(SPRINT_COLLECT);
    el.className = "sprint-obj sprint-collect";
    el.innerHTML = SPRINT_ICONS[data.icon] + `<span class="spr-label">${data.text}</span>`;
    stage.appendChild(el);
    box = {
      el,
      x: stage.clientWidth,
      y: groundY - 78,
      w: el.offsetWidth,
      h: el.offsetHeight,
      kind: "collect",
      data,
    };
  } else {
    const data = rand(SPRINT_OBSTACLES);
    el.className = "sprint-obj sprint-obstacle" + (data.overhead ? " overhead" : "");
    el.innerHTML = SPRINT_ICONS[data.icon] + `<span class="spr-label">${data.text}</span>`;
    stage.appendChild(el);
    const w = el.offsetWidth,
      h = el.offsetHeight;
    box = {
      el,
      x: stage.clientWidth,
      y: data.overhead ? groundY - 92 : groundY - h,
      w,
      h,
      kind: "obstacle",
      data,
    };
  }
  el.style.left = box.x + "px";
  el.style.top = box.y + "px";
  sprint.objs.push(box);
}

function sprintLoop() {
  const screen = document.getElementById("screen-sprint");
  if (!sprintActive || !screen.classList.contains("active")) {
    sprintActive = false;
    return;
  }
  const stage = document.getElementById("sprint-stage");
  const groundY = stage.clientHeight - 50; // top surface of the ground strip

  if (sprint.jumping) {
    sprint.jumpOffset += sprint.vjump;
    sprint.vjump -= 0.9; // gravity
    if (sprint.jumpOffset <= 0) {
      sprint.jumpOffset = 0;
      sprint.vjump = 0;
      sprint.jumping = false;
    }
  }
  if (sprint.sliding && --sprint.slideT <= 0) sprint.sliding = false;
  if (sprint.hitT > 0) sprint.hitT--;

  sprint.speed = Math.min(6, 3 + sprint.dist / 4500); // slower + gentle ramp, capped so it stays readable
  sprint.dist += sprint.speed;
  const fill = document.getElementById("sprint-fill");
  if (fill) fill.style.width = Math.min(100, (sprint.dist / sprint.target) * 100) + "%";
  if (sprint.dist >= sprint.target) {
    finishSprint();
    return;
  }

  sprint.spawnGap -= sprint.speed;
  if (sprint.spawnGap <= 0) {
    spawnSprintObj(stage, groundY);
    sprint.spawnGap = 230 + Math.random() * 170;
  }

  const ph = sprint.sliding ? 34 : 68;
  const pBox = { x: 55, y: groundY - ph - sprint.jumpOffset, w: 40, h: ph };

  sprint.objs = sprint.objs.filter((o) => {
    o.x -= sprint.speed;
    o.el.style.left = o.x + "px";
    if (o.x < -o.w - 20) {
      o.el.remove();
      return false;
    }
    if (!o.done && overlap(pBox, { x: o.x, y: o.y, w: o.w, h: o.h })) {
      o.done = true;
      sprintHit(o);
      if (o.kind === "collect") {
        o.el.remove();
        return false;
      }
    }
    return true;
  });

  const runner = stage.querySelector(".sprint-runner");
  if (runner) {
    runner.style.transform = `translateY(${-sprint.jumpOffset}px) scale(0.45) scaleY(${
      sprint.sliding ? 0.55 : 1
    })`;
  }

  sprintFrame = requestAnimationFrame(sprintLoop);
}

function sprintHit(o) {
  const r = document.getElementById("sprint-stage").getBoundingClientRect();
  const cx = r.left + o.x + o.w / 2,
    cy = r.top + o.y + o.h / 2;
  if (o.kind === "collect") {
    sprint.score += o.data.score;
    addScore(o.data.score);
    floatText(`+${o.data.score}`, cx, cy, "#ffd34d");
    burst(cx, cy, "#ffd34d");
    playSound("success");
    toast(o.data.msg, 1500);
  } else {
    if (sprint.hitT > 0) return; // brief grace so one stumble isn't punished twice
    sprint.hitT = 45;
    sprint.score = Math.max(0, sprint.score - 50);
    state.score = Math.max(0, state.score - 50);
    playSound("hit");
    shake();
    floatText("-50", cx, cy, "#ff6b6b");
    toast(o.data.msg, 1800);
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
    "Positive moments are flying by. Slice the things worth protecting and avoid flu disruptions before they take away your lives.\n\n" +
      "• Swipe across positive items.\n• Avoid flu-related items.\n• You have 3 lives.\n• Read each item before you slice.",
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

function beginFreezeRound() {
  const stage = document.getElementById("freeze-stage");
  stage.innerHTML = "";
  freeze = { score: 0, lives: 3, time: 60, combo: 0, items: [], slicing: false, lx: 0, ly: 0 };
  document.getElementById("freeze-score").textContent = 0;
  document.getElementById("freeze-lives").textContent = 3;
  document.getElementById("freeze-time").textContent = 60;
  toast("Swipe the good items. Avoid flu disruptions.", 1800);

  miniTimers.push(setInterval(spawnFreezeItem, 1200));
  miniTimers.push(
    setInterval(() => {
      freeze.time--;
      document.getElementById("freeze-time").textContent = freeze.time;
      if (freeze.time <= 0) finishFreeze();
    }, 1000),
  );

  stage.onpointerdown = freezePointerDown;
  stage.onpointermove = freezePointerMove;
  stage.onpointerup = freezePointerUp;
  stage.onpointerleave = freezePointerUp;

  freezeActive = true;
  cancelAnimationFrame(freezeFrame);
  freezeLoop();
}

function spawnFreezeItem() {
  if (!freezeActive) return;
  const stage = document.getElementById("freeze-stage");
  const positive = Math.random() < 0.55;
  const data = positive ? rand(FREEZE_POSITIVE) : rand(FREEZE_NEGATIVE);
  const el = document.createElement("div");
  el.className = "freeze-item"; // identical style for positive and negative
  el.textContent = data.text;
  stage.appendChild(el);
  const elapsed = 60 - freeze.time;
  const item = {
    el,
    x: 50 + Math.random() * (stage.clientWidth - 100),
    y: stage.clientHeight + 20,
    vx: (Math.random() - 0.5) * 2.6,
    vy: -(9.5 + Math.random() * 2 + elapsed / 35), // launch up; eases up over time
    w: el.offsetWidth,
    h: el.offsetHeight,
    positive,
    data,
  };
  el.style.left = item.x + "px";
  el.style.top = item.y + "px";
  freeze.items.push(item);
}

function freezeLoop() {
  const screen = document.getElementById("screen-freeze");
  if (!freezeActive || !screen.classList.contains("active")) {
    freezeActive = false;
    return;
  }
  const H = document.getElementById("freeze-stage").clientHeight;
  freeze.items = freeze.items.filter((it) => {
    it.vy += 0.13; // gravity (lower = slower, floatier arc that's easy to read/slice)
    it.x += it.vx;
    it.y += it.vy;
    it.el.style.left = it.x + "px";
    it.el.style.top = it.y + "px";
    if (it.y > H + 90) {
      it.el.remove();
      if (it.positive) freeze.combo = 0; // missed a good item — combo resets
      return false;
    }
    return true;
  });
  freezeFrame = requestAnimationFrame(freezeLoop);
}

function freezeLocalXY(e, stage) {
  const r = stage.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function freezePointerDown(e) {
  freeze.slicing = true;
  const p = freezeLocalXY(e, document.getElementById("freeze-stage"));
  freeze.lx = p.x;
  freeze.ly = p.y;
  freezeSliceAt(p.x, p.y);
}
function freezePointerMove(e) {
  if (!freeze.slicing) return;
  const p = freezeLocalXY(e, document.getElementById("freeze-stage"));
  freezeSliceAt(p.x, p.y);
  freezeSliceAt((p.x + freeze.lx) / 2, (p.y + freeze.ly) / 2); // catch fast swipes
  spawnSliceTrail(p.x, p.y);
  freeze.lx = p.x;
  freeze.ly = p.y;
}
function freezePointerUp() {
  freeze.slicing = false;
}
function spawnSliceTrail(x, y) {
  const d = document.createElement("div");
  d.className = "slice-trail";
  d.style.left = x + "px";
  d.style.top = y + "px";
  document.getElementById("freeze-stage").appendChild(d);
  setTimeout(() => d.remove(), 350);
}
function freezeSliceAt(x, y) {
  for (const it of freeze.items) {
    // Item is centred on x,y via CSS translate(-50%, -50%).
    if (x > it.x - it.w / 2 && x < it.x + it.w / 2 && y > it.y - it.h / 2 && y < it.y + it.h / 2) {
      sliceFreezeItem(it);
      return;
    }
  }
}
function sliceFreezeItem(item) {
  freeze.items = freeze.items.filter((i) => i !== item);
  const r = document.getElementById("freeze-stage").getBoundingClientRect();
  const cx = r.left + item.x,
    cy = r.top + item.y;
  item.el.classList.add("sliced");
  setTimeout(() => item.el.remove(), 250);
  if (item.positive) {
    freeze.combo++;
    freeze.score += item.data.score;
    addScore(item.data.score);
    floatText(`+${item.data.score}`, cx, cy, "#ffd34d");
    burst(cx, cy, "#2bb3b3");
    playSound("success");
    if (freeze.combo >= 3) toast(`Combo x${freeze.combo}!`, 900);
  } else {
    freeze.combo = 0;
    freeze.lives--;
    document.getElementById("freeze-lives").textContent = freeze.lives;
    floatText("−1 life", cx, cy, "#ff6b6b");
    playSound("error");
    shake();
    toast(rand(FREEZE_LIFE_LOST) + "  " + item.data.feedback, 2600);
    if (freeze.lives <= 0) {
      finishFreeze();
      return;
    }
  }
  document.getElementById("freeze-score").textContent = freeze.score;
}

function finishFreeze() {
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
    "Flu vaccine myths and facts are moving across the screen. Hit the myths without striking the facts.\n\n" +
      "• Hit statements that are myths.\n• Avoid statements that are true.\n" +
      "• Drag from the thrower and release to shoot.\n• Read carefully before you shoot.",
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
}

function beginDartsRound() {
  const stage = document.getElementById("darts-stage");
  stage.innerHTML =
    '<div id="dart-aim"></div><div id="dart-thrower"></div>' +
    '<p class="mg-hint">Drag from the thrower • release to throw • hit the myths</p>';
  darts = { score: 0, time: 60, combo: 0, boards: [], shots: [], aiming: false };
  document.getElementById("darts-score").textContent = 0;
  document.getElementById("darts-time").textContent = 60;
  toast(
    rand([
      "Aim for the myths.",
      "Read before you shoot.",
      "Clear the misinformation.",
      "Protect the facts.",
    ]),
    2000,
  );

  miniTimers.push(
    setInterval(() => {
      darts.time--;
      document.getElementById("darts-time").textContent = darts.time;
      if (darts.time <= 0) finishDarts();
    }, 1000),
  );
  miniTimers.push(setInterval(spawnDartBoard, 2000));
  spawnDartBoard();
  spawnDartBoard();

  // Aiming works with mouse and touch via pointer events (assignment avoids duplicates).
  stage.onpointerdown = dartsPointerDown;
  stage.onpointermove = dartsPointerMove;
  stage.onpointerup = dartsPointerUp;
  stage.onpointerleave = dartsPointerUp;

  dartsActive = true;
  cancelAnimationFrame(dartsFrame);
  dartsLoop();
}

function dartThrowerPos(stage) {
  return { x: stage.clientWidth / 2, y: stage.clientHeight - 34 };
}
function dartsLocalXY(e, stage) {
  const r = stage.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
function dartsPointerDown(e) {
  darts.aiming = true;
  dartsPointerMove(e);
}
function dartsPointerMove(e) {
  if (!darts.aiming) return;
  const stage = document.getElementById("darts-stage");
  const t = dartThrowerPos(stage);
  const p = dartsLocalXY(e, stage);
  const dist = Math.min(Math.hypot(p.x - t.x, p.y - t.y), 260);
  const angle = Math.atan2(p.y - t.y, p.x - t.x);
  const aim = document.getElementById("dart-aim");
  aim.style.left = t.x + "px";
  aim.style.top = t.y + "px";
  aim.style.width = dist + "px";
  aim.style.transform = `rotate(${angle}rad)`;
  aim.style.opacity = "1";
}
function dartsPointerUp(e) {
  if (!darts.aiming) return;
  darts.aiming = false;
  const stage = document.getElementById("darts-stage");
  document.getElementById("dart-aim").style.opacity = "0";
  const t = dartThrowerPos(stage);
  const p = dartsLocalXY(e, stage);
  const dx = p.x - t.x,
    dy = p.y - t.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 12) return; // ignore tiny taps
  const speed = 7 + Math.min(dist, 260) / 16;
  throwDart(t.x, t.y, (dx / dist) * speed, (dy / dist) * speed);
  playSound("hit");
}

function throwDart(x, y, vx, vy) {
  const el = document.createElement("div");
  el.className = "dart";
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.getElementById("darts-stage").appendChild(el);
  darts.shots.push({ el, x, y, vx, vy });
}

function spawnDartBoard() {
  if (!dartsActive) return;
  const stage = document.getElementById("darts-stage");
  const isMyth = Math.random() < 0.55;
  const data = isMyth ? rand(DARTS_MYTHS) : rand(DARTS_FACTS);
  const el = document.createElement("div");
  el.className = "dart-board"; // identical style for myths and facts
  el.textContent = data.text;
  const w = 150;
  el.style.width = w + "px";
  const fromLeft = Math.random() < 0.5;
  const elapsed = 60 - darts.time;
  const spd = (0.75 + elapsed / 80) * (fromLeft ? 1 : -1); // slow enough to read; eases up over time
  const board = {
    el,
    x: fromLeft ? -w : stage.clientWidth,
    y: 24 + Math.random() * (stage.clientHeight * 0.45),
    w,
    h: 62,
    vx: spd,
    vy: (Math.random() - 0.5) * 1.2,
    isMyth,
    feedback: data.feedback,
  };
  el.style.left = board.x + "px";
  el.style.top = board.y + "px";
  stage.appendChild(el);
  darts.boards.push(board);
}

function dartsLoop() {
  const screen = document.getElementById("screen-darts");
  if (!dartsActive || !screen.classList.contains("active")) {
    dartsActive = false;
    return;
  }
  const stage = document.getElementById("darts-stage");
  const W = stage.clientWidth,
    H = stage.clientHeight;
  // Move target boards (drift + bounce; remove off-screen).
  darts.boards = darts.boards.filter((b) => {
    b.x += b.vx;
    b.y += b.vy;
    if (b.y < 18 || b.y > H * 0.6) b.vy *= -1;
    b.el.style.left = b.x + "px";
    b.el.style.top = b.y + "px";
    if (b.x < -b.w - 60 || b.x > W + 60) {
      b.el.remove();
      return false;
    }
    return true;
  });
  // Move darts (gravity) + collision with boards.
  darts.shots = darts.shots.filter((s) => {
    s.vy += 0.25;
    s.x += s.vx;
    s.y += s.vy;
    s.el.style.left = s.x + "px";
    s.el.style.top = s.y + "px";
    const sBox = { x: s.x - 6, y: s.y - 6, w: 12, h: 12 };
    for (const b of darts.boards) {
      if (overlap(sBox, { x: b.x, y: b.y, w: b.w, h: b.h })) {
        dartHitBoard(b);
        s.el.remove();
        return false;
      }
    }
    if (s.y > H + 40 || s.x < -40 || s.x > W + 40) {
      s.el.remove();
      return false;
    }
    return true;
  });
  dartsFrame = requestAnimationFrame(dartsLoop);
}

function dartHitBoard(board) {
  const r = document.getElementById("darts-stage").getBoundingClientRect();
  const cx = r.left + board.x + board.w / 2;
  const cy = r.top + board.y + board.h / 2;
  if (board.isMyth) {
    darts.combo++;
    const pts = 100 + (darts.combo - 1) * 25; // combo bonus for consecutive myths
    darts.score += pts;
    addScore(pts);
    floatText(`+${pts}`, cx, cy, "#ffd34d");
    burst(cx, cy, "#ffd34d");
    playSound("success");
    toast(board.feedback + (darts.combo >= 2 ? `  (Combo x${darts.combo})` : ""), 1700);
    board.el.remove();
    darts.boards = darts.boards.filter((b) => b !== board);
  } else {
    darts.combo = 0;
    darts.score = Math.max(0, darts.score - 50);
    state.score = Math.max(0, state.score - 50);
    updateHUD();
    floatText("-50", cx, cy, "#ff6b6b");
    playSound("error");
    shake();
    toast(board.feedback, 2200);
    board.el.classList.add("dart-board-hit");
    setTimeout(() => board.el.classList.remove("dart-board-hit"), 300);
  }
  document.getElementById("darts-score").textContent = darts.score;
}

function finishDarts() {
  dartsActive = false;
  cancelAnimationFrame(dartsFrame);
  clearMiniTimers();
  showPopup(
    "Vaccine Darts complete! You cleared the myths and protected the facts.",
    `Vaccine Darts Score: ${darts.score}\n\nAccurate information is one more layer of protection.`,
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
// Rebuilt per Milestone F: 16 cards / 8 pairs, shuffled and de-adjacent, neutral
// cards (no colour tell), educational feedback on a match, short message on a miss.
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
  toast(rand(MEMORY_MESSAGES), 1800);

  // Deck: each pair -> two cards sharing a pairId.
  const deck = [];
  MEMORY_PAIRS.forEach((pair, i) => {
    deck.push({ pairId: i, text: pair.a });
    deck.push({ pairId: i, text: pair.b });
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
    el.innerHTML = `<span class="mem-back">＋</span><span class="mem-face">${card.text}</span>`;
    el.dataset.pair = card.pairId;
    el.addEventListener("click", () => flipCard(el));
    stage.appendChild(el);
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
    toast(MEMORY_PAIRS[Number(el.dataset.pair)].msg, 2200);
    if (memory.pairs === MEMORY_PAIRS.length) finishMemory();
  } else {
    // Miss — short message, then flip both back (no point loss).
    playSound("error");
    toast(rand(MEMORY_WRONG), 1600);
    memory.lock = true;
    const a = memory.first,
      b = el;
    memory.first = null;
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
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

  // Highlight the swatches/pills that match the current character.
  document.querySelectorAll("#screen-customize [data-key]").forEach((group) => {
    const key = group.dataset.key;
    group.querySelectorAll("[data-val]").forEach((btn) => {
      if (btn.dataset.val === character[key]) btn.classList.add("active");
      btn.addEventListener("click", () => {
        group.querySelectorAll("[data-val]").forEach((x) => x.classList.remove("active"));
        btn.classList.add("active");
        character[key] = btn.dataset.val;
        applyCharacter(document.getElementById("preview-character"));
      });
    });
  });
}

function saveCharacter() {
  localStorage.setItem("immunityCharacter", JSON.stringify(character));
  // Update the home-screen character too.
  applyCharacter(document.getElementById("home-character"));
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
    if (["arrowleft", "a"].includes(k)) keys.left = true;
    if (["arrowright", "d"].includes(k)) keys.right = true;
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
   BOOT
   ========================================================= */
window.addEventListener("load", init);
