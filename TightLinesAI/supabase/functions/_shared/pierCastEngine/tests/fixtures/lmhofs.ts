import { PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS } from "../../config/coreCalibration.ts";
import type {
  PierCastLmhofsBatch,
  PierCastLmhofsSample,
} from "../../providers/lmhofs.ts";
import type { PierCastCityId } from "../../types.ts";

export const TEST_LMHOFS_ISSUED_AT = "2026-09-09T18:00:00.000Z";

export function completeLmhofsBatch(): Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
> {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const cities = Object.entries(PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS).map(
    ([cityId, location]) => {
      const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
        cityId: cityId as PierCastCityId,
        sourceId: `${cityId}__test`,
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        issuedAt: TEST_LMHOFS_ISSUED_AT,
        forecastHour,
        validAt: new Date(
          Date.parse(TEST_LMHOFS_ISSUED_AT) + forecastHour * 60 * 60 * 1000,
        ).toISOString(),
        temperatureC: 15,
        rawUnit: "C",
        verticalSelection: "surface",
        depthIndex: 0,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        sourceUrl: `https://example.test/${cityId}/${forecastHour}`,
      }));
      return {
        status: "available" as const,
        cityId: cityId as PierCastCityId,
        sourceId: `${cityId}__test`,
        issuedAt: TEST_LMHOFS_ISSUED_AT,
        requestedForecastHours: hours,
        coverageStart: samples[0].validAt,
        coverageEnd: samples[120].validAt,
        samples,
        reasonCodes: [] as const,
      };
    },
  );
  return {
    status: "available",
    issuedAt: TEST_LMHOFS_ISSUED_AT,
    fetchedAt: "2026-09-10T00:31:46.416Z",
    cycleAgeHours: 6.5,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities,
    diagnostics: [],
  };
}

export function unavailableLmhofsBatch(): Extract<
  PierCastLmhofsBatch,
  { status: "unavailable" }
> {
  return {
    status: "unavailable",
    issuedAt: null,
    fetchedAt: "2026-09-10T00:31:46.416Z",
    cycleAgeHours: null,
    fullHorizonRequested: true,
    requestedForecastHours: Array.from({ length: 121 }, (_, hour) => hour),
    cities: [],
    diagnostics: [{
      code: "request_failed",
      message: "provider offline",
    }],
  };
}
