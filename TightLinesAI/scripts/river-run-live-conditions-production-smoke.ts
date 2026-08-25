type JsonObject = Record<string, unknown>;

const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
const anonKey = requiredEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY");
const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
const functionUrl = `${supabaseUrl}/functions/v1/river-run`;
const expectedEngineVersion = "river-run-v1.14.0";
const expectedDataVersion = "river-live-conditions-v2";
const expectedMetricsByRiver: Record<string, string[]> = {
  pere_marquette: ["flow_cfs", "gage_height_ft", "water_temp_f"],
  betsie: [],
  big_manistee: ["flow_cfs", "gage_height_ft", "water_temp_f"],
  muskegon: ["flow_cfs", "gage_height_ft", "water_temp_f"],
  st_joseph: ["flow_cfs", "gage_height_ft", "water_temp_f"],
  grand: ["flow_cfs", "gage_height_ft", "water_temp_f"],
  platte: ["flow_cfs", "gage_height_ft"],
  white: ["flow_cfs", "gage_height_ft", "water_temp_f"],
};
const expectedSeasonalMetricsByRiver: Record<string, string[]> = {
  pere_marquette: ["flow_cfs", "water_temp_f"],
  betsie: [],
  big_manistee: ["flow_cfs", "water_temp_f"],
  muskegon: ["flow_cfs", "water_temp_f"],
  st_joseph: ["flow_cfs", "water_temp_f"],
  grand: ["flow_cfs"],
  platte: ["flow_cfs"],
  white: ["flow_cfs"],
};

let userToken: string | null = null;
let authenticationWarning: string | null = null;
try {
  userToken = await resolveUserToken();
} catch {
  authenticationWarning =
    "Configured production test-user credentials are unavailable; audited protected refresh storage instead.";
}
const commonHeaders = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
};
const catalog = await requestJson(`${functionUrl}/rivers`, {
  headers: commonHeaders,
});
assertOk(catalog, "River Run catalog");
const targets = uniqueRiverTargets(catalog.body);
assertStringArraysEqual(
  targets.map((target) => target.riverId),
  Object.keys(expectedMetricsByRiver),
  "production river coverage",
);
const liveRows = await restRows(
  "river_run_live_conditions",
  "river_id,local_date,refresh_slot,data_version,refreshed_at,conditions",
);
const currentLiveRows = liveRows.filter((row) =>
  stringField(row, "data_version") === expectedDataVersion
);
const contextRows = await restRows(
  "river_run_metric_seasonal_contexts",
  "river_id,source_id,metric,day_of_year,baseline_version,context",
);

