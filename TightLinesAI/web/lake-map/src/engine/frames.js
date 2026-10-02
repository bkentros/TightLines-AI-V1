/**
 * Loads the Live Lake Map frame set (manifest + PNG grids), decodes each grid
 * once for CPU sampling (readout, pier values, labels) and hands the compact
 * pixel buffers to the GPU layers. Frames are fetched lazily around the current
 * time and evicted behind playback so a five-day run cannot exhaust a phone.
 */
export const FRAME_CACHE_BEHIND = 2;
export const FRAME_CACHE_AHEAD = 4;
/** Upper bound while playing fast (2× = 6 forecast hours a second). */
export const FRAME_CACHE_MAX_AHEAD = 12;
/** A frame that failed to download is retried after this long (never in a tight loop). */
export const FRAME_RETRY_MS = 15000;

/**
 * Calls fn(frame) once when a frame promise settles successfully. Safe to call
 * on every render: each distinct callback is registered once per promise (one
 * shared .then), and a failed download never surfaces as an unhandled rejection.
 * Returns the frame when it is already decoded.
 */
export function onFrameReady(promise, fn) {
  if (!promise) return undefined;
  if (promise.__v) return promise.__v;
  if (!promise.__waiting) {
    const waiting = promise.__waiting = new Set();
    promise.then((v) => { promise.__v = v; waiting.forEach((cb) => cb(v)); waiting.clear(); }, () => waiting.clear());
  }
  promise.__waiting.add(fn);
  return undefined;
}

/**
 * Frame encodings this page decodes. static-build/publish.py copies this list to
 * map/capabilities.json after the page goes live; the data job only publishes
 * an encoding listed there. "u8": 8-bit gray. "rgb16": value = R × 256 + G.
 */
export const FRAME_ENCODINGS = ['u8', 'rgb16'];

/** Scalar PNGs need one value/pixel (8-bit, or 16-bit for rgb16); only wind keeps RGBA. */
export function compactFramePixels(path, rgba, encoding = 'u8') {
  if (path.startsWith('wind/')) return { data: rgba, channels: 4 };
  if (encoding === 'rgb16') {
    const data = new Uint16Array(rgba.length / 4);
    for (let src = 0, dst = 0; dst < data.length; src += 4, dst++) data[dst] = rgba[src] * 256 + rgba[src + 1];
    return { data, channels: 1 };
  }
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

/*
 * Half floats for 16-bit frames. The color field keeps rgb16 frames on the GPU
 * as RG16F (value − center, validity), which filters smoothly on every WebGL2
 * device; centering keeps half-float error under ±0.013 °F across 30–82 °F.
 */
const halfBuf = new DataView(new ArrayBuffer(4));
export function toHalf(x) {
  halfBuf.setFloat32(0, x);
  const f = halfBuf.getUint32(0), sign = (f >>> 16) & 0x8000;
  let e = ((f >>> 23) & 0xff) - 127 + 15, m = f & 0x7fffff;
  if (e <= 0) return sign; // tiny values are 0 at this scale
  if (e >= 31) return sign | 0x7c00;
  m += 0x1000; if (m & 0x800000) { m = 0; e += 1; if (e >= 31) return sign | 0x7c00; } // round to nearest
  return sign | (e << 10) | (m >>> 13);
}
/** Native value at the middle of a 16-bit grid's working range (°F for temperature). */
export const halfCenter = (grid) => grid.center ?? grid.offset + 26;
const halfTables = new WeakMap();
/** Packs a 16-bit frame as RG16F half floats: (value − center, 1) or (0, 0) for no data. */
export function packScalarHalfPixels(data, grid, out = new Uint16Array(data.length * 2)) {
  let table = halfTables.get(grid);
  if (!table) {
    table = new Uint16Array(65536);
    const c = halfCenter(grid);
    for (let raw = 0; raw < 65536; raw++) table[raw] = toHalf(raw / grid.scale + grid.offset - c);
    halfTables.set(grid, table);
  }
  const ONE = 0x3c00, nodata = grid.nodata;
  for (let i = 0, o = 0; i < data.length; i++, o += 2) {
    const v = data[i];
    if (v === nodata) { out[o] = 0; out[o + 1] = 0; } else { out[o] = table[v]; out[o + 1] = ONE; }
  }
  return out;
}

/**
 * Value at fraction m between hours a and b, using the hours on either side
 * (p before a, n after b) for smooth motion: Catmull-Rom, clamped to the range
 * of a and b so it never invents a value neither hour has. Falls back to a
 * straight blend at the ends of the run or next to missing data. The color
 * field shader uses the same formula, so readouts match the picture.
 */
export function blendHours(p, a, b, n, m) {
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(p) || !Number.isFinite(n)) return interpolateValidValues(a, b, m);
  const m2 = m * m, m3 = m2 * m;
  const v = 0.5 * (2 * a + (b - p) * m + (2 * p - 5 * a + 4 * b - n) * m2 + (3 * a - p - 3 * b + n) * m3);
  return Math.min(Math.max(a, b), Math.max(Math.min(a, b), v));
}

