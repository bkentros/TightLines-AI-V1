# PierCast Five-City Onboarding Dossiers

> **Five-city public release (2026-09-18):** The owner approved go-live for Two Rivers, Kewaunee, Algoma, Manitowoc, and Waukegan. The [release record](five-city-2026-09-release/RELEASE_REPORT.md) tracks the 17-city public manifest, client distribution, deployment, and production checks. The Pass 1–3 reports below are dated research and private-preview records; their pre-release visibility statements describe the state at the time of those passes.

> **Required calibration method:** Every future PierCast city or species pass must begin with [CALIBRATION_AND_RESEARCH_STANDARD.md](CALIBRATION_AND_RESEARCH_STANDARD.md). It records the exact research hierarchy, pier-specific admission test, absolute cross-city scoring method, missing-evidence rule, full-year seasonal audit, and hard 10.0 cap. Evidence confidence must never suppress an admitted pair's fishery-strength ceiling.

> **Michigan all-species verification — 2026-09-18:** The [Michigan audit](michigan-all-scored-species-audit-2026-09/AUDIT_REPORT.md) checks all 72 scored pairs and all 133 city × catalog-species cells across Ludington, Grand Haven, Manistee, Frankfort–Elberta, Harbor Beach, Oscoda and Port Sanilac. It found no additional confidence-based suppression and made no numerical changes. All 61 no-score cells retain explicit hold or exclusion decisions rather than artificial low values.

> **All-city common-species correction — 2026-09-17:** The [17-city calibration audit](all-city-common-species-audit-2026-09/AUDIT_REPORT.md) reviews Chinook, coho, steelhead, brown trout, lake trout and freshwater drum across 102 city/species cells. It confirms that 18 established-Wisconsin salmonid peaks had inherited the same hidden confidence penalty found in the first five-city draft. Those Formula v3 ceilings and their related seasonal modes are corrected; 59 numeric rows are retained and 25 unsupported rows remain explicit no-score evidence holds. The established 12-city public v3 catalog receives the corrected values. Two Rivers, Kewaunee, Algoma, Manitowoc and Waukegan remain absent from the public catalog and stay in private onboarding review. Future calibration work must use the corrected rankings and must never lower `F` merely because effort, precision or another confidence field is missing.

> **Current five-city expansion handoff — 2026-09-17:** Before scoring Two Rivers, Kewaunee, Algoma, Manitowoc, or Waukegan, read the [Pass 2 handoff](five-city-2026-09-pass1/PASS2_HANDOFF.md) and [corrected Pass 1 audit](five-city-2026-09-pass1/PASS1_REPORT.md). The first shortlist wrongly applied numeric-score admission standards to the research queue and missed historical Wisconsin pier lake-trout catches. All 19 catalog species at all five cities must be reconsidered; lake trout needs a dedicated audit, and smelt is a separate method-aware catalog lead. The corrected research queue has 32 pairings. Algoma remains in the build with construction recorded as access context. No score or public city visibility follows from research admission.

> **Pass 2 complete and recalibrated — 2026-09-17:** The [private scoring audit](five-city-2026-09-pass2/PASS2_REPORT.md) reopens all 95 rows and approves 24 grade-B Formula v3 shadow pairings, with 20 investigated leads held without fabricated scores and 51 excluded rows. The initial low ceilings were rejected because they treated evidence confidence as a hidden score penalty. The mandatory [cross-city calibration standard](five-city-2026-09-pass2/CALIBRATION_STANDARD.md) now anchors every approved pairing to established ports and records that `F`, seasonal duration, and evidence confidence are separate. The corrected package includes Kewaunee 9.1 and Algoma 9.0 Chinook, Manitowoc 8.5 and Two Rivers 8.4 Chinook, and Waukegan 8.8 coho. It includes 60 opportunity modes, a 365-day audit under three thermal scenarios, a dedicated five-city lake-trout decision, and machine-checked cross-city ordering. These artifacts remain private and are the required Pass 3 input.

> **Pass 3 complete in private production — 2026-09-18:** The [Pass 3 completion report](five-city-2026-09-pass3/PASS3_REPORT.md) records all five cities in the 17-city owner Formula v3 pipeline, including audited LMHOFS cells, five-day reports, exact database gates, production verification, and normal-user privacy tests. The stored private run has 590 forecast rows across 118 city/species pairs; the five onboarding cities contribute 24 pairs and 120 rows. The public release remains frozen at 12 cities. Public launch requires a later explicit owner “go live” instruction.

> **Candidate-list correction — 2026-09-12:** Use the [batch research roster](remaining-species/CANDIDATE_ROSTER.md) to select additional species for research: 25 candidate pairings, seven occurrence leads and 13 not established in the reviewed evidence. Recurring pier catches can qualify a research candidate without prior proof of major intentional targeting or score-ready calibration. The earlier strict classifications remain scoring caveats, not the research queue. Numerical and public-release gates remain unchanged.

These dossiers are the operational source of truth for PierCast v1 structure
scope. `open_by_published_rules` means an authoritative source publishes a
public route/fishing use. It is not a live guarantee. Weather, waves, ice,
construction, emergency orders, posted signs, and the authority on site always
control.

| City              | Dossier                                   | Covered structures             |
| ----------------- | ----------------------------------------- | ------------------------------ |
| Ludington         | [Ludington](ludington.md)                 | North Breakwater               |
| Grand Haven       | [Grand Haven](grand-haven.md)             | South Pier                     |
| Manistee          | [Manistee](manistee.md)                   | North Pier                     |
| Frankfort–Elberta | [Frankfort–Elberta](frankfort-elberta.md) | Frankfort North; Elberta South |
| Sheboygan         | [Sheboygan](sheboygan.md)                 | North; South                   |

Access evidence is reviewed before release and at least monthly in season. A
reported closure immediately excludes the affected structure until an
authoritative reopening is recorded; no date-based automatic reopening is
allowed.

The private logger workflow and acceptance thresholds are defined in the
[field-temperature program](../../PierCast_Field_Temperature_Program.md). Use
the [example import payload](field-temperature-import.example.json) only as a
schema template; its values are not evidence and must never be committed. The
[authorization packet](../../PierCast_Field_Deployment_Authorization_Packet.md)
contains the regulator routing, fixed technical description, request language,
and submission checklist for all seven sites.

## Remaining species

The [45-pair decision register](remaining-species/README.md) reviews the nine additions against these exact structures. Its explicit classifications supersede earlier candidate leads; none authorizes a numeric score. See the raw creel snapshots, monthly comparisons, thermal review and generated weekly availability in that directory.
