/**
 * One-shot local cache wipe for account-owner tools in Settings.
 * How's Fishing (today + forecast days), 7-day outlook chips, env/live conditions,
 * and on-device lure/fly recommender day cache.
 */

import { clearHowFishingReportCaches } from './howFishing';
import { clearAllForecastScoreCaches } from './forecastScores';
import { clearEnvCache } from './env/cache';
import { clearRecommenderCache } from './recommender';

export async function clearOwnerFishCaches(): Promise<void> {
  await Promise.all([
    clearHowFishingReportCaches(),
    clearAllForecastScoreCaches(),
    clearEnvCache(),
    clearRecommenderCache(),
  ]);
}
