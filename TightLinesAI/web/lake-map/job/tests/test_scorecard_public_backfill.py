import io
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
        s3.list_objects_v2.return_value = {
            "Contents": [{
                "Key": "private/scorecard/v1/samples/stream=backfill/"
                       "date=2023-11-20/existing.parquet",
            }],
        }
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
        s3.list_objects_v2.assert_called_once_with(
            Bucket="test-bucket",
            Prefix="private/scorecard/v1/samples/stream=backfill/date=2023-11-20/",
            MaxKeys=1,
        )
        write_fragment.assert_not_called()

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
            "count": 2, "total": 3, "fraction": 2 / 3,
            "reasons": {"impossible_temperature": 1, "invalid_position": 1},
        })

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
