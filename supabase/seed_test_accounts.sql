-- Seed writer and producer test accounts for Supabase Auth and public.users.
-- Run this script in the Supabase SQL editor to create the desired users.

-- Ensure pgcrypto is available for password hashing.
create extension if not exists pgcrypto;

with input_users(role, email) as (
  values
    ('writer', 'senarist1@ducktylo.com'),
    ('writer', 'senarist2@ducktylo.com'),
    ('writer', 'senarist3@ducktylo.com'),
    ('writer', 'senarist4@ducktylo.com'),
    ('writer', 'senarist5@ducktylo.com'),
    ('producer', 'yapimci1@ducktylo.com'),
    ('producer', 'yapimci2@ducktylo.com')
),
upserted_auth as (
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  select
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    u.email,
    crypt('123456', gen_salt('bf')),
    now(),
    now(),
    now(),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('role', u.role)
  from input_users u
  on conflict (email) do update
    set encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at,
        updated_at = now(),
        last_sign_in_at = now(),
        raw_user_meta_data = excluded.raw_user_meta_data
  returning id, email
)
insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  last_sign_in_at,
  updated_at
)
select
  gen_random_uuid() as id,
  ua.id,
  jsonb_build_object(
    'sub', ua.id,
    'email', ua.email,
    'email_verified', true,
    'role', iu.role
  ) as identity_data,
  'email' as provider,
  ua.email as provider_id,
  now() as created_at,
  now() as last_sign_in_at,
  now() as updated_at
from upserted_auth ua
join input_users iu on iu.email = ua.email
on conflict (provider, provider_id) do update
  set user_id = excluded.user_id,
      identity_data = excluded.identity_data,
      last_sign_in_at = excluded.last_sign_in_at,
      updated_at = excluded.updated_at;

with input_users(role, email) as (
  values
    ('writer', 'senarist1@ducktylo.com'),
    ('writer', 'senarist2@ducktylo.com'),
    ('writer', 'senarist3@ducktylo.com'),
    ('writer', 'senarist4@ducktylo.com'),
    ('writer', 'senarist5@ducktylo.com'),
    ('producer', 'yapimci1@ducktylo.com'),
    ('producer', 'yapimci2@ducktylo.com')
),
timestamp_cte as (
  select now() as ts
)
insert into public.users (id, email, role, created_at, updated_at)
select
  au.id,
  au.email,
  iu.role,
  tc.ts,
  tc.ts
from auth.users au
join input_users iu on lower(au.email) = lower(iu.email)
cross join timestamp_cte tc
on conflict (id) do update
  set email = excluded.email,
      role = excluded.role,
      updated_at = excluded.updated_at;
