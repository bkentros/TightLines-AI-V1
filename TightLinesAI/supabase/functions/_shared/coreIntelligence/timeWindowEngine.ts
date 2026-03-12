// =============================================================================
// CORE INTELLIGENCE ENGINE — TIME WINDOW ENGINE
// Implements Section 7 of core_intelligence_spec.md
// 30-minute block scoring and window classification for the current day.
// Edge-case rules per ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md
// =============================================================================

import type {
  EnvironmentSnapshot,
  WaterType,
  TimeWindow,
  WorstWindow,
  WindowLabel,
  WaterTempZone,
  TempTrendState,
  PressureState,
  LightCondition,
} from "./types.ts";
import {
  hmToMinutes,
  localTimeStringToUtcMs,
  deriveWaterTempZone,
  estimateFreshwaterTemp,
  getMeteoSeason,
} from "./derivedVariables.ts";
import { clamp } from "./scoreEngine.ts";

// ---------------------------------------------------------------------------
// Section 7A — Resolution: 48 blocks of 30 minutes (00:00–23:30)
// ---------------------------------------------------------------------------

interface Block {
  startMin: number; // minutes since midnight (0, 30, 60, ...)
  points: number;
  maxPoints: number;
  drivers: string[];
}

/** Rule context passed to edge-case rule layer. Used for deterministic overrides. */
export interface TimeWindowRuleContext {
  waterType: WaterType;
  water_temp_zone: WaterTempZone | null;
  temp_trend_state: TempTrendState | null;
  pressure_state: PressureState | null;
  cloud_cover_pct: number | null;
  light_condition: LightCondition | null;
  recovery_active: boolean;
  salinity_disruption_alert: boolean;
  range_strength_pct: number | null;
}

// ---------------------------------------------------------------------------
// Helper: is a block (startMin to startMin+30) inside a time range?
// ---------------------------------------------------------------------------

function blockInRange(
  blockStartMin: number,
  rangeStartMin: number,
  rangeEndMin: number
): boolean {
  const blockEndMin = blockStartMin + 30;
  return blockStartMin < rangeEndMin && blockEndMin > rangeStartMin;
}

// ---------------------------------------------------------------------------
// Section 7B — Window Score Additions
// ---------------------------------------------------------------------------

interface DawnDusk {
  dawnStart: number | null;
  dawnEnd: number | null;
  duskStart: number | null;
  duskEnd: number | null;
}

interface FreshwaterThermalTimingProfile {
  dawnDuskBonus: number;
  middayWarmBonus: number;
  middayWarmStart: number;
  middayWarmEnd: number;
}

function computeDawnDusk(env: EnvironmentSnapshot): DawnDusk {
  const sunrise = hmToMinutes(env.sunrise_local);
  const sunset = hmToMinutes(env.sunset_local);
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);

  return {
    dawnStart: twilightBegin,
    dawnEnd: sunrise !== null ? sunrise + 90 : null,
    duskStart: sunset !== null ? sunset - 90 : null,
    duskEnd: twilightEnd,
  };
}

function getFreshwaterThermalTimingProfile(
  env: EnvironmentSnapshot,
  waterType: WaterType
): FreshwaterThermalTimingProfile | null {
  if (waterType !== "freshwater") return null;

  const estTemp = estimateFreshwaterTemp(env);
  if (estTemp === null) return null;

  const zone = deriveWaterTempZone(estTemp, "freshwater");
  const season = getMeteoSeason(new Date(env.timestamp_utc).getUTCMonth() + 1);
  const isColdSeason = season === "DJF" || season === "MAM";
  if (!isColdSeason || zone === null) return null;

  if (zone === "near_shutdown_cold" || zone === "lethargic") {
    return {
      dawnDuskBonus: 18,
      middayWarmBonus: 26,
      middayWarmStart: 11 * 60,
      middayWarmEnd: 15 * 60,
    };
  }

  if (zone === "transitional") {
    return {
      dawnDuskBonus: 28,
      middayWarmBonus: 14,
      middayWarmStart: 11 * 60,
      middayWarmEnd: 15 * 60,
    };
  }

  return null;
}

interface TideBlockInfo {
  phaseState: string | null;
  tideStrengthAboveAverage: boolean;
}

