/* 记账 App 原型 v2（双模式）—— 交付前静态自查（不依赖浏览器）
   基线：tools/static-audit.js（v1 的 9 组断言，全部保留）
   v2 新增：
     A. 两套主题令牌同源同名单（深/浅列出的变量必须一一对应，一个不漏）
     B. 除卡面层外零硬编码色值（所有颜色必须走 CSS 变量）
     C. 卡面层与 M3/card-faces.html 同源（.f1–.f8 的 --grad 逐字一致）
     D. v3 纪律：危险色必须叫 --warn（无 --danger） / --line 与 --line-control 分离却不混用
     E. WCAG 复核（复用 contrast.js 的线性化算法）+ 无 scrollIntoView / 无位图 / 无 emoji */
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const FILE = process.argv[2];
const html = fs.readFileSync(FILE, "utf8");
const WORKSPACE = path.resolve(__dirname, "..");   /* 脚本在 tools/ 下 */
const dom = new JSDOM(html);
const doc = dom.window.document;
const cssRaw = [...doc.querySelectorAll("style")].map(s => s.textContent).join("\n");
/* 注释先剥掉：片段注释里的「星号+斜杠」会把花括号配平式切块切歪（第一版就栽在这） */
const css = cssRaw.replace(/\/\*[\s\S]*?\*\//g, "");
const bodyText = doc.body.textContent;

const out = [];
const A = (name, ok, extra) => out.push([ok ? "PASS" : "WARN", name, extra === undefined ? "" : String(extra)]);
const count = (re, s) => (s.match(re) || []).length;

/* ---------- 极简 CSS 解析：顶层规则切块（够用，不引第三方） ---------- */
function topRules(src) {
  const rules = [];
  let buf = "", depth = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "{") { depth++; buf += c; continue; }
    if (c === "}") {
      depth--;
      buf += c;
      if (depth === 0) { rules.push(buf); buf = ""; }
      continue;
    }
    buf += c;
  }
  return rules;
}
const RULES = topRules(css);

/* ============================================================
   1. 触摸目标 ≥44px
   ============================================================ */
const minHeights = [...css.matchAll(/min-height:\s*(\d+)px/g)].map(m => +m[1]);
A("存在 ≥44px 的触摸目标声明", minHeights.some(v => v >= 44), "min-height 値=" + [...new Set(minHeights)].sort((a, b) => a - b).join(","));
A("按钮基础高度 ≥44px", /\.btn\s*\{[^}]*min-height:\s*(4[4-9]|[5-9]\d)px/s.test(css) || /min-height:\s*44px/.test(css));
A("触摸目标令牌 --tap 已定义且被使用", /--tap:\s*44px/.test(css) && /min-height:\s*var\(--tap\)/.test(css));

/* ============================================================
   2. 焦点可见 / 状态
   ============================================================ */
A("定义了 :focus-visible 可见焦点", /:focus-visible/.test(css), count(/:focus-visible/g, css) + " 处");
A("定义了 :active 按下态", /:active/.test(css));
A("定义了 :disabled 态", /:disabled|\[disabled\]/.test(css));
A("定义了 hover 态", /:hover/.test(css));

/* ============================================================
   3. 无障碍与语义
   ============================================================ */
