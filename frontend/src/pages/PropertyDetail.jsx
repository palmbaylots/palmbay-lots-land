import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Ruler, Home, FileText, CheckCircle, ArrowLeft, Droplets, Building2, TrendingUp, HelpCircle, BookOpen } from 'lucide-react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Unit utility classification
const WATER_SEWER_UNITS = ['5', '7', '8', '9', '38'];
const WATER_ONLY_UNITS = ['10', '11', '12', '16', '21', '28', '31', '42', '44', '46', '48', '50'];

const getUtilityInfo = (unit) => {
  if (WATER_SEWER_UNITS.includes(unit)) return { type: 'city water and city sewer', label: 'City Water & Sewer', cost: 'No well or septic needed', color: 'blue', extra: '$0 for water/sewer' };
  if (WATER_ONLY_UNITS.includes(unit)) return { type: 'city water (septic system required)', label: 'City Water Only', cost: 'Septic ~$8,000-$15,000', color: 'cyan', extra: '$8K-$15K for septic' };
  return { type: 'well and septic', label: 'Well & Septic', cost: 'Well ~$5K-$10K + Septic ~$8K-$15K', color: 'amber', extra: '$13K-$25K for well & septic' };
};

const getQuadrant = (address) => {
  if (!address) return 'Palm Bay';
  const addr = address.toUpperCase();
  if (addr.includes(' NE')) return 'NE';
  if (addr.includes(' NW')) return 'NW';
  if (addr.includes(' SE')) return 'SE';
  if (addr.includes(' SW')) return 'SW';
  return '';
};

const getAreaDetails = (quadrant) => {
  const areas = {
    'NE': {
      name: 'Northeast Palm Bay',
      desc: 'Established area close to Melbourne, US-1 corridor, and the Indian River. Good infrastructure with proximity to shopping, restaurants, and Melbourne International Airport.',
      nearby: 'Melbourne, Palm Bay Regional Park, Turkey Creek Sanctuary',
      character: 'Established residential with mature landscaping. Close to city amenities.'
    },
    'NW': {
      name: 'Northwest Palm Bay',
      desc: 'Growing residential corridor with access to Malabar Road and I-95. Active new development and expanding infrastructure.',
      nearby: 'I-95 access, Malabar Road corridor, Palm Bay City Hall',
      character: 'Active development zone. Newer construction and improving road access.'
    },
    'SE': {
      name: 'Southeast Palm Bay',
      desc: 'One of the most active building areas in Palm Bay. Strong new construction activity, good appreciation trends, and growing community.',
      nearby: 'Babcock Street corridor, Palm Bay parks, Space Coast beaches (15 min)',
      character: 'High building activity. Popular with builders and new homeowners.'
    },
    'SW': {
      name: 'Southwest Palm Bay',
      desc: 'Affordable land with room to grow. The city is expanding westward with new infrastructure. Best value per square foot in Palm Bay.',
      nearby: 'Expanding infrastructure, larger lot availability, future development zones',
      character: 'Best value. Larger lots available. Growing infrastructure.'
    }
  };
  return areas[quadrant] || {
    name: 'Palm Bay, FL',
    desc: 'Brevard County\'s largest city by area on Florida\'s Space Coast. Near Kennedy Space Center, SpaceX, Blue Origin, and Atlantic beaches.',
    nearby: 'Kennedy Space Center, Melbourne, Space Coast beaches',
    character: 'Florida\'s Space Coast — growing employment and population.'
  };
};

// Generate unique use case based on lot characteristics
const getUseCases = (property, utility, acresNum, sqft) => {
  const cases = [];
  
  if (utility.color === 'blue') {
    cases.push({ title: 'Build Your Home', desc: 'City water and sewer means the lowest development costs. No well or septic to install — just connect to municipal lines and build.' });
  } else if (utility.color === 'cyan') {
    cases.push({ title: 'Build Your Home', desc: 'City water is available — just install septic. Saves $5K-$10K compared to lots needing both well and septic.' });
  } else {
    cases.push({ title: 'Build Affordably', desc: 'Most affordable lots in Palm Bay. Well and septic installation adds $13K-$25K but lot prices are significantly lower.' });
  }
  
  cases.push({ title: 'Invest & Hold', desc: `No HOA. Taxes ~$300-500/year. Palm Bay land has been appreciating as the Space Coast grows. Low holding cost while values increase.` });
  
  cases.push({ title: 'Owner Finance & Resell', desc: 'Buy with our financing (25% down), then resell with your own seller financing at a markup. Create monthly income while building equity.' });
  
  if (acresNum >= 0.3) {
    cases.push({ title: 'Spec Home Build', desc: `At ${sqft.toLocaleString()} sq ft, this lot fits a generous floor plan. Build a spec home at $125-150/sqft and sell in a growing market.` });
  }
  
  return cases;
};