function getTidePhaseForBlock(
  blockStartMin: number,
  env: EnvironmentSnapshot
): TideBlockInfo {
  if (env.tide_predictions_today.length < 2) {
    return { phaseState: null, tideStrengthAboveAverage: false };
  }

  const blockUtcMs =
    getLocalMidnightUtcMs(env) + blockStartMin * 60 * 1000 + 15 * 60 * 1000; // midpoint

  const preds = env.tide_predictions_today
    .map((p) => ({
      utcMs: localTimeStringToUtcMs(p.time_local, env.tz_offset_hours),
      type: p.type,
    }))
    .sort((a, b) => a.utcMs - b.utcMs);

  let last: (typeof preds)[0] | null = null;
  let next: (typeof preds)[0] | null = null;

  for (const p of preds) {
    if (p.utcMs <= blockUtcMs) last = p;
    else if (!next) next = p;
  }

  if (!last || !next) return { phaseState: null, tideStrengthAboveAverage: false };

  const minSinceLast = (blockUtcMs - last.utcMs) / 60000;
  const minToNext = (next.utcMs - blockUtcMs) / 60000;

  let phaseState: string | null = null;
  if (minToNext <= 15 || minSinceLast <= 15) phaseState = "slack";
  else if (minToNext <= 60) phaseState = "final_hour";
  else if (last.type === "L" && next.type === "H") {
    phaseState = minSinceLast <= 120 ? "incoming_first_2h" : "incoming_mid";
  } else if (last.type === "H" && next.type === "L") {
    phaseState = minSinceLast <= 120 ? "outgoing_first_2h" : "outgoing_mid";
  }

  return { phaseState, tideStrengthAboveAverage: false }; // strength checked separately
}

function getLocalMidnightUtcMs(env: EnvironmentSnapshot): number {
  const nowUtcMs = new Date(env.timestamp_utc).getTime();
  const localMs = nowUtcMs + env.tz_offset_hours * 3600 * 1000;
  const localDate = new Date(localMs);
  const midnightLocalMs =
    localMs -
    (localDate.getUTCHours() * 3600000 +
      localDate.getUTCMinutes() * 60000 +
      localDate.getUTCSeconds() * 1000 +
      localDate.getUTCMilliseconds());
  return midnightLocalMs - env.tz_offset_hours * 3600 * 1000;
}

function scoreBlock(
  blockStartMin: number,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  rangeStrengthPct: number | null,
  pressureFalling: boolean,
  cloudCover: number | null
): Block {
  let points = 0;
  let maxPoints = 0;
  const drivers: string[] = [];
  const freshwaterTimingProfile = getFreshwaterThermalTimingProfile(env, waterType);
  const dawnDuskBonus = freshwaterTimingProfile?.dawnDuskBonus ?? 35;

  // Dawn window
  if (
    dawnDusk.dawnStart !== null &&
    dawnDusk.dawnEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.dawnStart, dawnDusk.dawnEnd)
  ) {
    maxPoints += dawnDuskBonus;
    points += dawnDuskBonus;
    drivers.push("dawn_window");
  }

  // Dusk window
  if (
    dawnDusk.duskStart !== null &&
    dawnDusk.duskEnd !== null &&
    blockInRange(blockStartMin, dawnDusk.duskStart, dawnDusk.duskEnd)
  ) {
    maxPoints += dawnDuskBonus;
    points += dawnDuskBonus;
    drivers.push("dusk_window");
  }

  // Cold-season freshwater often improves as shallow water warms into midday.
  if (
    freshwaterTimingProfile &&
    blockInRange(
      blockStartMin,
      freshwaterTimingProfile.middayWarmStart,
      freshwaterTimingProfile.middayWarmEnd
    )
  ) {
    maxPoints += freshwaterTimingProfile.middayWarmBonus;
    points += freshwaterTimingProfile.middayWarmBonus;
    drivers.push("midday_warming_window");
  }

  // Night block (+5) — after twilight end or before twilight begin
  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  if (twilightEnd !== null && twilightBegin !== null) {
    maxPoints += 5;
    if (blockStartMin >= twilightEnd || blockStartMin + 30 <= twilightBegin) {
      points += 5;
      drivers.push("night_block");
    }
  }

  // Solunar windows
  for (const period of env.solunar_major_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      const addPoints = waterType === "saltwater" ? 8 : 20;
      maxPoints += addPoints;
      if (blockInRange(blockStartMin, s, e)) {
        points += addPoints;
        drivers.push("major_solunar_window");
      }
      break; // score each period once
    }
  }

  for (const period of env.solunar_minor_periods) {
    const s = hmToMinutes(period.start_local);
    const e = hmToMinutes(period.end_local);
    if (s !== null && e !== null) {
      const addPoints = waterType === "saltwater" ? 4 : 12;
      maxPoints += addPoints;
      if (blockInRange(blockStartMin, s, e)) {
        points += addPoints;
        drivers.push("minor_solunar_window");
      }
      break;
    }
  }

  // Tide-based additions (saltwater + brackish only)
  if (waterType !== "freshwater" && env.tide_predictions_today.length >= 2) {
    const { phaseState } = getTidePhaseForBlock(blockStartMin, env);
    maxPoints += 25; // first 2 hours max

    if (phaseState === "incoming_first_2h" || phaseState === "outgoing_first_2h") {
      points += 25;
      drivers.push(
        phaseState === "incoming_first_2h"
          ? "incoming_first_2_hours"
          : "outgoing_first_2_hours"
      );
    } else if (phaseState === "incoming_mid" || phaseState === "outgoing_mid") {
      points += 15;
      drivers.push("mid_tide_movement");
    }

    // Tide strength bonus
    if (rangeStrengthPct !== null) {
      maxPoints += 10;
      if (rangeStrengthPct >= 65) {
        points += 10;
        drivers.push(
          rangeStrengthPct >= 85 ? "strong_tide_strength" : "above_average_tide_strength"
        );
      }
    }
  }

  // Pressure falling (+15)
  maxPoints += 15;
  if (pressureFalling) {
    points += 15;
    drivers.push("pressure_falling");
  }

  // Cloud cover > 60% (+8)
  if (cloudCover !== null) {
    maxPoints += 8;
    if (cloudCover > 60) {
      points += 8;
      drivers.push("overcast_cloud_cover");
    }
  }

  if (maxPoints === 0) {
    return { startMin: blockStartMin, points: 0, maxPoints: 1, drivers: [] };
  }

  return { startMin: blockStartMin, points, maxPoints, drivers };
}

