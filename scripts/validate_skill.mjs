#!/usr/bin/env node
/**
 * validate_skill.mjs
 * Zero-dependency package and relative-link validator for minecraft-style-video.
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

const readmeFiles = [
  "README.md",
  "README.zh-CN.md",
  "docs/i18n/README.zh-TW.md",
  "docs/i18n/README.ja.md",
  "docs/i18n/README.ko.md",
  "docs/i18n/README.es.md",
  "docs/i18n/README.fr.md",
  "docs/i18n/README.de.md",
  "docs/i18n/README.pt-BR.md",
  "docs/i18n/README.ru.md"
];

const requiredFiles = [
  "SKILL.md",
  ...readmeFiles,
  "LICENSE",
  "CHANGELOG.md",
  "package.json",
  "agents/openai.yaml",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
  ".cursor-plugin/plugin.json",
  "assets/icon.svg",
  "docs/pipeline.svg",
  "docs/pipeline.zh.svg",
  "references/voxel-geometry-blocks-and-shaders.md",
  "references/classic-minecraft-catalog.md",
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
  "assets/library/catalog.json",
  "assets/library/characters/char_steve.png",
  "assets/library/characters/char_alex.png",
  "assets/library/characters/char_knight.png",
  "assets/library/characters/char_hoodie.png",
  "assets/library/characters/mob_creeper.png",
  "assets/library/characters/mob_enderman.png",
  "assets/library/objects/block_grass.png",
  "assets/library/objects/block_diamond_ore.png",
  "assets/library/objects/block_tnt.png",
  "assets/library/objects/block_crafting_table.png",
  "assets/library/objects/prop_chest.png",
  "assets/library/objects/prop_piston.png",
  "assets/library/objects/item_diamond_pickaxe.png",
  "assets/library/objects/item_diamond_sword.png",
  "assets/showcase/steve_alex_turnaround_sheet.en.png",
  "assets/showcase/steve_alex_turnaround_sheet.zh.png",
  "assets/showcase/voxel_blocks_and_mobs_sheet.en.png",
  "assets/showcase/voxel_blocks_and_mobs_sheet.zh.png",
  "assets/showcase/drift_rescue_comparison.en.png",
  "assets/showcase/drift_rescue_comparison.zh.png",
  "assets/showcase/classic_characters_lineup.en.png",
  "assets/showcase/classic_characters_lineup.zh.png",
  "assets/showcase/classic_objects_atlas.en.png",
  "assets/showcase/classic_objects_atlas.zh.png",
  "examples/diamond-creeper-ambush/README.md",
  "examples/diamond-creeper-ambush/character_and_object_card.md",
  "examples/diamond-creeper-ambush/storyboard.md",
  "examples/diamond-creeper-ambush/prompts.json",
  "examples/diamond-creeper-ambush/drift_report.md",
  "examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png",
  "examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.zh.png",
  "examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif",
  "examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4",
  "examples/cozy-lantern-build/README.md",
  "examples/cozy-lantern-build/character_and_object_card.md",
  "examples/cozy-lantern-build/storyboard.md",
  "examples/cozy-lantern-build/prompts.json",
  "examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png",
  "examples/cozy-lantern-build/assets/cozy_storyboard_sheet.zh.png",
  "examples/cozy-lantern-build/assets/cozy_lantern_build.gif",
  "examples/cozy-lantern-build/assets/cozy_lantern_build.mp4",
  "examples/pro-builder-vs-noob-tnt/README.md",
  "examples/pro-builder-vs-noob-tnt/character_and_object_card.md",
  "examples/pro-builder-vs-noob-tnt/storyboard.md",
  "examples/pro-builder-vs-noob-tnt/prompts.json",
  "examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png",
  "examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.zh.png",
  "examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif",
  "examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4",
  "examples/redstone-chain-asmr/README.md",
  "examples/redstone-chain-asmr/character_and_object_card.md",
  "examples/redstone-chain-asmr/storyboard.md",
  "examples/redstone-chain-asmr/prompts.json",
  "examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png",
  "examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.zh.png",
  "examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif",
  "examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4",
  "examples/enderman-block-heist/README.md",
  "examples/enderman-block-heist/character_and_object_card.md",
  "examples/enderman-block-heist/storyboard.md",
  "examples/enderman-block-heist/prompts.json",
  "examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png",
  "examples/enderman-block-heist/assets/enderman_storyboard_sheet.zh.png",
  "examples/enderman-block-heist/assets/enderman_block_heist.gif",
  "examples/enderman-block-heist/assets/enderman_block_heist.mp4",
  "examples/axolotl-rainy-shelter/README.md",
  "examples/axolotl-rainy-shelter/character_and_object_card.md",
  "examples/axolotl-rainy-shelter/storyboard.md",
  "examples/axolotl-rainy-shelter/prompts.json",
  "examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png",
  "examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.zh.png",
  "examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif",
  "examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4"
];

for (const rel of requiredFiles) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    fail(`Missing required file: ${rel}`);
  }
}

// Verify all relative file/image links across all 10 READMEs and 6 example READMEs
const docsToCheck = [
  ...readmeFiles,
  "references/classic-minecraft-catalog.md",
  "examples/diamond-creeper-ambush/README.md",
  "examples/cozy-lantern-build/README.md",
  "examples/pro-builder-vs-noob-tnt/README.md",
  "examples/redstone-chain-asmr/README.md",
  "examples/enderman-block-heist/README.md",
  "examples/axolotl-rainy-shelter/README.md"
];

for (const docRel of docsToCheck) {
  const text = readUtf8(docRel);
  const baseDir = path.dirname(path.join(ROOT, docRel));
  const targets = [];
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) targets.push(m[1]);
  for (const m of text.matchAll(/<img[^>]+src="([^"]+)"/g)) targets.push(m[1]);
  for (const rawTarget of targets) {
    const clean = rawTarget.split("#")[0].trim();
    if (!clean || /^https?:\/\//i.test(clean)) continue;
    const resolved = path.resolve(baseDir, clean);
    if (!fs.existsSync(resolved)) {
      fail(`Broken relative link "${rawTarget}" in ${docRel}`);
    }
  }
}

const skillText = readUtf8("SKILL.md");
const fmMatch = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
if (!fmMatch) {
  fail("SKILL.md must begin with YAML frontmatter");
}
const fm = fmMatch[1];
if (!/^name:\s*minecraft-style-video\s*$/m.test(fm)) {
  fail("SKILL.md YAML frontmatter must declare name: minecraft-style-video");
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
  `minecraft-style-video v${skillVersion} package is valid (${requiredFiles.length} files checked, relative links verified, ${skillWords} words in SKILL.md)`
);
