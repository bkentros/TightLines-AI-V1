/**
 * Fetches USGS 3DHP polygons for curated Blue Grass FWA pits and writes a
 * Supabase migration SQL file. Run from TightLinesAI/:
 *   npx tsx scripts/generate-blue-grass-fwa-migration.ts
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const LAYER_URL =
  'https://hydro.nationalmap.gov/arcgis/rest/services/3DHP_all/FeatureServer/60/query';
const ACRES_PER_SQKM = 247.10538146717;

/** id3dhp → canonical name + search aliases (IN DNR / angler usage). */
const CURATED_PITS: Array<{
  id3dhp: string;
  canonicalName: string;
  aliases: string[];
  searchPriority?: number;
}> = [
  {
    id3dhp: 'L3VSS',
    canonicalName: 'Blue Grass Pit',
    aliases: [
      'blue grass pit',
      'bluegrass pit',
      'bluegrass',
      'blue grass',
      'blue grass fwa',
      'bluegrass fwa',
    ],
    searchPriority: 80,
  },
  {
    id3dhp: 'KA57A',
    canonicalName: 'Loon Pit',
    aliases: ['loon pit', 'loon pit blue grass', 'blue grass loon pit'],
    searchPriority: 90,
  },
  {
    id3dhp: 'KCUQA',
    canonicalName: 'Otter Pit',
    aliases: ['otter pit', 'otter pit blue grass', 'blue grass otter pit'],
    searchPriority: 100,
  },
  {
    id3dhp: 'M5TNW',
    canonicalName: 'Ringneck Pit',
    aliases: ['ringneck pit', 'ring neck pit', 'blue grass ringneck'],
    searchPriority: 110,
  },
  {
    id3dhp: 'LUY58',
    canonicalName: 'Bird Dog Pit',
    aliases: ['bird dog pit', 'birddog pit', 'blue grass bird dog'],
    searchPriority: 120,
  },
  {
    id3dhp: 'MJG4L',
    canonicalName: 'Heim Pit',
    aliases: ['heim pit', 'heim site pit', 'blue grass heim'],
    searchPriority: 130,
  },
  {
    id3dhp: 'KFK4S',
    canonicalName: 'Warren Pit',
    aliases: ['warren pit', 'warrens pit', 'blue grass warren'],
    searchPriority: 140,
  },
  {
    id3dhp: 'LS8P2',
    canonicalName: 'Morgan Pit',
    aliases: ['morgan pit', 'blue grass morgan'],
    searchPriority: 150,
  },
  {
    id3dhp: 'MGPZ6',
    canonicalName: 'Ray Nell Pit',
    aliases: ['ray nell pit', 'ray nell acres', 'blue grass ray nell'],
    searchPriority: 160,
  },
  {
    id3dhp: 'JOHWR',
    canonicalName: 'Cottonmouth Pit',
    aliases: ['cottonmouth pit', 'blue grass cottonmouth'],
    searchPriority: 170,
  },
  {
    id3dhp: 'KCUQJ',
    canonicalName: 'Teal Pit',
    aliases: ['teal pit', 'blue grass teal'],
    searchPriority: 180,
  },
  {
    id3dhp: 'L16N6',
    canonicalName: 'Woodcock Pit',
    aliases: ['woodcock pit', 'blue grass woodcock'],
    searchPriority: 190,
  },
  {
    id3dhp: 'MGPZ5',
    canonicalName: 'Quail Pit',
    aliases: ['quail pit', 'blue grass quail'],
    searchPriority: 200,
  },
  {
    id3dhp: 'M5TO4',
    canonicalName: 'Pheasant Pit',
    aliases: ['pheasant pit', 'blue grass pheasant'],
    searchPriority: 210,
  },
];

interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

interface ArcFeature {
  properties: Record<string, unknown>;
  geometry: GeoJsonGeometry | null;
}

function sqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function jsonLiteral(value: unknown): string {
  return sqlLiteral(JSON.stringify(value));
}

