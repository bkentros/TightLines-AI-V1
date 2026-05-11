/**
 * water-reader-paperify-svg
 *
 * Client-side post-processor that turns the engine's launch-skin Water Read
 * SVG into a finished FinFindr field-guide plate. Three responsibilities:
 *
 *   1. **Recolor** the launch palette into the paper-warm vocabulary (every
 *      hex from the spec → its paper counterpart). Keeps cached pre-bump
 *      rows looking right too, so the user never sees a gray-blue legacy
 *      skin even on a cache hit.
 *   2. **Texture the zones.** Each feature class gets its own SVG `<pattern>`
 *      stamp (dots, hatch, waves, chevrons, bricks, rings, …). The pattern
 *      bakes in the base color AND a darker motif on top, so every fishing
 *      zone reads with both its color identity AND a learnable secondary
 *      texture. Color stays primary; texture adds character without
 *      compromising legibility.
 *   3. **Brand the surroundings as FinFindr.** The land plane gets a warm
 *      tan tint with a faint topographic-contour pattern. Corner wordmarks,
 *      a bottom colophon strip, and edge-tick marks are stamped into the
 *      SVG itself — clipped to the land area via `clip-path` keyed off the
 *      lake's outer ring, so the lake polygon is *mathematically incapable*
 *      of covering them. Every screenshot ships with FinFindr identity
 *      baked into the image.
 *
 * The transformation is structural — the engine emits stable CSS classes
 * (`water-reader-lake`, `water-reader-zones`, `water-reader-legend`, etc.)
 * and stable inline color attributes from a known palette, so a small
 * regex/string-replace pipeline is robust here. We never touch geometry, the
 * clip path, callout placement, or any data attributes.
 *
 * Pure: no React imports — only `paper` tokens from theme so the decoration
 * defs read from one source of truth.
 */

import {
  paper,
  scoreAccentColor,
} from './theme';
import {
  PAPER_WARM_FEATURE_COLORS,
  PAPER_WARM_FEATURE_MOTIF_COLORS,
  type PaperWarmFeatureKey,
} from './waterReaderZonePaperPalette';

// Land plane — warm cartographic tan + faint contour-line texture. Shifted
// in scan-v5 from a flat off-white to a tan tint so the land/water
// distinction reads at a glance and the lake gradient pops harder.
const LAND_BASE = '#EFE4C8';
const LAND_CONTOUR_INK = 'rgba(58, 46, 34, 0.18)';
const LAND_TONE_DARK = 'rgba(58, 46, 34, 0.06)';

// Lake water gradient — top→middle→bottom. Cool sky blues that read
// unmistakably as water and contrast cleanly against the new tan land.
const SCAN_WATER_TOP = '#D9F1FB';
const SCAN_WATER_MID = '#BFE4F3';
const SCAN_WATER_BOTTOM = '#9FD2E7';

// Brand band ink (used by corner stamps + bottom colophon). Slightly muted
// from `paper.dashboardInk` so the brand reads as etched into the paper
// rather than printed on top.
const BRAND_INK = '#1C2419';
const BRAND_MUTED = 'rgba(28, 36, 25, 0.55)';

// ── Engine SVG color constants (mirror rendering/svg.ts) ────────────────────
const ENGINE_BACKDROP = '#F7FAFC';
const ENGINE_WATER_FILL = '#CFE6F7';
const ENGINE_WATER_STROKE = '#275D7F';
const PAPER_V4_WATER_FILL = '#DCE7DD';
const PAPER_V4_WATER_STROKE = '#1C2419';
const ENGINE_TEXT = '#0F172A';
const ENGINE_MUTED = '#475569';
const ENGINE_CALLOUT_LEADER = '#334155';
const ENGINE_LEGEND_DEFAULT = '#334155';

// Spec-locked feature hues that may still appear in pre-bump cached rows.
const ENGINE_FEATURE_COLORS: Record<PaperWarmFeatureKey, string> = {
  main_lake_point: '#1E5FBF',
  secondary_point: '#6FA8DC',
  cove: '#2E8B57',
  neck: '#E67E22',
  island: '#8E44AD',
  saddle: '#1ABC9C',
  dam: '#C0392B',
  structure_confluence: '#D946EF',
  universal: '#D4A017',
};

/**
 * Every prior paper-warm value the client has shipped, indexed by feature.
 * The paperify color rewrite has to cover ALL of these so cached SVGs
 * generated under any previous palette pass land on the latest hue.
 */
