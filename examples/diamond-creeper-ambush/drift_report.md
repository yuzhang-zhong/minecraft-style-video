# Minecraft Prompt Anti-Drift Report (FAIL)

- **Engine**: `kling` · **Mode**: `T2V`
- **Original Prompt**: `A cute Minecraft boy holding a round metal pickaxe with five fingers mines a diamond block and then turns around and runs away from a Creeper`

| Gate | Status | Diagnosis |
| --- | :---: | --- |
| Hand & Extruded Tool Lock / 平头方手与16x16x1像素道具锁 | **FAIL** | 提示词易触发真人五指或圆滑写实武器，缺少「4x4平头正方形像素手」与「16x16x1阶梯锯齿立体像素工具」锁定。 (Prompt triggers human fingers or smooth non-voxel tools without locking `flat 4x4 square pixel-block hand ends` and `extruded 16x16x1 stepped pixel-art tool`.) |
| 8x8 Pixel Face & 3D Skin Layer Lock / 8x8像素脸与0.5px外层皮肤锁 | **WARN** | 包含拟人或情绪词但未锁定「8x8x8直角立方体头 + 纯平8x8像素五官 + 0.5px悬浮3D立体刘海层」，易长出3D真人鼻梁。 (Human-gendered or emotional words without `sharp 8x8x8 cubic head, flat 8x8 pixel face, +0.5px 3D outer hair layer, zero 3D nose` risk morphing into a human face.) |
| 16x16 Nearest-Neighbor & Anti-Roblox/Lego Guard / 像素防糊化与防串味锁 | **WARN** | 缺少「清晰16x16邻近像素贴图、90度直角体素边缘」描述，模型可能将像素块涂抹模糊或圆角化。 (Missing `crisp 16x16 nearest-neighbor pixel-art textures, sharp 90-degree voxel corners`; model may blur block textures or round off cube edges.) |
| Single-Action Clip Budget / 单镜头动作容量 | **FAIL** | 检测到单镜头动作超载（识别到 3 个动作词、1 处先后连接词）。请拆分为独立分镜，每镜仅保留 1 个核心动作。 (Detected multi-step action chain (3 verbs, 1 connectors). Keep each 4-5s clip to ONE primary voxel action.) |
| Rigid Voxel Hinge & I2V Anchor / 刚性像素转轴与首帧锚定 | **WARN** | 当前为纯文生视频(T2V)，多镜头易导致像素贴图变形；建议改用首帧I2V并声明「刚性长方体转轴四肢」。 (Raw T2V risks pixel grid smudging across cuts; prefer First-Frame I2V with `rigid rectangular prism limbs`.) |

## Rescued Prompt (English)
```text
[KLING I2V] An authentic Minecraft voxel character with a sharp 90-degree 8x8x8 cubic head, +0.5px raised 3D outer hair layer, flat 8x8 nearest-neighbor pixel face (2x1 sliding pixel eyes, zero 3D nose), 8x12x4 rectangular prism torso, and rigid 4x12x4 rectangular prism limbs ending in fingerless and clawless flat 4x4 square pixel-block hands. Core single action: A cute Minecraft boy holding a round metal pickaxe with fingerless flat 4x4 square pixel-block hand ends mines a diamond block. Crisp unfiltered 16x16 nearest-neighbor pixel textures, Minecraft BSL shader sunlight and warm block light, cubic pixel particles, no human fingers, no blurry bilinear textures, no Roblox cylinder head, no Lego studs.
```

## 救场重写提示词 (中文)
```text
【KLING 首帧I2V救场版】纯正《我的世界》像素方块小人（90度锋利直角8x8x8像素立方体头、+0.5px外层悬浮3D立体刘海层、纯平8x8邻近像素五官贴图、8x12x4长方体躯干、刚性4x12x4长方体四肢配无手指无钩爪的4x4平头正方形像素手截面），握持16x16x1阶梯锯齿立体像素工具。单镜头仅执行 1 个核心刚性转轴动作并迸发正方形像素粒子；全程保持清晰无模糊的16x16邻近采样像素网格与BSL体积光影，严禁出现人类五指、圆滑金属武器、贴图模糊、Roblox圆桶头或乐高头顶颗粒。
```
