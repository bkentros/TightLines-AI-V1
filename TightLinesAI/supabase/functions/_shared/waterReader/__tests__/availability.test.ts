import { assertEquals } from "jsr:@std/assert";
import { resolveWaterbodyAvailability, type AvailabilitySourceLink } from "../availability.ts";

const identity = {
  lakeId: "lake-1",
  canonicalName: "Lake Mary",
  state: "MN",
  county: "Douglas",
} as const;

function buildLink(overrides: Partial<AvailabilitySourceLink>): AvailabilitySourceLink {
  return {
    linkId: "link-1",
    lakeId: "lake-1",
    sourceId: "source-1",
    providerName: "Fixture Provider",
    sourceMode: "aerial",
    depthSourceKind: "none",
    sourcePath: "https://example.com/source",
    sourcePathType: "service_root",
    approvalStatus: "approved",
    reviewStatus: "allowed",
    canFetch: true,
    lakeMatchStatus: "matched",
    usabilityStatus: "usable",
    fetchValidationStatus: "reachable",
    coverageStatus: "available",
    ...overrides,
  };
}

Deno.test("resolveWaterbodyAvailability returns both available for reachable aerial and machine depth", () => {
  const result = resolveWaterbodyAvailability(identity, [
    buildLink({ sourceMode: "aerial", depthSourceKind: "none" }),
    buildLink({
      linkId: "link-2",
      sourceMode: "depth",
      depthSourceKind: "machine_readable",
    }),
  ]);

  assertEquals(result.availability, "both_available");
  assertEquals(result.dataTier, "full_depth_aerial");
  assertEquals(result.bestAvailableMode, "depth");
  assertEquals(result.confidence, "high");
});

Deno.test("resolveWaterbodyAvailability stays honest for aerial-only coverage", () => {
  const result = resolveWaterbodyAvailability(identity, [
    buildLink({ sourceMode: "aerial", depthSourceKind: "none" }),
    buildLink({
      linkId: "link-3",
      sourceMode: "depth",
      depthSourceKind: "machine_readable",
      fetchValidationStatus: "unreachable",
    }),
  ]);

  assertEquals(result.availability, "aerial_available");
  assertEquals(result.dataTier, "aerial_only");
  assertEquals(result.bestAvailableMode, "aerial");
  assertEquals(result.confidence, "medium");
});

Deno.test("resolveWaterbodyAvailability marks pending approved sources as partial", () => {
  const result = resolveWaterbodyAvailability(identity, [
    buildLink({
      sourceMode: "depth",
      depthSourceKind: "chart_image",
      fetchValidationStatus: "unvalidated",
    }),
  ]);

  assertEquals(result.availability, "limited");
  assertEquals(result.sourceStatus, "partial");
  assertEquals(result.dataTier, "polygon_only");
});

Deno.test("resolveWaterbodyAvailability keeps reachable chart-depth candidates out of depth availability until lake-matched and usable", () => {
  const result = resolveWaterbodyAvailability(identity, [
    buildLink({
      sourceMode: "depth",
      depthSourceKind: "chart_image",
      fetchValidationStatus: "reachable",
      lakeMatchStatus: "unknown",
      usabilityStatus: "needs_review",
    }),
  ]);

  assertEquals(result.availability, "limited");
  assertEquals(result.sourceStatus, "partial");
  assertEquals(result.depthChartImageAvailable, false);
  assertEquals(result.dataTier, "polygon_only");
});

Deno.test("resolveWaterbodyAvailability blocks unapproved, mismatched, or restricted paths from depth availability", () => {
  const result = resolveWaterbodyAvailability(identity, [
    buildLink({
      sourceMode: "depth",
      depthSourceKind: "machine_readable",
      reviewStatus: "restricted",
      fetchValidationStatus: "reachable",
    }),
  ]);

  assertEquals(result.availability, "blocked");
  assertEquals(result.sourceStatus, "blocked");
  assertEquals(result.depthMachineReadableAvailable, false);
});
