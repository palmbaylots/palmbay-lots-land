import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, RefreshCw, BookOpen, Send, Upload, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const emptyForm = {
  slug: '',
  title: '',
  metaTitle: '',
  metaDescription: '',
  subtitle: '',
  category: 'General',
  date: '',
  readTime: '5 min read',
  image: '',
  content: '',
  faqs: [],
};

/**
 * Blogs management tab — depends on the parent component having unlocked the
 * blog API key via /api/admin/blog-key (page password gate).
 */
const AdminBlogsTab = ({ adminPassword }) => {
  const [apiKey, setApiKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  // Fetch API key once (uses the admin page password we already passed in)
  useEffect(() => {
    let cancelled = false;
    axios.post(`${API}/admin/blog-key`, { password: adminPassword })
      .then((res) => { if (!cancelled) setApiKey(res.data.key); })
      .catch((err) => {
        if (!cancelled) setKeyError(err.response?.data?.detail || 'Could not retrieve blog API key');
      });
    return () => { cancelled = true; };
  }, [adminPassword]);

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs`);
      setBlogs(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };

  const authHeaders = () => ({ Authorization: `Bearer ${apiKey}` });

  // ---- form handlers ----
  const openCreate = () => {
    setEditingSlug(null);
    setForm({ ...emptyForm, date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) });
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingSlug(post.slug);
    setForm({
      slug: post.slug,
      title: post.title || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      subtitle: post.subtitle || '',
      category: post.category || 'General',
      date: post.date || '',
      readTime: post.readTime || '5 min read',
      image: post.image || '',
      content: post.content || '',
      faqs: Array.isArray(post.faqs) ? post.faqs : [],
    });
    setShowModal(true);
  };

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const slugify = (s) =>
    s.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);

  const handleTitleChange = (v) => {
    setForm((f) => ({
      ...f,
      title: v,
      // Auto-generate slug for new posts only
      slug: editingSlug ? f.slug : slugify(v),
    }));
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Pick an image file.', 'error'); return; }
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API}/upload-image`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateField('image', `${BACKEND_URL}${res.data.url}`);
    } catch (err) {
      showToast(err.response?.data?.detail || 'Upload failed', 'error');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // FAQ helpers
  const addFaq = () => updateField('faqs', [...form.faqs, { q: '', a: '' }]);
  const updateFaq = (i, k, v) => updateField('faqs', form.faqs.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)));
  const removeFaq = (i) => updateField('faqs', form.faqs.filter((_, idx) => idx !== i));

  // Save
  const handleSave = async () => {
    if (!apiKey) { showToast('Blog API key not loaded', 'error'); return; }
    if (!form.slug || !form.title || !form.content) {
      showToast('Slug, title, and content are required', 'error');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      showToast('Slug must be lowercase letters, numbers, and hyphens only', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingSlug) {
        const { slug, ...patch } = form;
        await axios.patch(`${API}/blogs/${editingSlug}`, patch, { headers: authHeaders() });
        showToast('Blog updated. Indexing pings queued.');
      } else {
        await axios.post(`${API}/blogs`, form, { headers: authHeaders() });
        showToast('Blog published. Indexing pings queued.');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!window.confirm(`Delete blog "${slug}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/blogs/${slug}`, { headers: authHeaders() });
      showToast('Blog deleted.');
      fetchBlogs();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  const handleReindex = async (slug) => {
    try {
      await axios.post(`${API}/blogs/${slug}/reindex`, {}, { headers: authHeaders() });
      showToast('Re-pinging Google + IndexNow…');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Re-ping failed', 'error');
    }
  };

  if (keyError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700" data-testid="blog-key-error">
        <p className="font-semibold mb-1">Couldn't load blog publishing key</p>
        <p className="text-sm">{keyError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="admin-blogs-tab">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.kind === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}
          data-testid="blog-toast"
        >
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-600">
          {blogs.length} blog{blogs.length !== 1 ? 's' : ''} published.
          {apiKey ? '' : ' (loading API key…)'}
        </p>
        <Button onClick={openCreate} disabled={!apiKey} className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto text-base py-6 sm:py-2" data-testid="add-blog-btn">
          <Plus className="w-5 h-5 mr-2" /> New Blog
        </Button>
      </div>

      {loading ? (
        <div className="text-slate-600 p-8 text-center">Loading…</div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No blog posts yet.</p>
          <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" /> Create your first blog
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((b) => (
                <tr key={b.slug} className="hover:bg-amber-50" data-testid={`blog-row-${b.slug}`}>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-md truncate">{b.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{b.slug}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{b.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{b.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReindex(b.slug)}
                        disabled={!apiKey}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                        title="Re-ping Google + IndexNow"
                        data-testid={`reindex-blog-${b.slug}`}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="p-2 bg-amber-100 text-amber-600 rounded hover:bg-amber-200"
                        data-testid={`edit-blog-${b.slug}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.slug)}
                        disabled={!apiKey}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"
                        data-testid={`delete-blog-${b.slug}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSlug ? `Edit: ${editingSlug}` : 'New Blog Post'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <Input
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., How to Buy Land in Palm Bay"
                  data-testid="blog-input-title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Slug * (URL)</label>
                  <Input
                    value={form.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="how-to-buy-land-palm-bay"
                    disabled={!!editingSlug}
                    data-testid="blog-input-slug"
                  />
                  <p className="text-xs text-slate-500 mt-1">/blog/{form.slug || '(slug)'} — lowercase, hyphens only</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <Input value={form.category} onChange={(e) => updateField('category', e.target.value)} placeholder="Investment" data-testid="blog-input-category" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date (display)</label>
                  <Input value={form.date} onChange={(e) => updateField('date', e.target.value)} placeholder="June 2026" data-testid="blog-input-date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Read time</label>
                  <Input value={form.readTime} onChange={(e) => updateField('readTime', e.target.value)} placeholder="7 min read" data-testid="blog-input-readtime" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title (SEO)</label>
                <Input value={form.metaTitle} onChange={(e) => updateField('metaTitle', e.target.value)} placeholder="Defaults to Title if blank" data-testid="blog-input-metatitle" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description (SEO)</label>
                <Textarea value={form.metaDescription} onChange={(e) => updateField('metaDescription', e.target.value)} placeholder="155-character SEO description" rows={2} data-testid="blog-input-metadescription" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle / Excerpt</label>
                <Textarea value={form.subtitle} onChange={(e) => updateField('subtitle', e.target.value)} placeholder="Lead paragraph shown under the title" rows={2} data-testid="blog-input-subtitle" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hero Image</label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={(e) => updateField('image', e.target.value)} placeholder="Paste image URL or upload →" data-testid="blog-input-image" />
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="shrink-0">
                    {uploadingImage ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4 mr-2" /> Upload</>}
                  </Button>
                </div>
                {form.image && <img src={form.image} alt="" className="mt-2 w-40 h-28 object-cover rounded border" />}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content (HTML) *</label>
                <Textarea
                  value={form.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  placeholder="Full article HTML — use <h2>, <p>, <ul>, <a> etc."
                  rows={14}
                  className="font-mono text-sm"
                  data-testid="blog-input-content"
                />
                <p className="text-xs text-slate-500 mt-1">HTML is rendered as-is. Use the same style as existing posts for consistency.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">FAQs (for FAQ schema)</label>
                  <Button type="button" variant="outline" size="sm" onClick={addFaq} data-testid="blog-add-faq">
                    <Plus className="w-3 h-3 mr-1" /> Add FAQ
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.faqs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">FAQ #{i + 1}</span>
                        <button onClick={() => removeFaq(i)} className="text-red-600 hover:text-red-800 text-xs" data-testid={`blog-remove-faq-${i}`}>Remove</button>
                      </div>
                      <Input value={faq.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} placeholder="Question" data-testid={`blog-faq-q-${i}`} />
                      <Textarea value={faq.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} placeholder="Answer" rows={2} data-testid={`blog-faq-a-${i}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
              <Button
                onClick={handleSave}
                className="bg-amber-600 hover:bg-amber-700"
                disabled={saving || !apiKey}
                data-testid="blog-save-btn"
              >
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Send className="w-4 h-4 mr-2" /> {editingSlug ? 'Save Changes' : 'Publish + Ping Search Engines'}</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogsTab;
