import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Star, MessageSquareQuote, Loader2, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const emptyForm = { name: 'Verified Client', title: '', text: '', source: 'Google', rating: 5, order: 0 };

/**
 * Reviews management tab — add/edit/delete client reviews that show on the
 * homepage. Uses the same blog API key the parent unlocks with the page password.
 */
const AdminReviewsTab = ({ adminPassword }) => {
  const [apiKey, setApiKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Unlock the API key with the admin password (same flow as blogs)
  useEffect(() => {
    let cancelled = false;
    axios.post(`${API}/admin/blog-key`, { password: adminPassword })
      .then((res) => { if (!cancelled) setApiKey(res.data.key); })
      .catch((err) => { if (!cancelled) setKeyError(err.response?.data?.detail || 'Could not retrieve admin key'); });
    return () => { cancelled = true; };
  }, [adminPassword]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/reviews`);
      setReviews(res.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };
  useEffect(() => { fetchReviews(); }, []);

  const showToast = (msg, kind = 'success') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 3500);
  };
  const authHeaders = () => ({ Authorization: `Bearer ${apiKey}` });
  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openCreate = () => { setEditingId(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (r) => {
    setEditingId(r.id);
    setForm({ name: r.name || 'Verified Client', title: r.title || '', text: r.text || '', source: r.source || 'Google', rating: r.rating || 5, order: r.order || 0 });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!apiKey) { showToast('Admin key not loaded yet', 'error'); return; }
    if (!form.text.trim()) { showToast('Review text is required', 'error'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await axios.patch(`${API}/reviews/${editingId}`, form, { headers: authHeaders() });
        showToast('Review updated.');
      } else {
        await axios.post(`${API}/reviews`, form, { headers: authHeaders() });
        showToast('Review added — it is now live on the homepage.');
      }
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Save failed', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/reviews/${id}`, { headers: authHeaders() });
      showToast('Review deleted.');
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Delete failed', 'error');
    }
  };

  const handleSeed = async () => {
    if (!apiKey) { showToast('Admin key not loaded yet', 'error'); return; }
    try {
      const res = await axios.post(`${API}/reviews/seed`, {}, { headers: authHeaders() });
      showToast(res.data.seeded ? `Loaded ${res.data.seeded} existing reviews.` : 'Reviews already loaded.');
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.detail || 'Load failed', 'error');
    }
  };

  if (keyError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <p className="font-semibold mb-1">Couldn't load the admin key</p>
        <p className="text-sm">{keyError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${toast.kind === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-slate-600">{reviews.length} review{reviews.length !== 1 ? 's' : ''} on the homepage.</p>
        <div className="flex gap-2 w-full sm:w-auto">
          {reviews.length === 0 && (
            <Button onClick={handleSeed} disabled={!apiKey} variant="outline" className="w-full sm:w-auto">
              Load existing reviews
            </Button>
          )}
          <Button onClick={openCreate} disabled={!apiKey} className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto text-base py-6 sm:py-2">
            <Plus className="w-5 h-5 mr-2" /> New Review
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-600 p-8 text-center">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border">
          <MessageSquareQuote className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No reviews yet. Click "Load existing reviews" to bring in your current ones, or add a new one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-lg shadow p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(r.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                  <span className="text-xs text-slate-400">{r.source}</span>
                </div>
                <p className="text-slate-700 text-sm">{r.text}</p>
                <p className="text-xs text-slate-500 mt-1">{r.name}{r.title ? ` · ${r.title}` : ''}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(r)} className="p-2 bg-amber-100 text-amber-600 rounded hover:bg-amber-200"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(r.id)} disabled={!apiKey} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Review' : 'New Review'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Review text *</label>
                <Textarea value={form.text} onChange={(e) => updateField('text', e.target.value)} rows={5} placeholder="Paste the client's review here" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name shown</label>
                  <Input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Verified Client" />
                  <p className="text-xs text-slate-500 mt-1">Use "Verified Client" for privacy, or a first name.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                  <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Lot Buyer / Land Seller" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                  <Input value={form.source} onChange={(e) => updateField('source', e.target.value)} placeholder="Google / RateMyAgent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stars</label>
                  <select value={form.rating} onChange={(e) => updateField('rating', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-slate-50 border-t px-6 py-4 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700" disabled={saving || !apiKey}>
                {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Send className="w-4 h-4 mr-2" /> {editingId ? 'Save Changes' : 'Add Review'}</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsTab;
