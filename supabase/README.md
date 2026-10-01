# Supabase setup

The mobile client is connected to the GWMB Supabase project through `.env.local`.

Apply the migrations in `supabase/migrations` in filename order using the Supabase SQL editor or Supabase CLI. The migrations create profiles and memberships, opportunity applications, course progress, event registrations, membership applications, membership-verification requests, and protected profile-photo storage. Every user-owned table has Row Level Security enabled. The hardening migrations prevent internal trigger helpers from being called through the public API.

Membership status cannot be upgraded by the mobile client. Verification must be performed by trusted administrative/server-side code using a service-role credential that is never shipped with the app.

Submitting a membership application or verification request changes an eligible account to `pending`; it never grants verified access. A signed-in user can read only her own request. Verification requests can be resubmitted by the member only after an administrator marks the previous request as `rejected`.

Profile photos are stored in the public `avatars` bucket under a folder named with the authenticated user's ID. Upload, update, and delete operations are restricted to that owner. The bucket accepts JPEG, PNG, and WebP images up to 5 MB.

Opportunity application statuses are also read-only in the mobile client. Authorised GWMB administrators can update `opportunity_applications.status` in Supabase to `under_review`, `successful` or `unsuccessful`; the member will see that update in **My Applications**.
