import { readFileSync } from "fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const recommenderClient = readFileSync("lib/recommender.ts", "utf8");
const recommenderSession = readFileSync(
  "supabase/functions/recommender/dailyPicksSession.ts",
  "utf8",
);
const recommenderSessionMigration = readFileSync(
  "supabase/migrations/20260507170000_create_recommender_daily_sessions.sql",
  "utf8",
);
const recommenderGoalMigration = readFileSync(
  "supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql",
  "utf8",
);
const waterReaderContracts = readFileSync(
  "supabase/functions/_shared/waterReaderRead/contracts.ts",
  "utf8",
);
const waterReaderCacheMigration = readFileSync(
  "supabase/migrations/202605030001_water_reader_engine_read_cache.sql",
  "utf8",
);
const waterReaderQueueMigration = readFileSync(
  "supabase/migrations/20260515120000_water_reader_generation_queue_history.sql",
  "utf8",
);

assert(
  recommenderClient.includes("function currentCacheOwnerId()"),
  "recommender client cache should read the signed-in owner id",
);
assert(
  recommenderClient.includes("`user_${ownerId}`"),
  "recommender client cache key should include owner id",
);
assert(
  recommenderClient.includes("user_id: CacheOwnerId"),
  "recommender client cache entries should persist owner id",
);
assert(
  recommenderClient.includes("mem.user_id !== ownerId") &&
    recommenderClient.includes("entry.user_id !== ownerId"),
  "recommender client cache should reject cross-user memory and disk entries",
);
assert(
  recommenderClient.includes(
    "if (ownerId && !opts.forceRefresh && !opts.viewVariant)",
  ),
  "recommender client should not read cache when no current user is known",
);
assert(
  recommenderClient.includes(
    "setCachedResult(requestParams, result, cacheOwner)",
  ),
  "recommender client should write cache under the current owner id",
);

assert(
  recommenderSession.includes("user_id: string") &&
    recommenderSession.includes("user_id: userId"),
  "recommender server sessions should be keyed by user id",
);
assert(
  recommenderSessionMigration.includes("user_id uuid not null") &&
    recommenderSessionMigration.includes("user_id,") &&
    recommenderGoalMigration.includes("recommendation_goal"),
  "recommender DB session key should include user id and recommendation goal",
);

assert(
  waterReaderContracts.includes("water-reader-engine-v6-conservative-copy"),
  "Water Reader cache should bump engine version when legend/read copy changes",
);
assert(
  waterReaderCacheMigration.includes(
    "primary key (lake_id, season_context_key, map_width, engine_version)",
  ),
  "Water Reader shared cache should be lake/season/renderer keyed, not user keyed",
);
assert(
  waterReaderQueueMigration.includes(
    "unique (user_id, lake_id, season_context_key, map_width, engine_version)",
  ),
  "Water Reader user history should remain user keyed around the shared cache",
);

console.log(
  JSON.stringify({
    ok: true,
    feature: "recommender_and_water_reader_cache_contracts",
  }),
);
