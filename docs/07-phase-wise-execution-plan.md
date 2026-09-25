# 07 · Phase-wise Execution Plan — Amrit Dairy E-commerce Website

> How we go from today's Shopify + WhatsApp setup to a full e-commerce platform (Next.js + Payload CMS + Neon + Resend + Vercel) that supports the business plan: **dominate Sonipat → 50 km → 100 km → India**.
> Timeline assumes a small team (see §2) and 1-week sprints. Durations are estimates; adjust after Phase 0.

---

## 1. Phases at a glance

| Phase | Name | Weeks | Business stage it unlocks | Key outcome |
|---|---|---|---|---|
| **0** | Discovery, content & setup | 1–2 | — | Facts, prices, photos, accounts and the migration inventory are ready |
| **1** | UX/UI design | 2–5 | — | Approved Stitch → Figma designs + design system |
| **2** | Build & launch the store (MVP) | 5–12 | **Stage 1: Sonipat** (one-time orders) + pan-India ghee/achar shipping | Live e-commerce store with Razorpay checkout, replacing Shopify |
| **3** | Subscriptions & wallet | 13–18 | **Stage 1: own Sonipat** (daily milk) | Automated milk subscriptions, phone OTP, delivery manifests |
| **4** | Growth engine | 19–28 | **Stage 2: 50 km** | SEO/AEO/GEO content, area pages, reviews, referrals, Merchant Center, courier API, delivery staff view |
| **5** | Scale | 29+ (ongoing) | **Stage 3: 100 km → Stage 4: India** | WhatsApp API, hub model, marketplaces, B2B, national shipping at scale |

```
Week:     1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 ... 28 29 →
Phase 0  ██ ██
Phase 1     ██ ██ ██ ██
Phase 2              ██ ██ ██ ██ ██ ██ ██ ██ 🚀 Store launch (end of wk 12)
Phase 3                                      ██ ██ ██ ██ ██ ██ 🚀 Subscriptions live (wk 18)
Phase 4                                                        ██ ........ ██
Phase 5                                                                       ██ →
```

## 2. Team & responsibilities

| Role | Who | Responsibility |
|---|---|---|
| Business Owner | Amrit Dairy | Decisions, prices, policies, content approval, operations readiness |
| UI/UX Lead | Designer | Personas, flows, Stitch prompts → Figma, design system, usability tests |
| Tech Lead / Full-stack (1–2) | Developers | Next.js + Payload, integrations, DevOps, QA automation |
| Content & SEO | Writer / SEO specialist | Product copy (EN/HI), blog, area pages, schema, GEO |
| Photographer / Videographer | Freelancer | Farm shoot, packshots for all SKUs, process videos |
| Operations Lead | Amrit staff | Order processing in the admin, packing, delivery, customer care |
| CA / Legal advisor | External | GST/HSN rates, legal pages, claims review (A2, organic) |

**RACI for key decisions**
| Decision | Owner (A) | Consulted |
|---|---|---|
| Prices, delivery fees, COD, return policy | Business Owner | Ops Lead, CA |
| Design approval | Business Owner | UI/UX Lead |
| Tech architecture (ecommerce plugin vs custom) | Tech Lead | UI/UX Lead |
| Health / A2 / organic claims | Business Owner | Legal advisor |
| Launch go/no-go | Business Owner | All leads |

---

## Phase 0 — Discovery, content & setup (Weeks 1–2)

**Goal:** Remove every "🟡 to confirm" from Docs 01–05 and have all accounts and assets ready.

| # | Task | Owner | Output |
|---|---|---|---|
| 0.1 | Owner workshop: confirm legal/trade name, founder story, year founded, breeds and counts | Owner + UX | Updated Doc 01 |
| 0.2 | **Price & pack sheet for all 20 SKUs** (incl. milk ₹/L, 5/10 kg kettles, achar, oil, butter, cream, paneer, curd, buttermilk) + HSN/GST rates from the CA | Owner + CA | Catalogue spreadsheet |
| 0.3 | Commerce policies: delivery fee, free-delivery threshold, cut-off time, slots, minimum order, returns, COD (off), pan-India launch scope (NCR first or all India) | Owner + Ops | Policy sheet |
| 0.4 | Claims review: "A2", "Organic", "100 % pure", "50,000+ families" → decide the final wording | Owner + Legal | Approved claims list |
| 0.5 | **Farm photo/video shoot** + consistent packshots for every SKU | Photographer | Media library |
| 0.6 | Shopify export: products, customers, orders, the full URL list, policy texts; GSC data | Tech Lead | Migration inventory + 301 draft |
| 0.7 | Accounts: Vercel (Pro), Neon, Resend (verify `mail.amritdairy.in`), Razorpay (KYC, live keys, webhook), Shiprocket, Cloudflare Turnstile, Google (GSC, GA4, Merchant Center, Business Profile), Sentry, GitHub repo | Tech Lead + Owner | Access checklist ✅ |
| 0.8 | Collect 20+ genuine customer reviews (WhatsApp outreach to existing customers) | Owner | Reviews to import |
| 0.9 | Keyword research (local + national + achar + cow queries) and 20 GEO tracking prompts | SEO | Keyword map |

