import {
  buildPierCastCatalog,
  parsePierCastShadowOutcomeInput,
  type PierCastReviewOutlookResponse,
  type PierCastShadowOutcomeCommit,
  type PierCastShadowOutcomeInput,
  type PierCastShadowReviewResponse,
} from "../_shared/pierCastEngine/index.ts";

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
  authorizeReview: (request: Request) => Promise<boolean>;
  readReviewOutlook: () => Promise<PierCastReviewOutlookResponse | null>;
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
    const reviewCatalog = url.pathname.endsWith("/review/catalog");
    const reviewOutlook = url.pathname.endsWith("/review/outlook");
    const shadowReview = url.pathname.endsWith("/review/shadow");
    const shadowOutcome = url.pathname.endsWith("/review/outcomes");
    if (reviewCatalog || reviewOutlook || shadowReview || shadowOutcome) {
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
