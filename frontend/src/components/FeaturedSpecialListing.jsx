import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Phone, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import LotImage from './LotImage';
import ParcelMapModal from './ParcelMapModal';
import { lotHeading, dimsText } from './LotCard';

/**
 * Featured "Cash Special" — data-driven.
 * Reads the lot marked `featured` (and ideally `cashOnly`) in the admin, and
 * renders it with the same red-outline satellite (LotImage / ParcelMapModal)
 * and county map links used across the inventory. CASH ONLY — no financing.
 * Edit it in /admin exactly like any inventory lot (size, price, address).
 */

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Shown only if nothing is marked featured yet, so the homepage never goes blank.
const FALLBACK = {
  inventoryId: '1039-hooper',
  streetNumber: '1039',
  streetName: 'Hooper Ave NE',
  city: 'Palm Bay, FL 32905',
  unit: '8',
  block: '',
  lot: '',
  acres: '0.23 ac',
  width: 80,
  depth: 125,
  water: 'City Water',
  sewer: 'City Sewer',
  zoning: 'RS-1',
  flu: 'Residential',
  price: 79900,
  cashOnly: true,
  featured: true,
  taxAccount: '2836768',
  title: 'Build-Ready Lot in Established NE Palm Bay',
};

const usd = (n) => (typeof n === 'number' && n > 0 ? `$${n.toLocaleString('en-US')}` : 'Contact for Price');

const utilityText = (item) => {
  if (item.water || item.sewer) return [item.water, item.sewer].filter(Boolean).join(' · ');
  return 'See details';
};

const FeaturedSpecialListing = () => {
  const [item, setItem] = useState(FALLBACK);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${API}/properties/featured`);
        if (cancelled || !Array.isArray(data) || !data.length) return;
        const pick = data.find((p) => p.cashOnly) || data[0];
        if (pick) setItem(pick);
      } catch (e) {
        // keep the fallback lot
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const heading = lotHeading(item);
  const address = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim();
  const dims = dimsText(item);
  const acres = item.acres && String(item.acres).trim();
  const hasWS = Boolean(item.water && item.sewer);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: `${heading} — ${address || 'Palm Bay, FL'}`,
    url: 'https://palmbaylots-land.com',
    telephone: '321-333-7230',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      ...(typeof item.price === 'number' && item.price > 0 ? { price: item.price } : {}),
    },
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#0f1e2e' }} data-testid="featured-special-listing" aria-labelledby="featured-special-heading">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-8" id="featured-special-heading">
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
          <p className="text-sm md:text-base font-bold tracking-[0.2em]" style={{ color: '#d97706' }}>
            ★ FEATURED CASH SPECIAL
          </p>
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
        </div>

        <article className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#1a3a5c', border: '1px solid rgba(217,119,6,0.3)' }}>
          <div className="absolute top-0 left-0 z-10 px-5 py-2 text-sm font-bold tracking-wider" style={{ backgroundColor: '#d97706', color: '#1a3a5c', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}>
            ★ Cash Special
          </div>

          {hasWS && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(15, 30, 46, 0.9)', border: '1px solid #22c55e', color: '#fff' }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              RARE · City Water &amp; Sewer
            </div>
          )}

          {/* Content */}
          <div className="px-6 sm:px-10 pt-16 md:pt-14 pb-6 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">{heading}</h2>

            {address && (
              <p className="text-xl md:text-2xl font-semibold mb-4 flex items-center justify-center gap-2" style={{ color: '#7eb8e8' }}>
                <MapPin className="w-5 h-5" />
                <span>{address} · {item.city || 'Palm Bay, FL'}</span>
              </p>
            )}

            {/* Tags */}
            <ul className="flex flex-wrap justify-center gap-2 mb-5">
              <li className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-200" style={{ backgroundColor: 'rgba(126, 184, 232, 0.08)', border: '1px solid rgba(126, 184, 232, 0.15)' }}>💧 {utilityText(item)}</li>
              {acres && <li className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-200" style={{ backgroundColor: 'rgba(126, 184, 232, 0.08)', border: '1px solid rgba(126, 184, 232, 0.15)' }}>📐 {acres}{dims ? ` · ${dims}` : ''}</li>}
              <li className="px-3 py-1.5 rounded-full text-sm font-medium text-slate-200" style={{ backgroundColor: 'rgba(126, 184, 232, 0.08)', border: '1px solid rgba(126, 184, 232, 0.15)' }}>🏗️ Zoned {item.zoning || 'Residential'}</li>
            </ul>

            {/* Cash price */}
            <div className="flex flex-col items-center gap-1 mb-5">
              <span className="text-4xl font-bold text-white">{usd(item.price)}</span>
              <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full" style={{ border: '1px solid #d97706', color: '#d97706' }}>CASH — NO FINANCING</span>
            </div>

            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#d97706' }}
              data-testid="featured-cta-see-details"
            >
              See Map &amp; Property Details
            </button>
          </div>

          {/* Red-outline satellite preview — click opens the full parcel map */}
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="block w-full px-4 sm:px-6 pb-6 group"
            aria-label="Open satellite parcel map"
          >
            <div className="relative rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(126, 184, 232, 0.2)' }}>
              <LotImage item={item} className="w-full h-56 md:h-64" px={[900, 400]} />
              <span className="absolute bottom-3 right-3 px-3 py-1.5 text-[11px] font-bold rounded-full opacity-90 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(15,30,46,0.9)', color: '#fff' }}>
                View parcel map ⤢
              </span>
            </div>
          </button>
        </article>

        {/* Footer strip */}
        <div className="mt-3 rounded-xl px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0 text-sm md:divide-x md:divide-white/15" style={{ backgroundColor: '#0f1e2e', border: '1px solid rgba(126,184,232,0.15)' }}>
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>📍</span>
            <span><span className="font-bold text-white">{item.city || 'Palm Bay, FL'}</span></span>
          </div>
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>🏗️</span>
            <span>Zoned <span className="font-bold text-white">{item.zoning || 'Residential'}</span></span>
          </div>
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>💧</span>
            <span className="font-bold text-white">{utilityText(item)}</span>
          </div>
          <a href="tel:3213337230" className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200 hover:text-amber-400 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-bold">321-333-7230</span>
          </a>
        </div>
      </div>

      {showMap && <ParcelMapModal item={item} onClose={() => setShowMap(false)} />}
    </section>
  );
};

export default FeaturedSpecialListing;
