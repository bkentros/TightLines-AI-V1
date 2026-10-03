/**
 * GPU color field for the Live Lake Map (MapLibre custom layer).
 *
 * Draws one of: water temperature, waves or wind speed (distinct bands with
 * thin edge lines), depth (relief shading) or a species temperature window, straight from the frame PNGs.
 * Values are interpolated per screen pixel (smooth B-spline filtering) and
 * blended between the two frames around the current time, so bands and
 * lines are exact at every zoom. The coastline comes from the land layer
 * drawn above this one.
 */
import { compile, texture, buffer, bindAttr, bindTex, mercX, mercY } from './gl.js';
import { PALETTES, paletteBytes, BAND_EPS } from './scales.js';
import { gridBox, packScalarTexturePixels, packScalarHalfPixels, halfCenter, onFrameReady } from './frames.js';

/** Textures kept on the GPU around the playhead (hours behind / ahead); the rest stay decoded on the CPU only. */
export const GPU_BEHIND = 2, GPU_AHEAD = 4;

const VS = `#version 300 es
in vec2 a_pos;
uniform mat4 u_matrix;
out vec2 v_merc;
void main() { v_merc = a_pos; gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
in vec2 v_merc;
out vec4 outColor;
uniform sampler2D u_a, u_b, u_p, u_n, u_pal; // hours a, b and the ones before (p) / after (n)
uniform float u_mix;
uniform float u_cubic;   // 1 = p and n are bound: smooth motion across hours
uniform vec2 u_lin;      // scalar texture -> native: value = stored * x + y
uniform vec4 u_dom;      // west, east, south, north
uniform vec2 u_size;     // grid width, height
uniform int u_mode;      // 1 scalar, 2 depth, 3 wind speed
uniform vec3 u_dec;      // scale, offset, nodata(0..255)
uniform vec2 u_range;    // palette min, max (native units)
uniform float u_banded;  // 1 = distinct bands
uniform vec2 u_conv;     // native -> display: disp = v * x + y
uniform float u_band;    // band width in display units
uniform float u_lines;   // band edge lines on/off
uniform float u_species; // 1 = highlight u_sp (native °F window)
uniform vec2 u_sp;
uniform float u_relief;  // relief strength
uniform float u_opacity;
uniform float u_strict_mask; // depth temperatures: never smooth across a shallow-water mask
const float PI = 3.141592653589793;
const float BAND_EPS = ${BAND_EPS.toFixed(6)};  // bands; see scales.js
const float FLAT = 1e-5;       // smaller per-pixel change than this = flat water, no edge line
const float SP_EPS = 0.004;    // °F

vec2 gridUV(vec2 merc) {
  float lon = merc.x * 360.0 - 180.0;
  float lat = degrees(atan(sinh(PI * (1.0 - 2.0 * merc.y))));
  vec2 g = vec2((lon - u_dom.x) / (u_dom.y - u_dom.x), (u_dom.w - lat) / (u_dom.w - u_dom.z));
  return (g * (u_size - 1.0) + 0.5) / u_size;
}
// Cubic B-spline filtering with 4 bilinear taps (smooth, no stair steps).
vec4 cubic(float v) {
  vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v; vec4 s = n * n * n;
  float x = s.x, y = s.y - 4.0 * s.x, z = s.z - 4.0 * s.y + 6.0 * s.x, w = 6.0 - x - y - z;
  return vec4(x, y, z, w) * (1.0 / 6.0);
}
vec4 bicubic(sampler2D t, vec2 uv) {
  vec2 tc = uv * u_size - 0.5; vec2 f = fract(tc); tc -= f;
  vec4 xc = cubic(f.x), yc = cubic(f.y);
  vec4 c = tc.xxyy + vec2(-0.5, 1.5).xyxy;
  vec4 s = vec4(xc.xz + xc.yw, yc.xz + yc.yw);
  vec4 off = c + vec4(xc.yw, yc.yw) / s;
  off /= u_size.xxyy;
  vec4 s0 = texture(t, off.xz), s1 = texture(t, off.yz), s2 = texture(t, off.xw), s3 = texture(t, off.yw);
  float sx = s.x / (s.x + s.y), sy = s.z / (s.z + s.w);
  return mix(mix(s3, s2, sx), mix(s1, s0, sx), sy);
}
// Scalar textures store (value * validity, validity). Because B-spline
// weights are positive, four filtered taps produce the exact weighted sums
// needed to exclude invalid texels and normalize the remaining neighborhood.
vec2 validScalar(sampler2D t, vec2 uv) {
  vec2 packed = bicubic(t, uv).rg;
  return packed.g > 0.000001 ? vec2(packed.r / packed.g, packed.g) : vec2(0.0);
}
// Smooth motion between hours (same formula as blendHours in frames.js):
// Catmull-Rom through the neighboring hours, clamped to the two current hours.
float hours(float p, float a, float b, float n, float m) {
  float v = 0.5 * (2.0 * a + (b - p) * m + (2.0 * p - 5.0 * a + 4.0 * b - n) * m * m + (3.0 * a - p - 3.0 * b + n) * m * m * m);
  return clamp(v, min(a, b), max(a, b));
}
vec3 pal(float v) { return texture(u_pal, vec2(clamp((v - u_range.x) / (u_range.y - u_range.x), 0.0, 1.0) * (255.0 / 256.0) + 0.5 / 256.0, 0.5)).rgb; }

void main() {
  vec2 uv = gridUV(v_merc);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) discard;
  float value;
  if (u_mode == 3) {
    vec2 wa = bicubic(u_a, uv).rg, wb = bicubic(u_b, uv).rg, wm = mix(wa, wb, u_mix);
    if (u_cubic > 0.5) {
      vec2 wp = bicubic(u_p, uv).rg, wn = bicubic(u_n, uv).rg;
      wm = vec2(hours(wp.x, wa.x, wb.x, wn.x, u_mix), hours(wp.y, wa.y, wb.y, wn.y, u_mix));
    }
    vec2 w = (wm * 255.0 - u_dec.y) / u_dec.x;
    value = length(w);
  } else {
    if (u_strict_mask > 0.5 && min(texture(u_a, uv).g, texture(u_b, uv).g) < 0.999) discard;
    vec2 a = validScalar(u_a, uv), b = validScalar(u_b, uv);
    bool av = a.y > 0.000001, bv = b.y > 0.000001;
    if (!av && !bv) discard;
    float raw = av && bv ? mix(a.x, b.x, u_mix) : av ? a.x : b.x;
    if (u_cubic > 0.5) { // uniform branch: the extra taps run only when both neighbors exist
      vec2 p = validScalar(u_p, uv), n = validScalar(u_n, uv);
      if (av && bv && p.y > 0.000001 && n.y > 0.000001) raw = hours(p.x, a.x, b.x, n.x, u_mix);
    }
    value = raw * u_lin.x + u_lin.y;
  }
  // The frames store values in fixed steps (0.2 °F, 0.05 ft), so whole patches of
  // water can sit exactly on a band edge (e.g. 60.0 °F). Two rules keep those
  // patches clean: values are nudged a hair past the edge (BAND_EPS, the same
  // nudge the labels and pier pills use), and an edge line is only drawn where
  // the field actually changes across the pixel (a flat patch has no edge).
  vec3 color;
  if (u_banded > 0.5) {
    float disp = value * u_conv.x + u_conv.y;
    float q = disp / u_band + BAND_EPS, band = floor(q);
    float midNative = ((band + 0.5) * u_band - u_conv.y) / u_conv.x;
    color = pal(midNative) * (mod(band, 2.0) > 0.5 ? 0.96 : 1.015);
    if (u_lines > 0.5) {
      float d = abs(fract(q + 0.5) - 0.5), w = fwidth(q);
      float line = (1.0 - smoothstep(0.35 * w, 1.25 * w, d)) * step(FLAT, w);
      color = mix(color, vec3(0.03, 0.08, 0.13), line * 0.26);
    }
  } else {
    color = pal(value);
    if (u_mode == 2) {
      vec2 g = vec2(dFdx(value), dFdy(value));
      color *= clamp(1.0 - (g.x + g.y) * u_relief, 0.72, 1.28);
      float q = value / 50.0 + BAND_EPS, d = abs(fract(q + 0.5) - 0.5), w = fwidth(q);
      color = mix(color, vec3(1.0), (1.0 - smoothstep(0.35 * w, 1.25 * w, d)) * 0.28 * step(w, 0.5) * step(FLAT, w));
    }
  }
  if (u_species > 0.5) {
    // inclusive window (matches speciesFit); the tolerance only absorbs float noise
    float inR = step(u_sp.x - SP_EPS, value) * step(value, u_sp.y + SP_EPS);
    vec3 grey = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
    color = mix(mix(grey, color, 0.3) * 0.42, color * 1.08, inR);
    float w = fwidth(value), dl = min(abs(value - u_sp.x), abs(value - u_sp.y));
    color = mix(color, vec3(1.0), (1.0 - smoothstep(0.6 * w, 2.0 * w, dl)) * 0.9 * step(FLAT, w));
  }
  outColor = vec4(color * u_opacity, u_opacity);
}`;

