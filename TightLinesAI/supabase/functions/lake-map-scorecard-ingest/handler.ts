const INTERNAL_KEY_HEADER = "x-lake-map-scorecard-key";
const MAX_RECORDS = 500;
const MAX_BODY_BYTES = 3_000_000;

export type ScorecardDatabase = {
  rpc: (
    functionName: string,
    arguments_: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export type ScorecardHandlerDependencies = {
  enabled: boolean;
  internalSecret: string | null;
  database: ScorecardDatabase;
};

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index % Math.max(a.length, 1)] ?? 0) ^
      (b[index % Math.max(b.length, 1)] ?? 0);
  }
  return difference === 0;
}

function validRecord(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return typeof record.station_id === "string" &&
    typeof record.sensor_key === "string" &&
    typeof record.observation_time === "string" &&
    typeof record.model_cycle === "string" &&
    typeof record.valid_time === "string" &&
    typeof record.lead_hours === "number" &&
    Number.isFinite(record.lead_hours) &&
    typeof record.sensor_depth_m === "number" &&
    Number.isFinite(record.sensor_depth_m) &&
    typeof record.model_depth_m === "number" &&
    Number.isFinite(record.model_depth_m) &&
    ["surface_layer", "interpolated_3d", "pending_3d"].includes(String(record.depth_method)) &&
    typeof record.depth_assumed === "boolean" &&
    ["paired", "pending_3d", "uncovered"].includes(String(record.pair_status)) &&
    typeof record.model_version === "string" &&
    typeof record.run_id === "string" &&
    typeof record.observed_temperature_f === "number" &&
    Number.isFinite(record.observed_temperature_f) &&
    (record.model_temperature_f === null ||
      (typeof record.model_temperature_f === "number" && Number.isFinite(record.model_temperature_f))) &&
    Array.isArray(record.quality_flags);
}

export function createLakeMapScorecardHandler(
  dependencies: ScorecardHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }
    if (!dependencies.enabled) return json({ status: "disabled" }, 503);
    const secret = dependencies.internalSecret;
    if (!secret || secret.length < 16) {
      return json({ error: "scorecard_misconfigured" }, 500);
    }
    const supplied = request.headers.get(INTERNAL_KEY_HEADER);
    if (!supplied || !constantTimeEqual(supplied, secret)) {
      return json({ error: "scorecard_forbidden" }, 403);
    }
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return json({ error: "scorecard_batch_too_large" }, 413);
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    const records = (body as { records?: unknown })?.records;
    if (
      !Array.isArray(records) || records.length > MAX_RECORDS ||
      !records.every(validRecord)
    ) {
      return json({ error: "invalid_scorecard_batch" }, 400);
    }
    try {
      const result = await dependencies.database.rpc(
        "commit_lake_map_temperature_scorecard_samples",
        { p_records: records },
      );
      if (result.error) return json({ error: "scorecard_commit_failed" }, 503);
      const data = result.data as
        | { status?: unknown; recordCount?: unknown }
        | null;
      if (
        data?.status !== "committed" || typeof data.recordCount !== "number" ||
        !Number.isInteger(data.recordCount)
      ) {
        return json({ error: "scorecard_commit_failed" }, 503);
      }
      return json({ status: "committed", recordCount: data.recordCount });
    } catch {
      return json({ error: "scorecard_commit_failed" }, 503);
    }
  };
}
