/**
 * Experimental v4 engine — **not** invoked by `supabase/functions/recommender/index.ts`.
 *
 * Used by unit tests, coverage scripts, and audit tooling. Production Edge calls
 * `runRecommenderRebuildSurface` (deterministic rebuild). Target architecture:
 * `docs/tightlines_recommender_architecture_clean.md`.
 */

import type { SharedConditionAnalysis } from "../../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../../contracts/input.ts";
import { analyzeRecommenderConditions } from "../../sharedAnalysis.ts";
import { locationLocalMidnightIso } from "../../runRecommenderRebuildSurface.ts";
import { assertRecommenderV4Scope, toLegacyRecommenderSpecies } from "../scope.ts";
import {
  TACTICAL_COLUMNS_V4,
  type RankedRecommendationV4,
  type RecommenderResponseV4,
  type RecommenderSummaryV4,
  type SeasonalRowV4,
  type TacticalColumn,
  type TacticalPace,
} from "../contracts.ts";
import { resolveDailyPayloadV4 } from "./resolveDailyPayload.ts";
import { resolveSeasonalRowV4 } from "../seasonal/resolveSeasonalRow.ts";
import { createMulberry32 } from "./prng.ts";
import { buildSeed } from "./buildSeed.ts";
import {
  columnShapeIsSpread,
  resolveTodayTacticsV4,
  uniqueColumns,
  uniquePaces,
} from "./resolveTodayTactics.ts";
import { MIN_ELIGIBLE_POOL_SIZE } from "../constants.ts";
import {
  buildEligiblePoolV4,
  buildHeadlinePoolV4,
} from "./buildEligiblePool.ts";
import {
  buildSlotRecipe,
  enforceSurfaceCapV4,
  pickTop3V4,
  type PickedArchetypeV4,
} from "./pickTop3.ts";
import {
  buildWhyChosenV4,
  pickHowToFish,
  resolveHeadlineForageCopyMode,
} from "./buildCopy.ts";
import { normalizeLightBucketV3, resolveColorDecisionV3 } from "../colorDecision.ts";
import {
  createConsoleDiagWriter,
  type RecommenderV4DiagWriter,
} from "./diagnostics.ts";
import { RecommenderV4EngineError } from "./RecommenderV4EngineError.ts";

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

function minPoolSizeForSpecies(species: SeasonalRowV4["species"]): number {
  return species === "trout" ? 4 : MIN_ELIGIBLE_POOL_SIZE;
}

function windSpeedMissing(env_data: Record<string, unknown>): boolean {
  const raw = env_data.wind_speed_mph;
  if (typeof raw === "number" && Number.isFinite(raw)) return false;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n)) return false;
  }
  return true;
}

function assembleGear(
  gear_mode: "lure" | "fly",
  row: SeasonalRowV4,
  tactics: ReturnType<typeof resolveTodayTacticsV4>,
  daily: ReturnType<typeof resolveDailyPayloadV4>,
  seed: ReturnType<typeof createMulberry32>,
  diag: RecommenderV4DiagWriter,
  analysis: SharedConditionAnalysis,
): [RankedRecommendationV4, RankedRecommendationV4, RankedRecommendationV4] {
  /** §11 — eligible pool: `unique(column_distribution)` × `unique(pace_distribution)` × species × water × clarity × excluded only. */
  const minN = minPoolSizeForSpecies(row.species);
  const colTargets = uniqueColumns(tactics.column_distribution);
  const paceTargets = uniquePaces(tactics.pace_distribution);
  const eligible = buildEligiblePoolV4(
    gear_mode,
    row,
    [...colTargets],
    [...paceTargets],
    daily.water_clarity,
    row.species,
    row.water_type,
  );
  /** §12 — relaxation search space matches the same today column/pace sets as §11 (not merely columns present on the filtered pool). */
  const colSet = new Set<TacticalColumn>(colTargets);
  const paceSet = new Set<TacticalPace>(paceTargets);
  const todayColumnsForPick = [...TACTICAL_COLUMNS_V4].filter((c) => colSet.has(c)) as TacticalColumn[];

  /** P18 / §11.2 — advisory thin pool (relaxation still expected to assemble three picks when structurally possible). */
  if (eligible.length < minN) {
    diag({
      event: "pool_undersized",
      variant: String(eligible.length),
      species: row.species,
      region_key: row.region_key,
      month: row.month,
      water_type: row.water_type,
      context: { gear_mode, min_expected: minN },
    });
  }

  const { pool: headlinePool, headline_fallback: hf } = buildHeadlinePoolV4(
    gear_mode,
    row,
    eligible,
  );
  if (hf !== "none") {
    diag({
      event: "headline_fallback",
      variant: hf,
      species: row.species,
      region_key: row.region_key,
      month: row.month,
      water_type: row.water_type,
      context: { gear_mode },
    });
  }

  const slotRecipe = buildSlotRecipe(tactics.column_distribution, tactics.pace_distribution);
  let picks = pickTop3V4(
    slotRecipe,
    eligible,
    headlinePool,
    seed,
    todayColumnsForPick,
    paceSet,
    colSet,
    diag,
    gear_mode,
    row,
  );
  picks = enforceSurfaceCapV4(
    picks,
    tactics.column_distribution,
    eligible,
    seed,
    todayColumnsForPick,
    paceSet,
    colSet,
    diag,
    gear_mode,
    row,
  );

  const light = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const light_bucket = normalizeLightBucketV3(light);
  const colorDecision = resolveColorDecisionV3(daily.water_clarity, light_bucket);
  const color_style = colorThemeLabel(colorDecision.color_theme);

  const column_spread = columnShapeIsSpread(daily.posture, tactics.column_distribution);
  const headline_forage_copy = resolveHeadlineForageCopyMode(hf);

  const toRanked = (p: PickedArchetypeV4): RankedRecommendationV4 => {
    const pick_is_surface = p.archetype.column === "surface" || p.archetype.is_surface;
    const why = buildWhyChosenV4({
      archetype: p.archetype,
      slot_role: p.role,
      posture: daily.posture,
      column_shape_spread: column_spread,
      headline_forage_copy,
      pick_is_surface,
      anchor_column: tactics.column_distribution[0]!,
      outward_column: tactics.column_distribution[2]!,
      slot_column: p.slotColumn,
      slot_pace: p.slotPace,
      row,
    });
    return {
      id: p.archetype.id,
      display_name: p.archetype.display_name,
      family_group: p.archetype.family_group,
      color_style,
      why_chosen: why,
      how_to_fish: pickHowToFish(p.archetype, daily.water_clarity),
      column: p.archetype.column,
      pace: p.slotPace,
      is_surface: pick_is_surface,
    };
  };

  return [toRanked(picks[0]!), toRanked(picks[1]!), toRanked(picks[2]!)];
}

