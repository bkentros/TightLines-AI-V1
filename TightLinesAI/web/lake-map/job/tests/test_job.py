"""Data job tests on synthetic NOAA / GLWU / Open-Meteo responses (no network).

Run:  python -m unittest discover -s job/tests   (from web/lake-map)
"""
import json
import os
import re
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch
from urllib.parse import parse_qs, urlparse

import numpy as np

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import build  # noqa: E402
from lakemap import dap, encode, gfs, net, ofs, regrid, store, waves, wind  # noqa: E402
from lakemap.config import (DOMAIN, OPEN_METEO_MAX_RUNS_PER_DAY,
                            OPEN_METEO_MONTHLY_CALL_BUDGET, TEMP, WAVES, WIND,
                            WIND_LAKES)  # noqa: E402

NOW = datetime(2026, 9, 30, 15, 30, tzinfo=timezone.utc)
CYCLE = datetime(2026, 9, 30, 12, tzinfo=timezone.utc)
GLWU_CYCLE = datetime(2026, 9, 30, 13, tzinfo=timezone.utc)


class StoreTest(unittest.TestCase):
    def test_account_id_formats_produce_the_same_endpoint(self):
        account_id = "0123456789abcdef0123456789abcdef"
        expected = f"https://{account_id}.r2.cloudflarestorage.com"
        values = (
            account_id,
            f'  "{account_id}"\n',
            expected,
        )
        for value in values:
            with self.subTest(value=value), patch.dict(
                os.environ, {"R2_ACCOUNT_ID": value}
            ):
                self.assertEqual(store.endpoint(), expected)

    def test_upload_retains_existing_r2_objects(self):
        class PutOnlyS3:
            def __init__(self):
                self.keys = []

            def put_object(self, **kwargs):
                self.keys.append(kwargs["Key"])

        s3 = PutOnlyS3()
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp)
            (run_dir / "manifest.json").write_text('{"formatVersion": 1}')
            store.upload_run(s3, run_dir, "test-run", {"run": "test-run"})

        self.assertCountEqual(s3.keys, ["runs/test-run/manifest.json", "latest.json"])

# Fake LMHOFS grid: 0.05° over southern/central Lake Michigan (mask = water everywhere).
LAT = np.arange(46.0, 41.6, -0.05)
LON = np.arange(-88.2, -84.6, 0.05)
LON2, LAT2 = np.meshgrid(LON, LAT)
LUD = (43.95, -86.47)  # Ludington


def model_temp_c(hour):
    """10 °C base + gentle north-south gradient; near Ludington a 9 °C drop from h20 to h40."""
    t = 10 + (LAT2 - 42) * 0.5
    near = np.exp(-(((LAT2 - LUD[0]) / 0.25) ** 2 + ((LON2 - LUD[1]) / 0.35) ** 2))
    drop = np.clip((hour - 20) / 20, 0, 1) * 9
    return (t + 6 - near * drop).astype(np.float32)  # starts ~17 °C (~62 °F) at Ludington


def make_glwu():
    """Builds fixtures/glwu_sample.grib2 (needs the eccodes package; not run by the tests)."""
    import eccodes
    out = b""
    lat1, lat2, lon1, lon2, d = 46.0, 41.6, -88.2, -84.6, 0.1
    ni, nj = int(round((lon2 - lon1) / d)) + 1, int(round((lat1 - lat2) / d)) + 1
    for step in range(0, 124):
        gid = eccodes.codes_grib_new_from_samples("regular_ll_sfc_grib2")
        for k, v in {"discipline": 10, "parameterCategory": 0, "parameterNumber": 3, "typeOfFirstFixedSurface": 1,
                     "Ni": ni, "Nj": nj, "latitudeOfFirstGridPointInDegrees": lat1, "longitudeOfFirstGridPointInDegrees": lon1 + 360,
                     "latitudeOfLastGridPointInDegrees": lat2, "longitudeOfLastGridPointInDegrees": lon2 + 360,
                     "iDirectionIncrementInDegrees": d, "jDirectionIncrementInDegrees": d,
                     "dataDate": int(GLWU_CYCLE.strftime("%Y%m%d")), "dataTime": GLWU_CYCLE.hour * 100, "forecastTime": step}.items():
            eccodes.codes_set(gid, k, v)
        vals = np.full((nj, ni), 0.3 + step * 0.01)  # metres
        eccodes.codes_set(gid, "bitmapPresent", 1)
        eccodes.codes_set(gid, "missingValue", 9999)
        vals[:, :3] = 9999  # a strip of "land"
        eccodes.codes_set_values(gid, vals.ravel())
        out += eccodes.codes_get_message(gid)
        eccodes.codes_release(gid)
    return out


