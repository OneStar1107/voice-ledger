// 独立复核：WCAG 2.x 对比度（不依赖专家脚本）
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const Y = (hex) => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const CR = (a, b) => { const y1 = Y(a), y2 = Y(b); const hi = Math.max(y1, y2), lo = Math.min(y1, y2); return (hi + 0.05) / (lo + 0.05); };

const pairs = [
  ['冰川蓝 浅 #1B5FD0', '#1B5FD0', '#EFF1F4', 4.5],
  ['冰川蓝 深 #7FE3FF', '#7FE3FF', '#0B0B0C', 4.5],
  ['收入红 浅 #C4362B', '#C4362B', '#EFF1F4', 4.5],
  ['收入红 深 #FF6F5E', '#FF6F5E', '#0B0B0C', 4.5],
  ['支出绿 浅 #0F7A46', '#0F7A46', '#EFF1F4', 4.5],
  ['支出绿 深 #45D07E', '#45D07E', '#0B0B0C', 4.5],
  ['墨1 浅 #17181A', '#17181A', '#EFF1F4', 4.5],
  ['墨2 浅 #5C616B', '#5C616B', '#EFF1F4', 4.5],
  ['墨3 浅 #666B75', '#666B75', '#EFF1F4', 4.5],
  ['墨4 浅 #81868F', '#81868F', '#EFF1F4', 4.5],
  ['墨1 深 #F5F6F7', '#F5F6F7', '#0B0B0C', 4.5],
  ['墨2 深 #A2A4AB', '#A2A4AB', '#0B0B0C', 4.5],
  ['墨3 深 #85878E', '#85878E', '#0B0B0C', 4.5],
  ['墨4 深 #5C5E65', '#5C5E65', '#0B0B0C', 4.5],
  ['v2旧T3 #7A7C83', '#7A7C83', '#0B0B0C', 4.5],
  ['v2旧T4 #5C5E65', '#5C5E65', '#0B0B0C', 4.5],
  ['卡面墨 #F5F6F7 on 冰川最亮端 #7FE3FF', '#F5F6F7', '#7FE3FF', 4.5],
  ['卡面墨 #F5F6F7 on 冰川最暗端 #1E2270', '#F5F6F7', '#1E2270', 4.5],
  ['素瓷墨 #17181A on #E3DED5', '#17181A', '#E3DED5', 4.5],
  ['冰银墨 #17181A on #C3CEDA', '#17181A', '#C3CEDA', 4.5],
  ['--line-control 浅 #8A93A0 on #FFFFFF', '#8A93A0', '#FFFFFF', 3.0],
  ['--line-control 浅 #8A93A0 on #EFF1F4', '#8A93A0', '#EFF1F4', 3.0],
  ['--line-control 深 #6A6C73 on #17181A', '#6A6C73', '#17181A', 3.0],
];
let fail = 0;
for (const [name, fg, bg, need] of pairs) {
  const v = CR(fg, bg);
  const ok = v >= need;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${v.toFixed(2).padStart(6)} (需 ${need})  ${name}`);
}
console.log(`\n合计 ${pairs.length} 组，未达 ${fail} 组`);
