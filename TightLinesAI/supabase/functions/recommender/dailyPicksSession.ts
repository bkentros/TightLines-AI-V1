import { CONDITION_MODEL_VERSION } from "../_shared/conditionModelVersion.ts";
import { nextMidnightInTimeZoneMs } from "../../../lib/forecastSnapshot.ts";
import type { RecommenderRequest } from "../_shared/recommenderEngine/contracts/input.ts";
import type {
  DailyPicksFutureResponse,
} from "../_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts";
import {
  runDailyPicksSurface,
} from "../_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts";
import type { DailyPicksVariant } from "../_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts";

type SupabaseLike = {
  from: (table: string) => any;
};

export const DAILY_PICKS_SESSION_ENGINE_VERSION =
  "recommender_daily_picks_2x2_sessionv1_goalv3" as const;

export type DailyPicksRecommendationSession = {
  local_date: string;
  variant: DailyPicksVariant;
  available_variants: DailyPicksVariant[];
  can_refresh: boolean;
  refreshes_remaining: 0 | 1;
  locked_until: string;
};

export type DailyPicksSessionResponse = DailyPicksFutureResponse & {
  condition_model_version?: string;
  generated_at: string;
  cache_expires_at: string;
  recommendation_session: DailyPicksRecommendationSession;
};

export type GenerateDailyPicksVariantOptions = {
  attempt: number;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
  avoidResponse?: DailyPicksSessionResponse;
};

const TABLE = "recommender_daily_sessions";

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
  recommendation_goal: string;
  engine_version: string;
};

type SessionRow = SessionKey & {
  active_variant: DailyPicksVariant;
  refreshes_used: 0 | 1;
  variant_a_response: DailyPicksSessionResponse;
  variant_b_response: DailyPicksSessionResponse | null;
  cache_expires_at: string;
  created_at?: string;
  updated_at?: string;
};

export class DailyPicksVariantUnavailableError extends Error {
  constructor(variant: DailyPicksVariant) {
    super(`daily picks session variant ${variant} is not available`);
    this.name = "DailyPicksVariantUnavailableError";
  }
}

function utcNowIso(now = new Date()): string {
  return now.toISOString();
}

function latLonKey(value: number): string {
  return value.toFixed(3);
}

export function dailyPicksLocationLocalMidnightIso(
  timezone: string,
  now = new Date(),
): string {
  return new Date(nextMidnightInTimeZoneMs(timezone, now.getTime()))
    .toISOString();
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
    recommendation_goal: req.recommendation_goal,
    engine_version: DAILY_PICKS_SESSION_ENGINE_VERSION,
  };
}

function withSessionMetadata(args: {
  response: DailyPicksFutureResponse | DailyPicksSessionResponse;
  row: Pick<
    SessionRow,
    | "local_date"
    | "active_variant"
    | "refreshes_used"
    | "variant_b_response"
    | "cache_expires_at"
  >;
  generatedAt: string;
  variant?: DailyPicksVariant;
}): DailyPicksSessionResponse {
  const canRefresh = args.row.refreshes_used === 0 &&
    args.row.variant_b_response == null;
  const availableVariants: DailyPicksVariant[] = args.row.variant_b_response
    ? ["A", "B"]
    : ["A"];
  return {
    ...args.response,
    generated_at: (args.response as Partial<DailyPicksSessionResponse>)
      .generated_at ?? args.generatedAt,
    cache_expires_at: args.row.cache_expires_at,
    recommendation_session: {
      local_date: args.row.local_date,
      variant: args.variant ?? args.row.active_variant,
      available_variants: availableVariants,
      can_refresh: canRefresh,
      refreshes_remaining: canRefresh ? 1 : 0,
      locked_until: args.row.cache_expires_at,
    },
  };
}

function activeResponse(row: SessionRow): DailyPicksSessionResponse {
  const response = row.active_variant === "B" && row.variant_b_response
    ? row.variant_b_response
    : row.variant_a_response;
  return withSessionMetadata({
    response,
    row,
    generatedAt: response.generated_at,
    variant: row.active_variant,
  });
}

function responseForVariant(
  row: SessionRow,
  variant: DailyPicksVariant,
): DailyPicksSessionResponse {
  const response = variant === "A"
    ? row.variant_a_response
    : row.variant_b_response;
  if (!response) {
    throw new DailyPicksVariantUnavailableError(variant);
  }
  return withSessionMetadata({
    response,
    row,
    generatedAt: response.generated_at,
    variant,
  });
}

function selectedIds(response: DailyPicksFutureResponse): {
  lures: readonly string[];
  flies: readonly string[];
} {
  return {
    lures: response.diagnostics.selected_lure_ids,
    flies: response.diagnostics.selected_fly_ids,
  };
}

