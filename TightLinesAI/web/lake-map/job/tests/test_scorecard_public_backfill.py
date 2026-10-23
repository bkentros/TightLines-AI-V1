import io
import json
import os
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from datetime import date, datetime, timezone
from pathlib import Path
from unittest import mock

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard
import scorecard_public_backfill as backfill
import scorecard_schema


class FakeSampler:
    def __init__(self, available=True, source_kind="native"):
        self.available = available
        self.source_kind = source_kind

    def locate(self, _model, _cycle, _observation):
        return {
            "node": 7, "modelLat": 43.0, "modelLon": -86.0,
            "modelDistanceKm": 0.4, "bottomM": 20.0,
            "levelsM": [0.5 + value for value in range(20)],
            "sourceKind": self.source_kind,
        }

    def profiles(self, _model, _cycle, _hour, nodes):
        return {node: [20.0 - value * 0.25 for value in range(20)] for node in nodes} if self.available else {}


class NotFound(Exception):
    def __init__(self):
        self.response = {
            "Error": {"Code": "404"},
            "ResponseMetadata": {"HTTPStatusCode": 404},
        }


def observation(depth, parameter):
    observed = datetime(2026, 10, 1, tzinfo=timezone.utc)
    return backfill._observation(
        "glos:49", "Muskegon Buoy", "GLOS Seagull", "lake-michigan", "moored_buoy",
        43.179, -86.361, observed, 62.0, depth, parameter, "good",
    )


