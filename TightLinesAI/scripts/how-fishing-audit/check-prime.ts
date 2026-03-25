#!/usr/bin/env -S deno run --allow-net --allow-read
/**
 * Prime-day gate check for a single lat/lon/date (archive weather).
 *
 * Uses the same MSL pressure window and fishing-hour cloud band as the live audit
 * mappers. Does not run the full engine — only evaluatePrimeGates().
 *
 * Usage:
 *   cd TightLinesAI && deno run --allow-net --allow-read \
 *     scripts/how-fishing-audit/check-prime.ts \
 *     <lat> <lon> <YYYY-MM-DD> <IANA_tz> <freshwater_lake_pond|freshwater_river|coastal> [noaa_tide_station_id]
 *
 * Examples:
 *   ... 39.63 -106.07 2024-09-07 America/Denver freshwater_lake_pond
 *   ... 37.8 -122.4 2024-10-12 America/Los_Angeles coastal 9414290
 */
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import { evaluatePrimeGates } from "./lib/primeGates.ts";
import { fetchArchiveWeather } from "./lib/fetchArchiveWeather.ts";
import { fetchNOAATides } from "./lib/fetchNOAATides.ts";
import { buildPrimeGateInputsFromArchive } from "./lib/archivePrimeInputs.ts";

const CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
];

function usage(): never {
  console.error(`Usage: check-prime.ts <lat> <lon> <YYYY-MM-DD> <IANA_tz> <context> [tide_station_id]
  context: freshwater_lake_pond | freshwater_river | coastal
  tide_station_id: required for meaningful coastal tide gate (NOAA CO-OPS id)`);
  Deno.exit(1);
}

const args = Deno.args;
if (args.length < 5) usage();

const lat = Number(args[0]);
const lon = Number(args[1]);
const date = args[2]!;
const tz = args[3]!;
const context = args[4] as EngineContext;
const tideStation = args[5] ?? null;

if (!Number.isFinite(lat) || !Number.isFinite(lon)) usage();
if (!CONTEXTS.includes(context)) usage();

const archive = await fetchArchiveWeather(lat, lon, date);
if (!archive) {
  console.error("Archive fetch failed.");
  Deno.exit(2);
}

const tzOffsetHours = archive.tz_offset_seconds / 3600;
const tides =
  context === "coastal" && tideStation
    ? await fetchNOAATides(tideStation, date, tzOffsetHours)
    : null;

if (context === "coastal" && !tideStation) {
  console.warn("No tide_station_id: coastal tier will fail tide gate.\n");
}

const inputs = buildPrimeGateInputsFromArchive(archive, date, tz, context, tides);
if (!inputs) {
  console.error("Could not build prime inputs (missing noon hour or cloud/wind data).");
  Deno.exit(3);
}

const result = evaluatePrimeGates({
  ...inputs,
  precip_7d_sum_in: inputs.precip_7d_sum_in ?? undefined,
});

console.log(JSON.stringify({
  lat,
  lon,
  date,
  timezone: tz,
  context,
  tide_station: tideStation,
  ...result,
}, null, 2));
