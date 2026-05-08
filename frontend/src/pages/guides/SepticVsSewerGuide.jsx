import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, HelpCircle, Droplets, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need septic or sewer for a lot in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on the lot's unit number. Units 5, 7, 8, 9, and 38 have city water and sewer — no septic needed. Units 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, and 50 have city water only — you need septic ($8,000-$15,000). All other units require both well ($5,000-$10,000) and septic."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a septic system cost in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A standard septic system in Palm Bay costs $8,000-$15,000 installed, depending on soil conditions and system type. This is a one-time cost. Annual maintenance (pumping every 3-5 years) runs $300-$500. Septic systems are common and reliable in Palm Bay."
      }
    },
    {
      "@type": "Question",
      "name": "How much does it cost to drill a well in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Drilling a well in Palm Bay typically costs $5,000-$10,000 depending on depth and water table. A well pump and pressure tank add to the cost. Well water in Palm Bay is generally good quality. Annual costs are minimal — just electricity for the pump."
      }
    },
    {
      "@type": "Question",
      "name": "Is city water better than well water in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "City water is treated and tested by the city, so quality is guaranteed. Well water quality varies by location. City water lots cost more upfront (lot price premium) but save you $5,000-$10,000 on well drilling. For resale value, city water lots generally appraise higher."
      }
    },
    {
      "@type": "Question",
      "name": "Which units in Palm Bay have city sewer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Units 5, 7, 8, 9, and 38 have both city water and city sewer. These are premium lots — no well or septic needed at all. The lot price includes a utility premium of approximately $40,000 for city water and sewer access."
      }
    },
    {
      "@type": "Question",
      "name": "Can I connect to city sewer later in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In most cases, if city sewer is not currently available to your lot, it's not practical to connect later — the infrastructure would need to be extended by the city. It's best to know upfront what utilities are available before purchasing. We tell you the exact utility situation for any lot."
      }
    }
  ]
};

const SepticVsSewerGuide = () => {
  return (
    <>
      <Helmet>
        <title>Septic vs Sewer in Palm Bay FL Explained | Which Units Have What</title>
        <meta name="description" content="Complete guide to septic vs sewer in Palm Bay, Florida. Know which units have city water & sewer, city water only, or require well & septic. Cost comparison and pros/cons from a local expert." />
        <meta name="keywords" content="septic Palm Bay FL, sewer Palm Bay, city water Palm Bay, well water Palm Bay, utility cost Palm Bay lots, septic system cost Florida" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/guide/septic-vs-sewer-palm-bay" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Septic vs Sewer in <span className="text-amber-400">Palm Bay</span> Explained
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Not every lot in Palm Bay has the same utilities. Here's exactly which areas have city sewer, city water, or need well and septic — and what it costs.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Utility Access by Unit</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-blue-900">City Water & Sewer</h3>
                  </div>
                  <p className="text-blue-800 font-medium mb-2">Units 5, 7, 8, 9, 38</p>
                  <p className="text-blue-700 text-sm mb-3">No well or septic needed. Best for building — connect directly to city lines.</p>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm font-bold text-blue-900">Additional cost: ~$0</p>
                    <p className="text-xs text-blue-700">Utility premium built into lot price (+$40,000)</p>
                  </div>
                </div>

                <div className="bg-cyan-50 border-2 border-cyan-200 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                    <h3 className="text-lg font-bold text-cyan-900">City Water Only</h3>
                  </div>
                  <p className="text-cyan-800 font-medium mb-2">Units 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50</p>
                  <p className="text-cyan-700 text-sm mb-3">City water available. You install septic system.</p>
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <p className="text-sm font-bold text-cyan-900">Additional cost: $8K-$15K</p>
                    <p className="text-xs text-cyan-700">Septic system installation</p>
                  </div>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="w-6 h-6 text-amber-600" />
                    <h3 className="text-lg font-bold text-amber-900">Well & Septic</h3>
                  </div>
                  <p className="text-amber-800 font-medium mb-2">All other units</p>
                  <p className="text-amber-700 text-sm mb-3">No city utilities. You drill a well and install septic.</p>
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <p className="text-sm font-bold text-amber-900">Additional cost: $13K-$25K</p>
                    <p className="text-xs text-amber-700">Well ($5K-$10K) + Septic ($8K-$15K)</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 p-6 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-3">Cost Comparison: 2,000 sqft Home on a $41,000 Lot</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="text-left py-2 pr-4 text-slate-700">Cost Item</th>
                        <th className="text-right py-2 px-4 text-blue-700">City W&S</th>
                        <th className="text-right py-2 px-4 text-cyan-700">City Water</th>
                        <th className="text-right py-2 px-4 text-amber-700">Well & Septic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2 pr-4 text-slate-700">Land</td>
                        <td className="text-right py-2 px-4">$81,000*</td>
                        <td className="text-right py-2 px-4">$61,000*</td>
                        <td className="text-right py-2 px-4">$41,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-slate-700">Construction (2,000 sqft @ $140)</td>
                        <td className="text-right py-2 px-4">$280,000</td>
                        <td className="text-right py-2 px-4">$280,000</td>
                        <td className="text-right py-2 px-4">$280,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-slate-700">Well</td>
                        <td className="text-right py-2 px-4">$0</td>
                        <td className="text-right py-2 px-4">$0</td>
                        <td className="text-right py-2 px-4">$7,500</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-slate-700">Septic</td>
                        <td className="text-right py-2 px-4">$0</td>
                        <td className="text-right py-2 px-4">$12,000</td>
                        <td className="text-right py-2 px-4">$12,000</td>
                      </tr>
                      <tr className="font-bold border-t-2 border-slate-400">
                        <td className="py-2 pr-4 text-slate-900">Total</td>
                        <td className="text-right py-2 px-4 text-blue-700">~$361,000</td>
                        <td className="text-right py-2 px-4 text-cyan-700">~$353,000</td>
                        <td className="text-right py-2 px-4 text-amber-700">~$340,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">*Includes utility premium in lot price. Actual lot prices vary by unit and size.</p>
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

        {/* Internal Links */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-4 text-center">Related Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/guide/build-on-land-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Can You Build?</p>
                  <p className="text-sm text-slate-500">Zoning, permits & costs</p>
                </Link>
                <Link to="/guide/owner-financing-what-to-watch" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-500">What to watch out for</p>
                </Link>
                <Link to="/inventory" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Browse by Utility</p>
                  <p className="text-sm text-slate-500">See lots grouped by utility type</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure What Utilities a Lot Has?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              I'll tell you exactly what's available for any lot — city water, sewer, or if you need well and septic.
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

export default SepticVsSewerGuide;
