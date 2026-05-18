# Palm Bay Real Estate Website - PRD

## Original Problem Statement
Build a professional real estate website for Vahid Reza Rajabian featuring:
- Property listings and inventory management
- Lead capture and contact forms with SMS/Email notifications
- Price calculator for Palm Bay lots
- Password-protected admin dashboard with lead management
- Comprehensive SEO structure with schema markup
- AI Chat Assistant for inventory queries
- Blog content for authority building

**Domain**: `www.palmbaylots-land.com`

---

## Site Structure

### Core Pages
1. **Home** (`/`) - Sales funnel with Featured Listings carousel + RealEstateAgent schema
2. **About** (`/about`) - Authoritative copy about Vahid's services
3. **Listings** (`/listings`) - Featured flagship section + property listings with filters
4. **Inventory** (`/inventory`) - 582 residential lots with map links
5. **Price Guide** (`/price-guide`) - Calculator with financing terms
6. **Sell Your Land** (`/sell-land`) - Seller landing page for lead generation
7. **Contact** (`/contact`) - Form with email + SMS notifications
8. **Privacy Policy** (`/privacy-policy`) - GDPR/compliance page
9. **Admin Dashboard** (`/admin`) - View/export/delete leads, manage properties

### SEO Landing Pages (with Service schema)
10. **Palm Bay Land For Sale** (`/palm-bay-land-for-sale`)
11. **Owner Financing Land Florida** (`/owner-financing-land-florida`)
12. **Quarter Acre Lots Palm Bay** (`/quarter-acre-lots-palm-bay`)
13. **Buildable Lots Palm Bay** (`/buildable-lots-palm-bay`)

### Authority Guide Pages (with FAQPage schema)
14. **Can You Build on Land in Palm Bay?** (`/guide/build-on-land-palm-bay`)
15. **Septic vs Sewer Explained** (`/guide/septic-vs-sewer-palm-bay`)
16. **Owner Financing: What to Watch** (`/guide/owner-financing-what-to-watch`)
17. **Buy Land Without a Realtor** (`/guide/buy-land-without-realtor`)
18. **Flood Zones in Palm Bay** (`/guide/flood-zones-palm-bay`)

### Flagship Listing Pages (Marketing Optimized)
19. **328 Malabar Rd** (`/listing/328-malabar-rd`) - $1,575,000 commercial corner
20. **700+ Scattered Lots** (`/listing/scattered-lots`) - From $41,000 bulk inventory
21. **2418 Fleming Ave SW** (`/listing/2418-fleming-ave`) - $65,000 city water lot

### Individual Property Pages
- 582 dynamic SEO pages at `/property/{slug}`
- Each has unique content: unit-based utility info, quadrant-specific area description, use case suggestions, per-property FAQ schema, related guide links

### Blog (6 Full Articles)
17. **Blog Index** (`/blog`)
18. **Is Palm Bay Good Investment 2025** (`/blog/is-palm-bay-good-investment-2025`)
19. **How Owner Financing Works** (`/blog/how-owner-financing-works`)
20. **Building Costs Palm Bay** (`/blog/building-costs-palm-bay`)
21. **Palm Bay Zoning Explained** (`/blog/palm-bay-zoning-explained`) ✅ NEW
22. **City Water vs Well & Septic** (`/blog/city-water-vs-well-septic`) ✅ NEW
23. **Understanding Flood Zones** (`/blog/flood-zones-palm-bay`) ✅ NEW

---

## Completed Work (Latest Session - April 14, 2026)

### ✅ P0 CRITICAL: Connected Frontend to MongoDB Backend
- **Inventory.jsx** now fetches all 582 lots from `/api/properties` instead of static `inventory.csv`
- **CrexiListings.jsx** now shows only curated listings from DB (filters out inventory lots by `inventoryId`)
- Seeded 5 curated featured listings (328 Malabar Rd, Babcock, Thor Ave, Scattered Lots, Fleming Ave)
- Created `POST /api/seed-inventory` endpoint to import CSV + taxMapping into MongoDB
- Property model extended with inventory fields: `inventoryId`, `county`, `owner`, `unit`, `block`, `lot`, `streetNumber`, `streetName`, `taxAccount`
- **Auto-seed on startup**: Backend automatically seeds from CSV if DB is empty (ensures production deployment works)

### ✅ Admin Panel Enhanced for Inventory Management
- Added **Curated Listings / Inventory Lots** dropdown filter in Properties tab
- Inventory view shows: Inv. ID, Property, Unit, Block, Lot, Size, Actions
- Edit modal shows inventory-specific fields when editing inventory lots

