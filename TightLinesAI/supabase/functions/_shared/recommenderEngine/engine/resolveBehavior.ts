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
import { pickDeterministic } from "../../howFishingEngine/copy/deterministicPick.ts";
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
import type { SpeciesGroup } from "../contracts/species.ts";
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

function shiftDepth(depth: DepthLane, delta: number): DepthLane {
  const ordered: DepthLane[] = ["surface", "upper", "mid", "near_bottom", "bottom"];
  const next = ordered.indexOf(depth) + delta;
  return ordered[Math.max(0, Math.min(ordered.length - 1, next))]!;
}

function shiftSpeed(speed: SpeedPreference, delta: number): SpeedPreference {
  const ordered: SpeedPreference[] = ["dead_slow", "slow", "moderate", "fast", "vary"];
  if (speed === "vary") return "vary";
  const next = ordered.indexOf(speed) + delta;
  return ordered[Math.max(0, Math.min(3, next))]!;
}

// ─── Topwater threshold ───────────────────────────────────────────────────────

const TOPWATER_TEMP_FLOOR_F = 58; // Below this, topwater is suppressed for all species

// ─── Summary line builders ────────────────────────────────────────────────────

function activityLine(
  activity: ActivityLevel,
  depth: DepthLane,
  seasonal_flag: string | undefined,
  seed: string,
  species?: SpeciesGroup,
): string {
  const depthLabel: Record<DepthLane, string> = {
    surface: "near the surface",
    upper: "in the upper water column",
    mid: "mid-water",
    near_bottom: "near the bottom",
    bottom: "tight to the bottom",
  };

  // Cold-stressed tropical species are still catchable — just very slow.
  // Avoid language that implies they won't eat.
  const isColdStressTropical = activity === "inactive" &&
    (species === "snook" || species === "tarpon");

  const actLabel: Record<ActivityLevel, string> = {
    inactive: isColdStressTropical
      ? "Very slow and cold-stressed but still catchable"
      : "Largely inactive",
    low: "Sluggish and tight to cover",
    neutral: "Moderately active",
    active: "Feeding actively",
    aggressive: "Aggressively feeding",
  };
  const base = `${actLabel[activity]} ${depthLabel[depth]}.`;
  const seasonalTail =
    seasonal_flag === "spawning"
      ? "In or near spawning areas."
      : seasonal_flag === "pre_spawn"
      ? "Staging pre-spawn."
      : seasonal_flag === "post_spawn"
      ? "Recovering post-spawn."
      : seasonal_flag === "peak_season"
      ? "Holding in a prime seasonal feeding window."
      : seasonal_flag === "off_season"
      ? "Operating in a tougher seasonal window."
      : null;

  const depthCap = `${depthLabel[depth][0]!.toUpperCase()}${depthLabel[depth].slice(1)}`;
  const st = seasonalTail;
  const variants = [
    st ? `${base} ${st}` : base,
    st ? `${actLabel[activity]} and set up ${depthLabel[depth]}. ${st}` : `${actLabel[activity]} and set up ${depthLabel[depth]}.`,
    st ? `${depthCap} is the key zone right now. ${st}` : `${depthCap} is the key zone right now.`,
    st ? `Fish are positioned ${depthLabel[depth]} and ${actLabel[activity].toLowerCase()}. ${st}` : `Fish are positioned ${depthLabel[depth]} and ${actLabel[activity].toLowerCase()}.`,
    st ? `Expect fish holding ${depthLabel[depth]}. ${st}` : `Expect fish holding ${depthLabel[depth]}.`,
    st ? `${actLabel[activity]} fish sitting ${depthLabel[depth]}. ${st}` : `${actLabel[activity]} fish sitting ${depthLabel[depth]}.`,
    st ? `${depthCap} is where the bite should be. ${st}` : `${depthCap} is where the bite should be.`,
    st ? `Fish are set up ${depthLabel[depth]} right now. ${st}` : `Fish are set up ${depthLabel[depth]} right now.`,
    st ? `${actLabel[activity]} and holding ${depthLabel[depth]}. ${st}` : `${actLabel[activity]} and holding ${depthLabel[depth]}.`,
    st ? `Target fish ${depthLabel[depth]} — they are ${actLabel[activity].toLowerCase()}. ${st}` : `Target fish ${depthLabel[depth]} — they are ${actLabel[activity].toLowerCase()}.`,
    st ? `The bite is ${depthLabel[depth]}. ${st}` : `The bite is ${depthLabel[depth]}. ${actLabel[activity]}.`,
    st ? `Focus ${depthLabel[depth]} where fish are ${actLabel[activity].toLowerCase()}. ${st}` : `Focus ${depthLabel[depth]} where fish are ${actLabel[activity].toLowerCase()}.`,
    st ? `${actLabel[activity]} with most fish sitting ${depthLabel[depth]}. ${st}` : `${actLabel[activity]} with most fish sitting ${depthLabel[depth]}.`,
    st ? `Fish are relating to ${depthLabel[depth]} structure. ${st}` : `Fish are relating to ${depthLabel[depth]} structure. ${actLabel[activity]}.`,
  ];

  return pickDeterministic(variants, seed, `activity:${activity}:${depth}:${seasonal_flag ?? "none"}`);
}

