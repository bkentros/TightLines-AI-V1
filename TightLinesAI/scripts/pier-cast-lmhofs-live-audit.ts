import { fetchPierCastLmhofsBatch } from "../supabase/functions/_shared/pierCastEngine/index.ts";

const fullHorizon = Deno.args.includes("--full");
const summaryOnly = Deno.args.includes("--summary");
const forecastHours = fullHorizon ? undefined : [0, 1, 24, 72, 120] as const;

const batch = await fetchPierCastLmhofsBatch({
  forecastHours,
  concurrency: 10,
  requestTimeoutMs: 20_000,
});

const summary = batch.status === "unavailable" ? batch : {
  status: batch.status,
  issuedAt: batch.issuedAt,
  fetchedAt: batch.fetchedAt,
  cycleAgeHours: batch.cycleAgeHours,
  fullHorizonRequested: batch.fullHorizonRequested,
  requestedForecastHours: batch.requestedForecastHours,
  cities: batch.cities.map((city) => ({
    cityId: city.cityId,
    status: city.status,
    sampleCount: city.samples.length,
    missingForecastHours: city.status === "unavailable"
      ? city.missingForecastHours
      : [],
    temperatureRangeC: city.samples.length > 0
      ? [
        Math.min(...city.samples.map((sample) => sample.temperatureC)),
        Math.max(...city.samples.map((sample) => sample.temperatureC)),
      ]
      : null,
    ...(!summaryOnly
      ? {
        samples: city.samples.map((sample) => ({
          forecastHour: sample.forecastHour,
          validAt: sample.validAt,
          temperatureC: sample.temperatureC,
          gridRow: sample.gridRow,
          gridColumn: sample.gridColumn,
        })),
      }
      : {}),
  })),
  diagnostics: batch.diagnostics,
};

console.log(JSON.stringify(summary, null, 2));
if (batch.status !== "available") Deno.exit(1);
