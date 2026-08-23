import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Phone } from 'lucide-react';

// Reusable "See Price & Financing" modal. Mirrors the calculator on the
// Inventory page (same formulas + compliance disclosures) so the map popup
// shows identical price, 25%/35% options, down-payment slider, and monthly
// payment. Kept self-contained so the map page can use it without touching
// the Inventory page. If the pricing rules change, update both.

// ---- Utility lookup by unit (matches Inventory) ----
const unitUtilities = {
  '5': { water: true, sewer: true }, '7': { water: true, sewer: true },
  '8': { water: true, sewer: true }, '9': { water: true, sewer: true },
  '38': { water: true, sewer: true },
  '10': { water: true, sewer: false }, '11': { water: true, sewer: false },
  '12': { water: true, sewer: false }, '16': { water: true, sewer: false },
  '21': { water: true, sewer: false }, '28': { water: true, sewer: false },
  '31': { water: true, sewer: false }, '42': { water: true, sewer: false },
  '44': { water: true, sewer: false }, '46': { water: true, sewer: false },
  '48': { water: true, sewer: false }, '50': { water: true, sewer: false },
};

const getUtilityType = (item) => {
  const w = String(item.water || '').toLowerCase();
  const s = String(item.sewer || '').toLowerCase();
  if (w.includes('city') && s.includes('sewer')) return 'water_sewer';
  if (w.includes('city')) return 'water_only';
  if (w.includes('well') || s.includes('septic')) return 'well_septic';
  const tags = (item.tags || []).map((t) => String(t).toLowerCase());
  if (tags.includes('city-water-sewer') || tags.includes('water-sewer')) return 'water_sewer';
  if (tags.includes('city-water-only') || tags.includes('water-only')) return 'water_only';
  if (tags.includes('well-septic')) return 'well_septic';
  const info = unitUtilities[item.unit];
  if (info?.water && info?.sewer) return 'water_sewer';
  if (info?.water) return 'water_only';
  return 'well_septic';
};

