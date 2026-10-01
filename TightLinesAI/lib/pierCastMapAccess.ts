/**
 * Asks FinFindr's server for a Live Lake Map pass (see
 * supabase/functions/pier-cast-map-access). Paid accounts always get one; free
 * accounts get one for each of their first two map visits, then a
 * "subscription_required" error that the map screen turns into the paywall.
 */
import { parsePierCastMapPassResponse, type PierCastMapPassResponse } from "./pierCastLiveMap";
import { PierCastRequestError } from "./pierCast";
import { getValidAccessToken } from "./supabase";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export async function requestPierCastMapPass(visitId: string): Promise<PierCastMapPassResponse> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing Supabase configuration for the lake map.");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/pier-cast-map-access`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "x-user-token": await getValidAccessToken(),
      },
      body: JSON.stringify({ visitId }),
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    if (!response.ok) {
      const b = (body ?? {}) as { error?: unknown; message?: unknown };
      throw new PierCastRequestError(
        typeof b.message === "string" ? b.message : `Map access failed (${response.status}).`,
        typeof b.error === "string" ? b.error : null,
        response.status,
      );
    }
    const pass = parsePierCastMapPassResponse(body);
    if (!pass) throw new Error("The map pass was not understood.");
    return pass;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The lake map took too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
