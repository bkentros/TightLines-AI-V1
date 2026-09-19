# PierCast five-city onboarding — Pass 1 completion report

**Cities:** Chicago, Illinois; Michigan City, Indiana; Muskegon, Michigan; Whitehall, Michigan; Alpena, Michigan

**Research lock:** 2026-09-18

**Scope:** boundaries, access, current rules, biological evidence discovery, all 95 catalog pairs, and out-of-catalog leads

**Scoring status:** no species was scored, calibrated, admitted to runtime, or made public

## Pass 1 result

The Pass 1 research inventory is complete and ready for Pass 2 quantification.

- 5 city reports × 19 current catalog species = **95 unique decisions**.
- **62 research candidates** advance to Pass 2.
- **16 holds** preserve credible occurrences or nearby-mode leads that lack enough covered-structure evidence.
- **17 excludes** mean no covered-structure lead was found in the reviewed material. They do not mean biological absence.
- **32 sources** are normalized in the ledger, with publisher, date, geography, fishing mode, claim, use, and limitation.
- **6,253 Michigan DNR port-level Pier/Dock estimate rows** are preserved verbatim and reduced to a reproducible 91-row occurrence summary.
- **9 out-of-catalog leads** are recorded separately. No catalog change is proposed in Pass 1.

Confidence is high that Pass 2 has the right sites, species queue, seasons, and evidence conflicts. Confidence is intentionally not claimed for numeric strength; estimating that strength is Pass 2.

## Decision meanings

| Decision | Meaning |
|---|---|
| Research candidate | Enough named-site, named-port Pier/Dock, or corroborated local shore evidence exists to quantify the pair in Pass 2. This does not imply admission or primary-species status. |
| Hold | A credible occurrence, historical record, or nearby-mode lead exists, but intentional recurring fishing at the covered structure is not established. |
| Exclude | No credible lead for the covered structure was found in the reviewed sources. Reopen if new evidence appears. |

Access, ownership, routes, closures, and regulations are independent gates. A biologically strong pair does not imply that the structure is open or legal to fish today.

## Covered public structures

### Chicago, Illinois

The report must retain **two labeled subareas** because they support different seasons:

1. Montrose Harbor fishing pier/Horseshoe/contiguous legal public harbor edge.
2. The legal north side of Navy Pier and the pass-controlled Navy Pier Marina fishing area.

Other Chicago harbors, 85th Street, Calumet, beaches away from these areas, boats, charters, and offshore reefs are excluded. Chicago Park District says lakefront and harbor fishing is generally 6 a.m.-11 p.m.; closed-harbor docks require the winter pass from Nov. 15 through Mar. 31, and only the north side of Navy Pier is a public fishing area. Navy Pier Marina hours, construction routing, weather, security, and event closures must be checked again before release.

### Michigan City, Indiana

The core site is the **Washington Park East Pier/lighthouse pier and immediate legal basin edge**. The public DNR/Coast Guard inner-harbor shore area may be shown only as a separately labeled subarea. Trail Creek upstream, the NIPSCO discharge, Port of Indiana, boats, charters, and unrelated beach shore are excluded.

The city owns the Washington Park approach. Park hours, fees, wave/ice conditions, repairs, and posted closures need live confirmation before release.

### Muskegon, Michigan

The report covers **Lake Michigan outlet-channel public walls/platforms, north fishing decks, and the public south-pier approach**, with north and south segments labeled separately. Muskegon River, interior-lake sites, Snug Harbor, boats, charters, and offshore water are excluded.

The Michigan DNR state-park page still displays a north-walkway closure through August 2026 and says reopening could occur as early as fall. That wording does not confirm reopening. The north route remains an access hold until a live check resolves it.

### Whitehall, Michigan

The covered site is **Medbery Park on the north side of the White Lake outlet channel**, at 7340 Life Guard Road. It is outside Whitehall city limits, lies in White River Township, and is owned by the City of Montague. PierCast can retain “Whitehall” as the discovery label only if the report discloses the actual location and owner.

Published hours are 6 a.m.-11 p.m. White Lake interior sites, White River, the opposite channel side unless separately verified, boats, charters, and offshore water are excluded.

### Alpena, Michigan

The site is the **municipal breakwall and fishing platform adjacent to Bay View Park**, plus contiguous legal harbor edge only when separately labeled. The lighthouse tower is closed and excluded, as are Thunder Bay open water, boats, charters, other shore parks, and the Thunder Bay River.

Municipal harbor fishing is subject to posted rules, security, privacy, weather, and temporary closures. The breakwall opening, route, lighting, railing, and marina restrictions need a live release check.

