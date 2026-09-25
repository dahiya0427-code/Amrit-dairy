# 06 · UI/UX Design Prompts for Google Stitch — Amrit Dairy E-commerce Store

> **How to use**
> 1. Paste the **Master Design Brief** (§1) into Stitch to generate the Home page.
> 2. For every other screen, paste the **Style Reminder** (§2) and then that screen's prompt (§3).
> 3. Generate **Mobile (390 px) first**, then Desktop (1440 px). Most buyers are on Android phones.
> 4. Refine with small follow-ups (§4) instead of re-prompting everything.
> 5. Export to Figma, check against Doc 03 tokens, and build the component sheet before development.
>
> Put the real packshots (ghee jar, milk bottle, matka dahi, achar jars, honey) into Stitch as image references where possible, so the designs use the actual packaging.

---

## 1. Master Design Brief (paste first)

```
Design a premium, warm, mobile-first E-COMMERCE STORE for "Amrit Dairy" (अमृत डेयरी), a farm-owned desi cow dairy in Sonipat, Haryana, India. The brand raises its own ~250 desi cows (Gir, Sahiwal, Tharparkar, Rathi, Kankrej) on its farm in Rajhbhaya, Garhi Brahmnan, Sonipat, and sells online: Desi Cow Golden Ghee made by the traditional hand-churned Bilona method (₹3,500 for a 1 kg glass jar; 5 kg and 10 kg steel kettles on demand), desi cow milk in 1 L glass bottles (daily subscription), Matka Dahi in a clay pot, buttermilk, paneer, butter, cream, a "Rajasthan Special Traditional Achar" collection (Ker Sangri, Kaccha Mango, Garlic, Green Chilli, Lemon, Mix Veg, Karela…), raw forest honey (₹1,500) and pure mustard oil. Fresh products are delivered locally every morning in Sonipat; ghee, achar, honey and oil ship across India.

BRAND LINES: Hindi hero "हर घर अमृत, हर घर शुद्धता". English "Our cows are our own." Values "Purity • Trust • Nourishment". The website is bilingual: Hindi headlines with English support, and a header language toggle EN | हिं.

AUDIENCE: Indian mothers aged 30–50 buying for family health, young working couples who want app-like convenience, quality-obsessed buyers who want proof, and gift buyers across India. Pay mostly by UPI on Android phones.

COLOR PALETTE (use exactly):
- Primary "Amrit Forest" green #24401D (header, footer, primary buttons, headings); deep #1F3419; band green #32502C for full-width feature bands; leaf green #3D6B30 for links.
- Accent "Ghee Gold" #E7A93A for the main buy buttons, ALWAYS with dark text #1E1C19; gold text on light backgrounds uses #8A5A00.
- Background "Fresh Milk" cream #FFFDF7; product cards "Malai" #F6EFDD; soft green tint #EAF1E4; butter #FBEBC7 for offer chips.
- "Matka Terracotta" #A4452A for Bestseller badges and sale % off (white text).
- Text ink #1E1C19, muted #5A554D, borders #E6DCC6. WhatsApp green #25D366 only for WhatsApp buttons.
- Ratio: 60% cream, 30% green, 10% gold.

TYPOGRAPHY: English headings in "Fraunces" (soft serif, semibold, sentence case). Hindi headings in "Noto Serif Devanagari" bold. Body and UI in "Mukta" (supports English + Hindi). Body 16px minimum, line height 1.65. Prices in Mukta bold with ₹ and Indian digit grouping (₹3,500) — never "Rs." and never ₹0.

SIGNATURE HEADER: a rounded pill-shaped navigation bar in dark forest green with a thin gold outline, floating on a green strip. A circular "Amrit" brand badge with a smiling child mascot sits in the centre, overlapping the bar's top edge. Left: menu icon, then gold line icons with small cream labels — Shop, Ghee, Desi Cows. Right: Farm Story, Contact, search icon, EN|हिं toggle, account icon, and a gold pill cart button with a red count badge. Above the header: a slim news ticker bar (deep green, cream text, gold dot separators, pause button): "Now delivering in Mayur Vihar • Diwali ghee hampers are live • Free delivery above ₹999 in Sonipat". Below the header on shop pages: a location chip "📍 Sector 23, Sonipat ✓ Delivering tomorrow 6–8 AM".

MOBILE: a compact green header (menu, mascot badge, search, cart) and an app-like sticky bottom nav: Home · Shop · WhatsApp · Cart · Account. On product pages the bottom bar becomes price + gold "Add to cart".

STYLE: clean, premium Indian food brand. Generous whitespace, 12-column grid, max width 1240px. Cards with 16px radius, pill buttons 48px tall, soft green-tinted shadows. Product images are 3D packshots centred on a cream #F6EFDD background. Photography: REAL Indian humped desi cows (brown Sahiwal, red-white Gir, white Tharparkar) — never black-and-white Holstein — plus golden-hour farm scenes, hands churning a wooden bilona, brass and clay vessels, glass milk bottles, happy Indian families. Thin line icons (cow with hump, glass bottle, matka, bilona churner, drop/kalash, achar jar, honey dipper, delivery scooter). Subtle motion.

FOOTER (dark forest green): gold "AMRIT DAIRY" emblem logo, "Our cows are our own.", "Purity • Trust • Nourishment", Shop links, Farm & Help links, contact (Orders/WhatsApp +91 77000 04877, Cow Enquiry +91 80595 93666, contact@amritdairy.in, address Near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat, Haryana 131001), Registered details (GSTIN 06CKFPC6104C1ZW, FSSAI 10826020000285, Udyam UDYAM-HR-18-0074290), payment icons (UPI, RuPay, Visa, Mastercard), newsletter, social icons, legal links. A floating WhatsApp button bottom-right on desktop.

ACCESSIBILITY: WCAG AA contrast, visible gold focus rings, tap targets at least 48px, labelled form fields.

Now design the HOME PAGE (storefront), in this order:
1. Hero slider (3 slides, arrows + dots). Slide 1: big Hindi headline "हर घर अमृत, हर घर शुद्धता", sub "Hand-churned Bilona ghee from our own desi cows", a large ghee jar packshot on a blurred golden farm background, a cream price card below reading "देसी गाय का बिलोना घी — ₹3,500 / kg" with 4 small icon features (Fresh from our farm, Bilona hand-made, Glass jar packing, Delivered to your home) and buttons gold "Add to cart" + outline "Shop all". Slide 2: glass milk bottle, "Your milk. Every morning." with "Start subscription". Slide 3: row of achar jars, "Rajasthan Special Achar".
2. Trust strip on green band: "Our own 250 desi cows", "Bilona hand-made", "Glass & clay packing", "Secure UPI checkout".
3. "Shop by category" — 5 tall rounded tiles on dark green with product imagery and a gold arrow: Dairy / डेयरी उत्पाद, Ghee / घी, Achar Collection / अचार संग्रह, Pantry (Honey, Oil), Combos & Gifts; plus a smaller 6th tile "Buy/Sell Desi Cows / गाय पूछताछ".
4. "Bestsellers" product carousel: cards with badge, packshot, name, pack size, price, rating stars, and a gold "Add" button (show one card in the "added" state with a – 1 + stepper). Include Desi Cow Golden Ghee 1 kg ₹3,500 (Bestseller), Raw Forest Honey 500 g ₹1,500 (Bestseller), Ker Sangri Achar 500 g, Kaccha Mango Achar 500 g, and a "Coming soon" card for Matka Dahi with a "Notify me" button and no price.
5. Subscription band on #32502C: "Your milk. Every morning. Without remembering to order." 3 steps (Choose quantity → Choose schedule → We deliver), inline pincode input, gold "Start my milk subscription".
6. "Meet the cows behind your milk" — split layout: real farm photo left; right an overline "OUR FARM · SONIPAT, HARYANA", heading, short copy, and a row of 5 breed chips with small cow photos (Gir, Sahiwal, Tharparkar, Rathi, Kankrej), button "Our farm story".
7. "How Bilona ghee is made" — 6 illustrated steps in a horizontal row: Desi cow milk → Curd → Hand-churn → Makkhan → Slow-cook → Golden ghee, with a "Buy the ghee" link.
8. Combos & gifts banner: festive hamper (ghee + 2 achar + honey) with price and "Add hamper".
9. "Why families choose Amrit" — 6 soft cream cards with icons: Our Own Cows, Farm to Home, Fresh Every Day, Authentic & Genuine, Know Your Source, Local Delivery.
10. Reviews: verified-buyer review cards with photo, name, locality ("Sector 15, Sonipat"), stars and product purchased.
11. Delivery: stylised Sonipat map with green pins (Sector 23, Garhi Brahmnan, Mayur Vihar, Devilal Colony), a pincode checker, and a note "Ghee, achar, honey & oil ship all over India".
12. Blog: 3 article cards.
13. FAQ accordion: Where does the milk come from? Are the cows owned by Amrit Dairy? Can I pause or skip a delivery? What payment methods are accepted? What areas do you serve? Do you ship ghee outside Sonipat? How should I store ghee and milk?
14. Green band: "Prefer to order on WhatsApp or by phone?" with gold "WhatsApp करें" and outline "Call us / हमें कॉल करें".
```

