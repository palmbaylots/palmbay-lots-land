/**
 * Removes duplicate SEO tags from <head>.
 *
 * Why: this app runs React 19 with react-helmet-async v3. In that setup the tags a
 * page puts in <Helmet> are added to <head> as NEW tags; nothing removes the tags
 * that were already in the HTML file (the fallbacks in public/index.html and the
 * per-page tags written by scripts/prerender.js). Without this, Google sees two
 * <title> tags, two descriptions, two og:url tags and two canonicals on every page.
 *
 * What it does: remembers the tags that came with the HTML file. Whenever the page
 * adds its own tag of the same kind (same <title>, same meta name/property, a
 * canonical link, or JSON-LD of the same @type), the one from the HTML file is
 * removed. A tag from the HTML file stays for as long as the page has no
 * replacement for it, so nothing is ever left without a title or description.
 *
 * It only ever removes tags that were in the HTML file. It never touches a tag
 * React added.
 */

const HEAD_SELECTOR = 'title, meta[name], meta[property], link[rel="canonical"]';
const LD_SELECTOR = 'script[type="application/ld+json"]';

function keyOf(el) {
  if (el.tagName === "TITLE") return "title";
  if (el.tagName === "META") {
    const k = el.getAttribute("name") || el.getAttribute("property");
    return k ? `meta:${k.toLowerCase()}` : null;
  }
  if (el.tagName === "LINK") return "canonical";
  return null;
}

function ldTypes(el) {
  try {
    const data = JSON.parse(el.textContent || "");
    return []
      .concat(data)
      .flatMap((item) => [].concat((item && item["@type"]) || []))
      .map(String);
  } catch (e) {
    return [];
  }
}

export function installSeoHeadCleanup() {
  if (typeof document === "undefined" || typeof MutationObserver === "undefined") return;
  const head = document.head;
  if (!head) return;

  // Tags that came with the HTML file (before React rendered anything).
  let fromFile = Array.from(head.querySelectorAll(HEAD_SELECTOR)).filter(keyOf);
  // Only the prerender script's JSON-LD (marked data-rh) is a candidate; the
  // site-wide business schema in index.html has no page-level replacement.
  let ldFromFile = Array.from(document.querySelectorAll(`${LD_SELECTOR}[data-rh]`));
  if (!fromFile.length && !ldFromFile.length) return;
  const original = new Set([...fromFile, ...ldFromFile]);

  let observer = null;
  const run = () => {
    try {
      const added = new Set();
      head.querySelectorAll(HEAD_SELECTOR).forEach((el) => {
        if (original.has(el)) return;
        const k = keyOf(el);
        if (k) added.add(k);
      });
      fromFile = fromFile.filter((el) => {
        if (!el.isConnected) return false;
        if (added.has(keyOf(el))) {
          el.remove();
          return false;
        }
        return true;
      });

      if (ldFromFile.length) {
        const addedTypes = new Set();
        document.querySelectorAll(LD_SELECTOR).forEach((el) => {
          if (!original.has(el)) ldTypes(el).forEach((t) => addedTypes.add(t));
        });
        ldFromFile = ldFromFile.filter((el) => {
          if (!el.isConnected) return false;
          const types = ldTypes(el);
          if (types.length && types.every((t) => addedTypes.has(t))) {
            el.remove();
            return false;
          }
          return true;
        });
      }

      if (observer && !fromFile.length && !ldFromFile.length) observer.disconnect();
    } catch (e) {
      // Never let SEO cleanup break the app.
    }
  };

  observer = new MutationObserver(run);
  observer.observe(head, { childList: true });
}
