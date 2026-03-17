// =============================================================================
// ENGINE V3 — Weight Profiles
// Keyed by region + month + water_type (environment_mode).
// State is NOT used — state is for baseline lookup only.
// =============================================================================

import type { RegionV3, EnvironmentModeV3, ScoreVariableId, VariableTierV3 } from '../types.ts';

export type MonthGroup = 'winter' | 'spring' | 'summer' | 'fall';

/** Map month 1-12 to season group. Explicit and documented. */
export function getMonthGroup(month: number): MonthGroup {
  if (month === 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

export interface VariableWeightEntry {
  variableId: ScoreVariableId;
  tier: VariableTierV3;
  baseWeight: number;
}

export interface WeightProfile {
  profileId: string;
  region: RegionV3;
  monthGroup: MonthGroup;
  mode: EnvironmentModeV3;
  variables: VariableWeightEntry[];
}

/** Base weights per variable; must sum to 1.0 for each profile. */
function buildProfile(
  profileId: string,
  region: RegionV3,
  monthGroup: MonthGroup,
  mode: EnvironmentModeV3,
  entries: Array<[ScoreVariableId, VariableTierV3, number]>
): WeightProfile {
  const variables: VariableWeightEntry[] = entries.map(([variableId, tier, baseWeight]) => ({
    variableId,
    tier,
    baseWeight,
  }));
  return { profileId, region, monthGroup, mode, variables };
}

// ---------------------------------------------------------------------------
// Freshwater lake profiles — no tide, no coastal water temp
// Primary: air_temp_trend, pressure, daylight
// Secondary: wind, cloud_cover, precipitation
// Tertiary: solunar
// ---------------------------------------------------------------------------

const FRESHWATER_LAKE_VARS: ScoreVariableId[] = [
  'air_temp_trend',
  'pressure',
  'wind',
  'cloud_cover_light',
  'precipitation',
  'solunar_moon',
  'daylight_time_of_day',
];

function freshwaterLakeProfile(
  region: RegionV3,
  monthGroup: MonthGroup
): WeightProfile {
  const id = `lake_${region}_${monthGroup}`;
  // Winter: daylight and pressure matter more; summer: air trend and light matter more
  if (monthGroup === 'winter') {
    return buildProfile(id, region, monthGroup, 'freshwater_lake', [
      ['air_temp_trend', 'primary', 0.20],
      ['pressure', 'primary', 0.22],
      ['daylight_time_of_day', 'primary', 0.18],
      ['wind', 'secondary', 0.12],
      ['cloud_cover_light', 'secondary', 0.10],
      ['precipitation', 'secondary', 0.10],
      ['solunar_moon', 'tertiary', 0.08],
    ]);
  }
  if (monthGroup === 'summer') {
    return buildProfile(id, region, monthGroup, 'freshwater_lake', [
      ['air_temp_trend', 'primary', 0.22],
      ['pressure', 'primary', 0.18],
      ['daylight_time_of_day', 'primary', 0.20],
      ['wind', 'secondary', 0.10],
      ['cloud_cover_light', 'secondary', 0.12],
      ['precipitation', 'secondary', 0.08],
      ['solunar_moon', 'tertiary', 0.10],
    ]);
  }
  // Spring/fall: balanced
  return buildProfile(id, region, monthGroup, 'freshwater_lake', [
    ['air_temp_trend', 'primary', 0.20],
    ['pressure', 'primary', 0.20],
    ['daylight_time_of_day', 'primary', 0.18],
    ['wind', 'secondary', 0.11],
    ['cloud_cover_light', 'secondary', 0.11],
    ['precipitation', 'secondary', 0.10],
    ['solunar_moon', 'tertiary', 0.10],
  ]);
}

// ---------------------------------------------------------------------------
// Freshwater river — same vars as lake; slightly different weights
// River: precipitation/runoff matters more
// ---------------------------------------------------------------------------

function freshwaterRiverProfile(
  region: RegionV3,
  monthGroup: MonthGroup
): WeightProfile {
  const id = `river_${region}_${monthGroup}`;
  return buildProfile(id, region, monthGroup, 'freshwater_river', [
    ['air_temp_trend', 'primary', 0.18],
    ['pressure', 'primary', 0.16],
    ['daylight_time_of_day', 'primary', 0.16],
    ['wind', 'secondary', 0.08],
    ['cloud_cover_light', 'secondary', 0.10],
    ['precipitation', 'primary', 0.14],
    ['solunar_moon', 'tertiary', 0.08],
  ]);
}

// ---------------------------------------------------------------------------
// Brackish / Saltwater — add tide_current (primary), coastal_water_temp (secondary when present)
// ---------------------------------------------------------------------------

const COASTAL_VARS: ScoreVariableId[] = [
  'tide_current',
  'coastal_water_temp',
  'air_temp_trend',
  'pressure',
  'wind',
  'cloud_cover_light',
  'precipitation',
  'solunar_moon',
  'daylight_time_of_day',
];

function brackishProfile(region: RegionV3, monthGroup: MonthGroup): WeightProfile {
  const id = `brackish_${region}_${monthGroup}`;
  return buildProfile(id, region, monthGroup, 'brackish', [
    ['tide_current', 'primary', 0.28],
    ['coastal_water_temp', 'secondary', 0.12],
    ['air_temp_trend', 'secondary', 0.08],
    ['pressure', 'primary', 0.14],
    ['wind', 'primary', 0.12],
    ['cloud_cover_light', 'secondary', 0.08],
    ['precipitation', 'secondary', 0.08],
    ['solunar_moon', 'tertiary', 0.06],
    ['daylight_time_of_day', 'secondary', 0.04],
  ]);
}

function saltwaterProfile(region: RegionV3, monthGroup: MonthGroup): WeightProfile {
  const id = `salt_${region}_${monthGroup}`;
  return buildProfile(id, region, monthGroup, 'saltwater', [
    ['tide_current', 'primary', 0.30],
    ['coastal_water_temp', 'secondary', 0.10],
    ['air_temp_trend', 'secondary', 0.06],
    ['pressure', 'primary', 0.14],
    ['wind', 'primary', 0.12],
    ['cloud_cover_light', 'secondary', 0.06],
    ['precipitation', 'secondary', 0.08],
    ['solunar_moon', 'tertiary', 0.06],
    ['daylight_time_of_day', 'secondary', 0.08],
  ]);
}

// ---------------------------------------------------------------------------
// Profile lookup — build all profiles on first access
// ---------------------------------------------------------------------------

const REGIONS: RegionV3[] = [
  'northeast',
  'great_lakes_upper_midwest',
  'mid_atlantic',
  'southeast_atlantic',
  'gulf_florida',
  'interior_south_plains',
  'west_southwest',
];

const MONTH_GROUPS: MonthGroup[] = ['winter', 'spring', 'summer', 'fall'];

let _profileCache: Map<string, WeightProfile> | null = null;

function buildAllProfiles(): Map<string, WeightProfile> {
  if (_profileCache) return _profileCache;
  const map = new Map<string, WeightProfile>();
  for (const region of REGIONS) {
    for (const mg of MONTH_GROUPS) {
      map.set(freshwaterLakeProfile(region, mg).profileId, freshwaterLakeProfile(region, mg));
      map.set(freshwaterRiverProfile(region, mg).profileId, freshwaterRiverProfile(region, mg));
      map.set(brackishProfile(region, mg).profileId, brackishProfile(region, mg));
      map.set(saltwaterProfile(region, mg).profileId, saltwaterProfile(region, mg));
    }
  }
  _profileCache = map;
  return map;
}

export function getWeightProfile(
  region: RegionV3,
  month: number,
  mode: EnvironmentModeV3
): WeightProfile {
  const monthGroup = getMonthGroup(month);
  const prefix =
    mode === 'freshwater_lake' ? 'lake' :
    mode === 'freshwater_river' ? 'river' :
    mode === 'brackish' ? 'brackish' : 'salt';
  const profileId = `${prefix}_${region}_${monthGroup}`;
  const profiles = buildAllProfiles();
  const p = profiles.get(profileId);
  if (!p) throw new Error(`Missing weight profile: ${profileId}`);
  return p;
}
