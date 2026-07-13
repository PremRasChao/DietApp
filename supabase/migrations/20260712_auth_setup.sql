-- ============================================================
-- Auth setup: dietitian codes + user profiles
-- Run this in your Supabase SQL editor or via supabase db push
-- ============================================================

-- 1. Dietitian codes — managed by admin only.
--    Clients can NEVER read this table directly (RLS blocks all access).
--    Only the verify_dietitian_code() function (SECURITY DEFINER) can query it.
create table if not exists public.dietitian_codes (
  id          uuid        default gen_random_uuid() primary key,
  code        text        unique not null,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.dietitian_codes enable row level security;

-- Block every direct client operation
create policy "deny_all" on public.dietitian_codes
  for all using (false);

-- 2. Verify function — SECURITY DEFINER bypasses RLS so only the server runs the query.
--    Returns true only if the code exists and is active.
--    Case-insensitive, trimmed comparison.
create or replace function public.verify_dietitian_code(p_code text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from dietitian_codes
    where trim(lower(code)) = trim(lower(p_code))
      and is_active = true
  );
$$;

-- Grant execute to anonymous callers (pre-auth gate) and authenticated users
grant execute on function public.verify_dietitian_code(text) to anon, authenticated;

-- 3. User profiles — role and display name for every user.
create table if not exists public.profiles (
  id          uuid  references auth.users on delete cascade primary key,
  role        text  not null default 'patient' check (role in ('patient', 'dietitian')),
  full_name   text,
  email       text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update only their own row
create policy "users_own_profile" on public.profiles
  for all
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- 4. Auto-create a profile row whenever a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'patient')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- To add a valid dietitian code (run in Supabase SQL editor):
--   insert into public.dietitian_codes (code) values ('DT-12345');
-- ============================================================
