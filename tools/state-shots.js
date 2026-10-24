/* 生成「强制状态」变体页并截图：用于目视核对交互态（不改动交付物本身） */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SRC = process.argv[2];
const OUT = path.resolve(process.argv[3]);
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const html = fs.readFileSync(SRC, "utf8");

const SCENES = {
  "s1-语音录音中": `ui.voiceDemo="ok"; startVoice(frames[0]);`,
  "s2-语音确认卡": `openEditor(frames[0], { mode:"voice", heard:"午饭花了三十五块", amount:"35", title:"午饭", cat:"food" });`,
  "s3-手动输入弹层": `openEditor(frames[0], { mode:"manual" });`,
  "s4-解析中": `frames[0].overlay="parsing"; paintFrame(frames[0]);`,
  "s5-权限被拒": `ui.voiceDemo="denied"; frames[0].overlay="denied"; paintFrame(frames[0]);`,
  "s6-导出进行中": `frames[3].settingsStack=["root","data"]; frames[3].sheet={kind:"export",exporting:true}; paint();`,
  "s7-统计季度": `frames[1].range="quarter"; paint();`,
  "s8-统计年度": `frames[1].range="year"; paint();`,
  "s9-深色主题": `ui.theme="dark"; paint();`,
  "s10-空状态": `store.records=[]; paint();`,
  "s11-左滑删除": `frames[0].swiped=store.records[0].id; paint();`,
  "s12-撤销提示": `toast(frames[0], "已删除「午饭」 ¥32", () => {});`,
};

const only = process.argv[4];
const H = Number(process.argv[5] || 1000);
let made = 0;
for (const [name, code] of Object.entries(SCENES)) {
  if (only && !name.includes(only)) continue;
  const png = path.join(OUT, `${name}.png`);
  const profile = path.join(OUT, `_edge-profile-${process.pid}`);
  const tmp = path.join(OUT, `_variant-${process.pid}.html`);
  fs.writeFileSync(tmp, html.replace("</body>", `<script>setTimeout(() => { try { ${code} } catch (e) { document.title = "ERR:" + e.message; } }, 60);</scr` + `ipt>\n</body>`), "utf8");
  fs.rmSync(png, { force: true });
  try {
    execFileSync(EDGE, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
      "--no-default-browser-check", `--user-data-dir=${profile}`,
      `--window-size=1560,${H}`, "--virtual-time-budget=4000",
      `--screenshot=${png}`, "file:///" + encodeURI(tmp.replace(/\\/g, "/"))],
      { stdio: "ignore", timeout: 60000 });
    let ok = false;
    for (let i = 0; i < 40 && !ok; i++) { const t = Date.now(); while (Date.now() - t < 100); ok = fs.existsSync(png); }
    made++;
    console.log(ok ? "OK  " : "MISS", name, ok ? fs.statSync(png).size : "-");
    fs.unlinkSync(tmp);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* Edge 可能仍占着 Crashpad 文件，忽略 */ }
  } catch (e) { console.log("FAIL", name, e.message.split("\n")[0].slice(0, 120)); }
}
console.log("done", made);
