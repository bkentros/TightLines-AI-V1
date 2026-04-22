#!/usr/bin/env -S deno run --allow-read
/**
 * Northern pike rebuild recommender audit (archived weather + structural + repetition).
 * Reads committed matrix archive env; prints JSON summary to stdout.
 */
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { RecommenderRequest } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import { buildRecommenderEngineRequest } from "../../supabase/functions/recommender/index.ts";
import { runRecommenderRebuildSurface } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import {
  buildTargetProfiles,
  regimeFromHowsScore,
} from "../../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import type { DailyRegime } from "../../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import { selectArchetypesForSide } from "../../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type { RecentRecommendationHistoryEntry } from "../../supabase/functions/_shared/recommenderEngine/rebuild/recentHistory.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { PIKE_AUDIT_ANCHORS } from "../recommender-v3-audit/pikeAuditMatrix.ts";

const ARCHIVE_PATH = new URL(
  "../../docs/recommender-v3-audit/generated/pike-v3-matrix-archive-env.json",
  import.meta.url,
);

/** Mainstream pike regions (matches SMB/LMB tiering; matrix subset is mostly GL + NE + interiors). */
const MAINSTREAM_REGIONS = new Set<RegionKey>([
  "florida",
  "south_central",
  "southeast_atlantic",
  "gulf_coast",
  "appalachian",
  "great_lakes_upper_midwest",
  "midwest_interior",
  "northeast",
]);

const FRINGE_REGIONS = new Set<RegionKey>([
  "northern_california",
  "southern_california",
  "pacific_northwest",
  "mountain_west",
  "inland_northwest",
  "mountain_alpine",
  "alaska",
]);

const ANCHOR_BY_KEY = new Map(
  PIKE_AUDIT_ANCHORS.map((a) => [a.key, a]),
);

type MatrixAnchor = (typeof PIKE_AUDIT_ANCHORS)[number];

function recommenderRequestFromArchiveScenario(
  sc: ArchiveBundle["scenarios"][number],
  anchor: MatrixAnchor,
): RecommenderRequest {
  const { engineReq } = buildRecommenderEngineRequest({
    latitude: sc.location.latitude,
    longitude: sc.location.longitude,
    state_code: sc.location.state_code,
    species: "northern_pike",
    context: anchor.context,
    water_clarity: anchor.default_clarity,
    env_data: sc.env_data!,
    target_date: sc.location.local_date,
  });
  return engineReq;
}

type ArchiveBundle = {
  scenarios: Array<{
    scenario_id: string;
    status: string;
    location: RecommenderRequest["location"];
    env_data: Record<string, unknown> | null;
  }>;
};

function parseScenarioAnchorKey(scenarioId: string): string | null {
  const m = scenarioId.match(/^pike_matrix_(.+)_\d{2}$/);
  return m?.[1] ?? null;
}

