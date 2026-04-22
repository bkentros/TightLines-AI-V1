/**
 * Synthetic How’s env → score bands → `regimeFromHowsScore` → rebuild `profiles[0]`.
 * Run: deno test --allow-read supabase/functions/_shared/recommenderEngine/__tests__/howsScoreRegimeFixtures.test.ts
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { computeRecommenderRebuild } from "../rebuild/runRecommenderRebuild.ts";
import { regimeFromHowsScore } from "../rebuild/shapeProfiles.ts";
import { analyzeRecommenderConditions } from "../sharedAnalysis.ts";
import {
  syntheticHowsEnvLmbLakeAggressive,
  syntheticHowsEnvLmbLakeNeutralMiddling,
  syntheticHowsEnvLmbLakeSuppressive,
  syntheticLmbLakeRequest,
} from "../testFixtures/syntheticHowsScoreEnvLake.ts";

Deno.test("synthetic LMB lake fixtures: How’s scores hit suppressive / middling / aggressive bands", () => {
  const rSup = syntheticLmbLakeRequest(syntheticHowsEnvLmbLakeSuppressive());
  const rMid = syntheticLmbLakeRequest(syntheticHowsEnvLmbLakeNeutralMiddling());
  const rAgg = syntheticLmbLakeRequest(syntheticHowsEnvLmbLakeAggressive());

  const sSup = analyzeRecommenderConditions(rSup).scored.score;
  const sMid = analyzeRecommenderConditions(rMid).scored.score;
  const sAgg = analyzeRecommenderConditions(rAgg).scored.score;

  assert(sSup <= 35, `expected suppressive score <=35, got ${sSup}`);
  assert(sMid >= 48 && sMid <= 52, `expected middling ~50, got ${sMid}`);
  assert(sAgg >= 70, `expected aggressive score >=70, got ${sAgg}`);

  assertEquals(regimeFromHowsScore(sSup), "suppressive");
  assertEquals(regimeFromHowsScore(sMid), "neutral");
  assertEquals(regimeFromHowsScore(sAgg), "aggressive");
});

Deno.test("synthetic LMB lake fixtures: rebuild shaping shifts slot-0 profile with regime", () => {
  const rSup = syntheticLmbLakeRequest(syntheticHowsEnvLmbLakeSuppressive());
  const rAgg = syntheticLmbLakeRequest(syntheticHowsEnvLmbLakeAggressive());

  const aSup = analyzeRecommenderConditions(rSup);
  const aAgg = analyzeRecommenderConditions(rAgg);

  const eSup = computeRecommenderRebuild(rSup, aSup, {});
  const eAgg = computeRecommenderRebuild(rAgg, aAgg, {});

  assertEquals(eSup.regime, "suppressive");
  assertEquals(eAgg.regime, "aggressive");

  assert(
    eSup.profiles[0]!.column !== eAgg.profiles[0]!.column ||
      eSup.profiles[0]!.pace !== eAgg.profiles[0]!.pace,
    "expected slot-0 TargetProfile to differ between suppressive and aggressive",
  );
});
