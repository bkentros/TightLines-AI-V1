#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { PIKE_V3_MATRIX_AUDIT_SCENARIOS } from "./pikeMatrixAuditScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("pike_v3_matrix", PIKE_V3_MATRIX_AUDIT_SCENARIOS);
}
