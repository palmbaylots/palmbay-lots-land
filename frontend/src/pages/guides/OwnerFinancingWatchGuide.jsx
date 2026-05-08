import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, HelpCircle, Shield, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is owner financing for land legitimate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Owner financing (also called seller financing) is a widely used, legitimate method for land purchases throughout Florida. Instead of borrowing from a bank, you make payments directly to the property seller. It's especially common for vacant land because banks rarely finance raw land."
      }
    },
    {
      "@type": "Question",
      "name": "What should I watch out for with owner financing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Watch for: (1) When the deed transfers — some sellers keep it for the entire loan term, we transfer at 35% paid. (2) Hidden fees — all our fees are disclosed upfront. (3) Prepayment penalties — we have none. (4) What happens if there's a lot problem — we offer a lot exchange guarantee. (5) The approval process — we do personal approval, not just credit scores."
      }
    },
    {
      "@type": "Question",
      "name": "When do I get the deed with owner financing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With us, the deed transfers at 35% paid. Many other sellers keep the deed for the entire loan term — meaning you could make payments for years without ever owning the property. We do it differently. With 25% minimum down and continued payments, you typically get the deed within about a year."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum down payment for owner financed land?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our minimum is 25% down for an option contract. If you put 35% down, you receive the deed immediately. For a $41,000 lot, that's $10,250 minimum down. No bank qualification required."
      }
    },
    {
      "@type": "Question",
      "name": "Are there prepayment penalties with owner financing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Not with us. You can pay extra toward principal any time, pay off the balance in full, or continue with regular payments. Many buyers accelerate payments once they're ready to build. If you get a construction loan, the lender pays us off at closing — no penalty."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need good credit for owner financing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We do a personal approval. We look at you as an individual, not just a credit score. We pull credit and review it, but we listen to life events that may have caused past issues. You'll only be disqualified if you have a habit of not paying your obligations. Owner financing is used by investors, self-employed buyers, first-time buyers, and people who prefer not to deal with banks."
      }
    },
    {
      "@type": "Question",
      "name": "What if there's a problem with my lot after purchase?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You're protected with our lot exchange guarantee. If there's a buildability issue or something unexpected, you can exchange it for another lot of the same size and price category — no extra cost except the deed transfer fee, even if market values have increased."
      }
    }
  ]
};

const OwnerFinancingWatchGuide = () => {
  return (
    <>
      <Helmet>
        <title>Owner Financing Land: What to Watch Out For | Palm Bay Expert Guide</title>
        <meta name="description" content="What to watch out for when buying land with owner financing in Florida. Deed transfer timing, hidden fees, prepayment penalties, and how our approach is different. From a 20+ year Palm Bay land expert." />
        <meta name="keywords" content="owner financing land watch out, seller financing land scam, owner financing red flags, land contract Florida, is owner financing safe, owner financing vs bank" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/guide/owner-financing-what-to-watch" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Owner Financing Land: <span className="text-amber-400">What to Watch Out For</span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Owner financing is legitimate and widely used for land purchases. But not all deals are equal. Here's what to look for — and how we do things differently.
              </p>
            </div>
          </div>
        </section>

        {/* What to Watch */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">5 Things to Watch Out For</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">1. When Does the Deed Transfer?</h3>
                    <p className="text-slate-700 mb-2">
                      This is the biggest thing to check. Many sellers keep the deed in their name <strong>for the entire loan term</strong> — meaning you could pay for 10 years and still not legally own the property.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                      <p className="text-green-800">
                        <strong>How we do it:</strong> We transfer the deed at 35% paid. With minimum payments, that's typically about a year. Most of our buyers own the property well before they finish paying.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">2. Hidden Fees</h3>
                    <p className="text-slate-700 mb-2">
                      Some sellers add documentation fees, servicing fees, or inflate closing costs. Ask for a full breakdown before signing anything.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                      <p className="text-green-800">
                        <strong>How we do it:</strong> All fees are disclosed in advance. At closing, the buyer is responsible for their portion of closing costs — normal procedure. No hidden charges.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">3. Prepayment Penalties</h3>
                    <p className="text-slate-700 mb-2">
                      Some contracts penalize you for paying off early. If you want to build and get a construction loan, a prepayment penalty can cost thousands.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                      <p className="text-green-800">
                        <strong>How we do it:</strong> No prepayment penalty. Pay extra, pay it all off, or get a construction loan that pays us off — zero penalty.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">4. What If the Lot Has Problems?</h3>
                    <p className="text-slate-700 mb-2">
                      Some sellers disappear after the sale. If you find out the lot isn't buildable, has title issues, or has unexpected problems, you're stuck.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                      <p className="text-green-800">
                        <strong>How we do it:</strong> Lot exchange guarantee. If there's a problem, you swap for another lot of the same size and price — no extra cost except the deed transfer fee. Even if prices have gone up.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">5. Credit-Score-Only Approval</h3>
                    <p className="text-slate-700 mb-2">
                      Some sellers approve anyone regardless of ability to pay — setting buyers up to fail. Others reject everyone below a certain score.
                    </p>
                    <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
                      <p className="text-green-800">
                        <strong>How we do it:</strong> Personal approval. We pull credit and review it, but we listen to your story. Life events happen. You'll only be disqualified if you have a pattern of not paying obligations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Terms Summary */}
        <section className="py-12 bg-amber-50 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Our Owner Financing Terms</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-amber-600">25%</p>
                  <p className="text-sm text-slate-600">Minimum Down</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-amber-600">35%</p>
                  <p className="text-sm text-slate-600">Deed Transfers</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-amber-600">$0</p>
                  <p className="text-sm text-slate-600">Prepayment Penalty</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-2xl font-bold text-amber-600">10%</p>
                  <p className="text-sm text-slate-600">Interest Rate</p>
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
                <Link to="/guide/septic-vs-sewer-palm-bay" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Septic vs Sewer</p>
                  <p className="text-sm text-slate-500">Utility cost comparison</p>
                </Link>
                <Link to="/price-guide" className="p-4 bg-slate-50 rounded-lg hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Price Calculator</p>
                  <p className="text-sm text-slate-500">Estimate your payments</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Talk Owner Financing?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Call today. I'll give you straight answers about terms, pricing, and what you can build — no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:3213337230" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
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

export default OwnerFinancingWatchGuide;
