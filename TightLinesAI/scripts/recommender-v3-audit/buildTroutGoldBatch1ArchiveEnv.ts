#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { TROUT_V3_GOLD_BATCH_1 } from "../recommenderCalibrationScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("trout_v3_gold_batch_1", TROUT_V3_GOLD_BATCH_1);
}
