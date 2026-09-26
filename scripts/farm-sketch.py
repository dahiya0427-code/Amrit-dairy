"""
Generates public/images/sketch/farm-panorama.png: a pencil-style farm
landscape (hills, tree line, barn, silo, trees, fence, path, grass, birds) with
the pencil sketches of our own cows placed in it. Drawn at 2x and downsampled
for smooth, pencil-like lines. Run: python3 scripts/farm-sketch.py
"""
import math
import random

import numpy as np
from PIL import Image, ImageDraw

W, H = 3000, 760          # output size
K = 2                     # supersampling
INK = (74, 52, 30)
rng = random.Random(7)

img = Image.new('RGBA', (W * K, H * K), (0, 0, 0, 0))
d = ImageDraw.Draw(img)


def jitter_path(pts, amp):
    """Offset a polyline by smooth random noise, like a hand that wobbles."""
    out = []
    phase = rng.random() * 10
    for i, (x, y) in enumerate(pts):
        t = i / max(1, len(pts) - 1)
        out.append((x + amp * math.sin(phase + t * 7.3) + rng.gauss(0, amp * 0.25),
                    y + amp * math.cos(phase * 1.3 + t * 5.1) + rng.gauss(0, amp * 0.25)))
    return out


def stroke(pts, w=1.6, a=200, passes=2, amp=1.2):
    """Draw a pencil stroke: a few slightly different passes of varying weight."""
    for p in range(passes):
        q = jitter_path(pts, amp)
        alpha = int(a * (0.55 + 0.45 * rng.random()))
        width = max(1, int(round(w * K * (0.7 + 0.5 * rng.random()))))
        d.line([(x * K, y * K) for x, y in q], fill=INK + (alpha,), width=width, joint='curve')


def bump(x1, y1, x2, y2, bx, by):
    """Points along a smooth rounded bump from (x1,y1) to (x2,y2) bulging towards (bx,by)."""
    return [((1 - t) ** 2 * x1 + 2 * (1 - t) * t * bx + t * t * x2, (1 - t) ** 2 * y1 + 2 * (1 - t) * t * by + t * t * y2) for t in np.linspace(0, 1, 7)]


def curve(fn, x0, x1, step=6):
    return [(x, fn(x)) for x in np.arange(x0, x1 + step, step)]


def hatch(x0, y0, x1, y1, n, length=14, angle=-60, a=90, w=1.0, mask=None):
    """Short parallel pencil strokes inside a box (optionally filtered by mask(x, y))."""
    ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    for _ in range(n):
        x, y = rng.uniform(x0, x1), rng.uniform(y0, y1)
        if mask and not mask(x, y):
            continue
        L = length * (0.6 + 0.8 * rng.random())
        stroke([(x, y), (x + ca * L, y + sa * L)], w=w, a=a, passes=1, amp=0.3)


# ── Ground and hills ────────────────────────────────────────────────────────
def far_hill(x):
    return 300 + 38 * math.sin(x / 260) + 22 * math.sin(x / 97 + 1.3)


def mid_hill(x):
    return 395 + 30 * math.sin(x / 330 + 2) + 16 * math.sin(x / 140)


def ground(x):
    return 640 + 10 * math.sin(x / 420 + 0.4)


stroke(curve(far_hill, 0, W), w=1.3, a=120, passes=2, amp=1.5)
stroke(curve(mid_hill, 0, W), w=1.5, a=160, passes=2, amp=1.5)
stroke(curve(ground, 0, W), w=2.0, a=220, passes=2, amp=1.2)

# soft shading under the ridge lines
hatch(0, 300, W, 380, 520, length=10, angle=-20, a=45, mask=lambda x, y: far_hill(x) + 4 < y < far_hill(x) + 26)
hatch(0, 395, W, 470, 520, length=12, angle=-20, a=50, mask=lambda x, y: mid_hill(x) + 4 < y < mid_hill(x) + 28)

# distant tree line: a continuous scalloped band along the far hills
for seg_start, seg_end in [(0, 1200), (1800, W)]:
    pts = []
    x = seg_start
    while x < seg_end:
        top = far_hill(x) - 10 - 22 * (0.5 + 0.5 * math.sin(x / 70)) * (0.6 + 0.4 * rng.random())
        pts.append((x, top))
        x += 14 + rng.random() * 10
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        stroke(bump(x1, y1, x2, y2, (x1 + x2) / 2, min(y1, y2) - 8 - rng.random() * 5), w=1.0, a=100, passes=1, amp=0.2)
    hatch(seg_start, 240, seg_end, 330, 500, length=8, angle=-70, a=60, mask=lambda px, py: far_hill(px) - 22 < py < far_hill(px))

