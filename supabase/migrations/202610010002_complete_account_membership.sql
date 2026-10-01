-- Complete member application, verification request, and profile-photo workflows.

alter table public.membership_applications
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists occupation text,
  add column if not exists motivation text,
  add column if not exists updated_at timestamptz not null default now();

create unique index if not exists membership_applications_one_per_user
  on public.membership_applications (user_id);

drop trigger if exists membership_applications_set_updated_at on public.membership_applications;
create trigger membership_applications_set_updated_at
  before update on public.membership_applications
  for each row execute procedure public.set_updated_at();

create table if not exists public.membership_verification_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  membership_email text not null,
  phone text not null,
  member_identifier text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  review_note text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.membership_verification_requests enable row level security;
revoke all on table public.membership_verification_requests from anon, authenticated;
grant select, insert on table public.membership_verification_requests to authenticated;
grant update (membership_email, phone, member_identifier, status, submitted_at, updated_at)
  on table public.membership_verification_requests to authenticated;

drop policy if exists "Verification requests are visible to their owner" on public.membership_verification_requests;
create policy "Verification requests are visible to their owner"
on public.membership_verification_requests for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can submit their own verification request" on public.membership_verification_requests;
create policy "Users can submit their own verification request"
on public.membership_verification_requests for insert to authenticated
with check ((select auth.uid()) = user_id and status = 'pending');

drop policy if exists "Users can resubmit a rejected verification request" on public.membership_verification_requests;
create policy "Users can resubmit a rejected verification request"
on public.membership_verification_requests for update to authenticated
using ((select auth.uid()) = user_id and status = 'rejected')
with check ((select auth.uid()) = user_id and status = 'pending');

drop trigger if exists membership_verification_requests_set_updated_at on public.membership_verification_requests;
create trigger membership_verification_requests_set_updated_at
  before update on public.membership_verification_requests
  for each row execute procedure public.set_updated_at();

create or replace function public.mark_membership_pending()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.memberships
  set status = 'pending'
  where user_id = new.user_id
    and status in ('guest', 'rejected', 'expired');
  return new;
end;
$$;

revoke execute on function public.mark_membership_pending() from public, anon, authenticated;

drop trigger if exists membership_application_marks_pending on public.membership_applications;
create trigger membership_application_marks_pending
  after insert on public.membership_applications
  for each row execute procedure public.mark_membership_pending();

drop trigger if exists membership_verification_marks_pending on public.membership_verification_requests;
create trigger membership_verification_marks_pending
  after insert or update on public.membership_verification_requests
  for each row execute procedure public.mark_membership_pending();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can view their avatar objects" on storage.objects;
create policy "Users can view their avatar objects"
on storage.objects for select to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users can update their own avatar" on storage.objects;
create policy "Users can update their own avatar"
on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
