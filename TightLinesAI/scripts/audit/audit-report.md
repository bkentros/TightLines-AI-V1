# TightLines AI — Deterministic Engine Audit
Generated: 2026-03-30T23:40:39.823Z

## Scope

| Metric | Value |
|--------|-------|
| Regions audited | 18 |
| Coastal-eligible regions | 9 |
| Freshwater-only regions | 9 |
| Months audited | Mar, Apr, May, Jun, Jul, Aug |
| Region/context/month combos | 324 |
| Synthetic runs executed | 648 |

Notes:
- Prime and bad temperatures are derived from the live deterministic temperature curves for each region/context/month, not from hard-coded guesses.
- Coastal and flats audits run only for ocean-adjacent regions, matching the product's context-eligibility rule.

## Aggregate Statistics

| Metric | Value |
|--------|-------|
| Prime score avg / min / max | 71.5 / 56 / 75 |
| Bad score avg / min / max | 21.4 / 11 / 30 |
| Prime-bad diff avg / min / max | 50.1 / 35 / 64 |
| Prime scores < 55 | 0 of 324 |
| Bad scores > 65 | 0 of 324 |
| Prime temp suppressor rows | 0 |
| Coastal no-tide rows | 0 |
| River no-runoff rows | 0 |

## Score Tables

### Freshwater Lake / Pond
| Region | Mar P | Mar B | Apr P | Apr B | May P | May B | Jun P | Jun B | Jul P | Jul B | Aug P | Aug B |
|--------|------|------|------|------|------|------|------|------|------|------|------|------|
| northeast                      |   72 |  20  |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |
| southeast_atlantic             |   71 |  20  |   71 |  20  |   71 |  20  |   63 |  21  |   63 |  21  |   63 |  21  |
| florida                        |   71 |  20  |   71 |  20  |   63 |  21  |   56 |  21  |   56 |  21  |   56 |  21  |
| gulf_coast                     |   71 |  20  |   71 |  20  |   63 |  21  |   63 |  21  |   63 |  21  |   63 |  21  |
| great_lakes_upper_midwest      |   72 |  20  |   72 |  19  |   72 |  20  |   72 |  20  |   72 |  21  |   72 |  21  |
| midwest_interior               |   72 |  20  |   72 |  19  |   72 |  20  |   71 |  20  |   64 |  21  |   64 |  21  |
| south_central                  |   71 |  20  |   71 |  20  |   71 |  20  |   63 |  21  |   63 |  21  |   63 |  21  |
| mountain_west                  |   72 |  20  |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |
| southwest_desert               |   71 |  20  |   71 |  20  |   71 |  21  |   63 |  21  |   63 |  21  |   63 |  21  |
| southwest_high_desert          |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |   71 |  21  |
| pacific_northwest              |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |   71 |  21  |
| southern_california            |   72 |  20  |   71 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |   71 |  21  |
| mountain_alpine                |   72 |  20  |   72 |  19  |   72 |  20  |   72 |  20  |   72 |  21  |   72 |  21  |
| northern_california            |   72 |  20  |   71 |  20  |   71 |  20  |   71 |  21  |   63 |  21  |   63 |  21  |
| appalachian                    |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |   71 |  21  |
| inland_northwest               |   72 |  20  |   72 |  20  |   72 |  20  |   71 |  20  |   71 |  21  |   71 |  21  |
| alaska                         |   72 |  20  |   72 |  19  |   72 |  20  |   72 |  20  |   72 |  21  |   72 |  21  |
| hawaii                         |   72 |  20  |   71 |  20  |   71 |  20  |   71 |  21  |   63 |  21  |   63 |  21  |

