// =============================================================================
// ENGINE V2 — Pressure Assessment
//
// Evaluates barometric pressure state and trend for fish activity influence.
// Non-species-specific — operates on broad behavioral pressure responses.
//
// Key behaviors:
// - Stable / slowly rising pressure → supportive (fish adapt, feed normally)
// - Slowly falling pressure → often activating (pre-front feeding pickup)
// - Rapidly falling → front incoming suppression (fish feel it, often shut down)
// - Rapidly rising post-front → strong suppression (bluebird lockdown pattern)
// - Data quality matters — if no pressure history, output is weakly penalized
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

// ---------------------------------------------------------------------------
// Pressure trend classification thresholds
// Rate in mb/hr from the raw history
// ---------------------------------------------------------------------------

export type PressureTrendLabel =
  | 'rapidly_falling'    // < -0.8 mb/hr — front approaching, shutdown
  | 'slowly_falling'     // -0.8 to -0.2 mb/hr — pre-front feeding pickup
  | 'stable'             // -0.2 to +0.2 mb/hr — neutral/supportive
  | 'slowly_rising'      // +0.2 to +0.8 mb/hr — post-front stabilizing
  | 'rapidly_rising'     // > +0.8 mb/hr — sharp post-front bluebird, lockdown
  | 'unknown';

export type PressureLevelLabel =
  | 'very_low'    // < 990 mb — low pressure system
  | 'low'         // 990–1005 mb
  | 'normal'      // 1005–1025 mb — average sea-level range
  | 'high'        // 1025–1035 mb
  | 'very_high';  // > 1035 mb — strong high pressure

// ---------------------------------------------------------------------------
// Compute trend from hourly history
// ---------------------------------------------------------------------------

function computePressureTrend(env: NormalizedEnvironmentV2): {
  trend: PressureTrendLabel;
  ratePerHour: number | null;
  deltaOver3h: number | null;
} {
  const history = env.histories.hourlyPressureMb;

  // Also check the weather blob for a pre-computed trend
  const weatherBlob = env as unknown as Record<string, unknown>;
  const weatherPressureTrend = (weatherBlob as { weather?: { pressure_trend?: string } })
    ?.weather?.pressure_trend;

  // Use pre-computed trend from get-environment if we lack raw history
  if ((!history || history.length < 4) && weatherPressureTrend) {
    const trendMap: Record<string, PressureTrendLabel> = {
      rapidly_falling: 'rapidly_falling',
      slowly_falling: 'slowly_falling',
      stable: 'stable',
      slowly_rising: 'slowly_rising',
      rapidly_rising: 'rapidly_rising',
    };
    return {
      trend: trendMap[weatherPressureTrend] ?? 'unknown',
      ratePerHour: null,
      deltaOver3h: null,
    };
  }

  if (!history || history.length < 4) {
    return { trend: 'unknown', ratePerHour: null, deltaOver3h: null };
  }

  // Sort by time and take last 6 hours
  const sorted = [...history]
    .sort((a, b) => a.timeUtc.localeCompare(b.timeUtc))
    .slice(-6);

  const recent = sorted.slice(-1)[0];
  const oldest = sorted[0];
  const hourSpan = Math.max(1, sorted.length - 1);
  const totalDelta = recent.value - oldest.value;
  const ratePerHour = totalDelta / hourSpan;

  // 3-hour delta for labeling
  const threeHourSlice = sorted.slice(-4);
  const deltaOver3h = threeHourSlice.length >= 2
    ? threeHourSlice[threeHourSlice.length - 1].value - threeHourSlice[0].value
    : null;

  let trend: PressureTrendLabel;
  if (ratePerHour < -0.8) trend = 'rapidly_falling';
  else if (ratePerHour < -0.2) trend = 'slowly_falling';
  else if (ratePerHour <= 0.2) trend = 'stable';
  else if (ratePerHour <= 0.8) trend = 'slowly_rising';
  else trend = 'rapidly_rising';

  return { trend, ratePerHour, deltaOver3h };
}

function classifyPressureLevel(pressureMb: number | null | undefined): PressureLevelLabel {
  if (pressureMb == null) return 'normal'; // assume normal if unknown
  if (pressureMb < 990) return 'very_low';
  if (pressureMb < 1005) return 'low';
  if (pressureMb <= 1025) return 'normal';
  if (pressureMb <= 1035) return 'high';
  return 'very_high';
}

// ---------------------------------------------------------------------------
// Score and state from trend + level
// ---------------------------------------------------------------------------

