type JsonObject = Record<string, unknown>;

const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
const anonKey = Deno.env.get("EXPO_PUBLIC_SUPABASE_ANON_KEY")?.trim() ||
  requiredEnv("SUPABASE_ANON_KEY");
const internalKey = requiredEnv("RIVER_RUN_INTERNAL_KEY");
const userToken = Deno.env.get("RIVER_RUN_USER_ACCESS_TOKEN")?.trim() || null;
const freeUserToken = Deno.env.get("RIVER_RUN_FREE_USER_ACCESS_TOKEN")?.trim() ||
  null;
const expectPublic = Deno.env.get("EXPECT_RIVER_RUN_PUBLIC") === "true";
const functionUrl = `${supabaseUrl}/functions/v1/river-run`;

const commonHeaders = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
};

const refresh = await requestJson(`${functionUrl}/internal/refresh`, {
  method: "POST",
  headers: {
    ...commonHeaders,
    "Content-Type": "application/json",
    "x-river-run-internal-key": internalKey,
  },
  body: JSON.stringify({ source: "production-smoke" }),
});
assertOk(refresh, "internal refresh");
const failedCount = numberField(refresh.body, "failedCount");
if (failedCount !== 0) {
  throw new Error(`Internal refresh reported ${failedCount} failed targets.`);
}

const catalog = await requestJson(`${functionUrl}/rivers`, {
  headers: commonHeaders,
});
assertOk(catalog, "catalog");
const firstTarget = readFirstTarget(catalog.body);
const catalogTargets = readCatalogTargets(catalog.body);
const expectedPublicTargets = [
  "MI:betsie:betsie_fall_chinook",
  "MI:betsie:betsie_fall_coho",
  "MI:betsie:betsie_fall_steelhead",
  "MI:big_manistee:big_manistee_fall_chinook",
  "MI:big_manistee:big_manistee_fall_coho",
  "MI:big_manistee:big_manistee_fall_steelhead",
  "MI:muskegon:muskegon_fall_chinook",
  "MI:muskegon:muskegon_fall_coho",
  "MI:muskegon:muskegon_fall_steelhead",
  "MI:pere_marquette:pere_marquette_fall_chinook",
  "MI:pere_marquette:pere_marquette_fall_coho",
  "MI:pere_marquette:pere_marquette_fall_steelhead",
];
if (expectPublic && !firstTarget) {
  throw new Error("River Run was expected to be public, but catalog is empty.");
}
if (!expectPublic && firstTarget) {
  throw new Error(
    "River Run catalog is public while EXPECT_RIVER_RUN_PUBLIC is false.",
  );
}
if (expectPublic) {
  assertStringArraysEqual(
    catalogTargets,
    expectedPublicTargets,
    "public River Run catalog",
  );
  if (catalogTargets.some((target) => target.includes(":st_joseph:"))) {
    throw new Error("St. Joseph is public before its audit gate is accepted.");
  }
}

let snapshotStatus: number | null = null;
let dataQuality: string | null = null;
let conditionsSuggest: string | null = null;
if (expectPublic && firstTarget) {
  if (!userToken) {
    throw new Error(
      "RIVER_RUN_USER_ACCESS_TOKEN is required for a public snapshot smoke.",
    );
  }
  const snapshotUrl = new URL(`${functionUrl}/snapshot`);
  snapshotUrl.searchParams.set("riverId", firstTarget.riverId);
  snapshotUrl.searchParams.set("runId", firstTarget.runId);
  snapshotUrl.searchParams.set("presentationState", firstTarget.state);
  const snapshot = await requestJson(snapshotUrl.toString(), {
    headers: {
      ...commonHeaders,
      "x-user-token": userToken,
    },
  });
  assertOk(snapshot, "authenticated snapshot");
  snapshotStatus = snapshot.status;
  if ("schedule" in snapshot.body) {
    throw new Error("Public snapshot still exposes the removed schedule key.");
  }
  conditionsSuggest = stringField(
    objectField(snapshot.body, "conditionsSuggest"),
    "label",
  );
  if (
    !conditionsSuggest ||
    ![
      "Ahead",
      "Typical",
      "Delayed",
      "Insufficient evidence",
      "Not monitoring yet",
      "Evaluating",
      "Timing complete",
    ].includes(
      conditionsSuggest,
    )
  ) {
    throw new Error(
      "Public snapshot is missing a valid Conditions Suggest label.",
    );
  }
  dataQuality = stringField(
    objectField(snapshot.body, "dataQuality"),
    "label",
  );

  if (freeUserToken) {
    const freeSnapshot = await requestJson(snapshotUrl.toString(), {
      headers: {
        ...commonHeaders,
        "x-user-token": freeUserToken,
      },
    });
    if (
      freeSnapshot.status !== 403 ||
      stringField(freeSnapshot.body, "error") !== "subscription_required"
    ) {
      throw new Error(
        `free subscriber gate returned ${freeSnapshot.status} instead of 403 subscription_required`,
      );
    }
  }
}

