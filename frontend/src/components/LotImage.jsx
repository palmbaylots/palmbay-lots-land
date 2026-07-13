import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Module-level cache so a lot's resolved image survives re-renders, filtering,
// and favorite toggles without re-hitting the network.
const _imgCache = {};

const esriExport = (lat, lon, d, w, h) =>
  `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export` +
  `?bbox=${lon - d},${lat - d},${lon + d},${lat + d}` +
  `&bboxSR=4326&imageSR=4326&size=${w},${h}&format=jpg&f=image`;

// Resolve a satellite image for a lot, in order of reliability:
//   1) county parcel center (exact lot)  2) geocoded street address  3) none.
// Returns { url, exact } or null. Cached per lot.
async function resolveLotImage(item, w, h) {
  const key = item.id || item.inventoryId || `${item.unit}-${item.block}-${item.lot}`;
  if (_imgCache[key] !== undefined) return _imgCache[key];

  const acct = String(item.taxAccount || '').replace(/\D/g, '');
  // 1) County parcel center — exact lot, tight zoom.
  if (acct) {
    try {
      const { data } = await axios.get(`${API}/parcel/${acct}`);
      if (data && data.found && Array.isArray(data.center)) {
        const [lat, lon] = data.center;
        const res = { url: esriExport(lat, lon, 0.0006, w, h), exact: true };
        _imgCache[key] = res;
        return res;
      }
    } catch (e) { /* fall through to geocode */ }
  }

  // 2) Geocode the street address — most lots the county has no parcel for.
  const addr = [item.streetNumber, item.streetName, item.city || 'Palm Bay, FL']
    .filter(Boolean).join(', ').trim();
  const hasStreet = item.streetName && String(item.streetNumber || '').trim() && String(item.streetNumber).trim() !== '0';
  if (hasStreet) {
    try {
      const { data } = await axios.get(
        'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates',
        { params: { SingleLine: addr, maxLocations: 1, outFields: 'Match_addr', f: 'json' } }
      );
      const c = data && data.candidates && data.candidates[0];
      if (c && c.location && c.score >= 80) {
        const res = { url: esriExport(c.location.y, c.location.x, 0.0009, w, h), exact: false };
        _imgCache[key] = res;
        return res;
      }
    } catch (e) { /* fall through to placeholder */ }
  }

  _imgCache[key] = null;
  return null;
}

// Lazy satellite image for a lot. Loads only when scrolled near the viewport.
// `size` is the rendered CSS box; `px` is the pixel dimensions requested from Esri.
const LotImage = ({ item, className = '', onClick, px = [400, 300] }) => {
  const ref = useRef(null);
  const [img, setImg] = useState(() => {
    const key = item.id || item.inventoryId;
    return key && _imgCache[key] !== undefined ? _imgCache[key] : undefined;
  });

  useEffect(() => {
    if (img !== undefined) return; // already resolved (or cached)
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      resolveLotImage(item, px[0], px[1]).then((res) => {
        if (!cancelled) setImg(res);
      });
    }, { rootMargin: '300px' });
    obs.observe(el);
    return () => { cancelled = true; obs.disconnect(); };
  }, [item, img, px]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative bg-slate-100 overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {img
        ? <img src={img.url} alt={`Satellite view of ${item.streetName || 'lot'}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-slate-300" />
          </div>
        )}
    </div>
  );
};

export default LotImage;
