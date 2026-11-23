<div align="center">

<img src="../../assets/icon.svg" width="108" height="108" alt="Minecraft Style Video icon" />

# Minecraft Style Video

Planeje vídeos curtos verticais 9:16 estilo Minecraft: trave proporções voxel `8x8x8` e `16x16x16`, compile prompts por plano e visualize o movimento localmente.

[![Agent Skill](https://img.shields.io/badge/Skill-SKILL.md-10b981?style=flat-square)](../../SKILL.md)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-268354?style=flat-square)](#início-rápido)
[![MIT License](https://img.shields.io/badge/License-MIT-2563eb?style=flat-square)](../../LICENSE)

**[Exemplos animados](#exemplos-animados)** · [Loops de blocos](#loops-de-blocos-e-itens) · [Início rápido](#início-rápido) · [Guia da Skill](../../SKILL.md)

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Português** · [Русский](README.ru.md)

</div>

[![Quatro prévias sincronizadas 9:16 de curtas voxel estilo Minecraft](../../assets/showcase/minecraft_shorts_reel.gif)](../../assets/showcase/minecraft_shorts_reel.mp4)

## Exemplos animados

Cada pacote planeja um curta vertical de 15 segundos com quatro planos. Os **GIFs e MP4s de 4 segundos** abaixo são prévias 3D locais para conferir enquadramento e proporções voxel; clique em qualquer animação para abrir o MP4 com áudio. O vídeo final deve ser gerado em um modelo externo.

| 01 · Diamante & Creeper (`Kling`) | 02 · Cabana com Lampião (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| [<img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="235" alt="Case 01" />](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) | [<img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="235" alt="Case 02" />](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) | [<img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="235" alt="Case 03" />](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) |
| [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Storyboard](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [Prompts](../../examples/diamond-creeper-ambush/) | [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Storyboard](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [Prompts](../../examples/cozy-lantern-build/) | [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Storyboard](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [Prompts](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Cadeia de Pistões (`Wan`)** | **05 · Enderman & Bloco de Grama (`Sora`)** | **06 · Axolote na Chuva (`Runway`)** |
| [<img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="235" alt="Case 04" />](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) | [<img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="235" alt="Case 05" />](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) | [<img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="235" alt="Case 06" />](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) |
| [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Storyboard](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [Prompts](../../examples/redstone-chain-asmr/) | [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Storyboard](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [Prompts](../../examples/enderman-block-heist/) | [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Storyboard](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [Prompts](../../examples/axolotl-rainy-shelter/) |

## Loops de blocos e itens

Para planos focados em objetos e mecanismos redstone, a skill preserva dobradiças de baús, minérios emissivos e ferramentas extrudadas `16x16x1` em degraus:

| Baú Articulado & Ferramentas `16x16x1` | Pistão Grudento & Lâmpada Redstone | `TNT` Ativado & Fumaça Cúbica |
| :---: | :---: | :---: |
| [<img src="../../assets/showcase/chest_loot_loop.gif" width="255" alt="Chest loot loop" />](../../assets/showcase/chest_loot_loop.mp4) | [<img src="../../assets/showcase/piston_ore_loop.gif" width="255" alt="Sticky piston loop" />](../../assets/showcase/piston_ore_loop.mp4) | [<img src="../../assets/showcase/tnt_blast_loop.gif" width="255" alt="TNT blast loop" />](../../assets/showcase/tnt_blast_loop.mp4) |
| Baú `14x14x14` + picareta e espada ([MP4](../../assets/showcase/chest_loot_loop.mp4)) | Pistão `16x16x16` + minério brilhante ([MP4](../../assets/showcase/piston_ore_loop.mp4)) | Pulso branco + cubos de fumaça ([MP4](../../assets/showcase/tnt_blast_loop.mp4)) |

## Início rápido

Clone na sua pasta local de Skills (compatível com Codex, GitHub Copilot, Claude Code e Cursor):

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

Ou execute a CLI diretamente no Node.js 18+ sem pacotes externos:

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang pt
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang pt
node scripts/drift_check.mjs --prompt "A cute Minecraft boy holding a round metal sword with five fingers mines ore and runs away" --engine kling --mode t2v --lang pt
```

## Scripts, limites e referências

Ancore sequências I2V com uma [prancha em três vistas](../../assets/showcase/steve_alex_turnaround_sheet.en.png) e limite cada clipe de 4 a 5 segundos a uma ação principal ([comparação anti-desvio](../../assets/showcase/drift_rescue_comparison.en.png) · [fluxo de trabalho](../pipeline.svg)).

- [`voxel_spec.mjs`](../../scripts/voxel_spec.mjs) · [`shot_compiler.mjs`](../../scripts/shot_compiler.mjs) · [`drift_check.mjs`](../../scripts/drift_check.mjs) · [`render_preview.mjs`](../../scripts/render_preview.mjs)
- [Guia da Skill (`SKILL.md`)](../../SKILL.md) · [Geometria voxel e blocos](../../references/voxel-geometry-blocks-and-shaders.md) · [Manual de prompts](../../references/model-prompt-playbook.md) · [Correções de desvio](../../references/rescue-and-anti-drift.md) · [Ritmo e áudio](../../references/short-video-beats-and-audio.md) · [Modelos de roteiro](../../references/viral-archetypes-catalog.md)

[Licença MIT](../../LICENSE). Projeto independente, sem afiliação ou endosso da Mojang Studios ou Microsoft.