### ✅ Inventory Table "View Map" / "Account" Buttons
- Renamed old "View Map" → "Account" (links to Brevard County Property Appraiser)
- Added new "View Map" button (Google Maps search URL from property address)

### ✅ AI Visibility & SEO Overhaul
- **FAQPage JSON-LD schema** added to 7 pages: Home, PalmBayLandForSale, OwnerFinancingLand, BuildableLots, QuarterAcreLots, BlogPost (dynamic)
- **Fixed incorrect financing terms**: Changed "10-20% down" to "25% minimum down" on OwnerFinancingLand.jsx (multiple locations)
- **Rewrote llms.txt** as Q&A answer engine format — 16 direct buyer questions with Vahid's actual policies
- All FAQ content uses Vahid's real policies: 25% down, 35% deed transfer, no hidden fees, exchange policy, personal approval process

## Completed Work (Session - April 22, 2026)

### ✅ Homepage Claude SEO Rewrite
- Replaced hero copy with Claude SEO document content — "Own Land in Florida's Fastest-Growing City" with builder/investor messaging
- Added **"We Serve Every Type of Buyer"** section — Individual Homebuyers, Small Builders, National Builders (DR Horton, Lennar, Adams), Investors & Hedge Funds
- Added **"Lots & Land for Every Purpose"** section — Residential, Commercial, Industrial, Multifamily, Bulk Packages, Owner Financing
- Added **"Palm Bay Market Overview"** — 130K+ residents, Space Coast employers, I-95, Saint Johns Parkway expansion
- Added **"Where We Operate"** — Palm Bay, Brevard, Polk, Lake, Marion counties + out-of-state commercial
- Updated About Vahid section with specialties list and richer bio from Claude doc
- Updated title tag and meta description with Claude SEO keywords
- Updated schema with expanded service areas and property types
- **UNDER CONTRACT** red badge added to 181 Dailey Street in Cash Buyer Specials modal
- Kept all existing: lead capture form, cash deals banner/modal, urgency banner, FAQ schema, testimonials, featured properties

## Completed Work (Session - May 18, 2026)

### ✅ "The Compound — Buyers" Blog Published (`/blog/the-compound-palm-bay-buyers-2026`)
- Buyer-angle companion to the existing Sellers Compound post
- Covers: EPA study, $1.5M brownfields grant, Port Malabar Industrial designation, city-owned parcels, gateway vision, J.A. Bombardier Blvd access
- 4 new images situated throughout: Action Plan cover, regional context map, business park gateway rendering, J.A. Bombardier Blvd entrance
- 9 min read, 6 FAQs, full internal links to inventory + owner's guide
- Added to `Blog.jsx` index card + `sitemap.xml` (priority 0.8)

## Completed Work (Session - April 18-19, 2026)

### ✅ Backend Codebase Refactoring
- Split `server.py` (930 lines) into modular architecture:
  - `server.py` (~170 lines) — app setup, middleware, startup/shutdown
  - `database.py` — MongoDB connection
  - `models.py` — all Pydantic models
  - `routes/leads.py` — leads CRUD, contact form, email/SMS
  - `routes/properties.py` — properties CRUD, seed-inventory, sitemap
  - `routes/chat.py` — AI chat assistant
- All API endpoints unchanged — zero breaking changes

### ✅ Authority Guide Pages (3 new pages)
- **"Can You Build on Land in Palm Bay?"** (`/guide/build-on-land-palm-bay`) — zoning, permits, building costs, utility types, lot protection
- **"Septic vs Sewer in Palm Bay Explained"** (`/guide/septic-vs-sewer-palm-bay`) — unit-by-unit utility map, cost comparison table, FAQ
- **"Owner Financing: What to Watch Out For"** (`/guide/owner-financing-what-to-watch`) — 5 red flags with "how we do it differently", terms summary, FAQ
- All 3 pages have FAQPage JSON-LD schema, internal cross-links, and CTAs
- Added to sitemap.xml

### ✅ Flagship Listing Pages (2 new)
- **Scattered Lots** (`/listing/scattered-lots`) — 700+ lots from $41,000, inventory breakdown by utility type, "Who Buys These Lots" section, Crexi link
- **2418 Fleming Avenue SW** (`/listing/2418-fleming-ave`) — $65,000, city water, building cost breakdown, owner financing with 25% min down

