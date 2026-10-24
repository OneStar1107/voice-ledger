# AGENTS.md · 语音记账 iOS App · AI 工作宪法

> 任何 AI 助手在本项目干活前，先读本文件。[CLAUDE.md](CLAUDE.md) 已用一行 `@AGENTS.md` 导入本文件。
> 新会话启动顺序：本文件 → [DEV.md](DEV.md)（现状）→ [README.md](README.md)（访客门面）→ [PRD.md](PRD.md)（待办改动）→ [TODO.md](TODO.md)（停车场）。
> 项目一句话：iOS 原生语音记账 App（v1 仅支出），原型与设计已定稿，原生工程未启动。

## 1. 信息路由（一件事只记一处）

| 这类信息 | 唯一记在 | 别处怎么办 |
|---|---|---|
| 项目现状 / 已知问题 / 下一步 | [DEV.md](DEV.md) | README 只放访客门面，不记状态 |
| 访客/产品介绍（门面） | [README.md](README.md) | 不放状态与待办 |
| 需求、改动、规则、验收标准 | [PRD.md](PRD.md)（带编号） | DEV.md 摘要 + 链接 |
| 每次改动的历史 | PRD.md 文末「变更记录」 | 不另建 CHANGELOG |
| 暂不做的事、新想法、待拍板 | [TODO.md](TODO.md) | 决定做了移进 PRD，原项勾选并注明结论位置 |
| AI 怎么工作（路由/流程/收尾） | 本文件 | — |
| 历史设计依据（口径/视觉/原型） | 设计方案与验收记录-v1.md · M3/ · prototype/ | 只读；新结论写进 PRD 并链接回出处 |

## 2. 三道闸（顺序不能反）

1. **新想法 → 先记 [TODO.md](TODO.md)**，不当场动手；
2. **决定要做 → 先写进 [PRD.md](PRD.md)**（编号 + 问题 + 规则 + 状态=待确认），等维护者确认；
3. **维护者确认后 → 才写代码。**

同一件事只记一处，别处用链接，不复制内容。

## 3. 收尾五步（缺一项不算完成）

每次开发做完，必须依次做：

1. PRD 对应条目标「已实现」（实现与规则有出入，同步改规则并注明）；
2. PRD 补一行变更记录（日期 / 编号 / 动作 / 说明）；
3. DEV.md 的「当前状态 / 已知问题 / 下一步」更新到最新；
4. 来自 TODO 的事项勾掉，注明结论写在哪（PRD 编号或文件）；
5. 在回复里列出本次回写了哪些文件。

## 4. 目录速查

| 路径 | 是什么 | 能不能改 |
|---|---|---|
| README.md | 访客门面：项目介绍、功能、快速开始 | 按 §1 维护，不放状态 |
| DEV.md | 开发现状：状态 / 已知问题 / 下一步 | 按 §1–§3 维护 |
| PRD.md / TODO.md / AGENTS.md / CLAUDE.md | 改动登记 / 停车场 / 本文件 / 一行导入 | 按 §1–§3 维护 |
| 设计方案与验收记录-v1.md | v1 口径决策 D1–D7 / E1–E2 + 验收记录（2026-10-02 冻结） | 只读 |
| M3/ | 设计提示词包 v1–v3，v3 是当前视觉规范；card-faces.html 是 8 张卡面的真值 | 只读 |
| prototype/ | v1（冻结）/ v2（双模式定稿）可点击原型 | 只读，除非 PRD 批准新原型 |
| design-system/ | _build.mjs 残缺待修（见 PRD R-001） | 按 PRD 修 |
| tools/ | 验证工具链：六套检查脚本 + PIL 小工具（见下） | 可跑可加，勿删 |
| docs/screenshots/ | README 与验收用的截图 | 可补充 |
| .proto-check/ · graphflow-out/ · .graphflow/ · .workbuddy/ · install-gh-cli.* | 工具工作区，与产品无关 | 勿误改（已被 .gitignore 排除） |

验证脚本跑法（仓库根目录执行，tools/ 依赖 jsdom：`cd tools && npm install`）：

```
node tools/smoke.js           prototype/记账App原型-v1.html   # v1 契约 50 项
node tools/smoke-v2.js        prototype/记账App原型-v2.html   # v2 交互 100 项
node tools/static-audit.js    prototype/记账App原型-v1.html   # v1 静态 35 项
node tools/static-audit-v2.js prototype/记账App原型-v2.html   # v2 静态 82 项
node tools/glass-contrast.js  prototype/记账App原型-v2.html   # 毛玻璃对比度 12 组
node tools/lead-verify-v2.js  prototype/记账App原型-v2.html prototype/记账App原型-v1.html   # 字区对比度复验
```

## 5. 环境备注

- 本工作区为 Windows，无 Xcode/真机；iOS 工程的环境问题见 [PRD F-002](PRD.md)。
- 本环境无生图 API Key（[M3 v2 §9](M3/提示词包-深色语音记账App-v2.md)）；资产已全部 CSS/SVG 化，暂不阻塞。
- PRD 编号规则：F 功能交付 · B 缺陷修复 · R 重构修复 · D 口径决策 · M 元改动（文档/工具链）。
- 公开仓库：https://github.com/OneStar1107/voice-ledger（本工作区即其源；过程文档对公可见，行文用「维护者」指代仓库所有者）。
