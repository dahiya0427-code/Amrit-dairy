"""
Generates public/images/sketch/farm-hero.png: the bold, large-scale farm
drawing behind the home-page hero (Mr Dairy style): a big hatched tree clump
on the left, a long farmhouse with a hatched roof on the right, a horizon
through the middle (kept clear for the jar) and big line drawings of our own
cows in the foreground. Cow drawings come from public/images/sketch/*-bold.png.
Run: python3 scripts/farm-hero.py
"""
import math
import random

import cv2
import numpy as np
from PIL import Image, ImageDraw

W, H = 2400, 1000
K = 2
INK = (58, 40, 24)
rng = random.Random(11)
img = Image.new('RGBA', (W * K, H * K), (0, 0, 0, 0))
d = ImageDraw.Draw(img)


def wobble(pts, amp):
    ph = rng.random() * 10
    n = max(1, len(pts) - 1)
    return [(x + amp * math.sin(ph + i / n * 6.1) + rng.gauss(0, amp * 0.2), y + amp * math.cos(ph + i / n * 4.7) + rng.gauss(0, amp * 0.2)) for i, (x, y) in enumerate(pts)]


def line(pts, w=2.4, a=235, amp=1.0, passes=1):
    for _ in range(passes):
        q = wobble(pts, amp)
        d.line([(x * K, y * K) for x, y in q], fill=INK + (int(a * (0.8 + 0.2 * rng.random())),), width=max(1, int(w * K)), joint='curve')


def seg(x1, y1, x2, y2, n=8):
    return [(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t) for t in np.linspace(0, 1, n)]


def curve(fn, x0, x1, step=8):
    return [(x, fn(x)) for x in np.arange(x0, x1 + step, step)]


def hatch_poly(poly, spacing=9, angle=-50, w=1.3, a=170, jitter=2.0):
    """Fill a polygon with long parallel hand-drawn lines (engraving-style shading)."""
    mask = Image.new('L', (W, H), 0)
    ImageDraw.Draw(mask).polygon(poly, fill=255)
    m = np.array(mask) > 0
    ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    R = math.hypot(max(xs) - min(xs), max(ys) - min(ys))
    for off in np.arange(-R, R, spacing):
        pts = []
        run = []
        for t in np.arange(-R, R, 4):
            x = cx + ca * t - sa * off
            y = cy + sa * t + ca * off
            inside = 0 <= int(x) < W and 0 <= int(y) < H and m[int(y), int(x)]
            if inside:
                run.append((x, y))
            elif run:
                pts.append(run)
                run = []
        if run:
            pts.append(run)
        for r in pts:
            if len(r) > 2:
                line(r, w=w, a=a, amp=jitter)


# ── horizon and fields ───────────────────────────────────────────────────────
def horizon(x):
    return 575 + 10 * math.sin(x / 380 + 0.5)


line(curve(horizon, 0, W), w=2.6, a=240, amp=1.2)
for k, (dy, a) in enumerate([(26, 150), (60, 120), (110, 90)]):
    line(curve(lambda x, dy=dy: horizon(x) + dy + 6 * math.sin(x / 300 + k), 520 if k == 0 else 0, W), w=1.6, a=a, amp=1.5)

# ── big tree clump on the left ──────────────────────────────────────────────
def canopy(cx, cy, rx, ry, seed):
    r = random.Random(seed)
    pts = []
    for t in np.linspace(0, 2 * math.pi, 46):
        k = 1 + 0.13 * math.sin(t * 6 + seed) + 0.07 * r.random()
        pts.append((cx + rx * k * math.cos(t), cy + ry * k * math.sin(t)))
    return pts


trees = [(230, 400, 220, 170, 1), (440, 450, 150, 130, 2), (80, 470, 130, 120, 3)]
for cx, cy, rx, ry, sd in trees:
    poly = canopy(cx, cy, rx, ry, sd)
    d.polygon([(x * K, y * K) for x, y in poly], fill=(255, 255, 255, 255))
    # leafy outline: small scallops along the edge
    for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]):
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        nx, ny = mx - cx, my - cy
        nl = math.hypot(nx, ny) or 1
        b = 9 + rng.random() * 9
        bx, by = mx + nx / nl * b, my + ny / nl * b
        line([((1 - t) ** 2 * x1 + 2 * (1 - t) * t * bx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * by + t * t * y2) for t in np.linspace(0, 1, 7)], w=2.2, a=230, amp=0.5)
    # engraving shade on the lower-right half of each crown
    shade = [(x, y) for x, y in poly if (x - cx) * 0.6 + (y - cy) > -ry * 0.15]
    if len(shade) > 3:
        hatch_poly(shade, spacing=10, angle=-40, w=1.2, a=150)
    # leaf clusters inside
    for _ in range(26):
        ang, rad = rng.random() * 2 * math.pi, math.sqrt(rng.random()) * 0.8
        px, py = cx + math.cos(ang) * rx * rad, cy + math.sin(ang) * ry * rad
        line([(px - 9, py), (px - 4, py - 7), (px + 1, py), (px + 6, py - 7), (px + 11, py)], w=1.4, a=170, amp=0.4)
# trunks
for x, top in [(230, 555), (440, 565), (85, 575)]:
    line(seg(x - 14, horizon(x) + 30, x - 9, top), w=2.6)
    line(seg(x + 14, horizon(x) + 30, x + 10, top), w=2.6)
    for yy in np.arange(top + 10, horizon(x) + 25, 11):
        line(seg(x - 9, yy, x + 9, yy - 5, 3), w=1.1, a=150, amp=0.3)

