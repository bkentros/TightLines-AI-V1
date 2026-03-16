// =============================================================================
// ENGINE V2 — Moon / Solunar Assessment
//
// Provides CONDITIONAL SUPPORTING context for timing refinement.
// This is NOT a primary score driver — it modulates, not dominates.
//
// Rules per spec:
// - Moon/solunar should "refine timing / feeding support when baseline
//   conditions are already reasonable"
// - Must NOT dominate the final score
// - Should have LOWER influence during strong suppression conditions
// - Weight in the score composition should remain low (per config pack)
//
// Logic summary:
// - Strong solunar major periods = modest positive push
// - New moon + solunar alignment = slight boost
// - Full moon = mixed depending on context (bright nights can suppress freshwater)
// - Poor baseline (suppressed thermal/pressure) = solunar contribution scaled down
// - No moon/tide data = neutral with low confidence
//
// Data used:
// - solunarMajorPeriods / solunarMinorPeriods with current time overlap
// - moonPhase
// - moonIlluminationPct
// - moonIsWaxing
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

type MoonPhaseCategory =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'third_quarter'
  | 'waning_crescent'
  | 'unknown';

function classifyMoonPhase(
  phaseStr: string | null | undefined,
  illumPct: number | null | undefined
): MoonPhaseCategory {
  if (phaseStr) {
    const lower = phaseStr.toLowerCase();
    if (lower.includes('new')) return 'new_moon';
    if (lower.includes('waxing crescent') || (lower.includes('waxing') && lower.includes('crescent'))) return 'waxing_crescent';
    if (lower.includes('first quarter') || lower.includes('first_quarter')) return 'first_quarter';
    if (lower.includes('waxing gibbous') || (lower.includes('waxing') && lower.includes('gibbous'))) return 'waxing_gibbous';
    if (lower.includes('full')) return 'full_moon';
    if (lower.includes('waning gibbous') || (lower.includes('waning') && lower.includes('gibbous'))) return 'waning_gibbous';
    if (lower.includes('third quarter') || lower.includes('last quarter')) return 'third_quarter';
    if (lower.includes('waning crescent') || (lower.includes('waning') && lower.includes('crescent'))) return 'waning_crescent';
  }
  if (illumPct != null) {
    if (illumPct < 5) return 'new_moon';
    if (illumPct > 95) return 'full_moon';
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Check if current time falls within a solunar period
// ---------------------------------------------------------------------------

function parseTimeMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

type SolunarSupport = 'major_active' | 'minor_active' | 'approaching_major' | 'none' | 'unknown';

function getSolunarSupport(
  env: NormalizedEnvironmentV2,
  tzOffset: number
): SolunarSupport {
  const major = env.solarLunar.solunarMajorPeriods ?? [];
  const minor = env.solarLunar.solunarMinorPeriods ?? [];

  if (major.length === 0 && minor.length === 0) return 'unknown';

  const nowUtc = new Date();
  const nowLocalMinutes = ((nowUtc.getUTCHours() * 60 + nowUtc.getUTCMinutes() + tzOffset * 60) % 1440 + 1440) % 1440;

  // Check if now is within any major period (or within 45 min approaching)
  for (const period of major) {
    const start = parseTimeMinutes(period.startLocal);
    const end = parseTimeMinutes(period.endLocal);
    if (start == null || end == null) continue;
    if (nowLocalMinutes >= start && nowLocalMinutes <= end) return 'major_active';
    if (nowLocalMinutes >= start - 45 && nowLocalMinutes < start) return 'approaching_major';
  }

  // Check minor
  for (const period of minor) {
    const start = parseTimeMinutes(period.startLocal);
    const end = parseTimeMinutes(period.endLocal);
    if (start == null || end == null) continue;
    if (nowLocalMinutes >= start && nowLocalMinutes <= end) return 'minor_active';
  }

  return 'none';
}

// ---------------------------------------------------------------------------
// Score moon/solunar — kept intentionally modest in scale
// Max contribution: +15 above neutral (never dominant)
// Min contribution: -5 below neutral (not punishing)
// ---------------------------------------------------------------------------

function moonSolunarToScore(
  phase: MoonPhaseCategory,
  solunarSupport: SolunarSupport,
  ctx: ResolvedContext
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  // Base from solunar timing
  let base: number;
  let timingLabel: string;

  switch (solunarSupport) {
    case 'major_active':
      base = 72;
      timingLabel = 'solunar_major_period_active';
      break;
    case 'approaching_major':
      base = 65;
      timingLabel = 'solunar_major_approaching';
      break;
    case 'minor_active':
      base = 60;
      timingLabel = 'solunar_minor_period_active';
      break;
    case 'none':
      base = 50;
      timingLabel = 'between_solunar_periods';
      break;
    case 'unknown':
    default:
      base = 50;
      timingLabel = 'solunar_data_unavailable';
      break;
  }

  // Phase modifier — small adjustment only
  let phaseAdj = 0;
  const tags: string[] = [timingLabel];

  switch (phase) {
    case 'new_moon':
    case 'full_moon':
      phaseAdj = 5; // strongest gravitational pull
      tags.push(phase === 'new_moon' ? 'new_moon_gravitational_peak' : 'full_moon_gravitational_peak');
      break;
    case 'first_quarter':
    case 'third_quarter':
      phaseAdj = 2;
      tags.push('quarter_moon');
      break;
    default:
      tags.push('moon_phase_minor_effect');
      break;
  }

  const rawScore = base + phaseAdj;

  // Keep bounded in a narrow supportive range [45, 77]
  // This enforces the spec: solunar refines but does NOT dominate
  const score = Math.max(45, Math.min(77, rawScore));

  const direction: 'positive' | 'negative' | 'neutral' =
    score >= 65 ? 'positive' :
    score <= 48 ? 'negative' :
    'neutral';

  return { score, stateLabel: timingLabel, tags, direction };
}

// ---------------------------------------------------------------------------
// Main moon/solunar assessment
// ---------------------------------------------------------------------------

export function assessMoonSolunar(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext,
  baselineScore: number // overall score context — solunar deweighted during suppression
): SingleAssessment {
  const tzOffset = env.location.tzOffsetHours ?? 0;

  const phase = classifyMoonPhase(
    env.solarLunar.moonPhase,
    env.solarLunar.moonIlluminationPct
  );
  const solunarSupport = getSolunarSupport(env, tzOffset);

  const { score, stateLabel, tags, direction } = moonSolunarToScore(phase, solunarSupport, ctx);

  // During strong suppression (baseline very low), solunar contribution is less meaningful
  // Signal this via low confidence dependency
  const suppressedBaseline = baselineScore < 35;
  const confidenceDep = suppressedBaseline ? 'very_low'
    : solunarSupport === 'unknown' ? 'low'
    : 'moderate';

  return {
    componentScore: score,
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: confidenceDep,
    applicable: true,
  };
}