---

## 2. Style Reminder (prefix for every following screen)

```
Continue the Amrit Dairy e-commerce design system exactly: cream #FFFDF7 page, product cards #F6EFDD, primary forest green #24401D, band green #32502C, gold #E7A93A buttons with dark #1E1C19 text, terracotta #A4452A Bestseller badges, Fraunces + Noto Serif Devanagari headings, Mukta body, bilingual EN/हिंदी labels, ₹ prices with Indian grouping, 16px card radius, 48px pill buttons, real desi cow photography, the signature rounded green pill header with the centred child-mascot badge and gold cart pill, slim green news ticker on top, dark green footer with GSTIN/FSSAI details, mobile sticky bottom nav (Home · Shop · WhatsApp · Cart · Account).
```

---

## 3. Screen prompts

### 3.1 Shop / Collection page
```
Design the SHOP page for the collection "Achar Collection / अचार संग्रह". Breadcrumb, H1, a two-line intro ("Rajasthan-special traditional achars, made in small batches in mustard oil, packed in 500 g glass jars"). Horizontal collection chips: All, Dairy, Ghee, Achar, Pantry, Combos & Gifts. A filter bar with Availability, Price, a toggle "Delivered in Sonipat / Ships across India", Sort dropdown and "11 products". Product grid (2 columns on mobile, 4 on desktop) with cards for Ker Sangri, Kaccha Mango, Garlic, Green Chilli, Spicy Lemon, Sweet Lemon, Marwadi Mix Veg, Karela, Ker, Red Chilli Stuffed, Mango Sweet Chatni: packshot on cream, name, 500 g, price, stars, gold "Add" button. Show examples of every card state: in stock, added (– 1 + stepper), "Coming soon" with Notify me and no price, "Out of stock – Notify me". A help card "Can't decide? Ask us on WhatsApp". A collection FAQ accordion and a collapsed SEO text block. On mobile show a sticky "Filter & Sort" button that opens a bottom sheet.
```

