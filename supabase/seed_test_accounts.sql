-- =========================================================
-- supabase/seed_test_accounts.sql  (idempotent)
-- 7 demo kullanıcıyı auth.users + public.users içine yerleştirir.
-- Şifre: 123456
-- =========================================================

create extension if not exists "pgcrypto";

with data as (
  select * from jsonb_array_elements(
    '[
      {"email":"senarist1@ducktylo.com","role":"writer"},
      {"email":"senarist2@ducktylo.com","role":"writer"},
      {"email":"senarist3@ducktylo.com","role":"writer"},
      {"email":"senarist4@ducktylo.com","role":"writer"},
      {"email":"senarist5@ducktylo.com","role":"writer"},
      {"email":"yapimci1@ducktylo.com","role":"producer"},
      {"email":"yapimci2@ducktylo.com","role":"producer"}
    ]'::jsonb
  ) j
),
prepared as (
  select
    (j->>'email')::text as email,
    (j->>'role')::text as role
  from data
),
existing as (
  select u.id, lower(u.email) as email
  from auth.users u
),
need as (
  select
    coalesce(e.id, gen_random_uuid()) as id,
    p.email,
    p.role
  from prepared p
  left join existing e on e.email = lower(p.email)
),
ins_auth as (
  insert into auth.users (
    id, instance_id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_user_meta_data, created_at, updated_at
  )
  select
    n.id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    n.email,
    crypt('123456', gen_salt('bf')),
    now(),
    jsonb_build_object('role', n.role),
    now(), now()
  from need n
  on conflict (id) do nothing
  returning id, email
)
-- public.users senkronu trigger ile zaten olur; yine de emniyete alalım:
insert into public.users (id, email, role, created_at)
select
  u.id,
  u.email,
  coalesce((u.raw_user_meta_data->>'role')::public.user_role, 'writer'::public.user_role),
  now()
from auth.users u
join prepared p on lower(p.email) = lower(u.email)
on conflict (id) do update set
  email = excluded.email,
  role  = excluded.role;

-- Kontrol için istersen:
-- select id, email, role from public.users where email like '%ducktylo.com';
