import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, CheckCircle, Users, FileText, DollarSign, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LOT_IMAGE = `${BACKEND_URL}/api/images/e5db63c2-54e4-4bfe-90ee-dd27d5096d23`;
const WHOLESALER_IMAGE = `${BACKEND_URL}/api/images/e36f5fb6-4ec2-453b-96f1-d82aaff171b6`;

const SellLand = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyAddress: '',
    propertySize: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        inquiryType: 'sell',
        message: `SELLER INQUIRY\n\nProperty Address: ${formData.propertyAddress}\nProperty Size: ${formData.propertySize}\n\nAdditional Info: ${formData.message}`,
        smsConsent: true,
      });
      if (response.data.success) {
        toast({
          title: 'Request Received!',
          description: "I'll review your property and get back to you within 24 hours.",
        });
        setFormData({ name: '', email: '', phone: '', propertyAddress: '', propertySize: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send request. Please call 321-333-7230 directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sell Your Lot or Land in Palm Bay FL | Free Land Value Assessment</title>
        <meta
          name="description"
          content="Get a free honest land value assessment for your Palm Bay lot. No obligation. Protection against wholesaler tactics. Call 321-333-7230."
        />
        <meta name="keywords" content="sell land Palm Bay Florida, sell my lot Palm Bay FL, land value assessment Palm Bay, sell vacant lot Brevard County, Palm Bay land broker, wholesaler warning land Palm Bay, lot value Palm Bay Florida, sell land without realtor Palm Bay" />
        <link rel="canonical" href="https://palmbaylots-land.com/sell-land" />
        <meta property="og:title" content="Sell Your Land in Palm Bay, FL — Free Land Value Assessment" />
        <meta property="og:description" content="Honest Palm Bay land value assessment from a broker with 20+ years in the market. No pressure, no wholesaler games." />
        <meta property="og:url" content="https://palmbaylots-land.com/sell-land" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Palm Bay Land Value Assessment',
          description: 'Free, honest market value assessment for residential, commercial, and investment land in Palm Bay and Brevard County, Florida.',
          serviceType: 'Real Estate Land Valuation',
          provider: {
            '@type': 'RealEstateAgent',
            name: 'Vahid Reza Rajabian',
            telephone: '321-333-7230',
            email: 'vahid@palmbayland.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1663 Georgia St NE Suite 700',
              addressLocality: 'Palm Bay',
              addressRegion: 'FL',
              postalCode: '32907',
              addressCountry: 'US'
            }
          },
          areaServed: [
            { '@type': 'City', name: 'Palm Bay' },
            { '@type': 'AdministrativeArea', name: 'Brevard County, FL' }
          ],
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free no-obligation land value assessment'
          },
          url: 'https://palmbaylots-land.com/sell-land',
          dateModified: new Date().toISOString().split('T')[0]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 mb-4" data-testid="sell-land-h1">
                Own Land in Palm Bay?
              </h1>
              <p className="text-xl md:text-2xl text-white font-medium mb-4">
                Before you list, you should know this:
              </p>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Most owners don't know what their land is really worth — or who will actually buy it.
                I provide straight answers, not automated guesses.
              </p>

              <a
                href="#get-value"
                className="inline-flex items-center gap-2 px-10 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors shadow-lg"
                data-testid="hero-cta-btn"
              >
                Get a Free Land Value Assessment
              </a>

              <p className="text-sm text-gray-500 mt-5">
                No obligation. No pressure. Just straight answers.
              </p>
            </div>
          </div>
        </section>

        {/* Lot image + "Why land sits unsold" */}
        <section className="py-14 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  The Three Problems Most Palm Bay Land Sellers Face
                </h2>
                <p className="text-slate-600 mb-6">
                  If your lot has been sitting without serious offers, or you keep getting lowball calls from investors,
                  there's usually a reason. It's almost always one of three things — and they're all fixable once you know
                  what you're working with.
                </p>
              </div>
              <div className="order-1 lg:order-2">
                <img
                  src={LOT_IMAGE}
                  alt="Vacant residential lot for sale in a Palm Bay, FL neighborhood with new-construction homes on both sides"
                  className="w-full h-auto rounded-2xl shadow-xl border border-slate-200"
                  loading="lazy"
                  decoding="async"
                  data-testid="sell-land-lot-image"
                />
                <p className="text-xs text-slate-500 mt-2 text-center italic">
                  A typical Palm Bay residential lot — the kind owners contact me about every week.
                </p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Overpriced Listings</h3>
                <p className="text-sm text-slate-600">
                  Zillow estimates and tax values don't reflect what buyers actually pay for land. Land sits for years because it was never priced for the real market.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Wrong Buyers</h3>
                <p className="text-sm text-slate-600">
                  Generic marketing attracts tire-kickers. Real buyers — builders, investors — need targeted outreach. That's who I work with every day.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Unknown Potential</h3>
                <p className="text-sm text-slate-600">
                  Owners don't know their zoning, utility access, or what can actually be built. Buyers do. That information gap costs sellers money.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What I Provide Section */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                What I Provide — Free, No Obligation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Real Market Value</h3>
                    <p className="text-sm text-slate-600">
                      Based on actual comparable sales and current buyer demand — not automated estimates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Zoning & Development Review</h3>
                    <p className="text-sm text-slate-600">
                      I'll tell you what can actually be built on your land and what buyers will pay for that potential.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Utility & Access Assessment</h3>
                    <p className="text-sm text-slate-600">
                      Water, sewer, road access — these determine value. I'll tell you exactly where you stand.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Buyer Demand Insight</h3>
                    <p className="text-sm text-slate-600">
                      I work with active builders, national homebuilders, and institutional investors. I know who's buying and what they're looking for right now.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wholesaler Warning Section */}
        <section className="py-16 bg-red-50 border-y-4 border-red-200" data-testid="wholesaler-warning-section">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 uppercase tracking-wider mb-1">Warning</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Wholesalers and Land Flippers Are Targeting Palm Bay Owners
                  </h2>
                </div>
              </div>

              <p className="text-slate-700 italic mb-6 border-l-4 border-red-400 pl-4">
                If you've received unsolicited texts, emails, letters, or phone calls offering to buy your Palm Bay lot —
                read this before you respond.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
                <div>
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    Over the past several years, a growing number of wholesalers and land flippers have been aggressively targeting
                    vacant lot owners throughout Palm Bay and Brevard County. Many of these owners are <strong>out of state or out
                    of the country</strong> and simply don't know the local market. That's exactly who these operators target.
                  </p>
                  <p className="text-slate-700 mb-4 leading-relaxed">
                    <strong>Here's how it typically works:</strong> a wholesaler contacts you — usually by text, email, a
                    handwritten-looking letter, or a phone call — and makes an offer on your lot. The offer sounds reasonable
                    because you don't have a basis for comparison. They send a contract quickly and ask you to sign.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    What you may not realize is that the contract is designed to protect <em>them</em>, not you.
                  </p>
                </div>
                <div>
                  <img
                    src={WHOLESALER_IMAGE}
                    alt="Older couple reviewing a suspicious real estate contract at a kitchen table, looking worried and confused"
                    className="w-full h-auto rounded-2xl shadow-xl border-4 border-red-100"
                    loading="lazy"
                    decoding="async"
                    data-testid="wholesaler-warning-image"
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center italic">
                    Don't sign anything until you've had someone local review it.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-red-300 rounded-xl p-6 md:p-8 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Red Flags to Watch For in Their Contract
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-2xl leading-none">🚩</span>
                    <div>
                      <p className="font-semibold text-slate-900">The contract has an assignment clause</p>
                      <p className="text-sm text-slate-600">
                        This means they can sell your contract to a third party without your approval. They're not buying your lot. They're buying the right to find someone else to buy it.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl leading-none">🚩</span>
                    <div>
                      <p className="font-semibold text-slate-900">The contract allows them to market the property</p>
                      <p className="text-sm text-slate-600">
                        A clause stating they can market or advertise your property during the contract period means they're using your lot to find their own buyer — while you're locked up and can't sell to anyone else.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl leading-none">🚩</span>
                    <div>
                      <p className="font-semibold text-slate-900">Long contingency or inspection periods</p>
                      <p className="text-sm text-slate-600">
                        30, 45, or 60-day periods with broad cancellation rights mean they can tie up your lot, shop it around, and cancel if they don't find a buyer. You get nothing except lost time and a lot that's back on the market.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl leading-none">🚩</span>
                    <div>
                      <p className="font-semibold text-slate-900">No earnest money or a nominal deposit</p>
                      <p className="text-sm text-slate-600">
                        A real buyer puts meaningful money down. A $10 or $100 deposit on a $40,000 lot is not a serious buyer.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-2xl leading-none">🚩</span>
                    <div>
                      <p className="font-semibold text-slate-900">The price is well below market</p>
                      <p className="text-sm text-slate-600">
                        Wholesalers need to buy low enough to resell at a profit. If they're offering you $15,000 on a lot worth $35,000, that gap is their profit margin — not a reflection of your lot's actual value.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 mb-8">
                <h3 className="text-lg font-bold text-amber-400 mb-4">Two outcomes happen with wholesaler contracts:</h3>
                <ol className="space-y-3 text-gray-200 list-decimal list-inside">
                  <li>They find a buyer — and your lot sells far below what it was actually worth.</li>
                  <li>They don't find a buyer — and they cancel, leaving your lot back on the market after weeks or months of being tied up.</li>
                </ol>
                <p className="mt-5 text-amber-300 font-semibold">
                  Either way, you lose. You either sold too cheap or wasted valuable time.
                </p>
              </div>

              <div className="bg-white border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  What to do if you receive one of these offers
                </h3>
                <p className="text-slate-700 mb-4">
                  Before signing anything, get an independent assessment of what your lot is actually worth in today's Palm Bay market. It costs you nothing and takes 24 hours. Then you can make an informed decision.
                </p>
                <a
                  href="#get-value"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
                  data-testid="wholesaler-cta-btn"
                >
                  → Request Your Free Land Value Assessment
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Me Section */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6">Why Work With Me?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">20+ years selling Palm Bay land exclusively</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Active relationships with builders and institutional investors</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">I tell you what you can actually sell for — not what you want to hear</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">No pressure, no games, no wasted time</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Licensed Florida Real Estate Broker Associate — accountable to the state</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">I represent your interests, not a buyer I'm trying to flip your lot to</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who's Actually Buying */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 text-center">
                Who's Actually Buying Palm Bay Lots Right Now?
              </h2>
              <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
                Understanding the real buyer pool helps you price and market correctly:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">National Homebuilders</h3>
                  <p className="text-sm text-slate-600">
                    DR Horton, Lennar, Adams Homes, and others are actively acquiring lots in Palm Bay for new home construction. They buy in volume and move quickly when the price and location are right.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Local & Regional Builders</h3>
                  <p className="text-sm text-slate-600">
                    Smaller builders looking for 1–10 lots at a time for spec home construction. Very active in SW and NW Palm Bay.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Individual Buyers</h3>
                  <p className="text-sm text-slate-600">
                    Families planning to build their primary residence, often using owner financing. Steady demand year-round.
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-2">Investors & Hedge Funds</h3>
                  <p className="text-sm text-slate-600">
                    Institutional buyers acquiring lots in bulk for land banking and future development. These buyers move fast but require the right inventory and pricing.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 text-center mt-8 max-w-3xl mx-auto">
                Knowing which buyer type your lot appeals to — and how to reach them — is the difference between selling in
                30 days and sitting on the market for 2 years.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="get-value" className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Get Your Free Land Value Assessment
                </h2>
                <p className="text-slate-600">
                  Tell me about your property. I'll review it and get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8" data-testid="sell-land-form">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Your Name *</label>
                    <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full" data-testid="name-input" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                    <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="(321) 555-0123" className="w-full" data-testid="phone-input" />
                  </div>
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full" data-testid="email-input" />
                </div>

                <div className="mb-5">
                  <label htmlFor="propertyAddress" className="block text-sm font-medium text-slate-700 mb-2">Property Address *</label>
                  <Input id="propertyAddress" name="propertyAddress" type="text" required value={formData.propertyAddress} onChange={handleChange} placeholder="123 Main St, Palm Bay, FL 32907" className="w-full" data-testid="address-input" />
                </div>

                <div className="mb-5">
                  <label htmlFor="propertySize" className="block text-sm font-medium text-slate-700 mb-2">Approximate Size (acres or sq ft)</label>
                  <Input id="propertySize" name="propertySize" type="text" value={formData.propertySize} onChange={handleChange} placeholder="e.g., 0.25 acres, 10,000 sq ft" className="w-full" data-testid="size-input" />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Anything Else I Should Know?</label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="How long have you owned it? Any known issues? What's your timeline?" rows={3} className="w-full" data-testid="message-input" />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold"
                  data-testid="submit-btn"
                >
                  {isSubmitting ? 'Sending...' : 'Get My Free Land Value'}
                </Button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  No obligation. I'll personally review your property and respond within 24 hours.
                </p>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-600 mb-3">Prefer to talk?</p>
                <a
                  href="tel:3213337230"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  321-333-7230
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Footer */}
        <section className="py-8 bg-white border-t">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-600 mb-2"><strong>Vahid Rajabian</strong> · Broker Associate</p>
            <p className="text-sm text-slate-500">M. David Moallem, Inc. · Serving Palm Bay since 2003</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default SellLand;
