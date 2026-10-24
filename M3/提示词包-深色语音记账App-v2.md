# 深色语音记账 App · 图像生成提示词包 v2

> 交付对象：语音记账 iOS App（近黑高级金融风）
> 覆盖资产：A 图标 / B 本月支出资产卡 / C 空状态插画 ×2 / D 分类图标组 ×7 / E 统计氛围纹理
> 本版与 `M3\提示词包-深色语音记账App-v1.md` 的关系：**v2 取代 v1**。v1 只有色彩描述，v2 增加了参考图给出的**结构规律**（材质层级 / 圆角同心比例 / 字号-灰度同向衰减 / 动效可反推），并已用两次真实渲染**实测**了 v1 里只是"估算"的 CSS 可行性结论。
> 验证状态：**CSS 方案已实测通过**；**生图提示词未实测**（本环境未配置生图 API key，见 §9）。

---

## 1. 图片设计特点识别（可复用视觉规律）

这一节是本包的地基。**提示词只是这些规律的投影**；规律错了，逐条提示词写得再细也会"每张图各是一个 App"。

### 1.1 材质层级：4 层，靠"三件套"分层而不是靠亮度差

| 层 | 名称 | 底色 | 分层手段 |
|---|---|---|---|
| L0 | 页面底 | `#0B0B0C` → `#121214` | — |
| L1 | 卡片面 | `#17181A` ~ `#1F2022` | 1px 内描边 `rgba(255,255,255,.06)` + 顶边内高光 `rgba(255,255,255,.05)` + 环境落影 `0 18px 40px rgba(0,0,0,.5)` |
| L2 | 卡内分区行 | `#1F2023` | 行分隔 `rgba(255,255,255,.045)`——**比卡的描边还要淡一档** |
| L3 | 悬浮层（底部导航 / 胶囊 / 弹层） | `rgba(36,37,40,.62)` | `backdrop-filter: blur(22px)` + 内高光 `.09` + 更重的落影 `0 16px 34px rgba(0,0,0,.6)`；**左右各不贴边 16–24px** |

**核心规律**：L0→L1 的亮度差只有约 8%（`#0B0B0C` → `#17181A`）。层级感**不来自明暗对比，来自"描边 + 内高光 + 投影"三件套**。

> 这条直接决定提示词怎么写：**一旦让 AI 把卡片画亮、或加上外发光/强阴影，气质立刻从"昂贵"掉到"廉价"**。所以每条提示词都要显式写"低对比内发光，外发光不透明度 ≤ 18%"。

**第三层级的隐藏规则**：卡内行分隔必须比卡描边**更淡**。参考图里这条线"几乎看不见"正是它显得高级的原因——写成同一浓度就会变成"网页表格"。

### 1.2 圆角：单调递增 + 同心嵌套（不是一组固定值）

以 390pt 设备宽为基准：

| 对象 | 半径 | 占自身宽度比 | Token |
|---|---|---|---|
| 图标底座 / 小嵌块 | 10–11px | 底座边长的 **30%** | `--r-s:10px` |
| 卡内分区块 | 14px | — | `--r-m:14px` |
| 卡片 | 22px | 卡宽 ≈ 5.6% | `--r-l:22px` |
| 英雄图卡 / 大卡 | 28px | — | `--r-xl:28px` |
| 胶囊 / 头像 / 导航 | 999px | 全圆 | — |

**同心规律（最易被忽略）**：卡内圆角 ≈ 外卡圆角 × 0.6（22 → 14）。**用同一半径会显脏**——这条要写进提示词，否则 AI 生成的卡内嵌块会和外卡圆角打架。

### 1.3 间距阶梯与关键比例

- 间距只走 `4 / 8 / 12 / 16 / 20 / 24`，卡内 padding 16–18px，卡间距 12–16px，区块间距 24–28px
- 列表行高 52–56px = 34px 图标底座 + 上下各 ~10px
- **图标底座 : 符号 = 34 : 18**（符号占底座约 52%，不撑满）
- **大数字 : 小标签 字号比 ≈ 4.2 : 1**（44px : 10.5px）。这个悬殊比是"昂贵感"的主要来源——比任何颜色都关键
- 大数字字距 **-0.03em ~ -0.04em**（紧凑），且必须 `tabular-nums`（等宽数字），否则金额滚动时数字会左右抖

### 1.4 文字灰度分层：4 阶，且"弱 = 更小 + 更灰"两者同向

| 阶 | 色值 | 用途 | 相对亮度 |
|---|---|---|---|
| T1 主 | `#F5F6F7` | 金额、标题 | 100% |
| T2 次 | `#A2A4AB` | 行右侧数值、正文 | ~64% |
| T3 弱 | `#7A7C83` | 分区标题（Savings / Transactions） | ~47% |
| T4 最弱 | `#5C5E65` | "View all ›"、单位、轴刻度 | ~35% |

**规律**：每降一阶亮度约 **-35%**，同时**字号同步下降**。唯一例外是 "View all ›" 与坐标轴刻度——它们是小字号 + 最弱灰的"非操作文本"，**不得承载任何主操作**（若把主 CTA 做成这个颜色，可点击性会归零）。

### 1.5 动效暗示：从静态图能反推出来的 7 条

静态参考图里没有动效，但结构 100% 限定了动效该长什么样。这些要写进"动效暗示"栏交给前端，而不是交给生图。

1. **胶囊选中**：白底从 0 → 100% **横向擦入**（不是淡入），240ms，`cubic-bezier(.2,.8,.2,1)`
2. **折线图入场**：`stroke-dasharray` 描线，1.2s 从左画到右；渐变填充随后 400ms 淡入；数值标签逐位滚动
3. **毛玻璃导航**：内容滚动时 `blur` 22→28px、底透明度 `.62→.78` 微增（暗示下方有内容在动）
4. **卡片按下**：`scale .985` + **内高光不透明度 .05→.10**——"内高光呼吸"，禁止加外发光
5. **图标底座选中**：只提亮内高光，**底色不变**（禁止改变底座底色，否则 7 个图标会花掉）
6. **语音录音**：长按后青柠 `#C8F169` 环形声波 3 圈错峰扩散，间隔 120ms
7. **全局**：`--ease:cubic-bezier(.2,.8,.2,1)` / `--dur:200ms`，无一处弹跳（bounce）曲线

### 1.6 色彩语义分工（**先定语义，再定色值**）

| 语义 | 色 | 出现面积上限 |
|---|---|---|
| 数据 / 正向 / 选中 | 青柠 `#C8F169`（暗阶 `#8FBF3A`） | 全屏 ≤ 5% |
| **支出** | 铜橙 `#D9794F` | 仅支出数值与支出图例 |
| **唯一的强色块** | 蓝色渐变 `#7FE3FF → #3B6FE0 → #2A2F8F` | 只出现在那**一张**资产卡上 |

