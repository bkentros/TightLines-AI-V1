/**
 * resolvePresentation — maps BehaviorOutput → PresentationOutput.
 *
 * This is a pure, deterministic transformation — no side effects.
 * BehaviorOutput describes what the fish is doing.
 * PresentationOutput describes what lure/fly properties will match.
 *
 * Key mappings:
 *  - Depth lane → depth_target (direct passthrough)
 *  - Speed + activity → speed + motion type
 *  - Activity + strike_zone → trigger_type
 *  - Noise/flash from behavior
 *  - Profile: inferred from forage mode
 *  - Color: resolveColorFamily(clarity × forage × light × species)
 *  - Topwater: passthrough from behavior
 *  - Current technique: from context modifier (carried through behavior → presentation via tidal_note absence heuristic)
 */

import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type {
  ActivityLevel,
  BehaviorOutput,
  CurrentTechnique,
  DepthLane,
  FlashLevel,
  ForageMode,
  MotionType,
  NoiseLevel,
  PresentationOutput,
  ProfileSize,
  SpeedPreference,
  TriggerType,
} from "../contracts/behavior.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { LightLabel } from "../config/colorGuidance.ts";
import { resolveColorFamily } from "../config/colorGuidance.ts";
import { getContextModifier } from "../config/contextModifiers.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";

// ─── Motion type derivation ───────────────────────────────────────────────────

function deriveMotion(
  activity: ActivityLevel,
  speed: SpeedPreference,
  topwater: boolean,
  forage: ForageMode,
): MotionType {
  if (topwater) {
    // Topwater: pop for surface_prey, walk for baitfish, pop for others
    if (forage === "surface_prey") return "pop";
    return "walk";
  }

  if (activity === "inactive" || activity === "low") {
    // Inactive/slow fish need a pause trigger
    if (forage === "crawfish" || forage === "crab" || forage === "shrimp") return "drag";
    return "hop";
  }

  if (speed === "fast") return "rip";
  if (speed === "moderate") {
    if (forage === "baitfish") return "steady";
    if (forage === "crawfish") return "hop";
    return "twitch_pause";
  }
  if (speed === "slow" || speed === "dead_slow") {
    if (forage === "leech" || forage === "shrimp") return "drag";
    if (forage === "crawfish" || forage === "crab") return "hop";
    return "twitch_pause";
  }
  // vary
  return "twitch_pause";
}

// ─── Trigger type derivation ──────────────────────────────────────────────────

function deriveTrigger(
  activity: ActivityLevel,
  forage: ForageMode,
  speed: SpeedPreference,
  depth: DepthLane,
): TriggerType {
  if (activity === "inactive" || activity === "low") return "finesse";
  if (
    (forage === "crab" || forage === "shrimp" || forage === "crawfish") &&
    (depth === "near_bottom" || depth === "bottom")
  ) {
    return activity === "aggressive" && speed === "fast" ? "reaction" : "natural_match";
  }
  if (activity === "aggressive") {
    if (speed === "fast" || speed === "moderate") return "reaction";
    return "aggressive";
  }
  if (activity === "active") {
    if (forage === "baitfish" && (speed === "fast" || speed === "moderate")) return "reaction";
    return "natural_match";
  }
  // neutral
  return "natural_match";
}

// ─── Profile size derivation ──────────────────────────────────────────────────

function deriveProfile(forage: ForageMode, activity: ActivityLevel): ProfileSize {
  if (forage === "crab") return "medium";
  if (forage === "crawfish") return "medium";
  if (forage === "shrimp" || forage === "leech") return "slim";
  if (forage === "surface_prey") return "medium";
  if (forage === "baitfish") {
    if (activity === "aggressive") return "bulky";  // big profile triggers big bites
    return "slim";
  }
  // mixed
  return "medium";
}

// ─── Noise/flash from activity ────────────────────────────────────────────────

function deriveNoise(
  base_noise: NoiseLevel,
  activity: ActivityLevel,
  topwater: boolean,
): NoiseLevel {
  if (topwater && (activity === "active" || activity === "aggressive")) return "loud";
  if (activity === "inactive" || activity === "low") return "silent";
  return base_noise;
}

function deriveFlash(
  base_flash: FlashLevel,
  activity: ActivityLevel,
  forage: ForageMode,
  water_clarity: WaterClarity,
): FlashLevel {
  if (water_clarity === "dirty") {
    if (forage === "baitfish") return activity === "low" ? "moderate" : "heavy";
    if (forage === "crab" || forage === "shrimp" || forage === "crawfish") {
      return activity === "aggressive" ? "moderate" : "subtle";
    }
    if (forage === "surface_prey") return "moderate";
    return "moderate";
  }
  if (activity === "inactive" || activity === "low") return "none";
  if (activity === "aggressive" && forage === "baitfish") return "heavy";
  if (water_clarity === "stained" && forage === "baitfish") return "moderate";
  return base_flash;
}

// ─── Light label extraction ───────────────────────────────────────────────────