**Exit criteria:** price sheet signed off · policies decided · shoot done or scheduled · all accounts active · migration inventory complete.

---

## Phase 1 — UX/UI design (Weeks 2–5)

| Week | Work | Output |
|---|---|---|
| 2 | Information architecture sign-off (Doc 05); user flows: browse → buy, subscribe, track, cow enquiry | Flow diagrams |
| 3 | **Google Stitch** generation using Doc 06: Home, Shop, Product, Cart, Checkout, Confirmation (mobile + desktop) | Stitch screens |
| 3–4 | Move to Figma; build the **design system** (tokens, type, components, all e-commerce states) | Figma library |
| 4 | Remaining screens: Account, Subscribe, Track order, Farm Story, Desi Cows, Departments, Facilities, Blog, Contact, Legal, 404; Hindi variants of the key screens | Full UI kit |
| 5 | **Usability test** with 5–6 real customers (Sonipat moms + 1–2 young couples) on a clickable prototype: find ghee → add → checkout. Fix the issues found | Test report + revised designs |
| 5 | Dev handoff: specs, component states, copy deck (EN/HI) | Handoff pack |

**Exit criteria:** owner approval of the Home, Product, Cart and Checkout designs · usability task success ≥ 80 % · component sheet complete.

---

## Phase 2 — Build & launch the store (Weeks 5–12) 🚀

**Goal:** Replace Shopify with our own store. Customers can buy online (local fresh orders + pan-India shipping for shelf-stable products) with automatic payment confirmation.

### Sprint plan
| Sprint (week) | Deliverables |
|---|---|
| **S1 (wk 5–6): Foundation** | Repo, Next.js 15 + Payload 3 + Neon (pooled URL, branch per preview), Vercel preview/prod, Tailwind + Doc 03 tokens, fonts (Fraunces, Noto Serif Devanagari, Mukta), i18n routing (`en`/`hi`), auth for admins, Media → Vercel Blob, Resend adapter, Sentry, CI (lint, typecheck, Vitest, Playwright). **Spike: Payload ecommerce plugin vs custom collections**, then decide |
| **S2 (wk 7): Catalogue & content** | Collections: Products/Variants, ProductCollections, ServiceAreas, Pages (blocks), Breeds, Ticker, FAQs, LegalPages, SiteSettings. Header (pill + mascot), ticker, footer, mobile bottom nav. Home, Shop, Product pages. **Import 20 SKUs** from Shopify CSV. ₹0 validation hook |
| **S3 (wk 8): Cart & checkout** | Cart (drawer + page, guest cookie, merge on login), pincode checker + serviceability logic, split shipments, coupons (basic), 3-step checkout, **Razorpay** (order create, Checkout.js, signature verify, webhooks, idempotency), order confirmation page |
| **S4 (wk 9): Orders & ops** | Order lifecycle + admin views, inventory decrement + low-stock alert, **GST invoice PDF**, packing slip, **daily local delivery manifest (CSV/PDF)**, track-order page, email-OTP / magic-link customer accounts (orders, addresses, invoices), Notify-me, Resend templates (order, payment failed, shipped, delivered, notify-me, lead auto-replies) |
| **S5 (wk 10): Brand & content pages** | Farm Story, Desi Cows hub + breed pages, Contact (+ Leads + Turnstile), About + Facts, Legal pages, Blog templates + 6 posts, Bulk order request form, Cow enquiry form, Delivery hub + 4 area pages. Hindi content for Home/Shop/Product/Cart/Checkout |
| **S6 (wk 11): SEO, performance, migration** | JSON-LD (Organization, LocalBusiness, Product/Offer, Breadcrumb, FAQ, Article), sitemaps, robots, `llms.txt`, hreflang, OG images, **Shopify 301 map**, Lighthouse and axe fixes, GA4 e-commerce events, consent banner (DPDP) |
| **S7 (wk 12): QA & launch** | Full regression (Playwright: browse → pay in Razorpay test mode), device testing (low-end Android, iPhone), security review (OWASP checklist, access control), **ops dry-run** (staff process 20 test orders end-to-end), content freeze, **DNS cut-over**, live-mode payment test (₹1 order + refund), GSC sitemap submit, Shopify kept read-only for 30 days |

