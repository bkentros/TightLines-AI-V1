"""Regression tests for credential-safe database tooling."""
from __future__ import annotations

import io
import subprocess
import sys
import unittest
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPTS))

import db_connection_safety as safety  # noqa: E402


class DatabaseConnectionSafetyTest(unittest.TestCase):
    def test_failed_psql_connection_never_prints_or_argvs_password(self):
        sentinel = "DO-NOT-PRINT-credential-92741"
        config = safety.DatabaseConfig("db.invalid", 5432, "postgres", "operator", sentinel)
        captured = {}

        def failed_runner(argv, **kwargs):
            captured["argv"] = argv
            captured["env"] = kwargs["env"]
            return subprocess.CompletedProcess(
                argv, 2, stdout="",
                stderr=(
                    f"could not connect to postgresql://operator:{sentinel}@db.invalid/postgres "
                    f"password={sentinel}"
                ),
            )

        output, errors = io.StringIO(), io.StringIO()
        status = safety.run_psql_safely(
            "psql", Path("failure.sql"), config,
            runner=failed_runner, stdout=output, stderr=errors,
        )
        self.assertEqual(status, 2)
        self.assertNotIn(sentinel, " ".join(captured["argv"]))
        self.assertEqual(captured["env"]["PGPASSWORD"], sentinel)
        self.assertNotIn(sentinel, output.getvalue() + errors.getvalue())
        self.assertIn("[database_url_redacted]", errors.getvalue())

    def test_psycopg_failure_discards_credential_bearing_exception(self):
        sentinel = "DO-NOT-PRINT-credential-1337"
        config = safety.DatabaseConfig("db.invalid", 5432, "postgres", "operator", sentinel)

        def fail(**_kwargs):
            raise RuntimeError(f"postgresql://operator:{sentinel}@db.invalid/postgres")

        with self.assertRaisesRegex(safety.SafeDatabaseError, "credentials redacted") as raised:
            safety.connect_psycopg_safely(fail, config)
        self.assertNotIn(sentinel, str(raised.exception))
        self.assertIsNone(raised.exception.__cause__)

    def test_separate_pg_environment_takes_priority_over_legacy_url(self):
        config = safety.config_from_environment({
            "PGHOST": "safe.host", "PGPORT": "6543", "PGDATABASE": "postgres",
            "PGUSER": "operator", "PGPASSWORD": "env-only",
            "V1_DATABASE_URL": "postgresql://wrong:wrong@wrong.invalid/wrong",
        })
        self.assertEqual(config.host, "safe.host")
        self.assertEqual(config.password, "env-only")


if __name__ == "__main__":
    unittest.main()
