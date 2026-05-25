import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
    smsConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      smsConsent: checked
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.smsConsent) {
      toast({
        title: "Consent Required",
        description: "Please check the box to agree to receive text messages before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.data.success) {
        toast({
          title: "Message Sent!",
          description: response.data.message,
        });
        setFormData({ name: '', email: '', phone: '', inquiryType: '', message: '', smsConsent: false });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try calling or emailing directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Contact Vahid Rajabian | Palm Bay Land Broker | 321-333-7230</title>
        <meta name="description" content="Contact Vahid Rajabian — Palm Bay land broker since 2003. Call 321-333-7230 or email vahid@palmbayland.com. Free land value assessments available." />
        <link rel="canonical" href="https://palmbaylots-land.com/contact" />
        <meta property="og:title" content="Contact Vahid Rajabian | Palm Bay Land Broker" />
        <meta property="og:description" content="Call or text 321-333-7230 for land valuation, zoning info, or to discuss buying or selling lots in Palm Bay, FL." />
        <meta property="og:url" content="https://palmbaylots-land.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: 'https://palmbaylots-land.com/contact',
          name: 'Contact Palm Bay Lots-Land',
          description: 'Contact Vahid Reza Rajabian — Palm Bay land broker since 2003. Call, text, or email for land valuation, zoning, or buying/selling Palm Bay lots.',
          dateModified: new Date().toISOString().split('T')[0],
          mainEntity: {
            '@type': 'RealEstateAgent',
            name: 'Vahid Reza Rajabian',
            telephone: '321-333-7230',
            email: 'vahid@palmbayland.com',
            url: 'https://palmbaylots-land.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '1663 Georgia St NE Suite 700',
              addressLocality: 'Palm Bay',
              addressRegion: 'FL',
              postalCode: '32907',
              addressCountry: 'US'
            },
            areaServed: ['Palm Bay, FL', 'Brevard County, FL', 'Melbourne, FL']
          }
        })}</script>
      </Helmet>
      {/* Hero Section - Strong headline */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-amber-400 mb-4">
              Buying or Selling Land in Palm Bay? Let's Talk.
            </h1>
            <p className="text-lg text-gray-300">
              Commercial, multifamily, and residential lots — straight answers, real numbers, no pressure.
            </p>
            {/* Prominent Phone Number */}
            <div className="mt-8">
              <a 
                href="tel:3213337230" 
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xl font-bold transition-colors"
              >
                <Phone className="w-6 h-6" />
                Call or Text: 321-333-7230
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Me - Credibility Block */}
      <section className="py-10 bg-amber-50 border-b-2 border-amber-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Why Work With Me</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-slate-800 font-medium">Selling Palm Bay land since 2003</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-slate-800 font-medium">Worked with individual owners, builders, and national developers</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-slate-800 font-medium">I tell you the truth — even when it costs me a deal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              {/* Phone number repeated above form */}
              <div className="mb-6 p-4 bg-slate-900 rounded-lg text-center">
                <p className="text-gray-300 text-sm mb-1">Prefer to talk?</p>
                <a href="tel:3213337230" className="text-amber-400 text-2xl font-bold hover:text-amber-300 transition-colors">
                  321-333-7230
                </a>
                <p className="text-gray-400 text-sm mt-1">Call or Text Anytime</p>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Land Value or Zoning Information</h2>
              {/* Form purpose text */}
              <p className="text-slate-600 mb-6 italic">
                Tell me what you're looking for and I'll tell you what's actually available — not what's advertised.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(321) 555-0123"
                    className="w-full"
                  />
                </div>
                
                {/* Inquiry Type Dropdown - Lead Qualification */}
                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-slate-700 mb-2">
                    How Can I Help? *
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    required
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="">Select an option...</option>
                    <option value="sell">I want to sell land</option>
                    <option value="buy">I want to buy land</option>
                    <option value="zoning">I need zoning / parcel info</option>
                    <option value="other">Other inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Tell Me More *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What property are you interested in? What's your timeline? Any specific requirements?"
                    rows={4}
                    className="w-full"
                  />
                </div>
                
                {/* SMS Consent Checkbox */}
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <p className="text-sm font-semibold text-slate-800 mb-2">SMS Text Message Consent</p>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="smsConsent"
                      checked={formData.smsConsent}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-0.5 h-4 w-4"
                    />
                    <label htmlFor="smsConsent" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                      <span className="font-semibold">Yes, I agree to receive text messages from Vahid Reza Rajabian</span> at the phone number provided. You will receive 1 SMS message confirming your inquiry was received. Message and data rates may apply. Text STOP to cancel, HELP for help.
                    </label>
                  </div>
                </div>


                <Button 
                  type="submit" 
                  disabled={isSubmitting || !formData.smsConsent}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-semibold disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-500 mt-3 text-center leading-relaxed">
                  By submitting this form, you consent to receive SMS text messages, emails, and phone calls 
                  regarding your inquiry. Standard message and data rates may apply.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
              <div className="space-y-5">
                {/* Phone - More Prominent */}
                <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                      <a href="tel:3213337230" className="text-amber-700 hover:text-amber-800 text-2xl font-bold transition-colors">
                        321-333-7230
                      </a>
                      <p className="text-sm text-slate-700 mt-1 font-medium">Call or Text Anytime</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Email</h3>
                      <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
                        vahid@palmbayland.com
                      </a>
                      <p className="text-sm text-slate-600 mt-1">I respond personally within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">Office Location</h3>
                      <p className="text-slate-700">M. David Moallem, Inc.</p>
                      <p className="text-slate-700">1663 Georgia St NE #700</p>
                      <p className="text-slate-700">Palm Bay, FL 32907</p>
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=1663+Georgia+St+NE+%23700+Palm+Bay+FL+32907"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Map
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Hours with availability language */}
                <div className="bg-slate-900 text-white p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-4">Office Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Saturday:</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sunday:</span>
                      <span className="font-medium">By Appointment</span>
                    </div>
                  </div>
                  <p className="mt-4 pt-4 border-t border-slate-700 text-gray-300 text-sm italic">
                    If I miss your call, I return messages personally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
