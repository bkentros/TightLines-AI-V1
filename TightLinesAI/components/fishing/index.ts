/**
 * How's Fishing rebuild UI primitives.
 *
 *  • RebuildReportView         — final paper-language report.
 *  • HowFishingLoadingSkeleton — paper-language loading bones used while
 *    the rebuild fetch is in flight (hero/factor cards/timing/guide note).
 *
 * The legacy `CondensedLoadingView` was removed in the visual-polish
 * pass — it was no longer referenced anywhere and still on the old
 * mint/green theme, so deleting it kept the consumer surface clean.
 */

export { HowFishingLoadingSkeleton } from './HowFishingLoadingSkeleton';
export { RebuildReportView } from './RebuildReportView';
