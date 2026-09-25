# 03 · Brand Guidelines — Amrit Dairy (Digital)

> Visual and verbal rules for the website and all digital touchpoints.
> **Design concept: "Farm Morning".** It should feel like first light on the farm: warm cream, deep field green, a glint of golden ghee. The look is honest, calm and premium, but never cold or corporate.

---

## 1. Logo

🟡 *The existing logo files were not available. These are the rules for the new / refreshed mark.*

| Item | Rule |
|---|---|
| Primary lockup | Symbol + wordmark "Amrit Dairy" set horizontally. Optional sub-line: "Sonipat · Since 20XX" |
| Symbol idea | A simple line-drawn desi cow (hump visible, which marks it as desi) inside a drop / kalash shape. The drop stands for *amrit* |
| Versions | Full colour on cream · White (reversed) on green · Single-colour green · Favicon (symbol only) |
| Clear space | At least the height of the "A" in "Amrit" on every side |
| Minimum size | 120 px wide (full lockup) · 24 px (symbol) |
| Don'ts | Don't stretch, recolour outside the palette, add shadows or gradients, or place on busy photos without a scrim |
| Files needed | SVG (web), PNG @1x/@2x, favicon.ico, apple-touch-icon 180 px, OG default image 1200×630 |

---

## 2. Color palette

### 2.1 Core colors

| Token | Name | HEX | RGB | Use |
|---|---|---|---|---|
| `--brand-green-900` | **Amrit Field Green** (Primary) | `#1F4D3A` | 31, 77, 58 | Header, primary buttons, headings, footer background |
| `--brand-green-700` | Pasture Green | `#2E6B4F` | 46, 107, 79 | Hover states, links, icons |
| `--brand-green-100` | Mint Wash | `#E4EFE8` | 228, 239, 232 | Tinted section backgrounds, tags |
| `--brand-gold-500` | **Golden Ghee** (Accent) | `#E0A526` | 224, 165, 38 | Highlights, badges, stars, CTA on green, illustrations. **Never body text on cream** |
| `--brand-gold-700` | Ghee Deep | `#8A5A00` | 138, 90, 0 | Gold used as text on light backgrounds (passes AA) |
| `--brand-cream-50` | **Fresh Milk** (Base) | `#FBF7EE` | 251, 247, 238 | Page background |
| `--brand-cream-200` | Malai | `#F3EAD6` | 243, 234, 214 | Cards, alternating sections |
| `--brand-soil-700` | Haryana Soil | `#6B4A33` | 107, 74, 51 | Secondary text accents, farm/story sections |
| `--ink-900` | Ink | `#1E1C19` | 30, 28, 25 | Body text |
| `--ink-600` | Muted Ink | `#5A554D` | 90, 85, 77 | Secondary text, captions |
| `--line` | Line | `#E2D9C6` | 226, 217, 198 | Borders, dividers |
| `--white` | White | `#FFFFFF` | — | Inputs, product-image backgrounds |

### 2.2 Functional colors
| Token | HEX | Use |
|---|---|---|
| `--success` | `#2F7D4A` | "Delivers to your area", order success |
| `--warning` | `#B7791F` | "Coming soon", low stock |
| `--error` | `#B42318` | Form errors, "Not serviceable yet" |
| `--info` | `#2B5C8A` | Ticker, notices |

### 2.3 Ratio (60-30-10)
- **60 %** Fresh Milk cream (backgrounds)
- **30 %** Field Green (structure, text, footer)
- **10 %** Golden Ghee (accents and CTAs)