### 3.2 Product Details — Desi Cow Golden Ghee
```
Design the PRODUCT DETAIL page for "Amrit Desi Cow Golden Ghee / अमृत देसी गाय का गोल्डन घी". Left: gallery with a large ghee jar packshot, thumbnails (golden grainy texture close-up, hand-churning with a wooden bilona, ghee on hot rotis, Gir and Sahiwal cows at the farm, 30-sec video thumbnail). Right: terracotta "Bestseller" badge, H1 with a Hindi sub-line, 4.8 stars (124 reviews), price block "₹3,500" + "Inclusive of all taxes" + "₹350 / 100 g", variant pills "1 kg Glass Jar" (selected), "5 kg Steel Kettle", "10 kg Steel Kettle — on demand"; qty stepper; a pincode checker showing a success state "✓ Delivers to Sector 23 tomorrow 6–8 AM · Ships across India in 3–5 days"; buttons: gold "Add to cart", dark green "Buy now", outline "Order on WhatsApp"; trust icons (Own desi cows, Bilona hand-made, Glass jar, Secure UPI). Below: 4 highlight icons; "How we make it" 6-step photo process; accordion tabs Description / Ingredients / Nutrition per 100 g / Shelf life & storage / Legal info (net quantity, MRP, packed by, FSSAI 10826020000285, country of origin India) / Shipping & returns; "Batch lab report" download card; "Frequently bought together" bundle (Ghee + Ker Sangri Achar + Raw Forest Honey, total price, "Add all 3"); reviews with rating bars, photo reviews and "Verified buyer" ticks; product FAQ; related products carousel. Mobile: sticky bottom bar with price and gold "Add to cart". Also show the state when "10 kg Steel Kettle — on demand" is selected: the main button changes to "Request bulk order" with a small form.
```

