import type { PierCastMapCity } from "./pierCastMap";
import {
  pierCastWindCompassDirection,
  type PierCastWindFramePoint,
  pierCastWindTravelDirection,
} from "./pierCastWind";

export type PierCastShorelineWindSetup =
  | "onshore"
  | "alongshore"
  | "offshore";

export type PierCastWindCaution = "none" | "elevated_gusts" | "rough_water";

export type PierCastCityWindInsight = {
  cityId: string;
  nodeId: string;
  setup: PierCastShorelineWindSetup;
  setupLabel: "ONSHORE PUSH" | "ALONGSHORE DRIFT" | "OFFSHORE PULL";
  speedMph: number;
  gustMph: number;
  windFrom: ReturnType<typeof pierCastWindCompassDirection>;
  distanceMiles: number;
  caution: PierCastWindCaution;
};

const EARTH_RADIUS_MILES = 3_958.7613;
const MAX_NEAREST_NODE_DISTANCE_MILES = 90;

function radians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function degrees(radiansValue: number): number {
  return radiansValue * 180 / Math.PI;
}

function haversineMiles(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const deltaLatitude = radians(latitudeB - latitudeA);
  const deltaLongitude = radians(longitudeB - longitudeA);
  const latitudeARadians = radians(latitudeA);
  const latitudeBRadians = radians(latitudeB);
  const value = Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeARadians) * Math.cos(latitudeBRadians) *
      Math.sin(deltaLongitude / 2) ** 2;
  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(value));
}

/** Initial bearing from the offshore model node toward the shoreline city. */
function bearingDegrees(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const latitudeARadians = radians(latitudeA);
  const latitudeBRadians = radians(latitudeB);
  const deltaLongitude = radians(longitudeB - longitudeA);
  const y = Math.sin(deltaLongitude) * Math.cos(latitudeBRadians);
  const x = Math.cos(latitudeARadians) * Math.sin(latitudeBRadians) -
    Math.sin(latitudeARadians) * Math.cos(latitudeBRadians) *
      Math.cos(deltaLongitude);
  return (degrees(Math.atan2(y, x)) + 360) % 360;
}

function angleDifference(left: number, right: number): number {
  return Math.abs((left - right + 540) % 360 - 180);
}

export function pierCastShorelineWindSetup(
  windTravelDirectionDegrees: number,
  offshoreNodeToCityBearingDegrees: number,
): PierCastShorelineWindSetup {
  const difference = angleDifference(
    windTravelDirectionDegrees,
    offshoreNodeToCityBearingDegrees,
  );
  if (difference <= 60) return "onshore";
  if (difference >= 120) return "offshore";
  return "alongshore";
}

export function pierCastWindCaution(
  speedMph: number,
  gustMph: number,
): PierCastWindCaution {
  if (speedMph >= 20 || gustMph >= 30) return "rough_water";
  if (speedMph >= 15 || gustMph >= 24 || gustMph - speedMph >= 10) {
    return "elevated_gusts";
  }
  return "none";
}

function setupLabel(
  setup: PierCastShorelineWindSetup,
): PierCastCityWindInsight["setupLabel"] {
  if (setup === "onshore") return "ONSHORE PUSH";
  if (setup === "offshore") return "OFFSHORE PULL";
  return "ALONGSHORE DRIFT";
}

export function buildPierCastCityWindInsights(
  cities: readonly PierCastMapCity[],
  windPoints: readonly PierCastWindFramePoint[],
): Map<string, PierCastCityWindInsight> {
  const insights = new Map<string, PierCastCityWindInsight>();
  for (const city of cities) {
    let nearest: PierCastWindFramePoint | null = null;
    let nearestDistanceMiles = Number.POSITIVE_INFINITY;
    for (const point of windPoints) {
      const distanceMiles = haversineMiles(
        city.latitude,
        city.longitude,
        point.latitude,
        point.longitude,
      );
      if (distanceMiles >= nearestDistanceMiles) continue;
      nearest = point;
      nearestDistanceMiles = distanceMiles;
    }
    if (!nearest || nearestDistanceMiles > MAX_NEAREST_NODE_DISTANCE_MILES) {
      continue;
    }
    const shoreBearing = bearingDegrees(
      nearest.latitude,
      nearest.longitude,
      city.latitude,
      city.longitude,
    );
    const setup = pierCastShorelineWindSetup(
      pierCastWindTravelDirection(nearest.directionDegrees),
      shoreBearing,
    );
    insights.set(city.city.cityId, {
      cityId: city.city.cityId,
      nodeId: nearest.nodeId,
      setup,
      setupLabel: setupLabel(setup),
      speedMph: Math.round(nearest.speedMph),
      gustMph: Math.round(nearest.gustMph),
      windFrom: pierCastWindCompassDirection(nearest.directionDegrees),
      distanceMiles: Math.round(nearestDistanceMiles * 10) / 10,
      caution: pierCastWindCaution(nearest.speedMph, nearest.gustMph),
    });
  }
  return insights;
}

export function summarizePierCastCityWindInsights(
  insights: ReadonlyMap<string, PierCastCityWindInsight>,
): {
  onshore: number;
  alongshore: number;
  offshore: number;
  cautions: number;
} {
  const summary = { onshore: 0, alongshore: 0, offshore: 0, cautions: 0 };
  for (const insight of insights.values()) {
    summary[insight.setup] += 1;
    if (insight.caution !== "none") summary.cautions += 1;
  }
  return summary;
}
