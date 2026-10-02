"""Temp at depth: interpolation from NOAA z-levels to the map's fixed depths.

Profiles below are real LMHOFS values (06Z 2 Oct 2026 cycle, f001) so the tests
exercise the shapes the job will see: a mixed layer, a thermocline, fill below
the bottom, and shallow bays.
"""
import sys
import unittest
from pathlib import Path

import numpy as np

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

from lakemap import depth  # noqa: E402

LEVELS = np.array([0, 1, 2, 4, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50], np.float64)
FILL = -99999.0
F = lambda f: (f - 32) * 5 / 9  # noqa: E731
# 13 mi off Ludington, h = 131.5 m (°F converted to °C)
LUDINGTON = np.array([F(v) for v in (64.8, 64.8, 64.8, 64.8, 64.8, 64.9, 64.7, 64.0, 62.8, 57.7, 52.6, 48.9, 45.7, 43.4, 42.0, 41.3)])
# Saginaw Bay, h = 9.7 m: values to 8 m, fill below
SAGINAW = np.array([F(61.6), F(61.7), F(61.7), F(61.7), F(61.7), F(61.6)] + [FILL] * 10)


def at(profile, bottom, ft):
    return depth.profile_at(profile, LEVELS, bottom, ft * depth.FT_TO_M)


class LevelSlabTest(unittest.TestCase):
    def test_all_map_depths_need_levels_2_to_50_m(self):
        k0, k1 = depth.level_slab(LEVELS, depth.feet_to_m(depth.TEMP_DEPTHS_FT))
        self.assertEqual((LEVELS[k0], LEVELS[k1]), (2.0, 50.0))
        self.assertEqual((k0, k1), (2, 15))

    def test_same_slab_fits_every_lake(self):
        # LEOFS stops at 60 m (17 levels); the others go deeper
        leofs = np.array([0, 1, 2, 4, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60], np.float64)
        lsofs = np.concatenate([leofs, [70, 80, 90, 100, 125, 150, 200, 250, 300, 350]])
        for levels in (leofs, lsofs):
            self.assertEqual(depth.level_slab(levels, depth.feet_to_m(depth.TEMP_DEPTHS_FT)), (2, 15))

    def test_rejects_targets_outside_the_levels_and_bad_levels(self):
        with self.assertRaises(ValueError):
            depth.level_slab(LEVELS, [60.0])
        with self.assertRaises(ValueError):
            depth.level_slab([0, 2, 1], [1.0])
        with self.assertRaises(ValueError):
            depth.level_slab(LEVELS, [])


class InterpolationTest(unittest.TestCase):
    def test_linear_between_the_two_levels_around_each_depth(self):
        # 30 ft = 9.144 m lies between 8 m (64.9 °F) and 10 m (64.7 °F)
        expected = F(64.9) + (F(64.7) - F(64.9)) * (9.144 - 8) / 2
        self.assertAlmostEqual(at(LUDINGTON, 131.5, 30), expected, places=4)
        # 75 ft = 22.86 m between 20 m (57.7) and 25 m (52.6): the thermocline
        expected = F(57.7) + (F(52.6) - F(57.7)) * (22.86 - 20) / 5
        self.assertAlmostEqual(at(LUDINGTON, 131.5, 75), expected, places=4)

    def test_all_map_depths_follow_the_thermocline(self):
        v = depth.interpolate_to_depths(LUDINGTON[:, None], LEVELS, [131.5], depth.feet_to_m(depth.TEMP_DEPTHS_FT))[:, 0]
        fahrenheit = v * 9 / 5 + 32
        self.assertTrue(np.all(np.isfinite(v)))
        self.assertTrue(np.all(np.diff(fahrenheit[2:]) < 0))  # colder with depth below 30 ft
        self.assertAlmostEqual(float(fahrenheit[0]), 64.8, places=2)   # 10 ft, mixed layer
        self.assertTrue(41.3 < fahrenheit[-1] < 42.0)                  # 150 ft = 45.7 m

    def test_exact_level_returns_that_level(self):
        self.assertAlmostEqual(depth.profile_at(LUDINGTON, LEVELS, 131.5, 20.0), F(57.7), places=4)
        self.assertAlmostEqual(depth.profile_at(LUDINGTON, LEVELS, 131.5, 50.0), F(41.3), places=4)
        self.assertAlmostEqual(depth.profile_at(LUDINGTON, LEVELS, 131.5, 2.0), F(64.8), places=4)


