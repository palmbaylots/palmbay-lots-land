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
                  Price Guide
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