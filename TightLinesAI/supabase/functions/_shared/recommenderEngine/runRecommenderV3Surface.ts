import type { SpeciesGroup } from "./contracts/species.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import {
  RECOMMENDER_FEATURE,
  type RankedRecommendation,
  type RecommenderResponse,
} from "./contracts/output.ts";
import { computeRecommenderV3 } from "./runRecommenderV3.ts";
import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";

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

function toSurfaceSpecies(species: ReturnType<typeof computeRecommenderV3>["species"]): SpeciesGroup {
  switch (species) {
    case "northern_pike":
      return "pike_musky";
    case "trout":
      return "river_trout";
    default:
      return species;
  }
}

function toSurfaceRecommendation(
  candidate: ReturnType<typeof computeRecommenderV3>["lure_recommendations"][number],
): RankedRecommendation {
  return {
    id: candidate.id,
    display_name: candidate.display_name,
    family_group: candidate.family_group,
    color_style: candidate.color_recommendations.join(" / "),
    why_chosen: candidate.why_chosen,
    how_to_fish: candidate.how_to_fish,
    primary_column: candidate.primary_column,
    pace: candidate.pace,
    presence: candidate.presence,
    is_surface: candidate.is_surface,
  };
}

export function runRecommenderV3Surface(req: RecommenderRequest): RecommenderResponse {
  const sharedReq: SharedEngineRequest = {
    latitude: req.location.latitude,
    longitude: req.location.longitude,
    state_code: req.location.state_code,
    region_key: req.location.region_key,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
    context: req.context,
    environment: req.env_data as SharedEngineRequest["environment"],
    data_coverage: {},
  };
  const analysis = analyzeSharedConditions(sharedReq);
  const v3 = computeRecommenderV3(req, analysis);
  const now = new Date();
  const expires = locationLocalMidnightIso(req.location.local_timezone, now);

  return {
    feature: RECOMMENDER_FEATURE,
    species: toSurfaceSpecies(v3.species),
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
