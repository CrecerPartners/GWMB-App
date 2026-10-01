-- Saved opportunities and application tracking.

create table if not exists public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.opportunity_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null,
  portfolio_url text,
  motivation text not null check (char_length(motivation) between 30 and 2000),
  status text not null default 'submitted'
    check (status in ('draft', 'submitted', 'under_review', 'successful', 'unsuccessful')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;
alter table public.opportunity_applications enable row level security;

revoke all on table public.saved_opportunities from anon, authenticated;
revoke all on table public.opportunity_applications from anon, authenticated;
grant select, insert, delete on table public.saved_opportunities to authenticated;
grant select, insert on table public.opportunity_applications to authenticated;

create policy "Saved opportunities are visible to their owner"
on public.saved_opportunities for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can save their own opportunities"
on public.saved_opportunities for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "Users can remove their own saved opportunities"
on public.saved_opportunities for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "Applications are visible to their owner"
on public.opportunity_applications for select to authenticated
using ((select auth.uid()) = user_id);
create policy "Users can submit their own applications"
on public.opportunity_applications for insert to authenticated
with check ((select auth.uid()) = user_id and status = 'submitted');

drop trigger if exists opportunity_applications_set_updated_at on public.opportunity_applications;
create trigger opportunity_applications_set_updated_at
  before update on public.opportunity_applications
  for each row execute procedure public.set_updated_at();
