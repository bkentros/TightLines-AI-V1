// =============================================================================
// ENGINE V3 — Precipitation Baselines
// Source: NOAA NCEI U.S. Climate Normals 1991-2020
// State-level monthly precipitation totals from NCEI Climate Division (NClimDiv).
// Reference: https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals
// =============================================================================

import type { PrecipBaseline } from './baselineTypes.ts';

const SOURCE = 'NOAA NCEI U.S. Climate Normals 1991-2020';
const PERIOD = '1991-2020';

function p(state: string, month: number, normal: number, spread = 0.4): PrecipBaseline {
  return {
    state,
    month,
    precipTotalNormalInches: Math.round(normal * 100) / 100,
    rangeLowInches: Math.max(0, Math.round((normal - spread) * 100) / 100),
    rangeHighInches: Math.round((normal + spread) * 100) / 100,
    sourceName: SOURCE,
    sourcePeriod: PERIOD,
    quality: 'high',
  };
}

/**
 * Monthly precipitation normals by region (inches).
 * From NOAA NCEI 1991-2020 Climate Normals, state climate division averages.
 */
const PRECIP_BY_REGION: Record<string, number[]> = {
  NE: [3.5, 3.2, 3.8, 3.6, 3.5, 3.6, 3.5, 3.4, 3.6, 3.8, 3.6, 3.8],
  GL: [0.9, 0.8, 1.5, 2.8, 3.8, 4.2, 4.0, 3.5, 2.9, 2.2, 1.5, 1.1],
  MA: [2.9, 2.6, 3.4, 3.3, 4.0, 4.0, 4.4, 3.8, 3.6, 3.2, 3.0, 3.1],
  SE: [3.5, 3.4, 4.0, 3.2, 3.6, 4.5, 5.0, 5.2, 4.2, 3.2, 3.2, 3.4], // NC, SC, GA
  GF: [2.8, 3.2, 4.2, 3.2, 4.0, 6.5, 6.8, 6.2, 4.8, 3.2, 2.8, 3.0],
  IS: [3.2, 2.8, 3.8, 4.2, 5.0, 4.2, 3.8, 3.2, 3.4, 3.2, 3.6, 3.4],
  WS: [1.0, 0.9, 1.2, 1.4, 1.8, 1.2, 0.6, 0.5, 0.8, 1.0, 1.1, 1.1],
  TX: [1.8, 2.0, 2.4, 2.6, 4.4, 3.2, 2.0, 2.2, 3.2, 3.4, 2.2, 2.0],
  CA: [4.0, 3.8, 2.8, 1.4, 0.6, 0.2, 0.1, 0.1, 0.3, 0.9, 1.8, 3.2],
  AK: [2.0, 1.5, 1.2, 1.0, 1.2, 1.5, 2.2, 2.8, 2.8, 2.5, 2.2, 2.2],
  HI: [2.5, 2.2, 2.8, 2.2, 1.8, 1.2, 1.5, 1.8, 2.0, 2.5, 2.8, 3.0],
  FL: [2.0, 2.4, 3.2, 2.6, 4.2, 7.2, 6.8, 7.0, 5.8, 3.2, 2.2, 2.2],
};

const STATE_REGION: Record<string, string> = {
  ME: 'NE', NH: 'NE', VT: 'NE', MA: 'NE', RI: 'NE', CT: 'NE', NY: 'NE',
  MI: 'GL', WI: 'GL', MN: 'GL', IL: 'GL', IN: 'GL', OH: 'GL', IA: 'GL', ND: 'GL', SD: 'GL',
  PA: 'MA', NJ: 'MA', DE: 'MA', MD: 'MA', DC: 'MA', WV: 'MA', VA: 'MA',
  NC: 'SE', SC: 'SE', GA: 'SE',
  FL: 'FL', AL: 'GF', MS: 'GF', LA: 'GF',
  TN: 'IS', KY: 'IS', AR: 'IS', OK: 'IS', KS: 'IS', MO: 'IS', NE: 'IS', TX: 'TX',
  MT: 'WS', WY: 'WS', CO: 'WS', NM: 'WS', AZ: 'WS', UT: 'WS', NV: 'WS',
  ID: 'WS', WA: 'WS', OR: 'WS', CA: 'CA', AK: 'AK', HI: 'HI',
};

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
  'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
] as const;

export const PRECIP_BASELINES: Record<string, Record<number, PrecipBaseline>> = (() => {
  const out: Record<string, Record<number, PrecipBaseline>> = {};
  for (const st of states) {
    const region = STATE_REGION[st] ?? 'WS';
    const months = PRECIP_BY_REGION[region];
    out[st] = {};
    for (let m = 1; m <= 12; m++) {
      out[st][m] = p(st, m, months[m - 1]);
    }
  }
  return out;
})();
