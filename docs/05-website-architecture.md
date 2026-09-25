# 05 · Website Architecture — Amrit Dairy E-commerce Store

> Sitemap, URL structure, navigation, and section-by-section blueprints for every template of the **amritdairy.in online store**.
> Covers the requested pages (**Home · About · Product Details · Departments + Details · Facilities + Details · Resources/Blogs · Ticker · Contact · Legal**) plus the full commerce flow (**Shop → Product → Cart → Checkout → Order → Account**), subscriptions, the Desi Cows content, and the Shopify redirect map.

---

## 1. Sitemap

```
amritdairy.in                       (English)   ·   amritdairy.in/hi/...  (हिंदी mirror)
│
├── /  ................................................. Home (storefront)
│
├── SHOP ─────────────────────────────────────────────────────────────────────
├── /shop .............................................. All products
│   ├── /shop/dairy ..................................... Milk, Curd (Matka Dahi), Buttermilk, Paneer, Butter, Cream
│   ├── /shop/ghee ...................................... Desi Cow Golden Ghee (1 kg jar · 5/10 kg kettle)
│   ├── /shop/achar ..................................... Achar Collection (11 SKUs)
│   ├── /shop/pantry .................................... Organic Honey, Pure Sarso Oil
│   ├── /shop/combos-gifts .............................. Bundles, festive hampers   (new)
│   └── /shop/subscriptions ............................. Subscribable products
├── /products/{slug} ................................... PRODUCT DETAILS
│     e.g. /products/desi-cow-golden-ghee, /products/desi-cow-milk,
│          /products/matka-dahi, /products/ker-sangri-achar
├── /subscribe ......................................... Milk subscription builder
├── /bulk-orders ....................................... 5/10 kg ghee kettles, B2B, weddings
├── /cart .............................................. Cart page (+ drawer everywhere)
├── /checkout .......................................... 3-step checkout
├── /order/{orderId}/thank-you ......................... Order confirmation
├── /track-order ....................................... Track by order no. + phone
├── /account ........................................... Customer dashboard
│   ├── /account/orders · /orders/{id}
│   ├── /account/subscriptions · /wallet
│   ├── /account/addresses · /notify-list · /reviews · /referrals · /profile
├── /login ............................................. OTP / magic link
│
├── FARM & BRAND ─────────────────────────────────────────────────────────────
├── /about ............................................. About Amrit Dairy
│   ├── /about/facts .................................... Citable facts page (GEO)
│   ├── /about/quality .................................. Quality promise + lab reports
│   └── /about/team
├── /farm-story ........................................ Our Farm (journey: Farm → Cows → Milking → QC → Packaging → Home)
├── /desi-cows ......................................... Desi Cow breeds hub (18 breeds)
│   └── /desi-cows/{breed} .............................. gir · sahiwal · tharparkar · rathi · kankrej · …
├── /cows-for-sale ..................................... Cow Buy/Sell listings + enquiry (no cart)
│   └── /cows-for-sale/{id}
├── /departments ....................................... All departments
│   └── /departments/{slug} ............................. DEPARTMENT DETAILS
│         gaushala-herd-care · milking-collection · bilona-ghee-unit · achar-kitchen ·
│         quality-lab · packaging-dispatch · delivery-logistics · customer-care
├── /facilities ........................................ All facilities
│   └── /facilities/{slug} .............................. FACILITY DETAILS
│         desi-cow-farm-rajhbhaya · cow-shelters · milking-area · chilling-unit ·
│         bilona-ghee-kitchen · achar-kitchen · quality-lab · packing-dispatch-centre · fodder-fields
│
├── DELIVERY (local SEO) ─────────────────────────────────────────────────────
├── /delivery .......................................... Delivery areas hub + pincode checker
│   ├── /delivery/sonipat ............................... City hub
│   │   └── /delivery/sonipat/{locality} ................ sector-23 · garhi-brahmnan · mayur-vihar · devilal-colony
│   ├── /delivery/{city} ................................ Stage 2–3 cities as they launch
│   └── /delivery/shipping-india ........................ Pan-India shipping info (ghee, achar, honey, oil)
│
├── RESOURCES ────────────────────────────────────────────────────────────────
├── /resources ......................................... Resources hub
│   ├── /blog ........................................... Blog listing
│   │   ├── /blog/category/{slug}
│   │   └── /blog/{slug} ................................ BLOG DETAILS
│   ├── /resources/guides/{slug} ........................ e.g. "How to check pure ghee at home"
│   ├── /resources/recipes/{slug} ....................... Recipes using Amrit products
│   ├── /resources/lab-reports
│   ├── /resources/faqs
│   └── /resources/glossary
├── /news .............................................. Ticker archive / announcements
│   └── /news/{slug}
│
├── HELP ─────────────────────────────────────────────────────────────────────
├── /contact
├── /how-it-works ...................................... Ordering, delivery, payment, subscriptions
├── /careers · /partner-with-us ........................ (Phase 4+)
│
├── LEGAL ────────────────────────────────────────────────────────────────────
├── /legal/privacy-policy
├── /legal/terms-of-service
├── /legal/refund-policy ............................... Returns, refunds, cancellations
├── /legal/shipping-policy ............................. Local delivery + pan-India shipping
├── /legal/subscription-terms .......................... Wallet, pause/skip, cut-offs
├── /legal/cookie-policy
├── /legal/disclaimer
└── /legal/grievance-redressal ......................... E-Commerce Rules 2020 grievance officer

System: /search · /404 · /500 · /sitemap.xml · /robots.txt · /llms.txt · /feeds/google.xml · /manifest.webmanifest
```

