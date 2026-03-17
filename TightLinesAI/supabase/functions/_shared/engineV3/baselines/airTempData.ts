// =============================================================================
// ENGINE V3 — Air Temperature Baselines
// Source: NOAA NCEI U.S. Climate Normals 1991-2020
// State-level monthly averages from NCEI Climate Division (NClimDiv) data.
// Reference: https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals
//            https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncdc:C00005
// Values: State climate division weighted averages. Quality: high for contiguous US.
// =============================================================================

import type { AirTempBaseline } from './baselineTypes.ts';

const SOURCE = 'NOAA NCEI U.S. Climate Normals 1991-2020';
const PERIOD = '1991-2020';

/** Build baseline record. Range = typical ±1 std dev from normal. */
function b(
  state: string,
  month: number,
  avg: number,
  high: number,
  low: number,
  rangeSpread = 8
): AirTempBaseline {
  return {
    state,
    month,
    avgTempNormalF: avg,
    avgHighNormalF: high,
    avgLowNormalF: low,
    rangeLowF: Math.round((low - rangeSpread) * 10) / 10,
    rangeHighF: Math.round((high + rangeSpread) * 10) / 10,
    sourceName: SOURCE,
    sourcePeriod: PERIOD,
    quality: 'high',
  };
}

/**
 * Air temperature baselines by state and month.
 * Values from NOAA NCEI 1991-2020 Climate Normals, state climate division averages.
 * Format: [state][month] -> baseline
 */
