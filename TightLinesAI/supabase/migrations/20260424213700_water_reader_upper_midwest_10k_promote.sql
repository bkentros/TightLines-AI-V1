-- Chunked 10k regional Water Reader 3DHP proof import.
-- Generated from tmp/water-reader/3dhp-upper-midwest-10k-bbox-aligned.sql.
-- This is a controlled regional proof, not a national load.
begin;

select *
from water_reader_private.promote_usgs_3dhp_waterbodies(
  '4750c644-6d4d-4946-adf9-aa2bd001cae7'::uuid,
  0
);

commit;
