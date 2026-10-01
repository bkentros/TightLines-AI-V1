/**
 * Loads the Live Lake Map frame set (manifest + PNG grids), decodes each grid
 * once for CPU sampling (readout, pier values, labels) and hands the same
 * images to the GPU layers. Frames are fetched lazily around the current time.
 */
function sameOriginPath(input, base = location.href) {
  const page = new URL(base);
  const target = new URL(input, page);
  if (target.origin !== page.origin) throw new Error('Cross-origin map data is not allowed');
  return `${target.pathname}${target.search}`;
}

export class FrameStore {
  constructor(baseUrl) {
    this.base = sameOriginPath(baseUrl).replace(/\/?$/, '/');
    this.images = new Map(); // path -> Promise<{img, data, w, h}>
    this.listeners = new Set();
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
  load(path) {
    if (!this.images.has(path)) {
      this.images.set(path, new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.decoding = 'async';
        img.onload = () => {
          const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
          const x = c.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
          x.drawImage(img, 0, 0);
          const rgba = x.getImageData(0, 0, img.width, img.height).data;
          const frame = { path, img, w: img.width, h: img.height, rgba };
          resolve(frame);
          this.listeners.forEach((fn) => fn(frame));
        };
        img.onerror = () => reject(new Error('Frame failed: ' + path));
        img.src = this.url(path);
      }));
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
    const fx = x - i, fy = y - j, d = frame.rgba, w = frame.w;
    const v = (ii, jj) => d[((jj * w) + ii) * 4 + channel];
    const a = v(i, j), b = v(i + 1, j), c = v(i, j + 1), e = v(i + 1, j + 1);
    if (grid.nodata !== undefined && (a === grid.nodata || b === grid.nodata || c === grid.nodata || e === grid.nodata)) {
      let s = 0, ws = 0;
      [[a, (1 - fx) * (1 - fy)], [b, fx * (1 - fy)], [c, (1 - fx) * fy], [e, fx * fy]].forEach(([val, wt]) => { if (val !== grid.nodata) { s += val * wt; ws += wt; } });
      return ws > 0.05 ? s / ws : NaN;
    }
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + e * fx * fy;
  };
}