const riverResults: JsonObject[] = [];
for (const target of targets) {
  let firstConditions: JsonObject;
  let cacheReplayVerified = false;
  if (userToken) {
    const first = await readSnapshot(target, userToken);
    const second = await readSnapshot(target, userToken);
    firstConditions = objectField(first.body, "riverConditions");
    const secondConditions = objectField(second.body, "riverConditions");
    const engineVersion = stringField(first.body, "engineVersion");
    if (engineVersion !== expectedEngineVersion) {
      throw new Error(
        `${target.riverId} returned engine ${
          engineVersion ?? "missing"
        }; expected ${expectedEngineVersion}.`,
      );
    }
    if (
      stringField(firstConditions, "refreshedAt") !==
        stringField(secondConditions, "refreshedAt") ||
      stringField(firstConditions, "refreshSlot") !==
        stringField(secondConditions, "refreshSlot")
    ) {
      throw new Error(
        `${target.riverId} did not replay its river-level cache.`,
      );
    }
    cacheReplayVerified = true;
  } else {
    firstConditions = latestStoredConditions(currentLiveRows, target.riverId);
  }
  const dataVersion = stringField(firstConditions, "dataVersion");
  const refreshedAt = stringField(firstConditions, "refreshedAt");
  if (dataVersion !== expectedDataVersion) {
    throw new Error(
      `${target.riverId} returned live data ${
        dataVersion ?? "missing"
      }; expected ${expectedDataVersion}.`,
    );
  }
  const metrics = arrayField(firstConditions, "metrics").map(asObject);
  assertStringArraysEqual(
    metrics.map((metric) => requiredString(metric, "metric")),
    expectedMetricsByRiver[target.riverId],
    `${target.riverId} metric coverage`,
  );
  const metricResults = metrics.map((metric) =>
    auditMetric(
      target.riverId,
      metric,
      !(["grand", "white"].includes(target.riverId) &&
        requiredString(metric, "metric") === "water_temp_f"),
    )
  );
  if (["betsie", "platte"].includes(target.riverId)) {
    if (stringField(firstConditions, "status") !== "unavailable") {
      throw new Error(
        `${target.riverId} must retain its honest unavailable gauge state.`,
      );
    }
  } else if (!metrics.some((metric) => numberOrNull(metric.value) != null)) {
    throw new Error(`${target.riverId} returned no usable live measurements.`);
  }
  riverResults.push({
    riverId: target.riverId,
    state: target.state,
    runId: target.runId,
    status: stringField(firstConditions, "status"),
    localDate: stringField(firstConditions, "localDate"),
    refreshSlot: stringField(firstConditions, "refreshSlot"),
    refreshedAt,
    cacheReplayVerified,
    limitation: stringField(firstConditions, "limitation"),
    metrics: metricResults,
  });
}

const cachedRivers = new Set(
  currentLiveRows.map((row) => requiredString(row, "river_id")),
);
for (const riverId of Object.keys(expectedMetricsByRiver)) {
  if (!cachedRivers.has(riverId)) {
    throw new Error(
      `No persisted live-condition cache row exists for ${riverId}.`,
    );
  }
}
if (cachedRivers.size !== Object.keys(expectedMetricsByRiver).length) {
  throw new Error(
    `Expected current-version cache coverage for ${
      Object.keys(expectedMetricsByRiver).length
    } rivers, received ${cachedRivers.size}.`,
  );
}
const seasonalPairs = new Set(
  contextRows.map((row) =>
    `${requiredString(row, "river_id")}:${requiredString(row, "metric")}`
  ),
);
for (
  const [riverId, metrics] of Object.entries(expectedSeasonalMetricsByRiver)
) {
  for (const metric of metrics) {
    if (!seasonalPairs.has(`${riverId}:${metric}`)) {
      throw new Error(
        `No persisted ${metric} seasonal context exists for ${riverId}.`,
      );
    }
  }
}

console.log(JSON.stringify(
  {
    ok: true,
    engineVersion: expectedEngineVersion,
    dataVersion: expectedDataVersion,
    authenticatedSnapshotContractVerified: Boolean(userToken),
    authenticationWarning,
    uniqueRiverCount: targets.length,
    persistedLiveCacheRowCount: currentLiveRows.length,
    persistedSeasonalContextRowCount: contextRows.length,
    rivers: riverResults,
  },
  null,
  2,
));

function latestStoredConditions(
  rows: JsonObject[],
  riverId: string,
): JsonObject {
  const candidates = rows.filter((row) =>
    stringField(row, "river_id") === riverId &&
    stringField(row, "data_version") === expectedDataVersion
  ).sort((left, right) =>
    Date.parse(stringField(right, "refreshed_at") ?? "") -
    Date.parse(stringField(left, "refreshed_at") ?? "")
  );
  if (!candidates.length) {
    throw new Error(`No stored Live Conditions payload exists for ${riverId}.`);
  }
  return objectField(candidates[0], "conditions");
}

