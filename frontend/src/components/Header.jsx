import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X } from 'lucide-react';

// Brand colors
const NAVY = '#1a3a5c';
const ORANGE = '#d97706';
const LIGHT_BLUE = '#7eb8e8';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/listings', label: ['Commercial &', 'Investment Listings'] },
  { to: '/inventory', label: ['Residential Lot', 'Inventory'] },
  { to: '/price-guide', label: ['Price Guide &', 'Financing Terms'] },
  { to: '/sell-land', label: ['Sell Your', 'Land'] },
  { to: '/blog', label: 'Blog' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/blog') return location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    return location.pathname === path;
  };

  const renderLabel = (label) => {
    if (Array.isArray(label)) {
      return (
        <span className="flex flex-col items-center leading-tight">
          {label.map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </span>
      );
    }
    return label;
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <header className="shadow-md sticky top-0 z-50" role="banner" style={{ backgroundColor: NAVY }} data-testid="site-header">
        {/* Top bar with contact info */}
        <div className="bg-slate-900 text-white py-2">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center text-sm">
              <div className="flex items-center gap-4 text-white">
                <a href="tel:3213337230" className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>321-333-7230</span>
                </a>
                <a href="mailto:vahid@palmbayland.com" className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">vahid@palmbayland.com</span>
                </a>
              </div>
              <div className="text-xs text-white">
                Florida License #BK3454072
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation - navy background full width */}
        <div className="w-full" style={{ backgroundColor: NAVY }}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4 gap-4">
              {/* Logo/Brand */}
              <Link to="/" className="flex items-stretch gap-3 md:gap-4 leading-tight" data-testid="header-brand-link">
                {/* Palm Bay Lot-Land brand seal — equal height to the text block */}
                <img
                  src="/images/palm-bay-logo.png"
                  alt="Palm Bay Lot-Land Real Estate — Florida Land Specialist seal logo"
                  className="h-20 md:h-28 w-auto flex-shrink-0 self-center md:-ml-1"
                  loading="eager"
                  decoding="async"
                  data-testid="header-brand-logo"
                />

                {/* Vertical divider between emblem and text */}
                <div className="hidden md:block w-px" style={{ backgroundColor: LIGHT_BLUE, opacity: 0.4 }} />

                {/* Brand text block - matches business card layout */}
                <div className="flex flex-col justify-center leading-tight">
                  {/* Line 1: Name */}
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    VAHID R. RAJABIAN
                  </h1>
                  {/* Line 2: Broker tagline (above orange divider) */}
                  <p className="text-[10px] md:text-xs font-bold tracking-wider mt-1" style={{ color: ORANGE }}>
                    BROKER ASSOCIATE · SINCE 2003
                  </p>
                  {/* Orange horizontal divider */}
                  <hr className="my-1.5 border-0 h-px" style={{ backgroundColor: ORANGE }} />
                  {/* Line 3: Business mark */}
                  <p className="text-[10px] md:text-xs font-bold tracking-wider" style={{ color: ORANGE }}>
                    PALM BAY LOTS · LAND
                  </p>
                  {/* Line 4: Brokerage name (same prominence as Vahid name) */}
                  <p className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
                    M. DAVID MOALLEM, INC.
                  </p>
                  {/* Line 5: Heritage line */}
                  <p className="text-[10px] md:text-xs font-medium tracking-wider mt-1" style={{ color: LIGHT_BLUE }}>
                    ESTABLISHED &amp; SERVING BREVARD COUNTY SINCE 1983
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`text-sm xl:text-base font-bold text-white text-center transition-colors border-b-2 pb-1 hover:text-amber-400 ${
                        active ? 'border-amber-500' : 'border-transparent hover:border-amber-400'
                      }`}
                      data-testid={`nav-${item.to === '/' ? 'home' : item.to.replace('/', '')}`}
                    >
                      {renderLabel(item.label)}
                    </Link>
                  );
                })}
                <Link
                  to="/contact"
                  className={`px-5 py-2 rounded-lg font-bold text-white transition-colors ${
                    isActive('/contact') ? 'bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                  data-testid="nav-contact"
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white"
                aria-label="Toggle menu"
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav className="lg:hidden pb-4 space-y-2 border-t border-white/10 pt-3">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.to);
                  const labelText = Array.isArray(item.label) ? item.label.join(' ') : item.label;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-2 px-4 rounded-lg font-bold text-white transition-colors ${
                        active ? 'bg-amber-600' : 'hover:bg-white/10'
                      }`}
                    >
                      {labelText}
                    </Link>
                  );
                })}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-4 rounded-lg font-bold text-white text-center transition-colors ${
                    isActive('/contact') ? 'bg-amber-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
