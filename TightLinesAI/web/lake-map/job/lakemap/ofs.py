"""NOAA Great Lakes lake models (LSOFS, LMHOFS, LEOFS, LOOFS): surface water
temperature for each forecast hour, plus the model depth, from the
regular-grid files on NOAA's THREDDS server, with NOAA's independent public
AWS/NODD distribution as the automatic failover."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import numpy as np
from scipy.spatial import cKDTree

from . import net
from .config import OFS_CYCLES, OFS_MODELS, THREDDS
from .dap import parse_dods
from .depth import feet_to_m, interpolate_sigma_to_depths, interpolate_to_depths, level_slab
from .regrid import Regridder

FILL = -99990.0
AWS_BUCKET = "noaa-nos-ofs-pds"
AWS_HTTPS = f"https://{AWS_BUCKET}.s3.amazonaws.com"


class DepthDataUnavailable(RuntimeError):
    """The selected NOAA distribution cannot safely supply fixed-depth data."""


THREDDS_DISTRIBUTION = "NOAA_COOPS_THREDDS"
NODD_DISTRIBUTION = "NOAA_NODD_AWS"
# Every entry must be backed by the checked-in two-cycle validation report.
# Remove a model from this set if a later revalidation fails; automatic NODD
# depth publication will then fail closed for the entire coherent cycle.
NODD_DEPTH_VALIDATED_MODELS = frozenset({"LSOFS", "LMHOFS", "LEOFS", "LOOFS"})


def dataset_url(model, cycle: datetime, hour: int) -> str:
    d = cycle.strftime("%Y%m%d")
    return (f"{THREDDS}/{model['id']}/MODELS/{cycle:%Y/%m/%d}/"
            f"{model['prefix']}.t{cycle:%H}z.{d}.regulargrid.f{hour:03d}.nc")


def aws_dataset_key(model, cycle: datetime, hour: int) -> str:
    d = cycle.strftime("%Y%m%d")
    return (f"{model['prefix']}/netcdf/{cycle:%Y/%m/%d}/"
            f"{model['prefix']}.t{cycle:%H}z.{d}.fields.f{hour:03d}.nc")


def aws_dataset_url(model, cycle: datetime, hour: int) -> str:
    return f"{AWS_HTTPS}/{aws_dataset_key(model, cycle, hour)}"


def cycle_candidates(now: datetime, lookback_hours=30):
    t = now.replace(minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
    t = t.replace(hour=max(c for c in OFS_CYCLES if c <= t.hour))
    out = []
    while (now - t) <= timedelta(hours=lookback_hours):
        out.append(t)
        t -= timedelta(hours=6)
    return out


def discover(model, now: datetime, lookback_hours=30):
    """Newest cycle complete on either official NOAA distribution."""
    for cycle in cycle_candidates(now, lookback_hours):
        try:
            net.fetch(dataset_url(model, cycle, 120) + ".dds", timeout=30, retries=2)
            return cycle
        except Exception:
            pass
        try:
            net.head(aws_dataset_url(model, cycle, 120), timeout=15, retries=2)
            return cycle
        except Exception:
            continue
    return None


def _aws_grid(model, cycle: datetime):
    import fsspec
    import h5py
    stream = fsspec.open(
        aws_dataset_url(model, cycle, 0),
        "rb",
        block_size=1024 * 1024,
        cache_type="readahead",
    ).open()
    dataset = h5py.File(stream, "r")
    try:
        return tuple(
            np.asarray(dataset[name], dtype=np.float64)
            for name in ("lat", "lon", "h")
        )
    finally:
        dataset.close()
        stream.close()


def _aws_surface_temp(model, cycle: datetime, hour: int):
    import fsspec
    import h5py
    stream = fsspec.open(
        aws_dataset_url(model, cycle, hour),
        "rb",
        block_size=1024 * 1024,
        cache_type="readahead",
    ).open()
    dataset = h5py.File(stream, "r")
    try:
        return np.asarray(dataset["temp"][0, 0, :], dtype=np.float32)
    finally:
        dataset.close()
        stream.close()


def _aws_depth_profile(model, cycle: datetime, hour: int, include_sigma: bool):
    """Read one native profile hour; the returned byte count is uncompressed data."""
    import fsspec
    import h5py
    stream = fsspec.open(
        aws_dataset_url(model, cycle, hour),
        "rb",
        block_size=1024 * 1024,
        cache_type="readahead",
    ).open()
    dataset = h5py.File(stream, "r")
    try:
        temp = np.asarray(dataset["temp"][0], dtype=np.float32)
        zeta = np.asarray(dataset["zeta"][0], dtype=np.float64)
        sigma = np.asarray(dataset["siglay"], dtype=np.float64) if include_sigma else None
        interfaces = np.asarray(dataset["siglev"], dtype=np.float64) if include_sigma else None
        byte_count = temp.nbytes + zeta.nbytes
        if sigma is not None:
            byte_count += sigma.nbytes + interfaces.nbytes
        return temp, zeta, sigma, interfaces, byte_count
    finally:
        dataset.close()
        stream.close()


class LakeModel:
    """One model cycle: static grid (lat/lon, water mask, depth) + hourly surface temps."""

    def __init__(self, model, cycle: datetime, distribution: str = "auto"):
        if distribution not in ("auto", "thredds", "nodd"):
            raise ValueError(f"unsupported NOAA distribution {distribution!r}")
        self.model = model
        self.cycle = cycle
        self.distribution = THREDDS_DISTRIBUTION
        self._aws = False
        self._depth_levels_m = None
        self._aws_sigma_layers = None
        self._aws_sigma_interfaces = None
        try:
            if distribution == "nodd":
                raise DepthDataUnavailable("NODD explicitly selected")
            raw = parse_dods(net.fetch(
                dataset_url(model, cycle, 0) + ".dods?Latitude,Longitude,mask,h",
                timeout=120,
            ))
            lat = raw["Latitude"].astype(np.float64)
            lon = raw["Longitude"].astype(np.float64)
            lon = np.where(lon > 180, lon - 360, lon)
            self.shape = lat.shape
            mask = raw["mask"] > 0.5
            h = raw["h"].astype(np.float64)
            ok = mask & np.isfinite(lat) & np.isfinite(lon) & (np.abs(lat) <= 90)
            self.flat = np.flatnonzero(ok)
            self.lat, self.lon = lat.ravel()[self.flat], lon.ravel()[self.flat]
            depth = h.ravel()[self.flat]
            self.depth_m = np.where(depth > FILL, depth, np.nan)
            self.spacing = (float(np.nanmedian(np.abs(np.diff(lat, axis=0))))
                            if lat.shape[0] > 1 else 0.01)
        except Exception:
            if distribution == "thredds":
                raise
            # NOAA publishes the same operational run through its NODD bucket.
            # Native unstructured fields avoid downloading the much larger 3-D
            # regular-grid files; h5py/fsspec issue range requests for the surface.
            lat, lon, h = _aws_grid(model, cycle)
            lon = np.where(lon > 180, lon - 360, lon)
            ok = (np.isfinite(lat) & np.isfinite(lon) & np.isfinite(h) &
                  (np.abs(lat) <= 90) & (h > 0))
            self.flat = np.flatnonzero(ok)
            self.lat, self.lon = lat.ravel()[self.flat], lon.ravel()[self.flat]
            self.depth_m = h.ravel()[self.flat]
            self.shape = None
            self._aws = True
            self.distribution = NODD_DISTRIBUTION
            if len(self.lat) > 1:
                points = np.column_stack((self.lat, self.lon * np.cos(np.radians(self.lat))))
                distances, _ = cKDTree(points).query(points, k=2)
                self.spacing = float(np.nanmedian(distances[:, 1]))
            else:
                self.spacing = 0.01

    def surface_temp_c(self, hour: int) -> np.ndarray:
        if self._aws:
            t = _aws_surface_temp(self.model, self.cycle, hour).reshape(-1)[self.flat]
            t[(t < -5) | (t > 40)] = np.nan
            return t
        ny, nx = self.shape
        # brackets must be percent-encoded or NOAA's server answers HTTP 400
        q = ".dods?temp" + f"[0:1:0][0:1:0][0:1:{ny - 1}][0:1:{nx - 1}]".replace("[", "%5B").replace("]", "%5D")
        raw = parse_dods(net.fetch(dataset_url(self.model, self.cycle, hour) + q, timeout=180))
        t = raw["temp"].reshape(-1)[self.flat].astype(np.float32)
        t[(t < -5) | (t > 40)] = np.nan
        return t

    def depth_levels_m(self, request_retries=3) -> np.ndarray:
        """Fixed regular-grid z-levels (THREDDS only)."""
        if self._aws:
            raise DepthDataUnavailable(
                f"{self.model['id']} depth is unavailable from NOAA_NODD_AWS"
            )
        if self._depth_levels_m is None:
            raw = parse_dods(net.fetch(
                dataset_url(self.model, self.cycle, 0) + ".dods?Depth",
                timeout=120,
                retries=request_retries,
            ))
            levels = np.asarray(raw["Depth"], np.float64).reshape(-1)
            if (
                levels.size < 2 or not np.all(np.isfinite(levels)) or
                np.any(np.diff(levels) <= 0)
            ):
                raise DepthDataUnavailable(
                    f"{self.model['id']} returned invalid depth levels"
                )
            self._depth_levels_m = levels
        return self._depth_levels_m

    def depth_temperatures_c(self, hour: int, depths_ft, request_retries=3) -> tuple[np.ndarray, int]:
        """Interpolate the selected distribution to exact fixed depths."""
        if self._aws:
            temps, zeta, sigma, interfaces, byte_count = _aws_depth_profile(
                self.model, self.cycle, hour, self._aws_sigma_layers is None
            )
            if temps.ndim != 2 or not len(self.flat) or temps.shape[1] <= int(np.max(self.flat)):
                raise DepthDataUnavailable(f"{self.model['id']} returned an invalid NODD temperature shape")
            if sigma is not None:
                if sigma.shape != temps.shape:
                    raise DepthDataUnavailable(f"{self.model['id']} returned an invalid NODD sigma shape")
                if interfaces.shape != (temps.shape[0] + 1, temps.shape[1]):
                    raise DepthDataUnavailable(f"{self.model['id']} returned an invalid NODD sigma-interface shape")
                self._aws_sigma_layers = sigma[:, self.flat]
                self._aws_sigma_interfaces = interfaces[:, self.flat]
            if self._aws_sigma_layers is None or self._aws_sigma_interfaces is None or zeta.size != temps.shape[1]:
                raise DepthDataUnavailable(f"{self.model['id']} returned incomplete NODD depth coordinates")
            values = interpolate_sigma_to_depths(
                temps[:, self.flat],
                self._aws_sigma_layers,
                self.depth_m,
                zeta.reshape(-1)[self.flat],
                feet_to_m(depths_ft),
                self._aws_sigma_interfaces,
            )
            return values, byte_count
        levels = self.depth_levels_m(request_retries=request_retries)
        depths_m = feet_to_m(depths_ft)
        k0, k1 = level_slab(levels, depths_m)
        ny, nx = self.shape
        slab = f"[0:1:0][{k0}:1:{k1}][0:1:{ny - 1}][0:1:{nx - 1}]"
        q = ".dods?temp" + slab.replace("[", "%5B").replace("]", "%5D")
        payload = net.fetch(
            dataset_url(self.model, self.cycle, hour) + q,
            timeout=240,
            retries=request_retries,
        )
        raw = parse_dods(payload)
        temps = raw["temp"].reshape(k1 - k0 + 1, -1)[:, self.flat]
        values = interpolate_to_depths(
            temps,
            levels[k0:k1 + 1],
            self.depth_m,
            depths_m,
        )
        return values, len(payload)


def _distribution_complete(model, cycle, distribution):
    if distribution == "thredds":
        net.fetch(dataset_url(model, cycle, 120) + ".dds", timeout=30, retries=2)
        raw = parse_dods(net.fetch(dataset_url(model, cycle, 0) + ".dods?Depth", timeout=60, retries=2))
        levels = np.asarray(raw.get("Depth"), np.float64).reshape(-1)
        return levels.size >= 2 and np.all(np.isfinite(levels)) and np.all(np.diff(levels) > 0)
    if distribution == "nodd":
        net.head(aws_dataset_url(model, cycle, 0), timeout=15, retries=2)
        net.head(aws_dataset_url(model, cycle, 120), timeout=15, retries=2)
        return True
    raise ValueError(f"unsupported NOAA distribution {distribution!r}")


def select_depth_distribution(cycles, requested="auto", validated_models=NODD_DEPTH_VALIDATED_MODELS):
    """Choose one readable distribution for every model in a coherent cycle."""
    if requested not in ("auto", "thredds", "nodd"):
        raise ValueError(f"unsupported NOAA distribution {requested!r}")
    required = {model["id"] for model in OFS_MODELS}
    if set(cycles) != required or len(set(cycles.values())) != 1:
        raise DepthDataUnavailable("depth source selection requires one cycle for all four NOAA models")
    failures = {}
    choices = ("thredds", "nodd") if requested == "auto" else (requested,)
    for distribution in choices:
        if distribution == "nodd" and not required.issubset(set(validated_models)):
            missing = sorted(required - set(validated_models))
            failures[distribution] = f"unvalidated models: {', '.join(missing)}"
            continue
        unavailable = []
        for model in OFS_MODELS:
            try:
                if not _distribution_complete(model, cycles[model["id"]], distribution):
                    unavailable.append(model["id"])
            except Exception:
                unavailable.append(model["id"])
        if not unavailable:
            return distribution
        failures[distribution] = f"unavailable models: {', '.join(unavailable)}"
    detail = "; ".join(f"{name}: {reason}" for name, reason in failures.items())
    raise DepthDataUnavailable(f"no coherent validated depth source ({detail})")


def prepare_regridders(cycles, grid, targets, water, log, distribution="auto"):
    """Create the lake-model/regridder set shared by surface and depth."""
    sources = []
    for model in OFS_MODELS:
        cycle = cycles.get(model["id"])
        if cycle is None:
            continue
        lm = LakeModel(model, cycle, distribution=distribution)
        rg = Regridder(
            lm.lon,
            lm.lat,
            grid,
            targets,
            radius=0.3,
            max_edge=4 * max(lm.spacing, 0.005),
        )
        grid_mask = np.isfinite(rg.apply(np.ones(len(lm.lat), np.float32))) & water
        sources.append({
            "model": model,
            "lm": lm,
            "rg": rg,
            "q": rg.quality_grid(),
            "gridMask": grid_mask,
            "gridCoverageMin": 1.0,
        })
        log(
            f"{model['id']}: cycle {cycle_id(cycle)}, {len(lm.lat):,} "
            f"water points, {int(grid_mask.sum()):,} map cells"
        )
    return sources


def fetch_all_hours(lm: LakeModel, hours, workers=6):
    """{hour: temps °C at the model's water points} (missing hours are left out)."""
    def one(h):
        try:
            return h, lm.surface_temp_c(h)
        except Exception as err:  # keep going; the hour becomes a gap
            print(f"  {lm.model['id']} f{h:03d} failed: {err}")
            return h, None
    with ThreadPoolExecutor(workers) as pool:
        return {h: v for h, v in pool.map(one, hours) if v is not None}


def cycle_id(cycle: datetime) -> str:
    return cycle.strftime("%Y-%m-%dT%H:00:00Z")
