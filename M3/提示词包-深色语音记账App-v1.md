# 深色语音记账 App · 图像生成提示词包 v1

> 交付对象：语音记账 iOS App 原型改版（深色高级金融风）
> 覆盖资产：App 图标 / 本月支出资产卡 / 空状态插画 ×2 / 分类图标组 / 统计页氛围背景
> 目标形态：**单个自包含 HTML**（图标与插画按需内嵌或本地引用）
> 提示词语言：中文 + 英文各一份，均含负面提示词与可复现随机种子

---

## 0. 色彩与风格锁定表（**先定色，再写提示词**）

所有提示词里的色值锚点都取自此表。任何一条提示词离开这张表就会"每张图各是一个 App"，所以这张表是整包的地基。

### 0.1 需要的深色主题（本次改版目标 = 提示词的实际锚点）

| 语义 | 色值 | 用途 |
|---|---|---|
| `--bg` 近黑底 | `#0B0B0C` | 页面背景 |
| `--card` 卡片 | `#17181A` | 卡片面 |
| `--card-2` 卡内层 | `#1F2023` | 卡内嵌块 / 图标底座 |
| `--line` 描边 | `#26272B` | 1px 分隔与描边 |
| `--ink` 主文字 | `#F5F6F7` | 金额、标题 |
| `--ink-2` 次文字 | `#9A9CA3` | 标签 |
| `--ink-3` 弱文字 | `#63656B` | 注释、单位 |
| `--lime` 青柠强调 | `#C8F169` | 数据强调、正向、选中态 |
| `--lime-deep` 青柠暗阶 | `#8FBF3A` | 渐变尾、按下态 |
| `--copper` 铜橙 | `#D9794F` | **支出**语义（与原型一致） |
| `--copper-deep` 铜橙暗阶 | `#A8402F` | 支出深阶 |
| `--blue-hi` 渐变高光 | `#7FE3FF` | 卡面左上高光 |
| `--blue-mid` 渐变中 | `#3B6FE0` | 卡面中部 |
| `--blue-lo` 渐变低 | `#2A2F8F` | 卡面右下 |
| `--blue-deep` 渐变暗角 | `#101438` | 卡面边缘压暗 |

### 0.2 现存原型的浅色主题（**必须确认是否保留**）

`prototype\记账App原型-v1.html` 当前的默认主题是**浅色暖调**：`--bg:#F4F1EC`、`--surface:#FFFFFF`、`--accent:#C0623A`（铜橙，唯一强调色）；其深色变体是 `--bg:#131519` / `--surface:#1C1F24` / `--accent:#D9794F`。

**这不是本次要求的近黑 + 青柠 + 蓝色渐变方案。** 本提示词包按"深色高级金融风"编写，同时把原型的铜橙语义（支出）保留为**语义色而非主强调色**——即：青柠 = 数据/正向/选中，铜橙 = 支出。这样两套色板能共存，不会出现"改个色整个 App 气质崩掉"。此点列入 §6 待核对项。

### 0.3 风格锁定词（每条提示词都复用，不得改写）

`极简高级金融科技质感` / `暗底低饱和主体 + 单一高饱和强调色` / `柔和内发光` / `细腻胶片颗粒（颗粒强度 ≤ 5%）` / `无可见描边毛边` / `无高光镜面反射` / `几何精确的圆角`

英文锁定：`premium fintech minimalism, dark-first, low-saturation substrate with one high-saturation accent, soft inner glow, fine film grain under 5%, crisp anti-aliased edges, no specular gloss, geometrically exact radii`

### 0.4 全局负面提示词基底（各条按需叠加）

**中文**：文字、汉字、字母、数字、logo 水印、签名、二维码、人物、人脸、手、肢体、3D 塑料玩具感、卡通吉祥物、厚描边、扁平线性图标、彩虹多色、脏渐变、条带断层、高光镜面反射、镜头光晕、景深虚化、噪点过曝、纯白背景、纯灰方块、拼贴、边框、阴影错乱、低分辨率、锯齿

**英文**：`text, letters, numbers, logo, watermark, signature, QR code, human, face, hands, limbs, 3D plastic toy, cartoon mascot, thick outlines, flat line-art icon, rainbow multicolor, muddy gradient, banding, specular glare, lens flare, depth of field blur, overexposed noise, pure white background, plain gray box, collage, frame, broken shadows, low resolution, jaggies`

---

## 1. App 图标（1024×1024）

**语义**：语音（声波）× 记账（账本切片 / 上行趋势）。**不要文字**。

### 1.1 主提示词（中文）