### ✅ Footer & Navigation Updated
- Added 3 guide page links to footer Resources column
- Added "All Properties on Crexi" external link to footer
- Added Crexi profile link to Listings page
- Listings page now shows 3 flagship properties with "View Full Details" buttons

### ✅ BlogPost.jsx Split
- Extracted blog article content data (548 lines) to `/app/frontend/src/data/blogContent.js`
- BlogPost.jsx slimmed from ~712 lines to ~165 lines (pure component)
- All blog posts still render correctly with FAQ schema
- PropertyDetail.jsx now uses actual unit number from DB to determine utility type
- Utility info is specific: "Unit 8 has city water and city sewer" (not generic "check with county")
- Area descriptions vary by NE/NW/SE/SW location
- Internal links to authority guide pages from each property page
- Fixed financing sidebar: "25% minimum down, deed transfers at 35%" (was "low down payment")
- Fixed investment section: removed incorrect "10-15% down" language

## Completed Work (Previous Session - April 10, 2026)

### ✅ Cash Buyer Discounts Banner
- Added green "Cash Buyer Discounts" banner on homepage (below property tax banner)
- Modal popup shows 3 discounted lots with direct FlexMLS links:
  - 1980 Goodreau Avenue SW
  - 181 Dailey Street SE  
  - 2938 Wilkinson Avenue SE
- Phone CTA for cash pricing inquiries

### ✅ Blog Text Update
- Updated "What Does It Cost to Build" article to clarify that **$125-150/sqft total cost includes all permits**

### ✅ Tax Content Update
- Added Florida property tax elimination bill info to Blog and SEO landing page

### ✅ Twilio Hardcode Cleanup
- Removed hardcoded fallback phone number from `server.py`
- SMS notifications now strictly require `TWILIO_TO_PHONE` env variable (improved security)

### Previous Session Completed
1. **Palm Bay Zoning Explained** - 1,200+ words covering RS-1, RS-2, RM-6, C-1, C-2, C-3 zones
2. **City Water vs Well & Septic** - 1,100+ words with cost comparison tables
3. **Understanding Flood Zones** - 1,000+ words on Zone X, AE, AH, VE with insurance cost tables

### ✅ Featured Listings Carousel on Homepage
- 3 flagship properties displayed prominently below hero
- Each with image, price overlay, title, description, and "View Details" link
- "View All Listings" button links to full listings page

### ✅ Featured Flagship Section on Listings Page
- Same 3 premium properties highlighted above the property grid
- Gradient background with "FEATURED OPPORTUNITIES" badge
- Links directly to individual flagship pages

### ✅ Blog Navigation Link Added
- "Blog" link added to desktop and mobile navigation menus

---

## Technical Architecture

```
/app
├── backend/
│   ├── server.py          # FastAPI endpoints
│   ├── .env               # Credentials
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/        # ChatWidget, Header, Footer, etc.
    │   ├── pages/            
    │   │   ├── Home.jsx       # With Featured Listings carousel
    │   │   ├── CrexiListings.jsx  # With Featured Flagship section
    │   │   ├── Admin.jsx      # Leads (delete) + Properties
    │   │   ├── BlogPost.jsx   # 6 full articles
    │   │   ├── PropertyDetail.jsx  # Dynamic SEO with rich content
    │   │   ├── FlagshipListing.jsx
    │   │   ├── FlagshipBabcock.jsx
    │   │   └── FlagshipMultiFamily.jsx
    │   └── App.js
    └── package.json
```

### Key API Endpoints
- `GET, POST /api/leads`
- `DELETE /api/leads/{lead_id}` ✅
- `POST /api/contact` (email + SMS)
- `GET, POST, PUT, DELETE /api/properties`
- `POST /api/chat` (AI assistant)
- `GET /api/sitemap.xml`

---

## Integrations Status

| Integration | Status | Notes |
|-------------|--------|-------|
| OpenAI (Emergent) | ✅ Working | AI Chat |
| Twilio SMS | ✅ Working | Lead notifications |
| SMTP Email | ✅ Working | Lead notifications |
| Google reCAPTCHA v2 | ✅ Working | Production keys |
| Google Analytics | ✅ Working | Tracking enabled |
| MongoDB | ✅ Working | Leads + Properties |

---

## Credentials
- **Admin Password**: `PalmBay2024!`
- **SMTP Password**: `Vi1012069/1`

---

## Remaining Tasks

