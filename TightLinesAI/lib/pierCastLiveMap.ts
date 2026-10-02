/**
 * Live Lake Map (PierCast) — the web-view contract between the app screen
 * (app/pier-cast-map.tsx) and the map page (web/lake-map, published to the
 * map storage bucket under /map/).
 *
 * App → page: before the page loads, the app sets `window.PC_APP` (see
 * pierCastLiveMapInjection). While the page runs, the app can call
 * `window.PC_PAUSE(true|false)` to stop drawing while another screen covers it.
 *
 * Page → app: JSON messages through window.ReactNativeWebView.postMessage,
 * parsed by parsePierCastLiveMapMessage. Anything else is ignored.
 */
import type { PierCastSpeciesId } from "./pierCastContracts";
import { parsePierCastTargetSpecies } from "./pierCastTargetPreference";

/**
 * The map's gatekeeper (web/lake-map/gate): serves the map only with a pass from
 * the pier-cast-map-access function. EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL overrides it.
 */
export const PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL = "https://map.finfindr.app";

/** Free accounts: map visits before the paywall (enforced on the server). */
export const PIER_CAST_FREE_MAP_VISITS = 2;
/** Passes last 2 hours; the screen renews well before that while the map is open. */
export const PIER_CAST_MAP_PASS_RENEW_MS = 90 * 60 * 1000;

/** How long the page may take to report "ready" before the screen offers a retry. */
export const PIER_CAST_LIVE_MAP_READY_TIMEOUT_MS = 30_000;

export type PierCastLiveMapUnits = "imperial" | "metric";

export type PierCastLiveMapAppConfig = {
  units: PierCastLiveMapUnits;
  species: PierCastSpeciesId | null;
  /** true when the species came from the screen that opened the map (opens the species-match view) */
  speciesFromRoute: boolean;
  cityId: string | null;
  platform: "ios" | "android" | "web" | string;
  /** free accounts: which free visit this is (shown on the map) */
  trial: { used: number; allowed: number } | null;
  bridge: 1;
};

export type PierCastMapPassResponse = {
  pass: string;
  expiresAt: string;
  access: "subscriber" | "free_visit";
  visitsUsed: number;
  visitsAllowed: number;
};

export type PierCastLiveMapMessage =
  | { type: "ready"; run: string | null; sample: boolean }
  | { type: "error"; message: string }
  | { type: "back" }
  | { type: "haptic" }
  | { type: "openCity"; cityId: string; speciesId: PierCastSpeciesId | null }
  | {
    type: "analytics";
    event: string;
    props: Record<string, string | number | boolean | null>;
  };

/** Events the page may report, and the app's analytics names for them. */
export const PIER_CAST_LIVE_MAP_ANALYTICS: Readonly<Record<string, string>> = {
  pier_opened: "pier_cast_live_map_pier_opened",
  layer_changed: "pier_cast_live_map_layer_changed",
  forecast_played: "pier_cast_live_map_forecast_played",
  buoy_opened: "pier_cast_live_map_buoy_opened",
  nws_alert_opened: "pier_cast_live_map_nws_alert_opened",
  map_data_refresh: "pier_cast_live_map_data_refresh",
};

const CITY_ID = /^[a-z0-9_]{2,64}$/;

export function pierCastLiveMapBaseUrl(
  configured: string | undefined = process.env.EXPO_PUBLIC_PIER_CAST_LIVE_MAP_URL,
): string {
  const value = (configured ?? "").trim().replace(/\/+$/, "");
  return /^https:\/\/[^\s/]+/.test(value) ? value : PIER_CAST_LIVE_MAP_DEFAULT_BASE_URL;
}

export function pierCastLiveMapPageUrl(baseUrl: string = pierCastLiveMapBaseUrl(), pass?: string): string {
  return `${baseUrl}/map/index.html?app=1${pass ? `&t=${encodeURIComponent(pass)}` : ""}`;
}

/** Hands the open page a fresh pass (the gatekeeper turns it into the page's cookie). */
export function pierCastLiveMapRenewScript(pass: string): string {
  return `window.PC_RENEW && window.PC_RENEW(${JSON.stringify(pass).replace(/</g, "\\u003c")}); true;`;
}

export function parsePierCastMapPassResponse(value: unknown): PierCastMapPassResponse | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.pass !== "string" || !/^v1\.\d+\.[\w-]+\.[\w-]+$/.test(v.pass)) return null;
  if (typeof v.expiresAt !== "string" || !Number.isFinite(Date.parse(v.expiresAt))) return null;
  if (v.access !== "subscriber" && v.access !== "free_visit") return null;
  return {
    pass: v.pass,
    expiresAt: v.expiresAt,
    access: v.access,
    visitsUsed: typeof v.visitsUsed === "number" ? v.visitsUsed : 0,
    visitsAllowed: typeof v.visitsAllowed === "number" ? v.visitsAllowed : PIER_CAST_FREE_MAP_VISITS,
  };
}

export function pierCastLiveMapInjection(config: PierCastLiveMapAppConfig): string {
  // JSON is valid JavaScript; "<" is escaped so the text can never close a script tag
  const json = JSON.stringify(config).replace(/</g, "\\u003c");
  return `window.PC_APP = ${json}; true;`;
}

export function pierCastLiveMapPauseScript(paused: boolean): string {
  return `window.PC_PAUSE && window.PC_PAUSE(${paused ? "true" : "false"}); true;`;
}

export function parsePierCastLiveMapMessage(raw: unknown): PierCastLiveMapMessage | null {
  if (typeof raw !== "string" || raw.length > 4000) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const m = data as Record<string, unknown>;
  switch (m.type) {
    case "ready":
      return {
        type: "ready",
        run: typeof m.run === "string" ? m.run.slice(0, 80) : null,
        sample: m.sample === true,
      };
    case "error":
      return { type: "error", message: typeof m.message === "string" ? m.message.slice(0, 300) : "Unknown error" };
    case "back":
      return { type: "back" };
    case "haptic":
      return { type: "haptic" };
    case "openCity":
      if (typeof m.cityId !== "string" || !CITY_ID.test(m.cityId)) return null;
      return { type: "openCity", cityId: m.cityId, speciesId: parsePierCastTargetSpecies(m.speciesId) };
    case "analytics": {
      if (typeof m.event !== "string" || !(m.event in PIER_CAST_LIVE_MAP_ANALYTICS)) return null;
      const props: Record<string, string | number | boolean | null> = {};
      if (m.props && typeof m.props === "object") {
        for (const [k, v] of Object.entries(m.props as Record<string, unknown>).slice(0, 12)) {
          if (!/^[a-z_]{1,40}$/.test(k)) continue;
          if (typeof v === "string") props[k] = v.slice(0, 80);
          else if (typeof v === "number" || typeof v === "boolean" || v === null) props[k] = v;
        }
      }
      return { type: "analytics", event: m.event, props };
    }
    default:
      return null;
  }
}

/** Only the map's own host (and blank frames) may load inside the web view. */
export function isPierCastLiveMapUrlAllowed(url: string, baseUrl: string = pierCastLiveMapBaseUrl()): boolean {
  if (url === "about:blank" || url.startsWith("about:srcdoc") || url.startsWith("blob:") || url.startsWith("data:")) return true;
  try {
    return new URL(url).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}
