import type {
  ReviewedSourcePath,
  SourceFetchValidationStatus,
  WaterbodyAvailability,
  WaterbodyIdentity,
  WaterbodySourceStatus,
} from "./contracts.ts";

function isFetchReachable(status: SourceFetchValidationStatus): boolean {
  return status === "reachable";
}

export interface AvailabilitySourceLink extends ReviewedSourcePath {
  fetchValidationStatus: SourceFetchValidationStatus;
  coverageStatus: "available" | "limited" | "blocked" | "unavailable";
}

function isApprovedAndReachable(link: AvailabilitySourceLink): boolean {
  return link.approvalStatus === "approved" &&
    link.reviewStatus === "allowed" &&
    link.canFetch === true &&
    isFetchReachable(link.fetchValidationStatus) &&
    link.coverageStatus !== "blocked" &&
    link.coverageStatus !== "unavailable";
}

function isUsableAerial(link: AvailabilitySourceLink): boolean {
  return link.sourceMode === "aerial" &&
    isApprovedAndReachable(link) &&
    link.usabilityStatus === "usable";
}

function isUsableDepth(link: AvailabilitySourceLink): boolean {
  return link.sourceMode === "depth" &&
    isApprovedAndReachable(link) &&
    link.lakeMatchStatus === "matched" &&
    link.usabilityStatus === "usable";
}

function sortModes(a: "aerial" | "depth", b: "aerial" | "depth"): number {
  if (a === b) return 0;
  return a === "depth" ? -1 : 1;
}

export function resolveWaterbodyAvailability(
  identity: Pick<WaterbodyIdentity, "lakeId" | "canonicalName" | "state" | "county">,
  links: AvailabilitySourceLink[],
): WaterbodyAvailability {
  const reachableLinks = links.filter(isApprovedAndReachable);
  const usableDepthLinks = links.filter(isUsableDepth);
  const usableAerialLinks = links.filter(isUsableAerial);
  const usableLinks = [...usableAerialLinks, ...usableDepthLinks];

  const aerialAvailable = usableAerialLinks.length > 0;
  const depthMachineReadableAvailable = usableDepthLinks.some((link) =>
    link.depthSourceKind === "machine_readable"
  );
  const depthChartImageAvailable = usableDepthLinks.some((link) =>
    link.depthSourceKind === "chart_image"
  );
  const depthAvailable = depthMachineReadableAvailable || depthChartImageAvailable;
  const bothAvailable = aerialAvailable && depthAvailable;

  const approvedAwaitingFetchValidation = links.some((link) =>
    link.approvalStatus === "approved" &&
    link.reviewStatus === "allowed" &&
    link.canFetch === true &&
    link.fetchValidationStatus === "unvalidated"
  );
  const approvedDepthAwaitingLakeMatchOrUsability = links.some((link) =>
    link.sourceMode === "depth" &&
    isApprovedAndReachable(link) &&
    (
      link.lakeMatchStatus !== "matched" ||
      link.usabilityStatus !== "usable"
    )
  );
  const blockedReviewedLinks = links.some((link) =>
    link.approvalStatus === "approved" &&
    (
      link.reviewStatus !== "allowed" ||
      link.canFetch === false ||
      link.fetchValidationStatus === "blocked" ||
      link.lakeMatchStatus === "mismatched" ||
      link.usabilityStatus === "not_usable"
    )
  );
  const unreachableApprovedLinks = links.some((link) =>
    link.approvalStatus === "approved" &&
    link.reviewStatus === "allowed" &&
    link.canFetch === true &&
    link.fetchValidationStatus === "unreachable"
  );

  let dataTier: WaterbodyAvailability["dataTier"] = "polygon_only";
  if (aerialAvailable && depthMachineReadableAvailable) {
    dataTier = "full_depth_aerial";
  } else if (depthMachineReadableAvailable) {
    dataTier = "depth_only";
  } else if (depthChartImageAvailable) {
    dataTier = "chart_aligned_depth";
  } else if (aerialAvailable) {
    dataTier = "aerial_only";
  }

  let sourceStatus: WaterbodySourceStatus = "limited";
  if (usableLinks.length > 0) {
    sourceStatus = "ready";
  } else if (approvedAwaitingFetchValidation || approvedDepthAwaitingLakeMatchOrUsability) {
    sourceStatus = "partial";
  } else if (blockedReviewedLinks || unreachableApprovedLinks) {
    sourceStatus = "blocked";
  }

  let availability: WaterbodyAvailability["availability"] = "limited";
  if (bothAvailable) {
    availability = "both_available";
  } else if (depthAvailable) {
    availability = "depth_available";
  } else if (aerialAvailable) {
    availability = "aerial_available";
  } else if (sourceStatus === "blocked") {
    availability = "blocked";
  }

  const availableSourceModes = [
    ...(aerialAvailable ? (["aerial"] as const) : []),
    ...(depthAvailable ? (["depth"] as const) : []),
  ].sort(sortModes);

  const bestAvailableMode = depthAvailable ? "depth" : aerialAvailable ? "aerial" : null;

  const confidenceReasons: string[] = [];
  let confidence: WaterbodyAvailability["confidence"] = "low";
  if (depthMachineReadableAvailable) {
    confidence = "high";
    confidenceReasons.push("Reviewed machine-readable depth path is reachable, lake-matched, and marked usable.");
    if (aerialAvailable) {
      confidenceReasons.push("Approved aerial path is also reachable and marked usable.");
    }
  } else if (depthChartImageAvailable) {
    confidence = "medium";
    confidenceReasons.push("Reviewed chart-image depth path is reachable, lake-matched, and marked usable.");
    if (!aerialAvailable) {
      confidenceReasons.push("No approved aerial path has been validated yet.");
    }
  } else if (aerialAvailable) {
    confidence = "medium";
    confidenceReasons.push("Approved aerial path is reachable and marked usable.");
    confidenceReasons.push("No approved lake-matched usable depth path has been validated.");
  } else if (approvedAwaitingFetchValidation) {
    confidence = "low";
    confidenceReasons.push("Approved sources exist but fetch reachability has not completed.");
  } else if (approvedDepthAwaitingLakeMatchOrUsability) {
    confidence = "low";
    confidenceReasons.push("Reviewed depth source is reachable, but lake match or depth usability is still unresolved.");
  } else if (sourceStatus === "blocked") {
    confidence = "low";
    confidenceReasons.push("Reviewed source paths are blocked, mismatched, not usable, or currently unreachable.");
  } else {
    confidence = "low";
    confidenceReasons.push("Only polygon identity is currently usable for this waterbody.");
  }

  return {
    lakeId: identity.lakeId,
    canonicalName: identity.canonicalName,
    state: identity.state,
    county: identity.county ?? null,
    dataTier,
    aerialAvailable,
    depthMachineReadableAvailable,
    depthChartImageAvailable,
    bothAvailable,
    availableSourceModes,
    bestAvailableMode,
    sourceStatus,
    availability,
    confidence,
    confidenceReasons,
  };
}
