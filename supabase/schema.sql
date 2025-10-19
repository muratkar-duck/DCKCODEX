-- Required extensions for UUID handling and crypt functions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- User role enum (writer / producer)
do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.user_role as enum ('writer', 'producer');
  end if;
end$$;

-- Drop legacy check constraints that conflict with the enum if they exist
do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.users'::regclass
      and conname = 'users_role_check'
  ) then
    alter table public.users drop constraint users_role_check;
  end if;
exception when undefined_table then
  -- Table does not exist yet; nothing to drop.
  null;
end$$;

-- Users table mirrors auth.users metadata
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure legacy installs convert the role column to the enum type
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'role'
      and udt_name <> 'user_role'
  ) then
    alter table public.users
      alter column role type public.user_role using role::public.user_role;
  end if;
exception when undefined_table then
  null;
end$$;

alter table if exists public.users
  alter column email set not null,
  alter column role set not null;

-- Login / profile lookups require relaxed RLS in the demo environment
alter table if exists public.users disable row level security;

create index if not exists idx_users_email on public.users (email);
create index if not exists users_role_idx on public.users(role);

comment on table public.users is 'App profile rows mirrored by auth.users (1-1). DEMO: RLS disabled.';

create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  genre text not null,
  length integer,
  synopsis text not null,
  description text not null,
  price_cents integer not null check (price_cents > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists scripts_owner_idx on public.scripts(owner_id);
create index if not exists scripts_price_idx on public.scripts(price_cents);

create table if not exists public.producer_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  genre text not null,
  budget_cents integer not null,
  deadline date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  genre text,
  budget_cents integer,
  deadline date,
  producer_id uuid references public.users(id),
  user_id uuid references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint requests_actor_check check (producer_id is not null or user_id is not null)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.requests(id),
  listing_id uuid references public.producer_listings(id),
  producer_listing_id uuid,
  writer_id uuid not null references public.users(id) on delete cascade,
  script_id uuid references public.scripts(id),
  producer_id uuid references public.users(id),
  owner_id uuid not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists applications_writer_idx on public.applications(writer_id);
create index if not exists applications_producer_idx on public.applications(producer_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.scripts(id) on delete cascade,
  buyer_id uuid not null references public.users(id) on delete cascade,
  amount_cents integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.interests (
  producer_id uuid not null references public.users(id) on delete cascade,
  script_id uuid not null references public.scripts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (producer_id, script_id)
);

create type notification_status as enum ('pending','processing','sent','failed');

create table if not exists public.notification_queue (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.users(id) on delete cascade,
  template text not null,
  payload jsonb,
  status notification_status not null default 'pending',
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  participant_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (conversation_id, participant_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create or replace view public.v_listings_unified as
select id,
       owner_id,
       title,
       description,
       genre,
       budget_cents,
       null::integer as price_cents,
       'listing'::text as type,
       created_at,
       deadline
from public.producer_listings
union all
select id,
       coalesce(producer_id, user_id) as owner_id,
       title,
       description,
       genre,
       budget_cents,
       null::integer,
       'request'::text,
       created_at,
       deadline
from public.requests;

create or replace function public.enqueue_notification(
  recipient_id uuid,
  template text,
  payload jsonb default '{}'::jsonb
) returns public.notification_queue as $$
declare
  record public.notification_queue;
begin
  insert into public.notification_queue(recipient_id, template, payload)
  values (recipient_id, template, payload)
  returning * into record;
  return record;
end;
$$ language plpgsql security definer;

create or replace function public.get_producer_applications(producer_id uuid)
returns setof public.applications as $$
  select * from public.applications where producer_id = get_producer_applications.producer_id;
$$ language sql stable;

create or replace function public.rpc_mark_interest(script_id uuid)
returns public.interests as $$
declare
  producer uuid;
  record public.interests;
begin
  select auth.uid() into producer;
  if producer is null then
    raise exception 'auth required';
  end if;
  insert into public.interests (producer_id, script_id)
  values (producer, script_id)
  on conflict (producer_id, script_id) do update set created_at = now()
  returning * into record;
  return record;
end;
$$ language plpgsql security definer;

create or replace function public.ensure_conversation_with_participants(
  application_id uuid,
  acting_user_id uuid
) returns public.conversations as $$
declare
  convo public.conversations;
  writer uuid;
  producer uuid;
begin
  select writer_id, producer_id into writer, producer from public.applications where id = application_id;
  if writer is null or producer is null then
    raise exception 'application missing participants';
  end if;
  insert into public.conversations(application_id)
  values (application_id)
  on conflict (application_id) do update set updated_at = now()
  returning * into convo;

  insert into public.conversation_participants(conversation_id, participant_id)
  values (convo.id, writer)
  on conflict (conversation_id, participant_id) do nothing;

  insert into public.conversation_participants(conversation_id, participant_id)
  values (convo.id, producer)
  on conflict (conversation_id, participant_id) do nothing;

  return convo;
end;
$$ language plpgsql security definer;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_timestamp before update on public.users for each row execute function public.handle_updated_at();
create trigger set_timestamp_scripts before update on public.scripts for each row execute function public.handle_updated_at();
create trigger set_timestamp_listings before update on public.producer_listings for each row execute function public.handle_updated_at();
create trigger set_timestamp_requests before update on public.requests for each row execute function public.handle_updated_at();
create trigger set_timestamp_applications before update on public.applications for each row execute function public.handle_updated_at();
create trigger set_timestamp_notifications before update on public.notification_queue for each row execute function public.handle_updated_at();
create trigger set_timestamp_conversations before update on public.conversations for each row execute function public.handle_updated_at();

alter table public.users enable row level security;
alter table public.scripts enable row level security;
alter table public.producer_listings enable row level security;
alter table public.requests enable row level security;
alter table public.applications enable row level security;
alter table public.orders enable row level security;
alter table public.interests enable row level security;
alter table public.notification_queue enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.support_messages enable row level security;

create policy "Users can manage their row" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Writers manage own scripts" on public.scripts
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Producers manage own listings" on public.producer_listings
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Users see relevant requests" on public.requests
  for select using (
    auth.uid() = coalesce(producer_id, user_id)
  );

create policy "Users manage own requests" on public.requests
  for all using (auth.uid() = coalesce(producer_id, user_id))
  with check (auth.uid() = coalesce(producer_id, user_id));

create policy "Participants manage applications" on public.applications
  for all using (auth.uid() in (writer_id, producer_id))
  with check (auth.uid() in (writer_id, producer_id));

create policy "Users view orders they own" on public.orders
  for select using (auth.uid() in (buyer_id));

create policy "Producer interests" on public.interests
  for all using (auth.uid() = producer_id) with check (auth.uid() = producer_id);

create policy "Notification recipients" on public.notification_queue
  for select using (auth.uid() = recipient_id);

create policy "Conversation participants" on public.conversation_participants
  for all using (
    exists(
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_id and cp.participant_id = auth.uid()
    )
  )
  with check (participant_id = auth.uid());

create policy "Messages restricted" on public.messages
  for all using (
    exists(
      select 1 from public.conversation_participants cp
      where cp.conversation_id = conversation_id and cp.participant_id = auth.uid()
    )
  ) with check (sender_id = auth.uid());

create policy "Support messages" on public.support_messages
  for insert
  with check (true);
