import type {
  RiverRunConfigurationDocument,
  RiverRunConfigurationRevision,
} from "../types.ts";
import { validateConfigurationRevision } from "../validation.ts";
import {
  type RiverRunStorageResult,
  storageError,
  type SupabaseLikeClient,
} from "./types.ts";

type ConfigurationRevisionRow = {
  config_key: string;
  revision: number;
  status: RiverRunConfigurationRevision["status"];
  schema_version: string;
  config_version: string;
  movement_engine_version: string;
  document: RiverRunConfigurationDocument;
  evidence_notes: string;
  published_at?: string | null;
};

export function serializeConfigurationRevision(
  revision: RiverRunConfigurationRevision,
): Record<string, unknown> {
  return {
    config_key: revision.configKey,
    revision: revision.revision,
    status: revision.status,
    schema_version: revision.document.schemaVersion,
    config_version: revision.document.configVersion,
    movement_engine_version: revision.document.movementEngineVersion,
    document: revision.document,
    evidence_notes: revision.evidenceNotes,
    published_at: revision.publishedAt ?? null,
  };
}

export function deserializeConfigurationRevision(
  row: ConfigurationRevisionRow,
): RiverRunConfigurationRevision {
  return {
    configKey: row.config_key,
    revision: row.revision,
    status: row.status,
    document: row.document,
    evidenceNotes: row.evidence_notes,
    publishedAt: row.published_at ?? undefined,
  };
}

export async function upsertDraftConfiguration(
  client: SupabaseLikeClient,
  revision: RiverRunConfigurationRevision,
): Promise<RiverRunStorageResult<RiverRunConfigurationRevision>> {
  if (revision.status !== "draft") {
    return {
      data: null,
      found: false,
      error: { message: "Only draft configuration revisions may be upserted." },
    };
  }
  const issues = validateConfigurationRevision(revision).filter((item) =>
    item.severity === "error"
  );
  if (issues.length > 0) {
    return {
      data: null,
      found: false,
      error: {
        message: "River Migration configuration validation failed.",
        details: issues,
      },
    };
  }
  const response = await client
    .from("river_run_config_revisions")
    .upsert(serializeConfigurationRevision(revision), {
      onConflict: "config_key,revision",
    })
    .select()
    .maybeSingle();
  return {
    data: response.data
      ? deserializeConfigurationRevision(
        response.data as ConfigurationRevisionRow,
      )
      : revision,
    found: true,
    error: storageError(response.error),
  };
}

export async function getPublishedConfiguration(
  client: SupabaseLikeClient,
  configKey: string,
): Promise<RiverRunStorageResult<RiverRunConfigurationRevision>> {
  const response = await client
    .from("river_run_config_revisions")
    .select()
    .eq("config_key", configKey)
    .eq("status", "published")
    .maybeSingle();
  return {
    data: response.data
      ? deserializeConfigurationRevision(
        response.data as ConfigurationRevisionRow,
      )
      : null,
    found: Boolean(response.data),
    error: storageError(response.error),
  };
}

export async function listPublishedConfigurations(
  client: SupabaseLikeClient,
): Promise<RiverRunStorageResult<RiverRunConfigurationRevision[]>> {
  const response = await (client as any)
    .from("river_run_config_revisions")
    .select()
    .eq("status", "published")
    .order("config_key", { ascending: true });
  const error = storageError(response?.error ?? null);
  const rows = (response?.data ?? []) as ConfigurationRevisionRow[];
  return {
    data: error ? null : rows.map(deserializeConfigurationRevision),
    found: !error && rows.length > 0,
    error,
  };
}

export async function publishConfigurationRevision(
  client: SupabaseLikeClient,
  input: { configKey: string; revision: number },
): Promise<RiverRunStorageResult<RiverRunConfigurationRevision>> {
  const rpc = (client as SupabaseLikeClient & {
    rpc?: (
      name: string,
      params: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message?: string } | null }>;
  }).rpc;
  if (!rpc) {
    return {
      data: null,
      found: false,
      error: { message: "Configuration publishing RPC is unavailable." },
    };
  }
  const response = await rpc("publish_river_run_config_revision", {
    target_config_key: input.configKey,
    target_revision: input.revision,
  });
  const row = Array.isArray(response.data) ? response.data[0] : response.data;
  return {
    data: row
      ? deserializeConfigurationRevision(row as ConfigurationRevisionRow)
      : null,
    found: Boolean(row),
    error: response.error
      ? { message: response.error.message ?? "Configuration publish failed." }
      : null,
  };
}
