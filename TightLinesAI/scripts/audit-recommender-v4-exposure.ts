/**
 * v4 rebuild exposure audit — production finalist-pool selector.
 *
 * Enumerates every published seasonal row × clarity × daily regime × surface-wind
 * variant, calls `rebuild/selectSide.ts`, and records hard-gate, exact-fit,
 * narrowing, determinism, and exposure metrics.
 *
 * Usage (from TightLinesAI/):
 *   deno run -A scripts/audit-recommender-v4-exposure.ts
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
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildTargetProfiles,
  type DailyRegime,
  type TargetProfile,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import {
  CLARITY_SPECIALIST_WHITELIST,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import {
  type FlyConditionWindowId,
  type FlyDailyConditionState,
  type LureConditionWindowId,
  type LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";
import {
  type WindBand,
  windBandFromDaylightWindMph,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/wind.ts";

const CLARITIES: WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: DailyRegime[] = ["aggressive", "neutral", "suppressive"];
const WIND_CASES: readonly { mph: number; band: WindBand }[] = [
  { mph: 4, band: "calm" },
  { mph: 8, band: "breezy" },
  { mph: 13, band: "windy" },
];
const GENERATED_DATE = "2026-04-23";
const STATIC_SEED_DATE = "2026-04-22";
const OUT_DIR = "docs/audits/recommender-v4/phase-4-finalist-pool";
const PHASE3_JSON =
  "docs/audits/recommender-v4/phase-3-variety/phase-3-exposure-data.json";

const ALL_ROWS: SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
].filter((r) => r.state_code == null || r.state_code === "");

type Side = "lure" | "fly";

type ArchAcc = {
  id: string;
  side: Side;
  family_group: string;
  authoringRows: number;
  eligScenarios: number;
  anyExactScenarios: number;
  tier1Scenarios: number;
  onlyTier2Scenarios: number;
  pickBase: number;
  phase3PickBase: number | null;
  forageShapedPicks: number;
  clarityShapedPicks: number;
  conditionShapedPicks: number;
  recencyShapedPicks: number;
};

type ArchStatsRow = ArchAcc & {
  rowShare: number;
  pickShare: number;
  exposureRatio: number | null;
  phase3Delta: number | null;
  anyExactRate: number;
  condPickIfExact: number;
};

type FamAcc = {
  family: string;
  side: Side;
  authoringRows: number;
  rowsWithAnyMember: number;
  totalPickBase: number;
};

type ValidationAcc = {
  determinismMismatches: number;
  exactFitViolations: number;
  tierDisciplineViolations: number;
  forageSlotViolations: number;
  forageMultiShapeViolations: number;
  claritySlotViolations: number;
  clarityMultiShapeViolations: number;
  clarityWhitelistViolations: number;
  conditionSlotViolations: number;
  conditionMultiShapeViolations: number;
  conditionWindowIdViolations: number;
  conditionWindowCandidateViolations: number;
  forageShapedSideScenarios: number;
  clarityShapedSideScenarios: number;
  conditionShapedLureScenarios: number;
  conditionShapedFlyScenarios: number;
  recencyShapedSlots: number;
  forageSlotCounts: Record<string, number>;
  claritySlotCounts: Record<string, number>;
  conditionSlotCounts: Record<string, number>;
  clarityShapedIds: Record<string, number>;
  conditionShapedIds: Record<string, number>;
  conditionWindowCounts: Record<string, number>;
};

function rowKey(r: SeasonalRowV4): string {
  return `${r.species}|${r.region_key}|m${r.month}|${r.water_type}`;
}

function surfaceBlockVariants(row: SeasonalRowV4): readonly boolean[] {
  const surfaceInSeason = row.column_range.includes("surface") &&
    row.surface_seasonally_possible;
  if (!surfaceInSeason) return [false];
  return [false, true];
}

function emptyAcc(a: ArchetypeProfileV4, side: Side): ArchAcc {
  return {
    id: a.id,
    side,
    family_group: a.family_group,
    authoringRows: 0,
    eligScenarios: 0,
    anyExactScenarios: 0,
    tier1Scenarios: 0,
    onlyTier2Scenarios: 0,
    pickBase: 0,
    phase3PickBase: null,
    forageShapedPicks: 0,
    clarityShapedPicks: 0,
    conditionShapedPicks: 0,
    recencyShapedPicks: 0,
  };
}

function inEnvelope(
  cand: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
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

const surfaceFlySet = new Set<string>(
  SURFACE_FLY_IDS_V4 as readonly string[],
);

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
  const allowed = side === "lure" ? row.primary_lure_ids : row.primary_fly_ids;
  const excluded = new Set(
    side === "lure"
      ? (row.excluded_lure_ids ?? [])
      : (row.excluded_fly_ids ?? []),
  );
  if (!new Set(allowed as readonly string[]).has(c.id)) return false;
  if (excluded.has(c.id)) return false;

  if (surfaceBlocked) {
    if (c.is_surface) return false;
    if (side === "fly" && surfaceFlySet.has(c.id)) return false;
  }
  return true;
}

function bump(map: Record<string, number>, key: string, by = 1): void {
  map[key] = (map[key] ?? 0) + by;
}

function loadPhase3PickCounts(): Map<string, number> {
  try {
    const parsed = JSON.parse(Deno.readTextFileSync(PHASE3_JSON)) as {
      archetypes?: { side: Side; id: string; pickBase: number }[];
    };
    const out = new Map<string, number>();
    for (const a of parsed.archetypes ?? []) {
      out.set(`${a.side}:${a.id}`, a.pickBase);
    }
    return out;
  } catch {
    return new Map();
  }
}

function conditionAllowedIds(
  window: LureConditionWindowId | FlyConditionWindowId | null,
): ReadonlySet<string> {
  if (window === "surface_commitment_window") {
    return new Set(["walking_topwater", "buzzbait", "hollow_body_frog"]);
  }
  if (window === "wind_reaction_window") {
    return new Set(["spinnerbait", "bladed_jig", "lipless_crankbait"]);
  }
  if (window === "clear_subtle_window") {
    return new Set(["suspending_jerkbait"]);
  }
  if (window === "trout_mouse_window") {
    return new Set(["mouse_fly"]);
  }
  if (window === "surface_commitment_fly_window") {
    return new Set(["popper_fly", "frog_fly", "deer_hair_slider"]);
  }
  return new Set();
}

function main() {
  const byArch = new Map<string, ArchAcc>();
  for (const a of LURE_ARCHETYPES_V4) {
    byArch.set(`lure:${a.id}`, emptyAcc(a, "lure"));
  }
  for (const a of FLY_ARCHETYPES_V4) {
    byArch.set(`fly:${a.id}`, emptyAcc(a, "fly"));
  }

  for (const row of ALL_ROWS) {
    for (const id of row.primary_lure_ids) {
      byArch.get(`lure:${id}`)!.authoringRows += 1;
    }
    for (const id of row.primary_fly_ids) {
      byArch.get(`fly:${id}`)!.authoringRows += 1;
    }
  }

  const phase3 = loadPhase3PickCounts();
  for (const [k, v] of phase3) {
    const acc = byArch.get(k);
    if (acc) acc.phase3PickBase = v;
  }

  let totalScenarioCount = 0;
  for (const row of ALL_ROWS) {
    for (const _c of CLARITIES) {
      for (const _r of REGIMES) {
        for (const _w of WIND_CASES) {
          for (const _s of surfaceBlockVariants(row)) {
            totalScenarioCount++;
          }
        }
      }
    }
  }

  const validation: ValidationAcc = {
    determinismMismatches: 0,
    exactFitViolations: 0,
    tierDisciplineViolations: 0,
    forageSlotViolations: 0,
    forageMultiShapeViolations: 0,
    claritySlotViolations: 0,
    clarityMultiShapeViolations: 0,
    clarityWhitelistViolations: 0,
    conditionSlotViolations: 0,
    conditionMultiShapeViolations: 0,
    conditionWindowIdViolations: 0,
    conditionWindowCandidateViolations: 0,
    forageShapedSideScenarios: 0,
    clarityShapedSideScenarios: 0,
    conditionShapedLureScenarios: 0,
    conditionShapedFlyScenarios: 0,
    recencyShapedSlots: 0,
    forageSlotCounts: {},
    claritySlotCounts: {},
    conditionSlotCounts: {},
    clarityShapedIds: {},
    conditionShapedIds: {},
    conditionWindowCounts: {},
  };

  for (const row of ALL_ROWS) {
    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windCase of WIND_CASES) {
          if (windBandFromDaylightWindMph(windCase.mph) !== windCase.band) {
            throw new Error(
              `audit wind-band fixture mismatch: ${windCase.mph}`,
            );
          }
          for (const surfaceBlocked of surfaceBlockVariants(row)) {
            const seedBase = `exposure|${rowKey(row)}|${clarity}|${regime}|${
              surfaceBlocked ? "b1" : "b0"
            }|${windCase.band}|${STATIC_SEED_DATE}`;
            const profiles = buildTargetProfiles({
              row,
              regime,
              surfaceBlocked,
            });
            const surfaceAllowedToday = row.column_range.includes("surface") &&
              row.surface_seasonally_possible &&
              !surfaceBlocked;
            const lureConditionState: LureDailyConditionState = {
              regime,
              water_clarity: clarity,
              surface_allowed_today: surfaceAllowedToday,
              surface_slot_present: profiles.some((profile) =>
                profile.column === "surface"
              ),
              daylight_wind_mph: windCase.mph,
              wind_band: windCase.band,
            };
            const flyConditionState: FlyDailyConditionState = {
              regime,
              surface_allowed_today: surfaceAllowedToday,
              surface_slot_present: profiles.some((profile) =>
                profile.column === "surface"
              ),
              daylight_wind_mph: windCase.mph,
              wind_band: windCase.band,
              species: row.species,
              context: row.water_type,
              month: row.month,
            };

            for (const side of (["lure", "fly"] as const)) {
              const catalog = side === "lure"
                ? LURE_ARCHETYPES_V4
                : FLY_ARCHETYPES_V4;

              for (const cand of catalog) {
                if (!passesGate({ c: cand, side, row, surfaceBlocked })) {
                  continue;
                }
                const acc = byArch.get(`${side}:${cand.id}`);
                if (!acc) continue;
                acc.eligScenarios++;

                let hasT1 = false;
                let hasT2 = false;
                for (const profile of profiles) {
                  const t = exactSlotFitTier(profile, cand, row);
                  if (t === 1) hasT1 = true;
                  if (t === 2) hasT2 = true;
                }
                if (hasT1 || hasT2) {
                  acc.anyExactScenarios++;
                  if (hasT1) acc.tier1Scenarios++;
                  if (hasT2 && !hasT1) acc.onlyTier2Scenarios++;
                }
              }

              const traces: RebuildSlotSelectionTrace[] = [];
              const picks = selectArchetypesForSide({
                side,
                row,
                species: row.species,
                context: row.water_type,
                water_clarity: clarity,
                profiles,
                surfaceBlocked,
                seedBase,
                currentLocalDate: STATIC_SEED_DATE,
                recentHistory: [],
                lureConditionState: side === "lure"
                  ? lureConditionState
                  : undefined,
                flyConditionState: side === "fly"
                  ? flyConditionState
                  : undefined,
                onSlotTrace: (trace) => traces.push(trace),
              });
              const repeat = selectArchetypesForSide({
                side,
                row,
                species: row.species,
                context: row.water_type,
                water_clarity: clarity,
                profiles,
                surfaceBlocked,
                seedBase,
                currentLocalDate: STATIC_SEED_DATE,
                recentHistory: [],
                lureConditionState: side === "lure"
                  ? lureConditionState
                  : undefined,
                flyConditionState: side === "fly"
                  ? flyConditionState
                  : undefined,
              });
              if (
                picks.map((p) => p.archetype.id).join("|") !==
                  repeat.map((p) => p.archetype.id).join("|")
              ) {
                validation.determinismMismatches++;
              }

              const forageNarrowed = traces.filter((t) => t.forageNarrowed);
              const clarityNarrowed = traces.filter((t) => t.clarityNarrowed);
              const conditionNarrowed = traces.filter((t) =>
                t.conditionNarrowed
              );
              if (forageNarrowed.length > 0) {
                validation.forageShapedSideScenarios++;
              }
              if (clarityNarrowed.length > 0) {
                validation.clarityShapedSideScenarios++;
              }
              if (conditionNarrowed.length > 0) {
                if (side === "lure") validation.conditionShapedLureScenarios++;
                else validation.conditionShapedFlyScenarios++;
              }
              if (forageNarrowed.length > 1) {
                validation.forageMultiShapeViolations++;
              }
              if (clarityNarrowed.length > 1) {
                validation.clarityMultiShapeViolations++;
              }
              if (conditionNarrowed.length > 1) {
                validation.conditionMultiShapeViolations++;
              }

              if (traces[0]) {
                bump(validation.forageSlotCounts, String(traces[0].forageSlot));
                bump(
                  validation.claritySlotCounts,
                  String(traces[0].claritySlot),
                );
                if (side === "lure") {
                  bump(
                    validation.conditionSlotCounts,
                    String(traces[0].conditionSlot),
                  );
                }
              }

              for (const trace of traces) {
                if (trace.recencyNarrowed) validation.recencyShapedSlots++;
                if (trace.forageNarrowed && trace.slot !== trace.forageSlot) {
                  validation.forageSlotViolations++;
                }
                if (trace.clarityNarrowed && trace.slot !== trace.claritySlot) {
                  validation.claritySlotViolations++;
                }
                if (trace.clarityNarrowed) {
                  const whitelist = CLARITY_SPECIALIST_WHITELIST[side];
                  for (const id of trace.finalistIds) {
                    const allowed = whitelist[id];
                    if (allowed == null || !allowed.includes(clarity)) {
                      validation.clarityWhitelistViolations++;
                    }
                  }
                }
                if (trace.conditionNarrowed) {
                  if (trace.slot !== trace.conditionSlot) {
                    validation.conditionSlotViolations++;
                  }
                  if (
                    trace.conditionWindow == null ||
                    ![
                      "surface_commitment_window",
                      "wind_reaction_window",
                      "clear_subtle_window",
                      "trout_mouse_window",
                      "surface_commitment_fly_window",
                    ].includes(trace.conditionWindow)
                  ) {
                    validation.conditionWindowIdViolations++;
                  }
                  const allowed = conditionAllowedIds(trace.conditionWindow);
                  for (const id of trace.finalistIds) {
                    if (!allowed.has(id)) {
                      validation.conditionWindowCandidateViolations++;
                    }
                  }
                }
              }

              for (const pick of picks) {
                const acc = byArch.get(`${side}:${pick.archetype.id}`)!;
                acc.pickBase++;
                const trace = traces.find((t) =>
                  t.slot === pick.source_slot_index
                );
                if (trace?.forageNarrowed) acc.forageShapedPicks++;
                if (trace?.clarityNarrowed) {
                  acc.clarityShapedPicks++;
                  bump(validation.clarityShapedIds, pick.archetype.id);
                }
                if (trace?.conditionNarrowed) {
                  acc.conditionShapedPicks++;
                  bump(validation.conditionShapedIds, pick.archetype.id);
                  bump(
                    validation.conditionWindowCounts,
                    trace.conditionWindow ?? "unknown",
                  );
                }
                if (trace?.recencyNarrowed) acc.recencyShapedPicks++;

                const t = exactSlotFitTier(pick.profile, pick.archetype, row);
                if (t == null) validation.exactFitViolations++;
                if (trace?.bestTier != null && t !== trace.bestTier) {
                  validation.tierDisciplineViolations++;
                }
              }
            }
          }
        }
      }
    }
  }

  const maxPicksPerSide = totalScenarioCount * 3;
  const allStats: ArchStatsRow[] = [...byArch.values()].map((a) => ({
    ...a,
    rowShare: ALL_ROWS.length ? a.authoringRows / ALL_ROWS.length : 0,
    pickShare: maxPicksPerSide ? a.pickBase / maxPicksPerSide : 0,
    exposureRatio: a.authoringRows > 0
      ? (a.pickBase / maxPicksPerSide) / (a.authoringRows / ALL_ROWS.length)
      : null,
    phase3Delta: a.phase3PickBase == null
      ? null
      : a.pickBase - a.phase3PickBase,
    anyExactRate: a.eligScenarios > 0
      ? a.anyExactScenarios / a.eligScenarios
      : 0,
    condPickIfExact: a.anyExactScenarios > 0
      ? a.pickBase / a.anyExactScenarios
      : 0,
  }));

  const byFam = buildFamilyStats(allStats, maxPicksPerSide);
  const keyIds = [
    "walking_topwater",
    "buzzbait",
    "hollow_body_frog",
    "spinnerbait",
    "bladed_jig",
    "lipless_crankbait",
    "suspending_jerkbait",
    "popping_topwater",
    "blade_bait",
    "casting_spoon",
    "game_changer",
    "woolly_bugger",
    "frog_fly",
    "mouse_fly",
    "slim_minnow_streamer",
    "unweighted_baitfish_streamer",
    "articulated_dungeon_streamer",
    "rabbit_strip_leech",
  ];
  const keyArchetypes = keyIds
    .map((id) => allStats.find((a) => a.id === id))
    .filter((a): a is ArchStatsRow => a != null);

  const underexposed = allStats
    .filter((a) =>
      a.authoringRows >= 5 && a.exposureRatio != null && a.exposureRatio < 1
    )
    .sort((a, b) => (a.exposureRatio ?? 0) - (b.exposureRatio ?? 0));

  const biggestGainers = allStats
    .filter((a) => a.phase3Delta != null)
    .sort((a, b) => (b.phase3Delta ?? 0) - (a.phase3Delta ?? 0))
    .slice(0, 25);
  const biggestDecliners = allStats
    .filter((a) => a.phase3Delta != null)
    .sort((a, b) => (a.phase3Delta ?? 0) - (b.phase3Delta ?? 0))
    .slice(0, 25);

  const outJson = {
    meta: {
      version: 2,
      policy: "finalist-pool",
      generated: GENERATED_DATE,
      totalSeasonalRows: ALL_ROWS.length,
      totalScenarioCount,
      totalPicksLure: maxPicksPerSide,
      totalPicksFly: maxPicksPerSide,
      rowsNote:
        "Rows filtered: state_code empty only (non-state-scoped), matching rebuild resolver.",
      enumeration:
        "For each row: 3 water clarities x 3 regimes x 3 wind bands x {1|2} surface-wind block variants.",
      selection:
        "Production selectSide: hard gates, best exact-fit tier, picked-id removal, family narrowing, designated forage slot, designated clarity slot, lure-only condition slot, structural recency, deterministic seeded finalist choice.",
      seed:
        "seedBase = exposure|{species|region|month|water_type}|{clarity}|{regime}|b0|b1|{wind_band}|2026-04-22.",
    },
    validation,
    archetypes: allStats,
    keyArchetypes,
    rankings: {
      byLowestExposureRatio: underexposed.slice(0, 50),
      biggestPhase3To4Gainers: biggestGainers,
      biggestPhase3To4Decliners: biggestDecliners,
    },
    family: byFam,
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  const jsonPath = `${OUT_DIR}/phase-4-exposure-data.json`;
  const mdPath = `${OUT_DIR}/phase-4-exposure-report.md`;
  const notePath = `${OUT_DIR}/PHASE-4-FINALIST-POOL.md`;
  Deno.writeTextFileSync(jsonPath, JSON.stringify(outJson, null, 2));
  Deno.writeTextFileSync(
    mdPath,
    buildMarkdownReport({
      nRows: ALL_ROWS.length,
      totalScenarioCount,
      maxPicksPerSide,
      allStats,
      keyArchetypes,
      underexposed,
      biggestGainers,
      biggestDecliners,
      validation,
    }),
  );
  Deno.writeTextFileSync(notePath, buildSummaryNote(validation, keyArchetypes));
  console.log(
    `Wrote ${jsonPath}, ${mdPath}, and ${notePath} (scenarios=${totalScenarioCount}, rows=${ALL_ROWS.length}).`,
  );
}

function buildFamilyStats(
  allStats: ArchStatsRow[],
  maxPicksPerSide: number,
) {
  const byFam = new Map<string, FamAcc>();
  function famKey(side: Side, f: string) {
    return `${side}|${f}`;
  }
  for (const a of [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4]) {
    const side = a.gear_mode;
    if (!byFam.has(famKey(side, a.family_group))) {
      byFam.set(famKey(side, a.family_group), {
        family: a.family_group,
        side,
        authoringRows: 0,
        rowsWithAnyMember: 0,
        totalPickBase: 0,
      });
    }
  }

  for (const row of ALL_ROWS) {
    for (const side of (["lure", "fly"] as const)) {
      const ids = side === "lure" ? row.primary_lure_ids : row.primary_fly_ids;
      const fams = new Set<string>();
      for (const id of ids) {
        const a = (side === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4)
          .find((x) => x.id === id);
        if (!a) continue;
        byFam.get(famKey(side, a.family_group))!.authoringRows++;
        fams.add(a.family_group);
      }
      for (const family of fams) {
        byFam.get(famKey(side, family))!.rowsWithAnyMember++;
      }
    }
  }

  for (const acc of allStats) {
    byFam.get(famKey(acc.side, acc.family_group))!.totalPickBase +=
      acc.pickBase;
  }

  return [...byFam.values()].map((f) => ({
    ...f,
    rowSetShare: ALL_ROWS.length ? f.rowsWithAnyMember / ALL_ROWS.length : 0,
    pickShare: maxPicksPerSide ? f.totalPickBase / maxPicksPerSide : 0,
    famExposureRatio: f.rowsWithAnyMember
      ? (f.totalPickBase / maxPicksPerSide) /
        (f.rowsWithAnyMember / ALL_ROWS.length)
      : null,
  }));
}

function fmtRatio(n: number | null): string {
  return n == null ? "n/a" : `${n.toFixed(3)}x`;
}

function buildMarkdownReport(args: {
  nRows: number;
  totalScenarioCount: number;
  maxPicksPerSide: number;
  allStats: ArchStatsRow[];
  keyArchetypes: ArchStatsRow[];
  underexposed: ArchStatsRow[];
  biggestGainers: ArchStatsRow[];
  biggestDecliners: ArchStatsRow[];
  validation: ValidationAcc;
}): string {
  const {
    nRows,
    totalScenarioCount,
    maxPicksPerSide,
    keyArchetypes,
    underexposed,
    biggestGainers,
    biggestDecliners,
    validation,
    allStats,
  } = args;
  const lines: string[] = [];
  lines.push("# Phase 4 — finalist-pool exposure audit");
  lines.push("");
  lines.push(
    `**Generated** ${GENERATED_DATE} (fixed comparison seed date: ${STATIC_SEED_DATE}; rerun: \`deno run -A scripts/audit-recommender-v4-exposure.ts\` from \`TightLinesAI/\`).`,
  );
  lines.push("");
  lines.push("## What was enumerated");
  lines.push("");
  lines.push(`- Published v4 rows with empty \`state_code\`: ${nRows}.`);
  lines.push(
    `- Scenario grid: 3 clarities x 3 regimes x 3 wind bands x surface-open/blocked where seasonally possible: ${totalScenarioCount} scenarios.`,
  );
  lines.push(
    "- Selection calls production `selectArchetypesForSide`; the audit does not mirror peer-ranking logic.",
  );
  lines.push(
    `- Pick budget per side: ${maxPicksPerSide} slots (${totalScenarioCount} x 3).`,
  );
  lines.push("");
  lines.push("## Validation counters");
  lines.push("");
  lines.push(`- Determinism mismatches: ${validation.determinismMismatches}.`);
  lines.push(`- Exact-fit violations: ${validation.exactFitViolations}.`);
  lines.push(
    `- Tier-discipline violations: ${validation.tierDisciplineViolations}.`,
  );
  lines.push(
    `- Forage slot violations / multi-shape side scenarios: ${validation.forageSlotViolations} / ${validation.forageMultiShapeViolations}.`,
  );
  lines.push(
    `- Clarity slot violations / multi-shape side scenarios / whitelist violations: ${validation.claritySlotViolations} / ${validation.clarityMultiShapeViolations} / ${validation.clarityWhitelistViolations}.`,
  );
  lines.push(
    `- Shaped side-scenarios: forage ${validation.forageShapedSideScenarios}, clarity ${validation.clarityShapedSideScenarios}.`,
  );
  lines.push(
    `- Condition slot violations / multi-shape / candidate-window violations: ${validation.conditionSlotViolations} / ${validation.conditionMultiShapeViolations} / ${validation.conditionWindowCandidateViolations}.`,
  );
  lines.push(
    `- Condition-shaped scenarios: lure ${validation.conditionShapedLureScenarios}, fly ${validation.conditionShapedFlyScenarios}.`,
  );
  lines.push(
    `- Condition window counts: ${
      JSON.stringify(validation.conditionWindowCounts)
    }.`,
  );
  lines.push("");
  lines.push("## Key archetypes");
  lines.push("");
  lines.push("| archetype | side | P3 picks | P4 picks | delta | exposure |");
  lines.push("|---|---:|---:|---:|---:|---:|");
  for (const a of keyArchetypes) {
    lines.push(
      `| \`${a.id}\` | ${a.side} | ${
        a.phase3PickBase ?? "n/a"
      } | ${a.pickBase} | ${a.phase3Delta ?? "n/a"} | ${
        fmtRatio(a.exposureRatio)
      } |`,
    );
  }
  lines.push("");
  lines.push("## Condition-window lure impacts");
  lines.push("");
  lines.push("| lure | picks | condition-shaped picks | window role |");
  lines.push("|---|---:|---:|---|");
  const conditionRoles: Record<string, string> = {
    walking_topwater: "surface commitment",
    buzzbait: "surface commitment",
    hollow_body_frog: "surface commitment",
    spinnerbait: "wind reaction",
    bladed_jig: "wind reaction",
    lipless_crankbait: "wind reaction",
    suspending_jerkbait: "clear subtle",
  };
  for (const id of Object.keys(conditionRoles)) {
    const stat = allStats.find((a) => a.side === "lure" && a.id === id);
    if (!stat) continue;
    lines.push(
      `| \`${id}\` | ${stat.pickBase} | ${stat.conditionShapedPicks} | ${
        conditionRoles[id]
      } |`,
    );
  }
  lines.push("");
  lines.push("## Biggest P3 to P4 gainers");
  lines.push("");
  lines.push(
    biggestGainers.slice(0, 12)
      .map((a) => `- \`${a.id}\` (${a.side}) ${a.phase3Delta}`)
      .join("\n"),
  );
  lines.push("");
  lines.push("## Biggest P3 to P4 decliners");
  lines.push("");
  lines.push(
    biggestDecliners.slice(0, 12)
      .map((a) => `- \`${a.id}\` (${a.side}) ${a.phase3Delta}`)
      .join("\n"),
  );
  lines.push("");
  lines.push("## Still underexposed");
  lines.push("");
  lines.push(
    underexposed.slice(0, 20)
      .map((a) =>
        `- \`${a.id}\` (${a.side}) exposure ${
          fmtRatio(a.exposureRatio)
        }, rows ${a.authoringRows}, picks ${a.pickBase}, anyExact ${
          (a.anyExactRate * 100).toFixed(0)
        }%`
      )
      .join("\n"),
  );
  lines.push("");
  lines.push("_End._");
  return lines.join("\n");
}

function buildSummaryNote(
  validation: ValidationAcc,
  keyArchetypes: ArchStatsRow[],
): string {
  const improved = keyArchetypes
    .filter((a) => (a.phase3Delta ?? 0) > 0)
    .map((a) => `\`${a.id}\` (+${a.phase3Delta})`)
    .join(", ") || "(none)";
  const stillLow = keyArchetypes
    .filter((a) => a.pickBase === 0 || (a.exposureRatio ?? 0) < 0.15)
    .map((a) => `\`${a.id}\` (${a.pickBase} picks)`)
    .join(", ") || "(none)";

  return [
    "# Phase 4 — finalist-pool policy note",
    "",
    "## Policy summary",
    "",
    "- Hard gates and exact-fit slot tiers stay intact.",
    "- Within a slot, the selector keeps only the best exact-fit tier and removes already-picked archetype ids.",
    "- Finalist pools are narrowed structurally in this order: unused family, designated forage slot, designated clarity slot, non-recent candidates.",
    "- Each side also has one deterministic daily-condition slot that avoids the forage and clarity slots.",
    "- First-pass daily-condition windows stay narrowing-only: lures get surface commitment, wind reaction, and clear subtle; flies get trout mouse and surface commitment.",
    "- Forage has exactly one deterministic slot per side and narrows only when that slot has a strict primary-forage subset.",
    "- Clarity has exactly one deterministic non-forage slot per side and narrows only whitelisted specialists whose whitelist includes today's clarity.",
    "- Final choice is a stable hash ordering from the remaining finalists; there is no `Math.random` and no live randomness.",
    "",
    "## Validation summary",
    "",
    `- Determinism mismatches: ${validation.determinismMismatches}.`,
    `- Exact-fit violations: ${validation.exactFitViolations}.`,
    `- Forage multi-shape violations: ${validation.forageMultiShapeViolations}.`,
    `- Clarity multi-shape / whitelist violations: ${validation.clarityMultiShapeViolations} / ${validation.clarityWhitelistViolations}.`,
    `- Condition slot / multi-shape / candidate-window violations: ${validation.conditionSlotViolations} / ${validation.conditionMultiShapeViolations} / ${validation.conditionWindowCandidateViolations}.`,
    `- Condition window counts: ${
      JSON.stringify(validation.conditionWindowCounts)
    }.`,
    "",
    "## What improved",
    "",
    `- Key archetypes improved from Phase 3: ${improved}.`,
    "",
    "## Remaining daily-condition work",
    "",
    `- Still rare or suspiciously low among key archetypes: ${stillLow}. These should be revisited with Phase 4 daily-condition rules or seasonal authoring, not hidden ranking weights.`,
    "",
  ].join("\n");
}

main();
