/* eslint-disable */
/**
 * Build-time SEO prerender (runs after `craco build`).
 *
 * Why: the site is a React app, so every URL sends the same blank page with the
 * homepage title. Bing, ChatGPT, Perplexity and Google's first pass see nothing.
 * The Cloudflare-worker plan can't be used (DNS is at Namecheap; the Cloudflare
 * in front of the site belongs to Emergent).
 *
 * What it does: for every URL in the sitemap, it asks the live backend
 * /api/seo/page?path=... for that page's title, description, canonical, schema
 * and text, and writes build/<path>/index.html (the normal app + that info).
 * The host already serves /x from build/x/index.html with 200 and no redirect
 * (checked live with /n8n on 2026-11-11). React's createRoot replaces the text
 * when the app loads, and react-helmet-async replaces the data-rh tags.
 *
 * Safety rules:
 *  - NEVER fails the build: every error is caught and the script exits 0.
 *  - Never touches build/index.html (that file is the fallback for all other
 *    URLs; changing it would give every page the homepage canonical).
 *  - Never overwrites a file that already exists in build/.
 *  - Only writes pages the backend says are status 200 with a title and text.
 *    Skips 301 / 404 / app-only routes.
 *  - Only simple paths (a-z 0-9 - _ /). No "..".
 *  - Hard time limit; whatever is not done in time is simply skipped.
 *  - Set SEO_PRERENDER=off to switch it off.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const ORIGIN = (process.env.SEO_PRERENDER_ORIGIN || "https://palmbaylots-land.com").replace(/\/$/, "");
const BUILD = path.resolve(__dirname, "..", "build");
const CONCURRENCY = 8;
const REQ_TIMEOUT_MS = 10000;
const TOTAL_BUDGET_MS = 240000;
const STAMP = new Date().toISOString().slice(0, 10);
const started = Date.now();
const log = (...a) => console.log("[seo-prerender]", ...a);

function get(url) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    try {
      const lib = url.startsWith("https:") ? https : http;
      const req = lib.get(url, { headers: { "User-Agent": "seo-prerender-build", Accept: "*/*" } }, (res) => {
        if (res.statusCode !== 200) { res.resume(); return finish(null); }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => { body += c; if (body.length > 5e6) { req.destroy(); finish(null); } });
        res.on("end", () => finish(body));
        res.on("error", () => finish(null));
      });
      req.setTimeout(REQ_TIMEOUT_MS, () => { req.destroy(); finish(null); });
      req.on("error", () => finish(null));
    } catch (e) { finish(null); }
  });
}

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function pathsFromSitemap(xml) {
  const out = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml || ""))) {
    try {
      const u = new URL(m[1]);
      if (!/(^|\.)palmbaylots-land\.com$/.test(u.hostname)) continue;
      out.push(decodeURIComponent(u.pathname).replace(/\/+$/, "") || "/");
    } catch (e) {}
  }
  return out;
}

const SAFE = /^\/[a-z0-9][a-z0-9\-_/]*$/i;

// Set the content="" of an existing tag, or add a new one; mark it data-rh so Helmet replaces it.
function setTag(html, matcher, newTag) {
  if (matcher.test(html)) return html.replace(matcher, newTag);
  return html.replace(/<\/head>/i, newTag + "</head>");
}

