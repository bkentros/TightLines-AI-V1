#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { SMALLMOUTH_V3_MATRIX_AUDIT_SCENARIOS } from "./smallmouthMatrixAuditScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("smallmouth_v3_matrix", SMALLMOUTH_V3_MATRIX_AUDIT_SCENARIOS);
}
