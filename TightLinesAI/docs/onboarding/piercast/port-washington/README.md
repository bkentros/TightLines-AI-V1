# Port Washington PierCast shadow pilot

Status: private shadow only. Scope version: `piercast-port-washington-shadow-v1`.

## Product boundary

This is one general city-harbor reading for Port Washington, Wisconsin. It
covers the primary public pier/shore areas named in the review catalog:

- Harbor Breakwalls / North Pier, approached through Fisherman's Park
- Coal Dock Park Promenade

It is not a point forecast for either structure. One lakeward LMHOFS surface
cell supplies the temperature input for the city reading. Harbor mixing,
shoreline differences, depth, waves, ice, temporary closures, and current
on-site rules are outside what that cell can resolve.

The city is excluded from the frozen production archive, public catalog,
leaderboard, report/trial path, and daily score snapshot. Owner review reads a
separate expansion archive. Promotion remains blocked while the configuration
is disabled and temperature representation is unapproved.

## Species admission

The shadow roster is Coho Salmon, Chinook Salmon, Steelhead, and Brown Trout.
Wisconsin DNR explicitly identifies salmon, steelhead, and brown trout for the
Port Washington breakwalls. Ozaukee County pier-mode harvest records recurring
harvest for all four, including 2024 harvest of 418 coho, 25 Chinook, 34
rainbow/steelhead, and 316 brown trout.

Yellow Perch remains a conditional research lead without a curve. Every other
retained PierCast species is historical/unresolved and cannot enter the score,
headline, or shadow forecast ledger.

## Seasonal calibration method

The numeric ratings are FinFindr product calibrations—not DNR scores. Curves
combine three layers, in descending locality:

1. Direct current Port Washington pier/shore report evidence.
2. Ozaukee County annual pier-mode harvest evidence.
3. Wisconsin Lake Michigan statewide pier-mode monthly harvest per unit of
   estimated effort for 2022–2024, used only for temporal shape.

Annual county data cannot establish a month, while statewide monthly data
cannot establish a city. Neither is silently treated as structure-specific.
Knots for poorly surveyed November–February periods are deliberately bounded
low-confidence floors. They preserve year-round evaluation without claiming
observed winter catch rates. All four curves are provisional and remain
disabled outside owner-only shadow evaluation.

## Temperature candidate

The reference point is the NOAA Coast Pilot 6 Port Washington Breakwater Light
at 43°23'07"N, 87°51'35"W. The selected LMHOFS regular-grid cell is row 179,
column 21 (43.39, -87.85), 945 m from that reference, surface depth index 0,
with model bathymetry 11.3589 m. A 3×3 neighbor audit found eight wet cells and
one land cell. The selected cell returned plausible, time-consistent values at
forecast hours 1, 24, 72, and 120 during the 2026-09-14 probe.

This confirms deterministic extraction only. No pier-local GLOS validation
series was found, so the representation decision remains
`blocked_insufficient_evidence` pending prospective comparisons.

## Promotion gates

- Accumulate immutable scheduled forecasts before reviewing outcomes.
- Collect documented, effort-aware city-harbor outcomes without cherry-picking.
- Compare the LMHOFS cell with prospective field temperature observations
  across changing winds and harbor/lake mixing regimes.
- Review seasonal residuals by species and lead day under the existing
  prospective evaluation protocol.
- Refresh Wisconsin regulations and access evidence before any pilot/public
  enablement.
- Promotion must be an explicit versioned decision; shadow data never enables
  the city automatically.

Machine-readable evidence, curves, and the grid audit are stored beside this
document.

## Deployment order

1. Apply `20260914120000_port_washington_pier_cast_shadow_pilot.sql`.
2. Deploy `pier-cast-ingest`, then `pier-cast`.
3. Invoke the authenticated ingest operation
   `x-pier-cast-operation: port-washington-shadow` once and verify one archived
   121-sample cycle plus one 20-row shadow forecast run.
4. Confirm Port Washington appears in owner review and remains absent from the
   public catalog and locked daily leaderboard.

The migration schedules subsequent shadow runs at minute 45 after each 00/06/
12/18 UTC LMHOFS cycle. It reuses the existing PierCast Vault secrets and fails
closed when any secret is absent.
