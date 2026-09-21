import type { PierCastStructureRead } from "./pierCastContracts";

/**
 * Structures shown in the report's "Piers covered" section.
 *
 * Candidate structures are covered. A non-excluded structure with a reported
 * closure remains visible so the access note has a named structure to explain.
 * If research has not admitted any candidate yet, retain the non-excluded
 * structures for owner review instead of rendering an empty section.
 */
export function selectPierCastCoveredStructures<
  Structure extends Pick<
    PierCastStructureRead,
    "disposition" | "accessStatus"
  >,
>(structures: readonly Structure[]): Structure[] {
  const covered = structures.filter((structure) =>
    structure.disposition === "candidate" ||
    (structure.disposition !== "excluded" &&
      structure.accessStatus === "reported_closed")
  );

  return covered.length > 0
    ? covered
    : structures.filter((structure) => structure.disposition !== "excluded");
}