FETCHED = []


def fake_fetch(url, timeout=60, retries=3):
    if "opendap" in url:
        if "/LMHOFS/" not in url or ".t12z.20260930." not in url:
            raise net.HttpError(404, url)
        if url.endswith(".dds"):
            return b"Dataset {} ok;"
        if "Latitude,Longitude,mask,h" in url:
            return dap.encode_dods({"Latitude": LAT2.astype(np.float64), "Longitude": (LON2 + 360).astype(np.float64),
                                    "mask": np.ones_like(LAT2), "h": np.full_like(LAT2, 80.0)})
        hour = int(re.search(r"\.f(\d{3})\.nc", url).group(1))
        return dap.encode_dods({"temp": model_temp_c(hour)[None, None]})
    if "filter_glwu" in url:
        if f"t{GLWU_CYCLE:%H}z" not in url or GLWU_CYCLE.strftime("%Y%m%d") not in url:
            raise net.HttpError(404, url)
        return (Path(__file__).parent / "fixtures" / "glwu_sample.grib2").read_bytes()
    if "filter_gfs" in url:
        q = parse_qs(urlparse(url).query)
        if q["dir"][0] != "/gfs.20260930/12/atmos":
            raise net.HttpError(404, url)
        FETCHED.append(int(q["file"][0][-3:]))
        return (Path(__file__).parent / "fixtures" / "gfs_wind_sample.grib2").read_bytes()  # 10 mph from the west
    if "open-meteo" in url:
        q = parse_qs(urlparse(url).query)
        lats = q["latitude"][0].split(",")
        start = datetime.fromisoformat(q["start_hour"][0]).replace(tzinfo=timezone.utc)
        assert start == CYCLE, start
        n = 121
        return json.dumps([{"hourly": {"time": [], "wind_speed_10m": [10.0] * n,
                                       "wind_direction_10m": [270.0] * n}} for _ in lats]).encode()  # from the west
    raise AssertionError("unexpected url " + url)


class DapTest(unittest.TestCase):
    def test_round_trip(self):
        a = np.arange(12, dtype=np.float32).reshape(1, 1, 3, 4)
        b = np.linspace(40, 41, 6).reshape(2, 3)
        out = dap.parse_dods(dap.encode_dods({"temp": a, "Latitude": b}))
        np.testing.assert_array_equal(out["temp"], a)
        np.testing.assert_allclose(out["Latitude"], b)


class RegridTest(unittest.TestCase):
    def test_no_blending_across_a_peninsula(self):
        # two strips of water separated by 0.3° of land; values 50 and 70
        ys = np.arange(43.0, 44.0, 0.01)
        west = [(x, y) for x in np.arange(-87.0, -86.9, 0.01) for y in ys]
        east = [(x, y) for x in np.arange(-86.6, -86.5, 0.01) for y in ys]
        pts = np.array(west + east)
        vals = np.array([50.0] * len(west) + [70.0] * len(east))
        targets = np.zeros((TEMP.height, TEMP.width), bool)
        targets[:, :] = True
        rg = regrid.Regridder(pts[:, 0], pts[:, 1], TEMP, targets, radius=0.1, max_edge=0.04)
        g = rg.apply(vals)
        j = int(round((DOMAIN["north"] - 43.5) / TEMP.res))
        mid = int(round((-86.75 - DOMAIN["west"]) / TEMP.res))
        self.assertTrue(np.isnan(g[j, mid]) or g[j, mid] in (50.0, 70.0), g[j, mid])
        self.assertAlmostEqual(float(g[j, int(round((-86.95 - DOMAIN["west"]) / TEMP.res))]), 50.0, places=3)

    def test_water_mask_has_the_lakes(self):
        m = regrid.water_mask(TEMP, build.GEO_PATH)
        at = lambda lat, lon: m[int(round((DOMAIN["north"] - lat) / TEMP.res)), int(round((lon - DOMAIN["west"]) / TEMP.res))]
        self.assertTrue(at(43.5, -87.0))    # Lake Michigan
        self.assertTrue(at(47.5, -87.5))    # Lake Superior
        self.assertFalse(at(43.0, -85.0))   # Lower Michigan (land)


