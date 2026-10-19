"""
SEO pre-render data for crawlers (Google, Bing, ChatGPT, Perplexity).

The site is a React single-page app, so the raw HTML for EVERY URL used to be
the same 11KB shell (homepage title, no description, no canonical, no text).
The Cloudflare Worker in /cloudflare/seo-worker.js calls

    GET /api/seo/page?path=/blog/some-post

and injects what this returns into the HTML before it leaves the edge:
  - status       200 or 404 (unknown URLs / deleted listings now return a real 404)
  - title, description, canonical, robots
  - jsonld       page-specific structured data (Article, BreadcrumbList, ...)
  - html         the page's real text + internal links, placed inside #root.
                 React replaces it on load, so humans see the normal app.

Also serves /api/sitemap-full.xml: static pages + every blog (from the DB, with
real dates) + every property, using the SAME slug rule as the frontend canonical.

COMPLIANCE: descriptions here never contain finance trigger terms (%, rate,
payment, term). Only "owner financing available, call for terms".
"""
import html as _html
import re
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Query
from fastapi.responses import Response

from database import db

router = APIRouter()

SITE = "https://palmbaylots-land.com"
LEGAL = "Vahid Rajabian, Broker Associate | M. David Moallem, Inc. | License #BK3454072"
FIN = "Owner financing available, call for terms."