```
App 图标，1024×1024 正方形，iOS 圆角方形安全区（圆角半径约 22% 边长，四角留 ≥ 64px 安全边距，符号整体控制在中心 72% 区域内）。
主体：一个由三条垂直圆角声波柱演化而来的抽象符号——三条柱体等距排列、中间最高、两侧对称递减，柱体两端为完全圆角；
符号底部并入一个极简的账本切片轮廓（开口向右的圆角矩形残片），形成"声波从账本中升起"的复合语义。
风格与材质：深色主题极简金融科技图标，符号为**单色描边 + 局部实心填充**，描边粗细统一为 16–18px 行程，圆角端帽；
主色 #C8F169 青柠，暗部阶梯压至 #8FBF3A，允许在柱体顶端叠加一档 #EBFFB0 极淡高光。
背景：#0B0B0C 近黑径向渐变，中心略亮（#17181A）至边缘近黑，叠加 ≤4% 强度的细颗粒。
光照与色调：无外部光源，采用符号自发光（柔和内发光，外发光半径 ≤ 24px、不透明度 ≤ 18%）；
整体色调冷黑底 + 单一暖青柠强调，饱和度克制，不出现第二种色相。
镜头/渲染：正交投影，无透视，无景深；符号居中、光学对齐（视觉重心略高于几何中心 1.5%）。
色值锚点：#0B0B0C / #17181A / #1F2023 / #C8F169 / #8FBF3A / #EBFFB0
宽高比：1:1（1024×1024）
负面提示词：文字、汉字、字母、数字、logo 水印、签名、人民币符号 ¥、美元符号 $、硬币、钞票写实、3D 塑料玩具感、卡通吉祥物、厚描边、扁平线性图标、多色、渐变彩虹、脏渐变、高光镜面反射、镜头光晕、景深虚化、纯白背景、白色描边、边框、拼贴、低分辨率、锯齿
随机种子：--seed 1024（主）；变体 --seed 1729 / --seed 2600
```

### 1.2 主提示词（English）

```
App icon, 1024x1024 square, iOS rounded-square safe area (corner radius about 22% of side, keep 64px+ margin at all corners, glyph confined to the central 72% region).
Subject: an abstract mark evolved from three vertical rounded sound-wave bars — evenly spaced, tallest in the middle, symmetrically tapering at the sides, both ends fully rounded; the glyph merges at its base into a minimal ledger-slice silhouette (a rounded rectangle fragment open to the right), reading as "sound rising out of a ledger".
Style & material: dark-first minimal fintech icon, glyph rendered as monochrome stroke with selective solid fills, uniform 16-18px stroke weight, rounded caps; primary color #C8F169 lime, shadow step down to #8FBF3A, one faint #EBFFB0 highlight allowed at bar tips.
Background: #0B0B0C near-black radial gradient, slightly lighter center (#17181A) falling to near-black at the edges, with fine grain at or below 4% strength.
Lighting & tone: no external light source, glyph is self-luminous (soft inner glow, outer bloom radius under 24px and opacity under 18%); cool near-black base plus a single warm lime accent, restrained saturation, no second hue.
Camera/render: orthographic, no perspective, no depth of field; symbol centered and optically aligned (visual center about 1.5% above geometric center).
Color anchors: #0B0B0C / #17181A / #1F2023 / #C8F169 / #8FBF3A / #EBFFB0
Aspect ratio: 1:1 (1024x1024)
Negative prompt: text, letters, numbers, logo, watermark, signature, currency symbols, coins, photorealistic banknotes, 3D plastic toy, cartoon mascot, thick outlines, flat line-art icon, multicolor, rainbow gradient, muddy gradient, specular glare, lens flare, depth of field blur, pure white background, white stroke, frame, collage, low resolution, jaggies
Seed: --seed 1024 (primary); variants --seed 1729 / --seed 2600
```

### 1.3 三个备选符号方向（同参数，仅替换主体句）

| 编号 | 主体句（中） | 主体句（英） | 适用判断 |
|---|---|---|---|
| A | 三条圆角声波柱并入账本切片 | three rounded sound bars merging into a ledger slice | 语义最完整，推荐 |
| B | 麦克风胶囊（圆角胶囊 + 下部短柄）叠加一条上行折线 | rounded microphone capsule with a short stem plus an ascending polyline | 语音优先，识别度最高 |
| C | 单一开口圆环内的圆角方形账页残片，环上带 2 段声波短纹 | rounded ledger-page fragment inside a single open ring with two short wave ticks on the ring | 最抽象、最"品牌符号" |

**图标不要直接用 AI 出的位图当最终定稿**：单色几何符号在扩散模型里最容易出现柱体粗细不匀。推荐流程 = AI 出 6–8 张选形 → 用矢量工具重绘符号 → 交付出双资产：`icon-1024.png`（iOS 提交）+ `icon-symbol.svg`（内嵌 HTML 用，体积 < 3KB）。

---

## 2. "本月支出"资产对象卡（3:2）

**要点**：参考图是一张**蓝色渐变银行卡**的体积感——本资产要保留那个"发光体块"的质感，但语义换成**记账**：不是银行卡，而是抽象渐变卡片 / 账本切片。**这张卡也最适合直接用 CSS 做**（见 §3）。

### 2.1 主提示词（中文）

