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
    x: 120,
    y: 120,
  },
  {
    key: "freeze",
    short: "Freeze Station",
    label: "Flu Freeze Station",
    icon: "❄",
    color: "#2bb3b3",
    x: 690,
    y: 120,
  },
  {
    key: "darts",
    short: "Darts Room",
    label: "Vaccine Darts Room",
    icon: "🎯",
    color: "#e0533d",
    x: 120,
    y: 690,
  },
  {
    key: "memory",
    short: "Memory Clinic",
    label: "Memory Match Clinic",
    icon: "🃏",
    color: "#7d5ba6",
    x: 690,
    y: 690,
  },
];

// Decorative hospital rooms — visual only, they do NOT block movement (real
// walls/locked doors come in Milestone E). Each has a floor tint and a sign.
// The four "zone" rooms sit under the mini-game doors and share their theme.
const ROOMS = [
  { name: "Reception", x: 300, y: 150, w: 140, h: 110, tone: "#dbe7f3" },
  { name: "Pharmacy", x: 480, y: 150, w: 120, h: 110, tone: "#e2efe6" },
  { name: "Waiting Area", x: 300, y: 640, w: 140, h: 120, tone: "#f0ead9" },
  { name: "Staff Lounge", x: 480, y: 640, w: 120, h: 120, tone: "#efe1ec" },
  { name: "VaxFacts+ Clinic", x: 660, y: 410, w: 150, h: 120, tone: "#dcecef" },
  { name: "Sprint Corridor", x: 60, y: 60, w: 210, h: 210, tone: "#dce7fb", zone: "sprint" },
  { name: "Freeze Station", x: 630, y: 60, w: 210, h: 210, tone: "#d7f0f0", zone: "freeze" },
  { name: "Darts Room", x: 60, y: 630, w: 210, h: 210, tone: "#fadfd9", zone: "darts" },
  { name: "Memory Clinic", x: 630, y: 630, w: 210, h: 210, tone: "#e8e0f2", zone: "memory" },
];

