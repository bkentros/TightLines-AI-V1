import {
  RECOMMENDER_AUDIT_SCORE_KEYS,
  SMALLMOUTH_V3_GOLD_BATCH_3,
} from "../recommenderCalibrationScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "smallmouth_v3_gold_batch_3",
    SMALLMOUTH_V3_GOLD_BATCH_3,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
