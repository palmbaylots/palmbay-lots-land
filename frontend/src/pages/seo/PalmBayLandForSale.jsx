import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, CheckCircle, Ruler, ArrowRight, HelpCircle, TrendingUp, DollarSign, Sun, Building } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PalmBayLandForSale = () => {
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

  // Service Schema for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Land Sales",
    "name": "Land for Sale in Palm Bay, Florida",
    "description": "Browse 500+ lots for sale in Palm Bay, FL. Residential, commercial, and buildable land with owner financing. Prices starting at $32,000. Expert local guidance from a 20+ year veteran.",
    "url": "https://palmbaylots-land.com/palm-bay-land-for-sale",
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
        "name": "How much does land cost in Palm Bay, Florida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Buildable quarter-acre lots in Palm Bay start at $41,000. Prices vary by location, utility access, and zoning. Lots with city water and sewer cost more than well-and-septic lots. Commercial and multi-family land ranges from $275,000 to $5,000,000+. Contact Vahid Rajabian at 321-333-7230 for current pricing."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use owner financing to buy land in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer owner financing on all residential lots. Minimum 25% down for an option contract, or 35% down to receive the deed immediately. No bank qualification required. No prepayment penalty. We do a personal approval — we look at you as an individual, not just a credit score."
        }
      },
      {
        "@type": "Question",
        "name": "Are the lots in Palm Bay buildable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our lots are buildable residential parcels in the City of Palm Bay. Utility availability varies by unit — some lots have city water and sewer, some have city water only (septic required), and some require well and septic. We can tell you exactly what utilities are available for any lot before you buy."
        }
      },
      {
        "@type": "Question",
        "name": "Do lots have utilities available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It depends on the unit. Some lots have city water and sewer (no well or septic needed). Some have city water only (you install septic). And some require well and septic. Our inventory page groups lots by utility type so you can see exactly what's available. City water lots cost more because they save you the expense of drilling a well."
        }
      },
      {
        "@type": "Question",
        "name": "How fast can I close on a lot in Palm Bay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "With owner financing, closing can happen in as little as 2-3 weeks. Cash purchases close even faster. We handle all paperwork and make the process straightforward."
        }
      },
      {
        "@type": "Question",
        "name": "Is there an HOA on Palm Bay lots?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Our lots do not have HOA fees. Property taxes average $300-500 per year for most residential lots, making holding costs very low."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Land for Sale in Palm Bay, FL | 500+ Lots | Owner Financing</title>
        <meta name="description" content="Browse 500+ lots for sale in Palm Bay, Florida. Residential, commercial, and buildable land with owner financing available. Prices starting at $32,000. Contact Vahid Rajabian - 20+ years local expertise." />
        <meta name="keywords" content="land for sale Palm Bay FL, Palm Bay lots, vacant land Brevard County, Florida land for sale, residential lots Palm Bay, buildable land Florida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/palm-bay-land-for-sale" />
        <meta property="og:title" content="Land for Sale in Palm Bay, FL | Owner Financing Available" />
        <meta property="og:description" content="500+ lots for sale in Palm Bay, Florida. Owner financing available. Prices from $32,000." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://palmbaylots-land.com/palm-bay-land-for-sale" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section - H1 */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Land for Sale in <span className="text-amber-400">Palm Bay, FL</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Discover over 500 <strong>buildable lots in Palm Bay</strong>, Florida's fastest-growing city on the Space Coast. Whether you're looking for <strong>residential land in Brevard County</strong> to build your dream home or <strong>vacant lots for investment</strong>, we have properties starting at just $32,000 with flexible owner financing options.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/listings"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                >
                  Browse All Listings
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

        {/* Stats Bar */}
        <section className="bg-amber-500 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white">
              <div className="text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm">Lots Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">$32K</p>
                <p className="text-sm">Starting Price</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">20+</p>
                <p className="text-sm">Years Experience</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">0%</p>
                <p className="text-sm">State Income Tax</p>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Land for Sale in Palm Bay, FL */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Land for Sale in Palm Bay, FL
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                <strong>Palm Bay land</strong> represents one of Florida's best remaining opportunities for affordable property ownership. As the largest city by area in Brevard County, Palm Bay offers an incredible variety of <strong>vacant lots in Palm Bay FL</strong> ranging from quarter-acre residential parcels to large commercial tracts. Unlike overcrowded South Florida markets where entry prices start at $100,000+, you can still find excellent <strong>buildable land in Palm Bay</strong> starting at just $32,000.
              </p>

              <p className="text-lg text-slate-700 mb-6">
                What makes <strong>Palm Bay real estate</strong> particularly attractive is the combination of location, affordability, and growth potential. Situated along Florida's Space Coast, Palm Bay residents enjoy easy access to pristine Atlantic beaches, the Indian River Lagoon, and major employers like Kennedy Space Center. The city's population has grown consistently for decades, driving demand for new housing and increasing property values over time.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                Whether you're a first-time land buyer looking to build your dream home, an investor seeking <strong>Florida land for sale</strong> with appreciation potential, or a builder searching for inventory, Palm Bay delivers exceptional value. Our listings include properties with city water and sewer, well and septic options, and various zoning designations to meet your specific needs.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <p className="text-slate-800 font-medium">
                  <strong>Key Takeaway:</strong> Palm Bay offers the rare combination of beachside Florida living at inland prices. With proper due diligence and expert guidance, buying <strong>land in Palm Bay</strong> can be the smartest real estate decision you make.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Why Buy Land in Palm Bay, Florida? */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Buy Land in Palm Bay, Florida?
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                The question isn't whether you should buy <strong>land in Palm Bay</strong> — it's why you haven't already. Palm Bay consistently ranks among Florida's fastest-growing cities, and for good reason. The Space Coast economy is booming with aerospace giants like SpaceX, Blue Origin, and L3Harris Technologies creating thousands of high-paying jobs. This economic growth directly translates to increased housing demand and rising land values.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                Beyond economics, Florida's tax advantages make Palm Bay even more attractive. With no state income tax, residents keep more of their earnings. Property taxes remain reasonable compared to other coastal Florida areas. And if you're relocating from high-tax states like New York, New Jersey, or California, the savings can be substantial — often enough to pay for your land within a few years.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm">
                  <DollarSign className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">No State Income Tax</h3>
                    <p className="text-slate-600">Florida is one of only 9 states with no state income tax. For a family earning $100,000, that's potentially $5,000-$10,000+ in annual savings compared to high-tax states. Plus, the Florida legislature just passed a bill to eliminate property tax for homestead residences — if approved by voters in November, many more people will want to move here, spiking land prices.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm">
                  <Sun className="w-8 h-8 text-amber-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Year-Round Florida Weather</h3>
                    <p className="text-slate-600">With an average temperature of 72°F, Palm Bay offers the classic Florida lifestyle. Beaches, fishing, boating, and outdoor activities are available 365 days a year.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Strong Appreciation Potential</h3>
                    <p className="text-slate-600">Palm Bay land values have appreciated consistently over the past decade. Limited supply and growing demand suggest this trend will continue.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm">
                  <Building className="w-8 h-8 text-slate-700 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Space Coast Economy</h3>
                    <p className="text-slate-600">Kennedy Space Center, SpaceX, Blue Origin, and defense contractors create a robust job market. These high-paying jobs fuel housing demand.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Best Areas for Land in Palm Bay */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Best Areas for Land in Palm Bay
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                Palm Bay is organized into numbered "units," each with distinct characteristics that affect pricing, utilities, and buildability. Understanding these differences is crucial when shopping for <strong>vacant land in Palm Bay FL</strong>. Location within the city dramatically impacts both purchase price and long-term value.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                Generally, lots closer to Melbourne (north) and those with city water/sewer command premium prices. Meanwhile, southwestern areas offer the best value for buyers willing to use well and septic systems. Here's a breakdown of Palm Bay's key areas:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Northeast Palm Bay (NE)</h3>
                  <p className="text-slate-600 mb-3">The most established and convenient area. Closest to Melbourne, I-95, shopping, and services. Many lots have <strong>city water and sewer</strong> available, making them more expensive but easier to build on.</p>
                  <p className="text-sm text-amber-600 font-semibold">Popular Units: 5, 7, 8, 9, 38</p>
                  <p className="text-sm text-slate-500 mt-2">Price Range: $50,000 - $150,000+</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Northwest Palm Bay (NW)</h3>
                  <p className="text-slate-600 mb-3">Growing area with good infrastructure development. Mix of city water and well/septic lots. Offers a balance between convenience and affordability. Popular with families building new homes.</p>
                  <p className="text-sm text-amber-600 font-semibold">Popular Units: 10, 11, 12, 16, 21</p>
                  <p className="text-sm text-slate-500 mt-2">Price Range: $40,000 - $90,000</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Southeast Palm Bay (SE)</h3>
                  <p className="text-slate-600 mb-3">Rapidly developing area popular with builders and investors. Strong mix of new construction and available lots. Good appreciation potential as infrastructure expands southward.</p>
                  <p className="text-sm text-amber-600 font-semibold">Popular Units: 28, 31, 42, 44, 46</p>
                  <p className="text-sm text-slate-500 mt-2">Price Range: $35,000 - $75,000</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border-2 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Southwest Palm Bay (SW)</h3>
                  <p className="text-slate-600 mb-3">The most affordable area for <strong>vacant lots in Palm Bay</strong>. Primarily requires well and septic. Perfect for value-focused buyers and investors seeking maximum land for minimum investment.</p>
                  <p className="text-sm text-amber-600 font-semibold">Popular Units: 13, 14, 15, 17-25</p>
                  <p className="text-sm text-slate-500 mt-2">Price Range: $32,000 - $55,000</p>
                </div>
              </div>

              <div className="text-center">
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

        {/* Available Lots */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Available Land in Palm Bay
              </h2>
              <p className="text-lg text-slate-600">
                Browse our current inventory of <strong>buildable lots</strong>
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
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'} 
                          alt={`${prop.title} - Land for sale in Palm Bay`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
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
                View All 500+ Listings
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* H2: Types of Land Available */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Types of Land Available in Palm Bay
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                Our inventory includes diverse property types to meet every buyer's needs. From standard <strong>residential lots in Palm Bay</strong> perfect for single-family homes to larger commercial parcels suitable for business development, we can help you find exactly what you're looking for. Here's what's available:
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Residential Lots (RS-1, RS-2 Zoning)</h3>
                  <p className="text-slate-600">Our most popular category. <strong>Quarter-acre lots</strong> (approximately 10,000 sq ft) perfect for building 1,500-3,000 sq ft single-family homes. These <strong>buildable lots in Palm Bay</strong> meet all zoning requirements for residential construction.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Commercial Land</h3>
                  <p className="text-slate-600">Zoned for retail, office, or mixed-use development. Ideal for entrepreneurs, investors, or developers looking to capitalize on Palm Bay's growth. Prime locations along major corridors.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Multi-Family Parcels</h3>
                  <p className="text-slate-600">Larger lots zoned for duplex, triplex, or small apartment construction. Perfect for investors seeking rental income or developers building multi-unit projects.</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-lg">
                  <h3 className="font-bold text-slate-900 mb-2">Acreage</h3>
                  <p className="text-slate-600">For buyers wanting more space, privacy, or subdivision potential. Half-acre to multi-acre parcels available in various locations throughout Palm Bay.</p>
                </div>
              </div>

              <p className="text-slate-600">
                Learn about our <Link to="/buildable-lots-palm-bay" className="text-amber-600 hover:underline font-semibold">100% buildable guarantee</Link> — every lot we sell has been verified for zoning, permits, and utility access.
              </p>
            </div>
          </div>
        </section>

        {/* H2: FAQs */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                FAQs About Land for Sale in Palm Bay
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Are all lots buildable?
                  </h3>
                  <p className="text-slate-600">Yes, we guarantee all our lots are <Link to="/buildable-lots-palm-bay" className="text-amber-600 hover:underline">100% buildable</Link>. We verify zoning and permit eligibility before listing any property. Unlike other land sellers, we never sell wetlands, landlocked parcels, or lots with restrictive covenants that prevent construction.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Do lots have utilities available?
                  </h3>
                  <p className="text-slate-600">Utility availability varies by lot location. Many have city water available (adds approximately $20,000 to base price), and some have both water and sewer. Lots without city utilities use well and septic systems, which are common and reliable in Palm Bay. Check our <Link to="/price-guide" className="text-amber-600 hover:underline">Price Guide</Link> for unit-specific utility information.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    What size lots are available?
                  </h3>
                  <p className="text-slate-600">Most of our inventory consists of <Link to="/quarter-acre-lots-palm-bay" className="text-amber-600 hover:underline">quarter-acre lots</Link> (approximately 10,000 square feet), which is the ideal size for single-family home construction in Palm Bay. We also have larger parcels available for those wanting more space or development potential.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    How does owner financing work?
                  </h3>
                  <p className="text-slate-600">We offer <Link to="/owner-financing-land-florida" className="text-amber-600 hover:underline">flexible owner financing</Link> with no bank qualification required. Minimum 25% down for an option contract, or 35% down to receive the deed immediately. No prepayment penalty — pay it off early anytime. Title transfers once 35% of purchase price is paid. Visit our <Link to="/price-guide" className="text-amber-600 hover:underline">Price Guide</Link> for full terms.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Can I visit the property before buying?
                  </h3>
                  <p className="text-slate-600">Absolutely! We encourage site visits. Contact us to schedule a tour of any property you're interested in. We provide GPS coordinates, aerial imagery, and can meet you at the property to walk the lot and answer questions in person.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    How fast can I close on a property?
                  </h3>
                  <p className="text-slate-600">With owner financing, closing can happen in as little as 2-3 weeks — much faster than traditional bank financing. Cash purchases close even faster. We handle all paperwork and make the process simple and transparent.</p>
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
                <Link to="/owner-financing-land-florida" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-500">No bank needed</p>
                </Link>
                <Link to="/quarter-acre-lots-palm-bay" className="p-4 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Quarter Acre Lots</p>
                  <p className="text-sm text-slate-500">Ideal home size</p>
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

        {/* CTA Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Own Land in Palm Bay?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Contact Vahid Rajabian today. With 20+ years of Palm Bay expertise and thousands of successful transactions, I'll help you find the perfect lot for your needs and budget.
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

export default PalmBayLandForSale;