### 3.3 Cart drawer + Cart page
```
Design the CART as (a) a right-side drawer on desktop / full-screen sheet on mobile and (b) a full cart page. Line items: ghee 1 kg ×1, Matka Dahi 500 g ×2, Ker Sangri Achar ×1, each with thumbnail, variant, stepper, remove, price. A notice card: "Your order will arrive in 2 parts — fresh items delivered tomorrow 6–8 AM in Sector 23; ghee & achar delivered with them / shipped". Free-delivery progress bar "Add ₹250 more for FREE delivery". A cross-sell row "Goes great with" (honey, mustard oil). Coupon field with an applied chip "FIRST10 −₹350". Summary: subtotal, delivery, discount, total (GST included). Gold "Checkout" button, text link "Order on WhatsApp instead", trust row (Secure payment by Razorpay, Easy refunds). Include the empty-cart state with the child mascot illustration: "Your cart is feeling hungry" and "Shop bestsellers".
```

### 3.4 Checkout
```
Design a mobile-first 3-STEP CHECKOUT with a progress bar (1 Address · 2 Delivery · 3 Payment) and a collapsible order summary at top on mobile / sticky right card on desktop. Step 1: phone number (primary), email (for invoice), full name, address line, landmark, pincode with inline validation ("✓ Sector 23, Sonipat — we deliver here"), address type chips (Home / Office), "Save for next time" checkbox. Step 2: for fresh items a date chip row + slot selection ("Tomorrow · 6–8 AM") with a note "Order by 9 PM for next-morning delivery"; for shipped items a shipping method card ("Standard 3–5 days · ₹0 above ₹999"); gift message toggle. Step 3: payment options with UPI first and highlighted (UPI apps icons: GPay, PhonePe, Paytm, BHIM, plus "Pay by any UPI app / QR"), then Cards, Netbanking, Wallets; a terms consent checkbox; big gold button "Pay ₹4,050 securely"; "Secured by Razorpay" note. Also design the payment-failed state ("No money was deducted. Try again or pay on WhatsApp") and the ORDER CONFIRMED page: mascot celebration illustration, "Order #AD10234 confirmed ✅", delivery timeline, "Share on WhatsApp", "Create an account to track easily", recommended products.
```

### 3.5 Track order + Customer account
```
Design (a) a TRACK ORDER page: inputs for order number + phone, then a status timeline Placed → Confirmed → Packed → Out for delivery / Shipped (with courier AWB link) → Delivered, with the current step in gold and completed steps in green, items list, and help via WhatsApp. (b) The CUSTOMER ACCOUNT dashboard (mobile-first, app-like): greeting, cards for "Next delivery: Tomorrow 6:30 AM — 1 L Desi Cow Milk" (Skip / Change), wallet balance ₹1,240 with Top-up and a low-balance warning style, recent orders with Reorder / Invoice / Track, "Notify me" list, referral code card "Give ₹100, get ₹100". A side menu (desktop) / list (mobile): Orders, Subscriptions, Wallet, Addresses, Reviews, Referrals, Profile & privacy, Logout. Login screen: phone or email → 6-digit OTP input.
```

### 3.6 Milk subscription builder + subscription calendar
```
Design the SUBSCRIBE flow (5-step stepper, mobile-first): (1) Check delivery area (pincode); (2) Product — Desi Cow Milk 1 L glass bottle ₹100/L — quantity stepper in 0.5 L steps with "₹X per day"; optional add Buttermilk / Matka Dahi; (3) Frequency chips: Daily, Alternate days, Custom days (M T W T F S S toggles); (4) Slot "Morning 6–8 AM" and start date calendar; (5) Summary with estimated monthly cost, wallet top-up options (₹1,000 / ₹2,000 / ₹5,000 / custom), gold "Pay with UPI". Success screen with the mascot. Then the SUBSCRIPTION CALENDAR management screen: month view with delivered (green dot), skipped (grey), paused (gold) days; tap a date to Skip or Add item; a "Pause deliveries" date-range picker; banner "Changes for tomorrow close at 9 PM".
```

### 3.7 About + Farm Story
```
Design the FARM STORY page. Hero: wide real photo of desi cows at sunrise on the Sonipat farm with heading "Our Farm" and line "It starts with our cows." Section "These aren't anonymous suppliers. These are our cows." with copy about ~250 desi cows (Gir, Sahiwal, Tharparkar, Rathi, Kankrej) and five breed photo chips. A journey timeline with one photo each: Our Farm → Our Cows → Milking → Quality Check → Packaging → Your Home. A "Bilona tradition" section with a video thumbnail. "Farm in numbers" stats row. CTA band: gold "Shop farm products" and outline "Cow enquiry". Then design the ABOUT page: founder portrait with cows and quote "Our cows are our own.", story timeline, values Purity • Trust • Nourishment as three cards, team grid, a "Registered details" card (GSTIN, FSSAI, Udyam), and a "Quick facts" key-value panel with a "Last updated" date.
```

