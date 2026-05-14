# Today's Bite Timing Post-Patch Readiness Audit

Generated: 2026-05-14T15:50:38.991Z

Ran actual production timing behavior after the guarded priority-ladder patch. Scoring, recommender, normalizers, temp configs, freshwater envelopes, buildNormalized, interpolation, and forecast snapshot behavior were not changed.

## Executive Result

- Result: PASS
- Rows compared: 90720
- Fallback used: 15505 (baseline 36112)
- Broad/all-day flags: 0 (baseline limit 2912)

## Production Flag Counts

- Production: fallback_used:15505
- Shadow parity check: fallback_used:15505

## Driver Distribution by Context

- Production:
  - freshwater_lake_pond: light_cloud:11046, temperature_avoid_heat:5761, fallback_bias:4361, temperature_seek_warmth:1512
  - freshwater_river: light_cloud:11046, temperature_avoid_heat:5761, fallback_bias:4361, temperature_seek_warmth:1512
  - coastal: tide_current:18144, fallback_bias:4018, temperature_avoid_heat:518
  - coastal_flats_estuary: tide_current:18144, fallback_bias:2765, light_cloud:1253, temperature_avoid_heat:518
- Shadow parity:
  - freshwater_lake_pond: light_cloud:11046, temperature_avoid_heat:5761, fallback_bias:4361, temperature_seek_warmth:1512
  - freshwater_river: light_cloud:11046, temperature_avoid_heat:5761, fallback_bias:4361, temperature_seek_warmth:1512
  - coastal: tide_current:18144, fallback_bias:4018, temperature_avoid_heat:518
  - coastal_flats_estuary: tide_current:18144, fallback_bias:2765, light_cloud:1253, temperature_avoid_heat:518

## Key Outcomes

- Winter flats moving-tide fallback rows: 0
- Freshwater hot rows anchored on avoid_heat: 6048/6048
- Cold-warming non-coastal rows anchored on seek_warmth: 3024/3024
- Heat attribution flags: 0
- Coastal moving-tide fallback flags: 0
- Cold-warming not seek_warmth flags: 0
- Month-boundary driver changes: 296 (limit 400)
- Month-boundary period changes: 732 (limit 850)
- Tide timing without real same-day tide events: 0
- Forecast snapshot: PASS {"0":12960,"1":12960,"2":12960,"3":12960,"4":12960,"5":12960,"6":12960}, missing mean temp 0
- Tide/heat conflict policy: keep real tide anchor, add heat caution in trace/reason; do not invent tide timing when events are missing.
- Readiness failures: none

## Improved Output Examples

- None

## Remaining Questionable Outputs

- northeast m1 freshwater_lake_pond overcast_low_light_window: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=yes. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 freshwater_lake_pond river_runoff_disruption: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=no. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 freshwater_lake_pond missing_partial_hourly_tide_light: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=no. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 freshwater_river overcast_low_light_window: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=yes. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 freshwater_river river_runoff_disruption: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=no. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 freshwater_river missing_partial_hourly_tide_light: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=no. freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal.
- northeast m1 coastal coastal_slack_tide: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=tide_exchange_window; heat=no; warmth=no; shaped_light=yes; tide=no. coastal ladder fell back; no tide/heat signal qualified.
- northeast m1 coastal river_runoff_disruption: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=tide_exchange_window; heat=no; warmth=no; shaped_light=no; tide=no. coastal ladder fell back; no tide/heat signal qualified.
- northeast m1 coastal missing_partial_hourly_tide_light: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=tide_exchange_window; heat=no; warmth=no; shaped_light=no; tide=no. coastal ladder fell back; no tide/heat signal qualified.
- northeast m1 coastal_flats_estuary river_runoff_disruption: prod neutral_fallback/afternoon -> cand neutral_fallback/afternoon; priority_ladder considered: primary=seek_warmth; heat=no; warmth=no; shaped_light=no; tide=no. flats ladder fell back; no qualifying priority signal.

## Production Patch Notes

- Keep existing timing family resolution.
- Use a context/season priority ladder rather than the first available secondary signal.
- Restrict light_window secondary use to shaped 1-2 period windows; reject cloud_all_day as a secondary anchor.
- Prefer avoid_heat attribution when heat creates the final dawn/evening recommendation.
- For coastal/flats, prefer actual same-day tide events over warmth fallback unless no usable tide clock exists.
- Do not invent tide timing without tide events; missing-tide fallback remains intact.

## Validation

- `deno fmt scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts`
- `deno run --allow-read --allow-write scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts`
- `git diff --name-only`
- Protected diff check for recommender, scoring, normalizers, and score-patch configs.