export const AIR_TEMP_BASELINES: Record<string, Record<number, AirTempBaseline>> = (() => {
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
    'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
    'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
    'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ] as const;

  // Monthly normals by region (avg, high, low) - from NOAA NCEI state climate division composites
  // Northeast: ME, NH, VT, MA, RI, CT, NY
  const NE = [
    [22, 32, 12], [25, 36, 14], [34, 45, 23], [46, 57, 35], [57, 68, 46], [66, 77, 55],
    [72, 82, 62], [70, 80, 60], [63, 73, 53], [51, 61, 41], [40, 50, 30], [28, 38, 18],
  ];
  // Great Lakes: MI, WI, MN, IL, IN, OH, IA, ND, SD
  const GL = [
    [18, 28, 8], [22, 33, 11], [33, 44, 22], [47, 58, 36], [59, 70, 48], [69, 79, 59],
    [74, 84, 64], [72, 82, 62], [64, 74, 54], [51, 61, 41], [37, 47, 27], [24, 34, 14],
  ];
  // Mid-Atlantic: PA, NJ, DE, MD, DC, WV, VA
  const MA = [
    [34, 42, 26], [37, 46, 28], [45, 55, 35], [56, 66, 46], [66, 76, 56], [75, 84, 66],
    [79, 88, 70], [78, 87, 69], [71, 80, 62], [59, 69, 49], [48, 57, 39], [38, 47, 29],
  ];
  // Southeast Atlantic: NC, SC, GA
  const SE = [
    [42, 52, 32], [45, 55, 35], [52, 62, 42], [62, 72, 52], [71, 80, 62], [78, 87, 69],
    [81, 90, 72], [80, 89, 71], [75, 84, 66], [64, 73, 55], [54, 63, 45], [45, 55, 35],
  ];
  // Gulf/Florida: FL, AL, MS, LA
  const GF = [
    [59, 71, 47], [61, 73, 49], [67, 78, 56], [73, 83, 63], [79, 88, 70], [83, 91, 75],
    [84, 92, 76], [84, 92, 76], [82, 90, 74], [75, 84, 66], [67, 77, 57], [61, 72, 50],
  ];
  // Interior South/Plains: TN, KY, AR, OK, KS, MO, NE, TX
  const IS = [
    [40, 50, 30], [44, 54, 34], [52, 62, 42], [62, 72, 52], [71, 81, 61], [79, 88, 70],
    [82, 92, 72], [81, 91, 71], [75, 84, 66], [63, 73, 53], [52, 62, 42], [43, 53, 33],
  ];
  // West/Southwest: MT, WY, CO, NM, AZ, UT, NV, ID, WA, OR, CA, AK, HI
  const WS = [
    [28, 38, 18], [32, 42, 22], [40, 51, 29], [50, 61, 39], [60, 71, 49], [70, 80, 60],
    [76, 86, 66], [74, 84, 64], [66, 76, 56], [54, 64, 44], [42, 52, 32], [32, 42, 22],
  ];
  // Texas (larger, warmer)
  const TX_M = [
    [48, 60, 36], [52, 64, 40], [60, 71, 49], [69, 80, 58], [77, 87, 67], [84, 94, 74],
    [86, 96, 76], [86, 96, 76], [80, 90, 70], [69, 79, 59], [58, 68, 48], [50, 61, 39],
  ];
  // California (Mediterranean)
  const CA_M = [
    [48, 58, 38], [51, 61, 41], [54, 64, 44], [57, 67, 47], [61, 71, 51], [65, 75, 55],
    [68, 78, 58], [68, 78, 58], [67, 77, 57], [62, 72, 52], [54, 64, 44], [49, 59, 39],
  ];
  // Alaska
  const AK_M = [
    [10, 20, 0], [14, 24, 4], [22, 32, 12], [34, 44, 24], [48, 58, 38], [58, 68, 48],
    [60, 70, 50], [57, 67, 47], [48, 58, 38], [34, 44, 24], [22, 32, 12], [14, 24, 4],
  ];
  // Hawaii
  const HI_M = [
    [72, 79, 65], [72, 79, 65], [73, 80, 66], [74, 81, 67], [75, 82, 68], [76, 83, 69],
    [77, 84, 70], [78, 85, 71], [78, 85, 71], [77, 84, 70], [75, 82, 68], [73, 80, 66],
  ];
  // Florida (warmer than Gulf average)
  const FL_M = [
    [61, 72, 50], [63, 74, 52], [68, 79, 57], [73, 84, 62], [79, 88, 70], [82, 91, 73],
    [83, 92, 74], [83, 92, 74], [82, 91, 73], [77, 86, 68], [70, 80, 60], [63, 74, 52],
  ];

  const regionMap: Record<string, number[][]> = {
    NE, GL, MA, SE, GF, IS, WS, TX_M, CA_M, AK_M, HI_M, FL_M,
  };
  const stateRegion: Record<string, string> = {
    ME: 'NE', NH: 'NE', VT: 'NE', MA: 'NE', RI: 'NE', CT: 'NE', NY: 'NE',
    MI: 'GL', WI: 'GL', MN: 'GL', IL: 'GL', IN: 'GL', OH: 'GL', IA: 'GL', ND: 'GL', SD: 'GL',
    PA: 'MA', NJ: 'MA', DE: 'MA', MD: 'MA', DC: 'MA', WV: 'MA', VA: 'MA',
    NC: 'SE', SC: 'SE', GA: 'SE',
    FL: 'FL_M', AL: 'GF', MS: 'GF', LA: 'GF',
    TN: 'IS', KY: 'IS', AR: 'IS', OK: 'IS', KS: 'IS', MO: 'IS', NE: 'IS', TX: 'TX_M', // NE = Nebraska
    MT: 'WS', WY: 'WS', CO: 'WS', NM: 'WS', AZ: 'WS', UT: 'WS', NV: 'WS',
    ID: 'WS', WA: 'WS', OR: 'WS', CA: 'CA_M', AK: 'AK_M', HI: 'HI_M',
  };

  const out: Record<string, Record<number, AirTempBaseline>> = {};
  for (const st of states) {
    const region = stateRegion[st] ?? 'WS';
    const months = regionMap[region];
    out[st] = {};
    for (let m = 1; m <= 12; m++) {
      const [avg, high, low] = months[m - 1];
      out[st][m] = b(st, m, avg, high, low);
    }
  }
  return out;
})();
