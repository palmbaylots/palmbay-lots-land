import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Download, ExternalLink, MapPin, Phone, CheckCircle, MessageCircle, Loader2, Droplets, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Unit utility information
const unitUtilities = {
  // City Water & Sewer
  '5': { water: true, sewer: true },
  '7': { water: true, sewer: true },
  '8': { water: true, sewer: true },
  '9': { water: true, sewer: true },
  '38': { water: true, sewer: true },
  // City Water Only
  '10': { water: true, sewer: false },
  '11': { water: true, sewer: false },
  '12': { water: true, sewer: false },
  '16': { water: true, sewer: false },
  '21': { water: true, sewer: false },
  '28': { water: true, sewer: false },
  '31': { water: true, sewer: false },
  '42': { water: true, sewer: false },
  '44': { water: true, sewer: false },
  '46': { water: true, sewer: false },
  '48': { water: true, sewer: false },
  '50': { water: true, sewer: false },
};

// Helper to get utility type for a unit
const getUtilityType = (unit) => {
  const info = unitUtilities[unit];
  if (info?.water && info?.sewer) return 'water_sewer';
  if (info?.water) return 'water_only';
  return 'well_septic';
};

// Fallback featured properties (used only if database is empty)
const fallbackFeatured = [
  {
    id: '328-malabar',
    address: '328 Malabar Rd',
    city: 'Palm Bay, FL',
    price: '$1,575,000',
    acres: '1.75 AC',
    tag: 'Signalized Corner',
    tagColor: 'bg-green-600',
    why: 'Signalized corner on Malabar Rd — utilities in place, strong traffic counts.',
    link: '/listing/328-malabar-rd'
  },
  {
    id: 'babcock-18ac',
    address: '6950 Babcock St SE',
    city: 'Palm Bay, FL',
    price: '$4,950,000',
    acres: '18 AC',
    tag: 'Large Development',
    tagColor: 'bg-purple-600',
    why: 'Major development opportunity — commercial, multifamily, or mixed-use potential.'
  },
  {
    id: 'thor-mf',
    address: '451 Thor Ave SE',
    city: 'Palm Bay, FL',
    price: '$328,500',
    acres: '0.73 AC',
    tag: 'MF-20 Zoned',
    tagColor: 'bg-blue-600',
    why: 'Multi-family zoned corner — approved for 14+ units, strong rental demand.'
  }
];

