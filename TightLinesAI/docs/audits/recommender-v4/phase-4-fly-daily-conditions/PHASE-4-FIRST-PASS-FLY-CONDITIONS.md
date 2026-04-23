# Phase 4 Fly First Pass - Daily-Condition Windows

Generated: 2026-04-23

## Scope

This pass adds deterministic daily-condition narrowing for fly recommendations only. It keeps the finalist-pool architecture intact: hard gates, exact-fit tiers, family diversity, forage, clarity, recency, and deterministic finalist choice remain structural.

## Normalized Inputs

- `regime`
- `surface_allowed_today`
- `surface_slot_present`
- `daylight_wind_mph`
- `wind_band`
- `species`
- `context`
- `month`

Wind uses the same local hourly mean from 5:00 AM through 9:00 PM local time, with locked bands `calm < 6`, `breezy >= 6 and < 12`, and `windy >= 12`.

## Window Definitions

1. `trout_mouse_window`
   - Fires only for trout rivers in June-August when surface is allowed, a surface slot exists, regime is aggressive, and wind is calm.
   - Narrows only to `mouse_fly` if it is already a finalist in the deterministic fly condition slot.

2. `surface_commitment_fly_window`
   - Fires when surface is allowed, a surface slot exists, regime is aggressive, and wind is not windy.
   - Narrows only to `popper_fly`, `frog_fly`, or `deer_hair_slider` if those flies are already finalists in the deterministic fly condition slot.

Only one fly window is active per report, in the priority order above.

## Slot Behavior

- Fly recommendations get one deterministic condition slot per report.
- The slot avoids the fly forage slot and the fly clarity slot.
- If the active window has no matching finalists in that slot, the selector does nothing.
- Condition-shaped fly reports: 657/39906 (1.6%).

## Audit Summary

- `trout_mouse_window`: 37/123 shaped.
- `surface_commitment_fly_window`: 620/2121 shaped.
- Same-slot forage/condition conflicts: 0
- Same-slot clarity/condition conflicts: 0

## Deferred

- Streamer/leech condition windows.
- Temperature-driven fly logic.
- Flow/runoff/rain windows.
- Broader fly visibility/reaction shaping.
