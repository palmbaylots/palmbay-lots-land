import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Upload, Save, X, Eye, Building, MapPin, DollarSign, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

// Demo data for preview
const demoProperties = [
  { id: '1', unit: '23', block: '1234', lot: '5', address: '123 Palm Bay Rd NE', size: '0.23 acres', zoning: 'RS-2', price: 15000, status: 'Available', description: 'Beautiful corner lot' },
  { id: '2', unit: '23', block: '1234', lot: '6', address: '125 Palm Bay Rd NE', size: '0.25 acres', zoning: 'RS-2', price: 16500, status: 'Available', description: 'Near utilities' },
  { id: '3', unit: '24', block: '1235', lot: '1', address: '200 Emerson Dr NE', size: '0.30 acres', zoning: 'RS-2', price: 18000, status: 'Pending', description: 'Large lot with trees' },
];

const PropertyAdminDemo = () => {
  const [properties, setProperties] = useState(demoProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    unit: '',
    block: '',
    lot: '',
    address: '',
    size: '',
    zoning: 'RS-2',
    price: '',
    status: 'Available',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = () => {
    setFormData({
      unit: '',
      block: '',
      lot: '',
      address: '',
      size: '',
      zoning: 'RS-2',
      price: '',
      status: 'Available',
      description: ''
    });
    setEditingProperty(null);
    setShowAddForm(true);
  };

  const handleEdit = (property) => {
    setFormData({
      unit: property.unit,
      block: property.block,
      lot: property.lot,
      address: property.address,
      size: property.size,
      zoning: property.zoning,
      price: property.price.toString(),
      status: property.status,
      description: property.description
    });
    setEditingProperty(property);
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (editingProperty) {
      // Update existing
      setProperties(prev => prev.map(p => 
        p.id === editingProperty.id 
          ? { ...p, ...formData, price: parseInt(formData.price) }
          : p
      ));
      alert('✅ Property updated successfully! (Demo mode)');
    } else {
      // Add new
      const newProperty = {
        id: Date.now().toString(),
        ...formData,
        price: parseInt(formData.price)
      };
      setProperties(prev => [newProperty, ...prev]);
      alert('✅ New property added successfully! (Demo mode)');
    }
    setShowAddForm(false);
    setEditingProperty(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
      alert('🗑️ Property deleted! (Demo mode)');
    }
  };

  const filteredProperties = properties.filter(p => 
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.block.includes(searchTerm) ||
    p.lot.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-slate-900 text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Property Admin Panel</h1>
            <p className="text-gray-400 text-sm">Demo Preview - Manage Your Inventory</p>
          </div>
          <div className="bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
            DEMO MODE
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Properties</p>
                <p className="text-2xl font-bold">{properties.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Available</p>
                <p className="text-2xl font-bold">{properties.filter(p => p.status === 'Available').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold">{properties.filter(p => p.status === 'Pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Sold</p>
                <p className="text-2xl font-bold">{properties.filter(p => p.status === 'Sold').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by address, block, or lot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleAddNew}
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Property
            </Button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-slate-900 text-white p-4 rounded-t-lg flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {editingProperty ? '✏️ Edit Property' : '➕ Add New Property'}
                </h2>
                <button onClick={() => setShowAddForm(false)} className="hover:bg-slate-700 p-2 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <Input name="unit" value={formData.unit} onChange={handleInputChange} placeholder="23" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                    <Input name="block" value={formData.block} onChange={handleInputChange} placeholder="1234" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lot</label>
                    <Input name="lot" value={formData.lot} onChange={handleInputChange} placeholder="5" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Palm Bay Rd NE" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                    <Input name="size" value={formData.size} onChange={handleInputChange} placeholder="0.23 acres" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoning</label>
                    <select 
                      name="zoning" 
                      value={formData.zoning} 
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="RS-2">RS-2 (Residential)</option>
                      <option value="CG">CG (Commercial)</option>
                      <option value="IL">IL (Industrial Light)</option>
                      <option value="IH">IH (Industrial Heavy)</option>
                      <option value="IN">IN (Institutional)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <Input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="15000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleInputChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="Available">Available</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                      <option value="Off Market">Off Market</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Property description, features, nearby amenities..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 cursor-pointer transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Click to upload photos or drag and drop</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 5MB each</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingProperty ? 'Save Changes' : 'Add Property'}
                  </Button>
                  <Button 
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Unit/Block/Lot</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Size</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{property.address}</p>
                        <p className="text-sm text-gray-500">{property.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      {property.unit}/{property.block}/{property.lot}
                    </td>
                    <td className="px-4 py-4 text-slate-700">{property.size}</td>
                    <td className="px-4 py-4 font-semibold text-green-600">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        property.status === 'Available' ? 'bg-green-100 text-green-700' :
                        property.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        property.status === 'Sold' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(property)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No properties found</p>
            </div>
          )}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-amber-800 mb-2">📋 This is a Demo Preview</h3>
          <p className="text-amber-700">
            Try clicking "Add New Property" or the Edit/Delete buttons to see how the admin panel works.
            <br />
            Changes in this demo won't be saved permanently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyAdminDemo;