### 3.8 Desi Cows hub + Breed details + Cows for sale
```
Design the DESI COWS hub: green hero "Our Desi Cows / हमारी देसी गायें" with short intro. Filter chips "On our farm (5)" / "All native breeds (18)". A grid of breed cards with cut-out cow photos on green grass: Gir, Sahiwal, Lal Sindhi, Tharparkar, Rathi, Kankrej, Ongole, Hariana, Deoni, Krishna Ghati, Hallikar, Amritmahal, Khillari, Kangayam, Umblacheri, Punganur, Nagauri, Mewati; farm breeds get a small gold "On our farm" badge. An enquiry band "Want to buy or sell a desi cow? Call +91 80595 93666". Then a BREED DETAIL page for "Sahiwal": gallery, origin (Punjab region), identification traits, typical milk yield, temperament, "At Amrit Dairy" count, related product (ghee), FAQ, enquiry CTA. Then a COWS FOR SALE listing: cards with photo, breed, age, lactation number, approx. daily yield, status (Available / Sold), "Price on request", buttons Call / WhatsApp / Enquire — no cart.
```

### 3.9 Departments + Department Details
```
Design the DEPARTMENTS page: hero "The people behind every jar" with a warm team photo; grid of department cards (line icon, name, one-line purpose, head avatar, team size): Gaushala & Herd Care, Milking & Collection, Bilona Ghee Unit, Achar Kitchen, Quality Lab, Packaging & Dispatch, Delivery & Logistics, Customer Care; a simple flow diagram from cow to customer across departments; careers CTA. Then the DEPARTMENT DETAIL page for "Bilona Ghee Unit": hero with hands churning curd in a wooden bilona, "What we do" checklist, head of department card with quote, standards icon rows (steel-only contact surfaces, small batches, slow wood-fire / slow heat, batch coding), stats row, "Facilities we run" cards, "Products we make" (ghee product card with Add to cart), FAQ, contact.
```

### 3.10 Facilities + Facility Details
```
Design the FACILITIES page: aerial farm hero "Take a walk through our farm"; an illustrated farm map with numbered hotspots (Cow Shelters, Milking Area, Chilling Unit, Bilona Ghee Kitchen, Achar Kitchen, Quality Lab, Packing & Dispatch Centre, Fodder Fields); facility cards with photo, name, one-line description and a key metric; "Book a farm visit" CTA. Then the FACILITY DETAIL page for "Bilona Ghee Kitchen": hero image, overview, specs stats (batch size, method, cooking time, temperature), step-by-step process cards with photos, hygiene & safety panel (hair nets & gloves, steel surfaces, daily sanitisation, batch coding), gallery/video tour, "Managed by: Bilona Ghee Unit", "Made here" product card with Add to cart, visit info, FAQ.
```

### 3.11 Resources hub + Blog listing + Blog details
```
Design the RESOURCES hub (search bar, featured guide, tiles: Blog, Guides, Recipes, Lab Reports, FAQs, Glossary) and the BLOG listing (category tabs: Ghee & Bilona, Desi Cows, Health & Nutrition, Recipes, Farm Life, News; featured post; grid of cards with cover, category tag, title, excerpt, author avatar, read time; pagination; newsletter card). Then a BLOG ARTICLE "How to check if your ghee is pure: 5 simple home tests": breadcrumb, category, H1, author row (photo, name, role, dates, 6 min read), cover image, a cream "TL;DR" box with 3 bullets, sticky table of contents (desktop), body with question-style H2s, a comparison table, a pull quote, an inline SHOPPABLE product card (Desi Cow Golden Ghee ₹3,500 with Add to cart), a "Key takeaways" box, FAQ accordion, sources list, author bio, related posts, "Shop the story" product row, share buttons with WhatsApp first.
```

### 3.12 Ticker component + News page
```
Design the NEWS page listing announcements (filter chips: All, Offers, New areas, Product launches, Events, Notices; timeline cards with date, colour-coded type badge, title, short text, link). Also design a component sheet for the TICKER bar in 4 states: desktop scrolling marquee with pause button; hover-paused; mobile single-item fade; reduced-motion static item. Use deep green #1F3419 background, cream text, gold dot separators, 36px height.
```