// ---------------------------------------------------------------------------
// EDGE-CASE RULE LAYER (ENGINE_EDGECASE_RULES_IMPLEMENTATION_PLAN.md)
// Applies deterministic biological overrides after base block scoring.
// ---------------------------------------------------------------------------

function getBlockLightCategory(
  blockStartMin: number,
  dawnDusk: DawnDusk,
  cloudCover: number | null
): "dawn" | "dusk" | "midday" | "night" {
  const blockMid = blockStartMin + 15;
  const twilightEnd = dawnDusk.dawnEnd !== null ? (dawnDusk.duskEnd ?? 24 * 60) : 24 * 60;
  const twilightBegin = dawnDusk.dawnStart ?? 0;

  if (dawnDusk.dawnStart !== null && dawnDusk.dawnEnd !== null && blockInRange(blockStartMin, dawnDusk.dawnStart, dawnDusk.dawnEnd)) return "dawn";
  if (dawnDusk.duskStart !== null && dawnDusk.duskEnd !== null && blockInRange(blockStartMin, dawnDusk.duskStart, dawnDusk.duskEnd)) return "dusk";
  if (blockMid >= twilightEnd || blockMid + 30 <= twilightBegin) return "night";
  return "midday";
}

function isMiddayFullOrPartlyCloudy(blockStartMin: number, dawnDusk: DawnDusk, cloudCover: number | null): boolean {
  const cat = getBlockLightCategory(blockStartMin, dawnDusk, cloudCover);
  if (cat !== "midday") return false;
  const cc = cloudCover ?? 0;
  return cc < 70; // midday_full_sun (cc<35) or midday_partly_cloudy (35-69)
}

function isMiddayBlock(blockStartMin: number, dawnDusk: DawnDusk): boolean {
  const cat = getBlockLightCategory(blockStartMin, dawnDusk, null);
  return cat === "midday";
}

function isLateMorningToAfternoon(blockStartMin: number): boolean {
  const blockMid = blockStartMin + 15;
  return blockMid >= 9 * 60 && blockMid < 18 * 60; // 09:00–18:00
}

function isMiddayWarmingWindow(blockStartMin: number): boolean {
  const blockMid = blockStartMin + 15;
  return blockMid >= 11 * 60 && blockMid < 15 * 60;
}

