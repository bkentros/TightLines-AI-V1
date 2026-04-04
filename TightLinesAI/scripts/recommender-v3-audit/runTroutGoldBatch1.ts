import {
  RECOMMENDER_AUDIT_SCORE_KEYS,
  TROUT_V3_GOLD_BATCH_1,
} from "../recommenderCalibrationScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "trout_v3_gold_batch_1",
    TROUT_V3_GOLD_BATCH_1,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
