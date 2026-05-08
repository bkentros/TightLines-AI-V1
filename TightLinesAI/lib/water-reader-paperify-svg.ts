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

/**
 * Every prior paper-warm value the client has shipped, indexed by feature.
 * The paperify color rewrite has to cover ALL of these so that:
 *   • Cached rows generated under the original engine palette are recolored
 *     to the LATEST paper-warm hue (handled by ENGINE_FEATURE_COLORS above).
 *   • Cached rows generated AFTER the engine moved to an early paper-warm
 *     palette (Pass-1 / Pass-2 / Pass-3) ALSO get rewritten to the latest,
 *     so the SVG colors and the legend swatches always agree.
 *
 * Without this transitive list, a cached SVG painted in Pass-3 forest
 * (#366D33) would survive paperify untouched while the React legend
 * pulled the Pass-4 forest (#4A8A45) from the live palette — which is
 * the visible "legend doesn't match the map" bug we're fixing here.
 *
 * Order doesn't matter, but each entry must be unique. When a new pass
 * brightens the palette, add the previous values here.
 */
const PRIOR_PAPER_WARM_VALUES: Record<PaperWarmFeatureKey, string[]> = {
  main_lake_point: ['#2E4A2A', '#366D33'],
  secondary_point: ['#5B7A3E', '#7C9D4F', '#8FB85B'],
  cove: ['#B87818', '#C68522', '#D4922A'],
  neck: ['#CC6A22', '#DD7430'],
  island: ['#3A2E22', '#5A4030'],
  saddle: ['#357A6F', '#3F8B80', '#4DAA9C'],
  dam: ['#C8352C', '#D74033'],
  structure_confluence: ['#7A3A52', '#8C3F60', '#A04970'],
  universal: ['#E8A02E', '#F2AC34'],
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

  // 4) Lake fill + stroke + island land plate.
  //
  //    The engine emits the lake as a SINGLE path with `fill-rule="evenodd"`
  //    so islands appear as cutouts revealing whatever sits behind. Without
  //    intervention that "behind" is the host paper card — the same color
  //    as the surrounding paper — and islands look like featureless white
  //    space, hard to read as land.
  //
  //    Fix: inject a SECOND path BEFORE the lake path, fill it with
  //    `paper.paperDark` (warm tan land color), and reuse the lake's path
  //    `d` attribute trimmed to the OUTER ring only (everything before the
  //    first `Z`). The water gradient renders on top; only where the lake
  //    has holes (islands) does the tan land plate show through. Net: the
  //    lake reads as water surrounding clearly-defined islands.
  //
  //    We also swap the flat water fill for a vertical gradient so the
  //    surface suggests subtle depth (lighter at top, darker at bottom);
  //    the gradient itself is injected into <defs> below.
  const before4 = svg;

  // Inject the island land plate. Defensive — only acts when we can find
  // exactly one lake path with a parseable d attribute. Otherwise we leave
  // the SVG untouched (legacy behavior preserved).
  const lakeMatch = svg.match(
    /<path[^>]*class="water-reader-lake"[^>]*?d="([^"]+)"[^>]*?\/?>/,
  );
  if (lakeMatch) {
    const fullLakeTag = lakeMatch[0];
    const dAttr = lakeMatch[1];
    const subPaths = dAttr.split(/Z/i).map((p) => p.trim()).filter(Boolean);
    if (subPaths.length > 0 && subPaths[0].startsWith('M')) {
      const outerRingD = `${subPaths[0]} Z`;
      // The land plate sits BEHIND the lake — same z-order as the engine's
      // backdrop rect (which we already strip) — so any zone polygons
      // rendered later still paint on top of both.
      const landPlate = `<path d="${outerRingD}" fill="${paper.paperDark}" stroke="none" class="wr-island-land" pointer-events="none"/>`;
      // Don't double-inject under hot reload. Sentinel-check via the class.
      if (!svg.includes('class="wr-island-land"')) {
        svg = svg.replace(fullLakeTag, `${landPlate}\n  ${fullLakeTag}`);
      }
    }
  }

  svg = svg.split(`fill="${ENGINE_WATER_FILL}"`).join(`fill="url(#wr-lake-gradient)"`);
  svg = svg.split(`stroke="${ENGINE_WATER_STROKE}"`).join(`stroke="${paper.ink}"`);
  // Bump the lake stroke from 1.6 → 1.8 so both the outer shoreline AND
  // the island shorelines (which share the same stroke under the path's
  // single class) read as confident, hand-pressed lines.
  svg = svg.replace(
    /(class="water-reader-lake"[^>]*?stroke-width=)"[^"]*"/g,
    `$1"1.8"`,
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
  // (idempotent under hot reload). The engine emits self-closing leader
  // paths, so the dash attribute must be inserted before the closing slash.
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

  // 7) Feature zone colors + opacity bumps.
  //
  //    The engine ships zones at fill-opacity="0.42" (standalone) and 0.4
  //    (confluence members), with stroke-opacity="0.16". Those values were
  //    tuned for the launch white-backdrop skin and read as washed out
  //    against the paper canvas. We bump them so zones POP on top of the
  //    new mint-gradient water, with cleaner-defined edges.
  //
  //    Bump strategy:
  //      - Standalone zone fill-opacity: 0.42 → 0.62
  //      - Confluence zone fill-opacity: 0.4  → 0.55
  //      - Zone stroke-opacity:          0.16 → 0.3
  //
  //    We scope confluence vs standalone via class match in the regex so
  //    the two fill-opacity values are bumped independently (engine emits
  //    them at different inline values).
  const before7opacity = svg;
  svg = svg.replace(
    /(class="water-reader-entry water-reader-standalone-zone"[^>]*?fill-opacity=)"[^"]*"/g,
    `$1"0.62"`,
  );
  svg = svg.replace(
    /(class="water-reader-entry water-reader-confluence"[^>]*?fill-opacity=)"[^"]*"/g,
    `$1"0.55"`,
  );
  // Also catch any inner member-paths inside a confluence <g> wrapper —
  // those are emitted as bare <path d="..." fill="..." fill-opacity="0.4"
  // stroke="..." stroke-opacity="0.14" stroke-width="0.6"/> children.
  // We can't easily scope by parent class via regex, but standalone zones
  // ship with a stable fill-opacity="0.42" and confluence members with
  // exactly "0.4" — so swapping by exact value is reliable.
  svg = svg.replace(/fill-opacity="0\.42"/g, `fill-opacity="0.62"`);
  svg = svg.replace(/fill-opacity="0\.4"/g, `fill-opacity="0.55"`);
  // Zone stroke-opacity: engine emits 0.16 (standalone) and 0.14
  // (confluence members). Both bump to 0.3 for cleaner defined edges.
  svg = svg.replace(/stroke-opacity="0\.16"/g, `stroke-opacity="0.3"`);
  svg = svg.replace(/stroke-opacity="0\.14"/g, `stroke-opacity="0.3"`);
  tally(before7opacity, svg);

  // Feature zone colors — recolor every spec hex AND every prior paper-warm
  // hex in fill="" / stroke="" so the SVG always lands on the current
  // brightness pass. Without the transitive list we'd let prior
  // paper-warm values (emitted by older engine versions or sitting in
  // cached SVGs) pass through, producing a legend that doesn't match
  // the map.
  for (const key of Object.keys(ENGINE_FEATURE_COLORS) as PaperWarmFeatureKey[]) {
    const to = PAPER_WARM_FEATURE_COLORS[key];
    const fromValues = [
      ENGINE_FEATURE_COLORS[key],
      ...PRIOR_PAPER_WARM_VALUES[key],
    ];
    for (const fromRaw of fromValues) {
      // Each color may appear in upper or lower case; do a case-insensitive
      // sweep by normalizing the source. The engine emits uppercase, but
      // some SVG cleanup tools downcase hexes.
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

  // 11) (intentionally empty — we used to bake an in-SVG "FINFINDR · WATER
  //     READ" watermark into the bottom of the viewBox, but it could be
  //     overlapped by lake polygons that extended into the engine's bottom
  //     padding. The brand is already carried prominently by the cartouche
  //     eyebrow, the corner edition stamp, and the bottom colophon — losing
  //     this fourth mark removes the only path to a lake-vs-text overlap
  //     inside the SVG. `buildWatermark` is kept exported / dead-code-clean
  //     in case we want to re-introduce it as a top-corner mark later.)

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

