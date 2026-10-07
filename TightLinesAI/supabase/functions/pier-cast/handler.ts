import {
  leaderboardOnly,
  PierCastAccessError,
  temperatureMapOnly,
} from "./reportAccess.ts";
import {
  buildPierCastCatalog,
  parsePierCastShadowOutcomeInput,
  type PierCastReviewOutlookResponse,
  type PierCastShadowOutcomeCommit,
  type PierCastShadowOutcomeInput,
  type PierCastShadowReviewResponse,
} from "../_shared/pierCastEngine/index.ts";
import type { PierCastV3ReviewOutlookResponse } from "../_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";
import type { PierCastMapFoundationResponse } from "../../../lib/pierCastContracts.ts";
import type {
  PierCastConditionsCatalogResponseV4,
  PierCastConditionsMapResponseV4,
  PierCastConditionsReviewResponseV4,
  PierCastLeaderboardResponseV4,
  PierCastObservedTemperatureMapResponseV1,
} from "../../../lib/pierCastConditionsV4.ts";
import {
  rateLimitHeaders,
  type RateLimitResult,
} from "../_shared/rateLimit.ts";

export const PIER_CAST_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-user-token",
  "Access-Control-Expose-Headers":
    "Deprecation, X-PierCast-Contract, X-PierCast-Replacement",
};

export const PIER_CAST_CONDITIONS_HEADERS = {
  "X-PierCast-Contract": "conditions-v4",
};

export const PIER_CAST_LEGACY_HEADERS = {
  "Deprecation": "true",
  "X-PierCast-Contract": "score-v3-compatibility",
  "X-PierCast-Replacement": "conditions-v4",
};

function json(
  body: unknown,
  status = 200,
  cacheControl = "no-store",
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
      ...PIER_CAST_CORS_HEADERS,
      ...headers,
    },
  });
}

function error(message: string, code: string, status: number): Response {
  return json({ error: code, message }, status);
}

function representationEtag(
  route: string,
  speciesId: string | null,
  cycle: unknown,
): string | null {
  if (typeof cycle !== "string" || cycle.length === 0) return null;
  const token = `${route}:${speciesId ?? "all"}:${cycle}`.replace(
    /[^a-zA-Z0-9:_.-]/g,
    "_",
  );
  return `W/"${token}"`;
}

export type PierCastHandlerDependencies = {
  checkRateLimit?: (request: Request) => Promise<RateLimitResult | null>;
  readPublicCatalog?: () => ReturnType<typeof buildPierCastCatalog>;
  readConditionsCatalog?: () => PierCastConditionsCatalogResponseV4;
  readLeaderboard?: () => Promise<ReturnType<typeof leaderboardOnly> | null>;
  readTemperatureMap?: () => Promise<
    ReturnType<typeof temperatureMapOnly> | null
  >;
  readMapFoundation?: () => Promise<PierCastMapFoundationResponse | null>;
  readConditionsLeaderboard?: (
    speciesId: string | null,
  ) => Promise<PierCastLeaderboardResponseV4 | null>;
  readConditionsMap?: (
    speciesId: string | null,
  ) => Promise<PierCastConditionsMapResponseV4 | null>;
  readObservedTemperatureMap?: () => Promise<
    PierCastObservedTemperatureMapResponseV1 | null
  >;
  readConditionsCityReport?: (
    request: Request,
    cityId: string,
    speciesId: string,
  ) => Promise<unknown>;
  readSavedConditionsReport?: (
    request: Request,
    speciesId: string | null,
  ) => Promise<unknown>;
  readCityReport?: (request: Request, cityId: string) => Promise<unknown>;
  readSavedReport?: (request: Request) => Promise<unknown>;
  recordLegacyRouteUse?: (
    route: "leaderboard" | "temperature-map" | "report" | "saved-report",
  ) => void | Promise<void>;
  authorizeReview: (request: Request) => Promise<boolean>;
  readReviewOutlook: () => Promise<PierCastReviewOutlookResponse | null>;
  readExpansionReviewOutlook?: () => Promise<
    PierCastReviewOutlookResponse | null
  >;
  readV3ReviewOutlook?: () => Promise<PierCastV3ReviewOutlookResponse | null>;
  readV4ReviewOutlook?: () => Promise<
    PierCastConditionsReviewResponseV4 | null
  >;
  readShadowReview: () => Promise<PierCastShadowReviewResponse>;
  recordShadowOutcome: (
    input: PierCastShadowOutcomeInput,
  ) => Promise<PierCastShadowOutcomeCommit>;
};

