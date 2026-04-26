import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_SOURCE_VALIDATION_FEATURE,
  assertInternalWaterReaderRequest,
  isResolvedWaterReaderSourceMode,
  type ReviewedSourcePath,
  validateApprovedSourcePath,
} from "../_shared/waterReader/index.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-user-token, x-water-reader-internal-key",
  };
}

function jsonError(message: string, code: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: code, message }),
    { status, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
}

interface SourceRegistryRow {
  id: string;
  provider_name: string;
  review_status: ReviewedSourcePath["reviewStatus"];
  can_fetch: boolean;
}

interface SourceLinkRow {
  id: string;
  waterbody_id: string;
  source_id: string;
  source_mode: ReviewedSourcePath["sourceMode"];
  depth_source_kind: ReviewedSourcePath["depthSourceKind"];
  coverage_status: "available" | "limited" | "blocked" | "unavailable";
  source_path: string;
  source_path_type: ReviewedSourcePath["sourcePathType"];
  approval_status: ReviewedSourcePath["approvalStatus"];
  lake_match_status: ReviewedSourcePath["lakeMatchStatus"];
  usability_status: ReviewedSourcePath["usabilityStatus"];
  metadata: Record<string, unknown> | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }
  if (req.method !== "POST") {
    return jsonError("Method not allowed", "method_not_allowed", 405);
  }

  const authResult = assertInternalWaterReaderRequest(req);
  if (!authResult.ok) {
    return jsonError(authResult.message, authResult.code, authResult.status);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", "invalid_body", 400);
  }

  const lakeId = typeof body.lakeId === "string" ? body.lakeId.trim() : "";
  if (!lakeId) {
    return jsonError("lakeId is required", "invalid_lake_id", 400);
  }

  const requestedMode = typeof body.sourceMode === "string" ? body.sourceMode.trim() : null;
  if (requestedMode && !isResolvedWaterReaderSourceMode(requestedMode)) {
    return jsonError("sourceMode must be aerial or depth", "invalid_source_mode", 400);
  }

  let linksQuery = supabase
    .from("waterbody_source_links")
    .select(
      "id, waterbody_id, source_id, source_mode, depth_source_kind, coverage_status, source_path, source_path_type, approval_status, lake_match_status, usability_status, metadata",
    )
    .eq("waterbody_id", lakeId);
  if (requestedMode) {
    linksQuery = linksQuery.eq("source_mode", requestedMode);
  }

  const { data: linkRows, error: linkError } = await linksQuery;
  if (linkError) {
    console.error("[waterbody-source-validation] link query failed", linkError);
    return jsonError("Failed to load waterbody source links", "validation_failed", 500);
  }

  const links = (linkRows ?? []) as SourceLinkRow[];
  if (links.length === 0) {
    return new Response(
      JSON.stringify({
        feature: WATERBODY_SOURCE_VALIDATION_FEATURE,
        lakeId,
        results: [],
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
  }

  const sourceIds = [...new Set(links.map((row) => row.source_id))];
  const { data: sourceRows, error: sourceError } = await supabase
    .from("source_registry")
    .select("id, provider_name, review_status, can_fetch")
    .in("id", sourceIds);
  if (sourceError) {
    console.error("[waterbody-source-validation] source query failed", sourceError);
    return jsonError("Failed to load source registry rows", "validation_failed", 500);
  }

  const sourceMap = new Map(
    ((sourceRows ?? []) as SourceRegistryRow[]).map((row) => [row.id, row]),
  );

  const results = [];
  for (const link of links) {
    const source = sourceMap.get(link.source_id);
    if (!source) {
      continue;
    }

    const rawValidation = link.metadata?.fetch_validation_url;
    const validationFetchUrl = typeof rawValidation === "string" && rawValidation.trim().length > 0
      ? rawValidation.trim()
      : undefined;

    const result = await validateApprovedSourcePath({
      linkId: link.id,
      lakeId: link.waterbody_id,
      sourceId: link.source_id,
      providerName: source.provider_name,
      sourceMode: link.source_mode,
      depthSourceKind: link.depth_source_kind,
      sourcePath: link.source_path,
      sourcePathType: link.source_path_type,
      approvalStatus: link.approval_status,
      reviewStatus: source.review_status,
      canFetch: source.can_fetch,
      lakeMatchStatus: link.lake_match_status,
      usabilityStatus: link.usability_status,
    }, { validationFetchUrl });

    results.push(result);

    const updatePayload = {
      fetch_validation_status: result.status,
      fetch_validation_method: result.requestMethod,
      source_path_validation_target_url: result.targetUrl,
      fetch_validation_checked_at: result.checkedAtISO,
      fetch_validation_http_status: result.httpStatus ?? null,
      fetch_validation_error: result.error ?? null,
      updated_at: result.checkedAtISO,
    };
    const { error: updateError } = await supabase
      .from("waterbody_source_links")
      .update(updatePayload)
      .eq("id", link.id);
    if (updateError) {
      console.error("[waterbody-source-validation] failed to persist validation result", {
        linkId: link.id,
        error: updateError,
      });
    }
  }

  return new Response(
    JSON.stringify({
      feature: WATERBODY_SOURCE_VALIDATION_FEATURE,
      lakeId,
      results,
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
  );
});
