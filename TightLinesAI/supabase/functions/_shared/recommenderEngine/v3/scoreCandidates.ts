import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import type {
  ColorThemeIdV3,
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  WaterColumnV3,
} from "./contracts.ts";
import type { WaterClarity } from "../contracts/input.ts";

const WATER_COLUMNS: WaterColumnV3[] = ["top", "shallow", "mid", "bottom"];
const MOODS: MoodV3[] = ["negative", "neutral", "active"];
const PRESENTATION_STYLES: PresentationStyleV3[] = ["subtle", "balanced", "bold"];
const BAITFISH_FORWARD_FAMILIES = new Set([
  "spinnerbait",
  "bladed_jig",
  "swimbait",
  "soft_jerkbait",
  "jerkbait",
  "crankbait",
  "lipless",
  "blade_bait",
  "spoon",
  "baitfish_streamer",
  "articulated_streamer",
]);
const NATURAL_SOFT_FAMILIES = new Set([
  "stick_worm",
  "finesse_worm",
  "drop_shot",
  "ned_rig",
  "tube",
  "soft_craw",
  "bugger_leech",
  "bottom_streamer",
  "weighted_streamer",
]);

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function ordinalDistance<T>(ordered: readonly T[], value: T, allowed: readonly T[]): number | null {
  const current = ordered.indexOf(value);
  if (current === -1) return null;
  let best: number | null = null;
  for (const option of allowed) {
    const idx = ordered.indexOf(option);
    if (idx === -1) continue;
    const distance = Math.abs(current - idx);
    if (best === null || distance < best) best = distance;
  }
  return best;
}

