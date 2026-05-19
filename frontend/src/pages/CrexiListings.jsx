import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Phone, CheckCircle, Ruler, Building2, Loader2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Fallback static data (used only if database is empty)
const fallbackListings = [
  { id: 32, title: "328 Malabar Rd", city: "Palm Bay, FL", price: "$1,575,000", acres: "1.75 AC", type: "Commercial", tags: ["Zoned Commercial", "Signalized Corner", "23K Traffic/Day"], valueStatement: "Prime redevelopment site with 475 ft frontage, existing income, utilities ready. Ideal for QSR, medical, retail, or mixed-use.", image: "https://images.crexi.com/assets/1154695/ae46c0ccf60e4fb58b52ed52e99ebacd_716x444.jpg", flagship: true, flagshipUrl: "/listing/328-malabar-rd" },
  { id: 15, title: "6950 Babcock Street SE", city: "Palm Bay, FL", price: "$4,950,000", acres: "18 AC", type: "Commercial", tags: ["Zoned Commercial", "Large Tract", "High Visibility"], valueStatement: "Major development opportunity on Babcock corridor. Suitable for commercial, multifamily, or mixed-use master plan.", image: "https://images.crexi.com/assets/1519634/20f1c7a72e3d4123ac8b8c3eae075407_716x444.jpg" },
  { id: 30, title: "451 Thor Ave SE", city: "Palm Bay, FL", price: "$328,500", acres: "0.73 AC", type: "Multi-Family", tags: ["MF-20 Zoned", "Corner Lot", "14 Units"], valueStatement: "Multi-family zoned corner site. Approved for 14+ units. Strong rental demand area.", image: "https://images.crexi.com/assets/1170560/60d181304b9f441cbc8a60f59f01ffdc_716x444.jpg" },
  { id: 36, title: "Multiple Scattered Lots", city: "Palm Bay, FL", price: "$41,000+", acres: "700+ Lots", type: "Assemblage", tags: ["Bulk Available", "Builder Inventory", "Volume Pricing"], valueStatement: "700+ SFR lots available. Ideal for production builders or investors.", image: "https://images.crexi.com/assets/887500/83f1a143c87b4311b4121382e0bec4eb_716x444.jpg" },
  { id: 1, title: "2418 Fleming Avenue SW", city: "Palm Bay, FL", price: "$60,000", acres: "10,019 SF", type: "Residential", tags: ["City Water", "Buildable", "SF Home Site"], valueStatement: "Ready-to-build single family lot with city water. No HOA.", image: "https://images.crexi.com/assets/1658353/99c521fefb5c4f2990049f3f366577ea_716x444.jpg" },
];

// Category definitions - Reordered: Commercial first, All Listings last
const categories = [
  { id: 'Commercial', label: 'Commercial & Industrial', color: 'bg-blue-600' },
  { id: 'Multi-Family', label: 'Multifamily & RM-Zoned', color: 'bg-purple-600' },
  { id: 'Assemblage', label: 'Bulk & Assemblages', color: 'bg-red-600' },
  { id: 'Residential', label: 'Investment Residential Lots', color: 'bg-amber-600' },
  { id: 'all', label: 'All Listings', color: 'bg-slate-700' },
];

// Tag colors
const tagColors = {
  'City Water': 'bg-blue-600',
  'City Water & Sewer': 'bg-blue-700',
  'City W&S': 'bg-blue-700',
  'Zoned Commercial': 'bg-green-600',
  'MF-20 Zoned': 'bg-purple-600',
  'MF Zoned': 'bg-purple-600',
  'Income Producing': 'bg-emerald-600',
  'Assemblage': 'bg-red-600',
  'Mixed Use': 'bg-orange-600',
  'Entitled': 'bg-teal-600',
  'Waterfront': 'bg-cyan-600',
  'Corner Lot': 'bg-indigo-600',
  'Oversized': 'bg-amber-600',
  'Oversized Lot': 'bg-amber-600',
  'Acreage': 'bg-lime-600',
  'Buildable': 'bg-slate-600',
  'Signalized Corner': 'bg-green-700',
  'High Traffic': 'bg-rose-600',
  'Near I-95': 'bg-violet-600',
  'Bulk Available': 'bg-red-500',
};

const LISTINGS_PER_PAGE = 12;