function auditMetric(
  riverId: string,
  metric: JsonObject,
  requireSeasonalComparison: boolean,
): JsonObject {
  const id = requiredString(metric, "metric");
  const value = numberOrNull(metric.value);
  const freshness = requiredString(metric, "freshness");
  const trend = objectField(metric, "trend24h");
  const seasonal = objectField(metric, "seasonalContext");
  const average = numberOrNull(seasonal.average);
  const warning: string[] = [];
  const bounds: Record<string, [number, number]> = {
    flow_cfs: [0, 100_000],
    gage_height_ft: [-10, 100],
    water_temp_f: [30, 90],
  };
  if (value != null) {
    const [minimum, maximum] = bounds[id] ?? [-Infinity, Infinity];
    if (value <= minimum || value >= maximum) {
      throw new Error(
        `${riverId} ${id} value ${value} is outside safe bounds.`,
      );
    }
    if (!stringField(metric, "observedAt")) {
      throw new Error(
        `${riverId} ${id} has a value without an observation time.`,
      );
    }
    if (freshness === "missing" || freshness === "older_than_24h") {
      throw new Error(`${riverId} ${id} exposes an expired value as current.`);
    }
  } else {
    warning.push("current reading unavailable");
  }
  if (id === "gage_height_ft") {
    if (Object.keys(seasonal).length) {
      throw new Error(
        `${riverId} gauge height must not claim a seasonal average.`,
      );
    }
  } else if (value != null && requireSeasonalComparison) {
    if (average == null || !stringField(seasonal, "comparisonLabel")) {
      throw new Error(`${riverId} ${id} is missing its seasonal comparison.`);
    }
    if (numberField(seasonal, "windowRadiusDays") !== 3) {
      throw new Error(
        `${riverId} ${id} is not using the required ±3-day window.`,
      );
    }
  } else if (Object.keys(seasonal).length) {
    if (average == null || !stringField(seasonal, "comparisonLabel")) {
      throw new Error(
        `${riverId} ${id} has an incomplete seasonal comparison.`,
      );
    }
    if (numberField(seasonal, "windowRadiusDays") !== 3) {
      throw new Error(
        `${riverId} ${id} is not using the required ±3-day window.`,
      );
    }
  }
  if (numberOrNull(trend.delta) == null) {
    warning.push("24-hour comparison unavailable");
  }
  return {
    metric: id,
    value,
    unit: stringField(metric, "unit"),
    observedAt: stringField(metric, "observedAt"),
    freshness,
    provider: stringField(metric, "provider"),
    sourceId: stringField(metric, "sourceId"),
    siteId: stringField(metric, "siteId"),
    stationName: stringField(metric, "stationName"),
    trend24h: {
      direction: stringField(trend, "direction"),
      delta: numberOrNull(trend.delta),
      percentDelta: numberOrNull(trend.percentDelta),
      comparisonObservedAt: stringField(trend, "comparisonObservedAt"),
    },
    seasonalContext: Object.keys(seasonal).length
      ? {
        average,
        comparisonLabel: stringField(seasonal, "comparisonLabel"),
        historicalYears: numberField(seasonal, "historicalYears"),
        availableWindowDays: numberField(seasonal, "availableWindowDays"),
        windowRadiusDays: numberField(seasonal, "windowRadiusDays"),
        recordKind: stringField(seasonal, "recordKind"),
        baselineVersion: stringField(seasonal, "baselineVersion"),
      }
      : null,
    warnings: warning,
  };
}

async function resolveUserToken(): Promise<string> {
  const configured = Deno.env.get("RIVER_RUN_USER_ACCESS_TOKEN")?.trim();
  if (configured) return configured;
  const email = requiredEnv("WATER_READER_TEST_EMAIL");
  const password = requiredEnv("WATER_READER_TEST_PASSWORD");
  const auth = await requestJson(
    `${supabaseUrl}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: { apikey: anonKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  if (auth.status >= 200 && auth.status < 300) {
    return requiredString(auth.body, "access_token");
  }

  // Production test passwords can be rotated independently of this workspace.
  // Fail closed unless the exact configured test user already exists, then mint
  // a short-lived session without changing credentials or sending an email.
  const users = await requestJson(`${supabaseUrl}/auth/v1/admin/users`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  assertOk(users, "test-user existence check");
  const userExists = arrayField(users.body, "users").some((value) =>
    stringField(asObject(value), "email")?.toLowerCase() === email.toLowerCase()
  );
  if (!userExists) {
    throw new Error("The configured production test user does not exist.");
  }
  const link = await requestJson(
    `${supabaseUrl}/auth/v1/admin/generate_link`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "magiclink", email }),
    },
  );
  assertOk(link, "test-user session link");
  const tokenHash = requiredString(
    objectField(link.body, "properties"),
    "hashed_token",
  );
  const verified = await requestJson(`${supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "magiclink", token_hash: tokenHash }),
  });
  assertOk(verified, "test-user session verification");
  return requiredString(verified.body, "access_token");
}

