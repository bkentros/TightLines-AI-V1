# Phase 1 Lane-Fit Regressions

This file lists every seasonal-row ↔ archetype pair where the archetype's authored
column/pace/presence ranges (post Phase 1 narrowing) have **zero overlap** with the
row's allowed tactical lanes. Pre-Phase-1 these pairs validated because the archetype
ranges were wider (and often wrong — tube jig primary "upper" etc.). The hard boot-time
throw was converted to a collect-and-log so the audit can run end-to-end.

## What to do with each entry

For every (row, archetype) pair below, decide — as the auditor — one of:

- **(A)** The authored archetype range is too narrow. Broaden the relevant range in
  `supabase/functions/_shared/recommenderEngine/v3/candidates/{lures,flies}.ts` with
  a biologically-defensible secondary (e.g. ned_rig column_range could be ["bottom","mid"]).
- **(B)** The archetype genuinely does not belong in this seasonal row. Remove it from
  the viable pool in `v3/seasonal/{species}.ts`.
- **(C)** The seasonal row's allowed lanes are too narrow. Adjust the row's
  `base_water_column` / `base_mood` / `base_presentation_style` to better reflect the
  species' real behavior in that region/month.

Once all entries are resolved, revert `validateSeasonalRows` lane-fit check in
`v3/seasonal/validateSeasonalRow.ts` back to a hard `throw`.

## Entries

_(none — every seasonal row pool's archetypes overlap the row's allowed lanes)_
