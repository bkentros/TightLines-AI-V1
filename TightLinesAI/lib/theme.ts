// ─── TightLines AI — Lush Forest Design System ───
// Palette: #253D2C (Deep Forest) · #2E6F40 (Forest Green) · #68BA7F (Sage) · #CFFFDC (Mint)

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
