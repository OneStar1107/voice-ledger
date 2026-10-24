/* 玻璃卡对比度复核（主理人自写）
   问题：.card/.kpi/.group/.rowcard 现在填的是半透明 --glass-card，底下是
   「页面底 + 屏内环境光渐变」。所以文字真正的背景**不是** --surface，
   而是 composite(glass, composite(ambient, bg)) —— 套件里那 16 组对比度是按
   --surface 算的，口径不再等于屏幕上的实际像素。这个脚本把差额算清楚。

   最坏情形取法：环境光是径向渐变，峰值 alpha 落在卡片所在区域时最糟；
   两种环境光各取一次，谁让对比度更低就报谁。 */
const fs = require("fs");
const path = require("path");

const FILE = process.argv[2] || "prototype/记账App原型-v2.html";
const css = fs.readFileSync(FILE, "utf8");

function block(sel) {
  const i = css.indexOf(sel);
  if (i < 0) throw new Error("找不到 " + sel);
  const s = css.indexOf("{", i), e = css.indexOf("}", s);
  return css.slice(s + 1, e);
}
function vars(text) {
  const out = {};
  for (const m of text.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}
const dark = vars(block(":root{"));
const light = vars(block('[data-palette="light"]{'));

function parse(c) {
  c = String(c).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(c);
  if (m) { const n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255, 1]; }
  m = /^#([0-9a-f]{3})$/i.exec(c);
  if (m) { const h = m[1]; return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16), 1]; }
  m = /^rgba?\(([^)]+)\)$/i.exec(c);
  if (m) { const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]]; }
  throw new Error("无法解析颜色 " + c);
}
const over = (top, bottom) => {
  const a = top[3];
  return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1];
};
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const cr = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
const hex = c => "#" + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

let bad = 0, rows = 0;
for (const [mode, V] of [["深", dark], ["浅", light]]) {
  const bg = parse(V["--bg"]);
  const glass = parse(V["--glass-card"]);
  const ambs = [V["--amb-a"], V["--amb-b"]].filter(Boolean).map(parse);
  /* 最坏的两条底：① 卡片正下方是环境光峰值 ② 完全没有环境光 */
  const composites = [over(glass, bg), ...ambs.map(a => over(glass, over(a, bg)))];
  const worst = composites.reduce((w, c) => (cr(parse(V["--ink-3"]), c) < cr(parse(V["--ink-3"]), w) ? c : w));
  /* 直接坐在页面底上的文字（区块标题、副统计条、壳层文案）也要按环境光最坏情形算 */
  const pageComps = [bg, ...ambs.map(a => over(a, bg))];
  const bgWorst = pageComps.reduce((w, c) => (cr(parse(V["--ink-3"]), c) < cr(parse(V["--ink-3"]), w) ? c : w));
  console.log(`\n【${mode}色】页面底 ${hex(bg)} → 玻璃卡合成 ${composites.map(hex).join(" / ")} · 页面底+环境光 ${pageComps.map(hex).join(" / ")}`);
  for (const [label, tok, need] of [
    ["墨1 标题", "--ink-1", 4.5], ["墨2 正文", "--ink-2", 4.5], ["墨3 弱信息", "--ink-3", 4.5],
    ["支出绿", "--expense", 4.5], ["品牌蓝", "--accent", 4.5], ["警戒琥珀", "--warn", 4.5],
  ]) {
    const fg = parse(V[tok]);
    const onGlass = cr(fg, worst), onBg = cr(fg, bgWorst);
    const ok = onGlass >= need && onBg >= need;
    if (!ok) bad++;
    rows++;
    console.log(`  ${ok ? "PASS" : "FAIL"} ${label.padEnd(10)} 玻璃卡上 ${onGlass.toFixed(2)}:1（最坏合成 ${hex(worst)}） · 页面底上 ${onBg.toFixed(2)}:1（最坏 ${hex(bgWorst)}）  阈值 ${need}`);
  }
  console.log(`  · 套件口径（--surface ${V["--surface"].trim()}）下 墨3 = ${cr(parse(V["--ink-3"]), parse(V["--surface"])).toFixed(2)}:1`);
}
console.log(`\n合计 ${rows} 组，低于阈值 ${bad} 组`);
process.exit(bad ? 1 : 0);