async function fetchFeature(id3dhp: string): Promise<ArcFeature | null> {
  const url = new URL(LAYER_URL);
  url.search = new URLSearchParams({
    f: 'geojson',
    where: `id3dhp='${id3dhp}'`,
    outFields: 'id3dhp,gnisid,gnisidlabel,areasqkm,featuretype',
    returnGeometry: 'true',
    outSR: '4326',
  }).toString();
  const response = await fetch(url, {
    headers: { 'User-Agent': 'FinFindr-WaterReader/1.0' },
  });
  if (!response.ok) {
    throw new Error(`3DHP fetch failed for ${id3dhp}: ${response.status}`);
  }
  const body = (await response.json()) as { features?: ArcFeature[] };
  return body.features?.[0] ?? null;
}

async function main() {
  const rows: string[] = [];
  const aliasRows: string[] = [];

  for (const pit of CURATED_PITS) {
    const feature = await fetchFeature(pit.id3dhp);
    if (!feature?.geometry) {
      console.warn(`Skipping ${pit.id3dhp} — no geometry`);
      continue;
    }
    const areaSqKm = Number(feature.properties.areasqkm ?? 0);
    const areaAcres = Number.isFinite(areaSqKm) ? areaSqKm * ACRES_PER_SQKM : null;
    const externalId = `3dhp:${pit.id3dhp}`;
    const sourceSummary = {
      source: 'USGS 3DHP + IN DNR Blue Grass FWA curation',
      id3dhp: pit.id3dhp,
      manual_curated: true,
      property: 'Blue Grass Fish & Wildlife Area',
    };

    rows.push(`
insert into public.waterbody_index (
  external_source,
  external_id,
  canonical_name,
  state_code,
  county_name,
  waterbody_type,
  is_named,
  is_searchable,
  region_key,
  centroid,
  geometry,
  surface_area_acres,
  search_priority,
  source_summary
)
values (
  'manual_curated_in_fwa',
  ${sqlLiteral(externalId)},
  ${sqlLiteral(pit.canonicalName)},
  'IN',
  'Warrick',
  'pond',
  true,
  true,
  'great_lakes_upper_midwest',
  ST_PointOnSurface(ST_SetSRID(ST_GeomFromGeoJSON(${jsonLiteral(feature.geometry)}), 4326)),
  ST_Multi(ST_CollectionExtract(ST_SetSRID(ST_MakeValid(ST_GeomFromGeoJSON(${jsonLiteral(feature.geometry)})), 4326), 3)),
  ${areaAcres != null ? areaAcres.toFixed(4) : 'null'},
  ${pit.searchPriority ?? 200},
  ${jsonLiteral(sourceSummary)}::jsonb
)
on conflict (external_source, external_id) do update set
  canonical_name = excluded.canonical_name,
  state_code = excluded.state_code,
  county_name = excluded.county_name,
  waterbody_type = excluded.waterbody_type,
  is_named = excluded.is_named,
  is_searchable = excluded.is_searchable,
  region_key = excluded.region_key,
  centroid = excluded.centroid,
  geometry = excluded.geometry,
  surface_area_acres = excluded.surface_area_acres,
  search_priority = excluded.search_priority,
  source_summary = excluded.source_summary,
  updated_at = timezone('utc', now());`);

    const allAliases = new Set([
      pit.canonicalName.toLowerCase(),
      ...pit.aliases.map((a) => a.toLowerCase()),
      'blue grass fwa',
      'bluegrass fwa',
      'evansville',
    ]);
    for (const alias of allAliases) {
      aliasRows.push(`
insert into public.waterbody_aliases (waterbody_id, alias_name, alias_source)
select w.id, ${sqlLiteral(alias)}, 'manual_curated'
from public.waterbody_index w
where w.external_source = 'manual_curated_in_fwa' and w.external_id = ${sqlLiteral(externalId)}
on conflict (waterbody_id, normalized_alias_name) do nothing;`);
    }

    console.log(`OK ${pit.id3dhp} ${pit.canonicalName} (${areaAcres?.toFixed(1) ?? '?'} ac)`);
  }

  const sql = `-- Blue Grass Fish & Wildlife Area (Warrick County, IN) curated pit ingest.
-- Generated by scripts/generate-blue-grass-fwa-migration.ts — search/discovery only; no Water Read engine changes.

begin;
${rows.join('\n')}
${aliasRows.join('\n')}
commit;

notify pgrst, 'reload schema';
`;

  const outPath = join(
    process.cwd(),
    'supabase/migrations/20260625120000_blue_grass_fwa_curated_pits.sql',
  );
  await writeFile(outPath, sql, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
