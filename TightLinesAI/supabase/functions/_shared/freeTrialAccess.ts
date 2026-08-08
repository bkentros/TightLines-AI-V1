import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export const FREE_TRIAL_PROFILE_SELECT =
  "subscription_tier, free_recommender_trial_used_at, free_water_read_trial_used_at, free_today_bite_full_used_at, free_river_run_trial_used_at, free_river_run_trial_river_id, free_river_run_trial_run_id, free_river_run_trial_presentation_state, free_river_run_trial_local_date, free_river_run_trial_refresh_slot, free_river_run_trial_engine_version, free_river_run_trial_config_version";

export type FreeTrialProfileRow = {
  subscription_tier: string | null;
  free_recommender_trial_used_at: string | null;
  free_water_read_trial_used_at: string | null;
  free_today_bite_full_used_at: string | null;
  free_river_run_trial_used_at?: string | null;
  free_river_run_trial_river_id?: string | null;
  free_river_run_trial_run_id?: string | null;
  free_river_run_trial_presentation_state?: string | null;
  free_river_run_trial_local_date?: string | null;
  free_river_run_trial_refresh_slot?: string | null;
  free_river_run_trial_engine_version?: string | null;
  free_river_run_trial_config_version?: string | null;
};

export function freeRecommenderTrialAvailable(
  profile: FreeTrialProfileRow | null | undefined,
): boolean {
  return profile?.free_recommender_trial_used_at == null;
}

export function freeWaterReadTrialAvailable(
  profile: FreeTrialProfileRow | null | undefined,
): boolean {
  return profile?.free_water_read_trial_used_at == null;
}

export function freeTodayBiteFullTrialAvailable(
  profile: FreeTrialProfileRow | null | undefined,
): boolean {
  return profile?.free_today_bite_full_used_at == null;
}

export function freeRiverRunTrialAvailable(
  profile: FreeTrialProfileRow | null | undefined,
): boolean {
  return profile?.free_river_run_trial_used_at == null;
}

export async function markFreeRecommenderTrialUsed(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ free_recommender_trial_used_at: new Date().toISOString() })
    .eq("id", userId)
    .is("free_recommender_trial_used_at", null);
  if (error) {
    console.error("[freeTrialAccess] mark recommender trial failed", error.message);
  }
}

export async function markFreeWaterReadTrialUsed(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ free_water_read_trial_used_at: new Date().toISOString() })
    .eq("id", userId)
    .is("free_water_read_trial_used_at", null);
  if (error) {
    console.error("[freeTrialAccess] mark water read trial failed", error.message);
  }
}

export async function markFreeTodayBiteFullUsed(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const markedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("profiles")
    .update({ free_today_bite_full_used_at: markedAt })
    .eq("id", userId)
    .is("free_today_bite_full_used_at", null)
    .select("free_today_bite_full_used_at")
    .maybeSingle<{ free_today_bite_full_used_at: string | null }>();

  if (error) {
    throw new Error(`mark_today_bite_trial_failed:${error.message}`);
  }

  if (data?.free_today_bite_full_used_at) {
    return;
  }

  // Idempotent path: another concurrent request may have marked first.
  const { data: profile, error: readError } = await supabase
    .from("profiles")
    .select("free_today_bite_full_used_at")
    .eq("id", userId)
    .maybeSingle<{ free_today_bite_full_used_at: string | null }>();

  if (readError) {
    throw new Error(`mark_today_bite_trial_verify_failed:${readError.message}`);
  }
  if (profile?.free_today_bite_full_used_at == null) {
    throw new Error("mark_today_bite_trial_not_persisted");
  }
}

export async function userHasWaterReadHistoryForLake(
  supabase: SupabaseClient,
  userId: string,
  lakeId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("water_reader_user_history")
    .select("lake_id")
    .eq("user_id", userId)
    .eq("lake_id", lakeId)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[freeTrialAccess] water read history lookup failed", error.message);
    return false;
  }
  return data != null;
}

export async function userHasAnyWaterReadHistory(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("water_reader_user_history")
    .select("lake_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[freeTrialAccess] water read any-history lookup failed", error.message);
    return false;
  }
  return data != null;
}

/** Free tier: one trial lake ever; revisits only for lakes already in user history. */
export async function isFreeTierWaterReadAllowed(
  supabase: SupabaseClient,
  userId: string,
  lakeId: string,
  profile: FreeTrialProfileRow | null | undefined,
): Promise<boolean> {
  if (await userHasWaterReadHistoryForLake(supabase, userId, lakeId)) {
    return true;
  }
  if (await userHasAnyWaterReadHistory(supabase, userId)) {
    return false;
  }
  return freeWaterReadTrialAvailable(profile);
}

export async function markFreeWaterReadTrialUsedIfNeeded(
  supabase: SupabaseClient,
  userId: string,
  profile: FreeTrialProfileRow | null | undefined,
  tier: string,
): Promise<void> {
  if (tier !== "free" || !freeWaterReadTrialAvailable(profile)) return;
  await markFreeWaterReadTrialUsed(supabase, userId);
}