```
一张悬浮的抽象渐变资产卡片，3:2 横版，圆角半径约为短边的 12%，卡片有 2.5D 级别的轻微倾斜（绕 X 轴 -6°、绕 Y 轴 +8°），呈现可信的体积与厚度（厚度 6–10px 的深色侧边）。
主体：卡片表面不是银行卡，而是抽象的"账本切片"——表面有一片从左上到右下的柔和渐变，叠加 3–4 条极淡的等距横线暗纹暗示账本行线（不透明度 ≤ 8%），右下角有一小片向外的光溢散。
材质：磨砂玻璃与拉丝金属之间的微光泽表面，无强镜面反射，仅有一道宽而软的高光带斜穿左上区域（覆盖宽度约 35%，不透明度 ≤ 22%）。
光照与色调：深色环境光，主光来自左上 45°，卡片自身微微发光；
渐变锚点：左上高光 #7FE3FF → 中部 #3B6FE0 → 右下 #2A2F8F，边缘压暗 #101438（四角暗角）；
允许在卡片外沿有一层厚度 ≤ 40px 的冷蓝外发光。
场景：置于 #0B0B0C 近黑底上，卡片下方有柔和椭圆落影（模糊半径约为卡片宽的 15%，不透明度 ≤ 35%），保证与背景拉开层次。
镜头/渲染：半正交 + 轻微长焦压缩（等效 85mm），无景深虚化，卡片整体锐利；全局细颗粒 ≤ 4%。
色值锚点：#0B0B0C / #17181A / #7FE3FF / #3B6FE0 / #2A2F8F / #101438 / #C8F169（仅用于一处 ≤ 2% 面积的强调点）
宽高比：3:2（1800×1200）
负面提示词：文字、数字、芯片、银行 logo、卡号、Visa/Mastercard 标识、写实银行卡、人民币、硬币、人物、手、3D 塑料玩具感、强镜面高光、镜头光晕、彩虹多色、脏渐变、色带断层、纯白背景、纯灰背景、边框、拼贴、景深虚化、低分辨率
随机种子：--seed 2025（主）；变体 --seed 3141 / --seed 4096
```

### 2.2 主提示词（English）

```
A hovering abstract gradient asset card, 3:2 landscape, corner radius about 12% of the short side, tilted with subtle 2.5D perspective (X-axis -6 deg, Y-axis +8 deg), with believable physical thickness (a 6-10px dark side edge).
Subject: the card face is not a bank card but an abstract "ledger slice" — a soft gradient running top-left to bottom-right, overlaid with 3-4 very faint evenly spaced horizontal rules hinting at ledger lines (opacity at or below 8%), with a small outward light spill at the lower-right corner.
Material: a micro-sheen surface between frosted glass and brushed metal, no hard specular reflection, only one wide soft highlight band crossing the upper-left at about 35% coverage and at or below 22% opacity.
Lighting & tone: dark ambient, key light from upper-left at 45 degrees, the card faintly self-luminous;
gradient anchors: upper-left highlight #7FE3FF to mid #3B6FE0 to lower-right #2A2F8F, edges pushed dark to #101438 (corner vignette); a cool blue outer glow of 40px thickness or less is allowed.
Scene: on a #0B0B0C near-black ground, with a soft elliptical contact shadow under the card (blur about 15% of card width, opacity at or below 35%) so it separates cleanly from the background.
Camera/render: near-orthographic with mild telephoto compression (85mm equivalent), no depth-of-field blur, card fully sharp; global grain at or below 4%.
Color anchors: #0B0B0C / #17181A / #7FE3FF / #3B6FE0 / #2A2F8F / #101438 / #C8F169 (accent on 2% of area at most)
Aspect ratio: 3:2 (1800x1200)
Negative prompt: text, numbers, chip, bank logo, card number, Visa/Mastercard marks, photorealistic bank card, currency, coins, people, hands, 3D plastic toy look, hard specular highlight, lens flare, rainbow multicolor, muddy gradient, color banding, pure white background, plain gray background, frame, collage, depth of field blur, low resolution
Seed: --seed 2025 (primary); variants --seed 3141 / --seed 4096
```

**尺寸与体积**：导出 `card-asset.webp` 1600×1067（q=82）≈ 120–260KB；若走 CSS 方案则 **0KB**。

---

## 3. 空状态插画（1:1，两张）

风格铁律：**低对比、可置于卡片内、不抢主体文字**。所以这两张的"成功标准"不是好看，而是**放在 `#17181A` 卡片上以后几乎不抢注意力**。

### 3.1 空状态 A —— 记账空态（还没有任何一笔记录）

**中文**
```
正方形插画，1:1，极简单色线性几何风格，用于深色 App 的记账空状态。
主体：画面中心偏下是一本合上的极简账本（圆角矩形，厚度仅一条 6px 的底边暗示），账本上方漂浮 2–3 条长短不一的圆角声波短柱，最右侧一条微微倾斜，暗示"等待第一句话"。
风格与材质：单色描边，描边宽度统一 8px（在 1024px 画布上），圆角端帽与圆角连接，零填充块面；不使用渐变色相变化，只用同一色相的明度阶梯。
光照与色调：无投影、无光源方向，纯粹的图形化表达；线条颜色 #63656B 弱灰，仅声波柱顶端 20% 段落提亮到 #9A9CA3；允许在最右侧一条声波柱上使用 #8FBF3A 的低饱和青柠暗示（面积 ≤ 3%）。
背景：#17181A 卡片底色，纯色，无渐变、无纹理、无暗角，四角留白 ≥ 画布 18%。
镜头/渲染：正交投影，等宽线条，抗锯齿干净，无景深、无颗粒。
色值锚点：#17181A / #63656B / #9A9CA3 / #8FBF3A
宽高比：1:1（1024×1024）
负面提示词：文字、汉字、数字、人物、人脸、手、卡通角色、吉祥物、3D 立体感、塑料质感、厚描边、多色、彩虹、渐变背景、白色背景、阴影、噪点、纹理、贴纸边框、拼贴、过曝、低分辨率、锯齿
随机种子：--seed 606（主）；变体 --seed 616 / --seed 626
```