参考图第 11 条原话「蓝色卡面是唯一的强色块」是一条**可执行的配额约束**：整屏只允许一个大面积饱和块。这条要作为验收项，而不是形容词。

---

## 2. 全局锁定词与负面基底（每条提示词复用，不得改写）

**风格锁定（中）**：极简高级金融科技质感 / 近黑底低饱和 / 单一高饱和强调色 / 柔和**内**发光 / 细腻胶片颗粒 ≤ 4% / 几何精确圆角 / 圆角同心 / 无镜面反射 / 无外发光 / 无可见描边毛边

**Style lock (EN)**: `premium fintech minimalism, near-black dark-first, low-saturation substrate with exactly one high-saturation accent, soft INNER glow only, fine film grain at or below 4%, geometrically exact and concentric radii, no specular gloss, no outer bloom, crisp anti-aliased edges`

**负面基底（中）**：文字、汉字、字母、数字、logo、水印、签名、二维码、人脸、手、肢体、3D 塑料玩具感、卡通吉祥物、厚描边、扁平纯线性图标、彩虹多色、脏渐变、色带断层、高光镜面反射、镜头光晕、景深虚化、外发光、纯白背景、纯灰方块、拼贴、边框、阴影错乱、低分辨率、锯齿

**Negative base (EN)**: `text, letters, numbers, logo, watermark, signature, QR code, face, hands, limbs, 3D plastic toy, cartoon mascot, thick outlines, flat pure line-art, rainbow multicolor, muddy gradient, banding, specular glare, lens flare, depth of field blur, outer bloom, pure white background, plain gray box, collage, frame, broken shadows, low resolution, jaggies`

**平台适配（同一提示词的三种投喂形态）**
| 平台 | 处理方式 |
|---|---|
| Midjourney | 原样使用，尾部 `--ar 1:1 --seed 1024 --style raw --no <负面词逗号分隔>` |
| Flux / DALL·E | **删掉参数行**；负面词改写成正向句（"画面中不出现任何文字或字母"）；色值 HEX 保留（Flux 对 HEX 敏感） |
| Stable Diffusion | 负面词填入 negative prompt 字段；HEX 需配合 ControlNet 或 IP-Adapter 才能稳定命中 |

---

## 3. A · App 图标（1024×1024）

**语义**：语音（声波）× 记账（账本切片）。**不要文字**。参考图设定「深色底 + 青柠或铜橙单色符号」，故给双色变体。

### 3.1 主提示词（中文）

```
App 图标，1:1 正方形 1024×1024，iOS 圆角方形安全区（圆角半径 ≈ 边长 22%，四角留 ≥ 64px 安全边距，符号整体控制在中心 72% 区域内）。
主体：一个由三条垂直圆角声波柱演化而来的抽象符号——三柱等距排列、中间最高、两侧对称递减，柱体两端完全圆角；符号底部并入一个极简账本切片轮廓（开口向右的圆角矩形残片），读作"声音从账本中升起"。
风格与材质：近黑底极简金融科技图标；符号为**单色均匀笔画 + 局部实心填充**，笔画行程统一 16–18px，圆角端帽；符号内部与周围**不允许外发光**。
光照与色调：无外部光源，符号为**柔和内发光**（内发光不透明度 ≤ 18%，无向外扩散的光晕）；整体冷黑底 + 单一强调色，不出现第二种色相。
背景：#0B0B0C 近黑径向渐变，中心略亮至 #17181A 后向边缘回落至近黑，叠加 ≤ 4% 强度细颗粒；四角略暗。
镜头/渲染：正交投影，无透视、无景深；符号居中并按视觉重心上移 1.5% 做光学对齐；抗锯齿干净。
色值锚点：底 #0B0B0C / #17181A / #1F2022；符号 #C8F169，暗阶 #8FBF3A，柱顶高光 #EBFFB0（备选：符号改为铜橙 #D9794F，暗阶 #A8402F）
宽高比：1:1（1024×1024）
负面提示词：文字、汉字、字母、数字、logo 水印、签名、¥ 符号、$ 符号、硬币、写实钞票、银行卡、3D 塑料玩具感、卡通吉祥物、厚描边、扁平线性图标、多色、彩虹渐变、脏渐变、外发光光晕、镜头光晕、高光镜面反射、景深虚化、纯白背景、白色描边、边框、拼贴、低分辨率、锯齿
随机种子：--seed 1024（主方向）；变体 --seed 1729 / --seed 2600；一图多图同时出：--seed 1024 --chaos 12
```

### 3.2 主提示词（English）

```
App icon, 1:1, 1024x1024, iOS rounded-square safe area (corner radius about 22% of the side, 64px+ margin at every corner, glyph confined to the central 72%).
Subject: an abstract mark evolved from three vertical rounded sound-wave bars — evenly spaced, tallest in the middle, symmetrically tapering outward, both ends fully rounded; at its base the glyph merges into a minimal ledger-slice silhouette (a rounded rectangle fragment open to the right), reading as "sound rising out of a ledger".
Style and material: near-black minimal fintech icon; the glyph is a single-hue uniform-weight stroke with selective solid fills, 16-18px stroke weight, rounded caps; NO outer glow anywhere around the glyph.
Lighting and tone: no external light source; the glyph is softly self-luminous from the INSIDE only (inner glow opacity at or below 18 percent, no bloom spreading outward); cool near-black base plus exactly one accent hue, no second hue.
Background: #0B0B0C near-black radial gradient, center lifting slightly to #17181A then falling back to near-black at the edges, with fine grain at or below 4 percent; corners slightly darker.
Camera/render: orthographic, no perspective, no depth of field; glyph centered and optically aligned (visual center about 1.5 percent above geometric center); clean anti-aliasing.
Color anchors: base #0B0B0C / #17181A / #1F2022; glyph #C8F169, shadow step #8FBF3A, tip highlight #EBFFB0 (alternate: glyph in copper #D9794F, shadow step #A8402F).
Aspect ratio: 1:1 (1024x1024)
Negative prompt: text, letters, numbers, logo, watermark, signature, currency symbols, coins, photorealistic banknotes, bank card, 3D plastic toy, cartoon mascot, thick outlines, flat line-art icon, multicolor, rainbow gradient, muddy gradient, outer glow, bloom, lens flare, specular glare, depth of field blur, pure white background, white stroke, frame, collage, low resolution, jaggies
Seed: --seed 1024 (primary); variants --seed 1729 / --seed 2600; multi-draft --seed 1024 --chaos 12
```

### 3.3 三个符号方向（同参数，只换"主体"句）

| 编号 | 主体（中） | Subject (EN) | 判断 |
|---|---|---|---|
| A | 三条圆角声波柱并入账本切片 | three rounded sound bars merging into a ledger slice | 语义最完整，推荐 |
| B | 麦克风胶囊 + 下部短柄，叠加一条上行折线 | rounded microphone capsule with a short stem plus an ascending polyline | 语音优先，识别度最高 |
| C | 开口圆环内的圆角账页残片，环上两段声波短纹 | rounded ledger-page fragment inside an open ring with two short wave ticks on the ring | 最抽象、最像"品牌符号" |

