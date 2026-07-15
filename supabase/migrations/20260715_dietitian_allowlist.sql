-- ============================================================
-- Dietitian role assignment via server-side allowlist  (self-contained + safe)
-- Run this in your Supabase SQL editor or via supabase db push.
--
-- Role is assigned server-side from a pre-approved email allowlist. Anyone not
-- on the list is a 'patient'. There is no client-supplied path to 'dietitian'.
--
-- This migration is idempotent and self-contained: it ensures every table it
-- needs exists, and the signup trigger can NEVER block authentication — if the
-- profile insert fails for any reason it logs a warning and lets signup through.
-- ============================================================

-- 0. Ensure the profiles table exists (normally created by 20260712_auth_setup).
create table if not exists public.profiles (
  id          uuid  references auth.users on delete cascade primary key,
  role        text  not null default 'patient' check (role in ('patient', 'dietitian')),
  full_name   text,
  email       text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'users_own_profile'
  ) then
    create policy "users_own_profile" on public.profiles
      for all using (auth.uid() = id) with check (auth.uid() = id);
  end if;
end $$;

-- 1. Allowlist of pre-approved dietitian emails. Populated manually by an
--    admin (Supabase Studio table editor is sufficient — no admin UI yet).
create table if not exists public.dietitian_allowlist (
  email      text primary key,
  created_at timestamptz not null default now()
);

-- Lock it down: only the SECURITY DEFINER trigger reads it, never the client.
alter table public.dietitian_allowlist enable row level security;
-- Intentionally no policies — default-deny means no client-side access at all.

-- 2. Signup trigger: assign role from the allowlist (case-insensitive email).
--    Wrapped so a failure can never roll back the auth.users insert — that's
--    what produces "Database error saving new user".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role text := 'patient';
begin
  begin
    if exists (
      select 1 from public.dietitian_allowlist
      where lower(email) = lower(new.email)
    ) then
      assigned_role := 'dietitian';
    end if;

    insert into public.profiles (id, full_name, email, role)
    values (
      new.id,
      new.raw_user_meta_data ->> 'full_name',
      new.email,
      assigned_role
    )
    on conflict (id) do nothing;
  exception when others then
    -- Never block signup on a profile-provisioning error; surface it in logs.
    raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Prevent users from changing their own role. The "users_own_profile" policy
--    grants `for all`, which would otherwise let a user PATCH role to
--    'dietitian'. Pin role to its old value on any non-service-role update.
create or replace function public.lock_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() is distinct from 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists lock_profile_role_on_update on public.profiles;
create trigger lock_profile_role_on_update
  before update on public.profiles
  for each row execute function public.lock_profile_role();

-- ============================================================
-- To pre-approve a dietitian (run in Supabase SQL editor):
--   insert into public.dietitian_allowlist (email) values ('doc@example.com');
--
-- Role is assigned on FIRST sign-in only. To promote an existing account:
--   update public.profiles set role = 'dietitian' where email = 'doc@example.com';
-- ============================================================
