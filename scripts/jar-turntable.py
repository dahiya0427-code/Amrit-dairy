"""
Builds a real 360° turntable of the ghee jar (public/images/jar-turn.webp).

We have three photos of the jar: the front, the "Manufactured by" side and the
"About Amrit Dairy" back. Each is unwrapped onto a cylinder (the jar is a shape
of revolution) into one panorama of the whole label, which is then wrapped back
around the jar at 48 angles, so the label really travels round the jar while
it turns, instead of a flat picture flipping.

Sources: public/images/ghee-cutout.png (front, with transparency) and
seed-media/jar/side.png, seed-media/jar/back.png (cut from the product photos).
Run: python3 scripts/jar-turntable.py
"""
import math

import numpy as np
from PIL import Image

FRAMES, COLS = 48, 8
VIEWS = [  # (file, centre angle in degrees)
    ('public/images/ghee-cutout.png', 0),
    ('seed-media/jar/side.png', 120),
    ('seed-media/jar/back.png', 240),
]
HALF = 66  # degrees each view contributes either side of its centre
FADE = 12  # narrow crossfade at the seams (avoids double text)
PANO = 1440  # panorama columns (4 per degree)

front = Image.open(VIEWS[0][0]).convert('RGBA')
W, H = front.size
alpha = np.array(front)[..., 3].astype(np.float32) / 255


def load_view(path):
    """Crop a view to the jar's bounding box and scale it to the front's size."""
    im = Image.open(path).convert('RGBA')
    a = np.array(im)
    if a[..., 3].min() == 255:  # no transparency: find the jar against the light background
        rgb = a[..., :3].astype(int)
        bg = rgb[2, 2]
        mask = np.abs(rgb - bg).sum(2) > 45
    else:
        mask = a[..., 3] > 40
    # ignore thin card borders and stray marks: keep rows/columns that are really jar
    cols = np.where(mask.sum(0) > mask.shape[0] * 0.08)[0]
    rows_ = np.where(mask.sum(1) > mask.shape[1] * 0.08)[0]
    box = (cols.min(), rows_.min(), cols.max() + 1, rows_.max() + 1)
    return np.array(im.crop(box).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32)


views = [(load_view(p), c) for p, c in VIEWS]
views[0] = (np.array(front.convert('RGB')).astype(np.float32), 0)

# jar silhouette per row: centre and radius (from the front photo's transparency)
centre = np.full(H, W / 2, np.float32)
radius = np.zeros(H, np.float32)
for y in range(H):
    xs = np.where(alpha[y] > 0.5)[0]
    if len(xs) > 2:
        centre[y] = (xs[0] + xs[-1]) / 2
        radius[y] = (xs[-1] - xs[0]) / 2
valid = radius > 3


def sample(img, x, y):
    """Bilinear sample of img at float coords x (per column) on integer row y."""
    x = np.clip(x, 0, W - 1.001)
    x0 = np.floor(x).astype(int)
    t = (x - x0)[:, None]
    return img[y, x0] * (1 - t) + img[y, x0 + 1] * t


# ── unwrap the three views into one panorama ────────────────────────────────
phi = np.arange(PANO) * 360 / PANO  # angle of each panorama column
pano = np.zeros((H, PANO, 3), np.float32)
weight = np.zeros((H, PANO, 1), np.float32)
for img, c in views:
    d = (phi - c + 540) % 360 - 180
    cols = np.where(np.abs(d) <= HALF)[0]
    s = np.sin(np.radians(d[cols]))
    w = np.clip((HALF - np.abs(d[cols])) / FADE, 0, 1)[:, None] + 1e-4
    for y in np.where(valid)[0]:
        px = centre[y] + s * radius[y]
        pano[y, cols] += sample(img, px, y) * w
        weight[y, cols] += w
pano /= np.maximum(weight, 1e-6)

# ── wrap it back round the jar at every angle ───────────────────────────────
xs = np.arange(W, dtype=np.float32)
rows = Image.new('RGBA', (W * COLS, H * math.ceil(FRAMES / COLS)))
for f in range(FRAMES):
    theta = f * 360 / FRAMES
    out = np.zeros((H, W, 4), np.float32)
    for y in np.where(valid)[0]:
        s = np.clip((xs - centre[y]) / radius[y], -1, 1)
        ang = (theta + np.degrees(np.arcsin(s))) % 360
        u = ang * PANO / 360
        u0 = np.floor(u).astype(int) % PANO
        u1 = (u0 + 1) % PANO
        t = (u - np.floor(u))[:, None]
        out[y, :, :3] = pano[y, u0] * (1 - t) + pano[y, u1] * t
    out[..., 3] = alpha * 255
    frame = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGBA')
    rows.paste(frame, ((f % COLS) * W, (f // COLS) * H))

rows.save('public/images/jar-turn.webp', quality=70, method=6)
print('saved', rows.size, 'frames', FRAMES, 'frame', (W, H))
