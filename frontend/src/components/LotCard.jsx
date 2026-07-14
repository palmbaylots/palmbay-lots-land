import React from 'react';
import { Heart, Calculator, MapPin, Droplets } from 'lucide-react';
import LotImage from './LotImage';

// Heading: the editable descriptive label (e.g. "Buildable Residential Lot —
// cleared, surveyed"). Falls back to a sensible default when the lot's title is
// still just its street address (as the bulk-imported lots are).
export const lotHeading = (item) => {
  const addr = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim();
  const t = String(item.title || '').trim();
  if (t && t.toLowerCase() !== addr.toLowerCase()) return t;
  return /[a-zA-Z]/.test(String(item.block || '').trim()) ? 'Large Tract' : 'Buildable Residential Lot';
};

export const dimsText = (item) => {
  if (item.pieShape) return 'Pie-shaped';
  if (item.width && item.depth) return `${item.width} × ${item.depth} ft`;
  if (String(item.acres || '').replace(/ac.*/i, '').trim() === '0.23') return '80 × 125 ft';
  return null;
};

// One inventory lot as a photo card. Presentational — all state/handlers come
// from the Inventory page via props so favorites stay in sync everywhere.
const LotCard = ({ item, favorited, onToggleFav, onSeePrice, onOpenMap, utilityLabel, accent = 'slate' }) => {
  const address = [item.streetNumber, item.streetName].filter(Boolean).join(' ').trim();
  const status = item.status || (item.sold ? 'sold' : 'available');
  const heading = lotHeading(item);
  const zoning = item.zoning || 'Residential';
  const flu = item.flu || 'Residential';
  const dims = dimsText(item);

  const badge = {
    slate: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-100 text-blue-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    amber: 'bg-amber-100 text-amber-700',
  }[accent] || 'bg-slate-100 text-slate-700';

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col ${status === 'sold' ? 'opacity-70' : ''}`}>
      <div className="relative">
        <LotImage item={item} onClick={() => onOpenMap(item)} className="w-full h-40" px={[480, 320]} />

        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(item); }}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          title={favorited ? 'Saved' : 'Save to favorites'}
          data-testid={`fav-${item.inventoryId}`}
          className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow hover:bg-white transition-colors"
        >
          <Heart className={`w-5 h-5 ${favorited ? 'fill-red-600 text-red-600' : 'text-slate-500'}`} />
        </button>

        {status === 'sold' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase tracking-wider">Sold</span>
        )}
        {status === 'under_contract' && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded uppercase tracking-wider">Under Contract</span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-bold text-slate-900 leading-snug">{heading}</h3>

        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-[11px] font-semibold">{zoning}</span>
          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[11px] font-semibold">FLU: {flu}</span>
        </div>

        {address && <p className="text-sm text-slate-700">{address}</p>}
        <p className="text-xs text-slate-500">{item.city || 'Palm Bay, FL'}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${badge}`}>
            <Droplets className="w-3 h-3" /> {utilityLabel}
          </span>
          {item.acres && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">{item.acres}</span>}
          {dims && <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">{dims}</span>}
        </div>

        <p className="text-xs text-slate-500">
          Unit {item.unit || '—'} · Block {item.block || '—'} · Lot {item.lot || '—'}
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={() => onSeePrice(item)}
            data-testid={`see-price-${item.inventoryId}`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Calculator className="w-4 h-4" /> See Price
          </button>
          <button
            onClick={() => onOpenMap(item)}
            data-testid={`map-${item.inventoryId}`}
            className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LotCard;