// --- Hospital Sprint items ---
const SPRINT_GOOD = ["💉", "❤", "👨‍👩‍👧", "🌟", "🔋"]; // boosters, hearts, family, wellness, energy
const SPRINT_BAD = ["🦠", "🛏", "🚫", "⚠", "🌧"]; // flu, sick-day, cancelled, disruption, low-energy
const SPRINT_MESSAGES = [
  "Keep moving. Keep your plans.",
  "Protect what matters.",
  "Stay healthy for the moments that count.",
  "Your health protects more than just you.",
  "One choice can make a difference.",
];

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
const MEMORY_PAIRS = [
  {
    a: "Annual Flu Shot",
    b: "Changing Flu Viruses",
    msg: "Flu viruses can change, so protection is recommended every year.",
  },
  { a: "Flu Shot", b: "Cannot Give You Flu", msg: "The flu shot cannot give you the flu." },
  {
    a: "Healthcare Worker",
    b: "Patient Protection",
    msg: "Healthcare workers can help protect patients by staying protected.",
  },
  {
    a: "Healthy Person",
    b: "Still At Risk",
    msg: "Being healthy does not mean you cannot get the flu.",
  },
  {
    a: "Grandparents",
    b: "Higher-Risk Loved Ones",
    msg: "Older adults can be hit harder by flu season.",
  },
  {
    a: "Baby Under 6 Months",
    b: "Too Young For Own Shot",
    msg: "Babies under 6 months are too young for their own flu shot — protection around them matters.",
  },
  {
    a: "Calendar Plans",
    b: "Fewer Missed Moments",
    msg: "Flu season can interrupt weekends, work, and family plans.",
  },
  {
    a: "VaxFacts+",
    b: "Judgement-Free Questions",
    msg: "Questions are normal. VaxFacts+ offers judgement-free vaccine conversations.",
  },
];
const MEMORY_MESSAGES = [
  "Connect the benefits.",
  "Every season counts.",
  "Be there.",
  "Small choices can protect big moments.",
  "The best moments happen together.",
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

const WORLD_SIZE = 900;
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
    // Three staggered walls make a winding serpentine path: to get from the left
    // clinics to the right ones you must weave bottom -> top -> bottom.
    { x: 270, y: 0, w: T, h: 620 }, // A: hangs from the top (gap at the BOTTOM)
    { x: 450, y: 280, w: T, h: 620 }, // B: rises from the bottom (gap at the TOP)
    { x: 610, y: 0, w: T, h: 620 }, // C: hangs from the top (gap at the BOTTOM)
    // Dead-end shelves (short stubs). They MUST leave a walkable corridor past them —
    // the player is 46px wide, so keep the remaining gap ~75px+.
    { x: 290, y: 470, w: 70, h: T }, // lane 2: leaves gap x360–450 (~90px)
    { x: 545, y: 420, w: 65, h: T }, // lane 3: leaves gap x470–545 (~75px)
    // Locked bonus vault (right side) — walls with a door gap on the left.
    { x: 760, y: 230, w: 120, h: T }, // top
    { x: 760, y: 390, w: 120, h: T }, // bottom
    { x: 760, y: 230, w: T, h: 45 }, // left-upper
    { x: 760, y: 365, w: T, h: 45 }, // left-lower
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
  const doorRect = { x: 760, y: 275, w: 20, h: 90 };
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
  kc.style.left = "540px";
  kc.style.top = "540px";
  worldEl.appendChild(kc);
  keycard = { el: kc, x: 540, y: 540, w: 30, h: 30 };

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
    [110, 180],
    [130, 760], // lane 1
    [360, 340],
    [360, 760], // lane 2
    [540, 300],
    [540, 760], // lane 3
    [780, 180],
    [760, 760],
    [820, 430],
    [690, 430], // lane 4
  ];
  spots.forEach((s, i) => {
    const data = COLLECTIBLES[i % COLLECTIBLES.length];
    spawnCollectible(worldEl, s[0], s[1], data);
  });

  // Vault rewards — only reachable once the door is unlocked.
  const famReward = COLLECTIBLES.find((c) => c.key === "family");
  const wellReward = COLLECTIBLES.find((c) => c.key === "wellness");
  spawnCollectible(worldEl, 800, 285, famReward);
  spawnCollectible(worldEl, 845, 340, famReward);
  spawnCollectible(worldEl, 800, 350, wellReward);

  // Patrolling flu hazards.
  spawnHazards(worldEl);

  // Reset player to the entrance (open lane-1 spot, clear of every wall).
  player.x = 110;
  player.y = 430;
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
    { x: 130, y: 200, w: 30, h: 30, min: 150, max: 780, vy: 1.6 },
    { x: 360, y: 600, w: 30, h: 30, min: 150, max: 780, vy: -1.8 },
    { x: 540, y: 300, w: 30, h: 30, min: 150, max: 600, vy: 1.5 },
    { x: 760, y: 500, w: 30, h: 30, min: 150, max: 780, vy: -1.7 },
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
  if (zoneCooldown) return;
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h };
  for (const z of ZONES) {
    const zBox = { x: z.x, y: z.y, w: 90, h: 90 };
    if (overlap(pBox, zBox)) {
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
  // Nudge the player off the zone so it doesn't retrigger instantly.
  player.y += 100;
  startMazeLoop();
  setTimeout(() => {
    zoneCooldown = false;
  }, 400);
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
  zoneCooldown = false;
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
let sprint = {};
function startSprint() {
  showScreen("screen-sprint");
  const stage = document.getElementById("sprint-stage");
  stage.innerHTML = `<div class="sprint-ground"></div>
                     <div class="sprint-runner character-stage"></div>`;
  const runnerEl = stage.querySelector(".sprint-runner");
  buildCharacter(runnerEl);
  runnerEl.classList.add("walking"); // same character, running through the sprint

  sprint = { score: 0, time: 60, y: 0, vy: 0, jumping: false, objs: [] };
  state.health = 3; // fresh health each Sprint so it stays replayable in a run
  updateHUD();
  document.getElementById("sprint-score").textContent = 0;
  document.getElementById("sprint-time").textContent = 60;

  // Countdown timer.
  miniTimers.push(
    setInterval(() => {
      sprint.time--;
      document.getElementById("sprint-time").textContent = sprint.time;
      if (sprint.time <= 0) finishSprint();
    }, 1000),
  );

  // Spawn obstacles/items.
  miniTimers.push(setInterval(spawnSprintObj, 1100));

  // Physics + movement loop.
  miniTimers.push(setInterval(sprintTick, 30));
  toast(rand(SPRINT_MESSAGES), 2000);
}

function spawnSprintObj() {
  const stage = document.getElementById("sprint-stage");
  const good = Math.random() > 0.5;
  const el = document.createElement("div");
  el.className = "sprint-obj";
  el.textContent = good ? rand(SPRINT_GOOD) : rand(SPRINT_BAD);
  el.dataset.good = good ? "1" : "0";
  el.style.left = stage.clientWidth + "px";
  // Good items sometimes float higher so you jump to grab them.
  el.style.bottom = good && Math.random() > 0.5 ? "120px" : "60px";
  stage.appendChild(el);
  sprint.objs.push(el);
}

function sprintTick() {
  const stage = document.getElementById("sprint-stage");
  const runner = stage.querySelector(".sprint-runner");

  // Jump physics.
  if (sprint.jumping) {
    sprint.vy -= 1.4; // gravity
    sprint.y += sprint.vy;
    if (sprint.y <= 0) {
      sprint.y = 0;
      sprint.jumping = false;
    }
    runner.style.transform = `translateY(${-sprint.y}px)`;
  }

  const runnerBox = { x: 40, y: 60 + sprint.y, w: 46, h: 76 };

  sprint.objs = sprint.objs.filter((el) => {
    let left = parseFloat(el.style.left) - 5;
    el.style.left = left + "px";

    // Rough collision using screen coordinates.
    const objBottom = parseFloat(el.style.bottom);
    const objBox = { x: left, y: objBottom, w: 34, h: 34 };
    const rBox = { x: runnerBox.x, y: runnerBox.y, w: runnerBox.w, h: runnerBox.h };
    const hit = left < 86 && left > 10 && Math.abs(objBottom - (60 + sprint.y)) < 55;

    if (hit) {
      const hc = centerOf(el);
      if (el.dataset.good === "1") {
        sprint.score += 10;
        addScore(10);
        floatText("+10", hc.x, hc.y);
        playSound("collect");
      } else {
        sprint.score -= 5;
        const blocked = state.shielded; // shield absorbs one hit
        state.health = Math.max(0, state.health - (blocked ? 0 : 1));
        updateHUD();
        playSound(blocked ? "shield" : "hit");
        shake();
        if (blocked) floatText("Shield blocked it!", hc.x, hc.y, "#6fd3ff");
        if (state.health <= 0) {
          el.remove();
          toast("Out of health! Back to the maze.", 1800);
          finishSprint(); // return to the maze — the run keeps going
          return false;
        }
      }
      document.getElementById("sprint-score").textContent = Math.max(0, sprint.score);
      el.remove();
      return false;
    }
    if (left < -40) {
      el.remove();
      return false;
    }
    return true;
  });
}

function sprintJump() {
  if (currentMini !== "sprint") return;
  if (!sprint.jumping) {
    sprint.jumping = true;
    sprint.vy = 16;
  }
}

function finishSprint() {
  clearMiniTimers();
  addScore(Math.max(0, sprint.score));
  showPopup("Nice sprint!", rand(SPRINT_MESSAGES) + "\n\n" + rand(FACTS), [
    {
      text: "Back to maze",
      primary: true,
      action: () => {
        hidePopup();
        exitMiniGame();
      },
    },
  ]);
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

  miniTimers.push(setInterval(spawnFreezeItem, 900));
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
    vx: (Math.random() - 0.5) * 4,
    vy: -(11 + Math.random() * 3 + elapsed / 20), // launch up; faster over time
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
    it.vy += 0.22; // gravity
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
  miniTimers.push(setInterval(spawnDartBoard, 1400));
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
  const spd = (1.3 + elapsed / 30) * (fromLeft ? 1 : -1); // faster over time
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
let memory = {};
function startMemory() {
  showScreen("screen-memory");
  const stage = document.getElementById("memory-stage");
  stage.innerHTML = "";
  toast(rand(MEMORY_MESSAGES), 1800);

  // Build a deck: each pair becomes two cards that share a pairId.
  let deck = [];
  MEMORY_PAIRS.forEach((pair, i) => {
    deck.push({ pairId: i, text: pair.a });
    deck.push({ pairId: i, text: pair.b });
  });
  // Shuffle.
  deck.sort(() => Math.random() - 0.5);

  memory = { moves: 0, pairs: 0, first: null, lock: false, time: 60 };
  document.getElementById("memory-moves").textContent = 0;
  document.getElementById("memory-pairs").textContent = 0;
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
    el.innerHTML = `<span class="mem-back">💉</span><span class="mem-face">${card.text}</span>`;
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

  // Second card flipped.
  memory.moves++;
  document.getElementById("memory-moves").textContent = memory.moves;

  if (memory.first.dataset.pair === el.dataset.pair) {
    // Match!
    memory.first.classList.add("matched");
    el.classList.add("matched");
    memory.first = null;
    memory.pairs++;
    document.getElementById("memory-pairs").textContent = memory.pairs;
    addScore(15);
    playSound("success");
    const mc = centerOf(el);
    floatText("+15", mc.x, mc.y, "#57d38c");
    // Show the message tied to THIS pair (not a random slogan).
    toast(MEMORY_PAIRS[Number(el.dataset.pair)].msg, 1600);
    if (memory.pairs === MEMORY_PAIRS.length) finishMemory();
  } else {
    playSound("error");
    // Flip both back after a moment.
    memory.lock = true;
    const a = memory.first,
      b = el;
    memory.first = null;
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      memory.lock = false;
    }, 750);
  }
}

function finishMemory(timeUp = false) {
  clearMiniTimers(); // stop the countdown
  let title, body;
  if (timeUp && memory.pairs < MEMORY_PAIRS.length) {
    title = "Time's up!";
    body =
      `You matched ${memory.pairs} of ${MEMORY_PAIRS.length} pairs.\n\n` + rand(MEMORY_MESSAGES);
  } else {
    const bonus = Math.max(20, 120 - memory.moves * 5);
    addScore(bonus);
    title = "All matched!";
    body = `Bonus +${bonus}!\n\n` + rand(MEMORY_MESSAGES);
  }
  showPopup(title, body, [
    {
      text: "Back to maze",
      primary: true,
      action: () => {
        hidePopup();
        exitMiniGame();
      },
    },
  ]);
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
    if (["arrowdown", "s"].includes(k)) keys.down = true;
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
  document.getElementById("sprint-stage").addEventListener("click", sprintJump);
}

/* =========================================================
   BOOT
   ========================================================= */
window.addEventListener("load", init);
