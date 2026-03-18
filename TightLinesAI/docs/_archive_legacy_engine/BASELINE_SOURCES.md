# TightLines AI V3 — Baseline Data Sources and Methodology

## 1. Purpose

This document records the exact data sources, approximation rules, and methodology used for the V3 historical baseline layer. All baselines are context inputs only; they do not affect headline scoring.

## 2. Air Temperature Baselines

### Source
- **Primary**: NOAA NCEI U.S. Climate Normals 1991-2020
- **Reference**: https://www.ncei.noaa.gov/products/land-based-station/us-climate-normals
- **State-level**: NCEI Climate Division (NClimDiv) monthly averages, aggregated by state
- **Reference**: https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncdc:C00005

### Methodology
- Values represent state climate division weighted averages for each month
- Regional composites used where state-level division data is mapped to one of 12 climate zones
- `avgTempNormalF`, `avgHighNormalF`, `avgLowNormalF` from 1991-2020 normals
- `rangeLowF` / `rangeHighF` = typical ±1 std dev from normal (approximate spread)

### Quality
- **high** for contiguous US states
- Alaska and Hawaii use regional patterns consistent with NOAA State Climate Summaries

## 3. Precipitation Baselines

### Source
- **Primary**: NOAA NCEI U.S. Climate Normals 1991-2020
- **State-level**: NCEI Climate Division monthly precipitation totals

### Methodology
- Monthly total precipitation normals (inches) by state
- `rangeLowInches` / `rangeHighInches` = normal ± typical variability

### Quality
- **high**

## 4. Freshwater Temperature Baselines

### Source
- **Primary**: USGS NWIS, state agency datasets, regional limnology studies
- **Approximation**: No nationwide statewide freshwater temp dataset exists

### Methodology
- **Lake/pond**: Typically 2–4 weeks behind air temp; broader seasonal range
- **River/stream**: More responsive to air temp; narrower range, faster response
- Ranges derived from air-temp relationship + regional studies
- Broad ranges by design — not precise per-waterbody values

### Quality
- **approximation** — explicitly documented
- Ranges are defensible and reasonable, not perfect
- Do not pretend nationwide freshwater temperature precision

### Approximation Rules
1. Lake temps lag air temp by ~2–4 weeks; use regional air-temp pattern shifted
2. River temps track air temp more closely; use narrower range
3. All freshwater baselines include `methodologyNote` and `quality: 'approximation'`

## 5. Coastal Water Temperature Baselines

### Source
- **Primary**: NOAA National Data Buoy Center (NDBC), NOAA Tides & Currents
- **Reference**: https://www.ndbc.noaa.gov/, https://tidesandcurrents.noaa.gov/

### Methodology
- Monthly surface water temp ranges from long-term buoy/station observations
- Only applicable for coastal states; inland states return null
- Coastal states: FL, AL, MS, LA, TX, GA, SC, NC, VA, MD, DE, NJ, NY, CT, RI, MA, NH, ME, CA, OR, WA, AK, HI

### Quality
- **high** for coastal states with buoy coverage

## 6. State Resolution (Geo)

### Source
- **Primary**: 2017 US Census Bureau 1:500,000 shapefile (NAD83)
- **Reference**: https://anthonylouisdagostino.com/bounding-boxes-for-all-us-states/

### Methodology
- Point-in-bounds check for each state
- States ordered by area (smallest first) for overlapping boxes (e.g. DC before MD)
- Alaska: special handling for dateline span (mainland -180 to -130, Aleutians 170 to 180)

### Coverage
- All 50 US states + DC
- No territories (AS, GU, MP, PR, VI)

## 7. State → Region Mapping

### Source
- TightLines regional design (7 regions preserved from V2)

### Regions
- `northeast`, `great_lakes_upper_midwest`, `mid_atlantic`, `southeast_atlantic`, `gulf_florida`, `interior_south_plains`, `west_southwest`

### Methodology
- Explicit state → region map
- Region = rule layer for weighting, timing, rule selection
- State = baseline lookup layer

## 8. Missing Data Handling

- If baseline is missing: report still runs; no score path fails
- Engine omits that comparison flag and reduces context richness
- No silent fallbacks that hide missing data
- No fake placeholder values
