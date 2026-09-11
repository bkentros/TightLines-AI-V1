import { captureAnalytics } from "./analytics";
import { getValidAccessToken } from "./supabase";
import type {
  PierCastCatalogResponse,
  PierCastReviewOutlookResponse,
  PierCastShadowOutcomeCommit,
  PierCastShadowOutcomeInput,
  PierCastShadowReviewResponse,
} from "./pierCastContracts";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const CLIENT_TIMEOUT_MS = 15_000;

export class PierCastRequestError extends Error {
  constructor(
    message: string,
    readonly code: string | null,
    readonly status: number,
  ) {
    super(message);
    this.name = "PierCastRequestError";
  }
}

export function fetchPierCastCatalog(): Promise<PierCastCatalogResponse> {
  return pierCastGet<PierCastCatalogResponse>("catalog", false);
}

export function fetchPierCastOwnerReviewCatalog(): Promise<
  PierCastCatalogResponse
> {
  return pierCastGet<PierCastCatalogResponse>("review/catalog", true);
}

export function fetchPierCastOwnerReviewOutlook(): Promise<
  PierCastReviewOutlookResponse
> {
  return pierCastGet<PierCastReviewOutlookResponse>("review/outlook", true);
}

export function fetchPierCastShadowReview(): Promise<
  PierCastShadowReviewResponse
> {
  return pierCastGet<PierCastShadowReviewResponse>("review/shadow", true);
}

export function recordPierCastShadowOutcome(
  outcome: PierCastShadowOutcomeInput,
): Promise<PierCastShadowOutcomeCommit> {
  return pierCastRequest<PierCastShadowOutcomeCommit>(
    "review/outcomes",
    true,
    "POST",
    outcome,
  );
}

async function pierCastGet<ResponseType>(
  path: "catalog" | "review/catalog" | "review/outlook" | "review/shadow",
  requireAuth: boolean,
): Promise<ResponseType> {
  return pierCastRequest<ResponseType>(path, requireAuth, "GET");
}

async function pierCastRequest<ResponseType>(
  path:
    | "catalog"
    | "review/catalog"
    | "review/outlook"
    | "review/shadow"
    | "review/outcomes",
  requireAuth: boolean,
  method: "GET" | "POST",
  body?: unknown,
): Promise<ResponseType> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration for PierCast.");
  }
  const headers: Record<string, string> = {
    Accept: "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };
  if (requireAuth) headers["x-user-token"] = await getValidAccessToken();
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  let failureTracked = false;
  captureAnalytics("pier_cast_request_started", { path });
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/pier-cast/${path}`,
      {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      },
    );
    const text = await response.text();
    const parsed = parseJsonOrText(text);
    if (!response.ok) {
      captureAnalytics("pier_cast_request_failed", {
        path,
        status: response.status,
        duration_ms: Date.now() - startedAt,
      });
      failureTracked = true;
      throw new PierCastRequestError(
        readErrorMessage(parsed, response.status),
        readErrorCode(parsed),
        response.status,
      );
    }
    captureAnalytics("pier_cast_request_succeeded", {
      path,
      status: response.status,
      duration_ms: Date.now() - startedAt,
    });
    return parsed as ResponseType;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      captureAnalytics("pier_cast_request_failed", {
        path,
        status: 0,
        duration_ms: Date.now() - startedAt,
        reason: "timeout",
      });
      throw new Error("PierCast request timed out. Please try again.");
    }
    if (!failureTracked) {
      captureAnalytics("pier_cast_request_failed", {
        path,
        status: 0,
        duration_ms: Date.now() - startedAt,
        reason: "network",
      });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonOrText(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorCode(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const code = (parsed as { error?: unknown }).error;
  return typeof code === "string" && code.length > 0 ? code : null;
}

function readErrorMessage(parsed: unknown, status: number): string {
  if (typeof parsed === "string" && parsed.length > 0) return parsed;
  if (parsed && typeof parsed === "object") {
    const body = parsed as { message?: unknown; error?: unknown };
    if (typeof body.message === "string" && body.message.length > 0) {
      return body.message;
    }
    if (typeof body.error === "string" && body.error.length > 0) {
      return body.error;
    }
  }
  return `PierCast request failed with status ${status}.`;
}