export function createPierCastHandler(
  dependencies: PierCastHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: PIER_CAST_CORS_HEADERS });
    }
    const url = new URL(request.url);
    const conditionsLeaderboard = url.pathname.endsWith(
      "/conditions/leaderboard",
    );
    const conditionsCatalog = url.pathname.endsWith("/conditions/catalog");
    const conditionsMap = url.pathname.endsWith("/conditions/map");
    const observedTemperatureMap = url.pathname.endsWith(
      "/observations/temperature-map",
    );
    const conditionsReport = url.pathname.endsWith("/conditions/report");
    const savedConditionsReport = url.pathname.endsWith(
      "/conditions/saved-report",
    );
    const legacyRoute =
      !conditionsCatalog && !conditionsLeaderboard && !conditionsMap &&
        !observedTemperatureMap && !conditionsReport && !savedConditionsReport
        ? url.pathname.endsWith("/temperature-map")
          ? "temperature-map"
          : url.pathname.endsWith("/saved-report")
          ? "saved-report"
          : url.pathname.endsWith("/report")
          ? "report"
          : url.pathname.endsWith("/leaderboard")
          ? "leaderboard"
          : null
        : null;
    const contractHeaders = legacyRoute
      ? PIER_CAST_LEGACY_HEADERS
      : conditionsCatalog || conditionsLeaderboard || conditionsMap ||
          observedTemperatureMap ||
          conditionsReport || savedConditionsReport
      ? PIER_CAST_CONDITIONS_HEADERS
      : {};
    const routeJson = (
      body: unknown,
      status = 200,
      cacheControl = "no-store",
      extraHeaders: Record<string, string> = {},
    ) =>
      json(body, status, cacheControl, {
        ...contractHeaders,
        ...extraHeaders,
      });
    const routeError = (message: string, code: string, status: number) =>
      routeJson({ error: code, message }, status);
    if (dependencies.checkRateLimit) {
      const limit = await dependencies.checkRateLimit(request);
      if (limit && !limit.allowed) {
        return routeJson(
          {
            error: "rate_limited",
            message: "Too many requests. Please wait a moment and try again.",
            retryAfterSeconds: limit.retryAfterSeconds,
          },
          429,
          "no-store",
          rateLimitHeaders(limit),
        );
      }
    }
    if (
      conditionsCatalog || url.pathname.endsWith("/leaderboard") ||
      conditionsMap ||
      observedTemperatureMap ||
      url.pathname.endsWith("/temperature-map") ||
      url.pathname.endsWith("/map-foundation") ||
      url.pathname.endsWith("/report") || url.pathname.endsWith("/saved-report")
    ) {
      if (request.method !== "GET") {
        return routeError("Method not allowed.", "method_not_allowed", 405);
      }
      try {
        if (legacyRoute && dependencies.recordLegacyRouteUse) {
          try {
            await dependencies.recordLegacyRouteUse(legacyRoute);
          } catch {
            // Compatibility reads must not fail because observability failed.
          }
        }
        if (conditionsCatalog) {
          if (!dependencies.readConditionsCatalog) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          return routeJson(
            dependencies.readConditionsCatalog(),
            200,
            "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
          );
        }
        if (savedConditionsReport) {
          if (!dependencies.readSavedConditionsReport) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          const speciesId = validatedSpeciesId(
            url.searchParams.get("speciesId"),
          );
          if (speciesId === false) {
            return routeError(
              "Choose a valid species.",
              "invalid_species",
              400,
            );
          }
          return routeJson(
            await dependencies.readSavedConditionsReport(request, speciesId),
          );
        }
        if (conditionsReport) {
          if (!dependencies.readConditionsCityReport) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          const cityId = url.searchParams.get("cityId");
          const speciesId = validatedSpeciesId(
            url.searchParams.get("speciesId"),
          );
          if (!cityId || !/^[a-z_]{3,80}$/.test(cityId)) {
            return routeError("Choose a city.", "invalid_city", 400);
          }
          if (!speciesId) {
            return routeError("Choose a species.", "invalid_species", 400);
          }
          return routeJson(
            await dependencies.readConditionsCityReport(
              request,
              cityId,
              speciesId,
            ),
          );
        }
        if (conditionsLeaderboard) {
          if (!dependencies.readConditionsLeaderboard) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          const speciesId = validatedSpeciesId(
            url.searchParams.get("speciesId"),
          );
          if (speciesId === false) {
            return routeError(
              "Choose a valid species.",
              "invalid_species",
              400,
            );
          }
          const leaderboard = await dependencies.readConditionsLeaderboard(
            speciesId,
          );
          const etag = representationEtag(
            "conditions-leaderboard",
            speciesId,
            (leaderboard as { sourceIssuedAt?: unknown } | null)
              ?.sourceIssuedAt,
          );
          return leaderboard
            ? routeJson(
              leaderboard,
              200,
              "public, max-age=30, s-maxage=60, stale-while-revalidate=120",
              etag ? { ETag: etag } : {},
            )
            : routeError(
              "PierCast conditions are not available right now.",
              "pier_cast_conditions_unavailable",
              503,
            );
        }
        if (conditionsMap) {
          if (!dependencies.readConditionsMap) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          const speciesId = validatedSpeciesId(
            url.searchParams.get("speciesId"),
          );
          if (speciesId === false) {
            return routeError(
              "Choose a valid species.",
              "invalid_species",
              400,
            );
          }
          const map = await dependencies.readConditionsMap(speciesId);
          return map
            ? routeJson(
              map,
              200,
              "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
            )
            : routeError(
              "PierCast map conditions are not available right now.",
              "pier_cast_map_conditions_unavailable",
              503,
            );
        }
        if (observedTemperatureMap) {
          if (!dependencies.readObservedTemperatureMap) {
            return routeError("Route unavailable.", "not_found", 404);
          }
          const observations = await dependencies.readObservedTemperatureMap();
          return observations
            ? routeJson(
              observations,
              200,
              "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
            )
            : routeError(
              "Observed station temperatures are not available right now.",
              "pier_cast_observations_unavailable",
              503,
            );
        }
        if (
          url.pathname.endsWith("/saved-report") && dependencies.readSavedReport
        ) return routeJson(await dependencies.readSavedReport(request));
        if (url.pathname.endsWith("/report") && dependencies.readCityReport) {
          const cityId = url.searchParams.get("cityId");
          if (!cityId || !/^[a-z_]{3,80}$/.test(cityId)) {
            return routeError("Choose a city.", "invalid_city", 400);
          }
          return routeJson(await dependencies.readCityReport(request, cityId));
        }
        if (url.pathname.endsWith("/temperature-map")) {
          const temperatureMap = await dependencies.readTemperatureMap?.();
          return temperatureMap ? routeJson(temperatureMap) : routeError(
            "PierCast temperatures are not available right now.",
            "pier_cast_temperature_map_unavailable",
            503,
          );
        }
        if (url.pathname.endsWith("/map-foundation")) {
          const foundation = await dependencies.readMapFoundation?.();
          return foundation
            ? routeJson(
              foundation,
              200,
              "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
            )
            : routeError(
              "Great Lakes map data are not available right now.",
              "pier_cast_map_foundation_unavailable",
              503,
            );
        }
        if (!url.pathname.endsWith("/leaderboard")) {
          return routeError("Route unavailable.", "not_found", 404);
        }
        const leaderboard = await dependencies.readLeaderboard?.();
        const etag = representationEtag(
          "legacy-leaderboard",
          null,
          (leaderboard as { generatedAt?: unknown } | null)?.generatedAt,
        );
        return leaderboard
          ? routeJson(
            leaderboard,
            200,
            "public, max-age=30, s-maxage=60, stale-while-revalidate=120",
            etag ? { ETag: etag } : {},
          )
          : routeError(
            "PierCast is not publicly available yet.",
            "pier_cast_unavailable",
            503,
          );
      } catch (caught) {
        if (caught instanceof PierCastAccessError) {
          return routeError(caught.message, caught.code, caught.status);
        }
        return routeError(
          "PierCast access could not be verified.",
          "pier_cast_access_unavailable",
          503,
        );
      }
    }
    const reviewCatalog = url.pathname.endsWith("/review/catalog");
    const reviewOutlook = url.pathname.endsWith("/review/outlook");
    const expansionReviewOutlook = url.pathname.endsWith(
      "/review/expansion/outlook",
    );
    const v3ReviewOutlook = url.pathname.endsWith("/review/v3/outlook");
    const v4ReviewOutlook = url.pathname.endsWith("/review/v4/outlook");
    const shadowReview = url.pathname.endsWith("/review/shadow");
    const shadowOutcome = url.pathname.endsWith("/review/outcomes");
    if (
      reviewCatalog || reviewOutlook || expansionReviewOutlook ||
      v3ReviewOutlook || v4ReviewOutlook ||
      shadowReview || shadowOutcome
    ) {
      try {
        if (!await dependencies.authorizeReview(request)) {
          return error(
            "PierCast owner-review access is restricted.",
            "pier_cast_review_forbidden",
            403,
          );
        }
      } catch {
        return error(
          "PierCast review access could not be verified.",
          "pier_cast_review_access_unavailable",
          503,
        );
      }
      if (reviewCatalog) {
        return request.method === "GET"
          ? json(buildPierCastCatalog("review", "v3"))
          : error("Method not allowed.", "method_not_allowed", 405);
      }
      if (expansionReviewOutlook) {
        if (request.method !== "GET") {
          return error("Method not allowed.", "method_not_allowed", 405);
        }
        if (!dependencies.readExpansionReviewOutlook) {
          return error(
            "Wisconsin expansion shadow review is not configured.",
            "pier_cast_expansion_outlook_unavailable",
            503,
          );
        }
        try {
          const outlook = await dependencies.readExpansionReviewOutlook();
          return outlook ? json(outlook) : error(
            "No fresh Wisconsin expansion shadow cycle is available.",
            "pier_cast_expansion_outlook_unavailable",
            503,
          );
        } catch {
          return error(
            "Wisconsin expansion shadow outlook could not be generated.",
            "pier_cast_expansion_outlook_failed",
            503,
          );
        }
      }
      if (v3ReviewOutlook) {
        if (request.method !== "GET") {
          return error("Method not allowed.", "method_not_allowed", 405);
        }
        if (!dependencies.readV3ReviewOutlook) {
          return error(
            "Formula v3 shadow review is not configured.",
            "pier_cast_v3_outlook_unavailable",
            503,
          );
        }
        try {
          const outlook = await dependencies.readV3ReviewOutlook();
          return outlook ? json(outlook) : error(
            "No coherent same-issue thirty-two-city Formula v3 cycle is available.",
            "pier_cast_v3_outlook_unavailable",
            503,
          );
        } catch {
          return error(
            "Formula v3 shadow outlook could not be generated.",
            "pier_cast_v3_outlook_failed",
            503,
          );
        }
      }
      if (v4ReviewOutlook) {
        if (request.method !== "GET") {
          return error("Method not allowed.", "method_not_allowed", 405);
        }
        if (!dependencies.readV4ReviewOutlook) {
          return error(
            "Conditions v4 shadow review is not configured.",
            "pier_cast_v4_outlook_unavailable",
            503,
          );
        }
        try {
          const outlook = await dependencies.readV4ReviewOutlook();
          return outlook ? json(outlook) : error(
            "No coherent Conditions v4 shadow cycle is available.",
            "pier_cast_v4_outlook_unavailable",
            503,
          );
        } catch {
          return error(
            "Conditions v4 shadow outlook could not be generated.",
            "pier_cast_v4_outlook_failed",
            503,
          );
        }
      }
      if (shadowReview) {
        if (request.method !== "GET") {
          return error("Method not allowed.", "method_not_allowed", 405);
        }
        try {
          return json(await dependencies.readShadowReview());
        } catch {
          return error(
            "PierCast shadow-validation status could not be loaded.",
            "pier_cast_shadow_review_failed",
            503,
          );
        }
      }
      if (shadowOutcome) {
        if (request.method !== "POST") {
          return error("Method not allowed.", "method_not_allowed", 405);
        }
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return error(
            "Outcome body must be valid JSON.",
            "pier_cast_outcome_invalid",
            400,
          );
        }
        let outcome: PierCastShadowOutcomeInput;
        try {
          outcome = parsePierCastShadowOutcomeInput(body);
        } catch (caught) {
          return error(
            caught instanceof Error ? caught.message : "Outcome is invalid.",
            "pier_cast_outcome_invalid",
            400,
          );
        }
        try {
          const committed = await dependencies.recordShadowOutcome(outcome);
          return json(committed, committed.status === "committed" ? 201 : 200);
        } catch {
          return error(
            "PierCast outcome could not be recorded.",
            "pier_cast_outcome_commit_failed",
            503,
          );
        }
      }
      if (request.method !== "GET") {
        return error("Method not allowed.", "method_not_allowed", 405);
      }
      try {
        const outlook = await dependencies.readReviewOutlook();
        return outlook ? json(outlook) : error(
          "No fresh complete PierCast cycle is available for owner review.",
          "pier_cast_review_outlook_unavailable",
          503,
        );
      } catch {
        return error(
          "PierCast owner-review outlook could not be generated.",
          "pier_cast_review_outlook_failed",
          503,
        );
      }
    }

    if (url.pathname.endsWith("/catalog") && request.method === "GET") {
      return json(
        dependencies.readPublicCatalog?.() ?? buildPierCastCatalog("public"),
      );
    }

    if (request.method !== "GET") {
      return error("Method not allowed.", "method_not_allowed", 405);
    }

    return error("Unknown PierCast route.", "not_found", 404);
  };
}

function validatedSpeciesId(value: string | null): string | null | false {
  if (value === null || value === "") return null;
  return /^[a-z_]{3,80}$/.test(value) ? value : false;
}