function applyEdgeCaseRules(
  block: Block,
  env: EnvironmentSnapshot,
  waterType: WaterType,
  dawnDusk: DawnDusk,
  ruleCtx: TimeWindowRuleContext,
  tidePhaseForBlock: string | null
): Block {
  let points = block.points;
  let maxPoints = block.maxPoints;
  const drivers = [...block.drivers];
  let labelCeiling: WindowLabel | null = null;

  const zone = ruleCtx.water_temp_zone;
  const tempTrend = ruleCtx.temp_trend_state;
  const pressureState = ruleCtx.pressure_state;
  const cloudCover = ruleCtx.cloud_cover_pct;
  const season = getMeteoSeason(new Date(env.timestamp_utc).getUTCMonth() + 1);
  const isColdSeason = season === "DJF" || season === "MAM";

  // --- Rule 1: Freshwater Cold-Season Midday Warming (formalization) ---
  // Already in base scoring via getFreshwaterThermalTimingProfile. No change.

  // --- Rule 2: Freshwater Summer Heat Suppression ---
  if (
    waterType === "freshwater" &&
    zone !== null &&
    (zone === "thermal_stress_heat" || zone === "peak_aggression") &&
    isMiddayFullOrPartlyCloudy(block.startMin, dawnDusk, cloudCover)
  ) {
    points -= 18;
    if (!drivers.includes("heat_suppression_midday")) drivers.push("heat_suppression_midday");
  }

  // --- Rule 3: Freshwater Rapid Warming Late-Day Shift ---
  if (
    waterType === "freshwater" &&
    tempTrend !== null &&
    (tempTrend === "rapid_warming" || tempTrend === "warming") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic" || zone === "transitional") &&
    isLateMorningToAfternoon(block.startMin)
  ) {
    points += 12;
    if (!drivers.includes("rapid_warming_late_day_bonus")) drivers.push("rapid_warming_late_day_bonus");
  }

  // --- Rule 4: Freshwater Overcast Extension ---
  if (
    waterType === "freshwater" &&
    (cloudCover ?? 0) >= 70 &&
    zone !== null &&
    zone !== "near_shutdown_cold" &&
    zone !== "thermal_stress_heat" &&
    zone !== "peak_aggression" &&
    isMiddayBlock(block.startMin, dawnDusk)
  ) {
    points += 8;
    if (!drivers.includes("overcast_extension")) drivers.push("overcast_extension");
  }

  // --- Rule 5: Post-Front Bluebird Compression ---
  if (
    ruleCtx.recovery_active &&
    pressureState !== null &&
    (pressureState === "slowly_rising" || pressureState === "rapidly_rising") &&
    (cloudCover ?? 100) < 50
  ) {
    points -= 10;
    if (!drivers.includes("post_front_compression")) drivers.push("post_front_compression");
    labelCeiling = labelCeiling ?? "GOOD";
  }

  // --- Rule 6: Saltwater Slack-Tide Dominance Cap ---
  if (
    waterType === "saltwater" &&
    (tidePhaseForBlock === "slack" || tidePhaseForBlock === "final_hour")
  ) {
    const rawScore = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
    if (rawScore >= 65) {
      points = Math.floor((maxPoints * 44) / 100);
      if (!drivers.includes("slack_cap_applied")) drivers.push("slack_cap_applied");
    }
  }

  // --- Rule 7: Brackish Runoff / Freshwater Influx Proxy ---
  if (waterType === "brackish" && ruleCtx.salinity_disruption_alert) {
    if (tidePhaseForBlock === "outgoing_first_2h" || tidePhaseForBlock === "outgoing_mid") {
      points -= 15;
      if (!drivers.includes("runoff_outgoing_penalty")) drivers.push("runoff_outgoing_penalty");
    }
    if (tidePhaseForBlock === "incoming_first_2h" || tidePhaseForBlock === "incoming_mid") {
      points += 8;
      if (!drivers.includes("runoff_incoming_preference")) drivers.push("runoff_incoming_preference");
    }
  }

  // --- Rule 8: Cold Inshore / Brackish Midday Warming ---
  if (
    (waterType === "saltwater" || waterType === "brackish") &&
    zone !== null &&
    (zone === "near_shutdown_cold" || zone === "lethargic") &&
    isMiddayWarmingWindow(block.startMin)
  ) {
    const saltwaterProtectedLike =
      waterType === "brackish" ||
      (waterType === "saltwater" &&
        ruleCtx.range_strength_pct !== null &&
        ruleCtx.range_strength_pct < 65);
    const strongIncoming = tidePhaseForBlock === "incoming_first_2h";
    if (saltwaterProtectedLike && !strongIncoming) {
      points += 10;
      if (!drivers.includes("cold_inshore_midday_warming")) drivers.push("cold_inshore_midday_warming");
    }
  }

  points = Math.max(0, points);
  if (labelCeiling === "GOOD") {
    const rawScore = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
    if (rawScore >= 65) points = Math.floor((maxPoints * 64) / 100);
  }

  return { ...block, points, maxPoints, drivers };
}

