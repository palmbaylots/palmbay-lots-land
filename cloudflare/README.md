# SEO Worker — deploy once

1. Deploy the backend (Emergent pull + re-publish) so `/api/seo/page` and the new `/api/sitemap.xml` are live.
   Check: https://palmbaylots-land.com/api/seo/page?path=/blog  → JSON with a title.
2. Cloudflare dashboard → Workers & Pages → Create → Worker → name `palmbay-seo` → paste `seo-worker.js` → Deploy.
3. Worker → Settings → Domains & Routes → Add route: `palmbaylots-land.com/*` (zone palmbaylots-land.com).
4. Verify:
   - `curl -s https://palmbaylots-land.com/blog/emerald-lakes-palm-bay-2026-update | grep -o "<title>.*</title>"` → the blog's own title
   - `curl -sI https://palmbaylots-land.com/zz-made-up-page-123` → `404`
   - `curl -s https://palmbaylots-land.com/sitemap.xml | grep -c "<url>"` → ~600+
5. Rollback: delete the route. The site goes back to exactly how it was.
