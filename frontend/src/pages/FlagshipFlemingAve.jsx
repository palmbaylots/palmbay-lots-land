import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle, MapPin, Home, Droplets, Ruler, DollarSign, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CREXI_URL = "https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8";

const schemaData = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "2418 Fleming Avenue SW, Palm Bay, FL",
  "description": "Buildable residential lot at 2418 Fleming Avenue SW, Palm Bay, FL. 10,019 sq ft with city water available. $65,000. Owner financing with 25% minimum down.",
  "url": "https://palmbaylots-land.com/listing/2418-fleming-ave",
  "address": { "@type": "PostalAddress", "streetAddress": "2418 Fleming Avenue SW", "addressLocality": "Palm Bay", "addressRegion": "FL", "postalCode": "32908", "addressCountry": "US" },
  "offers": { "@type": "Offer", "price": "65000", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Lot Size", "value": "10,019 SF" },
    { "@type": "PropertyValue", "name": "Utilities", "value": "City Water Available" },
    { "@type": "PropertyValue", "name": "Zoning", "value": "RS-2 Residential" }
  ],
  "broker": { "@type": "RealEstateAgent", "name": "Vahid Reza Rajabian", "telephone": "+1-321-333-7230" }
};

const FlagshipFlemingAve = () => {
  return (
    <>
      <Helmet>
        <title>2418 Fleming Avenue SW, Palm Bay FL | $65,000 | City Water | Owner Financing</title>
        <meta name="description" content="Buildable residential lot at 2418 Fleming Avenue SW, Palm Bay, FL. 10,019 sq ft with city water. $65,000 with owner financing — 25% min down, no bank needed. Contact Vahid Rajabian." />
        <link rel="canonical" href="https://palmbaylots-land.com/listing/2418-fleming-ave" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative">
          <div className="h-[400px] md:h-[500px] relative">
            <img
              src="https://images.crexi.com/assets/1658353/99c521fefb5c4f2990049f3f366577ea_716x444.jpg"
              alt="2418 Fleming Avenue SW - Aerial view of residential lot in Palm Bay"
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="container mx-auto">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded uppercase tracking-wide">
                    City Water · Buildable · No HOA
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  2418 Fleming Avenue SW
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-4">Palm Bay, FL 32908</p>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">$65,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Ready-to-Build Residential Lot with City Water
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  This 10,019 square foot lot on Fleming Avenue in Southwest Palm Bay is a straightforward single-family home site with city water available. Zoned RS-2, no HOA, and ready for permits. Located in a growing residential area with active new construction nearby.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mt-4">
                  At $65,000 with owner financing available, this is a practical entry point for buyers who want to build their own home, build a spec home to sell, or hold for appreciation.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="mb-10 bg-slate-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">City Water Available</p>
                      <p className="text-sm text-slate-600">No well needed — connect to municipal water</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Buildable — Zoned RS-2</p>
                      <p className="text-sm text-slate-600">Single-family residential</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Ruler className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">10,019 Square Feet</p>
                      <p className="text-sm text-slate-600">Standard quarter-acre lot</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">No HOA Fees</p>
                      <p className="text-sm text-slate-600">Property taxes ~$300-500/year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You Could Build */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">What You Could Build Here</h3>
                <p className="text-slate-700 mb-4">
                  With 10,019 sq ft and RS-2 zoning, this lot fits a typical 1,500-2,500 sq ft single-family home with a garage, driveway, and yard. Standard Palm Bay setbacks still leave plenty of building envelope.
                </p>
                <div className="bg-slate-100 p-5 rounded-lg">
                  <p className="text-sm font-bold text-slate-900 mb-2">Estimated Build Cost (using a local builder)</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Land</p>
                      <p className="font-bold text-slate-900">$65,000</p>
                    </div>
                    <div>
                      <p className="text-slate-600">2,000 sqft Home @ $140/sqft</p>
                      <p className="font-bold text-slate-900">$280,000</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Septic (city water, no sewer)</p>
                      <p className="font-bold text-slate-900">~$12,000</p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-bold">Estimated Total</p>
                      <p className="font-bold text-amber-600 text-lg">~$357,000</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">Retail builders sell comparable finished homes at $180-190/sqft. Building yourself saves real money.</p>
                </div>
              </div>

              {/* Location */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Location
                </h3>
                <p className="text-slate-700">
                  Southwest Palm Bay — one of the city's most active building areas with strong new construction. Growing infrastructure as the city expands westward. Near Malabar Road access and I-95 corridor. Space Coast employment centers (Kennedy Space Center, SpaceX, L3Harris) are a reasonable commute.
                </p>
              </div>

              {/* Owner Financing */}
              <div className="mb-10 bg-slate-900 text-white rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Owner Financing Available</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                  <div>
                    <p className="text-2xl font-bold text-amber-400">$16,250</p>
                    <p className="text-sm text-gray-400">25% Min Down</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">35%</p>
                    <p className="text-sm text-gray-400">Deed Transfers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">$0</p>
                    <p className="text-sm text-gray-400">Prepayment Penalty</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-400">10%</p>
                    <p className="text-sm text-gray-400">Interest Rate</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  No bank qualification required. We do personal approval — we look at you as an individual. Deed transfers at 35% paid (~$22,750). No prepayment penalty.
                </p>
                <Link to="/guide/owner-financing-what-to-watch" className="inline-block mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium">
                  Learn about our financing terms →
                </Link>
              </div>

              {/* Crexi */}
              <div className="mb-10 bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                <p className="text-slate-700 mb-4">View all of our active listings on Crexi:</p>
                <a
                  href={CREXI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                  data-testid="crexi-link"
                >
                  View All Properties on Crexi
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Interested in This Lot?</h3>
                  <p className="text-sm text-slate-600 mb-6">Contact Vahid for parcel details, zoning verification, and financing terms.</p>
                  <Link to="/contact" className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-lg font-bold transition-colors mb-4">
                    Request Parcel Report
                  </Link>
                  <a href="tel:3213337230" className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg font-bold transition-colors">
                    <Phone className="w-4 h-4 inline mr-2" />321-333-7230
                  </a>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Listed By</h4>
                  <p className="text-lg font-bold text-slate-900">Vahid Rajabian</p>
                  <p className="text-slate-600">Broker Associate</p>
                  <p className="text-sm text-slate-500 mb-4">M. David Moallem, Inc.</p>
                  <div className="space-y-2 text-sm">
                    <a href="tel:3213337230" className="flex items-center gap-2 text-slate-700 hover:text-amber-600"><Phone className="w-4 h-4" />321-333-7230</a>
                    <a href="mailto:vahid@palmbayland.com" className="flex items-center gap-2 text-slate-700 hover:text-amber-600"><Mail className="w-4 h-4" />vahid@palmbayland.com</a>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">Quick Facts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Price</span><span className="font-semibold">$65,000</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Size</span><span className="font-semibold">10,019 SF</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Zoning</span><span className="font-semibold">RS-2 Residential</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Water</span><span className="font-semibold">City Water</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Sewer</span><span className="font-semibold">Septic Required</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">HOA</span><span className="font-semibold">None</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Financing</span><span className="font-semibold">25% Min Down</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-8 bg-slate-100 border-t">
          <div className="container mx-auto px-4 text-center">
            <Link to="/listings" className="text-slate-600 hover:text-amber-600 transition-colors">← Back to All Listings</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default FlagshipFlemingAve;
