import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Award, Users, TrendingUp, Phone, Building2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <>
    <Helmet>
      <title>About Vahid Reza Rajabian | Palm Bay Real Estate Broker Since 2003</title>
      <meta name="description" content="Vahid Reza Rajabian — Florida licensed broker associate specializing in Palm Bay land and lots since 2003. Commercial, multifamily, residential, and new construction." />
      <link rel="canonical" href="https://palmbaylots-land.com/about" />
      <meta property="og:title" content="About Vahid Reza Rajabian | Palm Bay Real Estate Broker" />
      <meta property="og:description" content="Florida licensed broker associate specializing in Palm Bay land since 2003." />
      <meta property="og:url" content="https://palmbaylots-land.com/about" />
      <meta property="og:type" content="website" />
    </Helmet>
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1661793275924-0fada016a273?auto=format,compress&fit=crop&w=1920&q=80" 
            alt="Palm Bay Florida coastal landscape"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/60"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              About Vahid Reza Rajabian
            </h1>
            <p className="text-xl text-amber-400 font-semibold">
              Palm Bay Real Estate Specialist Since 2003 — Commercial, Multifamily, Industrial, Residential Lots, New Construction & Existing Homes
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-50 p-8 rounded-lg mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Experience That Covers Every Side of Palm Bay Real Estate</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  I've been working in Palm Bay real estate since 2003. Over the years, I've had the opportunity to work across nearly every property type — commercial, residential, new construction, investment, and vacant land — which gives me a well-rounded view of this market and how it moves.
                </p>
                <p>
                  Through Palm Bay Land, we own and offer over <strong>2,200 lots with owner financing available</strong>, making land ownership more accessible for everyday buyers without the hassle of traditional bank financing.
                </p>
                <p>
                  I work with a wide range of clients — first-time buyers, seasoned investors, builders, and landowners — and my approach is always the same: honest guidance, straightforward information, and a smooth transaction from start to finish.
                </p>
                <p>
                  If you're looking to buy land, sell a property, or simply explore your options in Palm Bay or Brevard County, I'd be glad to help.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">20+</div>
                <p className="text-slate-700 font-medium">Years Experience</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">2,200+</div>
                <p className="text-slate-700 font-medium">Lots Available</p>
              </div>
              <div className="text-center p-6 bg-amber-50 rounded-lg">
                <div className="text-4xl font-bold text-amber-600 mb-2">100%</div>
                <p className="text-slate-700 font-medium">Client Satisfaction</p>
              </div>
            </div>

            {/* Specializations */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Areas of Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Commercial & Industrial Properties</h3>
                    <p className="text-slate-600">
                      Sales and acquisitions of commercial land, industrial sites, and income-producing properties throughout Palm Bay and surrounding areas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Layers className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Multifamily & Development Sites</h3>
                    <p className="text-slate-600">
                      Land and properties suitable for multifamily development, redevelopment, and long-term investment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Residential Lots</h3>
                    <p className="text-slate-600">
                      Extensive experience selling residential lots to individuals, builders, and hedge funds. Expert knowledge of lot values, utilities, and buildability.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">New Construction</h3>
                    <p className="text-slate-600">
                      Specializing in new build homes, working closely with builders and homebuyers to create custom living spaces.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Existing Home Sales</h3>
                    <p className="text-slate-600">
                      Helping families find their perfect home in Palm Bay's established neighborhoods. Comprehensive market analysis and negotiation expertise.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white border-2 border-slate-200 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Investment Properties</h3>
                    <p className="text-slate-600">
                      Working with hedge funds and individual investors to identify high-potential properties with strong market insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-slate-900 text-white p-8 rounded-lg mb-12">
              <h2 className="text-2xl font-bold mb-6">Professional Credentials</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Florida Licensed Broker Associate</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>License #BK3454072</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>M. David Moallem, Inc.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>20+ Years in Palm Bay Real Estate</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400" />
                  <span>Specializing in Palm Bay land and development since 2003</span>
                </div>
              </div>
            </div>

            {/* Why Palm Bay */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Palm Bay?</h2>
              <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-8 rounded-lg">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Palm Bay is one of Florida's fastest-growing real estate markets. Located in east central Florida with access to rivers and the ocean, the area attracts families, retirees, and investors who recognize its value and potential.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Understanding zoning, development trends, and long-term growth patterns is critical here. Having worked this market since 2003, I provide the insights that help clients make informed decisions — whether buying, selling, or developing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Buying, selling, or developing property in Palm Bay? From commercial and multifamily to residential lots, new builds, and existing homes — get straight answers from someone who knows the market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Contact Me
            </Link>
            <a 
              href="tel:3213337230" 
              className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              321-333-7230
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default About;
