# Pass 2 handoff — Chicago through Alpena

**Input lock:** Pass 1 package reviewed 2026-09-18

**Required review:** all 95 city/species pairs, including the 16 holds and 17 excludes

**Initial numeric-candidate queue:** 62 city/species pairs

## Required Pass 2 outputs

1. A month-level seasonal opportunity model for every research candidate.
2. An evidence-strength and geography-transfer assessment for every numeric value.
3. Explicit separation of covered structure, wider port/harbor, shore, river, boat, charter, and fish-presence evidence.
4. Candidate-versus-admitted decisions after cross-city calibration.
5. A zero/missing/closed distinction that remains visible in the calculation inputs.
6. A hold or rejection for any pair whose magnitude cannot be defended.
7. A fresh review of every Pass 1 hold and exclude so new Grade A/B evidence can change its disposition; Grade C remains explicitly unscored.

## Priority order

### Tier 1 — likely primary species

- **Chicago:** yellow perch; coho; Chinook; steelhead; brown trout; lake trout; smallmouth bass; freshwater drum.
- **Michigan City:** coho; Chinook; steelhead; brown trout; yellow perch; smallmouth bass; lake whitefish.
- **Muskegon:** steelhead; Chinook; coho; brown trout; lake whitefish; yellow perch; walleye; smallmouth bass; freshwater drum; channel catfish.
- **Whitehall:** Chinook; steelhead; brown trout; coho; lake whitefish; yellow perch; walleye; smallmouth bass; freshwater drum.
- **Alpena:** yellow perch; smallmouth bass; walleye; northern pike; freshwater drum; then the managed salmonid set with conservative uncertainty.

### Tier 2 — admitted-candidate review

Quantify the remaining research candidates only after Tier 1 method choices are stable. A Pass 1 candidate can be held or excluded after quantification.

### Tier 3 — mandatory hold and exclude reopening

Reopen every hold and exclude against the expanded Pass 2 search. Promote a pair to numeric consideration only if recurring, intentional, covered-structure opportunity and a defensible annual shape reach Grade A or B support. Preserve every unresolved Grade C lead as an explicit unscored hold.

## High-risk questions to resolve

### Chicago

- Build separate Montrose and Navy Pier inputs before any city rollup.
- Preserve spring coho, summer perch/bass/drum, fall Chinook/coho, and winter perch/trout/lake-trout windows.
- Quantify winter Navy Pier lake trout from repeat evidence; do not infer it from boat or reef catch.
- Decide whether citywide largemouth guidance is strong enough for a covered-site number.

### Michigan City

- Keep Washington Park East Pier separate from the inner harbor, Trail Creek, NIPSCO, and Port of Indiana.
- Test lake whitefish recurrence; the current evidence is an exact-site agency possibility, not a creel series.
- Leave lake trout on hold unless repeat East Pier evidence changes the mode assessment.
- Treat Skamania summer steelhead and winter-run steelhead as two temporal components.

### Muskegon

- Determine how much port × Pier/Dock evidence can transfer to the south channel, north platforms, and outer pier.
- Verify whether the north state-park walkway/decks reopened before exposing that segment.
- Keep lake trout weak and narrow unless new exact-channel evidence supports more.
- Inspect November lake-whitefish sampling and single-point-hook boundary effects before fitting a curve.

### Whitehall

- Disclose that Medbery Park is owned by Montague and outside Whitehall city limits.
- Determine how much WHITEHALL-MONTAGUE Pier/Dock evidence belongs to Medbery Park.
- Resolve lake-whitefish agency/management evidence against explicit-zero 2012 and 2018 dashboard rows.
- Apply strong recency uncertainty because the port series ends in 2018.

### Alpena

- Separate Alpena port × Pier/Dock evidence from the exact Bay View Park municipal breakwall.
- Resolve agency named-harbor candidates with explicit-zero port rows: Atlantic salmon, coho, steelhead, and lake whitefish.
- Keep brown trout, Chinook, and lake trout conservative because port recurrence is sparse.
- Do not use Oscoda, Rockport, Rogers City, or boat/charter reports as Alpena breakwall evidence.

## Michigan creel calculation contract

- Use `michigan-pier-dock-raw.csv` as the auditable extract.
- `Catch` and `Harvest` are preserved separately. Confirm the report's definitions before selecting a rate numerator.
- Use species-target effort only when the underlying source supports it; all-species angler hours are not automatically valid for a species-specific CPUE.
- Model sampling uncertainty and sparse years explicitly.
- Treat missing years, sampled zero years, access closures, and biological zeros differently.
- The 2025 supplemental tables are lakewide by mode and must not be assigned to a port.

## Admission gates

A candidate may receive a numeric model only when all of the following are defensible:

1. Covered geography or a documented, uncertainty-adjusted transfer.
2. Compatible fishing mode.
3. Recurring or otherwise calibrated opportunity rather than mere presence.
4. Defensible season shape, including winter where applicable.
5. Current enough evidence or an explicit recency penalty.
6. Regulation and access metadata kept outside biological strength.
7. Cross-city output is plausible against established PierCast cities.

No public visibility, catalog expansion, artwork, copy, runtime constants, deployment, or release action is authorized by this handoff.
