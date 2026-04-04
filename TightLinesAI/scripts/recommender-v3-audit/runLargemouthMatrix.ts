import { RECOMMENDER_AUDIT_SCORE_KEYS } from "../recommenderCalibrationScenarios.ts";
import { LARGEMOUTH_V3_MATRIX_AUDIT_SCENARIOS } from "./largemouthMatrixAuditScenarios.ts";
import { writeReviewSheetForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeReviewSheetForBatch(
    "largemouth_v3_matrix",
    LARGEMOUTH_V3_MATRIX_AUDIT_SCENARIOS,
    RECOMMENDER_AUDIT_SCORE_KEYS,
  );
}
