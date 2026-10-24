// ⚠️ 残缺件（未装配），勿当作可运行脚本 —— 全文件只导出 { OUT, HEAD, ICONS, svg }，
// 第 1 行 import 的 writeFileSync / mkdirSync 从未被调用，没有任何页面装配与落盘步骤。
// 直接 `node _build.mjs` 不会产出任何文件。它是一次被中断的委派留下的「设计令牌 + 图标库片段」。
// 令牌值与圆角（--r-m 应为 14px 而非 16px）、四个墨阶以
// `M3/提示词包-双模式-记账App-v3.md` §1.4 / §2 为准；本文件尚未按 v3 同步。
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const OUT = 'C:/Users/hyx11/OneDrive/桌面/记账APP/design-system/UI设计系统-深色金融风-v1.html';

const HEAD = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>语音记账 iOS · UI 设计系统 v1（深色高级金融风）</title>
<style>
/* ============================================================================
   本文件 = 设计系统文档 + 可交互组件标本。
   零外部依赖：无字体文件、无图片、无 CDN、无网络请求。所有图标为内联 SVG。
   ============================================================================ */

/* ---------- A. 设计令牌（唯一真源） ---------- */
:root{
  /* A1 色彩 · 底与面 */
  --sys-bg:#0B0B0C;
  --sys-bg-2:#121214;
  --sys-card:#17181A;
  --sys-card-2:#1F2022;
  --sys-card-3:#242528;
  --sys-line:#26272B;
  --sys-line-2:#1E1F23;
  --sys-hair:rgba(255,255,255,.07);

  /* A1b 色彩 · 文字 */
  --sys-ink:#F5F6F7;
  --sys-ink-2:#A2A4AB;
  --sys-ink-3:#7A7C83;
  --sys-ink-4:#5C5E65;

  /* A1c 色彩 · 语义 */
  --sys-lime:#C8F169;
  --sys-lime-ink:#0B0B0C;
  --sys-lime-deep:#8FBF3A;
  --sys-copper:#D9794F;
  --sys-danger:#FF6F5E;
  --sys-danger-ink:#1A0E0B;
  --sys-warn:#E8B04B;
  --sys-info:#7FB2FF;

  /* A1d 描边/浅底（半透明，便于叠在不同材质上） */
  --sys-lime-dim:rgba(200,241,105,.14);
  --sys-lime-edge:rgba(200,241,105,.36);
  --sys-copper-dim:rgba(217,121,79,.16);
  --sys-copper-edge:rgba(217,121,79,.38);
  --sys-danger-dim:rgba(255,111,94,.14);
  --sys-danger-edge:rgba(255,111,94,.36);
  --sys-warn-dim:rgba(232,176,75,.14);
  --sys-ink-dim:rgba(255,255,255,.06);
  --sys-fill:rgba(255,255,255,.04);

  /* A1e 卡面渐变（资产对象卡） */
  --gra-card:linear-gradient(135deg,#7FE3FF 0%,#3B6FE0 55%,#2A2F8F 100%);
  --gra-card-sheen:linear-gradient(115deg,rgba(255,255,255,.22),transparent 42%);

  /* A1f 分类色（8 档，暗底同亮度阶梯；同时用长度+数值双编码） */
  --cat-1:#E08A5F; --cat-2:#C7C46A; --cat-3:#7FC7D9; --cat-4:#D9B26A;
  --cat-5:#B49BE0; --cat-6:#8FCBA0; --cat-7:#D69B84; --cat-8:#93A6D9;
  --cat-9:#6E7076;

  /* A2 字阶（中文重定，见 §7） */
  --fs-amount-hero:50px; --lh-amount-hero:52px; --ls-amount-hero:-1.2px;
  --fs-amount-xl:34px;   --lh-amount-xl:36px;   --ls-amount-xl:-.8px;
  --fs-amount-lg:24px;   --lh-amount-lg:26px;   --ls-amount-lg:-.4px;
  --fs-amount:17px;      --lh-amount:20px;      --ls-amount:-.1px;
  --fs-title:26px;       --lh-title:32px;       --ls-title:0px;
  --fs-h1:21px;          --lh-h1:28px;
  --fs-h2:17px;          --lh-h2:24px;
  --fs-h3:15px;          --lh-h3:21px;
  --fs-body:15px;        --lh-body:23px;
  --fs-label:14px;       --lh-label:21px;
  --fs-meta:13px;        --lh-meta:19px;
  --fs-caption:12px;     --lh-caption:18px;
  --fs-tab:11px;         --lh-tab:15px;         --ls-tab:.5px;
  --fs-micro:11px;       --lh-micro:16px;
  --fs-mono:11.5px;      --lh-mono:18px;

  /* A2b 字重（中文最低 500：PingFang SC Light/Regular 在暗底发虚） */
  --fw-regular:500;
  --fw-medium:510;
  --fw-semibold:600;
  --fw-bold:700;
  --fw-amount:650;

  /* A3 间距（8pt 主阶，4pt 半阶） */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px;
  --sp-5:20px; --sp-6:24px; --sp-8:32px; --sp-10:40px; --sp-12:48px;

  /* A4 圆角阶梯 */
  --r-xs:8px; --r-s:12px; --r-m:16px; --r-l:22px; --r-xl:28px; --r-full:999px;

  /* A5 高度：内高光 + 投影（暗底靠顶边 1px 高光分层，不靠投影） */
  --sh-none:none;
  --sh-card:inset 0 1px 0 var(--sys-hair), 0 1px 2px rgba(0,0,0,.50);
  --sh-float:inset 0 1px 0 var(--sys-hair), 0 10px 26px rgba(0,0,0,.55);
  --sh-sheet:inset 0 1px 0 var(--sys-hair), 0 -18px 60px rgba(0,0,0,.70);
  --sh-cta:0 8px 22px rgba(255,255,255,.12);
  --sh-glow:0 22px 56px rgba(59,111,224,.32);

  /* A6 毛玻璃 */
  --glass-nav:rgba(20,21,23,.72);
  --glass-nav-blur:24px;
  --glass-sheet:rgba(23,24,26,.92);
  --glass-sheet-blur:22px;
  --glass-overlay:rgba(8,8,10,.72);
  --glass-overlay-blur:18px;
  --glass-scrim:rgba(0,0,0,.56);

  /* A7 动效 */
  --ease:cubic-bezier(.22,.8,.2,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
  --dur-fast:120ms; --dur:180ms; --dur-slow:260ms;

  /* A8 无障碍 */
  --tap:44px;
  --focus:0 0 0 2px var(--sys-bg), 0 0 0 4px var(--sys-lime);
  --focus-on-lime:0 0 0 2px var(--sys-lime), 0 0 0 4px rgba(11,11,12,.9);

  /* A9 文档自身（不进入产品） */
  --doc-bg:#0A0A0B;
  --doc-ink:#E9EAEC;
  --doc-ink-2:#9A9CA3;
  --doc-ink-3:#6E7076;
  --doc-line:#1E1F23;
  --doc-panel:#111214;
  --doc-panel-2:#17181A;
}

/* 浅色主题：同一套令牌名，仅替换两端锚点。存在的意义是证明令牌完备，
   产品交付默认深色（data-theme 不带值时即深色）。 */
html[data-palette="light"]{
  --sys-bg:#F4F1EC;
  --sys-bg-2:#EDE9E2;
  --sys-card:#FFFFFF;
  --sys-card-2:#FAF8F5;
  --sys-card-3:#F0ECE5;
  --sys-line:#E2DDD4;
  --sys-line-2:#EFEBE4;
  --sys-hair:rgba(255,255,255,.9);
  --sys-ink:#17181A;
  --sys-ink-2:#5C616B;
  --sys-ink-3:#81868F;
  --sys-ink-4:#9AA0AA;
  --sys-lime:#3F6B12;  /* 浅底需要深青柠才够对比，青柠视觉标记由 --sys-lime-deep 承担 */
  --sys-lime-ink:#FFFFFF;
  --sys-lime-deep:#6E9E22;
  --sys-copper:#C0623A;
  --sys-lime-dim:rgba(63,107,18,.10);
  --sys-lime-edge:rgba(63,107,18,.30);
  --sys-ink-dim:rgba(23,24,26,.05);
  --sys-fill:rgba(23,24,26,.035);
  --sh-card:0 1px 2px rgba(24,20,14,.05);
  --sh-float:0 8px 24px rgba(24,20,14,.12);
  --sh-sheet:0 -16px 48px rgba(24,20,14,.18);
  --sh-cta:0 8px 22px rgba(24,20,14,.18);
  --glass-nav:rgba(255,255,255,.78);
  --glass-sheet:rgba(255,255,255,.94);
  --glass-overlay:rgba(14,12,10,.42);
  --glass-scrim:rgba(14,12,10,.38);
  --doc-bg:#F6F4F0; --doc-ink:#17181A; --doc-ink-2:#5C616B; --doc-ink-3:#81868F;
  --doc-line:#E2DDD4; --doc-panel:#FFFFFF; --doc-panel-2:#FAF8F5;
}

html[data-motion="off"] *{animation:none !important;transition:none !important}
@media (prefers-reduced-motion:reduce){ *{animation:none !important;transition:none !important} }

/* ---------- B. 文档骨架（不进入产品，仅用于呈现交付物） ---------- */
*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;background:var(--doc-bg);color:var(--doc-ink);
  font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;
  font-size:15px;line-height:1.7;-webkit-font-smoothing:antialiased;
}
.docbar{
  position:sticky;top:0;z-index:60;display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:12px 24px;background:color-mix(in oklab,var(--doc-bg) 88%,transparent);
  backdrop-filter:blur(16px);border-bottom:1px solid var(--doc-line);
}
.docbar h1{font-size:15px;margin:0;font-weight:600;letter-spacing:.2px}
.docbar .sp{flex:1}
.docbar button{
  min-height:34px;padding:5px 12px;border-radius:var(--r-full);cursor:pointer;
  border:1px solid var(--doc-line);background:var(--doc-panel);color:var(--doc-ink-2);
  font-family:inherit;font-size:12.5px;
}
.docbar button:hover{border-color:var(--doc-ink-3);color:var(--doc-ink)}
.wrap{max-width:1180px;margin:0 auto;padding:32px 24px 160px}
section{margin:0 0 56px}
h2.sec{
  font-size:22px;font-weight:700;letter-spacing:-.3px;margin:0 0 6px;padding-top:14px;
  display:flex;align-items:baseline;gap:10px;
}
h2.sec span.no{
  font-size:12px;font-weight:600;color:var(--sys-lime-deep);letter-spacing:1px;
  border:1px solid var(--sys-lime-edge);border-radius:var(--r-full);padding:2px 9px;
}
.lead{color:var(--doc-ink-2);font-size:14px;margin:0 0 20px;max-width:80ch}
h3.sub{font-size:16px;font-weight:650;margin:28px 0 10px;letter-spacing:-.1px}
h4.sub2{font-size:14px;font-weight:600;margin:20px 0 8px;color:var(--doc-ink)}
p{margin:0 0 12px;font-size:14px;color:var(--doc-ink-2)}
p b,li b{color:var(--doc-ink);font-weight:600}
code{
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;
  background:var(--doc-panel-2);border:1px solid var(--doc-line);border-radius:6px;
  padding:1px 5px;color:var(--doc-ink);
}
table{width:100%;border-collapse:collapse;font-size:13px;margin:0 0 16px}
th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--doc-line);vertical-align:top}
th{color:var(--doc-ink-3);font-weight:600;font-size:12px;letter-spacing:.3px;white-space:nowrap}
td code{font-size:12px}
.panel{background:var(--doc-panel);border:1px solid var(--doc-line);border-radius:14px;padding:18px}
.panel + .panel{margin-top:14px}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.tagline{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}
.tag{font-size:11.5px;border:1px solid var(--doc-line);border-radius:var(--r-full);padding:3px 10px;color:var(--doc-ink-2);background:var(--doc-panel)}
ul.tight{margin:6px 0 14px;padding-left:20px}
ul.tight li{font-size:13.5px;color:var(--doc-ink-2);margin:4px 0}
ul.tight li b{color:var(--doc-ink)}

