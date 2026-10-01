import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import {
  UMPQUA_DRAFT_CONFIGURATION_DOCUMENTS,
  UMPQUA_DRAFT_RIVERS,
  UMPQUA_DRAFT_RUNS,
} from "./umpqua.ts";
/** Hidden owner-review candidates; these never enter the public registry here. */
export const RIVER_RUN_DRAFT_RIVER_PROFILES: RiverProfile[] = [
  ...UMPQUA_DRAFT_RIVERS,
];

export const RIVER_RUN_DRAFT_RUN_PROFILES: AuditedRiverRunProfile[] = [
  ...UMPQUA_DRAFT_RUNS,
];

export const RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    ...UMPQUA_DRAFT_CONFIGURATION_DOCUMENTS,
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
export * from "./newYork.ts";
export * from "./midwest.ts";
export * from "./fall2026.ts";
export * from "./bearRogue.ts";
export * from "./umpqua.ts";