## 2. URL rules
- English, lowercase, hyphenated slugs, shared by `/hi/` pages so they stay stable (`/hi/products/desi-cow-golden-ghee`).
- Products live at `/products/{slug}` (not under the collection), so there is one canonical URL per product.
- Variants: `?variant=5kg-steel-kettle`, with the canonical pointing to the product URL.
- Filter URLs (`/shop/achar?sort=price`) are `noindex,follow`. Only clean collection URLs are indexed.
- Transactional URLs (`/cart`, `/checkout`, `/account/*`, `/order/*`, `/login`) are `noindex` and uncached.
- Changing a slug creates a 301 automatically.

## 3. Shopify → new site redirect map (301)

| Old (Shopify) | New |
|---|---|
| `/collections/all` | `/shop` |
| `/collections/{handle}` | `/shop/{collection}` |
| `/products/{handle}` | `/products/{slug}` (keep the same handle as the slug where possible) |
| `/collections/{c}/products/{handle}` | `/products/{slug}` |
| `/pages/contact` | `/contact` |
| `/pages/{farm-story handle}` | `/farm-story` |
| `/pages/{desi-cows handle}` | `/desi-cows` |
| `/pages/{order page handle}` | `/shop` (or `/subscribe`) |
| `/policies/privacy-policy` | `/legal/privacy-policy` |
| `/policies/refund-policy` | `/legal/refund-policy` |
| `/policies/terms-of-service` | `/legal/terms-of-service` |
| `/policies/shipping-policy` | `/legal/shipping-policy` |
| `/blogs/{blog}/{article}` | `/blog/{slug}` |
| `/search?q=` | `/search?q=` |
| `/cart` · `/account` | `/cart` · `/account` |

🟡 Export the full URL list from Shopify (Online Store → Navigation, the sitemap, and Google Search Console) before building the map.

## 4. Navigation

