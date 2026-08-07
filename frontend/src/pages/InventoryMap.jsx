import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';

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

const slugify = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Build the clickable property card shown inside a marker popup.
function popupHtml(lot) {
  const heading = lot.address || `Unit ${lot.unit || '—'} · Block ${lot.block || '—'} · Lot ${lot.lot || '—'}`;
  const priceRaw = String(lot.price || '').trim();
  const price = priceRaw ? (priceRaw.startsWith('$') ? priceRaw : `$${priceRaw}`) : 'Call for price';
  const acct = lot.taxAccount;
  const g = `https://www.google.com/maps/search/?api=1&query=${lot.lat},${lot.lon}`;
  const slug = slugify(lot.title) || acct || lot.id;

  const btn = (href, label, bg) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:6px 10px;margin:3px 4px 0 0;background:${bg};color:#fff;border-radius:7px;font-size:12px;font-weight:600;text-decoration:none;">${label}</a>`;

  return `
    <div style="min-width:210px;max-width:260px;font-family:inherit;">
      ${lot.cashSpecial ? '<div style="display:inline-block;background:#16a34a;color:#fff;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;margin-bottom:4px;">CASH SPECIAL</div>' : ''}
      <div style="font-weight:700;color:#0f172a;font-size:14px;line-height:1.2;">${esc(heading)}</div>
      <div style="color:#64748b;font-size:11px;margin-top:1px;">${esc(lot.city || 'Palm Bay, FL')}${lot.acres ? ' · ' + esc(lot.acres) : ''}</div>
      <div style="font-weight:800;color:#d97706;font-size:17px;margin-top:5px;">${esc(price)}</div>
      <div style="margin-top:6px;">
        ${btn(g, 'Google Map', '#2563eb')}
        ${acct ? btn(`https://www.bcpao.us/map/?r=${acct}`, 'BCPAO Map', '#d97706') : ''}
        ${acct ? btn(`https://www.bcpao.us/PropertySearch/#/account/${acct}`, 'BCPAO Detail', '#334155') : ''}
      </div>
      <div style="margin-top:7px;border-top:1px solid #e2e8f0;padding-top:7px;">
        <a href="/property/${slug}" style="display:inline-block;font-size:12px;font-weight:600;color:#b45309;text-decoration:underline;">View full lot details →</a>
        <a href="tel:3213337230" style="display:block;margin-top:6px;text-align:center;padding:7px;background:#16a34a;color:#fff;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">Call 321-333-7230</a>
      </div>
    </div>`;
}

const InventoryMap = () => {
  const mapDiv = useRef(null);
  const mapObj = useRef(null);
  const clusterRef = useRef(null);
  const plottedIds = useRef(new Set());
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timer = null;

    (async () => {
      let L;
      try {
        L = await loadMapLibs();
      } catch (e) { setErr(true); return; }
      if (cancelled || !mapDiv.current || mapObj.current) return;

      const map = L.map(mapDiv.current, { scrollWheelZoom: true }).setView(PALM_BAY_CENTER, 12);
      mapObj.current = map;
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 21, attribution: 'Imagery &copy; Esri' }
      ).addTo(map);
      const cluster = L.markerClusterGroup({ maxClusterRadius: 45, chunkedLoading: true });
      clusterRef.current = cluster;
      map.addLayer(cluster);

      const dot = (color) => L.divIcon({
        className: '',
        html: `<div style="width:15px;height:15px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.35)"></div>`,
        iconSize: [15, 15], iconAnchor: [8, 8], popupAnchor: [0, -8],
      });

      const fetchBatch = async () => {
        if (cancelled) return;
        try {
          const { data } = await axios.get(`${API}/properties/map`);
          if (cancelled) return;
          const fresh = [];
          (data.lots || []).forEach((lot) => {
            if (plottedIds.current.has(lot.id)) return;
            plottedIds.current.add(lot.id);
            const m = L.marker([lot.lat, lot.lon], { icon: dot(lot.cashSpecial ? '#16a34a' : '#d97706') });
            m.bindPopup(popupHtml(lot), { maxWidth: 280 });
            fresh.push(m);
          });
          if (fresh.length) cluster.addLayers(fresh);
          setCount(plottedIds.current.size);
          setPending(data.pending || 0);
          if (data.pending > 0) timer = setTimeout(fetchBatch, 1800);
        } catch (e) { setErr(true); }
      };
      fetchBatch();
    })();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
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
            Click any lot for its price and links to Google Maps, the BCPAO parcel map, and the county property record.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-700 font-medium">{count} lot{count === 1 ? '' : 's'} on map</span>
            <span className="inline-flex items-center gap-1 text-slate-500"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#d97706' }} /> Available</span>
            <span className="inline-flex items-center gap-1 text-slate-500"><span className="inline-block w-3 h-3 rounded-full" style={{ background: '#16a34a' }} /> Cash Special</span>
          </div>
          {pending > 0 && <span className="text-slate-400">Loading more lots… ({pending} left)</span>}
          {err && <span className="text-red-600">Map data temporarily unavailable — please refresh.</span>}
        </div>

        <div ref={mapDiv} style={{ height: '70vh', minHeight: 420, width: '100%' }} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" />

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
    </>
  );
};

export default InventoryMap;
