<div align="center">

<img src="../../assets/icon.svg" width="108" height="108" alt="Minecraft Style Video icon" />

# Minecraft Style Video

Planifica cortos verticales 9:16 estilo Minecraft: fija las proporciones voxel `8x8x8` y `16x16x16`, compila prompts por plano y previsualiza el movimiento localmente.

[![Agent Skill](https://img.shields.io/badge/Skill-SKILL.md-10b981?style=flat-square)](../../skills/minecraft-style-video/SKILL.md)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-268354?style=flat-square)](#inicio-rápido)
[![MIT License](https://img.shields.io/badge/License-MIT-2563eb?style=flat-square)](../../LICENSE)

**[Ejemplos animados](#ejemplos-animados)** · [Bucles de bloques](#bucles-de-bloques-y-objetos) · [Inicio rápido](#inicio-rápido) · [Guía del Skill](../../skills/minecraft-style-video/SKILL.md)

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Español** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Português](README.pt-BR.md) · [Русский](README.ru.md)

</div>

[![Cuatro vistas previas sincronizadas 9:16 de cortos voxel estilo Minecraft](../../assets/showcase/minecraft_shorts_reel.gif)](../../assets/showcase/minecraft_shorts_reel.mp4)

## Ejemplos animados

Cada paquete planifica un corto vertical de 15 segundos y cuatro planos. Los **GIF y MP4 de 4 segundos** son vistas previas 3D locales para revisar encuadre y proporciones voxel; haz clic en cualquier animación para abrir su MP4 con audio. Para obtener el clip final, ejecuta los prompts en el modelo de video externo correspondiente.

| 01 · Diamante y Creeper (`Kling`) | 02 · Cabaña con Farol (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| [<img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="235" alt="Case 01" />](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) | [<img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="235" alt="Case 02" />](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) | [<img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="235" alt="Case 03" />](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) |
| [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Storyboard](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [Prompts](../../examples/diamond-creeper-ambush/) | [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Storyboard](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [Prompts](../../examples/cozy-lantern-build/) | [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Storyboard](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [Prompts](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Cadena de Pistones (`Wan`)** | **05 · Enderman y Césped (`Sora`)** | **06 · Ajolote bajo la Lluvia (`Runway`)** |
| [<img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="235" alt="Case 04" />](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) | [<img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="235" alt="Case 05" />](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) | [<img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="235" alt="Case 06" />](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) |
| [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Storyboard](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [Prompts](../../examples/redstone-chain-asmr/) | [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Storyboard](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [Prompts](../../examples/enderman-block-heist/) | [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Storyboard](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [Prompts](../../examples/axolotl-rainy-shelter/) |

## Bucles de bloques y objetos

Para planos centrados en bloques y mecanismos, el skill fija bisagras de cofres, minerales emisivos y herramientas extruidas `16x16x1` con bordes escalonados:

| Cofre Articulado & Herramientas `16x16x1` | Pistón Pegajoso & Lámpara Redstone | `TNT` Cebado & Humo Cúbico |
| :---: | :---: | :---: |
| [<img src="../../assets/showcase/chest_loot_loop.gif" width="255" alt="Chest loot loop" />](../../assets/showcase/chest_loot_loop.mp4) | [<img src="../../assets/showcase/piston_ore_loop.gif" width="255" alt="Sticky piston loop" />](../../assets/showcase/piston_ore_loop.mp4) | [<img src="../../assets/showcase/tnt_blast_loop.gif" width="255" alt="TNT blast loop" />](../../assets/showcase/tnt_blast_loop.mp4) |
| Cofre `14x14x14` + pico y espada ([MP4](../../assets/showcase/chest_loot_loop.mp4)) | Pistón `16x16x16` + mena brillante ([MP4](../../assets/showcase/piston_ore_loop.mp4)) | Destello blanco + humo cúbico ([MP4](../../assets/showcase/tnt_blast_loop.mp4)) |

## Inicio rápido

Clona en tu carpeta local de Skills (compatible con Codex, GitHub Copilot, Claude Code y Cursor):

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

O ejecuta las herramientas CLI directamente en Node.js 18+ sin dependencias externas:

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang es
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang es
node scripts/drift_check.mjs --prompt "A cute Minecraft boy holding a round metal sword with five fingers mines ore and runs away" --engine kling --mode t2v --lang es
```

## Scripts, límites y referencias

Ancla las secuencias I2V con una [lámina en tres vistas](../../assets/showcase/steve_alex_turnaround_sheet.en.png) y limita cada clip de 4 a 5 segundos a una acción principal ([comparativa anti-deriva](../../assets/showcase/drift_rescue_comparison.en.png) · [flujo de trabajo](../pipeline.svg)).

- [`voxel_spec.mjs`](../../scripts/voxel_spec.mjs) · [`shot_compiler.mjs`](../../scripts/shot_compiler.mjs) · [`drift_check.mjs`](../../scripts/drift_check.mjs) · [`render_preview.mjs`](../../scripts/render_preview.mjs)
- [Guía del Skill (`SKILL.md`)](../../skills/minecraft-style-video/SKILL.md) · [Geometría voxel y bloques](../../references/voxel-geometry-blocks-and-shaders.md) · [Manual de prompts](../../references/model-prompt-playbook.md) · [Corrección de deriva](../../references/rescue-and-anti-drift.md) · [Ritmo y audio](../../references/short-video-beats-and-audio.md) · [Plantillas](../../references/viral-archetypes-catalog.md)

[Licencia MIT](../../LICENSE). Proyecto independiente, no afiliado ni respaldado por Mojang Studios ni Microsoft.
