import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Phone } from 'lucide-react';

/**
 * Featured Special Listing — 1039 Hooper Ave NE Palm Bay FL 32905
 * "Build-Ready Lot in Established NE Palm Bay"
 *
 * Brand colors:
 *  - navy   #1a3a5c
 *  - orange #d97706
 *  - light  #7eb8e8
 */

const FEATURES = [
  { icon: '💧', label: 'City Water Available' },
  { icon: '🚿', label: 'City Sewer Available' },
  { icon: '✅', label: 'Cleared & Filled' },
  { icon: '📐', label: 'Survey Completed' },
  { icon: '🏠', label: 'House Plans Included' },
  { icon: '⚡', label: 'Underground Utilities' },
  { icon: '🚶', label: 'Sidewalks & Curbs' },
  { icon: '📍', label: 'Near Melbourne & Jobs' },
];

const itemPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'Build-Ready Residential Lot — 1039 Hooper Ave NE Palm Bay FL 32905',
  description:
    'Cleared, filled, surveyed residential lot with city water and sewer in NE Palm Bay. Underground utilities, sidewalks, house plans included. Owner financing available.',
  url: 'https://palmbaylots-land.com',
  telephone: '321-333-7230',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1039 Hooper Ave NE',
    addressLocality: 'Palm Bay',
    addressRegion: 'FL',
    postalCode: '32905',
    addressCountry: 'US',
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'USD',
    priceSpecification: { '@type': 'PriceSpecification', description: 'Contact for current pricing — owner financing available' },
  },
};

