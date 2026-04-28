-- Seed bait_catalog with the curated mainland-USA canonical bait list.
-- 4 families enforced by CHECK on bait_catalog.family:
--   live          — live baitfish, worms, leeches, crawfish, frogs, etc.
--   cut           — cut/dead bait (shad, herring, liver, squid)
--   prepared      — commercial / homemade prepared baits (PowerBait, dough,
--                   stinkbait, boilies, corn, marshmallow)
--   natural_other — natural bait that doesn't fit the above (roe, skein,
--                   live insect larvae, etc.)
--
-- Brand names + regional slang go to bait_aliases later. Idempotent via
-- unique index on canonical_name.

create unique index if not exists bait_catalog_canonical_name_unique
  on public.bait_catalog (canonical_name);

insert into public.bait_catalog
  (canonical_name, family, sub_type, search_priority)
values
  -- ============================================================
  -- live
  -- ============================================================
  ('Minnow',                            'live',          'baitfish',       130),
  ('Fathead Minnow',                    'live',          'baitfish',       180),
  ('Golden Shiner',                     'live',          'baitfish',       200),
  ('Emerald Shiner',                    'live',          'baitfish',       250),
  ('Spottail Shiner',                   'live',          'baitfish',       320),
  ('Common Shiner',                     'live',          'baitfish',       400),
  ('Creek Chub',                        'live',          'baitfish',       350),
  ('Live Sucker',                       'live',          'baitfish',       300),
  ('Live Cisco',                        'live',          'baitfish',       450),
  ('Live Smelt',                        'live',          'baitfish',       400),
  ('Cigarbait (Small Live Baitfish)',   'live',          'baitfish',       700),
  ('Nightcrawler',                      'live',          'worm',           120),
  ('Red Worm',                          'live',          'worm',           220),
  ('Wax Worm',                          'live',          'larva',          250),
  ('Mealworm',                          'live',          'larva',          280),
  ('Maggot',                            'live',          'larva',          400),
  ('Cricket',                           'live',          'insect',         220),
  ('Grasshopper',                       'live',          'insect',         350),
  ('Crayfish / Crawfish',               'live',          'crustacean',     180),
  ('Hellgrammite',                      'live',          'invert',         400),
  ('Leech',                             'live',          'invert',         200),
  ('Live Salamander',                   'live',          'amphibian',      700),
  ('Live Frog',                         'live',          'amphibian',      450),
  ('Sand Worm',                         'live',          'worm',           500),
  ('Blood Worm',                        'live',          'worm',           550),
  ('Live Shrimp',                       'live',          'crustacean',     250),
  ('Mole Crab / Sand Flea',             'live',          'crustacean',     600),

  -- ============================================================
  -- cut
  -- ============================================================
  ('Cut Shad',                          'cut',           'baitfish',       180),
  ('Cut Skipjack',                      'cut',           'baitfish',       300),
  ('Cut Sucker',                        'cut',           'baitfish',       400),
  ('Cut Herring',                       'cut',           'baitfish',       250),
  ('Cut Bunker / Menhaden',             'cut',           'baitfish',       220),
  ('Cut Mullet',                        'cut',           'baitfish',       350),
  ('Cut Mackerel',                      'cut',           'baitfish',       450),
  ('Cut Squid',                         'cut',           'invert',         300),
  ('Chicken Liver',                     'cut',           'organ',          200),
  ('Cut Bait (Generic)',                'cut',           'baitfish',       500),

  -- ============================================================
  -- prepared
  -- ============================================================
  ('PowerBait',                         'prepared',      'dough',          150),
  ('Dough Bait',                        'prepared',      'dough',          280),
  ('Catfish Stinkbait',                 'prepared',      'stinkbait',      200),
  ('Garlic Dough',                      'prepared',      'dough',          400),
  ('Cheese Bait',                       'prepared',      'paste',          350),
  ('Marshmallow',                       'prepared',      'novelty',        300),
  ('Corn',                              'prepared',      'grain',          220),
  ('Salmon Eggs (Jarred)',              'prepared',      'egg',            250),
  ('Bread Ball',                        'prepared',      'paste',          450),
  ('Hot Dog',                           'prepared',      'meat',           400),
  ('Spam / Meat Cube',                  'prepared',      'meat',           600),
  ('Boilies',                           'prepared',      'carp',           500),

  -- ============================================================
  -- natural_other
  -- ============================================================
  ('Roe (Uncured Eggs)',                'natural_other', 'egg',            300),
  ('Skein',                             'natural_other', 'egg',            350),
  ('Live Mayfly Nymph',                 'natural_other', 'insect',         700),
  ('Live Stonefly Nymph',               'natural_other', 'insect',         750),
  ('Live Caddis Larva',                 'natural_other', 'insect',         800)
on conflict (canonical_name) do update set
  family          = excluded.family,
  sub_type        = excluded.sub_type,
  search_priority = excluded.search_priority,
  updated_at      = timezone('utc', now());
