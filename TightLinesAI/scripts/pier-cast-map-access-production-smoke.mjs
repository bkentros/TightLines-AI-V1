import assert from "node:assert/strict";

const base = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !anon || !service) throw new Error("Supabase environment required");

const marker = crypto.randomUUID();
const password = `MapSmoke-${marker}-A9!`;
const email = `pier-cast-map-smoke-${marker}@example.com`;
const admin = {
  apikey: service,
  Authorization: `Bearer ${service}`,
  "Content-Type": "application/json",
};
let userId;

async function request(path, headers, body, method = "POST") {
  const response = await fetch(`${base}${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return {
    status: response.status,
    body: await response.json().catch(() => null),
  };
}

async function mapAccess(headers, visitId = crypto.randomUUID()) {
  return request(
    "/functions/v1/pier-cast-map-access",
    { ...headers, "Content-Type": "application/json" },
    { visitId },
  );
}

try {
  const policies = await request(
    "/rest/v1/app_release_policies?select=platform,enabled,latest_build&order=platform.asc",
    { apikey: anon, Authorization: `Bearer ${anon}` },
    undefined,
    "GET",
  );
  assert.equal(policies.status, 200, "read public app release policy");
  assert.equal(policies.body.length, 2, "iOS and Android release policies");
  assert.ok(
    policies.body.every((row) => row.enabled === false && row.latest_build === 0),
    "new update prompts must remain disabled until the store release is approved",
  );

  const created = await request("/auth/v1/admin/users", admin, {
    email,
    password,
    email_confirm: true,
  });
  assert.equal(created.status, 200, "create disposable map smoke user");
  userId = created.body.id;

  const profile = await request(
    "/rest/v1/profiles",
    { ...admin, Prefer: "resolution=merge-duplicates" },
    {
      id: userId,
      username: `map_smoke_${marker.replaceAll("-", "").slice(0, 12)}`,
      subscription_tier: "free",
      onboarding_complete: true,
    },
  );
  assert.equal(profile.status, 201, "create disposable map smoke profile");

  const auth = await request(
    "/auth/v1/token?grant_type=password",
    { apikey: anon, "Content-Type": "application/json" },
    { email, password },
  );
  assert.equal(auth.status, 200, "authenticate disposable map smoke user");
  const headers = {
    apikey: anon,
    Authorization: `Bearer ${anon}`,
    "x-user-token": auth.body.access_token,
  };

  // A unique coordinate bucket forces this deployment to prove the paid
  // provider path instead of inheriting an older one-hour server snapshot.
  const latitude = 42.5 + parseInt(marker.slice(0, 4), 16) % 3000 / 10_000;
  const longitude = -85.5 + parseInt(marker.slice(4, 8), 16) % 3000 / 10_000;
  const environment = await request(
    "/functions/v1/get-environment",
    { ...headers, "Content-Type": "application/json" },
    { latitude, longitude, units: "imperial" },
  );
  assert.equal(environment.status, 200, "paid environment route");
  assert.equal(environment.body.weather_available, true, "weather available");
  assert.ok(
    environment.body.hourly_air_temp_f?.length >= 24,
    "hourly temperatures returned",
  );
  assert.ok(
    environment.body.hourly_wind_direction_deg?.length >= 24,
    "hourly wind directions returned",
  );
  assert.ok(
    !(environment.body.source_notes ?? []).includes("weather_fallback:nws"),
    "production uses the configured paid Open-Meteo route",
  );

  const firstVisitId = crypto.randomUUID();
  const first = await mapAccess(headers, firstVisitId);
  assert.equal(first.status, 200, "first free map visit");
  assert.equal(first.body.visitsUsed, 1);
  const firstAccountKey = first.body.pass.split(".")[2];
  assert.ok(firstAccountKey.startsWith("u_"), "anonymous account key");
  assert.ok(!first.body.pass.includes(userId), "pass does not expose user ID");

  const retry = await mapAccess(headers, firstVisitId);
  assert.equal(retry.status, 200, "same-session pass renewal");
  assert.equal(retry.body.visitsUsed, 1, "renewal does not spend another visit");
  assert.equal(retry.body.pass.split(".")[2], firstAccountKey);

  const second = await mapAccess(headers);
  assert.equal(second.status, 200, "second free map visit");
  assert.equal(second.body.visitsUsed, 2);
  assert.equal(second.body.pass.split(".")[2], firstAccountKey);

  const blocked = await mapAccess(headers);
  assert.equal(blocked.status, 403, "third free map visit paywall");
  assert.equal(blocked.body.error, "subscription_required");

  const mapWithoutPass = await fetch("https://map.finfindr.app/map/");
  assert.equal(mapWithoutPass.status, 401, "map rejects missing pass");
  const mapWithPass = await fetch(
    `https://map.finfindr.app/map/?app=1&t=${encodeURIComponent(first.body.pass)}`,
  );
  assert.equal(mapWithPass.status, 200, "signed pass opens map gate");

  const upgrade = await request(
    `/rest/v1/profiles?id=eq.${userId}`,
    admin,
    { subscription_tier: "angler" },
    "PATCH",
  );
  assert.equal(upgrade.status, 204, "upgrade disposable smoke profile");
  const subscriber = await mapAccess(headers);
  assert.equal(subscriber.status, 200, "subscriber map access");
  assert.equal(subscriber.body.access, "subscriber");
  assert.equal(subscriber.body.pass.split(".")[2], firstAccountKey);

  // Five requests above counted against the pass-mint limiter. Fill the
  // remaining fifteen slots, then prove the twenty-first request is rejected.
  for (let issued = 6; issued <= 20; issued += 1) {
    const response = await mapAccess(headers);
    assert.equal(response.status, 200, `subscriber pass issue ${issued}`);
  }
  const rateLimited = await mapAccess(headers);
  assert.equal(rateLimited.status, 429, "per-account pass issue rate limit");
  assert.equal(rateLimited.body.error, "rate_limited");

  console.log(
    "PASS: paid weather routing, disabled app-update defaults, two free map visits, paywall, subscriber access, stable anonymous throttling, Cloudflare gating, and the 20-per-10-minute pass limit are live.",
  );
} finally {
  if (userId) {
    const response = await fetch(`${base}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: admin,
    });
    assert.equal(response.status, 200, "delete disposable map smoke account");
  }
}
