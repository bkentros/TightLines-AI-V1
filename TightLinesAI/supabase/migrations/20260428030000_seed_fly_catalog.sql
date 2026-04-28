-- Seed fly_catalog with the curated mainland-USA canonical fly list.
-- 7 fly types, ~110 canonical patterns covering trout/warmwater/saltwater/
-- anadromous fly fishing.
--
-- fly_type values:
--   dry_fly             — surface flies (mayflies, caddis, stones, terrestrials, attractors)
--   nymph               — subsurface drifted patterns
--   streamer            — baitfish/leech imitations, stripped or swung
--   wet_fly             — soft hackles, traditional wets, swung patterns
--   warmwater_bass_fly  — bass/panfish-specific streamers, poppers, divers
--   saltwater_fly       — saltwater inshore patterns (crab/shrimp/baitfish)
--   egg_attractor       — eggs, sucker spawn, glo bugs, worm patterns
--
-- Where a pattern fishes in multiple contexts (e.g., Clouser is salt + bass),
-- I assigned it to its primary association. Aliases (brand names, regional
-- patterns, common misspellings) live in fly_aliases — not this migration.
-- engine_canonical_id is null for every fly in v1; backfill later if/when
-- engine fly canonicals are exposed as IDs.

create unique index if not exists fly_catalog_canonical_name_unique
  on public.fly_catalog (canonical_name);

insert into public.fly_catalog
  (canonical_name, fly_type, sub_type, engine_canonical_id, search_priority)