function waterColumnComponent(target: WaterColumnV3, profile: RecommenderV3ArchetypeProfile): number {
  const distance = ordinalDistance(WATER_COLUMNS, target, profile.preferred_water_columns);
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function moodComponent(target: MoodV3, profile: RecommenderV3ArchetypeProfile): number {
  const distance = ordinalDistance(MOODS, target, profile.preferred_moods);
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function presentationComponent(
  target: PresentationStyleV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(PRESENTATION_STYLES, target, profile.preferred_presentation_styles);
  if (distance === 0) return 0.6;
  if (distance === 1) return 0.3;
  return 0;
}

function forageBonusValue(
  row: RecommenderV3SeasonalRow,
  profile: RecommenderV3ArchetypeProfile,
): number {
  if (profile.forage_matches.includes(row.primary_forage)) return 1.5;
  if (row.secondary_forage && profile.forage_matches.includes(row.secondary_forage)) return 1.0;
  return 0;
}

function chooseColorTheme(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): ColorThemeIdV3 {
  const priorities: ColorThemeIdV3[] = [];

  const baitfishForward =
    BAITFISH_FORWARD_FAMILIES.has(profile.family_key) ||
    profile.tactical_lane === "horizontal_search" ||
    profile.tactical_lane === "reaction_mid_column" ||
    profile.tactical_lane === "fly_baitfish";
  const naturalSoftProfile =
    NATURAL_SOFT_FAMILIES.has(profile.family_key) ||
    profile.tactical_lane === "bottom_contact" ||
    profile.tactical_lane === "finesse_subtle" ||
    profile.tactical_lane === "cover_weedless" ||
    profile.tactical_lane === "fly_bottom";

  if (profile.family_key === "frog" || profile.id === "frog_fly") {
    priorities.push("frog_natural", clarity === "dirty" ? "dark_contrast" : "bright_contrast");
  }
  if (profile.id === "mouse_fly") {
    priorities.push("mouse_natural", "dark_contrast");
  }
  if (
    profile.id === "bladed_jig" &&
    clarity === "stained" &&
    resolved.final_presentation_style !== "subtle"
  ) {
    priorities.push("dark_contrast", "white_shad", "green_pumpkin_natural");
  }
  if (
    profile.id === "suspending_jerkbait" &&
    clarity === "stained"
  ) {
    priorities.push(
      resolved.final_presentation_style === "bold" && resolved.final_mood === "active"
        ? "bright_contrast"
        : "white_shad",
      "white_shad",
      "natural_baitfish",
      "bright_contrast",
    );
  }
  if (
    profile.id === "hair_jig" &&
    resolved.primary_forage === "baitfish" &&
    clarity !== "dirty"
  ) {
    priorities.push("natural_baitfish", "white_shad");
  }

  if (naturalSoftProfile) {
    if (
      (profile.id === "tube_jig" || profile.id === "ned_rig") &&
      clarity !== "dirty"
    ) {
      priorities.push("green_pumpkin_natural", "craw_natural", "watermelon_natural");
    }
    if (resolved.primary_forage === "crawfish") {
      if (clarity === "clear" && resolved.final_presentation_style === "subtle") {
        priorities.push("green_pumpkin_natural", "craw_natural");
      } else if (clarity === "stained") {
        priorities.push(
          resolved.final_presentation_style === "subtle"
            ? "green_pumpkin_natural"
            : "craw_natural",
          "green_pumpkin_natural",
          "craw_natural",
          "dark_contrast",
        );
      } else {
        priorities.push("craw_natural", "green_pumpkin_natural");
      }
    } else if (resolved.primary_forage === "bluegill_perch") {
      priorities.push("green_pumpkin_natural", "perch_bluegill");
    } else if (clarity === "clear") {
      priorities.push("green_pumpkin_natural", "watermelon_natural");
    } else {
      priorities.push("green_pumpkin_natural", "dark_contrast");
    }
  }

  if (baitfishForward) {
    if (
      profile.id === "swim_jig" &&
      clarity === "dirty"
    ) {
      priorities.push(
        resolved.final_mood === "negative" ? "dark_contrast" : "white_shad",
        "dark_contrast",
        "white_shad",
      );
    }
    if (resolved.primary_forage === "bluegill_perch") {
      priorities.push("perch_bluegill", clarity === "dirty" ? "dark_contrast" : "natural_baitfish");
    } else if (clarity === "stained") {
      priorities.push(
        resolved.final_presentation_style === "subtle" ? "white_shad" : "bright_contrast",
        "white_shad",
        "natural_baitfish",
      );
    } else if (clarity === "dirty") {
      priorities.push("bright_contrast", "white_shad", "dark_contrast");
    } else {
      priorities.push("natural_baitfish", "white_shad");
    }
  }

  switch (resolved.primary_forage) {
    case "crawfish":
      priorities.push("craw_natural", "green_pumpkin_natural", "dark_contrast");
      break;
    case "bluegill_perch":
      priorities.push("perch_bluegill", "green_pumpkin_natural", "dark_contrast");
      break;
    case "baitfish":
      if (clarity === "clear") {
        priorities.push("natural_baitfish", "white_shad");
      } else if (clarity === "dirty") {
        priorities.push(
          resolved.final_mood === "negative" ? "dark_contrast" : "bright_contrast",
          "dark_contrast",
          "white_shad",
        );
      } else {
        priorities.push("white_shad", "natural_baitfish", "bright_contrast");
      }
      break;
    case "leech_worm":
      priorities.push("dark_contrast", "green_pumpkin_natural", "natural_baitfish");
      break;
    case "insect_misc":
      priorities.push("dark_contrast", "natural_baitfish", "bright_contrast");
      break;
  }

  if (resolved.final_presentation_style === "bold") {
    priorities.push("bright_contrast", "dark_contrast");
  } else if (resolved.final_presentation_style === "subtle") {
    priorities.push("natural_baitfish", "green_pumpkin_natural", "watermelon_natural");
  }

  for (const theme of priorities) {
    if (profile.allowed_color_themes.includes(theme)) return theme;
  }

  return profile.allowed_color_themes[0]!;
}

function firstThreeColors(profile: RecommenderV3ArchetypeProfile, theme: ColorThemeIdV3): [string, string, string] {
  const shades = profile.shade_examples_by_theme[theme] ?? [];
  return [shades[0]!, shades[1]!, shades[2]!];
}

function buildWhy(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): string {
  return `${profile.display_name} fits a ${resolved.final_mood} fish mood, stays in the ${resolved.final_water_column} lane, and matches today's ${resolved.final_presentation_style} need in ${clarity} water.`;
}

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): RecommenderV3RankedArchetype {
  const breakdown: RecommenderV3ScoreBreakdown[] = [];

  const seasonal_baseline = roundScore(
    6.8 +
      waterColumnComponent(seasonal.base_water_column, profile) +
      moodComponent(seasonal.base_mood, profile) +
      presentationComponent(seasonal.base_presentation_style, profile) +
      (profile.forage_matches.includes(seasonal.primary_forage)
        ? 0.8
        : seasonal.secondary_forage && profile.forage_matches.includes(seasonal.secondary_forage)
        ? 0.5
        : 0),
  );
  breakdown.push({
    code: "seasonal_baseline",
    value: seasonal_baseline,
    detail: "Seasonal fit stays intentionally tight so daily conditions can reshuffle the pool.",
  });

  const daily_modifier = roundScore(
    (ordinalDistance(WATER_COLUMNS, resolved.final_water_column, profile.preferred_water_columns) === 0
      ? 0.75
      : ordinalDistance(WATER_COLUMNS, resolved.final_water_column, profile.preferred_water_columns) === 1
      ? 0.35
      : -0.5) +
      (ordinalDistance(MOODS, resolved.final_mood, profile.preferred_moods) === 0
        ? 1.0
        : ordinalDistance(MOODS, resolved.final_mood, profile.preferred_moods) === 1
        ? 0.5
        : -0.75) +
      (ordinalDistance(
          PRESENTATION_STYLES,
          resolved.final_presentation_style,
          profile.preferred_presentation_styles,
        ) === 0
        ? 0.75
        : ordinalDistance(
            PRESENTATION_STYLES,
            resolved.final_presentation_style,
            profile.preferred_presentation_styles,
          ) === 1
        ? 0.35
        : -0.5),
  );
  breakdown.push({
    code: "daily_modifier",
    value: daily_modifier,
    detail: "Daily conditions determine whether this archetype moves up, down, or stays in place today.",
  });

  const clarity_modifier = roundScore(
    profile.clarity_strengths.includes(clarity)
      ? 0.9
      : clarity === "dirty" && profile.allowed_color_themes.includes("bright_contrast")
      ? 0.3
      : clarity === "clear" && profile.allowed_color_themes.includes("natural_baitfish")
      ? 0.3
      : -0.6,
  );
  breakdown.push({
    code: "clarity_modifier",
    value: clarity_modifier,
    detail: "Clarity fine-tunes how visible and assertive this archetype should be.",
  });

  const forage_bonus = roundScore(forageBonusValue(seasonal, profile));
  breakdown.push({
    code: "forage_bonus",
    value: forage_bonus,
    detail: "Forage bonus keeps the recommendation tied to likely prey for the month and region.",
  });

  const score = roundScore(seasonal_baseline + daily_modifier + clarity_modifier + forage_bonus);
  const color_theme = chooseColorTheme(profile, resolved, clarity);
  const color_recommendations = firstThreeColors(profile, color_theme);

  return {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: profile.gear_mode,
    family_key: profile.family_key,
    tactical_lane: profile.tactical_lane,
    score,
    seasonal_baseline,
    daily_modifier,
    clarity_modifier,
    forage_bonus,
    color_theme,
    color_recommendations,
    why: buildWhy(profile, resolved, clarity),
    breakdown,
  };
}

function selectTopThree(
  scored: RecommenderV3RankedArchetype[],
  seasonalOrder: readonly (LureArchetypeIdV3 | FlyArchetypeIdV3)[],
): RecommenderV3RankedArchetype[] {
  const orderIndex = new Map(seasonalOrder.map((id, index) => [id, index]));
  const sorted = [...scored].sort((a, b) =>
    b.score - a.score ||
    (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
    a.display_name.localeCompare(b.display_name)
  );
  const selected: RecommenderV3RankedArchetype[] = [];

  while (selected.length < 3 && sorted.length > 0) {
    const top = sorted[0]!;
    const nearBand = sorted.filter((candidate) => top.score - candidate.score <= 0.5);
    const usedLanes = new Set(selected.map((candidate) => candidate.tactical_lane));
    const usedFamilies = new Set(selected.map((candidate) => candidate.family_key));
    const preferred =
      nearBand.find((candidate) =>
        !usedLanes.has(candidate.tactical_lane) && !usedFamilies.has(candidate.family_key)
      ) ??
      nearBand.find((candidate) => !usedLanes.has(candidate.tactical_lane)) ??
      top;

    selected.push(preferred);
    const index = sorted.findIndex((candidate) => candidate.id === preferred.id);
    if (index >= 0) sorted.splice(index, 1);
  }

  return selected;
}

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): RecommenderV3RankedArchetype[] {
  const scored = seasonal.viable_lure_archetypes.map((id) =>
    scoreProfile(LURE_ARCHETYPES_V3[id], seasonal, resolved, clarity)
  );
  return selectTopThree(scored, seasonal.viable_lure_archetypes);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): RecommenderV3RankedArchetype[] {
  const scored = seasonal.viable_fly_archetypes.map((id) =>
    scoreProfile(FLY_ARCHETYPES_V3[id], seasonal, resolved, clarity)
  );
  return selectTopThree(scored, seasonal.viable_fly_archetypes);
}