> **图标不要用 AI 位图当最终定稿**。扩散模型画单色几何符号必然出现柱体粗细不匀、圆角不圆。推荐流程：AI 出 6–8 张**选形** → 矢量工具重绘 → 双资产交付：`icon-1024.png`（iOS 提交）+ `icon-symbol.svg`（页面内联，< 4KB）。

---

## 4. B · "本月支出"资产对象卡（3:2）

**要点**：保留参考图第 9 条那个"发光体块"的体积感，但语义从**银行卡**换成**账本切片**——不是卡，是账本的一刀切面。

⚠️ **本资产默认不生图**：v2 已实测 CSS 可做出体积感（见 §9 实测 1）。生图版本仅在"CSS 版仍嫌不够"时启用。

### 4.1 主提示词（中文）

```
一张悬浮的抽象渐变资产卡片，3:2 横版，圆角半径约为短边的 12%，卡片带轻微 2.5D 倾斜（绕 X 轴 +12°、绕 Y 轴 -16°），有可信的物理厚度（6–10px 的深色侧边体块，侧边色 #101438）。
主体：卡面不是银行卡，而是抽象的"账本切片"——表面为左上到右下的柔和渐变，叠加 3–4 条极淡的等距横线暗纹暗示账本行线（不透明度 ≤ 8%），右下角有一小片向外溢散的光。
材质：磨砂玻璃与拉丝金属之间的微光泽面，**无强镜面反射**；仅有一道宽而软的高光带斜穿左上区域（覆盖宽度约 35%，不透明度 ≤ 22%）。
光照与色调：深色环境光，主光来自左上 45°，卡片自身微发光（外发光厚度 ≤ 40px，冷蓝）；
渐变锚点：左上 #7FE3FF → 中部 #3B6FE0 → 右下 #2A2F8F，四角压暗至 #101438。
场景：置于 #0B0B0C 近黑底上，卡片下方有柔和椭圆接触阴影（模糊半径约卡片宽 15%，不透明度 ≤ 35%），保证与底色拉开层次。
镜头/渲染：近正交 + 轻微长焦压缩（等效 85mm），无景深虚化，卡片整体锐利；全局细颗粒 ≤ 4%。
色值锚点：#0B0B0C / #17181A / #7FE3FF / #3B6FE0 / #2A2F8F / #101438 / #C8F169（仅用于一处 ≤ 2% 面积的强调点）
宽高比：3:2（1800×1200）
负面提示词：文字、数字、芯片、银行卡、卡号、Visa、Mastercard、银联标识、写实银行卡、人民币、硬币、人物、手、3D 塑料玩具感、强镜面高光、外发光光晕过强、镜头光晕、彩虹多色、脏渐变、色带断层、纯白背景、纯灰背景、边框、拼贴、景深虚化、低分辨率
随机种子：--seed 2025（主）；变体 --seed 3141 / --seed 4096
```

### 4.2 主提示词（English）

```
A hovering abstract gradient asset card, 3:2 landscape, corner radius about 12% of the short side, subtly tilted in 2.5D (X-axis +12 deg, Y-axis -16 deg) with believable physical thickness (a 6-10px dark extruded side face in #101438).
Subject: the face is not a bank card but an abstract "ledger slice" — a soft top-left to bottom-right gradient overlaid with 3-4 very faint evenly spaced horizontal rules hinting at ledger lines (opacity at or below 8 percent), with a small outward light spill at the lower-right.
Material: a micro-sheen surface between frosted glass and brushed metal, NO hard specular reflection; only one wide soft highlight band crossing the upper-left at about 35 percent coverage and at or below 22 percent opacity.
Lighting and tone: dark ambient, key light from the upper-left at 45 degrees, the card faintly self-luminous (cool blue outer glow, 40px thick or less); gradient anchors upper-left #7FE3FF to mid #3B6FE0 to lower-right #2A2F8F, corners pushed dark to #101438.
Scene: on a #0B0B0C near-black ground, with a soft elliptical contact shadow beneath the card (blur about 15 percent of card width, opacity at or below 35 percent) so it separates cleanly from the background.
Camera/render: near-orthographic with mild telephoto compression (85mm equivalent), no depth-of-field blur, card fully sharp; global grain at or below 4 percent.
Color anchors: #0B0B0C / #17181A / #7FE3FF / #3B6FE0 / #2A2F8F / #101438 / #C8F169 (accent on at most 2 percent of area)
Aspect ratio: 3:2 (1800x1200)
Negative prompt: text, numbers, chip, bank card, card number, Visa, Mastercard, UnionPay marks, photorealistic bank card, currency, coins, people, hands, 3D plastic toy look, hard specular highlight, heavy outer bloom, lens flare, rainbow multicolor, muddy gradient, banding, pure white background, plain gray background, frame, collage, depth of field blur, low resolution
Seed: --seed 2025 (primary); variants --seed 3141 / --seed 4096
```

**商标风险（必须写进负面词）**：参考图的卡面是 VISA。**任何 Visa / Mastercard / 银联标识都不得进入产出物**，这既是商标问题，也是把"银行卡"语义纠正为"账本切片"的关键。

---

## 5. C · 空状态插画（1:1 × 2）

铁律：**低对比、可置于卡片内、不抢正文**。成功标准不是"好看"，而是"放进 `#17181A` 卡片后几乎不抢注意力"。
⚠️ **强烈建议不要生图，改用内联 SVG**（理由见 §5.3）。

### 5.1 空状态 A —— 记账空态（还没有任何一笔记录）

**中文**
```
正方形插画，1:1，极简单色线性几何风格，用于近黑 App 的记账空状态。
主体：画面中心偏下是一本合上的极简账本（圆角矩形，厚度仅由一条 6px 底边暗示），账本上方漂浮 2–3 条长短不一的圆角声波短柱，最右一条微微倾斜，暗示"等待第一句话"。
风格与材质：单色描边，1024px 画布上描边宽度统一 8px，圆角端帽与圆角连接，零填充块面；不使用跨色相渐变，只用同一色相的明度阶梯。
光照与色调：无投影、无光源方向，纯图形化；线条 #5C5E65 最弱灰，仅声波柱顶端 20% 段落提亮至 #A2A4AB；允许最右一条声波柱使用低饱和青柠 #8FBF3A（面积 ≤ 3%）。
背景：#17181A 卡片底色，纯色，无渐变、无纹理、无暗角，四角留白 ≥ 画布 18%。
镜头/渲染：正交投影，等宽线条，抗锯齿干净，无景深、无颗粒。
色值锚点：#17181A / #5C5E65 / #A2A4AB / #8FBF3A
宽高比：1:1（1024×1024）
负面提示词：文字、汉字、数字、人物、人脸、手、卡通角色、吉祥物、3D 立体感、塑料质感、厚描边、多色、彩虹、渐变背景、白色背景、阴影、噪点、纹理、贴纸边框、拼贴、过曝、低分辨率、锯齿
随机种子：--seed 606（主）；变体 --seed 616 / --seed 626
```