// ---------------------------------------------------------------------------
// Section 7C — Window Classification
// ---------------------------------------------------------------------------

function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function classifyBlock(block: Block): WindowLabel | null {
  const score = Math.round((block.points / block.maxPoints) * 100);
  if (score >= 65) return "PRIME";
  if (score >= 45) return "GOOD";
  if (score >= 25) return "SECONDARY";
  return null;
}

function getBlockScore(block: Block): number {
  return Math.round((block.points / block.maxPoints) * 100);
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — computeTimeWindows
// ---------------------------------------------------------------------------

export function computeTimeWindows(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  rangeStrengthPct: number | null,
  pressureState: string | null,
  cloudCoverPct: number | null,
  ruleContext?: TimeWindowRuleContext | null
): { best_windows: TimeWindow[]; worst_windows: WorstWindow[] } {
  const dawnDusk = computeDawnDusk(env);
  const pressureFalling =
    pressureState === "slowly_falling" || pressureState === "rapidly_falling";

  const ruleCtx: TimeWindowRuleContext | null = ruleContext ?? null;

  // Score all 48 blocks
  let blocks: Block[] = [];
  for (let startMin = 0; startMin < 24 * 60; startMin += 30) {
    const base = scoreBlock(
      startMin,
      env,
      waterType,
      dawnDusk,
      rangeStrengthPct,
      pressureFalling,
      cloudCoverPct
    );
    const tideInfo = waterType !== "freshwater" ? getTidePhaseForBlock(startMin, env) : { phaseState: null };
    const adjusted = ruleCtx
      ? applyEdgeCaseRules(base, env, waterType, dawnDusk, ruleCtx, tideInfo.phaseState)
      : base;
    blocks.push(adjusted);
  }

  // Classify and merge contiguous blocks of same label
  const bestWindows: TimeWindow[] = [];
  const scoredBlocks = blocks.map((b) => ({
    ...b,
    label: classifyBlock(b),
    score: getBlockScore(b),
  }));

  let i = 0;
  while (i < scoredBlocks.length) {
    const b = scoredBlocks[i];
    if (b.label === null || b.label === "SECONDARY") {
      i++;
      continue;
    }

    // Merge contiguous blocks with the same label
    let j = i + 1;
    const mergedDrivers = new Set(b.drivers);
    let maxScore = b.score;

    while (
      j < scoredBlocks.length &&
      scoredBlocks[j].label === b.label
    ) {
      scoredBlocks[j].drivers.forEach((d) => mergedDrivers.add(d));
      maxScore = Math.max(maxScore, scoredBlocks[j].score);
      j++;
    }

    bestWindows.push({
      label: b.label,
      start_local: minutesToHHMM(b.startMin),
      end_local: minutesToHHMM(scoredBlocks[j - 1].startMin + 30),
      window_score: maxScore,
      drivers: Array.from(mergedDrivers),
    });

    i = j;
  }

  // Section 7D — Worst Windows: lowest-scoring contiguous blocks
  // Sort by score ascending and find the worst contiguous run
  const allScored = scoredBlocks.map((b) => ({ ...b }));
  allScored.sort((a, b) => a.score - b.score);

  // Build at least one worst window from lowest-score blocks
  const worstWindows: WorstWindow[] = [];
  const worstCandidate = allScored[0];

  // Find the worst contiguous stretch (lowest average)
  let worstSum = Infinity;
  let worstStart = 0;
  let worstEnd = 0;

  for (let start = 0; start < scoredBlocks.length; start++) {
    let runSum = 0;
    let runLen = 0;
    for (let end = start; end < Math.min(start + 4, scoredBlocks.length); end++) {
      runSum += scoredBlocks[end].score;
      runLen++;
    }
    const avg = runSum / runLen;
    if (avg < worstSum) {
      worstSum = avg;
      worstStart = start;
      worstEnd = Math.min(start + 3, scoredBlocks.length - 1);
    }
  }

  worstWindows.push({
    start_local: minutesToHHMM(scoredBlocks[worstStart].startMin),
    end_local: minutesToHHMM(scoredBlocks[worstEnd].startMin + 30),
    window_score: Math.round(worstSum),
  });

  return { best_windows: bestWindows, worst_windows: worstWindows };
}
