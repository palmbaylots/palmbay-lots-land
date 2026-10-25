import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, Search } from 'lucide-react';

// Brand colors
const NAVY = '#1a3a5c';
const NAVY_NAV = '#15314e';
const ORANGE = '#d97706';
const ORANGE_LIGHT = '#f0993a';
const LIGHT_BLUE = '#7eb8e8';
const MUTED = '#9db6cf';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/listings', label: 'Commercial' },
  { to: '/mls-listings', label: 'MLS Listings' },
  { to: '/map', label: 'Map' },
  { to: '/price-guide', label: 'Owner Financing' },
  { to: '/sell-land', label: 'Sell Land' },
  { to: '/blog', label: 'Blog' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/blog') return location.pathname === '/blog' || location.pathname.startsWith('/blog/');
    return location.pathname === path;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      {/* ───── Brand row — scrolls away (NOT sticky) ───── */}
      <header role="banner" style={{ backgroundColor: NAVY }} data-testid="site-header">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 md:py-4">
            {/* Left spacer — balances the email on the right so the brand stays centered */}
            <div className="hidden md:block" aria-hidden="true" />

            {/* Centered brand */}
            <Link to="/" className="text-center" data-testid="header-brand-link">
              <div className="text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-wide leading-tight">
                PALM BAY LOTS &amp; LAND
              </div>
              <div className="mt-1 leading-tight md:whitespace-nowrap">
                <span className="text-sm md:text-xl font-bold" style={{ color: LIGHT_BLUE }}>
                  Vahid Rajabian, Broker Associate
                </span>
                <span className="text-[11px] md:text-xs ml-0 md:ml-2 block md:inline" style={{ color: MUTED }}>
                  M. David Moallem, Inc.&nbsp;&nbsp;&middot;&nbsp;&nbsp;Serving Brevard since 1983
                </span>
              </div>
              <div className="mt-1 text-xs md:text-sm font-semibold" style={{ color: ORANGE_LIGHT }}>
                Large Inventory of Residential Lots&nbsp;&middot;&nbsp;Owner Financing Available
              </div>
            </Link>

            {/* Email pinned right (desktop) */}
            <div className="hidden md:flex justify-end">
              <a
                href="mailto:vahid@palmbayland.com"
                className="flex items-center gap-2 font-semibold transition-colors hover:text-white"
                style={{ color: LIGHT_BLUE }}
              >
                <Mail className="w-5 h-5" />
                <span className="text-base lg:text-lg">vahid@palmbayland.com</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ───── Nav row — pinned to top on scroll (sticky) ───── */}
      <nav
        className="sticky top-0 z-50 shadow-md"
        style={{ backgroundColor: NAVY_NAV, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}
        data-testid="site-nav"
        aria-label="Primary"
      >
        <div className="container mx-auto px-4">
          {/* Desktop nav: phone left · links center · search right */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2.5">
            <a
              href="tel:3213337230"
              className="flex items-center gap-2 font-bold text-white whitespace-nowrap transition-colors hover:text-amber-400"
            >
              <Phone className="w-5 h-5" style={{ color: ORANGE_LIGHT }} />
              <span className="text-base xl:text-lg">321-333-7230</span>
            </a>

            <div className="flex items-center justify-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-sm xl:text-base font-bold text-white whitespace-nowrap transition-colors border-b-2 pb-1 hover:text-amber-400 ${
                      active ? 'border-amber-500' : 'border-transparent hover:border-amber-400'
                    }`}
                    data-testid={`nav-${item.to === '/' ? 'home' : item.to.replace('/', '')}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Link
                to="/inventory"
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white whitespace-nowrap transition-opacity hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
                data-testid="nav-search-lots"
              >
                <Search className="w-4 h-4" />
                Search Our Lots
              </Link>
            </div>
          </div>

          {/* Mobile nav bar: phone left · hamburger right (always reachable while pinned) */}
          <div className="lg:hidden flex items-center justify-between py-2.5">
            <a
              href="tel:3213337230"
              className="flex items-center gap-2 font-bold text-white transition-colors hover:text-amber-400"
            >
              <Phone className="w-5 h-5" style={{ color: ORANGE_LIGHT }} />
              <span>321-333-7230</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 space-y-2 pt-1" aria-label="Mobile">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className={`block py-2 px-4 rounded-lg font-bold text-white transition-colors ${
                      active ? 'bg-amber-600' : 'hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                to="/inventory"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-white text-center transition-opacity hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
              >
                <Search className="w-4 h-4" />
                Search Our Lots
              </Link>
              <Link
                to="/contact"
                onClick={closeMenu}
                className="block py-2 px-4 rounded-lg font-bold text-white text-center transition-colors hover:bg-white/10"
              >
                Contact
              </Link>
              <a
                href="mailto:vahid@palmbayland.com"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 py-2 px-4 text-sm"
                style={{ color: LIGHT_BLUE }}
              >
                <Mail className="w-4 h-4" />
                vahid@palmbayland.com
              </a>
            </nav>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
