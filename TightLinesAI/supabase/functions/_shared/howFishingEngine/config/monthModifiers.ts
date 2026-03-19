import type { EngineContext } from "../contracts/mod.ts";

type LakeRow = { t: number; p: number; w: number; l: number; pr: number };
type RiverRow = { t: number; p: number; w: number; l: number; r: number };
type CoastalRow = { ti: number; wi: number; pr: number; l: number; te: number; pi: number };

const LAKE: LakeRow[] = [
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },
  { t: 3, p: 0, w: 0, l: 1, pr: 1 },
  { t: 2, p: 0, w: 0, l: 0, pr: 1 },
  { t: 1, p: 0, w: 0, l: 0, pr: 1 },
  { t: 0, p: 0, w: 1, l: 1, pr: 0 },
  { t: 0, p: 0, w: 1, l: 2, pr: 0 },
  { t: 0, p: 0, w: 1, l: 2, pr: 0 },
  { t: 1, p: 0, w: 0, l: 1, pr: 0 },
  { t: 2, p: 0, w: 0, l: 0, pr: 1 },
  { t: 3, p: 0, w: 0, l: 1, pr: 1 },
  { t: 4, p: 0, w: 0, l: 1, pr: 0 },
];

const RIVER: RiverRow[] = [
  { t: 4, p: 0, w: 0, l: 1, r: 1 },
  { t: 4, p: 0, w: 0, l: 1, r: 1 },
  { t: 3, p: 0, w: 0, l: 0, r: 3 },
  { t: 2, p: 0, w: 0, l: 0, r: 4 },
  { t: 1, p: 0, w: 0, l: 0, r: 3 },
  { t: 0, p: 0, w: 1, l: 1, r: 1 },
  { t: 0, p: 0, w: 1, l: 1, r: 0 },
  { t: 0, p: 0, w: 1, l: 1, r: 0 },
  { t: 1, p: 0, w: 0, l: 0, r: 0 },
  { t: 2, p: 0, w: 0, l: 0, r: 1 },
  { t: 3, p: 0, w: 0, l: 0, r: 1 },
  { t: 4, p: 0, w: 0, l: 1, r: 1 },
];

const COAST: CoastalRow[] = [
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 2, pi: 0 },
  { ti: 1, wi: 0, pr: 0, l: 0, te: 1, pi: 0 },
  { ti: 1, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  { ti: 0, wi: 1, pr: 0, l: 1, te: 0, pi: 0 },
  { ti: 0, wi: 1, pr: 0, l: 1, te: 1, pi: 0 },
  { ti: 0, wi: 1, pr: 0, l: 1, te: 1, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 0, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 1, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 2, pi: 0 },
  { ti: 1, wi: 1, pr: 0, l: 0, te: 3, pi: 0 },
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
