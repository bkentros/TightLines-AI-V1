const HOUR_MS = 60 * 60 * 1000;

export const PIER_CAST_STANDARD_FALLBACK_HOURS = 24;
export const PIER_CAST_EXTENDED_OUTAGE_FALLBACK_HOURS = 72;

export const PIER_CAST_EXPIRED_FORECAST_MESSAGE =
  "NOAA's forecast is delayed and the latest safe PierCast forecast has expired.";

export const PIER_CAST_DELAYED_FORECAST_NOTICE =
  "NOAA forecast delivery is delayed; this is the latest available cycle.";

export function extendedFallbackArchiveTimes(now: Date): Date[] {
  // Archive RPCs intentionally cap reads at 24 hours and reject future cycles.
  // Two shifted windows cover (24h, 48h] and (48h, 72h] without widening the
  // database contract or increasing load during normal operation.
  return [24, 48].map((shiftHours) =>
    new Date(now.getTime() - shiftHours * HOUR_MS)
  );
}

export function extendedFallbackCycleAgeHours(
  now: Date,
  issuedAt: string,
): number | null {
  const ageHours = (now.getTime() - Date.parse(issuedAt)) / HOUR_MS;
  return Number.isFinite(ageHours) &&
      ageHours > PIER_CAST_STANDARD_FALLBACK_HOURS &&
      ageHours <= PIER_CAST_EXTENDED_OUTAGE_FALLBACK_HOURS
    ? ageHours
    : null;
}

export function forecastHorizonIncludes<
  T extends {
    cities: ReadonlyArray<{
      status: "available" | "unavailable";
      samples: ReadonlyArray<{ validAt: string }>;
    }>;
  },
>(batch: T, now: Date): boolean {
  const nowMs = now.getTime();
  if (!Number.isFinite(nowMs) || batch.cities.length === 0) return false;
  return batch.cities.every((city) => {
    if (city.status !== "available" || city.samples.length === 0) return false;
    const coverageEnd = Math.max(
      ...city.samples.map((sample) => Date.parse(sample.validAt)),
    );
    return Number.isFinite(coverageEnd) && nowMs <= coverageEnd;
  });
}

export function labelDelayedForecast<
  T extends {
    generatedAt: string;
    disclosure: string;
    source: { cycleAgeHours: number };
  },
>(outlook: T, fetchedAt: string, cycleAgeHours: number): T {
  return {
    ...outlook,
    // Shipped clients label this field as "Updated … ago". Use the actual
    // archive fetch time so an emergency fallback never looks freshly issued.
    generatedAt: fetchedAt,
    disclosure: `${outlook.disclosure} ${PIER_CAST_DELAYED_FORECAST_NOTICE}`,
    source: { ...outlook.source, cycleAgeHours },
  };
}