**English**
```
Square illustration, 1:1, minimal monochrome linear-geometric, for the empty state of a near-black bookkeeping app.
Subject: slightly below center sits a closed minimal ledger (rounded rectangle, thickness implied by a single 6px bottom edge); two or three rounded sound-wave bars of differing lengths float above it, the rightmost faintly tilted, reading as "waiting for the first sentence".
Style and material: monochrome strokes, uniform 8px weight on a 1024px canvas, rounded caps and joins, zero filled masses; no cross-hue gradients, only value steps within one hue.
Lighting and tone: no cast shadow, no light direction, purely graphic; strokes #5C5E65 (weakest gray), with only the top 20 percent of each wave bar lifted to #A2A4AB; one bar may carry desaturated lime #8FBF3A on at most 3 percent of area.
Background: flat #17181A card color, no gradient, no texture, no vignette, 18 percent or more padding on all sides.
Camera/render: orthographic, uniform stroke, clean anti-aliasing, no depth of field, no grain.
Color anchors: #17181A / #5C5E65 / #A2A4AB / #8FBF3A
Aspect ratio: 1:1 (1024x1024)
Negative prompt: text, letters, numbers, people, faces, hands, cartoon characters, mascot, 3D volume, plastic sheen, thick outlines, multicolor, rainbow, gradient background, white background, shadows, noise, texture, sticker border, collage, overexposure, low resolution, jaggies
Seed: --seed 606 (primary); variants --seed 616 / --seed 626
```

### 5.2 空状态 B —— 统计空态（还没有数据可统计）

**中文**
```
正方形插画，1:1，与"记账空态"共用同一套线条语言（同一描边宽度、同一色阶、同一留白），用于统计页空态。
主体：一条极简坐标轴（水平基线 + 左侧短竖轴），基线上立着 3 根高度几乎相同的极短圆角柱（仅占画布高度 8–12%），左上角漂浮一条断裂的上行折线（中段断开一小截），暗示"数据还没长起来"。
风格与材质：单色描边 8px，圆角端帽，零填充；不使用第二种线型，除断裂缺口外无任何装饰。
光照与色调：无投影无光源；线条 #5C5E65，折线断口两端提亮至 #A2A4AB；3 根短柱顶面可用低饱和青柠 #8FBF3A（总面积 ≤ 4%）。
背景：#17181A 纯色卡片底，四角留白 ≥ 18%。
镜头/渲染：正交、等宽、干净抗锯齿、无景深无颗粒。
色值锚点：#17181A / #5C5E65 / #A2A4AB / #8FBF3A
宽高比：1:1（1024×1024）
负面提示词：同 5.1（文字、数字、人物、卡通角色、3D、厚描边、多色、渐变背景、白色背景、阴影、噪点、贴纸边框、低分辨率、锯齿）
随机种子：--seed 707（主）；变体 --seed 717 / --seed 727
```

**English**
```
Square illustration, 1:1, sharing the exact stroke language of the bookkeeping empty state (identical weight, value steps and padding), for the statistics empty state.
Subject: a minimal chart axis (horizontal baseline plus a short left vertical axis); three very short rounded bars of nearly equal height stand on the baseline occupying only 8-12 percent of canvas height; an ascending polyline floats upper-left with a small gap broken out of its middle, reading as "data has not grown yet".
Style and material: monochrome 8px strokes, rounded caps, zero fills; no second line style, no ornament beyond the broken gap.
Lighting and tone: no shadow, no light source; strokes #5C5E65, with the two ends flanking the polyline gap lifted to #A2A4AB; bar tops may use desaturated lime #8FBF3A on at most 4 percent of total area.
Background: flat #17181A card color with 18 percent or more padding on all sides.
Camera/render: orthographic, uniform stroke, clean anti-aliasing, no depth of field, no grain.
Color anchors: #17181A / #5C5E65 / #A2A4AB / #8FBF3A
Aspect ratio: 1:1 (1024x1024)
Negative prompt: same as the bookkeeping empty state (text, letters, numbers, people, cartoon characters, 3D, thick outlines, multicolor, gradient background, white background, shadows, noise, sticker border, low resolution, jaggies)
Seed: --seed 707 (primary); variants --seed 717 / --seed 727
```

### 5.3 为什么这两张建议不要生图

低对比单色线条插画在扩散模型里**几乎必然被"加戏"**：加体积、加阴影、加多色、加可爱化。而这三样恰好逐条违反本资产的硬要求（不抢正文）。**用 SVG 反而更省事且结果确定**。

---

## 6. D · 分类图标组（7 个，统一 1:1）

**质感定位**：参考图列表行左侧那种小图标——**有体积、有材质，但不是扁平线性，也不是 3D 玩具**。落在两者之间：**微光泽圆角瓷片底座 + 单色符号**（*soft-glossy tile icon* / *frosted chip icon*）。

### 6.1 主提示词（中文，以"餐饮"为例）

```
一个分类图标，1:1，用于近黑 App 支出列表行左侧。
主体：一个圆角方形底座（圆角半径 ≈ 底座边长 30%，底座占画布 72%，四周留白 14%），底座中央放置一个极简符号——叉子与勺子交叉，叉 3 齿、勺头半圆；符号整体占底座 52%，几何对称，笔画等宽（约 9px 行程），圆角端帽。
材质：底座为磨砂玻璃 / 软哑光陶瓷质感，表面有极淡的内发光（沿顶边，不透明度 ≤ 14%），**无强镜面高光、无高光条**；底座基色 #1F2022，向下略深至 #17181A 形成轻微体积。
符号色：#C8F169 青柠（单色），符号下部 30% 段落允许阶梯压至 #8FBF3A；不出现第二种色相。
光照与色调：柔和顶光（约 60°），两侧无轮廓光；整体低对比，底座与近黑底 #0B0B0C 拉开但不刺眼。
镜头/渲染：正交投影，无透视、无景深；抗锯齿干净，全局颗粒 ≤ 3%。
色值锚点：#0B0B0C / #17181A / #1F2022 / #C8F169 / #8FBF3A
宽高比：1:1（512×512）
负面提示词：文字、数字、标签、3D 塑料玩具感、卡通吉祥物、厚描边、扁平纯线性图标、写实照片、真实食物照片、多色、彩虹渐变、强镜面反射、高光条、外发光、阴影外溢、人物、手、白色背景、灰色方块、边框、贴纸、低分辨率、锯齿
随机种子：--seed 101（餐饮）；其余见 6.3
```

### 6.2 主提示词（English，餐饮示例）

