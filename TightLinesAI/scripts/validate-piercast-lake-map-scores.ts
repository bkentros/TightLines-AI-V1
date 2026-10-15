#!/usr/bin/env -S deno run --allow-read --allow-write
import { PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/chicagoAlpenaShadow.ts";
import { PIER_CAST_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/cities.ts";
import { PIER_CAST_FIVE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/fiveCityShadow.ts";
import { PIER_CAST_LAKE_HURON_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/lakeHuronShadow.ts";
import { PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/pentwaterCasevilleShadow.ts";
import { PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/stJosephHarrisvilleShadow.ts";
import { PIER_CAST_V3_CITY_IDS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/wisconsinShadow.ts";
import { buildPierCastV3ReviewOutlook } from "../supabase/functions/_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../supabase/functions/_shared/pierCastEngine/providers/lmhofs.ts";

type ReferenceRow = {
  city_id: string;
  issued_at: string;
  forecast_hour: number;
  temperature_c: number | string;
  grid_row: number;
  grid_column: number;
};

type PointFeed = {
  cycle: string;
  generatedAt: string;
  points: Array<{
    cityId: string;
    gridRow: number;
    gridColumn: number;
    latitude: number;
    longitude: number;
    samples: Array<
      { forecastHour: number; validAt: string; temperatureC: number }
    >;
  }>;
};

const args = new Map<string, string>();
for (let index = 0; index < Deno.args.length; index += 2) {
  const key = Deno.args[index];
  const value = Deno.args[index + 1];
  if (!key?.startsWith("--") || value == null) {
    throw new Error("arguments must be --name value pairs");
  }
  args.set(key.slice(2), value);
}
for (const required of ["reference", "feed", "evaluation-time", "out"]) {
  if (!args.has(required)) throw new Error(`--${required} is required`);
}

const profiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ...PIER_CAST_FIVE_CITY_PROFILES,
  ...PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  ...PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  ...PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
];
const profileById = new Map(
  profiles.map((profile) => [profile.cityId, profile]),
);

const feed = JSON.parse(
  await Deno.readTextFile(args.get("feed")!),
) as PointFeed;
const rows = (await Deno.readTextFile(args.get("reference")!)).trim().split(
  "\n",
)
  .map((line) => JSON.parse(line) as ReferenceRow)
  .filter((row) => row.issued_at === feed.cycle);
if (rows.length !== 32 * 121) {
  throw new Error(`${feed.cycle} has ${rows.length} v63 reference samples`);
}

const oldByCity = new Map<string, ReferenceRow[]>();
for (const row of rows) {
  const list = oldByCity.get(row.city_id) ?? [];
  list.push(row);
  oldByCity.set(row.city_id, list);
}
for (const list of oldByCity.values()) {
  list.sort((a, b) => a.forecast_hour - b.forecast_hour);
}
const newByCity = new Map(feed.points.map((point) => [point.cityId, point]));

function buildBatch(
  usePointFeed: boolean,
): Extract<PierCastLmhofsBatch, { status: "available" }> {
  const fetchedAt = args.get("evaluation-time")!;
  const cities = PIER_CAST_V3_CITY_IDS.map((cityId) => {
    const profile = profileById.get(cityId)!;
    const location = profile.waterTemperatureSource!.configuredLocation!;
    const sourceId = profile.waterTemperatureSource!.sourceId;
    const point = newByCity.get(cityId)!;
    const samples: PierCastLmhofsSample[] = Array.from(
      { length: 121 },
      (_, forecastHour) => {
        const next = point.samples[forecastHour];
        const old = oldByCity.get(cityId)![forecastHour];
        const temperatureC = usePointFeed
          ? next.temperatureC
          : Number(old.temperature_c);
        return {
          cityId,
          sourceId,
          productId: "NOAA_NOS_LMHOFS_REGULARGRID",
          issuedAt: feed.cycle,
          forecastHour,
          validAt: new Date(Date.parse(feed.cycle) + forecastHour * 3_600_000)
            .toISOString(),
          temperatureC,
          rawUnit: "C",
          verticalSelection: "surface",
          depthIndex: 0,
          gridRow: location.gridRow,
          gridColumn: location.gridColumn,
          latitude: location.latitude,
          longitude: location.longitude,
          sourceUrl: usePointFeed
            ? "validation://lake-map-point-feed"
            : "validation://v63-archive",
        };
      },
    );
    return {
      status: "available" as const,
      cityId,
      sourceId,
      issuedAt: feed.cycle,
      requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt: feed.cycle,
    fetchedAt,
    cycleAgeHours: (Date.parse(fetchedAt) - Date.parse(feed.cycle)) / 3_600_000,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities,
    diagnostics: [],
  };
}

function reads(usePointFeed: boolean) {
  const outlook = buildPierCastV3ReviewOutlook({
    batch: buildBatch(usePointFeed),
    evaluationTime: args.get("evaluation-time")!,
  });
  return outlook.cities.flatMap((city) =>
    city.dates.flatMap((date, leadDay) =>
      date.species.map((species) => ({
        key: `${city.cityId}/${species.speciesId}/${leadDay}`,
        cityId: city.cityId,
        speciesId: species.speciesId,
        leadDay,
        status: species.biological.status,
        score: species.biological.status === "available"
          ? species.biological.score
          : null,
        displayScore: species.biological.status === "available"
          ? species.biological.displayScore
          : null,
        ratingLabel: species.biological.status === "available"
          ? species.biological.label
          : null,
      }))
    )
  );
}

const oldReads = new Map(reads(false).map((read) => [read.key, read]));
const newReads = reads(true);
let scoreChanges = 0;
let displayScoreChanges = 0;
let ratingBandChanges = 0;
let statusChanges = 0;
let maxScoreDifference = 0;
let maxDisplayScoreDifference = 0;
const changedBands = [];
for (const next of newReads) {
  const previous = oldReads.get(next.key)!;
  if (previous.status !== next.status) statusChanges += 1;
  if (previous.score !== next.score) scoreChanges += 1;
  if (previous.displayScore !== next.displayScore) displayScoreChanges += 1;
  if (previous.score != null && next.score != null) {
    maxScoreDifference = Math.max(
      maxScoreDifference,
      Math.abs(next.score - previous.score),
    );
  }
  if (previous.displayScore != null && next.displayScore != null) {
    maxDisplayScoreDifference = Math.max(
      maxDisplayScoreDifference,
      Math.abs(next.displayScore - previous.displayScore),
    );
  }
  if (previous.ratingLabel !== next.ratingLabel) {
    ratingBandChanges += 1;
    changedBands.push({ ...next, previousRatingLabel: previous.ratingLabel });
  }
}
const result = {
  cycle: feed.cycle,
  evaluationTime: args.get("evaluation-time"),
  forecastCount: newReads.length,
  statusChanges,
  scoreChanges,
  displayScoreChanges,
  ratingBandChanges,
  maxScoreDifference,
  maxDisplayScoreDifference,
  changedBands,
};
await Deno.writeTextFile(
  args.get("out")!,
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result));
