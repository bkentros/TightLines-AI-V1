# Phase 4 First Pass - Lure Daily-Condition Windows

Generated: 2026-04-23

## Scope

This pass adds deterministic daily-condition narrowing for lure recommendations only. It keeps the finalist-pool model intact: hard gates, exact-fit tiers, family diversity, forage, clarity, recency, and deterministic finalist choice remain structural.

## Normalized Inputs

- `regime`: `aggressive | neutral | suppressive`
- `water_clarity`: `clear | stained | dirty`
- `surface_allowed_today`: boolean
- `surface_slot_present`: boolean
- `daylight_wind_mph`: number
- `wind_band`: `calm | breezy | windy`

Wind uses the local hourly mean from 5:00 AM through 9:00 PM local time. Bands are locked as `calm < 6`, `breezy >= 6 and < 12`, and `windy >= 12`. Scalar/current wind is not used as a condition fallback.

## Window Definitions

1. `surface_commitment_window`
   - Fires when surface is allowed, a surface slot exists, regime is aggressive, and wind is not windy.
   - Narrows only to `walking_topwater`, `buzzbait`, `hollow_body_frog` if those lures are already finalists.

2. `wind_reaction_window`
   - Fires when wind is windy and regime is not suppressive.
   - Narrows only to `spinnerbait`, `bladed_jig`, `lipless_crankbait` if those lures are already finalists.

3. `clear_subtle_window`
   - Fires when water clarity is clear, wind is not windy, and regime is not aggressive.
   - Narrows only to `suspending_jerkbait` if it is already a finalist.

Only one active window is used per lure side, in the priority order above.

## Slot Behavior

- Lure recommendations get one deterministic condition slot per report.
- The condition slot is selected from slots `0`, `1`, or `2` and avoids the forage and clarity slots.
- If the active window has no matching finalists in that slot, the selector does nothing.
- Flies receive no condition-window state in this phase.

## Audit Summary

- Exposure audit grid now includes calm, breezy, and windy cases.
- Condition-shaped lure scenarios: `3982`.
- Window counts: `wind_reaction_window=2739`, `clear_subtle_window=620`, `surface_commitment_window=623`.
- Validation counters remained clean: `0` determinism, exact-fit, tier, condition slot, condition multi-shape, condition fly-shape, and condition-window lure violations.

## Deferred

- Fly daily-condition logic.
- Temperature-driven lure windows.
- Pressure, rain, runoff, and flow windows.
- Broader family-level condition expansions.