```
A category icon, 1:1, for the left slot of an expense list row in a near-black app.
Subject: a rounded-square tile (corner radius about 30 percent of the tile side; the tile fills 72 percent of the canvas with 14 percent padding), with a minimal symbol centered inside — a crossed fork and spoon, the fork with 3 tines and the spoon head a half circle; the symbol fills 52 percent of the tile, geometrically symmetric, uniform stroke about 9px, rounded caps.
Material: the tile is frosted glass / soft matte ceramic with a very faint inner glow along its top edge (opacity at or below 14 percent), NO hard specular highlight and no highlight band; tile base #1F2022 easing darker toward the bottom to #17181A for slight volume.
Symbol color: #C8F169 lime (single hue); the lower 30 percent of the symbol may step down to #8FBF3A; no second hue anywhere.
Lighting and tone: soft key from above (about 60 degrees), no rim light; overall low contrast, the tile separating from the #0B0B0C near-black background without glare.
Camera/render: orthographic, no perspective, no depth of field; clean anti-aliasing, global grain at or below 3 percent.
Color anchors: #0B0B0C / #17181A / #1F2022 / #C8F169 / #8FBF3A
Aspect ratio: 1:1 (512x512)
Negative prompt: text, numbers, labels, 3D plastic toy look, cartoon mascot, thick outlines, flat pure line-art, photorealistic, real food photography, multicolor, rainbow gradient, hard specular reflection, highlight band, outer glow, shadow spill, people, hands, white background, gray box, frame, sticker, low resolution, jaggies
Seed: --seed 101 (food); remaining seeds in 6.3
```

### 6.3 七个符号清单（同一套参数，只替换"符号"一句）

| # | 分类 | 符号（中） | Symbol (EN) | 种子 |
|---|---|---|---|---|
| 1 | 餐饮 | 叉子与勺子交叉，叉 3 齿、勺头半圆 | crossed fork and spoon, 3-tine fork, half-circle spoon | `--seed 101` |
| 2 | 交通 | 侧视流线车体轮廓，两轮为等大圆环，车顶一条水平圆角线 | side-view streamlined car body, two equal ring wheels, one horizontal rounded roofline | `--seed 102` |
| 3 | 购物 | 圆角购物袋，提手为开口向上的半圆，袋身一条竖向折痕 | rounded shopping bag, semicircular open handle, one vertical crease | `--seed 103` |
| 4 | 居住 | 三角屋顶压在圆角方形墙体上，墙面两扇小方窗，底部一条基线 | triangular roof over a rounded-square wall, two small square windows, one baseline | `--seed 104` |
| 5 | 娱乐 | 八分音符，符头圆角椭圆，符杆向右上，尾部一条短弧 | eighth note, rounded oval head, stem rising right, one short flag arc | `--seed 105` |
| 6 | 其他 | 三个等距水平圆点居左，右侧一条竖直圆角短柱 | three evenly spaced horizontal dots at left, one vertical rounded bar at right | `--seed 106` |
| 7 | 未分类 | 圆角方形虚线轮廓（8 段等长虚线），中央圆角问号 | rounded-square dashed outline (8 equal dashes), a rounded question mark centered | `--seed 107` |

### 6.4 一致性生成法（按可靠性排序）

1. **推荐**：一次生成一张 **4×2 网格图**（1500×750，第 8 格留空），提示词写"同一套图标以 4 列 2 行网格排布，风格、底座尺寸、描边宽度、配色完全一致"，间距均匀、每格留白一致；再由切图工具切出 7 张 512×512。一致性由**同一张图内的自监督**保证。`--seed 1001`，负面词叠加"网格线、分隔线、编号、格间阴影"。
2. **备选**：先出 1 张定调图，再图生图（image-to-image，强度 0.35–0.5）逐张换符号，锁死底座。
3. **最稳**：底座与 7 个符号**全部写成 SVG**（见 §8）。这一组几何规整度用 SVG 手写比生图更可控，体积也更小。

---

## 7. E · 统计页氛围纹理（16:9，可选）

**用途硬限定**：**仅作卡片内衬**。对比度上限比"好看"重要得多。
⚠️ **本资产用 CSS，不生图**（已实测，见 §9 实测 2）。

**中文**
```
16:9 极淡抽象纹理，仅用作近黑统计卡片的内部底纹。
主体：一幅几乎无内容的抽象场——极淡的同心等距曲线（5–6 条）从右下角向外扩散，叠加一层极淡的 45° 斜向细网格（线宽 1px、间距约 48px），两者都极低对比。
风格与材质：纯色相内变化，无第二种色相；无纹理贴图、无噪点块、无光斑；线条不透明度 ≤ 6%，网格不透明度 ≤ 4%。
光照与色调：整体为 #0B0B0C 至 #17181A 的缓慢径向渐变（亮部集中在中上偏左），青柠仅在右下角以 ≤ 2% 不透明度出现一次。
镜头/渲染：正交平面，无透视、无景深、无颗粒；必须在 60% 缩放与 1x 屏幕上都不出现色带。
色值锚点：#0B0B0C / #17181A / #1F2022 / #C8F169（≤ 2% 不透明度）
宽高比：16:9（1920×1080）
负面提示词：文字、数字、图表、折线图、柱状图、K 线、股票、数据可视化、光斑、星云、烟雾、粒子、噪点、脏渐变、色带断层、波浪明显、高对比、霓虹、彩虹、人物、物体、边框、白色、低分辨率
随机种子：--seed 808
```

**English**
```
16:9 ultra-faint abstract texture, intended only as an inner substrate for a near-black statistics card.
Subject: an almost contentless field — very faint concentric evenly spaced curves (5-6) radiating from the lower-right corner, overlaid with an ultra-faint 45-degree fine grid (1px lines, about 48px spacing), both at extremely low contrast.
Style and material: value changes within a single hue, no second hue; no texture maps, no noise blobs, no light spots; curve opacity at or below 6 percent, grid opacity at or below 4 percent.
Lighting and tone: a slow radial gradient from #0B0B0C to #17181A (bright region upper-center-left); lime appears exactly once as an ultra-faint bloom at the lower-right at 2 percent opacity or less.
Camera/render: flat orthographic, no perspective, no depth of field, no grain; must show no banding at 60 percent zoom or on a 1x display.
Color anchors: #0B0B0C / #17181A / #1F2022 / #C8F169 (at 2 percent opacity or below)
Aspect ratio: 16:9 (1920x1080)
Negative prompt: text, numbers, charts, line charts, bar charts, candlesticks, stock, data visualization, light spots, nebula, smoke, particles, noise, muddy gradient, banding, visible waves, high contrast, neon, rainbow, people, objects, frame, white, low resolution
Seed: --seed 808
```

---

## 8. 哪些资产**不必生图**（判定表）

判定原则：**能用确定性代码画出来的东西，不要给概率模型画。**