/*
 * Display smoothing for water temperature. NOAA's field carries grid-scale
 * texture (and, in 8-bit frames, 0.2 °F steps), so in flat warm or cold pools a
 * band edge breaks into islands and holes. A front-preserving (bilateral) filter
 * removes wiggles smaller than ~sigmaValue across ~sigmaCells while leaving real
 * temperature breaks (upwelling edges, river plumes) sharp. The store then serves
 * the smoothed field to everything on the page, so the color you see, the band
 * labels, the pier pills and the readout always agree.
 */
export const TEMP_SMOOTHING = Object.freeze({ radius: 3, sigmaCells: 1.5, sigmaValue: 0.4 });
/** How smoothed temperature is held on the page: 0.01 °F steps, 65535 = no data. */
export const DISPLAY_TEMP = Object.freeze({ scale: 100, offset: 30, nodata: 65535, encoding: 'rgb16' });

/**
 * Smoothed temperature as DISPLAY_TEMP values. raw: stored values, src: their
 * grid ({scale, offset, nodata}), p: TEMP_SMOOTHING. Self-contained on purpose:
 * the background decoder runs this exact source.
 */
export function smoothedTemperature(raw, w, h, src, p) {
  const n = w * h, F = new Float32Array(n), valid = new Uint8Array(n);
  if (!p.radius) { // no filter: straight unit conversion (main-thread fallback)
    const display = new Uint16Array(n);
    for (let i = 0; i < n; i++) {
      const r = raw[i];
      if (r === src.nodata) { display[i] = 65535; continue; }
      const q = Math.round((r / src.scale + src.offset - 30) * 100);
      display[i] = q < 0 ? 0 : q > 65534 ? 65534 : q;
    }
    return display;
  }
  for (let i = 0; i < n; i++) { const r = raw[i]; if (r !== src.nodata) { F[i] = r / src.scale + src.offset; valid[i] = 1; } }
  const R = p.radius, taps = 2 * R + 1, sw = new Float32Array(taps);
  for (let k = -R; k <= R; k++) sw[k + R] = Math.exp(-(k * k) / (2 * p.sigmaCells * p.sigmaCells));
  // range weights by |difference| in 1/inv °F steps; beyond 3 sigma a neighbor does not count
  const STEPS = 256, inv = (STEPS - 1) / (3 * p.sigmaValue), rw = new Float32Array(STEPS + 1);
  for (let i = 0; i < STEPS; i++) { const d = i / inv; rw[i] = Math.exp(-(d * d) / (2 * p.sigmaValue * p.sigmaValue)); }
  rw[STEPS] = 0;
  const tmp = new Float32Array(n), out = new Float32Array(n);
  // one pass along rows (stride 1) or columns (stride w); separable approximation of the 2D filter
  const pass = (inp, dst, stride, len, lines, lineStride) => {
    for (let line = 0; line < lines; line++) {
      const base = line * lineStride;
      for (let a = 0; a < len; a++) {
        const i = base + a * stride;
        if (!valid[i]) continue;
        const c = inp[i], lo = a - R < 0 ? -a : -R, hi = a + R >= len ? len - 1 - a : R;
        let sum = 0, ws = 0;
        for (let k = lo, j = i + lo * stride; k <= hi; k++, j += stride) {
          if (!valid[j]) continue;
          const v = inp[j], dv = v > c ? v - c : c - v;
          let d = (dv * inv) | 0; if (d > STEPS) d = STEPS;
          const wt = sw[k + R] * rw[d];
          sum += v * wt; ws += wt;
        }
        dst[i] = sum / ws; // ws >= 1: the center always counts
      }
    }
  };
  pass(F, tmp, 1, w, h, w);
  pass(tmp, out, w, h, w, 1);
  const display = new Uint16Array(n);
  for (let i = 0; i < n; i++) {
    if (!valid[i]) { display[i] = 65535; continue; }
    const q = Math.round((out[i] - 30) * 100);
    display[i] = q < 0 ? 0 : q > 65534 ? 65534 : q;
  }
  return display;
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
  constructor(baseUrl, { smoothTemperature = true } = {}) {
    this.base = sameOriginPath(baseUrl).replace(/\/?$/, '/');
    this.smoothTemperature = smoothTemperature;
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
    // The page works with the smoothed temperature field (see smoothedTemperature):
    // grids.temp describes what the page holds, grids.tempSource what the files store.
    if (this.smoothTemperature && m.grids?.temp && !m.grids.tempSource) {
      m.grids.tempSource = m.grids.temp;
      m.grids.temp = { ...m.grids.temp, ...DISPLAY_TEMP, smoothed: TEMP_SMOOTHING };
    }
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
      promise = this.decode(path).then((frame) => {
        promise.__v = frame;
        if (this.images.get(path) === promise) this.listeners.forEach((fn) => fn(frame));
        else this.evictListeners.forEach((fn) => fn(path, frame));
        return frame;
      }, (err) => {
        // forget the failure after a pause so the next prefetch tries again
        setTimeout(() => { if (this.images.get(path) === promise) this.images.delete(path); }, FRAME_RETRY_MS);
        throw err;
      });
      promise.catch(() => {}); // callers that only prefetch never see the rejection
      this.images.set(path, promise);
    }
    return this.images.get(path);
  }
  /**
   * Download + decode one PNG into compact pixels. Off the main thread when the
   * WebView allows it (a background worker with OffscreenCanvas), so playback
   * never stutters while the next hours arrive; otherwise the classic <img> path.
   */
  async decode(path) {
    const scalar = !path.startsWith('wind/');
    const smooth = path.startsWith('temp/') && this.manifest?.grids?.tempSource;
    const grid = smooth ? this.manifest.grids.tempSource : this.gridFor(path); // how the file is stored
    const nodata = scalar ? grid?.nodata : undefined, encoding = (scalar && grid?.encoding) || 'u8';
    if (!FRAME_ENCODINGS.includes(encoding)) throw new Error(`Frame encoding ${encoding} is not supported by this page`);
    const url = new URL(this.url(path), location.origin).href;
    const smoothing = smooth ? { src: { scale: grid.scale, offset: grid.offset, nodata: grid.nodata }, params: TEMP_SMOOTHING } : null;
    const worker = frameDecoder();
    if (worker) {
      try { return { path, ...(await worker.decode(url, scalar, nodata, encoding, smoothing)) }; } catch (err) {
        if (!err || err.message !== 'unsupported') throw new Error('Frame failed: ' + path);
      }
    }
    const frame = await decodeOnPage(url, path, encoding);
    // No background threads (iOS before 16.4): convert to the page's 0.01 °F grid but skip the
    // filter (radius 0), so decoding on the main thread never makes playback stutter.
    if (smoothing) { frame.data = smoothedTemperature(frame.data, frame.w, frame.h, smoothing.src, { ...smoothing.params, radius: 0 }); frame.channels = 1; }
    return frame;
  }
  gridFor(path) {
    const kind = path.split('/')[0];
    return this.manifest?.grids?.[kind] || (path === this.manifest?.depth ? this.manifest.grids.depth : null);
  }
  /** The two frames around hour t and the blend between them. */
  bracket(t) {
    const hs = this.hours; let i = 0;
    while (i < hs.length - 2 && t >= hs[i + 1]) i++;
    const a = hs[i], b = hs[Math.min(hs.length - 1, i + 1)];
    return { ia: i, ib: Math.min(hs.length - 1, i + 1), a, b, mix: b > a ? Math.min(1, Math.max(0, (t - a) / (b - a))) : 0 };
  }
  framePath(kind, index) { return this.manifest.frames[index][kind]; }
  /**
   * How many forecast hours ahead to keep decoded. One store-wide setting, so
   * every caller (engine, color field, wind streaks) agrees on the same window;
   * playback raises it to cover about a second and a half of play.
   */
  setLookahead(hours) { this.ahead = Math.max(FRAME_CACHE_AHEAD, Math.min(FRAME_CACHE_MAX_AHEAD, Math.ceil(hours))); }
  lookahead() { return this.ahead ?? FRAME_CACHE_AHEAD; }
  /** true when the frames on both sides of hour t are downloaded and decoded. */
  isLoaded(kind, t) {
    const { ia, ib } = this.bracket(t);
    return [ia, ib].every((i) => { const p = this.images.get(this.framePath(kind, i)); return !!(p && p.__v); });
  }
  /** Starts loading frames for the next few steps so playback never waits. */
  prefetch(t, kinds, ahead = 0) {
    ahead = Math.max(ahead, this.lookahead());
    const { ia } = this.bracket(t);
    for (let k = -1; k <= ahead; k++) {
      const i = Math.min(this.hours.length - 1, Math.max(0, ia + k));
      kinds.forEach((kind) => this.load(this.framePath(kind, i)).catch(() => {}));
    }
    this.prune(t, kinds, ahead);
  }
  /** Keep a small decoded window around playback; immutable HTTP caching handles rewinds. */
  prune(t, kinds, ahead = 0) {
    const { ia } = this.bracket(t), keep = new Set();
    for (let k = -FRAME_CACHE_BEHIND; k <= Math.max(ahead, this.lookahead()); k++) {
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

/* ── frame decoding ── */
/** Main-thread decode (older WebViews): <img> → canvas → compact pixels. */
function decodeOnPage(url, path, encoding) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
      x.drawImage(img, 0, 0);
      const rgba = x.getImageData(0, 0, img.width, img.height).data;
      resolve({ path, w: img.width, h: img.height, ...compactFramePixels(path, rgba, encoding) });
      c.width = 0; c.height = 0;
    };
    img.onerror = () => reject(new Error('Frame failed: ' + path));
    img.src = url;
  });
}

