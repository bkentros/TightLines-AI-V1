# Smallmouth V3 Gold Batch 3 Findings

Generated: 2026-04-04

## Result

- Initial precheck: `7/10` top-1, `8/10` top-3, `10/10` disallowed avoidance, `9/10` top color match
- After tuning: `10/10` top-1, `10/10` top-3, `10/10` disallowed avoidance, `10/10` top color match

## Main Miss Clusters Exposed

- Dirty prespawn smallmouth lakes needed a more disciplined but still visible baitfish/spinner lane instead of craw-only bottom bias.
- Great Lakes stained late-summer lakes needed stronger spinnerbait / walking-topwater / swimbait support.
- Late-fall clear Midwest river smallmouth needed a cleaner baitfish-forward opener instead of collapsing into pure bottom control.

## Targeted Fixes Applied

- Added new smallmouth seasonal overrides in [smallmouth.ts](/Users/brandonkentros/TightLines%20AI%20V1/TightLinesAI/supabase/functions/_shared/recommenderEngine/v3/seasonal/smallmouth.ts) for:
  - dirty prespawn Midwest lakes
  - stained Great Lakes late-summer lakes
  - late-fall Midwest interior rivers
- Corrected a region assumption on the late-fall river cleanup so the override targets `midwest_interior` instead of `south_central`.

## Read

Batch 3 was a useful pressure test because it attacked stained and dirty smallmouth scenarios that can easily drift toward generic bass logic. The remaining honest tradeoff after the fixes is not Batch 3. It is one Batch 1 Wisconsin August lake case where the engine still prefers a paddle-tail swimbait opener over a more conservative finesse-first top-1, even though the top-3 remains species-correct.
