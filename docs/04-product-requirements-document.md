# 04 · Product Requirements Document (PRD) — amritdairy.in v2

| | |
|---|---|
| **Product** | Amrit Dairy website v2: a content and commerce platform that is SEO, AEO and GEO optimised |
| **Owner** | Amrit Dairy (Business) · UI/UX Lead · Tech Lead |
| **Status** | Draft v1.0 · Sep 2026 |
| **Stack** | Node.js · **Next.js 15 (App Router)** · **Payload CMS 3** · **Neon Postgres** · **Resend** · **Vercel** |
| **Related docs** | 01 Brand Details · 02 Personas · 03 Brand Guidelines · 05 Architecture · 06 Stitch Prompt · 07 Execution Plan |

---

## 1. Background & problem

The current amritdairy.in is a simple brochure site. Ordering is manual (WhatsApp or phone), payment is manual (Razorpay link or UPI, then the customer sends a screenshot or UTR), and service areas are confirmed by chatting. This will not scale beyond four Sonipat localities. It also leaves the brand hard to find on Google and in AI answer engines, where several unrelated "Amrit" dairies compete for the name.

## 2. Goals & success metrics

| # | Goal | KPI | Target (12 months after launch) |
|---|---|---|---|
| G1 | Own local search in Sonipat | Top-3 rank for "milk delivery Sonipat", "desi cow milk Sonipat", "desi ghee Sonipat" and each served-sector query | 15+ keywords in the top 3 |
| G2 | Be the answer in AI engines | Brand cited by ChatGPT, Gemini, Perplexity or Google AI Overviews for "best desi cow milk in Sonipat" or "pure ghee Sonipat" | Cited in ≥ 50 % of 20 tracked prompts |
| G3 | Convert visitors to customers | Visitor → trial/lead conversion | ≥ 4 % (mobile) |
| G4 | Move orders off manual WhatsApp | Share of orders and subscriptions placed online | ≥ 60 % |
| G5 | Support expansion | New area or city launched with CMS-only changes (no code) | < 1 day |
| G6 | Performance | Core Web Vitals (field): LCP < 2.5 s, INP < 200 ms, CLS < 0.1 | 90 % of URLs "Good" |
| G7 | Accessibility | WCAG 2.2 AA; Lighthouse Accessibility | ≥ 95 |

## 3. Scope

### In scope (v2)
- Marketing site (all pages in Doc 05)
- CMS for every piece of content, including products, service areas, blogs, ticker, departments, facilities, FAQs, legal pages and SEO fields
- **Serviceability checker** (pincode / locality / geo radius)
- **Lead and enquiry capture** (contact, trial, bulk/B2B, farm visit, careers, "notify me when you reach my area")
- **Ordering:** Phase 2 adds one-time orders for shelf-stable products (ghee, honey, oil) with Razorpay checkout; Phase 3 adds **milk subscriptions** with a customer dashboard
- Transactional email via Resend, plus WhatsApp deep links
- Complete SEO / AEO / GEO foundations

### Out of scope (v2)
- Native mobile apps (the PWA covers this)
- Rider/route optimisation app (use a third-party or a later phase)
- Marketplace integrations (Amazon/Flipkart), handled outside the website in Stage 4

## 4. Users & roles

| Role | Where | Permissions |
|---|---|---|
| Visitor | Public site | Browse, check pincode, submit forms, buy (guest checkout for shelf-stable products) |
| Customer | `/account` | OTP/email login; manage subscriptions, orders, addresses, wallet; pause/skip |
| Content Editor | Payload admin | Create/edit blogs, resources, ticker, FAQs; cannot publish legal pages or change prices |
| Store Manager | Payload admin | Products, prices, inventory, service areas, orders, subscriptions, leads |
| Admin | Payload admin | Everything: users, roles, settings, legal pages, redirects |

## 5. Functional requirements

Priority: **P0** = launch blocker · **P1** = launch or fast-follow · **P2** = later phase.

