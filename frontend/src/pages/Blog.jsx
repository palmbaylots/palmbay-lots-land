import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, BookOpen, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { blogContent as staticBlogContent } from '../data/blogContent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Build a fallback list from the static JS file so the page still renders
// if the API is unavailable (preserves SEO + content visibility).
const fallbackPosts = Object.entries(staticBlogContent).map(([slug, p]) => ({
  slug,
  title: p.title,
  excerpt: p.metaDescription || p.subtitle || '',
  date: p.date,
  readTime: p.readTime,
  category: p.category,
  image: p.image,
}));

const Blog = () => {
  const [posts, setPosts] = useState(fallbackPosts);

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API}/blogs`).then((res) => {
      if (cancelled || !Array.isArray(res.data) || res.data.length === 0) return;
      const live = res.data.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.metaDescription || p.subtitle || '',
        date: p.date,
        readTime: p.readTime,
        category: p.category,
        image: p.image,
      }));
      setPosts(live);
    }).catch(() => { /* keep fallback */ });
    return () => { cancelled = true; };
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Palm Bay Land Guide | Real Estate Tips & Market Insights",
    "description": "Expert guides on buying land in Palm Bay, Florida. Investment tips, financing options, building costs, and local market insights.",
    "url": "https://palmbaylots-land.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Vahid Rajabian - Palm Bay Land Expert"
    }
  };

  return (
    <>
      <Helmet>
        <title>Palm Bay Land Guide | Real Estate Tips & Market Insights</title>
        <meta name="description" content="Palm Bay land buying guides, market updates, zoning explained, owner financing tips, and investment analysis from a 23-year Palm Bay land specialist." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://palmbaylots-land.com/blog" />
        <meta property="og:title" content="Palm Bay Land Guide | Real Estate Tips" />
        <meta property="og:description" content="Expert guides on buying land in Palm Bay. Investment tips, financing, and market insights." />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 rounded-full text-sm font-bold mb-6">
                <BookOpen className="w-4 h-4" />
                PALM BAY LAND GUIDE
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Learn Before You Buy
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Free guides and insights from a Palm Bay land expert with 20+ years of experience. Make smarter land buying decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="blog-posts-grid">
                {posts.map((post) => (
                  <article key={post.slug} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow" data-testid={`blog-card-${post.slug}`}>
                    {post.image ? (
                      <div className="h-40 overflow-hidden">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-amber-400 opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                          {post.category}
                        </span>
                        <span className="text-slate-400 text-xs">{post.readTime}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-amber-600 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{post.date}</span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:text-amber-700"
                          data-testid={`blog-read-${post.slug}`}
                        >
                          Read Article
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-amber-50 border-y-2 border-amber-200">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Want Land Buying Tips?
              </h2>
              <p className="text-slate-600 mb-6">
                Get notified when new guides are published. Plus, receive exclusive lot deals before they hit the market.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-colors"
              >
                Join the List
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Skip the reading and talk to an expert directly. I'm happy to answer any questions about Palm Bay land.
            </p>
            <a
              href="tel:3213337230"
              className="inline-flex items-center gap-2 px-10 py-5 bg-amber-500 text-white rounded-lg text-xl font-bold hover:bg-amber-600 transition-colors"
            >
              <Phone className="w-6 h-6" />
              Call 321-333-7230
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;
