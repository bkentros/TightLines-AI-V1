import { RECOMMENDER_AUDIT_SCORE_KEYS } from "../recommenderCalibrationScenarios.ts";
import { TROUT_V3_MATRIX_AUDIT_SCENARIOS } from "./troutMatrixAuditScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "trout_v3_matrix",
    TROUT_V3_MATRIX_AUDIT_SCENARIOS,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
