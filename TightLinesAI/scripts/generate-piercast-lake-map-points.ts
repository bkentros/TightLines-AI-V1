import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/chicagoAlpenaShadow.ts";
import { PIER_CAST_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/cities.ts";
import { PIER_CAST_FIVE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/fiveCityShadow.ts";
import { PIER_CAST_LAKE_HURON_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/lakeHuronShadow.ts";
import { PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/pentwaterCasevilleShadow.ts";
import { PIER_CAST_PUBLIC_V3_RELEASE } from "../supabase/functions/_shared/pierCastEngine/config/publicV3Release.ts";
import { PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/stJosephHarrisvilleShadow.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "../supabase/functions/_shared/pierCastEngine/config/wisconsinShadow.ts";

const outputUrl = new URL(
  "../web/lake-map/job/piercast-points.json",
  import.meta.url,
);
const profiles = [
  ...PIER_CAST_CITY_PROFILES,
  ...PIER_CAST_WISCONSIN_CITY_PROFILES,
  ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ...PIER_CAST_FIVE_CITY_PROFILES,
  ...PIER_CAST_CHICAGO_ALPENA_CITY_PROFILES,
  ...PIER_CAST_ST_JOSEPH_HARRISVILLE_CITY_PROFILES,
  ...PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
];
const byId = new Map(profiles.map((profile) => [profile.cityId, profile]));
if (byId.size !== profiles.length) {
  throw new Error("PierCast cohort profiles overlap");
}

const points = PIER_CAST_PUBLIC_V3_RELEASE.cityIds.map((cityId) => {
  const source = byId.get(cityId)?.waterTemperatureSource;
  const location = source?.configuredLocation;
  if (
    source?.productId !== "NOAA_NOS_LMHOFS_REGULARGRID" ||
    location?.gridCellStatus !== "candidate" ||
    location.depthIndex !== 0
  ) {
    throw new Error(`${cityId} has no reviewed LMHOFS surface cell`);
  }
  const expectedLatitude = 41.6 + 0.01 * location.gridRow;
  const expectedLongitude = -88.06 + 0.01 * location.gridColumn;
  if (
    Math.abs(location.latitude - expectedLatitude) > 1e-9 ||
    Math.abs(location.longitude - expectedLongitude) > 1e-9
  ) {
    throw new Error(
      `${cityId} LMHOFS cell coordinates do not match row/column`,
    );
  }
  return {
    cityId,
    gridRow: location.gridRow,
    gridColumn: location.gridColumn,
    latitude: location.latitude,
    longitude: location.longitude,
    depthIndex: location.depthIndex,
  };
});

if (
  points.length !== 32 ||
  new Set(points.map((point) => point.cityId)).size !== 32
) {
  throw new Error("PierCast public v3 must contain exactly 32 unique cities");
}

const output = `${
  JSON.stringify(
    {
      formatVersion: 1,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      model: "LMHOFS",
      grid: {
        south: 41.6,
        west: -88.06,
        rows: 478,
        columns: 837,
        resolution: 0.01,
      },
      points,
    },
    null,
    2,
  )
}\n`;

async function main() {
  if (process.argv.includes("--write")) {
    await writeFile(outputUrl, output);
  } else if (process.argv.includes("--check")) {
    const existing = await readFile(outputUrl, "utf8");
    if (existing !== output) {
      throw new Error(`${fileURLToPath(outputUrl)} is stale; run with --write`);
    }
  } else {
    process.stdout.write(output);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
