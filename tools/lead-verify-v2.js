// 主理人独立复核（不依赖子代理的断言脚本）：单文件约束 + 卡面逐字同源 + 主题机制
const fs = require("fs");
const v2 = fs.readFileSync(process.argv[2], "utf8");
const v1 = fs.readFileSync(process.argv[3], "utf8");
const cf = fs.readFileSync(process.argv[4], "utf8");

let fail = 0;
const chk = (name, ok, extra = "") => {
  console.log((ok ? "PASS " : "FAIL ") + name + (extra ? "  [" + extra + "]" : ""));
  if (!ok) fail++;
};

// 1) 单文件零外部依赖
chk("无 <img>", !/<img\b/i.test(v2));
chk("无 http(s) 外链", !/https?:\/\//i.test(v2), (v2.match(/https?:\/\/[^\s"')]{0,40}/gi) || []).join(" "));
chk("无 @import / <link rel=stylesheet>", !/@import|<link[^>]+stylesheet/i.test(v2));
chk("无 <script src>", !/<script[^>]+src=/i.test(v2));
chk("无 emoji", !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u.test(v2));
chk("字体只用系统字族", !/fonts\.googleapis|@font-face/i.test(v2));

// 2) 卡面 8 张与 M3/card-faces.html 逐字同源
const grab = (src, prop) => {
  const out = {};
  // 形如  .f3{ --grad:...; }  或  --grad-fallback:
  const re = new RegExp("\\.(f[1-8])\\s*\\{[^}]*", "g");
  let m;
  while ((m = re.exec(src))) {
    const body = m[0];
    const val = body.match(new RegExp("--" + prop + "\\s*:\\s*([^;]+);"));
    if (val) out[m[1]] = val[1].trim();
  }
  return out;
};
for (const prop of ["grad", "grad-fallback", "scrim"]) {
  const a = grab(v2, prop), b = grab(cf, prop);
  const keys = Object.keys(b);
  const same = keys.length > 0 && keys.every(k => a[k] === b[k]);
  chk(`卡面 --${prop} 与 card-faces.html 一致 (${keys.length} 张)`, same,
      keys.filter(k => a[k] !== b[k]).map(k => k + ": v2=" + a[k] + " | cf=" + b[k]).join(" ; "));
}

// 3) 主题机制
const light = v2.match(/\[data-palette="light"\]/g) || [];
chk("存在 [data-palette=\"light\"] 镜像块", light.length > 0, light.length + " 处");
chk("默认 data-palette 写在 <html> 上", /<html[^>]+data-palette="(dark|light)"/.test(v2),
    (v2.match(/<html[^>]*>/) || [""])[0].slice(0, 80));
chk("v1 未被改动（仍为 74650 字节）", Buffer.byteLength(v1, "utf8") === 74650, Buffer.byteLength(v1, "utf8") + " bytes");
chk("v1 里没有 v2 的 --line-control", !/--line-control/.test(v1));
chk("v2 里 --warn 存在且无 --danger 定义", /--warn\s*:/.test(v2) && !/--danger\s*:/.test(v2));

// 4) 关键令牌存在性（v3 §3 语义）
for (const t of ["--expense", "--income", "--accent", "--glass-blur", "--tap"]) {
  chk(`令牌 ${t} 已定义`, new RegExp(t.replace(/-/g, "\\-") + "\\s*:").test(v2));
}

// 5) 浅色底是否为冷调
const l = v2.match(/\[data-palette="light"\]\s*\{([\s\S]*?)\n\s*\}/);
const lbody = l ? l[1] : "";
chk("浅色 L0 = #EFF1F4（冷调，非 v1 暖纸）", /#EFF1F4/i.test(lbody), 
    (lbody.match(/--bg\s*:\s*[^;]+/) || [""])[0]);
chk("v1 暖调 #F4F1EC 已不在 v2 出现", !/#F4F1EC/i.test(v2));

console.log("\nFAIL 数 = " + fail);
process.exit(fail ? 1 : 0);
