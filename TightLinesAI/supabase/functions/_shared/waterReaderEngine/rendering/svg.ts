import type { PointM, PolygonM, RingM, WaterReaderFeatureClass } from '../contracts.ts';
import type { WaterReaderDisplayEntry, WaterReaderDisplayModel, WaterReaderDisplayZoneGeometry } from '../display-model.ts';
import { pointInWaterOrBoundary } from '../features/validation.ts';
import { waterReaderLegendForbiddenPhraseHits } from '../legend.ts';
import type { WaterReaderZonePlacementKind } from '../zones/types.ts';
import { buildWaterReaderSvgTransform, format, svgPathForPolygon, svgPathForRing, svgPoint } from './transform.ts';
import type {
  WaterReaderLabelAnchor,
  WaterReaderProductionSvgOptions,
  WaterReaderProductionSvgResult,
  WaterReaderRenderSummary,
  WaterReaderRenderWarning,
  WaterReaderSvgTransform,
} from './types.ts';

// FinFindr paper renderer constants. The engine SVG is consumed directly by
// the React Native client (`SvgXml` from `react-native-svg`) inside the
// `WaterReaderMapCard` paper card, so the renderer paints in the
// paper / ink palette here instead of the older near-white style. The
// in-SVG "Map Key" panel + bottom credit text are intentionally not emitted
// — the React layer renders both via `WaterReaderLegend` and the page
// footer respectively, in the canonical Fraunces / DM Sans hierarchy.
//
// Why Fraunces in font-family: every other text surface in the app
// (Home / How's Fishing / Recommender) sets display copy in Fraunces,
// so callout digits and any future in-SVG text labels feel hand-set
// alongside the rest of the UI when the device has the font loaded
// (see `app/_layout.tsx`). The system stack is kept as a fallback so
// server-side / preview rendering on machines without Fraunces still
// produces sensible SVG.
const FONT = "Fraunces, -apple-system, BlinkMacSystemFont, 'Segoe UI', serif";
const WATER_FILL = '#DCE7DD';        // muted sage-mint that reads as water on warm paper.
const WATER_STROKE = '#1C2419';      // paper.ink — confident shore line.
const BACKDROP = '#F0E8D4';          // paper.paperLight — backdrop matches the host card.
const TEXT = '#1C2419';              // paper.ink for primary text inside the SVG.
const MUTED = 'rgba(28,36,25,0.55)'; // paper.inkSoft — muted copy still reads on paper.
const CONFLUENCE = '#7A3A52';        // muted magenta-walnut, paired with WATER_READER_FEATURE_COLORS.structure_confluence.
const DEFAULT_LEGEND_COLOR = '#1C2419';
const ZONE_FILL_OPACITY = '0.42';
const ZONE_STROKE_OPACITY = '0.16';
const ZONE_STROKE_WIDTH = '0.6';
const CONFLUENCE_FILL_OPACITY = '0.4';
const CONFLUENCE_STROKE_OPACITY = '0.14';
const POINT_BUFFER_STROKE_OPACITY = '0.42';
const CONFLUENCE_POINT_BUFFER_STROKE_OPACITY = '0.38';
const COVE_SHORE_PATH_RENDER_SAMPLE_LIMIT = 96;
const CENTER_LABEL_RADIUS = 7.5;
const CALLOUT_LABEL_RADIUS = 7.5;
const CENTER_LABEL_DIAMETER = CENTER_LABEL_RADIUS * 2;
const CALLOUT_LABEL_DIAMETER = CALLOUT_LABEL_RADIUS * 2;
const CALLOUT_MARGIN = 16;
const PREFERRED_LABEL_LEADER_LENGTH_PX = 90;

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type LabelPlan = {
  entryId: string;
  displayNumber: string | number;
  kind: 'standalone' | 'confluence';
  anchor: PointM;
  label: PointM;
  callout: boolean;
  leaderLengthPx: number;
  longLeader: boolean;
  bounds: Bounds;
};

