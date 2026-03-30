import type { EngineContext } from "../contracts/mod.ts";

type LakeRow = { t: number; p: number; w: number; l: number; pr: number };
type RiverRow = { t: number; p: number; w: number; l: number; r: number };
type CoastalRow = { ti: number; wi: number; pr: number; l: number; te: number; pi: number };

const LAKE: LakeRow[] = [
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },  // Jan
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },  // Feb
  { t: 3, p: 0, w: 0, l: 1, pr: 1 },  // Mar
  { t: 2, p: 0, w: 0, l: 0, pr: 1 },  // Apr
  { t: 1, p: 0, w: 0, l: 0, pr: 1 },  // May
  { t: 0, p: 0, w: 1, l: 1, pr: 0 },  // Jun
  { t: 0, p: 0, w: 1, l: 2, pr: 0 },  // Jul
  { t: 0, p: 0, w: 1, l: 2, pr: 0 },  // Aug
  { t: 1, p: 1, w: 0, l: 1, pr: 0 },  // Sep — fall feeding mode; pressure fronts trigger blitzes
  { t: 2, p: 1, w: 0, l: 0, pr: 1 },  // Oct — pre-winter feed, pressure most predictive variable
  { t: 3, p: 1, w: 0, l: 1, pr: 1 },  // Nov — same; pressure drop = last aggressive feed windows
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },  // Dec
];

const RIVER: RiverRow[] = [
  { t: 4, p: 0, w: 0, l: 1, r: 1 },  // Jan
  { t: 4, p: 0, w: 0, l: 1, r: 1 },  // Feb
  { t: 3, p: 0, w: 0, l: 0, r: 3 },  // Mar
  { t: 2, p: 0, w: 0, l: 0, r: 4 },  // Apr
  { t: 1, p: 0, w: 0, l: 0, r: 3 },  // May
  { t: 0, p: 0, w: 1, l: 1, r: 1 },  // Jun
  { t: 0, p: 0, w: 1, l: 1, r: 0 },  // Jul
  { t: 0, p: 0, w: 1, l: 1, r: 0 },  // Aug
  { t: 1, p: 1, w: 0, l: 1, r: 0 },  // Sep — fall trout/salmon; clear-water light matters; pressure reactive
  { t: 2, p: 1, w: 0, l: 1, r: 1 },  // Oct — low-light windows key for fall river fishing; pressure fronts
  { t: 3, p: 1, w: 0, l: 1, r: 1 },  // Nov — pre-winter feeding; pressure drop triggers last aggressive windows
  { t: 4, p: 0, w: 0, l: 1, r: 1 },  // Dec
];

const COAST: CoastalRow[] = [
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },  // Jan
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },  // Feb
  { ti: 1, wi: 1, pr: 0, l: 0, te: 2, pi: 0 },  // Mar
  { ti: 1, wi: 0, pr: 0, l: 0, te: 1, pi: 0 },  // Apr
  { ti: 1, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },  // May
  { ti: 0, wi: 1, pr: 0, l: 1, te: 0, pi: 0 },  // Jun
  { ti: 0, wi: 1, pr: 0, l: 1, te: 1, pi: 0 },  // Jul
  { ti: 0, wi: 1, pr: 0, l: 1, te: 1, pi: 0 },  // Aug
  { ti: 1, wi: 1, pr: 1, l: 0, te: 0, pi: 0 },  // Sep — fall bluefish/striper runs; pressure-front driven
  { ti: 1, wi: 1, pr: 1, l: 0, te: 1, pi: 0 },  // Oct — peak inshore fall; pre-storm feeds most predictable
  { ti: 1, wi: 1, pr: 1, l: 0, te: 2, pi: 0 },  // Nov — late season coastal; pressure drops trigger last runs
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },  // Dec
];

const FLATS: CoastalRow[] = [
  { ti: 0, wi: 1, pr: 0, l: 1, te: 3, pi: 0 },  // Jan — temperature + visibility matter more than raw tide strength
  { ti: 0, wi: 1, pr: 0, l: 1, te: 3, pi: 0 },  // Feb
  { ti: 0, wi: 1, pr: 0, l: 1, te: 2, pi: 0 },  // Mar
  { ti: 0, wi: 1, pr: 0, l: 1, te: 1, pi: 0 },  // Apr
  { ti: 0, wi: 1, pr: 0, l: 1, te: 0, pi: 0 },  // May
  { ti: -1, wi: 2, pr: 0, l: 2, te: 0, pi: 0 }, // Jun — wind/light windows dominate in skinny water
  { ti: -1, wi: 2, pr: 0, l: 2, te: 1, pi: 0 }, // Jul
  { ti: -1, wi: 2, pr: 0, l: 2, te: 1, pi: 0 }, // Aug
  { ti: 0, wi: 2, pr: 1, l: 1, te: 0, pi: 0 },  // Sep — bait movement + weather windows
  { ti: 0, wi: 1, pr: 1, l: 1, te: 1, pi: 0 },  // Oct
  { ti: 0, wi: 1, pr: 1, l: 1, te: 2, pi: 0 },  // Nov
  { ti: 0, wi: 1, pr: 0, l: 1, te: 3, pi: 0 },  // Dec
];

export function monthIndexFromDate(isoDate: string): number {
  const m = parseInt(isoDate.slice(5, 7), 10);
  return Math.max(1, Math.min(12, m || 1));
}

export function getMonthModifiers(
  context: EngineContext,
  month: number
): Record<string, number> {
  const i = month - 1;
  if (context === "freshwater_lake_pond") {
    const r = LAKE[i]!;
    return {
      temperature_condition: r.t,
      pressure_regime: r.p,
      wind_condition: r.w,
      light_cloud_condition: r.l,
      precipitation_disruption: r.pr,
    };
  }
  if (context === "freshwater_river") {
    const r = RIVER[i]!;
    return {
      temperature_condition: r.t,
      pressure_regime: r.p,
      wind_condition: r.w,
      light_cloud_condition: r.l,
      runoff_flow_disruption: r.r,
    };
  }
  if (context === "coastal") {
    const r = COAST[i]!;
    return {
      tide_current_movement: r.ti,
      wind_condition: r.wi,
      pressure_regime: r.pr,
      light_cloud_condition: r.l,
      temperature_condition: r.te,
      precipitation_disruption: r.pi,
    };
  }
  if (context === "coastal_flats_estuary") {
    const r = FLATS[i]!;
    return {
      tide_current_movement: r.ti,
      wind_condition: r.wi,
      pressure_regime: r.pr,
      light_cloud_condition: r.l,
      temperature_condition: r.te,
      precipitation_disruption: r.pi,
    };
  }
  return {};
}