function trendToScore(
  trend: PressureTrendLabel,
  level: PressureLevelLabel,
  ctx: ResolvedContext
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  // Base score from trend
  let baseScore: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  switch (trend) {
    case 'rapidly_rising':
      // Sharp post-front bluebird — classic lockdown. Strong suppressor.
      baseScore = 22;
      stateLabel = 'post_front_pressure_spike';
      tags = ['post_front_lockdown', 'sharply_rising_pressure', 'fish_adjusting_to_front_passage'];
      direction = 'negative';
      break;
    case 'slowly_rising':
      // Recovering from front — improving but not there yet
      baseScore = 52;
      stateLabel = 'stabilizing_after_front';
      tags = ['pressure_recovering', 'conditions_stabilizing'];
      direction = 'neutral';
      break;
    case 'stable':
      // Best baseline — fish are adapted
      baseScore = 72;
      stateLabel = 'stable_pressure';
      tags = ['stable_pressure', 'fish_adapted_to_current_conditions'];
      direction = 'positive';
      break;
    case 'slowly_falling':
      // Pre-front feeding window — often the best pressure setup
      baseScore = 78;
      stateLabel = 'falling_pressure_feeding_window';
      tags = ['falling_pressure', 'pre_front_feeding_pickup'];
      direction = 'positive';
      break;
    case 'rapidly_falling':
      // Front incoming — fish can feel instability, often go quiet
      baseScore = 30;
      stateLabel = 'rapid_pressure_fall_front_incoming';
      tags = ['rapid_pressure_drop', 'front_approaching', 'pre_front_suppression'];
      direction = 'negative';
      break;
    case 'unknown':
    default:
      // No trend data — mild neutral penalty (can't assess)
      baseScore = 48;
      stateLabel = 'pressure_trend_unknown';
      tags = ['pressure_data_limited'];
      direction = 'neutral';
      break;
  }

  // Pressure level modifier — very low or very high absolute levels add penalty
  let levelModifier = 0;
  if (level === 'very_low') levelModifier = -8;
  else if (level === 'low') levelModifier = -3;
  else if (level === 'high') levelModifier = 3;  // high pressure = generally cleaner conditions
  else if (level === 'very_high') levelModifier = -5; // extreme high can also be suppressive

  // Freshwater rivers are less sensitive to barometric pressure than lakes
  // (current and flow state matters more; pressure still relevant but secondary)
  const modeMultiplier = ctx.environmentMode === 'freshwater_river' ? 0.85 : 1.0;

  const adjustedScore = Math.max(0, Math.min(100,
    Math.round((baseScore + levelModifier - 50) * modeMultiplier + 50)
  ));

  return { score: adjustedScore, stateLabel, tags, direction };
}

// ---------------------------------------------------------------------------
// Main pressure assessment function
// ---------------------------------------------------------------------------

export function assessPressure(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): SingleAssessment & { trendLabel: PressureTrendLabel; stateSummary: string } {
  const { trend, ratePerHour } = computePressureTrend(env);
  const level = classifyPressureLevel(env.current.pressureMb);

  const { score, stateLabel, tags, direction } = trendToScore(trend, level, ctx);

  // If no pressure data at all, return a weak neutral assessment
  const hasAnyPressureData = env.current.pressureMb != null || (
    env.histories.hourlyPressureMb != null && env.histories.hourlyPressureMb.length > 0
  );

  if (!hasAnyPressureData) {
    return {
      componentScore: 50,
      stateLabel: 'no_pressure_data',
      dominantTags: ['pressure_data_unavailable'],
      direction: 'neutral',
      confidenceDependency: 'very_low',
      applicable: true,
      trendLabel: 'unknown',
      stateSummary: 'Pressure data not available',
    };
  }

  // Build readable summary for LLM payload
  const stateSummary = buildPressureStateSummary(trend, level, ratePerHour);

  return {
    componentScore: score,
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: trend === 'unknown' ? 'low' : 'moderate',
    applicable: true,
    trendLabel: trend,
    stateSummary,
  };
}

function buildPressureStateSummary(
  trend: PressureTrendLabel,
  level: PressureLevelLabel,
  ratePerHour: number | null
): string {
  const trendDesc: Record<PressureTrendLabel, string> = {
    rapidly_falling: 'rapidly falling (front approaching)',
    slowly_falling: 'slowly falling (pre-front feeding window)',
    stable: 'stable',
    slowly_rising: 'slowly rising (stabilizing)',
    rapidly_rising: 'sharply rising (post-front lockdown)',
    unknown: 'trend unknown',
  };
  const levelDesc: Record<PressureLevelLabel, string> = {
    very_low: 'very low',
    low: 'low',
    normal: 'normal',
    high: 'high',
    very_high: 'very high',
  };
  const rate = ratePerHour != null ? ` (${ratePerHour > 0 ? '+' : ''}${ratePerHour.toFixed(1)} mb/hr)` : '';
  return `${levelDesc[level]} pressure, ${trendDesc[trend]}${rate}`;
}
