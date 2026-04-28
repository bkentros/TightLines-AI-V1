/**
 * **Prototype stub only.** Builds a deterministic, contract-valid {@link WaterReaderAerialOnlyReadResult}
 * so the UI can exercise overlays without any Water Reader engine, scoring, inference, fetching,
 * depth/bathymetry/contours, recommendations, caching, persistence, export, model calls,
 * or server-side imagery.
 */

import type { AerialTilePlan, WaterbodySearchResult } from './waterReaderContracts';
import { USGS_TNM_ATTRIBUTION } from './usgsTnmAerialSnapshot';
import {
  WR_AERIAL_ONLY_RESULT_CONTRACT_ID,
  WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
  WR_REGISTRY_USGS_TNM_NAIP_PLUS,
  type WaterReaderAerialOnlyReadResult,
  type WaterReaderAerialReadZones3To5,
  type WaterReaderAerialZoneEvidence,
  type WaterReaderNormalizedPlanarOverlayRect01,
} from './waterReaderResultContracts';

const STUB_ZONE_EVIDENCE: WaterReaderAerialZoneEvidence = {
  geometryBackedCue: false,
  visibleImageryHypothesisUsed: false,
  depthEvidenceUsed: false,
  bathymetryEvidenceUsed: false,
};

/** Fixed placeholder rectangles (0–1) — arbitrary layout scaffolding, not inferred from imagery or geometry. */
const STUB_RECT_A: WaterReaderNormalizedPlanarOverlayRect01 = {
  coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
  x: 0.18,
  y: 0.12,
  w: 0.26,
  h: 0.2,
};
const STUB_RECT_B: WaterReaderNormalizedPlanarOverlayRect01 = {
  coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
  x: 0.52,
  y: 0.38,
  w: 0.24,
  h: 0.22,
};
const STUB_RECT_C: WaterReaderNormalizedPlanarOverlayRect01 = {
  coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
  x: 0.12,
  y: 0.58,
  w: 0.3,
  h: 0.18,
};
const STUB_RECT_D: WaterReaderNormalizedPlanarOverlayRect01 = {
  coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
  x: 0.58,
  y: 0.22,
  w: 0.22,
  h: 0.28,
};
const STUB_RECT_E: WaterReaderNormalizedPlanarOverlayRect01 = {
  coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
  x: 0.48,
  y: 0.72,
  w: 0.28,
  h: 0.16,
};

const LIMITATIONS_READONLY: readonly string[] = [
  'Prototype result only — no automated read or inference was executed.',
  'No depth charts, bathymetry, or contour-derived structure were used.',
  'No automated fish-zone scoring or imagery-derived structure detection was performed.',
  'Imagery hypotheses are not asserted: orthophoto-derived flags remain unpopulated in this stub.',
  'No caching, persistence, or export of this payload is performed by this stub.',
];

/** Optional server tile plan hint is ignored; reserved so future stubs may align rects to planners without implying analysis. */
export function buildWaterReaderAerialOnlyStubResult(
  selected: WaterbodySearchResult,
  _tilePlanHint?: AerialTilePlan | null,
): WaterReaderAerialOnlyReadResult {
  const zones: WaterReaderAerialReadZones3To5 = [
    {
      id: 'stub-zone-a-prototype',
      label: 'Mock zone A',
      overlayRect: STUB_RECT_A,
      reasonCode: 'waterbody_geometry_context',
      humanExplanation:
        'Placeholder label for layout typography — reason code does not assert fish, structure, or depth.',
      confidence: 'low',
      evidence: STUB_ZONE_EVIDENCE,
    },
    {
      id: 'stub-zone-b-prototype',
      label: 'Mock zone B',
      overlayRect: STUB_RECT_B,
      reasonCode: 'shoreline_area_geometry_context',
      humanExplanation:
        'Placeholder legend line for future whole-map captions — boundaries here are illustrative only.',
      confidence: 'low',
      evidence: STUB_ZONE_EVIDENCE,
    },
    {
      id: 'stub-zone-c-prototype',
      label: 'Mock zone C',
      overlayRect: STUB_RECT_C,
      reasonCode: 'map_region_callout',
      humanExplanation:
        'Example bounded region framing for layout — not mapped to inferred structure or fish locations.',
      confidence: 'low',
      evidence: STUB_ZONE_EVIDENCE,
    },
    {
      id: 'stub-zone-d-prototype',
      label: 'Mock zone D',
      overlayRect: STUB_RECT_D,
      reasonCode: 'visible_boundary_context_uncertain',
      humanExplanation:
        'Uncertainty label retained for typography review — does not report detected edges from pixels.',
      confidence: 'low',
      evidence: STUB_ZONE_EVIDENCE,
    },
    {
      id: 'stub-zone-e-prototype',
      label: 'Mock zone E',
      overlayRect: STUB_RECT_E,
      reasonCode: 'operator_review_placeholder',
      humanExplanation:
        'Reserve slot format for QA — not a prioritized fishing area.',
      confidence: 'low',
      evidence: STUB_ZONE_EVIDENCE,
    },
  ];

  const result: WaterReaderAerialOnlyReadResult = {
    generatedAt: new Date().toISOString(),
    contractId: WR_AERIAL_ONLY_RESULT_CONTRACT_ID,
    waterbody: {
      lakeId: selected.lakeId,
      name: selected.name,
      state: selected.state,
      county: selected.county ?? null,
      waterbodyType: selected.waterbodyType,
    },
    sourceMode: 'aerial_only',
    imagerySource: {
      sourceRegistryId: WR_REGISTRY_USGS_TNM_NAIP_PLUS,
      aerialPolicyKey: WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
    },
    attribution: USGS_TNM_ATTRIBUTION,
    overallConfidence: 'low',
    limitations: LIMITATIONS_READONLY,
    zones,
    enginePlaceholder: 'pending_engine_impl',
  };
  return result;
}
