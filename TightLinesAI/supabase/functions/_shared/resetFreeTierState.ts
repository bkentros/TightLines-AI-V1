import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  isAdminEmail,
} from "./appAccess.ts";

export function canResetFreeTierState(
  email: string | null | undefined,
): boolean {
  return isAdminEmail(email);
}

export type ResetFreeTierStateResult = {
  ok: true;
  profile_trials_reset: boolean;
  water_read_history_deleted: number;
  recommender_sessions_deleted: number;
  active_generation_requests_deleted: number;
};

export async function resetFreeTierStateForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<ResetFreeTierStateResult> {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      free_recommender_trial_used_at: null,
      free_water_read_trial_used_at: null,
      free_today_bite_full_used_at: null,
    })
    .eq("id", userId);

  if (profileError) {
    throw new Error(`profile_reset_failed:${profileError.message}`);
  }

  const { data: historyRows, error: historyError } = await supabase
    .from("water_reader_user_history")
    .delete()
    .eq("user_id", userId)
    .select("id");

  if (historyError) {
    throw new Error(`water_read_history_reset_failed:${historyError.message}`);
  }

  const { data: sessionRows, error: sessionError } = await supabase
    .from("recommender_daily_sessions")
    .delete()
    .eq("user_id", userId)
    .select("user_id");

  if (sessionError) {
    throw new Error(`recommender_sessions_reset_failed:${sessionError.message}`);
  }

  let activeGenerationDeleted = 0;
  const { data: activeRows, error: activeError } = await supabase
    .from("water_reader_user_active_generation_requests")
    .delete()
    .eq("user_id", userId)
    .select("user_id");

  if (activeError) {
    if (!activeError.message.toLowerCase().includes("does not exist")) {
      throw new Error(
        `active_generation_reset_failed:${activeError.message}`,
      );
    }
  } else {
    activeGenerationDeleted = activeRows?.length ?? 0;
  }

  return {
    ok: true,
    profile_trials_reset: true,
    water_read_history_deleted: historyRows?.length ?? 0,
    recommender_sessions_deleted: sessionRows?.length ?? 0,
    active_generation_requests_deleted: activeGenerationDeleted,
  };
}
