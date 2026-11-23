#!/usr/bin/env node
/**
 * validate_skill.mjs
 * Zero-dependency package validator for minecraft-style-skill.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function fail(message) {
  console.error(`VALIDATION FAILED: ${message}`);
  process.exit(1);
}

function readUtf8(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    fail(`Missing required file: ${relPath}`);
  }
  return fs.readFileSync(full, "utf8");
}

const requiredFiles = [
  "SKILL.md",
  "README.md",
  "README.en.md",
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  "agents/openai.yaml",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/plugin.json",
  "assets/icon.svg",
  "docs/pipeline.svg",
  "references/voxel-geometry-blocks-and-shaders.md",
  "references/model-prompt-playbook.md",
  "references/rescue-and-anti-drift.md",
  "references/short-video-beats-and-audio.md",
  "references/viral-archetypes-catalog.md",
  "templates/character_and_object_card_template.md",
  "templates/storyboard_template.md",
  "templates/shot_prompt_template.md",
  "scripts/voxel_spec.mjs",
  "scripts/shot_compiler.mjs",
  "scripts/drift_check.mjs",
  "scripts/render_preview.mjs",
  "assets/showcase/steve_alex_turnaround_sheet.png",
  "assets/showcase/steve_alex_turnaround_sheet.zh.png",
  "assets/showcase/steve_alex_turnaround_sheet.en.png",
  "assets/showcase/voxel_blocks_and_mobs_sheet.png",
  "assets/showcase/voxel_blocks_and_mobs_sheet.zh.png",
  "assets/showcase/voxel_blocks_and_mobs_sheet.en.png",
  "assets/showcase/drift_rescue_comparison.png",
  "assets/showcase/drift_rescue_comparison.zh.png",
  "assets/showcase/drift_rescue_comparison.en.png",
  "examples/diamond-creeper-ambush/README.md",
  "examples/diamond-creeper-ambush/character_and_object_card.md",
  "examples/diamond-creeper-ambush/storyboard.md",
  "examples/diamond-creeper-ambush/prompts.json",
  "examples/diamond-creeper-ambush/drift_report.md",
  "examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.png",
  "examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.zh.png",
  "examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png",
  "examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif",
  "examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4",
  "examples/cozy-lantern-build/README.md",
  "examples/cozy-lantern-build/character_and_object_card.md",
  "examples/cozy-lantern-build/storyboard.md",
  "examples/cozy-lantern-build/prompts.json",
  "examples/cozy-lantern-build/assets/cozy_storyboard_sheet.png",
  "examples/cozy-lantern-build/assets/cozy_storyboard_sheet.zh.png",
  "examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png",
  "examples/cozy-lantern-build/assets/cozy_lantern_build.gif",
  "examples/cozy-lantern-build/assets/cozy_lantern_build.mp4",
  "examples/pro-builder-vs-noob-tnt/README.md",
  "examples/pro-builder-vs-noob-tnt/character_and_object_card.md",
  "examples/pro-builder-vs-noob-tnt/storyboard.md",
  "examples/pro-builder-vs-noob-tnt/prompts.json",
  "examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.png",
  "examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.zh.png",
  "examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png",
  "examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif",
  "examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4"
];

for (const rel of requiredFiles) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    fail(`Missing required file: ${rel}`);
  }
}

const skillText = readUtf8("SKILL.md");
const fmMatch = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
if (!fmMatch) {
  fail("SKILL.md must begin with YAML frontmatter");
}
const fm = fmMatch[1];
if (!/^name:\s*minecraft-style-skill\s*$/m.test(fm)) {
  fail("SKILL.md YAML frontmatter must declare name: minecraft-style-skill");
}

const verMatch = fm.match(/^\s+version:\s*["']?([0-9]+\.[0-9]+\.[0-9]+)["']?\s*$/m);
if (!verMatch) {
  fail("SKILL.md metadata.version must be a three-part semver string");
}
const skillVersion = verMatch[1];

const pkg = JSON.parse(readUtf8("package.json"));
const claudePlugin = JSON.parse(readUtf8(".claude-plugin/plugin.json"));
const cursorPlugin = JSON.parse(readUtf8(".cursor-plugin/plugin.json"));
const marketplace = JSON.parse(readUtf8(".claude-plugin/marketplace.json"));
const changelog = readUtf8("CHANGELOG.md");

const changelogMatch = changelog.match(/^## ([0-9]+\.[0-9]+\.[0-9]+)\s*$/m);
if (!changelogMatch) {
  fail("CHANGELOG.md must include a ## x.y.z version heading");
}

const versions = new Set([
  skillVersion,
  pkg.version,
  claudePlugin.version,
  cursorPlugin.version,
  changelogMatch[1]
]);
if (versions.size !== 1) {
  fail(`Version mismatch across files: ${Array.from(versions).join(", ")}`);
}

const firstSentence =
  "Generate Minecraft-style voxel character, mob, and block short videos with locked 8x8x8/16x16x16 pixel-grid geometry, 9:16 storyboards, and model-specific prompts.";
for (const [label, desc] of [
  ["package.json", pkg.description],
  [".claude-plugin/plugin.json", claudePlugin.description],
  [".cursor-plugin/plugin.json", cursorPlugin.description],
  [".claude-plugin/marketplace.json", marketplace.plugins?.[0]?.description]
]) {
  if (desc !== firstSentence) {
    fail(`Description mismatch in ${label}: ${desc}`);
  }
}

const skillWords = skillText.split(/\s+/).filter(Boolean).length;
if (skillWords > 5500) {
  fail(`Keep SKILL.md at 5,500 words or fewer; found ${skillWords}`);
}

console.log(
  `minecraft-style-skill v${skillVersion} package is valid (${requiredFiles.length} files checked, ${skillWords} words in SKILL.md)`
);
