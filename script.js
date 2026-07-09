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

// The four mini-game zones in the maze.
const ZONES = [
  { key: "sprint", label: "Hospital Sprint", icon: "🏃", color: "#1f6feb", x: 120, y: 120 },
  { key: "freeze", label: "Flu Freeze", icon: "❄", color: "#2bb3b3", x: 690, y: 120 },
  { key: "darts", label: "Vaccine Darts", icon: "🎯", color: "#e0533d", x: 120, y: 690 },
  { key: "memory", label: "Memory Match", icon: "🃏", color: "#7d5ba6", x: 690, y: 690 },
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

// --- Flu Freeze items ---
const FREEZE_GOOD = [
  "Vaccine Shield",
  "Family Dinner",
  "Vacation Day",
  "Wellness Icon",
  "Energy Boost",
  "Happy Kids",
  "Holiday Gathering",
  "Healthy Weekend",
  "Work Shift Completed",
  "Birthday Party",
];
const FREEZE_BAD = [
  "Flu Virus",
  "Sick Day",
  "Cancelled Plans",
  "Missed Shift",
  "Missed Family Dinner",
  "Low Energy",
  "Weekend Cancelled",
  "Missed Vacation",
];
const FREEZE_GOOD_MSG = [
  "Protect your plans.",
  "Stay healthy for this moment.",
  "Don't miss what matters.",
  "Keep your weekend.",
  "Be there for the people who count.",
];
// A specific consequence message for each negative item (shown only after a mistake).
const FREEZE_BAD_MSG = {
  "Flu Virus": "Flu can spread fast — protection helps stop the chain.",
  "Sick Day": "If you get the flu, staying home and avoiding spread is recommended.",
  "Cancelled Plans": "Flu can take you out for days, including plans you cannot easily reschedule.",
  "Missed Shift": "Flu can mean missed shifts and leaving your team short-staffed.",
  "Missed Family Dinner": "Flu can mean staying home and missing the people you planned to see.",
  "Low Energy": "Flu can drain your energy long after the worst is over.",
  "Weekend Cancelled": "Flu doesn't check your calendar — it can cancel your weekend.",
  "Missed Vacation": "Flu can interrupt trips, weekends, and time with family.",
};

// --- Vaccine Darts statements ---
const DARTS_MYTHS = [
  "The flu shot gives you the flu.",
  "I'm healthy, so I don't need it.",
  "I had the flu before, so I'm protected forever.",
  "The flu is just a bad cold.",
  "I got vaccinated once, so I'm protected every year.",
  "Flu vaccines do not matter for healthcare workers.",
];
const DARTS_FACTS = [
  "The flu vaccine is recommended every year.",
  "Vaccination can reduce the risk of severe illness.",
  "The flu shot cannot give you the flu.",
  "Getting vaccinated helps protect people around you.",
  "Questions about vaccines are normal.",
  "Being healthy does not mean you cannot get the flu.",
];
const DARTS_FACT_CORRECTIONS = [
  "That one was a fact — annual vaccination matters because flu viruses can change.",
  "That was true — the flu shot cannot give you the flu.",
  "That was a fact — vaccination can help reduce severe illness.",
  "That was true — getting vaccinated can help protect others around you.",
  "That was a fact — being healthy does not mean you cannot get the flu.",
  "That was true — asking questions is okay, and VaxFacts+ is there to help.",
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
};

// Character look. Defaults match the CSS defaults.
let character = {
  gender: "female",
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

// Build the CSS-shape character inside a given container element.
function buildCharacter(el) {
  el.innerHTML = `
    <div class="char-bun"></div>
    <div class="char-hair-extra"></div>
    <div class="char-eyes"><span></span><span></span></div>
    <div class="char-body"></div>
    <div class="char-badge">SHN</div>
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

  showScreen("screen-maze");
  buildMaze();
  updateHUD();

  // Camera zoom-out transition into the maze.
  const world = document.getElementById("maze-world");
  world.classList.remove("zooming");
  void world.offsetWidth; // restart animation
  world.classList.add("zooming");

  toast(rand(SLOGANS), 2200);
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
function endGame() {
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
let keys = {};
let mazeRunning = false;
let mazeFrame;

// Build all maze elements fresh.
function buildMaze() {
  const worldEl = document.getElementById("maze-world");
  // Clear everything except the player element.
  worldEl.querySelectorAll(".wall, .zone, .collectible").forEach((n) => n.remove());

  // --- Walls: outer border ---
  const T = 20; // wall thickness
  walls = [
    { x: 0, y: 0, w: WORLD_SIZE, h: T }, // top
    { x: 0, y: WORLD_SIZE - T, w: WORLD_SIZE, h: T }, // bottom
    { x: 0, y: 0, w: T, h: WORLD_SIZE }, // left
    { x: WORLD_SIZE - T, y: 0, w: T, h: WORLD_SIZE }, // right
    // Inner dividers make simple hallways (edit freely).
    { x: 250, y: 150, w: T, h: 250 },
    { x: 250, y: 150, w: 200, h: T },
    { x: 630, y: 250, w: T, h: 300 },
    { x: 450, y: 500, w: 260, h: T },
    { x: 250, y: 550, w: T, h: 250 },
    { x: 250, y: 550, w: 220, h: T },
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

  // --- Mini-game zones ---
  ZONES.forEach((z) => {
    const d = document.createElement("div");
    d.className = "zone";
    d.style.left = z.x + "px";
    d.style.top = z.y + "px";
    d.style.background = z.color;
    d.dataset.key = z.key;
    d.innerHTML = `<div class="zone-icon">${z.icon}</div>${z.label}`;
    worldEl.appendChild(d);
  });

  // --- Collectibles: scatter several of each type ---
  liveCollectibles = [];
  const spots = [
    [400, 250],
    [180, 400],
    [700, 400],
    [400, 620],
    [150, 700],
    [720, 700],
    [500, 200],
    [330, 480],
    [560, 660],
    [200, 200],
  ];
  spots.forEach((s, i) => {
    const data = COLLECTIBLES[i % COLLECTIBLES.length];
    spawnCollectible(worldEl, s[0], s[1], data);
  });

  // Reset player to an OPEN start spot (clear of every wall).
  player.x = 430;
  player.y = 300;
  player.speed = 4;
  buildCharacter(document.getElementById("player"));
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
  // Apply the effect.
  if (data.effect === "shield") {
    state.shielded = true;
    setTimeout(() => {
      state.shielded = false;
      updateHUD();
    }, 6000);
  } else if (data.effect === "speed") {
    state.speedBoost = true;
    setTimeout(() => {
      state.speedBoost = false;
    }, 5000);
  } else if (data.effect === "health") {
    state.health = Math.min(5, state.health + 1);
  }
  // "bonus" effect (Family Token, Wellness Star) is a pure score bonus — no state change.
  updateHUD();
  // Show the labeled bonus and a short personal message.
  toast(`+${data.points} ${data.bonusLabel} — ${rand(data.messages)}`);
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
    a.textContent = z.icon;
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
  buildCharacter(stage.querySelector(".sprint-runner"));

  sprint = { score: 0, time: 30, y: 0, vy: 0, jumping: false, objs: [] };
  document.getElementById("sprint-score").textContent = 0;
  document.getElementById("sprint-time").textContent = 30;

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
      if (el.dataset.good === "1") {
        sprint.score += 10;
        addScore(10);
      } else {
        sprint.score -= 5;
        state.health = Math.max(0, state.health - (state.shielded ? 0 : 1));
        updateHUD();
        if (state.health <= 0) {
          el.remove();
          toast("Out of health!", 1500);
          endGame();
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
let freeze = {};
function startFreeze() {
  showScreen("screen-freeze");
  const stage = document.getElementById("freeze-stage");
  stage.innerHTML = "";
  freeze = { score: 0, lives: 3 };
  document.getElementById("freeze-score").textContent = 0;
  document.getElementById("freeze-lives").textContent = 3;
  toast(rand(FREEZE_GOOD_MSG), 1800);
  miniTimers.push(setInterval(spawnFreezeItem, 850));
}

function spawnFreezeItem() {
  const stage = document.getElementById("freeze-stage");
  const good = Math.random() > 0.42;
  const label = good ? rand(FREEZE_GOOD) : rand(FREEZE_BAD);
  const el = document.createElement("div");
  el.className = "fly-item " + (good ? "fly-good" : "fly-bad");
  el.textContent = label;
  const startX = Math.random() * (stage.clientWidth - 120);
  el.style.left = startX + "px";
  el.style.top = stage.clientHeight + "px";

  stage.appendChild(el);

  // Fly upward in an arc, then fall.
  let vy = -(9 + Math.random() * 4);
  const timer = setInterval(() => {
    vy += 0.25;
    const top = parseFloat(el.style.top) + vy;
    el.style.top = top + "px";
    if (top > stage.clientHeight + 60) {
      clearInterval(timer);
      el.remove();
    }
  }, 30);
  miniTimers.push(timer);

  el.addEventListener("click", () => {
    if (good) {
      freeze.score += 10;
      addScore(10);
      toast(rand(FREEZE_GOOD_MSG), 1200);
    } else {
      freeze.lives--;
      document.getElementById("freeze-lives").textContent = freeze.lives;
      // Show the specific consequence for the item that was sliced.
      toast(FREEZE_BAD_MSG[label] || "Flu can interrupt the moments that matter.", 1600);
      if (freeze.lives <= 0) {
        finishFreeze();
      }
    }
    document.getElementById("freeze-score").textContent = freeze.score;
    clearInterval(timer);
    el.remove();
  });
}

function finishFreeze() {
  clearMiniTimers();
  showPopup("Flu Freeze complete!", `You scored ${freeze.score}.\n\n` + rand(FACTS), [
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

/* ---------- 6c. VACCINE DARTS ---------- */
let darts = {};
function startDarts() {
  showScreen("screen-darts");
  const stage = document.getElementById("darts-stage");
  stage.innerHTML = "";
  darts = { score: 0, time: 30 };
  document.getElementById("darts-score").textContent = 0;
  document.getElementById("darts-time").textContent = 30;
  toast(rand(["Protect yourself with facts.", "Stay informed. Stay protected."]), 2000);

  miniTimers.push(
    setInterval(() => {
      darts.time--;
      document.getElementById("darts-time").textContent = darts.time;
      if (darts.time <= 0) finishDarts();
    }, 1000),
  );
  miniTimers.push(setInterval(spawnDartTarget, 1300));
}

function spawnDartTarget() {
  const stage = document.getElementById("darts-stage");
  const isMyth = Math.random() > 0.45;
  const el = document.createElement("div");
  el.className = "fly-item " + (isMyth ? "fly-bad" : "fly-good");
  let text,
    correction = "";
  if (isMyth) {
    text = rand(DARTS_MYTHS);
  } else {
    const i = Math.floor(Math.random() * DARTS_FACTS.length);
    text = DARTS_FACTS[i];
    correction = DARTS_FACT_CORRECTIONS[i];
  }
  el.textContent = text;

  const top = 20 + Math.random() * (stage.clientHeight - 120);
  el.style.top = top + "px";
  const fromLeft = Math.random() > 0.5;
  el.style.left = fromLeft ? "-200px" : stage.clientWidth + "px";
  stage.appendChild(el);

  const dir = fromLeft ? 3 : -3;
  const timer = setInterval(() => {
    const left = parseFloat(el.style.left) + dir;
    el.style.left = left + "px";
    if (left < -220 || left > stage.clientWidth + 40) {
      clearInterval(timer);
      el.remove();
    }
  }, 30);
  miniTimers.push(timer);

  el.addEventListener("click", () => {
    if (isMyth) {
      darts.score += 10;
      addScore(10);
      toast(`Myth cleared! ${rand(DARTS_FACTS)}`, 1600);
    } else {
      darts.score = Math.max(0, darts.score - 5);
      toast(correction, 2200);
    }
    document.getElementById("darts-score").textContent = darts.score;
    clearInterval(timer);
    el.remove();
  });
}

function finishDarts() {
  clearMiniTimers();
  showPopup("Vaccine Darts complete!", `You scored ${darts.score}.\n\n` + rand(FACTS), [
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

  memory = { moves: 0, pairs: 0, first: null, lock: false };
  document.getElementById("memory-moves").textContent = 0;
  document.getElementById("memory-pairs").textContent = 0;

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
    // Show the message tied to THIS pair (not a random slogan).
    toast(MEMORY_PAIRS[Number(el.dataset.pair)].msg, 1600);
    if (memory.pairs === MEMORY_PAIRS.length) finishMemory();
  } else {
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

function finishMemory() {
  const bonus = Math.max(20, 120 - memory.moves * 5);
  addScore(bonus);
  showPopup("All matched!", `Bonus +${bonus}!\n\n` + rand(MEMORY_MESSAGES), [
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
