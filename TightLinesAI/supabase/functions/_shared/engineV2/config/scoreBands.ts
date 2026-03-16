// =============================================================================
// ENGINE V2 CONFIG — Score Bands
// Simple user-facing score band mapping.
// =============================================================================

import type { ScoreBand } from '../types/contracts.ts';

export function scoreToScoreBand(score: number): ScoreBand {
  if (score >= 75) return 'Great';
  if (score >= 55) return 'Good';
  if (score >= 35) return 'Fair';
  return 'Poor';
}

export const SCORE_BAND_DESCRIPTIONS: Record<ScoreBand, string> = {
  Great: 'Excellent opportunity — strong conditions aligning',
  Good: 'Solid opportunity — favorable conditions with minor limitations',
  Fair: 'Moderate opportunity — some conditions working against you',
  Poor: 'Difficult day — conditions suppressing activity significantly',
};
