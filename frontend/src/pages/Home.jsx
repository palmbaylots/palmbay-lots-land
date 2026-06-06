import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, Calculator, FileText, Phone, AlertCircle, DollarSign, X, ExternalLink } from 'lucide-react';
import { mockTestimonials, mockFeaturedProperties } from '../data/mockData';
import SocialShareButtons from '../components/SocialShareButtons';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { useToast } from '../hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { homepageSchemaGraph, todayISO } from '../data/businessSchema';
import FeaturedSpecialListing from '../components/FeaturedSpecialListing';

// Cash Deal Properties
const cashDealProperties = [
  {
    id: 1,
    address: "1980 Goodreau Avenue SW, Palm Bay, FL 32908",
    url: "https://www.flexmls.com/share/Dq4fB/1980-Goodreau-Avenue-SW-Palm-Bay-FL-32908"
  },
  {
    id: 2,
    address: "181 Dailey Street SE, Palm Bay, FL 32909",
    url: "https://www.flexmls.com/share/Dlbjz/181-Dailey-Street-SE-Palm-Bay-FL-32909",
    underContract: true
  },
  {
    id: 3,
    address: "2938 Wilkinson Avenue SE, Palm Bay, FL 32909",
    url: "https://www.flexmls.com/share/DlblI/2938-Wilkinson-Avenue-SE-Palm-Bay-FL-32909"
  },
  {
    id: 4,
    address: "2946 Wilkinson Avenue SE, Palm Bay, FL 32909",
    url: "https://www.flexmls.com/share/DlbzY/2946-Wilkinson-Avenue-SE-Palm-Bay-FL-32909"
  }
];

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// RealEstateAgent Schema for Homepage
const realEstateAgentSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Vahid Reza Rajabian",
  "description": "Broker Associate with 20+ years experience selling residential lots, commercial land, industrial parcels, and multifamily properties in Palm Bay and Brevard County, Florida. Affiliated with M. David Moallem, Inc. Specializing in owner financing and land sales.",
  "url": "https://palmbaylots-land.com",
  "telephone": "+1-321-333-7230",
  "email": "vahid@palmbayland.com",
  "image": "https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1663 Georgia Street NE, Suite 700",
    "addressLocality": "Palm Bay",
    "addressRegion": "FL",
    "postalCode": "32907",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "27.9689",
    "longitude": "-80.6625"
  },
  "areaServed": [
    { "@type": "City", "name": "Palm Bay", "containedInPlace": { "@type": "State", "name": "Florida" } },
    { "@type": "County", "name": "Brevard County" },
    { "@type": "County", "name": "Polk County" },
    { "@type": "County", "name": "Lake County" },
    { "@type": "County", "name": "Marion County" }
  ],
  "priceRange": "$41,000 - $5,000,000",
  "openingHours": "Mo-Fr 09:00-18:00",
  "sameAs": [],
  "knowsAbout": [
    "Palm Bay land sales",
    "Florida real estate",
    "Owner financing",
    "Residential lots",
    "Commercial land",
    "Industrial land",
    "Multifamily parcels",
    "Bulk lot assemblages",
    "Brevard County real estate"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "6",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Verified Client" },
      "reviewBody": "Mr. Rajabian was extremely professional and always available to answer any questions I had. His many years of experience in Palm Bay were evident — he knows the market exceptionally well."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Verified Client" },
      "reviewBody": "Vahid is phenomenal. He is accessible and extremely patient. My experience overall is top rated. Vahid is an absolute pleasure to work with."
    },
    {
      "@type": "Review",
      "reviewRating": { "@type": "Rating", "ratingValue": "5" },
      "author": { "@type": "Person", "name": "Verified Client" },
      "reviewBody": "Exceptional Customer Service and precise and detailed information offered. We purchased our lot the exact same day."
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Palm Bay Land Listings",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Lot Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Land Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Industrial Land Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Multifamily Parcel Sales" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bulk Lot Assemblages" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Owner Financing" } }
    ]
  }
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can I buy a lot in Palm Bay with owner financing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Owner financing is available on most of our residential lots. Minimum 25% down for an option contract, or 35% down to receive the deed immediately. No bank qualification required. No prepayment penalty."
      }
    },
    {
      "@type": "Question",
      "name": "What is the minimum lot size in Palm Bay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard residential lots in Palm Bay are approximately 10,000 sq ft (quarter acre). Larger parcels and assemblages are also available."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with national homebuilders?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We regularly work with large builders including DR Horton, Lennar, and Adams Homes, as well as regional and custom builders throughout Brevard County."
      }
    },
    {
      "@type": "Question",
      "name": "Are lots in Palm Bay buildable?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most lots we represent are buildable for single-family residential use. We provide zoning, parcel, and utility information for every listing. For a full parcel and zoning report on any Palm Bay lot, contact us directly."
      }
    },
    {
      "@type": "Question",
      "name": "Do you sell commercial or industrial land?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. In addition to residential lots, we handle commercial, industrial, multifamily, and institutional land throughout Brevard, Polk, Lake, and Marion counties."
      }
    },
    {
      "@type": "Question",
      "name": "How do I get started?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Call or text Vahid directly at 321-333-7230, or submit your lot criteria using the contact form. We'll match you with available inventory that fits your needs."
      }
    }
  ]
};