### Launch-day runbook
1. T-7 days: lower DNS TTL; freeze Shopify catalogue changes.
2. T-1: final data sync (new Shopify orders/customers); verify the 301s on staging.
3. Launch: switch DNS → Vercel; switch Razorpay to live keys; place a real order; verify webhook, email, invoice and manifest.
4. T+1 to T+14: daily checks of GSC coverage and 404s, Sentry errors, payment reconciliation, conversion funnel. Hypercare channel with the owner on WhatsApp.

**Exit criteria (= PRD §12 acceptance):** real orders flowing online · zero ₹0 prices · Lighthouse ≥ 90 · all 301s working · legal pages live · staff trained on the admin.

**Phase KPIs (first 30 days):** ≥ 50 % of orders placed online · checkout conversion ≥ 1.5 % · payment success ≥ 95 % · no P1 bugs open.

---

## Phase 3 — Subscriptions & wallet (Weeks 13–18) 🚀

**Goal:** Automate daily milk (and buttermilk/curd) delivery to **win Sonipat**.

| Week | Deliverables |
|---|---|
| 13 | Data model: Subscriptions, WalletTransactions, Deliveries; business rules (cut-off 9 PM, slots, pause/skip, bottle deposits if applicable) |
| 14 | **Subscription builder** (`/subscribe`) + wallet top-up (Razorpay) + trial pack |
| 15 | Account: subscription calendar (pause, skip, change qty, add one-time items), wallet ledger |
| 16 | Daily jobs (Vercel Cron → Payload Jobs): generate tomorrow's deliveries at the cut-off, debit the wallet on delivery, low-balance alerts, monthly statements; manifest merges subscriptions + one-time orders |
| 16 | **Phone OTP login** (MSG91 / Twilio Verify) |
| 17 | Delivery staff mobile view (read-only manifest + mark delivered/failed) *(pull forward from Phase 4 if ops need it)* |
| 18 | Pilot with 30–50 existing WhatsApp customers → fix → public launch; move all manual subscribers to online accounts |

**Exit criteria:** ≥ 80 % of existing subscribers migrated · wallet reconciliation matches 100 % for 2 weeks · < 1 % missed deliveries caused by the system.
**KPIs:** active subscriptions, churn < 8 %/month, average wallet top-up, on-time delivery ≥ 97 %.

**Business moves in parallel (Stage 1, dominate Sonipat):** pincode waitlist data → open 2–4 new sectors per month; society activations (TDI, Omaxe, Parker); Google Business Profile reviews after every delivery; referral via WhatsApp share.

---

## Phase 4 — Growth engine (Weeks 19–28), Stage 2: 50 km

| Track | Deliverables |
|---|---|
| **SEO / AEO / GEO content** | 2 blog posts/week (Bilona, ghee purity tests, breed guides, achar recipes, milk storage); glossary; lab-report pages monthly; Facts page updates; monthly GEO prompt tracking |
| **Local SEO** | Area pages for every new locality (unique content), Sonipat district towns (Kundli, Rai, Murthal, Ganaur, Gohana) and North Delhi pages as delivery goes live; GBP posts weekly |
| **Commerce growth** | Photo reviews + review-request emails, referral programme (wallet credit), combos/gift packs, abandoned-cart emails, back-in-stock, free-delivery nudges, festive landing pages (Diwali, weddings) |
| **Feeds & ads** | **Google Merchant Center** feed (free listings → Shopping ads), Meta catalogue, GA4 audiences |
| **Shipping** | **Shiprocket API** (rates, AWB, labels, tracking webhooks); breakage-tested packaging; NCR → metro shipping expansion |
| **Content modules** | **Departments** and **Facilities** pages with detail pages, Cows for Sale listings, Resources hub (guides, recipes, lab reports) |
| **Ops** | Multi-hub support in ServiceAreas (hub → areas), route grouping in manifests |

