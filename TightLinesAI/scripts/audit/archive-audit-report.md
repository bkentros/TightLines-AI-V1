# TightLines AI — Archive-backed How's Fishing Audit
Generated: 2026-03-31T12:41:26.342Z

## Scope

| Metric | Value |
|--------|-------|
| Months audited | Mar, Apr, May, Jun, Jul, Aug |
| Scenarios attempted | 234 |
| Scenarios completed | 223 |
| Scenarios skipped | 11 |
| Core fisheries covered | 38 |
| Coastal runs | 48 |
| Freshwater runs | 175 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.jsonl |

## Salt Temperature Audit

| Metric | Value |
|--------|-------|
| Coastal runs with temperature surfaced anywhere | 27 / 48 (56.3%) |
| Coastal runs with temperature as primary surfaced factor | 0 / 48 (0.0%) |
| Coastal runs where temperature led without tide surfacing | 0 / 48 (0.0%) |
| Low-reliability rows | 0 |
| Rows with data gaps present | 0 |
| Rows with copy-quality flags | 0 |

Interpretation:
- This section is the direct check on whether air temperature is staying secondary in inshore and flats/estuary reports.
- A small number of `COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL` rows is acceptable for unusual archive days, but repeated hits would mean salt thermal weighting or tide sourcing needs another pass.

## Average Score By Fishery

| Fishery | Context | Species | Avg score | Score range | Flags |
|---------|---------|---------|-----------|-------------|-------|
| Charleston Marsh, SC | coastal_flats_estuary | redfish, seatrout | 67.3 | 53-79 | 0/6 |
| Chesapeake Bay, MD | coastal | stripers | 60.3 | 46-67 | 0/6 |
| Chickamauga Lake, TN | freshwater_lake_pond | bass | 48.7 | 38-56 | 0/6 |
| Clear Lake, CA | freshwater_lake_pond | bass | 47.5 | 33-59 | 0/6 |
| Detroit River, MI | freshwater_river | walleye, smallmouth | 57.8 | 40-82 | 0/6 |
| Devils Lake, ND | freshwater_lake_pond | walleye, pike | 40.2 | 35-48 | 0/6 |
| Galveston Bay, TX | coastal | redfish, seatrout | 66.7 | 63-73 | 0/6 |
| Green Bay / Sturgeon Bay, WI | freshwater_lake_pond | walleye, smallmouth, pike | 54.3 | 47-66 | 0/6 |
| Kentucky Lake, KY | freshwater_lake_pond | bass | 47.8 | 35-60 | 0/6 |
| Lake Champlain, NY/VT | freshwater_lake_pond | bass, pike, trout | 54.8 | 30-82 | 0/6 |
| Lake Fork, TX | freshwater_lake_pond | bass | 55.7 | 45-69 | 0/6 |
| Lake Guntersville, AL | freshwater_lake_pond | bass | 52.0 | 43-64 | 0/6 |
| Lake Hartwell, SC | freshwater_lake_pond | bass, stripers | 54.0 | 37-76 | 0/6 |
| Lake Lanier, GA | freshwater_lake_pond | bass, stripers | 52.7 | 45-70 | 0/6 |
| Lake of the Ozarks, MO | freshwater_lake_pond | bass | 60.7 | 53-81 | 0/6 |
| Lake Okeechobee, FL | freshwater_lake_pond | bass | 52.5 | 39-70 | 0/6 |
| Lake St. Clair, MI | freshwater_lake_pond | smallmouth, pike, walleye | 66.0 | 53-80 | 0/3 |
| Lake Texoma, TX | freshwater_lake_pond | stripers, bass | 54.3 | 37-68 | 0/6 |
| Lake Winnipesaukee, NH | freshwater_lake_pond | bass, trout | 54.0 | 39-76 | 0/6 |
| Leech Lake, MN | freshwater_lake_pond | walleye, pike, bass | 54.0 | 35-65 | 0/5 |
| Lower Laguna Madre, TX | coastal_flats_estuary | redfish, seatrout | 64.2 | 59-75 | 0/6 |
| Mille Lacs, MN | freshwater_lake_pond | walleye, smallmouth, pike | 57.6 | 45-69 | 0/5 |
| Mosquito Lagoon, FL | coastal_flats_estuary | redfish, seatrout, snook | 65.0 | 53-75 | 0/6 |
| New River, WV | freshwater_river | bass, trout | 54.0 | 24-78 | 0/6 |
| Oneida Lake, NY | freshwater_lake_pond | walleye, bass, pike | 60.8 | 29-79 | 0/6 |
| Pere Marquette near Baldwin, MI | freshwater_river | trout | 60.2 | 46-75 | 0/6 |
| Pickwick Lake, AL | freshwater_lake_pond | bass | 52.7 | 44-62 | 0/6 |
| Sam Rayburn Reservoir, TX | freshwater_lake_pond | bass | 61.2 | 52-79 | 0/6 |
| San Francisco Bay / Delta, CA | coastal_flats_estuary | stripers | 60.3 | 53-75 | 0/6 |
| Sandy Hook / Raritan Bay, NJ | coastal | stripers | 75.7 | 61-87 | 0/6 |
| Santee Cooper, SC | freshwater_lake_pond | bass, stripers | 59.5 | 32-82 | 0/6 |
| Sebago Lake, ME | freshwater_lake_pond | bass, trout | 53.3 | 41-70 | 0/6 |
| Susquehanna River, PA | freshwater_river | bass, stripers | 53.3 | 32-65 | 0/6 |
| Table Rock Lake, MO | freshwater_lake_pond | bass | 49.5 | 43-58 | 0/6 |
| Tampa Bay, FL | coastal | snook, seatrout, tarpon, redfish | 67.5 | 61-76 | 0/6 |
| Toledo Bend Reservoir, TX | freshwater_lake_pond | bass | 59.7 | 53-77 | 0/6 |
| West Branch Delaware, NY | freshwater_river | trout | 52.0 | 24-72 | 0/6 |
| White River, AR | freshwater_river | trout | 49.8 | 43-55 | 0/6 |