The complete machine-readable boundary contract is in `site-boundaries.json`.

## Species inventory

**Legend:** C = Pass 2 research candidate, H = hold, X = exclude.

| Catalog species | Chicago | Michigan City | Muskegon | Whitehall | Alpena |
|---|:---:|:---:|:---:|:---:|:---:|
| Chinook salmon | C | C | C | C | C |
| Coho salmon | C | C | C | C | C |
| Steelhead | C | C | C | C | C |
| Brown trout | C | C | C | C | C |
| Lake trout | C | H | C | C | C |
| Walleye | X | H | C | C | C |
| Smallmouth bass | C | C | C | C | C |
| Freshwater drum | C | H | C | C | C |
| Yellow perch | C | C | C | C | C |
| Lake whitefish | H | C | C | C | C |
| Round whitefish | X | X | C | H | X |
| Channel catfish | H | H | C | C | H |
| Largemouth bass | C | C | C | C | H |
| Atlantic salmon | X | X | X | H | C |
| Northern pike | C | X | C | C | C |
| Burbot | H | X | X | X | X |
| White perch | X | X | C | C | X |
| White bass | H | X | H | H | X |
| Bluegill | H | C | C | C | H |

The row-level claims, sources, limitations, and next-evidence requirement are in `species-decisions.json` and `species-decision-matrix.csv`.

## City biological findings and likely primary set

“Likely primary” here identifies where Pass 2 should spend the most effort. It is not a numeric or public ranking.

### Chicago

**Likely primary research:** yellow perch, coho, Chinook, steelhead, brown trout, lake trout, smallmouth bass, and freshwater drum. Northern pike and largemouth bass remain secondary candidates.

- **Yellow perch has two different fisheries.** Montrose's 2024 pedestrian table estimates 4,284 perch in June, 263 in July, and 238 in August. The 2023 winter survey estimated 21,601 pedestrian perch across sampled winter sites, with Navy Pier accounting for 54.4% of that harvest. Pass 2 must preserve summer Montrose and winter Navy Pier rather than averaging them into one fall-shaped curve.
- **Coho is strongest as a spring-shore research target.** The 2024 Montrose rows estimate 993 coho in April and 27 in May, with another September observation. The broader March 2023 Illinois shore survey estimated 2,506 coho over 10,068 angler-hours, but that total is pooled and cannot be assigned wholly to Montrose.
- **Chinook is a fall candidate.** The 2024 Montrose September row estimates 21 Chinook; current Horseshoe reports corroborate the fall run.
- **Brown trout and steelhead require cold-season and shoulder-season work.** Montrose's 2024 table estimates 19 brown trout in April and 27 in May. Current harbor reports name steelhead, while the citywide agency calendar extends salmon/trout opportunity through winter.
- **Lake trout receives special priority.** Expert reporting describes a stronger winter Chicago lakefront bite in 2022-23 and a longer history of Navy Pier fish; a 2025 specialist report again describes Chicago winter lake-trout fishing. It is a candidate because the opportunity is credible and seasonally important, but Pass 2 must quantify recurrence and isolate Navy Pier from the general lakefront.
- **Freshwater drum and smallmouth bass recur at the Montrose Horseshoe/walls in current summer reports.** They should receive distinct warm-season curves.
- The 2017 Montrose state-record **lake whitefish and burbot** catches are genuine exact-site occurrences. They remain holds because one exceptional date cannot establish predictable opportunity.

### Michigan City

**Likely primary research:** spring coho; fall Chinook; summer Skamania and late-fall/winter steelhead; brown trout; summer yellow perch; and smallmouth bass. Lake whitefish is a high-value cold-season candidate whose magnitude is unresolved.

- Indiana DNR names Washington Park pier and the DNR/Coast Guard inner harbor for **spring coho**, from January through mid-April, with March the most consistent shore period.
- The agency pier calendar supports **Chinook** in May and mid-July through September, **Skamania steelhead** from mid-June through mid-August, winter-run steelhead from late October through March, and **perch** from June through mid-September.
- The exact-site coho guide says bottom fishing can produce **brown trout or whitefish**. That is strong enough to research whitefish, but it is not a recurrence estimate.
- The agency guide treats **lake trout primarily as a boat fishery**. Lake trout stays on hold until repeat East Pier evidence appears.
- Walleye, drum, and channel-catfish leads found in agency material belong mainly to the separate NIPSCO discharge. They do not transfer to East Pier and remain holds.
- The protected marina/breakwater habitat supports research on **smallmouth, largemouth, bluegill, and other sunfish**, with panfish species separation deferred to Pass 2.

