#!/usr/bin/env node
/**
 * render_preview.mjs
 * Authentic 3D Minecraft Voxel & Nearest-Neighbor 16x16 / 8x8 Pixel-Texel Raymarcher.
 *
 * Implements canonical Minecraft pixel-grid proportions (1 pixel = 0.045 world units, 16px block = 0.72 units):
 * - Head:  Sharp 8x8x8 pixel cube + +0.5px 3D Outer Skin Layer (stepped pixel hair/bangs/helmet)
 * - Face:  Exact 8x8 integer texel grid (2x1 white sclera + 1x1 sliding pupil + 2x1 floating brows)
 * - Torso: 8x12x4 pixel rectangular prism with 8x12 nearest-neighbor tunic/armor texels
 * - Limbs: 4x12x4 (Steve Wide) or 3x12x4 (Alex Slim) rectangular prisms with flat 4x4 / 3x4 square hand ends
 * - Tools: True 16x16x1 extruded 3D pixel-art sprites (Diamond Pickaxe, Diamond Sword) with stepped 90° edges
 * - Blocks: 16x16x16 Grass Block, Diamond Ore, TNT Block, Crafting Table, and 14x14x14 Hinged Chest
 * - Mobs:  Canonical armless quadruped Creeper (8x8 black pixel face) & Pink Voxel Axolotl
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { execFileSync } from "node:child_process";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
const mix = (a, b, t) => a + (b - a) * t;
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

function v3(x = 0, y = 0, z = 0) {
  return { x, y, z };
}
const add3 = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const sub3 = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const mul3 = (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s });
const dot3 = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const len3 = (a) => Math.hypot(a.x, a.y, a.z);
const norm3 = (a) => {
  const l = len3(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};
const cross3 = (a, b) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x
});

function rotY(p, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return { x: c * p.x + s * p.z, y: p.y, z: -s * p.x + c * p.z };
}
function rotX(p, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return { x: p.x, y: c * p.y - s * p.z, z: s * p.y + c * p.z };
}
function rotZ(p, ang) {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return { x: c * p.x - s * p.y, y: s * p.x + c * p.y, z: p.z };
}

function sdBox(p, b) {
  const qx = Math.abs(p.x) - b.x;
  const qy = Math.abs(p.y) - b.y;
  const qz = Math.abs(p.z) - b.z;
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  const oz = Math.max(qz, 0);
  return Math.hypot(ox, oy, oz) + Math.min(Math.max(qx, qy, qz), 0);
}

function sdRoundBox(p, b, r) {
  return sdBox(p, v3(b.x - r, b.y - r, b.z - r)) - r;
}

function sdRoundedCylinder(p, ra, rb, h) {
  const dx = Math.hypot(p.x, p.z) - ra + rb;
  const dy = Math.abs(p.y) - h + rb;
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  return Math.min(Math.max(dx, dy), 0) + Math.hypot(ox, oy) - rb;
}

function sdLegoCClaw(p, scale = 1.0) {
  const q = mul3(p, 1 / scale);
  const qRot = rotX(q, Math.PI / 2);
  const dOuter = sdRoundedCylinder(qRot, 0.14, 0.025, 0.09);
  const dInner = sdRoundedCylinder(qRot, 0.07, 0.01, 0.16);
  const dSlot = sdRoundBox(sub3(q, v3(0, -0.10, 0)), v3(0.06, 0.10, 0.16), 0.01);
  return Math.max(dOuter, -Math.min(dInner, dSlot)) * scale;
}

// Deterministic hash for nearest-neighbor pixel texel variation
function texHash(ix, iy, iz = 0) {
  let n = (ix * 374761393 + iy * 668265263 + iz * 1442695041) | 0;
  n = ((n ^ (n >> 13)) * 1274126177) | 0;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

function shadeTexel(rgb, delta) {
  return [
    clamp(rgb[0] + delta, 0, 255),
    clamp(rgb[1] + delta, 0, 255),
    clamp(rgb[2] + delta, 0, 255)
  ];
}

// ---------- 16x16 Extruded Pixel-Art Tool Sprites ----------
// "." = empty, "W" = dark oak border, "w" = oak wood stick,
// "D" = cyan diamond #4AEDD9, "d" = teal diamond border #0891B2, "H" = white-cyan highlight #CFFAFE
const PICKAXE_SPRITE_16 = [
  "..........dddd..",
  "........ddDDDDd.",
  ".......dDDHHDDd.",
  "......dDDHdddDd.",
  ".....dDDd..Wwdd.",
  ".....dDd..WwWdd.",
  ".....dd..WwW.dD.",
  "........WwW..dD.",
  ".......WwW...dD.",
  "......WwW....dd.",
  ".....WwW........",
  "....WwW.........",
  "...WwW..........",
  "..WwW...........",
  ".WwW............",
  ".WW............."
];

const SWORD_SPRITE_16 = [
  ".............dd.",
  "............dDDd",
  "...........dDHDd",
  "..........dDHDd.",
  ".........dDHDd..",
  "........dDHDd...",
  ".......dDHDd....",
  "......dDHDd.....",
  "...dd.dDDd......",
  "...dDddDd.......",
  "....dDDd........",
  "...WwWdd........",
  "..WwW.dd........",
  ".WwW............",
  "dDd.............",
  "dd.............."
];

function spriteCharColor(ch) {
  if (ch === "W") return [92, 56, 24];
  if (ch === "w") return [146, 94, 44];
  if (ch === "D") return [74, 237, 217];
  if (ch === "d") return [14, 148, 136];
  if (ch === "H") return [207, 250, 254];
  return null;
}

export function evalVoxelSprite16x16(pLocal, spriteRows, pxSize = 0.026, halfThick = 0.018) {
  const halfSpan = 8 * pxSize;
  const dBound = sdBox(pLocal, v3(halfSpan + pxSize, halfSpan + pxSize, halfThick + pxSize));
  if (dBound > 0.035) {
    return { d: dBound, color: [74, 237, 217], roughness: 0.2 };
  }

  const gx = clamp(Math.floor((pLocal.x + halfSpan) / pxSize), 0, 15);
  const gy = clamp(Math.floor((halfSpan - pLocal.y) / pxSize), 0, 15);

  let bestD = 1e9;
  let bestCol = [74, 237, 217];
  for (let dy = -1; dy <= 1; dy++) {
    const ry = gy + dy;
    if (ry < 0 || ry > 15) continue;
    const row = spriteRows[ry];
    for (let dx = -1; dx <= 1; dx++) {
      const rx = gx + dx;
      if (rx < 0 || rx > 15) continue;
      const ch = row[rx];
      if (ch === ".") continue;
      const cx = -halfSpan + (rx + 0.5) * pxSize;
      const cy = halfSpan - (ry + 0.5) * pxSize;
      const dp = sdBox(sub3(pLocal, v3(cx, cy, 0)), v3(pxSize * 0.5, pxSize * 0.5, halfThick));
      if (dp < bestD) {
        bestD = dp;
        bestCol = spriteCharColor(ch);
      }
    }
  }
  if (bestD > 1e8) {
    const dz = Math.max(Math.abs(pLocal.z) - halfThick, 0);
    return { d: Math.hypot(pxSize * 1.25, dz), color: bestCol, roughness: 0.16 };
  }
  return { d: bestD, color: bestCol, roughness: 0.16 };
}

// ---------- Canonical 8x8 Minecraft Pixel Face Evaluator ----------
function evalMinecraftFace8x8(ix, iy, expression = "smile", theme = "steve") {
  // ix in 0..7 (left to right), iy in 0..7 (bottom to top)
  const white = [255, 255, 255];
  const pupil =
    theme === "alex"
      ? [34, 139, 87]
      : theme === "knight"
      ? [34, 211, 238]
      : [59, 59, 143];
  const brow =
    theme === "alex"
      ? [180, 83, 32]
      : theme === "knight"
      ? [30, 41, 59]
      : [74, 44, 24];

  // Waterfall tears on columns 2 and 5
  if (expression === "panic" || expression === "tears") {
    if ((ix === 2 || ix === 5) && iy <= 2) {
      return iy % 2 === 0 ? [56, 189, 248] : [125, 211, 252];
    }
  }

  // Eyebrows (iy = 5)
  if (iy === 5 && (ix === 1 || ix === 2 || ix === 5 || ix === 6)) {
    if (expression !== "shocked" && expression !== "panic") return brow;
  }
  if ((expression === "shocked" || expression === "panic") && iy === 6 && (ix === 1 || ix === 2 || ix === 5 || ix === 6)) {
    return brow;
  }

  // Eyes (iy = 3..4)
  if (expression === "shocked" || expression === "panic") {
    // 2x2 wide shocked pixel eyes
    if ((iy === 3 || iy === 4) && (ix === 1 || ix === 2 || ix === 5 || ix === 6)) {
      if (iy === 4 && (ix === 2 || ix === 5)) return [15, 23, 42];
      return white;
    }
  } else if (expression === "deadpan") {
    // Half-closed horizontal pixel eyelids
    if (iy === 4 && (ix === 1 || ix === 2 || ix === 5 || ix === 6)) return brow;
    if (iy === 3 && (ix === 1 || ix === 5)) return white;
    if (iy === 3 && (ix === 2 || ix === 6)) return pupil;
  } else if (expression === "happy") {
    // Curved happy pixel eyes
    if (iy === 4 && (ix === 1 || ix === 2 || ix === 5 || ix === 6)) return [30, 41, 59];
    if (iy === 3 && (ix === 1 || ix === 6)) return [251, 113, 133]; // blush texel
  } else {
    // Canonical 2x1 Minecraft eye (sclera on outer pixel, pupil on inner pixel)
    if (iy === 4) {
      if (ix === 1 || ix === 6) return white;
      if (ix === 2 || ix === 5) return pupil;
    }
    if (theme === "alex" && iy === 3 && (ix === 1 || ix === 6)) {
      return [244, 142, 152]; // subtle cheek blush texel
    }
  }

  // Nose & Mouth (iy = 1..2)
  if (expression === "shocked" || expression === "panic") {
    if ((iy === 1 || iy === 2) && (ix === 3 || ix === 4)) return [30, 20, 24];
  } else if (expression === "deadpan") {
    if (iy === 1 && (ix === 3 || ix === 4)) return [74, 44, 24];
  } else if (theme === "steve") {
    if (iy === 2 && (ix === 3 || ix === 4)) return [158, 102, 72]; // Steve pixel nose
    if (iy === 1 && (ix === 2 || ix === 3 || ix === 4 || ix === 5)) return [92, 52, 32]; // Steve pixel smile/beard
  } else {
    if (iy === 1 && (ix === 3 || ix === 4)) return [168, 92, 78];
  }

  return null;
}

// ---------- Canonical 16x16x16 Voxel Block & Prop Evaluator ----------
const GRASS_OVERHANG = [3, 4, 2, 3, 5, 3, 2, 4, 3, 2, 4, 5, 3, 2, 3, 4];

const TNT_FONT = {
  T: ["111", "010", "010", "010"],
  N: ["1001", "1101", "1011", "1001"]
};

export function evalMinecraftBlockSDF(pWorld, cfg = {}) {
  const {
    pos = v3(0, 0, 0),
    yaw = 0,
    scale = 1.0,
    type = "grass-block", // "grass-block" | "diamond-ore" | "tnt-block" | "crafting-table" | "chest-hinged"
    cracks = 0, // 0..1 mining crack overlay
    flashWhite = false,
    lidAngle = 0
  } = cfg;

  const p = mul3(rotY(sub3(pWorld, pos), -yaw), 1 / scale);
  const halfB = type === "chest-hinged" ? 0.315 : 0.36; // 14px chest vs 16px block
  const dBound = sdBox(p, v3(halfB + 0.06, halfB + 0.18, halfB + 0.06));
  if (dBound > 0.42) {
    return { d: dBound * scale, color: [100, 100, 100], roughness: 0.5, emissive: 0 };
  }

  if (type === "chest-hinged") {
    // 14x14x10 hollow oak base + 14x4x14 upward-hinged lid + 2x4x1 silver front latch
    const dBaseOuter = sdRoundBox(sub3(p, v3(0, -0.09, 0)), v3(0.315, 0.225, 0.315), 0.004);
    const dHollow = sdBox(sub3(p, v3(0, 0.06, 0)), v3(0.255, 0.12, 0.255));
    const dBase = Math.max(dBaseOuter, -dHollow);

    const pPivot = sub3(p, v3(0, 0.135, -0.315));
    const pLidLocal = sub3(rotX(pPivot, lidAngle), v3(0, 0.09, 0.315));
    const dLid = sdRoundBox(pLidLocal, v3(0.315, 0.09, 0.315), 0.004);
    const pLatch = sub3(pLidLocal, v3(0, -0.065, 0.33));
    const dLatch = sdBox(pLatch, v3(0.045, 0.075, 0.024));

    const dChest = Math.min(dBase, dLid, dLatch);
    if (dLatch <= dBase && dLatch <= dLid) {
      return { d: dChest * scale, color: [236, 242, 248], roughness: 0.14, emissive: 0.08 };
    }
    if (dBase <= dLid && p.y > 0.02 && Math.abs(p.x) < 0.26 && Math.abs(p.z) < 0.26) {
      return { d: dChest * scale, color: [36, 22, 12], roughness: 0.5, emissive: 0 };
    }
    const ux = clamp(Math.floor(((p.x + 0.315) / 0.63) * 14), 0, 13);
    const uy = clamp(Math.floor(((p.y + 0.315) / 0.63) * 14), 0, 13);
    const uz = clamp(Math.floor(((p.z + 0.315) / 0.63) * 14), 0, 13);
    const isBorder =
      ux === 0 || ux === 13 || uz === 0 || uz === 13 || uy === 0 || uy === 13 || uy === 9;
    const baseWood = isBorder ? [68, 40, 18] : [206, 138, 56];
    const n = (texHash(ux, uy, uz) - 0.5) * 18;
    return { d: dChest * scale, color: shadeTexel(baseWood, n), roughness: 0.36, emissive: 0 };
  }

  const dBox = sdRoundBox(p, v3(halfB, halfB, halfB), 0.004);
  if (flashWhite) {
    return { d: dBox * scale, color: [255, 255, 255], roughness: 0.1, emissive: 0.65 };
  }

  const ux = clamp(Math.floor(((p.x + halfB) / (2 * halfB)) * 16), 0, 15);
  const uy = clamp(Math.floor(((p.y + halfB) / (2 * halfB)) * 16), 0, 15);
  const uz = clamp(Math.floor(((p.z + halfB) / (2 * halfB)) * 16), 0, 15);
  const noise = (texHash(ux, uy, uz) - 0.5) * 22;
  const isTop = p.y > halfB - 0.015;

  if (type === "grass-block") {
    const colIdx = Math.abs(p.z) >= Math.abs(p.x) ? ux : uz;
    const overhang = GRASS_OVERHANG[colIdx];
    if (isTop || uy >= 16 - overhang) {
      return {
        d: dBox * scale,
        color: shadeTexel([74, 194, 78], noise),
        roughness: 0.42,
        emissive: 0
      };
    }
    return {
      d: dBox * scale,
      color: shadeTexel([134, 92, 56], noise),
      roughness: 0.48,
      emissive: 0
    };
  }

  if (type === "diamond-ore") {
    // Check if texel on face is part of the glowing cyan diamond ore cluster
    const fx = isTop ? ux : Math.abs(p.z) >= Math.abs(p.x) ? ux : uz;
    const fy = isTop ? uz : uy;
    const isDiamond =
      ((fx === 4 || fx === 5) && (fy === 10 || fy === 11)) ||
      ((fx === 10 || fx === 11) && (fy === 9 || fy === 10)) ||
      ((fx === 6 || fx === 7 || fx === 8) && (fy === 5 || fy === 6)) ||
      ((fx === 11 || fx === 12) && (fy === 3 || fy === 4)) ||
      ((fx === 3 || fx === 4) && (fy === 4 || fy === 5));

    if (cracks > 0) {
      const onCrack =
        Math.abs(fx - fy) <= 1 && fx >= 3 && fx <= 3 + Math.floor(cracks * 10);
      if (onCrack) {
        return { d: dBox * scale, color: [22, 26, 34], roughness: 0.5, emissive: 0 };
      }
    }

    if (isDiamond) {
      const bright = (fx + fy) % 2 === 0 ? [165, 243, 252] : [56, 229, 212];
      return { d: dBox * scale, color: bright, roughness: 0.12, emissive: 0.45 };
    }
    return {
      d: dBox * scale,
      color: shadeTexel([108, 118, 132], noise),
      roughness: 0.44,
      emissive: 0
    };
  }

  if (type === "tnt-block") {
    if (isTop) {
      if (ux >= 6 && ux <= 9 && uz >= 6 && uz <= 9) {
        return { d: dBox * scale, color: [38, 42, 48], roughness: 0.4, emissive: 0 };
      }
      const c = (Math.floor(ux / 4) + Math.floor(uz / 4)) % 2 === 0 ? [225, 45, 45] : [192, 34, 34];
      return { d: dBox * scale, color: shadeTexel(c, noise * 0.6), roughness: 0.35, emissive: 0 };
    }
    if (uy >= 6 && uy <= 10) {
      // White TNT band (5 texels tall: uy = 6..10)
      const fx = Math.abs(p.z) >= Math.abs(p.x) ? ux : uz;
      const row = 9 - uy; // 0..3 inside 4-row font
      if (row >= 0 && row <= 3) {
        if (fx >= 2 && fx <= 4 && TNT_FONT.T[row][fx - 2] === "1") {
          return { d: dBox * scale, color: [20, 24, 32], roughness: 0.3, emissive: 0 };
        }
        if (fx >= 6 && fx <= 9 && TNT_FONT.N[row][fx - 6] === "1") {
          return { d: dBox * scale, color: [20, 24, 32], roughness: 0.3, emissive: 0 };
        }
        if (fx >= 11 && fx <= 13 && TNT_FONT.T[row][fx - 11] === "1") {
          return { d: dBox * scale, color: [20, 24, 32], roughness: 0.3, emissive: 0 };
        }
      }
      return { d: dBox * scale, color: shadeTexel([245, 247, 250], noise * 0.4), roughness: 0.3, emissive: 0 };
    }
    const fx = Math.abs(p.z) >= Math.abs(p.x) ? ux : uz;
    const stripe = Math.floor(fx / 4) % 2 === 0 ? [228, 46, 46] : [196, 32, 32];
    return { d: dBox * scale, color: shadeTexel(stripe, noise * 0.7), roughness: 0.36, emissive: 0 };
  }

  // Default: "crafting-table"
  if (isTop) {
    const inGrid = ux >= 2 && ux <= 13 && uz >= 2 && uz <= 13;
    const isLine = ux === 2 || ux === 6 || ux === 9 || ux === 13 || uz === 2 || uz === 6 || uz === 9 || uz === 13;
    const c = isLine ? [78, 46, 24] : inGrid ? [196, 138, 76] : [142, 92, 46];
    return { d: dBox * scale, color: shadeTexel(c, noise * 0.6), roughness: 0.38, emissive: 0 };
  }
  if (uy >= 12) {
    return { d: dBox * scale, color: shadeTexel([88, 52, 28], noise * 0.6), roughness: 0.4, emissive: 0 };
  }
  const fx = Math.abs(p.z) >= Math.abs(p.x) ? ux : uz;
  const isToolSilhouette = (fx >= 4 && fx <= 6 && uy >= 4 && uy <= 10) || (fx >= 10 && fx <= 12 && uy >= 5 && uy <= 9);
  const sideCol = isToolSilhouette ? [182, 192, 206] : [168, 114, 62];
  return { d: dBox * scale, color: shadeTexel(sideCol, noise * 0.6), roughness: 0.38, emissive: 0 };
}

// ---------- Canonical Quadruped Creeper Mob Evaluator ----------
export function evalCreeperSDF(pWorld, cfg = {}) {
  const {
    pos = v3(0, 0, 0),
    yaw = 0,
    headYaw = 0,
    swell = 1.0,
    flashWhite = false
  } = cfg;

  const p = mul3(rotY(sub3(pWorld, pos), -yaw), 1 / swell);
  const dBound = len3(p) - 1.35;
  if (dBound > 0.45) return { d: dBound * swell, color: [74, 178, 72], roughness: 0.4, emissive: 0 };

  // 8x8x8 Head centered at y = 0.56
  const pHead = rotY(sub3(p, v3(0, 0.56, 0)), -headYaw);
  const dHead = sdRoundBox(pHead, v3(0.18, 0.18, 0.18), 0.004);

  // 8x12x4 Body centered at y = 0.11
  const pBody = sub3(p, v3(0, 0.11, 0));
  const dBody = sdRoundBox(pBody, v3(0.18, 0.27, 0.09), 0.004);

  // Four 4x6x4 short legs at the base (y = -0.29)
  const dLegFL = sdRoundBox(sub3(p, v3(-0.095, -0.29, 0.11)), v3(0.085, 0.135, 0.085), 0.004);
  const dLegFR = sdRoundBox(sub3(p, v3(0.095, -0.29, 0.11)), v3(0.085, 0.135, 0.085), 0.004);
  const dLegBL = sdRoundBox(sub3(p, v3(-0.095, -0.29, -0.11)), v3(0.085, 0.135, 0.085), 0.004);
  const dLegBR = sdRoundBox(sub3(p, v3(0.095, -0.29, -0.11)), v3(0.085, 0.135, 0.085), 0.004);
  const dLegs = Math.min(dLegFL, dLegFR, dLegBL, dLegBR);

  const dMin = Math.min(dHead, dBody, dLegs);
  if (flashWhite) {
    return { d: dMin * swell, color: [255, 255, 255], roughness: 0.12, emissive: 0.65 };
  }

  const gx = Math.floor((p.x + 2.0) / 0.045);
  const gy = Math.floor((p.y + 2.0) / 0.045);
  const gz = Math.floor((p.z + 2.0) / 0.045);
  const n = (texHash(gx, gy, gz) - 0.5) * 34;
  let col = shadeTexel([82, 184, 74], n);

  // Iconic 8x8 black pixel Creeper face on front of head
  if (dHead <= dBody && dHead <= dLegs && pHead.z > 0.165) {
    const ix = clamp(Math.floor(((pHead.x + 0.18) / 0.36) * 8), 0, 7);
    const iy = clamp(Math.floor(((pHead.y + 0.18) / 0.36) * 8), 0, 7);
    const isEye = (iy === 4 || iy === 5) && (ix === 1 || ix === 2 || ix === 5 || ix === 6);
    const isNose = (iy === 2 || iy === 3) && (ix === 3 || ix === 4);
    const isMouthMid = iy === 1 && ix >= 2 && ix <= 5;
    const isMouthEnds = iy === 0 && (ix === 2 || ix === 5);
    if (isEye || isNose || isMouthMid || isMouthEnds) {
      col = [18, 24, 20];
    }
  }

  return { d: dMin * swell, color: col, roughness: 0.4, emissive: 0 };
}

// ---------- Canonical Pink Voxel Axolotl Pet Evaluator ----------
export function evalAxolotlSDF(pWorld, cfg = {}) {
  const { pos = v3(0, 0, 0), yaw = 0 } = cfg;
  const p = rotY(sub3(pWorld, pos), -yaw);
  const dBound = len3(p) - 0.65;
  if (dBound > 0.45) return { d: dBound, color: [249, 168, 212], roughness: 0.35, emissive: 0 };

  const pHead = sub3(p, v3(0, 0.04, 0.14));
  const dHead = sdRoundBox(pHead, v3(0.14, 0.10, 0.11), 0.004);
  const dBody = sdRoundBox(sub3(p, v3(0, 0.0, -0.06)), v3(0.12, 0.08, 0.16), 0.004);
  const dTail = sdRoundBox(sub3(p, v3(0, 0.01, -0.28)), v3(0.02, 0.06, 0.12), 0.003);
  // 3D pixel external gill fronds on left & right of head
  const dGillL = sdBox(sub3(pHead, v3(-0.17, 0.03, -0.02)), v3(0.04, 0.07, 0.015));
  const dGillR = sdBox(sub3(pHead, v3(0.17, 0.03, -0.02)), v3(0.04, 0.07, 0.015));
  const dGills = Math.min(dGillL, dGillR);

  const dMin = Math.min(dHead, dBody, dTail, dGills);
  if (dGills <= dHead && dGills <= dBody) {
    return { d: dMin, color: [236, 72, 153], roughness: 0.3, emissive: 0 };
  }
  let col = [249, 168, 212];
  if (dHead <= dBody && pHead.z > 0.095) {
    if (Math.abs(Math.abs(pHead.x) - 0.075) < 0.022 && Math.abs(pHead.y - 0.015) < 0.022) {
      col = [30, 20, 38];
    }
  }
  return { d: dMin, color: col, roughness: 0.34, emissive: 0 };
}

// ---------- Canonical Minecraft Character SDF Evaluator ----------
export function evalMinecraftAvatarSDF(pWorld, cfg = {}) {
  const {
    pos = v3(0, 0, 0),
    yaw = 0,
    roll = 0,
    waistPitch = 0,
    headYaw = 0,
    headPitch = 0,
    armLPitch = -0.12,
    armRPitch = -0.35,
    legLPitch = 0,
    legRPitch = 0,
    expression = "smile",
    theme = "steve", // "steve" | "alex" | "knight"
    heldItem = "pickaxe", // "pickaxe" | "sword" | "lantern" | "tnt-mini" | "none"
    hurtTint = false,
    driftMode = "none" // "none" | "human-fingers" | "blurry-noodle" | "roblox-lego"
  } = cfg;

  const palettes = {
    steve: {
      skin: [212, 154, 114],
      hair: [78, 44, 24],
      tunic: [6, 182, 212],
      pants: [59, 59, 143],
      shoes: [71, 85, 105],
      slim: false
    },
    alex: {
      skin: [243, 198, 165],
      hair: [194, 88, 36],
      tunic: [94, 140, 66],
      pants: [107, 76, 53],
      shoes: [78, 54, 38],
      slim: true
    },
    knight: {
      skin: [212, 154, 114],
      hair: [56, 229, 212], // Diamond Helmet outer layer
      tunic: [56, 229, 212], // Diamond Chestplate
      pants: [20, 184, 166],
      shoes: [45, 55, 72],
      slim: false
    }
  };

  const pal = palettes[theme] || palettes.steve;
  let p = sub3(pWorld, pos);
  if (roll !== 0) {
    p = add3(rotZ(sub3(p, v3(0, -0.68, 0)), -roll), v3(0, -0.68, 0));
  }
  p = rotY(p, -yaw);

  const dBound = len3(p) - 1.95;
  if (dBound > 0.45) {
    return { d: dBound, color: [0, 0, 0], roughness: 0.4, emissive: 0 };
  }

  let bestD = 1e9;
  let bestCol = pal.tunic;
  let bestRough = 0.36;
  let bestEmissive = 0;

  const addPart = (d, col, rough = 0.36, emissive = 0) => {
    if (d < bestD) {
      bestD = d;
      bestCol = col;
      bestRough = rough;
      bestEmissive = emissive;
    }
  };

  const bevel = driftMode === "none" ? 0.004 : 0.045;
  const texNoiseScale = driftMode === "blurry-noodle" || driftMode === "roblox-lego" ? 0 : 18;

  const pWaist = rotX(sub3(p, v3(0, -0.14, 0)), -waistPitch);
  const pUpper = add3(pWaist, v3(0, -0.14, 0));

  // 1. Canonical 8x12x4 Torso (centered at y = 0.13)
  const pTorso = sub3(pUpper, v3(0, 0.13, 0));
  const dTorso = sdRoundBox(pTorso, v3(0.18, 0.27, 0.09), bevel);
  if (dTorso < bestD) {
    const tx = clamp(Math.floor(((pTorso.x + 0.18) / 0.36) * 8), 0, 7);
    const ty = clamp(Math.floor(((pTorso.y + 0.27) / 0.54) * 12), 0, 11);
    const tz = clamp(Math.floor(((pTorso.z + 0.09) / 0.18) * 4), 0, 3);
    let col = pal.tunic;
    if (pTorso.z > 0.075 && ty >= 10 && (tx === 3 || tx === 4)) {
      col = pal.skin; // V-neck pixel cutout
    } else if (theme === "alex" && ty === 2) {
      col = [102, 64, 36]; // Alex pixel belt
    } else if (theme === "knight" && (tx === 0 || tx === 7 || ty === 11 || ty === 0)) {
      col = [14, 148, 136]; // Diamond chestplate pixel trim
    }
    const n = (texHash(tx, ty, tz) - 0.5) * texNoiseScale;
    addPart(dTorso, shadeTexel(col, n), theme === "knight" ? 0.18 : 0.38);
  }

  // 2. Canonical 8x8x8 Cubic Head (centered at y = 0.58)
  const pHead = rotY(rotX(sub3(pUpper, v3(0, 0.58, 0)), -headPitch), -headYaw);
  let dHead;
  if (driftMode === "roblox-lego") {
    // FAIL mode: Roblox barrel cylinder head + Lego top stud
    dHead = sdRoundedCylinder(pHead, 0.19, 0.065, 0.185);
    const dStud = sdRoundedCylinder(sub3(pHead, v3(0, 0.22, 0)), 0.10, 0.012, 0.05);
    if (dStud < bestD) addPart(dStud, [250, 204, 21], 0.18);
  } else {
    dHead = sdRoundBox(pHead, v3(0.18, 0.18, 0.18), bevel);
  }

  if (dHead < bestD) {
    const ix = clamp(Math.floor(((pHead.x + 0.18) / 0.36) * 8), 0, 7);
    const iy = clamp(Math.floor(((pHead.y + 0.18) / 0.36) * 8), 0, 7);
    const iz = clamp(Math.floor(((pHead.z + 0.18) / 0.36) * 8), 0, 7);
    const n = (texHash(ix, iy, iz) - 0.5) * (texNoiseScale * 0.65);
    let hCol = shadeTexel(driftMode === "roblox-lego" ? [245, 205, 48] : pal.skin, n);
    if (pHead.z > 0.165) {
      const fCol = evalMinecraftFace8x8(ix, iy, expression, theme);
      if (fCol) hCol = fCol;
    } else if (iy >= 6 || pHead.z < -0.15) {
      hCol = shadeTexel(pal.hair, n);
    }
    addPart(dHead, hCol, 0.34);
  }

  // FAIL mode 1: 3D protruding human nose
  if (driftMode === "human-fingers") {
    const dNose = sdRoundBox(sub3(pHead, v3(0, -0.01, 0.21)), v3(0.038, 0.055, 0.065), 0.022);
    addPart(dNose, [232, 158, 122], 0.35);
  }

  // 3. Raised +0.5px 3D Outer Skin Layer (Stepped Pixel Bangs / Ponytail / Diamond Helmet)
  if (driftMode === "none") {
    const dTopShell = sdBox(sub3(pHead, v3(0, 0.155, -0.01)), v3(0.198, 0.052, 0.198));
    const dBackShell = sdBox(sub3(pHead, v3(0, 0.03, -0.165)), v3(0.198, 0.16, 0.042));
    const dSideL = sdBox(sub3(pHead, v3(-0.175, 0.05, 0.01)), v3(0.026, 0.14, 0.16));
    const dSideR = sdBox(sub3(pHead, v3(0.175, 0.05, 0.01)), v3(0.026, 0.14, 0.16));
    // Stepped 3D pixel bangs across forehead
    const dBang1 = sdBox(sub3(pHead, v3(-0.09, 0.125, 0.182)), v3(0.088, 0.048, 0.022));
    const dBang2 = sdBox(sub3(pHead, v3(0.09, 0.142, 0.182)), v3(0.088, 0.032, 0.022));
    let dHair3D = Math.min(dTopShell, dBackShell, dSideL, dSideR, dBang1, dBang2);

    if (theme === "alex") {
      // Alex 3D pixel side ponytail + beret top
      const dPony = sdBox(sub3(pHead, v3(-0.185, -0.06, 0.12)), v3(0.048, 0.11, 0.048));
      dHair3D = Math.min(dHair3D, dPony);
    }

    if (dHair3D < bestD) {
      const hx = Math.floor((pHead.x + 1.0) / 0.045);
      const hy = Math.floor((pHead.y + 1.0) / 0.045);
      const hz = Math.floor((pHead.z + 1.0) / 0.045);
      const n = (texHash(hx, hy, hz) - 0.5) * 18;
      addPart(dHair3D, shadeTexel(pal.hair, n), theme === "knight" ? 0.16 : 0.38);
    }
  }

  // 4. Canonical 4x12x4 (Steve) or 3x12x4 (Alex) Left & Right Arms
  const armHalfW = pal.slim ? 0.072 : 0.09;
  const shoulderX = 0.18 + armHalfW + 0.002;

  for (const side of [-1, 1]) {
    const pitch = side < 0 ? armLPitch : armRPitch;
    const pShoulder = sub3(pUpper, v3(side * shoulderX, 0.36, 0));
    let pArm = rotX(pShoulder, -pitch);
    if (driftMode === "blurry-noodle") {
      // Rubbery noodle curve
      pArm = v3(pArm.x + Math.sin(pArm.y * 7.0) * 0.07 * side, pArm.y, pArm.z);
    }
    const pArmBox = sub3(pArm, v3(0, -0.23, 0));
    const dArm = sdRoundBox(pArmBox, v3(armHalfW, 0.27, 0.09), bevel);
    if (dArm < bestD) {
      const ay = clamp(Math.floor(((pArmBox.y + 0.27) / 0.54) * 12), 0, 11);
      const ax = clamp(Math.floor(((pArmBox.x + armHalfW) / (2 * armHalfW)) * 4), 0, 3);
      const n = (texHash(ax, ay, side) - 0.5) * texNoiseScale;
      const baseC = ay >= 7 ? pal.tunic : pal.skin;
      addPart(dArm, shadeTexel(baseC, n), 0.36);
    }

    // Drift failure hand modes
    const pHandEnd = sub3(pArm, v3(0, -0.52, 0));
    if (driftMode === "human-fingers") {
      for (let f = -2; f <= 2; f++) {
        const pf = sub3(pHandEnd, v3(f * 0.032, -0.055, 0));
        addPart(sdRoundBox(pf, v3(0.011, 0.055, 0.012), 0.005), pal.skin, 0.35);
      }
    } else if (driftMode === "roblox-lego") {
      addPart(sdLegoCClaw(sub3(pArm, v3(0, -0.54, 0)), 0.85), [245, 205, 48], 0.2);
    } else if (driftMode === "blurry-noodle" && side === 1) {
      // Smooth non-voxel round metal rod tool extending forward from right hand
      const pSmoothRod = rotX(sub3(pArm, v3(0, -0.44, 0.20)), -1.15);
      addPart(sdRoundedCylinder(pSmoothRod, 0.032, 0.015, 0.28), [186, 200, 218], 0.12);
    }

    // Authentic Extruded 16x16x1 Held Voxel Items (attached to Right Flat 4x4 Square Hand, extending forward +Z)
    if (driftMode === "none" && side === 1 && heldItem !== "none") {
      if (heldItem === "pickaxe" || heldItem === "sword") {
        const qGrip = sub3(pArm, v3(0.0, -0.34, 0.26));
        const pTool = rotY(rotX(qGrip, -0.15), Math.PI / 2);
        const sprite = heldItem === "sword" ? SWORD_SPRITE_16 : PICKAXE_SPRITE_16;
        const sp = evalVoxelSprite16x16(pTool, sprite, 0.026, 0.018);
        addPart(sp.d, sp.color, sp.roughness, 0.15);
      } else if (heldItem === "lantern") {
        const pLan = sub3(pArm, v3(0, -0.46, 0.18));
        const dCap = sdBox(sub3(pLan, v3(0, 0.09, 0)), v3(0.06, 0.02, 0.06));
        const dCore = sdBox(pLan, v3(0.08, 0.08, 0.08));
        addPart(dCap, [51, 65, 85], 0.25, 0);
        addPart(dCore, [251, 191, 36], 0.1, 0.85);
      } else if (heldItem === "tnt-mini") {
        const tnt = evalMinecraftBlockSDF(pArm, {
          pos: v3(-0.14, -0.42, 0.22),
          scale: 0.48,
          type: "tnt-block"
        });
        addPart(tnt.d, tnt.color, tnt.roughness, tnt.emissive);
      }
    }
  }

  // 5. Canonical 4x12x4 Flush Left & Right Legs
  for (const side of [-1, 1]) {
    const pitch = side < 0 ? legLPitch : legRPitch;
    const pHip = sub3(p, v3(side * 0.091, -0.14, 0));
    const pLeg = sub3(rotX(pHip, pitch), v3(0, -0.27, 0));
    const dLeg = sdRoundBox(pLeg, v3(0.089, 0.27, 0.09), bevel);
    if (dLeg < bestD) {
      const ly = clamp(Math.floor(((pLeg.y + 0.27) / 0.54) * 12), 0, 11);
      const lx = clamp(Math.floor(((pLeg.x + 0.09) / 0.18) * 4), 0, 3);
      const n = (texHash(lx, ly, side + 5) - 0.5) * texNoiseScale;
      const baseC = ly <= 1 ? pal.shoes : pal.pants;
      addPart(dLeg, shadeTexel(baseC, n), 0.4);
    }
  }

  if (hurtTint) {
    bestCol = [
      clamp(bestCol[0] * 0.45 + 245 * 0.55, 0, 255),
      clamp(bestCol[1] * 0.25 + 40 * 0.75, 0, 255),
      clamp(bestCol[2] * 0.25 + 40 * 0.75, 0, 255)
    ];
  }

  return { d: bestD, color: bestCol, roughness: bestRough, emissive: bestEmissive };
}

// ---------- Raymarcher & Minecraft BSL / Voxel Floor Shader ----------
export function render3DViewport(width, height, sceneFn, camCfg = {}) {
  const buf = new Uint8Array(width * height * 4);
  const ro = camCfg.ro || v3(0, 0.35, 2.65);
  const ta = camCfg.ta || v3(0, 0.08, 0);
  const fov = camCfg.fov || 1.92;
  const bgTop = camCfg.bgTop || [125, 211, 252];
  const bgBot = camCfg.bgBot || [224, 242, 254];
  const floorY = camCfg.floorY ?? -0.68;
  const floorType = camCfg.floorType || "grass"; // "grass" | "stone" | "oak"
  const warmLight = camCfg.warmLight ?? 0.0;

  const fw = norm3(sub3(ta, ro));
  const rt = norm3(cross3(fw, v3(0, 1, 0)));
  const up = cross3(rt, fw);

  const keyLight = norm3(v3(0.58, 0.82, 0.64));
  const fillLight = norm3(v3(-0.65, 0.35, 0.45));
  const rimLight = norm3(v3(-0.55, 0.52, -0.65));

  const calcNormal = (p, centerDist) => {
    const e = 0.0025;
    const d0 = centerDist ?? sceneFn(p).d;
    const dx = sceneFn(v3(p.x + e, p.y, p.z)).d - d0;
    const dy = sceneFn(v3(p.x, p.y + e, p.z)).d - d0;
    const dz = sceneFn(v3(p.x, p.y, p.z + e)).d - d0;
    return norm3(v3(dx, dy, dz));
  };

  const calcSoftShadow = (orig, dir) => {
    const h1 = sceneFn(add3(orig, mul3(dir, 0.09))).d;
    const h2 = sceneFn(add3(orig, mul3(dir, 0.24))).d;
    return clamp(0.52 + 0.48 * Math.min(h1 * 8.5, h2 * 4.5), 0.52, 1.0);
  };

  for (let py = 0; py < height; py++) {
    const ny = 1 - (2 * (py + 0.5)) / height;
    const vGrad = py / height;
    for (let px = 0; px < width; px++) {
      const nx = ((2 * (px + 0.5)) / width - 1) * (width / height);
      const rd = norm3(add3(add3(mul3(rt, nx), mul3(up, ny)), mul3(fw, fov)));

      let r = mix(bgTop[0], bgBot[0], vGrad);
      let g = mix(bgTop[1], bgBot[1], vGrad);
      let b = mix(bgTop[2], bgBot[2], vGrad);

      const ocx = ro.x;
      const ocy = ro.y - 0.05;
      const ocz = ro.z;
      const bSphere = ocx * rd.x + ocy * rd.y + ocz * rd.z;
      const cSphere = ocx * ocx + ocy * ocy + ocz * ocz - 2.35 * 2.35;
      const disc = bSphere * bSphere - cSphere;

      let t = disc > 0 ? Math.max(0.18, -bSphere - Math.sqrt(disc)) : 99.0;
      const tMax = disc > 0 ? Math.min(7.5, -bSphere + Math.sqrt(disc)) : 0.0;
      let hit = null;
      if (disc > 0 && tMax > 0.18) {
        for (let step = 0; step < 36; step++) {
          if (t > tMax) break;
          const pos = add3(ro, mul3(rd, t));
          const res = sceneFn(pos);
          if (res.d < 0.0028) {
            hit = { pos, res, t };
            break;
          }
          t += res.d;
        }
      }

      if (hit) {
        const N = calcNormal(hit.pos, hit.res.d);
        const V = mul3(rd, -1);
        const sh = dot3(N, keyLight) > 0 ? calcSoftShadow(add3(hit.pos, mul3(N, 0.012)), keyLight) : 0.52;
        // Authentic Minecraft directional block-face lighting (Top 1.0, Z 0.84, X 0.70) + BSL sun
        const mcFaceFactor = 0.74 + 0.18 * Math.abs(N.y) + 0.08 * Math.abs(N.z);
        const keyDiff = Math.max(0, dot3(N, keyLight)) * sh;
        const fillDiff = Math.max(0, dot3(N, fillLight)) * 0.25;
        const skyAmb = 0.38 + 0.14 * (0.5 + 0.5 * N.y);
        const aoSample = sceneFn(add3(hit.pos, mul3(N, 0.055))).d / 0.055;
        const ao = clamp(0.68 + 0.32 * aoSample, 0.62, 1.0);

        const emissive = hit.res.emissive || 0;
        const lighting = clamp((skyAmb + keyDiff * 0.58 + fillDiff) * mcFaceFactor * ao + emissive, 0, 1.45);

        const H = norm3(add3(keyLight, V));
        const rough = hit.res.roughness ?? 0.35;
        const specPow = rough < 0.22 ? 36 : 16;
        const specStrength = (rough < 0.22 ? 0.34 : 0.12) * sh;
        const spec = Math.pow(Math.max(0, dot3(N, H)), specPow) * specStrength;

        const fresnel = Math.pow(1 - Math.max(0, dot3(N, V)), 3.0);
        const rim = fresnel * Math.max(0, dot3(N, rimLight)) * 0.22;

        const base = hit.res.color;
        r = clamp(base[0] * lighting + 255 * spec + 245 * rim + warmLight * 28, 0, 255);
        g = clamp(base[1] * lighting + 250 * spec + 245 * rim + warmLight * 16, 0, 255);
        b = clamp(base[2] * lighting + 240 * spec + 255 * rim, 0, 255);
      } else if (rd.y < -0.001 && floorY !== null) {
        const tf = (floorY - ro.y) / rd.y;
        if (tf > 0 && tf < 12.0) {
          const fp = add3(ro, mul3(rd, tf));
          // Authentic 16x16 nearest-neighbor voxel block floor grid (1 block = 0.72 units, 1 texel = 0.045 units)
          const blockSize = 0.72;
          const bx = Math.floor(fp.x / blockSize);
          const bz = Math.floor(fp.z / blockSize);
          const ux = clamp(Math.floor(((fp.x / blockSize - bx) + 1) % 1 * 16), 0, 15);
          const uz = clamp(Math.floor(((fp.z / blockSize - bz) + 1) % 1 * 16), 0, 15);
          const n = (texHash(ux + bx * 16, uz + bz * 16, 99) - 0.5) * 20;

          let baseFloor = [92, 188, 84];
          if (floorType === "stone") {
            const isMortar = ux === 0 || uz === 0 || (uz === 8 && ux < 8) || (ux === 8 && uz >= 8);
            baseFloor = isMortar ? [71, 85, 105] : [118, 128, 144];
          } else if (floorType === "oak") {
            const isPlankSeam = uz % 4 === 0 || (ux === 7 && uz % 8 < 4) || (ux === 14 && uz % 8 >= 4);
            baseFloor = isPlankSeam ? [128, 86, 46] : [172, 122, 68];
          } else {
            // Grass block top grid with subtle 16x16 block border
            const isBlockEdge = ux === 0 || uz === 0;
            baseFloor = isBlockEdge ? [72, 168, 68] : [88, 192, 82];
          }

          const tileCol = shadeTexel(baseFloor, n);
          const floorShadow =
            Math.abs(fp.x) < 1.35 && Math.abs(fp.z) < 1.35
              ? calcSoftShadow(v3(fp.x, floorY + 0.02, fp.z), keyLight)
              : 1.0;
          const fade = Math.exp(-0.07 * tf * tf);
          r = mix(r, clamp(tileCol[0] * floorShadow + warmLight * 24, 0, 255), fade);
          g = mix(g, clamp(tileCol[1] * floorShadow + warmLight * 14, 0, 255), fade);
          b = mix(b, clamp(tileCol[2] * floorShadow, 0, 255), fade);
        }
      }

      const idx = (py * width + px) * 4;
      buf[idx] = r;
      buf[idx + 1] = g;
      buf[idx + 2] = b;
      buf[idx + 3] = 255;
    }
  }
  return buf;
}

// ---------- Pure Node PNG Encoder ----------
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export function encodePNG(width, height, rgba) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, rowStart + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 6 });
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

// ---------- Scene Builders for the 3 Short-Video Cases ----------

function evalCaveTorchSDF(pWorld, pos) {
  const p = sub3(pWorld, pos);
  const dBound = len3(p) - 0.45;
  if (dBound > 0.35) return { d: dBound, color: [146, 94, 44], roughness: 0.4, emissive: 0 };
  const dStick = sdBox(sub3(p, v3(0, -0.06, 0)), v3(0.032, 0.16, 0.032));
  const dFlame = sdBox(sub3(p, v3(0, 0.14, 0)), v3(0.042, 0.042, 0.042));
  if (dFlame < dStick) {
    return { d: dFlame, color: [253, 224, 71], roughness: 0.08, emissive: 0.95 };
  }
  return { d: dStick, color: [146, 94, 44], roughness: 0.42, emissive: 0 };
}

// Case 01: Diamond Cave Creeper Ambush
export function buildDiamondCreeperScene(shotIndex, phase = 0.5) {
  const caveBgTop = [24, 34, 52];
  const caveBgBot = [45, 58, 82];

  if (shotIndex === 0) {
    // Shot 1: Steve swinging stepped 16x16x1 Diamond Pickaxe forward into glowing 16x16x16 Diamond Ore
    const swing = mix(-1.25, -0.58, Math.sin(phase * Math.PI));
    return {
      cam: {
        ro: v3(0.18, 0.34, 2.58 - phase * 0.12),
        ta: v3(0.02, 0.06, 0),
        fov: 1.92,
        bgTop: caveBgTop,
        bgBot: caveBgBot,
        floorY: -0.68,
        floorType: "stone",
        warmLight: 0.25
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.34, 0, -0.02),
          yaw: 0.48,
          armRPitch: swing,
          armLPitch: -0.18,
          expression: "smile",
          theme: "steve",
          heldItem: "pickaxe"
        });
        const ore = evalMinecraftBlockSDF(p, {
          pos: v3(0.36, -0.32, 0.12),
          yaw: -0.28,
          scale: 0.92,
          type: "diamond-ore",
          cracks: phase
        });
        const torch = evalCaveTorchSDF(p, v3(0.02, 0.48, -0.52));
        let best = av.d < ore.d ? av : ore;
        if (torch.d < best.d) best = torch;
        return best;
      }
    };
  }

  if (shotIndex === 1) {
    // Shot 2: Ore shatters into floating diamond drop, revealing green Creeper right behind it!
    const bob = Math.sin(phase * Math.PI * 2) * 0.05;
    return {
      cam: {
        ro: v3(0.0, 0.32, 2.68),
        ta: v3(0.0, 0.08, 0),
        fov: 1.92,
        bgTop: caveBgTop,
        bgBot: caveBgBot,
        floorY: -0.68,
        floorType: "stone",
        warmLight: 0.22
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.38, 0, 0.04),
          yaw: 0.36,
          armRPitch: -0.55,
          expression: "shocked",
          theme: "steve",
          heldItem: "pickaxe"
        });
        const creeper = evalCreeperSDF(p, {
          pos: v3(0.36, -0.25, -0.04),
          yaw: -0.35
        });
        const torch = evalCaveTorchSDF(p, v3(-0.02, 0.52, -0.55));
        const pDrop = rotY(sub3(p, v3(0.0, -0.18 + bob, 0.28)), phase * Math.PI * 2);
        const dDrop = sdBox(pDrop, v3(0.075, 0.075, 0.028));
        let best = av.d < creeper.d ? av : creeper;
        if (torch.d < best.d) best = torch;
        if (dDrop < best.d) {
          best = { d: dDrop, color: [74, 237, 217], roughness: 0.1, emissive: 0.55 };
        }
        return best;
      }
    };
  }

  if (shotIndex === 2) {
    // Shot 3: Creeper flashes white and swells in boxy scale; Steve raises both 4x12x4 arms in panic
    const isFlash = Math.sin(phase * Math.PI * 5) > 0;
    const swell = 1.0 + 0.14 * phase;
    return {
      cam: {
        ro: v3(0.0, 0.30, 2.75),
        ta: v3(0.0, 0.10, 0),
        fov: 1.92,
        bgTop: [45, 58, 78],
        bgBot: [71, 85, 105],
        floorY: -0.68,
        floorType: "stone"
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.36, 0, 0.05),
          yaw: 0.25,
          armLPitch: -2.25,
          armRPitch: -2.25,
          expression: "panic",
          theme: "steve",
          heldItem: "none"
        });
        const creeper = evalCreeperSDF(p, {
          pos: v3(0.34, -0.25, 0.04),
          yaw: -0.28,
          swell,
          flashWhite: isFlash
        });
        return av.d < creeper.d ? av : creeper;
      }
    };
  }

  // Shot 4: Cubic white explosion smoke blocks + Steve in red-tinted Minecraft hurt knockback + dropped pickaxe
  const spread = mix(0.14, 0.38, phase);
  return {
    cam: {
      ro: v3(0.0, 0.42, 2.78),
      ta: v3(0.0, 0.04, 0),
      fov: 1.92,
      bgTop: caveBgTop,
      bgBot: caveBgBot,
      floorY: -0.68,
      floorType: "stone",
      warmLight: 0.2
    },
    sceneFn: (p) => {
      const av = evalMinecraftAvatarSDF(p, {
        pos: v3(-0.42, -0.04, 0.04),
        yaw: 0.18,
        roll: -0.62,
        armLPitch: -1.45,
        armRPitch: -1.15,
        expression: "panic",
        theme: "steve",
        heldItem: "none",
        hurtTint: true
      });
      const pDroppedPick = rotY(rotZ(sub3(p, v3(-0.02, -0.44, 0.28)), 0.45), phase * Math.PI * 2);
      const pick = evalVoxelSprite16x16(pDroppedPick, PICKAXE_SPRITE_16, 0.024, 0.016);
      const dSmoke1 = sdBox(sub3(p, v3(0.36 + spread * 0.25, 0.18 + spread * 0.2, 0)), v3(0.13, 0.13, 0.13));
      const dSmoke2 = sdBox(sub3(p, v3(0.22 - spread * 0.12, 0.34 + spread * 0.15, -0.10)), v3(0.10, 0.10, 0.10));
      const dSmoke3 = sdBox(sub3(p, v3(0.44, -0.10 + spread * 0.15, 0.14)), v3(0.11, 0.11, 0.11));
      const dSmoke = Math.min(dSmoke1, dSmoke2, dSmoke3);
      let best = av;
      if (pick.d < best.d) best = { ...pick, emissive: 0.18 };
      if (dSmoke < best.d) best = { d: dSmoke, color: [241, 245, 249], roughness: 0.3, emissive: 0.25 };
      return best;
    }
  };
}

// Case 02: Cozy Isometric Voxel Cabin & Lantern Build
export function buildCozyLanternScene(shotIndex, phase = 0.5) {
  const skyTop = shotIndex >= 2 ? [49, 46, 129] : [125, 211, 252];
  const skyBot = shotIndex >= 2 ? [253, 186, 116] : [240, 249, 255];
  const warm = shotIndex >= 2 ? 0.65 : 0.0;

  if (shotIndex === 0) {
    // Shot 1: Alex snapping a 16x16x16 Crafting Table onto the oak/grass diorama
    const dropY = mix(0.08, -0.32, smoothstep(0, 0.65, phase));
    return {
      cam: {
        ro: v3(0.55, 0.52, 2.58),
        ta: v3(0.0, 0.04, 0),
        fov: 1.92,
        bgTop: skyTop,
        bgBot: skyBot,
        floorY: -0.68,
        floorType: "grass"
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.34, 0, -0.04),
          yaw: 0.45,
          armLPitch: -0.75,
          armRPitch: -0.85,
          expression: "smile",
          theme: "alex",
          heldItem: "none"
        });
        const table = evalMinecraftBlockSDF(p, {
          pos: v3(0.32, dropY, 0.10),
          yaw: -0.28,
          scale: 0.92,
          type: "crafting-table"
        });
        return av.d < table.d ? av : table;
      }
    };
  }

  if (shotIndex === 1) {
    // Shot 2: Placing and opening a 14x14x14 hinged Chest with 3D silver pixel latch
    const lidOpen = mix(0.05, 0.58, smoothstep(0.15, 0.85, phase));
    return {
      cam: {
        ro: v3(-0.38, 0.46, 2.52),
        ta: v3(0.02, 0.04, 0.04),
        fov: 1.92,
        bgTop: skyTop,
        bgBot: skyBot,
        floorY: -0.68,
        floorType: "oak"
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.36, 0, -0.06),
          yaw: 0.48,
          armRPitch: -0.72,
          expression: "smile",
          theme: "alex",
          heldItem: "none"
        });
        const chest = evalMinecraftBlockSDF(p, {
          pos: v3(0.32, -0.36, 0.12),
          yaw: -0.32,
          scale: 0.94,
          type: "chest-hinged",
          lidAngle: lidOpen
        });
        return av.d < chest.d ? av : chest;
      }
    };
  }

  if (shotIndex === 2) {
    // Shot 3: Raising a glowing warm Voxel Lantern under BSL twilight shader
    return {
      cam: {
        ro: v3(0.20, 0.36, 2.52),
        ta: v3(0, 0.10, 0),
        fov: 1.94,
        bgTop: skyTop,
        bgBot: skyBot,
        floorY: -0.68,
        floorType: "oak",
        warmLight: warm
      },
      sceneFn: (p) => {
        const av = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.26, 0, 0),
          yaw: 0.32,
          armRPitch: -1.15,
          expression: "happy",
          theme: "alex",
          heldItem: "lantern"
        });
        const table = evalMinecraftBlockSDF(p, {
          pos: v3(0.38, -0.32, -0.04),
          yaw: -0.25,
          scale: 0.9,
          type: "crafting-table"
        });
        return av.d < table.d ? av : table;
      }
    };
  }

  // Shot 4: Cozy grass block diorama with Pink Voxel Axolotl & floating red pixel heart
  const heartY = mix(0.22, 0.42, phase);
  return {
    cam: {
      ro: v3(0.42, 0.45, 2.58),
      ta: v3(0, 0.04, 0),
      fov: 1.92,
      bgTop: skyTop,
      bgBot: skyBot,
      floorY: -0.68,
      floorType: "grass",
      warmLight: warm
    },
    sceneFn: (p) => {
      const av = evalMinecraftAvatarSDF(p, {
        pos: v3(-0.32, 0, -0.04),
        yaw: 0.35,
        armRPitch: -0.62,
        expression: "happy",
        theme: "alex",
        heldItem: "lantern"
      });
      const axo = evalAxolotlSDF(p, {
        pos: v3(0.32, -0.54, 0.16),
        yaw: -0.45
      });
      const dHeart = sdBox(sub3(p, v3(0.32, -0.18 + heartY * 0.4, 0.16)), v3(0.055, 0.055, 0.02));
      let best = av.d < axo.d ? av : axo;
      if (dHeart < best.d) {
        best = { d: dHeart, color: [244, 63, 94], roughness: 0.15, emissive: 0.45 };
      }
      return best;
    }
  };
}

// Case 03: Pro Diamond Builder vs. Noob TNT Prank
export function buildProVsNoobTntScene(shotIndex, phase = 0.5) {
  const bgTop = [165, 180, 252];
  const bgBot = [238, 242, 255];

  if (shotIndex === 0) {
    // Shot 1: Left Diamond Knight with Diamond Sword vs Right Steve Noob holding mini TNT
    return {
      cam: {
        ro: v3(0, 0.30, 2.82),
        ta: v3(0, 0.06, 0),
        fov: 1.92,
        bgTop,
        bgBot,
        floorY: -0.68,
        floorType: "stone"
      },
      sceneFn: (p) => {
        const pro = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.38, 0, 0),
          yaw: 0.25,
          armRPitch: -0.68,
          expression: "smile",
          theme: "knight",
          heldItem: "sword"
        });
        const noob = evalMinecraftAvatarSDF(p, {
          pos: v3(0.38, 0, 0),
          yaw: -0.25,
          armLPitch: -0.75,
          armRPitch: -0.75,
          expression: "smile",
          theme: "steve",
          heldItem: "tnt-mini"
        });
        return pro.d < noob.d ? pro : noob;
      }
    };
  }

  if (shotIndex === 1) {
    // Shot 2: Noob slams a full 16x16x16 TNT Block right onto the floor between them
    return {
      cam: {
        ro: v3(0.08, 0.36, 2.85),
        ta: v3(0, 0.0, 0.08),
        fov: 1.92,
        bgTop,
        bgBot,
        floorY: -0.68,
        floorType: "stone"
      },
      sceneFn: (p) => {
        const pro = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.44, 0, -0.08),
          yaw: 0.35,
          armRPitch: -0.55,
          expression: "shocked",
          theme: "knight",
          heldItem: "sword"
        });
        const noob = evalMinecraftAvatarSDF(p, {
          pos: v3(0.44, 0, -0.08),
          yaw: -0.35,
          armLPitch: -0.85,
          armRPitch: -0.85,
          expression: "smile",
          theme: "steve",
          heldItem: "none"
        });
        const tnt = evalMinecraftBlockSDF(p, {
          pos: v3(0, -0.34, 0.24),
          yaw: 0.18,
          scale: 0.82,
          type: "tnt-block"
        });
        let best = pro.d < noob.d ? pro : noob;
        if (tnt.d < best.d) best = tnt;
        return best;
      }
    };
  }

  if (shotIndex === 2) {
    // Shot 3: Primed TNT flashes bright white and swells while both lean back in panic
    const isFlash = Math.sin(phase * Math.PI * 5) > 0;
    const swell = 0.84 + 0.15 * phase;
    return {
      cam: {
        ro: v3(0, 0.34, 2.88),
        ta: v3(0, 0.04, 0.08),
        fov: 1.92,
        bgTop: [254, 202, 202],
        bgBot: [254, 242, 242],
        floorY: -0.68,
        floorType: "stone"
      },
      sceneFn: (p) => {
        const pro = evalMinecraftAvatarSDF(p, {
          pos: v3(-0.45, 0, -0.10),
          yaw: 0.3,
          waistPitch: -0.18,
          armLPitch: -2.15,
          armRPitch: -2.15,
          expression: "panic",
          theme: "knight",
          heldItem: "none"
        });
        const noob = evalMinecraftAvatarSDF(p, {
          pos: v3(0.45, 0, -0.10),
          yaw: -0.3,
          waistPitch: -0.18,
          armLPitch: -2.15,
          armRPitch: -2.15,
          expression: "panic",
          theme: "steve",
          heldItem: "none"
        });
        const tnt = evalMinecraftBlockSDF(p, {
          pos: v3(0, -0.30, 0.24),
          yaw: 0.18,
          scale: swell,
          type: "tnt-block",
          flashWhite: isFlash
        });
        let best = pro.d < noob.d ? pro : noob;
        if (tnt.d < best.d) best = tnt;
        return best;
      }
    };
  }

  // Shot 4: Both stare deadpan (-_-) at the camera amidst cubic white explosion smoke
  return {
    cam: {
      ro: v3(0, 0.28, 2.80),
      ta: v3(0, 0.06, 0),
      fov: 1.92,
      bgTop: [148, 163, 184],
      bgBot: [226, 232, 240],
      floorY: -0.68,
      floorType: "stone"
    },
    sceneFn: (p) => {
      const pro = evalMinecraftAvatarSDF(p, {
        pos: v3(-0.38, 0, 0),
        yaw: 0.15,
        headYaw: -0.15,
        armLPitch: 0,
        armRPitch: 0,
        expression: "deadpan",
        theme: "knight",
        heldItem: "none"
      });
      const noob = evalMinecraftAvatarSDF(p, {
        pos: v3(0.38, 0, 0),
        yaw: -0.15,
        headYaw: 0.15,
        armLPitch: 0,
        armRPitch: 0,
        expression: "deadpan",
        theme: "steve",
        heldItem: "none"
      });
      const dSmoke = Math.min(
        sdBox(sub3(p, v3(0, -0.42, 0.22)), v3(0.13, 0.11, 0.13)),
        sdBox(sub3(p, v3(-0.18, -0.48, 0.28)), v3(0.09, 0.08, 0.09))
      );
      let best = pro.d < noob.d ? pro : noob;
      if (dSmoke < best.d) {
        best = { d: dSmoke, color: [241, 245, 249], roughness: 0.35, emissive: 0.1 };
      }
      return best;
    }
  };
}

export function buildRenderTasks() {
  const studioCam = {
    ro: v3(0, 0.20, 2.48),
    ta: v3(0, 0.05, 0),
    fov: 1.94,
    bgTop: [186, 230, 253],
    bgBot: [240, 249, 255],
    floorY: -0.68,
    floorType: "grass"
  };

  const objCam = {
    ro: v3(0, 0.36, 2.22),
    ta: v3(0, -0.12, 0),
    fov: 1.95,
    bgTop: [186, 230, 253],
    bgBot: [241, 245, 249],
    floorY: -0.68,
    floorType: "stone"
  };

  const tasks = [];

  // 1. 3-View Turnaround
  for (const [fname, yaw] of [
    ["turn_front.png", 0.0],
    ["turn_3q.png", 0.68],
    ["turn_side.png", 1.52]
  ]) {
    tasks.push({
      name: fname,
      w: 420,
      h: 520,
      run: () =>
        render3DViewport(
          420,
          520,
          (p) =>
            evalMinecraftAvatarSDF(p, {
              yaw,
              armRPitch: -0.68,
              theme: "steve",
              expression: "smile",
              heldItem: "pickaxe"
            }),
          studioCam
        )
    });
  }

  // 2. 4-Panel Voxel Blocks, Extruded Tools & Mobs Showcase
  tasks.push({
    name: "obj_1_ore_grass.png",
    w: 320,
    h: 420,
    run: () =>
      render3DViewport(
        320,
        420,
        (p) => {
          const b1 = evalMinecraftBlockSDF(p, { pos: v3(-0.36, -0.32, -0.04), yaw: 0.52, scale: 0.82, type: "grass-block" });
          const b2 = evalMinecraftBlockSDF(p, { pos: v3(0.36, -0.32, 0.08), yaw: -0.45, scale: 0.84, type: "diamond-ore" });
          return b1.d < b2.d ? b1 : b2;
        },
        objCam
      )
  });

  tasks.push({
    name: "obj_2_tnt_chest.png",
    w: 320,
    h: 420,
    run: () =>
      render3DViewport(
        320,
        420,
        (p) => {
          const b1 = evalMinecraftBlockSDF(p, { pos: v3(-0.37, -0.32, 0.04), yaw: 0.45, scale: 0.82, type: "tnt-block" });
          const b2 = evalMinecraftBlockSDF(p, {
            pos: v3(0.37, -0.36, 0.06),
            yaw: -0.42,
            scale: 0.88,
            type: "chest-hinged",
            lidAngle: 0.52
          });
          return b1.d < b2.d ? b1 : b2;
        },
        objCam
      )
  });

  tasks.push({
    name: "obj_3_extruded_tools.png",
    w: 320,
    h: 420,
    run: () =>
      render3DViewport(
        320,
        420,
        (p) => {
          const pPick = rotY(rotZ(sub3(p, v3(-0.28, -0.02, 0.08)), 0.15), 0.32);
          const pick = evalVoxelSprite16x16(pPick, PICKAXE_SPRITE_16, 0.036, 0.025);
          const pSword = rotY(rotZ(sub3(p, v3(0.30, -0.02, 0.08)), -0.15), -0.32);
          const sword = evalVoxelSprite16x16(pSword, SWORD_SPRITE_16, 0.036, 0.025);
          return pick.d < sword.d ? { ...pick, emissive: 0.15 } : { ...sword, emissive: 0.15 };
        },
        objCam
      )
  });

  tasks.push({
    name: "obj_4_creeper_axolotl.png",
    w: 320,
    h: 420,
    run: () =>
      render3DViewport(
        320,
        420,
        (p) => {
          const cr = evalCreeperSDF(p, { pos: v3(-0.24, -0.25, 0), yaw: 0.38 });
          const ax = evalAxolotlSDF(p, { pos: v3(0.34, -0.54, 0.22), yaw: -0.45 });
          return cr.d < ax.d ? cr : ax;
        },
        { ...objCam, ro: v3(0, 0.28, 2.28), ta: v3(0, 0.02, 0), floorType: "grass" }
      )
  });

  // 3. 4-Way Anti-Drift Comparison
  for (const [fname, dMode, expr] of [
    ["drift_1_fingers.png", "human-fingers", "shocked"],
    ["drift_2_blurry.png", "blurry-noodle", "deadpan"],
    ["drift_3_roblox_lego.png", "roblox-lego", "deadpan"],
    ["drift_4_locked.png", "none", "smile"]
  ]) {
    tasks.push({
      name: fname,
      w: 320,
      h: 420,
      run: () =>
        render3DViewport(
          320,
          420,
          (p) =>
            evalMinecraftAvatarSDF(p, {
              yaw: 0.36,
              armLPitch: -0.45,
              armRPitch: -0.68,
              driftMode: dMode,
              expression: expr,
              theme: "steve",
              heldItem: "pickaxe"
            }),
          { ...studioCam, ro: v3(0, 0.22, 2.42), ta: v3(0, 0.06, 0) }
        )
    });
  }

  // 4. Keyframes & 24-frame animation loops for the 3 cases
  const suites = [
    ["creeper", buildDiamondCreeperScene],
    ["cozy", buildCozyLanternScene],
    ["tnt", buildProVsNoobTntScene]
  ];

  for (const [prefix, builder] of suites) {
    for (let s = 0; s < 4; s++) {
      tasks.push({
        name: `${prefix}_shot_${s}.png`,
        w: 360,
        h: 640,
        run: () => {
          const { cam, sceneFn } = builder(s, 0.55);
          return render3DViewport(360, 640, sceneFn, cam);
        }
      });
    }
    let frameIdx = 0;
    for (let s = 0; s < 4; s++) {
      for (let f = 0; f < 6; f++) {
        const phase = (f + 0.5) / 6;
        const idx = frameIdx++;
        tasks.push({
          name: `${prefix}_anim_${String(idx).padStart(2, "0")}.png`,
          w: 270,
          h: 480,
          run: () => {
            const { cam, sceneFn } = builder(s, phase);
            return render3DViewport(270, 480, sceneFn, cam);
          }
        });
      }
    }
  }

  return tasks;
}

export async function renderRawPanelSetParallel(tmpDir, force = false) {
  fs.mkdirSync(tmpDir, { recursive: true });
  const allTasks = buildRenderTasks();
  const pendingIndices = [];
  for (let i = 0; i < allTasks.length; i++) {
    const outPath = path.join(tmpDir, allTasks[i].name);
    if (force || !fs.existsSync(outPath) || fs.statSync(outPath).size <= 1000) {
      pendingIndices.push(i);
    }
  }
  if (pendingIndices.length === 0) return;

  const workerCount = Math.min(os.cpus().length || 4, 8, pendingIndices.length);
  const chunks = Array.from({ length: workerCount }, () => []);
  pendingIndices.forEach((taskIdx, i) => {
    chunks[i % workerCount].push(taskIdx);
  });

  const thisFile = fileURLToPath(import.meta.url);
  await Promise.all(
    chunks.map(
      (indices) =>
        new Promise((resolve, reject) => {
          const w = new Worker(thisFile, {
            workerData: { tmpDir, indices }
          });
          w.on("exit", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Render worker exited with code ${code}`));
          });
          w.on("error", reject);
        })
    )
  );
}

export function buildBoardsManifest(rawDir) {
  const showcaseDir = path.join(ROOT, "assets", "showcase");
  const creeperDir = path.join(ROOT, "examples", "diamond-creeper-ambush", "assets");
  const cozyDir = path.join(ROOT, "examples", "cozy-lantern-build", "assets");
  const tntDir = path.join(ROOT, "examples", "pro-builder-vs-noob-tnt", "assets");
  for (const d of [showcaseDir, creeperDir, cozyDir, tntDir]) {
    fs.mkdirSync(d, { recursive: true });
  }

  return {
    rootDir: ROOT,
    rawDir,
    turnaround: {
      outZh: path.join(showcaseDir, "steve_alex_turnaround_sheet.zh.png"),
      outEn: path.join(showcaseDir, "steve_alex_turnaround_sheet.en.png"),
      outDefault: [
        path.join(showcaseDir, "steve_alex_turnaround_sheet.png"),
        path.join(creeperDir, "steve_alex_turnaround_sheet.png")
      ],
      views: [
        { file: "turn_front.png", labelZh: "正面 0° (8x8x8立方头 + 4x4平头手)", labelEn: "Front 0° (8x8x8 Head + 4x4 Square Hands)" },
        { file: "turn_3q.png", labelZh: "斜侧 45° (+0.5px 3D刘海 + 16x16x1钻石镐)", labelEn: "3/4 View 45° (+0.5px Hair + 16x16x1 Pickaxe)" },
        { file: "turn_side.png", labelZh: "侧面 90° (零3D鼻凸起 + 16x16像素网格)", labelEn: "Profile 90° (Zero 3D Nose + 16x16 Grid)" }
      ]
    },
    objects: {
      outZh: path.join(showcaseDir, "voxel_blocks_and_mobs_sheet.zh.png"),
      outEn: path.join(showcaseDir, "voxel_blocks_and_mobs_sheet.en.png"),
      outDefault: path.join(showcaseDir, "voxel_blocks_and_mobs_sheet.png"),
      panels: [
        { file: "obj_1_ore_grass.png", labelZh: "16x16x16 草方块 & 钻石矿", labelEn: "16x16x16 Grass & Diamond Ore", r: 16, g: 185, b: 129 },
        { file: "obj_2_tnt_chest.png", labelZh: "16x16x16 TNT & 14x14x14 储物箱", labelEn: "16x16x16 TNT & 14x14x14 Chest", r: 245, g: 158, b: 11 },
        { file: "obj_3_extruded_tools.png", labelZh: "16x16x1 挤出像素钻石镐 & 剑", labelEn: "16x16x1 Extruded Pickaxe & Sword", r: 14, g: 165, b: 233 },
        { file: "obj_4_creeper_axolotl.png", labelZh: "四足苦力怕 & 粉红美西螈", labelEn: "Quadruped Creeper & Pink Axolotl", r: 168, g: 85, b: 247 }
      ]
    },
    drift: {
      outZh: path.join(showcaseDir, "drift_rescue_comparison.zh.png"),
      outEn: path.join(showcaseDir, "drift_rescue_comparison.en.png"),
      outDefault: path.join(showcaseDir, "drift_rescue_comparison.png"),
      panels: [
        { file: "drift_1_fingers.png", labelZh: "× 真人手指 / 3D鼻子", labelEn: "× Human Fingers / 3D Nose", r: 225, g: 29, b: 72 },
        { file: "drift_2_blurry.png", labelZh: "× 贴图糊化 / 圆棍工具", labelEn: "× Blurry Texels / Round Rod", r: 217, g: 119, b: 6 },
        { file: "drift_3_roblox_lego.png", labelZh: "× Roblox圆头 / 乐高C爪", labelEn: "× Roblox Head / Lego Claw", r: 124, g: 58, b: 237 },
        { file: "drift_4_locked.png", labelZh: "✓ 标准 Minecraft 像素几何", labelEn: "✓ Canonical Minecraft Voxel", r: 5, g: 150, b: 105 }
      ]
    },
    cases: [
      {
        prefix: "creeper",
        sheetZh: path.join(creeperDir, "storyboard_contact_sheet.zh.png"),
        sheetEn: path.join(creeperDir, "storyboard_contact_sheet.en.png"),
        sheetDefault: path.join(creeperDir, "storyboard_contact_sheet.png"),
        gifPath: path.join(creeperDir, "diamond_creeper_ambush.gif"),
        mp4Path: path.join(creeperDir, "diamond_creeper_ambush.mp4"),
        shots: [
          {
            labelZh: "01 · 挥镐敲钻石矿 (0–3.8s)",
            labelEn: "01 · Mine Diamond Ore (0–3.8s)",
            chatZh: "出钻石了?!",
            chatEn: "Diamonds?!",
            bubbleX: 115,
            bubbleY: 36,
            savePath: path.join(creeperDir, "shot_01_mine.png")
          },
          {
            labelZh: "02 · 矿碎惊现苦力怕 (3.8–7.5s)",
            labelEn: "02 · Creeper Reveal (3.8–7.5s)",
            chatZh: "嘶——",
            chatEn: "Tssss...",
            bubbleX: 212,
            bubbleY: 56,
            savePath: path.join(creeperDir, "shot_02_reveal.png")
          },
          {
            labelZh: "03 · 白光闪烁膨胀 (7.5–11.3s)",
            labelEn: "03 · White Fuse Swell (7.5–11.3s)",
            chatZh: "快跑!!",
            chatEn: "RUN!!",
            bubbleX: 102,
            bubbleY: 36,
            savePath: path.join(creeperDir, "shot_03_swell.png")
          },
          {
            labelZh: "04 · 方块烟雾与击飞 (11.3–15s)",
            labelEn: "04 · Voxel Blast Loop (11.3–15s)",
            chatZh: "重生点见...",
            chatEn: "Respawn...",
            bubbleX: 142,
            bubbleY: 72,
            savePath: path.join(creeperDir, "shot_04_blast.png")
          }
        ]
      },
      {
        prefix: "cozy",
        sheetZh: path.join(cozyDir, "cozy_storyboard_sheet.zh.png"),
        sheetEn: path.join(cozyDir, "cozy_storyboard_sheet.en.png"),
        sheetDefault: path.join(cozyDir, "cozy_storyboard_sheet.png"),
        gifPath: path.join(cozyDir, "cozy_lantern_build.gif"),
        mp4Path: path.join(cozyDir, "cozy_lantern_build.mp4"),
        shots: [
          { labelZh: "01 · 放置工作台方块", labelEn: "01 · Snap Crafting Table", chatZh: "搭个小木屋!", chatEn: "Build time!", bubbleX: 116, bubbleY: 38 },
          { labelZh: "02 · 开启银锁储物箱", labelEn: "02 · Open Hinged Chest", chatZh: "强迫症舒适", chatEn: "Crisp snap!", bubbleX: 118, bubbleY: 38 },
          { labelZh: "03 · 点亮BSL光影灯笼", labelEn: "03 · BSL Lantern Glow", chatZh: "开启光影!", chatEn: "Shader ON!", bubbleX: 132, bubbleY: 36 },
          { labelZh: "04 · 粉红美西螈治愈收尾", labelEn: "04 · Pink Axolotl Loop", chatZh: "今日份治愈", chatEn: "Cozy home", bubbleX: 122, bubbleY: 38 }
        ]
      },
      {
        prefix: "tnt",
        sheetZh: path.join(tntDir, "tnt_storyboard_sheet.zh.png"),
        sheetEn: path.join(tntDir, "tnt_storyboard_sheet.en.png"),
        sheetDefault: path.join(tntDir, "tnt_storyboard_sheet.png"),
        gifPath: path.join(tntDir, "pro_builder_vs_noob_tnt.gif"),
        mp4Path: path.join(tntDir, "pro_builder_vs_noob_tnt.mp4"),
        shots: [
          { labelZh: "01 · 钻石大佬 vs 抱TNT萌新", labelEn: "01 · Diamond Pro vs. Noob", chatZh: "别乱动!", chatEn: "Don't touch!", bubbleX: 102, bubbleY: 38 },
          { labelZh: "02 · 萌新拍下16x16x16 TNT", labelEn: "02 · Noob Places TNT", chatZh: "手滑了...", chatEn: "oops.", bubbleX: 215, bubbleY: 38 },
          { labelZh: "03 · TNT白光闪烁膨胀", labelEn: "03 · Primed TNT Flash", chatZh: "等一下?!", chatEn: "WAIT—", bubbleX: 160, bubbleY: 36 },
          { labelZh: "04 · 双人同步45°死鱼眼", labelEn: "04 · Synchronized Deadpan", chatZh: "已踢出服", chatEn: "Banned.", bubbleX: 160, bubbleY: 38 }
        ]
      }
    ]
  };
}

if (!isMainThread && workerData) {
  const { tmpDir, indices } = workerData;
  const tasks = buildRenderTasks();
  for (const idx of indices) {
    const t = tasks[idx];
    const buf = t.run();
    fs.writeFileSync(path.join(tmpDir, t.name), encodePNG(t.w, t.h, buf));
  }
  parentPort?.postMessage("done");
} else {
  const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
  if (isMain) {
    const force = process.argv.includes("--force");
    const rawDir = path.join(ROOT, "tmp", "raw_panels");
    console.log("Rendering 3D Minecraft voxel turnaround, object/mob panels, drift comparison, and 9:16 keyframes across worker threads...");
    await renderRawPanelSetParallel(rawDir, force);
    const manifest = buildBoardsManifest(rawDir);
    const manifestPath = path.join(ROOT, "tmp", "boards_manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log("Composing bilingual showcase boards, contact sheets, GIFs, and MP4s...");
    execFileSync(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(__dirname, "compose_boards.ps1"), "-ManifestPath", manifestPath],
      { stdio: "inherit" }
    );
  }
}
