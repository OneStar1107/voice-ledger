# 语音记账 iOS App（开发状态备忘）

> 本文件原是仓库 README（开发协作导向）。2026-10-25 起，对外 README 改为"访客 + 设计思路"导向，原内容移至此处，供开发协作者使用。
> 路由规则见 [AGENTS.md](AGENTS.md)：现状只记在本文件，README 只放门面。

iOS 原生语音记账 App（v1 仅支出、金额恒正；语音结果进预填确认卡，与手动输入复用同一张表单）。
当前阶段：**原型与设计已定稿，iOS 原生工程未启动**。

## 当前状态

- 开发文档体系已建立：DEV.md（现状）/ README.md（访客门面）/ PRD.md（改动登记）/ TODO.md（停车场）/ AGENTS.md（AI 宪法）/ CLAUDE.md（导入）—— 分工调整见 [PRD M-002](PRD.md)
- 原型 v2 双模式（深/浅）完成并通过六套检查：static-audit-v2 82/0 WARN、smoke-v2 100/100、glass-contrast 12 组全达标、lead-verify-v2 0 FAIL；v1 原型冻结保留（smoke 50/50、static-audit 35/0）
- 视觉规范定稿于 M3 提示词包 v3：冰川蓝=品牌 / 收入=红 / 支出=绿 / 危险=琥珀；8 张卡面零位图纯 CSS，字区对比度实测 7.44–11.93:1
- 验证工具链收入仓库 tools/（11 个脚本 + package.json，jsdom 依赖；从仓库根 `node tools/xxx.js prototype/…` 复跑）
- App 图标三款 SVG 候选已出（app-icon-a/b/c.svg），未定稿 → [PRD F-001](PRD.md)
- iOS 原生工程未开始 → [PRD F-002](PRD.md)
- 已开源发布：https://github.com/OneStar1107/voice-ledger（MIT，公开；本工作区即仓库源）→ [PRD F-003](PRD.md)

## 已知问题

- `design-system/_build.mjs` 是残缺件（只导出变量、从不落盘），令牌未同步 v3 → [PRD R-001](PRD.md)
- 本环境无生图 API Key；资产已全部 CSS/SVG 化，暂不阻塞（来源：[M3 v2 §9](M3/提示词包-深色语音记账App-v2.md)）
- 真机核验（ASR 金额提取 ≥90% 等 7 项）未做；本工作区为 Windows，无 Xcode/真机信息
- 远端仓库 commit 由 API 创建，与本工作区 commit 树同 sha 异；本机首次推送需先 `--force`（见 [PRD F-003](PRD.md) 备注）
- install-gh-cli.*、.proto-check/、graphflow-out/、.graphflow/ 为工具性文件，与产品无关，勿误改

## 下一步

1. 维护者拍板 [PRD](PRD.md) 里三条待确认条目：F-001 图标选形 / F-002 是否启动 iOS 工程 / R-001 _build.mjs 修法
2. 按 PRD 条目执行；每次做完按 [AGENTS.md](AGENTS.md) 收尾五步回写

## 导航

- 干活规则：[AGENTS.md](AGENTS.md)（新对话先读它）· [CLAUDE.md](CLAUDE.md)
- 访客门面：[README.md](README.md) ｜ 改动登记：[PRD.md](PRD.md) ｜ 停车场：[TODO.md](TODO.md)
- 设计依据（只读）：[设计方案与验收记录-v1.md](设计方案与验收记录-v1.md) · [M3 v3 视觉规范](M3/提示词包-双模式-记账App-v3.md) · [原型 v2](prototype/记账App原型-v2.html) · [原型 v1](prototype/记账App原型-v1.html)