console.log(JSON.stringify(
  {
    ok: true,
    internalRefreshStatus: refresh.status,
    refreshedTargetCount: numberField(refresh.body, "targetCount"),
    publicCatalogExpected: expectPublic,
    publicCatalogHasTarget: Boolean(firstTarget),
    publicCatalogTargetCount: catalogTargets.length,
    freeSubscriberGateChecked: Boolean(expectPublic && freeUserToken),
    snapshotStatus,
    conditionsSuggest,
    dataQuality,
  },
  null,
  2,
));

async function requestJson(
  url: string,
  init: RequestInit,
): Promise<{ status: number; body: JsonObject }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const text = await response.text();
    let body: unknown = {};
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { message: text };
    }
    return {
      status: response.status,
      body: body && typeof body === "object" && !Array.isArray(body)
        ? body as JsonObject
        : { value: body },
    };
  } finally {
    clearTimeout(timer);
  }
}

function assertOk(
  result: { status: number; body: JsonObject },
  label: string,
): void {
  if (result.status < 200 || result.status >= 300) {
    const message = stringField(result.body, "message") ??
      stringField(result.body, "error") ?? "unknown error";
    throw new Error(`${label} failed with ${result.status}: ${message}`);
  }
}

function readFirstTarget(
  body: JsonObject,
): { state: string; riverId: string; runId: string } | null {
  const states = Array.isArray(body.states) ? body.states : [];
  for (const state of states) {
    const stateCode = state && typeof state === "object"
      ? stringField(state as JsonObject, "state")
      : null;
    const rivers = state && typeof state === "object" &&
        Array.isArray((state as JsonObject).rivers)
      ? (state as JsonObject).rivers as unknown[]
      : [];
    for (const river of rivers) {
      if (!river || typeof river !== "object") continue;
      const riverObject = river as JsonObject;
      const riverId = stringField(riverObject, "riverId");
      const runs = Array.isArray(riverObject.runs) ? riverObject.runs : [];
      const run = runs[0];
      const runId = run && typeof run === "object"
        ? stringField(run as JsonObject, "runId")
        : null;
      if (stateCode && riverId && runId) {
        return { state: stateCode, riverId, runId };
      }
    }
  }
  return null;
}

function readCatalogTargets(body: JsonObject): string[] {
  const targets: string[] = [];
  const states = Array.isArray(body.states) ? body.states : [];
  for (const state of states) {
    if (!state || typeof state !== "object") continue;
    const stateObject = state as JsonObject;
    const stateCode = stringField(stateObject, "state");
    const rivers = Array.isArray(stateObject.rivers) ? stateObject.rivers : [];
    for (const river of rivers) {
      if (!river || typeof river !== "object") continue;
      const riverObject = river as JsonObject;
      const riverId = stringField(riverObject, "riverId");
      const runs = Array.isArray(riverObject.runs) ? riverObject.runs : [];
      for (const run of runs) {
        const runId = run && typeof run === "object"
          ? stringField(run as JsonObject, "runId")
          : null;
        if (stateCode && riverId && runId) {
          targets.push(`${stateCode}:${riverId}:${runId}`);
        }
      }
    }
  }
  return targets.sort();
}

function assertStringArraysEqual(
  actual: string[],
  expected: string[],
  label: string,
): void {
  const expectedSorted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expectedSorted)) {
    throw new Error(
      `${label} mismatch. Expected ${JSON.stringify(expectedSorted)}, received ${JSON.stringify(actual)}.`,
    );
  }
}

function requiredEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing required environment variable ${name}.`);
  return value;
}

function objectField(body: JsonObject, key: string): JsonObject {
  const value = body[key];
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonObject
    : {};
}

function stringField(body: JsonObject, key: string): string | null {
  return typeof body[key] === "string" ? body[key] : null;
}

function numberField(body: JsonObject, key: string): number {
  return typeof body[key] === "number" ? body[key] : 0;
}
