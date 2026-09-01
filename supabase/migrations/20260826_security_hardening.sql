-- ============================================================
-- Security hardening: server-side rate limiting + food_logs RLS
-- Run this in your Supabase SQL editor or via supabase db push.
--
-- Fixes two gaps that couldn't be closed on the client alone:
--   1. verify_dietitian_code had no server-side throttle — the client-side
--      attempt limiter is just a JS variable, so anyone could call the RPC
--      directly from the browser console in a loop and brute-force codes.
--   2. food_logs wasn't defined in any migration, so it's unclear whether
--      RLS was ever enabled on it. This (re)creates it with RLS locked to
--      the owning user regardless of how it exists today.
-- ============================================================

-- 1. Generic rate-limit ledger, used by SECURITY DEFINER functions only.
--    Clients can never read or write it directly.
create table if not exists public.rate_limit_attempts (
  bucket        text        not null,
  identifier    text        not null,
  window_start  timestamptz not null,
  count         int         not null default 0,
  primary key (bucket, identifier)
);

alter table public.rate_limit_attempts enable row level security;

drop policy if exists "deny_all" on public.rate_limit_attempts;
create policy "deny_all" on public.rate_limit_attempts
  for all using (false);

-- 2. Best-effort caller IP from the PostgREST request headers, so anonymous
--    (pre-auth) callers can still be throttled per-source. Falls back to a
--    shared bucket if the header isn't present — never errors.
create or replace function public.request_ip()
returns text
language plpgsql
stable
as $$
declare
  v_headers json;
  v_xff text;
begin
  begin
    v_headers := current_setting('request.headers', true)::json;
  exception when others then
    return 'unknown';
  end;
  if v_headers is null then return 'unknown'; end if;
  v_xff := v_headers ->> 'x-forwarded-for';
  if v_xff is null or length(trim(v_xff)) = 0 then return 'unknown'; end if;
  return trim(split_part(v_xff, ',', 1));
end;
$$;

-- 3. Atomic check-and-increment. Returns true if the call is allowed under
--    the limit (and records it), false if the caller should be rejected.
create or replace function public.check_rate_limit(p_bucket text, p_identifier text, p_max int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_row public.rate_limit_attempts%rowtype;
begin
  select * into v_row from public.rate_limit_attempts
    where bucket = p_bucket and identifier = p_identifier
    for update;

  if not found then
    insert into public.rate_limit_attempts (bucket, identifier, window_start, count)
    values (p_bucket, p_identifier, v_now, 1);
    return true;
  end if;

  if v_now - v_row.window_start > make_interval(secs => p_window_seconds) then
    update public.rate_limit_attempts
      set window_start = v_now, count = 1
      where bucket = p_bucket and identifier = p_identifier;
    return true;
  end if;

  if v_row.count >= p_max then
    return false;
  end if;

  update public.rate_limit_attempts
    set count = count + 1
    where bucket = p_bucket and identifier = p_identifier;
  return true;
end;
$$;

-- 4. verify_dietitian_code, now throttled: 10 attempts per 15 minutes per
--    source IP (shared "unknown" bucket for callers with no forwarded IP,
--    which still caps runaway abuse even if it's coarser).
create or replace function public.verify_dietitian_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip text := public.request_ip();
begin
  if not public.check_rate_limit('verify_dietitian_code', v_ip, 10, 900) then
    raise exception 'Too many attempts. Please try again later.';
  end if;

  return exists (
    select 1 from public.dietitian_codes
    where trim(lower(code)) = trim(lower(p_code))
      and is_active = true
  );
end;
$$;

grant execute on function public.verify_dietitian_code(text) to anon, authenticated;

-- 5. food_logs — create if missing, and force RLS on regardless of whatever
--    schema exists today. Enabling RLS / adding a policy is idempotent and
--    doesn't touch existing rows or columns.
--
--    IMPORTANT: an existing "allow all for now" policy (qual = true) has been
--    confirmed live on this table in production — it grants every signed-in
--    user full read/write/delete on every row, for every other user. RLS
--    policies are OR'd together, so simply adding a restrictive policy below
--    would NOT have closed this — the permissive policy must be dropped by
--    name, which this migration now does explicitly.
create table if not exists public.food_logs (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        not null references auth.users(id) on delete cascade,
  food_name   text        not null,
  brand       text,
  kcal        numeric     not null default 0,
  protein_g   numeric     not null default 0,
  carbs_g     numeric     not null default 0,
  fat_g       numeric     not null default 0,
  serving_g   numeric     not null default 0,
  meal_type   text,
  logged_at   timestamptz not null default now()
);

alter table public.food_logs enable row level security;

-- Drop the pre-existing wide-open policy by name — it must be removed, not
-- just supplemented, or it stays in force alongside the restrictive one.
drop policy if exists "allow all for now" on public.food_logs;
drop policy if exists "food_logs_own_rows" on public.food_logs;
create policy "food_logs_own_rows" on public.food_logs
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. handle_new_user() and lock_profile_role() are trigger-only functions
--    (they reference NEW/OLD, which only exist inside a trigger context) but
--    Postgres grants EXECUTE to PUBLIC by default on function creation, so
--    Supabase's security linter flags them as callable via
--    /rest/v1/rpc/<name> by anon/authenticated. Calling them directly would
--    error out immediately, but there's no reason to leave them reachable.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.lock_profile_role() from public, anon, authenticated;

-- ============================================================
-- After running this, verify RLS coverage across every public table with:
--
--   select schemaname, tablename, rowsecurity
--   from pg_tables
--   where schemaname = 'public';
--
-- Every row should show rowsecurity = true. Any table you don't recognize
-- here was created outside these migrations — audit it by hand.
-- ============================================================
