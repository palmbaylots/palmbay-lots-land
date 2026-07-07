import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Production reCAPTCHA v2 Site Key
const RECAPTCHA_SITE_KEY = '6Ld6n0csAAAAACRRArAW-vltcD_BiHwkUinAZC77';

// Detect mobile / small viewports — popup never shows on these
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const smallViewport = window.innerWidth < 768;
  return mobileUA || smallViewport;
};

const LeadCaptureModal = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreedToContact: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const recaptchaRef = useRef(null);
  const triggeredRef = useRef(false);

  // Popup opens after the visitor has been on the site for 40 seconds
  useEffect(() => {
    if (isMobileDevice()) return;
    if (localStorage.getItem('leadCaptureInteracted')) return;

    const timer = setTimeout(() => {
      if (!triggeredRef.current) {
        triggeredRef.current = true;
        setIsOpen(true);
      }
    }, 40000);

    return () => clearTimeout(timer);
  }, []);

  // Exit-intent detection — popup opens when mouse moves toward top of viewport (closing the tab)
  useEffect(() => {
    if (isMobileDevice()) return;
    if (localStorage.getItem('leadCaptureInteracted')) return;

    const handleMouseLeave = (e) => {
      // Only trigger if cursor leaves through the top edge (heading for tab close / address bar)
      if (e.clientY <= 0 && !triggeredRef.current) {
        triggeredRef.current = true;
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('leadCaptureInteracted', 'true');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      agreedToContact: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreedToContact) {
      alert('Please consent to be contacted to continue.');
      return;
    }

    if (!captchaValue) {
      alert('Please complete the CAPTCHA verification.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, {
        ...formData,
        captchaToken: captchaValue
      });
      setSubmitted(true);
      localStorage.setItem('leadCaptureInteracted', 'true');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('There was an error submitting your information. Please try again.');
      // Reset captcha on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setCaptchaValue(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-capture-title"
    >
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <h2 id="lead-capture-title" className="text-2xl font-bold text-slate-900 mb-2">
              Find Your Perfect Property
            </h2>
            <p className="text-slate-600 mb-6">
              Get exclusive access to new listings and property information. Let me help you find the ideal lot or home in Palm Bay.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-name" className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <Input
                  id="lead-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="lead-email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <Input
                  id="lead-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  aria-required="true"
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <Input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(321) 555-0123"
                  aria-required="true"
                />
              </div>

              <div className="flex items-start gap-2 py-2">
                <Checkbox
                  id="lead-consent"
                  checked={formData.agreedToContact}
                  onCheckedChange={handleCheckboxChange}
                  aria-required="true"
                  className="mt-0.5"
                />
                <label htmlFor="lead-consent" className="text-[10px] text-slate-500 leading-tight">
                  I agree to receive calls, emails, and text messages about properties. Message and data rates may apply. I can opt-out anytime. <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Google reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={onCaptchaChange}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !formData.agreedToContact || !captchaValue}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 font-semibold"
              >
                {isSubmitting ? 'Submitting...' : 'Get Property Updates'}
              </Button>
              
              <p className="text-[9px] text-slate-400 text-center leading-tight">
                By submitting, you agree to be contacted via calls, emails, and text messages. Message frequency varies. Reply STOP to opt-out. No purchase necessary.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600">
              I'll be in touch with you shortly to discuss your real estate needs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;