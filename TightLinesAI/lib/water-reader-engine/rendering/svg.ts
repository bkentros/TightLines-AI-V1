import type { PointM, PolygonM, RingM } from '../contracts';
import type { WaterReaderDisplayEntry, WaterReaderDisplayModel, WaterReaderDisplayZoneGeometry } from '../display-model';
import { pointInWaterOrBoundary } from '../features/validation';
import { waterReaderLegendForbiddenPhraseHits } from '../legend';
import { buildWaterReaderSvgTransform, format, svgPathForPolygon, svgPathForRing, svgPoint } from './transform';
import type {
  WaterReaderLabelAnchor,
  WaterReaderProductionSvgOptions,
  WaterReaderProductionSvgResult,
  WaterReaderRenderSummary,
  WaterReaderRenderWarning,
  WaterReaderSvgTransform,
} from './types';

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const WATER_FILL = '#CFE6F7';
const WATER_STROKE = '#275D7F';
const BACKDROP = '#F7FAFC';
const TEXT = '#0F172A';
const MUTED = '#475569';
const CONFLUENCE = '#D946EF';
const LEGEND_TEXT_OFFSET_X = 28;
const LEGEND_RIGHT_PADDING = 10;
const LEGEND_TITLE_MAX_CHARS = 54;
const LEGEND_BODY_MAX_CHARS = 95;
const LEGEND_WARNING_MAX_CHARS = 95;
const LEGEND_TITLE_LINE_HEIGHT = 14;
const LEGEND_BODY_LINE_HEIGHT = 14;
const LEGEND_WARNING_LINE_HEIGHT = 13;
const LEGEND_TITLE_BODY_GAP = 8;
const LEGEND_ROW_TOP_PADDING = 13;
const LEGEND_ROW_BOTTOM_PADDING = 12;
const LEGEND_ROW_GAP = 8;
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

