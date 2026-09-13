import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const InquiryForm = ({ listing, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    what_they_want: '',
    message: '',
    agreedToContact: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in name, email, and phone.');
      return;
    }

    if (!formData.agreedToContact) {
      setError('Please agree to receive contact from Vahid Rajabian.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/idx/leads`, formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        what_they_want: '',
        message: '',
        agreedToContact: false,
      });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error submitting inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1a3a5c]">Inquire About This Listing</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {listing && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-semibold text-[#1a3a5c]">{listing.address}</p>
              <p className="text-xs text-slate-500">MLS #{listing.mlsNumber}</p>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-green-700 font-semibold">Thank you!</p>
              <p className="text-sm text-slate-600 mt-2">Your inquiry has been sent. Vahid will contact you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  placeholder="Your name"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  placeholder="(123) 456-7890"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  What are you interested in?
                </label>
                <select
                  name="what_they_want"
                  value={formData.what_they_want}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  disabled={loading}
                >
                  <option value="">Select...</option>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Message or questions
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97706]"
                  placeholder="Tell us more about your interest..."
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreedToContact"
                  name="agreedToContact"
                  checked={formData.agreedToContact}
                  onChange={handleChange}
                  className="mt-1"
                  disabled={loading}
                />
                <label htmlFor="agreedToContact" className="text-xs text-slate-700">
                  <span className="font-semibold">I agree:</span> My information will not be shared with third parties. By submitting, I consent to receive email and text messages from Vahid Rajabian and M. David Moallem, Inc. solely for real estate matters.
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#d97706] hover:bg-[#b45309] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryForm;
