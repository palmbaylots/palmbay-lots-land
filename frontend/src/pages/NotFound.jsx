import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';

/**
 * 404 NotFound page.
 *
 * Critical SEO behavior:
 *  - Sets <meta name="robots" content="noindex, follow"> so Google does NOT
 *    index these stale / mistyped URLs as duplicates of the homepage.
 *  - Sets a self-referencing canonical so any signal Google does pick up
 *    points to the not-found URL itself, never to the homepage.
 *
 * This page is mounted via a catch-all <Route path="*" /> in App.js.
 */
const NotFound = () => {
  const { pathname } = useLocation();
  const canonicalUrl = `https://palmbaylots-land.com${pathname}`;

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <Helmet>
        <title>Page Not Found (404) | Palm Bay Lots-Land</title>
        <meta name="description" content="The page you are looking for could not be found. Browse current Palm Bay land inventory, listings, and resources." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="max-w-xl text-center">
        <p className="text-7xl md:text-8xl font-bold text-amber-600 mb-4" aria-hidden>404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The page you are looking for has been moved, renamed, or never existed.
          Try one of these instead:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
          <Link to="/inventory" className="px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all">
            <p className="font-bold text-slate-900">Browse Lot Inventory</p>
            <p className="text-sm text-slate-500">580+ Palm Bay residential lots</p>
          </Link>
          <Link to="/listings" className="px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all">
            <p className="font-bold text-slate-900">Commercial Listings</p>
            <p className="text-sm text-slate-500">Investment &amp; industrial land</p>
          </Link>
          <Link to="/blog" className="px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all">
            <p className="font-bold text-slate-900">Blog &amp; Guides</p>
            <p className="text-sm text-slate-500">Zoning, financing, market</p>
          </Link>
          <Link to="/contact" className="px-5 py-4 bg-white rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all">
            <p className="font-bold text-slate-900">Contact Vahid</p>
            <p className="text-sm text-slate-500">321-333-7230</p>
          </Link>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
