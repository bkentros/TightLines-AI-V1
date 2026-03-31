# TightLines AI — Archive-backed How's Fishing Audit
Generated: 2026-03-31T12:33:28.636Z

## Scope

| Metric | Value |
|--------|-------|
| Months audited | Sep, Nov, Dec |
| Scenarios attempted | 3 |
| Scenarios completed | 3 |
| Scenarios skipped | 0 |
| Core fisheries covered | 3 |
| Coastal runs | 1 |
| Freshwater runs | 2 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.targeted_postfix_cold.jsonl |

## Salt Temperature Audit

| Metric | Value |
|--------|-------|
| Coastal runs with temperature surfaced anywhere | 1 / 1 (100.0%) |
| Coastal runs with temperature as primary surfaced factor | 0 / 1 (0.0%) |
| Coastal runs where temperature led without tide surfacing | 0 / 1 (0.0%) |
| Low-reliability rows | 0 |
| Rows with data gaps present | 0 |
| Rows with copy-quality flags | 0 |

Interpretation:
- This section is the direct check on whether air temperature is staying secondary in inshore and flats/estuary reports.
- A small number of `COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL` rows is acceptable for unusual archive days, but repeated hits would mean salt thermal weighting or tide sourcing needs another pass.

## Average Score By Fishery

| Fishery | Context | Species | Avg score | Score range | Flags |
|---------|---------|---------|-----------|-------------|-------|
| Lake Champlain, NY/VT | freshwater_lake_pond | bass, pike, trout | 47.0 | 47-47 | 0/1 |
| Lower Laguna Madre, TX | coastal_flats_estuary | redfish, seatrout | 75.0 | 75-75 | 0/1 |
| White River, AR | freshwater_river | trout | 48.0 | 48-48 | 0/1 |

## Average Score By Month

| Month | Runs | Avg score | Avg coastal score | Avg freshwater score | Flagged |
|-------|------|-----------|-------------------|----------------------|---------|
| Sep | 1 | 48.0 | 0.0 | 48.0 | 0 |
| Nov | 1 | 47.0 | 0.0 | 47.0 | 0 |
| Dec | 1 | 75.0 | 75.0 | 0.0 | 0 |

## Score Band Distribution

| Band | Overall | Lake/Pond | River | Coastal | Flats/Estuary |
|------|---------|-----------|-------|---------|---------------|
| Poor | 0 | 0 | 0 | 0 | 0 |
| Fair | 2 | 1 | 1 | 0 | 0 |
| Good | 1 | 0 | 0 | 0 | 1 |
| Excellent | 0 | 0 | 0 | 0 | 0 |

## Top Flags

None.

## Flagged Rows

No flagged rows.

## Skipped Scenarios

None.

## Sample Output

### Lower Laguna Madre, TX — 2024-12-14
- Score: 75 (Good)
- Summary: The setup is mostly helpful today. Tidal movement is the main thing pushing the setup in the right direction. This is a trustworthy read, but it is better as direction than over-precision.
- Tip: Use the current as part of the retrieve: cast a little uptide, let the bait swing, and add only small corrections.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Tide / Current, Temperature
- Suppressors: None
- Flags: None

### White River, AR — 2024-09-14
- Score: 48 (Fair)
- Summary: This is a day for patience and good decisions. Cloud cover is the clearest positive, while temperature is the clearest problem. On a river day, staying disciplined usually matters more than covering too much water.
- Tip: Do not force the presentation. A smooth, slightly slower retrieve is the better starting point when temperature is only close.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Fish the edges — dawn and evening are your best bets when other signals are flat.
- Drivers: Cloud Cover
- Suppressors: Temperature
- Flags: None

### Lake Champlain, NY/VT — 2024-11-16
- Score: 47 (Fair)
- Summary: Some things are helping, and some are getting in the way. Wind gives you a real opening, although temperature still keeps the day tight.
- Tip: This is a good day to stay just a touch more patient than normal: clean pace, softer moves, and no wasted action.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Clear skies mean sharp light transitions. Dawn and evening are your prime windows.
- Drivers: Wind
- Suppressors: Temperature, Cloud Cover
- Flags: None