## Average Score By Month

| Month | Runs | Avg score | Avg coastal score | Avg freshwater score | Flagged |
|-------|------|-----------|-------------------|----------------------|---------|
| Mar | 37 | 57.2 | 71.0 | 53.4 | 0 |
| Apr | 37 | 47.5 | 56.4 | 45.0 | 0 |
| May | 38 | 57.9 | 66.1 | 55.7 | 0 |
| Jun | 38 | 54.7 | 64.0 | 52.3 | 0 |
| Jul | 38 | 60.0 | 66.8 | 58.2 | 0 |
| Aug | 35 | 62.9 | 71.0 | 60.5 | 0 |

## Score Band Distribution

| Band | Overall | Lake/Pond | River | Coastal | Flats/Estuary |
|------|---------|-----------|-------|---------|---------------|
| Poor | 16 | 13 | 3 | 0 | 0 |
| Fair | 117 | 87 | 21 | 1 | 8 |
| Good | 83 | 35 | 11 | 21 | 16 |
| Excellent | 7 | 4 | 1 | 2 | 0 |

## Top Flags

None.

## Flagged Rows

No flagged rows.

## Skipped Scenarios

- lake_erie_western_basin-2024-03-16: archive_weather_fetch_failed
- lake_erie_western_basin-2024-04-13: archive_weather_fetch_failed
- lake_erie_western_basin-2024-05-18: archive_weather_fetch_failed
- lake_erie_western_basin-2024-06-15: archive_weather_fetch_failed
- lake_erie_western_basin-2024-07-13: archive_weather_fetch_failed
- lake_erie_western_basin-2024-08-17: archive_weather_fetch_failed
- lake_st_clair-2024-03-16: archive_weather_fetch_failed
- lake_st_clair-2024-04-13: archive_weather_fetch_failed
- lake_st_clair-2024-08-17: archive_weather_fetch_failed
- mille_lacs-2024-08-17: archive_weather_fetch_failed
- leech_lake-2024-08-17: archive_weather_fetch_failed

