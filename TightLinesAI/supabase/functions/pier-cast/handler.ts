import { leaderboardOnly, PierCastAccessError } from "./reportAccess.ts";
import {
  buildPierCastCatalog,
  parsePierCastShadowOutcomeInput,
  type PierCastReviewOutlookResponse,
  type PierCastShadowOutcomeCommit,
  type PierCastShadowOutcomeInput,
  type PierCastShadowReviewResponse,
} from "../_shared/pierCastEngine/index.ts";
import type { PierCastV3ReviewOutlookResponse } from "../_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";

export const PIER_CAST_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-user-token",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...PIER_CAST_CORS_HEADERS,
    },
  });
}

function error(message: string, code: string, status: number): Response {
  return json({ error: code, message }, status);
}

export type PierCastHandlerDependencies = {
  readLeaderboard?: () => Promise<ReturnType<typeof leaderboardOnly> | null>;
  readCityReport?: (request: Request, cityId: string) => Promise<unknown>;
  readSavedReport?: (request: Request) => Promise<unknown>;
  authorizeReview: (request: Request) => Promise<boolean>;
  readReviewOutlook: () => Promise<PierCastReviewOutlookResponse | null>;
  readExpansionReviewOutlook?: () => Promise<
    PierCastReviewOutlookResponse | null
  >;
  readV3ReviewOutlook?: () => Promise<PierCastV3ReviewOutlookResponse | null>;
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
    if (
      url.pathname.endsWith("/leaderboard") ||
      url.pathname.endsWith("/report") || url.pathname.endsWith("/saved-report")
    ) {
      if (request.method !== "GET") {
        return error("Method not allowed.", "method_not_allowed", 405);
      }
      try {
        if (
          url.pathname.endsWith("/saved-report") && dependencies.readSavedReport
        ) return json(await dependencies.readSavedReport(request));
        if (url.pathname.endsWith("/report") && dependencies.readCityReport) {
          const cityId = url.searchParams.get("cityId");
          if (!cityId || !/^[a-z_]{3,80}$/.test(cityId)) {
            return error("Choose a city.", "invalid_city", 400);
          }
          return json(await dependencies.readCityReport(request, cityId));
        }
        if (!url.pathname.endsWith("/leaderboard")) {
          return error("Route unavailable.", "not_found", 404);
        }
        const leaderboard = await dependencies.readLeaderboard?.();
        return leaderboard ? json(leaderboard) : error(
          "PierCast is not publicly available yet.",
          "pier_cast_unavailable",
          503,
        );
      } catch (caught) {
        if (caught instanceof PierCastAccessError) {
          return error(caught.message, caught.code, caught.status);
        }
        return error(
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
    const shadowReview = url.pathname.endsWith("/review/shadow");
    const shadowOutcome = url.pathname.endsWith("/review/outcomes");
    if (
      reviewCatalog || reviewOutlook || expansionReviewOutlook ||
      v3ReviewOutlook ||
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
          ? json(buildPierCastCatalog("review"))
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
            "No coherent same-issue nine-city Formula v3 cycle is available.",
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
      return json(buildPierCastCatalog("public"));
    }

    if (request.method !== "GET") {
      return error("Method not allowed.", "method_not_allowed", 405);
    }

    return error("Unknown PierCast route.", "not_found", 404);
  };
}
