# Smallmouth Bass Biology Brief

## Overview

Smallmouth bass in this engine are **current-oriented, structure-associated predators** with a **cooler-water bias** than largemouth. Authoring spans **lakes/ponds** and **rivers** (`freshwater_lake_pond`, `freshwater_river`). Seven **biome keys** map to existing `RegionKey`s for readability only; **runtime region types are unchanged**. Eligible pools must reflect **where a representative smallmouth actually feeds** in that month, clarity regime, and flow—not a generic “bass summer” hedge.

## Thermal benchmarks

- **Winter:** Metabolism low; fish hold on **slow current**, **depth breaks**, and **hard bottom**. Mood trends **negative**; presentations stay **leaning_subtle** / finesse.
- **Prespawn / spawn windows:** Region-shifted (see spawn helper in `smallmouth.ts`); **crawfish** and **rock/wood** forage lead in cold rivers; **baitfish** rises post-spawn.
- **Summer:** **Rivers:** dominant story is **seams, ledges, and moderated flow**—not all-day frog mats. **Stained / dirty** rivers in mid-latitude summer favor **subsurface reaction and contact** over blanket shallow topwater. **Clear northern lakes:** **structure and finesse** at **mid-depth** often beat a month-long “shallow + bold” baseline. **Warm highland / warm western:** still smallmouth—avoid **largemouth-style** universal surface kits unless the monthly flag and pool explicitly support a **narrow** surface window.
- **Fall:** Cooling; **baitfish** and **reaction** windows expand honestly before winter drawdown.

`BasePresentationStyle` caps boldness before daily weather.

## Forage progression by biome × month

**Northern temperate / Great Lakes / interior** (`northeast`, `great_lakes_upper_midwest`, `midwest_interior`):  
Spring: **crawfish** primary in rivers; **baitfish** secondary. Lakes: prespawn **crawfish** → spawn **cray + finesse** → post-spawn **baitfish** build. Summer: **crawfish vs baitfish** split by **water type** and **clarity**—dirty interior rivers **crawfish + sculpin silhouettes**; clear GL water **baitfish + leechy finesse**. Fall: **baitfish**-led reaction.

**Western mixed** (`mountain_west`, `inland_northwest`, `pacific_northwest`, `northern_california`):  
Cold, often **clear** flows; **current seams** and **sculpin/baitfish** streamers dominate summer rivers more than random topwater variety.

**Warm highland** (`appalachian`, `south_central`, `gulf_coast`, `southeast_atlantic`):  
Longer growing season; summer still **not** identical to largemouth—**river** rows stay **current-first** unless a row explicitly opts into a **narrow** surface window.

**Warm western** (`southern_california`, `southwest_desert`, `southwest_high_desert`):  
Low, warm, often **clear or flashy** water; **subtle to balanced** midsummer baselines; avoid implying **constant** shallow frogging for smallmouth.

## Position progression by biome × month × water type

**Rivers**

- **Winter–early spring:** **Bottom / mid** holds; flies and jigs tick structure.
- **Spawn traffic:** **Shallow** but **not** largemouth mat logic—**finesse** and **current breaks**.
- **Summer:** **Mid-column seams** and **current edges** default; **dirty** flows push **deeper contact** (blade, jig, craw profile).
- **Fall:** **Shallow_mid** feeding windows return in many systems.

**Lakes**

- **Winter:** Deep structure and **mid_low** bias after resolver.
- **Spawn / post:** Shallow migration then **rock / break** baitfish.
- **Midsummer clear Great Lakes:** **Finesse + structure** (dropshot, tube, hair jig, suspending jerk) as honest as topwater randomness.
- **Midsummer dirty interior:** **Spinnerbait / crank contact** with **subsurface** fly lanes.

## Surface viability by biome × month

- **`surface_seasonally_possible === false`** forbids **any** `is_surface` lure or fly in **eligible** pools.
- **River summer default:** **false** unless a **named** regional row carries a **tight** surface token (e.g. **popper fly** only) for credible low-light / flat-water windows.
- **Clear lake midsummer:** prefer **false** + **subsurface** pools unless the row is explicitly about a **narrow** topwater bite.

## Presentation style by biome × month

- **Winter:** **leaning_subtle** under **negative**.
- **Spring:** **balanced**; spawn-adjacent can stay **leaning_subtle** where cold water punishes mistakes.
- **Summer rivers:** **leaning_subtle** / **neutral_subtle** default; **leaning_bold** reserved for **honest** reaction months (e.g. specific fall or tailrace windows), not generic July rivers.
- **Fall:** **balanced** to **leaning_bold** where baitfish reaction is real.

## Hard biological constraints

1. **River-first correctness** over cosmetic variety—wrong seam logic = wrong smallmouth row.
2. **Cooler bias than largemouth**—do not default every summer row to **shallow + active + bold + surface hedge**.
3. **Crawfish vs baitfish** transitions must match **month × region × context**.
4. **Pool sanctity** and **primary ⊂ eligible** always.

## Out-of-range regions

**Hawaii** and other keys outside `SMALLMOUTH_V3_SUPPORTED_REGIONS` resolve via **`resolveSeasonalRowV3`** fallbacks—**do not** fabricate biome-specific smallmouth rows for keys outside the supported band; document product fallback vs literal range.

## Citations

Authoring synthesizes general *Micropterus dolomieu* ecology (current affinity, rocky habitat, thermal sensitivity vs largemouth, seasonal forage shift) with the product blueprint (`assets/tightlines_lure_fly_recommender_blueprint.md`) and engine **surface / tactical lane** rules. Agency river fisheries summaries are the right place for future numeric tuning; this brief stays **qualitative**.
