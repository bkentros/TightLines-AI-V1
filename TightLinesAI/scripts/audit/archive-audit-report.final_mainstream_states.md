# TightLines AI — Archive-backed How's Fishing Audit
Generated: 2026-03-31T12:55:04.918Z

## Scope

| Metric | Value |
|--------|-------|
| Months audited | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Scenarios attempted | 300 |
| Scenarios completed | 300 |
| Scenarios skipped | 0 |
| Core fisheries covered | 25 |
| Coastal runs | 36 |
| Freshwater runs | 264 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/archive-audit-results.final_mainstream_states.jsonl |

## Salt Temperature Audit

| Metric | Value |
|--------|-------|
| Coastal runs with temperature surfaced anywhere | 17 / 36 (47.2%) |
| Coastal runs with temperature as primary surfaced factor | 0 / 36 (0.0%) |
| Coastal runs where temperature led without tide surfacing | 0 / 36 (0.0%) |
| Low-reliability rows | 0 |
| Rows with data gaps present | 0 |
| Rows with copy-quality flags | 0 |

Interpretation:
- This section is the direct check on whether air temperature is staying secondary in inshore and flats/estuary reports.
- A small number of `COASTAL_TEMP_PRIMARY_NO_TIDE_SIGNAL` rows is acceptable for unusual archive days, but repeated hits would mean salt thermal weighting or tide sourcing needs another pass.

## Average Score By Fishery

| Fishery | Context | Species | Avg score | Score range | Flags |
|---------|---------|---------|-----------|-------------|-------|
| Charleston Marsh, SC | coastal_flats_estuary | redfish, seatrout | 65.2 | 53-79 | 0/12 |
| Detroit River, MI | freshwater_river | walleye, smallmouth | 57.8 | 40-82 | 0/12 |
| Fox Chain O'Lakes, IL | freshwater_lake_pond | bass, pike | 58.8 | 27-78 | 0/12 |
| Green Bay / Sturgeon Bay, WI | freshwater_lake_pond | walleye, smallmouth, pike | 53.6 | 31-80 | 0/12 |
| Jordan Lake, NC | freshwater_lake_pond | bass | 52.8 | 36-72 | 0/12 |
| Lake Champlain, NY/VT | freshwater_lake_pond | bass, pike, trout | 51.0 | 27-82 | 0/12 |
| Lake Erie Western Basin, OH | freshwater_lake_pond | walleye, smallmouth, pike | 57.7 | 33-79 | 0/12 |
| Lake Guntersville, AL | freshwater_lake_pond | bass | 49.9 | 40-64 | 0/12 |
| Lake Hartwell, SC | freshwater_lake_pond | bass, stripers | 52.8 | 37-76 | 0/12 |
| Lake Lanier, GA | freshwater_lake_pond | bass, stripers | 49.2 | 30-70 | 0/12 |
| Lake Okeechobee, FL | freshwater_lake_pond | bass | 55.4 | 39-72 | 0/12 |
| Lake St. Clair, MI | freshwater_lake_pond | smallmouth, pike, walleye | 58.6 | 33-80 | 0/12 |
| Lake Wawasee, IN | freshwater_lake_pond | bass, pike | 58.1 | 31-74 | 0/12 |
| Leech Lake, MN | freshwater_lake_pond | walleye, pike, bass | 51.8 | 32-69 | 0/12 |
| Mille Lacs, MN | freshwater_lake_pond | walleye, smallmouth, pike | 53.8 | 27-72 | 0/12 |
| Mosquito Lagoon, FL | coastal_flats_estuary | redfish, seatrout, snook | 65.4 | 53-75 | 0/12 |
| Oneida Lake, NY | freshwater_lake_pond | walleye, bass, pike | 54.8 | 29-79 | 0/12 |
| Pere Marquette near Baldwin, MI | freshwater_river | trout | 58.5 | 41-75 | 0/12 |
| Pickwick Lake, AL | freshwater_lake_pond | bass | 51.0 | 30-66 | 0/12 |
| Santee Cooper, SC | freshwater_lake_pond | bass, stripers | 60.4 | 32-82 | 0/12 |
| Sebago Lake, ME | freshwater_lake_pond | bass, trout | 51.5 | 28-78 | 0/12 |
| Smith Mountain Lake, VA | freshwater_lake_pond | bass | 52.8 | 35-76 | 0/12 |
| Susquehanna River, PA | freshwater_river | bass, stripers | 52.5 | 32-74 | 0/12 |
| Tampa Bay, FL | coastal | snook, seatrout, tarpon, redfish | 64.3 | 46-76 | 0/12 |
| West Branch Delaware, NY | freshwater_river | trout | 46.3 | 21-72 | 0/12 |