| 资产 | 需生图？ | 代码方案 | 结论 | 实测 |
|---|---|---|---|---|
| **App 图标** | ✅ 需要 | 符号可 SVG 重绘，但"发光符号压在近黑渐变上"的整体氛围值得先出 6–8 张选形 | **生图选形 → SVG 定稿** | 未实测 |
| **B 资产对象卡** | ❌ 默认不必 | `linear-gradient(135deg,#7FE3FF,#3B6FE0 55%,#2A2F8F)` + `border-radius:22px` + 内高光 `inset 0 1px 0 rgba(255,255,255,.35)` + 斜向高光带 `::before{linear-gradient(115deg,rgba(255,255,255,.22),transparent 44%)}` + 账本横线暗纹 `repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 22px)` + 接触阴影 `0 24px 60px rgba(59,111,224,.28)` + **厚度用"挤出法"**：`preserve-3d` + `transform:rotateX(12deg) rotateY(-16deg)` + 一枚 `translateZ(-12px)` 的侧边层，侧边层用 8–10 层 `box-shadow` 逐像素外推 | **用 CSS** | ✅ **实测通过** |
| **D 分类图标组** | ⚠️ 可选 | 底座 = `div` + `linear-gradient(180deg,#1F2022,#17181A)` + `border-radius:10px` + `inset 0 1px 0 rgba(255,255,255,.08)` 内高光；符号 = 内联 SVG（7 个符号都极简） | **走 SVG**；生图仅用于看质感方向 | 未逐符号实测，底座已实测 |
| **C 空状态 ×2** | ⚠️ 可选 | 与分类图标同源的 SVG 线条 | **走 SVG**（理由见 §5.3） | 未实测 |
| **E 氛围纹理** | ❌ 无必要 | `radial-gradient(120% 90% at 20% 0%,#17181A,#0B0B0C 72%)` + `repeating-linear-gradient(45deg,rgba(255,255,255,.035) 0 1px,transparent 1px 48px)` + 右下角 `radial-gradient(circle,rgba(200,241,105,.06),transparent 70%)` + 4 条同心 SVG 弧 | **用 CSS，砍掉生图** | ✅ **实测通过** |
| **图表本体** | ❌ 无必要 | 内联 SVG（非图片）：`stroke-dasharray="5 7"` 极淡虚线网格 + `#C8F169` 折线 `stroke-width:2` + 渐变填充 `url(#f)` + 右侧 Y 轴刻度 HTML | **用 SVG，必须可数据驱动** | ✅ **实测通过** |

**净结论**：这套资产里真正**必须生图**的只有 **1 项（App 图标选形）**；另有 **2 项可选**（资产卡体积感、分类图标质感）。

> **不要为了用图而用图**。代码方案顺带解决了下面 §10 的体积、缩放清晰度、内嵌成本三个问题——生图在这三项上全是劣势。

---

## 9. 实测记录（本次交付的验证证据）

**实测 1 · CSS-only 资产卡是否真有体积感**
- 方法：写 `M3\css-smoke-test.html`，用无头 Chrome（1200px 宽，全页）渲染截图
- 第一版结果（`rotateX(6deg) rotateY(-8deg)` + 内阴影）：**失败**。卡片渲染成一个**平的**蓝色圆角矩形，倾斜几乎不可见，账本暗纹在该尺度下完全不可辨。→ 说明**"CSS 能做资产卡"在 v1 里是个未经验证的断言**
- 第二版结果：加 `perspective:1100px` + `transform-style:preserve-3d` + `rotateX(12deg) rotateY(-16deg)` + 一枚 `translateZ(-12px)` 的侧边层（8–10 层 `box-shadow` 逐像素外推做厚度）+ 右下径向"外溢光"层 → **通过**。卡片呈现出可辨的倾斜平面 + 左侧/下侧可见的深色厚度体块，与近黑底拉开层次
- **结论**：CSS 做资产卡**可行，但有前提**——必须用 `perspective` + `preserve-3d` + **挤出式侧边层**，光靠 `box-shadow` 偏移或 `inset` 内阴影做不出体积。此前提已写入 §8 的代码方案

**实测 2 · CSS-only 氛围纹理 + 图表 + 胶囊 + 毛玻璃导航**
- 同一份 HTML 内同时渲染：氛围纹理（径向底 + 45° 网格 + 青柠晕 + 同心弧）、三层材质栈（`#17181A` 卡 + `rgba(255,255,255,.045)` 行分隔 + 青柠图标底座）、胶囊筛选条（选中 `#FFFFFF` 底 + `#0B0B0C` 字）、悬浮毛玻璃导航（`rgba(36,37,40,.62)` + `backdrop-filter:blur(22px)`）、图表（`stroke-dasharray="5 7"` 虚线网格 + 青柠折线 + 渐变填充 + 右侧 Y 轴刻度）
- 结果：**全部按预期渲染**。环境纹理确实"极淡到近乎不可见"；胶囊白底/玻璃导航的层级差异肉眼可辨；图表右侧刻度与虚线网格符合参考图第 7 条
- 一处偏差：`backdrop-filter` 在近黑底上会因"背后无可模糊内容"而显得比预期**更亮更实**，观感偏灰白而非"半透明毛玻璃"。真机上需把导航底色调到 `rgba(30,31,34,.55)` 并降低内高光，才更接近参考图。**这条已计入 §12 待核对项**

---

## 10. 单文件 HTML 集成规范

### 10.1 每张资产的尺寸、体积上限、引用方式

| 资产 | 输出尺寸 | 格式 | 体积上限 | HTML 用法 |
|---|---|---|---|---|
| A 图标（提交用） | 1024×1024 | PNG（不透明） | ≤ 300KB | **不进页面**，仅 iOS 提交 |
| A 图标（页面用） | 180×180 显示 | **内联 SVG** | ≤ 4KB | **内嵌**（内联 `<svg>`，非 base64） |
| B 资产对象卡 | 600×400 显示 | **CSS** | **0KB** | 纯 CSS，见 §8 |
| B 资产卡（若生图） | 1600×1067 | WebP q82 | ≤ 260KB | **本地文件引用** `./assets/card.webp` |
| C 空状态 ×2 | 220×220 显示 | **内联 SVG** | 各 ≤ 6KB | **内嵌** |
| D 分类图标 ×7 | 34–44px 显示 | **内联 SVG symbol sprite** | ≤ 12KB（7 个合计） | **内嵌**，用 `<symbol>` + `<use>` |
| E 氛围纹理 | 自适应 | **CSS** | **0KB** | 纯 CSS |
| 图表 | 自适应 | **内联 SVG** | ≤ 8KB | **内嵌**，数据驱动 |

**内嵌总量预算：≤ 30KB**（图标 4 + 空态 12 + 分类图标 12 + 图表 8 已超，实际压到 ≤ 30KB 需精简，图表走 JS 生成则不计入）。

### 10.2 内嵌 base64 vs 本地文件引用（决策规则）

