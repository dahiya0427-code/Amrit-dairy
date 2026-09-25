# 05 · Website Architecture — amritdairy.in v2

> Information architecture, sitemap, URL structure, navigation, and a section-by-section blueprint for every page template.
> Pages covered: **Home · About · Products + Product Details · Departments + Department Details · Facilities + Facility Details · Resources + Blogs · Ticker · Contact · Legal**, plus the supporting pages needed for SEO and commerce.

---

## 1. Sitemap

```
amritdairy.in
│
├── / ................................................ Home
├── /about ........................................... About Amrit Dairy
│   ├── /about/our-story
│   ├── /about/our-cows ................................ Herd & breeds
│   ├── /about/quality ................................. Quality promise & lab reports
│   ├── /about/facts ................................... Citable facts page (GEO)
│   ├── /about/team
│   └── /about/farm-visit .............................. Book a farm visit
│
├── /products ........................................ All products
│   ├── /products/category/{milk | ghee | curd-buttermilk | paneer | pantry}
│   └── /products/{product-slug} ....................... PRODUCT DETAILS
│         e.g. /products/desi-cow-ghee, /products/desi-cow-milk
│
├── /subscribe ....................................... Milk subscription builder (Phase 3)
├── /how-it-works .................................... Choose qty → schedule → delivered
│
├── /departments ..................................... All departments
│   └── /departments/{slug} ............................ DEPARTMENT DETAILS
│         gaushala-herd-care · milk-collection-milking · bilona-ghee-unit ·
│         quality-lab · cold-chain-logistics · customer-care · b2b-institutional
│
├── /facilities ...................................... All facilities
│   └── /facilities/{slug} ............................. FACILITY DETAILS
│         desi-cow-farm-rajhbhaya · cow-shelters · milking-parlour ·
│         chilling-centre · bilona-ghee-kitchen · quality-testing-lab ·
│         fodder-fields · biogas-compost-unit · delivery-hub-sonipat
│
├── /milk-delivery ................................... Service areas hub (Local SEO)
│   ├── /milk-delivery/sonipat ......................... City hub
│   │   └── /milk-delivery/sonipat/{locality}
│   │         sector-23 · garhi-brahmnan · mayur-vihar · devilal-colony · …
│   ├── /milk-delivery/kundli · /rai · /murthal · … (Stage 2)
│   └── /milk-delivery/delhi · /panipat · /rohtak · … (Stage 3)
│
├── /resources ....................................... Resources hub
│   ├── /blog .......................................... Blog listing
│   │   ├── /blog/category/{slug}
│   │   └── /blog/{post-slug} .......................... BLOG DETAILS
│   ├── /resources/guides/{slug} ....................... How-to / buyer guides
│   ├── /resources/recipes/{slug}
│   ├── /resources/lab-reports ......................... Monthly lab reports (PDF)
│   ├── /resources/glossary
│   ├── /resources/faqs
│   └── /resources/press ............................... Press kit & media mentions
│
├── /news ............................................ Ticker archive / announcements
│   └── /news/{slug}
│
├── /bulk-orders ..................................... B2B / institutional enquiries
├── /careers ......................................... Jobs
│   └── /careers/{slug}
├── /partner-with-us ................................. Distributor / delivery partner (Stage 2+)
├── /contact ......................................... Contact
│
├── /cart · /checkout · /order/{id} .................. Commerce (Phase 2)
├── /account ......................................... Customer dashboard (Phase 3)
│   ├── /account/subscriptions · /orders · /wallet · /addresses · /profile
│
├── /legal
│   ├── /legal/privacy-policy
│   ├── /legal/terms-of-service
│   ├── /legal/refund-cancellation-policy
│   ├── /legal/shipping-delivery-policy
│   ├── /legal/subscription-terms
│   ├── /legal/cookie-policy
│   ├── /legal/disclaimer ............................... Health / nutrition disclaimer
│   └── /legal/grievance-redressal ...................... E-Commerce Rules 2020 grievance officer
│
├── /search · /404 · /500
├── /sitemap.xml · /robots.txt · /llms.txt · /llms-full.txt · /manifest.webmanifest
└── /hi/... .......................................... Hindi mirror (Phase 3)
```

## 2. URL & slug rules
- Lowercase, hyphenated, English slugs, including under `/hi/`, so URLs stay stable.
- No dates in blog URLs, so posts stay evergreen.
- No trailing slash. Keep URLs ≤ 3 levels deep where possible.
- Every slug is editable in Payload. Changing a slug **automatically creates a 301** in the Redirects collection (via a hook).