function forageLine(primary: ForageMode, secondary: ForageMode | undefined, seed: string): string {
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
    const sec = forageLabel[secondary];
    return pickDeterministic(
      [
        `Keying on ${primary_text} with some interest in ${sec}.`,
        `Primary forage looks like ${primary_text}, with a secondary look at ${sec}.`,
        `Most fish should be tuned to ${primary_text}, but ${sec} is still in play.`,
        `Fish are focused on ${primary_text}, though ${sec} could draw attention too.`,
        `The main food source is ${primary_text}. ${sec[0]!.toUpperCase()}${sec.slice(1)} is a secondary option.`,
        `Expect fish keying on ${primary_text} first, with ${sec} as a backup forage.`,
        `${primary_text[0]!.toUpperCase()}${primary_text.slice(1)} is the primary forage right now, with ${sec} in the mix.`,
        `Fish are eating ${primary_text} primarily, but will take ${sec} when available.`,
        `The dominant forage is ${primary_text}. ${sec[0]!.toUpperCase()}${sec.slice(1)} is worth trying as an alternate.`,
        `${primary_text[0]!.toUpperCase()}${primary_text.slice(1)} is the lead forage, with a secondary window on ${sec}.`,
        `Fish should be locked on ${primary_text}, though ${sec} presentations can produce.`,
        `Matching ${primary_text} is the priority. ${sec[0]!.toUpperCase()}${sec.slice(1)} is a viable second choice.`,
        `Target ${primary_text} first. If the bite slows, try switching to a ${sec} imitation.`,
        `Forage cues point to ${primary_text} as the primary, with ${sec} as a close second.`,
      ],
      seed,
      `forage:${primary}:${secondary}`,
    );
  }
  return pickDeterministic(
    [
      `Keying primarily on ${primary_text}.`,
      `Forage focus is mostly ${primary_text}.`,
      `The cleanest food cue right now is ${primary_text}.`,
      `Fish are locked on ${primary_text} right now.`,
      `The primary food source is ${primary_text}.`,
      `Match ${primary_text} for the best results today.`,
      `Fish are eating ${primary_text} — match it closely.`,
      `${primary_text[0]!.toUpperCase()}${primary_text.slice(1)} is the dominant forage in this system right now.`,
      `Everything points to ${primary_text} as the main food source.`,
      `Focus on ${primary_text} presentations — that is what fish are eating.`,
      `The forage base is ${primary_text}. Match it as closely as possible.`,
      `Fish are targeting ${primary_text}. Keep your presentation in that family.`,
      `${primary_text[0]!.toUpperCase()}${primary_text.slice(1)} is the clear forage leader for this scenario.`,
      `The strongest forage cue is ${primary_text}. Stay in that lane.`,
    ],
    seed,
    `forage:${primary}:none`,
  );
}

