/**
 * Adapter: deterministic rebuild engine → stable **RecommenderResponse** for the app.
 */

import type { SpeciesGroup } from "./contracts/species.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import {
  type RankedRecommendation,
  RECOMMENDER_FEATURE,
  type RecommenderResponse,
} from "./contracts/output.ts";
import { analyzeRecommenderConditions } from "./sharedAnalysis.ts";
import { toLegacyRecommenderSpecies } from "./v3/scope.ts";
import type {
  DailyPostureBandV3,
  DailySurfaceWindowV3,
  ForageBucketV3,
  OpportunityMixModeV3,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "./v3/contracts.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./v4/colorDecision.ts";
import type { SeasonalRowV4 } from "./v4/contracts.ts";
import type { TacticalColumn, TacticalPace } from "./v4/contracts.ts";
import {
  computeRecommenderRebuild,
  type RebuildSelectionOptions,
} from "./rebuild/runRecommenderRebuild.ts";
import {
  archetypeToRankedFields,
  presenceFromPace,
  type RebuildSlotPick,
} from "./rebuild/selectSide.ts";
import type { DailyRegime } from "./rebuild/shapeProfiles.ts";

export function locationLocalMidnightIso(
  timezone: string,
  now = new Date(),
): string {
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
  const parts = Object.fromEntries(
    formatter.formatToParts(now).map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  const hh = Number(parts.hour);
  const mm = Number(parts.minute);
  const ss = Number(parts.second);
  const localNowUtcMillis = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offsetMillis = localNowUtcMillis - now.getTime();
  const nextLocalMidnightUtcMillis = Date.UTC(y, m - 1, d + 1, 0, 0, 0) -
    offsetMillis;
  return new Date(nextLocalMidnightUtcMillis).toISOString();
}

function colorThemeLabel(theme: "natural" | "dark" | "bright"): string {
  switch (theme) {
    case "natural":
      return "Natural";
    case "dark":
      return "Dark";
    case "bright":
      return "Bright";
  }
}

function mapPostureBand(regime: DailyRegime): DailyPostureBandV3 {
  switch (regime) {
    case "aggressive":
      return "aggressive";
    case "neutral":
      return "neutral";
    case "suppressive":
      return "suppressed";
  }
}

function mapOpportunityMix(regime: DailyRegime): OpportunityMixModeV3 {
  switch (regime) {
    case "aggressive":
      return "aggressive";
    case "neutral":
      return "balanced";
    case "suppressive":
      return "conservative";
  }
}

function mapSurfaceWindow(surfaceBlocked: boolean): DailySurfaceWindowV3 {
  return surfaceBlocked ? "closed" : "clean";
}

function forageToV3(primary: SeasonalRowV4["primary_forage"]): ForageBucketV3 {
  return primary as ForageBucketV3;
}

function col(c: TacticalColumn): RankedRecommendation["primary_column"] {
  return c as RankedRecommendation["primary_column"];
}

function pace(p: TacticalPace): RankedRecommendation["pace"] {
  return p as RankedRecommendation["pace"];
}

export function runRecommenderRebuildSurface(
  req: RecommenderRequest,
  options: RebuildSelectionOptions = {},
): RecommenderResponse {
  const analysis = analyzeRecommenderConditions(req);
  const eng = computeRecommenderRebuild(req, analysis, options);

  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ??
    null;
  const bucket = normalizeLightBucketV3(lightLabel);
  const colorDecision = resolveColorDecisionV3(req.water_clarity, bucket);

  const toRanked = (picks: RebuildSlotPick[]): RankedRecommendation[] =>
    picks.map(({ archetype, profile, source_slot_index }) => {
      const copySeed = [
        options.userSeed ?? "shared",
        req.location.local_date,
        req.location.region_key,
        req.context,
        req.water_clarity,
        archetype.id,
        profile.column,
        profile.pace,
        String(source_slot_index),
      ].join("|");
      const core = archetypeToRankedFields({
        archetype,
        row: eng.row,
        targetProfile: profile,
        copySeed,
      });
      return {
        ...core,
        primary_column: col(core.primary_column as TacticalColumn),
        pace: pace(core.pace as TacticalPace),
        presence: core.presence as TacticalPresenceV3,
        color_style: colorThemeLabel(colorDecision.color_theme),
        why_chosen: core.why_chosen,
        source_slot_index,
      };
    });

  const profiles = eng.profiles;
  const p0 = profiles[0]!;
  const p1 = profiles[1];

  const surfaceAllowedToday = eng.row.column_range.includes("surface") &&
    eng.row.surface_seasonally_possible &&
    !eng.surfaceBlocked;

  const now = new Date();
  const expires = locationLocalMidnightIso(req.location.local_timezone, now);

  const pacePresence = (pp: TacticalPace): TacticalPresenceV3 =>
    presenceFromPace(pp) as TacticalPresenceV3;

  return {
    feature: RECOMMENDER_FEATURE,
    species: toLegacyRecommenderSpecies(
      eng.row.species,
    ) as SpeciesGroup,
    context: req.context,
    water_clarity: req.water_clarity,
    generated_at: now.toISOString(),
    cache_expires_at: expires,
    summary: {
      monthly_forage: {
        primary: forageToV3(eng.row.primary_forage),
        secondary: eng.row.secondary_forage != null
          ? forageToV3(eng.row.secondary_forage)
          : undefined,
      },
      session_color_theme_label: colorThemeLabel(colorDecision.color_theme),
      monthly_baseline: {
        allowed_columns: [...eng.row.column_range] as TacticalColumnV3[],
        allowed_paces: [...eng.row.pace_range] as TacticalPaceV3[],
        allowed_presence: ["subtle", "moderate", "bold"],
        surface_seasonally_possible: eng.row.surface_seasonally_possible,
      },
      daily_tactical_preference: {
        posture_band: mapPostureBand(eng.regime),
        preferred_column: col(p0.column),
        secondary_column: p1 ? col(p1.column) : undefined,
        preferred_pace: pace(p0.pace),
        secondary_pace: p1 ? pace(p1.pace) : undefined,
        preferred_presence: pacePresence(p0.pace),
        secondary_presence: p1 ? pacePresence(p1.pace) : undefined,
        surface_allowed_today: surfaceAllowedToday,
        surface_window: mapSurfaceWindow(eng.surfaceBlocked),
        opportunity_mix: mapOpportunityMix(eng.regime),
      },
    },
    lure_recommendations: toRanked(eng.lureSlotPicks),
    fly_recommendations: toRanked(eng.flySlotPicks),
  };
}
