# 04 · Product Requirements Document (PRD) — Amrit Dairy E-commerce Website

| | |
|---|---|
| **Product** | amritdairy.in v2: a **D2C e-commerce store** (one-time orders + milk subscriptions + pan-India shipping) that is SEO, AEO and GEO optimised |
| **Replaces** | The current Shopify store + manual WhatsApp/Razorpay-link ordering |
| **Stack** | Node.js · **Next.js 15 (App Router, TypeScript)** · **Payload CMS 3** · **Neon Postgres** · **Resend** · **Vercel** · Razorpay (payments) |
| **Status** | Draft v2.0 · Sep 2026 |
| **Related docs** | 01 Brand Details · 02 Personas · 03 Brand Guidelines · 05 Architecture · 06 Stitch Prompts · 07 Execution Plan |

---

## 1. Background & problem

The current Shopify store (see Doc 01 §7) lists 20 products, but most show **₹0.00 / Sold out**. Several have no image, reviews are placeholders, and the farm imagery is blurred. Real orders happen **manually on WhatsApp**: the customer sends their details, pays with a Razorpay link or UPI, sends a screenshot or UTR, and waits for "ORDER CONFIRMED ✅". Delivery areas are checked by chatting. Subscriptions are promised ("Start My Milk Subscription") but not automated.

This caps growth at a few Sonipat localities. It also makes Amrit Dairy hard to find on Google and in AI answer engines.

**We are building our own e-commerce platform** so that Amrit Dairy:
1. sells and collects payment online without manual steps,
2. runs daily milk subscriptions with a prepaid wallet,
3. ships ghee, achar, honey and oil across India,
4. owns its content, data and SEO, with no platform lock-in, on a stack the team controls.

## 2. Goals & success metrics (12 months after launch)

| # | Goal | KPI | Target |
|---|---|---|---|
| G1 | Sell online | Share of orders placed and paid on the website (vs manual WhatsApp) | ≥ 70 % |
| G2 | Convert | Store conversion rate (sessions → orders) | ≥ 2.5 % (≥ 4 % for Sonipat traffic) |
| G3 | Grow basket | Average order value | +25 % vs the manual baseline (via combos and cross-sell) |
| G4 | Retain | Active milk subscriptions / 90-day repeat purchase rate | 🟡 set after Phase 3 baseline / ≥ 35 % |
| G5 | Own local search | Top-3 for "desi ghee Sonipat", "milk delivery Sonipat", "bilona ghee Sonipat" and served-area queries | 15+ keywords |
| G6 | Win national ghee search + AI answers | Page-1 rank for "bilona desi cow ghee online"; brand cited by ChatGPT / Gemini / Perplexity / AI Overviews for tracked prompts | ≥ 50 % of 20 tracked prompts |
| G7 | Performance | Core Web Vitals (field): LCP < 2.5 s, INP < 200 ms, CLS < 0.1 | 90 % of URLs "Good" |
| G8 | Accessibility | WCAG 2.2 AA; Lighthouse accessibility score | ≥ 95 |
| G9 | Operations | New area / product launched without developer help | < 1 day |

## 3. Scope

### In scope
- **Storefront:** catalogue, collections, search, product pages, cart, checkout, order tracking
- **Payments:** Razorpay (UPI-first), webhooks, refunds
- **Local delivery** (fresh products) with serviceability by pincode/locality and delivery slots
- **Pan-India shipping** (shelf-stable products) with courier integration
- **Subscriptions + prepaid wallet** (milk, buttermilk, curd)
- **Customer accounts** with OTP login, orders, subscriptions, wallet, addresses
- **Admin (Payload):** products, inventory, orders, fulfilment, subscriptions, delivery manifests, coupons, reviews, customers, content, SEO
- **Marketing:** coupons, combos/gift packs, referral, abandoned-cart emails, back-in-stock / "Notify me", newsletter
- **Content:** Farm Story, Desi Cows (breeds), departments, facilities, blog/resources, ticker/news, legal
- **Cow Buy/Sell enquiry** module (listings + lead form; no online payment)
- **Bilingual:** English + हिंदी
- **SEO / AEO / GEO**, Google Merchant Center feed
- **Shopify → new platform migration** (products, customers, URLs, redirects)

