import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

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

const ParcelMapModal = ({ item, onClose }) => {
  const mapDiv = useRef(null);
  const mapObj = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ok | none | error

  const label = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim()
    || `Unit ${item.unit} Block ${item.block} Lot ${item.lot}`;
  const acct = String(item.taxAccount || '').replace(/\D/g, '');

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900">{label}</h3>
            <p className="text-xs text-slate-500">Satellite view with parcel boundary</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="relative">
          <div ref={mapDiv} style={{ height: '440px', width: '100%' }} />
          {status !== 'ok' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/85 text-sm text-slate-600 pointer-events-none">
              {status === 'loading' && 'Loading map…'}
              {status === 'none' && 'Parcel outline not available for this lot — showing area.'}
              {status === 'error' && 'Map temporarily unavailable.'}
            </div>
          )}
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex flex-wrap gap-2">
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
        <p className="px-5 pb-3 text-[11px] text-slate-500">
          Boundary from Brevard County GIS · imagery &copy; Esri. Approximate — verify independently before purchase.
        </p>
      </div>
    </div>
  );
};

export default ParcelMapModal;
