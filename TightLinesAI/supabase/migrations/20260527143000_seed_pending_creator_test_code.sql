-- Temporary creator-program seed for development and launch testing.
-- Keep inactive until App Store Connect allows the real custom offer code.

with creator_upsert as (
  insert into public.creators (
    display_name,
    slug,
    commission_rate_bps,
    commission_month_cap,
    status,
    notes
  )
  values (
    'Launch Test Creator',
    'launch-test-creator',
    2500,
    12,
    'active',
    'Temporary seed creator for validating the creator-code attribution pipeline before public launch.'
  )
  on conflict (slug) do update
    set display_name = excluded.display_name,
        commission_rate_bps = excluded.commission_rate_bps,
        commission_month_cap = excluded.commission_month_cap,
        status = excluded.status,
        notes = excluded.notes,
        updated_at = now()
  returning id
)
insert into public.creator_codes (
  creator_id,
  code,
  code_type,
  subscription_product_id,
  app_store_offer_reference_name,
  apple_app_id,
  app_store_redemption_url,
  discount_percent,
  discount_duration_months,
  discount_billing_mode,
  is_active
)
select
  creator_upsert.id,
  'TEST10',
  'app_store_offer_code',
  'finfindr_angler_monthly',
  'Creator 10 Off 3 Months',
  '6769178136',
  'https://apps.apple.com/redeem?ctx=offercodes&id=6769178136&code=TEST10',
  10.00,
  3,
  'pay_as_you_go',
  false
from creator_upsert
on conflict (code) do update
  set creator_id = excluded.creator_id,
      code_type = excluded.code_type,
      subscription_product_id = excluded.subscription_product_id,
      app_store_offer_reference_name = excluded.app_store_offer_reference_name,
      apple_app_id = excluded.apple_app_id,
      app_store_redemption_url = excluded.app_store_redemption_url,
      discount_percent = excluded.discount_percent,
      discount_duration_months = excluded.discount_duration_months,
      discount_billing_mode = excluded.discount_billing_mode,
      updated_at = now();
