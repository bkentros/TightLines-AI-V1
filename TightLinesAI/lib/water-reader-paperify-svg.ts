/**
 * water-reader-paperify-svg
 *
 * Client-side post-processor that turns the engine's launch-skin Water Read
 * SVG into a finished FinFindr field-guide plate. Two responsibilities:
 *
 *   1. **Recolor** the launch palette into the paper-warm vocabulary (every
 *      hex from the spec → its paper counterpart). Keeps cached pre-bump
 *      rows looking right too, so the user never sees a gray-blue legacy
 *      skin even on a cache hit.
 *   2. **Decorate** the SVG with FinFindr-baked enhancements that survive
 *      screenshot/export — water gradient, lake depth shadow, dashed leader
 *      lines, larger callout pins, and a faint center-bottom brand mark.
 *      All decoration lives inside the SVG defs so it scales with the chart
 *      in DETAIL mode and ships with every cached image.
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
  type PaperWarmFeatureKey,
} from './waterReaderZonePaperPalette';

// ── Engine SVG color constants (mirror rendering/svg.ts) ────────────────────
const ENGINE_BACKDROP = '#F7FAFC';
const ENGINE_WATER_FILL = '#CFE6F7';
const ENGINE_WATER_STROKE = '#275D7F';
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

// Marker comment indicating this SVG was already paperified — guards against
// double-running and against accidentally mutating an SVG that the server-side
// renderer has already painted in paper colors.
const PAPERIFIED_SENTINEL = '<!-- wr-paperified -->';

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
}

const DEFAULTS: Required<WaterReaderPaperifyOptions> = {
  stripEmbeddedLegend: true,
  stripBottomCredit: true,
  stripBackdrop: true,
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
  //    season/county subtitle on the right). Both sit at viewBox bottom and
  //    are rendered as bare <text> elements under the closing </svg>, after
  //    the legend group.
  if (opts.stripBottomCredit) {
    // Conservative: kill any <text> whose content matches the credit phrases.
    const beforeCredit = svg;
    svg = svg.replace(
      /<text[^>]*>FinFindr Water Reader<\/text>\s*/g,
      '',
    );
    // Drop the right-aligned season/county subtitle that immediately follows
    // (the engine emits it as a sibling <text> with text-anchor="end" on the
    // last line before </svg>).
    svg = svg.replace(
      /<text[^>]*text-anchor="end"[^>]*>[^<]+<\/text>\s*(?=<\/svg>)/,
      '',
    );
    tally(beforeCredit, svg);
  }

  // 3) Backdrop rect — engine emits `<rect width="100%" height="100%" fill="#F7FAFC"/>`.
  if (opts.stripBackdrop) {
    const before = svg;
    svg = svg.replace(
      /<rect[^>]*width="100%"[^>]*height="100%"[^>]*fill="#F7FAFC"[^>]*\/>\s*/g,
      '',
    );
    tally(before, svg);
  } else {
    const before = svg;
    svg = svg.replace(/fill="#F7FAFC"/g, `fill="${paper.paperLight}"`);
    tally(before, svg);
  }

  // 4) Lake fill + stroke. Inline attributes only — the engine never
  //    leverages CSS for fill on the lake path.
  //
  //    We swap the flat fill for a vertical gradient so the water surface
  //    suggests subtle depth (lighter at the top, darker at the bottom).
  //    The gradient itself is injected into <defs> below.
  const before4 = svg;
  svg = svg.split(`fill="${ENGINE_WATER_FILL}"`).join(`fill="url(#wr-lake-gradient)"`);
  svg = svg.split(`stroke="${ENGINE_WATER_STROKE}"`).join(`stroke="${paper.ink}"`);
  // Bump the lake stroke a hair so it reads as a confident shore line.
  svg = svg.replace(
    /(class="water-reader-lake"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"1.6"`,
  );
  // Apply the soft drop-shadow we inject into <defs> below. Single match —
  // the engine only emits one lake path — and skip if a filter is already
  // present (defensive against double-running on some hot-reload paths).
  if (!/class="water-reader-lake"[^>]*filter=/.test(svg)) {
    svg = svg.replace(
      /(<path[^>]*class="water-reader-lake"[^>]*?)(\/?>)/,
      `$1 filter="url(#wr-lake-depth)"$2`,
    );
  }
  tally(before4, svg);

  // 5) Callout leader stroke — recolor to ink and convert to a fine dashed
  //    line so the leader reads as hand-drawn rather than as a screen rule.
  const before5 = svg;
  svg = svg.split(`stroke="${ENGINE_CALLOUT_LEADER}"`).join(`stroke="${paper.ink}"`);
  // Soften the engine's slate leader opacity (0.58 → 0.5) and apply a tight
  // dash pattern. We also reduce stroke-width a touch since dashes carry the
  // line on their own — a thinner dashed leader feels finer than a thick one.
  svg = svg.replace(
    /(class="water-reader-label-leader"[^>]*?stroke-opacity=)"[^"]*"/g,
    `$1"0.5"`,
  );
  svg = svg.replace(
    /(class="water-reader-label-leader"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"0.85"`,
  );
  // Inject stroke-dasharray once per leader — only if not already present
  // (idempotent under hot reload).
  svg = svg.replace(
    /<path class="water-reader-label-leader"((?:(?!stroke-dasharray)[^>])*)>/g,
    `<path class="water-reader-label-leader"$1 stroke-dasharray="3 2.4">`,
  );
  tally(before5, svg);

  // 6) Number-callout badges — the engine emits white circles with a near-black
  //    stroke and digit. Repaint to paper-light fill, ink stroke + ink digit,
  //    and bump the radius so the digit reads more confidently inside the
  //    ring (and the badge itself feels like a hand-pressed mark, not an
  //    iOS-style notification dot).
  const before6 = svg;
  // Callout ring: <circle ... fill="#FFFFFF" stroke="#0F172A" stroke-width="1.15"/>
  svg = svg.replace(
    /(<circle[^>]*?)fill="#FFFFFF"([^>]*?)stroke="#0F172A"/g,
    `$1fill="${paper.paperLight}"$2stroke="${paper.ink}"`,
  );
  // Bump the callout ring radius from 7.5 → 8.6 so the Fraunces digit lands
  // with more breathing room and the ring carries more visual weight against
  // the new gradient water + zone polygons.
  svg = svg.replace(
    /(<circle[^>]*?)r="7\.5"/g,
    `$1r="8.6"`,
  );
  // Bump the ring stroke a hair so it reads at the new radius.
  svg = svg.replace(
    /(<circle[^>]*?stroke=")[^"]*("[^>]*?stroke-width=")[^"]*(")/g,
    (_match, p1, p2, p3) => `${p1}${paper.ink}${p2}1.3${p3}`,
  );
  // Engine number text uses fill="${TEXT}" === ENGINE_TEXT ('#0F172A').
  svg = svg.split(`fill="${ENGINE_TEXT}"`).join(`fill="${paper.ink}"`);
  // Bump callout digit font-size to match the larger ring (engine emits 12px
  // → step to 13.5). The engine emits attributes in the order
  //   x, y, font-family, font-size, font-weight, fill, text-anchor,
  //   dominant-baseline
  // so we look ahead for `text-anchor="middle"` + `dominant-baseline="middle"`
  // to ensure we only target the callout digits — the freshly-injected
  // watermark uses text-anchor without dominant-baseline so it won't match.
  svg = svg.replace(
    /(<text[^>]*?font-size=")[^"]*("[^>]*?text-anchor="middle"[^>]*?dominant-baseline="middle"[^>]*?>)/g,
    `$1${'13.5'}$2`,
  );
  // Muted secondary text (legend "Map Key" / footer / etc) — even if the
  // legend strip didn't catch every fragment, this normalizes the residue.
  svg = svg.split(`fill="${ENGINE_MUTED}"`).join(`fill="${paper.ink}"`);
  tally(before6, svg);

  // 7) Feature zone colors — recolor every spec hex in fill="" / stroke="".
  for (const key of Object.keys(ENGINE_FEATURE_COLORS) as PaperWarmFeatureKey[]) {
    const from = ENGINE_FEATURE_COLORS[key];
    const to = PAPER_WARM_FEATURE_COLORS[key];
    if (from === to) continue;
    const before = svg;
    svg = svg.split(`fill="${from}"`).join(`fill="${to}"`);
    svg = svg.split(`stroke="${from}"`).join(`stroke="${to}"`);
    tally(before, svg);
  }

  // Default legend fallback color (#334155) → ink (mostly relevant if the
  // legend strip option is disabled in some debug context).
  svg = svg.split(`fill="${ENGINE_LEGEND_DEFAULT}"`).join(`fill="${paper.ink}"`);

  // 8) Font swap — the engine sets a system stack on every <text>. Drop in
  //    Fraunces with the system stack as fallback so labels feel hand-set.
  const before8 = svg;
  svg = svg.replace(
    /font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"/g,
    `font-family="Fraunces, -apple-system, BlinkMacSystemFont, 'Segoe UI', serif"`,
  );
  tally(before8, svg);

  // 9) Drop-shadow filter on number labels — engine uses a soft slate flood;
  //    repaint flood-color to ink for paper continuity.
  const before9 = svg;
  svg = svg.replace(
    /flood-color="#0F172A"/g,
    `flood-color="${paper.ink}"`,
  );
  tally(before9, svg);

  // 10) FinFindr decoration block. Inject a single set of <defs> entries
  //     (lake gradient, lake depth shadow, callout pop) so the rest of the
  //     transform can reference them by id, plus a faint center-bottom
  //     watermark so every plate carries the brand even when screenshotted.
  const before10 = svg;
  const decorationDefs = buildDecorationDefs();
  if (svg.includes('</defs>')) {
    svg = svg.replace('</defs>', `${decorationDefs}\n  </defs>`);
  } else {
    // Defensive: engine always emits <defs> today, but if a future renderer
    // skips them we still need our gradient/filter references to resolve.
    svg = svg.replace('<svg ', `<svg defs-injected="true" `);
    svg = svg.replace(/(<svg[^>]*>)/, `$1\n  <defs>${decorationDefs}\n  </defs>`);
  }
  tally(before10, svg);

  // 11) Brand watermark — a faint Fraunces line near the bottom of the
  //     viewBox, baked into the SVG so screenshots, exports, and any future
  //     image cache all carry the FinFindr mark. Position is computed from
  //     the viewBox so wide and tall lakes both place the mark sensibly.
  const before11 = svg;
  const watermarkText = buildWatermark(svg);
  if (watermarkText) {
    svg = svg.replace('</svg>', `${watermarkText}\n</svg>`);
  }
  tally(before11, svg);

  // Mark the SVG paperified so we can no-op on a re-run.
  svg = svg.replace('<svg ', `${PAPERIFIED_SENTINEL}\n<svg `);

  // We never want scoreAccentColor unused — it isn't called here, but Web
  // imports of this module that subsequently want to color a callout per
  // score should pull from `lib/theme`. Suppress unused-var lint by
  // referencing the symbol once.
  void scoreAccentColor;

  return { svg, changedCount: changes, alreadyPaperified: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// Decoration builders — kept at module scope so they're constructed once per
// import and the resulting SVG snippets are pure strings (no per-call cost).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lake water gradient + lake depth shadow + callout pop filter.
 *
 * - `wr-lake-gradient`: vertical sage-mint gradient. Top is a hair lighter
 *   than the existing #DCE7DD sweet spot, the middle holds the canonical
 *   value, and the bottom darkens toward a deeper mint so the surface
 *   reads as catching light from above. Stops are tight enough that the
 *   gradient stays calm — this is "depth", not "drama".
 *
 * - `wr-lake-depth`: a soft drop shadow that sits the lake on the paper
 *   like a printed plate rather than a flat fill. Single feDropShadow at
 *   low opacity so it doesn't read as a UI elevation effect.
 *
 * - `wr-callout-pop`: a subtle background halo for the numbered callouts
 *   so the digit ring reads cleanly against busy zone polygons. Reused
 *   on every callout via the existing `wr-label-shadow` filter chain;
 *   this defs-only entry is here for future per-pin emphasis hooks.
 */
function buildDecorationDefs(): string {
  return `
    <linearGradient id="wr-lake-gradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
      <stop offset="0%" stop-color="#E2EDE2"/>
      <stop offset="55%" stop-color="#DCE7DD"/>
      <stop offset="100%" stop-color="#C5D2C5"/>
    </linearGradient>
    <filter id="wr-lake-depth" x="-6%" y="-6%" width="112%" height="112%">
      <feDropShadow dx="0" dy="2.4" stdDeviation="2.6" flood-color="${paper.ink}" flood-opacity="0.22"/>
    </filter>
    <filter id="wr-callout-pop" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.2"/>
      <feOffset dx="0" dy="0.8"/>
      <feFlood flood-color="${paper.ink}" flood-opacity="0.28"/>
      <feComposite in2="SourceAlpha" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
}

/**
 * Returns a `<text>` element placed near the bottom-center of the viewBox
 * with a faint, tracked "FINFINDR · WATER READ" watermark. Returns an empty
 * string if the viewBox can't be parsed (so we never inject a malformed
 * element). Font size scales with viewBox width so very small or very large
 * lakes both look right.
 */
function buildWatermark(svg: string): string {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) return '';
  const parts = match[1].split(/\s+/).map(Number);
  if (parts.length !== 4) return '';
  const [, , w, h] = parts;
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return '';

  // Anchor center-bottom of the viewBox so the mark feels like a plate
  // signature. Font size: 1.4% of the shorter side, clamped, so a wide
  // lake doesn't over-size the mark.
  const fontSize = Math.max(9.5, Math.min(13, Math.min(w, h) * 0.014));
  const x = (w * 0.5).toFixed(1);
  const y = (h * 0.965).toFixed(1);
  const letterSpacing = (fontSize * 0.16).toFixed(2);

  return `<text x="${x}" y="${y}" font-family="Fraunces, serif" font-size="${fontSize.toFixed(2)}" font-weight="700" fill="${paper.ink}" fill-opacity="0.18" text-anchor="middle" letter-spacing="${letterSpacing}" pointer-events="none">FINFINDR · WATER READ</text>`;
}
