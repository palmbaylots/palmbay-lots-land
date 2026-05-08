import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, HelpCircle, CheckCircle, Shield, DollarSign } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I buy land without a realtor in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. In Florida, you can buy land directly from the seller without a buyer's agent. When you buy from a land specialist like Vahid Rajabian, you deal directly with the broker who knows the inventory, zoning, and pricing. No middleman, no extra commission on your side."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need a lawyer to buy land in Florida?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Florida does not require an attorney for real estate transactions. However, you may want one for complex deals. For standard owner-financed lot purchases, the seller handles the paperwork — contract, deed preparation, and recording. Closing can happen in 2-3 weeks."
      }
    },
    {
      "@type": "Question",
      "name": "How do I verify a lot is buildable before buying?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Check zoning (most Palm Bay lots are RS-2 residential), utility availability (city water/sewer vs well/septic), flood zone status, and any liens or encumbrances. A knowledgeable seller will provide this information upfront. We tell you exactly what you can build on any lot before you buy."
      }
    },
    {
      "@type": "Question",
      "name": "What are the risks of buying land without a realtor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The main risk is not knowing what you're buying — wrong zoning, no utility access, or title issues. This is why buying from an experienced land specialist matters. We verify buildability, disclose utility status, and offer a lot exchange guarantee if there's a problem. You're more protected buying from us than from a random MLS listing."
      }
    },
    {
      "@type": "Question",
      "name": "How much do I save buying land without a realtor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When buying from a seller directly, there's typically no buyer's agent commission (usually 2.5-3% of purchase price). On a $41,000 lot, that's $1,000-$1,200 saved. More importantly, you get direct access to the person who knows the inventory best — pricing, zoning, and what each lot can actually support."
      }
    }
  ]
};

const BuyWithoutRealtorGuide = () => {
  return (
    <>
      <Helmet>
        <title>How to Buy Land Without a Realtor in Florida | Step-by-Step Guide</title>
        <meta name="description" content="Complete guide to buying land in Florida without a realtor. How to verify zoning, check utilities, avoid scams, and close directly with the seller. From a 20+ year Palm Bay land expert." />
        <meta name="keywords" content="buy land without realtor Florida, buy land directly from seller, no realtor land purchase, FSBO land Florida, how to buy vacant land" />
        <link rel="canonical" href="https://palmbaylots-land.com/guide/buy-land-without-realtor" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                How to Buy Land <span className="text-amber-400">Without a Realtor</span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                You don't need a buyer's agent to purchase land in Florida. Here's how to do it right — what to check, what to avoid, and how to close directly with the seller.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-green-900 mb-2">The Short Answer</h2>
                <p className="text-green-800">
                  Yes, you can buy land directly from the seller in Florida without a buyer's agent. When buying from a land specialist, you deal directly with the person who knows the inventory, zoning, and pricing — no middleman, no extra fees on your side.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-6">Step-by-Step: Buying Land Directly</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    1. Find the Right Lot
                  </h3>
                  <p className="text-slate-700 mb-2">
                    Start with what you need: location, size, utility access, and budget. A land specialist can narrow 500+ lots to the ones that match your goals — whether that's building a home, investing, or building to sell.
                  </p>
                  <p className="text-slate-600 text-sm">
                    <Link to="/inventory" className="text-amber-600 hover:underline font-medium">Browse our 582+ lots</Link> grouped by utility type, or <Link to="/contact" className="text-amber-600 hover:underline font-medium">call us</Link> and tell us what you're looking for.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    2. Verify Before You Buy
                  </h3>
                  <p className="text-slate-700 mb-3">Before committing, verify these for any lot:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-900 text-sm">Zoning</p>
                      <p className="text-xs text-slate-600">RS-2 allows single-family homes. Verify with the city.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-900 text-sm">Utilities</p>
                      <p className="text-xs text-slate-600">City water/sewer vs. well/septic. <Link to="/guide/septic-vs-sewer-palm-bay" className="text-amber-600">See utility guide</Link></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-900 text-sm">Flood Zone</p>
                      <p className="text-xs text-slate-600">Most Palm Bay lots are Zone X (minimal flood risk). <Link to="/guide/flood-zones-palm-bay" className="text-amber-600">See flood guide</Link></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-900 text-sm">Title</p>
                      <p className="text-xs text-slate-600">Clear title, no liens or encumbrances. Seller should guarantee.</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">We provide all of this upfront — you don't have to dig for it.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                    3. Choose Your Payment Method
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="font-bold text-amber-900">Owner Financing</p>
                      <p className="text-sm text-amber-800 mt-1">25% minimum down. No bank needed. Deed at 35% paid. Most buyers choose this.</p>
                      <Link to="/guide/owner-financing-what-to-watch" className="text-amber-600 text-xs font-medium mt-2 inline-block">Learn more →</Link>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-900">Cash Purchase</p>
                      <p className="text-sm text-slate-700 mt-1">Fastest closing (days). Full ownership immediately. Best negotiating position.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    4. Close the Deal
                  </h3>
                  <p className="text-slate-700">
                    With owner financing, closing happens in 2-3 weeks. We handle the contract and deed paperwork. Cash purchases close even faster. No need for a separate title company on standard transactions.
                  </p>
                </div>
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
                <Link to="/guide/owner-financing-what-to-watch" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Owner Financing</p>
                  <p className="text-sm text-slate-500">What to watch out for</p>
                </Link>
                <Link to="/guide/flood-zones-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Flood Zones</p>
                  <p className="text-sm text-slate-500">What you need to know</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Buy Direct?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Skip the middleman. Call me directly for lot availability, pricing, and financing — no obligation.
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

export default BuyWithoutRealtorGuide;
