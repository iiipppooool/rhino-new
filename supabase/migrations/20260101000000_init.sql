-- VRhino schema: profiles, posts, enquiries, rate limiting, storage.
-- Every table has RLS enabled and a default-deny posture: nothing is readable
-- or writable unless a policy below explicitly allows it.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('admin', 'editor');

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  role        public.user_role not null default 'editor',
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Staff check lives in a SECURITY DEFINER function so policies on `profiles`
-- do not recurse into `profiles`. search_path is pinned so the function cannot
-- be hijacked by a caller-controlled schema.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid()
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke execute on function public.is_staff() from public, anon;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "profiles: admins read all"
  on public.profiles for select to authenticated
  using (public.is_admin());

create policy "profiles: admins write"
  on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create type public.post_status as enum ('draft', 'published');

create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  body            jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  cover_image_url text,
  tags            text[] not null default '{}',
  status          public.post_status not null default 'draft',
  published_at    timestamptz,
  author_id       uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint posts_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  -- A published post must have a published_at, so public ordering is never null.
  constraint posts_published_has_date check (status <> 'published' or published_at is not null)
);

create index posts_public_idx on public.posts (published_at desc) where status = 'published';
create index posts_tags_idx on public.posts using gin (tags);

alter table public.posts enable row level security;

-- The only thing the public may see: published posts, and only once their
-- publish date has actually arrived (so scheduling cannot leak early).
create policy "posts: public reads published"
  on public.posts for select to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "posts: staff read all"
  on public.posts for select to authenticated
  using (public.is_staff());

create policy "posts: staff insert"
  on public.posts for insert to authenticated
  with check (public.is_staff());

create policy "posts: staff update"
  on public.posts for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "posts: staff delete"
  on public.posts for delete to authenticated
  using (public.is_staff());

create or replace function public.touch_updated_at()
returns trigger language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- enquiries
-- ---------------------------------------------------------------------------
create type public.enquiry_type   as enum ('prebook', 'service', 'general');
create type public.enquiry_status as enum ('new', 'replied', 'booked', 'closed');

create table public.enquiries (
  id               uuid primary key default gen_random_uuid(),
  type             public.enquiry_type not null,
  name             text not null,
  email            text not null,
  phone            text,
  organisation     text,
  service          text,
  preferred_date   date,
  backup_date      date,
  start_time       time,
  group_size       integer,
  age_range        text,
  venue_postcode   text,
  source           text,
  message          text not null,
  over18_or_org    boolean not null,
  privacy_accepted boolean not null,
  marketing_opt_in boolean not null default false,
  status           public.enquiry_status not null default 'new',
  internal_notes   text,
  created_at       timestamptz not null default now(),
  -- The consent boxes are required by the form. Enforce it in the database too,
  -- so a bad write can never create a record without them.
  constraint enquiries_consent check (over18_or_org and privacy_accepted),
  constraint enquiries_group_size_sane check (group_size is null or (group_size > 0 and group_size <= 10000))
);

create index enquiries_triage_idx on public.enquiries (status, created_at desc);

alter table public.enquiries enable row level security;

-- Deliberately NO anon policy. The brief said the public may INSERT through a
-- validated server action; granting anon INSERT would also expose the table to
-- the public REST endpoint, where anyone could flood it directly and bypass
-- validation, Turnstile and rate limiting. The server action uses the
-- service-role key instead, which is server-only and bypasses RLS.
create policy "enquiries: staff read"
  on public.enquiries for select to authenticated
  using (public.is_staff());

create policy "enquiries: staff update"
  on public.enquiries for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy "enquiries: admins delete"
  on public.enquiries for delete to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- rate limiting
-- Serverless functions do not share memory, so the limiter lives in Postgres.
-- Written only by the service role from the server action.
-- ---------------------------------------------------------------------------
create table public.rate_limits (
  bucket      text not null,
  identifier  text not null,
  hits        integer not null default 0,
  window_start timestamptz not null default now(),
  primary key (bucket, identifier)
);

alter table public.rate_limits enable row level security;
-- No policies at all: service role only.

create or replace function public.bump_rate_limit(
  p_bucket text,
  p_identifier text,
  p_limit integer,
  p_window interval
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_hits integer;
begin
  insert into public.rate_limits as r (bucket, identifier, hits, window_start)
  values (p_bucket, p_identifier, 1, now())
  on conflict (bucket, identifier) do update
    set hits = case when r.window_start < now() - p_window then 1 else r.hits + 1 end,
        window_start = case when r.window_start < now() - p_window then now() else r.window_start end
  returning r.hits into v_hits;

  return v_hits <= p_limit;  -- true means allowed
end;
$$;

revoke execute on function public.bump_rate_limit(text, text, integer, interval) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- storage: blog-images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "blog-images: public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'blog-images');

create policy "blog-images: staff upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images' and public.is_staff());

create policy "blog-images: staff update"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images' and public.is_staff());

create policy "blog-images: staff delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images' and public.is_staff());
