/**
 * Prototype audit: compare current target profiles against a conservative
 * diversified-profile variant and summarize catalog lane gaps.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-profile-geometry-catalog-gap.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
  TacticalColumn,
  TacticalPace,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  type DailyRegime,
  effectiveLegalColumns,
  type TargetProfile,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import {
  meanDaylightWindMph,
  type WindBand,
  windBandFromDaylightWindMph,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/wind.ts";
import {
  type RebuildSlotPick,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";
import {
  COLUMN_ORDER,
  paceIndex,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/constants.ts";

type ProfileMode = "current_profiles" | "diversified_profiles";
type Side = "lure" | "fly";

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/profile-geometry-catalog-gap-analysis.json`;
const MD_PATH = `${OUT_DIR}/profile-geometry-catalog-gap-analysis.md`;

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];
const CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: readonly DailyRegime[] = [
  "suppressive",
  "neutral",
  "aggressive",
];
const WIND_PROFILES: readonly WindBand[] = ["calm", "breezy", "windy"];
const PROFILE_MODES: readonly ProfileMode[] = [
  "current_profiles",
  "diversified_profiles",
];
const PACES: readonly TacticalPace[] = ["slow", "medium", "fast"];
const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};
const SOUTHERN_LMB_LAKE_REGIONS = new Set([
  "florida",
  "gulf_coast",
  "southeast_atlantic",
]);

type ModeAcc = {
  cells: number;
  repeatedPresentationCells: number;
  repeatedFamilyCells: number;
  adjacentSameTopLureCells: number;
  adjacentSameTopFlyCells: number;
  adjacentSameLureTripleCells: number;
  adjacentSameFlyTripleCells: number;
  southernFrogSurfaceSlotContextCells: number;
  southernFrogCandidateCells: number;
  southernFrogFinalistCells: number;
  southernFrogPickCells: number;
  invalidPickCells: number;
  invalidPickSamples: unknown[];
  diversifiedCells: number;
};

type DuplicateProfileAcc = {
  cells: number;
  duplicateLaneCells: number;
  duplicateColumnCells: number;
  diversifiedCells: number;
  repeatedPresentationCells: number;
};

type LaneGap = {
  lane: string;
  species: SeasonalRowV4["species"];
  water_type: SeasonalRowV4["water_type"];
  column: TacticalColumn;
  pace: TacticalPace;
  lure_presentation_groups: number;
  lure_family_groups: number;
  fly_presentation_groups: number;
  fly_family_groups: number;
  combined_surface_presentation_groups?: number;
  recommendation: string;
};

type CellRun = {
  row: SeasonalRowV4;
  profiles: TargetProfile[];
  lurePicks: RebuildSlotPick[];
  flyPicks: RebuildSlotPick[];
  lureTraces: RebuildSlotSelectionTrace[];
  flyTraces: RebuildSlotSelectionTrace[];
  surfaceBlocked: boolean;
  surfaceOpen: boolean;
  diversified: boolean;
};

function emptyModeAcc(): ModeAcc {
  return {
    cells: 0,
    repeatedPresentationCells: 0,
    repeatedFamilyCells: 0,
    adjacentSameTopLureCells: 0,
    adjacentSameTopFlyCells: 0,
    adjacentSameLureTripleCells: 0,
    adjacentSameFlyTripleCells: 0,
    southernFrogSurfaceSlotContextCells: 0,
    southernFrogCandidateCells: 0,
    southernFrogFinalistCells: 0,
    southernFrogPickCells: 0,
    invalidPickCells: 0,
    invalidPickSamples: [],
    diversifiedCells: 0,
  };
}

function emptyDuplicateAcc(): DuplicateProfileAcc {
  return {
    cells: 0,
    duplicateLaneCells: 0,
    duplicateColumnCells: 0,
    diversifiedCells: 0,
    repeatedPresentationCells: 0,
  };
}

function pct(part: number, whole: number): number {
  return whole ? Math.round((10000 * part) / whole) / 100 : 0;
}

function unique<T>(xs: readonly T[]): T[] {
  return [...new Set(xs)];
}

function duplicateValues<T>(xs: readonly T[]): T[] {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([x]) => x);
}

function hourlyWindUniform(localDate: string, mph: number) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: `${localDate}T${String(hour).padStart(2, "0")}:00:00Z`,
    value: mph,
  }));
}

function envForWind(
  localDate: string,
  band: WindBand,
): Record<string, unknown> {
  return {
    weather: { wind_speed_unit: "mph" },
    hourly_wind_speed: hourlyWindUniform(localDate, WIND_MPH[band]),
  };
}

function nextLocalDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + 1));
  return `${dt.getUTCFullYear()}-${
    String(dt.getUTCMonth() + 1).padStart(2, "0")
  }-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function regimeToHows0to100(r: DailyRegime): number {
  if (r === "suppressive") return 30;
  if (r === "neutral") return 50;
  return 75;
}

function profileKey(profile: TargetProfile): string {
  return `${profile.column}|${profile.pace}`;
}

function duplicateProfileInfo(profiles: readonly TargetProfile[]) {
  return {
    duplicateLaneCount: profiles.length -
      unique(profiles.map((profile) => profileKey(profile))).length,
    duplicateColumnCount: profiles.length -
      unique(profiles.map((profile) => profile.column)).length,
  };
}

function adjacentPaces(
  pace: TacticalPace,
  legal: readonly TacticalPace[],
): TacticalPace[] {
  const index = paceIndex(pace);
  return legal
    .filter((candidate) => Math.abs(paceIndex(candidate) - index) === 1)
    .sort((a, b) => paceIndex(a) - paceIndex(b));
}

function adjacentColumns(
  column: TacticalColumn,
  legal: readonly TacticalColumn[],
): TacticalColumn[] {
  const index = COLUMN_ORDER.indexOf(column);
  return legal
    .filter((candidate) =>
      Math.abs(COLUMN_ORDER.indexOf(candidate) - index) === 1
    )
    .sort((a, b) => COLUMN_ORDER.indexOf(a) - COLUMN_ORDER.indexOf(b));
}

function isColdConservativeRow(
  row: SeasonalRowV4,
  regime: DailyRegime,
): boolean {
  return regime === "suppressive" &&
    (row.month === 12 || row.month === 1 || row.month === 2) &&
    row.column_range.includes("bottom") &&
    row.pace_range.includes("slow");
}

function diversifyTargetProfiles(args: {
  row: SeasonalRowV4;
  regime: DailyRegime;
  surfaceBlocked: boolean;
  profiles: readonly TargetProfile[];
}): { profiles: TargetProfile[]; diversified: boolean; reason?: string } {
  const { row, regime, surfaceBlocked, profiles } = args;
  if (profiles.length < 3) {
    return { profiles: [...profiles], diversified: false };
  }
  if (isColdConservativeRow(row, regime)) {
    return {
      profiles: [...profiles],
      diversified: false,
      reason: "cold_conservative_row",
    };
  }

  const [first, second, third] = profiles;
  if (first == null || second == null || third == null) {
    return { profiles: [...profiles], diversified: false };
  }
  const firstTwoDuplicateLane = profileKey(first) === profileKey(second);
  const firstTwoDuplicateColumn = first.column === second.column;
  if (!firstTwoDuplicateLane && !firstTwoDuplicateColumn) {
    return { profiles: [...profiles], diversified: false };
  }

  const legalColumns = effectiveLegalColumns({ row, surfaceBlocked });
  const legalPaces = row.pace_range;
  if (legalColumns.length <= 1 && legalPaces.length <= 1) {
    return {
      profiles: [...profiles],
      diversified: false,
      reason: "narrow_lane",
    };
  }

  const usedLanes = new Set([profileKey(first), profileKey(second)]);
  const candidates: TargetProfile[] = [
    ...adjacentPaces(second.pace, legalPaces).map((pace) => ({
      column: second.column,
      pace,
    })),
    ...adjacentColumns(second.column, legalColumns).map((column) => ({
      column,
      pace: second.pace,
    })),
    ...adjacentColumns(second.column, legalColumns).flatMap((column) =>
      adjacentPaces(second.pace, legalPaces).map((pace) => ({ column, pace }))
    ),
  ];

  for (const candidate of candidates) {
    if (usedLanes.has(profileKey(candidate))) continue;
    if (candidate.column === "surface") {
      const surfaceLegal = row.column_range.includes("surface") &&
        row.surface_seasonally_possible &&
        !surfaceBlocked;
      if (!surfaceLegal) continue;
    }
    return {
      profiles: [first, second, candidate],
      diversified: profileKey(candidate) !== profileKey(third),
      reason: "third_slot_diversified",
    };
  }

  return {
    profiles: [...profiles],
    diversified: false,
    reason: "no_legal_alternative",
  };
}

function paceCompatible(
  profilePace: TacticalPace,
  archetype: ArchetypeProfileV4,
) {
  return archetype.primary_pace === profilePace ||
    archetype.secondary_pace === profilePace ||
    Math.abs(paceIndex(archetype.primary_pace) - paceIndex(profilePace)) ===
      1 ||
    (archetype.secondary_pace != null &&
      Math.abs(paceIndex(archetype.secondary_pace) - paceIndex(profilePace)) ===
        1);
}

function laneCatalogCandidates(args: {
  side: Side;
  species: SeasonalRowV4["species"];
  water_type: SeasonalRowV4["water_type"];
  column: TacticalColumn;
  pace: TacticalPace;
}) {
  const catalog = args.side === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4;
  return catalog.filter((candidate) =>
    candidate.species_allowed.includes(args.species) &&
    candidate.water_types_allowed.includes(args.water_type) &&
    candidate.column === args.column &&
    paceCompatible(args.pace, candidate)
  );
}

function laneGapRecommendation(args: {
  lane: LaneGap;
  observedInProfiles: boolean;
  coldBottomSlow: boolean;
}): string {
  const { lane, observedInProfiles, coldBottomSlow } = args;
  if (coldBottomSlow && lane.column === "bottom" && lane.pace === "slow") {
    return "honest narrow winter lane; accept repeat";
  }
  if (lane.lure_presentation_groups < 3 && lane.fly_presentation_groups < 3) {
    return "catalog expansion needed";
  }
  if (observedInProfiles) return "profile diversification can help";
  if (lane.lure_presentation_groups < 3 || lane.fly_presentation_groups < 3) {
    return "row/menu audit needed";
  }
  return "do nothing";
}

function buildLaneGaps(observedLanes: ReadonlySet<string>): LaneGap[] {
  const speciesValues = unique(ALL_ROWS.map((row) => row.species));
  const waterValues = unique(ALL_ROWS.map((row) => row.water_type));
  const gaps: LaneGap[] = [];
  for (const species of speciesValues) {
    for (const water_type of waterValues) {
      for (const column of COLUMN_ORDER) {
        for (const pace of PACES) {
          const lureCandidates = laneCatalogCandidates({
            side: "lure",
            species,
            water_type,
            column,
            pace,
          });
          const flyCandidates = laneCatalogCandidates({
            side: "fly",
            species,
            water_type,
            column,
            pace,
          });
          const lane = `${species}|${water_type}|${column}|${pace}`;
          const lureGroups = unique(
            lureCandidates.map((c) => c.presentation_group),
          );
          const flyGroups = unique(
            flyCandidates.map((c) => c.presentation_group),
          );
          const surfaceGroups = column === "surface"
            ? unique([...lureGroups, ...flyGroups]).length
            : undefined;
          if (
            lureGroups.length >= 3 &&
            flyGroups.length >= 3 &&
            (surfaceGroups == null || surfaceGroups >= 3)
          ) {
            continue;
          }
          const gap: LaneGap = {
            lane,
            species,
            water_type,
            column,
            pace,
            lure_presentation_groups: lureGroups.length,
            lure_family_groups: unique(lureCandidates.map((c) =>
              c.family_group
            )).length,
            fly_presentation_groups: flyGroups.length,
            fly_family_groups: unique(flyCandidates.map((c) =>
              c.family_group
            )).length,
            combined_surface_presentation_groups: surfaceGroups,
            recommendation: "",
          };
          gap.recommendation = laneGapRecommendation({
            lane: gap,
            observedInProfiles: observedLanes.has(lane),
            coldBottomSlow: false,
          });
          gaps.push(gap);
        }
      }
    }
  }
  return gaps;
}

function validatePicks(args: {
  row: SeasonalRowV4;
  side: Side;
  picks: readonly RebuildSlotPick[];
  surfaceBlocked: boolean;
}) {
  const excluded = new Set<string>(
    args.side === "lure"
      ? (args.row.excluded_lure_ids ?? [])
      : (args.row.excluded_fly_ids ?? []),
  );
  const samples: unknown[] = [];
  const seenIds = new Set<string>();
  for (const pick of args.picks) {
    const { archetype, profile } = pick;
    if (seenIds.has(archetype.id)) {
      samples.push({
        reason: "duplicate_id",
        side: args.side,
        id: archetype.id,
      });
    }
    seenIds.add(archetype.id);
    if (!archetype.species_allowed.includes(args.row.species)) {
      samples.push({ reason: "species", side: args.side, id: archetype.id });
    }
    if (!archetype.water_types_allowed.includes(args.row.water_type)) {
      samples.push({ reason: "water", side: args.side, id: archetype.id });
    }
    if (archetype.column !== profile.column) {
      samples.push({
        reason: "column",
        side: args.side,
        id: archetype.id,
        profile,
      });
    }
    if (args.surfaceBlocked && archetype.is_surface) {
      samples.push({
        reason: "surface_blocked",
        side: args.side,
        id: archetype.id,
      });
    }
    if (excluded.has(archetype.id)) {
      samples.push({ reason: "excluded", side: args.side, id: archetype.id });
    }
  }
  return samples;
}

function runCell(args: {
  row: SeasonalRowV4;
  profileMode: ProfileMode;
  clarity: WaterClarity;
  regime: DailyRegime;
  windBand: WindBand;
  localDate: string;
}): CellRun {
  const env_data = envForWind(args.localDate, args.windBand);
  const daylightWindMph = meanDaylightWindMph({
    env_data,
    local_date: args.localDate,
    local_timezone: "UTC",
  });
  const surfaceBlocked = computeSurfaceBlocked({
    row: args.row,
    daylightWindMph,
  });
  const baseProfiles = buildTargetProfiles({
    row: args.row,
    regime: args.regime,
    surfaceBlocked,
  });
  const diversified = diversifyTargetProfiles({
    row: args.row,
    regime: args.regime,
    surfaceBlocked,
    profiles: baseProfiles,
  });
  const profiles = args.profileMode === "current_profiles"
    ? baseProfiles
    : diversified.profiles;
  const surfaceOpen = args.row.column_range.includes("surface") &&
    args.row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((p) => p.column === "surface");
  const wind_band = windBandFromDaylightWindMph(daylightWindMph);
  const seedBase = `audit|${
    regimeToHows0to100(args.regime)
  }|${args.localDate}|${args.row.region_key}|${args.row.species}|${args.row.water_type}|${args.clarity}|${args.windBand}`;
  const lureConditionState: LureDailyConditionState = {
    regime: args.regime,
    water_clarity: args.clarity,
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime: args.regime,
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
    species: args.row.species,
    context: args.row.water_type,
    month: args.row.month,
  };
  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];
  const lurePicks = selectArchetypesForSide({
    side: "lure",
    row: args.row,
    species: args.row.species,
    context: args.row.water_type,
    water_clarity: args.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: args.localDate,
    lureConditionState,
    onSlotTrace: (trace) => lureTraces.push(trace),
  });
  const flyPicks = selectArchetypesForSide({
    side: "fly",
    row: args.row,
    species: args.row.species,
    context: args.row.water_type,
    water_clarity: args.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: args.localDate,
    flyConditionState,
    onSlotTrace: (trace) => flyTraces.push(trace),
  });
  return {
    row: args.row,
    profiles,
    lurePicks,
    flyPicks,
    lureTraces,
    flyTraces,
    surfaceBlocked,
    surfaceOpen,
    diversified: args.profileMode === "diversified_profiles" &&
      diversified.diversified,
  };
}

function accumulateMode(
  acc: ModeAcc,
  base: CellRun,
  next: CellRun,
) {
  acc.cells++;
  const lureGroups = base.lurePicks.map((pick) =>
    pick.archetype.presentation_group
  );
  const flyGroups = base.flyPicks.map((pick) =>
    pick.archetype.presentation_group
  );
  const lureFamilies = base.lurePicks.map((pick) =>
    pick.archetype.family_group
  );
  const flyFamilies = base.flyPicks.map((pick) => pick.archetype.family_group);
  if (
    duplicateValues(lureGroups).length > 0 ||
    duplicateValues(flyGroups).length > 0
  ) {
    acc.repeatedPresentationCells++;
  }
  if (
    duplicateValues(lureFamilies).length > 0 ||
    duplicateValues(flyFamilies).length > 0
  ) {
    acc.repeatedFamilyCells++;
  }
  if (base.lurePicks[0]?.archetype.id === next.lurePicks[0]?.archetype.id) {
    acc.adjacentSameTopLureCells++;
  }
  if (base.flyPicks[0]?.archetype.id === next.flyPicks[0]?.archetype.id) {
    acc.adjacentSameTopFlyCells++;
  }
  if (
    base.lurePicks.length === 3 && next.lurePicks.length === 3 &&
    base.lurePicks.map((p) => p.archetype.id).join("|") ===
      next.lurePicks.map((p) => p.archetype.id).join("|")
  ) {
    acc.adjacentSameLureTripleCells++;
  }
  if (
    base.flyPicks.length === 3 && next.flyPicks.length === 3 &&
    base.flyPicks.map((p) => p.archetype.id).join("|") ===
      next.flyPicks.map((p) => p.archetype.id).join("|")
  ) {
    acc.adjacentSameFlyTripleCells++;
  }
  if (base.diversified) acc.diversifiedCells++;

  const southernFrogContext = base.row.species === "largemouth_bass" &&
    SOUTHERN_LMB_LAKE_REGIONS.has(base.row.region_key) &&
    base.row.water_type === "freshwater_lake_pond" &&
    base.row.month >= 3 &&
    base.row.month <= 10 &&
    base.row.surface_seasonally_possible &&
    base.surfaceOpen &&
    base.profiles.some((profile) => profile.column === "surface");
  if (southernFrogContext) {
    acc.southernFrogSurfaceSlotContextCells++;
    if (
      base.lureTraces.some((trace) =>
        trace.profile.column === "surface" &&
        trace.candidateScores.some((score) => score.id === "hollow_body_frog")
      ) ||
      base.flyTraces.some((trace) =>
        trace.profile.column === "surface" &&
        trace.candidateScores.some((score) => score.id === "frog_fly")
      )
    ) {
      acc.southernFrogCandidateCells++;
    }
    if (
      base.lureTraces.some((trace) =>
        trace.profile.column === "surface" &&
        trace.finalistIds.includes("hollow_body_frog")
      ) ||
      base.flyTraces.some((trace) =>
        trace.profile.column === "surface" &&
        trace.finalistIds.includes("frog_fly")
      )
    ) {
      acc.southernFrogFinalistCells++;
    }
    if (
      base.lurePicks.some((pick) => pick.archetype.id === "hollow_body_frog") ||
      base.flyPicks.some((pick) => pick.archetype.id === "frog_fly")
    ) {
      acc.southernFrogPickCells++;
    }
  }

  const invalid = [
    ...validatePicks({
      row: base.row,
      side: "lure",
      picks: base.lurePicks,
      surfaceBlocked: base.surfaceBlocked,
    }),
    ...validatePicks({
      row: base.row,
      side: "fly",
      picks: base.flyPicks,
      surfaceBlocked: base.surfaceBlocked,
    }),
  ];
  if (invalid.length > 0) {
    acc.invalidPickCells++;
    if (acc.invalidPickSamples.length < 50) {
      acc.invalidPickSamples.push(...invalid);
      acc.invalidPickSamples = acc.invalidPickSamples.slice(0, 50);
    }
  }
}

function modeMetrics(acc: ModeAcc) {
  return {
    cells: acc.cells,
    repeated_presentation_group_rate_pct: pct(
      acc.repeatedPresentationCells,
      acc.cells,
    ),
    repeated_presentation_group_cells: acc.repeatedPresentationCells,
    repeated_family_group_rate_pct: pct(acc.repeatedFamilyCells, acc.cells),
    repeated_family_group_cells: acc.repeatedFamilyCells,
    adjacent_same_top_lure_rate_pct: pct(
      acc.adjacentSameTopLureCells,
      acc.cells,
    ),
    adjacent_same_top_fly_rate_pct: pct(acc.adjacentSameTopFlyCells, acc.cells),
    adjacent_same_lure_triple_rate_pct: pct(
      acc.adjacentSameLureTripleCells,
      acc.cells,
    ),
    adjacent_same_fly_triple_rate_pct: pct(
      acc.adjacentSameFlyTripleCells,
      acc.cells,
    ),
    southern_lmb_frog_candidate_rate_when_surface_slot: pct(
      acc.southernFrogCandidateCells,
      acc.southernFrogSurfaceSlotContextCells,
    ),
    southern_lmb_frog_finalist_rate_when_surface_slot: pct(
      acc.southernFrogFinalistCells,
      acc.southernFrogSurfaceSlotContextCells,
    ),
    southern_lmb_frog_pick_rate_when_surface_slot: pct(
      acc.southernFrogPickCells,
      acc.southernFrogSurfaceSlotContextCells,
    ),
    southern_lmb_frog_surface_slot_context_cells:
      acc.southernFrogSurfaceSlotContextCells,
    invalid_pick_cells: acc.invalidPickCells,
    invalid_pick_samples: acc.invalidPickSamples,
    diversified_profile_cells: acc.diversifiedCells,
    diversified_profile_rate_pct: pct(acc.diversifiedCells, acc.cells),
  };
}

function bucketKey(row: SeasonalRowV4, regime: DailyRegime) {
  return `${row.species}|${row.region_key}|${row.water_type}|${row.month}|${regime}`;
}

function accumulateDuplicateBucket(
  map: Map<string, DuplicateProfileAcc>,
  key: string,
  profiles: readonly TargetProfile[],
  diversified: boolean,
  repeated: boolean,
) {
  const acc = map.get(key) ?? emptyDuplicateAcc();
  const info = duplicateProfileInfo(profiles);
  acc.cells++;
  if (info.duplicateLaneCount > 0) acc.duplicateLaneCells++;
  if (info.duplicateColumnCount > 0) acc.duplicateColumnCells++;
  if (diversified) acc.diversifiedCells++;
  if (repeated) acc.repeatedPresentationCells++;
  map.set(key, acc);
}

function duplicateBucketMetrics(map: Map<string, DuplicateProfileAcc>) {
  return [...map.entries()]
    .map(([bucket, acc]) => ({
      bucket,
      cells: acc.cells,
      duplicate_lane_rate_pct: pct(acc.duplicateLaneCells, acc.cells),
      duplicate_column_rate_pct: pct(acc.duplicateColumnCells, acc.cells),
      diversified_rate_pct: pct(acc.diversifiedCells, acc.cells),
      repeated_presentation_group_rate_pct: pct(
        acc.repeatedPresentationCells,
        acc.cells,
      ),
    }))
    .sort((a, b) =>
      b.duplicate_lane_rate_pct - a.duplicate_lane_rate_pct ||
      b.duplicate_column_rate_pct - a.duplicate_column_rate_pct ||
      b.repeated_presentation_group_rate_pct -
        a.repeated_presentation_group_rate_pct
    )
    .slice(0, 30);
}

function main() {
  const generated_at = new Date().toISOString();
  const unscopedRows = ALL_ROWS.filter((row) =>
    row.state_code == null || String(row.state_code).trim() === ""
  );
  const modeAcc: Record<ProfileMode, ModeAcc> = {
    current_profiles: emptyModeAcc(),
    diversified_profiles: emptyModeAcc(),
  };
  const duplicateBuckets = new Map<string, DuplicateProfileAcc>();
  const observedLanes = new Set<string>();

  for (const [rowIndex, row] of unscopedRows.entries()) {
    if (rowIndex % 100 === 0) {
      console.error(
        `profile-geometry audit progress: row ${
          rowIndex + 1
        }/${unscopedRows.length}`,
      );
    }
    const localDate = `2026-${String(row.month).padStart(2, "0")}-15`;
    const nextDate = nextLocalDate(localDate);
    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windBand of WIND_PROFILES) {
          for (const mode of PROFILE_MODES) {
            const base = runCell({
              row,
              profileMode: mode,
              clarity,
              regime,
              windBand,
              localDate,
            });
            const next = runCell({
              row,
              profileMode: mode,
              clarity,
              regime,
              windBand,
              localDate: nextDate,
            });
            accumulateMode(modeAcc[mode], base, next);
            for (const profile of base.profiles) {
              observedLanes.add(
                `${row.species}|${row.water_type}|${profile.column}|${profile.pace}`,
              );
            }
            if (mode === "current_profiles") {
              const repeated = duplicateValues([
                    ...base.lurePicks.map((pick) =>
                      pick.archetype.presentation_group
                    ),
                    ...base.flyPicks.map((pick) =>
                      pick.archetype.presentation_group
                    ),
                  ]).length > 0 ||
                duplicateValues(
                    base.lurePicks.map((pick) =>
                      pick.archetype.presentation_group
                    ),
                  ).length > 0 ||
                duplicateValues(
                    base.flyPicks.map((pick) =>
                      pick.archetype.presentation_group
                    ),
                  ).length > 0;
              accumulateDuplicateBucket(
                duplicateBuckets,
                bucketKey(row, regime),
                base.profiles,
                false,
                repeated,
              );
            }
          }
        }
      }
    }
  }

  const metrics = {
    current_profiles: modeMetrics(modeAcc.current_profiles),
    diversified_profiles: modeMetrics(modeAcc.diversified_profiles),
  };
  const laneGaps = buildLaneGaps(observedLanes);
  const report = {
    generated_at,
    matrix: {
      rows_scanned: unscopedRows.length,
      cells_per_mode: modeAcc.current_profiles.cells,
      clarities: CLARITIES,
      regimes: REGIMES,
      wind_profiles: WIND_PROFILES,
    },
    metrics,
    deltas_diversified_minus_current: {
      repeated_presentation_group_rate_pct:
        metrics.diversified_profiles.repeated_presentation_group_rate_pct -
        metrics.current_profiles.repeated_presentation_group_rate_pct,
      repeated_family_group_rate_pct:
        metrics.diversified_profiles.repeated_family_group_rate_pct -
        metrics.current_profiles.repeated_family_group_rate_pct,
      adjacent_same_top_lure_rate_pct:
        metrics.diversified_profiles.adjacent_same_top_lure_rate_pct -
        metrics.current_profiles.adjacent_same_top_lure_rate_pct,
      adjacent_same_top_fly_rate_pct:
        metrics.diversified_profiles.adjacent_same_top_fly_rate_pct -
        metrics.current_profiles.adjacent_same_top_fly_rate_pct,
      southern_lmb_frog_pick_rate_when_surface_slot:
        metrics.diversified_profiles
          .southern_lmb_frog_pick_rate_when_surface_slot -
        metrics.current_profiles.southern_lmb_frog_pick_rate_when_surface_slot,
    },
    worst_duplicate_profile_buckets: duplicateBucketMetrics(duplicateBuckets),
    catalog_lane_gaps: laneGaps,
    catalog_lane_gap_summary: {
      total_flagged_lanes: laneGaps.length,
      lure_fewer_than_3_pg:
        laneGaps.filter((gap) => gap.lure_presentation_groups < 3).length,
      fly_fewer_than_3_pg:
        laneGaps.filter((gap) => gap.fly_presentation_groups < 3).length,
      surface_fewer_than_3_combined_pg:
        laneGaps.filter((gap) =>
          gap.column === "surface" &&
          (gap.combined_surface_presentation_groups ?? 0) < 3
        ).length,
      recommendations: Object.fromEntries(
        Object.entries(
          laneGaps.reduce<Record<string, number>>((acc, gap) => {
            acc[gap.recommendation] = (acc[gap.recommendation] ?? 0) + 1;
            return acc;
          }, {}),
        ).sort((a, b) => b[1] - a[1]),
      ),
    },
    recommendation:
      "Do not change production shapeProfiles yet. The conservative diversified third-profile prototype does not materially improve global repeat rates; the next implementation should be a targeted shapeProfiles experiment only if scoped to high-duplicate non-winter buckets, alongside catalog expansion planning for thin surface and species-specific lanes.",
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));

  const current = metrics.current_profiles;
  const diversified = metrics.diversified_profiles;
  const md: string[] = [];
  md.push("# Recommender rebuild — profile geometry and catalog gap analysis");
  md.push("");
  md.push(`Generated: **${generated_at}**`);
  md.push("");
  md.push("## Executive Conclusion");
  md.push("");
  md.push(
    "The prototype diversified only the third profile when the first two profiles were already too similar, but it did not materially reduce global repeats. Duplicate profile geometry is common and often intentional posture preservation, while many remaining repeat lanes are catalog-thin enough that profile changes alone cannot guarantee three distinct macro presentations.",
  );
  md.push("");
  md.push("## Current vs Diversified-Profile Metrics");
  md.push("");
  md.push("| Metric | Current profiles | Diversified prototype | Delta |");
  md.push("| --- | ---: | ---: | ---: |");
  const metricRow = (label: string, key: keyof typeof current, suffix = "") => {
    const cur = current[key] as number;
    const div = diversified[key] as number;
    md.push(
      `| ${label} | ${cur}${suffix} | ${div}${suffix} | ${
        Math.round((div - cur) * 100) / 100
      }${suffix} |`,
    );
  };
  metricRow(
    "Repeated presentation-group rate",
    "repeated_presentation_group_rate_pct",
    "%",
  );
  metricRow(
    "Repeated family-group rate",
    "repeated_family_group_rate_pct",
    "%",
  );
  metricRow("Adjacent same top lure", "adjacent_same_top_lure_rate_pct", "%");
  metricRow("Adjacent same top fly", "adjacent_same_top_fly_rate_pct", "%");
  metricRow(
    "Southern LMB frog candidate rate",
    "southern_lmb_frog_candidate_rate_when_surface_slot",
    "%",
  );
  metricRow(
    "Southern LMB frog finalist rate",
    "southern_lmb_frog_finalist_rate_when_surface_slot",
    "%",
  );
  metricRow(
    "Southern LMB frog pick rate",
    "southern_lmb_frog_pick_rate_when_surface_slot",
    "%",
  );
  metricRow("Invalid-pick cells", "invalid_pick_cells");
  metricRow("Diversified profile cells", "diversified_profile_cells");
  md.push("");
  md.push("## Worst Duplicate-Profile Buckets");
  md.push("");
  for (const bucket of report.worst_duplicate_profile_buckets.slice(0, 15)) {
    md.push(
      `- ${bucket.bucket}: duplicate lanes ${bucket.duplicate_lane_rate_pct}%, duplicate columns ${bucket.duplicate_column_rate_pct}%, repeated PG ${bucket.repeated_presentation_group_rate_pct}%`,
    );
  }
  md.push("");
  md.push("## Catalog Lane Gaps");
  md.push("");
  md.push(
    `- Flagged lanes: **${report.catalog_lane_gap_summary.total_flagged_lanes}**.`,
  );
  md.push(
    `- Lure lanes with <3 presentation groups: **${report.catalog_lane_gap_summary.lure_fewer_than_3_pg}**.`,
  );
  md.push(
    `- Fly lanes with <3 presentation groups: **${report.catalog_lane_gap_summary.fly_fewer_than_3_pg}**.`,
  );
  md.push(
    `- Surface lanes with <3 combined presentation groups: **${report.catalog_lane_gap_summary.surface_fewer_than_3_combined_pg}**.`,
  );
  md.push("");
  md.push("### Recommended Actions By Lane Type");
  md.push("");
  for (
    const [recommendation, count] of Object.entries(
      report.catalog_lane_gap_summary.recommendations,
    )
  ) {
    md.push(`- ${recommendation}: ${count}`);
  }
  md.push("");
  md.push("### Sample Flagged Lanes");
  md.push("");
  md.push("| Lane | Lure PG | Fly PG | Surface combined PG | Recommendation |");
  md.push("| --- | ---: | ---: | ---: | --- |");
  for (const gap of laneGaps.slice(0, 30)) {
    md.push(
      `| ${gap.lane} | ${gap.lure_presentation_groups} | ${gap.fly_presentation_groups} | ${
        gap.combined_surface_presentation_groups ?? ""
      } | ${gap.recommendation} |`,
    );
  }
  md.push("");
  md.push("## Recommended Production Changes");
  md.push("");
  md.push(
    "Do not change `shapeProfiles.ts` globally in the next pass. The audit supports a narrower follow-up: identify high-repeat non-winter buckets where a third-profile adjustment improves metrics without hurting frogs/surface or adjacent-date variety, and separately plan catalog expansion for thin lanes. The next production pass should not change catalog eligibility, but it may add a highly targeted shape profile rule only after a focused fixture proves improvement.",
  );
  md.push("");
  md.push("## Change Direction");
  md.push("");
  md.push(
    "- `shapeProfiles.ts`: not yet globally; only targeted fixture-backed experiment next.",
  );
  md.push(
    "- Catalog archetypes: likely needed for some lanes, but not as an eligibility change in the next pass.",
  );
  md.push("- Both: eventually, but not in one broad production change.");
  md.push(
    "- Neither: acceptable if repeat-rate reduction is less important than preserving the current biological posture.",
  );
  md.push("");
  md.push(`Full machine-readable report: \`${JSON_PATH}\`.`);

  Deno.writeTextFileSync(MD_PATH, md.join("\n") + "\n");
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(
    `Current repeated PG: ${current.repeated_presentation_group_rate_pct}%; diversified: ${diversified.repeated_presentation_group_rate_pct}%`,
  );
}

main();
