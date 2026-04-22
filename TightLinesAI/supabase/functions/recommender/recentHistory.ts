import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { RankedRecommendation, RecommenderResponse } from "../_shared/recommenderEngine/contracts/output.ts";
import type { GearMode } from "../_shared/recommenderEngine/contracts/families.ts";
import type { SpeciesGroup } from "../_shared/recommenderEngine/contracts/species.ts";
import type { RegionKey } from "../_shared/howFishingEngine/contracts/region.ts";
import type { RecentRecommendationHistoryEntry } from "../_shared/recommenderEngine/rebuild/recentHistory.ts";

type AdminClient = ReturnType<typeof createClient>;

const RECENT_HISTORY_WINDOW_DAYS = 7;

type RecommendationHistoryRow = {
  user_id: string;
  local_date: string;
  species: SpeciesGroup;
  region_key: RegionKey;
  water_type: string;
  gear_mode: GearMode;
  archetype_id: string;
};

function subtractDaysIso(localDate: string, days: number): string {
  const utc = Date.parse(`${localDate}T00:00:00Z`);
  if (Number.isNaN(utc)) return localDate;
  return new Date(utc - days * 86_400_000).toISOString().slice(0, 10);
}

export async function loadRecentRecommendationHistory(args: {
  supabase: AdminClient;
  userId: string;
  localDate: string;
  species: SpeciesGroup;
  regionKey: RegionKey;
  waterType: string;
}): Promise<RecentRecommendationHistoryEntry[]> {
  const { supabase, userId, localDate, species, regionKey, waterType } = args;
  const cutoff = subtractDaysIso(localDate, RECENT_HISTORY_WINDOW_DAYS);
  const { data, error } = await supabase
    .from("recommender_recent_history")
    .select("archetype_id, gear_mode, local_date")
    .eq("user_id", userId)
    .eq("species", species)
    .eq("region_key", regionKey)
    .eq("water_type", waterType)
    .lt("local_date", localDate)
    .gte("local_date", cutoff)
    .order("local_date", { ascending: false });

  if (error) {
    console.error("[recommender] recent-history load failed:", error.message);
    return [];
  }

  return (data ?? []) as RecentRecommendationHistoryEntry[];
}

function toRows(args: {
  userId: string;
  localDate: string;
  species: SpeciesGroup;
  regionKey: RegionKey;
  waterType: string;
  result: RecommenderResponse;
}): RecommendationHistoryRow[] {
  const { userId, localDate, species, regionKey, waterType, result } = args;

  const rowsFor = (
    gearMode: GearMode,
    picks: RankedRecommendation[],
  ): RecommendationHistoryRow[] =>
    picks.map((pick) => ({
      user_id: userId,
      local_date: localDate,
      species,
      region_key: regionKey,
      water_type: waterType,
      gear_mode: gearMode,
      archetype_id: pick.id,
    }));

  return [
    ...rowsFor("lure", result.lure_recommendations),
    ...rowsFor("fly", result.fly_recommendations),
  ];
}

export async function persistRecommendationHistory(args: {
  supabase: AdminClient;
  userId: string;
  localDate: string;
  species: SpeciesGroup;
  regionKey: RegionKey;
  waterType: string;
  result: RecommenderResponse;
}): Promise<void> {
  const { supabase, ...rest } = args;
  const rows = toRows(rest);
  if (rows.length === 0) return;

  const { error } = await supabase
    .from("recommender_recent_history")
    .upsert(rows as never[], {
      onConflict: "user_id,local_date,species,region_key,water_type,gear_mode,archetype_id",
    });

  if (error) {
    console.error("[recommender] recent-history persist failed:", error.message);
  }
}
