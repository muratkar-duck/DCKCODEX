-- =========================================================
-- seed_test_accounts.sql  (idempotent)
-- 7 demo hesabı auth.users + public.users içine upsert eder.
-- Şifre: 123456  (bcrypt ile şifrelenir)
-- =========================================================

create extension if not exists "pgcrypto";

with data as (
  select value as entry
  from jsonb_array_elements(
    '[
      {"email":"senarist1@ducktylo.com","role":"writer"},
      {"email":"senarist2@ducktylo.com","role":"writer"},
      {"email":"senarist3@ducktylo.com","role":"writer"},
      {"email":"senarist4@ducktylo.com","role":"writer"},
      {"email":"senarist5@ducktylo.com","role":"writer"},
      {"email":"yapimci1@ducktylo.com","role":"producer"},
      {"email":"yapimci2@ducktylo.com","role":"producer"}
    ]'::jsonb
  )
),
prepared as (
  select
    (entry->>'email')::text as email,
    lower((entry->>'email')::text) as email_lower,
    (entry->>'role')::text as role
  from data
),
project_instance as (
  select id
  from auth.instances
  order by created_at desc
  limit 1
),
inserted_auth as (
  select
    coalesce(u.id, gen_random_uuid()) as id,
    p.email,
    p.role,
    coalesce(u.instance_id, pi.id, '00000000-0000-0000-0000-000000000000'::uuid) as instance_id
  from prepared p
  left join auth.users u on lower(u.email) = p.email_lower
  left join project_instance pi on true
),
upsert_auth as (
  insert into auth.users as au (
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
    ia.id,
    ia.instance_id,
    'authenticated' as aud,
    'authenticated' as role,
    ia.email,
    crypt('123456', gen_salt('bf')),
    now() as email_confirmed_at,
    now() as created_at,
    now() as updated_at,
    now() as last_sign_in_at,
    jsonb_build_object('provider', 'email', 'providers', array['email']) as raw_app_meta_data,
    jsonb_build_object('role', ia.role) as raw_user_meta_data
  from inserted_auth ia
  on conflict (id) do nothing
  returning id
),
resolved_profiles as (
  select
    u.id,
    u.email,
    coalesce(
      (u.raw_user_meta_data->>'role')::public.user_role,
      p.role::public.user_role,
      'writer'::public.user_role
    ) as role
  from auth.users u
  join prepared p on lower(u.email) = p.email_lower
  left join upsert_auth ua on ua.id = u.id
),
ensure_identities as (
  insert into auth.identities as ai (
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
    rp.id as user_id,
    jsonb_build_object(
      'sub', rp.id,
      'email', rp.email,
      'email_verified', true,
      'role', rp.role::text
    ) as identity_data,
    'email' as provider,
    rp.email as provider_id,
    now() as created_at,
    now() as last_sign_in_at,
    now() as updated_at
  from resolved_profiles rp
  on conflict (provider, provider_id) do update
    set user_id = excluded.user_id,
        identity_data = excluded.identity_data,
        last_sign_in_at = excluded.last_sign_in_at,
        updated_at = excluded.updated_at
  returning user_id
)
insert into public.users as pu (id, email, role, created_at)
select
  rp.id,
  rp.email,
  rp.role,
  now() as created_at
from resolved_profiles rp
left join ensure_identities ei on ei.user_id = rp.id
on conflict (id) do update
  set email = excluded.email,
      role = excluded.role;