### Freshwater River
| Region | Mar P | Mar B | Apr P | Apr B | May P | May B | Jun P | Jun B | Jul P | Jul B | Aug P | Aug B |
|--------|------|------|------|------|------|------|------|------|------|------|------|------|
| northeast                      |   74 |  11  |   74 |  11  |   74 |  12  |   73 |  12  |   73 |  13  |   73 |  13  |
| southeast_atlantic             |   74 |  17  |   74 |  18  |   74 |  18  |   67 |  18  |   67 |  18  |   67 |  18  |
| florida                        |   74 |  17  |   74 |  17  |   67 |  17  |   61 |  18  |   61 |  18  |   61 |  18  |
| gulf_coast                     |   74 |  18  |   74 |  18  |   67 |  18  |   67 |  19  |   67 |  19  |   67 |  19  |
| great_lakes_upper_midwest      |   75 |  11  |   74 |  11  |   74 |  11  |   74 |  12  |   73 |  12  |   73 |  12  |
| midwest_interior               |   74 |  11  |   74 |  11  |   74 |  12  |   73 |  12  |   67 |  13  |   67 |  13  |
| south_central                  |   74 |  17  |   74 |  18  |   74 |  18  |   67 |  18  |   67 |  18  |   67 |  18  |
| mountain_west                  |   74 |  17  |   74 |  17  |   74 |  18  |   73 |  18  |   73 |  18  |   73 |  18  |
| southwest_desert               |   74 |  11  |   74 |  12  |   74 |  12  |   67 |  13  |   67 |  13  |   67 |  13  |
| southwest_high_desert          |   74 |  11  |   74 |  12  |   74 |  12  |   73 |  13  |   73 |  13  |   73 |  13  |
| pacific_northwest              |   74 |  12  |   74 |  12  |   74 |  12  |   73 |  13  |   73 |  13  |   73 |  13  |
| southern_california            |   74 |  11  |   74 |  12  |   74 |  12  |   73 |  13  |   73 |  13  |   73 |  13  |
| mountain_alpine                |   75 |  11  |   74 |  11  |   74 |  11  |   74 |  12  |   74 |  12  |   74 |  12  |
| northern_california            |   74 |  11  |   74 |  12  |   74 |  12  |   73 |  13  |   67 |  13  |   67 |  13  |
| appalachian                    |   74 |  11  |   74 |  11  |   74 |  12  |   73 |  12  |   73 |  13  |   73 |  13  |
| inland_northwest               |   74 |  17  |   74 |  17  |   74 |  18  |   73 |  18  |   73 |  18  |   73 |  18  |
| alaska                         |   75 |  11  |   74 |  11  |   74 |  11  |   74 |  12  |   73 |  12  |   73 |  12  |
| hawaii                         |   74 |  17  |   74 |  18  |   74 |  18  |   73 |  18  |   67 |  18  |   67 |  18  |

### Coastal Inshore
| Region | Mar P | Mar B | Apr P | Apr B | May P | May B | Jun P | Jun B | Jul P | Jul B | Aug P | Aug B |
|--------|------|------|------|------|------|------|------|------|------|------|------|------|
| northeast                      |   75 |  29  |   75 |  29  |   74 |  29  |   74 |  29  |   75 |  29  |   75 |  29  |
| southeast_atlantic             |   75 |  29  |   75 |  29  |   74 |  29  |   71 |  29  |   71 |  29  |   71 |  29  |
| florida                        |   75 |  29  |   75 |  29  |   71 |  29  |   71 |  29  |   71 |  29  |   71 |  29  |
| gulf_coast                     |   75 |  29  |   74 |  29  |   74 |  29  |   71 |  29  |   71 |  29  |   71 |  29  |
| pacific_northwest              |   75 |  29  |   75 |  29  |   74 |  29  |   74 |  30  |   74 |  29  |   74 |  29  |
| southern_california            |   75 |  29  |   75 |  29  |   74 |  29  |   74 |  29  |   74 |  29  |   74 |  29  |
| northern_california            |   75 |  29  |   75 |  29  |   74 |  29  |   74 |  30  |   74 |  29  |   74 |  29  |
| alaska                         |   75 |  28  |   75 |  28  |   75 |  29  |   75 |  29  |   75 |  29  |   75 |  29  |
| hawaii                         |   75 |  29  |   75 |  29  |   74 |  29  |   74 |  30  |   71 |  29  |   71 |  29  |

### Flats & Estuary
| Region | Mar P | Mar B | Apr P | Apr B | May P | May B | Jun P | Jun B | Jul P | Jul B | Aug P | Aug B |
|--------|------|------|------|------|------|------|------|------|------|------|------|------|
| northeast                      |   74 |  29  |   74 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |
| southeast_atlantic             |   73 |  30  |   73 |  30  |   73 |  30  |   68 |  30  |   69 |  30  |   69 |  30  |
| florida                        |   74 |  29  |   73 |  30  |   69 |  30  |   69 |  30  |   69 |  29  |   69 |  29  |
| gulf_coast                     |   73 |  30  |   73 |  30  |   73 |  30  |   68 |  30  |   69 |  30  |   69 |  30  |
| pacific_northwest              |   74 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |
| southern_california            |   73 |  30  |   73 |  30  |   73 |  30  |   72 |  30  |   73 |  30  |   73 |  30  |
| northern_california            |   74 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |
| alaska                         |   74 |  29  |   74 |  29  |   74 |  30  |   73 |  30  |   74 |  29  |   74 |  29  |
| hawaii                         |   73 |  30  |   73 |  30  |   73 |  30  |   73 |  30  |   69 |  30  |   69 |  30  |

## Flagged Rows (0)

No anomalies detected.

## Sample Output (May prime rows)

