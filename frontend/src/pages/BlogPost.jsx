import React, { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Phone, ArrowLeft, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { blogContent } from '../data/blogContent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Permanent redirects for renamed/legacy slugs (preserves SEO + existing GSC index)
const SLUG_REDIRECTS = {
  'city-water-vs-well-septic': 'city-water-vs-well-water',
};

const BlogPost = () => {
  const { slug } = useParams();
  // Seed from static fallback so we render immediately (no flash); upgrade to live API data on mount.
  const [post, setPost] = useState(() => blogContent[slug] || null);
  const [loading, setLoading] = useState(!blogContent[slug]);

  useEffect(() => {
    if (SLUG_REDIRECTS[slug]) return;
    let cancelled = false;
    axios.get(`${API}/blogs/${slug}`)
      .then((res) => {
        if (!cancelled && res.data) {
          setPost(res.data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  // Handle legacy slug redirects
  if (SLUG_REDIRECTS[slug]) {
    return <Navigate to={`/blog/${SLUG_REDIRECTS[slug]}`} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading article…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Helmet>
          <title>Article Not Found | Palm Bay Lots-Land Blog</title>
          <meta name="description" content="This blog article could not be found. Browse our latest Palm Bay land buying guides and market analysis." />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href={`https://palmbaylots-land.com/blog/${slug}`} />
        </Helmet>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-amber-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const todayDate = new Date().toISOString().split('T')[0];

  // Parse a human-readable date like "May 2026" to ISO. Fallback to today.
  const parsePostDate = (dateStr) => {
    if (!dateStr) return todayDate;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? todayDate : d.toISOString().split('T')[0];
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.subtitle,
    "image": post.image || "https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png",
    "author": {
      "@type": "Person",
      "name": "Vahid Reza Rajabian",
      "url": "https://palmbaylots-land.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Palm Bay Lots-Land",
      "url": "https://palmbaylots-land.com",
      "telephone": "321-333-7230",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "1663 Georgia St NE Suite 700",
        "addressLocality": "Palm Bay",
        "addressRegion": "FL",
        "postalCode": "32907",
        "addressCountry": "US"
      },
      "logo": {
        "@type": "ImageObject",
        "url": "https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png"
      }
    },
    "datePublished": parsePostDate(post.date),
    "dateModified": todayDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://palmbaylots-land.com/blog/${slug}`
    },
    "url": `https://palmbaylots-land.com/blog/${slug}`
  };

  // Generate FAQ schema from blog post FAQs
  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  return (
    <>
      <Helmet>
        <title>{post.metaTitle || `${post.title} | Palm Bay Land Guide`}</title>
        <meta name="description" content={post.metaDescription || post.subtitle} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://palmbaylots-land.com/blog/${slug}`} />
        <meta property="og:title" content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.subtitle} />
        <meta property="og:url" content={`https://palmbaylots-land.com/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image || "https://customer-assets.emergentagent.com/job_palmbayhomes/artifacts/am09bmq5_Untitled.png"} />
        <meta property="article:published_time" content={parsePostDate(post.date)} />
        <meta property="article:modified_time" content={todayDate} />
        <meta property="article:author" content="Vahid Reza Rajabian" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to All Articles
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-amber-600 rounded-full text-sm font-bold">{post.category}</span>
                <span className="text-gray-400">{post.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-xl text-gray-300">{post.subtitle}</p>
              <p className="text-gray-500 mt-4">By Vahid Rajabian · {post.date}</p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <article 
                className="prose prose-slate prose-lg max-w-none
                  prose-headings:text-slate-900 prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-li:text-slate-700
                  prose-strong:text-slate-900
                  prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* FAQs */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12 bg-slate-100 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-amber-600" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {post.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                        <p className="text-slate-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Box */}
              <div className="mt-12 bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-500">
                <p className="text-sm text-slate-500 mb-2">About the Author</p>
                <h3 className="text-xl font-bold text-slate-900">Vahid Rajabian</h3>
                <p className="text-slate-600 mt-2">
                  Broker Associate at M. David Moallem, Inc. with 20+ years of experience selling land in Palm Bay, Florida. 
                  Thousands of lots sold to individuals, builders, and investors since 2003.
                </p>
                <a href="tel:3213337230" className="inline-flex items-center gap-2 mt-4 text-amber-600 font-semibold hover:text-amber-700">
                  <Phone className="w-4 h-4" />
                  321-333-7230
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Buy Land in Palm Bay?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Talk to an expert who knows this market inside and out. No pressure — just honest answers to your questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:3213337230"
                className="px-10 py-5 bg-amber-500 text-white rounded-lg text-xl font-bold hover:bg-amber-600 transition-colors"
              >
                Call 321-333-7230
              </a>
              <Link 
                to="/listings"
                className="px-10 py-5 bg-white text-slate-900 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Available Lots
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPost;
