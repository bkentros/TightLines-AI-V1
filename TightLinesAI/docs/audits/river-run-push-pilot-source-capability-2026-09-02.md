# River Run Push Pilot — Preliminary Source-Capability Audit

**Pilot rivers:** Clackamas (OR), Oswego (NY), Manitowoc (WI)\
**Audit date:** 2026-09-02\
**Status:** source discovery and live endpoint verification complete; biological
calibration and historical event replay remain pending\
**Implementation state:** hidden positive-only event engine, four-hour UI, and
pilot configurations implemented; no public release authorized

## 1. Purpose and provisional product boundary

This audit asks whether each pilot river has enough live evidence to support a
positive-only Push Watch that refreshes every four hours and shows the last 48
hours. `Neutral` means only that no elevated signal was detected. It must never
mean that fish did not move.

The pilot does not assume a Great Lakes lake-flip mechanism applies to western
rivers. It also does not require every river to have the same source classes.
Wind is source context only during this audit; it is not a scored Push input.

## 2. Preliminary capability matrix

| River     | Receiving water / migration setting                             | Live hydraulic evidence                                                                                       | Receiving-water or relevant live temperature                                                                                                        | Precipitation                                                                | Preliminary Push class                                                                    |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Clackamas | Clackamas enters the Willamette; no Great Lakes-style lake flip | Strong: USGS 14211010, 15-minute flow and stage, lower river                                                  | Strong river temperature at the same USGS station; nearby Willamette temperature is context only                                                    | Existing modeled point near Oregon City, not a basin aggregate               | `western_river_observed` candidate: flow-first, river temperature as support/constraint   |
| Oswego    | Short regulated corridor entering Lake Ontario                  | Usable with limits: USGS 04249000, 15-minute flow/stage; canal flow omitted and power/backwater effects apply | Strong candidate: CDIP/NDBC 45215, measured surface temperature 2.4 nmi NNW of the port, 30-minute cadence                                          | Existing local modeled point is weak evidence for the large regulated system | `great_lakes_full` candidate: hydraulic response plus measured nearshore lake temperature |
| Manitowoc | Tributary entering Lake Michigan                                | Strong for middle river: USGS 04085427, 30-minute flow/stage, 6.6 miles above mouth                           | No accepted live in-situ mouth/harbor sensor found. NOAA daily satellite-derived SST is available at the nearest water grid about 0.7 mile offshore | Existing modeled point near the gauge; not yet accepted as a basin precursor | `great_lakes_hydraulic` now; `great_lakes_satellite_temperature` experimental candidate   |

## 3. River findings

### 3.1 Clackamas

#### Accepted live evidence

- USGS `14211010`, Clackamas River near Oregon City:
  - lower-river flow, stage, and measured water temperature;
  - verified 15-minute cadence on 2026-09-02;
  - latest probe returned flow, stage, and temperature through 2026-09-02;
  - lower river only; it does not represent River Mill, Estacada, or North Fork.
- USGS `14207770`, Willamette River below Falls at Oregon City:
  - live stage and measured water temperature were present in the endpoint
    probe;
  - this is mainstem Willamette context, not a substitute for the Clackamas
    lower-river gauge or proof of conditions in the downstream approach plume.

#### Movement-validation evidence

PGE publishes daily North Fork Sorting Facility counts and describes the
facility scope. These counts are potentially useful for a lagged early-coho
validation replay. They are not a mouth-entry signal, and the modeled fall
Chinook run ends below River Mill, so North Fork counts cannot validate the
Chinook Push directly.

#### Preliminary decision

Do not seek or model a lake flip. Use lower-river hydraulic response as the
primary candidate signal. Same-gauge river temperature may support or constrain
the species profile. Treat the Willamette temperature as research context until
a local movement relationship is demonstrated. Local precipitation should not
become a positive precursor until its watershed representation is audited.

### 3.2 Oswego

#### Accepted live evidence

- USGS `04249000`, Oswego River at Lock 7:
  - 15-minute flow and stage verified on 2026-09-02;
  - no current water-temperature observations;
  - published discharge excludes Oswego Canal flow and is affected by power
    operations; Lake Ontario backwater can affect stage.
- CDIP `274` / NDBC `45215`, Oswego buoy:
  - deployed about 2.4 nautical miles NNW of the Port of Oswego;
  - measured surface temperature at approximately 0.46 m depth;
  - 30-minute cadence;
  - deployed initially in April 2024 and currently operational;
  - the 2026-09-02 probe returned 143 valid temperature observations in the
    latest 72-hour window, ranging from 21.9 to 23.6 C;
  - seasonal deployment/maintenance gaps and real-time quality flags must fail
    closed.
