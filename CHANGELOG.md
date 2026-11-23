# Changelog

## 1.2.0

- Locked canonical Minecraft pixel-grid geometry across characters (`8x8x8` head, `8x12x4` torso, `4x12x4` Steve / `3x12x4` Alex limbs, `+0.5px` 3D outer skin shell), full blocks (`16x16x16` Grass Block, Diamond Ore, TNT, Crafting Table), sub-block props (`14x14x14` hinged Chest, `2x10x2` Torch/Lantern), extruded `16x16x1` tools (Diamond Pickaxe, Diamond Sword), and mobs (Creeper, Enderman, Axolotl).
- Added four zero-dependency Node.js CLI tools (`voxel_spec.mjs`, `shot_compiler.mjs`, `drift_check.mjs`, `render_preview.mjs`) with true nearest-neighbor 3D pixel-texel raymarching.
- Added bilingual `.zh.png` and `.en.png` showcase sheets (`steve_alex_turnaround_sheet`, `voxel_blocks_and_mobs_sheet`, `drift_rescue_comparison`) and three 9:16 short-video packages (`diamond-creeper-ambush`, `cozy-lantern-build`, `pro-builder-vs-noob-tnt`) with animated GIFs and audio MP4s.
