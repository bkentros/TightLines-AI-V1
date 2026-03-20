import type { EngineContext, RegionKey } from "../contracts/mod.ts";

type LakeR = { t: number; p: number; w: number; l: number; pr: number };
type RiverR = { t: number; p: number; w: number; l: number; r: number };
type CoastalR = { ti: number; wi: number; pr: number; l: number; te: number; pi: number };

const LAKE: Record<RegionKey, LakeR> = {
  northeast: { t: 2, p: 0, w: 1, l: 0, pr: 0 },
  southeast_atlantic: { t: 0, p: 0, w: 0, l: 0, pr: 0 },
  florida: { t: -1, p: 0, w: 0, l: 1, pr: -1 },
  gulf_coast: { t: -1, p: 0, w: 0, l: 1, pr: -1 },
  great_lakes_upper_midwest: { t: 3, p: 0, w: 1, l: 0, pr: 0 },
  midwest_interior: { t: 2, p: 0, w: 0, l: 0, pr: 0 },
  south_central: { t: 0, p: 0, w: 0, l: 0, pr: 0 },
  mountain_west: { t: 2, p: 0, w: 1, l: 0, pr: 0 },
  southwest_desert: { t: -1, p: 0, w: 0, l: 1, pr: -1 },
  southwest_high_desert: { t: 1, p: 0, w: 0, l: 0, pr: 0 },
  pacific_northwest: { t: 1, p: 0, w: 1, l: 0, pr: 0 },
  southern_california: { t: 0, p: 0, w: 0, l: 1, pr: -1 },
};

const RIVER: Record<RegionKey, RiverR> = {
  northeast: { t: 1, p: 0, w: 0, l: 0, r: 2 },
  southeast_atlantic: { t: 0, p: 0, w: 0, l: 0, r: 1 },
  florida: { t: -1, p: 0, w: 0, l: 0, r: 0 },
  gulf_coast: { t: -1, p: 0, w: 0, l: 0, r: 1 },
  great_lakes_upper_midwest: { t: 2, p: 0, w: 0, l: 0, r: 2 },
  midwest_interior: { t: 1, p: 0, w: 0, l: 0, r: 2 },
  south_central: { t: 0, p: 0, w: 0, l: 0, r: 1 },
  mountain_west: { t: 1, p: 0, w: 0, l: 0, r: 1 },
  southwest_desert: { t: 0, p: 0, w: 0, l: 0, r: 2 },
  southwest_high_desert: { t: 0, p: 0, w: 0, l: 0, r: 2 },
  pacific_northwest: { t: 0, p: 0, w: 0, l: 0, r: 2 },
  southern_california: { t: 0, p: 0, w: 0, l: 0, r: 2 },
};

const COAST: Record<RegionKey, CoastalR> = {
  northeast: { ti: 1, wi: 1, pr: 0, l: 0, te: 1, pi: 0 },
  southeast_atlantic: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: -1 },
  florida: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: -1 },
  gulf_coast: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  great_lakes_upper_midwest: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  midwest_interior: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  south_central: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  mountain_west: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: 0 },
  southwest_desert: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: -1 },
  southwest_high_desert: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: -1 },
  pacific_northwest: { ti: 1, wi: 1, pr: 0, l: 0, te: 0, pi: -1 },
  southern_california: { ti: 0, wi: 0, pr: 0, l: 0, te: 0, pi: -1 },
};

export function getRegionModifiers(
  context: EngineContext,
  region: RegionKey
): Record<string, number> {
  if (context === "freshwater_lake_pond") {
    const r = LAKE[region]!;
    return {
      temperature_condition: r.t,
      pressure_regime: r.p,
      wind_condition: r.w,
      light_cloud_condition: r.l,
      precipitation_disruption: r.pr,
    };
  }
  if (context === "freshwater_river") {
    const r = RIVER[region]!;
    return {
      temperature_condition: r.t,
      pressure_regime: r.p,
      wind_condition: r.w,
      light_cloud_condition: r.l,
      runoff_flow_disruption: r.r,
    };
  }
  const r = COAST[region]!;
  return {
    tide_current_movement: r.ti,
    wind_condition: r.wi,
    pressure_regime: r.pr,
    light_cloud_condition: r.l,
    temperature_condition: r.te,
    precipitation_disruption: r.pi,
  };
}
