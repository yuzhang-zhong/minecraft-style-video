#!/usr/bin/env node
/**
 * voxel_spec.mjs
 * Zero-dependency CLI generator for Minecraft-style character, mob, and voxel block/item DNA cards,
 * 3-view turnaround sheet prompts, and isometric voxel object reference prompts.
 */

import { fileURLToPath } from "node:url";

const ARCHETYPES = {
  "steve-miner": {
    labelZh: "经典矿工史蒂夫 (Classic Wide Steve Miner)",
    labelEn: "Canonical Minecraft Steve Miner (4px Wide Arms)",
    defaultRig: "steve-wide",
    defaultObject: "diamond-ore",
    defaultHeldItem: "diamond-pickaxe",
    defaultShader: "bsl-sunlight",
    skinTone: "Warm Pixel Tan #C68664",
    primaryColor: "Cyan Tunic #00AAAA",
    secondaryColor: "Indigo Trousers #3B3B8F",
    accentColor: "Diamond Cyan #4AEDD9",
    skinLayerEn: "raised +0.5px 3D dark-brown pixel hair bangs layer on the 8x8x8 cubic head, +0.25px rolled cyan sleeve cuffs",
    skinLayerZh: "8x8x8直角立方体头外层悬浮+0.5px厚度的深棕3D像素刘海层，袖口带+0.25px外层立体卷边",
    outfitEn: "canonical cyan pixel tunic on an 8x12x4 rectangular prism torso, indigo-blue 4x12x4 rectangular prism leg blocks sitting flush side-by-side with dark grey pixel boots",
    outfitZh: "经典青色像素短衫（8x12x4长方体躯干）、靛蓝色并拢齐平的4x12x4长方体裤腿配深灰像素靴底",
    faceEn: "flat 8x8 nearest-neighbor pixel face with 2x1 white sclera, indigo 1x1 sliding pupil pixels, floating 2x1 pixel brows, and classic pixel beard/smile, zero 3D human nose",
    faceZh: "纯平8x8邻近采样像素五官（2x1像素眼白+1x1靛蓝滑动瞳孔+2x1悬浮像素眉毛与经典像素嘴型，无3D突起真人鼻梁）"
  },
  "alex-builder": {
    labelZh: "森系建筑师艾莉克斯 (Slim 3px Alex Builder)",
    labelEn: "Minecraft Alex Voxel Architect (3px Slim Arms)",
    defaultRig: "alex-slim",
    defaultObject: "crafting-table",
    defaultHeldItem: "lantern-torch",
    defaultShader: "bsl-sunlight",
    skinTone: "Ivory Pixel Peach #F3C6A5",
    primaryColor: "Moss Green Tunic #5E8C42",
    secondaryColor: "Chestnut Boots #6B4C35",
    accentColor: "Lantern Gold #F59E0B",
    skinLayerEn: "raised +0.5px 3D ginger side-ponytail hair layer and cream pixel beret on the 8x8x8 cubic head, +0.25px leather utility belt overlay on torso",
    skinLayerZh: "8x8x8立方体头外层悬浮+0.5px厚度的橘红3D像素侧马尾与奶油色像素贝雷帽层，腰间带+0.25px立体工具腰带外层",
    outfitEn: "moss-green pixel builder tunic on an 8x12x4 torso, slim 3x12x4 rectangular prism arms, brown 4x12x4 leg blocks flush side-by-side",
    outfitZh: "森系苔绿像素建筑师上衣（8x12x4躯干）、3x12x4纤细版长方体手臂、棕褐并拢4x12x4方柱裤腿",
    faceEn: "flat 8x8 pixel face with Fresh Animations style 2x1 white sclera, emerald-green 1x1 pupil pixels, and warm pixel smile",
    faceZh: "纯平8x8像素五官（Fresh Animations可动2x1眼白、翠绿1x1像素瞳孔与温暖像素微笑）"
  },
  "diamond-knight": {
    labelZh: "附魔钻石甲战神 (3D Diamond Armor Pro)",
    labelEn: "Enchanted Diamond Armor Knight (4px Wide Rig)",
    defaultRig: "steve-wide",
    defaultObject: "chest-hinged",
    defaultHeldItem: "diamond-sword",
    defaultShader: "rtx-emissive",
    skinTone: "Warm Pixel Tan #C68664",
    primaryColor: "Diamond Armor Cyan #4AEDD9",
    secondaryColor: "Netherite Dark Trim #37313B",
    accentColor: "Enchantment Glint #A855F7",
    skinLayerEn: "raised +0.6px 3D cubic Diamond Helmet shell with T-shaped nose guard and +0.4px 3D Diamond Chestplate shoulder pauldrons with subtle purple enchantment glint",
    skinLayerZh: "外层套有+0.6px厚度的3D立体钻石头盔方块壳与+0.4px钻石胸甲肩甲外层，泛着淡紫色附魔流光",
    outfitEn: "pixelated #4AEDD9 cyan diamond chestplate over an 8x12x4 torso, diamond greaves on flush 4x12x4 leg blocks",
    outfitZh: "8x12x4躯干覆盖亮青色#4AEDD9像素钻石胸甲，并拢4x12x4双腿包裹像素钻石护腿与战靴",
    faceEn: "confident 8x8 pixel face visible beneath the cubic diamond helmet visor with glowing cyan-tinted 2x1 pixel eyes",
    faceZh: "钻石头盔方形面罩下露出自信的8x8像素脸与高对比度2x1像素眼睛"
  },
  "cozy-hoodie": {
    labelZh: "小红书高赞治愈系卫衣小人 (Aesthetic 3D Hoodie Skin)",
    labelEn: "Aesthetic Pastel 3D-Layer Hoodie Skin (3px Slim Rig)",
    defaultRig: "alex-slim",
    defaultObject: "grass-block",
    defaultHeldItem: "golden-apple",
    defaultShader: "bsl-sunlight",
    skinTone: "Soft Cream Pixel #FAD6B8",
    primaryColor: "Matcha Cream Hoodie #86EFAC",
    secondaryColor: "Washed Denim Blocks #93C5FD",
    accentColor: "Blush Coral #FB7185",
    skinLayerEn: "fluffy +0.5px 3D espresso-brown pixel bob hair with front bangs, raised 3D white voxel headphones over ears, and +0.3px oversized hoodie pocket layer",
    skinLayerZh: "8x8x8立方体头外层悬浮+0.5px深棕3D像素波波头刘海与白色3D像素大耳机，躯干带+0.3px立体卫衣口袋外层",
    outfitEn: "oversized pastel-matcha pixel hoodie on an 8x12x4 torso, slim 3x12x4 sleeves, light denim 4x12x4 flush leg blocks with white pixel sneakers",
    outfitZh: "奶油抹茶绿像素连帽卫衣（8x12x4躯干）、3x12x4细方柱衣袖、浅牛仔蓝并拢4x12x4方柱裤腿配白像素鞋边",
    faceEn: "expressive 8x8 pixel face with cute 2x1 glossy pixel eyes, pink 1x1 cheek blush texels, and tiny pixel mouth",
    faceZh: "高表现力8x8像素脸（2x1像素灵动大眼、两侧1x1粉色腮红像素格与可爱小嘴）"
  },
  "creeper-mob": {
    labelZh: "原版苦力怕生物 (Canonical Creeper Mob)",
    labelEn: "Canonical Armless Quadruped Minecraft Creeper",
    defaultRig: "mob-quadruped",
    defaultObject: "tnt-block",
    defaultHeldItem: "none",
    defaultShader: "bsl-sunlight",
    skinTone: "Creeper Leaf Green #50B848",
    primaryColor: "Mottled Moss Pixel #3E8E38",
    secondaryColor: "Charcoal Pixel Face #111827",
    accentColor: "Primed Flash White #FFFFFF",
    skinLayerEn: "single-layer sharp cubic 8x8x8 head and 8x12x4 vertical body with zero arms and four short 4x6x4 legs at the base",
    skinLayerZh: "标准无手臂四足苦力怕结构（8x8x8直角立方体头、8x12x4竖直方柱躯干、零手臂、底部4条短小4x6x4方柱腿）",
    outfitEn: "unfiltered 16x16 mottled green and grey-green leaf-camouflage pixel texture across head, torso, and four short feet",
    outfitZh: "全身覆盖原版16x16深浅交错的绿叶迷彩邻近采样像素贴图",
    faceEn: "iconic 8x8 Creeper face with two 2x2 black pixel eye sockets and a downward-curving frowning black pixel mouth",
    faceZh: "标志性8x8苦力怕黑色像素脸（两个2x2黑色像素眼洞与向下撇的经典哭丧像素嘴）"
  },
  "enderman-mob": {
    labelZh: "抱草方块的末影人 (Tall Enderman Mob)",
    labelEn: "Canonical Tall Minecraft Enderman Holding Grass Block",
    defaultRig: "mob-enderman",
    defaultObject: "grass-block",
    defaultHeldItem: "none",
    defaultShader: "rtx-emissive",
    skinTone: "Obsidian Pitch Black #111827",
    primaryColor: "Void Charcoal #1F2937",
    secondaryColor: "Ender Eye Magenta #D946EF",
    accentColor: "Portal Particle Purple #A855F7",
    skinLayerEn: "separable 8x8x8 cubic jaw/head shell that shifts vertically when startled, surrounded by floating square purple portal particles",
    skinLayerZh: "可上下张开的8x8x8纯黑直角立方体头壳，周身环绕悬浮的正方形紫色末影粒子",
    outfitEn: "8x12x4 black voxel torso with long thin 2x30x2 stick-like rectangular prism arms and legs holding a 16x16x16 grass block",
    outfitZh: "8x12x4纯黑像素躯干配修长纤细的2x30x2细方柱四肢，双手抱持一块16x16x16标准草方块",
    faceEn: "flat black 8x8 front face with glowing emissive magenta-purple 3x1 pixel eyes",
    faceZh: "纯黑8x8正面脸部嵌有自发光紫红色3x1像素眼睛"
  },
  "axolotl-pet": {
    labelZh: "治愈系粉红美西螈宠物 (Pink Voxel Axolotl)",
    labelEn: "Leucistic Pink Minecraft Voxel Axolotl Pet",
    defaultRig: "mob-quadruped",
    defaultObject: "lantern-torch",
    defaultHeldItem: "none",
    defaultShader: "bsl-sunlight",
    skinTone: "Pastel Axolotl Pink #F9A8D4",
    primaryColor: "Rose Gill Magenta #EC4899",
    secondaryColor: "Cream Belly Pixel #FDF2F8",
    accentColor: "Heart Particle Red #F43F5E",
    skinLayerEn: "three flat 1px-thick stepped pixel external gill fronds extending from the top and left/right sides of the cubic head",
    skinLayerZh: "扁平立方体头部上方与左右两侧伸出三簇1像素厚度的锯齿像素外鳃羽冠",
    outfitEn: "horizontal 8x5x10 pink voxel amphibian body with four stubby pixel legs and a flat pixel-stepped swimming tail",
    outfitZh: "水平8x5x10淡粉像素躯干配四条短小像素腿与扁平锯齿像素尾鳍",
    faceEn: "adorable wide-set 1x1 dark berry pixel eyes and a flat 2x1 happy pixel smile line",
    faceZh: "宽距1x1深莓果色像素小眼点与治愈一字像素笑脸"
  }
};

