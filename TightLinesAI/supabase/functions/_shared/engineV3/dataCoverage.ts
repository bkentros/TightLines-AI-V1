// =============================================================================
// ENGINE V3 — Data Coverage / Confidence Structure
// Phase 1: Formal data coverage summary for scoring and narration.
// Does not implement final scoring confidence logic.
// =============================================================================

import type { NormalizedEnvironmentV3, DataCoverageV3, GeoContextV3 } from './types.ts';

function hasValue<T>(v: { value: T | null }): boolean {
  return v != null && v.value != null;
}

/**
 * Builds the V3 data coverage summary from normalized environment and context.
 */
export function buildDataCoverageV3(
  env: NormalizedEnvironmentV3,
  ctx: GeoContextV3
): DataCoverageV3 {
  const present: string[] = [];
  const missing: string[] = [];
  const partial: string[] = [];

  // Atmospheric
  if (hasValue(env.atmospheric.airTempF)) present.push('air_temp');
  else missing.push('air_temp');

  if (hasValue(env.atmospheric.airTempTrend3Day) || hasValue(env.atmospheric.airTempTrendDirectionF)) {
    present.push('air_temp_trend');
  } else missing.push('air_temp_trend');

  if (hasValue(env.atmospheric.pressureMb)) present.push('pressure');
  else missing.push('pressure');

  if (hasValue(env.atmospheric.pressureTrend) || hasValue(env.atmospheric.pressureChangeRateMbHr)) {
    present.push('pressure_trend');
  } else partial.push('pressure_trend');

  if (hasValue(env.atmospheric.windSpeedMph)) present.push('wind');
  else missing.push('wind');

  if (hasValue(env.atmospheric.cloudCoverPct)) present.push('cloud_cover_light');
  else missing.push('cloud_cover_light');

  // Precipitation
  const hasPrecip =
    hasValue(env.precipitation.precip48hrInches) ||
    hasValue(env.precipitation.precip7dayInches) ||
    hasValue(env.precipitation.currentPrecipInHr);
  if (hasPrecip) present.push('precipitation');
  else missing.push('precipitation');

  // Lunar / solunar
  const hasSolunar =
    (env.lunar_solunar.solunarMajorPeriods?.length ?? 0) > 0 ||
    (env.lunar_solunar.solunarMinorPeriods?.length ?? 0) > 0;
  if (hasSolunar || hasValue(env.lunar_solunar.moonPhase)) {
    present.push('solunar_moon');
  } else missing.push('solunar_moon');

  // Tide (coastal only)
  const marineRelevant = ctx.waterType === 'saltwater' || ctx.waterType === 'brackish';
  const marinePresent =
    marineRelevant &&
    (env.marine_tide.tidePredictionsToday?.length ?? 0) > 0;
  if (marineRelevant) {
    if (marinePresent) present.push('tide_current');
    else missing.push('tide_current');
  }

  // Water temp
  const waterTempRelevant = true;
  const coastalWaterPresent = hasValue(env.water_temperature.coastalMeasuredF);
  const freshwaterRelevant = ctx.waterType === 'freshwater';
  const freshwaterPresent = hasValue(env.water_temperature.freshwaterMeasuredF);

  if (marineRelevant && coastalWaterPresent) present.push('coastal_water_temp');
  else if (marineRelevant) missing.push('coastal_water_temp');

  if (freshwaterRelevant) {
    if (freshwaterPresent) present.push('freshwater_water_temp_range_context');
    else missing.push('freshwater_water_temp_range_context');
  }

  // Daylight
  const hasDaylight =
    hasValue(env.light_daylight.sunriseLocal) && hasValue(env.light_daylight.sunsetLocal);
  if (hasDaylight) present.push('daylight_time_of_day');
  else missing.push('daylight_time_of_day');

  const h = env.historical_context_inputs;
  const historicalBaselineAvailable =
    Boolean(h?.airTempBaseline) ||
    Boolean(h?.precipBaseline) ||
    Boolean(h?.freshwaterTempBaseline) ||
    Boolean(h?.coastalWaterTempBaseline);

  return {
    variableGroupsPresent: present,
    variableGroupsMissing: missing,
    partialDataGroups: partial,
    historicalBaselineAvailable,
    stateResolved: Boolean(h?.stateResolved),
    airTempBaselineAvailable: Boolean(h?.airTempBaseline),
    precipBaselineAvailable: Boolean(h?.precipBaseline),
    freshwaterTempBaselineAvailable: Boolean(h?.freshwaterTempBaseline),
    coastalWaterTempBaselineAvailable: Boolean(h?.coastalWaterTempBaseline),
    marineTideRelevant: marineRelevant,
    marineTidePresent: marinePresent,
    waterTempRelevant,
    waterTempPresent: coastalWaterPresent || freshwaterPresent,
    freshwaterWaterTempRelevant: freshwaterRelevant,
    freshwaterWaterTempPresent: freshwaterPresent,
  };
}
