-- Instally smart-link integration for creator install attribution.

alter table public.creators
  add column if not exists instally_link_slug text;

alter table public.creators
  add constraint creators_instally_link_slug_check
  check (
    instally_link_slug is null
    or instally_link_slug ~ '^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]$'
  );

create unique index if not exists creators_instally_link_slug_unique_idx
  on public.creators (instally_link_slug)
  where instally_link_slug is not null;

alter table public.referral_clicks
  add column if not exists instally_click_id text;

alter table public.user_attributions
  add column if not exists instally_click_id text;

alter table public.user_attributions
  drop constraint if exists user_attributions_attribution_source_check;

alter table public.user_attributions
  add constraint user_attributions_attribution_source_check
  check (attribution_source in (
    'app_store_offer_code',
    'direct_link',
    'instally',
    'manual_admin',
    'revenuecat_offer_code'
  ));

-- First production Instally link (brandon creator).
update public.creators
set instally_link_slug = 'rucr9w'
where slug = 'brandon'
  and instally_link_slug is null;
