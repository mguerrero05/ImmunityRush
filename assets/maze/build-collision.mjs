// =============================================================================
// build-collision.mjs — regenerates assets/maze/wallmask.js from maze-bg.png.
//
// The game's collision is DERIVED from the maze artwork: this script scans the
// picture (cream/gray = wall, teal = floor), widens the hallways, then applies
// every hand-tuned fix we worked out (spawn spot, triggers inside rooms, the
// widened stuck hallway, the opened Memory/Sprint rooms, and the bottom
// corridor). Re-run it whenever maze-bg.png changes:
//
//     node assets/maze/build-collision.mjs
//
// Requirements for a replacement maze-bg.png: SAME size (1586x992) and SAME
// room/hallway layout — just edit walls in place. If the layout moves, the
// coordinates below (spawn/triggers/openings) must be re-tuned.
// =============================================================================
import fs from "fs";
import zlib from "zlib";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const IMG = path.join(DIR, "maze-bg.png");
const OUT = path.join(DIR, "wallmask.js");

// ---- Decode the PNG (no external libs: manual inflate + unfilter) ----
const buf = fs.readFileSync(IMG);
let p = 8,
  W = 0,
  H = 0,
  ct = 0;
const idat = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p);
  const type = buf.toString("ascii", p + 4, p + 8);
  const data = buf.subarray(p + 8, p + 8 + len);
  if (type === "IHDR") {
    W = data.readUInt32BE(0);
    H = data.readUInt32BE(4);
    ct = data[9];
  } else if (type === "IDAT") idat.push(data);
  else if (type === "IEND") break;
  p += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));
const bpp = ct === 6 ? 4 : 3;
const stride = W * bpp;
const out = Buffer.alloc(H * stride);
const paeth = (a, b, c) => {
  const q = a + b - c,
    pa = Math.abs(q - a),
    pb = Math.abs(q - b),
    pc = Math.abs(q - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
let o = 0;
for (let y = 0; y < H; y++) {
  const f = raw[o++];
  for (let x = 0; x < stride; x++) {
    const v = raw[o++];
    const a = x >= bpp ? out[y * stride + x - bpp] : 0;
    const b = y > 0 ? out[(y - 1) * stride + x] : 0;
    const c = x >= bpp && y > 0 ? out[(y - 1) * stride + x - bpp] : 0;
    let r;
    switch (f) {
      case 1: r = v + a; break;
      case 2: r = v + b; break;
      case 3: r = v + ((a + b) >> 1); break;
      case 4: r = v + paeth(a, b, c); break;
      default: r = v;
    }
    out[y * stride + x] = r & 0xff;
  }
}
const rgb = (x, y) => {
  const i = y * stride + x * bpp;
  return [out[i], out[i + 1], out[i + 2]];
};
// Teal floor = bluish + mid brightness; cream/gray walls and dark bg are excluded.
const isFloor = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  const [r, g, b] = rgb(x, y);
  return b >= r + 10 && r >= 55 && b <= 210;
};

// ---- Build the floor grid (F px per cell) and widen hallways ----
const F = 4,
  mw = Math.ceil(W / F),
  mh = Math.ceil(H / F),
  N = mw * mh;
const id = (mx, my) => my * mw + mx;
const cell = (ix, iy) => id((ix / F) | 0, (iy / F) | 0);
let floor = new Uint8Array(N);
for (let my = 0; my < mh; my++)
  for (let mx = 0; mx < mw; mx++) floor[id(mx, my)] = isFloor(mx * F + 2, my * F + 2) ? 1 : 0;

const disk = (r) => {
  const o = [];
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) o.push([dx, dy]);
  return o;
};
const morph = (src, r, m) => {
  const off = disk(r),
    ds = new Uint8Array(N);
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      let v = m === "e" ? 1 : 0;
      for (const [dx, dy] of off) {
        const nx = x + dx,
          ny = y + dy;
        const s = nx < 0 || ny < 0 || nx >= mw || ny >= mh ? 0 : src[id(nx, ny)];
        if (m === "d") {
          if (s) { v = 1; break; }
        } else if (!s) { v = 0; break; }
      }
      ds[id(x, y)] = v;
    }
  return ds;
};
// Less widening than before (was r3/~12px): r3 bridged the floor UP over the
// thin wall faces onto the teal wall TOPS, letting the player walk on walls.
floor = morph(floor, 2, "d"); // ~8px each side — enough to stay passable

// ---- Opening helpers (carve floor) ----
const oPt = (ix, iy, rc) => {
  const cx = (ix / F) | 0,
    cy = (iy / F) | 0;
  for (const [dx, dy] of disk(rc)) {
    const x = cx + dx,
      y = cy + dy;
    if (x < 0 || y < 0 || x >= mw || y >= mh) continue;
    floor[id(x, y)] = 1;
  }
};
const oLine = (x0, y0, x1, y1, rc) => {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2);
  for (let i = 0; i <= n; i++) oPt(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, rc);
};