// Tag color mapping
const tagColorMap = {
  'Commercial': 'bg-blue-600',
  'Multi-Family': 'bg-purple-600',
  'Residential': 'bg-amber-600',
  'Assemblage': 'bg-red-600',
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Load featured properties from database
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API}/properties/featured`);
        if (response.data && response.data.length > 0) {
          // Transform database properties to featured format
          const dbFeatured = response.data.map(prop => ({
            id: prop.id,
            address: prop.title,
            city: prop.city,
            price: prop.price,
            acres: prop.acres,
            tag: prop.tags?.[0] || prop.propertyType,
            tagColor: tagColorMap[prop.propertyType] || 'bg-slate-600',
            why: prop.description || '',
            link: prop.featured ? `/listing/${prop.id}` : null
          }));
          setFeaturedProperties(dbFeatured);
        } else {
          // Use fallback if database is empty
          setFeaturedProperties(fallbackFeatured);
        }
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        setFeaturedProperties(fallbackFeatured);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Load inventory from database API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Use dedicated inventory endpoint — only returns lots, never curated listings
        const response = await axios.get(`${API}/properties/inventory`);
        if (response.data && response.data.length > 0) {
          setInventory(response.data);
        }
      } catch (error) {
        console.error('Error loading inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Get unique units for filter
  const uniqueUnits = useMemo(() => {
    const units = [...new Set(inventory.map(item => item.unit))].filter(u => u);
    return units.sort((a, b) => {
      const numA = parseInt(a) || 999;
      const numB = parseInt(b) || 999;
      return numA - numB;
    });
  }, [inventory]);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = 
        (item.inventoryId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lot.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.streetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${item.streetNumber} ${item.streetName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesUnit = filterUnit === 'all' || item.unit === filterUnit;
      
      return matchesSearch && matchesUnit;
    });
  }, [inventory, searchTerm, filterUnit]);

  // Group inventory by utility type and sort by unit number
  const groupedInventory = useMemo(() => {
    const waterSewer = [];
    const waterOnly = [];
    const wellSeptic = [];

    filteredInventory.forEach(item => {
      const utilityType = getUtilityType(item.unit);
      if (utilityType === 'water_sewer') {
        waterSewer.push(item);
      } else if (utilityType === 'water_only') {
        waterOnly.push(item);
      } else {
        wellSeptic.push(item);
      }
    });

    // Sort each group by unit number ascending
    const sortByUnit = (a, b) => {
      const unitA = parseInt(a.unit) || 999;
      const unitB = parseInt(b.unit) || 999;
      return unitA - unitB;
    };

    waterSewer.sort(sortByUnit);
    waterOnly.sort(sortByUnit);
    wellSeptic.sort(sortByUnit);

    return { waterSewer, waterOnly, wellSeptic };
  }, [filteredInventory]);

  // Download as Excel (CSV)
  const downloadExcel = () => {
    const csvHeader = 'Inventory ID,County,Owner,Acres,Unit,Block,Lot,Street Number,Street Name,City,Tax Account,Property Appraiser Link\n';
    const csvContent = filteredInventory.map(item => {
      const link = item.taxAccount 
        ? `https://www.bcpao.us/PropertySearch/#/account/${item.taxAccount}`
        : 'https://www.bcpao.us/PropertySearch/#/nav/Search';
      return `"${item.inventoryId}","${item.county}","${item.owner}","${item.acres}","${item.unit}","${item.block}","${item.lot}","${item.streetNumber}","${item.streetName}","${item.city}","${item.taxAccount}","${link}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `palm_bay_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get property appraiser account link
  const getPropertyAppraiserLink = (item) => {
    if (item.taxAccount) {
      return `https://www.bcpao.us/PropertySearch/#/account/${item.taxAccount}`;
    }
    return `https://www.bcpao.us/PropertySearch/#/nav/Search`;
  };

  // Get Google Maps search link from address
  const getGoogleMapsLink = (item) => {
    const q = [item.streetNumber, item.streetName, item.city, 'FL'].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <div className="text-xl font-semibold text-slate-700">Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Helmet>
        <title>Palm Bay Lots for Sale | Residential & Commercial Land | Brevard County</title>
        <meta name="description" content="Browse 500+ residential lots, commercial and industrial land in Palm Bay, FL. Owner financing available. Updated listings with zoning, utilities, and pricing." />
        <link rel="canonical" href="https://palmbaylots-land.com/inventory" />
        <meta property="og:title" content="Palm Bay Lots for Sale | Residential & Commercial Land" />
        <meta property="og:description" content="Browse 500+ residential lots and commercial land in Palm Bay, FL. Owner financing available." />
        <meta property="og:url" content="https://palmbaylots-land.com/inventory" />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* ===== STEP 1: Hero Section with Authority ===== */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-400 mb-4">
              Palm Bay Land Inventory — Curated, Not Scraped
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              Residential, commercial, multifamily, and development-ready parcels in Palm Bay.<br />
              If you don't know what zoning actually works, I'll tell you before you waste time or money.
            </p>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-lg font-bold transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Talk to a Palm Bay Land Expert
            </Link>
            
            <p className="text-sm text-gray-500 mt-4">
              <Link to="/contact" className="text-amber-400 hover:text-amber-300 underline">
                Request Parcel & Zoning Review
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ===== STEP 2: Featured / Best Opportunities ===== */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Best Opportunities Right Now
              </h2>
              <p className="text-slate-600">
                Hand-picked parcels with real demand, visibility, or development upside.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProperties.map((prop) => (
                <div key={prop.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold text-white ${prop.tagColor}`}>
                      {prop.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{prop.address}</h3>
                  <p className="text-sm text-slate-500 mb-2">{prop.city}</p>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="font-bold text-green-700">{prop.price}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">{prop.acres}</span>
                  </div>
                  <p className="text-sm text-slate-600 italic mb-4">
                    {prop.why}
                  </p>
                  {prop.link ? (
                    <Link
                      to={prop.link}
                      className="block w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-center rounded-lg text-sm font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                  ) : (
                    <Link
                      to="/contact"
                      className="block w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-center rounded-lg text-sm font-semibold transition-colors"
                    >
                      Request Info
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STEP 3: Full Inventory Table ===== */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Context above table */}
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Full Palm Bay Inventory</h2>
            <p className="text-slate-600">
              {inventory.length}+ lots available below. If you want help narrowing this down, don't guess — <Link to="/contact" className="text-amber-600 font-semibold hover:underline">ask</Link>.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by ID, Unit, Block, Lot, or Address..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500" 
                />
              </div>
              <Button 
                onClick={downloadExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Excel
              </Button>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border"
              >
                <Filter className="w-5 h-5" />
                Filters {filterUnit !== 'all' && '(Active)'}
              </button>
            </div>
            
            {showFilters && (
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Filter by Unit</label>
                  <select 
                    value={filterUnit} 
                    onChange={(e) => setFilterUnit(e.target.value)} 
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Units</option>
                    {uniqueUnits.map(unit => (
                      <option key={unit} value={unit}>Unit {unit}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={() => { setFilterUnit('all'); }} 
                  className="w-full py-2 text-amber-600 font-medium hover:text-amber-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 mb-4 bg-white p-3 rounded-lg shadow-sm">
            Showing {filteredInventory.length} of {inventory.length} lots
            <span className="ml-4 text-xs">
              (<span className="text-blue-600">{groupedInventory.waterSewer.length} City Water & Sewer</span> | 
              <span className="text-cyan-600 ml-1">{groupedInventory.waterOnly.length} City Water</span> | 
              <span className="text-amber-600 ml-1">{groupedInventory.wellSeptic.length} Well & Septic</span>)
            </span>
          </p>

          {/* Inventory Tables by Utility Type */}
          
          {/* City Water & Sewer Section */}
          {groupedInventory.waterSewer.length > 0 && (
            <div className="mb-8">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                <Droplets className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">City Water & Sewer</h3>
                  <p className="text-blue-100 text-sm">{groupedInventory.waterSewer.length} lots — Premium utility access, no well or septic needed</p>
                </div>
              </div>
              <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Inventory ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Unit</th>
                        <th className="px-4 py-3 text-left font-semibold">Block</th>
                        <th className="px-4 py-3 text-left font-semibold">Lot</th>
                        <th className="px-4 py-3 text-left font-semibold">Address</th>
                        <th className="px-4 py-3 text-left font-semibold">Size</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupedInventory.waterSewer.map((item, index) => {
                        const address = `${item.streetNumber} ${item.streetName}, ${item.city}`.trim();
                        return (
                          <tr key={index} className={`hover:bg-blue-50 transition-colors ${item.sold ? 'opacity-50 bg-red-50/40' : ''}`}>
                            <td className="px-4 py-3 font-bold text-slate-900">{item.inventoryId}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Unit {item.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{item.block}</td>
                            <td className="px-4 py-3 text-slate-700">{item.lot}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{address}</span>
                                {item.sold && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider" data-testid={`sold-badge-${item.inventoryId}`}>SOLD</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.acres}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <a
                                  href={getPropertyAppraiserLink(item)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-testid={`account-link-${item.inventoryId}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Account
                                </a>
                                {(item.streetNumber || item.streetName) && (
                                  <button
                                    onClick={() => window.open(getGoogleMapsLink(item), '_blank', 'noopener,noreferrer')}
                                    data-testid={`view-map-link-${item.inventoryId}`}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
                                  >
                                    <MapPin className="w-4 h-4" />
                                    View Map
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* City Water Only Section */}
          {groupedInventory.waterOnly.length > 0 && (
            <div className="mb-8">
              <div className="bg-cyan-600 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                <Droplets className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">City Water Only</h3>
                  <p className="text-cyan-100 text-sm">{groupedInventory.waterOnly.length} lots — City water available, septic required</p>
                </div>
              </div>
              <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Inventory ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Unit</th>
                        <th className="px-4 py-3 text-left font-semibold">Block</th>
                        <th className="px-4 py-3 text-left font-semibold">Lot</th>
                        <th className="px-4 py-3 text-left font-semibold">Address</th>
                        <th className="px-4 py-3 text-left font-semibold">Size</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupedInventory.waterOnly.map((item, index) => {
                        const address = `${item.streetNumber} ${item.streetName}, ${item.city}`.trim();
                        return (
                          <tr key={index} className={`hover:bg-cyan-50 transition-colors ${item.sold ? 'opacity-50 bg-red-50/40' : ''}`}>
                            <td className="px-4 py-3 font-bold text-slate-900">{item.inventoryId}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                                Unit {item.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{item.block}</td>
                            <td className="px-4 py-3 text-slate-700">{item.lot}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{address}</span>
                                {item.sold && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider" data-testid={`sold-badge-${item.inventoryId}`}>SOLD</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.acres}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <a
                                  href={getPropertyAppraiserLink(item)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-testid={`account-link-${item.inventoryId}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Account
                                </a>
                                {(item.streetNumber || item.streetName) && (
                                  <button
                                    onClick={() => window.open(getGoogleMapsLink(item), '_blank', 'noopener,noreferrer')}
                                    data-testid={`view-map-link-${item.inventoryId}`}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors cursor-pointer"
                                  >
                                    <MapPin className="w-4 h-4" />
                                    View Map
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Well & Septic Section */}
          {groupedInventory.wellSeptic.length > 0 && (
            <div className="mb-8">
              <div className="bg-amber-600 text-white px-6 py-4 rounded-t-lg flex items-center gap-3">
                <Home className="w-6 h-6" />
                <div>
                  <h3 className="text-xl font-bold">Well & Septic</h3>
                  <p className="text-amber-100 text-sm">{groupedInventory.wellSeptic.length} lots — Well and septic required, most affordable options</p>
                </div>
              </div>
              <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Inventory ID</th>
                        <th className="px-4 py-3 text-left font-semibold">Unit</th>
                        <th className="px-4 py-3 text-left font-semibold">Block</th>
                        <th className="px-4 py-3 text-left font-semibold">Lot</th>
                        <th className="px-4 py-3 text-left font-semibold">Address</th>
                        <th className="px-4 py-3 text-left font-semibold">Size</th>
                        <th className="px-4 py-3 text-left font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {groupedInventory.wellSeptic.map((item, index) => {
                        const address = `${item.streetNumber} ${item.streetName}, ${item.city}`.trim();
                        return (
                          <tr key={index} className={`hover:bg-amber-50 transition-colors ${item.sold ? 'opacity-50 bg-red-50/40' : ''}`}>
                            <td className="px-4 py-3 font-bold text-slate-900">{item.inventoryId}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                Unit {item.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{item.block}</td>
                            <td className="px-4 py-3 text-slate-700">{item.lot}</td>
                            <td className="px-4 py-3 text-slate-700">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span>{address}</span>
                                {item.sold && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider" data-testid={`sold-badge-${item.inventoryId}`}>SOLD</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-medium">{item.acres}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <a
                                  href={getPropertyAppraiserLink(item)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-testid={`account-link-${item.inventoryId}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Account
                                </a>
                                {(item.streetNumber || item.streetName) && (
                                  <button
                                    onClick={() => window.open(getGoogleMapsLink(item), '_blank', 'noopener,noreferrer')}
                                    data-testid={`view-map-link-${item.inventoryId}`}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer"
                                  >
                                    <MapPin className="w-4 h-4" />
                                    View Map
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* No results message */}
          {filteredInventory.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-slate-600 text-lg">No lots found matching your search criteria.</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
            <h3 className="text-lg font-bold text-red-900 mb-2">Important Disclaimer</h3>
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>All prices are subject to verification and may change without notice.</strong> The information displayed on this page is for reference purposes only. Availability, pricing, and property details should be verified directly. Please contact Vahid Reza Rajabian at <a href="tel:3213337230" className="underline font-semibold">321-333-7230</a> or <a href="mailto:vahid@palmbayland.com" className="underline font-semibold">vahid@palmbayland.com</a> to verify current information and availability before making any purchase decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ===== STEP 5: Authority Section at Bottom ===== */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6">
              Why Buyers Use Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-gray-300">20+ years focused on Palm Bay land</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-gray-300">I explain what you can actually build — not just what zoning says</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <CheckCircle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="text-gray-300">Trusted by builders, developers, and land investors</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
            >
              Request Parcel & Zoning Review
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STEP 4: Sticky Help CTA ===== */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          to="/contact"
          className="flex items-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-semibold shadow-lg transition-all hover:scale-105"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">Not sure what to pick? Ask Vahid</span>
          <span className="sm:hidden">Ask Vahid</span>
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
