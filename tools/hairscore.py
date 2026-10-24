# 发丝带度量：沿椭圆路径采样，统计亮度落在 [45,140] 的点数（1px 细线的专用度量）。
# 用法：hairscore.py <png> [cx cy rx ry]
# 为什么需要它：面积均值/全周均值会被文字淹没（实测角向探测基线 108 命中、无判别力）；
# 沿路径采点 + 亮度带计数才能把那条发丝线单独拎出来（实测基线 48 → 去掉伪元素背景后 9）。
import sys
import math
from PIL import Image, ImageDraw

png = sys.argv[1]
if len(sys.argv) > 5:
    cx, cy, rx, ry = (float(v) for v in sys.argv[2:6])
else:
    cx, cy, rx, ry = 1358.0, 359.5, 152.0, 133.5

im = Image.open(png).convert("RGB")
steps = int(2 * math.pi * ((rx + ry) / 2))
hits, total = [], 0.0
for i in range(steps):
    a = 2 * math.pi * i / steps
    x, y = int(round(cx + rx * math.cos(a))), int(round(cy + ry * math.sin(a)))
    if 0 <= x < im.width and 0 <= y < im.height:
        r, g, b = im.getpixel((x, y))
        lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        total += lum
        if 45 <= lum <= 140:
            hits.append((x, y))
print(f"{png}: 路径采样 {steps} 点 · 发丝带命中 {len(hits)} · 路径均值 {total/steps:.1f}")
if hits:
    vis = Image.open(png).convert("RGB")
    d = ImageDraw.Draw(vis)
    for x, y in hits:
        d.ellipse([x - 1, y - 1, x + 1, y + 1], outline=(255, 0, 0))
    box = (int(cx - rx - 26), int(cy - ry - 26), int(cx + rx + 26), int(cy + ry + 26))
    vis.crop(box).save(png.replace(".png", "-hits.png"))
    print(f"  命中标注 → {png.replace('.png', '-hits.png')}")
