import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Ruler, Home, Bath, Square, Calendar, DollarSign, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import InquiryForm from '../components/InquiryForm';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const money = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
    : 'Contact for price';

const lotSize = (l) => {
  if (l.lotAcres) return `${l.lotAcres} acres`;
  if (l.lotSqft) return `${Number(l.lotSqft).toLocaleString()} sqft`;
  return null;
};

const MlsListingDetail = () => {
  const { listingKey } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInquiry, setShowInquiry] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [listingKey]);

  const fetchListing = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 1000, skip: 0, status: 'Active' };
      const res = await axios.get(`${API}/idx/listings`, { params });
      if (res.data.source === 'error') {
        setError(res.data.reason || 'Listing not found.');
        return;
      }
      const found = res.data.listings.find(l => l.id === listingKey);
      if (found) {
        setListing(found);
      } else {
        setError('Listing not found.');
      }
    } catch (err) {
      setError('Could not load listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3a5c]" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/mls-listings')}
            className="flex items-center gap-2 text-[#d97706] hover:text-[#b45309] mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </button>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-slate-600">{error || 'Listing not found.'}</p>
            <Button
              onClick={() => navigate('/mls-listings')}
              className="mt-4 bg-[#1a3a5c] hover:bg-[#12283f]"
            >
              Return to Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{listing.address} - Space Coast MLS | Palm Bay Lots &amp; Land</title>
        <meta name="description" content={`${listing.address} · ${money(listing.price)}`} />
      </Helmet>

      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/mls-listings')}
            className="flex items-center gap-2 text-[#d97706] hover:text-[#b45309]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Photo gallery */}
        <div className="mb-8">
          {listing.photo ? (
            <div className="aspect-video bg-slate-300 rounded-xl overflow-hidden">
              <img
                src={listing.photo}
                alt={listing.address}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center">
              <MapPin className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-3xl font-bold text-[#1a3a5c] mb-2">{listing.address}</h1>
              <div className="flex items-center gap-4 text-slate-600 mb-4">
                <span className="text-sm">{listing.city}, {listing.state} {listing.zip}</span>
                {listing.mlsNumber && <span className="text-sm">MLS #{listing.mlsNumber}</span>}
              </div>
              <div className="text-4xl font-bold text-[#d97706] mb-4">{money(listing.price)}</div>
              {listing.status && (
                <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {listing.status}
                </span>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listing.beds != null && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <Home className="w-5 h-5 text-[#d97706] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{listing.beds}</p>
                  <p className="text-xs text-slate-500 uppercase">Beds</p>
                </div>
              )}
              {listing.baths != null && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <Bath className="w-5 h-5 text-[#d97706] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{listing.baths}</p>
                  <p className="text-xs text-slate-500 uppercase">Baths</p>
                </div>
              )}
              {listing.livingArea && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <Square className="w-5 h-5 text-[#d97706] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{Number(listing.livingArea).toLocaleString()}</p>
                  <p className="text-xs text-slate-500 uppercase">Sqft</p>
                </div>
              )}
              {lotSize(listing) && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <Ruler className="w-5 h-5 text-[#d97706] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{listing.lotAcres || (listing.lotSqft && Number(listing.lotSqft).toLocaleString())}</p>
                  <p className="text-xs text-slate-500 uppercase">{listing.lotAcres ? 'Acres' : 'Lot Sqft'}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-[#1a3a5c] mb-3">Details</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Property details table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#1a3a5c]">Property Information</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {listing.propertyType && (
                  <div className="p-4 grid grid-cols-2">
                    <span className="text-slate-600">Property Type:</span>
                    <span className="font-semibold text-slate-900">{listing.propertyType}</span>
                  </div>
                )}
                {listing.mlsNumber && (
                  <div className="p-4 grid grid-cols-2">
                    <span className="text-slate-600">MLS Number:</span>
                    <span className="font-semibold text-slate-900">{listing.mlsNumber}</span>
                  </div>
                )}
                {listing.updated && (
                  <div className="p-4 grid grid-cols-2">
                    <span className="text-slate-600">Updated:</span>
                    <span className="font-semibold text-slate-900">
                      {new Date(listing.updated).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Inquiry form */}
            <div className="bg-white rounded-xl shadow sticky top-6 p-6">
              <h3 className="text-lg font-bold text-[#1a3a5c] mb-4">Interested in this property?</h3>
              <Button
                onClick={() => setShowInquiry(true)}
                className="w-full bg-[#d97706] hover:bg-[#b45309] text-white mb-3 flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Send Inquiry
              </Button>
              <div className="text-xs text-slate-500 space-y-2">
                <p><strong>Space Coast MLS Listing</strong></p>
                <p>View all details in the Space Coast MLS system for complete information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-12 bg-[#1a3a5c] text-white rounded-xl p-8 text-center">
          <p className="text-lg font-semibold mb-3">Not finding what you're looking for?</p>
          <p className="text-blue-200 mb-4">We have over 2,200 lots available, including properties with owner financing.</p>
          <Button
            onClick={() => navigate('/inventory')}
            className="bg-[#d97706] hover:bg-[#b45309]"
          >
            Browse Our Inventory
          </Button>
        </div>
      </main>

      <InquiryForm
        listing={listing}
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
      />
    </div>
  );
};

export default MlsListingDetail;
