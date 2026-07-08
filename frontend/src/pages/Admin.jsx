import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Download, Phone, Mail, Calendar, TrendingUp, Plus, Edit, Trash2, X, Building2, Home, Users, Upload, Loader2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import AdminBlogsTab from '../components/AdminBlogsTab';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Admin = ({ adminPassword = '' }) => {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('all');
  
  // Property modal state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState('curated'); // 'curated' or 'inventory'
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    address: '',
    city: 'Palm Bay, FL',
    price: '',
    acres: '',
    propertyType: 'Residential',
    tags: [],
    description: '',
    featured: false,
    image: '',
    inventoryId: '',
    county: '',
    owner: '',
    unit: '',
    block: '',
    lot: '',
    streetNumber: '',
    streetName: '',
    taxAccount: '',
    sold: false
  });
  const [tagInput, setTagInput] = useState('');
  const [manualPrice, setManualPrice] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Fetch data
  useEffect(() => {
    fetchLeads();
    fetchProperties();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API}/leads`);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm);
      
      if (!matchesSearch) return false;

      if (filterDate === 'all') return true;
      
      const leadDate = new Date(lead.timestamp);
      const today = new Date();
      
      if (filterDate === 'today') {
        return leadDate.toDateString() === today.toDateString();
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return leadDate >= weekAgo;
      } else if (filterDate === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return leadDate >= monthAgo;
      }
      
      return true;
    });
  }, [leads, searchTerm, filterDate]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Filter by curated vs inventory
      const isCurated = !prop.inventoryId;
      if (propertyFilter === 'curated' && !isCurated) return false;
      if (propertyFilter === 'inventory' && isCurated) return false;

      return prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prop.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prop.propertyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             (prop.inventoryId || '').toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [properties, searchTerm, propertyFilter]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    const todayLeads = leads.filter(lead => {
      const leadDate = new Date(lead.timestamp);
      return leadDate.toDateString() === today.toDateString();
    });
    
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekLeads = leads.filter(lead => new Date(lead.timestamp) >= weekAgo);

    return {
      totalLeads: leads.length,
      todayLeads: todayLeads.length,
      weekLeads: weekLeads.length,
      totalProperties: properties.length,
      curatedProperties: properties.filter(p => !p.inventoryId).length,
      inventoryLots: properties.filter(p => p.inventoryId).length,
      featuredProperties: properties.filter(p => p.featured).length
    };
  }, [leads, properties]);

  // Download leads as Excel (CSV)
  const downloadExcel = () => {
    const csvHeader = 'Name,Email,Phone,Consented,Date Submitted\n';
    const csvContent = filteredLeads.map(lead => {
      const date = new Date(lead.timestamp).toLocaleString();
      return `"${lead.name}","${lead.email}","${lead.phone}","${lead.agreedToContact ? 'Yes' : 'No'}","${date}"`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lead handlers
  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await axios.delete(`${API}/leads/${leadId}`);
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Error deleting lead. Please try again.');
      }
    }
  };

  // Property handlers
  const openAddPropertyModal = () => {
    setEditingProperty(null);
    setPropertyForm({
      title: '',
      address: '',
      city: 'Palm Bay, FL',
      price: '',
      acres: '',
      propertyType: 'Residential',
      tags: [],
      description: '',
      featured: false,
      image: '',
      inventoryId: '',
      county: '',
      owner: '',
      unit: '',
      block: '',
      lot: '',
      streetNumber: '',
      streetName: '',
      taxAccount: '',
      sold: false,
      cashOnly: false
    });
    setTagInput('');
    setManualPrice(false);
    setShowPropertyModal(true);
  };

  const openEditPropertyModal = (property) => {
    setEditingProperty(property);
    setPropertyForm({
      title: property.title || '',
      address: property.address || '',
      city: property.city || 'Palm Bay, FL',
      price: property.price || '',
      acres: property.acres || '',
      propertyType: property.propertyType || 'Residential',
      tags: property.tags || [],
      description: property.description || '',
      featured: property.featured || false,
      image: property.image || '',
      inventoryId: property.inventoryId || '',
      county: property.county || '',
      owner: property.owner || '',
      unit: property.unit || '',
      block: property.block || '',
      lot: property.lot || '',
      streetNumber: property.streetNumber || '',
      streetName: property.streetName || '',
      taxAccount: property.taxAccount || '',
      sold: property.sold || false,
      cashOnly: property.cashOnly || false
    });
    setTagInput('');
    setManualPrice(/\d/.test(property.price || '') && !/contact/i.test(property.price || ''));
    setShowPropertyModal(true);
  };

  const handlePropertyFormChange = (e) => {
    const { name, value } = e.target;
    setPropertyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !propertyForm.tags.includes(tagInput.trim())) {
      setPropertyForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setPropertyForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = `${BACKEND_URL}${response.data.url}`;
      setPropertyForm(prev => ({ ...prev, image: fullUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploadError(error.response?.data?.detail || 'Upload failed. Try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProperty = async () => {
    try {
      if (editingProperty) {
        await axios.put(`${API}/properties/${editingProperty.id}`, propertyForm);
      } else {
        await axios.post(`${API}/properties`, propertyForm);
      }
      fetchProperties();
      setShowPropertyModal(false);
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Error saving property. Please try again.');
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API}/properties/${propertyId}`);
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Error deleting property. Please try again.');
      }
    }
  };

  const handleToggleSold = async (property) => {
    const newSold = !property.sold;
    const action = newSold ? 'mark as SOLD' : 'mark as available';
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)}?\n\n${property.title || property.address}`)) return;
    try {
      await axios.patch(`${API}/properties/${property.id}/sold?sold=${newSold}`);
      fetchProperties();
    } catch (error) {
      console.error('Error toggling sold status:', error);
      alert('Error updating sold status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-slate-700">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <main id="main-content">
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-amber-400 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300">
              Manage leads and properties
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{stats.totalLeads}</p>
                <p className="text-sm text-slate-600">Total Leads</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.todayLeads}</p>
                <p className="text-sm text-slate-600">Today</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.weekLeads}</p>
                <p className="text-sm text-slate-600">This Week</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">{stats.curatedProperties}</p>
                <p className="text-sm text-slate-600">Listings</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.inventoryLots}</p>
                <p className="text-sm text-slate-600">Inventory Lots</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b sticky top-0 z-30">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('leads')}
                className={`shrink-0 px-3 sm:px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'leads' 
                    ? 'border-amber-500 text-amber-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-5 h-5" />
                Leads ({stats.totalLeads})
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`shrink-0 px-3 sm:px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'properties' 
                    ? 'border-amber-500 text-amber-600' 
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="hidden sm:inline">Properties </span>
                <span className="sm:hidden">Props </span>
                ({stats.totalProperties})
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`shrink-0 px-3 sm:px-6 py-4 font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'blogs'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
                data-testid="admin-tab-blogs"
              >
                <BookOpen className="w-5 h-5" />
                Blogs
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            {activeTab !== 'blogs' && (
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'leads' ? "Search leads..." : "Search properties..."} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500" 
                />
              </div>
              
              {activeTab === 'leads' && (
                <>
                  <select 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)} 
                    className="px-4 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <Button 
                    onClick={downloadExcel}
                    disabled={filteredLeads.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Export
                  </Button>
                </>
              )}
              
              {activeTab === 'properties' && (
                <>
                  <select
                    value={propertyFilter}
                    onChange={(e) => setPropertyFilter(e.target.value)}
                    className="px-4 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    data-testid="property-filter-select"
                  >
                    <option value="curated">Curated Listings ({stats.curatedProperties})</option>
                    <option value="inventory">Inventory Lots ({stats.inventoryLots})</option>
                  </select>
                  <Button 
                    onClick={openAddPropertyModal}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 flex items-center gap-2"
                    data-testid="add-property-btn"
                  >
                    <Plus className="w-5 h-5" />
                    Add Property
                  </Button>
                </>
              )}
            </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <AdminBlogsTab adminPassword={adminPassword} />
            )}

            {/* LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {filteredLeads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900 text-white">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">Name</th>
                          <th className="px-4 py-3 text-left font-semibold">Email</th>
                          <th className="px-4 py-3 text-left font-semibold">Phone</th>
                          <th className="px-4 py-3 text-left font-semibold">Date</th>
                          <th className="px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-amber-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                            <td className="px-4 py-3">
                              <a href={`mailto:${lead.email}`} className="text-amber-600 hover:underline">
                                {lead.email}
                              </a>
                            </td>
                            <td className="px-4 py-3">
                              <a href={`tel:${lead.phone}`} className="text-amber-600 hover:underline">
                                {lead.phone}
                              </a>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {formatDate(lead.timestamp)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <a 
                                  href={`tel:${lead.phone}`}
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                  Call
                                </a>
                                <a 
                                  href={`mailto:${lead.email}`}
                                  className="px-3 py-1 bg-amber-600 text-white rounded text-sm hover:bg-amber-700"
                                >
                                  Email
                                </a>
                                <button 
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                  data-testid={`delete-lead-${lead.id}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-slate-600">No leads found.</p>
                  </div>
                )}
              </div>
            )}

            {/* PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {filteredProperties.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900 text-white">
                        <tr>
                          {propertyFilter === 'inventory' && (
                            <th className="px-4 py-3 text-left font-semibold">Inv. ID</th>
                          )}
                          <th className="px-4 py-3 text-left font-semibold">Property</th>
                          {propertyFilter === 'inventory' ? (
                            <>
                              <th className="px-4 py-3 text-left font-semibold">Unit</th>
                              <th className="px-4 py-3 text-left font-semibold">Block</th>
                              <th className="px-4 py-3 text-left font-semibold">Lot</th>
                            </>
                          ) : (
                            <>
                              <th className="px-4 py-3 text-left font-semibold">Type</th>
                              <th className="px-4 py-3 text-left font-semibold">Price</th>
                            </>
                          )}
                          <th className="px-4 py-3 text-left font-semibold">Size</th>
                          <th className="px-4 py-3 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProperties.map((prop) => (
                          <tr key={prop.id} className="hover:bg-amber-50 transition-colors">
                            {propertyFilter === 'inventory' && (
                              <td className="px-4 py-3 font-mono text-sm text-slate-700">{prop.inventoryId}</td>
                            )}
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-slate-900 flex items-center gap-2">
                                  {prop.title}
                                  {prop.sold && (
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase">Sold</span>
                                  )}
                                </p>
                                <p className="text-sm text-slate-500">{prop.city}</p>
                              </div>
                            </td>
                            {propertyFilter === 'inventory' ? (
                              <>
                                <td className="px-4 py-3 text-slate-700">{prop.unit}</td>
                                <td className="px-4 py-3 text-slate-700">{prop.block}</td>
                                <td className="px-4 py-3 text-slate-700">{prop.lot}</td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3">
                                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    prop.propertyType === 'Commercial' ? 'bg-blue-100 text-blue-700' :
                                    prop.propertyType === 'Multi-Family' ? 'bg-purple-100 text-purple-700' :
                                    prop.propertyType === 'Assemblage' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>
                                    {prop.propertyType}
                                  </span>
                                  {prop.featured && (
                                    <span className="ml-1 inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                      Featured
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-semibold text-green-700">{prop.price}</td>
                              </>
                            )}
                            <td className="px-4 py-3 text-slate-600">{prop.acres}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleToggleSold(prop)}
                                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                                    prop.sold 
                                      ? 'bg-red-600 text-white hover:bg-red-700' 
                                      : 'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-700 border border-slate-300'
                                  }`}
                                  data-testid={`toggle-sold-${prop.id}`}
                                  title={prop.sold ? 'Mark as Available' : 'Mark as Sold'}
                                >
                                  {prop.sold ? 'SOLD' : 'Mark Sold'}
                                </button>
                                <button 
                                  onClick={() => openEditPropertyModal(prop)}
                                  className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                  data-testid={`edit-prop-${prop.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProperty(prop.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  data-testid={`delete-prop-${prop.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No properties yet.</p>
                    <Button onClick={openAddPropertyModal} className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Property
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Property Modal */}
        {showPropertyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button 
                  onClick={() => setShowPropertyModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                    <Input
                      name="title"
                      value={propertyForm.title}
                      onChange={handlePropertyFormChange}
                      placeholder="e.g., 328 Malabar Rd"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
                    <select
                      name="propertyType"
                      value={propertyForm.propertyType}
                      onChange={handlePropertyFormChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Multi-Family">Multi-Family</option>
                      <option value="Institutional">Institutional</option>
                      <option value="Park">Park</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Assemblage">Assemblage</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                    <Input
                      name="address"
                      value={propertyForm.address}
                      onChange={handlePropertyFormChange}
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                    <Input
                      name="city"
                      value={propertyForm.city}
                      onChange={handlePropertyFormChange}
                      placeholder="Palm Bay, FL"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Price *</label>
                    <label className="flex items-center gap-2 text-xs text-slate-600 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualPrice}
                        onChange={(e) => {
                          setManualPrice(e.target.checked);
                          setPropertyForm(prev => ({ ...prev, price: e.target.checked ? '' : 'Contact for Price' }));
                        }}
                        className="w-4 h-4 accent-amber-600"
                      />
                      Set price manually (override calculator)
                    </label>
                    <Input
                      name="price"
                      value={propertyForm.price}
                      onChange={handlePropertyFormChange}
                      placeholder={manualPrice ? '$75,000' : 'Calculator sets the price'}
                      disabled={!manualPrice}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Size (Acres) *</label>
                    <Input
                      name="acres"
                      value={propertyForm.acres}
                      onChange={handlePropertyFormChange}
                      placeholder="1.5 AC"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Image</label>
                  <div className="flex gap-2">
                    <Input
                      name="image"
                      value={propertyForm.image}
                      onChange={handlePropertyFormChange}
                      placeholder="Paste URL or upload a file →"
                      data-testid="property-image-url-input"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      data-testid="property-image-file-input"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="shrink-0"
                      data-testid="property-image-upload-btn"
                    >
                      {uploadingImage ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…</>
                      ) : (
                        <><Upload className="w-4 h-4 mr-2" /> Upload</>
                      )}
                    </Button>
                  </div>
                  {uploadError && (
                    <p className="text-sm text-red-600 mt-1" data-testid="image-upload-error">{uploadError}</p>
                  )}
                  {propertyForm.image && (
                    <div className="mt-2 flex items-start gap-3">
                      <img
                        src={propertyForm.image}
                        alt={propertyForm.title ? `Preview of ${propertyForm.title}` : 'Property image preview'}
                        className="w-32 h-24 object-cover rounded border border-slate-200"
                        loading="lazy"
                        decoding="async"
                        data-testid="property-image-preview"
                      />
                      <button
                        type="button"
                        onClick={() => setPropertyForm(prev => ({ ...prev, image: '' }))}
                        className="text-xs text-red-600 hover:underline"
                        data-testid="property-image-remove-btn"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Auto-optimized: resized to max 1600px wide, JPEG quality 82. Max 10MB upload.
                  </p>
                </div>

                {/* Inventory-specific fields */}
                {(propertyForm.inventoryId || propertyFilter === 'inventory') && (
                  <>
                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-slate-700 mb-3">Inventory Details</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Inventory ID</label>
                        <Input name="inventoryId" value={propertyForm.inventoryId} onChange={handlePropertyFormChange} placeholder="e.g., 8F" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                        <Input name="unit" value={propertyForm.unit} onChange={handlePropertyFormChange} placeholder="e.g., 8" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Block</label>
                        <Input name="block" value={propertyForm.block} onChange={handlePropertyFormChange} placeholder="e.g., F" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lot</label>
                        <Input name="lot" value={propertyForm.lot} onChange={handlePropertyFormChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Street #</label>
                        <Input name="streetNumber" value={propertyForm.streetNumber} onChange={handlePropertyFormChange} placeholder="750" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Street Name</label>
                        <Input name="streetName" value={propertyForm.streetName} onChange={handlePropertyFormChange} placeholder="FIRESTONE ST NE" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">County</label>
                        <Input name="county" value={propertyForm.county} onChange={handlePropertyFormChange} placeholder="Brevard" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Owner</label>
                        <Input name="owner" value={propertyForm.owner} onChange={handlePropertyFormChange} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tax Account</label>
                        <Input name="taxAccount" value={propertyForm.taxAccount} onChange={handlePropertyFormChange} />
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="e.g., City Water, Corner Lot"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {propertyForm.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-amber-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <Textarea
                    name="description"
                    value={propertyForm.description}
                    onChange={handlePropertyFormChange}
                    placeholder="Property description, highlights, why it's valuable..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={propertyForm.featured}
                    onCheckedChange={(checked) => setPropertyForm(prev => ({ ...prev, featured: checked }))}
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Mark as Featured (shows on Inventory page)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="cashOnly"
                    checked={propertyForm.cashOnly}
                    onCheckedChange={(checked) => setPropertyForm(prev => ({ ...prev, cashOnly: checked }))}
                  />
                  <label htmlFor="cashOnly" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Cash only — no owner financing (for listings we don't own)
                  </label>
                </div>
              </div>
              
              <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowPropertyModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProperty}
                  className="bg-amber-600 hover:bg-amber-700"
                  disabled={!propertyForm.title || !propertyForm.address || (manualPrice && !propertyForm.price)}
                >
                  {editingProperty ? 'Save Changes' : 'Add Property'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Admin;