type LegendEntryLayout = {
  titleLines: string[];
  bodyLines: string[];
  warningLines: string[];
  bodyStartY: number;
  warningStartY: number;
  rowHeight: number;
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
  const legendHeight = estimateLegendHeight(displayModel, mapWidth, padding);
  const transform = buildWaterReaderSvgTransform({
    displayModel,
    lakePolygon: options.lakePolygon,
    padding,
    mapWidth,
    legendHeight,
  });
  if (legendHeight > 520) {
    warnings.push({ code: 'legend_overflow_risk', message: 'Legend content is tall enough to require careful app layout review.' });
  }

  const clipId = `wr-lake-clip-${stableHash(transform.viewBox)}`;
  const lakePath = options.lakePolygon ? svgPathForPolygon(options.lakePolygon, transform) : '';
  if (!lakePath) warnings.push({ code: 'invalid_geometry', message: 'Lake polygon path is empty.' });

  const labelPlans = buildLabelPlans(displayModel.displayedEntries, transform, warnings, options.lakePolygon ?? null);
  const labelLeaderLengths = labelPlans.map((plan) => plan.leaderLengthPx).filter(Number.isFinite);
  const labelPlanByEntryId = new Map(labelPlans.map((plan) => [plan.entryId, plan]));
  const renderedEntries = displayModel.displayedEntries.map((entry) => renderEntry(entry, transform, clipId, warnings, labelPlanByEntryId.get(entry.entryId)));
  const legend = renderLegend(displayModel, transform);
  const title = escapeXml(options.title ?? 'Water Reader');
  const subtitle = escapeXml(options.subtitle ?? 'Polygon geometry readout');
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
      <feDropShadow dx="0" dy="1" stdDeviation="1.1" flood-color="#0F172A" flood-opacity="0.22"/>
    </filter>
  </defs>${warningComment}
  <rect width="100%" height="100%" fill="${BACKDROP}"/>
  <g class="water-reader-map">
    <path class="water-reader-lake" d="${lakePath}" fill="${WATER_FILL}" fill-rule="evenodd" stroke="${WATER_STROKE}" stroke-width="1.35"/>
    <g class="water-reader-zones" clip-path="url(#${clipId})">
      ${renderedEntries.map((entry) => entry.zoneMarkup).join('\n      ')}
    </g>
    <g class="water-reader-labels">
      ${renderedEntries.map((entry) => entry.labelMarkup).join('\n      ')}
    </g>
  </g>
  ${legend}
  <text x="${padding}" y="${transform.height - 18}" font-family="${FONT}" font-size="11" fill="${MUTED}" font-weight="700">FinFindr Water Reader</text>
  <text x="${transform.width - padding}" y="${transform.height - 18}" font-family="${FONT}" font-size="10" fill="${MUTED}" text-anchor="end">${subtitle}</text>
</svg>
`;

  const summary: WaterReaderRenderSummary = {
    displayedEntryCount: displayModel.displayedEntries.length,
    renderedNumberCount: displayModel.displayedEntries.length,
    calloutLabelCount: labelPlans.filter((plan) => plan.callout).length,
    renderedStandaloneCount: displayModel.displayedEntries.filter((entry) => entry.entryType === 'standalone_zone').length,
    renderedConfluenceCount: displayModel.displayedEntries.filter((entry) => entry.entryType === 'structure_confluence').length,
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

  return { svg, warnings, summary };
}

function renderEntry(
  entry: WaterReaderDisplayEntry,
  transform: WaterReaderSvgTransform,
  clipId: string,
  warnings: WaterReaderRenderWarning[],
  labelPlan?: LabelPlan,
): { zoneMarkup: string; labelMarkup: string } {
  const number = entry.displayNumber ?? '';
  const plan = labelPlan ?? fallbackLabelPlan(entry, transform, warnings);
  if (entry.entryType === 'structure_confluence' || entry.entryType === 'neck_area') {
    const envelope = groupedEntryEnvelope(entry, transform);
    if (!envelope) warnings.push({ code: 'missing_zone_path', message: 'Grouped entry envelope path is empty.', entryId: entry.entryId });
    const className = entry.entryType === 'structure_confluence' ? 'water-reader-confluence' : 'water-reader-neck-area';
    return {
      zoneMarkup: `<g class="water-reader-entry ${className}" data-entry-id="${escapeXml(entry.entryId)}" data-display-number="${number}" clip-path="url(#${clipId})">${envelope}</g>`,
      labelMarkup: numberLabel(plan),
    };
  }

  const zone = entry.zones[0];
  const d = zone ? svgPathForRing(zone.unclippedRing, transform, true) : '';
  if (!zone || !d) warnings.push({ code: 'missing_zone_path', message: 'Standalone zone path is empty.', entryId: entry.entryId, zoneId: entry.zoneIds[0] });
  return {
    zoneMarkup: `<path class="water-reader-entry water-reader-standalone-zone" data-entry-id="${escapeXml(entry.entryId)}" data-zone-id="${escapeXml(entry.zoneIds[0] ?? '')}" data-display-number="${number}" d="${d}" fill="${entry.colorHex}" fill-opacity="0.34" stroke="${entry.colorHex}" stroke-opacity="0.94" stroke-width="1.2"/>`,
    labelMarkup: numberLabel(plan),
  };
}

function numberLabel(plan: LabelPlan): string {
  const className = `water-reader-map-number water-reader-map-number-${plan.kind}${plan.callout ? ' water-reader-map-number-callout' : ''}`;
  const radius = plan.callout ? CALLOUT_LABEL_RADIUS : CENTER_LABEL_RADIUS;
  const leader = plan.callout
    ? `<path class="water-reader-label-leader" d="M ${format(plan.anchor.x)} ${format(plan.anchor.y)} L ${format(plan.label.x)} ${format(plan.label.y)}" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.58" stroke-linecap="round"/>`
    : '';
  return `<g class="${className}" data-entry-id="${escapeXml(plan.entryId)}" data-display-number="${plan.displayNumber}" data-label-placement="${plan.callout ? 'callout' : 'center'}" data-leader-length-px="${format(plan.leaderLengthPx)}" data-long-leader="${plan.longLeader ? 'true' : 'false'}" filter="url(#wr-label-shadow)">
        ${leader}
        <circle cx="${format(plan.label.x)}" cy="${format(plan.label.y)}" r="${format(radius)}" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.15"/>
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
    x: (point.x - transform.padding) / transform.scale + transform.minX,
    y: transform.maxY - (point.y - transform.padding) / transform.scale,
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

function renderLegend(displayModel: WaterReaderDisplayModel, transform: WaterReaderSvgTransform): string {
  const x = transform.padding;
  let y = transform.legendTop;
  const width = transform.width - transform.padding * 2;
  const wrap = legendWrapLimits(width);
  const rows: string[] = [];
  rows.push(`<text x="${x}" y="${y}" font-family="${FONT}" font-size="15" font-weight="850" fill="${TEXT}">Water Reader Legend</text>`);
  y += 22;
  for (const entry of displayModel.displayLegendEntries) {
    const layout = legendEntryLayout(entry, wrap);
    const color = entry.colorHex ?? '#334155';
    rows.push(`<g class="water-reader-display-legend-entry" data-display-number="${entry.number}" transform="translate(${x} ${y})">
      <rect x="0" y="-${LEGEND_ROW_TOP_PADDING}" width="${width}" height="${layout.rowHeight}" rx="6" fill="#FFFFFF" stroke="#E2E8F0"/>
      <rect x="10" y="-4" width="10" height="10" rx="2" fill="${color}"/>
      ${layout.titleLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${index * LEGEND_TITLE_LINE_HEIGHT}" font-family="${FONT}" font-size="12" font-weight="800" fill="${TEXT}">${escapeXml(line)}</text>`).join('')}
      ${layout.bodyLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${layout.bodyStartY + index * LEGEND_BODY_LINE_HEIGHT}" font-family="${FONT}" font-size="10.5" fill="${MUTED}">${escapeXml(line)}</text>`).join('')}
      ${layout.warningLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${layout.warningStartY + index * LEGEND_WARNING_LINE_HEIGHT}" font-family="${FONT}" font-size="10" fill="#8A4B00">${escapeXml(line)}</text>`).join('')}
    </g>`);
    y += layout.rowHeight + LEGEND_ROW_GAP;
  }
  return `<g class="water-reader-legend">${rows.join('\n  ')}</g>`;
}

function estimateLegendHeight(displayModel: WaterReaderDisplayModel, mapWidth: number, padding: number): number {
  const wrap = legendWrapLimits(mapWidth - padding * 2);
  return 48 + displayModel.displayLegendEntries.reduce((sum, entry) => (
    sum + legendEntryLayout(entry, wrap).rowHeight + LEGEND_ROW_GAP
  ), 0);
}

function legendEntryLayout(
  entry: { number?: number; title: string; body: string; transitionWarning?: string },
  wrap: ReturnType<typeof legendWrapLimits>,
): LegendEntryLayout {
  const titleLines = wrapText(`${entry.number}. ${entry.title}`, wrap.titleMaxChars, 2);
  const bodyLines = wrapText(entry.body, wrap.bodyMaxChars, 3);
  const warningLines = entry.transitionWarning ? wrapText(entry.transitionWarning, wrap.warningMaxChars, 2) : [];
  const bodyStartY = titleLines.length * LEGEND_TITLE_LINE_HEIGHT + LEGEND_TITLE_BODY_GAP;
  const warningStartY = bodyStartY + bodyLines.length * LEGEND_BODY_LINE_HEIGHT;
  const lastBodyY = bodyStartY + Math.max(0, bodyLines.length - 1) * LEGEND_BODY_LINE_HEIGHT;
  const lastWarningY = warningLines.length > 0
    ? warningStartY + (warningLines.length - 1) * LEGEND_WARNING_LINE_HEIGHT
    : lastBodyY;
  const rowHeight = lastWarningY + LEGEND_ROW_TOP_PADDING + LEGEND_ROW_BOTTOM_PADDING;
  return { titleLines, bodyLines, warningLines, bodyStartY, warningStartY, rowHeight };
}

function legendWrapLimits(rowWidth: number): { titleMaxChars: number; bodyMaxChars: number; warningMaxChars: number } {
  const textWidth = Math.max(80, rowWidth - LEGEND_TEXT_OFFSET_X - LEGEND_RIGHT_PADDING);
  return {
    titleMaxChars: Math.min(LEGEND_TITLE_MAX_CHARS, Math.max(24, Math.floor(textWidth / 6.2))),
    bodyMaxChars: Math.min(LEGEND_BODY_MAX_CHARS, Math.max(34, Math.floor(textWidth / 5.4))),
    warningMaxChars: Math.min(LEGEND_WARNING_MAX_CHARS, Math.max(34, Math.floor(textWidth / 5.4))),
  };
}

function groupedEntryEnvelope(entry: WaterReaderDisplayEntry, transform: WaterReaderSvgTransform): string {
  const points = entry.zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  if (points.length < 3) return '';
  const center = boundsCenter(points);
  const bounds = boundsForPoints(points);
  const pad = Math.max(entry.majorAxisM * 0.025, 6);
  const rx = Math.max((bounds.maxX - bounds.minX) / 2 + pad, entry.majorAxisM * 0.18);
  const ry = Math.max((bounds.maxY - bounds.minY) / 2 + pad, entry.majorAxisM * 0.12);
  const envelope = Array.from({ length: 32 }, (_, index) => {
    const theta = (Math.PI * 2 * index) / 32;
    return { x: center.x + Math.cos(theta) * rx, y: center.y + Math.sin(theta) * ry };
  });
  const path = smoothClosedPath(envelope, transform);
  const color = entry.entryType === 'structure_confluence' ? CONFLUENCE : entry.colorHex;
  const className = entry.entryType === 'structure_confluence' ? 'water-reader-confluence-outline' : 'water-reader-neck-area-outline';
  return `<path class="${className}" d="${path}" fill="${color}" fill-opacity="0.34" stroke="${color}" stroke-width="1.2" stroke-opacity="0.86" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function visibleOrUnclippedRing(zone: WaterReaderDisplayZoneGeometry): RingM {
  return zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing;
}

function boundsCenter(points: PointM[]): PointM {
  const bounds = boundsForPoints(points);
  return { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
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

function wrapText(input: string, maxChars: number, maxLines: number): string[] {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    const base = lines[lines.length - 1]!.replace(/[.,;:]?$/, '').slice(0, Math.max(0, maxChars - 3)).trimEnd();
    lines[lines.length - 1] = `${base}...`;
  }
  return lines.length > 0 ? lines : [''];
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
