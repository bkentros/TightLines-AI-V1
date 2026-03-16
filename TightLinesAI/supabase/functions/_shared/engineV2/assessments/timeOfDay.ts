// =============================================================================
// ENGINE V2 — Time of Day Assessment
//
// Evaluates the current local time of day relative to expected activity windows.
// Non-species-specific. Operates on broad dawn/dusk advantage principles.
//
// Logic summary:
// - Dawn and dusk are broadly the best fishing windows across most contexts
// - Overcast softens this pattern (daytime more usable)
// - Full sun compounds midday suppression
// - Night gets a neutral/low score — not enough data to be specific without
//   strong moon/tide support (which is handled in moonSolunar/tideCurrent)
// - No species-specific claims about spawning behavior or exact structure
//
// Data used:
// - Current UTC timestamp + location timezone (to determine local time of day)
// - Sunrise/sunset from solarLunar
// - Cloud cover condition (from light assessment)
// - Seasonal state (winter midday vs summer midday differ)
//
// LIMITATION: The engine cannot know the user's exact fishing time — it knows
// the current time when the report is generated. Time-of-day is therefore a
// "right now" assessment, not a window forecast.
// That is the job of the opportunity curve (Phase 6).
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';
import type { LightConditionLabel } from './light.ts';

type TimeOfDayPeriod =
  | 'pre_dawn'
  | 'dawn'
  | 'early_morning'
  | 'midday'
  | 'late_afternoon'
  | 'dusk'
  | 'evening'
  | 'night'
  | 'unknown';

// ---------------------------------------------------------------------------
// Parse "HH:MM" time string to minutes since midnight
// ---------------------------------------------------------------------------

function parseTimeToMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  // Handle both "HH:MM" and full ISO / AM-PM strings
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

// ---------------------------------------------------------------------------
// Classify current time of day relative to sunrise/sunset
// ---------------------------------------------------------------------------

function classifyTimeOfDay(
  env: NormalizedEnvironmentV2,
  timezoneOffset: number = 0 // hours from UTC; we'll use a best-effort approach
): TimeOfDayPeriod {
  const sunrise = parseTimeToMinutes(env.solarLunar.sunriseLocal);
  const sunset = parseTimeToMinutes(env.solarLunar.sunsetLocal);
  const twilightBegin = parseTimeToMinutes(env.solarLunar.civilTwilightBeginLocal);
  const twilightEnd = parseTimeToMinutes(env.solarLunar.civilTwilightEndLocal);

  if (sunrise == null || sunset == null) {
    return 'unknown';
  }

  // Get current local time of day
  // We derive from current UTC time + timezone offset
  const nowUtc = new Date();
  const nowLocalMinutes = ((nowUtc.getUTCHours() * 60 + nowUtc.getUTCMinutes() + timezoneOffset * 60) % 1440 + 1440) % 1440;

  const preDawnStart = (twilightBegin ?? sunrise - 45);
  const dawnStart = preDawnStart;
  const dawnEnd = sunrise + 30;
  const earlyMorningEnd = sunrise + 150; // ~2.5hr after sunrise
  const middayStart = earlyMorningEnd;
  const lateAfternoonStart = sunset - 180; // ~3hr before sunset
  const duskStart = sunset - 30;
  const duskEnd = (twilightEnd ?? sunset + 45);
  const eveningEnd = duskEnd + 90;

  if (nowLocalMinutes < preDawnStart) return 'night';
  if (nowLocalMinutes < dawnEnd) return 'dawn';
  if (nowLocalMinutes < earlyMorningEnd) return 'early_morning';
  if (nowLocalMinutes < lateAfternoonStart) return 'midday';
  if (nowLocalMinutes < duskStart) return 'late_afternoon';
  if (nowLocalMinutes < duskEnd) return 'dusk';
  if (nowLocalMinutes < eveningEnd) return 'evening';
  return 'night';
}

// ---------------------------------------------------------------------------
// Score by time of day period
// ---------------------------------------------------------------------------

