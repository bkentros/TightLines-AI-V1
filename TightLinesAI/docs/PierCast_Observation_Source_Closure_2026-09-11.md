# PierCast Observation Source Closure — 2026-09-11

## Decision

The official-source search is complete for the five-city v1 cohort. No newly
discovered public feed closes the field-validation requirement.

## Searches and retained findings

- The complete active GLOS Seagull ERDDAP catalog (3,294 data rows when
  downloaded) was filtered geographically around all five frozen LMHOFS cells,
  then candidate datasets were inspected for temperature variable, depth, QC
  vocabulary, time coverage, and distance.
- NOAA CO-OPS station `9087023` at Ludington was checked directly. Its current
  sensor metadata lists wind, air temperature, barometric pressure, humidity,
  and water level—but no water temperature. The official water-temperature
  request returns “No data was found.” It is not a temperature source.
- USGS continuous-water-temperature searches found no pier-local lake sensor.
  The apparent Manistee result is Little Manistee River at Nine Mile Bridge near
  Freesoil; the apparent Grand Haven result is Pigeon River near Olive Center.
  Both are inland stream sites and cannot validate Lake Michigan pier water.
- GLOS `obs_62` (Ludington) and `obs_671` (Grand Haven) remain the retained
  seasonal comparison sources.
- GLOS `obs_709` remains unevaluable for Sheboygan under the frozen strict-QC
  rule. Older/current-generation Sheboygan buoy datasets were reviewed but did
  not provide a continuous, current, aggregate-QC-good pier-equivalent series
  that could replace the existing decision.
- Point Betsie datasets are roughly 14 km north of the Frankfort cell and
  historical/seasonal. They can be discovery context but cannot establish
  Betsie-plume or two-structure equivalence.
- No qualifying public nearshore temperature observation was found for Manistee
  or Frankfort–Elberta.

## Guardrail

Air temperature, inland river temperature, a distant offshore buoy, satellite
skin temperature, and persistence of the last observation are prohibited
substitutes. New sources may supplement the archive only after their exact
variable, unit, depth, QC, position, ownership, and time coverage are frozen and
tested.

Primary interfaces checked:
[NOAA CO-OPS metadata API](https://api.tidesandcurrents.noaa.gov/mdapi/prod/),
[NOAA CO-OPS Data API](https://api.tidesandcurrents.noaa.gov/api/prod/),
[GLOS Seagull ERDDAP](https://seagull-erddap.glos.org/erddap/index.html), and
[USGS Water Data APIs](https://api.waterdata.usgs.gov/).
