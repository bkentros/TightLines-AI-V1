# Phase 4B Forage Cleanup

Generated: 2026-04-23

## Policy

- Forage still applies to one deterministic slot per side.
- Forage now uses `primary_forage` only.
- `secondary_forage` no longer affects finalist narrowing.
- Forage now narrows only when the primary-forage matches form a strict subset of the slot finalist pool.

## Before vs After

- Lure-side forage shaping dropped from `38,989 / 39,906` reports (`97.7%`) to `14,158 / 39,906` (`35.5%`).
- That is a reduction of `24,831` lure reports, or `62.2` percentage points.
- Clarity shaping was unchanged at `7,750 / 39,906` (`19.4%`).
- Lure condition shaping was unchanged at `3,948 / 39,906` (`9.9%`).

## Validation

- Determinism remained clean: `0` mismatches.
- Exact-fit / best-tier / legality stayed untouched through the existing trace checks.
- Condition windows remained unaffected: same active and shaped counts as the pre-cleanup Phase 4A run.
- Same-slot forage/condition and forage/clarity conflicts remained `0`.
- Focused tests now cover:
  - forage narrows only on its deterministic slot
  - secondary forage does not narrow
  - strict-subset primary-forage narrowing only

## Takeaway

This cleanup made forage materially less prevalent without changing clarity, daily-condition windows, determinism, or lane correctness. The lure-side selector is cleaner and more subordinate heading into fly-side condition work.