// Generate FAQ specific to this property
const generatePropertyFaq = (property, utility, acresNum, sqft, quadrant, area) => {
  const faqs = [];
  
  faqs.push({
    q: `Can I build a house at ${property.title}?`,
    a: `Yes. This ${acresNum.toFixed(2)}-acre lot (${sqft.toLocaleString()} sq ft) is a verified buildable residential parcel in ${property.city}. It can accommodate a typical 1,500-2,500 sq ft single-family home with garage and yard. A local builder charges $125-150/sqft total cost including all permits.`
  });
  
  if (property.unit) {
    faqs.push({
      q: `What utilities are available at this lot in Unit ${property.unit}?`,
      a: `This lot has ${utility.type}. ${utility.cost}. ${utility.color === 'blue' ? 'Connect directly to city water and sewer lines — no well or septic needed.' : utility.color === 'cyan' ? 'City water is available. You will need to install a septic system ($8,000-$15,000).' : 'You will need to install both a well ($5,000-$10,000) and septic system ($8,000-$15,000).'}`
    });
  }
  
  faqs.push({
    q: `Is owner financing available for this lot?`,
    a: `Yes. 25% minimum down for an option contract ($${Math.round(parseFloat(property.price.replace(/[^0-9.]/g, '') || 41000) * 0.25).toLocaleString()} on this lot). Deed transfers at 35% paid. No bank qualification required. No prepayment penalty.`
  });
  
  faqs.push({
    q: `Are there HOA fees on this Palm Bay lot?`,
    a: `No. There are no HOA fees. Property taxes average $300-500 per year for residential lots in Palm Bay. Florida has no state income tax.`
  });
  
  if (quadrant) {
    faqs.push({
      q: `What is the ${area.name} area like?`,
      a: `${area.desc} Nearby: ${area.nearby}.`
    });
  }
  
  faqs.push({
    q: `What happens if there's a problem with this lot?`,
    a: `You're protected with our lot exchange guarantee. If there's a buildability issue, you can swap for another lot of the same size and price — no extra cost except the deed transfer fee, even if market values have increased.`
  });
  
  return faqs;
};

// Get related guides based on property characteristics
const getRelatedGuides = (utility) => {
  const guides = [
    { path: '/guide/build-on-land-palm-bay', title: 'Can You Build on Land in Palm Bay?', desc: 'Zoning, permits & building costs' },
    { path: '/guide/owner-financing-what-to-watch', title: 'Owner Financing: What to Watch', desc: '25% down, deed at 35%, no hidden fees' },
  ];
  
  if (utility.color !== 'blue') {
    guides.splice(1, 0, { path: '/guide/septic-vs-sewer-palm-bay', title: 'Septic vs Sewer Explained', desc: 'Cost comparison by unit' });
  }
  
  guides.push({ path: '/guide/flood-zones-palm-bay', title: 'Flood Zones in Palm Bay', desc: 'What to know before buying' });
  
  return guides;
};

