# Seasonal matrix CSV schema (v4)

**Authoring source of truth:** files in this directory (`*.csv`). They feed `scripts/generate-seasonal-rows-v4.ts` → `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`.

**Runtime note:** Until engine cutover, the **live** recommender edge function still resolves seasonal biology from embedded **v3** tables (`recommenderEngine/v3/seasonal/*.ts`). Aligning live runtime with these CSVs is a later phase; do not assume v3 tables match CSV without checking.

Field-level conventions also appear in `docs/recommender-v4-simplified-design.md` §17.3; phased rebuild rules are in `docs/tightlines_recommender_architecture_clean.md`.

## Files

| File | Species |
| --- | --- |
| `largemouth_bass.csv` | `largemouth_bass` |
| `smallmouth_bass.csv` | `smallmouth_bass` |
| `northern_pike.csv` | `northern_pike` |
| `trout.csv` | `trout` (rows MUST use `water_type=freshwater_river` only — P26) |

## Header (column order)

```text
species,region_key,month,water_type,state_code,column_range,column_baseline,pace_range,pace_baseline,primary_forage,secondary_forage,surface_seasonally_possible,primary_lure_ids,primary_fly_ids,excluded_lure_ids,excluded_fly_ids,notes
```

## Field rules

| Column | Rule |
| --- | --- |
| `species` | One of `largemouth_bass`, `smallmouth_bass`, `northern_pike`, `trout`. |
| `region_key` | Canonical `RegionKey` from `howFishingEngine/contracts/region.ts`. |
| `month` | Integer 1–12. |
| `water_type` | `freshwater_lake_pond` or `freshwater_river`. Trout: river only (P26). |
| `state_code` | Empty for regional default rows; otherwise uppercase US-2 override. |
| `column_range` | Pipe-separated tactical columns, e.g. `bottom\|mid\|upper\|surface`. |
| `column_baseline` | Single column; must appear in `column_range`; **never** `surface` (P14). |
| `pace_range` | Pipe-separated: `slow\|medium\|fast`. |
| `pace_baseline` | Single pace; must appear in `pace_range`. |
| `primary_forage` | Forage bucket; must satisfy §15.1 G6 / `FORAGE_POLICY_V4`. |
| `secondary_forage` | Optional; empty string if absent. |
| `surface_seasonally_possible` | `true` or `false`; must agree with whether `surface` appears in `column_range`. |
| `primary_lure_ids` | Pipe-separated lure archetype ids (v4 catalog). |
| `primary_fly_ids` | Pipe-separated fly archetype ids. |
| `excluded_lure_ids` | Optional; pipe-separated or empty. |
| `excluded_fly_ids` | Optional; pipe-separated or empty. |
| `notes` | Authoring only; not read by engine. Use for DATA_QUALITY_WARN rationale. |

## Pipeline

1. Edit CSVs under `data/seasonal-matrix/`.
2. `npm run gen:seasonal-rows-v4` — validates §15.1 (G1 fatal, G8 warn) and writes `v4/seasonal/generated/*.ts`.
3. `npm run check:seasonal-matrix` — CI ensures generated TS matches CSVs.
4. `npm run audit:eligibility` — refreshes `docs/authoring/eligibility-audits/*.md`.
