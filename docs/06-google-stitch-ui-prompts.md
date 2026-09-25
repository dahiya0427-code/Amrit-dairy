# 06 · UI/UX Design Prompts for Google Stitch — Amrit Dairy

> **How to use:** Stitch works best **one screen at a time**, with a consistent design brief repeated each time.
> 1. Paste the **Master Design Brief** (§1) first to create the Home screen.
> 2. For each following screen, paste the **short style reminder** (§2) followed by that screen's prompt (§3).
> 3. Generate both **Mobile (390 px)** and **Desktop (1440 px)** variants. Most users are on Android phones, so review mobile first.
> 4. Iterate with small, targeted follow-ups (§4) rather than re-prompting everything.
> 5. Export to Figma or copy the HTML/Tailwind, then hand off to development against Doc 03 tokens.

---

## 1. Master Design Brief (paste first)

```
Design a modern, premium-but-warm website for "Amrit Dairy", a farm-owned desi cow dairy in Sonipat, Haryana, India. The brand keeps its own herd of ~250 desi (humped Indian breed) cows at its farm in Rajhbhaya, Garhi Brahmnan, Sonipat, and delivers fresh milk and traditional products (desi cow ghee, curd, buttermilk, paneer, honey, mustard oil) directly to homes. Brand promise: "Real products, honest information and careful handling." Concept: "Farm Morning" — first light on the farm, calm, honest, trustworthy, rooted in Indian/Haryanvi tradition with modern app-like convenience.

AUDIENCE: Indian families (mothers aged 30–50 managing household health), young working couples in gated societies, quality-obsessed buyers who want proof. Mostly on Android phones. Must feel trustworthy to older users and slick to younger ones.

COLOR PALETTE:
- Primary "Amrit Field Green" #1F4D3A (header, primary buttons, headings, footer)
- Hover green #2E6B4F; mint tint #E4EFE8 for soft section backgrounds
- Accent "Golden Ghee" #E0A526 (badges, highlights, one accent CTA per screen with dark text #1E1C19)
- Gold text on light backgrounds: #8A5A00
- Background "Fresh Milk" cream #FBF7EE; card surface "Malai" #F3EAD6 or white
- Earthy brown #6B4A33 for story accents
- Text ink #1E1C19, muted text #5A554D, borders #E2D9C6
- Use 60% cream, 30% green, 10% gold.

TYPOGRAPHY: Headings in "Fraunces" (soft serif, semibold, sentence case). Body and UI in "Inter". Body 16px min, generous line height 1.6. Prices in Inter semibold with ₹ symbol and Indian number format (₹3,500).

STYLE: Clean layout with generous whitespace, 12-column grid, max content width 1200px. Rounded corners (cards 14px, buttons fully pill-shaped, 48px tall). Soft subtle shadows. Thin outlined icons (Lucide style, 1.75px stroke) plus simple custom line icons of a desi cow with hump, milk can, bilona churner, kalash, drop of milk. Photography: REAL Indian desi cows (Sahiwal/Gir/Hariana — brown or white with humps, never black-and-white Holstein), warm golden-hour light, steel milk cans, brass vessels, Haryana fields, Indian families. Line illustrations in green with gold fills. Subtle motion only.

GLOBAL ELEMENTS on every page:
1. A slim news ticker bar at the very top (green background, cream text, gold dot separators, pause button) e.g. "Now delivering in Mayur Vihar • Diwali ghee gift packs are live • Farm open day on 12 Oct".
2. Header: logo (desi cow line icon inside a drop shape + "Amrit Dairy" wordmark), nav (Products, Our Farm, Delivery Areas, Resources, About, Contact), a location chip "📍 Sector 23 ✓ Delivering", WhatsApp icon, cart, account, and a gold "Start Free Trial" button.
3. On mobile: sticky bottom action bar with [WhatsApp] [Call] [Start Trial] and a hamburger menu.
4. Footer in dark green: logo, address "Near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat, Haryana 131001", FSSAI number placeholder, product links, farm links, delivery area list, legal links, newsletter input, social icons.

ACCESSIBILITY: WCAG AA contrast, visible focus states, large tap targets (min 48px), clear labels on inputs.

Now create the HOME PAGE with these sections in order:
1. Hero: headline "Desi cow milk from our own farm in Sonipat", subtext "250 desi cows. Milked, chilled and delivered to your door every morning." An inline pincode/locality input with button "Check delivery", secondary button "Order on WhatsApp". Background: warm photo of desi cows at sunrise on a Haryana farm with a soft cream gradient for text legibility.
2. Trust strip of 4 icon stats: "250+ desi cows", "Our own farm, Sonipat", "Tested every batch", "At your door by 7 AM".
3. "Our products" grid of cards: Desi Cow Golden Ghee 1kg ₹3,500 (Bestseller badge, Add to cart), Desi Cow Milk (Coming soon badge, Notify me), Curd, Buttermilk, Paneer (Coming soon), Organic Honey ₹1,500, Pure Mustard Oil.
4. "How it works" 3 steps with illustrations: Choose quantity → Choose schedule → We deliver.
5. "From our farm to your home" horizontal storytelling: Our cows → Milking → Bilona ghee → Cold chain → Your doorstep, each with photo and one line.
6. Comparison table "Amrit vs packet milk vs loose milk" with rows: Know the farm, Desi cows only, Lab tested, Delivered daily, No middlemen — with green ticks and grey crosses.
7. Quality card: "This month's lab report" showing Fat 4.4%, SNF 8.6%, Adulteration: Not detected, with "View report" link.
8. Testimonials carousel with customer name, locality (e.g. "Sector 15, Sonipat"), star rating, photo.
9. Delivery areas: stylised map of Sonipat with green pins (live: Sector 23, Garhi Brahmnan, Mayur Vihar, Devilal Colony) and gold pins (coming soon), plus "Not in your area? Join the waitlist" form.
10. "From our blog" 3 article cards.
11. FAQ accordion (6 questions).
12. Final CTA band in green: "Taste the difference in 3 days" with gold "Start Free Trial" and outline "Chat on WhatsApp".
```