const PropertyDetail = () => {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${API}/properties`);
        const properties = response.data;
        
        const found = properties.find(p => {
          const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          return p.id === slug || titleSlug === slug || p.inventoryId === slug;
        });
        
        if (found) {
          setProperty(found);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Property Not Found</h1>
          <Link to="/inventory" className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700">
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  const unit = property.unit || '';
  const utility = getUtilityInfo(unit);
  const quadrant = getQuadrant(property.address || property.title);
  const area = getAreaDetails(quadrant);
  const acresNum = parseFloat((property.acres || '0.25').match(/[\d.]+/)?.[0] || 0.25);
  const sqft = Math.round(acresNum * 43560);
  const useCases = getUseCases(property, utility, acresNum, sqft);
  const faqs = generatePropertyFaq(property, utility, acresNum, sqft, quadrant, area);
  const relatedGuides = getRelatedGuides(utility);
  const unitBlockInfo = unit ? `Unit ${unit}${property.block ? `, Block ${property.block}` : ''}${property.lot ? `, Lot ${property.lot}` : ''}` : '';

  const pageTitle = `${property.title}, ${property.city} | ${property.acres} Lot${unit ? ` | ${utility.label}` : ''}`;
  const pageDescription = `${property.acres} buildable lot at ${property.title}, ${property.city}. ${utility.label}. ${unit ? `Unit ${unit}. ` : ''}Owner financing: 25% down, no bank needed. Call Vahid 321-333-7230.`;
  const canonicalUrl = `https://palmbaylots-land.com/property/${slug}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": pageDescription,
    "url": canonicalUrl,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city.replace(', FL', ''),
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "offers": {
      "@type": "Offer",
      "price": property.price.replace(/[^0-9]/g, '') || "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Lot Size", "value": property.acres },
      { "@type": "PropertyValue", "name": "Utilities", "value": utility.label },
      ...(unit ? [{ "@type": "PropertyValue", "name": "Unit", "value": unit }] : [])
    ],
    "broker": {
      "@type": "RealEstateAgent",
      "name": "Vahid Reza Rajabian",
      "telephone": "+1-321-333-7230"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-slate-500 hover:text-amber-600">Home</Link>
              <span className="text-slate-400">/</span>
              <Link to="/inventory" className="text-slate-500 hover:text-amber-600">Inventory</Link>
              <span className="text-slate-400">/</span>
              <span className="text-slate-900 font-medium">{property.title}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Link to="/inventory" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Inventory
              </Link>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src={property.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'} 
                    alt={`${property.title} - ${property.acres} buildable lot in ${property.city}`}
                    className="w-full h-80 object-cover"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                  />
                  {unit && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold text-white ${
                      utility.color === 'blue' ? 'bg-blue-600' : utility.color === 'cyan' ? 'bg-cyan-600' : 'bg-amber-600'
                    }`}>
                      {utility.label}
                    </div>
                  )}
                </div>

                <div>
                  {unitBlockInfo && (
                    <p className="text-gray-400 text-sm mb-1 font-mono">{unitBlockInfo}</p>
                  )}
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
                  <p className="text-xl text-gray-300 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {property.city}{quadrant ? ` (${quadrant})` : ''}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-slate-700 px-4 py-2 rounded-lg">
                      <p className="text-gray-400 text-sm">Price</p>
                      <p className="text-2xl font-bold text-amber-400">{property.price}</p>
                    </div>
                    <div className="bg-slate-700 px-4 py-2 rounded-lg">
                      <p className="text-gray-400 text-sm">Size</p>
                      <p className="text-2xl font-bold text-white">{property.acres}</p>
                    </div>
                    <div className="bg-slate-700 px-4 py-2 rounded-lg">
                      <p className="text-gray-400 text-sm">Utilities</p>
                      <p className="text-lg font-bold text-white">{utility.label}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="tel:3213337230" className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                      <Phone className="w-5 h-5" />
                      Call 321-333-7230
                    </a>
                    <Link to="/contact" className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                      <FileText className="w-5 h-5" />
                      Request Info
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Overview</h2>
                  <p className="text-slate-700 leading-relaxed">
                    This {acresNum.toFixed(2)}-acre buildable lot at {property.title} is located in {area.name}{unitBlockInfo ? ` (${unitBlockInfo})` : ''}. The lot offers {sqft.toLocaleString()} square feet of usable land with {utility.type}. Owner financing available — 25% minimum down, no bank qualification required.
                  </p>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-amber-600" />
                    {area.name}
                  </h2>
                  <p className="text-slate-700 leading-relaxed mb-3">{area.desc}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs">Nearby</p>
                      <p className="text-slate-800 font-medium">{area.nearby}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-slate-500 text-xs">Area Character</p>
                      <p className="text-slate-800 font-medium">{area.character}</p>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Droplets className="w-6 h-6 text-blue-600" />
                    Utilities & Infrastructure
                  </h2>
                  {unit ? (
                    <div>
                      <div className={`p-4 rounded-lg mb-4 ${
                        utility.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                        utility.color === 'cyan' ? 'bg-cyan-50 border border-cyan-200' :
                        'bg-amber-50 border border-amber-200'
                      }`}>
                        <p className="font-bold text-slate-900">{utility.label} — Unit {unit}</p>
                        <p className="text-sm text-slate-700 mt-1">{utility.cost}</p>
                      </div>
                      <p className="text-slate-700 text-sm">
                        {utility.color === 'blue' ? 'City water and sewer means the lowest development costs. Connect directly to municipal lines — no drilling a well or installing septic.' :
                         utility.color === 'cyan' ? 'City water is available — no well needed. You install septic through Brevard County Health Department.' :
                         'This area requires well and septic. Both are common and reliable throughout Palm Bay. Installed during construction.'}
                      </p>
                      <Link to="/guide/septic-vs-sewer-palm-bay" className="inline-block mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium">
                        See full utility guide by unit →
                      </Link>
                    </div>
                  ) : (
                    <p className="text-slate-700">Contact us for utility details for this parcel.</p>
                  )}
                </div>

                {/* What You Could Do With This Lot */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-green-600" />
                    What You Could Do With This Lot
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {useCases.map((uc, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                        <p className="font-bold text-slate-900 mb-1">{uc.title}</p>
                        <p className="text-sm text-slate-600">{uc.desc}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/guide/build-on-land-palm-bay" className="inline-block mt-4 text-amber-600 hover:text-amber-700 text-sm font-medium">
                    Read: Can You Build on Land in Palm Bay? →
                  </Link>
                </div>

                {/* Owner Financing */}
                <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                    Owner Financing Available
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-4">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">25%</p>
                      <p className="text-xs text-slate-600">Min Down</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">35%</p>
                      <p className="text-xs text-slate-600">Deed Transfers</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">$0</p>
                      <p className="text-xs text-slate-600">Prepay Penalty</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xl font-bold text-amber-600">10%</p>
                      <p className="text-xs text-slate-600">Interest</p>
                    </div>
                  </div>
                  <p className="text-slate-700 text-sm">
                    No bank qualification. We do personal approval — we look at you as an individual, not just a credit score. No hidden fees. Lot exchange guarantee if there's an issue.
                  </p>
                  <Link to="/guide/owner-financing-what-to-watch" className="inline-block mt-3 text-amber-600 hover:text-amber-700 text-sm font-medium">
                    Read: Owner Financing — What to Watch Out For →
                  </Link>
                </div>

                {/* Property Details Grid */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">Address</p>
                      <p className="font-semibold text-slate-900">{property.address || property.title}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">City</p>
                      <p className="font-semibold text-slate-900">{property.city}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">Lot Size</p>
                      <p className="font-semibold text-slate-900">{property.acres} ({sqft.toLocaleString()} sqft)</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">Utilities</p>
                      <p className="font-semibold text-slate-900">{utility.label}</p>
                    </div>
                    {unit && (
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-slate-500 text-sm">Unit / Block</p>
                        <p className="font-semibold text-slate-900">{unitBlockInfo}</p>
                      </div>
                    )}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">HOA</p>
                      <p className="font-semibold text-slate-900">None</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">Est. Taxes</p>
                      <p className="font-semibold text-slate-900">$300-500/yr</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">Zoning</p>
                      <p className="font-semibold text-slate-900">RS-2 Residential</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-500 text-sm">State Income Tax</p>
                      <p className="font-semibold text-green-700">None (FL)</p>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    Questions About This Lot
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-slate-100 pb-4 last:border-0">
                        <h3 className="font-bold text-slate-900 mb-1 text-sm">{faq.q}</h3>
                        <p className="text-slate-600 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Guides */}
                <div className="bg-slate-100 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    Related Guides
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relatedGuides.map((guide, idx) => (
                      <Link key={idx} to={guide.path} className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow">
                        <p className="font-bold text-slate-900 text-sm">{guide.title}</p>
                        <p className="text-xs text-slate-500">{guide.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-md sticky top-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Interested in this lot?</h3>
                  <p className="text-slate-600 mb-6 text-sm">Contact Vahid for zoning details, utility verification, and financing terms.</p>
                  <div className="space-y-3">
                    <a href="tel:3213337230" className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors">
                      <Phone className="w-5 h-5" />
                      321-333-7230
                    </a>
                    <Link to="/contact" className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-lg font-bold hover:bg-slate-900 hover:text-white transition-colors">
                      Request Parcel Report
                    </Link>
                  </div>
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-slate-500 mb-1">Broker Associate</p>
                    <p className="font-bold text-slate-900">Vahid Reza Rajabian</p>
                    <p className="text-slate-600 text-sm">M. David Moallem, Inc.</p>
                    <p className="text-slate-600 text-sm">License #BK3454072</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make This Lot Yours?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Call today for a free consultation. I'll answer your questions about zoning, utilities, and building potential — no pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:3213337230" className="px-8 py-4 bg-amber-500 text-white rounded-lg text-lg font-bold hover:bg-amber-600 transition-colors">
                Call Now: 321-333-7230
              </a>
              <Link to="/inventory" className="px-8 py-4 bg-white text-slate-900 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors">
                Browse More Lots
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PropertyDetail;
