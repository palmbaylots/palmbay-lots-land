import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, HelpCircle, Droplets, Home, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you build on vacant land in Palm Bay, Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Most vacant lots in Palm Bay are zoned RS-2 (Residential Single Family) and are buildable. Before you build, you need to verify zoning, utility access (city water/sewer vs well/septic), and pull permits through the City of Palm Bay. A local builder can build a home for $125-150 per square foot total cost including all permits."
      }
    },
    {
      "@type": "Question",
      "name": "What permits do I need to build on land in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You need a building permit from the City of Palm Bay. This includes site plan approval, foundation inspection, framing inspection, and final inspection. If you need a septic system, you also need a permit from Brevard County Health Department. The total permit and impact fee cost varies but is included in the $125-150/sqft building cost when using a local builder."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to build a house on land in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A local builder can build a home in Palm Bay for approximately $125-150 per square foot total cost — this includes all permits. A 2,000 sq ft home costs roughly $250,000-$300,000 to build, not including the land. Additional costs may include well installation ($5,000-$10,000) and septic system ($8,000-$15,000) depending on utility availability."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need city water or can I use a well in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on the lot location. Some areas (Units 5, 7, 8, 9, 38) have city water and sewer — no well or septic needed. Other areas have city water only — you install septic. Many areas require both well and septic. Lots with city water cost more but save you the expense of drilling a well ($5,000-$10,000)."
      }
    },
    {
      "@type": "Question",
      "name": "What zoning do I need to build a house in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most residential lots are zoned RS-2 (Residential Single Family), which allows one single-family home per lot on a minimum 5,000 sq ft parcel. RS-1 requires 7,500 sq ft minimum. Multi-family zones include RM-6 and MF-20. Commercial zones are C-1 (Neighborhood), C-2 (General), and C-3 (Intensive)."
      }
    }
  ]
};

const BuildOnLandGuide = () => {
  return (
    <>
      <Helmet>
        <title>Can You Build on Land in Palm Bay? Full Guide | Palm Bay Lots</title>
        <meta name="description" content="Complete guide to building on vacant land in Palm Bay, FL. Zoning requirements, permits, building costs ($125-150/sqft), utility options, and step-by-step process. From a 20+ year local expert." />
        <meta name="keywords" content="build on land Palm Bay, building permit Palm Bay FL, zoning Palm Bay, construction cost Palm Bay, well septic Palm Bay, vacant land buildable" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/guide/build-on-land-palm-bay" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Can You Build on Land in <span className="text-amber-400">Palm Bay</span>?
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Short answer: yes. Here's exactly what you need to know — zoning, permits, costs, and utilities — from someone who's been doing this for 20+ years.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Answer */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-green-900 mb-2">The Short Answer</h2>
                <p className="text-green-800">
                  Most vacant lots in Palm Bay are buildable. They're zoned RS-2 (Residential Single Family). A local builder can build a home for <strong>$125-150 per square foot</strong> total cost, including all permits. The main variable is utility access — city water/sewer vs. well/septic.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Need to Build</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    1. Confirm Zoning
                  </h3>
                  <p className="text-slate-700 mb-3">
                    Most lots are zoned <strong>RS-2</strong> — one single-family home per lot, minimum 5,000 sq ft parcel. Other residential zones include RS-1 (7,500 sq ft minimum). Multi-family zones (RM-6, MF-20) allow multiple units.
                  </p>
                  <p className="text-slate-600 text-sm">
                    Don't guess on zoning. I can tell you exactly what's allowed on any lot before you buy. <Link to="/contact" className="text-amber-600 hover:underline font-medium">Ask me</Link>.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    2. Know Your Utilities
                  </h3>
                  <p className="text-slate-700 mb-3">
                    This is the biggest variable in Palm Bay. Utility access depends on which unit your lot is in:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="font-bold text-blue-900 mb-1">City Water & Sewer</p>
                      <p className="text-blue-800 text-sm">Units 5, 7, 8, 9, 38</p>
                      <p className="text-blue-700 text-sm mt-1">No well or septic needed. Premium added to lot price.</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <p className="font-bold text-cyan-900 mb-1">City Water Only</p>
                      <p className="text-cyan-800 text-sm">Units 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50</p>
                      <p className="text-cyan-700 text-sm mt-1">Need septic system ($8K-$15K).</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="font-bold text-amber-900 mb-1">Well & Septic</p>
                      <p className="text-amber-800 text-sm">All other units</p>
                      <p className="text-amber-700 text-sm mt-1">Need well ($5K-$10K) + septic ($8K-$15K). Most affordable lots.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Home className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    3. Building Costs
                  </h3>
                  <div className="bg-slate-100 p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-600">Construction Cost</p>
                        <p className="text-xl font-bold text-slate-900">$125-150/sqft</p>
                        <p className="text-xs text-slate-500">Includes all permits</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">2,000 sqft Home</p>
                        <p className="text-xl font-bold text-slate-900">$250K-$300K</p>
                        <p className="text-xs text-slate-500">Not including land</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      For context, retail builders sell finished homes (land included) at $180-190/sqft. Building yourself or with a local builder offers real savings.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    4. Our Lot Protection
                  </h3>
                  <p className="text-slate-700">
                    If there's ever a buildability issue with a lot you purchase from us, you can exchange it for another lot of the same size and price category — <strong>no extra cost except the deed transfer fee</strong>, even if market values have increased. Buyers who purchase elsewhere can get stuck with problem lots. With us, you're protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-amber-600" />
                Common Questions About Building in Palm Bay
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

        {/* Internal Links */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Related Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/guide/septic-vs-sewer-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Septic vs Sewer</p>
                  <p className="text-sm text-slate-500">Cost comparison & which units have what</p>
                </Link>
                <Link to="/guide/owner-financing-what-to-watch" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing Guide</p>
                  <p className="text-sm text-slate-500">What to watch out for</p>
                </Link>
                <Link to="/inventory" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Browse Inventory</p>
                  <p className="text-sm text-slate-500">582+ buildable lots</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure If a Lot Is Buildable?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              I'll tell you exactly what you can build, what utilities are available, and what it'll cost — before you spend a dollar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:3213337230" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                <Phone className="w-5 h-5 inline mr-2" />
                Call 321-333-7230
              </a>
              <Link to="/contact" className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Send a Message
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BuildOnLandGuide;