---

## 2. Short style reminder (prefix for every following screen)

```
Continue the Amrit Dairy design system exactly: cream #FBF7EE background, Field Green #1F4D3A primary, Golden Ghee #E0A526 accent with dark text, Fraunces headings + Inter body, pill buttons 48px, 14px rounded cards, real Indian desi cow photography, thin line icons, slim green news ticker at top, same header and dark-green footer, sticky mobile bottom bar [WhatsApp][Call][Start Trial].
```

---

## 3. Screen prompts

### 3.1 About Us
```
Create the ABOUT page. Sections: (1) Hero with founder portrait standing with cows, headline "A family farm that decided to deliver honesty", short quote. (2) Our story timeline (vertical on mobile, horizontal on desktop) with 5 milestones. (3) Mission, Vision, Values as 3 cards. (4) "Meet our cows" breed cards (Sahiwal, Gir, Hariana) with photo, traits, count. (5) Our 4 promises: Own Farm Own Cows, Desi & Traditional, Honest Information, Careful Handling — icon + text. (6) Team grid with photos and roles. (7) "Quick facts" panel: a clean key-value list (Founded, Herd size, Farm address, Areas served, Delivery time) with "Last updated" date. (8) CTA "Visit our farm" with booking button.
```

### 3.2 Products listing
```
Create the PRODUCTS listing page. Breadcrumb, H1 "Our products", short intro. Category chips: All, Milk, Ghee, Curd & Buttermilk, Paneer, Pantry. Toggle filter: "Delivered in Sonipat" / "Ships across India". Product grid (2 columns mobile, 4 desktop) with image on cream background, name, size, price in ₹, badges (Bestseller / Coming soon / Ships India), and a button (Add / Subscribe / Notify me). Below: a "Not sure what to choose?" help card with WhatsApp CTA, and an FAQ accordion.
```

### 3.3 Product details (Desi Cow Golden Ghee)
```
Create the PRODUCT DETAIL page for "Amrit Desi Cow Golden Ghee – 1 kg glass jar – ₹3,500". Left: image gallery (jar, golden grainy texture close-up, bilona churning, cows) with thumbnails. Right: breadcrumb, H1, star rating with review count, price, size selector (500 g / 1 kg), quantity stepper, delivery checker (pincode input with success state "Delivers to Sector 23 tomorrow" and "Ships across India in 3–5 days"), buttons: gold "Add to cart", outline "Buy on WhatsApp", trust icons (Glass jar, Lab tested, Made on our farm). Below: "Why it's different" 4 bullets; "How we make it" 6-step horizontal process (Milk → Curd → Hand-churn → Makkhan → Slow-cook → Ghee) with photos; specs table (ingredients, shelf life, storage, FSSAI); "Batch lab report" download card; reviews section with rating bars; product FAQ accordion; "Pairs well with" carousel. Mobile: sticky bottom buy bar with price and Add to cart.
```

