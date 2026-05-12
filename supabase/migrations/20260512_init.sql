-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles (extends auth.users) ──────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'agent'
    check (role in ('admin', 'manager', 'agent')),
  created_at timestamptz not null default now()
);

-- Auto-create profile row on new signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Leads ───────────────────────────────────────────────────────────────────

-- Stage numbers match the app's 7-step pipeline:
--   1 New Lead → 2 Assessment Sent → 3 Finance Booked → 4 Finance Applied
--   → 5 Approved → 6 Installer Matched → 7 Complete

create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Customer identity
  name text not null,
  email text not null,
  phone text,
  postcode text,
  state text,                         -- AU state abbreviation e.g. WA, VIC

  -- Rebate & finance snapshot captured at lead creation
  products text[] not null default '{}',   -- e.g. ['solar','battery','heatpump']
  total_rebate numeric(12,2) default 0,
  finance_status text,                -- free-form field set by finance team

  -- Pipeline
  stage smallint not null default 1
    check (stage between 1 and 7),
  source text,                        -- website | referral | social | etc.

  -- Ownership
  owner_id uuid not null references auth.users(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null
);

-- Auto-update updated_at on every row change
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger leads_updated_at
  before update on public.leads
  for each row execute procedure public.handle_updated_at();

-- ─── Lead Notes ──────────────────────────────────────────────────────────────

create table public.lead_notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;

-- Profiles: own row always; admins can read all
create policy "profiles_own" on public.profiles
  for all using (id = auth.uid());

create policy "profiles_admin_read" on public.profiles
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Leads: admins/managers see everything; agents see only leads they own
create policy "leads_admin_manager" on public.leads
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','manager'))
  );

create policy "leads_agent_own" on public.leads
  for all using (owner_id = auth.uid());

-- Lead notes: visible to whoever can see the parent lead
create policy "lead_notes_via_lead" on public.lead_notes
  for all using (
    exists (
      select 1 from public.leads l
      where l.id = lead_id
        and (
          l.owner_id = auth.uid()
          or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','manager'))
        )
    )
  );

-- ─── Indexes ─────────────────────────────────────────────────────────────────

create index leads_owner_id_idx      on public.leads(owner_id);
create index leads_stage_idx         on public.leads(stage);
create index leads_created_at_idx    on public.leads(created_at desc);
create index lead_notes_lead_id_idx  on public.lead_notes(lead_id);
