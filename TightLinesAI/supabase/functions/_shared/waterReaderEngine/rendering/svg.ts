import type { PointM, RingM } from '../contracts.ts';
import type { WaterReaderDisplayEntry, WaterReaderDisplayModel, WaterReaderDisplayZoneGeometry } from '../display-model.ts';
import { waterReaderLegendForbiddenPhraseHits } from '../legend.ts';
import { buildWaterReaderSvgTransform, format, svgPathForPolygon, svgPathForRing, svgPoint } from './transform.ts';
import type {
  WaterReaderLabelAnchor,
  WaterReaderProductionSvgOptions,
  WaterReaderProductionSvgResult,
  WaterReaderRenderSummary,
  WaterReaderRenderWarning,
  WaterReaderSvgTransform,
} from './types.ts';

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
const CENTER_LABEL_RADIUS = 10;
const CALLOUT_LABEL_RADIUS = 9;
const CENTER_LABEL_DIAMETER = CENTER_LABEL_RADIUS * 2;
const CALLOUT_LABEL_DIAMETER = CALLOUT_LABEL_RADIUS * 2;
const CALLOUT_MARGIN = 18;

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

  const labelPlans = buildLabelPlans(displayModel.displayedEntries, transform, warnings);
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
  if (entry.entryType === 'structure_confluence') {
    const members = entry.zones
      .map((zone) => {
        const ring = visibleOrUnclippedRing(zone);
        const path = svgPathForRing(ring, transform, true);
        return `<path class="water-reader-confluence-member" d="${path}" fill="${CONFLUENCE}" fill-opacity="0.24" stroke="${CONFLUENCE}" stroke-opacity="0.58" stroke-width="1.6"/>`;
      })
      .join('');
    const outline = confluenceOutline(entry, transform);
    if (!members && !outline) warnings.push({ code: 'missing_zone_path', message: 'Confluence member paths are empty.', entryId: entry.entryId });
    return {
      zoneMarkup: `<g class="water-reader-entry water-reader-confluence" data-entry-id="${escapeXml(entry.entryId)}" data-display-number="${number}" clip-path="url(#${clipId})">${members}${outline}</g>`,
      labelMarkup: numberLabel(plan),
    };
  }

  const zone = entry.zones[0];
  const d = zone ? svgPathForRing(zone.unclippedRing, transform, true) : '';
  if (!zone || !d) warnings.push({ code: 'missing_zone_path', message: 'Standalone zone path is empty.', entryId: entry.entryId, zoneId: entry.zoneIds[0] });
  return {
    zoneMarkup: `<path class="water-reader-entry water-reader-standalone-zone" data-entry-id="${escapeXml(entry.entryId)}" data-zone-id="${escapeXml(entry.zoneIds[0] ?? '')}" data-display-number="${number}" d="${d}" fill="${entry.colorHex}" fill-opacity="0.34" stroke="${entry.colorHex}" stroke-opacity="0.94" stroke-width="2.2"/>`,
    labelMarkup: numberLabel(plan),
  };
}

function numberLabel(plan: LabelPlan): string {
  const className = `water-reader-map-number water-reader-map-number-${plan.kind}${plan.callout ? ' water-reader-map-number-callout' : ''}`;
  const radius = plan.callout ? CALLOUT_LABEL_RADIUS : CENTER_LABEL_RADIUS;
  const leader = plan.callout
    ? `<path class="water-reader-label-leader" d="M ${format(plan.anchor.x)} ${format(plan.anchor.y)} L ${format(plan.label.x)} ${format(plan.label.y)}" fill="none" stroke="#334155" stroke-width="1" stroke-opacity="0.58" stroke-linecap="round"/>`
    : '';
  return `<g class="${className}" data-entry-id="${escapeXml(plan.entryId)}" data-display-number="${plan.displayNumber}" data-label-placement="${plan.callout ? 'callout' : 'center'}" filter="url(#wr-label-shadow)">
        ${leader}
        <circle cx="${format(plan.label.x)}" cy="${format(plan.label.y)}" r="${format(radius)}" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.15"/>
        <text x="${format(plan.label.x)}" y="${format(plan.label.y + 0.2)}" font-family="${FONT}" font-size="${plan.callout ? 10 : 10.5}" font-weight="850" fill="${TEXT}" text-anchor="middle" dominant-baseline="central">${plan.displayNumber}</text>
      </g>`;
}