**English**
```
Square illustration, 1:1, minimal monochrome linear-geometric style, for the empty state of a dark-mode bookkeeping app.
Subject: slightly below center sits a closed minimal ledger (rounded rectangle, thickness implied by a single 6px bottom edge); two or three rounded sound-wave bars of differing lengths float above it, the rightmost faintly tilted, reading as "waiting for the first sentence".
Style & material: monochrome strokes, uniform 8px stroke weight on a 1024px canvas, rounded caps and joins, zero filled masses; no hue variation from gradients, only value steps within a single hue.
Lighting & tone: no cast shadow, no light direction, purely graphic; stroke color #63656B muted gray, with only the top 20% of each wave bar lifted to #9A9CA3; one wave bar may carry a desaturated lime #8FBF3A accent on 3% of area at most.
Background: flat #17181A card color, no gradient, no texture, no vignette, with 18%+ canvas padding on all sides.
Camera/render: orthographic, uniform stroke, clean anti-aliasing, no depth of field, no grain.
Color anchors: #17181A / #63656B / #9A9CA3 / #8FBF3A
Aspect ratio: 1:1 (1024x1024)
Negative prompt: text, letters, numbers, people, faces, hands, cartoon characters, mascot, 3D volume, plastic sheen, thick outlines, multicolor, rainbow, gradient background, white background, shadows, noise, texture, sticker border, collage, overexposure, low resolution, jaggies
Seed: --seed 606 (primary); variants --seed 616 / --seed 626
```

### 3.2 空状态 B —— 统计空态（还没有数据可以统计）

**中文**
```
正方形插画，1:1，与"记账空态"同一套线条语言（同一描边宽度、同一色阶），用于统计页空态。
主体：一条极简的坐标轴（水平基线 + 左侧短竖轴），基线上方立着 3 根高度几乎相同的极短圆角柱（仅占画布高度的 8–12%），左上角漂浮一条断裂的上行折线（中段断开一小截），暗示"数据还没长起来"。
风格与材质：单色描边 8px，圆角端帽，零填充；不使用第二种线型，不使用虚线以外的装饰。
光照与色调：无投影无光源；线条 #63656B，折线断口两端提亮至 #9A9CA3；3 根短柱的顶面可使用 #8FBF3A 低饱和青柠（总面积 ≤ 4%）。
背景：#17181A 纯色卡片底，四角留白 ≥ 18%。
镜头/渲染：正交、等宽、干净抗锯齿、无景深无颗粒。
色值锚点：#17181A / #63656B / #9A9CA3 / #8FBF3A
宽高比：1:1（1024×1024）
负面提示词：同 3.1（文字、数字、人物、卡通角色、3D、厚描边、多色、渐变背景、白色背景、阴影、噪点、贴纸边框、低分辨率、锯齿）
随机种子：--seed 707（主）；变体 --seed 717 / --seed 727
```

**English**
```
Square illustration, 1:1, same stroke language as the bookkeeping empty state (identical stroke weight and value steps), for the statistics empty state.
Subject: a minimal chart axis (horizontal baseline plus a short left vertical axis); three very short rounded bars of nearly equal height stand on the baseline, occupying only 8-12% of canvas height; an ascending polyline floats at the upper-left with a small gap broken out of its middle, reading as "data has not grown yet".
Style & material: monochrome 8px strokes, rounded caps, zero fills; no second line style, no ornament beyond the dashed gap.
Lighting & tone: no shadow and no light source; strokes #63656B, with the two ends flanking the polyline gap lifted to #9A9CA3; the bar tops may use desaturated lime #8FBF3A on 4% of total area at most.
Background: flat #17181A card color with 18%+ padding on all sides.
Camera/render: orthographic, uniform stroke, clean anti-aliasing, no depth of field, no grain.
Color anchors: #17181A / #63656B / #9A9CA3 / #8FBF3A
Aspect ratio: 1:1 (1024x1024)
Negative prompt: same as the bookkeeping empty state (text, letters, numbers, people, cartoon characters, 3D, thick outlines, multicolor, gradient background, white background, shadows, noise, sticker border, low resolution, jaggies)
Seed: --seed 707 (primary); variants --seed 717 / --seed 727
```

> **强烈建议**：这两张空状态**不要用生图**，改用内联 SVG（见 §3.3 的 CSS/SVG 判定）。原因很直接：低对比单色线条插画在扩散模型里几乎必然被"加戏"成有体积、有阴影、有多色的插画，反而破坏"不抢主体文字"这条硬要求。

---

## 4. 分类图标组（7 个，统一 1:1）

**质感定位**：参考图列表行左侧那种小图标——**有体积、有材质，但不是扁平线性，也不是 3D 玩具**。落在两者之间：**微光泽的圆角瓷片底座 + 单色符号**（英文常叫 *soft-glossy tile icon* / *frosted chip icon*）。

### 4.1 主提示词（中文，以"餐饮"为例）

