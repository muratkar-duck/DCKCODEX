-- Run this script in the Supabase SQL editor to create the desired users.
-- Accounts use the credentials writer@ducktylo.test / password and producer@ducktylo.test / password.
-- Password hashes are generated with auth.hash_password to match Supabase Auth expectations.
-- Ensure pgcrypto is available so gen_random_uuid can be used when inserting rows.

create extension if not exists pgcrypto;

with input_users(role, email) as (
  values
    ('writer', 'writer@ducktylo.test'),
    ('producer', 'producer@ducktylo.test')
),
existing_auth as (
  select distinct on (lower(u.email))
    u.id,
    u.email,
    u.instance_id
  from auth.users u
  join input_users iu on lower(u.email) = lower(iu.email)
  order by lower(u.email), u.created_at desc
),
project_instance as (
  select id
  from auth.instances
  order by created_at desc
  limit 1
),
prepared_auth as (
  select
    coalesce(ea.id, gen_random_uuid()) as id,
    coalesce(ea.instance_id, pi.id, '00000000-0000-0000-0000-000000000000'::uuid) as instance_id,
    'authenticated' as aud,
    'authenticated' as role,
    iu.email,
    auth.hash_password('password'::text) as encrypted_password,
    now() as email_confirmed_at,
    now() as created_at,
    now() as updated_at,
    now() as last_sign_in_at,
    jsonb_build_object('provider', 'email', 'providers', array['email']) as raw_app_meta_data,
    jsonb_build_object('role', iu.role) as raw_user_meta_data
  from input_users iu
  left join existing_auth ea on lower(ea.email) = lower(iu.email)
  left join project_instance pi on true
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
  from prepared_auth
  on conflict (id) do update
    set email = excluded.email,
        encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at,
        instance_id = excluded.instance_id,
        aud = excluded.aud,
        role = excluded.role,
        updated_at = now(),
        last_sign_in_at = excluded.last_sign_in_at,
        raw_app_meta_data = excluded.raw_app_meta_data,
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
    ('writer', 'writer@ducktylo.test'),
    ('producer', 'producer@ducktylo.test')
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
