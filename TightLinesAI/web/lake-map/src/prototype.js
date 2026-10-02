/**
 * Page shell around the Live Lake Map engine: timeline, layers, pier card,
 * alerts and search. The same page runs in two places:
 *   - a phone browser (…/proto/index.html), for testing
 *   - the FinFindr app (…/map/index.html), inside a web view. There the app
 *     injects window.PC_APP (units, species, city to open) before the page
 *     loads, and the page talks back through window.ReactNativeWebView
 *     (see lib/pierCastLiveMap.ts in the app for the message list).
 */
import { createLakeMap } from './engine/index.js';
import { fmtWind, fmtWaves, compass, toTemp, PALETTES, colorAt, bandSpec, SPECIES, speciesFit } from './engine/scales.js';
import { fetchNwsAlerts, alertShapes, activeAt } from './engine/nws.js';
import { DEFAULT_MAP_LAYER, resolveInitialMapLayer } from './engine/preferences.js';
import { currentForecastHour, hasNewPublishedRun, mapFreshnessText, MODEL_REFRESH_CHECK_MS, OBSERVATION_REFRESH_MS, RUN_CHECK_MS } from './engine/freshness.js';
import cities from './cities.json';

window.maplibregl.setWorkerUrl(new URL('maplibre-gl-csp-worker.js', location.href).href);
const CITIES = cities;
const HURON = new Set(['harbor_beach_mi', 'oscoda_mi', 'port_sanilac_mi', 'alpena_mi', 'lexington_mi', 'harrisville_mi', 'rogers_city_mi', 'tawas_city_mi', 'caseville_mi']);
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let T0 = Date.now();  // time of forecast hour 0 (set from the manifest)
const $ = (s) => document.querySelector(s);
const clock = (h) => { const x = h % 12 === 0 ? 12 : h % 12; return `${x} ${h < 12 ? 'AM' : 'PM'}`; };
const at = (t) => new Date(T0 + t * 3600e3);
const dayKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const dayName = (d) => (dayKey(d) === dayKey(new Date()) ? 'Today' : DAY[d.getDay()]);
const when = (t) => { const d = at(Math.round(t)); return `${dayName(d)} ${clock(d.getHours())}`; };
const range = (a, b) => { const da = at(Math.round(a)), db = at(Math.round(b)); return `${when(a)} – ${dayKey(da) === dayKey(db) ? clock(db.getHours()) : when(b)}`; };

const degs = (f) => `${Math.round(ui.units.temp === 'C' ? (f - 32) * 5 / 9 : f)}°`;
const deltaDeg = (f) => `${Math.round(ui.units.temp === 'C' ? f * 5 / 9 : f)}°${ui.units.temp}`;
const SPEEDS = [0.5, 1, 1.5, 2];
const ui = { species: SPECIES[1], layer: DEFAULT_MAP_LAYER, t: 0, playing: false, speed: 1, units: { temp: 'F', wind: 'mph', length: 'ft' }, lines: true, streaks: true, buoys: true, nws: true, selected: null, selectedBuoy: null, alertHidden: false, paused: false };
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ── app bridge ── */
const QS = new URLSearchParams(location.search);
const APP = window.PC_APP || (QS.get('app') === '1' ? {} : null);
const post = (msg) => { try { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg)); } catch (e) { /* not in the app */ } };
const track_ = (event, props = {}) => post({ type: 'analytics', event, props });
const haptic = () => post({ type: 'haptic' });
const PREFS_KEY = 'pc-lake-map-prefs-v1';
const UNIT_OPTIONS = { temp: ['F', 'C'], wind: ['mph', 'kph', 'kt'], length: ['ft', 'm'] };
function loadPrefs() { try { return JSON.parse(localStorage.getItem(PREFS_KEY) || 'null'); } catch (e) { return null; } }
function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify({ units: ui.units, layer: ui.layer, species: ui.species.id, streaks: ui.streaks, lines: ui.lines, buoys: ui.buoys, nws: ui.nws, speed: ui.speed })); } catch (e) { /* storage off */ } }
(function initialPrefs() {
  const saved = loadPrefs();
  if (saved) {
    for (const k of Object.keys(UNIT_OPTIONS)) if (saved.units && UNIT_OPTIONS[k].includes(saved.units[k])) ui.units[k] = saved.units[k];
    ui.layer = resolveInitialMapLayer(saved.layer);
    if (typeof saved.streaks === 'boolean') ui.streaks = saved.streaks;
    if (typeof saved.lines === 'boolean') ui.lines = saved.lines;
    if (typeof saved.buoys === 'boolean') ui.buoys = saved.buoys;
    if (typeof saved.nws === 'boolean') ui.nws = saved.nws;
    if (SPEEDS.includes(saved.speed)) ui.speed = saved.speed;
    const sp = SPECIES.find((x) => x.id === saved.species); if (sp) ui.species = sp;
  } else if (APP && APP.units === 'metric') ui.units = { temp: 'C', wind: 'kph', length: 'm' };
  // Keep the routed species ready for Match, but never override the first-visit
  // Temperature default or the layer the user last left selected.
  const routed = APP && SPECIES.find((x) => x.id === APP.species);
  if (routed) ui.species = routed;
})();

