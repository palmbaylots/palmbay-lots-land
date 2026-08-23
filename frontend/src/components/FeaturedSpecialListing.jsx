import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, X } from 'lucide-react';

/**
 * Featured Special Listing — 1039 Hooper Ave NE Palm Bay FL 32905
 * Static, curated card. "See Price" opens a property-card popup with the
 * cash price + owner-financing chart (30% option / 40% down) + detail links
 * + the two maps. Brand: navy #1a3a5c · orange #d97706 · light #7eb8e8.
 */

const PRICE = 89900;
const usd = (n) => `$${n.toLocaleString('en-US')}`;
const monthlyPayment = (financed) => Math.round((financed * 13.22) / 1000); // $13.22 / $1,000 · 10% · 120 mo

const down30 = Math.round(PRICE * 0.30), fin30 = PRICE - down30, mo30 = monthlyPayment(fin30);
const down40 = Math.round(PRICE * 0.40), fin40 = PRICE - down40, mo40 = monthlyPayment(fin40);

const AERIAL = '/images/1039-hooper-aerial.jpg';
const PARCEL = '/images/1039-hooper-parcel.jpg';
const BCPAO_MAP = 'https://www.bcpao.us/map/?r=2836768';
const BCPAO_DETAIL = 'https://www.bcpao.us/PropertySearch/#/account/2836768';
const GMAPS = 'https://www.google.com/maps/search/?api=1&query=1039+Hooper+Ave+NE,+Palm+Bay,+FL+32905';

const FEATURES = [
  '💧 City Water', '🚿 City Sewer', '✅ Cleared & Filled', '📐 Surveyed',
  '🏠 House Plans', '⚡ Underground Utilities', '🚶 Sidewalks', '📍 Near Melbourne',
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Build-Ready Residential Lot — 1039 Hooper Ave NE Palm Bay FL 32905',
  url: 'https://palmbaylots-land.com',
  telephone: '321-333-7230',
  address: { '@type': 'PostalAddress', streetAddress: '1039 Hooper Ave NE', addressLocality: 'Palm Bay', addressRegion: 'FL', postalCode: '32905', addressCountry: 'US' },
  offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'USD', price: PRICE },
};

