-- ReliefChain — Supabase schema
-- Run in the Supabase SQL editor. Every table has RLS enabled.

create extension if not exists "pgcrypto";

-- Roles: admin, ngo, company, government, volunteer, donor
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'donor'
    check (role in ('admin','ngo','company','government','volunteer','donor')),
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists organisations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null,
  name text not null,
  kind text not null check (kind in ('NGO','PWD Company','Government Body','Volunteer Group')),
  reg_number text not null unique,
  focus text not null,
  region text not null,
  verified boolean not null default false,
  responders int not null default 0,
  funds_raised bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists org_registrations (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  org_name text not null,
  kind text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  region text not null,
  reg_number text not null,
  focus text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

create table if not exists disasters (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid references profiles(id),
  title text not null,
  type text not null,
  severity text not null check (severity in ('critical','high','moderate')),
  status text not null default 'active' check (status in ('active','contained','resolved')),
  region text not null,
  state text not null,
  affected int not null default 0,
  summary text not null,
  lat double precision,
  lng double precision,
  reported_at timestamptz not null default now()
);

create table if not exists tenders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  disaster_id uuid not null references disasters(id) on delete cascade,
  org_id uuid references organisations(id),
  title text not null,
  region text not null,
  budget bigint not null,
  status text not null default 'Open'
    check (status in ('Open','Claimed','In Progress','Completed')),
  skills text[] not null default '{}',
  closes_at date not null,
  created_at timestamptz not null default now()
);

create table if not exists donations (
  id uuid primary key default gen_random_uuid(),
  receipt_id text not null unique,
  disaster_id uuid references disasters(id),
  email text not null,
  amount bigint not null check (amount >= 100),
  status text not null default 'pledged'
    check (status in ('pledged','captured','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists funds_ledger (
  id uuid primary key default gen_random_uuid(),
  txn_ref text not null unique,
  disaster_id uuid references disasters(id),
  org_id uuid references organisations(id),
  note text not null,
  amount bigint not null, -- positive = credit, negative = debit
  approved_by_1 uuid references profiles(id),
  approved_by_2 uuid references profiles(id), -- dual approval for debits > 500000
  created_at timestamptz not null default now()
);

create table if not exists alert_dispatch_log (
  id uuid primary key default gen_random_uuid(),
  disaster_id uuid not null references disasters(id) on delete cascade,
  org_id uuid not null references organisations(id),
  channel text not null check (channel in ('sms','email','dashboard','voice')),
  delivered_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_disasters_status on disasters(status);
create index if not exists idx_tenders_disaster on tenders(disaster_id);
create index if not exists idx_orgs_region on organisations(region);
create index if not exists idx_dispatch_disaster on alert_dispatch_log(disaster_id);

-- ---------- Row Level Security ----------
alter table profiles enable row level security;
alter table organisations enable row level security;
alter table org_registrations enable row level security;
alter table disasters enable row level security;
alter table tenders enable row level security;
alter table donations enable row level security;
alter table funds_ledger enable row level security;
alter table alert_dispatch_log enable row level security;
alter table contact_messages enable row level security;

-- Public read: verified directory, disasters, open tenders
create policy "public reads verified orgs" on organisations
  for select using (verified = true);
create policy "public reads disasters" on disasters
  for select using (true);
create policy "public reads tenders" on tenders
  for select using (true);

-- Anyone can submit a registration / contact message / donation pledge (insert only)
create policy "anyone can register" on org_registrations
  for insert with check (true);
create policy "anyone can message" on contact_messages
  for insert with check (true);
create policy "anyone can pledge" on donations
  for insert with check (true);

-- Owners can read their own profile and ledger-related rows
create policy "own profile read" on profiles
  for select using (auth.uid() = id);
create policy "own org read" on organisations
  for select using (auth.uid() = owner_id);
create policy "own org update" on organisations
  for update using (auth.uid() = owner_id);

-- Admin-only writes (enforced via profiles.role checked in app + service role key)
create policy "admin manages disasters" on disasters
  for all using (false)
  with check (false);

-- Grant insert on public tables to anon (RLS above still applies)
grant usage on schema public to anon, authenticated;
grant select on organisations, disasters, tenders to anon;
grant insert on org_registrations, contact_messages, donations to anon;

-- ============================================================
-- Migration: profiles auto-creation + verification docs + donor names
-- Safe to re-run (all statements are idempotent).
-- ============================================================

-- Donor name on pledges (shown in the donation register + 80G receipt).
alter table donations add column if not exists name text not null default '';

-- Verification documents on registrations (links/ids checked by reviewers).
alter table org_registrations add column if not exists cert_url text;
alter table org_registrations add column if not exists pan text;
alter table org_registrations add column if not exists id_proof text;

-- Let a signed-in user create their own profile row (used as a fallback;
-- the trigger below handles the normal signup path).
drop policy if exists "users insert own profile" on profiles;
create policy "users insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Auto-create a profile row the moment someone signs up, carrying over
-- the full_name + phone collected on the signup form.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, phone)
  values (
    new.id,
    'donor',
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Migration 2: dispatch log status/note + ledger approvers
-- Safe to re-run (all statements are idempotent).
-- Older databases lack these columns; the app reads them
-- best-effort and falls back when they are absent.
-- ============================================================
alter table alert_dispatch_log add column if not exists status text not null default 'sent';
alter table alert_dispatch_log add column if not exists note text;
alter table funds_ledger add column if not exists created_by text;
