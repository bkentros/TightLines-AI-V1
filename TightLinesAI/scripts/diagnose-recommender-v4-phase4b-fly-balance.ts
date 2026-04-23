/**
 * Phase 4 fly-side first pass diagnostic.
 *
 * Replays the production finalist-pool selector across the deterministic
 * scenario grid and inspects fly-side condition traces to verify the first-pass
 * fly windows remain lane-first, modest, and deterministic.
 *
 * Usage (from TightLinesAI/):
 *   deno run -A scripts/diagnose-recommender-v4-phase4b-fly-balance.ts
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
  activeFlyConditionWindow,
  type FlyConditionWindowId,
  flyConditionWindowMatches,
  type FlyDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";
import {
  type WindBand,
  windBandFromDaylightWindMph,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/wind.ts";

type Side = "lure" | "fly";

type TargetFlyId =
  | "mouse_fly"
  | "popper_fly"
  | "frog_fly"
  | "deer_hair_slider"
  | "woolly_bugger"
  | "game_changer"
  | "slim_minnow_streamer"
  | "unweighted_baitfish_streamer"
  | "rabbit_strip_leech"
  | "baitfish_slider_fly";

type ValidationAcc = {
  deterministicMismatches: number;
  conditionMultiShapeViolations: number;
  conditionSlotViolations: number;
  conditionFinalistIdViolations: number;
  conditionChoiceOutsideCandidateViolations: number;
  conditionGateViolations: number;
  conditionExactFitViolations: number;
  conditionTierViolations: number;
  windBandFixtureViolations: number;
};

type WindowAcc = {
  id: FlyConditionWindowId;
  activeReports: number;
  shapedReports: number;
  noMatchingDesignatedFinalists: number;
  shapedPickIds: Record<string, number>;
};

type InteractionAcc = {
  flyReports: number;
  forageShapedReports: number;
  clarityShapedReports: number;
  conditionShapedReports: number;
  forageAndConditionReports: number;
  clarityAndConditionReports: number;
  allThreeReports: number;
  sameSlotForageConditionReports: number;
  sameSlotClarityConditionReports: number;
};

type TargetAcc = {
  id: TargetFlyId;
  authoredRows: number;
  totalSelections: number;
  activeWindowReports: number;
  legalInActiveWindow: number;
  anyExactInActiveWindow: number;
  bestTierInConditionSlot: number;
  conditionCandidateAppearances: number;
  conditionShapedPicks: number;
};

const CLARITIES: WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: DailyRegime[] = ["aggressive", "neutral", "suppressive"];
const WIND_CASES: readonly { mph: number; band: WindBand }[] = [
  { mph: 4, band: "calm" },
  { mph: 8, band: "breezy" },
  { mph: 13, band: "windy" },
];
const ALL_ROWS: SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
].filter((r) => r.state_code == null || r.state_code === "");
const STATIC_SEED_DATE = "2026-04-22";
const GENERATED_DATE = "2026-04-23";
const OUT_DIR = "docs/audits/recommender-v4/phase-4-fly-daily-conditions";
const TARGET_FLYS: readonly TargetFlyId[] = [
  "mouse_fly",
  "popper_fly",
  "frog_fly",
  "deer_hair_slider",
  "woolly_bugger",
  "game_changer",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "rabbit_strip_leech",
  "baitfish_slider_fly",
];
const FLY_BY_ID: ReadonlyMap<string, ArchetypeProfileV4> = new Map(
  FLY_ARCHETYPES_V4.map((a) => [a.id, a]),
);
const SURFACE_FLY_SET = new Set<string>(
  SURFACE_FLY_IDS_V4 as readonly string[],
);

function rowKey(r: SeasonalRowV4): string {
  return `${r.species}|${r.region_key}|m${r.month}|${r.water_type}`;
}

function pct(n: number, d: number, digits = 1): string {
  if (d === 0) return "0.0%";
  return `${((n / d) * 100).toFixed(digits)}%`;
}

function bump(map: Record<string, number>, key: string, by = 1): void {
  map[key] = (map[key] ?? 0) + by;
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

function buildFlyConditionState(args: {
  row: SeasonalRowV4;
  regime: DailyRegime;
  windCase: { mph: number; band: WindBand };
  surfaceBlocked: boolean;
  profiles: TargetProfile[];
}): FlyDailyConditionState {
  const { row, regime, windCase, surfaceBlocked, profiles } = args;
  return {
    regime,
    surface_allowed_today: row.column_range.includes("surface") &&
      row.surface_seasonally_possible &&
      !surfaceBlocked,
    surface_slot_present: profiles.some((profile) =>
      profile.column === "surface"
    ),
    daylight_wind_mph: windCase.mph,
    wind_band: windCase.band,
    species: row.species,
    context: row.water_type,
    month: row.month,
  };
}

function emptyTarget(id: TargetFlyId): TargetAcc {
  return {
    id,
    authoredRows: 0,
    totalSelections: 0,
    activeWindowReports: 0,
    legalInActiveWindow: 0,
    anyExactInActiveWindow: 0,
    bestTierInConditionSlot: 0,
    conditionCandidateAppearances: 0,
    conditionShapedPicks: 0,
  };
}

function emptyWindow(id: FlyConditionWindowId): WindowAcc {
  return {
    id,
    activeReports: 0,
    shapedReports: 0,
    noMatchingDesignatedFinalists: 0,
    shapedPickIds: {},
  };
}

function main() {
  const validation: ValidationAcc = {
    deterministicMismatches: 0,
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
    flyReports: 0,
    forageShapedReports: 0,
    clarityShapedReports: 0,
    conditionShapedReports: 0,
    forageAndConditionReports: 0,
    clarityAndConditionReports: 0,
    allThreeReports: 0,
    sameSlotForageConditionReports: 0,
    sameSlotClarityConditionReports: 0,
  };
  const targetStats = new Map(TARGET_FLYS.map((id) => [id, emptyTarget(id)]));
  const windowStats = new Map<FlyConditionWindowId, WindowAcc>([
    ["trout_mouse_window", emptyWindow("trout_mouse_window")],
    [
      "surface_commitment_fly_window",
      emptyWindow("surface_commitment_fly_window"),
    ],
  ]);

  for (const row of ALL_ROWS) {
    for (const id of row.primary_fly_ids) {
      const target = targetStats.get(id as TargetFlyId);
      if (target) target.authoredRows++;
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
            interactions.flyReports++;
            const seedBase = `phase4-fly|${rowKey(row)}|${clarity}|${regime}|${
              surfaceBlocked ? "b1" : "b0"
            }|${windCase.band}|${STATIC_SEED_DATE}`;
            const profiles = buildTargetProfiles({
              row,
              regime,
              surfaceBlocked,
            });
            const flyConditionState = buildFlyConditionState({
              row,
              regime,
              windCase,
              surfaceBlocked,
              profiles,
            });
            const activeWindow = activeFlyConditionWindow(flyConditionState);

            const traces: RebuildSlotSelectionTrace[] = [];
            const picks = selectArchetypesForSide({
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
              flyConditionState,
              onSlotTrace: (trace) => traces.push(trace),
            });
            const repeat = selectArchetypesForSide({
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
              flyConditionState,
            });
            if (
              picks.map((p) => p.archetype.id).join("|") !==
                repeat.map((p) => p.archetype.id).join("|")
            ) {
              validation.deterministicMismatches++;
            }

            for (const pick of picks) {
              const target = targetStats.get(pick.archetype.id as TargetFlyId);
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
            if (conditionTraces.length > 1) {
              validation.conditionMultiShapeViolations++;
            }

            if (activeWindow != null) {
              const windowAcc = windowStats.get(activeWindow)!;
              windowAcc.activeReports++;
              const conditionSlot = traces[0]?.conditionSlot ?? 0;
              const conditionTrace = traces.find((trace) =>
                trace.slot === conditionSlot
              );
              const allowedIds = flyConditionWindowMatches(activeWindow);

              for (const id of TARGET_FLYS) {
                const target = targetStats.get(id)!;
                const cand = FLY_BY_ID.get(id);
                if (!cand) continue;
                if (allowedIds.has(id)) {
                  target.activeWindowReports++;
                  if (
                    passesGate({ c: cand, side: "fly", row, surfaceBlocked })
                  ) {
                    target.legalInActiveWindow++;
                    if (
                      profiles.some((profile) =>
                        exactSlotFitTier(profile, cand, row) != null
                      )
                    ) {
                      target.anyExactInActiveWindow++;
                    }
                    const conditionProfile = profiles[conditionSlot];
                    if (
                      conditionProfile &&
                      conditionTrace?.bestTier != null &&
                      exactSlotFitTier(conditionProfile, cand, row) ===
                        conditionTrace.bestTier
                    ) {
                      target.bestTierInConditionSlot++;
                    }
                  }
                  if (
                    conditionTrace?.conditionCandidateIds.includes(id)
                  ) {
                    target.conditionCandidateAppearances++;
                  }
                }
              }

              if (conditionTraces.length > 0) {
                windowAcc.shapedReports++;
              } else if (conditionTrace?.conditionCandidateIds.length === 0) {
                windowAcc.noMatchingDesignatedFinalists++;
              }

              for (const trace of conditionTraces) {
                if (trace.slot !== trace.conditionSlot) {
                  validation.conditionSlotViolations++;
                }
                for (const id of trace.finalistIds) {
                  if (!allowedIds.has(id)) {
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
                  : FLY_BY_ID.get(trace.chosenId);
                if (!chosen) continue;
                bump(windowAcc.shapedPickIds, chosen.id);
                const target = targetStats.get(chosen.id as TargetFlyId);
                if (target) target.conditionShapedPicks++;
                if (
                  !passesGate({ c: chosen, side: "fly", row, surfaceBlocked })
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

            const lureTraces: RebuildSlotSelectionTrace[] = [];
            selectArchetypesForSide({
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
              onSlotTrace: (trace) => lureTraces.push(trace),
            });
            // no-op: lure-side unchanged is verified separately by rerunning the
            // lure balance diagnostic after this pass.
            void lureTraces;
          }
        }
      }
    }
  }

  const targets = Object.fromEntries(
    [...targetStats.entries()].map(([id, stat]) => [
      id,
      {
        ...stat,
        activeWindowSelectionRate: stat.activeWindowReports > 0
          ? stat.conditionShapedPicks / stat.activeWindowReports
          : 0,
      },
    ]),
  );

  const out = {
    meta: {
      generated: GENERATED_DATE,
      totalSeasonalRows: ALL_ROWS.length,
      totalReports,
      scenarioGrid:
        "published non-state rows x 3 clarities x 3 regimes x calm/breezy/windy wind fixtures x legal surface-block variants",
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
      forageShare: interactions.forageShapedReports / interactions.flyReports,
      clarityShare: interactions.clarityShapedReports / interactions.flyReports,
      conditionShare: interactions.conditionShapedReports /
        interactions.flyReports,
    },
    windows: Object.fromEntries(
      [...windowStats.entries()].map(([id, stat]) => [id, stat]),
    ),
    targets,
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(
    `${OUT_DIR}/phase-4b-fly-balance-data.json`,
    JSON.stringify(out, null, 2),
  );
  Deno.writeTextFileSync(
    `${OUT_DIR}/phase-4b-fly-balance-report.md`,
    buildMarkdown({
      totalReports,
      validation,
      interactions,
      windows: [...windowStats.values()],
      targets,
    }),
  );
  Deno.writeTextFileSync(
    `${OUT_DIR}/PHASE-4-FIRST-PASS-FLY-CONDITIONS.md`,
    buildSummary({
      totalReports,
      interactions,
      windows: [...windowStats.values()],
    }),
  );

  console.log(
    `Wrote ${OUT_DIR}/phase-4b-fly-balance-data.json, phase-4b-fly-balance-report.md, and PHASE-4-FIRST-PASS-FLY-CONDITIONS.md`,
  );
}

function buildMarkdown(args: {
  totalReports: number;
  validation: ValidationAcc;
  interactions: InteractionAcc;
  windows: WindowAcc[];
  targets: Record<string, TargetAcc & { activeWindowSelectionRate: number }>;
}): string {
  const { totalReports, validation, interactions, windows, targets } = args;
  const windowRows = windows.map((w) =>
    `| ${w.id} | ${w.activeReports} | ${w.shapedReports} | ${
      pct(w.shapedReports, w.activeReports)
    } | ${w.noMatchingDesignatedFinalists} | ${
      JSON.stringify(w.shapedPickIds)
    } |`
  ).join("\n");
  const targetRows = TARGET_FLYS.map((id) => {
    const t = targets[id];
    return `| ${id} | ${t.authoredRows} | ${t.activeWindowReports} | ${t.legalInActiveWindow} | ${t.anyExactInActiveWindow} | ${t.bestTierInConditionSlot} | ${t.conditionCandidateAppearances} | ${t.conditionShapedPicks} |`;
  }).join("\n");
  const validations = Object.entries(validation).map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return `# Phase 4 Fly-Side First Pass Audit

Generated: ${GENERATED_DATE}

## Method

- Replayed ${totalReports} deterministic fly report scenarios using the production finalist-pool selector.
- Used normalized fly condition state only: regime, surface allowed, surface slot present, daylight wind mph, wind band, species, context, and month.
- Used the same locked daylight wind fixtures as the lure pass: calm 4 mph, breezy 8 mph, windy 13 mph.
- Verified condition narrowing through selector traces, not inferred from final picks alone.

## Validation

${validations}

## Shaping Layer Frequency

- Forage-shaped fly reports: ${interactions.forageShapedReports}/${interactions.flyReports} (${
    pct(interactions.forageShapedReports, interactions.flyReports)
  })
- Clarity-shaped fly reports: ${interactions.clarityShapedReports}/${interactions.flyReports} (${
    pct(interactions.clarityShapedReports, interactions.flyReports)
  })
- Condition-shaped fly reports: ${interactions.conditionShapedReports}/${interactions.flyReports} (${
    pct(interactions.conditionShapedReports, interactions.flyReports)
  })
- Same-slot forage + condition: ${interactions.sameSlotForageConditionReports}
- Same-slot clarity + condition: ${interactions.sameSlotClarityConditionReports}

## Window Frequency

| window | active reports | shaped reports | shaped rate | no matching designated finalists | shaped pick ids |
| --- | ---: | ---: | ---: | ---: | --- |
${windowRows}

## Target Fly Opportunity

| fly | authored rows | active window reports | legal in active window | exact somewhere | best-tier in condition slot | matching condition finalists | condition-shaped picks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${targetRows}
`;
}

function buildSummary(args: {
  totalReports: number;
  interactions: InteractionAcc;
  windows: WindowAcc[];
}): string {
  const { totalReports, interactions, windows } = args;
  const mouse = windows.find((w) => w.id === "trout_mouse_window")!;
  const surface = windows.find((w) =>
    w.id === "surface_commitment_fly_window"
  )!;

  return `# Phase 4 Fly First Pass - Daily-Condition Windows

Generated: ${GENERATED_DATE}

## Scope

This pass adds deterministic daily-condition narrowing for fly recommendations only. It keeps the finalist-pool architecture intact: hard gates, exact-fit tiers, family diversity, forage, clarity, recency, and deterministic finalist choice remain structural.

## Normalized Inputs

- \`regime\`
- \`surface_allowed_today\`
- \`surface_slot_present\`
- \`daylight_wind_mph\`
- \`wind_band\`
- \`species\`
- \`context\`
- \`month\`

Wind uses the same local hourly mean from 5:00 AM through 9:00 PM local time, with locked bands \`calm < 6\`, \`breezy >= 6 and < 12\`, and \`windy >= 12\`.

## Window Definitions

1. \`trout_mouse_window\`
   - Fires only for trout rivers in June-August when surface is allowed, a surface slot exists, regime is aggressive, and wind is calm.
   - Narrows only to \`mouse_fly\` if it is already a finalist in the deterministic fly condition slot.

2. \`surface_commitment_fly_window\`
   - Fires when surface is allowed, a surface slot exists, regime is aggressive, and wind is not windy.
   - Narrows only to \`popper_fly\`, \`frog_fly\`, or \`deer_hair_slider\` if those flies are already finalists in the deterministic fly condition slot.

Only one fly window is active per report, in the priority order above.

## Slot Behavior

- Fly recommendations get one deterministic condition slot per report.
- The slot avoids the fly forage slot and the fly clarity slot.
- If the active window has no matching finalists in that slot, the selector does nothing.
- Condition-shaped fly reports: ${interactions.conditionShapedReports}/${totalReports} (${
    pct(interactions.conditionShapedReports, totalReports)
  }).

## Audit Summary

- \`trout_mouse_window\`: ${mouse.shapedReports}/${mouse.activeReports} shaped.
- \`surface_commitment_fly_window\`: ${surface.shapedReports}/${surface.activeReports} shaped.
- Same-slot forage/condition conflicts: ${interactions.sameSlotForageConditionReports}
- Same-slot clarity/condition conflicts: ${interactions.sameSlotClarityConditionReports}

## Deferred

- Streamer/leech condition windows.
- Temperature-driven fly logic.
- Flow/runoff/rain windows.
- Broader fly visibility/reaction shaping.
`;
}

if (import.meta.main) {
  main();
}