(async () => {
  const piers = CITIES.map((c) => ({ id: c[0], name: c[1], st: c[2], lat: c[3], lon: c[4], structure: c[5], lake: HURON.has(c[0]) ? 'Lake Huron' : 'Lake Michigan', nameSide: HURON.has(c[0]) || c[2] === 'WI' || c[2] === 'IL' ? 'left' : 'right' }));
  piers.forEach((p) => { if (HURON.has(p.id)) p.nameSide = 'left'; if (p.st === 'MI' && !HURON.has(p.id)) p.nameSide = 'right'; if (p.st === 'WI' || p.st === 'IL') p.nameSide = 'left'; });
  // Where the map data lives: ?data= / ?static= / ?basemap=1, or, when this page is served
  // from the storage bucket itself (…/proto/), the newest published run.
  // the pass in the link has become a cookie at the gatekeeper; keep it out of the address
  if (QS.has('t')) { try { history.replaceState(null, '', location.pathname + (APP ? '?app=1' : '')); } catch (e) { /* ignore */ } }
  // the app hands over a fresh pass before the old one runs out
  window.PC_RENEW = (pass) => fetch('/_pass?t=' + encodeURIComponent(pass), { credentials: 'same-origin', cache: 'no-store' }).catch(() => {});
  if (APP) {
    document.documentElement.dataset.app = '1';
    $('#back').hidden = false; $('#back-spacer').hidden = true; $('#ttl-k').textContent = APP.trial ? `FREE VISIT ${APP.trial.used} OF ${APP.trial.allowed}` : 'PIERCAST · GREAT LAKES';
    $('#back').addEventListener('click', () => post({ type: 'back' }));
    $('#p-report').hidden = false;
  }
  const q = QS;
  // A newer forecast was applied by reloading the page: pick up where the viewer was.
  const RESUME_KEY = 'pc-lake-map-resume-v1';
  const resume = (() => {
    try {
      const r = JSON.parse(sessionStorage.getItem(RESUME_KEY) || 'null'); sessionStorage.removeItem(RESUME_KEY);
      return r && Date.now() - r.at < 15 * 60e3 && Array.isArray(r.center) ? r : null;
    } catch (e) { return null; }
  })();
  let activeRun = null;
  let dataUrl = q.get('data') || 'data/', staticUrl = q.get('static'), basemap = q.get('basemap') === '1';
  if (!q.get('data')) {
    try {
      const latest = await fetch('../latest.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null));
      if (latest && latest.base) { activeRun = typeof latest.run === 'string' ? latest.run : null; dataUrl = '../' + latest.base; staticUrl = staticUrl || '../static/'; basemap = q.get('basemap') !== '0'; }
    } catch (e) { /* no bucket next to this page: use bundled data */ }
  }
  const lm = await createLakeMap($('#map'), {
    dataUrl, staticUrl, basemap, piers, smoothTemperature: q.get('smooth') !== '0', ...(resume ? { center: resume.center, zoom: resume.zoom } : {}),
    // screen areas covered by controls; labels and markers stay clear of them
    reserved: () => {
      const out = [[0, 0, 9999, 64]];
      for (const sel of ['#readout', '#alert', '#layers', '#fit', '#alerts-tool', '#cross', '#pier', '#update', '.card']) {
        const el = document.querySelector(sel); if (!el || el.hidden) continue;
        const r = el.getBoundingClientRect(); if (r.width) out.push([r.left - 4, r.top - 4, r.right + 4, r.bottom + 4]);
      }
      return out;
    },
  });
  window.__lm = lm;
  // the app pauses the map while another screen covers it (saves battery)
  window.PC_PAUSE = (paused) => {
    ui.paused = !!paused; if (paused) stop(); lm.setPaused(!!paused);
    // covered by another screen: the perfect moment to switch to a newer forecast unseen
    if (paused && window.__pcApplyUpdate) window.__pcApplyUpdate(true);
    // back after a while: the alerts and buoys may have changed
    if (!paused && window.__pcRefreshFeeds) window.__pcRefreshFeeds();
  };
  $('#attrib-list').innerHTML = lm.attribution;
  T0 = lm.store.t0;
  // sample data plays from hour 0; real runs open on the current hour
  const tMs = () => T0 + ui.t * 3600e3; // the timeline's moment, as a clock time
  const nowHour = () => currentForecastHour(T0, lm.store.maxHour, Date.now(), lm.store.manifest.sample);
  $('#loading').remove();
  lm.setPiers(piers);
  const events = lm.store.events.map((e) => ({ ...e, pier: piers.find((p) => p.id === e.cityId) })).filter((e) => e.pier);
  const maxHour = lm.store.maxHour;

  /* ── readout ── */
  function readout() {
    const c = lm.unproject(innerWidth / 2, innerHeight / 2), s = lm.sampleAt(c[0], c[1]), u = ui.units;
    const windTxt = `${compass(s.windFrom)} ${fmtWind(s.wind, u.wind)} ${u.wind === 'kph' ? 'km/h' : u.wind}`, waveTxt = `Waves ${fmtWaves(s.waves, u.length)} ${u.length}`;
    const tU = u.temp === 'C' ? '°C' : '°F', water = `${toTemp(s.temp, u.temp).toFixed(1)}${tU}`;
    let val, unit, sub;
    if (s.harbor) { val = `${compass(s.windFrom)} ${fmtWind(s.wind, u.wind)}`; unit = u.wind === 'kph' ? 'km/h' : u.wind; sub = `Harbor water · no lake model · lake outside ${water}`; }
    else if (!s.onWater) { val = `${compass(s.windFrom)} ${fmtWind(s.wind, u.wind)}`; unit = u.wind === 'kph' ? 'km/h' : u.wind; sub = 'Over land · pan onto the water'; }
    else if (ui.layer === 'wind') { val = fmtWind(s.wind, u.wind); unit = `${u.wind === 'kph' ? 'km/h' : u.wind} ${compass(s.windFrom)}`; sub = `Water ${water} · ${waveTxt}`; }
    else if (ui.layer === 'waves') { val = fmtWaves(s.waves, u.length); unit = u.length; sub = `${windTxt} · Water ${water}`; }
    else if (ui.layer === 'depth') { val = !Number.isFinite(s.depth) ? '—' : u.length === 'm' ? Math.round(s.depth * 0.3048) : Math.round(s.depth); unit = `${u.length} deep`; sub = `Water ${water} · ${windTxt}`; }
    else if (ui.layer === 'species') {
      const f = speciesFit(s.temp, ui.species), sp = ui.species;
      val = toTemp(s.temp, u.temp).toFixed(1); unit = tU;
      sub = `${sp.name} ${Math.round(toTemp(sp.lo, u.temp))}–${degs(sp.hi)}${u.temp} · ${f.grade === 0 ? 'in range' : `${deltaDeg(f.d)} too ${f.dir}`}`;
    }
    else { val = toTemp(s.temp, u.temp).toFixed(1); unit = tU; sub = `${windTxt} · ${waveTxt}`; }
    let near = null, nd = 1e9;
    piers.forEach((p) => { const d = Math.hypot((p.lon - c[0]) * Math.cos(c[1] * Math.PI / 180), p.lat - c[1]) * 69; if (d < nd) { nd = d; near = p; } });
    $('#ro-val').textContent = val; $('#ro-unit').textContent = unit; $('#ro-sub').textContent = sub;
    $('#ro-loc').textContent = near && nd < 30 ? `${nd < 1.5 ? 'At' : Math.round(nd) + ' mi from'} ${near.name}` : 'Open water';
  }
  let roQueued = false;
  const queueReadout = () => { if (roQueued) return; roQueued = true; setTimeout(() => { roQueued = false; readout(); }, 60); };
  lm.on('view', () => { queueReadout(); if (ui.selected) queueCard(); });
  let cardQueued = false;
  const queueCard = () => { if (cardQueued) return; cardQueued = true; setTimeout(() => { cardQueued = false; pierCard(); }, 80); };

  /* ── legend ── */
  function legend() {
    const L = ui.layer === 'species' ? 'temp' : ui.layer, p = PALETTES[L], u = ui.units, bs = bandSpec(ui.layer, u);
    let grad;
    if (bs) {
      const lo = p.min * bs.a + bs.b, hi = p.max * bs.a + bs.b, stops = [];
      for (let v = Math.floor(lo / bs.width) * bs.width; v < hi - 1e-9; v += bs.width) {
        const a = Math.max(lo, v), b = Math.min(hi, v + bs.width), k = Math.round(v / bs.width);
        const midN = (v + bs.width / 2 - bs.b) / bs.a;
        let c = colorAt(L, midN).match(/\d+/g).map((x) => Math.min(255, Math.round(x * (Math.abs(k) % 2 ? 0.9 : 1.04))));
        if (ui.layer === 'species' && (midN < ui.species.lo || midN > ui.species.hi)) { const g = c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114; c = c.map((x) => Math.round((g + (x - g) * 0.3) * 0.42)); }
        stops.push(`rgb(${c}) ${((a - lo) / (hi - lo) * 100).toFixed(2)}%`, `rgb(${c}) ${((b - lo) / (hi - lo) * 100).toFixed(2)}%`);
      }
      grad = `linear-gradient(90deg,${stops.join(',')})`;
    } else grad = `linear-gradient(90deg,${p.stops.map((s) => `${s[1]} ${((s[0] - p.min) / (p.max - p.min) * 100).toFixed(1)}%`).join(',')})`;
    $('#lg-bar').style.background = grad;
    $('#lg-name').textContent = ui.layer === 'species' ? ui.species.name.toUpperCase() : { temp: 'WATER', wind: 'WIND', waves: 'WAVES', depth: 'DEPTH' }[L];
    let ticks;
    if (ui.layer === 'species') { const sp = ui.species, c = u.temp === 'C'; ticks = [[toTemp(sp.lo, u.temp), `${Math.round(toTemp(sp.lo, u.temp))}`], [toTemp(sp.hi, u.temp), `${Math.round(toTemp(sp.hi, u.temp))}${c ? '°C' : '°F'}`]]; }
    else if (L === 'temp') ticks = u.temp === 'C' ? [[5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25°C']] : [[40, '40'], [50, '50'], [60, '60'], [70, '70°F']];
    else if (L === 'wind') ticks = u.wind === 'kph' ? [[0, '0'], [20, '20'], [40, '40'], [60, '60'], [80, '80 km/h']] : u.wind === 'kt' ? [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40 kt']] : [[0, '0'], [10, '10'], [20, '20'], [30, '30'], [40, '40 mph']];
    else if (L === 'waves') ticks = u.length === 'm' ? [[0, '0'], [1, '1'], [2, '2'], [3, '3 m']] : [[0, '0'], [3, '3'], [6, '6'], [9, '9'], [12, '12 ft']];
    else ticks = u.length === 'm' ? [[0, '0'], [100, '100'], [200, '200'], [300, '300'], [400, '400 m']] : [[0, '0'], [300, '300'], [600, '600'], [900, '900'], [1200, '1200 ft']];
    const toNative = (v) => L === 'temp' ? (u.temp === 'C' ? v * 9 / 5 + 32 : v) : L === 'wind' ? v / (u.wind === 'kph' ? 1.609344 : u.wind === 'kt' ? 0.868976 : 1) : v / (u.length === 'm' ? 0.3048 : 1);
    $('#lg-ticks').innerHTML = ticks.map(([v, l]) => { const f = (toNative(v) - p.min) / (p.max - p.min); return `<span style="left:${(f * 100).toFixed(1)}%;transform:translateX(${f > 0.9 ? '-100%' : f < 0.05 ? '0' : '-50%'})">${l}</span>`; }).join('');
  }

  /* ── timeline ── */
  const track = $('#track');
  function buildTrack() {
    let html = '';
    const pct = (h) => (Math.max(0, Math.min(maxHour, h)) / maxHour * 100).toFixed(2);
    // local midnights inside the forecast
    const starts = [0];
    for (let h = 1; h <= maxHour; h++) if (at(h).getHours() === 0) starts.push(h);
    starts.forEach((st, k) => {
      const en = k + 1 < starts.length ? starts[k + 1] : maxHour, d = at(st);
      if (en - st >= 10) html += `<div class="day" style="left:${pct(st)}%;width:${pct(en) - pct(st)}%">${DAY[d.getDay()].toUpperCase()}<span class="dd"> ${d.getDate()}</span></div>`;
      if (k > 0) html += `<div class="sep" style="left:${pct(st)}%"></div>`;
    });
    // night: roughly 7:30 PM to 7:40 AM local
    for (let h = 0; h <= maxHour; h++) {
      const hr = at(h).getHours();
      if (hr === 19 || (h === 0 && (hr >= 20 || hr < 8))) {
        let e = h + 1; while (e <= maxHour && (at(e).getHours() >= 20 || at(e).getHours() < 8)) e++;
        const s0 = hr === 19 ? h + 0.5 : h;
        html += `<div class="night" style="left:${pct(s0)}%;width:${pct(Math.min(maxHour, e - 0.3)) - pct(s0)}%"></div>`;
        h = e;
      }
    }
    events.forEach((e) => { html += `<div class="ev ${e.kind}" style="left:${pct(e.startHour)}%;width:${pct(e.bottomHour) - pct(e.startHour)}%"></div>`; });
    track.insertAdjacentHTML('afterbegin', html);
  }
  // Small and unusual screens: day names drop their date before they clip, and
  // the right-hand tools slide up (or step aside) instead of hiding under the
  // forecast panel or an open pier card.
  function fitLayout() {
    for (const el of track.querySelectorAll('.day')) {
      el.classList.remove('short'); el.style.visibility = '';
      if (el.scrollWidth > el.clientWidth + 1) el.classList.add('short');
      if (el.scrollWidth > el.clientWidth + 1) el.style.visibility = 'hidden';
    }
    const tools = $('.tools');
    tools.style.top = ''; tools.dataset.crowded = '';
    const box = tools.getBoundingClientRect(), floor = $('.bottom').getBoundingClientRect().top - 10;
    if (box.bottom <= floor) return;
    let ceiling = $('.top').getBoundingClientRect().bottom + 8;
    for (const sel of ['#readout', '#alert']) {
      const el = $(sel); if (!el || el.hidden) continue;
      const r = el.getBoundingClientRect(); if (r.width && r.right > box.left - 4) ceiling = Math.max(ceiling, r.bottom + 8);
    }
    const top = Math.max(ceiling, floor - box.height);
    tools.style.top = `${Math.round(top)}px`;
    if (top + box.height > floor) tools.dataset.crowded = '1';
  }
  const setText = (sel, text) => { const el = $(sel); if (el.textContent !== text) el.textContent = text; };
  function setTime(t, fromPlay) {
    ui.t = Math.max(0, Math.min(maxHour, t)); lm.setTime(ui.t);
    const d = at(ui.t);
    setText('#tl-main', `${dayName(d)} ${d.getDate()} · ${clock(d.getHours())}`);
    const ahead = ui.t - nowHour(), aheadH = Math.round(ahead);
    // round to whole hours first, so 47.6 h reads "2d 0h", never "1d 24h"
    setText('#tl-sub', Math.abs(ahead) < 0.5 ? `Now · ${mapFreshnessText(lm.store.manifest)}` : ahead < 0 ? `${-aheadH} hrs ago · NOAA model` : `In ${aheadH < 24 ? aheadH + ' hrs' : Math.floor(aheadH / 24) + 'd ' + (aheadH % 24) + 'h'} · NOAA forecast`);
    $('#now').hidden = Math.abs(ahead) < 0.5;
    lm.setBuoyOptions({ dim: Math.abs(ahead) > 1.5 }); // buoy readings are "now"; faded while looking ahead
    // Weather Service alerts appear at their start and go away when they end (checked every 15 minutes of timeline)
    const q = Math.floor(tMs() / 900e3); if (q !== ui.nwsQ) { ui.nwsQ = q; lm.setNwsTime(q * 900e3); }
    const pct = (ui.t / maxHour * 100).toFixed(2) + '%'; $('#handle').style.left = pct; $('#fill').style.width = pct;
    track.setAttribute('aria-valuenow', Math.round(ui.t)); track.setAttribute('aria-valuetext', $('#tl-main').textContent);
    // while playing, the alert banner, readout and pier card follow along a few times a
    // second instead of on every frame (alerts only change on 15-minute steps anyway)
    const quarter = Math.floor(ui.t * 4);
    if (!fromPlay || quarter !== ui.alertQ) { ui.alertQ = quarter; updateAlerts(); }
    queueReadout();
    if (ui.selected) { if (fromPlay) queueCard(); else pierCard(); }
  }
  let dragging = false;
  const tAt = (e) => { const r = track.getBoundingClientRect(); return Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * maxHour * 4) / 4; };
  const endDrag = () => { if (!dragging) return; dragging = false; lm.setAnimating(false); };
  track.addEventListener('pointerdown', (e) => { dragging = true; track.setPointerCapture(e.pointerId); stop(); lm.setAnimating(true, 0); setTime(tAt(e)); });
  track.addEventListener('pointermove', (e) => { if (dragging) setTime(tAt(e)); });
  // a cancelled touch (system gesture, incoming call) ends the drag too, or the handle would keep following the pointer
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => track.addEventListener(type, endDrag));
  track.setAttribute('aria-valuemax', String(maxHour));
  track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); stop(); setTime(Math.round(ui.t) + (e.key === 'ArrowRight' ? 1 : -1)); } });

  /*
   * Playback. The clock runs at a fixed number of forecast hours per second
   * (PLAY_RATE × the chosen speed, the same at every zoom) and the map blends
   * continuously between hourly frames. If the next hour is still downloading,
   * the clock waits on the last moment that can be drawn instead of running
   * ahead of the picture; a soft ring on the play button shows the wait.
   */
  const PLAY_RATE = 3;                  // forecast hours per second at 1×
  const STALL_SKIP_MS = 8000;           // never wait forever on one missing hour
  const rate = () => PLAY_RATE * ui.speed;
  let last = 0, stalledSince = 0;
  function frame(now) {
    if (!ui.playing) return;
    const dt = Math.min(0.1, (now - (last || now)) / 1000); last = now;
    const t = Math.min(maxHour, ui.t + dt * rate());
    if (!lm.ready(t) && !(stalledSince && now - stalledSince > STALL_SKIP_MS)) {
      if (!stalledSince) stalledSince = now;
      $('#play').dataset.buffering = now - stalledSince > 250 ? '1' : '';
      requestAnimationFrame(frame);
      return;
    }
    stalledSince = 0; $('#play').dataset.buffering = '';
    setTime(t, true);
    if (t >= maxHour) { stop(); return; }
    requestAnimationFrame(frame);
  }
  function stop() {
    if (ui.playing) lm.setAnimating(false);
    ui.playing = false; stalledSince = 0;
    $('#play').dataset.playing = ''; $('#play').dataset.buffering = ''; $('#play').setAttribute('aria-label', 'Play forecast');
  }
  $('#play').addEventListener('click', () => {
    closeSpeed();
    if (ui.playing) return stop();
    if (ui.t >= maxHour - 0.5) setTime(nowHour());
    track_('forecast_played', { layer: ui.layer, speed: ui.speed });
    ui.playing = true; last = 0; lm.setAnimating(true, rate());
    $('#play').dataset.playing = '1'; $('#play').setAttribute('aria-label', 'Pause forecast'); requestAnimationFrame(frame);
  });

  /* ── playback speed: tap "1×" to pick 0.5×, 1×, 1.5× or 2× ── */
  const speedBtn = $('#speed'), speedMenu = $('#speed-menu');
  const speedLabel = (v) => `${v}×`;
  function renderSpeed() {
    speedBtn.textContent = speedLabel(ui.speed);
    speedBtn.setAttribute('aria-label', `Playback speed ${speedLabel(ui.speed)}`);
    speedMenu.querySelectorAll('[data-speed]').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.speed) === ui.speed)));
  }
  function closeSpeed() { if (speedMenu.hidden) return; speedMenu.hidden = true; speedBtn.setAttribute('aria-expanded', 'false'); }
  speedBtn.addEventListener('click', (e) => {
    e.stopPropagation(); haptic();
    const open = speedMenu.hidden; speedMenu.hidden = !open; speedBtn.setAttribute('aria-expanded', String(open));
    if (open) speedMenu.querySelector('[aria-checked="true"]')?.focus();
  });
  speedMenu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-speed]'); if (!b) return;
    e.stopPropagation();
    ui.speed = Number(b.dataset.speed); renderSpeed(); savePrefs(); haptic(); closeSpeed();
    if (ui.playing) lm.setAnimating(true, rate()); // decode far enough ahead for the new pace
    speedBtn.focus();
  });
  document.addEventListener('pointerdown', (e) => { if (!speedMenu.hidden && !e.target.closest('#speed, #speed-menu')) closeSpeed(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !speedMenu.hidden) { closeSpeed(); speedBtn.focus(); } });
  renderSpeed();
  $('#now').addEventListener('click', () => { stop(); setTime(nowHour()); });

  /* ── alerts ── */
  const colds = events.filter((e) => e.kind === 'cold');
  function activeAlerts() { const m = {}; events.forEach((e) => { if (ui.t >= e.startHour - 12 && ui.t <= e.bottomHour + 24) m[e.pier.id] = e.kind; }); return m; }
  /**
   * One banner, never two (the map needs the room). What it leads with:
   *   1. Weather Service WARNINGS (gale, storm …) — safety first
   *   2. cold-water surges — the fishing news
   *   3. Weather Service advisories / watches (small craft …), then statements (beach hazards …)
   * When more than one kind is in play, the second line says so ("Also: …") and a tap
   * opens the full list. Everything follows the timeline: alerts appear at their start
   * time and disappear when they end. Dismissing the banner keeps it hidden for the
   * rest of this map session; every alert remains available from the Alerts tool.
   */
  function bannerItems() {
    const T = tMs();
    const b = lm.map.getBounds(), inView = (a) => a.bbox && a.bbox[2] >= b.getWest() && a.bbox[0] <= b.getEast() && a.bbox[3] >= b.getSouth() && a.bbox[1] <= b.getNorth();
    const nwsNow = (ui.nws ? nws : []).filter((a) => activeAt(a, T))
      .map((a, i) => [a, i]).sort((x, y) => (inView(y[0]) - inView(x[0])) || x[1] - y[1]).map((x) => x[0]);
    const coldNow = colds.filter((e) => ui.t >= e.startHour - 12 && ui.t <= e.bottomHour + 24);
    // a warning leads the banner when it is for the area on screen; elsewhere it waits behind the surges
    const lead = (a) => a.level === 'warning' && inView(a);
    return { nwsNow, coldNow, warnings: nwsNow.filter(lead), others: nwsNow.filter((a) => !lead(a)) };
  }
  const nwsGroup = (list) => { const top = list[0], same = list.filter((a) => a.event === top.event).length; return same > 1 ? `${top.event} · ${same} areas` : top.event; };
  const coldTitle = (list) => { const big = list.slice().sort((a, b) => b.sizeF - a.sizeF)[0]; return list.length > 1 ? `Cold-water surge · ${list.length} piers` : `${big.strong ? 'Strong cold-water surge' : 'Cold-water surge'} · ${big.pier.name}`; };
  function updateAlerts() {
    lm.setAlerts(activeAlerts());
    renderNws();
    const chip = $('#alert'), tool = $('#alerts-tool');
    const { nwsNow, coldNow, warnings, others } = bannerItems();
    const upcomingNws = (ui.nws ? nws : []).filter((a) => a.start > tMs()).length;
    const total = events.length + nwsNow.length + upcomingNws;
    $('#alerts-count').textContent = total;
    const quiet = ui.selected || ui.selectedBuoy || document.querySelector('.sheet:not([hidden])');
    const ids = [...nwsNow.map((a) => a.id), ...coldNow.map((e) => `${e.cityId}@${e.startHour}`)];
    if (!total) { chip.hidden = true; tool.hidden = true; return; }
    if (quiet || !ids.length) { chip.hidden = true; tool.hidden = quiet ? !ui.alertHidden : false; return; }
    chip.hidden = ui.alertHidden; tool.hidden = !ui.alertHidden;
    const parts = [];
    if (warnings.length) parts.push({ kind: 'warning', icon: '!', title: nwsGroup(warnings), one: warnings.length === 1 && warnings[0] });
    if (coldNow.length) parts.push({ kind: 'surge', icon: '↓', title: coldTitle(coldNow), cold: coldNow });
    if (others.length) parts.push({ kind: others[0].level, icon: '!', title: nwsGroup(others), one: others.length === 1 && others[0] });
    const lead = parts[0], rest = parts.slice(1);
    chip.dataset.kind = lead.kind; $('#alert-ic').textContent = lead.icon;
    $('#alert-t').textContent = lead.title;
    if (rest.length) {
      $('#alert-s').textContent = `Also: ${rest.map((x) => x.title.split(' · ')[0]).join(' + ')} · tap for all`;
      chip.onclick = () => openAlerts(lead.kind === 'surge' ? 'water' : 'nws');
    } else if (lead.cold) {
      const c = lead.cold, big = c.slice().sort((a, b) => b.sizeF - a.sizeF)[0];
      $('#alert-s').textContent = c.length > 1 ? `${range(Math.min(...c.map((e) => e.startHour)), Math.max(...c.map((e) => e.bottomHour)))} · tap to see all` : `${deltaDeg(big.sizeF)} drop · ${range(big.startHour, big.bottomHour)}`;
      chip.onclick = () => (c.length > 1 ? openAlerts('water') : goEvent(big));
    } else {
      const a = lead.one;
      $('#alert-s').textContent = a ? `${shortArea(a.areaDesc)} · ${untilLabel(a)}` : 'Tap to see all';
      chip.onclick = () => (a ? openNws(a) : openAlerts('nws'));
    }
  }
  $('#alert-x').addEventListener('click', (e) => {
    e.stopPropagation();
    ui.alertHidden = true;
    updateAlerts();
    $('#alerts-tool').focus();
  });
  $('#alerts-tool').addEventListener('click', () => openAlerts(events.some((e) => eventStatus(e) !== 'past') ? 'water' : 'nws'));
  function goEvent(e) { closeSheets(); stop(); setTime(e.settledHour); selectPier(e.pier.id, true); }
  /* ── alerts sheet: two tabs, water temperature first (what anglers act on) ── */
  let alertTab = 'water';
  const waterOpen = { cold: false, warm: false };
  let seriesData = null, seriesTried = false;
  async function loadSeries() {
    if (seriesTried) return; seriesTried = true;
    try {
      const r = await fetch(new URL('series.json', new URL(lm.store.base, location.href)), { credentials: 'same-origin' });
      if (r.ok) { seriesData = await r.json(); if (!$('#sheet-alerts').hidden && alertTab === 'water') renderWater(); }
    } catch (e) { /* cards simply show no curve */ }
  }
  function eventStatus(e) { const n = nowHour(); return n > e.bottomHour + 24 ? 'past' : n >= e.startHour - 1 ? 'now' : 'soon'; }
  function whenChip(e) {
    const st = eventStatus(e);
    if (st === 'now') return '<span class="ev-when now">NOW</span>';
    if (st === 'past') return '<span class="ev-when">ENDED</span>';
    const h = e.startHour - nowHour();
    return `<span class="ev-when">${h < 20 ? `IN ${Math.max(1, Math.round(h))} H` : DAY[at(e.startHour).getDay()].toUpperCase()}</span>`;
  }
  /** the pier's forecast water temperature over the whole run, the event shaded */
  function spark(e) {
    const raw = seriesData?.piers?.[e.cityId]; if (!raw) return '';
    const v = raw.map((x) => (Number.isFinite(x) ? toTemp(x, ui.units.temp) : null)), ok = v.filter((x) => x !== null);
    if (ok.length < 12) return '';
    const lo = Math.min(...ok), hi = Math.max(...ok), W = 300, H = 34, n = v.length - 1;
    const X = (i) => (i / n * W).toFixed(1), Y = (t) => (H - 3 - (t - lo) / Math.max(1, hi - lo) * (H - 6)).toFixed(1);
    let d = ''; v.forEach((t, i) => { if (t !== null) d += `${d && v[i - 1] !== null ? 'L' : 'M'}${X(i)},${Y(t)}`; });
    const col = e.kind === 'cold' ? '#7CC4F2' : '#F09A3E', now = Math.min(n, nowHour());
    return `<svg class="ev-spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <rect x="${X(e.startHour)}" y="0" width="${Math.max(2, X(e.bottomHour) - X(e.startHour))}" height="${H}" fill="${col}" opacity=".16"/>
      <line x1="${X(now)}" x2="${X(now)}" y1="0" y2="${H}" stroke="#fff" stroke-opacity=".35" stroke-dasharray="2 3"/>
      <path d="${d}" fill="none" stroke="${col}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
  }
  function eventCard(e) {
    const arrow = e.kind === 'cold' ? '↓' : '↑';
    return `<button class="ev-card ${e.kind}" data-ev="${events.indexOf(e)}"${eventStatus(e) === 'past' ? ' data-past="1"' : ''}>
      <span class="ev-top"><span class="ev-delta ${e.kind}">${e.strong ? 'STRONG ' : ''}${arrow} ${deltaDeg(e.sizeF)}</span><b>${esc(e.pier.name)}</b>${whenChip(e)}</span>
      ${spark(e)}
      <span class="ev-meta"><span>${degs(e.startF)} → ${degs(e.endF)}${ui.units.temp}</span><span>${range(e.startHour, e.bottomHour)}</span></span></button>`;
  }
  function renderWater() {
    const rank = { now: 0, soon: 1, past: 2 };
    const section = (kind, title) => {
      const list = events.filter((e) => e.kind === kind).sort((a, b) => rank[eventStatus(a)] - rank[eventStatus(b)] || a.startHour - b.startHour);
      if (!list.length) return '';
      const open = waterOpen[kind], shown = open ? list : list.slice(0, 3);
      return `<div class="al-sec"><div class="al-sec-h"><span>${title}</span><span>${list.length}</span></div>${shown.map(eventCard).join('')}
        ${list.length > 3 ? `<button class="al-more" data-more="${kind}" aria-expanded="${open}">${open ? 'Show fewer' : `Show ${list.length - 3} more`}</button>` : ''}</div>`;
    };
    const body = section('cold', 'COLD-WATER SURGES') + section('warm', 'WARM-WATER PUSHES');
    $('#al-water').innerHTML = (body || '<div class="al-empty">No cold-water surges or warm-water pushes at the piers in the 5-day forecast.</div>') +
      '<p class="al-note">A surge is a drop of 10°F in 24 hours (or 8°F in 12) that ends at 60°F or colder and lasts at least 6 hours; trout and salmon often move in close. A push is the same, warming. Tap one to see it on the map.</p>';
  }
  $('#al-water').addEventListener('click', (ev) => {
    const more = ev.target.closest('[data-more]');
    if (more) { waterOpen[more.dataset.more] = !waterOpen[more.dataset.more]; renderWater(); return; }
    const c = ev.target.closest('.ev-card'); if (c) goEvent(events[+c.dataset.ev]);
  });
  const renderAlertList = () => { if (!$('#sheet-alerts').hidden) renderWater(); };
  function setAlertTab(tab) {
    alertTab = tab;
    document.querySelectorAll('.al-tabs [data-tab]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    $('#al-water').hidden = tab !== 'water'; $('#al-nws').hidden = tab !== 'nws';
    if (tab === 'water') renderWater(); else renderNwsTab();
  }
  document.querySelectorAll('.al-tabs [data-tab]').forEach((b) => b.addEventListener('click', () => { haptic(); setAlertTab(b.dataset.tab); }));
  function openAlerts(tab) {
    openSheet('alerts'); loadSeries();
    $('#tab-water-n').textContent = events.filter((e) => eventStatus(e) !== 'past').length;
    $('#tab-nws-n').textContent = nwsListed.length;
    setAlertTab(tab || 'water');
  }

  /* ── pier card ── */
  function selectPier(id, fly, quiet) {
    clearBuoy();
    ui.selected = id; lm.setSelected(id); closeSheets(); pierCard(); updateAlerts();
    if (!quiet) { haptic(); track_('pier_opened', { city_id: id, layer: ui.layer }); }
    const p = piers.find((x) => x.id === id);
    if (fly && p) lm.flyTo(p.lon, p.lat, Math.max(8.1, lm.map.getZoom()), [p.nameSide === 'left' ? -40 : 40, -innerHeight / 2 + 214]);
  }
  function pierCard() {
    const p = piers.find((x) => x.id === ui.selected), card = $('#pier');
    if (!p) { card.hidden = true; $('#readout').hidden = false; $('#cross').hidden = false; return; }
    const s = lm.sampleAt(p.lon, p.lat), s12 = lm.sampleAt(p.lon, p.lat, Math.min(maxHour, ui.t + 12)), u = ui.units;
    const tU = u.temp === 'C' ? '°C' : '°F', dd = toTemp(s12.temp, u.temp) - toTemp(s.temp, u.temp);
    const ev = events.find((e) => e.pier.id === p.id && ui.t <= e.bottomHour + 24);
    card.hidden = false; $('#readout').hidden = true; $('#cross').hidden = true;
    $('#p-k').textContent = `${{ MI: 'MICHIGAN', WI: 'WISCONSIN', IL: 'ILLINOIS', IN: 'INDIANA' }[p.st]} · ${p.lake.toUpperCase()}`;
    $('#p-t').textContent = p.name; $('#p-s').textContent = p.structure;
    const ok = Number.isFinite(s.temp);
    $('#p-water').textContent = ok ? `${toTemp(s.temp, u.temp).toFixed(1)}°` : '—';
    $('#p-water-s').textContent = !ok || !Number.isFinite(dd) ? 'Loading…' : Math.abs(dd) < 0.3 ? 'Steady next 12 h' : `${dd > 0 ? '+' : '−'}${Math.abs(dd).toFixed(1)}° next 12 h`;
    $('#p-wind').textContent = Number.isFinite(s.wind) ? `${compass(s.windFrom)} ${fmtWind(s.wind, u.wind)}` : '—'; $('#p-wind-s').textContent = u.wind === 'kph' ? 'km/h' : u.wind;
    $('#p-waves').textContent = fmtWaves(s.waves, u.length); $('#p-waves-s').textContent = u.length + (s.waves >= 4 ? ' · use caution' : '');
    const here = ui.nws ? nwsAt(p.lon, p.lat) : [], pn = $('#p-nws');
    pn.hidden = !here.length;
    if (here.length) {
      pn.className = 'p-nws ' + here[0].level;
      pn.textContent = here.length > 1 ? `⚠ ${here[0].event} + ${here.length - 1} more alert${here.length > 2 ? 's' : ''} here · tap for details` : `⚠ ${here[0].event} · ${untilLabel(here[0])}`;
      pn.onclick = () => (here.length > 1 ? openAlerts('nws') : openNws(here[0]));
    }
    const al = $('#p-alert'); al.hidden = !ev;
    if (ev) { al.className = 'p-alert ' + ev.kind; $('#p-alert-t').textContent = ev.kind === 'cold' ? (ev.strong ? 'Strong cold-water surge' : 'Cold-water surge') : 'Warm-water push'; $('#p-alert-s').textContent = `${degs(ev.startF)} → ${degs(ev.endF)}${ui.units.temp}, ${range(ev.startHour, ev.bottomHour)}. Trout and salmon often move ${ev.kind === 'cold' ? 'in' : 'out'}.`; }
  }
  $('#p-report').addEventListener('click', () => {
    if (!ui.selected) return;
    haptic(); post({ type: 'openCity', cityId: ui.selected, speciesId: ui.layer === 'species' ? ui.species.id : null });
  });
  $('#p-close').addEventListener('click', () => { ui.selected = null; lm.setSelected(null); pierCard(); updateAlerts(); });
  lm.on('pierTap', (id) => selectPier(id, false));
  lm.on('mapTap', () => { if (ui.selected) { ui.selected = null; lm.setSelected(null); pierCard(); updateAlerts(); } if (ui.selectedBuoy) { clearBuoy(); updateAlerts(); } });

  /* ── observations (NOAA NDBC + GLOS Seagull via the gatekeeper) ── */
  let buoys = [], buoyFeed = null;
  function observationHealthText() {
    const quality = buoyFeed?.health?.quality;
    if (!quality) return 'Observed sensors refresh every 15 minutes';
    const strict = quality.strictValidation || 0;
    return `${quality.waterStations || 0} current water stations · ${strict} strict surface checks · 15 min archive`;
  }
  async function loadBuoys() {
    try {
      const r = await fetch(new URL('../obs/buoys.json', location.href), { credentials: 'same-origin', cache: 'no-store' });
      if (!r.ok) return;
      const j = await r.json(); buoyFeed = j; buoys = Array.isArray(j.stations) ? j.stations : [];
      $('#obs-health').textContent = observationHealthText();
      lm.setBuoys(buoys); if (ui.selectedBuoy) buoyCard();
    } catch (e) { /* no buoy feed here */ }
  }
  function clearBuoy() { if (!ui.selectedBuoy) return; ui.selectedBuoy = null; lm.setBuoyOptions({ selected: null }); $('#buoy').hidden = true; if (!ui.selected) { $('#readout').hidden = false; $('#cross').hidden = false; } }
  function selectBuoy(id) {
    ui.selected = null; lm.setSelected(null); pierCard(); closeSheets();
    ui.selectedBuoy = id; lm.setBuoyOptions({ selected: id }); buoyCard(); updateAlerts();
    haptic(); track_('buoy_opened', { station: id });
  }
  function agoText(iso) {
    const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
    return m < 2 ? 'just now' : m < 60 ? `${m} min ago` : `${Math.floor(m / 60)} h ${m % 60} min ago`;
  }
  function buoyCard() {
    const b = buoys.find((x) => x.id === ui.selectedBuoy), card = $('#buoy');
    if (!b) { clearBuoy(); return; }
    const u = ui.units, tU = u.temp === 'C' ? '°C' : '°F';
    card.hidden = false; $('#readout').hidden = true; $('#cross').hidden = true;
    $('#b-k').textContent = `${(b.source || 'OBSERVATION').toUpperCase()} · OBSERVED`;
    const waterTime = b.waterTime || b.time;
    $('#b-t').textContent = b.name; $('#b-s').textContent = `Water reading from ${agoText(waterTime)}`;
    const model = lm.sampleAt(b.lon, b.lat, nowHour());
    $('#b-water').textContent = b.waterF == null ? '—' : `${toTemp(b.waterF, u.temp).toFixed(1)}°`;
    const depth = Number.isFinite(b.waterDepthM) ? (u.length === 'm' ? b.waterDepthM : b.waterDepthM / 0.3048) : null;
    const depthText = depth == null ? 'sensor depth unknown' : b.waterDepthM <= 0.25 ? 'surface sensor' : `${depth.toFixed(depth < 10 ? 1 : 0)} ${u.length} deep`;
    if (b.waterF == null || !Number.isFinite(model.temp)) $('#b-water-s').textContent = `${tU} · ${depthText}`;
    else {
      const observed = toTemp(b.waterF, u.temp), modeled = toTemp(model.temp, u.temp), delta = observed - modeled;
      $('#b-water-s').textContent = `${depthText} · model ${modeled.toFixed(1)}° · Δ ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}°`;
    }
    $('#b-wind').textContent = b.windMph == null ? '—' : `${b.windFrom == null ? '' : compass(b.windFrom) + ' '}${fmtWind(b.windMph, u.wind)}`;
    $('#b-wind-s').textContent = b.windMph == null ? 'not reported' : `${u.wind === 'kph' ? 'km/h' : u.wind}${b.gustMph ? ' · gusts ' + fmtWind(b.gustMph, u.wind) : ''}`;
    $('#b-waves').textContent = b.wavesFt == null ? '—' : (u.length === 'm' ? b.wavesFt * 0.3048 : b.wavesFt).toFixed(1);
    $('#b-waves-s').textContent = b.wavesFt == null ? 'not reported' : `${u.length}${b.periodS ? ' · ' + b.periodS + ' s' : ''}`;
    const profile = Array.isArray(b.profile) ? b.profile.filter((item) => item.waterF != null && Number.isFinite(item.depthM)) : [];
    const profileEl = $('#b-profile'); profileEl.hidden = profile.length < 2;
    if (profile.length >= 2) {
      const indexes = profile.length <= 6 ? profile.map((_, i) => i) : [...new Set([0, 1, ...Array.from({ length: 3 }, (_, i) => Math.round((i + 1) * (profile.length - 1) / 4)), profile.length - 1])];
      const values = indexes.map((i) => {
        const item = profile[i], z = u.length === 'm' ? item.depthM : item.depthM / 0.3048;
        return `${z.toFixed(z < 10 ? 1 : 0)} ${u.length}: ${toTemp(item.waterF, u.temp).toFixed(1)}°`;
      });
      profileEl.textContent = `DEPTH PROFILE · ${values.join('  ·  ')}`;
    }
    const strict = b.waterQuality === 'good' && (b.waterSurface === true || (Number.isFinite(b.waterDepthM) && b.waterDepthM <= 3));
    const quality = strict ? ' · QARTOD good, surface/shallow; strict comparison eligible'
      : b.waterQuality === 'not_evaluated' ? ' · QARTOD not yet evaluated; context only'
        : b.waterQuality === 'provider_qc' ? ' · provider checks passed; validation depth unresolved'
          : ' · context only';
    $('#b-note').textContent = `${b.source || 'Observed'} point reading${quality}. The sensor and NOAA modeled surface are not interchangeable.`;
  }
  $('#b-close').addEventListener('click', () => { clearBuoy(); updateAlerts(); });
  lm.on('buoyTap', (id) => selectBuoy(id));

  /* ── National Weather Service alerts (live from weather.gov) ── */
  let nws = [], nwsShapes = { type: 'FeatureCollection', features: [] };
  let nwsFailed = false;
  async function loadNws() {
    try {
      const shaped = await alertShapes(await fetchNwsAlerts());
      nws = shaped.alerts; nwsShapes = shaped.geojson; nwsFailed = false;
      lm.setNwsAreas(nwsShapes); ui.nwsQ = Math.floor(tMs() / 900e3); lm.setNwsTime(ui.nwsQ * 900e3); ui.nwsKey = ''; updateAlerts(); if (ui.selected) pierCard();
    } catch (e) { nwsFailed = !nws.length; ui.nwsKey = ''; renderNws(); /* weather.gov unreachable: keep what we had */ }
  }
  const untilText = (ms) => { const d = new Date(ms); return `${dayName(d)} ${clock(d.getHours())}`; };
  const untilLabel = (a) => (a.start > tMs() ? `starts ${untilText(a.start)}` : a.openEnded ? 'until further notice' : `until ${untilText(a.end)}`);
  const shortArea = (t) => { const x = String(t).split(';')[0].trim(); return x.length > 80 ? x.slice(0, 78) + '…' : x; };
  function inRing(x, y, ring) { let inside = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, yi] = ring[i], [xj, yj] = ring[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside; } return inside; }
  function inGeom(x, y, g) {
    if (!g) return false;
    if (g.type === 'Polygon') return inRing(x, y, g.coordinates[0]) && !g.coordinates.slice(1).some((h) => inRing(x, y, h));
    if (g.type === 'MultiPolygon') return g.coordinates.some((c) => inGeom(x, y, { type: 'Polygon', coordinates: c }));
    if (g.type === 'GeometryCollection') return g.geometries.some((h) => inGeom(x, y, h));
    return false;
  }
  /** alerts in force (at the timeline's time) covering a spot, or the water/shore within ~2 mi, most serious first */
  function nwsAt(lon, lat) {
    const d = 0.03, pts = [[0, 0], [d, 0], [-d, 0], [0, d], [0, -d]], T = tMs(), ids = new Set();
    for (const f of nwsShapes.features) {
      if (ids.has(f.properties.id) || !(f.properties.s <= T && T < f.properties.e)) continue;
      if (pts.some(([dx, dy]) => inGeom(lon + dx, lat + dy, f.geometry))) ids.add(f.properties.id);
    }
    return nws.filter((a) => ids.has(a.id)); // nws is already most-serious-first
  }
  let nwsListed = [];
  function renderNws() {
    const T = tMs(), key = `${Math.floor(T / 900e3)}|${nws.length}|${ui.nws}|${nwsFailed}`;
    if (key === ui.nwsKey) return; ui.nwsKey = key;
    // in force (at the timeline's time) or starting later; ended ones drop off
    nwsListed = (ui.nws ? nws : []).filter((a) => a.end > T);
    $('#tab-nws-n').textContent = nwsListed.length;
    if (!$('#sheet-alerts').hidden && alertTab === 'nws') renderNwsTab();
  }
  const LEVEL_NAME = { warning: 'WARNING', advisory: 'ADVISORY', statement: 'STATEMENT' };
  const nwsOpen = new Set();
  /** Weather Service alerts grouped by type ("Small Craft Advisory · 14 areas"), each group opens to its areas */
  function renderNwsTab() {
    const T = tMs(), b = lm.map.getBounds();
    const inView = (a) => a.bbox && a.bbox[2] >= b.getWest() && a.bbox[0] <= b.getEast() && a.bbox[3] >= b.getSouth() && a.bbox[1] <= b.getNorth();
    const groups = new Map();
    for (const a of nwsListed) { if (!groups.has(a.event)) groups.set(a.event, []); groups.get(a.event).push(a); }
    const rank = { warning: 0, advisory: 1, statement: 2 };
    const list = [...groups.entries()].sort((x, y) => rank[x[1][0].level] - rank[y[1][0].level] || y[1].length - x[1].length);
    if (!ui.nws) { $('#al-nws').innerHTML = '<div class="al-empty">Weather Service alerts are switched off in Map layers.</div>'; return; }
    if (!list.length) {
      $('#al-nws').innerHTML = `<div class="al-empty">${nwsFailed ? 'Weather Service alerts couldn\'t be loaded right now. Check weather.gov before heading out.' : 'No Weather Service alerts for the Great Lakes or their shores right now.'}</div>`;
      return;
    }
    $('#al-nws').innerHTML = list.map(([event, as]) => {
      const active = as.filter((a) => activeAt(a, T)), near = as.filter(inView).length;
      const status = active.length ? (active.every((a) => a.openEnded) ? 'until further notice' : `until ${untilText(Math.max(...active.map((a) => a.end)))}`) : `starts ${untilText(Math.min(...as.map((a) => a.start)))}`;
      const open = nwsOpen.has(event);
      const rows = as.slice().sort((x, y) => inView(y) - inView(x) || x.start - y.start).map((a) => `<button class="ng-row" data-id="${esc(a.id)}"${a.start > T ? ' data-later="1"' : ''}><span>${esc(shortArea(a.areaDesc))}</span><small>${esc(untilLabel(a))}</small></button>`).join('');
      return `<div class="ng" data-open="${open ? 1 : 0}"><button class="ng-head" data-g="${esc(event)}" aria-expanded="${open}"><span class="nws-ic ${as[0].level}">!</span><span class="al-b"><b>${esc(event)}</b><small>${as.length} area${as.length > 1 ? 's' : ''}${near ? ` · ${near} in view` : ''} · ${esc(status)}</small></span>
        <svg class="ng-chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="ng-body"${open ? '' : ' hidden'}>${rows}</div></div>`;
    }).join('') + '<p class="al-note">From the National Weather Service (weather.gov), refreshed every 10 minutes. Always check official forecasts before going out on a pier.</p>';
  }
  $('#al-nws').addEventListener('click', (ev) => {
    const h = ev.target.closest('.ng-head');
    if (h) { const g = h.dataset.g; if (nwsOpen.has(g)) nwsOpen.delete(g); else nwsOpen.add(g); haptic(); renderNwsTab(); return; }
    const r = ev.target.closest('.ng-row'); if (r) openNws(nws.find((a) => a.id === r.dataset.id));
  });
  $('#nd-back').addEventListener('click', () => { haptic(); openAlerts('nws'); });
  /** "* WHAT...text * WHERE...text" (the Weather Service's own layout) → labelled sections */
  function nwsSections(text) {
    const clean = (t) => t.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
    const names = { WHAT: 'What', WHERE: 'Where', WHEN: 'When', IMPACTS: 'Impacts', 'ADDITIONAL DETAILS': 'Details', HAZARD: 'Hazard', SOURCE: 'Source' };
    const out = [], re = /\*\s*([A-Z][A-Z ]+?)\.\.\.([\s\S]*?)(?=\n\s*\*\s*[A-Z][A-Z ]+?\.\.\.|$)/g;
    let m; while ((m = re.exec(text))) out.push([names[m[1].trim()] || m[1].trim().toLowerCase().replace(/^./, (c) => c.toUpperCase()), clean(m[2])]);
    if (!out.length) String(text).split(/\n\s*\n/).map(clean).filter(Boolean).forEach((p) => out.push(['', p]));
    return out;
  }
  function openNws(a) {
    if (!a) return;
    openSheet('nws');
    $('#sheet-nws').scrollTop = 0;
    const band = $('#nd-band'); band.className = 'nd-band ' + a.level;
    $('#nd-kind').textContent = `${LEVEL_NAME[a.level]}${a.sender ? ' · ' + a.sender.replace(/^NWS /, '').toUpperCase() : ''}`;
    $('#nd-title').textContent = a.event;
    const T = tMs();
    $('#nd-status').textContent = `${a.start > T ? 'Starts ' + untilText(a.start) : 'In effect'}${a.start > T ? '' : a.openEnded ? ' until further notice' : ' until ' + untilText(a.end)}`;
    const secs = nwsSections(a.description || a.headline || '');
    if (!secs.some(([k]) => k === 'Where')) secs.unshift(['Where', shortArea(a.areaDesc)]);
    $('#nd-sections').innerHTML = secs.map(([k, v]) => `<div class="nd-sec">${k ? `<small>${esc(k.toUpperCase())}</small>` : ''}<p>${esc(v)}</p></div>`).join('');
    const todo = (a.instruction || '').replace(/\s*\n\s*/g, ' ').trim();
    $('#nd-do').hidden = !todo; $('#nd-do-t').textContent = todo;
    $('#nd-map').hidden = !a.bbox;
    $('#nd-map').onclick = () => { closeSheets(); lm.fitBox(a.bbox, { top: 190, bottom: 220, left: 30, right: 70 }); };
    $('#nd-src').textContent = 'Issued by the National Weather Service · weather.gov';
    track_('nws_alert_opened', { event: a.event });
  }
  lm.setBuoyOptions({ on: ui.buoys }); lm.setNwsVisible(ui.nws);
  lm.map.on('moveend', () => { if (nws.length) updateAlerts(); });
  /*
   * Newer NOAA runs. A new forecast never interrupts the viewer: while the map
   * is covered, in the background or hidden it is applied silently; while the
   * viewer is looking at the map a small "Updated forecast" pill offers it. The
   * page reloads into the new run at the same spot, zoom, time and pier.
   */
  let pendingRun = null;
  function applyUpdate(onlyIfUnseen) {
    if (!pendingRun) return;
    if (onlyIfUnseen && !(ui.paused || document.hidden)) return;
    try {
      const c = lm.map.getCenter();
      sessionStorage.setItem(RESUME_KEY, JSON.stringify({
        at: Date.now(), center: [c.lng, c.lat], zoom: lm.map.getZoom(), timeMs: tMs(),
        atNow: Math.abs(ui.t - nowHour()) < 0.5, selected: ui.selected,
      }));
    } catch (e) { /* storage off: the new run still opens, just at the defaults */ }
    track_('map_data_refresh', { from: activeRun, to: pendingRun });
    location.reload();
  }
  window.__pcApplyUpdate = applyUpdate;
  document.addEventListener('visibilitychange', () => { if (document.hidden) applyUpdate(true); });
  $('#update').addEventListener('click', () => { haptic(); applyUpdate(false); });
  async function checkLatestRun() {
    if (!activeRun || q.get('data')) return;
    try {
      const latest = await fetch('../latest.json', { cache: 'no-store', credentials: 'same-origin' }).then((r) => (r.ok ? r.json() : null));
      if (hasNewPublishedRun(activeRun, latest)) {
        pendingRun = latest.run;
        if (ui.paused || document.hidden) applyUpdate(true);
        else $('#update').hidden = false;
      }
    } catch (e) { /* retain the complete run already on screen */ }
  }
  let lastObservationRefresh = 0, lastModelRefreshCheck = 0, lastRunCheck = 0;
  window.__pcRefreshFeeds = (force = false) => {
    const now = Date.now(); let refreshed = false;
    if (force || now - lastObservationRefresh >= OBSERVATION_REFRESH_MS) {
      lastObservationRefresh = now; loadBuoys(); refreshed = true;
    }
    if (force || now - lastModelRefreshCheck >= MODEL_REFRESH_CHECK_MS) {
      lastModelRefreshCheck = now; loadNws(); refreshed = true;
    }
    if (force || now - lastRunCheck >= RUN_CHECK_MS) { lastRunCheck = now; checkLatestRun(); refreshed = true; }
    if (refreshed) ui.lastFeeds = now;
  };
  window.__pcRefreshFeeds(true);
  setInterval(() => {
    if (!document.hidden && !ui.paused) window.__pcRefreshFeeds();
    // covered by another app screen: still look for a new run, so it can be swapped in unseen
    else if (ui.paused && Date.now() - lastRunCheck >= RUN_CHECK_MS) { lastRunCheck = Date.now(); checkLatestRun(); }
  }, 60e3);

  /* ── sheets ── */
  function openSheet(name) { ui.selected = null; lm.setSelected(null); pierCard(); clearBuoy(); document.querySelectorAll('.sheet').forEach((s) => { s.hidden = s.id !== 'sheet-' + name; }); $('#scrim').hidden = false; $('#attrib').hidden = true; updateAlerts(); }
  function closeSheets() { document.querySelectorAll('.sheet').forEach((s) => { s.hidden = true; }); $('#scrim').hidden = true; $('#attrib').hidden = false; updateAlerts(); }
  $('#scrim').addEventListener('click', closeSheets);
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeSheets));
  $('#layers').addEventListener('click', () => openSheet('layers'));
  $('#search').addEventListener('click', () => { openSheet('search'); $('#q').value = ''; renderResults(); });
  $('#fit').addEventListener('click', () => lm.fitAll());
  $('#attrib').addEventListener('click', () => openSheet('credits'));
  function setLayer(layer) {
    ui.layer = layer; lm.setLayer(layer);
    document.querySelectorAll('[data-layer]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.layer === layer)));
    $('#layer-l').textContent = { temp: 'TEMP', wind: 'WIND', waves: 'WAVES', depth: 'DEPTH', species: 'MATCH' }[layer];
    $('#sp-chips').hidden = layer !== 'species';
    legend(); queueReadout(); if (ui.selected) pierCard();
  }
  document.querySelectorAll('[data-layer]').forEach((b) => b.addEventListener('click', () => {
    setLayer(b.dataset.layer); savePrefs(); haptic(); track_('layer_changed', { layer: ui.layer });
  }));
  const toggle = (id, key, fn) => $(id).addEventListener('click', () => { ui[key] = !ui[key]; $(id).setAttribute('aria-checked', String(ui[key])); fn(ui[key]); savePrefs(); });
  toggle('#sw-streaks', 'streaks', (v) => lm.setOptions({ streaks: v }));
  toggle('#sw-lines', 'lines', (v) => lm.setOptions({ lines: v }));
  toggle('#sw-buoys', 'buoys', (v) => { lm.setBuoyOptions({ on: v }); if (!v) clearBuoy(); });
  toggle('#sw-nws', 'nws', (v) => { lm.setNwsVisible(v); ui.nwsKey = ''; updateAlerts(); if (ui.selected) pierCard(); });
  function setUnit(k, v) {
    ui.units[k] = v; lm.setUnits({ [k]: v });
    document.querySelectorAll(`[data-unit^="${k}:"]`).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.unit === `${k}:${v}`)));
  }
  document.querySelectorAll('[data-unit]').forEach((b) => b.addEventListener('click', () => {
    const [k, v] = b.dataset.unit.split(':'); setUnit(k, v); savePrefs();
    legend(); queueReadout(); renderAlertList(); renderChips(); updateAlerts(); if (ui.selected) pierCard(); if (ui.selectedBuoy) buoyCard();
  }));
  // start from the saved (or app-provided) choices
  for (const k of Object.keys(ui.units)) setUnit(k, ui.units[k]);
  lm.setOptions({ streaks: ui.streaks, lines: ui.lines });
  $('#sw-streaks').setAttribute('aria-checked', String(ui.streaks)); $('#sw-lines').setAttribute('aria-checked', String(ui.lines));
  $('#sw-buoys').setAttribute('aria-checked', String(ui.buoys)); $('#sw-nws').setAttribute('aria-checked', String(ui.nws));
  function renderChips() {
    $('#sp-chips').innerHTML = SPECIES.map((sp) => `<button data-sp="${sp.id}" aria-pressed="${sp === ui.species}">${sp.name}<small>${degs(sp.lo)}–${degs(sp.hi)}</small></button>`).join('');
  }
  renderChips(); lm.setSpecies(ui.species);
  $('#sp-chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-sp]'); if (!b) return;
    ui.species = SPECIES.find((x) => x.id === b.dataset.sp); lm.setSpecies(ui.species); renderChips(); legend(); queueReadout(); savePrefs(); haptic();
  });
  function renderResults() {
    const q = $('#q').value.trim().toLowerCase();
    $('#results').innerHTML = piers.filter((p) => !q || p.name.toLowerCase().includes(q) || p.st.toLowerCase() === q).sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => `<button class="res" data-id="${p.id}"><b>${p.name}</b><small>${p.st} · ${p.lake}</small></button>`).join('');
  }
  $('#q').addEventListener('input', renderResults);
  $('#results').addEventListener('click', (e) => { const b = e.target.closest('.res'); if (b) selectPier(b.dataset.id, true); });

  buildTrack(); setLayer(ui.layer);
  fitLayout();
  addEventListener('resize', fitLayout);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(fitLayout);
    for (const sel of ['.bottom', '#alert', '#readout']) { const el = $(sel); if (el) ro.observe(el); }
  }
  const resumeHour = resume && !resume.atNow && Number.isFinite(resume.timeMs) ? (resume.timeMs - T0) / 3600e3 : null;
  setTime(resumeHour !== null && resumeHour >= 0 && resumeHour <= maxHour ? resumeHour : nowHour()); readout();
  const resumePier = resume && piers.find((p) => p.id === resume.selected);
  const openCity = !resume && APP && piers.find((p) => p.id === APP.cityId);
  if (resumePier) selectPier(resumePier.id, false, true);
  else if (openCity) selectPier(openCity.id, true, true);
  post({ type: 'ready', run: lm.store.manifest.run || null, sample: !!lm.store.manifest.sample });
})().catch((err) => {
  const l = document.getElementById('loading'); if (l) l.textContent = 'Map failed to load: ' + err.message;
  post({ type: 'error', message: String(err && err.message || err) });
  console.error(err);
});