function triggerLine(
  activity: ActivityLevel,
  strike_zone: StrikeZone,
  chase: ChaseRadius,
  speed: SpeedPreference,
  topwater: boolean,
  forage: ForageMode,
  depth: DepthLane,
  seed: string,
): string {
  if (activity === "inactive" || activity === "low") {
    const bottomForage = forage === "crab" || forage === "shrimp" || forage === "crawfish";
    return pickDeterministic(
      bottomForage
        ? [
          "Keep it slow and close to bottom-oriented cover to draw the bite.",
          "A low, patient presentation around bottom cover is the best trigger here.",
          "Drag or crawl it through the feeding lane instead of forcing a chase.",
          "Slow bottom presentation is the play. Keep it in their face and be patient.",
          "Fish it on the bottom with long pauses. Don't force them to move.",
          "Stay tight to the substrate and move the bait as slowly as possible.",
          "Bottom-first approach — drag it through the zone and let fish come to it.",
          "Slow and low is the only way to trigger bites when activity is this limited.",
          "Keep the presentation on the bottom, close to cover, with minimal movement.",
          "Patient bottom fishing wins here. Drag it slowly and pause often.",
          "Put it right on the bottom and barely move it. These fish will not chase.",
          "Dead-slow bottom contact is the trigger. Keep it in the feeding zone as long as possible.",
          "Fish are not willing to move far. Keep the bait on the bottom and in their path.",
          "Ultra-slow presentation near bottom cover. Patience is more important than technique today.",
        ]
        : [
          "Slow finesse presentation tight to cover most likely to draw a strike.",
          "Keep it slow, controlled, and close to the fish rather than making them chase.",
          "Short moves and long pauses should outproduce a fast retrieve here.",
          "Downsize and slow down — finesse presentations win when fish are this sluggish.",
          "Keep it close and slow. Fish are not going to chase anything today.",
          "Tight to cover with a slow presentation. Make it easy for them to eat.",
          "Slow and subtle is the key. Don't give them a reason to refuse the bait.",
          "Finesse approach — small movements, long pauses, and lots of patience.",
          "The slower you go, the more bites you will get. Keep it in the strike zone.",
          "Short hops and long pauses near cover. The fish need it right in their face.",
          "Slow down more than you think is necessary. Then slow down again.",
          "Keep the presentation tight to structure with minimal movement between pauses.",
          "Fish will eat, but you need to put it right on them. Slow and precise wins.",
          "Patient, slow presentation near cover. Don't try to force the bite — let it happen.",
        ],
      seed,
      `trigger:slow:${activity}:${forage}:${depth}`,
    );
  }
  if (
    topwater &&
    (activity === "aggressive" || activity === "active") &&
    (depth === "surface" || depth === "upper") &&
    forage !== "crab" &&
    forage !== "shrimp" &&
    forage !== "crawfish"
  ) {
    return pickDeterministic(
      [
        "Surface presentations are in play — target transitions and edges.",
        "A topwater window is open if fish keep tracking high in the column.",
        "Look for fish willing to rise on a surface-style presentation around edges and lanes.",
        "Topwater is a strong option right now. Target shade lines and current edges.",
        "Fish are tracking high enough for surface presentations. Work the edges and transitions.",
        "Surface action is likely. Cover water with topwater near structure and baitfish activity.",
        "Conditions favor topwater. Focus on low-light edges and any visible surface activity.",
        "Fish should be willing to come up. Target transition zones with surface presentations.",
        "The topwater bite should be on. Work points, edges, and any areas with surface bait.",
        "Conditions are set up for surface strikes. Cast to any visible activity or shaded structure.",
        "Fish are positioned high enough for topwater. Hit the edges and cover transitions first.",
        "A surface bite is in play — target bait schools, shade lines, and current seams.",
        "Topwater presentations are a strong play. Cover edges and structure transitions at first light.",
        "Fish are high in the column and active enough for surface strikes. Target transition areas.",
      ],
      seed,
      `trigger:topwater:${activity}:${forage}:${depth}`,
    );
  }

  if ((forage === "crab" || forage === "shrimp" || forage === "crawfish") && (depth === "near_bottom" || depth === "bottom")) {
    return pickDeterministic(
      [
        "Stay low in the water column and fish it with a bottom-first cadence.",
        "Bottom-oriented forage means keeping the presentation down and in their path.",
        "Work the lure or fly through the lower feeding lane instead of pulling fish high.",
        "Keep it on or near the bottom. The forage lives there and so should your bait.",
        "Fish it low — bottom-dwelling forage means a bottom-first presentation.",
        "Target the lower water column. The forage is on the bottom and fish are following it.",
        "Stay deep and fish slowly along the bottom. Match the forage's natural position.",
        "Bottom contact is key. Keep the presentation where the forage actually lives.",
        "Don't pull them up — the food is on the bottom, so your presentation should be too.",
        "Fish are feeding low. Keep everything tight to the bottom for the best results.",
        "Focus on bottom presentations. The forage is there and fish are set up to eat it.",
        "Stay in the lower feeding lane and match the natural position of the forage.",
        "Bottom-oriented approach is best. Keep the bait low and in the fish's feeding path.",
        "The forage is bottom-dwelling, so your presentation needs to be there too. Stay low.",
      ],
      seed,
      `trigger:bottom-forage:${activity}:${forage}:${depth}`,
    );
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
  const spdCap = `${speedLabel[speed][0]!.toUpperCase()}${speedLabel[speed].slice(1)}`;
  return pickDeterministic(
    [
      `${chaseLabel[chase]} — ${speedLabel[speed]} in the ${strike_zone} strike zone.`,
      `${spdCap} should fit fish willing to move a ${chase} distance.`,
      `Fish should respond best to ${speedLabel[speed]} worked through a ${strike_zone} strike window.`,
      `${spdCap} through the ${strike_zone} strike zone should produce.`,
      `Fish are willing to move a ${chase} distance. ${spdCap} are a good match.`,
      `Target the ${strike_zone} strike zone with ${speedLabel[speed]} for the best results.`,
      `${chaseLabel[chase]} today. Keep ${speedLabel[speed]} in the ${strike_zone} window.`,
      `Match ${speedLabel[speed]} to the ${strike_zone} bite window for the most consistent action.`,
      `The ${strike_zone} strike zone favors ${speedLabel[speed]} at this activity level.`,
      `${spdCap} should connect. Fish are moving a ${chase} distance to eat.`,
      `Work ${speedLabel[speed]} through the zone. Fish are covering a ${chase} distance to strike.`,
      `${chaseLabel[chase]}, so ${speedLabel[speed]} in the ${strike_zone} zone are the play.`,
      `${spdCap} through the ${strike_zone} window should match fish activity well.`,
      `The bite window is ${strike_zone}. ${spdCap} at a ${chase} range should produce.`,
    ],
    seed,
    `trigger:general:${activity}:${strike_zone}:${chase}:${speed}`,
  );
}

// ─── Main resolver ────────────────────────────────────────────────────────────

export function resolveBehavior(
  req: RecommenderRequest,
  analysis: SharedConditionAnalysis,
): BehaviorOutput {
  const summary_seed = `${req.location.local_date}|${req.species}|${req.context}|${req.water_clarity}`;
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
  const temperature_band = analysis.condition_context.temperature_band;
  const temperature_trend = analysis.condition_context.temperature_trend;
  const temperature_shock = analysis.condition_context.temperature_shock;
  const temperature_score = temp_norm?.final_score ?? null;
  const water_temp_f = temp_norm?.measurement_value_f ?? null;
  const pressure_label = analysis.norm.normalized.pressure_regime?.label ?? null;

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

  // Daily thermal changes matter even inside the same seasonal window.
  if (activity !== "inactive") {
    if (temperature_shock === "sharp_cooldown") {
      activity = activityFromIndex(activityIndex(activity) - 1);
      strike_zone = "narrow";
      chase = "short";
      speed = shiftSpeed(speed, -1);
      depth = shiftDepth(depth, +1);
      topwater_viable = false;
    } else if (temperature_shock === "sharp_warmup" && temperature_band !== "very_warm") {
      activity = activityFromIndex(activityIndex(activity) + 1);
      speed = shiftSpeed(speed, +1);
      if (depth === "near_bottom" || depth === "bottom") depth = shiftDepth(depth, -1);
    } else if (temperature_trend === "warming" && (temperature_band === "cool" || temperature_band === "near_optimal" || temperature_band === "optimal")) {
      activity = activityFromIndex(activityIndex(activity) + 1);
      speed = shiftSpeed(speed, +1);
      if ((forage === "baitfish" || secondary_forage === "baitfish") && depth !== "surface") {
        depth = shiftDepth(depth, -1);
      }
    } else if (temperature_trend === "cooling" && temperature_band !== "very_warm") {
      activity = activityFromIndex(activityIndex(activity) - 1);
      speed = shiftSpeed(speed, -1);
      if (depth !== "bottom") depth = shiftDepth(depth, +1);
      topwater_viable = false;
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

  const isFreshwaterBass =
    (req.species === "largemouth_bass" || req.species === "smallmouth_bass") &&
    (req.context === "freshwater_lake_pond" || req.context === "freshwater_river");

  if (isFreshwaterBass && temperature_score !== null) {
    const lateWinterOrSpring = req.location.month <= 5 || req.location.month >= 10;

    if (
      lateWinterOrSpring &&
      (temperature_score >= -0.5 || temperature_band === "near_optimal" || temperature_band === "optimal") &&
      temperature_trend !== "cooling" &&
      temperature_shock !== "sharp_cooldown"
    ) {
      activity = activityFromIndex(activityIndex(activity) + 1);
      strike_zone = strike_zone === "narrow" ? "moderate" : strike_zone;
      chase = chase === "short" ? "moderate" : chase;
      speed = shiftSpeed(speed, +1);
      if (depth === "bottom") depth = "near_bottom";
      else if (depth === "near_bottom" && req.species === "largemouth_bass") depth = "mid";
      if (aggression === "passive") aggression = "neutral";
    }

    if (
      lateWinterOrSpring &&
      temperature_score <= -1.5 &&
      (temperature_trend === "cooling" || temperature_band === "cool" || temperature_band === "very_cold")
    ) {
      activity = activityFromIndex(activityIndex(activity) - 1);
      strike_zone = "narrow";
      chase = "short";
      speed = "dead_slow";
      if (depth !== "bottom") depth = shiftDepth(depth, +1);
      topwater_viable = false;
      aggression = "passive";
    }
  }

  const isSouthernLargemouthLake =
    req.species === "largemouth_bass" &&
    req.context === "freshwater_lake_pond" &&
    (
      region_group === "southeast_warmwater" ||
      region_group === "florida_gulf" ||
      req.location.region_key === "south_central" ||
      ["AL", "GA", "TX", "LA", "MS", "AR", "TN", "KY", "NC", "SC", "VA", "FL"].includes(req.location.state_code)
    );

  if (isSouthernLargemouthLake) {
    const lateWinterPrespawnWindow = req.location.month === 2 || req.location.month === 3;
    const stableOrFeedingPressure =
      pressure_label === "falling_slow" ||
      pressure_label === "falling_moderate" ||
      pressure_label === "rising_slow" ||
      pressure_label === "recently_stabilizing" ||
      pressure_label === "stable_neutral";

    if (
      lateWinterPrespawnWindow &&
      (temperature_band === "near_optimal" || temperature_band === "optimal" || temperature_band === "warm" || temperature_band === "very_warm") &&
      temperature_shock !== "sharp_cooldown" &&
      temperature_trend !== "cooling"
    ) {
      activity = activityFromIndex(activityIndex(activity) + 1);
      strike_zone = strike_zone === "narrow" ? "moderate" : strike_zone;
      chase = chase === "short" ? "moderate" : chase;
      speed = shiftSpeed(speed, +1);
      if (depth === "bottom") depth = "near_bottom";
      else if (depth === "near_bottom") depth = "mid";
      if (aggression === "passive") aggression = "neutral";
      else if (aggression === "neutral") aggression = "reactive";
    }

    if (
      lateWinterPrespawnWindow &&
      stableOrFeedingPressure &&
      (
        temperature_band === "optimal" ||
        temperature_band === "warm" ||
        temperature_band === "very_warm" ||
        (temperature_band === "near_optimal" && temperature_trend === "warming")
      )
    ) {
      activity = activityFromIndex(activityIndex(activity) + 1);
      chase = chase === "short" ? "moderate" : chase;
      speed = speed === "slow" ? "moderate" : speed;
      if (depth === "near_bottom" && forage === "baitfish") depth = "mid";
      if (aggression === "passive") aggression = "neutral";
    }

    if (
      lateWinterPrespawnWindow &&
      (pressure_label === "falling_slow" || pressure_label === "falling_moderate" || pressure_label === "recently_stabilizing") &&
      (temperature_band === "optimal" || temperature_band === "warm" || temperature_band === "very_warm")
    ) {
      if (activityIndex(activity) < activityIndex("neutral")) {
        activity = "neutral";
      }
      if (speed === "dead_slow" || speed === "slow") {
        speed = "moderate";
      }
      chase = chase === "short" ? "moderate" : chase;
      strike_zone = strike_zone === "narrow" ? "moderate" : strike_zone;
      if (depth === "near_bottom" && forage === "baitfish") depth = "mid";
      if (aggression === "passive") aggression = "neutral";
      else if (aggression === "neutral") aggression = "reactive";
    }

    const fallBaitfishCooldownWindow = req.location.month === 10 || req.location.month === 11;
    if (
      fallBaitfishCooldownWindow &&
      forage === "baitfish" &&
      (temperature_band === "cool" || metabolic_ctx === "cold_limited" || temperature_trend === "cooling" || temperature_shock === "sharp_cooldown") &&
      pressure_label !== "falling_slow" &&
      pressure_label !== "falling_moderate"
    ) {
      activity = activityFromIndex(activityIndex(activity) - 1);
      chase = chase === "long" ? "moderate" : chase;
      speed = shiftSpeed(speed, -1);
      if (depth === "surface") depth = "upper";
      else if (depth === "upper") depth = "mid";
      topwater_viable = false;
      if (aggression === "aggressive") aggression = "reactive";
    }
  }

  const isWinterRiverSmallmouth =
    req.species === "smallmouth_bass" &&
    req.context === "freshwater_river" &&
    (req.location.month <= 3 ||
      temperature_band === "very_cold" ||
      (temperature_band === "cool" && metabolic_ctx === "cold_limited"));

  if (isWinterRiverSmallmouth) {
    depth = depth === "mid" ? "near_bottom" : depth;
    if (depth === "surface" || depth === "upper") depth = "mid";
    speed = activity === "inactive" ? "dead_slow" : speed === "moderate" ? "slow" : speed;
    chase = "short";
    strike_zone = "narrow";
    forage = "crawfish";
    secondary_forage = "baitfish";
    topwater_viable = false;
    if (aggression !== "aggressive") {
      aggression = activity === "inactive" || activity === "low" ? "passive" : "neutral";
    }
  }

  if (
    isSouthernLargemouthLake &&
    (req.location.month === 2 || req.location.month === 3) &&
    forage === "baitfish" &&
    temperature_shock !== "sharp_cooldown" &&
    temperature_trend !== "cooling"
  ) {
    const strongLateWinterOpen =
      pressure_label === "falling_slow" ||
      pressure_label === "falling_moderate" ||
      temperature_shock === "sharp_warmup" ||
      (temperature_score !== null && temperature_score >= 1);

    const moderateLateWinterOpen =
      temperature_band === "optimal" ||
      temperature_band === "warm" ||
      temperature_band === "very_warm" ||
      temperature_band === "near_optimal";

    if (moderateLateWinterOpen) {
      if (activityIndex(activity) < activityIndex("neutral")) {
        activity = "neutral";
      }
      if (speed === "dead_slow" || speed === "slow") {
        speed = "moderate";
      }
      if (depth === "bottom") depth = "near_bottom";
      else if (depth === "near_bottom") depth = "mid";
      chase = chase === "short" ? "moderate" : chase;
      strike_zone = strike_zone === "narrow" ? "moderate" : strike_zone;
      if (aggression === "passive") aggression = "neutral";
    }

    if (strongLateWinterOpen) {
      if (activityIndex(activity) < activityIndex("active")) {
        activity = "active";
      }
      if (depth === "near_bottom") depth = "mid";
      speed = speed === "fast" ? "fast" : "moderate";
      chase = "moderate";
      strike_zone = "moderate";
      aggression = aggression === "aggressive" ? "aggressive" : "reactive";
    }
  }

  if (
    isSouthernLargemouthLake &&
    (req.location.month === 10 || req.location.month === 11) &&
    req.water_clarity === "dirty" &&
    forage === "baitfish" &&
    (temperature_band === "cool" || metabolic_ctx === "cold_limited" || (temperature_score !== null && temperature_score < 0))
  ) {
    if (activityIndex(activity) > activityIndex("active")) {
      activity = "active";
    }
    if (depth === "surface") depth = "upper";
    topwater_viable = false;
    if (speed === "fast") speed = "moderate";
    if (aggression === "aggressive") aggression = "reactive";
  }

  const bottom_oriented_forage = forage === "crab" || forage === "shrimp" || forage === "crawfish";
  if (activity === "inactive" || activity === "low") {
    topwater_viable = false;
  }
  if (bottom_oriented_forage && (depth === "near_bottom" || depth === "bottom")) {
    topwater_viable = false;
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
    activityLine(activity, depth, baseline.seasonal_flag, summary_seed, req.species),
    forageLine(forage, secondary_forage, summary_seed),
    triggerLine(activity, strike_zone, chase, speed, topwater_viable, forage, depth, summary_seed),
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
