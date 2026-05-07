import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type {
  FlyArchetypeIdV4,
  LureArchetypeIdV4,
  RecommenderV4Species,
} from "../v4/contracts.ts";
import type { DailyRegime } from "./shapeProfiles.ts";
import type { WindBand } from "./wind.ts";

export type ClarityLightMode =
  | "clear_bright"
  | "clear_low_light"
  | "stained_or_dirty_bright"
  | "stained_or_dirty_low_light"
  | "mixed_or_unknown";

export type ThermalMode =
  | "cold_limited"
  | "heat_limited"
  | "warming"
  | "cooling_or_shock"
  | "stable_or_unknown";

export type RunoffMode =
  | "clear_or_stable"
  | "elevated_or_dirty"
  | "blown_out"
  | "unknown";

export type LureConditionWindowId =
  | "surface_commitment_window"
  | "wind_reaction_window"
  | "clear_subtle_window";

export type LureDailyConditionState = {
  regime: DailyRegime;
  water_clarity: WaterClarity;
  surface_allowed_today: boolean;
  surface_slot_present: boolean;
  daylight_wind_mph: number;
  wind_band: WindBand;
  species?: RecommenderV4Species;
  context?: EngineContext;
  clarity_light_mode?: ClarityLightMode;
  thermal_mode?: ThermalMode;
  runoff_mode?: RunoffMode;
};

export type FlyConditionWindowId =
  | "trout_mouse_window"
  | "trout_elevated_runoff_streamer_window"
  | "pike_wind_flash_fly_window"
  | "surface_commitment_fly_window";

export type FlyDailyConditionState = {
  regime: DailyRegime;
  surface_allowed_today: boolean;
  surface_slot_present: boolean;
  daylight_wind_mph: number;
  wind_band: WindBand;
  species: RecommenderV4Species;
  context: EngineContext;
  month: number;
  clarity_light_mode?: ClarityLightMode;
  thermal_mode?: ThermalMode;
  runoff_mode?: RunoffMode;
};

const WINDOW_MATCHES: Record<
  LureConditionWindowId,
  readonly LureArchetypeIdV4[]
> = {
  surface_commitment_window: [
    "walking_topwater",
    "popping_topwater",
    "buzzbait",
    "prop_bait",
    "hollow_body_frog",
    "large_pike_topwater",
  ],
  wind_reaction_window: [
    "spinnerbait",
    "bladed_jig",
    "lipless_crankbait",
    "squarebill_crankbait",
    "large_bucktail_spinner",
    "casting_spoon",
    "pike_jerkbait",
    "large_profile_pike_swimbait",
  ],
  clear_subtle_window: [
    "suspending_jerkbait",
    "soft_jerkbait",
    "drop_shot_minnow",
    "drop_shot_worm",
    "weightless_stick_worm",
    "tube_jig",
    "ned_rig",
    "hair_jig",
    "inline_spinner",
    "casting_spoon",
  ],
};

const FLY_WINDOW_MATCHES: Record<
  FlyConditionWindowId,
  readonly FlyArchetypeIdV4[]
> = {
  trout_mouse_window: ["mouse_fly"],
  trout_elevated_runoff_streamer_window: [
    "sculpin_streamer",
    "muddler_sculpin",
    "sculpzilla",
    "woolly_bugger",
    "rabbit_strip_leech",
    "conehead_streamer",
    "articulated_baitfish_streamer",
    "unweighted_baitfish_streamer",
  ],
  pike_wind_flash_fly_window: [
    "pike_flash_fly",
    "pike_bunny_streamer",
    "articulated_dungeon_streamer",
    "articulated_baitfish_streamer",
    "game_changer",
    "deceiver",
  ],
  surface_commitment_fly_window: [
    "popper_fly",
    "frog_fly",
    "deer_hair_slider",
  ],
};

export const LURE_CONDITION_WINDOW_PRIORITY: readonly LureConditionWindowId[] =
  [
    "surface_commitment_window",
    "wind_reaction_window",
    "clear_subtle_window",
  ];

export const FLY_CONDITION_WINDOW_PRIORITY: readonly FlyConditionWindowId[] = [
  "trout_elevated_runoff_streamer_window",
  "trout_mouse_window",
  "pike_wind_flash_fly_window",
  "surface_commitment_fly_window",
];