# ── Trees ────────────────────────────────────────────────────────────────────
def tree(x, base, h, spread):
    trunk_top = base - h * 0.45
    stroke([(x - 7, base), (x - 5, trunk_top + 10), (x - 12, trunk_top)], w=1.8, a=210)
    stroke([(x + 7, base), (x + 5, trunk_top + 10), (x + 13, trunk_top - 4)], w=1.8, a=210)
    hatch(x - 4, trunk_top + 12, x + 6, base - 4, 26, length=9, angle=-80, a=110)
    for bx, by in [(-40, -30), (35, -38), (0, -60)]:
        stroke([(x, trunk_top + 6), (x + bx * 0.6, trunk_top + by * 0.5), (x + bx, trunk_top + by)], w=1.3, a=170)
    # canopy: a scalloped leafy outline (many small arcs), inner leaf clusters
    cy = base - h * 0.72
    for layer, (sx, sy, sp) in enumerate([(0, 0, 1.0), (-0.35, 0.25, 0.55), (0.4, 0.2, 0.6)]):
        rx, ry = spread * 1.15 * sp, spread * 0.72 * sp
        ccx, ccy = x + sx * spread, cy + sy * spread
        if layer == 0:  # solid canopy so the hills behind don't show through
            d.ellipse([(ccx - rx * 1.05) * K, (ccy - ry * 1.05) * K, (ccx + rx * 1.05) * K, (ccy + ry * 1.05) * K], fill=(255, 255, 255, 255))
        pts = []
        for t in np.linspace(0, 2 * math.pi, int(26 * sp) + 10):
            wob = 1 + 0.12 * math.sin(t * 5 + layer) + 0.06 * rng.random()
            pts.append((ccx + rx * wob * math.cos(t), ccy + ry * wob * math.sin(t)))
        # draw each segment as a small outward bump
        for (x1, y1), (x2, y2) in zip(pts, pts[1:] + pts[:1]):
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            nx, ny = mx - ccx, my - ccy
            nl = math.hypot(nx, ny) or 1
            b = 7 + rng.random() * 7
            stroke(bump(x1, y1, x2, y2, mx + nx / nl * b, my + ny / nl * b), w=1.2 if layer == 0 else 0.9, a=190 if layer == 0 else 110, passes=1, amp=0.3)
    # little leaf clusters inside
    for _ in range(int(spread * 0.5)):
        ang, rad = rng.random() * 2 * math.pi, spread * 0.8 * math.sqrt(rng.random())
        px, py = x + math.cos(ang) * rad, cy + math.sin(ang) * rad * 0.6
        stroke([(px - 5, py), (px - 2, py - 4), (px + 1, py), (px + 4, py - 4), (px + 7, py)], w=0.9, a=110, passes=1, amp=0.3)
    # shade the lower-right side of the canopy
    hatch(x - spread * 0.2, cy, x + spread * 1.1, cy + spread * 0.7, int(spread * 2.2), length=12, angle=-55, a=95,
          mask=lambda px, py: (px - x) ** 2 / (spread * 1.15) ** 2 + (py - cy) ** 2 / (spread * 0.72) ** 2 < 1)


tree(880, ground(880) - 30, 330, 110)
tree(1150, mid_hill(1150) + 60, 170, 55)
tree(2940, ground(2940) - 20, 320, 100)
tree(2330, mid_hill(2330) + 60, 160, 50)


# ── Barn and silo ────────────────────────────────────────────────────────────
def barn(x, base, w, h):
    eave = base - h
    ridge = eave - h * 0.55
    left, right = x, x + w
    mid = x + w / 2
    d.polygon([(p_[0] * K, p_[1] * K) for p_ in [(left - 14, eave + 4), (left + w * 0.16, eave - h * 0.32), (mid, ridge), (right - w * 0.16, eave - h * 0.32), (right + 14, eave + 4), (right, base), (left, base)]], fill=(255, 255, 255, 255))
    # walls
    stroke([(left, base), (left, eave)], w=2, a=220)
    stroke([(right, base), (right, eave)], w=2, a=220)
    # gambrel roof
    roof = [(left - 14, eave + 4), (left + w * 0.16, eave - h * 0.32), (mid, ridge), (right - w * 0.16, eave - h * 0.32), (right + 14, eave + 4)]
    stroke(roof, w=2.2, a=230)
    stroke([(left - 14, eave + 4), (right + 14, eave + 4)], w=1.6, a=200)
    # roof shingle hatching on the right slope
    hatch(mid, ridge, right + 10, eave, 140, length=16, angle=-35, a=90,
          mask=lambda px, py: py > ridge + (px - mid) * (h * 0.55 / (w / 2)) * 0.9 and py < eave)
    # vertical planks
    for px in np.arange(left + 12, right - 6, 14):
        stroke([(px, eave + 10), (px, base - 2)], w=0.9, a=95, passes=1, amp=0.5)
    # big door with X brace
    dl, dr, dt = mid - w * 0.18, mid + w * 0.18, base - h * 0.62
    stroke([(dl, base), (dl, dt), (dr, dt), (dr, base)], w=1.8, a=220)
    stroke([(dl, dt), (dr, base)], w=1.5, a=200)
    stroke([(dr, dt), (dl, base)], w=1.5, a=200)
    stroke([(mid, dt), (mid, base)], w=1.2, a=160)
    # loft window
    wy = eave - h * 0.2
    stroke([(mid - 16, wy - 14), (mid + 16, wy - 14), (mid + 16, wy + 16), (mid - 16, wy + 16), (mid - 16, wy - 14)], w=1.4, a=200)
    stroke([(mid, wy - 14), (mid, wy + 16)], w=1, a=150)
    # shaded right wall
    hatch(right - w * 0.28, eave + 6, right - 4, base - 4, 120, length=14, angle=-70, a=70)


