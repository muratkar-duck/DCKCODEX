-- Migration: Black List inspired dashboard extensions
-- Create enums
create type if not exists evaluation_status as enum ('pending', 'in_progress', 'delivered');
create type if not exists evaluation_order_status as enum ('pending', 'paid', 'failed', 'refunded');
create type if not exists program_application_status as enum ('submitted', 'shortlisted', 'rejected', 'accepted');

-- Evaluation packages
create table if not exists evaluation_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_cents integer not null,
  currency text not null default 'TRY',
  includes_toplist_eligibility boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Evaluations
create table if not exists evaluations (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references scripts(id) on delete cascade,
  writer_id uuid not null references users(id) on delete cascade,
  evaluator_id uuid references users(id) on delete set null,
  package_id uuid references evaluation_packages(id) on delete set null,
  overall_score numeric,
  premise_score numeric,
  structure_score numeric,
  character_score numeric,
  dialogue_score numeric,
  marketability_score numeric,
  coverage_summary text,
  notes text,
  status evaluation_status not null default 'pending',
  delivered_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Evaluation orders
create table if not exists evaluation_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references users(id) on delete cascade,
  script_id uuid not null references scripts(id) on delete cascade,
  package_id uuid not null references evaluation_packages(id) on delete restrict,
  evaluation_id uuid references evaluations(id) on delete set null,
  price_cents integer not null,
  currency text not null default 'TRY',
  status evaluation_order_status not null default 'pending',
  payment_provider text,
  provider_payload jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Toplist snapshots
create table if not exists toplist_snapshots (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  label text not null,
  generated_at timestamp with time zone default now(),
  data jsonb not null default '[]'::jsonb,
  is_public boolean not null default true
);

-- Featured projects
create table if not exists featured_projects (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references scripts(id) on delete cascade,
  featured_from timestamp with time zone,
  featured_to timestamp with time zone,
  reason text,
  created_at timestamp with time zone default now()
);

-- Success stories
create table if not exists success_stories (
  id uuid primary key default gen_random_uuid(),
  writer_id uuid not null references users(id) on delete cascade,
  script_id uuid references scripts(id) on delete set null,
  title text not null,
  body text not null,
  verified boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Programs and applications
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  application_deadline timestamp with time zone,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table if not exists program_applications (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  writer_id uuid not null references users(id) on delete cascade,
  script_id uuid references scripts(id) on delete set null,
  status program_application_status not null default 'submitted',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Writer profiles
create table if not exists writer_profiles (
  id uuid primary key references users(id) on delete cascade,
  genres text[] default '{}',
  bio text,
  location text,
  website text,
  instagram text,
  imdb_url text,
  languages text[] default '{}',
  awards jsonb,
  represented_by text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_evaluations_script_id on evaluations(script_id);
create index if not exists idx_evaluations_writer_id on evaluations(writer_id);
create index if not exists idx_evaluation_orders_buyer_id on evaluation_orders(buyer_id);
create index if not exists idx_toplist_snapshots_period_label on toplist_snapshots(period, label);
create index if not exists idx_scripts_tags_gin on scripts using gin ((to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(genre,'') || ' ' || coalesce(synopsis,''))));

-- RLS setup
alter table evaluation_packages enable row level security;
alter table evaluations enable row level security;
alter table evaluation_orders enable row level security;
alter table toplist_snapshots enable row level security;
alter table featured_projects enable row level security;
alter table success_stories enable row level security;
alter table programs enable row level security;
alter table program_applications enable row level security;
alter table writer_profiles enable row level security;

-- Policies
create policy if not exists "Anyone can view evaluation packages" on evaluation_packages for select using (true);

create policy if not exists "Writers view their evaluations" on evaluations for select using (auth.uid() = writer_id);
create policy if not exists "Writers insert their evaluations" on evaluations for insert with check (auth.uid() = writer_id);
create policy if not exists "Writers manage their evaluations" on evaluations for update using (auth.uid() = writer_id);

create policy if not exists "Writers view their evaluation orders" on evaluation_orders for select using (auth.uid() = buyer_id);
create policy if not exists "Writers create their evaluation orders" on evaluation_orders for insert with check (auth.uid() = buyer_id);
create policy if not exists "Writers update their evaluation orders" on evaluation_orders for update using (auth.uid() = buyer_id);

create policy if not exists "Public toplist snapshots" on toplist_snapshots for select using (is_public);

create policy if not exists "Public featured projects" on featured_projects for select using (true);

create policy if not exists "Public programs" on programs for select using (true);

create policy if not exists "Writers manage their program applications" on program_applications for select using (auth.uid() = writer_id);
create policy if not exists "Writers create program applications" on program_applications for insert with check (auth.uid() = writer_id);
create policy if not exists "Writers update program applications" on program_applications for update using (auth.uid() = writer_id);

create policy if not exists "Success stories public verified" on success_stories for select using (verified or auth.uid() = writer_id);
create policy if not exists "Writers insert success stories" on success_stories for insert with check (auth.uid() = writer_id);
create policy if not exists "Writers update success stories" on success_stories for update using (auth.uid() = writer_id);

create policy if not exists "Public writer profiles" on writer_profiles for select using (true);
create policy if not exists "Writers manage their profiles" on writer_profiles for insert with check (auth.uid() = id);
create policy if not exists "Writers update their profiles" on writer_profiles for update using (auth.uid() = id);