**northeast / freshwater_lake_pond / May (score=72 Good)**
  Temp: 72F (band_score=2.00; band=optimal)
  Summary: This is a day to fish with confidence. Temperature is giving the day its clearest advantage. On still water, simple execution usually beats forcing things. The call is still useful, but one or two inputs were thinner than usual.
  Tip: Start with a more active retrieve today. A steady medium pace is a better starting point than dragging it too slowly.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 72°F air — well inside the seasonal sweet spot

**northeast / freshwater_river / May (score=74 Good)**
  Temp: 72F (band_score=2.00; band=optimal)
  Summary: This is a dependable setup overall. Temperature is the main thing pushing the setup in the right direction. In moving water, clean decisions usually beat rushed ones. The signal is good, but not as complete as it could be.
  Tip: A smooth, active cadence is the clearer first choice today over a slow, stop-heavy presentation.
  Drivers: temperature_condition(Temperature), runoff_flow_disruption(Rain / Runoff)
  Suppressors: none
  Thermal plain: 72°F air — well inside the seasonal sweet spot

**northeast / coastal / May (score=74 Good)**
  Temp: 70F (band_score=2.00; band=optimal)
  Summary: This looks like a fishable day with upside. Tidal movement is doing more than anything else to help the bite. Coastal setups like this usually reward staying disciplined once the window shows up.
  Tip: Keep the presentation simple in current: cast at an angle, maintain steady contact, and let the bait travel naturally with the flow.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 70°F air — well inside the seasonal sweet spot

**northeast / coastal_flats_estuary / May (score=73 Good)**
  Temp: 70F (band_score=2.00; band=optimal)
  Summary: This is a day to fish with confidence. Tidal movement is doing the most to keep the outlook favorable. Key inputs were limited, so treat this as a broad read rather than a precise one.
  Tip: Fish the bait on a controlled drift or swing today. Too much extra rod action will fight the current instead of helping it.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 70°F air — well inside the seasonal sweet spot

**southeast_atlantic / freshwater_lake_pond / May (score=71 Good)**
  Temp: 80F (band_score=2.00; band=optimal)
  Summary: This is a day to fish with confidence. Temperature is doing the most to keep the outlook favorable.
  Tip: Start with a more active retrieve today. A steady medium pace is a better starting point than dragging it too slowly.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 80°F air — well inside the seasonal sweet spot

**southeast_atlantic / freshwater_river / May (score=74 Good)**
  Temp: 80F (band_score=2.00; band=optimal)
  Summary: The day looks solid overall. Temperature is doing the most to keep the outlook favorable.
  Tip: Fish with a little more pace than normal. A bait that moves with purpose should get more attention today.
  Drivers: temperature_condition(Temperature), runoff_flow_disruption(Rain / Runoff)
  Suppressors: none
  Thermal plain: 80°F air — well inside the seasonal sweet spot

**southeast_atlantic / coastal / May (score=74 Good)**
  Temp: 84F (band_score=2.00; band=optimal)
  Summary: This looks like a solid fishing day. Tidal movement is the main thing pushing the setup in the right direction.
  Tip: A clean swing is better than a busy retrieve here. Cast across the flow, stay in touch, and let the current move the bait.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 84°F air — well inside the seasonal sweet spot

**southeast_atlantic / coastal_flats_estuary / May (score=73 Good)**
  Temp: 84F (band_score=2.00; band=optimal)
  Summary: The setup is mostly helpful today. Tidal movement is the clearest reason the day looks this good. In a flats setup, clean execution usually matters more than forcing the pace.
  Tip: Do less with the rod and more with the angle. A natural sweep through the current will look better than constant twitching.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 84°F air — well inside the seasonal sweet spot

**florida / freshwater_lake_pond / May (score=63 Good)**
  Temp: 86F (band_score=1.00; band=optimal)
  Summary: The day looks solid overall. Temperature is giving the day its clearest advantage. On still water, simple execution usually beats forcing things.
  Tip: Start with a more active retrieve today. A steady medium pace is a better starting point than dragging it too slowly.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 86°F air — well inside the seasonal sweet spot

**florida / freshwater_river / May (score=67 Good)**
  Temp: 86F (band_score=1.00; band=optimal)
  Summary: Today's conditions give you a good shot. Runoff is doing more than anything else to help the bite. This is still useful, just a little broader than the cleanest version of the report.
  Tip: On a balanced day, a simple medium-speed retrieve is a better starting point than something extreme.
  Drivers: runoff_flow_disruption(Rain / Runoff), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 86°F air — well inside the seasonal sweet spot

