import type { SpeciesGroup } from "./contracts/species.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import {
  RECOMMENDER_FEATURE,
  type RankedRecommendation,
  type RecommenderResponse,
} from "./contracts/output.ts";
import { computeRecommenderV3 } from "./runRecommenderV3.ts";
import { analyzeRecommenderConditions } from "./sharedAnalysis.ts";
import { toLegacyRecommenderSpecies } from "./v3/scope.ts";

export function locationLocalMidnightIso(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  const hh = Number(parts.hour);
  const mm = Number(parts.minute);
  const ss = Number(parts.second);
  const localNowUtcMillis = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offsetMillis = localNowUtcMillis - now.getTime();
  const nextLocalMidnightUtcMillis = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - offsetMillis;
  return new Date(nextLocalMidnightUtcMillis).toISOString();
}

function colorThemeLabel(theme: ReturnType<typeof computeRecommenderV3>["lure_recommendations"][number]["color_theme"]): string {
  switch (theme) {
    case "natural": return "Natural";
    case "dark":    return "Dark";
    case "bright":  return "Bright";
  }
}

function toSurfaceRecommendation(
  candidate: ReturnType<typeof computeRecommenderV3>["lure_recommendations"][number],
): RankedRecommendation {
  return {
    id: candidate.id,
    display_name: candidate.display_name,
    family_group: candidate.family_group,
    color_style: colorThemeLabel(candidate.color_theme),
    why_chosen: candidate.why_chosen,
    how_to_fish: candidate.how_to_fish,
    primary_column: candidate.primary_column,
    pace: candidate.pace,
    presence: candidate.presence,
    is_surface: candidate.is_surface,
  };
}

export function runRecommenderV3Surface(req: RecommenderRequest): RecommenderResponse {
  const analysis = analyzeRecommenderConditions(req);
  const v3 = computeRecommenderV3(req, analysis);

  if (v3.lure_recommendations.length < 3 || v3.fly_recommendations.length < 3) {
    throw new Error(
      `V3 engine returned fewer than 3 recommendations for ${v3.species} ` +
      `in ${v3.region_key} month ${v3.month} ${v3.context}. ` +
      `Lures: ${v3.lure_recommendations.length}, Flies: ${v3.fly_recommendations.length}.`,
    );
  }

  const now = new Date();
  const expires = locationLocalMidnightIso(req.location.local_timezone, now);

  return {
    feature: RECOMMENDER_FEATURE,
    species: toLegacyRecommenderSpecies(v3.species) as SpeciesGroup,
    context: v3.context,
    water_clarity: v3.water_clarity,
    generated_at: now.toISOString(),
    cache_expires_at: expires,
    summary: {
      monthly_forage: {
        primary: v3.seasonal_row.monthly_baseline.primary_forage,
        secondary: v3.seasonal_row.monthly_baseline.secondary_forage,
      },
      monthly_baseline: {
        allowed_columns: [...v3.seasonal_row.monthly_baseline.allowed_columns],
        allowed_paces: [...v3.seasonal_row.monthly_baseline.allowed_paces],
        allowed_presence: [...v3.seasonal_row.monthly_baseline.allowed_presence],
        surface_seasonally_possible:
          v3.seasonal_row.monthly_baseline.surface_seasonally_possible,
      },
      daily_tactical_preference: {
        posture_band: v3.daily_payload.posture_band,
        preferred_column: v3.resolved_profile.daily_preference.preferred_column,
        secondary_column: v3.resolved_profile.daily_preference.secondary_column,
        preferred_pace: v3.resolved_profile.daily_preference.preferred_pace,
        secondary_pace: v3.resolved_profile.daily_preference.secondary_pace,
        preferred_presence: v3.resolved_profile.daily_preference.preferred_presence,
        secondary_presence: v3.resolved_profile.daily_preference.secondary_presence,
        surface_allowed_today: v3.resolved_profile.daily_preference.surface_allowed_today,
        surface_window: v3.resolved_profile.daily_preference.surface_window,
        opportunity_mix: v3.resolved_profile.daily_preference.opportunity_mix,
      },
    },
    lure_recommendations: [
      toSurfaceRecommendation(v3.lure_recommendations[0]!),
      toSurfaceRecommendation(v3.lure_recommendations[1]!),
      toSurfaceRecommendation(v3.lure_recommendations[2]!),
    ],
    fly_recommendations: [
      toSurfaceRecommendation(v3.fly_recommendations[0]!),
      toSurfaceRecommendation(v3.fly_recommendations[1]!),
      toSurfaceRecommendation(v3.fly_recommendations[2]!),
    ],
  };
}
