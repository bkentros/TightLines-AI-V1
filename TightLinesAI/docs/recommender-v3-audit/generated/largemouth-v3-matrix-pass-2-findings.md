# Largemouth V3 Matrix Pass 2 Findings

This pass followed the first matrix sweep and focused on:

- Florida warm-season lake rows
- Texas summer and fall reservoir rows
- Alabama river rows
- New York clear-lake rows
- Great Lakes upper-midwest clear-lake rows
- Georgia highland and California Delta overlays

## Updated Summary

- Scenario count: `68`
- Top 1 primary-hit rate: `58/68`
- Top 3 primary-present rate: `62/68`
- Disallowed-lane avoidance: `68/68`
- Top color-lane match rate: `64/68`

## Gold Batch Check

- Batch 1: `8/10` top 1, `10/10` top 3, `10/10` disallowed, `8/10` color
- Batch 2: `10/10` top 1, `10/10` top 3, `10/10` disallowed, `10/10` color
- Batch 3: `9/10` top 1, `10/10` top 3, `10/10` disallowed, `10/10` color

The largemouth engine is much cleaner than it was before the matrix pass.
The major remaining misses are now concentrated, not scattered.

## What Improved

### Florida lake

- `12/12` top 1
- `12/12` top 3
- `12/12` disallowed avoidance

The remaining Florida issues are color-lane polish only, not lure-lane identity.

### Alabama river

- `12/12` top 1
- `12/12` top 3
- `12/12` disallowed avoidance
- `12/12` color

This slice is now in a strong place and no longer behaves like accidental smallmouth/current-finesse logic.

### New York natural lake

- `10/12` top 1
- `11/12` top 3
- `12/12` disallowed avoidance
- `12/12` color

Clear-northern largemouth posture is much better now.

### California Delta

- `4/4` top 1
- `4/4` top 3
- `4/4` disallowed avoidance
- `4/4` color

## Remaining Weak Areas

### 1. Great Lakes upper-midwest weed-lake balance

Current Minnesota anchor result:

- `0/4` top 1
- `1/4` top 3
- `4/4` disallowed avoidance
- `3/4` color

This is now the clearest remaining largemouth weak zone.

Important interpretation:
- This is not purely random drift.
- The current engine inputs do not distinguish a northern weed-lake largemouth scenario from a clearer natural-lake scenario inside the same `great_lakes_upper_midwest` region and `freshwater_lake_pond` context.
- New York and Minnesota are both resolving through the same regional backbone, but the expected tactical lanes differ because the lake archetype differs.

That means some of this miss cluster is true tuning, but some of it is an input-resolution limitation.

### 2. Texas reservoir opener order

Texas is strong overall:

- `9/12` top 1
- `11/12` top 3
- `12/12` disallowed avoidance
- `12/12` color

What remains is mostly opener ordering, not broad tactical failure.
The engine is in the right family class, but a few rows still need the intended first recommendation to outrank the backup lane.

### 3. Georgia highland spring/summer overlay

Georgia highland now sits at:

- `3/4` top 1
- `3/4` top 3
- `4/4` disallowed avoidance
- `3/4` color

This is a small, manageable overlay cleanup.

### 4. Florida color-lane polish

Florida lure lanes are locked, but color is still `10/12`, not `12/12`.
That is now a color-theme polish problem, not a seasonal-row problem.

## Key Architecture Insight

The remaining largest ambiguity for largemouth is not Alabama, Texas, or Florida anymore.
It is northern lake-type differentiation inside a shared region.

Examples:
- a Great Lakes upper-midwest weed lake
- a clearer northern natural lake

Both can share:
- species = largemouth
- region = `great_lakes_upper_midwest`
- context = `freshwater_lake_pond`
- month
- clarity

But still want meaningfully different tactical openers because the habitat archetype differs.

This is important because it tells us:
- the current V3 architecture is working
- the remaining problem is not “add more engine complexity”
- the remaining problem is whether we accept regional generalization or later add one more habitat/waterbody-style input

## Recommended Next Step

For largemouth, the highest-value next steps are:

1. Florida color-lane polish
2. Texas opener-order polish
3. Georgia overlay cleanup
4. Decide whether to:
   - accept the current Great Lakes regional generalization for V1 of LMB tuning
   - or later add a habitat-style discriminator for northern lake largemouth