**florida / coastal / May (score=71 Good)**
  Temp: 88F (band_score=1.00; band=optimal)
  Summary: This is a dependable setup overall. Tidal movement is the main thing pushing the setup in the right direction. For inshore water, a simple plan usually holds up better than forcing it. Important inputs were thinner than usual, so this is more directional than exact today.
  Tip: Do less with the rod and more with the angle. A natural sweep through the current will look better than constant twitching.
  Drivers: tide_current_movement(Tide / Current), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 88°F air — well inside the seasonal sweet spot

**florida / coastal_flats_estuary / May (score=69 Good)**
  Temp: 88F (band_score=1.00; band=optimal)
  Summary: More is helping than hurting today. Tidal movement is doing a lot of the heavy work today.
  Tip: Use the current as part of the retrieve: cast a little uptide, let the bait swing, and add only small corrections.
  Drivers: tide_current_movement(Tide / Current), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 88°F air — well inside the seasonal sweet spot

**gulf_coast / freshwater_lake_pond / May (score=63 Good)**
  Temp: 84F (band_score=1.00; band=optimal)
  Summary: The overall picture leans your way today. Temperature is doing a lot of the heavy work today. On a lake or pond day, steady adjustments usually beat constant change. A couple of inputs were limited, so treat this as a slightly broader read.
  Tip: Try a medium, consistent retrieve before you slow all the way down. The fish look willing to move today.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 84°F air — well inside the seasonal sweet spot

**gulf_coast / freshwater_river / May (score=67 Good)**
  Temp: 84F (band_score=1.00; band=optimal)
  Summary: The setup is mostly helpful today. Runoff is the main thing pushing the setup in the right direction.
  Tip: Keep the presentation clean and repeatable: moderate pace, clear pauses, and a profile that looks easy to trust.
  Drivers: runoff_flow_disruption(Rain / Runoff), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 84°F air — well inside the seasonal sweet spot

**gulf_coast / coastal / May (score=74 Good)**
  Temp: 86F (band_score=2.00; band=optimal)
  Summary: More is helping than hurting today. Tidal movement is helping the most in the report today.
  Tip: A clean swing is better than a busy retrieve here. Cast across the flow, stay in touch, and let the current move the bait.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 86°F air — well inside the seasonal sweet spot

**gulf_coast / coastal_flats_estuary / May (score=73 Good)**
  Temp: 86F (band_score=2.00; band=optimal)
  Summary: Conditions are giving you something to work with. Tidal movement is doing a lot of the heavy work today.
  Tip: Do less with the rod and more with the angle. A natural sweep through the current will look better than constant twitching.
  Drivers: tide_current_movement(Tide / Current), temperature_condition(Temperature)
  Suppressors: none
  Thermal plain: 86°F air — well inside the seasonal sweet spot

**great_lakes_upper_midwest / freshwater_lake_pond / May (score=72 Good)**
  Temp: 66F (band_score=2.00; band=optimal)
  Summary: More is helping than hurting today. Temperature is doing a lot of the heavy work today. A couple of inputs were limited, so treat this as a slightly broader read.
  Tip: Keep the bait lively enough to get noticed. Today favors commitment more than hesitation.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 66°F air — well inside the seasonal sweet spot

**great_lakes_upper_midwest / freshwater_river / May (score=74 Good)**
  Temp: 66F (band_score=2.00; band=optimal)
  Summary: Today's conditions give you a good shot. Temperature is the biggest reason the day feels more open than tight. Some input coverage was lighter than usual, so keep the read a little broad.
  Tip: A cleaner, more active cadence makes sense today. Let the bait travel and trust the movement.
  Drivers: temperature_condition(Temperature), runoff_flow_disruption(Rain / Runoff)
  Suppressors: none
  Thermal plain: 66°F air — well inside the seasonal sweet spot

**midwest_interior / freshwater_lake_pond / May (score=72 Good)**
  Temp: 76F (band_score=2.00; band=optimal)
  Summary: This looks like a fishable day with upside. Temperature is doing more than anything else to help the bite.
  Tip: A cleaner, more active cadence makes sense today. Let the bait travel and trust the movement.
  Drivers: temperature_condition(Temperature), wind_condition(Wind)
  Suppressors: none
  Thermal plain: 76°F air — well inside the seasonal sweet spot

**midwest_interior / freshwater_river / May (score=74 Good)**
  Temp: 76F (band_score=2.00; band=optimal)
  Summary: This looks like a solid fishing day. Temperature is the clearest reason the day looks this good. In moving water, clean decisions usually beat rushed ones.
  Tip: Start one gear faster than your conservative setting and only slow down if the water tells you to.
  Drivers: temperature_condition(Temperature), runoff_flow_disruption(Rain / Runoff)
  Suppressors: none
  Thermal plain: 76°F air — well inside the seasonal sweet spot
