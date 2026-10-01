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
import { PALETTES, paletteBytes } from './scales.js';
import { gridBox, packScalarTexturePixels } from './frames.js';

const VS = `#version 300 es
in vec2 a_pos;
uniform mat4 u_matrix;
out vec2 v_merc;
void main() { v_merc = a_pos; gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0); }`;

const FS = `#version 300 es
precision highp float;
in vec2 v_merc;
out vec4 outColor;
uniform sampler2D u_a, u_b, u_pal;
uniform float u_mix;
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
const float PI = 3.141592653589793;

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
  vec2 sample = bicubic(t, uv).rg;
  return sample.g > 0.000001 ? vec2(sample.r / sample.g * 255.0, sample.g) : vec2(0.0);
}
vec3 pal(float v) { return texture(u_pal, vec2(clamp((v - u_range.x) / (u_range.y - u_range.x), 0.0, 1.0) * (255.0 / 256.0) + 0.5 / 256.0, 0.5)).rgb; }

void main() {
  vec2 uv = gridUV(v_merc);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) discard;
  float value;
  if (u_mode == 3) {
    vec2 w = (mix(bicubic(u_a, uv).rg, bicubic(u_b, uv).rg, u_mix) * 255.0 - u_dec.y) / u_dec.x;
    value = length(w);
  } else {
    vec2 a = validScalar(u_a, uv), b = validScalar(u_b, uv);
    bool av = a.y > 0.000001, bv = b.y > 0.000001;
    if (!av && !bv) discard;
    float raw = av && bv ? mix(a.x, b.x, u_mix) : av ? a.x : b.x;
    value = raw / u_dec.x + u_dec.y;
  }
  vec3 color;
  if (u_banded > 0.5) {
    float disp = value * u_conv.x + u_conv.y;
    float q = disp / u_band, band = floor(q);
    float midNative = ((band + 0.5) * u_band - u_conv.y) / u_conv.x;
    color = pal(midNative) * (mod(band, 2.0) > 0.5 ? 0.96 : 1.015);
    if (u_lines > 0.5) {
      float d = abs(fract(q + 0.5) - 0.5), w = fwidth(q);
      float line = 1.0 - smoothstep(0.35 * w, 1.25 * w, d);
      color = mix(color, vec3(0.03, 0.08, 0.13), line * 0.26);
    }
  } else {
    color = pal(value);
    if (u_mode == 2) {
      vec2 g = vec2(dFdx(value), dFdy(value));
      color *= clamp(1.0 - (g.x + g.y) * u_relief, 0.72, 1.28);
      float q = value / 50.0, d = abs(fract(q + 0.5) - 0.5), w = fwidth(q);
      color = mix(color, vec3(1.0), (1.0 - smoothstep(0.35 * w, 1.25 * w, d)) * 0.28 * step(w, 0.5));
    }
  }
  if (u_species > 0.5) {
    float inR = step(u_sp.x, value) * step(value, u_sp.y);
    vec3 grey = vec3(dot(color, vec3(0.299, 0.587, 0.114)));
    color = mix(mix(grey, color, 0.3) * 0.42, color * 1.08, inR);
    float w = fwidth(value), dl = min(abs(value - u_sp.x), abs(value - u_sp.y));
    color = mix(color, vec3(1.0), (1.0 - smoothstep(0.6 * w, 2.0 * w, dl)) * 0.9);
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
  constructor(store) {
    this.id = 'lake-field'; this.type = 'custom'; this.renderingMode = '2d';
    this.store = store; this.layer = 'temp'; this.t = 0; this.units = { temp: 'F', wind: 'mph', length: 'ft' }; this.lines = true; this.band = null; this.species = null; this.opacity = 1;
    this.textures = new Map(); this.palettes = {};
  }
  onAdd(map, gl) {
    this.map = map; this.gl = gl;
    this.prog = compile(gl, VS, FS);
    const d = this.store.manifest.domain;
    const x0 = mercX(d.west), x1 = mercX(d.east), y0 = mercY(d.north), y1 = mercY(d.south);
    this.quad = buffer(gl, new Float32Array([x0, y0, x1, y0, x0, y1, x1, y1]));
    for (const name of Object.keys(PALETTES)) this.palettes[name] = texture(gl, { width: 256, height: 1, data: paletteBytes(name) });
    this.store.onLoad(() => map.triggerRepaint());
    this.stopEvict = this.store.onEvict((path) => {
      const tex = this.textures.get(path);
      if (tex) { gl.deleteTexture(tex); this.textures.delete(path); }
      if (this.last?.some((frame) => frame?.path === path)) this.last = null;
    });
  }
  set(opts) { Object.assign(this, opts); this.map && this.map.triggerRepaint(); }
  tex(frame, nodata) {
    const key = frame.path; if (this.textures.has(key)) return this.textures.get(key);
    const gl = this.gl, isWind = key.startsWith('wind');
    const pixels = isWind
      ? (frame.data || frame.rgba)
      : packScalarTexturePixels(
        frame.data || frame.rgba,
        nodata,
        frame.channels || (frame.data ? 1 : 4),
      );
    const t = texture(gl, {
      width: frame.w, height: frame.h, data: pixels,
      internal: isWind ? gl.RGBA8 : gl.RG8, format: isWind ? gl.RGBA : gl.RG,
      filter: gl.LINEAR,
    });
    this.textures.set(key, t); return t;
  }
  frames() {
    const s = this.store, kind = DECODE[this.layer].grid;
    if (kind === 'depth') { const f = s.depth; return f ? [f, f, 0] : null; }
    const br = s.bracket(this.t);
    const pa = s.loaded(s.framePath(kind, br.ia)), pb = s.loaded(s.framePath(kind, br.ib));
    s.prefetch(this.t, [kind]);
    if (!pa || !pb) return this.last || null;
    // Promises settle asynchronously; read their values through a side cache.
    const A = this.resolved(pa), B = this.resolved(pb);
    if (!A || !B) return this.last || null;
    this.last = [A, B, br.mix];
    return this.last;
  }
  resolved(p) { if (!p.__v) p.then((v) => { p.__v = v; this.map.triggerRepaint(); }); return p.__v; }
  render(gl, options) {
    if (this.hidden) return;
    const fr = this.frames(); if (!fr) return;
    const s = this.store, dec = DECODE[this.layer], grid = s.manifest.grids[dec.grid], pal = PALETTES[dec.grid === 'temp' ? 'temp' : dec.grid];
    const P = this.prog; gl.useProgram(P.p);
    gl.uniformMatrix4fv(P.u.u_matrix, false, new Float32Array(options.defaultProjectionData.mainMatrix));
    bindTex(gl, 0, this.tex(fr[0], grid.nodata), P.u.u_a); bindTex(gl, 1, this.tex(fr[1], grid.nodata), P.u.u_b); bindTex(gl, 2, this.palettes[dec.grid], P.u.u_pal);
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
    bindAttr(gl, this.quad, P.a.a_pos, 2);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  onRemove(_map, gl) {
    this.stopEvict?.();
    for (const tex of this.textures.values()) gl.deleteTexture(tex);
    for (const tex of Object.values(this.palettes)) gl.deleteTexture(tex);
    this.textures.clear(); this.palettes = {};
    if (this.quad) gl.deleteBuffer(this.quad);
    if (this.prog?.p) gl.deleteProgram(this.prog.p);
  }
}
