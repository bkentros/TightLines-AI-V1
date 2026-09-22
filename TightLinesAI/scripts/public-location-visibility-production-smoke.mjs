import assert from 'node:assert/strict';

const base = (process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, '');
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
assert.ok(base && anon, 'Supabase URL and anonymous key are required');

const expectedRivers = [
  'bear_creek_manistee', 'betsie', 'big_manistee', 'bois_brule', 'clackamas', 'cowlitz', 'grand',
  'green', 'kewaunee_river', 'lower_genesee', 'manitowoc', 'milwaukee',
  'muskegon', 'oak_orchard', 'oswego', 'pere_marquette', 'platte', 'puyallup',
  'rogue_mi', 'root', 'salmon_ny', 'sheboygan', 'st_joseph', 'trail_creek', 'white',
];
const expectedPierCities = [
  'algoma_wi', 'alpena_mi', 'caseville_mi', 'charlevoix_mi', 'chicago_il',
  'frankfort_elberta_mi', 'grand_haven_mi', 'harbor_beach_mi', 'harrisville_mi',
  'holland_mi', 'kenosha_wi', 'kewaunee_wi', 'lexington_mi', 'ludington_mi',
  'manistee_mi', 'manitowoc_wi', 'michigan_city_in', 'milwaukee_wi',
  'muskegon_mi', 'oscoda_mi', 'pentwater_mi', 'port_sanilac_mi',
  'port_washington_wi', 'racine_wi', 'rogers_city_mi', 'sheboygan_wi',
  'south_haven_mi', 'st_joseph_mi', 'tawas_city_mi', 'two_rivers_wi',
  'waukegan_il', 'whitehall_mi',
];

async function get(path) {
  const response = await fetch(`${base}/functions/v1/${path}`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
    signal: AbortSignal.timeout(30000),
  });
  const body = await response.json();
  assert.equal(response.status, 200, `${path}: ${body?.error || response.status}`);
  return body;
}

const riverCatalog = await get('river-run/rivers');
const riverPlacements = riverCatalog.states.flatMap(state =>
  state.rivers.map(river => ({ state: state.state, river }))
);
const riverIds = [...new Set(riverPlacements.map(({ river }) => river.riverId))].sort();
const runIds = [...new Set(riverPlacements.flatMap(({ river }) =>
  river.runs.map(run => run.runId)
))];
assert.deepEqual(riverIds, expectedRivers, 'all supported rivers must be public');
assert.equal(runIds.length, 78, 'all 78 supported runs must be public');
assert.ok(riverPlacements.every(({ river }) => river.runs.length > 0));

const pierCatalog = await get('pier-cast/catalog');
assert.deepEqual(
  pierCatalog.cities.map(city => city.cityId).sort(),
  expectedPierCities,
  'all 32 PierCast cities must be discoverable',
);
const released = pierCatalog.cities.filter(city => city.releaseStatus === 'public_research');
const preview = pierCatalog.cities.filter(city => city.releaseStatus === 'research_only');
assert.equal(released.length, 32, 'all 32 cities must expose public reports');
assert.equal(preview.length, 0, 'the live catalog must not contain preview cities');
assert.ok(released.every(city => city.species.length > 0));

const leaderboard = await get('pier-cast/leaderboard');
assert.deepEqual(
  leaderboard.cities.map(city => city.cityId).sort(),
  released.map(city => city.cityId).sort(),
  'standings must contain only released city scores',
);

console.log(`PASS: anonymous production catalog exposes ${riverIds.length} rivers / ${runIds.length} runs and ${pierCatalog.cities.length} PierCast cities (${released.length} scored, ${preview.length} research previews).`);
