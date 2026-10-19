// Lot price calculator shared by the lot detail page.
// KEEP IN SYNC with the calculator in pages/Inventory.jsx (same unit rates, add-ons and rules).

const unitUtilities = {
  // City Water & Sewer
  '5': { water: true, sewer: true },
  '7': { water: true, sewer: true },
  '8': { water: true, sewer: true },
  '9': { water: true, sewer: true },
  '38': { water: true, sewer: true },
  // City Water Only
  '10': { water: true, sewer: false },
  '11': { water: true, sewer: false },
  '12': { water: true, sewer: false },
  '16': { water: true, sewer: false },
  '21': { water: true, sewer: false },
  '28': { water: true, sewer: false },
  '31': { water: true, sewer: false },
  '42': { water: true, sewer: false },
  '44': { water: true, sewer: false },
  '46': { water: true, sewer: false },
  '48': { water: true, sewer: false },
  '50': { water: true, sewer: false },
};

// Explicit Water/Sewer from admin wins, then tags, then the unit map.
export const getUtilityType = (item) => {
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

// Base $/sqft for the first 10,000 sqft, by unit.
const UNIT_RATE = (() => {
  const map = {};
  ['49'].forEach((u) => (map[u] = 4.10));
  ['15', '17', '18', '19', '20', '22', '23', '24', '25', '30', '32', '36', '37', '10', '11', '12', '16', '21', '28', '31', '46'].forEach((u) => (map[u] = 4.50));
  ['13', '14', '26', '39', '41', '42', '44', '50', '48', '5', '7', '8', '9', '38'].forEach((u) => (map[u] = 5.20));
  return map;
})();

const NOT_INDIVIDUAL_UNITS = ['51', '52', '53']; // The Compound: sold only as one whole package
const CALL_UNITS = ['40']; // commercial / multifamily, priced individually

const hasLetterBlock = (block) => /[A-Za-z]/.test(String(block || ''));
const parseNum = (v) => {
  const n = parseFloat(String(v || '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

// status: 'price' (has a number), 'call' (Call for Pricing), 'package' (not sold individually)
export const getLotPricing = (item, utilityType, canal = false) => {
  const unit = String(item.unit || '');

  // A hand-set price in admin overrides the calculator entirely.
  const explicit = parseNum(item.price);
  if (explicit > 0) return { status: 'price', price: explicit, fixed: true };

  if (NOT_INDIVIDUAL_UNITS.includes(unit)) return { status: 'package' };
  if (CALL_UNITS.includes(unit) || hasLetterBlock(item.block)) return { status: 'call' };

  const rate = UNIT_RATE[unit];
  const acres = parseNum(item.acres);
  if (!rate || !acres) return { status: 'call' };

  const sqft = acres * 43560;
  let price = Math.min(sqft, 10000) * rate;
  if (sqft > 10000) price += (sqft - 10000) * 3;
  if (utilityType === 'water_only') price += 20000;
  if (utilityType === 'water_sewer') price += 40000;
  if (canal) price += 5000;
  return { status: 'price', price: Math.round(price) };
};

export const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');

// What to show where a price goes.
export const priceLabel = (pricing) =>
  pricing.status === 'price' ? usd(pricing.price)
    : pricing.status === 'package' ? 'Sold only as a package'
      : 'Call for Pricing';
