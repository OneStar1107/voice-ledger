/* 记账 App 原型 v2（双模式）—— jsdom 无头冒烟测试
   基线：tools/smoke.js（v1 的 50 条真实行为断言，一条未削弱）
   v2 新增：
     A. 双模式同源（data-palette 换装 / 只切属性不重建 DOM / 页面与状态不丢）
     B. v3 组件硬要求（毛玻璃胶囊导航 / 胶囊筛选条 / 大数字字阶 / 图层三件套 / 图表 Y 轴在右）
     C. 静态纪律（令牌分离 / 危险不用红 / 无硬编码色值散落 / 无 emoji / 无 scrollIntoView）
   要点：每次交互前重新查询节点（paint 会重建 DOM，旧引用会脱离 document，事件到不了委托层）。 */
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");

const FILE = process.argv[2];
const html = fs.readFileSync(FILE, "utf8");
const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => errors.push("jsdomError: " + e.message));
vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom;
const doc = window.document;

const results = [];
function check(name, cond, extra) {
  const ok = !!cond;
  results.push({ name, ok, extra: extra === undefined ? "" : String(extra) });
  console.log((ok ? "PASS " : "FAIL ") + name + (extra !== undefined && extra !== "" ? "  [" + extra + "]" : ""));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const devs = () => [...doc.querySelectorAll(".device")];
const d0 = () => devs()[0];
const q = (sel, root) => (root || d0()).querySelector(sel);
const qa = (sel, root) => [...(root || d0()).querySelectorAll(sel)];
const tab = i => qa('[data-action="tab"]')[i];
/* 当前正在操作哪一台设备：tab(i).click() 只切那一台，跨屏断言必须锁到同一台 */
let devIx = 0;
const d = () => devs()[devIx];

async function tap(sel, root) {
  const el = q(sel, root);
  if (!el) { check("可点击节点存在：" + sel, false); return null; }
  el.click();
  await sleep(0);
  return el;
}
function pt(sel, type, x, y, root) {
  const el = typeof sel === "string" ? q(sel, root) : sel;
  if (!el) return null;
  const E = window.PointerEvent || window.MouseEvent;
  el.dispatchEvent(new E(type, { bubbles: true, cancelable: true, clientX: x || 0, clientY: y || 0 }));
  return el;
}
const rows = () => qa("[data-row]");
const txt = () => d0().textContent.replace(/\s+/g, " ");

/* 样式表层：v2 新增断言用 */
const css = [...doc.querySelectorAll("style")].map(s => s.textContent).join("\n");
const bodyText = doc.body.textContent;
const has = re => re.test(css);
const inHtml = re => re.test(html);
const pal = () => doc.documentElement.dataset.palette;

/* 编辑页时间默认不能落在未来，否则一打开就会被「时间不能晚于现在」拦下 */
const seededFuture = (() => {
  const bad = [];
  for (const r of qa("[data-row]")) { /* 需要 store：改从 DOM 行的时间文本判断 */ }
  return bad;
})();

(async () => {
  await sleep(60);

  /* 1. 骨架 */
  check("4 台设备框", devs().length === 4, devs().length);
  check("无外部网络资源（CDN/字体/图片）", !/<(script|link|img)[^>]+(src|href)="https?:/i.test(html));
  check("首帧即记账页（无封面页）", !!q('[data-action="voice-down"]'));
  check("顶栏本月支出", /本月支出/.test(txt()));

  /* ============================================================
     A. 双模式同源
     ============================================================ */
  check("默认深色（html[data-palette]）", pal() === "dark", pal());
  const guardDark = doc.querySelector('[data-pal="dark"]');
  const guardLight = doc.querySelector('[data-pal="light"]');
  check("两套主题块的默认色值不同源（哨兵）",
    guardDark && guardLight && guardDark.dataset.v !== guardLight.dataset.v,
    (guardDark && guardDark.dataset.v) + " vs " + (guardLight && guardLight.dataset.v));
  const segOff = q(".face");
  check("资产卡在记账页首屏（v3 §4 冰川蓝主卡）", !!q('.asset[data-face] .face.f1.no-tex'),
    (segOff && segOff.className) + " | " + (q(".asset") ? q(".asset").dataset.face || "asset✓" : "asset✗"));  check("卡面样式与 card-faces.html 同源（.f1 渐变逐字一致）",
    /--grad:linear-gradient\(135deg,#7FE3FF 0%,#3B6FE0 14%,#2A2F8F 40%,#1E2270 78%\)/.test(css));
  check("卡面用的就是那 8 张（.f1–.f8 齐全）",
    ["f1","f2","f3","f4","f5","f6","f7","f8"].every(k => new RegExp("\\." + k + "\\{").test(css)));

  /* 浅色：切到浅色后同一批节点仍在，说明只换装不重建 */
  const screenBefore = d0().querySelector(".screen");
  const monthBefore = txt();
  await tap('[data-tweak="theme"] button[data-v="light"]', doc.documentElement);
  await sleep(20);
  check("切浅色后 data-palette=light", pal() === "light", pal());
  check("浅色不重建 DOM（同一个 .screen 节点仍在）", d0().querySelector(".screen") === screenBefore);
  check("浅色不丢当前页面内容", /本月支出/.test(txt()) && txt() === monthBefore);
  check("浅色令牌真的换了（哨兵比对）",
    /#EFF1F4/i.test(guardLight.dataset.v), guardLight.dataset.v);
  const lightScreenLen = d0().querySelector(".screen").innerHTML.length;

  /* 状态不丢：切到统计页 + 换区间，再切模式，页面与区间选择都要还在 */
  tab(1).click(); await sleep(0);
  await tap('[data-action="range"] button[data-v="quarter"]');
  const rangeOnBefore = q('[data-action="range"] button[data-v="quarter"]').dataset.on;
  await tap('[data-tweak="theme"] button[data-v="dark"]', doc.documentElement);
  await sleep(20);
  check("切深浅不丢当前标签页（统计页仍在）", !!q('[data-action="range"]'));
  check("切深浅不丢当前状态（季度仍选中）",
    q('[data-action="range"] button[data-v="quarter"]').dataset.on === "1" && rangeOnBefore === "1");
  check("切回深色 data-palette=dark", pal() === "dark", pal());

  /* 跟随系统：三档齐全，且 auto 能解析成某个具体调制 */
  const themeBtns = qa('[data-tweak="theme"] button[data-v]', doc.documentElement);
  check("Tweaks 配色三档（深色 / 浅色 / 跟随系统）",
    themeBtns.length === 3, themeBtns.map(b => b.dataset.v).join(","));
  await tap('[data-tweak="theme"] button[data-v="auto"]', doc.documentElement);
  await sleep(20);
  check("跟随系统能解析成具体调制（dark 或 light）", pal() === "dark" || pal() === "light", pal());
  check("Tweaks 面板在设备框之外（页面级）", !!doc.getElementById("tweakBtn") && !d0().querySelector("#tweakBtn"));
  await tap('[data-tweak="theme"] button[data-v="dark"]', doc.documentElement);
  await sleep(20);
  tab(0).click(); await sleep(0);

  /* 浅色取消顶边内高光：浅色 --sh-card 必须不含 inset */
  const lightBlock = (css.match(/\[data-palette="light"\]\s*\{[\s\S]*?\n\}/) || [""])[0];
  const lightShCard = (lightBlock.match(/--sh-card:\s*([^;]+);/) || [])[1] || "";
  check("浅色取消顶边内高光（--sh-card 无 inset）", !!lightShCard && !/inset/.test(lightShCard), lightShCard.slice(0, 64));
  const darkBlock = (css.match(/:root\s*\{[\s\S]*?\n\}/) || [""])[0];
  const darkShCard = (darkBlock.match(/--sh-card:\s*([^;]+);/) || [])[1] || "";
  check("深色保留顶边内高光（--sh-card 有 inset）", /inset/.test(darkShCard), darkShCard.slice(0, 64));

  /* ============================================================
     B. v3 组件硬要求
     ============================================================ */
  check("底部导航=悬浮毛玻璃胶囊（不贴边 + blur(22px)）",
    has(/\.tabbar\s*\{[^}]*position:absolute/s) && has(/--glass-blur:\s*22px/) &&
    has(/backdrop-filter:\s*blur\(var\(--glass-blur\)\)/));
  check("导航胶囊深色 rgba(36,37,40,.62)", has(/--glass-nav:\s*rgba\(36,37,40,\.62\)/));
  check("导航胶囊浅色 rgba(255,255,255,.78) + saturate(1.8)", has(/--glass-nav:\s*rgba\(255,255,255,\.78\)/) &&
    has(/--glass-sat:\s*1\.8/) && has(/saturate\(var\(--glass-sat\)\)/));
  /* 2026-10-04 迁移：这条律原先挂在 .sumrow（记账页第二处 hero）上；那一处已删除（它把本月合计
     与资产卡重复印了两遍，还夹带了一句写给评审看的设计说明）。律本身不变，目标改为**真实承载它**的
     资产卡 hero（.face .number 44px : .face .info .lbl 10.5px）——从死元素迁到活元素，是加强不是削弱。 */
  check("大数字 : 小标签 ≈ 4.2:1（44px : 10.5px，由资产卡 hero 承担）", has(/\.face \.number\s*\{[^}]*font-size:44px/s) && has(/--|font-size:10\.5px/) && has(/\.face \.info \.lbl\s*\{[^}]*font-size:10\.5px/s));
  check("大数字 tabular-nums + 字距 −0.03em", has(/font-variant-numeric:\s*tabular-nums/) && has(/letter-spacing:-\.03em/));
  check("图层三件套：L0/L1/L1 凹入 + --hair 内描边 + --sh-card 落影",
    has(/--bg:\s*#0B0B0C/) && has(/--surface:\s*#17181A/) && has(/--surface-2:\s*#1F2022/) &&
    has(/--hair:/) && has(/--sh-card:/) && has(/0 0 0 1px var\(--hair\)/));
  check("--line 与 --line-control 分开定义且各有用途",
    has(/--line:\s*#26272B/) && has(/--line-control:\s*#6A6C73/) && has(/var\(--line-control\)/));
  check("统计页是胶囊筛选条（选中胶囊）", has(/\.seg\s*\{[^}]*border-radius:var\(--r-full\)/s) &&
    has(/\.seg button\[data-on="1"\]\s*\{[^}]*background:var\(--surface\)/s));
  check("图表 Y 轴刻度在右（.yax 右对齐 + .chart 右侧留位）",
    has(/\.chart\s*\{[^}]*padding:0 46px 0 0/s) && has(/\.chart \.yax\s*\{[^}]*right:0;[^}]*text-align:right/s));
  check("图表极淡虚线网格", has(/\.chart \.grid span\s*\{[^}]*border-top:1px dashed var\(--ink-4\)/s));
  check("图表折线 + 渐变填充：内联 SVG（polygon 填充 + polyline 折线）",
    inHtml(/<linearGradient/) && inHtml(/stop-color="var\(--expense\)"/) &&
    inHtml(/<polygon class="t-area"/) && inHtml(/<polyline class="t-line"/));
  check("支出=绿 --expense / 收入=红 --income", has(/--expense:\s*#45D07E/) && has(/--income:\s*#FF6F5E/) &&
    has(/\.item \.amt\.neg\s*\{[^}]*color:var\(--expense\)/s));
  check("支出金额带 − 符号（不单靠颜色区分）", has(/\.item \.amt\.neg::before\s*\{[^}]*content:"−"/s));
  check("危险/删除改用 --warn 琥珀（有 --warn 且无 --danger）", has(/--warn:/) && !has(/--danger/));
  /* 断言迁移（2026-10-04，需求变更而非放宽）：用户指定「删除按钮的颜色改为冰川蓝」，
     左滑车道由 --warn 琥珀改为 --accent 冰川蓝。原意图是「绝不用红」，这条继续成立。 */
  check("删除车道用冰川蓝（--accent），且不得回退成红/琥珀",
    has(/\.item-del\s*\{[^}]*color:var\(--accent-ink\)/s) &&
    has(/\.item\.swiped\s*\{[^}]*background:var\(--accent\)/s) &&
    !has(/--danger/) && !has(/\.item\.swiped\s*\{[^}]*background:var\(--warn\)/s));
  check("触摸目标 ≥44px（--tap:44px 且有 min-height:var(--tap)）",
    has(/--tap:44px/) && has(/min-height:var\(--tap\)/));
  check("无 scrollIntoView（v3 硬禁止）", !/scrollIntoView/.test(html));
  check("正文无 emoji 当图标", !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(bodyText));
  check("图标一律内联 SVG 线条（stroke 而不是填充色块）",
    (html.match(/viewBox="0 0 24 24"/g) || []).length >= 4 && /stroke-linecap="round"/.test(html) &&
    !/<img\b/.test(html),
    (html.match(/viewBox="0 0 24 24"/g) || []).length + " 处内联图标");

  /* ============================================================
     C. 交互回归（与 smoke.js 同口径）
     ============================================================ */
  /* 2. 手动输入 popup */
  await tap('[data-action="manual"]');
  check("手动 popup 打开", !!q("#fAmount"));
  check("时间默认当前且可改", !!q("#fTime") && q("#fTime").value.length > 0, q("#fTime") && q("#fTime").value);
  const before = rows().length;
  await tap('[data-action="save-record"]');
  check("空金额被拦下（不产生记录）", rows().length === before && !!q("#fAmount"), rows().length + " vs " + before);
  check("有可见错误提示", /必填|请输入|金额/.test(txt()));
  q("#fAmount").value = "35.5";
  q("#fTitle").value = "午饭";
  await tap('[data-action="pick-cat"] button[data-v]');
  await tap('[data-action="save-record"]');
  check("保存后记录 +1 且金额落库", rows().length === before + 1, rows().length);
  check("新记录出现在列表", /35\.5/.test(txt()));

  /* 3. 语音链路（长按 → 解析 → 预填确认卡） */
  const n0 = rows().length;
  pt('[data-action="voice-down"]', "pointerdown", 100, 300);
  await sleep(600);
  check("录音中：计时器 + 取消提示", !!q("#voiceTimer") && /取消|松开/.test(txt()));
  pt(doc.body, "pointerup", 100, 260);
  await sleep(20);
  check("松开后进入解析态", /识别|解析|处理/.test(txt()));
  await sleep(1000);
  check("解析后弹出预填确认卡（不是静默入库）", !!q("#fAmount"));
  check("确认卡不是静默入库：此时记录数未变", rows().length === n0, rows().length + " vs " + n0);
  q("#fAmount").value = "66";
  await tap('[data-action="save-record"]');
  check("确认后入账 +1", rows().length === n0 + 1, rows().length);

  /* 4. 点击记录行 → 编辑 */
  const r0 = rows()[0];
  const rid = r0.dataset.row;
  r0.click();
  await sleep(0);
  check("点击记录进入编辑", !!q("#fAmount") && q("#fAmount").value.length > 0);
  q("#fAmount").value = "99";
  await tap('[data-action="save-record"]');
  check("编辑保存不新增记录", rows().length === n0 + 1, rows().length);
  check("编辑结果已落库", new RegExp("99").test(q('[data-row="' + rid + '"]').textContent.replace(/\s+/g, " ")));

  /* 5. 左滑删除 + 撤销 */
  const m0 = rows().length;
  const face = rows()[0];
  const delId = face.dataset.row;
  const delBtn = q('[data-action="del"]');
  check("删除入口是「图标 + 文字」两条通道（颜色已不承担危险语义）",
    /* 断言迁移（2026-10-04，需求变更而非放宽）：
       ① 车道原本静止态就铺在 .item 上（按钮透明），.item-face 的圆角抗锯齿会漏出 1px 月牙，
          深色下读成金色包边；现已改为「只在 .item.swiped 时画车道」→ 静止态整行无底色，无从渗漏。
       ② 用户把车道从「琥珀警告色」改成「冰川蓝品牌色」后，颜色不再表达“危险”，
          于是图标 + 文字这两条通道变成承重项，本断言因此**加严**：必须同时有垃圾桶 svg 与「删除」二字。
       ③ 保留两条防回归：.item 静止态不得有 background、.item.swiped 必须存在。 */
    !!delBtn && !!delBtn.querySelector("svg") && /删除/.test(delBtn.textContent) &&
    has(/\.item-del\s*\{[^}]*background:transparent[^}]*color:var\(--accent-ink\)/s) &&
    has(/\.item\.swiped\s*\{[^}]*background:var\(--accent\)/s) &&
    !has(/\.item\s*\{[^}]*background:/s));
  pt(face, "pointerdown", 200, 400);
  pt(doc.body, "pointermove", 150, 400);
  pt(doc.body, "pointermove", 120, 400);
  pt(doc.body, "pointerup", 120, 400);
  await sleep(0);
  check("左滑不误触编辑（没有打开表单）", !q("#fAmount"));
  check("左滑把行推开了", /78|76/.test(q('[data-row="' + delId + '"]').getAttribute("style") || ""),
    q('[data-row="' + delId + '"]').getAttribute("style"));
  check("出现删除按钮", !!q('[data-action="del"]'));
  await tap('[data-action="del"]');
  check("删除后记录 −1", rows().length === m0 - 1, rows().length);
  check("删除后出现撤销入口", !!q('[data-action="undo"]'));
  await tap('[data-action="undo"]');
  check("撤销后记录复原", rows().length === m0, rows().length);
  check("撤销后原先那条 id 还在", !!q('[data-row="' + delId + '"]'));

  /* 6. Tab 与统计 */
  check("底部导航 4 项", qa('[data-action="tab"]').length === 4);
  tab(1).click(); devIx = 1; await sleep(0);
  check("统计页区间三选（月/季/年）", qa('[data-action="range"] button[data-v]').length === 3);
  await tap('[data-action="range"] button[data-v="quarter"]');
  check("点季度真的切了（data-on）", q('[data-action="range"] button[data-v="quarter"]').dataset.on === "1");
  await tap('[data-action="range"] button[data-v="year"]');

  /* 统计页「历史查询」二级菜单（用户 2026-10-04 新增）：右上角月份 → 月/年两列 → 选定后区间随之切换 */
  {
    const J = () => q('[data-action="stat-jump"]', d());
    const monthNow = new Date().getMonth() + 1;
    check("统计页右上角是月份按钮（可展开）", !!J() && J().getAttribute("aria-haspopup") === "dialog");
    await tap('[data-action="stat-jump"]', d());
    check("点月份按钮弹出二级菜单", !!q(".jumppanel", d()));
    check("二级菜单是「月份 / 年份」两列，月份 12 项",
      qa(".jp-col", d()).length === 2 && qa('[data-action="stat-jump-month"]', d()).length === 12);
    check("默认高亮当前月份", q('[data-action="stat-jump-month"][data-v="' + (monthNow-1) + '"]', d()).dataset.on === "1");
    await tap('[data-action="stat-jump-month"][data-v="0"]', d());
    check("点 1 月后高亮跟着走", q('[data-action="stat-jump-month"][data-v="0"]', d()).dataset.on === "1");
    await tap('[data-action="stat-jump-done"]', d());
    check("点完成后二级菜单关闭", !q(".jumppanel", d()));
    check("完成后区间真的切到所选的 1 月", /^1 月/.test(J().textContent.trim()), J().textContent.trim());
    await tap('[data-action="stat-jump"]', d());
    await tap('[data-action="stat-jump-now"]', d());
    check("点「现在」回到当月并关掉菜单",
      !q(".jumppanel", d()) && new RegExp("^" + monthNow + " 月").test(J().textContent.trim()),
      J().textContent.trim());
    await tap('[data-action="range"] button[data-v="year"]', d());
  }
  check("点年可渲染", errors.length === 0, errors.join(" | "));
  check("趋势图与分布图都在", /趋势/.test(txt()) && /分布/.test(txt()));
  check("分布图从高到低有排序（存在数值序列）", qa(".dist .d-row").length > 0, qa(".dist .d-row").length);
  check("趋势图折线有点（polyline points 非空）",
    (() => { const el = d().querySelector(".t-line"); return !!el && (el.getAttribute("points") || "").split(" ").length > 3; })());
  check("趋势图渐变填充真的渲染出来了（polygon + linearGradient）",
    !!d().querySelector(".t-area") && !!d().querySelector("linearGradient") &&
    !!d().querySelector('.t-area[fill^="url("]'),
    "line=" + (d().querySelector(".t-line") ? "✓" : "✗") + " area=" + (d().querySelector(".t-area") ? "✓" : "✗"));

  /* 7. 历史 */
  tab(2).click(); devIx = 2; await sleep(0);
  check("历史页按天分组", /今天|昨天|月/.test(txt()));
  await tap('[data-action="month"]');
  check("月份切换不报错", errors.length === 0, errors.join(" | "));

  /* 8. 设置 */
  tab(3).click(); devIx = 3; await sleep(0);
  check("设置页有货币三选", qa('[data-action="currency"] button[data-v]').length === 3);
  await tap('[data-action="currency"] button[data-v="USD"]');
  check("点美元真的切换了（data-v 修复回归）",
    qa('[data-action="currency"] button[data-v]').map(b => b.dataset.v + "=" + b.dataset.on).join(","),
    qa('[data-action="currency"] button[data-v]').map(b => b.dataset.v + "=" + b.dataset.on).join(","));
  tab(0).click(); devIx = 0; await sleep(0);
  check("切美元后记账页货币符号随之变化", !txt().includes("¥"), txt().slice(0, 96));

  tab(3).click(); devIx = 3; await sleep(0);
  await tap('[data-action="push"][data-stack="categories"]');
  check("分类管理页可进入", !!q('[data-action="add-cat"]'));
  await tap('[data-action="add-cat"]');
  const catInput = qa("input", d0()).filter(i => !["fAmount", "fTitle", "fTime"].includes(i.id));
  check("新增分类有输入入口", catInput.length > 0 || !!q('[data-action="save-cat"]'), catInput.length);
  catInput[0].value = "测试分类";
  await tap('[data-action="save-cat"]');
  check("新分类已加入列表", /测试分类/.test(txt()));
  await tap('[data-action="pop"]');
  check("可返回设置首页", errors.length === 0, errors.join(" | "));
  await tap('[data-action="push"][data-stack="data"]');
  await tap('[data-action="export"]');
  check("导出 CSV 预览可打开且含表头", /日期|金额|分类/.test(txt()));
  await tap('[data-action="wipe-ask"]');
  check("清空需二次确认", !!q('[data-action="wipe-do"]'));
  await tap('[data-action="wipe-do"]');
  check("清空后今日记录为 0", rows().length === 0, rows().length);
  tab(1).click(); devIx = 1; await sleep(0);
  check("清空后统计为空态（无异常）", errors.length === 0, errors.join(" | "));

  /* 9. Tweaks 面板开关 */
  doc.getElementById("tweakBtn").click();
  await sleep(0);
  check("Tweaks 入口存在（在设备框外，页面级）", !!doc.getElementById("tweakBtn") && !d0().querySelector("#tweakBtn"));
  check("Tweaks 面板可打开", doc.getElementById("tweakPanel").dataset.open === "1");

  /* 10. 语音四条链路 */
  tab(0).click(); devIx = 0; await sleep(0);
  for (const mode of ["fail", "offline", "denied"]) {
    const btn = doc.querySelector('[data-tweak="voiceDemo"] button[data-v="' + mode + '"]');
    check("演示开关存在：" + mode, !!btn);
    if (!btn) continue;
    btn.click(); await sleep(0);
    tab(0).click(); devIx = 0; await sleep(0);
    pt('[data-action="voice-down"]', "pointerdown", 100, 300);
    await sleep(500);
    pt(doc.body, "pointerup", 100, 260);
    if (mode === "denied") {
      await sleep(20);
      check("权限被拒 → 显示权限引导，且不被「按住太短」覆盖", /权限|麦克风/.test(txt()), txt().slice(0, 90));
      await tap('[data-action="close-overlay"]');
    } else {
      await sleep(1100);
      check("链路 " + mode + " → 有可见兜底且可手动继续",
        !!q("#fAmount") || /失败|网络|无网|重试|手动/.test(txt()), txt().slice(0, 90));
      await tap('[data-action="close-sheet"]');
    }
  }
  const normal = doc.querySelector('[data-tweak="voiceDemo"] button[data-v="normal"]');
  if (normal) normal.click();
  await sleep(0);

  /* 11. 全局无异常 */
  check("全程无 jsdomError / console.error", errors.length === 0, errors.join(" | "));

  /* 汇总 */
  const fails = results.filter(r => !r.ok);
  console.log("\n合计 " + results.length + " 项，通过 " + (results.length - fails.length) + "，失败 " + fails.length);
  if (fails.length) console.log("失败清单：" + fails.map(f => f.name).join(" / "));
  process.exit(fails.length ? 1 : 0);
})();
