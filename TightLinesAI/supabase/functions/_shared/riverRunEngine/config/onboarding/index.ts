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

/** No owner-approved candidate remains in the unreleased registry. */
export const RIVER_RUN_DRAFT_RIVER_PROFILES: RiverProfile[] = [
  ...WASHINGTON_DRAFT_RIVERS,
];

export const RIVER_RUN_DRAFT_RUN_PROFILES: AuditedRiverRunProfile[] = [
  ...WASHINGTON_DRAFT_RUNS,
];

export const RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    ...WASHINGTON_DRAFT_CONFIGURATION_DOCUMENTS,
  ];

export * from "./grand.ts";
export * from "./platte.ts";
export * from "./white.ts";
export * from "./milwaukee.ts";
export * from "./sheboygan.ts";
export * from "./root.ts";
export * from "./boisBrule.ts";
export * from "./bigManisteeBrown.ts";
export * from "./washington.ts";
