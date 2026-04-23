# Pre-Phase-4 Seasonal Cleanup

Date: 2026-04-23

## Changes

- Removed `spinnerbait`, `buzzbait`, and `blade_bait` from trout seasonal source rows.
- Regenerated v4 seasonal row outputs from `data/seasonal-matrix/*.csv`.
- Narrowed largemouth `casting_spoon` source-row usage from 384 rows to 84 rows.

## Largemouth `casting_spoon` Keep Rule

`casting_spoon` remains only where all of these are true:

- `primary_forage` is `baitfish`
- `surface_seasonally_possible` is `false`
- month is in `1`, `2`, `3`, `10`, `11`, or `12`

That keeps spoon usage in cold/fall, baitfish-oriented, non-surface largemouth contexts rather than treating it as a universal bass bait.

## Validation Counts

- Trout `spinnerbait`: `0 / 168` generated rows
- Trout `buzzbait`: `0 / 168` generated rows
- Trout `blade_bait`: `0 / 168` generated rows
- Largemouth `casting_spoon`: `84 / 384` generated rows
