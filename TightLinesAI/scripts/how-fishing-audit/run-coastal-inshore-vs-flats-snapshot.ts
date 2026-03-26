#!/usr/bin/env -S deno run --allow-net --allow-read
/**
 * Engine-only: for each coastal E2E scenario, compare inshore vs flats/estuary
 * scores (same env). No OpenAI. Run from TightLinesAI:
 *   deno run --allow-net --allow-read scripts/how-fishing-audit/run-coastal-inshore-vs-flats-snapshot.ts
 */
import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import {
  buildSharedEngineRequestFromEnvData,
  runHowFishingReport,
} from "../../supabase/functions/_shared/howFishingEngine/index.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/mod.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "./lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "./lib/fetchUSNOMoon.ts";
import { fetchNOAATides } from "./lib/fetchNOAATides.ts";
import { mapArchiveToEnvData } from "./lib/mapEnvData.ts";

type Scenario = {
  id: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: string;
  region_key?: string;
  tide_station_id?: string;
  altitude_ft?: number;
};

const auditDir = dirname(fromFileUrl(import.meta.url));
const path = join(auditDir, "scenarios-e2e-50.json");
const scenarios = JSON.parse(await Deno.readTextFile(path)) as Scenario[];
const coastal = scenarios.filter((s) => s.context === "coastal").slice(0, 12);

console.log(`Coastal scenarios (first ${coastal.length} of ${scenarios.filter((s) => s.context === "coastal").length})\n`);
console.log(
  "id".padEnd(42) +
    "in_shr flts Δ   band_i / band_f   tide_i / tide_f (engine score)\n",
);

for (const s of coastal) {
  const archive = await fetchArchiveWeather(s.latitude, s.longitude, s.local_date);
  if (!archive) {
    console.log(`${s.id.slice(0, 40)}  SKIP archive`);
    continue;
  }
  const tzOffsetHours = archive.tz_offset_seconds / 3600;
  const [sun, moon, tides] = await Promise.all([
    fetchSunriseSunset(s.latitude, s.longitude, s.local_date, archive.timezone),
    fetchUSNOMoon(s.latitude, s.longitude, s.local_date, tzOffsetHours),
    s.tide_station_id
      ? fetchNOAATides(s.tide_station_id, s.local_date, tzOffsetHours)
      : Promise.resolve(null),
  ]);
  let env_data = mapArchiveToEnvData(
    archive,
    s.local_date,
    archive.timezone,
    sun,
    moon,
    tides ?? null,
  );
  if (s.altitude_ft != null) env_data = { ...env_data, altitude_ft: s.altitude_ft };

  const base = buildSharedEngineRequestFromEnvData(
    s.latitude,
    s.longitude,
    s.local_date,
    s.local_timezone,
    "coastal",
    env_data,
    0,
  );
  const reqIn: SharedEngineRequest = s.region_key
    ? { ...base, region_key: s.region_key as SharedEngineRequest["region_key"] }
    : base;
  const reqFl: SharedEngineRequest = { ...reqIn, context: "coastal_flats_estuary" };

  const rIn = runHowFishingReport(reqIn);
  const rFl = runHowFishingReport(reqFl);

  const tideScore = (r: typeof rIn) =>
    r.condition_context?.normalized_variable_scores?.find((x) => x.variable_key === "tide_current_movement")
      ?.engine_score ?? null;

  const ti = tideScore(rIn);
  const tf = tideScore(rFl);
  const d = rFl.score - rIn.score;
  console.log(
    `${s.id.slice(0, 41).padEnd(42)}` +
      `${String(rIn.score).padStart(3)} ${String(rFl.score).padStart(3)} ${d >= 0 ? "+" : ""}${d}   ` +
      `${rIn.band.slice(0, 4)}/${rFl.band.slice(0, 4)}   ` +
      `${ti == null ? "—" : ti.toFixed(2)} / ${tf == null ? "—" : tf.toFixed(2)}`,
  );
}
