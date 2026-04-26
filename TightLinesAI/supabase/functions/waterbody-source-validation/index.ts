import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  WATERBODY_SOURCE_VALIDATION_FEATURE,
  assertInternalWaterReaderRequest,
  isResolvedWaterReaderSourceMode,
  isWaterbodySourceValidationBodyScope,
  type ReviewedSourcePath,
  validateApprovedSourcePath,
  validateSourceProviderHealth,
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

interface AerialPolicyRow {
  id: string;
  policy_key: string;
  source_id: string;
  is_enabled: boolean;
  approval_status: string;
  provider_health_target_url: string | null;
}

interface SourceRegistryHealthRow {
  id: string;
  provider_name: string;
  provider_health_check_url: string | null;
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

  const rawScope = typeof body.validationScope === "string" ? body.validationScope.trim() : "";
  if (rawScope && !isWaterbodySourceValidationBodyScope(rawScope)) {
    return jsonError("validationScope must be lake_links or aerial_provider_policy", "invalid_scope", 400);
  }

  if (rawScope === "aerial_provider_policy") {
    const policyKey = typeof body.policyKey === "string" ? body.policyKey.trim() : "";
    if (!policyKey) {
      return jsonError("policyKey is required for aerial_provider_policy scope", "invalid_policy_key", 400);
    }

    const { data: policyRow, error: policyError } = await supabase
      .from("water_reader_aerial_provider_policies")
      .select("id, policy_key, source_id, is_enabled, approval_status, provider_health_target_url")
      .eq("policy_key", policyKey)
      .maybeSingle();

    if (policyError) {
      console.error("[waterbody-source-validation] aerial policy query failed", policyError);
      return jsonError("Failed to load aerial provider policy", "validation_failed", 500);
    }
    if (!policyRow) {
      return jsonError("Aerial provider policy not found", "policy_not_found", 404);
    }

    const policy = policyRow as AerialPolicyRow;

    const isApprovedEnabled = policy.is_enabled === true && policy.approval_status === "approved";
    const allowProdProbe = body.allowApprovedEnabledPolicyProbe === true;
    if (isApprovedEnabled && !allowProdProbe) {
      return jsonError(
        "Refusing to probe enabled+approved policy without allowApprovedEnabledPolicyProbe: true",
        "policy_probe_forbidden",
        403,
      );
    }

    const { data: sourceRow, error: sourceError } = await supabase
      .from("source_registry")
      .select("id, provider_name, provider_health_check_url")
      .eq("id", policy.source_id)
      .maybeSingle();

    if (sourceError) {
      console.error("[waterbody-source-validation] registry query failed (policy)", sourceError);
      return jsonError("Failed to load source registry row", "validation_failed", 500);
    }
    if (!sourceRow) {
      return jsonError("Source registry row for policy not found", "source_not_found", 404);
    }

    const source = sourceRow as SourceRegistryHealthRow;
    const override = policy.provider_health_target_url?.trim() ?? "";
    const fallback = source.provider_health_check_url?.trim() ?? "";
    const probeUrl = override.length > 0 ? override : fallback;
    if (!probeUrl) {
      return jsonError(
        "No provider health URL: set provider_health_target_url on the policy or provider_health_check_url on source_registry",
        "no_health_url",
        400,
      );
    }

    const result = await validateSourceProviderHealth({
      sourceId: source.id,
      providerName: source.provider_name,
      providerHealthUrl: probeUrl,
    });

    const { error: updateError } = await supabase
      .from("water_reader_aerial_provider_policies")
      .update({
        provider_health_status: result.status,
        provider_health_method: result.requestMethod,
        provider_health_target_url: result.providerHealthUrl,
        provider_health_checked_at: result.checkedAtISO,
        provider_health_http_status: result.httpStatus ?? null,
        provider_health_error: result.error ?? null,
        updated_at: result.checkedAtISO,
      })
      .eq("id", policy.id);

    if (updateError) {
      console.error("[waterbody-source-validation] aerial policy health update failed", updateError);
      return jsonError("Failed to persist aerial policy health", "validation_failed", 500);
    }

    return new Response(
      JSON.stringify({
        feature: WATERBODY_SOURCE_VALIDATION_FEATURE,
        validationScope: "aerial_provider_policy",
        policyKey: policy.policy_key,
        policyId: policy.id,
        result,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } },
    );
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