async function readExactSession(args: {
  supabase: SupabaseLike;
  key: SessionKey;
}): Promise<SessionRow | null> {
  let query = args.supabase.from(TABLE).select("*");
  for (const [column, value] of Object.entries(args.key)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query.maybeSingle();
  if (error) {
    throw new Error(`daily picks session read failed: ${error.message}`);
  }
  return data as SessionRow | null;
}

/** Coordinates identify the same session even when a routing correction changes state/region. */
async function readSession(
  args: { supabase: SupabaseLike; key: SessionKey },
): Promise<SessionRow | null> {
  const exact = await readExactSession(args);
  if (exact) return exact;
  let query = args.supabase.from(TABLE).select("*");
  for (const [column, value] of Object.entries(args.key)) {
    if (column !== "state_code" && column !== "region_key") {
      query = query.eq(column, value);
    }
  }
  const { data, error } = await query.order("created_at", { ascending: false })
    .limit(1).maybeSingle();
  if (error) {
    throw new Error(
      `daily picks session routing lookup failed: ${error.message}`,
    );
  }
  return data as SessionRow | null;
}

function keyFromRow(row: SessionRow): SessionKey {
  const {
    user_id,
    local_date,
    lat_key,
    lon_key,
    state_code,
    region_key,
    species,
    water_type,
    water_clarity,
    recommendation_goal,
    engine_version,
  } = row;
  return {
    user_id,
    local_date,
    lat_key,
    lon_key,
    state_code,
    region_key,
    species,
    water_type,
    water_clarity,
    recommendation_goal,
    engine_version,
  };
}

async function upgradeSession(args: {
  supabase: SupabaseLike;
  row: SessionRow;
  generatedAt: string;
  generate: NonNullable<
    Parameters<typeof resolveDailyPicksSession>[0]["generateVariant"]
  >;
}): Promise<SessionRow> {
  let row = args.row;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (
      row.variant_a_response.condition_model_version ===
        CONDITION_MODEL_VERSION &&
      (!row.variant_b_response ||
        row.variant_b_response.condition_model_version ===
          CONDITION_MODEL_VERSION)
    ) return row;
    const a = await args.generate("A", { attempt: 0 });
    const upgradedA = withSessionMetadata({
      response: a,
      row,
      generatedAt: args.generatedAt,
      variant: "A",
    });
    const avoid = selectedIds(a);
    const b = row.variant_b_response
      ? await args.generate("B", {
        attempt: 0,
        avoidLureIds: avoid.lures,
        avoidFlyIds: avoid.flies,
        avoidResponse: upgradedA,
      })
      : null;
    let query = args.supabase.from(TABLE).update({
      variant_a_response: upgradedA,
      variant_b_response: b
        ? withSessionMetadata({
          response: b,
          row,
          generatedAt: args.generatedAt,
          variant: "B",
        })
        : null,
      updated_at: args.generatedAt,
    });
    const key = keyFromRow(row);
    for (const [column, value] of Object.entries(key)) {
      query = query.eq(column, value);
    }
    // Compare-and-set protects both a concurrent upgrade and a concurrent refresh.
    query = query.eq("active_variant", row.active_variant).eq(
      "refreshes_used",
      row.refreshes_used,
    );
    const revision = row.variant_a_response.condition_model_version;
    query = revision == null
      ? query.is("variant_a_response->>condition_model_version", null)
      : query.eq("variant_a_response->>condition_model_version", revision);
    const { data, error } = await query.select("*").maybeSingle();
    if (error) {
      throw new Error(`daily picks session upgrade failed: ${error.message}`);
    }
    if (data) return data as SessionRow;
    const latest = await readExactSession({ supabase: args.supabase, key });
    if (!latest) {
      throw new Error("daily picks session disappeared during upgrade");
    }
    row = latest;
  }
  throw new Error(
    "daily picks session changed repeatedly during upgrade; retry",
  );
}

async function saveSession(args: {
  supabase: SupabaseLike;
  row: SessionRow;
}): Promise<SessionRow | null> {
  const { data, error } = await args.supabase
    .from(TABLE)
    .insert(args.row)
    .select("*")
    .maybeSingle();
  if (error) {
    if ((error as { code?: string }).code === "23505") return null;
    throw new Error(`daily picks session create failed: ${error.message}`);
  }
  return data as SessionRow | null;
}