class CycleTest(unittest.TestCase):
    def test_candidates(self):
        c = ofs.cycle_candidates(NOW, 12)
        self.assertEqual(c[0], CYCLE)
        self.assertEqual(c[1], CYCLE - timedelta(hours=6))
        self.assertTrue(all(x.hour in (1, 7, 13, 19) for x in waves.cycle_candidates(NOW)))

    def test_workflow_checks_noaa_release_windows_without_exceeding_budget(self):
        root_workflow = JOB.parents[3] / ".github/workflows/lake-map-data.yml"
        mirror_workflow = JOB / "lake-map-data.workflow.yml"
        root_text = root_workflow.read_text()
        self.assertEqual(root_text, mirror_workflow.read_text())
        crons = re.findall(r'cron:\s*"([^"]+)"', root_text)
        self.assertEqual(crons, ["45 2,8,14,20 * * *", "0,15,30,45 3,9,15,21 * * *", "0 4,10,16,22 * * *"])
        scheduled_checks = sum(len(cron.split()[0].split(",")) * len(cron.split()[1].split(",")) for cron in crons)
        self.assertEqual(scheduled_checks, 24)  # six 15-minute checks around each of four releases
        self.assertEqual(4, OPEN_METEO_MAX_RUNS_PER_DAY)  # one coherent publication per NOAA cycle

    def test_publication_requires_every_model_on_the_same_cycle(self):
        complete = {model["id"]: CYCLE for model in build.OFS_MODELS}
        status = build.publication_readiness(complete, NOW)
        self.assertEqual(status[0], "complete")

        delayed = dict(complete)
        delayed["LSOFS"] = CYCLE - timedelta(hours=6)
        self.assertIsNone(build.publication_readiness(delayed, CYCLE + timedelta(hours=3, minutes=44)))
        self.assertIsNone(build.publication_readiness(delayed, CYCLE + timedelta(hours=12)))

        primary_delayed = dict(complete)
        primary_delayed["LMHOFS"] = CYCLE - timedelta(hours=6)
        self.assertIsNone(build.publication_readiness(primary_delayed, CYCLE + timedelta(hours=4)))
        all_old = {model["id"]: CYCLE - timedelta(hours=6) for model in build.OFS_MODELS}
        self.assertIsNone(build.publication_readiness(all_old, CYCLE + timedelta(hours=4)))

    def test_temperature_integrity_rejects_missing_malformed_and_corrupt_hours(self):
        good = {hour: np.full(20, 55.0, np.float32) for hour in range(121)}
        self.assertEqual(build.validate_temperature_hours("LMHOFS", good, 20), 1.0)

        missing = dict(good)
        del missing[87]
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "missing 1 hour"):
            build.validate_temperature_hours("LMHOFS", missing, 20)

        malformed = dict(good)
        malformed[12] = np.full(19, 55.0, np.float32)
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "expected 20"):
            build.validate_temperature_hours("LMHOFS", malformed, 20)

        corrupt = dict(good)
        corrupt[44] = np.full(20, np.nan, np.float32)
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "source coverage"):
            build.validate_temperature_hours("LMHOFS", corrupt, 20)

    def test_temperature_build_rejects_missing_or_mixed_model_cycles_before_download(self):
        complete = {model["id"]: CYCLE for model in build.OFS_MODELS}
        missing = dict(complete)
        del missing["LOOFS"]
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "model set is incomplete"):
            build.build_temperature(missing, CYCLE, lambda _: None, 1)

        mixed = dict(complete)
        mixed["LSOFS"] = CYCLE - timedelta(hours=6)
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "cycles do not match"):
            build.build_temperature(mixed, CYCLE, lambda _: None, 1)

    def test_regridded_hour_requires_nearly_complete_lake_domain(self):
        expected = np.ones((10, 10), bool)
        good = np.full((10, 10), 55.0, np.float32)
        self.assertEqual(build.validate_grid_hour("LMHOFS", 0, good, expected), 1.0)
        good[:2] = np.nan
        with self.assertRaisesRegex(build.TemperatureIntegrityError, "map coverage"):
            build.validate_grid_hour("LMHOFS", 0, good, expected)

    def test_force_never_bypasses_same_cycle_gate(self):
        def discover(model, now):
            return CYCLE - timedelta(hours=6) if model["id"] == "LSOFS" else CYCLE
        with tempfile.TemporaryDirectory() as tmp, patch.object(build.ofs, "discover", discover):
            rc = build.main(["--out", tmp, "--now", NOW.isoformat(), "--force"])
            self.assertEqual(rc, 0)
            self.assertFalse((Path(tmp) / "latest.json").exists())

    def test_integrity_failure_leaves_previous_pointer_untouched(self):
        with tempfile.TemporaryDirectory() as tmp:
            latest = Path(tmp) / "latest.json"
            latest.write_text('{"run":"known-good"}')
            with patch.object(build.ofs, "discover", return_value=CYCLE), patch.object(
                build, "build_temperature", side_effect=build.TemperatureIntegrityError("corrupt hour")
            ):
                rc = build.main(["--out", tmp, "--now", NOW.isoformat(), "--force"])
            self.assertEqual(rc, 2)
            self.assertEqual(json.loads(latest.read_text())["run"], "known-good")


class FullRunTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        net.fetch = fake_fetch
        gfs.PAUSE = 0
        cls.out = Path(tempfile.mkdtemp())
        lmhofs = [model for model in build.OFS_MODELS if model["id"] == "LMHOFS"]
        with patch.object(build, "OFS_MODELS", lmhofs):
            rc = build.main(["--out", str(cls.out), "--now", NOW.isoformat(), "--force"])
        assert rc == 0
        cls.latest = json.loads((cls.out / "latest.json").read_text())
        cls.rdir = cls.out / "runs" / cls.latest["run"]
        cls.manifest = json.loads((cls.rdir / "manifest.json").read_text())

    def cell(self, grid, lat, lon):
        return int(round((DOMAIN["north"] - lat) / grid.res)), int(round((lon - DOMAIN["west"]) / grid.res))

    def test_manifest(self):
        m = self.manifest
        self.assertEqual(m["formatVersion"], 1)
        self.assertFalse(m["sample"])
        self.assertEqual(m["cycle"], "2026-09-30T12:00:00Z")
        self.assertEqual(len(m["frames"]), 121)
        self.assertEqual(m["frames"][5]["validTime"], "2026-09-30T17:00:00Z")
        self.assertEqual(m["grids"]["temp"]["width"], 1661)
        self.assertEqual([s["model"] for s in m["sources"]["temp"]], ["LMHOFS"])
        self.assertEqual(m["sources"]["temp"][0]["hoursReceived"], 121)
        self.assertGreaterEqual(m["sources"]["temp"][0]["sourceCoverageMin"], 0.98)
        self.assertGreaterEqual(m["sources"]["temp"][0]["gridCoverageMin"], 0.97)
        self.assertEqual(m["sources"]["waves"]["cycle"], "2026-09-30T13:00:00Z")
        for f in m["frames"][:3]:
            for k in ("temp", "wind", "waves"):
                self.assertTrue((self.rdir / f[k]).exists())

    def test_temperature_values_and_nodata(self):
        g = encode.decode_scalar((self.rdir / "temp/000.png").read_bytes(), TEMP)
        j, i = self.cell(TEMP, 43.0, -87.2)
        want_f = (10 + (43.0 - 42) * 0.5 + 6) * 9 / 5 + 32
        self.assertAlmostEqual(float(g[j, i]), want_f, delta=0.25)
        j, i = self.cell(TEMP, 47.5, -87.5)  # Lake Superior: no model in this test → no data
        self.assertTrue(np.isnan(g[j, i]))
        j, i = self.cell(TEMP, 43.0, -85.0)  # inland Michigan → no data
        self.assertTrue(np.isnan(g[j, i]))

    def test_frames_are_small(self):
        biggest = max((self.rdir / "temp" / f"{h:03d}.png").stat().st_size for h in range(121))
        self.assertLess(biggest, 250 * 1024)

    def test_waves_and_wind(self):
        g = encode.decode_scalar((self.rdir / "waves/002.png").read_bytes(), WAVES)
        j, i = self.cell(WAVES, 43.0, -87.2)
        # t0 = 12Z; hour 2 = 14Z = GLWU (13Z) step 1 → 0.31 m
        self.assertAlmostEqual(float(g[j, i]), 0.31 * 3.28084, delta=0.06)
        from PIL import Image
        import io
        w = np.asarray(Image.open(io.BytesIO((self.rdir / "wind/010.png").read_bytes())))
        u = (w[..., 0].astype(float) - 128) / 2
        v = (w[..., 1].astype(float) - 128) / 2
        self.assertAlmostEqual(float(np.median(u)), 10.0, delta=0.5)  # west wind blows toward the east
        self.assertAlmostEqual(float(np.median(v)), 0.0, delta=0.5)
        self.assertEqual(w.shape[:2], (WIND.height, WIND.width))

    def test_wide_wind(self):
        from PIL import Image
        import io
        m = self.manifest["grids"]["wind"]
        self.assertEqual((m["width"], m["height"], m["west"], m["north"]), (163, 121, -104.4, 60.2))
        self.assertEqual(self.manifest["sources"]["wind"]["surroundings"]["model"], "GFS 0.25°")
        w = np.asarray(Image.open(io.BytesIO((self.rdir / "wind/030.png").read_bytes())))
        u = (w[..., 0].astype(float) - 128) / 2
        self.assertAlmostEqual(u[4, 4], 10.0, delta=0.5)          # far corner (GFS)
        self.assertAlmostEqual(u[-5, -5], 10.0, delta=0.5)
        self.assertTrue(set(FETCHED) <= set(range(0, 124, 3)))    # 3-hourly steps only

    def test_cold_water_surge_detected_at_ludington(self):
        ev = json.loads((self.rdir / "events.json").read_text())
        self.assertEqual(ev["rule"], "piercast-surge-v1")
        lud = [e for e in ev["events"] if e["cityId"] == "ludington_mi"]
        self.assertEqual(len(lud), 1, ev)
        self.assertEqual(lud[0]["kind"], "cold")
        self.assertGreaterEqual(lud[0]["sizeF"], 10)
        self.assertLessEqual(lud[0]["endF"], 60)
        far = [e for e in ev["events"] if e["cityId"] in ("chicago_il", "michigan_city_in")]
        self.assertEqual(far, [])