## Average Score By Month

| Month | Runs | Avg score | Avg coastal score | Avg freshwater score | Flagged |
|-------|------|-----------|-------------------|----------------------|---------|
| Jan | 25 | 42.3 | 65.7 | 39.1 | 0 |
| Feb | 25 | 43.0 | 59.7 | 40.7 | 0 |
| Mar | 25 | 56.4 | 76.7 | 53.6 | 0 |
| Apr | 25 | 45.1 | 56.3 | 43.5 | 0 |
| May | 25 | 62.7 | 70.0 | 61.7 | 0 |
| Jun | 25 | 56.0 | 63.7 | 54.9 | 0 |
| Jul | 25 | 63.0 | 69.3 | 62.1 | 0 |
| Aug | 25 | 64.4 | 63.7 | 64.5 | 0 |
| Sep | 25 | 65.9 | 58.7 | 66.9 | 0 |
| Oct | 25 | 59.9 | 67.7 | 58.9 | 0 |
| Nov | 25 | 57.6 | 61.0 | 57.1 | 0 |
| Dec | 25 | 48.1 | 67.3 | 45.5 | 0 |

## Score Band Distribution

| Band | Overall | Lake/Pond | River | Coastal | Flats/Estuary |
|------|---------|-----------|-------|---------|---------------|
| Poor | 40 | 32 | 8 | 0 | 0 |
| Fair | 136 | 109 | 22 | 2 | 3 |
| Good | 119 | 71 | 17 | 10 | 21 |
| Excellent | 5 | 4 | 1 | 0 | 0 |

## Top Flags

None.

## Flagged Rows

No flagged rows.

## Skipped Scenarios

None.

## Sample Output

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

### Lake St. Clair, MI — 2024-05-18
- Score: 80 (Excellent)
- Summary: This is a standout setup. Temperature is carrying more of the day than anything else. On a lake or pond day, steady adjustments usually beat constant change.
- Tip: Keep the bait lively enough to get noticed. Today favors commitment more than hesitation.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Green Bay / Sturgeon Bay, WI — 2024-09-14
- Score: 80 (Excellent)
- Summary: A lot is lining up in your favor today. Temperature is the main thing pushing the setup in the right direction.
- Tip: Start one gear faster than your conservative setting and only slow down if the water tells you to.
- Timing: Best windows: afternoon and evening. Weaker: dawn and morning. Some parts of the day stay cloudier than others. Those are your better feeding windows.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Lake Erie Western Basin, OH — 2024-05-18
- Score: 79 (Good)
- Summary: The day looks solid overall. Temperature is doing the most to keep the outlook favorable. On still water, simple execution usually beats forcing things.
- Tip: Start with a more active retrieve today. A steady medium pace is a better starting point than dragging it too slowly.
- Timing: Best windows: morning and afternoon. Weaker: dawn and evening. The middle of the day is where conditions line up best today.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None

### Oneida Lake, NY — 2024-07-13
- Score: 79 (Good)
- Summary: This is a day to fish with confidence. Temperature is doing the most to keep the outlook favorable. On still water, simple execution usually beats forcing things.
- Tip: This looks more like a controlled movement day than a dead-stick day.
- Timing: Best windows: morning. Hourly cloud cover shows where low light lasts the longest. Target those stretches instead of treating the whole day the same.
- Drivers: Temperature, Wind
- Suppressors: None
- Flags: None

### Oneida Lake, NY — 2024-08-17
- Score: 79 (Good)
- Summary: More is helping than hurting today. Temperature is carrying more of the day than anything else.
- Tip: Keep the bait lively enough to get noticed. Today favors commitment more than hesitation.
- Timing: Best windows: afternoon and evening. Weaker: dawn and morning. Some parts of the day stay cloudier than others. Those are your better feeding windows.
- Drivers: Temperature, Cloud Cover
- Suppressors: None
- Flags: None