// ---- Pricing (matches Inventory) ----
const UNIT_RATE = (() => {
  const map = {};
  ['49'].forEach((u) => (map[u] = 4.10));
  ['15','17','18','19','20','22','23','24','25','30','32','36','37','10','11','12','16','21','28','31','46'].forEach((u) => (map[u] = 4.50));
  ['13','14','26','39','41','42','44','50','48','5','7','8','9','38'].forEach((u) => (map[u] = 5.20));
  return map;
})();
const NOT_INDIVIDUAL_UNITS = ['51', '52', '53'];
const CALL_UNITS = ['40'];
const hasLetterBlock = (block) => /[A-Za-z]/.test(String(block || ''));
const parseAcres = (a) => { const n = parseFloat(String(a || '').replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
const parsePrice = (p) => { const n = parseFloat(String(p || '').replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : n; };
const monthlyPayment = (financed) => Math.round((financed * 13.22) / 1000);
const financingFor = (price) => ({
  status: 'price', price,
  down30: Math.round(price * 0.30), fin30: Math.round(price * 0.70), monthly30: monthlyPayment(price * 0.70),
  down40: Math.round(price * 0.40), fin40: Math.round(price * 0.60), monthly40: monthlyPayment(price * 0.60),
});
const getLotPricing = (item, utilityType, canal) => {
  const unit = String(item.unit || '');
  const cashOnly = !!item.cashOnly;
  const explicit = parsePrice(item.price);
  if (explicit > 0) return { ...financingFor(explicit), fixed: true, cashOnly };
  if (NOT_INDIVIDUAL_UNITS.includes(unit)) return { status: 'package' };
  if (CALL_UNITS.includes(unit) || hasLetterBlock(item.block)) return { status: 'call' };
  const rate = UNIT_RATE[unit];
  const acres = parseAcres(item.acres);
  if (!rate || !acres) return { status: 'call' };
  const sqft = acres * 43560;
  let price = Math.min(sqft, 10000) * rate;
  if (sqft > 10000) price += (sqft - 10000) * 3;
  if (utilityType === 'water_only') price += 20000;
  if (utilityType === 'water_sewer') price += 40000;
  if (canal) price += 5000;
  return { ...financingFor(Math.round(price)), cashOnly };
};
const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

const slugify = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const LotPriceModal = ({ item, onClose }) => {
  const [canal, setCanal] = useState(false);
  const [downPct, setDownPct] = useState(30);
  if (!item) return null;

  const utilityType = getUtilityType(item);
  const pricing = getLotPricing(item, utilityType, canal);
  const lotLabel = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim()
    || `Unit ${item.unit} Block ${item.block} Lot ${item.lot}`;
  const acct = String(item.taxAccount || '').replace(/\D/g, '');
  const slug = slugify(item.title) || acct || item.id;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 pt-6 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{lotLabel}</h3>
            <p className="text-sm text-slate-500">
              Unit {item.unit || '—'} · Block {item.block || '—'} · Lot {item.lot || '—'}{item.acres ? ` · ${item.acres}` : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg" aria-label="Close">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Parcel + map links */}
        <div className="px-6 pt-3 flex flex-wrap gap-2">
          {(item.lat || item.lon) && (
            <a href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lon}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">Google Map</a>
          )}
          {acct && (
            <a href={`https://www.bcpao.us/map/?r=${acct}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium">BCPAO Map</a>
          )}
          {acct && (
            <a href={`https://www.bcpao.us/PropertySearch/#/account/${acct}`} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-medium">BCPAO Detail</a>
          )}
        </div>

        <div className="px-6 py-5">
          {pricing.status === 'package' && (
            <div className="text-center py-4">
              <p className="text-lg font-bold text-slate-900 mb-2">Not Sold Individually</p>
              <p className="text-slate-600 text-sm mb-4">This lot is available only as part of a whole package. Seller financing is available.</p>
              <a href="tel:3213337230" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm">
                <Phone className="w-4 h-4" /> Call 321-333-7230
              </a>
            </div>
          )}

          {pricing.status === 'call' && (
            <div className="text-center py-4">
              <p className="text-lg font-bold text-slate-900 mb-2">Call for Pricing</p>
              <p className="text-slate-600 text-sm mb-4">This parcel is priced individually. Seller financing is available.</p>
              <a href="tel:3213337230" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-sm">
                <Phone className="w-4 h-4" /> Call 321-333-7230
              </a>
            </div>
          )}

          {pricing.status === 'price' && (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-slate-500 uppercase tracking-wide">Cash Price</p>
                <p className="text-4xl font-extrabold text-green-700">{usd(pricing.price)}</p>
              </div>

              {!pricing.fixed && (
                <label className="flex items-center gap-2 justify-center mb-5 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={canal} onChange={(e) => setCanal(e.target.checked)} className="w-4 h-4 accent-amber-600" />
                  Canal lot (+$5,000)
                </label>
              )}

              {pricing.cashOnly && (
                <div className="text-center mb-2 bg-slate-100 rounded-lg p-3">
                  <p className="text-sm font-bold text-slate-900">Cash Only</p>
                  <p className="text-xs text-slate-500">Owner financing is not available on this listing.</p>
                </div>
              )}

              {!pricing.cashOnly && (<>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Owner Financing Options</p>
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">30% Option Money</span>
                      <span className="text-slate-900 font-semibold">{usd(pricing.down30)} option money</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Financing {usd(pricing.fin30)} — principal only</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{usd(pricing.monthly30)}<span className="text-sm font-medium text-slate-500">/mo · 120 months</span></p>
                    <p className="text-base font-bold text-slate-900 mt-1">10% interest rate · 12.33% Annual Percentage Rate (APR)</p>
                    <p className="text-xs text-slate-500 mt-1">Option Contract — deed transfers once your payments reach 40% of the price.</p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">40% Down</span>
                      <span className="text-slate-900 font-semibold">{usd(pricing.down40)} down</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Financing {usd(pricing.fin40)} — principal only</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{usd(pricing.monthly40)}<span className="text-sm font-medium text-slate-500">/mo · 120 months</span></p>
                    <p className="text-base font-bold text-slate-900 mt-1">10% interest rate · 12.33% Annual Percentage Rate (APR)</p>
                    <p className="text-xs text-slate-500 mt-1">Deed Transfer at closing.</p>
                  </div>
                </div>

                {(() => {
                  const down = Math.round(pricing.price * (downPct / 100));
                  const financed = pricing.price - down;
                  const monthly = monthlyPayment(financed);
                  return (
                    <div className="mt-4 bg-slate-900 rounded-xl p-4 text-white">
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm font-semibold text-amber-400">Put more down?</span>
                        <span className="text-sm font-bold">{downPct}% down</span>
                      </div>
                      <input type="range" min="30" max="100" step="1" value={downPct}
                        onChange={(e) => setDownPct(Number(e.target.value))} className="w-full accent-amber-500" />
                      <div className="flex justify-between text-[11px] text-slate-400 mb-3">
                        <span>30%</span><span>Paid in full</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[11px] text-slate-400">Option Money</p>
                          <p className="text-sm font-bold">{usd(down)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">Financing (principal only)</p>
                          <p className="text-sm font-bold">{usd(financed)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400">Payment</p>
                          <p className="text-sm font-bold text-amber-400">{financed <= 0 ? '$0' : usd(monthly) + '/mo'}</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-white mt-3 text-center">10% interest rate · 12.33% Annual Percentage Rate (APR)</p>
                    </div>
                  );
                })()}

                <p className="text-[11px] leading-snug text-slate-500 mt-3">
                  Financing example assumes the 10-point charge is financed (12.33% APR). If the points are paid at
                  closing, the APR is 12.58%. Amortized up to 120 months at a 10% interest rate. No prepayment
                  penalty, no balloon. Subject to credit approval and execution of appropriate legal documents.
                  This is an example only and is not an offer of credit. Terms subject to change.
                </p>

                <Link to="/price-guide?financing=1#option-contract" onClick={onClose}
                  className="mt-3 block text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm">
                  What is an option contract?
                </Link>
                <Link to="/price-guide?financing=1" onClick={onClose} className="block text-center text-xs text-amber-700 underline mt-2">
                  See Financing Terms
                </Link>
              </>)}

              <a href="tel:3213337230" className="mt-5 flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm">
                <Phone className="w-4 h-4" /> Lock In This Lot — 321-333-7230
              </a>
              <p className="text-[11px] text-slate-400 text-center mt-3">Price and terms may change without notice.</p>
            </>
          )}

          <Link to={`/property/${slug}`} state={{ from: 'map', lotId: item.id }} onClick={onClose} className="block text-center text-xs text-amber-700 underline mt-4">
            View full lot details &amp; area info →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LotPriceModal;