## Sample Output

### Sandy Hook / Raritan Bay, NJ — 2024-08-17
- Score: 87 (Excellent)
- Summary: A lot is lining up in your favor today. Tidal movement is the clearest reason the day looks this good. The main setup is still useful here, even if the report should stay a little broad.
- Tip: Fish the bait on a controlled drift or swing today. Too much extra rod action will fight the current instead of helping it.
- Timing: Best windows: dawn and afternoon and evening. Weaker: morning. Moving-water windows around 12:30am, around 12:26pm, and around 6:44pm. Fish those turns first; each exchange can open a bite window.
- Drivers: Tide / Current, Temperature
- Suppressors: None
- Flags: None

### Sandy Hook / Raritan Bay, NJ — 2024-07-13
- Score: 83 (Excellent)
- Summary: This is one of the better days on the calendar. Tidal movement is giving the day its clearest advantage. On coastal days, clean decisions usually matter more than extra effort.
- Tip: Keep just enough tension to feel the bait without pulling it out of the natural line of travel.
- Timing: Four exchanges today — key turns around 1:26am, around 7:38am, around 2:11pm, and around 8:19pm. Rotate with the tide; each highlighted band lines up with a real turn.
- Drivers: Tide / Current, Wind
- Suppressors: None
- Flags: None

### Lake Champlain, NY/VT — 2024-08-17
- Score: 82 (Excellent)
- Summary: This looks like a high-end setup. Temperature is doing more than anything else to help the bite. For still water, clean decisions usually matter more than doing too much.
- Tip: Do not over-finesse the first pass. A confident, steady retrieve is a better starting point here.
- Timing: Best windows: afternoon and evening. Weaker: dawn and morning. Some parts of the day stay cloudier than others. Those are your better feeding windows.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Santee Cooper, SC — 2024-03-16
- Score: 82 (Excellent)
- Summary: A lot is lining up in your favor today. Temperature is the main thing pushing the setup in the right direction. Lake days like this usually reward a patient, organized plan.
- Tip: This is a good day to keep the bait moving instead of pausing too long between actions.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Detroit River, MI — 2024-05-18
- Score: 82 (Excellent)
- Summary: This is one of the better days on the calendar. Temperature is giving the day its clearest advantage.
- Tip: Fish with a little more pace than normal. A bait that moves with purpose should get more attention today.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Rain / Runoff
- Suppressors: None
- Flags: None

### Lake of the Ozarks, MO — 2024-06-15
- Score: 81 (Excellent)
- Summary: A lot is lining up in your favor today. Temperature is the main thing pushing the setup in the right direction. Lake days like this usually reward a patient, organized plan.
- Tip: A smooth, active cadence is the clearer first choice today over a slow, stop-heavy presentation.
- Timing: Heavy cloud cover is keeping light low all day. You can fish any window.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Lake St. Clair, MI — 2024-05-18
- Score: 80 (Excellent)
- Summary: This is a standout setup. Temperature is carrying more of the day than anything else. On a lake or pond day, steady adjustments usually beat constant change.
- Tip: Keep the bait lively enough to get noticed. Today favors commitment more than hesitation.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Sam Rayburn Reservoir, TX — 2024-03-16
- Score: 79 (Good)
- Summary: This looks like a fishable day with upside. Temperature is a real plus, while rain is the biggest thing holding the day back.
- Tip: Make the bait easier to notice than normal. Bigger profile and steadier pace usually beat subtle and fast.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Cloud Cover
- Suppressors: Rain
- Flags: None
