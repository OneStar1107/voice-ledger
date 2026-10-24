# 图标对比度实测（两段式：本脚本只做「生成 bg-only 素材」与「分析」，渲染交给 PowerShell 调 Edge——
# 从 Python 子进程启动 Edge 在本沙箱下写不出文件，这是环境边界，不再尝试绕过）。
#   python icon-contrast.py prepare   -> 生成 *-bgonly.svg / *-bgonly.html
#   (PowerShell 渲染出 *-bgonly.png)
#   python icon-contrast.py analyze   -> 在符号包围盒内采样真实底，算 vs #FFFFFF 对比度
import re, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
M3 = os.path.join(ROOT, "M3")
TMP = os.path.join(ROOT, "tools", "shots")

# 变体 -> 白符号包围盒 (x1,y1,x2,y2)，含描边半宽
VARIANTS = {
    "app-icon-a.svg": (265, 301, 763, 727),
    "app-icon-b.svg": (351, 279, 673, 705),
    "app-icon-c.svg": (350, 322, 710, 702),
}

def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def rel_lum(rgb):
    r, g, b = (srgb_to_lin(v) for v in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast_vs_white(rgb):
    return 1.05 / (rel_lum(rgb) + 0.05)

def prepare():
    for name in VARIANTS:
        txt = open(os.path.join(M3, name), encoding="utf-8").read()
        blank = re.sub(r'(fill|stroke)="#FFFFFF"', r'\1="none"', txt)
        base = name.replace(".svg", "-bgonly")
        open(os.path.join(TMP, base + ".svg"), "w", encoding="utf-8").write(blank)
        open(os.path.join(TMP, base + ".html"), "w", encoding="utf-8").write(
            '<!doctype html><meta charset="utf-8">'
            '<style>html,body{margin:0;padding:0;overflow:hidden}img{display:block;width:1024px;height:1024px}</style>'
            f'<img src="{base}.svg">')
        print("prepared", base)

def analyze():
    rows = []
    for name, (x1, y1, x2, y2) in VARIANTS.items():
        png = os.path.join(TMP, name.replace(".svg", "-bgonly.png"))
        im = Image.open(png).convert("RGB")
        worst = best = None
        for y in range(y1, y2, 3):
            for x in range(x1, x2, 3):
                px = im.getpixel((x, y))
                if worst is None or rel_lum(px) > rel_lum(worst):
                    worst = px
                if best is None or rel_lum(px) < rel_lum(best):
                    best = px
        cw, cb = contrast_vs_white(worst), contrast_vs_white(best)
        verdict = "PASS >=4.5" if cw >= 4.5 else ("PASS >=3" if cw >= 3 else "FAIL")
        rows.append((name, worst, cw, best, cb, verdict))
    print(f"{'variant':<16}{'lightest bg in glyph box':<26}{'worst':<8}{'darkest bg':<16}{'best':<8}verdict")
    for name, worst, cw, best, cb, verdict in rows:
        print(f"{name:<16}{str(worst):<26}{cw:<8.2f}{str(best):<16}{cb:<8.2f}{verdict}")

if __name__ == "__main__":
    {"prepare": prepare, "analyze": analyze}[sys.argv[1]]()