- **一律内嵌 SVG，不用 base64 位图**。理由：base64 体积 ×1.37，且**无法被 Gzip 有效压缩**；而内联 SVG 是文本，Gzip 后通常只剩 30–40%。一个 260KB 的 WebP 内嵌后变成约 356KB **不可压缩**文本。
- **唯一允许本地引用的**：B 资产卡若走生图（1600×1067 位图）。用 `./assets/card.webp` 相对路径，与 HTML 同目录交付。
- **"绝对只有一个文件"的降级路径**：资产卡改走 §8 的 CSS 挤出方案 → 整页**零位图**，自包含与体积两个目标同时成立。
- **照片类资产（见 §11）无法内嵌**：1200×800 的照片压到 ≤ 180KB 已是极限，内嵌后 ≈ 247KB 不可压缩文本。若坚持单文件，只能用 CSS 渐变占位图替代。

### 10.3 渲染注意

- 纯装饰资产（氛围纹理、分类图标底座）加 `aria-hidden="true"`；有语义的图标补 `role="img"` + `aria-label`
- 不用 `image-rendering:crisp-edges`（会让圆角锯齿）；保持 `auto`
- 深色底低对比插画：装饰插画不受 WCAG 对比度约束，但**其下方的文字必须仍满足 4.5:1**。空态插画压到 `#5C5E65` 就是为了不占正文的对比度预算
- 图标按 `40×40px` 显示、用 512px 源缩放，**不要用 72px 源放大**
- 玻璃导航必须提供 `@supports not (backdrop-filter: blur(1px))` 回退：退化为 `rgba(30,31,34,.92)` 实底

---

## 11. 清单外补充 · 英雄照片卡（参考图第 8 条，A–E 清单未覆盖）

参考图里有一张**照片卡**（麦田里戴帽子的女性 / 草地上的白鞋），带"人群图标 + 数字"角标和左下角图文叠层（`$0.00 / Travel`、`$10.00 / Lifestyle`）。**这是全清单里唯一无法用 CSS 生成的资产**——它是写实照片。

**建议**：优先用**正版图库照片**（Unsplash / Pexels 可商用），而非生图。理由是照片里会出现真实人脸与品牌特征，生图既慢又容易畸变；而图库照片分辨率、肤色、版权都更确定。

若确实需要生图，主提示词如下（**仅作备选**）：

```
一张写实照片，3:2 横版，用于近黑 App 的英雄卡片。
主体：一位戴宽檐草帽的女性侧身站在成熟麦田里，视线望向画外右侧，身体只占画面约 35%（左下），上方与右侧留出大面积天空与麦浪作为负空间，供 UI 文字叠加。
风格与材质：纪实摄影质感，自然肤质，不磨皮，不美颜；胶片色调，Kodak Portra 400 的柔和肤色与青灰阴影。
光照与色调：黄金时段侧逆光（太阳在画面右后方），发丝边缘有暖色轮廓光；整体压暗 -0.5EV，让画面能融进 #0B0B0C 的界面而不跳；天空由 #7FA8C9 渐变至 #E8C9A0。
镜头/渲染：85mm f/2，平视略俯 5°，浅景深（背景麦浪奶油般虚化），快门 1/500s 凝固，无闪光灯；轻微暗角。
色值锚点（用于后期对齐）：#E8C9A0 / #7FA8C9 / #4A3B2A / #0B0B0C（暗部需能压到此处）
宽高比：3:2（1800×1200）
负面提示词：文字、数字、UI 元素、水印、多人、正脸直视镜头、微笑摆拍、过度磨皮、塑料肤质、HDR 过曝、高饱和、霓虹色、镜头光晕、畸形手指、多余肢体、低分辨率、AI 塑料感
随机种子：--seed 5150（主）；变体 --seed 5250 / --seed 5350
```

**叠层规范（这部分是 CSS，不是图）**：角标 = 半透明胶囊 `rgba(11,11,12,.55)` + `backdrop-filter:blur(12px)`，位于左上 16px；左下文字 = 金额 `#F5F6F7` 20px/700 + 分类 `#A2A4AB` 11px，压一层从下往上 `linear-gradient(transparent,rgba(11,11,12,.78))` 的护底渐变保证可读性。

---

## 12. 交接给主理人的待核对项

1. **【阻断项】App 图标最终色**：参考图设定「青柠**或**铜橙」二选一。青柠 = 数据/正向语义；铜橙 = 支出语义。**图标是全 App 的品牌符号，选错会导致后续所有图表与选中态语义打架**。本包给两套色值，请在生图前确认。
2. **【阻断项】生图通道不可用**：本环境 `generate_image` 直接报错 `requires the Google Gemini API key; configure it in Settings > Plugins > Image generation`。**全部 5 组提示词未经任何真实模型验证**（无跑图、无体积实测）。需要主理人配置 API key，或指定另一可用平台。
3. **英雄照片卡的归属**：参考图有、A–E 清单没有。是（a）本版需要，走图库照片；（b）本版不要，卡片留 CSS 占位；（c）需要，且必须生图。我按 (a) 给了提示词与叠层规范。
4. **资产卡最终走 CSS 还是生图**：CSS 方案已实测可行（§9 实测 1），但那是**在 1200px 桌面渲染**下的结论；在 iPhone 真机 390pt 宽、2x/3x 屏上，`preserve-3d` 挤出的厚度层只有 8–10 个物理像素，观感可能明显弱于截图。**需要在真机或 375–430px 视口下复验一次**，再决定是否补生图。
5. **毛玻璃导航在近黑底上的观感**（§9 实测 2 偏差）：`rgba(36,37,40,.62)` 在近黑底上偏灰白、比参考图"重"。是否接受把底色调到 `rgba(30,31,34,.55)`？这会偏离参考图的实测取值。
6. **色板归属**：`prototype\记账App原型-v1.html` 当前是**浅色暖调**（`--bg:#F4F1EC`、`--accent:#C0623A`），深色变体只有 `#131519`；而 `design-system\_build.mjs` 里的系统 token 默认已是近黑（`--sys-bg:#0B0B0C`）。本包按近黑编写 —— 这是**替换原型现有色板**，还是**作为默认深色主题与浅色并存**？若并存，浅色下青柠须换成 `#3F6B12`（design-system 已如此处理）。
7. **铜橙的语义**：design-system 已把它定义为 `--sys-copper:#D9794F`（支出语义），原型的 `--accent:#C0623A` 是"唯一强调色"。本包按"青柠 = 强调 / 铜橙 = 支出"写。确认？
8. **体积硬指标**：我按"内嵌 ≤ 30KB / 全页 ≤ 120KB（零位图路径）"给的验收线。若有别的预算请给出，我按预算反推格式。
9. **是否需要逐平台版本**：本包以 Midjourney 语法为主（`--ar/--seed/--no`），并给了 Flux/DALL·E/SD 的转换规则（§2）。若主理人已确定平台，我可以直接出**去参数化的自然语言版**，去掉 `--ar/--seed` 改写为句式。

