#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { TROUT_V3_MATRIX_AUDIT_SCENARIOS } from "./troutMatrixAuditScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("trout_v3_matrix", TROUT_V3_MATRIX_AUDIT_SCENARIOS);
}
