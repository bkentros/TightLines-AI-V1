# Recommender Historical Audit Report

| Generated at | 2026-04-01T18:43:42.035Z |
| --- | --- |
| Input bundle | scripts/recommenderAudit/generated/sample-historical-scenarios.json |
| Output rows | scripts/recommenderAudit/generated/sample-historical-audit-results.jsonl |
| Scenarios audited | 30 |
| Flagged scenarios | 30 |
| Total flags | 128 |
| High / Medium / Low | 87 / 11 / 30 |

## Top Issues
- FLY_OBSCURE_EXAMPLE: 67
- LURE_GENERIC_EXAMPLE_NAME: 19
- THERMAL_RESPONSE_FLAT: 18
- FLY_GENERIC_EXAMPLE_NAME: 11
- FLY_COLOR_COLLAPSE: 6
- LURE_COLOR_COLLAPSE: 5
- LURE_TOP_PICK_MAJOR_CONTRADICTION: 2

## Species Hotspots
- Redfish: avg 5 flags/scenario, avg 3 high flags/scenario
- Seatrout: avg 5 flags/scenario, avg 2.67 high flags/scenario
- Tarpon: avg 4.67 flags/scenario, avg 3 high flags/scenario
- Largemouth Bass: avg 4 flags/scenario, avg 3 high flags/scenario
- Snook: avg 4 flags/scenario, avg 2.33 high flags/scenario

## Fishery Hotspots
- Tampa Bay, FL: avg 4.67 flags/scenario, avg 2.75 high flags/scenario
- Lake Okeechobee, FL: avg 4 flags/scenario, avg 3 high flags/scenario

## Repeated Behavior Summaries
- 9x | Feeding actively in the upper water column. Staging pre-spawn. | Keying on crawfish with some interest in baitfish and shad. | Surface presentations viable — target transitions and edges. | Lake Okeechobee, FL | Largemouth Bass | 2025-03-01 ; Lake Okeechobee, FL | Largemouth Bass | 2025-03-01 ; Lake Okeechobee, FL | Largemouth Bass | 2025-03-01
- 9x | Sluggish and tight to cover mid-water. Recovering post-spawn. | Keying primarily on baitfish and shad. | Slow finesse presentation tight to cover most likely to draw a strike. | Lake Okeechobee, FL | Largemouth Bass | 2024-07-29 ; Lake Okeechobee, FL | Largemouth Bass | 2024-07-29 ; Lake Okeechobee, FL | Largemouth Bass | 2024-07-29
- 6x | Feeding actively mid-water. | Keying on baitfish and shad with some interest in shrimp. | Surface presentations viable — target transitions and edges. | Tampa Bay, FL | Redfish | 2025-03-12 ; Tampa Bay, FL | Redfish | 2025-03-12 ; Tampa Bay, FL | Redfish | 2025-03-12
- 3x | Sluggish and tight to cover mid-water. | Keying primarily on baitfish and shad. | Slow finesse presentation tight to cover most likely to draw a strike. | Tampa Bay, FL | Snook | 2025-03-12 ; Tampa Bay, FL | Snook | 2025-03-12 ; Tampa Bay, FL | Snook | 2025-03-12
- 3x | Sluggish and tight to cover mid-water. | Keying on baitfish and shad with some interest in crabs. | Slow finesse presentation tight to cover most likely to draw a strike. | Tampa Bay, FL | Tarpon | 2025-03-12 ; Tampa Bay, FL | Tarpon | 2025-03-12 ; Tampa Bay, FL | Tarpon | 2025-03-12

## Overused Lure Examples
- bass jig: 15
- boot tail shad: 15
- curly tail grub: 15
- flipping jig: 15
- football jig: 15
- paddle tail swimbait: 15
- shaky head: 15
- lipless crankbait: 10
- rat l trap style bait: 10
- vibrating lipless bait: 10
- flat side crankbait: 9
- ribbon tail worm: 9
- round bill crankbait: 9
- shallow diver: 9
- squarebill crankbait: 9
- stick worm: 9
- straight tail worm: 9
- weightless worm: 9
- bridge jig: 8
- bucktail jig: 8