function buildLabelPlans(
  entries: WaterReaderDisplayEntry[],
  transform: WaterReaderSvgTransform,
  warnings: WaterReaderRenderWarning[],
): LabelPlan[] {
  const placed: Bounds[] = [];
  return entries.map((entry, index) => {
    const kind = entry.entryType === 'structure_confluence' ? 'confluence' : 'standalone';
    const anchor = svgPoint(labelAnchor(entry, warnings).point, transform);
    const bounds = svgBoundsForEntry(entry, transform);
    const callout = shouldUseCallout(bounds);
    const label = callout ? calloutPoint(bounds, anchor, transform, placed, index) : anchor;
    const labelBounds = circleBounds(label, callout ? CALLOUT_LABEL_RADIUS : CENTER_LABEL_RADIUS);
    placed.push(labelBounds);
    return {
      entryId: entry.entryId,
      displayNumber: entry.displayNumber ?? '',
      kind,
      anchor,
      label,
      callout,
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
    callout: false,
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

function shouldUseCallout(bounds: Bounds): boolean {
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const minDim = Math.min(width, height);
  const bboxArea = width * height;
  const badgeArea = Math.PI * CENTER_LABEL_RADIUS * CENTER_LABEL_RADIUS;
  return CENTER_LABEL_DIAMETER / minDim > 0.72 || badgeArea / bboxArea > 0.36;
}

function calloutPoint(
  bounds: Bounds,
  anchor: PointM,
  transform: WaterReaderSvgTransform,
  placed: Bounds[],
  index: number,
): PointM {
  const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
  const candidates = [
    { x: bounds.maxX + CALLOUT_MARGIN, y: bounds.minY - CALLOUT_MARGIN },
    { x: bounds.maxX + CALLOUT_MARGIN, y: center.y },
    { x: bounds.maxX + CALLOUT_MARGIN, y: bounds.maxY + CALLOUT_MARGIN },
    { x: bounds.minX - CALLOUT_MARGIN, y: bounds.minY - CALLOUT_MARGIN },
    { x: bounds.minX - CALLOUT_MARGIN, y: center.y },
    { x: bounds.minX - CALLOUT_MARGIN, y: bounds.maxY + CALLOUT_MARGIN },
    { x: center.x, y: bounds.minY - CALLOUT_MARGIN },
    { x: center.x, y: bounds.maxY + CALLOUT_MARGIN },
  ];
  const rotated = [...candidates.slice(index % candidates.length), ...candidates.slice(0, index % candidates.length)];
  const clamped = rotated.map((point) => clampLabelPoint(point, transform));
  return clamped.find((point) => placed.every((other) => !boundsOverlap(circleBounds(point, CALLOUT_LABEL_RADIUS + 2), other))) ?? clampLabelPoint({ x: anchor.x + CALLOUT_MARGIN, y: anchor.y - CALLOUT_MARGIN }, transform);
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
    const titleLines = wrapText(`${entry.number}. ${entry.title}`, wrap.titleMaxChars, 2);
    const bodyLines = wrapText(entry.body, wrap.bodyMaxChars, 3);
    const warningLines = entry.transitionWarning ? wrapText(entry.transitionWarning, wrap.warningMaxChars, 2) : [];
    const color = entry.colorHex ?? '#334155';
    const rowHeight = 22 + bodyLines.length * 14 + warningLines.length * 13;
    rows.push(`<g class="water-reader-display-legend-entry" data-display-number="${entry.number}" transform="translate(${x} ${y})">
      <rect x="0" y="-13" width="${width}" height="${rowHeight}" rx="6" fill="#FFFFFF" stroke="#E2E8F0"/>
      <rect x="10" y="-4" width="10" height="10" rx="2" fill="${color}"/>
      ${titleLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${index * 14}" font-family="${FONT}" font-size="12" font-weight="800" fill="${TEXT}">${escapeXml(line)}</text>`).join('')}
      ${bodyLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${22 + index * 14}" font-family="${FONT}" font-size="10.5" fill="${MUTED}">${escapeXml(line)}</text>`).join('')}
      ${warningLines.map((line, index) => `<text x="${LEGEND_TEXT_OFFSET_X}" y="${22 + bodyLines.length * 14 + index * 13}" font-family="${FONT}" font-size="10" fill="#8A4B00">${escapeXml(line)}</text>`).join('')}
    </g>`);
    y += rowHeight + 8;
  }
  return `<g class="water-reader-legend">${rows.join('\n  ')}</g>`;
}

function estimateLegendHeight(displayModel: WaterReaderDisplayModel, mapWidth: number, padding: number): number {
  const wrap = legendWrapLimits(mapWidth - padding * 2);
  return 58 + displayModel.displayLegendEntries.reduce((sum, entry) => {
    const bodyLines = wrapText(entry.body, wrap.bodyMaxChars, 3).length;
    const warningLines = entry.transitionWarning ? wrapText(entry.transitionWarning, wrap.warningMaxChars, 2).length : 0;
    return sum + 30 + bodyLines * 14 + warningLines * 13;
  }, 0);
}

function legendWrapLimits(rowWidth: number): { titleMaxChars: number; bodyMaxChars: number; warningMaxChars: number } {
  const textWidth = Math.max(80, rowWidth - LEGEND_TEXT_OFFSET_X - LEGEND_RIGHT_PADDING);
  return {
    titleMaxChars: Math.min(LEGEND_TITLE_MAX_CHARS, Math.max(24, Math.floor(textWidth / 6.2))),
    bodyMaxChars: Math.min(LEGEND_BODY_MAX_CHARS, Math.max(34, Math.floor(textWidth / 5.4))),
    warningMaxChars: Math.min(LEGEND_WARNING_MAX_CHARS, Math.max(34, Math.floor(textWidth / 5.4))),
  };
}

function confluenceOutline(entry: WaterReaderDisplayEntry, transform: WaterReaderSvgTransform): string {
  const points = entry.zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  if (points.length < 3) return '';
  const center = boundsCenter(points);
  const sorted = [...points].sort((a, b) => Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x));
  const sampleCount = Math.min(18, Math.max(8, sorted.length));
  const sampled = Array.from({ length: sampleCount }, (_, index) => sorted[Math.floor((index / sampleCount) * sorted.length)]!);
  const expanded = sampled.map((point) => {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    const len = Math.hypot(dx, dy) || 1;
    const pad = Math.max(entry.majorAxisM * 0.04, 8);
    return { x: point.x + (dx / len) * pad, y: point.y + (dy / len) * pad };
  });
  const path = smoothClosedPath(expanded, transform);
  return `<path class="water-reader-confluence-outline" d="${path}" fill="none" stroke="${CONFLUENCE}" stroke-width="3" stroke-opacity="0.86" stroke-linecap="round" stroke-linejoin="round"/>`;
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
