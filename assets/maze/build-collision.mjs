// =============================================================================
// build-collision.mjs — regenerates assets/maze/wallmask.js from the HAND-DRAWN
// walkable map (maze-paths.png / .jpg): the user painted the hallways the player
// can walk in with MAGENTA. Walkable = painted; wall = everything else. This is
// far more accurate than guessing walls from the maze artwork's colours.
//
//   node assets/maze/build-collision.mjs
//
// To update: re-paint the magenta paths on a copy of maze-bg.png, export it as
// maze-paths.png (or .jpg) in this folder, and re-run. The maze can sit anywhere
// on the canvas — its bounding box is auto-detected and mapped to the 1584x993
// game world.
// =============================================================================
import fs from "fs";
import zlib from "zlib";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(DIR, "wallmask.js");
const W = 1584,
  H = 993,
  F = 4; // game world size + mask cell size

// ---- Load the drawing (prefer .png; convert .jpg via sips if needed) ----
function loadDrawing() {
  const png = path.join(DIR, "maze-paths.png");
  const jpg = path.join(DIR, "maze-paths.jpg");
  let src = png;
  if (!fs.existsSync(png) && fs.existsSync(jpg)) {
    execSync(`sips -s format png "${jpg}" --out "/tmp/_paths.png"`);
    src = "/tmp/_paths.png";
  } else if (fs.existsSync(jpg) && fs.statSync(jpg).mtimeMs > fs.statSync(png).mtimeMs) {
    execSync(`sips -s format png "${jpg}" --out "/tmp/_paths.png"`);
    src = "/tmp/_paths.png";
  }
  return decode(src);
}

// ---- Manual PNG decode (no external libs) ----
function decode(file) {
  const buf = fs.readFileSync(file);
  let p = 8;
  const idat = [];
  let iw, ih, ct;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    const t = buf.toString("ascii", p + 4, p + 8);
    const d = buf.subarray(p + 8, p + 8 + len);
    if (t === "IHDR") {
      iw = d.readUInt32BE(0);
      ih = d.readUInt32BE(4);
      ct = d[9];
    } else if (t === "IDAT") idat.push(d);
    else if (t === "IEND") break;
    p += 12 + len;
  }
  const ch = ct === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = iw * ch;
  const px = Buffer.alloc(ih * stride);
  const paeth = (a, b, c) => {
    const q = a + b - c,
      pa = Math.abs(q - a),
      pb = Math.abs(q - b),
      pc = Math.abs(q - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < ih; y++) {
    const f = raw[y * (stride + 1)];
    const rs = y * (stride + 1) + 1;
    for (let x = 0; x < stride; x++) {
      const v = raw[rs + x];
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const b = y > 0 ? px[(y - 1) * stride + x] : 0;
      const c = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let o;
      if (f === 0) o = v;
      else if (f === 1) o = v + a;
      else if (f === 2) o = v + b;
      else if (f === 3) o = v + ((a + b) >> 1);
      else o = v + paeth(a, b, c);
      px[y * stride + x] = o & 255;
    }
  }
  return { W: iw, H: ih, ch, px };
}

const img = loadDrawing();
const at = (x, y) => {
  const i = (y * img.W + x) * img.ch;
  return [img.px[i], img.px[i + 1], img.px[i + 2]];
};
// The painted path colour = hot pink (~207,54,107). Detect with tolerance (JPG).
const isPink = (r, g, b) => r > 150 && g < 115 && r - g > 70 && b - g > 18 && r > b;
const nearWhite = (r, g, b) => r > 238 && g > 238 && b > 238;

// ---- Auto-detect where the maze sits in the drawing (bbox of non-white, non-
//      pink content). Trust left/top/width + the known maze aspect for height,
//      so pink overspill past the maze bottom doesn't skew the mapping. ----
let x0 = 1e9,
  y0 = 1e9,
  x1 = -1;
for (let y = 0; y < img.H; y += 2)
  for (let x = 0; x < img.W; x += 2) {
    const [r, g, b] = at(x, y);
    if (nearWhite(r, g, b) || isPink(r, g, b)) continue;
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
  }
const SC = (x1 - x0) / W; // uniform scale (drawing px per world px)
const OX = x0,
  OY = y0;
