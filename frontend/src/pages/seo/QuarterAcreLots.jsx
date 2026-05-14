import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, Ruler, ArrowRight, Home, HelpCircle, Trees, Car, Droplets } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const QuarterAcreLots = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API}/properties`);
        // Filter for quarter acre lots (0.20-0.30 acres)
        const quarterAcre = response.data.filter(p => {
          const acresStr = p.acres || '';
          const acresMatch = acresStr.match(/[\d.]+/);
          if (acresMatch) {
            const acres = parseFloat(acresMatch[0]);
            return acres >= 0.2 && acres <= 0.3;
          }
          return false;
        });
        setProperties(quarterAcre.slice(0, 12));
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Service Schema for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Quarter Acre Land Sales",
    "name": "Quarter Acre Lots for Sale in Palm Bay, FL",
    "description": "Buy 1/4 acre lots in Palm Bay, Florida. Perfect size for single family homes - approximately 10,000 sq ft of buildable residential land. Prices starting at $32,000 with owner financing available.",
    "url": "https://palmbaylots-land.com/quarter-acre-lots-palm-bay",
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
      "priceRange": "$32,000 - $75,000",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a quarter acre lot and is it big enough to build a house?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A quarter acre is approximately 10,000 square feet — the standard residential lot size in Palm Bay. It's the ideal size for a single-family home with a yard, driveway, and room for a septic system if needed. Most homes built in Palm Bay are on quarter-acre lots."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a quarter acre lot cost in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buildable quarter-acre lots in Palm Bay start at $41,000. Prices vary based on location, utility access, and zoning. Lots with city water cost more than well-and-septic lots. Owner financing available with 25% minimum down."
        }
      },
      {
        "@type": "Question",
        "name": "Are there property taxes or HOA fees on vacant land in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Property taxes on most residential lots in Palm Bay average $300-500 per year. There are no HOA fees on our lots. Florida has no state income tax, making holding costs very low for land investors."
        }
      },
      {
        "@type": "Question",
        "name": "Can out-of-state investors buy land in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. Many of our clients live in other states. We handle everything remotely — contracts, closings, and even property management if needed. Owner financing available with 25% minimum down, no bank qualification required."
        }
      },
      {
        "@type": "Question",
        "name": "What can I do with a quarter acre lot in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most quarter-acre lots are zoned RS-2 (Residential Single Family) — you can build one single-family home. Common uses: build a home to live in, build a spec home to sell, hold as an investment (land values in Palm Bay have been appreciating), or buy with owner financing and resell with your own terms."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Quarter Acre Lots Palm Bay FL | 1/4 Acre Land for Sale | Owner Financing</title>
        <meta name="description" content="Buy 1/4 acre lots in Palm Bay, Florida. Perfect size for single family homes - 10,000+ sq ft of buildable residential land. Prices starting at $32,000 with owner financing available." />
        <meta name="keywords" content="quarter acre lots Palm Bay, 1/4 acre land Florida, 10000 sq ft lots, residential lots Palm Bay FL, buildable land Brevard County, small acreage Florida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/quarter-acre-lots-palm-bay" />
        <meta property="og:title" content="Quarter Acre Lots Palm Bay FL | 1/4 Acre Land" />
        <meta property="og:description" content="Buy 1/4 acre lots in Palm Bay. Perfect for building your dream home. 10,000+ sq ft from $32,000." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://palmbaylots-land.com/quarter-acre-lots-palm-bay" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - H1 */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 rounded-full text-sm font-bold mb-6">
                <Ruler className="w-4 h-4" />
                PERFECT HOME SIZE
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Quarter Acre Lots in <span className="text-amber-400">Palm Bay, FL</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Looking for the ideal lot size to build your dream home? <strong>Quarter acre lots</strong> (approximately 10,000+ square feet) provide the perfect balance of space and affordability. Build a comfortable 3-4 bedroom home with room for a yard, pool, and outdoor living — all starting at just $32,000 with <strong>owner financing available</strong>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/listings"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                >
                  Browse Quarter Acre Lots
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

        {/* H2: Quarter Acre Lots in Palm Bay */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Quarter Acre Lots in Palm Bay
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                <strong>Quarter acre lots</strong> represent the sweet spot for residential construction in Palm Bay, Florida. At approximately 10,890 square feet (roughly 104 ft × 104 ft), these <strong>1/4 acre parcels</strong> provide ample space for a family home while remaining affordable and manageable. Most of Palm Bay's residential zoning is designed around this standard lot size, making permitting straightforward and construction costs predictable.
              </p>

              <p className="text-lg text-slate-700 mb-6">
                When you buy a <strong>quarter acre lot in Palm Bay</strong>, you're getting enough space to build a 1,500 to 3,000 square foot home with proper setbacks, plus room for a driveway, garage, backyard, and potentially a pool. Unlike smaller urban lots that feel cramped, or larger acreage that requires more maintenance, quarter acre lots offer the perfect balance for most homeowners.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                Our inventory includes hundreds of <strong>quarter acre lots</strong> across all areas of Palm Bay — from established northeast neighborhoods with city utilities to affordable southwest locations perfect for first-time buyers. Whether you're building your primary residence, a vacation home, or an investment property, we have <strong>1/4 acre land</strong> to match your needs and budget.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <p className="text-slate-800 font-medium">
                  <strong>Quick Reference:</strong> 1/4 acre = 10,890 sq ft = ~104 ft × 104 ft. That's roughly the size of 2.5 basketball courts, or about 20% of a football field.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Why a Quarter Acre is Perfect for Your Home */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why a Quarter Acre is Perfect for Your Home
              </h2>
              
              <p className="text-lg text-slate-700 mb-8">
                There's a reason <strong>quarter acre lots</strong> are the most popular size for residential construction in Florida. This lot size has been optimized over decades to provide homeowners with the ideal combination of living space, outdoor area, and affordability. Here's why a <strong>1/4 acre lot</strong> is likely perfect for your needs:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <Home className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Room for a 3-4 Bedroom Home</h3>
                    <p className="text-slate-600">With 10,000+ square feet, you can easily build a 1,500-2,500 sq ft single-family home while meeting all setback requirements (typically 25 ft front, 7.5 ft sides, 20 ft rear in Palm Bay).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <Trees className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Spacious Yard for Family</h3>
                    <p className="text-slate-600">Unlike cramped suburban lots, a quarter acre gives you genuine outdoor space. Room for kids to play, a vegetable garden, outdoor entertaining areas, and mature landscaping.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <Droplets className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Space for a Pool</h3>
                    <p className="text-slate-600">This is Florida — pools matter! A quarter acre lot easily accommodates a standard pool, screened enclosure, and pool deck while still leaving yard space.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <Car className="w-8 h-8 text-slate-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Driveway & Garage Space</h3>
                    <p className="text-slate-600">Plenty of room for a two-car garage, circular driveway, or RV/boat parking. Many homeowners appreciate not having to park on the street.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Most Affordable Standard Size</h3>
                    <p className="text-slate-600"><strong>Quarter acre lots</strong> are the most cost-effective for single-family construction. You get adequate space without paying for land you don't need.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm">
                  <CheckCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Meets Standard Zoning</h3>
                    <p className="text-slate-600">Quarter acre lots meet minimum requirements for most Palm Bay residential zones (RS-1, RS-2). No variance or special approval needed for standard construction.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* H2: What Can You Build on a Quarter Acre */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                What Can You Build on a Quarter Acre?
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                Understanding what fits on a <strong>quarter acre lot</strong> helps you visualize your future home. With proper planning, you can maximize every square foot of your <strong>10,000 sq ft lot</strong>. Here's a realistic breakdown of what's possible:
              </p>

              <div className="bg-slate-50 p-6 rounded-xl mb-8">
                <h3 className="font-bold text-slate-900 mb-4 text-xl">Typical Quarter Acre Layout:</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Main Home (footprint)</span>
                    <span className="text-amber-600 font-bold">2,000 - 3,000 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Attached 2-Car Garage</span>
                    <span className="text-amber-600 font-bold">400 - 600 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Driveway & Walkways</span>
                    <span className="text-amber-600 font-bold">500 - 800 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Pool & Deck (optional)</span>
                    <span className="text-amber-600 font-bold">800 - 1,200 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Required Setbacks</span>
                    <span className="text-amber-600 font-bold">~3,000 sq ft</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-700 font-medium">Remaining Yard Space</span>
                    <span className="text-green-600 font-bold">3,000 - 4,000 sq ft</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 mb-6">
                As you can see, a <strong>quarter acre</strong> comfortably accommodates a substantial home with all the amenities Florida living demands — including a pool — while leaving meaningful yard space. This is why quarter acre lots remain the most popular choice for Palm Bay home builders.
              </p>

              <div className="text-center">
                <Link 
                  to="/buildable-lots-palm-bay"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Learn About Our Buildable Guarantee
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Available Lots */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Available Quarter Acre Lots
              </h2>
              <p className="text-lg text-slate-600">
                {properties.length > 0 ? `${properties.length}+ lots between 0.20-0.30 acres ready to build` : 'Browse our quarter acre inventory'}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((prop) => {
                  const slug = prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link 
                      key={prop.id} 
                      to={`/property/${slug}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&auto=format,compress&q=75'} 
                          alt={`${prop.title} - Quarter acre lot in Palm Bay`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-4">
                        <div className="inline-block px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded mb-2">
                          {prop.acres}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{prop.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">{prop.city}</p>
                        <span className="font-bold text-amber-600">{prop.price}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-slate-600 mb-4">Loading quarter acre inventory...</p>
                <Link 
                  to="/listings"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  View All Available Lots
                </Link>
              </div>
            )}

            <div className="text-center mt-10">
              <Link 
                to="/listings"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
              >
                View All Available Lots
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* H2: Quarter Acre Lot Pricing in Palm Bay */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Quarter Acre Lot Pricing in Palm Bay
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                <strong>Quarter acre lots in Palm Bay</strong> range from approximately $32,000 to $75,000+ depending on location and utilities. The biggest factors affecting price are:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Location Within Palm Bay</h3>
                  <p className="text-slate-600">Northeast lots (closer to Melbourne) command higher prices than southwest lots. Proximity to schools, shopping, and major roads also impacts value.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Utility Availability</h3>
                  <p className="text-slate-600">Lots with <strong>city water and sewer</strong> typically add $15,000-$25,000 to the price compared to well/septic lots. However, this is often offset by lower construction costs.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Road Frontage & Access</h3>
                  <p className="text-slate-600">Corner lots and lots on paved roads may be priced higher than interior lots on unpaved streets.</p>
                </div>
              </div>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4 text-center">Typical Quarter Acre Pricing by Area</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="font-bold text-slate-900">Northeast (NE)</p>
                    <p className="text-2xl font-bold text-amber-600">$50K - $75K+</p>
                    <p className="text-sm text-slate-500">City water/sewer available</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="font-bold text-slate-900">Northwest (NW)</p>
                    <p className="text-2xl font-bold text-amber-600">$40K - $65K</p>
                    <p className="text-sm text-slate-500">Mix of utilities</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="font-bold text-slate-900">Southeast (SE)</p>
                    <p className="text-2xl font-bold text-amber-600">$35K - $55K</p>
                    <p className="text-sm text-slate-500">Growing area</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg text-center">
                    <p className="font-bold text-slate-900">Southwest (SW)</p>
                    <p className="text-2xl font-bold text-amber-600">$32K - $45K</p>
                    <p className="text-sm text-slate-500">Best value</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <Link 
                  to="/price-guide"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Use Our Price Calculator
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* H2: FAQs */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                FAQs About Quarter Acre Lots in Palm Bay
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    How big is a quarter acre exactly?
                  </h3>
                  <p className="text-slate-600">A quarter acre is exactly 10,890 square feet. In Palm Bay, most quarter acre lots measure roughly 80 ft × 125 ft or 100 ft × 110 ft, depending on the subdivision plat. That's approximately 2.5 basketball courts or about 20% of a football field.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    What size home can I build on a quarter acre?
                  </h3>
                  <p className="text-slate-600">With typical Palm Bay setbacks (25 ft front, 7.5 ft sides, 20 ft rear), you can comfortably build a 1,500-2,500 sq ft single-story home or up to 3,000+ sq ft with a two-story design. Most builders find quarter acre lots ideal for 3-4 bedroom family homes.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Can I add a pool to a quarter acre lot?
                  </h3>
                  <p className="text-slate-600">Yes! A <strong>quarter acre</strong> provides plenty of room for a standard pool (typically 12×24 to 16×32 ft), screened enclosure, and pool deck while still leaving substantial yard space. Many Palm Bay homes on quarter acre lots include pools.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Is a quarter acre enough for privacy?
                  </h3>
                  <p className="text-slate-600">For most homeowners, yes. With proper landscaping and fencing, a quarter acre provides adequate privacy from neighbors. If you want significant buffer space or a more rural feel, consider larger half-acre or full-acre lots.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Do you offer owner financing on quarter acre lots?
                  </h3>
                  <p className="text-slate-600">Yes! All our <strong>quarter acre lots</strong> qualify for <Link to="/owner-financing-land-florida" className="text-amber-600 hover:underline">owner financing</Link>. Typical terms include 10-20% down payment, 10% APR, and up to 10-year amortization. No bank qualification required.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Should I buy a quarter acre or larger lot?
                  </h3>
                  <p className="text-slate-600">It depends on your needs. Quarter acre lots are most cost-effective for standard single-family homes. If you want horses, extensive gardens, multiple outbuildings, or significant privacy, consider half-acre or larger. For most families, a quarter acre is perfect.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Links Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Explore More Palm Bay Land Options</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/palm-bay-land-for-sale" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">All Palm Bay Land</p>
                  <p className="text-sm text-slate-500">500+ lots available</p>
                </Link>
                <Link to="/owner-financing-land-florida" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-500">No bank needed</p>
                </Link>
                <Link to="/buildable-lots-palm-bay" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Buildable Lots</p>
                  <p className="text-sm text-slate-500">100% guaranteed</p>
                </Link>
                <Link to="/price-guide" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Quarter Acre in Palm Bay</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to own a <strong>quarter acre lot</strong> in Palm Bay? With 20+ years of experience, I'll help you find a buildable lot in your ideal neighborhood at a price that fits your budget.
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

export default QuarterAcreLots;