### 3.13 Delivery area page + pincode checker states
```
Design a DELIVERY AREA page "Desi cow milk & ghee delivery in Sector 23, Sonipat": status card "✓ We deliver here — Morning 6–8 AM, order by 9 PM", distance from farm, a map with the area and the farm pin, products available here (grid with Add), local reviews, landmarks chips, neighbouring areas, FAQ. Then a component sheet of the PINCODE CHECKER in all states: idle, loading, "Delivers tomorrow 6–8 AM" (success), "Ships in 3–5 days" (info, for ghee/achar), "Coming soon to your area — join waitlist (112 neighbours waiting)" (warning), "Fresh delivery not available yet — ghee & achar still ship to you" (error/neutral), invalid pincode.
```

### 3.14 Contact
```
Design the CONTACT page: hero "We're a WhatsApp away / हम बस एक WhatsApp दूर हैं". Four contact cards: Orders & General (+91 77000 04877, WhatsApp & Call buttons), Cow Buy/Sell (+91 80595 93666), Email (contact@amritdairy.in), Visit the farm (address: Near Anup Sports Village, Rajhbhaya, Garhi Brahmnan, Sonipat, Haryana 131001 + "Get directions"). A contact form with visible labels (Name, Phone, Email, Order number optional, Subject dropdown: Order issue / Subscription / Bulk order / Cow enquiry / Feedback / Other, Message, consent checkbox, Send) with success and error states. A "Track your order" mini box, business hours, embedded map, FAQ, grievance officer card, and a registered details card (GSTIN, FSSAI, Udyam).
```

### 3.15 Legal page template
```
Design a LEGAL page template for "Refund & Return Policy": breadcrumb, H1, "Effective date" and "Last updated" labels, a sticky table of contents on the left (collapsible on mobile), a readable text column (max 720px) with numbered sections, summary callout boxes ("Fresh products: report within 24 hours with a photo", "Sealed ghee/achar/honey: 7 days if damaged or wrong"), a table of refund timelines by payment method, and an end card "Questions? Contact our grievance officer". Keep ticker, header and footer.
```

### 3.16 Bulk orders + 404 + Notify-me modal
```
Design (a) a BULK ORDERS page for weddings, festivals, temples and businesses: hero with 5 kg and 10 kg steel ghee kettles, use-case cards, a price-on-request table, and a request form (name, phone, product, quantity, date needed, city); (b) a "NOTIFY ME" modal for coming-soon products (Matka Dahi) with phone/email and pincode; (c) a 404 page with the child mascot looking at a map: "This path leads back to the farm", search box, and buttons Home / Shop.
```

---

## 4. Refinement prompts
- "Use dark text on all gold buttons; cream text on gold is not allowed."
- "Never show ₹0.00; replace with a 'Coming soon' badge and a 'Notify me' button."
- "Make the Add-to-cart button reachable with the thumb on mobile: use a sticky bottom bar."
- "Replace any Holstein / black-and-white cows with brown Sahiwal, red-white Gir or white Tharparkar cows."
- "Show the Hindi (हिंदी) version of this screen: headings in Noto Serif Devanagari, body in Mukta."
- "Add skeleton loading states for product cards, the cart drawer and the pincode checker."
- "Create a component sheet: buttons, inputs, product card (all states), price block, variant pills, qty stepper, badges, cart line item, coupon chip, order timeline, rating stars, review card, ticker, accordion, stepper, toasts."

## 5. Design QA checklist (before dev handoff)
- [ ] Mobile (390) and desktop (1440) for every screen
- [ ] Colours and type match Doc 03 tokens; gold buttons have dark text
- [ ] All e-commerce states designed: product card (in stock / added / coming soon / out of stock / on demand / not deliverable), pincode checker (6 states), cart (empty / mixed / coupon), checkout errors, payment failed, order success
- [ ] Every page has the ticker, pill header, footer (GSTIN/FSSAI) and mobile bottom nav
- [ ] English + Hindi variants for Home, Shop, Product, Cart and Checkout
- [ ] Real packshots used; "REAL FARM PHOTO" placeholders marked where the shoot is pending
- [ ] Tap targets ≥ 48 px; body ≥ 16 px; focus states visible
