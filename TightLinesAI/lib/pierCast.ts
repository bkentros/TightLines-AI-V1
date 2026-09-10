import { captureAnalytics } from "./analytics";
import { getValidAccessToken } from "./supabase";
import type { PierCastCatalogResponse } from "./pierCastContracts";

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
  return pierCastGet("catalog", false);
}

export function fetchPierCastOwnerReviewCatalog(): Promise<
  PierCastCatalogResponse
> {
  return pierCastGet("review/catalog", true);
}

async function pierCastGet(
  path: "catalog" | "review/catalog",
  requireAuth: boolean,
): Promise<PierCastCatalogResponse> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration for PierCast.");
  }
  const headers: Record<string, string> = {
    Accept: "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };
  if (requireAuth) headers["x-user-token"] = await getValidAccessToken();

  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  let failureTracked = false;
  captureAnalytics("pier_cast_request_started", { path });
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/pier-cast/${path}`,
      { method: "GET", headers, signal: controller.signal },
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
    return parsed as PierCastCatalogResponse;
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
