import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CheckCircle, Calculator, ArrowRight, HelpCircle, Shield, Clock, BadgeCheck, Banknote } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const OwnerFinancingLand = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API}/properties`);
        setProperties(response.data.slice(0, 8));
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
    "serviceType": "Owner Financing for Land Purchase",
    "name": "Owner Financing Land in Florida",
    "description": "Buy land in Palm Bay, Florida with owner financing. No bank qualification required. 25% minimum down payment, flexible monthly terms, and fast closing. 500+ lots available.",
    "url": "https://palmbaylots-land.com/owner-financing-land-florida",
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
      "priceRange": "$32,000 - $500,000",
      "priceCurrency": "USD"
    },
    "termsOfService": "25% minimum down for option contract, 35% for immediate deed transfer, no prepayment penalty"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does owner financing work for land in Florida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Owner financing means you buy land directly from the seller without a bank. You pay a minimum 25% down for an option contract. Once you've paid 35% of the total purchase price, the deed transfers to your name. You continue making monthly payments until the lot is paid off. No prepayment penalty — pay it off early anytime."
        }
      },
      {
        "@type": "Question",
        "name": "What is the minimum down payment for owner financed land?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Minimum 25% down for an option contract. If you put 35% down, you receive the deed immediately. For a $41,000 lot, that's $10,250 minimum down. No bank qualification required."
        }
      },
      {
        "@type": "Question",
        "name": "When do I get the deed with owner financing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The deed transfers to your name once you've paid 35% of the total purchase price (down payment + monthly payments combined). Many other sellers keep the deed for the entire loan term — we don't. With minimum payments, this typically takes about a year."
        }
      },
      {
        "@type": "Question",
        "name": "Can I build on the land before it's paid off?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once you receive the deed (at 35% paid), you can start improvements — clearing the lot, applying for permits, and building. If you're getting a construction loan, the loan will pay us off. Just send us a payoff request with the closing date and we'll furnish a payoff statement. No prepayment penalty."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need good credit to buy land with owner financing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We do a personal approval — we look at you as an individual, not just a credit score. We pull credit and review it, but we listen to life events that may have caused past issues. You'll only be disqualified if you have a habit of not paying your obligations."
        }
      },
      {
        "@type": "Question",
        "name": "Are there any hidden fees with owner financing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All fees are disclosed in advance. At closing, the buyer is responsible for their portion of the closing costs, which is normal procedure in real estate transactions. There are no hidden fees, no prepayment penalties."
        }
      },
      {
        "@type": "Question",
        "name": "What if there's a problem with my lot after I buy it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You're protected. If there's an issue with buildability or something unexpected, you can exchange it for another lot of the same size and price category — no extra cost except the deed transfer fee. If you choose a different category or larger lot, you pay the difference."
        }
      },
      {
        "@type": "Question",
        "name": "Can I pay off my lot early?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. There are no prepayment penalties. You can pay extra toward principal any time, pay off the balance in full, or continue with regular payments. Many buyers accelerate payments once they're ready to build."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Owner Financing Land Florida | No Bank Qualification | Palm Bay Lots</title>
        <meta name="description" content="Buy land in Florida with owner financing. No bank qualification required. 25% minimum down payment, deed transfers at 35% paid. 500+ lots in Palm Bay. Fast closing in 2-3 weeks." />
        <meta name="keywords" content="owner financing land Florida, land contract Florida, seller financing vacant land, no bank land purchase, Palm Bay owner financing, buy land no credit check" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/owner-financing-land-florida" />
        <meta property="og:title" content="Owner Financing Land Florida | No Bank Needed" />
        <meta property="og:description" content="Buy Florida land with owner financing. No bank needed. Low down payments, flexible terms. 500+ lots available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://palmbaylots-land.com/owner-financing-land-florida" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero - H1 */}
        <section className="bg-gradient-to-br from-green-900 via-green-800 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-green-600 rounded-full text-sm font-bold mb-6">
                NO BANK QUALIFICATION NEEDED
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Owner Financing Land in <span className="text-amber-400">Florida</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Skip the banks and buy your dream lot directly from us. We offer <strong>owner financing on Florida land</strong> with low down payments, affordable monthly terms, and a simple closing process. Over 500 <strong>buildable lots in Palm Bay</strong> qualify for our flexible financing program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/listings"
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors"
                >
                  See Available Lots
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

        {/* H2: Owner Financing Land in Florida */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Owner Financing Land in Florida
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                <strong>Owner financing</strong> (also called seller financing or land contract) is the simplest way to buy land when traditional bank financing isn't available or desirable. Instead of applying for a mortgage, you make payments directly to us — the property owner. This arrangement eliminates banks, lengthy approval processes, and strict credit requirements that prevent many people from achieving their dream of land ownership.
              </p>

              <p className="text-lg text-slate-700 mb-6">
                For buyers looking at <strong>vacant land in Palm Bay</strong>, owner financing is particularly valuable. Banks often hesitate to finance raw land, requiring large down payments (25-50%) and short repayment terms. Our <strong>owner financing program</strong> requires a minimum of 25% down for an option contract. Once you've paid 35% of the total price, the deed transfers to your name — and you continue making payments until the lot is paid off. No prepayment penalty.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                The beauty of <strong>seller financing for land</strong> is its accessibility. Whether you have perfect credit, imperfect credit, or are self-employed with non-traditional income documentation, we can work with you. If you can afford the monthly payments, you qualify. It's that simple.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <p className="text-slate-800 font-medium">
                  <strong>Key Benefit:</strong> With owner financing, you can start building equity in Florida real estate today — without waiting months for bank approval or meeting strict lending requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* H2: How Owner Financing Works */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 text-center">
                How Owner Financing Works
              </h2>
              <p className="text-lg text-slate-600 mb-12 text-center">
                Our <strong>land contract process</strong> is straightforward. Here's exactly what happens when you buy <strong>owner financed land in Florida</strong>:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-amber-600">1</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Choose Your Lot</h3>
                  <p className="text-slate-600">Browse our inventory of 500+ <strong>buildable lots in Palm Bay</strong>. Use our filters to find lots matching your size, location, and budget preferences. Every lot we offer is verified buildable.</p>
                </div>
                <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-amber-600">2</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Pay Down Payment</h3>
                  <p className="text-slate-600">Put down a minimum of 25% of the purchase price. You'll receive an option contract securing your lot. Or put down 35% and receive the deed immediately.</p>
                </div>
                <div className="text-center bg-white p-6 rounded-xl shadow-sm">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-amber-600">3</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Make Monthly Payments</h3>
                  <p className="text-slate-600">Make affordable monthly payments until you reach 35% of the purchase price. At that point, title transfers to you and you continue payments until paid in full.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-bold text-slate-900 mb-4 text-center">Typical Owner Financing Terms</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-amber-600">10-20%</p>
                    <p className="text-sm text-slate-600">Down Payment</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-600">10%</p>
                    <p className="text-sm text-slate-600">Interest Rate (APR)</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-600">10 Years</p>
                    <p className="text-sm text-slate-600">Max Term</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-600">$0</p>
                    <p className="text-sm text-slate-600">Prepayment Penalty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* H2: Benefits of Owner Financing */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Benefits of Owner Financing for Land
              </h2>
              
              <p className="text-lg text-slate-700 mb-8">
                Why do thousands of buyers choose <strong>owner financed land</strong> over traditional bank financing? The advantages are substantial — especially for vacant land purchases where banks impose the strictest requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">No Credit Check Required</h3>
                    <p className="text-slate-600">Your credit score doesn't determine your eligibility. Whether you have excellent credit, recovering credit, or limited credit history, we evaluate your ability to make payments — not your FICO score.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <Banknote className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Low Down Payment</h3>
                    <p className="text-slate-600">Start with just 10-20% down — far less than the 25-50% banks require for raw land. This makes <strong>Florida land ownership</strong> accessible to more buyers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <Clock className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Fast Closing (2-3 Weeks)</h3>
                    <p className="text-slate-600">Skip the 45-60 day bank timeline. With owner financing, you can close in as little as 2-3 weeks. Get your lot secured before someone else does.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <BadgeCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Flexible Terms</h3>
                    <p className="text-slate-600">We work with you to structure payments that fit your budget. Need a longer term for lower payments? Want to pay extra when possible? We accommodate your situation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">No Hidden Fees</h3>
                    <p className="text-slate-600">Simple, transparent pricing. No origination fees, application fees, or surprise closing costs. What you see is what you pay.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Build Equity Immediately</h3>
                    <p className="text-slate-600">Every payment builds equity in your land investment. You're not paying rent — you're working toward full ownership of a tangible asset.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Calculation */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                Example Monthly Payment Calculator
              </h2>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl p-8">
                <div className="text-center mb-8">
                  <p className="text-slate-600 mb-2">For a $45,000 lot with 15% down ($6,750)</p>
                  <p className="text-5xl font-bold text-amber-600">~$350/month</p>
                  <p className="text-slate-500 mt-2">for 120 months (10 years) at 10% APR</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">$45,000</p>
                    <p className="text-sm text-slate-500">Lot Price</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">$6,750</p>
                    <p className="text-sm text-slate-500">Down (15%)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">$38,250</p>
                    <p className="text-sm text-slate-500">Amount Financed</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">~$350</p>
                    <p className="text-sm text-slate-500">Monthly Payment</p>
                  </div>
                </div>
              </div>
              
              <p className="text-center text-slate-500 mt-4 text-sm">
                *Example only. Actual terms vary by property and down payment amount. Contact us for exact quotes on specific lots.
              </p>

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

        {/* H2: Who Qualifies for Owner Financing */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Who Qualifies for Owner Financing?
              </h2>
              
              <p className="text-lg text-slate-700 mb-6">
                Unlike traditional lenders who use rigid qualification criteria, our <strong>owner financing program</strong> focuses on one simple question: Can you afford the monthly payments? If yes, you qualify. We've helped thousands of buyers who couldn't get bank financing become landowners in Florida.
              </p>

              <p className="text-lg text-slate-700 mb-8">
                <strong>Owner financing is ideal for:</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Self-employed individuals with non-traditional income</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Buyers rebuilding credit after financial setbacks</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">New immigrants without U.S. credit history</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Retirees on fixed income</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">First-time land buyers without large savings</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-slate-700">Investors seeking quick, hassle-free transactions</span>
                </div>
              </div>

              <p className="text-slate-600">
                Even buyers with excellent credit choose owner financing for the speed and simplicity. Why wait 60 days for bank approval when you can close in 2-3 weeks?
              </p>
            </div>
          </div>
        </section>

        {/* Available Lots */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Lots Available with Owner Financing
              </h2>
              <p className="text-lg text-slate-600">
                All these properties qualify for our <strong>owner financing program</strong>
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {properties.map((prop) => {
                  const slug = prop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                  return (
                    <Link 
                      key={prop.id} 
                      to={`/property/${slug}`}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-36 overflow-hidden">
                        <img 
                          src={prop.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop'} 
                          alt={`${prop.title} - Owner financing available`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-4">
                        <div className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded mb-2">
                          FINANCING AVAILABLE
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1 text-sm">{prop.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-600">{prop.price}</span>
                          <span className="text-xs text-slate-500">{prop.acres}</span>
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
                View All 500+ Lots
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* H2: FAQs */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
                FAQs About Owner Financing Land in Florida
              </h2>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    When do I get the deed to the property?
                  </h3>
                  <p className="text-slate-600">You receive the deed when you've paid 35% of the total purchase price (down payment + monthly payments). Until then, you hold an option contract that secures your right to the property. Once titled, you continue making payments until paid in full.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Can I pay off my lot early?
                  </h3>
                  <p className="text-slate-600">Absolutely! There are no prepayment penalties. You can pay extra toward principal any time, pay off the balance in full, or continue with regular payments. Many buyers accelerate payments once they're ready to build.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Can I build on the land before it's paid off?
                  </h3>
                  <p className="text-slate-600">Yes, once you receive the deed (at 35% paid), you can build on the property while continuing to make payments. Many buyers use this approach to start construction while still financing the land.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    What happens if I miss a payment?
                  </h3>
                  <p className="text-slate-600">Life happens, and we understand. Contact us immediately if you're having difficulty. We offer grace periods and can often work out arrangements. However, consistent non-payment may result in contract default and loss of payments made.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Is owner financing available on all lots?
                  </h3>
                  <p className="text-slate-600">Yes, owner financing is available on all residential lots in our inventory. Commercial properties and larger parcels may have different terms — contact us to discuss specific properties.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl">
                  <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    Do I need a lawyer to close?
                  </h3>
                  <p className="text-slate-600">No lawyer is required for our standard owner financing contracts. We provide all documentation and handle the process. However, you're welcome to have an attorney review documents if desired.</p>
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
                <Link to="/buildable-lots-palm-bay" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Buildable Lots</p>
                  <p className="text-sm text-slate-500">100% guaranteed</p>
                </Link>
                <Link to="/quarter-acre-lots-palm-bay" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Quarter Acre Lots</p>
                  <p className="text-sm text-slate-500">Perfect home size</p>
                </Link>
                <Link to="/price-guide" className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
                  <p className="font-bold text-slate-900">Price Calculator</p>
                  <p className="text-sm text-slate-500">Estimate payments</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started with Owner Financing?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Call today to discuss your financing options. With 20+ years of experience, I'll help you find a lot and payment plan that works for your budget and goals.
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

export default OwnerFinancingLand;