const VOXEL_OBJECTS = {
  "diamond-ore": {
    labelZh: "16×16×16 发光钻石矿石方块 (Diamond Ore Block)",
    labelEn: "Canonical 16x16x16 Minecraft Diamond Ore Block",
    gridSize: "16 × 16 × 16 pixels (1.0m³ full cube)",
    objectPromptEn:
      "a canonical 16x16x16 Minecraft Diamond Ore block with sharp 90-degree cubic corners, grey stone nearest-neighbor pixel matrix embedded with glowing cyan (#4AEDD9) and white pixel clusters, zero bevels, zero bilinear blur",
    objectPromptZh:
      "标准16x16x16像素《我的世界》钻石矿石正方体方块（90度锋利直角边缘，灰岩邻近采样像素基底上镶嵌自发光亮青色#4AEDD9与白色钻石像素簇，无圆角、无模糊涂抹）"
  },
  "grass-block": {
    labelZh: "16×16×16 经典草方块 (Grass Block)",
    labelEn: "Canonical 16x16x16 Minecraft Grass Block",
    gridSize: "16 × 16 × 16 pixels (1.0m³ full cube)",
    objectPromptEn:
      "a canonical 16x16x16 Minecraft Grass Block with lush green 16x16 top pixel texels, stepped 2-to-5 pixel green grass overhang along the upper side edges, and rich brown dirt pixel grid below",
    objectPromptZh:
      "标准16x16x16像素《我的世界》草方块（顶面为翠绿16x16像素网格，四侧上方带2至5像素高低错落的阶梯状草皮下垂边缘，下方为棕褐色泥土像素网格）"
  },
  "tnt-block": {
    labelZh: "16×16×16 红白TNT炸药块 (TNT Voxel Block)",
    labelEn: "Canonical 16x16x16 Minecraft TNT Block",
    gridSize: "16 × 16 × 16 pixels (1.0m³ full cube)",
    objectPromptEn:
      "a canonical 16x16x16 Minecraft TNT block with vertical red and orange dynamite stick pixel stripes, a crisp 4-pixel-tall white horizontal center band printed with black pixel letters 'TNT', and a grey pixel fuse square on top",
    objectPromptZh:
      "标准16x16x16像素《我的世界》TNT炸药方块（上下为红橙相间的竖条炸药筒像素格，中间环绕4像素高的白色横带并印有黑色像素字体TNT，顶面中央带灰黑引信像素格）"
  },
  "crafting-table": {
    labelZh: "16×16×16 橡木工作台方块 (Crafting Table)",
    labelEn: "Canonical 16x16x16 Minecraft Crafting Table",
    gridSize: "16 × 16 × 16 pixels (1.0m³ full cube)",
    objectPromptEn:
      "a canonical 16x16x16 Minecraft Crafting Table block featuring a 3x3 crafting grid pixel pattern on the top face and pixelated iron saw, hammer, and pliers hanging on oak plank side faces",
    objectPromptZh:
      "标准16x16x16像素《我的世界》工作台方块（顶面绘有清晰的3x3合成格像素纹理，侧面橡木板像素基底上绘有像素锯子、铁锤与钳子挂件）"
  },
  "chest-hinged": {
    labelZh: "14×14×14 可开合银锁储物箱 (Hinged Voxel Chest)",
    labelEn: "Canonical 14x14x14 Hinged Minecraft Wooden Chest",
    gridSize: "14 × 14 × 14 pixels (hinged lid at y=10px + 2×4×1 silver front latch)",
    objectPromptEn:
      "a canonical 14x14x14 Minecraft oak chest block with dark pixel border trim, a hinged top lid seam at 10 pixels height, and a protruding 3D silver (#CBD5E1) 2x4 pixel lock latch on the front face",
    objectPromptZh:
      "标准14x14x14像素《我的世界》橡木储物箱（深色像素包边，距底10像素处带可开合箱盖接缝，正面中央凸起一块2x4像素的3D银白色#CBD5E1金属锁扣）"
  },
  "lantern-torch": {
    labelZh: "发光像素火把与灯笼 (Emissive Voxel Torch & Lantern)",
    labelEn: "Canonical 2x10x2 Emissive Minecraft Torch & Voxel Lantern",
    gridSize: "2 × 10 × 2 pixels (Torch) / 6 × 9 × 6 pixels (Lantern)",
    objectPromptEn:
      "a canonical 2x10x2 pixel Minecraft oak torch and 6x9x6 iron-framed voxel lantern with an emissive glowing amber-gold (#F59E0B) cubic core casting warm block-light across surrounding 16x16 pixel surfaces",
    objectPromptZh:
      "标准2x10x2像素《我的世界》木柄火把与6x9x6像素铁框灯笼（顶端与内芯为自发光琥珀金#F59E0B正方体像素火苗，向四周16x16像素表面投射温暖方块光源）"
  },
  "redstone-piston": {
    labelZh: "16×16×16 红石粘性活塞机关 (Sticky Piston & Redstone)",
    labelEn: "Canonical 16x16x16 Minecraft Sticky Piston & Glowing Redstone",
    gridSize: "16 × 16 × 16 pixels (Cobblestone base + 4px extendable wooden head)",
    objectPromptEn:
      "a canonical 16x16x16 Minecraft sticky piston with a cobblestone pixel base, green slime pixel dots on its 4-pixel-thick wooden plunger head, and glowing crimson (#EF4444) redstone dust lines on the floor",
    objectPromptZh:
      "标准16x16x16像素《我的世界》粘性活塞（圆石像素底座配涂有绿色史莱姆像素点的4像素厚木质推板，地面铺设自发光暗红#EF4444红石粉像素线）"
  },
  "enchanted-table": {
    labelZh: "16×12×16 黑曜石附魔台 (Enchanting Table)",
    labelEn: "Canonical 16x12x16 Minecraft Enchanting Table with Floating Book",
    gridSize: "16 × 12 × 16 pixels + floating 3D pixel book",
    objectPromptEn:
      "a canonical 16x12x16 Minecraft Enchanting Table with dark purple-black obsidian pixel base, glowing cyan diamond corner inlays, red pixel cloth drape, and a floating open 3D pixel book on top",
    objectPromptZh:
      "标准16x12x16像素《我的世界》附魔台（黑曜石像素底座、四角镶嵌亮青色钻石像素格、红色像素桌布，上方悬浮一本自动翻页的3D像素书）"
  }
};

