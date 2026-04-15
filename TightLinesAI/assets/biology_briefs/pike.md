# Northern Pike Biology Brief

## Overview

Northern pike are **cold-water apex predators** in this engine: opportunistic, sight-driven, and strongly tied to **vegetation, edges, and thermal refugia**. Authoring covers **lakes/ponds** and **rivers** (`freshwater_lake_pond`, `freshwater_river`). Seven **biome keys** (tropical, southeast_warm, appalachian_transition, northern_temperate, western_warm, western_inland, subarctic_alpine) map to existing `RegionKey`s for readability only; **runtime region types are unchanged**. Pools stay **tight**: if an archetype is not realistic on a representative day in that month, biome, and water type, it does not belong in the eligible pool.

## Thermal benchmarks

Pike metabolism and distribution track **temperature and stratification** more than calendar romance.

- **Cold / ice-adjacent (Dec–Mar):** Low metabolic ceiling; fish hold deeper or in slow pockets; strikes are **reaction or ambush**, not sustained shallow chases. `BaseMood` trends **negative**; `BasePresentationStyle` stays **leaning_subtle**—no faux “summer aggression” in true winter.
- **Spring build (Apr–May):** Warming and longer light pull fish toward **shallow forage and spawning traffic** (no spawn system—only **position realism**). `BaseMood` lifts toward **neutral** and short **active** windows in clear northern water.
- **Summer (Jun–Aug):** In **mid-latitude and southern-interior** populations, **stratification and warm epilimnion** dominate: the credible default is **mid- to bottom-oriented** hunting along weed edges, breaklines, and cooler inflows—not blanket **shallow + active** all day. `BaseMood` often **neutral** or **neutral_subtle**; surface/topwater is **seasonally possible** but **narrow** (dawn/dusk, wind, color) and must not be paired with **hedge-bucket** surface pools in **peak heat** where biology points to **thermocline behavior**.
- **Subarctic / short growing season (Alaska, alpine):** Summer is “big” but still **cold-water**; stratification exists but **shallow windows** can be more honest than in Kentucky or Arkansas—still avoid **largemouth-style** shallow fantasy in **July–August** on **interior southern/transition** regions.
- **Fall (Sep–Nov):** Cooling water and baitfish movement restore **active** feeding; **leaning_bold** can be defensible for **reaction and big-profile** presentations where the product’s lanes allow.

`BasePresentationStyle` caps how **bold** the default month is before daily modifiers.

## Forage progression by biome × month

**Subarctic / alpine** (`alaska`, `mountain_alpine`, cold `mountain_west` / `inland_northwest`):  
Strong **baitfish** and **bluegill_perch** (young-of-year and stocked panfish where applicable); **leech_worm** is secondary in cold, dirty flows. Summer stays **baitfish-forward** but **depth-flexible**.

**Northern temperate core** (`northeast`, `great_lakes_upper_midwest`):  
Classic pike strongholds. Spring: **baitfish** + **bluegill_perch**. Early summer (May): legitimate **shallow** push. **June–July:** stratified lakes favor **baitfish** silhouettes worked **mid-column and along weed walls** as much as bank bashing. Fall: **baitfish** pulse.

**Interior transition / warm-side edge** (`midwest_interior`, `south_central`, `appalachian`):  
Pike exist but **summer heat** is constraining: **Jul–Aug** defaults emphasize **bottom/mid holding**, **neutral_subtle** mood, and **subsurface** pools—**not** universal frog-walktop summer kits.

**Mountain west** (`mountain_west`, `inland_northwest` in pike band):  
Cooler summers than interior south; still use **stratified** rather than **pure shallow** defaults for **Jun–Aug** lakes/rivers in this pass to avoid “always shallow pike” in stratified water.

## Position progression by biome × month × water type

**Lakes / ponds**

- **Winter:** `base_water_column` **mid** (resolves toward **mid_low** in resolver); fish relate to **depth breaks** and soft bottoms.
- **Spring:** **shallow** and **high** in the column stack for feeding and traffic.
- **Summer:** **May** may stay **shallow** in northern core; **Jun–Jul** northern core shifts **mid**; **Jul–Aug interior south** shifts **bottom**-authored bias (resolver + shallow-season rules still apply) for **thermocline realism**.
- **Fall:** Return toward **mid** with **active** mood.

**Rivers**

- **Winter–early spring:** **mid** holds; **late spring** shallows for traffic.
- **Summer:** Interior **Jul–Aug** same heat discipline as lakes (subsurface-first, deeper column bias).
- **Fall:** **mid**, **active**, baitfish-led.

## Surface viability by biome × month

- If `surface_seasonally_possible === false`, **no** `is_surface` lure or fly may appear in **eligible** pools.
- **Interior edge Jul–Aug:** **`false`** for both contexts—no hollow-body / walker / popper / frog / mouse in pools.
- **Northern core peak summer (Jun–Jul):** **`true`** only with **narrow** surface representation (e.g. **popper fly** token) while **lure** pools stay **subsurface** in the stratified kit—avoid implying all-day frog mats in **Minnesota July** as the default biology.
- **Northern core May and mountain summer band:** **`true`** with controlled pools where shallow windows are still **cold-water-credible**.

## Presentation style by biome × month

- **Winter:** **`leaning_subtle`** under **`negative`** mood.
- **Spring:** **`balanced`** default.
- **Summer:** **`leaning_subtle`** under stratification or heat stress; **`balanced`** only where shallow feeding is still the honest default (e.g. northern **May**).
- **Fall:** **`leaning_bold`** when big-profile reaction is honest.

## Hard biological constraints

1. Pike are **cold-water apex predators**—authoring must not read like **warmwater bass** with teeth.
2. **Thermocline / depth** matter in **summer lakes**, especially **Jul–Aug** on **interior** regions.
3. **Eligible pool is sacred**; primaries must sit inside the pool and reflect **true lead** options for that month.
4. **Streamer / big-profile fly** logic follows the product blueprint; no nymph/dry systems.

## Out-of-range regions

**Deep tropical / peninsular** contexts (`florida`, `hawaii`, **`gulf_coast`** as lowland warm) are **not** honest northern pike strongholds in this product model. **Do not fabricate** primary pike rows for those keys; **`resolveSeasonalRowV3`** fallbacks may substitute **interior** or **southeast** keys for API completeness—call that **product fallback**, not biology. **Pacific rim keys** without authored pike rows resolve through **mountain / inland** fallbacks—same rule: **no fake regional pike ecology** for keys outside `NORTHERN_PIKE_V3_SUPPORTED_REGIONS`.

## Citations

Authoring synthesizes general esocid ecology (thermal habitat, stratified summer distribution, shallow spring/fall windows) with the engine’s tactical and **surface-flag** rules (`assets/tightlines_lure_fly_recommender_blueprint.md`). Agency stocking and regional distribution maps should inform future **gating** work; this brief stays **qualitative** to avoid false precision.