# path -> (title, description, h1)
STATIC_PAGES = {
    "/": ("Palm Bay Land for Sale | 500+ Lots | Owner Financing Available",
          f"Residential lots starting at $41,000 in Palm Bay, FL. {FIN} Serving individuals, builders, and investors since 2003. Call 321-333-7230.",
          "Palm Bay Lots & Land"),
    "/about": ("About Vahid Reza Rajabian | Palm Bay Real Estate Broker Since 2003",
               "Vahid Rajabian, Palm Bay land specialist since 2003. 20+ years selling residential, commercial, and industrial lots throughout Brevard County.",
               "About Vahid Rajabian"),
    "/inventory": ("Lots for Sale in Palm Bay FL | Owner Financing Available",
                   "Browse 580+ residential lots in Palm Bay, Florida. Filter by location, size, and utility availability. Owner financing on most lots. Starting at $41,000.",
                   "Palm Bay Lot Inventory"),
    "/map": ("Palm Bay Land Inventory Map | Vahid Rajabian, Broker",
             "Interactive map of Palm Bay, FL lots for sale. Click any lot for price and links to Google Maps and Brevard County (BCPAO) parcel records.",
             "Palm Bay Lot Map"),
    "/price-guide": ("Palm Bay Lot Price Guide & Financing | Owner Financing Available",
                     f"Palm Bay lot pricing by unit and area. {FIN} No bank required.",
                     "Palm Bay Lot Price Guide"),
    "/contact": ("Contact Vahid Rajabian | Palm Bay Land Broker | 321-333-7230",
                 "Contact Vahid Rajabian, Palm Bay land broker since 2003. Call 321-333-7230 or email vahid@palmbayland.com. Free land value assessments.",
                 "Contact Vahid Rajabian"),
    "/privacy-policy": ("Privacy Policy | Palm Bay Lots & Land",
                        "Privacy Policy for palmbaylots-land.com.", "Privacy Policy"),
    "/listings": ("Palm Bay Commercial, Industrial & Investment Land for Sale | Vahid Rajabian",
                  "Commercial, industrial, multifamily, and investment land for sale in Palm Bay and Brevard County. Signalized corners, bulk packages, and development parcels.",
                  "Commercial & Investment Land"),
    "/mls-listings": ("Space Coast MLS Listings | Palm Bay Lots & Land",
                      "Search current Space Coast MLS listings in Palm Bay and Brevard County with Vahid Rajabian.",
                      "Space Coast MLS Listings"),
    "/listing/328-malabar-rd": ("328 Malabar Rd Palm Bay FL | 1.75 AC Commercial Corner",
                                "1.75-acre commercial corner at 328 Malabar Rd, Palm Bay FL. Signalized intersection, 475 ft frontage. Ideal for QSR, medical, retail, mixed-use.",
                                "328 Malabar Rd SE, Palm Bay FL"),
    "/listing/scattered-lots": ("580+ Scattered Lots for Sale in Palm Bay FL | From $41,000",
                                f"580+ residential lots available in Palm Bay, FL for builders, investors, or individual buyers. From $41,000. {FIN}",
                                "Scattered Lots in Palm Bay"),
    "/listing/2418-fleming-ave": ("2418 Fleming Avenue SW, Palm Bay FL | $65,000 | City Water",
                                  f"Residential lot at 2418 Fleming Avenue SW, Palm Bay, FL. 10,019 sq ft with city water. $65,000. {FIN}",
                                  "2418 Fleming Ave SW, Palm Bay FL"),
    "/sell-land": ("Sell Your Lot or Land in Palm Bay FL | Free Land Value Assessment",
                   "Selling a lot or land in Palm Bay or Brevard County? Get a free land value assessment from a local land specialist since 2003.",
                   "Sell Your Land in Palm Bay"),
    "/blog": ("Palm Bay Land Guide | Real Estate Tips & Market Insights",
              "Palm Bay land buying guides, market updates, zoning explained, owner financing tips, and investment analysis from a 23-year Palm Bay land specialist.",
              "Palm Bay Land Blog"),
    "/palm-bay-land-for-sale": ("Land for Sale in Palm Bay, FL | 500+ Lots | Owner Financing",
                                f"Browse 500+ lots for sale in Palm Bay, Florida. Residential, commercial, and buildable land. Prices starting at $41,000. {FIN}",
                                "Land for Sale in Palm Bay, FL"),
    "/owner-financing-land-florida": ("Owner Financing Land Florida | No Bank Qualification | Palm Bay Lots",
                                      f"Buy land in Palm Bay, Florida with owner financing. No bank qualification, personal approval, deed transfer before payoff. {FIN}",
                                      "Owner Financing Land in Florida"),
    "/quarter-acre-lots-palm-bay": ("Quarter Acre Lots Palm Bay FL | 1/4 Acre Land for Sale | Owner Financing",
                                    f"Buy 1/4 acre lots in Palm Bay, Florida. 10,000+ sq ft residential lots for single family homes. Starting at $41,000. {FIN}",
                                    "Quarter Acre Lots in Palm Bay"),
    "/buildable-lots-palm-bay": ("Buildable Lots Palm Bay FL | 500+ Vacant Lots for Sale | Owner Financing",
                                 f"500+ residential lots in Palm Bay, Florida with city water, well and septic options. Lot exchange protection. Starting at $41,000. {FIN}",
                                 "Buildable Lots in Palm Bay, FL"),
    "/guide/build-on-land-palm-bay": ("How to Build on a Lot in Palm Bay FL | Palm Bay Lots & Land",
                                      "Thinking about building on a vacant lot in Palm Bay? Learn the steps, permits, and what to expect from a team that has sold thousands of Palm Bay lots.",
                                      "How to Build on a Lot in Palm Bay"),
    "/guide/septic-vs-sewer-palm-bay": ("Septic vs Sewer in Palm Bay FL | Palm Bay Lots & Land",
                                        "Not sure if your Palm Bay lot is on septic or sewer? The difference, the costs, and what it means for building your home.",
                                        "Septic vs Sewer in Palm Bay"),
    "/guide/owner-financing-what-to-watch": ("Owner Financing Land: What to Watch Out For | Palm Bay Expert Guide",
                                             "What to watch out for when buying land with owner financing in Florida: deed transfer timing, hidden fees, prepayment penalties, and how our approach is different.",
                                             "Owner Financing Land: What to Watch Out For"),
    "/guide/buy-land-without-realtor": ("How to Buy Land Without a Realtor in Florida | Step-by-Step Guide",
                                        "How to buy land in Florida without a realtor: verify zoning, check utilities, avoid scams, and close directly with the seller.",
                                        "How to Buy Land Without a Realtor"),
    "/guide/flood-zones-palm-bay": ("Palm Bay Flood Zones Explained | Palm Bay Lots & Land",
                                    "Find out which flood zone your Palm Bay lot is in before you buy. FEMA flood zones explained and how they affect building in Palm Bay, FL.",
                                    "Palm Bay Flood Zones Explained"),
}
NOINDEX = {"/privacy-policy"}
REDIRECTS = {"/privacy": "/privacy-policy"}
# Real app routes we don't pre-render content for, but must not 404.
PASSTHROUGH_PREFIXES = ("/admin", "/property-admin-demo", "/mls-listing/")
# Blogs hard-coded in frontend/src/data/blogContent.js (render even if not in the DB).
FRONTEND_BLOG_SLUGS = set(['building-costs-palm-bay', 'city-water-vs-well-water', 'flood-zones-palm-bay', 'how-owner-financing-works', 'is-palm-bay-good-investment-2025', 'land-lease-palm-bay-florida', 'malabar-road-widening-palm-bay-2026', 'palm-bay-13-most-affordable-city-2026', 'palm-bay-commercial-zoning-explained', 'palm-bay-zoning-explained', 'the-compound-palm-bay-buyers-2026', 'the-compound-palm-bay-lot-owners'])