const HELD_ITEMS = {
  "diamond-pickaxe": {
    labelZh: "16×16×1 锯齿像素钻石镐 (Extruded Diamond Pickaxe)",
    labelEn: "Extruded 16x16x1 Pixel-Art Diamond Pickaxe",
    itemEn:
      "holding an extruded 16x16x1 3D pixel-art Minecraft Diamond Pickaxe (diagonal brown oak pixel stick + stepped 90-degree cyan #4AEDD9 diamond pick head, 1-pixel thick, never a smooth cylindrical rod)",
    itemZh:
      "握持16x16x1像素挤出厚度的《我的世界》立体像素钻石镐（45度对角棕色木柄像素格+亮青色#4AEDD9阶梯状90度直角镐头，严禁圆润金属镐杆）"
  },
  "diamond-sword": {
    labelZh: "16×16×1 锯齿像素钻石剑 (Extruded Diamond Sword)",
    labelEn: "Extruded 16x16x1 Pixel-Art Diamond Sword",
    itemEn:
      "holding an extruded 16x16x1 3D pixel-art Minecraft Diamond Sword with stepped 90-degree staircase cyan #4AEDD9 voxel blade edges and pixel crossguard (zero smooth curved metal edge)",
    itemZh:
      "握持16x16x1像素挤出厚度的《我的世界》立体像素钻石剑（亮青色#4AEDD9阶梯状锯齿直角像素剑刃与像素护手，严禁平滑弧形金属刀刃）"
  },
  "lantern-torch": {
    labelZh: "2×10×2 像素发光火把 (Voxel Torch)",
    labelEn: "2x10x2 Emissive Voxel Torch",
    itemEn:
      "holding a 2x10x2 pixel wooden Minecraft torch topped with a glowing 2x2x2 amber-gold voxel flame and floating square smoke particles",
    itemZh:
      "握持2x10x2像素木柄火把，顶端带2x2x2自发光暖黄正方体火苗与悬浮正方形烟雾粒子"
  },
  "golden-apple": {
    labelZh: "16×16×1 附魔金苹果 (Enchanted Golden Apple)",
    labelEn: "Extruded 16x16x1 Pixel-Art Enchanted Golden Apple",
    itemEn:
      "holding an extruded 16x16x1 pixel-art Golden Apple with stepped yellow-gold pixel edges, white specular pixel highlights, and purple enchantment glint",
    itemZh:
      "握持16x16x1像素挤出厚度的附魔金苹果（阶梯状直角像素边缘、白色高光像素格与紫色附魔流光）"
  },
  "tnt-mini": {
    labelZh: "微缩手持TNT方块 (Held Mini TNT Block)",
    labelEn: "Held Miniature 8x8x8 TNT Voxel Block",
    itemEn:
      "holding a sharp cubic red-and-white Minecraft TNT block with crisp pixel 'TNT' lettering between both flat 4x4 square hand ends",
    itemZh:
      "双侧4x4平头方手之间捧着一块印有清晰像素TNT字样的红白正方体炸药块"
  },
  "none": {
    labelZh: "空手标准方块姿态 (Empty Square Block Hands)",
    labelEn: "Empty Flat Square Pixel-Block Hands",
    itemEn: "with empty fingerless flat square pixel-block hand ends clearly visible",
    itemZh: "保持空手状态，清晰展现无手指无钩爪的平头正方形像素手部截面"
  }
};