### Recently Completed
- [x] **Feb 24, 2026** — Admin SOLD toggle. New `PATCH /api/properties/{id}/sold?sold=true|false` endpoint. Added "Mark Sold" button to every Admin Properties row that turns into a red "SOLD" indicator when toggled. Public-facing pages (Inventory.jsx all 3 tables, CrexiListings.jsx cards) now show a red "SOLD" badge + faded styling for sold properties. `sold:false` field added to Property model.
- [x] **Feb 24, 2026** — Hero image refresh on Home page. Lighter overlay (`from-slate-900/85 via-slate-900/55 to-slate-900/15`) so the background photo is clearly visible. Switched to a Florida residential home photo (no ocean — true to Palm Bay's inland geography).
- [x] **Feb 24, 2026** — Strengthened www→non-www redirect: now also injects `<meta name="robots" content="noindex,nofollow">` synchronously before the redirect fires, so even Googlebot's pre-render snapshot sees a clear noindex directive on the www URL.
- [x] **Feb 23, 2026** — SEO canonical standardization. Removed duplicate canonical tag from index.html (was creating 2 canonicals per page when combined with react-helmet's per-page canonical). All pages now have exactly one canonical pointing to non-www.
- [x] **Feb 23, 2026** — Auto-seed logic finalized: `seed_data.py` populated with 21 real Crexi listings; `server.py` imports and reseeds curated collection on startup if count ≠ 21.
- [x] **Feb 23, 2026** — Image upload support in Admin panel: new `routes/images.py` (POST /api/upload-image, GET /api/images/{id}, DELETE /api/images/{id}). Auto-resizes to max 1600px, JPEG quality 82, stored as BSON in `images` MongoDB collection. Admin UI gained Upload button with live preview + Remove link. Pillow 12.2.0 added to requirements.txt.
- [x] **Feb 23, 2026** — Image optimization for page speed: all 16 `<img>` tags across the site got `loading`/`fetchpriority`/`decoding` attributes. Hero images use `loading="eager" fetchpriority="high"`; card/below-fold images use `loading="lazy" decoding="async"`. Verified via testing agent (13/13 backend + full UI regression passed).

### P3 - Backlog
- [ ] Twilio SMS long-code phone number (blocked — awaiting user action on Twilio account)

---

## Google Search Console Indexing Progress (as of Feb 23, 2026)

**Domain property:** `palmbaylots-land.com` (covers www + non-www)
**Sitemap submitted:** `https://www.palmbaylots-land.com/api/sitemap.xml` ✅

### ✅ Already requested indexing (user-confirmed)
- `/` (Home)
- `/palm-bay-land-for-sale`
- `/owner-financing-land-florida`
- `/quarter-acre-lots-palm-bay`
- `/buildable-lots-palm-bay`
- `/listings`
- `/listing/328-malabar-rd`
- `/listing/scattered-lots`
- `/listing/2418-fleming-ave`

### ⏳ Pending indexing request (in queue — submit 10-12/day due to GSC quota)
- `/guide/build-on-land-palm-bay`
- `/guide/septic-vs-sewer-palm-bay`
- `/guide/owner-financing-what-to-watch`
- `/guide/buy-land-without-realtor`
- `/guide/flood-zones-palm-bay`
- `/inventory`
- `/price-guide`
- `/blog/is-palm-bay-good-investment-2025`
- `/blog/how-owner-financing-works`
- `/blog/building-costs-palm-bay`
- `/blog/palm-bay-zoning-explained`
- `/blog/city-water-vs-well-septic`
- `/blog/flood-zones-palm-bay`
- `/about`
- `/blog`
- `/sell-land`
- `/contact`

---

## Content Summary

### Blog Articles (6 Total)
| Article | Words | Topics |
|---------|-------|--------|
| Is Palm Bay Good Investment | ~1,500 | Growth, strategies, risks |
| Owner Financing Guide | ~1,500 | Process, terms, qualification |
| Building Costs | ~1,500 | Cost breakdown, timeline |
| Zoning Explained | ~1,200 | RS-1/2, RM-6, C-1/2/3 |
| City Water vs Well | ~1,100 | Cost comparison, pros/cons |
| Flood Zones | ~1,000 | Zone types, insurance costs |

### Featured Properties
| Property | Price | Highlights |
|----------|-------|------------|
| 328 Malabar Rd | $1,575,000 | Signalized corner, 23K traffic |
| Babcock Commercial | $895,000 | 2.5 AC, 30K+ traffic |
| NE Multi-Family | $275,000 | 5 lots, RM-6 zoning |
