import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight, HelpCircle, MapPin, Droplets, Waves, Landmark, Hammer } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LotImage from '../../components/LotImage';
import { lotDetailSlug } from '../../components/LotCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PAGE_URL = 'https://palmbaylots-land.com/palm-bay-land-for-sale';
const PAGE_TITLE = 'Land for Sale in Palm Bay, FL | 500+ Lots | Owner Financing';
// Keep in sync with backend/routes/seo.py STATIC_PAGES["/palm-bay-land-for-sale"].
// COMPLIANCE: no finance trigger terms here (no %, rate, payment or term).
const PAGE_DESCRIPTION = 'See 500+ lots for sale in Palm Bay, FL, each with its price, map and utilities. Residential lots from $41,000. Owner financing available, call for terms.';

const LOT_IMAGE_PX = [480, 320];

// The four areas of Palm Bay. Each card opens the inventory already filtered to that area.
const AREAS = [
  {
    code: 'NE',
    name: 'Northeast Palm Bay',
    text: 'Closest to Melbourne and I-95. Many lots here have city water and sewer.',
  },
  {
    code: 'NW',
    name: 'Northwest Palm Bay',
    text: 'A mix of city-water lots and lots that use a well and septic system.',
  },
  {
    code: 'SE',
    name: 'Southeast Palm Bay',
    text: 'An active area for new home construction.',
  },
  {
    code: 'SW',
    name: 'Southwest Palm Bay',
    text: 'Usually the lowest prices. Most lots here use a well and septic system.',
  },
];