const RIGS = {
  "steve-wide": {
    label: "Classic Wide Rig / 标准Steve宽臂像素骨架 (8x8x8 Head + 8x12x4 Torso + 4x12x4 Arms & Legs)",
    geometryEn:
      "canonical Minecraft Classic Wide (Steve) pixel-grid rig: sharp 90-degree 8x8x8 cubic head (1:1:1 aspect ratio, flat studless top), 8x12x4 rectangular prism torso, two 4x12x4 rectangular prism arms flush at shoulders ending in fingerless and clawless flat 4x4 square pixel-block hands, and two 4x12x4 rectangular prism leg blocks sitting flush side-by-side matching exact torso width",
    geometryZh:
      "正统《我的世界》Classic宽臂(Steve)像素网格比例：1:1:1锋利直角8x8x8像素立方体头（平顶无乐高颗粒、非Roblox圆桶头），8x12x4长方体躯干，两条4x12x4长方体手臂紧贴肩侧且末端为4x4平头正方形像素截面手部（严禁人类五指、严禁乐高C型爪），两条4x12x4长方体双腿并拢齐平与躯干同宽"
  },
  "alex-slim": {
    label: "Slim Rig / 纤细Alex像素骨架 (8x8x8 Head + 8x12x4 Torso + 3x12x4 Slim Arms + 4x12x4 Legs)",
    geometryEn:
      "canonical Minecraft Slim (Alex) pixel-grid rig: sharp 90-degree 8x8x8 cubic head, 8x12x4 rectangular prism torso, two slim 3x12x4 rectangular prism arms ending in fingerless flat 3x4 square pixel-block hands, and two 4x12x4 leg blocks sitting flush side-by-side",
    geometryZh:
      "正统《我的世界》Slim纤细版(Alex)像素网格比例：8x8x8锋利直角立方体头，8x12x4长方体躯干，两条3x12x4纤细版长方体手臂（末端为3x4平头方形像素手，无人类五指），两条4x12x4并拢方柱双腿"
  },
  "mob-quadruped": {
    label: "Quadruped Voxel Mob Rig / 原版四足生物像素骨架 (Creeper / Axolotl / Wolf)",
    geometryEn:
      "canonical Minecraft quadruped voxel mob geometry built from sharp 90-degree rectangular prisms with crisp nearest-neighbor 16x16 pixel textures, rigid hip/neck pivots, zero human limbs",
    geometryZh:
      "正统《我的世界》原版生物直角方柱几何结构，全身覆盖清晰无模糊的16x16邻近采样像素贴图，仅颈部与腿部转轴刚性可动"
  },
  "mob-enderman": {
    label: "Tall Enderman Voxel Rig / 末影人3格高修长像素骨架 (8x8x8 Head + 8x12x4 Torso + 2x30x2 Limbs)",
    geometryEn:
      "canonical 3-block-tall Minecraft Enderman voxel geometry: sharp 8x8x8 cubic head with separable jaw shell, 8x12x4 torso, and ultra-thin 2x30x2 rectangular stick arms and legs with sharp 90-degree corners",
    geometryZh:
      "正统3格高《我的世界》末影人像素骨架：8x8x8可张合直角立方体头壳、8x12x4躯干与2x30x2修长细方柱四肢"
  }
};

