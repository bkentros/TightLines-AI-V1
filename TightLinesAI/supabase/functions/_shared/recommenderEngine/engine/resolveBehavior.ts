/**
 * resolveBehavior — combines species baseline + context modifier + condition signals
 * into a final BehaviorOutput.
 *
 * Layer order:
 *   1. Species baseline profile (month × region_group)
 *   2. Context modifier (lake vs river vs coastal vs flats)
 *   3. Condition modifiers (temperature metabolic context, light/cloud, temp gates)
 *   4. Behavior summary text (inline template — 3 short lines)
 */

import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type {
  ActivityLevel,
  AggressionLevel,
  BehaviorOutput,
  ChaseRadius,
  DepthLane,
  FlashLevel,
  ForageMode,
  NoiseLevel,
  SpeedPreference,
  StrikeZone,
} from "../contracts/behavior.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import { getContextModifier } from "../config/contextModifiers.ts";
import {
  getFallbackProfile,
  getSpeciesProfile,
  getSpeciesRegionGroup,
} from "../config/speciesProfiles.ts";

// ─── Activity level helpers ───────────────────────────────────────────────────

const ACTIVITY_LEVELS: ActivityLevel[] = [
  "inactive", "low", "neutral", "active", "aggressive",
];

function activityIndex(a: ActivityLevel): number {
  return ACTIVITY_LEVELS.indexOf(a);
}

function activityFromIndex(i: number): ActivityLevel {
  return ACTIVITY_LEVELS[Math.max(0, Math.min(4, i))];
}

// ─── Topwater threshold ───────────────────────────────────────────────────────

const TOPWATER_TEMP_FLOOR_F = 58; // Below this, topwater is suppressed for all species

// ─── Summary line builders ────────────────────────────────────────────────────

function activityLine(
  activity: ActivityLevel,
  depth: DepthLane,
  seasonal_flag: string | undefined,
): string {
  const depthLabel: Record<DepthLane, string> = {
    surface: "near the surface",
    upper: "in the upper water column",
    mid: "mid-water",
    near_bottom: "near the bottom",
    bottom: "tight to the bottom",
  };
  const actLabel: Record<ActivityLevel, string> = {
    inactive: "Largely inactive",
    low: "Sluggish and tight to cover",
    neutral: "Moderately active",
    active: "Feeding actively",
    aggressive: "Aggressively feeding",
  };
  const base = `${actLabel[activity]} ${depthLabel[depth]}.`;
  if (seasonal_flag === "spawning") return `${base} In or near spawning areas.`;
  if (seasonal_flag === "pre_spawn") return `${base} Staging pre-spawn.`;
  if (seasonal_flag === "post_spawn") return `${base} Recovering post-spawn.`;
  return base;
}

function forageLine(primary: ForageMode, secondary?: ForageMode): string {
  const forageLabel: Record<ForageMode, string> = {
    baitfish: "baitfish and shad",
    shrimp: "shrimp",
    crab: "crabs",
    crawfish: "crawfish",
    leech: "leeches and worms",
    surface_prey: "surface prey and baitfish",
    mixed: "a mix of available forage",
  };
  const primary_text = forageLabel[primary];
  if (secondary && secondary !== primary) {
    return `Keying on ${primary_text} with some interest in ${forageLabel[secondary]}.`;
  }
  return `Keying primarily on ${primary_text}.`;
}

function triggerLine(
  activity: ActivityLevel,
  strike_zone: StrikeZone,
  chase: ChaseRadius,
  speed: SpeedPreference,
  topwater: boolean,
): string {
  if (activity === "inactive" || activity === "low") {
    return "Slow finesse presentation tight to cover most likely to draw a strike.";
  }
  if (topwater && (activity === "aggressive" || activity === "active")) {
    return "Surface presentations viable — target transitions and edges.";
  }
  const chaseLabel: Record<ChaseRadius, string> = {
    short: "Won't chase far",
    moderate: "Will move moderate distances",
    long: "Willing to chase",
  };
  const speedLabel: Record<SpeedPreference, string> = {
    dead_slow: "ultra-slow retrieves",
    slow: "slow retrieves",
    moderate: "moderate-pace retrieves",
    fast: "faster retrieves",
    vary: "varying retrieves",
  };
  return `${chaseLabel[chase]} — ${speedLabel[speed]} in the ${strike_zone} strike zone.`;
}

// ─── Main resolver ────────────────────────────────────────────────────────────

