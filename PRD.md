# PRD · 语音记账 iOS App

> 本文件是需求与改动的**唯一登记处**。每条改动一个编号，写清问题、规则、状态。
> 状态取值：待确认 / 进行中 / 已实现 / 已废弃（附原因）。
> 编号规则：F 功能交付 · B 缺陷修复 · R 重构修复 · D 口径决策 · M 元改动（文档/工具链）。
> 工作规则见 [AGENTS.md](AGENTS.md)：新想法先进 TODO，决定要做先写本文件，等维护者确认再写代码。

## 改动登记

### M-001 · 建立开发文档体系

- 状态：已实现 ｜ 提出：2026-10-25 ｜ 落地：2026-10-25
- 问题：项目知识散落在设计稿、原型注释和会话记忆里，AI 在新对话里无法接续干活
- 规则：文档分工——README（访客门面）/ DEV.md（开发现状）/ PRD（改动登记+变更记录）/ TODO（停车场）/ AGENTS（AI 宪法）/ CLAUDE（一行导入）；同一件事只记一处，别处用链接
- 关联：[README.md](README.md) · [DEV.md](DEV.md) · [TODO.md](TODO.md) · [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md)

### F-001 · App 图标定稿

- 状态：待确认 ｜ 提出：2026-10-25
- 问题：三款 SVG 候选（M3/app-icon-a/b/c.svg）未选定最终图标；v3 §7.3 推荐 B（麦克风胶囊，40px 下降级优雅、语音语义最直白）
- 规则：从 A/B/C 选定一款 → 交付 `icon-1024.png`（iOS 提交用）+ 内联 SVG（页面用）；白符号在冰川蓝渐变上对比度已实测 7.58–8.82:1（U-4 已关闭）
- 关联：[M3 v3 §7](M3/提示词包-双模式-记账App-v3.md)

### F-002 · iOS 原生工程立项

- 状态：待确认 ｜ 提出：2026-10-25
- 问题：全部交付物都是 HTML 原型与设计文档，没有任何 Xcode 工程，产品无法落地
- 规则：按设计文档 §7 技术栈（SwiftUI + SwiftData + Swift Charts + SpeechAnalyzer，iOS 26+，无三方 SDK 硬依赖）；先 4 Tab 骨架 + 数据模型 + 手动记账闭环，再上语音链路；首版范围 = D1–D7 / E1–E2 已定口径
- 阻塞：本工作区为 Windows，无 Xcode/真机信息，需先确认开发环境（见 TODO T-002）
- 关联：[设计方案与验收记录-v1.md §7](设计方案与验收记录-v1.md)

### R-001 · 修复 design-system/_build.mjs

- 状态：待确认 ｜ 提出：2026-10-25
- 问题：残缺件——只导出 `{ OUT, HEAD, ICONS, svg }`，从不装配落盘，`node _build.mjs` 不产出任何文件；OUT 指向 OneDrive 桌面路径且文件名还是"深色金融风-v1"（v3 已是双模式）；令牌未同步 v3
- 规则：按 v3 §2 同步令牌（`--r-m` 16px→14px、`--sys-ink-3` #7A7C83→#85878E、`--sys-ink-4` 降为非文本专用、浅色底 #F4F1EC→#EFF1F4 冷调）；并二选一——修好到能产出设计系统 HTML，或改手工维护并删掉脚本
- 关联：[M3 v3 §6.4](M3/提示词包-双模式-记账App-v3.md) · [design-system/_build.mjs](design-system/_build.mjs)

### F-003 · GitHub 开源发布（voice-ledger）

- 状态：已实现 ｜ 提出：2026-10-25 ｜ 落地：2026-10-25（当日两版：先发精简版，随后按融合方案定稿）
- 问题：项目成果只存在于本地工作区，没有对外的开源发布形态
- 规则：公开仓库 = 本工作区全部产品资产 + 过程文档（README 访客门面 / DEV 现状 / PRD / TODO / AGENTS / CLAUDE）+ tools/ 验证工具链 + docs/screenshots/ 截图；排除 .proto-check、graphflow、记忆等工具工作区（.gitignore）；MIT License（署名黄鑫浚）；公开；四套验证在新目录复跑通过（35/50/82/100）
- 备注：沙箱代理封禁 github.com，git 直推被拒（502），改走 GitHub API 建 commit；远端 commit 与本工作区 commit 树相同、sha 不同，本机首次推送需先 `--force`（或重新 clone）
- 关联：https://github.com/OneStar1107/voice-ledger

### M-002 · README/DEV 分工调整与路由修正

- 状态：已实现 ｜ 提出：2026-10-25 ｜ 落地：2026-10-25
- 问题：02:50 工作区结构改造后，README.md 换成访客导向门面、原"现状"内容移入 DEV.md，AGENTS.md 路由表仍指向 README，宪法与现实不一致
- 规则：现状/已知问题/下一步唯一记在 DEV.md；README.md 只放访客门面（项目介绍、功能、快速开始），不记状态；AGENTS.md 的路由表、启动顺序、收尾第三步、目录速查同步更新；过程文档中"主人"统一改为"维护者"（公开仓库可见性）
- 关联：[AGENTS.md](AGENTS.md) §1/§3/§4 · [DEV.md](DEV.md) · [README.md](README.md)

## 变更记录

| 日期 | 编号 | 动作 | 说明 |
|---|---|---|---|
| 2026-10-25 | M-001 | 已实现 | 建立文档六件套；预置 F-001/F-002/R-001 三条待确认条目 |
| 2026-10-25 | F-003 | 已实现 | 开源仓库 voice-ledger 上线（MIT，公开）；工具链在新目录复跑全绿（35/50/82/100） |
| 2026-10-25 | F-003 | 已实现（融合定稿） | 按 C 融合方案重定稿：门面用工作区 README/DEV/LICENSE + tools/ 工具链 + 8 张截图；clone 地址填实 |
| 2026-10-25 | M-002 | 已实现 | README/DEV 分工落地；路由表改指向 DEV.md；过程文档「主人」改「维护者」 |
