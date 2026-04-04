# Smallmouth V3 Gold Batch 2 Findings

Generated: 2026-04-04

## Result

- Initial precheck: `6/10` top-1, `9/10` top-3, `10/10` disallowed avoidance, `9/10` top color match
- After tuning: `10/10` top-1, `10/10` top-3, `10/10` disallowed avoidance, `10/10` top color match

## Main Miss Clusters Exposed

- Clear postspawn western river smallmouth still leaned too tube-first instead of opening minnow and spinner lanes.
- Great Lakes midsummer clear-lake smallmouth was too bottom-control oriented and not baitfish/surface-forward enough.
- Early-fall northwest river smallmouth needed a cleaner jerkbait / spinner / swimbait ordering.
- Great Lakes late-fall stained-lake smallmouth needed a stronger baitfish late-fall lane and more common white-shad hair-jig color support.

## Targeted Fixes Applied

- Added smallmouth seasonal overrides in [smallmouth.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts) for:
  - Great Lakes midsummer clear lake
  - Great Lakes late-fall lake
  - Mountain West postspawn river
  - Inland Northwest / Pacific Northwest early-fall river
- Added `white_shad` as a realistic hair-jig color lane in [lures.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/candidates/lures.ts)
- Added baitfish-forward hair-jig color prioritization in [scoreCandidates.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/scoreCandidates.ts)

## Read

Batch 2 pressure-tested the right weak spots. The remaining misses were row-level and color-lane-specific, not structural. Smallmouth V3 now looks stable enough to expand into Batch 3 or a broader matrix pass.