/*
 * Background decoder. The worker is built from a Blob (the page's CSP allows
 * blob: workers) and reuses packScalarTexturePixels' own source, so the GPU
 * packing is identical to the main-thread path. Scalar frames come back as
 * one byte per pixel for CPU sampling plus the packed (value, validity) pairs
 * the color field uploads; wind keeps RGBA.
 */
function workerSource() {
  return `const pack = ${packScalarTexturePixels.toString()};
const smoothTemp = ${smoothedTemperature.toString()};
self.onmessage = async (e) => {
  const { id, url, scalar, nodata, encoding, smoothing } = e.data;
  try {
    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') throw new Error('unsupported');
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const bmp = await createImageBitmap(await res.blob(), { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
    const w = bmp.width, h = bmp.height, c = new OffscreenCanvas(w, h);
    const x = c.getContext('2d', { willReadFrequently: true });
    if (!x) throw new Error('unsupported');
    x.drawImage(bmp, 0, 0); if (bmp.close) bmp.close();
    const rgba = x.getImageData(0, 0, w, h).data;
    if (!scalar) {
      const data = new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.length);
      self.postMessage({ id, w, h, data, channels: 4 }, [data.buffer]);
      return;
    }
    if (encoding === 'rgb16' || smoothing) {
      // 16-bit and smoothed frames are packed for the GPU (half floats) only when uploaded
      let data16;
      if (encoding === 'rgb16') {
        data16 = new Uint16Array(w * h);
        for (let i = 0; i < data16.length; i++) data16[i] = rgba[i * 4] * 256 + rgba[i * 4 + 1];
      } else {
        data16 = new Uint8Array(w * h);
        for (let i = 0; i < data16.length; i++) data16[i] = rgba[i * 4];
      }
      if (smoothing) data16 = smoothTemp(data16, w, h, smoothing.src, smoothing.params);
      self.postMessage({ id, w, h, data: data16, channels: 1 }, [data16.buffer]);
      return;
    }
    const data = new Uint8Array(w * h);
    for (let i = 0; i < data.length; i++) data[i] = rgba[i * 4];
    const packed = pack(data, nodata, 1);
    self.postMessage({ id, w, h, data, packed, channels: 1 }, [data.buffer, packed.buffer]);
  } catch (err) {
    self.postMessage({ id, error: String((err && err.message) || err) });
  }
};`;
}

