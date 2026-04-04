#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

import { LARGEMOUTH_V3_GOLD_BATCH_3 } from "../recommenderCalibrationScenarios.ts";
import { writeArchiveBundleForBatch } from "./batchTools.ts";

if (import.meta.main) {
  await writeArchiveBundleForBatch("largemouth_v3_gold_batch_3", LARGEMOUTH_V3_GOLD_BATCH_3);
}
