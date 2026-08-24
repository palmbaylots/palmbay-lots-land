# Palm Bay Lots & Land — Business Memory

This file is loaded automatically at the start of every Claude session in this repo.
It is the single source of truth about the business so you never have to re-explain it.
Keep it accurate — when a fact below changes, update it here.

---

## 1. Who we are

- **Business name:** Palm Bay Lots-Land (palmbaylots-land.com)
- **Brokerage (legal):** M. David Moallem, Inc.
- **Broker Associate:** Vahid Reza Rajabian — 20+ years in Palm Bay land
- **License:** FL BK3454072
- **Phone:** 321-333-7230
- **Email:** vahid@palmbayland.com
- **Office:** 1663 Georgia St NE, Suite 700, Palm Bay, FL 32907
- **Founded:** 2003
- **Crexi broker page:** https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8

**What we do:** Sell residential (and some commercial/multifamily) vacant land lots in
Palm Bay, FL, with **owner financing**. ~582+ lots in inventory. We also help people
**sell** their Palm Bay land. Our edge: owner financing with personal approval, a lot
protection/exchange guarantee, and deep local knowledge.

The website's AI chat assistant persona is named **"Derrick"** (see
`backend/routes/chat.py` — that system prompt is the authoritative product/pricing spec).

---

## 2. The numbers that matter (authoritative — trust over any sample list)

**Inventory:** 582+ Palm Bay lots. Residential (office) lots start at ~$41,000 (SW), ~$45,000
in some SE areas, and ~$52,000+ in others. Separate outside/cash inventory starts at ~$35,000.
The site-wide "starting at" figure is **$41,000** (least-expensive office-inventory lot).

**Pricing formula (base price per sq ft, by Unit):**
- $4.10/sqft: Unit 49
- $4.50/sqft: Units 10,11,12,15,16,17,18,19,20,21,22,23,24,25,28,30,31,32,36,37,46
- $5.20/sqft: Units 5,7,8,9,13,14,26,38,39,41,42,44,48,50
- Lots over 10,000 sqft: first 10,000 at base rate, each extra sqft at $3.00
- Canal lot: +$5,000

**Utility premiums (added to total):**
- City Water **and** Sewer (+$40,000): Units 5, 7, 8, 9, 38
- City Water only, septic needed (+$20,000): Units 10,11,12,16,21,28,31,42,44,46,48,50
- Well & Septic (no premium, most affordable): all other units

**Owner financing:**
- 30% down = option contract; 40% down = deed at closing
- 10% interest rate (≈12.33% APR when the 10-point charge is financed), up to 10 years
  (120 months); ≈ $13.22/month per $1,000 financed
- Deed transfers once 40% of price is paid
- Personal approval (we look at the person, not just a credit score), same-day in most cases
- No prepayment penalty, no balloon, 10-day grace period

**Lot protection guarantee:** if a lot has an issue, buyer can exchange for another lot
of the same price category and size at no extra cost (except deed transfer fee).

**Palm Bay quadrants:** SW = most upside (St. Johns Heritage Pkwy corridor, national
builders), $35–65k. NW = established, near Melbourne/Viera, $40–70k. NE = most developed,
best utilities, $45–75k+. SE = value, $35–60k. **The Compound** (Port Malabar Units 51/52/53)
= NOT buildable / no utilities, sold only as a whole package, never individually.

**Local facts worth citing:** Palm Bay ranked #13 most affordable U.S. city (2026), only FL
city in the top 20. Ashton Park = 1,568-acre master-planned community, 5,500+ units coming
(Micco Rd / SJHP). Malabar Road widening (2→4 lanes) in design. Florida has no state income tax.

---

## 3. Tech stack (how the site works)

- **Frontend:** React (CRA) in `frontend/` — pages in `frontend/src/pages`, components in
  `frontend/src/components`, shadcn/ui in `frontend/src/components/ui`.
- **Backend:** FastAPI in `backend/` — routes in `backend/routes/` (`properties`, `leads`,
  `chat`, `blogs`, `admin`, `images`, `parcel`). Data models in `backend/models.py`.
- **Database:** MongoDB (via `backend/database.py`). Properties auto-seed from
  `frontend/public/inventory.csv` on first run (non-destructive — manual edits survive restarts).
- **AI chat:** `backend/routes/chat.py` — "Derrick", OpenAI gpt-4.1-mini via emergentintegrations.
- **Blog publishing API** (`backend/routes/blogs.py`): `POST /api/blogs` with header
  `Authorization: Bearer <BLOG_API_KEY>` publishes a post and pings Google + IndexNow.
  Blog shape: `{slug, title, metaTitle, metaDescription, subtitle, category, date, readTime,
  image, content (HTML string), faqs:[{q,a}]}`. `?upsert=true` to overwrite.
- **SEO:** heavy — JSON-LD in `frontend/src/data/businessSchema.js`, blogs, and `pages/seo`.

**Never** commit secrets. `.env`, `*.key`, `credentials.json` are gitignored — keep it that way.

---

## 4. Brand voice (use this for anything customer-facing)

Honest, direct, and genuinely helpful — never hype. We tell people the real picture even
when it's "no" (e.g. the honest land-lease and mobile-home guidance in existing blogs). We
lead with local expertise and the concrete advantages (owner financing, personal approval,
lot exchange guarantee, no bank). Concise but informative. Confident, friendly, never pushy.
We help first and only point people to call Vahid (321-333-7230) for lot-specific specifics
or letter-block/commercial pricing we don't have data for.

---

## 5. How to work in this repo

- **ALWAYS work from the latest code — check before you change.** This repo is deployed
  by Emergent from `main`, and other chats/sessions (e.g. the CEO marketing chat) push
  fixes there. A feature branch can be many commits behind. BEFORE writing or "fixing"
  anything: `git fetch origin main` and compare (or branch fresh from `origin/main`).
  Never fix something without first confirming it isn't already fixed — and never merge a
  branch built on stale code, or it will overwrite newer live changes. Read the current
  file, not your memory of it.
- Feature branch for this line of work: `claude/new-session-hoz5ve`. Commit with clear
  messages; push with `git push -u origin <branch>`. Don't open a PR unless asked.
- The reusable **skills** for this business live in `.claude/skills/` — market research,
  blog drafting, listing copy, lead follow-up, social content. Invoke them by task.
- The **subagents** live in `.claude/agents/` — e.g. `opportunity-scout` for autonomous
  web research. Spawn them for fan-out research/content work.
- Autonomy: recurring autonomous runs (e.g. a weekly market scan) are set up as scheduled
  **Routines**. See `.claude/AUTOMATION.md` for what's wired up and how to add more.
