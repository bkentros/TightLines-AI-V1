// =============================================================================
// ENGINE V3 — Freshwater Temperature Baselines
// APPROXIMATION: No nationwide statewide freshwater temp dataset exists.
// Methodology: Ranges derived from air temp relationship + regional studies.
// - Lake/pond: typically 2–4 weeks behind air temp; broader seasonal range.
// - River/stream: more responsive to air temp; narrower range, faster response.
// Sources: USGS NWIS, state agency datasets, regional limnology studies.
// Reference: USGS Water Data, state DNR/DFW temp summaries where available.
// Quality: approximation — ranges are broad and defensible, not precise.
// =============================================================================

import type { FreshwaterTempBaseline } from './baselineTypes.ts';

const SOURCE = 'USGS + state agencies + regional studies; air-temp relationship';
const PERIOD = '1991-2020 (approximated)';
const METHODOLOGY =
  'Statewide ranges from air-temp lag (lakes 2-4 wk behind, rivers more responsive), ' +
  'USGS station data where available, regional limnology. Broad ranges by design.';

function fw(
  state: string,
  month: number,
  subtype: 'lake' | 'river_stream',
  low: number,
  high: number
): FreshwaterTempBaseline {
  return {
    state,
    month,
    subtype,
    tempRangeLowF: low,
    tempRangeHighF: high,
    methodologyNote: METHODOLOGY,
    sourceName: SOURCE,
    sourcePeriod: PERIOD,
    quality: 'approximation',
  };
}

/**
 * Lake/pond monthly temp ranges by region (low, high °F).
 * Lakes lag air temp; broader range than rivers.
 */
const LAKE_BY_REGION: Record<string, [number, number][]> = {
  NE: [
    [32, 38], [32, 36], [34, 42], [42, 52], [50, 62], [58, 72],
    [64, 76], [66, 74], [58, 68], [48, 58], [40, 48], [34, 40],
  ],
  GL: [
    [32, 36], [32, 34], [34, 40], [40, 52], [48, 62], [58, 72],
    [64, 76], [66, 74], [58, 68], [46, 56], [36, 44], [32, 38],
  ],
  MA: [
    [34, 42], [34, 40], [38, 48], [46, 58], [54, 66], [62, 74],
    [68, 78], [68, 76], [62, 70], [52, 62], [44, 52], [38, 44],
  ],
  SE: [
    [42, 52], [44, 54], [48, 58], [54, 66], [62, 74], [70, 80],
    [74, 84], [74, 82], [68, 76], [58, 68], [50, 58], [44, 52],
  ],
  GF: [
    [52, 62], [54, 64], [58, 68], [64, 74], [70, 80], [76, 84],
    [78, 86], [78, 86], [76, 82], [68, 76], [60, 68], [54, 62],
  ],
  IS: [
    [38, 48], [40, 50], [44, 54], [52, 64], [60, 72], [68, 78],
    [72, 82], [72, 80], [66, 74], [56, 66], [46, 54], [40, 48],
  ],
  WS: [
    [34, 42], [34, 40], [36, 46], [44, 54], [50, 62], [56, 68],
    [62, 72], [64, 72], [56, 64], [46, 54], [38, 46], [34, 40],
  ],
  TX: [
    [46, 56], [48, 58], [52, 62], [60, 70], [68, 78], [74, 84],
    [78, 86], [78, 86], [74, 82], [64, 74], [54, 64], [48, 58],
  ],
  CA: [
    [48, 56], [48, 56], [50, 58], [52, 60], [54, 64], [58, 68],
    [62, 72], [64, 72], [62, 70], [58, 66], [54, 60], [50, 56],
  ],
  AK: [
    [32, 36], [32, 34], [32, 36], [34, 42], [40, 50], [48, 58],
    [52, 62], [54, 62], [48, 56], [40, 48], [34, 40], [32, 36],
  ],
  HI: [
    [72, 76], [72, 76], [72, 76], [73, 77], [74, 78], [75, 79],
    [76, 80], [76, 80], [76, 80], [75, 79], [74, 78], [73, 77],
  ],
  FL: [
    [58, 66], [58, 66], [62, 70], [68, 76], [74, 82], [78, 86],
    [80, 86], [80, 86], [78, 84], [72, 78], [66, 72], [60, 66],
  ],
};