NAV = [("/", "Home"), ("/inventory", "Lot Inventory"), ("/map", "Lot Map"),
       ("/price-guide", "Price Guide"), ("/listings", "Commercial Land"),
       ("/palm-bay-land-for-sale", "Palm Bay Land for Sale"),
       ("/buildable-lots-palm-bay", "Buildable Lots"),
       ("/quarter-acre-lots-palm-bay", "Quarter Acre Lots"),
       ("/owner-financing-land-florida", "Owner Financing"),
       ("/blog", "Blog"), ("/sell-land", "Sell Your Land"),
       ("/about", "About"), ("/contact", "Contact")]
GUIDES = [(p, STATIC_PAGES[p][2]) for p in STATIC_PAGES if p.startswith("/guide/")]


def slugify(text: str) -> str:
    """Must match the frontend canonical rule in PropertyDetail.jsx."""
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower())
    return re.sub(r"-+", "-", s).strip("-")


def esc(s) -> str:
    return _html.escape(str(s or ""), quote=True)


def strip_tags(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s or "")).strip()


def links_html(items) -> str:
    return "<ul>" + "".join(f'<li><a href="{p}">{esc(t)}</a></li>' for p, t in items) + "</ul>"


def breadcrumb(crumbs):
    return {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + p}
            for i, (p, n) in enumerate(crumbs)
        ],
    }


def wrap(h1: str, body: str, recent_blogs) -> str:
    nav = f'<nav aria-label="Main">{links_html(NAV)}</nav>'
    more = (f"<section><h2>Palm Bay Land Guides</h2>{links_html(GUIDES)}</section>"
            f"<section><h2>Latest Articles</h2>{links_html(recent_blogs)}</section>")
    foot = (f"<footer><p>{esc(LEGAL)}</p><p>1663 Georgia St NE, Suite 700, Palm Bay, FL 32907 · "
            f'<a href="tel:+13213337230">321-333-7230</a> · vahid@palmbayland.com</p></footer>')
    return f'<div id="seo-prerender">{nav}<main><h1>{esc(h1)}</h1>{body}</main>{more}{foot}</div>'


def to_iso(d) -> Optional[str]:
    if not d:
        return None
    if isinstance(d, datetime):
        return d.date().isoformat()
    s = str(d)
    if re.match(r"\d{4}-\d{2}-\d{2}", s):
        return s[:10]
    for fmt in ("%B %d, %Y", "%B %Y", "%b %d, %Y", "%b %Y"):
        try:
            return datetime.strptime(s.strip(), fmt).date().isoformat()
        except ValueError:
            pass
    return None


