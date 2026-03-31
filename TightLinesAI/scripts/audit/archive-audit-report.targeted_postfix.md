# TightLines AI — Archive-backed How's Fishing Audit
Generated: 2026-03-31T12:32:37.002Z

## Scope

| Metric | Value |
|--------|-------|
| Months audited | Mar, Apr, May, Jun, Jul, Aug |
| Scenarios attempted | 15 |
| Scenarios completed | 15 |
| Scenarios skipped | 0 |
| Core fisheries covered | 12 |
| Coastal runs | 1 |
| Freshwater runs | 14 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.targeted_postfix.jsonl |

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
| Chickamauga Lake, TN | freshwater_lake_pond | bass | 49.0 | 49-49 | 0/1 |
| Kentucky Lake, KY | freshwater_lake_pond | bass | 44.0 | 42-46 | 0/2 |
| Lake Guntersville, AL | freshwater_lake_pond | bass | 50.0 | 50-50 | 0/1 |
| Lake Hartwell, SC | freshwater_lake_pond | bass, stripers | 55.0 | 55-55 | 0/1 |
| Lake Okeechobee, FL | freshwater_lake_pond | bass | 48.0 | 48-48 | 0/1 |
| Lower Laguna Madre, TX | coastal_flats_estuary | redfish, seatrout | 66.0 | 66-66 | 0/1 |
| Pickwick Lake, AL | freshwater_lake_pond | bass | 44.0 | 44-44 | 0/1 |
| Sam Rayburn Reservoir, TX | freshwater_lake_pond | bass | 52.0 | 52-52 | 0/1 |
| Susquehanna River, PA | freshwater_river | bass, stripers | 51.0 | 51-51 | 0/1 |
| Table Rock Lake, MO | freshwater_lake_pond | bass | 49.5 | 43-56 | 0/2 |
| Toledo Bend Reservoir, TX | freshwater_lake_pond | bass | 53.0 | 53-53 | 0/1 |
| White River, AR | freshwater_river | trout | 45.5 | 43-48 | 0/2 |

## Average Score By Month

| Month | Runs | Avg score | Avg coastal score | Avg freshwater score | Flagged |
|-------|------|-----------|-------------------|----------------------|---------|
| Mar | 1 | 66.0 | 66.0 | 0.0 | 0 |
| Apr | 2 | 43.0 | 0.0 | 43.0 | 0 |
| May | 5 | 49.4 | 0.0 | 49.4 | 0 |
| Jun | 1 | 48.0 | 0.0 | 48.0 | 0 |
| Jul | 6 | 49.8 | 0.0 | 49.8 | 0 |

## Score Band Distribution

| Band | Overall | Lake/Pond | River | Coastal | Flats/Estuary |
|------|---------|-----------|-------|---------|---------------|
| Poor | 0 | 0 | 0 | 0 | 0 |
| Fair | 14 | 11 | 3 | 0 | 0 |
| Good | 1 | 0 | 0 | 0 | 1 |
| Excellent | 0 | 0 | 0 | 0 | 0 |

## Top Flags

None.

## Flagged Rows

No flagged rows.

## Skipped Scenarios

None.

## Sample Output

### Lower Laguna Madre, TX — 2024-03-16
- Score: 66 (Good)
- Summary: This is a dependable setup overall. Tidal movement is the clearest reason the day looks this good.
- Tip: Start with a slightly uptide cast and let the bait track across the flow before you speed it up or add extra movement.
- Timing: Best windows: dawn and afternoon. Weaker: morning and evening. Best opportunities near around 2:34am and around 1:29pm around the tide changes. Fish the moving water there; slack in between is slower.
- Drivers: Tide / Current, Temperature
- Suppressors: None
- Flags: None

### Table Rock Lake, MO — 2024-07-13
- Score: 56 (Fair)
- Summary: This is a day for patience and good decisions. Cloud cover is the clearest positive, while temperature is the clearest problem.
- Tip: Go one step more controlled than an all-green day: clean cadence, light adjustments, and no extra speed.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Fish the edges — dawn and evening are your best bets when other signals are flat.
- Drivers: Cloud Cover, Wind
- Suppressors: Temperature
- Flags: None

### Lake Hartwell, SC — 2024-05-18
- Score: 55 (Fair)
- Summary: There is enough here to stay interested, but not enough to get careless. Cloud cover is the reason this still looks fishable, and temperature is the reason it is not better.
- Tip: Keep the bait easy to track and easy to trust. Temperature is near the zone, but not helping enough for a busy retrieve.
- Timing: Best windows: dawn and morning. Weaker: afternoon and evening. Cloud cover is uneven through the day. The thickest low-light stretch sits in these windows, so lean on them more than the brighter gaps.
- Drivers: Cloud Cover, Wind
- Suppressors: Temperature
- Flags: None

### Toledo Bend Reservoir, TX — 2024-07-13
- Score: 53 (Fair)
- Summary: You can fish this day, but you will need to stay sharp. Cloud cover is the clearest positive, while temperature is the clearest problem.
- Tip: Go one step more controlled than an all-green day: clean cadence, light adjustments, and no extra speed.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Fish the edges — dawn and evening are your best bets when other signals are flat.
- Drivers: Cloud Cover, Wind
- Suppressors: Temperature
- Flags: None

### Sam Rayburn Reservoir, TX — 2024-07-13
- Score: 52 (Fair)
- Summary: The setup gives you a chance, but not much room for mistakes. Cloud cover is a real plus, while temperature is the biggest thing holding the day back.
- Tip: Temperature is close but not fully helping, so start with a slightly slower, cleaner presentation than your default.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Fish the edges — dawn and evening are your best bets when other signals are flat.
- Drivers: Cloud Cover, Wind
- Suppressors: Temperature
- Flags: None

### Susquehanna River, PA — 2024-05-18
- Score: 51 (Fair)
- Summary: There is enough here to stay interested, but not enough to get careless. Cloud cover is the reason this still looks fishable, and temperature is the reason it is not better.
- Tip: This is a good day to stay just a touch more patient than normal: clean pace, softer moves, and no wasted action.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Cloud Cover
- Suppressors: Temperature
- Flags: None

### Lake Guntersville, AL — 2024-05-18
- Score: 50 (Fair)
- Summary: This is a day for patience and good decisions. Cloud cover is the clearest positive, while temperature is the clearest problem. On a lake or pond day, steady adjustments usually beat constant change.
- Tip: Do not force the presentation. A smooth, slightly slower retrieve is the better starting point when temperature is only close.
- Timing: Best windows: dawn and morning. Weaker: afternoon and evening. Cloud cover is uneven through the day. The thickest low-light stretch sits in these windows, so lean on them more than the brighter gaps.
- Drivers: Cloud Cover, Wind
- Suppressors: Temperature, Rain
- Flags: None

### Chickamauga Lake, TN — 2024-07-13
- Score: 49 (Fair)
- Summary: There is enough here to stay interested, but not enough to get careless. Wind is helping the day, but temperature is still making things harder.
- Tip: Keep the bait easy to track and easy to trust. Temperature is near the zone, but not helping enough for a busy retrieve.
- Timing: Best windows: dawn and evening. Weaker: morning and afternoon. Fish the edges — dawn and evening are your best bets when other signals are flat.
- Drivers: Wind
- Suppressors: Temperature
- Flags: None
