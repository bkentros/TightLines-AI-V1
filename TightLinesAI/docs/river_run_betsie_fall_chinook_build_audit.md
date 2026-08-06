# Betsie Fall Chinook — Owner Build Audit

**Status:** implementation and local verification complete; public audit gate
disabled\
**Engine version:** `river-run-v1.5.3`\
**Configuration version:** `2026-08-06-betsie-weather-activity.3`\
**Copy version:** `river-run-copy-v26`\
**Movement branch:** `fall_cooling` / seasonal progression only

## Product decision

Betsie Fall Chinook is implemented as a 10/10 historical-opportunity run with
the owner-calibrated calendar five days ahead of the accepted Pere Marquette
Chinook calendar. This is not a copied PM condition model. The PM comparison is
used only to establish the seasonal calendar and relative presence curve.

The useful migratory geography is the short corridor from Betsie Lake and the
river mouth to Homestead Dam. Betsie copy therefore does not describe PM-scale
lower, middle, and upper sections. It starts anglers in deep downstream holes,
recognizes late-August arrival at the upper end of the legal corridor, and never
recommends water above Homestead.

## Primitive availability

| Primitive        | Status      | Basis                                                                                                           |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| Run Stage        | Available   | Deterministic Betsie calendar and Homestead-specific copy                                                       |
| Fish In River    | Available   | Audited relative seasonal-presence curve                                                                        |
| Migration Timing | Unavailable | No accepted representative hydraulic and measured-water history for cumulative early/typical/delayed comparison |
| Push             | Unavailable | No accepted live below-Homestead hydraulic source or measured water-temperature source                          |
| Fishability      | Unavailable | No accepted live below-Homestead hydraulic source or defensible Betsie bands                                    |
| Activity Outlook | Available   | Limited-confidence four-hour effective-light, cloud, and in-block precipitation model                           |

Air temperature is not used as a water-temperature substitute. No PM flow bands,
PM percentiles, placeholder CFS values, remote proxy gauge, or fabricated
temperature calibration is present in the Betsie configuration. The endpoint
bypasses gauge and temperature providers but reads hourly weather for Activity.

## Weather-only Activity

Betsie Chinook Activity assigns 75% to effective light and 25% to precipitation
context. Each 5–9 AM, 9 AM–1 PM, 1–5 PM, and 5–9 PM score uses only the weather
inside that block. Wet-hour duration distinguishes sustained light rain from a
brief shower, while heavier precipitation loses benefit. Preceding rain never
implies a river rise or clarity change.

The weather variables retain their native score range with a true upper bound
of 95 rather than a proportional missing-data reduction; tomorrow is bounded at
90. Confidence is always Limited because river level, clarity, and measured
water temperature are unknown. The Chinook floor fades continuously after
September 25, the 15-point
lifecycle deduction reaches full strength October 13, and Ending plus the sparse
tail blend continuously into a 49% residual constraint through November 3.
Every weather-only headline explicitly says `Limited confidence`; the detail
states that the score ranks weather variables only and names river level,
clarity, and measured water temperature as unknown.

The 2007–2025 replay contains all 1,881 expected dates. Daily scores range
30–95 with a 69 median and 66 distinct values; block scores range 23–95 with 73
distinct values. The identical-condition lifecycle audit declines from 85 on
September 25 to 42 on November 3 with no adjacent-day change above two points.
All replay invariants are zero, including ceiling enforcement, complete copy,
weather-only disclosure, prohibited river inference, and lifecycle continuity.

## Configured calendar

| Boundary                      |         Date |
| ----------------------------- | -----------: |
| Early watch                   |       July 1 |
| Lake/mouth staging context    |      July 28 |
| River presence begins         |    August 10 |
| Beginning phase ends          |    August 18 |
| Late-August established build |    August 27 |
| Broad short-corridor build    |  September 5 |
| Peak stage begins             | September 10 |
| Peak reference                | September 15 |
| Peak stage ends               | September 25 |
| Tapering phase ends           |   October 13 |
| Main run ends                 |   October 22 |
| Sparse historical tail ends   |   November 3 |
| Late post-run copy ends       |   November 5 |

August 10 begins at only 10/100. A rare fish can already reach Homestead, but
copy explicitly says a dependable concentration there is unlikely. By August 27,
reaching Homestead is described as realistic while the deepest substantial holes
downstream remain the first plan.

