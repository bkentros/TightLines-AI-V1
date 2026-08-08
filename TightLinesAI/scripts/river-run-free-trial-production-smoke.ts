/** Production smoke for the one-lifetime River Migration free trial. */

const baseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
const anonKey = Deno.env.get("EXPO_PUBLIC_SUPABASE_ANON_KEY")?.trim() ||
  requiredEnv("SUPABASE_ANON_KEY");
const serviceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const marker = crypto.randomUUID();
const email = `river-run-free-smoke-${marker}@example.com`;
const password = `Smoke-${marker}-A9!`;
let userId: string | null = null;

try {
  const created = await requestJson(`${baseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  assertStatus(created, 200, "create disposable free user");
  userId = stringField(created.body, "id");

  const profile = await requestJson(`${baseUrl}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...adminHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({
      id: userId,
      username: `rr_free_smoke_${marker.replaceAll("-", "")}`,
      subscription_tier: "free",
      onboarding_complete: true,
    }),
  });
  assertStatus(profile, 201, "create disposable free profile");

  const signedIn = await requestJson(
    `${baseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  assertStatus(signedIn, 200, "sign in disposable free user");
  const accessToken = stringField(signedIn.body, "access_token");

  const target = {
    riverId: "pere_marquette",
    runId: "pere_marquette_fall_chinook",
    presentationState: "MI",
  };
  const first = await riverSnapshot(accessToken, target);
  assertStatus(first, 200, "first free River Migration snapshot");
  assertEquals(stringField(first.body, "accessTier"), "free_trial", "first access tier");

  const replay = await riverSnapshot(accessToken, target);
  assertStatus(replay, 200, "same-refresh replay");
  assertEquals(stringField(replay.body, "refreshSlot"), stringField(first.body, "refreshSlot"), "replay slot");

  const clientReset = await requestJson(
    `${baseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        free_river_run_trial_used_at: null,
        free_river_run_trial_river_id: null,
        free_river_run_trial_run_id: null,
        free_river_run_trial_presentation_state: null,
        free_river_run_trial_local_date: null,
        free_river_run_trial_refresh_slot: null,
        free_river_run_trial_engine_version: null,
        free_river_run_trial_config_version: null,
      }),
    },
  );
  if (clientReset.status < 400) {
    throw new Error("authenticated client unexpectedly reset its server-managed trial");
  }

  const other = await riverSnapshot(accessToken, {
    ...target,
    runId: "pere_marquette_fall_coho",
  });
  assertStatus(other, 403, "different-combination denial");
  assertEquals(stringField(other.body, "error"), "subscription_required", "different-combination error");

  const stale = await requestJson(
    `${baseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        ...adminHeaders(),
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        free_river_run_trial_refresh_slot: "expired-test-slot",
      }),
    },
  );
  assertStatus(stale, 200, "expire disposable refresh identity");

  const expiredReplay = await riverSnapshot(accessToken, target);
  assertStatus(expiredReplay, 403, "expired same-combination denial");
  assertEquals(stringField(expiredReplay.body, "error"), "subscription_required", "expired replay error");

  console.log("Production River Migration free-trial smoke passed.");
} finally {
  if (userId) {
    const removed = await requestJson(
      `${baseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`,
      { method: "DELETE", headers: adminHeaders() },
    );
    if (removed.status < 200 || removed.status >= 300) {
      throw new Error(`cleanup failed with status ${removed.status}`);
    }
  }
}

function riverSnapshot(
  accessToken: string,
  target: { riverId: string; runId: string; presentationState: string },
) {
  const url = new URL(`${baseUrl}/functions/v1/river-run/snapshot`);
  url.searchParams.set("riverId", target.riverId);
  url.searchParams.set("runId", target.runId);
  url.searchParams.set("presentationState", target.presentationState);
  return requestJson(url.toString(), {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "x-user-token": accessToken,
    },
  });
}

function adminHeaders(): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
}

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, init);
  const text = await response.text();
  let body: Record<string, unknown> = {};
  if (text) {
    try {
      body = JSON.parse(text) as Record<string, unknown>;
    } catch {
      body = { raw: text.slice(0, 300) };
    }
  }
  return { status: response.status, body };
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}.`);
  return value;
}

function stringField(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Expected ${key} to be a non-empty string.`);
  }
  return value;
}

function assertStatus(
  response: { status: number; body: Record<string, unknown> },
  expected: number,
  label: string,
) {
  if (response.status !== expected) {
    throw new Error(
      `${label}: expected ${expected}, received ${response.status} ${JSON.stringify(response.body)}`,
    );
  }
}

function assertEquals(actual: string, expected: string, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}