const PRIOR_PAPER_WARM_VALUES: Record<PaperWarmFeatureKey, string[]> = {
  main_lake_point: ['#2E4A2A', '#366D33', '#2A6E96'],
  secondary_point: ['#5B7A3E', '#7C9D4F', '#8FB85B', '#7CB8DA'],
  cove: ['#B87818', '#C68522', '#D4922A', '#3DA85F'],
  neck: ['#CC6A22', '#DD7430', '#D4AF37'],
  island: ['#3A2E22', '#5A4030', '#5E7FA3'],
  saddle: ['#357A6F', '#3F8B80', '#4DAA9C', '#37A7A1'],
  dam: ['#C8352C', '#D74033', '#7A8A99'],
  structure_confluence: ['#7A3A52', '#8C3F60', '#A04970', '#8E78B8'],
  universal: ['#E8A02E', '#F2AC34', '#E8C547'],
};

// Marker comment indicating this SVG was already paperified — guards against
// double-running and against accidentally mutating an SVG that the server-side
// renderer has already painted in paper colors. Scan-v5 introduces zone
// patterns + tan land + in-SVG brand, so cached v4 rows are repainted.
const PAPERIFIED_SENTINEL = '<!-- wr-finfindr-scan-v5 -->';

// Pattern id helper — stable strings keyed off feature class.
const zonePatternId = (key: PaperWarmFeatureKey) => `wr-zone-pattern-${key}`;

export interface WaterReaderPaperifyOptions {
  /**
   * Drop the embedded `<g class="water-reader-legend">…</g>` panel (we render
   * a paper-language legend in React). Default true.
   */
  stripEmbeddedLegend?: boolean;
  /**
   * Drop the bottom "FinFindr Water Reader" + season subtitle text nodes
   * (we own the page footer). Default true.
   */
  stripBottomCredit?: boolean;
  /**
   * Drop the full-bleed backdrop rect so the host paper card shows through
   * the SVG canvas. Default true.
   */
  stripBackdrop?: boolean;
  /**
   * Optional lake name etched into the bottom colophon strip in-SVG.
   * Falls back to "WATER READ" if omitted.
   */
  lakeName?: string;
}

const DEFAULTS: Required<Omit<WaterReaderPaperifyOptions, 'lakeName'>> & {
  lakeName: string | null;
} = {
  stripEmbeddedLegend: true,
  stripBottomCredit: true,
  stripBackdrop: true,
  lakeName: null,
};

/**
 * Returns a paper-themed SVG string and a small report of what was changed
 * (handy for diagnostics + a one-time smoke check).
 */
