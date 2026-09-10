import { buildPierCastCatalog } from "../_shared/pierCastEngine/index.ts";

export const PIER_CAST_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, apikey, x-user-token",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...PIER_CAST_CORS_HEADERS,
    },
  });
}

function error(message: string, code: string, status: number): Response {
  return json({ error: code, message }, status);
}

export type PierCastHandlerDependencies = {
  authorizeReview: (request: Request) => Promise<boolean>;
};

export function createPierCastHandler(
  dependencies: PierCastHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: PIER_CAST_CORS_HEADERS });
    }
    if (request.method !== "GET") {
      return error("Method not allowed.", "method_not_allowed", 405);
    }

    const url = new URL(request.url);
    if (url.pathname.endsWith("/review/catalog")) {
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
      return json(buildPierCastCatalog("review"));
    }

    if (url.pathname.endsWith("/catalog")) {
      return json(buildPierCastCatalog("public"));
    }

    return error("Unknown PierCast route.", "not_found", 404);
  };
}
