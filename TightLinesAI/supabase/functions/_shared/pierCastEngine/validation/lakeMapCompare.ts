import type { PierCastLmhofsBatch } from "../providers/lmhofs.ts";
import { buildPierCastV3ReviewOutlook } from "../pipeline/v3ReviewOutlook.ts";

type AvailableBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

export type PierCastLakeMapCohortCheck = {
  cohort:
    | "primary"
    | "wisconsin"
    | "lake_huron"
    | "five_city"
    | "chicago_alpena"
    | "st_joseph_harrisville"
    | "pentwater_caseville";
  source: "lake_map";
  issuedAt: string;
  cityCount: number;
  sampleCount: number;
  durationMs: number;
};

export type PierCastLakeMapComparison = {
  status: "compared";
  mode: "read_only";
  issuedAt: string;
  cohorts: readonly PierCastLakeMapCohortCheck[];
  temperature: {
    sampleCount: 3872;
    meanAbsDifferenceF: number;
    maxAbsDifferenceF: number;
    cities: readonly {
      cityId: string;
      sampleCount: 121;
      meanAbsDifferenceF: number;
      maxAbsDifferenceF: number;
    }[];
  };
  ratings: {
    forecastCount: number;
    bandChanges: number;
  };
  durationMs: number;
};

export function comparePierCastLakeMapBatches(input: {
  archived: AvailableBatch;
  lakeMap: AvailableBatch;
  evaluationTime: string;
  cohorts: readonly PierCastLakeMapCohortCheck[];
  durationMs: number;
}): PierCastLakeMapComparison {
  if (
    input.archived.status !== "available" ||
    input.lakeMap.status !== "available" ||
    input.cohorts.length !== 7 ||
    input.cohorts.some((cohort) =>
      cohort.source !== "lake_map" || cohort.issuedAt !== input.lakeMap.issuedAt
    )
  ) {
    throw new Error("Lake-map comparison requires seven same-cycle cohorts.");
  }
  if (
    Date.parse(input.archived.issuedAt) !== Date.parse(input.lakeMap.issuedAt)
  ) {
    throw new Error(
      `Lake-map cycle ${input.lakeMap.issuedAt} does not match committed cycle ${input.archived.issuedAt}.`,
    );
  }

  const archivedSamples = sampleMap(input.archived);
  const lakeMapSamples = sampleMap(input.lakeMap);
  if (archivedSamples.size !== 3872 || lakeMapSamples.size !== 3872) {
    throw new Error("Lake-map comparison requires 3,872 unique samples.");
  }
  let differenceSumF = 0;
  let maxAbsDifferenceF = 0;
  const differencesByCity = new Map<string, number[]>();
  for (const [key, archived] of archivedSamples) {
    const current = lakeMapSamples.get(key);
    if (!current) throw new Error("Lake-map comparison sample sets differ.");
    const differenceF = Math.abs(current - archived) * 9 / 5;
    differenceSumF += differenceF;
    maxAbsDifferenceF = Math.max(maxAbsDifferenceF, differenceF);
    const cityId = key.slice(0, key.lastIndexOf(":"));
    const cityDifferences = differencesByCity.get(cityId) ?? [];
    cityDifferences.push(differenceF);
    differencesByCity.set(cityId, cityDifferences);
  }

  const archivedRatings = ratingMap(input.archived, input.evaluationTime);
  const lakeMapRatings = ratingMap(input.lakeMap, input.evaluationTime);
  if (archivedRatings.size !== lakeMapRatings.size) {
    throw new Error("Lake-map comparison rating sets differ.");
  }
  let bandChanges = 0;
  for (const [key, archivedBand] of archivedRatings) {
    if (!lakeMapRatings.has(key)) {
      throw new Error("Lake-map comparison rating sets differ.");
    }
    if (lakeMapRatings.get(key) !== archivedBand) bandChanges += 1;
  }

  return {
    status: "compared",
    mode: "read_only",
    issuedAt: input.lakeMap.issuedAt,
    cohorts: input.cohorts,
    temperature: {
      sampleCount: 3872,
      meanAbsDifferenceF: differenceSumF / 3872,
      maxAbsDifferenceF,
      cities: [...differencesByCity.entries()].sort(([left], [right]) =>
        left.localeCompare(right)
      ).map(([cityId, differences]) => {
        if (differences.length !== 121) {
          throw new Error("Lake-map comparison city timeline is incomplete.");
        }
        return {
          cityId,
          sampleCount: 121 as const,
          meanAbsDifferenceF: differences.reduce(
            (sum, difference) => sum + difference,
            0,
          ) / differences.length,
          maxAbsDifferenceF: Math.max(...differences),
        };
      }),
    },
    ratings: {
      forecastCount: lakeMapRatings.size,
      bandChanges,
    },
    durationMs: input.durationMs,
  };
}

function sampleMap(batch: AvailableBatch): Map<string, number> {
  const samples = new Map<string, number>();
  for (const city of batch.cities) {
    for (const sample of city.samples) {
      const key = `${sample.cityId}:${sample.forecastHour}`;
      if (samples.has(key)) {
        throw new Error("Lake-map comparison contains duplicate samples.");
      }
      samples.set(key, sample.temperatureC);
    }
  }
  return samples;
}

function ratingMap(
  batch: AvailableBatch,
  evaluationTime: string,
): Map<string, string> {
  const outlook = buildPierCastV3ReviewOutlook({ batch, evaluationTime });
  const ratings = new Map<string, string>();
  for (const city of outlook.cities) {
    for (const [leadDay, date] of city.dates.entries()) {
      for (const species of date.species) {
        const key = `${city.cityId}:${species.speciesId}:${leadDay}`;
        const band = species.biological.status === "available"
          ? species.biological.label
          : species.biological.status;
        ratings.set(key, band);
      }
    }
  }
  return ratings;
}