## 3. Navigation

### 3.1 Header (desktop)
```
[Ticker bar ─ "🟢 Now delivering in Mayur Vihar • Diwali ghee gift packs live • Farm open day 12 Oct →" ⏸]
[Logo]  Products ▾  Our Farm ▾  Delivery Areas  Resources ▾  About ▾  Contact   [📍 Sector 23 ✓] [WhatsApp] [🛒] [👤]  [Start Free Trial]
```

| Menu | Children (mega-menu) |
|---|---|
| **Products** | Milk · Ghee · Curd & Buttermilk · Paneer · Pantry (Honey, Mustard Oil) · *Featured card: Desi Cow Ghee* |
| **Our Farm** | Departments · Facilities · Our Cows · Quality & Lab Reports · Book a Farm Visit |
| **Delivery Areas** | Link to `/milk-delivery` with the pincode checker inline |
| **Resources** | Blog · Guides · Recipes · Lab Reports · FAQs · Glossary · News |
| **About** | Our Story · Team · Facts · Careers · Bulk Orders · Partner With Us |

### 3.2 Header (mobile)
Ticker (1 line) → Logo · pincode chip · hamburger. Sticky bottom bar: **[WhatsApp] [Call] [Start Trial]**. The hamburger opens a full-screen accordion menu.

### 3.3 Footer
| Column 1 | Column 2 | Column 3 | Column 4 |
|---|---|---|---|
| Logo, one-line promise, NAP, map link, FSSAI no., socials | Products, Subscribe, How it works, Bulk orders | Our Farm, Departments, Facilities, Resources, Blog, News, Careers | Delivery areas list (internal links for local SEO) |

Bottom row: © Amrit Dairy · Legal links · newsletter input · "Made with care in Sonipat".

## 4. Page-by-page blueprints

Section order is top → bottom. **[CMS]** means editable via Payload blocks or fields.

### 4.1 Home `/`
| # | Section | Content | Goal |
|---|---|---|---|
| 0 | Ticker | Latest 3–5 active items [CMS] | News and freshness |
| 1 | **Hero** | H1: "Desi cow milk from our own farm in Sonipat". Sub: "250 desi cows. Delivered to your door every morning." Primary CTA **Check delivery in your area** (pincode input inline), secondary CTA **Order on WhatsApp**. Background: real farm video or photo | Serviceability + conversion |
| 2 | Trust strip | 250+ desi cows · Own farm, Garhi Brahmnan · Prepaid & transparent · Delivered before 7 AM 🟡 | Instant credibility |
| 3 | Product highlights | Cards: Desi Cow Ghee (available), Milk, Curd, Paneer (coming soon + Notify), Honey, Mustard Oil | Discovery |
| 4 | How it works | 3 steps: Choose quantity → Choose schedule → We deliver | Remove friction |
| 5 | Farm-to-home story | Split media: our cows → milking → bilona → cold chain → your door (links to Facilities) | Differentiation |
| 6 | Why Amrit vs others | Comparison table: Amrit vs packet milk vs loose milk (traceable, desi, tested, delivered) | Objection handling |
| 7 | Quality & lab reports | Latest report card (fat %, SNF, adulteration: negative) + link | Proof |
| 8 | Testimonials | Locality-tagged reviews, plus video | Social proof |
| 9 | Delivery areas | Map + list of live and coming-soon areas + waitlist | Local SEO + expansion demand |
| 10 | From the blog | 3 latest or pinned posts | Content/SEO |
| 11 | FAQ | 6–8 questions (FAQPage schema) | AEO |
| 12 | Final CTA band | "Try Amrit for 3 days" + WhatsApp | Conversion |

### 4.2 About `/about` (+ sub-pages)
Hero (founder photo + quote) → Our story timeline (Timeline block) → Mission / Vision / Values → Our cows (breed cards + herd stats) → Our promise (4 pillars) → Team → Facts snapshot (link to `/about/facts`) → Farm visit CTA.

**`/about/facts`** (GEO page): plain, structured, dated key-value list: legal name, founded, founder, address, coordinates, herd size and breeds, products, prices, service areas, delivery timings, certifications, lab-test frequency, contact, "Last updated: {date}". No marketing adjectives.