### 2.4 Accessibility (WCAG 2.2 AA)
| Pair | Approx. contrast | Allowed for |
|---|---|---|
| Ink `#1E1C19` on Fresh Milk `#FBF7EE` | ~16 : 1 | All text |
| Field Green `#1F4D3A` on Fresh Milk | ~9.0 : 1 | All text, buttons |
| Fresh Milk on Field Green | ~9.0 : 1 | Button labels, footer text |
| Ghee Deep `#8A5A00` on Fresh Milk | ~5.5 : 1 | Text / links |
| Golden Ghee `#E0A526` on Field Green | ~4.4 : 1 | Large text (≥ 24 px, or 19 px bold) and icons only |
| Golden Ghee on Fresh Milk | ~2 : 1 | ❌ Decorative only |
| Ink on Golden Ghee (button) | ~7.8 : 1 | ✅ Gold CTA buttons use **dark text** |

> Ratios computed with the WCAG 2.x formula. Muted Ink on cream ≈ 6.9 : 1, Pasture Green on cream ≈ 5.9 : 1. Verify final values with a contrast checker in the design file before development.

### 2.5 Dark mode (optional, Phase 3)
| Token | Dark value |
|---|---|
| Background | `#121A16` |
| Surface | `#1A2620` |
| Text | `#F3EFE6` |
| Primary | `#7FC29B` |
| Accent | `#F0B943` |

### 2.6 CSS tokens (starter)
```css
:root {
  --brand-green-900:#1F4D3A; --brand-green-700:#2E6B4F; --brand-green-100:#E4EFE8;
  --brand-gold-500:#E0A526;  --brand-gold-700:#8A5A00;
  --brand-cream-50:#FBF7EE;  --brand-cream-200:#F3EAD6;
  --brand-soil-700:#6B4A33;
  --ink-900:#1E1C19; --ink-600:#5A554D; --line:#E2D9C6;
  --success:#2F7D4A; --warning:#B7791F; --error:#B42318; --info:#2B5C8A;
  --radius-sm:8px; --radius-md:14px; --radius-lg:24px; --radius-pill:999px;
  --shadow-sm:0 1px 2px rgba(30,28,25,.06);
  --shadow-md:0 6px 20px rgba(31,77,58,.10);
}
```

---

## 3. Typography

All fonts are on Google Fonts. Self-host them with `next/font` for performance.

| Role | Font | Weights | Why |
|---|---|---|---|
| **Display / Headings (Latin)** | **Fraunces** (variable, soft serif) | 500, 600, 700 | Warm, heritage, "handcrafted" feel without looking old |
| **Body / UI (Latin)** | **Inter** (variable) | 400, 500, 600 | Very legible on small Android screens, neutral |
| **Headings (Devanagari)** | **Tiro Devanagari Hindi** | 400 | Pairs with Fraunces' literary tone |
| **Body (Devanagari)** | **Noto Sans Devanagari** | 400, 500, 600 | Matches Inter's metrics, full Hindi support |

### Type scale (fluid, mobile → desktop)
| Token | Size | Line-height | Font / weight | Use |
|---|---|---|---|---|
| `display` | 40 → 64 px | 1.05 | Fraunces 600 | Hero headline |
| `h1` | 32 → 48 px | 1.1 | Fraunces 600 | Page titles |
| `h2` | 26 → 36 px | 1.2 | Fraunces 600 | Section titles |
| `h3` | 20 → 24 px | 1.3 | Fraunces 500 | Card titles |
| `h4` | 18 px | 1.4 | Inter 600 | Sub-heads |
| `body-lg` | 18 px | 1.6 | Inter 400 | Intro paragraphs |
| `body` | 16 px | 1.6 | Inter 400 | Default (never smaller on mobile) |
| `small` | 14 px | 1.5 | Inter 400 | Captions, meta |
| `overline` | 12–13 px, +8 % tracking, UPPERCASE | 1.4 | Inter 600 | Eyebrows ("FROM OUR FARM") |
| `price` | 20–28 px | 1.2 | Inter 600, tabular numbers | ₹ prices |

**Rules:** at most 2 font families per language · headings in sentence case · body line length 60–75 characters · always format prices as `₹3,500` (Indian digit grouping: `₹1,00,000`).

---

## 4. Layout & grid

| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Breakpoint | < 640 px | 640–1024 px | > 1024 px (max content 1200 px, wide 1400 px) |
| Columns | 4 | 8 | 12 |
| Gutter | 16 px | 24 px | 32 px |
| Side margin | 16 px | 32 px | auto |
| Section spacing | 56 px | 80 px | 112 px |

8-point spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

---

## 5. UI components (style rules)

| Component | Spec |
|---|---|
| **Primary button** | Field Green background, Fresh Milk text, radius-pill, 48 px min height, Inter 600 16 px. Hover: Pasture Green |
| **Accent button** | Golden Ghee background, Ink text. Used once per view (e.g. "Start Free Trial") |
| **Secondary button** | Transparent, 1.5 px Field Green border, green text |
| **WhatsApp button** | WhatsApp green `#25D366` with white glyph. **Only** for the WhatsApp action (floating bottom-right on mobile) |
| **Cards** | Malai or white surface, radius-md, shadow-sm, 1 px Line border, image ratio 4:3 or 1:1 |
| **Inputs** | White, 1 px Line border, radius-sm, 48 px height, 2 px Field Green focus ring |
| **Badges** | Pill. "Bestseller" in Gold, "Coming soon" in Warning tint, "Farm fresh" in Mint Wash |
| **Ticker bar** | Field Green background, cream text, gold dot separator, pausable (accessibility), 36–40 px tall |
| **Icons** | Lucide (outlined, 1.75 px stroke, rounded caps) plus custom farm icons (cow, milk can, bilona/churner, kalash, tractor) in the same stroke style |

---

## 6. Photography & imagery

**Do:** real photos from Amrit's own farm, the actual cows (desi humps and faces), hands milking or churning, steel milk cans, morning light, brass/steel vessels, Haryana fields, real delivery staff, real customers.
**Don't:** stock photos of Holstein (black-and-white) cows, which instantly break trust for a desi brand. Also avoid over-saturated filters, AI-generated cows and Western-style farm imagery.

| Spec | Value |
|---|---|
| Colour grade | Warm, natural, slightly lifted shadows. Golden-hour preferred |
| Formats | AVIF / WebP via Next/Image, JPEG fallback |
| Hero | 2400 × 1350 max, < 250 KB after optimisation |
| Product | 1:1 on a Fresh Milk or white seamless background, plus 1 lifestyle shot and 1 farm-context shot |
| Alt text | Descriptive and keyword-natural: "Sahiwal cow grazing at Amrit Dairy farm, Garhi Brahmnan, Sonipat" |

**Illustration:** simple line illustrations in Field Green with Golden Ghee fills (cow, drop, kalash, sun, wheat). Use them for empty states, the "How it works" section and 404 pages.

**Motion:** subtle only. 200–300 ms ease-out fades or slides. A slow Ken Burns effect on the hero image is allowed. Respect `prefers-reduced-motion`.

---

## 7. Voice & microcopy

| Situation | ✅ Say | ❌ Don't say |
|---|---|---|
| Hero | "Milk from our 250 desi cows, at your door by 7 AM." | "India's #1 purest milk ever!!!" |
| Not serviceable | "We're not in your area yet. Leave your number and we'll WhatsApp you the day we arrive." | "Invalid pincode." |
| Coming soon | "Our dahi is setting. Get notified." | "Out of stock." |
| Error | "That didn't go through. Please try again, or WhatsApp us." | "Error 500." |
| Health | "Desi cow milk, the way our grandparents drank it." | "Cures diabetes / boosts immunity." |

---

## 8. Brand application checklist

- [ ] Favicon and PWA icons (192 / 512 px, maskable)
- [ ] OG / Twitter share images per template
- [ ] Email templates (Resend + React Email) using the same tokens and fonts, with web-safe fallback: Georgia / Arial
- [ ] WhatsApp Business profile photo, cover and catalogue images
- [ ] Packaging, delivery bags, van wraps (offline, for later)
