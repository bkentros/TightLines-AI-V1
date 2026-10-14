import { compass, fmtTemp, fmtWaves, fmtWind, speciesFit, toTemp } from './scales.js';
import { depthLabel } from './tempDepth.js';

const finite = Number.isFinite;
const join = (...parts) => parts.filter(Boolean).join(' · ');
const placeholder = (reason) => ({ val: '—', unit: '', sub: reason });

function placeReason(sample) {
  if (sample.outsideCoverage) return 'No data here · outside model coverage';
  if (sample.harbor) return 'No lake model in harbor water';
  if (!sample.onWater) return 'No data here · over land';
  return null;
}

/**
 * Produces only display-safe readout strings. Missing frame values and
 * legitimate spatial masks are UI states, never numbers to format.
 */
export function readoutDisplay({ layer, sample, units, depthFt, species }) {
  const tempUnit = units.temp === 'C' ? '°C' : '°F';
  const windUnit = units.wind === 'kph' ? 'km/h' : units.wind;
  const hasWind = finite(sample.wind) && finite(sample.windFrom);
  const windText = hasWind ? `${compass(sample.windFrom)} ${fmtWind(sample.wind, units.wind)} ${windUnit}` : null;
  const waveText = finite(sample.waves) ? `Waves ${fmtWaves(sample.waves, units.length)} ${units.length}` : null;
  const waterText = finite(sample.temp) ? `${fmtTemp(sample.temp, units.temp)}${tempUnit}` : null;
  const noPlaceData = placeReason(sample);

  if (sample.harbor) {
    if (layer === 'wind' && hasWind) return { val: fmtWind(sample.wind, units.wind), unit: `${windUnit} ${compass(sample.windFrom)}`, sub: 'Harbor water · no lake model' };
    return placeholder(noPlaceData);
  }
  if (noPlaceData) return placeholder(noPlaceData);

  if (layer === 'temp_depth') {
    if (sample.tempDepthReady === false) return placeholder('Loading depth temperature…');
    if (!finite(sample.tempDepth)) {
      if (finite(sample.depthNear) && depthFt > sample.depthNear) return placeholder('Selected depth is below the bottom');
      return placeholder('No depth temperature here');
    }
    return { val: `${fmtTemp(sample.tempDepth, units.temp)}${tempUnit}`, unit: '', sub: join(windText, 'modeled below surface') };
  }

  if (layer === 'wind') {
    if (!hasWind) return placeholder('No wind data here');
    return { val: fmtWind(sample.wind, units.wind), unit: `${windUnit} ${compass(sample.windFrom)}`, sub: join(waterText ? `Water ${waterText}` : null, waveText) };
  }
  if (layer === 'waves') {
    if (!finite(sample.waves)) return placeholder('No wave data here');
    return { val: fmtWaves(sample.waves, units.length), unit: units.length, sub: join(windText, waterText ? `Water ${waterText}` : null) };
  }
  if (layer === 'depth') {
    if (!finite(sample.depth)) return placeholder('No depth data here');
    const value = units.length === 'm' ? Math.round(sample.depth * 0.3048) : Math.round(sample.depth);
    return { val: String(value), unit: `${units.length} deep`, sub: join(waterText ? `Water ${waterText}` : null, windText) };
  }

  if (!finite(sample.temp)) {
    if (sample.tempReady === false) return placeholder('Loading surface temperature…');
    return placeholder('No surface temperature here');
  }
  if (layer === 'species') {
    const fit = speciesFit(sample.temp, species);
    const speciesLow = Math.round(toTemp(species.lo, units.temp));
    const speciesHigh = Math.round(toTemp(species.hi, units.temp));
    const delta = Math.round(units.temp === 'C' ? fit.d * 5 / 9 : fit.d);
    return {
      val: fmtTemp(sample.temp, units.temp),
      unit: tempUnit,
      sub: `${species.name} ${speciesLow}–${speciesHigh}°${units.temp} · ${fit.grade === 0 ? 'in range' : `${delta}°${units.temp} too ${fit.dir}`}`,
    };
  }
  return { val: fmtTemp(sample.temp, units.temp), unit: tempUnit, sub: join(windText, waveText) };
}

export function depthReadoutLabel(depthFt, units) {
  return `at ${depthLabel(depthFt, units.length)}`;
}
