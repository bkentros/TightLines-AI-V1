import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { RecommenderRequest } from "../_shared/recommenderEngine/contracts/input.ts";
import {
  RECOMMENDER_DAILY_SESSION_ENGINE_VERSION,
  type RecommenderResponse,
} from "../_shared/recommenderEngine/contracts/output.ts";

type AdminClient = ReturnType<typeof createClient>;
export type RecommenderDailyVariant = "A" | "B";
export type GenerateVariantOptions = {
  attempt: number;
  avoidResponse?: RecommenderResponse;
};

const TABLE = "recommender_daily_sessions";
const MAX_REFRESH_VARIANT_ATTEMPTS = 8;

type SessionKey = {
  user_id: string;
  local_date: string;
  lat_key: string;
  lon_key: string;
  state_code: string;
  region_key: string;
  species: string;
  water_type: string;
  water_clarity: string;
  engine_version: string;
};

type SessionRow = SessionKey & {
  active_variant: RecommenderDailyVariant;
  refreshes_used: 0 | 1;
  variant_a_response: RecommenderResponse;
  variant_b_response: RecommenderResponse | null;
  cache_expires_at: string;
  created_at?: string;
  updated_at?: string;
};

function utcNowIso(): string {
  return new Date().toISOString();
}

function latLonKey(value: number): string {
  return value.toFixed(3);
}

function buildSessionKey(args: {
  userId: string;
  req: RecommenderRequest;
}): SessionKey {
  const { userId, req } = args;
  return {
    user_id: userId,
    local_date: req.location.local_date,
    lat_key: latLonKey(req.location.latitude),
    lon_key: latLonKey(req.location.longitude),
    state_code: req.location.state_code.toUpperCase(),
    region_key: req.location.region_key,
    species: req.species,
    water_type: req.context,
    water_clarity: req.water_clarity,
    engine_version: RECOMMENDER_DAILY_SESSION_ENGINE_VERSION,
  };
}

function applySessionMetadata(args: {
  response: RecommenderResponse;
  row: Pick<
    SessionRow,
    "local_date" | "active_variant" | "refreshes_used" | "cache_expires_at"
  >;
}): RecommenderResponse {
  const canRefresh = args.row.active_variant === "A" &&
    args.row.refreshes_used === 0;
  return {
    ...args.response,
    cache_expires_at: args.row.cache_expires_at,
    recommendation_session: {
      local_date: args.row.local_date,
      variant: args.row.active_variant,
      can_refresh: canRefresh,
      refreshes_remaining: canRefresh ? 1 : 0,
      locked_until: args.row.cache_expires_at,
    },
  };
}

function activeResponse(row: SessionRow): RecommenderResponse {
  const response = row.active_variant === "B" && row.variant_b_response
    ? row.variant_b_response
    : row.variant_a_response;
  return applySessionMetadata({ response, row });
}

function recommendationIds(response: RecommenderResponse): string {
  return [
    ...response.lure_recommendations.map((pick) => `lure:${pick.id}`),
    ...response.fly_recommendations.map((pick) => `fly:${pick.id}`),
  ].join("|");
}

function recommendationsDiffer(
  a: RecommenderResponse,
  b: RecommenderResponse,
): boolean {
  return recommendationIds(a) !== recommendationIds(b);
}

async function readSession(args: {
  supabase: AdminClient;
  key: SessionKey;
}): Promise<SessionRow | null> {
  const { supabase, key } = args;
  let query = supabase.from(TABLE).select("*");
  for (const [column, value] of Object.entries(key)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`daily session read failed: ${error.message}`);
  }
  return data as SessionRow | null;
}

async function saveSession(args: {
  supabase: AdminClient;
  row: SessionRow;
}): Promise<SessionRow | null> {
  const { data, error } = await args.supabase
    .from(TABLE)
    .insert(args.row as never)
    .select("*")
    .maybeSingle();
  if (error) {
    if ((error as { code?: string }).code === "23505") {
      return null;
    }
    throw new Error(`daily session create failed: ${error.message}`);
  }
  return data as SessionRow | null;
}

async function claimVariantB(args: {
  supabase: AdminClient;
  key: SessionKey;
  response: RecommenderResponse;
}): Promise<SessionRow | null> {
  const { supabase, key, response } = args;
  let query = supabase
    .from(TABLE)
    .update({
      active_variant: "B",
      refreshes_used: 1,
      variant_b_response: response,
      updated_at: utcNowIso(),
    } as never);
  for (const [column, value] of Object.entries(key)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query
    .eq("active_variant", "A")
    .eq("refreshes_used", 0)
    .is("variant_b_response", null)
    .select("*")
    .maybeSingle();
  if (error) {
    throw new Error(`daily session refresh claim failed: ${error.message}`);
  }
  return data as SessionRow | null;
}

export async function resolveRecommenderDailySession(args: {
  supabase: AdminClient;
  userId: string;
  req: RecommenderRequest;
  refreshRequested: boolean;
  generateVariant: (
    variant: RecommenderDailyVariant,
    options: GenerateVariantOptions,
  ) => Promise<RecommenderResponse>;
}): Promise<{
  result: RecommenderResponse;
  generatedVariant: RecommenderDailyVariant | null;
}> {
  const key = buildSessionKey({ userId: args.userId, req: args.req });
  const existing = await readSession({ supabase: args.supabase, key });

  if (!existing) {
    const generated = await args.generateVariant("A", { attempt: 0 });
    const row: SessionRow = {
      ...key,
      active_variant: "A",
      refreshes_used: 0,
      cache_expires_at: generated.cache_expires_at,
      variant_a_response: generated,
      variant_b_response: null,
      created_at: utcNowIso(),
      updated_at: utcNowIso(),
    };
    row.variant_a_response = activeResponse(row);
    const inserted = await saveSession({ supabase: args.supabase, row });
    if (!inserted) {
      const racedExisting = await readSession({
        supabase: args.supabase,
        key,
      });
      if (racedExisting) {
        return {
          result: activeResponse(racedExisting),
          generatedVariant: null,
        };
      }
      throw new Error("daily session create conflict could not be resolved");
    }
    return { result: row.variant_a_response, generatedVariant: "A" };
  }

  if (
    args.refreshRequested &&
    existing.active_variant === "A" &&
    existing.refreshes_used === 0
  ) {
    let generated: RecommenderResponse | null = null;
    for (let attempt = 0; attempt < MAX_REFRESH_VARIANT_ATTEMPTS; attempt++) {
      const candidate = await args.generateVariant("B", {
        attempt,
        avoidResponse: existing.variant_a_response,
      });
      generated = candidate;
      if (recommendationsDiffer(existing.variant_a_response, candidate)) {
        break;
      }
    }
    if (generated == null) {
      throw new Error("daily session refresh generation failed");
    }
    const row: SessionRow = {
      ...existing,
      active_variant: "B",
      refreshes_used: 1,
      cache_expires_at: existing.cache_expires_at,
      variant_b_response: generated,
      updated_at: utcNowIso(),
    };
    row.variant_b_response = activeResponse(row);
    const claimed = await claimVariantB({
      supabase: args.supabase,
      key,
      response: row.variant_b_response,
    });
    if (claimed) {
      return { result: activeResponse(claimed), generatedVariant: "B" };
    }
    const racedExisting = await readSession({
      supabase: args.supabase,
      key,
    });
    if (racedExisting) {
      return { result: activeResponse(racedExisting), generatedVariant: null };
    }
    throw new Error(
      "daily session refresh claim conflict could not be resolved",
    );
  }

  return { result: activeResponse(existing), generatedVariant: null };
}
