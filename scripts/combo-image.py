"""Builds the Ghee + Honey Gift Box pictures from the existing jar cut-outs.

seed-media/combo-ghee-honey.jpg           1200x1200 cream packshot (product cards)
seed-media/cutouts/combo-ghee-honey.png   transparent pair of jars (story slides)
"""
from PIL import Image, ImageDraw, ImageFilter

ghee = Image.open('public/images/ghee-cutout.png').convert('RGBA')
honey = Image.open('public/images/honey-cutout.png').convert('RGBA')


def clean(im):
    """The source cut-outs sit on a near-white box; clear the light background
    that touches the image edges (the jar's own light label is not connected)."""
    import cv2
    import numpy as np
    rgba = np.array(im)
    rgb = rgba[..., :3].astype(np.int16)
    light = ((rgb.min(axis=2) > 214) & ((rgb.max(axis=2) - rgb.min(axis=2)) < 30)) | (rgba[..., 3] < 48)
    n, labels = cv2.connectedComponents(light.astype(np.uint8), connectivity=4)
    edge = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))) - {0}
    bg = np.isin(labels, list(edge)) & light
    alpha = np.where(bg, 0, rgba[..., 3]).astype(np.uint8)
    # soften the cut edge a little
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
    out = rgba.copy()
    out[..., 3] = np.minimum(alpha, rgba[..., 3])
    return Image.fromarray(out, 'RGBA')


def fit(im, h):
    im = clean(im)
    im = im.crop(im.getbbox())
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)


def pair(height):
    g = fit(ghee, height)
    hn = fit(honey, round(height * 0.78))
    gap = round(height * -0.06)  # jars slightly overlap, honey in front
    w = g.width + hn.width + gap
    canvas = Image.new('RGBA', (w, height), (0, 0, 0, 0))
    canvas.alpha_composite(g, (0, 0))
    canvas.alpha_composite(hn, (g.width + gap, height - hn.height))
    return canvas


def shadow(im, blur=28, opacity=110):
    a = im.split()[3].point(lambda v: opacity if v > 10 else 0)
    sh = Image.new('RGBA', im.size, (43, 27, 16, 0))
    sh.putalpha(a)
    return sh.filter(ImageFilter.GaussianBlur(blur))


# transparent cut-out
cut = pair(900)
cut.save('seed-media/cutouts/combo-ghee-honey.png', optimize=True)

# cream packshot in the jars' own background tone (the ghee jar's glass is drawn on
# this pale cream, so any other colour shows a box), a soft floor shadow, and a vignette
S = 1200
TONE = (242, 238, 223, 255)
bg = Image.new('RGBA', (S, S), TONE)
edge = Image.new('L', (S, S), 255)
ImageDraw.Draw(edge).ellipse((-150, -150, S + 150, S + 150), fill=0)
edge = edge.filter(ImageFilter.GaussianBlur(140))
bg = Image.composite(Image.new('RGBA', (S, S), (226, 212, 180, 255)), bg, edge)
jars = pair(800)
x, y = (S - jars.width) // 2, 200
floor = Image.new('RGBA', (S, S), (0, 0, 0, 0))
ImageDraw.Draw(floor).ellipse((x + 30, y + jars.height - 34, x + jars.width - 30, y + jars.height + 40), fill=(43, 27, 16, 80))
bg.alpha_composite(floor.filter(ImageFilter.GaussianBlur(26)))
bg.alpha_composite(jars, (x, y))
# ribbon: a thin gold band with a bow knot, across the top corner
d = ImageDraw.Draw(bg)
d.polygon([(0, 150), (150, 0), (230, 0), (0, 230)], fill=(201, 162, 74, 255))
d.polygon([(0, 168), (168, 0), (176, 0), (0, 176)], fill=(243, 220, 154, 255))
bg.convert('RGB').save('seed-media/combo-ghee-honey.jpg', quality=88, optimize=True)
print('ok', cut.size)