### 5.1 Global
| ID | Requirement | P |
|---|---|---|
| GL-1 | Header: logo, primary navigation, pincode chip ("Delivering to: Sector 23 ✓"), WhatsApp and call buttons, cart icon (Phase 2), account (Phase 3) | P0 |
| GL-2 | **News ticker** at the top of every page. Content comes from the CMS `Ticker` collection (text, link, start/end date, priority). Auto-scrolls, can be paused, and is accessible (`aria-live="polite"`, pauses on hover/focus, honours reduced-motion) | P0 |
| GL-3 | Footer: NAP (name, address, phone), service areas, quick links, legal links, FSSAI number, social links, newsletter signup | P0 |
| GL-4 | Floating WhatsApp button on mobile with a pre-filled message that includes the page context ("Hi, I want to order Desi Cow Ghee 1 kg") | P0 |
| GL-5 | Global site search across products, blogs, FAQs and resources (Payload search plugin) | P1 |
| GL-6 | Cookie/consent banner that respects DPDP Act 2023 (India) | P0 |
| GL-7 | i18n-ready routing (`/` English, `/hi/` Hindi). Hindi content is Phase 3 | P1 (infra) / P2 (content) |
| GL-8 | Breadcrumbs on all inner pages (with `BreadcrumbList` schema) | P0 |
| GL-9 | Custom 404 and 500 pages carrying brand illustration, search and a WhatsApp link | P0 |
| GL-10 | PWA: manifest, icons, offline fallback page | P1 |

### 5.2 Serviceability
| ID | Requirement | P |
|---|---|---|
| SV-1 | `ServiceAreas` collection stores: name, slug, pincode(s), city, district, stage (1–4), status (`live`, `coming_soon`, `waitlist`), delivery slots, delivery days, minimum order, delivery fee, geo polygon or centre plus radius, and SEO content | P0 |
| SV-2 | Pincode/locality checker (autocomplete). Result states: ✅ **Live**, showing slots and a CTA · 🕒 **Coming soon**, with a waitlist form · ❌ **Not yet**, with a waitlist form. Ghee and other shelf-stable products always show "ships across India" | P0 |
| SV-3 | Optional "Use my location" (browser geolocation → check against the radius or polygon) | P1 |
| SV-4 | The chosen area is remembered (cookie) and shown in the header chip | P0 |
| SV-5 | Waitlist leads are counted per pincode in an admin report. **Use this demand data to pick the next expansion area** | P1 |

### 5.3 Products & catalogue
| ID | Requirement | P |
|---|---|---|
| PR-1 | `Products` collection: name, slug, category, variants (size, MRP, sale price, SKU, stock), fulfilment type (`fresh_local` or `ship_india`), status (`available`, `coming_soon`, `discontinued`), gallery, short and long description, process steps, nutrition table, shelf life, storage, ingredients, FAQs, related products, reviews, SEO fields | P0 |
| PR-2 | Product listing page with filters (category, fulfilment type) | P0 |
| PR-3 | Product detail page (PDP): gallery, price, variant selector, serviceability check, add-to-cart / subscribe / WhatsApp order, process story, nutrition, FAQs, reviews, related products | P0 |
| PR-4 | "Coming soon" products show a **Notify Me** form (email or WhatsApp number) and are indexable pages that build SEO ahead of launch | P0 |
| PR-5 | Reviews and ratings, moderated in the CMS; `AggregateRating` schema is emitted only for genuine, visible reviews | P1 |

### 5.4 Commerce (Phase 2: one-time orders)
| ID | Requirement | P |
|---|---|---|
| CM-1 | Cart and checkout (guest, or login via email OTP) | P1 |
| CM-2 | **Razorpay** payments (UPI, cards, netbanking, wallets) with signature verification via webhook | P1 |
| CM-3 | Order confirmation page plus an email (Resend) and a WhatsApp deep link | P1 |
| CM-4 | GST invoice PDF attached to the email | P1 |
| CM-5 | Coupon codes (first order, referral, society launch) | P1 |
| CM-6 | Shipping rules: local delivery fee by area; pan-India shipping by weight and zone (Shiprocket integration in Phase 4) | P1 / P2 |
| CM-7 | Cash on delivery: **off** (matches the current prepaid policy) | — |

### 5.5 Subscriptions (Phase 3: fresh milk)
| ID | Requirement | P |
|---|---|---|
| SB-1 | Subscription builder: product → quantity (0.5 L steps) → frequency (daily, alternate days, custom weekdays) → slot (morning or evening) → start date | P1 |
| SB-2 | **Prepaid wallet** top-up via Razorpay; a daily cron job debits delivered quantities | P1 |
| SB-3 | Customer dashboard: calendar view, pause or skip dates (cut-off e.g. 9 PM the night before), change quantity, one-off add-ons (curd or paneer tomorrow), wallet ledger, invoices | P1 |
| SB-4 | Low-balance and monthly-statement emails (Resend) | P1 |
| SB-5 | Admin: daily delivery manifest per area and route (CSV/PDF export), plus a subscription list | P1 |
| SB-6 | Free trial (e.g. 3-day ½ L) flow, limited to one per phone number and address | P1 |

