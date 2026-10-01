/**
 * Loads the Live Lake Map frame set (manifest + PNG grids), decodes each grid
 * once for CPU sampling (readout, pier values, labels) and hands the compact
 * pixel buffers to the GPU layers. Frames are fetched lazily around the current
 * time and evicted behind playback so a five-day run cannot exhaust a phone.
 */
export const FRAME_CACHE_BEHIND = 2;
export const FRAME_CACHE_AHEAD = 4;

/** Scalar PNGs need one byte/pixel; only wind needs its four RGBA channels. */
export function compactFramePixels(path, rgba) {
  if (path.startsWith('wind/')) return { data: rgba, channels: 4 };
  const data = new Uint8Array(rgba.length / 4);
  for (let src = 0, dst = 0; dst < data.length; src += 4, dst++) data[dst] = rgba[src];
  return { data, channels: 1 };
}

/**
 * Packs a scalar frame for filtered GPU sampling. The value is premultiplied
 * by validity (invalid texels store zero, never the no-data sentinel) and the
 * second channel is an explicit 0/255 validity mask. Linear texture filtering
 * can therefore be composed into bicubic filtering and normalized afterward
 * without allowing a no-data byte to influence the result.
 */
export function packScalarTexturePixels(data, nodata, channels = 1) {
  const packed = new Uint8Array(Math.floor(data.length / channels) * 2);
  for (let src = 0, dst = 0; src < data.length; src += channels, dst += 2) {
    const valid = nodata === undefined || data[src] !== nodata;
    packed[dst] = valid ? data[src] : 0;
    packed[dst + 1] = valid ? 255 : 0;
  }
  return packed;
}

/** Interpolates two samples without ever treating a missing value as data. */
export function interpolateValidValues(a, b, mix) {
  const av = Number.isFinite(a), bv = Number.isFinite(b);
  if (av && bv) return a + (b - a) * mix;
  if (av) return a;
  if (bv) return b;
  return NaN;
}

function sameOriginPath(input, base = location.href) {
  const page = new URL(base);
  const target = new URL(input, page);
  if (target.origin !== page.origin) throw new Error('Cross-origin map data is not allowed');
  return `${target.pathname}${target.search}`;
}

export class FrameStore {
  constructor(baseUrl) {
    this.base = sameOriginPath(baseUrl).replace(/\/?$/, '/');
    this.images = new Map(); // path -> Promise<{data, channels, w, h}>
    this.listeners = new Set();
    this.evictListeners = new Set();
  }
  url(path) {
    return sameOriginPath(path, new URL(this.base, location.origin).href);
  }
  async init() {
    const res = await fetch(this.url('manifest.json'));
    if (!res.ok) throw new Error('Map data unavailable');
    this.manifest = await res.json();
    const m = this.manifest;
    this.hours = m.frames.map((f) => f.hour);
    this.maxHour = this.hours[this.hours.length - 1];
    this.t0 = Date.parse(m.frames[0].validTime);
    const [events, depth] = await Promise.all([
      fetch(this.url(m.events)).then((r) => r.ok ? r.json() : { events: [] }).catch(() => ({ events: [] })),
      m.depth ? this.load(m.depth) : Promise.resolve(null),
    ]);
    this.events = events.events || [];
    this.depth = depth;
    return this;
  }
  onLoad(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  onEvict(fn) { this.evictListeners.add(fn); return () => this.evictListeners.delete(fn); }
  load(path) {
    if (!this.images.has(path)) {
      let promise;
      promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => {
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
          x.drawImage(img, 0, 0);
          const rgba = x.getImageData(0, 0, img.width, img.height).data;
          const compact = compactFramePixels(path, rgba);
          const frame = { path, w: img.width, h: img.height, ...compact };
          promise.__v = frame;
          resolve(frame);
          if (this.images.get(path) === promise) this.listeners.forEach((fn) => fn(frame));
          else this.evictListeners.forEach((fn) => fn(path, frame));
          c.width = 0; c.height = 0;
        };
        img.onerror = () => reject(new Error('Frame failed: ' + path));
        img.src = this.url(path);
      });
      this.images.set(path, promise);
    }
    return this.images.get(path);
  }
  /** The two frames around hour t and the blend between them. */
  bracket(t) {
    const hs = this.hours; let i = 0;
    while (i < hs.length - 2 && t >= hs[i + 1]) i++;
    const a = hs[i], b = hs[Math.min(hs.length - 1, i + 1)];
    return { ia: i, ib: Math.min(hs.length - 1, i + 1), a, b, mix: b > a ? Math.min(1, Math.max(0, (t - a) / (b - a))) : 0 };
  }
  framePath(kind, index) { return this.manifest.frames[index][kind]; }
  /** Starts loading frames for the next few steps so playback never waits. */
  prefetch(t, kinds, ahead = 3) {
    const { ia } = this.bracket(t);
    for (let k = -1; k <= ahead; k++) {
      const i = Math.min(this.hours.length - 1, Math.max(0, ia + k));
      kinds.forEach((kind) => this.load(this.framePath(kind, i)).catch(() => {}));
    }
    this.prune(t, kinds, ahead);
  }
  /** Keep a small decoded window around playback; immutable HTTP caching handles rewinds. */
  prune(t, kinds, ahead = 3) {
    const { ia } = this.bracket(t), keep = new Set();
    for (let k = -FRAME_CACHE_BEHIND; k <= Math.max(ahead, FRAME_CACHE_AHEAD); k++) {
      const i = Math.min(this.hours.length - 1, Math.max(0, ia + k));
      kinds.forEach((kind) => keep.add(this.framePath(kind, i)));
    }
    for (const [path, promise] of this.images) {
      if (!kinds.some((kind) => path.startsWith(`${kind}/`)) || keep.has(path)) continue;
      this.images.delete(path);
      promise.__discarded = true;
      if (promise.__v) this.evictListeners.forEach((fn) => fn(path, promise.__v));
    }
  }
  loaded(path) { return this.images.get(path); }
}

