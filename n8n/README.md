# n8n Blog Publishing Workflows

Two workflows for `palmbaylotsland.app.n8n.cloud`:

| File | Webhook | Purpose |
|---|---|---|
| `publish-blog.workflow.json` | `POST /webhook/publish-blog` | Reads `{slug}.json` from Drive, publishes to the site, pings Google + IndexNow |
| `doc-to-json.workflow.json`  | `POST /webhook/doc-to-json`  | Converts a structured Google Doc into a `{slug}.json` draft in the Drive folder |

---

## ⚠️ Before You Test: Production Needs a Redeploy

The Blog CMS API (`POST /api/blogs`, `/reindex`, etc.) lives in this preview build and passes 16/16 backend tests. **It is NOT yet on `palmbaylots-land.com` production.** Click **Deploy** in Emergent to push the build, then the n8n workflows will work end-to-end.

You can verify it's live on production with:
```bash
curl https://palmbaylots-land.com/api/blogs | head -c 200
```
If you get blog data → deployed. If 404 → still needs redeploy.

---

## Step 1 — Import the Workflows

1. Open `palmbaylotsland.app.n8n.cloud`
2. Top-right menu → **Import from File**
3. Import **both** files from `/app/n8n/` in this repo:
   - `publish-blog.workflow.json`
   - `doc-to-json.workflow.json`

---

## Step 2 — Attach Google Drive Credentials

Both workflows have Drive nodes that will be flagged red after import.

1. In n8n: Settings → **Credentials** → **+ New** → **Google Drive OAuth2 API**
2. Connect with the Google account that owns folder `13CFbBbe4SesEhAXF7xCSy1wq6VMRB0Y9`
3. Open each Drive node in the workflow and select that credential

(Workflows share one credential — you only set it up once.)

---

## Step 3 — Activate

Toggle each workflow to **Active** (top right). The webhook URLs become:

- `https://palmbaylotsland.app.n8n.cloud/webhook/publish-blog`
- `https://palmbaylotsland.app.n8n.cloud/webhook/doc-to-json`

> While testing, you can also use `/webhook-test/...` instead of `/webhook/...` for one-off runs that show up in the Executions tab without activating the workflow.

---

## Drive File Format (`{slug}.json`)

Save one file per blog in folder `13CFbBbe4SesEhAXF7xCSy1wq6VMRB0Y9`, named exactly `{slug}.json`:

```json
{
  "title": "Real Estate Investing in Palm Bay, Florida — 2026 Guide",
  "metaTitle": "Palm Bay Real Estate Investing 2026 | Vahid Rajabian",
  "metaDescription": "How to invest in Palm Bay real estate in 2026 — land, owner financing, and what smart buyers are doing now.",
  "subtitle": "A practical guide from a 23-year Palm Bay land specialist.",
  "category": "Investment",
  "date": "June 2026",
  "readTime": "8 min read",
  "image": "https://customer-assets.emergentagent.com/.../hero.jpg",
  "content": "<p>Lead paragraph...</p><h2>Section</h2><p>...</p>",
  "faqs": [
    { "q": "Is Palm Bay still a good investment in 2026?", "a": "Yes — here's why..." }
  ]
}
```

Only `title` and `content` are strictly required. The workflow always forces `slug` to match the webhook input (single source of truth).

---

## Triggering a Publish

```bash
curl -X POST https://palmbaylotsland.app.n8n.cloud/webhook/publish-blog \
  -H "Content-Type: application/json" \
  -d '{"slug":"real-estate-investing-palm-bay-florida-2026"}'
```

Response on success:
```json
{
  "ok": true,
  "slug": "real-estate-investing-palm-bay-florida-2026",
  "action": "created",          // or "updated" if it already existed
  "indexing": "queued",
  "url": "https://palmbaylots-land.com/blog/real-estate-investing-palm-bay-florida-2026"
}
```

What happens under the hood:
1. Webhook validates slug format (lowercase, numbers, hyphens)
2. Drive: finds the file named `{slug}.json` in the folder
3. Drive: downloads + parses the JSON
4. Site: `POST /api/blogs` with Bearer token
   - 201 → published
   - 409 → already exists → workflow falls through to `PATCH /api/blogs/{slug}` (idempotent re-runs work)
5. Site: `POST /api/blogs/{slug}/reindex` — fires Google Indexing API + IndexNow pings
6. Responds to caller

---

## Doc → JSON Helper

Write a draft in Google Docs using this structure (just type these as normal paragraphs):

```
Heading 1: Your Article Title
META: One-line SEO meta description (155 chars).
CATEGORY: Investment
IMAGE: https://your-image-url.jpg
READTIME: 8 min read

--- CONTENT ---
<p>Article body in HTML.</p>
<h2>Sections work as headings or just raw HTML.</h2>

--- FAQS ---
Q: Question one?
A: Answer one.
Q: Question two?
A: Answer two.
```

Then convert with one curl call:

```bash
curl -X POST https://palmbaylotsland.app.n8n.cloud/webhook/doc-to-json \
  -H "Content-Type: application/json" \
  -d '{
    "docUrl": "https://docs.google.com/document/d/YOUR_DOC_ID/edit",
    "slug": "real-estate-investing-palm-bay-florida-2026"
  }'
```

Response:
```json
{
  "ok": true,
  "slug": "real-estate-investing-palm-bay-florida-2026",
  "filename": "real-estate-investing-palm-bay-florida-2026.json",
  "fileId": "1AbC...",
  "next": "Trigger /webhook/publish-blog with this slug to publish."
}
```

You can also send `docId` instead of `docUrl` if you already have it. Review the resulting JSON in Drive (the parser is intentionally conservative — Google Docs HTML export is messy), tweak if needed, then trigger publish.

---

## Test Plan (do this after redeploy)

```bash
SLUG=real-estate-investing-palm-bay-florida-2026

# 1. Drop a real {slug}.json in the Drive folder
# 2. Trigger:
curl -X POST https://palmbaylotsland.app.n8n.cloud/webhook/publish-blog \
  -H "Content-Type: application/json" \
  -d "{\"slug\":\"$SLUG\"}"

# 3. Verify it's live:
curl https://palmbaylots-land.com/api/blogs/$SLUG | python -m json.tool
open https://palmbaylots-land.com/blog/$SLUG

# 4. Cleanup if it was just a test:
curl -X DELETE https://palmbaylots-land.com/api/blogs/$SLUG \
  -H "Authorization: Bearer M-quMx2zP7boDfUQ5jahRdSPJYciiAv4a2-Kt5FC60I"
```

---

## What I Verified On Preview (preview env, before deploy)

```
POST /api/blogs            → 201 ✅  (publishedAt, url, indexingPing=queued)
POST /api/blogs/{slug}/reindex → 200 ✅  (indexingPing=queued)
DELETE /api/blogs/{slug}   → 200 ✅
GET /MquMx2zP7boDfUQ5jahRdSPJYciiAv4a.txt → 200 ✅  (IndexNow key file)
```

IndexNow pings currently return 202 ✅. Google Indexing API returns 403 until you add `indexing-bot@project-5fb5af62-52c5-4cbb-a8e.iam.gserviceaccount.com` as a Property Owner in Search Console for `palmbaylots-land.com`.

---

## What I Can't Verify

The actual n8n webhook URLs (`palmbaylotsland.app.n8n.cloud/webhook/...`) require importing & activating the workflows in your n8n cloud workspace — I don't have access to that account. The HTTP request, Code, and Drive node configurations are exactly what n8n's import expects (validated as JSON, node typeVersions match current stable n8n 1.x).
