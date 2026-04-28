-- Seed lure_catalog with the curated mainland-USA canonical lure list.
-- 10 UX families, ~110 canonical lure types covering everything an
-- advanced/guide-level angler would log. Brand names + slang go to
-- lure_aliases in a separate migration. Sizes and colors are recorded
-- per-catch (lure_size, lure_color); default_sizes/default_colors arrays
-- on the catalog stay empty in v1 and can be enriched later.
--
-- engine_canonical_id is set when the row maps directly to your engine's
-- canonical lure taxonomy (squarebill_crankbait, swim_jig, paddle_tail_swimbait,
-- pike_jerkbait, large_profile_pike_swimbait, etc.). Where ambiguous (a Senko
-- can be wacky-rigged or finesse-stick-rigged), I picked the most common usage
-- and set engine_canonical_id accordingly.
--
-- Idempotent: a unique index on canonical_name lets us upsert. Re-running the
-- migration absorbs edits without duplicating rows.

-- Add unique index on canonical_name for idempotent seeding.
create unique index if not exists lure_catalog_canonical_name_unique
  on public.lure_catalog (canonical_name);

insert into public.lure_catalog
  (canonical_name, family, sub_type, engine_canonical_id, search_priority)
values
  -- ============================================================
  -- soft_plastic (worms, swimbaits, jerkshads, finesse, tubes, craws,
  -- creatures, lizards, grubs, soft frogs)
  -- ============================================================
  ('Senko / Stick Worm',                'soft_plastic',  'worm',      'wacky_rigged_stick_worm',    110),
  ('Finesse Worm',                      'soft_plastic',  'worm',      'finesse_stick_worm',          250),
  ('Trick Worm',                        'soft_plastic',  'worm',       null,                          280),
  ('Straight Tail Worm',                'soft_plastic',  'worm',       null,                          320),
  ('Ribbon Tail Worm',                  'soft_plastic',  'worm',       null,                          250),
  ('Magnum Ribbon Tail Worm',           'soft_plastic',  'worm',       null,                          800),
  ('Flick Shake Worm',                  'soft_plastic',  'worm',       null,                          550),
  ('Drop-Shot Worm',                    'soft_plastic',  'finesse',   'drop_shot_worm_minnow',       220),
  ('Drop-Shot Minnow',                  'soft_plastic',  'finesse',   'drop_shot_worm_minnow',       200),
  ('Neko Worm',                         'soft_plastic',  'finesse',    null,                          420),
  ('Shaky Head Worm',                   'soft_plastic',  'finesse',    null,                          270),
  ('Ned-Style Bait (TRD)',              'soft_plastic',  'finesse',   'ned_rig',                      200),
  ('Paddle Tail Swimbait',              'soft_plastic',  'swimbait',  'paddle_tail_swimbait',         130),
  ('Boot Tail Swimbait',                'soft_plastic',  'swimbait',  'paddle_tail_swimbait',         220),
  ('Split Tail Swimbait',               'soft_plastic',  'swimbait',   null,                          450),
  ('Magnum Soft Swimbait',              'soft_plastic',  'swimbait',   null,                          700),
  ('Fluke / Soft Jerkshad',             'soft_plastic',  'jerkbait',  'soft_jerkbait',                150),
  ('Sluggo / Soft Stick Bait',          'soft_plastic',  'jerkbait',  'soft_jerkbait',                600),
  ('Magnum Soft Jerkbait',              'soft_plastic',  'jerkbait',   null,                          900),
  ('Bass Tube',                         'soft_plastic',  'tube',      'tube_jig',                     220),
  ('Smallmouth Tube',                   'soft_plastic',  'tube',      'tube_jig',                     240),
  ('Panfish Tube',                      'soft_plastic',  'tube',       null,                          400),
  ('Crappie Tube',                      'soft_plastic',  'tube',       null,                          280),
  ('Craw / Crawfish Imitation',         'soft_plastic',  'craw',       null,                          180),
  ('Compact Craw',                      'soft_plastic',  'craw',       null,                          350),
  ('Flipping Craw',                     'soft_plastic',  'craw',      'compact_flipping_jig',         300),
  ('Creature Bait',                     'soft_plastic',  'creature',   null,                          220),
  ('Beaver-Style Bait',                 'soft_plastic',  'creature',   null,                          280),
  ('Brush Hog',                         'soft_plastic',  'creature',   null,                          320),
  ('Lizard',                            'soft_plastic',  'lizard',     null,                          600),
  ('Curly Tail Grub',                   'soft_plastic',  'grub',       null,                          230),
  ('Single Tail Grub',                  'soft_plastic',  'grub',       null,                          320),
  ('Twin Tail (Split Tail) Grub',       'soft_plastic',  'grub',       null,                          600),
  ('Hula Grub',                         'soft_plastic',  'grub',       null,                          500),
  ('Soft Frog (Toad)',                  'soft_plastic',  'frog',       null,                          280),
  ('Buzz Toad',                         'soft_plastic',  'frog',       null,                          350),

  -- ============================================================
  -- crankbait
  -- ============================================================
  ('Squarebill Crankbait',              'crankbait',     'squarebill','squarebill_crankbait',         150),
  ('Lipless Crankbait',                 'crankbait',     'lipless',   'lipless_crankbait',            130),
  ('Deep-Diving Crankbait',             'crankbait',     'deep',      'deep_diving_crankbait',        200),
  ('Medium-Diving Crankbait',           'crankbait',     'medium',     null,                          250),
  ('Shallow-Diving Crankbait',          'crankbait',     'shallow',    null,                          220),
  ('Flat-Sided Crankbait',              'crankbait',     'flat_sided','flat_sided_crankbait',         280),
  ('Wake Bait',                         'crankbait',     'wake',       null,                          380),
  ('Micro Crankbait (Trout/Panfish)',   'crankbait',     'micro',      null,                          600),

  -- ============================================================
  -- jerkbait_glide (suspending/floating jerkbaits + hard glide baits)
  -- ============================================================
  ('Suspending Jerkbait',               'jerkbait_glide','suspending','suspending_jerkbait',          130),
  ('Floating Jerkbait',                 'jerkbait_glide','floating',   null,                          250),
  ('Deep-Diving Jerkbait',              'jerkbait_glide','deep',       null,                          400),
  ('Twitchbait (Rogue-style)',          'jerkbait_glide','twitch',     null,                          300),
  ('Minnow Plug',                       'jerkbait_glide','minnow',     null,                          200),
  ('Hard Glide Bait',                   'jerkbait_glide','glide',      null,                          350),
  ('S-Waving Glide Bait',               'jerkbait_glide','glide',      null,                          550),

  -- ============================================================
  -- topwater
  -- ============================================================
  ('Walking Topwater',                  'topwater',      'walking',   'walking_topwater',             150),
  ('Popper',                            'topwater',      'popping',   'popping_topwater',             170),
  ('Chugger (heavy popper)',            'topwater',      'popping',   'popping_topwater',             350),
  ('Prop Bait',                         'topwater',      'prop',       null,                          220),
  ('Plopper-Style Topwater',            'topwater',      'prop',       null,                          230),
  ('Buzzbait',                          'topwater',      'buzz',      'buzzbait_prop_bait',           200),
  ('Hollow Body Frog',                  'topwater',      'frog',      'hollow_body_frog',             180),
  ('Pencil Popper',                     'topwater',      'pencil',     null,                          500),
  ('Micro Topwater (Trout/Panfish)',    'topwater',      'micro',      null,                          700),

  -- ============================================================
  -- jig
  -- ============================================================
  ('Football Jig',                      'jig',           'football',  'football_jig',                 150),
  ('Flipping / Punching Jig',           'jig',           'flipping',  'compact_flipping_jig',         170),
  ('Swim Jig',                          'jig',           'swim',      'swim_jig',                     140),
  ('Finesse Jig',                       'jig',           'finesse',    null,                          250),
  ('Bladed Jig (Chatterbait)',          'jig',           'bladed',    'bladed_jig',                   160),
  ('Hair Jig',                          'jig',           'hair',       null,                          300),
  ('Hover Jig (Damiki Rig)',            'jig',           'hover',      null,                          400),
  ('Shaky Head Jig',                    'jig',           'shaky_head', null,                          240),
  ('Swing Head Jig',                    'jig',           'swing_head', null,                          450),
  ('Ball Head Jighead',                 'jig',           'ball_head',  null,                          200),
  ('Crappie Jig',                       'jig',           'crappie',    null,                          250),
  ('Panfish Jig',                       'jig',           'panfish',    null,                          280),
  ('Ice Jig',                           'jig',           'ice',        null,                          350),
  ('Jigging Rap',                       'jig',           'jigging_rap',null,                          500),

  -- ============================================================
  -- spinnerbait_blade
  -- ============================================================
  ('Spinnerbait',                       'spinnerbait_blade','spinnerbait','spinnerbait',              150),
  ('Inline Spinner',                    'spinnerbait_blade','inline',     null,                       200),
  ('Blade Bait',                        'spinnerbait_blade','blade',     'blade_bait',                250),
  ('Tail Spinner',                      'spinnerbait_blade','tail',       null,                       600),
  ('Beetle Spin',                       'spinnerbait_blade','beetle',     null,                       400),
  ('Underspin',                         'spinnerbait_blade','underspin',  null,                       350),

  -- ============================================================
  -- spoon
  -- ============================================================
  ('Casting Spoon',                     'spoon',         'casting',    null,                          280),
  ('Jigging Spoon',                     'spoon',         'jigging',    null,                          350),
  ('Flutter Spoon',                     'spoon',         'flutter',    null,                          380),
  ('Weedless Spoon',                    'spoon',         'weedless',   null,                          400),
  ('Trolling Spoon',                    'spoon',         'trolling',   null,                          600),
  ('Ice Spoon',                         'spoon',         'ice',        null,                          450),
  ('Micro Spoon (Trout)',               'spoon',         'micro',      null,                          500),

  -- ============================================================
  -- hard_swimbait (multi-jointed hard-bodied swimbaits)
  -- ============================================================
  ('Multi-Jointed Hard Swimbait',       'hard_swimbait', 'jointed',    null,                          400),
  ('Single-Jointed Hard Swimbait',      'hard_swimbait', 'single_joint',null,                         500),
  ('S-Waving Hard Swimbait',            'hard_swimbait', 's_waving',   null,                          600),
  ('Topwater Hard Swimbait (Wake)',     'hard_swimbait', 'topwater',   null,                          700),

  -- ============================================================
  -- specialty_rig (multi-lure assemblies sold as one unit)
  -- ============================================================
  ('Alabama / Umbrella Rig',            'specialty_rig', 'alabama',    null,                          400),
  ('Tokyo Rig',                         'specialty_rig', 'tokyo',      null,                          450),
  ('Punch Rig',                         'specialty_rig', 'punch',      null,                          500),

  -- ============================================================
  -- musky_pike_specific (oversized lures purpose-built for big toothy fish)
  -- ============================================================
  ('Musky Bucktail',                    'musky_pike_specific','bucktail',         null,               180),
  ('Double-Bladed Spinner (Cowgirl)',   'musky_pike_specific','double_blade',     null,               220),
  ('Musky Glide Bait',                  'musky_pike_specific','glide',            null,               200),
  ('Musky Jerkbait',                    'musky_pike_specific','jerkbait',        'pike_jerkbait',     230),
  ('Musky Crankbait',                   'musky_pike_specific','crankbait',        null,               300),
  ('Musky Topwater',                    'musky_pike_specific','topwater',         null,               280),
  ('Musky Soft Swimbait (Bull Dawg)',   'musky_pike_specific','soft_swimbait',   'large_profile_pike_swimbait', 210),
  ('Musky Pull Bait',                   'musky_pike_specific','pull_bait',        null,               350),
  ('Magnum Tube',                       'musky_pike_specific','tube',             null,               400),
  ('Big Hair Jig (Musky-sized)',        'musky_pike_specific','hair_jig',         null,               450),
  ('Musky Topwater Swimbait',           'musky_pike_specific','topwater_swim',    null,               500)
on conflict (canonical_name) do update set
  family              = excluded.family,
  sub_type            = excluded.sub_type,
  engine_canonical_id = excluded.engine_canonical_id,
  search_priority     = excluded.search_priority,
  updated_at          = timezone('utc', now());
