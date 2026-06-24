-- Creator portal analytics: backfill signup funnel events and void pre-link-only orphan ledger rows.

insert into public.referral_funnel_events (referral_click_id, creator_id, event_type)
select ua.referral_click_id, ua.creator_id, 'signup'
from public.user_attributions ua
where ua.referral_click_id is not null
  and ua.status = 'active'
  and not exists (
    select 1
    from public.referral_funnel_events rfe
    where rfe.referral_click_id = ua.referral_click_id
      and rfe.event_type = 'signup'
  );

update public.creator_commission_ledger l
set
  status = 'void',
  notes = coalesce(l.notes, '') ||
    case when l.notes is null or l.notes = '' then '' else ' ' end ||
    'voided: pre-link-only sandbox test row without user attribution'
from public.creators c
where l.creator_id = c.id
  and c.slug = 'brandon'
  and l.user_attribution_id is null
  and l.user_id is null
  and l.status <> 'void';
