# Minecraft Character & Voxel Object DNA Card / 角色与方块设定卡: Enderman

- **Archetype**: `enderman-mob` (抱草方块的末影人 (Tall Enderman Mob))
- **Pixel Rig**: `mob-enderman` (Tall Enderman Voxel Rig / 末影人3格高修长像素骨架 (8x8x8 Head + 8x12x4 Torso + 2x30x2 Limbs))
- **Featured Voxel Block / Prop**: `grass-block` (16×16×16 经典草方块 (Grass Block), `16 × 16 × 16 pixels (1.0m³ full cube)`)
- **Extruded Held Item**: `none` (空手标准方块姿态 (Empty Square Block Hands))
- **Shader Style**: `bsl-sunlight` (BSL / Complementary Shaders (体积暖阳与方块光源渲染))
- **Color Swatches**: Skin `Obsidian Pitch Black #111827` · Primary `Void Charcoal #1F2937` · Secondary `Ender Eye Magenta #D946EF` · Accent `Portal Particle Purple #A855F7`

## 3-View Turnaround Prompt / 三视图提示词 (EN)
```text
Character turnaround reference sheet of "Enderman", an authentic Minecraft voxel figure shown in three full-body views side by side: 0-degree front view, 45-degree three-quarter view, and 90-degree side profile view. Voxel geometry lock: canonical 3-block-tall Minecraft Enderman voxel geometry: sharp 8x8x8 cubic head with separable jaw shell, 8x12x4 torso, and ultra-thin 2x30x2 rectangular stick arms and legs with sharp 90-degree corners. 3D outer skin shell: separable 8x8x8 cubic jaw/head shell that shifts vertically when startled, surrounded by floating square purple portal particles. Face & texel lock: flat black 8x8 front face with glowing emissive magenta-purple 3x1 pixel eyes, crisp unfiltered 16x16 nearest-neighbor pixel textures, zero bilinear blur. Outfit & held item: 8x12x4 black voxel torso with long thin 2x30x2 stick-like rectangular prism arms and legs holding a 16x16x16 grass block, with empty fingerless flat square pixel-block hand ends clearly visible, standing on a canonical 16x16x16 Minecraft grass and stone block platform. Shader & lighting: Minecraft BSL and Complementary Shaders aesthetic: warm volumetric sunlight god-rays, soft voxel contact shadows, emissive block-light bounce, while keeping every 16x16 and 8x8 pixel texel razor-sharp with nearest-neighbor filtering, clean studio backdrop, consistent pixel scale across all three views.
```

## Isometric Object Prompt / 方块提示词 (EN)
```text
Isometric 45-degree macro product render of a canonical 16x16x16 Minecraft Grass Block with lush green 16x16 top pixel texels, stepped 2-to-5 pixel green grass overhang along the upper side edges, and rich brown dirt pixel grid below, paired with Empty Flat Square Pixel-Block Hands. Grid accuracy: 16 × 16 × 16 pixels (1.0m³ full cube), sharp 90-degree voxel edges, crisp nearest-neighbor 16x16 pixel-art texels, Minecraft BSL and Complementary Shaders aesthetic: warm volumetric sunlight god-rays, soft voxel contact shadows, emissive block-light bounce, while keeping every 16x16 and 8x8 pixel texel razor-sharp with nearest-neighbor filtering, no rounded Lego studs, no blurry textures.
```

## 角色三视图生成提示词 (ZH)
```text
《我的世界》角色三视图参考设定卡（角色名："Enderman"），并排展示全身 0° 正视图、45° 斜侧视图与 90° 正侧视图。像素几何锁定：正统3格高《我的世界》末影人像素骨架：8x8x8可张合直角立方体头壳、8x12x4躯干与2x30x2修长细方柱四肢。双层3D皮肤外层：可上下张开的8x8x8纯黑直角立方体头壳，周身环绕悬浮的正方形紫色末影粒子。五官与像素网格锁定：纯黑8x8正面脸部嵌有自发光紫红色3x1像素眼睛，全身与方块严格保持清晰无模糊的16x16邻近采样像素网格。穿搭与手持道具：8x12x4纯黑像素躯干配修长纤细的2x30x2细方柱四肢，双手抱持一块16x16x16标准草方块，保持空手状态，清晰展现无手指无钩爪的平头正方形像素手部截面，脚踩标准16x16x16草方块与石砖底座。光影与渲染：Minecraft BSL/Complementary光影画风：温暖体积光丁达尔射线、柔和方块接触阴影与温暖方块光源漫反射，同时保持每一格16x16与8x8像素贴图边缘锋利无模糊，干净摄影棚背景，三个视角比例与像素网格完全一致。
```

## 方块与道具等距特写提示词 (ZH)
```text
45度等距微缩特写渲染：标准16x16x16像素《我的世界》草方块（顶面为翠绿16x16像素网格，四侧上方带2至5像素高低错落的阶梯状草皮下垂边缘，下方为棕褐色泥土像素网格），搭配空手标准方块姿态 (Empty Square Block Hands)。网格精度：16 × 16 × 16 pixels (1.0m³ full cube)，90度锋利直角体素边缘，清晰无模糊的16x16邻近采样像素贴图，Minecraft BSL/Complementary光影画风：温暖体积光丁达尔射线、柔和方块接触阴影与温暖方块光源漫反射，同时保持每一格16x16与8x8像素贴图边缘锋利无模糊，严禁乐高凸粒或贴图模糊。
```

## Anti-Drift Negative Prompt / 负向防串味词
```text
human fingers, five fingers, realistic human hands, knuckles, blurry bilinear textures, smudged pixel art, anti-aliased soft gradients, Roblox cylindrical barrel head, rounded toy head, Lego top head studs, cylindrical Lego pegs, Lego C-shaped claw hands, smooth cylindrical metal sword, realistic curved pickaxe blade, 3D protruding human nose, realistic eyeballs, rubbery noodle limbs, watermark
人类五指，真实人手，手指关节，贴图模糊涂抹，双线性插值糊化，Roblox圆桶圆柱头，圆润盲盒头，乐高头顶圆柱凸粒，乐高C型夹爪手，圆滑金属剑刃，圆棍镐柄，3D凸起高鼻梁，真实眼球，橡胶面条状弯曲四肢，水印文字
```
