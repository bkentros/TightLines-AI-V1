// ─── TightLines AI — Lush Forest Design System ───
// Palette: #253D2C (Deep Forest) · #2E6F40 (Forest Green) · #68BA7F (Sage) · #CFFFDC (Mint)
//
// Note — as of the FinFindr UI migration (Phase 1, Home screen only), this file also
// exports `paper`, `paperFonts`, `paperSpacing`, `paperRadius`, and `paperShadows`.
// Those tokens power the new paper/ink visual language and are consumed by the
// components under `components/paper/*` and the Home screen. The legacy forest
// tokens below remain the source of truth for every screen outside of Home until
// later migration phases adopt the new system explicitly.

export const colors = {
  // ── Backgrounds ──────────────────────────────────────────────────
  background: '#F2FAF4',        // faint mint-white canvas
  backgroundAlt: '#E6F5EB',     // slightly richer for layered sections
  surface: '#FFFFFF',           // pure white cards
  surfacePressed: '#EBF7EF',    // pressed state
  surfaceElevated: '#FFFFFF',   // elevated cards
  surfaceGlass: 'rgba(207,255,220,0.45)', // mint glass card

  // ── Brand — Lush Forest ──────────────────────────────────────────
  primary: '#2E6F40',           // forest green — brand anchor
  primaryDark: '#253D2C',       // deep forest — CTAs, pressed, strong UI
  primaryLight: '#68BA7F',      // sage green — secondary accents
  primaryMist: '#CFFFDC',       // mint — glass tints, subtle backgrounds
  primaryMistDark: '#B2E8C4',   // slightly deeper mint for borders

  // ── Legacy aliases (keep for existing component compat) ──────────
  sage: '#2E6F40',
  sageDark: '#253D2C',
  sageLight: '#CFFFDC',

  // ── Text ─────────────────────────────────────────────────────────
  text: '#253D2C',              // deep forest — primary text
  textSecondary: '#3B6147',     // forest mid-tone
  textMuted: '#7BAF8B',         // desaturated sage — captions, labels
  textLight: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // ── Neutrals ─────────────────────────────────────────────────────
  stone: '#6B7C6E',
  warmSand: '#C4B89A',
  fog: '#D5D1C9',
  charcoal: '#253D2C',

  // ── Legacy ───────────────────────────────────────────────────────
  warmTan: '#B5A17C',
  tileDark: '#253D2C',
  tileDarkPressed: '#2E6F40',
  tileDarkText: '#F2FAF4',
  tileDarkSub: '#A0C9AE',

  // ── Accents ──────────────────────────────────────────────────────
  gold: '#C29B2A',
  goldLight: '#C29B2A18',
  waterBlue: '#2B7EB5',
  plannerYellow: '#D4A72C',

  // ── Borders ──────────────────────────────────────────────────────
  border: '#D4E8D8',            // soft mint-green border
  borderLight: '#E4F0E6',       // barely-there border
  divider: '#D9E9DC',

  // ── States ───────────────────────────────────────────────────────
  disabled: '#C2D8C6',
  disabledText: '#A5BAA7',
  disabledBg: '#EEF6EF',

  // ── Tab bar ──────────────────────────────────────────────────────
  tabBar: '#FFFFFF',
  tabActive: '#253D2C',
  tabInactive: '#8DB99A',

  // ── Report score bands ───────────────────────────────────────────
  reportScoreRed: '#C0504A',
  reportScoreRedBg: '#FDF0EF',
  reportScoreYellow: '#C29B2A',
  reportScoreYellowBg: '#FDF8EC',
  reportScoreGreen: '#2E6F40',
  reportScoreGreenBg: '#E6F5EB',

  // ── Context accent colors ─────────────────────────────────────────
  contextFreshwater: '#2E6F40',
  contextRiver: '#68BA7F',
  contextCoastal: '#2B7EB5',
  /** Flats / estuary tab — distinct from inshore coastal blue */
  contextFlatsEstuary: '#1A8A8A',
} as const;

