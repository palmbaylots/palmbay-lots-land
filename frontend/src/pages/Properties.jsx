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
              <p className="font-bold mb-2 text-slate-900">Contact: David Moallem</p>
              <p className="text-slate-700">1663 Georgia Street N.E. Suite 700 Palm Bay, FL 32907</p>
              <p className="text-slate-700">Phone: 321.724.2424 | Cell: 321.626.3590</p>
              <p className="text-slate-700">Website: palmbayland.com | email: palmbayland@gmail.com</p>
              <p className="text-sm text-slate-500 mt-3">Updated 9/3/2025</p>
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
        <meta name="description" content="Palm Bay lot pricing and owner financing calculator. 25% down, 10% APR, up to 10 years. No bank required." />
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
              Browse All Lots
            </Link>
            <button className="flex-1 py-3 px-4 rounded-lg font-medium transition-colors bg-sky-500 text-white">
              Price Calculator
            </button>
          </div>
          
          <button onClick={() => setShowFinancing(true)} className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium mb-3 hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5" />
            Owner Financing for Residential Lots - Click for Details
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calculator className="w-7 h-7 text-amber-600" />
              Price Calculator
            </h2>
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-sm font-semibold mb-3 text-slate-900">Calculate Lot Size</h3>
                <div className="flex items-center gap-2 mb-2">
                  <input type="number" step="0.01" placeholder="0.24" value={acreInput} onChange={(e) => { setAcreInput(e.target.value); const acres = parseFloat(e.target.value); if (!isNaN(acres) && acres > 0) setCalcLotSize(Math.round(acres * 43560)); }} className="w-24 p-3 border-2 border-blue-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <span className="font-medium text-slate-700">× 43,560 =</span>
                  <div className="flex-1 p-3 bg-white border-2 border-blue-300 rounded-lg font-bold text-blue-700 text-center">{acreInput && !isNaN(parseFloat(acreInput)) && parseFloat(acreInput) > 0 ? Math.round(parseFloat(acreInput) * 43560).toLocaleString() : '0'} sq ft</div>
                </div>
                <p className="text-xs text-slate-600">Example: 0.24 × 43,560 = 10,454 sq ft</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Select Unit</label>
                <select value={calcUnit} onChange={(e) => setCalcUnit(e.target.value)} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {units.map(u => <option key={u.unit} value={u.unit}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Lot Size (sq ft): {calcLotSize.toLocaleString()}</label>
                <input type="range" min="10000" max="50000" step="1" value={calcLotSize} onChange={(e) => setCalcLotSize(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-slate-500 mt-1"><span>10,000</span><span>50,000</span></div>
                <div className="mt-3">
                  <label className="block text-xs mb-1 text-slate-600">Or enter exact size:</label>
                  <input type="number" min="10000" value={calcLotSize} onChange={(e) => setCalcLotSize(Number(e.target.value) || 10000)} className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={calcCanal} onChange={(e) => setCalcCanal(e.target.checked)} className="w-5 h-5 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm font-medium text-slate-700">Canal Lot (+$5,000)</span>
              </label>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-lg shadow-lg p-8 mb-6">
            <p className="text-sm opacity-90 mb-2">Estimated Total Price</p>
            <p className="text-5xl font-bold">${calculatedPrice.toLocaleString()}</p>
            <p className="text-sm opacity-75 mt-4">Prices subject to change without notice.</p>
          </div>
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <p className="text-sm text-yellow-900 font-semibold text-center">All prices subject to change without notice</p>
            <p className="text-xs text-yellow-800 text-center mt-1">Properties with letter-designated blocks (B, F, K, etc.) require direct pricing — call 321-333-7230</p>
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