// ---- Player footprint + body-reachability (matches the game's feetBlocked) ----
const SPAWN = [300, 230]; // player top-left — the SHN reception START (matches script.js START_X/Y)
const feetB = (px, py, B) =>
  [
    [px + 23, py + 68],
    [px + 18.4, py + 67],
    [px + 27.6, py + 67],
    [px + 23, py + 62],
  ].some(([x, y]) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return 1;
    const i = cell(x, y);
    return (buildBits()[i >> 3] >> (i & 7)) & 1;
  });
let _bitsCache = null,
  _bitsDirty = true;
function buildBits() {
  if (_bitsDirty) {
    _bitsCache = new Uint8Array(Math.ceil(N / 8));
    for (let i = 0; i < N; i++) if (!floor[i]) _bitsCache[i >> 3] |= 1 << (i & 7);
    _bitsDirty = false;
  }
  return _bitsCache;
}
const markDirty = () => (_bitsDirty = true);
const STEP = 2,
  gW = Math.ceil(W / STEP),
  gH = Math.ceil(H / STEP);
const pI = (gx, gy) => gy * gW + gx;
function bodyFlood() {
  markDirty();
  const seen = new Uint8Array(gW * gH);
  const sgx = (SPAWN[0] / STEP) | 0,
    sgy = (SPAWN[1] / STEP) | 0;
  if (feetB(SPAWN[0], SPAWN[1], null)) return seen;
  const st = [[sgx, sgy]];
  seen[pI(sgx, sgy)] = 1;
  while (st.length) {
    const [gx, gy] = st.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = gx + dx,
        ny = gy + dy;
      if (nx < 0 || ny < 0 || nx >= gW || ny >= gH) continue;
      const pi = pI(nx, ny);
      if (seen[pi]) continue;
      if (feetB(nx * STEP, ny * STEP, null)) continue;
      seen[pi] = 1;
      st.push([nx, ny]);
    }
  }
  return seen;
}
const nearestReach = (seen, tx, ty) => {
  let best = null,
    bd = 1e9;
  for (let gy = 0; gy < gH; gy++)
    for (let gx = 0; gx < gW; gx++) {
      if (!seen[pI(gx, gy)]) continue;
      const fx = gx * STEP + 23,
        fy = gy * STEP + 66,
        dd = Math.hypot(fx - tx, fy - ty);
      if (dd < bd) { bd = dd; best = [fx, fy, Math.round(dd)]; }
    }
  return best;
};

// ---- Hand-tuned fixes (all in maze image-pixel coordinates) ----
// 1. Widen the pinch hallway between Freeze and Memory.
oLine(910, 276, 992, 276, 8);
oLine(992, 276, 1059, 276, 8);
// 2. Open the Memory and Hospital Sprint rooms so triggers can sit inside them.
oPt(1030, 438, 11); // Memory Clinic interior
oPt(304, 532, 11); // Hospital Sprint interior
markDirty();
// 3. Connect the widened hallway + both opened rooms to the reachable network.
const CONNECT = { hallway: [992, 320], memory: [1030, 438], sprint: [304, 532] };
for (let it = 0; it < 8; it++) {
  const seen = bodyFlood();
  let need = null;
  for (const [k, [tx, ty]] of Object.entries(CONNECT)) {
    const nf = nearestReach(seen, tx, ty);
    if (!nf || nf[2] > 30) { need = [k, tx, ty, nf]; break; }
  }
  if (!need) break;
  const [, tx, ty, nf] = need;
  if (!nf) break;
  oLine(nf[0], nf[1], tx, ty, 8);
  markDirty();
}
// 4. Bottom corridor: Sprint -> left doors -> above Information -> centre wall ->
//    where the player stands on the right (opens the sealed bottom-centre).
oLine(259, 604, 313, 704, 8);
oLine(313, 704, 829, 616, 8);
oLine(829, 616, 1019, 738, 8);
markDirty();
// 5. Straight passage DOWN from the Freeze hallway into the Memory room (the
//    Freeze->Memory hallway used to dead-end just above Memory).
oLine(970, 320, 1015, 405, 8);
markDirty();
// 6. Open the thick wall block that trapped the lower-left corridor (by Hospital
//    Sprint / Information) — a direct east-west passage so you don't backtrack.
oLine(258, 760, 362, 760, 8);
markDirty();

// ---- Verify + write ----
const seen = bodyFlood();
const reach = (ix, iy) => {
  const nf = nearestReach(seen, ix, iy);
  return nf && nf[2] <= 34;
};
const clinics = {
  darts: [645, 210],
  freeze: [935, 200],
  sprint: [304, 532],
  memory: [1030, 438],
};
let allOk = true;
for (const [k, [x, y]] of Object.entries(clinics)) {
  const ok = reach(x, y);
  if (!ok) allOk = false;
  console.log("  clinic", k, ok ? "PASS" : "*** FAIL ***");
}
console.log("  bottom route (char 1019,738):", reach(1019, 738) ? "PASS" : "FAIL");

const B = buildBits();
fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by build-collision.mjs from maze-bg.png — do not edit by hand.\n` +
    `window.WALL_MASK={w:${mw},h:${mh},f:${F},iw:${W},ih:${H},bits:"${Buffer.from(B).toString("base64")}"};\n`,
);
console.log(allOk ? "OK — wrote wallmask.js" : "WARNING — some clinics unreachable; wrote wallmask.js anyway");
