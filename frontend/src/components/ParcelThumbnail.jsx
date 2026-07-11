import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Small satellite thumbnail per lot. Loads lazily (only when scrolled into view)
// so 582 rows don't slow the page. Clicking it opens the full map popup.
const ParcelThumbnail = ({ item, onOpen }) => {
  const ref = useRef(null);
  const [imgUrl, setImgUrl] = useState('');
  const tried = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || tried.current) return;
      tried.current = true;
      obs.disconnect();
      const acct = String(item.taxAccount || '').replace(/\D/g, '');
      if (!acct) return;
      axios.get(`${API}/parcel/${acct}`).then(({ data }) => {
        if (data.found && Array.isArray(data.center)) {
          const [lat, lon] = data.center;
          const d = 0.0006;
          setImgUrl(
            `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export` +
            `?bbox=${lon - d},${lat - d},${lon + d},${lat + d}` +
            `&bboxSR=4326&imageSR=4326&size=120,90&format=jpg&f=image`
          );
        }
      }).catch(() => {});
    }, { rootMargin: '250px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [item]);

  return (
    <button
      ref={ref}
      onClick={() => onOpen(item)}
      title="Open lot map"
      data-testid={`thumb-${item.inventoryId}`}
      className="w-14 h-11 rounded-md overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-amber-500 transition cursor-pointer"
    >
      {imgUrl
        ? <img src={imgUrl} alt="Lot satellite thumbnail" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        : <MapPin className="w-4 h-4 text-slate-400" />}
    </button>
  );
};

export default ParcelThumbnail;