export const fonts = {
  serif: 'BricolageGrotesque_600SemiBold',    // headings, display
  serifBold: 'BricolageGrotesque_700Bold',    // bold headings
  body: 'Inter_400Regular',                   // body copy
  bodyItalic: 'Inter_400Regular_Italic',      // italic body
  bodyMedium: 'Inter_500Medium',              // medium weight body
  bodySemiBold: 'Inter_600SemiBold',          // semibold labels
  bodyBold: 'Inter_700Bold',                  // bold labels
} as const;

/**
 * Legacy "Lush Forest" spacing scale.
 *
 * Kept unchanged at the small end (xs/sm/md) where dozens of legacy components
 * have visually-tuned tight layouts. The mid-large end (lg/xl/xxl) was opened
 * up in the May 2026 "more breathing room" pass to match the philosophy of the
 * paper system (see `paperSpacing` below). If you adjust these you should
 * also reason about the `paperSpacing` mirror so the two systems stay
 * visually consistent on shared surfaces.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 28,    // was 24 — small bump so legacy screens breathe alongside the paper system
  xl: 40,    // was 32 — between-major-section breathing room
  xxl: 64,   // was 48 — bottom-of-scroll cushion
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 22,
  xl: 30,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  lg: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 5,
  },
  xl: {
    shadowColor: '#253D2C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 8,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FinFindr Paper Design System — Phase 1 (Home screen only)
//
// Mirrors the mock in `finfindr.jsx`:
//   paper   #E8DFC9    ink    #1C2419    forest #2E4A2A    red  #C8352C
//   gold    #E8A02E    walnut #3A2E22    moss   #5B7A3E
//
// Kept in the same module as the forest tokens so existing imports keep working.
// New screens/primitives should import { paper, paperFonts, paperSpacing, ... }.
// ─────────────────────────────────────────────────────────────────────────────

export const paper = {
  // Canvas
  paper: '#E8DFC9',
  paperLight: '#F0E8D4',
  paperDark: '#D9CDAF',

  // Ink / structure
  ink: '#1C2419',
  inkSoft: 'rgba(28,36,25,0.55)',
  inkHair: 'rgba(28,36,25,0.25)',
  inkHairSoft: 'rgba(28,36,25,0.12)',

  // Accents
  forest: '#2E4A2A',
  forestDk: '#1E3418',
  forestWarm: '#2A3F26',
  moss: '#5B7A3E',
  mossDk: '#4A6630',
  red: '#C8352C',
  redDk: '#9B2822',
  rust: '#CC6A22',
  gold: '#E8A02E',
  goldDk: '#B87818',
  walnut: '#3A2E22',
  walnutDk: '#251B13',

  // Tier colors for GO / FAIR / SKIP banding
  tierGo: '#2E4A2A',
  tierFair: '#E8A02E',
  tierSkip: '#C8352C',

  // Medal palette
  medalGold: '#D4AF37',
  medalSilver: '#B8B8B8',
  medalBronze: '#CD7F32',

  // Text rendered on colored tier backgrounds
  textOnForest: '#E8DFC9',
  textOnGold: '#1C2419',
  textOnRed: '#E8DFC9',
} as const;

export const paperFonts = {
  // Display / serif — from @expo-google-fonts/fraunces
  display: 'Fraunces_700Bold',
  displayItalic: 'Fraunces_500Medium_Italic',
  displayMedium: 'Fraunces_500Medium',
  displaySemiBold: 'Fraunces_600SemiBold',

  // UI / sans — from @expo-google-fonts/dm-sans
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',

  // Big numerics — from @expo-google-fonts/space-mono
  mono: 'SpaceMono_400Regular',
  monoBold: 'SpaceMono_700Bold',

  // Meta / timestamps — from @expo-google-fonts/jetbrains-mono
  metaMono: 'JetBrainsMono_500Medium',
  metaMonoBold: 'JetBrainsMono_600SemiBold',
} as const;

/**
 * FinFindr paper spacing scale.
 *
 * May 2026 "open up the layout" pass — the small end (xs/sm) is unchanged
 * because chip gaps, badge margins, and inline label/value pairs depend on
 * the tight 4 / 8 rhythm. The mid-large end (md/lg/xl/xxl) was nudged
 * upward to give every paper screen more breathing room between cards
 * and between major sections. Concretely:
 *
 *   md  14 → 16   one row of in-card padding (paragraph & sub-section margins)
 *   lg  20 → 24   screen horizontal padding & between-card vertical gaps
 *   xl  28 → 36   between-major-section vertical breathing
 *   xxl 40 → 56   bottom-of-scroll cushion above tab bar
 *
 * In addition, a dedicated `section` slot was added so screens can express
 * "this is a between-major-card gap" semantically instead of overloading
 * `lg`, which is also used for screen padding. Use `section` for vertical
 * margins between independent paper cards on the same screen; use `lg` when
 * you want screen-edge or in-card padding.
 *
 * Forecast tile widths on Home are computed from a separate `HOME_H_PADDING`
 * constant inside the screen, so they are insulated from this token bump.
 * Anything that uses these tokens for layout (the entire app outside Home's
 * forecast strip) inherits the new rhythm automatically.
 */