export const LURE_CONDITION_WINDOW_WEIGHTS: Record<
  LureConditionWindowId,
  number
> = {
  surface_commitment_window: 24,
  wind_reaction_window: 28,
  clear_subtle_window: 22,
};

export const FLY_CONDITION_WINDOW_WEIGHTS: Record<
  FlyConditionWindowId,
  number
> = {
  trout_mouse_window: 28,
  trout_elevated_runoff_streamer_window: 28,
  pike_wind_flash_fly_window: 26,
  surface_commitment_fly_window: 24,
};

export function conditionWindowWeight(
  window: LureConditionWindowId | FlyConditionWindowId,
): number {
  if (window in LURE_CONDITION_WINDOW_WEIGHTS) {
    return LURE_CONDITION_WINDOW_WEIGHTS[window as LureConditionWindowId];
  }
  return FLY_CONDITION_WINDOW_WEIGHTS[window as FlyConditionWindowId];
}

export function lureConditionWindowMatches(
  window: LureConditionWindowId,
  state?: LureDailyConditionState,
): ReadonlySet<string> {
  if (
    state?.species === "largemouth_bass" && window === "wind_reaction_window"
  ) {
    return new Set([
      "spinnerbait",
      "bladed_jig",
      "lipless_crankbait",
      "squarebill_crankbait",
    ]);
  }
  if (
    state?.species === "smallmouth_bass" && window === "clear_subtle_window"
  ) {
    return new Set([
      "suspending_jerkbait",
      "soft_jerkbait",
      "drop_shot_minnow",
      "tube_jig",
      "ned_rig",
      "hair_jig",
    ]);
  }
  if (state?.species === "northern_pike" && window === "wind_reaction_window") {
    return new Set([
      "large_bucktail_spinner",
      "casting_spoon",
      "pike_jerkbait",
      "large_profile_pike_swimbait",
    ]);
  }
  if (state?.species === "trout" && window === "clear_subtle_window") {
    return new Set([
      "inline_spinner",
      "casting_spoon",
      "hair_jig",
      "suspending_jerkbait",
      "soft_jerkbait",
    ]);
  }
  return new Set(WINDOW_MATCHES[window]);
}

export function activeLureConditionWindow(
  state: LureDailyConditionState,
): LureConditionWindowId | null {
  if (
    state.surface_allowed_today &&
    state.surface_slot_present &&
    state.regime === "aggressive" &&
    state.wind_band !== "windy"
  ) {
    return "surface_commitment_window";
  }

  if (
    state.wind_band === "windy" &&
    state.regime !== "suppressive"
  ) {
    return "wind_reaction_window";
  }

  if (
    state.water_clarity === "clear" &&
    state.wind_band !== "windy" &&
    state.regime !== "aggressive"
  ) {
    return "clear_subtle_window";
  }

  return null;
}

export function flyConditionWindowMatches(
  window: FlyConditionWindowId,
  _state?: FlyDailyConditionState,
): ReadonlySet<string> {
  return new Set(FLY_WINDOW_MATCHES[window]);
}

export function activeFlyConditionWindow(
  state: FlyDailyConditionState,
): FlyConditionWindowId | null {
  if (
    state.species === "trout" &&
    state.context === "freshwater_river" &&
    (state.runoff_mode === "elevated_or_dirty" ||
      state.runoff_mode === "blown_out")
  ) {
    return "trout_elevated_runoff_streamer_window";
  }

  if (
    state.species === "trout" &&
    state.context === "freshwater_river" &&
    [6, 7, 8].includes(state.month) &&
    state.surface_allowed_today &&
    state.surface_slot_present &&
    state.regime === "aggressive" &&
    state.wind_band === "calm"
  ) {
    return "trout_mouse_window";
  }

  if (
    state.species === "northern_pike" &&
    state.wind_band === "windy" &&
    state.regime !== "suppressive"
  ) {
    return "pike_wind_flash_fly_window";
  }

  if (
    state.surface_allowed_today &&
    state.surface_slot_present &&
    state.regime === "aggressive" &&
    state.wind_band !== "windy"
  ) {
    return "surface_commitment_fly_window";
  }

  return null;
}