### 5.6 Leads & forms
| ID | Form | Fields | Email notifications | P |
|---|---|---|---|---|
| LD-1 | Contact | name, phone, email, subject, message | Admin + auto-reply | P0 |
| LD-2 | Trial / order enquiry | name, phone, locality, product, quantity | Admin + auto-reply | P0 |
| LD-3 | Bulk / B2B | business name, type, monthly volume, city, GSTIN | Admin (sales) | P0 |
| LD-4 | Farm visit booking | name, phone, date, group size, purpose | Admin + confirmation | P1 |
| LD-5 | Waitlist / notify me | phone/email, pincode, product | Auto-reply, then a broadcast when the area goes live | P0 |
| LD-6 | Careers | name, phone, role, resume (upload) | HR | P1 |
| LD-7 | Distributor / partner | name, city, investment range, experience | Admin | P2 |

Every form must: validate with **Zod** on client and server · include honeypot, **Cloudflare Turnstile** and rate limiting · capture UTM parameters, source page and consent checkbox · be stored in Payload (`Leads` collection) · trigger a Resend email · offer a "Continue on WhatsApp" link.

### 5.7 Content (CMS-driven)
| ID | Requirement | P |
|---|---|---|
| CT-1 | **Blogs:** title, slug, author (a `Authors` entry with bio and credentials, for E-E-A-T), category, tags, cover image, rich text (Lexical), TL;DR summary, key takeaways, FAQs block, sources/references, reading time, published and updated dates | P0 |
| CT-2 | **Resources:** guides, recipe cards, lab reports (PDF), a "How to identify pure ghee" guide, downloadable price list, press kit | P1 |
| CT-3 | **Departments:** name, head, description, responsibilities, team photo, related facilities, contact | P0 |
| CT-4 | **Facilities:** name, type, capacity metrics, gallery or 360° / video, process description, hygiene/SOP highlights, related department | P0 |
| CT-5 | **FAQs** collection, reusable on any page (with `FAQPage` schema) | P0 |
| CT-6 | **Testimonials** (text, video, locality, rating) | P0 |
| CT-7 | **Legal pages** as a collection, with version and effective date | P0 |
| CT-8 | **Page builder**: Payload blocks for Hero, Rich Text, Media, Stats, Feature Grid, How It Works, Product Carousel, Testimonials, FAQ, CTA Banner, Map, Timeline, Team, Logos, Comparison Table, Video | P0 |
| CT-9 | Draft/preview/publish with **Live Preview**, scheduled publishing and version history | P0 |
| CT-10 | Redirects manager (Payload redirects plugin) so URLs from the old site don't break | P0 |

## 6. SEO / AEO / GEO requirements

### 6.1 Technical SEO (P0)
- Server rendering (RSC / SSG / ISR). No content that appears only after client-side JS runs.
- Unique `<title>` (≤ 60 characters) and meta description (≤ 155) on every URL. Editors manage these with the Payload SEO plugin, with sensible auto-fill defaults.
- Canonical URLs; `hreflang` pairs for `en-IN` and `hi-IN`; lowercase, hyphenated, meaningful slugs.
- `sitemap.xml` (split: pages, products, areas, blogs), a `robots.txt`, and `llms.txt`.
- OG and Twitter images generated per page (`next/og`).
- Image optimisation (Next/Image, AVIF/WebP, width/height set, lazy loading below the fold, `priority` on the hero image).
- Clean heading hierarchy (one H1 per page) and semantic HTML5 landmarks.
- ISR revalidation triggered by Payload `afterChange` hooks so edits go live in seconds.
- 301 redirects from old URLs; no redirect chains.
- Core Web Vitals budget: JS < 150 KB gzipped on marketing pages; fonts self-hosted with `display: swap`.

