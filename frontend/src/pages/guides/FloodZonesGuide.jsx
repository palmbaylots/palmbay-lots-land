import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, HelpCircle, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Palm Bay in a flood zone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most residential lots in Palm Bay are in FEMA Flood Zone X (minimal flood risk — no flood insurance required). Some areas near canals, retention ponds, or the Indian River may be in Zone AE (moderate to high risk). Always check the specific lot's flood zone before purchasing. We can tell you the flood zone for any lot in our inventory."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need flood insurance for a lot in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "If your lot is in Zone X (most of Palm Bay), flood insurance is not required but optional. If it's in Zone AE or another high-risk zone, flood insurance is required if you have a federally-backed mortgage. For vacant land without a structure, flood insurance isn't typically required regardless of zone."
      }
    },
    {
      "@type": "Question",
      "name": "Can I build in a flood zone in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, but with requirements. In high-risk zones (AE), the home must be built above the Base Flood Elevation (BFE). This typically means elevated foundations, which adds construction cost. In Zone X, there are no flood-specific building restrictions. Most of our inventory is in Zone X."
      }
    },
    {
      "@type": "Question",
      "name": "How do I check the flood zone for a specific lot in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can check FEMA's Flood Map Service Center (msc.fema.gov) using the property address. Brevard County also has flood zone data on their GIS system. Or simply ask us — we can look up the flood zone for any lot in our inventory and tell you before you buy."
      }
    },
    {
      "@type": "Question",
      "name": "Does flood zone affect land value in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Lots in Zone X (minimal risk) are generally more valuable because buyers don't need flood insurance and there are no elevation requirements for construction. Lots in high-risk zones may be discounted but come with additional building costs. Our pricing already accounts for flood zone status."
      }
    }
  ]
};

const FloodZonesGuide = () => {
  return (
    <>
      <Helmet>
        <title>Palm Bay Flood Zones Explained | Palm Bay Lots & Land</title>
        <meta name="description" content="Find out which flood zone your Palm Bay lot is in before you buy. We explain FEMA flood zones, what they mean, and how they affect building in Palm Bay, FL." />
        <meta name="keywords" content="flood zone Palm Bay FL, FEMA flood map Palm Bay, flood insurance Palm Bay, Zone X Palm Bay, building in flood zone Florida" />
        <link rel="canonical" href="https://palmbaylots-land.com/guide/flood-zones-palm-bay" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Flood Zones in <span className="text-amber-400">Palm Bay</span> Explained
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Most lots in Palm Bay are NOT in a high-risk flood zone. Here's what you need to know about FEMA zones, insurance, and building requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-green-900 mb-2">Good News</h2>
                <p className="text-green-800">
                  The majority of residential lots in Palm Bay fall in <strong>FEMA Flood Zone X</strong> — minimal flood risk. No flood insurance required. No special building elevation needed. This is one reason Palm Bay land is attractive to builders and investors.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">FEMA Flood Zones in Palm Bay</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-green-50 border-2 border-green-200 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-green-900">Zone X (Most Common)</h3>
                  </div>
                  <p className="text-green-800 font-medium mb-2">Minimal Flood Risk</p>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li>• No flood insurance required</li>
                    <li>• No elevation requirements for building</li>
                    <li>• Standard construction costs apply</li>
                    <li>• Most of our inventory is Zone X</li>
                  </ul>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <h3 className="text-lg font-bold text-amber-900">Zone AE (Some Areas)</h3>
                  </div>
                  <p className="text-amber-800 font-medium mb-2">Moderate to High Flood Risk</p>
                  <ul className="space-y-2 text-sm text-amber-700">
                    <li>• Flood insurance required with mortgage</li>
                    <li>• Must build above Base Flood Elevation</li>
                    <li>• Higher construction costs (elevated foundation)</li>
                    <li>• Typically near canals, ponds, or rivers</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">What This Means for Buyers</h2>

              <div className="space-y-6 mb-10">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">If Your Lot Is Zone X</h3>
                  <p className="text-slate-700">
                    You're in the clear. No flood insurance needed (though you can buy it cheaply as optional protection). Build at standard construction costs — $125-150/sqft with a local builder. No elevation requirements. The majority of our inventory falls in Zone X — <Link to="/inventory" className="text-amber-600 font-semibold hover:underline" data-testid="floodzone-inventory-link">browse our Palm Bay lot inventory</Link> to see what's available.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">If Your Lot Is Zone AE</h3>
                  <p className="text-slate-700">
                    You can still build, but the home must be above the Base Flood Elevation (BFE). This means elevated foundations — typically adding $10,000-$25,000 to construction costs. If you're financing the build with a bank, flood insurance is required. For owner-financed vacant land, flood insurance isn't required.
                  </p>
                </div>

                <div className="bg-slate-100 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Our Guarantee
                  </h3>
                  <p className="text-slate-700">
                    We can tell you the flood zone for any lot in our inventory before you buy. If there's an unexpected issue with a lot after purchase, our lot exchange guarantee protects you — swap for another lot of the same size and price, no extra cost except the deed transfer fee.
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Check Flood Zone</h2>
              <div className="bg-slate-50 p-6 rounded-xl mb-8">
                <ol className="space-y-3 text-slate-700">
                  <li><strong>1. Ask us</strong> — We look up flood zone for any lot before you buy. Free, no obligation.</li>
                  <li><strong>2. FEMA Flood Map Service</strong> — Visit <span className="text-slate-500">msc.fema.gov</span> and search by address.</li>
                  <li><strong>3. Brevard County GIS</strong> — The county GIS portal shows flood zone overlays on property maps.</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-600" />
                Common Questions
              </h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((faq, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2">{faq.name}</h3>
                    <p className="text-slate-600">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Related Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/guide/build-on-land-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Can You Build?</p>
                  <p className="text-sm text-slate-500">Zoning, permits & costs</p>
                </Link>
                <Link to="/guide/septic-vs-sewer-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Septic vs Sewer</p>
                  <p className="text-sm text-slate-500">Utility costs by unit</p>
                </Link>
                <Link to="/guide/buy-land-without-realtor" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Buy Without a Realtor</p>
                  <p className="text-sm text-slate-500">Step-by-step guide</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to Know the Flood Zone for a Specific Lot?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              I'll look it up for you — free, no obligation. Just tell me the lot address or inventory ID.
            </p>
            <a href="tel:3213337230" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors inline-flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Call 321-333-7230
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default FloodZonesGuide;
