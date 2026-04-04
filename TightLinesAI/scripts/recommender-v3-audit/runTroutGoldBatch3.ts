import {
  RECOMMENDER_AUDIT_SCORE_KEYS,
  TROUT_V3_GOLD_BATCH_3,
} from "../recommenderCalibrationScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "trout_v3_gold_batch_3",
    TROUT_V3_GOLD_BATCH_3,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
