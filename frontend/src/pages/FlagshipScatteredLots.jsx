import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle, MapPin, Building2, Ruler, DollarSign, Users, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const CREXI_URL = "https://www.crexi.com/properties?searchBrokerId=fca17317-df0a-4445-9f8e-f6e05efc6cb8";

const schemaData = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "700+ Scattered Residential Lots — Palm Bay, FL",
  "description": "700+ buildable residential lots available in Palm Bay, Florida. Ideal for production builders, land investors, or individual buyers. Owner financing from $41,000. Volume pricing available.",
  "url": "https://palmbaylots-land.com/listing/scattered-lots",
  "address": { "@type": "PostalAddress", "addressLocality": "Palm Bay", "addressRegion": "FL", "addressCountry": "US" },
  "offers": { "@type": "Offer", "price": "41000", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
  "broker": { "@type": "RealEstateAgent", "name": "Vahid Reza Rajabian", "telephone": "+1-321-333-7230" }
};

const FlagshipScatteredLots = () => {
  return (
    <>
      <Helmet>
        <title>700+ Scattered Lots for Sale in Palm Bay FL | From $41,000 | Owner Financing</title>
        <meta name="description" content="700+ buildable residential lots available in Palm Bay, FL. Ideal for builders, investors, or individual buyers. Owner financing from $41,000. Volume pricing for bulk purchases." />
        <link rel="canonical" href="https://palmbaylots-land.com/listing/scattered-lots" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative">
          <div className="h-[400px] md:h-[500px] relative">
            <img
              src="https://images.crexi.com/assets/887500/83f1a143c87b4311b4121382e0bec4eb_716x444.jpg"
              alt="Aerial view of Palm Bay scattered residential lots"
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="container mx-auto">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-red-600 text-white text-sm font-bold rounded uppercase tracking-wide">
                    Bulk Inventory · Builder-Ready
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  700+ Scattered Lots
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-4">Palm Bay, Florida</p>
                <p className="text-3xl md:text-4xl font-bold text-amber-400">From $41,000</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {/* Headline */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  The Largest Residential Lot Inventory in Palm Bay
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Over 700 buildable residential lots spread across Palm Bay — from the northeast corridor near Melbourne to the expanding southwest neighborhoods. Quarter-acre parcels, most zoned RS-2, ready for single-family home construction.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mt-4">
                  Whether you're a production builder looking for volume, an investor building a land portfolio, or an individual buyer who wants to pick the best lot in the best location — this inventory has options at every price point.
                </p>
              </div>

              {/* Who This Is For */}
              <div className="mb-10 bg-slate-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-amber-600" />
                  Who Buys These Lots
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Production Builders</h4>
                    <p className="text-slate-600 text-sm">Buy 10, 50, or 100+ lots at volume pricing. Build spec homes and sell to the steady stream of Space Coast workers relocating to Palm Bay.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Land Investors</h4>
                    <p className="text-slate-600 text-sm">Buy lots with cash or owner financing, then resell with your own seller financing at a markup. Creates monthly income while transferring ownership.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Individual Buyers</h4>
                    <p className="text-slate-600 text-sm">Pick the perfect lot for your future home. Owner financing available — 25% minimum down, no bank qualification. Deed transfers at 35% paid.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Out-of-State Investors</h4>
                    <p className="text-slate-600 text-sm">We handle everything remotely — contracts, closings, and property oversight. Many of our clients live in other states.</p>
                  </div>
                </div>
              </div>

              {/* Inventory Breakdown */}
              <div className="mb-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Inventory Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <p className="text-3xl font-bold text-blue-700 mb-1">~57</p>
                    <p className="font-medium text-blue-900">City Water & Sewer Lots</p>
                    <p className="text-sm text-blue-700">No well or septic needed</p>
                  </div>
                  <div className="bg-cyan-50 p-5 rounded-xl border border-cyan-200">
                    <p className="text-3xl font-bold text-cyan-700 mb-1">~55</p>
                    <p className="font-medium text-cyan-900">City Water Only Lots</p>
                    <p className="text-sm text-cyan-700">Septic required</p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                    <p className="text-3xl font-bold text-amber-700 mb-1">~525</p>
                    <p className="font-medium text-amber-900">Well & Septic Lots</p>
                    <p className="text-sm text-amber-700">Most affordable</p>
                  </div>
                </div>
              </div>

              {/* Key Facts */}
              <div className="mb-10 bg-slate-900 text-white rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-amber-400 mb-4">Key Facts</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>All lots verified buildable — zoned RS-2 residential</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>Owner financing: 25% minimum down, deed at 35% paid</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>No HOA fees — property taxes average $300-500/year</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>Volume pricing available for bulk purchases</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>Lot exchange guarantee — swap if there's an issue</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    <span>Florida has no state income tax</span>
                  </li>
                </ul>
              </div>

              {/* Crexi Link */}
              <div className="mb-10 bg-amber-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                <p className="text-slate-700 mb-4">Browse all of our active listings on Crexi:</p>
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
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Interested in Bulk or Individual Lots?</h3>
                  <p className="text-sm text-slate-600 mb-6">Contact Vahid for lot availability, volume pricing, and financing terms.</p>
                  <Link to="/contact" className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-lg font-bold transition-colors mb-4">
                    Request Info
                  </Link>
                  <a href="tel:3213337230" className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg font-bold transition-colors">
                    <Phone className="w-4 h-4 inline mr-2" />321-333-7230
                  </a>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Listed By</h4>
                  <p className="text-lg font-bold text-slate-900">Vahid Rajabian</p>
                  <p className="text-slate-600">Broker Associate</p>
                  <p className="text-sm text-slate-500">M. David Moallem, Inc.</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <a href="tel:3213337230" className="flex items-center gap-2 text-slate-700 hover:text-amber-600"><Phone className="w-4 h-4" />321-333-7230</a>
                    <a href="mailto:vahid@palmbayland.com" className="flex items-center gap-2 text-slate-700 hover:text-amber-600"><Mail className="w-4 h-4" />vahid@palmbayland.com</a>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                  <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">Quick Facts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Starting Price</span><span className="font-semibold">From $41,000</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Lot Count</span><span className="font-semibold">700+</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Typical Size</span><span className="font-semibold">~0.25 AC</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Zoning</span><span className="font-semibold">RS-2 Residential</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Financing</span><span className="font-semibold">25% Min Down</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">HOA</span><span className="font-semibold">None</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-8 bg-slate-100 border-t">
          <div className="container mx-auto px-4 text-center">
            <Link to="/listings" className="text-slate-600 hover:text-amber-600 transition-colors">
              ← Back to All Listings
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default FlagshipScatteredLots;