### 4.1 Desktop header (keeps the live site's signature rounded green bar)
```
[Ticker ─ "🟢 Now delivering in Mayur Vihar • Diwali ghee hampers are live • Free delivery above ₹999 in Sonipat" ⏸]
╭──────────────────────────────────────────────────────────────────────────────────────────────╮
│ ☰  Shop ▾   Ghee   Desi Cows ▾           ( Amrit mascot badge )      Farm Story ▾  Contact │
│                                                           🔍  EN|हिं  📍 Sector 23 ✓  👤  🛒 2 │
╰──────────────────────────────────────────────────────────────────────────────────────────────╯
```
| Menu | Mega-menu content |
|---|---|
| **Shop** | Dairy · Ghee · Achar Collection · Pantry · Combos & Gifts · Subscribe to Milk · Bulk Orders. Featured card: *Desi Cow Golden Ghee – ₹3,500* |
| **Ghee** | Direct link to the hero product (high intent) |
| **Desi Cows** | Our Breeds · Cows for Sale · Cow Enquiry (+91 80595 93666) |
| **Farm Story** | Our Farm · Departments · Facilities · Quality & Lab Reports · About · Facts |
| **Contact** | Contact · Track Order · How it works · FAQs |
| (Footer/secondary) | Resources: Blog, Guides, Recipes, News |

### 4.2 Mobile
- Top: ticker (1 line, fading) → compact green bar: ☰ · mascot logo · 🔍 · 🛒.
- Pincode chip under the header on shop and product pages.
- **Sticky bottom bar:** `Home · Shop · WhatsApp · Cart · Account` (app-like). On product pages it becomes `₹3,500 · [Add to cart]`.
- The hamburger opens a full-screen accordion with the language toggle.

### 4.3 Footer
| Col 1 | Col 2 | Col 3 | Col 4 |
|---|---|---|---|
| Emblem logo · "Our cows are our own." · Purity • Trust • Nourishment · address · socials | **Shop:** Dairy, Ghee, Achar, Pantry, Combos, Subscribe, Bulk | **Farm & help:** Farm Story, Desi Cows, Departments, Facilities, Blog, Track Order, Contact, FAQs | **Contact & Registered details:** Orders/WhatsApp +91 77000 04877 · Cow Enquiry +91 80595 93666 · contact@amritdairy.in · GSTIN 06CKFPC6104C1ZW · FSSAI 10826020000285 · Udyam UDYAM-HR-18-0074290 |

Bottom row: delivery area links · payment icons (UPI, Visa, Mastercard, RuPay) · newsletter · legal links · © Amrit Dairy.

## 5. Page blueprints

Top → bottom. **[CMS]** means editable blocks in Payload.

### 5.1 Home `/` (storefront)
| # | Section | Content | Goal |
|---|---|---|---|
| 0 | Ticker | Active announcements [CMS] | Freshness |
| 1 | **Hero slider** | Slide 1: "हर घर अमृत, हर घर शुद्धता" + Bilona ghee packshot, ₹3,500/kg, **Add to cart** + **Shop all**. Slide 2: "Your milk. Every morning." → Subscribe. Slide 3: Achar collection | Sell the hero product immediately |
| 2 | Trust strip | Our own 250 desi cows · Bilona hand-made · Glass & clay packing · Secure UPI checkout | Credibility |
| 3 | **Shop by category** tiles | Dairy · Ghee · Achar Collection · Pantry · Combos · (Desi Cows enquiry) | Navigation |
| 4 | **Bestsellers** carousel | Ghee, Honey, + top achars (Add-to-cart on each card) | Conversion |
| 5 | Subscription band | "Your milk. Every morning. Without remembering to order." 3 steps + **Start my milk subscription** + pincode check | Subscriptions |
| 6 | Farm story split | Real farm photo/video · "Meet the cows behind your milk" · breeds strip (Gir, Sahiwal, Tharparkar, Rathi, Kankrej) | Differentiation |
| 7 | How Bilona ghee is made | 6-step visual (Milk → Dahi → Churn → Makkhan → Slow-cook → Ghee) → link to product | Justify the premium |
| 8 | Combos / festive | Gift hampers, "Ghee + 2 Achar" | Increase average order value |
| 9 | Why families choose Amrit | 6 cards (Own cows, Farm to home, Fresh every day, Authentic, Know your source, Local delivery) | Objection handling |
| 10 | Reviews | **Real** verified reviews with locality and photos (hidden until ≥ 3) | Social proof |
| 11 | Delivery areas | Map + pincode checker + "Ghee & achar ship all over India" | Serviceability |
| 12 | From the blog | 3 posts | SEO |
| 13 | FAQ | Where does the milk come from? Are the cows owned by Amrit? Can I pause/skip? Payment methods? Areas served? Storing milk and ghee? Shipping outside Sonipat? | AEO |
| 14 | WhatsApp band | "Prefer to order on WhatsApp or by phone?" (keep from the current site) | Fallback |

