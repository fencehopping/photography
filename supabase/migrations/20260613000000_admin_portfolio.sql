create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('nickholroyd@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(auth.jwt() ->> 'email')
  );
$$;

create table if not exists public.categories (
  name text primary key,
  created_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(trim(name)) > 0)
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt text,
  category text not null references public.categories(name) on update cascade,
  storage_path text not null unique,
  featured boolean not null default false,
  location text,
  date date,
  camera text,
  lens text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint photos_title_not_blank check (length(trim(title)) > 0),
  constraint photos_storage_path_not_blank check (length(trim(storage_path)) > 0)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at
before update on public.photos
for each row
execute function public.set_updated_at();

insert into public.categories (name)
values
  ('Weddings'),
  ('Portraits'),
  ('Families'),
  ('Lifestyle'),
  ('Events')
on conflict (name) do nothing;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.photos enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories"
on public.categories
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
on public.categories
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Anyone can read photos" on public.photos;
create policy "Anyone can read photos"
on public.photos
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert photos" on public.photos;
create policy "Admins can insert photos"
on public.photos
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update photos" on public.photos;
create policy "Admins can update photos"
on public.photos
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete photos" on public.photos;
create policy "Admins can delete photos"
on public.photos
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read portfolio images" on storage.objects;
create policy "Anyone can read portfolio images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-images');

drop policy if exists "Admins can upload portfolio images" on storage.objects;
create policy "Admins can upload portfolio images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "Admins can update portfolio images" on storage.objects;
create policy "Admins can update portfolio images"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-images' and public.is_admin())
with check (bucket_id = 'portfolio-images' and public.is_admin());

drop policy if exists "Admins can delete portfolio images" on storage.objects;
create policy "Admins can delete portfolio images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-images' and public.is_admin());
