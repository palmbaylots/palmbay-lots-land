import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>
      
      <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
      {/* Top bar with contact info */}
      <div className="bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div className="flex items-center gap-4">
              <a href="tel:3213337230" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span>321-333-7230</span>
              </a>
              <a href="mailto:vahid@palmbayland.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">vahid@palmbayland.com</span>
              </a>
            </div>
            <div className="text-xs text-gray-300">
              Florida License #BK3454072
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/" className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-900">Vahid Reza Rajabian</h1>
            <p className="text-2xl font-bold text-slate-900">M. David Moallem, Inc.</p>
            <p className="text-sm text-amber-600 font-medium">Broker Associate - Palm Bay Real Estate</p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/about') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              About
            </Link>
            <Link 
              to="/listings" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/listings') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Listings
            </Link>
            <Link 
              to="/inventory" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/inventory') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Residential Lot Inventory
            </Link>
            <Link 
              to="/price-guide" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/price-guide') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Price Guide
            </Link>
            <Link 
              to="/sell-land" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/sell-land') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Sell Your Land
            </Link>
            <Link 
              to="/blog" 
              className={`font-medium transition-colors border-b-2 pb-1 ${isActive('/blog') || location.pathname.startsWith('/blog/') ? 'text-amber-600 border-amber-600' : 'text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-600'}`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className={`px-5 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors ${isActive('/contact') ? 'bg-amber-700' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/about') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              About
            </Link>
            <Link 
              to="/listings" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/listings') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Listings
            </Link>
            <Link 
              to="/inventory" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/inventory') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Residential Lot Inventory
            </Link>
            <Link 
              to="/price-guide" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/price-guide') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Price Guide
            </Link>
            <Link 
              to="/sell-land" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/sell-land') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Sell Your Land
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 rounded-lg font-medium transition-colors ${isActive('/blog') || location.pathname.startsWith('/blog/') ? 'bg-amber-100 text-amber-600' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 px-4 bg-amber-600 text-white rounded-lg font-medium text-center hover:bg-amber-700 transition-colors ${isActive('/contact') ? 'bg-amber-700' : ''}`}
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;