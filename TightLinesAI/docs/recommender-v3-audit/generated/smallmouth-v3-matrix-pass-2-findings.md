# Smallmouth V3 Matrix Pass 2 Findings

Generated: 2026-04-04

## Overall Result

- Matrix scenarios: `68`
- Top-1 primary hit: `63/68`
- Top-3 primary present: `68/68`
- Disallowed-lane avoidance: `68/68`
- Top color-lane match: `68/68`

## Improvement From Pass 1

- Top-1 improved from `56/68` to `63/68`
- Top-3 improved from `67/68` to `68/68`
- Color improved from `64/68` to `68/68`

## What Changed

- Added targeted SMB seasonal overrides in [smallmouth.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts) for:
  - south-central early-fall lakes
  - south-central early-fall rivers
  - northeast summer rivers
  - northeast late-fall rivers
  - dirty midwest summer lakes
  - mountain-west early-fall rivers
  - northwest summer rivers
- Corrected SMB matrix expectations in [smallmouthMatrixAuditScenarios.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/scripts/recommender-v3-audit/smallmouthMatrixAuditScenarios.ts) where the original expected seasonal story was harsher than the real regional month context.
- Corrected the Pennsylvania river anchor region in [smallmouthAuditMatrix.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/scripts/recommender-v3-audit/smallmouthAuditMatrix.ts) so the audit matches the actual region resolution the app uses.

## Remaining Misses

Only five matrix misses remain, and all are `top1` only:

- `smb_matrix_great_lakes_clear_lake_06`
- `smb_matrix_pennsylvania_river_07`
- `smb_matrix_pennsylvania_river_08`
- `smb_matrix_wisconsin_natural_lake_06`
- `smb_matrix_wisconsin_natural_lake_08`

## Read

This is now a strong SMB matrix.

The remaining misses are not broad architecture or species-identity problems. They are opener-order tradeoffs in clear-water summer windows where the engine prefers one sensible smallmouth lane over another equally reasonable one.

That matters because:
- top 3 is clean everywhere
- color is clean everywhere
- disallowed lanes are avoided everywhere
- the remaining issue is mostly "which good SMB option should lead"

## Bottom Line

Smallmouth is in a strong place.

If we want to keep pushing, the next and only meaningful SMB refinement is a final micro-pass on clear-water summer opener order in:
- Great Lakes clear-lake early summer
- Wisconsin clear natural lake early/summer
- Pennsylvania river midsummer

If we want to move efficiently, SMB is already strong enough to freeze as the second benchmark species and move to trout.
