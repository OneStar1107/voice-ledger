# 通用裁切放大：crop.py <src> <out> <x1> <y1> <x2> <y2> [scale]
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
x1, y1, x2, y2 = (int(v) for v in sys.argv[3:7])
scale = float(sys.argv[7]) if len(sys.argv) > 7 else 2
im = Image.open(src).convert("RGB").crop((x1, y1, x2, y2))
im = im.resize((int(im.width * scale), int(im.height * scale)), Image.LANCZOS)
im.save(out)
print("saved", out, im.size)