- SUNY ESF / GLOS Oswego buoy `obs_74`:
  - approximately 1.75 miles offshore with a surface-to-bottom temperature
    string;
  - potentially valuable as independent validation and depth context;
  - the general surface-temperature field was missing in the latest direct
    probe, so it is not yet accepted as a runtime fallback.
- NOAA CO-OPS `9052030`, Oswego:
  - useful wind, air-temperature, pressure, humidity, and water-level context;
  - its current sensor inventory contains no measured water-temperature sensor;
  - NOAA's temperature plot at this station is model guidance, not an in-situ
    observation.

#### Preliminary decision

Oswego is the strongest full pilot. Use `45215` as the leading candidate for
receiving-water temperature and `04249000` for hydraulic response, while
preserving both sources' different physical locations. Do not combine them into
a confident score until historical overlap, seasonal uptime, quality flags, and
large-temperature-change behavior are replayed. Local rain should be context,
not a strong trigger, because the river is a large regulated system.

### 3.3 Manitowoc

#### Accepted live evidence

- USGS `04085427`, Manitowoc River at Michigan Avenue:
  - 30-minute flow and stage verified on 2026-09-02;
  - 6.6 miles above the mouth and representative of the middle reach, not the
    harbor or upper corridor;
  - no current temperature observations; the historical temperature series ended
    in 2022.
- NOAA CoastWatch `GLSEA_ACSPO_GCS`:
  - satellite-derived daily surface-water-temperature analysis, 2006-present;
  - nearest valid water grid tested at `44.0887596, -87.6406593`, approximately
    0.7 mile east of the configured mouth;
  - one daily value at 12:00 UTC rather than four-hour observations;
  - the probe returned a value on every day from 2026-08-25 through 2026-09-01,
    moving from 20.96 to 21.97 C;
  - promising for observed lake-surface context, but it is a gridded analysis
    rather than a fixed harbor sensor.
- NOAA LMHOFS:
  - operational model guidance for Lake Michigan/Huron water temperature runs
    four times per day;
  - no official LMHOFS observation station exists at Manitowoc; the nearest
    station in the published model-station list is Kewaunee, about 26.8 miles
    away;
  - exact-mouth grid extraction is possible, but it remains model guidance and
    is not accepted as measured temperature.
- NOAA CO-OPS historic station `9087064`, Manitowoc:
  - no current sensors and no current water-temperature product.
- NDBC Sheboygan `SGNW3`:
  - current meteorological observations but no water temperature;
  - too remote to substitute for Manitowoc receiving water regardless.

#### Preliminary decision

Manitowoc should launch as a hydraulic Push pilot unless the NOAA satellite SST
passes historical flip-event and continuity validation. Satellite SST could then
be a once-daily optional modifier while the four-hour Push still refreshes from
river hydraulics. Do not use Kewaunee, Sheboygan, offshore central-lake buoys,
or LMHOFS as if they were a measured Manitowoc mouth temperature.

## 4. Cross-pilot conclusions

1. A required three-input formula would fail the pilot. Temperature must be a
   typed optional source, not a universal requirement.
2. The source types must remain explicit: `in_situ_receiving_water`,
   `satellite_receiving_water`, `measured_river`, `model_guidance`, or
   `unavailable`.
3. River hydraulic response is the most consistently available direct signal.
   Precipitation is only a precursor and should not be scored until watershed
   representation is accepted.
4. Wind should remain unscored. Where a receiving-water sensor exists, use the
   observed temperature outcome of wind-driven mixing rather than a per-mouth
   wind-direction model.
5. Four-hour Push snapshots can coexist with slower inputs. The snapshot should
   retain the source observation time; it must not make a daily satellite value
   look newly observed every four hours.
6. Begin scoring at the run's `Beginning` stage and stop when it enters
   `Ending`; this remains the simplest initial lifecycle contract to replay.

### Provisional per-run activation and signal role

