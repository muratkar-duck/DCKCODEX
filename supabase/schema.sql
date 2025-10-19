-- =========================================================
-- supabase/schema.sql  (idempotent, DEMO için gevşek RLS)
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1) Rol enum
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('writer', 'producer');
  end if;
end$$;

-- 2) public.users (auth.users ile 1-1 eşleşir)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.user_role not null,
  created_at timestamptz not null default now()
);

comment on table public.users is 'App profile mapped 1-1 with auth.users. DEMO: RLS disabled.';

-- 3) DEMO: RLS gevşetme
alter table public.users disable row level security;

-- Prod’da kullanmak istersen (şimdilik KAPALI):
-- alter table public.users enable row level security;
-- drop policy if exists users_sel on public.users;
-- create policy users_sel on public.users for select to authenticated using (true);
-- create policy users_ins_self on public.users for insert to authenticated with check (id = auth.uid());
-- create policy users_upd_self on public.users for update to authenticated using (id = auth.uid());

-- 4) Indexler
create index if not exists idx_users_email on public.users (email);

-- 5) auth.users -> public.users otomatik profil oluşturma (ileri güvence)
-- (Varsa güncelleme, yoksa oluşturma)
create or replace function public.fn_sync_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, email, role, created_at)
  values (new.id, new.email, coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'writer'::public.user_role), now())
  on conflict (id) do update set
    email = excluded.email,
    role  = excluded.role;
  return new;
end;
$$;

-- Trigger zaten varsa yeniler, yoksa yaratır
drop trigger if exists trg_auth_user_sync on auth.users;
create trigger trg_auth_user_sync
after insert or update on auth.users
for each row execute function public.fn_sync_profile();
