type JsonObject = Record<string, unknown>;

const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
const anonKey = requiredEnv("SUPABASE_ANON_KEY");
const internalKey = requiredEnv("RIVER_RUN_INTERNAL_KEY");
const userToken = Deno.env.get("RIVER_RUN_USER_ACCESS_TOKEN")?.trim() || null;
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
if (expectPublic && !firstTarget) {
  throw new Error("River Run was expected to be public, but catalog is empty.");
}
if (!expectPublic && firstTarget) {
  throw new Error(
    "River Run catalog is public while EXPECT_RIVER_RUN_PUBLIC is false.",
  );
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
}

console.log(JSON.stringify(
  {
    ok: true,
    internalRefreshStatus: refresh.status,
    refreshedTargetCount: numberField(refresh.body, "targetCount"),
    publicCatalogExpected: expectPublic,
    publicCatalogHasTarget: Boolean(firstTarget),
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
): { riverId: string; runId: string } | null {
  const states = Array.isArray(body.states) ? body.states : [];
  for (const state of states) {
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
      if (riverId && runId) return { riverId, runId };
    }
  }
  return null;
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
