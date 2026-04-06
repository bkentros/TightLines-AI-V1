import { RECOMMENDER_AUDIT_SCORE_KEYS } from "../recommenderCalibrationScenarios.ts";
import { PIKE_V3_MATRIX_AUDIT_SCENARIOS } from "./pikeMatrixAuditScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "pike_v3_matrix",
    PIKE_V3_MATRIX_AUDIT_SCENARIOS,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