```
一个分类图标，1:1，用于深色 App 的支出列表行左侧。
主体：一个圆角方形底座（圆角半径约 30% 边长，尺寸占画布 72%，四周留白 14%），底座中央放置一个极简符号——叉子与勺子交叉，叉齿 3 齿、勺头为半圆，符号整体占底座 52%，符号保持几何对称、笔画等宽（约 9px 行程）、圆角端帽。
材质：底座为磨砂玻璃/软哑光陶瓷质感，表面有极淡的内发光（内发光沿顶边、不透明度 ≤ 14%），**无强镜面高光、无高光条**；底座基色 #1F2023，底部略深至 #17181A 形成轻微体积。
符号色：#C8F169 青柠（单色），允许在符号下部 30% 段落阶梯压至 #8FBF3A；不出现第二种色相。
光照与色调：柔和顶光（约 60°），两侧无轮廓光；整体低对比，底座与近黑背景 #0B0B0C 拉开但不刺眼。
镜头/渲染：正交投影，无透视、无景深；抗锯齿干净，全局颗粒 ≤ 3%。
色值锚点：#0B0B0C / #17181A / #1F2023 / #C8F169 / #8FBF3A
宽高比：1:1（512×512）
负面提示词：文字、数字、标签、3D 塑料玩具感、卡通吉祥物、厚描边、扁平纯线性、写实照片、真实食物照片、多色、彩虹渐变、强镜面反射、高光条、柔和阴影外溢、人物、手、白色背景、灰色方块、边框、贴纸、低分辨率、锯齿
随机种子：--seed 101（餐饮）；其余见 4.3
```

### 4.2 主提示词（English，餐饮示例）

```
A category icon, 1:1, for the left slot of an expense list row in a dark-mode app.
Subject: a rounded-square tile (corner radius about 30% of side, filling 72% of canvas with 14% padding), with a minimal symbol centered inside — a crossed fork and spoon, the fork with 3 tines and the spoon head a half circle; the symbol fills 52% of the tile, geometrically symmetric, uniform stroke (about 9px), rounded caps.
Material: the tile is frosted glass / soft matte ceramic, with a very faint inner glow along its top edge (opacity at or below 14%), no hard specular highlight and no highlight band; tile base #1F2023, easing darker toward the bottom to #17181A for slight volume.
Symbol color: #C8F169 lime (single hue), with the lower 30% of the symbol allowed to step down to #8FBF3A; no second hue anywhere.
Lighting & tone: soft key from above (about 60 degrees), no rim light on the sides; overall low contrast, the tile separates from the #0B0B0C near-black background without glare.
Camera/render: orthographic, no perspective, no depth of field; clean anti-aliasing, global grain at or below 3%.
Color anchors: #0B0B0C / #17181A / #1F2023 / #C8F169 / #8FBF3A
Aspect ratio: 1:1 (512x512)
Negative prompt: text, numbers, labels, 3D plastic toy look, cartoon mascot, thick outlines, flat pure line-art, photorealistic, real food photography, multicolor, rainbow gradient, hard specular reflection, highlight band, soft shadow spill, people, hands, white background, gray box, frame, sticker, low resolution, jaggies
Seed: --seed 101 (food); remaining seeds in 4.3
```

### 4.3 七个符号清单（同一套参数，只替换"符号"一句）

| # | 分类 | 符号描述（中） | Symbol (EN) | 种子 |
|---|---|---|---|---|
| 1 | 餐饮 | 叉子与勺子交叉，叉 3 齿、勺头半圆 | crossed fork and spoon, 3-tine fork, half-circle spoon | `--seed 101` |
| 2 | 交通 | 侧视流线车体轮廓，两轮为等大圆环，车顶一条水平圆角线 | side-view streamlined car body, two equal ring wheels, one horizontal rounded roofline | `--seed 102` |
| 3 | 购物 | 圆角购物袋，提手为一条开口向上的半圆，袋身有 1 条竖向折痕 | rounded shopping bag, semicircular open handle, one vertical crease on the body | `--seed 103` |
| 4 | 居住 | 三角形屋顶压在圆角方形墙体上，墙面开 2 扇小方窗，底部一条水平基线 | triangular roof over a rounded-square wall, two small square windows, one baseline beneath | `--seed 104` |
| 5 | 娱乐 | 八分音符，符头为圆角椭圆，符杆向右上，尾部一条短弧 | eighth note with rounded oval head, stem rising right, one short flag arc | `--seed 105` |
| 6 | 其他 | 三个等距水平圆点居左，右侧一条竖直圆角短柱（"更多"语义） | three evenly spaced horizontal dots at left, one vertical rounded bar at right | `--seed 106` |
| 7 | 未分类 | 圆角方形虚线轮廓（8 段等长虚线），中央一个圆角问号 | rounded-square dashed outline (8 equal dashes), a rounded question mark centered | `--seed 107` |

### 4.4 一致性生成法（**关键操作建议**）

逐个生成 7 张极易"跑风格"。三种做法，按可靠性排序：

