/**
 * Wind streaks for the Live Lake Map (MapLibre custom layer).
 *
 * Particles live in viewport space (so density is the same at every zoom),
 * are advected on the GPU through the wind field blended between the two
 * frames around the current time, and leave fading trails. Trails reset while
 * the map is moving, like other wind maps do.
 */
import { compile, texture, buffer, bindAttr, bindTex, mercX, mercY } from './gl.js';
import { gridBox } from './frames.js';

const QUAD_VS = `#version 300 es
in vec2 a_pos; out vec2 v_uv;
void main() { v_uv = a_pos; gl_Position = vec4(a_pos * 2.0 - 1.0, 0.0, 1.0); }`;

/* Particle state: RGBA8, x in RG (16-bit), y in BA (16-bit), both 0..1 of the viewport. */
const UPDATE_FS = `#version 300 es
precision highp float;
in vec2 v_uv; out vec4 outColor;
uniform sampler2D u_state, u_windA, u_windB;
uniform float u_mix, u_seed, u_drop, u_speed;
uniform vec4 u_view;    // mercator minX, minY, maxX, maxY of the viewport
uniform vec4 u_dom;     // west, east, south, north
uniform vec2 u_wsize, u_vpx;
const float PI = 3.141592653589793;
float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
vec2 decode(vec4 c) { return vec2(c.r / 255.0 + c.g, c.b / 255.0 + c.a); }
vec4 encode(vec2 p) { vec2 f = fract(p * 255.0); vec2 hi = p - f / 255.0; return vec4(f.x, hi.x, f.y, hi.y); }
vec2 wind(vec2 pos, out bool inside) {
  vec2 merc = mix(u_view.xy, u_view.zw, pos);
  float lon = merc.x * 360.0 - 180.0, lat = degrees(atan(sinh(PI * (1.0 - 2.0 * merc.y))));
  vec2 g = vec2((lon - u_dom.x) / (u_dom.y - u_dom.x), (u_dom.w - lat) / (u_dom.w - u_dom.z));
  inside = g.x >= 0.0 && g.y >= 0.0 && g.x <= 1.0 && g.y <= 1.0;
  vec2 uv = (g * (u_wsize - 1.0) + 0.5) / u_wsize;
  vec2 a = texture(u_windA, uv).rg * 255.0, b = texture(u_windB, uv).rg * 255.0;
  return (mix(a, b, u_mix) - 128.0) / 2.0;   // mph toward east, north
}
void main() {
  vec2 pos = decode(texture(u_state, v_uv));
  bool inside; vec2 w = wind(pos, inside);
  float sp = length(w);
  vec2 step = vec2(w.x, -w.y) * u_speed / u_vpx;
  vec2 np = fract(pos + step + 1.0);
  vec2 seed = (pos + v_uv) * u_seed;
  float drop = u_drop + sp * 0.00035;
  if (!inside || rand(seed) < drop || any(greaterThan(abs(pos + step - np), vec2(0.5)))) np = vec2(rand(seed + 1.3), rand(seed + 2.1));
  outColor = encode(np);
}`;

const DRAW_VS = `#version 300 es
precision highp float;
in float a_index;
uniform sampler2D u_prev, u_next, u_windA, u_windB;
uniform float u_res, u_mix;
uniform vec4 u_view, u_dom; uniform vec2 u_wsize;
out float v_alpha;
const float PI = 3.141592653589793;
vec2 decode(vec4 c) { return vec2(c.r / 255.0 + c.g, c.b / 255.0 + c.a); }
void main() {
  float id = floor(a_index / 2.0), end = mod(a_index, 2.0);
  vec2 tc = (vec2(mod(id, u_res), floor(id / u_res)) + 0.5) / u_res;
  vec2 p0 = decode(texture(u_prev, tc)), p1 = decode(texture(u_next, tc));
  vec2 p = end < 0.5 ? p0 : p1;
  vec2 merc = mix(u_view.xy, u_view.zw, p0);
  float lon = merc.x * 360.0 - 180.0, lat = degrees(atan(sinh(PI * (1.0 - 2.0 * merc.y))));
  vec2 g = vec2((lon - u_dom.x) / (u_dom.y - u_dom.x), (u_dom.w - lat) / (u_dom.w - u_dom.z));
  vec2 uv = (g * (u_wsize - 1.0) + 0.5) / u_wsize;
  vec2 w = (mix(texture(u_windA, uv).rg, texture(u_windB, uv).rg, u_mix) * 255.0 - 128.0) / 2.0;
  float sp = length(w);
  v_alpha = distance(p0, p1) > 0.05 ? 0.0 : clamp(0.3 + sp / 30.0, 0.3, 0.95);
  gl_Position = vec4(p.x * 2.0 - 1.0, 1.0 - p.y * 2.0, 0.0, 1.0);
}`;
const DRAW_FS = `#version 300 es
precision mediump float;
in float v_alpha; out vec4 outColor; uniform float u_brightness;
void main() { float a = v_alpha * u_brightness; outColor = vec4(a, a, a, a); }`;
const FADE_FS = `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 outColor; uniform sampler2D u_tex; uniform float u_fade;
void main() { outColor = texture(u_tex, v_uv) * u_fade; }`;
const COMPOSE_FS = `#version 300 es
precision mediump float;
in vec2 v_uv; out vec4 outColor; uniform sampler2D u_tex; uniform float u_opacity;
void main() { outColor = texture(u_tex, v_uv) * u_opacity; }`;

