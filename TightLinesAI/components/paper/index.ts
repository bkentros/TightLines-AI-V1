/**
 * FinFindr paper design system — shared primitives.
 *
 * Import site:  import { PaperCard, CornerMarkSet, TierPill, ... } from '@/components/paper';
 *
 * These primitives read from the `paper*` tokens in `lib/theme.ts`. They are
 * intentionally small, composable, and do not depend on `react-native-svg`,
 * `expo-linear-gradient`, or `expo-blur` — nothing here requires a native
 * rebuild.
 */

export { PaperBackground } from './PaperBackground';
export { PaperCard, type PaperCardProps } from './PaperCard';
export { CornerMark, CornerMarkSet } from './CornerMark';
export { SectionEyebrow } from './SectionEyebrow';
export { TierPill } from './TierPill';
export { MedalBadge, type MedalTier } from './MedalBadge';
export { ScoreGauge } from './ScoreGauge';
export { CompassRose } from './CompassRose';
export { SwimmingFish } from './SwimmingFish';
export { LurePopper } from './LurePopper';
export { TopographicLines } from './TopographicLines';
export {
  LiveConditionsPaperCard,
  type LiveConditionsPaperCardProps,
} from './LiveConditionsPaperCard';
export { PaperNavHeader } from './PaperNavHeader';
export { PaperColophon } from './PaperColophon';
export { PaperBestValueStamp } from './PaperBestValueStamp';