### Out of scope (for now)
- Native mobile apps (the PWA covers this)
- A rider app with route optimisation (Phase 5: third-party or custom)
- Marketplace sync (Amazon/Flipkart), handled outside the website in Stage 4

## 4. Users & roles

| Role | Access |
|---|---|
| Guest | Browse, check pincode, cart, **guest checkout** (shipped and one-time local orders) |
| Customer | OTP login (phone or email); orders, invoices, subscriptions, wallet, addresses, reviews, referrals |
| Delivery Staff | 🟡 Phase 4: mobile web view of today's manifest; mark delivered or failed |
| Store Manager | Products, prices, inventory, orders, fulfilment, refunds, subscriptions, coupons, service areas, reviews, leads |
| Content Editor | Blog, resources, ticker, FAQs, pages; cannot change prices or legal pages |
| Admin | Everything: users, roles, settings, payments config, legal pages, redirects |

## 5. Functional requirements

Priority: **P0** = required at launch · **P1** = launch or fast-follow · **P2** = later phase.

### 5.1 Catalogue & product
| ID | Requirement | P |
|---|---|---|
| CA-1 | `Products` with **variants**: e.g. Ghee → 1 kg Glass Jar / 5 kg Steel Kettle / 10 kg Steel Kettle; per-variant SKU, MRP, price, weight, dimensions, stock, barcode, images | P0 |
| CA-2 | **Fulfilment type** per product: `local_fresh` (serviceable areas only, slot delivery) · `ship_india` (courier) · `local_and_ship` · `on_demand` (quote/bulk request) · `enquiry_only` (cows) | P0 |
| CA-3 | Status: `active`, `coming_soon` (Notify-me, no price shown, still indexable), `out_of_stock` (back-in-stock alert), `draft`, `archived`. **₹0 prices can never be published** (validation hook) | P0 |
| CA-4 | Collections: Dairy · Ghee · Achar Collection · Pantry (Honey, Oil) · Combos & Gifts · Subscriptions. Manual and rule-based collections | P0 |
| CA-5 | Product page content: bilingual name, short and long description, key benefits, **process steps** (Bilona), ingredients, nutrition per 100 g, shelf life, storage, FSSAI no., country of origin, net quantity, manufacturer/packer details (**Legal Metrology** declarations), batch lab report (PDF), FAQs, related and "frequently bought together" | P0 |
| CA-6 | Listing filters: collection, fulfilment ("Delivered in Sonipat" / "Ships across India"), price, availability; sort (featured, price, newest, best-selling) | P0 |
| CA-7 | Search with autocomplete (products, collections, blog), including Hindi terms and transliteration ("ghee", "घी", "achaar", "अचार") | P1 |
| CA-8 | **Combos / bundles** (e.g. "Ghee + 2 Achar", Diwali hamper) with bundle pricing and inventory from their component items | P1 |
| CA-9 | Reviews & ratings: verified-buyer only, photo upload, moderation, request email sent 3 days after delivery. `AggregateRating` schema only once there are genuine reviews | P0 |
| CA-10 | **Notify me** (coming soon / back in stock) via email or WhatsApp number; automatic email when status changes | P0 |

### 5.2 Serviceability & delivery
| ID | Requirement | P |
|---|---|---|
| SV-1 | `ServiceAreas`: name (EN/HI), pincodes, polygon or radius, stage (1–4), status (`live`, `coming_soon`, `waitlist`), slots (e.g. Morning 6–8 AM), cut-off time (e.g. 9 PM), delivery days, minimum order, delivery fee, free-delivery threshold | P0 |
| SV-2 | **Pincode checker** on the header chip, product pages, cart and checkout. It answers per product: "Delivers tomorrow 6–8 AM" / "Ships in 3–5 days" / "Coming soon to your area" | P0 |
| SV-3 | Remember the pincode (cookie + account); filter "local_fresh" add-to-cart for unserviceable pincodes and offer the waitlist instead | P0 |
| SV-4 | Waitlist leads by pincode → an admin **demand heat-map** report used to choose expansion areas | P1 |
| SV-5 | Pan-India shipping rates: flat or weight-slab by zone; **Shiprocket** (or similar) integration for rates, AWB, labels and tracking | P1 (manual AWB at launch) / P2 (API) |
| SV-6 | Mixed cart (fresh + shipped items) is split into **two shipments** with clear messaging at checkout | P0 |
| SV-7 | Breakage-safe packing note for glass jars; an optional "fragile" surcharge | P1 |

