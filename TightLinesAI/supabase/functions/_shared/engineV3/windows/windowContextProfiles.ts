// =============================================================================
// ENGINE V3 — Window Context Profiles
// Window shaping varies by region + month + water_type + subtype.
// Used to adjust base block scores and modifier priorities.
// =============================================================================

import type { RegionV3, EnvironmentModeV3 } from '../types.ts';
import { getMonthGroup, type MonthGroup } from '../weights/weightProfiles.ts';

export interface WindowContextProfile {
  profileId: string;
  region: RegionV3;
  monthGroup: MonthGroup;
  mode: EnvironmentModeV3;
  /** Cold-season: warming parts of day matter more; solunar matters less */
  favorsWarmingPeriods: boolean;
  /** Hot-season: low-light and cooler periods matter more */
  favorsLowLightPeriods: boolean;
  /** Cloud cover can improve midday when true */
  cloudCanImproveMidday: boolean;
  /** Tide/current is primary driver (coastal) */
  tidePrimary: boolean;
  /** Solunar can meaningfully shape windows when regime allows */
  solunarCanShape: boolean;
}

function buildProfile(
  id: string,
  region: RegionV3,
  monthGroup: MonthGroup,
  mode: EnvironmentModeV3,
  opts: Partial<Omit<WindowContextProfile, 'profileId' | 'region' | 'monthGroup' | 'mode'>>
): WindowContextProfile {
  return {
    profileId: id,
    region,
    monthGroup,
    mode,
    favorsWarmingPeriods: opts.favorsWarmingPeriods ?? false,
    favorsLowLightPeriods: opts.favorsLowLightPeriods ?? false,
    cloudCanImproveMidday: opts.cloudCanImproveMidday ?? true,
    tidePrimary: opts.tidePrimary ?? false,
    solunarCanShape: opts.solunarCanShape ?? true,
  };
}

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

let _cache: Map<string, WindowContextProfile> | null = null;

function buildAllProfiles(): Map<string, WindowContextProfile> {
  if (_cache) return _cache;
  const map = new Map<string, WindowContextProfile>();

  for (const region of REGIONS) {
    for (const mg of MONTH_GROUPS) {
      const prefix = (r: RegionV3, m: MonthGroup) => `${r}_${m}`;

      for (const mode of ['freshwater_lake', 'freshwater_river'] as EnvironmentModeV3[]) {
        const id = `fw_${prefix(region, mg)}_${mode}`;
        const isWinter = mg === 'winter';
        const isSummer = mg === 'summer';
        map.set(
          id,
          buildProfile(id, region, mg, mode, {
            favorsWarmingPeriods: isWinter,
            favorsLowLightPeriods: isSummer,
            cloudCanImproveMidday: true,
            tidePrimary: false,
            solunarCanShape: true,
          })
        );
      }

      for (const mode of ['brackish', 'saltwater'] as EnvironmentModeV3[]) {
        const id = `coastal_${prefix(region, mg)}_${mode}`;
        map.set(
          id,
          buildProfile(id, region, mg, mode, {
            favorsWarmingPeriods: mg === 'winter',
            favorsLowLightPeriods: mg === 'summer',
            cloudCanImproveMidday: true,
            tidePrimary: true,
            solunarCanShape: true,
          })
        );
      }
    }
  }

  _cache = map;
  return map;
}

export function getWindowContextProfile(
  region: RegionV3,
  month: number,
  mode: EnvironmentModeV3
): WindowContextProfile {
  const monthGroup = getMonthGroup(month);
  const prefix =
    mode === 'freshwater_lake' || mode === 'freshwater_river'
      ? `fw_${region}_${monthGroup}_${mode}`
      : `coastal_${region}_${monthGroup}_${mode}`;
  const profiles = buildAllProfiles();
  const p = profiles.get(prefix);
  if (!p) throw new Error(`Missing window context profile: ${prefix}`);
  return p;
}