# ── long farmhouse on the right ─────────────────────────────────────────────
base = 600
eave, ridge = 470, 350
left, right = 1540, 2400
roof = [(left - 40, eave), (left + 130, ridge), (right + 40, ridge - 30), (right + 40, eave - 20)]
d.polygon([(x * K, y * K) for x, y in roof + [(right + 40, base), (left - 10, base)]], fill=(255, 255, 255, 255))
line([roof[0], roof[1], roof[2]], w=2.8)
line([roof[0], (right + 40, eave - 20)], w=2.6)
hatch_poly(roof, spacing=11, angle=-62, w=1.4, a=175)  # long roof hatching
# gable end
line([(left - 10, eave), (left - 10, base)], w=2.6)
line([(left - 40, eave), (left + 130, ridge), (left + 300, eave - 10)], w=2.2)
hatch_poly([(left - 10, eave), (left + 130, ridge + 12), (left + 290, eave - 6), (left + 290, base), (left - 10, base)], spacing=8, angle=-85, w=1.1, a=130)
# long wall with windows and doors
line([(left + 290, eave - 8), (left + 290, base)], w=2.2)
line([(right + 40, eave - 20), (right + 40, base)], w=2.2)
for wx in range(left + 340, right, 150):
    line([(wx, eave + 30), (wx + 50, eave + 30), (wx + 50, eave + 90), (wx, eave + 90), (wx, eave + 30)], w=2.0)
    line([(wx + 25, eave + 30), (wx + 25, eave + 90)], w=1.4, a=180)
    hatch_poly([(wx + 2, eave + 32), (wx + 24, eave + 32), (wx + 24, eave + 88), (wx + 2, eave + 88)], spacing=5, angle=-60, w=1.0, a=150)
line([(left + 90, base), (left + 90, eave + 50), (left + 190, eave + 50), (left + 190, base)], w=2.2)
# chimney and silo
line([(right - 160, ridge - 20), (right - 160, ridge - 90), (right - 120, ridge - 90), (right - 120, ridge - 25)], w=2.2)
line([(left - 170, base), (left - 170, 330)], w=2.4)
line([(left - 90, base), (left - 90, 330)], w=2.4)
line([(left - 170 + 40 + 40 * math.cos(t), 330 - 34 * math.sin(t)) for t in np.linspace(math.pi, 0, 16)], w=2.4)
for yy in range(360, base, 42):
    line(curve(lambda xx, yy=yy: yy + 6 * math.sin((xx - (left - 170)) / 80 * math.pi), left - 170, left - 90, 8), w=1.2, a=150)
hatch_poly([(left - 120, 334), (left - 92, 334), (left - 92, base), (left - 120, base)], spacing=6, angle=-80, w=1.0, a=120)

# fence running from the barn towards the middle (low, stays behind the jar)
posts = [(1500 - i * 55, horizon(1500 - i * 55) + 14 + i * 1.5) for i in range(8)]
for px, py in posts:
    line(seg(px, py + 30, px, py - 26, 3), w=2.0)
for dy in (-16, 4):
    line([(px, py + dy) for px, py in posts], w=1.5, a=190)

img = img.resize((W, H), Image.LANCZOS)


# ── big cows in the foreground ──────────────────────────────────────────────
def place(name, x, h, base_y, flip=False):
    c = Image.open(f'public/images/sketch/{name}-bold.png').convert('RGBA')
    c = c.resize((int(c.width * h / c.height), h), Image.LANCZOS)
    if flip:
        c = c.transpose(Image.FLIP_LEFT_RIGHT)
    a = np.array(c).astype(np.float32)
    ys = np.linspace(0, 1, c.height)[:, None]
    a[..., 3] *= np.clip((0.93 - ys) / 0.08, 0, 1)  # fade out the photo's grass patch
    c = Image.fromarray(a.astype(np.uint8), 'RGBA')
    # white underlay so lines behind the cow don't show through its body
    body = np.array(c)[..., 3] > 20
    m = cv2.morphologyEx(body.astype(np.uint8) * 255, cv2.MORPH_CLOSE, np.ones((13, 13), np.uint8))
    flood = np.pad(m, 1)
    cv2.floodFill(flood, None, (0, 0), 128)  # mark the outside
    under = Image.fromarray(np.where(flood[1:-1, 1:-1] == 128, 0, 255).astype(np.uint8), 'L')
    white = Image.new('RGBA', c.size, (255, 255, 255, 255))
    img.paste(white, (int(x), int(base_y - h)), under)
    img.alpha_composite(c, (int(x), int(base_y - h)))
    gd = ImageDraw.Draw(img)
    for _ in range(int(c.width / 14)):  # grass at the hooves
        gx = x + rng.uniform(0.03, 0.97) * c.width
        gy = base_y - h * 0.06 + rng.uniform(-4, 8)
        for _b in range(3):
            dx = rng.uniform(-5, 5)
            gd.line([(gx + dx, gy), (gx + dx * 1.6, gy - rng.uniform(8, 20))], fill=INK + (170,), width=2)


place('sahiwal', 40, 450, 1000)
place('tharparkar', 1620, 440, 1000, flip=False)
place('gir', 2080, 200, 690)

# foreground grass tufts
gd = ImageDraw.Draw(img)
for _ in range(260):
    x = rng.uniform(0, W)
    if 820 < x < 1560 and rng.random() < 0.6:
        continue
    y = rng.uniform(horizon(x) + 40, H - 4)
    for _b in range(rng.randint(2, 4)):
        dx = rng.uniform(-6, 6)
        gd.line([(x + dx, y), (x + dx * 1.7, y - rng.uniform(8, 18))], fill=INK + (140,), width=2)

img.save('public/images/sketch/farm-hero.png', optimize=True)
print('saved', img.size)