### 5.2 Shop / Collection `/shop`, `/shop/{collection}`
Breadcrumb → H1 + 2-line intro (SEO) → collection chips → filter bar (Availability, Price, "Delivered in Sonipat / Ships India") + sort + result count → **product grid** (2/3/4 columns) → "Can't find it? WhatsApp us" card → collection FAQ → SEO copy block (collapsed "Read more").
Card states: **In stock** (Add → stepper) · **Coming soon** (Notify me, no price) · **Out of stock** (Notify me) · **On demand** (Request quote) · **Not deliverable to your pincode** (fresh items: "Not in your area yet").

### 5.3 Product Details `/products/{slug}`
| # | Section |
|---|---|
| 1 | Breadcrumb |
| 2 | **Buy box.** Left: gallery (packshot, texture, in-use, farm/process, video). Right: badge (Bestseller), H1 (EN + हिंदी line), rating, **price block** (₹, MRP, % off, "incl. of all taxes", unit price), **variant pills** (1 kg Glass Jar / 5 kg Steel Kettle / 10 kg Steel Kettle – on demand), qty stepper, **pincode delivery check**, CTAs **Add to cart** (gold) / **Buy now** / **Subscribe & save** (subscribable items) / **Order on WhatsApp**, trust icons, "Free delivery above ₹X" |
| 3 | Key highlights (4 icon bullets: Desi cow milk · Bilona hand-churned · Glass jar · No additives) |
| 4 | **How it's made** (HowTo steps with photos) |
| 5 | Details tabs/accordion: Description · Ingredients · Nutrition (per 100 g) · Shelf life & storage · **Legal Metrology info** (net qty, MRP, manufacturer/packer, FSSAI, country of origin) · Shipping & returns |
| 6 | Lab report for the current batch (PDF) |
| 7 | **Frequently bought together** (Ghee + Achar + Honey bundle with "Add all") |
| 8 | Reviews (distribution, photos, verified) + Write a review |
| 9 | Product FAQs |
| 10 | "From our farm" mini-story + breed link |
| 11 | Related products |
| 12 | Mobile sticky buy bar |

Variants for **Cow listings** (`/cows-for-sale/{id}`) reuse the gallery and details layout, but the buy box becomes **Enquire / Call +91 80595 93666 / WhatsApp**, with no price or cart.

### 5.4 Cart (drawer + `/cart`)
Line items (image, name, variant, stepper, remove, line price) → **split notice** if the cart mixes fresh and shipped items ("Your order will arrive in 2 parts") → free-delivery progress bar → cross-sell row → coupon field → price summary (subtotal, delivery, discount, total, GST included) → **Checkout** (gold) → "Order on WhatsApp instead" link → trust row (secure payment, refund promise).

### 5.5 Checkout `/checkout` (3 steps, one page on desktop, stepper on mobile)
1. **Contact & address**: phone (primary, for delivery), email (for invoice), name, address, pincode (validated against serviceability per item), landmark, address type; "Save for next time" (creates an account after payment).
2. **Delivery**: fresh items get a date + slot picker (respecting the cut-off, e.g. order by 9 PM for tomorrow 6–8 AM); shipped items show method and ETA; gift message option.
3. **Payment**: order summary; coupon; **Razorpay** (UPI first, cards, netbanking, wallets); T&C consent; **Pay ₹X**.
→ `/order/{id}/thank-you`: success animation (mascot), order number, what happens next, delivery or ETA, **Share on WhatsApp**, create-account prompt (guests), recommended products.
Error states: payment failed (retry / other method / WhatsApp), pincode not serviceable for an item (remove, or switch to shipped), out of stock during checkout.

