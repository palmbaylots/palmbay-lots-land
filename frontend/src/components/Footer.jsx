import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ExternalLink, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Track this visit and get the count
    const trackVisit = async () => {
      try {
        // Check if already tracked this session
        const tracked = sessionStorage.getItem('visit_tracked');
        if (!tracked) {
          await axios.post(`${API}/track-visit`);
          sessionStorage.setItem('visit_tracked', 'true');
        }
        
        // Get current count
        const response = await axios.get(`${API}/visitor-count`);
        setVisitorCount(response.data.count);
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };
    
    trackVisit();
  }, []);

  return (
    <footer className="bg-slate-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Vahid Reza Rajabian</h3>
            <h3 className="text-xl font-bold text-amber-400 mb-4">M. David Moallem, Inc.</h3>
            <p className="text-gray-300 text-sm mb-4">
              Broker Associate specializing in residential lots, new builds, and existing home sales in Palm Bay, Florida.
            </p>
            <p className="text-gray-400 text-xs">
              Florida License #BK3454072
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/inventory" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Listings
                </Link>
              </li>
              <li>
                <Link to="/price-guide" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Price Guide & Financing Terms
                </Link>
              </li>
              <li>
                <Link to="/sell-land" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Sell Your Land
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.palmbayland.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm flex items-center gap-1"
                >
                  Main Office Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* SEO Pages */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/palm-bay-land-for-sale" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Palm Bay Land for Sale
                </Link>
              </li>
              <li>
                <Link to="/owner-financing-land-florida" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Owner Financing Guide
                </Link>
              </li>
              <li>
                <Link to="/quarter-acre-lots-palm-bay" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Quarter Acre Lots
                </Link>
              </li>
              <li>
                <Link to="/buildable-lots-palm-bay" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Buildable Lots
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-700">
                <Link to="/guide/build-on-land-palm-bay" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Can You Build on Land in Palm Bay?
                </Link>
              </li>
              <li>
                <Link to="/guide/septic-vs-sewer-palm-bay" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Septic vs Sewer Explained
                </Link>
              </li>
              <li>
                <Link to="/guide/owner-financing-what-to-watch" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Owner Financing: What to Watch
                </Link>
              </li>
              <li>
                <Link to="/guide/buy-land-without-realtor" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Buy Land Without a Realtor
                </Link>
              </li>
              <li>
                <Link to="/guide/flood-zones-palm-bay" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">
                  Flood Zones in Palm Bay
                </Link>
              </li>
              <li className="pt-2 border-t border-gray-700">
                <a
                  href="https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors text-sm flex items-center gap-1"
                >
                  All Properties on Crexi
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-3">
              <a href="tel:3213337230" className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                <span>321-333-7230</span>
              </a>
              <a href="mailto:vahid@palmbayland.com" className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors text-sm">
                <Mail className="w-4 h-4" />
                <span>vahid@palmbayland.com</span>
              </a>
              <div className="flex items-start gap-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <div>
                  <p>M. David Moallem, Inc.</p>
                  <p>1663 Georgia St NE #700</p>
                  <p>Palm Bay, FL 32907</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Equal Housing Opportunity */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                EHO
              </div>
              <p className="text-xs text-gray-400">
                Equal Housing Opportunity
              </p>
            </div>
            <p className="text-xs text-gray-400 text-center md:text-right">
              © {new Date().getFullYear()} Vahid Reza Rajabian. All rights reserved.
            </p>
          </div>
          
          {/* Visitor Counter */}
          {visitorCount !== null && (
            <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-slate-800 rounded-lg w-fit mx-auto">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-300">
                <span className="font-bold text-amber-400">{visitorCount.toLocaleString()}</span> visitors
              </span>
            </div>
          )}

          {/* "Add as a preferred source on Google" badge */}
          <div className="flex justify-center mb-6">
            <a
              href="https://www.google.com/preferences/source?q=https://palmbaylots-land.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Add palmbaylots-land.com as a preferred source on Google"
              className="inline-block transition-opacity hover:opacity-90 focus:opacity-90"
              data-testid="google-preferred-source-badge"
            >
              <svg
                width="243"
                height="63"
                viewBox="0 0 243 63"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden="true"
              >
                <rect x="0" y="0" width="243" height="63" rx="10.8" ry="10.8" fill="#000000" stroke="#333" strokeWidth="1" />
                <g transform="translate(13.5, 15.3) scale(1.35)">
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                </g>
                <g style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '16.2px', fontWeight: 'bold', fontStyle: 'italic', fill: '#FFFFFF' }}>
                  <text x="58.5" y="28.8">Add as a preferred</text>
                  <text x="58.5" y="48.6">source on Google</text>
                </g>
              </svg>
            </a>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            <strong>Fair Housing Statement:</strong> All real estate advertised herein is subject to the Federal Fair Housing Act and the Florida Fair Housing Act, which make it illegal to advertise any preference, limitation, or discrimination based on race, color, religion, sex, handicap, familial status, or national origin. We are committed to maintaining compliance with all applicable Fair Housing laws.
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            <strong>Disclaimer:</strong> All information provided is deemed reliable but is not guaranteed and should be independently verified. 
            Prices, availability, and terms are subject to change without notice. This website is for informational purposes only and does not 
            constitute an offer to sell or a solicitation of an offer to buy. Properties are subject to prior sale, price change, correction, or withdrawal without notice.
          </p>
          
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            <strong>Privacy & Data Protection:</strong> We respect your privacy and are committed to protecting your personal information. By using this website and submitting your information, you consent to the collection and use of your data as described. Your information will not be sold to third parties. You have the right to access, correct, or delete your personal information at any time. For EU residents: We comply with GDPR requirements regarding data collection and processing.
          </p>
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
            <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors cursor-pointer underline">
              Privacy Policy
            </Link>
            <span>|</span>
            <a href="mailto:vahid@palmbayland.com?subject=Privacy%20Request" className="hover:text-amber-400 transition-colors cursor-pointer underline">
              Privacy Requests
            </a>
            <span>|</span>
            <a href="mailto:vahid@palmbayland.com?subject=Accessibility%20Feedback" className="hover:text-amber-400 transition-colors cursor-pointer underline">
              Accessibility Feedback
            </a>
            <span>|</span>
            <a href="mailto:vahid@palmbayland.com?subject=Unsubscribe" className="hover:text-amber-400 transition-colors cursor-pointer underline">
              Unsubscribe
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;