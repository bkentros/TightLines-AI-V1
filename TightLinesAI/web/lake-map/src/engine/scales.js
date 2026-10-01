/* Color scales and unit conversion for the Live Lake Map. */

export const PALETTES = {
  temp: { min: 36, max: 78, stops: [[36, '#3A2C86'], [42, '#3E50B6'], [47, '#2F80D0'], [51, '#22A8C8'], [54, '#2CC0A1'], [57, '#69CB6A'], [60, '#C4D452'], [63, '#F0C046'], [66, '#F09A3E'], [69, '#E7683A'], [73, '#D43F46'], [78, '#A42350']] },
  wind: { min: 0, max: 50, stops: [[0, '#2B3B8C'], [4, '#2E66B4'], [8, '#2C95B7'], [12, '#33AE8E'], [16, '#78C15A'], [20, '#D0C345'], [25, '#E8993B'], [30, '#DC5E3C'], [38, '#B6305F'], [50, '#7B2A8A']] },
  waves: { min: 0, max: 12, stops: [[0, '#173E6C'], [1, '#1D6A9B'], [2, '#2A9CB2'], [3, '#42B98F'], [4, '#B5C74F'], [6, '#EDA23C'], [8, '#DF573C'], [12, '#A5275B']] },
  depth: { min: 0, max: 1350, stops: [[0, '#CBE9F1'], [25, '#8ACFE2'], [80, '#4AA7CF'], [180, '#2C79B4'], [350, '#235398'], [650, '#1B3A79'], [1000, '#152657'], [1350, '#0D173C']] },
};

function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }

/** 256-entry RGBA ramp for a palette (index 0 = min, 255 = max). */
export function paletteBytes(name) {
  const p = PALETTES[name], out = new Uint8Array(256 * 4);
  for (let i = 0; i < 256; i++) {
    const v = p.min + (p.max - p.min) * i / 255;
    let k = 0; while (k < p.stops.length - 2 && v > p.stops[k + 1][0]) k++;
    const a = p.stops[k], b = p.stops[k + 1], f = Math.min(1, Math.max(0, (v - a[0]) / (b[0] - a[0])));
    const ca = hex(a[1]), cb = hex(b[1]);
    for (let c = 0; c < 3; c++) out[i * 4 + c] = Math.round(ca[c] + (cb[c] - ca[c]) * f);
    out[i * 4 + 3] = 255;
  }
  return out;
}
export function colorAt(name, v) {
  const p = PALETTES[name], bytes = paletteBytes(name), i = Math.round(Math.min(1, Math.max(0, (v - p.min) / (p.max - p.min))) * 255) * 4;
  return `rgb(${bytes[i]},${bytes[i + 1]},${bytes[i + 2]})`;
}

export const UNIT_SETS = {
  temp: { F: { label: '°F' }, C: { label: '°C' } },
  wind: { mph: { label: 'mph', k: 1 }, kph: { label: 'km/h', k: 1.609344 }, kt: { label: 'kt', k: 0.868976 } },
  length: { ft: { label: 'ft', k: 1 }, m: { label: 'm', k: 0.3048 } },
};
export const DEFAULT_UNITS = { temp: 'F', wind: 'mph', length: 'ft' };

export const toTemp = (f, u) => u === 'C' ? (f - 32) * 5 / 9 : f;
export const fromTemp = (v, u) => u === 'C' ? v * 9 / 5 + 32 : v;
export const toWind = (mph, u) => mph * UNIT_SETS.wind[u].k;
export const toLength = (ft, u) => ft * UNIT_SETS.length[u].k;
/** Band width in display units: 2 °F, or 1 °C. */
export const tempBand = (u) => u === 'C' ? 1 : 2;

/**
 * Band spec for a banded layer in the viewer's units.
 * a/b convert native units (°F, mph, ft) to display units: disp = native*a + b.
 * width is one band in display units; label() names a band by its display range.
 */
export function bandSpec(layer, units) {
  if (layer === 'temp' || layer === 'species') {
    const c = units.temp === 'C';
    return { a: c ? 5 / 9 : 1, b: c ? -160 / 9 : 0, width: c ? 1 : 2, unit: c ? '°C' : '°F', label: (lo, hi) => `${lo}–${hi}°` };
  }
  if (layer === 'wind') {
    const k = UNIT_SETS.wind[units.wind].k, w = units.wind === 'kph' ? 10 : 5;
    const u = UNIT_SETS.wind[units.wind].label;
    return { a: k, b: 0, width: w, unit: u, label: (lo, hi) => `${lo}–${hi} ${u}` };
  }
  if (layer === 'waves') {
    const m = units.length === 'm';
    return { a: m ? 0.3048 : 1, b: 0, width: m ? 0.5 : 1, unit: m ? 'm' : 'ft', label: (lo, hi) => m ? `${lo.toFixed(1)}–${hi.toFixed(1)} m` : `${lo}–${hi} ft` };
  }
  return null;
}

/** Sample species temperature windows (°F). The app uses the PierCast species model. */
export const SPECIES = [
  { id: 'chinook_salmon', name: 'Chinook', lo: 50, hi: 56 },
  { id: 'coho_salmon', name: 'Coho', lo: 51, hi: 58 },
  { id: 'steelhead', name: 'Steelhead', lo: 50, hi: 58 },
  { id: 'brown_trout', name: 'Brown Trout', lo: 50, hi: 60 },
  { id: 'lake_trout', name: 'Lake Trout', lo: 46, hi: 54 },
  { id: 'lake_whitefish', name: 'Whitefish', lo: 46, hi: 54 },
];
/** How a water temperature sits against a species window: 0 in range, 1 close, 2 off, 3 far off. */
export function speciesFit(f, sp) {
  const d = f < sp.lo ? sp.lo - f : f > sp.hi ? f - sp.hi : 0;
  return { d, dir: f < sp.lo ? 'cool' : 'warm', grade: d === 0 ? 0 : d <= 3 ? 1 : d <= 6 ? 2 : 3 };
}
export const FIT_COLORS = ['#3DA85F', '#E8C547', '#E89647', '#D94B3A'];

export function fmtTemp(f, u, digits = 1) { return Number.isFinite(f) ? toTemp(f, u).toFixed(digits) : '—'; }
export function fmtWind(mph, u) { return Number.isFinite(mph) ? String(Math.round(toWind(mph, u))) : '—'; }
export function fmtWaves(ft, u) {
  if (!Number.isFinite(ft)) return '—';
  if (u === 'm') { const m = ft * 0.3048; return m < 0.15 ? 'Calm' : `${(m * 0.85).toFixed(1)}–${(m * 1.15).toFixed(1)}`; }
  if (ft < 0.6) return '< 1';
  const lo = Math.max(0, Math.round(ft - 0.5)); return `${lo}–${lo + 1}`;
}
export function compass(deg) { const n = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']; return n[Math.round((((deg % 360) + 360) % 360) / 22.5) % 16]; }