### 3.4 Departments listing
```
Create the DEPARTMENTS page. Hero with headline "The people behind every drop" over a warm photo of farm staff. Grid of department cards, each with a line icon, name, one-line purpose, head's small avatar and team size: Gaushala & Herd Care, Milking & Collection, Bilona Ghee & Products, Quality Assurance Lab, Cold Chain & Delivery, Customer Care, B2B & Institutional Sales. A simple org-flow diagram showing how milk moves across departments from cow to customer. CTA band "Work with us" linking to careers.
```

### 3.5 Department details
```
Create a DEPARTMENT DETAIL page for "Gaushala & Herd Care". Hero with department name, purpose statement and photo of a caretaker feeding a desi cow. "What we do" checklist. Head of department card (photo, name, veterinary credentials, quote). "Our herd-care standards" with icon rows (Vet check twice a week, Green fodder from our fields, No hormones / no oxytocin, Clean shelters & fresh water). Stats row with 4 big numbers. "Facilities we manage" cards linking to Cow Shelters and Fodder Fields. FAQ accordion. Contact card and open roles.
```

### 3.6 Facilities listing
```
Create the FACILITIES page. Hero with an aerial drone-style photo of the farm, headline "Take a walk through our farm". An interactive illustrated farm map with numbered hotspots (Cow Shelters, Milking Parlour, Chilling Centre, Bilona Ghee Kitchen, Quality Lab, Fodder Fields, Biogas & Compost, Delivery Hub). Below: facility cards with photo, name, one-line description, key metric. CTA "Book a farm visit".
```

### 3.7 Facility details
```
Create a FACILITY DETAIL page for "Bilona Ghee Kitchen". Hero image of hand-churning curd in a traditional wooden bilona with brass vessels. Overview paragraph. Specs stats row (Batch size, Churning method, Cooking time, Temperature). Step-by-step process cards with photos. "Hygiene & safety" panel with icons (Hair nets & gloves, Steel-only contact surfaces, Daily sanitisation, Batch coding). Photo gallery / video tour thumbnail with play button. "Managed by: Bilona Ghee & Products department" link card. Visit info card with timings and "Book a visit" button. FAQ accordion.
```

### 3.8 Delivery area page
```
Create a DELIVERY AREA landing page: "Desi cow milk delivery in Sector 23, Sonipat". Top status card in soft green: "✓ We deliver here — Morning slot 5:30–7:30 AM". Distance-from-farm highlight ("~X km from our farm"). Map with the area highlighted and the farm pin. Products available here grid. "Landmarks we cover" chips. Local testimonials. Neighbouring areas links. Area-specific FAQ. Also design the alternative state for an area not yet served: gold "Coming soon" status card with waitlist form (name, phone, pincode) and "112 neighbours already waiting" counter.
```

### 3.9 Resources hub + Blog listing
```
Create the RESOURCES hub. Hero with search bar "Search guides, recipes and answers". Featured guide large card. Tiles: Blog, Guides, Recipes, Lab Reports, FAQs, Glossary, Press. Then the BLOG listing: category tabs (Health & Nutrition, Farm Life, Recipes, Buying Guides, News), a featured post, a grid of post cards (cover image, category tag, title, excerpt, author avatar, read time, date), pagination, and a newsletter signup card in mint tint.
```

### 3.10 Blog details
```
Create a BLOG ARTICLE page titled "Desi cow milk vs packet milk: what's really different?". Breadcrumb, category tag, H1, author row (photo, name, "Veterinarian, Amrit Dairy", published & updated dates, 7 min read). Cover image. A highlighted "TL;DR" box in malai colour with 3 bullet answers. Sticky table of contents on desktop (collapsible on mobile). Article body with question-style H2 headings, short paragraphs, a comparison table, a pull quote, an inline product card for Desi Cow Milk. "Key takeaways" box. FAQ accordion. "Sources" list. Author bio box. Related articles row. Share buttons with WhatsApp first.
```