const SHADERS = {
  "bsl-sunlight": {
    label: "BSL / Complementary Shaders (体积暖阳与方块光源渲染)",
    shaderEn:
      "Minecraft BSL and Complementary Shaders aesthetic: warm volumetric sunlight god-rays, soft voxel contact shadows, emissive block-light bounce, while keeping every 16x16 and 8x8 pixel texel razor-sharp with nearest-neighbor filtering",
    shaderZh:
      "Minecraft BSL/Complementary光影画风：温暖体积光丁达尔射线、柔和方块接触阴影与温暖方块光源漫反射，同时保持每一格16x16与8x8像素贴图边缘锋利无模糊"
  },
  "bare-bones-trailer": {
    label: "Official Trailer / Bare Bones + Fresh Animations (官方宣传片纯净色彩与灵动像素眼)",
    shaderEn:
      "Official Minecraft Trailer and Bare Bones texture pack aesthetic: clean saturated 16x16 pixel color blocks, crisp edge highlights, bright global illumination, and Fresh Animations expressive pixel eye/brow motion",
    shaderZh:
      "Minecraft官方宣传片(Bare Bones + Fresh Animations)画风：纯净高饱和16x16像素色块、利落方块边缘高光、明亮全局光照与灵动可动像素眼眉"
  },
  "vanilla-crisp": {
    label: "Classic Vanilla Java Edition (原版Java纯净邻近像素质感)",
    shaderEn:
      "authentic Vanilla Minecraft Java Edition rendering: unfiltered nearest-neighbor 16x16 pixel-art textures, classic directional block-face shading (100% top, 80% front, 60% side), crisp ambient occlusion in voxel corners",
    shaderZh:
      "纯正《我的世界》Java原版渲染质感：无滤镜16x16邻近采样像素贴图、经典方块六面阶梯明暗对比与角落环境光遮蔽"
  },
  "rtx-emissive": {
    label: "Minecraft RTX Ray-Traced Cave (RTX光线追踪矿洞与红石自发光)",
    shaderEn:
      "Minecraft RTX path-traced voxel lighting: high-contrast dark deepslate environment illuminated by glowing cyan Diamond Ore (#4AEDD9), crimson Redstone (#EF4444), and warm amber torches reflecting on crisp 16x16 pixel texels",
    shaderZh:
      "Minecraft RTX光线追踪体素光影：深板岩暗调环境由自发光亮青钻石矿(#4AEDD9)、暗红红石(#EF4444)与暖金火把照亮，清晰映射16x16像素方格表面"
  }
};