async function claimVariantB(args: {
  supabase: SupabaseLike;
  key: SessionKey;
  response: DailyPicksSessionResponse;
}): Promise<SessionRow | null> {
  let query = args.supabase
    .from(TABLE)
    .update({
      active_variant: "B",
      refreshes_used: 1,
      variant_b_response: args.response,
      updated_at: utcNowIso(),
    });
  for (const [column, value] of Object.entries(args.key)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query
    .eq("active_variant", "A")
    .eq("refreshes_used", 0)
    .is("variant_b_response", null)
    .select("*")
    .maybeSingle();
  if (error) {
    throw new Error(
      `daily picks session refresh claim failed: ${error.message}`,
    );
  }
  return data as SessionRow | null;
}

export async function dailyPicksSessionExists(args: {
  supabase: SupabaseLike;
  userId: string;
  req: RecommenderRequest;
}): Promise<boolean> {
  const key = buildSessionKey({ userId: args.userId, req: args.req });
  const existing = await readSession({ supabase: args.supabase, key });
  return existing != null;
}

export async function resolveDailyPicksSession(args: {
  supabase: SupabaseLike;
  userId: string;
  req: RecommenderRequest;
  refreshRequested: boolean;
  viewVariant?: DailyPicksVariant;
  seed: string;
  now?: Date;
  generateVariant?: (
    variant: DailyPicksVariant,
    options: GenerateDailyPicksVariantOptions,
  ) => Promise<DailyPicksFutureResponse> | DailyPicksFutureResponse;
}): Promise<{
  result: DailyPicksSessionResponse;
  generatedVariant: DailyPicksVariant | null;
}> {
  let key = buildSessionKey({ userId: args.userId, req: args.req });
  let existing = await readSession({ supabase: args.supabase, key });
  const now = args.now ?? new Date();
  const generatedAt = utcNowIso(now);
  const cacheExpiresAt = dailyPicksLocationLocalMidnightIso(
    args.req.location.local_timezone,
    now,
  );
  const generateRaw: NonNullable<typeof args.generateVariant> =
    args.generateVariant ??
      ((variant, options) =>
        runDailyPicksSurface(args.req, {
          seed: `${args.seed}|${variant}|${options.attempt}`,
          variant,
          avoidLureIds: options.avoidLureIds,
          avoidFlyIds: options.avoidFlyIds,
        }));

  const generateVariant: NonNullable<typeof args.generateVariant> = async (
    variant,
    options,
  ) => ({
    ...await generateRaw(variant, options),
    condition_model_version: CONDITION_MODEL_VERSION,
  });

  if (existing) {
    existing = await upgradeSession({
      supabase: args.supabase,
      row: existing,
      generatedAt,
      generate: generateVariant,
    });
    key = keyFromRow(existing);
  }

  if (!existing) {
    if (args.viewVariant != null) {
      throw new DailyPicksVariantUnavailableError(args.viewVariant);
    }
    const generated = await generateVariant("A", { attempt: 0 });
    const row: SessionRow = {
      ...key,
      active_variant: "A",
      refreshes_used: 0,
      cache_expires_at: cacheExpiresAt,
      variant_a_response: generated as DailyPicksSessionResponse,
      variant_b_response: null,
      created_at: generatedAt,
      updated_at: generatedAt,
    };
    row.variant_a_response = activeResponse({
      ...row,
      variant_a_response: withSessionMetadata({
        response: generated,
        row,
        generatedAt,
      }),
    });
    const inserted = await saveSession({ supabase: args.supabase, row });
    if (!inserted) {
      let racedExisting = await readSession({
        supabase: args.supabase,
        key,
      });
      if (racedExisting) {
        racedExisting = await upgradeSession({
          supabase: args.supabase,
          row: racedExisting,
          generatedAt,
          generate: generateVariant,
        });
        if (args.viewVariant != null) {
          return {
            result: responseForVariant(racedExisting, args.viewVariant),
            generatedVariant: null,
          };
        }
        return {
          result: activeResponse(racedExisting),
          generatedVariant: null,
        };
      }
      throw new Error(
        "daily picks session create conflict could not be resolved",
      );
    }
    return { result: row.variant_a_response, generatedVariant: "A" };
  }

  if (args.viewVariant != null) {
    return {
      result: responseForVariant(existing, args.viewVariant),
      generatedVariant: null,
    };
  }

  if (
    args.refreshRequested &&
    existing.active_variant === "A" &&
    existing.refreshes_used === 0
  ) {
    const avoid = selectedIds(existing.variant_a_response);
    const generated = await generateVariant("B", {
      attempt: 0,
      avoidLureIds: avoid.lures,
      avoidFlyIds: avoid.flies,
      avoidResponse: existing.variant_a_response,
    });
    const claimedResponse = withSessionMetadata({
      response: generated,
      row: {
        ...existing,
        active_variant: "B",
        refreshes_used: 1,
      },
      generatedAt,
    });
    const claimed = await claimVariantB({
      supabase: args.supabase,
      key,
      response: claimedResponse,
    });
    if (claimed) {
      return { result: activeResponse(claimed), generatedVariant: "B" };
    }
    let racedExisting = await readSession({
      supabase: args.supabase,
      key,
    });
    if (racedExisting) {
      racedExisting = await upgradeSession({
        supabase: args.supabase,
        row: racedExisting,
        generatedAt,
        generate: generateVariant,
      });
      return { result: activeResponse(racedExisting), generatedVariant: null };
    }
    throw new Error(
      "daily picks session refresh claim conflict could not be resolved",
    );
  }

  return { result: activeResponse(existing), generatedVariant: null };
}