### 6.2 Local SEO (P0) — the most important lever for Stages 1–3
- **One landing page per service area**: `/milk-delivery/sonipat/sector-23`, `/milk-delivery/sonipat/devilal-colony`, and so on. Each page must have genuinely unique content: delivery timing, nearby landmarks, local testimonials, an FAQ, a map. **Never templated duplicate text.**
- City hub pages: `/milk-delivery/sonipat`, `/milk-delivery/kundli`, `/milk-delivery/delhi`.
- `LocalBusiness` → `FoodEstablishment`/`Store` schema with `geo`, `areaServed`, `openingHours` and `sameAs`.
- NAP consistency across the site, Google Business Profile, Justdial, IndiaMART and social profiles.
- Embedded Google Map and a "Visit our farm" page (a strong local trust signal).

### 6.3 Structured data (JSON-LD, P0)
| Page | Schema types |
|---|---|
| All | `Organization` (logo, `sameAs`, contactPoint), `WebSite` (+ `SearchAction`), `BreadcrumbList` |
| Home / Contact / Farm | `LocalBusiness` (+ `geo`, `areaServed`, `hasMap`) |
| Product | `Product`, `Offer` (price in INR, availability), `AggregateRating` / `Review` (genuine only), `MerchantReturnPolicy`, `OfferShippingDetails` |
| Blog | `BlogPosting` / `Article` (author → `Person`, `datePublished`, `dateModified`) |
| FAQ blocks | `FAQPage` |
| How-to guides | `HowTo` |
| Recipes | `Recipe` |
| Area pages | `Service` with `areaServed` → `Place` |
| Facility / farm visit | `Place` / `TouristAttraction` (farm visits), `Event` (open-farm days) |
| Careers | `JobPosting` |
| Videos | `VideoObject` |

Validate with the Rich Results Test and Schema.org validator in CI (a lint step on the JSON-LD output).

### 6.4 AEO — Answer Engine Optimisation (P0)
Goal: get picked for featured snippets, "People also ask", voice answers and Google AI Overviews.
- **Question-led headings** (H2/H3 phrased as real questions: "Is desi cow milk A2?", "How much milk does a family of 4 need per day?").
- **Answer-first paragraphs:** a direct 40–60 word answer right after each question heading, followed by detail.
- A **TL;DR box** and **Key takeaways** at the top of every blog post (CMS fields).
- FAQ blocks on every product, area and category page, drawn from real customer questions (WhatsApp logs are a goldmine).
- Tables and lists for comparisons (desi vs. jersey milk, ghee price per kg vs. process).
- A **Glossary** resource (Bilona, A1/A2, SNF, Fat %, Desi breed names) with anchor links.

### 6.5 GEO — Generative Engine Optimisation (P0)
Goal: have LLM-based engines (ChatGPT search, Perplexity, Gemini, Copilot, Google AI Mode) **cite Amrit Dairy**.
- **`/llms.txt`** (and `/llms-full.txt`): a Markdown map of key pages plus a short facts summary, generated from the CMS.
- A **Facts page** (`/about/facts`): a plain, citable, dated list such as herd size, breeds, farm address, founded year, areas served, delivery time, prices, certifications and lab-test dates. It is updated from the CMS and carries a "Last updated" date.
- **Quotable statistics** with sources, and original data (e.g. "Average fat % of our milk in Aug 2026: 4.4 %", backed by lab reports).
- **E-E-A-T:** named authors with credentials (a vet, the farm manager), an editorial policy, a citations section on blog posts, and visible updated dates.
- Consistent entity naming: always "Amrit Dairy, Sonipat" and never variants. Use `sameAs` to connect every profile (GBP, Instagram, YouTube, Justdial, Wikidata later).
- `robots.txt` **allows** reputable AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot, Google-Extended, ClaudeBot), because the business goal is visibility. This is a business decision, reviewed yearly.
- Build third-party mentions (local news, food bloggers, Reddit/Quora answers, YouTube). LLMs weigh off-site consensus heavily.
- Track prompts monthly: a list of 20 target prompts, recorded in a sheet (tools: Profound, Otterly, or manual checks).

### 6.6 Content plan (launch minimum)
- 12 cornerstone blog posts, e.g. *"Desi cow milk vs packet milk"*, *"How we make bilona ghee, step by step"*, *"How to check milk adulteration at home"*, *"A1 vs A2 milk: what science actually says"*, *"Why Sahiwal cows?"*, *"How much ghee per day is healthy?"*
- 4 area landing pages (the current live areas) plus a Sonipat hub
- 1 product page per SKU, including coming-soon SKUs

