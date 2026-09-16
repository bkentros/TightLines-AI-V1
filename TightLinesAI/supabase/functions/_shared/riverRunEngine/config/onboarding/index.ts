import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";

/** Every completed candidate is public; the owner-review registry is empty. */
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
export * from "./washington.ts";
export * from "./newYork.ts";
export * from "./midwest.ts";
export * from "./fall2026.ts";
