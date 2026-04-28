-- Seed bait_aliases with regional terms ("crawler", "bunker", "pogy"),
-- bait-shop slang ("waxie", "spike", "mealie"), brand names ("Berkley
-- PowerBait", "Pautzke", "Sonny's"), and short-forms ("eggs", "shrimp").

insert into public.bait_aliases (bait_id, alias_text, weight)
select bc.id, na.alias_text, na.weight
from public.bait_catalog bc
join (values
  -- ============================================================
  -- live
  -- ============================================================
  ('Minnow'::text,                         'baitfish'::text,              80::int),
  ('Minnow',                               'live minnow',                 95),
  ('Fathead Minnow',                       'fathead',                    100),
  ('Fathead Minnow',                       'fatty',                       70),
  ('Fathead Minnow',                       'rosy red',                    85),
  ('Golden Shiner',                        'shiner',                      80),
  ('Golden Shiner',                        'goldie shiner',               80),
  ('Emerald Shiner',                       'emerald',                     85),
  ('Spottail Shiner',                      'spottail',                    85),
  ('Common Shiner',                        'common shiner bait',          90),
  ('Creek Chub',                           'chub',                        85),
  ('Live Sucker',                          'sucker bait',                 90),
  ('Live Cisco',                           'cisco',                       95),
  ('Live Cisco',                           'tullibee',                    85),
  ('Live Smelt',                           'smelt',                       90),
  ('Cigarbait (Small Live Baitfish)',      'cigar minnow',                95),
  ('Cigarbait (Small Live Baitfish)',      'cigarbait',                  100),
  ('Nightcrawler',                         'crawler',                    100),
  ('Nightcrawler',                         'night crawler',              100),
  ('Nightcrawler',                         'cdn nightcrawler',            85),
  ('Nightcrawler',                         'canadian nightcrawler',       85),
  ('Red Worm',                             'redworm',                    100),
  ('Red Worm',                             'red wiggler',                 90),
  ('Wax Worm',                             'waxie',                      100),
  ('Wax Worm',                             'wax',                         70),
  ('Wax Worm',                             'waxies',                      90),
  ('Mealworm',                             'mealie',                     100),
  ('Mealworm',                             'meal worm',                   95),
  ('Maggot',                               'eurolarvae',                  85),
  ('Maggot',                               'spike',                       95),
  ('Cricket',                              'live cricket',                95),
  ('Grasshopper',                          'live grasshopper',            95),
  ('Grasshopper',                          'live hopper',                 90),
  ('Crayfish / Crawfish',                  'crayfish bait',               95),
  ('Crayfish / Crawfish',                  'crawfish bait',               95),
  ('Crayfish / Crawfish',                  'crawdad bait',                90),
  ('Crayfish / Crawfish',                  'mudbug',                      85),
  ('Crayfish / Crawfish',                  'live craw',                   95),
  ('Hellgrammite',                         'helly',                       80),
  ('Leech',                                'live leech',                  95),
  ('Live Salamander',                      'salamander',                 100),
  ('Live Salamander',                      'spring lizard',               85),
  ('Live Salamander',                      'mud puppy',                   75),
  ('Live Frog',                            'frog bait',                   90),
  ('Live Frog',                            'live frog bait',              95),
  ('Sand Worm',                            'sandworm',                   100),
  ('Sand Worm',                            'clam worm',                   80),
  ('Blood Worm',                           'bloodworm',                  100),
  ('Live Shrimp',                          'shrimp',                      75),
  ('Live Shrimp',                          'live shrimp bait',            95),
  ('Mole Crab / Sand Flea',                'mole crab',                  100),
  ('Mole Crab / Sand Flea',                'sand flea',                  100),
  ('Mole Crab / Sand Flea',                'sand crab',                   90),

  -- ============================================================
  -- cut
  -- ============================================================
  ('Cut Shad',                             'shad bait',                   80),
  ('Cut Shad',                             'cut shad bait',              100),
  ('Cut Skipjack',                         'skipjack bait',               95),
  ('Cut Sucker',                           'cut sucker bait',             95),
  ('Cut Herring',                          'herring chunk',               90),
  ('Cut Bunker / Menhaden',                'bunker',                     100),
  ('Cut Bunker / Menhaden',                'menhaden',                   100),
  ('Cut Bunker / Menhaden',                'pogy',                        90),
  ('Cut Bunker / Menhaden',                'cut bunker',                  95),
  ('Cut Mullet',                           'mullet chunk',                90),
  ('Cut Mackerel',                         'cut mackerel bait',           95),
  ('Cut Squid',                            'squid bait',                  95),
  ('Chicken Liver',                        'liver',                       80),
  ('Chicken Liver',                        'chicken liver bait',          95),
  ('Cut Bait (Generic)',                   'cut bait',                    95),

  -- ============================================================
  -- prepared
  -- ============================================================
  ('PowerBait',                            'power bait',                 100),
  ('PowerBait',                            'berkley powerbait',           95),
  ('PowerBait',                            'powerbait nuggets',           85),
  ('Dough Bait',                           'dough',                       95),
  ('Catfish Stinkbait',                    'stinkbait',                  100),
  ('Catfish Stinkbait',                    'stink bait',                 100),
  ('Catfish Stinkbait',                    'sonnys',                      85),
  ('Catfish Stinkbait',                    'team catfish',                80),
  ('Catfish Stinkbait',                    'punch bait',                  90),
  ('Garlic Dough',                         'garlic dough bait',           95),
  ('Cheese Bait',                          'cheese',                      80),
  ('Marshmallow',                          'mallow',                      80),
  ('Corn',                                 'sweet corn',                  95),
  ('Corn',                                 'kernel corn',                 90),
  ('Salmon Eggs (Jarred)',                 'salmon eggs',                100),
  ('Salmon Eggs (Jarred)',                 'pautzke',                     90),
  ('Salmon Eggs (Jarred)',                 'eggs',                        70),
  ('Bread Ball',                           'bread',                       80),
  ('Hot Dog',                              'wiener',                      80),
  ('Spam / Meat Cube',                     'spam',                        90),
  ('Spam / Meat Cube',                     'meat',                        70),
  ('Boilies',                              'boilie',                      95),

  -- ============================================================
  -- natural_other
  -- ============================================================
  ('Roe (Uncured Eggs)',                   'roe',                        100),
  ('Roe (Uncured Eggs)',                   'eggs',                        65),
  ('Skein',                                'spawn sac',                   90),
  ('Live Mayfly Nymph',                    'mayfly nymph live',           90),
  ('Live Stonefly Nymph',                  'stonefly nymph live',         90),
  ('Live Caddis Larva',                    'caddis larva',                95)
) as na(canonical_name, alias_text, weight)
  on bc.canonical_name = na.canonical_name
on conflict (bait_id, normalized_alias) do nothing;
