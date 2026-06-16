-- Allow per-creator commission deals from 20% to 50% of net proceeds.

alter table public.creators
  drop constraint if exists creators_commission_rate_bps_check;

alter table public.creators
  add constraint creators_commission_rate_bps_check
  check (commission_rate_bps between 2000 and 5000);

alter table public.user_attributions
  drop constraint if exists user_attributions_commission_rate_bps_snapshot_check;

alter table public.user_attributions
  add constraint user_attributions_commission_rate_bps_snapshot_check
  check (commission_rate_bps_snapshot between 2000 and 5000);

alter table public.creator_commission_ledger
  drop constraint if exists creator_commission_ledger_commission_rate_bps_check;

alter table public.creator_commission_ledger
  add constraint creator_commission_ledger_commission_rate_bps_check
  check (commission_rate_bps between 2000 and 5000);
