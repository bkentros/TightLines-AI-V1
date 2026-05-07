/**
 * water-reader-paperify-svg
 *
 * Client-side post-processor that recolors the production Water Reader SVG
 * into the FinFindr paper palette and strips the elements we now render in
 * React (the embedded "Map Key" panel and the bottom "FinFindr Water Reader"
 * credit text). The server-side renderer is also being repainted, but cached
 * rows generated under older engine versions still flow through this helper
 * so the user never sees a gray-blue legacy skin even on a cache hit.
 *
 * The transformation is structural — the engine emits stable CSS classes
 * (`water-reader-lake`, `water-reader-zones`, `water-reader-legend`, etc.)
 * and stable inline color attributes from a known palette, so a small
 * regex/string-replace pipeline is robust here. We never touch geometry, the
 * clip path, callout placement, or any data attributes.
 *
 * Pure: no React, no theme imports — color values live inline with comments
 * pointing back to `lib/theme.ts` so the file reads as a single self-contained
 * style swap.
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
  const lakeFillReplacement = '#DCE7DD'; // muted sage-mint, sits on warm paper.
  const before4 = svg;
  svg = svg.split(`fill="${ENGINE_WATER_FILL}"`).join(`fill="${lakeFillReplacement}"`);
  svg = svg.split(`stroke="${ENGINE_WATER_STROKE}"`).join(`stroke="${paper.ink}"`);
  // Bump the lake stroke a hair so it reads as a confident shore line.
  svg = svg.replace(
    /(class="water-reader-lake"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"1.6"`,
  );
  tally(before4, svg);

  // 5) Callout leader stroke (was a slate gray) → ink, slightly more opaque.
  const before5 = svg;
  svg = svg.split(`stroke="${ENGINE_CALLOUT_LEADER}"`).join(`stroke="${paper.ink}"`);
  // Engine sets stroke-opacity="0.58" on label leaders. Soften further for paper.
  svg = svg.replace(
    /(class="water-reader-label-leader"[^>]*?stroke-opacity=)"[^"]*"/g,
    `$1"0.55"`,
  );
  tally(before5, svg);

  // 6) Number-callout badges — the engine emits white circles with a near-black
  //    stroke and digit. Repaint to paper-light fill, ink stroke + ink digit.
  const before6 = svg;
  // Callout ring: <circle ... fill="#FFFFFF" stroke="#0F172A" stroke-width="1.15"/>
  svg = svg.replace(
    /(<circle[^>]*?)fill="#FFFFFF"([^>]*?)stroke="#0F172A"/g,
    `$1fill="${paper.paperLight}"$2stroke="${paper.ink}"`,
  );
  // Engine number text uses fill="${TEXT}" === ENGINE_TEXT ('#0F172A').
  svg = svg.split(`fill="${ENGINE_TEXT}"`).join(`fill="${paper.ink}"`);
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

  // Mark the SVG paperified so we can no-op on a re-run.
  svg = svg.replace('<svg ', `${PAPERIFIED_SENTINEL}\n<svg `);

  // We never want scoreAccentColor unused — it isn't called here, but Web
  // imports of this module that subsequently want to color a callout per
  // score should pull from `lib/theme`. Suppress unused-var lint by
  // referencing the symbol once.
  void scoreAccentColor;

  return { svg, changedCount: changes, alreadyPaperified: false };
}
