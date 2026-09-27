"""
Puts every breed photo (seed-media/breeds/*.jpg: a cow on a white backdrop
standing on a small grass patch) into a photo-like pasture, so the cow looks
like it is really standing in a field: sky, a hazy tree line, meadow with depth
blur, a soft contact shadow and grass in front of the hooves.
Output: public/images/cows/<slug>.jpg (800x800).
Run: python3 scripts/cow-pasture.py
"""
import glob
import math
import os
import random

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

S = 800
os.makedirs('public/images/cows', exist_ok=True)


def cutout(path):
    """Remove the near-white backdrop by flood-filling from the border."""
    img = cv2.imread(path)
    h, w = img.shape[:2]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.int16)
    bg = np.median(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]), axis=0)
    dist = np.sqrt(((lab - bg) ** 2).sum(2))
    near = (dist < 14).astype(np.uint8)
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flood = near.copy() * 255
    for x, y in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0)]:
        if flood[y, x] == 255:
            cv2.floodFill(flood, mask, (x, y), 128)
    alpha = np.where(flood == 128, 0, 255).astype(np.uint8)
    # backdrop showing through closed gaps (between the legs, under the belly)
    n, lbl, stats, _ = cv2.connectedComponentsWithStats((dist < 9).astype(np.uint8), 8)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] >= 120:
            alpha[lbl == i] = 0
    # drop the grass patch the photo stood on (green or pale pixels in the bottom band)
    ys_, xs_ = np.where(alpha > 40)
    top, bottom = ys_.min(), ys_.max()
    band = int(bottom - (bottom - top) * 0.2)
    rgbi = img[..., ::-1].astype(np.int16)
    R, G, B = rgbi[..., 0], rgbi[..., 1], rgbi[..., 2]
    greenish = (G > R + 6) & (G > B + 6)
    pale = (rgbi.min(2) > 200) & ((rgbi.max(2) - rgbi.min(2)) < 30)
    kill = np.zeros_like(alpha, bool)
    kill[band:] = (greenish | pale)[band:]
    alpha[kill] = 0
    # the patch outline is a thin line touching the hooves: remove thin shapes in the bottom band
    alpha[band:] = cv2.morphologyEx(alpha[band:], cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
    # keep only the cow: the largest connected shape (drops the patch's leftover outline)
    n2, lbl2, st2, _ = cv2.connectedComponentsWithStats((alpha > 60).astype(np.uint8), 8)
    if n2 > 1:
        keep = 1 + int(np.argmax(st2[1:, cv2.CC_STAT_AREA]))
        body = cv2.dilate((lbl2 == keep).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
        alpha[~body] = 0
    alpha = cv2.morphologyEx(alpha, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    alpha = cv2.GaussianBlur(alpha, (0, 0), 0.9)
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    out = np.dstack([rgb, alpha])
    ys, xs = np.where(alpha > 40)
    return Image.fromarray(out[ys.min():ys.max() + 1, xs.min():xs.max() + 1], 'RGBA')


def backdrop(seed):
    rng = np.random.default_rng(seed)
    r = random.Random(seed)
    y = np.linspace(0, 1, S)[:, None]
    horizon = 0.56
    # sky: soft blue at the top, warm haze at the horizon
    top, low = np.array([176, 205, 226]), np.array([244, 238, 224])
    t = np.clip(y / horizon, 0, 1) ** 0.8
    sky = top * (1 - t[..., None]) + low * t[..., None]
    img = np.repeat(sky, S, axis=1).astype(np.float32)
    # a few soft clouds
    cl = Image.new('L', (S, S), 0)
    cd = ImageDraw.Draw(cl)
    for _ in range(5):
        cx, cy = r.uniform(0, S), r.uniform(40, S * 0.32)
        for _k in range(7):
            rr = r.uniform(25, 60)
            ox, oy = r.uniform(-70, 70), r.uniform(-12, 12)
            cd.ellipse([cx + ox - rr * 1.6, cy + oy - rr * 0.6, cx + ox + rr * 1.6, cy + oy + rr * 0.6], fill=r.randint(60, 110))
    cl = np.array(cl.filter(ImageFilter.GaussianBlur(18))).astype(np.float32)[..., None] / 255
    img = img * (1 - cl) + 255 * cl
    # distant tree line (hazy, blurred)
    tl = Image.new('L', (S, S), 0)
    td = ImageDraw.Draw(tl)
    hy = int(S * horizon)
    x = -20
    while x < S + 20:
        w = r.uniform(30, 80)
        h = r.uniform(25, 70)
        td.ellipse([x, hy - h, x + w, hy + 10], fill=255)
        x += w * 0.55
    tl = np.array(tl.filter(ImageFilter.GaussianBlur(4))).astype(np.float32)[..., None] / 255
    trees = np.array([112, 132, 102], np.float32)
    img = img * (1 - tl * 0.85) + trees * tl * 0.85
    # meadow: darker, greener and sharper towards the viewer
    g = np.clip((y - horizon) / (1 - horizon), 0, 1)
    far, near_c = np.array([164, 176, 118]), np.array([96, 128, 56])
    meadow = far * (1 - g[..., None]) + near_c * g[..., None]
    m = (y > horizon).astype(np.float32)[..., None]
    img = img * (1 - m) + np.repeat(meadow, S, axis=1) * m
    # grass texture: many short blades, blurred more with distance
    tex = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(tex)
    for _ in range(9000):
        yy = hy + (S - hy) * (r.random() ** 0.7)
        d = (yy - hy) / (S - hy)
        xx = r.uniform(0, S)
        L = 2 + 16 * d
        col = r.choice([(70, 100, 40), (128, 150, 76), (150, 160, 90), (88, 118, 48), (180, 176, 110)])
        gd.line([(xx, yy), (xx + r.uniform(-3, 3) * d, yy - L)], fill=col + (int(90 + 120 * d),), width=max(1, int(1 + 1.5 * d)))
    far_layer = tex.filter(ImageFilter.GaussianBlur(1.6))
    fl = np.array(far_layer).astype(np.float32)
    nl = np.array(tex).astype(np.float32)
    depth = np.clip((y - horizon) / (1 - horizon), 0, 1)[..., None]
    layer = fl * (1 - depth) + nl * depth
    a = layer[..., 3:4] / 255
    img = img * (1 - a) + layer[..., :3] * a
    # a little film grain
    img += rng.normal(0, 3.2, img.shape)
    return np.clip(img, 0, 255).astype(np.uint8)


def foreground_grass(seed, x0, x1, y):
    r = random.Random(seed + 99)
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(int((x1 - x0) * 5)):
        xx = r.uniform(x0 - 70, x1 + 70)
        yy = y + r.uniform(-4, 34)
        col = r.choice([(76, 108, 42), (104, 134, 56), (132, 150, 70), (64, 92, 34), (118, 140, 62)])
        L = r.uniform(12, 40)
        d.line([(xx, yy), (xx + r.uniform(-5, 5), yy - L)], fill=col + (235,), width=2)
    return layer.filter(ImageFilter.GaussianBlur(0.4))


for path in sorted(glob.glob('seed-media/breeds/*.jpg')):
    slug = os.path.splitext(os.path.basename(path))[0]
    seed = sum(map(ord, slug))
    cow = cutout(path)
    # scale: cow fills about 70% of the width
    k = min(S * 0.74 / cow.width, S * 0.62 / cow.height)
    cow = cow.resize((int(cow.width * k), int(cow.height * k)), Image.LANCZOS)
    bg = Image.fromarray(backdrop(seed), 'RGB').convert('RGBA')
    feet = int(S * 0.9)
    # the photo's grass patch is gone: stand the hooves on the meadow

    x = (S - cow.width) // 2
    y = feet - cow.height
    # contact shadow under the body and hooves
    sh = Image.new('L', (S, S), 0)
    ImageDraw.Draw(sh).ellipse([x + cow.width * 0.12, feet - 16, x + cow.width * 0.9, feet + 14], fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(12))
    dark = Image.new('RGBA', (S, S), (30, 34, 14, 255))
    bg = Image.composite(dark, bg, sh.point(lambda v: int(v * 0.55)))
    bg.alpha_composite(cow, (x, y))
    bg.alpha_composite(foreground_grass(seed, x + cow.width * 0.08, x + cow.width * 0.92, feet))
    # gentle warm grade and vignette
    out = np.array(bg.convert('RGB')).astype(np.float32)
    out *= np.array([1.03, 1.0, 0.95])
    yy, xx = np.mgrid[0:S, 0:S]
    v = 1 - 0.18 * (((xx - S / 2) / (S / 2)) ** 2 + ((yy - S / 2) / (S / 2)) ** 2)
    out *= v[..., None]
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(f'public/images/cows/{slug}.jpg', quality=86)
    print(slug)
