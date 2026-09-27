"""
AI-upscales the breed photos 4x with Real-ESRGAN (x4plus) so the cows stay
sharp at large sizes. Writes seed-media/breeds-hd/<slug>.png, which
scripts/cow-pasture.py prefers over the small originals.

Needs: pip install torch, and the model weights:
  curl -L -o RealESRGAN_x4plus.pth \\
    https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth
Run: python3 scripts/upscale-cows.py path/to/RealESRGAN_x4plus.pth
"""
import glob
import os
import sys

import numpy as np
import torch
from PIL import Image
from torch import nn
from torch.nn import functional as F


# ── RRDBNet, the network behind Real-ESRGAN x4plus ───────────────────────────
class RDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.conv1 = nn.Conv2d(nf, gc, 3, 1, 1)
        self.conv2 = nn.Conv2d(nf + gc, gc, 3, 1, 1)
        self.conv3 = nn.Conv2d(nf + 2 * gc, gc, 3, 1, 1)
        self.conv4 = nn.Conv2d(nf + 3 * gc, gc, 3, 1, 1)
        self.conv5 = nn.Conv2d(nf + 4 * gc, nf, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        x1 = self.lrelu(self.conv1(x))
        x2 = self.lrelu(self.conv2(torch.cat((x, x1), 1)))
        x3 = self.lrelu(self.conv3(torch.cat((x, x1, x2), 1)))
        x4 = self.lrelu(self.conv4(torch.cat((x, x1, x2, x3), 1)))
        x5 = self.conv5(torch.cat((x, x1, x2, x3, x4), 1))
        return x5 * 0.2 + x


class RRDB(nn.Module):
    def __init__(self, nf=64, gc=32):
        super().__init__()
        self.rdb1, self.rdb2, self.rdb3 = RDB(nf, gc), RDB(nf, gc), RDB(nf, gc)

    def forward(self, x):
        return self.rdb3(self.rdb2(self.rdb1(x))) * 0.2 + x


class RRDBNet(nn.Module):
    def __init__(self, nb=23, nf=64, gc=32):
        super().__init__()
        self.conv_first = nn.Conv2d(3, nf, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(nf, gc) for _ in range(nb)])
        self.conv_body = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up1 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_up2 = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_hr = nn.Conv2d(nf, nf, 3, 1, 1)
        self.conv_last = nn.Conv2d(nf, 3, 3, 1, 1)
        self.lrelu = nn.LeakyReLU(0.2, True)

    def forward(self, x):
        feat = self.conv_first(x)
        feat = feat + self.conv_body(self.body(feat))
        feat = self.lrelu(self.conv_up1(F.interpolate(feat, scale_factor=2, mode='nearest')))
        feat = self.lrelu(self.conv_up2(F.interpolate(feat, scale_factor=2, mode='nearest')))
        return self.conv_last(self.lrelu(self.conv_hr(feat)))


def main(weights):
    torch.set_num_threads(os.cpu_count() or 4)
    net = RRDBNet()
    sd = torch.load(weights, map_location='cpu')
    net.load_state_dict(sd.get('params_ema', sd.get('params', sd)), strict=True)
    net.eval()
    os.makedirs('seed-media/breeds-hd', exist_ok=True)
    for path in sorted(glob.glob('seed-media/breeds/*.jpg')):
        slug = os.path.splitext(os.path.basename(path))[0]
        out_path = f'seed-media/breeds-hd/{slug}.png'
        if os.path.exists(out_path):
            continue
        img = np.asarray(Image.open(path).convert('RGB')).astype(np.float32) / 255
        x = torch.from_numpy(img).permute(2, 0, 1)[None]
        with torch.no_grad():
            y = net(x).clamp(0, 1)[0].permute(1, 2, 0).numpy()
        Image.fromarray((y * 255).round().astype(np.uint8)).save(out_path, optimize=True)
        print(slug, flush=True)


if __name__ == '__main__':
    main(sys.argv[1])
