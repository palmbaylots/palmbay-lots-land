import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, ArrowRight, Shield, MapPin, Droplets, Home, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BuildableLotsPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API}/properties`);
        setProperties(response.data.slice(0, 12));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Enhanced Schema with Service type
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Land Sales",
    "name": "Buildable Lots for Sale in Palm Bay, FL",
    "description": "500+ verified buildable residential and commercial lots for sale in Palm Bay, Florida. All lots guaranteed buildable with verified zoning, permits, and utility access. Owner financing available.",
    "url": "https://palmbaylots-land.com/buildable-lots-palm-bay",
    "areaServed": {
      "@type": "City",
      "name": "Palm Bay",
      "containedInPlace": {
        "@type": "State",
        "name": "Florida"
      }
    },
    "provider": {
      "@type": "RealEstateAgent",
      "name": "Vahid Reza Rajabian",
      "telephone": "+1-321-333-7230",
      "email": "vahid@palmbayland.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Palm Bay",
        "addressRegion": "FL",
        "addressCountry": "US"
      }
    },
    "offers": {
      "@type": "Offer",
      "priceRange": "$32,000 - $5,000,000",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can I build on vacant land in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our lots are verified buildable residential parcels within the City of Palm Bay. Utility availability varies — some have city water and sewer, some have city water only (you install septic), and some require well and septic. We tell you exactly what's available for any lot before you buy."
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost to build a house in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A local builder can build a home in Palm Bay for approximately $125-150 per square foot total cost — this includes all the permits and such. A 2,000 sq ft home would cost roughly $250,000-$300,000 to build, not including the land. Well installation runs $5,000-$10,000 and septic systems cost $8,000-$15,000 if needed."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need septic or sewer in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on the lot's location (unit number). Some areas have city sewer connections available — no septic needed. Other areas have city water only, meaning you need to install a septic system ($8,000-$15,000). Some areas require both well and septic. We can tell you the exact utility situation for any lot."
        }
      },
      {
        "@type": "Question",
        "name": "What zoning allows building a house in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most residential lots in Palm Bay are zoned RS-2 (Residential Single Family), which allows one single-family home per lot. Other zones include RS-1 (larger lots, 7,500+ sq ft), RM-6 and MF-20 (multi-family), and commercial zones like C-1, C-2, C-3. We explain what zoning actually means for your specific lot."
        }
      },
      {
        "@type": "Question",
        "name": "Is owner financing available on buildable lots?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer owner financing on all residential lots. Minimum 25% down for an option contract. Deed transfers at 35% paid. No prepayment penalty. No bank qualification required. For a $41,000 lot, that's $10,250 minimum down."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Buildable Lots Palm Bay FL | 500+ Vacant Land for Sale | Owner Financing</title>
        <meta name="description" content="Find 500+ verified buildable lots in Palm Bay, Florida. Residential land in Brevard County with guaranteed buildability. City water, well & septic options. Owner financing available from $32,000." />
        <meta name="keywords" content="buildable lots Palm Bay, vacant land Palm Bay FL, residential land Brevard County, buildable land Florida, Palm Bay lots for sale" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/buildable-lots-palm-bay" />
        <meta property="og:title" content="Buildable Lots Palm Bay FL | Guaranteed Buildable Land" />
        <meta property="og:description" content="500+ verified buildable lots in Palm Bay. All lots guaranteed buildable with verified zoning and permits." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://palmbaylots-land.com/buildable-lots-palm-bay" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - H1 */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 rounded-full text-sm font-bold mb-6">
                <Shield className="w-4 h-4" />
                100% BUILDABLE GUARANTEE
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Buildable Lots in Palm Bay, FL
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Find your perfect <strong>buildable land in Palm Bay</strong>, Florida. We offer 500+ verified <strong>vacant lots in Brevard County</strong> with guaranteed buildability. Every lot is checked for zoning, permits, and utilities before listing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/listings"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                >
                  Browse Buildable Lots
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

        {/* H2: What Makes a Lot Buildable in Palm Bay */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                What Makes a Lot Buildable in Palm Bay?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Not all <strong>vacant land in Palm Bay FL</strong> is suitable for construction. Before purchasing any <strong>residential land in Brevard County</strong>, you need to verify several critical factors. Here's what determines if a lot is truly buildable:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Proper Zoning</h3>
                    <p className="text-slate-600">The lot must be zoned for residential use (RS-1, RS-2, or similar). We verify every lot meets Palm Bay's zoning requirements for single-family home construction.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <Droplets className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Utility Access</h3>
                    <p className="text-slate-600">Lots need water and sewer solutions. Options include <strong>city water</strong>, <strong>city sewer</strong>, or <strong>well and septic</strong>. We disclose exactly what's available for each lot.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <MapPin className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Road Access</h3>
                    <p className="text-slate-600">Every buildable lot must have legal road access. We never sell landlocked parcels that would require easements or legal disputes to access.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">No Deed Restrictions</h3>
                    <p className="text-slate-600">Some lots have covenants that prevent building. We check for restrictions and only sell lots where you can actually obtain a building permit.</p>
                  </div>
                </div>
              </div>

              <p className="text-slate-600">
                When you buy from us, all these factors have already been verified. That's our <strong>100% buildable guarantee</strong>. Learn more about <Link to="/owner-financing-land-florida" className="text-amber-600 hover:underline font-semibold">owner financing options</Link> for your buildable lot purchase.
              </p>
            </div>
          </div>
        </section>

        {/* H2: Best Areas for Buildable Lots in Palm Bay */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Best Areas for Buildable Lots in Palm Bay
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Palm Bay is divided into distinct areas, each with unique characteristics. Here's where to find the best <strong>buildable land in Palm Bay</strong>:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Northeast Palm Bay (NE)</h3>
                  <p className="text-slate-600 mb-3">Closest to Melbourne and I-95. More established with better infrastructure. Many lots have <strong>city water and sewer</strong> available. Higher price point but more convenient location.</p>
                  <p className="text-sm text-amber-600 font-semibold">Units: 5, 7, 8, 9, 38 (City Water & Sewer)</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Northwest Palm Bay (NW)</h3>
                  <p className="text-slate-600 mb-3">Growing area with a mix of new construction and vacant land. Some units have <strong>city water</strong> available. Good balance of price and accessibility.</p>
                  <p className="text-sm text-amber-600 font-semibold">Units: 10, 11, 12, 16, 21 (City Water Available)</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Southeast Palm Bay (SE)</h3>
                  <p className="text-slate-600 mb-3">Rapidly developing area with strong investment potential. Mix of city water and well/septic lots. Popular with builders and investors.</p>
                  <p className="text-sm text-amber-600 font-semibold">Units: 28, 31, 42, 44, 46, 48, 50</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Southwest Palm Bay (SW)</h3>
                  <p className="text-slate-600 mb-3">Most affordable <strong>vacant lots in Palm Bay</strong>. Primarily well and septic. Perfect for buyers seeking maximum value and larger lots.</p>
                  <p className="text-sm text-amber-600 font-semibold">Units: 13, 14, 15, 17-25 (Best Value)</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link 
                  to="/inventory"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  View Full Inventory by Unit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Why Invest in Palm Bay Land */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Invest in Palm Bay Land?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                <strong>Palm Bay, Florida</strong> is one of the fastest-growing cities in the state, making it an excellent choice for land investment. Here's why smart buyers are choosing <strong>buildable lots in Brevard County</strong>:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-amber-600 mb-2">120,000+</div>
                  <p className="text-slate-600">Population and growing rapidly every year</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-amber-600 mb-2">0%</div>
                  <p className="text-slate-600">State income tax in Florida</p>
                </div>
                <div className="text-center p-6">
                  <div className="text-4xl font-bold text-amber-600 mb-2">$32K</div>
                  <p className="text-slate-600">Starting price for buildable lots</p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="mb-4">
                  <strong>Growing Demand:</strong> New construction is booming in Palm Bay. The Space Coast economy is thriving with aerospace employers like SpaceX, Blue Origin, and L3Harris bringing high-paying jobs to the area. This drives consistent demand for new housing.
                </p>
                <p className="mb-4">
                  <strong>Affordable Entry Point:</strong> Compared to South Florida or Orlando, <strong>vacant land in Palm Bay</strong> remains remarkably affordable. You can own a quarter-acre buildable lot for a fraction of what you'd pay elsewhere in Florida.
                </p>
                <p className="mb-4">
                  <strong>Owner Financing Available:</strong> Don't have cash or traditional financing? We offer <Link to="/owner-financing-land-florida" className="text-amber-600 hover:underline">owner financing with no bank qualification required</Link>. Low down payments and affordable monthly terms make land ownership accessible.
                </p>
                <p>
                  <strong>Build Equity:</strong> Whether you plan to build immediately or hold for appreciation, owning <strong>buildable land in Florida</strong> is a tangible asset that historically appreciates over time.
                </p>
              </div>

              <div className="mt-8">
                <Link 
                  to="/palm-bay-land-for-sale"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Learn More About Palm Bay Land
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Available Lots Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Verified Buildable Lots for Sale
              </h2>
              <p className="text-lg text-slate-600">
                Every lot below has been verified buildable by our team. Browse our <strong>residential land in Palm Bay</strong>:
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((prop) => {
                  const slug = prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link 
                      key={prop.id} 
                      to={`/property/${slug}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img 
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format,compress&q=75'} 
                          alt={`${prop.title} - Buildable lot in Palm Bay FL`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          BUILDABLE
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1">{prop.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">{prop.city}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-600">{prop.price}</span>
                          <span className="text-sm text-slate-500">{prop.acres}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="text-center mt-10">
              <Link 
                to="/listings"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
              >
                View All 500+ Buildable Lots
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* H2: FAQs About Buildable Lots in Palm Bay */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                FAQs About Buildable Lots in Palm Bay
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Is the land cleared and ready to build?
                  </h3>
                  <p className="text-slate-600">Most lots are in natural condition with native Florida vegetation. Clearing typically costs $2,000-$5,000 depending on lot size and vegetation density. Some lots may already be partially cleared.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    What utilities are available on buildable lots?
                  </h3>
                  <p className="text-slate-600">Utility availability varies by location. Some units have <strong>city water and sewer</strong>, others have <strong>city water only</strong> (septic required), and some require <strong>well and septic</strong>. We clearly identify utility status for each lot. Check our <Link to="/price-guide" className="text-amber-600 hover:underline">Price Guide</Link> for unit-specific details.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    How long does it take to build a home in Palm Bay?
                  </h3>
                  <p className="text-slate-600">Typical construction timeline is 6-12 months from permit approval. The permitting process takes 4-8 weeks. Site preparation (clearing, impact fees, utility connections) adds another 2-4 weeks before construction begins.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Do you offer owner financing on buildable lots?
                  </h3>
                  <p className="text-slate-600">Yes! We offer <Link to="/owner-financing-land-florida" className="text-amber-600 hover:underline">owner financing</Link> with no bank qualification required. Typical terms include a minimum 25% option money and up to 10-year amortization at a 10% interest rate (12.33% APR when the 10-point charge is financed). No bank qualification required.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Are there HOA fees or restrictions?
                  </h3>
                  <p className="text-slate-600">Most of our <strong>buildable lots in Palm Bay</strong> have NO HOA. This means no monthly fees and fewer building restrictions. Some areas may have minimal deed restrictions, which we disclose before purchase.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Can I visit the property before buying?
                  </h3>
                  <p className="text-slate-600">Absolutely! We encourage site visits. Contact us and we'll provide GPS coordinates, parcel maps, and can arrange to meet you at the property. Seeing the lot in person helps you make a confident decision.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore More Palm Bay Land Options</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/palm-bay-land-for-sale" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">All Palm Bay Land</p>
                  <p className="text-sm text-slate-500">500+ lots available</p>
                </Link>
                <Link to="/owner-financing-land-florida" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-500">No bank needed</p>
                </Link>
                <Link to="/quarter-acre-lots-palm-bay" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Quarter Acre Lots</p>
                  <p className="text-sm text-slate-500">Perfect home size</p>
                </Link>
                <Link to="/price-guide" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Price Calculator</p>
                  <p className="text-sm text-slate-500">Estimate your lot</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Own Buildable Land in Palm Bay?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact Vahid Rajabian today. With 20+ years of Palm Bay expertise, I'll help you find the perfect <strong>buildable lot</strong> for your dream home or investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:3213337230"
                className="px-10 py-5 bg-amber-500 text-white rounded-lg text-xl font-bold hover:bg-amber-600 transition-colors"
              >
                Call 321-333-7230
              </a>
              <Link 
                to="/contact"
                className="px-10 py-5 bg-white text-slate-900 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BuildableLotsPage;
