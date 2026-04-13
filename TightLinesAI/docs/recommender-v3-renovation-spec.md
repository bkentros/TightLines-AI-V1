# Recommender V3 renovation (implemented)

## Principles

1. **Seasonal rows** (`RecommenderV3SeasonalRow`) expose **`eligible_lure_ids`** and **`eligible_fly_ids`** only — same standing in-season; no 1/2/3 seasonal weights.
2. **Daily ranking** uses `SharedConditionAnalysis` + `RecommenderV3DailyPayload` → **`buildConditionFeaturesFromAnalysis`** → dot product with **`archetypeConditionWeights`** (tactical lane + small per-id deltas), plus **water column / posture / presentation / forage** fits, **clarity_fit** from `clarity_strengths`, and **guardrails**.
3. **`default_presentation_presence`** removed from seasonal rows; **presentation** for scoring and UI is **`presentation_presence_today`** from `resolveDailyPayloadV3`.
4. **Deterministic**: no `Math.random` in scoring; how-to-fish variants use seeded stable index in `runRecommenderV3Surface`.

## Key files

| Area | Path |
|------|------|
| Condition features | `supabase/functions/_shared/recommenderEngine/v3/buildConditionFeatures.ts` |
| Lane / id weights | `supabase/functions/_shared/recommenderEngine/v3/archetypeConditionWeights.ts` |
| Scoring | `supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts` |
| Seasonal pools | `v3/seasonal/{largemouth,smallmouth,trout,pike}.ts`, `tuning.ts` (`sortEligibleArchetypeIds`) |
| Synthetic audits | `scripts/recommender-v3-audit/syntheticRecommenderAudit.ts` |

## Client cache

`lib/recommender.ts` cache segment bumped to **`recommender_v6`** after response/breakdown shape change.

## Calibration

Tune **`LANE_WEIGHTS`**, **`ID_DELTA`**, and **`clarityProfileFit`** against matrix audits; adjust **eligibility** when a bait should never appear in a month/region.
