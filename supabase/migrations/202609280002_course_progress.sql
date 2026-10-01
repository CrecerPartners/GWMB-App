-- Per-user course enrollment and lesson completion.

create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  completed_lesson_ids text[] not null default '{}',
  current_lesson_id text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.course_progress enable row level security;
revoke all on table public.course_progress from anon, authenticated;
grant select, insert, update on table public.course_progress to authenticated;

drop policy if exists "Course progress is visible to its owner" on public.course_progress;
create policy "Course progress is visible to its owner"
on public.course_progress for select to authenticated
using ((select auth.uid()) = user_id);
drop policy if exists "Users can start their own courses" on public.course_progress;
create policy "Users can start their own courses"
on public.course_progress for insert to authenticated
with check ((select auth.uid()) = user_id);
drop policy if exists "Users can update their own progress" on public.course_progress;
create policy "Users can update their own progress"
on public.course_progress for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop trigger if exists course_progress_set_updated_at on public.course_progress;
create trigger course_progress_set_updated_at
  before update on public.course_progress
  for each row execute procedure public.set_updated_at();
