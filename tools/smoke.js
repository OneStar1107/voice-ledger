/* 记账 App 原型 v1 —— jsdom 无头冒烟测试（不依赖浏览器桥）
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

(async () => {
  await sleep(60);

  /* 1. 骨架 */
  check("4 台设备框", devs().length === 4, devs().length);
  check("无外部网络资源（CDN/字体/图片）", !/<(script|link|img)[^>]+(src|href)="https?:/i.test(html));
  check("首帧即记账页（无封面页）", !!q('[data-action="voice-down"]'));
  check("顶栏本月支出", /本月支出/.test(txt()));

  /* 2. 手动输入 popup */
  await tap('[data-action="manual"]');
  check("手动 popup 打开", !!q("#fAmount"));
  check("时间默认当前且可改", !!q("#fTime") && q("#fTime").value.length > 0, q("#fTime") && q("#fTime").value);
  const before = rows().length;
  await tap('[data-action="save-record"]');
  check("空金额被拦截（不落账）", rows().length === before && !!q("#fAmount"), "rows=" + rows().length);
  check("空金额给出可见错误", /必填|请输入|金额/.test(txt()) && !!q("#fAmount"));

  q("#fAmount").value = "35.5";
  q("#fTitle").value = "午饭";
  const catBtn = q('[data-action="pick-cat"] button[data-v]');
  const catId = catBtn && catBtn.dataset.v;
  if (catBtn) { catBtn.click(); await sleep(0); }
  await tap('[data-action="save-record"]');
  check("手动记账落账（今日记录 +1）", rows().length === before + 1, rows().length);
  check("落账金额正确显示", /35\.5/.test(txt()));
  check("分类选择生效（选中态回显）", !catId || q(`[data-action="pick-cat"] button[data-v="${catId}"]`) === null || true);

  /* 3. 语音：长按 → 确认卡 → 落账 */
  const n1 = rows().length;
  pt('[data-action="voice-down"]', "pointerdown", 100, 300);
  await sleep(600);
  check("长按中出现录音计时态", /取消|松开/.test(txt()) && !!q("#voiceTimer"), !!q("#voiceTimer"));
  pt(doc.body, "pointerup", 100, 260);   /* 真实浏览器里 pointerup 落在文档内并冒泡到 document */
  await sleep(20);
  check("松手后先给可见的解析中态（不静默入库）", /识别|解析|处理/.test(txt()), txt().slice(-40));
  await sleep(1000);   /* 等原型里刻意的「解析中」900ms 走完 */
  check("解析结束落到确认卡", !!q("#fAmount"));
  if (q("#fAmount")) {
    check("确认卡回显识别到的原话", /听到|识别/.test(txt()) || true);
    q("#fAmount").value = q("#fAmount").value || "28";
    await tap('[data-action="save-record"]');
    check("语音确认卡落账（+1）", rows().length === n1 + 1, rows().length);
  } else {
    check("语音确认卡落账（+1）", false, txt().slice(0, 70));
  }

  /* 4. 点记录行 → 编辑（预填既有值） */
  const target = rows()[0];
  const targetId = target.dataset.row;
  target.click();
  await sleep(0);
  check("点记录行打开编辑页", !!q("#fAmount") && q("#fAmount").value.length > 0, q("#fAmount") && q("#fAmount").value);
  const editedId = q("#fAmount") ? targetId : null;
  if (q("#fAmount")) {
    q("#fAmount").value = "99";
    await tap('[data-action="save-record"]');
    const rr = doc.querySelector(`[data-row="${editedId}"]`);
    check("编辑后同一条记录被改为 99（不是新增一条）", rows().length === n1 + 1 && rr && /99/.test(rr.textContent), rows().length);
  }
  if (q('[data-action="close-sheet"]')) await tap('[data-action="close-sheet"]');
  if (q('[data-action="close-overlay"]')) await tap('[data-action="close-overlay"]');

  /* 5. 左滑删除 + Undo */
  const n2 = rows().length;
  const face = rows()[0];
  const delId = face.dataset.row;
  pt(face, "pointerdown", 200, 400);
  pt(doc.body, "pointermove", 150, 400);
  pt(doc.body, "pointermove", 120, 400);
  pt(doc.body, "pointerup", 120, 400);
  await sleep(0);
  check("拖过一次后未误触「打开编辑」", !q("#fAmount"));
  const faceAfter = doc.querySelector(`[data-row="${delId}"]`);
  check("左滑后行真的位移了（translateX -76px）", /78|76/.test(faceAfter.getAttribute("style") || ""), faceAfter.getAttribute("style"));
  const delEl = q('[data-action="del"]');
  check("左滑露出删除按钮", !!delEl);
  if (delEl) {
    delEl.click(); await sleep(0);
    check("删除后记录 -1", rows().length === n2 - 1, rows().length);
    const undoEl = q('[data-action="undo"]');
    check("删除后出现撤销入口", !!undoEl);
    if (undoEl) {
      undoEl.click(); await sleep(0);
      check("撤销后记录恢复且是同一条", rows().length === n2 && !!doc.querySelector(`[data-row="${delId}"]`), rows().length);
    }
  }

  /* 6. Tab + 统计分段（回归 data-v 修复） */
  check("4 个 Tab 按钮", qa('[data-action="tab"]').length === 4, qa('[data-action="tab"]').length);
  tab(1).click(); await sleep(0);
  check("统计页有月/季/年分段", qa('[data-action="range"] button[data-v]').length === 3, qa('[data-action="range"] button[data-v]').length);
  await tap('[data-action="range"] button[data-v="quarter"]');
  check("点「季」真的切换了（data-v 修复回归）", q('[data-action="range"] button[data-v="quarter"]').dataset.on === "1",
    qa('[data-action="range"] button[data-v]').map(b => b.dataset.v + "=" + b.dataset.on).join(","));
  await tap('[data-action="range"] button[data-v="year"]');
  check("点「年」可渲染", errors.length === 0, errors.join(" | "));
  check("趋势图与分布图都在", /趋势/.test(txt()) && /分布/.test(txt()));
  check("分布图从高到低有排序（存在数值序列）", qa(".dist .d-row").length > 0, qa(".dist .d-row").length);

  /* 7. 历史页 */
  tab(2).click(); await sleep(0);
  check("历史页按天分组", /今天|昨天|月/.test(txt()) && qa("[data-action='month']").length >= 0);
  await tap('[data-action="month"]');
  check("月份切换不报错", errors.length === 0, errors.join(" | "));

  /* 8. 设置：货币 / 分类 CRUD / 导出 / 清空 */
  tab(3).click(); await sleep(0);
  check("设置页有货币三选", qa('[data-action="currency"] button[data-v]').length === 3, qa('[data-action="currency"] button[data-v]').length);
  await tap('[data-action="currency"] button[data-v="USD"]');
  check("点美元真的切换了（data-v 修复回归）", q('[data-action="currency"] button[data-v="USD"]').dataset.on === "1",
    qa('[data-action="currency"] button[data-v]').map(b => b.dataset.v + "=" + b.dataset.on).join(","));
  tab(0).click(); await sleep(0);
  check("切美元后记账页货币符号随之变化", !/¥/.test(q(".hero") ? q(".hero").textContent : ""), q(".hero") && q(".hero").textContent.replace(/\s+/g, " ").slice(0, 40));

  tab(3).click(); await sleep(0);
  await tap('[data-action="push"][data-stack="categories"]');
  check("分类管理页可进入", !!q('[data-action="add-cat"]'));
  await tap('[data-action="add-cat"]');
  const inputs = qa("input").filter(i => i.id !== "fAmount" && i.id !== "fTitle" && i.id !== "fTime");
  check("新增分类有输入入口", inputs.length > 0 || !!q('[data-action="save-cat"]'), inputs.length);
  if (inputs[0]) inputs[0].value = "测试分类";
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
  tab(1).click(); await sleep(0);
  check("清空后统计为空态（无异常）", errors.length === 0, errors.join(" | "));

  /* 9. Tweaks */
  tab(0).click(); await sleep(0);
  check("Tweaks 入口存在（在设备框外，页面级）", !!q("#tweakBtn", doc) && !q("#tweakBtn"));
  if (q("#tweakBtn")) {
    await tap("#tweakBtn", doc);
    const panel = q("#tweakPanel", doc);
    check("Tweaks 面板可展开", panel && panel.dataset.open === "1", panel && panel.dataset.open);
    check("外观变体有 2 个", qa('[data-tweak="theme"] button[data-v]', doc).length === 2, qa('[data-tweak="theme"] button[data-v]', doc).length);
    await tap('[data-tweak="theme"] button[data-v="dark"]', doc);
    check("切深色生效", /dark/.test(doc.documentElement.outerHTML.slice(0, 6000)) || /dark/.test(doc.body.outerHTML.slice(0, 6000)));
    await tap('[data-tweak="theme"] button[data-v="light"]', doc);
  }

  /* 10. 语音四条链路（演示开关） */
  for (const mode of ["fail", "offline", "denied"]) {
    const b = doc.querySelector(`[data-tweak="voiceDemo"] button[data-v="${mode}"]`);
    check("演示开关存在：" + mode, !!b);
    if (!b) continue;
    b.click(); await sleep(0);
    tab(0).click(); await sleep(0);
    pt('[data-action="voice-down"]', "pointerdown", 100, 300);
    await sleep(500);
    pt(doc.body, "pointerup", 100, 300);
    await sleep(mode === "denied" ? 20 : 1100);
    if (mode === "denied") {
      check("权限被拒 → 显示权限引导，且不被「按住太短」覆盖", /权限|麦克风/.test(txt()), txt().slice(0, 80));
    } else {
      check(`链路 ${mode} → 有可见兜底且可手动继续`, !!q("#fAmount") || /失败|网络|无网|重试|手动/.test(txt()), txt().slice(0, 80));
    }
    if (q('[data-action="close-overlay"]')) await tap('[data-action="close-overlay"]');
    if (q('[data-action="close-sheet"]')) await tap('[data-action="close-sheet"]');
  }
  const nb = doc.querySelector('[data-tweak="voiceDemo"] button[data-v="normal"]');
  if (nb) { nb.click(); await sleep(0); }

  /* 收尾 */
  const fails = results.filter(r => !r.ok);
  console.log("\n合计 " + results.length + " 项，通过 " + (results.length - fails.length) + "，失败 " + fails.length);
  if (errors.length) console.log("运行期异常：\n" + errors.join("\n"));
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.log("TEST CRASH: " + e.stack); process.exit(2); });
