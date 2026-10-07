"""Fills the see-through holes in the dairy cut-outs.

When the background was removed, the white milk/paneer was mistaken for
background, so bottles looked empty on dark sections. This rebuilds each
product's outline (row by row, mirrored about its centre so a bitten edge is
restored, then smoothed), paints the inside milk-white, and lays the original
picture back on top so the label and glass stay exactly as they were.

Usage: python3 scripts/fill-cutouts.py   (rewrites the files listed below)
"""
import cv2
import numpy as np
from PIL import Image

FILES = {
    'seed-media/cutouts/milk.png': (251, 249, 243),
    'public/images/milk-cutout.png': (251, 249, 243),
    'seed-media/cutouts/buttermilk.png': (250, 250, 247),
    'seed-media/cutouts/paneer.png': (249, 247, 240),
    'seed-media/cutouts/curd.png': (246, 240, 226),
}


def outline(alpha, mirror=True):
    solid = alpha > 60
    h, w = solid.shape
    rows = [np.flatnonzero(solid[y]) for y in range(h)]
    spans = [(r[0], r[-1]) if len(r) else None for r in rows]
    widths = [b - a for s in spans if s for a, b in [s]]
    big = max(widths) if widths else 0
    centres = [(a + b) / 2 for s in spans if s for a, b in [s] if b - a > big * 0.6]
    cx = float(np.median(centres)) if centres else w / 2
    left = np.full(h, np.nan)
    right = np.full(h, np.nan)
    for y, s in enumerate(spans):
        if not s:
            continue
        a, b = s
        if mirror:
            a, b = min(a, 2 * cx - b), max(b, 2 * cx - a)
        left[y], right[y] = a, b
    # smooth the edges down the bottle so single bitten rows are filled in
    k = 9
    for arr, fn in ((left, np.nanmin), (right, np.nanmax)):
        src = arr.copy()
        for y in range(h):
            win = src[max(0, y - k):y + k + 1]
            if not np.all(np.isnan(win)) and not np.isnan(src[y]):
                arr[y] = fn(win) if abs(fn(win) - src[y]) < w * 0.08 else src[y]
    mask = np.zeros((h, w), np.uint8)
    for y in range(h):
        if not np.isnan(left[y]):
            mask[y, int(max(0, left[y])):int(min(w - 1, right[y])) + 1] = 255
    # stay a hair inside the original edge so no milk-white rim shows
    mask = cv2.erode(mask, np.ones((3, 3), np.uint8))
    return cv2.GaussianBlur(mask, (3, 3), 0)


for path, colour in FILES.items():
    im = Image.open(path).convert('RGBA')
    mask = outline(np.array(im)[..., 3])
    base = Image.new('RGBA', im.size, colour + (0,))
    base.putalpha(Image.fromarray(mask))
    base.alpha_composite(im)
    base.save(path, optimize=True)
    print('filled', path)
