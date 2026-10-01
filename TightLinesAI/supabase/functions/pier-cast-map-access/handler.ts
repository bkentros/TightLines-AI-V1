/**
 * POST /functions/v1/pier-cast-map-access  { visitId }
 * → { pass, expiresAt, access: "subscriber" | "free_visit", visitsUsed, visitsAllowed }
 *
 * Paid accounts always get a pass. Free accounts get one for each of their
 * first PIER_CAST_FREE_MAP_VISITS visits (counted on the server, per account);
 * after that the answer is 403 subscription_required and the app shows the
 * paywall. The same visitId (one per opening of the map screen) can ask again
 * for retries and renewals without using another visit.
 */
import { createPierCastMapPass } from "../_shared/pierCastMapPass.ts";

export const PIER_CAST_FREE_MAP_VISITS = 2;
const VISIT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class MapAccessError extends Error {
  constructor(readonly code: string, message: string, readonly status: number) {
    super(message);
  }
}

export type MapAccessDependencies = {
  /** { userId, free } for the signed-in account, or throws MapAccessError(401). */
  account: (request: Request) => Promise<{ userId: string; free: boolean }>;
  /** free visits used including this one; throws MapAccessError(403) when none are left */
  claimVisit: (userId: string, visitId: string, allowed: number) => Promise<number>;
  /** rate-limits pass minting per signed-in account. */
  claimPassIssue: (userId: string) => Promise<void>;
  secret: () => string | undefined;
  now?: () => number;
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-user-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

export function createMapAccessHandler(deps: MapAccessDependencies) {
  return async (request: Request): Promise<Response> => {
    if (request.method === "OPTIONS") return new Response("ok", { headers: CORS });
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed", message: "Method not allowed." }, 405);
    }
    try {
      let body: unknown = null;
      try {
        body = await request.json();
      } catch {
        body = null;
      }
      const visitId = (body as { visitId?: unknown } | null)?.visitId;
      if (typeof visitId !== "string" || !VISIT_ID.test(visitId)) {
        return json({ error: "invalid_visit", message: "Missing map visit." }, 400);
      }
      const { userId, free } = await deps.account(request);
      await deps.claimPassIssue(userId);
      const visitsUsed = free
        ? await deps.claimVisit(userId, visitId.toLowerCase(), PIER_CAST_FREE_MAP_VISITS)
        : 0;
      const secret = deps.secret();
      if (!secret) throw new Error("Map pass secret is not configured.");
      const nowSeconds = Math.floor((deps.now?.() ?? Date.now()) / 1000);
      const { pass, expiresAt } = await createPierCastMapPass(secret, nowSeconds, undefined, userId);
      return json({
        pass,
        expiresAt,
        access: free ? "free_visit" : "subscriber",
        visitsUsed,
        visitsAllowed: PIER_CAST_FREE_MAP_VISITS,
      });
    } catch (caught) {
      if (caught instanceof MapAccessError) {
        return json({ error: caught.code, message: caught.message }, caught.status);
      }
      console.error(JSON.stringify({
        event: "pier_cast_map_access_failed",
        message: caught instanceof Error ? caught.message : String(caught),
      }));
      return json({ error: "map_access_unavailable", message: "The lake map is unavailable right now." }, 500);
    }
  };
}