### Muskegon

**Likely primary research:** steelhead, Chinook, coho, brown trout, lake whitefish, yellow perch, walleye, smallmouth bass, freshwater drum, and channel catfish. Lake trout is a sparse special-attention candidate.

Port-level Michigan DNR Pier/Dock recurrence is unusually broad:

| Species | Positive surveyed years | Latest positive | Interpretation for Pass 2 |
|---|---:|---:|---|
| Steelhead | 27 of 30 | 2022 | Very strong recurrence; quantify month and exact segment. |
| Brown trout | 26 of 29 | 2022 | Very strong recurrence across a long series. |
| Walleye | 17 of 18 | 2022 | Strong recurring channel/port candidate. |
| Chinook | 15 of 20 | 2018 | Strong historical recurrence; recent zeros/missing years require care. |
| Coho | 14 of 17 | 2021 | Strong recurrence with recent positive evidence. |
| Smallmouth bass | 14 of 15 | 2022 | Strong recurrence, also supported in channel/pierhead habitat. |
| Freshwater drum | 10 of 11 | 2022 | Strong warm-season recurrence. |
| Yellow perch | 15 of 18 | 2021 | Strong recurrence, with seasonal magnitude still unresolved. |
| Lake whitefish | 7 of 10 | 2021 | Credible cold-season fishery; November sampling/rules need careful treatment. |
| Lake trout | 2 of 8 | 2015 | Sparse; research a narrow opportunity and do not presume primary status. |

The same port series supports channel catfish, largemouth bass, northern pike, bluegill, round whitefish, and white perch as research candidates. White bass is held because only 2017 and 2018 are positive. Atlantic salmon has explicit zeros in the reviewed surveyed years; burbot has no reviewed port lead.

The dataset is a **MUSKEGON port × Pier/Dock** aggregate. It may combine walls, platforms, or sides and cannot settle the current north-walkway closure.

### Whitehall

**Likely primary research:** Chinook, steelhead, brown trout, coho, yellow perch, lake whitefish, smallmouth bass, freshwater drum, and walleye. Lake trout is a sparse special-attention candidate.

The WHITEHALL-MONTAGUE port × Pier/Dock series is older but shows strong recurrence:

| Species | Positive surveyed years | Latest positive | Interpretation for Pass 2 |
|---|---:|---:|---|
| Brown trout | 17 of 17 | 2018 | Excellent historical recurrence. |
| Chinook | 16 of 17 | 2017 | Excellent historical recurrence; 2018 is an explicit zero. |
| Steelhead | 15 of 15 | 2018 | Excellent recurrence through the final sampled year. |
| Coho | 12 of 13 | 2018 | Strong recurrence. |
| Walleye | 12 of 12 | 2018 | Strong recurrence. |
| Smallmouth bass | 13 of 14 | 2018 | Strong recurrence. |
| Freshwater drum | 9 of 9 | 2018 | Strong recurrence. |
| Yellow perch | 8 of 10 | 2014 | Historical recurrence; currency needs work. |
| Lake trout | 2 of 4 | 2015 | Sparse, narrow candidate. |
| Lake whitefish | 0 of 2 | none | Dashboard conflict: agency currently names pier/channel whitefish and maintains a November protection rule. Keep as candidate to resolve. |

Atlantic salmon (one positive year, 2001), round whitefish (2000 and 2005), and white bass (2015 only) remain holds. White perch advances cautiously on two positive years, 2016 and 2018.

The port series can cover more than Medbery Park. Pass 2 must separate port evidence from the exact public channel edge.

### Alpena

**Likely primary research:** yellow perch, smallmouth bass, walleye, northern pike, and freshwater drum. Brown trout, Chinook, lake trout, Atlantic salmon, coho, steelhead, and lake whitefish remain important managed-harbor candidates, but the creel evidence makes their numeric uncertainty explicit.

