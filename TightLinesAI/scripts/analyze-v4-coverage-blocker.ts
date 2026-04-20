/**
 * One-off analysis: aggregate computeRecommenderV4 failures (strict §11) for phase-4 blocker memo.
 * Run: `cd TightLinesAI && deno run -A scripts/analyze-v4-coverage-blocker.ts`
 */
import type { RecommenderRequest } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SeasonalRowV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { computeRecommenderV4 } from "../supabase/functions/_shared/recommenderEngine/v4/engine/runRecommenderV4.ts";
import {
  createCollectingDiagWriter,
  type RecommenderV4DiagPayload,
} from "../supabase/functions/_shared/recommenderEngine/v4/engine/diagnostics.ts";
import { toLegacyRecommenderSpecies } from "../supabase/functions/_shared/recommenderEngine/v4/scope.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import { analysisWithScore } from "../supabase/functions/_shared/recommenderEngine/v4/__tests__/helpers/analysisStub.ts";

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const NINE_PAYLOADS = [
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "clear" as const },
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "stained" as const },
  { posture: "aggressive" as const, score: 85, wind_mph: 5, water_clarity: "dirty" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "clear" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "stained" as const },
  { posture: "neutral" as const, score: 50, wind_mph: 5, water_clarity: "dirty" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "clear" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "stained" as const },
  { posture: "suppressed" as const, score: 25, wind_mph: 10, water_clarity: "dirty" as const },
];

function requestForRow(row: SeasonalRowV4, payload: (typeof NINE_PAYLOADS)[number]): RecommenderRequest {
  const st = row.state_code?.trim();
  return {
    location: {
      latitude: 40,
      longitude: -100,
      state_code: st && st.length > 0 ? st : "MN",
      region_key: row.region_key,
      local_date: `2026-${String(row.month).padStart(2, "0")}-15`,
      local_timezone: "America/Chicago",
      month: row.month,
    },
    species: toLegacyRecommenderSpecies(row.species),
    context: row.water_type,
    water_clarity: payload.water_clarity,
    env_data: { wind_speed_mph: payload.wind_mph },
  };
}

function userIdForCell(row: SeasonalRowV4, pi: number): string {
  return `coverage|${row.species}|${row.region_key}|${row.month}|${row.water_type}|${pi}`;
}

const gearRe = /\((lure|fly)\)/;
const slotRe = /slot (\d+)/;

function main() {
  let ok = 0;
  const errors: string[] = [];
  const bySpecies = new Map<string, number>();
  const byGear = new Map<string, number>();
  const byClarity = new Map<string, number>();
  const bySpeciesGear = new Map<string, number>();
  const byWaterType = new Map<string, number>();
  const slotCounts = new Map<number, number>();

  for (const row of ALL_ROWS) {
    for (let pi = 0; pi < NINE_PAYLOADS.length; pi++) {
      const payload = NINE_PAYLOADS[pi]!;
      const req = requestForRow(row, payload);
      const diags: RecommenderV4DiagPayload[] = [];
      try {
        computeRecommenderV4(
          req,
          userIdForCell(row, pi),
          analysisWithScore(payload.score),
          row,
          createCollectingDiagWriter(diags),
        );
        ok++;
      } catch (e) {
        const msg = String(e);
        errors.push(msg);
        bySpecies.set(row.species, (bySpecies.get(row.species) ?? 0) + 1);
        byWaterType.set(row.water_type, (byWaterType.get(row.water_type) ?? 0) + 1);
        byClarity.set(payload.water_clarity, (byClarity.get(payload.water_clarity) ?? 0) + 1);
        const gm = msg.match(gearRe)?.[1] ?? "unknown";
        byGear.set(gm, (byGear.get(gm) ?? 0) + 1);
        const sg = `${row.species}|${gm}`;
        bySpeciesGear.set(sg, (bySpeciesGear.get(sg) ?? 0) + 1);
        const sm = msg.match(slotRe);
        if (sm) {
          const s = Number(sm[1]);
          slotCounts.set(s, (slotCounts.get(s) ?? 0) + 1);
        }
      }
    }
  }

  const total = ok + errors.length;
  console.log(JSON.stringify({ totalCells: total, success: ok, errors: errors.length }, null, 2));
  console.log("by_species", Object.fromEntries([...bySpecies.entries()].sort((a, b) => b[1] - a[1])));
  console.log("by_gear", Object.fromEntries([...byGear.entries()].sort((a, b) => b[1] - a[1])));
  console.log("by_water_type", Object.fromEntries([...byWaterType.entries()].sort((a, b) => b[1] - a[1])));
  console.log("by_clarity", Object.fromEntries([...byClarity.entries()].sort((a, b) => b[1] - a[1])));
  console.log("by_species_gear", Object.fromEntries([...bySpeciesGear.entries()].sort((a, b) => b[1] - a[1])));
  console.log("slot_index", Object.fromEntries([...slotCounts.entries()].sort((a, b) => a[0] - b[0])));

  const uniq = new Set(errors);
  console.log("unique_error_messages", uniq.size);
  console.log("sample_errors");
  for (const s of [...uniq].slice(0, 8)) console.log("---", s.slice(0, 200));

  const firstMatch = (pred: (m: string) => boolean) => errors.find(pred);
  console.log("example_trout_lure", firstMatch((m) => m.includes("trout") && m.includes("(lure)")) ?? "none");
  console.log("example_pike_lure", firstMatch((m) => m.includes("northern_pike") && m.includes("(lure)")) ?? "none");
  console.log("example_lmb_fly", firstMatch((m) => m.includes("largemouth_bass") && m.includes("(fly)")) ?? "none");
}

main();