const FeaturedSpecialListing = () => {
  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: '#0f1e2e' }}
      data-testid="featured-special-listing"
      aria-labelledby="featured-special-heading"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(itemPageSchema)}</script>
      </Helmet>

      <div className="container mx-auto max-w-6xl">
        {/* Section header with decorative orange lines */}
        <div className="flex items-center justify-center gap-4 mb-8" id="featured-special-heading">
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
          <p className="text-sm md:text-base font-bold tracking-[0.2em]" style={{ color: '#d97706' }}>
            ★ FEATURED SPECIAL LISTING
          </p>
          <span className="hidden sm:block h-px w-16 md:w-24" style={{ backgroundColor: '#d97706' }} />
        </div>

        {/* Card */}
        <article
          className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_20px_60px_-10px_rgba(217,119,6,0.4)] hover:-translate-y-1"
          style={{ backgroundColor: '#1a3a5c', border: '1px solid rgba(217,119,6,0.3)' }}
        >
          {/* Top-left ribbon "Special Buy" */}
          <div
            className="absolute top-0 left-0 z-10 px-5 py-2 text-sm font-bold tracking-wider"
            style={{ backgroundColor: '#d97706', color: '#1a3a5c', clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}
            data-testid="badge-special-buy"
          >
            ★ Special Buy
          </div>

          {/* Top-right RARE animated badge */}
          <div
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'rgba(15, 30, 46, 0.9)', border: '1px solid #22c55e', color: '#fff' }}
            data-testid="badge-rare"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            RARE · City Water &amp; Sewer
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT — content */}
            <div className="p-8 md:p-10 pt-16 md:pt-14 flex flex-col">
              {/* Location */}
              <p className="text-sm font-medium mb-3 flex items-center gap-1.5" style={{ color: '#7eb8e8' }}>
                <span aria-hidden>📍</span>
                <span>1039 Hooper Ave NE · Palm Bay, FL 32905</span>
              </p>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                Build-Ready Lot in{' '}
                <span style={{ color: '#d97706' }}>Established NE Palm Bay</span>
              </h2>

              {/* Description */}
              <p className="text-slate-300 leading-relaxed mb-6 text-[15px]">
                One of Palm Bay&apos;s rarest finds — a{' '}
                <strong className="text-white">cleared, filled, and surveyed residential lot</strong>{' '}
                with <strong className="text-white">city water AND city sewer</strong> already available.
                Underground utilities. Sidewalks. Established neighborhood close to Melbourne and Space
                Coast employers. House plans included if the buyer wants to use them. This is the lot you
                build on — not the lot you wait on.
              </p>

              {/* 8 feature boxes in a 2-column grid */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {FEATURES.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ backgroundColor: 'rgba(126, 184, 232, 0.08)', border: '1px solid rgba(126, 184, 232, 0.15)' }}
                  >
                    <span className="text-base flex-shrink-0" aria-hidden>{f.icon}</span>
                    <span className="text-slate-200 font-medium">{f.label}</span>
                  </li>
                ))}
              </ul>

              {/* Price row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-lg font-semibold text-white">Contact for Current Pricing</span>
                <span
                  className="px-3 py-1 text-xs font-bold tracking-wider rounded-full"
                  style={{ border: '1px solid #d97706', color: '#d97706' }}
                  data-testid="tag-owner-financing"
                >
                  OWNER FINANCING AVAILABLE
                </span>
              </div>

              {/* CTA */}
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-bold text-white transition-all hover:opacity-90 w-full sm:w-fit"
                style={{ backgroundColor: '#d97706' }}
                data-testid="featured-cta-view-details"
              >
                View Full Details
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* RIGHT — stacked images + map links */}
            <div className="flex flex-col gap-3 p-4 md:p-6 lg:p-4 lg:pt-14">
              {/* Top: Aerial / satellite view (clickable - opens full image) */}
              <a
                href="/images/1039-hooper-aerial.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden block aspect-[4/3] transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: '#21456a', border: '1px solid rgba(126, 184, 232, 0.2)' }}
                data-testid="featured-aerial-view-link"
                aria-label="Open aerial satellite view of 1039 Hooper Ave NE in a new tab"
              >
                <img
                  src="/images/1039-hooper-aerial.jpg"
                  alt="Aerial satellite view of 1039 Hooper Ave NE Palm Bay FL 32905 — vacant residential lot outlined in red between Hooper Ave NE and Tree Ridge Ln NE"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase shadow"
                  style={{ backgroundColor: '#d97706', color: '#1a3a5c' }}
                >
                  Aerial View
                </span>
                <span
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-[11px] font-bold rounded-full"
                  style={{ backgroundColor: 'rgba(15,30,46,0.9)', color: '#fff' }}
                >
                  Click to enlarge ⤢
                </span>
              </a>

              {/* Bottom: Parcel / survey map (clickable - opens full image) */}
              <a
                href="/images/1039-hooper-parcel.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-xl overflow-hidden block aspect-[4/3] transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: '#fff', border: '1px solid rgba(126, 184, 232, 0.2)' }}
                data-testid="featured-parcel-map-link"
                aria-label="Open parcel survey map of 1039 Hooper Ave NE in a new tab"
              >
                <img
                  src="/images/1039-hooper-parcel.jpg"
                  alt="Parcel survey map for 1039 Hooper Ave NE — Port Malabar Country Club Unit 8, lot dimensions 125 ft x 81.1 ft x 125 ft x 80.53 ft"
                  className="w-full h-full object-contain bg-white"
                  loading="lazy"
                  decoding="async"
                />
                <span
                  className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold tracking-wider rounded uppercase shadow"
                  style={{ backgroundColor: '#d97706', color: '#1a3a5c' }}
                >
                  Parcel Map
                </span>
                <span
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-[11px] font-bold rounded-full"
                  style={{ backgroundColor: 'rgba(15,30,46,0.9)', color: '#fff' }}
                >
                  Click to enlarge ⤢
                </span>
              </a>

              {/* Map links — Street View + Google Maps */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <a
                  href="https://www.bcpao.us/map/?r=2836768"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-bold text-white transition-colors"
                  style={{ backgroundColor: '#21456a', border: '1px solid rgba(126,184,232,0.3)' }}
                  data-testid="featured-bcpao-map-link"
                >
                  <span aria-hidden>🏛️</span>
                  <span>Property Appraiser Map</span>
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1039+Hooper+Ave+NE,+Palm+Bay,+FL+32905"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-bold text-white transition-colors"
                  style={{ backgroundColor: '#21456a', border: '1px solid rgba(126,184,232,0.3)' }}
                  data-testid="featured-google-maps-link"
                >
                  <span aria-hidden>🌍</span>
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Footer strip */}
        <div
          className="mt-3 rounded-xl px-6 py-4 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0 text-sm md:divide-x md:divide-white/15"
          style={{ backgroundColor: '#0f1e2e', border: '1px solid rgba(126,184,232,0.15)' }}
        >
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>📍</span>
            <span><span className="font-bold text-white">NE Palm Bay</span> · Zip 32905</span>
          </div>
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>🏗️</span>
            <span>Zoned <span className="font-bold text-white">RS-1</span> · Single Family</span>
          </div>
          <div className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200">
            <span aria-hidden>💧</span>
            <span><span className="font-bold text-white">City Water &amp; Sewer</span> · Ready to Build</span>
          </div>
          <a
            href="tel:3213337230"
            className="text-center md:px-4 flex items-center justify-center gap-2 text-slate-200 hover:text-amber-400 transition-colors"
            data-testid="featured-footer-phone"
          >
            <Phone className="w-4 h-4" />
            <span className="font-bold">321-333-7230</span>
          </a>
        </div>

        {/* Hidden SEO keyword block — readable by AI/Google crawlers but visually subtle */}
        <p className="sr-only">
          city water and sewer lot Palm Bay Florida · build ready lot Palm Bay FL · cleared filled
          surveyed lot Palm Bay · residential lot NE Palm Bay 32905 · lot with city utilities Palm Bay
          Florida · ready to build lot near Melbourne FL · owner financing lot city water Palm Bay ·
          rare city sewer lot Brevard County · NE Palm Bay lot for sale · 1039 Hooper Ave NE Palm Bay ·
          buildable lot Palm Bay city utilities · residential lot near Space Coast employers
        </p>
      </div>
    </section>
  );
};

export default FeaturedSpecialListing;