class PublicBackfillTest(unittest.TestCase):
    def test_worker_limit_only_reduces_concurrency(self):
        with mock.patch.dict(os.environ, {"SCORECARD_BACKFILL_MAX_WORKERS": "2"}):
            self.assertEqual(backfill.worker_limit(4), 2)
            self.assertEqual(backfill.worker_limit(8), 2)
        with mock.patch.dict(os.environ, {"SCORECARD_BACKFILL_MAX_WORKERS": "99"}):
            self.assertEqual(backfill.worker_limit(4), 4)
        with mock.patch.dict(os.environ, {"SCORECARD_BACKFILL_MAX_WORKERS": "invalid"}):
            self.assertEqual(backfill.worker_limit(4), 4)

    def test_retired_glos_variable_is_accounted_as_empty_not_fetch_error(self):
        error = backfill.urllib.error.HTTPError(
            "https://public.invalid", 400, "Bad Request", {},
            io.BytesIO(b'Error { message="Unrecognized variable=temperature"; }'),
        )
        with tempfile.TemporaryDirectory() as temporary, \
                mock.patch.object(backfill.urllib.request, "urlopen", side_effect=error):
            cache = backfill.PublicCache(temporary)
            self.assertIsNone(cache.get("retired.csv", "https://public.invalid", quiet=True))
            self.assertFalse(cache.outcome("retired.csv")["error"])
            self.assertTrue(cache.outcome("retired.csv")["notFound"])
        error.close()

    def test_dense_glos_dataset_uses_week_slices(self):
        start = datetime(2025, 5, 1, tzinfo=timezone.utc)
        end = datetime(2025, 5, 31, 23, 59, 59, tzinfo=timezone.utc)
        active = [{
            "obs_dataset_id": "74",
            "parameters": [{"parameter_id": str(value)} for value in range(10)],
        }]
        cache = mock.Mock()
        cache.get.side_effect = [json.dumps(active).encode(), *([None] * 50)]
        cache.outcome.return_value = {"error": False, "notFound": True}
        datasets = {"74": {"name": "Dense", "body": "lake-ontario", "type": "moored_buoy"}}
        parameters = {
            str(value): {"name": f"temperature_{value}", "depthM": value}
            for value in range(10)
        }

        backfill.collect_glos(cache, start, end, datasets, parameters)

        # One catalog request plus 10 parameters x five seven-day slices.
        self.assertEqual(cache.get.call_count, 51)
        source_names = [call.args[0] for call in cache.get.call_args_list[1:]]
        self.assertEqual(sum("20250501-20250507" in name for name in source_names), 10)
        self.assertTrue(any("20250529-20250531" in name for name in source_names))

    def test_invalid_public_model_object_is_treated_as_unavailable(self):
        sampler = backfill.PublicModelSampler.__new__(backfill.PublicModelSampler)
        stream = io.BytesIO(b"not-a-netcdf-file")
        sampler.fs = mock.Mock()
        sampler.fs.exists.return_value = True
        sampler.fs.open.return_value = stream
        sampler.h5py = mock.Mock()
        sampler.h5py.File.side_effect = OSError("invalid signature")
        sampler.netcdf_file = mock.Mock()
        self.assertEqual(sampler._open("bad.nc"), (None, None))
        self.assertTrue(stream.closed)

    def test_grid_reads_classic_netcdf_variables(self):
        class ClassicVariable:
            def __init__(self, values):
                self.values = backfill.np.asarray(values)

            def __getitem__(self, key):
                return self.values[key]

        sampler = backfill.PublicModelSampler.__new__(backfill.PublicModelSampler)
        sampler.grids = {}
        dataset = mock.Mock(spec=["variables", "close"])
        dataset.variables = {
            "lat": ClassicVariable([43.0]), "lon": ClassicVariable([-86.0]),
            "h": ClassicVariable([10.0]),
            "siglay": ClassicVariable([[-0.25], [-0.75]]),
        }
        stream = io.BytesIO(b"CDF\x01")
        sampler._open = mock.Mock(return_value=(stream, dataset))
        with tempfile.TemporaryDirectory() as temporary:
            sampler.cache_root = Path(temporary)
            grid = sampler.grid("lmofs", datetime(2024, 5, 1, tzinfo=timezone.utc))
        self.assertEqual(grid["bottom"].tolist(), [10.0])
        dataset.close.assert_called_once_with()
        self.assertTrue(stream.closed)

    def test_profiles_read_classic_netcdf_variables(self):
        sampler = backfill.PublicModelSampler.__new__(backfill.PublicModelSampler)
        sampler.source_kind = mock.Mock(return_value="native")
        dataset = mock.Mock(spec=["variables", "close"])
        dataset.variables = {"temp": backfill.np.asarray([[[4.0], [5.0]]])}
        stream = io.BytesIO(b"CDF\x01")
        sampler._open = mock.Mock(return_value=(stream, dataset))
        result = sampler.profiles(
            "lmofs", datetime(2024, 5, 1, tzinfo=timezone.utc), 0, {0},
        )
        self.assertEqual(result[0].tolist(), [4.0, 5.0])
        dataset.close.assert_called_once_with()
        self.assertTrue(stream.closed)

    def test_skip_existing_r2_works_without_local_checkpoint(self):
        s3 = mock.Mock()
        s3.head_object.return_value = {}
        with tempfile.TemporaryDirectory() as temporary, \
                mock.patch.dict(os.environ, {
                    "R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "access",
                    "R2_SECRET_ACCESS_KEY": "secret", "R2_BUCKET": "test-bucket",
                }, clear=False), \
                mock.patch.object(backfill, "load_catalogs", return_value=({}, {}, {})), \
                mock.patch.object(backfill, "PublicModelSampler"), \
                mock.patch("lakemap.store.client", return_value=s3), \
                mock.patch.object(backfill.scorecard_store, "write_fragment") as write_fragment, \
                redirect_stdout(io.StringIO()) as output:
            result = backfill.main([
                "--start", "2023-11-20", "--end", "2023-11-20",
                "--cache", temporary, "--sources", "", "--store", "--skip-existing-r2",
            ])
        self.assertEqual(result, 0)
        self.assertIn("day=2023-11-20 status=r2_skip", output.getvalue())
        s3.head_object.assert_called_once_with(
            Bucket="test-bucket",
            Key="private/scorecard/v1/samples/stream=backfill/_done/v2/date=2023-11-20.json",
        )
        write_fragment.assert_not_called()

    def test_absent_r2_marker_processes_day(self):
        s3 = mock.Mock()
        s3.head_object.side_effect = NotFound()
        manifest = {
            "stream": "backfill", "date": "2023-11-21", "rowCount": 0,
            "evidenceSha256": "a" * 64,
            "key": "private/scorecard/v1/samples/stream=backfill/date=2023-11-21/a.parquet",
        }
        with tempfile.TemporaryDirectory() as temporary, \
                mock.patch.dict(os.environ, {
                    "R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "access",
                    "R2_SECRET_ACCESS_KEY": "secret", "R2_BUCKET": "test-bucket",
                }, clear=False), \
                mock.patch.object(backfill, "load_catalogs", return_value=({}, {}, {})), \
                mock.patch.object(backfill, "PublicModelSampler"), \
                mock.patch("lakemap.store.client", return_value=s3), \
                mock.patch.object(backfill.scorecard_store, "write_fragment",
                                  return_value=manifest) as write_fragment, \
                mock.patch.object(backfill.scorecard_store, "write_done_marker") as marker, \
                redirect_stdout(io.StringIO()) as output:
            result = backfill.main([
                "--start", "2023-11-21", "--end", "2023-11-21",
                "--cache", temporary, "--sources", "", "--store", "--skip-existing-r2",
            ])
        self.assertEqual(result, 0)
        self.assertIn("day=2023-11-21 status=stored records=0", output.getvalue())
        write_fragment.assert_called_once()
        marker.assert_called_once()

    def test_glos_kelvin_and_celsius_fill_values_are_provider_missing(self):
        for value in (-999.0, -9999.0, 999.0, 9999.0,
                      -999.0 + 273.15, -999.0 - 273.15,
                      999.0 + 273.15, 999.0 - 273.15, 9.96921e36):
            self.assertTrue(backfill.glos_temperature_is_missing(str(value), value))
        self.assertTrue(backfill.glos_temperature_is_missing("NaN", float("nan")))
        self.assertFalse(backfill.glos_temperature_is_missing("274.15", 274.15))
        self.assertFalse(backfill.glos_temperature_is_missing("20.0", 20.0))

    def test_current_year_historical_month_uses_monthly_archive_not_realtime(self):
        sources = backfill._ndbc_sources(
            "45002",
            datetime(2026, 5, 1, tzinfo=timezone.utc),
            datetime(2026, 5, 31, tzinfo=timezone.utc),
            date(2026, 10, 6),
        )
        self.assertEqual(len(sources), 1)
        self.assertEqual(sources[0][0], "ndbc-45002-2026-05-direct.txt.gz")
        self.assertEqual(
            sources[0][1],
            "https://www.ndbc.noaa.gov/data/stdmet/May/4500252026.txt.gz",
        )
        self.assertNotIn("realtime2", sources[0][1])

    def test_current_month_uses_realtime_ndbc_source(self):
        sources = backfill._ndbc_sources(
            "45002",
            datetime(2026, 10, 1, tzinfo=timezone.utc),
            datetime(2026, 10, 6, tzinfo=timezone.utc),
            date(2026, 10, 6),
        )
        self.assertEqual(sources, [(
            "ndbc-45002-2026-realtime.txt",
            "https://www.ndbc.noaa.gov/data/realtime2/45002.txt",
        )])

    def test_catalog_json_parser(self):
        text = 'export const A={"1":{"name":"x"}};\nexport const B={"2":{"name":"y"}};\n'
        self.assertEqual(backfill._json_export(text, "A", "B")["1"]["name"], "x")
        self.assertEqual(backfill._json_export(text, "B")["2"]["name"], "y")

    def test_nearest_observation_uses_half_hour_guard(self):
        row = observation(1.0, 1)
        self.assertEqual(backfill.nearest_observations([row], row["observed"]), [row])
        self.assertEqual(backfill.nearest_observations([row], row["observed"].replace(hour=1)), [])

    def test_precycle_observation_uses_preceding_forecast_cycle(self):
        row = observation(1.0, 1)
        observed = datetime(2026, 10, 1, 11, 50, tzinfo=timezone.utc)
        row.update({"observed": observed, "waterTime": backfill.iso(observed),
                    "firstCollected": observed})
        pairs = backfill.build_pairs(date(2026, 10, 1), [row], FakeSampler())
        self.assertEqual(len(pairs), 1)
        self.assertEqual(pairs[0]["cycle"], "2026-10-01T00:00:00Z")
        self.assertAlmostEqual(pairs[0]["leadHour"], 11 + 50 / 60)

    def test_surface_and_deep_rows_validate(self):
        pairs = backfill.build_pairs(date(2026, 10, 1), [observation(1.0, 1), observation(5.0, 2)], FakeSampler())
        self.assertEqual(len(pairs), 2)
        by_depth = {pair["sensorDepthM"]: pair for pair in pairs}
        self.assertEqual(by_depth[1.0]["depthMethod"], "surface_layer")
        self.assertEqual(by_depth[5.0]["depthMethod"], "interpolated_3d")
        self.assertTrue(all(pair["pairStatus"] == "paired" for pair in pairs))
        records = scorecard.records_from_evidence(
            {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": pairs},
            "public-backfill/v1/2026-10-01.json", "0" * 64,
        )
        self.assertEqual(scorecard_schema.validate_records(records)["invalidRows"], 0)

    def test_missing_deep_field_stays_pending(self):
        pairs = backfill.build_pairs(date(2026, 10, 1), [observation(5.0, 2)], FakeSampler(False))
        self.assertEqual(pairs[0]["pairStatus"], "pending_3d")
        self.assertIsNone(pairs[0]["forecastF"])

    def test_nonfinite_position_is_uncovered_without_fabricated_coordinates(self):
        row = observation(1.0, 1)
        row["lat"] = None
        row["lon"] = None
        row["qualityFlags"] = ["invalid_position"]
        pairs = backfill.build_pairs(date(2026, 10, 1), [row], FakeSampler())
        self.assertEqual(len(pairs), 1)
        pair = pairs[0]
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])
        self.assertIsNone(pair["stationLat"])
        self.assertIsNone(pair["stationLon"])
        self.assertIsNone(pair["modelLat"])
        self.assertIsNone(pair["modelLon"])
        self.assertIn("invalid_position", pair["qualityFlags"])
        records = scorecard.records_from_evidence(
            {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": pairs},
            "public-backfill/v1/2026-10-01.json", "0" * 64,
        )
        self.assertEqual(scorecard_schema.validate_records(records)["invalidRows"], 0)

    def test_observation_normalizes_nonfinite_coordinates_to_null(self):
        row = backfill._observation(
            "glos:bad", "Bad Position", "GLOS Seagull", "lake-michigan", "moored_buoy",
            float("nan"), float("inf"), datetime(2026, 10, 1, tzinfo=timezone.utc),
            62.0, 1.0, 1, "good",
        )
        self.assertIsNone(row["lat"])
        self.assertIsNone(row["lon"])
        self.assertEqual(row["qualityFlags"], ["invalid_position"])

    def test_quarantine_summary_counts_rows_without_dumping_source_values(self):
        records = [{"quality_flags": ["invalid_position"]}, {"quality_flags": []}]
        self.assertEqual(backfill.quarantine_summary(records, {"impossible_temperature": 1}), {
            "count": 1, "total": 2, "fraction": 1 / 2,
            "reasons": {"invalid_position": 1},
        })

    def test_invalid_position_station_day_is_stored_non_strict_and_not_paused(self):
        records = [
            {
                "station_id": "glos:709", "quality_flags": ["invalid_position"],
                "strict_quality": True,
            }
            for _ in range(4)
        ] + [{"station_id": "glos:other", "quality_flags": [], "strict_quality": True}]
        result = backfill.apply_invalid_position_station_day(records)
        self.assertEqual(result, {"stations": 1, "records": 4, "applied": True})
        for record in records[:4]:
            self.assertIn("invalid_position", record["quality_flags"])
            self.assertIn("invalid_position_station_day", record["quality_flags"])
            self.assertFalse(record["strict_quality"])
        self.assertEqual(backfill.quarantine_summary(records)["fraction"], 0.0)

    def test_invalid_position_rule_does_not_hide_broad_failure(self):
        records = [
            {"station_id": f"glos:{index}", "quality_flags": ["invalid_position"],
             "strict_quality": True}
            for index in range(4)
        ]
        result = backfill.apply_invalid_position_station_day(records)
        self.assertEqual(result, {"stations": 4, "records": 0, "applied": False})
        self.assertEqual(backfill.quarantine_summary(records)["fraction"], 1.0)

    def test_impossible_reading_flags_station_three_day_window_without_pause(self):
        incident = date(2026, 10, 2)
        rows = []
        for day in (incident - backfill.timedelta(days=1), incident,
                    incident + backfill.timedelta(days=1)):
            for station in ("glos:suspect", "glos:other"):
                row = observation(1.0, 1)
                row.update({
                    "identity": station, "id": station,
                    "observed": datetime.combine(day, datetime.min.time(), timezone.utc),
                    "waterTime": datetime.combine(day, datetime.min.time(), timezone.utc)
                    .isoformat().replace("+00:00", "Z"),
                    "firstCollected": datetime.combine(day, datetime.min.time(), timezone.utc),
                })
                rows.append(row)
        ledger = backfill.SourceQuarantine()
        ledger.add(
            "impossible_temperature",
            datetime.combine(incident, datetime.min.time(), timezone.utc),
            "glos", "moored_buoy", "glos:suspect",
        )
        self.assertEqual(backfill.apply_station_suspect_days(rows, ledger), 3)
        suspect = [row for row in rows if row["identity"] == "glos:suspect"]
        other = [row for row in rows if row["identity"] == "glos:other"]
        self.assertTrue(all("station_suspect_day" in row["qualityFlags"] for row in suspect))
        self.assertTrue(all("station_suspect_day" not in row["qualityFlags"] for row in other))
        pairs = backfill.build_pairs(incident, rows, FakeSampler())
        suspect_pairs = [pair for pair in pairs if pair["station"] == "glos:suspect"]
        self.assertTrue(suspect_pairs)
        self.assertTrue(all(not pair["strict"] for pair in suspect_pairs))
        records = scorecard.records_from_evidence({
            "methodologyVersion": backfill.METHODOLOGY_VERSION, "primaryPairs": pairs,
        })
        summary = backfill.quarantine_summary(records, ledger.day(incident.isoformat()))
        self.assertEqual(summary["count"], 0)
        self.assertLessEqual(summary["fraction"], backfill.MAX_QUARANTINE_FRACTION)

    def test_station_suspect_day_stores_and_collection_is_padded(self):
        target = date(2026, 10, 2)
        captured = {}

        def collect(_cache, start, end, _datasets, _parameters, quarantine, _accounting):
            self.assertEqual(start.date(), target - backfill.timedelta(days=1))
            self.assertEqual(end.date(), target + backfill.timedelta(days=1))
            quarantine.add(
                "impossible_temperature",
                datetime.combine(target, datetime.min.time(), timezone.utc),
                "glos", "moored_buoy", "glos:suspect",
            )
            rows = []
            for observed_day in (target - backfill.timedelta(days=1), target,
                                 target + backfill.timedelta(days=1)):
                for station in ("glos:suspect", "glos:other"):
                    row = observation(1.0, 1)
                    observed = datetime.combine(observed_day, datetime.min.time(), timezone.utc)
                    row.update({
                        "identity": station, "id": station, "observed": observed,
                        "waterTime": observed.isoformat().replace("+00:00", "Z"),
                        "firstCollected": observed,
                    })
                    rows.append(row)
            return rows

        def write_fragment(records, stream, day, digest, **_kwargs):
            captured["records"] = records
            return {
                "stream": stream, "date": day, "rowCount": len(records),
                "evidenceSha256": digest,
                "key": f"private/scorecard/v1/samples/stream=backfill/date={day}/x.parquet",
            }

        with tempfile.TemporaryDirectory() as temporary, \
                mock.patch.dict(os.environ, {
                    "R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "access",
                    "R2_SECRET_ACCESS_KEY": "secret", "R2_BUCKET": "test-bucket",
                }, clear=False), \
                mock.patch.object(backfill, "load_catalogs", return_value=({}, {}, [])), \
                mock.patch.object(backfill, "collect_glos", side_effect=collect), \
                mock.patch.object(backfill, "PublicModelSampler", return_value=FakeSampler()), \
                mock.patch("lakemap.store.client", return_value=mock.Mock()), \
                mock.patch.object(backfill.scorecard_store, "write_fragment",
                                  side_effect=write_fragment), \
                mock.patch.object(backfill.scorecard_store, "write_done_marker") as marker, \
                redirect_stdout(io.StringIO()) as output:
            result = backfill.main([
                "--start", target.isoformat(), "--end", target.isoformat(),
                "--cache", temporary, "--sources", "glos", "--store",
            ])
        self.assertEqual(result, 0)
        self.assertIn(f"day={target} status=stored", output.getvalue())
        self.assertTrue(all(record["observation_time"].startswith(target.isoformat())
                            for record in captured["records"]))
        by_station = {record["station_id"]: record for record in captured["records"]}
        self.assertIn("station_suspect_day", by_station["glos:suspect"]["quality_flags"])
        self.assertFalse(by_station["glos:suspect"]["strict_quality"])
        self.assertNotIn("station_suspect_day", by_station["glos:other"]["quality_flags"])
        marker.assert_called_once()

    def test_cross_network_dedupe_uses_priority_and_stable_physical_key(self):
        observed = datetime(2026, 10, 1, tzinfo=timezone.utc)
        rows = []
        for identity, source, offset in (
                ("glos:1", "GLOS Seagull", 0.002),
                ("coops:1", "NOAA CO-OPS", 0.001),
                ("external:1", "NOAA NDBC", 0.0)):
            rows.append(backfill._observation(
                identity, identity, source, "lake-michigan", "fixed",
                43.0 + offset, -86.0, observed, 62.0, 1.0, quality="provider_qc",
            ))
        first = backfill.dedupe_and_qc(rows)
        second = backfill.dedupe_and_qc(list(reversed(rows)))
        self.assertEqual(len(first), 1)
        self.assertEqual(first[0]["identity"], "external:1")
        self.assertEqual(first[0]["source"], "NOAA NDBC + NOAA CO-OPS + GLOS Seagull")
        self.assertEqual(first[0]["physicalIdentity"], second[0]["physicalIdentity"])
        first_pair = backfill.build_pairs(date(2026, 10, 1), first, FakeSampler())[0]
        second_pair = backfill.build_pairs(date(2026, 10, 1), second, FakeSampler())[0]
        first_record = scorecard.record_from_pair(first_pair, "e", "0" * 64, "v2")
        second_record = scorecard.record_from_pair(second_pair, "e", "0" * 64, "v2")
        self.assertEqual(first_record["sensor_key"], second_record["sensor_key"])

    def test_source_fetch_error_pauses_before_model_work(self):
        target = date(2026, 10, 2)

        def collect(_cache, start, end, _datasets, _parameters, _quarantine, accounting):
            accounting.attempt("glos", "station", start, end)
            accounting.error("glos", "station", start, end)
            return []

        with tempfile.TemporaryDirectory() as temporary, \
                mock.patch.object(backfill, "load_catalogs", return_value=({}, {}, [])), \
                mock.patch.object(backfill, "collect_glos", side_effect=collect), \
                mock.patch.object(backfill, "PublicModelSampler") as sampler, \
                redirect_stdout(io.StringIO()) as output:
            result = backfill.main([
                "--start", target.isoformat(), "--end", target.isoformat(),
                "--cache", temporary, "--sources", "glos",
            ])
        self.assertEqual(result, 5)
        self.assertIn("reason=source_fetch_error", output.getvalue())
        sampler.assert_not_called()

    def test_unrelated_failure_over_two_percent_still_pauses(self):
        records = ([{"quality_flags": []} for _ in range(97)] +
                   [{"quality_flags": ["invalid_position"]} for _ in range(3)])
        summary = backfill.quarantine_summary(records)
        self.assertEqual(summary["fraction"], 0.03)
        self.assertGreater(summary["fraction"], backfill.MAX_QUARANTINE_FRACTION)

    def test_quarantine_report_summary_is_aggregate_and_ranked(self):
        records = [{
            "quality_flags": ["invalid_position"], "observation_source": "GLOS Seagull",
            "station_class": "moored_buoy", "station_id": "glos:49",
        }, {
            "quality_flags": [], "observation_source": "NOAA NDBC",
            "station_class": "offshore_buoy", "station_id": "external:45002",
        }]
        dropped = {
            "reasons": {"impossible_temperature": 2}, "sources": {"ndbc": 2},
            "stationClasses": {"offshore_buoy": 2}, "stations": {"external:45002": 2},
        }
        self.assertEqual(backfill.quarantine_report_summary(records, dropped), {
            "total": 4, "count": 3, "fraction": 0.75,
            "reasons": {"impossible_temperature": 2, "invalid_position": 1},
            "sources": {"glos": 1, "ndbc": 2},
            "stationClasses": {"moored_buoy": 1, "offshore_buoy": 2},
            "topStations": [
                {"id": "external:45002", "count": 2}, {"id": "glos:49", "count": 1},
            ],
        })

    def test_deep_nonfinite_position_is_uncovered_not_surface_paired(self):
        row = observation(5.0, 2)
        row.update({"lat": None, "lon": None, "qualityFlags": ["invalid_position"]})
        pair = backfill.build_pairs(date(2026, 10, 1), [row], FakeSampler())[0]
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["depthMethod"], "pending_3d")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])

    def test_source_quarantine_is_sanitized_and_day_bounded(self):
        ledger = backfill.SourceQuarantine()
        ledger.add("invalid_timestamp")
        ledger.add("impossible_temperature", datetime(2026, 8, 22, 12, tzinfo=timezone.utc))
        self.assertEqual(ledger.day("2026-08-22"), {"impossible_temperature": 1})
        self.assertEqual(dict(ledger.overall), {"invalid_timestamp": 1, "impossible_temperature": 1})

    def test_historical_s3_keys_cover_old_and_new_directory_layouts(self):
        old_cycle = datetime(2024, 9, 17, tzinfo=timezone.utc)
        new_cycle = datetime(2026, 5, 1, 12, tzinfo=timezone.utc)
        self.assertEqual(
            backfill.PublicModelSampler.key("lmhofs", old_cycle, 24, "regulargrid"),
            "lmhofs/netcdf/202409/lmhofs.t00z.20240917.regulargrid.f024.nc",
        )
        self.assertEqual(
            backfill.PublicModelSampler.key("leofs", new_cycle, 120),
            "leofs/netcdf/2026/05/01/leofs.t12z.20260501.fields.f120.nc",
        )

    def test_station_forecast_names_cover_legacy_and_modern_archives(self):
        legacy = datetime(2023, 5, 15, tzinfo=timezone.utc)
        modern = datetime(2026, 5, 15, tzinfo=timezone.utc)
        self.assertEqual(
            backfill.PublicModelSampler.station_file_names("lmhofs", legacy)[0],
            "nos.lmhofs.stations.forecast.20230515.t00z.nc",
        )
        self.assertEqual(
            backfill.PublicModelSampler.station_file_names("lmhofs", modern)[0],
            "lmhofs.t00z.20260515.stations.forecast.nc",
        )

    def test_backfill_tags_pre_boundary_station_rows_as_legacy(self):
        observed = datetime(2024, 8, 15, tzinfo=timezone.utc)
        row = backfill._observation(
            "glos:49", "Muskegon Buoy", "GLOS Seagull", "lake-michigan", "moored_buoy",
            43.179, -86.361, observed, 62.0, 1.0, 1, "good",
        )
        pair = backfill.build_pairs(date(2024, 8, 15), [row], FakeSampler(source_kind="station_file"))[0]
        self.assertEqual(pair["modelVersion"], "LMHOFS:pre-COMF-3.6")
        self.assertEqual(pair["sampleMethod"], "station_file")

    def test_station_file_pair_validates_against_schema_contract(self):
        pair = backfill.build_pairs(
            date(2026, 10, 1), [observation(5.0, 2)], FakeSampler(source_kind="station_file")
        )[0]
        self.assertEqual(pair["sampleMethod"], "station_file")
        records = scorecard.records_from_evidence(
            {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": [pair]},
            "public-backfill/v1/2026-10-01.json", "0" * 64,
        )
        self.assertEqual(scorecard_schema.validate_records(records)["invalidRows"], 0)

    def test_backfill_uses_corrected_model_version(self):
        pairs = backfill.build_pairs(date(2026, 10, 1), [observation(1.0, 1)], FakeSampler())
        self.assertEqual(pairs[0]["modelVersion"], "LMHOFS:COMF-3.6:2024-09-16")


if __name__ == "__main__":
    unittest.main()
