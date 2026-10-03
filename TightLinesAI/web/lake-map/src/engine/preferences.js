export const DEFAULT_MAP_LAYER = 'temp';

export const MAP_LAYERS = Object.freeze([
  'temp',
  'wind',
  'waves',
  'depth',
  'species',
]);

/** First visit uses temperature; later visits restore the last valid layer. */
export function resolveInitialMapLayer(savedLayer, { tempDepth = false } = {}) {
  if (tempDepth && savedLayer === 'temp_depth') return savedLayer;
  return MAP_LAYERS.includes(savedLayer) ? savedLayer : DEFAULT_MAP_LAYER;
}
