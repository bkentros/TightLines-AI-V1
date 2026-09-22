import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

import { selectPierCastCoveredStructures } from "../lib/pierCastCoveredStructures";
import { pierCastParentGreatLakeName, pierCastWaterBodyName } from "../lib/pierCastWaterBody";
import { buildPierCastCatalog } from "../supabase/functions/_shared/pierCastEngine/config/catalog.ts";

const root = resolve(import.meta.dirname, "..");

test("every owner-review city renders named, non-excluded pier rows", () => {
  const catalog = buildPierCastCatalog("review", "v3");
  assert.equal(catalog.cities.length, 32);

  for (const city of catalog.cities) {
    const structures = selectPierCastCoveredStructures(city.structures);
    assert.ok(structures.length > 0, `${city.displayName} has no visible pier rows`);
    for (const structure of structures) {
      assert.notEqual(
        structure.disposition,
        "excluded",
        `${city.displayName} exposes excluded structure ${structure.structureId}`,
      );
      assert.ok(
        structure.displayName.trim().length > 0,
        `${city.displayName} has a blank visible pier label`,
      );
    }
  }
});

test("Manistee shows North Pier without the excluded South Breakwater", () => {
  const catalog = buildPierCastCatalog("review", "v3");
  const manistee = catalog.cities.find((city) => city.cityId === "manistee_mi");
  assert(manistee);
  assert.deepEqual(
    selectPierCastCoveredStructures(manistee.structures).map((structure) =>
      structure.displayName
    ),
    ["North Pier"],
  );
});

test("all 32 owner cities use an explicit water label and Caseville retains Lake Huron parentage", () => {
  const catalog = buildPierCastCatalog("review", "v3");
  const lakeHuronCities = catalog.cities
    .filter((city) => pierCastWaterBodyName(city.cityId) === "Lake Huron")
    .map((city) => city.cityId)
    .sort();

  assert.deepEqual(lakeHuronCities, [
    "alpena_mi",
    "harbor_beach_mi",
    "harrisville_mi",
    "lexington_mi",
    "oscoda_mi",
    "port_sanilac_mi",
    "rogers_city_mi",
    "tawas_city_mi",
  ]);
  assert.equal(
    catalog.cities.filter((city) =>
      pierCastWaterBodyName(city.cityId) === "Lake Michigan"
    ).length,
    23,
  );
  assert.equal(
    catalog.cities.filter((city) =>
      pierCastWaterBodyName(city.cityId) === "Great Lakes"
    ).length,
    0,
    "every released city must have an explicit lake assignment",
  );
  assert.equal(pierCastWaterBodyName("caseville_mi"), "Saginaw Bay");
  assert.equal(pierCastParentGreatLakeName("caseville_mi"), "Lake Huron");
  assert.equal(
    catalog.cities.filter((city) => pierCastWaterBodyName(city.cityId) === "Saginaw Bay").length,
    1,
  );
});

test("mixed-city standings use neutral Great Lakes copy", () => {
  const screen = readFileSync(resolve(root, "app/pier-cast-review.tsx"), "utf8");
  assert.match(screen, /TODAY ON THE GREAT LAKES/);
  assert.doesNotMatch(screen, /TODAY ON LAKE MICHIGAN/);
});

test("expanded city access keeps the standard user-facing PierCast header", () => {
  const screen = readFileSync(resolve(root, "app/pier-cast-review.tsx"), "utf8");
  assert.match(
    screen,
    /<Text style=\{styles\.navEyebrow\}>GREAT LAKES · PIER FORECAST<\/Text>/,
  );
  assert.doesNotMatch(screen, /PRIVATE OWNER REVIEW/);
});

test("pier labels use full-width wrapping rows instead of auto-sized flex chips", () => {
  const screen = readFileSync(resolve(root, "app/pier-cast-review.tsx"), "utf8");
  assert.match(screen, /style=\{styles\.pierChipBody\}/);

  const listStyle = screen.match(
    /pierChips:\s*\{([\s\S]*?)\n\s*\},\n\s*pierChip:/,
  );
  assert(listStyle, "pierChips style was not found");
  assert.doesNotMatch(listStyle[1], /flexDirection|flexWrap/);

  const bodyStyle = screen.match(
    /pierChipBody:\s*\{([\s\S]*?)\n\s*\},\n\s*pierChipDot:/,
  );
  assert(bodyStyle, "pierChipBody style was not found");
  assert.match(bodyStyle[1], /flex:\s*1/);
  assert.match(bodyStyle[1], /minWidth:\s*0/);
});
