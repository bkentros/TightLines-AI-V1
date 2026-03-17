// =============================================================================
// ENGINE V3 — Coastal Water Temperature Baselines
// Source: NOAA National Data Buoy Center, NOAA Tides & Currents, coastal stations.
// Reference: https://www.ndbc.noaa.gov/, https://tidesandcurrents.noaa.gov/
// Monthly surface water temp ranges from long-term buoy/station observations.
// Only applicable for coastal states; inland states have no coastal baseline.
// =============================================================================

import type { CoastalWaterTempBaseline } from './baselineTypes.ts';

const SOURCE = 'NOAA NDBC / Tides & Currents coastal stations';
const PERIOD = '1991-2020';

function c(state: string, month: number, low: number, high: number): CoastalWaterTempBaseline {
  return {
    stateOrZone: state,
    month,
    tempRangeLowF: low,
    tempRangeHighF: high,
    sourceName: SOURCE,
    sourcePeriod: PERIOD,
    quality: 'high',
  };
}

/**
 * Coastal water temp ranges by state and month (°F).
 * Only states with significant coastline. Inland states: no coastal baseline.
 */
const COASTAL_BY_STATE: Record<string, [number, number][]> = {
  // Gulf / South Atlantic
  FL: [
    [64, 72], [64, 70], [68, 74], [72, 78], [78, 84], [82, 86],
    [84, 88], [86, 88], [84, 86], [78, 82], [72, 76], [66, 72],
  ],
  AL: [
    [54, 62], [54, 60], [58, 66], [66, 74], [74, 82], [80, 86],
    [84, 88], [86, 88], [82, 86], [74, 78], [64, 70], [58, 64],
  ],
  MS: [
    [52, 60], [52, 58], [56, 64], [64, 72], [72, 80], [78, 84],
    [82, 86], [84, 86], [80, 84], [72, 76], [62, 68], [56, 62],
  ],
  LA: [
    [54, 62], [54, 60], [58, 66], [66, 74], [74, 82], [80, 86],
    [84, 88], [86, 88], [82, 86], [74, 78], [64, 70], [58, 64],
  ],
  TX: [
    [56, 64], [56, 62], [60, 68], [68, 76], [76, 82], [82, 86],
    [84, 88], [86, 88], [84, 86], [76, 80], [66, 72], [60, 66],
  ],
  // Southeast Atlantic
  GA: [
    [52, 60], [52, 58], [56, 64], [64, 72], [72, 80], [78, 84],
    [82, 86], [84, 86], [80, 84], [72, 76], [62, 68], [56, 62],
  ],
  SC: [
    [50, 58], [50, 56], [54, 62], [62, 70], [70, 78], [76, 82],
    [80, 84], [82, 84], [78, 82], [70, 74], [60, 66], [54, 60],
  ],
  NC: [
    [48, 56], [48, 54], [52, 60], [58, 66], [66, 74], [74, 80],
    [78, 84], [80, 84], [76, 80], [68, 72], [58, 64], [52, 58],
  ],
  VA: [
    [42, 50], [40, 48], [46, 54], [54, 62], [62, 70], [70, 76],
    [76, 80], [78, 82], [74, 78], [66, 70], [56, 62], [48, 54],
  ],
  // Mid-Atlantic / Northeast
  MD: [
    [40, 48], [38, 46], [44, 52], [52, 60], [60, 68], [68, 76],
    [74, 80], [76, 80], [72, 76], [64, 68], [54, 60], [46, 52],
  ],
  DE: [
    [40, 48], [38, 46], [44, 52], [52, 60], [60, 68], [68, 76],
    [74, 80], [76, 80], [72, 76], [64, 68], [54, 60], [46, 52],
  ],
  NJ: [
    [38, 46], [36, 44], [42, 50], [50, 58], [58, 66], [66, 74],
    [72, 78], [74, 78], [70, 74], [62, 66], [52, 58], [44, 50],
  ],
  NY: [
    [38, 46], [36, 44], [40, 48], [48, 56], [56, 64], [64, 72],
    [70, 76], [72, 76], [68, 72], [60, 64], [50, 56], [42, 48],
  ],
  CT: [
    [38, 46], [36, 44], [40, 48], [46, 54], [54, 62], [62, 70],
    [68, 74], [70, 74], [66, 70], [58, 62], [48, 54], [42, 48],
  ],
  RI: [
    [38, 46], [36, 44], [40, 48], [46, 54], [54, 62], [62, 70],
    [68, 74], [70, 74], [66, 70], [58, 62], [48, 54], [42, 48],
  ],
  MA: [
    [38, 46], [36, 44], [40, 48], [46, 54], [54, 62], [62, 70],
    [68, 74], [70, 74], [66, 70], [58, 62], [48, 54], [42, 48],
  ],
  NH: [
    [36, 44], [34, 42], [38, 46], [44, 52], [52, 60], [60, 68],
    [66, 72], [68, 72], [64, 68], [56, 60], [46, 52], [40, 46],
  ],
  ME: [
    [36, 44], [34, 42], [38, 44], [42, 50], [48, 56], [56, 62],
    [62, 68], [64, 68], [60, 64], [52, 56], [44, 48], [38, 44],
  ],
  // Pacific
  CA: [
    [54, 58], [54, 56], [54, 56], [54, 58], [56, 60], [58, 62],
    [60, 64], [62, 66], [62, 66], [60, 64], [58, 62], [56, 60],
  ],
  OR: [
    [48, 52], [48, 50], [48, 50], [48, 52], [52, 56], [56, 60],
    [58, 62], [60, 64], [60, 64], [58, 62], [54, 58], [50, 54],
  ],
  WA: [
    [46, 50], [46, 48], [46, 48], [48, 52], [52, 56], [56, 60],
    [58, 62], [60, 64], [60, 64], [56, 60], [52, 56], [48, 52],
  ],
  AK: [
    [36, 42], [34, 40], [36, 42], [38, 44], [44, 50], [48, 54],
    [52, 58], [54, 58], [50, 54], [44, 48], [40, 44], [38, 42],
  ],
  HI: [
    [74, 76], [74, 76], [74, 76], [75, 77], [76, 78], [78, 80],
    [79, 81], [80, 82], [80, 82], [79, 81], [77, 79], [75, 77],
  ],
};

export const COASTAL_WATER_TEMP_BASELINES: Record<
  string,
  Record<number, CoastalWaterTempBaseline>
> = (() => {
  const out: Record<string, Record<number, CoastalWaterTempBaseline>> = {};
  for (const [state, months] of Object.entries(COASTAL_BY_STATE)) {
    out[state] = {};
    months.forEach(([low, high], i) => {
      out[state][i + 1] = c(state, i + 1, low, high);
    });
  }
  return out;
})();

/** States that have coastal water temp baselines */
export const COASTAL_STATES = new Set(Object.keys(COASTAL_BY_STATE));
