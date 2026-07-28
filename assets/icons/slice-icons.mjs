// Slice icons.png (transparent bg) into individual icon PNGs by detecting each
// icon's alpha bounding box within two known row bands (avoids the text labels).
import fs from "fs";
import zlib from "zlib";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(DIR, "icons.png");

// ---- decode RGBA PNG ----
const buf = fs.readFileSync(SRC);
let p = 8;
const idat = [];
let W, H;
while (p < buf.length) {
  const len = buf.readUInt32BE(p);
  const t = buf.toString("ascii", p + 4, p + 8);
  const d = buf.subarray(p + 8, p + 8 + len);
  if (t === "IHDR") {
    W = d.readUInt32BE(0);
    H = d.readUInt32BE(4);
  } else if (t === "IDAT") idat.push(d);
  else if (t === "IEND") break;
  p += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idat));
const stride = W * 4;
const px = Buffer.alloc(H * stride);
const paeth = (a, b, c) => {
  const pp = a + b - c,
    pa = Math.abs(pp - a),
    pb = Math.abs(pp - b),
    pc = Math.abs(pp - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};
for (let y = 0; y < H; y++) {
  const ft = raw[y * (stride + 1)];
  const rs = y * (stride + 1) + 1;
  for (let x = 0; x < stride; x++) {
    const v = raw[rs + x];
    const a = x >= 4 ? px[y * stride + x - 4] : 0;
    const b = y > 0 ? px[(y - 1) * stride + x] : 0;
    const c = x >= 4 && y > 0 ? px[(y - 1) * stride + x - 4] : 0;
    let o;
    if (ft === 0) o = v;
    else if (ft === 1) o = v + a;
    else if (ft === 2) o = v + b;
    else if (ft === 3) o = v + ((a + b) >> 1);
    else o = v + paeth(a, b, c);
    px[y * stride + x] = o & 255;
  }
}
const alpha = (x, y) => px[(y * W + x) * 4 + 3];

// ---- segment a horizontal band into left→right icon clusters ----
const TH = 60; // alpha threshold for "ink"
function clustersInBand(y0, y1) {
  const col = new Array(W).fill(0);
  for (let x = 0; x < W; x++) {
    let n = 0;
    for (let y = y0; y < y1; y++) if (alpha(x, y) > TH) n++;
    col[x] = n;
  }
  const clusters = [];
  let start = -1,
    gap = 0;
  const GAP = 14; // empty-column run that separates two icons
  for (let x = 0; x < W; x++) {
    if (col[x] > 0) {
      if (start < 0) start = x;
      gap = 0;
    } else if (start >= 0) {
      if (++gap >= GAP) {
        clusters.push([start, x - gap]);
        start = -1;
      }
    }
  }
  if (start >= 0) clusters.push([start, W - 1]);
  // tighten each cluster's bbox vertically
  return clusters
    .filter(([a, b]) => b - a > 20) // drop noise
    .map(([xa, xb]) => {
      let minY = y1,
        maxY = y0,
        minX = xb,
        maxX = xa;
      for (let y = y0; y < y1; y++)
        for (let x = xa; x <= xb; x++)
          if (alpha(x, y) > TH) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    });
}

// ---- encode a cropped square RGBA PNG ----
function crc32(b) {
  let c = ~0;
  for (let i = 0; i < b.length; i++) {
    c ^= b[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function savePNG(name, box) {
  const pad = 10;
  const side = Math.max(box.w, box.h) + pad * 2;
  const out = Buffer.alloc(side * side * 4); // transparent
  const ox = ((side - box.w) / 2) | 0,
    oy = ((side - box.h) / 2) | 0;
  for (let y = 0; y < box.h; y++)
    for (let x = 0; x < box.w; x++) {
      const si = ((box.y + y) * W + (box.x + x)) * 4;
      const di = ((oy + y) * side + (ox + x)) * 4;
      out[di] = px[si];
      out[di + 1] = px[si + 1];
      out[di + 2] = px[si + 2];
      out[di + 3] = px[si + 3];
    }
  const os = side * 4;
  const rawOut = Buffer.alloc(side * (os + 1));
  for (let y = 0; y < side; y++) {
    rawOut[y * (os + 1)] = 0;
    out.copy(rawOut, y * (os + 1) + 1, y * os, y * os + os);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(side, 0);
  ihdr.writeUInt32BE(side, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(rawOut)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(DIR, name + ".png"), png);
  return side;
}

// ---- run ----
const TOP = clustersInBand(140, 470);
const BOT = clustersInBand(590, 905);
console.log(`top clusters: ${TOP.length}  bottom clusters: ${BOT.length}`);
const topNames = ["shield", "syringe", "heart", "family", "speed"];
const botNames = ["germ", "barrier", "calendar", "cloud", "star", "energy"];
TOP.forEach((b, i) => {
  const s = savePNG(topNames[i] || "top_" + i, b);
  console.log(`${(topNames[i] || "top_" + i).padEnd(9)} x=${b.x} y=${b.y} ${b.w}x${b.h} -> ${s}²`);
});
BOT.forEach((b, i) => {
  const s = savePNG(botNames[i] || "bot_" + i, b);
  console.log(`${(botNames[i] || "bot_" + i).padEnd(9)} x=${b.x} y=${b.y} ${b.w}x${b.h} -> ${s}²`);
});