function archivedWeatherAudit() {
  const raw = Deno.readTextFileSync(ARCHIVE_PATH);
  const bundle = JSON.parse(raw) as ArchiveBundle;

  const tallies = {
    mainstream_total: 0,
    mainstream_ready: 0,
    mainstream_full_33: 0,
    mainstream_lure_hist: [] as number[],
    mainstream_fly_hist: [] as number[],
    thin_mainstream: [] as {
      scenario_id: string;
      region_key: string;
      lure_n: number;
      fly_n: number;
      posture: string;
    }[],
    fringe_total: 0,
    fringe_full_33: 0,
    mainstream_hows_scores: [] as number[],
    mainstream_hows_regimes: [] as ReturnType<typeof regimeFromHowsScore>[],
  };

  for (const sc of bundle.scenarios) {
    const rk = sc.location.region_key as RegionKey;
    const anchorKey = parseScenarioAnchorKey(sc.scenario_id);
    if (!anchorKey) continue;
    const anchor = ANCHOR_BY_KEY.get(anchorKey as MatrixAnchor["key"]);
    if (!anchor) continue;

    const isMain = MAINSTREAM_REGIONS.has(rk);
    const isFringe = FRINGE_REGIONS.has(rk);
    if (!isMain && !isFringe) continue;

    if (isMain) tallies.mainstream_total++;
    else tallies.fringe_total++;

    if (sc.status !== "ready" || !sc.env_data) continue;
    if (isMain) tallies.mainstream_ready++;

    const req = recommenderRequestFromArchiveScenario(sc, anchor);

    if (isMain) {
      const s = analyzeRecommenderConditions(req).scored.score;
      tallies.mainstream_hows_scores.push(s);
      tallies.mainstream_hows_regimes.push(regimeFromHowsScore(s));
    }

    const res = runRecommenderRebuildSurface(req, { userSeed: "pike-rebuild-audit-static" });
    const ln = res.lure_recommendations.length;
    const fn = res.fly_recommendations.length;

    if (isMain) {
      tallies.mainstream_lure_hist.push(ln);
      tallies.mainstream_fly_hist.push(fn);
      if (ln === 3 && fn === 3) tallies.mainstream_full_33++;
      else {
        tallies.thin_mainstream.push({
          scenario_id: sc.scenario_id,
          region_key: sc.location.region_key,
          lure_n: ln,
          fly_n: fn,
          posture: res.summary.daily_tactical_preference.posture_band,
        });
      }
    } else {
      if (ln === 3 && fn === 3) tallies.fringe_full_33++;
    }
  }

  const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((100 * n) / d));

  const scores = tallies.mainstream_hows_scores;
  const regimeCounts = (() => {
    const o = { suppressive: 0, neutral: 0, aggressive: 0 };
    for (const r of tallies.mainstream_hows_regimes) o[r]++;
    return o;
  })();
  const howsSpread = scores.length === 0
    ? null
    : {
      score_min: Math.min(...scores),
      score_max: Math.max(...scores),
      distinct_score_values: new Set(scores).size,
      regime_counts: regimeCounts,
    };

  return {
    archive_file: ARCHIVE_PATH.pathname,
    mainstream: {
      scenarios: tallies.mainstream_total,
      ready_env: tallies.mainstream_ready,
      full_3_3: tallies.mainstream_full_33,
      full_3_3_pct_of_ready: pct(tallies.mainstream_full_33, tallies.mainstream_ready),
      hows_score_spread_mainstream_ready: howsSpread,
      lure_count_buckets: bucketCounts(tallies.mainstream_lure_hist),
      fly_count_buckets: bucketCounts(tallies.mainstream_fly_hist),
      thin_cases: tallies.thin_mainstream,
    },
    fringe: {
      scenarios: tallies.fringe_total,
      full_3_3: tallies.fringe_full_33,
      full_3_3_pct: pct(tallies.fringe_full_33, tallies.fringe_total),
    },
  };
}

function bucketCounts(vals: number[]): Record<string, number> {
  const o: Record<string, number> = {};
  for (const v of vals) {
    const k = String(v);
    o[k] = (o[k] ?? 0) + 1;
  }
  return o;
}