const NEGATIVE_PROMPT_EN =
  "human fingers, five fingers, realistic human hands, knuckles, blurry bilinear textures, smudged pixel art, anti-aliased soft gradients, Roblox cylindrical barrel head, rounded toy head, Lego top head studs, cylindrical Lego pegs, Lego C-shaped claw hands, smooth cylindrical metal sword, realistic curved pickaxe blade, 3D protruding human nose, realistic eyeballs, rubbery noodle limbs, watermark";

const NEGATIVE_PROMPT_ZH =
  "人类五指，真实人手，手指关节，贴图模糊涂抹，双线性插值糊化，Roblox圆桶圆柱头，圆润盲盒头，乐高头顶圆柱凸粒，乐高C型夹爪手，圆滑金属剑刃，圆棍镐柄，3D凸起高鼻梁，真实眼球，橡胶面条状弯曲四肢，水印文字";

function printHelp() {
  console.log(`Usage: node scripts/voxel_spec.mjs [options]

Generate a geometry-locked Minecraft Character, Mob, and Voxel Block/Object DNA card with 3-view & isometric prompts.

Options:
  --archetype <id>   Character/Mob preset: steve-miner | alex-builder | diamond-knight |
                     cozy-hoodie | creeper-mob | enderman-mob | axolotl-pet (default: steve-miner)
  --object <id>      Featured voxel block/prop: diamond-ore | grass-block | tnt-block |
                     crafting-table | chest-hinged | lantern-torch | redstone-piston | enchanted-table
  --held-item <id>   Extruded 16x16x1 held item: diamond-pickaxe | diamond-sword |
                     lantern-torch | golden-apple | tnt-mini | none
  --rig <id>         Rig proportion: steve-wide | alex-slim | mob-quadruped | mob-enderman
  --shader <id>      Visual shader: bsl-sunlight | bare-bones-trailer | vanilla-crisp | rtx-emissive
  --name <string>    Character display name (default: "Steve")
  --lang <mode>      Output language: zh-en | zh | en (default: zh-en)
  --json             Output structured JSON
  --help             Show this help message`);
}

