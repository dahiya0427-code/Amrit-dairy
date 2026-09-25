# 03 · Brand Guidelines — Amrit Dairy (Digital / E-commerce)

> Visual and verbal rules for the **Amrit Dairy online store** and all digital touchpoints.
> **Approach: evolve, don't replace.** The current amritdairy.in already has a clear identity: deep forest green, ghee gold, warm cream, a child mascot and bilingual Hindi-English copy. These guidelines **keep that equity**, systemise it and make it accessible and ready for commerce.
> **Design concept: "Ghar ka Amrit" (Farm Morning).** Warm cream like fresh milk, deep green like the farm, and gold like Bilona ghee. It should look premium and trustworthy, and feel like family.

---

## 1. Logo system

The live site uses **two marks**. Formalise them as one system:

| Asset | What it is today | Role going forward |
|---|---|---|
| **Primary logo: "AMRIT DAIRY" gold emblem** | Gold serif wordmark with a drop/kalash flame mark above it (footer and packaging) | **Master brand mark** for the header on light backgrounds, footer, invoices, emails, favicon (the drop mark on its own), OG images |
| **Brand badge: "Amrit" child-mascot roundel** | Circle with the child mascot, blue/white, gold ring (header centre) | **Brand character, "Amrit Baby"**, used on packaging, the hero, empty states, loaders, the 404 page and social media. It is not the only logo, because it doesn't scale well to small sizes |

| Rule | Spec |
|---|---|
| Versions | Full colour (gold on cream) · Reversed (gold/cream on Forest Green) · One-colour Forest Green · One-colour white · Favicon (drop mark) |
| Clear space | At least the height of the drop mark on every side |
| Minimum size | Emblem 96 px wide · drop mark 20 px · mascot badge 56 px |
| Don'ts | Don't stretch, recolour outside the palette, add drop shadows, place on busy photos without a scrim, or redraw the mascot differently per page |
| Files needed | SVG (vector master) for both marks, PNG @1x/@2x, favicon.ico + 32 px + 180 px apple-touch + 192/512 px maskable PWA icons, default OG image 1200×630 |

🟡 *Get the vector (SVG/AI) source files from the packaging designer. The current web logo looks like a raster image.*

---

## 2. Color palette

Colours sampled from the live site and packaging, then tuned for WCAG 2.2 AA.

