import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle, FileText, Building2, Car, Droplets, DollarSign } from 'lucide-react';

const FlagshipListing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>328 Malabar Rd Palm Bay FL | 1.75 AC Commercial Corner | $1,575,000</title>
        <meta name="description" content="Prime 1.75-acre commercial corner at 328 Malabar Rd, Palm Bay FL. Signalized intersection, 23K daily traffic, 475 ft frontage. Ideal for QSR, medical, retail, mixed-use." />
        <link rel="canonical" href="https://palmbaylots-land.com/listing/328-malabar-rd" />
        <meta property="og:title" content="328 Malabar Rd Palm Bay FL | 1.75 AC Commercial Corner" />
        <meta property="og:description" content="Prime 1.75-acre commercial corner with 475 ft frontage on Malabar Road. $1,575,000." />
        <meta property="og:url" content="https://palmbaylots-land.com/listing/328-malabar-rd" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="h-[400px] md:h-[500px] relative">
          <img
            src="https://images.crexi.com/assets/1154695/ae46c0ccf60e4fb58b52ed52e99ebacd_716x444.jpg"
            alt="328 Malabar Rd - Aerial View"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container mx-auto">
              {/* Primary Tag */}
              <div className="mb-4">
                <span className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded uppercase tracking-wide">
                  Signalized Corner · Zoned Commercial
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                328 Malabar Rd
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">
                Palm Bay, Florida
              </p>
              <p className="text-3xl md:text-4xl font-bold text-amber-400">
                $1,575,000
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Headline */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Signalized Corner Commercial Redevelopment Site
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed">
                Prime commercial redevelopment opportunity located on one of Palm Bay's main east–west corridors with strong traffic counts and long-term growth fundamentals.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mt-4">
                This ±1.75-acre signalized corner site offers approximately 475 feet of frontage on Malabar Road and is positioned for high-visibility commercial, medical, or mixed-use development.
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
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Zoned Commercial</p>
                    <p className="text-sm text-slate-600">Ready for development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">~23,000 VPD</p>
                    <p className="text-sm text-slate-600">Strong daily traffic counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Signalized Corner</p>
                    <p className="text-sm text-slate-600">High-visibility intersection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Water & Sewer</p>
                    <p className="text-sm text-slate-600">Utilities available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">±1.75 Acres</p>
                    <p className="text-sm text-slate-600">Potential assemblage available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Existing Income</p>
                    <p className="text-sm text-slate-600">3 structures offset holding costs</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-slate-700">
                  <strong>~475' of frontage</strong> on Malabar Road
                </p>
              </div>
            </div>

            {/* Development Potential */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Development Potential</h3>
              <p className="text-slate-700 mb-4">
                The site supports a wide range of commercial uses, including but not limited to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Quick-service or fast-casual restaurant
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Retail strip or neighborhood center
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Medical / professional office
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Mixed-use redevelopment
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  Owner-user or investor repositioning
                </li>
              </ul>
              <p className="text-slate-700 mt-4">
                Flat topography, utility availability, and corner access make this site well-suited for near-term development.
              </p>
            </div>

            {/* Location Overview */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Location Overview</h3>
              <p className="text-slate-700">
                Malabar Road is one of Palm Bay's primary commercial arteries, connecting dense residential neighborhoods with major employment, retail, and institutional uses. The area continues to see steady population growth and increased commercial demand.
              </p>
            </div>

            {/* Why This Site Works */}
            <div className="mb-10 bg-slate-900 text-white rounded-xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-amber-400 mb-4">Why This Site Works</h3>
              <p className="text-gray-300 mb-4">
                This is not raw land speculation.<br />
                This is a corner redevelopment play with:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Zoning in place</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Utilities available</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Income during entitlement and planning</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span>Visibility that supports real commercial users</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - CTA Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* CTA Card */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Request Full Parcel & Zoning Report
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Includes zoning confirmation, allowable uses, frontage details, and development considerations.
                </p>
                <Link
                  to="/contact"
                  className="block w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-lg font-bold transition-colors mb-4"
                >
                  Request Report
                </Link>
                <a
                  href="tel:3213337230"
                  className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg font-bold transition-colors"
                >
                  <Phone className="w-4 h-4 inline mr-2" />
                  321-333-7230
                </a>
              </div>

              {/* Broker Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Listed By
                </h4>
                <div className="mb-4">
                  <p className="text-lg font-bold text-slate-900">Vahid Rajabian</p>
                  <p className="text-slate-600">Broker Associate</p>
                  <p className="text-sm text-slate-500">M. David Moallem, Inc.</p>
                </div>
                <div className="space-y-3 text-sm">
                  <a 
                    href="tel:3213337230" 
                    className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    321-333-7230
                  </a>
                  <a 
                    href="mailto:vahid@palmbayland.com" 
                    className="flex items-center gap-2 text-slate-700 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    vahid@palmbayland.com
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Serving Palm Bay since 2003
                  </p>
                </div>
              </div>

              {/* Property Summary */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6">
                <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3">
                  Quick Facts
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Price</span>
                    <span className="font-semibold text-slate-900">$1,575,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Size</span>
                    <span className="font-semibold text-slate-900">±1.75 Acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Frontage</span>
                    <span className="font-semibold text-slate-900">~475 ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Traffic</span>
                    <span className="font-semibold text-slate-900">~23,000 VPD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Zoning</span>
                    <span className="font-semibold text-slate-900">Commercial</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Utilities</span>
                    <span className="font-semibold text-slate-900">Water & Sewer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Listings */}
      <section className="py-8 bg-slate-100 border-t">
        <div className="container mx-auto px-4 text-center">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
          >
            ← Back to All Listings
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FlagshipListing;