## 7. Non-functional requirements

| Area | Requirement |
|---|---|
| **Performance** | Lighthouse (mobile) ≥ 90 on Performance, SEO, Best Practices and Accessibility. TTFB < 600 ms (Vercel edge/ISR) |
| **Accessibility** | WCAG 2.2 AA: keyboard navigation, focus rings, alt text required in the CMS, form labels, colour contrast per Doc 03, pausable ticker |
| **Security** | HTTPS/HSTS; CSP headers; Payload access control on every collection; admin behind 2FA or strong passwords plus IP rate limits; secrets in Vercel environment variables; Razorpay webhook signature check; OWASP top-10 review |
| **Privacy / Legal** | DPDP Act 2023 consent and purpose notice; data deletion requests; FSSAI licence shown; Consumer Protection (E-Commerce) Rules 2020 disclosures (seller details, grievance officer, return/refund policy) |
| **Reliability** | 99.9 % uptime (Vercel + Neon). Daily Neon branch backups / point-in-time restore. Uptime monitor |
| **Scalability** | Serviceability, pricing and areas are fully data-driven, so no code changes are needed to launch a new area |
| **Observability** | Vercel Analytics and Speed Insights; Sentry for errors; GA4 plus Google Search Console plus Bing Webmaster; Microsoft Clarity for heatmaps (consent-gated) |
| **Browser support** | Last 2 versions of Chrome, Safari, Edge and Firefox; Android 9+ Chrome; iOS 15+ Safari |
| **Maintainability** | TypeScript strict mode, ESLint and Prettier, Payload-generated types, conventional commits, PR previews on Vercel |

## 8. Technical architecture

```
                   ┌──────────────────────── Vercel ────────────────────────┐
 Browser / Bots ──▶│  Next.js 15 App Router (RSC, ISR, Edge middleware)      │
                   │   ├─ (frontend) routes  → marketing, shop, account       │
                   │   ├─ /admin             → Payload CMS 3 admin UI         │
                   │   ├─ /api/*             → Payload REST + GraphQL + custom│
                   │   └─ Route handlers     → Razorpay webhooks, cron jobs   │
                   └───────┬──────────────┬───────────────┬──────────────────┘
                           │              │               │
                 Neon Postgres     Vercel Blob (media)   Resend (email)
                 (@payloadcms/     via Payload storage   React Email
                  db-postgres,      adapter              templates
                  pooled conn,
                  preview branches)
                           │
       Razorpay · Cloudflare Turnstile · Google Maps · WhatsApp (wa.me → Cloud API later) · Sentry · GA4
```

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js 20 LTS+ | Vercel Node runtime for Payload; Edge only for middleware |
| Framework | **Next.js 15** (App Router, TypeScript) | Payload 3 installs *inside* the Next.js app, so there is one codebase and one deploy |
| CMS | **Payload CMS 3** | Plugins: `seo`, `redirects`, `form-builder`, `search`, `nested-docs`, `@payloadcms/storage-vercel-blob`, `@payloadcms/email-resend` |
| Database | **Neon** serverless Postgres | Pooled connection string for serverless; **a Neon branch per Vercel preview deployment** |
| Media | Vercel Blob (or Cloudflare R2 / S3) | Payload generates image sizes; Next/Image serves them |
| Email | **Resend** + React Email | Domain verified (SPF, DKIM, DMARC) on `mail.amritdairy.in`. Transactional only; marketing broadcasts through Resend Audiences |
| Payments | Razorpay | Orders API + Subscriptions / wallet logic |
| Styling | Tailwind CSS v4 + CSS variables from Doc 03, shadcn/ui primitives (Radix) | |
| Forms | React Hook Form + Zod | Server Actions |
| Cron | Vercel Cron → Payload Jobs Queue | Wallet debits, ticker expiry, sitemap pings, low-balance emails |
| Auth (customers) | Payload auth on a `Customers` collection with email OTP / magic link | Phone OTP (MSG91 / Twilio) in Phase 3 |
| Testing | Vitest (unit), Playwright (E2E), Lighthouse CI, axe-core | |
| CI/CD | GitHub → Vercel (preview per PR, production on `main`) | |

