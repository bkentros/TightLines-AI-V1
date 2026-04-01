import { buildSharedEngineRequestFromEnvData } from "../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import { resolveRegionForCoordinates } from "../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
import { runRecommender } from "../supabase/functions/_shared/recommenderEngine/runRecommender.ts";
import { RECOMMENDER_CALIBRATION_SCENARIOS } from "./recommenderCalibrationScenarios.ts";

const filter = Deno.args[0]?.toLowerCase() ?? null;

for (const scenario of RECOMMENDER_CALIBRATION_SCENARIOS) {
  if (filter && !scenario.id.includes(filter) && !scenario.label.toLowerCase().includes(filter)) {
    continue;
  }

  const shared = buildSharedEngineRequestFromEnvData(
    scenario.latitude,
    scenario.longitude,
    scenario.local_date,
    scenario.timezone,
    scenario.context,
    scenario.env_data,
    0,
  );

  const region = resolveRegionForCoordinates(scenario.latitude, scenario.longitude);
  const result = runRecommender({
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      region_key: region.region_key,
      local_date: scenario.local_date,
      local_timezone: scenario.timezone,
      month: Number(scenario.local_date.slice(5, 7)),
    },
    species: scenario.species,
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    env_data: shared.environment as Record<string, unknown>,
  });

  console.log(`\n=== ${scenario.label} (${scenario.id}) ===`);
  console.log(`Confidence: ${result.confidence.tier.toUpperCase()} | ${result.confidence.reasons.join(" | ")}`);
  console.log(`Behavior: ${result.behavior.behavior_summary.join(" / ")}`);
  console.log("Top lures:");
  for (const family of result.lure_rankings) {
    console.log(`  - ${family.display_name} (${family.score}) :: ${family.why_picked}`);
  }
  console.log("Top flies:");
  for (const family of result.fly_rankings) {
    console.log(`  - ${family.display_name} (${family.score}) :: ${family.why_picked}`);
  }
}