export class ParticleLayer {
  constructor(store) {
    this.id = 'lake-particles'; this.type = 'custom'; this.renderingMode = '2d';
    this.store = store; this.t = 0; this.visible = true; this.brightness = 0.55; this.moving = false;
    this.res = 64; this.windTex = new Map();
  }
  onAdd(map, gl) {
    this.map = map; this.gl = gl;
    this.pUpdate = compile(gl, QUAD_VS, UPDATE_FS);
    this.pDraw = compile(gl, DRAW_VS, DRAW_FS);
    this.pFade = compile(gl, QUAD_VS, FADE_FS);
    this.pCompose = compile(gl, QUAD_VS, COMPOSE_FS);
    this.quad = buffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]));
    this.setCount(this.res);
    this.fb = gl.createFramebuffer();
    const clear = () => { this.moving = true; this.clearTrails = true; map.triggerRepaint(); };
    map.on('movestart', clear); map.on('move', clear);
    map.on('moveend', () => { this.moving = false; this.clearTrails = true; map.triggerRepaint(); });
    this.stopEvict = this.store.onEvict((path) => {
      const tex = this.windTex.get(path);
      if (tex) { gl.deleteTexture(tex); this.windTex.delete(path); }
      if (this.last?.some((frame) => frame?.path === path)) this.last = null;
    });
    this.lastTime = performance.now();
  }
  setCount(res) {
    const gl = this.gl; this.res = res;
    const n = res * res, init = new Uint8Array(n * 4);
    for (let i = 0; i < init.length; i++) init[i] = Math.floor(Math.random() * 256);
    this.state0 = texture(gl, { width: res, height: res, data: init, filter: gl.NEAREST });
    this.state1 = texture(gl, { width: res, height: res, data: init, filter: gl.NEAREST });
    const idx = new Float32Array(n * 2); for (let i = 0; i < n * 2; i++) idx[i] = i;
    this.indexBuf = buffer(gl, idx);
  }
  set(opts) { Object.assign(this, opts); this.map && this.map.triggerRepaint(); }
  ensureScreen(gl, w, h) {
    if (this.sw === w && this.sh === h) return;
    this.sw = w; this.sh = h;
    const empty = new Uint8Array(w * h * 4);
    this.screen0 = texture(gl, { width: w, height: h, data: empty, filter: gl.NEAREST });
    this.screen1 = texture(gl, { width: w, height: h, data: empty, filter: gl.NEAREST });
  }
  wind(frame) {
    if (!this.windTex.has(frame.path)) this.windTex.set(frame.path, texture(this.gl, {
      width: frame.w, height: frame.h, data: frame.data || frame.rgba, filter: this.gl.LINEAR,
    }));
    return this.windTex.get(frame.path);
  }
  frames() {
    const s = this.store, br = s.bracket(this.t);
    const pa = s.loaded(s.framePath('wind', br.ia)), pb = s.loaded(s.framePath('wind', br.ib));
    s.prefetch(this.t, ['wind']);
    const A = pa && (pa.__v || (pa.then((v) => { pa.__v = v; }), null)), B = pb && (pb.__v || (pb.then((v) => { pb.__v = v; }), null));
    if (A && B) this.last = [A, B, br.mix];
    return this.last;
  }
  viewRect() {
    const b = this.map.getBounds(), sw = b.getSouthWest(), ne = b.getNorthEast();
    return [mercX(sw.lng), mercY(ne.lat), mercX(ne.lng), mercY(sw.lat)];
  }
  prerender(gl) {
    if (!this.visible) return;
    const fr = this.frames(); if (!fr) return;
    const prevFb = gl.getParameter(gl.FRAMEBUFFER_BINDING), vp = gl.getParameter(gl.VIEWPORT);
    const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight; this.ensureScreen(gl, W, H);
    const now = performance.now(), dt = Math.min(0.05, (now - this.lastTime) / 1000); this.lastTime = now;
    const view = this.viewRect(), wg = this.store.manifest.grids.wind, d = gridBox(wg, this.store.manifest.domain);
    const tA = this.wind(fr[0]), tB = this.wind(fr[1]);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.STENCIL_TEST); gl.disable(gl.CULL_FACE);
    /* 1. advect particles into state1 */
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.state1, 0);
    gl.viewport(0, 0, this.res, this.res); gl.disable(gl.BLEND);
    let P = this.pUpdate; gl.useProgram(P.p); bindAttr(gl, this.quad, P.a.a_pos, 2);
    bindTex(gl, 0, this.state0, P.u.u_state); bindTex(gl, 1, tA, P.u.u_windA); bindTex(gl, 2, tB, P.u.u_windB);
    gl.uniform1f(P.u.u_mix, fr[2]); gl.uniform1f(P.u.u_seed, Math.random() + 0.1);
    gl.uniform1f(P.u.u_drop, 0.004); gl.uniform1f(P.u.u_speed, (this.moving ? 0 : 1) * dt * 60 * 0.075 * Math.pow(1.35, Math.min(this.map.getZoom(), 8.5) - 6) * window.devicePixelRatio);
    gl.uniform4f(P.u.u_view, view[0], view[1], view[2], view[3]); gl.uniform4f(P.u.u_dom, d.west, d.east, d.south, d.north);
    gl.uniform2f(P.u.u_wsize, wg.width, wg.height); gl.uniform2f(P.u.u_vpx, W, H);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    /* 2. fade previous trails into screen1, then draw the new segments */
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.screen1, 0);
    gl.viewport(0, 0, W, H);
    if (this.clearTrails || this.moving) { gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); this.clearTrails = false; }
    else {
      P = this.pFade; gl.useProgram(P.p); bindAttr(gl, this.quad, P.a.a_pos, 2);
      bindTex(gl, 0, this.screen0, P.u.u_tex); gl.uniform1f(P.u.u_fade, 0.93);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    if (!this.moving) {
      P = this.pDraw; gl.useProgram(P.p); bindAttr(gl, this.indexBuf, P.a.a_index, 1);
      bindTex(gl, 0, this.state0, P.u.u_prev); bindTex(gl, 1, this.state1, P.u.u_next); bindTex(gl, 2, tA, P.u.u_windA); bindTex(gl, 3, tB, P.u.u_windB);
      gl.uniform1f(P.u.u_res, this.res); gl.uniform1f(P.u.u_mix, fr[2]); gl.uniform1f(P.u.u_brightness, this.brightness);
      gl.uniform4f(P.u.u_view, view[0], view[1], view[2], view[3]); gl.uniform4f(P.u.u_dom, d.west, d.east, d.south, d.north); gl.uniform2f(P.u.u_wsize, wg.width, wg.height);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.LINES, 0, this.res * this.res * 2);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFb); gl.viewport(vp[0], vp[1], vp[2], vp[3]);
    [this.state0, this.state1] = [this.state1, this.state0];
    [this.screen0, this.screen1] = [this.screen1, this.screen0];
  }
  render(gl) {
    if (!this.visible || !this.screen0) return;
    const P = this.pCompose; gl.useProgram(P.p); bindAttr(gl, this.quad, P.a.a_pos, 2);
    bindTex(gl, 0, this.screen0, P.u.u_tex); gl.uniform1f(P.u.u_opacity, 1);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    this.map.triggerRepaint(); // continuous animation
  }
}