values
  -- ============================================================
  -- dry_fly
  -- ============================================================
  ('Adams',                             'dry_fly',     'mayfly',       null,  130),
  ('Parachute Adams',                   'dry_fly',     'mayfly',       null,  140),
  ('Blue-Winged Olive (BWO)',           'dry_fly',     'mayfly',       null,  180),
  ('Pale Morning Dun (PMD)',            'dry_fly',     'mayfly',       null,  200),
  ('Sulphur',                           'dry_fly',     'mayfly',       null,  280),
  ('Light Cahill',                      'dry_fly',     'mayfly',       null,  320),
  ('March Brown',                       'dry_fly',     'mayfly',       null,  400),
  ('Mahogany Dun',                      'dry_fly',     'mayfly',       null,  500),
  ('Trico',                             'dry_fly',     'mayfly',       null,  450),
  ('Green Drake',                       'dry_fly',     'mayfly',       null,  500),
  ('Brown Drake',                       'dry_fly',     'mayfly',       null,  600),
  ('Hex (Hexagenia)',                   'dry_fly',     'mayfly',       null,  450),
  ('Mayfly Spinner',                    'dry_fly',     'mayfly',       null,  550),
  ('Comparadun',                        'dry_fly',     'mayfly',       null,  500),
  ('Klinkhammer',                       'dry_fly',     'emerger',      null,  450),
  ('Elk Hair Caddis',                   'dry_fly',     'caddis',       null,  150),
  ('X-Caddis',                          'dry_fly',     'caddis',       null,  400),
  ('Goddard Caddis',                    'dry_fly',     'caddis',       null,  500),
  ('Henryville Caddis',                 'dry_fly',     'caddis',       null,  600),
  ('Stimulator',                        'dry_fly',     'stonefly',     null,  200),
  ('Sofa Pillow',                       'dry_fly',     'stonefly',     null,  600),
  ('Salmon Fly Dry',                    'dry_fly',     'stonefly',     null,  500),
  ('Yellow Sally',                      'dry_fly',     'stonefly',     null,  450),
  ('Foam Hopper',                       'dry_fly',     'terrestrial',  null,  220),
  ('Chubby Chernobyl',                  'dry_fly',     'terrestrial',  null,  250),
  ('Madam X',                           'dry_fly',     'terrestrial',  null,  500),
  ('Foam Ant',                          'dry_fly',     'terrestrial',  null,  300),
  ('Foam Beetle',                       'dry_fly',     'terrestrial',  null,  280),
  ('Cricket',                           'dry_fly',     'terrestrial',  null,  450),
  ('Cicada',                            'dry_fly',     'terrestrial',  null,  650),
  ('Royal Wulff',                       'dry_fly',     'attractor',    null,  280),
  ('Royal Coachman',                    'dry_fly',     'attractor',    null,  500),
  ('Humpy',                             'dry_fly',     'attractor',    null,  450),
  ('H&L Variant',                       'dry_fly',     'attractor',    null,  700),

  -- ============================================================
  -- nymph
  -- ============================================================
  ('Pheasant Tail Nymph',               'nymph',       'mayfly',       null,  130),
  ('Flashback Pheasant Tail',           'nymph',       'mayfly',       null,  220),
  ('Frenchie',                          'nymph',       'mayfly',       null,  250),
  ('Hare''s Ear Nymph',                 'nymph',       'mayfly',       null,  140),
  ('Bead Head Hare''s Ear',             'nymph',       'mayfly',       null,  170),
  ('Prince Nymph',                      'nymph',       'attractor',    null,  170),
  ('Copper John',                       'nymph',       'attractor',    null,  180),
  ('Lightning Bug',                     'nymph',       'attractor',    null,  450),
  ('Pat''s Rubber Legs',                'nymph',       'stonefly',     null,  200),
  ('Stonefly Nymph',                    'nymph',       'stonefly',     null,  220),
  ('Kaufmann''s Stone',                 'nymph',       'stonefly',     null,  500),
  ('Czech Nymph',                       'nymph',       'caddis',       null,  300),
  ('Perdigon',                          'nymph',       'attractor',    null,  280),
  ('Caddis Pupa',                       'nymph',       'caddis',       null,  280),
  ('Sparkle Pupa',                      'nymph',       'caddis',       null,  350),
  ('Squirmy Worm',                      'nymph',       'worm',         null,  220),
  ('San Juan Worm',                     'nymph',       'worm',         null,  240),
  ('Walt''s Worm',                      'nymph',       'attractor',    null,  450),
  ('Mop Fly',                           'nymph',       'attractor',    null,  350),
  ('Pink Squirrel',                     'nymph',       'attractor',    null,  400),
  ('Zebra Midge',                       'nymph',       'midge',        null,  200),
  ('Disco Midge',                       'nymph',       'midge',        null,  450),
  ('WD-40',                             'nymph',       'midge',        null,  350),
  ('RS-2',                              'nymph',       'mayfly',       null,  300),
  ('Sow Bug / Scud',                    'nymph',       'crustacean',   null,  280),
  ('Cranefly Larva',                    'nymph',       'crane',        null,  600),

  -- ============================================================
  -- streamer
  -- ============================================================
  ('Wooly Bugger',                      'streamer',    'leech',        null,  120),
  ('Wooly Worm',                        'streamer',    'leech',        null,  450),
  ('Sculpzilla',                        'streamer',    'sculpin',      null,  300),
  ('Muddler Minnow',                    'streamer',    'sculpin',      null,  280),
  ('Mini Sculpin',                      'streamer',    'sculpin',      null,  500),
  ('Zonker',                            'streamer',    'baitfish',     null,  350),
  ('Mickey Finn',                       'streamer',    'attractor',    null,  450),
  ('Bunny Leech',                       'streamer',    'leech',        null,  400),
  ('Sparkle Minnow',                    'streamer',    'baitfish',     null,  280),
  ('Sex Dungeon',                       'streamer',    'articulated',  null,  300),
  ('Mini Sex Dungeon',                  'streamer',    'articulated',  null,  350),
  ('Slumpbuster',                       'streamer',    'baitfish',     null,  500),
  ('Heifer Groomer',                    'streamer',    'articulated',  null,  600),
  ('Drunk & Disorderly',                'streamer',    'baitfish',     null,  650),
  ('Bow River Bugger',                  'streamer',    'leech',        null,  700),
  ('Articulated Streamer',              'streamer',    'articulated',  null,  400),
  ('Game Changer (Trout/Bass)',         'streamer',    'articulated',  null,  280),
  ('Mini Loop Streamer',                'streamer',    'baitfish',     null,  800),
  ('Trout Spey Streamer',               'streamer',    'spey',         null,  900),

  -- ============================================================
  -- wet_fly
  -- ============================================================
  ('Soft Hackle',                       'wet_fly',     'soft_hackle',  null,  300),
  ('Partridge & Orange',                'wet_fly',     'soft_hackle',  null,  350),
  ('Partridge & Yellow',                'wet_fly',     'soft_hackle',  null,  450),
  ('Hare''s Ear Wet',                   'wet_fly',     'traditional',  null,  500),
  ('March Brown Wet',                   'wet_fly',     'traditional',  null,  600),
  ('Greenwell''s Glory',                'wet_fly',     'traditional',  null,  800),

  -- ============================================================
  -- warmwater_bass_fly
  -- ============================================================
  ('Bass Popper',                       'warmwater_bass_fly','popper',     null,  150),
  ('Boogle Bug',                        'warmwater_bass_fly','popper',     null,  220),
  ('Gurgler',                           'warmwater_bass_fly','topwater',   null,  200),
  ('Dahlberg Diver',                    'warmwater_bass_fly','diver',      null,  280),
  ('Murdich Minnow',                    'warmwater_bass_fly','baitfish',   null,  300),
  ('Bass Game Changer',                 'warmwater_bass_fly','articulated',null,  220),
  ('Bass Slider',                       'warmwater_bass_fly','popper',     null,  450),
  ('Frog Fly',                          'warmwater_bass_fly','frog',       null,  350),
  ('Bass Worm Fly',                     'warmwater_bass_fly','worm',       null,  500),
  ('Bream Killer',                      'warmwater_bass_fly','panfish',    null,  280),
  ('Foam Spider',                       'warmwater_bass_fly','panfish',    null,  220),
  ('Mini Bug',                          'warmwater_bass_fly','panfish',    null,  300),
  ('Crawdad Pattern',                   'warmwater_bass_fly','crawfish',   null,  400),
  ('Damselfly Nymph',                   'warmwater_bass_fly','nymph',      null,  450),
  ('Articulated Trout Tease',           'warmwater_bass_fly','articulated',null,  600),

  -- ============================================================
  -- saltwater_fly
  -- ============================================================
  ('Clouser Minnow',                    'saltwater_fly','baitfish',    null,  150),
  ('Lefty''s Deceiver',                 'saltwater_fly','baitfish',    null,  180),
  ('Crab Pattern (Merkin)',             'saltwater_fly','crab',        null,  280),
  ('Shrimp Pattern (Gotcha)',           'saltwater_fly','shrimp',      null,  220),
  ('Bonefish Bitters',                  'saltwater_fly','shrimp',      null,  350),
  ('Tarpon Toad',                       'saltwater_fly','tarpon',      null,  400),
  ('Tarpon Streamer',                   'saltwater_fly','tarpon',      null,  450),
  ('Redfish Toad',                      'saltwater_fly','redfish',     null,  300),
  ('Crease Fly',                        'saltwater_fly','popper',      null,  280),
  ('Spawning Shrimp',                   'saltwater_fly','shrimp',      null,  500),
  ('Squimp',                            'saltwater_fly','shrimp',      null,  700),
  ('Sand Eel Pattern',                  'saltwater_fly','baitfish',    null,  450),
  ('EP Baitfish',                       'saltwater_fly','baitfish',    null,  300),
  ('Shock & Awe',                       'saltwater_fly','baitfish',    null,  600),
  ('Surf Candy',                        'saltwater_fly','baitfish',    null,  500),

  -- ============================================================
  -- egg_attractor (steelhead/salmon/trout)
  -- ============================================================
  ('Egg Pattern',                       'egg_attractor','egg',         null,  200),
  ('Glo Bug',                           'egg_attractor','egg',         null,  250),
  ('Bead Egg',                          'egg_attractor','egg',         null,  300),
  ('Sucker Spawn',                      'egg_attractor','spawn',       null,  350),
  ('Estaz Egg',                         'egg_attractor','egg',         null,  450),
  ('Y2K Egg',                           'egg_attractor','egg',         null,  500),
  ('Steelhead Worm',                    'egg_attractor','worm',        null,  280),
  ('Intruder',                          'egg_attractor','spey',        null,  600)
on conflict (canonical_name) do update set
  fly_type            = excluded.fly_type,
  sub_type            = excluded.sub_type,
  engine_canonical_id = excluded.engine_canonical_id,
  search_priority     = excluded.search_priority,
  updated_at          = timezone('utc', now());
