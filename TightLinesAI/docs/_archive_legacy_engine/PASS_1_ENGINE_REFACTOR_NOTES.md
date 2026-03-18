# Pass 1 Engine Refactor Notes

This pass intentionally focuses on the core deterministic engine rather than UI polish.

## Goals completed

- Reduced false precision in water-temperature scoring by moving the hottest path away from a single-point-only interpretation and toward a favorable seasonal range.
- Added explicit `water_temp_confidence` handling so estimated freshwater temperatures do not influence the engine as strongly as measured marine/coastal temperatures.
- Reworked precipitation scoring so same-day rain and recent accumulated rain both influence opportunity, with different behavior for freshwater, brackish, and saltwater.
- Exposed `seasonal_baseline_score` and `daily_opportunity_score` in scoring output so future UI and prompt work can explain *why* a day scored the way it did.
- Surfaced freshwater temperature confidence in engine environment output and data-quality notes.

## Files changed

- `supabase/functions/_shared/coreIntelligence/types.ts`
- `supabase/functions/_shared/coreIntelligence/derivedVariables.ts`
- `supabase/functions/_shared/coreIntelligence/scoreEngine.ts`
- `supabase/functions/_shared/coreIntelligence/index.ts`

## Important caveat

The existing engine test suite still has a number of baseline failures around temperature-zone thresholds, temp-trend classification, and several edge-case rules. Those failures appear to be pre-existing validation debt and should be cleaned up in the next pass before broader calibration claims are made.
