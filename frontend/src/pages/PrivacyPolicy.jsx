import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Privacy Policy | Palm Bay Lots & Land</title>
        <meta name="description" content="Privacy Policy for palmbaylots-land.com. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://palmbaylots-land.com/privacy-policy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Last Updated: December 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            
            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-700 mb-6">
                M. David Moallem, Inc. and Vahid Reza Rajabian ("we," "our," or "us") respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-700 mb-4">We may collect information about you in a variety of ways, including:</p>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and mailing address that you voluntarily provide when filling out forms on our website.</li>
                <li><strong>Contact Form Submissions:</strong> Information you provide when contacting us through our website forms.</li>
                <li><strong>Communication Preferences:</strong> Your preferences for receiving communications from us.</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <p className="text-slate-700 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li>Respond to your inquiries and fulfill your requests</li>
                <li>Send you information about properties, deals, and real estate opportunities</li>
                <li>Communicate with you via email, phone, or SMS about your inquiries</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
              <p className="text-slate-700 mb-6">
                <strong>We do not sell, trade, rent, or share your personal information with third parties for their marketing purposes.</strong> We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li><strong>Service Providers:</strong> We may share information with trusted service providers who assist us in operating our website and conducting our business (e.g., email services, SMS providers), subject to confidentiality agreements.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">SMS/Text Message Consent</h2>
              <p className="text-slate-700 mb-6">
                By providing your phone number and submitting a contact form on our website, you consent to receive SMS/text messages from us regarding your inquiry and real estate opportunities. Message and data rates may apply. You can opt out at any time by replying <strong>STOP</strong> to any message. Reply <strong>HELP</strong> for assistance.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-700 mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications at any time</li>
                <li>Opt out of SMS messages by replying STOP</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
              <p className="text-slate-700 mb-6">
                Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can set your browser to refuse cookies, but some features of the website may not function properly.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links</h2>
              <p className="text-slate-700 mb-6">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-700 mb-6">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-700 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-slate-50 p-6 rounded-lg mb-6">
                <p className="text-slate-700"><strong>Vahid Reza Rajabian</strong></p>
                <p className="text-slate-700">M. David Moallem, Inc.</p>
                <p className="text-slate-700">1663 Georgia St NE #700</p>
                <p className="text-slate-700">Palm Bay, FL 32907</p>
                <p className="text-slate-700">Phone: <a href="tel:3213337230" className="text-amber-600 hover:underline">321-333-7230</a></p>
                <p className="text-slate-700">Email: <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:underline">vahid@palmbayland.com</a></p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <Link to="/" className="text-amber-600 hover:text-amber-700 font-semibold">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