export function parseArgs(argv) {
  const opts = {
    archetype: "steve-miner",
    object: "",
    heldItem: "",
    rig: "",
    shader: "",
    name: "Steve",
    lang: "zh-en",
    json: false,
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--json") opts.json = true;
    else if (arg === "--archetype" && argv[i + 1]) opts.archetype = argv[++i];
    else if (arg === "--object" && argv[i + 1]) opts.object = argv[++i];
    else if (arg === "--held-item" && argv[i + 1]) opts.heldItem = argv[++i];
    else if (arg === "--rig" && argv[i + 1]) opts.rig = argv[++i];
    else if (arg === "--shader" && argv[i + 1]) opts.shader = argv[++i];
    else if (arg === "--name" && argv[i + 1]) opts.name = argv[++i];
    else if (arg === "--lang" && argv[i + 1]) opts.lang = argv[++i];
  }
  return opts;
}

export function buildVoxelSpec(rawOpts = {}) {
  const archetypeKey = ARCHETYPES[rawOpts.archetype] ? rawOpts.archetype : "steve-miner";
  const preset = ARCHETYPES[archetypeKey];
  const rigKey = RIGS[rawOpts.rig] ? rawOpts.rig : preset.defaultRig;
  const objectKey = VOXEL_OBJECTS[rawOpts.object] ? rawOpts.object : preset.defaultObject;
  const heldKey = HELD_ITEMS[rawOpts.heldItem] ? rawOpts.heldItem : preset.defaultHeldItem;
  const shaderKey = SHADERS[rawOpts.shader] ? rawOpts.shader : preset.defaultShader;

  const rig = RIGS[rigKey];
  const voxelObject = VOXEL_OBJECTS[objectKey];
  const heldItem = HELD_ITEMS[heldKey];
  const shader = SHADERS[shaderKey];
  const name = rawOpts.name || "Steve";

  const turnaroundPromptEn = [
    `Character turnaround reference sheet of "${name}", an authentic Minecraft voxel figure shown in three full-body views side by side: 0-degree front view, 45-degree three-quarter view, and 90-degree side profile view.`,
    `Voxel geometry lock: ${rig.geometryEn}.`,
    `3D outer skin shell: ${preset.skinLayerEn}.`,
    `Face & texel lock: ${preset.faceEn}, crisp unfiltered 16x16 nearest-neighbor pixel textures, zero bilinear blur.`,
    `Outfit & held item: ${preset.outfitEn}, ${heldItem.itemEn}, standing on a canonical 16x16x16 Minecraft grass and stone block platform.`,
    `Shader & lighting: ${shader.shaderEn}, clean studio backdrop, consistent pixel scale across all three views.`
  ].join(" ");

  const turnaroundPromptZh = [
    `《我的世界》角色三视图参考设定卡（角色名："${name}"），并排展示全身 0° 正视图、45° 斜侧视图与 90° 正侧视图。`,
    `像素几何锁定：${rig.geometryZh}。`,
    `双层3D皮肤外层：${preset.skinLayerZh}。`,
    `五官与像素网格锁定：${preset.faceZh}，全身与方块严格保持清晰无模糊的16x16邻近采样像素网格。`,
    `穿搭与手持道具：${preset.outfitZh}，${heldItem.itemZh}，脚踩标准16x16x16草方块与石砖底座。`,
    `光影与渲染：${shader.shaderZh}，干净摄影棚背景，三个视角比例与像素网格完全一致。`
  ].join("");

  const objectPromptEn = [
    `Isometric 45-degree macro product render of ${voxelObject.objectPromptEn}, paired with ${heldItem.labelEn}.`,
    `Grid accuracy: ${voxelObject.gridSize}, sharp 90-degree voxel edges, crisp nearest-neighbor 16x16 pixel-art texels, ${shader.shaderEn}, no rounded Lego studs, no blurry textures.`
  ].join(" ");

  const objectPromptZh = [
    `45度等距微缩特写渲染：${voxelObject.objectPromptZh}，搭配${heldItem.labelZh}。`,
    `网格精度：${voxelObject.gridSize}，90度锋利直角体素边缘，清晰无模糊的16x16邻近采样像素贴图，${shader.shaderZh}，严禁乐高凸粒或贴图模糊。`
  ].join("");

  return {
    name,
    archetype: archetypeKey,
    archetypeLabelZh: preset.labelZh,
    archetypeLabelEn: preset.labelEn,
    rig: rigKey,
    rigLabel: rig.label,
    object: objectKey,
    objectLabelZh: voxelObject.labelZh,
    objectLabelEn: voxelObject.labelEn,
    objectGridSize: voxelObject.gridSize,
    heldItem: heldKey,
    heldItemLabelZh: heldItem.labelZh,
    heldItemLabelEn: heldItem.labelEn,
    shader: shaderKey,
    shaderLabel: shader.label,
    palette: {
      skinTone: preset.skinTone,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor
    },
    turnaroundPromptEn,
    turnaroundPromptZh,
    objectPromptEn,
    objectPromptZh,
    negativePromptEn: NEGATIVE_PROMPT_EN,
    negativePromptZh: NEGATIVE_PROMPT_ZH
  };
}