## Overused Fly Examples
- clouser minnow: 30
- craft fur streamer: 30
- ep streamer: 30
- lefty s deceiver: 30
- dahlberg diver: 23
- deer hair diver: 23
- foam slider: 23
- sneaky pete: 23
- bunny leech: 12
- muddler minnow: 12
- woolly bugger: 12
- zonker: 12
- bonefish charlie: 11
- crazy charlie: 11
- ep shrimp: 11
- mantis shrimp pattern: 11
- articulated sculpin: 4
- double deceiver: 4
- drunk and disorderly: 4
- foam popper: 4

## Worst Cases To Review
- tampa_bay-2025-03-12-cold-seatrout-stained | Tampa Bay, FL | Seatrout | cold/stained | lure Jerkbait / Fluke | fly Diver / Slider | LURE_COLOR_COLLAPSE, LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME
- lake_okeechobee-2024-03-14-warm-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | warm/clear | lure Jig | fly Woolly Bugger / Leech | LURE_COLOR_COLLAPSE, FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2024-03-14-warm-largemouth_bass-dirty | Lake Okeechobee, FL | Largemouth Bass | warm/dirty | lure Crankbait / Squarebill | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-01-cold-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | cold/clear | lure Jig | fly Woolly Bugger / Leech | LURE_COLOR_COLLAPSE, FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-01-cold-largemouth_bass-dirty | Lake Okeechobee, FL | Largemouth Bass | cold/dirty | lure Crankbait / Squarebill | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-09-normal-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | normal/clear | lure Jig | fly Woolly Bugger / Leech | LURE_COLOR_COLLAPSE, FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-09-normal-largemouth_bass-dirty | Lake Okeechobee, FL | Largemouth Bass | normal/dirty | lure Crankbait / Squarebill | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- tampa_bay-2025-03-12-cold-redfish-clear | Tampa Bay, FL | Redfish | cold/clear | lure Soft Swimbait | fly Baitfish Streamer | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE
- tampa_bay-2025-03-12-cold-redfish-dirty | Tampa Bay, FL | Redfish | cold/dirty | lure Soft Swimbait | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME
- tampa_bay-2025-03-12-cold-redfish-stained | Tampa Bay, FL | Redfish | cold/stained | lure Soft Swimbait | fly Baitfish Streamer | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME
- tampa_bay-2025-03-12-cold-seatrout-clear | Tampa Bay, FL | Seatrout | cold/clear | lure Jig | fly Baitfish Streamer | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE
- tampa_bay-2025-03-12-cold-tarpon-clear | Tampa Bay, FL | Tarpon | cold/clear | lure Shrimp / Crab Soft Plastic | fly Baitfish Streamer | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME
- tampa_bay-2025-03-12-cold-tarpon-stained | Tampa Bay, FL | Tarpon | cold/stained | lure Jig | fly Baitfish Streamer | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE
- lake_okeechobee-2024-03-14-warm-largemouth_bass-stained | Lake Okeechobee, FL | Largemouth Bass | warm/stained | lure Jig | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2024-07-14-normal-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | normal/clear | lure Soft Worm / Stick Worm | fly Woolly Bugger / Leech | FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2024-07-29-cold-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | cold/clear | lure Soft Worm / Stick Worm | fly Woolly Bugger / Leech | FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-01-cold-largemouth_bass-stained | Lake Okeechobee, FL | Largemouth Bass | cold/stained | lure Jig | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-03-09-normal-largemouth_bass-stained | Lake Okeechobee, FL | Largemouth Bass | normal/stained | lure Jig | fly Diver / Slider | LURE_GENERIC_EXAMPLE_NAME, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- lake_okeechobee-2025-07-20-warm-largemouth_bass-clear | Lake Okeechobee, FL | Largemouth Bass | warm/clear | lure Soft Worm / Stick Worm | fly Woolly Bugger / Leech | FLY_COLOR_COLLAPSE, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, THERMAL_RESPONSE_FLAT
- tampa_bay-2025-03-12-cold-snook-dirty | Tampa Bay, FL | Snook | cold/dirty | lure Soft Swimbait | fly Baitfish Streamer | LURE_TOP_PICK_MAJOR_CONTRADICTION, FLY_OBSCURE_EXAMPLE, FLY_OBSCURE_EXAMPLE, FLY_GENERIC_EXAMPLE_NAME
