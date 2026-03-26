/**
 * One-shot local cache wipe for account-owner tools in Settings.
 * How's Fishing (today + forecast days), 7-day outlook chips, and env/live conditions.
 */

import { clearHowFishingReportCaches } from './howFishing';
import { clearAllForecastScoreCaches } from './forecastScores';
import { clearEnvCache } from './env/cache';

export async function clearOwnerFishCaches(): Promise<void> {
  await Promise.all([
    clearHowFishingReportCaches(),
    clearAllForecastScoreCaches(),
    clearEnvCache(),
  ]);
}
