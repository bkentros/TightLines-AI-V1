import { getValidAccessToken } from "./supabase";
import { captureAnalytics } from "./analytics";
import type {
  RiverRunCatalogResponse,
  RiverRunSnapshotResponse,
} from "./riverRunContracts";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const CLIENT_TIMEOUT_MS = 15_000;

type RiverRunSnapshotParams = {
  riverId: string;
  runId: string;
  presentationState: string;
};

export class RiverRunRequestError extends Error {
  constructor(
    message: string,
    readonly code: string | null,
    readonly status: number,
  ) {
    super(message);
    this.name = "RiverRunRequestError";
  }
}

export async function fetchRiverRunCatalog(): Promise<RiverRunCatalogResponse> {
  return riverRunGet<RiverRunCatalogResponse>("rivers");
}

export async function fetchRiverRunOwnerReviewCatalog(): Promise<
  RiverRunCatalogResponse
> {
  return riverRunGet<RiverRunCatalogResponse>("review/rivers", undefined, {
    requireAuth: true,
  });
}

export async function fetchRiverRunSnapshot(
  params: RiverRunSnapshotParams,
): Promise<RiverRunSnapshotResponse> {
  return riverRunGet<RiverRunSnapshotResponse>("snapshot", params, {
    requireAuth: true,
  });
}

export async function fetchRiverRunOwnerReviewSnapshot(
  params: RiverRunSnapshotParams,
): Promise<RiverRunSnapshotResponse> {
  return riverRunGet<RiverRunSnapshotResponse>("review/snapshot", params, {
    requireAuth: true,
  });
}

async function riverRunGet<TResponse>(
  path: "rivers" | "snapshot" | "review/rivers" | "review/snapshot",
  params?: Record<string, string>,
  options: { requireAuth?: boolean } = {},
): Promise<TResponse> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase configuration for River Migration.");
  }

  const url = new URL(`${supabaseUrl}/functions/v1/river-run/${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };

  if (options.requireAuth) {
    headers["x-user-token"] = await getValidAccessToken();
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  let failureTracked = false;
  captureAnalytics("river_run_request_started", { path });
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    const text = await response.text();
    const parsed = parseJsonOrText(text);

    if (!response.ok) {
      captureAnalytics("river_run_request_failed", {
        path,
        status: response.status,
        duration_ms: Date.now() - startedAt,
      });
      failureTracked = true;
      throw new RiverRunRequestError(
        readErrorMessage(parsed, response.status),
        readErrorCode(parsed),
        response.status,
      );
    }

    captureAnalytics("river_run_request_succeeded", {
      path,
      status: response.status,
      duration_ms: Date.now() - startedAt,
    });
    return parsed as TResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      captureAnalytics("river_run_request_failed", {
        path,
        status: 0,
        duration_ms: Date.now() - startedAt,
        reason: "timeout",
      });
      throw new Error("River Migration request timed out. Please try again.");
    }
    if (!failureTracked) {
      captureAnalytics("river_run_request_failed", {
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

function readErrorCode(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const code = (parsed as { error?: unknown }).error;
  return typeof code === "string" && code.length > 0 ? code : null;
}

function parseJsonOrText(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
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
  return `River Migration request failed with status ${status}.`;
}
