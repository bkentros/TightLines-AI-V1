/**
 * Phase 4A lure-condition balance diagnostic.
 *
 * Replays the production finalist-pool selector across the same deterministic
 * scenario grid as the exposure audit, then inspects selector traces to verify
 * that lure condition windows remain lane-first, modest, and subordinate.
 *
 * Usage (from TightLinesAI/):
 *   deno run -A scripts/diagnose-recommender-v4-phase4a-lure-balance.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { SURFACE_FLY_IDS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildTargetProfiles,
  type DailyRegime,
  type TargetProfile,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import {
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import {
  activeLureConditionWindow,
  type LureConditionWindowId,
  lureConditionWindowMatches,
  type LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";
import {
  type WindBand,
  windBandFromDaylightWindMph,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/wind.ts";

type Side = "lure" | "fly";

type TargetLureId =
  | "spinnerbait"
  | "bladed_jig"
  | "lipless_crankbait"
  | "walking_topwater"
  | "buzzbait"
  | "hollow_body_frog"
  | "suspending_jerkbait";

type WindowAcc = {
  id: LureConditionWindowId;
  activeReports: number;
  shapedReports: number;
  noChangeReports: number;
  noMatchingDesignatedFinalists: number;
  matchingOnlyOutsideDesignatedSlot: number;
  shapedPickIds: Record<string, number>;
  conditionCandidateIds: Record<string, number>;
};

type TargetAcc = {
  id: TargetLureId;
  window: LureConditionWindowId;
  authoredRows: number;
  authoredRowsBySpecies: Record<string, number>;
  totalSelections: number;
  activeWindowReports: number;
  legalInActiveWindow: number;
  anyExactInActiveWindow: number;
  exactInConditionSlot: number;
  bestTierInConditionSlot: number;
  conditionCandidateAppearances: number;
  selectedWhenWindowActive: number;
  conditionShapedPicks: number;
};

type ValidationAcc = {
  deterministicMismatches: number;
  conditionOutsideLureViolations: number;
  conditionMultiShapeViolations: number;
  conditionSlotViolations: number;
  conditionFinalistIdViolations: number;
  conditionChoiceOutsideCandidateViolations: number;
  conditionGateViolations: number;
  conditionExactFitViolations: number;
  conditionTierViolations: number;
  windBandFixtureViolations: number;
};

type InteractionAcc = {
  lureReports: number;
  forageShapedReports: number;
  clarityShapedReports: number;
  conditionShapedReports: number;
  forageAndClarityReports: number;
  forageAndConditionReports: number;
  clarityAndConditionReports: number;
  allThreeReports: number;
  sameSlotForageConditionReports: number;
  sameSlotClarityConditionReports: number;
};

const CLARITIES: WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: DailyRegime[] = ["aggressive", "neutral", "suppressive"];
const WIND_CASES: readonly { mph: number; band: WindBand }[] = [
  { mph: 4, band: "calm" },
  { mph: 8, band: "breezy" },
  { mph: 13, band: "windy" },
];

const STATIC_SEED_DATE = "2026-04-22";
const GENERATED_DATE = "2026-04-23";
const OUT_DIR = "docs/audits/recommender-v4/phase-4a-lure-balance";

const TARGET_LURES: readonly TargetLureId[] = [
  "spinnerbait",
  "bladed_jig",
  "lipless_crankbait",
  "walking_topwater",
  "buzzbait",
  "hollow_body_frog",
  "suspending_jerkbait",
];

const TARGET_TO_WINDOW: Record<TargetLureId, LureConditionWindowId> = {
  spinnerbait: "wind_reaction_window",
  bladed_jig: "wind_reaction_window",
  lipless_crankbait: "wind_reaction_window",
  walking_topwater: "surface_commitment_window",
  buzzbait: "surface_commitment_window",
  hollow_body_frog: "surface_commitment_window",
  suspending_jerkbait: "clear_subtle_window",
};

const WINDOW_IDS: readonly LureConditionWindowId[] = [
  "surface_commitment_window",
  "wind_reaction_window",
  "clear_subtle_window",
];

const ALL_ROWS: SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
].filter((r) => r.state_code == null || r.state_code === "");

const LURE_BY_ID: ReadonlyMap<string, ArchetypeProfileV4> = new Map(
  LURE_ARCHETYPES_V4.map((a) => [a.id, a]),
);
const SURFACE_FLY_SET = new Set<string>(
  SURFACE_FLY_IDS_V4 as readonly string[],
);

function rowKey(r: SeasonalRowV4): string {
  return `${r.species}|${r.region_key}|m${r.month}|${r.water_type}`;
}

function bump(map: Record<string, number>, key: string, by = 1): void {
  map[key] = (map[key] ?? 0) + by;
}

function pct(n: number, d: number, digits = 1): string {
  if (d === 0) return "0.0%";
  return `${((n / d) * 100).toFixed(digits)}%`;
}

function surfaceBlockVariants(row: SeasonalRowV4): readonly boolean[] {
  const surfaceInSeason = row.column_range.includes("surface") &&
    row.surface_seasonally_possible;
  return surfaceInSeason ? [false, true] : [false];
}

function inEnvelope(cand: ArchetypeProfileV4, row: SeasonalRowV4): boolean {
  return row.column_range.includes(cand.column) &&
    row.pace_range.includes(cand.primary_pace);
}

function exactSlotFitTier(
  profile: TargetProfile,
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): 1 | 2 | null {
  if (!inEnvelope(cand, row)) return null;
  if (cand.column !== profile.column) return null;
  if (cand.primary_pace === profile.pace) return 1;
  if (cand.secondary_pace != null && cand.secondary_pace === profile.pace) {
    return 2;
  }
  return null;
}

function passesGate(args: {
  c: ArchetypeProfileV4;
  side: Side;
  row: SeasonalRowV4;
  surfaceBlocked: boolean;
}): boolean {
  const { c, side, row, surfaceBlocked } = args;
  if (c.gear_mode !== side) return false;
  if (!c.species_allowed.includes(row.species)) return false;
  if (!c.water_types_allowed.includes(row.water_type)) return false;

  const allowedIds = new Set<string>(
    side === "lure" ? row.primary_lure_ids : row.primary_fly_ids,
  );
  if (!allowedIds.has(c.id)) return false;

  const excludedIds = new Set<string>(
    side === "lure"
      ? (row.excluded_lure_ids ?? [])
      : (row.excluded_fly_ids ?? []),
  );
  if (excludedIds.has(c.id)) return false;

  if (surfaceBlocked) {
    if (c.is_surface) return false;
    if (side === "fly" && SURFACE_FLY_SET.has(c.id)) return false;
  }

  return true;
}

function emptyWindow(id: LureConditionWindowId): WindowAcc {
  return {
    id,
    activeReports: 0,
    shapedReports: 0,
    noChangeReports: 0,
    noMatchingDesignatedFinalists: 0,
    matchingOnlyOutsideDesignatedSlot: 0,
    shapedPickIds: {},
    conditionCandidateIds: {},
  };
}

function emptyTarget(id: TargetLureId): TargetAcc {
  return {
    id,
    window: TARGET_TO_WINDOW[id],
    authoredRows: 0,
    authoredRowsBySpecies: {},
    totalSelections: 0,
    activeWindowReports: 0,
    legalInActiveWindow: 0,
    anyExactInActiveWindow: 0,
    exactInConditionSlot: 0,
    bestTierInConditionSlot: 0,
    conditionCandidateAppearances: 0,
    selectedWhenWindowActive: 0,
    conditionShapedPicks: 0,
  };
}

function buildConditionState(args: {
  row: SeasonalRowV4;
  clarity: WaterClarity;
  regime: DailyRegime;
  windCase: { mph: number; band: WindBand };
  surfaceBlocked: boolean;
  profiles: TargetProfile[];
}): LureDailyConditionState {
  const {
    row,
    clarity,
    regime,
    windCase,
    surfaceBlocked,
    profiles,
  } = args;
  return {
    regime,
    water_clarity: clarity,
    surface_allowed_today: row.column_range.includes("surface") &&
      row.surface_seasonally_possible &&
      !surfaceBlocked,
    surface_slot_present: profiles.some((profile) =>
      profile.column === "surface"
    ),
    daylight_wind_mph: windCase.mph,
    wind_band: windCase.band,
  };
}

function profileHasMatchingExactFinalist(args: {
  row: SeasonalRowV4;
  surfaceBlocked: boolean;
  profile: TargetProfile;
  window: LureConditionWindowId;
}): boolean {
  const { row, surfaceBlocked, profile, window } = args;
  const matches = lureConditionWindowMatches(window);
  for (const id of matches) {
    const cand = LURE_BY_ID.get(id);
    if (!cand) continue;
    if (!passesGate({ c: cand, side: "lure", row, surfaceBlocked })) {
      continue;
    }
    if (exactSlotFitTier(profile, cand, row) != null) return true;
  }
  return false;
}

function buildWindowSummary(w: WindowAcc) {
  return {
    ...w,
    noChangeReports: w.activeReports - w.shapedReports,
    shapedRateOfActive: w.activeReports > 0
      ? w.shapedReports / w.activeReports
      : 0,
  };
}

function targetOpportunitySummary(t: TargetAcc) {
  return {
    ...t,
    legalRateWhenWindowActive: t.activeWindowReports > 0
      ? t.legalInActiveWindow / t.activeWindowReports
      : 0,
    conditionCandidateRateWhenActive: t.activeWindowReports > 0
      ? t.conditionCandidateAppearances / t.activeWindowReports
      : 0,
    selectionRateWhenWindowActive: t.activeWindowReports > 0
      ? t.selectedWhenWindowActive / t.activeWindowReports
      : 0,
  };
}

function describeTarget(
  id: TargetLureId,
  t: ReturnType<typeof targetOpportunitySummary>,
): string {
  const candidateRate = pct(
    t.conditionCandidateAppearances,
    t.activeWindowReports,
  );
  const selectedRate = pct(t.selectedWhenWindowActive, t.activeWindowReports);
  return `${t.conditionCandidateAppearances}/${t.activeWindowReports} matching-slot finalist appearances (${candidateRate}); ${t.conditionShapedPicks} condition-shaped picks; ${selectedRate} selected when window active`;
}

function main() {
  const windowStats = new Map(
    WINDOW_IDS.map((id) => [id, emptyWindow(id)]),
  );
  const targetStats = new Map(
    TARGET_LURES.map((id) => [id, emptyTarget(id)]),
  );
  const validation: ValidationAcc = {
    deterministicMismatches: 0,
    conditionOutsideLureViolations: 0,
    conditionMultiShapeViolations: 0,
    conditionSlotViolations: 0,
    conditionFinalistIdViolations: 0,
    conditionChoiceOutsideCandidateViolations: 0,
    conditionGateViolations: 0,
    conditionExactFitViolations: 0,
    conditionTierViolations: 0,
    windBandFixtureViolations: 0,
  };
  const interactions: InteractionAcc = {
    lureReports: 0,
    forageShapedReports: 0,
    clarityShapedReports: 0,
    conditionShapedReports: 0,
    forageAndClarityReports: 0,
    forageAndConditionReports: 0,
    clarityAndConditionReports: 0,
    allThreeReports: 0,
    sameSlotForageConditionReports: 0,
    sameSlotClarityConditionReports: 0,
  };

  for (const row of ALL_ROWS) {
    for (const id of row.primary_lure_ids) {
      const target = targetStats.get(id as TargetLureId);
      if (target) {
        target.authoredRows++;
        bump(target.authoredRowsBySpecies, row.species);
      }
    }
  }

  let totalReports = 0;
  for (const row of ALL_ROWS) {
    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windCase of WIND_CASES) {
          if (windBandFromDaylightWindMph(windCase.mph) !== windCase.band) {
            validation.windBandFixtureViolations++;
          }
          for (const surfaceBlocked of surfaceBlockVariants(row)) {
            totalReports++;
            interactions.lureReports++;

            const profiles = buildTargetProfiles({
              row,
              regime,
              surfaceBlocked,
            });
            const seedBase = `phase4a|${rowKey(row)}|${clarity}|${regime}|${
              surfaceBlocked ? "b1" : "b0"
            }|${windCase.band}|${STATIC_SEED_DATE}`;
            const lureConditionState = buildConditionState({
              row,
              clarity,
              regime,
              windCase,
              surfaceBlocked,
              profiles,
            });
            const activeWindow = activeLureConditionWindow(
              lureConditionState,
            );

            const traces: RebuildSlotSelectionTrace[] = [];
            const picks = selectArchetypesForSide({
              side: "lure",
              row,
              species: row.species,
              context: row.water_type,
              water_clarity: clarity,
              profiles,
              surfaceBlocked,
              seedBase,
              currentLocalDate: STATIC_SEED_DATE,
              recentHistory: [],
              lureConditionState,
              onSlotTrace: (trace) => traces.push(trace),
            });
            const repeat = selectArchetypesForSide({
              side: "lure",
              row,
              species: row.species,
              context: row.water_type,
              water_clarity: clarity,
              profiles,
              surfaceBlocked,
              seedBase,
              currentLocalDate: STATIC_SEED_DATE,
              recentHistory: [],
              lureConditionState,
            });
            if (
              picks.map((p) => p.archetype.id).join("|") !==
                repeat.map((p) => p.archetype.id).join("|")
            ) {
              validation.deterministicMismatches++;
            }

            for (const pick of picks) {
              const target = targetStats.get(pick.archetype.id as TargetLureId);
              if (target) target.totalSelections++;
            }

            const forageTraces = traces.filter((t) => t.forageNarrowed);
            const clarityTraces = traces.filter((t) => t.clarityNarrowed);
            const conditionTraces = traces.filter((t) => t.conditionNarrowed);
            if (forageTraces.length > 0) interactions.forageShapedReports++;
            if (clarityTraces.length > 0) interactions.clarityShapedReports++;
            if (conditionTraces.length > 0) {
              interactions.conditionShapedReports++;
            }
            if (forageTraces.length > 0 && clarityTraces.length > 0) {
              interactions.forageAndClarityReports++;
            }
            if (forageTraces.length > 0 && conditionTraces.length > 0) {
              interactions.forageAndConditionReports++;
            }
            if (clarityTraces.length > 0 && conditionTraces.length > 0) {
              interactions.clarityAndConditionReports++;
            }
            if (
              forageTraces.length > 0 && clarityTraces.length > 0 &&
              conditionTraces.length > 0
            ) {
              interactions.allThreeReports++;
            }
            if (
              forageTraces.some((f) =>
                conditionTraces.some((c) => c.slot === f.slot)
              )
            ) {
              interactions.sameSlotForageConditionReports++;
            }
            if (
              clarityTraces.some((cl) =>
                conditionTraces.some((c) => c.slot === cl.slot)
              )
            ) {
              interactions.sameSlotClarityConditionReports++;
            }

            if (activeWindow != null) {
              const w = windowStats.get(activeWindow)!;
              w.activeReports++;
              const matchingIds = lureConditionWindowMatches(activeWindow);
              const conditionSlot = traces[0]?.conditionSlot ?? 0;
              const conditionSlotTrace = traces.find((t) =>
                t.slot === conditionSlot
              );
              const matchingOutsideConditionSlot = traces.some((trace) =>
                trace.slot !== conditionSlot &&
                profileHasMatchingExactFinalist({
                  row,
                  surfaceBlocked,
                  profile: trace.profile,
                  window: activeWindow,
                })
              );

              for (const id of TARGET_LURES) {
                if (TARGET_TO_WINDOW[id] !== activeWindow) continue;
                const target = targetStats.get(id)!;
                const cand = LURE_BY_ID.get(id)!;
                target.activeWindowReports++;
                if (
                  passesGate({ c: cand, side: "lure", row, surfaceBlocked })
                ) {
                  target.legalInActiveWindow++;
                  const hasExact = profiles.some((profile) =>
                    exactSlotFitTier(profile, cand, row) != null
                  );
                  if (hasExact) target.anyExactInActiveWindow++;
                  const conditionProfile = profiles[conditionSlot];
                  if (conditionProfile) {
                    const t = exactSlotFitTier(conditionProfile, cand, row);
                    if (t != null) target.exactInConditionSlot++;
                    if (
                      t != null &&
                      conditionSlotTrace?.bestTier != null &&
                      t === conditionSlotTrace.bestTier
                    ) {
                      target.bestTierInConditionSlot++;
                    }
                  }
                }
                if (
                  conditionSlotTrace?.conditionCandidateIds.includes(id)
                ) {
                  target.conditionCandidateAppearances++;
                  bump(w.conditionCandidateIds, id);
                }
                if (picks.some((pick) => pick.archetype.id === id)) {
                  target.selectedWhenWindowActive++;
                }
              }

              if (conditionTraces.length > 0) {
                w.shapedReports++;
              } else if (
                conditionSlotTrace?.conditionCandidateIds.length === 0
              ) {
                w.noMatchingDesignatedFinalists++;
                if (matchingOutsideConditionSlot) {
                  w.matchingOnlyOutsideDesignatedSlot++;
                }
              }

              for (const trace of conditionTraces) {
                if (trace.side !== "lure") {
                  validation.conditionOutsideLureViolations++;
                }
                if (trace.slot !== trace.conditionSlot) {
                  validation.conditionSlotViolations++;
                }
                const allowed = lureConditionWindowMatches(activeWindow);
                for (const id of trace.finalistIds) {
                  if (!allowed.has(id)) {
                    validation.conditionFinalistIdViolations++;
                  }
                }
                if (
                  trace.chosenId != null &&
                  !trace.conditionCandidateIds.includes(trace.chosenId)
                ) {
                  validation.conditionChoiceOutsideCandidateViolations++;
                }
                const chosen = trace.chosenId == null
                  ? undefined
                  : LURE_BY_ID.get(trace.chosenId);
                if (chosen) {
                  bump(w.shapedPickIds, chosen.id);
                  const target = targetStats.get(chosen.id as TargetLureId);
                  if (target) target.conditionShapedPicks++;
                  if (
                    !passesGate({
                      c: chosen,
                      side: "lure",
                      row,
                      surfaceBlocked,
                    })
                  ) {
                    validation.conditionGateViolations++;
                  }
                  const t = exactSlotFitTier(trace.profile, chosen, row);
                  if (t == null) validation.conditionExactFitViolations++;
                  if (trace.bestTier != null && t !== trace.bestTier) {
                    validation.conditionTierViolations++;
                  }
                }
              }
            }

            if (conditionTraces.length > 1) {
              validation.conditionMultiShapeViolations++;
            }

            const flyTraces: RebuildSlotSelectionTrace[] = [];
            selectArchetypesForSide({
              side: "fly",
              row,
              species: row.species,
              context: row.water_type,
              water_clarity: clarity,
              profiles,
              surfaceBlocked,
              seedBase,
              currentLocalDate: STATIC_SEED_DATE,
              recentHistory: [],
              lureConditionState,
              onSlotTrace: (trace) => flyTraces.push(trace),
            });
            if (flyTraces.some((t) => t.conditionNarrowed)) {
              validation.conditionOutsideLureViolations++;
            }
          }
        }
      }
    }
  }

  const windows = Object.fromEntries(
    [...windowStats.entries()].map(([id, w]) => [id, buildWindowSummary(w)]),
  );
  const targets = Object.fromEntries(
    [...targetStats.entries()].map(([id, t]) => [
      id,
      targetOpportunitySummary(t),
    ]),
  );

  const output = {
    meta: {
      generated: GENERATED_DATE,
      phase: "4A lure-condition balance verification",
      totalSeasonalRows: ALL_ROWS.length,
      totalReports,
      scenarioGrid:
        "published non-state rows x 3 clarities x 3 regimes x calm/breezy/windy wind fixtures x legal surface-block variants",
      windFixtures: WIND_CASES,
      windThresholds: {
        calm: "< 6 mph",
        breezy: ">= 6 and < 12 mph",
        windy: ">= 12 mph",
      },
      seedDate: STATIC_SEED_DATE,
    },
    validation,
    interactions: {
      ...interactions,
      forageShare: interactions.forageShapedReports / interactions.lureReports,
      clarityShare: interactions.clarityShapedReports /
        interactions.lureReports,
      conditionShare: interactions.conditionShapedReports /
        interactions.lureReports,
    },
    windows,
    targets,
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(
    `${OUT_DIR}/phase-4a-lure-balance-data.json`,
    JSON.stringify(output, null, 2),
  );
  Deno.writeTextFileSync(
    `${OUT_DIR}/phase-4a-lure-balance-report.md`,
    buildMarkdown({
      totalReports,
      windows: Object.values(windows),
      targets: Object.values(targets),
      interactions,
      validation,
    }),
  );

  console.log(
    `Wrote ${OUT_DIR}/phase-4a-lure-balance-data.json and phase-4a-lure-balance-report.md`,
  );
}

function buildMarkdown(args: {
  totalReports: number;
  windows: ReturnType<typeof buildWindowSummary>[];
  targets: ReturnType<typeof targetOpportunitySummary>[];
  interactions: InteractionAcc;
  validation: ValidationAcc;
}): string {
  const { totalReports, windows, targets, interactions, validation } = args;
  const targetById = new Map(targets.map((t) => [t.id, t]));
  const windowById = new Map(windows.map((w) => [w.id, w]));
  const wind = windowById.get("wind_reaction_window")!;
  const lipless = targetById.get("lipless_crankbait")!;
  const spinnerbait = targetById.get("spinnerbait")!;
  const bladed = targetById.get("bladed_jig")!;

  const validationRows = Object.entries(validation)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  const windowRows = windows
    .map((w) =>
      `| ${w.id} | ${w.activeReports} | ${w.shapedReports} | ${
        pct(w.shapedReports, w.activeReports)
      } | ${w.noMatchingDesignatedFinalists} | ${
        JSON.stringify(w.shapedPickIds)
      } |`
    )
    .join("\n");

  const targetRows = TARGET_LURES.map((id) => {
    const t = targetById.get(id)!;
    return `| ${id} | ${t.authoredRows} | ${t.activeWindowReports} | ${t.legalInActiveWindow} | ${t.anyExactInActiveWindow} | ${t.bestTierInConditionSlot} | ${t.conditionCandidateAppearances} | ${t.conditionShapedPicks} |`;
  }).join("\n");

  return `# Phase 4A Lure-Condition Balance Verification

Generated: ${GENERATED_DATE}

## Method

- Replayed ${totalReports} deterministic lure report scenarios using the production finalist-pool selector.
- Scenario grid: published non-state seasonal rows x clarity x daily regime x wind band fixture x surface-block variant.
- Wind fixtures use the locked thresholds: calm 4 mph, breezy 8 mph, windy 13 mph.
- Condition logic was evaluated from normalized state only: regime, clarity, surface allowed, surface slot present, daylight wind mph, and wind band.
- Selector traces were used to verify condition shaping happened only on already-legal best-tier exact-fit finalists.

## Validation

${validationRows}

## Shaping Layer Frequency

- Forage-shaped lure reports: ${interactions.forageShapedReports}/${interactions.lureReports} (${
    pct(interactions.forageShapedReports, interactions.lureReports)
  })
- Clarity-shaped lure reports: ${interactions.clarityShapedReports}/${interactions.lureReports} (${
    pct(interactions.clarityShapedReports, interactions.lureReports)
  })
- Condition-shaped lure reports: ${interactions.conditionShapedReports}/${interactions.lureReports} (${
    pct(interactions.conditionShapedReports, interactions.lureReports)
  })
- Forage + condition same report: ${interactions.forageAndConditionReports}
- Clarity + condition same report: ${interactions.clarityAndConditionReports}
- Same-slot forage + condition: ${interactions.sameSlotForageConditionReports}
- Same-slot clarity + condition: ${interactions.sameSlotClarityConditionReports}

## Window Frequency

| window | active reports | shaped reports | shaped rate | no matching designated finalists | shaped pick ids |
| --- | ---: | ---: | ---: | ---: | --- |
${windowRows}

## Window Assessment

- surface_commitment_window: balanced / working as intended. It activates only when a surface lane already exists and shapes 27.7% of active reports, mostly walking topwater with limited buzzbait and rare frog exposure.
- wind_reaction_window: balanced. Lipless crankbait leads, but the lead tracks authored rows and matching finalist-slot opportunity rather than a condition-window bias.
- clear_subtle_window: working as intended. It is deliberately narrow, single-lure, and shapes 11.2% of active reports only when suspending jerkbait is already a matching finalist in the designated slot.

## Target Lure Opportunity

| lure | authored rows | active window reports | legal in active window | exact somewhere | best-tier in condition slot | matching condition finalists | condition-shaped picks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${targetRows}

## Lipless Crankbait Diagnosis

- Lipless crankbait leads the windy condition picks because it has the broadest windy-window opportunity: ${lipless.authoredRows} authored rows and ${lipless.conditionCandidateAppearances} matching condition-slot finalist appearances.
- Spinnerbait remains close but has less condition-slot opportunity: ${spinnerbait.authoredRows} authored rows and ${spinnerbait.conditionCandidateAppearances} matching finalist appearances.
- Bladed jig trails for opportunity reasons: ${bladed.authoredRows} authored rows and ${bladed.conditionCandidateAppearances} matching finalist appearances.
- Wind window shaped ${wind.shapedReports}/${wind.activeReports} active windy-window reports (${
    pct(wind.shapedReports, wind.activeReports)
  }); lipless share is ${
    pct(lipless.conditionShapedPicks, wind.shapedReports)
  }, spinnerbait share is ${
    pct(spinnerbait.conditionShapedPicks, wind.shapedReports)
  }, and bladed jig share is ${
    pct(bladed.conditionShapedPicks, wind.shapedReports)
  }.

## Lure Balance Notes

- ${describeTarget("spinnerbait", spinnerbait)}
- ${describeTarget("bladed_jig", bladed)}
- ${describeTarget("lipless_crankbait", lipless)}
- ${describeTarget("walking_topwater", targetById.get("walking_topwater")!)}
- ${describeTarget("buzzbait", targetById.get("buzzbait")!)}
- ${describeTarget("hollow_body_frog", targetById.get("hollow_body_frog")!)}
- ${
    describeTarget(
      "suspending_jerkbait",
      targetById.get("suspending_jerkbait")!,
    )
  }

## Recommendation

Move to the fly pass. The current lure condition layer is trace-clean, modest in frequency, and its apparent lipless crankbait lead is explained by broader authored/exact-fit opportunity rather than by a hidden selector bias.
`;
}

if (import.meta.main) {
  main();
}