const FeaturedSpecialListing = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-12 px-4" style={{ backgroundColor: '#0f1e2e' }} data-testid="featured-special-listing" aria-labelledby="featured-special-heading">
      <Helmet><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>

      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-4 mb-6" id="featured-special-heading">
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
          <p className="text-sm font-bold tracking-[0.2em]" style={{ color: '#d97706' }}>★ FEATURED SPECIAL LISTING</p>
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
        </div>

        {/* Wide, short card: content left, photos right */}
        <article className="relative rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2" style={{ backgroundColor: '#1a3a5c', border: '1px solid rgba(217,119,6,0.3)' }}>
          <div className="absolute top-0 left-0 z-10 px-4 py-1.5 text-xs font-bold tracking-wider" style={{ backgroundColor: '#d97706', color: '#1a3a5c', clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}>★ Special Buy</div>
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: 'rgba(15,30,46,0.9)', border: '1px solid #22c55e', color: '#fff' }}>
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span>
            RARE · Water &amp; Sewer
          </div>

          {/* LEFT — content */}
          <div className="p-6 md:p-8 pt-12 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">Build-Ready Lot in <span style={{ color: '#d97706' }}>NE Palm Bay</span></h2>
            <p className="text-2xl md:text-3xl font-extrabold mb-3" style={{ color: '#7eb8e8' }}>1039 Hooper Ave NE</p>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              One of Palm Bay&apos;s rarest finds — a <strong className="text-white">cleared, filled, surveyed</strong> lot with
              <strong className="text-white"> city water AND sewer</strong> already in. Underground utilities, sidewalks, house
              plans included. Build now, not later.
            </p>
            <ul className="flex flex-wrap gap-1.5 mb-5">
              {FEATURES.map((f) => (
                <li key={f} className="px-2.5 py-1 rounded-full text-[12px] text-slate-200 font-medium" style={{ backgroundColor: 'rgba(126,184,232,0.08)', border: '1px solid rgba(126,184,232,0.15)' }}>{f}</li>
              ))}
            </ul>
            <div>
              <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#d97706' }} data-testid="featured-cta-see-price">
                See Price &amp; Details
              </button>
            </div>
          </div>

          {/* RIGHT — two maps side by side, short band */}
          <div className="grid grid-cols-2 gap-2 p-3 lg:p-4 content-center">
            <a href={AERIAL} target="_blank" rel="noopener noreferrer" className="group relative rounded-lg overflow-hidden block aspect-[4/3]" style={{ backgroundColor: '#21456a' }} aria-label="Open aerial satellite view">
              <img src={AERIAL} alt="Aerial satellite view of 1039 Hooper Ave NE Palm Bay FL 32905, vacant residential lot outlined in red" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded uppercase" style={{ backgroundColor: '#d97706', color: '#1a3a5c' }}>Aerial</span>
            </a>
            <a href={PARCEL} target="_blank" rel="noopener noreferrer" className="group relative rounded-lg overflow-hidden block aspect-[4/3] bg-white" aria-label="Open parcel survey map">
              <img src={PARCEL} alt="Parcel survey map for 1039 Hooper Ave NE, Port Malabar Country Club Unit 8" className="w-full h-full object-contain bg-white" loading="lazy" decoding="async" />
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-wider rounded uppercase" style={{ backgroundColor: '#d97706', color: '#1a3a5c' }}>Parcel</span>
            </a>
          </div>
        </article>

        {/* Footer strip */}
        <div className="mt-3 rounded-xl px-5 py-3 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 text-[13px] md:divide-x md:divide-white/15" style={{ backgroundColor: '#0f1e2e', border: '1px solid rgba(126,184,232,0.15)' }}>
          <div className="text-center md:px-3 flex items-center justify-center gap-1.5 text-slate-200"><span aria-hidden>📍</span><span><b className="text-white">NE Palm Bay</b> · 32905</span></div>
          <div className="text-center md:px-3 flex items-center justify-center gap-1.5 text-slate-200"><span aria-hidden>🏗️</span><span>Zoned <b className="text-white">RS-1</b></span></div>
          <div className="text-center md:px-3 flex items-center justify-center gap-1.5 text-slate-200"><span aria-hidden>💧</span><span><b className="text-white">Water &amp; Sewer</b></span></div>
          <a href="tel:3213337230" className="text-center md:px-3 flex items-center justify-center gap-1.5 text-slate-200 hover:text-amber-400"><Phone className="w-4 h-4" /><b className="text-white">321-333-7230</b></a>
        </div>

        <p className="sr-only">city water and sewer lot Palm Bay Florida · build ready lot Palm Bay FL · 1039 Hooper Ave NE Palm Bay · owner financing lot Palm Bay · residential lot NE Palm Bay 32905</p>
      </div>

      {/* See Price & Details popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,30,46,0.85)' }} onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="1039 Hooper Ave NE price and details">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 text-white relative" style={{ backgroundColor: '#1a3a5c' }}>
              <button type="button" onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white" aria-label="Close"><X className="w-6 h-6" /></button>
              <p className="text-xs" style={{ color: '#7eb8e8' }}>Featured Lot · RS-1 · City Water &amp; Sewer</p>
              <h3 className="text-2xl font-bold mt-0.5">1039 Hooper Ave NE</h3>
              <p className="text-sm text-slate-300">Palm Bay, FL 32905 · Unit CC8 · Block 81 · Lot 1 · 0.23 ac</p>
            </div>

            <div className="p-6">
              {/* Two maps */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a href={AERIAL} target="_blank" rel="noopener noreferrer" className="rounded-lg overflow-hidden aspect-[4/3] block"><img src={AERIAL} alt="Aerial view of 1039 Hooper Ave NE" className="w-full h-full object-cover" /></a>
                <a href={PARCEL} target="_blank" rel="noopener noreferrer" className="rounded-lg overflow-hidden aspect-[4/3] block bg-white border border-slate-200"><img src={PARCEL} alt="Parcel survey map of 1039 Hooper Ave NE" className="w-full h-full object-contain" /></a>
              </div>

              {/* Cash price */}
              <div className="flex items-baseline justify-between border-b border-slate-200 pb-3 mb-3">
                <span className="text-slate-600 font-medium">Cash Price</span>
                <span className="text-3xl font-bold" style={{ color: '#1a3a5c' }}>{usd(PRICE)}</span>
              </div>

              {/* Owner financing chart */}
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Owner Financing Options</p>
              <div className="space-y-2.5">
                <div className="border border-slate-200 rounded-xl p-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900">30% Option Money</span>
                    <span className="text-slate-900 font-semibold text-sm">{usd(down30)} · finance {usd(fin30)}</span>
                  </div>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: '#d97706' }}>{usd(mo30)}<span className="text-sm font-medium text-slate-500">/mo · 120 months</span></p>
                  <p className="text-sm font-bold text-slate-900">10% interest rate · 12.33% Annual Percentage Rate (APR)</p>
                  <p className="text-xs text-slate-500">Option Contract — deed transfers once payments reach 40% of the price.</p>
                </div>
                <div className="border border-slate-200 rounded-xl p-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-slate-900">40% Down</span>
                    <span className="text-slate-900 font-semibold text-sm">{usd(down40)} · finance {usd(fin40)}</span>
                  </div>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: '#d97706' }}>{usd(mo40)}<span className="text-sm font-medium text-slate-500">/mo · 120 months</span></p>
                  <p className="text-sm font-bold text-slate-900">10% interest rate · 12.33% Annual Percentage Rate (APR)</p>
                  <p className="text-xs text-slate-500">Deed Transfer at closing.</p>
                </div>
              </div>

              <p className="text-[11px] leading-snug text-slate-500 mt-2.5">
                Financing example assumes the 10-point charge is financed (12.33% APR); if the points are paid at closing, the
                APR is 12.58%. Amortized up to 120 months at a 10% interest rate. No prepayment penalty, no balloon. Subject to
                credit approval. Example only, not an offer of credit. Terms subject to change.
              </p>

              {/* 3 detail links */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <a href={BCPAO_MAP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-center px-2 py-2.5 rounded-lg text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: '#21456a' }}>🏛️ Appraiser Map</a>
                <a href={BCPAO_DETAIL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-center px-2 py-2.5 rounded-lg text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: '#21456a' }}>📄 Property Detail</a>
                <a href={GMAPS} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-center px-2 py-2.5 rounded-lg text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: '#21456a' }}>🌍 Google Maps</a>
              </div>

              <a href="tel:3213337230" className="mt-4 flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg font-bold text-white hover:opacity-90" style={{ backgroundColor: '#d97706' }}><Phone className="w-4 h-4" /> Call Vahid — 321-333-7230</a>
              <p className="text-[11px] text-slate-500 mt-3 text-center">Vahid Rajabian, Broker Associate | M. David Moallem, Inc. | License #BK3454072</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedSpecialListing;
