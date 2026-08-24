import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import LotPriceModal from '../components/LotPriceModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const PALM_BAY_CENTER = [28.017, -80.62];

// Load Leaflet + MarkerCluster from CDN once, on demand (kept out of the bundle,
// same approach as ParcelMapModal so we reuse the already-allowed CDN host).
function loadScript(id, src) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded) return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.id = id; s.src = src;
    s.onload = () => { s.dataset.loaded = '1'; resolve(); };
    s.onerror = reject;
    document.body.appendChild(s);
  });
}
function loadCss(id, href) {
  if (document.getElementById(id)) return;
  const l = document.createElement('link');
  l.id = id; l.rel = 'stylesheet'; l.href = href;
  document.head.appendChild(l);
}
async function loadMapLibs() {
  loadCss('leaflet-css', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
  loadCss('mcluster-css', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css');
  loadCss('mcluster-css2', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css');
  if (!window.L) await loadScript('leaflet-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js');
  if (!window.L.markerClusterGroup) await loadScript('mcluster-js', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js');
  return window.L;
}

// Marker colors by land-use category — chosen far apart on the color wheel so
// no two read alike on satellite imagery.
const CAT_COLORS = {
  residential: '#facc15',   // bright yellow
  commercial: '#dc2626',    // red
  industrial: '#9333ea',    // purple
  multifamily: '#f97316',   // bright orange
  openspace: '#22c55e',     // green — parks / open space
  institutional: '#2563eb', // blue
};
const CAT_LABELS = {
  residential: 'Residential', commercial: 'Commercial', industrial: 'Industrial',
  multifamily: 'Multi-family', openspace: 'Open space / Park', institutional: 'Institutional',
};

// Decide the land-use category. FLU (future land use) is the authority — many
// letter-block tracts are single-family ZONED but their FLU is the real use
// (park, open space, institutional, etc.). Fall back to zoning only for uses
// that show up there but not in FLU.
function categoryOf(lot) {
  const f = String(lot.flu || '').toUpperCase();
  const z = String(lot.zoning || '').toUpperCase();
  if (/INDUSTRIAL/.test(f)) return 'industrial';
  if (/COMMERC|RETAIL|OFFICE|MIXED\s*USE/.test(f)) return 'commercial';
  if (/MULTI|HIGH\s*DENSITY|\bRM\b/.test(f)) return 'multifamily';
  if (/PARK|OPEN\s*SPACE|CONSERV|RECREAT|GREEN\s*SPACE/.test(f)) return 'openspace';
  if (/INSTITUTION|PUBLIC|GOVERNMENT|SCHOOL|CHURCH|CIVIC/.test(f)) return 'institutional';
  // FLU is residential/blank — check zoning only for the non-residential uses.
  if (/\bIU\b|\bHI\b|INDUSTRIAL/.test(z)) return 'industrial';
  if (/\bNC\b|\bCC\b|\bHC\b|\bGC\b|COMMERC/.test(z)) return 'commercial';
  if (/\bRM-?\d|MULTI/.test(z)) return 'multifamily';
  if (/INSTITUTION|PUBLIC/.test(z)) return 'institutional';
  return 'residential';
}

// Letter block => acreage / large tract => star; numbered block => platted lot => circle.
const isTract = (lot) => /[a-zA-Z]/.test(String(lot.block || '').trim());

const InventoryMap = () => {
  const mapDiv = useRef(null);
  const mapObj = useRef(null);
  const tileRef = useRef(null);
  const clusterRef = useRef(null);
  const roRef = useRef(null);
  const plottedIds = useRef(new Set());
  const lotsById = useRef({});       // id -> lot data, for reopening a lot's card
  const openLotRef = useRef(null);   // latest openLot fn (called from Leaflet marker clicks)
  const wantLotRef = useRef(null);   // ?lot= id to auto-open once lots load
  const openedWantRef = useRef(false); // guard so we auto-open the ?lot only once
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(null);
  const [err, setErr] = useState(false);
  const [priceLot, setPriceLot] = useState(null); // lot whose price/financing modal is open
  const [fullscreen, setFullscreen] = useState(false); // expand map to fill the screen
  const [showUnitMap, setShowUnitMap] = useState(false); // Palm Bay unit map lightbox
  const [searchParams, setSearchParams] = useSearchParams();

  // Open a lot's card AND put ?lot=<id> in the URL, so the browser Back button
  // (from the lot's detail page) reopens the same card. Close clears the param.
  const openLot = (lot) => {
    setPriceLot(lot);
    setSearchParams({ lot: lot.id }, { replace: true });
  };
  const closeLot = () => {
    setPriceLot(null);
    setSearchParams({}, { replace: true });
  };
  openLotRef.current = openLot;
  wantLotRef.current = searchParams.get('lot');

  // When toggling full screen, re-measure AFTER the browser has painted the new
  // layout. Timeouts fired too early (Leaflet still measured the old size → tiles
  // rendered at width 0). A double requestAnimationFrame runs post-paint; the
  // ResizeObserver set up on the map container (below) is the primary safeguard.
  useEffect(() => {
    const m = mapObj.current;
    if (!m) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        m.invalidateSize(false);
        m.setView(m.getCenter(), m.getZoom(), { animate: false });
        if (tileRef.current) tileRef.current.redraw();
      });
    });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [fullscreen]);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    (async () => {
      let L;
      try {
        L = await loadMapLibs();
      } catch (e) { setErr(true); return; }
      if (cancelled || !mapDiv.current || mapObj.current) return;

      // fadeAnimation:false keeps tiles visible immediately — the tile fade can
      // leave tiles stuck invisible (black) after a resize if a load event is missed.
      const map = L.map(mapDiv.current, { scrollWheelZoom: true, fadeAnimation: false }).setView(PALM_BAY_CENTER, 12);
      mapObj.current = map;
      tileRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 21, attribution: 'Imagery &copy; Esri' }
      ).addTo(map);
      const cluster = L.markerClusterGroup({ maxClusterRadius: 45, chunkedLoading: true });
      clusterRef.current = cluster;
      map.addLayer(cluster);

      // Primary fix for the full-screen black background: re-measure the map
      // whenever its container ACTUALLY changes size (entering/exiting full
      // screen). This catches the real layout change that timeout-based
      // invalidateSize() missed, so the tiles fill the new canvas.
      if (typeof ResizeObserver !== 'undefined' && mapDiv.current) {
        const ro = new ResizeObserver(() => {
          map.invalidateSize(false);
          if (tileRef.current) tileRef.current.redraw();
        });
        ro.observe(mapDiv.current);
        roRef.current = ro;
      }

      // Circle for platted lots, star for acreage tracts (letter block); colored by
      // land use. className:'leaflet-clean' + injected CSS kills Leaflet's default
      // white icon box so only our shape shows.
      const STAR = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';
      if (!document.getElementById('map-icon-css')) {
        const st = document.createElement('style');
        st.id = 'map-icon-css';
        // .leaflet-clean removes the default white icon box.
        // The max-width:none rule defeats Tailwind Preflight's `img{max-width:100%}`,
        // which otherwise collapses Leaflet tiles to width 0 in the full-screen
        // container (tall black slivers). This — not invalidateSize timing — was
        // the real cause of the black full-screen map.
        st.textContent = '.leaflet-clean{background:transparent;border:0;}'
          + '.leaflet-tile,.leaflet-container img{max-width:none !important;max-height:none !important;}';
        document.head.appendChild(st);
      }
      const makeIcon = (lot) => {
        const color = CAT_COLORS[categoryOf(lot)] || CAT_COLORS.residential;
        if (isTract(lot)) {
          return L.divIcon({
            className: 'leaflet-clean',
            html: `<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 1px 1px rgba(0,0,0,.5))"><path d="${STAR}" fill="${color}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
            iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14],
          });
        }
        return L.divIcon({
          className: 'leaflet-clean',
          html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.4)"></div>`,
          iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -8],
        });
      };

      const fetchBatch = async () => {
        if (cancelled) return;
        try {
          const { data } = await axios.get(`${API}/properties/map`);
          if (cancelled) return;
          const fresh = [];
          (data.lots || []).forEach((lot) => {
            lotsById.current[lot.id] = lot;
            if (plottedIds.current.has(lot.id)) return;
            plottedIds.current.add(lot.id);
            const m = L.marker([lot.lat, lot.lon], { icon: makeIcon(lot) });
            m.on('click', () => openLotRef.current && openLotRef.current(lot)); // open price + financing card
            fresh.push(m);
          });
          if (fresh.length) cluster.addLayers(fresh);
          setCount(plottedIds.current.size);
          setPending(data.pending || 0);

          // If we arrived with ?lot=<id> (e.g. Back from that lot's detail page),
          // reopen its card and pan to it once its data has loaded.
          const want = wantLotRef.current;
          if (want && !openedWantRef.current && lotsById.current[want]) {
            openedWantRef.current = true;
            const lot = lotsById.current[want];
            map.setView([lot.lat, lot.lon], 15, { animate: false });
            if (openLotRef.current) openLotRef.current(lot);
          }

          if (data.pending > 0) timer = setTimeout(fetchBatch, 1800);
        } catch (e) { setErr(true); }
      };
      fetchBatch();
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
      if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; }
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Palm Bay Land Inventory Map | Vahid Rajabian, Broker</title>
        <meta name="description" content="Interactive map of Palm Bay, FL lots for sale. Click any lot for price and links to Google Maps and the Brevard County (BCPAO) parcel map and records. Owner financing available." />
        <link rel="canonical" href="https://palmbaylots-land.com/map" />
      </Helmet>

      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <MapPin className="w-7 h-7 text-amber-500" /> Palm Bay Inventory Map
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Click any lot for its price, owner-financing options (30% / 40% down, monthly payment), and links to Google Maps and the BCPAO parcel map &amp; record.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="mb-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-slate-700 font-medium">{count} lot{count === 1 ? '' : 's'} on map</span>
            {pending > 0 && <span className="text-slate-400">Loading more… ({pending} left)</span>}
            {err && <span className="text-red-600">Map data temporarily unavailable — please refresh.</span>}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-slate-600">
            <span className="inline-flex items-center gap-1.5"><span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-slate-300" style={{ background: '#94a3b8' }} /> Circle = platted lot</span>
            <span className="inline-flex items-center gap-1.5"><span style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1 }}>★</span> Star = acreage tract (letter block)</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-slate-600">
            {Object.keys(CAT_LABELS).map((k) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: CAT_COLORS[k] }} /> {CAT_LABELS[k]}
              </span>
            ))}
          </div>
        </div>

        <div className={fullscreen ? 'fixed inset-0 z-[60] bg-slate-800' : 'relative'}>
          <div
            ref={mapDiv}
            style={fullscreen ? { height: '100vh', width: '100%' } : { height: '70vh', minHeight: 420, width: '100%' }}
            className={fullscreen ? '' : 'rounded-xl overflow-hidden border border-slate-200 shadow-sm'}
          />
          <button
            onClick={() => setFullscreen((f) => !f)}
            className="absolute top-3 right-3 z-[1000] px-3 py-2 bg-white/95 hover:bg-white text-slate-800 rounded-lg shadow-md font-semibold text-sm border border-slate-200"
          >
            {fullscreen ? '✕ Exit full screen' : '⤢ Full screen'}
          </button>
        </div>

        {/* Palm Bay unit map — helps place a lot within the city */}
        <div className="mt-4 flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <button onClick={() => setShowUnitMap(true)} className="shrink-0" aria-label="Open the Palm Bay unit map">
            <img
              src="/images/palm-bay-unit-map.jpg"
              alt="Palm Bay unit map thumbnail"
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-amber-300 hover:opacity-90 transition"
            />
          </button>
          <div>
            <p className="font-bold text-slate-900">View the Palm Bay Unit Map</p>
            <p className="text-sm text-slate-600 mt-0.5">
              See which unit each lot is in — for a better understanding of where a lot sits in the city.
            </p>
            <button onClick={() => setShowUnitMap(true)} className="mt-1.5 inline-block text-amber-700 font-semibold underline text-sm">
              Open the full unit map →
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Link to="/inventory" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold">
            Browse the full lot list
          </Link>
          <a href="tel:3213337230" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold">
            <Phone className="w-4 h-4" /> Call Vahid — 321-333-7230
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Lot locations are approximate, derived from Brevard County parcel data and address geocoding. Verify boundaries independently before purchase.
          Vahid Rajabian, Broker Associate | M. David Moallem, Inc. | License #BK3454072.
        </p>
      </div>

      {priceLot && <LotPriceModal item={priceLot} onClose={closeLot} />}

      {showUnitMap && (
        <div className="fixed inset-0 bg-black/85 z-[85] flex items-center justify-center p-4" onClick={() => setShowUnitMap(false)}>
          <img
            src="/images/palm-bay-unit-map.jpg"
            alt="Palm Bay unit map — full size"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={() => setShowUnitMap(false)} aria-label="Close unit map"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 text-2xl leading-none flex items-center justify-center shadow">×</button>
        </div>
      )}
    </>
  );
};

export default InventoryMap;