## Presence curve

The scale ceiling is 10/10. Scores are a relative historical opportunity index,
not a live fish count or population estimate.

| Date         | Fish In River |
| ------------ | ------------: |
| August 9     |       0 / 100 |
| August 10    |      10 / 100 |
| August 17    |      25 / 100 |
| August 30    |      50 / 100 |
| September 15 |     100 / 100 |
| September 25 |      95 / 100 |
| October 4    |      70 / 100 |
| October 20   |      25 / 100 |
| November 3   |       0 / 100 |

The configuration's `broad` distribution classification means broad coverage of
this short core corridor below Homestead only. It does not mean PM-sized
lower/middle/upper river geography or imply migratory access above the
structure.

## Homestead copy and regulation contract

- Staging directs attention to Betsie Lake, the mouth, and the first deep
  below-Homestead hole.
- Early progression emphasizes the deepest downstream holes and labels an August
  10 Homestead fish as exceptional.
- Late August says Homestead arrival is realistic.
- Peak covers substantial holes throughout the below-Homestead corridor.
- No state recommends or implies migratory fishing above Homestead.
- Taper and ending states prioritize deep established holding water and avoid
  actively spawning or visibly deteriorated fish.
- No state uses generic lower-, middle-, or upper-river guidance.
- Safety copy states that fishing is closed within 300 feet of the Homestead
  barrier and fish-passage facility from August 1 through November 15, and
  within 100 feet from November 16 through July 31. It tells users to follow
  current signed boundaries.

## Evidence classification

River-specific support in the configuration includes:

- [Michigan DNR Betsie River Survey 2004-3](https://www2.dnr.state.mi.us/publications/pdfs/ifr/ifrlibra/Status/Waterbody/2004-3Betsie.pdf):
  primarily wild Chinook, natural-reproduction context, an August 12 adult
  observation at Kurick Road, and historic effort from Betsie Lake to Homestead.
- [Michigan DNR wild Chinook fishery summary](https://content.govdelivery.com/accounts/MIDNR/bulletins/29f9c97):
  current wild-population and fishery context.
- [Great Lakes Fishery Trust / USGS Homestead Chinook study](https://portal.glft.org/documents/653-rogers_chinook_final_report_v2-pdf):
  Homestead-area naturalized Chinook work supporting a mid-September-centered
  run and declining effort by late October.
- Owner field calibration: exact five-day lead over PM, 10/10 opportunity
  ceiling, August 10 rare-arrival interpretation, and April 2026 flood
  observations.

The reported April 2026 flood is retained as an owner-audit concern for changed
holes, sand deposition, access, and passage. It does not move the fixed
historical calendar and is not converted into an unsupported live condition
score.

## Mechanical acceptance

- 23 production-derived Betsie scenarios: 11 Run Stage states, all three
  unavailable live primitives, and nine exact presence anchors.
- 222 River Run engine and endpoint tests passed.
- Endpoint proof verifies a Betsie snapshot never calls a live provider and
  exposes no gauge, weather, or water-temperature reading.
- Configuration validation rejects placeholder PM calibration blocks on an
  unavailable Betsie primitive.
- TypeScript, River Run UI QA, visual QA, PM review mode, PM Coho acceptance,
  and PM Steelhead acceptance all pass.
- Betsie uses the small-river selector artwork.
- No deployment, database publication, or public gate change was performed.

## Owner audit procedure

Run the deterministic acceptance check:

```bash
npm run qa:river-run:betsie-acceptance
```

For device review, run:

```bash
npm run dev:river-run
```

Then select Michigan → Fall → Chinook Salmon → Betsie River. Audit the early
August states, August 27, the September 15 peak, October taper/end, all three
Unavailable cards, the short-corridor wording, and the 300-foot closure copy.
Every review-state chip includes its fixture date. The selected state also
identifies whether that date is a fixed state boundary, a Migration Timing
checkpoint, a seasonal-curve date, or only a condition-driven example. These
annotations are review-mode-only and are not included in live user cards.

Public visibility remains disabled under
`betsie-fall-chinook-weather-activity-audit-v1`.
It should be enabled only after explicit owner acceptance of the calendar,
curve, Homestead geography, regulation copy, and unavailable-state behavior.