### 4.3 Products `/products` and Product Details `/products/{slug}`
**Listing:** H1 + intro → category chips → filter (Delivered locally / Ships across India) → product grid (image, name, size, price, badge, quick "Add / Subscribe / Notify") → comparison or FAQ → CTA.

**Product details (PDP)**
| # | Section |
|---|---|
| 1 | Breadcrumb |
| 2 | Gallery (pack, texture, farm context, video) · Name (H1) · rating · price (₹, per unit) · variant selector · **delivery check** (pincode) · CTAs: *Add to cart* / *Subscribe & save* / *Order on WhatsApp* / *Notify me* (if coming soon) · trust icons |
| 3 | Short "Why it's different" bullets (3–5) |
| 4 | How it's made: step-by-step process (e.g. Bilona: milk → curd → hand-churn → makkhan → slow-heat → ghee) with photos (HowTo schema) |
| 5 | Nutrition & specs table · shelf life · storage · ingredients · FSSAI no. |
| 6 | Lab report for this batch (PDF) |
| 7 | Reviews |
| 8 | FAQs (product-specific) |
| 9 | Related products + "Pairs well with" |
| 10 | Sticky mobile buy bar |

### 4.4 Departments `/departments` and Department Details `/departments/{slug}`
**Listing:** Hero ("The people and teams behind every drop") → department cards (icon, name, 1-line purpose, head, team size) → org overview diagram → Careers CTA.

**Department details**
| # | Section |
|---|---|
| 1 | Hero: department name (H1), purpose statement, photo of the team at work |
| 2 | What we do: responsibilities list |
| 3 | Head of department: photo, name, credentials, quote (E-E-A-T) |
| 4 | Process / SOPs highlight (e.g. Herd Care: vet checks, feed plan, no-hormone policy) |
| 5 | Key numbers (Stats block): e.g. "250 cows · 2 vet visits/week · 0 hormones" 🟡 |
| 6 | Related facilities (cards → Facility details) |
| 7 | FAQs |
| 8 | Contact this department / open roles |

Suggested departments: *Gaushala & Herd Care · Milking & Collection · Bilona Ghee & Products · Quality Assurance Lab · Cold Chain & Delivery · Customer Care · B2B & Institutional Sales.* 🟡 Confirm the list with the business.

### 4.5 Facilities `/facilities` and Facility Details `/facilities/{slug}`
**Listing:** Hero (aerial farm shot) → interactive farm map (hotspots → facilities) → facility cards → "Book a farm visit" CTA.

**Facility details**
| # | Section |
|---|---|
| 1 | Hero: facility name (H1), location on the farm, hero image/video |
| 2 | Overview: what happens here, and why it matters for the customer |
| 3 | Capacity & specs (Stats): e.g. shelter area, cows housed, chilling capacity (L), temperature 🟡 |
| 4 | Process walkthrough (step cards with photos) |
| 5 | Hygiene & safety standards (SOP highlights, certifications) |
| 6 | Gallery / 360° tour / video |
| 7 | Managed by (Department link) |
| 8 | Visit info (if visitable): timings, booking CTA |
| 9 | FAQs |

### 4.6 Delivery areas `/milk-delivery/...` (local SEO engine)
**Hub:** H1 "Milk delivery in Sonipat & nearby" → pincode checker → map with live (green), coming soon (gold) and waitlist areas → city list → waitlist leaderboard ("Most requested next: Kundli").
**Locality page:** H1 "Desi cow milk delivery in {Locality}, {City}" → live status + slots + minimum order → distance from farm ("12 km from our farm, delivered within X hours of milking" 🟡) → local landmarks covered → local testimonials → products available here → locality FAQ → CTA. Each page needs **unique** copy (see PRD §6.2).

### 4.7 Resources `/resources` and Blogs `/blog`
**Resources hub:** Hero with search → featured guide → tiles (Blog, Guides, Recipes, Lab Reports, FAQs, Glossary, Press) → latest posts.
**Blog listing:** category tabs → featured post → grid (cover, category, title, excerpt, read time, date) → pagination (crawlable `?page=2` links) → newsletter CTA.
**Blog details:**
| # | Section |
|---|---|
| 1 | Breadcrumb · category · H1 · author (photo, credentials) · published / updated date · reading time |
| 2 | **TL;DR box** (AEO/GEO) |
| 3 | Table of contents (sticky on desktop) |
| 4 | Body: question-led H2s, answer-first paragraphs, tables, images, callouts, product embeds |
| 5 | **Key takeaways** |
| 6 | FAQs (FAQPage schema) |
| 7 | Sources / references |
| 8 | Author bio box |
| 9 | Related posts + product CTA |
| 10 | Share (WhatsApp first) |