/* 色板 */
.sw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:10px}
.sw{border:1px solid var(--doc-line);border-radius:12px;overflow:hidden;background:var(--doc-panel)}
.sw .chip{height:56px;display:block}
.sw .m{padding:8px 10px}
.sw .m b{display:block;font-size:12.5px;font-weight:600}
.sw .m span{display:block;font-size:11.5px;color:var(--doc-ink-3);font-family:ui-monospace,Menlo,Consolas,monospace}
.sw .m em{display:block;font-style:normal;font-size:11px;color:var(--doc-ink-3);margin-top:2px}

/* 字阶标本 */
.type-row{display:flex;align-items:baseline;gap:16px;padding:11px 0;border-bottom:1px solid var(--doc-line)}
.type-row:last-child{border-bottom:0}
.type-row .spec{
  flex:none;width:270px;font-family:ui-monospace,Menlo,Consolas,monospace;
  font-size:11.5px;color:var(--doc-ink-3);line-height:1.5;
}
.type-row .demo{flex:1;min-width:0;color:var(--doc-ink)}

/* 组件标本区 */
.spec{
  border:1px solid var(--doc-line);border-radius:14px;background:var(--doc-panel);
  margin:0 0 16px;overflow:hidden;
}
.spec > header{
  display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;
  padding:12px 16px;border-bottom:1px solid var(--doc-line);background:var(--doc-panel-2);
}
.spec > header b{font-size:14px;font-weight:650}
.spec > header code{background:transparent;border:0;padding:0;color:var(--doc-ink-3);font-size:11.5px}
.spec > header .st{margin-left:auto;font-size:11.5px;color:var(--doc-ink-3)}
.spec .body{padding:18px 16px}
.stategrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}
.statebox{border:1px dashed var(--doc-line);border-radius:12px;padding:12px}
.statebox .lb{font-size:11px;color:var(--doc-ink-3);letter-spacing:.4px;margin-bottom:9px;font-family:ui-monospace,Menlo,Consolas,monospace}
.measure{display:flex;gap:10px;align-items:center;font-size:11.5px;color:var(--doc-ink-3);margin-top:10px;font-family:ui-monospace,Menlo,Consolas,monospace}
.ruler{position:relative;height:6px;background:var(--sys-ink-dim);border-radius:3px;flex:1}

