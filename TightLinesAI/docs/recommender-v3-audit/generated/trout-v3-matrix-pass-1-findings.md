# Trout V3 Matrix Pass 1 Findings

Generated: 2026-04-04

## Scorecard

- Total scenarios: `68`
- Top 1 primary hits: `52/68`
- Top 3 primary present: `67/68`
- Disallowed-lane avoidance: `67/68`
- Top color-lane match: `64/68`

## What This Means

Trout is broadly strong already. The matrix is not exposing messy drift or species confusion.

The main failure mode is opener order:
- `hair_jig` is leading too often in trout rows where a streamer-first or minnow-first trout opener should win
- one stained midsummer western runoff-edge lane is letting `paddle_tail_swimbait` lead too often
- one Alaska summer row still leaked a `mouse_fly`, which should not happen there

## Main Miss Clusters

1. Trout rows where `hair_jig` is over-leading
- Appalachian tailwater: months `4`, `6`
- Northeast freestone: month `2`
- Mountain West river: months `2`, `4`, `8`
- Pacific Northwest river: months `2`, `3`
- Northern California fall overlay: month `10`
- Great Lakes high-water overlay: month `3`
- South-central tailwater overlay: month `6`

2. Trout color-lane polish
- Appalachian tailwater: month `2`
- Northeast freestone: months `9`, `10`, `11`

3. Trout row that still breaks discipline
- Alaska big river: month `6`
  - top-3 primary miss
  - disallowed `mouse_fly` present

4. Western stained summer opener order
- Idaho runoff-edge: months `7`, `8`
  - `paddle_tail_swimbait` is leading where a more trout-specific visible streamer lane should lead

## Anchor Summary

- Appalachian tailwater: `10/12` top-1, `12/12` top-3, `12/12` disallowed, `11/12` color
- Northeast freestone: `10/12` top-1, `12/12` top-3, `12/12` disallowed, `9/12` color
- Mountain West river: `9/12` top-1, `12/12` top-3, `12/12` disallowed, `12/12` color
- Pacific Northwest river: `10/12` top-1, `12/12` top-3, `12/12` disallowed, `12/12` color
- Northern California fall: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- Great Lakes high-water: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- Alaska big river: `2/4` top-1, `3/4` top-3, `3/4` disallowed, `4/4` color
- Idaho runoff-edge: `2/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color
- South-central tailwater: `3/4` top-1, `4/4` top-3, `4/4` disallowed, `4/4` color

## Recommended Next Tuning Order

1. Reduce `hair_jig` top-1 leadership in trout-specific rows without removing it as a valid supporting lane.
2. Remove the Alaska summer `mouse_fly` leak and tighten the whole Alaska summer row.
3. Push Idaho midsummer stained runoff-edge rows toward visible trout streamer lanes over generic swimbait leadership.
4. Polish Northeast fall color precedence so visible fall trout lanes can still land the expected color themes.
