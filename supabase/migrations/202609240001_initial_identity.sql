-- GWMB identity and membership foundation.
-- Run through the Supabase SQL editor or CLI before enabling production auth.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  city_club text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  status text not null default 'guest'
    check (status in ('guest', 'pending', 'verified', 'rejected', 'expired')),
  application_reference text unique,
  verified_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_reference text,
  status text not null default 'submitted'
    check (status in ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.membership_applications enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.memberships from anon, authenticated;
revoke all on table public.membership_applications from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, avatar_url, city_club, updated_at) on table public.profiles to authenticated;
grant select on table public.memberships to authenticated;
grant select, insert on table public.membership_applications to authenticated;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Profiles are editable by their owner" on public.profiles;
create policy "Profiles are editable by their owner"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Membership is visible to its owner" on public.memberships;
create policy "Membership is visible to its owner"
on public.memberships for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Applications are visible to their owner" on public.membership_applications;
create policy "Applications are visible to their owner"
on public.membership_applications for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Applications can be submitted by their owner" on public.membership_applications;
create policy "Applications can be submitted by their owner"
on public.membership_applications for insert
to authenticated
with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.memberships (user_id, status)
  values (new.id, 'guest');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists memberships_set_updated_at on public.memberships;
create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute procedure public.set_updated_at();