function periodToScore(
  period: TimeOfDayPeriod,
  lightCondition: LightConditionLabel,
  ctx: ResolvedContext,
  thermalStateLabel: string
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  const overcastOrCloudy = lightCondition === 'overcast' || lightCondition === 'mostly_cloudy';
  const brightSun = lightCondition === 'full_sun' || lightCondition === 'mostly_clear';
  const inHeatStress = thermalStateLabel === 'heat_stress' || thermalStateLabel === 'severe_heat';

  switch (period) {
    case 'pre_dawn':
      return {
        score: 58,
        stateLabel: 'pre_dawn_building',
        tags: ['pre_dawn', 'activity_beginning_to_build'],
        direction: 'neutral',
      };

    case 'dawn':
      return {
        score: 82,
        stateLabel: 'dawn_prime_window',
        tags: ['dawn_window', 'low_light_peak', 'high_activity_potential'],
        direction: 'positive',
      };

    case 'early_morning': {
      const score = overcastOrCloudy ? 72 : 68;
      return {
        score,
        stateLabel: 'early_morning_good_window',
        tags: ['early_morning', 'favorable_low_light_period'],
        direction: 'positive',
      };
    }

    case 'midday': {
      // Midday is most suppressed; overcast softens it; heat compounds it
      let score = 45;
      if (overcastOrCloudy) score = 58;
      else if (brightSun && inHeatStress) score = 28;
      else if (brightSun) score = 38;
      return {
        score,
        stateLabel: brightSun && inHeatStress ? 'midday_heat_suppression' : 'midday_window',
        tags: inHeatStress && brightSun
          ? ['midday', 'heat_and_bright_sun_suppress_activity', 'best_windows_at_low_light']
          : overcastOrCloudy
            ? ['midday', 'overcast_extends_usable_window']
            : ['midday', 'activity_slower_than_dawn_dusk'],
        direction: (brightSun && !overcastOrCloudy) ? 'negative' : 'neutral',
      };
    }

    case 'late_afternoon': {
      const score = overcastOrCloudy ? 65 : 60;
      return {
        score,
        stateLabel: 'late_afternoon_improving',
        tags: ['late_afternoon', 'activity_beginning_to_pick_up'],
        direction: 'neutral',
      };
    }

    case 'dusk':
      return {
        score: 80,
        stateLabel: 'dusk_prime_window',
        tags: ['dusk_window', 'low_light_peak', 'high_activity_potential'],
        direction: 'positive',
      };

    case 'evening': {
      const score = ctx.isCoastal ? 62 : 52; // coastal/tidal evening can still be good
      return {
        score,
        stateLabel: 'evening_winding_down',
        tags: ['evening', 'activity_tapering_off'],
        direction: 'neutral',
      };
    }

    case 'night':
      return {
        score: 48,
        stateLabel: 'night_limited_data',
        tags: ['night', 'activity_level_depends_on_moon_tide_support'],
        direction: 'neutral',
      };

    case 'unknown':
    default:
      return {
        score: 52,
        stateLabel: 'time_of_day_unknown',
        tags: ['time_of_day_cannot_be_determined'],
        direction: 'neutral',
      };
  }
}

// ---------------------------------------------------------------------------
// Derive timezone offset from env
// ---------------------------------------------------------------------------

function getTimezoneOffsetHours(env: NormalizedEnvironmentV2): number {
  return env.location.tzOffsetHours ?? 0;
}

// ---------------------------------------------------------------------------
// Main time of day assessment
// ---------------------------------------------------------------------------

export function assessTimeOfDay(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext,
  lightCondition: LightConditionLabel,
  thermalStateLabel: string
): SingleAssessment {
  const tzOffset = getTimezoneOffsetHours(env);
  const period = classifyTimeOfDay(env, tzOffset);

  const { score, stateLabel, tags, direction } = periodToScore(period, lightCondition, ctx, thermalStateLabel);

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    // Time of day is reliable when we have sunrise/sunset data
    confidenceDependency: (env.solarLunar.sunriseLocal && env.solarLunar.sunsetLocal) ? 'high' : 'very_low',
    applicable: true,
  };
}

export type { TimeOfDayPeriod };
