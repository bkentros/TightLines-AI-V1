import { clearOwnerFishCaches } from './clearOwnerFishCaches';
import { getValidAccessToken, invokeEdgeFunction } from './supabase';

export type ResetFreeTierStateResponse = {
  ok: true;
  profile_trials_reset: boolean;
  water_read_history_deleted: number;
  recommender_sessions_deleted: number;
  active_generation_requests_deleted: number;
  targetUserId?: string;
  targetEmail?: string | null;
};

export async function resetFreeTierState(options?: {
  targetEmail?: string;
}): Promise<ResetFreeTierStateResponse> {
  const accessToken = await getValidAccessToken();
  const result = await invokeEdgeFunction<ResetFreeTierStateResponse>(
    'admin-reset-free-trials',
    {
      accessToken,
      body: options?.targetEmail ? { targetEmail: options.targetEmail } : {},
    },
  );
  await clearOwnerFishCaches();
  return result;
}
