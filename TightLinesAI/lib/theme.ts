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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
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
  red: '#C8352C',
  redDk: '#9B2822',
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

export const paperSpacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 40,
} as const;

/**
 * FinFindr uses a universal card radius of 6 ("softer / friendlier"), paired
 * with small chip radii of 2.
 */
export const paperRadius = {
  chip: 2,
  card: 6,
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
