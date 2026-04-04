import { RECOMMENDER_AUDIT_SCORE_KEYS } from "../recommenderCalibrationScenarios.ts";
import { SMALLMOUTH_V3_MATRIX_AUDIT_SCENARIOS } from "./smallmouthMatrixAuditScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "smallmouth_v3_matrix",
    SMALLMOUTH_V3_MATRIX_AUDIT_SCENARIOS,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