| Run                            | Beginning activation | Preliminary direct signal          | Temperature role                                                                                 |
| ------------------------------ | -------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------ |
| Clackamas fall Chinook         | 09-05                | Lower-river hydraulic response     | Same-gauge river temperature support/constraint; no lake-flip logic                              |
| Clackamas early fall coho      | 09-10                | Lower-river hydraulic response     | Same-gauge river temperature support/constraint; PGE counts available only for lagged validation |
| Oswego fall Chinook            | 09-01                | Lock 7 hydraulic response          | Measured Lake Ontario nearshore change is a candidate positive signal/constraint                 |
| Oswego fall coho               | 09-05                | Lock 7 hydraulic response          | Same source class as Chinook, with an independently replayed species profile                     |
| Oswego fall-entry steelhead    | 09-20                | Lock 7 hydraulic response          | Nearshore temperature may constrain/support, but must not inherit the salmon thresholds          |
| Oswego lake-run brown trout    | 10-15                | Lock 7 hydraulic response          | Later-season profile; must not inherit salmon or steelhead thresholds                            |
| Manitowoc fall Chinook         | 09-05                | Michigan Avenue hydraulic response | Daily satellite SST is experimental; otherwise omit temperature                                  |
| Manitowoc fall coho            | 09-15                | Michigan Avenue hydraulic response | Daily satellite SST is experimental; independently replay species response                       |
| Manitowoc lake-run brown trout | 10-01                | Michigan Avenue hydraulic response | Later-season profile; daily satellite SST remains experimental                                   |

These dates reuse the accepted `Beginning` boundaries already in each dossier;
they are not new calibration. The table intentionally assigns source roles, not
score thresholds. Thresholds remain blocked on the historical replays below.

## 5. Required next work before temperature activation or release

1. **Oswego:** retrieve the complete 2024-2026 CDIP temperature archive with
   quality flags; measure seasonal uptime and identify sustained cooling events.
2. **Oswego:** compare CDIP `45215`, GLOS `obs_74`, daily NOAA satellite SST,
   and the discontinued USGS river-temperature archive during overlap.
3. **Manitowoc:** audit daily NOAA satellite SST continuity for each configured
   run window and replay known rapid nearshore temperature changes; determine
   whether daily resolution is useful enough to modify Push.
4. **Clackamas:** replay USGS flow/temperature against PGE daily early-coho
   passage with biologically plausible travel lags. Keep fall Chinook validation
   separate because North Fork counts do not represent that run.
5. **All rivers:** keep precipitation and wind unscored for this pilot.
6. Lock or revise the provisional positive-only rating transitions after these
   replays. No current result supports treating the score as a probability of
   fish movement.

The hidden pilot currently enables audited hydraulics for all three rivers and
same-gauge measured temperature for Clackamas. Runtime observations are reduced
to trailing four-hour medians. Hydraulics use matched 12/24-hour comparisons;
temperature uses the matched 24-hour comparison to avoid diel-cycle false
positives. Events freeze the first qualifying baseline, decay on reversal, and
expire 48 hours after onset. Temperature and flow corroborate without additive
double counting. The NOAA/NDBC `45215` runtime adapter is implemented and
tested, but Oswego temperature remains gated until the archive and quality
replay passes. Manitowoc satellite SST remains research context only.

## 6. Primary sources and live endpoints

- USGS continuous observations API:
  https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items
- USGS Clackamas station `14211010`:
  https://waterdata.usgs.gov/monitoring-location/14211010/
- USGS Willamette below Falls station `14207770`:
  https://waterdata.usgs.gov/monitoring-location/14207770/
- PGE Clackamas daily fish counts:
  https://portlandgeneral.com/about/recreation-fish-wildlife/fish-counts/clackamas-fish-counts
- USGS Oswego station `04249000`:
  https://waterdata.usgs.gov/monitoring-location/04249000/
- CDIP Oswego buoy `274` / NDBC `45215`:
  https://www.cdip.ucsd.edu/m/products/?param=sstSeaSurfaceTemperature&stn=274p1
- NDBC Oswego buoy observations:
  https://www.ndbc.noaa.gov/station_page.php?station=45215
- GLOS Oswego dataset `obs_74`:
  https://seagull-erddap.glos.org/erddap/info/obs_74/index.htmlTable
- NOAA CO-OPS Oswego station `9052030`:
  https://tidesandcurrents.noaa.gov/stationhome.html?id=9052030
- USGS Manitowoc station `04085427`:
  https://waterdata.usgs.gov/monitoring-location/04085427/
- NOAA CoastWatch ACSPO GLSEA dataset:
  https://apps.glerl.noaa.gov/erddap/info/GLSEA_ACSPO_GCS/index.html
- NOAA LMHOFS: https://tidesandcurrents.noaa.gov/ofs/lmhofs/lmhofs.html
- NOAA CO-OPS historic Manitowoc station `9087064`:
  https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9087064.json?expand=sensors
