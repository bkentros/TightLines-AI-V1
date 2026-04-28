/**
 * Deterministic, client-only signals for USGS TNM NAIP Plus imagery *retrieval proof* tiles.
 * Not a "read", fish scoring, structure detection, or depth — see WATER_READER_MASTER_PLAN.md §0.4.
 *
 * Limitation: no pixel/bitmap analysis without extra native APIs; stripe, clarity, shoreline, and
 * true blank detection are not reliably available from decode metadata alone.
 */

export type ImageryProofTerminalPhase = "loaded" | "error" | "timeout";

export type BlankNoDataSuspicion =
  | "not_applicable"
  /** Loaded OK but native `onLoad` did not supply width/height — not elevated blank suspicion. */
  | "intrinsic_dimensions_unavailable_decode_only"
  /** Reported numeric w×h incl. 0 or tiny values — weak / degenerate decode signal (not true blank detection). */
  | "degenerate_decode_dimensions"
  /** Decoded size looks normal; true blank/uniform tiles still need pixel sampling. */
  | "not_assessable_without_pixel_sampling";

export type NotAssessed = "not_evaluated_client_side";

export type FutureAerialOnlyUsability =
  | "no_load_did_not_complete"
  /** Reported decode dimensions look degenerate — weak signal. */
  | "unknown_decode_only"
  /** Decode finished but intrinsic size was not reported by the native load event. */
  | "decode_completed_intrinsic_unreported"
  | "decode_ok_content_unverified";

/** Always capped — never "high"; proof UI must not imply a real aerial read. */
export type AerialOnlyProofConfidenceCeiling = "low" | "moderate";

export interface ImageryProofQualityReport {
  /** Stable machine-readable outcome for this proof tile. */
  loadOutcome: ImageryProofTerminalPhase;
  loadDurationMs: number | null;
  intrinsicWidth: number | null;
  intrinsicHeight: number | null;
  expectedExportPx: number;
  dimensionMismatchVsRequest: boolean;
  blankNoDataSuspicion: BlankNoDataSuspicion;
  stripeSeamSuspicion: NotAssessed;
  clarityVisibility: NotAssessed;
  shorelineReadSupport: NotAssessed;
  futureAerialOnlyReadUsability: FutureAerialOnlyUsability;
  aerialOnlyConfidenceCeiling: AerialOnlyProofConfidenceCeiling;
  /** Reserved for extra deterministic notes; primary copy lives in summarizeProofQualityForUi. */
  clientLimitationNotes: string[];
}

const CLIENT_LIMITATION_PIXELS = "Stripes, clarity, shoreline, and true blank/no-data checks need pixel access (not used in this proof).";

export function assessImageryProofTile(params: {
  phase: ImageryProofTerminalPhase;
  loadStartedAtMs: number;
  finishedAtMs: number;
  expectedExportPx: number;
  intrinsic: { width: number; height: number } | null;
}): ImageryProofQualityReport {
  const { phase, loadStartedAtMs, finishedAtMs, expectedExportPx, intrinsic } = params;
  const durationRaw = finishedAtMs - loadStartedAtMs;
  const loadDurationMs = Number.isFinite(durationRaw) && durationRaw >= 0 ? Math.round(durationRaw) : null;

  const intrinsicReported =
    intrinsic != null &&
    Number.isFinite(intrinsic.width) &&
    Number.isFinite(intrinsic.height);
  const iw = intrinsicReported ? intrinsic.width : null;
  const ih = intrinsicReported ? intrinsic.height : null;

  if (phase === "error" || phase === "timeout") {
    return {
      loadOutcome: phase,
      loadDurationMs,
      intrinsicWidth: iw,
      intrinsicHeight: ih,
      expectedExportPx,
      dimensionMismatchVsRequest: false,
      blankNoDataSuspicion: "not_applicable",
      stripeSeamSuspicion: "not_evaluated_client_side",
      clarityVisibility: "not_evaluated_client_side",
      shorelineReadSupport: "not_evaluated_client_side",
      futureAerialOnlyReadUsability: "no_load_did_not_complete",
      aerialOnlyConfidenceCeiling: "low",
      clientLimitationNotes: [],
    };
  }

  let degenerate = false;
  let mismatch = false;
  if (intrinsicReported && intrinsic != null) {
    const w = intrinsic.width;
    const h = intrinsic.height;
    degenerate = w <= 0 || h <= 0 || w < 64 || h < 64;
    mismatch = w !== expectedExportPx || h !== expectedExportPx;
  }

  let blankNoDataSuspicion: BlankNoDataSuspicion;
  let futureAerialOnlyReadUsability: FutureAerialOnlyUsability;
  let aerialOnlyConfidenceCeiling: AerialOnlyProofConfidenceCeiling;

  if (!intrinsicReported) {
    blankNoDataSuspicion = "intrinsic_dimensions_unavailable_decode_only";
    futureAerialOnlyReadUsability = "decode_completed_intrinsic_unreported";
    aerialOnlyConfidenceCeiling = "moderate";
  } else if (degenerate) {
    blankNoDataSuspicion = "degenerate_decode_dimensions";
    futureAerialOnlyReadUsability = "unknown_decode_only";
    aerialOnlyConfidenceCeiling = "low";
  } else {
    blankNoDataSuspicion = "not_assessable_without_pixel_sampling";
    futureAerialOnlyReadUsability = "decode_ok_content_unverified";
    aerialOnlyConfidenceCeiling = "moderate";
  }

  return {
    loadOutcome: "loaded",
    loadDurationMs,
    intrinsicWidth: iw,
    intrinsicHeight: ih,
    expectedExportPx,
    dimensionMismatchVsRequest: mismatch,
    blankNoDataSuspicion,
    stripeSeamSuspicion: "not_evaluated_client_side",
    clarityVisibility: "not_evaluated_client_side",
    shorelineReadSupport: "not_evaluated_client_side",
    futureAerialOnlyReadUsability,
    aerialOnlyConfidenceCeiling,
    clientLimitationNotes: [],
  };
}

