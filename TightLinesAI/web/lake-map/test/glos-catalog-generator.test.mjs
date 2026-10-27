import assert from 'node:assert/strict';
import test from 'node:test';
import { assertCatalogScale, normalizeCatalog, renderCatalogModule } from '../gate/update-glos-catalog.mjs';

function fixture(overrides = {}) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-87.85, 43.1] },
    properties: {
      obs_dataset_id: 2,
      org_platform_id: '45013',
      platform_name: 'Atwater buoy',
      body_of_water: 'lake-michigan',
      platform_type: 'moored_buoy',
      parameters: [{ standard_name: 'sea_water_temperature' }],
      ...overrides,
    },
  };
}

const parameters = [{
  parameter_id: 148,
  standard_name: 'sea_water_temperature',
  parameter_name: 'sea_water_temperature',
  depth: 1,
  public: true,
}];

test('GLOS catalog generator keeps only validated Great Lakes temperature metadata', () => {
  const result = normalizeCatalog({
    type: 'FeatureCollection',
    features: [
      fixture(),
      fixture({ obs_dataset_id: 3, parameters: [{ standard_name: 'wind_speed' }] }),
      { ...fixture({ obs_dataset_id: 4 }), geometry: { type: 'Point', coordinates: [-70, 40] } },
    ],
  }, [...parameters, { parameter_id: 149, standard_name: 'wind_speed', parameter_name: 'wind' }]);

  assert.deepEqual({ ...result.datasets }, {
    2: { externalId: '45013', name: 'Atwater buoy', body: 'lake-michigan', type: 'moored_buoy', lon: -87.85, lat: 43.1 },
  });
  assert.deepEqual({ ...result.temperatureParameters }, {
    148: { standard: 'sea_water_temperature', name: 'sea_water_temperature', depthM: 1 },
  });
});

test('GLOS catalog generator rejects unsafe or structurally invalid network metadata', () => {
  assert.throws(() => normalizeCatalog({}, parameters), /FeatureCollection/);
  assert.throws(() => normalizeCatalog({ type: 'FeatureCollection', features: [fixture({ obs_dataset_id: '../escape' })] }, parameters), /invalid positive integer/);
  assert.throws(() => normalizeCatalog({ type: 'FeatureCollection', features: [fixture({ platform_name: 'bad\nexport const injected=true' })] }, parameters), /invalid text/);
  assert.throws(() => normalizeCatalog({ type: 'FeatureCollection', features: [fixture()] }, [{ ...parameters[0], depth: 1001 }]), /invalid depth/);
});

test('GLOS catalog output is inert data and scale guards reject suspicious truncation', async () => {
  const catalog = normalizeCatalog({ type: 'FeatureCollection', features: [fixture({ platform_name: '\";globalThis.pwned=true;//' })] }, parameters);
  const moduleText = renderCatalogModule(catalog, '2026-10-01T12:00:00.000Z');
  globalThis.pwned = false;
  const imported = await import(`data:text/javascript,${encodeURIComponent(moduleText)}`);
  assert.equal(globalThis.pwned, false);
  assert.equal(imported.GLOS_DATASETS['2'].name, '\";globalThis.pwned=true;//');
  delete globalThis.pwned;
  assert.throws(() => assertCatalogScale(catalog), /unexpected Great Lakes dataset count/);
});
