// ─── TightLines AI — Premium Design System ───
// Hunter green primary, natural tones, soft & elevated outdoor intelligence feel

export const colors = {
  // Backgrounds
  background: '#F7F5F0',       // warm off-white (softer, less yellow)
  backgroundAlt: '#EFEAE2',    // slightly deeper for layered sections
  surface: '#FFFFFF',          // pure white cards for maximum contrast
  surfacePressed: '#F2EDE5',   // pressed state
  surfaceElevated: '#FFFFFF',  // elevated cards (with shadow)

  // Primary — Hunter Green
  primary: '#2A5C34',          // hunter green — main brand anchor
  primaryDark: '#1B4023',      // deep forest — pressed states
  primaryLight: '#D6E8D9',     // soft sage tint — backgrounds, badges
  primaryMist: '#EDF4EE',      // barely-there green — subtle backgrounds

  // Legacy aliases
  sage: '#2A5C34',
  sageDark: '#1B4023',
  sageLight: '#D6E8D9',

  // Text
  text: '#1A2E1C',             // near-black with green undertone
  textSecondary: '#4A5D4C',    // muted forest
  textMuted: '#8B9488',        // soft sage gray
  textLight: '#FFFFFF',        // on dark backgrounds
  textOnPrimary: '#FFFFFF',    // on primary-colored backgrounds

  // Neutrals
  stone: '#6B7066',            // neutral stone
  warmSand: '#C4B89A',         // warm sand accent
  fog: '#D5D1C9',              // fog gray
  charcoal: '#2C3330',         // deep charcoal

  // Legacy
  warmTan: '#B5A17C',         // warmer, more premium tan
  tileDark: '#1E3924',
  tileDarkPressed: '#264730',
  tileDarkText: '#F7F5F0',
  tileDarkSub: '#A8B8A4',

  // Accents
  gold: '#C29B2A',             // richer gold
  goldLight: '#C29B2A18',
  waterBlue: '#2B7EB5',        // deeper, calmer blue
  plannerYellow: '#D4A72C',    // warmer amber

  // Borders & dividers
  border: '#E2DDD4',           // soft warm border
  borderLight: '#ECE8E0',      // lightest border
  divider: '#E8E3DA',

  // States
  disabled: '#C8C3BA',
  disabledText: '#A9A49A',
  disabledBg: '#F0EDE4',

  // Tab bar
  tabBar: '#FFFFFF',
  tabActive: '#2A5C34',
  tabInactive: '#A0A69E',

  // Report score bands
  reportScoreRed: '#B85450',
  reportScoreRedBg: '#FDF0EF',
  reportScoreYellow: '#C29B2A',
  reportScoreYellowBg: '#FDF8EC',
  reportScoreGreen: '#2A5C34',
  reportScoreGreenBg: '#EDF4EE',

  // Context accent colors (for water type visual distinction)
  contextFreshwater: '#2A5C34',        // hunter green
  contextRiver: '#3A7D5C',            // teal-green
  contextCoastal: '#2B7EB5',          // ocean blue
} as const;

export const fonts = {
  serif: 'Georgia',
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
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#1A2E1C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#1A2E1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#1A2E1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: '#1A2E1C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;