### 5.6 Account `/account`
Dashboard cards: next delivery (subscribers) · wallet balance + top-up · recent orders (reorder, invoice, track) · notify-me list · referral code. Sub-pages: Orders · Subscriptions (calendar: pause/skip/change, cut-off banner) · Wallet (ledger) · Addresses · Reviews · Profile & privacy (download or delete data).

### 5.7 Subscribe `/subscribe`
Stepper: pincode → product & qty (0.5 L steps, price per day) → frequency (Daily / Alternate / Custom days) → slot & start date → login (OTP) → wallet top-up via Razorpay → success. A side panel shows the monthly estimate.

### 5.8 About `/about` (+ `/about/facts`)
Hero (founder + cows, "Our cows are our own.") → our story timeline → values (Purity • Trust • Nourishment) → the farm in numbers (250 cows, 5 breeds on the farm, 4 areas…) → team → registered details (GSTIN, FSSAI, Udyam) → CTA Shop + Visit farm.
**`/about/facts`**: plain, dated key-value facts for AI and press (no adjectives).

### 5.9 Farm Story `/farm-story`
Keep the live copy ("It starts with our cows…", "These aren't anonymous suppliers. These are our cows.") and add real media: journey timeline **Farm → Cows → Milking → Quality Check → Packaging → Your Home** (one photo and caption per step) → Bilona section → breeds on the farm → video walkthrough → CTA Shop / Cow enquiry.

### 5.10 Desi Cows `/desi-cows` and `/desi-cows/{breed}`
Hub: intro (native breeds; "not every breed shown is on our farm every season") → filter chips "On our farm" / "All breeds" → **breed grid (18)** → cow enquiry band.
Breed details: photo gallery, origin state, identification traits, typical milk yield, temperament, "At Amrit Dairy" (count, if on the farm), related products (ghee), FAQ, enquiry CTA.

### 5.11 Departments `/departments` and Department Details `/departments/{slug}`
**Listing:** hero "The people behind every jar" → cards (icon, name, purpose, head, team size) → flow diagram cow → customer across departments → careers CTA.
**Details:** hero (name, purpose, team photo) → what we do → head of department (photo, credentials, quote) → standards/SOPs (e.g. Herd care: vet schedule, fodder, no hormones 🟡) → key numbers → facilities managed (links) → related products → FAQ → contact / open roles.
Suggested: Gaushala & Herd Care · Milking & Collection · Bilona Ghee Unit · Achar Kitchen · Quality Lab · Packaging & Dispatch · Delivery & Logistics · Customer Care. 🟡 Confirm the list with the owner.

### 5.12 Facilities `/facilities` and Facility Details `/facilities/{slug}`
**Listing:** aerial farm hero → illustrated farm map with hotspots → facility cards → "Book a farm visit" CTA.
**Details:** hero image/video → overview → specs (capacity, temperature, batch size 🟡) → process steps → hygiene & safety (FSSAI practices) → gallery / 360° → managed-by department → products made here (e.g. Bilona Ghee Kitchen → Ghee) → visit info → FAQ.

### 5.13 Delivery areas `/delivery/...`
Hub: pincode checker → map (live = green, coming soon = gold) → areas list → "Ships across India" block for ghee/achar → waitlist.
Locality page: H1 "Desi cow milk & ghee delivery in {Locality}, Sonipat" → status + slot + minimum order → distance from the farm → products available → local reviews → landmarks covered → neighbouring areas → FAQ. **Unique copy per page.**