## 13. 证据与定位

**已读的本地证据**
- `M3\提示词包-深色语音记账App-v1.md`（38,503 字节，397 行）：v1 全包。v2 保留其色板锚点与种子体系，**推翻其一处未经验证的断言**（v1 §6 称资产卡"CSS 默认可用"，实测表明需 `preserve-3d` + 挤出层才成立）
- `design-system\_build.mjs`（39,307 字节）：已提取系统 token —— `--sys-bg:#0B0B0C` / `--sys-bg-2:#121214` / `--sys-card:#17181A` / `--sys-card-2:#1F2022` / `--sys-card-3:#242528` / `--sys-line:#26272B` / `--sys-ink:#F5F6F7` / `--sys-ink-2:#A2A4AB` / `--sys-ink-3:#7A7C83` / `--sys-ink-4:#5C5E65` / `--sys-lime:#C8F169` / `--sys-lime-deep:#8FBF3A` / `--sys-copper:#D9794F` / `--sys-danger:#FF6F5E` / `--gra-card:linear-gradient(135deg,#7FE3FF 0%,#3B6FE0 55%,#2A2F8F 100%)`；浅色主题 `--sys-lime:#3F6B12`（注：浅底需深青柠才够对比）。**本包的 T1–T4 四阶灰度直接取自这里，比 v1 的三阶更精确**
- `prototype\记账App原型-v1.html`（74,650 字节）：确认 `--bg:#F4F1EC` / `--surface:#FFFFFF` / `--accent:#C0623A`（注释「唯一强调色：支出语义」）/ `--pos:#2F7A68`；深色变体 `--bg:#131519` / `--surface:#1C1F24` / `--accent:#D9794F` / `--pos:#5FAF99`；圆角阶 `--r-s:10px/--r-m:14px/--r-l:22px/--r-xl:28px`
- `设计方案与验收记录-v1.md`（15,034 字节，199 行，本次读了前 60 行）：确认产品死口 —— **v1 仅支出、金额恒正**（D5）、货币只换符号不做汇率换算（D2）、删除分类软删并迁移到未分类（D4）。这三条决定了分类图标组**必须包含"未分类"**且**不需要"收入"语义图标**

**本次实际执行的测试**
- ✅ 测试 1：`M3\css-smoke-test.html` 无头 Chrome 渲染截图（1200×1124 全页，232,271 字节 → 修改后 175,102 字节）。结论见 §9
- ✅ 测试 2：同文件的氛围纹理 / 三层材质栈 / 胶囊 / 毛玻璃导航 / 图表渲染验证。结论见 §9
- ❌ **未执行**：任何生图模型调用。`generate_image` 返回 `Error: generate_image requires the Google Gemini API key; configure it in Settings > Plugins > Image generation.`
- ❌ **未执行**：网络检索（无需外部事实，全部依据为本地参考图描述与本地文件）
- ❌ **未实测**：导出体积（§10 的数字是基于常见 WebP/PNG 压缩率的**估算**，非实测）；真机 / 移动视口渲染

## 14. 风险与条件

| 级别 | 风险 | 说明与条件 |
|---|---|---|
| **高** | 提示词零验证 | 本环境无生图通道，**5 组提示词没有一张真图产出**。HEX 命中率、负面词强度、"无外发光"能否被模型遵守，全部未知。**在配置可用通道并跑出至少 A 图标 6 张选形图之前，不要把本包当作已验证交付** |
| **高** | 图标色未定 | 青柠 / 铜橙二选一未决。这是品牌符号，定了才能批量生图（§12-1） |
| **高** | 色板归属未决 | 原型仍为浅色暖调，design-system 已是近黑。两套并存的语义分工必须先定（§12-6） |
| **中** | CSS 体积感只在桌面验证 | §9 实测 1 是 1200px 桌面渲染；真机 390pt/3x 下 8–10px 厚度层可能几乎不可见。**需真机复验**（§12-4） |
| **中** | 分类图标一致性 | 逐张生成几乎必然跑风格。须接受"4×2 网格图切分"流程，或直接走 SVG |
| **中** | 单色几何符号的 AI 失真 | 扩散模型画单色几何必然出现粗细不匀、圆角不圆。**图标必须以 SVG 定稿**，AI 出图只作选形 |
| **中** | 毛玻璃在近黑底偏灰 | 实测 2 偏差：`backdrop-filter` 在近黑底上比预期更亮更实（§12-5） |
| **低** | 体积假设未实测 | §10 的 ≤300KB / ≤260KB 为估算，非实测 |
| **低** | 平台语法差异 | 按 Midjourney 语法写；Flux/DALL·E/SD 需转换（§2 给了规则，但未逐平台实测） |

## 15. 建议与验收

**建议执行顺序**
1. **先解 §12-1（图标色）+ §12-6（色板归属）**。这两个不做，后面全白做。
2. **配置生图通道**（§12-2），否则 A 图标无法产出。
3. A 图标：出 6–8 张选形（`--seed 1024/1729/2600` × 符号方向 A/B/C，或 `--seed 1024 --chaos 12` 一次多图）→ 选定后 SVG 重绘 → 交付 `icon-1024.png` + `icon-symbol.svg`
4. B 资产卡：**直接用 §8 的 CSS 方案**（已实测），真机复验体积感；不够再补生图
5. C 空状态 + D 分类图标：**直接走 SVG**，不做生图
6. E 氛围纹理：CSS，不做生图
7. 图表：内联 SVG，数据驱动
8. 收口：按 §10 组装，实测体积

**验收标准（可机械核对）**
- [ ] 卡片 `#17181A` 与底 `#0B0B0C` 在 1x 屏幕上**肉眼可分层**，且分层靠描边+内高光+投影三件套，不靠亮度差
- [ ] 卡内行分隔 `rgba(255,255,255,.045)` **比卡描边更淡**（截图取色验证）
- [ ] 卡内嵌块圆角 ≈ 外卡圆角 × 0.6（22 → 14），**圆角同心无脏边**
- [ ] 全屏 **青柠面积 ≤ 5%**，且**蓝色渐变只出现在资产卡这一处**（参考图第 11 条的配额约束）
- [ ] 大数字 `font-variant-numeric: tabular-nums` 生效，滚动时数字不左右抖
- [ ] 分类图标在 **34–44px 实际显示尺寸**下仍能区分 7 个符号（缩到真实尺寸再看一遍——最易被忽略的验收）
- [ ] 空态插画放进卡片后，**其上方正文对比度仍 ≥ 4.5:1**
- [ ] 图表 Y 轴刻度在**右侧**，网格为虚线且**极淡**
- [ ] `@supports not (backdrop-filter)` 回退生效，导航退化为实底
- [ ] 断网、无外部资源下打开完整；全页搜索无 > 100KB 的 base64 字符串
- [ ] 总位图请求数 = 0（零位图路径）或 = 1（资产卡生图路径）
