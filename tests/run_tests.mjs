import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildVoxelSpec } from "../scripts/voxel_spec.mjs";
import { compileStoryboard } from "../scripts/shot_compiler.mjs";
import { inspectPrompt } from "../scripts/drift_check.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

test("voxel_spec locks 8x8x8 head, +0.5px 3D skin layer, 16x16x16 blocks, and 16x16x1 extruded tools", () => {
  const spec = buildVoxelSpec({
    archetype: "steve-miner",
    object: "diamond-ore",
    heldItem: "diamond-pickaxe",
    shader: "bsl-sunlight",
    name: "Steve"
  });
  assert.equal(spec.name, "Steve");
  assert.equal(spec.rig, "steve-wide");
  assert.equal(spec.object, "diamond-ore");
  assert.equal(spec.heldItem, "diamond-pickaxe");
  assert.match(spec.turnaroundPromptEn, /8x8x8 cubic head/);
  assert.match(spec.turnaroundPromptEn, /flat 4x4 square pixel-block hands/);
  assert.match(spec.turnaroundPromptEn, /extruded 16x16x1 3D pixel-art Minecraft Diamond Pickaxe/);
  assert.match(spec.objectPromptEn, /16x16x16 Minecraft Diamond Ore block/);
  assert.match(spec.negativePromptEn, /Roblox cylindrical barrel head/);
  assert.match(spec.negativePromptEn, /Lego C-shaped claw hands/);
});

test("shot_compiler generates 4 shots for 15s and 8 shots for 30s with engine syntax", () => {
  const klingPlan = compileStoryboard({
    template: "diamond-creeper-ambush",
    duration: 15,
    engine: "kling",
    shader: "rtx-emissive"
  });
  assert.equal(klingPlan.shotCount, 4);
  assert.equal(klingPlan.shots[0].timeWindow, "0.0s–3.8s");
  assert.match(klingPlan.shots[0].i2vPromptZh, /可灵Kling I2V/);

  const hailuoPlan = compileStoryboard({
    template: "pro-builder-vs-noob-tnt",
    duration: 30,
    engine: "hailuo",
    shader: "bare-bones-trailer"
  });
  assert.equal(hailuoPlan.shotCount, 8);
  assert.match(hailuoPlan.shots[0].i2vPromptEn, /^\[Push in\]/);
});

test("drift_check flags human fingers, smooth tools, and multi-verb overload as FAIL, and passes locked prompts", () => {
  const badReport = inspectPrompt({
    prompt:
      "A cute Minecraft boy holding a round metal sword with five fingers walks into a cave then mines ore and fights a Creeper",
    engine: "kling",
    mode: "t2v"
  });
  assert.equal(badReport.overallStatus, "FAIL");
  const handGate = badReport.checks.find((c) => c.gate.startsWith("Hand & Extruded Tool"));
  const budgetGate = badReport.checks.find((c) => c.gate.startsWith("Single-Action"));
  assert.equal(handGate.status, "FAIL");
  assert.equal(budgetGate.status, "FAIL");

  const goodReport = inspectPrompt({
    prompt:
      "An authentic Minecraft voxel character with a sharp 90-degree 8x8x8 cubic head, flat 8x8 pixel face, +0.5px 3D outer hair layer, and rigid 4x12x4 rectangular prism arms with fingerless flat 4x4 square hands swings an extruded 16x16x1 stepped pixel-art diamond pickaxe into a crisp nearest-neighbor 16x16 diamond ore block.",
    engine: "kling",
    mode: "i2v"
  });
  assert.equal(goodReport.overallStatus, "PASS");
});

test("validate_skill CLI verifies repository files, versions, and manifests", () => {
  const out = execFileSync(process.execPath, [path.join(ROOT, "scripts", "validate_skill.mjs")], {
    cwd: ROOT,
    encoding: "utf8"
  });
  assert.match(out, /minecraft-style-skill v1\.2\.0 package is valid/);
});