class BottomAndShallowWaterTest(unittest.TestCase):
    def test_depth_below_the_bottom_is_no_data(self):
        self.assertTrue(np.isnan(at(SAGINAW, 9.7, 40)))
        self.assertTrue(np.isnan(at(SAGINAW, 9.7, 100)))

    def test_depth_just_above_a_filled_level_uses_the_last_level(self):
        # 30 ft = 9.14 m in 9.7 m of water: 8 m valid, 10 m filled -> 8 m value
        self.assertAlmostEqual(at(SAGINAW, 9.7, 30), F(61.6), places=4)
        # 20 ft = 6.1 m: both 6 and 8 m valid -> linear
        self.assertAlmostEqual(at(SAGINAW, 9.7, 20), F(61.7) + (F(61.6) - F(61.7)) * 0.048, places=4)

    def test_no_near_bottom_carry_beyond_the_limit(self):
        # valid to 8 m, filled below, unknown bottom: 10.3 m is > 2 m below 8 m
        profile = SAGINAW.copy()
        self.assertTrue(np.isnan(depth.profile_at(profile, LEVELS, np.nan, 10.3)))
        self.assertAlmostEqual(depth.profile_at(profile, LEVELS, np.nan, 9.9), F(61.6), places=4)

    def test_bottom_mask_wins_even_when_noaa_has_a_value(self):
        # a cell whose h says 5 m must never show 30 ft, even if levels are filled in
        self.assertTrue(np.isnan(at(LUDINGTON, 5.0, 30)))

    def test_many_points_at_once(self):
        temps = np.stack([LUDINGTON, SAGINAW, np.full(16, FILL)], axis=1)
        out = depth.interpolate_to_depths(temps, LEVELS, [131.5, 9.7, 40.0], depth.feet_to_m([10, 30, 50]))
        self.assertEqual(out.shape, (3, 3))
        self.assertEqual(out.dtype, np.float32)
        self.assertTrue(np.all(np.isfinite(out[:, 0])))
        self.assertTrue(np.isfinite(out[0, 1]) and np.isfinite(out[1, 1]) and np.isnan(out[2, 1]))
        self.assertTrue(np.all(np.isnan(out[:, 2])))  # all-fill point stays empty

    def test_expected_cells(self):
        np.testing.assert_array_equal(depth.expected_cells([131.5, 9.7, np.nan, 9.144], 9.144), [True, True, False, True])


class EdgeCaseTest(unittest.TestCase):
    def test_fill_nan_and_implausible_values_are_missing(self):
        t = depth.clean_temperatures([FILL, np.nan, -6.0, 41.0, 4.0, np.inf])
        self.assertEqual(int(np.isfinite(t).sum()), 1)
        self.assertEqual(float(t[4]), 4.0)

    def test_does_not_modify_the_input(self):
        profile = SAGINAW.copy()
        depth.profile_at(profile, LEVELS, 9.7, 3.0)
        self.assertEqual(profile[-1], FILL)

    def test_mismatched_level_count_is_rejected(self):
        with self.assertRaises(ValueError):
            depth.interpolate_to_depths(LUDINGTON[:-1, None], LEVELS, [131.5], [9.0])

    def test_winter_inverse_stratification_is_kept(self):
        # under ice: ~0.5 °C at the surface warming to ~4 °C at the bottom
        winter = np.linspace(0.5, 4.0, LEVELS.size)
        v = depth.interpolate_to_depths(winter[:, None], LEVELS, [60.0], depth.feet_to_m(depth.TEMP_DEPTHS_FT))[:, 0]
        self.assertTrue(np.all(np.diff(v) > 0))
        self.assertTrue(np.all((v > 0.5) & (v < 4.0)))


class ExtendOntoLandTest(unittest.TestCase):
    def test_shallow_lake_cells_stay_empty_and_land_is_filled(self):
        # columns: 0-1 land | 2-3 shallow lake (no value at depth) | 4-5 deep lake
        water = np.array([[False, False, True, True, True, True]] * 3)
        vals = np.array([[np.nan, np.nan, np.nan, np.nan, 50.0, 51.0]] * 3, np.float32)
        out = depth.extend_onto_land(vals, water, max_cells=8)
        self.assertTrue(np.all(np.isnan(out[:, 2:4])))   # shallow water never filled
        self.assertTrue(np.all(out[:, 0:2] == 50.0))     # land next to it carries the value
        np.testing.assert_array_equal(out[:, 4:], vals[:, 4:])

    def test_land_beyond_the_limit_stays_empty(self):
        water = np.zeros((1, 12), bool); water[0, 11] = True
        vals = np.full((1, 12), np.nan, np.float32); vals[0, 11] = 40.0
        out = depth.extend_onto_land(vals, water, max_cells=3)
        self.assertTrue(np.all(out[0, 8:11] == 40.0))
        self.assertTrue(np.all(np.isnan(out[0, :8])))

    def test_all_empty_input(self):
        out = depth.extend_onto_land(np.full((2, 2), np.nan), np.ones((2, 2), bool), 8)
        self.assertTrue(np.all(np.isnan(out)))


if __name__ == "__main__":
    unittest.main()
