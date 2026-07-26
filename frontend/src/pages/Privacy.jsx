import React from 'react';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Privacy Policy | Palm Bay Lots & Land</title>
        <meta name="description" content="Privacy Policy for palmbaylots-land.com. Learn what information we collect and how we use it." />
        <link rel="canonical" href="https://palmbaylots-land.com/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Privacy Policy</h1>
          <p className="text-gray-300">Last Updated: July 16, 2026</p>
          <p className="text-gray-300">Effective date: July 16, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 mb-6">
                This website is operated by Vahid Rajabian, Broker Associate, M. David Moallem, Inc. ("we," "us"). This policy explains what information we collect and how we use it.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information we collect</h2>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li><strong>Information you give us:</strong> when you submit a contact or request-information form, we collect your name, email address, phone number, and any message you send.</li>
                <li><strong>Automatically collected:</strong> like most websites, we use Google Analytics, which sets cookies to collect anonymous usage data such as pages visited, browser type, approximate location, and time on site.</li>
                <li><strong>Stored locally:</strong> if you save favorite lots, that list is stored in your own browser (localStorage) on your device and is not sent to us.</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">How we use your information</h2>
              <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">
                <li>To respond to your inquiries and provide real estate services.</li>
                <li>To understand how visitors use our site and improve it.</li>
                <li>We do NOT sell your personal information.</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
              <p className="text-slate-700 mb-6">
                Our website uses cookies and similar tracking technologies, including Google Analytics, to understand how visitors use our site and to improve your experience. Google Analytics collects anonymous usage data such as pages visited, browser type, and approximate location. You can set your browser to refuse cookies, or opt out of Google Analytics at{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a>. Some features of the website may not function properly without cookies.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third parties</h2>
              <p className="text-slate-700 mb-6">
                We use Google Analytics (governed by Google's Privacy Policy). We may share your contact information only as needed to provide real estate services (for example, with a title company during a transaction) or as required by law.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data retention and security</h2>
              <p className="text-slate-700 mb-6">
                We keep inquiry information only as long as needed to serve you and meet legal or recordkeeping requirements. We use reasonable measures to protect your information.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children</h2>
              <p className="text-slate-700 mb-6">
                This site is not directed to children under 13, and we do not knowingly collect their information.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your choices</h2>
              <p className="text-slate-700 mb-6">
                You may request that we delete your inquiry information by contacting us. "Do Not Track" browser signals are not currently responded to.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact us</h2>
              <div className="text-slate-700 leading-relaxed">
                <p className="mb-1"><strong>Vahid Rajabian, Broker Associate</strong></p>
                <p className="mb-1">M. David Moallem, Inc. | License #BK3454072</p>
                <p className="mb-1">1663 Georgia St NE, Suite 700, Palm Bay, FL 32907</p>
                <p className="mb-1">Phone: <a href="tel:3213337230" className="text-amber-600 hover:underline">321-333-7230</a></p>
                <p className="mb-1">Email: <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:underline">vahid@palmbayland.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
