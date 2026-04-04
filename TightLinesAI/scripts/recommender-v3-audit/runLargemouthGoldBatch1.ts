import {
  LARGEMOUTH_V3_GOLD_BATCH_1,
  RECOMMENDER_AUDIT_SCORE_KEYS,
} from "../recommenderCalibrationScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "largemouth_v3_gold_batch_1",
    LARGEMOUTH_V3_GOLD_BATCH_1,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
