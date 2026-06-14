import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

export const FREE_TRIAL_PROFILE_SELECT =
  "subscription_tier, free_recommender_trial_used_at, free_water_read_trial_used_at, free_today_bite_full_used_at";

export type FreeTrialProfileRow = {
  subscription_tier: string | null;
  free_recommender_trial_used_at: string | null;
  free_water_read_trial_used_at: string | null;
  free_today_bite_full_used_at: string | null;
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
  const { error } = await supabase
    .from("profiles")
    .update({ free_today_bite_full_used_at: new Date().toISOString() })
    .eq("id", userId)
    .is("free_today_bite_full_used_at", null);
  if (error) {
    console.error("[freeTrialAccess] mark today bite full trial failed", error.message);
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
