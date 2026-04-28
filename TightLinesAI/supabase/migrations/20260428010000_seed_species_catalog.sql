-- Seed species_catalog with the curated mainland-USA freshwater + brackish +
-- saltwater-inshore species list. 16 UX families, ~145 species.
--
-- engine_canonical_id is set only when the row IS the engine canonical species
-- or is a strain of one (e.g., florida_bass -> largemouth_bass). True hybrids
-- (meanmouth, tiger_muskie, tiger_trout, splake, hybrid_striped_bass), distinct
-- species the engine doesn't model, and species the engine doesn't yet cover
-- (walleye, salmon, etc.) are left null.
--
-- search_priority convention: lower surfaces higher in typeahead.
--   100-400  : highly common
--   400-700  : common
--   700-1100 : regional / less common
--   1100+    : niche / strain / hybrid
--
-- Idempotent: on conflict updates so re-running absorbs edits.
-- Aliases live in lure_aliases-style sub-step (not this migration).

insert into public.species_catalog
  (id, display_name, family, engine_canonical_id, search_priority)
values
  -- ============================================================
  -- bass (Micropterus — black basses)
  -- ============================================================
  ('largemouth_bass',         'Largemouth Bass',         'bass',              'largemouth_bass', 100),
  ('smallmouth_bass',         'Smallmouth Bass',         'bass',              'smallmouth_bass', 110),
  ('spotted_bass',            'Spotted Bass',            'bass',              null,              350),
  ('florida_bass',            'Florida Bass',            'bass',              'largemouth_bass', 600),
  ('alabama_bass',            'Alabama Bass',            'bass',              null,              700),
  ('meanmouth_bass',          'Meanmouth Bass',          'bass',              null,              900),
  ('shoal_bass',              'Shoal Bass',              'bass',              null,             1100),
  ('redeye_bass',             'Redeye Bass',             'bass',              null,             1200),
  ('guadalupe_bass',          'Guadalupe Bass',          'bass',              null,             1300),
  ('suwannee_bass',           'Suwannee Bass',           'bass',              null,             1400),
  ('choctaw_bass',            'Choctaw Bass',            'bass',              null,             1500),

  -- ============================================================
  -- panfish (sunfishes; Centrarchidae minus Micropterus and Pomoxis)
  -- ============================================================
  ('bluegill',                'Bluegill',                'panfish',           null,              130),
  ('redear_sunfish',          'Redear Sunfish',          'panfish',           null,              250),
  ('pumpkinseed',             'Pumpkinseed',             'panfish',           null,              280),
  ('rock_bass',               'Rock Bass',               'panfish',           null,              300),
  ('green_sunfish',           'Green Sunfish',           'panfish',           null,              400),
  ('redbreast_sunfish',       'Redbreast Sunfish',       'panfish',           null,              500),
  ('longear_sunfish',         'Longear Sunfish',         'panfish',           null,              550),
  ('warmouth',                'Warmouth',                'panfish',           null,              600),
  ('hybrid_bluegill',         'Hybrid Bluegill',         'panfish',           null,              800),
  ('spotted_sunfish',         'Spotted Sunfish',         'panfish',           null,             1100),
  ('sacramento_perch',        'Sacramento Perch',        'panfish',           null,             1200),
  ('flier',                   'Flier',                   'panfish',           null,             1300),
  ('coppernose_bluegill',     'Coppernose Bluegill',     'panfish',           null,             1500),

  -- ============================================================
  -- crappie (Pomoxis)
  -- ============================================================
  ('black_crappie',           'Black Crappie',           'crappie',           null,              200),
  ('white_crappie',           'White Crappie',           'crappie',           null,              220),
  ('magnolia_crappie',        'Magnolia Crappie',        'crappie',           null,             1100),
  ('blacknose_crappie',       'Blacknose Crappie',       'crappie',           null,             1300),

  -- ============================================================
  -- walleye_perch (Percidae minus darters)
  -- ============================================================
  ('walleye',                 'Walleye',                 'walleye_perch',     null,              130),
  ('yellow_perch',            'Yellow Perch',            'walleye_perch',     null,              180),
  ('sauger',                  'Sauger',                  'walleye_perch',     null,              600),
  ('saugeye',                 'Saugeye',                 'walleye_perch',     null,              700),

  -- ============================================================
  -- pike_muskie (Esocidae)
  -- ============================================================
  ('northern_pike',           'Northern Pike',           'pike_muskie',       'northern_pike',   150),
  ('muskellunge',             'Muskellunge',             'pike_muskie',       null,              200),
  ('chain_pickerel',          'Chain Pickerel',          'pike_muskie',       null,              300),
  ('tiger_muskie',            'Tiger Muskie',            'pike_muskie',       null,              350),
  ('redfin_pickerel',         'Redfin Pickerel',         'pike_muskie',       null,             1100),
  ('grass_pickerel',          'Grass Pickerel',          'pike_muskie',       null,             1300),

  -- ============================================================
  -- catfish (Ictaluridae)
  -- ============================================================
  ('channel_catfish',         'Channel Catfish',         'catfish',           null,              150),
  ('blue_catfish',            'Blue Catfish',            'catfish',           null,              250),
  ('flathead_catfish',        'Flathead Catfish',        'catfish',           null,              280),
  ('yellow_bullhead',         'Yellow Bullhead',         'catfish',           null,              600),
  ('brown_bullhead',          'Brown Bullhead',          'catfish',           null,              650),
  ('black_bullhead',          'Black Bullhead',          'catfish',           null,              700),
  ('white_catfish',           'White Catfish',           'catfish',           null,             1000),

  -- ============================================================
  -- striped_white_bass (Moronidae — temperate basses)
  -- ============================================================
  ('striped_bass',            'Striped Bass',            'striped_white_bass', null,             180),
  ('hybrid_striped_bass',     'Hybrid Striped Bass',     'striped_white_bass', null,             280),
  ('white_bass',              'White Bass',              'striped_white_bass', null,             300),
  ('white_perch',             'White Perch',             'striped_white_bass', null,             500),
  ('yellow_bass',             'Yellow Bass',             'striped_white_bass', null,             700),

  -- ============================================================
  -- gar_bowfin (primitive predators)
  -- ============================================================
  ('alligator_gar',           'Alligator Gar',           'gar_bowfin',        null,              400),
  ('bowfin',                  'Bowfin',                  'gar_bowfin',        null,              500),
  ('longnose_gar',            'Longnose Gar',            'gar_bowfin',        null,              600),
  ('spotted_gar',             'Spotted Gar',             'gar_bowfin',        null,              700),
  ('shortnose_gar',           'Shortnose Gar',           'gar_bowfin',        null,              900),
  ('florida_gar',             'Florida Gar',             'gar_bowfin',        null,             1000),

  -- ============================================================
  -- cichlid (introduced FL/TX/AZ/CA exotics)
  -- ============================================================
  ('peacock_bass',            'Butterfly Peacock Bass',  'cichlid',           null,              300),
  ('mayan_cichlid',           'Mayan Cichlid',           'cichlid',           null,              700),
  ('blue_tilapia',            'Blue Tilapia',            'cichlid',           null,              800),
  ('oscar',                   'Oscar',                   'cichlid',           null,              900),
  ('nile_tilapia',            'Nile Tilapia',            'cichlid',           null,             1100),
  ('mozambique_tilapia',      'Mozambique Tilapia',      'cichlid',           null,             1200),
  ('redbelly_tilapia',        'Redbelly Tilapia',        'cichlid',           null,             1300),
  ('jaguar_guapote',          'Jaguar Guapote',          'cichlid',           null,             1400),

  -- ============================================================
  -- trout_char (Salmonidae minus Oncorhynchus salmon spp.)
  -- ============================================================
  ('rainbow_trout',           'Rainbow Trout',           'trout_char',        'trout',           130),
  ('brown_trout',             'Brown Trout',             'trout_char',        'trout',           150),
  ('brook_trout',             'Brook Trout',             'trout_char',        'trout',           170),
  ('steelhead',               'Steelhead',               'trout_char',        'trout',           200),
  ('lake_trout',              'Lake Trout',              'trout_char',        null,              250),
  ('cutthroat_trout',         'Cutthroat Trout',         'trout_char',        'trout',           280),
  ('tiger_trout',             'Tiger Trout',             'trout_char',        null,              600),
  ('bull_trout',              'Bull Trout',              'trout_char',        null,              700),
  ('splake',                  'Splake',                  'trout_char',        null,              750),
  ('dolly_varden',            'Dolly Varden',            'trout_char',        null,              800),
  ('mountain_whitefish',      'Mountain Whitefish',      'trout_char',        null,              800),
  ('golden_trout',            'Golden Trout',            'trout_char',        null,              900),
  ('arctic_char',             'Arctic Char',             'trout_char',        null,             1100),

  -- ============================================================
  -- salmon (Oncorhynchus + Salmo salar)
  -- ============================================================
  ('chinook_salmon',          'Chinook Salmon',          'salmon',            null,              200),
  ('coho_salmon',             'Coho Salmon',             'salmon',            null,              250),
  ('sockeye_salmon',          'Sockeye Salmon',          'salmon',            null,              350),
  ('atlantic_salmon',         'Atlantic Salmon',         'salmon',            null,              400),
  ('kokanee',                 'Kokanee',                 'salmon',            null,              450),
  ('landlocked_atlantic_salmon', 'Landlocked Atlantic Salmon', 'salmon',      null,              500),
  ('pink_salmon',             'Pink Salmon',             'salmon',            null,              600),
  ('chum_salmon',             'Chum Salmon',             'salmon',            null,              800),

  -- ============================================================
  -- carp_roughfish (Cyprinidae carps + Catostomidae buffalo/suckers + drum)
  -- ============================================================
  ('common_carp',             'Common Carp',             'carp_roughfish',    null,              250),
  ('grass_carp',              'Grass Carp',              'carp_roughfish',    null,              400),
  ('freshwater_drum',         'Freshwater Drum',         'carp_roughfish',    null,              500),
  ('smallmouth_buffalo',      'Smallmouth Buffalo',      'carp_roughfish',    null,              600),
  ('bigmouth_buffalo',        'Bigmouth Buffalo',        'carp_roughfish',    null,              700),
  ('white_sucker',            'White Sucker',            'carp_roughfish',    null,              800),
  ('redhorse_sucker',         'Redhorse Sucker',         'carp_roughfish',    null,              900),
  ('mirror_carp',             'Mirror Carp',             'carp_roughfish',    null,             1000),
  ('bighead_carp',            'Bighead Carp',            'carp_roughfish',    null,             1100),
  ('silver_carp',             'Silver Carp',             'carp_roughfish',    null,             1200),
  ('black_buffalo',           'Black Buffalo',           'carp_roughfish',    null,             1300),
  ('goldfish',                'Goldfish',                'carp_roughfish',    null,             1500),
  ('black_carp',              'Black Carp',              'carp_roughfish',    null,             1500),
  ('northern_hogsucker',      'Northern Hog Sucker',     'carp_roughfish',    null,             1500),
  ('koi',                     'Koi',                     'carp_roughfish',    null,             1700),
  ('leather_carp',            'Leather Carp',            'carp_roughfish',    null,             1800),

  -- ============================================================
  -- saltwater_inshore (shore / kayak / jetty / inshore-boat targets)
  -- ============================================================
  ('redfish',                 'Redfish',                 'saltwater_inshore', null,              200),
  ('speckled_trout',          'Speckled Trout',          'saltwater_inshore', null,              220),
  ('snook',                   'Snook',                   'saltwater_inshore', null,              300),
  ('sheepshead',              'Sheepshead',              'saltwater_inshore', null,              350),
  ('black_drum',              'Black Drum',              'saltwater_inshore', null,              380),
  ('summer_flounder',         'Summer Flounder (Fluke)', 'saltwater_inshore', null,              400),
  ('tarpon',                  'Tarpon',                  'saltwater_inshore', null,              400),
  ('bluefish',                'Bluefish',                'saltwater_inshore', null,              450),
  ('spanish_mackerel',        'Spanish Mackerel',        'saltwater_inshore', null,              500),
  ('mangrove_snapper',        'Mangrove Snapper',        'saltwater_inshore', null,              550),
  ('cobia',                   'Cobia',                   'saltwater_inshore', null,              600),
  ('pompano',                 'Pompano',                 'saltwater_inshore', null,              600),
  ('weakfish',                'Weakfish',                'saltwater_inshore', null,              700),
  ('southern_flounder',       'Southern Flounder',       'saltwater_inshore', null,              700),
  ('crevalle_jack',           'Crevalle Jack',           'saltwater_inshore', null,              700),
  ('permit',                  'Permit',                  'saltwater_inshore', null,              750),
  ('bonefish',                'Bonefish',                'saltwater_inshore', null,              800),
  ('atlantic_croaker',        'Atlantic Croaker',        'saltwater_inshore', null,              800),
  ('ladyfish',                'Ladyfish',                'saltwater_inshore', null,              800),
  ('false_albacore',          'False Albacore',          'saltwater_inshore', null,              850),
  ('winter_flounder',         'Winter Flounder',         'saltwater_inshore', null,             1000),
  ('southern_kingfish',       'Southern Kingfish',       'saltwater_inshore', null,             1000),
  ('spadefish',               'Spadefish',               'saltwater_inshore', null,             1100),
  ('gray_triggerfish',        'Gray Triggerfish',        'saltwater_inshore', null,             1100),
  ('gulf_flounder',           'Gulf Flounder',           'saltwater_inshore', null,             1200),
  ('atlantic_bonito',         'Atlantic Bonito',         'saltwater_inshore', null,             1200),

  -- ============================================================
  -- sturgeon_paddlefish (Acipenseridae + Polyodontidae)
  -- ============================================================
  ('white_sturgeon',          'White Sturgeon',          'sturgeon_paddlefish', null,            600),
  ('lake_sturgeon',           'Lake Sturgeon',           'sturgeon_paddlefish', null,            700),
  ('paddlefish',              'Paddlefish',              'sturgeon_paddlefish', null,            800),
  ('atlantic_sturgeon',       'Atlantic Sturgeon',       'sturgeon_paddlefish', null,           1100),
  ('shortnose_sturgeon',      'Shortnose Sturgeon',      'sturgeon_paddlefish', null,           1200),
  ('gulf_sturgeon',           'Gulf Sturgeon',           'sturgeon_paddlefish', null,           1300),

  -- ============================================================
  -- shad_herring (Alosinae + Osmeridae)
  -- ============================================================
  ('american_shad',           'American Shad',           'shad_herring',      null,              400),
  ('hickory_shad',            'Hickory Shad',            'shad_herring',      null,              700),
  ('rainbow_smelt',           'Rainbow Smelt',           'shad_herring',      null,              800),
  ('alewife',                 'Alewife',                 'shad_herring',      null,             1200),
  ('blueback_herring',        'Blueback Herring',        'shad_herring',      null,             1300),

  -- ============================================================
  -- other_freshwater (snakehead, eel, burbot, mooneye, fallfish, etc.)
  -- ============================================================
  ('northern_snakehead',      'Northern Snakehead',      'other_freshwater',  null,              350),
  ('burbot',                  'Burbot',                  'other_freshwater',  null,              600),
  ('american_eel',            'American Eel',            'other_freshwater',  null,              700),
  ('bullseye_snakehead',      'Bullseye Snakehead',      'other_freshwater',  null,              800),
  ('goldeye',                 'Goldeye',                 'other_freshwater',  null,             1200),
  ('mooneye',                 'Mooneye',                 'other_freshwater',  null,             1300),
  ('fallfish',                'Fallfish',                'other_freshwater',  null,             1500)
on conflict (id) do update set
  display_name        = excluded.display_name,
  family              = excluded.family,
  engine_canonical_id = excluded.engine_canonical_id,
  search_priority     = excluded.search_priority,
  updated_at          = timezone('utc', now());