export function summarizeProofQualityForUi(r: ImageryProofQualityReport): string[] {
  const lines: string[] = [];
  const dur = r.loadDurationMs != null ? `${r.loadDurationMs} ms` : "—";
  lines.push(`Load: ${r.loadOutcome} · Duration: ${dur}`);

  if (r.loadOutcome === "loaded" && r.intrinsicWidth != null && r.intrinsicHeight != null) {
    if (r.dimensionMismatchVsRequest) {
      lines.push(
        `Decoded size: ${r.intrinsicWidth}×${r.intrinsicHeight}px — differs from requested ${r.expectedExportPx}×${r.expectedExportPx}px (provider/transform).`,
      );
    } else {
      lines.push(
        `Decoded size: ${r.intrinsicWidth}×${r.intrinsicHeight}px (request ${r.expectedExportPx}×${r.expectedExportPx}px)`,
      );
    }
  } else if (r.loadOutcome === "loaded") {
    lines.push(
      "Intrinsic size: unavailable from the native image load event (not a failure signal).",
    );
  }

  if (r.blankNoDataSuspicion === "intrinsic_dimensions_unavailable_decode_only") {
    lines.push(
      "Blank/no-data: not assessable decode-only — native event did not report size; not elevated suspicion.",
    );
  } else if (r.blankNoDataSuspicion === "degenerate_decode_dimensions") {
    lines.push("Blank/no-data suspicion: elevated — reported decode dimensions look degenerate.");
  } else if (r.blankNoDataSuspicion === "not_assessable_without_pixel_sampling") {
    lines.push("Blank/no-data suspicion: not assessable here (decode-only).");
  }

  lines.push("Stripe/seam suspicion: not evaluated on-device.");
  lines.push("Clarity / shoreline support: not evaluated on-device.");

  if (r.futureAerialOnlyReadUsability === "no_load_did_not_complete") {
    lines.push("Future aerial-only read support: no — tile did not finish loading.");
  } else if (r.futureAerialOnlyReadUsability === "unknown_decode_only") {
    lines.push("Future aerial-only read support: unknown — weak decode signal only.");
  } else if (r.futureAerialOnlyReadUsability === "decode_completed_intrinsic_unreported") {
    lines.push(
      "Future aerial-only read support: unknown — decode finished but size metadata was not reported.",
    );
  } else {
    lines.push("Future aerial-only read support: decode OK — content not verified (not a read).");
  }

  lines.push(
    `Aerial-only proof ceiling: ${r.aerialOnlyConfidenceCeiling} — imagery quality / proof only.`,
  );
  lines.push(CLIENT_LIMITATION_PIXELS);

  return lines;
}
