import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import {
  WASHINGTON_DRAFT_CONFIGURATION_DOCUMENTS,
  WASHINGTON_DRAFT_RIVERS,
  WASHINGTON_DRAFT_RUNS,
} from "./washington.ts";
import {
  MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
  MIDWEST_DRAFT_RIVERS,
  MIDWEST_DRAFT_RUNS,
} from "./midwest.ts";
import {
  FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS,
  FALL_2026_DRAFT_RIVERS,
  FALL_2026_DRAFT_RUNS,
} from "./fall2026.ts";
import {
  withSeasonalZonePlan,
  withSeasonalZonePlans,
} from "../seasonalZonePlans.ts";

/** No owner-approved candidate remains in the unreleased registry. */
export const RIVER_RUN_DRAFT_RIVER_PROFILES: RiverProfile[] = [
  ...WASHINGTON_DRAFT_RIVERS,
  ...MIDWEST_DRAFT_RIVERS,
  ...FALL_2026_DRAFT_RIVERS,
];

export const RIVER_RUN_DRAFT_RUN_PROFILES: AuditedRiverRunProfile[] = [
  ...WASHINGTON_DRAFT_RUNS,
  ...MIDWEST_DRAFT_RUNS,
  ...FALL_2026_DRAFT_RUNS,
].map(withSeasonalZonePlan);

export const RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    ...WASHINGTON_DRAFT_CONFIGURATION_DOCUMENTS,
    ...MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
    ...FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS,
  ].map((document) => ({
    ...document,
    runs: withSeasonalZonePlans(document.runs),
  }));

export * from "./grand.ts";
export * from "./platte.ts";
export * from "./white.ts";
export * from "./milwaukee.ts";
export * from "./sheboygan.ts";
export * from "./root.ts";
export * from "./boisBrule.ts";
export * from "./bigManisteeBrown.ts";
export * from "./washington.ts";
export * from "./newYork.ts";
export * from "./midwest.ts";
export * from "./fall2026.ts";
