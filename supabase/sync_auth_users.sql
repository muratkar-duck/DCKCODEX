-- Synchronize public.users rows with Supabase Auth records for demo environments.
-- All accounts will receive the password defined in the desired_password CTE.
-- Update the literal below if you need a different shared password.

create extension if not exists pgcrypto;

with desired_password as (
  select '123456'::text as raw_password
),
project_instance as (
  select id
  from auth.instances
  order by created_at desc
  limit 1
),
input_users as (
  select u.id, u.email, u.role
  from public.users u
),
password_payload as (
  select auth.hash_password(raw_password) as encrypted_password
  from desired_password
),
prepared_auth as (
  select
    iu.id,
    coalesce(au.instance_id, pi.id, '00000000-0000-0000-0000-000000000000'::uuid) as instance_id,
    'authenticated' as aud,
    'authenticated' as role,
    iu.email,
    pp.encrypted_password,
    now() as email_confirmed_at,
    now() as created_at,
    now() as updated_at,
    now() as last_sign_in_at,
    jsonb_build_object('provider', 'email', 'providers', array['email']) as raw_app_meta_data,
    jsonb_build_object('role', iu.role) as raw_user_meta_data
  from input_users iu
  cross join password_payload pp
  left join auth.users au on au.id = iu.id
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
        instance_id = excluded.instance_id,
        aud = excluded.aud,
        role = excluded.role,
        encrypted_password = excluded.encrypted_password,
        email_confirmed_at = excluded.email_confirmed_at,
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
  gen_random_uuid(),
  ua.id,
  jsonb_build_object(
    'sub', ua.id,
    'email', ua.email,
    'email_verified', true,
    'role', iu.role
  ),
  'email' as provider,
  ua.email as provider_id,
  now() as created_at,
  now() as last_sign_in_at,
  now() as updated_at
from upserted_auth ua
join input_users iu on iu.id = ua.id
on conflict (provider, provider_id) do update
  set user_id = excluded.user_id,
      identity_data = excluded.identity_data,
      last_sign_in_at = excluded.last_sign_in_at,
      updated_at = excluded.updated_at;