let decoder;
/** Background decoders: 2–3 threads so fast playback is never waiting on one. */
export const DECODER_THREADS = () => Math.max(1, Math.min(3, ((typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 2) - 1));
/** The shared background decoder pool, or null when workers are unavailable. */
export function frameDecoder() {
  if (decoder !== undefined) return decoder;
  decoder = null;
  try {
    if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL.createObjectURL !== 'function') return decoder;
    const src = URL.createObjectURL(new Blob([workerSource()], { type: 'text/javascript' }));
    const pending = new Map(); let next = 1;
    const fail = (message) => { pending.forEach(({ reject }) => reject(new Error(message))); pending.clear(); };
    const workers = Array.from({ length: DECODER_THREADS() }, () => {
      const worker = new Worker(src);
      worker.busy = 0;
      worker.onmessage = ({ data }) => {
        const job = pending.get(data.id); if (!job) return;
        pending.delete(data.id); worker.busy--;
        if (data.error) {
          if (data.error === 'unsupported') decoder = null; // this WebView decodes on the page instead
          job.reject(new Error(data.error));
        } else job.resolve({ w: data.w, h: data.h, data: data.data, packed: data.packed || null, channels: data.channels });
      };
      worker.onerror = (e) => { e.preventDefault?.(); decoder = null; fail('unsupported'); };
      return worker;
    });
    decoder = {
      threads: workers.length,
      decode(url, scalar, nodata, encoding, smoothing = null) {
        return new Promise((resolve, reject) => {
          const id = next++; pending.set(id, { resolve, reject });
          // the least busy thread takes the next frame
          const worker = workers.reduce((a, b) => (b.busy < a.busy ? b : a));
          worker.busy++;
          worker.postMessage({ id, url, scalar, nodata, encoding, smoothing });
        });
      },
    };
  } catch { decoder = null; }
  return decoder;
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