def silo(x, base, w, h):
    top = base - h
    d.rectangle([x * K, (top - w * 0.45) * K, (x + w) * K, base * K], fill=(255, 255, 255, 255))
    stroke([(x, base), (x, top)], w=2, a=220)
    stroke([(x + w, base), (x + w, top)], w=2, a=220)
    dome = [(x + w / 2 + (w / 2) * math.cos(t), top - (w * 0.45) * math.sin(t)) for t in np.linspace(math.pi, 0, 20)]
    stroke(dome, w=2, a=220)
    for yy in np.arange(top + 24, base - 10, 34):
        stroke(curve(lambda xx: yy + 5 * math.sin((xx - x) / w * math.pi), x, x + w, 4), w=1.1, a=150, passes=1)
    hatch(x + w * 0.62, top, x + w - 2, base - 4, 90, length=13, angle=-75, a=80)


barn(1880, mid_hill(1880) + 150, 250, 150)
silo(2160, mid_hill(2160) + 150, 58, 230)
# small farmhouse on the left hill
barn(560, mid_hill(560) + 70, 120, 70)

# ── Fence receding towards the barn ──────────────────────────────────────────
posts = [(2250 + i * 70, ground(2250 + i * 70) - 40 - i * 3) for i in range(9)]
for px, py in posts:
    stroke([(px, py + 40), (px + rng.uniform(-3, 3), py - 38)], w=2, a=210)
for dy in (-26, -2):
    stroke([(px, py + dy) for px, py in posts], w=1.4, a=180)

# path from the foreground to the barn door
door_x, door_y = 1880 + 125, mid_hill(1880) + 150
stroke(curve(lambda xx: door_y + (xx - (door_x - 22)) / ((1760) - (door_x - 22)) * (H - door_y), 1760, door_x - 22, 8), w=1.2, a=130)
stroke(curve(lambda xx: door_y + (xx - (door_x + 22)) / ((2230) - (door_x + 22)) * (H - door_y), door_x + 22, 2230, 8), w=1.2, a=130)

# grass tufts, denser in the foreground
for _ in range(520):
    x = rng.uniform(0, W)
    if 1300 < x < 1700 and rng.random() < 0.7:
        continue
    y = ground(x) + rng.uniform(-6, 110) if rng.random() < 0.6 else mid_hill(x) + rng.uniform(20, 200)
    if y > H - 6:
        continue
    for _b in range(rng.randint(3, 6)):
        dx = rng.uniform(-7, 7)
        stroke([(x + dx, y), (x + dx * 1.6 + rng.uniform(-3, 3), y - rng.uniform(8, 22))], w=1.0, a=120, passes=1, amp=0.4)

# birds
for bx, by, s in [(640, 90, 1.0), (700, 70, 0.8), (760, 104, 0.9), (2420, 120, 1.0), (2470, 96, 0.8)]:
    stroke([(bx - 14 * s, by - 2), (bx - 6 * s, by - 9 * s), (bx, by)], w=1.3, a=170, passes=1)
    stroke([(bx, by), (bx + 6 * s, by - 9 * s), (bx + 14 * s, by - 2)], w=1.3, a=170, passes=1)

img = img.resize((W, H), Image.LANCZOS)

# ── Our own cows (pencil sketches), at different distances ──────────────────
cows = [
    ('gir', 30, 300, False, 30),
    ('sahiwal', 400, 205, True, -5),
    ('rathi', 1040, 120, False, -60),
    ('kankrej', 1640, 150, False, -40),
    ('tharparkar', 2520, 280, True, 25),
]
for name, x, h, flip, dy in cows:
    c = Image.open(f'public/images/sketch/{name}.png').convert('RGBA')
    c = c.resize((int(c.width * h / c.height), h), Image.LANCZOS)
    if flip:
        c = c.transpose(Image.FLIP_LEFT_RIGHT)
    # fade out the oval grass patch the photos stood on
    a_ = np.array(c).astype(float)
    ys = np.linspace(0, 1, c.height)[:, None]
    a_[..., 3] *= np.clip((0.95 - ys) / 0.09, 0.0, 1)
    c = Image.fromarray(a_.astype(np.uint8), 'RGBA')
    base = ground(x + c.width / 2) + dy
    img.alpha_composite(c, (int(x), int(base - h)))
    # a few grass tufts at the hooves so the cow stands in the field
    gd = ImageDraw.Draw(img)
    for _ in range(int(h / 12)):
        gx = x + rng.uniform(0.05, 0.95) * c.width
        gy = base - h * 0.03 + rng.uniform(-2, 6)
        for _b in range(3):
            ddx = rng.uniform(-4, 4)
            gd.line([(gx + ddx, gy), (gx + ddx * 1.5, gy - rng.uniform(5, 12) * h / 250)], fill=INK + (110,), width=1)

img.save('public/images/sketch/farm-panorama.png', optimize=True)
print('saved', img.size)