const pinkAt = (wx, wy) => {
  const jx = Math.round(OX + wx * SC),
    jy = Math.round(OY + wy * SC);
  if (jx < 0 || jy < 0 || jx >= img.W || jy >= img.H) return false;
  const i = (jy * img.W + jx) * img.ch;
  return isPink(img.px[i], img.px[i + 1], img.px[i + 2]);
};

// ---- Build the floor grid (F px per cell) from the painted paths ----
const mw = Math.ceil(W / F),
  mh = Math.ceil(H / F),
  N = mw * mh;
let floor = new Uint8Array(N);
for (let my = 0; my < mh; my++)
  for (let mx = 0; mx < mw; mx++) floor[my * mw + mx] = pinkAt(mx * F + 2, my * F + 2) ? 1 : 0;

// Smooth the freehand paint + bridge small gaps + widen entrances: dilate ~12px.
const disk = (r) => {
  const o = [];
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) o.push([dx, dy]);
  return o;
};
function dilate(src, r) {
  const off = disk(r),
    ds = new Uint8Array(N);
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      let v = 0;
      for (const [dx, dy] of off) {
        const nx = x + dx,
          ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < mw && ny < mh && src[ny * mw + nx]) {
          v = 1;
          break;
        }
      }
      ds[y * mw + x] = v;
    }
  return ds;
}
floor = dilate(floor, 3);

// ---- Player footprint + reachability (matches the game's feetBlocked) ----
const SPAWN = [328, 180];
const cell = (ix, iy) => ((iy / F) | 0) * mw + ((ix / F) | 0);
let _bits = null,
  _dirty = true;
function bits() {
  if (_dirty) {
    _bits = new Uint8Array(Math.ceil(N / 8));
    for (let i = 0; i < N; i++) if (!floor[i]) _bits[i >> 3] |= 1 << (i & 7);
    _dirty = false;
  }
  return _bits;
}
const feetB = (px, py) =>
  [
    [px + 23, py + 68],
    [px + 18.4, py + 67],
    [px + 27.6, py + 67],
    [px + 23, py + 62],
  ].some(([x, y]) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return 1;
    const i = cell(x, y);
    return (bits()[i >> 3] >> (i & 7)) & 1;
  });

const STEP = 4;
function flood() {
  const seen = new Set();
  const k = (x, y) => x + "," + y;
  if (feetB(SPAWN[0], SPAWN[1])) return seen;
  const q = [SPAWN];
  seen.add(k(SPAWN[0], SPAWN[1]));
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [
      [STEP, 0],
      [-STEP, 0],
      [0, STEP],
      [0, -STEP],
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const kk = k(nx, ny);
      if (seen.has(kk) || feetB(nx, ny)) continue;
      seen.add(kk);
      q.push([nx, ny]);
    }
  }
  return seen;
}
const seen = flood();
const reach = (tx, ty) => {
  for (let r = 0; r <= 40; r += 8)
    for (let a = 0; a < 360; a += 45) {
      const px = Math.round((tx + r * Math.cos((a * Math.PI) / 180)) / STEP) * STEP,
        py = Math.round((ty + r * Math.sin((a * Math.PI) / 180)) / STEP) * STEP;
      if (seen.has(px + "," + py)) return true;
    }
  return false;
};
console.log(`  drawing ${img.W}x${img.H}  maze@(${OX},${OY}) scale ${SC.toFixed(3)}`);
console.log(`  floor cells ${floor.reduce((a, b) => a + b, 0)}/${N}  reachable ${seen.size}`);
let ok = true;
for (const [k, x, y] of [
  ["darts", 645, 170],
  ["freeze", 935, 165],
  ["sprint", 304, 532],
  ["memory", 1030, 438],
])
  if (reach(x, y)) console.log("  clinic", k, "PASS");
  else {
    ok = false;
    console.log("  clinic", k, "*** UNREACHABLE — paint a path to it ***");
  }
console.log("  spawn(300,180) walkable:", !feetB(300, 180));

// ---- Write wallmask.js ----
const B = bits();
fs.writeFileSync(
  OUT,
  `// AUTO-GENERATED by build-collision.mjs from the hand-drawn maze-paths — do not edit by hand.\n` +
    `window.WALL_MASK={w:${mw},h:${mh},f:${F},iw:${W},ih:${H},bits:"${Buffer.from(B).toString("base64")}"};\n`,
);
console.log(
  ok
    ? "OK — wrote wallmask.js from your painted paths"
    : "WARN — some clinics unreachable; wrote anyway",
);
