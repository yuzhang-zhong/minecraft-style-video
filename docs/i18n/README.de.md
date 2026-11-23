# minecraft-style-video

[English](../../README.md) · [简体中文](../../README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · **Deutsch** · [Português](README.pt-BR.md) · [Русский](README.ru.md)

Erstellt vertikale 9:16-Kurzvideos im Minecraft-Stil für Charaktere, Mobs und Blöcke mit fest verankerter `8x8x8`- und `16x16x16`-Voxel-Geometrie sowie modellspezifischen Prompts.

Allgemeine Prompts wie „Minecraft-Figur baut Diamanten ab“ führen bei Videomodellen häufig zu fünf menschlichen Fingern, verwaschenen Texturen, runden Metallspitzhacken oder zylindrischen Roblox-Köpfen mit Lego-Greifhänden. `minecraft-style-video` legt die Proportionen vor der Animation fest: scharfkantiger `8x8x8`-Würfelkopf mit `+0.5px` 3D-Außenschicht, `8x12x4`-Torso, `4x12x4`- (Steve) oder `3x12x4`-Arme (Alex) mit flachen quadratischen Handenden, ungefilterte `16x16x16`-Blöcke, aufklappbare `14x14x14`-Truhen und extrudierte `16x16x1`-Pixelwerkzeuge.

![Fünfstufiger Workflow](../pipeline.svg)

## Schnellstart

Repository in das lokale Skills-Verzeichnis klonen (kompatibel mit Claude Code, Codex, Cursor und GitHub Copilot):

```bash
git clone https://github.com/yuzhang-zhong/minecraft-style-video.git ~/.codex/skills/minecraft-style-video
```

Alle vier CLI-Skripte benötigen nur die Node.js-18+-Standardbibliothek; `ffmpeg` wird nur zum lokalen Neurendern von `.gif` und `.mp4` benötigt.

```text
Nutze $minecraft-style-video für ein 15-sekündiges isometrisches 9:16-Kurzvideo, in dem Alex
Werkbank, Truhe und leuchtende Laterne auf einer Grasblock-Hütte neben einem rosa Axolotl platziert, inklusive 4-Shot-Storyboard für Kling I2V.
```

## Vorschau & 6 Kurzvideo-Beispiele

| 3-Ansichten-Referenz (`0° / 45° / 90°`) | Anti-Drift-Geometrieprüfung (`× Drift` vs. `✓ Locked`) |
| :---: | :---: |
| <img src="../../assets/showcase/steve_alex_turnaround_sheet.en.png" width="410" alt="Turnaround" /> | <img src="../../assets/showcase/drift_rescue_comparison.en.png" width="410" alt="Drift check" /> |

| 01 · Diamant & Creeper (`Kling`) | 02 · Laternen-Hütte (`Seedance`) | 03 · Pro vs. Noob TNT (`Hailuo`) |
| :---: | :---: | :---: |
| <img src="../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.gif" width="165" alt="Case 01" /> | <img src="../../examples/cozy-lantern-build/assets/cozy_lantern_build.gif" width="165" alt="Case 02" /> | <img src="../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.gif" width="165" alt="Case 03" /> |
| [Bogen](../../examples/diamond-creeper-ambush/assets/storyboard_contact_sheet.en.png) · [MP4](../../examples/diamond-creeper-ambush/assets/diamond_creeper_ambush.mp4) · [Paket](../../examples/diamond-creeper-ambush/) | [Bogen](../../examples/cozy-lantern-build/assets/cozy_storyboard_sheet.en.png) · [MP4](../../examples/cozy-lantern-build/assets/cozy_lantern_build.mp4) · [Paket](../../examples/cozy-lantern-build/) | [Bogen](../../examples/pro-builder-vs-noob-tnt/assets/tnt_storyboard_sheet.en.png) · [MP4](../../examples/pro-builder-vs-noob-tnt/assets/pro_builder_vs_noob_tnt.mp4) · [Paket](../../examples/pro-builder-vs-noob-tnt/) |
| **04 · Redstone-Kolbenkette (`Wan`)** | **05 · Enderman & Grasblock (`Sora`)** | **06 · Rosa Axolotl im Regen (`Runway`)** |
| <img src="../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.gif" width="165" alt="Case 04" /> | <img src="../../examples/enderman-block-heist/assets/enderman_block_heist.gif" width="165" alt="Case 05" /> | <img src="../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.gif" width="165" alt="Case 06" /> |
| [Bogen](../../examples/redstone-chain-asmr/assets/redstone_storyboard_sheet.en.png) · [MP4](../../examples/redstone-chain-asmr/assets/redstone_chain_asmr.mp4) · [Paket](../../examples/redstone-chain-asmr/) | [Bogen](../../examples/enderman-block-heist/assets/enderman_storyboard_sheet.en.png) · [MP4](../../examples/enderman-block-heist/assets/enderman_block_heist.mp4) · [Paket](../../examples/enderman-block-heist/) | [Bogen](../../examples/axolotl-rainy-shelter/assets/axolotl_storyboard_sheet.en.png) · [MP4](../../examples/axolotl-rainy-shelter/assets/axolotl_rainy_shelter.mp4) · [Paket](../../examples/axolotl-rainy-shelter/) |

## Klassische Minecraft-Asset-Bibliothek

Vorgerendert in [`assets/library/catalog.json`](../../assets/library/catalog.json) und dokumentiert in [`references/classic-minecraft-catalog.md`](../../references/classic-minecraft-catalog.md):

| Classic Steve | Slim Alex | Diamond Knight | Cozy Hoodie | Creeper | Enderman |
| :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="../../assets/library/characters/char_steve.png" width="112" alt="Steve" /> | <img src="../../assets/library/characters/char_alex.png" width="112" alt="Alex" /> | <img src="../../assets/library/characters/char_knight.png" width="112" alt="Diamond Knight" /> | <img src="../../assets/library/characters/char_hoodie.png" width="112" alt="Cozy Hoodie" /> | <img src="../../assets/library/characters/mob_creeper.png" width="112" alt="Creeper" /> | <img src="../../assets/library/characters/mob_enderman.png" width="112" alt="Enderman" /> |

| Grass Block | Diamond Ore | TNT Block | Crafting Table | Hinged Chest | Sticky Piston | Pickaxe | Sword |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| <img src="../../assets/library/objects/block_grass.png" width="82" alt="Grass" /> | <img src="../../assets/library/objects/block_diamond_ore.png" width="82" alt="Ore" /> | <img src="../../assets/library/objects/block_tnt.png" width="82" alt="TNT" /> | <img src="../../assets/library/objects/block_crafting_table.png" width="82" alt="Table" /> | <img src="../../assets/library/objects/prop_chest.png" width="82" alt="Chest" /> | <img src="../../assets/library/objects/prop_piston.png" width="82" alt="Piston" /> | <img src="../../assets/library/objects/item_diamond_pickaxe.png" width="82" alt="Pickaxe" /> | <img src="../../assets/library/objects/item_diamond_sword.png" width="82" alt="Sword" /> |

## CLI-Werkzeuge und Grenzen

- [`scripts/voxel_spec.mjs`](../../scripts/voxel_spec.mjs): erzeugt Charakter-, Mob- und Block-DNA-Karten sowie 3-Ansichten- und Isometrie-Prompts.
- [`scripts/shot_compiler.mjs`](../../scripts/shot_compiler.mjs): kompiliert 9:16-Storyboards für `kling`, `seedance`, `hailuo`, `wan`, `sora` und `runway`.
- [`scripts/drift_check.mjs`](../../scripts/drift_check.mjs): prüft Prompts auf menschliche Finger, runde Werkzeuge, Texturunschärfe und Aktionsüberladung.
- [`scripts/render_preview.mjs`](../../scripts/render_preview.mjs): rendert lokale 3D-Voxel-Bögen, Vorschaubilder sowie `.gif`- und `.mp4`-Clips.

```bash
node scripts/voxel_spec.mjs --archetype steve-miner --object diamond-ore --held-item diamond-pickaxe --lang de
node scripts/shot_compiler.mjs --template diamond-creeper-ambush --duration 15 --engine kling --lang de
```

Die enthaltenen `.gif`- und `.mp4`-Dateien sind deterministische lokale 3D-Vorschauen; für das fertige Video ist ein externes Videomodell erforderlich. Pro 4–5-Sekunden-Clip nur eine Hauptaktion planen. MIT-Lizenz ([LICENSE](../../LICENSE)), unabhängig von Mojang Studios und Microsoft. Siehe [`SKILL.md`](../../SKILL.md).
