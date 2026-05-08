import React from 'react';
import { Share2, Facebook, Linkedin, Instagram, MessageCircle } from 'lucide-react';

const SocialShareButtons = () => {
  const pageUrl = window.location.href;
  const pageTitle = 'Vahid Rajabian - Palm Bay Florida Real Estate';
  const pageDescription = 'Find residential lots, land, and new homes for sale in Palm Bay, Florida. 20+ years experience. Owner financing available.';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(pageTitle + ' - ' + pageUrl)}`,
    // TikTok doesn't have direct share URL, so we'll link to the profile
    tiktok: 'https://www.tiktok.com/'
  };

  const socialProfiles = {
    facebook: 'https://www.facebook.com/vahid.rajabian.144',
    linkedin: 'https://www.linkedin.com/in/vahid-rajabian',
    instagram: 'https://www.instagram.com/lotsandland',
    tiktok: 'https://www.tiktok.com/@lots_and_land'
  };

  return (
    <div className="bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Share Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Share This Page</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-5 h-5" />
                <span>Share on Facebook</span>
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                <span>Share on LinkedIn</span>
              </a>
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Share on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Follow Section */}
          <div className="text-center border-t border-gray-700 pt-8">
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <p className="text-gray-300 mb-4">Stay connected for the latest property listings and real estate news</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={socialProfiles.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                aria-label="Follow on Facebook"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a
                href={socialProfiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                aria-label="Follow on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={socialProfiles.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                aria-label="Follow on Instagram"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a
                href={socialProfiles.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                aria-label="Follow on TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Update social media links in SocialShareButtons.jsx with your actual profiles
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialShareButtons;