const DECODE = {
  temp: { mode: 1, grid: 'temp' },
  waves: { mode: 1, grid: 'waves' },
  depth: { mode: 2, grid: 'depth' },
  wind: { mode: 3, grid: 'wind' },
};

export class FieldLayer {
  constructor(store, id = 'lake-field') {
    this.id = id; this.type = 'custom'; this.renderingMode = '2d';
    this.store = store; this.layer = 'temp'; this.t = 0; this.units = { temp: 'F', wind: 'mph', length: 'ft' }; this.lines = true; this.band = null; this.species = null; this.opacity = 1; this.strictMask = false;
    this.textures = new Map(); this.palettes = {};
    this.lastBy = {};      // per kind: the last complete [A, B, mix] drawn, shown while newer hours load
    this.held = new Set(); // textures released by the store but still on screen
  }
  onAdd(map, gl) {
    this.map = map; this.gl = gl;
    this.repaint = () => map.triggerRepaint(); // one stable callback per layer
    this.prog = compile(gl, VS, FS);
    const d = this.store.manifest.domain;
    const x0 = mercX(d.west), x1 = mercX(d.east), y0 = mercY(d.north), y1 = mercY(d.south);
    this.quad = buffer(gl, new Float32Array([x0, y0, x1, y0, x0, y1, x1, y1]));
    for (const name of Object.keys(PALETTES)) this.palettes[name] = texture(gl, { width: 256, height: 1, data: paletteBytes(name) });
    this.watchStore();
  }
  watchStore() {
    this.stopLoad?.(); this.stopEvict?.();
    this.stopLoad = this.store.onLoad(() => this.map.triggerRepaint());
    // A released hour that is still on screen keeps its texture until the field
    // moves on, so scrubbing or jumping never flashes empty water.
    this.stopEvict = this.store.onEvict((path) => {
      if (!this.textures.has(path)) return;
      if (this.onScreen(path)) this.held.add(path);
      else { this.gl.deleteTexture(this.textures.get(path)); this.textures.delete(path); }
    });
  }
  /** Switches an already-added field to another FrameStore (used by Temp at depth). */
  setStore(store) {
    if (store === this.store) return;
    if (this.gl) for (const tex of this.textures.values()) this.gl.deleteTexture(tex);
    this.textures.clear(); this.held.clear(); this.lastBy = {}; this.hourOf = null;
    this.store = store;
    if (this.map) this.watchStore();
    this.map?.triggerRepaint();
  }
  set(opts) { Object.assign(this, opts); this.map && this.map.triggerRepaint(); }
  onScreen(path) { return Object.values(this.lastBy).some((fr) => fr && [fr[0], fr[1], fr[3], fr[4]].some((f) => f && f.path === path)); }
  hasTexture(path) { return this.textures.has(path); }
  /** Which frame kind the field is drawing right now (temp, waves, wind or depth). */
  kind() { return DECODE[this.layer].grid; }
  /** Frees held textures that are no longer part of what is drawn. */
  releaseHeld() {
    for (const path of this.held) {
      if (this.onScreen(path)) continue;
      this.held.delete(path);
      const tex = this.textures.get(path); if (tex) { this.gl.deleteTexture(tex); this.textures.delete(path); }
    }
  }
  tex(frame, grid) {
    const key = frame.path;
    if (this.textures.has(key)) { this.held.delete(key); return this.textures.get(key); } // back in the window: live again
    const gl = this.gl, isWind = key.startsWith('wind'), half = !isWind && grid?.encoding === 'rgb16';
    let t;
    if (half) {
      // 16-bit frames: (value − center, validity) as half floats, packed into one reused buffer
      const n = frame.w * frame.h * 2;
      if (!this.halfScratch || this.halfScratch.length !== n) this.halfScratch = new Uint16Array(n);
      t = texture(gl, { width: frame.w, height: frame.h, data: packScalarHalfPixels(frame.data, grid, this.halfScratch),
        internal: gl.RG16F, format: gl.RG, type: gl.HALF_FLOAT, filter: gl.LINEAR });
    } else {
      // the background decoder already packed (value, validity); free it once on the GPU
      const pixels = isWind
        ? (frame.data || frame.rgba)
        : frame.packed || packScalarTexturePixels(
          frame.data || frame.rgba,
          grid?.nodata,
          frame.channels || (frame.data ? 1 : 4),
        );
      t = texture(gl, {
        width: frame.w, height: frame.h, data: pixels,
        internal: isWind ? gl.RGBA8 : gl.RG8, format: isWind ? gl.RGBA : gl.RG,
        filter: gl.LINEAR,
      });
    }
    frame.packed = null;
    this.textures.set(key, t); return t;
  }
  frames() {
    const s = this.store, kind = DECODE[this.layer].grid;
    if (kind === 'depth') { const f = s.depth; return f ? [f, f, 0] : null; }
    const br = s.bracket(this.t), last = s.hours.length - 1;
    const pa = s.loaded(s.framePath(kind, br.ia)), pb = s.loaded(s.framePath(kind, br.ib));
    s.prefetch(this.t, [kind]);
    // Promises settle asynchronously; read their values through a side cache.
    const A = pa && this.resolved(pa), B = pb && this.resolved(pb);
    // never borrow another layer's frames: each kind falls back to its own last pair
    if (!A || !B) return this.lastBy[kind] || null;
    // the neighboring hours, for smooth motion (none at the ends of the run)
    const pp = br.ia > 0 && br.ib > br.ia ? s.loaded(s.framePath(kind, br.ia - 1)) : null;
    const pn = br.ib < last && br.ib > br.ia ? s.loaded(s.framePath(kind, br.ib + 1)) : null;
    const P = pp && this.resolved(pp), N = pn && this.resolved(pn);
    const prev = this.lastBy[kind];
    this.lastBy[kind] = [A, B, br.mix, P || null, N || null];
    if (this.held.size && (!prev || prev[0] !== A || prev[1] !== B || prev[3] !== this.lastBy[kind][3] || prev[4] !== this.lastBy[kind][4])) this.releaseHeld();
    return this.lastBy[kind];
  }
  /**
   * Uploads one upcoming hour per frame before it is needed, so crossing into a
   * new forecast hour never waits on a large texture upload.
   */
  prerender() {
    if (this.hidden || !this.map) return;
    const kind = DECODE[this.layer].grid; if (kind === 'depth') return;
    const s = this.store, { ia } = s.bracket(this.t), grid = s.manifest.grids[kind], last = s.hours.length - 1;
    this.trim(ia);
    for (let k = -1; k <= GPU_AHEAD - 1; k++) {
      const i = ia + k; if (i < 0 || i > last) continue;
      const p = s.loaded(s.framePath(kind, i));
      if (p && p.__v && !this.textures.has(p.__v.path)) { this.tex(p.__v, grid); this.map.triggerRepaint(); return; }
    }
  }
  /**
   * Keeps GPU memory flat during long or fast playback: textures more than a
   * couple of hours from the playhead are released (their decoded pixels stay
   * on the CPU and re-upload if the playhead comes back).
   */
  trim(ia) {
    if (!this.hourOf) {
      this.hourOf = new Map();
      this.store.manifest.frames.forEach((f, i) => ['temp', 'wind', 'waves'].forEach((k) => f[k] && this.hourOf.set(f[k], i)));
    }
    for (const [path, tex] of this.textures) {
      const i = this.hourOf.get(path);
      if (i === undefined || (i >= ia - GPU_BEHIND && i <= ia + GPU_AHEAD) || this.onScreen(path)) continue;
      this.gl.deleteTexture(tex); this.textures.delete(path); this.held.delete(path);
    }
  }
  resolved(p) { return p.__v || onFrameReady(p, this.repaint); }
  render(gl, options) {
    if (this.hidden) return;
    const fr = this.frames(); if (!fr) return;
    const s = this.store, dec = DECODE[this.layer], grid = s.manifest.grids[dec.grid], pal = PALETTES[dec.grid === 'temp' ? 'temp' : dec.grid];
    const P = this.prog; gl.useProgram(P.p);
    gl.uniformMatrix4fv(P.u.u_matrix, false, new Float32Array(options.defaultProjectionData.mainMatrix));
    bindTex(gl, 0, this.tex(fr[0], grid), P.u.u_a); bindTex(gl, 1, this.tex(fr[1], grid), P.u.u_b); bindTex(gl, 2, this.palettes[dec.grid], P.u.u_pal);
    const cubic = !!(fr[3] && fr[4]);
    // texture units 3/4 always hold something valid; they are read only when u_cubic is 1
    bindTex(gl, 3, cubic ? this.tex(fr[3], grid) : this.tex(fr[0], grid), P.u.u_p);
    bindTex(gl, 4, cubic ? this.tex(fr[4], grid) : this.tex(fr[1], grid), P.u.u_n);
    gl.uniform1f(P.u.u_cubic, cubic ? 1 : 0);
    gl.uniform2f(P.u.u_lin, grid.encoding === 'rgb16' ? 1 : 255 / grid.scale, grid.encoding === 'rgb16' ? halfCenter(grid) : grid.offset);
    // the grid's own box (wind covers a wider area; a last column need not land on the domain edge)
    const d = gridBox({ ...grid, width: fr[0].w, height: fr[0].h }, s.manifest.domain);
    gl.uniform4f(P.u.u_dom, d.west, d.east, d.south, d.north);
    gl.uniform2f(P.u.u_size, fr[0].w, fr[0].h);
    gl.uniform1f(P.u.u_mix, fr[2]);
    gl.uniform1i(P.u.u_mode, dec.mode);
    gl.uniform3f(P.u.u_dec, grid.scale, grid.offset, grid.nodata ?? 999);
    gl.uniform2f(P.u.u_range, pal.min, pal.max);
    const bs = this.band;
    gl.uniform1f(P.u.u_banded, bs ? 1 : 0);
    gl.uniform2f(P.u.u_conv, bs ? bs.a : 1, bs ? bs.b : 0); gl.uniform1f(P.u.u_band, bs ? bs.width : 1);
    gl.uniform1f(P.u.u_lines, this.lines ? 1 : 0);
    gl.uniform1f(P.u.u_species, this.species ? 1 : 0);
    gl.uniform2f(P.u.u_sp, this.species ? this.species.lo : 0, this.species ? this.species.hi : 0);
    gl.uniform1f(P.u.u_relief, 0.012 * Math.pow(2, 7 - this.map.getZoom()));
    gl.uniform1f(P.u.u_opacity, this.opacity);
    gl.uniform1f(P.u.u_strict_mask, this.strictMask ? 1 : 0);
    bindAttr(gl, this.quad, P.a.a_pos, 2);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  onRemove(_map, gl) {
    this.stopLoad?.(); this.stopEvict?.();
    for (const tex of this.textures.values()) gl.deleteTexture(tex);
    for (const tex of Object.values(this.palettes)) gl.deleteTexture(tex);
    this.textures.clear(); this.palettes = {};
    if (this.quad) gl.deleteBuffer(this.quad);
    if (this.prog?.p) gl.deleteProgram(this.prog.p);
  }
}