### 8.1 Core Payload collections
`Users` (admins) · `Customers` · `Media` · `Pages` · `Products` · `Categories` · `ServiceAreas` · `Orders` · `Subscriptions` · `WalletTransactions` · `Deliveries` · `Coupons` · `Posts` · `PostCategories` · `Authors` · `Resources` · `Departments` · `Facilities` · `FAQs` · `Testimonials` · `Reviews` · `Ticker` · `Leads` · `Jobs` (careers) · `LegalPages` · `Redirects` · `Forms` / `FormSubmissions` (plugin)

**Globals:** `SiteSettings` (NAP, socials, FSSAI, GSTIN, WhatsApp number, default SEO) · `Header` · `Footer` · `AnnouncementSettings` · `Integrations`

### 8.2 Transactional emails (Resend)
| Trigger | Template |
|---|---|
| Contact / enquiry submitted | Auto-reply to the customer plus an admin notification |
| Waitlist joined / area goes live | "You're on the list" / "We now deliver in {area}" |
| Order placed / paid / shipped / delivered | Order confirmation (with invoice PDF), shipping update |
| Subscription created / paused / resumed | Confirmation |
| Wallet low / monthly statement | Reminder / statement |
| Magic-link login / OTP | Auth |
| Farm visit booked | Confirmation with map link and a calendar invite (.ics) |

### 8.3 Environment variables
`DATABASE_URL` (Neon pooled) · `PAYLOAD_SECRET` · `BLOB_READ_WRITE_TOKEN` · `RESEND_API_KEY` · `RAZORPAY_KEY_ID` · `RAZORPAY_KEY_SECRET` · `RAZORPAY_WEBHOOK_SECRET` · `TURNSTILE_SECRET` · `NEXT_PUBLIC_SITE_URL` · `NEXT_PUBLIC_WHATSAPP_NUMBER` · `SENTRY_DSN` · `NEXT_PUBLIC_GA_ID` · `CRON_SECRET`

## 9. Analytics & tracking plan

| Event | Properties |
|---|---|
| `pincode_check` | pincode, result (live/coming/no), page |
| `whatsapp_click` | page, product, position |
| `call_click` | page |
| `lead_submit` | form type, area, UTM |
| `view_item` / `add_to_cart` / `begin_checkout` / `purchase` | GA4 e-commerce standard |
| `subscription_start` / `pause` / `cancel` | plan, qty, area |
| `notify_me` | product, pincode |
| `ticker_click` | item id |

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Name confusion with other "Amrit" dairies | Entity-consistent naming, Organization schema + `sameAs`, GBP, "Sonipat" in titles, trademark |
| Thin / duplicate area pages (Google penalty) | Unique content checklist per area page; launch pages only for areas that are actually served or on the waitlist |
| Unverifiable health claims (FSSAI/ASCI) | Editorial policy; no medical claims; sources cited; claims reviewed by the owner |
| Payload + Neon serverless cold starts | Pooled connections, ISR/static for marketing pages, keep the admin lightweight |
| Manual ops can't keep up with online orders | Phase commerce: leads → one-time orders → subscriptions; admin manifests |
| Missing real farm content | Photo/video shoot scheduled in Phase 0; placeholder policy: no stock Holstein cows |

## 11. Acceptance criteria (launch, Phase 1)
- [ ] All P0 requirements pass QA on mobile (Android Chrome, iOS Safari) and desktop
- [ ] Lighthouse mobile ≥ 90 across all 4 categories on Home, a PDP, a blog post and an area page
- [ ] Zero critical axe-core violations
- [ ] All JSON-LD passes the Rich Results Test
- [ ] Sitemap submitted to GSC and Bing; `llms.txt` live
- [ ] 301 map for all old URLs verified
- [ ] Resend domain verified; all P0 emails deliver to Gmail and Outlook inboxes (not spam)
- [ ] Editors can create a blog post, a ticker item, a service area and a product without developer help (trained and documented)
- [ ] Legal pages published and linked in the footer

## 12. Open questions for the business
1. Legal entity name, GSTIN, FSSAI licence number, founding year, founder story?
2. Exact breeds and head count? Is the ghee made by the bilona (curd-churned) method?
3. Milk price per litre and pack sizes; delivery slot times; delivery fee / minimum order?
4. Do "Departments" and "Facilities" refer to the farm's internal units (Gaushala, Milking, Bilona unit, Quality Lab, Logistics), or is there a larger processing plant planned?
5. Who owns content creation (blogs, photos) after launch?
6. Should AI crawlers be allowed? (Recommended: yes.)