const CrexiListings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(LISTINGS_PER_PAGE);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties from database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Use dedicated curated endpoint — only returns listings, never inventory
        const response = await axios.get(`${API}/properties/curated`);
        if (response.data && response.data.length > 0) {
          const dbListings = response.data.map(prop => {
            // Build a sensible fallback description when the DB entry is missing one
            const typeLabel = {
              'Commercial': 'commercial',
              'Multi-Family': 'multifamily',
              'Assemblage': 'bulk / assemblage',
              'Residential': 'residential investment',
              'Industrial': 'industrial',
              'Land': 'land'
            }[prop.propertyType] || 'investment';
            const tagSnippet = (prop.tags && prop.tags.length > 0) ? ` — ${prop.tags.slice(0, 2).join(', ').toLowerCase()}.` : '.';
            const fallbackDescription = `${prop.acres || ''} ${typeLabel} parcel on ${prop.title} in ${(prop.city || 'Palm Bay').split(',')[0]}${tagSnippet}`.trim();

            return {
              id: prop.id,
              title: prop.title,
              city: prop.city,
              price: prop.price,
              acres: prop.acres,
              type: prop.propertyType,
              tags: prop.tags || [],
              valueStatement: (prop.description && prop.description.trim()) ? prop.description : fallbackDescription,
              image: prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=716&h=444&fit=crop&auto=format,compress&q=75',
              crexiUrl: prop.crexiUrl || null,
              sold: prop.sold || false
            };
          });
          setListings(dbListings);
        } else {
          setListings(fallbackListings);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setListings(fallbackListings);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            listing.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      const matchesCategory = activeCategory === 'all' || listing.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [listings, searchTerm, activeCategory]);

  // Get visible listings
  const visibleListings = filteredListings.slice(0, visibleCount);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: listings.length };
    categories.forEach(cat => {
      if (cat.id !== 'all') {
        counts[cat.id] = listings.filter(l => l.type === cat.id).length;
      }
    });
    return counts;
  }, [listings]);

  const loadMore = () => {
    setVisibleCount(prev => prev + LISTINGS_PER_PAGE);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Palm Bay Commercial, Industrial & Investment Land for Sale | Vahid Rajabian</title>
        <meta name="description" content="Commercial, industrial, multifamily, assemblages, and investment land for sale in Palm Bay and Brevard County, Florida. Signalized corners, development parcels, IU-zoned land, and bulk residential lots. Call 321-333-7230." />
        <link rel="canonical" href="https://palmbaylots-land.com/listings" />
        <meta property="og:title" content="Palm Bay Commercial, Industrial & Investment Land for Sale | Vahid Rajabian" />
        <meta property="og:description" content="Commercial, industrial, multifamily, assemblages, and investment land for sale in Palm Bay and Brevard County, Florida." />
        <meta property="og:url" content="https://palmbaylots-land.com/listings" />
        <meta property="og:type" content="website" />
        {/* RealEstateListing JSON-LD schema for each listing */}
        {filteredListings.length > 0 && (
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@graph": filteredListings.map(l => ({
              "@type": "RealEstateListing",
              "name": l.title,
              "url": `https://palmbaylots-land.com/listings`,
              "description": l.valueStatement || `${l.acres} ${l.type} parcel in ${l.city}.`,
              "image": l.image,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": l.title,
                "addressLocality": (l.city || '').split(',')[0]?.trim() || 'Palm Bay',
                "addressRegion": "FL",
                "addressCountry": "US"
              },
              "offers": {
                "@type": "Offer",
                "price": (l.price || '').replace(/[^0-9.]/g, '') || undefined,
                "priceCurrency": "USD",
                "availability": l.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
              },
              "category": l.type,
              "keywords": (l.tags || []).join(', ')
            }))
          })}</script>
        )}
      </Helmet>
      {/* ===== 1. HERO SECTION - GPT FINAL COPY ===== */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 mb-4">
              Commercial, Industrial & Investment Land in Palm Bay, Florida
            </h1>
            
            {/* Subheadline */}
            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Commercial, industrial, multifamily, assemblages, and residential investment lots. Local expertise since 2003. Zoning clarity, real market values, and straight answers — no inflated pricing, no wasted time.
            </p>
            
            {/* Primary Button - ONLY ONE */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors shadow-lg"
            >
              Get a Free Palm Bay Land Value
            </Link>
            
            {/* Trust Line - Enhanced */}
            <p className="text-sm text-gray-500 mt-5">
              No obligation. Zoning reviewed. Real buyer demand.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-4 bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Instruction line */}
          <p className="text-center text-sm text-gray-500 mb-1">
            Start by selecting a property type to narrow results.
          </p>
          <p className="text-center text-xs text-gray-400 mb-3">
            Most listings shown are commercial and redevelopment opportunities.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setVisibleCount(LISTINGS_PER_PAGE); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? `${cat.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label} ({categoryCounts[cat.id] || 0})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-5 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by address, city, or feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">
            Showing {visibleListings.length} of {filteredListings.length} listings
          </p>
        </div>
      </section>

      {/* ===== 2. PERFECT LISTING CARDS ===== */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleListings.map((listing) => (
              <div
                key={listing.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative ${listing.flagship ? 'ring-2 ring-amber-500' : ''} ${listing.sold ? 'opacity-75' : ''}`}
              >
                {/* SOLD overlay badge */}
                {listing.sold && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-md uppercase tracking-wider shadow-lg" data-testid={`sold-badge-${listing.id}`}>
                    Sold
                  </div>
                )}

                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className={`w-full h-full object-cover ${listing.sold ? 'grayscale' : ''}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=716&h=444&fit=crop&auto=format,compress&q=75';
                    }}
                  />
                </div>
                
                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1">
                  {/* PRIMARY: Zoning/Use Tag - DOMINANT */}
                  <div className="mb-2">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-bold text-white ${tagColors[listing.tags[0]] || 'bg-slate-600'}`}>
                      {listing.tags[0].toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Address */}
                  <h3 className="text-base font-bold text-slate-900 mb-0.5">
                    {listing.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{listing.city}</p>
                  
                  {/* SECONDARY: Price & Size - smaller */}
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="font-bold text-green-700">{listing.price}</span>
                    <span className="text-gray-400">|</span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Ruler className="w-3 h-3" />
                      {listing.acres}
                    </span>
                  </div>
                  
                  {/* Additional Tags (if any) */}
                  {listing.tags.length > 1 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {listing.tags.slice(1, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs font-medium text-gray-600 bg-gray-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Value Statement */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-4 flex-1">
                    {listing.valueStatement}
                  </p>
                  
                  {/* CTA - Link to Crexi listing */}
                  {listing.crexiUrl ? (
                    <a
                      href={listing.crexiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      View on Crexi
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-lg text-sm font-semibold transition-colors block"
                    >
                      Request Info
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {visibleCount < filteredListings.length && (
            <div className="text-center mt-8">
              <Button
                onClick={loadMore}
                variant="outline"
                className="px-8 py-3 border-2 border-slate-300 hover:border-amber-500 hover:text-amber-600"
              >
                Load More Properties ({filteredListings.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===== Looking for Something Specific? ===== */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
              Looking for Something Specific?
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
              Our listed inventory represents a portion of what is available. We have off-market commercial, industrial, and multifamily parcels throughout Palm Bay and Brevard County that never appear online. If you have specific size, zoning, or location requirements — call us directly. We have been sourcing deals in this market since 2003.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="tel:3213337230"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
                data-testid="off-market-phone-cta"
              >
                <Phone className="w-5 h-5" />
                321-333-7230
              </a>
              <a
                href="mailto:vahid@palmbayland.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                data-testid="off-market-email-cta"
              >
                vahid@palmbayland.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. MID-PAGE AUTHORITY BLOCK - SHARPER ===== */}
      <section className="py-10 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6 text-center">
              Why Work With Vahid?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">20+ years focused exclusively on Palm Bay land</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Commercial, industrial, multifamily, institutional, and residential</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">I tell you what you can actually build — not what sounds good on paper</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">Trusted by builders, developers, and land investors — not tire-kickers</span>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
              >
                <Phone className="w-5 h-5" />
                Talk to a Palm Bay Land Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. SELLER LANDING SECTION - MONEY MAKER ===== */}
      <section className="py-14 bg-amber-50 border-y-4 border-amber-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Own Land in Palm Bay?
            </h2>
            {/* Advisory framing */}
            <p className="text-lg text-slate-800 font-medium mb-2">
              Before you list, you should know this:
            </p>
            <p className="text-base text-slate-600 mb-6">
              Most owners don't know what their land is really worth — or who will actually buy it.
            </p>
            
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg mb-8 text-left">
              <p className="font-semibold text-slate-900 mb-4">I provide:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Real market value</strong> (not automated guesses)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Zoning & development potential</strong> review</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700"><strong>Buyer demand insight</strong> from active investors and builders</span>
                </li>
              </ul>
            </div>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-lg font-bold transition-colors shadow-lg"
            >
              Get a Free Palm Bay Land Value
            </Link>
            
            <p className="text-sm text-slate-500 mt-4 italic">
              No obligation. No pressure. Just straight answers.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 mb-4">
            Looking for something not listed? I source off-market deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="tel:3213337230"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
            >
              <Phone className="w-5 h-5" />
              321-333-7230
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
            >
              Request Parcel & Zoning Report
            </Link>
          </div>
          <a
            href="https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
            data-testid="crexi-profile-link"
          >
            View All Properties on Crexi
            <ExternalLink className="w-3 h-3" />
          </a>
          {/* Trust repetition */}
          <p className="text-sm text-gray-500 mt-4">
            Serving Palm Bay since 2003.
          </p>
        </div>
      </section>

      {/* ===== Internal Links - SEO + UX ===== */}
      <section className="py-10 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">
              Continue Exploring
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/inventory"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group"
                data-testid="footer-link-inventory"
              >
                <span className="font-semibold text-slate-900 group-hover:text-amber-600">
                  Browse Residential Lot Inventory
                </span>
                <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between gap-3 px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group"
                data-testid="footer-link-assessment"
              >
                <span className="font-semibold text-slate-900 group-hover:text-amber-600">
                  Get a Free Land Value Assessment
                </span>
                <ArrowRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CrexiListings;
