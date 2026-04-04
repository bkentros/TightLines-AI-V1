#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { LARGEMOUTH_V3_MATRIX_AUDIT_SCENARIOS } from "./largemouthMatrixAuditScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("largemouth_v3_matrix", LARGEMOUTH_V3_MATRIX_AUDIT_SCENARIOS);
}