export function resolveBehavior(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
): BehaviorOutput {
  const region_group = getSpeciesRegionGroup(req.location.region_key, req.context);
  const baseline =
    getSpeciesProfile(req.species, region_group, req.location.month) ??
    getFallbackProfile(req.species, region_group, req.location.month);
  const ctx_mod = getContextModifier(req.species, req.context);

  // ── 1. Apply baseline values ──────────────────────────────────────────────

  let activity: ActivityLevel = baseline.activity_baseline;
  let aggression: AggressionLevel = baseline.aggression_baseline;
  let depth: DepthLane = baseline.depth_tendency;
  let forage: ForageMode = baseline.primary_forage;
  let secondary_forage: ForageMode | undefined = baseline.secondary_forage;
  let speed: SpeedPreference = baseline.speed_bias;
  let chase: ChaseRadius = baseline.chase_tendency;
  let strike_zone: StrikeZone = baseline.strike_zone_baseline;
  let topwater_viable: boolean = baseline.topwater_likelihood !== "none";
  let noise: NoiseLevel = "subtle";
  let flash: FlashLevel = "subtle";
  const habitat_tags: string[] = [...baseline.habitat_tags];

  // ── 2. Apply context modifier overrides ───────────────────────────────────

  if (ctx_mod.depth_bias) depth = ctx_mod.depth_bias;
  if (ctx_mod.speed_adjustment) speed = ctx_mod.speed_adjustment;
  if (ctx_mod.forage_bias) forage = ctx_mod.forage_bias;
  if (ctx_mod.secondary_forage_bias) secondary_forage = ctx_mod.secondary_forage_bias;
  if (ctx_mod.noise_preference) noise = ctx_mod.noise_preference;
  if (ctx_mod.flash_preference) flash = ctx_mod.flash_preference;
  if (ctx_mod.topwater_suppressed) topwater_viable = false;
  if (ctx_mod.topwater_boosted) topwater_viable = true;
  if (ctx_mod.extra_habitat_tags) {
    for (const tag of ctx_mod.extra_habitat_tags) {
      if (!habitat_tags.includes(tag)) habitat_tags.push(tag);
    }
  }

  // ── 3. Condition modifier — temperature ───────────────────────────────────

  const temp_norm = analysis.norm.normalized.temperature;
  const metabolic_ctx = analysis.condition_context.temperature_metabolic_context;
  const water_temp_f = temp_norm?.measurement_value_f ?? null;

  // Hard temp gates: snook, tarpon, river_trout, striped_bass
  const temp_floor = baseline.temp_floor_f;
  const temp_ceiling = baseline.temp_ceiling_f;

  if (water_temp_f !== null) {
    if (temp_floor !== undefined && water_temp_f < temp_floor) {
      activity = "inactive";
      aggression = "passive";
      strike_zone = "narrow";
      chase = "short";
      topwater_viable = false;
    } else if (temp_ceiling !== undefined && water_temp_f > temp_ceiling) {
      activity = "inactive";
      aggression = "passive";
      strike_zone = "narrow";
      chase = "short";
      topwater_viable = false;
    }
  }

  // Metabolic context adjustments (not applied if already hard-gated to inactive)
  if (activity !== "inactive") {
    if (metabolic_ctx === "cold_limited") {
      const idx = activityIndex(activity);
      activity = activityFromIndex(idx - 1);
      if (activity === "low" || activity === "neutral") {
        strike_zone = "narrow";
        chase = "short";
        speed = speed === "fast" ? "moderate" : speed === "moderate" ? "slow" : speed;
      }
    } else if (metabolic_ctx === "heat_limited") {
      const idx = activityIndex(activity);
      activity = activityFromIndex(idx - 1);
    }
  }

  // ── 4. Condition modifier — light / cloud ─────────────────────────────────

  const light_label = (analysis.norm.normalized.light_cloud_condition?.label ?? "mixed_sky") as string;
  const is_low_light = light_label === "heavy_overcast";

  // Walleye and low-light preference species get boosted under cloud cover
  if (baseline.low_light_preference && is_low_light) {
    if (activity !== "inactive") {
      const idx = activityIndex(activity);
      activity = activityFromIndex(Math.min(4, idx + 1));
    }
  }

  // Topwater: suppress below cold water threshold
  if (water_temp_f !== null && water_temp_f < TOPWATER_TEMP_FLOOR_F) {
    topwater_viable = false;
  }

  // ── 5. Pressure modifier ──────────────────────────────────────────────────
  //
  // Pressure effects on fish activity follow a well-documented pattern:
  //   - Slow fall (pre-front approach): brief feeding surge — fish sense change
  //   - Fast / hard fall (front arriving): activity collapses, fish hunker down
  //   - Rising slowly (post-front recovery): gradual return to feeding
  //   - Rising fast: fish can be fussy until pressure plateaus
  //   - Volatile (multiple swings): inconsistent, short windows only
  //   - Stable neutral: no modification — let other variables carry weight
  //
  if (activity !== "inactive") {
    const pressure_label = analysis.norm.normalized.pressure_regime?.label ?? null;
    if (pressure_label) {
      const pidx = activityIndex(activity);
      if (pressure_label === "falling_slow") {
        // Classic pre-front feed-up — slight boost
        activity = activityFromIndex(pidx + 1);
      } else if (pressure_label === "falling_moderate") {
        // Stronger approaching front — bigger activity surge before it hits
        activity = activityFromIndex(pidx + 1);
        if (activity === "aggressive" || activity === "active") {
          // Fish are chasing — tighten strike zone less important, but depth may lift
          if (depth === "near_bottom" || depth === "bottom") depth = "mid";
        }
      } else if (pressure_label === "falling_hard") {
        // Front arriving hard — activity often crashes; fish retreat to structure
        activity = activityFromIndex(pidx - 2);
        strike_zone = "narrow";
        chase = "short";
        if (depth === "surface" || depth === "upper") depth = "mid";
      } else if (pressure_label === "rising_fast") {
        // Post-front snap — fish are fussy until new baseline settles
        activity = activityFromIndex(pidx - 1);
        strike_zone = "narrow";
      } else if (pressure_label === "rising_slow") {
        // Gradual recovery — slight uptick as fish re-engage
        activity = activityFromIndex(pidx + 1);
      } else if (pressure_label === "volatile") {
        // Back-and-forth pressure — inconsistent; pull back to baseline activity
        activity = activityFromIndex(pidx - 1);
        chase = chase === "long" ? "moderate" : chase;
      }
      // stable_neutral and recently_stabilizing: no modification
    }
  }

  // ── 6. Wind modifier ─────────────────────────────────────────────────────
  //
  // Wind affects fish positioning and presentation:
  //   - Calm (score ≥ 1.5): fish are spooky — slower presentations, deeper/shadier holds
  //   - Moderate (score near 0): workable — no change
  //   - Strong (score ≤ -1): fish push to windward banks, weed edges, and structure
  //                          to exploit baitfish pushed there; can boost activity
  //   - Very strong (score ≤ -1.5): boat control is the problem, fish pushed very tight
  //
  const wind_score = analysis.norm.normalized.wind_condition?.score ?? null;
  if (wind_score !== null && activity !== "inactive") {
    if (wind_score >= 1.5) {
      // Dead calm — fish become spooky, especially in clear water
      speed = speed === "fast" ? "moderate" : speed === "moderate" ? "slow" : speed;
      if (!ctx_mod.stealth_priority) {
        // Mark stealth conditions in habitat tags
        if (!habitat_tags.includes("calm_water_stealth")) {
          habitat_tags.push("calm_water_stealth");
        }
      }
    } else if (wind_score <= -1.5) {
      // Very strong wind — fish pushed to protected structure and windward banks
      if (depth === "surface") depth = "upper";
      if (depth === "upper") depth = "mid";
      topwater_viable = false; // Surface presentations impractical in heavy wind
      if (!habitat_tags.includes("windward_bank")) habitat_tags.push("windward_bank");
      if (!habitat_tags.includes("protected_structure")) habitat_tags.push("protected_structure");
    } else if (wind_score <= -1.0) {
      // Strong wind — fish are often more active, pushed to windward features
      const widx = activityIndex(activity);
      activity = activityFromIndex(widx + 1);
      if (!habitat_tags.includes("windward_bank")) habitat_tags.push("windward_bank");
    }
  }

  // ── 8. Build tidal note (coastal contexts) ────────────────────────────────

  let tidal_note: string | undefined;
  if (ctx_mod.tidal_dependent) {
    const tide_detail = analysis.condition_context.tide_detail;
    if (tide_detail) {
      tidal_note = `Tidal movement active. ${tide_detail}`;
    } else {
      tidal_note = "Tidal movement matters — fish incoming or peak current.";
    }
  }

  // ── 9. Build behavior summary (3 deterministic lines) ─────────────────────

  const behavior_summary: [string, string, string] = [
    activityLine(activity, depth, baseline.seasonal_flag),
    forageLine(forage, secondary_forage),
    triggerLine(activity, strike_zone, chase, speed, topwater_viable),
  ];

  return {
    activity,
    aggression,
    strike_zone,
    chase_radius: chase,
    depth_lane: depth,
    habitat_tags,
    forage_mode: forage,
    secondary_forage,
    topwater_viable,
    speed_preference: speed,
    noise_preference: noise,
    flash_preference: flash,
    behavior_summary,
    tidal_note,
    seasonal_flag: baseline.seasonal_flag,
  };
}