1. **推荐**：一次生成一张 **4:2 网格图**（1500×750，8 格，第 8 格留空），提示词写"同一套图标以 4 列 2 行网格排布，风格、底座尺寸、描边宽度、配色完全一致，间距均匀，每格留白一致"——再由切图工具切出 7 张 512×512。这样一致性由**同一张图内的自监督**保证。种子 `--seed 1001`，负面词叠加"网格线、分隔线、编号、格间阴影"。
2. 备选：先生成 1 张定调图，再用图生图（image-to-image，强度 0.35–0.5）逐张替换符号，锁死底座。
3. 最稳但不"生图"：**底座与 7 个符号全部写成 SVG**（见 §5 判定表第 4 行）。这一组的几何规整度用 SVG 手写反而比生图更可控。

---

## 5. 统计页氛围背景（16:9，可选）

**用途限定**：**仅作卡片内衬**，绝不能干扰数据可读性。因此对比度上限比"好看"重要得多。

**中文**
```
16:9 极淡抽象纹理，仅用作深色统计卡片的内部底纹。
主体：一幅几乎无内容的抽象场——极淡的同心等距曲线（5–6 条）从右下角向外扩散，叠加一层极淡的 45° 斜向细网格（线宽 1px，间距约 48px），两者都极低对比。
风格与材质：纯色相内变化，无第二种色相；无纹理贴图、无噪点块、无光斑；线条不透明度 ≤ 6%，网格不透明度 ≤ 4%。
光照与色调：整体为 #0B0B0C 至 #17181A 的缓慢径向渐变（亮部集中在中上偏左），青柠色仅在右下角以 ≤ 2% 不透明度的极淡光晕出现一次。
镜头/渲染：正交平面，无透视、无景深、无颗粒；必须保证在 60% 缩放与 1x 屏幕上都不出现色带。
色值锚点：#0B0B0C / #17181A / #1F2023 / #C8F169（≤2% 不透明度）
宽高比：16:9（1920×1080）
负面提示词：文字、数字、图表、折线图、柱状图、K 线、股票、数据可视化、光斑、星云、烟雾、粒子、噪点、脏渐变、色带断层、波浪明显、高对比、霓虹、彩虹、人物、物体、边框、白色、低分辨率
随机种子：--seed 808
```

**English**
```
16:9 ultra-faint abstract texture, intended only as an inner substrate for a dark statistics card.
Subject: an almost contentless abstract field — very faint concentric evenly spaced curves (5-6 of them) radiating from the lower-right corner, overlaid with an ultra-faint 45-degree fine grid (1px lines, about 48px spacing), both at extremely low contrast.
Style & material: value changes within a single hue, no second hue; no texture maps, no noise blobs, no light spots; line opacity at or below 6%, grid opacity at or below 4%.
Lighting & tone: an overall slow radial gradient from #0B0B0C to #17181A (bright region sitting upper-center-left), lime appearing exactly once as an ultra-faint bloom at the lower-right at 2% opacity or less.
Camera/render: flat orthographic, no perspective, no depth of field, no grain; must show no banding at 60% zoom or on a 1x display.
Color anchors: #0B0B0C / #17181A / #1F2023 / #C8F169 (at 2% opacity or below)
Aspect ratio: 16:9 (1920x1080)
Negative prompt: text, numbers, charts, line charts, bar charts, candlesticks, stock, data visualization, light spots, nebula, smoke, particles, noise, muddy gradient, banding, visible waves, high contrast, neon, rainbow, people, objects, frame, white, low resolution
Seed: --seed 808
```

---

## 6. 哪些资产**不必生图**（CSS / SVG 就能做）

这是本包最省成本的一节。判定原则：**能用确定性代码画出来的东西，不要给概率模型画。**

| 资产 | 生图必要性 | 替代方案 | 结论 |
|---|---|---|---|
| **统计页氛围背景** | ❌ 无必要 | 3 层叠加即可：`radial-gradient(120% 90% at 20% 0%, #17181A, #0B0B0C)` + `repeating-linear-gradient(45deg, rgba(255,255,255,.035) 0 1px, transparent 1px 48px)` + 右下角一个 `radial-gradient` 青柠晕（`rgba(200,241,105,.02)`） | **用 CSS，砍掉生图** |
| **"本月支出"资产卡** | ❌ 无必要（默认） | `linear-gradient(135deg, #7FE3FF 0%, #3B6FE0 55%, #2A2F8F 100%)` + `border-radius:18px` + `box-shadow: 0 24px 60px rgba(59,111,224,.28)` + 内阴影做厚度 + 一层 `::after` 斜向高光带（`linear-gradient(115deg, rgba(255,255,255,.22), transparent 42%)`）+ 半透明横线暗纹 `repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 22px)` | **默认用 CSS**。只有在试过 CSS 后仍觉得"缺体积感"时才生图（就是要那张 2.5D 倾斜 + 外溢光） |
| **分类图标组** | ⚠️ 可选 | 底座 = `<div>` 加 `background:linear-gradient(180deg,#1F2023,#17181A)` + `border-radius:14px` + `inset box-shadow` 顶边内发光；符号 = 内联 SVG（7 个符号都很简单） | **建议走 SVG**。生图仅用于"先看一眼质感方向"，不作最终交付 |
| **空状态插画** | ⚠️ 可选 | 与分类图标同源的 SVG 线条 | **建议走 SVG**（理由见 §3 末尾） |
| **App 图标** | ✅ 需要 | 符号可以 SVG 重绘，但"发光符号压在近黑渐变上"的整体氛围值得先生成 6–8 张选形 | **生图选形 → SVG 定稿** |

