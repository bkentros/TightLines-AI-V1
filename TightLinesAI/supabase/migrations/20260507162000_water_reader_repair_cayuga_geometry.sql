-- Repair the 3DHP Cayuga Lake polygon imported with a self-intersection.
-- This keeps the row searchable/openable without changing the source identity.

update public.waterbody_index
set geometry = st_multi(st_collectionextract(st_makevalid(geometry), 3))
where id = 'c836d66f-703b-4ccb-b1ff-aacf43a2b7e5'
  and not st_isvalid(geometry);