if __name__ == "__main__":
    unittest.main()


class WindMergeTest(unittest.TestCase):
    def test_open_meteo_schedule_stays_inside_commercial_budget(self):
        self.assertEqual(wind.calls_per_run(), 2_211)
        self.assertEqual(wind.projected_monthly_calls(), 274_164)
        self.assertLess(wind.projected_monthly_calls(), OPEN_METEO_MONTHLY_CALL_BUDGET)

    def test_lake_wind_kept_inside_and_blended_at_edge(self):
        h = 2
        ul = np.full((h, WIND_LAKES.height, WIND_LAKES.width), 20.0, np.float32)
        uw = np.full((h, WIND.height, WIND.width), 4.0, np.float32)
        U, V = gfs.merge(ul, ul * 0, uw, uw * 0)
        r0, c0 = 44, 48
        self.assertAlmostEqual(float(U[0, r0 + 10, c0 + 10]), 20.0)   # inside: Open-Meteo
        self.assertAlmostEqual(float(U[0, 3, 3]), 4.0)                # outside: GFS
        self.assertTrue(4.0 < float(U[0, r0, c0 + 10]) < 20.0)        # edge: blended

    def test_without_gfs_edges_are_carried_out(self):
        ul = np.full((1, WIND_LAKES.height, WIND_LAKES.width), 7.0, np.float32)
        U, V = gfs.merge(ul, ul * 0)
        self.assertEqual(U.shape[1:], (WIND.height, WIND.width))
        self.assertTrue(np.allclose(U, 7.0))

    def test_steps(self):
        self.assertEqual(gfs.steps_for(0, 121), list(range(0, 121, 3)))
        self.assertEqual(gfs.steps_for(4, 121)[0], 3)
        self.assertEqual(gfs.steps_for(4, 121)[-1], 126)