def blog_dates(b):
    pub = to_iso(b.get("date")) or to_iso(b.get("publishedAt"))
    exact = to_iso(b.get("publishedAt"))
    # "September 2026" has no day: use the real publish timestamp if it's in that month.
    if pub and exact and pub[:7] == exact[:7]:
        pub = exact
    mod = to_iso(b.get("updatedAt")) or pub
    return pub, mod


async def recent_blog_links(n=8):
    cur = db.blogs.find({}, {"_id": 0, "slug": 1, "title": 1}).sort([("publishedAt", -1)]).limit(n)
    return [(f"/blog/{b['slug']}", b.get("title", b["slug"])) async for b in cur]


def page(status, title, desc, path, html, jsonld=None, robots="index, follow", redirect=None):
    return {"status": status, "title": title, "description": desc,
            "canonical": SITE + (path if path != "/" else "/"), "robots": robots,
            "jsonld": jsonld or [], "html": html, "redirect": redirect}


async def find_property(slug: str):
    want = slugify(slug)
    doc = await db.properties.find_one({"$or": [{"id": slug}, {"inventoryId": slug}]}, {"_id": 0})
    if doc:
        return doc
    # Narrow by street number first, then compare slugs the same way the frontend does.
    # Full scan (~600 docs, cheap) so a real lot is never wrongly 404'd.
    async for p in db.properties.find({}, {"_id": 0}):
        t = slugify(p.get("title", ""))
        a = slugify(f"{p.get('streetNumber', '')} {p.get('streetName', '')}")
        if want in (t, a):
            return p
    return None


