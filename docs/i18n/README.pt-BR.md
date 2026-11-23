# minecraft-style-video

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Português** · [Русский](README.ru.md)

Gere vídeos curtos verticais 9:16 de personagens, criaturas e blocos no estilo Minecraft com geometria voxel `8x8x8` e `16x16x16` travada e prompts específicos por modelo.

Prompts genéricos como "personagem de Minecraft minerando diamantes" costumam gerar cinco dedos humanos, texturas borradas, picaretas cilíndricas lisas ou cabeças arredondadas estilo Roblox com garras de Lego. `minecraft-style-video` trava as proporções antes da animação: cabeça cúbica `8x8x8` com camada externa 3D `+0.5px`, tronco `8x12x4`, braços `4x12x4` (Steve) ou `3x12x4` (Alex) com pontas quadradas planas, blocos `16x16x16` nítidos, baús articulados `14x14x14` e ferramentas extrudadas `16x16x1`.

![Fluxo de trabalho em cinco etapas](../pipeline.svg)

## Início rápido

Clone o repositório na sua pasta local de Skills (compatível com Claude Code, Codex, Cursor e GitHub Copilot):

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

Os quatro scripts CLI exigem apenas a biblioteca padrão do Node.js 18+; o `ffmpeg` só é necessário ao renderizar novamente `.gif` e `.mp4` localmente.

```text
Use $minecraft-style-video para planejar um curta isométrico 9:16 de 15 segundos em que a Alex
encaixa uma bancada, um baú e um lampião brilhante em uma cabana de blocos de grama ao lado de um axolote rosa, com 4 planos para Kling I2V.
```

## Prévia visual e 6 exemplos de vídeos curtos

| Referência em 3 vistas (`0° / 45° / 90°`) | Verificação anti-desvio (`× Drift` vs. `✓ Locked`) |
| :---: | :---: |
| <img src="../../assets/showcase/steve_alex_turnaround_sheet.en.png" width="410" alt="Turnaround" /> | <img src="../../assets/showcase/drift_rescue_comparison.en.png" width="410" alt="Drift check" /> |

| 01 · Diamante & Creeper (`Kling`) | 02 · Cabana com Lampião (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| <img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="165" alt="Case 01" /> | <img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="165" alt="Case 02" /> | <img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="165" alt="Case 03" /> |
| [Folha](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Pacote](../../examples/diamond-creeper-ambush/) | [Folha](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Pacote](../../examples/cozy-lantern-build/) | [Folha](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Pacote](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Cadeia de Pistões (`Wan`)** | **05 · Enderman & Bloco de Grama (`Sora`)** | **06 · Axolote na Chuva (`Runway`)** |
| <img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="165" alt="Case 04" /> | <img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="165" alt="Case 05" /> | <img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="165" alt="Case 06" /> |
| [Folha](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Pacote](../../examples/redstone-chain-asmr/) | [Folha](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Pacote](../../examples/enderman-block-heist/) | [Folha](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Pacote](../../examples/axolotl-rainy-shelter/) |

## Biblioteca clássica de personagens e blocos

Pré-renderizada em [`assets/library/catalog.json`](../../assets/library/catalog.json) e documentada em [`references/classic-minecraft-catalog.md`](../../references/classic-minecraft-catalog.md):

| Classic Steve | Slim Alex | Diamond Knight | Cozy Hoodie | Creeper | Enderman |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="../../assets/library/characters/char_steve.png" width="112" alt="Steve" /> | <img src="../../assets/library/characters/char_alex.png" width="112" alt="Alex" /> | <img src="../../assets/library/characters/char_knight.png" width="112" alt="Diamond Knight" /> | <img src="../../assets/library/characters/char_hoodie.png" width="112" alt="Cozy Hoodie" /> | <img src="../../assets/library/characters/mob_creeper.png" width="112" alt="Creeper" /> | <img src="../../assets/library/characters/mob_enderman.png" width="112" alt="Enderman" /> |

| Grass Block | Diamond Ore | TNT Block | Crafting Table | Hinged Chest | Sticky Piston | Pickaxe | Sword |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="../../assets/library/objects/block_grass.png" width="82" alt="Grass" /> | <img src="../../assets/library/objects/block_diamond_ore.png" width="82" alt="Ore" /> | <img src="../../assets/library/objects/block_tnt.png" width="82" alt="TNT" /> | <img src="../../assets/library/objects/block_crafting_table.png" width="82" alt="Table" /> | <img src="../../assets/library/objects/prop_chest.png" width="82" alt="Chest" /> | <img src="../../assets/library/objects/prop_piston.png" width="82" alt="Piston" /> | <img src="../../assets/library/objects/item_diamond_pickaxe.png" width="82" alt="Pickaxe" /> | <img src="../../assets/library/objects/item_diamond_sword.png" width="82" alt="Sword" /> |

## Ferramentas CLI e escopo

- [`scripts/voxel_spec.mjs`](../../scripts/voxel_spec.mjs): gera fichas DNA de personagens, criaturas e blocos com prompts em 3 vistas e isométricos.
- [`scripts/shot_compiler.mjs`](../../scripts/shot_compiler.mjs): compila storyboards 9:16 para `kling`, `seedance`, `hailuo`, `wan`, `sora` e `runway`.
- [`scripts/drift_check.mjs`](../../scripts/drift_check.mjs): verifica dedos humanos, ferramentas cilíndricas, borrão de pixels e excesso de ações.
- [`scripts/render_preview.mjs`](../../scripts/render_preview.mjs): renderiza localmente pranchas 3D, miniaturas e prévias `.gif` / `.mp4`.

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang pt
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang pt
```

Os arquivos `.gif` e `.mp4` incluídos são prévias 3D locais determinísticas; a geração final de vídeo exige um modelo externo. Limite cada clipe de 4 a 5 segundos a uma ação principal. Licença MIT ([LICENSE](../../LICENSE)), sem afiliação com a Mojang Studios ou Microsoft. Veja [`SKILL.md`](../../SKILL.md).
