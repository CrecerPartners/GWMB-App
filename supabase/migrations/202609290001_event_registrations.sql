-- Per-user registration and waitlist state for GWMB events.

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  full_name text not null check (char_length(full_name) between 2 and 160),
  email text not null,
  learning_goal text check (learning_goal is null or char_length(learning_goal) <= 1000),
  status text not null default 'registered'
    check (status in ('registered', 'waitlisted', 'cancelled')),
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, event_id)
);

alter table public.event_registrations enable row level security;
revoke all on table public.event_registrations from anon, authenticated;
grant select, insert, update on table public.event_registrations to authenticated;

drop policy if exists "Event registrations are visible to their owner" on public.event_registrations;
create policy "Event registrations are visible to their owner"
on public.event_registrations for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "Users can create their own event registrations" on public.event_registrations;
create policy "Users can create their own event registrations"
on public.event_registrations for insert to authenticated
with check ((select auth.uid()) = user_id and status in ('registered', 'waitlisted'));
drop policy if exists "Users can update their own event registration" on public.event_registrations;
create policy "Users can update their own event registration"
on public.event_registrations for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop trigger if exists event_registrations_set_updated_at on public.event_registrations;
create trigger event_registrations_set_updated_at
  before update on public.event_registrations
  for each row execute procedure public.set_updated_at();
