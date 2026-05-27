-- Creator program foundation: attribution, App Store offer code mirrors,
-- RevenueCat purchase history, and auditable commission ledger.

create or replace function public.normalize_creator_code(raw_code text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(regexp_replace(upper(trim(coalesce(raw_code, ''))), '[^A-Z0-9]', '', 'g'), '')
$$;

create or replace function public.creator_net_proceeds_usd(
  price_usd numeric,
  tax_percentage numeric,
  commission_percentage numeric
)
returns numeric
language sql
immutable
set search_path = public
as $$
  select case
    when price_usd is null then null
    else round(
      price_usd *
      greatest(0::numeric, 1 - coalesce(tax_percentage, 0) - coalesce(commission_percentage, 0)),
      4
    )
  end
$$;

create or replace function public.creator_commission_amount_usd(
  net_proceeds_usd numeric,
  commission_rate_bps integer
)
returns numeric
language sql
immutable
set search_path = public
as $$
  select case
    when net_proceeds_usd is null or commission_rate_bps is null then null
    else round(net_proceeds_usd * (commission_rate_bps::numeric / 10000), 4)
  end
$$;

create table public.creators (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null unique,
  email text,
  owner_user_id uuid references auth.users(id) on delete set null,
  commission_rate_bps integer not null default 2500
    check (commission_rate_bps between 2500 and 3500),
  commission_month_cap integer not null default 12
    check (commission_month_cap between 1 and 12),
  status text not null default 'active'
    check (status in ('active', 'paused', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slug = lower(slug)),
  check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$')
);

create trigger creators_updated_at
  before update on public.creators
  for each row execute procedure public.handle_updated_at();

create table public.creator_codes (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  code text not null unique,
  code_type text not null default 'app_store_offer_code'
    check (code_type in ('app_store_offer_code', 'manual_tracking')),
  subscription_product_id text,
  app_store_offer_reference_name text,
  apple_app_id text,
  app_store_redemption_url text,
  discount_percent numeric(5,2) not null default 10.00
    check (discount_percent = 10.00),
  discount_duration_months integer not null default 3
    check (discount_duration_months = 3),
  discount_billing_mode text not null default 'pay_as_you_go'
    check (discount_billing_mode = 'pay_as_you_go'),
  max_redemptions integer check (max_redemptions is null or max_redemptions > 0),
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (code = public.normalize_creator_code(code)),
  check (code ~ '^[A-Z0-9]{3,64}$'),
  check (expires_at is null or starts_at is null or expires_at > starts_at),
  check (
    is_active = false
    or code_type <> 'app_store_offer_code'
    or (
      app_store_offer_reference_name is not null
      and apple_app_id is not null
      and app_store_redemption_url is not null
    )
  )
);

create trigger creator_codes_updated_at
  before update on public.creator_codes
  for each row execute procedure public.handle_updated_at();

create table public.referral_clicks (
  id uuid primary key default gen_random_uuid(),
  click_token uuid not null unique default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete set null,
  creator_code_id uuid references public.creator_codes(id) on delete set null,
  code text,
  landing_path text,
  destination_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  referrer_host text,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz not null default now(),
  check (code is null or code = public.normalize_creator_code(code)),
  check (creator_id is not null or creator_code_id is not null or code is not null)
);

create table public.user_attributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete restrict,
  creator_code_id uuid references public.creator_codes(id) on delete set null,
  referral_click_id uuid references public.referral_clicks(id) on delete set null,
  attribution_source text not null
    check (attribution_source in (
      'app_store_offer_code',
      'direct_link',
      'manual_admin',
      'revenuecat_offer_code'
    )),
  code text,
  commission_rate_bps_snapshot integer not null
    check (commission_rate_bps_snapshot between 2500 and 3500),
  commission_month_cap_snapshot integer not null default 12
    check (commission_month_cap_snapshot between 1 and 12),
  status text not null default 'active'
    check (status in ('active', 'revoked')),
  attributed_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id),
  check (code is null or code = public.normalize_creator_code(code)),
  check (revoked_at is null or status = 'revoked')
);

create trigger user_attributions_updated_at
  before update on public.user_attributions
  for each row execute procedure public.handle_updated_at();

create table public.revenuecat_events (
  id text primary key,
  event_type text not null,
  app_user_id text,
  original_app_user_id text,
  aliases text[] not null default '{}',
  transaction_id text,
  original_transaction_id text,
  product_id text,
  entitlement_ids text[] not null default '{}',
  store text,
  environment text,
  period_type text,
  offer_code text,
  renewal_number integer,
  currency text,
  price_usd numeric(12,4),
  price_in_purchased_currency numeric(12,4),
  tax_percentage numeric(9,6),
  commission_percentage numeric(9,6),
  event_timestamp_at timestamptz,
  purchased_at timestamptz,
  expiration_at timestamptz,
  raw_event jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_status text not null default 'received'
    check (processing_status in ('received', 'processed', 'ignored', 'failed')),
  processing_error text
);

create table public.subscription_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  revenuecat_event_id text not null references public.revenuecat_events(id) on delete restrict,
  transaction_id text not null,
  original_transaction_id text,
  product_id text,
  store text,
  environment text,
  event_type text not null,
  period_type text,
  renewal_number integer,
  offer_code text,
  period_start_at timestamptz,
  period_end_at timestamptz,
  currency text,
  gross_revenue_usd numeric(12,4),
  tax_percentage numeric(9,6),
  store_commission_percentage numeric(9,6),
  net_proceeds_usd numeric(12,4) generated always as (
    public.creator_net_proceeds_usd(
      gross_revenue_usd,
      tax_percentage,
      store_commission_percentage
    )
  ) stored,
  created_at timestamptz not null default now(),
  unique (revenuecat_event_id),
  unique (transaction_id, event_type)
);

