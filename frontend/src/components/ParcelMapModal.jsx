import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { X, Heart, Phone } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Load Leaflet from CDN once, on demand (keeps it out of the main bundle).
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L);
    if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(css);
    }
    const existing = document.getElementById('leaflet-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.L));
      return;
    }
    const s = document.createElement('script');
    s.id = 'leaflet-js';
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    s.onload = () => resolve(window.L);
    document.body.appendChild(s);
  });
}

const PALM_BAY_CENTER = [28.034, -80.588];

// Water/sewer inferred from the unit when the lot doesn't store it explicitly.
const UNIT_UTIL = {
  '5': 'ws', '7': 'ws', '8': 'ws', '9': 'ws', '38': 'ws',
  '10': 'wo', '11': 'wo', '12': 'wo', '16': 'wo', '21': 'wo', '28': 'wo',
  '31': 'wo', '42': 'wo', '44': 'wo', '46': 'wo', '48': 'wo', '50': 'wo',
};
const utilityText = (item) => {
  if (item.water || item.sewer) return [item.water, item.sewer].filter(Boolean).join(' · ');
  const u = UNIT_UTIL[String(item.unit || '').trim()];
  if (u === 'ws') return 'City Water · City Sewer';
  if (u === 'wo') return 'City Water · Septic';
  return 'Well · Septic';
};
// Standard platted-lot dimensions by acreage (matches the admin form defaults).
const ACRE_DIMS = { '0.23': '80 × 125 ft' };
const dimsText = (item) => {
  if (item.pieShape) return item.width && item.depth ? `Pie-shaped · approx ${item.width} × ${item.depth} ft` : 'Pie-shaped (irregular)';
  if (item.width && item.depth) return `${item.width} × ${item.depth} ft`;
  return ACRE_DIMS[String(item.acres || '').replace(/ac.*/i, '').trim()] || null;
};

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-900 font-medium text-right">{value}</span>
  </div>
);

const ParcelMapModal = ({ item, onClose, favorited, onToggleFav }) => {
  const mapDiv = useRef(null);
  const mapObj = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ok | none | error

  const label = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim()
    || `Unit ${item.unit} Block ${item.block} Lot ${item.lot}`;
  const acct = String(item.taxAccount || '').replace(/\D/g, '');
  const dims = dimsText(item);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const L = await loadLeaflet();
        if (cancelled || !mapDiv.current || mapObj.current) return;

        const map = L.map(mapDiv.current, { scrollWheelZoom: true }).setView(PALM_BAY_CENTER, 12);
        mapObj.current = map;
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 21, attribution: 'Imagery &copy; Esri' }
        ).addTo(map);

        if (!acct) { setStatus('none'); return; }

        const { data } = await axios.get(`${API}/parcel/${acct}`);
        if (cancelled) return;

        if (data.found && Array.isArray(data.ring) && data.ring.length) {
          const poly = L.polygon(data.ring, { color: '#ff2d2d', weight: 4, fill: false }).addTo(map);
          map.fitBounds(poly.getBounds().pad(0.6));
          setStatus('ok');
        } else {
          setStatus('none');
        }
      } catch (e) {
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; }
    };
  }, [item]);

  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{label}</h3>
            <p className="text-xs text-slate-500">{item.city || 'Palm Bay, FL'} · satellite view with parcel boundary</p>
          </div>
          <div className="flex items-center gap-1">
            {onToggleFav && (
              <button
                onClick={() => onToggleFav(item)}
                aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                title={favorited ? 'Saved' : 'Save to favorites'}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-red-600 text-red-600' : 'text-slate-500'}`} />
              </button>
            )}
            <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div ref={mapDiv} style={{ height: '320px', width: '100%' }} />
          {status !== 'ok' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/85 text-sm text-slate-600 pointer-events-none">
              {status === 'loading' && 'Loading map…'}
              {status === 'none' && 'Parcel outline not available for this lot — showing area.'}
              {status === 'error' && 'Map temporarily unavailable.'}
            </div>
          )}
        </div>

        <div className="px-5 py-3 text-sm">
          <Row label="Address" value={label} />
          <Row label="Unit · Block · Lot" value={`${item.unit || '—'} · ${item.block || '—'} · ${item.lot || '—'}`} />
          <Row label="Acreage" value={item.acres || '—'} />
          {dims && <Row label="Dimensions" value={dims} />}
          <Row label="Water · Sewer" value={utilityText(item)} />
          {item.zoning && <Row label="Zoning" value={item.zoning} />}
          {item.inventoryId && <Row label="Inventory ID" value={item.inventoryId} />}
          {acct && <Row label="Tax Account" value={acct} />}
        </div>

        <div className="px-5 pb-1 flex flex-wrap gap-2">
          {acct && (
            <a href={`https://www.bcpao.us/map/?r=${acct}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium">
              BCPAO Map
            </a>
          )}
          {acct && (
            <a href={`https://www.bcpao.us/PropertySearch/#/account/${acct}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-medium">
              Account Detail
            </a>
          )}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([item.streetNumber, item.streetName, item.city, 'FL'].filter(Boolean).join(', '))}`}
             target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">
            Google Map
          </a>
        </div>

        <div className="px-5 py-3 mt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <a href="tel:3213337230"
             className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">
            <Phone className="w-4 h-4" /> Call about this lot — 321-333-7230
          </a>
          <a href="/contact"
             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold">
            Request info
          </a>
        </div>

        <p className="px-5 pb-3 text-[11px] text-slate-500">
          Boundary from Brevard County GIS · imagery &copy; Esri. Approximate — verify independently before purchase.
        </p>
      </div>
    </div>
  );
};

export default ParcelMapModal;
