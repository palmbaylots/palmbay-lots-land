import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Ruler, Loader2, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Space Coast / Brevard County cities available in the Space Coast MLS feed.
const CITIES = [
  'Palm Bay', 'Melbourne', 'West Melbourne', 'Melbourne Beach', 'Malabar',
  'Grant', 'Micco', 'Barefoot Bay', 'Sebastian', 'Palm Shores', 'Rockledge',
  'Cocoa', 'Cocoa Beach', 'Merritt Island', 'Titusville', 'Satellite Beach',
  'Indialantic', 'Indian Harbour Beach', 'Viera',
];

const PRICE_OPTIONS = [
  { label: 'Any price', value: '' },
  { label: 'Under $50k', value: '50000' },
  { label: 'Under $75k', value: '75000' },
  { label: 'Under $100k', value: '100000' },
  { label: 'Under $200k', value: '200000' },
  { label: 'Under $500k', value: '500000' },
];

const ACRE_OPTIONS = [
  { label: 'Any size', value: '' },
  { label: '0.20+ acres', value: '0.2' },
  { label: '0.25+ acres', value: '0.25' },
  { label: '0.5+ acres', value: '0.5' },
  { label: '1+ acre', value: '1' },
  { label: '5+ acres', value: '5' },
];

const money = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    : 'Contact for price';

const lotSize = (l) => {
  if (l.lotAcres) return `${l.lotAcres} ac`;
  if (l.lotSqft) return `${Number(l.lotSqft).toLocaleString()} sqft`;
  return null;
};

const PER_PAGE = 24;

const MlsListings = () => {
  const [city, setCity] = useState('Palm Bay');
  const [maxPrice, setMaxPrice] = useState('');
  const [minAcres, setMinAcres] = useState('');
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState(''); // committed keyword

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchListings = useCallback(async (reset = true) => {
    setLoading(true);
    setError('');
    const nextSkip = reset ? 0 : skip + PER_PAGE;
    try {
      const params = { status: 'Active', limit: PER_PAGE, skip: nextSkip };
      if (city) params.city = city;
      if (maxPrice) params.max_price = maxPrice;
      if (minAcres) params.min_acres = minAcres;
      if (query) params.q = query;

      const res = await axios.get(`${API}/idx/listings`, { params });
      const data = res.data;
      if (data.source === 'error') {
        setError(data.reason || 'Listings are temporarily unavailable.');
        if (reset) setListings([]);
      } else {
        setListings((prev) => (reset ? data.listings : [...prev, ...data.listings]));
        setHasMore(Boolean(data.hasMore));
        setSkip(nextSkip);
      }
    } catch (e) {
      setError('Could not load listings. Please try again.');
      if (reset) setListings([]);
    } finally {
      setLoading(false);
    }
  }, [city, maxPrice, minAcres, query, skip]);

  // Refetch whenever a filter (other than the uncommitted keyword) changes.
  useEffect(() => {
    fetchListings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, maxPrice, minAcres, query]);

  const onSearch = (e) => {
    e.preventDefault();
    setQuery(keyword.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Space Coast MLS Listings | Palm Bay Lots &amp; Land</title>
        <meta
          name="description"
          content="Search active Space Coast MLS listings — lots, land, and homes in Palm Bay, Melbourne, and Brevard County, FL. Filter by city, price, and acreage."
        />
      </Helmet>

      {/* Header banner */}
      <div className="bg-[#1a3a5c] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Space Coast MLS Listings</h1>
          <p className="mt-2 text-blue-100">
            Active lots, land &amp; homes across Palm Bay and Brevard County — live from the MLS.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 min-w-[150px]"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Price</label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 min-w-[140px]"
            >
              {PRICE_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Lot size</label>
            <select
              value={minAcres}
              onChange={(e) => setMinAcres(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 min-w-[140px]"
            >
              {ACRE_OPTIONS.map((o) => (
                <option key={o.label} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <form onSubmit={onSearch} className="flex flex-col flex-1 min-w-[200px]">
            <label className="text-xs font-semibold text-slate-500 mb-1">Keyword / address</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Street, ZIP…"
                className="border border-slate-300 rounded-lg px-3 py-2 flex-1"
              />
              <Button type="submit" className="bg-[#d97706] hover:bg-[#b45309]">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {loading && listings.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a3a5c]" />
          </div>
        ) : listings.length === 0 && !error ? (
          <p className="text-center text-slate-500 py-20">
            No active listings match your filters. Try widening the price or lot size.
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-4">
              Showing {listings.length} active listing{listings.length === 1 ? '' : 's'}
              {city ? ` in ${city}` : ''}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <article
                  key={l.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-[4/3] bg-slate-200">
                    {l.photo ? (
                      <img src={l.photo} alt={l.address} loading="lazy"
                           className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <MapPin className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    {l.status && (
                      <span className="self-start text-[11px] uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        {l.status}
                      </span>
                    )}
                    <div className="text-xl font-bold text-[#1a3a5c]">{money(l.price)}</div>
                    <div className="text-sm text-slate-700">{l.address}</div>
                    <div className="text-xs text-slate-500 flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {l.beds != null && <span>{l.beds} bd</span>}
                      {l.baths != null && <span>{l.baths} ba</span>}
                      {l.livingArea ? <span>{Number(l.livingArea).toLocaleString()} sqft</span> : null}
                      {lotSize(l) && (
                        <span className="flex items-center gap-1">
                          <Ruler className="w-3 h-3" />{lotSize(l)}
                        </span>
                      )}
                      {l.mlsNumber && <span>MLS# {l.mlsNumber}</span>}
                    </div>
                    {l.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {l.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchListings(false)}
                  disabled={loading}
                  className="bg-[#1a3a5c] hover:bg-[#12283f]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load more'}
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-12 bg-[#1a3a5c] text-white rounded-xl p-6 text-center">
          <p className="text-lg font-semibold">Interested in a lot or want owner financing?</p>
          <a href="tel:3213337230"
             className="inline-flex items-center gap-2 mt-3 bg-[#d97706] hover:bg-[#b45309] px-5 py-2.5 rounded-lg font-semibold">
            <Phone className="w-4 h-4" /> Call Vahid: 321-333-7230
          </a>
          <p className="mt-4 text-xs text-blue-200">
            Listing data from Space Coast MLS. Information deemed reliable but not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MlsListings;