/* ---------- C. 产品组件标本（全部使用 A 区令牌，可直接抄走） ---------- */
.p-root{
  background:var(--sys-bg);color:var(--sys-ink);
  border-radius:var(--r-l);padding:18px;
  font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;
  font-size:var(--fs-body);line-height:var(--lh-body);
}
.p-root.plain{border:1px solid var(--sys-line)}
.p-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
.p-col{display:flex;flex-direction:column;gap:12px}
.p-cap{font-size:var(--fs-micro);line-height:var(--lh-micro);color:var(--sys-ink-3);letter-spacing:.4px;margin:0 0 8px}

/* 按钮 */
.p-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  min-height:var(--tap);padding:0 22px;border:1px solid transparent;border-radius:var(--r-full);
  font-family:inherit;font-size:var(--fs-h3);font-weight:var(--fw-semibold);line-height:1;
  cursor:pointer;transition:background var(--dur) var(--ease),transform var(--dur-fast) var(--ease),opacity var(--dur) var(--ease);
}
.p-btn:focus-visible{outline:none;box-shadow:var(--focus)}
.p-btn:active{transform:scale(.975)}
.p-btn.primary{background:var(--sys-ink);color:var(--sys-bg);box-shadow:var(--sh-cta)}
.p-btn.primary:hover{background:#fff}
.p-btn.primary:active{background:#DCDEE1}
.p-btn.accent{background:var(--sys-lime);color:var(--sys-lime-ink)}
.p-btn.accent:hover{background:#D5F584}
.p-btn.accent:focus-visible{box-shadow:var(--focus-on-lime)}
.p-btn.ghost{background:var(--sys-fill);border-color:var(--sys-line);color:var(--sys-ink)}
.p-btn.ghost:hover{background:var(--sys-card-3)}
.p-btn.quiet{background:transparent;color:var(--sys-ink-2);padding:0 14px}
.p-btn.quiet:hover{background:var(--sys-fill);color:var(--sys-ink)}
.p-btn.danger{background:var(--sys-danger-dim);border-color:var(--sys-danger-edge);color:var(--sys-danger)}
.p-btn.danger:hover{background:rgba(255,111,94,.22)}
.p-btn[disabled],.p-btn[aria-disabled="true"]{opacity:.38;cursor:not-allowed;pointer-events:none}
.p-btn.sq{width:var(--tap);padding:0;border-radius:var(--r-full);border-color:var(--sys-line);background:var(--sys-card-2);color:var(--sys-ink-2)}
.p-btn.sq:hover{background:var(--sys-card-3);color:var(--sys-ink)}

/* 圆形图标按钮 */
.p-iconbtn{
  width:var(--tap);height:var(--tap);flex:none;display:grid;place-items:center;
  border:1px solid var(--sys-line);border-radius:var(--r-full);
  background:var(--sys-card-2);color:var(--sys-ink-2);cursor:pointer;
  transition:background var(--dur) var(--ease),color var(--dur) var(--ease),transform var(--dur-fast) var(--ease);
}
.p-iconbtn:hover{background:var(--sys-card-3);color:var(--sys-ink)}
.p-iconbtn:active{transform:scale(.94)}
.p-iconbtn:focus-visible{outline:none;box-shadow:var(--focus)}
.p-iconbtn[aria-pressed="true"]{background:var(--sys-lime-dim);border-color:var(--sys-lime-edge);color:var(--sys-lime)}
.p-iconbtn svg{width:20px;height:20px;display:block}

/* 头像 */
.p-avatar{
  width:40px;height:40px;flex:none;border-radius:var(--r-full);display:grid;place-items:center;
  background:var(--gra-card);color:#fff;font-size:var(--fs-label);font-weight:var(--fw-bold);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35);
}

/* 卡片 / 分层行 */
.p-card{
  background:var(--sys-card);border:1px solid var(--sys-line-2);border-radius:var(--r-l);
  box-shadow:var(--sh-card);padding:var(--sp-4);
}
.p-line{
  background:var(--sys-card-2);border:1px solid var(--sys-line-2);border-radius:var(--r-m);
  padding:13px var(--sp-4);display:flex;align-items:center;gap:var(--sp-3);min-height:56px;
}
.p-line .lb{flex:1;min-width:0;font-size:var(--fs-label);font-weight:var(--fw-medium)}
.p-line .sb{display:block;font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3);font-weight:400;margin-top:3px}

/* 区头 */
.p-sechead{display:flex;align-items:baseline;gap:var(--sp-2);margin:0 2px var(--sp-3)}
.p-sechead h3{margin:0;font-size:var(--fs-h3);line-height:var(--lh-h3);font-weight:var(--fw-semibold)}
.p-sechead .link{
  margin-left:auto;border:0;background:transparent;cursor:pointer;font-family:inherit;
  min-height:var(--tap);display:inline-flex;align-items:center;gap:2px;
  font-size:var(--fs-label);color:var(--sys-ink-3);padding:0 2px;
}
.p-sechead .link:hover{color:var(--sys-lime)}
.p-sechead .link:focus-visible{outline:none;box-shadow:var(--focus);border-radius:var(--r-xs)}

/* 列表行 */
.p-listrow{
  display:flex;align-items:center;gap:var(--sp-3);min-height:64px;
  padding:10px var(--sp-3);border-radius:var(--r-m);background:transparent;
  border:0;width:100%;text-align:left;font-family:inherit;color:inherit;cursor:pointer;
  transition:background var(--dur) var(--ease);
}
button.p-listrow:hover{background:var(--sys-fill)}
button.p-listrow:focus-visible{outline:none;box-shadow:var(--focus)}
.p-listrow .mid{flex:1;min-width:0}
.p-listrow .tt{display:block;font-size:var(--fs-label);font-weight:var(--fw-medium);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.p-listrow .mm{display:block;font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3);margin-top:2px;font-variant-numeric:tabular-nums}
.p-listrow .amt{font-size:var(--fs-amount);line-height:var(--lh-amount);font-weight:var(--fw-amount);letter-spacing:var(--ls-amount);font-variant-numeric:tabular-nums;white-space:nowrap}
.p-listrow .chev{color:var(--sys-ink-4);display:flex;flex:none}
.p-listrow .chev svg{width:17px;height:17px}

/* 分类底座图标 */
.p-cat{
  width:38px;height:38px;flex:none;border-radius:12px;display:grid;place-items:center;
  background:linear-gradient(180deg,var(--sys-card-2),var(--sys-card));
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
  color:var(--sys-ink-2);
}
.p-cat svg{width:19px;height:19px;display:block}
.p-cat.solid{color:#0B0B0C;font-size:13px;font-weight:var(--fw-bold);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}

/* 胶囊筛选条 */
.p-filter{
  display:inline-flex;align-items:center;gap:2px;padding:3px;
  background:var(--sys-card-2);border:1px solid var(--sys-line-2);border-radius:var(--r-full);
  position:relative;max-width:100%;
}
.p-filter button{
  position:relative;z-index:1;border:0;background:transparent;cursor:pointer;font-family:inherit;
  min-height:36px;padding:0 16px;border-radius:var(--r-full);
  font-size:var(--fs-label);font-weight:var(--fw-medium);color:var(--sys-ink-3);
  white-space:nowrap;transition:color var(--dur) var(--ease);
}
.p-filter button[aria-selected="true"]{color:var(--sys-bg);font-weight:var(--fw-semibold)}
.p-filter button:focus-visible{outline:none;box-shadow:var(--focus)}
.p-filter .thumb{
  position:absolute;top:3px;left:3px;height:calc(100% - 6px);border-radius:var(--r-full);
  background:var(--sys-ink);box-shadow:var(--sh-cta);
  transition:transform var(--dur-slow) var(--ease),width var(--dur-slow) var(--ease);
}

/* KPI 大字 */
.p-kpi{display:flex;flex-direction:column;gap:4px}
.p-kpi .k{font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3)}
.p-kpi .v{
  font-size:var(--fs-amount-xl);line-height:var(--lh-amount-xl);letter-spacing:var(--ls-amount-xl);
  font-weight:var(--fw-amount);font-variant-numeric:tabular-nums;
}
.p-kpi .v.sm{font-size:var(--fs-amount-lg);line-height:var(--lh-amount-lg);letter-spacing:var(--ls-amount-lg)}

/* 图表容器 */
.p-chartbox{background:var(--sys-card);border:1px solid var(--sys-line-2);border-radius:var(--r-l);padding:var(--sp-4) var(--sp-3) var(--sp-3)}
.p-chartbox .hd{display:flex;align-items:baseline;gap:8px;padding:0 4px}
.p-chartbox .hd h4{margin:0;font-size:var(--fs-h3);font-weight:var(--fw-semibold)}
.p-chartbox .hd .val{margin-left:auto;font-size:var(--fs-meta);color:var(--sys-ink-2);font-variant-numeric:tabular-nums}
.p-legend{display:flex;gap:14px;flex-wrap:wrap;padding:10px 4px 0;font-size:var(--fs-micro);color:var(--sys-ink-3)}

/* 表格（组件清单） */
.tblwrap{overflow-x:auto;border:1px solid var(--doc-line);border-radius:12px}
.tblwrap table{margin:0;min-width:760px}
.tblwrap th{background:var(--doc-panel-2);position:sticky;top:0}
.tblwrap td{font-size:12.5px}
.st{display:inline-block;font-size:11px;border-radius:var(--r-full);padding:1px 8px;border:1px solid;white-space:nowrap}
.st.ok{color:#8FBF3A;border-color:rgba(143,191,58,.4);background:rgba(143,191,58,.1)}
.st.new{color:var(--sys-info);border-color:rgba(127,178,255,.4);background:rgba(127,178,255,.1)}
.st.keep{color:var(--doc-ink-2);border-color:var(--doc-line);background:transparent}
.st.warn{color:#E8B04B;border-color:rgba(232,176,75,.4);background:rgba(232,176,75,.09)}
.callout{border-left:2px solid var(--sys-lime-edge);background:var(--sys-lime-dim);border-radius:0 12px 12px 0;padding:12px 14px;margin:0 0 14px;font-size:13.5px;color:var(--doc-ink)}
.callout.danger{border-left-color:var(--sys-danger-edge);background:var(--sys-danger-dim)}
.callout.warn{border-left-color:rgba(232,176,75,.5);background:var(--sys-warn-dim)}
.foot{border-top:1px solid var(--doc-line);padding-top:18px;color:var(--doc-ink-3);font-size:12.5px}
.mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}

/* ---------- D. 可交互微原型（设备框） ---------- */
.stage{display:flex;gap:28px;flex-wrap:wrap;align-items:flex-start}
.device{
  width:390px;height:844px;flex:none;border-radius:52px;padding:11px;position:relative;
  background:#08090A;box-shadow:0 30px 80px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.06);
  transform-origin:top left;
}
.device .island{position:absolute;top:23px;left:50%;transform:translateX(-50%);width:112px;height:30px;border-radius:var(--r-full);background:#000;z-index:6}
.device .screen{
  position:relative;width:100%;height:100%;border-radius:42px;overflow:hidden;
  background:var(--sys-bg);color:var(--sys-ink);
  display:flex;flex-direction:column;
  font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",system-ui,sans-serif;
  font-size:var(--fs-body);line-height:var(--lh-body);
}
.device .screen::after{content:"";position:absolute;inset:0;border-radius:42px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.6);pointer-events:none;z-index:9}
.statbar{height:54px;flex:none;display:flex;align-items:flex-end;gap:6px;padding:0 30px 6px 34px;font-size:13px;font-weight:600}
.statbar .g{flex:1}
.statbar .sig{display:flex;gap:2px;align-items:flex-end;height:11px}
.statbar .sig i{display:block;width:3px;background:currentColor;border-radius:1px}
.statbar .bat{width:22px;height:11px;border:1.4px solid currentColor;border-radius:3px;position:relative;margin-left:4px}
.statbar .bat::before{content:"";position:absolute;inset:1.6px;background:currentColor;border-radius:1px}
.statbar .bat::after{content:"";position:absolute;right:-3.4px;top:3.4px;width:2px;height:4px;background:currentColor;border-radius:0 1px 1px 0}

.navbar{flex:none;display:flex;align-items:center;gap:10px;padding:2px 18px 12px;min-height:48px}
.navbar .av{flex:none}
.navbar .ttl{flex:1;min-width:0}
.navbar .ttl b{display:block;font-size:var(--fs-h2);line-height:var(--lh-h2);font-weight:var(--fw-bold);letter-spacing:-.1px}
.navbar .ttl span{display:block;font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3)}
.navbar .acts{display:flex;gap:8px;flex:none;align-items:center}
.navbar .back{width:var(--tap);height:var(--tap);display:grid;place-items:center;border:0;background:transparent;color:var(--sys-ink-2);cursor:pointer;border-radius:var(--r-full)}
.navbar .back:hover{background:var(--sys-fill)}
.navbar .back:focus-visible{outline:none;box-shadow:var(--focus)}
.navbar h2{margin:0;font-size:var(--fs-h1);line-height:var(--lh-h1);font-weight:var(--fw-bold)}

.scrolly{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 18px 116px;scrollbar-width:none}
.scrolly::-webkit-scrollbar{width:0}

/* 悬浮胶囊底栏 */
.dock{
  position:absolute;left:16px;right:16px;bottom:16px;z-index:8;height:64px;
  display:flex;align-items:center;justify-content:space-around;
  border-radius:var(--r-full);border:1px solid var(--sys-line);
  background:var(--glass-nav);backdrop-filter:blur(var(--glass-nav-blur)) saturate(1.6);
  -webkit-backdrop-filter:blur(var(--glass-nav-blur)) saturate(1.6);
  box-shadow:var(--sh-float);
}
.dock button{
  flex:1;min-height:var(--tap);min-width:var(--tap);border:0;background:transparent;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  font-family:inherit;font-size:var(--fs-tab);line-height:var(--lh-tab);letter-spacing:var(--ls-tab);
  color:var(--sys-ink-3);transition:color var(--dur) var(--ease);
}
.dock button svg{width:22px;height:22px;display:block}
.dock button[aria-selected="true"]{color:var(--sys-lime)}
.dock button[aria-selected="true"] svg{filter:drop-shadow(0 0 10px rgba(200,241,105,.35))}
.dock button:focus-visible{outline:none;box-shadow:var(--focus);border-radius:var(--r-m)}
.dock .cap{
  position:absolute;top:-2px;left:50%;transform:translate(-50%,-100%);
  height:3px;width:18px;border-radius:2px;background:var(--sys-lime);opacity:0;transition:opacity var(--dur) var(--ease);
}
.dock button[aria-selected="true"] .cap{opacity:1}

/* 资产对象卡 */
.asset{
  position:relative;border-radius:var(--r-xl);padding:20px;overflow:hidden;
  background:var(--gra-card);color:#fff;box-shadow:var(--sh-glow);
  min-height:196px;display:flex;flex-direction:column;
}
.asset::before{content:"";position:absolute;inset:0;background:var(--gra-card-sheen);pointer-events:none}
.asset::after{
  content:"";position:absolute;inset:0;pointer-events:none;
  background:repeating-linear-gradient(0deg,rgba(255,255,255,.06) 0 1px,transparent 1px 22px);
  mask-image:linear-gradient(180deg,transparent 42%,#000 100%);
  -webkit-mask-image:linear-gradient(180deg,transparent 42%,#000 100%);
}
.asset > *{position:relative;z-index:1}
.asset .cap{font-size:var(--fs-caption);line-height:var(--lh-caption);color:rgba(255,255,255,.78);letter-spacing:.3px}
.asset .big{
  font-size:var(--fs-amount-hero);line-height:var(--lh-amount-hero);letter-spacing:var(--ls-amount-hero);
  font-weight:var(--fw-amount);font-variant-numeric:tabular-nums;margin:6px 0 0;
  text-shadow:0 2px 18px rgba(16,20,56,.35);
}
.asset .big small{font-size:24px;font-weight:var(--fw-semibold);margin-right:3px;letter-spacing:0;opacity:.9}
.asset .meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:auto;padding-top:18px;font-size:var(--fs-meta);color:rgba(255,255,255,.82)}
.asset .meta b{color:#fff;font-weight:var(--fw-semibold);font-variant-numeric:tabular-nums}
.asset .link{
  position:absolute;right:16px;top:16px;z-index:2;border:1px solid rgba(255,255,255,.32);
  background:rgba(255,255,255,.14);color:#fff;border-radius:var(--r-full);
  min-height:34px;padding:0 13px;font-family:inherit;font-size:var(--fs-caption);cursor:pointer;
  display:inline-flex;align-items:center;gap:3px;
}
.asset .link:hover{background:rgba(255,255,255,.24)}
.asset .link:focus-visible{outline:none;box-shadow:0 0 0 2px rgba(255,255,255,.9)}

/* 双入口 */
.ent{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ent button{
  border:1px solid transparent;border-radius:var(--r-l);padding:16px 15px 14px;min-height:110px;
  display:flex;flex-direction:column;justify-content:space-between;gap:10px;text-align:left;
  font-family:inherit;cursor:pointer;transition:transform var(--dur-fast) var(--ease),background var(--dur) var(--ease);
}
.ent button:active{transform:scale(.975)}
.ent button:focus-visible{outline:none;box-shadow:var(--focus)}
.ent .voice{background:var(--sys-lime);color:var(--sys-lime-ink);box-shadow:0 10px 26px rgba(200,241,105,.18)}
.ent .voice:hover{background:#D5F584}
.ent .voice:focus-visible{box-shadow:var(--focus-on-lime)}
.ent .manual{background:var(--sys-card);border-color:var(--sys-line);color:var(--sys-ink)}
.ent .manual:hover{background:var(--sys-card-2)}
.ent .t{display:block;font-size:var(--fs-h2);line-height:var(--lh-h2);font-weight:var(--fw-semibold);letter-spacing:-.1px}
.ent .d{display:block;font-size:var(--fs-caption);line-height:var(--lh-caption);opacity:.8;margin-top:3px}
.orb{width:34px;height:34px;border-radius:var(--r-full);border:1.8px solid currentColor;position:relative;flex:none;opacity:.9}

/* 记录行 + 左滑删除 */
.rrow{position:relative;border-radius:var(--r-m);overflow:hidden;margin-bottom:8px;background:var(--sys-danger)}
.rrow .del{
  position:absolute;inset:0 0 0 auto;width:78px;border:0;background:transparent;color:#fff;
  font-family:inherit;font-size:var(--fs-label);font-weight:var(--fw-semibold);cursor:pointer;
}
.rrow .face{
  position:relative;z-index:1;display:flex;align-items:center;gap:var(--sp-3);min-height:64px;
  padding:10px 13px;background:var(--sys-card);border:1px solid var(--sys-line-2);border-radius:var(--r-m);
  cursor:pointer;touch-action:pan-y;transition:transform 220ms var(--ease),background var(--dur) var(--ease);
}
.rrow .face:hover{background:var(--sys-card-2)}
.rrow .face:focus-visible{outline:none;box-shadow:var(--focus)}

/* 空态 */
.pempty{
  text-align:center;padding:32px 20px;border:1px dashed var(--sys-line);border-radius:var(--r-l);
  background:var(--sys-card);color:var(--sys-ink-3);
}
.pempty svg{width:76px;height:76px;margin-bottom:10px;opacity:.9}
.pempty p{margin:0 0 4px;font-size:var(--fs-label);color:var(--sys-ink-2)}
.pempty span{font-size:var(--fs-caption);line-height:var(--lh-caption)}

/* 浮层 */
.ovl{
  position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:22px;background:var(--glass-overlay);backdrop-filter:blur(var(--glass-overlay-blur));
  -webkit-backdrop-filter:blur(var(--glass-overlay-blur));color:#fff;text-align:center;padding:0 30px;
}
.ovl .timer{font-size:46px;line-height:48px;font-weight:300;font-variant-numeric:tabular-nums;letter-spacing:1px}
.ovl .timer small{font-size:20px;opacity:.5}
.ovl .tip{font-size:var(--fs-label);line-height:var(--lh-label);color:rgba(255,255,255,.72);max-width:26ch}
.ovl .hint{font-size:var(--fs-caption);color:rgba(255,255,255,.5);letter-spacing:.3px}
.micbtn{
  width:96px;height:96px;border-radius:var(--r-full);background:var(--sys-lime);color:var(--sys-lime-ink);
  display:grid;place-items:center;position:relative;animation:pulse 1.7s var(--ease) infinite;
}
@keyframes pulse{
  0%{box-shadow:0 0 0 0 rgba(200,241,105,.45)}
  100%{box-shadow:0 0 0 34px rgba(200,241,105,0)}
}
.micbtn.cancel{background:#5C5E65;color:#fff;animation:none}
.micbtn .bars{display:flex;gap:4px;align-items:center;height:34px}
.micbtn .bars i{width:4px;border-radius:2px;background:currentColor;height:10px;animation:wave 900ms var(--ease) infinite}
.micbtn .bars i:nth-child(2){animation-delay:120ms}
.micbtn .bars i:nth-child(3){animation-delay:240ms}
.micbtn .bars i:nth-child(4){animation-delay:360ms}
.micbtn .bars i:nth-child(5){animation-delay:480ms}
@keyframes wave{0%,100%{height:9px}50%{height:30px}}
.spin{width:34px;height:34px;border-radius:var(--r-full);border:2.5px solid rgba(255,255,255,.2);border-top-color:var(--sys-lime);animation:sp 900ms linear infinite}
.spin.sm{width:16px;height:16px;border-width:2px;border-color:var(--sys-line);border-top-color:var(--sys-lime)}
@keyframes sp{to{transform:rotate(360deg)}}

/* sheet */
.scrim{position:absolute;inset:0;background:var(--glass-scrim);z-index:22;border:0;padding:0;cursor:pointer}
.sheet{
  position:absolute;left:0;right:0;bottom:0;z-index:23;padding:10px 18px 26px;max-height:90%;overflow-y:auto;
  background:var(--glass-sheet);backdrop-filter:blur(var(--glass-sheet-blur)) saturate(1.4);
  -webkit-backdrop-filter:blur(var(--glass-sheet-blur)) saturate(1.4);
  border-top:1px solid var(--sys-line);border-radius:var(--r-xl) var(--r-xl) 0 0;box-shadow:var(--sh-sheet);
  animation:up var(--dur-slow) var(--ease);
}
@keyframes up{from{transform:translateY(20px);opacity:.5}to{transform:none;opacity:1}}
.sheet .grab{width:38px;height:4.5px;border-radius:var(--r-full);background:var(--sys-line);margin:0 auto 14px}
.sheet h3{margin:0 0 4px;font-size:var(--fs-h1);line-height:var(--lh-h1);font-weight:var(--fw-bold);letter-spacing:-.2px}
.sheet .sub{font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3);margin-bottom:16px}
.fld{margin-bottom:14px}
.fld > label{display:block;font-size:var(--fs-caption);color:var(--sys-ink-3);margin-bottom:6px}
.fld input{
  width:100%;min-height:48px;border:1px solid var(--sys-line);border-radius:var(--r-m);
  background:var(--sys-card-2);color:var(--sys-ink);padding:12px 13px;font-family:inherit;
  font-size:var(--fs-body);font-variant-numeric:tabular-nums;
}
.fld input:focus{outline:none;border-color:var(--sys-lime-edge);box-shadow:0 0 0 3px var(--sys-lime-dim)}
.fld.amount input{font-size:var(--fs-amount-xl);line-height:var(--lh-amount-xl);font-weight:var(--fw-bold);letter-spacing:var(--ls-amount-xl)}
.hintblock{border-radius:var(--r-m);padding:11px 13px;font-size:var(--fs-caption);line-height:var(--lh-caption);margin-bottom:14px}
.hintblock.lime{background:var(--sys-lime-dim);border:1px solid var(--sys-lime-edge);color:var(--sys-lime)}
.hintblock.copper{background:var(--sys-copper-dim);border:1px solid var(--sys-copper-edge);color:var(--sys-copper)}
.hintblock.neutral{background:var(--sys-card-2);border:1px solid var(--sys-line-2);color:var(--sys-ink-2);font-size:var(--fs-caption)}
.hintblock.mono{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:var(--fs-mono);line-height:var(--lh-mono);white-space:pre-wrap;max-height:190px;overflow:auto}
.chips2{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.chip2{
  min-height:46px;border:1px solid var(--sys-line);border-radius:var(--r-m);background:var(--sys-card-2);
  color:var(--sys-ink-2);font-family:inherit;font-size:var(--fs-meta);cursor:pointer;
  display:flex;align-items:center;justify-content:center;gap:6px;transition:background var(--dur) var(--ease),border-color var(--dur) var(--ease)
}
.chip2:hover{background:var(--sys-card-3)}
.chip2[aria-pressed="true"]{border-color:var(--sys-lime-edge);background:var(--sys-lime-dim);color:var(--sys-lime);font-weight:var(--fw-semibold)}
.chip2:focus-visible{outline:none;box-shadow:var(--focus)}
.swatchdot{width:9px;height:9px;border-radius:var(--r-full);flex:none}
.acts2{display:flex;gap:10px;margin-top:18px}
.acts2 .p-btn{flex:1}
.errmsg{color:var(--sys-danger);font-size:var(--fs-caption);margin-top:6px}
.quicks{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
.quicks button{
  min-height:var(--tap);padding:0 14px;border-radius:var(--r-full);border:1px solid var(--sys-line);
  background:var(--sys-card-2);color:var(--sys-ink-2);font-family:inherit;font-size:var(--fs-caption);cursor:pointer;
}
.quicks button[aria-pressed="true"]{border-color:var(--sys-lime-edge);color:var(--sys-lime)}

/* 行内分组 */
.grp{background:var(--sys-card);border:1px solid var(--sys-line-2);border-radius:var(--r-l);overflow:hidden;margin-bottom:14px}
.grp > .gh{padding:12px 16px 8px;font-size:var(--fs-caption);letter-spacing:.4px;color:var(--sys-ink-3)}
.grp .gl{
  display:flex;align-items:center;gap:12px;padding:13px 16px;min-height:58px;
  border-top:1px solid var(--sys-line-2);width:100%;background:transparent;border-left:0;border-right:0;border-bottom:0;
  font-family:inherit;color:inherit;text-align:left;
}
.grp .gh + .gl{border-top:0}
button.gl{cursor:pointer}
button.gl:hover{background:var(--sys-fill)}
button.gl:focus-visible{outline:none;box-shadow:var(--focus)}
.gl .lbl{flex:1;min-width:0;font-size:var(--fs-label);font-weight:var(--fw-medium)}
.gl .lbl small{display:block;font-size:var(--fs-caption);line-height:var(--lh-caption);color:var(--sys-ink-3);font-weight:400;margin-top:2px}
.gl .val{font-size:var(--fs-meta);color:var(--sys-ink-3);font-variant-numeric:tabular-nums}
.gl.danger .lbl{color:var(--sys-danger)}
.gl .chev{color:var(--sys-ink-4);display:flex}
.gl .chev svg{width:17px;height:17px}

/* toast */
.p-toast{
  position:absolute;left:16px;right:16px;bottom:96px;z-index:30;
  display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:var(--r-m);
  background:var(--sys-card-3);border:1px solid var(--sys-line);color:var(--sys-ink);
  font-size:var(--fs-meta);box-shadow:var(--sh-float);animation:up var(--dur) var(--ease);
}
.p-toast .undo{
  margin-left:auto;border:0;background:transparent;color:var(--sys-lime);cursor:pointer;
  font-family:inherit;font-size:var(--fs-meta);font-weight:var(--fw-semibold);min-height:var(--tap);padding:0 8px;
}
.p-toast .undo:focus-visible{outline:none;box-shadow:var(--focus);border-radius:var(--r-xs)}

/* 提示 / 口径徽标 */
.p-notebadge{
  display:inline-flex;align-items:center;gap:6px;font-size:10.5px;letter-spacing:.2px;
  background:var(--sys-lime-dim);color:var(--sys-lime);border:1px solid var(--sys-lime-edge);
  border-radius:var(--r-full);padding:3px 10px;margin:0 0 10px;
}
.p-notebadge::before{content:"";width:5px;height:5px;border-radius:50%;background:currentColor;display:block}

/* 微原型控件条 */
.ctl{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 18px}
.ctl .grp2{display:flex;align-items:center;gap:6px;background:var(--doc-panel);border:1px solid var(--doc-line);border-radius:var(--r-full);padding:4px 6px 4px 12px}
.ctl .grp2 em{font-style:normal;font-size:11.5px;color:var(--doc-ink-3)}
.ctl button{
  min-height:30px;padding:0 11px;border-radius:var(--r-full);border:1px solid transparent;background:transparent;
  color:var(--doc-ink-2);font-family:inherit;font-size:12px;cursor:pointer;
}
.ctl button:hover{background:var(--doc-panel-2);color:var(--doc-ink)}
.ctl button[aria-pressed="true"]{background:var(--sys-ink-dim);border-color:var(--doc-line);color:var(--doc-ink)}
</style>
</head>
<body data-theme="dark">
`;

// ── SVG 图标库（全部内联，无外部依赖） ──
const ICONS = {
  book: '<path d="M4.8 4.6h11.4a2 2 0 0 1 2 2v12.8a2 2 0 0 1-2 2H4.8z"/><path d="M4.8 4.6v16.8"/><path d="M9 9.4h5.6M9 13.2h5.6"/>',
  stats: '<path d="M3.6 20.2h16.8"/><path d="M6.6 20.2v-6.4M12 20.2V5.2M17.4 20.2v-9.4"/>',
  history: '<circle cx="12" cy="11.8" r="7.6"/><path d="M12 7.6v4.6l3.1 1.9"/>',
  settings: '<path d="M3.8 7.2h6.4M14.4 7.2h5.8M3.8 16.8h3.4M11.4 16.8h8.8"/><circle cx="12.2" cy="7.2" r="2.2"/><circle cx="9.2" cy="16.8" r="2.2"/>',
  search: '<circle cx="11" cy="11" r="6.2"/><path d="M15.6 15.6L20 20"/>',
  gift: '<path d="M4.5 10.5h15V20a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M3.2 7h17.6v3.5H3.2z"/><path d="M12 7v14"/><path d="M12 7S10.8 3.4 8.6 3.4a2.2 2.2 0 0 0 0 3.6z"/><path d="M12 7s1.2-3.6 3.4-3.6a2.2 2.2 0 0 1 0 3.6z"/>',
  spark: '<path d="M12 3.2l1.7 5.1 5.1 1.7-5.1 1.7L12 16.8l-1.7-5.1L5.2 10l5.1-1.7z"/><path d="M18.4 16.2l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  calendar: '<rect x="3.6" y="5.2" width="16.8" height="15.2" rx="2.6"/><path d="M3.6 10h16.8M8.4 3.4v3.4M15.6 3.4v3.4"/>',
  chevR: '<path d="M9.4 5.2L16.2 12l-6.8 6.8"/>',
  chevL: '<path d="M14.6 5.2L7.8 12l6.8 6.8"/>',
  mic: '<rect x="9.2" y="3.4" width="5.6" height="10.4" rx="2.8"/><path d="M5.6 11.4a6.4 6.4 0 0 0 12.8 0"/><path d="M12 17.8v3"/>',
  plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
  pencil: '<path d="M4.6 19.4l4.2-.9L19 8.3a2 2 0 0 0-2.8-2.8L5.5 15.2z"/>',
  trash: '<path d="M4.8 7.2h14.4M9.6 7.2V4.8h4.8v2.4M6.8 7.2l.9 12.1a1 1 0 0 0 1 .9h6.6a1 1 0 0 0 1-.9l.9-12.1"/>',
  check: '<path d="M5 12.6l4.4 4.4L19 7.4"/>',
  warn: '<path d="M12 4.4L21 19.6H3z"/><path d="M12 10v4.4M12 17.2v.2"/>',
  giftBox: '<path d="M4.5 10.5h15V20a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z"/><path d="M3.2 7h17.6v3.5H3.2z"/><path d="M12 7v14"/>',
  download: '<path d="M12 4.4v10.2M7.8 10.8L12 15l4.2-4.2"/><path d="M4.8 17.6v1.8a1 1 0 0 0 1 1h12.4a1 1 0 0 0 1-1v-1.8"/>',
  layers: '<path d="M12 3.6l8.4 4.6L12 12.8 3.6 8.2z"/><path d="M3.6 12.6L12 17.2l8.4-4.6"/>'
};
const svg = (name, w = 20, sw = 1.7) =>
  `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

export { OUT, HEAD, ICONS, svg };
