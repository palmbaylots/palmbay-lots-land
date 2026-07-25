---
name: palmbay-blog-writer
description: Draft a publish-ready SEO blog post about Palm Bay land, owner financing, zoning, utilities, buying/selling process, or a market topic — in the site's honest, local-expert voice, matching the exact blog data shape the site expects. Use when the user wants a new blog/article, wants to turn a market-brief angle into a post, or wants to publish content to the site. Produces JSON ready for the POST /api/blogs endpoint.
---

# Palm Bay Blog Writer

Read `CLAUDE.md` (business facts + brand voice) and, for tone, skim an existing entry in
`frontend/src/data/blogContent.js` before drafting.

## Voice & rules
- Honest and genuinely useful first (tell the real picture, even when the answer is "no").
- Local-expert, concrete, never hype. Weave in real facts from `CLAUDE.md` (pricing formula,
  owner financing terms, quadrants, local facts) where relevant — but never invent lot-specific
  prices or availability. Point to calling Vahid (321-333-7230) for specifics.
- Google-friendly: real search intent, clear `<h2>/<h3>` structure, natural keywords
  (e.g. "owner financing land Palm Bay", "buildable lots Palm Bay FL", "<topic> Brevard County").
- 800–1500 words. End with a short CTA and 3–5 FAQs.

## Output shape (matches `backend/routes/blogs.py` BlogIn)
Produce a JSON object:
```json
{
  "slug": "lowercase-hyphens-only",
  "title": "...",
  "metaTitle": "≤ ~60 chars",
  "metaDescription": "≤ ~155 chars, compelling",
  "subtitle": "one-sentence hook",
  "category": "General | Commercial & Investment | Financing | Buying Guide | Local Market",
  "date": "Month YYYY",
  "readTime": "N min read",
  "image": "https://images.unsplash.com/...  (relevant, license-safe)",
  "content": "<img .../> <p>...</p> <h2>...</h2> ...   (HTML string, same style as blogContent.js)",
  "faqs": [{"q": "...", "a": "..."}]
}
```
Match the existing HTML content style (inline-styled hero `<img>`, `<h2>/<h3>`, `<ul>`,
`<strong>`). Write the JSON to `content/blog-drafts/<slug>.json`.

## Publishing (only when the user says to publish)
The site publishes via authenticated API:
```
POST {SITE_URL}/api/blogs   Header: Authorization: Bearer <BLOG_API_KEY>   Body: <the JSON>
```
`BLOG_API_KEY` is a secret — never hardcode or print it; read from env at publish time.
Add `?upsert=true` to overwrite an existing slug. Do not publish without explicit go-ahead.
Always show the draft for approval first.
