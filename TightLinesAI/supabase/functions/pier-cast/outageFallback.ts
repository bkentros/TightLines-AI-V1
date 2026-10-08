const HOUR_MS = 60 * 60 * 1000;

export const PIER_CAST_STANDARD_FALLBACK_HOURS = 24;
export const PIER_CAST_EXTENDED_OUTAGE_FALLBACK_HOURS = 36;

export const PIER_CAST_DELAYED_FORECAST_NOTICE =
  "NOAA forecast delivery is delayed; this is the latest available cycle.";

export function extendedFallbackArchiveTime(now: Date): Date {
  return new Date(
    now.getTime() -
      (PIER_CAST_EXTENDED_OUTAGE_FALLBACK_HOURS -
          PIER_CAST_STANDARD_FALLBACK_HOURS) * HOUR_MS,
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