create table public.creator_payout_batches (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  status text not null default 'draft'
    check (status in ('draft', 'paid', 'void')),
  period_start_at timestamptz,
  period_end_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger creator_payout_batches_updated_at
  before update on public.creator_payout_batches
  for each row execute procedure public.handle_updated_at();

create table public.creator_commission_ledger (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete restrict,
  creator_code_id uuid references public.creator_codes(id) on delete set null,
  user_attribution_id uuid references public.user_attributions(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  subscription_period_id uuid not null references public.subscription_periods(id) on delete restrict,
  revenuecat_event_id text not null references public.revenuecat_events(id) on delete restrict,
  transaction_id text not null,
  original_transaction_id text,
  product_id text,
  event_type text not null,
  earning_month_number integer not null check (earning_month_number between 1 and 12),
  commission_rate_bps integer not null check (commission_rate_bps between 2500 and 3500),
  gross_revenue_usd numeric(12,4),
  tax_percentage numeric(9,6),
  store_commission_percentage numeric(9,6),
  net_proceeds_usd numeric(12,4),
  commission_amount_usd numeric(12,4) generated always as (
    public.creator_commission_amount_usd(net_proceeds_usd, commission_rate_bps)
  ) stored,
  currency text not null default 'USD',
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'paid', 'reversed', 'void')),
  eligible_at timestamptz not null default (now() + interval '30 days'),
  approved_at timestamptz,
  paid_at timestamptz,
  payout_batch_id uuid references public.creator_payout_batches(id) on delete set null,
  reversal_of uuid references public.creator_commission_ledger(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (paid_at is null or status = 'paid'),
  check (approved_at is null or status in ('approved', 'paid')),
  check (reversal_of is null or status = 'reversed')
);

create trigger creator_commission_ledger_updated_at
  before update on public.creator_commission_ledger
  for each row execute procedure public.handle_updated_at();

create unique index creator_commission_ledger_one_positive_per_period
  on public.creator_commission_ledger(subscription_period_id, creator_id)
  where reversal_of is null;

create index creators_status_idx
  on public.creators(status);

create index creator_codes_creator_idx
  on public.creator_codes(creator_id);

create index creator_codes_active_idx
  on public.creator_codes(code)
  where is_active = true;

create index referral_clicks_creator_created_idx
  on public.referral_clicks(creator_id, created_at desc);

create index user_attributions_creator_idx
  on public.user_attributions(creator_id, attributed_at desc);

create index revenuecat_events_app_user_idx
  on public.revenuecat_events(app_user_id);

create index revenuecat_events_original_app_user_idx
  on public.revenuecat_events(original_app_user_id);

create index revenuecat_events_transaction_idx
  on public.revenuecat_events(transaction_id);

create index revenuecat_events_offer_code_idx
  on public.revenuecat_events(offer_code)
  where offer_code is not null;

create index subscription_periods_user_idx
  on public.subscription_periods(user_id, period_start_at desc);

create index subscription_periods_original_transaction_idx
  on public.subscription_periods(original_transaction_id, period_start_at desc);

create index creator_commission_ledger_creator_status_idx
  on public.creator_commission_ledger(creator_id, status, eligible_at);

create index creator_commission_ledger_user_idx
  on public.creator_commission_ledger(user_id);

alter table public.creators enable row level security;
alter table public.creator_codes enable row level security;
alter table public.referral_clicks enable row level security;
alter table public.user_attributions enable row level security;
alter table public.revenuecat_events enable row level security;
alter table public.subscription_periods enable row level security;
alter table public.creator_payout_batches enable row level security;
alter table public.creator_commission_ledger enable row level security;

create policy "creators_service_role_all"
  on public.creators for all
  to service_role
  using (true)
  with check (true);

create policy "creator_codes_service_role_all"
  on public.creator_codes for all
  to service_role
  using (true)
  with check (true);

create policy "referral_clicks_service_role_all"
  on public.referral_clicks for all
  to service_role
  using (true)
  with check (true);

create policy "user_attributions_service_role_all"
  on public.user_attributions for all
  to service_role
  using (true)
  with check (true);

create policy "revenuecat_events_service_role_all"
  on public.revenuecat_events for all
  to service_role
  using (true)
  with check (true);

create policy "subscription_periods_service_role_all"
  on public.subscription_periods for all
  to service_role
  using (true)
  with check (true);

create policy "creator_payout_batches_service_role_all"
  on public.creator_payout_batches for all
  to service_role
  using (true)
  with check (true);

create policy "creator_commission_ledger_service_role_all"
  on public.creator_commission_ledger for all
  to service_role
  using (true)
  with check (true);

revoke all on table public.creators from anon, authenticated;
revoke all on table public.creator_codes from anon, authenticated;
revoke all on table public.referral_clicks from anon, authenticated;
revoke all on table public.user_attributions from anon, authenticated;
revoke all on table public.revenuecat_events from anon, authenticated;
revoke all on table public.subscription_periods from anon, authenticated;
revoke all on table public.creator_payout_batches from anon, authenticated;
revoke all on table public.creator_commission_ledger from anon, authenticated;