export function paperifyWaterReaderSvg(
  raw: string,
  options: WaterReaderPaperifyOptions = {},
): { svg: string; changedCount: number; alreadyPaperified: boolean } {
  if (!raw) return { svg: raw, changedCount: 0, alreadyPaperified: false };
  if (raw.includes(PAPERIFIED_SENTINEL)) {
    return { svg: raw, changedCount: 0, alreadyPaperified: true };
  }
  const opts = { ...DEFAULTS, ...options };

  let svg = raw;
  let changes = 0;
  const tally = (before: string, after: string) => {
    if (before === after) return;
    changes += 1;
  };

  // Strip prior-pass scaffolding so we don't double-stack defs / surfaces.
  const beforeCleanup = svg;
  svg = svg
    .replace(/<!-- wr-paperified -->\s*/g, '')
    .replace(/<!-- wr-finfindr-scan-v[1234] -->\s*/g, '')
    .replace(/<rect[^>]*class="wr-scan-surface"[^>]*\/>\s*/g, '')
    .replace(/<rect[^>]*class="wr-scan-grid"[^>]*\/>\s*/g, '')
    .replace(/<g[^>]*class="wr-brand-stamp"[\s\S]*?<\/g>\s*/g, '')
    .replace(/\s*<linearGradient id="wr-lake-gradient"[\s\S]*?<\/linearGradient>/g, '')
    .replace(/\s*<filter id="wr-lake-depth"[\s\S]*?<\/filter>/g, '')
    .replace(/\s*<filter id="wr-callout-pop"[\s\S]*?<\/filter>/g, '')
    .replace(/\s*<pattern id="wr-scan-grid"[\s\S]*?<\/pattern>/g, '')
    .replace(/\s*<pattern id="wr-land-contour"[\s\S]*?<\/pattern>/g, '')
    .replace(/\s*<pattern id="wr-zone-pattern-[a-z_]+"[\s\S]*?<\/pattern>/g, '')
    .replace(/\s*<clipPath id="wr-land-clip"[\s\S]*?<\/clipPath>/g, '');
  tally(beforeCleanup, svg);

  // 1) Strip the embedded "Map Key" legend group.
  if (opts.stripEmbeddedLegend) {
    const next = svg.replace(
      /<g class="water-reader-legend">[\s\S]*?<\/g>\s*/m,
      '',
    );
    tally(svg, next);
    svg = next;
  }

  // 2) Strip the bottom credit text nodes ("FinFindr Water Reader" + the
  //    season/county subtitle on the right). We render our own colophon.
  if (opts.stripBottomCredit) {
    const beforeCredit = svg;
    svg = svg.replace(
      /<text[^>]*>FinFindr Water Reader<\/text>\s*/g,
      '',
    );
    svg = svg.replace(
      /<text[^>]*text-anchor="end"[^>]*>[^<]+<\/text>\s*(?=<\/svg>)/,
      '',
    );
    tally(beforeCredit, svg);
  }

  // 3) Backdrop rect — strip any engine/emitted full-canvas backdrop.
  if (opts.stripBackdrop) {
    const before = svg;
    svg = svg.replace(
      /<rect[^>]*width="100%"[^>]*height="100%"[^>]*fill="(?:#F7FAFC|#F0E8D4|#F6F7F5)"[^>]*\/>\s*/gi,
      '',
    );
    tally(before, svg);
  } else {
    const before = svg;
    svg = svg.replace(/fill="#F7FAFC"/g, `fill="${paper.dashboardCream}"`);
    tally(before, svg);
  }

  // 4) Lake fill + stroke + island land plate.
  //
  //    The engine emits the lake as a SINGLE path with `fill-rule="evenodd"`
  //    so islands appear as cutouts. Without intervention the cutout shows
  //    through to whatever sits behind. We:
  //      a. Inject a SECOND path BEFORE the lake path, filled with the tan
  //         land color, using just the OUTER ring of the lake `d` so islands
  //         show through as land (not lake, not paper).
  //      b. Swap the flat water fill for the vertical blue gradient.
  //      c. Restroke the shoreline in ink, slightly bolder.
  //      d. Apply the soft drop-shadow filter so the lake sits on the paper.
  //
  //    We also EXTRACT the outer ring `d` and stash it in `outerRingD` so
  //    we can build a `clipPath` later — used to clip our brand marks to
  //    the LAND area so the lake polygon literally cannot cover them.
  const before4 = svg;
  let outerRingD: string | null = null;

  const lakeMatch = svg.match(
    /<path[^>]*class="water-reader-lake"[^>]*?d="([^"]+)"[^>]*?\/?>/,
  );
  if (lakeMatch) {
    const fullLakeTag = lakeMatch[0];
    const dAttr = lakeMatch[1];
    const subPaths = dAttr.split(/Z/i).map((p) => p.trim()).filter(Boolean);
    if (subPaths.length > 0 && subPaths[0].startsWith('M')) {
      outerRingD = `${subPaths[0]} Z`;
      // Land plate sits behind the lake — same z-order as the engine's
      // backdrop rect (which we strip) — so zones render on top of it.
      // A second hairline contour traces the shoreline on the LAND side
      // (subtle inner ring ~3px out) for a cartographic shore-glow feel.
      const landPlate = `<path d="${outerRingD}" fill="${LAND_BASE}" stroke="none" class="wr-island-land" pointer-events="none"/>`;
      if (!svg.includes('class="wr-island-land"')) {
        svg = svg.replace(fullLakeTag, `${landPlate}\n  ${fullLakeTag}`);
      }
    }
  }

  svg = svg.split(`fill="${ENGINE_WATER_FILL}"`).join(`fill="url(#wr-lake-gradient)"`);
  svg = svg.split(`fill="${PAPER_V4_WATER_FILL}"`).join(`fill="url(#wr-lake-gradient)"`);
  svg = svg.replace(
    /<path([^>]*class="wr-island-land"[^>]*)>/g,
    (match, attrs: string) => {
      if (!match.includes('fill=')) return `<path${attrs} fill="${LAND_BASE}">`;
      return `<path${attrs.replace(/fill="[^"]*"/, `fill="${LAND_BASE}"`)}>`;
    },
  );
  svg = svg.split(`stroke="${ENGINE_WATER_STROKE}"`).join(`stroke="${BRAND_INK}"`);
  svg = svg.split(`stroke="${PAPER_V4_WATER_STROKE}"`).join(`stroke="${BRAND_INK}"`);
  svg = svg.replace(
    /(class="water-reader-lake"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"1.55"`,
  );
  if (!/class="water-reader-lake"[^>]*filter=/.test(svg)) {
    svg = svg.replace(
      /(<path[^>]*class="water-reader-lake"[^>]*?)(\/?>)/,
      `$1 filter="url(#wr-lake-depth)"$2`,
    );
  }
  tally(before4, svg);

  // 5) Callout leader stroke — recolor to ink and quiet the line. Pass-5
  //    drops opacity further (0.42 → 0.32) and tightens the dash so leaders
  //    read as quiet pencil ticks rather than UI strokes.
  const before5 = svg;
  svg = svg.split(`stroke="${ENGINE_CALLOUT_LEADER}"`).join(`stroke="${BRAND_INK}"`);
  svg = svg.replace(
    /(class="water-reader-label-leader"[^>]*?stroke-opacity=)"[^"]*"/g,
    `$1"0.32"`,
  );
  svg = svg.replace(
    /(class="water-reader-label-leader"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"0.7"`,
  );
  svg = svg.replace(
    /<path class="water-reader-label-leader"([^>]*)>/g,
    (match, attrs: string) => {
      if (attrs.includes('stroke-dasharray')) return match;
      if (/\s*\/$/.test(attrs)) {
        const nextAttrs = attrs.replace(/\s*\/$/, '');
        return `<path class="water-reader-label-leader"${nextAttrs} stroke-dasharray="3 2.4"/>`;
      }
      return `<path class="water-reader-label-leader"${attrs} stroke-dasharray="3 2.4">`;
    },
  );
  tally(before5, svg);

  // 6) Number-callout badges — paper-light fill, ink stroke + ink digit.
  //    Pass-5 trims the ring (8.6 → 7.6) so callouts stay out of the way
  //    of zone interiors. Digits stay at 12.5px so they're still readable.
  const before6 = svg;
  svg = svg.replace(
    /(<circle[^>]*?)fill="#FFFFFF"([^>]*?)stroke="#0F172A"/g,
    `$1fill="${paper.dashboardWhite}"$2stroke="${BRAND_INK}"`,
  );
  svg = svg.replace(
    /(<circle[^>]*?)fill="#F8F1DD"([^>]*?)stroke="#1C2419"/g,
    `$1fill="${paper.dashboardWhite}"$2stroke="${BRAND_INK}"`,
  );
  svg = svg.replace(
    /(<circle[^>]*?)r="7\.5"/g,
    `$1r="7.6"`,
  );
  svg = svg.replace(
    /(<circle[^>]*?)r="8\.6"/g,
    `$1r="7.6"`,
  );
  svg = svg.replace(
    /(<circle[^>]*?stroke=")[^"]*("[^>]*?stroke-width=")[^"]*(")/g,
    (_match, p1, p2, p3) => `${p1}${BRAND_INK}${p2}1.15${p3}`,
  );
  svg = svg.split(`fill="${ENGINE_TEXT}"`).join(`fill="${BRAND_INK}"`);
  svg = svg.split(`fill="${PAPER_V4_WATER_STROKE}"`).join(`fill="${BRAND_INK}"`);
  svg = svg.replace(
    /(<text[^>]*?font-size=")[^"]*("[^>]*?text-anchor="middle"[^>]*?dominant-baseline="middle"[^>]*?>)/g,
    `$1${'12.5'}$2`,
  );
  svg = svg.split(`fill="${ENGINE_MUTED}"`).join(`fill="${paper.dashboardMuted}"`);
  svg = svg
    .split(`fill="rgba(28,36,25,0.55)"`)
    .join(`fill="${paper.dashboardMuted}"`);
  tally(before6, svg);

  // 7) Feature zone fill-opacity + stroke-opacity bumps — same as v4. The
  //    pattern fill (added in step 8) inherits these opacities, which is
  //    exactly what we want: the texture mixes with whatever's behind so
  //    lake water still bleeds gently through low-opacity confluence
  //    members for layered depth.
  const before7opacity = svg;
  svg = svg.replace(
    /(class="water-reader-entry water-reader-standalone-zone"[^>]*?fill-opacity=)"[^"]*"/g,
    `$1"0.78"`,
  );
  svg = svg.replace(
    /(class="water-reader-entry water-reader-confluence"[^>]*?fill-opacity=)"[^"]*"/g,
    `$1"0.68"`,
  );
  svg = svg.replace(/fill-opacity="0\.42"/g, `fill-opacity="0.78"`);
  svg = svg.replace(/fill-opacity="0\.4"/g, `fill-opacity="0.68"`);
  svg = svg.replace(/fill-opacity="0\.5"/g, `fill-opacity="0.78"`);
  svg = svg.replace(/fill-opacity="0\.46"/g, `fill-opacity="0.68"`);
  svg = svg.replace(/stroke-opacity="0\.16"/g, `stroke-opacity="0.55"`);
  svg = svg.replace(/stroke-opacity="0\.14"/g, `stroke-opacity="0.55"`);
  svg = svg.replace(/stroke-opacity="0\.22"/g, `stroke-opacity="0.55"`);
  svg = svg.replace(
    /(<path[^>]*class="water-reader-entry[^"]*"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"1.15"`,
  );
  svg = svg.replace(/stroke-width="0\.6"/g, `stroke-width="1.0"`);
  tally(before7opacity, svg);

  // 8) Feature zone colors → patterns.
  //
  //    First, recolor every spec/legacy hex to the LATEST paper-warm value
  //    (so legend swatches and zone fills stay in sync). Then, in a second
  //    pass, swap each `fill="<paper-warm>"` to `fill="url(#wr-zone-pattern-{key})"`
  //    so the zone renders with its color AND its motif. Strokes stay on
  //    the flat hex so the zone outline reads cleanly without the pattern
  //    interfering with the edge.
  for (const key of Object.keys(ENGINE_FEATURE_COLORS) as PaperWarmFeatureKey[]) {
    const to = PAPER_WARM_FEATURE_COLORS[key];
    const fromValues = [
      ENGINE_FEATURE_COLORS[key],
      ...PRIOR_PAPER_WARM_VALUES[key],
    ];
    for (const fromRaw of fromValues) {
      const candidates = [fromRaw, fromRaw.toUpperCase(), fromRaw.toLowerCase()];
      for (const from of candidates) {
        if (from === to) continue;
        const before = svg;
        svg = svg.split(`fill="${from}"`).join(`fill="${to}"`);
        svg = svg.split(`stroke="${from}"`).join(`stroke="${to}"`);
        tally(before, svg);
      }
    }
  }

  // Now apply the pattern overlay. We swap the FILL only — the stroke keeps
  // the solid color so each zone has a clean ink outline. The pattern
  // background rect IS the base color, so we don't lose color identity.
  const before8 = svg;
  for (const key of Object.keys(PAPER_WARM_FEATURE_COLORS) as PaperWarmFeatureKey[]) {
    const baseHex = PAPER_WARM_FEATURE_COLORS[key];
    const patternUrl = `url(#${zonePatternId(key)})`;
    // Only swap fill on water-reader-entry paths/groups. To stay regex-safe
    // we restrict to lines that include the `water-reader-entry` token
    // somewhere in the tag.
    const re = new RegExp(
      `(<(?:path|g)[^>]*class="[^"]*water-reader-entry[^"]*"[^>]*?)fill="${baseHex}"`,
      'gi',
    );
    svg = svg.replace(re, `$1fill="${patternUrl}"`);
    // Also handle confluence-member paths, which carry the confluence
    // pattern even when emitted inside a confluence <g>.
    if (key === 'structure_confluence') {
      const reMember = new RegExp(
        `(<path[^>]*class="[^"]*water-reader-confluence-member[^"]*"[^>]*?)fill="${baseHex}"`,
        'gi',
      );
      svg = svg.replace(reMember, `$1fill="${patternUrl}"`);
    }
  }
  tally(before8, svg);

  // 9) Default legend fallback color (#334155) → ink (relevant only if the
  //    legend strip is disabled in some debug context).
  svg = svg.split(`fill="${ENGINE_LEGEND_DEFAULT}"`).join(`fill="${BRAND_INK}"`);

  // 10) Font swap — Inter as the in-SVG UI face for product continuity.
  const before10 = svg;
  svg = svg.replace(
    /font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"/g,
    `font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"`,
  );
  tally(before10, svg);

  // 11) Drop-shadow filter on number labels — flood-color → ink.
  const before11 = svg;
  svg = svg.replace(
    /flood-color="#0F172A"/g,
    `flood-color="${BRAND_INK}"`,
  );
  tally(before11, svg);

  // 12) FinFindr decoration block — defs (gradients, filters, patterns,
  //     clipPath). Inserted into the engine's existing <defs> so all our
  //     `url(#...)` references resolve.
  const before12 = svg;
  const decorationDefs = buildDecorationDefs(outerRingD);
  if (svg.includes('</defs>')) {
    svg = svg.replace('</defs>', `${decorationDefs}\n  </defs>`);
  } else {
    svg = svg.replace('<svg ', `<svg defs-injected="true" `);
    svg = svg.replace(/(<svg[^>]*>)/, `$1\n  <defs>${decorationDefs}\n  </defs>`);
  }
  tally(before12, svg);

  // 13) Land surface — tan field + faint topographic contour pattern + a
  //     barely-visible dot grid. Layered so the surface has texture without
  //     pulling attention from the lake.
  const before13 = svg;
  if (!svg.includes('class="wr-scan-surface"')) {
    svg = svg.replace(
      /(<svg[^>]*>)/,
      `$1
  <rect class="wr-scan-surface" width="100%" height="100%" fill="${LAND_BASE}"/>
  <rect class="wr-scan-grid" width="100%" height="100%" fill="url(#wr-land-contour)" opacity="0.65"/>
  <rect class="wr-scan-grid" width="100%" height="100%" fill="url(#wr-scan-grid)" opacity="0.16"/>`,
    );
  }
  tally(before13, svg);

  // 14) FinFindr brand stamp — wordmark in the top-right of the viewBox,
  //     edition stamp in the bottom-right, and a slim colophon strip along
  //     the bottom edge. ALL clipped to the land area via `wr-land-clip`,
  //     so the lake polygon literally cannot cover them.
  //
  //     We render them at viewBox-px sizes (engine viewBox is ~1100×900 for
  //     a typical lake; brand text is sized for that scale and shrinks
  //     proportionally on smaller plates).
  const before14 = svg;
  const viewBoxMatch = svg.match(/viewBox="0\s+0\s+([\d.]+)\s+([\d.]+)"/);
  if (viewBoxMatch && !svg.includes('class="wr-brand-stamp"')) {
    const vbW = parseFloat(viewBoxMatch[1]);
    const vbH = parseFloat(viewBoxMatch[2]);
    const lakeName = (opts.lakeName ?? '').trim().toUpperCase() || 'WATER READ';
    const brandStamp = buildBrandStamp(vbW, vbH, lakeName, !!outerRingD);
    // Insert the brand stamp BEFORE the closing </svg> so it sits on top
    // of the land/lake but inside the land clip.
    svg = svg.replace('</svg>', `${brandStamp}\n</svg>`);
  }
  tally(before14, svg);

  // Mark the SVG paperified so we no-op on a re-run.
  svg = svg.replace('<svg ', `${PAPERIFIED_SENTINEL}\n<svg `);

  // We never want scoreAccentColor unused — referenced once to suppress
  // the unused-export lint while keeping it available to consumers.
  void scoreAccentColor;

  return { svg, changedCount: changes, alreadyPaperified: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// Decoration builders — all pure string concatenation. Returned snippets are
// inserted into the engine SVG in the exact order they appear here, and each
// one is keyed to a stable id so the rest of paperify can reference them.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defs injected into the engine SVG: lake gradient, lake depth shadow,
 * callout pop filter, scan grid, land contour pattern, per-feature zone
 * patterns, and the land clipPath (built from the lake outer ring so brand
 * marks can be clipped to the land area).
 */
function buildDecorationDefs(outerRingD: string | null): string {
  return `
    <linearGradient id="wr-lake-gradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="${SCAN_WATER_TOP}"/>
      <stop offset="52%" stop-color="${SCAN_WATER_MID}"/>
      <stop offset="100%" stop-color="${SCAN_WATER_BOTTOM}"/>
    </linearGradient>
    <filter id="wr-lake-depth" x="-6%" y="-6%" width="112%" height="112%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="${BRAND_INK}" flood-opacity="0.16"/>
    </filter>
    <filter id="wr-callout-pop" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.2"/>
      <feOffset dx="0" dy="0.8"/>
      <feFlood flood-color="${BRAND_INK}" flood-opacity="0.18"/>
      <feComposite in2="SourceAlpha" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <pattern id="wr-scan-grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M 34 0 L 0 0 0 34" fill="none" stroke="${LAND_TONE_DARK}" stroke-width="0.5"/>
      <circle cx="0" cy="0" r="0.9" fill="${LAND_TONE_DARK}"/>
    </pattern>
    <pattern id="wr-land-contour" width="60" height="22" patternUnits="userSpaceOnUse">
      <path d="M 0 11 Q 15 4 30 11 T 60 11" fill="none" stroke="${LAND_CONTOUR_INK}" stroke-width="0.6"/>
      <path d="M 0 22 Q 15 15 30 22 T 60 22" fill="none" stroke="${LAND_CONTOUR_INK}" stroke-width="0.6" opacity="0.55"/>
    </pattern>
    ${buildZonePatterns()}
    ${outerRingD ? buildLandClipPath(outerRingD) : ''}`;
}

/**
 * Per-feature zone patterns. Each pattern is a small tile (12–20 px) that
 * fills the zone with the base color AND stamps a darker motif on top.
 *
 *   point        → dotted constellation (small circles)
 *   secondary    → diagonal hatch (45° lines)
 *   cove         → wavy lines (sinusoidal)
 *   neck         → vertical bars (narrow stripes)
 *   island       → cross-hatch (diagonal grid)
 *   saddle       → chevrons (zig-zag)
 *   dam          → bricks (offset rectangles)
 *   confluence   → concentric rings (target)
 *   universal    → open dots (sparse light dots)
 *
 * Each motif color is `PAPER_WARM_FEATURE_MOTIF_COLORS[key]` — a darker /
 * desaturated cousin of the base hue so the pattern reads as ink-on-color
 * rather than competing with the base. Motifs use the user-space pattern
 * unit so they DON'T scale with the zone — every zone shares the same
 * "stamp size" regardless of how big or small the polygon is.
 */
function buildZonePatterns(): string {
  const motif = PAPER_WARM_FEATURE_MOTIF_COLORS;
  const base = PAPER_WARM_FEATURE_COLORS;

  return `
    <pattern id="${zonePatternId('main_lake_point')}" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill="${base.main_lake_point}"/>
      <circle cx="3" cy="3" r="1.3" fill="${motif.main_lake_point}"/>
      <circle cx="9" cy="9" r="1.3" fill="${motif.main_lake_point}"/>
      <circle cx="3" cy="9" r="0.7" fill="${motif.main_lake_point}" opacity="0.6"/>
      <circle cx="9" cy="3" r="0.7" fill="${motif.main_lake_point}" opacity="0.6"/>
    </pattern>
    <pattern id="${zonePatternId('secondary_point')}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="10" height="10" fill="${base.secondary_point}"/>
      <line x1="0" y1="2" x2="10" y2="2" stroke="${motif.secondary_point}" stroke-width="1.2"/>
      <line x1="0" y1="6" x2="10" y2="6" stroke="${motif.secondary_point}" stroke-width="0.7" opacity="0.7"/>
    </pattern>
    <pattern id="${zonePatternId('cove')}" width="18" height="10" patternUnits="userSpaceOnUse">
      <rect width="18" height="10" fill="${base.cove}"/>
      <path d="M 0 5 Q 4.5 1 9 5 T 18 5" fill="none" stroke="${motif.cove}" stroke-width="0.9"/>
      <path d="M 0 9 Q 4.5 5 9 9 T 18 9" fill="none" stroke="${motif.cove}" stroke-width="0.7" opacity="0.6"/>
    </pattern>
    <pattern id="${zonePatternId('neck')}" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="${base.neck}"/>
      <line x1="2" y1="0" x2="2" y2="10" stroke="${motif.neck}" stroke-width="1.4"/>
      <line x1="6" y1="0" x2="6" y2="10" stroke="${motif.neck}" stroke-width="0.7" opacity="0.65"/>
    </pattern>
    <pattern id="${zonePatternId('island')}" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="${base.island}"/>
      <line x1="0" y1="0" x2="10" y2="10" stroke="${motif.island}" stroke-width="0.9"/>
      <line x1="10" y1="0" x2="0" y2="10" stroke="${motif.island}" stroke-width="0.9"/>
    </pattern>
    <pattern id="${zonePatternId('saddle')}" width="14" height="10" patternUnits="userSpaceOnUse">
      <rect width="14" height="10" fill="${base.saddle}"/>
      <path d="M 0 8 L 3.5 3 L 7 8 L 10.5 3 L 14 8" fill="none" stroke="${motif.saddle}" stroke-width="1"/>
    </pattern>
    <pattern id="${zonePatternId('dam')}" width="14" height="10" patternUnits="userSpaceOnUse">
      <rect width="14" height="10" fill="${base.dam}"/>
      <rect x="0.6" y="0.6" width="6" height="3.4" fill="none" stroke="${motif.dam}" stroke-width="0.9"/>
      <rect x="7.4" y="0.6" width="6" height="3.4" fill="none" stroke="${motif.dam}" stroke-width="0.9"/>
      <rect x="-2.6" y="5.4" width="6" height="3.4" fill="none" stroke="${motif.dam}" stroke-width="0.9"/>
      <rect x="4.2" y="5.4" width="6" height="3.4" fill="none" stroke="${motif.dam}" stroke-width="0.9"/>
      <rect x="11" y="5.4" width="6" height="3.4" fill="none" stroke="${motif.dam}" stroke-width="0.9"/>
    </pattern>
    <pattern id="${zonePatternId('structure_confluence')}" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect width="16" height="16" fill="${base.structure_confluence}"/>
      <circle cx="8" cy="8" r="5" fill="none" stroke="${motif.structure_confluence}" stroke-width="0.9"/>
      <circle cx="8" cy="8" r="2.5" fill="none" stroke="${motif.structure_confluence}" stroke-width="0.7" opacity="0.7"/>
      <circle cx="8" cy="8" r="0.9" fill="${motif.structure_confluence}"/>
    </pattern>
    <pattern id="${zonePatternId('universal')}" width="14" height="14" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="${base.universal}"/>
      <circle cx="3.5" cy="3.5" r="0.95" fill="none" stroke="${motif.universal}" stroke-width="0.7"/>
      <circle cx="10.5" cy="10.5" r="0.95" fill="none" stroke="${motif.universal}" stroke-width="0.7"/>
    </pattern>`;
}

/**
 * Build a clipPath whose drawable area is "everywhere in the viewBox EXCEPT
 * inside the lake outer ring". Achieved by combining a viewBox-sized rect
 * with the lake outer ring under `clip-rule="evenodd"`. Anything inside the
 * clip — i.e. our brand marks — is guaranteed to render only on land.
 *
 * NOTE: `outerRingD` is the lake's OUTER subpath only (no island holes),
 * so islands are *also* land for clipping purposes — exactly right.
 */
function buildLandClipPath(outerRingD: string): string {
  return `
    <clipPath id="wr-land-clip" clipPathUnits="userSpaceOnUse">
      <path d="M 0 0 H 100000 V 100000 H 0 Z ${outerRingD}" clip-rule="evenodd" fill-rule="evenodd"/>
    </clipPath>`;
}

/**
 * In-SVG FinFindr brand stamp — clipped to land if a clip is available.
 *
 *   • Top-right wordmark with a small ink underline.
 *   • Bottom-right edition stamp ("EDITION 01 · FINFINDR").
 *   • Slim bottom-edge colophon: "FINFINDR · WATER READ · {LAKE}" in
 *     JetBrains Mono Bold, etched in muted ink.
 *
 * If no land clip is available (the lake path couldn't be parsed for some
 * reason), we still render the brand but unclipped — the brand mark sits
 * in the OUTER margins of the viewBox where lakes don't typically reach.
 */
function buildBrandStamp(
  vbW: number,
  vbH: number,
  lakeName: string,
  hasLandClip: boolean,
): string {
  const clipAttr = hasLandClip ? ' clip-path="url(#wr-land-clip)"' : '';

  // Sizing scales gently with viewBox so brand reads well on tall vs. wide lakes.
  const wordmarkSize = Math.max(10, Math.min(15, vbW * 0.014));
  const editionSize = Math.max(6.8, Math.min(9, vbW * 0.0085));
  const colophonSize = Math.max(7.4, Math.min(9.6, vbW * 0.009));

  // Anchors — keep marks inside a 14 px margin from the viewBox edges so
  // they sit just inboard of the host plate's frame.
  const margin = 14;
  const topY = margin + wordmarkSize;
  const wordmarkX = vbW - margin;
  const editionX = vbW - margin;
  const editionY = vbH - margin - editionSize - 2;
  const colophonY = vbH - 5;

  // Faint corner brackets, rendered at viewBox corners on the land plane —
  // a tiny "field-guide" detail that brands the export without a logo.
  const bracketLen = Math.max(14, vbW * 0.018);
  const bracketStroke = 'rgba(28,36,25,0.42)';
  const bracketWidth = 1.1;
  const corners = `
    <path d="M ${margin} ${margin + bracketLen} L ${margin} ${margin} L ${margin + bracketLen} ${margin}" fill="none" stroke="${bracketStroke}" stroke-width="${bracketWidth}"/>
    <path d="M ${vbW - margin - bracketLen} ${margin} L ${vbW - margin} ${margin} L ${vbW - margin} ${margin + bracketLen}" fill="none" stroke="${bracketStroke}" stroke-width="${bracketWidth}"/>
    <path d="M ${margin} ${vbH - margin - bracketLen} L ${margin} ${vbH - margin} L ${margin + bracketLen} ${vbH - margin}" fill="none" stroke="${bracketStroke}" stroke-width="${bracketWidth}"/>
    <path d="M ${vbW - margin - bracketLen} ${vbH - margin} L ${vbW - margin} ${vbH - margin} L ${vbW - margin} ${vbH - margin - bracketLen}" fill="none" stroke="${bracketStroke}" stroke-width="${bracketWidth}"/>`;

  // Wordmark top-right (right-anchored).
  const wordmark = `
    <text x="${wordmarkX}" y="${topY}" font-family="Fraunces, Inter, -apple-system, sans-serif" font-weight="700" font-size="${wordmarkSize.toFixed(2)}" fill="${BRAND_INK}" text-anchor="end" letter-spacing="0">FinFindr<tspan fill="${paper.dashboardBlue}">.</tspan></text>
    <text x="${wordmarkX}" y="${topY + editionSize + 2}" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="${editionSize.toFixed(2)}" fill="${BRAND_MUTED}" text-anchor="end" letter-spacing="1.6">WATER READ · POLYGON SCAN</text>`;

  // Bottom-right edition stamp.
  const edition = `
    <text x="${editionX}" y="${editionY}" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="${editionSize.toFixed(2)}" fill="${BRAND_MUTED}" text-anchor="end" letter-spacing="1.4">SCANNED · FINFINDR</text>`;

  // Bottom colophon strip — etched, centered, with the lake name.
  const colophon = `
    <text x="${vbW / 2}" y="${colophonY}" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="${colophonSize.toFixed(2)}" fill="${BRAND_MUTED}" text-anchor="middle" letter-spacing="2.4">FINFINDR · WATER READ · ${escapeSvgText(lakeName)}</text>`;

  return `<g class="wr-brand-stamp" pointer-events="none"${clipAttr}>${corners}${wordmark}${edition}${colophon}</g>`;
}

function escapeSvgText(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