@router.get("/seo/page")
async def seo_page(path: str = Query("/")):
    path = "/" + path.split("?")[0].split("#")[0].strip("/")
    if path != "/" and path.endswith("/"):
        path = path.rstrip("/")
    recent = await recent_blog_links()

    if path in REDIRECTS:
        return page(301, "", "", REDIRECTS[path], "", redirect=SITE + REDIRECTS[path])

    if path in STATIC_PAGES:
        title, desc, h1 = STATIC_PAGES[path]
        crumbs = [("/", "Home")] + ([(path, h1)] if path != "/" else [])
        body = f"<p>{esc(desc)}</p>"
        if path == "/blog":
            body += f"<h2>All Articles</h2>{links_html(await recent_blog_links(200))}"
        return page(200, title, desc, path, wrap(h1, body, recent), [breadcrumb(crumbs)],
                    robots="noindex, follow" if path in NOINDEX else "index, follow")

    if path.startswith(PASSTHROUGH_PREFIXES):
        return page(200, "", "", path, "", robots="")

    m = re.match(r"^/blog/([a-z0-9-]+)$", path)
    if m:
        b = await db.blogs.find_one({"slug": m.group(1)}, {"_id": 0})
        if b:
            title = b.get("metaTitle") or f"{b['title']} | Palm Bay Lots & Land"
            desc = b.get("metaDescription") or b.get("subtitle") or strip_tags(b.get("content", ""))[:155]
            pub, mod = blog_dates(b)
            img = b.get("image") or ""
            if img.startswith("/"):
                img = SITE + img
            article = {
                "@context": "https://schema.org", "@type": "Article",
                "headline": b["title"][:110], "description": desc,
                "author": {"@type": "Person", "name": "Vahid Rajabian", "url": SITE + "/about"},
                "publisher": {"@id": SITE + "/#business"},
                "mainEntityOfPage": SITE + path,
            }
            if pub:
                article["datePublished"] = pub
            if mod:
                article["dateModified"] = mod
            if img:
                article["image"] = img
            ld = [article, breadcrumb([("/", "Home"), ("/blog", "Blog"), (path, b["title"])])]
            faqs = b.get("faqs") or []
            faq_html = ""
            if faqs:
                ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
                    {"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
                    for f in faqs if f.get("q") and f.get("a")]})
                faq_html = "<h2>Frequently Asked Questions</h2>" + "".join(
                    f"<h3>{esc(f['q'])}</h3><p>{esc(f['a'])}</p>" for f in faqs)
            byline = f"<p>By Vahid Rajabian{(' · ' + esc(b.get('date'))) if b.get('date') else ''}</p>"
            body = f"{byline}<p>{esc(b.get('subtitle', ''))}</p><article>{b.get('content', '')}</article>{faq_html}"
            return page(200, title, desc, path, wrap(b["title"], body, recent), ld)
        if m.group(1) in FRONTEND_BLOG_SLUGS:
            return page(200, "", "", path, "", robots="")

    m = re.match(r"^/property/([^/]+)$", path)
    if m:
        p = await find_property(m.group(1))
        if p:
            name = p.get("title") or f"{p.get('streetNumber', '')} {p.get('streetName', '')}".strip()
            city = p.get("city") or "Palm Bay"
            acres = p.get("acres") or ""
            canon = "/property/" + (slugify(name) or m.group(1))
            title = f"{name}, {city} | {acres} Lot".strip(" |")
            desc = f"{acres} lot at {name}, {city}. {FIN} Call Vahid 321-333-7230.".strip()
            facts = [("Price", p.get("price")), ("Size", acres), ("City", city),
                     ("Unit", p.get("unit")), ("Block", p.get("block")), ("Lot", p.get("lot")),
                     ("Type", p.get("propertyType"))]
            body = (f"<p>{esc(p.get('description', ''))}</p><ul>"
                    + "".join(f"<li>{k}: {esc(v)}</li>" for k, v in facts if v) + "</ul>"
                    + f'<p>{FIN} <a href="/inventory">See all lots</a> · <a href="/contact">Contact Vahid</a></p>')
            ld = [{"@context": "https://schema.org", "@type": "RealEstateListing", "name": name,
                   "url": SITE + canon, "description": desc},
                  breadcrumb([("/", "Home"), ("/inventory", "Inventory"), (canon, name)])]
            return page(200, title, desc, canon, wrap(name, body, recent), ld)

    # Unknown URL or deleted listing -> real 404
    return page(404, "Page Not Found | Palm Bay Lots & Land", "This page could not be found.", path,
                wrap("Page not found", '<p>Sorry, that page does not exist. <a href="/inventory">Browse our lots</a>.</p>', recent),
                robots="noindex, follow")


@router.get("/sitemap-full.xml")
async def sitemap_full():
    today = datetime.now(timezone.utc).date().isoformat()
    urls = []
    for path in STATIC_PAGES:
        if path in NOINDEX:
            continue
        pri = "1.0" if path == "/" else "0.9"
        urls.append((SITE + path, None, pri))
    async for b in db.blogs.find({}, {"_id": 0, "slug": 1, "date": 1, "publishedAt": 1, "updatedAt": 1}):
        pub, mod = blog_dates(b)
        urls.append((f"{SITE}/blog/{b['slug']}", mod or pub, "0.8"))
    seen = set()
    async for p in db.properties.find({}, {"_id": 0, "title": 1, "streetNumber": 1, "streetName": 1, "updatedAt": 1}):
        s = slugify(p.get("title") or f"{p.get('streetNumber', '')} {p.get('streetName', '')}")
        if not s or s in seen:
            continue
        seen.add(s)
        urls.append((f"{SITE}/property/{s}", to_iso(p.get("updatedAt")), "0.6"))
    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lastmod, pri in urls:
        lm = f"<lastmod>{lastmod}</lastmod>" if lastmod else ""
        parts.append(f"  <url><loc>{esc(loc)}</loc>{lm}<priority>{pri}</priority></url>")
    parts.append("</urlset>")
    return Response("\n".join(parts), media_type="application/xml",
                    headers={"Cache-Control": "public, max-age=3600", "X-Generated": today})
