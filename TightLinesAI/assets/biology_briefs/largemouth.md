# Largemouth Bass Biology Brief

## Overview

Largemouth bass (`Micropterus salmoides`) in this engine are **warm-biased generalists** compared to smallmouth: they exploit **vegetation, wood, docks, and shallow forage** more routinely. Authoring spans **lakes/ponds** and **rivers** where the product exposes them. Seven **biome keys** map to existing `RegionKey`s for readability only; **runtime region types are unchanged**. Pools must read as **largemouth-specific** (cover, bluegill-perch, frog/topwater where honest—not “generic bass”).

## Thermal benchmarks

- **Northern / interior winter (Dec–Feb):** Cold, slow metabolism; fish **suspend or hug bottom structure**; feeding windows are **narrow**. Monthly mood stays **negative** with **leaning_subtle** presentation; pools favor **jig / blade / suspending / leech-craw** over **big baitfish streamer** defaults.
- **Prespawn / spawn:** Region-shifted windows; **crawfish** and **bluegill_perch** rise in importance; **shallow cover** becomes honest in warm regions earlier than in the north.
- **Summer:** **Warm / Florida / Gulf:** **vegetation, frog, and topwater** lanes are **strong** where stratification and cover support them. **Clear northern natural lakes:** **pressured** fish often favor **finesse**, **suspending**, and **bottom-contact** over month-long **aggressive shallow** baselines.
- **Fall:** **Baitfish** and **reaction** expand again; grass mats and wind-blown banks can justify **bolder** presentation where surface flags allow.

`BasePresentationStyle` caps how bold the **monthly default** is before daily modifiers.

## Forage progression by biome × month

**Northern / Great Lakes clear** (`northeast`, `great_lakes_upper_midwest`):  
Winter: **baitfish** / **crawfish** on bottom. Spring: **crawfish** → **leech_worm** / **baitfish** in clear spawn traffic. Summer: **bluegill_perch** and **baitfish** with **finesse** bias in **clear** water; **weed-oriented** horizontal baits when **shallow cover** is the honest story. Fall: **baitfish**-led.

**Midwest stained** (`midwest_interior`):  
Strong **crawfish** and **dirty-water reaction** (spinnerbait, bladed jig, frog) in warm months; still distinguish **July** **weed mat** behavior from **smallmouth river** logic.

**Southeast / Gulf / Florida** (`gulf_coast`, `southeast_atlantic`, `florida`):  
Long growing season; **bluegill_perch**, **baitfish**, **crawfish** rotations; **frog / hollow body / buzz** where **surface_seasonally_possible** is true and pools include those archetypes.

**Western warm / inland** (`southern_california`, `southwest_desert`, `mountain_west`, etc.):  
Reservoir and natural-lake mixes; **spawn earlier** in warm deserts; summer can be **control-depth** (bush, ledge) not only bank bashing.

## Position progression by biome × month × water type

**Lakes / ponds**

- **Winter:** **Bottom** / **mid_low** holds; **deep structure** and **slow presentations**.
- **Spawn / post:** **Shallow** and **high** in the column stack near **cover**.
- **Summer:** **Shallow** grass and **mid** offshore structure both valid—**region** picks which monthly baseline dominates.
- **Fall:** **Shallow to mid** feeding migrations.

**Rivers**

- **Winter:** **Bottom** seams and **wood**.
- **Warm delta / south:** **Current seams** + **cover**; **frog** when surface flag and pool align.

## Surface viability by biome × month

- **`surface_seasonally_possible === false`** forbids **any** `is_surface` lure or fly in **eligible** pools.
- **Warm-region summer:** **true** when pools include **frog / walker / buzz / popper / mouse** as **credible** defaults—not every row in every region.
- **Clear northern summer:** often **false** for fly pools or **true** only when **lure-side** surface (e.g. hollow body) is the narrow honest token.

## Presentation style by biome × month

- **Northern winter:** **leaning_subtle** only.
- **Northern clear summer:** **leaning_subtle** / **balanced**—avoid default **leaning_bold** for **every** July natural lake.
- **Warm grass summer:** **leaning_bold** acceptable when biology and pool support it.

## Hard biological constraints

1. **Distinct from smallmouth:** more **vegetation / shallow / warm-edge** behavior where supported.
2. **Northern cold periods** must not read like **peak summer aggression** in the **monthly baseline**.
3. **Pool sanctity** and **primary ⊂ eligible** always.

## Out-of-range regions

Keys outside `LARGEMOUTH_V3_SUPPORTED_REGIONS` resolve via **`resolveSeasonalRowV3`** fallbacks—do not fabricate rows for impossible species-region pairs.

## Citations

Authoring synthesizes general largemouth ecology (cover association, forage shifts, latitudinal spawn timing) with the product blueprint (`assets/tightlines_lure_fly_recommender_blueprint.md`) and engine **surface / tactical lane** rules. This brief stays **qualitative**.
