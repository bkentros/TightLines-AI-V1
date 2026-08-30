import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";

/** No owner-approved candidate remains in the unreleased registry. */
export const RIVER_RUN_DRAFT_RIVER_PROFILES: RiverProfile[] = [];

export const RIVER_RUN_DRAFT_RUN_PROFILES: AuditedRiverRunProfile[] = [];

export const RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [];

export * from "./grand.ts";
export * from "./platte.ts";
export * from "./white.ts";
export * from "./milwaukee.ts";
export * from "./sheboygan.ts";
export * from "./root.ts";
export * from "./boisBrule.ts";
export * from "./bigManisteeBrown.ts";
