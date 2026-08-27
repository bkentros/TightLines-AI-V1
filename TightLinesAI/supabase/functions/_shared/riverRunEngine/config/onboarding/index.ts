import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import {
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  MILWAUKEE_RIVER_PROFILE,
} from "./milwaukee.ts";
import {
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  SHEBOYGAN_RIVER_PROFILE,
} from "./sheboygan.ts";
import { ROOT_CONFIGURATION_DOCUMENT, ROOT_RIVER_PROFILE } from "./root.ts";
import {
  BOIS_BRULE_CONFIGURATION_DOCUMENT,
  BOIS_BRULE_RIVER_PROFILE,
} from "./boisBrule.ts";

/** Unreleased candidates remain isolated from every public registry. */
export const RIVER_RUN_DRAFT_RIVER_PROFILES: RiverProfile[] = [
  MILWAUKEE_RIVER_PROFILE,
  SHEBOYGAN_RIVER_PROFILE,
  ROOT_RIVER_PROFILE,
  BOIS_BRULE_RIVER_PROFILE,
];

export const RIVER_RUN_DRAFT_RUN_PROFILES: AuditedRiverRunProfile[] = [
  ...MILWAUKEE_CONFIGURATION_DOCUMENT.runs,
  ...SHEBOYGAN_CONFIGURATION_DOCUMENT.runs,
  ...ROOT_CONFIGURATION_DOCUMENT.runs,
  ...BOIS_BRULE_CONFIGURATION_DOCUMENT.runs,
];

export const RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    MILWAUKEE_CONFIGURATION_DOCUMENT,
    SHEBOYGAN_CONFIGURATION_DOCUMENT,
    ROOT_CONFIGURATION_DOCUMENT,
    BOIS_BRULE_CONFIGURATION_DOCUMENT,
  ];

export * from "./grand.ts";
export * from "./platte.ts";
export * from "./white.ts";
export * from "./milwaukee.ts";
export * from "./sheboygan.ts";
export * from "./root.ts";
export * from "./boisBrule.ts";
