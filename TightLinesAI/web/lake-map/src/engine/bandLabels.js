/**
 * Band labels: one label inside each color band ("58–60°"), placed at the
 * most interior point of the band so it never sits on an edge.
 *
 * Labels are computed in map coordinates on a fixed 0.04° grid, from the same
 * B-spline smoothing the GPU uses, so they match the drawn bands. Because the
 * anchors are geographic, zooming and panning just carry them along with the
 * map; the set only changes when the forecast hour changes. Between hours an
 * anchor keeps its old spot as long as it is still well inside its band, so
 * playback moves labels only when the band itself moves.
 */
import { bandSpec } from './scales.js';
import { gridBox } from './frames.js';

const RES = 0.04;
const INF = 1e9;

function bspline(f) {
  const n1 = 1 - f, w0 = n1 * n1 * n1 / 6, w1 = (4 - 6 * f * f + 3 * f * f * f) / 6;
  const w3 = f * f * f / 6, w2 = 1 - w0 - w1 - w3;
  return [w0, w1, w2, w3];
}

export class BandLabeler {
  constructor(store, isWater) {
    this.store = store;
    const d = store.manifest.domain;
    this.dom = d;
    this.w = Math.round((d.east - d.west) / RES) + 1;
    this.h = Math.round((d.north - d.south) / RES) + 1;
    this.water = new Uint8Array(this.w * this.h);
    for (let j = 0; j < this.h; j++) for (let i = 0; i < this.w; i++) this.water[j * this.w + i] = isWater(d.west + i * RES, d.north - j * RES) ? 1 : 0;
    const midLat = (d.north + d.south) / 2;
    this.wx = Math.cos(midLat * Math.PI / 180); this.wy = 1; this.wd = Math.hypot(this.wx, this.wy);
    this.frameCache = new Map();
    this.cache = new Map();
    this.prev = {};
  }

  /** Native values of one frame on the label grid (B-spline, like the shader). */
  frameValues(kind, frame) {
    const hit = this.frameCache.get(frame.path); if (hit) return hit;
    const g = this.store.manifest.grids[kind], d = this.dom, W = this.w, H = this.h;
    const gb = gridBox(g, d), ox = (d.west - gb.west) / g.res, oy = (gb.north - d.north) / g.res;
    const out = new Float32Array(W * H), px = frame.rgba, fw = frame.w, fh = frame.h;
    const wind = kind === 'wind', nod = g.nodata;
    const tap = (ii, jj, ch) => px[((Math.min(fh - 1, Math.max(0, jj)) * fw) + Math.min(fw - 1, Math.max(0, ii))) * 4 + ch];
    for (let j = 0; j < H; j++) {
      const y = oy + (j * RES) / g.res, jy = Math.floor(y), wyv = bspline(y - jy);
      for (let i = 0; i < W; i++) {
        const k = j * W + i;
        if (!this.water[k]) { out[k] = NaN; continue; }
        const x = ox + (i * RES) / g.res, ix = Math.floor(x), wxv = bspline(x - ix);
        let a = 0, b = 0, bad = false;
        for (let m = 0; m < 4 && !bad; m++) for (let n = 0; n < 4; n++) {
          const wt = wxv[n] * wyv[m];
          const r = tap(ix - 1 + n, jy - 1 + m, 0);
          if (!wind && r === nod) { bad = true; break; }
          a += r * wt; if (wind) b += tap(ix - 1 + n, jy - 1 + m, 1) * wt;
        }
        out[k] = bad ? NaN : wind ? Math.hypot((a - g.offset) / g.scale, (b - g.offset) / g.scale) : a / g.scale + g.offset;
      }
    }
    if (this.frameCache.size > 24) this.frameCache.delete(this.frameCache.keys().next().value);
    this.frameCache.set(frame.path, out);
    return out;
  }

