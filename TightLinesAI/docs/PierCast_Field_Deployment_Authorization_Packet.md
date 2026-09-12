# PierCast Field Deployment Authorization Packet

**Prepared:** 2026-09-11\
**Protocol:** `piercast-field-temperature-v1`\
**Scope:** seven non-runtime validation loggers; no fishing, biological
collection, fill, dredging, or public obstruction

## Submission rule

Do not place equipment until the land/structure authority and every applicable
waterway regulator have responded in writing. Ask for an authorization or a
written determination that no permit is required; do not infer one from public
pedestrian access.

Michigan's DNR requires a land-use permit for research on state-park land and
asks for a research proposal, map, schedule, people, methods, equipment, and
final-report plan. Its general public-land guidance says to apply at least 60
days before proposed use. The Detroit District states that work in, over, or
under navigable water requires Section 10 authorization and encourages early
coordination. Wisconsin DNR regulates structures below the ordinary high-water
mark and offers a no-fee voluntary exemption review. The St. Paul District is
the federal regulatory contact for Wisconsin.

Authoritative routing:

- [Michigan DNR scientific research permits](https://www.michigan.gov/dnr/managing-resources/public-land/permission/scientific)
  and
  [state-park contacts](https://www.michigan.gov/dnr/about/contact/parks/parkcontacts)
- [USACE Detroit District, Michigan Regulatory](https://www.lrd.usace.army.mil/Missions/Regulatory/Michigan/)
- [Wisconsin DNR waterway permitting](https://dnr.wisconsin.gov/topic/Waterways/Permits/PermitProcess.html)
- [USACE St. Paul District, Wisconsin Regulatory](https://www.mvp.usace.army.mil/Missions/Regulatory/Permitting-Process-Procedures/)
- [City of Sheboygan Deland Park / DPW contact](https://www.sheboyganwi.gov/Facilities/Facility/Details/Deland-Park-8)

## Site request register

| Site                       | Initial land-side authority           | Additional review route                              |
| -------------------------- | ------------------------------------- | ---------------------------------------------------- |
| Ludington North Breakwater | City of Ludington / Stearns Park      | USACE Detroit; ask whether EGLE joint review applies |
| Grand Haven South Pier     | Grand Haven State Park, 616-847-1309  | Michigan DNR research coordinator; USACE Detroit     |
| Manistee North Pier        | City of Manistee / Fifth Avenue Beach | USACE Detroit; ask whether EGLE joint review applies |
| Frankfort North Breakwater | City of Frankfort                     | USACE Detroit; ask whether EGLE joint review applies |
| Elberta South Breakwater   | Village of Elberta                    | USACE Detroit; ask whether EGLE joint review applies |
| Sheboygan North Pier       | City DPW, 920-459-3440                | Wisconsin DNR Waterways; USACE St. Paul Wisconsin    |
| Sheboygan South Pier       | City DPW, 920-459-3440                | Wisconsin DNR Waterways; USACE St. Paul Wisconsin    |

Use the exact target coordinates and source IDs in `config/fieldValidation.ts`.
Final attachment coordinates may move within the 350 m protocol radius only
after the authority approves the safe location.

## Fixed technical description

- One compact, water-rated temperature logger, documented accuracy ±0.2 °C or
  better, immutable model and serial number.
- Suspended at 0.50 m below the instantaneous water surface (allowed protocol
  range 0.25–0.75 m) from a non-destructive, redundant attachment selected by
  the authority.
- Sampling at least every 15 minutes in UTC for at least 60 QC-good days.
- No drilling, adhesives, fill, excavation, discharge, navigation marking, or
  attachment to ladders, railings, lights, aids to navigation, or lifesaving
  equipment unless the authority explicitly approves it.
- Pre-deployment calibration within 30 days and post-recovery check; maximum
  accepted error 0.2 °C.
- Inspection/recovery during safe conditions; immediate removal on authority
  request; contact label attached.
- Data used only for private comparison against the frozen NOAA LMHOFS cell. It
  cannot alter live conditions or scores without a later, documented validation
  decision.

## Request template

Subject: PierCast non-destructive Lake Michigan temperature logger — request for
site/permit determination

> FinFindr requests written authorization or a written permit determination for
> one temporary, non-destructive water-temperature logger at **[site]**, near
> **[coordinate]**, during **[start–end]**. The unit records temperature only;
> it involves no biological collection, fill, dredging, discharge, drilling, or
> public obstruction. It will sample at least every 15 minutes approximately
> 0.50 m below the water surface for at least 60 days, use redundant attachment,
> carry owner contact information, and be removed on request. Attached are the
> site map, equipment specification, attachment drawing, deployment/recovery
> schedule, personnel list, safety plan, calibration procedure, and proposed
> final report. Please identify the property/structure owner, whether this exact
> placement is acceptable, and every local, state, or federal authorization or
> exemption determination required before deployment.

## Required attachments before submission

1. Applicant legal name, address, responsible person, phone, and email.
2. One-page purpose and public/resource benefit statement.
3. Site map showing the access route, target, proposed attachment point, water
   face, and recovery route.
4. Logger manufacturer specification and serial-number assignment.
5. Dimensioned, non-destructive attachment and redundant-retention drawing.
6. Deployment, inspection, calibration, recovery, and severe-weather plan.
7. Named field personnel and proof of any required insurance.
8. Data-management/final-report plan and authority removal contact.

Applicant identity, equipment model, insurance, dates, and an approved
attachment point are intentionally blank because they require an owner decision
and authority review. This packet is ready for those inputs; it is not itself a
permit.
