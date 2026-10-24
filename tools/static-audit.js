/* 交付前静态自查：设计系统与硬约束（不依赖浏览器） */
const fs = require("fs");
const { JSDOM } = require("jsdom");
const FILE = process.argv[2];
const html = fs.readFileSync(FILE, "utf8");
const dom = new JSDOM(html);
const doc = dom.window.document;
const css = [...doc.querySelectorAll("style")].map(s => s.textContent).join("\n");
const bodyText = doc.body.textContent;

const out = [];
const A = (name, ok, extra) => out.push([ok ? "PASS" : "WARN", name, extra === undefined ? "" : String(extra)]);
const count = (re, s) => (s.match(re) || []).length;

/* 1. 触摸目标 ≥44px */
const minHeights = [...css.matchAll(/min-height:\s*(\d+)px/g)].map(m => +m[1]);
A("存在 ≥44px 的触摸目标声明", minHeights.some(v => v >= 44), "min-height 値=" + [...new Set(minHeights)].sort((a, b) => a - b).join(","));
A("按钮基础高度 ≥44px", /\.btn\s*\{[^}]*min-height:\s*(4[4-9]|[5-9]\d)px/s.test(css) || /min-height:\s*44px/.test(css));

/* 2. 焦点可见 */
A("定义了 :focus-visible 可见焦点", /:focus-visible/.test(css), count(/:focus-visible/g, css) + " 处");
A("定义了 :active 按下态", /:active/.test(css));
A("定义了 :disabled 态", /:disabled|\[disabled\]/.test(css));

/* 3. 无障碍与语义 */
A("有 aria-label 或 aria-expanded", /aria-(label|expanded|hidden|live)/.test(html), count(/aria-/g, html) + " 处");
A("有 role=tablist/tab 或等价语义", /role="(tab|tablist|dialog|status)"/.test(html), count(/role="/g, html) + " 处");
A("有 prefers-reduced-motion 降级", /prefers-reduced-motion/.test(css));
A("设置了 lang=zh-CN", /<html[^>]+lang="zh-CN"/.test(html));

/* 4. 反 AI 陈词 */
const emoji = bodyText.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu) || [];
A("正文无 emoji 当图标", emoji.length === 0, emoji.slice(0, 8).join(" "));
A("无紫粉蓝渐变套话", !/#(8B5CF6|A855F7|EC4899|F472B6|6366F1|818CF8)/i.test(css));
A("无 Inter/Roboto 作 display 字体", !/font-family[^;]*(Inter|Roboto)/i.test(css));
A("未引用外部字体/图片", !/@import|https?:\/\/[^"')]+\.(woff2?|png|jpe?g|svg)/i.test(html));
A("金额使用 tabular-nums（等宽数字对齐）", /tabular-nums/.test(css), count(/tabular-nums/g, css) + " 处");
A("中文优先字阶（含 PingFang SC）", /PingFang SC/.test(css));

/* 5. 编造统计文本（数字+%或「调研/数据显示」类） */
const fake = /(调研|数据显示|研究表明|据统计|平均用户|行业报告)/.test(bodyText);
A("正文无编造的调研/统计表述", !fake);

/* 6. 状态覆盖 */
for (const st of ["empty", "loading"]) {
  A("覆盖 " + st + " 态", new RegExp("\\." + st).test(css) || new RegExp(st).test(html));
}
A("覆盖 error 态视觉（.err）", /\.err\s*\{/.test(css));
A("覆盖 disabled 视觉", /\.(is-)?disabled|\[data-disabled="1"\]|:disabled/.test(css));

/* 7. 变体（Tweaks） */
const tweaks = [...doc.querySelectorAll("[data-tweak]")].map(e => e.dataset.tweak);
A("Tweaks 至少 3 个可切换维度", tweaks.length >= 3, tweaks.join(","));
A("含浅色/深色两套视觉方案", /data-tweak="theme"/.test(html) && count(/data-v="dark"/g, html) >= 1);

/* 8. 设备框（frames 由 JS 运行时渲染，静态 DOM 里查不到 → 回退到源码计数） */
const devices = doc.querySelectorAll(".device");
const deviceCount = devices.length || (html.match(/class="device"/g) || []).length;
A("iPhone 设备框 ≥1", deviceCount >= 1, deviceCount + " 台");

/* 9. 覆盖用户四条原始需求 */
const need = [["记账首屏", /本月支出/], ["语音输入", /语音|按住说话/], ["手动输入", /手动/], ["今日记录", /今日记录|今天/],
  ["统计月季年", /月[\s\S]*季[\s\S]*年/], ["趋势图", /趋势/], ["分类分布", /分布/], ["历史按天", /历史/],
  ["货币单位", /人民币|美元|欧元/], ["分类管理", /分类/], ["导出 CSV", /CSV/], ["清空数据", /清空/]];
for (const [n, re] of need) A("覆盖需求：" + n, re.test(bodyText));

console.log(out.map(([s, n, e]) => s + " " + n + (e ? "  [" + e + "]" : "")).join("\n"));
const warns = out.filter(o => o[0] === "WARN");
console.log("\n合计 " + out.length + " 项，WARN " + warns.length);
