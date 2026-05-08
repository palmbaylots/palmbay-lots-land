import React from 'react';

const AccessibilityStatement = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Accessibility Statement</h1>
      
      <p className="text-slate-700 mb-4">
        Vahid Reza Rajabian and M. David Moallem, Inc. are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-6">Conformance Status</h2>
      <p className="text-slate-700 mb-4">
        We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities.
      </p>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-6">Measures to Support Accessibility</h2>
      <ul className="list-disc ml-6 text-slate-700 space-y-2 mb-4">
        <li>Include accessibility as part of our mission statement</li>
        <li>Provide clear navigation and content structure</li>
        <li>Ensure sufficient color contrast throughout the site</li>
        <li>Use descriptive labels for all form inputs</li>
        <li>Support keyboard navigation</li>
        <li>Provide alternative text for images</li>
      </ul>

      <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-6">Feedback</h2>
      <p className="text-slate-700 mb-4">
        We welcome your feedback on the accessibility of this website. Please contact us if you encounter accessibility barriers:
      </p>
      <ul className="list-none text-slate-700 space-y-2 mb-4">
        <li><strong>Phone:</strong> <a href="tel:3213337230" className="text-amber-600 hover:underline">321-333-7230</a></li>
        <li><strong>Email:</strong> <a href="mailto:vahid@palmbayland.com" className="text-amber-600 hover:underline">vahid@palmbayland.com</a></li>
      </ul>

      <p className="text-slate-700">
        We try to respond to feedback within 2 business days.
      </p>
    </div>
  );
};

export default AccessibilityStatement;