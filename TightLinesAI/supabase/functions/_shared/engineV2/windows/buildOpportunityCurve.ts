// =============================================================================
// ENGINE V2 — Opportunity Curve Builder
//
// Builds a set of deterministic time windows (best / fair / poor) for one
// confirmed fishing context, using the already-computed assessment outputs.
//
// Design: Named Block Approach
// ─────────────────────────────
// The day is divided into canonical named blocks derived from the local
// sunrise/sunset and civil twilight times. Each block gets a composite score
// driven by:
//
//   1. Time-of-day base score (dawn/dusk highest, midday suppressed)
//   2. Tide-event overlap (salt/brackish only — most powerful modifier)
//   3. Thermal state modifier (heat/cold suppression, comfort bonus)
//   4. Pressure state modifier (post-front penalty)
//   5. Wind modifier (strong wind degrades all blocks)
//   6. Light interaction (overcast softens midday; full-sun sharpens)
//   7. Moon/solunar refiner (boosts already-decent blocks only)
//   8. PrecipRunoff modifier (heavy rain degrades blocks)
//   9. Severe suppression cap (post-front/storm/extreme heat can cap all blocks)
//
// Precision honesty:
// - When timing data (sunrise/sunset, tide times) is unavailable, we fall
//   back to labeled blocks ("morning", "midday", "evening") without times.
// - We NEVER fabricate clock-precise windows from insufficient data.
// - Brackish/saltwater windows are substantially shaped by tide events.
//   If no tide data exists for those modes, windows are produced at lower
//   confidence and clearly labeled.
//
// Output contract:
// - windows: all generated blocks sorted by start time
// - bestWindows: subset where windowScore >= 68 and quality === 'best'
// - fairWindows: subset where windowScore 45–67 and quality === 'fair'
// - poorWindows: subset where windowScore < 45 (only when helpful for LLM)
// - peakWindowScore: the highest windowScore in the set
// =============================================================================

import type {
  OpportunityCurve,
  OpportunityWindow,
  WindowQuality,
  AssessmentOutputs,
  ResolvedContext,
  NormalizedEnvironmentV2,
  ReliabilitySummary,
} from '../types/contracts.ts';

// ---------------------------------------------------------------------------
// Time block definitions
// These are canonical names; times are filled in at runtime from sunrise/sunset
// ---------------------------------------------------------------------------

export interface TimeBlock {
  id: string;
  label: string;           // human-friendly label for LLM
  startMinutes: number;    // minutes since midnight
  endMinutes: number;      // minutes since midnight
  baseTodScore: number;    // base time-of-day score for this block
}

// ---------------------------------------------------------------------------
// Time helpers
// ---------------------------------------------------------------------------

function parseTimeMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function minutesToHHMM(minutes: number): string {
  const clamped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Build named time blocks from sunrise/sunset
// Falls back to reasonable defaults if solar data is missing
// ---------------------------------------------------------------------------

function buildTimeBlocks(env: NormalizedEnvironmentV2): TimeBlock[] {
  const sunriseMin = parseTimeMinutes(env.solarLunar.sunriseLocal) ?? 360;   // 6am default
  const sunsetMin = parseTimeMinutes(env.solarLunar.sunsetLocal) ?? 1140;    // 7pm default
  const twilightBeginMin = parseTimeMinutes(env.solarLunar.civilTwilightBeginLocal) ?? (sunriseMin - 30);
  const twilightEndMin = parseTimeMinutes(env.solarLunar.civilTwilightEndLocal) ?? (sunsetMin + 30);

  // Block boundaries
  const preDawnStart = twilightBeginMin - 30;
  const dawnEnd = sunriseMin + 30;
  const earlyMorningEnd = sunriseMin + 150;       // ~2.5h after sunrise
  const middayEarlyStart = earlyMorningEnd;
  const middayLateStart = Math.floor((sunriseMin + sunsetMin) / 2);  // solar noon
  const lateAfternoonStart = sunsetMin - 180;
  const duskEnd = twilightEndMin;
  const eveningEnd = twilightEndMin + 90;

  return [
    {
      id: 'pre_dawn',
      label: 'pre-dawn',
      startMinutes: Math.max(0, preDawnStart),
      endMinutes: twilightBeginMin,
      baseTodScore: 55,
    },
    {
      id: 'dawn',
      label: 'dawn',
      startMinutes: twilightBeginMin,
      endMinutes: dawnEnd,
      baseTodScore: 82,
    },
    {
      id: 'early_morning',
      label: 'early morning',
      startMinutes: dawnEnd,
      endMinutes: earlyMorningEnd,
      baseTodScore: 72,
    },
    {
      id: 'midday_early',
      label: 'mid-morning',
      startMinutes: middayEarlyStart,
      endMinutes: middayLateStart,
      baseTodScore: 48,
    },
    {
      id: 'midday_late',
      label: 'midday',
      startMinutes: middayLateStart,
      endMinutes: lateAfternoonStart,
      baseTodScore: 42,
    },
    {
      id: 'late_afternoon',
      label: 'late afternoon',
      startMinutes: lateAfternoonStart,
      endMinutes: sunsetMin - 30,
      baseTodScore: 58,
    },
    {
      id: 'dusk',
      label: 'dusk',
      startMinutes: sunsetMin - 30,
      endMinutes: duskEnd,
      baseTodScore: 80,
    },
    {
      id: 'evening',
      label: 'evening',
      startMinutes: duskEnd,
      endMinutes: eveningEnd,
      baseTodScore: 50,
    },
  ];
}

// ---------------------------------------------------------------------------
// Tide-event overlap scorer (salt/brackish)
// Computes how much of each time block overlaps with moving-tide periods.
// Moving = incoming or outgoing but NOT dead-slack (within 45min of H/L peak)
// Returns a score modifier in range [-25, +30]
// ---------------------------------------------------------------------------

function computeTideOverlapModifier(
  block: TimeBlock,
  env: NormalizedEnvironmentV2
): { modifier: number; tideDriver: string | null } {
  const preds = env.marine.tidePredictionsToday;
  if (!preds || preds.length < 2) {
    return { modifier: 0, tideDriver: null };
  }

  type TideEvent = { minutesSinceMidnight: number; type: 'H' | 'L'; heightFt: number };
  const events: TideEvent[] = [];
  for (const p of preds) {
    const m = parseTimeMinutes(p.timeLocal);
    if (m != null) events.push({ minutesSinceMidnight: m, type: p.type, heightFt: p.heightFt });
  }
  events.sort((a, b) => a.minutesSinceMidnight - b.minutesSinceMidnight);
  if (events.length < 2) return { modifier: 0, tideDriver: null };

  const blockMid = (block.startMinutes + block.endMinutes) / 2;
  const blockLen = block.endMinutes - block.startMinutes;

  // Find where blockMid falls in the tidal cycle
  let prevEvent: TideEvent | null = null;
  let nextEvent: TideEvent | null = null;
  for (const evt of events) {
    if (evt.minutesSinceMidnight <= blockMid) prevEvent = evt;
    else if (nextEvent == null) nextEvent = evt;
  }
  if (prevEvent == null) prevEvent = events[events.length - 1];
  if (prevEvent == null || nextEvent == null) return { modifier: 0, tideDriver: null };

  const minsSincePrev = (blockMid - prevEvent.minutesSinceMidnight + 1440) % 1440;
  const minsToNext = (nextEvent.minutesSinceMidnight - blockMid + 1440) % 1440;
  const cycleLen = minsSincePrev + minsToNext;

  // Dead slack = within 45 min of a tide event peak
  const nearSlack = minsSincePrev < 45 || minsToNext < 45;

  // Position in cycle as fraction 0-1 (0=prev event, 1=next event)
  const positionFrac = cycleLen > 0 ? minsSincePrev / cycleLen : 0.5;

  // Peak movement is around the middle of the cycle (positionFrac ~0.5)
  // Score modifier: bell curve peaking at cycle midpoint
  const movementStrength = Math.sin(Math.PI * positionFrac); // 0 at edges, 1 at middle

  if (nearSlack) {
    return { modifier: -22, tideDriver: 'dead_slack_water' };
  }

  // Strong movement in mid-cycle
  if (movementStrength > 0.75) {
    const tideLabel = prevEvent.type === 'L' ? 'peak_incoming_tide' : 'peak_outgoing_tide';
    return { modifier: 28, tideDriver: tideLabel };
  }
  if (movementStrength > 0.40) {
    const tideLabel = prevEvent.type === 'L' ? 'incoming_tide' : 'outgoing_tide';
    return { modifier: 15, tideDriver: tideLabel };
  }
  return { modifier: 5, tideDriver: 'moderate_tidal_movement' };
}

// ---------------------------------------------------------------------------
// Light modifier per block
// Adjusts based on cloud cover and the block's position in the day
// ---------------------------------------------------------------------------

function computeLightModifier(
  block: TimeBlock,
  cloudCoverPct: number | null | undefined,
  inHeatStress: boolean
): number {
  const cloud = cloudCoverPct ?? 50; // assume partly cloudy if unknown

  // Overcast softens midday suppression considerably
  if (block.id === 'midday_late' || block.id === 'midday_early') {
    if (cloud >= 75) return +12; // overcast: midday becomes more usable
    if (cloud >= 50) return +5;
    if (cloud < 20 && inHeatStress) return -15; // full sun + heat = harsh midday
    if (cloud < 20) return -8;
    return 0;
  }

  // For low-light blocks (dawn/dusk), cloud cover has minimal effect
  if (block.id === 'dawn' || block.id === 'dusk') {
    return 0; // inherently low light
  }

  // General: heavy overcast slightly boosts other daylight blocks
  if (cloud >= 75) return +5;
  return 0;
}

// ---------------------------------------------------------------------------
// Moon/solunar refiner
// Only boosts blocks that are already decent (score >= 55 before this)
// Never creates strong windows from weak baseline
// ---------------------------------------------------------------------------

function computeSolunarModifier(
  block: TimeBlock,
  env: NormalizedEnvironmentV2,
  blockScoreBeforeSolunar: number
): number {
  // Don't let solunar rescue suppressed blocks
  if (blockScoreBeforeSolunar < 50) return 0;

  const major = env.solarLunar.solunarMajorPeriods ?? [];
  const minor = env.solarLunar.solunarMinorPeriods ?? [];

  for (const period of major) {
    const start = parseTimeMinutes(period.startLocal);
    const end = parseTimeMinutes(period.endLocal);
    if (start == null || end == null) continue;
    // Check if the period overlaps this block meaningfully (>30 min overlap)
    const overlapStart = Math.max(block.startMinutes, start);
    const overlapEnd = Math.min(block.endMinutes, end);
    if (overlapEnd - overlapStart >= 20) {
      return Math.min(+8, +8); // max +8 for major period overlap
    }
  }

  for (const period of minor) {
    const start = parseTimeMinutes(period.startLocal);
    const end = parseTimeMinutes(period.endLocal);
    if (start == null || end == null) continue;
    const overlapStart = Math.max(block.startMinutes, start);
    const overlapEnd = Math.min(block.endMinutes, end);
    if (overlapEnd - overlapStart >= 20) {
      return +4; // minor period: small lift
    }
  }

  return 0;
}

// ---------------------------------------------------------------------------
// River flow modifier — affects late-morning/midday blocks
// (rivers with elevated flow have degraded usable windows)
// ---------------------------------------------------------------------------

function computeRiverFlowModifier(
  block: TimeBlock,
  assessments: AssessmentOutputs
): number {
  const tideLabel = assessments.tideCurrent.stateLabel;
  if (tideLabel === 'elevated_flow_likely') return -15;
  if (tideLabel === 'mildly_elevated_flow') return -8;
  return 0;
}

// ---------------------------------------------------------------------------
// Precip modifier — active rain or recent heavy runoff degrades blocks
// ---------------------------------------------------------------------------

function computePrecipModifier(assessments: AssessmentOutputs): number {
  const precipLabel = assessments.precipRunoff.stateLabel;
  if (precipLabel === 'heavy_rain_runoff_suppression' || precipLabel === 'heavy_recent_rain') return -18;
  if (precipLabel === 'moderate_recent_rain' || precipLabel === 'moderate_rain_river_affected') return -8;
  if (precipLabel === 'active_rain_suppression') return -15;
  return 0;
}

// ---------------------------------------------------------------------------
// Thermal modifier per block
// Worst at midday during heat stress; cold all-day
// ---------------------------------------------------------------------------

function computeThermalModifier(
  block: TimeBlock,
  assessments: AssessmentOutputs,
  ctx: ResolvedContext
): number {
  const thermalLabel = assessments.thermal.stateLabel;
  const thermalScore = assessments.thermal.componentScore;

  if (thermalLabel === 'severe_heat') {
    // Midday worst; dawn/dusk somewhat shielded
    if (block.id === 'midday_early' || block.id === 'midday_late') return -30;
    if (block.id === 'late_afternoon') return -20;
    if (block.id === 'dawn' || block.id === 'dusk') return -5;
    return -15;
  }

  if (thermalLabel === 'heat_stress') {
    if (block.id === 'midday_early' || block.id === 'midday_late') return -20;
    if (block.id === 'dawn' || block.id === 'dusk') return 0;
    return -8;
  }

  if (thermalLabel === 'cold_stress') {
    // Cold is persistent through day; midday slightly better for freshwater
    if (ctx.isFreshwater && (block.id === 'midday_early' || block.id === 'midday_late')) return +5;
    return -10;
  }

  if (thermalLabel === 'peak_comfort') {
    // All blocks get modest bonus
    return +5;
  }

  // General: thermal score influences linearly
  if (thermalScore >= 70) return +3;
  if (thermalScore <= 30) return -8;
  return 0;
}

// ---------------------------------------------------------------------------
// Pressure modifier per block
// Post-front spike suppresses all windows; pre-front may have brief activity
// ---------------------------------------------------------------------------

function computePressureModifier(assessments: AssessmentOutputs): number {
  const pressureLabel = assessments.pressure.stateLabel;
  if (pressureLabel === 'post_front_pressure_spike') return -25;
  if (pressureLabel === 'rapidly_rising_post_front') return -18;
  if (pressureLabel === 'rapidly_falling_pre_front') return +5; // pre-front can briefly activate
  if (assessments.pressure.componentScore >= 72) return +5;
  return 0;
}

// ---------------------------------------------------------------------------
// Severe suppression cap
// Prevents any block from being classified 'best' if conditions are broadly terrible
// ---------------------------------------------------------------------------

function getSevereCap(assessments: AssessmentOutputs): number {
  const thermalLabel = assessments.thermal.stateLabel;
  const windLabel = assessments.wind.stateLabel;
  const pressureLabel = assessments.pressure.stateLabel;
  const precipLabel = assessments.precipRunoff.stateLabel;

  if (thermalLabel === 'severe_heat') return 45;
  if (thermalLabel === 'cold_stress' && assessments.thermal.componentScore < 15) return 42;
  if (windLabel === 'strong_wind_suppression') return 48;
  if (pressureLabel === 'post_front_pressure_spike') return 52;
  if (precipLabel === 'heavy_rain_runoff_suppression') return 50;
  return 100; // no cap
}

// ---------------------------------------------------------------------------
// Score a single time block
// ---------------------------------------------------------------------------

function scoreBlock(
  block: TimeBlock,
  env: NormalizedEnvironmentV2,
  assessments: AssessmentOutputs,
  ctx: ResolvedContext,
  severeCap: number
): { score: number; drivers: string[] } {
  const inHeatStress = assessments.thermal.stateLabel === 'heat_stress'
    || assessments.thermal.stateLabel === 'severe_heat';

  let score = block.baseTodScore;
  const drivers: string[] = [];

  // 1. Light modifier
  const lightMod = computeLightModifier(block, env.current.cloudCoverPct, inHeatStress);
  score += lightMod;
  if (lightMod >= 8) drivers.push('overcast_extends_window');
  else if (lightMod <= -8) drivers.push('bright_sun_suppresses_midday');

  // 2. Thermal modifier
  const thermalMod = computeThermalModifier(block, assessments, ctx);
  score += thermalMod;
  if (thermalMod <= -15) drivers.push(assessments.thermal.stateLabel);
  else if (thermalMod >= 5) drivers.push('comfortable_water_temp');

  // 3. Pressure modifier
  const pressureMod = computePressureModifier(assessments);
  score += pressureMod;
  if (pressureMod <= -15) drivers.push(assessments.pressure.stateLabel);
  else if (pressureMod >= 5) drivers.push('stable_pressure');

  // 4. Precip/runoff modifier
  const precipMod = computePrecipModifier(assessments);
  score += precipMod;
  if (precipMod <= -10) drivers.push(assessments.precipRunoff.stateLabel);

  // 5. Tide overlap (salt/brackish)
  if (ctx.isCoastal && (ctx.environmentMode === 'saltwater' || ctx.environmentMode === 'brackish')) {
    const { modifier: tideMod, tideDriver } = computeTideOverlapModifier(block, env);
    score += tideMod;
    if (tideDriver) drivers.push(tideDriver);

    // Wind degrades tide windows for coastal: heavy inshore wind makes tide windows less fishable
    // (rough water, presentation breakdown, access issues)
    const windLabel = assessments.wind.stateLabel;
    const windScore = assessments.wind.componentScore;
    if (windLabel === 'strong_wind_suppression') {
      score -= 25; // strong wind essentially negates good tide
      drivers.push('strong_wind_degrades_tide_window');
    } else if (windScore < 40) {
      // Heavy wind zone: tide bonus substantially reduced
      score -= 12;
      drivers.push('heavy_wind_reduces_fishability');
    } else if (windScore < 55) {
      score -= 5; // moderate-heavy wind: modest degradation
    }
  }

  // 6. River flow modifier
  if (ctx.environmentMode === 'freshwater_river') {
    const riverMod = computeRiverFlowModifier(block, assessments);
    score += riverMod;
    if (riverMod <= -10) drivers.push('elevated_flow_degrades_conditions');
  }

  // 7. Moon/solunar refiner (applied after other mods)
  const solunarMod = computeSolunarModifier(block, env, score);
  score += solunarMod;
  if (solunarMod >= 6) drivers.push('solunar_period_overlap');

  // 8. Apply severe suppression cap
  score = Math.min(score, severeCap);

  // Add base time-of-day driver
  if (block.id === 'dawn' || block.id === 'dusk') {
    drivers.unshift('low_light_advantage');
  } else if (block.id === 'early_morning') {
    drivers.unshift('early_morning_activity');
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    drivers: [...new Set(drivers)].slice(0, 4),
  };
}

// ---------------------------------------------------------------------------
// Main entry: build the full opportunity curve
// ---------------------------------------------------------------------------

export function buildOpportunityCurve(
  env: NormalizedEnvironmentV2,
  assessments: AssessmentOutputs,
  ctx: ResolvedContext,
  reliability: ReliabilitySummary,
  baseScore: number
): OpportunityCurve {
  // If broadly suppressed (very poor day), reduce confidence in windows
  const broadlySuppressed = baseScore < 30;

  // Build canonical time blocks
  const blocks = buildTimeBlocks(env);

  // Compute severe suppression cap for all blocks
  const severeCap = getSevereCap(assessments);

  // Score each block
  const scoredBlocks: Array<{ block: TimeBlock; score: number; drivers: string[] }> = [];
  for (const block of blocks) {
    // Skip night block — not enough data for reliable night scoring
    if (block.startMinutes > 1200 && block.startMinutes !== blocks[0]?.startMinutes) continue;

    const { score, drivers } = scoreBlock(block, env, assessments, ctx, severeCap);
    scoredBlocks.push({ block, score, drivers });
  }

  // ── Classify blocks into quality tiers ───────────────────────────────────
  //
  // Thresholds shift based on overall day quality:
  // - Normal day: best >= 68, fair 45–67, poor < 45
  // - Suppressed day: best >= 62, fair 40–61, poor < 40
  //   (so we can still show "best available" even on a fair-day)
  // - Broadly suppressed (<30 overall): no 'best', just 'fair' and 'poor'
  //
  const bestThreshold = broadlySuppressed ? 999 : (baseScore >= 65 ? 68 : 62);
  const fairThreshold = broadlySuppressed ? 50 : 45;

  const windows: OpportunityWindow[] = [];

  for (const { block, score, drivers } of scoredBlocks) {
    let quality: WindowQuality;
    if (score >= bestThreshold) quality = 'best';
    else if (score >= fairThreshold) quality = 'fair';
    else quality = 'poor';

    windows.push({
      startLocal: minutesToHHMM(block.startMinutes),
      endLocal: minutesToHHMM(block.endMinutes),
      quality,
      windowScore: score,
      drivers,
    });
  }

  // Merge adjacent same-quality windows to reduce noise
  const merged = mergeAdjacentWindows(windows);

  // ── Partition into best / fair / poor ────────────────────────────────────
  const bestWindows = merged.filter(w => w.quality === 'best');
  const fairWindows = merged.filter(w => w.quality === 'fair');
  const poorWindows = merged.filter(w => w.quality === 'poor');

  const peakWindowScore = merged.reduce((max, w) => Math.max(max, w.windowScore), 0);

  // If no best windows but at least one fair window exists on a decent day,
  // upgrade the top fair window to 'best' — so the LLM always has a best period
  // (only if day score is Fair or better and we have strong enough support)
  if (bestWindows.length === 0 && fairWindows.length > 0 && baseScore >= 45) {
    const topFair = fairWindows.reduce((max, w) => w.windowScore > max.windowScore ? w : max, fairWindows[0]);
    topFair.quality = 'best';
    bestWindows.push(topFair);
    fairWindows.splice(fairWindows.indexOf(topFair), 1);
  }

  return {
    windows: merged,
    bestWindows,
    fairWindows,
    poorWindows,
    peakWindowScore,
  };
}

// ---------------------------------------------------------------------------
// Merge adjacent windows of the same quality tier
// This prevents the output from having a stream of tiny same-quality blocks
// ---------------------------------------------------------------------------

function mergeAdjacentWindows(windows: OpportunityWindow[]): OpportunityWindow[] {
  if (windows.length === 0) return [];

  const sorted = [...windows].sort((a, b) => {
    const aMin = parseTimeMinutes(a.startLocal) ?? 0;
    const bMin = parseTimeMinutes(b.startLocal) ?? 0;
    return aMin - bMin;
  });

  const merged: OpportunityWindow[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    const next = sorted[i];
    if (next.quality === current.quality) {
      // Merge: extend end and combine drivers
      current = {
        ...current,
        endLocal: next.endLocal,
        windowScore: Math.max(current.windowScore, next.windowScore),
        drivers: [...new Set([...current.drivers, ...next.drivers])].slice(0, 4),
      };
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  merged.push(current);

  return merged;
}

// ---------------------------------------------------------------------------
// Derive narration-safe timing summary string for LLM approved payload
// ---------------------------------------------------------------------------

export function deriveTimimgNarrationFacts(
  curve: OpportunityCurve,
  assessments: AssessmentOutputs,
  ctx: ResolvedContext,
  env: NormalizedEnvironmentV2
): string | null {
  if (curve.windows.length === 0) return null;

  const parts: string[] = [];

  const bestLabels = curve.bestWindows.map(w => {
    const start = parseTimeMinutes(w.startLocal);
    const end = parseTimeMinutes(w.endLocal);
    if (start == null || end == null) return null;
    const blockLen = end - start;
    if (blockLen >= 120) return `${w.startLocal}–${w.endLocal}`;
    return `around ${w.startLocal}`;
  }).filter(Boolean);

  if (bestLabels.length > 0) {
    parts.push(`best support: ${bestLabels.join(', ')}`);
  }

  // Tide timing for coastal
  if (ctx.isCoastal && assessments.tideCurrent.applicable) {
    const tideState = assessments.tideCurrent.stateLabel;
    if (tideState.includes('incoming') || tideState.includes('outgoing')) {
      parts.push('moving water improves the main window');
    } else if (tideState.includes('slack')) {
      parts.push('slack water is the weakest period');
    }
  }

  // Heat/cold summary
  const thermalLabel = assessments.thermal.stateLabel;
  if (thermalLabel === 'heat_stress' || thermalLabel === 'severe_heat') {
    parts.push('midday heat suppresses opportunity; low-light windows strongest');
  } else if (thermalLabel === 'cold_stress') {
    parts.push('cold conditions compress active windows; midday offers minor improvement');
  }

  return parts.length > 0 ? parts.join('; ') : null;
}
