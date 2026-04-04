#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { SMALLMOUTH_V3_GOLD_BATCH_3 } from "../recommenderCalibrationScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("smallmouth_v3_gold_batch_3", SMALLMOUTH_V3_GOLD_BATCH_3);
}