A("有 aria-label 或 aria-expanded", /aria-(label|expanded|hidden|live)/.test(html), count(/aria-/g, html) + " 处");
A("有 role=tablist/tab 或等价语义", /role="(tab|tablist|dialog|status)"/.test(html), count(/role="/g, html) + " 处");
A("有 prefers-reduced-motion 降级", /prefers-reduced-motion/.test(css));
A("设置了 lang=zh-CN", /<html[^>]+lang="zh-CN"/.test(html));
A("导航是 role=tablist + role=tab（可读的导航语义）", /role="tablist"/.test(html) && /role="tab"/.test(html));

/* ============================================================
   4. 反 AI 陈词 / 零外部依赖
   ============================================================ */
const emoji = bodyText.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu) || [];
A("正文无 emoji 当图标", emoji.length === 0, emoji.slice(0, 8).join(" "));
A("无紫粉蓝渐变套话", !/#(8B5CF6|A855F7|EC4899|F472B6|6366F1|818CF8)/i.test(css));
A("无 Inter/Roboto 作 display 字体", !/font-family[^;]*(Inter|Roboto)/i.test(css));
A("未引用外部字体/图片", !/@import|https?:\/\/[^"')]+\.(woff2?|png|jpe?g|svg)/i.test(html));
A("零位图（无 <img>、无 url(data:image）", !/<img\b/.test(html) && !/url\(\s*["']?data:image/i.test(html));
A("无 CDN / 外链脚本样式", !/<(script|link)[^>]+(src|href)="https?:/i.test(html));
A("金额使用 tabular-nums（等宽数字对齐）", /tabular-nums/.test(css), count(/tabular-nums/g, css) + " 处");
A("中文优先字阶（含 PingFang SC）", /PingFang SC/.test(css));
A("无 scrollIntoView（v3 硬禁止）", !/scrollIntoView/.test(html));

/* ============================================================
   5. 编造统计文本
   ============================================================ */
const fake = /(调研|数据显示|研究表明|据统计|平均用户|行业报告)/.test(bodyText);
A("正文无编造的调研/统计表述", !fake);

/* ============================================================
   6. 状态覆盖
   ============================================================ */
for (const st of ["empty", "loading"]) A("覆盖 " + st + " 态", new RegExp("\\." + st).test(css) || new RegExp(st).test(html));
A("覆盖 error 态视觉（.err）", /\.err\s*\{/.test(css));
A("覆盖 disabled 视觉", /\.(is-)?disabled|\[data-disabled="1"\]|:disabled/.test(css));

/* ============================================================
   7. 变体（Tweaks）
   ============================================================ */
const tweaks = [...doc.querySelectorAll("[data-tweak]")].map(e => e.dataset.tweak);
A("Tweaks 至少 3 个可切换维度", tweaks.length >= 3, tweaks.join(","));
A("含浅色/深色两套视觉方案", /data-tweak="theme"/.test(html) && count(/data-v="dark"/g, html) >= 1);
A("配色三档齐全（dark / light / auto）",
  /data-tweak="theme"/.test(html) && /data-v="auto"/.test(html) && count(/data-v="light"/g, html) >= 1,
  tweaks.includes("theme") ? "theme 组存在" : "缺 theme");

/* ============================================================
   8. 设备框
   ============================================================ */
const devices = doc.querySelectorAll(".device");
const deviceCount = devices.length || (html.match(/class="device"/g) || []).length;
A("iPhone 设备框 ≥1", deviceCount >= 1, deviceCount + " 台");

/* ============================================================
   9. 双模式：令牌同源（v3 §2 硬要求）
   ============================================================ */
function blockVars(re) {
  const blk = RULES.find(r => re.test(r.slice(0, r.indexOf("{")).trim()));
  if (!blk) return null;
  const body = blk.slice(blk.indexOf("{") + 1, blk.lastIndexOf("}"));
  const vars = {};
  for (const m of body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}
const darkVars = blockVars(/^:root/);
const lightVars = blockVars(/^\[data-palette="light"\]/);
/* 两模式共享的几何/动效常量：只在 :root 声明一次（不是颜色，无需镜像） */
const SHARED_NON_COLOR = new Set(["--r-s", "--r-m", "--r-l", "--r-xl", "--r-full", "--dur", "--ease", "--tap", "--scale"]);
A("深色令牌块存在（:root）", !!darkVars, darkVars ? Object.keys(darkVars).length + " 个变量" : "缺失");
A("浅色令牌块存在（[data-palette=light]）", !!lightVars, lightVars ? Object.keys(lightVars).length + " 个变量" : "缺失");
if (darkVars && lightVars) {
  /* 规则：浅色块里的每个变量都必须在 :root 有同名项；颜色类变量必须两套都在 */
  const miss = Object.keys(lightVars).filter(k => !(k in darkVars));
  const colorKeys = Object.keys(darkVars).filter(k => !SHARED_NON_COLOR.has(k));
  const colorMiss = colorKeys.filter(k => !(k in lightVars));
  A("两套令牌同名单（浅色无孤儿、颜色类一个不漏）", miss.length === 0 && colorMiss.length === 0,
    (miss.length ? "浅色孤儿: " + miss.join(",") : "") +
    (colorMiss.length ? " 浅色缺颜色类: " + colorMiss.join(",") : "颜色类 " + colorKeys.length + " 个已两套对齐；共享常量 " + SHARED_NON_COLOR.size + " 个"));
  const changed = colorKeys.filter(k => darkVars[k] !== lightVars[k]);
  A("颜色类令牌两套确实不同值（>= 90%）", changed.length >= colorKeys.length * 0.9,
    changed.length + "/" + colorKeys.length + " 不同；同值: " + colorKeys.filter(k => darkVars[k] === lightVars[k]).join(","));
  A("两模式共享的几何/动效常量同名同值（圆角/时长/触摸目标）",
    [...SHARED_NON_COLOR].every(k => k in darkVars) && [...SHARED_NON_COLOR].filter(k => k in lightVars).every(k => lightVars[k] === darkVars[k]),
    [...SHARED_NON_COLOR].join(","));
  for (const [k, why] of [["--bg", "页面底"], ["--surface", "卡片面"], ["--ink-1", "主文字"], ["--expense", "支出绿"], ["--accent", "品牌冰川蓝"], ["--line", "装饰线"], ["--line-control", "控件边界"]]) {
    A("浅色令牌 " + k + " 已定义（" + why + "）", !!lightVars[k], lightVars[k]);
  }
  A("浅色取消顶边内高光（--sh-card 无 inset）", !/inset/.test(lightVars["--sh-card"] || ""), lightVars["--sh-card"]);
  A("深色保留顶边内高光（--sh-card 有 inset）", /inset/.test(darkVars["--sh-card"] || ""), (darkVars["--sh-card"] || "").slice(0, 48));
  A("--hair 独立存在（1px 内描边）", !!darkVars["--hair"] && !!lightVars["--hair"]);
}
A("默认深色（html[data-palette=dark]）", /<html[^>]+data-palette="dark"/.test(html));
const themeGuard = [...doc.querySelectorAll("[data-pal][data-t]")];
A("换装哨兵齐全（dark/light 各 1 条）", themeGuard.length === 2, themeGuard.map(e => e.dataset.pal).join(","));

/* ============================================================
   10. 除卡面层外零硬编码色值
   ============================================================ */
/* 卡面层（v3 §4，明文允许写死色值；与 card-faces.html 逐字同源）
   另有 2 条刻意写死的常量：.brand .mark 与 .face .logo .mark ——
   品牌标记本身**就是**那块冰川蓝渐变（v3 §3：冰川蓝只用于图标/选中态/品牌资产），
   它不是「随模式换装的颜色」，进令牌表反而会让同一块品牌标记在两套模式下变得不同。 */
const CARD_SEL = sel => /(^|[,\s])\.face(\.[a-z0-9-]+)*(\s|$|,|:)/.test(sel) ||
                        /^\.f[1-8]$/.test(sel) ||
                        /^\[data-palette="(dark|light)"\]\s*\.face\b/.test(sel);
const BRAND_MARK = sel => /\.brand \.mark/.test(sel) || /\.face \.logo \.mark/.test(sel);
/* 冰面柔光边缘那条环：`linear-gradient(#000 0 0)` 里的 #000 是 **mask 的 alpha 通道**，
   不是调色板里的颜色 —— 它只决定「哪块区域保留、哪块被挖空」，永不显示在屏幕上。
   所以这条规则允许出现 #000，但它不是「散落色值」。 */
const MASK_ALPHA = sel => /::before$/.test(sel) && /\.(card|kpi|group)\b/.test(sel);
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const offenders = [];
const scanned = [];
for (const rule of RULES) {
  const i = rule.indexOf("{");
  const sel = rule.slice(0, i).trim();
  const body = rule.slice(i + 1, rule.lastIndexOf("}"));
  if (!sel) continue;
  /* 令牌声明块（:root / [data-palette=…]）就是色值该待的地方 */
  if (/^:root/.test(sel) || /^\[data-palette=/.test(sel)) { scanned.push("令牌块 " + sel.slice(0, 24)); continue; }
  if (CARD_SEL(sel) || BRAND_MARK(sel) || MASK_ALPHA(sel)) { scanned.push("白名单 " + sel.slice(0, 30)); continue; }
  const hexes = (body.match(HEX) || []);
  if (hexes.length) offenders.push(sel.slice(0, 40) + " → " + [...new Set(hexes)].join(" "));
}
A("除卡面层与令牌块外无散落硬编码色值", offenders.length === 0,
  offenders.length ? offenders.slice(0, 6).join(" | ") : scanned.filter(s => s.startsWith("白名单")).length + " 条白名单规则，其余 " + (RULES.length - scanned.length) + " 条零色值");
A("所有用色都走变量（var(--…) 引用数 >= 60）", count(/var\(--/g, css) >= 60, count(/var\(--/g, css) + " 处 var() 引用");

/* ============================================================
   11. 卡面层与 card-faces.html 同源
   ============================================================ */
const CARD_REF = path.join(WORKSPACE, "M3", "card-faces.html");
let refCss = "";
try { refCss = [...new JSDOM(fs.readFileSync(CARD_REF, "utf8")).window.document.querySelectorAll("style")].map(s => s.textContent).join("\n").replace(/\/\*[\s\S]*?\*\//g, ""); } catch (e) { refCss = ""; }
function grads(src) {
  const m = {};
  for (const r of topRules(src)) {
    const i = r.indexOf("{");
    if (i < 0) continue;
    const sel = r.slice(0, i).trim();           /* 先取干净的选择器，再判 */
    const sm = sel.match(/^\.(f[1-8])$/);
    if (!sm) continue;
    const body = r.slice(i + 1, r.lastIndexOf("}"));
    const g = body.match(/--grad:\s*([^;]+);/);
    const fb = body.match(/--grad-fallback:\s*([^;]+);/);
    const sc = body.match(/--scrim:\s*([^;]+);/);
    if (g) m[sm[1]] = [g[1].trim(), (fb || [])[1] && fb[1].trim(), (sc || [])[1] && sc[1].trim()].join(" | ");
  }
  return m;
}const gv2 = grads(css), gref = grads(refCss);
A("参考卡面页可读（" + CARD_REF + "）", Object.keys(gref).length === 8, Object.keys(gref).length + " 张");
A("v2 也有这 8 张卡面", Object.keys(gv2).length === 8, Object.keys(gv2).join(","));
if (Object.keys(gref).length === 8) {
  const diff = Object.keys(gref).filter(k => gv2[k] !== gref[k]);
  A("8 张卡面的 --grad/--grad-fallback/--scrim 与 card-faces.html 逐字一致", diff.length === 0,
    diff.length ? "不一致: " + diff.join(",") : "8/8 一致");
}
A("卡面本体 .face 规则同源（同一条 box-shadow 结构）",
  /\.face\s*\{[^}]*box-shadow:inset 0 1px 0 var\(--edge,rgba\(255,255,255,\.10\)\), 0 12px 28px rgba\(0,0,0,\.30\)/s.test(css));
A("卡面唯一适配只有外层 scale(.974)，未改卡面自身尺寸",
  /\.face\s*\{[^}]*width:350px;height:200px/s.test(css) && /transform:scale\(\.974\)/.test(css));

/* ============================================================
   12. v3 纪律
   ============================================================ */
A("危险/删除色叫 --warn（无 --danger 残留）", /--warn:/.test(css) && !/--danger/.test(css));
/* --line 只用于装饰分隔（border…var(--line) 或 --line-2）；
   控件边界必须走 --line-control（≥3:1），两者不得互换 */
A("--line 与 --line-control 分离且各司其职",
  /--line:\s*#26272B/.test(css) && /--line-control:\s*#6A6C73/.test(css) &&
  /border[^;]*var\(--line-2\)/.test(css) && /border[^;]*var\(--line-control\)/.test(css) &&
  !/border[^;]*var\(--line-control[^)]*\)\s*[^;]*[^-]line-2/.test(css));
A("底部导航是毛玻璃胶囊（blur 22px + saturate）", /--glass-blur:\s*22px/.test(css) && /backdrop-filter:blur\(var\(--glass-blur\)\)\s*saturate\(var\(--glass-sat\)\)/.test(css));
A("导航胶囊深/浅两值分别落地", /--glass-nav:\s*rgba\(36,37,40,\.62\)/.test(css) && /--glass-nav:\s*rgba\(255,255,255,\.78\)/.test(css) && /--glass-sat:\s*1\.8/.test(css));
/* 2026-10-04 迁移：律不变，目标从已删除的 .sumrow（记账页第二处 hero）改为真实承载它的资产卡 hero。 */
A("大数字 : 小标签 ≈4.2:1（44px : 10.5px，由资产卡 hero 承担）", /\.face \.number\s*\{[^}]*font-size:44px/s.test(css) && /\.face \.info \.lbl\s*\{[^}]*font-size:10\.5px/s.test(css));
A("大数字字距 −0.03em + tabular-nums", /letter-spacing:-\.03em/.test(css));
A("统计页胶囊筛选条（选中胶囊）", /\.seg\s*\{[^}]*border-radius:var\(--r-full\)/s.test(css) && /\.seg button\[data-on="1"\]/.test(css));
A("图表 Y 轴刻度在右", /\.chart \.yax\s*\{[^}]*right:0;[^}]*text-align:right/s.test(css));
A("图表极淡虚线网格", /\.chart \.grid span\s*\{[^}]*border-top:1px dashed var\(--ink-4\)/s.test(css));
A("图表折线 + 渐变填充（内联 SVG）", /<polygon class="t-area"/.test(html) && /<polyline class="t-line"/.test(html) && /linearGradient/.test(html));
A("资产卡在记账页顶部（v3 §4 默认冰川蓝主卡）", /class="asset"[^>]*data-face="glacier-card"/.test(html) && /assetCard\(/.test(html));
/* 语义色断言按**色相关系**验，而不是钉死十六进制字面量：
   原先钉 #45D07E/#0F7A46/#FF6F5E/#C4362B，导致为了让弱文字在「页面底+环境光」
   最坏合成上过 4.5:1 而微调 --expense（#0F7A46→#0C7341）时误报。
   绿/红的语义不变，所以改为判定色相区间——对合法的取值微调鲁棒，对语义变更仍然拦得住。 */
const tokHexes = name => [...css.matchAll(new RegExp("--" + name + ":\\s*(#[0-9a-f]{6})", "gi"))].map(m => m[1]);
const hueOf = h => {
  const n = parseInt(h.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = (mx - mn) || 1e-9;
  const x = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (x * 60 + 360) % 360;
};
const expToks = tokHexes("expense"), incToks = tokHexes("income");
A("支出=绿 / 收入=红（两模式各一，按色相判定）",
  expToks.length === 2 && incToks.length === 2 &&
  expToks.every(h => hueOf(h) > 90 && hueOf(h) < 175) &&
  incToks.every(h => hueOf(h) < 25 || hueOf(h) > 345));

/* ============================================================
   13. WCAG 复核（复用 contrast.js 的线性化算法）
   ============================================================ */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const Y = hex => {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
  return 0.2126 * lin(parseInt(n.slice(0, 2), 16)) + 0.7152 * lin(parseInt(n.slice(2, 4), 16)) + 0.0722 * lin(parseInt(n.slice(4, 6), 16));
};
const CR = (a, b) => { const y1 = Y(a), y2 = Y(b); const hi = Math.max(y1, y2), lo = Math.min(y1, y2); return (hi + 0.05) / (lo + 0.05); };
function crVar(vars, key) { const v = (vars[key] || "").trim(); return /^#[0-9a-fA-F]{3,8}$/.test(v) ? v : null; }
if (darkVars && lightVars) {
  const checks = [
    ["深 墨1 on 页面底", crVar(darkVars, "--ink-1"), crVar(darkVars, "--bg"), 4.5],
    ["深 墨2 on 页面底", crVar(darkVars, "--ink-2"), crVar(darkVars, "--bg"), 4.5],
    ["深 墨3 on 卡片面", crVar(darkVars, "--ink-3"), crVar(darkVars, "--surface"), 4.5],
    ["深 品牌 on 页面底", crVar(darkVars, "--accent"), crVar(darkVars, "--bg"), 4.5],
    ["深 支出 on 页面底", crVar(darkVars, "--expense"), crVar(darkVars, "--bg"), 4.5],
    ["深 收入 on 页面底", crVar(darkVars, "--income"), crVar(darkVars, "--bg"), 4.5],
    ["深 危险 on 卡片面", crVar(darkVars, "--warn"), crVar(darkVars, "--surface"), 4.5],
    ["深 控件边界 on 卡片面（非文本 ≥3）", crVar(darkVars, "--line-control"), crVar(darkVars, "--surface"), 3.0],
    ["浅 墨1 on 页面底", crVar(lightVars, "--ink-1"), crVar(lightVars, "--bg"), 4.5],
    ["浅 墨2 on 页面底", crVar(lightVars, "--ink-2"), crVar(lightVars, "--bg"), 4.5],
    ["浅 墨3 on 卡片面", crVar(lightVars, "--ink-3"), crVar(lightVars, "--surface"), 4.5],
    ["浅 品牌 on 卡片面", crVar(lightVars, "--accent"), crVar(lightVars, "--surface"), 4.5],
    ["浅 支出 on 卡片面", crVar(lightVars, "--expense"), crVar(lightVars, "--surface"), 4.5],
    ["浅 收入 on 卡片面", crVar(lightVars, "--income"), crVar(lightVars, "--surface"), 4.5],
    ["浅 危险 on 卡片面", crVar(lightVars, "--warn"), crVar(lightVars, "--surface"), 4.5],
    ["浅 控件边界 on 卡片面（非文本 ≥3）", crVar(lightVars, "--line-control"), crVar(lightVars, "--surface"), 3.0],
  ];
  let bad = [];
  for (const [n, fg, bg, need] of checks) {
    if (!fg || !bg) { bad.push(n + "(变量非字面色值，跳过)"); continue; }
    const v = CR(fg, bg);
    if (v < need) bad.push(n + " " + v.toFixed(2) + "<" + need);
  }
  A("WCAG 复核：16 组文字/控件对比度全部达标", bad.length === 0, bad.length ? bad.join(" | ") : "最低项已达标");
}

/* ============================================================
   14. 用户原始需求覆盖
   ============================================================ */
const need = [["记账首屏", /本月支出/], ["语音输入", /语音|按住说话/], ["手动输入", /手动/], ["今日记录", /今日记录|今天/],
  ["统计月季年", /月[\s\S]*季[\s\S]*年/], ["趋势图", /趋势/], ["分类分布", /分布/], ["历史按天", /历史/],
  ["货币单位", /人民币|美元|欧元/], ["分类管理", /分类/], ["导出 CSV", /CSV/], ["清空数据", /清空/]];
for (const [n, re] of need) A("覆盖需求：" + n, re.test(bodyText));

/* ============================================================
   15. 冰面边缘伪元素的宿主必须自身 positioned（2026-10-04 实测定因）
   真因：::before{inset:0} 是相对**最近定位祖先**解析的。宿主若没有 position，
   伪元素就会铺满祖先的盒子；而 border-radius:inherit 拿到的是胶囊的 999px，
   于是 332×290 的祖先盒被画成一整个巨大椭圆 —— 它会横跨界面，读起来像
   「一条来历不明的圆圈」。这个缺陷对其它所有检查都不可见，必须单独钉死。
   ============================================================ */
const rimRule = (css.match(/[^{}]*::before[^{}]*\{[^}]*\}/g) || []).find(r => /--rim-edge/.test(r));
const rimHosts = rimRule
  ? rimRule.slice(0, rimRule.indexOf("{")).split(",").map(s => s.replace(/::before/g, "").trim()).filter(Boolean)
  : [];
const rimBad = rimHosts.filter(h => {
  const esc = h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = css.match(new RegExp("(?:^|[},])\\s*" + esc + "\\s*\\{([^}]*)\\}", "m"));
  return !m || !/position:\s*(relative|absolute|fixed|sticky)/.test(m[1]);
});
A("冰面边缘伪元素的宿主全部自身 positioned（防「巨型椭圆」回归）",
  rimHosts.length >= 6 && rimBad.length === 0,
  rimBad.length ? "未定位：" + rimBad.join(" / ") : rimHosts.length + " 个宿主均已定位");

/* ============================================================
   16. 屏内环境光必须铺在整屏容器上（2026-10-04，用户报「能明显看见不同区域的分层」）
   真因：环境光原本挂在 .scroll 上，而 .scroll 是从标题下方才开始的 ——
   标题以上是纯 --bg、以下带径向光斑，交界处就形成一道横向硬边界。
   它不改令牌、不改盒子、不改对比度，四套检查全绿也照样看得见 → 只能结构断言钉住。
   ============================================================ */
const ruleOf = sel => {
  const m = css.match(new RegExp("(?:^|[},])\\s*" + sel + "\\s*\\{([^}]*)\\}", "m"));
  return m ? m[1] : "";
};
const screenRule = ruleOf("\\.screen");
const scrollRule = ruleOf("\\.scroll");
A("环境光挂在 .screen（整屏连续底），不在 .scroll 上",
  /radial-gradient/.test(screenRule) && !/radial-gradient/.test(scrollRule),
  /radial-gradient/.test(scrollRule) ? "仍有 .scroll 背景渐变 → 会出现横向分层" : "连续底");
A("顶部右侧小字与统计页月份入口共用同一套胶囊语言",
  /\.nav\s+\.sub\s*\{[^}]*border-radius:\s*var\(--r-full\)/.test(css) &&
  /\.nav\s+\.jump\s*\{[^}]*border-radius:\s*var\(--r-full\)/.test(css));

console.log(out.map(([s, n, e]) => s + " " + n + (e ? "  [" + e + "]" : "")).join("\n"));
const warns = out.filter(o => o[0] === "WARN");
console.log("\n合计 " + out.length + " 项，WARN " + warns.length);
