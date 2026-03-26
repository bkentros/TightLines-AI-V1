/**
 * Keep in sync with:
 * `supabase/functions/_shared/howFishingEngine/config/airTempDisplayConstants.ts`
 *
 * How's Fishing report air strip is always °F (engine Open-Meteo path). Home conditions
 * may use °C when the profile is metric — only use this threshold for °F UI (report).
 */
export const AIR_TEMP_LARGE_DIURNAL_SWING_F = 18;