// One list feeds both the visible FAQ and the FAQ schema, so they always match.
// COMPLIANCE: never "guaranteed buildable"; no finance trigger terms; no promises about future value.
const FAQS = [
  {
    q: 'How much does land cost in Palm Bay, Florida?',
    a: 'Residential lots in our inventory start at $41,000. The price depends on the location, the lot size and the utilities. Lots with city water and sewer cost more than lots that need a well and septic system. Every lot in our inventory shows its current price.',
    link: { to: '/inventory', label: 'See current prices' },
  },
  {
    q: 'Can I buy land in Palm Bay with owner financing?',
    a: 'Yes. Owner financing is available on most of our residential lots, with no bank involved and a personal approval. Call 321-333-7230 for terms.',
    link: { to: '/owner-financing-land-florida', label: 'How our owner financing works' },
  },
  {
    q: 'Are the lots buildable?',
    a: 'Our residential lots are zoned for single-family homes, and we check zoning and utilities on each lot before we list it. If a lot turns out to have an issue, our lot exchange guarantee lets you exchange it within the same year you purchased it for another lot of the same price and size category, unless otherwise noted in the contract.',
    link: { to: '/guide/build-on-land-palm-bay', label: 'How to build on a lot in Palm Bay' },
  },
  {
    q: 'Do the lots have city water and sewer?',
    a: 'It depends on the unit. Some lots have city water and sewer. Some have city water only and need a septic system. Others need a well and a septic system. The inventory groups lots by utility type, and we can confirm the utilities for any lot before you buy.',
    link: { to: '/guide/septic-vs-sewer-palm-bay', label: 'Septic vs sewer in Palm Bay' },
  },
  {
    q: 'Is the lot in a flood zone?',
    a: 'Most residential lots in Palm Bay are in FEMA Flood Zone X, which is minimal flood risk. Some lots near canals, ponds and wetlands are in higher-risk zones. Ask us and we will look up the flood zone for any lot before you buy.',
    link: { to: '/guide/flood-zones-palm-bay', label: 'Palm Bay flood zone map' },
  },
  {
    q: 'What size are the lots?',
    a: 'Most are about a quarter acre (roughly 10,000 square feet), the standard size for a single-family home in Palm Bay. Larger lots and tracts are also available.',
    link: { to: '/quarter-acre-lots-palm-bay', label: 'Quarter acre lots in Palm Bay' },
  },
  {
    q: 'Is there an HOA?',
    a: 'No. Our residential lots do not have HOA fees.',
  },
  {
    q: 'Can I see a lot before I buy?',
    a: 'Yes. Every lot has a map and satellite view online, and you can visit any lot in person. Call us and we will give you the exact location or meet you there.',
  },
];

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Real Estate Land Sales',
  name: 'Land for Sale in Palm Bay, Florida',
  description: PAGE_DESCRIPTION,
  url: PAGE_URL,
  areaServed: {
    '@type': 'City',
    name: 'Palm Bay',
    containedInPlace: { '@type': 'State', name: 'Florida' },
  },
  provider: {
    '@type': 'RealEstateAgent',
    name: 'Vahid Reza Rajabian',
    telephone: '+1-321-333-7230',
    email: 'vahid@palmbayland.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palm Bay',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const textLink = 'text-amber-700 font-semibold underline hover:text-amber-800';

const PalmBayLandForSale = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API}/properties`);
        const list = Array.isArray(response.data) ? response.data : [];
        // Only lots a buyer can act on: available, with a real price and a street address.
        const available = list.filter((p) =>
          !p.sold &&
          (p.status || 'available') === 'available' &&
          /^\$\d/.test(String(p.price || '')) &&
          String(p.streetName || '').trim()
        );
        if (!cancelled) setProperties(available.slice(0, 8));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProperties();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Land for Sale in <span className="text-amber-400">Palm Bay, FL</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                500+ residential lots for sale across Palm Bay, on Florida's Space Coast. Every lot shows its price, map and utilities. Lots start at $41,000. Owner financing available, call for terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/inventory"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                  data-testid="landforsale-hero-inventory"
                >
                  See Available Lots
                </Link>
                <a
                  href="tel:3213337230"
                  className="px-8 py-4 bg-white text-slate-900 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors"
                >
                  Call 321-333-7230
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="bg-amber-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm">Lots Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">$41K</p>
                <p className="text-sm">Starting Price</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">2003</p>
                <p className="text-sm">Selling Palm Bay Land Since</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0%</p>
                <p className="text-sm">State Income Tax</p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by area */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Browse Palm Bay Land by Area
              </h2>
              <p className="text-lg text-slate-700 mb-8">
                Palm Bay is split into four areas. Malabar Road divides north from south, and Minton Road divides east from west. Pick an area to see the lots for sale there.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {AREAS.map((area) => (
                  <Link
                    key={area.code}
                    to={`/inventory?quadrant=${area.code}`}
                    className="block bg-slate-50 p-6 rounded-xl border-2 border-slate-200 hover:border-amber-600 hover:shadow-md transition-all"
                    data-testid={`landforsale-area-${area.code}`}
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-amber-700" aria-hidden="true" />
                      {area.name} ({area.code})
                    </h3>
                    <p className="text-slate-700 mb-3">{area.text}</p>
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                      See {area.code} lots for sale
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>

              <p className="text-slate-700">
                Looking for commercial, industrial or multifamily land instead?{' '}
                <Link to="/listings" className={textLink}>See commercial and investment land</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* Lots for sale now */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Palm Bay Lots for Sale Right Now
              </h2>
              <p className="text-lg text-slate-700">
                A few of the lots in our inventory. Open any lot for its map, utilities and details.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12" role="status" aria-label="Loading lots">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((prop) => {
                  const address = [prop.streetNumber, prop.streetName].filter(Boolean).join(' ').trim() || prop.title;
                  // acres comes as "0.23" or "0.23 AC" — only add the unit when it is missing.
                  const acres = String(prop.acres || '').trim();
                  const acresLabel = acres && !/[a-z]/i.test(acres) ? `${acres} ac` : acres;
                  return (
                    <Link
                      key={prop.id}
                      to={`/property/${lotDetailSlug(prop)}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <LotImage item={prop} className="w-full h-40" px={LOT_IMAGE_PX} />
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1">{address}</h3>
                        <p className="text-sm text-slate-600 mb-2">{prop.city || 'Palm Bay, FL'}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-700">{prop.price}</span>
                          {acresLabel && <span className="text-sm text-slate-600">{acresLabel}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-slate-700">
                See every available lot, with prices, in the <Link to="/inventory" className={textLink}>lot inventory</Link>.
              </p>
            )}

            <div className="text-center mt-10">
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                data-testid="landforsale-all-lots"
              >
                See All Available Lots
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* What to check */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What to Check Before You Buy Land in Palm Bay
              </h2>
              <p className="text-lg text-slate-700 mb-8">
                Two lots on the same street can be very different. These four things decide what a lot is worth and what it takes to build on it. We will tell you all four for any lot before you buy.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                  <Droplets className="w-8 h-8 text-blue-700 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Utilities</h3>
                    <p className="text-slate-700">
                      Some lots have city water and sewer. Some have city water only. Others need a well and a septic system. It depends on the unit.{' '}
                      <Link to="/guide/septic-vs-sewer-palm-bay" className={textLink}>Septic vs sewer in Palm Bay</Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                  <Waves className="w-8 h-8 text-cyan-700 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Flood Zone</h3>
                    <p className="text-slate-700">
                      Most Palm Bay lots are in FEMA Zone X (minimal risk), but not all. Always check the exact lot.{' '}
                      <Link to="/guide/flood-zones-palm-bay" className={textLink}>Palm Bay flood zone map</Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                  <Landmark className="w-8 h-8 text-slate-700 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Zoning</h3>
                    <p className="text-slate-700">
                      Zoning decides what you are allowed to build. Most of our lots are zoned for single-family homes.{' '}
                      <Link to="/blog/palm-bay-zoning-explained" className={textLink}>Palm Bay zoning explained</Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl">
                  <Hammer className="w-8 h-8 text-amber-700 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Building</h3>
                    <p className="text-slate-700">
                      Permits, site work and the steps from an empty lot to a finished home.{' '}
                      <Link to="/guide/build-on-land-palm-bay" className={textLink}>How to build on a lot in Palm Bay</Link>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-lg mt-8">
                <p className="text-slate-800">
                  <strong>Lot exchange guarantee:</strong> if a lot has an issue, you can exchange it within the same year you purchased it for another lot of the same price and size category, unless otherwise noted in the contract.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Palm Bay */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Buy Land in Palm Bay, Florida?
              </h2>

              <p className="text-lg text-slate-700 mb-4">
                Palm Bay is in Brevard County on Florida's Space Coast, about an hour east of Orlando and roughly halfway between Miami and Jacksonville. Florida has no state income tax.
              </p>
              <p className="text-lg text-slate-700 mb-4">
                Palm Bay was ranked the #13 most affordable city in America for 2026, and it was the only Florida city in the top 20 (source: The Palm Bayer).{' '}
                <Link to="/blog/palm-bay-13-most-affordable-city-2026" className={textLink}>Read about the ranking</Link>
              </p>
              <p className="text-lg text-slate-700 mb-8">
                Nobody can promise what land will be worth later, and we won't. What we can show you is what is being built around these lots:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/blog/emerald-lakes-palm-bay-2026-update" className="block p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">Emerald Lakes</h3>
                  <p className="text-slate-700 mb-3">A 1,561-acre master-planned community at the I-95 and St. Johns Heritage Parkway interchange.</p>
                  <span className="text-amber-700 font-semibold">Emerald Lakes update</span>
                </Link>
                <Link to="/blog/malabar-road-widening-palm-bay-2026" className="block p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">Malabar Road Widening</h3>
                  <p className="text-slate-700 mb-3">Planned widening from 2 to 4 lanes between the St. Johns Heritage Parkway and Minton Road. It is in the design phase.</p>
                  <span className="text-amber-700 font-semibold">Malabar Road widening</span>
                </Link>
                <Link to="/blog/ashton-park-palm-bay-what-it-means-for-land-buyers" className="block p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">Ashton Park</h3>
                  <p className="text-slate-700 mb-3">A planned 1,568-acre community off Micco Road with 5,500+ homes planned.</p>
                  <span className="text-amber-700 font-semibold">Ashton Park for land buyers</span>
                </Link>
              </div>
              <p className="text-sm text-slate-600 mt-4">Sources for each project are listed in the linked article.</p>
            </div>
          </div>
        </section>

        {/* How buying works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                How Buying a Lot Works
              </h2>
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center" aria-hidden="true">1</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Pick a lot</h3>
                    <p className="text-slate-700">
                      Browse the <Link to="/inventory" className={textLink}>lot inventory</Link> or the <Link to="/map" className={textLink}>lot map</Link>. Save the ones you like.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center" aria-hidden="true">2</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Call Vahid</h3>
                    <p className="text-slate-700">
                      He confirms the utilities, zoning and flood zone for that lot and answers your questions. Straight answers, no pressure.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center" aria-hidden="true">3</span>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Buy with cash or owner financing</h3>
                    <p className="text-slate-700">
                      Owner financing is available on most residential lots, with no bank and a personal approval. Call for terms.{' '}
                      <Link to="/owner-financing-land-florida" className={textLink}>How our owner financing works</Link>
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                Questions About Land for Sale in Palm Bay
              </h2>

              <div className="space-y-6">
                {FAQS.map((faq) => (
                  <div key={faq.q} className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {faq.q}
                    </h3>
                    <p className="text-slate-700">
                      {faq.a}
                      {faq.link && (
                        <>
                          {' '}
                          <Link to={faq.link.to} className={textLink}>{faq.link.label}</Link>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* More options */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">More Palm Bay Land Options</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/owner-financing-land-florida" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-600">No bank needed</p>
                </Link>
                <Link to="/quarter-acre-lots-palm-bay" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Quarter Acre Lots</p>
                  <p className="text-sm text-slate-600">The standard home lot</p>
                </Link>
                <Link to="/buildable-lots-palm-bay" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Buildable Lots</p>
                  <p className="text-sm text-slate-600">Lot exchange guarantee</p>
                </Link>
                <Link to="/price-guide" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Price Guide</p>
                  <p className="text-sm text-slate-600">Pricing by unit and area</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Look at Lots?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Vahid Rajabian has sold land in Palm Bay since 2003. M. David Moallem, Inc. has been in Palm Bay and Brevard County since 1983.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:3213337230"
                className="px-10 py-5 bg-amber-600 text-white rounded-lg text-xl font-bold hover:bg-amber-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-6 h-6" aria-hidden="true" />
                Call 321-333-7230
              </a>
              <Link
                to="/inventory"
                className="px-10 py-5 bg-white text-slate-900 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                See Available Lots
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-8">
              Vahid Rajabian, Broker Associate | M. David Moallem, Inc. | License #BK3454072
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default PalmBayLandForSale;