/* ── CPU sampling of decoded grids ── */
/** A grid's own area: wind covers a wider box than the lake data (grid.west / grid.north). */
export function gridBox(grid, domain) {
  const west = grid.west ?? domain.west, north = grid.north ?? domain.north;
  return { west, north, east: west + (grid.width - 1) * grid.res, south: north - (grid.height - 1) * grid.res };
}

export function gridSampler(grid, domain) {
  const box = gridBox(grid, domain);
  return (frame, lon, lat, channel = 0) => {
    if (!frame) return NaN;
    const x = (lon - box.west) / grid.res, y = (box.north - lat) / grid.res;
    const i = Math.floor(x), j = Math.floor(y);
    if (i < 0 || j < 0 || i >= frame.w - 1 || j >= frame.h - 1) return NaN;
    const fx = x - i, fy = y - j, d = frame.data || frame.rgba, w = frame.w;
    const channels = frame.channels || 4;
    const v = (ii, jj) => d[((jj * w) + ii) * channels + channel];
    const a = v(i, j), b = v(i + 1, j), c = v(i, j + 1), e = v(i + 1, j + 1);
    if (grid.nodata !== undefined && (a === grid.nodata || b === grid.nodata || c === grid.nodata || e === grid.nodata)) {
      let s = 0, ws = 0;
      [[a, (1 - fx) * (1 - fy)], [b, fx * (1 - fy)], [c, (1 - fx) * fy], [e, fx * fy]].forEach(([val, wt]) => { if (val !== grid.nodata) { s += val * wt; ws += wt; } });
      return ws > 0.05 ? s / ws : NaN;
    }
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + e * fx * fy;
  };
}

function cubicWeights(f) {
  const n1 = 1 - f;
  const w0 = n1 * n1 * n1 / 6;
  const w1 = (4 - 6 * f * f + 3 * f * f * f) / 6;
  const w3 = f * f * f / 6;
  return [w0, w1, 1 - w0 - w1 - w3, w3];
}

/**
 * CPU equivalent of the field shader's B-spline sampling. Invalid neighbors
 * are excluded and the remaining positive weights are normalized, keeping
 * readouts and labels aligned with the rendered scalar field.
 */
export function gridCubicSampler(grid, domain) {
  const box = gridBox(grid, domain);
  return (frame, lon, lat, channel = 0) => {
    if (!frame) return NaN;
    const x = (lon - box.west) / grid.res;
    const y = (box.north - lat) / grid.res;
    if (x < 0 || y < 0 || x > frame.w - 1 || y > frame.h - 1) return NaN;
    const ix = Math.floor(x), iy = Math.floor(y);
    const wx = cubicWeights(x - ix), wy = cubicWeights(y - iy);
    const pixels = frame.data || frame.rgba;
    const channels = frame.channels || 4;
    let sum = 0, weight = 0;
    for (let j = 0; j < 4; j++) {
      const yy = Math.min(frame.h - 1, Math.max(0, iy - 1 + j));
      for (let i = 0; i < 4; i++) {
        const xx = Math.min(frame.w - 1, Math.max(0, ix - 1 + i));
        const value = pixels[(yy * frame.w + xx) * channels + channel];
        if (grid.nodata !== undefined && value === grid.nodata) continue;
        const w = wx[i] * wy[j];
        sum += value * w;
        weight += w;
      }
    }
    return weight > 1e-6 ? sum / weight : NaN;
  };
}
