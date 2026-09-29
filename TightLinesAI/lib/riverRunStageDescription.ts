import type { RiverRunFishInRiver, RiverRunStage } from "./riverRunContracts";

const EARLY_BUILDING_MAX_CURVE_FRACTION = 0.3;

function hasLowRelativePresence(
  fishInRiver: RiverRunFishInRiver,
): boolean {
  if (typeof fishInRiver.curveFraction === "number") {
    return fishInRiver.curveFraction <= EARLY_BUILDING_MAX_CURVE_FRACTION;
  }

  return typeof fishInRiver.score === "number" &&
      typeof fishInRiver.riverCeiling === "number" &&
      fishInRiver.riverCeiling > 0
    ? fishInRiver.score / fishInRiver.riverCeiling <=
      EARLY_BUILDING_MAX_CURVE_FRACTION
    : false;
}

/**
 * Public Migration Stage description shared by every state and river.
 *
 * The canonical stage label remains unchanged. Fish In River is consulted only
 * to clarify why the early portion of Building can coexist with low seasonal
 * presence; this function does not alter either primitive or its score.
 */
export function migrationStageDescription(
  stage: RiverRunStage,
  fishInRiver: RiverRunFishInRiver,
  winterHolding = false,
): string {
  if (winterHolding) {
    return stage.label === "Winter transition"
      ? "Fall-entry fish are settling into winter holding water; this is not a new migratory push."
      : stage.label === "Core winter hold"
      ? "The retained population is in its core winter holding period."
      : stage.label === "Spring approach"
      ? "Winter holding continues through February 28 without inferring spring movement."
      : stage.label === "Not active yet"
      ? "The winter pathway remains off until the fall-entry pathway ends."
      : "The winter holding pathway is complete and does not extend into the spring model.";
  }

  switch (stage.stage) {
    case "pre_run":
      return "The river is ahead of its dependable migration window; occasional early arrivals can occur before the run is established.";
    case "beginning":
      return "The dependable migration window is opening, but the run is not yet broadly established.";
    case "building":
      return hasLowRelativePresence(fishInRiver)
        ? "The run is in the early part of its Building stage. Expected seasonal presence is still low relative to this run's own peak and should continue rising as more fish enter and move through the river."
        : "The run is progressing toward its strongest seasonal window.";
    case "peak":
      return "This is historically the strongest portion of the migration window.";
    case "tapering":
      return "The strongest window has passed, but the seasonal migration period continues.";
    case "ending":
      return "The dependable migration window is approaching its end.";
    case "post_run":
      return "The tracked seasonal migration window has ended.";
    default:
      return stage.label === "Before migration"
        ? "The dependable seasonal river migration has not started yet."
        : "This seasonal migration model is complete.";
  }
}