const Home = () => {
  const { toast } = useToast();
  const [showCashDeals, setShowCashDeals] = useState(false);
  const [heroForm, setHeroForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHeroFormChange = (e) => {
    setHeroForm({ ...heroForm, [e.target.name]: e.target.value });
  };

  const handleHeroFormSubmit = async (e) => {
    e.preventDefault();
    if (!heroForm.name || !heroForm.phone || !heroForm.email || !heroForm.interest) {
      toast({
        title: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contact`, {
        name: heroForm.name,
        email: heroForm.email,
        phone: heroForm.phone,
        inquiryType: heroForm.interest === 'build' ? 'buy' : 'buy',
        message: `Interest: ${heroForm.interest === 'build' ? 'Looking to build own home' : 'Looking to invest'}\n\nSubmitted from homepage hero form.`,
        smsConsent: true
      });
      
      toast({
        title: "Request Received!",
        description: "We'll contact you within 24 hours."
      });
      setHeroForm({ name: '', phone: '', email: '', interest: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please call 321-333-7230 directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Palm Bay Land for Sale | 500+ Lots | Owner Financing Available</title>
        <meta name="description" content="Residential lots starting at $41,000 in Palm Bay, FL. Owner financing available — 25% down, no bank required. Serving individuals, builders, and investors since 2003. Call 321-333-7230." />
        <meta name="keywords" content="lots for sale in Palm Bay Florida, Palm Bay FL land for sale, owner financing lots Palm Bay, residential lots Brevard County, buy land Palm Bay Florida, Palm Bay lots no HOA, bulk lots for sale Brevard County, commercial land Palm Bay FL, industrial land Palm Bay Florida, land for sale near Space Coast Florida, Palm Bay buildable lots, SW Palm Bay lots for sale, Palm Bay land broker, Brevard County lots owner financing" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/" />
        <meta property="og:title" content="Palm Bay Land for Sale | Owner Financing Available" />
        <meta property="og:description" content="Residential lots starting at $41,000 in Palm Bay, FL. Owner financing available. Serving buyers, builders, and investors since 2003." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://palmbaylots-land.com/" />
        <meta property="og:image" content="https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png" />
        {/* Organization + LocalBusiness + RealEstateAgent schema graph */}
        <script type="application/ld+json">{JSON.stringify({
          ...homepageSchemaGraph(),
          dateModified: todayISO()
        })}</script>
        {/* Keep legacy RealEstateAgent + FAQ schemas */}
        <script type="application/ld+json">{JSON.stringify({...realEstateAgentSchema, dateModified: todayISO()})}</script>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      
      <main id="main-content">
      <div className="min-h-screen">
      
      {/* URGENCY BANNER */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-3">
        <div className="container mx-auto px-4">
          <a
            href="https://www.facebook.com/share/v/1Gi2aTJqkS/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 flex-wrap hover:opacity-90 transition-opacity cursor-pointer"
            data-testid="property-tax-banner"
          >
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span>Florida House Votes to Eliminate Homestead Property Taxes — Senate and Voters Still Must Approve. Lock In Your Lot Before Prices Rise.</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </a>
        </div>
      </section>
      
      {/* CASH DEALS BANNER */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-2.5">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setShowCashDeals(true)}
            className="w-full text-center text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            data-testid="cash-deals-banner"
          >
            <DollarSign className="w-5 h-5" />
            <span>💰 CASH BUYER DISCOUNTS — Click to See Special Pricing on Select Lots</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Cash Deals Modal */}
      {showCashDeals && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCashDeals(false)}>
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowCashDeals(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="close-cash-deals-modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Cash Buyer Specials</h2>
              <p className="text-slate-600 mt-2">These lots are priced to sell fast. Cash buyers only — no financing on these deals.</p>
            </div>
            
            <div className="space-y-3">
              {cashDealProperties.map((property) => (
                <a
                  key={property.id}
                  href={property.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all group ${
                    property.underContract 
                      ? 'bg-red-50 border-red-200 opacity-75' 
                      : 'bg-slate-50 hover:bg-green-50 border-slate-200 hover:border-green-300'
                  }`}
                  data-testid={`cash-deal-${property.id}`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 flex-shrink-0 ${property.underContract ? 'text-red-500' : 'text-green-600'}`} />
                    <span className="text-slate-800 font-medium text-sm">{property.address}</span>
                    {property.underContract && (
                      <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase">Under Contract</span>
                    )}
                  </div>
                  <ExternalLink className={`w-4 h-4 flex-shrink-0 ${property.underContract ? 'text-red-400' : 'text-slate-400 group-hover:text-green-600'}`} />
                </a>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-500 mb-3">Interested? Call for cash pricing:</p>
              <a 
                href="tel:3213337230" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
              >
                <Phone className="w-5 h-5" />
                321-333-7230
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        {/* Background Image with lighter overlay so the picture is clearly visible */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85" 
            alt="Florida single-family home with palm trees and driveway"
            className="w-full h-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
          {/* Softer left-to-right gradient — readable text on left, visible image on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left - Headline & CTA */}
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Own Land in Florida's Fastest-Growing City — <span className="text-amber-400">Residential Lots Starting at $41,000</span> with Owner Financing
              </h1>
              <p className="text-lg text-gray-200 mb-6">
                Whether you're buying your first residential lot, building a new home, purchasing an existing home, developing a subdivision, investing in commercial or industrial land, or acquiring lots at scale — we have the inventory and the expertise to get the deal done. Thousands of transactions completed with individuals, builders, and investors since 2003.
              </p>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-6">
                <Link 
                  to="/contact" 
                  className="px-8 py-4 bg-amber-500 text-white rounded-lg text-lg font-bold hover:bg-amber-600 transition-colors shadow-xl"
                >
                  Get a Free Land Value Assessment
                </Link>
                <Link
                  to="/inventory"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-amber-400 text-white rounded-lg text-lg font-bold hover:bg-white/20 transition-all"
                  data-testid="hero-inventory-link"
                >
                  Browse Our Palm Bay Lot Inventory
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 text-gray-200">
                <a href="tel:3213337230" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">321-333-7230</span>
                </a>
                <span className="hidden sm:block text-gray-500">|</span>
                <span className="text-amber-400 font-semibold">Thousands of lots sold since 2003</span>
              </div>
            </div>
            
            {/* Right - Lead Capture Form */}
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Get Your Free Lot Info</h3>
              <p className="text-slate-600 text-sm mb-5 text-center">We'll send you available lots and pricing</p>
              
              <form onSubmit={handleHeroFormSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    value={heroForm.name}
                    onChange={handleHeroFormChange}
                    placeholder="Your Name"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    value={heroForm.phone}
                    onChange={handleHeroFormChange}
                    placeholder="Phone Number"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    value={heroForm.email}
                    onChange={handleHeroFormChange}
                    placeholder="Email Address"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <select
                    name="interest"
                    value={heroForm.interest}
                    onChange={handleHeroFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Are you looking to...</option>
                    <option value="build">Build your own home</option>
                    <option value="invest">Invest in land</option>
                  </select>
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-bold"
                >
                  {isSubmitting ? 'Sending...' : 'Send Me Lot Info'}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  No obligation. Response within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Special Listing — 1039 Hooper Ave NE */}
      <FeaturedSpecialListing />

      {/* Property Types Banner */}
      <section className="bg-slate-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-white font-semibold text-sm md:text-base">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Residential Lots
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Commercial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Industrial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Multifamily
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
              Owner Financing Available
            </span>
          </div>
        </div>
      </section>

      {/* Second CTA - Request Parcel & Zoning Report */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Need Zoning & Parcel Details?</h2>
            <p className="text-gray-300 mb-6">
              Get a detailed report with zoning classification, permitted uses, setbacks, flood zone status, and comparable sales data for any Palm Bay parcel.
            </p>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Request Full Parcel & Zoning Report
            </Link>
            <p className="text-amber-400 text-sm mt-3">Delivered within 24 hours</p>
          </div>
        </div>
      </section>

      {/* Palm Bay Market Overview */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Palm Bay, Florida — One of the Southeast's Best Land Markets</h2>
            <p className="text-lg text-slate-600">
              Palm Bay is <a href="https://www.bcpao.us/" target="_blank" rel="noopener noreferrer" className="underline decoration-amber-500 underline-offset-2 hover:text-amber-700">Brevard County's</a> largest city, with over 130,000 residents and rapid population growth fueled by <a href="https://www.spacecoastedc.org/" target="_blank" rel="noopener noreferrer" className="underline decoration-amber-500 underline-offset-2 hover:text-amber-700">Space Coast employers</a> including L3Harris Technologies, Blue Origin, and NASA's Kennedy Space Center. As development pushes south and west, land values in Palm Bay continue to rise — making now an ideal time to buy.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-bold text-slate-900">I-95 & US-1</p>
              <p className="text-sm text-slate-600">Proximity</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-bold text-slate-900">Saint Johns Pkwy</p>
              <p className="text-sm text-slate-600">Major Expansion</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-bold text-slate-900">National Builders</p>
              <p className="text-sm text-slate-600">Strong Demand</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-bold text-slate-900">No State Tax</p>
              <p className="text-sm text-slate-600">Income Tax Free</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="font-bold text-slate-900">Space Coast</p>
              <p className="text-sm text-slate-600">Beaches & Attractions</p>
            </div>
          </div>
        </div>
      </section>

      {/* We Serve Every Type of Buyer */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">We Serve Every Type of Buyer</h2>
            <p className="text-lg text-slate-600">Whether you're looking for a single lot or a package of 300+</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Individual Homebuyers & Families</h3>
              <p className="text-slate-600">
                Find an affordable residential lot in Palm Bay with owner financing. No need for a bank — we make it easy to own your piece of Florida. Lots available in established neighborhoods throughout Port Malabar and SW Palm Bay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Small & Custom Builders</h3>
              <p className="text-slate-600">
                We work directly with local builders to identify buildable lots that match your project specs — zoning, utilities, access, and lot size all verified. Skip the MLS and work with a broker who knows the inventory.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-3">National & Regional Homebuilders</h3>
              <p className="text-slate-600">
                We have existing relationships with DR Horton, Lennar, Adams Homes, and other major builders. We can assemble packages of residential lots tailored to your acquisition criteria — quickly and off-market.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Investors & Hedge Funds</h3>
              <p className="text-slate-600">
                Bulk lot acquisitions available. We have experience structuring large transactions and can facilitate deals from single parcels to packages of 100 to 300+ lots. Ideal for land banking, spec development, or long-term appreciation plays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lots & Land for Every Purpose */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Lots & Land for Every Purpose</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Residential Lots</h3>
              <p className="text-slate-600 text-sm">Single-family buildable lots throughout Palm Bay and Brevard County. Many with owner financing available.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Commercial Land</h3>
              <p className="text-slate-600 text-sm">Strategically located parcels zoned for retail, office, and mixed use.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-slate-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Industrial Land</h3>
              <p className="text-slate-600 text-sm">IU-zoned parcels near major transportation corridors.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multifamily Parcels</h3>
              <p className="text-slate-600 text-sm">Zoned for duplexes, townhomes, and apartment development.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Bulk Lot Packages</h3>
              <p className="text-slate-600 text-sm">Assemblages of 10 to 300+ lots for builders and institutional buyers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Owner Financing</h3>
              <p className="text-slate-600 text-sm">Flexible owner financing on most residential lots — no traditional bank approval needed. No prepayment penalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Vahid with Photo */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <img 
                  src="https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png" 
                  alt="Vahid Reza Rajabian - Palm Bay Real Estate Broker Associate"
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">20+ Years in the Palm Bay Land Market</h2>
                <h3 className="text-xl text-slate-600 mb-4">Vahid Rajabian — Broker Associate at M. David Moallem, Inc.</h3>
                <p className="text-amber-600 font-semibold mb-4">Thousands of transactions since 2003 — from single lots to bulk packages for national builders and institutional investors</p>
                <p className="text-slate-700 mb-3">
                  Vahid Rajabian is a licensed Florida Real Estate Broker Associate with over two decades of experience in Palm Bay lots and land. Since 2003, he has facilitated thousands of transactions — from single lots sold to first-time buyers to bulk packages acquired by national builders and institutional investors.
                </p>
                <div className="mb-4">
                  <p className="font-semibold text-slate-900 mb-2">Specialties:</p>
                  <div className="grid grid-cols-2 gap-1 text-sm text-slate-700">
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Residential lots in Brevard County</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Commercial, industrial & multifamily</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Bulk lot assemblages for builders</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Owner-financed land sales</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Off-market & direct transactions</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> M. David Moallem, Inc. — 35+ years</span>
                  </div>
                </div>
                <Link 
                  to="/about" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Learn More About Me
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* "Add as a preferred source on Google" badge */}
                <div className="flex justify-center mt-6">
                  <a
                    href="https://www.google.com/preferences/source?q=https://palmbaylots-land.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Add palmbaylots-land.com as a preferred source on Google"
                    className="inline-block transition-opacity hover:opacity-90 focus:opacity-90"
                    data-testid="google-preferred-source-badge"
                  >
                    <svg
                      width="243"
                      height="63"
                      viewBox="0 0 243 63"
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-hidden="true"
                    >
                      <rect x="0" y="0" width="243" height="63" rx="10.8" ry="10.8" fill="#000000" stroke="#333" strokeWidth="1" />
                      <g transform="translate(13.5, 15.3) scale(1.35)">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                      </g>
                      <g style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '16.2px', fontWeight: 'bold', fontStyle: 'italic', fill: '#FFFFFF' }}>
                        <text x="58.5" y="28.8">Add as a preferred</text>
                        <text x="58.5" y="48.6">source on Google</text>
                      </g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Properties</h2>
              <p className="text-lg text-slate-600">Explore our current available lots and properties</p>
            </div>
            <Link 
              to="/price-guide" 
              className="hidden md:flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockFeaturedProperties.map((property, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                <div className="h-48 overflow-hidden grid grid-cols-2">
                  <img 
                    src={property.houseImage} 
                    alt={`${property.name} - House Example`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  <img 
                    src={property.lotImage} 
                    alt={`${property.name} - Lot`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{property.name}</h3>
                  <p className="text-2xl font-bold text-amber-600 mb-4">{property.price}</p>
                  <div className="space-y-2 mb-4">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link 
                    to="/price-guide" 
                    className="block w-full py-2 text-center bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/price-guide" 
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors"
            >
              View All Properties
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Where We Operate */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Where We Operate</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Palm Bay, FL</p>
              <p className="text-xs text-amber-600">Primary Market</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Brevard County</p>
              <p className="text-xs text-slate-500">FL</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Polk County</p>
              <p className="text-xs text-slate-500">FL</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Lake County</p>
              <p className="text-xs text-slate-500">FL</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Marion County</p>
              <p className="text-xs text-slate-500">FL</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
              <p className="font-bold text-slate-900">Out-of-State</p>
              <p className="text-xs text-slate-500">Commercial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">What Clients Say</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-slate-600 font-medium ml-1">5.0 — 6 Verified Reviews</span>
            </div>
            <a 
              href="https://www.ratemyagent.com/real-estate-agent/vahid-rajabian-b14sqj/sales/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all reviews on RateMyAgent
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {testimonial.source && (
                    <span className="text-xs text-slate-400">{testimonial.source}</span>
                  )}
                </div>
                <p className="text-slate-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-600">{testimonial.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Can I buy a lot in Palm Bay with owner financing?</h3>
                <p className="text-slate-600">Yes. Owner financing is available on most of our residential lots. Minimum 25% down for an option contract, or 35% down to receive the deed immediately. No bank qualification required. No prepayment penalty.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">What is the minimum lot size in Palm Bay?</h3>
                <p className="text-slate-600">Standard residential lots in Palm Bay are approximately 10,000 sq ft (quarter acre). Larger parcels and assemblages are also available.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Do you work with national homebuilders?</h3>
                <p className="text-slate-600">Yes. We regularly work with large builders including DR Horton, Lennar, and Adams Homes, as well as regional and custom builders throughout Brevard County.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Are lots in Palm Bay buildable?</h3>
                <p className="text-slate-600">Most lots we represent are buildable for single-family residential use. We provide zoning, parcel, and utility information for every listing. For a full parcel and zoning report on any Palm Bay lot, <Link to="/contact" className="text-amber-600 hover:underline">contact us directly</Link>.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">Do you sell commercial or industrial land?</h3>
                <p className="text-slate-600">Yes. In addition to residential lots, we handle commercial, industrial, multifamily, and institutional land throughout Brevard, Polk, Lake, and Marion counties.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">How do I get started?</h3>
                <p className="text-slate-600">Call or text Vahid directly at <a href="tel:3213337230" className="text-amber-600 hover:underline font-medium">321-333-7230</a>, or <Link to="/contact" className="text-amber-600 hover:underline font-medium">submit your lot criteria</Link> using the contact form. We'll match you with available inventory that fits your needs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Talk to Expert */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Talk to a Palm Bay Land Expert?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or just exploring options — get straight answers from someone who knows Palm Bay land inside and out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:3213337230" 
              className="px-10 py-5 bg-amber-500 text-white rounded-lg text-xl font-bold hover:bg-amber-600 transition-colors shadow-lg"
            >
              Talk to a Palm Bay Land Expert
            </a>
          </div>
          <p className="text-gray-400 mt-4">Or call directly: 321-333-7230</p>
        </div>
      </section>

      {/* Social Media Share */}
      <SocialShareButtons />
    </div>
    </main>
    </>
  );
};

export default Home;
