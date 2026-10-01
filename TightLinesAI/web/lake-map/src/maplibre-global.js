import * as maplibregl from 'maplibre-gl';

// The application bundle uses a tiny shim around this global so MapLibre can
// remain a separately cached asset. The application configures the separate,
// self-hosted module worker before creating a map.
window.maplibregl = maplibregl;
