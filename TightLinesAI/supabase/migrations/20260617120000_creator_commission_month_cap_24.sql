-- Per-creator earning month cap: allow 12 or 24 months (snapshotted at attribution).

alter table public.creators
  drop constraint if exists creators_commission_month_cap_check;

alter table public.creators
  add constraint creators_commission_month_cap_check
  check (commission_month_cap in (12, 24));

alter table public.user_attributions
  drop constraint if exists user_attributions_commission_month_cap_snapshot_check;

alter table public.user_attributions
  add constraint user_attributions_commission_month_cap_snapshot_check
  check (commission_month_cap_snapshot in (12, 24));

alter table public.creator_commission_ledger
  drop constraint if exists creator_commission_ledger_earning_month_number_check;

alter table public.creator_commission_ledger
  add constraint creator_commission_ledger_earning_month_number_check
  check (earning_month_number between 1 and 24);