export const paperSpacing = {
  xs: 4,
  sm: 8,
  md: 16,         // was 14 — slightly more in-card breathing
  lg: 24,         // was 20 — screen padding + between-card vertical gap
  xl: 36,         // was 28 — major between-section breathing
  xxl: 56,        // was 40 — bottom-of-scroll cushion above tab bar
  /**
   * Explicit between-major-card vertical gap. Sits intentionally between `lg`
   * (24) and `xl` (36) so screens can stack independent paper cards with a
   * clear, more-defined visual rhythm without bleeding into the larger
   * inter-section breathing space.
   */
  section: 32,
} as const;

/**
 * Paper card radius scale.
 *
 * Bumped from 6 → 10 in the May 2026 "more defined boxes" pass so cards
 * read as friendlier, more clearly-separated shapes against the warm paper
 * canvas. The 2px ink stroke + hard ink shadow already provide strong
 * visual definition; the slightly larger radius softens corners enough to
 * give each card its own gestalt without bleeding into chip language.
 *
 * Chip radius is intentionally kept at 2 — chips are small typographic
 * pills and their square-ish corners are part of the FinFindr stamp/etched
 * label voice.
 */
export const paperRadius = {
  chip: 2,
  card: 10,       // was 6 — friendlier corners while staying inside the paper voice
  medal: 999,
} as const;

export const paperBorders = {
  /** Ink stroke used on every primary paper card. */
  card: { borderWidth: 2, borderColor: paper.ink } as const,
  /** Thinner hairline for chips/pills. */
  chip: { borderWidth: 1.5, borderColor: paper.ink } as const,
} as const;

/**
 * FinFindr's signature "0 2px 0 ink" hard shadow — we express it as a
 * border-bottom-style inset on Android plus a proper shadow on iOS so it
 * reads the same across platforms without needing a native lib.
 */