### 2.1 Core brand colours
| Token | Name | HEX | Use |
|---|---|---|---|
| `--green-900` | **Amrit Forest** (Primary) | `#24401D` | Header, footer, primary buttons, headings on cream |
| `--green-950` | Forest Deep | `#1F3419` | Header shadow / gradient end, pressed state |
| `--green-800` | Farm Band | `#32502C` | Full-width feature bands ("Your milk. Every morning."), trust strip |
| `--green-600` | Leaf | `#3D6B30` | Links, secondary buttons, success text (6.2 : 1 on cream) |
| `--green-500` | Fresh Leaf | `#4A7D3B` | Icons, large-text buttons only (4.8 : 1) |
| `--green-50` | Mint Wash | `#EAF1E4` | Tinted section backgrounds, "In stock" chip |
| `--gold-500` | **Ghee Gold** (Accent) | `#E7A93A` | Main CTA buttons (with **dark text**), badges, stars, highlights on green |
| `--gold-700` | Ghee Deep | `#8A5A00` | Gold as *text* on cream (prices on sale, "Coming soon" label) |
| `--gold-100` | Butter | `#FBEBC7` | Offer banners, coupon chips |
| `--cream-50` | **Fresh Milk** (Base) | `#FFFDF7` | Page background |
| `--cream-200` | Malai | `#F6EFDD` | Product cards, alternating sections |
| `--clay-600` | **Matka Terracotta** | `#A4452A` | "Bestseller" badge, sale price highlight, festive accents (taken from the matka dahi and the ghee label's red border) |
| `--ink-900` | Ink | `#1E1C19` | Body text |
| `--ink-600` | Muted Ink | `#5A554D` | Secondary text, captions, strikethrough MRP |
| `--line` | Line | `#E6DCC6` | Borders, dividers, input outlines |
| `--white` | White | `#FFFFFF` | Inputs, product image wells |

### 2.2 Functional colours
| Token | HEX | Use |
|---|---|---|
| `--success` | `#2F7D4A` | "Delivers to your area ✓", order placed, in stock |
| `--warning` | `#B7791F` | Low stock, "Coming soon", wallet low |
| `--error` | `#B3261E` | Form errors, payment failed, "Not serviceable yet" |
| `--info` | `#2B5C8A` | Ticker notices, order-tracking info |
| WhatsApp | `#25D366` | **Only** for WhatsApp buttons |

### 2.3 Ratio
**60 %** Fresh Milk / Malai · **30 %** Amrit Forest · **10 %** Ghee Gold (+ a touch of Matka Terracotta for badges).

### 2.4 Contrast (WCAG 2.x, computed)
| Pair | Ratio | Allowed for |
|---|---|---|
| Ink on Fresh Milk | 16.7 : 1 | All text |
| Amrit Forest on Fresh Milk | 11.3 : 1 | All text, buttons |
| Amrit Forest on Malai card | 10.0 : 1 | All text |
| Muted Ink on Fresh Milk / Malai | 7.3 / 6.4 : 1 | Secondary text |
| Leaf `#3D6B30` on Fresh Milk | 6.2 : 1 | Links, text |
| Fresh Leaf `#4A7D3B` on Fresh Milk | 4.8 : 1 | Text ≥ 16 px (AA), icons |
| Ghee Deep on Fresh Milk | 5.8 : 1 | Gold-toned text |
| **Ink on Ghee Gold (CTA)** | **8.2 : 1** | ✅ Gold buttons always use dark text |
| Ghee Gold on Amrit Forest | 5.6 : 1 | Gold text/icons on the green header or footer |
| Ghee Gold on Farm Band | 4.4 : 1 | Large text only |
| White on Matka Terracotta | 6.1 : 1 | Badges |
| Ghee Gold on Fresh Milk | 2.0 : 1 | ❌ Decorative only, never text |

> ⚠️ The live site puts cream text on gold buttons (e.g. "Order Page", "Start My Milk Subscription"). That fails contrast. In the new site, gold buttons use **Ink or Forest text**.

### 2.5 CSS tokens (starter)
```css
:root{
  --green-950:#1F3419; --green-900:#24401D; --green-800:#32502C; --green-600:#3D6B30; --green-500:#4A7D3B; --green-50:#EAF1E4;
  --gold-500:#E7A93A; --gold-700:#8A5A00; --gold-100:#FBEBC7;
  --cream-50:#FFFDF7; --cream-200:#F6EFDD; --clay-600:#A4452A;
  --ink-900:#1E1C19; --ink-600:#5A554D; --line:#E6DCC6; --white:#FFFFFF;
  --success:#2F7D4A; --warning:#B7791F; --error:#B3261E; --info:#2B5C8A; --whatsapp:#25D366;
  --radius-sm:8px; --radius-md:16px; --radius-lg:24px; --radius-pill:999px;
  --shadow-sm:0 1px 2px rgba(30,28,25,.06);
  --shadow-md:0 8px 24px rgba(36,64,29,.10);
  --shadow-lg:0 16px 40px rgba(36,64,29,.14);
}
```

### 2.6 Dark mode
Not needed at launch. A food store stays warm and light. Revisit after launch.

---

## 3. Typography

The store is **bilingual (English + हिंदी)**, so every font choice must cover both scripts cleanly.

| Role | Font (Google Fonts) | Weights | Why |
|---|---|---|---|
| **Display / Headings, Latin** | **Fraunces** (variable soft serif) | 500–700 | Warm, heritage feel. It echoes the serif "Amrit" wordmark on the packs |
| **Display / Headings, Devanagari** | **Noto Serif Devanagari** (variable) | 600–800 | Bold, traditional Hindi headlines like "हर घर अमृत, हर घर शुद्धता" |
| **Body & UI, Latin + Devanagari** | **Mukta** | 400, 500, 600, 700 | **One family covers both scripts** with matched metrics, so mixed lines ("Order करें") look even. Very legible on small Android screens |
| Numbers / prices | Mukta 600 with tabular numerals | — | ₹ prices line up in the cart and invoice |

> The current Shopify theme uses a generic sans (Assistant). Switching to Mukta keeps a similar look but improves the Hindi.

### Type scale (fluid mobile → desktop)
| Token | Size | Line height | Font / weight | Use |
|---|---|---|---|---|
| `display` | 36 → 60 px | 1.1 | Fraunces 600 / Noto Serif Dev 700 | Hero |
| `h1` | 30 → 44 px | 1.15 | Fraunces 600 | Page title, product name |
| `h2` | 24 → 34 px | 1.2 | Fraunces 600 | Section title |
| `h3` | 19 → 22 px | 1.3 | Mukta 600 | Card titles |
| `body-lg` | 18 px | 1.6 | Mukta 400 | Intros |
| `body` | 16 px | 1.65 | Mukta 400 | Default (Devanagari needs extra line height) |
| `small` | 14 px | 1.5 | Mukta 400 | Meta, captions |
| `overline` | 12–13 px, +8 % tracking, UPPERCASE | 1.4 | Mukta 600 | "OUR FARM · SONIPAT, HARYANA" |
| `price-lg` | 24–30 px | 1.2 | Mukta 700 | Product page price |
| `price` | 16–18 px | 1.2 | Mukta 600 | Card price |

**Rules:** English headings in sentence case (the live site uses Title Case; move away from it gradually) · ≤ 2 families per script · body never below 16 px on mobile · Indian number format `₹3,500`, `₹1,00,000` · write "₹", not "Rs." · Hindi text must never be set in a Latin-only font (no fallback boxes).

---

## 4. Layout & grid
| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Breakpoint | < 640 px | 640–1024 px | > 1024 px (content max 1240 px) |
| Columns | 4 | 8 | 12 |
| Gutter / side margin | 16 / 16 px | 24 / 32 px | 32 px / auto |
| Section spacing | 48 px | 72 px | 104 px |
| Product grid | **2 columns** | 3 | 4 |

8-point spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.

---

## 5. Components

### 5.1 Core
| Component | Spec |
|---|---|
| **Primary button** | Amrit Forest background, Fresh Milk text, pill, 48 px min height, Mukta 600 16 px; hover Farm Band; focus ring 3 px gold |
| **Accent / Buy button** | Ghee Gold background, **Ink text**; hover `#D99A2B`. At most one per viewport (e.g. "Add to cart", "Start subscription") |
| **Secondary button** | 1.5 px Forest border, Forest text, transparent |
| **WhatsApp button** | `#25D366` background with white glyph. Floating bottom-right on desktop; part of the sticky bar on mobile |
| **Header** | Keep the live site's signature **rounded "pill" nav bar on Forest Green, with the mascot badge overlapping the centre**. Gold line icons with cream labels. Add a search icon, language toggle (EN / हिं), pincode chip, account and cart with a count badge |
| **Inputs** | White, 1 px Line border, radius-sm, 48 px, labels always visible (no placeholder-only labels as on the live contact form) |
| **Icons** | Lucide outline, 1.75 px stroke, plus custom line icons: cow with hump, glass milk bottle, matka, bilona churner, kalash/drop, achar jar, honey dipper, delivery scooter |

### 5.2 E-commerce components
| Component | Spec |
|---|---|
| **Product card** | Malai card, radius-md, 1:1 image on a cream well, badge top-left (Bestseller = Terracotta, New = Forest, Coming soon = Butter with Ghee Deep text), name (EN, with an optional Hindi line), pack size, price (+ struck-through MRP if on sale), rating stars, **"Add"** button (turns into a qty stepper `– 1 +` after adding). "Coming soon" cards show **"Notify me"** and **never show ₹0** |
| **Price block** | `₹3,500` (price-lg, Ink) · `₹3,800` MRP struck through (Muted Ink) · `8 % off` (Terracotta) · "Inclusive of all taxes" · unit price "₹350 / 100 g" |
| **Variant selector** | Pills: `1 kg Glass Jar` · `5 kg Steel Kettle` · `10 kg Steel Kettle (on demand)`. The selected pill is Forest with cream text. On-demand variants switch the CTA to "Request bulk order" |
| **Qty stepper** | 44 px buttons, min/max limits, `aria-live` count |
| **Pincode checker** | Input + "Check" button; results: ✅ "Delivers tomorrow 6–8 AM" (success) · 📦 "Ships in 3–5 days" (info) · 🕒 "Coming soon to your area – join waitlist" (warning) · ❌ "Not yet – we'll WhatsApp you" (error) |
| **Cart drawer** | Slides in from the right (full screen on mobile): line items with steppers, a free-shipping progress bar ("Add ₹250 for free delivery"), cross-sell row (achar/honey), coupon field, subtotal, "Checkout" (gold) + "Order on WhatsApp" (text link) |
| **Checkout stepper** | 3 steps: Contact & Address → Delivery slot / Shipping → Payment. Progress bar in Forest. Order summary card sticky on desktop and collapsible on mobile |
| **Trust row** | Icons with labels: Our own farm · Bilona hand-made · Glass packing · Secure UPI payment · FSSAI 10826020000285 |
| **Rating & reviews** | Gold stars, count, rating distribution bars, review cards with photo, locality and a "Verified buyer" tick |
| **Order status timeline** | Placed → Confirmed → Packed → Out for delivery / Shipped → Delivered; completed steps Forest, current step Gold |
| **Subscription calendar** | Delivered = Forest dot, Skipped = grey, Paused = Gold, Upcoming = outline |
| **Ticker bar** | Forest Deep background, cream text, gold dot separators, pause button, 36 px |
| **Toasts** | Bottom-centre on mobile: "Added to cart · View cart" |

---

## 6. Photography & imagery

**Packshots (existing):** the premium 3D-style pack renders (ghee jar, glass milk bottle, matka dahi, achar jars, honey) are strong. Keep them, and render **every SKU** in the same style on a **consistent cream `#F6EFDD` background, 1:1, product centred at about 80 % height**.

**Photos needed:** the real farm and the real cows (Gir, Sahiwal, Tharparkar, Rathi, Kankrej, with breed-correct photos), hands churning the bilona, ghee bubbling in a kadhai, glass bottles being filled, matka dahi setting, the delivery rider at a Sonipat doorstep, real families.
**Don't:** use Holstein/Jersey (black-and-white) cows, blurred placeholder banners (as in the current "Meet the Cows" section), stock Western farms, AI-generated cows, or heavy filters.

| Spec | Value |
|---|---|
| Colour grade | Warm, natural, golden hour |
| Formats | AVIF/WebP via Next/Image |
| Hero | 2400×1350 max, < 250 KB |
| Product gallery | Minimum 4 images: packshot · texture/close-up · in-use (food) · farm/process · (+ size-comparison / label back) |
| Alt text | Bilingual where the page is Hindi: "Amrit desi cow Bilona ghee in a 1 kg glass jar" |

**Mascot "Amrit Baby":** use it for warmth in heroes, empty cart ("Your cart is feeling hungry"), success screens and 404. Never distort it or use it to make health claims.

**Motion:** 200–300 ms ease-out; add-to-cart "fly to cart" micro-animation; respect `prefers-reduced-motion`.

---

## 7. Voice & microcopy (bilingual)

| Situation | ✅ Say | ❌ Don't |
|---|---|---|
| Hero | "हर घर अमृत, हर घर शुद्धता — Bilona ghee from our own desi cows." | "India's #1 purest ghee!!!" |
| CTA | "Add to cart / कार्ट में डालें" · "अभी ऑर्डर करें" | "Buy now or miss out!" |
| Coming soon | "Our matka dahi is setting. Get notified." | "Rs. 0.00 · Sold out" |
| Not serviceable | "We don't deliver fresh milk here yet, but ghee and achar ship across India." | "Invalid pincode." |
| Payment failed | "Payment didn't go through. No money was taken. Try again or pay on WhatsApp." | "Transaction error." |
| Social proof | "Loved by families in Sector 23, Mayur Vihar and Devilal Colony." (with real numbers) | "Trusted by 50,000+ families" (unverified) |
| Health | "Made the traditional Bilona way, from desi cow milk." | "Cures / boosts immunity / A2 is medicine" |

---

## 8. Brand application checklist
- [ ] SVG logo system + mascot sheet
- [ ] Favicon, PWA icons, OG image templates (product, blog, default)
- [ ] Packshot library for all 20 SKUs (consistent background)
- [ ] Email templates (Resend + React Email) using the same tokens; fallback fonts Georgia / Arial
- [ ] Invoice PDF template with GSTIN, FSSAI and logo
- [ ] WhatsApp catalogue images and message templates
- [ ] Shipping box / breakage-safe packing inserts for glass jars (offline)
