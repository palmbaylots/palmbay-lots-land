import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, BookOpen, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Blog posts - with links to actual content
const blogPosts = [
  {
    slug: 'is-palm-bay-good-investment-2025',
    title: 'Why Investors Are Buying Land in Palm Bay, Florida in 2026',
    excerpt: 'Palm Bay is one of Florida\'s fastest-growing cities. Here\'s why smart investors, builders, and families are buying lots now — and how to get started with owner financing.',
    date: 'April 2026',
    readTime: '10 min read',
    category: 'Investment',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/uh4y9lfx_image.png',
    hasContent: true
  },
  {
    slug: 'how-owner-financing-works',
    title: 'How to Buy Land in Palm Bay With No Bank — Owner Financing Explained',
    excerpt: 'Buy land in Palm Bay, Florida without bank approval. Learn exactly how owner financing works, what it costs, and how to get started with as little as 25% down.',
    date: 'April 2026',
    readTime: '10 min read',
    category: 'Financing',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/drfpkn57_image.png',
    hasContent: true
  },
  {
    slug: 'building-costs-palm-bay',
    title: 'Cost to Build a Home in Palm Bay, Florida in 2026 — Full Breakdown',
    excerpt: 'How much does it cost to build a home in Palm Bay, FL in 2026? Full breakdown of land, permits, construction, utilities, and landscaping costs — with a real $363,000 example.',
    date: 'April 2026',
    readTime: '9 min read',
    category: 'Building',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/5mul8t6i_image.png',
    hasContent: true
  },
  {
    slug: 'palm-bay-zoning-explained',
    title: 'Palm Bay Residential Zoning Explained — RS-1, RS-2, RS-3, Corner Lots & Pie-Shaped Lots',
    excerpt: 'What can you build on a residential lot in Palm Bay? RS-1, RS-2, RS-3 setbacks, lot sizes, corner lot rules, and pie-shaped lots — the full 2026 guide.',
    date: 'May 2026',
    readTime: '8 min read',
    category: 'Zoning',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/1qlykxsv_image.png',
    hasContent: true
  },
  {
    slug: 'palm-bay-commercial-zoning-explained',
    title: 'Palm Bay Commercial, Multifamily & Industrial Zoning Explained — NC, CC, HC, GC, RM, IU & HI',
    excerpt: 'Planning to build commercial, multifamily, or industrial in Palm Bay? NC, CC, HC, GC, RM-15, RM-20, IU, HI — what each zone allows, what it costs to rezone, and how to find the right parcel.',
    date: 'May 2026',
    readTime: '8 min read',
    category: 'Zoning',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/8t9keyvw_image.png',
    hasContent: true
  },
  {
    slug: 'city-water-vs-well-septic',
    title: 'City Water vs. Well & Septic in Palm Bay — An Honest Comparison',
    excerpt: 'Well and septic isn\'t the inferior option people assume. Here\'s an honest comparison — real costs, real advantages, and what actually matters for your situation.',
    date: 'April 2026',
    readTime: '7 min read',
    category: 'Utilities',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/e96ydvyw_image.png',
    hasContent: true
  },
  {
    slug: 'flood-zones-palm-bay',
    title: 'Understanding Flood Zones in Palm Bay — What Land Buyers Actually Need to Know',
    excerpt: 'Nearly all of Palm Bay is in some type of flood zone — but that doesn\'t mean what most people think. Here\'s what matters and why most lots end up above flood risk.',
    date: 'April 2026',
    readTime: '6 min read',
    category: 'Due Diligence',
    image: 'https://customer-assets.emergentagent.com/job_a74cb13c-f46b-4ec9-916c-be1fdcdeedb8/artifacts/ter4yuyo_image.png',
    hasContent: true
  }
];

const Blog = () => {
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
        <meta name="description" content="Expert guides on buying land in Palm Bay, Florida. Investment tips, financing options, building costs, zoning explained, and local market insights from a 20+ year expert." />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.slug} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
                      {post.hasContent ? (
                        <Link to={`/blog/${post.slug}`}>
                          <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-amber-600 transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                      ) : (
                        <h2 className="text-lg font-bold text-slate-900 mb-2">
                          {post.title}
                        </h2>
                      )}
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">{post.date}</span>
                        {post.hasContent ? (
                          <Link 
                            to={`/blog/${post.slug}`}
                            className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:text-amber-700"
                          >
                            Read Article
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-sm font-semibold">
                            Coming Soon
                          </span>
                        )}
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
