<div align="center">

<img src="../../assets/icon.svg" width="108" height="108" alt="Minecraft Style Video icon" />

# Minecraft Style Video

Vertikale 9:16-Kurzvideos im Minecraft-Stil planen: `8x8x8`-Charakter- und `16x16x16`-Blockproportionen fixieren, Shot-Prompts kompilieren und die Bewegung lokal testen.

[![Agent Skill](https://img.shields.io/badge/Skill-SKILL.md-10b981?style=flat-square)](../../skills/minecraft-style-video/SKILL.md)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-268354?style=flat-square)](#schnellstart)
[![MIT License](https://img.shields.io/badge/License-MIT-2563eb?style=flat-square)](../../LICENSE)

**[Animierte Beispiele](#animierte-beispiele)** · [Block- & Objekt-Loops](#voxel-block--und-objekt-loops) · [Schnellstart](#schnellstart) · [Skill-Anleitung](../../skills/minecraft-style-video/SKILL.md)

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · **Deutsch** · [Português](README.pt-BR.md) · [Русский](README.ru.md)

</div>

[![Vier synchronisierte 9:16-Minecraft-Voxel-Kurzvideo-Vorschauen](../../assets/showcase/minecraft_shorts_reel.gif)](../../assets/showcase/minecraft_shorts_reel.mp4)

## Animierte Beispiele

Jedes Paket plant ein 15-sekündiges Kurzvideo mit vier Einstellungen. Die **4-Sekunden-GIFs und -MP4s** sind lokale 3D-Voxel-Vorschauen zur Prüfung von Bildausschnitt und Proportionen; ein Klick öffnet das MP4 mit Ton. Für das fertige Video werden die Prompts in einem externen Videomodell ausgeführt.

| 01 · Diamant & Creeper (`Kling`) | 02 · Laternen-Hütte (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| [<img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="235" alt="Case 01" />](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) | [<img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="235" alt="Case 02" />](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) | [<img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="235" alt="Case 03" />](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) |
| [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Storyboard](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [Prompts](../../examples/diamond-creeper-ambush/) | [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Storyboard](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [Prompts](../../examples/cozy-lantern-build/) | [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Storyboard](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [Prompts](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Redstone-Kolbenkette (`Wan`)** | **05 · Enderman & Grasblock (`Sora`)** | **06 · Rosa Axolotl im Regen (`Runway`)** |
| [<img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="235" alt="Case 04" />](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) | [<img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="235" alt="Case 05" />](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) | [<img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="235" alt="Case 06" />](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) |
| [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Storyboard](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [Prompts](../../examples/redstone-chain-asmr/) | [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Storyboard](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [Prompts](../../examples/enderman-block-heist/) | [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Storyboard](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [Prompts](../../examples/axolotl-rainy-shelter/) |

## Voxel-Block- und Objekt-Loops

Auch bei reinen Objekt-Einstellungen (Truhen, Redstone-Technik, TNT) bleiben Scharniere, leuchtende Erze und gestufte `16x16x1`-Pixelwerkzeuge kantenscharf erhalten:

| Aufklappbare Truhe & `16x16x1`-Werkzeuge | Klebriger Kolben & Redstone-Lampe | Gezündetes `TNT` & Würfelrauch |
| :---: | :---: | :---: |
| [<img src="../../assets/showcase/chest_loot_loop.gif" width="255" alt="Chest loot loop" />](../../assets/showcase/chest_loot_loop.mp4) | [<img src="../../assets/showcase/piston_ore_loop.gif" width="255" alt="Sticky piston loop" />](../../assets/showcase/piston_ore_loop.mp4) | [<img src="../../assets/showcase/tnt_blast_loop.gif" width="255" alt="TNT blast loop" />](../../assets/showcase/tnt_blast_loop.mp4) |
| `14x14x14`-Truhe + Spitzhacke & Schwert ([MP4](../../assets/showcase/chest_loot_loop.mp4)) | `16x16x16`-Kolben + Diamanterz ([MP4](../../assets/showcase/piston_ore_loop.mp4)) | Weißes Blinken + Voxel-Rauchblöcke ([MP4](../../assets/showcase/tnt_blast_loop.mp4)) |

## Schnellstart

In das lokale Skills-Verzeichnis klonen (kompatibel mit Codex, GitHub Copilot, Claude Code und Cursor):

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

Oder direkt über die CLI auf Node.js 18+ ohne Drittanbieter-Pakete ausführen:

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang de
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang de
node scripts/drift_check.mjs --prompt "A cute Minecraft boy holding a round metal sword with five fingers mines ore and runs away" --engine kling --mode t2v --lang de
```

## Skripte, Grenzen und Referenzen

Mehrteilige I2V-Sequenzen mit einem [Drei-Ansichten-Bogen](../../assets/showcase/steve_alex_turnaround_sheet.en.png) starten und pro 4–5-Sekunden-Clip nur eine Hauptaktion einplanen ([Anti-Drift-Vergleich](../../assets/showcase/drift_rescue_comparison.en.png) · [Workflow-Diagramm](../pipeline.svg)).

- [`voxel_spec.mjs`](../../scripts/voxel_spec.mjs) · [`shot_compiler.mjs`](../../scripts/shot_compiler.mjs) · [`drift_check.mjs`](../../scripts/drift_check.mjs) · [`render_preview.mjs`](../../scripts/render_preview.mjs)
- [Skill-Anleitung (`SKILL.md`)](../../skills/minecraft-style-video/SKILL.md) · [Voxel-Geometrie & Blöcke](../../references/voxel-geometry-blocks-and-shaders.md) · [Prompt-Handbuch](../../references/model-prompt-playbook.md) · [Drift-Korrekturen](../../references/rescue-and-anti-drift.md) · [Tempo & Audio](../../references/short-video-beats-and-audio.md) · [Vorlagen](../../references/viral-archetypes-catalog.md)

[MIT-Lizenz](../../LICENSE). Unabhängiges Open-Source-Projekt, nicht mit Mojang Studios oder Microsoft verbunden.