export const paperShadows = {
  hard: {
    shadowColor: paper.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  lift: {
    shadowColor: paper.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 6,
  },
} as const;

/**
 * Semantic helper — FinFindr tier bands (GO / FAIR / SKIP) used across forecast
 * tiles, score gauges, time windows. Returns the background + foreground pair.
 */
export type PaperTier = 'green' | 'yellow' | 'red';
export const paperTier = {
  green: { bg: paper.tierGo, fg: paper.textOnForest, label: '● GO' },
  yellow: { bg: paper.tierFair, fg: paper.textOnGold, label: '◐ FAIR' },
  red: { bg: paper.tierSkip, fg: paper.textOnRed, label: '○ SKIP' },
} as const satisfies Record<PaperTier, { bg: string; fg: string; label: string }>;

/**
 * Score-band mapping used by FinFindr's home hero + forecast + gauge.
 * Input is an out-of-10 value (the engine's /100 scores should be divided by 10
 * before calling). Matches the red/yellow/green cutoffs in finfindr.jsx.
 */
export function paperTierForScore(score10: number): PaperTier {
  if (!Number.isFinite(score10)) return 'yellow';
  if (score10 >= 6.5) return 'green';
  if (score10 >= 4) return 'yellow';
  return 'red';
}

/**
 * Engine-accurate 4-band label used for any "word that matches the number"
 * UI — home hero chip, report band pill, etc.
 *
 * The cutoffs MUST mirror the server-side `bandFromScore` in
 * `supabase/functions/_shared/howFishingEngine/score/scoreDay.ts`, which
 * operates on a 0-100 scale:
 *   ≥ 80 → Excellent   (8.0+ on the 0-10 display)
 *   ≥ 60 → Good        (6.0 – 7.9)
 *   ≥ 40 → Fair        (4.0 – 5.9)
 *   otherwise → Poor
 *
 * Keeping this client-side helper in lock-step with the engine guarantees
 * that the label (Excellent / Good / Fair / Poor) always agrees with the
 * numeric score the user sees, across Home + How's Fishing + forecast.
 */
export type PaperScoreBand = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export function paperBandForScore(score10: number): PaperScoreBand {
  if (!Number.isFinite(score10)) return 'Fair';
  if (score10 >= 8) return 'Excellent';
  if (score10 >= 6) return 'Good';
  if (score10 >= 4) return 'Fair';
  return 'Poor';
}

/**
 * Tapered score-accent palette. Returns a background/foreground/label triple
 * that varies smoothly from deep red at the bottom of the 0-10 range through
 * rust + gold in the middle to deep forest at the top. The red→yellow→green
 * arc is preserved, but with more resolution than the 3-way `paperTier` so
 * that adjacent scores read visibly different (e.g. a 3.1 vs a 2.0).
 *
 * Stops (inclusive lower bound):
 *   ≥ 8.0 → forestDk   (deep excellent)
 *   ≥ 7.0 → forest     (excellent / strong good)
 *   ≥ 6.0 → moss       (solid good)
 *   ≥ 5.0 → gold       (bright fair — the pivot point)
 *   ≥ 4.0 → goldDk     (deep fair)
 *   ≥ 3.3 → rust       (weak fair / borderline poor)
 *   ≥ 2.5 → red        (poor)
 *   else  → redDk      (deep poor)
 *
 * Note: labels (Poor/Fair/Good/Excellent) come from `paperBandForScore` —
 * this helper only controls the color swatch so the numeric value gets a
 * more nuanced tint than the 3-tier mapping alone can provide.
 */
export interface PaperScoreStyle {
  bg: string;
  fg: string;
  band: PaperScoreBand;
}

export function scoreAccentColor(score10: number): string {
  if (!Number.isFinite(score10)) return paper.goldDk;
  if (score10 >= 8) return paper.forestDk;
  if (score10 >= 7) return paper.forest;
  if (score10 >= 6) return paper.moss;
  if (score10 >= 5) return paper.gold;
  if (score10 >= 4) return paper.goldDk;
  if (score10 >= 3.3) return paper.rust;
  if (score10 >= 2.5) return paper.red;
  return paper.redDk;
}

export function scoreTextOnColor(score10: number): string {
  if (!Number.isFinite(score10)) return paper.textOnGold;
  // Bright gold (5.0-5.9) needs ink text for contrast. Everything else uses cream.
  if (score10 >= 5 && score10 < 6) return paper.textOnGold;
  return paper.textOnForest;
}

export function paperScoreStyle(score10: number): PaperScoreStyle {
  return {
    bg: scoreAccentColor(score10),
    fg: scoreTextOnColor(score10),
    band: paperBandForScore(score10),
  };
}