/**
 * Pure recommender assembly — caller supplies analysis + resolved row (integration tests inject rows).
 */
export function computeRecommenderV4(
  req: RecommenderRequest,
  user_id: string,
  analysis: SharedConditionAnalysis,
  seasonalRow: SeasonalRowV4,
  diag: RecommenderV4DiagWriter = createConsoleDiagWriter(),
): RecommenderResponseV4 {
  const { species, context } = assertRecommenderV4Scope(req);
  if (seasonalRow.species !== species || seasonalRow.water_type !== context) {
    throw new RecommenderV4EngineError(
      "computeRecommenderV4: seasonal row species/water_type mismatch vs request",
    );
  }

  if (windSpeedMissing(req.env_data)) {
    diag({
      event: "wind_missing",
      variant: null,
      species,
      region_key: req.location.region_key,
      month: req.location.month,
      water_type: context,
      context: {},
    });
  }

  const daily = resolveDailyPayloadV4(analysis, req.env_data, req.water_clarity);
  const seedNum = buildSeed(
    user_id,
    req.location.local_date,
    species,
    req.location.region_key,
    req.location.month,
    context,
  );
  const seed = createMulberry32(seedNum);
  const tactics = resolveTodayTacticsV4(seasonalRow, daily, seed);

  const lure_recommendations = assembleGear(
    "lure",
    seasonalRow,
    tactics,
    daily,
    seed,
    diag,
    analysis,
  );
  const fly_recommendations = assembleGear(
    "fly",
    seasonalRow,
    tactics,
    daily,
    seed,
    diag,
    analysis,
  );

  const surface_available_today = tactics.today_columns.includes("surface");
  const summary: RecommenderSummaryV4 = {
    posture: daily.posture,
    column_range: [...seasonalRow.column_range],
    column_baseline: seasonalRow.column_baseline,
    pace_range: [...seasonalRow.pace_range],
    pace_baseline: seasonalRow.pace_baseline,
    primary_forage: seasonalRow.primary_forage,
    secondary_forage: seasonalRow.secondary_forage,
    surface_available_today,
    today_column_distribution: [...tactics.column_distribution],
    today_pace_distribution: [...tactics.pace_distribution],
  };

  const now = new Date();
  const generated_at = now.toISOString();
  const cache_expires_at = locationLocalMidnightIso(req.location.local_timezone, now);

  return {
    feature: "recommender_v4",
    species: toLegacyRecommenderSpecies(species),
    context,
    water_clarity: req.water_clarity,
    generated_at,
    cache_expires_at,
    summary,
    lure_recommendations,
    fly_recommendations,
  };
}

/**
 * Phase 4 entry — resolves seasonal row from authored matrix, then pure assembly.
 */
export function runRecommenderV4(
  req: RecommenderRequest,
  user_id: string,
  diag: RecommenderV4DiagWriter = createConsoleDiagWriter(),
): RecommenderResponseV4 {
  const { species, context } = assertRecommenderV4Scope(req);
  const analysis = analyzeRecommenderConditions(req);
  const { row } = resolveSeasonalRowV4(
    species,
    req.location.region_key,
    req.location.month,
    context,
    req.location.state_code,
  );
  try {
    return computeRecommenderV4(req, user_id, analysis, row, diag);
  } catch (e) {
    if (e instanceof RecommenderV4EngineError) throw e;
    if (e instanceof Error) throw new RecommenderV4EngineError(e.message);
    throw e;
  }
}
