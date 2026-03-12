export const colors = {
  background: '#F5F0E8',
  surface: '#FDFBF7',
  surfacePressed: '#EDE8DD',

  text: '#2D3A2E',
  textSecondary: '#5F6B5E',
  textMuted: '#94908A',
  textLight: '#FDFBF7',

  // Hunter green — primary brand (buttons, tabs, accents)
  sage: '#2E5C34',
  sageDark: '#1E4620',
  sageLight: '#D4E5D6',

  stone: '#6B6659',
  warmTan: '#A8956F',

  border: '#DDD7CA',
  borderLight: '#EAE5DC',
  divider: '#E8E2D6',

  disabled: '#C4BFB3',
  disabledText: '#A9A49A',
  disabledBg: '#F0EDE4',

  tabBar: '#FDFBF7',
  tabActive: '#2E5C34',
  tabInactive: '#94908A',

  tileDark: '#243D28',
  tileDarkPressed: '#2D4A32',
  tileDarkText: '#F5F0E8',
  tileDarkSub: '#A8B5A0',

  // Vibrant gold / amber (badges, highlights)
  gold: '#C9A227',
  goldLight: '#C9A22718',

  // Accent blues and yellows (home tab tiles, etc.)
  waterBlue: '#2E8FC4',
  plannerYellow: '#E8B82E',

  // Report score bands (1–4 poor, 5–7 fair, 8–10 great)
  reportScoreRed: '#B85450',
  reportScoreRedBg: '#FDEAEA',
  reportScoreYellow: '#C9A227',
  reportScoreYellowBg: '#FDF8E8',
  reportScoreGreen: '#2E5C34',
  reportScoreGreenBg: '#E8F0E9',
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
  sm: 6,
  md: 10,
  lg: 16,
} as const;