### 3.11 News / ticker archive
```
Create the NEWS page listing announcements that also appear in the top ticker. Filter chips: All, New areas, Offers, Events, Product launches, Notices. Timeline-style list of cards with date, type badge (colour-coded), title, short text, link. Also show a close-up component spec of the ticker bar in 3 states: desktop scrolling marquee with pause button, mobile single-item fade, and reduced-motion static list.
```

### 3.12 Contact
```
Create the CONTACT page. Hero headline "We're a WhatsApp away". Four contact cards: WhatsApp (green button), Call, Email, Visit the farm (address + Get directions). Contact form with fields: Name, Phone, Email, Locality/Pincode, Subject dropdown (Order, Subscription, Bulk order, Farm visit, Feedback, Other), Message, consent checkbox, submit button, and a success state. Embedded map of the farm near Anup Sports Village, Garhi Brahmnan, Sonipat. Business hours card. Grievance officer card. FAQ accordion.
```

### 3.13 Legal page template
```
Create a LEGAL page template for "Privacy Policy". Minimal, highly readable layout: breadcrumb, H1, "Effective date" and "Last updated" labels, sticky table of contents on the left (desktop) / collapsible on mobile, long-form text column max 720px with numbered H2 sections, callout boxes for key points, a "Questions? Contact our grievance officer" card at the end. Keep the ticker, header and footer.
```

### 3.14 Milk subscription builder (Phase 3)
```
Create a SUBSCRIPTION BUILDER flow (mobile-first, 5-step stepper): (1) Confirm delivery area, (2) Choose product and quantity with 0.5 L stepper and price per day, (3) Frequency: Daily / Alternate days / Custom weekdays chips, (4) Slot: Morning 5:30–7:30 or Evening, and start date calendar, (5) Summary with monthly estimate, wallet top-up amount options (₹1,000 / ₹2,000 / ₹5,000), and gold "Pay with UPI" button. Also a success screen with a friendly cow illustration.
```

### 3.15 Customer dashboard (Phase 3)
```
Create a CUSTOMER DASHBOARD (mobile-first). Top card: "Next delivery: Tomorrow 6:30 AM — 1 L Desi Cow Milk" with Skip and Change buttons. Wallet balance card with Top-up button and low-balance warning state. Monthly calendar with delivered (green), skipped (grey), paused (gold) days; tap a date to skip or add curd/paneer. "Pause deliveries" date-range picker. Order history and invoices list. Addresses and profile. Clean, app-like, large touch targets.
```

### 3.16 Checkout, 404 and empty states
```
Create (a) a one-page CHECKOUT: contact, address with pincode validation, delivery/shipping option, order summary, coupon field, Razorpay payment button; (b) ORDER CONFIRMATION with order number and WhatsApp share; (c) a 404 page with a friendly line illustration of a cow looking at a map, text "This path leads back to the farm", search box and Home button; (d) empty cart state.
```

---

## 4. Useful follow-up refinement prompts
- "Make the hero more photographic and less text-heavy; keep the pincode input above the fold on mobile."
- "Increase contrast of the gold elements; use dark text on all gold buttons."
- "Replace any black-and-white Holstein cow imagery with brown humped Sahiwal or white Gir cows."
- "Reduce visual noise: max one gold accent button per viewport."
- "Show the Hindi variant of this screen using Tiro Devanagari Hindi for headings and Noto Sans Devanagari for body."
- "Add skeleton loading states for product cards and the pincode checker result."
- "Create a component sheet: buttons (primary, accent, secondary, WhatsApp), inputs, badges, cards, ticker, accordion, stepper, stats, testimonial card."

## 5. Design QA checklist (before handoff)
- [ ] All screens available at 390 px and 1440 px
- [ ] Colours and fonts match Doc 03 tokens exactly
- [ ] Every page has the ticker, header, footer and mobile sticky bar
- [ ] Pincode checker designed in all states: idle, loading, live, coming soon, not served, error
- [ ] Forms designed in all states: empty, focus, error, success
- [ ] No Holstein or stock-western imagery; placeholders marked "REAL FARM PHOTO"
- [ ] Tap targets ≥ 48 px; text ≥ 16 px on mobile
- [ ] Component sheet exported for developers
