import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, Search, IdCard } from 'lucide-react';

// Brand colors
const NAVY = '#1a3a5c';
const NAVY_DARK = '#0f2438';
const NAVY_NAV = '#15314e';
const ORANGE = '#d97706';
const ORANGE_LIGHT = '#f0993a';
const LIGHT_BLUE = '#7eb8e8';
const MUTED = '#9db6cf';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/listings', label: 'Commercial' },
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
        {/* Top utility bar — phone, contact, email, license */}
        <div style={{ backgroundColor: NAVY_DARK }} className="text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-between items-center gap-y-2 py-2.5">
              <div className="flex items-center">
                <a
                  href="tel:3213337230"
                  className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors text-base md:text-lg font-bold pr-4"
                >
                  <Phone className="w-5 h-5" style={{ color: ORANGE_LIGHT }} />
                  <span>321-333-7230</span>
                </a>
                <Link
                  to="/contact"
                  className="text-white font-bold text-xs md:text-sm px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity mr-4"
                  style={{ backgroundColor: ORANGE }}
                >
                  Contact
                </Link>
                <a
                  href="mailto:vahid@palmbayland.com"
                  className="hidden sm:flex items-center gap-2 text-sm transition-colors hover:text-amber-400 pl-4 border-l"
                  style={{ color: '#cfe0f0', borderColor: 'rgba(255,255,255,0.18)' }}
                >
                  <Mail className="w-4 h-4" />
                  <span>vahid@palmbayland.com</span>
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm" style={{ color: MUTED }}>
                <IdCard className="w-4 h-4" />
                <span>Florida License #BK3454072</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand row — logo left, big centered name */}
        <div style={{ backgroundColor: NAVY }}>
          <div className="container mx-auto px-4">
            <div className="relative flex items-center justify-center py-4 min-h-[92px]">
              {/* Logo pinned left */}
              <Link
                to="/"
                className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center"
                data-testid="header-brand-link"
              >
                <img
                  src="/images/palm-bay-logo.png"
                  alt="Palm Bay Lot-Land Real Estate — Florida Land Specialist seal logo"
                  className="h-20 md:h-24 w-auto object-contain"
                  loading="eager"
                  decoding="async"
                  data-testid="header-brand-logo"
                />
              </Link>

              {/* Centered brand name + compliance line */}
              <div className="text-center px-16 md:px-0">
                <div className="text-2xl md:text-4xl font-bold text-white tracking-wide leading-none">
                  PALM BAY LOTS &amp; LAND
                </div>
                <div className="text-[10px] md:text-xs mt-2" style={{ color: MUTED }}>
                  Vahid Rajabian, Broker Associate&nbsp;&nbsp;&middot;&nbsp;&nbsp;M. David Moallem, Inc.&nbsp;&nbsp;&middot;&nbsp;&nbsp;Serving Brevard since 1983
                </div>
              </div>

              {/* Mobile menu button pinned right */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white"
                aria-label="Toggle menu"
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation row */}
        <div style={{ backgroundColor: NAVY_NAV, borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="container mx-auto px-4">
            {/* Desktop nav — single centered row */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 py-2.5">
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
              <Link
                to="/inventory"
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: ORANGE }}
                data-testid="nav-search-lots"
              >
                <Search className="w-4 h-4" />
                Search Our Lots
              </Link>
            </nav>

            {/* Mobile nav dropdown */}
            {mobileMenuOpen && (
              <nav className="lg:hidden pb-4 space-y-2 pt-3">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-bold text-white text-center transition-colors hover:opacity-90"
                  style={{ backgroundColor: ORANGE }}
                >
                  <Search className="w-4 h-4" />
                  Search Our Lots
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg font-bold text-white text-center transition-colors hover:bg-white/10"
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
