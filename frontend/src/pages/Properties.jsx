import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Phone, Mail, MapPin, Filter, X, Calculator, ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState('all');
  const [filterUtilities, setFilterUtilities] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [showFinancing, setShowFinancing] = useState(false);
  const [calcLotSize, setCalcLotSize] = useState(10000);
  const [calcUnit, setCalcUnit] = useState('49');
  const [calcCanal, setCalcCanal] = useState(false);
  const [acreInput, setAcreInput] = useState('');

  const units = [
    { unit: '49', price: 4.10, water: false, sewer: false, name: 'Unit 49' },
    { unit: '15', price: 4.50, water: false, sewer: false, name: 'Unit 15' },
    { unit: '17', price: 4.50, water: false, sewer: false, name: 'Unit 17' },
    { unit: '18', price: 4.50, water: false, sewer: false, name: 'Unit 18' },
    { unit: '19', price: 4.50, water: false, sewer: false, name: 'Unit 19' },
    { unit: '20', price: 4.50, water: false, sewer: false, name: 'Unit 20' },
    { unit: '22', price: 4.50, water: false, sewer: false, name: 'Unit 22' },
    { unit: '23', price: 4.50, water: false, sewer: false, name: 'Unit 23' },
    { unit: '24', price: 4.50, water: false, sewer: false, name: 'Unit 24' },
    { unit: '25', price: 4.50, water: false, sewer: false, name: 'Unit 25' },
    { unit: '30', price: 4.50, water: false, sewer: false, name: 'Unit 30' },
    { unit: '32', price: 4.50, water: false, sewer: false, name: 'Unit 32' },
    { unit: '36', price: 4.50, water: false, sewer: false, name: 'Unit 36' },
    { unit: '37', price: 4.50, water: false, sewer: false, name: 'Unit 37' },
    // Units with $5.20/sqft base (NO city water)
    { unit: '13', price: 5.20, water: false, sewer: false, name: 'Unit 13' },
    { unit: '14', price: 5.20, water: false, sewer: false, name: 'Unit 14' },
    { unit: '26', price: 5.20, water: false, sewer: false, name: 'Unit 26' },
    { unit: '39', price: 5.20, water: false, sewer: false, name: 'Unit 39' },
    { unit: '41', price: 5.20, water: false, sewer: false, name: 'Unit 41' },
    // Units with $5.20/sqft base + city water (+$20,000)
    { unit: '42', price: 5.20, water: true, sewer: false, name: 'Unit 42' },
    { unit: '44', price: 5.20, water: true, sewer: false, name: 'Unit 44' },
    { unit: '50', price: 5.20, water: true, sewer: false, name: 'Unit 50' },
    { unit: '48', price: 5.20, water: true, sewer: false, name: 'Unit 48' },
    // Units with water AND sewer
    { unit: '5', price: 5.20, water: true, sewer: true, name: 'Unit 5' },
    { unit: '7', price: 5.20, water: true, sewer: true, name: 'Unit 7' },
    { unit: '8', price: 5.20, water: true, sewer: true, name: 'Unit 8' },
    { unit: '9', price: 5.20, water: true, sewer: true, name: 'Unit 9' },
    { unit: '38', price: 5.20, water: true, sewer: true, name: 'Unit 38' },
    // Units with city water only (10, 11, 12, 16, 21, 28, 31, 46)
    { unit: '10', price: 4.50, water: true, sewer: false, name: 'Unit 10' },
    { unit: '11', price: 4.50, water: true, sewer: false, name: 'Unit 11' },
    { unit: '12', price: 4.50, water: true, sewer: false, name: 'Unit 12' },
    { unit: '16', price: 4.50, water: true, sewer: false, name: 'Unit 16' },
    { unit: '21', price: 4.50, water: true, sewer: false, name: 'Unit 21' },
    { unit: '28', price: 4.50, water: true, sewer: false, name: 'Unit 28' },
    { unit: '31', price: 4.50, water: true, sewer: false, name: 'Unit 31' },
    { unit: '46', price: 4.50, water: true, sewer: false, name: 'Unit 46' },
    { unit: '40', price: 450000, water: true, sewer: true, name: 'Unit 40 (Commercial)', isCommercial: true },
  ];

  const calculatePrice = (unit, lotSize, isCanal, block = '') => {
    // Properties with letter blocks (B, K, F, etc.) are excluded from standard pricing
    if (block && /^[A-Za-z]/.test(block)) return -1;
    
    const unitData = units.find(u => u.unit === unit);
    if (!unitData) return 0;
    if (unitData.isCommercial) return unitData.price;
    
    let basePrice = 0;
    const baseSqFt = Math.min(lotSize, 10000);
    basePrice = baseSqFt * unitData.price;
    
    if (lotSize > 10000) {
      const extraSqFt = lotSize - 10000;
      basePrice += extraSqFt * 3.00;
    }
    
    if (unitData.water && !unitData.sewer) basePrice += 20000;
    if (unitData.water && unitData.sewer) basePrice += 40000;
    if (isCanal) basePrice += 5000;
    
    return basePrice;
  };

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase()) || unit.unit.includes(searchTerm);
      const estimatedPrice = calculatePrice(unit.unit, 10000, false);
      const matchesPrice = filterPrice === 'all' || 
                          (filterPrice === 'under50k' && estimatedPrice < 50000) ||
                          (filterPrice === '50k-75k' && estimatedPrice >= 50000 && estimatedPrice < 75000) ||
                          (filterPrice === 'over75k' && estimatedPrice >= 75000);
      const matchesUtilities = filterUtilities === 'all' || (filterUtilities === 'water' && unit.water) || (filterUtilities === 'both' && unit.water && unit.sewer);
      return matchesSearch && matchesPrice && matchesUtilities;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterPrice, filterUtilities]);

  const calculatedPrice = useMemo(() => {
    return calculatePrice(calcUnit, calcLotSize, calcCanal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcUnit, calcLotSize, calcCanal]);

  if (showFinancing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-lg">
          <div className="container mx-auto">
            <button onClick={() => setShowFinancing(false)} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-3 transition-colors">
              <ArrowLeft className="w-5 h-5" />Back to Properties
            </button>
            <h1 className="text-3xl font-bold text-amber-400">Owner Financing Terms - Residential Lots</h1>
            <p className="text-sm text-gray-300 mt-2">Financing available for residential lots only (unless home is specified with owner financing)</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-slate-900">OWNER-FINANCING INFORMATION & GUIDELINES</h2>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">Moallem Properties</h3>
            <h3 className="text-xl font-semibold mb-4 text-slate-800">PALM BAY LAND & LOTS</h3>
            <p className="font-bold mb-4 text-slate-900">ALL OWNER FINANCING IS FUNDED BY DAVID MOALLEM TRUST.</p>
            <p className="text-sm text-slate-600 mb-6 italic bg-amber-50 p-4 rounded-lg">Owner financing subject to credit approval and execution of appropriate legal documents. Terms and conditions subject to change.</p>
            <ol className="space-y-3 ml-4 text-slate-700">
              <li>1. The interest rate is 10% APR.</li>
              <li>2. Amortizations up to 10 years.</li>
              <li>3. There is no pre-payment penalty and no balloon.</li>
              <li>4. Calculate monthly payments as $13.22 per $1,000 financed at 10%. Monthly payments can be paid by Zelle, check, or money order to David Moallem.</li>
              <li>5. Buyer needs to fill out a simple application and we need a copy of the buyer ID.</li>
              <li>6. There is a $50 application fee per person. We may pull credit most of the time.</li>
              <li>7. There is a 10 point charge added to financed amount at the time of closing that may be added to the loan amount. For example, if you are owner-financing $20,000, the loan amount will be $22,000.</li>
              <li>8. Minimum down payment is $5,000 or 25%, whichever is greater.</li>
              <li>9. You get an option contract with minimum down payment.</li>
              <li>10. We close the transaction and transfer title once 35% of the purchase price has been received.</li>
              <li>11. If you fail to make timely payments, your contract may be canceled and all your payments will be forfeited.</li>
              <li>12. Buyer is responsible for property taxes and other ownership obligations as of the day the contract is executed.</li>
            </ol>
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="font-bold mb-2 text-slate-900">Contact: Vahid Rajabian, Broker Associate</p>
              <p className="text-slate-700">M. David Moallem, Inc. | License #BK3454072</p>
              <p className="text-slate-700">1663 Georgia St NE, Suite 700, Palm Bay, FL 32907</p>
              <p className="text-slate-700">Phone: <a href="tel:3213337230" className="text-amber-600 hover:underline">321-333-7230</a> | Email: <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:underline">vahid@palmbayland.com</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Palm Bay Lot Price Guide & Financing Terms | Owner Financing Available</title>
        <meta name="description" content="Palm Bay lot pricing and owner financing calculator. 25% down, 10% APR, up to 10 years. No bank required. See current pricing by unit and area." />
        <link rel="canonical" href="https://palmbaylots-land.com/price-guide" />
        <meta property="og:title" content="Palm Bay Lot Price Guide & Financing Terms" />
        <meta property="og:description" content="Calculate Palm Bay lot value by unit, size, and utilities. Owner financing — 25% down, 10% APR, up to 10 years. No bank required." />
        <meta property="og:url" content="https://palmbaylots-land.com/price-guide" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          url: 'https://palmbaylots-land.com/price-guide',
          dateModified: new Date().toISOString().split('T')[0],
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How much does a residential lot cost in Palm Bay?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Most quarter-acre residential lots in Palm Bay range from $41,000 to $80,000 depending on unit, utilities, and lot characteristics. Pricing is calculated per square foot starting around $4.10/sqft for inland units, with premiums added for city water, sewer, oversized lots, and canal frontage.'
              }
            },
            {
              '@type': 'Question',
              name: 'What are the owner financing terms?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Standard owner financing terms are 25% down, 10% APR, amortized over up to 10 years. The deed transfers when 35% of the purchase price has been paid. No banks, no credit checks, no traditional mortgage process.'
              }
            },
            {
              '@type': 'Question',
              name: 'Do all units have city water and sewer?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'No. Only some Palm Bay units have city water and sewer. Many residential units require well and septic, which is typically less expensive than long-term city water and sewer assessments. Each unit\'s utility status is listed in the price guide.'
              }
            },
            {
              '@type': 'Question',
              name: 'Can I buy multiple lots at once?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Bulk and assemblage pricing is available for builders and investors purchasing multiple contiguous lots. Call 321-333-7230 for a custom quote on bulk packages.'
              }
            }
          ]
        })}</script>
      </Helmet>
      <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 shadow-lg sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Price Guide & Financing Terms</h1>
              <p className="text-sm text-gray-300">Browse available lots and land — see pricing and owner-financing options</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <Link to="/inventory" className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors bg-amber-600 text-white hover:bg-amber-700 text-center">
              Browse All Lots — See Price on Any Lot
            </Link>
            <button onClick={() => setShowFinancing(true)} className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Owner Financing Terms
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Branded header */}
          <div className="bg-[#1a3a5c] text-white rounded-t-lg px-6 py-5 flex items-center gap-4 justify-center text-center sm:text-left">
            <img src="/images/palm-bay-logo.png" alt="Palm Bay Lot-Land Real Estate — Florida Land Specialist seal logo" className="h-16 w-16 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-amber-400">2026 Palm Bay Lots — Prices &amp; Policies</h2>
              <p className="text-sm text-gray-200 mt-1">Vahid Rajabian, Broker Associate · M. David Moallem, Inc. · License #BK3454072</p>
            </div>
          </div>

          {/* Top: pricing left, photo journey right */}
          <div className="bg-white shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left — unit pricing */}
              <div className="leading-relaxed">
                <p className="text-xs text-slate-500 mb-4">Standard lot size is 10,000 sq ft. Price varies by unit — see below.</p>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Base Prices — First 10,000 sq ft</h3>
                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">Unit 49</span><span className="font-semibold text-slate-900 whitespace-nowrap">$4.10 / sq ft</span></div>
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">Units 15, 17, 18, 19, 20, 22, 23, 24, 25, 30, 32, 36, 37</span><span className="font-semibold text-slate-900 whitespace-nowrap">$4.50 / sq ft</span></div>
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">Units 13, 14, 26, 39, 41, 42, 44, 50</span><span className="font-semibold text-slate-900 whitespace-nowrap">$5.20 / sq ft</span></div>
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">Unit 40 — commercial / multifamily</span><span className="font-semibold text-slate-900 whitespace-nowrap">$450,000 / acre</span></div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-6 mb-3">Utility &amp; Lot Premiums</h3>
                <div className="divide-y divide-slate-100 text-sm">
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">City water lots</span><span className="font-semibold text-slate-900 whitespace-nowrap">+$20,000</span></div>
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">City water &amp; sewer lots</span><span className="font-semibold text-slate-900 whitespace-nowrap">+$40,000</span></div>
                  <div className="flex justify-between gap-4 py-2.5"><span className="text-slate-700">Exceptional canal lots (more privacy)</span><span className="font-semibold text-slate-900 whitespace-nowrap">+$5,000</span></div>
                </div>
                <div className="mt-4 text-xs text-slate-600 leading-relaxed space-y-1.5">
                  <p><span className="font-semibold">City Water &amp; Sewer Units:</span> 5, 7, 8, 9, 13, 38, 40</p>
                  <p><span className="font-semibold">City Water Units:</span> 10, 11, 12, 16, 21, 28, 31, 42, 44, 46, 48, 50</p>
                  <p><span className="font-semibold">Units 51, 52 &amp; 53:</span> Not buildable — available only as part of a whole package.</p>
                </div>
              </div>

              {/* Right — photo journey stacked */}
              <div className="space-y-6">
                <figure>
                  <img src="https://images.pexels.com/photos/1362509/pexels-photo-1362509.jpeg?auto=compress&w=600" alt="Vacant residential lot in Palm Bay" className="w-full h-44 object-cover rounded-lg" loading="lazy" />
                  <figcaption className="text-center text-sm font-semibold text-slate-700 mt-2">1 · Pick Your Lot</figcaption>
                </figure>
                <figure>
                  <img src="https://images.pexels.com/photos/7937750/pexels-photo-7937750.jpeg?auto=compress&w=600" alt="Home under construction in Palm Bay" className="w-full h-44 object-cover rounded-lg" loading="lazy" />
                  <figcaption className="text-center text-sm font-semibold text-slate-700 mt-2">2 · Build Your Home</figcaption>
                </figure>
                <figure>
                  <img src="https://images.pexels.com/photos/32270941/pexels-photo-32270941.jpeg?auto=compress&w=600" alt="Finished new-construction home in Palm Bay" className="w-full h-44 object-cover rounded-lg" loading="lazy" />
                  <figcaption className="text-center text-sm font-semibold text-slate-700 mt-2">3 · Move In</figcaption>
                </figure>
              </div>
            </div>

            {/* Full-width centered: benefit, financing, terms */}
            <div className="mt-10 max-w-2xl mx-auto text-center leading-relaxed">
              <p className="text-base font-bold text-green-700">In any unit, every square foot beyond the first 10,000 drops to just $3.00 / sq ft — so larger and oversized lots cost less per foot.</p>

              <p className="text-sm text-slate-600 mt-6">Our prices reflect fair, honest market value — the same price for everyone. Prices and terms are firm.</p>
              <p className="text-sm text-slate-700 mt-3">Use the <span className="font-semibold">See Price</span> button on any lot in the <Link to="/inventory" className="text-amber-700 underline font-semibold">inventory</Link> to calculate the exact price and monthly payment instantly.</p>

              <h3 className="text-lg font-bold text-slate-900 mt-8 mb-2">Owner Financing</h3>
              <p className="text-sm text-slate-700">Typical monthly payment is $13.22 per $1,000 financed, 10-year amortization at 10% interest, minimum 25% down. No pre-payment penalty, no balloon.</p>
              <button onClick={() => setShowFinancing(true)} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm">
                <Calculator className="w-4 h-4" /> See Full Financing Terms
              </button>

              <div className="mt-8 text-sm text-slate-700 leading-relaxed space-y-2">
                <p>Exceptional and oversized lots are priced individually.</p>
                <p>All lots are guaranteed buildable, unless otherwise noted in the contract.</p>
                <p>Buildable lots may be exchanged within our inventory — minimum $7,500 exchange fee (includes title insurance).</p>
              </div>
            </div>
          </div>

          {/* Contact + logo grouped, disclaimer */}
          <div className="bg-white border-t border-slate-200 shadow-lg rounded-b-lg p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 flex-col sm:flex-row text-center sm:text-left">
              <img src="/images/palm-bay-logo.png" alt="Palm Bay Lot-Land Real Estate — Florida Land Specialist seal logo" className="h-24 w-24 shrink-0" />
              <div className="leading-relaxed">
                <p className="font-bold text-slate-900">Contact: Vahid Rajabian, Broker Associate</p>
                <p className="text-slate-700 text-sm">M. David Moallem, Inc. | License #BK3454072</p>
                <p className="text-slate-700 text-sm">1663 Georgia St NE, Suite 700, Palm Bay, FL 32907</p>
                <p className="text-slate-700 text-sm">Phone: <a href="tel:3213337230" className="text-amber-600 hover:underline">321-333-7230</a> | Email: <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:underline">vahid@palmbayland.com</a></p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-6 italic text-center">All prices and terms are subject to change without notice. This information is for reference only and does not constitute an offer to sell.</p>
          </div>
        </div>
      </div>
      </div>

      {selectedLot && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">{selectedLot.name}</h3>
              <button onClick={() => setSelectedLot(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-amber-50 p-6 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">Base Price (10,000 sq ft)</p>
                <p className="text-4xl font-bold text-amber-600">{selectedLot.isCommercial ? '$450,000/acre' : `$${calculatePrice(selectedLot.unit, 10000, false).toLocaleString()}`}</p>
                {!selectedLot.isCommercial && <p className="text-sm text-slate-600 mt-2">${selectedLot.price} per sq ft</p>}
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3 text-slate-900">Features</h4>
                <div className="space-y-2">
                  {!selectedLot.isCommercial && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-600 rounded-full"></div><span className="text-slate-700">Standard lot size: 10,000 sq ft</span></div>}
                  {selectedLot.water && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-600 rounded-full"></div><span className="text-slate-700">City water available</span></div>}
                  {selectedLot.sewer && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-600 rounded-full"></div><span className="text-slate-700">City sewer available</span></div>}
                  {selectedLot.isCommercial && <div className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-600 rounded-full"></div><span className="text-slate-700">Commercial/multifamily</span></div>}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3 text-slate-900">Pricing Notes</h4>
                <ul className="text-sm space-y-2 text-slate-700">
                  <li>• Additional sq ft beyond 10,000: $3.00/sq ft</li>
                  {selectedLot.water && !selectedLot.sewer && <li>• City water included: +$20,000</li>}
                  {selectedLot.sewer && <li>• City water & sewer included: +$40,000</li>}
                  <li>• Exceptional canal lots: +$5,000</li>
                  <li>• All lots guaranteed buildable</li>
                  <li>• Owner financing available</li>
                  <li>• Prices subject to change without notice</li>
                </ul>
              </div>
              <a href="tel:3213337230" className="block w-full py-4 bg-amber-600 text-white text-center font-bold rounded-lg hover:bg-amber-700 transition-colors">
                Call Vahid: 321-333-7230
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Properties;