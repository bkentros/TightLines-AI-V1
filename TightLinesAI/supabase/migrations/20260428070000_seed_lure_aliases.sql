-- Seed lure_aliases with brand names, slang, and regional terms that
-- anglers actually say or type. Resolves "rage craw" -> Craw / Crawfish
-- Imitation, "kvd 1.5" -> Squarebill Crankbait, "chatterbait" -> Bladed
-- Jig, etc.
--
-- Pattern: subquery joins lure_catalog on canonical_name to resolve uuids.
-- Same alias text can appear for multiple lures with different weights
-- (parser picks highest); the unique(lure_id, normalized_alias) index
-- prevents duplicates per lure.

insert into public.lure_aliases (lure_id, alias_text, weight)
select lc.id, na.alias_text, na.weight
from public.lure_catalog lc
join (values
  -- ============================================================
  -- soft_plastic
  -- ============================================================
  ('Senko / Stick Worm'::text,            'senko'::text,                100::int),
  ('Senko / Stick Worm',                  'stick worm',                  95),
  ('Senko / Stick Worm',                  'stick',                       70),
  ('Senko / Stick Worm',                  'wacky worm',                  85),
  ('Senko / Stick Worm',                  'yamamoto senko',              90),
  ('Senko / Stick Worm',                  'gary yamamoto',               75),
  ('Senko / Stick Worm',                  'dinger',                      85),
  ('Senko / Stick Worm',                  'yum dinger',                  85),
  ('Senko / Stick Worm',                  'gulp senko',                  75),

  ('Finesse Worm',                        'finesse worm',               100),
  ('Finesse Worm',                        'tiny worm',                   80),
  ('Finesse Worm',                        'shaky worm',                  75),
  ('Finesse Worm',                        'roboworm',                    90),

  ('Trick Worm',                          'trick worm',                 100),
  ('Trick Worm',                          'zoom trick worm',             95),

  ('Straight Tail Worm',                  'straight tail',               90),
  ('Straight Tail Worm',                  'straight worm',               90),

  ('Ribbon Tail Worm',                    'ribbon tail',                100),
  ('Ribbon Tail Worm',                    'curl tail worm',              80),

  ('Magnum Ribbon Tail Worm',             'magnum worm',                 95),
  ('Magnum Ribbon Tail Worm',             'big worm',                    80),

  ('Flick Shake Worm',                    'flick shake',                100),
  ('Flick Shake Worm',                    'flickshake',                  95),

  ('Drop-Shot Worm',                      'drop shot worm',             100),
  ('Drop-Shot Worm',                      'roboworm drop shot',          85),

  ('Drop-Shot Minnow',                    'drop shot minnow',           100),
  ('Drop-Shot Minnow',                    'morning dawn',                70),
  ('Drop-Shot Minnow',                    'roboworm minnow',             85),

  ('Neko Worm',                           'neko',                       100),
  ('Neko Worm',                           'neko rig worm',               95),

  ('Shaky Head Worm',                     'shaky head worm',            100),
  ('Shaky Head Worm',                     'shaky',                       70),

  ('Ned-Style Bait (TRD)',                'ned',                        100),
  ('Ned-Style Bait (TRD)',                'ned bait',                   100),
  ('Ned-Style Bait (TRD)',                'trd',                         95),
  ('Ned-Style Bait (TRD)',                'z-man trd',                   90),
  ('Ned-Style Bait (TRD)',                'finesse tubes',               60),

  ('Paddle Tail Swimbait',                'paddle tail',                100),
  ('Paddle Tail Swimbait',                'swimbait',                    80),
  ('Paddle Tail Swimbait',                'keitech',                     95),
  ('Paddle Tail Swimbait',                'keitech easy shiner',         95),
  ('Paddle Tail Swimbait',                'zman swimmerz',               80),
  ('Paddle Tail Swimbait',                'megabass swimbait',           80),

  ('Boot Tail Swimbait',                  'boot tail',                  100),
  ('Boot Tail Swimbait',                  'boot tail swim',              90),

  ('Split Tail Swimbait',                 'split tail',                  90),
  ('Split Tail Swimbait',                 'twin tail minnow',            80),

  ('Magnum Soft Swimbait',                'magnum swimbait',            100),
  ('Magnum Soft Swimbait',                'big swimbait',                85),

  ('Fluke / Soft Jerkshad',               'fluke',                      100),
  ('Fluke / Soft Jerkshad',               'jerkshad',                    95),
  ('Fluke / Soft Jerkshad',               'zoom fluke',                  90),
  ('Fluke / Soft Jerkshad',               'super fluke',                 95),

  ('Sluggo / Soft Stick Bait',            'sluggo',                     100),
  ('Sluggo / Soft Stick Bait',            'lunker city sluggo',          90),

  ('Magnum Soft Jerkbait',                'magnum fluke',                95),
  ('Magnum Soft Jerkbait',                'magnum jerk',                 85),

  ('Bass Tube',                           'bass tube',                  100),
  ('Bass Tube',                           'tube',                        70),
  ('Bass Tube',                           'gitzit',                      80),

  ('Smallmouth Tube',                     'smb tube',                    95),
  ('Smallmouth Tube',                     'smallie tube',                95),

  ('Panfish Tube',                        'panfish tube',               100),

  ('Crappie Tube',                        'crappie tube',               100),

  ('Craw / Crawfish Imitation',           'craw',                        90),
  ('Craw / Crawfish Imitation',           'crawfish',                    95),
  ('Craw / Crawfish Imitation',           'crawdad',                     90),
  ('Craw / Crawfish Imitation',           'mudbug',                      80),
  ('Craw / Crawfish Imitation',           'rage craw',                   95),
  ('Craw / Crawfish Imitation',           'strike king rage craw',       95),

  ('Compact Craw',                        'compact craw',               100),
  ('Compact Craw',                        'small craw',                  85),

  ('Flipping Craw',                       'flipping craw',              100),
  ('Flipping Craw',                       'punch craw',                  85),
  ('Flipping Craw',                       'big craw',                    75),

  ('Creature Bait',                       'creature',                    95),
  ('Creature Bait',                       'creature bait',              100),
  ('Creature Bait',                       'reaction craw',               80),

  ('Beaver-Style Bait',                   'beaver',                     100),
  ('Beaver-Style Bait',                   'sweet beaver',                95),

  ('Brush Hog',                           'brush hog',                  100),
  ('Brush Hog',                           'zoom brush hog',              95),

  ('Lizard',                              'lizard',                     100),
  ('Lizard',                              'zoom lizard',                 90),

  ('Curly Tail Grub',                     'curly tail',                  90),
  ('Curly Tail Grub',                     'twister',                     85),
  ('Curly Tail Grub',                     'mister twister',              90),
  ('Curly Tail Grub',                     'curly tail grub',            100),

  ('Single Tail Grub',                    'single tail grub',           100),

  ('Twin Tail (Split Tail) Grub',         'twin tail',                  100),
  ('Twin Tail (Split Tail) Grub',         'split tail grub',             90),
  ('Twin Tail (Split Tail) Grub',         'double tail grub',            85),

  ('Hula Grub',                           'hula grub',                  100),

  ('Soft Frog (Toad)',                    'horny toad',                  95),
  ('Soft Frog (Toad)',                    'toad',                        85),
  ('Soft Frog (Toad)',                    'soft frog',                  100),

  ('Buzz Toad',                           'buzz toad',                  100),
  ('Buzz Toad',                           'buzzfrog',                    90),

  -- ============================================================
  -- crankbait
  -- ============================================================
  ('Squarebill Crankbait',                'squarebill',                 100),
  ('Squarebill Crankbait',                'square bill',                100),
  ('Squarebill Crankbait',                'kvd 1.5',                     95),
  ('Squarebill Crankbait',                'kvd 2.5',                     95),
  ('Squarebill Crankbait',                'spro little john',            85),
  ('Squarebill Crankbait',                'strike king kvd',             90),

  ('Lipless Crankbait',                   'lipless',                    100),
  ('Lipless Crankbait',                   'rattle trap',                100),
  ('Lipless Crankbait',                   'rat-l-trap',                 100),
  ('Lipless Crankbait',                   'red eye shad',                90),
  ('Lipless Crankbait',                   'lv-500',                      85),
  ('Lipless Crankbait',                   'lucky craft lv',              80),

  ('Deep-Diving Crankbait',               'deep crank',                 100),
  ('Deep-Diving Crankbait',               'deep diver',                  95),
  ('Deep-Diving Crankbait',               'deep diving crank',           95),
  ('Deep-Diving Crankbait',               'dd22',                        90),
  ('Deep-Diving Crankbait',               'norman dd22',                 90),
  ('Deep-Diving Crankbait',               'rapala dt 16',                85),

  ('Medium-Diving Crankbait',             'medium crank',                95),
  ('Medium-Diving Crankbait',             'mid diver',                   90),
  ('Medium-Diving Crankbait',             'wiggle wart',                 90),

  ('Shallow-Diving Crankbait',            'shallow crank',               95),
  ('Shallow-Diving Crankbait',            'shad rap',                    90),
  ('Shallow-Diving Crankbait',            'rapala shad rap',             90),

  ('Flat-Sided Crankbait',                'flat side',                  100),
  ('Flat-Sided Crankbait',                'flatside',                   100),
  ('Flat-Sided Crankbait',                'flat-sided',                 100),
  ('Flat-Sided Crankbait',                'spro rkcrawler',              80),

  ('Wake Bait',                           'wakebait',                   100),
  ('Wake Bait',                           'wake bait',                  100),

  ('Micro Crankbait (Trout/Panfish)',     'micro crank',                100),
  ('Micro Crankbait (Trout/Panfish)',     'mini crank',                  90),
  ('Micro Crankbait (Trout/Panfish)',     'rapala original cd',          85),
  ('Micro Crankbait (Trout/Panfish)',     'flicker shad',                85),

  -- ============================================================
  -- jerkbait_glide
  -- ============================================================
  ('Suspending Jerkbait',                 'suspending jerk',            100),
  ('Suspending Jerkbait',                 'jerkbait',                    90),
  ('Suspending Jerkbait',                 'megabass',                    80),
  ('Suspending Jerkbait',                 'megabass vision 110',         95),
  ('Suspending Jerkbait',                 'rogue',                       80),
  ('Suspending Jerkbait',                 'pointer',                     85),
  ('Suspending Jerkbait',                 'lucky craft pointer',         90),

  ('Floating Jerkbait',                   'floating jerk',              100),
  ('Floating Jerkbait',                   'rapala original',             85),

  ('Deep-Diving Jerkbait',                'deep jerk',                  100),
  ('Deep-Diving Jerkbait',                'staysee',                     85),

  ('Twitchbait (Rogue-style)',            'twitchbait',                 100),
  ('Twitchbait (Rogue-style)',            'smithwick rogue',             90),

  ('Minnow Plug',                         'minnow plug',                100),
  ('Minnow Plug',                         'rebel minnow',                85),
  ('Minnow Plug',                         'rapala countdown',            85),

  ('Hard Glide Bait',                     'glide bait',                 100),
  ('Hard Glide Bait',                     'glide',                       80),
  ('Hard Glide Bait',                     'savage gear glide',           90),

  ('S-Waving Glide Bait',                 's-waver',                    100),
  ('S-Waving Glide Bait',                 'river2sea swaver',            90),
  ('S-Waving Glide Bait',                 'swaver',                      90),

  -- ============================================================
  -- topwater
  -- ============================================================
  ('Walking Topwater',                    'spook',                      100),
  ('Walking Topwater',                    'zara spook',                 100),
  ('Walking Topwater',                    'walking bait',                95),
  ('Walking Topwater',                    'super spook',                 95),
  ('Walking Topwater',                    'sammy',                       90),
  ('Walking Topwater',                    'lucky craft sammy',           90),
  ('Walking Topwater',                    'gunfish',                     85),

  ('Popper',                              'popper',                     100),
  ('Popper',                              'pop-r',                       95),
  ('Popper',                              'rebel pop-r',                 90),
  ('Popper',                              'storm chug bug',              85),

  ('Chugger (heavy popper)',              'chugger',                    100),
  ('Chugger (heavy popper)',              'big popper',                  85),

  ('Prop Bait',                           'prop bait',                  100),
  ('Prop Bait',                           'devils horse',                90),
  ('Prop Bait',                           'devil horse',                 90),

  ('Plopper-Style Topwater',              'whopper plopper',            100),
  ('Plopper-Style Topwater',              'plopper',                     95),
  ('Plopper-Style Topwater',              'plopper 130',                 95),

  ('Buzzbait',                            'buzz',                        80),
  ('Buzzbait',                            'buzzbait',                   100),
  ('Buzzbait',                            'persuader buzzbait',          85),
  ('Buzzbait',                            'lunker lure',                 75),

  ('Hollow Body Frog',                    'frog',                        80),
  ('Hollow Body Frog',                    'spro frog',                   95),
  ('Hollow Body Frog',                    'live target frog',            90),
  ('Hollow Body Frog',                    'booyah pad crasher',          90),
  ('Hollow Body Frog',                    'snag proof',                  85),
  ('Hollow Body Frog',                    'hollow body frog',           100),

  ('Pencil Popper',                       'pencil popper',              100),
  ('Pencil Popper',                       'pencil',                      75),

  ('Micro Topwater (Trout/Panfish)',      'mini topwater',              100),
  ('Micro Topwater (Trout/Panfish)',      'pop-r mini',                  85),
  ('Micro Topwater (Trout/Panfish)',      'panfish popper',              85),

  -- ============================================================
  -- jig
  -- ============================================================
  ('Football Jig',                        'football',                    90),
  ('Football Jig',                        'football head',               95),
  ('Football Jig',                        'football jig',               100),

  ('Flipping / Punching Jig',             'flipping jig',               100),
  ('Flipping / Punching Jig',             'punch jig',                   95),
  ('Flipping / Punching Jig',             'punching jig',                95),
  ('Flipping / Punching Jig',             'casting jig',                 80),
  ('Flipping / Punching Jig',             'arky jig',                    80),

  ('Swim Jig',                            'swim jig',                   100),
  ('Swim Jig',                            'swimming jig',                95),
  ('Swim Jig',                            'dirty jigs swim jig',         85),

  ('Finesse Jig',                         'finesse jig',                100),

  ('Bladed Jig (Chatterbait)',            'chatterbait',                100),
  ('Bladed Jig (Chatterbait)',            'bladed jig',                 100),
  ('Bladed Jig (Chatterbait)',            'chatter',                     85),
  ('Bladed Jig (Chatterbait)',            'z-man chatterbait',           95),
  ('Bladed Jig (Chatterbait)',            'jackhammer',                  90),
  ('Bladed Jig (Chatterbait)',            'evergreen jackhammer',        90),

  ('Hair Jig',                            'hair jig',                   100),
  ('Hair Jig',                            'preacher jig',                85),
  ('Hair Jig',                            'bucktail jig',                85),

  ('Hover Jig (Damiki Rig)',              'damiki',                     100),
  ('Hover Jig (Damiki Rig)',              'damiki rig',                 100),
  ('Hover Jig (Damiki Rig)',              'hover jig',                  100),

  ('Shaky Head Jig',                      'shaky head',                 100),

  ('Swing Head Jig',                      'swing head',                 100),
  ('Swing Head Jig',                      'swinging jig',                90),

  ('Ball Head Jighead',                   'ball head',                  100),
  ('Ball Head Jighead',                   'jighead',                     85),
  ('Ball Head Jighead',                   'round head jig',              90),

  ('Crappie Jig',                         'crappie jig',                100),
  ('Crappie Jig',                         'marabou jig',                 90),
  ('Crappie Jig',                         'maribou jig',                 80),
  ('Crappie Jig',                         'small tube jig',              75),

  ('Panfish Jig',                         'panfish jig',                100),
  ('Panfish Jig',                         'mini jig',                    85),

  ('Ice Jig',                             'ice jig',                    100),
  ('Ice Jig',                             'jigging shad',                85),
  ('Ice Jig',                             'lindy',                       80),

  ('Jigging Rap',                         'jigging rap',                100),
  ('Jigging Rap',                         'rapala jigging rap',         100),
  ('Jigging Rap',                         'puppet minnow',               85),

  -- ============================================================
  -- spinnerbait_blade
  -- ============================================================
  ('Spinnerbait',                         'spinnerbait',                100),
  ('Spinnerbait',                         'spinner bait',               100),
  ('Spinnerbait',                         'persuader',                   75),
  ('Spinnerbait',                         'booyah spinnerbait',          85),
  ('Spinnerbait',                         'war eagle',                   80),

  ('Inline Spinner',                      'inline spinner',             100),
  ('Inline Spinner',                      'mepps',                       95),
  ('Inline Spinner',                      'mepps aglia',                 95),
  ('Inline Spinner',                      'panther martin',              90),
  ('Inline Spinner',                      'rooster tail',                95),
  ('Inline Spinner',                      'roostertail',                 95),
  ('Inline Spinner',                      'blue fox',                    85),
  ('Inline Spinner',                      'blue fox vibrax',             90),
  ('Inline Spinner',                      'vibrax',                      85),

  ('Blade Bait',                          'blade bait',                 100),
  ('Blade Bait',                          'silver buddy',                90),
  ('Blade Bait',                          'sonar',                       80),
  ('Blade Bait',                          'cicada',                      85),
  ('Blade Bait',                          'reef runner cicada',          85),

  ('Tail Spinner',                        'tail spinner',               100),
  ('Tail Spinner',                        'little george',               90),
  ('Tail Spinner',                        'mann''s little george',       90),

  ('Beetle Spin',                         'beetle spin',                100),
  ('Beetle Spin',                         'beetlespin',                 100),
  ('Beetle Spin',                         'johnson beetle spin',         90),

  ('Underspin',                           'underspin',                  100),
  ('Underspin',                           'spinning shad',               80),
  ('Underspin',                           'damiki underspin',            85),

  -- ============================================================
  -- spoon
  -- ============================================================
  ('Casting Spoon',                       'casting spoon',              100),
  ('Casting Spoon',                       'krocodile',                   90),
  ('Casting Spoon',                       'kastmaster',                  95),
  ('Casting Spoon',                       'acme kastmaster',             95),
  ('Casting Spoon',                       'dardevle',                    90),

  ('Jigging Spoon',                       'jigging spoon',              100),
  ('Jigging Spoon',                       'hopkins',                     90),
  ('Jigging Spoon',                       'hopkins spoon',               90),
  ('Jigging Spoon',                       'flat shad',                   80),

  ('Flutter Spoon',                       'flutter spoon',              100),
  ('Flutter Spoon',                       'jewel flutter',               80),

  ('Weedless Spoon',                      'weedless spoon',             100),
  ('Weedless Spoon',                      'silver minnow',               90),
  ('Weedless Spoon',                      'johnson silver minnow',       95),
  ('Weedless Spoon',                      'johnson spoon',               90),

  ('Trolling Spoon',                      'trolling spoon',             100),
  ('Trolling Spoon',                      'sutton',                      85),
  ('Trolling Spoon',                      'sutton spoon',                85),
  ('Trolling Spoon',                      'honey bee',                   80),

  ('Ice Spoon',                           'ice spoon',                  100),
  ('Ice Spoon',                           'rapala minnow spoon',         85),
  ('Ice Spoon',                           'pk spoon',                    85),
  ('Ice Spoon',                           'forage minnow',               80),

  ('Micro Spoon (Trout)',                 'micro spoon',                100),
  ('Micro Spoon (Trout)',                 'trout magnet',                85),
  ('Micro Spoon (Trout)',                 'phoebe',                      85),
  ('Micro Spoon (Trout)',                 'acme phoebe',                 90),
  ('Micro Spoon (Trout)',                 'little cleo',                 90),

  -- ============================================================
  -- hard_swimbait
  -- ============================================================
  ('Multi-Jointed Hard Swimbait',         'jointed swimbait',           100),
  ('Multi-Jointed Hard Swimbait',         'bbz',                         95),
  ('Multi-Jointed Hard Swimbait',         'bbz-1',                       95),
  ('Multi-Jointed Hard Swimbait',         'spro bbz',                    95),
  ('Multi-Jointed Hard Swimbait',         'savage gear swimbait',        90),
  ('Multi-Jointed Hard Swimbait',         'triple trout',                85),

  ('Single-Jointed Hard Swimbait',        'single jointed',             100),
  ('Single-Jointed Hard Swimbait',        'jointed swimbait small',      85),

  ('S-Waving Hard Swimbait',              's-waver hard',               100),
  ('S-Waving Hard Swimbait',              's-waver swimbait',            90),

  ('Topwater Hard Swimbait (Wake)',       'topwater swimbait',          100),
  ('Topwater Hard Swimbait (Wake)',       'wake swimbait',               95),

  -- ============================================================
  -- specialty_rig
  -- ============================================================
  ('Alabama / Umbrella Rig',              'a-rig',                      100),
  ('Alabama / Umbrella Rig',              'alabama rig',                100),
  ('Alabama / Umbrella Rig',              'umbrella rig',                95),
  ('Alabama / Umbrella Rig',              'flash mob',                   85),
  ('Alabama / Umbrella Rig',              'yumbrella',                   85),

  ('Tokyo Rig',                           'tokyo rig',                  100),
  ('Tokyo Rig',                           'tokyo',                       85),

  ('Punch Rig',                           'punch rig',                  100),
  ('Punch Rig',                           'flipping rig',                75),

  -- ============================================================
  -- musky_pike_specific
  -- ============================================================
  ('Musky Bucktail',                      'bucktail',                    90),
  ('Musky Bucktail',                      'musky bucktail',             100),
  ('Musky Bucktail',                      'mepps musky killer',          95),
  ('Musky Bucktail',                      'joe bucher',                  85),
  ('Musky Bucktail',                      'buchertail',                  85),

  ('Double-Bladed Spinner (Cowgirl)',     'cowgirl',                    100),
  ('Double-Bladed Spinner (Cowgirl)',     'double cowgirl',              95),
  ('Double-Bladed Spinner (Cowgirl)',     'lake x cowgirl',              90),
  ('Double-Bladed Spinner (Cowgirl)',     'llungen dc9',                 90),
  ('Double-Bladed Spinner (Cowgirl)',     'double 9',                    85),

  ('Musky Glide Bait',                    'phantom glide',               90),
  ('Musky Glide Bait',                    'hellhound',                   90),
  ('Musky Glide Bait',                    'slammer glide',               85),
  ('Musky Glide Bait',                    'musky glide',                 95),

  ('Musky Jerkbait',                      'suick',                       95),
  ('Musky Jerkbait',                      'phantom softail',             85),
  ('Musky Jerkbait',                      'bobbie bait',                 85),
  ('Musky Jerkbait',                      'burt',                        80),
  ('Musky Jerkbait',                      'musky jerkbait',             100),

  ('Musky Crankbait',                     'believer',                    95),
  ('Musky Crankbait',                     'grandma',                     90),
  ('Musky Crankbait',                     'musky crankbait',            100),

  ('Musky Topwater',                      'topraider',                   90),
  ('Musky Topwater',                      'pacemaker surface',           85),
  ('Musky Topwater',                      'hawg wobbler',                85),
  ('Musky Topwater',                      'lemontail',                   85),
  ('Musky Topwater',                      'lake x toad',                 85),

  ('Musky Soft Swimbait (Bull Dawg)',     'bull dawg',                  100),
  ('Musky Soft Swimbait (Bull Dawg)',     'bulldawg',                   100),
  ('Musky Soft Swimbait (Bull Dawg)',     'medussa',                     90),
  ('Musky Soft Swimbait (Bull Dawg)',     'pounder',                     85),
  ('Musky Soft Swimbait (Bull Dawg)',     'magnum bull',                 85),

  ('Musky Pull Bait',                     'pacemaker',                   90),
  ('Musky Pull Bait',                     'pull bait',                  100),

  ('Magnum Tube',                         'magnum tube',                100),
  ('Magnum Tube',                         'big tube',                    85),
  ('Magnum Tube',                         'musky tube',                  95),

  ('Big Hair Jig (Musky-sized)',          'musky hair jig',             100),
  ('Big Hair Jig (Musky-sized)',          'big hair',                    85),

  ('Musky Topwater Swimbait',             'topwater bull',               90),
  ('Musky Topwater Swimbait',             'musky wakebait',              90)
) as na(canonical_name, alias_text, weight)
  on lc.canonical_name = na.canonical_name
on conflict (lure_id, normalized_alias) do nothing;