**净结论**：这套改版真正**必须生图**的资产只有 **1 个（App 图标选形）**；另有 **2 个可选**（资产卡体积感、空状态插画质感）。其余全部 CSS/SVG。**不要为了用图而用图**——CSS 方案还顺带解决了下面 §7 的体积与内嵌问题。

---

## 7. 单文件 HTML 集成规范

### 7.1 每张图的推荐尺寸、体积上限、引用方式

| 资产 | 输出尺寸 | 格式 | 体积上限 | HTML 用法 |
|---|---|---|---|---|
| App 图标（提交用） | 1024×1024 | PNG（不透明） | ≤ 300KB | 不进页面；仅 iOS 提交 |
| App 图标（页面用） | 180×180 | SVG / WebP | SVG ≤ 4KB / WebP ≤ 24KB | **内嵌 base64 或内联 SVG**（页面头部小尺寸出现） |
| 资产对象卡 | 1600×1067 | WebP q82 | ≤ 260KB | 本地文件引用优先；超限则降 1200×800 |
| 空状态 A/B | 1024×1024 → 显示 220×220 | WebP q80 | 各 ≤ 90KB | **内联 SVG 优先**；位图则本地文件引用 |
| 分类图标（7 个） | 512×512 → 显示 36–44px | **雪碧图** WebP/PNG-8 | 整张 ≤ 120KB | **务必合并为 1 张雪碧图 + `background-position`**，禁止 7 个独立请求 |
| 统计氛围背景 | 1920×1080 | — | **0KB** | 不用图，见 §6 |

### 7.2 内嵌 vs 本地引用（决策规则）

- **必须内嵌（base64/内联 SVG）**：需要"单个自包含 HTML、双击即开、无外部依赖"的资产 —— 图标符号、空状态 SVG、分类图标雪碧图。这三类合计建议压在 **≤ 200KB**，否则 HTML 本体过大，编辑器与预览都会卡。
- **可以本地引用**：资产对象卡（1600×1067 位图 base64 会膨胀约 33%，得不偿失）。用 `./assets/card-asset.webp` 相对路径，并把 `assets/` 与 HTML 放同一目录一起交付。
- **base64 的隐性成本**：base64 会让体积 ×1.37，且**无法被 Gzip 有效压缩**。一个 260KB 的 WebP 内嵌后变成约 356KB 的不可压缩文本。所以大图一律走本地引用。
- **自包含的降级承诺**：若对方明确要求"绝对只有一个文件"，则资产卡也改用 §6 的 CSS 渐变方案——这样整页依然零位图，自包含与体积两个目标同时成立。

### 7.3 无障碍与渲染注意

- 纯装饰资产（氛围背景、分类图标）加 `aria-hidden="true"`；有意义图标补 `role="img"` + `aria-label`。
- 图标与插画统一用 `image-rendering: auto`（不要 `crisp-edges`，会让圆角锯齿）。
- 深色底上的低对比插画：**装饰性插画不受 WCAG 对比度约束**，但它底下的文字必须仍满足 4.5:1；空状态插画的颜色刻意压到 `#63656B`，就是为了让它绝不与正文抢对比度预算。
- 图标尺寸建议 `width:40px;height:40px`，在 2x/3x 屏上由 512px 源图缩下来，不要用 72px 源图放大。

---

## 8. 结论

1. **色板必须先在代码里定死**（§0.1），提示词只是这张表的投影。原型当前是浅色暖调主题，与"近黑 + 青柠 + 蓝色渐变"不是一套；本包按后者编写，并把原型的铜橙降级为**支出语义色**以保留延续性。
2. **真正需要生图的只有 1 项**：App 图标选形。资产卡、空状态、分类图标、氛围背景**都能用 CSS/SVG 做**，且在"单文件自包含 + 体积可控"这两个目标下，代码方案严格优于生图方案。
3. 五类提示词已全部给出中英双份，每条含主体与构图 / 风格与材质 / 光照与色调 / 镜头与渲染 / 精确色值锚点 / 宽高比 / 负面提示词 / 可复现种子（`1024 / 2025 / 606 / 707 / 101–107 / 808`）。
4. 分类图标组的**一致性风险最高**，已给出"单张 4×2 网格图切分"这一可靠做法。

## 9. 证据与定位

- **本地证据（已读）**：`prototype\记账App原型-v1.html`（74,650 字节）。已从其中提取全部 CSS 自定义属性：浅色主题 `--bg:#F4F1EC` / `--surface:#FFFFFF` / `--ink:#1B1D21` / `--accent:#C0623A`（注释明写"唯一强调色：支出语义"）/ 9 个分类色 `--c1:oklch(0.62 0.13 45)` 铜橙 … `--c9:oklch(0.55 0.02 90)` 未分类中性；深色变体 `--bg:#131519` / `--surface:#1C1F24` / `--accent:#D9794F` / `--pos:#5FAF99`。圆角阶 `--r-s:10px/--r-m:14px/--r-l:22px/--r-xl:28px`，阴影阶 `--sh-1/2/3`，动效 `--ease:cubic-bezier(.2,.8,.2,1)` / `--dur:200ms`。
- **未做检索、未做测试**：本次交付为提示词撰写，**没有**执行网络检索核验平台语法，**没有**实际调用生图模型跑图，**没有**测量真实导出体积。§7 的体积数字是**基于常见 WebP/PNG 压缩率的估算**，不是实测值；§6 的 CSS 方案**未在浏览器中渲染验证**。
- 另存在 `设计方案与验收记录-v1.md`（15,034 字节）与 `M3/` 工作目录，本次未读取前者内容。