export function buildWaterReaderProductionSvg(
  displayModel: WaterReaderDisplayModel,
  options: WaterReaderProductionSvgOptions = {},
): WaterReaderProductionSvgResult {
  const warnings: WaterReaderRenderWarning[] = [];
  if (!options.lakePolygon || options.lakePolygon.exterior.length < 3) {
    warnings.push({ code: 'missing_lake_polygon', message: 'Production SVG rendered without a valid lake polygon.' });
  }
  if (displayModel.displayedEntries.length !== displayModel.displayLegendEntries.length) {
    warnings.push({
      code: 'display_legend_count_mismatch',
      message: 'Displayed entry count does not match display legend entry count.',
    });
  }

  const padding = options.padding ?? 28;
  const mapWidth = options.mapWidth ?? 960;
  // The in-SVG "Map Key" panel was retired when the FinFindr paper UI took
  // over legend rendering on the React side. We pass legendHeight=0 so the
  // transform doesn't reserve any vertical space for it, and we surgically
  // crop the canvas down to the map body further below.
  const legendHeight = 0;
  const baseTransform = buildWaterReaderSvgTransform({
    displayModel,
    lakePolygon: options.lakePolygon,
    padding,
    mapWidth,
    legendHeight,
    maxMapHeight: options.maxMapHeight,
  });
  // Crop the bottom slack that used to host the legend block + credit
  // line. Geometry coordinates are unaffected — we only shrink the canvas
  // height/viewBox the consumer renders.
  const croppedHeight = Math.ceil(baseTransform.mapBottomY + Math.max(8, padding * 0.3));
  const transform: WaterReaderSvgTransform = {
    ...baseTransform,
    height: croppedHeight,
    viewBox: `0 0 ${baseTransform.width} ${croppedHeight}`,
  };
  // The legend-overflow warning no longer applies; the paper-language
  // legend is rendered in React, so any expansion is paged by the
  // app shell, not the SVG canvas.

  const clipId = `wr-lake-clip-${stableHash(transform.viewBox)}`;
  const lakePath = options.lakePolygon ? svgPathForPolygon(options.lakePolygon, transform) : '';
  if (!lakePath) warnings.push({ code: 'invalid_geometry', message: 'Lake polygon path is empty.' });

  const labelPlans = buildLabelPlans(displayModel.displayedEntries, transform, warnings, options.lakePolygon ?? null);
  const labelLeaderLengths = labelPlans.map((plan) => plan.leaderLengthPx).filter(Number.isFinite);
  const labelPlanByEntryId = new Map(labelPlans.map((plan) => [plan.entryId, plan]));
  const renderedEntries = displayModel.displayedEntries.map((entry) =>
    renderEntry(entry, transform, clipId, warnings, labelPlanByEntryId.get(entry.entryId), options.lakePolygon ?? null),
  );
  // The structured legend list survives on the response (consumed by the
  // React `WaterReaderLegend` component); only the in-SVG "Map Key" panel
  // and the bottom FinFindr/season credit text are intentionally dropped.
  const legendEntries = productionLegendEntries(displayModel);
  const title = escapeXml(options.title ?? 'Water Reader');
  const warningComment = warnings.length > 0
    ? `\n  <!-- renderer warnings: ${escapeXml(JSON.stringify(warnings.map((warning) => warning.code)))} -->`
    : '';
  const forbiddenHits = waterReaderLegendForbiddenPhraseHits(displayModel.displayLegendEntries.map((entry) =>
    [entry.title, entry.body, entry.transitionWarning ?? ''].join(' '),
  ).join(' '));
  if (forbiddenHits.length > 0) {
    warnings.push({ code: 'invalid_geometry', message: `Legend copy contains forbidden phrases: ${forbiddenHits.join(', ')}` });
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${transform.viewBox}" role="img" aria-label="${title}">
  <defs>
    <clipPath id="${clipId}">
      <path d="${lakePath}" fill-rule="evenodd"/>
    </clipPath>
    <filter id="wr-label-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="${TEXT}" flood-opacity="0.22"/>
    </filter>
  </defs>${warningComment}
  <rect width="100%" height="100%" fill="${BACKDROP}"/>
  <g class="water-reader-map">
    <path class="water-reader-lake" d="${lakePath}" fill="${WATER_FILL}" fill-rule="evenodd" stroke="${WATER_STROKE}" stroke-width="1.6"/>
    <g class="water-reader-zones" clip-path="url(#${clipId})">
      ${renderedEntries.map((entry) => entry.zoneMarkup).join('\n      ')}
    </g>
    <g class="water-reader-labels">
      ${renderedEntries.map((entry) => entry.labelMarkup).join('\n      ')}
    </g>
  </g>
</svg>
`;

  const summary: WaterReaderRenderSummary = {
    displayedEntryCount: displayModel.displayedEntries.length,
    renderedNumberCount: displayModel.displayedEntries.length,
    calloutLabelCount: labelPlans.filter((plan) => plan.callout).length,
    renderedStandaloneCount: displayModel.displayedEntries.filter((entry) => entry.entryType === 'standalone_zone').length,
    renderedConfluenceCount: displayModel.displayedEntries.filter((entry) => entry.entryType === 'structure_confluence').length,
    renderedUnifiedConfluenceCount: displayModel.displayedEntries.filter((entry) => entry.entryType === 'structure_confluence').length,
    stackedConfluenceMemberRenderCount: 0,
    displayLegendEntryCount: displayModel.displayLegendEntries.length,
    retainedRenderedCount: 0,
    warningCount: warnings.length,
    maxLabelLeaderLengthPx: labelLeaderLengths.length > 0 ? roundNumber(Math.max(...labelLeaderLengths), 2) : 0,
    longLabelLeaderCount: labelPlans.filter((plan) => plan.longLeader).length,
    mapBottomY: transform.mapBottomY,
    firstLegendRowY: transform.legendTop,
    mapLegendGap: transform.mapLegendGap,
    width: transform.width,
    height: transform.height,
    viewBox: transform.viewBox,
  };

  return { svg, warnings, summary, legendEntries };
}

function renderEntry(
  entry: WaterReaderDisplayEntry,
  transform: WaterReaderSvgTransform,
  clipId: string,
  warnings: WaterReaderRenderWarning[],
  labelPlan?: LabelPlan,
  lakePolygon?: PolygonM | null,
): { zoneMarkup: string; labelMarkup: string } {
  const number = entry.displayNumber ?? '';
  const plan = labelPlan ?? fallbackLabelPlan(entry, transform, warnings);
  if (entry.entryType === 'structure_confluence' || entry.entryType === 'neck_area') {
    const memberShapes = entry.entryType === 'structure_confluence'
      ? groupedEntryMemberShapes(entry, transform, lakePolygon ?? null)
      : '';
    const envelope = memberShapes || groupedEntryEnvelope(entry, transform);
    if (!envelope) warnings.push({ code: 'missing_zone_path', message: 'Grouped entry path is empty.', entryId: entry.entryId });
    const className = entry.entryType === 'structure_confluence' ? 'water-reader-confluence' : 'water-reader-neck-area';
    const renderMode = memberShapes ? 'member-shapes' : 'unified-envelope';
    return {
      zoneMarkup: `<g class="water-reader-entry ${className}" data-entry-id="${escapeXml(entry.entryId)}" data-display-number="${number}" data-render-mode="${renderMode}" data-member-zone-count="${entry.zoneIds.length}" clip-path="url(#${clipId})">${envelope}</g>`,
      labelMarkup: numberLabel(plan),
    };
  }

  const zone = entry.zones[0];
  const standalone = zone ? standaloneZoneEnvelope(zone, transform, lakePolygon ?? null) : { path: '', mode: 'single-oval' };
  const d = standalone.path;
  if (!zone || !d) warnings.push({ code: 'missing_zone_path', message: 'Standalone zone path is empty.', entryId: entry.entryId, zoneId: entry.zoneIds[0] });
  if (standalone.mode === 'point-shoreline-buffer') {
    const strokeWidthPx = standalone.strokeWidthPx ?? 16;
    return {
      zoneMarkup: `<g class="water-reader-entry water-reader-standalone-zone water-reader-point-shoreline-buffer" data-entry-id="${escapeXml(entry.entryId)}" data-zone-id="${escapeXml(entry.zoneIds[0] ?? '')}" data-display-number="${number}" data-render-mode="point-shoreline-buffer" data-point-apron-stroke-width-px="${format(strokeWidthPx)}">
        <path d="${d}" fill="none" stroke="${entry.colorHex}" stroke-opacity="${POINT_BUFFER_STROKE_OPACITY}" stroke-width="${format(strokeWidthPx)}" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`,
      labelMarkup: numberLabel(plan),
    };
  }
  return {
    zoneMarkup: `<path class="water-reader-entry water-reader-standalone-zone" data-entry-id="${escapeXml(entry.entryId)}" data-zone-id="${escapeXml(entry.zoneIds[0] ?? '')}" data-display-number="${number}" data-render-mode="${standalone.mode}" d="${d}" fill="${entry.colorHex}" fill-opacity="${ZONE_FILL_OPACITY}" stroke="${entry.colorHex}" stroke-opacity="${ZONE_STROKE_OPACITY}" stroke-width="${ZONE_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"/>`,
    labelMarkup: numberLabel(plan),
  };
}

function standaloneZoneEnvelope(
  zone: WaterReaderDisplayZoneGeometry,
  transform: WaterReaderSvgTransform,
  lakePolygon: PolygonM | null,
): { path: string; mode: string; strokeWidthPx?: number } {
  const renderShape = typeof zone.diagnostics.featureEnvelopeRenderShape === 'string'
    ? zone.diagnostics.featureEnvelopeRenderShape
    : null;
  if (renderShape === 'rounded_point_apron') {
    const shorelineBuffer = pointShorelineBufferPath(zone, transform, lakePolygon);
    if (shorelineBuffer) return shorelineBuffer;
    const apron = roundedPointApronPath(zone, transform, lakePolygon);
    if (apron) return { path: apron, mode: 'rounded-point-apron' };
  }
  if (renderShape === 'shoreline_cove_polygon') {
    const polygon = shorelineCovePolygonPath(zone, transform);
    if (polygon) return { path: polygon, mode: 'shoreline-cove-polygon' };
  }
  if (renderShape === 'full_cove_basin') {
    const basin = fullCoveBasinPath(zone, transform);
    if (basin) return { path: basin, mode: 'full-cove-basin' };
  }
  if (renderShape === 'merged_point_lobes' || renderShape === 'paired_shoulder_lobes') {
    const lobeRings = featureEnvelopeRenderLobes(zone);
    const points = lobeRings.flat().filter(validPoint);
    if (points.length >= 3) {
      const hull = convexHull(points);
      const center = boundsCenter(hull.length >= 3 ? hull : points);
      const pad = Math.max(zone.majorAxisM * 0.012, 3);
      const envelope = expandHull(hull.length >= 3 ? hull : points, center, pad);
      return { path: smoothClosedPath(envelope, transform), mode: renderShape === 'merged_point_lobes' ? 'merged-point-lobes' : 'paired-shoulder-lobes' };
    }
  }
  return {
    path: svgPathForRing(zone.unclippedRing, transform, true),
    mode: zone.placementKind === 'island_structure_area' ? 'island-centered-envelope' : 'single-oval',
  };
}

function pointShorelineBufferPath(
  zone: WaterReaderDisplayZoneGeometry,
  transform: WaterReaderSvgTransform,
  lakePolygon: PolygonM | null,
): { path: string; mode: string; strokeWidthPx: number } | null {
  const samples = diagnosticPointSequence(zone, 'pointEnvelopeShorePathSample', 13);
  if (samples.length < 3) return null;
  const strokeWidthM = diagnosticNumber(zone.diagnostics.pointApronStrokeWidthM) * 1.12;
  const visibleCenter = ringCenter(visibleOrUnclippedRing(zone));
  const offsetM = Math.max(0, strokeWidthM * 0.16);
  const renderSamples = lakePolygon
    ? samples.map((sample) => {
        const waterward = inferWaterwardDirection({
          origin: sample,
          preferred: { x: visibleCenter.x - sample.x, y: visibleCenter.y - sample.y },
          alternatives: [
            { x: zone.center.x - sample.x, y: zone.center.y - sample.y },
            { x: zone.anchor.x - sample.x, y: zone.anchor.y - sample.y },
          ],
          lakePolygon,
          scaleM: Math.max(4, offsetM * 1.8),
        });
        return waterward ? add(sample, scale(waterward, offsetM)) : sample;
      })
    : samples;
  const minWidthPx = Math.max(1, diagnosticNumber(zone.diagnostics.pointApronAppMinWidthPx) || 16);
  const strokeWidthPx = clampNumber(
    Math.max(strokeWidthM * transform.scale, minWidthPx),
    minWidthPx,
    Math.max(minWidthPx, 48),
  );
  return {
    path: svgPathForRing(renderSamples, transform, false),
    mode: 'point-shoreline-buffer',
    strokeWidthPx,
  };
}

function shorelineCovePolygonPath(zone: WaterReaderDisplayZoneGeometry, transform: WaterReaderSvgTransform): string {
  const shoreSamples = diagnosticPointSequence(zone, 'coveEnvelopeShorePathSample', COVE_SHORE_PATH_RENDER_SAMPLE_LIMIT);
  const mouthLeft = diagnosticPoint(zone, 'coveEnvelopeMouthLeft');
  const mouthRight = diagnosticPoint(zone, 'coveEnvelopeMouthRight');
  const back = diagnosticPoint(zone, 'coveEnvelopeBack');
  if (shoreSamples.length < 3 || !mouthLeft || !mouthRight || !back) return '';
  const first = shoreSamples[0]!;
  const last = shoreSamples[shoreSamples.length - 1]!;
  const mouthMid = midpoint(mouthLeft, mouthRight);
  const towardBack = normalize({ x: back.x - mouthMid.x, y: back.y - mouthMid.y }) ?? normalize({ x: zone.center.x - mouthMid.x, y: zone.center.y - mouthMid.y });
  const mouthWidthM = Math.max(1, distance(mouthLeft, mouthRight));
  const depthM = Math.max(1, distance(back, mouthMid));
  const capInsetM = clampNumber(Math.min(mouthWidthM * 0.16, depthM * 0.18), 3, zone.majorAxisM * 0.1);
  const control = towardBack ? add(mouthMid, scale(towardBack, capInsetM)) : mouthMid;
  const firstSvg = svgPoint(first, transform);
  const controlSvg = svgPoint(control, transform);
  const parts = [`M ${format(firstSvg.x)} ${format(firstSvg.y)}`];
  for (let index = 1; index < shoreSamples.length; index++) {
    const point = svgPoint(shoreSamples[index]!, transform);
    parts.push(`L ${format(point.x)} ${format(point.y)}`);
  }
  parts.push(`Q ${format(controlSvg.x)} ${format(controlSvg.y)} ${format(firstSvg.x)} ${format(firstSvg.y)}`);
  parts.push('Z');
  return parts.join(' ');
}

function roundedPointApronPath(
  zone: WaterReaderDisplayZoneGeometry,
  transform: WaterReaderSvgTransform,
  lakePolygon: PolygonM | null,
): string {
  const tip = diagnosticPoint(zone, 'featureEnvelopeRenderLobe1Center');
  const left = diagnosticPoint(zone, 'featureEnvelopeRenderLobe2Center');
  const right = diagnosticPoint(zone, 'featureEnvelopeRenderLobe3Center');
  if (!tip || !left || !right) return '';
  const shoulderMid = midpoint(left, right);
  const baseDirection = normalize({ x: tip.x - shoulderMid.x, y: tip.y - shoulderMid.y }) ??
    normalize({ x: tip.x - zone.center.x, y: tip.y - zone.center.y }) ??
    { x: Math.cos(zone.rotationRad), y: Math.sin(zone.rotationRad) };
  const visibleCenter = ringCenter(visibleOrUnclippedRing(zone));
  const waterward = inferWaterwardDirection({
    origin: tip,
    preferred: baseDirection,
    alternatives: [
      { x: visibleCenter.x - tip.x, y: visibleCenter.y - tip.y },
      { x: zone.center.x - tip.x, y: zone.center.y - tip.y },
      { x: -baseDirection.x, y: -baseDirection.y },
      { x: -(right.y - left.y), y: right.x - left.x },
      { x: right.y - left.y, y: -(right.x - left.x) },
    ],
    lakePolygon,
    scaleM: Math.max(zone.majorAxisM * 0.16, distance(tip, shoulderMid) * 0.55, 12),
  }) ?? baseDirection;
  const side = normalize({ x: right.x - left.x, y: right.y - left.y }) ??
    { x: -waterward.y, y: waterward.x };
  const shoulderSpanM = Math.max(1, distance(left, right));
  const protrusionM = Math.max(1, distance(tip, shoulderMid));
  const tipLobeMajorM = diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobe1MajorAxisM);
  const shoulderLobeMajorM = Math.max(
    diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobe2MajorAxisM),
    diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobe3MajorAxisM),
  );
  const shoulderLobeMinorM = Math.max(
    diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobe2MinorAxisM),
    diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobe3MinorAxisM),
  );
  const waterwardPadM = clampNumber(
    Math.max(tipLobeMajorM * 0.86, protrusionM * 0.74, zone.majorAxisM * 0.2, 14),
    Math.min(zone.majorAxisM * 0.16, 18),
    zone.majorAxisM * 0.5,
  );
  const shoulderPadM = clampNumber(
    Math.max(shoulderLobeMinorM * 0.8, shoulderSpanM * 0.32, zone.minorAxisM * 0.32, 12),
    Math.min(zone.majorAxisM * 0.12, 16),
    zone.majorAxisM * 0.34,
  );
  const backPadM = clampNumber(Math.max(shoulderLobeMajorM * 0.16, protrusionM * 0.18, zone.minorAxisM * 0.12), 5, zone.majorAxisM * 0.18);
  const points = [
    add(tip, scale(waterward, waterwardPadM)),
    add(lerp(tip, left, 0.36), add(scale(waterward, waterwardPadM * 0.52), scale(side, -shoulderPadM * 0.58))),
    add(left, add(scale(waterward, waterwardPadM * 0.18), scale(side, -shoulderPadM))),
    add(left, add(scale(side, -shoulderPadM * 0.55), scale(waterward, -backPadM))),
    add(shoulderMid, scale(waterward, -backPadM * 0.95)),
    add(right, add(scale(side, shoulderPadM * 0.55), scale(waterward, -backPadM))),
    add(right, add(scale(waterward, waterwardPadM * 0.18), scale(side, shoulderPadM))),
    add(lerp(tip, right, 0.36), add(scale(waterward, waterwardPadM * 0.52), scale(side, shoulderPadM * 0.58))),
  ];
  return bezierClosedPath(points, transform);
}

function fullCoveBasinPath(zone: WaterReaderDisplayZoneGeometry, transform: WaterReaderSvgTransform): string {
  const mouthLeft = diagnosticPoint(zone, 'coveEnvelopeMouthLeft');
  const mouthRight = diagnosticPoint(zone, 'coveEnvelopeMouthRight');
  const back = diagnosticPoint(zone, 'coveEnvelopeBack');
  const leftInner = diagnosticPoint(zone, 'coveEnvelopeLeftInner');
  const rightInner = diagnosticPoint(zone, 'coveEnvelopeRightInner');
  const leftNearMouth = diagnosticPoint(zone, 'coveEnvelopeLeftNearMouth');
  const rightNearMouth = diagnosticPoint(zone, 'coveEnvelopeRightNearMouth');
  if (!mouthLeft || !mouthRight || !back || !leftInner || !rightInner) return '';
  const shoreSamples = diagnosticPointSequence(zone, 'coveEnvelopeShorePathSample', COVE_SHORE_PATH_RENDER_SAMPLE_LIMIT);
  const mouthMid = midpoint(mouthLeft, mouthRight);
  const axis = normalize({ x: mouthMid.x - back.x, y: mouthMid.y - back.y }) ??
    { x: Math.cos(zone.rotationRad), y: Math.sin(zone.rotationRad) };
  const side = normalize({ x: mouthRight.x - mouthLeft.x, y: mouthRight.y - mouthLeft.y }) ??
    { x: -axis.y, y: axis.x };
  const basinCenter = lerp(back, mouthMid, 0.48);
  const mouthWidthM = Math.max(1, distance(mouthLeft, mouthRight));
  const depthM = Math.max(1, distance(back, mouthMid));
  const sidePadM = clampNumber(Math.max(mouthWidthM * 0.08, zone.minorAxisM * 0.07), 4, zone.majorAxisM * 0.13);
  const mouthPadM = clampNumber(Math.max(depthM * 0.06, zone.majorAxisM * 0.028), 4, zone.majorAxisM * 0.1);
  const backPadM = clampNumber(Math.max(depthM * 0.08, zone.minorAxisM * 0.06), 4, zone.majorAxisM * 0.1);
  const curvedShore = shoreSamples.length >= 5
    ? shoreSamples.map((point, index) => {
        const inward = normalize({ x: basinCenter.x - point.x, y: basinCenter.y - point.y }) ?? axis;
        const endFactor = Math.min(index, shoreSamples.length - 1 - index) <= 1 ? 0.45 : 0.72;
        return add(point, scale(inward, sidePadM * endFactor));
      })
    : [
        add(mouthLeft, add(scale(side, -sidePadM), scale(axis, mouthPadM * 0.25))),
        leftNearMouth ? add(leftNearMouth, scale(side, -sidePadM * 0.34)) : lerp(mouthLeft, leftInner, 0.45),
        add(leftInner, scale(side, -sidePadM * 0.2)),
        add(back, scale(axis, backPadM)),
        add(rightInner, scale(side, sidePadM * 0.2)),
        rightNearMouth ? add(rightNearMouth, scale(side, sidePadM * 0.34)) : lerp(mouthRight, rightInner, 0.45),
        add(mouthRight, add(scale(side, sidePadM), scale(axis, mouthPadM * 0.25))),
      ];
  const points = [
    ...curvedShore,
    add(mouthRight, add(scale(side, sidePadM * 0.45), scale(axis, mouthPadM))),
    add(mouthMid, scale(axis, mouthPadM * 0.72)),
    add(mouthLeft, add(scale(side, -sidePadM * 0.45), scale(axis, mouthPadM))),
  ];
  return bezierClosedPath(points, transform);
}

function featureEnvelopeRenderLobes(zone: WaterReaderDisplayZoneGeometry): RingM[] {
  const count = Math.min(4, Math.max(0, diagnosticNumber(zone.diagnostics.featureEnvelopeRenderLobeCount)));
  const rings: RingM[] = [];
  for (let index = 1; index <= count; index++) {
    const centerX = diagnosticNumber(zone.diagnostics[`featureEnvelopeRenderLobe${index}CenterX`]);
    const centerY = diagnosticNumber(zone.diagnostics[`featureEnvelopeRenderLobe${index}CenterY`]);
    const majorAxisM = diagnosticNumber(zone.diagnostics[`featureEnvelopeRenderLobe${index}MajorAxisM`]);
    const minorAxisM = diagnosticNumber(zone.diagnostics[`featureEnvelopeRenderLobe${index}MinorAxisM`]);
    const rotationRad = diagnosticNumber(zone.diagnostics[`featureEnvelopeRenderLobe${index}RotationRad`]);
    if (!Number.isFinite(centerX) || !Number.isFinite(centerY) || majorAxisM <= 0 || minorAxisM <= 0) continue;
    rings.push(ovalRing({ x: centerX, y: centerY }, majorAxisM, minorAxisM, rotationRad));
  }
  return rings;
}

function diagnosticPoint(zone: WaterReaderDisplayZoneGeometry, prefix: string): PointM | null {
  const x = diagnosticNumber(zone.diagnostics[`${prefix}X`]);
  const y = diagnosticNumber(zone.diagnostics[`${prefix}Y`]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function diagnosticPointSequence(zone: WaterReaderDisplayZoneGeometry, prefix: string, maxCount: number): PointM[] {
  const count = Math.min(maxCount, Math.max(0, diagnosticNumber(zone.diagnostics[`${prefix}Count`])));
  const points: PointM[] = [];
  for (let index = 1; index <= count; index++) {
    const point = diagnosticPoint(zone, `${prefix}${index}`);
    if (point) points.push(point);
  }
  return points;
}

function inferWaterwardDirection(params: {
  origin: PointM;
  preferred: PointM;
  alternatives: PointM[];
  lakePolygon: PolygonM | null;
  scaleM: number;
}): PointM | null {
  const candidates = [params.preferred, ...params.alternatives]
    .map(normalize)
    .filter((point): point is PointM => point !== null);
  if (candidates.length === 0) return null;
  if (!params.lakePolygon) return candidates[0] ?? null;
  const unique = uniqueDirections(candidates);
  const scored = unique.map((direction, index) => {
    const distances = [0.35, 0.7, 1, 1.35].map((factor) => params.scaleM * factor);
    const waterHits = distances.filter((distanceM) =>
      pointInWaterOrBoundary(
        { x: params.origin.x + direction.x * distanceM, y: params.origin.y + direction.y * distanceM },
        params.lakePolygon!,
        Math.max(1, params.scaleM * 0.02),
      ),
    ).length;
    return { direction, waterHits, index };
  });
  return scored.sort((a, b) => b.waterHits - a.waterHits || a.index - b.index)[0]?.direction ?? unique[0] ?? null;
}

function uniqueDirections(directions: PointM[]): PointM[] {
  const out: PointM[] = [];
  for (const direction of directions) {
    if (out.some((existing) => Math.abs(existing.x * direction.x + existing.y * direction.y) > 0.985)) continue;
    out.push(direction);
  }
  return out;
}

function ovalRing(center: PointM, majorAxisM: number, minorAxisM: number, rotationRad: number, samples = 48): RingM {
  const ring: RingM = [];
  const majorRadius = majorAxisM / 2;
  const minorRadius = minorAxisM / 2;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  for (let i = 0; i < samples; i++) {
    const theta = (Math.PI * 2 * i) / samples;
    const localX = Math.cos(theta) * majorRadius;
    const localY = Math.sin(theta) * minorRadius;
    ring.push({
      x: center.x + localX * cos - localY * sin,
      y: center.y + localX * sin + localY * cos,
    });
  }
  return ring;
}

function numberLabel(plan: LabelPlan): string {
  const className = `water-reader-map-number water-reader-map-number-${plan.kind}${plan.callout ? ' water-reader-map-number-callout' : ''}`;
  const radius = plan.callout ? CALLOUT_LABEL_RADIUS : CENTER_LABEL_RADIUS;
  // Paper-language number puck: warm paperWhite chip with an inked stroke and
  // an inked leader at low opacity. Mirrors the badge style used elsewhere
  // in the FinFindr UI (see `WaterReaderLegend` row badges).
  const leader = plan.callout
    ? `<path class="water-reader-label-leader" d="M ${format(plan.anchor.x)} ${format(plan.anchor.y)} L ${format(plan.label.x)} ${format(plan.label.y)}" fill="none" stroke="${TEXT}" stroke-width="1" stroke-opacity="0.5" stroke-linecap="round"/>`
    : '';
  return `<g class="${className}" data-entry-id="${escapeXml(plan.entryId)}" data-display-number="${plan.displayNumber}" data-label-placement="${plan.callout ? 'callout' : 'center'}" data-leader-length-px="${format(plan.leaderLengthPx)}" data-long-leader="${plan.longLeader ? 'true' : 'false'}" filter="url(#wr-label-shadow)">
        ${leader}
        <circle cx="${format(plan.label.x)}" cy="${format(plan.label.y)}" r="${format(radius)}" fill="#F8F1DD" stroke="${TEXT}" stroke-width="1.15"/>
        <text x="${format(plan.label.x)}" y="${format(plan.label.y + 0.15)}" font-family="${FONT}" font-size="${plan.callout ? 9.25 : 9.5}" font-weight="850" fill="${TEXT}" text-anchor="middle" dominant-baseline="central">${plan.displayNumber}</text>
      </g>`;
}

function buildLabelPlans(
  entries: WaterReaderDisplayEntry[],
  transform: WaterReaderSvgTransform,
  warnings: WaterReaderRenderWarning[],
  lakePolygon: PolygonM | null,
): LabelPlan[] {
  const placed: Bounds[] = [];
  const entryBounds = entries.map((entry) => svgBoundsForEntry(entry, transform));
  const lakeBounds = lakePolygon ? boundsForPoints(lakePolygon.exterior.map((point) => svgPoint(point, transform))) : null;
  return entries.map((entry, index) => {
    const kind = entry.entryType === 'structure_confluence' || entry.entryType === 'neck_area' ? 'confluence' : 'standalone';
    const anchor = svgPoint(labelAnchor(entry, warnings).point, transform);
    const bounds = svgBoundsForEntry(entry, transform);
    const labelResult = outsideCalloutPoint(bounds, anchor, transform, placed, index, lakePolygon, lakeBounds, entryBounds);
    if (labelResult.insideLakeFallback) {
      warnings.push({
        code: 'invalid_geometry',
        message: 'Map number label fell back inside the lake polygon because no deterministic outside callout candidate was available.',
        entryId: entry.entryId,
      });
    }
    if (labelResult.longLeader) {
      warnings.push({
        code: 'long_label_leader',
        message: `Map number label used a long outside leader (${format(labelResult.leaderLengthPx)}px) because no shorter non-overlapping outside candidate was available.`,
        entryId: entry.entryId,
      });
    }
    const label = labelResult.point;
    const labelBounds = circleBounds(label, CALLOUT_LABEL_RADIUS);
    placed.push(labelBounds);
    return {
      entryId: entry.entryId,
      displayNumber: entry.displayNumber ?? '',
      kind,
      anchor,
      label,
      callout: true,
      leaderLengthPx: labelResult.leaderLengthPx,
      longLeader: labelResult.longLeader,
      bounds,
    };
  });
}

function fallbackLabelPlan(
  entry: WaterReaderDisplayEntry,
  transform: WaterReaderSvgTransform,
  warnings: WaterReaderRenderWarning[],
): LabelPlan {
  const kind = entry.entryType === 'structure_confluence' ? 'confluence' : 'standalone';
  const anchor = svgPoint(labelAnchor(entry, warnings).point, transform);
  const bounds = svgBoundsForEntry(entry, transform);
  return {
    entryId: entry.entryId,
    displayNumber: entry.displayNumber ?? '',
    kind,
    anchor,
    label: anchor,
    callout: true,
    leaderLengthPx: 0,
    longLeader: false,
    bounds,
  };
}

function svgBoundsForEntry(entry: WaterReaderDisplayEntry, transform: WaterReaderSvgTransform): Bounds {
  const points = entry.zones
    .flatMap((zone) => visibleOrUnclippedRing(zone))
    .filter(validPoint)
    .map((point) => svgPoint(point, transform));
  return boundsForPoints(points.length > 0 ? points : [svgPoint(labelAnchor(entry, []).point, transform)]);
}

function outsideCalloutPoint(
  bounds: Bounds,
  anchor: PointM,
  transform: WaterReaderSvgTransform,
  placed: Bounds[],
  index: number,
  lakePolygon: PolygonM | null,
  lakeBounds: Bounds | null,
  zoneBounds: Bounds[],
): { point: PointM; insideLakeFallback: boolean; leaderLengthPx: number; longLeader: boolean } {
  const candidates = calloutCandidates(bounds, anchor, transform, index, lakeBounds)
    .map((point) => clampLabelPoint(point, transform));
  const scored = candidates
    .map((point, candidateIndex) => {
      const labelBounds = circleBounds(point, CALLOUT_LABEL_RADIUS + 3);
      const outsideLake = !pointInsideLakeSvg(point, lakePolygon, transform);
      const avoidsLabels = placed.every((other) => !boundsOverlap(labelBounds, other));
      const avoidsZones = zoneBounds.every((other) => !boundsOverlap(labelBounds, padBounds(other, 2)));
      const leaderLengthPx = distancePx(point, anchor);
      return {
        point,
        outsideLake,
        avoidsLabels,
        avoidsZones,
        leaderLengthPx,
        localScore: localCandidateScore(point, bounds, anchor),
        candidateIndex,
      };
    })
    .sort((a, b) =>
      Number(b.outsideLake) - Number(a.outsideLake) ||
      Number(b.avoidsLabels) - Number(a.avoidsLabels) ||
      Number(b.avoidsZones) - Number(a.avoidsZones) ||
      Number(b.leaderLengthPx <= PREFERRED_LABEL_LEADER_LENGTH_PX) - Number(a.leaderLengthPx <= PREFERRED_LABEL_LEADER_LENGTH_PX) ||
      a.leaderLengthPx - b.leaderLengthPx ||
      a.localScore - b.localScore ||
      a.candidateIndex - b.candidateIndex
    );
  const best = scored[0];
  if (best) {
    return {
      point: best.point,
      insideLakeFallback: !best.outsideLake,
      leaderLengthPx: roundNumber(best.leaderLengthPx, 2),
      longLeader: best.outsideLake && best.leaderLengthPx > PREFERRED_LABEL_LEADER_LENGTH_PX,
    };
  }
  const fallback = clampLabelPoint({ x: anchor.x + CALLOUT_MARGIN, y: anchor.y - CALLOUT_MARGIN }, transform);
  const leaderLengthPx = distancePx(fallback, anchor);
  return {
    point: fallback,
    insideLakeFallback: true,
    leaderLengthPx: roundNumber(leaderLengthPx, 2),
    longLeader: leaderLengthPx > PREFERRED_LABEL_LEADER_LENGTH_PX,
  };
}

function calloutCandidates(
  bounds: Bounds,
  anchor: PointM,
  transform: WaterReaderSvgTransform,
  index: number,
  lakeBounds: Bounds | null,
): PointM[] {
  const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
  const reference = lakeBounds ?? {
    minX: transform.padding,
    maxX: transform.width - transform.padding,
    minY: transform.padding,
    maxY: transform.mapBottomY,
  };
  const lakeCenter = { x: (reference.minX + reference.maxX) / 2, y: (reference.minY + reference.maxY) / 2 };
  const dx = anchor.x - lakeCenter.x;
  const dy = anchor.y - lakeCenter.y;
  const radialLength = Math.max(1, Math.hypot(dx, dy));
  const radial = { x: dx / radialLength, y: dy / radialLength };
  const edgeX = radial.x >= 0 ? reference.maxX + CALLOUT_MARGIN : reference.minX - CALLOUT_MARGIN;
  const edgeY = radial.y >= 0 ? reference.maxY + CALLOUT_MARGIN : reference.minY - CALLOUT_MARGIN;
  const localOffset = CALLOUT_MARGIN + CALLOUT_LABEL_RADIUS + 4;
  const candidates = [
    { x: bounds.maxX + localOffset, y: center.y },
    { x: bounds.minX - localOffset, y: center.y },
    { x: center.x, y: bounds.minY - localOffset },
    { x: center.x, y: bounds.maxY + localOffset },
    { x: bounds.maxX + localOffset, y: bounds.minY - localOffset },
    { x: bounds.maxX + localOffset, y: bounds.maxY + localOffset },
    { x: bounds.minX - localOffset, y: bounds.minY - localOffset },
    { x: bounds.minX - localOffset, y: bounds.maxY + localOffset },
    { x: anchor.x + radial.x * localOffset * 1.65, y: anchor.y + radial.y * localOffset * 1.65 },
    { x: edgeX, y: anchor.y },
    { x: anchor.x, y: edgeY },
  ];
  return [...candidates.slice(index % candidates.length), ...candidates.slice(0, index % candidates.length)];
}

function localCandidateScore(point: PointM, bounds: Bounds, anchor: PointM): number {
  const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
  const localDistance = distancePx(point, center);
  const sameSidePenalty = Math.sign(point.x - center.x) === Math.sign(anchor.x - center.x) ||
    Math.sign(point.y - center.y) === Math.sign(anchor.y - center.y)
    ? 0
    : 8;
  return localDistance + sameSidePenalty;
}

function distancePx(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function roundNumber(value: number, precision: number): number {
  if (!Number.isFinite(value)) return 0;
  const scale = 10 ** precision;
  return Math.round(value * scale) / scale;
}

function diagnosticNumber(value: number | string | boolean | string[] | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function clampLabelPoint(point: PointM, transform: WaterReaderSvgTransform): PointM {
  const minX = transform.padding + CALLOUT_LABEL_RADIUS;
  const maxX = transform.width - transform.padding - CALLOUT_LABEL_RADIUS;
  const minY = transform.padding + CALLOUT_LABEL_RADIUS;
  const maxY = transform.mapBottomY - CALLOUT_LABEL_RADIUS;
  return {
    x: Math.min(maxX, Math.max(minX, point.x)),
    y: Math.min(maxY, Math.max(minY, point.y)),
  };
}

function circleBounds(point: PointM, radius: number): Bounds {
  return { minX: point.x - radius, maxX: point.x + radius, minY: point.y - radius, maxY: point.y + radius };
}

function boundsOverlap(a: Bounds, b: Bounds): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

function padBounds(bounds: Bounds, pad: number): Bounds {
  return { minX: bounds.minX - pad, maxX: bounds.maxX + pad, minY: bounds.minY - pad, maxY: bounds.maxY + pad };
}

function pointInsideLakeSvg(point: PointM, lakePolygon: PolygonM | null, transform: WaterReaderSvgTransform): boolean {
  if (!lakePolygon) return false;
  const world = {
    x: (point.x - transform.padding - transform.mapOffsetX) / transform.scale + transform.minX,
    y: transform.maxY - (point.y - transform.padding - transform.mapOffsetY) / transform.scale,
  };
  return pointInWaterOrBoundary(world, lakePolygon, Math.max(0.5, 1 / Math.max(transform.scale, 0.001)));
}

function labelAnchor(entry: WaterReaderDisplayEntry, warnings: WaterReaderRenderWarning[]): WaterReaderLabelAnchor {
  const visiblePoints = entry.zones.flatMap((zone) => zone.visibleWaterRing).filter(validPoint);
  if (visiblePoints.length > 0) return { point: boundsCenter(visiblePoints) };
  const centers = entry.zones.map((zone) => zone.center).filter(validPoint);
  if (centers.length > 0) {
    warnings.push({ code: 'missing_label_anchor', message: 'Label anchor fell back to zone center because visible geometry was missing.', entryId: entry.entryId });
    return { point: averagePoint(centers) };
  }
  warnings.push({ code: 'missing_label_anchor', message: 'Display entry has no usable label anchor.', entryId: entry.entryId });
  return { point: { x: 0, y: 0 } };
}

// In-SVG "Map Key" rendering and legend layout helpers were removed in the
// FinFindr paper redesign. The structured `legendEntries` payload below is
// still emitted on the response and is consumed by the React
// `WaterReaderLegend` component, which renders the legend in paper language
// (Fraunces titles, paperWhite badges, gold transition chips). If a future
// caller needs an in-SVG legend again, restore from git history.

function productionLegendEntries(displayModel: WaterReaderDisplayModel): WaterReaderProductionSvgResult['legendEntries'] {
  return displayModel.displayLegendEntries.map((entry) => {
    const placementKinds = normalizeLegendPlacementKinds(entry.placementKinds, entry.placementKind);
    const zoneIds = entry.zoneIds?.length ? entry.zoneIds : [entry.zoneId];
    return {
      number: entry.number,
      title: entry.title,
      body: entry.body,
      colorHex: entry.colorHex ?? DEFAULT_LEGEND_COLOR,
      featureClass: normalizeLegendFeatureClass(entry.featureClass, entry.isConfluence),
      placementKind: normalizeLegendPlacementKind(entry.placementKind) ?? placementKinds[0],
      placementKinds,
      zoneId: entry.zoneId,
      zoneIds,
      transitionWarning: entry.transitionWarning,
      isConfluence: entry.isConfluence,
    };
  });
}

function normalizeLegendFeatureClass(
  featureClass: WaterReaderFeatureClass | 'structure_confluence' | undefined,
  isConfluence: boolean | undefined,
): WaterReaderFeatureClass | 'structure_confluence' {
  if (featureClass) return featureClass;
  return isConfluence ? 'structure_confluence' : 'universal';
}

function normalizeLegendPlacementKind(placementKind: string | undefined): WaterReaderZonePlacementKind | undefined {
  return placementKind as WaterReaderZonePlacementKind | undefined;
}

function normalizeLegendPlacementKinds(
  placementKinds: string[] | undefined,
  placementKind: string | undefined,
): WaterReaderZonePlacementKind[] {
  if (placementKinds?.length) return placementKinds as WaterReaderZonePlacementKind[];
  const normalizedPlacementKind = normalizeLegendPlacementKind(placementKind);
  return normalizedPlacementKind ? [normalizedPlacementKind] : [];
}

function groupedEntryMemberShapes(
  entry: WaterReaderDisplayEntry,
  transform: WaterReaderSvgTransform,
  lakePolygon: PolygonM | null,
): string {
  const memberMarkup = entry.zones
    .map((zone, index) => groupedEntryMemberShape(zone, entry, transform, lakePolygon, index))
    .filter(Boolean);
  return memberMarkup.length > 0 ? memberMarkup.join('\n') : '';
}

function groupedEntryMemberShape(
  zone: WaterReaderDisplayZoneGeometry,
  entry: WaterReaderDisplayEntry,
  transform: WaterReaderSvgTransform,
  lakePolygon: PolygonM | null,
  index: number,
): string {
  const member = standaloneZoneEnvelope(zone, transform, lakePolygon);
  if (!member.path) return '';
  const zoneId = escapeXml(zone.zoneId);
  const entryId = escapeXml(entry.entryId);
  const number = entry.displayNumber ?? '';
  if (member.mode === 'point-shoreline-buffer') {
    const strokeWidthPx = member.strokeWidthPx ?? 16;
    return `<g class="water-reader-confluence-member water-reader-point-shoreline-buffer" data-entry-id="${entryId}" data-zone-id="${zoneId}" data-member-index="${index + 1}" data-display-number="${number}" data-render-mode="point-shoreline-buffer" data-point-apron-stroke-width-px="${format(strokeWidthPx)}">
        <path d="${member.path}" fill="none" stroke="${CONFLUENCE}" stroke-opacity="${CONFLUENCE_POINT_BUFFER_STROKE_OPACITY}" stroke-width="${format(strokeWidthPx)}" stroke-linecap="round" stroke-linejoin="round"/>
      </g>`;
  }
  return `<path class="water-reader-confluence-member" data-entry-id="${entryId}" data-zone-id="${zoneId}" data-member-index="${index + 1}" data-display-number="${number}" data-render-mode="${member.mode}" d="${member.path}" fill="${CONFLUENCE}" fill-opacity="${CONFLUENCE_FILL_OPACITY}" stroke="${CONFLUENCE}" stroke-width="${ZONE_STROKE_WIDTH}" stroke-opacity="${CONFLUENCE_STROKE_OPACITY}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function groupedEntryEnvelope(entry: WaterReaderDisplayEntry, transform: WaterReaderSvgTransform): string {
  const points = entry.zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  if (points.length < 3) return '';
  const hull = convexHull(points);
  const center = boundsCenter(hull.length >= 3 ? hull : points);
  const pad = Math.max(entry.majorAxisM * 0.018, 5);
  const envelope = expandHull(hull.length >= 3 ? hull : points, center, pad);
  const path = smoothClosedPath(envelope, transform);
  const color = entry.entryType === 'structure_confluence' ? CONFLUENCE : entry.colorHex;
  const className = entry.entryType === 'structure_confluence' ? 'water-reader-confluence-outline' : 'water-reader-neck-area-outline';
  const fillOpacity = entry.entryType === 'structure_confluence' ? CONFLUENCE_FILL_OPACITY : ZONE_FILL_OPACITY;
  const strokeOpacity = entry.entryType === 'structure_confluence' ? CONFLUENCE_STROKE_OPACITY : ZONE_STROKE_OPACITY;
  return `<path class="${className}" d="${path}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${ZONE_STROKE_WIDTH}" stroke-opacity="${strokeOpacity}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function convexHull(points: PointM[]): PointM[] {
  const uniquePoints = [...new Map(points.map((point) => [`${roundNumber(point.x, 2)},${roundNumber(point.y, 2)}`, point])).values()]
    .sort((a, b) => a.x - b.x || a.y - b.y);
  if (uniquePoints.length <= 3) return uniquePoints;
  const cross = (origin: PointM, a: PointM, b: PointM) =>
    (a.x - origin.x) * (b.y - origin.y) - (a.y - origin.y) * (b.x - origin.x);
  const lower: PointM[] = [];
  for (const point of uniquePoints) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: PointM[] = [];
  for (let i = uniquePoints.length - 1; i >= 0; i--) {
    const point = uniquePoints[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, point) <= 0) upper.pop();
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

function expandHull(points: PointM[], center: PointM, padM: number): PointM[] {
  return points.map((point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const length = Math.hypot(dx, dy);
    if (length <= 0) return point;
    return {
      x: point.x + (dx / length) * padM,
      y: point.y + (dy / length) * padM,
    };
  });
}

function visibleOrUnclippedRing(zone: WaterReaderDisplayZoneGeometry): RingM {
  return zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing;
}

function boundsCenter(points: PointM[]): PointM {
  const bounds = boundsForPoints(points);
  return { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
}

function ringCenter(points: PointM[]): PointM {
  return points.length > 0 ? averagePoint(points) : { x: 0, y: 0 };
}

function boundsForPoints(points: PointM[]): Bounds {
  return points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: points[0]?.x ?? 0, maxX: points[0]?.x ?? 0, minY: points[0]?.y ?? 0, maxY: points[0]?.y ?? 0 },
  );
}

function averagePoint(points: PointM[]): PointM {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function smoothClosedPath(points: PointM[], transform: WaterReaderSvgTransform): string {
  if (points.length === 0) return '';
  const svgPoints = points.map((point) => svgPoint(point, transform));
  const first = svgPoints[0]!;
  const parts = [`M ${format(first.x)} ${format(first.y)}`];
  for (let i = 0; i < svgPoints.length; i++) {
    const current = svgPoints[i]!;
    const next = svgPoints[(i + 1) % svgPoints.length]!;
    const mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
    parts.push(`Q ${format(current.x)} ${format(current.y)} ${format(mid.x)} ${format(mid.y)}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

function bezierClosedPath(points: PointM[], transform: WaterReaderSvgTransform): string {
  const valid = points.filter(validPoint);
  if (valid.length < 3) return '';
  const svgPoints = valid.map((point) => svgPoint(point, transform));
  const first = svgPoints[0]!;
  const parts = [`M ${format(first.x)} ${format(first.y)}`];
  for (let i = 0; i < svgPoints.length; i++) {
    const current = svgPoints[i]!;
    const next = svgPoints[(i + 1) % svgPoints.length]!;
    const after = svgPoints[(i + 2) % svgPoints.length]!;
    const control = next;
    const end = { x: (next.x + after.x) / 2, y: (next.y + after.y) / 2 };
    if (i === 0) {
      const mid = { x: (current.x + next.x) / 2, y: (current.y + next.y) / 2 };
      parts.push(`Q ${format(current.x)} ${format(current.y)} ${format(mid.x)} ${format(mid.y)}`);
    } else {
      parts.push(`Q ${format(control.x)} ${format(control.y)} ${format(end.x)} ${format(end.y)}`);
    }
  }
  parts.push('Z');
  return parts.join(' ');
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lerp(a: PointM, b: PointM, t: number): PointM {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function add(a: PointM, b: PointM): PointM {
  return { x: a.x + b.x, y: a.y + b.y };
}

function scale(point: PointM, value: number): PointM {
  return { x: point.x * value, y: point.y * value };
}

function distance(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(point: PointM): PointM | null {
  const length = Math.hypot(point.x, point.y);
  if (!Number.isFinite(length) || length <= 1e-9) return null;
  return { x: point.x / length, y: point.y / length };
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function validPoint(point: PointM): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
