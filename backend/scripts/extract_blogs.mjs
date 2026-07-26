// One-shot helper that converts /app/frontend/src/data/blogContent.js
// into /app/backend/seed_blogs.json so the FastAPI startup can seed MongoDB
// without parsing JavaScript at runtime.
//
// Usage: node /app/backend/scripts/extract_blogs.mjs
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const src = '/app/frontend/src/data/blogContent.js';
const out = '/app/backend/seed_blogs.json';

const mod = await import(pathToFileURL(src).href);
const data = mod.blogContent || mod.default;

const docs = Object.entries(data).map(([slug, post]) => ({
  slug,
  title: post.title,
  metaTitle: post.metaTitle || post.title,
  metaDescription: post.metaDescription || post.subtitle || '',
  subtitle: post.subtitle || '',
  category: post.category || 'General',
  date: post.date || '',
  readTime: post.readTime || '5 min read',
  image: post.image || '',
  content: post.content || '',
  faqs: Array.isArray(post.faqs) ? post.faqs : [],
}));

fs.writeFileSync(out, JSON.stringify(docs, null, 2));
console.log(`Wrote ${docs.length} blogs → ${out}`);