## 10. 风险与条件

| 级别 | 风险 | 说明与条件 |
|---|---|---|
| **高** | 色板冲突未决 | 原型当前浅色暖调 vs 任务要求的近黑青柠。若两者要并存，需先确定"青柠 = 数据强调 / 铜橙 = 支出"的语义分工，否则同一个 App 会出现两套视觉语言。**在 §6 待核对项确认前，不要批量生图。** |
| **中** | 分类图标一致性 | 逐张生成几乎必然跑风格。需接受"先出一张 4×2 网格图再切分"的流程，或直接改走 SVG。 |
| **中** | 单色符号的 AI 失真 | 扩散模型画几何单色符号会出现柱体粗细不匀、圆角不圆。**图标必须以 SVG 定稿**，AI 出图只作选形用。 |
| **中** | 体积假设未实测 | §7 的 ≤300KB/≤260KB 是估算。若实际导出超标，按 §7.2 降级到 CSS 方案或降像素。 |
| **低** | 平台语法差异 | 提示词按 Midjourney 风格写（`--ar/--seed/--no`）。Flux/DALL·E 需去掉参数行、负面词改写成正向排除句；SD 需额外提供负向提示词字段。本包未逐平台实测。 |
| **低** | 氛围背景"过度装饰" | 该资产价值最低、风险最高（一浓就毁数据可读性）。**已直接建议用 CSS 替代**。 |

## 11. 建议与验收

**建议执行顺序**
1. 先确认 §0 色板与 §12-① 的主题归属问题（**这一步不做，后面全白做**）。
2. 图标：AI 出 6–8 张选形（`--seed 1024/1729/2600` + 三个符号方向 A/B/C）→ 选定后 SVG 重绘 → 导出 `icon-1024.png` + `icon-symbol.svg`。
3. 资产卡：**先写 CSS 版本**，在真机/浏览器上截屏看体积感是否够；不够再补生图。
4. 空状态 + 分类图标：**直接走 SVG**，不做生图。
5. 氛围背景：CSS，不做生图。
6. 收口：按 §7 组装单文件 HTML，实测体积。

**验收标准（可机械核对）**
- [ ] 页面在 `#0B0B0C` 底上渲染，所有卡片为 `#17181A`，二者肉眼可分层
- [ ] 青柠 `#C8F169` 在整页出现次数**受限**（只用于数据强调/选中态），不出现大面积青柠
- [ ] 分类图标 36–44px 显示时**仍能区分 7 个符号**（缩到实际尺寸再看一遍，这是最容易被忽略的验收）
- [ ] 空状态插画放进卡片后，**文字对比度不受影响**，插画不抢视线
- [ ] 生成的 HTML 单文件在断网、无外部资源的情况下打开完整
- [ ] 实测总体积 ≤ 500KB，其中内嵌部分 ≤ 200KB
- [ ] 全页搜索不含任何位图 base64 超过 100KB 的字符串

## 12. 交接给主理人的待核对项

1. **【阻断项】深色主题的归属**：`prototype\记账App原型-v1.html` 默认是浅色暖调（`--bg:#F4F1EC`、铜橙强调），其深色变体也只有 `#131519`。任务描述里的"近黑 `#0B0B0C` + 青柠 + 蓝色渐变"是**要替换掉原型现有色板**，还是**作为新增的第三套 / 默认深色主题**？两种答案会让提示词包的色彩锚点完全不同。
2. **青柠与铜橙的语义分工**：原型把铜橙定义为"唯一强调色：支出语义"。改用青柠后，铜橙是（a）保留为支出语义色，还是（b）彻底废弃？我按 (a) 写的。请确认。
3. **"最终用在单个自包含 HTML"的严格度**：是"一个 .html 文件，双击即开、零外部依赖"，还是"一个 HTML + 一个 assets 目录一起交付"？我在 §7.2 按后者给了规则，并在"绝对单文件"时给出全 CSS 降级路径。
4. **资产卡是否需要真 3D 体积感**：CSS 渐变能做出"发光卡面"，但做不出"2.5D 倾斜 + 外溢光 + 接触阴影"的完整体积感。请判断原型要不要这个效果——要的话这张卡就得生图。
5. **分类图标组的最终形态**：接受"SVG 手写"（最稳、体积最小），还是坚持"生图质感"（需接受一致性风险与切图流程）？
6. **是否需要逐平台的提示词版本**：本包以 Midjourney 语法为主（`--ar/--seed/--no`）。若实际用的是 Flux / DALL·E / SD，我需要再出一版去参数化的自然语言版。
7. **导出体积是否有硬指标**：我按 ≤500KB 总 / ≤200KB 内嵌给的验收线。若主理人另有体积预算，请给出，我按预算反推像素与格式。
8. **是否要我把 §6 的 CSS 方案直接写成可运行的 HTML 片段**：现在只是文字描述，未渲染验证。需要的话我可以落一份可直接粘贴的代码。
