# Amrit Dairy: E-commerce Website

The bilingual (English + हिंदी) online store for **Amrit Dairy, Sonipat**, built from the planning documents in [`docs/`](docs/README.md).

**Stack:** Next.js 15 (App Router) · Payload CMS 3 (admin at `/admin`) · Neon Postgres · Resend (email) · Razorpay (payments) · Vercel (hosting) · Tailwind CSS 4

## What's included

| Area | Details |
|---|---|
| **Store** | Home, Shop + collections (with "Delivered in Sonipat / Ships across India" filters), product pages with pack sizes, cart drawer + cart page, 3-step checkout, order confirmation |
| **Payments** | Razorpay Checkout (UPI first), signature verification and webhook. **Without Razorpay keys**, checkout still works: the order is saved and the customer is sent to WhatsApp to pay by UPI (today's process) |
| **Delivery** | Pincode checker. Fresh items (milk, dahi, paneer) only sell to live Sonipat areas; ghee, achar, honey and oil ship anywhere in India. Delivery areas are managed in the admin |
| **Safety** | Prices are recalculated on the server; ₹0, coming-soon and on-demand items can't be bought; rate-limited forms with a spam honeypot |
| **Content** | Farm Story, Desi Cows (18 breeds + detail pages), About + facts, Departments + details, Facilities + details, Blog + posts, News, Contact, Delivery areas, Subscribe, Bulk orders, Legal pages |
| **Ticker** | Scrolling announcement bar on every page (pausable), managed in the admin under "Ticker & news" |
| **Forms → admin + email** | Contact, cow buy/sell, bulk order, milk subscription, "Notify me", area waitlist. All saved under **Enquiries** in the admin |
| **Bilingual** | English at `/…`, Hindi at `/hi/…`. The English site keeps Hindi headlines and labels like the current site. Every CMS field is editable in both languages |
| **SEO / AEO / GEO** | Per-page titles and descriptions, canonical + hreflang, JSON-LD (Organization, Product, Breadcrumb, FAQ, BlogPosting), `sitemap.xml`, `robots.txt` (allows AI crawlers), `/llms.txt`, 301s from old Shopify URLs |
| **Quality** | TypeScript strict, ESLint clean, axe accessibility scan: 0 violations on key pages |

## Run locally

Requires Node 20+, pnpm and Postgres (or a Neon dev branch).

```bash
pnpm install
cp .env.example .env          # set DATABASE_URL, PAYLOAD_SECRET, SEED_ADMIN_EMAIL/PASSWORD
pnpm seed                     # loads the 20 products, breeds, pages… (EN + HI) and creates the admin user
pnpm dev                      # http://localhost:3000   · admin: http://localhost:3000/admin
```

`SEED_FORCE=1 pnpm seed` wipes the seeded content and loads it again.

## Deploy (Vercel + Neon)

1. Create a Neon project and copy the **pooled** connection string.
2. Import this repo into Vercel and set the environment variables from `.env.example`:
   `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://amritdairy.in`, `BLOB_READ_WRITE_TOKEN` (create a Vercel Blob store for image uploads), `RESEND_API_KEY` + `EMAIL_FROM`, `ORDER_NOTIFY_EMAIL`, and the `RAZORPAY_*` keys.
3. Deploy. Database tables are created automatically from `src/migrations` on first start.
4. Load the starter content once, from your computer, pointing at Neon:
   `DATABASE_URL=<neon url> NODE_ENV=production pnpm seed`
5. In Razorpay, add a webhook to `https://amritdairy.in/api/razorpay/webhook` (events `payment.captured`, `order.paid`) using `RAZORPAY_WEBHOOK_SECRET`.
6. In Resend, verify the sending domain (e.g. `mail.amritdairy.in`).
7. Point the domain to Vercel and submit `https://amritdairy.in/sitemap.xml` in Google Search Console.

> ⚠️ Don't run `pnpm dev` against the production database: dev mode auto-syncs the schema. When you change collections, run `pnpm migrate:create <name>` and commit the migration.

## Before going live (owner checklist)

- [ ] **Prices** for the "Coming soon" products (milk, dahi, paneer, buttermilk, butter, cream, mustard oil, 11 achars). Set a price and switch status to **Active** in Admin → Products
- [ ] **Delivery settings** in Admin → Site settings: the free-delivery threshold (₹999), local fee (₹30) and shipping fee (₹99) are **placeholders**. Also confirm the pincodes for each delivery area (all set to 131001)
- [ ] **Legal pages**: starter texts, to be reviewed by your legal advisor/CA. Add the grievance officer's name
- [ ] **Photos**: 7 products use a "Photo coming soon" image; the farm, department and facility pages need real farm photos
- [ ] **Departments & facilities**: starter texts; add team heads and verified facts
- [ ] **Honey**: renamed "Raw Forest Honey" (the site no longer says "Organic") until you have organic certification
- [ ] **Social links** (Facebook / Instagram / YouTube) in Site settings
- [ ] **Keys**: Razorpay live keys, Resend API key, Vercel Blob token

## Project structure

```
src/
  app/(frontend)/[locale]/   storefront pages (en + hi)
  app/(payload)/             Payload admin + REST/GraphQL API
  app/api/                   checkout, payment verify, Razorpay webhook, pincode, leads
  collections/ globals/      CMS schema (Products, Orders, Enquiries, Breeds, …)
  components/                UI (header, ticker, cart, product card, forms…)
  i18n/                      English + Hindi UI text
  lib/                       queries, orders/pricing, Razorpay, SEO helpers
  seed/                      starter content (EN + HI)
seed-media/                  product, category and breed images from the current site
docs/                        planning documents 01–07
```