function formatMarkdown(spec, lang) {
  const lines = [];
  lines.push(`# Minecraft Character & Voxel Object DNA Card: ${spec.name}`);
  lines.push("");
  lines.push(`- **Character / Mob Archetype**: \`${spec.archetype}\` (${spec.archetypeLabelZh} / ${spec.archetypeLabelEn})`);
  lines.push(`- **Pixel Rig**: \`${spec.rig}\` — ${spec.rigLabel}`);
  lines.push(`- **Featured Voxel Block / Prop**: \`${spec.object}\` — ${spec.objectLabelZh} (\`${spec.objectGridSize}\`)`);
  lines.push(`- **Extruded Held Item**: \`${spec.heldItem}\` — ${spec.heldItemLabelZh}`);
  lines.push(`- **Shader Style**: \`${spec.shader}\` — ${spec.shaderLabel}`);
  lines.push(
    `- **Color Swatches**: Skin \`${spec.palette.skinTone}\` · Primary \`${spec.palette.primaryColor}\` · Secondary \`${spec.palette.secondaryColor}\` · Accent \`${spec.palette.accentColor}\``
  );
  lines.push("");

  if (lang !== "zh") {
    lines.push("## 3-View Character Turnaround Prompt (English)");
    lines.push("```text");
    lines.push(spec.turnaroundPromptEn);
    lines.push("```");
    lines.push("");
    lines.push("## Isometric Voxel Object / Block Prompt (English)");
    lines.push("```text");
    lines.push(spec.objectPromptEn);
    lines.push("```");
    lines.push("");
  }

  if (lang !== "en") {
    lines.push("## 角色三视图生成提示词 (中文)");
    lines.push("```text");
    lines.push(spec.turnaroundPromptZh);
    lines.push("```");
    lines.push("");
    lines.push("## 方块与道具等距特写提示词 (中文)");
    lines.push("```text");
    lines.push(spec.objectPromptZh);
    lines.push("```");
    lines.push("");
  }

  lines.push("## Anti-Drift Negative Prompt / 负向防串味词");
  lines.push("```text");
  if (lang === "zh") lines.push(spec.negativePromptZh);
  else if (lang === "en") lines.push(spec.negativePromptEn);
  else lines.push(`${spec.negativePromptEn}\n${spec.negativePromptZh}`);
  lines.push("```");

  return lines.join("\n");
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }
  const spec = buildVoxelSpec(opts);
  if (opts.json) {
    console.log(JSON.stringify(spec, null, 2));
  } else {
    console.log(formatMarkdown(spec, opts.lang));
  }
}