### 5.14 Resources `/resources` · Blog `/blog` · Blog Details `/blog/{slug}`
Hub: search → featured guide → tiles (Blog, Guides, Recipes, Lab Reports, FAQs, Glossary).
Blog listing: category tabs (Ghee & Bilona, Desi Cows, Health & Nutrition, Recipes, Farm Life, News) → featured → grid → pagination.
Blog details: breadcrumb · category · H1 · author (credentials) · dates · read time → **TL;DR** → table of contents → question-led body with **inline product cards** (shoppable) → key takeaways → FAQ → sources → author bio → related posts + "Shop the story" products → share (WhatsApp first).

### 5.15 Ticker & News
- **Ticker** (global, top): `Ticker` items with text EN/HI (≤ 90 chars), link, type (offer / new area / launch / event / notice), start/end, priority, optional target areas.
- Behaviour: desktop marquee pauses on hover/focus with a ⏸ button; mobile shows one item at a time (5 s fade); reduced-motion shows a static item; hidden when empty.
- `/news`: archive of announcements with detail pages (`NewsArticle` schema).

### 5.16 Contact `/contact`
Hero "We're a WhatsApp away" → contact cards: **Orders/General +91 77000 04877 (WhatsApp & Call)** · **Cow Buy/Sell +91 80595 93666** · **contact@amritdairy.in** · **Farm address + Get directions (Google Maps)** → contact form (labelled fields; subject: Order issue / Subscription / Bulk / Cow enquiry / Feedback / Other; order number field) → business hours → Track your order box → FAQ → grievance officer card → registered details.

### 5.17 Legal `/legal/*`
Readable template: H1 · effective date + last updated · table of contents · content · contact for questions. Pages: Privacy (DPDP 2023) · Terms · Refund/Returns/Cancellation · Shipping & Delivery · Subscription & Wallet terms · Cookies · Disclaimer (no health claims) · Grievance Redressal (name, contact, response SLA).

## 6. Template ↔ data ↔ rendering

| Template | Payload source | Rendering / cache |
|---|---|---|
| Home, About, Farm Story, static pages | `Pages` (blocks) | SSG + on-demand revalidate |
| Shop / collection | `ProductCollections`, `Products` | ISR (revalidate on product change) |
| Product details | `Products`, `Variants`, `Reviews` | ISR; stock/price re-fetched on the client for freshness |
| Cart, checkout, account, order | `Carts`, `Orders`, `Customers`, `Subscriptions` | Dynamic, no cache, `noindex` |
| Desi Cows / breed, Cows for sale | `Breeds`, `Cows` | ISR |
| Departments / Facilities | `Departments`, `Facilities` | ISR |
| Delivery areas | `ServiceAreas` | ISR |
| Blog / resources / news | `Posts`, `Resources`, `Ticker` | ISR |
| Legal | `LegalPages` | SSG |

## 7. Internal linking (commerce + SEO loop)
Home → Collection → Product → (How it's made → Facility → Department) → back to Product.
Blog post → shoppable product cards → Product. Breed page → Ghee product. Area page → local products → Product.
Footer links every live delivery area and every collection. Each product links to 1 blog guide and 1 breed or farm page.

## 8. SEO title templates (defaults, editable)
| Template | Title | H1 |
|---|---|---|
| Home | Desi Cow Bilona Ghee, Milk & Achar · Amrit Dairy Sonipat | हर घर अमृत, हर घर शुद्धता |
| Collection | {Collection} Online · Farm-Made in Sonipat · Amrit Dairy | {Collection} |
| Product | {Product} {Size} · Buy Online · Amrit Dairy | {Product} |
| Breed | {Breed} Cow: Origin, Traits & Milk · Amrit Dairy | {Breed} cow |
| Area | Milk & Ghee Delivery in {Locality}, Sonipat · Amrit Dairy | Desi cow milk delivery in {Locality} |
| Blog | {Title} · Amrit Dairy | {Title} |
| Department / Facility | {Name} · Amrit Dairy Farm, Sonipat | {Name} |
