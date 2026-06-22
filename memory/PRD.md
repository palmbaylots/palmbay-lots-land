# Palm Bay Lots-Land — Product Requirements

## Project Owner
Vahid Reza Rajabian — Broker Associate, M. David Moallem, Inc. (20+ yrs Palm Bay land specialist)

## Domain & SEO
- **Canonical:** `https://palmbaylots-land.com` (non-www, enforced by Cloudflare 308)
- **Do NOT** add JS redirects or static `<meta>` SEO tags in index.html — Helmet manages everything.

## Stack
- Frontend: React + Tailwind + Shadcn + react-helmet-async
- Backend: FastAPI + Motor (async MongoDB)
- Mongo: `properties`, `leads`, `blogs`, `status_checks`

## Core Capabilities

### Inventory & Listings
- ~580 inventory lots auto-seeded from `frontend/public/inventory.csv`
- 21 curated Crexi listings seeded from `backend/seed_data.py`
- Admin CRUD via `/admin` (page-password gated)
- "City Water & Sewer" filter on tags
- Featured Special Listing on home (1039 Hooper Ave NE)

### Blog CMS (NEW — June 2026)
- **MongoDB-backed `blogs` collection** (11 posts migrated non-destructively from `blogContent.js`)
- **Public API**
  - `GET  /api/blogs` — list all blogs
  - `GET  /api/blogs/{slug}` — single blog
- **Authenticated API** (Bearer `BLOG_API_KEY`)
  - `POST   /api/blogs` — create (+ Google/IndexNow ping)
  - `PATCH  /api/blogs/{slug}` — update (+ ping)
  - `DELETE /api/blogs/{slug}` — delete (+ URL_DELETED ping)
  - `POST   /api/blogs/{slug}/reindex` — manual re-ping
- **Admin UI** at `/admin → Blogs tab` (full CRUD, FAQ editor, image upload, re-index button)
- **Indexing**
  - Google Indexing API via service account in `GOOGLE_INDEXING_SERVICE_ACCOUNT_JSON`
  - IndexNow ping (Bing/Yandex/DuckDuckGo) — key file at `/MquMx2zP7boDfUQ5jahRdSPJYciiAv4a.txt`
- **Frontend graceful fallback** — `Blog.jsx` and `BlogPost.jsx` import `blogContent.js` as initial state and upgrade to live API data

### Other
- Twilio SMS alerts on new leads (pending phone-number upgrade by user)
- OpenAI GPT-4o chatbot via Emergent LLM Key
- reCAPTCHA on contact form

## Test Credentials
- Admin password: `PalmBay2024!`
- Blog API Bearer: `M-quMx2zP7boDfUQ5jahRdSPJYciiAv4a2-Kt5FC60I`

## Known External Config Required
- **Google Search Console:** add `indexing-bot@project-5fb5af62-52c5-4cbb-a8e.iam.gserviceaccount.com` as a property owner. Until then, Google ping returns 403 (does not block publishing — IndexNow continues to work).
- **Twilio:** phone number upgrade pending user action.

## Backlog
- P2 — Transient "0 Inventory" load state: add auto-retry + error banner in `Inventory.jsx`
- P2 — Individual lot pages (~580) for SEO footprint
- P2 — Ocala listing cleanup (delete vs. noindex — awaiting user decision)
- P3 — Twilio phone number purchase

## Changelog (June 2026)
- Built Blog CMS end-to-end: backend (CRUD API, Bearer auth, indexing service, startup migration), admin UI (Blogs tab with FAQ editor, image upload, reindex button), frontend refactor (live API fetch + JS fallback). All 16 backend pytest tests + frontend Playwright flows pass.
- Suppressed lead-capture popup on `/admin`, `/blog/*`, and `/contact` to avoid overlaying critical UI.