### 4.8 Ticker & News `/news`
- **Ticker component** (global, top of every page): items from the `Ticker` collection. Fields: `text` (≤ 90 characters), `link`, `type` (new area / offer / event / notice / product launch), `startAt`, `endAt`, `priority`, `areas` (optional: show only to visitors from matching areas), `active`.
- Behaviour: CSS marquee that pauses on hover/focus, with a ⏸ button. On mobile it shows one item at a time (fade rotation, 5 s). With reduced-motion enabled, the items are shown as a static list. Hide it entirely when there are no active items.
- **`/news`** archive: every ticker item that has a detail page (launches, events, notices), so the news is also indexable (`NewsArticle` schema).

### 4.9 Contact `/contact`
Hero ("We're a WhatsApp away") → contact cards: WhatsApp · Call · Email · Farm address (with **Get directions**) → contact form (subject routing: order / subscription / bulk / farm visit / feedback / other) → embedded map → business hours → department contacts → FAQs → grievance officer details (legal requirement).

### 4.10 Legal pages `/legal/*`
Simple readable template: H1 · "Effective date" and "Last updated" · table of contents · content (Lexical) · contact for questions. Required pages: Privacy Policy (DPDP Act 2023), Terms of Service, Refund & Cancellation, Shipping & Delivery, Subscription Terms (pause/skip cut-offs, wallet rules), Cookie Policy, Health Disclaimer, Grievance Redressal. Pages are `noindex` only if the business prefers; the default is indexable.

### 4.11 Supporting pages
| Page | Key sections |
|---|---|
| `/how-it-works` | 3 steps · delivery timing · payment methods · pause/skip · FAQ |
| `/subscribe` | Stepper: area → product & quantity → frequency → slot → start date → account → pay (wallet top-up) |
| `/bulk-orders` | Segments (cafés, sweet shops, hostels, institutions) · capacity · B2B form |
| `/careers` | Culture · open roles (JobPosting schema) · application form |
| `/partner-with-us` | Distributor / delivery-partner model · requirements · form |
| `/about/farm-visit` | What you'll see · timings · group rules · booking form · directions |
| `/account/*` | Dashboard: next delivery, wallet balance, calendar (pause/skip), orders, invoices |

## 5. Content model ↔ template map

| Template | Payload collection | Rendering |
|---|---|---|
| Home, About, How it works, static pages | `Pages` (blocks) | SSG + on-demand ISR |
| Product listing/details | `Products`, `Categories` | SSG + ISR (price/stock revalidated on change) |
| Department listing/details | `Departments` | SSG + ISR |
| Facility listing/details | `Facilities` | SSG + ISR |
| Area hub/locality | `ServiceAreas` | SSG + ISR |
| Blog / resources | `Posts`, `Resources`, `Authors` | SSG + ISR |
| Ticker / news | `Ticker` | Rendered in the layout; revalidated by tag |
| Legal | `LegalPages` | SSG |
| Cart / checkout / account | `Orders`, `Subscriptions`, `Customers` | Dynamic (no cache), `noindex` |

## 6. Internal linking strategy
- Home → categories → products → process (facilities) → quality (departments/lab) → back to product. This loop keeps visitors moving toward a purchase and helps SEO.
- Every blog post links to at least 1 product, 1 area hub and 1 related post.
- Every area page links to its city hub, 2 neighbouring areas and the top products.
- The footer lists all live delivery areas.
- Facilities ↔ Departments cross-link to each other.

## 7. Page-level SEO templates (defaults, editable per page)

| Template | Title pattern | H1 pattern |
|---|---|---|
| Home | Desi Cow Milk & Ghee Delivery in Sonipat · Amrit Dairy | Desi cow milk from our own farm in Sonipat |
| Product | {Product} {Size} · Pure Desi Cow {Category} · Amrit Dairy Sonipat | {Product} |
| Area | Milk Delivery in {Locality}, {City} · Desi Cow Milk · Amrit Dairy | Desi cow milk delivery in {Locality} |
| Blog | {Post title} · Amrit Dairy | {Post title} |
| Department | {Department} · Amrit Dairy Farm, Sonipat | {Department} |
| Facility | {Facility} at Amrit Dairy Farm, Sonipat | {Facility} |