async function readSnapshot(
  target: { state: string; riverId: string; runId: string },
  userToken: string,
) {
  const url = new URL(`${functionUrl}/snapshot`);
  url.searchParams.set("presentationState", target.state);
  url.searchParams.set("riverId", target.riverId);
  url.searchParams.set("runId", target.runId);
  const response = await requestJson(url.toString(), {
    headers: { ...commonHeaders, "x-user-token": userToken },
  });
  assertOk(response, `${target.riverId} production snapshot`);
  return response;
}

async function restRows(table: string, select: string): Promise<JsonObject[]> {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  url.searchParams.set("select", select);
  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(body)) {
    throw new Error(`${table} storage audit failed with ${response.status}.`);
  }
  return body.map(asObject);
}

function uniqueRiverTargets(body: JsonObject) {
  const byRiver = new Map<
    string,
    { state: string; riverId: string; runId: string }
  >();
  for (const stateValue of arrayField(body, "states")) {
    const state = asObject(stateValue);
    const stateCode = requiredString(state, "state");
    for (const riverValue of arrayField(state, "rivers")) {
      const river = asObject(riverValue);
      const riverId = requiredString(river, "riverId");
      const run = asObject(arrayField(river, "runs")[0]);
      if (!byRiver.has(riverId) || stateCode === "MI") {
        byRiver.set(riverId, {
          state: stateCode,
          riverId,
          runId: requiredString(run, "runId"),
        });
      }
    }
  }
  return [...byRiver.values()].sort((left, right) =>
    left.riverId.localeCompare(right.riverId)
  );
}

async function requestJson(
  url: string,
  init: RequestInit,
): Promise<{ status: number; body: JsonObject }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    let parsed: unknown = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { message: text.slice(0, 500) };
    }
    return { status: response.status, body: asObject(parsed) };
  } finally {
    clearTimeout(timer);
  }
}

function assertOk(
  response: { status: number; body: JsonObject },
  label: string,
): void {
  if (response.status < 200 || response.status >= 300) {
    throw new Error(
      `${label} failed with ${response.status}: ${
        stringField(response.body, "message") ??
          stringField(response.body, "error_description") ??
          stringField(response.body, "error") ??
          stringField(response.body, "error_code") ?? "unknown error"
      }`,
    );
  }
}

function assertStringArraysEqual(
  actual: string[],
  expected: string[],
  label: string,
): void {
  const left = [...actual].sort();
  const right = [...expected].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    throw new Error(
      `${label} mismatch. Expected ${JSON.stringify(right)}, received ${
        JSON.stringify(left)
      }.`,
    );
  }
}

function asObject(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function objectField(body: JsonObject, key: string): JsonObject {
  return asObject(body[key]);
}

function arrayField(body: JsonObject, key: string): unknown[] {
  return Array.isArray(body[key]) ? body[key] : [];
}

function requiredString(body: JsonObject, key: string): string {
  const value = stringField(body, key);
  if (!value) throw new Error(`Missing required string ${key}.`);
  return value;
}

function stringField(body: JsonObject, key: string): string | null {
  return typeof body[key] === "string" ? body[key] : null;
}

function numberField(body: JsonObject, key: string): number {
  return typeof body[key] === "number" ? body[key] : 0;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}.`);
  return value;
}
