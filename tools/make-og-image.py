#!/usr/bin/env python3
"""Generate the social-share (Open Graph) image: site/assets/og-image.png (1200x630).
Candle-in-the-dark theme, matching the site. Re-run after changing the wording.
  python3 tools/make-og-image.py
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1200, 630
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "assets", "og-image.png")

FONTS = "/System/Library/Fonts/Supplemental/"
def font(names, size):
    for n in names:
        p = os.path.join(FONTS, n)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.truetype(os.path.join(FONTS, "Georgia.ttf"), size)

serif_b = lambda s: font(["Georgia Bold.ttf", "Georgia.ttf"], s)
serif_i = lambda s: font(["Georgia Italic.ttf", "Georgia.ttf"], s)
serif   = lambda s: font(["Georgia.ttf"], s)

# --- background: vertical night gradient ---
base = Image.new("RGB", (W, H))
top, bot = (9, 10, 14), (20, 23, 31)
d = ImageDraw.Draw(base)
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))

# --- warm candle glow (radial, screened over the bg) ---
grad = Image.radial_gradient("L")            # 0 centre -> 255 edge
grad = Image.eval(grad, lambda v: 255 - v)   # invert: bright centre
gs = 1150
grad = grad.resize((gs, gs))
gold = Image.new("RGB", (gs, gs), (232, 185, 106))
glow = Image.new("RGB", (W, H), (0, 0, 0))
glow.paste(gold, (W // 2 - gs // 2, 150 - gs // 2), grad)
glow = Image.eval(glow, lambda v: int(v * 0.42))
base = ImageChops.add(base, glow)

# --- candle flame ---
flame = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(flame)
fd.ellipse([W // 2 - 10, 96, W // 2 + 10, 150], fill=(247, 214, 150, 255))
fd.ellipse([W // 2 - 5, 108, W // 2 + 5, 146], fill=(255, 240, 205, 255))
flame = flame.filter(ImageFilter.GaussianBlur(4))
base = Image.alpha_composite(base.convert("RGBA"), flame).convert("RGB")

d = ImageDraw.Draw(base)
def center(text, fnt, y, fill):
    bb = d.textbbox((0, 0), text, font=fnt)
    d.text(((W - (bb[2] - bb[0])) // 2, y), text, font=fnt, fill=fill)

center("World Philosophers", serif_b(92), 205, (243, 236, 224))
# thin gold divider
d.line([(W // 2 - 60, 330), (W // 2 + 60, 330)], fill=(232, 185, 106), width=2)
center("A council of 23 mentors  ·  Eastern & Western", serif(34), 356, (203, 196, 182))
center("“Reflection, never fortune-telling.”", serif_i(32), 418, (232, 185, 106))
center("world-philosophers.pages.dev", serif(22), 545, (139, 133, 120))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
base.save(OUT, "PNG", optimize=True)
print("wrote", OUT, base.size)
