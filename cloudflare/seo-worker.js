/**
 * palmbaylots-land.com — SEO pre-render Worker (Cloudflare)
 *
 * Problem it fixes: the React app sends the SAME blank 11KB page for every URL
 * (homepage title, no description, no canonical, no text, always 200 OK).
 * Google ranks it poorly; Bing / ChatGPT / Perplexity barely see anything.
 *
 * What it does, for every page request:
 *   1. Gets the normal page from the origin (Emergent).
 *   2. Asks the backend  /api/seo/page?path=...  for that page's real title,
 *      description, canonical, structured data, and text.
 *   3. Injects them into the HTML and sets the right status (200 / 301 / 404).
 *   /sitemap.xml is served from the live, auto-built /api/sitemap.xml.
 *
 * Fail-safe: if the backend call fails for any reason, the original page is
 * returned untouched, so the site can never go down because of this Worker.
 *
 * Route: palmbaylots-land.com/*
 */

const SKIP_EXT = /\.(js|css|map|png|jpe?g|gif|webp|svg|ico|txt|json|xml|csv|woff2?|ttf|pdf|mp4|webm)$/i;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") return fetch(request);

    // Always-fresh sitemap built from the database (every blog + every lot).
    if (url.pathname === "/sitemap.xml") {
      const r = await fetch(`${url.origin}/api/sitemap.xml`, { headers: { "User-Agent": "seo-worker" } });
      if (r.ok) {
        return new Response(r.body, {
          status: 200,
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      }
      return fetch(request);
    }

    if (url.pathname.startsWith("/api/") || SKIP_EXT.test(url.pathname)) return fetch(request);

    const [originRes, seo] = await Promise.all([
      fetch(request),
      fetch(`${url.origin}/api/seo/page?path=${encodeURIComponent(url.pathname)}`, {
        headers: { "User-Agent": "seo-worker" },
        cf: { cacheTtl: 300, cacheEverything: true },
      })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);

    const type = originRes.headers.get("content-type") || "";
    if (!seo || !type.includes("text/html")) return originRes;

    if (seo.status === 301 && seo.redirect) return Response.redirect(seo.redirect, 301);

    // Real app route we don't pre-render (admin, MLS detail, etc.)
    if (!seo.title && seo.status === 200) return originRes;

    const esc = (s) =>
      String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    // data-rh="true" lets react-helmet-async replace these tags after the app loads (no duplicates).
    const head =
      `<style>#seo-prerender{max-width:960px;margin:0 auto;padding:16px;font-family:system-ui,sans-serif;line-height:1.5}</style>` +
      `<meta data-rh="true" name="description" content="${esc(seo.description)}"/>` +
      `<link data-rh="true" rel="canonical" href="${esc(seo.canonical)}"/>` +
      (seo.robots ? `<meta data-rh="true" name="robots" content="${esc(seo.robots)}"/>` : "") +
      `<meta data-rh="true" property="og:title" content="${esc(seo.title)}"/>` +
      `<meta data-rh="true" property="og:description" content="${esc(seo.description)}"/>` +
      `<meta data-rh="true" property="og:url" content="${esc(seo.canonical)}"/>` +
      (seo.jsonld || [])
        .map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`)
        .join("");

    const rewritten = new HTMLRewriter()
      .on("title", { element: (el) => el.setInnerContent(seo.title) })
      .on("head", { element: (el) => el.append(head, { html: true }) })
      .on("div#root", { element: (el) => el.setInnerContent(seo.html || "", { html: true }) })
      .transform(originRes);

    const headers = new Headers(rewritten.headers);
    headers.delete("content-length");
    headers.set("X-SEO-Prerender", "1");
    if (seo.status === 404) headers.set("X-Robots-Tag", "noindex");
    return new Response(rewritten.body, { status: seo.status || 200, headers });
  },
};
