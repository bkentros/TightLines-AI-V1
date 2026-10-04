import { FrameStore, gridBox } from './frames.js';

export const TEMP_DEPTHS_FT = Object.freeze([10, 20, 30, 40, 50]);
export const TEMP_DEPTH_NOTE = 'Modeled by NOAA. Temperatures below the surface are estimates.';
export const TEMP_DEPTH_UNAVAILABLE = 'Depth temps unavailable for this forecast';

export function featureState(features) {
  const state = features && features.tempDepth;
  return state === 'labs' || state === 'on' ? state : 'off';
}

export function tempDepthEnabled(features, { labsQuery = false, labsUnlocked = false } = {}) {
  const state = featureState(features);
  return state === 'on' || (state === 'labs' && (labsQuery || labsUnlocked));
}

export function depthLabel(depthFt, lengthUnit = 'ft') {
  return lengthUnit === 'm' ? `${Math.round(depthFt * 0.3048)} m` : `${depthFt} ft`;
}

export function depthPickerItems(lengthUnit = 'ft') {
  return TEMP_DEPTHS_FT.map((depthFt) => ({ depthFt, label: depthLabel(depthFt, lengthUnit) }));
}

export function rememberedDepth(value, fallback = 30) {
  const depthFt = Number(value);
  return TEMP_DEPTHS_FT.includes(depthFt) ? depthFt : fallback;
}

export function depthPopoverTop({ anchorBottom, popoverHeight, floor = 0, ceiling, gap = 8 }) {
  return Math.max(floor, Math.min(anchorBottom + gap, ceiling - popoverHeight));
}

export function layerChangedProps(layer, depthFt, source) {
  if (layer !== 'temp_depth') return { layer };
  const props = { layer, depth_ft: depthFt };
  if (source === 'sheet' || source === 'readout') props.source = source;
  return props;
}

export function depthCellValid(frame, grid, domain, lon, lat) {
  if (!frame || !frame.data) return false;
  const box = gridBox(grid, domain);
  const i = Math.round((lon - box.west) / grid.res), j = Math.round((box.north - lat) / grid.res);
  return i >= 0 && j >= 0 && i < frame.w && j < frame.h && frame.data[j * frame.w + i] !== grid.nodata;
}

function validPointer(pointer, surfaceRun) {
  if (!pointer || pointer.run !== surfaceRun || typeof pointer.base !== 'string' || !/^runs\/tdepth-[\w-]+\/$/.test(pointer.base)) return false;
  if (!Array.isArray(pointer.depthsFt) || !TEMP_DEPTHS_FT.every((depth) => pointer.depthsFt.includes(depth))) return false;
  return true;
}

/**
 * The small pointer is loaded at feature startup. A depth manifest and its
 * frames are not requested until that depth is selected.
 */
export class TempDepthCatalog {
  constructor(pointerUrl, surfaceRun, { fetchImpl = fetch, smoothTemperature = true } = {}) {
    this.pointerUrl = pointerUrl;
    this.surfaceRun = surfaceRun;
    this.fetchImpl = fetchImpl;
    this.smoothTemperature = smoothTemperature;
    this.stores = new Map();
  }

  async init() {
    try {
      // Invoke unbound: browser fetch rejects when an arbitrary object becomes
      // its `this` value (which would make depth look unavailable).
      const fetchPointer = this.fetchImpl;
      const response = await fetchPointer(this.pointerUrl, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return this;
      const pointer = await response.json();
      if (validPointer(pointer, this.surfaceRun)) this.pointer = pointer;
    } catch { /* a missing depth run must never affect the surface map */ }
    return this;
  }

  get available() { return !!this.pointer; }

  async store(depthFt) {
    if (!this.available || !TEMP_DEPTHS_FT.includes(depthFt) || !this.pointer.depthsFt.includes(depthFt)) throw new Error(TEMP_DEPTH_UNAVAILABLE);
    if (!this.stores.has(depthFt)) {
      const base = new URL(`../${this.pointer.base}d${String(depthFt).padStart(3, '0')}/`, location.href).href;
      const promise = new FrameStore(base, { smoothTemperature: this.smoothTemperature }).init();
      this.stores.set(depthFt, promise);
      promise.catch(() => { if (this.stores.get(depthFt) === promise) this.stores.delete(depthFt); });
    }
    return this.stores.get(depthFt);
  }
}