function structuralSweep() {
  const regimes: DailyRegime[] = ["suppressive", "neutral", "aggressive"];
  const rows = NORTHERN_PIKE_SEASONAL_ROWS_V4.filter((r) =>
    MAINSTREAM_REGIONS.has(r.region_key as RegionKey) &&
    (r.water_type === "freshwater_lake_pond" || r.water_type === "freshwater_river")
  );

  let cells = 0;
  let fullLure = 0;
  let fullFly = 0;
  let fullBoth = 0;
  const lureShort: string[] = [];
  const flyShort: string[] = [];

  for (const row of rows) {
    for (const regime of regimes) {
      for (const surfaceBlocked of [false, true]) {
        cells++;
        const profiles = buildTargetProfiles({ row, regime, surfaceBlocked });
        const seedBase =
          `struct|${row.region_key}|${row.month}|${row.water_type}|${regime}|${surfaceBlocked}`;

        const lurePicks = selectArchetypesForSide({
          side: "lure",
          row,
          species: row.species,
          context: row.water_type,
          water_clarity: "stained",
          profiles,
          surfaceBlocked,
          seedBase,
          currentLocalDate: "2026-06-15",
          recentHistory: [],
        });
        const flyPicks = selectArchetypesForSide({
          side: "fly",
          row,
          species: row.species,
          context: row.water_type,
          water_clarity: "stained",
          profiles,
          surfaceBlocked,
          seedBase,
          currentLocalDate: "2026-06-15",
          recentHistory: [],
        });

        if (lurePicks.length === 3) fullLure++;
        else {
          lureShort.push(
            `${row.region_key} m${row.month} ${row.water_type} ${regime} surfBlk=${surfaceBlocked} →${lurePicks.length}`,
          );
        }
        if (flyPicks.length === 3) fullFly++;
        else {
          flyShort.push(
            `${row.region_key} m${row.month} ${row.water_type} ${regime} surfBlk=${surfaceBlocked} →${flyPicks.length}`,
          );
        }
        if (lurePicks.length === 3 && flyPicks.length === 3) fullBoth++;
      }
    }
  }

  return {
    mainstream_rows: rows.length,
    regime_x_surface_cells: cells,
    lure_3_pct: pct10(fullLure, cells),
    fly_3_pct: pct10(fullFly, cells),
    both_3_pct: pct10(fullBoth, cells),
    lure_short_samples: lureShort.slice(0, 25),
    lure_short_total: lureShort.length,
    fly_short_samples: flyShort.slice(0, 25),
    fly_short_total: flyShort.length,
  };
}

function pct10(n: number, d: number) {
  return d === 0 ? 0 : Math.round((1000 * n) / d) / 10;
}

function repetitionAudit() {
  const raw = Deno.readTextFileSync(ARCHIVE_PATH);
  const bundle = JSON.parse(raw) as ArchiveBundle;
  const june = bundle.scenarios.find((s) => s.scenario_id === "pike_matrix_minnesota_northwoods_lake_06");
  if (!june?.env_data) {
    return { error: "missing pike_matrix_minnesota_northwoods_lake_06 in archive" };
  }
  const anchor = ANCHOR_BY_KEY.get("minnesota_northwoods_lake")!;

  const flySets: string[] = [];
  const lureSets: string[] = [];
  const topFly: string[] = [];
  const topLure: string[] = [];
  const history: RecentRecommendationHistoryEntry[] = [];

  for (let d = 0; d < 14; d++) {
    const local_date = `2026-06-${String(d + 1).padStart(2, "0")}`;
    const req = recommenderRequestFromArchiveScenario(
      {
        ...june,
        location: { ...june.location, local_date, month: 6 },
      },
      anchor,
    );

    const res = runRecommenderRebuildSurface(req, {
      userSeed: "same-user-test",
      recentHistory: history,
    });

    const lIds = res.lure_recommendations.map((x) => x.id).join("|");
    const fIds = res.fly_recommendations.map((x) => x.id).join("|");
    lureSets.push(lIds);
    flySets.push(fIds);
    topLure.push(res.lure_recommendations[0]?.id ?? "");
    topFly.push(res.fly_recommendations[0]?.id ?? "");

    for (const x of res.lure_recommendations) {
      history.push({
        archetype_id: x.id,
        gear_mode: "lure",
        local_date,
      });
    }
    for (const x of res.fly_recommendations) {
      history.push({
        archetype_id: x.id,
        gear_mode: "fly",
        local_date,
      });
    }
  }

  const uniq = (arr: string[]) => new Set(arr).size;
  return {
    scenario: "minnesota_northwoods_lake_june_archived_env",
    days: 14,
    unique_full_lure_bundles: uniq(lureSets),
    unique_full_fly_bundles: uniq(flySets),
    unique_top_lure: uniq(topLure),
    unique_top_fly: uniq(topFly),
  };
}

if (import.meta.main) {
  const archived = archivedWeatherAudit();
  const structural = structuralSweep();
  const repetition = repetitionAudit();

  console.log(
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        region_tiers: {
          mainstream: [...MAINSTREAM_REGIONS],
          fringe_in_matrix_archive: [...FRINGE_REGIONS],
        },
        archived_weather: archived,
        structural_exact_slot_sweep: structural,
        repetition_fourteen_day: repetition,
      },
      null,
      2,
    ),
  );
}