### 5.3 Cart & checkout
| ID | Requirement | P |
|---|---|---|
| CK-1 | Cart drawer + cart page; persistent cart (cookie for guests, database for logged-in users); merge on login | P0 |
| CK-2 | Free-delivery progress bar; cross-sell row (achar, honey) | P1 |
| CK-3 | **3-step checkout**: (1) Contact & address (pincode validation, Google Places autocomplete optional) → (2) Delivery slot or shipping method → (3) Payment | P0 |
| CK-4 | **Guest checkout**; optional account creation after payment | P0 |
| CK-5 | Coupons: %/flat, min cart, first order, per-customer limits, product/collection scope, expiry; **referral credit** | P0 (basic) / P1 (referral) |
| CK-6 | **Razorpay Checkout**: UPI intent/QR shown first, then cards, netbanking, wallets. Server-side order creation, **signature verification + webhook** (`payment.captured`, `payment.failed`, `refund.processed`). Idempotent order updates | P0 |
| CK-7 | COD: **off** at launch (matches current prepaid policy); feature flag so it can be enabled later for `ship_india` with a fee and pincode rules | P2 |
| CK-8 | GST: prices inclusive; tax lines calculated per HSN (ghee, honey, oil, achar, milk have different GST rates, which the owner's CA must confirm); **GST invoice PDF** with GSTIN 06CKFPC6104C1ZW | P0 |
| CK-9 | Order confirmation page + email (Resend) + WhatsApp deep link ("Share order on WhatsApp") | P0 |
| CK-10 | "Order on WhatsApp" fallback link in cart and checkout; it pre-fills the cart contents | P0 |
| CK-11 | Abandoned-cart recovery email (1 h, 24 h) for logged-in or email-captured users | P1 |
| CK-12 | Gift options: gift message, ship to a different address, hide prices on the invoice | P1 |

### 5.4 Orders, fulfilment & post-purchase
| ID | Requirement | P |
|---|---|---|
| OR-1 | Order lifecycle: `pending_payment → paid → confirmed → packed → out_for_delivery / shipped → delivered`; plus `cancelled`, `refund_requested`, `refunded`, `failed_delivery` | P0 |
| OR-2 | Admin order list with filters (area, slot, date, status, fulfilment type), bulk status update, print packing slips and invoices | P0 |
| OR-3 | **Daily local delivery manifest**: grouped by area → route → slot, combining subscription deliveries and one-time orders; CSV/PDF export | P0 |
| OR-4 | Customer order tracking page (`/track-order` with order no. + phone) with a status timeline and courier AWB link | P0 |
| OR-5 | Cancellation (before cut-off) and refund requests (with photo for quality issues) → admin approval → Razorpay refund API | P1 |
| OR-6 | Inventory decrements on payment; low-stock alert email to the manager | P0 |
| OR-7 | Bulk / on-demand request (5 kg / 10 kg ghee kettle, B2B): request → admin quote → **payment link** → becomes an order | P1 |

### 5.5 Subscriptions & wallet (milk, buttermilk, curd)
| ID | Requirement | P |
|---|---|---|
| SB-1 | Subscription builder: product → quantity (0.5 L steps) → frequency (daily, alternate days, custom weekdays) → slot → start date | P1 (Phase 3) |
| SB-2 | **Prepaid wallet**: top-up via Razorpay (preset ₹1,000 / ₹2,000 / ₹5,000 + custom); daily job debits after delivery; ledger | P1 |
| SB-3 | Self-service: pause (date range), skip a day, change quantity, add a one-time item to tomorrow's delivery, all before the cut-off (e.g. 9 PM) | P1 |
| SB-4 | Glass bottle deposit/return tracking (if milk comes in returnable glass bottles) 🟡 | P2 |
| SB-5 | Low-balance alerts (email + WhatsApp link); a monthly statement email | P1 |
| SB-6 | Trial pack (e.g. 3 days × 1 L), one per phone number/address | P1 |
| SB-7 | Delivery staff can mark each stop delivered or failed from a mobile manifest view (Phase 4) | P2 |

### 5.6 Customer account
| ID | Requirement | P |
|---|---|---|
| AC-1 | Login with **email magic link / OTP** at launch; **phone OTP** (MSG91 / Twilio Verify) in Phase 3 | P0 / P1 |
| AC-2 | Dashboard: orders, invoices, reorder, addresses, notify-me list, reviews, referral code | P0 |
| AC-3 | Subscriptions + wallet section (Phase 3) | P1 |
| AC-4 | DPDP Act 2023: consent log, download my data, delete my account | P0 |

### 5.7 Leads, enquiries & cows
| ID | Form | Routed to | P |
|---|---|---|---|
| LD-1 | Contact (name, phone, email, subject, message) | contact@amritdairy.in + auto-reply | P0 |
| LD-2 | **Cow Buy/Sell enquiry** (buy or sell, breed, budget or expected price, location, phone). Cow listings: `Cows` collection (breed, age, lactation no., approx. daily yield, photos/video, status available/sold, "price on request") | Cow desk (+91 80595 93666) | P1 |
| LD-3 | Bulk / B2B / 5–10 kg ghee | Sales | P0 |
| LD-4 | Waitlist / Notify me | Automatic | P0 |
| LD-5 | Farm visit booking | Admin | P2 |
| LD-6 | Careers / distributor | Admin | P2 |

All forms: Zod validation on client and server, Cloudflare Turnstile + honeypot + rate limit, UTM capture, consent checkbox, stored in `Leads`, email via Resend, a "Continue on WhatsApp" link.

### 5.8 Content (CMS)
| ID | Requirement | P |
|---|---|---|
| CT-1 | **Page builder** blocks: Hero (slider), Category tiles, Product grid/carousel, Feature band, Stats, Why-us grid, Farm story split, Timeline, Breed grid, Testimonials, FAQ, CTA band, Rich text, Media/video, Map, Comparison table | P0 |
| CT-2 | **Farm Story**, **Desi Cows** (`Breeds` collection: name EN/HI, photo, origin, traits, typical yield, "on our farm" flag) | P0 |
| CT-3 | **Departments** and **Facilities** collections with detail pages | P1 |
| CT-4 | **Blog / Resources** (Posts, Authors with credentials, categories, TL;DR, key takeaways, FAQs, sources) | P0 (templates + 6 posts) |
| CT-5 | **Ticker** (text EN/HI, link, type, start/end, priority, target areas) + `/news` archive | P0 |
| CT-6 | Legal pages with version and effective date | P0 |
| CT-7 | Draft → preview (Live Preview) → publish; scheduled publish; version history | P0 |
| CT-8 | Redirects manager; slug change → automatic 301 | P0 |

### 5.9 Marketing & growth
| ID | Requirement | P |
|---|---|---|
| MK-1 | **Google Merchant Center product feed** (`/feeds/google.xml`) for free Shopping listings; also Meta catalogue feed | P1 |
| MK-2 | Newsletter (Resend Audiences) with double opt-in | P1 |
| MK-3 | Referral programme (give ₹X, get ₹X wallet credit) | P2 |
| MK-4 | Festive landing pages (Diwali ghee, wedding bulk) from the page builder | P1 |
| MK-5 | WhatsApp Business Cloud API for order/delivery notifications (templates) | P2 |

## 6. SEO / AEO / GEO requirements

### 6.1 E-commerce technical SEO (P0)
- Server-rendered HTML (RSC/SSG/ISR); price, stock and reviews present in the initial HTML.
- One URL per product; variants handled by a query parameter with a **canonical to the product**; faceted filter URLs are `noindex,follow` except curated ones (e.g. `/shop/ghee`).
- Unique titles and meta per product/collection (Payload SEO plugin, with templates in Doc 05 §8).
- `sitemap.xml` index → pages, products, collections, areas, blog, breeds; image sitemap entries for products.
- `robots.txt`, `llms.txt`, `hreflang` (`en-IN`, `hi-IN`, `x-default`), canonical tags.
- **Out-of-stock and coming-soon pages stay live** (never 404); archived products get a 301 to their collection.
- **Shopify → new URL 301 map** (e.g. `/collections/all` → `/shop`, `/products/{handle}` → `/products/{slug}`, `/pages/contact` → `/contact`, `/policies/refund-policy` → `/legal/refund-policy`). Keep product handles as slugs wherever possible.
- Core Web Vitals budget: marketing and product-page JS < 170 KB gzip; self-hosted fonts with `display: swap`; hero image `priority`.

### 6.2 Structured data (JSON-LD, P0)
| Page | Schema |
|---|---|
| All | `Organization` (logo, `sameAs`, `contactPoint` for orders and cow enquiries), `WebSite` + `SearchAction`, `BreadcrumbList` |
| Home / Contact / Farm | `LocalBusiness` → `Store` (address, `geo`, `areaServed`, `openingHours`, `hasMap`), `identifier` for GSTIN/FSSAI |
| Product | `Product` + `Offer`/`AggregateOffer` (INR, availability incl. `PreOrder`/`OutOfStock`), `hasMerchantReturnPolicy`, `shippingDetails`, `Review` / `AggregateRating` (genuine only), `brand`, `sku`, `gtin` (when available) |
| Collection | `CollectionPage` + `ItemList` |
| Blog | `BlogPosting` (author `Person`, dates) |
| FAQ blocks | `FAQPage` |
| Process / guides | `HowTo` |
| Breeds | `Thing`/`Article` per breed |
| Area pages | `Service` + `areaServed` |
| Cow listings | `Product` with `Offer` "price on request" (or `Thing`) |

### 6.3 Local SEO (Stages 1–3)
- Area landing pages (`/delivery/sonipat/sector-23` …) with unique content: slots, landmarks, local reviews, FAQs. **No duplicated template text.**
- Google Business Profile (category: Dairy store), NAP consistency, review generation after delivery.

### 6.4 AEO (answer engines, featured snippets, AI Overviews)
- Question-led H2s with a 40–60 word **answer first**, on product and blog pages ("How is Bilona ghee made?", "How do I store ghee?", "How long does matka dahi last?").
- A TL;DR and key takeaways on every blog post; FAQ block on every product and collection page.
- Comparison tables (Bilona vs cream-method ghee; desi cow vs buffalo ghee; glass vs plastic).
- A glossary (Bilona, danedar, A1/A2, SNF, Ker Sangri …).

### 6.5 GEO (generative engines: ChatGPT, Gemini, Perplexity, Copilot)
- `/llms.txt` + `/llms-full.txt`, generated from the CMS (key pages + facts).
- A **Facts page** (`/about/facts`): dated, plain key-value facts (herd 250, breeds, address, GSTIN, FSSAI, areas served, prices, delivery times).
- Original, quotable data (monthly lab results, herd numbers) with dates.
- E-E-A-T: named authors (farm manager, vet), an editorial policy, sources cited, visible update dates.
- Consistent entity: always "Amrit Dairy, Sonipat"; `sameAs` to all profiles.
- `robots.txt` allows reputable AI crawlers (OAI-SearchBot, GPTBot, PerplexityBot, Google-Extended, ClaudeBot). Review this business decision yearly.
- Monthly tracking of 20 prompts (e.g. "best bilona ghee in Haryana", "desi cow milk delivery Sonipat").

### 6.6 Launch content minimum
All 20 product pages with real prices, or proper Coming-soon pages · 5 collection pages with intro copy + FAQ · Farm Story · Desi Cows + 5 on-farm breed pages · 4 area pages + Sonipat hub · 6 cornerstone blog posts · legal pages.

## 7. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Lighthouse mobile ≥ 90 on Home, a collection, a product and checkout; TTFB < 600 ms |
| Accessibility | WCAG 2.2 AA; axe-core clean in CI; keyboard-operable cart, checkout and date pickers |
| Security | OWASP Top-10 review; Payload access control on every collection; admin 2FA; CSP/HSTS; **no card data touches our servers** (Razorpay-hosted); webhook signature verification; rate limits on OTP, login and forms; secrets in Vercel env |
| Payments integrity | Idempotency keys; reconciliation job (Razorpay payments vs orders) every day; amounts in paise (integers) |
| Privacy / Legal | DPDP Act 2023; **Consumer Protection (E-Commerce) Rules 2020** (seller name, address, GSTIN, grievance officer, return/refund policy, country of origin, total price breakdown); Legal Metrology (Packaged Commodities) declarations on product pages; FSSAI licence number displayed; no health claims |
| Reliability | 99.9 % uptime; Neon point-in-time restore; daily export of orders; uptime monitor + alerts |
| Observability | Sentry; Vercel Analytics + Speed Insights; GA4 e-commerce; Google Search Console + Bing Webmaster; Microsoft Clarity (consent-gated) |
| Browsers | Last 2 versions of Chrome, Safari, Edge, Firefox; Android 9+; iOS 15+ |
| Maintainability | TypeScript strict; Payload-generated types; ESLint/Prettier; Vitest + Playwright; PR previews with a Neon branch per preview |

## 8. Technical architecture

```
                    ┌────────────────────────── Vercel ───────────────────────────┐
 Shoppers / Bots ──▶│ Next.js 15 App Router (RSC · ISR · Edge middleware for i18n) │
                    │  ├─ (store)   /, /shop, /products, /cart, /checkout, /account │
                    │  ├─ (content) /farm-story, /desi-cows, /blog, /legal …       │
                    │  ├─ /admin    Payload CMS 3 admin                           │
                    │  ├─ /api      Payload REST/GraphQL + custom route handlers   │
                    │  │            (checkout, razorpay webhook, pincode, feeds)   │
                    │  └─ Vercel Cron → Payload Jobs (wallet debit, reminders,     │
                    │                   abandoned cart, reconciliation, sitemaps) │
                    └──────┬─────────────┬──────────────┬─────────────┬───────────┘
                           │             │              │             │
                  Neon Postgres    Vercel Blob     Resend + React   Razorpay
                  (pooled, branch  (media via       Email           (Orders API,
                   per preview)     Payload adapter)                 webhooks, refunds)
                           │
          Shiprocket (shipping) · MSG91/Twilio (OTP, Phase 3) · WhatsApp Cloud API (Phase 5)
          Cloudflare Turnstile · Google Maps/Places · Sentry · GA4 · Merchant Center feed
```

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** + TypeScript | Payload 3 runs *inside* the Next.js app: one repo, one deploy |
| CMS & commerce back office | **Payload CMS 3** | Plugins: `seo`, `redirects`, `search`, `form-builder`, `nested-docs`, `storage-vercel-blob`, `email-resend`. Commerce: evaluate Payload's official **ecommerce plugin** (products, variants, carts, orders, transactions) and add a **custom Razorpay payment adapter**; fall back to custom collections if the plugin doesn't fit subscriptions/wallet. Decide this in Phase 2 |
| Localisation | Payload field-level localisation (`en`, `hi`) + Next.js `[locale]` routing | |
| Database | **Neon Postgres** (`@payloadcms/db-postgres`) | Pooled URL for serverless; migrations in CI; branch per preview |
| Email | **Resend** + React Email | `mail.amritdairy.in` with SPF/DKIM/DMARC |
| Payments | Razorpay | Orders API, Checkout.js, webhooks, Refunds API, Payment Links (bulk quotes) |
| UI | Tailwind CSS v4 + tokens from Doc 03, shadcn/ui (Radix) | |
| Forms | React Hook Form + Zod + Server Actions | |
| Testing | Vitest, Playwright (checkout E2E with Razorpay test mode), Lighthouse CI, axe | |

### 8.1 Payload collections
**Commerce:** `Products` · `Variants` · `Collections` (named `ProductCollections` in code, to avoid the reserved word) · `Bundles` · `Inventory` (or a field on variants) · `Carts` · `Orders` · `OrderItems` · `Payments` / `Transactions` · `Refunds` · `Shipments` · `Coupons` · `Reviews` · `Customers` · `Addresses` · `Subscriptions` · `WalletTransactions` · `Deliveries` · `ServiceAreas` · `NotifyRequests`
**Content:** `Pages` · `Media` · `Breeds` · `Cows` (listings) · `Departments` · `Facilities` · `Posts` · `Authors` · `Resources` · `FAQs` · `Testimonials` · `Ticker` · `LegalPages` · `Leads` · `Redirects`
**Globals:** `SiteSettings` (NAP, phones, GSTIN, FSSAI, Udyam, socials) · `Header` · `Footer` · `CheckoutSettings` (cut-off, fees, thresholds, COD flag) · `TaxSettings` (HSN → GST %) · `SEODefaults`

### 8.2 Transactional emails (Resend)
Order confirmation (+ invoice PDF) · Payment failed · Order shipped (AWB) / out for delivery · Delivered + review request · Refund processed · Notify-me / back in stock · Abandoned cart · Subscription created / paused / resumed · Wallet low / top-up receipt / monthly statement · OTP / magic link · Lead auto-replies · Admin alerts (new order, low stock, bulk request, cow enquiry).

### 8.3 Environment variables
`DATABASE_URL` · `PAYLOAD_SECRET` · `BLOB_READ_WRITE_TOKEN` · `RESEND_API_KEY` · `RAZORPAY_KEY_ID` · `RAZORPAY_KEY_SECRET` · `RAZORPAY_WEBHOOK_SECRET` · `SHIPROCKET_EMAIL/PASSWORD` · `TURNSTILE_SECRET` · `NEXT_PUBLIC_SITE_URL` · `NEXT_PUBLIC_WHATSAPP_ORDERS=917700004877` · `NEXT_PUBLIC_WHATSAPP_COWS=918059593666` · `SENTRY_DSN` · `NEXT_PUBLIC_GA_ID` · `CRON_SECRET`

## 9. Shopify migration
| Item | Plan |
|---|---|
| Products (20) + images | Export CSV from Shopify → import script into Payload; re-shoot missing images |
| Customers & order history | Export from Shopify; import customers (with consent status); keep order history as read-only records if needed |
| URLs | 301 map for every Shopify URL (products, collections, pages, policies, blogs); test before DNS switch |
| Policies | Port Privacy, Refund and Terms content and update them for subscriptions and shipping |
| DNS cut-over | Lower TTL a week before; switch domain to Vercel; keep Shopify for 30 days (read-only) as a fallback; resubmit sitemap in GSC |

## 10. Analytics (GA4 e-commerce + custom)
`view_item_list`, `select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `refund` + custom: `pincode_check` (result), `notify_me`, `whatsapp_click` (context), `subscription_start/pause/skip/cancel`, `wallet_topup`, `cow_enquiry`, `language_switch`, `ticker_click`.

## 11. Risks & mitigations
| Risk | Mitigation |
|---|---|
| Unverified claims ("50,000+ families", A2, organic, demo reviews) | Content compliance review; only real reviews; certified claims only |
| Glass-jar breakage in courier | Tested packaging; "fragile" handling; replacement policy; start with Delhi NCR shipping before going national |
| Payment ↔ order mismatch | Webhooks + idempotency + daily reconciliation |
| Subscription complexity delays launch | Phase it: launch the store first (Phase 2), subscriptions next (Phase 3) |
| Payload ecommerce plugin maturity | Spike in Phase 2 foundation; custom collections as fallback |
| SEO loss during migration | Complete 301 map, same slugs, pre-launch crawl, post-launch GSC monitoring |
| Ops can't keep up with online orders | Manifests, packing slips, low-stock alerts, cut-off times |

## 12. Launch acceptance criteria (store go-live, end of Phase 2)
- [ ] All 20 SKUs live with real prices/images, or proper Coming-soon pages. **No ₹0 anywhere**
- [ ] Guest checkout → Razorpay (UPI, card) → webhook → paid order → confirmation email + invoice works end-to-end in production
- [ ] Pincode checker is correct for the 4 live areas; fresh items are blocked for other pincodes; ghee/achar shipping works for any Indian pincode
- [ ] Admin can process an order through to delivered, print an invoice and export the day's manifest
- [ ] Lighthouse mobile ≥ 90 (Home, Collection, Product, Checkout); zero critical axe issues
- [ ] JSON-LD valid (Rich Results Test); Merchant Center feed approved
- [ ] All Shopify URLs 301 correctly; sitemap submitted
- [ ] Legal pages (incl. grievance officer) published; FSSAI/GSTIN in footer
- [ ] English + Hindi versions of the store, product and checkout pages

## 13. Open questions for the owner
1. Legal/trade name, founder story, year founded?
2. Prices and pack sizes for all "Coming soon" SKUs (milk ₹100/L confirmed?), plus the 5 kg / 10 kg kettle prices?
3. GST rates per product (confirm with your CA) and HSN codes?
4. Delivery slot timings, cut-off, fees and free-delivery thresholds?
5. Are milk bottles returnable (deposit)?
6. Pan-India shipping at launch, or Delhi NCR first?
7. Is cow buying/selling an active line that should be on the website?
8. Honey: certified organic? Ghee: keep the "A2" wording?
9. Who manages daily orders in the admin, and how many staff need logins?