  /**
   * Anchors for a layer at hour t. frames = [A, B, mix] decoded frames.
   * Returns [{lon, lat, r (in 0.04° cells, north-south), band, text}] strongest first.
   */
  compute(layer, t, units, frames) {
    const bs = bandSpec(layer, units); if (!bs || !frames || !frames[0] || !frames[1]) return null;
    const kind = layer === 'species' ? 'temp' : layer;
    const hour = Math.round(t);
    const key = `${kind}|${hour}|${bs.width}|${bs.a}`;
    if (this.cache.has(key)) return this.cache.get(key);
    const A = this.frameValues(kind, frames[0]), B = this.frameValues(kind, frames[1]);
    const br = this.store.bracket(hour), m = br.mix;
    const W = this.w, H = this.h, N = W * H;
    const cls = new Int32Array(N);
    for (let k = 0; k < N; k++) {
      const v = A[k] + (B[k] - A[k]) * m;
      cls[k] = Number.isFinite(v) ? Math.floor((v * bs.a + bs.b) / bs.width) : -99999;
    }
    // distance (in north-south cells) to the nearest cell of another band or land
    const dist = new Float32Array(N);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const k = j * W + i, c = cls[k];
      if (c === -99999) { dist[k] = 0; continue; }
      const edge = i === 0 || j === 0 || i === W - 1 || j === H - 1 || cls[k - 1] !== c || cls[k + 1] !== c || cls[k - W] !== c || cls[k + W] !== c;
      dist[k] = edge ? 0.5 : INF;
    }
    const { wx, wy, wd } = this;
    for (let j = 1; j < H - 1; j++) for (let i = 1; i < W - 1; i++) {
      const k = j * W + i; let v = dist[k];
      v = Math.min(v, dist[k - 1] + wx, dist[k - W] + wy, dist[k - W - 1] + wd, dist[k - W + 1] + wd); dist[k] = v;
    }
    for (let j = H - 2; j > 0; j--) for (let i = W - 2; i > 0; i--) {
      const k = j * W + i; let v = dist[k];
      v = Math.min(v, dist[k + 1] + wx, dist[k + W] + wy, dist[k + W + 1] + wd, dist[k + W - 1] + wd); dist[k] = v;
    }
    // band regions (4-connected)
    const comp = new Int32Array(N).fill(-1), stack = [];
    let nComp = 0;
    for (let k0 = 0; k0 < N; k0++) {
      if (cls[k0] === -99999 || comp[k0] >= 0) continue;
      const c = cls[k0]; comp[k0] = nComp; stack.push(k0);
      while (stack.length) {
        const k = stack.pop(), i = k % W;
        if (i > 0 && comp[k - 1] < 0 && cls[k - 1] === c) { comp[k - 1] = nComp; stack.push(k - 1); }
        if (i < W - 1 && comp[k + 1] < 0 && cls[k + 1] === c) { comp[k + 1] = nComp; stack.push(k + 1); }
        if (k >= W && comp[k - W] < 0 && cls[k - W] === c) { comp[k - W] = nComp; stack.push(k - W); }
        if (k < N - W && comp[k + W] < 0 && cls[k + W] === c) { comp[k + W] = nComp; stack.push(k + W); }
      }
      nComp++;
    }
    // candidates: local maxima of distance within a 5×5 window
    const cands = [];
    for (let j = 2; j < H - 2; j++) for (let i = 2; i < W - 2; i++) {
      const k = j * W + i, v = dist[k];
      if (v < 0.9 || cls[k] === -99999) continue;
      let top = true;
      for (let dj = -2; dj <= 2 && top; dj++) for (let di = -2; di <= 2; di++) {
        if (!di && !dj) continue;
        const q = dist[k + dj * W + di];
        if (q > v || (q === v && (dj < 0 || (dj === 0 && di < 0)))) { top = false; break; }
      }
      if (top) cands.push({ i, j, k, r: v, band: cls[k], comp: comp[k] });
    }
    cands.sort((a, b) => b.r - a.r || a.k - b.k);
    const kept = [], perComp = new Map();
    for (const c of cands) {
      const list = perComp.get(c.comp) || [];
      const gap = Math.max(1.5 * c.r, 5);
      if (list.some((o) => Math.hypot((o.i - c.i) * wx, (o.j - c.j) * wy) < gap)) continue;
      list.push(c); perComp.set(c.comp, list); kept.push(c);
    }
    // stickiness: keep last hour's spot while it is still well inside the same band
    const prev = this.prev[kind] || [];
    for (const c of kept) {
      let best = null, bd = INF;
      for (const p of prev) {
        if (p.band !== c.band) continue;
        const dd = Math.hypot((p.i - c.i) * wx, (p.j - c.j) * wy);
        if (dd < bd && dd < Math.max(3 * c.r, 6)) { bd = dd; best = p; }
      }
      if (best) {
        const pk = best.j * W + best.i;
        if (cls[pk] === c.band && comp[pk] === c.comp && dist[pk] >= 0.7 * c.r) { c.i = best.i; c.j = best.j; c.k = pk; c.r = dist[pk]; }
      }
    }
    this.prev[kind] = kept.map((c) => ({ i: c.i, j: c.j, band: c.band }));
    // backups on a fixed 0.12° lattice, used when zoomed in far enough that a
    // band's main label is off screen or under a control
    const backup = [];
    for (let j = 3; j < H - 3; j += 3) for (let i = 3; i < W - 3; i += 3) {
      const k = j * W + i; if (dist[k] >= 1.5 && cls[k] !== -99999) backup.push({ i, j, k, r: dist[k], band: cls[k] });
    }
    backup.sort((a, b) => b.r - a.r || a.k - b.k);
    const d = this.dom, fmt = (v) => (bs.width < 1 ? Number(v.toFixed(1)) : Math.round(v));
    const anchors = kept.concat(backup).map((c) => ({
      lon: d.west + c.i * RES, lat: d.north - c.j * RES, r: c.r * RES, band: c.band,
      text: bs.label(fmt(c.band * bs.width), fmt((c.band + 1) * bs.width)),
    }));
    if (this.cache.size > 40) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, anchors);
    return anchors;
  }
}