function render(shell, seo) {
  let h = shell;
  const t = esc(seo.title), d = esc(seo.description), c = esc(seo.canonical);
  h = h.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  h = setTag(h, /<meta\b[^>]*\bname="description"[^>]*>/i, `<meta data-rh="true" name="description" content="${d}"/>`);
  h = setTag(h, /<meta\b[^>]*\bproperty="og:url"[^>]*>/i, `<meta data-rh="true" property="og:url" content="${c}"/>`);
  h = setTag(h, /<meta\b[^>]*\bproperty="og:title"[^>]*>/i, `<meta data-rh="true" property="og:title" content="${t}"/>`);
  h = setTag(h, /<meta\b[^>]*\bproperty="og:description"[^>]*>/i, `<meta data-rh="true" property="og:description" content="${d}"/>`);
  h = setTag(h, /<meta\b[^>]*\b(?:name|property)="twitter:title"[^>]*>/i, `<meta data-rh="true" property="twitter:title" content="${t}"/>`);
  h = setTag(h, /<meta\b[^>]*\b(?:name|property)="twitter:description"[^>]*>/i, `<meta data-rh="true" property="twitter:description" content="${d}"/>`);
  h = h.replace(/<link\b[^>]*\brel="canonical"[^>]*>/gi, "");
  const extra =
    `<link data-rh="true" rel="canonical" href="${c}"/>` +
    (seo.robots ? `<meta data-rh="true" name="robots" content="${esc(seo.robots)}"/>` : "") +
    `<meta name="x-seo-prerender" content="${STAMP}"/>` +
    `<style>#seo-prerender{max-width:960px;margin:0 auto;padding:16px;font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#1e293b}#seo-prerender nav ul{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:12px}#seo-prerender a{color:#b45309}</style>` +
    (Array.isArray(seo.jsonld) ? seo.jsonld : [])
      .map((j) => `<script data-rh="true" type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`)
      .join("");
  h = h.replace(/<\/head>/i, extra + "</head>");
  const before = h;
  h = h.replace(/<div id="root"><\/div>/i, `<div id="root">${seo.html}</div>`);
  if (h === before) return null; // shell not as expected: skip, never guess
  return h;
}

async function main() {
  if (String(process.env.SEO_PRERENDER || "").toLowerCase() === "off") return log("off (SEO_PRERENDER=off)");
  const indexFile = path.join(BUILD, "index.html");
  if (!fs.existsSync(indexFile)) return log("no build/index.html, skipping");
  const shell = fs.readFileSync(indexFile, "utf8");
  if (!/<div id="root"><\/div>/i.test(shell)) return log("build/index.html has no empty #root, skipping");

  // Fresh sitemap from the database (fixes the stale static sitemap too).
  const apiXml = await get(`${ORIGIN}/api/sitemap.xml`);
  const apiPaths = pathsFromSitemap(apiXml);
  if (apiXml && apiPaths.length >= 100 && /<urlset/i.test(apiXml)) {
    fs.writeFileSync(path.join(BUILD, "sitemap.xml"), apiXml);
    log(`sitemap.xml refreshed from /api/sitemap.xml (${apiPaths.length} URLs)`);
  } else {
    log("could not refresh sitemap.xml, keeping the static one");
  }
  let staticXml = "";
  try { staticXml = fs.readFileSync(path.join(BUILD, "sitemap.xml"), "utf8"); } catch (e) {}

  const paths = [...new Set([...apiPaths, ...pathsFromSitemap(staticXml)])]
    .filter((p) => p !== "/" && SAFE.test(p) && !p.includes(".."));
  log(`${paths.length} paths to try`);

  let ok = 0, skipped = 0, i = 0;
  async function worker() {
    while (i < paths.length) {
      if (Date.now() - started > TOTAL_BUDGET_MS) { skipped += 1; i += 1; continue; }
      const p = paths[i++];
      try {
        const dir = path.join(BUILD, p);
        const file = path.join(dir, "index.html");
        if (!file.startsWith(BUILD + path.sep) || fs.existsSync(file) || fs.existsSync(dir + ".html")) { skipped++; continue; }
        const body = await get(`${ORIGIN}/api/seo/page?path=${encodeURIComponent(p)}`);
        let seo = null;
        try { seo = body ? JSON.parse(body) : null; } catch (e) {}
        if (!seo || seo.status !== 200 || !seo.title || !seo.html || !seo.canonical) { skipped++; continue; }
        const out = render(shell, seo);
        if (!out) { skipped++; continue; }
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(file, out);
        ok++;
      } catch (e) { skipped++; }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  log(`done: ${ok} pages prerendered, ${skipped} skipped, ${Math.round((Date.now() - started) / 1000)}s`);
}

main().catch((e) => log("error (ignored):", e && e.message)).finally(() => process.exit(0));