/**
 * River/stream monthly temp ranges by region (low, high °F).
 * Rivers respond faster to air temp; narrower range.
 */
const RIVER_BY_REGION: Record<string, [number, number][]> = {
  NE: [
    [32, 40], [32, 38], [36, 46], [44, 56], [52, 64], [60, 74],
    [66, 78], [66, 76], [60, 70], [50, 60], [42, 50], [36, 42],
  ],
  GL: [
    [32, 38], [32, 36], [36, 44], [44, 56], [52, 64], [60, 74],
    [66, 78], [66, 76], [60, 70], [48, 58], [38, 46], [34, 40],
  ],
  MA: [
    [36, 44], [36, 42], [40, 50], [48, 60], [56, 68], [64, 76],
    [70, 80], [70, 78], [64, 72], [54, 64], [46, 54], [40, 46],
  ],
  SE: [
    [44, 54], [46, 56], [50, 60], [56, 68], [64, 76], [72, 82],
    [76, 86], [76, 84], [70, 78], [60, 70], [52, 60], [46, 54],
  ],
  GF: [
    [54, 64], [56, 66], [60, 70], [66, 76], [72, 82], [78, 86],
    [80, 88], [80, 88], [78, 84], [70, 78], [62, 70], [56, 64],
  ],
  IS: [
    [40, 50], [42, 52], [46, 56], [54, 66], [62, 74], [70, 80],
    [74, 84], [74, 82], [68, 76], [58, 68], [48, 56], [42, 50],
  ],
  WS: [
    [36, 44], [36, 42], [38, 48], [46, 56], [52, 64], [58, 70],
    [64, 74], [66, 74], [58, 66], [48, 56], [40, 48], [36, 44],
  ],
  TX: [
    [48, 58], [50, 60], [54, 64], [62, 72], [70, 80], [76, 86],
    [80, 88], [80, 88], [76, 84], [66, 76], [56, 66], [50, 60],
  ],
  CA: [
    [50, 58], [50, 58], [52, 60], [54, 62], [56, 66], [60, 70],
    [64, 74], [66, 74], [64, 72], [60, 68], [56, 62], [52, 58],
  ],
  AK: [
    [32, 38], [32, 36], [34, 40], [38, 48], [44, 54], [52, 62],
    [56, 64], [56, 64], [50, 58], [42, 50], [36, 42], [32, 38],
  ],
  HI: [
    [72, 76], [72, 76], [73, 77], [73, 77], [74, 78], [75, 79],
    [76, 80], [76, 80], [76, 80], [75, 79], [74, 78], [73, 77],
  ],
  FL: [
    [60, 68], [60, 68], [64, 72], [70, 78], [76, 84], [80, 88],
    [82, 88], [82, 88], [80, 86], [74, 80], [68, 74], [62, 68],
  ],
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

function buildFreshwater(
  subtype: 'lake' | 'river_stream'
): Record<string, Record<number, FreshwaterTempBaseline>> {
  const byRegion = subtype === 'lake' ? LAKE_BY_REGION : RIVER_BY_REGION;
  const out: Record<string, Record<number, FreshwaterTempBaseline>> = {};
  for (const st of states) {
    const region = STATE_REGION[st] ?? 'WS';
    const months = byRegion[region] ?? byRegion.WS;
    out[st] = {};
    for (let m = 1; m <= 12; m++) {
      const [low, high] = months[m - 1];
      out[st][m] = fw(st, m, subtype, low, high);
    }
  }
  return out;
}

export const FRESHWATER_LAKE_BASELINES = buildFreshwater('lake');
export const FRESHWATER_RIVER_BASELINES = buildFreshwater('river_stream');
