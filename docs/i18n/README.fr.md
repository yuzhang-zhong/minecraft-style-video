<div align="center">

<img src="../../assets/icon.svg" width="108" height="108" alt="Minecraft Style Video icon" />

# Minecraft Style Video

Planifiez des courts métrages verticaux 9:16 style Minecraft : verrouillez les proportions voxel `8x8x8` et `16x16x16`, compilez les prompts par plan et prévisualisez le mouvement en local.

[![Agent Skill](https://img.shields.io/badge/Skill-SKILL.md-10b981?style=flat-square)](../../SKILL.md)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-268354?style=flat-square)](#démarrage-rapide)
[![MIT License](https://img.shields.io/badge/License-MIT-2563eb?style=flat-square)](../../LICENSE)

**[Exemples animés](#exemples-animés)** · [Boucles de blocs](#boucles-de-blocs-et-dobjets) · [Démarrage rapide](#démarrage-rapide) · [Guide du Skill](../../SKILL.md)

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · **Français** · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md)

</div>

[![Quatre aperçus synchronisés 9:16 de courts métrages voxel style Minecraft](../../assets/showcase/minecraft_shorts_reel.gif)](../../assets/showcase/minecraft_shorts_reel.mp4)

## Exemples animés

Chaque dossier planifie un court métrage vertical de 15 secondes en quatre plans. Les **GIF et MP4 de 4 secondes** ci-dessous sont des aperçus 3D locaux permettant de vérifier le cadrage et les proportions voxel ; cliquez sur une animation pour ouvrir son MP4 avec audio. Le rendu vidéo final s'effectue dans un modèle externe.

| 01 · Diamant & Creeper (`Kling`) | 02 · Cabane & Lanterne (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| [<img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="235" alt="Case 01" />](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) | [<img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="235" alt="Case 02" />](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) | [<img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="235" alt="Case 03" />](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) |
| [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Planche](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [Prompts](../../examples/diamond-creeper-ambush/) | [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Planche](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [Prompts](../../examples/cozy-lantern-build/) | [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Planche](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [Prompts](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Chaîne de Pistons (`Wan`)** | **05 · Enderman & Bloc d'Herbe (`Sora`)** | **06 · Axolotl sous la Pluie (`Runway`)** |
| [<img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="235" alt="Case 04" />](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) | [<img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="235" alt="Case 05" />](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) | [<img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="235" alt="Case 06" />](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) |
| [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Planche](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [Prompts](../../examples/redstone-chain-asmr/) | [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Planche](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [Prompts](../../examples/enderman-block-heist/) | [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Planche](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [Prompts](../../examples/axolotl-rainy-shelter/) |

## Boucles de blocs et d'objets

Pour les plans centrés sur des blocs ou mécanismes redstone, le skill verrouille les charnières, les minerais émissifs et les outils extrudés `16x16x1` à bords crénelés :

| Coffre Articulé & Outils `16x16x1` | Piston Collant & Lampe Redstone | `TNT` Amorcé & Fumée Cubique |
| :---: | :---: | :---: |
| [<img src="../../assets/showcase/chest_loot_loop.gif" width="255" alt="Chest loot loop" />](../../assets/showcase/chest_loot_loop.mp4) | [<img src="../../assets/showcase/piston_ore_loop.gif" width="255" alt="Sticky piston loop" />](../../assets/showcase/piston_ore_loop.mp4) | [<img src="../../assets/showcase/tnt_blast_loop.gif" width="255" alt="TNT blast loop" />](../../assets/showcase/tnt_blast_loop.mp4) |
| Coffre `14x14x14` + pioche et épée ([MP4](../../assets/showcase/chest_loot_loop.mp4)) | Piston `16x16x16` + minerai lumineux ([MP4](../../assets/showcase/piston_ore_loop.mp4)) | Flash blanc + fumée cubique ([MP4](../../assets/showcase/tnt_blast_loop.mp4)) |

## Démarrage rapide

Clonez dans votre dossier local de Skills (compatible avec Codex, GitHub Copilot, Claude Code et Cursor) :

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

Ou exécutez directement les scripts CLI sur Node.js 18+ sans dépendances externes :

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang fr
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang fr
node scripts/drift_check.mjs --prompt "A cute Minecraft boy holding a round metal sword with five fingers mines ore and runs away" --engine kling --mode t2v --lang fr
```

## Scripts, limites et références

Ancrez les séquences I2V avec une [planche trois vues](../../assets/showcase/steve_alex_turnaround_sheet.en.png) et limitez chaque plan de 4 à 5 secondes à une seule action principale ([comparatif anti-dérive](../../assets/showcase/drift_rescue_comparison.en.png) · [flux de travail](../pipeline.svg)).

- [`voxel_spec.mjs`](../../scripts/voxel_spec.mjs) · [`shot_compiler.mjs`](../../scripts/shot_compiler.mjs) · [`drift_check.mjs`](../../scripts/drift_check.mjs) · [`render_preview.mjs`](../../scripts/render_preview.mjs)
- [Guide du Skill (`SKILL.md`)](../../SKILL.md) · [Géométrie voxel et blocs](../../references/voxel-geometry-blocks-and-shaders.md) · [Guide des prompts](../../references/model-prompt-playbook.md) · [Correctifs anti-dérive](../../references/rescue-and-anti-drift.md) · [Rythme et audio](../../references/short-video-beats-and-audio.md) · [Modèles de scénarios](../../references/viral-archetypes-catalog.md)

[Licence MIT](../../LICENSE). Projet indépendant, non affilié ni approuvé par Mojang Studios ou Microsoft.