- Michigan DNR's named **Thunder Bay/Alpena Harbor** list includes Atlantic salmon, brown trout, Chinook, coho, lake trout, lake whitefish, northern pike, smallmouth bass, steelhead, walleye, and yellow perch.
- The port × Pier/Dock series is strongest for **yellow perch** (10 of 15 sampled years positive, latest 2015) and **smallmouth bass** (10 of 14, latest 2020). Walleye is positive in 5 of 9 years through 2019, northern pike in 5 of 10 through 2015, and drum in 3 of 8 through 2015.
- Salmonid port evidence is sparse: brown trout is positive in 3 of 8 years through 2018; Chinook in 2 of 8 through 2007; lean lake trout in 1 of 7, in 2007.
- Atlantic salmon, coho, steelhead, and lake whitefish have explicit-zero reviewed port rows despite appearing on the current agency harbor list. These pairs advance because the source conflict itself needs Pass 2 resolution. They must not receive optimistic numbers by default.
- Channel catfish, largemouth bass, and bluegill have only sparse port positives and remain holds. Round whitefish, burbot, white perch, and white bass have no reviewed covered-port lead.

The ALPENA port × Pier/Dock label may include more than the Bay View Park breakwall. Exact-structure transfer is a central Pass 2 uncertainty.

## Michigan creel evidence controls

The preserved export has 6,253 rows from the Michigan DNR public dashboard for MUSKEGON, WHITEHALL-MONTAGUE, and ALPENA, filtered to mode `Pier/Dock`. Its SHA-256 is `d0c5e7ac925ec77066a6f6edee96e6fadb1c46fa2f4d0275a632e93f4d11c5da`.

Interpretation rules:

- A **positive year** means the annual sum of dashboard `Catch` or `Harvest` estimates exceeded zero.
- An **explicit-zero year** has sampled Catch/Harvest rows whose annual sum is zero.
- A **missing year** is neither a zero nor proof of absence.
- Catch and harvest remain distinguishable in the raw export. The occurrence summary does not turn either into a catch rate.
- Angler hours are all-species effort and are not automatically a species-specific denominator.
- Port × Pier/Dock estimates can pool structures and sides, include sampling error, omit winter strata, and stop at 2022 in this extract.

The May 2026 report and spreadsheet for the 2025 Michigan fishery were also reviewed. They include whole-Lake Michigan and whole-Lake Huron Pier/Dock tables, but no port field. They provide current method and mode context only and do not update Muskegon, Whitehall-Montague, or Alpena directly.

## Current regulation and access gates

- **Illinois:** use the 2026 rules and Chicago Park District's narrower local conditions. The Lake Michigan yellow-perch closure is May 1 through June 15. Smelt uses a separate method/season and should never be folded into rod-and-reel scoring. Snagging permissions at other named locations do not transfer to Montrose or Navy Pier.
- **Indiana:** use the 2026-27 guide and live Washington Park postings. Tributary and NIPSCO rules/opportunities do not transfer to East Pier.
- **Michigan:** use the 2026 regulations effective through March 31, 2027. November single-point-hook restrictions in named port waters require exact boundary treatment; their whitefish-protection purpose is biological context, not a catch-strength estimate.
- Weather, waves, ice, construction, maintenance, security, and special events can close a legally public structure. Pass 3/release must refresh each gate.

## Out-of-catalog leads

- **Chicago rainbow smelt:** research candidate only as a separate seasonal dip-netting method.
- **Michigan City rock bass:** agency-supported pier/marina research lead; pumpkinseed and other sunfish remain a species-separation hold.
- **Whitehall pink salmon:** positive port estimates in 2000 and 2015; hold for current Medbery evidence.
- **Alpena rock bass:** agency harbor listing plus positive port estimates in 2008 and 2012; research candidate.
- **Alpena pink salmon:** agency harbor listing conflicts with zero reviewed port rows; hold.
- Additional rock bass, pumpkinseed, sucker, crappie, and carp complexes are retained as lower-priority leads where applicable.

See `out-of-catalog-leads.json` for all nine normalized records. No artwork, copy, catalog ID, thermal curve, or runtime change belongs in Pass 1.

## Pass 2 readiness

Pass 2 can begin from this completed discovery inventory. It must reopen all 95 cells, including every hold and exclude, and should:

1. Recheck all 95 dispositions, then quantify monthly intentional opportunity for supported Grade A/B pairs, starting with the 62 initial candidates and each city's likely-primary set.
2. Preserve site subareas and fishing modes; reject boat, charter, river, NIPSCO, and broad-harbor transfers unless explicitly modeled as uncertain corroboration.
3. Treat explicit zero, missing sampling, access closure, and biological absence as four different states.
4. Give lake trout extra scrutiny at Chicago, Muskegon, Whitehall, and Alpena, including late-fall and winter evidence.
5. Resolve the four Alpena agency-list versus creel-zero conflicts before any numeric admission.
6. Recheck 2026 access and current regulations during Pass 3/release, after biology is calibrated.

The exact task list and acceptance gates are in `PASS2_HANDOFF.md`.
