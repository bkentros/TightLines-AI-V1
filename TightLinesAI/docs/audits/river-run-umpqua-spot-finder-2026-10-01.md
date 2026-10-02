# Umpqua Spot Finder access audit — 2026-10-01

## Outcome

The River Run Spot Finder inventory now contains 17 public access points for the
Umpqua River (Mainstem) and 17 for the North Umpqua River. Every supported
lower, middle, and upper section has at least one access point. The prior
inventory contained one point per section, or three per river.

This is a named, source-audited public-access inventory, not a claim that every
roadside turnout, gravel bar, or navigable-water shoreline is a lawful land
entry. Unnamed access, private fee access, and sites whose receiving water or
current public status could not be reconciled remain excluded.

## Source hierarchy

1. [ODFW — 50 places to fish within 60 minutes of Roseburg](https://myodfw.com/articles/50-places-go-fishing-within-60-minutes-roseburg)
   supplies fishing purpose, access type, receiving water, and directions for
   the named inland sites.
2. [Douglas County Parks](https://www.douglascountyor.gov/810/Day-Use-Parks) and
   individual facility pages corroborate current public ownership, amenities,
   and hours for county sites.
3. [BLM — North Umpqua Wild and Scenic River](https://www.blm.gov/programs/national-conservation-lands/oregon-washington/north-umpqua-wsr)
   and individual BLM site pages establish the fly-only corridor, developed
   day-use/campground access, and the no-angling-from-watercraft limitation.
4. [Oregon State Marine Board — Opportunities and Access](https://www.oregon.gov/osmb/boater-info/Pages/Opportunities-and-Access.aspx)
   provides the September 23, 2026 operational check for named Umpqua and North
   Umpqua boating sites and current hazard notes.
5. [ODFW 2026 Southwest Zone regulations](https://prod.eregulations.com/oregon/fishing/southwest-zone)
   controls Winchester, Lone Rock, Rock Creek/Deadline, fly-area, tributary
   mouth, species, gear, and season boundaries.
6. [ODFW regulation updates](https://myodfw.com/articles/regulation-updates)
   remains the in-product current-rules link because emergency rules supersede
   the permanent booklet.

## Reconciled coverage

| River / section                                        | Count | Included access                                                                                                                                                                                                                               |
| ------------------------------------------------------ | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mainstem lower — jetties to Scottsburg                 |     5 | Salmon Harbor Marina; Windy Cove Crab and Fishing Dock; Bumble Bee Boat Launch; Rainbow Plaza Boat Launch; Scottsburg County Park                                                                                                             |
| Mainstem middle — Scottsburg to Elkton                 |     2 | Scott Creek County Park; Elkton Boat Ramp at Alfred S. Tyson Park                                                                                                                                                                             |
| Mainstem upper — Elkton to River Forks                 |    10 | Hutchinson State Park; Osprey Boat Ramp; Tyee Campground; Yellow Creek Boat Ramp; Mack Brown Park; James Wood Boat Ramp; Umpqua Landing County Park; Cleveland Rapids Park; Singleton Park; River Forks Park                                  |
| North lower — mouth to Winchester closure              |     2 | Hestness Landing County Park; Amacher County Park                                                                                                                                                                                             |
| North middle — above Winchester to Rock Creek/Deadline |     5 | Whistler's Bend Park; Colliding Rivers Boat Ramp; The Narrows Wayside; Swiftwater Day Use Area; Lone Rock Slide Put-In                                                                                                                        |
| North upper — Fly Area to Soda Springs marker          |    10 | Cable Crossing Wayside; Baker Wayside; Susan Creek Day-Use Area; Susan Creek Campground; Bogus Creek Campground; Camp Water at Mott Bridge; Apple Creek Campground; Horseshoe Bend Campground; Eagle Rock Campground; Boulder Flat Campground |

## Material reconciliation decisions

- Mack Brown is assigned to the mainstem. Douglas County's general day-use table
  labels it North Umpqua, but ODFW's fishing inventory places the Tyee Road site
  with the mainstem Umpqua access sequence and mainstem species.
- Umpqua Landing is assigned to the mainstem at the Calapooya Creek/Umpqua
  confluence, not to the North Umpqua.
- Amacher remains listed because ODFW documents bank and boat access, but its
  customer-facing caution explicitly states that the Old Highway 99 bridge to
  200 feet above Winchester Dam is closed and that the access record does not
  override that boundary.
- Bogus Creek Campground is retained as ODFW-documented bank access. Its caution
  separately identifies the currently closed Bogus Creek raft launch so the
  campground listing cannot be mistaken for an open boat launch.
- Boating-only sites use a boat/carry-in access kind and explicitly avoid a
  public-bank-fishing claim.
- Sawyers Rapids RV Park is excluded because ODFW identifies it as a private fee
  access. Gardiner Ramp is excluded because it appeared in an older Marine Board
  report but was not reconfirmed in the current report. Unnamed Highway 138
  turnouts are excluded because a general public-corridor statement is not a
  sufficiently precise public-entry record.

## Verification

- `npm run qa:river-run:ui`
- `npm run audit:river-run:umpqua-spot-sources`

The live audit resolved 34 entries across the two rivers to 12 unique approved
government or public-land-manager URLs with no dead-page or unexpected HTTP
failure on 2026-10-01.
