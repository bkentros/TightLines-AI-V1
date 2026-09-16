# Species expansion Pass 2 — completion report

**Completed:** September 16, 2026

**Status:** fully implemented, deployed, and verified in private shadow

**Public promotion:** blocked

## Implemented handoff

- 24 new city/species pairings from the completed research pass.
- 33 explicit year-round opportunity modes.
- Four new global profiles and thermal curves: burbot, white perch, white bass, and bluegill.
- Exact city roster totals: Ludington 10, Grand Haven 15, Manistee 12, Frankfort/Elberta 7, Sheboygan 4, Port Washington 4, Milwaukee 4, Racine 5, Kenosha 5, Harbor Beach 7, Oscoda 10, and Port Sanilac 11.
- Four transparent specimen assets mapped into the existing card system.
- Grand Haven's November single-hook restriction exposed as a visible method notice without suppressing the fishery.

## Safety boundaries

All Formula v3 global, pair, profile, database, and UI promotion gates remain
disabled. The production Formula v2 public catalog is unchanged. Existing
Pass 1 and earlier v3 artifacts remain reproducible through an explicit frozen
baseline rather than being silently rewritten by the expanded catalog.

## Verification evidence

- Expansion generator: 24 pairs, 33 modes, four thermal curves.
- Composite v3 config: 94 unique pairs and 179 modes.
- Full-year audit: 171,550 invariant scores and 24,440 weekly replay rows.
- Complete PierCast regression suite: 208 foundation tests plus four standings tests passed.
- Focused v3/API suite: 42 tests passed.
- TypeScript build passed.
- Production run `5e41ef9e-b3bd-4a54-a3a4-2e1a13afcbb3` verified at exactly 470 rows, 94 pairs, 12 cities, five dates, and five lead days.
- Public catalog remained Formula v2 with five cities and roster sizes `[6, 6, 8, 4, 4]`.
- Anonymous private-ledger access remained denied and the owner v3 route remained authorization-gated.

The runtime candidates, mode calibrations, thermal curves, and artwork manifest
in this directory are the deterministic Pass 2 handoff artifacts.