function extractLightLabel(analysis: SharedConditionAnalysis): LightLabel {
  const raw = analysis.norm.normalized.light_cloud_condition?.label ?? "mixed_sky";
  // Map to our LightLabel enum — the engine uses the same labels
  const valid: LightLabel[] = ["mostly_clear", "mixed_sky", "cloud_dominant", "heavy_overcast"];
  return valid.includes(raw as LightLabel) ? (raw as LightLabel) : "mixed_sky";
}

// ─── Depth lane helpers ───────────────────────────────────────────────────────

const DEPTH_LANES: DepthLane[] = ["surface", "upper", "mid", "near_bottom", "bottom"];

function depthIndex(d: DepthLane): number {
  return DEPTH_LANES.indexOf(d);
}

function depthFromIndex(i: number): DepthLane {
  return DEPTH_LANES[Math.max(0, Math.min(4, i))];
}

const SPEED_PREFS: SpeedPreference[] = ["dead_slow", "slow", "moderate", "fast", "vary"];

function speedIndex(s: SpeedPreference): number {
  return SPEED_PREFS.indexOf(s);
}

function speedFromIndex(i: number): SpeedPreference {
  return SPEED_PREFS[Math.max(0, Math.min(4, i))];
}

// ─── Main resolver ────────────────────────────────────────────────────────────

export function resolvePresentation(
  behavior: BehaviorOutput,
  req_species: SpeciesGroup,
  req_context: EngineContext,
  water_clarity: WaterClarity,
  analysis: SharedConditionAnalysis,
): PresentationOutput {
  const ctx_mod = getContextModifier(req_species, req_context);
  const light_label = extractLightLabel(analysis);
  const bottomForage = behavior.forage_mode === "crab" || behavior.forage_mode === "shrimp" || behavior.forage_mode === "crawfish";
  const lowConfidenceWindow = behavior.activity === "inactive" || behavior.activity === "low";

  // Start with the behavior-derived depth and speed
  let depth_target: DepthLane = behavior.depth_lane;
  let speed: SpeedPreference = behavior.speed_preference;
  let topwater_viable = behavior.topwater_viable;

  // ── Water clarity → depth/speed adjustments ───────────────────────────────
  //
  // Clear water: fish have better visibility and are more wary. They hold
  // slightly deeper and are more selective — slowing down and going deeper
  // increases natural presentation. Dirty water: fish rely on lateral line,
  // so staying higher in the column and speeding up helps them locate the lure.
  //
  if (water_clarity === "clear") {
    // Shift one tier deeper (more wary, holding tighter to structure)
    const di = depthIndex(depth_target);
    if (di < 4) depth_target = depthFromIndex(di + 1);
    // Slow down slightly (fish inspect before committing)
    const si = speedIndex(speed);
    if (speed !== "dead_slow" && speed !== "vary" && si > 0) {
      speed = speedFromIndex(si - 1);
    }
  } else if (water_clarity === "dirty") {
    if (bottomForage) {
      if (depth_target === "surface" || depth_target === "upper") {
        depth_target = depthFromIndex(depthIndex(depth_target) + 1);
      }
      if (!lowConfidenceWindow && speed === "dead_slow") {
        speed = "slow";
      }
      topwater_viable = false;
    } else if (lowConfidenceWindow) {
      if (speed === "moderate") speed = "slow";
      if (speed === "fast") speed = "moderate";
    } else {
      // Slightly shallower / higher water column when fish are actively tracking bait.
      const di = depthIndex(depth_target);
      if (di > 0 && depth_target !== "surface") {
        depth_target = depthFromIndex(di - 1);
      }
      // Small speed bump — faster lure creates more vibration for lateral line detection
      const si = speedIndex(speed);
      if (speed !== "fast" && speed !== "vary" && si < 3) {
        speed = speedFromIndex(si + 1);
      }
    }
  }
  // "stained" = no adjustment (middle ground — default behavior)

  const motion: MotionType = deriveMotion(
    behavior.activity,
    speed,           // clarity-adjusted speed
    topwater_viable,
    behavior.forage_mode,
  );
  const trigger: TriggerType = deriveTrigger(
    behavior.activity,
    behavior.forage_mode,
    speed,           // clarity-adjusted speed
    depth_target,
  );
  const profile: ProfileSize = deriveProfile(behavior.forage_mode, behavior.activity);

  const noise: NoiseLevel = deriveNoise(
    behavior.noise_preference,
    behavior.activity,
    topwater_viable,
  );
  const flash: FlashLevel = deriveFlash(
    behavior.flash_preference,
    behavior.activity,
    behavior.forage_mode,
    water_clarity,
  );

  const color_family = resolveColorFamily(
    water_clarity,
    behavior.forage_mode,
    light_label,
    req_species,
  );

  // Current technique: carry through from context modifier if set
  const current_technique: CurrentTechnique | undefined = ctx_mod.current_technique;

  return {
    depth_target,
    speed,
    motion,
    trigger_type: trigger,
    noise,
    flash,
    profile,
    color_family,
    topwater_viable,
    current_technique,
  };
}