**Exit criteria:** 3+ new service areas live via the CMS only · Merchant Center approved · organic traffic +100 % vs launch month.
**KPIs:** top-3 rankings for 15 local keywords · repeat purchase rate ≥ 35 % · AOV +25 % · GEO citation in ≥ 30 % of tracked prompts.

---

## Phase 5 — Scale (Week 29 onward), Stage 3: 100 km → Stage 4: India

| Track | Deliverables |
|---|---|
| **Channels** | WhatsApp Business Cloud API (order and delivery notifications, catalogue sync); Amazon / Flipkart / BigBasket listings for ghee, achar and honey (managed outside the site, stock-synced) |
| **Payments** | COD for shipped orders (feature flag, pincode rules, fee), if RTO data supports it |
| **B2B** | Bulk/B2B portal: GST invoices, credit terms, reorder lists for sweet shops, cafés and hostels |
| **Geography** | Delhi NCR, Panipat and Rohtak hubs (partner or own); metro fast-shipping lanes; international/NRI gifting (later) |
| **Experience** | PWA install + push notifications, recipe/video hub, farm visit booking, careers and distributor pages, loyalty tiers |
| **Platform** | Performance and cost review (Neon autoscaling, ISR tuning), data warehouse/BI dashboard (orders, cohorts, LTV) |

**KPIs:** revenue share outside Sonipat ≥ 40 % · national ghee keyword rankings on page 1 · marketplace + D2C blended CAC within target.

---

## 3. Budget guide (indicative, verify current vendor pricing)

**Monthly running costs at launch**
| Item | Indicative cost |
|---|---|
| Vercel Pro | ~US$20 per team member / month + usage |
| Neon Postgres | Usage-based; roughly US$5–20 / month at launch scale |
| Resend | Free tier (3,000 emails/month) → ~US$20/month plan as volume grows |
| Razorpay | Per-transaction fee (≈ 2 % standard; check current UPI/card rates) |
| Shiprocket | Per-shipment courier charges (weight/zone) |
| Vercel Blob / media | Usage-based, low |
| Sentry, Turnstile, GA4, GSC, Merchant Center | Free tiers |
| MSG91 / Twilio OTP (Phase 3) | Per-SMS charges |
| WhatsApp Cloud API (Phase 5) | Per-conversation charges |

**One-time costs:** design + development (team-dependent), photo/video shoot, packaging design for new SKUs, legal/CA review.

## 4. Risk register

| Risk | Phase | Mitigation |
|---|---|---|
| Prices and content not ready on time | 0–2 | Phase 0 sign-off gate; "Coming soon" template allowed, ₹0 never |
| Payload ecommerce plugin doesn't fit subscriptions | 2 | Spike in S1; fall back to custom collections |
| SEO drop after the Shopify migration | 2 | Full 301 map, same slugs, pre-launch crawl, 14-day hypercare |
| Payment/webhook failures | 2–3 | Idempotency, retries, daily reconciliation, alerts |
| Ops overwhelmed by online orders | 2–3 | Manifests, cut-offs, staff training, phased rollout |
| Glass breakage in shipping | 2–4 | Packaging tests; start with NCR; replacement policy |
| Regulatory issues on claims | 0 → ongoing | Claims list approved by the legal advisor; editorial policy |
| Scope creep | All | Changes go to the next phase unless they are launch blockers |

## 5. Governance & rituals
- **Weekly:** 30-min demo + decisions with the owner (preview URL on Vercel).
- **Sprint board:** GitHub Projects (Backlog → In progress → Review → Done).
- **Definition of Done:** designed states implemented · EN + HI copy · mobile tested · a11y checked · analytics event added · docs/CMS help updated · merged with green CI.
- **Monthly (after launch):** KPI review (sales, conversion, subscriptions, SEO, GEO prompts), content calendar planning, area-expansion decision from waitlist data.

## 6. Immediate next steps (this week)
1. Owner fills the **price & policy sheet** and answers PRD §13 open questions.
2. Book the **farm + packshot shoot**.
3. Start the Razorpay live KYC, Resend domain verification and Google Business Profile claim (they take days).
4. Export all Shopify data and URLs.
5. Designer starts Google Stitch with Doc 06 §1 (Home) and §3.2 (Product page).
